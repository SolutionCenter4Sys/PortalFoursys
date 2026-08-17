import { classifyIntent, type JarvisIntent } from "@/lib/jarvis-context";

import { createAdminClient, isAdminClientAvailable } from "@/lib/supabase/admin";
import { isEmbedderAvailable } from "@/lib/rag/embedder";
import { isBriefingsPath } from "@/lib/rag/path-policy";
import {
  retrieve,
  formatContextItems,
  retrieveChunks,
  formatRagContext,
  type ContextItem,
} from "./retriever";
import { ensureIndex, loadIndex } from "./index-store";
import type { RagChunk, RagHit, RagQueryResult } from "./types";
import type { ChatMessage } from "@/lib/voice/types";

// Fontes que vivem SÓ no índice keyword (não foram indexadas no Supabase):
// agentes Foursys e docs locais do Jarvis. São mescladas ao pgvector p/ que a
// busca semântica não fique restrita ao PortalFoursys.
const KEYWORD_ONLY_SOURCES = [
  "foursys-agents",
  "ai-dlc-jarvis",
  "jarvis-wiki-karpathy",
];
const HYBRID_AGENT_HITS = Number.parseInt(
  process.env.RAG_HYBRID_AGENT_HITS ?? "2",
  10,
);

const STOP_LEXICAL = new Set([
  "sobre",
  "voce",
  "você",
  "tem",
  "informação",
  "informacao",
  "ali",
  "dessa",
  "deste",
  "essa",
  "esse",
  "aqui",
  "para",
  "como",
  "qual",
  "quais",
  "onde",
  "quando",
  "foursys",
  "jarvis",
  "portal",
  "site",
]);

/** Tokens raros / nomes próprios (≥5 letras) p/ match lexical exato no banco. */
function lexicalTokens(question: string): string[] {
  return question
    .split(/[^\p{L}\p{N}]+/u)
    .map((t) => t.trim())
    .filter(
      (t) =>
        t.length >= 5 &&
        !STOP_LEXICAL.has(t.toLowerCase()) &&
        (/^[A-ZÁÉÍÓÚÂÊÔÃÕ]/.test(t) || t.length >= 7),
    )
    .slice(0, 4);
}

/**
 * Busca ILIKE por nomes próprios (ex.: Zaragon) — o semântico do Portal
 * engole entidades raras; o lexical recupera se existir em qualquer fonte.
 * B2 — tokens em paralelo (antes: loop serial 1 RTT cada).
 */
async function lexicalExactHits(question: string): Promise<RagHit[]> {
  if (!isAdminClientAvailable()) return [];
  const tokens = lexicalTokens(question);
  if (tokens.length === 0) return [];

  try {
    const db = createAdminClient();
    const batches = await Promise.all(
      tokens.map(async (token) => {
        const { data } = await db
          .from("document_chunks")
          .select("id, document_id, source_id, content, metadata")
          .ilike("content", `%${token}%`)
          .limit(4);
        return data ?? [];
      }),
    );

    const out: RagHit[] = [];
    const seen = new Set<string>();
    for (const rows of batches) {
      for (const row of rows) {
        const r = row as {
          id: string;
          source_id: string;
          content: string;
          metadata?: {
            path?: string;
            url?: string;
            source_name?: string;
            title?: string;
          };
        };
        const key = `${r.source_id}:${r.metadata?.path ?? r.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
          sourceId: r.source_id,
          sourceName: r.metadata?.source_name ?? "Base de Conhecimento",
          path: r.metadata?.path ?? "",
          url: r.metadata?.url,
          content: r.content,
          score: 0.99,
        });
      }
    }
    return out.slice(0, 4);
  } catch {
    return [];
  }
}

/**
 * Busca hits das fontes keyword-only (agentes/jarvis) no índice JÁ em cache.
 * Usa loadIndex (não ensureIndex) de propósito: nunca dispara o build caro
 * (GitHub + fs) dentro de um turno de voz — se o cache não existe, retorna [].
 */
async function agentKeywordHits(question: string): Promise<RagHit[]> {
  try {
    const idx = await loadIndex();
    if (idx.length === 0) return [];
    const agentChunks = idx.filter((c) =>
      KEYWORD_ONLY_SOURCES.includes(c.source_id ?? ""),
    );
    if (agentChunks.length === 0) return [];
    return retrieveChunks(question, agentChunks, HYBRID_AGENT_HITS, 0.1);
  } catch {
    return [];
  }
}

export function shouldUseRag(
  intent: JarvisIntent,
  transcript: string,
  history?: ChatMessage[],
): boolean {
  // ADR-015 — código / Agent Bridge não usa RAG Portal
  if (intent === "code") return false;
  if (intent === "knowledge") return true;
  const hasFoursys = /\bfoursys\b/i.test(transcript);
  // TokenOps PLUS / wiki — sempre buscar conhecimento curado
  if (
    /\b(token\s*ops|tokenops|wiki|obsidian|karpathy|voz\s+concisa|finops|agent\s+bridge)\b/i.test(
      transcript,
    )
  ) {
    return true;
  }
  if (intent === "meta") return hasFoursys || /\bjarvis\b/i.test(transcript);
  if (hasFoursys) return true;
  // Continuidade de thread: follow-up anafórico ("e depois disso?", "essa
  // trajetória") herda o contexto se a conversa recente já é sobre Foursys.
  if (
    intent === "chat" &&
    history?.some(
      (m) =>
        m.role === "user" &&
        (/\bfoursys\b/i.test(m.content) || classifyIntent(m.content) === "knowledge"),
    )
  ) {
    return true;
  }
  return false;
}

function mergeHits(...lists: RagHit[][]): RagHit[] {
  const seen = new Set<string>();
  const out: RagHit[] = [];
  for (const list of lists) {
    for (const h of list) {
      const key = `${h.sourceId}:${h.path}:${h.content.slice(0, 40)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(h);
    }
  }
  return out;
}

export type RagQueryOpts = {
  /**
   * Portal embed / voz rápida:
   * - só fonte portal-foursys (sem agentes/wiki)
   * - topK menor
   * - sem scan keyword de agentes
   */
  lean?: boolean;
  /** Filtra pgvector a uma fonte (ex.: portal-foursys). */
  sourceId?: string;
};

/**
 * US-8.4 — RAG unificado: pgvector semântico + lexical + keyword local.
 * B2 — retrieve ∥ lexical ∥ agentKeyword (antes agent rodava serial após retrieve).
 */
export async function ragQuery(
  question: string,
  opts: RagQueryOpts = {},
): Promise<RagQueryResult> {
  const lean = opts.lean === true;
  const sourceId =
    opts.sourceId ?? (lean ? "portal-foursys" : undefined);
  const topK = lean ? 3 : 6;
  const ctxN = lean ? 3 : 5;

  // Caminho 1 — pgvector semântico (requer Ollama embedder + Supabase admin key)
  if (isAdminClientAvailable() && isEmbedderAvailable()) {
    try {
      const [{ chunks, embeddingAvailable }, lexical, agentHits] = await Promise.all([
        retrieve(question, {
          topK,
          threshold: lean ? 0.55 : 0.62,
          sourceId,
        }),
        lexicalExactHits(question),
        lean ? Promise.resolve([] as RagHit[]) : agentKeywordHits(question),
      ]);

      if (embeddingAvailable && (chunks.length > 0 || lexical.length > 0 || agentHits.length > 0)) {
        let pgHits: RagHit[] = chunks.map((c: RagChunk) => ({
          sourceId: c.source_id,
          sourceName: c.metadata?.source_name ?? "Base de Conhecimento",
          path: c.metadata?.path ?? "",
          url: c.metadata?.url,
          content: c.content,
          score: c.similarity,
        }));
        // Portal lean: descarta briefings (CV/CIO) — ruído vs institucional
        if (lean) {
          const core = pgHits.filter((h) => !isBriefingsPath(h.path));
          if (core.length > 0) pgHits = core;
        }

        // Lexical primeiro (match exato de entidade), depois diversificado, depois agentes
        const merged = mergeHits(lexical, pgHits, agentHits);
        const ctxHits = merged.slice(0, ctxN);
        const items: ContextItem[] = ctxHits.map((h) => ({
          src: h.sourceName,
          path: h.path,
          content: h.content,
        }));

        return {
          hits: merged,
          contextBlock: formatContextItems(items, ctxHits.length),
          source: "pgvector",
        };
      }
    } catch {
      // pgvector falhou — cai no fallback local
    }
  }

  // Caminho 2 — keyword fallback (sem servidor remoto)
  const chunks = await ensureIndex();
  const scoped = sourceId
    ? chunks.filter((c) => (c.source_id ?? "") === sourceId)
    : chunks;
  const hits = retrieveChunks(question, scoped.length ? scoped : chunks, ctxN, 0.12);
  return {
    hits,
    contextBlock: formatRagContext(hits),
    source: "local",
  };
}

export type RagCitation = {
  sourceName: string;
  path: string;
  url?: string;
  excerpt: string;
};

export function hitsToCitations(hits: RagHit[]): RagCitation[] {
  const seen = new Set<string>();
  const out: RagCitation[] = [];

  for (const h of hits) {
    const key = `${h.sourceId}:${h.path}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      sourceName: h.sourceName,
      path: h.path,
      url: h.url,
      excerpt: h.content.slice(0, 160) + (h.content.length > 160 ? "…" : ""),
    });
    if (out.length >= 3) break;
  }

  return out;
}
