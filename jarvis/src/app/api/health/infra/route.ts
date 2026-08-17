import { NextResponse } from "next/server";

import { checkPipecatHealth, isPipecatConfigured } from "@/lib/inference/pipecat-health";
import { isRedisConfigured, pingRedis } from "@/lib/redis/client";
import { isSemanticCacheRequired } from "@/lib/tokenops/semantic-cache";

export const runtime = "nodejs";

export async function GET() {
  const [redis, pipecat] = await Promise.all([
    pingRedis(),
    checkPipecatHealth(),
  ]);

  const cacheRequired = isSemanticCacheRequired();

  return NextResponse.json({
    ok: redis || !cacheRequired,
    redis: {
      configured: isRedisConfigured(),
      online: redis,
    },
    /** B4 — semantic cache esperado no path cloud quando REDIS_URL existe */
    semanticCache: {
      required: cacheRequired,
      ready: redis,
    },
    pipecat: {
      configured: isPipecatConfigured(),
      online: pipecat,
      url: process.env.VOICE_STREAM_URL ?? null,
    },
  });
}
