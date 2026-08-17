import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase com service_role key.
 * Bypassa RLS — usar apenas em API routes server-side (nunca expor ao browser).
 * Requer SUPABASE_SERVICE_ROLE_KEY no .env.local.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios para o admin client.',
    );
  }

  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isAdminClientAvailable(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
