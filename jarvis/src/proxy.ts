import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 — substitui middleware.ts.
 * Sempre roda session check quando Supabase está configurado.
 * Em VOICE_DEV_MODE=true: só redireciona auth pages (login/signup)
 * para usuários já logados — não protege /app.
 */
export async function proxy(request: NextRequest) {
  const supabaseConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!supabaseConfigured) {
    return NextResponse.next({ request });
  }

  const { updateSession } = await import("@/lib/supabase/middleware");
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
