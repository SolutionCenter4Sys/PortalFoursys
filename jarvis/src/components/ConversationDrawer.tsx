"use client";

import { useEffect } from "react";

import type { SessionSummary } from "@/lib/transcripts/service";

type Props = {
  open: boolean;
  onClose: () => void;
  sessions: SessionSummary[];
  activeSessionId: string | null;
  loading: boolean;
  onSelect: (sessionId: string) => void;
  onNew: () => void;
};

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const diff = Date.now() - then;
  const min = Math.round(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} d`;
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function ConversationDrawer({
  open,
  onClose,
  sessions,
  activeSessionId,
  loading,
  onSelect,
  onNew,
}: Props) {
  // ESC fecha
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* scrim */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-[var(--jarvis-scrim)] backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* painel */}
      <aside
        aria-label="Histórico de conversas"
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-xs flex-col border-r border-[var(--jarvis-border)] bg-[var(--jarvis-bg-elevated)] shadow-[var(--jarvis-shadow-sm)] transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--jarvis-border)] px-4 py-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--jarvis-accent)]">
            Conversas
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar histórico"
            className="rounded-lg px-2 py-1 text-xs text-[var(--jarvis-fg-muted)] hover:bg-[var(--jarvis-hover)] hover:text-[var(--jarvis-fg)]"
          >
            Fechar
          </button>
        </div>

        <div className="p-3">
          <button
            type="button"
            onClick={onNew}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--jarvis-accent)]/40 bg-[var(--jarvis-accent)]/10 px-3 py-2 text-sm font-semibold text-[var(--jarvis-accent-hover)] transition-colors hover:bg-[var(--jarvis-accent)]/20"
          >
            <span aria-hidden className="text-base leading-none">
              +
            </span>
            Nova conversa
          </button>
        </div>

        <div className="scrollbar-invisible min-h-0 flex-1 overflow-y-auto px-2 pb-4">
          {loading ? (
            <p className="px-2 py-6 text-center text-xs text-[var(--jarvis-fg-muted)]">
              Carregando…
            </p>
          ) : sessions.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-[var(--jarvis-fg-muted)]">
              Nenhuma conversa ainda. Fale com o Jarvis para começar.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {sessions.map((s) => {
                const active = s.sessionId === activeSessionId;
                return (
                  <li key={s.sessionId}>
                    <button
                      type="button"
                      onClick={() => onSelect(s.sessionId)}
                      aria-current={active}
                      className={`flex w-full flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition-colors ${
                        active
                          ? "bg-[var(--jarvis-accent)]/15 text-[var(--jarvis-fg)]"
                          : "text-[var(--jarvis-fg-muted)] hover:bg-[var(--jarvis-hover)] hover:text-[var(--jarvis-fg)]"
                      }`}
                    >
                      <span className="truncate text-sm">{s.title}</span>
                      <span className="text-[10px] text-[var(--jarvis-fg-subtle)]">
                        {relativeTime(s.lastAt)} ·{" "}
                        {s.turnCount} {s.turnCount === 1 ? "turno" : "turnos"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
