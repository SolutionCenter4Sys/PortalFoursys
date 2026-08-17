"use client";

import { useState } from "react";

import type { TurnMessage } from "@/lib/voice/types";

type Citations = NonNullable<TurnMessage["citations"]>;

/**
 * Badge mint colapsável de fontes RAG — fechado por padrão,
 * clique expande a lista de citações inline.
 */
export function CitationBadge({ citations }: { citations: Citations }) {
  const [open, setOpen] = useState(false);

  if (citations.length === 0) return null;

  return (
    <div className="mr-auto max-w-[90%]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--jarvis-accent-mint)]/30 bg-[var(--jarvis-accent-mint)]/10 px-2.5 py-1 text-[10px] font-semibold text-[var(--jarvis-accent-mint)] transition-colors hover:bg-[var(--jarvis-accent-mint)]/20"
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-90" : ""}`}
        >
          <path
            d="M2 1l4 3-4 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {citations.length} {citations.length === 1 ? "fonte" : "fontes"}
      </button>

      {open && (
        <div className="mt-1.5 animate-fade-up space-y-1 rounded-xl border border-[var(--jarvis-accent-mint)]/30 bg-[var(--jarvis-bg-surface-dim)]/80 px-3 py-2">
          {citations.map((c, i) => (
            <div key={i} className="text-xs text-[var(--jarvis-fg-muted)]">
              <span className="text-[var(--jarvis-fg)]">{c.sourceName}</span>
              {" · "}
              {c.url ? (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--jarvis-accent-mint)] hover:underline"
                >
                  {c.path}
                </a>
              ) : (
                <span>{c.path}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
