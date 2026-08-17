/**
 * Observabilidade (US-12.2) — captura de erros de runtime em `app_errors`.
 * Best-effort: nunca lança nem bloqueia o fluxo. Só grava se houver admin client.
 */

import { createAdminClient, isAdminClientAvailable } from "@/lib/supabase/admin";

export async function recordError(opts: {
  route: string;
  message: string;
  status?: number;
  userId?: string | null;
  context?: Record<string, unknown>;
}): Promise<void> {
  if (!isAdminClientAvailable()) return;
  try {
    const db = createAdminClient();
    await db.from("app_errors").insert({
      user_id: opts.userId ?? null,
      route: opts.route,
      message: (opts.message || "unknown").slice(0, 500),
      status: opts.status ?? null,
      context: opts.context ?? {},
    });
  } catch {
    /* nunca propaga — observabilidade não pode quebrar o request */
  }
}
