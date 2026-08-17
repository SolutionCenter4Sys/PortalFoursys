import { compressAgentLogs } from "@/lib/tokenops/log-compress";

/**
 * Cliente server-side do ADR-015 Local Agent Bridge.
 * Só fala com loopback; nunca invoca CLI no Vercel.
 */

export type AgentJobStatus =
  | "queued"
  | "running"
  | "awaiting_approval"
  | "done"
  | "failed";

export type AgentJobSummary = {
  id: string;
  status: AgentJobStatus;
  prompt?: string;
  cwd?: string;
  workspace?: string;
  mode?: "read" | "write";
  logs?: string;
  error?: string;
};

/** Pedidos que exigem write no disco → job mode=write + approve no UI. */
export function looksLikeAgentWriteIntent(text: string): boolean {
  return /\b(cria(r)?|crie|escrev[ea]|grava(r)?|salva(r)?|gera(r)?|apaga(r)?|delet[ea]|renomeia|move|edita(r)?|altera(r)?|modifica(r)?|faz\s+(um\s+)?(arquivo|ficheiro)|novo\s+(arquivo|ficheiro)|touch\s+|mkdir\s+|rm\s+|write|create\s+file)\b/i.test(
    text,
  );
}

/**
 * Aprovação humana por voz (em vez do botão no Contexto).
 * Frases claras só — evita "ok"/"confirma" soltos.
 */
export function looksLikeAgentApproveIntent(text: string): boolean {
  return /\b(pode\s+executar|pode\s+criar|pode\s+escrever|pode\s+seguir|podes\s+(criar|executar|escrever|fazer)|autorizad[oa]|autorizo|aprova(r)?(\s+(o\s+)?write)?|aprovado|confirmado|vai\s+(em\s+frente|l[aá])|manda\s+(ver|bola)|go\s+ahead|approve(d)?|yes\s+(do\s+it|execute)|ok\s+podes|sim,?\s+(pode|autorizo|confirma)|executa\s+(agora|o\s+write)|execute\s+(now|it))\b/i.test(
    text,
  );
}

export function agentApproveAck(ok: boolean): string {
  return ok
    ? "Autorizado. A executar o write — acompanha o progresso no painel Contexto."
    : "Não consegui autorizar o job. Confirma que o bridge está a correr, ou usa o botão Aprovar write.";
}

/**
 * Extrai alias de workspace da fala ("no workspace web", "no portal", …).
 * Default: AGENT_WORKSPACE env ou "web".
 */
export function resolveWorkspaceAlias(text: string): string {
  // "no workspace web" | "workspace portal" | "no jarvis"
  const m =
    text.match(
      /\b(?:workspace|projeto|repo)\s+(jarvis|web|portal)\b/i,
    ) ||
    text.match(/\bno\s+workspace\s+(jarvis|web|portal)\b/i) ||
    text.match(/\b(?:no|na)\s+(jarvis|web|portal)\b/i);
  if (m) return m[1].toLowerCase();
  // "no workspace" / "no workspace," sem nome → default
  return (process.env.AGENT_WORKSPACE || "web").trim().toLowerCase() || "web";
}

function bridgeConfig(): { url: string; token: string } | null {
  const url = (process.env.AGENT_BRIDGE_URL || "").trim().replace(/\/$/, "");
  const token = (process.env.AGENT_BRIDGE_TOKEN || "").trim();
  if (!url || !token) return null;
  return { url, token };
}

/** Aceita só 127.0.0.1 / localhost — bloqueia URL remota por segurança. */
export function isBridgeUrlAllowed(url: string): boolean {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    return host === "127.0.0.1" || host === "localhost";
  } catch {
    return false;
  }
}

export function isAgentBridgeConfigured(): boolean {
  const cfg = bridgeConfig();
  return Boolean(cfg && isBridgeUrlAllowed(cfg.url));
}

async function bridgeFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const cfg = bridgeConfig();
  if (!cfg || !isBridgeUrlAllowed(cfg.url)) {
    throw new Error("Agent bridge não configurado ou URL não é loopback");
  }
  return fetch(`${cfg.url}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    signal: AbortSignal.timeout(15_000),
  });
}

export async function createAgentJob(input: {
  prompt: string;
  cwd?: string;
  workspace?: string;
  mode?: "read" | "write";
}): Promise<AgentJobSummary | null> {
  if (!isAgentBridgeConfigured()) return null;
  try {
    const res = await bridgeFetch("/jobs", {
      method: "POST",
      body: JSON.stringify({
        prompt: input.prompt,
        cwd: input.cwd,
        workspace: input.workspace,
        mode: input.mode ?? "read",
      }),
    });
    if (!res.ok) {
      console.warn("[agent-bridge] create failed", res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as {
      id: string;
      status: AgentJobStatus;
      workspace?: string;
      cwd?: string;
    };
    return {
      id: data.id,
      status: data.status,
      prompt: input.prompt,
      workspace: data.workspace,
      cwd: data.cwd,
    };
  } catch (err) {
    console.warn("[agent-bridge] create error", err);
    return null;
  }
}

export async function getAgentJob(id: string): Promise<AgentJobSummary | null> {
  if (!isAgentBridgeConfigured()) return null;
  try {
    const res = await bridgeFetch(`/jobs/${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as AgentJobSummary;
    if (data.logs) data.logs = compressAgentLogs(data.logs);
    return data;
  } catch {
    return null;
  }
}

export async function approveAgentJob(
  id: string,
): Promise<AgentJobSummary | null> {
  if (!isAgentBridgeConfigured()) return null;
  try {
    const res = await bridgeFetch(`/jobs/${encodeURIComponent(id)}/approve`, {
      method: "POST",
      body: "{}",
    });
    if (!res.ok) {
      console.warn("[agent-bridge] approve failed", res.status);
      return null;
    }
    const data = (await res.json()) as { id: string; status: AgentJobStatus };
    return { id: data.id, status: data.status };
  } catch (err) {
    console.warn("[agent-bridge] approve error", err);
    return null;
  }
}
