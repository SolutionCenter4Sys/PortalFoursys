/** Wake phrase — estilo Siri/Alexa/Bixby (ADR-003 extensão). */

export function normalizeSpeech(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Padrão. Ordem importa: frases mais específicas primeiro para
// extractCommandAfterWake casar o prefixo completo. "jarvis" sozinho fica por
// último (fallback) — mais sujeito a falso-disparo, mas não é palavra comum
// em pt-BR, então é aceitável.
const DEFAULT_WAKE_ALIASES = [
  "olá jarvis",
  "ola jarvis",
  "ei jarvis",
  "hey jarvis",
  "ok jarvis",
  "jarvis",
];

/**
 * Lista de wake words configurável via env — `NEXT_PUBLIC_WAKE_ALIASES`
 * (separadas por vírgula). Ex.: "jarvis,ok jarvis,ei jarvis". Se definida,
 * SUBSTITUI o padrão (permite remover o "jarvis" solto). Vazia/ausente → padrão.
 * Retorna as frases como escritas pelo usuário (casing preservado p/ display).
 */
function parseEnvAliases(): string[] | null {
  const raw = process.env.NEXT_PUBLIC_WAKE_ALIASES;
  if (!raw || !raw.trim()) return null;
  const list = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length > 0 ? list : null;
}

const envAliases = parseEnvAliases();

/** Frase exibida no hint da UI — primeira configurada ou o padrão. */
export const WAKE_PHRASE = envAliases?.[0] ?? "olá jarvis";

/** Aliases normalizados usados na detecção (lowercase, sem acento, sem dup). */
export const WAKE_ALIASES: string[] = Array.from(
  new Set((envAliases ?? DEFAULT_WAKE_ALIASES).map(normalizeSpeech).filter(Boolean)),
);

/** Tempo ouvindo comando após wake word (ms). */
export const ARMED_TIMEOUT_MS = 8_000;

export function containsWakePhrase(text: string): boolean {
  const n = normalizeSpeech(text);
  return WAKE_ALIASES.some((alias) => n.includes(alias));
}

/** Texto após wake word na mesma frase ("Olá Jarvis, qual o clima?"). */
export function extractCommandAfterWake(text: string): string | null {
  const n = normalizeSpeech(text);
  for (const alias of WAKE_ALIASES) {
    const idx = n.indexOf(alias);
    if (idx === -1) continue;
    const rest = n.slice(idx + alias.length).replace(/^[\s,]+/, "").trim();
    if (rest.length >= 3) return rest;
  }
  return null;
}

export function isWakeWordSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    window.SpeechRecognition ?? window.webkitSpeechRecognition,
  );
}
