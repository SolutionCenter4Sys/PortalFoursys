import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

export function Input({ label, hint, className = "", id, ...props }: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block space-y-1.5">
      {label && (
        <span className="text-sm font-medium text-[var(--jarvis-fg-muted)]">{label}</span>
      )}
      <input
        id={inputId}
        className={`w-full rounded-[var(--jarvis-radius-md)] border border-[var(--jarvis-border)] bg-[var(--jarvis-bg-surface-dim)] px-3 py-2 text-sm text-[var(--jarvis-fg)] outline-none placeholder:text-[var(--jarvis-fg-subtle)] focus:border-[var(--jarvis-accent)]/50 focus:ring-1 focus:ring-[var(--jarvis-accent)]/30 ${className}`}
        {...props}
      />
      {hint && <span className="text-xs text-[var(--jarvis-fg-subtle)]">{hint}</span>}
    </label>
  );
}
