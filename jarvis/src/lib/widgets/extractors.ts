import { suggestPersonas } from "@/lib/agents/registry";

import { looksLikeMermaid, normalizeMermaidCode } from "./mermaid";
import type {
  ChartDatum,
  ChartWidget,
  ChecklistWidget,
  CitationsWidget,
  CodeWidget,
  CommandWidget,
  DiagramWidget,
  NextStepsWidget,
  PersonaWidget,
  SourceWidget,
  TableWidget,
  TimelineStep,
  TimelineWidget,
  WidgetContext,
  WidgetExtractor,
} from "./types";

const DIAGRAM_TITLE = /^(?:title|---\s*title:)\s*(.+)$/im;

/** fence genérico compartilhado — tag tolerante (c#, obj-c), espaço após ```
 *  e CRLF aceitos. Factory: regex com flag g não pode ser compartilhada
 *  entre loops exec. */
const FENCE_SRC = "```[ \\t]*([^\\s`]*)[ \\t]*\\r?\\n([\\s\\S]*?)```";
const fenceRe = () => new RegExp(FENCE_SRC, "g");

/** fence ```mermaid explícito — aceita espaço antes da tag e diagrama de
 *  uma linha só (newline opcional) */
const MERMAID_TAG_SRC = "```[ \\t]*mermaid\\b[ \\t]*\\r?\\n?([\\s\\S]*?)```";
const mermaidTagRe = () => new RegExp(MERMAID_TAG_SRC, "gi");

/** tags sem linguagem definida — as únicas elegíveis a sniffing de conteúdo;
 *  um bloco ```python com `graph = nx.Graph()` jamais vira diagrama */
const SNIFFABLE_TAGS = new Set(["", "text", "txt", "md", "markdown", "mermaid", "mmd"]);

/** Remove fences mermaid (tagged + content-detected) para o codeExtractor
 *  não duplicá-los como widget de código. */
function stripMermaidFences(text: string): string {
  let out = text.replace(mermaidTagRe(), "");
  out = out.replace(fenceRe(), (full, tag: string, code: string) =>
    SNIFFABLE_TAGS.has(tag.toLowerCase()) && looksLikeMermaid(code) ? "" : full,
  );
  out = out.replace(
    /```[ \t]*(?:jarvis-chart|jarvis-table|jarvis-timeline|chart|table|timeline)\b[ \t]*\r?\n[\s\S]*?```/gi,
    "",
  );
  return out;
}

export const diagramExtractor: WidgetExtractor = {
  id: "diagram",
  priority: 110,
  extract(ctx) {
    const out: DiagramWidget[] = [];
    let m: RegExpExecArray | null;
    // normaliza ANTES do dedup — os dois passes podem capturar o mesmo fence
    const push = (raw: string) => {
      const code = normalizeMermaidCode(raw);
      if (code.length < 5) return;
      if (out.some((d) => d.code === code)) return;
      const t = DIAGRAM_TITLE.exec(code);
      const isMind = /^mindmap\b/im.test(code);
      out.push({
        kind: "diagram",
        id: `diagram-${out.length}`,
        title: t?.[1]?.trim() || (isMind ? "Mapa mental" : undefined),
        code,
      });
    };

    // 1. fences ```mermaid explícitos
    const tagged = mermaidTagRe();
    while ((m = tagged.exec(ctx.assistantText)) !== null) push(m[1]);

    // 2. fences sem linguagem (ou text/md) cujo conteúdo é mermaid —
    //    o LLM costuma emitir "```\nmermaid\ngraph LR..." sem tag
    const generic = fenceRe();
    while ((m = generic.exec(ctx.assistantText)) !== null) {
      if (!SNIFFABLE_TAGS.has(m[1].toLowerCase())) continue;
      if (!looksLikeMermaid(m[2])) continue;
      push(m[2]);
    }

    // 3. fence aberto e nunca fechado — resposta truncada (max_tokens) no
    //    meio do diagrama. Procura o ÚLTIMO ``` do texto (lookahead: nenhum
    //    ``` depois dele) e trata o rabo como bloco; conteúdo não-mermaid
    //    continua descartado. Escaneia o texto original porque um fence duplo
    //    ("```\n```mermaid") faria os dois openers parearem como fence vazio.
    const unclosed =
      /```[ \t]*([^\s`]*)[ \t]*\r?\n?(?![\s\S]*```)([\s\S]+)$/.exec(
        ctx.assistantText,
      );
    if (unclosed) {
      const tag = unclosed[1].toLowerCase();
      if (
        tag === "mermaid" ||
        (SNIFFABLE_TAGS.has(tag) && looksLikeMermaid(unclosed[2]))
      ) {
        push(unclosed[2]);
      }
    }

    return out;
  },
};

export const codeExtractor: WidgetExtractor = {
  id: "code",
  priority: 100,
  extract(ctx) {
    const out: CodeWidget[] = [];
    let m: RegExpExecArray | null;
    const withoutMermaid = stripMermaidFences(ctx.assistantText);
    const re = fenceRe();
    while ((m = re.exec(withoutMermaid)) !== null) {
      const code = m[2].trim();
      if (code.length < 2) continue;
      out.push({
        kind: "code",
        id: `code-${out.length}`,
        language: m[1] || guessLang(code),
        code,
      });
    }
    return out;
  },
};

export const personaExtractor: WidgetExtractor = {
  id: "persona",
  priority: 20,
  extract(ctx) {
    const suggestions = suggestPersonas(ctx.userTranscript, ctx.assistantText);
    if (suggestions.length === 0) return [];
    return [
      { kind: "persona", id: "persona-0", suggestions } satisfies PersonaWidget,
    ];
  },
};

const CMD_PREFIXES =
  /^(npm|pnpm|yarn|npx|pip|python|node|git|docker|curl|bash|sh|cd|mkdir|mv|cp|rm|ls|export|set|make|cargo|go|supabase|vercel|next|tsc)\s+/i;

export const commandExtractor: WidgetExtractor = {
  id: "command",
  priority: 90,
  extract(ctx) {
    const stripped = ctx.assistantText.replace(fenceRe(), " ");
    const lines = stripped
      .split(/\n|(?<=[.!?])\s+/)
      .map((l) => l.trim().replace(/^[`$>#*\-\d.\s]+/, "").trim())
      .filter((l) => CMD_PREFIXES.test(l) && l.length < 200);

    const unique = Array.from(new Set(lines));
    if (unique.length === 0) return [];
    return [
      {
        kind: "command",
        id: "cmd-0",
        commands: unique.slice(0, 6),
      } satisfies CommandWidget,
    ];
  },
};

const NUMBERED = /^\s*(\d+)[.)]\s+(.+)$/;
const BULLET = /^\s*[-*•]\s+(.+)$/;

export const checklistExtractor: WidgetExtractor = {
  id: "checklist",
  priority: 70,
  extract(ctx) {
    const stripped = ctx.assistantText.replace(fenceRe(), " ");
    const lines = stripped.split(/\n+/);
    const numbered: string[] = [];
    const bullets: string[] = [];
    for (const raw of lines) {
      const n = NUMBERED.exec(raw);
      if (n) {
        numbered.push(n[2].trim());
        continue;
      }
      const b = BULLET.exec(raw);
      if (b) bullets.push(b[1].trim());
    }
    const items = numbered.length >= 2 ? numbered : bullets.length >= 2 ? bullets : [];
    const cleaned = items
      .map((s) => s.replace(/\s+/g, " ").trim())
      .filter((s) => s.length > 2 && s.length < 200);
    if (cleaned.length < 2) return [];
    const title = numbered.length >= 2 ? "Passos" : "Itens";
    return [
      {
        kind: "checklist",
        id: "check-0",
        title,
        items: cleaned.slice(0, 8),
      } satisfies ChecklistWidget,
    ];
  },
};

/** US-8.5 — agrupa até 3 citações RAG num único widget */
export const citationsExtractor: WidgetExtractor = {
  id: "citations",
  priority: 85,
  extract(ctx) {
    if (!ctx.citations?.length) return [];
    const citations = ctx.citations.slice(0, 3).map((c) => {
      const excerpt = (c.excerpt || "").replace(/\s+/g, " ").trim();
      return {
        ...c,
        excerpt: excerpt.length > 160 ? `${excerpt.slice(0, 157)}…` : excerpt,
      };
    });
    return [
      {
        kind: "citations",
        id: "citations-0",
        citations,
        query: ctx.userTranscript || undefined,
      } satisfies CitationsWidget,
    ];
  },
};

export const sourceExtractor: WidgetExtractor = {
  id: "source",
  priority: 80,
  extract(ctx) {
    if (!ctx.citations?.length) return [];
    // US-8.5: o citationsExtractor agrupa as mesmas fontes num único widget;
    // este permanece como fallback para não duplicar cards no painel.
    if (citationsExtractor.extract(ctx).length > 0) return [];
    const seen = new Set<string>();
    const out: SourceWidget[] = [];
    for (const c of ctx.citations) {
      if (seen.has(c.path)) continue;
      seen.add(c.path);
      const snippet = (c.excerpt || "").replace(/\s+/g, " ").trim().slice(0, 240);
      if (!snippet) continue;
      out.push({
        kind: "source",
        id: `src-${out.length}`,
        sourceName: c.sourceName || c.path.split(/[\\/]/).pop() || c.path,
        path: c.path,
        url: c.url,
        snippet,
      });
      if (out.length >= 3) break;
    }
    return out;
  },
};

const QUESTION_STARTERS = [
  "Quer que eu",
  "Posso",
  "Deseja",
  "Quer",
  "Prefere",
];

export const nextStepsExtractor: WidgetExtractor = {
  id: "nextSteps",
  priority: 30,
  extract(ctx) {
    // TokenOps PLUS — preditivo leve tem prioridade sobre heurística de perguntas
    if (ctx.suggestedNext && ctx.suggestedNext.length > 0) {
      return [
        {
          kind: "nextSteps",
          id: "next-0",
          suggestions: Array.from(new Set(ctx.suggestedNext)).slice(0, 4),
        } satisfies NextStepsWidget,
      ];
    }
    const suggestions: string[] = [];
    const sentences = ctx.assistantText
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim());
    for (const s of sentences) {
      if (s.endsWith("?") && QUESTION_STARTERS.some((q) => s.startsWith(q))) {
        suggestions.push(s.replace(/\s+/g, " "));
      }
    }
    if (suggestions.length === 0) {
      const heuristic = defaultNextSteps(ctx);
      if (heuristic.length === 0) return [];
      return [{ kind: "nextSteps", id: "next-0", suggestions: heuristic }];
    }
    return [
      {
        kind: "nextSteps",
        id: "next-0",
        suggestions: Array.from(new Set(suggestions)).slice(0, 4),
      } satisfies NextStepsWidget,
    ];
  },
};

function defaultNextSteps(ctx: WidgetContext): string[] {
  const t = ctx.userTranscript.toLowerCase();
  if (/como funciona|explica/.test(t)) {
    return ["Mostrar exemplo prático", "Ver arquitetura", "Próximo passo"];
  }
  if (/erro|falha|bug/.test(t)) {
    return ["Ver logs", "Reproduzir localmente", "Sugerir fix"];
  }
  if (/setup|configur|instala/.test(t)) {
    return ["Ver checklist completo", "Testar agora", "Docs oficiais"];
  }
  return [];
}

function parseJsonBlock(raw: string): Record<string, unknown> | null {
  const trimmed = raw.trim();
  try {
    const v = JSON.parse(trimmed) as unknown;
    return v && typeof v === "object" && !Array.isArray(v)
      ? (v as Record<string, unknown>)
      : null;
  } catch {
    const m = /\{[\s\S]*\}/.exec(trimmed);
    if (!m) return null;
    try {
      const v = JSON.parse(m[0]) as unknown;
      return v && typeof v === "object" && !Array.isArray(v)
        ? (v as Record<string, unknown>)
        : null;
    } catch {
      return null;
    }
  }
}

function normalizeChartType(raw: unknown): ChartWidget["chartType"] {
  const s = String(raw ?? "bar").toLowerCase();
  if (s === "line" || s === "linha") return "line";
  if (s === "donut" || s === "pie" || s === "pizza" || s === "doughnut")
    return "donut";
  return "bar";
}

function parseChartData(raw: unknown): ChartDatum[] {
  if (!Array.isArray(raw)) return [];
  const out: ChartDatum[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const label = String(r.label ?? r.name ?? r.x ?? "").trim();
    const value = Number(r.value ?? r.y ?? r.count ?? r.n);
    if (!label || !Number.isFinite(value)) continue;
    out.push({ label: label.slice(0, 40), value });
    if (out.length >= 12) break;
  }
  return out;
}

/** ```jarvis-chart / ```chart — JSON → ChartWidget */
export const chartExtractor: WidgetExtractor = {
  id: "chart",
  priority: 115,
  extract(ctx) {
    const out: ChartWidget[] = [];
    const re = fenceRe();
    let m: RegExpExecArray | null;
    while ((m = re.exec(ctx.assistantText)) !== null) {
      const tag = m[1].toLowerCase();
      if (!["jarvis-chart", "chart"].includes(tag)) continue;
      const json = parseJsonBlock(m[2]);
      if (!json) continue;
      const data = parseChartData(json.data);
      if (data.length < 2) continue;
      out.push({
        kind: "chart",
        id: `chart-${out.length}`,
        title:
          typeof json.title === "string" ? json.title.slice(0, 80) : undefined,
        chartType: normalizeChartType(json.chartType ?? json.type),
        data,
        unit: typeof json.unit === "string" ? json.unit.slice(0, 8) : undefined,
      });
    }
    return out;
  },
};

function parseMarkdownTables(text: string): TableWidget[] {
  const lines = text.split(/\r?\n/);
  const out: TableWidget[] = [];
  let i = 0;
  while (i < lines.length) {
    const headerLine = lines[i];
    const sepLine = lines[i + 1];
    if (
      !headerLine?.includes("|") ||
      !sepLine ||
      !/^\s*\|?[\s-:|]+\|?\s*$/.test(sepLine)
    ) {
      i += 1;
      continue;
    }
    const splitRow = (line: string) =>
      line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim());
    const columns = splitRow(headerLine).filter(Boolean);
    if (columns.length < 2) {
      i += 1;
      continue;
    }
    const rows: string[][] = [];
    let j = i + 2;
    while (j < lines.length && lines[j].includes("|")) {
      if (/^\s*\|?[\s-:|]+\|?\s*$/.test(lines[j])) {
        j += 1;
        continue;
      }
      const cells = splitRow(lines[j]);
      if (cells.length >= 2) {
        // pad/trim to column count
        const row = columns.map((_, idx) => (cells[idx] ?? "").slice(0, 80));
        rows.push(row);
      }
      j += 1;
      if (rows.length >= 10) break;
    }
    if (rows.length >= 1) {
      out.push({
        kind: "table",
        id: `table-md-${out.length}`,
        columns: columns.map((c) => c.slice(0, 40)),
        rows,
      });
    }
    i = j;
  }
  return out;
}

/** ```jarvis-table / ```table — JSON → TableWidget (+ markdown pipe tables) */
export const tableExtractor: WidgetExtractor = {
  id: "table",
  priority: 114,
  extract(ctx) {
    const out: TableWidget[] = [];
    const re = fenceRe();
    let m: RegExpExecArray | null;
    while ((m = re.exec(ctx.assistantText)) !== null) {
      const tag = m[1].toLowerCase();
      if (!["jarvis-table", "table"].includes(tag)) continue;
      const json = parseJsonBlock(m[2]);
      if (!json) continue;
      const columns = Array.isArray(json.columns)
        ? json.columns.map((c) => String(c).slice(0, 40))
        : [];
      const rowsRaw = Array.isArray(json.rows) ? json.rows : [];
      const rows: string[][] = [];
      for (const r of rowsRaw) {
        if (!Array.isArray(r)) continue;
        rows.push(r.map((c) => String(c).slice(0, 80)));
        if (rows.length >= 10) break;
      }
      if (columns.length < 2 || rows.length < 1) continue;
      out.push({
        kind: "table",
        id: `table-${out.length}`,
        title:
          typeof json.title === "string" ? json.title.slice(0, 80) : undefined,
        columns,
        rows: rows.map((r) =>
          columns.map((_, idx) => r[idx] ?? ""),
        ),
      });
    }

    // markdown tables — só se ainda não veio JSON table
    if (out.length === 0) {
      out.push(...parseMarkdownTables(ctx.assistantText));
    }
    return out;
  },
};

function parseTimelineSteps(raw: unknown): TimelineStep[] {
  if (!Array.isArray(raw)) return [];
  const out: TimelineStep[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const title = String(r.title ?? r.name ?? r.marco ?? "").trim();
    if (title.length < 2) continue;
    const step: TimelineStep = { title: title.slice(0, 80) };
    if (typeof r.period === "string" && r.period.trim()) {
      step.period = r.period.trim().slice(0, 40);
    } else if (typeof r.date === "string" && r.date.trim()) {
      step.period = r.date.trim().slice(0, 40);
    }
    if (typeof r.description === "string" && r.description.trim()) {
      step.description = r.description.trim().slice(0, 160);
    } else if (typeof r.desc === "string" && r.desc.trim()) {
      step.description = r.desc.trim().slice(0, 160);
    }
    if (r.done === true || r.completed === true) step.done = true;
    out.push(step);
    if (out.length >= 10) break;
  }
  return out;
}

/** ```jarvis-timeline / ```timeline — JSON → TimelineWidget */
export const timelineExtractor: WidgetExtractor = {
  id: "timeline",
  priority: 113,
  extract(ctx) {
    const out: TimelineWidget[] = [];
    const re = fenceRe();
    let m: RegExpExecArray | null;
    while ((m = re.exec(ctx.assistantText)) !== null) {
      const tag = m[1].toLowerCase();
      if (!["jarvis-timeline", "timeline"].includes(tag)) continue;
      const json = parseJsonBlock(m[2]);
      if (!json) continue;
      const steps = parseTimelineSteps(json.steps ?? json.milestones ?? json.marcos);
      if (steps.length < 2) continue;
      out.push({
        kind: "timeline",
        id: `timeline-${out.length}`,
        title:
          typeof json.title === "string" ? json.title.slice(0, 80) : undefined,
        steps,
      });
    }
    return out;
  },
};

function guessLang(code: string): string {
  if (/^(import\s|from\s|def\s|print\()/m.test(code)) return "python";
  if (/^(const|let|var|function|import\s.*from)/m.test(code)) return "typescript";
  if (/^\s*<[a-z]/i.test(code)) return "html";
  if (/^\s*\{[\s\S]*\}\s*$/.test(code)) return "json";
  if (/^(SELECT|INSERT|UPDATE|CREATE)\s/im.test(code)) return "sql";
  return "text";
}

import { solutionStudioExtractor } from "./solution-studio";

export const allExtractors: WidgetExtractor[] = [
  chartExtractor,
  tableExtractor,
  timelineExtractor,
  diagramExtractor,
  solutionStudioExtractor,
  codeExtractor,
  commandExtractor,
  citationsExtractor,
  sourceExtractor,
  checklistExtractor,
  nextStepsExtractor,
  personaExtractor,
];
