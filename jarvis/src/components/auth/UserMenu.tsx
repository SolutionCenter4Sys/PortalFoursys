"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/Badge";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type UserMenuProps = {
  email?: string | null;
  planId?: string | null;
  isAdmin?: boolean;
};

export function UserMenu({ email, planId, isAdmin }: UserMenuProps) {
  const router = useRouter();

  async function handleLogout() {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  if (!isSupabaseConfigured()) return null;

  const navLinkClass =
    "text-xs text-[var(--jarvis-fg-muted)] transition-colors hover:text-[var(--jarvis-fg)]";

  return (
    <nav
      aria-label="Menu do usuário"
      className="flex max-w-[min(100%,22rem)] flex-wrap items-center justify-end gap-x-2 gap-y-1 sm:max-w-none sm:gap-3"
    >
      <ThemeToggle />
      {planId && (
        <Badge tone={planId === "pro" ? "mint" : "neutral"}>{planId}</Badge>
      )}
      <Link href="/knowledge" className={navLinkClass}>
        <span className="sm:hidden">Base</span>
        <span className="hidden sm:inline">Conhecimento</span>
      </Link>
      {isAdmin && (
        <Link href="/admin/llm" className={navLinkClass}>
          LLMs
        </Link>
      )}
      <Link
        href="/settings"
        className={navLinkClass}
      >
        <span className="sm:hidden">Config</span>
        <span className="hidden sm:inline">Configurações</span>
      </Link>
      {email && (
        <span className="hidden max-w-[140px] truncate text-[var(--jarvis-fg-subtle)] md:inline">
          {email}
        </span>
      )}
      <button
        type="button"
        onClick={() => void handleLogout()}
        className="rounded-lg border border-[var(--jarvis-border-strong)] px-3 py-1 text-xs text-[var(--jarvis-fg-muted)] transition-colors hover:bg-[var(--jarvis-hover)] hover:text-[var(--jarvis-fg)]"
      >
        Sair
      </button>
    </nav>
  );
}
