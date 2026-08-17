/**
 * Fallback LLM para intents de tarefa quando a heurística regex falha.
 * Opt-out: TASKS_LLM_EXTRACT=false
 */
import { chatCompletionGemini } from "@/lib/inference/gemini-provider";
import { chatCompletionOpenAI } from "@/lib/inference/openai-provider";
import { chatCompletion } from "@/lib/inference/ollama";
import {
  getLlmSettings,
  isGemini,
  isOpenAi,
} from "@/lib/llm/settings";

const CONTENT_MAX = 180;
const TITLE_MAX = 80;

export type LlmTaskIntent =
  | { type: "create_list"; title: string }
  | { type: "add_item"; content: string; listTitle?: string }
  | { type: "complete_item"; content: string; listTitle?: string; sole?: boolean }
  | { type: "delete_item"; content: string; listTitle?: string; sole?: boolean }
  | {
      type: "edit_item";
      content: string;
      newContent: string;
      listTitle?: string;
    }
  | { type: "archive"; listTitle: string };

const SYSTEM = `És um extrator de intenções de checklist/tarefas pessoais em pt-BR.
Responde APENAS JSON válido (sem markdown) no formato:
{"intents":[...]}

Cada intent é um destes:
{"type":"add_item","content":"texto do item","listTitle":"Hoje"}
{"type":"create_list","title":"nome da lista"}
{"type":"complete_item","content":"texto aproximado do item","listTitle":"Hoje"}
{"type":"delete_item","content":"texto aproximado do item","listTitle":"Hoje"}
{"type":"edit_item","content":"texto atual aproximado","newContent":"texto novo","listTitle":"Hoje"}
{"type":"archive","listTitle":"nome"}

Regras:
- "Crie/Cria/Criar uma tarefa para mim para X" / "minha tarefa é X" → add_item com content=X na lista "Hoje" (não inventes lista nova).
- "cria a lista Compras e adiciona leite" → create_list + add_item.
- "marca X como feito" → complete_item.
- "apaga/exclui/remove a tarefa X" → delete_item.
- "edita/muda/altera a tarefa X para Y" → edit_item (content=X, newContent=Y).
- NÃO uses delete_item/edit_item para notas ("apaga a nota…") — devolve {"intents":[]}.
- content ≤ ${CONTENT_MAX} chars; title ≤ ${TITLE_MAX}.
- Se a frase NÃO for sobre criar/adicionar/concluir/apagar/editar/arquivar tarefas, devolve {"intents":[]}.
- Não inventes itens que o utilizador não pediu.`;

function parseIntentsJson(raw: string): LlmTaskIntent[] {
  const trimmed = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed.slice(start, end + 1));
  } catch {
    return [];
  }
  const intents = (parsed as { intents?: unknown })?.intents;
  if (!Array.isArray(intents)) return [];

  const out: LlmTaskIntent[] = [];
  for (const rawIntent of intents) {
    if (!rawIntent || typeof rawIntent !== "object") continue;
    const i = rawIntent as Record<string, unknown>;
    const type = String(i.type || "");
    if (type === "create_list") {
      const title = String(i.title || "").trim().slice(0, TITLE_MAX);
      if (title.length >= 1) out.push({ type: "create_list", title });
    } else if (type === "add_item") {
      const content = String(i.content || "").trim().slice(0, CONTENT_MAX);
      const listTitle = i.listTitle
        ? String(i.listTitle).trim().slice(0, TITLE_MAX)
        : undefined;
      if (content.length >= 2) out.push({ type: "add_item", content, listTitle });
    } else if (type === "complete_item") {
      const content = String(i.content || "tarefa")
        .trim()
        .slice(0, CONTENT_MAX);
      const listTitle = i.listTitle
        ? String(i.listTitle).trim().slice(0, TITLE_MAX)
        : undefined;
      const sole = i.sole === true || content.length < 3;
      out.push({ type: "complete_item", content, listTitle, sole });
    } else if (type === "delete_item") {
      const content = String(i.content || "tarefa")
        .trim()
        .slice(0, CONTENT_MAX);
      const listTitle = i.listTitle
        ? String(i.listTitle).trim().slice(0, TITLE_MAX)
        : undefined;
      const sole = i.sole === true || content.length < 3;
      out.push({ type: "delete_item", content, listTitle, sole });
    } else if (type === "edit_item") {
      const content = String(i.content || "").trim().slice(0, CONTENT_MAX);
      const newContent = String(i.newContent || "")
        .trim()
        .slice(0, CONTENT_MAX);
      const listTitle = i.listTitle
        ? String(i.listTitle).trim().slice(0, TITLE_MAX)
        : undefined;
      if (content.length >= 2 && newContent.length >= 2) {
        out.push({ type: "edit_item", content, newContent, listTitle });
      }
    } else if (type === "archive") {
      const listTitle = String(i.listTitle || "").trim().slice(0, TITLE_MAX);
      if (listTitle) out.push({ type: "archive", listTitle });
    }
  }
  return out;
}

/** Sinal fraco: parece pedido de tarefa mesmo se regex falhou. */
export function softTaskSignal(transcript: string): boolean {
  const t = transcript.normalize("NFC");
  if (/\b(?:tarefa|tarefas|checklist|to[\s-]?do)\b/iu.test(t)) return true;
  if (/\b(?:cria(?:r)?|crie)\s+(?:(?:uma|a)\s+)?lista\b/iu.test(t)) return true;
  if (
    /\b(?:marca(?:r)?|marque|conclu[ií]|finaliza)\b.{0,40}\b(?:feito|feita|conclu[ií]d[oa]|pronta)\b/iu.test(
      t,
    )
  ) {
    return true;
  }
  if (/\badiciona(?:r)?\b.{0,40}\b(?:na|lista|tarefa|item)\b/iu.test(t)) {
    return true;
  }
  if (
    /\b(?:apaga(?:r)?|exclui(?:r)?|remove(?:r)?)\b.{0,40}\b(?:tarefa|item|lista)\b/iu.test(
      t,
    )
  ) {
    return true;
  }
  if (
    /\b(?:edita(?:r)?|altera(?:r)?|muda(?:r)?)\b.{0,40}\b(?:tarefa|item)\b/iu.test(
      t,
    )
  ) {
    return true;
  }
  return false;
}

export async function extractTaskIntentsWithLlm(
  transcript: string,
  opts?: { pendingPreview?: string },
): Promise<LlmTaskIntent[]> {
  if (process.env.TASKS_LLM_EXTRACT === "false") return [];
  const text = transcript.trim();
  if (!text || !softTaskSignal(text)) return [];

  const pending = opts?.pendingPreview?.trim()
    ? `\nItens atuais (p/ complete/delete/edit):\n${opts.pendingPreview.trim()}`
    : "";
  const userMsg = `Pedido do utilizador:\n"""${text.slice(0, 500)}"""${pending}`;

  try {
    const llm = await getLlmSettings();
    let raw = "";
    if (isGemini(llm)) {
      const r = await chatCompletionGemini(userMsg, {
        systemPrompt: SYSTEM,
        model: llm.gemini.model,
        maxTokens: 256,
        temperature: 0,
        thinkingBudget: 0,
      });
      raw = r.text;
    } else if (isOpenAi(llm)) {
      const r = await chatCompletionOpenAI(userMsg, {
        systemPrompt: SYSTEM,
        model: llm.openai.model,
        maxTokens: 256,
        temperature: 0,
      });
      raw = r.text;
    } else {
      raw = await chatCompletion(userMsg, {
        systemPrompt: SYSTEM,
      });
    }
    const intents = parseIntentsJson(raw);
    if (intents.length > 0) {
      console.info("[tasks] llm-extract", {
        transcript: text.slice(0, 120),
        intents,
      });
    }
    return intents;
  } catch (err) {
    console.warn(
      "[tasks] llm-extract failed",
      err instanceof Error ? err.message : err,
    );
    return [];
  }
}
