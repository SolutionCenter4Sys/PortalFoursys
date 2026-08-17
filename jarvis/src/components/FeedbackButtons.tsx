"use client";

import { useState } from "react";

type Props = {
  question: string;
  answer: string;
  sessionId?: string | null;
};

/** 👍/👎 numa resposta do Jarvis — grava sinal para curar RAG/few-shot. */
export function FeedbackButtons({
  question,
  answer,
  sessionId,
  compact = false,
}: Props & { compact?: boolean }) {
  const [sent, setSent] = useState<1 | -1 | null>(null);

  async function send(rating: 1 | -1) {
    if (sent !== null) return;
    setSent(rating); // otimista
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          userQuestion: question,
          assistantAnswer: answer,
          sessionId: sessionId ?? null,
        }),
      });
    } catch {
      /* best-effort — mantém o estado otimista */
    }
  }

  if (sent !== null) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-[var(--jarvis-fg-subtle)]">
        {sent === 1 ? "👍" : "👎"} obrigado pelo feedback
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 ${
        compact ? "" : "mt-1 opacity-0 transition-opacity group-hover:opacity-100"
      }`}
    >
      <span className="text-[10px] text-[var(--jarvis-fg-subtle)]">Útil?</span>
      <button
        type="button"
        onClick={() => void send(1)}
        aria-label="Resposta útil"
        className="rounded-md px-1.5 py-0.5 text-xs text-[var(--jarvis-fg-muted)] transition-colors hover:bg-[var(--jarvis-hover)] hover:text-[var(--jarvis-accent-mint)]"
      >
        👍
      </button>
      <button
        type="button"
        onClick={() => void send(-1)}
        aria-label="Resposta ruim"
        className="rounded-md px-1.5 py-0.5 text-xs text-[var(--jarvis-fg-muted)] transition-colors hover:bg-[var(--jarvis-hover)] hover:text-[var(--jarvis-danger-fg)]"
      >
        👎
      </button>
    </div>
  );
}
