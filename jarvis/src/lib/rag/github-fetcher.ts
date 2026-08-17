/**
 * GitHub API fetcher para ingestão RAG.
 * Usa GitHub REST API v3 — funciona com repos públicos sem token.
 * Token (GITHUB_TOKEN) opcional: aumenta rate limit de 60 → 5000 req/h.
 */

import { parseRagPathScope, selectRagPaths, type RagPathScope } from '@/lib/rag/path-policy';

const GITHUB_API = 'https://api.github.com';

// Extensões indexadas por padrão (ADR-007)
export const DEFAULT_EXTENSIONS = ['.md', '.yaml', '.yml', '.html', '.txt'];

interface GithubTreeItem {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

interface GithubTreeResponse {
  sha: string;
  tree: GithubTreeItem[];
  truncated: boolean;
}

function githubHeaders(tokenOverride?: string): HeadersInit {
  const token = tokenOverride ?? process.env.GITHUB_TOKEN;
  return {
    Accept: 'application/vnd.github.v3+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Extrai owner/repo da URL do GitHub. */
export function parseGithubUrl(url: string): { owner: string; repo: string } {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\s|$|\/)/);
  if (!match) throw new Error(`URL GitHub inválida: ${url}`);
  return { owner: match[1], repo: match[2] };
}

/** Retorna lista de arquivos do repo filtrando por extensões + pathScope. */
export async function listRepoFiles(
  owner: string,
  repo: string,
  extensions = DEFAULT_EXTENSIONS,
  token?: string,
  branch = 'main',
  pathScope: RagPathScope | string = 'all',
): Promise<GithubTreeItem[]> {
  const scope = parseRagPathScope(pathScope);
  const headers = githubHeaders(token);
  let treeUrl = `${GITHUB_API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

  let res = await fetch(treeUrl, { headers });

  if (res.status === 404 && branch === 'main') {
    treeUrl = `${GITHUB_API}/repos/${owner}/${repo}/git/trees/master?recursive=1`;
    res = await fetch(treeUrl, { headers });
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub tree error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as GithubTreeResponse;

  if (data.truncated) {
    console.warn(`[github-fetcher] Tree truncated for ${owner}/${repo} — large repo`);
  }

  const matched = data.tree.filter(
    (item) =>
      item.type === 'blob' &&
      extensions.some((ext) => item.path.toLowerCase().endsWith(ext)),
  );

  return selectRagPaths(matched, { scope });
}

/** Busca conteúdo raw de um arquivo. */
export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  token?: string,
  branch = 'main',
): Promise<string> {
  const headers = githubHeaders(token);
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  const res = await fetch(url, { headers });

  if (res.status === 404 && branch === 'main') {
    const urlMaster = `https://raw.githubusercontent.com/${owner}/${repo}/master/${path}`;
    const res2 = await fetch(urlMaster, { headers });
    if (!res2.ok) throw new Error(`File not found: ${path}`);
    return res2.text();
  }

  if (!res.ok) throw new Error(`GitHub file error ${res.status}: ${path}`);
  return res.text();
}

/** URL pública de um arquivo no GitHub. */
export function githubFileUrl(owner: string, repo: string, path: string, branch = 'main'): string {
  return `https://github.com/${owner}/${repo}/blob/${branch}/${path}`;
}
