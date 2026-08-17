import { allExtractors } from "./extractors";
import type { Widget, WidgetContext } from "./types";
import type { JarvisIntent } from "@/lib/jarvis-context";

// ordena uma única vez no load do módulo — a prioridade é estática
const sortedExtractors = [...allExtractors].sort(
  (a, b) => b.priority - a.priority,
);

export function resolveWidgets(ctx: WidgetContext): Widget[] {
  const out: Widget[] = [];
  for (const ex of sortedExtractors) {
    try {
      out.push(...ex.extract(ctx));
    } catch {
      // extractor errors should never break the UI
    }
  }
  return out;
}

/**
 * Reextrai widgets a partir do transcript persistido (refresh / troca de sessão).
 * Usa a última resposta do assistente que gerar widgets — sem tabela nova.
 */
export function rehydrateWidgetsFromMessages(
  messages: { role: string; content: string }[],
): Widget[] {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "assistant" || !m.content?.trim()) continue;
    const prev = messages[i - 1];
    const widgets = resolveWidgets({
      userTranscript: prev?.role === "user" ? prev.content : "",
      assistantText: m.content,
      citations: [],
      intent: "knowledge" as JarvisIntent,
    });
    if (widgets.length > 0) return widgets;
  }
  return [];
}

/** Anexa widget Agent Bridge (ADR-015) ao resultado do extractor. */
export function withAgentJobWidget(
  widgets: Widget[],
  agentJob?: { id: string; status: string; prompt?: string } | null,
): Widget[] {
  if (!agentJob?.id) return widgets;
  return [
    {
      kind: "agentJob",
      id: `agent-job-${agentJob.id}`,
      jobId: agentJob.id,
      status: agentJob.status,
      prompt: agentJob.prompt ?? "",
    },
    ...widgets,
  ];
}
