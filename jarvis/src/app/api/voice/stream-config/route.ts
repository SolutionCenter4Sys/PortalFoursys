import { NextResponse } from "next/server";

import { inferenceConfig, isVoiceStreamingEnabled } from "@/lib/inference/config";
import { isVoiceAuthRequired } from "@/lib/supabase/config";
import { getAuthenticatedUserId } from "@/lib/usage/service";

export const runtime = "nodejs";

/**
 * GET /api/voice/stream-config
 * Retorna a URL do Pipecat WebSocket para o cliente abrir o streaming (E3 Fase B).
 * Auth-gated: só usuários autenticados quando voz exige login.
 */
export async function GET() {
  if (isVoiceAuthRequired()) {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.json({
    enabled: isVoiceStreamingEnabled(),
    url: inferenceConfig.voiceStreamUrl || null,
  });
}
