"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { mermaidRenderCandidates } from "@/lib/widgets/mermaid";

let _mermaidReady = false;

function token(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

function initMermaidTheme(mermaid: {
  initialize: (config: Record<string, unknown>) => void;
}) {
  const bg = token("--jarvis-bg", "#181828");
  const bgDim = token("--jarvis-bg-surface-dim", "#1a1a2e");
  const bgElevated = token("--jarvis-bg-elevated", "#222239");
  const fg = token("--jarvis-fg", "#f7f6f2");
  const border = token("--jarvis-bg-surface", "#2e2e4a");
  const mint = token("--jarvis-accent-mint", "#89bab1");
  const accent = token("--jarvis-accent", "#ff5315");
  const isLight =
    document.documentElement.getAttribute("data-theme") === "light";
  mermaid.initialize({
    startOnLoad: false,
    theme: isLight ? "default" : "dark",
    themeVariables: {
      fontFamily: "Nunito, ui-sans-serif, system-ui",
      fontSize: "13px",
      primaryColor: bgElevated,
      primaryTextColor: fg,
      primaryBorderColor: border,
      lineColor: mint,
      secondaryColor: bgDim,
      tertiaryColor: bgElevated,
      background: bg,
      mainBkg: bgDim,
      nodeBorder: border,
      clusterBkg: bgDim,
      titleColor: fg,
      edgeLabelBackground: bgDim,
      activeTaskBkgColor: accent,
      activeTaskBorderColor: accent,
    },
    // strict: labels vêm de saída de LLM (RAG) — HTML/click bindings seriam XSS
    securityLevel: "strict",
    // sem isso, todo parse error injeta um SVG de erro órfão no document.body
    suppressErrorRendering: true,
  });
  _mermaidReady = true;
}

async function getMermaid() {
  const mermaid = (await import("mermaid")).default;
  if (!_mermaidReady) {
    initMermaidTheme(mermaid);
  }
  return mermaid;
}

/** Re-inicializa mermaid quando o usuário troca dark/light. */
if (typeof window !== "undefined") {
  window.addEventListener("jarvis:theme", () => {
    _mermaidReady = false;
  });
}

/** Renderiza o SVG do mermaid num container. `key={code}` remonta ao mudar.
 *  `fill` = ocupa toda a altura/largura (modo expandido), escalando o SVG e
 *  neutralizando o max-width inline que o mermaid injeta. */
function MermaidCanvas({
  code,
  idBase,
  className = "",
  fill = false,
}: {
  code: string;
  idBase: string;
  className?: string;
  fill?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mermaid = await getMermaid();
      // escada de recuperação: sanitizado → reflow one-line → sem última(s) linha(s)
      let lastErr: unknown = null;
      const candidates = mermaidRenderCandidates(code);
      for (let i = 0; i < candidates.length; i++) {
        try {
          await mermaid.parse(candidates[i]);
          const id = `mmd-${idBase}-${i}-${Math.random().toString(36).slice(2)}`;
          const { svg } = await mermaid.render(id, candidates[i]);
          if (!cancelled && ref.current) {
            ref.current.innerHTML = svg;
            setLoading(false);
          }
          return;
        } catch (err) {
          lastErr = err;
        }
      }
      if (!cancelled) {
        setError(lastErr instanceof Error ? lastErr.message : "Falha ao renderizar");
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, idBase]);

  if (error) {
    return (
      <div>
        <p className="mb-2 text-xs text-[var(--jarvis-danger-fg)]">
          Erro ao renderizar diagrama: {error}
        </p>
        <pre className="overflow-x-auto rounded-lg bg-[var(--jarvis-code-bg)] p-2 text-[11px] text-[var(--jarvis-fg-muted)]">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className={`relative ${fill ? "h-full w-full" : "min-h-[80px]"}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-[var(--jarvis-fg-muted)]">Renderizando…</span>
        </div>
      )}
      <div
        ref={ref}
        className={
          fill
            ? // escala o SVG p/ preencher (neutraliza max-width inline do mermaid)
              `flex h-full w-full items-center justify-center [&_svg]:!h-full [&_svg]:!max-h-none [&_svg]:!w-full [&_svg]:!max-w-none ${className}`
            : `flex justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full ${className}`
        }
      />
    </div>
  );
}

/**
 * Diagrama mermaid com toolbar (copiar código + expandir) e modal de
 * visualização ampliada. Usado inline na conversa e no painel de contexto.
 */
export function MermaidDiagram({
  code,
  idBase,
  title,
}: {
  code: string;
  idBase: string;
  title?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  // ESC fecha o modal
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  return (
    <div className="group/diagram relative my-2 rounded-lg border border-[var(--jarvis-border)] bg-[var(--jarvis-bg-elevated)] p-3">
      {/* toolbar — some até o hover (ou sempre no mobile via focus) */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 transition-opacity group-hover/diagram:opacity-100">
        <button
          type="button"
          onClick={() => void copy()}
          className="rounded-md border border-[var(--jarvis-border)] bg-[var(--jarvis-bg)]/80 px-2 py-1 text-[10px] font-medium text-[var(--jarvis-fg-muted)] backdrop-blur hover:text-[var(--jarvis-fg)]"
        >
          {copied ? "Copiado" : "Copiar código"}
        </button>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Expandir diagrama"
          className="rounded-md border border-[var(--jarvis-border)] bg-[var(--jarvis-bg)]/80 px-2 py-1 text-[10px] font-medium text-[var(--jarvis-fg-muted)] backdrop-blur hover:text-[var(--jarvis-fg)]"
        >
          ⤢ Expandir
        </button>
      </div>

      <MermaidCanvas key={code} code={code} idBase={idBase} />

      {/* modal via portal no body — escapa de ancestrais com transform/overflow
          (senão o `fixed` fica preso na área da conversa em vez da tela toda) */}
      {expanded &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex flex-col bg-[var(--jarvis-scrim)] p-4 backdrop-blur-sm md:p-8"
            onClick={() => setExpanded(false)}
          >
            <div className="mb-3 flex shrink-0 items-center justify-between">
              <span className="text-xs font-semibold text-[var(--jarvis-accent-mint)]">
                {title ?? "Diagrama"}
              </span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="rounded-lg px-3 py-1 text-sm text-[var(--jarvis-fg-muted)] hover:bg-[var(--jarvis-hover-strong)] hover:text-[var(--jarvis-fg)]"
              >
                Fechar (Esc)
              </button>
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              className="min-h-0 flex-1 overflow-auto rounded-xl bg-[var(--jarvis-bg-elevated)] p-6"
            >
              <MermaidCanvas
                key={`${code}-lg`}
                code={code}
                idBase={`${idBase}-lg`}
                fill
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
