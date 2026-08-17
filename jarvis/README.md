# Jarvis Web

Next.js app — assistente de voz **cloud-first** (Gemini / OpenAI), com path OSS local opcional.

**Estado performance (2026-08):** Fase **A** (percepção) e Fase **B** (pipeline) ✅ — ver [`docs/runbook-dev-perf.md`](docs/runbook-dev-perf.md) e [`../Arquitetura_V2/plano-performance-ux.md`](../Arquitetura_V2/plano-performance-ux.md).  
**Próximo:** Fase **C** (voz premium / Realtime opcional) · Fase **D** (FE snappy).

## Stack (alvo cloud)

| Camada | Default cloud | Alternativa |
|--------|---------------|-------------|
| STT / LLM / TTS | **Gemini full** ou **OpenAI full** | `*-llm` (STT/TTS no browser) |
| Stream voz | `/api/voice/stream` (NDJSON frase-a-frase) | `/api/voice/turn` (single-shot) |
| RAG | pgvector Supabase + lexical + keyword local | fallback índice in-memory |
| Cache | Redis semântico (exact + cosine) | miss → LLM |
| Auth | Supabase (Google OAuth + email) | `VOICE_DEV_MODE=true` bypass |
| Local (legado) | Ollama + Whisper + Piper | `INFERENCE_PROVIDER=local` |

Router LLM (**B5**): Gemini Flash default; OpenAI em intents difíceis / premium. Fallback Gemini↔OpenAI (**B7**).

## Setup

```bash
cd Jarvis/web
cp ../.env.local.example .env.local   # ou use .env.local já configurado
npm install
npm run dev
# em outro terminal, após "Ready":
npm run warm
```

Abra [http://localhost:3000/app](http://localhost:3000/app).

> **A7 — Dev ≠ prod:** o 1º hit no `next dev` compila a rota. Isso **não** é latência do produto. Rode `npm run warm`, ou valide com `npm run build && npm run start`. Detalhes: [`docs/runbook-dev-perf.md`](docs/runbook-dev-perf.md).

### Env essenciais (cloud)

```env
INFERENCE_PROVIDER=gemini          # ou openai | gemini-llm | openai-llm | local
GEMINI_API_KEY=...
# OPENAI_API_KEY=...               # router hard + fallback B7
REDIS_URL=...                      # cache semântico B4
VOICE_STREAMING=true               # default ON; false → só /turn
VOICE_DEV_MODE=true                # false exige login Supabase
```

Outros (performance): `LLM_ROUTER_ENABLED`, `LLM_TTFT_TIMEOUT_MS`, `LLM_TIMEOUT_MS`, `LLM_FALLBACK_ENABLED`, `VOICE_TTS_CONCURRENCY`, `VOICE_MIN_FLUSH_CHARS`, `SEMANTIC_CACHE_REQUIRED` — ver runbook.

### Supabase (auth)

1. Projeto em [supabase.com](https://supabase.com)
2. SQL Editor → migrations em `supabase/migrations/`
3. Auth → Google OAuth (redirect: `http://localhost:3000/auth/callback`)
4. `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` no `.env.local`
5. Produção: `VOICE_DEV_MODE=false`

## Pipeline de voz

```
Wake "Olá Jarvis" → Silero VAD → STT
  → stream NDJSON: transcript cedo (B1)
  → RAG ∥ mem/tasks ∥ cache (B1–B4)
  → LLM (router Flash / OpenAI) → TTS paralelo
  → fila áudio client gap ≤300ms (B6)
```

Fases UX no orb/hint: `transcribing` → `searching` → `thinking` → (`switching`) → `speaking`.

Modo **Manual** (toggle) ignora wake word. Barge-in: fala por cima → para TTS + marca `[interrompido]`.

## Rotas UI

| Rota | Auth | Descrição |
|------|------|-----------|
| `/` | pública | Landing |
| `/auth/login` · `/auth/signup` | pública | Login / cadastro |
| `/onboarding` | login | Microfone |
| `/app` | login* | Interface de voz (orb **2D** produção) |
| `/settings` | login* | Conta, memórias, tarefas |
| `/knowledge` | login* | Fontes RAG |
| `/admin/llm` | admin | Provider, usage, cache hit rate |
| `/showcase/orb` | pública | Orb 2D — galeria de estados |
| `/showcase/orb-v2` | pública | Lab orb 3D líquido (não produção) |

\* Bypass com `VOICE_DEV_MODE=true`

## API

| Rota | Método | Descrição |
|------|--------|-----------|
| `/api/voice/stream` | POST | Stream NDJSON (transcript → text → audio → done) |
| `/api/voice/turn` | POST | Turno single-shot STT→LLM→TTS |
| `/api/voice/speak` | POST | TTS avulso |
| `/api/health/inference` | GET | Health provider / streaming |
| `/api/health/infra` | GET | Redis + semanticCache + Pipecat |
| `/api/rag/query` | POST | Query RAG |
| `/api/rag/reindex` | GET/POST | Status / rebuild |
| `/api/usage` | GET | Minutos / plano |
| `/api/sessions` | POST | start / end sessão |

### Eventos NDJSON (`/api/voice/stream`)

`transcript` · `citations` · `phase` · `text` · `audio` · `assistant` · `done` (`cacheHit`, `cacheKind`, `llmRoute`) · `error`

## Scripts

| Script | Uso |
|--------|-----|
| `npm run dev` | Turbopack |
| `npm run warm` / `warm:wait` | Aquece rotas em dev (A7) |
| `npm run build && npm run start` | UX como prod |
| `npm run lint` | ESLint |

## Documentação

| Doc | Quando |
|-----|--------|
| [docs/runbook-dev-perf.md](docs/runbook-dev-perf.md) | Dev vs prod, cache B4, router B5, TTS B6, fallback B7 |
| [docs/runbook-deploy-staging-azure.md](docs/runbook-deploy-staging-azure.md) | Homol Azure App Service (voz completa, B1+) |
| [docs/runbook-deploy-staging-swa.md](docs/runbook-deploy-staging-swa.md) | Experimento Static Web Apps (Free / Next hybrid) |
| [../Arquitetura_V2/plano-performance-ux.md](../Arquitetura_V2/plano-performance-ux.md) | Backlog A–D (A/B ✅, C/D próximos) |
| [docs/UX-FOURSYS.md](docs/UX-FOURSYS.md) | Design tokens Foursys |
| [docs/e3-barge-in-implementation-brief.md](docs/e3-barge-in-implementation-brief.md) | Barge-in browser |
| [docs/rag-ollama-setup.md](docs/rag-ollama-setup.md) | Embeddings / RAG remoto |
| [../D-Architecture/adrs/014-pipecat-voice-premium-oss.md](../D-Architecture/adrs/014-pipecat-voice-premium-oss.md) | Pipecat vs Realtime (Fase C) |

## Path local / gateway (opcional)

```env
INFERENCE_PROVIDER=local
VOICE_GATEWAY_URL=http://192.168.31.47:8787
```

Gateway FastAPI: `Jarvis/inference-gateway` — STT/LLM/TTS via localhost no host; Next mantém Harness + RAG.

## Próximos passos

- **Fase C** — feedback barge-in &lt;100 ms · deprecar local · embed cloud único · avaliar Realtime/Pipecat  
- **Fase D** — code-split Mermaid/drawers · virtualizar histórico · health backoff  
- Stripe Checkout (US-1.4)
