import { createClient } from "@/lib/supabase/server";
import type { RagCitation } from "@/lib/rag/query";
import type { TurnMessage } from "@/lib/voice/types";

/** Resumo de uma conversa para a sidebar de histórico. */
export type SessionSummary = {
  sessionId: string;
  title: string;
  lastAt: string; // ISO
  turnCount: number;
};

/**
 * Lista as conversas recentes do usuário (com transcrição). Título derivado da
 * 1ª mensagem do usuário — sem coluna nova. Uma query em sessions + uma em
 * transcripts (sem N+1); agregação em memória.
 */
export async function listRecentSessions(
  userId: string,
  limit = 30,
): Promise<SessionSummary[]> {
  const supabase = await createClient();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!sessions?.length) return [];

  const ids = sessions.map((s) => s.id);
  const { data: rows } = await supabase
    .from("transcripts")
    .select("session_id, role, content, created_at")
    .in("session_id", ids)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  type Agg = { title?: string; count: number; lastAt: string };
  const agg = new Map<string, Agg>();
  for (const r of rows ?? []) {
    const cur: Agg = agg.get(r.session_id) ?? {
      count: 0,
      lastAt: r.created_at,
    };
    if (r.role === "user") {
      cur.count++;
      if (!cur.title) cur.title = r.content;
    }
    if (r.created_at > cur.lastAt) cur.lastAt = r.created_at;
    agg.set(r.session_id, cur);
  }

  return sessions
    .filter((s) => agg.has(s.id))
    .map((s) => {
      const a = agg.get(s.id)!;
      const title = (a.title ?? "Conversa").replace(/\s+/g, " ").trim();
      return {
        sessionId: s.id,
        title: title.length > 60 ? `${title.slice(0, 57)}…` : title || "Conversa",
        lastAt: a.lastAt,
        turnCount: a.count,
      };
    });
}

/** Carrega o transcript de uma sessão (ordenado) para retomar a conversa. */
export async function getSessionTranscript(
  userId: string,
  sessionId: string,
): Promise<TurnMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("transcripts")
    .select("role, content, created_at")
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return (data ?? []).map((r) => ({
    role: r.role === "assistant" ? "assistant" : "user",
    content: r.content,
    timestamp: new Date(r.created_at).getTime(),
  }));
}

/** Persiste par user+assistant na tabela transcripts (Supabase). */
export async function saveTranscriptTurn(opts: {
  userId: string;
  sessionId: string;
  userText: string;
  assistantText: string;
  citations?: RagCitation[];
}): Promise<void> {
  const supabase = await createClient();

  const rows = [
    {
      session_id: opts.sessionId,
      user_id: opts.userId,
      role: "user" as const,
      content: opts.userText,
    },
    {
      session_id: opts.sessionId,
      user_id: opts.userId,
      role: "assistant" as const,
      content: opts.assistantText,
    },
  ];

  const { error } = await supabase.from("transcripts").insert(rows);
  if (error) {
    console.warn("[transcripts] insert failed:", error.message);
  }

  // citations ficam no Redis hot cache / futuro campo JSON — não há coluna ainda
  void opts.citations;
}

/**
 * Substitui o transcript da sessão (após editar/excluir turnos).
 * Delete+insert em sequência — sem coluna de id estável no cliente.
 */
export async function replaceSessionTranscript(
  userId: string,
  sessionId: string,
  messages: { role: "user" | "assistant"; content: string }[],
): Promise<void> {
  const supabase = await createClient();

  const { error: delErr } = await supabase
    .from("transcripts")
    .delete()
    .eq("session_id", sessionId)
    .eq("user_id", userId);

  if (delErr) {
    console.warn("[transcripts] replace delete failed:", delErr.message);
    return;
  }

  if (messages.length === 0) return;

  const rows = messages.map((m) => ({
    session_id: sessionId,
    user_id: userId,
    role: m.role,
    content: m.content,
  }));

  const { error: insErr } = await supabase.from("transcripts").insert(rows);
  if (insErr) {
    console.warn("[transcripts] replace insert failed:", insErr.message);
  }
}
