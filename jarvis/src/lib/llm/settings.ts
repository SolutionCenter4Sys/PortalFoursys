/**
 * Governança de LLM — configuração dinâmica (hot reload, sem restart).
 *
 * Lê a linha única de `llm_settings` no Supabase (via admin client) e mescla
 * sobre os defaults do .env. Cache curto (TTL) para não bater no banco a cada
 * turno; a UI chama invalidateLlmSettings() ao salvar para refletir na hora.
 * Sem banco/admin key → cai 100% no .env (compatível com o comportamento antigo).
 */

import { createAdminClient, isAdminClientAvailable } from "@/lib/supabase/admin";
import { inferenceConfig, type InferenceProvider } from "@/lib/inference/config";

export interface OpenAiSettings {
  model: string;
  maxTokens: number;
  temperature: number;
  ttsVoice: string;
  ttsModel: string;
}

export interface GeminiSettings {
  model: string;
  sttModel: string;
  maxTokens: number;
  temperature: number;
  thinkingBudget: number;
  ttsModel: string;
  ttsVoice: string;
}

export interface LlmSettings {
  provider: InferenceProvider;
  openai: OpenAiSettings;
  gemini: GeminiSettings;
}

function envDefaults(): LlmSettings {
  return {
    provider: inferenceConfig.provider,
    openai: {
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      maxTokens: Number.parseInt(process.env.OPENAI_MAX_TOKENS ?? "1024", 10),
      temperature: Number.parseFloat(process.env.OPENAI_TEMPERATURE ?? "0.7"),
      ttsVoice: process.env.OPENAI_TTS_VOICE ?? "onyx",
      ttsModel: process.env.OPENAI_TTS_MODEL ?? "tts-1",
    },
    gemini: {
      model: process.env.GEMINI_MODEL ?? "gemini-3.5-flash",
      sttModel: process.env.GEMINI_STT_MODEL ?? process.env.GEMINI_MODEL ?? "gemini-3.5-flash",
      maxTokens: Number.parseInt(process.env.GEMINI_MAX_TOKENS ?? "1024", 10),
      temperature: Number.parseFloat(process.env.GEMINI_TEMPERATURE ?? "0.3"),
      thinkingBudget: Number.parseInt(process.env.GEMINI_THINKING_BUDGET ?? "0", 10),
      ttsModel: process.env.GEMINI_TTS_MODEL ?? "gemini-3.1-flash-tts-preview",
      ttsVoice: process.env.GEMINI_TTS_VOICE ?? "Charon",
    },
  };
}

/** número robusto: aceita number ou string do JSON; inválido → fallback do .env. */
function num(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** merge campo a campo: o banco sobrescreve só o que está preenchido; o resto
 *  (e qualquer valor inválido) cai no default do .env. */
function merge(base: LlmSettings, row: LlmRow | null): LlmSettings {
  if (!row) return base;
  const cfg = (row.config ?? {}) as Partial<{
    openai: Partial<OpenAiSettings>;
    gemini: Partial<GeminiSettings>;
  }>;
  const o = cfg.openai ?? {};
  const g = cfg.gemini ?? {};
  return {
    provider: (row.provider as InferenceProvider) || base.provider,
    openai: {
      model: o.model ?? base.openai.model,
      maxTokens: num(o.maxTokens, base.openai.maxTokens),
      temperature: num(o.temperature, base.openai.temperature),
      ttsVoice: o.ttsVoice ?? base.openai.ttsVoice,
      ttsModel: o.ttsModel ?? base.openai.ttsModel,
    },
    gemini: {
      model: g.model ?? base.gemini.model,
      sttModel: g.sttModel ?? base.gemini.sttModel,
      maxTokens: num(g.maxTokens, base.gemini.maxTokens),
      temperature: num(g.temperature, base.gemini.temperature),
      thinkingBudget: num(g.thinkingBudget, base.gemini.thinkingBudget),
      ttsModel: g.ttsModel ?? base.gemini.ttsModel,
      ttsVoice: g.ttsVoice ?? base.gemini.ttsVoice,
    },
  };
}

type LlmRow = { provider: string; config: unknown };

const CACHE_TTL_MS = Number.parseInt(process.env.LLM_SETTINGS_TTL_MS ?? "15000", 10);
let cache: { value: LlmSettings; expires: number } | null = null;

/** Modo env-only: pula 100% a consulta ao Supabase, usa só o .env. Ativa quando
 *  a tabela llm_settings está vazia (governança pelo .env) — economiza 1 RPC
 *  Supabase por cache-miss (~150-300ms em ca-central-1). */
function isEnvOnlyMode(): boolean {
  return process.env.LLM_SETTINGS_ENV_ONLY === "true";
}

/** Invalida o cache — chamado ao salvar settings na UI (efeito imediato). */
export function invalidateLlmSettings(): void {
  cache = null;
}

export async function getLlmSettings(): Promise<LlmSettings> {
  const now = Date.now();
  if (cache && now < cache.expires) return cache.value;

  const base = envDefaults();

  // Env-only: retorna imediatamente com TTL longo. Não consulta Supabase.
  // Para reativar governança pela UI /admin/llm: remova LLM_SETTINGS_ENV_ONLY.
  if (isEnvOnlyMode()) {
    cache = { value: base, expires: now + 3_600_000 }; // 1h
    return base;
  }

  if (!isAdminClientAvailable()) {
    cache = { value: base, expires: now + CACHE_TTL_MS };
    return base;
  }

  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("llm_settings")
      .select("provider, config")
      .eq("id", 1)
      .maybeSingle();
    // erro (ex.: tabela não existe / migration não aplicada) ou linha ausente
    // → usa 100% o .env, mas avisa para ser debugável.
    if (error) {
      console.warn(
        `[llm/settings] leitura do banco falhou — usando .env como fallback: ${error.message}`,
      );
    }
    const value = merge(base, (data as LlmRow | null) ?? null);
    cache = { value, expires: now + CACHE_TTL_MS };
    return value;
  } catch (err) {
    // banco indisponível → usa .env (não quebra o turno de voz)
    console.warn("[llm/settings] admin client indisponível — fallback .env:", err);
    cache = { value: base, expires: now + CACHE_TTL_MS };
    return base;
  }
}

// ─── Helpers de provider derivados das settings (substituem os env-based no route) ─
export function isOpenAi(s: LlmSettings): boolean {
  return s.provider === "openai" || s.provider === "openai-llm";
}
export function isOpenAiLlmOnly(s: LlmSettings): boolean {
  return s.provider === "openai-llm";
}
export function isGemini(s: LlmSettings): boolean {
  return s.provider === "gemini" || s.provider === "gemini-llm";
}
export function isGeminiFull(s: LlmSettings): boolean {
  return s.provider === "gemini";
}
export function isGeminiLlmOnly(s: LlmSettings): boolean {
  return s.provider === "gemini-llm";
}
export function isLlmOnly(s: LlmSettings): boolean {
  return s.provider === "openai-llm" || s.provider === "gemini-llm";
}
