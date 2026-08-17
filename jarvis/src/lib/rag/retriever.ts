/**
 * RAG Retriever — US-8.3 / US-8.4
 * Dois caminhos:
 *   1. retrieve()         — pgvector HNSW (semântico, requer Ollama + Supabase admin)
 *   2. retrieveChunks()   — keyword TF-IDF sobre índice in-memory (fallback sem servidor)
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { embedOne } from '@/lib/rag/embedder';
import {
  isCompanyTimelineQuery,
  timelinePathBoost,
} from '@/lib/rag/path-policy';
import type { RagChunk, RagHit } from '@/lib/rag/types';

export interface RetrieveOptions {
  topK?: number;
  threshold?: number;
  sourceId?: string;
}

export interface RetrieveResult {
  chunks: RagChunk[];
  embeddingAvailable: boolean;
}

function expandQueryForEmbed(query: string): string {
  if (!isCompanyTimelineQuery(query)) return query;
  return `${query} Foursys empresa marcos históricos fundação timeline Nasce a Foursys 2000`;
}

function rerankTimelineChunks(query: string, chunks: RagChunk[]): RagChunk[] {
  if (!isCompanyTimelineQuery(query) || chunks.length === 0) return chunks;
  return [...chunks]
    .map((c) => ({
      chunk: c,
      rank: (c.similarity ?? 0) + timelinePathBoost(c.metadata?.path ?? ''),
    }))
    .sort((a, b) => b.rank - a.rank)
    .map(({ chunk, rank }) => ({ ...chunk, similarity: rank }));
}

async function matchOnce(
  db: ReturnType<typeof createAdminClient>,
  embedding: number[],
  matchCount: number,
  threshold: number,
  filterSourceId: string | null,
): Promise<RagChunk[]> {
  const { data, error } = await db.rpc('match_document_chunks', {
    query_embedding: embedding,
    match_count: matchCount,
    match_threshold: threshold,
    filter_source_id: filterSourceId,
  });
  if (error) throw new Error(`RAG retrieval error: ${error.message}`);
  return (data ?? []) as RagChunk[];
}

/**
 * Busca os chunks mais relevantes para a query.
 * Se embedder não disponível, retorna chunks vazios (graceful fallback).
 *
 * B3 — 1 RPC global (`filter_source_id=null`) + diversify in-app.
 * Antes: list sources + N× match_document_chunks (1 RTT por fonte).
 */
export async function retrieve(query: string, opts: RetrieveOptions = {}): Promise<RetrieveResult> {
  const { topK = 5, threshold = 0.7, sourceId } = opts;

  const embedQuery = expandQueryForEmbed(query);
  const embedding = await embedOne(embedQuery);

  if (!embedding) {
    return { chunks: [], embeddingAvailable: false };
  }

  const db = createAdminClient();
  const thr = isCompanyTimelineQuery(query) ? Math.min(threshold, 0.55) : threshold;

  // Fonte única pedida — caminho simples
  if (sourceId) {
    const perSource = Math.max(topK * 3, 10);
    const ranked = rerankTimelineChunks(
      query,
      await matchOnce(db, embedding, perSource, thr, sourceId),
    );
    return { chunks: ranked.slice(0, topK), embeddingAvailable: true };
  }

  // B3 — pool global largo o bastante p/ diversify cobrir Portal + Site + wiki
  const fetchCount = Math.max(topK * 8, 24);
  const ranked = rerankTimelineChunks(
    query,
    await matchOnce(db, embedding, fetchCount, thr, null),
  );
  return {
    chunks: diversifyBySource(ranked, topK),
    embeddingAvailable: true,
  };
}

/**
 * Round-robin por fonte: 1º de cada source_id, depois preenche por score.
 * Evita 5/5 hits só do Portal quando Site Foursys / wiki também rankearam.
 */
export function diversifyBySource(chunks: RagChunk[], topK: number): RagChunk[] {
  if (chunks.length <= topK) return chunks;
  const groups = new Map<string, RagChunk[]>();
  for (const c of chunks) {
    const id = c.source_id ?? c.metadata?.source_name ?? "unknown";
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id)!.push(c);
  }
  const queues = [...groups.values()].map((g) => [...g]);
  const out: RagChunk[] = [];
  let progressed = true;
  while (out.length < topK && progressed) {
    progressed = false;
    for (const q of queues) {
      if (out.length >= topK) break;
      if (q.length === 0) continue;
      out.push(q.shift()!);
      progressed = true;
    }
  }
  return out;
}

// Contexto enxuto para o LLM pequeno (llama3.2:3b): trechos demais/longos
// dispersam o modelo e aumentam a latência em CPU. Cap + trim configuráveis.
const RAG_CTX_MAX_CHUNKS = Number.parseInt(
  process.env.RAG_CONTEXT_MAX_CHUNKS ?? '3',
  10,
);
const RAG_CTX_MAX_CHARS = Number.parseInt(
  process.env.RAG_CONTEXT_MAX_CHARS ?? '700',
  10,
);

function trimChunk(text: string): string {
  const s = text.replace(/\s+/g, ' ').trim();
  if (s.length <= RAG_CTX_MAX_CHARS) return s;
  // corta na última fronteira de palavra para não truncar no meio
  const cut = s.lastIndexOf(' ', RAG_CTX_MAX_CHARS);
  return `${s.slice(0, cut > 0 ? cut : RAG_CTX_MAX_CHARS)}…`;
}

export type ContextItem = { src: string; path: string; content: string };

/** Monta o bloco de contexto (compartilhado pgvector + keyword + híbrido). */
function buildContextBlock(items: ContextItem[], max = RAG_CTX_MAX_CHUNKS): string {
  const top = items.slice(0, max);
  if (top.length === 0) return '';
  const sections = top.map(
    (it, i) => `[Fonte ${i + 1}: ${it.src} — ${it.path}]\n${trimChunk(it.content)}`,
  );
  return `## Contexto recuperado da base de conhecimento\n\n${sections.join('\n\n---\n\n')}`;
}

/** Formata uma lista já combinada (pgvector + agentes) com cap próprio. */
export function formatContextItems(items: ContextItem[], max?: number): string {
  return buildContextBlock(items, max);
}

/**
 * Formata RagChunk[] em contexto injetável no prompt do LLM (pgvector path).
 */
export function formatContext(chunks: RagChunk[]): string {
  return buildContextBlock(
    chunks.map((c) => ({
      src: c.metadata?.source_name ?? 'desconhecida',
      path: c.metadata?.path ?? '',
      content: c.content,
    })),
  );
}

// ─── Keyword / TF-IDF fallback (sem servidor remoto) ────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-záàâãéèêíìîóòôõúùûç\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

/**
 * Busca keyword (TF-IDF simplificado) sobre índice in-memory.
 * Usado quando pgvector não está disponível.
 */
export function retrieveChunks(
  question: string,
  chunks: RagChunk[],
  topK = 5,
  minScore = 0.12,
): RagHit[] {
  if (chunks.length === 0) return [];

  const qTokens = new Set(tokenize(question));
  if (qTokens.size === 0) return [];

  const scored = chunks
    .map((c) => {
      const cTokens = tokenize(c.content);
      if (cTokens.length === 0) return null;

      const freq = new Map<string, number>();
      for (const t of cTokens) freq.set(t, (freq.get(t) ?? 0) + 1);

      let overlap = 0;
      for (const qt of qTokens) {
        if (freq.has(qt)) overlap += (freq.get(qt)! / cTokens.length);
      }

      const score = overlap / qTokens.size;
      return score >= minScore ? { chunk: c, score } : null;
    })
    .filter((x): x is { chunk: RagChunk; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored.map(({ chunk, score }) => ({
    sourceId: chunk.source_id ?? chunk.metadata?.source_name ?? 'local',
    sourceName: chunk.metadata?.source_name ?? 'Local',
    path: chunk.metadata?.path ?? '',
    url: chunk.metadata?.url,
    content: chunk.content,
    score,
  }));
}

/**
 * Formata RagHit[] em contexto injetável (keyword path).
 */
export function formatRagContext(hits: RagHit[]): string {
  return buildContextBlock(
    hits.map((h) => ({
      src: h.sourceName,
      path: h.path,
      content: h.content,
    })),
  );
}
