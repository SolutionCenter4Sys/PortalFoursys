/**
 * GitLab RAG Source
 * API v4: https://docs.gitlab.com/ee/api/repositories.html
 * Suporta repos públicos e privados (token via config.token).
 */

import { chunkText } from '../chunker';
import { selectRagPaths, shouldSkipRagPath } from '../path-policy';
import type { RagChunk } from '../types';

const MAX_FILES = 120;

type GitLabTreeItem = {
  id: string;
  name: string;
  type: 'blob' | 'tree';
  path: string;
  mode: string;
};

/** Extrai o project path codificado a partir de uma URL GitLab. */
function parseGitlabUrl(url: string): { baseUrl: string; projectPath: string } {
  // https://gitlab.com/owner/repo  ou  https://gitlab.mycompany.com/group/subgroup/repo
  const u = new URL(url.replace(/\.git$/, ''));
  const baseUrl = u.origin;
  const projectPath = u.pathname.replace(/^\//, ''); // "owner/repo"
  return { baseUrl, projectPath };
}

export async function ingestGitlabRepo(options: {
  url: string;
  sourceId: string;
  sourceName: string;
  extensions: string[];
  token?: string;
  branch?: string;
}): Promise<RagChunk[]> {
  const { url, sourceId, sourceName, extensions, token, branch } = options;
  const { baseUrl, projectPath } = parseGitlabUrl(url);
  const encodedPath = encodeURIComponent(projectPath);
  const apiBase = `${baseUrl}/api/v4/projects/${encodedPath}`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['PRIVATE-TOKEN'] = token;

  // Resolve branch padrão se não informado
  let ref = branch ?? 'main';
  if (!branch) {
    try {
      const projRes = await fetch(apiBase, {
        headers,
        signal: AbortSignal.timeout(15_000),
      });
      if (projRes.ok) {
        const proj = (await projRes.json()) as { default_branch?: string };
        ref = proj.default_branch ?? 'main';
      }
    } catch { /* usa main como fallback */ }
  }

  // Lista arquivos do repositório (paginado)
  const extSet = new Set(extensions.map((e) => e.toLowerCase()));
  const allFiles: GitLabTreeItem[] = [];
  let page = 1;

  while (allFiles.length < MAX_FILES * 3) {
    const treeRes = await fetch(
      `${apiBase}/repository/tree?recursive=true&ref=${ref}&per_page=100&page=${page}`,
      { headers, signal: AbortSignal.timeout(30_000) },
    );
    if (!treeRes.ok) break;

    const items = (await treeRes.json()) as GitLabTreeItem[];
    if (items.length === 0) break;

    allFiles.push(...items);
    if (items.length < 100) break;
    page++;
  }

  const files = selectRagPaths(
    allFiles
      .filter((item) => item.type === 'blob')
      .filter((item) => !shouldSkipRagPath(item.path, 'all'))
      .filter((item) => {
        const dot = item.path.lastIndexOf('.');
        if (dot === -1) return false;
        return extSet.has(item.path.slice(dot).toLowerCase());
      }),
    { maxFiles: MAX_FILES, scope: 'all' },
  );

  const chunks: RagChunk[] = [];

  for (const file of files) {
    try {
      const encodedFilePath = encodeURIComponent(file.path);
      const rawRes = await fetch(
        `${apiBase}/repository/files/${encodedFilePath}/raw?ref=${ref}`,
        { headers, signal: AbortSignal.timeout(15_000) },
      );
      if (!rawRes.ok) continue;

      const text = await rawRes.text();
      const pieces = chunkText(text);
      const fileUrl = `${baseUrl}/${projectPath}/-/blob/${ref}/${file.path}`;

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

      await sleep(100);
    } catch { /* skip file */ }
  }

  return chunks;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
