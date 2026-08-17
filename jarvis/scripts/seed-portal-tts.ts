/**
 * Pré-aquece o cache TTS do Portal: sintetiza cada frase das 24 respostas do
 * FAQ institucional com a config atual (voz/modelo/speed/instructions) e grava
 * em Redis. Assim, no runtime, um FAQ hit não paga TTS: cai em getCachedTts()
 * e serve o áudio em ~30ms.
 *
 * Uso: npm run seed:portal-tts
 *   (ou: npx --yes tsx --env-file=.env.local scripts/seed-portal-tts.ts)
 *
 * IMPORTANTE: re-executar SEMPRE que trocar OPENAI_TTS_VOICE, OPENAI_TTS_MODEL,
 * OPENAI_TTS_SPEED ou OPENAI_TTS_INSTRUCTIONS — cada mudança invalida a chave
 * do cache (sha256 inclui esses campos).
 *
 * Custo one-shot: ~30k caracteres × $0.60/1M (gpt-4o-mini-tts) ≈ $0.02.
 */

import { INSTITUTIONAL_FAQ } from "../src/lib/portal/institutional-faq";
import {
  preferredCloudTts,
  synthesizeCloudSpeech,
} from "../src/lib/inference/tts-pipeline";
import { toSpeechText } from "../src/lib/voice/speech-text";
import { isRedisAvailable, pingRedis } from "../src/lib/redis/client";

/** Copiado 1:1 do stream/route.ts — precisa gerar a MESMA chave de cache
 *  que o runtime cria ao dividir a resposta em frases. */
function completeSentences(text: string): {
  sentences: string[];
  consumed: number;
} {
  const re = /[^.!?…\n]*[.!?…\n]+/g;
  const sentences: string[] = [];
  let consumed = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const s = m[0].trim();
    if (s) sentences.push(s);
    consumed = re.lastIndex;
  }
  // Cauda sem terminador (respostas curtas do FAQ terminam em ".") — inclui.
  const tail = text.slice(consumed).trim();
  if (tail) sentences.push(tail);
  return { sentences, consumed };
}

async function main() {
  if (!isRedisAvailable()) {
    console.error("Redis OFF — sem cache pra popular. Verifique REDIS_URL/REDIS_ENABLED.");
    process.exit(1);
  }
  // pingRedis força a conexão (readyRedis é não-bloqueante — retorna null no
  // 1º call e faz warm-connect em background, o que não serve pra script offline).
  const pong = await pingRedis();
  if (!pong) {
    console.error(
      `Redis ping falhou. URL=${process.env.REDIS_URL?.replace(/:[^:@]+@/, ":****@") ?? "(vazio)"}. ` +
        `Verifique se o servidor está acessível e se REDIS_URL tem senha correta.`,
    );
    process.exit(1);
  }
  console.log("[seed-portal-tts] Redis PONG ✓");

  const prefer = preferredCloudTts("portal");
  const openaiVoice = process.env.OPENAI_TTS_VOICE ?? "verse";
  const openaiModel = process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts";
  const geminiVoice = process.env.GEMINI_TTS_VOICE ?? "Charon";
  const geminiModel =
    process.env.GEMINI_TTS_MODEL ?? "gemini-3.1-flash-tts-preview";

  console.log(
    `[seed-portal-tts] ${INSTITUTIONAL_FAQ.length} FAQ items · prefer=${prefer} · voice=${openaiVoice} · model=${openaiModel}`,
  );

  let sentencesTotal = 0;
  let ok = 0;
  let fail = 0;
  let chars = 0;
  const t0 = Date.now();

  for (const item of INSTITUTIONAL_FAQ) {
    const { sentences } = completeSentences(item.answer);
    for (const raw of sentences) {
      const text = toSpeechText(raw);
      if (!text.trim()) continue;
      sentencesTotal += 1;
      chars += text.length;
      try {
        await synthesizeCloudSpeech(text, {
          prefer,
          gemini: { voice: geminiVoice, model: geminiModel },
          openai: { voice: openaiVoice, model: openaiModel },
          cache: true,
          geminiTimeoutMs: 8000,
        });
        ok += 1;
        process.stdout.write(".");
      } catch (e) {
        fail += 1;
        console.warn(
          `\nfail id=${item.id} text="${text.slice(0, 60)}"`,
          e instanceof Error ? e.message : e,
        );
      }
    }
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(
    `\n[seed-portal-tts] done sentences=${sentencesTotal} ok=${ok} fail=${fail} chars=${chars} tempo=${elapsed}s`,
  );
  process.exit(fail > 0 ? 2 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
