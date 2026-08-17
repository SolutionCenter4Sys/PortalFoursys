import { Fragment, useState, type ReactNode } from "react";

import { MermaidDiagram } from "@/components/MermaidRender";
import { ChartBody, TableBody, TimelineBody } from "@/components/visuals";
import { looksLikeMermaid, normalizeMermaidCode } from "@/lib/widgets/mermaid";
import {
  parseChartFence,
  parseMarkdownPipeTables,
  parseTableFence,
  parseTimelineFence,
  type InlineTable,
} from "@/lib/widgets/inline-parse";

/**
 * Renderer de Markdown leve e seguro para respostas do LLM no transcript.
 * Cobre o subconjunto que o modelo emite: negrito, itálico, código inline,
 * links, títulos, listas (com/sem número) e parágrafos. Renderiza React
 * elements (sem dangerouslySetInnerHTML) → sem superfície de XSS.
 *
 * Gráficos, tabelas e linhas do tempo (`jarvis-chart`, `jarvis-table`,
 * `jarvis-timeline` e tabelas markdown pipe) renderizam INLINE aqui, dentro
 * da própria resposta — como o mermaid — em vez de irem para o painel lateral.
 */

/** tags cujo conteúdo vira widget visual renderizado inline */
const WIDGET_FENCE_LANGS = new Set([
  "jarvis-timeline",
  "jarvis-chart",
  "jarvis-table",
  "timeline",
  "chart",
  "table",
]);

// tokens inline, em ordem de precedência. As âncoras (?=\S)/(?<=\S) impedem que
// um marcador de lista "* " seja confundido com itálico.
const INLINE =
  /(`[^`]+`|\*\*(?=\S)[\s\S]+?(?<=\S)\*\*|__(?=\S)[\s\S]+?(?<=\S)__|\*(?=\S)[^*\n]+?(?<=\S)\*|_(?=\S)[^_\n]+?(?<=\S)_|\[[^\]]+\]\([^)]+\))/g;

function renderInline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  INLINE.lastIndex = 0;
  while ((m = INLINE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    const key = `${keyBase}-${i++}`;
    if (tok.startsWith("`")) {
      out.push(
        <code
          key={key}
          className="rounded bg-[var(--jarvis-code-bg)] px-1 py-0.5 text-[0.85em] text-[var(--jarvis-accent-mint)]"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith("**") || tok.startsWith("__")) {
      out.push(
        <strong key={key} className="font-bold">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith("[")) {
      const link = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok);
      if (link) {
        out.push(
          <a
            key={key}
            href={link[2]}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--jarvis-accent-hover)] underline"
          >
            {link[1]}
          </a>,
        );
      } else {
        out.push(tok);
      }
    } else {
      out.push(
        <em key={key} className="italic">
          {tok.slice(1, -1)}
        </em>,
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

type Block =
  | { type: "p"; lines: string[] }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "h"; level: number; text: string }
  | { type: "fence"; lang: string; content: string };

const BULLET = /^\s{0,3}[-*+]\s+(.*)$/;
const NUMBERED = /^\s{0,3}\d+\.\s+(.*)$/;
const HEADING = /^\s{0,3}(#{1,6})\s+(.*)$/;
const FENCE = /^\s*```\s*([a-zA-Z0-9_+-]*)\s*$/;

function parseBlocks(src: string): Block[] {
  const blocks: Block[] = [];
  const lines = src.replace(/\r\n?/g, "\n").split("\n");

  // estado de bloco cercado (``` … ```)
  let fenceLang: string | null = null;
  let fenceLines: string[] = [];

  for (const raw of lines) {
    const fenceMark = FENCE.exec(raw);

    // dentro de um fence: acumula até o ``` de fechamento
    if (fenceLang !== null) {
      if (fenceMark) {
        blocks.push({
          type: "fence",
          lang: fenceLang,
          content: fenceLines.join("\n"),
        });
        fenceLang = null;
        fenceLines = [];
      } else {
        fenceLines.push(raw);
      }
      continue;
    }
    // abre um fence
    if (fenceMark) {
      fenceLang = fenceMark[1] || "";
      fenceLines = [];
      continue;
    }

    const line = raw.trimEnd();
    const heading = HEADING.exec(line);
    const bullet = BULLET.exec(line);
    const numbered = NUMBERED.exec(line);
    const prev = blocks[blocks.length - 1];

    if (heading) {
      blocks.push({ type: "h", level: heading[1].length, text: heading[2] });
    } else if (bullet) {
      if (prev?.type === "ul") prev.items.push(bullet[1]);
      else blocks.push({ type: "ul", items: [bullet[1]] });
    } else if (numbered) {
      if (prev?.type === "ol") prev.items.push(numbered[1]);
      else blocks.push({ type: "ol", items: [numbered[1]] });
    } else if (line.trim() === "") {
      // linha em branco encerra o parágrafo/lista corrente
      if (prev?.type === "p") blocks.push({ type: "p", lines: [] });
    } else {
      if (prev?.type === "p") prev.lines.push(line);
      else blocks.push({ type: "p", lines: [line] });
    }
  }
  // fence aberto e nunca fechado (resposta truncada) — ainda renderiza
  if (fenceLang !== null && fenceLines.length > 0) {
    blocks.push({ type: "fence", lang: fenceLang, content: fenceLines.join("\n") });
  }

  // remove parágrafos vazios criados por linhas em branco
  return blocks.filter((b) => b.type !== "p" || b.lines.length > 0);
}

/** Bloco de código não-mermaid, com botão de copiar. */
function CodeBlock({ lang, content }: { lang: string; content: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group/code relative my-1">
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            /* ignore */
          }
        }}
        className="absolute top-2 right-2 rounded-md border border-[var(--jarvis-border)] bg-[var(--jarvis-bg)]/80 px-2 py-1 text-[10px] font-medium text-[var(--jarvis-fg-muted)] opacity-0 backdrop-blur transition-opacity group-hover/code:opacity-100 hover:text-[var(--jarvis-fg)]"
      >
        {copied ? "Copiado" : "Copiar"}
      </button>
      <pre className="overflow-x-auto rounded-lg bg-[var(--jarvis-code-bg)] p-3 text-[11px] leading-relaxed text-[var(--jarvis-accent-mint)]">
        <code>{content}</code>
      </pre>
      {lang && (
        <span className="mt-0.5 block text-[9px] text-[var(--jarvis-fg-subtle)] uppercase">
          {lang}
        </span>
      )}
    </div>
  );
}

/** Moldura leve p/ um visual inline (título opcional + corpo). */
function VisualFrame({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="my-1 rounded-xl border border-[var(--jarvis-border)] bg-[var(--jarvis-bg-elevated)]/50 p-3">
      {title && (
        <p className="mb-2 text-[10px] font-bold tracking-widest text-[var(--jarvis-accent-hover)] uppercase">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

/** placeholder enquanto o JSON do widget ainda está sendo transmitido (stream) */
function PendingVisual({ label }: { label: string }) {
  return (
    <p className="text-[11px] font-medium tracking-wide text-[var(--jarvis-fg-subtle)] uppercase">
      Preparando {label}…
    </p>
  );
}

/** Um bloco de parágrafo que na verdade é uma tabela markdown pipe? */
function pipeTableFromBlock(lines: string[]): InlineTable | null {
  if (lines.length < 2 || !lines[0].includes("|")) return null;
  if (!/^\s*\|?[\s\-:|]+\|?\s*$/.test(lines[1])) return null;
  return parseMarkdownPipeTables(lines.join("\n"))[0] ?? null;
}

export function MarkdownLite({ text }: { text: string }) {
  const blocks = parseBlocks(text);
  return (
    <div className="flex flex-col gap-2">
      {blocks.map((b, bi) => {
        if (b.type === "fence") {
          const lang = b.lang.toLowerCase();
          if (WIDGET_FENCE_LANGS.has(lang)) {
            if (lang === "jarvis-chart" || lang === "chart") {
              const c = parseChartFence(b.content);
              return c ? (
                <VisualFrame key={bi} title={c.title ?? "Gráfico"}>
                  <ChartBody chartType={c.chartType} data={c.data} unit={c.unit} />
                </VisualFrame>
              ) : (
                <PendingVisual key={bi} label="gráfico" />
              );
            }
            if (lang === "jarvis-table" || lang === "table") {
              const t = parseTableFence(b.content);
              return t ? (
                <VisualFrame key={bi} title={t.title ?? "Tabela"}>
                  <TableBody columns={t.columns} rows={t.rows} />
                </VisualFrame>
              ) : (
                <PendingVisual key={bi} label="tabela" />
              );
            }
            // jarvis-timeline | timeline
            const tl = parseTimelineFence(b.content);
            return tl ? (
              <VisualFrame key={bi} title={tl.title ?? "Linha do tempo"}>
                <TimelineBody steps={tl.steps} />
              </VisualFrame>
            ) : (
              <PendingVisual key={bi} label="linha do tempo" />
            );
          }
          const isMermaid =
            lang === "mermaid" ||
            (["", "text", "txt", "md", "markdown", "mmd"].includes(lang) &&
              looksLikeMermaid(b.content));
          if (isMermaid) {
            return (
              <MermaidDiagram
                key={bi}
                idBase={`md-${bi}`}
                code={normalizeMermaidCode(b.content)}
              />
            );
          }
          return <CodeBlock key={bi} lang={b.lang} content={b.content} />;
        }
        if (b.type === "h") {
          return (
            <p key={bi} className="font-bold">
              {renderInline(b.text, `h${bi}`)}
            </p>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={bi} className="ml-1 flex flex-col gap-1">
              {b.items.map((it, ii) => (
                <li key={ii} className="flex gap-2">
                  <span className="mt-[0.15em] text-[var(--jarvis-accent)]">
                    •
                  </span>
                  <span>{renderInline(it, `ul${bi}-${ii}`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (b.type === "ol") {
          return (
            <ol key={bi} className="ml-1 flex flex-col gap-1">
              {b.items.map((it, ii) => (
                <li key={ii} className="flex gap-2">
                  <span className="mt-[0.05em] text-xs font-bold text-[var(--jarvis-accent)]">
                    {ii + 1}.
                  </span>
                  <span>{renderInline(it, `ol${bi}-${ii}`)}</span>
                </li>
              ))}
            </ol>
          );
        }
        // parágrafo: junta linhas com <br/> — ou tabela markdown pipe inline
        if (b.type === "p") {
          const pipeTable = pipeTableFromBlock(b.lines);
          if (pipeTable) {
            return (
              <VisualFrame key={bi}>
                <TableBody columns={pipeTable.columns} rows={pipeTable.rows} />
              </VisualFrame>
            );
          }
          return (
            <p key={bi}>
              {b.lines.map((ln, li) => (
                <Fragment key={li}>
                  {li > 0 && <br />}
                  {renderInline(ln, `p${bi}-${li}`)}
                </Fragment>
              ))}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}
