import { NextResponse } from 'next/server';
import { isAdminClientAvailable } from '@/lib/supabase/admin';
import {
  isEmbedderAvailable,
  getEmbedderInfo,
  EMBED_DIMS,
} from '@/lib/rag/embedder';

/**
 * GET /api/rag/status
 * Retorna capacidades do sistema RAG (segue LLM ativa para embed).
 */
export async function GET() {
  const info = await getEmbedderInfo();
  return NextResponse.json({
    embedderAvailable: isEmbedderAvailable(),
    embedBackend: info.backend,
    embedModel:
      info.backend === 'gemini'
        ? (process.env.GEMINI_EMBED_MODEL ?? 'gemini-embedding-001')
        : info.backend === 'openai'
          ? (process.env.OPENAI_EMBED_MODEL ?? 'text-embedding-3-small')
          : (process.env.OLLAMA_EMBED_MODEL ?? 'nomic-embed-text'),
    embedDims: EMBED_DIMS,
    adminClientAvailable: isAdminClientAvailable(),
  });
}
