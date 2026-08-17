import type { RagCitation } from "@/lib/rag/query";

export type { RagCitation };

export type WidgetContext = {
  userTranscript: string;
  assistantText: string;
  citations?: RagCitation[];
  intent?: string;
  /** TokenOps PLUS — sugestões do preditivo leve (prioridade no nextSteps) */
  suggestedNext?: string[];
};

export type CodeWidget = {
  kind: "code";
  id: string;
  language: string;
  code: string;
};

export type CommandWidget = {
  kind: "command";
  id: string;
  commands: string[];
};

export type ChecklistWidget = {
  kind: "checklist";
  id: string;
  title: string;
  items: string[];
};

export type SourceWidget = {
  kind: "source";
  id: string;
  sourceName: string;
  path: string;
  url?: string;
  snippet: string;
};

export type NextStepsWidget = {
  kind: "nextSteps";
  id: string;
  suggestions: string[];
};

export type DiagramWidget = {
  kind: "diagram";
  id: string;
  title?: string;
  code: string;
};

export type PersonaSuggestion = {
  agentId: string;
  persona: string;
  role: string;
  area: string;
};

export type PersonaWidget = {
  kind: "persona";
  id: string;
  suggestions: PersonaSuggestion[];
};

export type SolutionStudioWidget = {
  kind: "solutionStudio";
  id: string;
  title: string;
  workflowHint: string;
  areaLabel: string;
  agent: PersonaSuggestion;
  invokePrompt: string;
};

/** US-8.5 — citações RAG agrupadas num único widget (máx. 3 fontes) */
export type CitationsWidget = {
  kind: "citations";
  id: string;
  citations: RagCitation[];
  /** pergunta que originou as citações */
  query?: string;
};

/* ---- widgets visuais ricos (brief layout, jul/2026) ---- */

export type MetricItem = {
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: "up" | "down";
};

/** KPI cards / infográfico — grade de métricas com número grande */
export type MetricsWidget = {
  kind: "metrics";
  id: string;
  title?: string;
  items: MetricItem[];
};

/** tabela responsiva — header navy, zebra sutil, acento laranja */
export type TableWidget = {
  kind: "table";
  id: string;
  title?: string;
  columns: string[];
  rows: string[][];
};

export type ChartDatum = { label: string; value: number };

/** gráfico SVG puro — barras, linha ou donut, paleta Foursys */
export type ChartWidget = {
  kind: "chart";
  id: string;
  title?: string;
  chartType: "bar" | "line" | "donut";
  data: ChartDatum[];
  /** sufixo dos valores (ex.: "%", "h") */
  unit?: string;
};

export type TimelineStep = {
  title: string;
  description?: string;
  period?: string;
  done?: boolean;
};

/** linha do tempo vertical — fases/cronograma com marcadores laranja */
export type TimelineWidget = {
  kind: "timeline";
  id: string;
  title?: string;
  steps: TimelineStep[];
};

/** ADR-015 — job do Local Agent Bridge (poll de status/logs) */
export type AgentJobWidget = {
  kind: "agentJob";
  id: string;
  jobId: string;
  status: string;
  prompt: string;
  logs?: string;
};

/** comparação A/B lado a lado (ex.: AS-IS × TO-BE) */
export type ComparisonWidget = {
  kind: "comparison";
  id: string;
  title?: string;
  leftLabel: string;
  rightLabel: string;
  rows: Array<{ aspect: string; left: string; right: string }>;
};

export type Widget =
  | CodeWidget
  | CommandWidget
  | ChecklistWidget
  | SourceWidget
  | NextStepsWidget
  | DiagramWidget
  | PersonaWidget
  | SolutionStudioWidget
  | CitationsWidget
  | MetricsWidget
  | TableWidget
  | ChartWidget
  | TimelineWidget
  | ComparisonWidget
  | AgentJobWidget;

export type WidgetExtractor = {
  id: string;
  priority: number;
  extract: (ctx: WidgetContext) => Widget[];
};
