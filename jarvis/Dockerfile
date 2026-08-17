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

# Garante que não tenta ler .env.local no build (secrets vêm em runtime).
# NEXT_PUBLIC_* precisa existir no BUILD — Compose passa via build.args.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_VOICE_MIC_REARM_MS=350
ARG NEXT_PUBLIC_VAD_POSITIVE_THRESHOLD=0.7
ARG NEXT_PUBLIC_VAD_MIN_SPEECH_MS=250
ARG NEXT_PUBLIC_VOICE_MIN_UTTERANCE_MS=600
ARG NEXT_PUBLIC_VAD_REDEMPTION_MS=1600

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_VOICE_MIC_REARM_MS=$NEXT_PUBLIC_VOICE_MIC_REARM_MS
ENV NEXT_PUBLIC_VAD_POSITIVE_THRESHOLD=$NEXT_PUBLIC_VAD_POSITIVE_THRESHOLD
ENV NEXT_PUBLIC_VAD_MIN_SPEECH_MS=$NEXT_PUBLIC_VAD_MIN_SPEECH_MS
ENV NEXT_PUBLIC_VOICE_MIN_UTTERANCE_MS=$NEXT_PUBLIC_VOICE_MIN_UTTERANCE_MS
ENV NEXT_PUBLIC_VAD_REDEMPTION_MS=$NEXT_PUBLIC_VAD_REDEMPTION_MS

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
