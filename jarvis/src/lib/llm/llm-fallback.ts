/**
 * B7 — Timeout + fallback de família LLM (Gemini ↔ OpenAI).
 *
 * Se o provider primário falha ou estoura TTFT/timeout, tenta o outro
 * (quando há API key). Callback opcional notifica UX (“trocando modelo…”).
 */

import { inferenceConfig } from "@/lib/inference/config";
import type { LlmSettings } from "@/lib/llm/settings";
import type { LlmRoute, LlmRouteFamily } from "@/lib/llm/model-router";

export function isLlmFallbackEnabled(): boolean {
  return process.env.LLM_FALLBACK_ENABLED !== "false";
}

/** Timeout até o 1º token (stream). Default 8s. */
export function llmTtftTimeoutMs(): number {
  const n = Number.parseInt(process.env.LLM_TTFT_TIMEOUT_MS ?? "8000", 10);
  return Number.isFinite(n) && n > 0 ? n : 8000;
}

/** Timeout da completion completa (turn non-stream). Default 45s. */
export function llmCompletionTimeoutMs(): number {
  const n = Number.parseInt(process.env.LLM_TIMEOUT_MS ?? "45000", 10);
  return Number.isFinite(n) && n > 0 ? n : 45000;
}

export function resolveFallbackRoute(
  primary: LlmRoute,
  settings: LlmSettings,
): LlmRoute | null {
  if (!isLlmFallbackEnabled()) return null;
  const hasGemini = Boolean(inferenceConfig.geminiApiKey?.trim());
  const hasOpenAi = Boolean(inferenceConfig.openAiApiKey?.trim());

  if (primary.family === "gemini" && hasOpenAi) {
    return {
      family: "openai",
      model: settings.openai.model,
      reason: `fallback-from:${primary.family}`,
    };
  }
  if (primary.family === "openai" && hasGemini) {
    return {
      family: "gemini",
      model: settings.gemini.model,
      reason: `fallback-from:${primary.family}`,
    };
  }
  return null;
}

export class LlmTimeoutError extends Error {
  readonly kind = "llm_timeout" as const;
  constructor(ms: number, phase: "ttft" | "completion") {
    super(`LLM ${phase} timeout após ${ms}ms`);
    this.name = "LlmTimeoutError";
  }
}

/** Race com timeout; limpa timer. */
export async function withLlmTimeout<T>(
  promise: Promise<T>,
  ms: number,
  phase: "ttft" | "completion" = "completion",
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new LlmTimeoutError(ms, phase)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export type FallbackNotify = (info: {
  from: LlmRouteFamily;
  to: LlmRouteFamily;
  reason: string;
}) => void;

/**
 * Executa `fn(route)`; em falha/timeout com fallback disponível, notifica e tenta 1×.
 */
export async function runWithLlmFallback<T>(
  primary: LlmRoute,
  settings: LlmSettings,
  fn: (route: LlmRoute) => Promise<T>,
  onFallback?: FallbackNotify,
): Promise<{ value: T; route: LlmRoute; fellBack: boolean }> {
  try {
    const value = await fn(primary);
    return { value, route: primary, fellBack: false };
  } catch (err) {
    const fb = resolveFallbackRoute(primary, settings);
    if (!fb) throw err;
    console.warn(
      `[llm/B7] ${primary.family} falhou (${err instanceof Error ? err.message : err}) → ${fb.family}`,
    );
    onFallback?.({
      from: primary.family,
      to: fb.family,
      reason: err instanceof Error ? err.message : "error",
    });
    const value = await fn(fb);
    return { value, route: fb, fellBack: true };
  }
}
