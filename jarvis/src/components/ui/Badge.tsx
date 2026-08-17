/* Tons semânticos Foursys. Chaves legadas (indigo/cyan/violet) mantidas como
 * aliases deprecados — usar orange/mint/vanilla/neutral em código novo. */
type Tone =
  | "orange"
  | "mint"
  | "vanilla"
  | "neutral"
  | "indigo"
  | "cyan"
  | "violet";

const tones: Record<Tone, string> = {
  orange:
    "bg-[var(--jarvis-accent)]/20 text-[var(--jarvis-accent-hover)]",
  mint: "bg-[var(--jarvis-accent-mint)]/20 text-[var(--jarvis-accent-mint)]",
  vanilla:
    "bg-[var(--jarvis-accent-vanilla)]/15 text-[var(--jarvis-accent-vanilla)]",
  neutral: "bg-[var(--jarvis-hover-strong)] text-[var(--jarvis-fg-muted)]",
  // aliases deprecados → remapeados para a paleta atual
  indigo: "bg-[var(--jarvis-accent)]/20 text-[var(--jarvis-accent-hover)]",
  cyan: "bg-[var(--jarvis-accent-mint)]/20 text-[var(--jarvis-accent-mint)]",
  violet:
    "bg-[var(--jarvis-accent-vanilla)]/15 text-[var(--jarvis-accent-vanilla)]",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex rounded-[var(--jarvis-radius-full)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
