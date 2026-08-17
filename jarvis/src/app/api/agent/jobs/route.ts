import { NextResponse } from "next/server";

import {
  createAgentJob,
  isAgentBridgeConfigured,
  isBridgeUrlAllowed,
} from "@/lib/agent/bridge-client";
import {
  AuthRequiredError,
  requireAuthenticatedUserId,
} from "@/lib/usage/service";

/**
 * POST /api/agent/jobs
 * Proxy autenticado → Local Agent Bridge (ADR-015). Só loopback.
 */
export async function POST(request: Request) {
  try {
    await requireAuthenticatedUserId();

    if (!isAgentBridgeConfigured()) {
      return NextResponse.json(
        {
          error:
            "Agent bridge não configurado. Defina AGENT_BRIDGE_URL (127.0.0.1) e AGENT_BRIDGE_TOKEN.",
        },
        { status: 503 },
      );
    }

    const url = (process.env.AGENT_BRIDGE_URL || "").trim();
    if (!isBridgeUrlAllowed(url)) {
      return NextResponse.json(
        { error: "AGENT_BRIDGE_URL deve ser 127.0.0.1 ou localhost" },
        { status: 403 },
      );
    }

    const body = (await request.json()) as {
      prompt?: string;
      cwd?: string;
      mode?: "read" | "write";
    };
    const prompt = (body.prompt || "").trim();
    if (!prompt) {
      return NextResponse.json({ error: "prompt obrigatório" }, { status: 400 });
    }

    const job = await createAgentJob({
      prompt,
      cwd: body.cwd,
      mode: body.mode === "write" ? "write" : "read",
    });

    if (!job) {
      return NextResponse.json(
        { error: "Falha ao contactar o agent-bridge (está a correr?)" },
        { status: 502 },
      );
    }

    return NextResponse.json(job, { status: 201 });
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

export async function GET() {
  try {
    await requireAuthenticatedUserId();
    return NextResponse.json({
      configured: isAgentBridgeConfigured(),
      url: isAgentBridgeConfigured()
        ? (process.env.AGENT_BRIDGE_URL || "").replace(/\/$/, "")
        : null,
    });
  } catch (err) {
    if (err instanceof AuthRequiredError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}
