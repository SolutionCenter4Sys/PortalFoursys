"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/Badge";

type MemoryKind = "fact" | "preference" | "context" | "note";

type Memory = {
  id: string;
  content: string;
  kind: MemoryKind;
  created_at: string;
};

type Props = {
  /** incrementa após turno com memoriesSaved/notesChanged — força reload */
  refreshKey?: number;
};

function startOfLocalDay(d = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isToday(iso: string): boolean {
  const t = new Date(iso).getTime();
  const start = startOfLocalDay().getTime();
  const end = start + 24 * 60 * 60 * 1000;
  return t >= start && t < end;
}

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function stripPrefix(content: string): string {
  return content.replace(
    /^(Nota|Nome|Trabalho|Prefere|Não gosta de|Cargo\/empresa):\s*/i,
    "",
  );
}

/**
 * Widget fixo no /app — lista notas (e outros kinds) criados hoje.
 * Independente do painel de contexto por turno.
 */
export function NotesTodayWidget({ refreshKey = 0 }: Props) {
  const [items, setItems] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/memories");
      if (!r.ok) {
        setError(true);
        setItems([]);
        return;
      }
      const j = (await r.json()) as { memories: Memory[] };
      const today = (j.memories ?? []).filter((m) => isToday(m.created_at));
      today.sort((a, b) => {
        if (a.kind === "note" && b.kind !== "note") return -1;
        if (b.kind === "note" && a.kind !== "note") return 1;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
      setItems(today);
      setError(false);
    } catch {
      setError(true);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load, refreshKey]);

  async function removeNote(id: string) {
    if (busyId) return;
    setBusyId(id);
    const prev = items;
    setItems((m) => m.filter((x) => x.id !== id));
    try {
      const r = await fetch(`/api/memories?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!r.ok) setItems(prev);
    } catch {
      setItems(prev);
    } finally {
      setBusyId(null);
    }
  }

  async function saveEdit(m: Memory) {
    const content = draft.trim();
    if (!content || busyId) return;
    setBusyId(m.id);
    const nextContent = m.kind === "note" && !/^Nota:/i.test(content)
      ? `Nota: ${content}`
      : content;
    try {
      const r = await fetch("/api/memories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: m.id, content: nextContent }),
      });
      if (r.ok) {
        const j = (await r.json()) as { memory?: Memory };
        if (j.memory) {
          setItems((prev) =>
            prev.map((x) => (x.id === m.id ? { ...x, ...j.memory! } : x)),
          );
        } else {
          setItems((prev) =>
            prev.map((x) =>
              x.id === m.id ? { ...x, content: nextContent } : x,
            ),
          );
        }
        setEditingId(null);
      }
    } finally {
      setBusyId(null);
    }
  }

  const notes = items.filter((m) => m.kind === "note");
  const others = items.filter((m) => m.kind !== "note");
  const dateLabel = new Date().toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });

  return (
    <section
      className="rounded-[var(--jarvis-radius-xl)] border border-[var(--jarvis-accent-vanilla)]/35 bg-[var(--jarvis-bg-elevated)] p-3 shadow-[var(--jarvis-shadow-sm)]"
      aria-label="Notas de hoje"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--jarvis-accent-vanilla)]">
            Notas de hoje
          </p>
          <p className="text-[11px] capitalize text-[var(--jarvis-fg-subtle)]">
            {dateLabel}
          </p>
        </div>
        <Badge tone="vanilla">{notes.length}</Badge>
      </div>

      {loading ? (
        <p className="text-xs text-[var(--jarvis-fg-muted)]">Carregando…</p>
      ) : error ? (
        <p className="text-xs text-[var(--jarvis-fg-subtle)]">
          Faça login para ver suas notas.
        </p>
      ) : notes.length === 0 && others.length === 0 ? (
        <p className="text-xs leading-relaxed text-[var(--jarvis-fg-subtle)]">
          Nada ainda hoje. Diga “anota que…” ou adicione em{" "}
          <Link
            href="/settings"
            className="text-[var(--jarvis-accent)] hover:underline"
          >
            Configurações
          </Link>
          .
        </p>
      ) : (
        <ul className="flex max-h-56 flex-col gap-1.5 overflow-y-auto">
          {notes.map((m) => (
            <li
              key={m.id}
              className="rounded-lg border border-[var(--jarvis-border)] bg-[var(--jarvis-bg)] px-2.5 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge tone="vanilla">Nota</Badge>
                <div className="flex items-center gap-1">
                  <time
                    className="text-[10px] tabular-nums text-[var(--jarvis-fg-subtle)]"
                    dateTime={m.created_at}
                  >
                    {timeLabel(m.created_at)}
                  </time>
                  {editingId !== m.id && (
                    <>
                      <button
                        type="button"
                        disabled={busyId === m.id}
                        onClick={() => {
                          setEditingId(m.id);
                          setDraft(stripPrefix(m.content));
                        }}
                        className="text-[10px] text-[var(--jarvis-fg-subtle)] hover:text-[var(--jarvis-accent)]"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={busyId === m.id}
                        onClick={() => void removeNote(m.id)}
                        className="text-[10px] text-[var(--jarvis-fg-subtle)] hover:text-[var(--jarvis-accent)]"
                      >
                        Apagar
                      </button>
                    </>
                  )}
                </div>
              </div>
              {editingId === m.id ? (
                <div className="mt-1.5 flex flex-col gap-1.5">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value.slice(0, 180))}
                    rows={2}
                    className="w-full resize-y rounded-md border border-[var(--jarvis-border)] bg-[var(--jarvis-bg-elevated)] px-2 py-1 text-xs text-[var(--jarvis-fg)] outline-none focus:border-[var(--jarvis-accent)]"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setEditingId(null);
                        return;
                      }
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        void saveEdit(m);
                      }
                    }}
                  />
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded px-2 py-0.5 text-[10px] text-[var(--jarvis-fg-subtle)] hover:bg-[var(--jarvis-hover)]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={!draft.trim() || busyId === m.id}
                      onClick={() => void saveEdit(m)}
                      className="rounded bg-[var(--jarvis-accent)] px-2 py-0.5 text-[10px] font-semibold text-white disabled:opacity-40"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-xs leading-snug text-[var(--jarvis-fg)]">
                  {stripPrefix(m.content)}
                </p>
              )}
            </li>
          ))}
          {others.length > 0 && (
            <li className="pt-1">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--jarvis-fg-subtle)]">
                Também hoje
              </p>
              <ul className="flex flex-col gap-1">
                {others.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-start justify-between gap-2 rounded-md bg-[var(--jarvis-hover)] px-2 py-1.5 text-[11px] text-[var(--jarvis-fg-muted)]"
                  >
                    <span className="min-w-0">
                      <span className="font-medium text-[var(--jarvis-fg-subtle)]">
                        {m.kind === "fact"
                          ? "Fato"
                          : m.kind === "preference"
                            ? "Pref."
                            : "Ctx"}
                        ·{" "}
                      </span>
                      {stripPrefix(m.content)}
                    </span>
                    <time className="shrink-0 tabular-nums" dateTime={m.created_at}>
                      {timeLabel(m.created_at)}
                    </time>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      )}

      <Link
        href="/settings"
        className="mt-2 inline-block text-[10px] font-medium text-[var(--jarvis-accent)] hover:underline"
      >
        Gerir memórias →
      </Link>
    </section>
  );
}
