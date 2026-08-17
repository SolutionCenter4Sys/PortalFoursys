/**
 * Marca Jarvis × Foursys — chevrons laranja + wordmark.
 * O SVG escala com o font-size do container (1em), então
 * `<JarvisLogo className="text-2xl" />` aumenta o logo inteiro.
 */
export function JarvisLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M4 4l6 6-6 6"
          stroke="var(--jarvis-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 4l6 6-6 6"
          stroke="var(--jarvis-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>
      <span className="font-black tracking-tight text-[var(--jarvis-fg)]">
        jarvis
        <span className="text-[var(--jarvis-accent)]">.</span>
      </span>
    </span>
  );
}

/** Selo institucional — usar em footers das páginas. */
export function PoweredByFoursys({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] text-[var(--jarvis-fg-subtle)] uppercase ${className}`}
    >
      Powered by
      <svg
        width="10"
        height="10"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M4 4l6 6-6 6"
          stroke="var(--jarvis-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 4l6 6-6 6"
          stroke="var(--jarvis-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </svg>
      <span className="text-[var(--jarvis-fg-muted)]">Foursys</span>
    </span>
  );
}

/** Linha decorativa Foursys no topo da viewport. */
export function BrandBar() {
  return (
    <div
      data-brand-bar
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-gradient-to-r from-[var(--jarvis-bg-elevated)] via-[var(--jarvis-accent)] to-[var(--jarvis-bg-elevated)]"
    />
  );
}
