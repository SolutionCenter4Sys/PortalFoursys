import { NextResponse } from "next/server";

import { getAgentJob, isAgentBridgeConfigured } from "@/lib/agent/bridge-client";
import {
  AuthRequiredError,
  requireAuthenticatedUserId,
} from "@/lib/usage/service";

type Ctx = { params: Promise<{ id: string }> };

/**
 * GET /api/agent/jobs/:id — status + logs do job no bridge local.
 */
export async function GET(_request: Request, ctx: Ctx) {
  try {
    await requireAuthenticatedUserId();
    if (!isAgentBridgeConfigured()) {
      return NextResponse.json({ error: "bridge não configurado" }, { status: 503 });
    }
    const { id } = await ctx.params;
    const job = await getAgentJob(id);
    if (!job) {
      return NextResponse.json({ error: "job não encontrado" }, { status: 404 });
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
