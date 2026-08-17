/**
 * Orquestrador de ingestão RAG — US-8.2 (v2)
 * Pipeline genérico: fetch docs → chunk → embed (LLM ativa) → upsert Supabase
 * Dispatch por source_type: github | gitlab | url | text | local_path
 */

import crypto from 'node:crypto';
import { join } from 'node:path';
import { createAdminClient } from '@/lib/supabase/admin';
import { chunkText, extractTitle } from '@/lib/rag/chunker';
import { embedBatch } from '@/lib/rag/embedder';
import {
  fetchFileContent,
  githubFileUrl,
  listRepoFiles,
  parseGithubUrl,
} from '@/lib/rag/github-fetcher';
import { parseRagPathScope, shouldSkipRagPath } from '@/lib/rag/path-policy';
import { ingestGitlabRepo } from '@/lib/rag/sources/gitlab';
import { fetchUrlContent, isSiteRootUrl } from '@/lib/rag/sources/url';
import { ingestLocalDir } from '@/lib/rag/sources/local-fs';
import type { IngestResult, KnowledgeSource } from '@/lib/rag/types';

function sha256(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/** map com concorrência limitada — preserva a ordem dos resultados */
async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (cursor < items.length) {
        const i = cursor++;
        results[i] = await fn(items[i], i);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

// ─── Pipeline genérico: salva documentos + chunks no Supabase ───────────────

type DocInput = {
  path: string;
  content: string;
  url?: string;
  title?: string;
};

async function runPipeline(
  sourceId: string,
  sourceName: string,
  docs: DocInput[],
  result: IngestResult,
  opts?: { force?: boolean },
): Promise<void> {
  const db = createAdminClient();
  const force = opts?.force === true;

  for (const doc of docs) {
    try {
      const hash = sha256(doc.content);
      const title = doc.title ?? extractTitle(doc.content, doc.path.split('/').pop() ?? doc.path);

      const { data: existingDoc } = await db
        .from('documents')
        .select('id, content_hash')
        .eq('source_id', sourceId)
        .eq('path', doc.path)
        .maybeSingle();

      if (!force && existingDoc && existingDoc.content_hash === hash) {
        result.docsSkipped++;
        continue;
      }

      const chunks = chunkText(doc.content);
      let embeddings: (number[] | null)[] = chunks.map(() => null);
      let embedOk = false;
      try {
        embeddings = await embedBatch(chunks.map((c) => c.content));
        embedOk = embeddings.some(Boolean);
      } catch (embedErr) {
        // 1 retry — falhas transitórias de rede (Gemini/OpenAI/Ollama)
        try {
          await new Promise((r) => setTimeout(r, 800));
          embeddings = await embedBatch(chunks.map((c) => c.content));
          embedOk = embeddings.some(Boolean);
        } catch (retryErr) {
          const msg = retryErr instanceof Error ? retryErr.message : String(retryErr);
          if (existingDoc) {
            result.errors.push(
              `warn:${doc.path}: embed falhou (${msg}) — mantidos chunks anteriores`,
            );
            result.docsSkipped++;
            continue;
          }
          result.errors.push(
            `warn:${doc.path}: embed falhou (${msg}) — chunks sem vetor`,
          );
        }
      }

      const { data: savedDoc, error: docErr } = await db
        .from('documents')
        .upsert(
          {
            source_id: sourceId,
            path: doc.path,
            url: doc.url ?? null,
            title,
            content_hash: hash,
            char_count: doc.content.length,
            status: 'pending',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'source_id,path' },
        )
        .select('id')
        .single();

      if (docErr || !savedDoc) {
        result.errors.push(`Erro ao salvar doc ${doc.path}: ${docErr?.message}`);
        continue;
      }

      await db.from('document_chunks').delete().eq('document_id', savedDoc.id);

      const chunkRows = chunks.map((chunk, i) => ({
        document_id: savedDoc.id,
        source_id: sourceId,
        chunk_index: chunk.index,
        content: chunk.content,
        token_count: chunk.tokenEstimate,
        embedding: embeddings[i] ?? null,
        metadata: {
          source_name: sourceName,
          path: doc.path,
          url: doc.url ?? null,
          title,
          chunk_index: chunk.index,
          total_chunks: chunks.length,
        },
      }));

      const { error: chunkErr } = await db.from('document_chunks').insert(chunkRows);
      if (chunkErr) {
        result.errors.push(`Erro ao inserir chunks de ${doc.path}: ${chunkErr.message}`);
        continue;
      }

      result.chunksCreated += chunks.length;
      result.chunksEmbedded += embeddings.filter(Boolean).length;

      await db
        .from('documents')
        .update({
          status: embedOk ? 'embedded' : 'chunked',
          indexed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', savedDoc.id);

      result.docsProcessed++;
    } catch (err) {
      result.errors.push(`${doc.path}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

/** Remove docs/chunks que saíram do keep set / escopo atual. */
async function pruneOrphanDocuments(
  sourceId: string,
  keepPaths: Set<string>,
  result: IngestResult,
  pathScope: ReturnType<typeof parseRagPathScope> = 'all',
): Promise<void> {
  const db = createAdminClient();
  const { data: existing, error } = await db
    .from('documents')
    .select('id, path')
    .eq('source_id', sourceId);

  if (error || !existing?.length) return;

  const orphans = existing.filter(
    (d) => !keepPaths.has(d.path) || shouldSkipRagPath(d.path, pathScope),
  );
  if (orphans.length === 0) return;

  const orphanIds = orphans.map((d) => d.id);
  await db.from('document_chunks').delete().in('document_id', orphanIds);
  await db.from('documents').delete().in('id', orphanIds);
  result.errors.push(`prune: removidos ${orphans.length} docs fora do escopo`);
}

async function countSourceChunks(sourceId: string): Promise<number> {
  const db = createAdminClient();
  const { count } = await db
    .from('document_chunks')
    .select('id', { count: 'exact', head: true })
    .eq('source_id', sourceId);
  return count ?? 0;
}

async function countSourceDocs(sourceId: string): Promise<number> {
  const db = createAdminClient();
  const { count } = await db
    .from('documents')
    .select('id', { count: 'exact', head: true })
    .eq('source_id', sourceId);
  return count ?? 0;
}

// ─── Wrapper com marcação de status na source ────────────────────────────────

async function withSourceStatus(
  sourceId: string,
  fn: (result: IngestResult) => Promise<void>,
): Promise<IngestResult> {
  const db = createAdminClient();
  await db
    .from('knowledge_sources')
    .update({ status: 'indexing', error_msg: null, updated_at: new Date().toISOString() })
    .eq('id', sourceId);

  const result: IngestResult = {
    sourceId,
    docsProcessed: 0,
    docsSkipped: 0,
    chunksCreated: 0,
    chunksEmbedded: 0,
    errors: [],
  };

  try {
    await fn(result);

    // Contagens reais no banco — NÃO zerar chunk_count quando tudo é skip (hash igual)
    const [docCount, chunkCount] = await Promise.all([
      countSourceDocs(sourceId),
      countSourceChunks(sourceId),
    ]);

    const softWarns = result.errors.filter(
      (e) => e.startsWith('prune:') || e.startsWith('warn:'),
    );
    const hardErrors = result.errors.filter(
      (e) => !e.startsWith('prune:') && !e.startsWith('warn:'),
    );
    const ok =
      result.docsProcessed > 0 ||
      result.docsSkipped > 0 ||
      chunkCount > 0;

    // Soft warn (1 arquivo embed falhou) NÃO polui UI vermelha se o resto indexou
    const errorMsg =
      hardErrors.length > 0
        ? hardErrors.slice(0, 3).join('; ')
        : softWarns.length > 0 && !ok
          ? softWarns.slice(0, 2).join('; ')
          : null;

    if (softWarns.length > 0 && ok) {
      console.warn(`[ingest] ${sourceId} avisos soft (${softWarns.length}):`, softWarns.slice(0, 5));
    }

    await db
      .from('knowledge_sources')
      .update({
        status: !ok && hardErrors.length > 0 ? 'error' : 'indexed',
        last_indexed_at: new Date().toISOString(),
        doc_count: docCount,
        chunk_count: chunkCount,
        error_msg: errorMsg,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sourceId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await db
      .from('knowledge_sources')
      .update({ status: 'error', error_msg: msg, updated_at: new Date().toISOString() })
      .eq('id', sourceId);
    throw err;
  }

  return result;
}

// ─── Dispatcher principal ────────────────────────────────────────────────────

/**
 * Ingere qualquer knowledge_source a partir do seu ID.
 * Detecta o source_type e chama o handler correto.
 * @param opts.force — reprocessa mesmo com content_hash igual
 */
export async function ingestSource(
  sourceId: string,
  opts?: { force?: boolean },
): Promise<IngestResult> {
  const db = createAdminClient();
  const force = opts?.force === true;

  const { data: source, error: srcErr } = await db
    .from('knowledge_sources')
    .select('*')
    .eq('id', sourceId)
    .single();

  if (srcErr || !source) throw new Error(`Source ${sourceId} não encontrada`);
  const ks = source as KnowledgeSource;

  return withSourceStatus(sourceId, async (result) => {
    switch (ks.source_type) {

      case 'github': {
        if (!ks.url) throw new Error('URL do repositório GitHub é obrigatória');
        const { owner, repo } = parseGithubUrl(ks.url);
        // v2 — default enxuto: prosa (.md) + dados estruturados (.ts em src/data,
        // filtrado por path-policy) + configs de texto. FORA: .tsx/.html/.css/.js/.jsx
        // (componentes/markup = ruído que inflava o índice p/ ~12k chunks de código).
        // Override por fonte via config.extensions.
        const extensions = (ks.config.extensions as string[] | undefined) ?? [
          '.md', '.mdx', '.txt', '.yaml', '.yml', '.json', '.ts',
        ];
        const token = (ks.config.token as string | undefined) ?? process.env.GITHUB_TOKEN;
        // Portal Foursys = fonte única (institucional + briefings). Default all.
        const pathScope = parseRagPathScope(ks.config.pathScope);

        const files = await listRepoFiles(
          owner,
          repo,
          extensions,
          token,
          (ks.config.branch as string | undefined) ?? 'main',
          pathScope,
        );

        const GITHUB_FETCH_CONCURRENCY = Number.parseInt(
          process.env.GITHUB_FETCH_CONCURRENCY ?? '6',
          10,
        );
        const fetched = await mapPool(
          files,
          GITHUB_FETCH_CONCURRENCY,
          async (file): Promise<DocInput | null> => {
            try {
              const content = await fetchFileContent(owner, repo, file.path, token);
              return {
                path: file.path,
                content,
                url: githubFileUrl(owner, repo, file.path),
              };
            } catch (e) {
              const msg = e instanceof Error ? e.message : String(e);
              result.errors.push(`${file.path}: fetch failed (${msg})`);
              return null;
            }
          },
        );
        const docs = fetched.filter((d): d is DocInput => d !== null);
        await pruneOrphanDocuments(
          sourceId,
          new Set(docs.map((d) => d.path)),
          result,
          pathScope,
        );
        await runPipeline(sourceId, ks.name, docs, result, { force });
        break;
      }

      case 'gitlab': {
        if (!ks.url) throw new Error('URL do repositório GitLab é obrigatória');
        const extensions = (ks.config.extensions as string[] | undefined) ?? [
          '.md', '.yaml', '.yml', '.txt', '.ts', '.tsx', '.py', '.json',
        ];
        const token = (ks.config.token as string | undefined) ?? process.env.GITHUB_TOKEN;
        const branch = (ks.config.branch as string | undefined);

        const chunks = await ingestGitlabRepo({
          url: ks.url,
          sourceId,
          sourceName: ks.name,
          extensions,
          token,
          branch,
        });

        const byDoc = new Map<string, { path: string; url?: string; parts: string[] }>();
        for (const c of chunks) {
          const key = c.document_id;
          if (!byDoc.has(key)) {
            byDoc.set(key, { path: c.metadata.path, url: c.metadata.url, parts: [] });
          }
          byDoc.get(key)!.parts.push(c.content);
        }

        const docs: DocInput[] = Array.from(byDoc.values()).map((d) => ({
          path: d.path,
          content: d.parts.join('\n\n'),
          url: d.url,
        }));
        await pruneOrphanDocuments(sourceId, new Set(docs.map((d) => d.path)), result);
        await runPipeline(sourceId, ks.name, docs, result, { force });
        break;
      }

      case 'url': {
        if (!ks.url) throw new Error('URL é obrigatória para fonte do tipo url');

        const sitemapFlag = ks.config.sitemap;
        const sitemap =
          sitemapFlag === true ||
          (sitemapFlag !== false && isSiteRootUrl(ks.url));

        const maxPagesRaw = ks.config.maxPages;
        const maxPages =
          typeof maxPagesRaw === 'number'
            ? maxPagesRaw
            : typeof maxPagesRaw === 'string' && maxPagesRaw.trim()
              ? Number.parseInt(maxPagesRaw, 10)
              : undefined;

        const chunks = await fetchUrlContent({
          url: ks.url,
          sourceId,
          sourceName: ks.name,
          urls: (ks.config.urls as string[] | undefined) ?? [],
          sitemap,
          maxPages:
            Number.isFinite(maxPages) && (maxPages as number) > 0
              ? (maxPages as number)
              : undefined,
        });

        const byDoc = new Map<string, { path: string; url?: string; parts: string[] }>();
        for (const c of chunks) {
          const key = c.document_id;
          if (!byDoc.has(key)) {
            byDoc.set(key, { path: c.metadata.path, url: c.metadata.url, parts: [] });
          }
          byDoc.get(key)!.parts.push(c.content);
        }
        const docs: DocInput[] = Array.from(byDoc.values()).map((d) => ({
          path: d.path,
          content: d.parts.join('\n\n'),
          url: d.url,
          title: ks.name,
        }));
        await runPipeline(sourceId, ks.name, docs, result, { force });
        break;
      }

      case 'text': {
        const content = (ks.config.content as string | undefined) ?? '';
        if (!content) throw new Error('config.content é obrigatório para fonte do tipo text');
        await runPipeline(sourceId, ks.name, [{
          path: `text://${sourceId}`,
          content,
          title: ks.name,
        }], result, { force });
        break;
      }

      case 'local_path':
      case 'local': {
        const rootPath = (ks.config.path as string | undefined) ?? ks.url ?? '';
        if (!rootPath) throw new Error('config.path é obrigatório para fonte local');
        const extensions = (ks.config.extensions as string[] | undefined) ?? [
          '.md', '.yaml', '.yml', '.txt',
        ];

        const chunks = await ingestLocalDir({
          rootPath: join(rootPath),
          sourceId,
          sourceName: ks.name,
          extensions,
        });

        const byDoc = new Map<string, { path: string; parts: string[] }>();
        for (const c of chunks) {
          const key = c.document_id;
          if (!byDoc.has(key)) {
            byDoc.set(key, { path: c.metadata.path, parts: [] });
          }
          byDoc.get(key)!.parts.push(c.content);
        }

        const docs: DocInput[] = Array.from(byDoc.values()).map((d) => ({
          path: d.path,
          content: d.parts.join('\n\n'),
        }));
        await pruneOrphanDocuments(sourceId, new Set(docs.map((d) => d.path)), result);
        await runPipeline(sourceId, ks.name, docs, result, { force });
        break;
      }

      default:
        throw new Error(`Tipo de fonte não suportado: ${ks.source_type}`);
    }
  });
}

/** Compat — mantém a chamada antiga funcionando */
export const ingestGithubSource = ingestSource;
