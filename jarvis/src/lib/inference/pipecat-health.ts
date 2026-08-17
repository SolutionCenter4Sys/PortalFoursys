import net from "node:net";

function parseWsUrl(raw: string | undefined): { host: string; port: number } | null {
  if (!raw?.trim()) return null;
  try {
    const url = new URL(raw.trim());
    const host = url.hostname;
    const port = url.port
      ? Number.parseInt(url.port, 10)
      : url.protocol === "wss:" ? 443 : 80;
    if (!host || !Number.isFinite(port)) return null;
    return { host, port };
  } catch {
    return null;
  }
}

/** TCP probe — Pipecat expõe WebSocket; não há HTTP health nativo. */
export function checkPipecatHealth(timeoutMs = 3_000): Promise<boolean> {
  const target = parseWsUrl(process.env.VOICE_STREAM_URL);
  if (!target) return Promise.resolve(false);

  return new Promise((resolve) => {
    const socket = new net.Socket();
    const finish = (ok: boolean) => {
      socket.destroy();
      resolve(ok);
    };

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
    socket.connect(target.port, target.host);
  });
}

export function isPipecatConfigured(): boolean {
  return Boolean(process.env.VOICE_STREAM_URL?.trim());
}
