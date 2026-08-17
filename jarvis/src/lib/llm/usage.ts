/**
 * Governança de LLM — FinOps: captura de tokens, custo estimado e log imutável.
 * Grava uma linha em `llm_calls` por turno (best-effort, via admin client).
 * Também cobre STT / TTS / embed (intent = stt|tts|embed).
 */

import { createAdminClient, isAdminClientAvailable } from "@/lib/supabase/admin";

export interface LlmUsage {
  promptTokens: number;
  completionTokens: number;
  thinkingTokens: number;
  totalTokens: number;
  /** Tokens do prompt servidos do cache (implicit/explicit Gemini caching).
   *  Quando > 0 significa que o provider reusou parte do prefixo — TTFT cai
   *  e custo do input do bloco cacheado é ~25% do normal. */
  cachedInputTokens?: number;
}

export const EMPTY_USAGE: LlmUsage = {
  promptTokens: 0,
  completionTokens: 0,
  thinkingTokens: 0,
  totalTokens: 0,
  cachedInputTokens: 0,
};

/** Contexto opcional p/ meter STT/TTS/embed sem quebrar o turno. */
export type MeterCtx = {
  userId?: string | null;
  voiceMode?: string;
};

type Price = { input: number; output: number; thinking: number };

// preços em cache (TTL 60s) — editáveis pela UI sem restart
let priceCache: { map: Map<string, Price>; expires: number } | null = null;

export function invalidatePriceCache(): void {
  priceCache = null;
}

/** Normaliza usageMetadata do @google/genai. */
export function usageFromGeminiMeta(
  m:
    | {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        thoughtsTokenCount?: number;
        totalTokenCount?: number;
        cachedContentTokenCount?: number;
      }
    | null
    | undefined,
): LlmUsage {
  if (!m) return EMPTY_USAGE;
  return {
    promptTokens: m.promptTokenCount ?? 0,
    completionTokens: m.candidatesTokenCount ?? 0,
    thinkingTokens: m.thoughtsTokenCount ?? 0,
    totalTokens:
      m.totalTokenCount ??
      (m.promptTokenCount ?? 0) +
        (m.candidatesTokenCount ?? 0) +
        (m.thoughtsTokenCount ?? 0),
    cachedInputTokens: m.cachedContentTokenCount ?? 0,
  };
}

/** Estimativa Whisper: ~$0.006 / minuto de áudio. */
export function whisperCostUsd(durationSec: number): number {
  if (!Number.isFinite(durationSec) || durationSec <= 0) return 0;
  return (durationSec / 60) * 0.006;
}

/** OpenAI TTS-1: ~$15 / 1M caracteres · tts-1-hd ~$30. */
export function openAiTtsCostUsd(charCount: number, model = "tts-1"): number {
  if (charCount <= 0) return 0;
  const per1m = model.includes("hd") ? 30 : 15;
  return (charCount / 1_000_000) * per1m;
}

async function loadPrices(): Promise<Map<string, Price>> {
  const now = Date.now();
  if (priceCache && now < priceCache.expires) return priceCache.map;
  const map = new Map<string, Price>();
  if (isAdminClientAvailable()) {
    try {
      const db = createAdminClient();
      const { data } = await db
        .from("llm_prices")
        .select("model, input_per_1m, output_per_1m, thinking_per_1m");
      for (const r of (data ?? []) as Array<{
        model: string;
        input_per_1m: number;
        output_per_1m: number;
        thinking_per_1m: number;
      }>) {
        map.set(r.model, {
          input: Number(r.input_per_1m),
          output: Number(r.output_per_1m),
          thinking: Number(r.thinking_per_1m),
        });
      }
    } catch {
      /* sem preços → custo 0 */
    }
  }
  priceCache = { map, expires: now + 60_000 };
  return map;
}

/** Custo estimado em US$ para o uso de um modelo. 0 se o modelo não tem preço. */
export async function computeCost(model: string, usage: LlmUsage): Promise<number> {
  const price = (await loadPrices()).get(model);
  if (!price) return 0;
  return (
    (usage.promptTokens / 1_000_000) * price.input +
    (usage.completionTokens / 1_000_000) * price.output +
    (usage.thinkingTokens / 1_000_000) * price.thinking
  );
}

/** Grava uma linha de consumo (best-effort — nunca quebra o turno de voz). */
export async function recordLlmCall(opts: {
  userId?: string | null;
  provider: string;
  model: string;
  intent?: string;
  usage: LlmUsage;
  latencyMs: number;
  cacheHit: boolean;
  voiceMode?: string;
  /** Quando setado (Whisper/TTS OpenAI), ignora computeCost por tokens. */
  costUsdOverride?: number;
}): Promise<void> {
  if (!isAdminClientAvailable()) return;
  try {
    const cost =
      opts.costUsdOverride !== undefined
        ? opts.costUsdOverride
        : await computeCost(opts.model, opts.usage);
    const db = createAdminClient();
    await db.from("llm_calls").insert({
      user_id: opts.userId ?? null,
      provider: opts.provider,
      model: opts.model,
      intent: opts.intent ?? null,
      prompt_tokens: opts.usage.promptTokens,
      completion_tokens: opts.usage.completionTokens,
      thinking_tokens: opts.usage.thinkingTokens,
      total_tokens: opts.usage.totalTokens,
      cost_usd: cost,
      latency_ms: opts.latencyMs,
      cache_hit: opts.cacheHit,
      voice_mode: opts.voiceMode ?? null,
    });
  } catch (err) {
    console.warn("[llm/usage] record failed:", err);
  }
}
