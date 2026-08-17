"use client";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { authCallbackUrl } from "@/lib/supabase/config";

type Props = {
  label?: string;
  mode?: "login" | "signup";
};

export function MicrosoftButton({
  label = "Continuar com Microsoft",
  mode = "login",
}: Props) {
  async function handleMicrosoft() {
    if (!isSupabaseConfigured()) {
      // path de dev inalcançável em prod (botão fica disabled); sem alert()
      console.warn(
        "[auth] Supabase não configurado — defina NEXT_PUBLIC_SUPABASE_URL e ANON_KEY",
      );
      return;
    }

    const supabase = createClient();
    const redirectTo = authCallbackUrl(mode);

    await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        redirectTo,
        scopes: "email profile openid",
      },
    });
  }

  return (
    <button
      type="button"
      onClick={() => void handleMicrosoft()}
      disabled
      title="Em breve — OAuth não configurado ainda"
      className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-[var(--jarvis-border)] bg-[var(--jarvis-hover)] px-4 py-3 text-sm font-medium text-[var(--jarvis-fg-subtle)] opacity-50"
    >
      <MicrosoftIcon />
      {label}
    </button>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden="true">
      <rect x="1"  y="1"  width="9" height="9" fill="#F25022" />
      <rect x="11" y="1"  width="9" height="9" fill="#7FBA00" />
      <rect x="1"  y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}
