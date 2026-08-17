export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Auth enforced when Supabase is configured and dev bypass is off. */
export function isAuthEnforced() {
  return isSupabaseConfigured() && process.env.VOICE_DEV_MODE !== "true";
}

/**
 * Voice APIs exigem login?
 * VOICE_EMBED_ANON=true → permite /embed (Portal) e APIs de voz sem sessão
 * (útil em localhost / demo; /app continua protegido pelo middleware).
 */
export function isVoiceAuthRequired() {
  return isAuthEnforced() && process.env.VOICE_EMBED_ANON !== "true";
}

/**
 * Origem pública do app (sem barra final).
 * Homol Azure: NEXT_PUBLIC_SITE_URL=https://white-sea-0357d9b0f.7.azurestaticapps.net
 * Sem env → usa window.location.origin (dev local).
 * Usado em emailRedirectTo / OAuth redirectTo (callback Auth).
 */
export function getPublicAppOrigin(): string {
  const fromEnv = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    ""
  )
    .trim()
    .replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

/** URL de callback Auth (signup confirm, OAuth). */
export function authCallbackUrl(mode?: "signup" | "login" | string): string {
  const origin = getPublicAppOrigin();
  if (!origin) return "/auth/callback";
  return mode
    ? `${origin}/auth/callback?mode=${encodeURIComponent(mode)}`
    : `${origin}/auth/callback`;
}

export const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/callback",
  "/auth/forgot-password",
  "/showcase/orb",
  "/showcase/orb-v2",
  "/embed",
  "/privacy",
  "/plans",
];

export const PROTECTED_PREFIXES = ["/app", "/onboarding", "/settings", "/knowledge"];

export function isProtectedPath(path: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}
