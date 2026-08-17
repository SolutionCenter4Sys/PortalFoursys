"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function FreeLimitModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--jarvis-scrim)] p-4">
      <div
        role="dialog"
        aria-labelledby="limit-title"
        className="w-full max-w-md rounded-[var(--jarvis-radius-xl)] border border-[var(--jarvis-border)] bg-[var(--jarvis-bg-elevated)] p-6 shadow-[var(--jarvis-shadow-sm)]"
      >
        <h2 id="limit-title" className="text-xl font-semibold text-[var(--jarvis-fg)]">
          Seus 15 min gratuitos acabaram
        </h2>
        <p className="mt-3 text-sm text-[var(--jarvis-fg-muted)]">
          Continue conversando sem limites com o plano Pro — minutos ilimitados,
          RAG avançado e memória cross-session (Fase 2).
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/plans">
            <Button className="w-full" size="lg">
              Ver plano Pro →
            </Button>
          </Link>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Voltar amanhã
          </Button>
        </div>
      </div>
    </div>
  );
}
