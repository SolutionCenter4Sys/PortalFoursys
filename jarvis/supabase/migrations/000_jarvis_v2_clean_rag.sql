-- ══════════════════════════════════════════════════════════════════════════
-- Jarvis v2 — Schema LIMPO (backend enxuto: só RAG de voz)
-- ══════════════════════════════════════════════════════════════════════════
-- Rodar ESTE arquivo (sozinho) no NOVO projeto Supabase Jarvis.
-- NÃO rodar as migrations legadas 001..012 (traziam auth/billing/notes/tasks/
-- memory que o embed do Portal não usa). Este schema tem só o necessário p/ RAG.
--
-- Otimizações vs schema antigo:
--   • vector(768)  — bate com embedder (gemini-embedding-001 / text-embedding-3-small dims=768)
--   • HNSW cosine  — busca vetorial aproximada (~50ms vs scan linear)
--   • pg_trgm GIN em content — mata os ILIKE '%token%' full-scan do lexicalExactHits
--   • idempotente (IF NOT EXISTS) — pode reaplicar sem quebrar
-- ══════════════════════════════════════════════════════════════════════════

-- Extensões
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ── Fontes de conhecimento ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS knowledge_sources (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  source_type     text NOT NULL,
  url             text,
  config          jsonb NOT NULL DEFAULT '{}'::jsonb,
  status          text NOT NULL DEFAULT 'idle',
  last_indexed_at timestamptz,
  doc_count       int NOT NULL DEFAULT 0,
  chunk_count     int NOT NULL DEFAULT 0,
  error_msg       text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT knowledge_sources_source_type_check CHECK (source_type IN (
    'github', 'gitlab', 'url', 'text', 'local_path', 'local',
    'sharepoint', 'onedrive', 'google_drive', 's3', 'azure_blob'
  ))
);

-- ── Documentos ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id     uuid NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  path          text NOT NULL,
  url           text,
  title         text,
  content_hash  text NOT NULL,
  char_count    int NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'pending',
  indexed_at    timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_id, path)
);

-- ── Chunks + embeddings ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS document_chunks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id  uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  source_id    uuid NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  chunk_index  int NOT NULL,
  content      text NOT NULL,
  token_count  int NOT NULL DEFAULT 0,
  embedding    vector(768),
  metadata     jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── Índices ───────────────────────────────────────────────────────────────
-- Vetorial (HNSW cosine): busca semântica aproximada rápida.
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx
  ON document_chunks USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Lexical (pg_trgm GIN): acelera ILIKE '%token%' do lexicalExactHits.
CREATE INDEX IF NOT EXISTS document_chunks_content_trgm_idx
  ON document_chunks USING gin (content gin_trgm_ops);

-- Filtros por documento / fonte (delete/prune e match filtrado).
CREATE INDEX IF NOT EXISTS document_chunks_document_id_idx ON document_chunks(document_id);
CREATE INDEX IF NOT EXISTS document_chunks_source_id_idx   ON document_chunks(source_id);
CREATE INDEX IF NOT EXISTS documents_source_id_idx         ON documents(source_id);

-- ── Função de match semântico ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION match_document_chunks(
  query_embedding  vector(768),
  match_count      int   DEFAULT 5,
  match_threshold  float DEFAULT 0.7,
  filter_source_id uuid  DEFAULT NULL
)
RETURNS TABLE (
  id          uuid,
  document_id uuid,
  source_id   uuid,
  content     text,
  metadata    jsonb,
  similarity  float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.document_id,
    dc.source_id,
    dc.content,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) AS similarity
  FROM document_chunks dc
  WHERE dc.embedding IS NOT NULL
    AND (filter_source_id IS NULL OR dc.source_id = filter_source_id)
    AND 1 - (dc.embedding <=> query_embedding) >= match_threshold
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ══════════════════════════════════════════════════════════════════════════
-- Metering LLM (telemetria de custo/latência) — recordLlmCall / getLlmSettings
-- ══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS llm_settings (
  id         int PRIMARY KEY DEFAULT 1,
  provider   text NOT NULL DEFAULT 'gemini',
  config     jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  CONSTRAINT llm_settings_singleton CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS llm_prices (
  model          text PRIMARY KEY,
  input_per_1m   numeric NOT NULL DEFAULT 0,
  output_per_1m  numeric NOT NULL DEFAULT 0,
  thinking_per_1m numeric NOT NULL DEFAULT 0,
  currency       text NOT NULL DEFAULT 'USD',
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS llm_calls (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  user_id           uuid,
  provider          text NOT NULL,
  model             text,
  intent            text,
  prompt_tokens     int NOT NULL DEFAULT 0,
  completion_tokens int NOT NULL DEFAULT 0,
  thinking_tokens   int NOT NULL DEFAULT 0,
  total_tokens      int NOT NULL DEFAULT 0,
  cost_usd          numeric NOT NULL DEFAULT 0,
  latency_ms        int NOT NULL DEFAULT 0,
  cache_hit         boolean NOT NULL DEFAULT false,
  voice_mode        text
);
CREATE INDEX IF NOT EXISTS llm_calls_created_at_idx ON llm_calls(created_at);

-- Preços vigentes (seed)
INSERT INTO llm_prices (model, input_per_1m, output_per_1m, thinking_per_1m, currency) VALUES
  ('gemini-2.5-flash',              0.30,  2.50, 2.50, 'USD'),
  ('gemini-2.5-pro',                1.25, 10.00,10.00, 'USD'),
  ('gemini-3.1-flash-tts-preview',  0.50, 10.00, 0.00, 'USD'),
  ('gemini-3.5-flash',              1.50,  9.00, 9.00, 'USD'),
  ('gemini-embedding-001',          0.15,  0.00, 0.00, 'USD'),
  ('gpt-4o',                        2.50, 10.00, 0.00, 'USD'),
  ('gpt-4o-mini',                   0.15,  0.60, 0.00, 'USD'),
  ('text-embedding-3-small',        0.02,  0.00, 0.00, 'USD'),
  ('tts-1',                         0.00,  0.00, 0.00, 'USD'),
  ('tts-1-hd',                      0.00,  0.00, 0.00, 'USD'),
  ('whisper-1',                     0.00,  0.00, 0.00, 'USD')
ON CONFLICT (model) DO UPDATE SET
  input_per_1m = EXCLUDED.input_per_1m,
  output_per_1m = EXCLUDED.output_per_1m,
  thinking_per_1m = EXCLUDED.thinking_per_1m,
  updated_at = now();

-- ── RLS ───────────────────────────────────────────────────────────────────
-- RAG + metering acessados só via service_role (server-side). Sem policies =
-- nada exposto ao anon/browser (service_role bypassa RLS).
ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents         ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks   ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_prices        ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_calls         ENABLE ROW LEVEL SECURITY;
