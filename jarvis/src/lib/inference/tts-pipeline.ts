/**
 * TTS cloud: OpenAI primeiro (rápido, ~1–2s) → Gemini fallback.
 * Gemini TTS sozinho costuma 8–30s e mata a UX de voz.
 *
 * VOICE_TTS_PREFER=openai|gemini  (default openai se a chave existir)
 */

import {
  isGeminiAvailable,
  synthesizeSpeechGemini,
  synthesizeSpeechGeminiStream,
} from "@/lib/inference/gemini-provider";
import {
  isOpenAiAvailable,
  synthesizeSpeechOpenAI,
} from "@/lib/inference/openai-provider";
import {
  getCachedTts,
  setCachedTts,
  ttsCacheKey,
} from "@/lib/inference/tts-cache";
import type { MeterCtx } from "@/lib/llm/usage";

export type CloudTtsOpts = {
  prefer?: "gemini" | "openai";
  gemini?: { voice?: string; model?: string };
  openai?: { voice?: string; model?: string };
  meter?: MeterCtx;
  geminiTimeoutMs?: number;
  /** true = consulta/grava cache Redis (só p/ texto fixo: saudação, FAQ). */
  cache?: boolean;
};

/**
 * Preferência global (`VOICE_TTS_PREFER`) ou por superfície.
 * Portal: default OpenAI (~1–2s). Gemini TTS sozinho costuma 8–30s.
 * Override: `VOICE_PORTAL_TTS_PREFER=gemini|openai`
 */
export function preferredCloudTts(
  surface: "app" | "portal" = "app",
): "gemini" | "openai" {
  const pick = (raw: string | undefined, fallback: "gemini" | "openai") => {
    const v = (raw ?? fallback).trim().toLowerCase();
    if (v === "gemini") return isGeminiAvailable() ? "gemini" : "openai";
    if (v === "openai") return isOpenAiAvailable() ? "openai" : "gemini";
    return fallback;
  };

  if (surface === "portal") {
    const portalRaw = process.env.VOICE_PORTAL_TTS_PREFER;
    if (portalRaw?.trim()) return pick(portalRaw, "openai");
    // Sem override: Portal prioriza velocidade (OpenAI se houver chave)
    if (isOpenAiAvailable()) return "openai";
    return isGeminiAvailable() ? "gemini" : "openai";
  }

  return pick(process.env.VOICE_TTS_PREFER, "openai");
}

function geminiTtsTimeoutMs(override?: number): number {
  if (typeof override === "number" && Number.isFinite(override)) return override;
  return Number.parseInt(process.env.GEMINI_TTS_TIMEOUT_MS ?? "8000", 10) || 8_000;
}

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timeout ${ms}ms`)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function synthesizeCloudSpeech(
  text: string,
  opts: CloudTtsOpts,
): Promise<{ audio: Buffer; mimeType: string; used: "gemini" | "openai" }> {
  const timeoutMs = geminiTtsTimeoutMs(opts.geminiTimeoutMs);
  const prefer = opts.prefer ?? preferredCloudTts();
  const useStream = process.env.GEMINI_TTS_STREAM === "true";

  // Cache (só texto fixo): saudação/FAQ saem instantâneos sem re-sintetizar.
  const cacheKey = opts.cache
    ? ttsCacheKey({
        text,
        prefer,
        geminiVoice: opts.gemini?.voice,
        geminiModel: opts.gemini?.model,
        openaiVoice: opts.openai?.voice,
        openaiModel: opts.openai?.model,
      })
    : null;
  if (cacheKey) {
    const hit = await getCachedTts(cacheKey);
    if (hit) return hit;
  }

  const tryGemini = async () => {
    if (!isGeminiAvailable()) throw new Error("GEMINI_API_KEY ausente");
    const synth = useStream
      ? synthesizeSpeechGeminiStream
      : synthesizeSpeechGemini;
    return withTimeout(
      synth(text, {
        voice: opts.gemini?.voice,
        model: opts.gemini?.model,
        meter: opts.meter,
      }),
      timeoutMs,
      "Gemini TTS",
    );
  };

  const tryOpenai = async () => {
    if (!isOpenAiAvailable()) throw new Error("OPENAI_API_KEY ausente");
    return synthesizeSpeechOpenAI(text, {
      voice: opts.openai?.voice,
      model: opts.openai?.model,
      meter: opts.meter,
    });
  };

  const first = prefer;
  const second: "gemini" | "openai" = first === "openai" ? "gemini" : "openai";
  let out: { audio: Buffer; mimeType: string };
  let used: "gemini" | "openai";
  try {
    out = first === "openai" ? await tryOpenai() : await tryGemini();
    used = first;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const canSecond = second === "openai" ? isOpenAiAvailable() : isGeminiAvailable();
    if (!canSecond) throw err;
    console.warn(`[tts] ${first} falhou → ${second}: ${msg}`);
    out = second === "openai" ? await tryOpenai() : await tryGemini();
    used = second;
  }

  const result = { ...out, used };
  if (cacheKey) void setCachedTts(cacheKey, result);
  return result;
}
