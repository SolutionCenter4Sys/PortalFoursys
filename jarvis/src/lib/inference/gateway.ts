import type { ChatMessage } from "@/lib/voice/types";

const GATEWAY_TIMEOUT_MS = 120_000;

function gatewayBaseUrl(): string {
  const url = process.env.VOICE_GATEWAY_URL?.trim();
  if (!url) return "";
  return url.replace(/\/$/, "");
}

export function isVoiceGatewayEnabled(): boolean {
  return Boolean(gatewayBaseUrl());
}

export async function gatewayStt(
  audio: Buffer,
  filename: string,
  mimeType: string,
): Promise<{ transcript: string; sttMs: number }> {
  const base = gatewayBaseUrl();
  const form = new FormData();
  const blob = new Blob([new Uint8Array(audio)], { type: mimeType });
  form.append("audio", blob, filename);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GATEWAY_TIMEOUT_MS);

  try {
    const res = await fetch(`${base}/v1/stt`, {
      method: "POST",
      body: form,
      signal: controller.signal,
    });

    const data = (await res.json()) as {
      transcript?: string;
      latency_ms?: { stt?: number };
      detail?: string;
    };

    if (!res.ok) {
      throw new Error(data.detail ?? `Gateway STT ${res.status}`);
    }

    if (!data.transcript) {
      throw new Error("Gateway STT returned empty transcript");
    }

    return {
      transcript: data.transcript,
      sttMs: data.latency_ms?.stt ?? 0,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function gatewayChatTts(options: {
  transcript: string;
  systemPrompt: string;
  history: ChatMessage[];
}): Promise<{
  assistantText: string;
  audioBase64: string;
  audioMimeType: string;
  llmMs: number;
  ttsMs: number;
}> {
  const base = gatewayBaseUrl();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GATEWAY_TIMEOUT_MS);

  try {
    const res = await fetch(`${base}/v1/chat-tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: options.transcript,
        system_prompt: options.systemPrompt,
        history: options.history,
      }),
      signal: controller.signal,
    });

    const data = (await res.json()) as {
      assistant_text?: string;
      audio_base64?: string;
      audio_mime_type?: string;
      latency_ms?: { llm?: number; tts?: number };
      detail?: string;
    };

    if (!res.ok) {
      throw new Error(data.detail ?? `Gateway chat-tts ${res.status}`);
    }

    if (!data.assistant_text || !data.audio_base64) {
      throw new Error("Gateway chat-tts incomplete response");
    }

    return {
      assistantText: data.assistant_text,
      audioBase64: data.audio_base64,
      audioMimeType: data.audio_mime_type ?? "audio/wav",
      llmMs: data.latency_ms?.llm ?? 0,
      ttsMs: data.latency_ms?.tts ?? 0,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkGatewayHealth(): Promise<boolean> {
  const base = gatewayBaseUrl();
  if (!base) return false;

  try {
    const res = await fetch(`${base}/health`, {
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { ok?: boolean };
    return data.ok === true;
  } catch {
    return false;
  }
}
