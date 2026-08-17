/**
 * TokenOps Harness v1 — ADR-009 / US-10.1
 * Pipeline: normalize → PII guard → rate-limit → classify intent → prompt base.
 */

import {
  buildSystemPrompt,
  classifyIntent,
  normalizeTranscript,
  type JarvisIntent,
} from "@/lib/jarvis-context";
import { readyRedis } from "@/lib/redis/client";
import type { ChatMessage } from "@/lib/voice/types";

export type HarnessInput = {
  rawTranscript: string;
  history?: ChatMessage[];
  /** Para rate-limit / audit */
  userId?: string | null;
};

export type HarnessOutput = {
  transcript: string;
  intent: JarvisIntent;
  systemPrompt: string;
  history: ChatMessage[];
  corrections: string[];
  /** true se PII bloqueou o turno */
  blocked?: boolean;
  blockReason?: string;
  /** true se rate-limit disparou */
  rateLimited?: boolean;
};

export class HarnessBlockedError extends Error {
  constructor(
    message: string,
    public code: "PII" | "RATE_LIMIT",
  ) {
    super(message);
    this.name = "HarnessBlockedError";
  }
}

function detectCorrections(raw: string, normalized: string): string[] {
  if (raw === normalized) return [];
  return [`STT normalizado: "${raw}" → "${normalized}"`];
}

/** PII leve — CPF, cartão, e-mail+senha no mesmo turno, chaves óbvias. */
const PII_PATTERNS: Array<{ re: RegExp; label: string }> = [
  {
    re: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/,
    label: "CPF",
  },
  {
    re: /\b(?:\d[ -]*?){13,19}\b/,
    label: "possível cartão",
  },
  {
    re: /\b(sk-[a-zA-Z0-9]{20,}|AIza[0-9A-Za-z\-_]{20,}|ghp_[a-zA-Z0-9]{20,})\b/,
    label: "segredo/API key",
  },
  {
    re: /\b(senha|password|secret)\s*[:=]\s*\S+/i,
    label: "senha em claro",
  },
];

export function detectPii(text: string): string | null {
  for (const { re, label } of PII_PATTERNS) {
    if (re.test(text)) return label;
  }
  return null;
}

/** In-memory fallback quando Redis está off. */
const localBuckets = new Map<string, number[]>();

/**
 * Circuit breaker: mesma intent 20× em 60s por usuário → rate limit.
 * (3× matava conversa de voz — chat é a intent padrão.)
 */
export async function checkIntentRateLimit(
  userId: string | null | undefined,
  intent: JarvisIntent,
): Promise<boolean> {
  const key = `jarvis:rl:v2:${userId ?? "anon"}:${intent}`;
  const now = Date.now();
  const windowMs = 60_000;
  const maxHits = 20;

  const redis = await readyRedis();
  if (redis) {
    try {
      const redisKey = key;
      const count = await redis.incr(redisKey);
      if (count === 1) await redis.pexpire(redisKey, windowMs);
      // Conta o turno atual: bloqueia no 4º em diante (permite 3)
      return count > maxHits;
    } catch {
      /* fall through to memory */
    }
  }

  const prev = (localBuckets.get(key) ?? []).filter((t) => now - t < windowMs);
  prev.push(now);
  localBuckets.set(key, prev);
  return prev.length > maxHits;
}

/**
 * TokenOps Harness v1 — determinístico + guards.
 */
export async function runHarness(input: HarnessInput): Promise<HarnessOutput> {
  const transcript = normalizeTranscript(input.rawTranscript);
  const corrections = detectCorrections(input.rawTranscript, transcript);

  const pii = detectPii(transcript);
  if (pii) {
    return {
      transcript,
      intent: "chat",
      systemPrompt: "",
      history: [],
      corrections,
      blocked: true,
      blockReason: `PII detectado (${pii}). Não envie dados sensíveis por voz.`,
    };
  }

  const intent = classifyIntent(transcript);
  const rateLimited = await checkIntentRateLimit(input.userId, intent);
  if (rateLimited) {
    return {
      transcript,
      intent,
      systemPrompt: "",
      history: [],
      corrections,
      rateLimited: true,
      blockReason:
        "Muitas requisições iguais em pouco tempo. Aguarde um minuto e tente de novo.",
    };
  }

  const systemPrompt = buildSystemPrompt(intent);
  const history = (input.history ?? []).slice(-8);

  return {
    transcript,
    intent,
    systemPrompt,
    history,
    corrections,
  };
}

export function logHarnessAudit(entry: {
  intent: JarvisIntent;
  transcript: string;
  latencyMs: number;
  voiceMode: string;
  cacheHit?: boolean;
  blocked?: boolean;
  rateLimited?: boolean;
}): void {
  if (process.env.NODE_ENV === "development" || entry.blocked || entry.rateLimited) {
    console.info("[tokenops/harness]", {
      intent: entry.intent,
      latencyMs: entry.latencyMs,
      voiceMode: entry.voiceMode,
      cacheHit: entry.cacheHit,
      blocked: entry.blocked,
      rateLimited: entry.rateLimited,
      transcriptLen: entry.transcript.length,
    });
  }
}
