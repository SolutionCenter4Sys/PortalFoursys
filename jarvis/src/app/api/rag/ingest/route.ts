import { NextResponse, after, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient, isAdminClientAvailable } from '@/lib/supabase/admin';
import { ingestSource } from '@/lib/rag/ingest';

/**
 * Auth dev-only via header `x-admin-token`. Só ativa se RAG_ADMIN_TOKEN estiver
 * setado no ambiente (não-vazio). Permite reindexar via Postman/curl sem cookie
 * de sessão. Em produção, deixe RAG_ADMIN_TOKEN vazio para desabilitar.
 */
function hasAdminToken(req: NextRequest): boolean {
  const expected = process.env.RAG_ADMIN_TOKEN;
  if (!expected) return false;
  return req.headers.get('x-admin-token') === expected;
}

async function isAuthorized(req: NextRequest): Promise<boolean> {
  if (hasAdminToken(req)) return true;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return Boolean(user);
}

/**
 * POST /api/rag/ingest
 * Body: { sourceId: string }
 * Dispara ingestão de qualquer knowledge_source (por tipo: github, gitlab, url, text, local_path).
 * Roda em background — retorna imediatamente com { accepted: true }.
 */
export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isAdminClientAvailable()) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY não configurado — adicione ao .env.local' },
      { status: 503 },
    );
  }

  const body = (await req.json()) as { sourceId?: string; force?: boolean };
  if (!body.sourceId) {
    return NextResponse.json({ error: 'sourceId é obrigatório' }, { status: 400 });
  }

  // Roda após a resposta ser enviada, mas mantém o runtime vivo até concluir
  // (o `void fn()` antigo podia ser morto no flush/reload, deixando a fonte
  // presa em 'indexing' para sempre).
  const sourceId = body.sourceId;
  const force = body.force === true;
  after(async () => {
    try {
      const r = await ingestSource(sourceId, { force });
      console.log(`[ingest] ${sourceId} concluído:`, r);
    } catch (e) {
      console.error(`[ingest] ${sourceId} erro:`, e);
    }
  });

  return NextResponse.json({ accepted: true, sourceId, force });
}

/**
 * GET /api/rag/ingest?sourceId=xxx
 * Retorna status atual da source.
 */
export async function GET(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sourceId = req.nextUrl.searchParams.get('sourceId');
  if (!sourceId) return NextResponse.json({ error: 'sourceId obrigatório' }, { status: 400 });

  const { data, error } = await createAdminClient()
    .from('knowledge_sources')
    .select('id,name,status,last_indexed_at,doc_count,chunk_count,error_msg')
    .eq('id', sourceId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
