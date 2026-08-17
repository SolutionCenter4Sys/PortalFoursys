#!/usr/bin/env bash
#
# refresh-jarvis-knowledge.sh — atualiza as 3 camadas de conhecimento do Jarvis.
#
# Quando rodar:
#   - Depois de `sync:portal` (upstream trouxe conteúdo novo → RAG precisa reindexar)
#   - Depois de editar `jarvis/src/lib/portal/institutional-faq.ts` (FAQ mudou)
#   - Depois de trocar voz/model/speed/instructions do TTS (cache invalida)
#
# O que faz:
#   1. RAG reindex          — puxa upstream do GitHub → pgvector Supabase
#   2. FAQ embeddings       — regenera os 24 vetores in-memory do FAQ
#   3. TTS pré-cache        — sintetiza frases das respostas FAQ no Redis
#
# Flags:
#   --skip-rag              pula reindex do RAG (custa segundos, raramente falha)
#   --skip-faq              pula rebuild dos embeddings do FAQ
#   --skip-tts              pula reseed do TTS (custa ~$0.02 e ~30s)
#
# Custo (worst case, tudo executado): ~$0.02 + ~2 min de wall-clock.

set -euo pipefail

SKIP_RAG=false
SKIP_FAQ=false
SKIP_TTS=false
for arg in "$@"; do
  case "$arg" in
    --skip-rag) SKIP_RAG=true ;;
    --skip-faq) SKIP_FAQ=true ;;
    --skip-tts) SKIP_TTS=true ;;
    -h|--help) sed -n '2,25p' "$0"; exit 0 ;;
  esac
done

if [ -t 1 ]; then
  C_BLUE='\033[0;34m'; C_GREEN='\033[0;32m'; C_YELLOW='\033[0;33m'
  C_RED='\033[0;31m'; C_BOLD='\033[1m'; C_RESET='\033[0m'
else
  C_BLUE=''; C_GREEN=''; C_YELLOW=''; C_RED=''; C_BOLD=''; C_RESET=''
fi

step() { printf "\n${C_BLUE}${C_BOLD}▸ %s${C_RESET}\n" "$*"; }
ok()   { printf "${C_GREEN}✓${C_RESET} %s\n" "$*"; }
warn() { printf "${C_YELLOW}!${C_RESET} %s\n" "$*"; }
die()  { printf "${C_RED}✗ %s${C_RESET}\n" "$*" >&2; exit 1; }

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || die "não está num repo git"
cd "$REPO_ROOT"

[ -d "jarvis" ] || die "pasta jarvis/ não existe"
[ -f "jarvis/.env.local" ] || warn "jarvis/.env.local não existe — scripts podem falhar sem GEMINI_API_KEY/REDIS_URL"

TOTAL_START=$(date +%s)

# ── 1. RAG reindex ───────────────────────────────────────────────────────────
if $SKIP_RAG; then
  warn "--skip-rag: pulando reindex RAG"
else
  step "1/3 — RAG reindex (Portal upstream → pgvector Supabase)"
  START=$(date +%s)
  if npm --prefix ./jarvis run reindex 2>&1 | tail -20; then
    ok "reindex concluído em $(($(date +%s) - START))s"
  else
    die "reindex falhou — verifique GEMINI_API_KEY, SUPABASE_SERVICE_ROLE_KEY, RAG_PORTAL_REPO"
  fi
fi

# ── 2. FAQ embeddings ────────────────────────────────────────────────────────
if $SKIP_FAQ; then
  warn "--skip-faq: pulando rebuild de embeddings do FAQ"
else
  step "2/3 — FAQ embeddings (24 vetores in-memory)"
  START=$(date +%s)
  if npm --prefix ./jarvis run build:faq-embeddings 2>&1 | tail -10; then
    ok "embeddings gerados em $(($(date +%s) - START))s → jarvis/src/lib/portal/institutional-faq.embeddings.json"
  else
    die "build:faq-embeddings falhou — verifique GEMINI_API_KEY"
  fi
fi

# ── 3. TTS pré-cache ─────────────────────────────────────────────────────────
if $SKIP_TTS; then
  warn "--skip-tts: pulando reseed do TTS"
else
  step "3/3 — TTS pré-cache (síntese das respostas FAQ no Redis)"
  START=$(date +%s)
  if npm --prefix ./jarvis run seed:portal-tts 2>&1 | tail -10; then
    ok "TTS pré-cache concluído em $(($(date +%s) - START))s"
  else
    warn "seed:portal-tts falhou — verifique REDIS_URL + OPENAI_API_KEY"
    warn "não é fatal: Jarvis ainda funciona, só perde a otimização de FAQ hit → cached TTS"
  fi
fi

step "Refresh completo em $(($(date +%s) - TOTAL_START))s"

cat <<EOF

Camadas do Jarvis atualizadas:
  ${C_GREEN}✓${C_RESET} RAG (pgvector Supabase)         → cobre TODO o Portal, atualiza a cada reindex
  ${C_GREEN}✓${C_RESET} FAQ embeddings (24 vetores)     → matching semântico rápido
  ${C_GREEN}✓${C_RESET} TTS pré-cache (Redis)           → FAQ hit responde em ~1s (sem síntese)

Não esqueça:
  ${C_YELLOW}!${C_RESET} FAQ e brief hardcoded (institutional-faq.ts / portal-brief.ts) NÃO são
    atualizados automaticamente. Se o Portal mudou algo importante nesses tópicos
    (novos números, nova região, etc), edite os arquivos manualmente antes de rodar
    este script.

EOF
