# ── Stage 1: dependências ─────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

# Instala dependências nativas (onnxruntime-node usa gyp em alguns arqs)
RUN apk add --no-cache libc6-compat python3 make g++

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Stage 2: build standalone ─────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat python3 make g++

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Garante que não tenta ler .env.local no build (variáveis virão em runtime)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ── Stage 3: imagem final (runtime mínimo) ────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Next standalone escuta em 0.0.0.0:3000 por padrão
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copia o bundle standalone + assets estáticos + pasta public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static   ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public         ./public

# Arquivos de dados que precisam existir em runtime
COPY --from=builder --chown=nextjs:nodejs /app/src/lib/portal/institutional-faq.embeddings.json \
     ./src/lib/portal/institutional-faq.embeddings.json 2>/dev/null || true

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
