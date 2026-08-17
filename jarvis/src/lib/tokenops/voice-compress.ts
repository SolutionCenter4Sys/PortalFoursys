/**
 * TokenOps — limpeza de texto para TTS (ADR-009 / US-10.3).
 * Voz-first: por padrão a resposta é falada INTEIRA (Jarvis é um assistente de voz).
 * Remove só markup/código (não faz sentido ler em voz alta). Limites opcionais via env:
 *   VOICE_MAX_SENTENCES (0/vazio = sem limite) · VOICE_TTS_MAX_CHARS (guarda de segurança).
 */

/** 0 = fala todas as frases. Defina >0 só para forçar respostas curtas na voz. */
const MAX_SENTENCES = Number.parseInt(process.env.VOICE_MAX_SENTENCES ?? "0", 10);
/** Guarda de segurança de tamanho (o LLM já limita por maxTokens). */
const MAX_CHARS = Number.parseInt(process.env.VOICE_TTS_MAX_CHARS ?? "100000", 10);

/** Divide em frases (pt-BR), preservando pontuação final. */
function splitSentences(text: string): string[] {
  const parts = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : text.trim() ? [text.trim()] : [];
}

/**
 * Versão falada da resposta do assistente — texto completo, só sem markup.
 * (Opcionalmente limitada por VOICE_MAX_SENTENCES para respostas curtas.)
 */
export function compressVoiceOutput(text: string): string {
  let s = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/```[\s\S]*$/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}[-*+]\s+/gm, "")
    .replace(/^\s{0,3}\d+\.\s+/gm, "")
    .replace(/\*+/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (!s) return "";

  const all = splitSentences(s);
  const sentences = MAX_SENTENCES > 0 ? all.slice(0, MAX_SENTENCES) : all;
  s = sentences.join(" ");

  if (s.length > MAX_CHARS) {
    const cut = s.lastIndexOf(" ", MAX_CHARS);
    // Ponto final — "…" faz Piper/Gemini/browser TTS cortar a última palavra
    s = s.slice(0, cut > 0 ? cut : MAX_CHARS).trim().replace(/[,:;\-–—]$/, "") + ".";
  }

  return s;
}
