/**
 * Guarda anti-eco: detecta quando o áudio capturado é a PRÓPRIA fala do Jarvis
 * (saudação/resposta) voltando pelo alto-falante. Sem cancelamento de eco
 * perfeito, o VAD às vezes manda a saudação de volta como se fosse o usuário.
 */

import type { ChatMessage } from "@/lib/voice/types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(text: string): Set<string> {
  return new Set(normalize(text).split(" ").filter((t) => t.length >= 3));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  return inter / (a.size + b.size - inter);
}

/**
 * true = o transcrito parece eco da última fala do assistente.
 * Heurística: substring direto OU alta sobreposição de tokens.
 */
export function isLikelyEcho(
  transcript: string,
  history: ChatMessage[] | undefined,
  minSimilarity = 0.55,
): boolean {
  const t = normalize(transcript);
  if (t.length < 6) return false;

  // Última fala do assistente (a saudação vive aqui no 1º turno do Portal)
  const lastAssistant = [...(history ?? [])]
    .reverse()
    .find((m) => m.role === "assistant")?.content;
  if (!lastAssistant) return false;

  const a = normalize(lastAssistant);
  if (!a) return false;

  // Substring longo → eco quase certo
  if (a.includes(t) && t.length >= 12) return true;
  if (t.includes(a) && a.length >= 12) return true;

  return jaccard(tokenSet(transcript), tokenSet(lastAssistant)) >= minSimilarity;
}
