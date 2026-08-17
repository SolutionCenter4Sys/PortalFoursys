/**
 * Fala com a voz Jarvis (Gemini/OpenAI via /api/voice/speak).
 * Fallback: Web Speech API (robótica) se cloud TTS falhar / llm-only sem key.
 */
import { speakText, stopBrowserSpeech } from "@/lib/voice/browser-tts";
import { waitAudioFullyPlayed } from "@/lib/voice/wait-audio";

// Guard anti-sobreposição: só 1 fala Jarvis por vez. Se uma nova saudação/resposta
// começa (ex.: dupla ativação no cold start), interrompe a anterior antes de tocar.
let currentAudio: HTMLAudioElement | null = null;

export function stopJarvisSpeech(): void {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.src = "";
    } catch {
      /* ignore */
    }
    currentAudio = null;
  }
  stopBrowserSpeech();
}

export async function speakJarvis(
  text: string,
  surface?: "app" | "portal",
): Promise<"cloud" | "browser"> {
  const clean = text.trim();
  if (!clean) return "browser";

  try {
    const res = await fetch("/api/voice/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: clean.slice(0, 1200), surface }),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        audioBase64?: string;
        audioMimeType?: string;
      };
      if (data.audioBase64 && data.audioMimeType) {
        // Interrompe qualquer fala anterior antes de iniciar (evita 2 vozes juntas)
        stopJarvisSpeech();
        const src = `data:${data.audioMimeType};base64,${data.audioBase64}`;
        const audio = new Audio(src);
        currentAudio = audio;
        await waitAudioFullyPlayed(audio);
        if (currentAudio === audio) currentAudio = null;
        return "cloud";
      }
    }
  } catch {
    /* fallback browser */
  }

  await speakText(clean).catch(() => {});
  return "browser";
}
