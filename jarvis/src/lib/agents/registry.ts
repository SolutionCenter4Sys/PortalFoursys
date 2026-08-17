import type { PersonaSuggestion } from "@/lib/widgets/types";

type Rule = {
  pattern: RegExp;
  personas: PersonaSuggestion[];
};

const P = (
  agentId: string,
  persona: string,
  role: string,
  area: string,
): PersonaSuggestion => ({ agentId, persona, role, area });

const RULES: Rule[] = [
  {
    pattern:
      /\b(proposta|comercial|precifica|or[cç]amento|licita[cç][aã]o|rfp|rfi)\b/i,
    personas: [
      P("prost", "Prost", "Propostas técnico-comerciais", "proposal"),
      P("orfeu", "Orfeu", "Gerador de ofertas", "presales"),
      P("doublecheck", "DoubleCheck", "Revisão crítica de propostas", "proposal"),
    ],
  },
  {
    pattern: /\b(escopo|entendimento|discovery|kickoff|vanguarda|briefing)\b/i,
    personas: [
      P("vanguarda", "Vanguarda de Escopo", "BMAD pré-vendas entendimento", "presales"),
      P("guardiao", "Guardião do Escopo", "Arquiteto de soluções", "presales"),
    ],
  },
  {
    pattern:
      /\b(arquitetura|c4|c4l\d?|componente|diagrama\s+t[eé]cnico|design\s+t[eé]cnico)\b/i,
    personas: [
      P("armando", "Armando", "Arquitetura C4 L1–L4", "habilitadores"),
      P("architect-c4l4", "Architect C4L4", "Arquitetura C4 L4 HTML", "habilitadores"),
    ],
  },
  {
    pattern:
      /\b(estimativa|ballpark|esfor[cç]o|prazo|cronograma|sprint|planejamento)\b/i,
    personas: [
      P("ball", "Ball", "Ballpark estimativas", "presales"),
      P("ballm", "BallM", "Ballpark modernização", "presales"),
      P("ballrpa", "BallRPA", "Ballpark RPA", "presales"),
    ],
  },
  {
    pattern:
      /\b(ux|ui|prot[oó]tipo|wireframe|jornada|figma|design\s+system|acessibilidade|a11y)\b/i,
    personas: [
      P("bella", "Bella", "UI/UX, wireframes, jornadas", "upstream"),
      P("design-system", "Designer System", "Design System v4, A11y", "habilitadores"),
      P("marcelo", "Marcelo", "Visual designer", "presales"),
    ],
  },
  {
    pattern: /\b(qa|teste|test\s|gherkin|bdd|cucumber|playwright|e2e)\b/i,
    personas: [
      P("qa-master", "QA Master", "Estratégia QA sênior", "qa"),
      P("gherkinflow", "GherkinFlow", "Cenários BDD 360°", "qa"),
      P("playwright", "Playwright Agent", "E2E Playwright", "qa"),
    ],
  },
  {
    pattern: /\b(benchmark|concorr[eê]ncia|desk\s+research|inteligenc\wa|market)\b/i,
    personas: [
      P("scout", "Scout", "Benchmarking desk research", "presales"),
      P("omni", "Omni", "Benchmarking 360°", "presales"),
      P("hunter", "Hunter", "Inteligência comercial", "presales"),
    ],
  },
  {
    pattern:
      /\b(devops|ci\/cd|pipeline|observabilidade|finops|infraestrutura|kubernetes|docker)\b/i,
    personas: [P("devops", "DevOps Master", "CI/CD e observabilidade", "habilitadores")],
  },
  {
    pattern: /\b(seguran[cç]a|security|owasp|vulnerabilidade|compliance|lgpd)\b/i,
    personas: [
      P("security", "Security Guardian", "Cyber security e dev seguro", "habilitadores"),
    ],
  },
  {
    pattern: /\b(story|user\s+story|backend|api\s+rest|micro[- ]?servi)\b/i,
    personas: [P("writer-back", "Escritor Back", "Stories backend + APIs", "upstream")],
  },
  {
    pattern: /\b(frontend|react|angular|next\.?js|flutter|mobile|android|ios)\b/i,
    personas: [
      P("writer-front", "Escritor Front", "Stories frontend", "upstream"),
      P("sofia", "Sofia", "React/Next.js", "downstream"),
    ],
  },
  {
    pattern: /\b(rpa|automa[cç][aã]o\s+de\s+processo|uipath|power\s+automate)\b/i,
    personas: [P("ballrpa", "BallRPA", "Ballpark RPA", "presales")],
  },
  {
    pattern: /\b(banco|banking|banc[aá]rio|financeiro|fintech|open\s+finance)\b/i,
    personas: [
      P("regis", "Régis", "Regulação bancária", "presales"),
      P("fiscal", "Fiscal", "Contabilidade BR/IFRS", "presales"),
    ],
  },
];

export function suggestPersonas(
  transcript: string,
  assistantText: string,
): PersonaSuggestion[] {
  const haystack = `${transcript}\n${assistantText}`;
  const found: PersonaSuggestion[] = [];
  const seen = new Set<string>();

  for (const rule of RULES) {
    if (!rule.pattern.test(haystack)) continue;
    for (const p of rule.personas) {
      if (seen.has(p.agentId)) continue;
      seen.add(p.agentId);
      found.push(p);
      if (found.length >= 3) return found;
    }
  }
  return found;
}
