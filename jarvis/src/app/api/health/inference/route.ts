import { NextResponse } from "next/server";

import {
  assertProviderReady,
  inferenceConfig,
  isVoiceGatewayEnabled,
  isAudioStreamingEnabled,
} from "@/lib/inference/config";
import { getLlmSettings, isOpenAi, isGemini, isLlmOnly } from "@/lib/llm/settings";
import { checkGatewayHealth } from "@/lib/inference/gateway";
import { checkOllamaHealth } from "@/lib/inference/ollama";
import { checkPiperHealth } from "@/lib/inference/piper";
import { checkWhisperHealth } from "@/lib/inference/whisper";

export const runtime = "nodejs";

export async function GET() {
  // provider ativo vem das settings dinâmicas (banco → .env), igual ao turno de
  // voz — assim o badge e o modo de STT do client batem com o que roda de fato.
  const llm = await getLlmSettings();
  try {
    assertProviderReady(llm.provider);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Config error" },
      { status: 500 },
    );
  }

  const llmOnly = isLlmOnly(llm);

  // ── OpenAI (cloud) ───────────────────────────────────────────────────────
  if (isOpenAi(llm)) {
    return NextResponse.json({
      ok: true,
      mode: llmOnly ? "openai-llm" : "openai",
      streaming: !llmOnly && isAudioStreamingEnabled(),
      services: { openai: true },
      config: {
        model: llm.openai.model,
        ttsVoice: llmOnly ? "browser" : llm.openai.ttsVoice,
        sttProvider: llmOnly ? "browser" : "whisper-api",
        ttsProvider: llmOnly ? "browser" : "tts-api",
      },
    });
  }

  // ── Gemini (cloud) ───────────────────────────────────────────────────────
  if (isGemini(llm)) {
    return NextResponse.json({
      ok: true,
      mode: llmOnly ? "gemini-llm" : "gemini",
      streaming: !llmOnly && isAudioStreamingEnabled(),
      services: { gemini: true },
      config: {
        model: llm.gemini.model,
        ttsVoice: llmOnly ? "browser" : llm.gemini.ttsVoice,
        sttProvider: llmOnly ? "browser" : "gemini",
        ttsProvider: llmOnly ? "browser" : "gemini",
      },
    });
  }

  // ── Gateway (Python) ─────────────────────────────────────────────────────
  if (isVoiceGatewayEnabled()) {
    const gateway = await checkGatewayHealth();
    return NextResponse.json({
      ok: gateway,
      mode: "gateway",
      services: { gateway },
      config: { voiceGatewayUrl: inferenceConfig.voiceGatewayUrl },
    });
  }

  // ── OSS direto (Ollama + Whisper + Piper) ────────────────────────────────
  const [ollama, whisper, piper] = await Promise.all([
    checkOllamaHealth(),
    checkWhisperHealth(),
    checkPiperHealth(),
  ]);

  return NextResponse.json({
    ok: ollama && whisper && piper,
    mode: "direct",
    services: { ollama, whisper, piper },
    config: {
      localLlmEnabled: String(inferenceConfig.localLlmEnabled),
      localLlmModel: inferenceConfig.localLlmModel,
      whisperModel: inferenceConfig.whisperModel,
    },
  });
}
