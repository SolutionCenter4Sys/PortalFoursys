/**
 * Política de paths para ingest RAG (PortalFoursys).
 *
 * Default = **all**: uma fonte "Portal Foursys" indexa institucional + briefings.
 * Escopos opcionais (`config.pathScope`):
 *   all            — repo completo (default Portal)
 *   institutional  — sem briefings
 *   briefings      — só public/briefings/**
 *
 * Ruído "trajetória"=CV de CIO é tratado no **retrieval** (rerank), não cortando ingest.
 */

export type RagPathScope = "institutional" | "briefings" | "all";

export function parseRagPathScope(raw: unknown): RagPathScope {
  const s = String(raw ?? "all").trim().toLowerCase();
  if (s === "briefings" || s === "briefing") return "briefings";
  if (s === "institutional" || s === "core") return "institutional";
  return "all";
}

const NOISE_DIRS: RegExp[] = [
  /(?:^|\/)node_modules(?:\/|$)/i,
  /(?:^|\/)\.git(?:\/|$)/i,
  /(?:^|\/)dist(?:\/|$)/i,
  /(?:^|\/)build(?:\/|$)/i,
  /(?:^|\/)\.next(?:\/|$)/i,
  /(?:^|\/)coverage(?:\/|$)/i,
  /(?:^|\/)assets(?:\/|$)/i,
];

const BRIEFINGS_DIRS: RegExp[] = [
  /(?:^|\/)public\/briefings(?:\/|$)/i,
  /(?:^|\/)briefings(?:\/|$)/i,
];

const SKIP_FILE_PATTERNS: RegExp[] = [
  /(?:^|\/)(?:package-lock\.json|yarn\.lock|pnpm-lock\.yaml)$/i,
  /(?:^|\/)package\.json$/i,
];

/**
 * v2 lean — arquivos de CÓDIGO (.ts/.tsx/.js/.jsx) só entram no índice quando
 * carregam CONTEÚDO institucional: src/data/** (kpis, cases, services, clients,
 * faq…) e src/i18n/** (textos). Lógica de app (hooks/utils/context/components)
 * é ruído p/ Q&A de voz e inflava o índice. Desliga com RAG_LEAN_INDEX=false.
 */
const CODE_EXT = /\.(tsx?|jsx?)$/i;
// Dirs de CÓDIGO que carregam CONTEÚDO institucional (não são ruído de app):
//   src/data, src/i18n  → dados/textos estruturados
//   src/components/sections → seções do Portal com prosa HARDCODED (ex.: Nexus/IA,
//     RH & Talentos, Serviços, Delivery) que não vive em data/i18n. Escopo fechado
//     em "sections" p/ não puxar ui/navigation/context (ruído puro de app).
const CONTENT_CODE_DIRS = /(?:^|\/)src\/(?:data|i18n|components\/sections)\//i;

function isLowValueCodePath(path: string): boolean {
  if (process.env.RAG_LEAN_INDEX === "false") return false;
  const p = normalizeRepoPath(path);
  return CODE_EXT.test(p) && !CONTENT_CODE_DIRS.test(p);
}

export function normalizeRepoPath(path: string): string {
  return path.replace(/\\/g, "/").replace(/^\.\//, "");
}

export function isBriefingsPath(path: string): boolean {
  const p = normalizeRepoPath(path);
  return BRIEFINGS_DIRS.some((re) => re.test(p));
}

function isNoiseDir(path: string): boolean {
  const p = normalizeRepoPath(path);
  return NOISE_DIRS.some((re) => re.test(p));
}

/** true = não indexar neste escopo. */
export function shouldSkipRagPath(
  path: string,
  scope: RagPathScope = "all",
): boolean {
  const p = normalizeRepoPath(path);
  if (isNoiseDir(p)) return true;
  if (SKIP_FILE_PATTERNS.some((re) => re.test(p))) return true;
  if (isLowValueCodePath(p)) return true;

  if (scope === "briefings") return !isBriefingsPath(p);
  if (scope === "institutional") return isBriefingsPath(p);
  return false;
}

/**
 * Score de prioridade (maior = indexar primeiro / sobrevive a MAX_FILES).
 * Em `all`, src/data ainda vem antes dos briefings.
 */
export function ragFilePriority(
  path: string,
  scope: RagPathScope = "all",
): number {
  const p = normalizeRepoPath(path).toLowerCase();

  if (scope === "briefings") {
    if (/(?:^|\/)public\/briefings\//.test(p)) return 100;
    return 0;
  }

  // Pack lean Graphify (wiki institucional) — prioridade máxima p/ voz Portal
  if (/(?:^|\/)graphify-out\/wiki\//.test(p)) return 1100;
  if (/(?:^|\/)src\/data\/faq\.(ts|tsx|js|json)$/.test(p)) return 1050;
  if (/(?:^|\/)src\/data\/kpis\.(ts|tsx|js|json)$/.test(p)) return 1000;
  if (/(?:^|\/)src\/data\//.test(p)) return 900;
  if (/(?:^|\/)src\/i18n\//.test(p)) return 700;
  if (/(?:^|\/)readme[^/]*$/i.test(p)) return 600;
  if (/(?:^|\/)docs\//.test(p)) return 550;
  if (/(?:^|\/)src\/components\/sections\//.test(p)) return 400;
  if (/(?:^|\/)src\//.test(p)) return 300;
  if (/(?:^|\/)public\/ofertas\//.test(p)) return 200;
  if (isBriefingsPath(p)) return 80;
  if (/(?:^|\/)(?:vite\.config|tsconfig)/.test(p)) return 50;
  return 0;
}

/** Filtra + ordena por prioridade (desc). Opcional: corta em maxFiles. */
export function selectRagPaths<T extends { path: string }>(
  items: T[],
  opts?: { maxFiles?: number; scope?: RagPathScope },
): T[] {
  const scope = opts?.scope ?? "all";
  const filtered = items.filter((item) => !shouldSkipRagPath(item.path, scope));
  filtered.sort((a, b) => {
    const d = ragFilePriority(b.path, scope) - ragFilePriority(a.path, scope);
    if (d !== 0) return d;
    return a.path.localeCompare(b.path);
  });
  const max = opts?.maxFiles;
  return typeof max === "number" && max > 0 ? filtered.slice(0, max) : filtered;
}

/** Query sobre trajetória/história da empresa (não CV de briefing). */
export function isCompanyTimelineQuery(query: string): boolean {
  if (/\b(briefing|cio|executivo|linkedin)\b/i.test(query)) return false;
  return /\b(trajet[oó]ria|hist[oó]ria|linha\s+do\s+tempo|timeline|marcos|milestones|funda[cç][aã]o|fundad[ao]|nasceu|origem|cronologia|anos\s+de\s+(mercado|hist[oó]ria))\b/i.test(
    query,
  );
}

/** Ajuste de score pós-pgvector: favorece kpis/src/data, rebaixa briefings. */
export function timelinePathBoost(path: string): number {
  const p = normalizeRepoPath(path);
  if (/src\/data\/kpis\.(ts|tsx|js|json)$/i.test(p)) return 0.4;
  if (/src\/data\//i.test(p)) return 0.18;
  if (/src\/i18n\/.*\/pt\.(ts|tsx)$/i.test(p)) return 0.12;
  if (/SectionTimeline/i.test(p)) return 0.2;
  if (isBriefingsPath(p)) return -0.45;
  return 0;
}
