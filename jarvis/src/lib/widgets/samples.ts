import type { Widget } from "./types";

/**
 * Dados de preview dos widgets visuais — usados apenas com
 * `/app?widgetPreview=1` para validar o visual sem inferência.
 * Carregado sob demanda (dynamic import) — fora do bundle principal.
 */
export const sampleWidgets: Widget[] = [
  {
    kind: "metrics",
    id: "sample-metrics",
    title: "Case Santander · resultados",
    items: [
      { label: "ROI", value: "32%", delta: "+8pp", deltaDirection: "up" },
      { label: "Prazo", value: "6 meses", delta: "-2 meses", deltaDirection: "down" },
      { label: "Squad", value: "4 devs" },
      { label: "NPS", value: "87", delta: "+12", deltaDirection: "up" },
    ],
  },
  {
    kind: "chart",
    id: "sample-chart-bar",
    title: "Horas por fase",
    chartType: "bar",
    unit: "h",
    data: [
      { label: "Discovery", value: 120 },
      { label: "Build", value: 340 },
      { label: "QA", value: 90 },
      { label: "Rollout", value: 60 },
    ],
  },
  {
    kind: "chart",
    id: "sample-chart-donut",
    title: "Alocação do squad",
    chartType: "donut",
    unit: "%",
    data: [
      { label: "Backend", value: 40 },
      { label: "Frontend", value: 30 },
      { label: "Dados", value: 20 },
      { label: "QA", value: 10 },
    ],
  },
  {
    kind: "chart",
    id: "sample-chart-line",
    title: "Velocidade do time (sprints)",
    chartType: "line",
    unit: "pts",
    data: [
      { label: "S1", value: 21 },
      { label: "S2", value: 28 },
      { label: "S3", value: 26 },
      { label: "S4", value: 35 },
      { label: "S5", value: 42 },
    ],
  },
  {
    kind: "table",
    id: "sample-table",
    title: "Stack por camada",
    columns: ["Camada", "Tecnologia", "Status"],
    rows: [
      ["Frontend", "Next.js 16 + Tailwind v4", "Ativo"],
      ["Voz", "Whisper → Llama → Piper", "Ativo"],
      ["RAG", "pgvector + Supabase", "Fase 2"],
      ["Cache", "Redis semântico", "Piloto"],
    ],
  },
  {
    kind: "timeline",
    id: "sample-timeline",
    title: "Roadmap Jarvis",
    steps: [
      {
        title: "G7 · Web app voz",
        period: "jun/2026",
        description: "Wake word, VAD, RAG piloto",
        done: true,
      },
      {
        title: "Rebrand Foursys",
        period: "jul/2026",
        description: "Design system navy/laranja/mint",
        done: true,
      },
      {
        title: "RAG pgvector",
        period: "ago/2026",
        description: "Citações multi-source + memória",
      },
      {
        title: "Agent Hub",
        period: "Fase 3",
        description: "Orquestração de agentes Foursys",
      },
    ],
  },
  {
    kind: "comparison",
    id: "sample-comparison",
    title: "Atendimento AS-IS × TO-BE",
    leftLabel: "AS-IS",
    rightLabel: "TO-BE",
    rows: [
      { aspect: "Canal", left: "Formulário + fila", right: "Voz em tempo real" },
      { aspect: "Tempo de resposta", left: "~2 dias", right: "< 5 segundos" },
      { aspect: "Fontes", left: "Conhecimento tácito", right: "RAG com citações" },
      { aspect: "Custo por consulta", left: "Alto (manual)", right: "Marginal" },
    ],
  },
  {
    kind: "citations",
    id: "sample-citations",
    citations: [
      {
        sourceName: "Portal Foursys",
        path: "docs/cases/santander.md",
        url: "https://github.com/foursys/portal/blob/main/docs/cases/santander.md",
        excerpt:
          "Solução integrada à estrutura e centros de competência da Foursys, com impacto em velocidade, qualidade e inovação.",
      },
      {
        sourceName: "Jarvis ADRs",
        path: "adrs/007-rag-pgvector.md",
        excerpt: "Decisão: adotar pgvector no Supabase para busca semântica.",
      },
      {
        sourceName: "Site Foursys",
        path: "foursys.com.br/cases",
        url: "https://www.foursys.com.br/cases",
        excerpt: "Cases de sucesso em diferentes setores e ecossistemas corporativos.",
      },
    ],
    query: "Me fale sobre os cases de sucesso da Foursys",
  },
  {
    kind: "diagram",
    id: "sample-diagram",
    title: "Dataforg · integração QA",
    code: `graph LR
  A[Dataforg] -->|Geração de Dados| B[Testes Automatizados]
  A -->|Análise de Dados| C[Dados Validados]
  B -->|Cenários de Teste| D[Testes Cenários]
  C -->|Resolução de Problemas| E[Problemas Resolvidos]
  D -->|Testes Executados| F[Resultados Testes]
  E -->|Melhoria da Qualidade| G[Melhoria da Qualidade]`,
  },
  {
    kind: "diagram",
    id: "sample-mindmap",
    title: "Mapa mental",
    code: `mindmap
  root((Oferta Foursys))
    Engenharia
      Modernização
      Cloud
      DevOps
    Qualidade
      QA com IA
      DataForge
      GherkinFlow
    Dados
      Analytics
      Governança
    Design
      Produto
      UX`,
  },
  {
    kind: "persona",
    id: "sample-persona",
    suggestions: [
      {
        agentId: "prost",
        persona: "Prost",
        role: "Especialista em pré-vendas e cases",
        area: "Solution Center",
      },
      {
        agentId: "vanguarda",
        persona: "Vanguarda de Escopo",
        role: "Entendimento e escopo BMAD",
        area: "Pré-vendas",
      },
    ],
  },
];
