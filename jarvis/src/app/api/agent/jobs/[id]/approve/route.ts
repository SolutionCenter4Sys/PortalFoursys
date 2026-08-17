import { NextResponse } from "next/server";

import {
  approveAgentJob,
  isAgentBridgeConfigured,
} from "@/lib/agent/bridge-client";
import {
  AuthRequiredError,
  requireAuthenticatedUserId,
} from "@/lib/usage/service";

type Ctx = { params: Promise<{ id: string }> };

/**
 * POST /api/agent/jobs/:id/approve — autoriza mode=write no bridge (ADR-015).
 */
export async function POST(_request: Request, ctx: Ctx) {
  try {
    await requireAuthenticatedUserId();
    if (!isAgentBridgeConfigured()) {
      return NextResponse.json({ error: "bridge não configurado" }, { status: 503 });
    }
    const { id } = await ctx.params;
    const job = await approveAgentJob(id);
    if (!job) {
      return NextResponse.json(
        { error: "falha ao aprovar (job inexistente ou bridge down)" },
        { status: 502 },
      );
    }
    return NextResponse.json(job);
  } catch (err) {
    if (err instanceof AuthRequiredError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro" },
      { status: 500 },
    );
  }
}
