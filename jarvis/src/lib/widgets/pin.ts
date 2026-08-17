/**
 * Widgets fixados no painel Contexto — sobrevivem a novos turnos.
 */

import type { Widget } from "./types";

const STORAGE_PREFIX = "jarvis:pinned-widgets:";

export function pinnedStorageKey(sessionId: string): string {
  return `${STORAGE_PREFIX}${sessionId}`;
}

export function loadPinnedWidgets(sessionId: string | null): Widget[] {
  if (!sessionId || typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(pinnedStorageKey(sessionId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Widget[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePinnedWidgets(
  sessionId: string | null,
  widgets: Widget[],
): void {
  if (!sessionId || typeof window === "undefined") return;
  try {
    if (widgets.length === 0) {
      localStorage.removeItem(pinnedStorageKey(sessionId));
    } else {
      localStorage.setItem(pinnedStorageKey(sessionId), JSON.stringify(widgets));
    }
  } catch {
    /* quota / private mode */
  }
}

/** Snapshot estável ao fixar (evita colisão com ids tipo table-0 do próximo turno). */
export function toPinnedWidget(widget: Widget): Widget {
  if (widget.id.startsWith("pinned-")) return widget;
  const stamp = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  return { ...widget, id: `pinned-${stamp}-${widget.id}` } as Widget;
}

/** Painel: fixados primeiro; efêmeros sem ids já fixados. */
export function mergePinnedAndEphemeral(
  pinned: Widget[],
  ephemeral: Widget[],
): Widget[] {
  const pinnedIds = new Set(pinned.map((w) => w.id));
  return [...pinned, ...ephemeral.filter((w) => !pinnedIds.has(w.id))];
}

export function isPinnedId(id: string): boolean {
  return id.startsWith("pinned-");
}
