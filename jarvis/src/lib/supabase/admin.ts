/**
 * Admin client — acesso ao banco com privilégio total (bypassa RLS).
 *
 * Dois backends suportados (prioridade por DATABASE_URL):
 *   1. PostgreSQL local via `pg`  — quando DATABASE_URL está configurada (Docker / dev local)
 *   2. Supabase cloud             — quando NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *
 * A interface pública é idêntica nos dois casos — o código RAG (retriever/query/ingest)
 * não sabe qual backend está em uso.
 */

import { createPgClient, isPgAvailable } from '@/lib/db/pg-shim';

function isSupabaseAvailable(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function isAdminClientAvailable(): boolean {
  return isPgAvailable() || isSupabaseAvailable();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = any;

let _supabaseAdmin: AnyClient | null = null;

function createSupabaseAdmin(): AnyClient {
  if (_supabaseAdmin) return _supabaseAdmin;
  // Importação dinâmica evita erro de require quando @supabase/supabase-js
  // pode não estar disponível ou DATABASE_URL é preferida.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('@supabase/supabase-js');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  _supabaseAdmin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _supabaseAdmin;
}

/**
 * Retorna o cliente de banco de dados administrativo.
 * Prefere DATABASE_URL (postgres local) sobre Supabase cloud.
 */
export function createAdminClient(): AnyClient {
  if (isPgAvailable()) return createPgClient();
  if (isSupabaseAvailable()) return createSupabaseAdmin();
  throw new Error(
    'Nenhum banco configurado — defina DATABASE_URL (postgres local) ' +
    'ou NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (Supabase cloud).',
  );
}
