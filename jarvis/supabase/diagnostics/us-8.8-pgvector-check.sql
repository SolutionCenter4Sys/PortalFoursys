-- US-8.8 — Diagnóstico da dimensão do pgvector (RAG semântico)
-- Rode no SQL Editor do projeto Jarvis (cjhbqdahjazsdmxkopnw).
-- Objetivo: confirmar que a coluna e a função batem com o embedder em uso
-- (Ollama `nomic-embed-text` = 768 dimensões). Se divergir, o
-- match_document_chunks falha/degrada em silêncio.
--
-- Esperado: EMBED_DIMS = 768 (ver src/lib/rag/embedder.ts).

-- ── 0) Extensão pgvector instalada e versão ─────────────────────────────────
select extname, extversion
from pg_extension
where extname = 'vector';

-- ── 1) Dimensão DECLARADA na coluna document_chunks.embedding ───────────────
-- format_type mostra "vector(768)" quando a dimensão está fixada.
select a.attname                                   as coluna,
       format_type(a.atttypid, a.atttypmod)        as tipo_declarado
from pg_attribute a
join pg_class c     on c.oid = a.attrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'document_chunks'
  and a.attname = 'embedding';

-- ── 2) Dimensão REAL dos vetores já gravados ────────────────────────────────
-- vector_dims() lê a dimensão de cada vetor armazenado. Deve ser 768 e único.
select vector_dims(embedding) as dim_real, count(*) as chunks
from document_chunks
where embedding is not null
group by 1
order by 2 desc;

-- ── 3) Cobertura de embeddings (quantos chunks têm vetor) ───────────────────
select count(*)                       as total_chunks,
       count(embedding)               as com_embedding,
       count(*) - count(embedding)    as sem_embedding
from document_chunks;

-- ── 4) Assinatura da função match_document_chunks ───────────────────────────
-- Confere se o parâmetro query_embedding é vector(768) e o retorno bate.
select p.proname,
       pg_get_function_arguments(p.oid) as argumentos,
       pg_get_function_result(p.oid)    as retorno
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'match_document_chunks';

-- ── 5) (opcional) Índice ANN da coluna embedding ────────────────────────────
select indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename = 'document_chunks'
  and indexdef ilike '%embedding%';

-- ════════════════════════════════════════════════════════════════════════════
-- INTERPRETAÇÃO
--  • (1) e (2) devem mostrar 768. (4) idem no parâmetro.
--  • Se a dimensão declarada divergir da real, ou de 768 → recriar a coluna e
--    reindexar (abaixo).
--  • Se (3) mostrar muitos "sem_embedding" → reindexar as fontes.
--
-- CORREÇÃO (só se houver divergência — NÃO rode sem necessidade):
--   -- 1. dropar índice ANN e recriar a coluna na dimensão certa
--   -- ALTER TABLE document_chunks DROP COLUMN embedding;
--   -- ALTER TABLE document_chunks ADD COLUMN embedding vector(768);
--   -- 2. recriar o índice HNSW (ajuste conforme o schema atual)
--   -- CREATE INDEX ON document_chunks USING hnsw (embedding vector_cosine_ops);
--   -- 3. re-embeddar: disparar re-indexação de cada fonte pela UI /knowledge
--   --    (botão "Re-indexar") ou POST /api/rag/ingest { sourceId } por fonte.
-- ════════════════════════════════════════════════════════════════════════════
