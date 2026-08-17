/**
 * B5 — Router de modelo (path cloud).
 *
 * Default: Gemini Flash (TTFT baixo + custo).
 * OpenAI: só turns “difíceis” ou voz premium — se houver OPENAI_API_KEY.
 *
 * STT/TTS continuam no provider de pipeline (`llm_settings` / INFERENCE_PROVIDER).
 * Este módulo escolhe **só a família do LLM** por turno.
 *
 * Opt-out: LLM_ROUTER_ENABLED=false → usa o provider configurado.
 */

import type { JarvisIntent } from "@/lib/jarvis-context";
import { inferenceConfig } from "@/lib/inference/config";
import {
  isGemini,
  isOpenAi,
  type LlmSettings,
} from "@/lib/llm/settings";

export type LlmRouteFamily = "gemini" | "openai";

export type LlmRoute = {
  family: LlmRouteFamily;
  model: string;
  reason: string;
};

export function isLlmRouterEnabled(): boolean {
  return process.env.LLM_ROUTER_ENABLED !== "false";
}

/** Força OpenAI em todo turno (tier voz premium / demo). */
function voicePremiumForcesOpenAi(): boolean {
  return process.env.VOICE_PREMIUM_LLM === "openai";
}

function hardCharThreshold(): number {
  const n = Number.parseInt(process.env.LLM_ROUTER_HARD_CHARS ?? "600", 10);
  return Number.isFinite(n) && n > 0 ? n : 600;
}

/**
 * Intent / sinal de complexidade → candidato a OpenAI.
 * chat/meta/knowledge curtos ficam no Flash.
 */
export function isHardLlmTurn(
  intent: JarvisIntent,
  transcript: string,
): boolean {
  if (voicePremiumForcesOpenAi()) return true;
  if (intent === "code" || intent === "web") return true;
  if (transcript.length >= hardCharThreshold()) return true;
  // pedidos densos mesmo em knowledge/chat
  if (
    /\b(arquitetura|compara(r|ção)?|detalh(e|ar|ado)|passo\s+a\s+passo|implement(a|e|ar)|projete|desenha|trade-?off|migra(r|ção)|refator)\b/i.test(
      transcript,
    )
  ) {
    return true;
  }
  return false;
}

function routeFromSettings(settings: LlmSettings, reason: string): LlmRoute {
  if (isGemini(settings)) {
    return {
      family: "gemini",
      model: settings.gemini.model,
      reason,
    };
  }
  if (isOpenAi(settings)) {
    return {
      family: "openai",
      model: settings.openai.model,
      reason,
    };
  }
  // local / desconhecido — Flash se houver chave, senão openai
  if (inferenceConfig.geminiApiKey) {
    return {
      family: "gemini",
      model: settings.gemini.model,
      reason: `${reason}:local-as-flash`,
    };
  }
  return {
    family: "openai",
    model: settings.openai.model,
    reason: `${reason}:local-as-openai`,
  };
}

/**
 * Resolve família+modelo do LLM para este turno.
 */
export function resolveLlmRoute(
  settings: LlmSettings,
  opts: { intent: JarvisIntent; transcript: string },
): LlmRoute {
  if (!isLlmRouterEnabled() || settings.provider === "local") {
    return routeFromSettings(settings, "settings");
  }

  const hasGemini = Boolean(inferenceConfig.geminiApiKey?.trim());
  const hasOpenAi = Boolean(inferenceConfig.openAiApiKey?.trim());
  const hard = isHardLlmTurn(opts.intent, opts.transcript);

  if (hard && hasOpenAi) {
    return {
      family: "openai",
      model: settings.openai.model,
      reason: voicePremiumForcesOpenAi()
        ? "premium"
        : `hard:${opts.intent}`,
    };
  }

  if (hasGemini) {
    return {
      family: "gemini",
      model: settings.gemini.model,
      reason: hard ? "hard-fallback-flash" : "flash-default",
    };
  }

  if (hasOpenAi) {
    return {
      family: "openai",
      model: settings.openai.model,
      reason: "openai-only",
    };
  }

  return routeFromSettings(settings, "no-keys-fallback");
}
