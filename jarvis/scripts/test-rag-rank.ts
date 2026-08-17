/** Quick sanity check for RAG retriever ranking (run: npx tsx scripts/test-rag-rank.ts) */
import { readFileSync } from "fs";
import { join } from "path";

import { retrieveChunks } from "../src/lib/rag/retriever";
import type { RagChunk } from "../src/lib/rag/types";

const indexPath = join(process.cwd(), ".rag-cache/index.json");
const raw = readFileSync(indexPath, "utf8");
const { chunks } = JSON.parse(raw) as { chunks: RagChunk[] };

const query = "Qual é o stack do Portal Foursys?";
const hits = retrieveChunks(query, chunks, 5, 0.12);

console.log(`Query: ${query}\n`);
for (const h of hits) {
  console.log(`[${h.score.toFixed(1)}] ${h.sourceName} · ${h.path}`);
  console.log(`  ${h.content.slice(0, 120).replace(/\n/g, " ")}…\n`);
}
