"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
  leaving?: boolean;
};

export type ToastApi = {
  show: (message: string, variant?: ToastVariant, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
};

export const ToastContext = createContext<ToastApi | null>(null);

const MAX_TOASTS = 3;
const DEFAULT_DURATION = 3000;
const EXIT_MS = 250;

/* orange=success · red=error · vanilla=warning · mint=info */
const variantBorder: Record<ToastVariant, string> = {
  success: "border-l-[var(--jarvis-accent)]",
  error: "border-l-[var(--jarvis-danger)]",
  warning: "border-l-[var(--jarvis-accent-vanilla)]",
  info: "border-l-[var(--jarvis-accent-mint)]",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
      );
      setTimeout(() => remove(id), EXIT_MS);
    },
    [remove],
  );

  const show = useCallback(
    (
      message: string,
      variant: ToastVariant = "info",
      duration = DEFAULT_DURATION,
    ) => {
      const id = `toast-${++idRef.current}`;
      setToasts((prev) =>
        [...prev, { id, message, variant, duration }].slice(-MAX_TOASTS),
      );
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const api = useMemo<ToastApi>(
    () => ({
      show,
      success: (m, d) => show(m, "success", d),
      error: (m, d) => show(m, "error", d),
      warning: (m, d) => show(m, "warning", d),
      info: (m, d) => show(m, "info", d),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        role="region"
        aria-label="Notificações"
        className="pointer-events-none fixed right-6 bottom-6 z-[60] flex w-full max-w-xs flex-col gap-2"
      >
        {toasts.map((t) => (
          <button
            key={t.id}
            type="button"
            role="status"
            onClick={() => dismiss(t.id)}
            className={`pointer-events-auto rounded-[var(--jarvis-radius-md)] border border-[var(--jarvis-border)] border-l-4 bg-[var(--jarvis-bg-elevated)] px-4 py-3 text-left text-sm text-[var(--jarvis-fg)] shadow-[var(--jarvis-shadow-sm)] ${
              t.leaving ? "animate-toast-out" : "animate-toast-in"
            } ${variantBorder[t.variant]}`}
          >
            {t.message}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
