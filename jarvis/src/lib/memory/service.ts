import { createClient } from "@/lib/supabase/server";

/**
 * Memória por usuário (estilo mem0) — determinística, sem LLM de extração.
 * Extrai fatos/preferências/notas explícitos do turno do usuário, guarda no
 * Supabase (RLS por user_id) e injeta no contexto do LLM. Opt-out via
 * profiles.prefs.memoryEnabled. Extração heurística (LLM local fraco p/ extract).
 */

export type MemoryKind = "fact" | "preference" | "context" | "note";
export type MemoryItem = { content: string; kind: MemoryKind };

const MAX_MEMORIES = 50;
export const MEMORY_MAX_LEN = 180;

const PATTERNS: Array<{ re: RegExp; kind: MemoryKind; prefix: string }> = [
  {
    re: /\b(?:meu nome é|me chamo|pode me chamar de)\s+([\p{L}]+(?:\s+(?!e\b|que\b|mas\b|e\s)[\p{L}]+)?)/iu,
    kind: "fact",
    prefix: "Nome:",
  },
  {
    re: /\b(?:eu )?(?:trabalho|atuo)\s+(?:com|como|na|no|em)\s+([\p{L}][\p{L}\s.,&-]{2,60})/iu,
    kind: "fact",
    prefix: "Trabalho:",
  },
  {
    re: /\b(?:sou|sou o|sou a)\s+([\p{L}][\p{L}\s]{2,40}?)\s+(?:da|do|na|no)\s+([\p{L}][\p{L}\s.&-]{2,40})/iu,
    kind: "fact",
    prefix: "Cargo/empresa:",
  },
  {
    re: /(?<!n[ãa]o\s)\b(?:prefiro|gosto de|curto)\s+([\p{L}][\p{L}\s.,&-]{2,60})/iu,
    kind: "preference",
    prefix: "Prefere:",
  },
  {
    re: /\b(?:não gosto de|não curto|evito)\s+([\p{L}][\p{L}\s.,&-]{2,60})/iu,
    kind: "preference",
    prefix: "Não gosta de:",
  },
  // Notas — frases naturais pt-BR (voz costuma ser solta)
  {
    // "A nota para mim, uma reunião hoje às 4:30" · "nota pra mim: call EBV"
    re: /\b(?:a\s+)?nota(?:\s+(?:para|pra)\s+mim|\s+a[ií])?\s*[,:]\s*(.{3,140})/iu,
    kind: "note",
    prefix: "Nota:",
  },
  {
    // "marca" só com "que"/"aí" — "marca X como feito" é tarefa (ADR-016)
    re: /\b(?:anota(?:\s+a[ií])?|anote|anotar|faz(?:er)?\s+(?:uma\s+)?nota(?:\s+(?:para|pra)\s+mim)?|escreve que|escreva que|guarda(?:\s+isso)?|registra(?:\s+que)?|marca(?:\s+a[ií])?\s+que|marca\s+a[ií]|agenda(?:\s+que)?|lembre-me de|me lembre de)\s*[:\s,]*(.{3,140})/iu,
    kind: "note",
    prefix: "Nota:",
  },
  {
    re: /\b(?:lembre(?:-se)? que|guarda que|n[ãa]o esque[çc]a que)\s+(.{3,120})/iu,
    kind: "context",
    prefix: "",
  },
];

function clean(s: string): string {
  return s.replace(/\s+/g, " ").trim().replace(/[.,;:]+$/, "");
}

const WEEKDAY_INDEX: Record<string, number> = {
  domingo: 0,
  segunda: 1,
  "segunda-feira": 1,
  terca: 2,
  "terça": 2,
  "terca-feira": 2,
  "terça-feira": 2,
  quarta: 3,
  "quarta-feira": 3,
  quinta: 4,
  "quinta-feira": 4,
  sexta: 5,
  "sexta-feira": 5,
  sabado: 6,
  sábado: 6,
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function formatBrDate(d: Date): string {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function nextWeekday(targetDow: number, from = new Date()): Date {
  const d = new Date(from);
  d.setHours(12, 0, 0, 0);
  const delta = (targetDow - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + delta);
  return d;
}

/**
 * Normaliza datas faladas em notas: "dia 7 do 8" → "07/08/2026",
 * "sexta-feira" → próxima sexta com data.
 */
export function normalizeNoteDates(text: string, now = new Date()): string {
  let s = text;
  // STT: "para quem dia" → "para" (data vem em seguida)
  s = s.replace(/\bpara quem\s+dia\b/giu, "para");

  s = s.replace(
    /\bdia\s+(\d{1,2})\s+(?:do|de)\s+(\d{1,2})(?:\s+(?:de\s+)?(\d{2,4}))?\b/giu,
    (_m, day: string, month: string, year?: string) => {
      const y = year
        ? year.length === 2
          ? 2000 + Number(year)
          : Number(year)
        : now.getFullYear();
      const d = Number(day);
      const mo = Number(month);
      if (d < 1 || d > 31 || mo < 1 || mo > 12) return _m;
      return formatBrDate(new Date(y, mo - 1, d));
    },
  );

  s = s.replace(
    /\b(\d{1,2})\s*[/.-]\s*(\d{1,2})(?:\s*[/.-]\s*(\d{2,4}))?\b/g,
    (full, day: string, month: string, year?: string) => {
      // evita milissegundos / versões tipo 1.2.3 já com ano curto ok
      const y = year
        ? year.length === 2
          ? 2000 + Number(year)
          : Number(year)
        : now.getFullYear();
      const d = Number(day);
      const mo = Number(month);
      if (d < 1 || d > 31 || mo < 1 || mo > 12) return full;
      return formatBrDate(new Date(y, mo - 1, d));
    },
  );

    s = s.replace(
    /\b(segunda(?:-feira)?|ter[cç]a(?:-feira)?|quarta(?:-feira)?|quinta(?:-feira)?|sexta(?:-feira)?|s[aá]bado|domingo)\b/giu,
    (raw) => {
      const key = raw
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .replace("ç", "c");
      const idx =
        WEEKDAY_INDEX[key] ??
        WEEKDAY_INDEX[raw.toLowerCase()] ??
        WEEKDAY_INDEX[key.replace(/-feira$/, "")];
      if (idx === undefined) return raw;
      const d = nextWeekday(idx, now);
      return `${raw} (${formatBrDate(d)})`;
    },
  );

  return clean(s);
}

/** Gatilho frouxo de intenção de anotação (fallback se regex principal falhar). */
const NOTE_INTENT =
  /\b(?:nota|anot[aei]|anotar|agenda|registra|guarda(?:\s+isso)?|lembre[- ]?me|me lembre)\b/i;

/**
 * Extrai memórias explícitas do texto do usuário (0..N por turno).
 * Inclui fallback para fala natural tipo "a nota para mim, reunião às 16h".
 */
export function extractMemories(transcript: string): MemoryItem[] {
  const out: MemoryItem[] = [];
  for (const { re, kind, prefix } of PATTERNS) {
    const m = re.exec(transcript);
    if (!m) continue;
    const body = m
      .slice(1)
      .filter(Boolean)
      .map(clean)
      .map((b) => b.replace(/^que\s+/iu, ""))
      .join(" · ");
    if (body.length < 2) continue;
    const normalized =
      kind === "note" || kind === "context" ? normalizeNoteDates(body) : body;
    const content = clean(`${prefix} ${normalized}`).slice(0, MEMORY_MAX_LEN);
    if (!out.some((o) => o.content.toLowerCase() === content.toLowerCase())) {
      out.push({ content, kind });
    }
  }

  // Fallback: intenção de nota detectada, mas nenhum pattern capturou o corpo
  if (!out.some((o) => o.kind === "note") && NOTE_INTENT.test(transcript)) {
    let body = transcript
      .replace(
        /^[\s\S]*?\b(?:a\s+)?nota(?:\s+(?:para|pra)\s+mim|\s+a[ií])?\s*[,:]?\s*/iu,
        "",
      )
      .replace(
        /^[\s\S]*?\b(?:anota(?:\s+a[ií])?|anote|anotar|faz(?:er)?\s+(?:uma\s+)?nota|registra(?:\s+que)?|agenda(?:\s+que)?)\s*[:\s,]*/iu,
        "",
      );
    body = clean(body);
    // se o replace não cortou nada, usa o transcript inteiro (ainda é pedido de nota)
    if (body.length < 3 || body.toLowerCase() === clean(transcript).toLowerCase()) {
      body = clean(
        transcript
          .replace(NOTE_INTENT, " ")
          .replace(/^(para|pra|mim|a[ií]|que|,)+/iu, ""),
      );
    }
    if (body.length >= 3) {
      out.push({
        content: clean(`Nota: ${normalizeNoteDates(body)}`).slice(
          0,
          MEMORY_MAX_LEN,
        ),
        kind: "note",
      });
    }
  }

  return out;
}

export async function isMemoryEnabled(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("prefs")
      .eq("id", userId)
      .maybeSingle();
    const prefs = (data?.prefs ?? {}) as { memoryEnabled?: boolean };
    return prefs.memoryEnabled !== false;
  } catch {
    return false;
  }
}

/**
 * Grava memórias novas (dedup). Retorna conteúdos efetivamente inseridos
 * (para ack na voz / memoriesSaved na API).
 */
export async function saveMemories(
  userId: string,
  items: MemoryItem[],
): Promise<string[]> {
  if (items.length === 0) return [];
  try {
    const supabase = await createClient();
    const { data: recent } = await supabase
      .from("user_memories")
      .select("content")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(MAX_MEMORIES);

    const seen = new Set((recent ?? []).map((r) => r.content.toLowerCase()));
    const fresh = items.filter((it) => !seen.has(it.content.toLowerCase()));
    if (fresh.length === 0) return [];

    await supabase.from("user_memories").insert(
      fresh.map((it) => ({
        user_id: userId,
        content: it.content,
        kind: it.kind,
      })),
    );
    return fresh.map((it) => it.content);
  } catch (err) {
    console.warn("[memory] save failed:", err);
    return [];
  }
}

/** Nota manual (POST Settings) — sempre kind=note por default. */
export async function saveExplicitNote(
  userId: string,
  text: string,
  kind: MemoryKind = "note",
): Promise<UserMemory | null> {
  const content = clean(text).slice(0, MEMORY_MAX_LEN);
  if (content.length < 2) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_memories")
      .insert({ user_id: userId, content, kind })
      .select("id, content, kind, created_at")
      .single();
    if (error || !data) {
      console.warn("[memory] saveExplicitNote failed:", error);
      return null;
    }
    return data as UserMemory;
  } catch (err) {
    console.warn("[memory] saveExplicitNote failed:", err);
    return null;
  }
}

/** Memórias para o prompt — prioriza `note`, depois as mais recentes. */
export async function getUserMemories(
  userId: string,
  limit = 12,
): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("user_memories")
      .select("content, kind, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(MAX_MEMORIES);
    const rows = (data ?? []) as Array<{
      content: string;
      kind: string;
      created_at: string;
    }>;
    const notes = rows.filter((r) => r.kind === "note");
    const rest = rows.filter((r) => r.kind !== "note");
    return [...notes, ...rest].slice(0, limit).map((r) => r.content);
  } catch {
    return [];
  }
}

export type UserMemory = {
  id: string;
  content: string;
  kind: MemoryKind;
  created_at: string;
};

export async function listUserMemories(userId: string): Promise<UserMemory[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("user_memories")
      .select("id, content, kind, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(MAX_MEMORIES);
    return (data ?? []) as UserMemory[];
  } catch {
    return [];
  }
}

export async function deleteUserMemory(
  userId: string,
  id: string,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("user_memories")
      .delete()
      .eq("user_id", userId)
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function updateUserMemory(
  userId: string,
  id: string,
  content: string,
): Promise<UserMemory | null> {
  const next = clean(content).slice(0, MEMORY_MAX_LEN);
  if (next.length < 2) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_memories")
      .update({ content: next })
      .eq("user_id", userId)
      .eq("id", id)
      .select("id, content, kind, created_at")
      .single();
    if (error || !data) {
      console.warn("[memory] updateUserMemory failed:", error);
      return null;
    }
    return data as UserMemory;
  } catch (err) {
    console.warn("[memory] updateUserMemory failed:", err);
    return null;
  }
}

export type NotesChanged = {
  id: string;
  action: "deleted" | "edited";
  content: string;
  previousContent?: string;
};

type NoteIntent =
  | { type: "delete_note"; content: string; sole?: boolean }
  | { type: "edit_note"; content: string; newContent: string };

function foldNote(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/^(nota|nome|trabalho|prefere|n[aã]o gosta de|cargo\/empresa):\s*/i, "");
}

/** Pedido de apagar/editar nota — não confundir com tarefa nem "anota que…". */
export function looksLikeNoteMutation(transcript: string): boolean {
  const n = transcript.normalize("NFC");
  if (/\b(?:tarefa|item|lista|checklist)\b/iu.test(n)) return false;
  if (
    /\b(?:apaga(?:r)?|exclui(?:r)?|remove(?:r)?|deleta(?:r)?)\b.{0,40}\bnota\b/iu.test(
      n,
    )
  ) {
    return true;
  }
  if (
    /\b(?:edita(?:r)?|edite|altera(?:r)?|muda(?:r)?|corrige)\b.{0,40}\bnota\b/iu.test(
      n,
    )
  ) {
    return true;
  }
  return false;
}

export function extractNoteMutations(transcript: string): NoteIntent[] {
  const t = clean(transcript.normalize("NFC"));
  if (!t || !looksLikeNoteMutation(t)) return [];
  const out: NoteIntent[] = [];

  const edit =
    /\b(?:edita(?:r)?|edite|altera(?:r)?|muda(?:r)?|corrige)\s+(?:a\s+)?nota\s+(?:sobre\s+|de\s+|da\s+)?(.+?)\s+(?:para|pra|por)\s+(.+)$/iu.exec(
      t,
    );
  if (edit) {
    const content = clean(edit[1] ?? "");
    const newContent = clean(edit[2] ?? "");
    if (content.length >= 2 && newContent.length >= 2) {
      out.push({ type: "edit_note", content, newContent });
      return out;
    }
  }

  const del =
    /\b(?:apaga(?:r)?|exclui(?:r)?|remove(?:r)?|deleta(?:r)?)\s+(?:a\s+)?nota\s+(?:sobre\s+|de\s+|da\s+)?(.+)$/iu.exec(
      t,
    ) ??
    /\b(?:apaga(?:r)?|exclui(?:r)?|remove(?:r)?)\s+(?:a\s+)?nota\b/iu.exec(t);
  if (del) {
    const raw = clean(del[1] ?? "");
    if (!raw || /^(essa|essa\s+a[ií]|aquela|a\s+[uú]ltima)$/iu.test(raw)) {
      out.push({ type: "delete_note", content: raw || "nota", sole: true });
    } else {
      out.push({ type: "delete_note", content: raw });
    }
  }

  return out;
}

function fuzzyFindNote(
  notes: UserMemory[],
  content: string,
  sole = false,
): UserMemory | null {
  if (notes.length === 0) return null;
  if (sole || foldNote(content).length < 3) {
    return notes[0] ?? null; // mais recente (lista já desc)
  }
  const needle = foldNote(content);
  const needleTokens = needle
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length >= 2);
  let best: { note: UserMemory; score: number } | null = null;
  for (const note of notes) {
    const hay = foldNote(note.content);
    let score = 0;
    if (hay === needle) score = 100;
    else if (hay.includes(needle) && needle.length >= 3) score = 80;
    else if (needle.includes(hay) && hay.length >= 3) score = 70;
    else {
      const hayTokens = hay.split(/[^\p{L}\p{N}]+/u).filter((t) => t.length >= 2);
      const overlap = needleTokens.filter((t) =>
        hayTokens.some((h) => h === t || h.includes(t) || t.includes(h)),
      ).length;
      if (overlap > 0) score = 40 + overlap * 15;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { note, score };
    }
  }
  return best && best.score >= 40 ? best.note : null;
}

export async function applyNoteMutations(
  userId: string,
  transcript: string,
): Promise<{
  changed: NotesChanged[];
  ack: string;
  intents: NoteIntent[];
  error?: string;
}> {
  const intents = extractNoteMutations(transcript);
  if (intents.length === 0) {
    return { changed: [], ack: "", intents };
  }

  const all = await listUserMemories(userId);
  const notes = all.filter((m) => m.kind === "note");
  const changed: NotesChanged[] = [];
  let lastError: string | undefined;

  for (const intent of intents) {
    if (intent.type === "delete_note") {
      const found = fuzzyFindNote(notes, intent.content, intent.sole === true);
      if (!found) {
        lastError = "nota não encontrada";
        continue;
      }
      const ok = await deleteUserMemory(userId, found.id);
      if (!ok) {
        lastError = "falha ao apagar nota";
        continue;
      }
      const idx = notes.findIndex((n) => n.id === found.id);
      if (idx >= 0) notes.splice(idx, 1);
      changed.push({
        id: found.id,
        action: "deleted",
        content: found.content,
      });
      continue;
    }

    if (intent.type === "edit_note") {
      const found = fuzzyFindNote(notes, intent.content, false);
      if (!found) {
        lastError = "nota não encontrada";
        continue;
      }
      const previousContent = found.content;
      const updated = await updateUserMemory(
        userId,
        found.id,
        intent.newContent.startsWith("Nota:")
          ? intent.newContent
          : `Nota: ${intent.newContent}`,
      );
      if (!updated) {
        lastError = "falha ao editar nota";
        continue;
      }
      const idx = notes.findIndex((n) => n.id === found.id);
      if (idx >= 0) notes[idx] = updated;
      changed.push({
        id: updated.id,
        action: "edited",
        content: updated.content,
        previousContent,
      });
    }
  }

  return {
    changed,
    ack: formatNotesAck(changed),
    intents,
    error: changed.length === 0 ? lastError : undefined,
  };
}

export function formatNotesAck(changed: NotesChanged[]): string {
  if (changed.length === 0) return "";
  const parts: string[] = [];
  for (const c of changed) {
    if (c.action === "deleted") {
      const label = c.content.replace(/^Nota:\s*/i, "");
      parts.push(`Apaguei a nota «${label}»`);
    } else if (c.action === "edited") {
      const prev = (c.previousContent ?? "").replace(/^Nota:\s*/i, "");
      const next = c.content.replace(/^Nota:\s*/i, "");
      parts.push(`Atualizei a nota «${prev}» para «${next}»`);
    }
  }
  const joined = parts.join(". ");
  return `${joined}${joined.endsWith(".") ? "" : "."}`;
}

export async function deleteAllUserMemories(userId: string): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("user_memories")
      .delete()
      .eq("user_id", userId);
    return !error;
  } catch {
    return false;
  }
}

export async function setMemoryEnabled(
  userId: string,
  enabled: boolean,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("prefs")
      .eq("id", userId)
      .maybeSingle();
    const prefs = {
      ...((data?.prefs ?? {}) as Record<string, unknown>),
      memoryEnabled: enabled,
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

export function formatMemoryBlock(memories: string[]): string {
  if (memories.length === 0) return "";
  const lines = memories.map((m) => `- ${m}`).join("\n");
  return `MEMÓRIA DO USUÁRIO (notas e fatos que ele compartilhou — priorize notas; use quando relevante, não repita de volta sem motivo):\n${lines}`;
}

/** Linha curta de ack para anexar à resposta falada. */
export function formatMemoryAck(saved: string[]): string {
  if (saved.length === 0) return "";
  // dedup conteúdo (STT/patterns às vezes duplicam no mesmo turno)
  const unique = [...new Set(saved.map((s) => s.trim()))];
  const short = unique
    .map((s) =>
      s.replace(
        /^(Nota|Nome|Trabalho|Prefere|Não gosta de|Cargo\/empresa):\s*/i,
        "",
      ),
    )
    .join("; ");
  return `Anotei: ${short.slice(0, 120)}${short.length > 120 ? "…" : ""}.`;
}

/** Remove eco do LLM ("Anotei: …") quando o sistema já prependeu o ack. */
export function stripRedundantMemoryAck(text: string): string {
  return text
    .replace(/^(?:\s*Anotei:\s*[^.?!]+[.?!]\s*)+/iu, "")
    .trim();
}
