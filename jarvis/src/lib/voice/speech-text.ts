/**
 * Texto para a fala (TTS) — remove o que não faz sentido ler em voz alta:
 * blocos de código/diagrama e marcadores de Markdown. Compartilhado entre
 * o turno normal (/api/voice/turn) e o streaming frase-a-frase (/api/voice/stream).
 *
 * Voz-first: `toSpeechText` fala a resposta INTEIRA (só remove markup/código).
 * Guarda de tamanho opcional via TTS_MAX_CHARS.
 */

import { compressVoiceOutput } from "@/lib/tokenops/voice-compress";

export function stripNonSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/```[\s\S]*$/, " ") // fence aberto e nunca fechado
    .replace(/`([^`]+)`/g, "$1")
    .replace(/`+/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}[-*+]\s+/gm, "")
    .replace(/^\s{0,3}\d+\.\s+/gm, "")
    .replace(/\*+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Evita corte da última palavra (Chrome speechSynthesis + Gemini/Piper TTS).
 * — troca reticências por ponto (TTS engasga em "…")
 * — garante pontuação final
 * — espaços finais dão "cauda" ao sintetizador
 */
export function padForTts(text: string): string {
  let s = text.replace(/\s+/g, " ").trim();
  if (!s) return s;
  s = s.replace(/[…]+$/g, ".").replace(/\.\.\.$/g, ".");
  if (!/[.!?]$/.test(s)) s = `${s}.`;
  // Espaços finais — dá "cauda" ao sintetizador sem verbalizar pontuação extra
  return `${s}   `;
}

/** Strip de markup para TTS (fala completa). Transcript UI mantém texto completo. */
export function toSpeechText(text: string): string {
  const TTS_MAX_CHARS = parseInt(process.env.TTS_MAX_CHARS ?? "100000", 10);
  let s = compressVoiceOutput(text);
  if (!s) s = stripNonSpeech(text);
  if (s.length > TTS_MAX_CHARS) {
    const cut = s.lastIndexOf(" ", TTS_MAX_CHARS);
    // Ponto — não "…": reticências fazem o TTS cortar a última palavra
    s = s.slice(0, cut > 0 ? cut : TTS_MAX_CHARS).trim().replace(/[,:;\-–—]$/, "") + ".";
  }
  return padForTts(s);
}
