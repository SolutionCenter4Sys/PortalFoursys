/**
 * A7 — Warm de rotas só em DEV.
 * Dispara GET em /app e /api/health/inference para forçar compile Turbopack
 * antes do 1º clique humano. NÃO usar em produção (lá não há compile on-demand).
 *
 * Uso:
 *   1. Terminal A: npm run dev
 *   2. Terminal B: npm run warm
 *   ou: npm run warm -- --wait  (espera o server subir)
 *
 * Env:
 *   JARVIS_DEV_URL   default http://localhost:3000
 *   JARVIS_WARM_WAIT_MS  default 90000 (só com --wait)
 */

const BASE = (process.env.JARVIS_DEV_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);
const WAIT = process.argv.includes("--wait");
const WAIT_MS = Number.parseInt(process.env.JARVIS_WARM_WAIT_MS ?? "90000", 10);

const ROUTES = [
  { path: "/api/health/inference", label: "health" },
  { path: "/app", label: "app" },
  { path: "/showcase/orb", label: "orb2d" },
  { path: "/showcase/orb-v2", label: "orbLiquid" },
  { path: "/manifest.webmanifest", label: "manifest" },
];

async function ping(path) {
  const t0 = Date.now();
  const res = await fetch(`${BASE}${path}`, {
    redirect: "follow",
    headers: { Accept: "text/html,application/json,*/*" },
  });
  // consome body (Turbopack precisa gerar a rota inteira)
  await res.arrayBuffer().catch(() => {});
  return { status: res.status, ms: Date.now() - t0 };
}

async function waitForServer() {
  const deadline = Date.now() + WAIT_MS;
  let attempt = 0;
  while (Date.now() < deadline) {
    attempt += 1;
    try {
      const res = await fetch(`${BASE}/api/health/inference`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok || res.status < 500) {
        console.log(`[warm] server ok após ${attempt} tentativa(s)`);
        return;
      }
    } catch {
      /* ainda subindo */
    }
    await new Promise((r) => setTimeout(r, 800));
  }
  throw new Error(
    `[warm] timeout ${WAIT_MS}ms esperando ${BASE} — rode "npm run dev" antes`,
  );
}

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
    console.error("[warm] recusado em Vercel/prod — A7 é só DX local");
    process.exit(1);
  }

  console.log(`[warm] base=${BASE}${WAIT ? " (wait)" : ""}`);
  if (WAIT) await waitForServer();

  for (const r of ROUTES) {
    try {
      const { status, ms } = await ping(r.path);
      console.log(`[warm] ${r.label.padEnd(10)} ${status}  ${ms}ms  ${r.path}`);
    } catch (err) {
      console.error(
        `[warm] ${r.label.padEnd(10)} FAIL  ${r.path} — ${
          err instanceof Error ? err.message : err
        }`,
      );
      process.exitCode = 1;
    }
  }

  if (process.exitCode) {
    console.error(
      "\n[warm] falhou. Confirme: npm run dev está ativo em outra janela.",
    );
  } else {
    console.log("\n[warm] ok — 1º hit humano em /app deve ser rápido.");
    console.log(
      "[warm] lembrete: compile no next dev ≠ latência em produção (ver docs/runbook-dev-perf.md)",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
