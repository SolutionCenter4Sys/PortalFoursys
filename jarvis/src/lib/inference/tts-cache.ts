/**
 * Cache de TTS (áudio) em Redis — para frases FIXAS e determinísticas
 * (saudação do Portal, respostas de FAQ institucional). Evita re-sintetizar
 * o mesmo texto a cada turno: hit → áudio instantâneo (0ms de síntese).
 *
 * Chave = sha256(prefer|gModel|gVoice|oModel|oVoice|text). Inclui provider/voz
 * para não servir voz errada se a config mudar. Valor = JSON { audio(base64),
 * mimeType, used }.
 *
 * TTL longo (default 30 dias) — conteúdo fixo muda raramente. Invalida sozinho
 * ao trocar voz/modelo (muda a chave).
 */
import { createHash } from "node:crypto";

import { readyRedis } from "@/lib/redis/client";

export type CachedTts = {
  audio: Buffer;
  mimeType: string;
  used: "gemini" | "openai";
};

type TtsKeyParts = {
  text: string;
  prefer: "gemini" | "openai";
  geminiVoice?: string;
  geminiModel?: string;
  openaiVoice?: string;
  openaiModel?: string;
};

const PREFIX = "tts:v1:";

export function ttsCacheEnabled(): boolean {
  return process.env.TTS_CACHE_ENABLED !== "false";
}

function ttsCacheTtlSeconds(): number {
  const raw = process.env.TTS_CACHE_TTL_SECONDS;
  const n = raw ? Number.parseInt(raw, 10) : 2_592_000; // 30 dias
  return Number.isFinite(n) && n > 0 ? n : 2_592_000;
}

export function ttsCacheKey(parts: TtsKeyParts): string {
  const raw = [
    parts.prefer,
    parts.geminiModel ?? "",
    parts.geminiVoice ?? "",
    parts.openaiModel ?? "",
    parts.openaiVoice ?? "",
    parts.text.trim(),
  ].join("|");
  return PREFIX + createHash("sha256").update(raw).digest("hex");
}

/** Lookup best-effort. Nunca lança — Redis fora do ar → null (segue sintetizando). */
export async function getCachedTts(key: string): Promise<CachedTts | null> {
  if (!ttsCacheEnabled()) return null;
  try {
    const redis = await readyRedis();
    if (!redis) return null;
    const raw = await redis.get(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      audio?: string;
      mimeType?: string;
      used?: "gemini" | "openai";
    };
    if (!parsed.audio || !parsed.mimeType) return null;
    return {
      audio: Buffer.from(parsed.audio, "base64"),
      mimeType: parsed.mimeType,
      used: parsed.used ?? "openai",
    };
  } catch {
    return null;
  }
}

/** Grava best-effort. Falha de Redis é silenciosa. */
export async function setCachedTts(key: string, value: CachedTts): Promise<void> {
  if (!ttsCacheEnabled()) return;
  try {
    const redis = await readyRedis();
    if (!redis) return;
    const payload = JSON.stringify({
      audio: value.audio.toString("base64"),
      mimeType: value.mimeType,
      used: value.used,
    });
    await redis.set(key, payload, "EX", ttsCacheTtlSeconds());
  } catch {
    /* best-effort */
  }
}
