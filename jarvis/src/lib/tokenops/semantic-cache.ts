/**
 * TokenOps — Cache semântico (ADR-009 Fase 1.5) · B4
 *
 * Path cloud: lookup **antes** do LLM em todo turno elegível.
 * 1) hit exacto (hash normalizado) — ~ms, sem embed
 * 2) hit semântico (cosine ≥ threshold) — 1 embed + scan lista
 *
 * Escopo: turnos SEM contexto RAG e SEM mutação (tasks/notas/memórias).
 * Respostas RAG / side-effects não cacheamos (staleness + acks).
 *
 * Redis down → miss graceful + warn (não derruba voz).
 */

import { createHash } from "crypto";

import { embedOne } from "@/lib/rag/embedder";
import {
  isRedisAvailable,
  isRedisConfigured,
  readyRedis,
  redisCacheTtlSeconds,
} from "@/lib/redis/client";
import type { RagCitation } from "@/lib/rag/query";

const CACHE_LIST = "jarvis:cache:general:v2";
const EXACT_PREFIX = "jarvis:cache:exact:v2:";
const MAX_ENTRIES = Number.parseInt(
  process.env.REDIS_SEMANTIC_MAX_ENTRIES ?? "500",
  10,
);

function threshold(): number {
  const raw = process.env.REDIS_SEMANTIC_THRESHOLD;
  const n = raw ? Number.parseFloat(raw) : 0.9;
  return Number.isFinite(n) && n > 0 && n <= 1 ? n : 0.9;
}

/** B4 — cache obrigatório no path cloud salvo opt-out explícito. */
export function isSemanticCacheRequired(): boolean {
  if (process.env.SEMANTIC_CACHE_REQUIRED === "false") return false;
  if (process.env.SEMANTIC_CACHE_REQUIRED === "true") return true;
  // default: ligado quando Redis está configurado (path cloud típico)
  return isRedisConfigured();
}

let warnedMissing = false;
/** Avisa 1×/processo se Redis falta no path onde cache é esperado. */
export function warnSemanticCacheIfMissing(route: string): void {
  if (!isSemanticCacheRequired()) return;
  if (isRedisConfigured()) return;
  if (warnedMissing) return;
  warnedMissing = true;
  console.warn(
    `[tokenops/cache] B4: Redis não configurado em ${route} — cache semântico OFF (defina REDIS_URL ou SEMANTIC_CACHE_REQUIRED=false)`,
  );
}

type CacheEntry = {
  transcript: string;
  assistantText: string;
  /** vetor unitário (normalizado na escrita) — v2 */
  embedding: number[];
  intent?: string;
  citations?: RagCitation[];
  createdAt: number;
};

type ExactPayload = {
  assistantText: string;
  citations?: RagCitation[];
  intent?: string;
};

function normalizeTranscript(t: string): string {
  return t.toLowerCase().replace(/\s+/g, " ").trim();
}

function exactCacheKey(transcript: string): string {
  const h = createHash("sha256")
    .update(normalizeTranscript(transcript))
    .digest("hex")
    .slice(0, 32);
  return `${EXACT_PREFIX}${h}`;
}

function normalize(v: number[]): number[] | null {
  let sum = 0;
  for (let i = 0; i < v.length; i++) sum += v[i] * v[i];
  const norm = Math.sqrt(sum);
  if (norm === 0) return null;
  const out = new Array<number>(v.length);
  for (let i = 0; i < v.length; i++) out[i] = v[i] / norm;
  return out;
}

function dot(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let d = 0;
  for (let i = 0; i < a.length; i++) d += a[i] * b[i];
  return d;
}

/**
 * Computa e normaliza o embedding do transcript UMA vez por turn, para ser
 * reusado em lookupSemanticCache + writeSemanticCache (elimina 1 round-trip
 * ao embedder por turno de voz). Retorna null se embedder off/falha.
 */
export async function precomputeQueryEmbedding(
  transcript: string,
): Promise<number[] | null> {
  if (!transcript?.trim()) return null;
  try {
    const raw = await embedOne(transcript);
    if (!raw) return null;
    return normalize(raw);
  } catch {
    return null;
  }
}

export type SemanticCacheHit = {
  assistantText: string;
  citations?: RagCitation[];
  score: number;
  /** exact = hash; semantic = cosine */
  kind: "exact" | "semantic";
};

/**
 * Pode aplicar hit? Só chit-chat sem RAG e sem side-effect neste turno.
 */
export function canUseSemanticCacheHit(opts: {
  intent?: string;
  ragContext?: string | null;
  tasksChanged?: number;
  notesChanged?: number;
  memoriesSaved?: number;
}): boolean {
  if (opts.intent === "code") return false;
  if (opts.ragContext) return false;
  if ((opts.tasksChanged ?? 0) > 0) return false;
  if ((opts.notesChanged ?? 0) > 0) return false;
  if ((opts.memoriesSaved ?? 0) > 0) return false;
  return true;
}

/**
 * Busca resposta cacheada. Exact primeiro, depois semântico. Null = miss.
 *
 * `precomputedEmbedding` (opcional): vetor JÁ NORMALIZADO do transcript.
 * Quando fornecido, pula o `embedOne(transcript)` interno — a mesma instância
 * é reusada em writeSemanticCache no fim do turno. Elimina 1 round-trip ao
 * embedder por turno de voz.
 */
export async function lookupSemanticCache(
  transcript: string,
  precomputedEmbedding?: number[] | null,
): Promise<SemanticCacheHit | null> {
  if (!transcript.trim()) return null;
  if (!isRedisAvailable()) return null;

  const redis = await readyRedis();
  if (!redis) return null;

  // 1) exact — sem embed
  try {
    const rawExact = await redis.get(exactCacheKey(transcript));
    if (rawExact) {
      const payload = JSON.parse(rawExact) as ExactPayload;
      if (payload.assistantText?.trim()) {
        console.info("[tokenops/cache] HIT exact");
        return {
          assistantText: payload.assistantText,
          citations: payload.citations,
          score: 1,
          kind: "exact",
        };
      }
    }
  } catch {
    /* segue p/ semântico */
  }

  // 2) semântico
  let queryEmbedding: number[] | null;
  if (precomputedEmbedding && precomputedEmbedding.length > 0) {
    queryEmbedding = precomputedEmbedding;
  } else {
    let rawEmbedding: number[] | null;
    try {
      rawEmbedding = await embedOne(transcript);
    } catch {
      return null;
    }
    if (!rawEmbedding) return null;
    queryEmbedding = normalize(rawEmbedding);
  }
  if (!queryEmbedding) return null;

  try {
    const rows = await redis.lrange(CACHE_LIST, 0, MAX_ENTRIES - 1);
    const min = threshold();
    let best: SemanticCacheHit | null = null;

    for (const row of rows) {
      let entry: CacheEntry;
      try {
        entry = JSON.parse(row) as CacheEntry;
      } catch {
        continue;
      }
      if (!Array.isArray(entry.embedding)) continue;
      const score = dot(queryEmbedding, entry.embedding);
      if (score >= min && (!best || score > best.score)) {
        best = {
          assistantText: entry.assistantText,
          citations: entry.citations,
          score,
          kind: "semantic",
        };
      }
    }

    if (best) {
      console.info(
        `[tokenops/cache] HIT semantic score=${best.score.toFixed(3)}`,
      );
    }
    return best;
  } catch (err) {
    console.warn("[tokenops/cache] lookup failed:", err);
    return null;
  }
}

/**
 * Grava exact + lista semântica (best-effort).
 *
 * `precomputedEmbedding` (opcional): vetor JÁ NORMALIZADO do transcript.
 * Quando fornecido (via reuso do lookup), pula o `embedOne(transcript)` interno.
 */
export async function writeSemanticCache(opts: {
  transcript: string;
  assistantText: string;
  intent?: string;
  citations?: RagCitation[];
  precomputedEmbedding?: number[] | null;
}): Promise<void> {
  if (!opts.assistantText.trim()) return;
  if (!isRedisAvailable()) return;

  let embedding: number[] | null;
  if (opts.precomputedEmbedding && opts.precomputedEmbedding.length > 0) {
    embedding = opts.precomputedEmbedding;
  } else {
    let rawEmbedding: number[] | null;
    try {
      rawEmbedding = await embedOne(opts.transcript);
    } catch {
      return;
    }
    if (!rawEmbedding) return;
    embedding = normalize(rawEmbedding);
  }
  if (!embedding) return;

  const redis = await readyRedis();
  if (!redis) return;

  const entry: CacheEntry = {
    transcript: opts.transcript,
    assistantText: opts.assistantText,
    embedding,
    intent: opts.intent,
    citations: opts.citations,
    createdAt: Date.now(),
  };

  const exact: ExactPayload = {
    assistantText: opts.assistantText,
    citations: opts.citations,
    intent: opts.intent,
  };

  try {
    if (redis.status === "wait") await redis.connect();
    const ttl = redisCacheTtlSeconds();
    const pipe = redis.pipeline();
    pipe.set(exactCacheKey(opts.transcript), JSON.stringify(exact), "EX", ttl);
    pipe.lpush(CACHE_LIST, JSON.stringify(entry));
    pipe.ltrim(CACHE_LIST, 0, MAX_ENTRIES - 1);
    pipe.expire(CACHE_LIST, ttl);
    await pipe.exec();
  } catch (err) {
    console.warn("[tokenops/cache] write failed:", err);
  }
}
