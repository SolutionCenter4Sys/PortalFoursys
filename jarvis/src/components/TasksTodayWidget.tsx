"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/Badge";

type TaskItem = {
  id: string;
  content: string;
  done: boolean;
  position: number;
};

type TaskList = {
  id: string;
  title: string;
  items: TaskItem[];
};

type Props = {
  /** incrementa após turno com tasksChanged */
  refreshKey?: number;
};

/**
 * Widget fixo no /app — listas abertas com checklist interativo (ADR-016).
 */
export function TasksTodayWidget({ refreshKey = 0 }: Props) {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/tasks?scope=all");
      if (!r.ok) {
        setError(true);
        setLists([]);
        return;
      }
      const j = (await r.json()) as { lists: TaskList[] };
      setLists(j.lists ?? []);
      setError(false);
    } catch {
      setError(true);
      setLists([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load, refreshKey]);

  async function toggleItem(item: TaskItem) {
    if (busyId || editingId) return;
    setBusyId(item.id);
    const nextDone = !item.done;
    setLists((prev) =>
      prev.map((l) => ({
        ...l,
        items: l.items.map((i) =>
          i.id === item.id ? { ...i, done: nextDone } : i,
        ),
      })),
    );
    try {
      const r = await fetch(`/api/tasks/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: nextDone }),
      });
      if (!r.ok) {
        setLists((prev) =>
          prev.map((l) => ({
            ...l,
            items: l.items.map((i) =>
              i.id === item.id ? { ...i, done: item.done } : i,
            ),
          })),
        );
      }
    } catch {
      setLists((prev) =>
        prev.map((l) => ({
          ...l,
          items: l.items.map((i) =>
            i.id === item.id ? { ...i, done: item.done } : i,
          ),
        })),
      );
    } finally {
      setBusyId(null);
    }
  }

  async function removeItem(itemId: string) {
    if (busyId) return;
    setBusyId(itemId);
    const prev = lists;
    setLists((ls) =>
      ls.map((l) => ({
        ...l,
        items: l.items.filter((i) => i.id !== itemId),
      })),
    );
    try {
      const r = await fetch(`/api/tasks/items/${itemId}`, { method: "DELETE" });
      if (!r.ok) setLists(prev);
    } catch {
      setLists(prev);
    } finally {
      setBusyId(null);
      if (editingId === itemId) setEditingId(null);
    }
  }

  async function saveEdit(item: TaskItem) {
    const content = draft.trim();
    if (!content || busyId) return;
    setBusyId(item.id);
    try {
      const r = await fetch(`/api/tasks/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (r.ok) {
        setLists((prev) =>
          prev.map((l) => ({
            ...l,
            items: l.items.map((i) =>
              i.id === item.id ? { ...i, content } : i,
            ),
          })),
        );
        setEditingId(null);
      }
    } finally {
      setBusyId(null);
    }
  }

  const pendingTotal = lists.reduce(
    (n, l) => n + l.items.filter((i) => !i.done).length,
    0,
  );

  return (
    <section
      className="rounded-[var(--jarvis-radius-xl)] border border-[var(--jarvis-accent)]/30 bg-[var(--jarvis-bg-elevated)] p-3 shadow-[var(--jarvis-shadow-sm)]"
      aria-label="Tarefas"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--jarvis-accent-hover)]">
            Tarefas
          </p>
          <p className="text-[11px] text-[var(--jarvis-fg-subtle)]">
            Checklist por voz
          </p>
        </div>
        <Badge tone="orange">{pendingTotal}</Badge>
      </div>

      {loading ? (
        <p className="text-xs text-[var(--jarvis-fg-muted)]">Carregando…</p>
      ) : error ? (
        <p className="text-xs text-[var(--jarvis-fg-subtle)]">
          Faça login para ver suas tarefas.
        </p>
      ) : lists.length === 0 ? (
        <p className="text-xs leading-relaxed text-[var(--jarvis-fg-subtle)]">
          Nenhuma lista ainda. Diga “cria a tarefa Compras e adiciona leite” ou
          abra{" "}
          <Link
            href="/settings"
            className="text-[var(--jarvis-accent)] hover:underline"
          >
            Configurações
          </Link>
          .
        </p>
      ) : (
        <div className="flex max-h-72 flex-col gap-3 overflow-y-auto">
          {lists.map((list) => (
            <div key={list.id}>
              <p className="mb-1 text-[11px] font-semibold text-[var(--jarvis-fg)]">
                {list.title}
              </p>
              {list.items.length === 0 ? (
                <p className="text-[11px] text-[var(--jarvis-fg-subtle)]">
                  (vazia)
                </p>
              ) : (
                <ul className="space-y-1">
                  {list.items.map((item) => (
                    <li key={item.id} className="flex items-start gap-2">
                      <button
                        type="button"
                        disabled={busyId === item.id || editingId === item.id}
                        onClick={() => void toggleItem(item)}
                        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${
                          item.done
                            ? "border-[var(--jarvis-accent)] bg-[var(--jarvis-accent)] text-white"
                            : "border-[var(--jarvis-border-strong)]"
                        }`}
                        aria-label={
                          item.done ? "Desmarcar item" : "Marcar como feito"
                        }
                      >
                        {item.done && (
                          <svg viewBox="0 0 12 12" className="h-3 w-3">
                            <path
                              d="M2 6l3 3 5-6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        )}
                      </button>
                      {editingId === item.id ? (
                        <div className="min-w-0 flex-1 space-y-1">
                          <input
                            value={draft}
                            onChange={(e) =>
                              setDraft(e.target.value.slice(0, 180))
                            }
                            className="w-full rounded border border-[var(--jarvis-border)] bg-[var(--jarvis-bg)] px-1.5 py-0.5 text-xs outline-none focus:border-[var(--jarvis-accent)]"
                            onKeyDown={(e) => {
                              if (e.key === "Escape") setEditingId(null);
                              if (e.key === "Enter") {
                                e.preventDefault();
                                void saveEdit(item);
                              }
                            }}
                          />
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="text-[10px] text-[var(--jarvis-fg-subtle)]"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              disabled={!draft.trim() || busyId === item.id}
                              onClick={() => void saveEdit(item)}
                              className="text-[10px] font-semibold text-[var(--jarvis-accent)]"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span
                            className={`min-w-0 flex-1 text-xs leading-snug ${
                              item.done
                                ? "text-[var(--jarvis-fg-subtle)] line-through"
                                : "text-[var(--jarvis-fg)]"
                            }`}
                          >
                            {item.content}
                          </span>
                          <button
                            type="button"
                            disabled={busyId === item.id}
                            onClick={() => {
                              setEditingId(item.id);
                              setDraft(item.content);
                            }}
                            className="shrink-0 text-[10px] text-[var(--jarvis-fg-subtle)] hover:text-[var(--jarvis-accent)]"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            disabled={busyId === item.id}
                            onClick={() => void removeItem(item.id)}
                            className="shrink-0 text-[10px] text-[var(--jarvis-fg-subtle)] hover:text-[var(--jarvis-accent)]"
                          >
                            Apagar
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <Link
        href="/settings"
        className="mt-2 inline-block text-[10px] font-medium text-[var(--jarvis-accent)] hover:underline"
      >
        Gerir tarefas →
      </Link>
    </section>
  );
}
