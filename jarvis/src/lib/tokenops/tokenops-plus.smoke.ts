/**
 * Smoke TokenOps PLUS — voice + log compress + predictive + PII
 * Run: npx tsx src/lib/tokenops/tokenops-plus.smoke.ts
 */
import { detectPii } from "./harness";
import { compressAgentLogs, compressionRatio } from "./log-compress";
import { buildPredictiveSuggestions, formatPredictiveBlock } from "./predictive";
import { compressVoiceOutput } from "./voice-compress";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

const longVoice =
  "Primeira frase sobre a Foursys. Segunda frase com mais detalhe. Terceira frase ainda. Quarta frase que não deve ir ao TTS. Quinta frase sobra.";
const voice = compressVoiceOutput(longVoice);
assert(voice.split(/(?<=[.!?])\s+/).length <= 3, "voice ≤3 sentences");
assert(!voice.includes("Quarta"), "voice drops 4th+");

const noisy = Array.from({ length: 40 }, (_, i) =>
  i % 7 === 0 ? `Error: boom at ${i}` : `npm warn deprecated package-${i}`,
).join("\n");
const logs = compressAgentLogs(noisy);
assert(logs.includes("Error:"), "logs keep errors");
assert(compressionRatio(noisy, logs) < 0.7, "logs compressed");

assert(detectPii("meu cpf é 123.456.789-00") === "CPF", "PII CPF");
assert(detectPii("olá jarvis") === null, "no false PII");

const suggestions = buildPredictiveSuggestions({
  memories: ["Prefere respostas curtas"],
  tasksBlock: "TAREFAS\n- [ ] Revisar escopo EBV",
  transcript: "quais minhas tarefas",
});
assert(suggestions.length >= 1, "predictive suggestions");
assert(formatPredictiveBlock(suggestions).includes("SUGESTÕES"), "predictive block");

console.log("[tokenops-plus.smoke] OK", {
  voiceLen: voice.length,
  logRatio: compressionRatio(noisy, logs).toFixed(2),
  suggestions,
});
