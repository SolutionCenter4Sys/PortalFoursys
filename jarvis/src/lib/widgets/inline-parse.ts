import type { ChartDatum, ChartWidget, TimelineStep } from "./types";

/**
 * Parsers de UM fence de widget (jarvis-chart/table/timeline) → dados prontos
 * para render inline no MarkdownLite. Retornam null quando o JSON ainda está
 * incompleto (streaming) — o bloco simplesmente não aparece até fechar.
 */

export type InlineChart = {
  title?: string;
  chartType: ChartWidget["chartType"];
  data: ChartDatum[];
  unit?: string;
};

export type InlineTable = {
  title?: string;
  columns: string[];
  rows: string[][];
};

export type InlineTimeline = {
  title?: string;
  steps: TimelineStep[];
};

function parseJsonObject(raw: string): Record<string, unknown> | null {
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
  if (s === "donut" || s === "pie" || s === "pizza" || s === "doughnut") return "donut";
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

export function parseChartFence(raw: string): InlineChart | null {
  const json = parseJsonObject(raw);
  if (!json) return null;
  const data = parseChartData(json.data);
  if (data.length < 2) return null;
  return {
    title: typeof json.title === "string" ? json.title.slice(0, 80) : undefined,
    chartType: normalizeChartType(json.chartType ?? json.type),
    data,
    unit: typeof json.unit === "string" ? json.unit.slice(0, 8) : undefined,
  };
}

export function parseTableFence(raw: string): InlineTable | null {
  const json = parseJsonObject(raw);
  if (!json) return null;
  const columns = Array.isArray(json.columns)
    ? json.columns.map((c) => String(c).slice(0, 40))
    : [];
  const rowsRaw = Array.isArray(json.rows) ? json.rows : [];
  const rows: string[][] = [];
  for (const r of rowsRaw) {
    if (!Array.isArray(r)) continue;
    rows.push(columns.map((_, idx) => String(r[idx] ?? "").slice(0, 80)));
    if (rows.length >= 10) break;
  }
  if (columns.length < 2 || rows.length < 1) return null;
  return {
    title: typeof json.title === "string" ? json.title.slice(0, 80) : undefined,
    columns,
    rows,
  };
}

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

export function parseTimelineFence(raw: string): InlineTimeline | null {
  const json = parseJsonObject(raw);
  if (!json) return null;
  const steps = parseTimelineSteps(json.steps ?? json.milestones ?? json.marcos);
  if (steps.length < 2) return null;
  return {
    title: typeof json.title === "string" ? json.title.slice(0, 80) : undefined,
    steps,
  };
}

/** Detecta tabelas markdown pipe (| a | b |) em texto → InlineTable[]. */
export function parseMarkdownPipeTables(text: string): InlineTable[] {
  const lines = text.split(/\r?\n/);
  const out: InlineTable[] = [];
  let i = 0;
  while (i < lines.length) {
    const headerLine = lines[i];
    const sepLine = lines[i + 1];
    if (
      !headerLine?.includes("|") ||
      !sepLine ||
      !/^\s*\|?[\s\-:|]+\|?\s*$/.test(sepLine)
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
      if (/^\s*\|?[\s\-:|]+\|?\s*$/.test(lines[j])) {
        j += 1;
        continue;
      }
      const cells = splitRow(lines[j]);
      if (cells.length >= 2) {
        rows.push(columns.map((_, idx) => (cells[idx] ?? "").slice(0, 80)));
      }
      j += 1;
      if (rows.length >= 10) break;
    }
    if (rows.length >= 1) {
      out.push({ columns: columns.map((c) => c.slice(0, 40)), rows });
    }
    i = j;
  }
  return out;
}
