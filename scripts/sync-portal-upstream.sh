#!/usr/bin/env bash
#
# sync-portal-upstream.sh — sincroniza portal/ com o repo upstream PortalFoursys.
#
# Uso:
#   ./scripts/sync-portal-upstream.sh                # sync completo (interativo)
#   ./scripts/sync-portal-upstream.sh --dry-run      # só mostra o que viria, não altera nada
#   ./scripts/sync-portal-upstream.sh --no-build     # pula o teste de build no final
#
# O que o script faz:
#   1. Verifica que o working tree está limpo (aborta se houver mudanças)
#   2. Adiciona o remote portal-upstream (se não existir)
#   3. Fetch main do upstream
#   4. Mostra novos commits desde a última sincronização
#   5. Cria branch sync/portal-YYYY-MM-DD
#   6. Faz git merge -X subtree=portal com --allow-unrelated-histories
#   7. Resolve conflitos com as regras "v2 wins":
#      - portal/vite.config.ts (mantém proxy do monorepo)
#      - portal/src/components/jarvis/** (permanece deletado — Jarvis vive em ../jarvis/)
#      - todos os outros conflitos: aceita versão do upstream (theirs)
#   8. Testa `npm --prefix portal run build`
#   9. Se OK, orienta merge em master + push
#
# Rollback: se algo der errado, o branch de sync fica isolado.
# `git checkout master && git branch -D sync/portal-YYYY-MM-DD` desfaz tudo.

set -euo pipefail

UPSTREAM_URL="https://github.com/SolutionCenter4Sys/PortalFoursys.git"
UPSTREAM_REMOTE="portal-upstream"
UPSTREAM_BRANCH="main"
SYNC_PREFIX="portal"
BRANCH_NAME="sync/portal-$(date +%Y-%m-%d)"

# Flags
DRY_RUN=false
SKIP_BUILD=false
for arg in "$@"; do
  case "$arg" in
    --dry-run)  DRY_RUN=true ;;
    --no-build) SKIP_BUILD=true ;;
    -h|--help)
      sed -n '2,30p' "$0"; exit 0 ;;
  esac
done

# ── Cores (fallback pra sem cor se não for TTY) ──────────────────────────────
if [ -t 1 ]; then
  C_BLUE='\033[0;34m'; C_GREEN='\033[0;32m'; C_YELLOW='\033[0;33m'
  C_RED='\033[0;31m'; C_BOLD='\033[1m'; C_RESET='\033[0m'
else
  C_BLUE=''; C_GREEN=''; C_YELLOW=''; C_RED=''; C_BOLD=''; C_RESET=''
fi

step()  { printf "\n${C_BLUE}${C_BOLD}▸ %s${C_RESET}\n" "$*"; }
ok()    { printf "${C_GREEN}✓${C_RESET} %s\n" "$*"; }
warn()  { printf "${C_YELLOW}!${C_RESET} %s\n" "$*"; }
die()   { printf "${C_RED}✗ %s${C_RESET}\n" "$*" >&2; exit 1; }

# ── 1. Sanity checks ─────────────────────────────────────────────────────────
step "1/6 — sanity checks"

command -v git >/dev/null || die "git não encontrado no PATH"

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || die "não está num repo git"
cd "$REPO_ROOT"

[ -d "portal" ] || die "pasta portal/ não existe (rode do repo v2)"

if ! git diff-index --quiet HEAD --; then
  git status --short
  die "working tree tem mudanças não-commitadas — commit ou stash antes"
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "master" ] && [ "$CURRENT_BRANCH" != "main" ]; then
  warn "você está no branch '$CURRENT_BRANCH' — o normal é rodar da master"
  read -r -p "Continuar mesmo assim? [y/N] " r; [[ "$r" =~ ^[Yy] ]] || exit 0
fi

ok "working tree limpo, branch $CURRENT_BRANCH"

# ── 2. Remote upstream ───────────────────────────────────────────────────────
step "2/6 — remote upstream"

if git remote get-url "$UPSTREAM_REMOTE" >/dev/null 2>&1; then
  EXISTING_URL=$(git remote get-url "$UPSTREAM_REMOTE")
  if [ "$EXISTING_URL" != "$UPSTREAM_URL" ]; then
    die "remote '$UPSTREAM_REMOTE' aponta pra $EXISTING_URL (esperado $UPSTREAM_URL)"
  fi
  ok "remote $UPSTREAM_REMOTE já configurado"
else
  if $DRY_RUN; then
    warn "[dry-run] pularia: git remote add $UPSTREAM_REMOTE $UPSTREAM_URL"
  else
    git remote add "$UPSTREAM_REMOTE" "$UPSTREAM_URL"
    ok "remote $UPSTREAM_REMOTE adicionado"
  fi
fi

git fetch "$UPSTREAM_REMOTE" "$UPSTREAM_BRANCH" 2>&1 | tail -3
ok "fetch $UPSTREAM_REMOTE/$UPSTREAM_BRANCH"

# ── 3. Preview de novidades ──────────────────────────────────────────────────
step "3/6 — o que vem do upstream"

# Busca o último commit do upstream que já foi mergeado (via subtree/merge)
# procurando pela mensagem "sync(portal)" ou "bootstrap subtree" no log de master.
LAST_SYNC=$(git log master --grep="sync(portal)\|bootstrap subtree" --pretty=%H -n 1 2>/dev/null || echo "")
if [ -n "$LAST_SYNC" ]; then
  echo "Último sync em master: $(git log -1 --format='%h  %s' $LAST_SYNC)"
fi

echo ""
echo "Commits em $UPSTREAM_REMOTE/$UPSTREAM_BRANCH:"
git log "$UPSTREAM_REMOTE/$UPSTREAM_BRANCH" --oneline -10

echo ""
NEW_COUNT=$(git rev-list --count "master..$UPSTREAM_REMOTE/$UPSTREAM_BRANCH" 2>/dev/null || echo "?")
FILES_CHANGED=$(git diff --stat "master:portal" "$UPSTREAM_REMOTE/$UPSTREAM_BRANCH" 2>/dev/null | tail -1 || echo "")
echo "Diff atual portal/ (v2) vs upstream/$UPSTREAM_BRANCH:"
echo "  $FILES_CHANGED"

if $DRY_RUN; then
  ok "dry-run: nada mais a fazer. Reste sem --dry-run pra sincronizar."
  exit 0
fi

read -r -p "Prosseguir com o merge? [Y/n] " r; [[ "$r" =~ ^[Nn] ]] && exit 0

# ── 4. Branch + merge ────────────────────────────────────────────────────────
step "4/6 — cria branch $BRANCH_NAME e merge"

git checkout -b "$BRANCH_NAME"

set +e
git merge -X subtree=portal --squash --allow-unrelated-histories "$UPSTREAM_REMOTE/$UPSTREAM_BRANCH"
MERGE_EXIT=$?
set -e

# Independente do exit (pode ter conflitos), continua pra resolver
if [ $MERGE_EXIT -ne 0 ]; then
  warn "merge parou com conflitos — vou aplicar as regras v2 wins agora"
fi

# ── 5. Resolver conflitos com regras v2 wins ────────────────────────────────
step "5/6 — resolvendo conflitos (v2 wins onde aplicável)"

# 5a. vite.config.ts: SEMPRE v2 wins (proxy do monorepo)
if git diff --name-only --diff-filter=U | grep -qxF "portal/vite.config.ts"; then
  git checkout --ours portal/vite.config.ts
  ok "portal/vite.config.ts → v2 wins (proxy /api /embed /vad /_next preservado)"
fi

# 5b. Todos os outros conflitos: theirs (upstream wins)
REMAINING=$(git diff --name-only --diff-filter=U | grep -E "^portal/" || true)
if [ -n "$REMAINING" ]; then
  echo "$REMAINING" | xargs git checkout --theirs
  echo "$REMAINING" | wc -l | xargs -I{} ok "{} arquivos resolvidos com upstream (theirs)"
fi

# 5c. Preservar arquivos "v2-only" que o upstream não tem e que o merge pode
#     acabar removendo. Restaura do último commit da master que contenha eles.
#     ATENÇÃO: portal/src/components/jarvis/** é integração do Jarvis embarcado
#     (JarvisLaunchButton no TopBar, JarvisOverlay no App). NÃO REMOVER.
V2_ONLY_PATHS=(
  "portal/src/components/jarvis"
  "portal/src/types/speech.d.ts"
  "portal/src/components/navigation/TopBar.tsx"
  "portal/src/App.tsx"
)
for path in "${V2_ONLY_PATHS[@]}"; do
  if ! git ls-tree -r HEAD -- "$path" >/dev/null 2>&1 || [ -z "$(git ls-tree -r HEAD -- "$path")" ]; then
    # Arquivo/pasta sumiu — busca último commit em master que tinha e restaura.
    last_commit=$(git log master --pretty=%H -n 1 -- "$path" 2>/dev/null || echo "")
    if [ -n "$last_commit" ]; then
      git checkout "$last_commit" -- "$path" 2>&1 | tail -2
      git add "$path"
      ok "restaurado v2-only: $path (de $last_commit)"
    fi
  fi
done

# Stage do restante (arquivos novos, modificados sem conflito)
git add -A

# Verificar que zerou os conflitos
STILL=$(git diff --name-only --diff-filter=U || true)
if [ -n "$STILL" ]; then
  die "AINDA existem conflitos:\n$STILL\nResolva manualmente e faça 'git add -A && git commit'"
fi

ok "todos os conflitos resolvidos"

# ── 6. Commit + validação de build ───────────────────────────────────────────
step "6/6 — commit + validação de build"

UPSTREAM_HEAD=$(git rev-parse --short "$UPSTREAM_REMOTE/$UPSTREAM_BRANCH")

git commit -m "sync(portal): pull upstream PortalFoursys/$UPSTREAM_BRANCH ($UPSTREAM_HEAD)

Trazido do upstream automaticamente via scripts/sync-portal-upstream.sh.

Regras v2 wins aplicadas:
- portal/vite.config.ts (mantém proxy /api /embed /vad /_next)
- portal/src/components/jarvis/** removido (Jarvis vive em ../jarvis/)

Ver commits do upstream: git log ${UPSTREAM_REMOTE}/${UPSTREAM_BRANCH}"

ok "commit criado"

if $SKIP_BUILD; then
  warn "--no-build: pulando teste de build"
else
  echo ""
  echo "Rodando build do portal (pode levar ~30s)..."
  cd portal
  if ! npm install --silent 2>&1 | tail -3; then
    warn "npm install teve warnings — verifique acima"
  fi
  if ! npx vite build 2>&1 | tail -15; then
    warn "BUILD FALHOU — provavelmente novo tamanho do bundle ou nova dep."
    warn "Ajuste vite.config.ts ou package.json e rode 'npx vite build' manualmente."
    warn "Depois volte aqui e continue: git checkout master && git merge --no-ff $BRANCH_NAME"
    exit 1
  fi
  cd ..
  ok "build passou"
fi

# ── Finalização ──────────────────────────────────────────────────────────────
step "Concluído — próximos passos manuais"

cat <<EOF

Branch de sync: ${C_BOLD}$BRANCH_NAME${C_RESET}
Upstream:       ${C_BOLD}$UPSTREAM_REMOTE/$UPSTREAM_BRANCH @ $UPSTREAM_HEAD${C_RESET}

Para mergear em master e enviar:

    git checkout master
    git merge --no-ff $BRANCH_NAME -m "merge: sync portal/ com upstream"
    git push origin master
    git branch -d $BRANCH_NAME

Para descartar tudo (rollback):

    git checkout master
    git branch -D $BRANCH_NAME

EOF
