"use client";

import { memo, useEffect, useRef, useState } from "react";

import { useToast } from "@/lib/ui/useToast";
import type {
  AgentJobWidget,
  ChecklistWidget,
  CitationsWidget,
  CodeWidget,
  CommandWidget,
  ComparisonWidget,
  MetricsWidget,
  NextStepsWidget,
  PersonaWidget,
  SolutionStudioWidget,
  SourceWidget,
  Widget,
} from "@/lib/widgets/types";

export type AgentJobCompleteResult = {
  jobId: string;
  status: "done" | "failed";
  summary: string;
  prompt: string;
  workspace?: string;
};

type Props = {
  widgets: Widget[];
  onDismiss: () => void;
  onSuggestionClick?: (text: string) => void;
  /** ADR-015 — Jarvis anuncia o resultado depois do approve/execução */
  onAgentJobComplete?: (result: AgentJobCompleteResult) => void;
  /** ids fixados (prefixo pinned-) */
  pinnedIds?: Set<string>;
  onTogglePin?: (widget: Widget) => void;
};

export function WidgetPanel({
  widgets,
  onDismiss,
  onSuggestionClick,
  onAgentJobComplete,
  pinnedIds,
  onTogglePin,
}: Props) {
  // diagramas, gráficos, tabelas e linhas do tempo renderizam INLINE na conversa
  // (MarkdownLite), dentro da própria resposta — não aparecem mais neste painel.
  const INLINE_KINDS = new Set(["diagram", "chart", "table", "timeline"]);
  const visible = widgets.filter((w) => !INLINE_KINDS.has(w.kind));
  if (visible.length === 0) return null;

  const pinnedCount = pinnedIds
    ? visible.filter((w) => pinnedIds.has(w.id)).length
    : 0;

  return (
    <aside
      className="flex w-full flex-col gap-3"
      aria-label="Widgets contextuais"
    >
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--jarvis-accent)]">
          Contexto ({visible.length})
          {pinnedCount > 0 ? (
            <span className="ml-1 font-semibold text-[var(--jarvis-accent-mint)]">
              · {pinnedCount} fixado{pinnedCount > 1 ? "s" : ""}
            </span>
          ) : null}
        </span>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg px-2 py-1 text-xs text-[var(--jarvis-fg-muted)] hover:bg-[var(--jarvis-hover)]"
          aria-label="Fechar widgets efêmeros"
          title="Fecha só os cards desta resposta; os fixados permanecem"
        >
          Fechar
        </button>
      </div>

      {visible.map((w) => {
        const pinned = pinnedIds?.has(w.id) ?? false;
        return (
          <div key={w.id} className="relative">
            {onTogglePin ? (
              <button
                type="button"
                onClick={() => onTogglePin(w)}
                className={`absolute top-2 right-2 z-10 rounded-lg border px-1.5 py-1 text-[10px] font-semibold shadow-sm transition ${
                  pinned
                    ? "border-[var(--jarvis-accent)] bg-[var(--jarvis-accent)] text-white"
                    : "border-[var(--jarvis-border)] bg-[var(--jarvis-bg-elevated)]/95 text-[var(--jarvis-fg-muted)] hover:border-[var(--jarvis-accent)] hover:text-[var(--jarvis-accent)]"
                }`}
                aria-label={pinned ? "Desafixar do contexto" : "Fixar no contexto"}
                title={
                  pinned
                    ? "Desafixar — some no próximo turno"
                    : "Fixar — permanece quando houver nova resposta"
                }
              >
                {pinned ? "Fixado" : "Fixar"}
              </button>
            ) : null}
            <WidgetCard
              widget={w}
              onSuggestionClick={onSuggestionClick}
              onAgentJobComplete={onAgentJobComplete}
            />
          </div>
        );
      })}
    </aside>
  );
}

// memo: widget é estável (resolvido 1×/turno) e onSuggestionClick não muda —
// evita re-render dos cards (charts/mermaid) a cada tick de health no pai.
const WidgetCard = memo(function WidgetCard({
  widget,
  onSuggestionClick,
  onAgentJobComplete,
}: {
  widget: Widget;
  onSuggestionClick?: (text: string) => void;
  onAgentJobComplete?: (result: AgentJobCompleteResult) => void;
}) {
  switch (widget.kind) {
    case "code":
      return <CodeCard w={widget} />;
    case "command":
      return <CommandCard w={widget} />;
    case "checklist":
      return <ChecklistCard w={widget} />;
    case "source":
      return <SourceCard w={widget} />;
    case "citations":
      return <CitationsCard w={widget} />;
    case "nextSteps":
      return <NextStepsCard w={widget} onClick={onSuggestionClick} />;
    case "persona":
      return <PersonaCard w={widget} onSelect={onSuggestionClick} />;
    case "solutionStudio":
      return <SolutionStudioCard w={widget} onSelect={onSuggestionClick} />;
    case "metrics":
      return <MetricsCard w={widget} />;
    case "comparison":
      return <ComparisonCard w={widget} />;
    case "agentJob":
      return (
        <AgentJobCard w={widget} onComplete={onAgentJobComplete} />
      );
    // chart | table | timeline | diagram → renderizam inline (MarkdownLite)
    default:
      return null;
  }
});

function summarizeAgentLogs(logs: string): string {
  const lines = logs
    .split("\n")
    .map((l) => l.trim())
    .filter(
      (l) =>
        l &&
        !l.startsWith("[bridge]") &&
        !l.startsWith("> Auto routed") &&
        !l.startsWith("[mock]"),
    );
  const tail = lines.slice(-4).join(" ").replace(/\s+/g, " ").trim();
  if (!tail) return "Job concluído sem detalhe nos logs.";
  return tail.length > 220 ? `${tail.slice(0, 217)}…` : tail;
}

/** ícone por tipo de fonte: GitHub, web ou documento interno */
function SourceTypeIcon({ url }: { url?: string }) {
  const cls = "h-3 w-3 shrink-0 text-[var(--jarvis-accent-mint)]";
  if (url && /github\.com|\.git\b/i.test(url)) {
    return (
      <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={cls}>
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
      </svg>
    );
  }
  if (url && /^https?:/i.test(url)) {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" className={cls}>
        <circle cx="8" cy="8" r="6.3" />
        <path d="M1.7 8h12.6M8 1.7c2.2 2.1 2.2 10.5 0 12.6-2.2-2.1-2.2-10.5 0-12.6z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true" className={cls}>
      <path d="M4 1.5h5.5L12.5 4.5V14.5H4z" />
      <path d="M9.5 1.5v3h3" />
    </svg>
  );
}

function personaInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Shell({
  label,
  color,
  children,
}: {
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`animate-slide-in-right rounded-2xl border ${color} bg-[var(--jarvis-bg-elevated)]/90 p-3 shadow-lg`}
    >
      <div className="mb-2 text-[10px] font-bold uppercase tracking-widest opacity-80">
        {label}
      </div>
      {children}
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* ignore */
        }
      }}
      className="rounded-md border border-[var(--jarvis-border)] bg-[var(--jarvis-hover)] px-2 py-1 text-[10px] font-medium text-[var(--jarvis-fg)] hover:bg-[var(--jarvis-hover-strong)]"
    >
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

function CodeCard({ w }: { w: CodeWidget }) {
  return (
    <Shell label={`Código · ${w.language}`} color="border-[var(--jarvis-accent-mint)]/30 text-[var(--jarvis-accent-mint)]">
      <div className="mb-2 flex justify-end">
        <CopyBtn text={w.code} />
      </div>
      <pre className="overflow-x-auto rounded-lg bg-[var(--jarvis-code-bg)] p-3 text-xs text-[var(--jarvis-fg)]">
        <code>{w.code}</code>
      </pre>
    </Shell>
  );
}

function CommandCard({ w }: { w: CommandWidget }) {
  return (
    <Shell label="Comandos" color="border-[var(--jarvis-accent-mint)]/30 text-[var(--jarvis-accent-mint)]">
      <ul className="space-y-1.5">
        {w.commands.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-md bg-[var(--jarvis-code-bg)] px-2 py-1 text-xs text-[var(--jarvis-accent-mint)]">
              $ {c}
            </code>
            <CopyBtn text={c} />
          </li>
        ))}
      </ul>
    </Shell>
  );
}

function ChecklistCard({ w }: { w: ChecklistWidget }) {
  const [done, setDone] = useState<Set<number>>(new Set());
  return (
    <Shell label={w.title} color="border-[var(--jarvis-accent)]/30 text-[var(--jarvis-accent-hover)]">
      <ul className="space-y-1.5 text-sm text-[var(--jarvis-fg)]">
        {w.items.map((item, i) => {
          const isDone = done.has(i);
          return (
            <li key={i} className="flex items-start gap-2">
              <button
                type="button"
                onClick={() =>
                  setDone((prev) => {
                    const next = new Set(prev);
                    if (next.has(i)) next.delete(i);
                    else next.add(i);
                    return next;
                  })
                }
                className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${
                  isDone
                    ? "border-[var(--jarvis-accent)] bg-[var(--jarvis-accent)] text-white"
                    : "border-[var(--jarvis-border-strong)]"
                }`}
                aria-label={isDone ? "Desmarcar" : "Marcar"}
              >
                {isDone && (
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
              <span className={isDone ? "line-through opacity-50" : ""}>
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}

/** US-8.5 — até 3 citações RAG agrupadas, acento mint */
function CitationsCard({ w }: { w: CitationsWidget }) {
  return (
    <Shell label="Citações" color="border-[var(--jarvis-accent-mint)]/30 text-[var(--jarvis-accent-mint)]">
      <ol className="space-y-3">
        {w.citations.map((c, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--jarvis-accent-mint)]/20 text-[10px] font-bold text-[var(--jarvis-accent-mint)]">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--jarvis-fg)]">
                <SourceTypeIcon url={c.url} />
                {c.sourceName}
              </p>
              <p className="truncate text-[11px] text-[var(--jarvis-fg-subtle)]">
                {c.path}
              </p>
              <div
                className="h-1 w-full overflow-hidden rounded-full bg-[var(--jarvis-track)]"
                title="Relevância (ordem do ranking RAG)"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--jarvis-accent-mint)] to-[var(--jarvis-accent-mint)]/40"
                  style={{ width: `${[100, 70, 45][i] ?? 30}%` }}
                />
              </div>
              {c.excerpt && (
                <p className="line-clamp-3 rounded-md bg-[var(--jarvis-code-bg)] p-2 text-xs leading-relaxed text-[var(--jarvis-fg-muted)] italic">
                  “{c.excerpt}”
                </p>
              )}
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--jarvis-accent-mint)] hover:underline"
                >
                  Abrir fonte
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 8L8 2M8 2H4M8 2V6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
      {w.query && (
        <p className="mt-3 border-t border-[var(--jarvis-border)] pt-2 text-[10px] text-[var(--jarvis-fg-subtle)] italic">
          Fontes recuperadas para: “{w.query}”
        </p>
      )}
    </Shell>
  );
}

function SourceCard({ w }: { w: SourceWidget }) {
  return (
    <Shell label="Fonte" color="border-[var(--jarvis-accent)]/30 text-[var(--jarvis-accent-hover)]">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--jarvis-fg)]">
        <SourceTypeIcon url={w.url} />
        {w.sourceName}
      </p>
      <p className="mb-2 truncate text-[11px] text-[var(--jarvis-fg-subtle)]">{w.path}</p>
      <p className="mb-2 rounded-md bg-[var(--jarvis-code-bg)] p-2 text-xs italic text-[var(--jarvis-fg-muted)]">
        “{w.snippet}”
      </p>
      {w.url && (
        <a
          href={w.url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-[var(--jarvis-accent-mint)] hover:underline"
        >
          Abrir fonte →
        </a>
      )}
    </Shell>
  );
}

function NextStepsCard({
  w,
  onClick,
}: {
  w: NextStepsWidget;
  onClick?: (text: string) => void;
}) {
  return (
    <Shell label="Próximos passos" color="border-[var(--jarvis-accent-vanilla)]/30 text-[var(--jarvis-accent-vanilla)]">
      <div className="flex flex-wrap gap-2">
        {w.suggestions.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onClick?.(s)}
            className="rounded-full border border-[var(--jarvis-accent-vanilla)]/30 bg-[var(--jarvis-accent-vanilla)]/10 px-3 py-1 text-xs text-[var(--jarvis-accent-vanilla)] hover:bg-[var(--jarvis-accent-vanilla)]/20"
          >
            {s}
          </button>
        ))}
      </div>
    </Shell>
  );
}

function PersonaCard({
  w,
  onSelect,
}: {
  w: PersonaWidget;
  onSelect?: (text: string) => void;
}) {
  return (
    <Shell
      label="Especialistas Foursys que posso consultar"
      color="border-[var(--jarvis-accent-vanilla)]/30 text-[var(--jarvis-accent-vanilla)]"
    >
      <ul className="space-y-2">
        {w.suggestions.map((p) => (
          <li key={p.agentId}>
            <button
              type="button"
              onClick={() =>
                onSelect?.(
                  `Traga o conhecimento de ${p.persona} sobre isso, respondendo como Jarvis`,
                )
              }
              className="flex w-full items-start gap-3 rounded-xl border border-[var(--jarvis-accent-vanilla)]/20 bg-[var(--jarvis-accent-vanilla)]/5 p-2 text-left hover:bg-[var(--jarvis-accent-vanilla)]/10"
            >
              <span
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--jarvis-accent-vanilla)]/15 text-xs font-black text-[var(--jarvis-accent-vanilla)] ring-1 ring-[var(--jarvis-accent-vanilla)]/30"
              >
                {personaInitials(p.persona)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--jarvis-fg)]">
                  {p.persona}
                </p>
                <p className="truncate text-[11px] text-[var(--jarvis-fg-muted)]">{p.role}</p>
                <span className="mt-0.5 inline-block rounded-full bg-[var(--jarvis-accent-vanilla)]/10 px-1.5 py-0.5 text-[9px] font-bold tracking-widest text-[var(--jarvis-accent-vanilla)]/70 uppercase">
                  {p.area}
                </span>
              </div>
              <span className="shrink-0 rounded-full border border-[var(--jarvis-accent-vanilla)]/30 px-2 py-0.5 text-[10px]">
                Consultar
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] italic text-[var(--jarvis-fg-subtle)]">
        Jarvis continua respondendo — apenas puxa o conhecimento desses especialistas.
      </p>
    </Shell>
  );
}

function SolutionStudioCard({
  w,
  onSelect,
}: {
  w: SolutionStudioWidget;
  onSelect?: (text: string) => void;
}) {
  return (
    <Shell
      label={w.title}
      color="border-[var(--jarvis-accent)]/40 text-[var(--jarvis-accent-hover)]"
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[var(--jarvis-accent)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--jarvis-accent-hover)]">
          {w.areaLabel}
        </span>
        <span className="text-[10px] text-[var(--jarvis-fg-subtle)]">{w.workflowHint}</span>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-[var(--jarvis-accent)]/20 bg-[var(--jarvis-accent)]/5 p-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--jarvis-accent)]/15 text-sm font-black text-[var(--jarvis-accent-hover)] ring-1 ring-[var(--jarvis-accent)]/30"
        >
          {personaInitials(w.agent.persona)}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--jarvis-fg)]">{w.agent.persona}</p>
          <p className="mt-0.5 text-xs text-[var(--jarvis-fg-muted)]">{w.agent.role}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onSelect?.(w.invokePrompt)}
        className="mt-3 w-full rounded-lg border border-[var(--jarvis-accent)]/30 bg-[var(--jarvis-accent)]/10 py-2 text-xs font-medium text-[var(--jarvis-fg)] hover:bg-[var(--jarvis-accent)]/20"
      >
        {w.invokePrompt}
      </button>
    </Shell>
  );
}

/* ================== widgets visuais ricos (brief layout) ================== */

/** KPI cards — número grande, label, delta colorido */
function MetricsCard({ w }: { w: MetricsWidget }) {
  if (w.items.length === 0) return null;
  return (
    <Shell label={w.title ?? "Métricas"} color="border-[var(--jarvis-accent)]/30 text-[var(--jarvis-accent-hover)]">
      <dl className="grid grid-cols-2 gap-2">
        {w.items.map((m, i) => (
          <div
            key={i}
            className="rounded-xl bg-[var(--jarvis-bg-surface-dim)]/70 p-3"
          >
            <dt className="text-[10px] font-semibold tracking-wide text-[var(--jarvis-fg-subtle)] uppercase">
              {m.label}
            </dt>
            <dd className="mt-0.5 flex flex-wrap items-baseline gap-1.5">
              <span className="text-2xl font-black text-[var(--jarvis-fg)]">
                {m.value}
              </span>
              {m.delta && (
                <span
                  className={`text-[10px] font-bold ${
                    m.deltaDirection === "down"
                      ? "text-[var(--jarvis-accent-vanilla)]"
                      : "text-[var(--jarvis-accent-mint)]"
                  }`}
                >
                  {m.deltaDirection === "down" ? "↓" : "↑"} {m.delta}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Shell>
  );
}

/** comparação A/B lado a lado — destaque laranja no TO-BE */
function ComparisonCard({ w }: { w: ComparisonWidget }) {
  if (w.rows.length === 0) return null;
  return (
    <Shell label={w.title ?? "Comparativo"} color="border-[var(--jarvis-accent)]/30 text-[var(--jarvis-accent-hover)]">
      <div className="overflow-hidden rounded-lg border border-[var(--jarvis-border)]">
        <div className="grid grid-cols-2 text-[10px] font-bold tracking-widest uppercase">
          <div className="bg-[var(--jarvis-hover)] px-2.5 py-1.5 text-[var(--jarvis-fg-subtle)]">
            {w.leftLabel}
          </div>
          <div className="bg-[var(--jarvis-accent)]/15 px-2.5 py-1.5 text-[var(--jarvis-accent-hover)]">
            {w.rightLabel}
          </div>
        </div>
        {w.rows.map((r, i) => (
          <div key={i} className="border-t border-[var(--jarvis-border)]">
            <p className="bg-[var(--jarvis-bg-surface-dim)]/60 px-2.5 py-1 text-[9px] font-bold tracking-widest text-[var(--jarvis-fg-subtle)] uppercase">
              {r.aspect}
            </p>
            <div className="grid grid-cols-2">
              <div className="px-2.5 py-2 text-xs text-[var(--jarvis-fg-muted)]">
                {r.left}
              </div>
              <div className="border-l-2 border-[var(--jarvis-accent)]/40 bg-[var(--jarvis-accent)]/5 px-2.5 py-2 text-xs font-medium text-[var(--jarvis-fg)]">
                {r.right}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

const STATUS_LABEL: Record<string, string> = {
  queued: "Na fila",
  running: "A executar",
  awaiting_approval: "Aguarda aprovação",
  done: "Concluído",
  failed: "Falhou",
};

function AgentJobCard({
  w,
  onComplete,
}: {
  w: AgentJobWidget;
  onComplete?: (result: AgentJobCompleteResult) => void;
}) {
  const { toast } = useToast();
  const [status, setStatus] = useState(w.status);
  const [logs, setLogs] = useState(w.logs ?? "");
  const [error, setError] = useState<string | null>(null);
  const [workspace, setWorkspace] = useState<string | null>(null);
  const [cwd, setCwd] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);
  const notifiedRef = useRef(false);
  const prevStatusRef = useRef(w.status);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`/api/agent/jobs/${encodeURIComponent(w.jobId)}`);
        if (!res.ok) return;
        const data = (await res.json()) as {
          status: string;
          logs?: string;
          error?: string;
          workspace?: string;
          cwd?: string;
        };
        if (cancelled) return;
        const prev = prevStatusRef.current;
        setStatus(data.status);
        setLogs(data.logs ?? "");
        setError(data.error ?? null);
        if (data.workspace) setWorkspace(data.workspace);
        if (data.cwd) setCwd(data.cwd);

        const terminal = data.status === "done" || data.status === "failed";
        const cameFromRun =
          prev === "running" ||
          prev === "queued" ||
          prev === "awaiting_approval";
        if (terminal && cameFromRun && !notifiedRef.current) {
          notifiedRef.current = true;
          const summary = summarizeAgentLogs(data.logs ?? "");
          const result: AgentJobCompleteResult = {
            jobId: w.jobId,
            status: data.status === "failed" ? "failed" : "done",
            summary,
            prompt: w.prompt,
            workspace: data.workspace,
          };
          if (result.status === "done") toast.success("Agent Bridge concluído");
          else toast.error("Agent Bridge falhou");
          onComplete?.(result);
        }
        prevStatusRef.current = data.status;
      } catch {
        /* best-effort */
      }
    };
    void poll();
    const terminal = status === "done" || status === "failed";
    if (terminal) return;
    const t = window.setInterval(() => void poll(), 1500);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, [w.jobId, w.prompt, status, onComplete, toast]);

  async function approveWrite() {
    setApproving(true);
    notifiedRef.current = false; // permitir anunciar o resultado do write
    try {
      const res = await fetch(
        `/api/agent/jobs/${encodeURIComponent(w.jobId)}/approve`,
        { method: "POST" },
      );
      if (res.ok) {
        const data = (await res.json()) as { status: string };
        prevStatusRef.current = "awaiting_approval";
        setStatus(data.status);
      }
    } finally {
      setApproving(false);
    }
  }

  return (
    <Shell
      label="Agent Bridge"
      color="border-[var(--jarvis-accent)]/30 text-[var(--jarvis-accent-hover)]"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
              status === "done"
                ? "bg-[var(--jarvis-accent-mint)]/20 text-[var(--jarvis-accent-mint)]"
                : status === "failed"
                  ? "bg-[var(--jarvis-danger-bg)] text-[var(--jarvis-danger-fg)]"
                  : "bg-[var(--jarvis-accent)]/15 text-[var(--jarvis-accent-hover)]"
            }`}
          >
            {STATUS_LABEL[status] ?? status}
          </span>
          <span className="truncate text-[10px] text-[var(--jarvis-fg-subtle)]">
            {w.jobId.slice(0, 8)}…
          </span>
        </div>
        <p className="text-xs text-[var(--jarvis-fg-muted)]">{w.prompt}</p>
        {(workspace || cwd) && (
          <p className="truncate text-[10px] text-[var(--jarvis-fg-subtle)]">
            workspace: <span className="text-[var(--jarvis-accent-mint)]">{workspace ?? "—"}</span>
            {cwd ? ` · ${cwd}` : ""}
          </p>
        )}
        {error && (
          <p className="text-[11px] text-[var(--jarvis-danger-fg)]">{error}</p>
        )}
        <pre className="max-h-40 overflow-auto rounded-lg bg-[var(--jarvis-bg)] p-2 font-mono text-[10px] leading-relaxed text-[var(--jarvis-fg-muted)] whitespace-pre-wrap">
          {logs.trim() || "Aguardando logs…"}
        </pre>
        {(status === "awaiting_approval" || status === "done") && (
          <button
            type="button"
            disabled={approving}
            onClick={() => void approveWrite()}
            className="self-start rounded-lg bg-[var(--jarvis-accent)] px-3 py-1.5 text-[10px] font-bold tracking-wide text-white uppercase disabled:opacity-50"
          >
            {approving
              ? "A aprovar…"
              : status === "awaiting_approval"
                ? "Aprovar write (criar/editar ficheiros)"
                : "Reexecutar com write"}
          </button>
        )}
        {status === "awaiting_approval" && (
          <p className="text-[10px] text-[var(--jarvis-accent-vanilla)]">
            Segurança ADR-015: aprova por voz («autorizado», «pode executar») ou neste botão.
          </p>
        )}
      </div>
    </Shell>
  );
}
