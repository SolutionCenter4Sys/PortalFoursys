/**
 * Reindex RAG standalone — sem server, sem auth, sem env stale.
 * Carrega .env.local do zero e chama ingestSource direto.
 *
 * Uso:
 *   npm run reindex                 # todas as fontes conhecidas
 *   npm run reindex -- <sourceId>   # só uma fonte
 *
 * Requer SUPABASE_SERVICE_ROLE_KEY no .env.local (ingest grava com service_role)
 * + provider de embedding configurado (Gemini/OpenAI/Ollama).
 */

import { ingestSource } from "../src/lib/rag/ingest";

const SOURCES = [
  { id: "e8006688-c34d-4da1-b1a5-88c8648912aa", name: "Portal Foursys" },
  { id: "855771e3-bb42-44a9-bfa9-dedbe2357fd3", name: "Agentes Foursys (Solution Center)" },
];

async function main() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith("COLE_")) {
    console.error(
      "[reindex] SUPABASE_SERVICE_ROLE_KEY ausente/placeholder no .env.local — cole a key do projeto novo antes.",
    );
    process.exit(1);
  }

  const only = process.argv[2];
  const targets = only ? SOURCES.filter((s) => s.id === only) : SOURCES;
  if (targets.length === 0) {
    console.error(`[reindex] sourceId '${only}' não conhecido. IDs:`, SOURCES.map((s) => s.id));
    process.exit(1);
  }

  for (const s of targets) {
    console.log(`\n[reindex] ▶ ${s.name} (${s.id})`);
    const t0 = Date.now();
    try {
      const r = await ingestSource(s.id, { force: true });
      const secs = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`[reindex] ✔ ${s.name} em ${secs}s`, {
        docs: r.docsProcessed,
        skipped: r.docsSkipped,
        chunks: r.chunksCreated,
        embedded: r.chunksEmbedded,
        errors: r.errors.length,
      });
      if (r.errors.length) console.log(`[reindex]   avisos:`, r.errors.slice(0, 5));
    } catch (e) {
      console.error(`[reindex] ✖ ${s.name} erro:`, e instanceof Error ? e.message : e);
    }
  }
  process.exit(0);
}

void main();
