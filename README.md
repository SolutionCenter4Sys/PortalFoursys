# Portal Foursys + Jarvis (monorepo)

> **Branch:** `feature/portal-jarvis`  
> **Objetivo:** unificar o Portal institucional e o assistente de voz Jarvis no mesmo repositório, para a esteira DevOps existente do `PortalFoursys` passar a apontar para esta branch (em vez de `main` flat).  
> **Espelho de produto:** conteúdo e integração alinhados ao monorepo [PortalFoursysV2](https://github.com/SolutionCenter4Sys/PortalFoursysV2).

---

## Por que esta branch existe

| Branch | Layout | Uso |
|---|---|---|
| `main` | SPA flat (`src/` na raiz) | Portal “só conteúdo” — esteira atual |
| **`feature/portal-jarvis`** | Monorepo `portal/` + `jarvis/` | Portal **com** Jarvis embutido — **apontar a esteira aqui** |

A esteira DevOps **não precisa ser reescrita do zero**: basta mudar o branch de origem e ajustar os paths de build/artefato conforme a seção [Deploy (guia para DevOps)](#deploy-guia-para-devops). A configuração do GitHub Actions fica a cargo do time de infra.

---

## Arquitetura (visão rápida)

```
Browser
  └─ Portal (Vite SPA)  :4001
       ├─ conteúdo institucional (seções, cases, portfolio…)
       └─ iframe /embed ──proxy──► Jarvis (Next.js) :3000
                                      ├─ /api/voice/*  (STT → FAQ/RAG → LLM → TTS)
                                      ├─ /api/rag/*
                                      └─ Supabase (pgvector) + Redis + Gemini/OpenAI
```

- **Portal** embute Jarvis via iframe `/embed` + `postMessage` (`jarvis:activate` / `jarvis:ready` / `jarvis:stop`).
- Em **dev**, o Vite do portal faz proxy de `/api`, `/embed`, `/vad`, `/_next` → Jarvis (`JARVIS_BACKEND_URL`, default `http://localhost:3000`).
- Em **produção**, o reverse proxy / CDN / App Service deve espelhar o mesmo contrato de paths (ver Deploy).

---

## Estrutura de pastas

```
.
├── package.json          # orquestra portal + jarvis (concurrently)
├── scripts/              # sync / refresh (opcional em CI)
├── portal/               # SPA institucional (Vite + React 18)
│   ├── src/
│   ├── public/
│   ├── vite.config.ts    # proxy Jarvis em dev
│   └── .env.example      # JARVIS_BACKEND_URL
└── jarvis/               # Backend + UI de voz (Next.js 16)
    ├── src/
    ├── supabase/         # migrations (pgvector, llm_*, etc.)
    └── .env.example      # chaves cloud (NÃO commitar .env.local)
```

---

## Requisitos

- **Node.js 22.x** (obrigatório para o Jarvis; ver `jarvis/package.json` → `engines`)
- npm 10+
- Contas/serviços:
  - Google Gemini (`GEMINI_API_KEY`) — LLM + embeddings
  - OpenAI (`OPENAI_API_KEY`) — STT + TTS (caminho Portal)
  - Supabase (URL + anon + service role) — RAG/auth
  - Redis (`REDIS_URL`) — cache semântico + TTS (recomendado)

---

## Setup local

```bash
# 1) deps da raiz + dos dois apps
npm run install:all

# 2) env do Jarvis (NUNCA commitar)
cp jarvis/.env.example jarvis/.env.local
# edite jarvis/.env.local com as chaves reais

# 3) env do Portal (opcional em local)
cp portal/.env.example portal/.env
# JARVIS_BACKEND_URL=http://localhost:3000

# 4) sobe os dois juntos
npm run dev
```

| App | URL |
|---|---|
| Portal | http://localhost:4001 |
| Jarvis (standalone) | http://localhost:3000 |
| Jarvis embed (usado pelo Portal) | http://localhost:4001/embed *(via proxy)* |

Scripts úteis:

```bash
npm run dev:portal    # só portal
npm run dev:jarvis    # só jarvis
npm run build         # build jarvis + portal
npm run lint
```

### Warm-up / seeds do Jarvis (primeira vez ou após mudança de FAQ)

```bash
cd jarvis
npm run build:faq-embeddings   # vetores do FAQ institucional
npm run seed:portal-faq        # semantic cache Redis (se REDIS_URL)
npm run seed:portal-tts        # pré-síntese TTS do FAQ (se Redis + OpenAI)
```

Migrations Supabase: aplicar os SQL em `jarvis/supabase/migrations/` no projeto alvo (ordem numérica; há também `000_jarvis_v2_clean_rag.sql` para schema enxuto de RAG).

---

## Deploy (guia para DevOps)

> Este documento **não** cria o GitHub Actions. Serve de contrato para quem for apontar a esteira desta branch.

**Deploy em Docker (recomendado nesta branch):** ver **[DEPLOY.md](DEPLOY.md)** — primeira vez, atualização, TLS e troubleshooting.

```bash
cp .env.docker.example .env.docker   # preencher secrets
npm run docker:deploy                # build + up
```

Sobe Redis → Jarvis → Portal (nginx). O Portal faz proxy de `/api` `/embed` `/vad` `/_next` para o Jarvis (streaming NDJSON sem buffer).

### 1. Mudança de branch na esteira

1. Manter `main` como está (Portal flat legado), **ou** migrar gradualmente.
2. Apontar o pipeline de **produção/homolog do Portal+Jarvis** para:
   - **Repo:** `SolutionCenter4Sys/PortalFoursys`
   - **Branch:** `feature/portal-jarvis`  
     (renomear para `release/portal-jarvis` quando estabilizar, se preferirem)
3. Fonte de verdade espelhada: [PortalFoursysV2](https://github.com/SolutionCenter4Sys/PortalFoursysV2) (`master`).

### 2. Dois artefatos (não é mais um único `dist/` na raiz)

| Artefato | Como gerar | Output |
|---|---|---|
| **Portal (estático)** | `npm --prefix portal ci && npm --prefix portal run build` | `portal/dist/` |
| **Jarvis (Node standalone)** | `npm --prefix jarvis ci && npm --prefix jarvis run build` | `jarvis/.next/standalone/` + assets estáticos do Next |

Build da raiz (equivale aos dois):

```bash
npm ci
npm --prefix portal ci
npm --prefix jarvis ci
npm run build
```

Runtime Jarvis:

```bash
# após copiar static/public conforme docs Next standalone
node jarvis/.next/standalone/server.js
# ou: npm --prefix jarvis run start:standalone
```

### 3. Variáveis de ambiente (produção)

**Portal (build-time / runtime estático):**

| Variável | Uso |
|---|---|
| `JARVIS_BACKEND_URL` | Só em **dev** (proxy Vite). Em prod o browser chama paths relativos `/api` e `/embed` no **mesmo host** (ou CDN com rewrite). |

**Jarvis (runtime Node — secrets no App Service / Key Vault):**

| Grupo | Exemplos (ver `jarvis/.env.example`) |
|---|---|
| LLM / voz | `GEMINI_API_KEY`, `OPENAI_API_KEY`, `INFERENCE_PROVIDER`, `VOICE_*` |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Redis | `REDIS_URL`, `REDIS_ENABLED` |
| Portal embed | `VOICE_EMBED_ANON=true` (visitantes anônimos no iframe) |
| Site | `NEXT_PUBLIC_SITE_URL` (URL pública do Jarvis/host) |

**Não versionar** `.env.local` / secrets.

### 4. Roteamento em produção (contrato obrigatório)

O Portal espera que, no **mesmo domínio** (ou via reverse proxy), existam:

| Path | Destino |
|---|---|
| `/` e assets do SPA | `portal/dist` (fallback SPA → `index.html`) |
| `/embed`, `/embed/*` | Jarvis Next |
| `/api/*` | Jarvis Next |
| `/vad/*` | Jarvis Next (assets Silero VAD) |
| `/_next/*` | Jarvis Next (chunks) |

Exemplo conceitual (nginx / Azure Front Door / Application Gateway — **ilustrativo**):

```
location /api/    → jarvis:3000
location /embed   → jarvis:3000
location /vad/    → jarvis:3000
location /_next/  → jarvis:3000
location /        → portal estático (SPA)
```

Sem esses rewrites, o iframe e as APIs de voz quebram (CORS / 404).

### 5. Health checks sugeridos

```
GET  {jarvis}/api/health/inference
GET  {jarvis}/api/health/infra
GET  {portal}/   (200 + index)
```

### 6. Ordem de subida recomendada

1. Aplicar migrations Supabase (se ambiente novo).
2. Subir Redis acessível pelo Jarvis.
3. Deploy Jarvis (Node 22) com env completo.
4. Smoke: `/api/health/*` e `/embed`.
5. Deploy Portal estático.
6. Validar iframe no Portal (tecla **V** / botão Jarvis) e um turno de voz.

### 7. Node version no agente de CI

- Imagem / toolcache: **Node 22.x**
- Cache separado: `portal/node_modules` e `jarvis/node_modules` (ou `npm ci` em cada prefix)

---

## Sincronização com PortalFoursysV2

Esta branch foi gerada a partir do monorepo V2 (conteúdo do Portal já sincronizado com `main` + integração Jarvis preservada).

Fluxo recomendado de manutenção:

1. Evoluir produto no **PortalFoursysV2** (`master`) **ou** nesta branch — escolher **uma** fonte canônica para evitar drift.
2. Se V2 for canônico: periodicamente espelhar `portal/` + `jarvis/` + `package.json` raiz para cá (PR nesta branch).
3. Conteúdo “só Portal” que entrar em `main` flat deve ser puxado para `portal/` (subtree/sync), **sem** sobrescrever:
   - `portal/vite.config.ts` (proxy)
   - `portal/src/components/jarvis/**`
   - `portal/src/App.tsx` / `TopBar.tsx` (wiring do overlay)

Scripts de sync existem em `scripts/` (herdados do V2); validar em Windows com Git Bash ou o `.ps1` correspondente — **não** usar a regra antiga que apaga `jarvis/` do portal.

---

## Checklist rápido para o time de DevOps

- [ ] Pipeline aponta para `feature/portal-jarvis`
- [ ] Node 22 no runner
- [ ] Build gera `portal/dist` **e** Jarvis standalone
- [ ] Secrets Jarvis injetados no runtime (não no front)
- [ ] Reverse proxy: `/api` `/embed` `/vad` `/_next` → Jarvis; `/` → Portal SPA
- [ ] Health checks verdes
- [ ] Teste manual: abrir Portal → Jarvis → 1 pergunta de voz

---

## Contato / produto

- Monorepo de desenvolvimento espelho: https://github.com/SolutionCenter4Sys/PortalFoursysV2  
- Repo desta esteira: https://github.com/SolutionCenter4Sys/PortalFoursys (`feature/portal-jarvis`)
