"use client";

import { useTheme } from "@/components/ThemeProvider";

type Props = {
  /** compact = ícone só (header); labeled = com texto (settings) */
  variant?: "icon" | "labeled";
  className?: string;
};

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThemeToggle({ variant = "icon", className = "" }: Props) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Ativar modo claro" : "Ativar modo escuro";

  if (variant === "labeled") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        aria-pressed={!isDark}
        className={`flex w-full items-center justify-between gap-4 rounded-[var(--jarvis-radius-md)] border border-[var(--jarvis-border)] px-4 py-3 text-left transition-colors hover:bg-[var(--jarvis-hover)] ${className}`}
      >
        <span>
          <span className="block text-sm font-medium text-[var(--jarvis-fg)]">
            Aparência
          </span>
          <span className="block text-xs text-[var(--jarvis-fg-muted)]">
            {isDark ? "Modo escuro" : "Modo claro"}
          </span>
        </span>
        <span className="flex items-center gap-2 rounded-full border border-[var(--jarvis-border-strong)] px-3 py-1.5 text-xs font-medium text-[var(--jarvis-fg-muted)]">
          {isDark ? <MoonIcon /> : <SunIcon />}
          {isDark ? "Escuro" : "Claro"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={!isDark}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--jarvis-border-strong)] text-[var(--jarvis-fg-muted)] transition-colors hover:bg-[var(--jarvis-hover)] hover:text-[var(--jarvis-fg)] ${className}`}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
