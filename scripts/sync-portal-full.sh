#!/usr/bin/env bash
#
# sync-portal-full.sh — orquestrador: faz sync do portal upstream + atualiza
# tudo do Jarvis (RAG + FAQ embeddings + TTS pré-cache).
#
# Uso:
#   npm run sync:portal:full
#
# Fluxo:
#   1. Roda scripts/sync-portal-upstream.sh (cria branch, faz merge, valida build)
#   2. Espera você mergear em master + push (mostra os comandos)
#   3. Roda scripts/refresh-jarvis-knowledge.sh (reindex + faq embed + tts cache)
#
# Se qualquer passo falhar, aborta e mostra o que rodar manualmente.

set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

if [ -t 1 ]; then
  C_BLUE='\033[0;34m'; C_GREEN='\033[0;32m'; C_YELLOW='\033[0;33m'
  C_BOLD='\033[1m'; C_RESET='\033[0m'
else
  C_BLUE=''; C_GREEN=''; C_YELLOW=''; C_BOLD=''; C_RESET=''
fi

printf "\n${C_BOLD}════════════════════════════════════════════════════════════════${C_RESET}\n"
printf "${C_BOLD}  SYNC PORTAL FULL — atualiza monorepo v2 + Jarvis knowledge${C_RESET}\n"
printf "${C_BOLD}════════════════════════════════════════════════════════════════${C_RESET}\n"

printf "\n${C_BLUE}FASE 1/2 — sync do portal/ com upstream${C_RESET}\n"
bash "$SCRIPT_DIR/sync-portal-upstream.sh"

echo ""
echo "════════════════════════════════════════════════════════════════"
printf "${C_YELLOW}${C_BOLD}CHECKPOINT${C_RESET} — antes de continuar, mergeie o branch de sync em master:\n"
echo ""
echo "    git checkout master"
echo "    git merge --no-ff sync/portal-\$(date +%Y-%m-%d) -m \"merge: sync portal/ com upstream\""
echo "    git push origin master"
echo ""
read -r -p "Já mergeou em master e pushou? [y/N] " r
if [[ ! "$r" =~ ^[Yy] ]]; then
  echo ""
  printf "${C_YELLOW}Abortado.${C_RESET} Quando tiver mergeado, rode manualmente:\n"
  echo "    bash scripts/refresh-jarvis-knowledge.sh"
  exit 0
fi

printf "\n${C_BLUE}FASE 2/2 — refresh do conhecimento do Jarvis${C_RESET}\n"
bash "$SCRIPT_DIR/refresh-jarvis-knowledge.sh"

printf "\n${C_GREEN}${C_BOLD}✓ Sync full completo.${C_RESET} Portal atualizado + Jarvis re-sincronizado.\n\n"
