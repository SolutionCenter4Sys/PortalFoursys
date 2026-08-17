/**
 * Browser TTS — fala texto via Web Speech Synthesis API.
 * Usado no modo LLM-only (sem Piper/OpenAI TTS server).
 *
 * Chrome/Edge cortam a última palavra do utterance com frequência.
 * Mitigações: padForTts + keepalive pause/resume.
 */

import { padForTts } from "@/lib/voice/speech-text";

export function isBrowserTtsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

let currentUtterance: SpeechSynthesisUtterance | null = null;
let keepAliveTimer: ReturnType<typeof setInterval> | null = null;

function clearKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

/** Para a fala em andamento (para barge-in no browser TTS). */
export function stopBrowserSpeech(): void {
  if (typeof window === "undefined") return;
  clearKeepAlive();
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

/**
 * Fala o texto. Retorna Promise que resolve quando termina.
 * Rejeita se não suportado.
 */
export function speakText(
  text: string,
  opts: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
  } = {},
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isBrowserTtsSupported()) {
      reject(new Error("speechSynthesis não suportado"));
      return;
    }

    clearKeepAlive();
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(padForTts(text));
    utterance.lang = opts.lang ?? "pt-BR";
    utterance.rate = opts.rate ?? 1.0;
    utterance.pitch = opts.pitch ?? 1.0;
    utterance.volume = opts.volume ?? 1.0;

    // Tenta usar uma voz pt-BR se disponível
    const voices = window.speechSynthesis.getVoices();
    const ptVoice =
      voices.find(
        (v) => v.lang.startsWith("pt") && !v.name.includes("Google"), // preferir voz nativa
      ) ?? voices.find((v) => v.lang.startsWith("pt"));
    if (ptVoice) utterance.voice = ptVoice;

    const finish = () => {
      clearKeepAlive();
      currentUtterance = null;
      resolve();
    };

    utterance.onend = () => finish();
    utterance.onerror = (e) => {
      clearKeepAlive();
      currentUtterance = null;
      if (e.error === "interrupted" || e.error === "canceled") {
        resolve(); // interrompido intencionalmente — não é erro
      } else {
        reject(new Error(`speechSynthesis erro: ${e.error}`));
      }
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);

    // Bug Chrome: speechSynthesis "congela" / corta o fim sem pause/resume periódico
    keepAliveTimer = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearKeepAlive();
        return;
      }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 8_000);
  });
}
