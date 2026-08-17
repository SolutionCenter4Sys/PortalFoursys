import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

import { ingestGithubRepo } from "./sources/github";
import { ingestLocalDir } from "./sources/local-fs";
import type { RagChunk, RagIndexMeta } from "./types";

const CACHE_DIR = join(process.cwd(), ".rag-cache");
const INDEX_FILE = join(CACHE_DIR, "index.json");

type IndexFile = {
  meta: RagIndexMeta;
  chunks: RagChunk[];
};

let memoryIndex: RagChunk[] | null = null;

export async function loadIndex(): Promise<RagChunk[]> {
  if (memoryIndex) return memoryIndex;

  try {
    const raw = await readFile(INDEX_FILE, "utf8");
    const data = JSON.parse(raw) as IndexFile;
    memoryIndex = data.chunks ?? [];
    return memoryIndex;
  } catch {
    return [];
  }
}

export async function getIndexMeta(): Promise<RagIndexMeta | null> {
  try {
    const raw = await readFile(INDEX_FILE, "utf8");
    const data = JSON.parse(raw) as IndexFile;
    return data.meta;
  } catch {
    return null;
  }
}

export async function buildIndex(): Promise<{ chunks: RagChunk[]; meta: RagIndexMeta }> {
  const githubToken = process.env.GITHUB_TOKEN;
  const portalRepo = process.env.RAG_PORTAL_REPO ?? "SolutionCenter4Sys/PortalFoursys";
  const [owner, repo] = portalRepo.split("/");

  const extensions = [".md", ".yaml", ".yml", ".html", ".json", ".ts", ".tsx", ".txt"];

  const portalChunks = await ingestGithubRepo({
    owner,
    repo,
    sourceId: "portal-foursys",
    sourceName: "Portal Foursys",
    extensions,
    token: githubToken,
  });

  const jarvisRoot = join(process.cwd(), "..");
  const jarvisChunks = await ingestLocalDir({
    rootPath: jarvisRoot,
    sourceId: "ai-dlc-jarvis",
    sourceName: "Jarvis AI-DLC",
    extensions: [".md", ".yaml", ".yml"],
  });

  // TokenOps PLUS / ADR-017 — wiki Karpathy (curada; prioridade no RAG)
  // Preferência: knowledge/ dentro do repo web; fallback: irmão Jarvis/knowledge
  const wikiInRepo = join(process.cwd(), "knowledge", "wiki");
  const wikiSibling = join(process.cwd(), "..", "knowledge", "wiki");
  const wikiRoot = existsSync(wikiInRepo) ? wikiInRepo : wikiSibling;
  const wikiChunks = await ingestLocalDir({
    rootPath: wikiRoot,
    sourceId: "jarvis-wiki-karpathy",
    sourceName: "Jarvis Wiki (Karpathy)",
    extensions: [".md"],
    maxFiles: 200,
  });

  const agentsRoot = process.env.RAG_AGENTS_ROOT;
  const agentsChunks = agentsRoot
    ? await ingestLocalDir({
        rootPath: agentsRoot,
        sourceId: "foursys-agents",
        sourceName: "Agentes Foursys",
        extensions: [".md", ".yaml", ".yml"],
        maxFiles: 200,
      })
    : [];

  const chunks = [...wikiChunks, ...portalChunks, ...jarvisChunks, ...agentsChunks];
  const meta: RagIndexMeta = {
    builtAt: new Date().toISOString(),
    chunkCount: chunks.length,
    sources: [
      "jarvis-wiki-karpathy",
      "portal-foursys",
      "ai-dlc-jarvis",
      ...(agentsRoot ? ["foursys-agents"] : []),
    ],
  };

  await mkdir(CACHE_DIR, { recursive: true });
  const payload: IndexFile = { meta, chunks };
  await writeFile(INDEX_FILE, JSON.stringify(payload), "utf8");
  memoryIndex = chunks;

  return { chunks, meta };
}

export async function ensureIndex(): Promise<RagChunk[]> {
  const existing = await loadIndex();
  if (existing.length > 0) return existing;
  const { chunks } = await buildIndex();
  return chunks;
}

export function clearMemoryIndex(): void {
  memoryIndex = null;
}
