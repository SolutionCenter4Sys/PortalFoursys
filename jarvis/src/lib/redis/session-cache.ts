import type { ChatMessage } from "@/lib/voice/types";

import { readyRedis, redisCacheTtlSeconds } from "./client";

const SESSION_PREFIX = "jarvis:session:";

function sessionKey(sessionId: string): string {
  return `${SESSION_PREFIX}${sessionId}:messages`;
}

/** Append turn messages to Redis hot cache (best-effort). */
export async function appendSessionMessages(
  sessionId: string,
  messages: ChatMessage[],
): Promise<void> {
  const redis = await readyRedis();
  if (!redis) return;

  try {
    const key = sessionKey(sessionId);
    const payload = JSON.stringify(messages);
    await redis.rpush(key, payload);
    await redis.expire(key, redisCacheTtlSeconds());
  } catch (err) {
    console.warn("[redis/session-cache] append failed:", err);
  }
}

/** Load recent turns from Redis (optional restore). */
export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  const redis = await readyRedis();
  if (!redis) return [];

  try {
    const rows = await redis.lrange(sessionKey(sessionId), 0, -1);
    return rows.flatMap((row) => {
      try {
        const parsed = JSON.parse(row) as ChatMessage[];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    });
  } catch {
    return [];
  }
}

/** Reescreve o hot cache da sessão (após editar/excluir turnos). */
export async function replaceSessionMessages(
  sessionId: string,
  messages: ChatMessage[],
): Promise<void> {
  const redis = await readyRedis();
  if (!redis) return;

  try {
    const key = sessionKey(sessionId);
    await redis.del(key);
    if (messages.length === 0) return;
    // uma entrada por mensagem — getSessionMessages flatMap já espera arrays
    // mas append histórico grava pares; aqui gravamos lista completa numa entry
    await redis.rpush(key, JSON.stringify(messages));
    await redis.expire(key, redisCacheTtlSeconds());
  } catch (err) {
    console.warn("[redis/session-cache] replace failed:", err);
  }
}
