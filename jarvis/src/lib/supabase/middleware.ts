import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  isAuthEnforced,
  isProtectedPath,
  PUBLIC_PATHS,
} from "@/lib/supabase/config";

const AUTH_PAGES = ["/auth/login", "/auth/signup"];

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Portal iframe: /embed nunca pede login (VOICE_EMBED_ANON / demo)
  if (path === "/embed" || path.startsWith("/embed/")) {
    return NextResponse.next({ request });
  }

  const authEnforced = isAuthEnforced();
  const isAuthPage = AUTH_PAGES.includes(path);

  // Em dev mode (VOICE_DEV_MODE=true) só processa auth pages.
  // Isso garante redirect de usuário já logado sem proteger /app.
  if (!authEnforced && !isAuthPage) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Usuário logado tentando acessar login/signup → redireciona para o app
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = await resolvePostAuthPath(supabase, user.id);
    return NextResponse.redirect(url);
  }

  // A partir daqui só aplica se auth estiver enforced
  if (!authEnforced) {
    return supabaseResponse;
  }

  const embedAnon = process.env.VOICE_EMBED_ANON === "true";
  const isPublic =
    PUBLIC_PATHS.includes(path) ||
    path.startsWith("/api/health") ||
    path === "/api/rag/status" ||
    path === "/api/rag/query" ||
    path.startsWith("/_next") ||
    (embedAnon && path.startsWith("/api/voice"));

  // Usuário não logado em rota protegida → login
  if (!user && isProtectedPath(path)) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Usuário logado em /app → checar onboarding
  if (user && path === "/app") {
    const onboardingDone = await hasCompletedOnboarding(supabase, user.id);
    if (!onboardingDone) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
  }

  // Usuário logado em /onboarding e já fez → /app
  if (user && path === "/onboarding") {
    const onboardingDone = await hasCompletedOnboarding(supabase, user.id);
    if (onboardingDone) {
      const url = request.nextUrl.clone();
      url.pathname = "/app";
      return NextResponse.redirect(url);
    }
  }

  // API protegida sem sessão
  if (!user && !isPublic && path.startsWith("/api/") && !path.startsWith("/api/health")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return supabaseResponse;
}

async function hasCompletedOnboarding(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
) {
  const { data } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", userId)
    .maybeSingle();

  return data?.onboarding_completed === true;
}

async function resolvePostAuthPath(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
) {
  const done = await hasCompletedOnboarding(supabase, userId);
  return done ? "/app" : "/onboarding";
}
