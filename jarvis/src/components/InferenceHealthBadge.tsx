"use client";

import { memo, useEffect, useRef, useState } from "react";

export type InferenceHealthSnapshot = {
  ok: boolean;
  mode?: string;
  streaming?: boolean;
  services?: Record<string, boolean>;
  config?: Record<string, string>;
  label: string;
};

type Props = {
  /** true → não sonda (turno em andamento / falando) */
  shouldSkip?: () => boolean;
  /** notifica o pai (streamMode / sttMode) sem o pai ser dono do estado do badge */
  onSnapshot?: (snap: InferenceHealthSnapshot) => void;
};

const INTERVAL_OK_MS = 30_000;
const INTERVAL_FAIL_MIN_MS = 8_000;
const INTERVAL_FAIL_MAX_MS = 60_000;
const FETCH_TIMEOUT_MS = 6_000;
/** A6 — não compete com 1º paint */
const FIRST_DELAY_MS = 350;

function labelFrom(data: {
  ok: boolean;
  mode?: string;
}): string {
  if (!data.ok) return "degradado";
  if (data.mode === "gateway") return "gateway";
  if (data.mode?.startsWith("openai")) return "openai";
  if (data.mode?.startsWith("gemini")) return "gemini";
  return "online";
}

/**
 * A6 — badge de saúde **assíncrono**: estado próprio, 1º fetch após idle,
 * timeout + backoff. O restante da UI (orb/transcript) não re-renderiza a cada tick.
 */
export const InferenceHealthBadge = memo(function InferenceHealthBadge({
  shouldSkip,
  onSnapshot,
}: Props) {
  const [health, setHealth] = useState<InferenceHealthSnapshot>({
    ok: false,
    label: "verificando…",
  });
  const onSnapshotRef = useRef(onSnapshot);
  onSnapshotRef.current = onSnapshot;
  const shouldSkipRef = useRef(shouldSkip);
  shouldSkipRef.current = shouldSkip;
  const failStreakRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let abort: AbortController | null = null;

    const scheduleNext = (ok: boolean) => {
      if (cancelled) return;
      let delay: number;
      if (ok) {
        failStreakRef.current = 0;
        delay = INTERVAL_OK_MS;
      } else {
        failStreakRef.current += 1;
        delay = Math.min(
          INTERVAL_FAIL_MAX_MS,
          INTERVAL_FAIL_MIN_MS * 2 ** Math.min(failStreakRef.current - 1, 3),
        );
      }
      timer = setTimeout(() => void poll(), delay);
    };

    const apply = (snap: InferenceHealthSnapshot) => {
      if (cancelled) return;
      setHealth(snap);
      onSnapshotRef.current?.(snap);
    };

    const poll = async () => {
      if (cancelled) return;
      if (shouldSkipRef.current?.()) {
        scheduleNext(true); // mantém ritmo calmo enquanto turno roda
        return;
      }

      abort?.abort();
      abort = new AbortController();
      const t = setTimeout(() => abort?.abort(), FETCH_TIMEOUT_MS);

      try {
        const res = await fetch("/api/health/inference", {
          signal: abort.signal,
          cache: "no-store",
        });
        clearTimeout(t);
        const data = (await res.json()) as {
          ok: boolean;
          mode?: string;
          streaming?: boolean;
          services?: Record<string, boolean>;
          config?: Record<string, string>;
        };
        const snap: InferenceHealthSnapshot = {
          ok: Boolean(data.ok),
          mode: data.mode,
          streaming: data.streaming,
          services: data.services,
          config: data.config,
          label: labelFrom(data),
        };
        apply(snap);
        scheduleNext(snap.ok);
      } catch {
        clearTimeout(t);
        if (cancelled) return;
        apply({ ok: false, label: "offline" });
        scheduleNext(false);
      }
    };

    // A6 — 1º paint livre; depois idle (ou timeout) dispara o poll
    const start = () => {
      const ric = (
        window as Window & {
          requestIdleCallback?: (
            cb: IdleRequestCallback,
            opts?: IdleRequestOptions,
          ) => number;
        }
      ).requestIdleCallback;
      if (typeof ric === "function") {
        ric(() => void poll(), { timeout: 1500 });
      } else {
        void poll();
      }
    };
    timer = setTimeout(start, FIRST_DELAY_MS);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      abort?.abort();
    };
  }, []);

  const verifying = health.label === "verificando…";

  return (
    <div className="hidden items-center gap-1.5 sm:flex" aria-live="polite">
      {health.services && health.mode !== "gateway" ? (
        <>
          {Object.entries(health.services).map(([svc, up]) => (
            <span
              key={svc}
              title={`${svc}: ${up ? "online" : "offline"}`}
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${
                up
                  ? "bg-[var(--jarvis-accent-mint)]/15 text-[var(--jarvis-accent-mint)]"
                  : "bg-[var(--jarvis-danger)]/15 text-[var(--jarvis-danger-fg)]"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  up ? "bg-[var(--jarvis-accent-mint)]" : "bg-[var(--jarvis-danger)]"
                }`}
              />
              {svc}
            </span>
          ))}
        </>
      ) : (
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${
            verifying
              ? "bg-[var(--jarvis-hover)] text-[var(--jarvis-fg-subtle)]"
              : health.mode === "openai"
                ? "bg-[var(--jarvis-accent-vanilla)]/15 text-[var(--jarvis-accent-vanilla)]"
                : health.ok
                  ? "bg-[var(--jarvis-accent-mint)]/15 text-[var(--jarvis-accent-mint)]"
                  : "bg-[var(--jarvis-danger)]/15 text-[var(--jarvis-danger-fg)]"
          }`}
          title={
            verifying
              ? "Checando provedor em segundo plano — UI já liberada"
              : undefined
          }
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              verifying
                ? "animate-pulse bg-[var(--jarvis-fg-subtle)]"
                : health.mode === "openai"
                  ? "bg-[var(--jarvis-accent-vanilla)]"
                  : health.ok
                    ? "bg-[var(--jarvis-accent-mint)]"
                    : "bg-[var(--jarvis-danger)]"
            }`}
          />
          {health.mode?.startsWith("openai")
            ? `OpenAI${health.mode === "openai-llm" ? " LLM" : ""} · ${health.config?.model ?? "gpt-4o-mini"}`
            : health.mode?.startsWith("gemini")
              ? `Gemini${health.mode === "gemini-llm" ? " LLM" : ""} · ${health.config?.model ?? "gemini-3.5-flash"}`
              : health.label}
        </span>
      )}
    </div>
  );
});
