import { suggestPersonas } from "@/lib/agents/registry";

import type { PersonaSuggestion, SolutionStudioWidget, WidgetContext, WidgetExtractor } from "./types";

type StudioRule = {
  pattern: RegExp;
  title: string;
  workflowHint: string;
  areaLabel: string;
  invokePrompt: (persona: string) => string;
};

const RULES: StudioRule[] = [
  {
    pattern: /\b(escopo|entendimento|discovery|vanguarda|briefing|as-is|to-be)\b/i,
    title: "Solution Center · Pré-vendas",
    workflowHint: "AI-DLC G1–G3 · Vanguarda de Escopo → Trigger Map",
    areaLabel: "Pré-vendas",
    invokePrompt: (p) => `Ative ${p} para estruturar o entendimento deste cliente`,
  },
  {
    pattern: /\b(proposta|comercial|precifica|or[cç]amento|rfp|prost|doublecheck)\b/i,
    title: "Solution Center · Proposta",
    workflowHint: "AI-DLC G1 + G5 · Prost / DoubleCheck",
    areaLabel: "Proposta",
    invokePrompt: (p) => `Peça ao ${p} para revisar ou montar a proposta`,
  },
  {
    pattern: /\b(ballpark|estimativa|esfor[cç]o|prazo|cronograma|sprint)\b/i,
    title: "Solution Center · Estimativa",
    workflowHint: "Ball / BallM / BallRPA · sizing técnico",
    areaLabel: "Pré-vendas",
    invokePrompt: (p) => `Use ${p} para estimar esforço e cronograma`,
  },
  {
    pattern: /\b(qa|teste|gherkin|bdd|playwright|e2e|mosaico)\b/i,
    title: "Solution Center · Qualidade",
    workflowHint: "AI-DLC G6 · GherkinFlow + massa de teste",
    areaLabel: "QA",
    invokePrompt: (p) => `Acione ${p} para cenários e estratégia de testes`,
  },
  {
    pattern: /\b(arquitetura|c4|adr|diagrama\s+t[eé]cnico|atlas)\b/i,
    title: "Solution Center · Arquitetura",
    workflowHint: "AI-DLC G4 · Armando / Architect C4L4",
    areaLabel: "Habilitadores",
    invokePrompt: (p) => `Consulte ${p} para desenhar a arquitetura`,
  },
  {
    pattern: /\b(ux|ui|wireframe|jornada|figma|design\s+system|bella)\b/i,
    title: "Solution Center · Design",
    workflowHint: "AI-DLC G3 · Bella / Marcelo · WDS",
    areaLabel: "Design",
    invokePrompt: (p) => `Peça ao ${p} para wireframes ou jornada UX`,
  },
  {
    pattern: /\b(bmad|ai-dlc|gate|workflow|mem0|tokenops|solution center)\b/i,
    title: "Solution Center · Metodologia",
    workflowHint: "Esteira AI-DLC Foursys · gates G0–G12",
    areaLabel: "Metodologia",
    invokePrompt: (p) => `Pergunte ao ${p} qual gate ou agente usar nesta etapa`,
  },
  {
    pattern: /\b(rag|conhecimento|documenta[cç][aã]o|portal\s*foursys|repo)\b/i,
    title: "Solution Center · Conhecimento",
    workflowHint: "Fase 2 · RAG multi-source + citações",
    areaLabel: "Knowledge",
    invokePrompt: (p) => `Use ${p} para indexar ou consultar a base de conhecimento`,
  },
];

function pickPrimaryAgent(
  transcript: string,
  assistantText: string,
): PersonaSuggestion | null {
  const suggestions = suggestPersonas(transcript, assistantText);
  return suggestions[0] ?? null;
}

export const solutionStudioExtractor: WidgetExtractor = {
  id: "solutionStudio",
  priority: 95,
  extract(ctx: WidgetContext): SolutionStudioWidget[] {
    const haystack = `${ctx.userTranscript}\n${ctx.assistantText}`;
    const agent = pickPrimaryAgent(ctx.userTranscript, ctx.assistantText);

    for (const rule of RULES) {
      if (!rule.pattern.test(haystack)) continue;

      const primary =
        agent ??
        ({
          agentId: "vanguarda",
          persona: "Vanguarda de Escopo",
          role: "Entendimento e escopo BMAD",
          area: "presales",
        } satisfies PersonaSuggestion);

      return [
        {
          kind: "solutionStudio",
          id: "studio-0",
          title: rule.title,
          workflowHint: rule.workflowHint,
          areaLabel: rule.areaLabel,
          agent: primary,
          invokePrompt: rule.invokePrompt(primary.persona),
        },
      ];
    }

    // Intent knowledge + citations → mostrar card de conhecimento Foursys
    if (ctx.intent === "knowledge" && ctx.citations?.length) {
      return [
        {
          kind: "solutionStudio",
          id: "studio-knowledge",
          title: "Base Foursys consultada",
          workflowHint: "PortalFoursys · Solution Center · AI-DLC",
          areaLabel: "Knowledge",
          agent: {
            agentId: "vanguarda",
            persona: "Vanguarda de Escopo",
            role: "Contexto curado Foursys",
            area: "presales",
          },
          invokePrompt: "Aprofundar com citações da base interna",
        },
      ];
    }

    return [];
  },
};
