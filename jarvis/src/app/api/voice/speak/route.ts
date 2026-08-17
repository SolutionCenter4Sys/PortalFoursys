import { NextResponse } from "next/server";

import { synthesizeCloudSpeech, preferredCloudTts } from "@/lib/inference/tts-pipeline";
import {
  getLlmSettings,
  isGemini,
  isOpenAi,
} from "@/lib/llm/settings";
import {
  AuthRequiredError,
  resolveVoiceUserId,
} from "@/lib/usage/service";
import { toSpeechText } from "@/lib/voice/speech-text";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/voice/speak — TTS com a voz Jarvis (Gemini/OpenAI),
 * para anúncios fora do turn (ex.: Agent Bridge concluído).
 * Body: { text: string }
 */
export async function POST(request: Request) {
  try {
    const userId = await resolveVoiceUserId();
    const body = (await request.json()) as { text?: string; surface?: string };
    const text = toSpeechText(String(body.text || "").trim());
    if (!text) {
      return NextResponse.json({ error: "text obrigatório" }, { status: 400 });
    }
    if (text.length > 1400) {
      return NextResponse.json({ error: "text demasiado longo" }, { status: 400 });
    }
    const portalMode =
      typeof body.surface === "string" &&
      body.surface.trim().toLowerCase() === "portal";

    const llm = await getLlmSettings();
    if (!isGemini(llm) && !isOpenAi(llm)) {
      return NextResponse.json(
        { error: "TTS cloud indisponível neste provider — usar browser" },
        { status: 501 },
      );
    }

    const out = await synthesizeCloudSpeech(text, {
      prefer: preferredCloudTts(portalMode ? "portal" : "app"),
      gemini: { voice: llm.gemini.ttsVoice, model: llm.gemini.ttsModel },
      openai: { voice: llm.openai.ttsVoice, model: llm.openai.ttsModel },
      meter: { userId, voiceMode: "speak" },
      geminiTimeoutMs: portalMode ? 3_500 : undefined,
      // Saudação e anúncios fixos → cache (instantâneo em repetições).
      cache: true,
    });

    return NextResponse.json({
      audioBase64: out.audio.toString("base64"),
      audioMimeType: out.mimeType,
      provider: out.used,
    });
  } catch (err) {
    if (err instanceof AuthRequiredError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.warn("[voice/speak]", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "TTS falhou" },
      { status: 502 },
    );
  }
}
