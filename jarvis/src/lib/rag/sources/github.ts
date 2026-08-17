import { chunkText } from "../chunker";
import { selectRagPaths, shouldSkipRagPath } from "../path-policy";
import type { RagChunk } from "../types";

/** Portal completo (core + briefings) — sem o corte antigo de 80/120. */
const MAX_FILES = 400;

type GitTreeItem = {
  path: string;
  type: string;
  size?: number;
};

export async function ingestGithubRepo(options: {
  owner: string;
  repo: string;
  sourceId: string;
  sourceName: string;
  extensions: string[];
  token?: string;
}): Promise<RagChunk[]> {
  const { owner, repo, sourceId, sourceName, extensions, token } = options;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Jarvis-RAG/1.0",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const repoRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers, signal: AbortSignal.timeout(30_000) },
  );
  if (!repoRes.ok) {
    throw new Error(`GitHub repo ${owner}/${repo}: ${repoRes.status}`);
  }

  const repoData = (await repoRes.json()) as { default_branch: string };
  const branch = repoData.default_branch ?? "main";

  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers, signal: AbortSignal.timeout(60_000) },
  );
  if (!treeRes.ok) {
    throw new Error(`GitHub tree ${owner}/${repo}: ${treeRes.status}`);
  }

  const tree = (await treeRes.json()) as { tree: GitTreeItem[] };
  const extSet = new Set(extensions.map((e) => e.toLowerCase()));

  const candidates = tree.tree
    .filter((item) => item.type === "blob")
    .filter((item) => !shouldSkipRagPath(item.path, "all"))
    .filter((item) => {
      const dot = item.path.lastIndexOf(".");
      if (dot === -1) return false;
      return extSet.has(item.path.slice(dot).toLowerCase());
    })
    .filter((item) => (item.size ?? 0) < 200_000);

  const files = selectRagPaths(candidates, { maxFiles: MAX_FILES, scope: "all" });

  const chunks: RagChunk[] = [];

  for (const file of files) {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`;
    try {
      const rawRes = await fetch(rawUrl, {
        signal: AbortSignal.timeout(15_000),
      });
      if (!rawRes.ok) continue;

      const text = await rawRes.text();
      const pieces = chunkText(stripHtmlIfNeeded(text, file.path));
      const fileUrl = `https://github.com/${owner}/${repo}/blob/${branch}/${file.path}`;

      pieces.forEach((piece) => {
        chunks.push({
          id: `${sourceId}:${file.path}:${piece.index}`,
          document_id: `${sourceId}:${file.path}`,
          source_id: sourceId,
          content: piece.content,
          metadata: {
            source_name: sourceName,
            path: file.path,
            url: fileUrl,
            chunk_index: piece.index,
            total_chunks: pieces.length,
          },
          similarity: 0,
        });
      });

      await sleep(120);
    } catch {
      /* skip file */
    }
  }

  return chunks;
}

function stripHtmlIfNeeded(text: string, path: string): string {
  if (!path.endsWith(".html")) return text;
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
