# Deploy — PortalFoursys v2 em Docker

Stack: **Portal (Vite/React)** + **Jarvis (Next.js 16)** + **Redis 7**

---

## Arquitetura dos containers

```
┌──────────────────────────────────────────────────────┐
│  Host (Linux/Windows com Docker)                     │
│                                                      │
│   ┌──────────────────────┐                           │
│   │  portal  :80         │  nginx serve estático +   │
│   │  (nginx + Vite dist) │  proxy /api /embed /vad   │
│   └──────────┬───────────┘  /_next → jarvis:3000     │
│              │                                       │
│   ┌──────────▼───────────┐                           │
│   │  jarvis  :3000       │  Next.js standalone       │
│   │  (node server.js)    │  pipeline de voz + RAG    │
│   └──────────┬───────────┘                           │
│              │                                       │
│   ┌──────────▼───────────┐                           │
│   │  redis   :6379       │  cache TTS / semântico    │
│   │  (redis:7-alpine)    │  / sessão quente          │
│   └──────────────────────┘                           │
└──────────────────────────────────────────────────────┘
```

O usuário acessa **porta 80** → nginx entrega o SPA React. Toda chamada ao Jarvis
(`/api/*`, `/embed`, `/vad/*`, `/_next/*`) é transparentemente proxied para o
container `jarvis` na rede Docker interna.

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Docker Engine | 25+ |
| Docker Compose (plugin) | v2.20+ |
| Acesso de rede | APIs Gemini/OpenAI + Supabase |

---

## 1. Preparar variáveis de ambiente

```bash
# Na raiz do repo
cp .env.docker.example .env.docker
```

Edite `.env.docker` e preencha **pelo menos**:

| Variável | Onde obter |
|---|---|
| `REDIS_PASSWORD` | Crie uma senha forte (min 16 chars) |
| `GEMINI_API_KEY` | console.cloud.google.com → Gemini API |
| `OPENAI_API_KEY` | platform.openai.com → API Keys |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |

> `.env.docker` está no `.gitignore`. **Nunca commite este arquivo.**
>
> `NEXT_PUBLIC_*` (VAD, site URL, Supabase anon) entra no **build** da imagem Jarvis.
> Mudou alguma? rode `npm run docker:build` de novo — só `up` não basta.

---

## 2. Gerar os embeddings do FAQ (uma vez)

Antes do primeiro deploy (e a cada atualização de FAQ), rode localmente:

```bash
npm --prefix ./jarvis run build:faq-embeddings
```

Isso gera `jarvis/src/lib/portal/institutional-faq.embeddings.json`, que é
copiado para dentro da imagem Docker pelo `Dockerfile` do Jarvis.

---

## 3. Build e subir

```bash
# Na raiz do repo (usa .env.docker para interpolar senhas e NEXT_PUBLIC_*)
npm run docker:deploy
# equivalente:
# docker compose --env-file .env.docker build
# docker compose --env-file .env.docker up -d
```

**Primeira vez:** o build leva ~3–5 min (instala deps, compila Next.js em modo standalone).
Subsequentes com cache do Docker: ~30–60 s.

Acompanhe os logs:

```bash
docker compose logs -f
```

Portal disponível em: `http://SEU_HOST/`

---

## 4. Pré-aquecer o cache Redis (TTS)

Depois que os containers estiverem `healthy`, rode o seed de TTS:

```bash
# Executa dentro do container jarvis (Redis já acessível por redis:6379)
docker compose exec jarvis node -e "
const { execSync } = require('child_process');
execSync('npx tsx --env-file=.env.local scripts/seed-portal-tts.ts', { stdio: 'inherit' });
"
```

Ou, se preferir rodar localmente (com Redis exposto na porta 6379):

```bash
# No .env.local local, configure REDIS_URL=redis://:SENHA@localhost:6379
npm --prefix ./jarvis run seed:portal-tts
```

---

## 5. Reindexar o RAG

```bash
docker compose exec jarvis npx tsx --env-file=/dev/null scripts/reindex.ts
```

> Em produção, configure `RAG_PORTAL_REPO` e `GITHUB_TOKEN` (se repo privado)
> no `.env.docker` antes de subir.

---

## Comandos úteis

```bash
# Ver status de todos os serviços
docker compose ps

# Logs de um serviço específico
docker compose logs -f jarvis
docker compose logs -f portal
docker compose logs -f redis

# Reiniciar só o Jarvis (ex: após atualizar .env.docker)
docker compose restart jarvis

# Rebuild completo de um serviço (ex: após deploy de código novo)
docker compose build jarvis && docker compose up -d jarvis

# Rebuild tudo
docker compose build --no-cache && docker compose up -d

# Parar tudo (preserva volumes)
docker compose down

# Parar + apagar volumes Redis (cuidado: apaga cache TTS)
docker compose down -v

# Acessar shell do container Jarvis
docker compose exec jarvis sh

# Verificar healthcheck
docker inspect --format='{{.State.Health.Status}}' $(docker compose ps -q jarvis)
```

---

## Atualizar após novo código

```bash
git pull origin master

# Se mudou FAQ/brief:
npm --prefix ./jarvis run build:faq-embeddings

# Rebuild e restart
docker compose build portal jarvis
docker compose up -d portal jarvis

# Se mudou RAG (novos docs no repo):
docker compose exec jarvis npx tsx scripts/reindex.ts

# Re-seed TTS (se FAQ mudou):
docker compose exec jarvis npx tsx scripts/seed-portal-tts.ts
```

---

## Portas expostas

| Porta | Serviço | Uso |
|---|---|---|
| **80** | portal (nginx) | Acesso público ao SPA + proxy Jarvis |
| 3000 | jarvis (Next.js) | Debug local apenas — feche em produção |
| 6379 | redis | Debug local / seed scripts — feche em produção |

**Em produção**, remova as entradas `ports` de `jarvis` e `redis` no
`docker-compose.yml` para que só o `portal:80` fique exposto. Use um reverse
proxy externo (Nginx, Traefik, Caddy) para TLS/HTTPS na porta 443.

---

## TLS / HTTPS (produção)

Recomendação: Caddy na frente como reverse proxy com Let's Encrypt automático.

```yaml
# Exemplo: docker-compose.prod.yml (override)
services:
  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    depends_on:
      - portal

  portal:
    ports: []           # remove exposição direta na porta 80
volumes:
  caddy_data:
```

```
# Caddyfile
seu-dominio.com.br {
    reverse_proxy portal:80
}
```

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## Variáveis de ambiente — referência completa

Consulte `.env.docker.example` para a lista comentada. As mais relevantes para
ajuste em produção:

| Variável | Padrão | Impacto |
|---|---|---|
| `INFERENCE_PROVIDER` | `gemini` | Motor de LLM/STT/TTS |
| `PORTAL_GEMINI_THINKING_BUDGET` | `0` | 0 = sem reasoning (mais rápido no portal) |
| `PORTAL_VOICE_MIN_FLUSH_CHARS` | `60` | Menor = primeiro áudio mais cedo |
| `PORTAL_VOICE_STALL_FLUSH_MS` | `300` | Menor = menos pausa antes do áudio |
| `VOICE_TTS_CONCURRENCY` | `8` | Paralelo de síntese TTS por turno |
| `OPENAI_TTS_SPEED` | `1.20` | Velocidade de fala (1.0 = normal) |
| `REDIS_SEMANTIC_THRESHOLD` | `0.90` | Similaridade mínima para cache hit |
| `LLM_SETTINGS_ENV_ONLY` | `true` | Desabilita consulta Supabase llm_settings |

---

## Troubleshooting

### Portal não carrega / 502 Bad Gateway
O nginx tenta `http://jarvis:3000` — verifique se o container Jarvis está `healthy`:
```bash
docker compose ps
docker compose logs jarvis | tail -30
```

### Jarvis não inicia (erro na porta 3000)
Verifique se outra instância está rodando na porta 3000 do host:
```bash
docker compose down && docker compose up -d
```

### Redis connection refused
O `REDIS_URL` dentro do container deve ser `redis://:SENHA@redis:6379`
(nome do serviço, não `localhost`). O docker-compose.yml já sobrescreve isso
automaticamente via a env `REDIS_URL` no bloco `environment`.

### FAQ semântico não responde / similaridade baixa
Os embeddings do arquivo `institutional-faq.embeddings.json` não foram gerados
ou estão desatualizados:
```bash
npm --prefix ./jarvis run build:faq-embeddings
docker compose build jarvis && docker compose up -d jarvis
```

### Build falha: `Cannot copy institutional-faq.embeddings.json`
O arquivo ainda não existe. Gere-o antes do build:
```bash
npm --prefix ./jarvis run build:faq-embeddings
```

### Respostas em inglês
Confirme que `INFERENCE_PROVIDER=gemini` (ou `openai`) está no `.env.docker`
e que o prompt do portal inclui a regra de idioma (arquivo
`jarvis/src/lib/jarvis-context.ts`).
