/**
 * Gemini Provider — pipeline completo do Google (alternativo ao OSS local / OpenAI).
 * Ativado com INFERENCE_PROVIDER=gemini (ou gemini-full).
 *
 * STT  → Gemini multimodal (áudio inline)          — GEMINI_STT_MODEL
 * LLM  → Gemini 3.5 Flash (padrão)                 — GEMINI_MODEL
 * TTS  → Gemini TTS (PCM 24kHz → WAV)              — GEMINI_TTS_MODEL / GEMINI_TTS_VOICE
 *
 * O SDK nativo (@google/genai) é usado porque o endpoint OpenAI-compat do Gemini
 * só cobre o LLM — STT e TTS exigem a API nativa.
 */

import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import type { ThinkingConfig } from "@google/genai";

import { STT_VOCABULARY_PROMPT } from "@/lib/jarvis-context";
import type { ChatMessage } from "@/lib/voice/types";
import {
  EMPTY_USAGE,
  recordLlmCall,
  usageFromGeminiMeta,
  type LlmUsage,
  type MeterCtx,
} from "@/lib/llm/usage";

// Singleton: reusa keep-alive HTTP/2, DNS cache e conexões TLS entre requests.
// Antes: new GoogleGenAI a cada call → 50–200 ms de handshake por turno de voz.
let _client: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (_client) return _client;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY não configurado");
  _client = new GoogleGenAI({ apiKey });
  return _client;
}

export function isGeminiAvailable(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

/** Gemini 3.x prefere thinkingLevel; 2.5 continua com thinkingBudget. */
function isGemini3Family(model: string): boolean {
  return /gemini-3/i.test(model);
}

/**
 * Mapeia o thinkingBudget legado (UI/env) para ThinkingConfig.
 * 0 → off/minimal · -1 → medium (auto) · ≤512 low · ≤2048 medium · else high
 */
function buildThinkingConfig(model: string, thinkingBudget: number): ThinkingConfig {
  if (isGemini3Family(model)) {
    if (thinkingBudget === 0) return { thinkingLevel: ThinkingLevel.MINIMAL };
    if (thinkingBudget < 0) return { thinkingLevel: ThinkingLevel.MEDIUM };
    if (thinkingBudget <= 512) return { thinkingLevel: ThinkingLevel.LOW };
    if (thinkingBudget <= 2048) return { thinkingLevel: ThinkingLevel.MEDIUM };
    return { thinkingLevel: ThinkingLevel.HIGH };
  }
  return { thinkingBudget };
}

// ─── STT — Gemini multimodal ─────────────────────────────────────────────────

export async function transcribeAudioGemini(
  buffer: Buffer,
  _filename: string,
  mimeType: string,
  opts: { model?: string; meter?: MeterCtx } = {},
): Promise<string> {
  const ai = getClient();
  const model =
    opts.model ?? process.env.GEMINI_STT_MODEL ?? process.env.GEMINI_MODEL ?? "gemini-3.5-flash";
  const t0 = Date.now();

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType, data: buffer.toString("base64") } },
          {
            text:
              "Transcreva o áudio a seguir em português brasileiro. " +
              "Responda APENAS com a transcrição literal do que foi falado, sem comentários, " +
              "aspas, timestamps (ex.: 00:00) ou pontuação extra. " +
              "Se não houver fala inteligível, responda com string vazia. " +
              `Nomes próprios do domínio (grafe exatamente assim quando ouvir): ${STT_VOCABULARY_PROMPT}`,
          },
        ],
      },
    ],
    // sem thinking na transcrição: é tarefa mecânica, thinking só adiciona latência
    config: {
      temperature: 0,
      thinkingConfig: buildThinkingConfig(model, 0),
    },
  });

  const usage = usageFromGeminiMeta(response.usageMetadata);
  if (opts.meter) {
    void recordLlmCall({
      userId: opts.meter.userId,
      provider: "gemini",
      model,
      intent: "stt",
      usage,
      latencyMs: Date.now() - t0,
      cacheHit: false,
      voiceMode: opts.meter.voiceMode,
    });
  }

  return (response.text ?? "").trim();
}

// ─── LLM — Gemini Flash ──────────────────────────────────────────────────────

export async function chatCompletionGemini(
  transcript: string,
  opts: {
    history?: ChatMessage[];
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    thinkingBudget?: number;
  } = {},
): Promise<{ text: string; usage: LlmUsage }> {
  const ai = getClient();
  const model = opts.model ?? process.env.GEMINI_MODEL ?? "gemini-3.5-flash";
  const temperature = opts.temperature ?? Number.parseFloat(process.env.GEMINI_TEMPERATURE ?? "0.3");
  // maxOutputTokens é o TOTAL (thinking + resposta). Como os tokens de raciocínio
  // do Gemini contam aqui, deixamos folga p/ caber o thinking E a resposta
  // completa — senão o pensamento consome tudo e a fala sai cortada.
  const maxOutputTokens = opts.maxTokens ?? Number.parseInt(process.env.GEMINI_MAX_TOKENS ?? "2048", 10);
  // Raciocínio interno. Ligado (1024) p/ respostas mais elaboradas.
  // 0 = desligado (mais rápido); -1 = automático; N = orçamento fixo (2.5) / nível (3.x).
  const thinkingBudget =
    opts.thinkingBudget ?? Number.parseInt(process.env.GEMINI_THINKING_BUDGET ?? "1024", 10);

  // Gemini usa "model" no lugar de "assistant"
  const contents = [
    ...(opts.history ?? []).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: transcript }] },
  ];

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      ...(opts.systemPrompt ? { systemInstruction: opts.systemPrompt } : {}),
      temperature,
      maxOutputTokens,
      thinkingConfig: buildThinkingConfig(model, thinkingBudget),
    },
  });

  const m = response.usageMetadata;
  const usage: LlmUsage = usageFromGeminiMeta(m);

  return { text: (response.text ?? "").trim(), usage };
}

/**
 * Streaming do LLM: yield de deltas de texto; retorno do gerador é o usage.
 * Pipeline frase-a-frase (US-3.2).
 */
export async function* chatCompletionGeminiStream(
  transcript: string,
  opts: {
    history?: ChatMessage[];
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    thinkingBudget?: number;
  } = {},
): AsyncGenerator<string, LlmUsage, void> {
  const ai = getClient();
  const model = opts.model ?? process.env.GEMINI_MODEL ?? "gemini-3.5-flash";
  const temperature = opts.temperature ?? Number.parseFloat(process.env.GEMINI_TEMPERATURE ?? "0.3");
  const maxOutputTokens = opts.maxTokens ?? Number.parseInt(process.env.GEMINI_MAX_TOKENS ?? "2048", 10);
  const thinkingBudget =
    opts.thinkingBudget ?? Number.parseInt(process.env.GEMINI_THINKING_BUDGET ?? "1024", 10);

  const contents = [
    ...(opts.history ?? []).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: transcript }] },
  ];

  const stream = await ai.models.generateContentStream({
    model,
    contents,
    config: {
      ...(opts.systemPrompt ? { systemInstruction: opts.systemPrompt } : {}),
      temperature,
      maxOutputTokens,
      thinkingConfig: buildThinkingConfig(model, thinkingBudget),
    },
  });

  let usage: LlmUsage = EMPTY_USAGE;
  for await (const chunk of stream) {
    const t = chunk.text ?? "";
    if (t) yield t;
    const m = chunk.usageMetadata;
    if (m) {
      usage = usageFromGeminiMeta(m);
    }
  }
  return usage;
}

// ─── TTS — Gemini TTS (PCM → WAV) ────────────────────────────────────────────

/**
 * Empacota PCM linear (L16 mono) num container WAV tocável no browser.
 * Alinha amostra (par) e acrescenta silêncio final — Gemini TTS costuma
 * truncar a última sílaba se o WAV termina no último sample falado.
 */
function pcmToWav(pcmIn: Buffer, sampleRate: number): Buffer {
  const channels = 1;
  const bitsPerSample = 16;
  const blockAlign = (channels * bitsPerSample) / 8;
  // 16-bit: comprimento ímpar = sample incompleto → browser corta o fim
  let pcm = pcmIn.length % 2 === 1 ? pcmIn.subarray(0, pcmIn.length - 1) : pcmIn;
  const silenceMs = Number.parseInt(process.env.GEMINI_TTS_TAIL_MS ?? "320", 10);
  const silenceBytes = Math.max(0, Math.floor((sampleRate * silenceMs) / 1000)) * blockAlign;
  if (silenceBytes > 0) {
    pcm = Buffer.concat([pcm, Buffer.alloc(silenceBytes)]);
  }
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // subchunk1 size (PCM)
  header.writeUInt16LE(1, 20); // audio format = PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

/** Extrai a taxa de amostragem do mime "audio/L16;rate=24000" (default 24000). */
function sampleRateFromMime(mime: string | undefined): number {
  const m = mime?.match(/rate=(\d+)/i);
  const n = m ? Number.parseInt(m[1], 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 24_000;
}

export async function synthesizeSpeechGemini(
  text: string,
  opts: { voice?: string; model?: string; meter?: MeterCtx } = {},
): Promise<{ audio: Buffer; mimeType: string }> {
  const ai = getClient();
  const model = opts.model ?? process.env.GEMINI_TTS_MODEL ?? "gemini-3.1-flash-tts-preview";
  const voiceName = opts.voice ?? process.env.GEMINI_TTS_VOICE ?? "Charon";
  const t0 = Date.now();

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName } },
      },
    },
  });

  const usage = usageFromGeminiMeta(response.usageMetadata);
  if (opts.meter) {
    void recordLlmCall({
      userId: opts.meter.userId,
      provider: "gemini",
      model,
      intent: "tts",
      usage,
      latencyMs: Date.now() - t0,
      cacheHit: false,
      voiceMode: opts.meter.voiceMode,
    });
  }

  const part = response.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData?.data,
  );
  const data = part?.inlineData?.data;
  if (!data) throw new Error("Gemini TTS não retornou áudio");

  const pcm = Buffer.from(data, "base64");
  const wav = pcmToWav(pcm, sampleRateFromMime(part?.inlineData?.mimeType));
  return { audio: wav, mimeType: "audio/wav" };
}

/**
 * TTS Gemini em modo STREAM (`generateContentStream`). Coleta os chunks PCM à
 * medida que chegam → melhor time-to-first-chunk e menor risco de estourar
 * timeout unário. Retorna o WAV completo (montagem server-side).
 *
 * Ativa via `GEMINI_TTS_STREAM=true`. Nota: a reprodução no cliente ainda é do
 * blob completo; o ganho real de streaming progressivo exige SSE + MediaSource.
 */
export async function synthesizeSpeechGeminiStream(
  text: string,
  opts: { voice?: string; model?: string; meter?: MeterCtx } = {},
): Promise<{ audio: Buffer; mimeType: string }> {
  const ai = getClient();
  const model = opts.model ?? process.env.GEMINI_TTS_MODEL ?? "gemini-3.1-flash-tts-preview";
  const voiceName = opts.voice ?? process.env.GEMINI_TTS_VOICE ?? "Charon";
  const t0 = Date.now();

  const stream = await ai.models.generateContentStream({
    model,
    contents: [{ role: "user", parts: [{ text }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName } },
      },
    },
  });

  const chunks: Buffer[] = [];
  let mimeType: string | undefined;
  let lastUsage: ReturnType<typeof usageFromGeminiMeta> | undefined;
  for await (const ev of stream) {
    const part = ev.candidates?.[0]?.content?.parts?.find(
      (p) => p.inlineData?.data,
    );
    if (part?.inlineData?.data) {
      chunks.push(Buffer.from(part.inlineData.data, "base64"));
      if (part.inlineData.mimeType) mimeType = part.inlineData.mimeType;
    }
    if (ev.usageMetadata) lastUsage = usageFromGeminiMeta(ev.usageMetadata);
  }

  if (opts.meter) {
    void recordLlmCall({
      userId: opts.meter.userId,
      provider: "gemini",
      model,
      intent: "tts",
      usage: lastUsage ?? usageFromGeminiMeta(undefined),
      latencyMs: Date.now() - t0,
      cacheHit: false,
      voiceMode: opts.meter.voiceMode,
    });
  }

  const pcm = Buffer.concat(chunks);
  if (pcm.length === 0) throw new Error("Gemini TTS stream não retornou áudio");
  const wav = pcmToWav(pcm, sampleRateFromMime(mimeType));
  return { audio: wav, mimeType: "audio/wav" };
}
