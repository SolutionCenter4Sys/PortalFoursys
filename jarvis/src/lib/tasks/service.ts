import {
  createAdminClient,
  isAdminClientAvailable,
} from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * Tarefas pessoais (ADR-016) — listas + checklist.
 * Extração: heurística rápida + fallback LLM (interpreta fala natural).
 * Opt-out gravação: prefs.tasksEnabled · Opt-out LLM: TASKS_LLM_EXTRACT=false
 * Writes preferem service_role (mesmo padrão RAG) — userId sempre vem do auth.
 */

export const TASK_CONTENT_MAX = 180;
export const TASK_TITLE_MAX = 80;
const TODAY_TITLE = "Hoje";

async function db() {
  if (isAdminClientAvailable()) return createAdminClient();
  return createClient();
}

export type TaskListStatus = "open" | "archived";

export type TaskItem = {
  id: string;
  list_id: string;
  content: string;
  done: boolean;
  position: number;
  created_at: string;
  updated_at?: string;
};

export type TaskList = {
  id: string;
  title: string;
  status: TaskListStatus;
  created_at: string;
  updated_at: string;
  items: TaskItem[];
};

export type TasksChanged = {
  listId: string;
  listTitle: string;
  action: "created" | "added" | "completed" | "archived" | "deleted" | "edited";
  items: Array<{ id: string; content: string; done: boolean }>;
  /** conteúdo anterior (só em edited) */
  previousContent?: string;
};

type TaskIntent =
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

const COMPLETE_STOP = new Set([
  "a",
  "o",
  "as",
  "os",
  "de",
  "da",
  "do",
  "das",
  "dos",
  "na",
  "no",
  "em",
  "uma",
  "um",
  "como",
  "feito",
  "feita",
  "feitos",
  "feitas",
  "concluido",
  "concluida",
  "concluidos",
  "concluidas",
  "pronta",
  "pronto",
  "tarefa",
  "tarefas",
  "item",
  "lista",
  "marcar",
  "marca",
  "marque",
  "concluir",
  "conclui",
  "por",
  "favor",
  "pode",
  "jarvis",
  "essa",
  "esse",
  "aquela",
  "aquele",
  "minha",
  "meu",
]);

function fold(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function contentTokens(s: string): string[] {
  return fold(s)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length >= 2 && !COMPLETE_STOP.has(t));
}

function isVagueCompleteRef(content: string): boolean {
  const t = fold(tidyItemContent(content));
  if (!t || t.length < 2) return true;
  return /^(a\s+)?(tarefa|item|lista|ela|ele|essa|esse|aquela|aquele|isso)$/u.test(
    t,
  );
}

function clean(s: string): string {
  return s.replace(/\s+/g, " ").trim().replace(/[.,;:]+$/u, "");
}

function normalizeTitle(s: string): string {
  return clean(s).replace(/^["'«»]+|["'«»]+$/g, "").slice(0, TASK_TITLE_MAX);
}

function titlesMatch(a: string, b: string): boolean {
  const x = a.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  const y = b.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  return x === y || x.includes(y) || y.includes(x);
}

/** Imperativo formal (crie) + informal (cria) + infinitivo (criar) — STT varia. */
const CRIA = String.raw`(?:cria(?:r)?|crie)`;

/** Gatilho forte — evita misturar com notas ("anota que…"). */
export function looksLikeTaskIntent(transcript: string): boolean {
  const n = transcript.normalize("NFC");
  // fala natural: "minha tarefa é…", "tenho uma tarefa…", "tarefa: …"
  if (
    /\b(?:minha\s+(?:pr[oó]xima\s+)?tarefa|tenho\s+(?:uma\s+)?tarefa|a\s+tarefa\s+[eé]|tarefa\s*[:\-])/iu.test(
      n,
    )
  ) {
    return true;
  }
  // concluir / marcar feito (ordem livre)
  if (
    /\b(?:marca(?:r)?|marque|conclu[ií](?:r|da|do)?|finaliza(?:r)?|completei|terminei)\b/iu.test(
      n,
    ) &&
    /\b(?:feito|feita|conclu[ií]d[oa]|pronta|pronto|tarefa|item|lista|rfi|telepronto)\b/iu.test(
      n,
    )
  ) {
    return true;
  }
  // apagar / editar item
  if (
    /\b(?:apaga(?:r)?|exclui(?:r)?|remove(?:r)?|deleta(?:r)?)\b/iu.test(n) &&
    /\b(?:tarefa|item|lista)\b/iu.test(n)
  ) {
    return true;
  }
  if (
    /\b(?:edita(?:r)?|edite|altera(?:r)?|muda(?:r)?|renome(?:ar|ia|ie))\b/iu.test(
      n,
    ) &&
    /\b(?:tarefa|item)\b/iu.test(n)
  ) {
    return true;
  }
  return new RegExp(
    String.raw`\b(?:${CRIA}\s+(?:(?:uma|a)\s+)?(?:tarefa|lista)|nova\s+lista|adiciona(?:r)?\s+.+\s+(?:na|na\s+tarefa|na\s+lista|em)|(?:na|na\s+tarefa|na\s+lista)\s+.+\s+(?:adiciona|coloca|p[oõ]e)|adiciona(?:r)?\s+(?:um\s+)?item|coloca(?:r)?\s+.+\s+na\s+(?:tarefa|lista)|arquiva(?:r)?\s+(?:a\s+)?(?:lista|tarefa)|quais?\s+(?:s[aã]o\s+)?minhas?\s+tarefas|mostra(?:r)?\s+(?:a\s+)?(?:checklist|tarefas))\b`,
    "iu",
  ).test(n);
}

/** Limpa repetição tipo "responder RFI, RFI da Telepronto". */
function tidyItemContent(raw: string): string {
  let s = clean(raw)
    .normalize("NFC")
    .replace(/^(?:que\s+|de\s+|da\s+|do\s+|pra\s+|para\s+|a\s+|o\s+)/iu, "")
    .replace(/^(?:mim\s+|me\s+|eu\s+)/iu, "")
    .replace(/^(?:para\s+)?(?:eu\s+|me\s+|mim\s+)/iu, "")
    .replace(/^(?:tarefa\s+(?:da\s+|de\s+)?|item\s+)/iu, "")
    .slice(0, TASK_CONTENT_MAX);
  // "responder RFI, RFI da Telepronto" → "responder RFI da Telepronto"
  const dup = /^(.+?)\b([\p{L}\d]{2,}),\s*\2\b(.*)$/iu.exec(s);
  if (dup) s = clean(`${dup[1]}${dup[2]}${dup[3]}`);
  return s.slice(0, TASK_CONTENT_MAX);
}

/**
 * Extrai intents de tarefa do transcript (0..N).
 * Suporta “cria X e adiciona Y” e fala natural (“minha tarefa é…”).
 */
export function extractTaskIntents(transcript: string): TaskIntent[] {
  const t = clean(transcript.normalize("NFC"));
  if (!t) return [];
  const out: TaskIntent[] = [];

  // create + add: "cria a tarefa Compras e adiciona leite"
  const createAndAdd = new RegExp(
    String.raw`\b${CRIA}\s+(?:(?:uma|a)\s+)?(?:tarefa|lista)\s+(?:chamada\s+|de\s+|para\s+(?:mim\s+)?)?(?:["']([^"']+)["']|([^,.]+?))?\s*(?:,?\s*e\s+)?adiciona(?:r)?\s+(.+)$`,
    "iu",
  ).exec(t);
  if (createAndAdd) {
    const title = normalizeTitle(
      createAndAdd[1] ?? createAndAdd[2] ?? TODAY_TITLE,
    );
    const content = tidyItemContent(createAndAdd[3] ?? "");
    if (title) out.push({ type: "create_list", title });
    if (content.length >= 2) {
      out.push({ type: "add_item", content, listTitle: title || undefined });
    }
    return out;
  }

  // Declarativa: "Minha tarefa é responder RFI da Telepronto"
  // "tenho uma tarefa: …" / "a tarefa é …" / "tarefa: …"
  const declarative =
    /\b(?:minha\s+(?:pr[oó]xima\s+)?tarefa\s+[eé]|tenho\s+(?:uma\s+)?tarefa(?:\s+(?:de|pra|para))?|a\s+tarefa\s+[eé]|tarefa\s*[:\-]|preciso\s+(?:fazer\s+)?(?:a\s+)?tarefa\s+(?:de|pra|para)|registra(?:r)?\s+(?:a\s+)?tarefa|anota(?:r)?\s+(?:a\s+)?tarefa)\s*[:\s,]*(.+)$/iu.exec(
      t,
    );
  if (declarative) {
    const content = tidyItemContent(declarative[1] ?? "");
    if (content.length >= 2) {
      out.push({ type: "add_item", content, listTitle: TODAY_TITLE });
      return out;
    }
  }

  // "Crie uma tarefa para mim para eu ir ao mercado"
  // "cria uma tarefa de responder RFI" / "cria tarefa para mim responder X"
  const createOfAction =
    new RegExp(
      String.raw`\b${CRIA}\s+(?:(?:uma|a)\s+)?tarefa\s+para\s+mim\s+(?:para\s+)?(?:eu\s+)?(.+)$`,
      "iu",
    ).exec(t) ??
    new RegExp(
      String.raw`\b${CRIA}\s+(?:(?:uma|a)\s+)?tarefa\s+(?:de|para|pra)\s+(?:eu\s+)?(.+)$`,
      "iu",
    ).exec(t);
  if (createOfAction && !/\badiciona/i.test(t)) {
    const content = tidyItemContent(createOfAction[1] ?? "");
    if (content.length >= 2) {
      out.push({ type: "add_item", content, listTitle: TODAY_TITLE });
      return out;
    }
  }

  // "cria uma tarefa para mim" / "cria tarefa Compras" / "crie a tarefa: comprar pão"
  const create = new RegExp(
    String.raw`\b(?:${CRIA}\s+(?:(?:uma|a)\s+)?(?:tarefa|lista)|nova\s+lista)(?:\s+para\s+mim)?(?:\s+(?:chamada|de|com\s+nome))?\s*[:\s,]*(?:["']([^"']+)["']|(.+))?$`,
    "iu",
  ).exec(t);
  if (create && !/\badiciona/i.test(t)) {
    let title = normalizeTitle(create[1] ?? create[2] ?? "");
    if (!title || /^(para\s+mim|pra\s+mim|hoje)$/i.test(title)) {
      title = TODAY_TITLE;
    }
    // se sobrou "e adiciona …" no título
    const splitAdd = /\s+e\s+adiciona(?:r)?\s+(.+)$/iu.exec(title);
    if (splitAdd) {
      title = normalizeTitle(title.replace(/\s+e\s+adiciona(?:r)?\s+.+$/iu, ""));
      out.push({ type: "create_list", title: title || TODAY_TITLE });
      out.push({
        type: "add_item",
        content: tidyItemContent(splitAdd[1]),
        listTitle: title || TODAY_TITLE,
      });
      return out;
    }
    // Título longo com verbo de ação → tratar como item, não nome de lista
    if (
      title !== TODAY_TITLE &&
      /\b(?:responder|fazer|enviar|revisar|preparar|escrever|ligar|chamar|ir|comprar|buscar)\b/iu.test(
        title,
      )
    ) {
      out.push({
        type: "add_item",
        content: tidyItemContent(title),
        listTitle: TODAY_TITLE,
      });
      return out;
    }
    out.push({ type: "create_list", title });
  }

  // "adiciona leite na Compras"
  const addInList =
    /\badiciona(?:r)?\s+(.+?)\s+(?:na|na\s+tarefa|na\s+lista|em(?:\s+a)?)\s+(?:tarefa\s+|lista\s+)?(.+)$/iu.exec(
      t,
    );
  // "na tarefa EBV coloca revisar escopo"
  const addAfterList =
    /\b(?:na|na\s+tarefa|na\s+lista)\s+(?:tarefa\s+|lista\s+)?(.+?)\s+(?:adiciona|coloca|p[oõ]e)\s+(.+)$/iu.exec(
      t,
    );
  if (addInList) {
    out.push({
      type: "add_item",
      content: tidyItemContent(addInList[1]),
      listTitle: normalizeTitle(addInList[2]),
    });
  } else if (addAfterList) {
    out.push({
      type: "add_item",
      content: tidyItemContent(addAfterList[2]),
      listTitle: normalizeTitle(addAfterList[1]),
    });
  } else {
    // "adiciona leite" → lista ativa / Hoje
    const addBare =
      /\badiciona(?:r)?(?:\s+(?:um\s+)?item)?\s*[:\s]+(.+)$/iu.exec(t) ??
      /\badiciona(?:r)?\s+(.+)$/iu.exec(t);
    if (addBare && !out.some((i) => i.type === "add_item")) {
      const content = tidyItemContent(addBare[1]);
      if (content.length >= 2 && !/^uma\s+(?:tarefa|lista)/i.test(content)) {
        out.push({ type: "add_item", content });
      }
    }
  }

  // delete — "apaga a tarefa mercado" | "exclui o item leite" | "remove tarefa X"
  const deletePatterns: Array<{ re: RegExp; sole?: boolean }> = [
    {
      re: /\b(?:apaga(?:r)?|exclui(?:r)?|remove(?:r)?|deleta(?:r)?)\s+(?:a\s+|o\s+)?(?:tarefa|item)\s+(.+)$/iu,
    },
    {
      re: /\b(?:apaga(?:r)?|exclui(?:r)?|remove(?:r)?)\s+(?:a\s+|o\s+)?(.+?)\s+da\s+(?:lista|tarefa)\b/iu,
    },
    {
      re: /\b(?:apaga(?:r)?|exclui(?:r)?|remove(?:r)?)\s+(?:a\s+|o\s+)?(?:tarefa|item)\b/iu,
      sole: true,
    },
  ];
  for (const { re, sole } of deletePatterns) {
    const m = re.exec(t);
    if (!m) continue;
    // não confundir com "apaga a nota…"
    if (/\bnota\b/iu.test(t) && !/\b(?:tarefa|item)\b/iu.test(t)) break;
    const raw = tidyItemContent(m[1] ?? "");
    if (sole || isVagueCompleteRef(raw)) {
      out.push({ type: "delete_item", content: raw || "tarefa", sole: true });
      break;
    }
    if (raw.length >= 2) {
      out.push({ type: "delete_item", content: raw });
      break;
    }
  }

  // edit — "edita a tarefa X para Y" | "muda a tarefa X para Y" | "altera item X para Y"
  const edit =
    /\b(?:edita(?:r)?|edite|altera(?:r)?|muda(?:r)?|renome(?:ar|ia|ie))\s+(?:a\s+|o\s+)?(?:tarefa|item)\s+(.+?)\s+(?:para|pra|por)\s+(.+)$/iu.exec(
      t,
    );
  if (edit) {
    const content = tidyItemContent(edit[1] ?? "");
    const newContent = tidyItemContent(edit[2] ?? "");
    if (content.length >= 2 && newContent.length >= 2) {
      out.push({ type: "edit_item", content, newContent });
    }
  }

  // complete — várias ordens naturais pt-BR
  // "marca X como feito" | "marca como feito X" | "conclui X" | "X está concluída"
  const completePatterns: Array<{ re: RegExp; sole?: boolean }> = [
    {
      re: /\bmarca(?:r)?\s+(.+?)\s+como\s+(?:feito|feita|conclu[ií]d[oa]|pronta)\b/iu,
    },
    {
      re: /\bmarca(?:r)?\s+como\s+(?:feito|feita|conclu[ií]d[oa]|pronta)\s+(?:a\s+)?(?:tarefa\s+|item\s+)?(.+)$/iu,
    },
    {
      re: /\b(?:conclui(?:r)?|finaliza(?:r)?)\s+(?:o\s+|a\s+)?(?:item\s+|tarefa\s+)?(.+)$/iu,
    },
    {
      re: /\b(?:j[aá]\s+)?(?:conclu[ií]|completei|terminei)\s+(?:a\s+|o\s+)?(?:tarefa\s+|item\s+)?(.+)$/iu,
    },
    {
      re: /\b(.+?)\s+(?:est[aá]|fica|ficou)\s+(?:como\s+)?(?:feito|feita|conclu[ií]d[oa]|pronta)\b/iu,
    },
    {
      re: /\b(?:pode\s+)?marca(?:r)?\s+(?:a\s+)?(?:tarefa|item)\s+como\s+(?:feito|feita|conclu[ií]d[oa]|pronta)\b/iu,
      sole: true,
    },
    {
      re: /\b(?:marca(?:r)?|marque)\s+como\s+(?:feito|feita|conclu[ií]d[oa]|pronta)\b/iu,
      sole: true,
    },
  ];
  for (const { re, sole } of completePatterns) {
    const m = re.exec(t);
    if (!m) continue;
    const raw = tidyItemContent(m[1] ?? "");
    if (sole || isVagueCompleteRef(raw)) {
      out.push({ type: "complete_item", content: raw || "tarefa", sole: true });
      break;
    }
    if (raw.length >= 2) {
      out.push({ type: "complete_item", content: raw });
      break;
    }
  }

  // archive
  const archive =
    /\barquiva(?:r)?\s+(?:a\s+)?(?:lista|tarefa)\s+(.+)$/iu.exec(t);
  if (archive) {
    const listTitle = normalizeTitle(archive[1]);
    if (listTitle) out.push({ type: "archive", listTitle });
  }

  // Fallback: gatilho de tarefa sem pattern (igual notas) — NÃO para complete/delete/edit
  if (out.length === 0 && looksLikeTaskIntent(t)) {
    if (
      /\b(?:apaga(?:r)?|exclui(?:r)?|remove(?:r)?|deleta(?:r)?)\b/iu.test(t)
    ) {
      out.push({ type: "delete_item", content: "tarefa", sole: true });
    } else if (
      /\b(?:marca(?:r)?|marque|conclu[ií]|finaliza|feito|feita|conclu[ií]d[oa])\b/iu.test(
        t,
      )
    ) {
      // complete vago → sole pending
      out.push({ type: "complete_item", content: "tarefa", sole: true });
    } else {
      let body = t
        .replace(
          /^[\s\S]*?\b(?:minha\s+(?:pr[oó]xima\s+)?tarefa\s+[eé]|tenho\s+(?:uma\s+)?tarefa(?:\s+(?:de|pra|para))?|a\s+tarefa\s+[eé]|tarefa\s*[:\-]|cria(?:r)?\s+(?:(?:uma|a)\s+)?tarefa(?:\s+(?:de|para|pra))?)\s*[:\s,]*/iu,
          "",
        )
        .trim();
      body = tidyItemContent(body);
      if (body.length >= 3 && body.toLowerCase() !== t.toLowerCase()) {
        out.push({ type: "add_item", content: body, listTitle: TODAY_TITLE });
      }
    }
  }

  return out;
}

export async function isTasksEnabled(userId: string): Promise<boolean> {
  try {
    const supabase = await db();
    const { data } = await supabase
      .from("profiles")
      .select("prefs")
      .eq("id", userId)
      .maybeSingle();
    const prefs = (data?.prefs ?? {}) as { tasksEnabled?: boolean };
    return prefs.tasksEnabled !== false;
  } catch {
    return false;
  }
}

export async function setTasksEnabled(
  userId: string,
  enabled: boolean,
): Promise<boolean> {
  try {
    const supabase = await db();
    const { data } = await supabase
      .from("profiles")
      .select("prefs")
      .eq("id", userId)
      .maybeSingle();
    const prefs = {
      ...((data?.prefs ?? {}) as Record<string, unknown>),
      tasksEnabled: enabled,
    };
    const { error } = await supabase
      .from("profiles")
      .update({ prefs })
      .eq("id", userId);
    return !error;
  } catch {
    return false;
  }
}

async function fetchOpenLists(userId: string): Promise<TaskList[]> {
  const supabase = await db();
  const { data: lists } = await supabase
    .from("task_lists")
    .select("id, title, status, created_at, updated_at")
    .eq("user_id", userId)
    .eq("status", "open")
    .order("updated_at", { ascending: false });

  if (!lists?.length) return [];

  const ids = (lists as { id: string }[]).map((l) => l.id);
  const { data: items } = await supabase
    .from("task_items")
    .select("id, list_id, content, done, position, created_at, updated_at")
    .eq("user_id", userId)
    .in("list_id", ids)
    .order("position", { ascending: true });

  const byList = new Map<string, TaskItem[]>();
  for (const it of items ?? []) {
    const arr = byList.get(it.list_id) ?? [];
    arr.push(it as TaskItem);
    byList.set(it.list_id, arr);
  }

  return (lists as { id: string }[]).map((l) => ({
    ...(l as unknown as Omit<TaskList, "items">),
    items: byList.get(l.id) ?? [],
  }));
}

export async function listTaskLists(
  userId: string,
  scope: "today" | "all" = "all",
): Promise<TaskList[]> {
  try {
    const lists = await fetchOpenLists(userId);
    if (scope !== "today") return lists;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const startMs = start.getTime();
    return lists
      .map((l) => ({
        ...l,
        items: l.items.filter(
          (it) => new Date(it.created_at).getTime() >= startMs || !it.done,
        ),
      }))
      .filter(
        (l) =>
          titlesMatch(l.title, TODAY_TITLE) ||
          new Date(l.updated_at).getTime() >= startMs ||
          l.items.length > 0,
      );
  } catch {
    return [];
  }
}

export async function createTaskList(
  userId: string,
  title: string,
): Promise<TaskList | null> {
  const t = normalizeTitle(title) || TODAY_TITLE;
  try {
    const supabase = await db();
    const existing = await fetchOpenLists(userId);
    const hit = existing.find((l) => titlesMatch(l.title, t));
    if (hit) return hit;

    const { data, error } = await supabase
      .from("task_lists")
      .insert({ user_id: userId, title: t, status: "open" })
      .select("id, title, status, created_at, updated_at")
      .single();
    if (error || !data) {
      console.warn("[tasks] createTaskList failed:", error);
      return null;
    }
    return { ...(data as Omit<TaskList, "items">), items: [] };
  } catch (err) {
    console.warn("[tasks] createTaskList failed:", err);
    return null;
  }
}

export async function addTaskItem(
  userId: string,
  listId: string,
  content: string,
): Promise<TaskItem | null> {
  const body = clean(content).slice(0, TASK_CONTENT_MAX);
  if (body.length < 2) return null;
  try {
    const supabase = await db();
    const { data: maxPos } = await supabase
      .from("task_items")
      .select("position")
      .eq("list_id", listId)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    const position = (maxPos?.position ?? -1) + 1;
    const { data, error } = await supabase
      .from("task_items")
      .insert({
        user_id: userId,
        list_id: listId,
        content: body,
        done: false,
        position,
      })
      .select("id, list_id, content, done, position, created_at, updated_at")
      .single();
    if (error || !data) {
      console.warn("[tasks] addTaskItem failed:", error);
      return null;
    }
    await supabase
      .from("task_lists")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", listId)
      .eq("user_id", userId);
    return data as TaskItem;
  } catch (err) {
    console.warn("[tasks] addTaskItem failed:", err);
    return null;
  }
}

export async function updateTaskItem(
  userId: string,
  itemId: string,
  patch: { done?: boolean; content?: string; position?: number },
): Promise<TaskItem | null> {
  try {
    const supabase = await db();
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (typeof patch.done === "boolean") updates.done = patch.done;
    if (typeof patch.content === "string") {
      updates.content = clean(patch.content).slice(0, TASK_CONTENT_MAX);
    }
    if (typeof patch.position === "number") updates.position = patch.position;

    const { data, error } = await supabase
      .from("task_items")
      .update(updates)
      .eq("id", itemId)
      .eq("user_id", userId)
      .select("id, list_id, content, done, position, created_at, updated_at")
      .single();
    if (error || !data) {
      console.warn("[tasks] updateTaskItem failed:", error);
      return null;
    }
    return data as TaskItem;
  } catch (err) {
    console.warn("[tasks] updateTaskItem failed:", err);
    return null;
  }
}

export async function deleteTaskItem(
  userId: string,
  itemId: string,
): Promise<boolean> {
  try {
    const supabase = await db();
    const { error } = await supabase
      .from("task_items")
      .delete()
      .eq("id", itemId)
      .eq("user_id", userId);
    return !error;
  } catch {
    return false;
  }
}

export async function archiveTaskList(
  userId: string,
  listId: string,
): Promise<boolean> {
  try {
    const supabase = await db();
    const { error } = await supabase
      .from("task_lists")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("id", listId)
      .eq("user_id", userId);
    return !error;
  } catch {
    return false;
  }
}

function resolveList(
  lists: TaskList[],
  listTitle: string | undefined,
  lastListId: string | undefined,
): TaskList | null {
  if (listTitle) {
    const hit = lists.find((l) => titlesMatch(l.title, listTitle));
    if (hit) return hit;
  }
  if (lastListId) {
    const hit = lists.find((l) => l.id === lastListId);
    if (hit) return hit;
  }
  const hoje = lists.find((l) => titlesMatch(l.title, TODAY_TITLE));
  if (hoje) return hoje;
  return lists[0] ?? null;
}

function fuzzyFindItem(
  lists: TaskList[],
  content: string,
  listTitle?: string,
  sole = false,
  opts?: { includeDone?: boolean },
): { list: TaskList; item: TaskItem } | null {
  const pool = listTitle
    ? lists.filter((l) => titlesMatch(l.title, listTitle))
    : lists;
  const search = pool.length ? pool : lists;
  const includeDone = opts?.includeDone === true;

  const candidates = (list: TaskList) =>
    includeDone ? list.items : list.items.filter((i) => !i.done);

  // Uma só candidata (ou sole explícito) → usa ela
  const allPending: Array<{ list: TaskList; item: TaskItem }> = [];
  for (const list of search) {
    for (const item of candidates(list)) {
      allPending.push({ list, item });
    }
  }
  if (sole || isVagueCompleteRef(content)) {
    if (allPending.length === 1) return allPending[0];
    if (allPending.length > 1 && sole) {
      // mais recente
      return allPending.sort(
        (a, b) =>
          new Date(b.item.created_at).getTime() -
          new Date(a.item.created_at).getTime(),
      )[0];
    }
  }

  const needle = fold(content);
  const needleTokens = contentTokens(content);
  let best: { list: TaskList; item: TaskItem; score: number } | null = null;

  for (const list of search) {
    for (const item of candidates(list)) {
      const hay = fold(item.content);
      let score = 0;
      if (hay === needle) score = 100;
      else if (hay.includes(needle) && needle.length >= 3) score = 80;
      else if (needle.includes(hay) && hay.length >= 3) score = 70;
      else {
        const hayTokens = contentTokens(item.content);
        const overlap = needleTokens.filter((t) =>
          hayTokens.some((h) => h === t || h.includes(t) || t.includes(h)),
        ).length;
        if (overlap > 0) score = 40 + overlap * 15;
      }
      if (score > 0 && (!best || score > best.score)) {
        best = { list, item, score };
      }
    }
  }
  return best && best.score >= 40 ? { list: best.list, item: best.item } : null;
}

/**
 * Aplica intents → DB. Retorna mudanças + ack.
 * Regex primeiro; se falhar e o pedido cheirar a tarefa → LLM interpreta.
 */
export async function applyTaskIntents(
  userId: string,
  transcript: string,
  opts?: { lastListId?: string },
): Promise<{
  changed: TasksChanged[];
  ack: string;
  intents: TaskIntent[];
  error?: string;
}> {
  let intents: TaskIntent[] = extractTaskIntents(transcript);
  if (intents.length === 0) {
    const { extractTaskIntentsWithLlm, softTaskSignal } = await import(
      "@/lib/tasks/llm-extract"
    );
    if (softTaskSignal(transcript)) {
      let pendingPreview = "";
      try {
        const open = await fetchOpenLists(userId);
        pendingPreview = open
          .flatMap((l) =>
            l.items
              .filter((i) => !i.done)
              .slice(0, 6)
              .map((i) => `- [${l.title}] ${i.content}`),
          )
          .slice(0, 12)
          .join("\n");
      } catch {
        /* best-effort context */
      }
      const llmIntents = await extractTaskIntentsWithLlm(transcript, {
        pendingPreview,
      });
      intents = llmIntents as TaskIntent[];
    }
  }
  if (intents.length === 0) {
    return { changed: [], ack: "", intents };
  }

  console.info("[tasks] intents", {
    userId: userId.slice(0, 8),
    transcript: transcript.slice(0, 120),
    intents,
  });

  const changed: TasksChanged[] = [];
  let lastListId = opts?.lastListId;
  let lastError: string | undefined;

  for (const intent of intents) {
    let lists = await fetchOpenLists(userId);

    if (intent.type === "create_list") {
      const list = await createTaskList(userId, intent.title);
      if (!list) {
        lastError = "falha ao criar lista";
        continue;
      }
      lastListId = list.id;
      changed.push({
        listId: list.id,
        listTitle: list.title,
        action: "created",
        items: list.items.map((i) => ({
          id: i.id,
          content: i.content,
          done: i.done,
        })),
      });
      continue;
    }

    if (intent.type === "add_item") {
      let list = resolveList(lists, intent.listTitle, lastListId);
      if (!list) {
        list = await createTaskList(
          userId,
          intent.listTitle ?? TODAY_TITLE,
        );
      } else if (
        intent.listTitle &&
        !titlesMatch(list.title, intent.listTitle)
      ) {
        list = (await createTaskList(userId, intent.listTitle)) ?? list;
      }
      if (!list) {
        lastError = "falha ao resolver/criar lista";
        continue;
      }
      const item = await addTaskItem(userId, list.id, intent.content);
      if (!item) {
        lastError = "falha ao adicionar item";
        continue;
      }
      lastListId = list.id;
      lists = await fetchOpenLists(userId);
      const fresh = lists.find((l) => l.id === list!.id) ?? list;
      changed.push({
        listId: fresh.id,
        listTitle: fresh.title,
        action: "added",
        items: (fresh.items.length
          ? fresh.items
          : [...list.items, item]
        ).map((i) => ({ id: i.id, content: i.content, done: i.done })),
      });
      continue;
    }

    if (intent.type === "complete_item") {
      lists = await fetchOpenLists(userId);
      const found = fuzzyFindItem(
        lists,
        intent.content,
        intent.listTitle,
        intent.sole === true,
      );
      if (!found) {
        lastError = "item não encontrado";
        continue;
      }
      const updated = await updateTaskItem(userId, found.item.id, {
        done: true,
      });
      if (!updated) {
        lastError = "falha ao concluir item";
        continue;
      }
      lastListId = found.list.id;
      const items = found.list.items.map((i) =>
        i.id === updated.id
          ? { id: i.id, content: i.content, done: true }
          : { id: i.id, content: i.content, done: i.done },
      );
      changed.push({
        listId: found.list.id,
        listTitle: found.list.title,
        action: "completed",
        items,
      });
      continue;
    }

    if (intent.type === "delete_item") {
      lists = await fetchOpenLists(userId);
      const found = fuzzyFindItem(
        lists,
        intent.content,
        intent.listTitle,
        intent.sole === true,
        { includeDone: true },
      );
      if (!found) {
        lastError = "item não encontrado";
        continue;
      }
      const ok = await deleteTaskItem(userId, found.item.id);
      if (!ok) {
        lastError = "falha ao apagar item";
        continue;
      }
      lastListId = found.list.id;
      changed.push({
        listId: found.list.id,
        listTitle: found.list.title,
        action: "deleted",
        items: [
          {
            id: found.item.id,
            content: found.item.content,
            done: found.item.done,
          },
        ],
      });
      continue;
    }

    if (intent.type === "edit_item") {
      lists = await fetchOpenLists(userId);
      const found = fuzzyFindItem(
        lists,
        intent.content,
        intent.listTitle,
        false,
        { includeDone: true },
      );
      if (!found) {
        lastError = "item não encontrado";
        continue;
      }
      const previousContent = found.item.content;
      const updated = await updateTaskItem(userId, found.item.id, {
        content: intent.newContent,
      });
      if (!updated) {
        lastError = "falha ao editar item";
        continue;
      }
      lastListId = found.list.id;
      const items = found.list.items.map((i) =>
        i.id === updated.id
          ? { id: i.id, content: updated.content, done: i.done }
          : { id: i.id, content: i.content, done: i.done },
      );
      changed.push({
        listId: found.list.id,
        listTitle: found.list.title,
        action: "edited",
        items,
        previousContent,
      });
      continue;
    }

    if (intent.type === "archive") {
      lists = await fetchOpenLists(userId);
      const list = lists.find((l) => titlesMatch(l.title, intent.listTitle));
      if (!list) {
        lastError = "lista não encontrada";
        continue;
      }
      const ok = await archiveTaskList(userId, list.id);
      if (!ok) {
        lastError = "falha ao arquivar";
        continue;
      }
      changed.push({
        listId: list.id,
        listTitle: list.title,
        action: "archived",
        items: [],
      });
    }
  }

  if (intents.length > 0 && changed.length === 0) {
    console.warn("[tasks] intents sem persistência", { intents, lastError });
  }

  return {
    changed,
    ack: formatTasksAck(changed),
    intents,
    error: changed.length === 0 ? lastError : undefined,
  };
}

export function formatTasksAck(changed: TasksChanged[]): string {
  if (changed.length === 0) return "";
  const parts: string[] = [];
  for (const c of changed) {
    if (c.action === "created") {
      parts.push(`Criei a lista ${c.listTitle}`);
    } else if (c.action === "added") {
      const last = c.items.filter((i) => !i.done).at(-1);
      parts.push(
        last
          ? `Adicionei «${last.content}» em ${c.listTitle}`
          : `Atualizei ${c.listTitle}`,
      );
    } else if (c.action === "completed") {
      const done = c.items.filter((i) => i.done);
      const last = done.at(-1);
      parts.push(
        last
          ? `Marquei «${last.content}» como feito`
          : `Atualizei ${c.listTitle}`,
      );
    } else if (c.action === "archived") {
      parts.push(`Arquivei a lista ${c.listTitle}`);
    } else if (c.action === "deleted") {
      const last = c.items[0];
      parts.push(
        last
          ? `Apaguei «${last.content}» de ${c.listTitle}`
          : `Apaguei um item de ${c.listTitle}`,
      );
    } else if (c.action === "edited") {
      const last = c.items.find((i) =>
        c.previousContent
          ? fold(i.content) !== fold(c.previousContent)
          : true,
      ) ?? c.items.at(-1);
      if (last && c.previousContent) {
        parts.push(
          `Atualizei «${c.previousContent}» para «${last.content}»`,
        );
      } else if (last) {
        parts.push(`Atualizei o item para «${last.content}»`);
      } else {
        parts.push(`Atualizei ${c.listTitle}`);
      }
    }
  }
  const joined = parts.join(". ");
  return `${joined}${joined.endsWith(".") ? "" : "."}`;
}

/** Resumo curto para o system prompt (≤5 linhas). */
export function formatTasksBlock(lists: TaskList[]): string {
  if (lists.length === 0) return "";
  const lines: string[] = [];
  for (const l of lists.slice(0, 5)) {
    const pending = l.items.filter((i) => !i.done);
    if (pending.length === 0 && l.items.length === 0) {
      lines.push(`- ${l.title}: (vazia)`);
    } else {
      const preview = pending
        .slice(0, 4)
        .map((i) => i.content)
        .join("; ");
      lines.push(
        `- ${l.title}: ${pending.length} pendente(s)${preview ? ` — ${preview}` : ""}`,
      );
    }
  }
  return `TAREFAS DO USUÁRIO (listas abertas — o sistema grava checklists; NÃO diga que marcou/criou/apagou/editou algo sem o ack do sistema):\n${lines.join("\n")}`;
}

export async function getTasksPromptBlock(userId: string): Promise<string> {
  const lists = await listTaskLists(userId, "all");
  return formatTasksBlock(lists);
}
