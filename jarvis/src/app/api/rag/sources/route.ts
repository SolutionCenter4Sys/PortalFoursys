import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient, isAdminClientAvailable } from '@/lib/supabase/admin';

/**
 * GET /api/rag/sources — lista todas as knowledge_sources
 * POST /api/rag/sources — cria nova source (admin)
 * DELETE /api/rag/sources?id=xxx — remove source e todos os chunks (admin)
 */

// Uma indexação parada em 'indexing' além disso foi interrompida (reload/crash)
// e não vai mais concluir — vira 'error' para poder ser re-indexada.
const INDEXING_STALE_MS = Number.parseInt(
  process.env.RAG_INDEXING_STALE_MS ?? '900000', // 15 min
  10,
);

async function resetStaleIndexing(): Promise<void> {
  if (!isAdminClientAvailable()) return;
  const cutoff = new Date(Date.now() - INDEXING_STALE_MS).toISOString();
  const db = createAdminClient();
  await db
    .from('knowledge_sources')
    .update({
      status: 'error',
      error_msg: 'Indexação interrompida (reload/timeout) — clique em Re-indexar',
      updated_at: new Date().toISOString(),
    })
    .eq('status', 'indexing')
    .lt('updated_at', cutoff);
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // limpa fontes presas antes de listar (best-effort)
  await resetStaleIndexing().catch(() => {});

  const { data, error } = await supabase
    .from('knowledge_sources')
    .select('id,name,source_type,url,status,last_indexed_at,doc_count,chunk_count,error_msg,created_at')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sources: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!isAdminClientAvailable()) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY não configurado' }, { status: 503 });
  }

  const body = (await req.json()) as {
    name?: string;
    source_type?: string;
    url?: string;
    config?: Record<string, unknown>;
  };

  if (!body.name || !body.source_type) {
    return NextResponse.json({ error: 'name e source_type são obrigatórios' }, { status: 400 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from('knowledge_sources')
    .insert({
      name: body.name,
      source_type: body.source_type,
      url: body.url ?? null,
      config: body.config ?? {},
    })
    .select('id,name,source_type,status')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!isAdminClientAvailable()) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY não configurado' }, { status: 503 });
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id obrigatório' }, { status: 400 });

  const db = createAdminClient();
  const { error } = await db.from('knowledge_sources').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: true });
}
