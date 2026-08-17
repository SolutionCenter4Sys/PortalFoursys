import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--jarvis-accent)] text-white hover:bg-[var(--jarvis-accent-hover)]",
  secondary:
    "border border-[var(--jarvis-border)] bg-[var(--jarvis-hover)] text-[var(--jarvis-fg)] hover:bg-[var(--jarvis-hover-strong)]",
  ghost: "text-[var(--jarvis-fg-muted)] hover:bg-[var(--jarvis-hover)]",
  danger:
    "bg-[var(--jarvis-danger)] text-white hover:bg-[var(--jarvis-danger)]/90",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base font-semibold",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Props) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-[var(--jarvis-radius-md)] font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
