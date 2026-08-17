/**
 * URL RAG Source
 * Faz fetch de uma (ou várias) URL, extrai texto limpo e chunkeia.
 * Suporta HTML, Markdown e texto plano.
 *
 * Sites SPA (renderizados por JS) servem só um shell no fetch estático — o
 * <body> vem quase vazio. Por isso extraímos também meta description, OG e
 * JSON-LD (que SPAs costumam incluir no HTML inicial por SEO). Para cobrir
 * várias páginas: sitemap.xml (preferido), robots.txt, ou crawl de links.
 */

import { chunkText } from '../chunker';
import type { RagChunk } from '../types';

/** Remove tags HTML e normaliza espaços para extrair texto do <body>. */
function htmlToText(html: string): string {
  return html
    .replace(/<(script|style|nav|header|footer|aside|noscript)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extrai title/meta/OG/JSON-LD — funciona mesmo em SPA (shell tem SEO). */
function extractSeoText(html: string): string {
  const parts: string[] = [];
  const meta = (name: string): string | null => {
    const re = new RegExp(
      `<meta[^>]+(?:name|property)=["']${name}["'][^>]*content=["']([^"']+)["']`,
      'i',
    );
    const m = html.match(re);
    return m ? m[1].trim() : null;
  };
  for (const key of ['description', 'og:description', 'og:title', 'keywords']) {
    const v = meta(key);
    if (v) parts.push(v);
  }
  const ld = html.match(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi);
  if (ld) {
    for (const block of ld) {
      const json = block.replace(/<[^>]+>/g, '');
      try {
        const flat = JSON.stringify(JSON.parse(json));
        parts.push(
          flat.replace(/["{}\[\]]/g, ' ').replace(/[a-z@]+:/gi, ' ').replace(/\s+/g, ' ').trim(),
        );
      } catch {
        /* JSON-LD inválido — ignora */
      }
    }
  }
  return parts.join('. ');
}

function extractPageTitle(html: string, fallback: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : fallback;
}

/** Fetch + extração de UMA página. Retorna null se conteúdo insuficiente. */
async function fetchOnePage(
  url: string,
  fallbackTitle: string,
): Promise<{ url: string; title: string; text: string } | null> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Jarvis-RAG/1.0 (knowledge-indexer)',
      Accept: 'text/html,text/plain,text/markdown,*/*',
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ao buscar ${url}`);

  const contentType = res.headers.get('content-type') ?? '';
  const rawText = await res.text();

  if (contentType.includes('text/html')) {
    const title = extractPageTitle(rawText, fallbackTitle);
    const body = htmlToText(rawText);
    const seo = extractSeoText(rawText);
    const text = [seo, body].filter(Boolean).join('\n\n').trim();
    return text.length >= 50 ? { url, title, text } : null;
  }
  return rawText.length >= 50 ? { url, title: fallbackTitle, text: rawText } : null;
}

function sameOrigin(a: string, b: string): boolean {
  try {
    return new URL(a).origin === new URL(b).origin;
  } catch {
    return false;
  }
}

/** Prioriza home e páginas curtas; blog/cases em seguida. */
function prioritizeUrls(baseUrl: string, urls: string[], limit: number): string[] {
  const scored = urls
    .filter((u) => sameOrigin(baseUrl, u))
    .map((u) => {
      let path = '/';
      try {
        path = new URL(u).pathname || '/';
      } catch {
        /* ignore */
      }
      const depth = path.split('/').filter(Boolean).length;
      let score = 500 - depth * 40 - Math.min(path.length, 200);
      if (u.replace(/\/$/, '') === baseUrl.replace(/\/$/, '') || path === '/') score += 2000;
      if (/\/(sobre|servicos|serviços|cases|insights|blog|contato|carreiras|esg|ciberseguranca|cibersegurança|dados|engenharia)/i.test(path))
        score += 120;
      if (/\/(en|eng|prt)\b/i.test(path)) score -= 80;
      return { u, score };
    });
  scored.sort((a, b) => b.score - a.score);
  return Array.from(new Set(scored.map((s) => s.u))).slice(0, limit);
}

async function fetchText(url: string, timeoutMs = 20_000): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Jarvis-RAG/1.0' },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** Extrai <loc> de um urlset; se for sitemapindex, desce 1 nível. */
async function parseSitemapXml(
  xml: string,
  origin: string,
  limit: number,
  depth = 0,
): Promise<string[]> {
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) =>
    m[1].trim(),
  );
  if (locs.length === 0) return [];

  const isIndex =
    /<sitemapindex[\s>]/i.test(xml) ||
    locs.every((l) => /sitemap.*\.xml(\?|$)/i.test(l));

  if (isIndex && depth < 2) {
    const nested: string[] = [];
    for (const child of locs.slice(0, 8)) {
      if (!sameOrigin(origin, child) && !child.includes(new URL(origin).hostname)) {
        continue;
      }
      const childXml = await fetchText(child, 25_000);
      if (!childXml) continue;
      nested.push(
        ...(await parseSitemapXml(childXml, origin, limit, depth + 1)),
      );
      if (nested.length >= limit) break;
    }
    return Array.from(new Set(nested)).slice(0, limit);
  }

  return Array.from(new Set(locs)).slice(0, limit);
}

/** Descobre URLs via robots.txt Sitemap: + /sitemap.xml. */
async function discoverFromSitemap(baseUrl: string, limit: number): Promise<string[]> {
  try {
    const origin = new URL(baseUrl).origin;
    const sitemapUrls = new Set<string>([`${origin}/sitemap.xml`]);

    const robots = await fetchText(`${origin}/robots.txt`, 10_000);
    if (robots) {
      for (const m of robots.matchAll(/^\s*Sitemap:\s*(\S+)/gim)) {
        sitemapUrls.add(m[1].trim());
      }
    }

    const found: string[] = [];
    for (const sm of sitemapUrls) {
      const xml = await fetchText(sm, 30_000);
      if (!xml) continue;
      found.push(...(await parseSitemapXml(xml, origin, limit * 2)));
      if (found.length >= limit * 2) break;
    }
    return prioritizeUrls(baseUrl, found, limit);
  } catch {
    return [];
  }
}

/** Fallback: links same-origin na home (quando sitemap falha). */
async function discoverFromHomeLinks(baseUrl: string, limit: number): Promise<string[]> {
  try {
    const origin = new URL(baseUrl).origin;
    const html = await fetchText(baseUrl, 20_000);
    if (!html) return [];
    const hrefs = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((m) => m[1]);
    const abs: string[] = [];
    for (const h of hrefs) {
      if (h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:')) continue;
      try {
        const u = new URL(h, baseUrl);
        if (u.origin !== origin) continue;
        u.hash = '';
        abs.push(u.toString());
      } catch {
        /* ignore */
      }
    }
    return prioritizeUrls(baseUrl, abs, limit);
  } catch {
    return [];
  }
}

/** URL de “raiz do site” (só path /) — bom candidato a crawl automático. */
export function isSiteRootUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.pathname === '/' || u.pathname === '';
  } catch {
    return false;
  }
}

export async function fetchUrlContent(options: {
  url: string;
  sourceId: string;
  sourceName: string;
  /** URLs extras a indexar além da principal. */
  urls?: string[];
  /** Se true, tenta descobrir páginas via sitemap/robots. */
  sitemap?: boolean;
  /** Teto de páginas a indexar (default 20; com sitemap em raiz usa 80). */
  maxPages?: number;
}): Promise<RagChunk[]> {
  const { url, sourceId, sourceName, urls = [] } = options;
  const crawlSite = options.sitemap === true || (options.sitemap !== false && isSiteRootUrl(url));
  const maxPages =
    options.maxPages ??
    (crawlSite ? 80 : 20);

  const targets = new Set<string>([url, ...urls]);
  if (crawlSite) {
    let discovered = await discoverFromSitemap(url, maxPages);
    if (discovered.length <= 1) {
      discovered = await discoverFromHomeLinks(url, Math.min(maxPages, 40));
    }
    for (const u of discovered) targets.add(u);
  }
  const list = prioritizeUrls(url, Array.from(targets), maxPages);

  // Concorrência limitada — não martelar o site
  const pages: Array<{ url: string; title: string; text: string }> = [];
  const concurrency = 4;
  for (let i = 0; i < list.length; i += concurrency) {
    const batch = list.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map((u) => fetchOnePage(u, sourceName).catch(() => null)),
    );
    for (const p of results) {
      if (p) pages.push(p);
    }
  }

  if (pages.length === 0) {
    throw new Error(
      `Nenhuma página com texto extraível em ${url}. ` +
        `Site pode ser SPA (renderizado por JS) — indexe URLs específicas via config.urls ou confirme sitemap.xml.`,
    );
  }

  const chunks: RagChunk[] = [];
  for (const page of pages) {
    const pieces = chunkText(page.text);
    pieces.forEach((piece) => {
      chunks.push({
        id: `${sourceId}:${page.url}:${piece.index}`,
        document_id: `${sourceId}:${page.url}`,
        source_id: sourceId,
        content: piece.content,
        metadata: {
          source_name: sourceName,
          path: page.url,
          url: page.url,
          title: page.title,
          chunk_index: piece.index,
          total_chunks: pieces.length,
        },
        similarity: 0,
      });
    });
  }
  return chunks;
}
