import type { HTMLAttributes } from "react";

/* Accents semânticos Foursys. Chaves legadas (indigo/cyan/violet) mantidas como
 * aliases deprecados — usar orange/mint/vanilla/none em código novo. */
type Accent =
  | "orange"
  | "mint"
  | "vanilla"
  | "none"
  | "indigo"
  | "cyan"
  | "violet";

type Props = HTMLAttributes<HTMLDivElement> & {
  elevated?: boolean;
  accent?: Accent;
};

const accents: Record<Accent, string> = {
  orange: "border-[var(--jarvis-accent)]/40",
  mint: "border-[var(--jarvis-accent-mint)]/30",
  vanilla: "border-[var(--jarvis-accent-vanilla)]/25",
  none: "border-[var(--jarvis-border)]",
  // aliases deprecados → remapeados para a paleta atual
  indigo: "border-[var(--jarvis-accent)]/40",
  cyan: "border-[var(--jarvis-accent-mint)]/30",
  violet: "border-[var(--jarvis-accent-vanilla)]/25",
};

export function Card({
  elevated = false,
  accent = "none",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <div
      className={`rounded-[var(--jarvis-radius-xl)] border ${accents[accent]} ${
        elevated ? "bg-[var(--jarvis-bg-elevated)]" : "bg-[var(--jarvis-bg-surface)]"
      } p-[var(--jarvis-space-6)] shadow-[var(--jarvis-shadow-sm)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
