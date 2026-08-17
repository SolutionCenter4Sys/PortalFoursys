import { readdir, readFile, stat } from "fs/promises";
import { join, relative } from "path";

import { chunkText } from "../chunker";
import { ragFilePriority, shouldSkipRagPath } from "../path-policy";
import type { RagChunk } from "../types";

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "web",
  "Z-Consolidated",
  "assets",
  "briefings",
]);

const DEFAULT_MAX_FILES = 60;

export async function ingestLocalDir(options: {
  rootPath: string;
  sourceId: string;
  sourceName: string;
  extensions: string[];
  maxFiles?: number;
}): Promise<RagChunk[]> {
  const { rootPath, sourceId, sourceName, extensions, maxFiles = DEFAULT_MAX_FILES } = options;
  const extSet = new Set(extensions.map((e) => e.toLowerCase()));
  const files = await collectFiles(rootPath, rootPath, extSet);
  files.sort((a, b) => {
    const ra = relative(rootPath, a).replace(/\\/g, "/");
    const rb = relative(rootPath, b).replace(/\\/g, "/");
    const d = ragFilePriority(rb) - ragFilePriority(ra);
    if (d !== 0) return d;
    return ra.localeCompare(rb);
  });
  const chunks: RagChunk[] = [];

  for (const absPath of files.slice(0, maxFiles)) {
    try {
      const text = await readFile(absPath, "utf8");
      const rel = relative(rootPath, absPath).replace(/\\/g, "/");
      const pieces = chunkText(text);

      pieces.forEach((piece) => {
        chunks.push({
          id: `${sourceId}:${rel}:${piece.index}`,
          document_id: `${sourceId}:${rel}`,
          source_id: sourceId,
          content: piece.content,
          metadata: {
            source_name: sourceName,
            path: rel,
            chunk_index: piece.index,
            total_chunks: pieces.length,
          },
          similarity: 0,
        });
      });
    } catch {
      /* skip */
    }
  }

  return chunks;
}

async function collectFiles(
  rootPath: string,
  dir: string,
  extSet: Set<string>,
  acc: string[] = [],
): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const relDir = relative(rootPath, join(dir, entry.name)).replace(/\\/g, "/");
      if (shouldSkipRagPath(`${relDir}/`, "all")) continue;
      await collectFiles(rootPath, join(dir, entry.name), extSet, acc);
    } else if (entry.isFile()) {
      const full = join(dir, entry.name);
      const rel = relative(rootPath, full).replace(/\\/g, "/");
      if (shouldSkipRagPath(rel, "all")) continue;
      const dot = entry.name.lastIndexOf(".");
      if (dot === -1) continue;
      if (extSet.has(entry.name.slice(dot).toLowerCase())) {
        try {
          const st = await stat(full);
          if (st.size < 200_000) acc.push(full);
        } catch {
          /* skip */
        }
      }
    }
  }

  return acc;
}
