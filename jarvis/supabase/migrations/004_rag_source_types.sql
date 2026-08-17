-- Migration 004 — Expande source_type para suportar gitlab, url, text, local_path
-- Aplicar APÓS 003_ollama_embeddings.sql

-- Remove a constraint antiga (nome pode variar — inspecione com \d knowledge_sources)
ALTER TABLE knowledge_sources
  DROP CONSTRAINT IF EXISTS knowledge_sources_source_type_check;

-- Recria com todos os tipos suportados (legados + novos + coming soon)
ALTER TABLE knowledge_sources
  ADD CONSTRAINT knowledge_sources_source_type_check
  CHECK (source_type IN (
    -- Implementados
    'github',
    'gitlab',
    'url',
    'text',
    'local_path',
    -- Legado
    'local',
    -- Coming soon
    'sharepoint',
    'onedrive',
    'google_drive',
    's3',
    'azure_blob'
  ));

-- Comentário informativo
COMMENT ON COLUMN knowledge_sources.source_type IS
  'Tipo da fonte: github | gitlab | url | text | local_path (ativos) | sharepoint | onedrive | google_drive | s3 | azure_blob (em breve)';
