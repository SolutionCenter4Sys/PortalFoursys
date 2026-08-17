# ── Stage 1: build Vite ───────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# JARVIS_BACKEND_URL não é usada no build (só no dev proxy).
# Em produção o nginx faz o proxy para o container jarvis:3000.
RUN npm run build

# ── Stage 2: nginx estático ───────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove config padrão do nginx que conflita
RUN rm -f /etc/nginx/conf.d/default.conf.bak || true

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
