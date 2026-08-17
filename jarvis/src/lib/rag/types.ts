export type SourceType =
  // Implementados
  | 'github'
  | 'gitlab'
  | 'url'
  | 'text'
  | 'local_path'
  // Legado / compatibilidade
  | 'local'
  // Coming soon
  | 'sharepoint'
  | 'onedrive'
  | 'google_drive'
  | 's3'
  | 'azure_blob';
export type SourceStatus = 'idle' | 'indexing' | 'indexed' | 'error';
export type DocumentStatus = 'pending' | 'chunked' | 'embedded' | 'error';

export interface KnowledgeSource {
  id: string;
  name: string;
  source_type: SourceType;
  url: string | null;
  config: Record<string, unknown>;
  status: SourceStatus;
  last_indexed_at: string | null;
  doc_count: number;
  chunk_count: number;
  error_msg: string | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  source_id: string;
  path: string;
  url: string | null;
  title: string | null;
  content_hash: string;
  char_count: number;
  status: DocumentStatus;
  indexed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  source_id: string;
  chunk_index: number;
  content: string;
  token_count: number;
  embedding: number[] | null;
  metadata: ChunkMetadata;
  created_at: string;
}

export interface ChunkMetadata {
  source_name: string;
  path: string;
  url?: string;
  title?: string;
  chunk_index: number;
  total_chunks: number;
}

export interface RagChunk {
  id: string;
  document_id: string;
  source_id: string;
  content: string;
  metadata: ChunkMetadata;
  similarity: number;
}

export interface RagIndexMeta {
  builtAt: string;
  chunkCount: number;
  sources: string[];
}

export interface IngestResult {
  sourceId: string;
  docsProcessed: number;
  docsSkipped: number;
  chunksCreated: number;
  chunksEmbedded: number;
  errors: string[];
}

/** Hit do RAG local (keyword/TF-IDF sobre índice in-memory) */
export interface RagHit {
  sourceId: string;
  sourceName: string;
  path: string;
  url?: string;
  content: string;
  score: number;
}

export interface RagQueryResult {
  hits: RagHit[];
  contextBlock: string;
  source: "pgvector" | "local";
}
