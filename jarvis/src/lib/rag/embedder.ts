/**
 * Embeddings RAG — segue a LLM ativa (llm_settings / INFERENCE_PROVIDER).
 *
 * Backend:
 *   gemini*  → Gemini Embedding (gemini-embedding-001, output 768)
 *   openai*  → OpenAI text-embedding-3-small (dimensions: 768)
 *   local    → Ollama nomic-embed-text (768)
 *
 * Override opcional: RAG_EMBED_PROVIDER=gemini|openai|ollama|auto
 * Dimensão fixa EMBED_DIMS (default 768) — deve bater com pgvector (migration 003).
 *
 * Ao trocar de provider de embed, reindexar as fontes (espaços vetoriais diferentes).
 */

import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

import { getLlmSettings, isGemini, isOpenAi } from "@/lib/llm/settings";
import { recordLlmCall } from "@/lib/llm/usage";

export const EMBED_DIMS = parseInt(process.env.OLLAMA_EMBED_DIMS ?? "768", 10);

export type EmbedBackend = "gemini" | "openai" | "ollama";

function getOllamaBaseUrl(): string | null {
  if (process.env.OLLAMA_BASE_URL) return process.env.OLLAMA_BASE_URL;
  const llmUrl = process.env.LOCAL_LLM_BASE_URL;
  if (!llmUrl) return null;
  return llmUrl.replace(/\/v1\/?$/, "");
}

function hasGeminiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

function hasOpenAiKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

/** Credenciais mínimas: algum backend possível (sync — UI/status). */
export function isEmbedderAvailable(): boolean {
  return hasGeminiKey() || hasOpenAiKey() || Boolean(getOllamaBaseUrl());
}

function geminiEmbedModel(): string {
  return process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";
}

function openAiEmbedModel(): string {
  return process.env.OPENAI_EMBED_MODEL ?? "text-embedding-3-small";
}

function ollamaEmbedModel(): string {
  return process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text";
}

/** Resolve backend a partir da LLM ativa (+ override env). */
export async function resolveEmbedBackend(): Promise<EmbedBackend> {
  const override = process.env.RAG_EMBED_PROVIDER?.trim().toLowerCase();
  if (override === "gemini" || override === "openai" || override === "ollama") {
    return override;
  }

  const settings = await getLlmSettings();
  if (isGemini(settings)) return "gemini";
  if (isOpenAi(settings)) return "openai";
  return "ollama";
}

function fitDims(vec: number[]): number[] {
  if (vec.length === EMBED_DIMS) return vec;
  if (vec.length > EMBED_DIMS) return vec.slice(0, EMBED_DIMS);
  // pad (raro) — evita crash no insert pgvector
  return [...vec, ...new Array(EMBED_DIMS - vec.length).fill(0)];
}

const BATCH_SIZE = 32;

async function embedOllama(texts: string[]): Promise<(number[] | null)[]> {
  const baseUrl = getOllamaBaseUrl();
  if (!baseUrl) throw new Error("Ollama indisponível — LOCAL_LLM_BASE_URL / OLLAMA_BASE_URL");

  const results: (number[] | null)[] = new Array(texts.length).fill(null);
  const model = ollamaEmbedModel();

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const res = await fetch(`${baseUrl}/api/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, input: batch }),
      signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Ollama embed error ${res.status}: ${err}`);
    }
    const data = (await res.json()) as { embeddings: number[][] };
    for (let j = 0; j < data.embeddings.length; j++) {
      results[i + j] = fitDims(data.embeddings[j] ?? []);
    }
  }
  return results;
}

async function embedOpenAi(texts: string[]): Promise<(number[] | null)[]> {
  if (!hasOpenAiKey()) throw new Error("OPENAI_API_KEY não configurado");

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const results: (number[] | null)[] = new Array(texts.length).fill(null);
  const model = openAiEmbedModel();
  const t0 = Date.now();
  let promptTokens = 0;

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const res = await client.embeddings.create({
      model,
      input: batch,
      dimensions: EMBED_DIMS,
    });
    promptTokens += res.usage?.total_tokens ?? res.usage?.prompt_tokens ?? 0;
    for (const item of res.data) {
      results[i + item.index] = fitDims(item.embedding);
    }
  }

  if (promptTokens > 0) {
    void recordLlmCall({
      provider: "openai",
      model,
      intent: "embed",
      usage: {
        promptTokens,
        completionTokens: 0,
        thinkingTokens: 0,
        totalTokens: promptTokens,
      },
      latencyMs: Date.now() - t0,
      cacheHit: false,
      voiceMode: "rag",
    });
  }

  return results;
}

async function embedGemini(texts: string[]): Promise<(number[] | null)[]> {
  if (!hasGeminiKey()) throw new Error("GEMINI_API_KEY não configurado");

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const model = geminiEmbedModel();
  const results: (number[] | null)[] = new Array(texts.length).fill(null);
  const t0 = Date.now();
  // Gemini embed API não devolve usageMetadata confiável → estima ~chars/4
  const estTokens = Math.max(
    1,
    Math.ceil(texts.reduce((n, t) => n + t.length, 0) / 4),
  );

  // SDK: um texto (ou array) por chamada; batch pequeno pra não estourar payload
  const GEMINI_BATCH = 16;
  for (let i = 0; i < texts.length; i += GEMINI_BATCH) {
    const batch = texts.slice(i, i + GEMINI_BATCH);
    const res = await ai.models.embedContent({
      model,
      contents: batch,
      config: { outputDimensionality: EMBED_DIMS },
    });

    const embeddings = res.embeddings ?? [];
    for (let j = 0; j < embeddings.length; j++) {
      const values = embeddings[j]?.values;
      results[i + j] = values?.length ? fitDims(values) : null;
    }
  }

  void recordLlmCall({
    provider: "gemini",
    model,
    intent: "embed",
    usage: {
      promptTokens: estTokens,
      completionTokens: 0,
      thinkingTokens: 0,
      totalTokens: estTokens,
    },
    latencyMs: Date.now() - t0,
    cacheHit: false,
    voiceMode: "rag",
  });

  return results;
}

async function embedWithBackend(
  backend: EmbedBackend,
  texts: string[],
): Promise<(number[] | null)[]> {
  switch (backend) {
    case "gemini":
      return embedGemini(texts);
    case "openai":
      return embedOpenAi(texts);
    case "ollama":
      return embedOllama(texts);
  }
}

/**
 * Gera embeddings seguindo a LLM ativa.
 * Se o backend primário falhar e RAG_EMBED_FALLBACK=true, tenta os outros
 * (cuidado: misturar espaços vetoriais sem reindex degradar retrieval).
 */
export async function embedBatch(texts: string[]): Promise<(number[] | null)[]> {
  if (texts.length === 0) return [];

  const primary = await resolveEmbedBackend();
  try {
    return await embedWithBackend(primary, texts);
  } catch (primaryErr) {
    if (process.env.RAG_EMBED_FALLBACK !== "true") throw primaryErr;

    const order: EmbedBackend[] = ["gemini", "openai", "ollama"].filter(
      (b) => b !== primary,
    ) as EmbedBackend[];
    let last = primaryErr;
    for (const b of order) {
      try {
        console.warn(
          `[embedder] fallback ${primary}→${b}:`,
          primaryErr instanceof Error ? primaryErr.message : primaryErr,
        );
        return await embedWithBackend(b, texts);
      } catch (e) {
        last = e;
      }
    }
    throw last;
  }
}

export async function embedOne(text: string): Promise<number[] | null> {
  const results = await embedBatch([text]);
  return results[0] ?? null;
}

/** Info para /api/rag/status */
export async function getEmbedderInfo(): Promise<{
  available: boolean;
  backend: EmbedBackend | null;
  dims: number;
}> {
  if (!isEmbedderAvailable()) {
    return { available: false, backend: null, dims: EMBED_DIMS };
  }
  try {
    const backend = await resolveEmbedBackend();
    return { available: true, backend, dims: EMBED_DIMS };
  } catch {
    return { available: true, backend: null, dims: EMBED_DIMS };
  }
}
