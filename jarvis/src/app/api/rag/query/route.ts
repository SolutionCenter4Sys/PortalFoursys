import { NextResponse, type NextRequest } from 'next/server';
import { retrieve, formatContext } from '@/lib/rag/retriever';
import { isEmbedderAvailable } from '@/lib/rag/embedder';

/**
 * POST /api/rag/query
 * Body: { query: string; topK?: number; threshold?: number; sourceId?: string }
 * Retorna chunks relevantes e contexto formatado para injeção no LLM.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    query?: string;
    topK?: number;
    threshold?: number;
    sourceId?: string;
  };

  if (!body.query?.trim()) {
    return NextResponse.json({ error: 'query é obrigatório' }, { status: 400 });
  }

  if (!isEmbedderAvailable()) {
    return NextResponse.json(
      {
        error:
          'Embeddings indisponíveis — configure GEMINI_API_KEY, OPENAI_API_KEY ou Ollama (LOCAL_LLM_BASE_URL)',
        chunks: [],
        context: '',
        embeddingAvailable: false,
      },
      { status: 200 }, // 200 com flag — não quebra o fluxo de voz
    );
  }

  try {
    const result = await retrieve(body.query, {
      topK: body.topK ?? 5,
      threshold: body.threshold ?? 0.7,
      sourceId: body.sourceId,
    });

    return NextResponse.json({
      chunks: result.chunks,
      context: formatContext(result.chunks),
      embeddingAvailable: result.embeddingAvailable,
      count: result.chunks.length,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro no RAG retriever';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
