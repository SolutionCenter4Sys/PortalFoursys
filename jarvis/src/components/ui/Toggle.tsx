"use client";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
};

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: Props) {
  return (
    <label
      className={`flex items-start justify-between gap-4 ${disabled ? "opacity-50" : ""}`}
    >
      <span className="space-y-1">
        <span className="block text-sm font-medium text-[var(--jarvis-fg)]">
          {label}
        </span>
        {description && (
          <span className="block text-xs text-[var(--jarvis-fg-muted)]">
            {description}
          </span>
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-[var(--jarvis-accent)]"
            : "bg-[var(--jarvis-bg-surface-dim)]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
