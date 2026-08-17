/**
 * TokenOps PLUS — preditivo leve (Fase B).
 * Heurística a partir de memórias + bloco de tarefas + transcript recente.
 * Sem mem0 cloud / sem LLM extra neste slice.
 */

export type PredictiveInput = {
  memories?: string[];
  tasksBlock?: string;
  transcript?: string;
  historyHints?: string[];
};

const MAX_SUGGESTIONS = 3;

/** Extrai itens pendentes do bloco de tarefas do prompt. */
function pendingFromTasksBlock(block?: string): string[] {
  if (!block) return [];
  const out: string[] = [];
  for (const line of block.split("\n")) {
    const m =
      /^\s*[-*]\s*\[\s*\]\s*(.+)$/i.exec(line) ||
      /^\s*[-*]\s+(?!\[x\])(.+)$/i.exec(line) ||
      /^\s*\d+\.\s+(.+)$/.exec(line);
    if (m) {
      const item = m[1].replace(/\s*\(done\)\s*/i, "").trim();
      if (item && !/^(TAREFAS|Lista|AÇÃO)/i.test(item)) out.push(item);
    }
  }
  return out.slice(0, 5);
}

function memoryHints(memories: string[]): string[] {
  const out: string[] = [];
  for (const m of memories.slice(0, 8)) {
    const lower = m.toLowerCase();
    if (/prefer|gosta|idioma|timezone|nome/.test(lower)) {
      out.push(`Confirmar preferência: ${m.slice(0, 80)}`);
    } else if (/reuni[aã]o|prazo|deadline|entrega/.test(lower)) {
      out.push(`Retomar: ${m.slice(0, 80)}`);
    } else if (/projeto|cliente|ebv|foursys/.test(lower)) {
      out.push(`Perguntar status de: ${m.slice(0, 80)}`);
    }
  }
  return out;
}

function transcriptHints(transcript?: string): string[] {
  if (!transcript) return [];
  const t = transcript.toLowerCase();
  if (/tarefa|checklist|lista/.test(t)) {
    return ["Mostrar minhas tarefas pendentes", "Adicionar item na lista de hoje"];
  }
  if (/foursys|portal|cliente|case/.test(t)) {
    return ["Ver casos de sucesso relacionados", "Quais ofertas Foursys cobrem isso?"];
  }
  if (/c[oó]digo|cursor|agent|arquivo/.test(t)) {
    return ["Ver logs do Agent Bridge", "Rodar em modo read no workspace"];
  }
  if (/tokenops|wiki|obsidian|rag/.test(t)) {
    return ["Explicar TokenOps PLUS", "Como reindexar a wiki"];
  }
  return [];
}

/**
 * 1–3 sugestões de próximo passo para prompt + widget nextSteps.
 */
export function buildPredictiveSuggestions(input: PredictiveInput): string[] {
  const pending = pendingFromTasksBlock(input.tasksBlock).map(
    (item) => `Avançar tarefa: ${item.slice(0, 72)}`,
  );
  const mem = memoryHints(input.memories ?? []);
  const tr = transcriptHints(input.transcript);
  const hist = (input.historyHints ?? []).slice(0, 2);

  const merged = [...pending, ...mem, ...tr, ...hist];
  const unique = Array.from(new Set(merged.map((s) => s.trim()).filter(Boolean)));
  return unique.slice(0, MAX_SUGGESTIONS);
}

/** Bloco curto para system prompt (orçamento de tokens). */
export function formatPredictiveBlock(suggestions: string[]): string {
  if (suggestions.length === 0) return "";
  const lines = suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n");
  return `SUGESTÕES DE PRÓXIMO PASSO (preditivo — use no máximo 1 se couber na resposta; não force):\n${lines}`;
}
