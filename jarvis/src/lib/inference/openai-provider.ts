/**
 * OpenAI Provider — modo nuvem alternativo ao stack OSS local.
 * Ativado quando OPENAI_API_KEY está configurado.
 *
 * STT  → Whisper API  (whisper-1)
 * LLM  → GPT-4o-mini  (padrão) ou OPENAI_MODEL
 * TTS  → TTS-1        (voz OPENAI_TTS_VOICE, padrão "nova")
 */

import OpenAI from "openai";
import { STT_VOCABULARY_PROMPT } from "@/lib/jarvis-context";
import type { ChatMessage } from "@/lib/voice/types";
import {
  EMPTY_USAGE,
  openAiTtsCostUsd,
  recordLlmCall,
  whisperCostUsd,
  type LlmUsage,
  type MeterCtx,
} from "@/lib/llm/usage";

// Singleton: reusa keep-alive HTTP/2, DNS cache e conexões TLS entre requests.
// Antes: new OpenAI a cada call → 50–200 ms de handshake por turno de voz.
let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (_client) return _client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY não configurado");
  // Default do SDK é 10min timeout + 2 retries → um engasgo de rede pendura o
  // turno de voz por minutos. Aqui limita globalmente; STT/TTS ainda passam
  // timeouts próprios (curtos, sem retry) por serem latency-críticos.
  _client = new OpenAI({
    apiKey,
    timeout: Number.parseInt(process.env.OPENAI_TIMEOUT_MS ?? "20000", 10),
    maxRetries: Number.parseInt(process.env.OPENAI_MAX_RETRIES ?? "1", 10),
  });
  return _client;
}

const STT_TIMEOUT_MS = Number.parseInt(process.env.OPENAI_STT_TIMEOUT_MS ?? "12000", 10);
const TTS_TIMEOUT_MS = Number.parseInt(process.env.OPENAI_TTS_TIMEOUT_MS ?? "12000", 10);

export function isOpenAiAvailable(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

// ─── STT — Whisper API ───────────────────────────────────────────────────────

export async function transcribeAudioOpenAI(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  opts: { model?: string; meter?: MeterCtx } = {},
): Promise<string> {
  const client = getClient();
  // Default: gpt-4o-mini-transcribe (mais rápido/preciso que whisper-1 em PT-BR).
  // Override por OPENAI_STT_MODEL ou opts.model. whisper-1 mantido p/ fallback.
  const model = opts.model ?? process.env.OPENAI_STT_MODEL ?? "gpt-4o-mini-transcribe";
  const t0 = Date.now();

  // O SDK espera um File ou ReadableStream com .name
  const file = new File([new Uint8Array(buffer)], filename, { type: mimeType });

  // Só whisper-1 suporta verbose_json (+ duration p/ custo). Modelos gpt-4o-*
  // transcribe aceitam apenas json|text e não devolvem duration.
  const supportsVerbose = model === "whisper-1";
  const response = await client.audio.transcriptions.create(
    {
      file,
      model,
      language: "pt",
      response_format: supportsVerbose ? "verbose_json" : "json",
      prompt: STT_VOCABULARY_PROMPT,
    },
    // voz: falha rápido sem retry (retry dobraria a latência do turno)
    { timeout: STT_TIMEOUT_MS, maxRetries: 0 },
  );

  const text = (response.text ?? "").trim();
  const durationSec = supportsVerbose
    ? Number((response as { duration?: number }).duration ?? 0)
    : 0;
  if (opts.meter) {
    void recordLlmCall({
      userId: opts.meter.userId,
      provider: "openai",
      model,
      intent: "stt",
      usage: {
        promptTokens: 0,
        completionTokens: 0,
        thinkingTokens: 0,
        totalTokens: 0,
      },
      latencyMs: Date.now() - t0,
      cacheHit: false,
      voiceMode: opts.meter.voiceMode,
      costUsdOverride: whisperCostUsd(durationSec),
    });
  }

  return text;
}

// ─── LLM — GPT-4o-mini ──────────────────────────────────────────────────────

export async function chatCompletionOpenAI(
  transcript: string,
  opts: {
    history?: ChatMessage[];
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {},
): Promise<{ text: string; usage: LlmUsage }> {
  const client = getClient();
  const model = opts.model ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

  if (opts.systemPrompt) {
    messages.push({ role: "system", content: opts.systemPrompt });
  }

  for (const m of opts.history ?? []) {
    messages.push({ role: m.role, content: m.content });
  }

  messages.push({ role: "user", content: transcript });

  // 512 era baixo p/ explicação + bloco mermaid — a resposta saía cortada.
  const maxTokens = opts.maxTokens ?? Number.parseInt(process.env.OPENAI_MAX_TOKENS ?? "1024", 10);

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: opts.temperature ?? 0.7,
    max_tokens: maxTokens,
  });

  const u = response.usage;
  const usage: LlmUsage = u
    ? {
        promptTokens: u.prompt_tokens ?? 0,
        completionTokens: u.completion_tokens ?? 0,
        // o-series expõe reasoning_tokens; 4o não tem (0)
        thinkingTokens: u.completion_tokens_details?.reasoning_tokens ?? 0,
        totalTokens: u.total_tokens ?? 0,
        cachedInputTokens: u.prompt_tokens_details?.cached_tokens ?? 0,
      }
    : EMPTY_USAGE;

  return { text: response.choices[0]?.message?.content?.trim() ?? "", usage };
}

/**
 * Streaming do LLM: yield de deltas de texto; o valor de RETORNO do gerador é o
 * usage (tokens). Usado no pipeline frase-a-frase (US-3.2).
 */
export async function* chatCompletionOpenAIStream(
  transcript: string,
  opts: {
    history?: ChatMessage[];
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {},
): AsyncGenerator<string, LlmUsage, void> {
  const client = getClient();
  const model = opts.model ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  if (opts.systemPrompt) messages.push({ role: "system", content: opts.systemPrompt });
  for (const m of opts.history ?? []) messages.push({ role: m.role, content: m.content });
  messages.push({ role: "user", content: transcript });

  const maxTokens = opts.maxTokens ?? Number.parseInt(process.env.OPENAI_MAX_TOKENS ?? "1024", 10);

  const stream = await client.chat.completions.create({
    model,
    messages,
    temperature: opts.temperature ?? 0.7,
    max_tokens: maxTokens,
    stream: true,
    stream_options: { include_usage: true },
  });

  let usage: LlmUsage = EMPTY_USAGE;
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? "";
    if (delta) yield delta;
    if (chunk.usage) {
      usage = {
        promptTokens: chunk.usage.prompt_tokens ?? 0,
        completionTokens: chunk.usage.completion_tokens ?? 0,
        thinkingTokens: chunk.usage.completion_tokens_details?.reasoning_tokens ?? 0,
        totalTokens: chunk.usage.total_tokens ?? 0,
        // OpenAI prompt caching automático (>=1024 tokens de prefixo estável).
        // >0 = cache hit; economiza ~50% do custo do input cacheado e reduz TTFT.
        cachedInputTokens:
          chunk.usage.prompt_tokens_details?.cached_tokens ?? 0,
      };
    }
  }
  return usage;
}

// ─── TTS — OpenAI TTS-1 ─────────────────────────────────────────────────────

export async function synthesizeSpeechOpenAI(
  text: string,
  opts: { voice?: string; model?: string; meter?: MeterCtx } = {},
): Promise<{ audio: Buffer; mimeType: string }> {
  const client = getClient();
  const voice = (opts.voice ?? process.env.OPENAI_TTS_VOICE ?? "nova") as OpenAI.Audio.SpeechCreateParams["voice"];
  const model = (opts.model ?? process.env.OPENAI_TTS_MODEL ?? "tts-1") as OpenAI.Audio.SpeechModel;
  const t0 = Date.now();

  // Velocidade de fala. 1.0 = default. Faixa útil ~0.9–1.3 (voice UX).
  // Acima de 1.3 fica corrido; abaixo de 0.9 fica arrastado. OpenAI aceita 0.25–4.0.
  const speedRaw = Number.parseFloat(process.env.OPENAI_TTS_SPEED ?? "1.0");
  const speed =
    Number.isFinite(speedRaw) && speedRaw >= 0.25 && speedRaw <= 4
      ? speedRaw
      : 1.0;

  // instructions: só suportado no gpt-4o-mini-tts. Descrição em NL do estilo
  // (ritmo, tom, sotaque). Ex.: "Fale em pt-BR, ritmo natural mas ágil, tom
  // profissional e acolhedor de anfitrião — sem lentidão nem robotização."
  const isMiniTts = /gpt-4o-mini-tts/i.test(model);
  const instructions =
    isMiniTts && process.env.OPENAI_TTS_INSTRUCTIONS?.trim()
      ? process.env.OPENAI_TTS_INSTRUCTIONS.trim()
      : undefined;

  const response = await client.audio.speech.create(
    {
      model,
      voice,
      input: text,
      response_format: "mp3",
      speed,
      ...(instructions ? { instructions } : {}),
    },
    { timeout: TTS_TIMEOUT_MS, maxRetries: 0 },
  );

  if (opts.meter) {
    void recordLlmCall({
      userId: opts.meter.userId,
      provider: "openai",
      model,
      intent: "tts",
      usage: {
        promptTokens: text.length,
        completionTokens: 0,
        thinkingTokens: 0,
        totalTokens: text.length,
      },
      latencyMs: Date.now() - t0,
      cacheHit: false,
      voiceMode: opts.meter.voiceMode,
      costUsdOverride: openAiTtsCostUsd(text.length, model),
    });
  }

  const arrayBuffer = await response.arrayBuffer();
  return {
    audio: Buffer.from(arrayBuffer),
    mimeType: "audio/mpeg",
  };
}
