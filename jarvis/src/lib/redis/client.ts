import Redis from "ioredis";

let client: Redis | null = null;
/** Circuit breaker: enquanto `Date.now() < breakerOpenUntil`, Redis é pulado
 *  sem tentar conectar — evita pagar o connectTimeout a cada turno quando o
 *  serviço está fora do ar, e evita o loop de reconexão do ioredis. */
let breakerOpenUntil = 0;

const BREAKER_COOLDOWN_MS = Number.parseInt(
  process.env.REDIS_BREAKER_COOLDOWN_MS ?? "60000",
  10,
);

/** Configurado E habilitado. REDIS_ENABLED=false desliga explicitamente. */
export function isRedisConfigured(): boolean {
  if (process.env.REDIS_ENABLED === "false") return false;
  return Boolean(process.env.REDIS_URL?.trim());
}

/** Configurado, habilitado e com o breaker fechado (disponível de fato). */
export function isRedisAvailable(): boolean {
  return isRedisConfigured() && Date.now() >= breakerOpenUntil;
}

/** Abre o breaker por um período e descarta o cliente (recriado após o cooldown). */
function tripBreaker(reason: string): void {
  const wasOpen = Date.now() < breakerOpenUntil;
  breakerOpenUntil = Date.now() + BREAKER_COOLDOWN_MS;
  if (client) {
    const dead = client;
    client = null;
    try {
      dead.disconnect();
    } catch {
      /* ignore */
    }
  }
  if (!wasOpen) {
    console.warn(
      `[redis] indisponível — pulando por ${Math.round(BREAKER_COOLDOWN_MS / 1000)}s (${reason})`,
    );
  }
}

export function getRedis(): Redis | null {
  if (!isRedisConfigured()) return null;
  const url = process.env.REDIS_URL!.trim();

  if (!client) {
    client = new Redis(url, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      connectTimeout: Number.parseInt(
        process.env.REDIS_CONNECT_TIMEOUT_MS ?? "8000",
        10,
      ),
      // comandos emitidos offline rejeitam na hora em vez de enfileirar/pendurar
      enableOfflineQueue: false,
      // não reconecta em loop; deixa o breaker cuidar do cooldown
      retryStrategy: () => null,
    });
    // sem handler, um erro de conexão vira "Unhandled error event" e derruba o processo
    client.on("error", (err: Error) => tripBreaker(err?.message ?? "error"));
  }

  return client;
}

/** Dispara a conexão em background sem bloquear a chamada. Idempotente. */
let warming = false;
function warmConnect(redis: Redis): void {
  if (warming) return;
  if (redis.status !== "wait" && redis.status !== "end") return;
  warming = true;
  redis
    .connect()
    .catch((err: unknown) =>
      tripBreaker(err instanceof Error ? err.message : "connect failed"),
    )
    .finally(() => {
      warming = false;
    });
}

/** Warm-up no boot: conecta cedo para o 1º turno de voz já achar o socket pronto. */
export function warmRedis(): void {
  if (!isRedisAvailable()) return;
  const redis = getRedis();
  if (redis) warmConnect(redis);
}

/** Hot path (cache de voz): NÃO bloqueia. Se o socket ainda não está pronto,
 *  dispara o connect em background e retorna null (o turno pula o cache). Assim
 *  o Redis nunca adiciona latência ao turno — só é usado quando já está quente. */
export async function readyRedis(): Promise<Redis | null> {
  if (!isRedisAvailable()) return null;
  const redis = getRedis();
  if (!redis) return null;
  if (redis.status === "ready") return redis;
  warmConnect(redis); // background; próximos turnos acham pronto
  return null;
}

/** Diagnóstico/health: aguarda o connect de fato (pode bloquear até connectTimeout). */
export async function pingRedis(): Promise<boolean> {
  if (!isRedisAvailable()) return false;
  const redis = getRedis();
  if (!redis) return false;
  try {
    if (redis.status === "wait" || redis.status === "end") {
      await redis.connect();
    }
    return (await redis.ping()) === "PONG";
  } catch (err) {
    tripBreaker(err instanceof Error ? err.message : "ping failed");
    return false;
  }
}

export function redisCacheTtlSeconds(): number {
  const raw = process.env.REDIS_CACHE_TTL_SECONDS;
  const n = raw ? Number.parseInt(raw, 10) : 86_400;
  return Number.isFinite(n) && n > 0 ? n : 86_400;
}
