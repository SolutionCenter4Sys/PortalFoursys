# sync-portal-upstream.ps1 — versão PowerShell do sync do portal/ com upstream.
#
# Uso:
#   .\scripts\sync-portal-upstream.ps1                # sync completo
#   .\scripts\sync-portal-upstream.ps1 -DryRun        # só mostra o que viria
#   .\scripts\sync-portal-upstream.ps1 -SkipBuild     # pula build no final
#
# Faz o mesmo que sync-portal-upstream.sh (leia lá para detalhes das regras).

param(
  [switch]$DryRun,
  [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'

$UpstreamUrl    = 'https://github.com/SolutionCenter4Sys/PortalFoursys.git'
$UpstreamRemote = 'portal-upstream'
$UpstreamBranch = 'main'
$BranchName     = "sync/portal-$(Get-Date -Format 'yyyy-MM-dd')"

function Step($msg) { Write-Host "`n▸ $msg" -ForegroundColor Blue }
function OK($msg)   { Write-Host "✓ $msg"   -ForegroundColor Green }
function Warn($msg) { Write-Host "! $msg"   -ForegroundColor Yellow }
function Die($msg)  { Write-Host "✗ $msg"   -ForegroundColor Red; exit 1 }

# 1. Sanity
Step '1/6 — sanity checks'
$repoRoot = (git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) { Die 'não está num repo git' }
Set-Location $repoRoot
if (-not (Test-Path 'portal')) { Die 'pasta portal/ não existe' }
git diff-index --quiet HEAD --
if ($LASTEXITCODE -ne 0) {
  git status --short
  Die 'working tree tem mudanças não-commitadas — commit ou stash antes'
}
$currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($currentBranch -ne 'master' -and $currentBranch -ne 'main') {
  Warn "você está no branch '$currentBranch' — o normal é rodar da master"
  $r = Read-Host 'Continuar mesmo assim? [y/N]'
  if ($r -notmatch '^[Yy]') { exit 0 }
}
OK "working tree limpo, branch $currentBranch"

# 2. Remote upstream
Step '2/6 — remote upstream'
$existing = (git remote get-url $UpstreamRemote 2>$null)
if ($LASTEXITCODE -eq 0) {
  if ($existing.Trim() -ne $UpstreamUrl) {
    Die "remote '$UpstreamRemote' aponta pra $existing (esperado $UpstreamUrl)"
  }
  OK "remote $UpstreamRemote já configurado"
} else {
  if ($DryRun) { Warn "[dry-run] pularia: git remote add $UpstreamRemote $UpstreamUrl" }
  else {
    git remote add $UpstreamRemote $UpstreamUrl
    OK "remote $UpstreamRemote adicionado"
  }
}
git fetch $UpstreamRemote $UpstreamBranch 2>&1 | Select-Object -Last 3
OK "fetch $UpstreamRemote/$UpstreamBranch"

# 3. Preview
Step '3/6 — o que vem do upstream'
$lastSync = (git log master --grep='sync\(portal\)\|bootstrap subtree' --pretty=%H -n 1 2>$null)
if ($lastSync) {
  Write-Host "Último sync em master: $(git log -1 --format='%h  %s' $lastSync)"
}
Write-Host "`nCommits em ${UpstreamRemote}/${UpstreamBranch}:"
git log "$UpstreamRemote/$UpstreamBranch" --oneline -10
Write-Host ''
$filesChanged = (git diff --stat "master:portal" "$UpstreamRemote/$UpstreamBranch" 2>$null | Select-Object -Last 1)
Write-Host "Diff atual portal/ (v2) vs upstream/${UpstreamBranch}:"
Write-Host "  $filesChanged"

if ($DryRun) { OK 'dry-run: nada mais a fazer. Rerode sem -DryRun.'; exit 0 }
$r = Read-Host 'Prosseguir com o merge? [Y/n]'
if ($r -match '^[Nn]') { exit 0 }

# 4. Branch + merge
Step "4/6 — cria branch $BranchName e merge"
git checkout -b $BranchName
git merge -X subtree=portal --squash --allow-unrelated-histories "$UpstreamRemote/$UpstreamBranch"
if ($LASTEXITCODE -ne 0) {
  Warn 'merge parou com conflitos — vou aplicar as regras v2 wins agora'
}

# 5. Resolver conflitos
Step '5/6 — resolvendo conflitos (v2 wins onde aplicável)'
$conflicts = (git diff --name-only --diff-filter=U)
if ($conflicts -contains 'portal/vite.config.ts') {
  git checkout --ours portal/vite.config.ts
  OK 'portal/vite.config.ts → v2 wins (proxy preservado)'
}
$remaining = $conflicts | Where-Object { $_ -like 'portal/*' -and $_ -ne 'portal/vite.config.ts' }
if ($remaining) {
  $remaining | ForEach-Object { git checkout --theirs $_ }
  OK "$($remaining.Count) arquivos resolvidos com upstream (theirs)"
}
if (Test-Path 'portal/src/components/jarvis') {
  git rm -rf portal/src/components/jarvis 2>&1 | Select-Object -Last 3
  OK 'portal/src/components/jarvis/** removido (Jarvis vive em ../jarvis/)'
}
git add -A
$still = (git diff --name-only --diff-filter=U)
if ($still) { Die "AINDA existem conflitos:`n$still`nResolva manualmente." }
OK 'todos os conflitos resolvidos'

# 6. Commit + build
Step '6/6 — commit + validação de build'
$upstreamHead = (git rev-parse --short "$UpstreamRemote/$UpstreamBranch").Trim()
git commit -m @"
sync(portal): pull upstream PortalFoursys/$UpstreamBranch ($upstreamHead)

Trazido do upstream via scripts/sync-portal-upstream.ps1.

Regras v2 wins:
- portal/vite.config.ts (proxy do monorepo)
- portal/src/components/jarvis/** removido (Jarvis vive em ../jarvis/)
"@
OK 'commit criado'

if ($SkipBuild) { Warn '-SkipBuild: pulando teste de build' }
else {
  Write-Host "`nRodando build do portal..."
  Push-Location portal
  npm install --silent 2>&1 | Select-Object -Last 3
  npx vite build 2>&1 | Select-Object -Last 15
  $buildExit = $LASTEXITCODE
  Pop-Location
  if ($buildExit -ne 0) {
    Warn 'BUILD FALHOU — ajuste config/deps e rode manualmente.'
    exit 1
  }
  OK 'build passou'
}

Step 'Concluído — próximos passos manuais'
Write-Host @"

Branch: $BranchName
Upstream: $UpstreamRemote/$UpstreamBranch @ $upstreamHead

Para mergear em master:
    git checkout master
    git merge --no-ff $BranchName -m "merge: sync portal/ com upstream"
    git push origin master
    git branch -d $BranchName

Para descartar (rollback):
    git checkout master
    git branch -D $BranchName

"@
