import { STT_VOCABULARY_PROMPT } from "@/lib/jarvis-context";
import { inferenceConfig } from "./config";

export async function transcribeAudio(
  audio: Buffer,
  filename = "turn.webm",
  mimeType = "audio/webm",
): Promise<string> {
  const baseUrl = inferenceConfig.whisperBaseUrl.replace(/\/$/, "");

  const form = new FormData();
  const blob = new Blob([new Uint8Array(audio)], { type: mimeType });
  form.append("file", blob, filename);
  form.append("model", inferenceConfig.whisperModel);
  form.append("language", "pt");
  form.append("response_format", "json");
  form.append("prompt", STT_VOCABULARY_PROMPT);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);

  try {
    const res = await fetch(`${baseUrl}/v1/audio/transcriptions`, {
      method: "POST",
      body: form,
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Whisper STT failed: ${res.status} ${body}`);
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = (await res.json()) as { text?: string };
      const text = data.text?.trim();
      if (!text) {
        throw new Error("Whisper returned empty transcript");
      }
      return text;
    }

    const text = (await res.text()).trim();
    if (!text) {
      throw new Error("Whisper returned empty transcript");
    }
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkWhisperHealth(): Promise<boolean> {
  try {
    const baseUrl = inferenceConfig.whisperBaseUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/v1/models`, {
      signal: AbortSignal.timeout(5_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
