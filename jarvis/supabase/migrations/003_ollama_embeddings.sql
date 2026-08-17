-- Migration 003 — Troca embeddings OpenAI (1536 dims) → Ollama nomic-embed-text (768 dims)
-- Aplicar APÓS 002_rag_pgvector.sql
-- ATENÇÃO: trunca document_chunks pois embeddings existentes são incompatíveis

-- 1. Truncar chunks existentes (embeddings 1536-dim incompatíveis com 768)
TRUNCATE TABLE document_chunks CASCADE;

-- 2. Resetar status das fontes para re-indexação
UPDATE knowledge_sources SET status = 'idle', last_indexed_at = NULL;

-- 3. Remover índice HNSW antigo
DROP INDEX IF EXISTS document_chunks_embedding_idx;

-- 4. Alterar dimensão do vetor
ALTER TABLE document_chunks
  ALTER COLUMN embedding TYPE vector(768);

-- 5. Recriar índice HNSW para 768 dims (cosine)
CREATE INDEX document_chunks_embedding_idx
  ON document_chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- 6. Recriar função match_document_chunks com dimensão correta
CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding  vector(768),
  match_count      int     DEFAULT 5,
  match_threshold  float   DEFAULT 0.7,
  filter_source_id uuid    DEFAULT NULL
)
RETURNS TABLE (
  id           uuid,
  document_id  uuid,
  source_id    uuid,
  content      text,
  metadata     jsonb,
  similarity   float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    d.source_id,
    dc.content,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  JOIN documents d ON d.id = dc.document_id
  WHERE dc.embedding IS NOT NULL
    AND (filter_source_id IS NULL OR d.source_id = filter_source_id)
    AND 1 - (dc.embedding <=> query_embedding) >= match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
