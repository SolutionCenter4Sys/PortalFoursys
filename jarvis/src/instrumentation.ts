/**
 * Next.js instrumentation — roda uma vez na inicialização do servidor.
 * Reseta fontes presas em "indexing" para "idle" (proteção contra restart mid-index).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  // Aquece o Redis cedo: o 1º turno de voz já acha o socket pronto (sem pagar
  // o connect no hot path). Falha silenciosa → breaker cuida do resto.
  try {
    const { warmRedis } = await import('@/lib/redis/client');
    warmRedis();
  } catch {
    /* redis opcional */
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return;

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const db = createClient(supabaseUrl, serviceKey);
    const { data } = await db
      .from('knowledge_sources')
      .update({ status: 'idle', error_msg: 'Reset automático: servidor reiniciado durante indexação' })
      .eq('status', 'indexing')
      .select('id');

    if (data && data.length > 0) {
      console.log(`[startup] ${data.length} fonte(s) resetadas de "indexing" → "idle"`);
    }
  } catch (err) {
    console.warn('[startup] Não foi possível resetar fontes indexing:', err);
  }
}
