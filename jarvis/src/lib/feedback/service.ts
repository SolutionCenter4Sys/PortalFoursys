import { createClient } from "@/lib/supabase/server";

/** Registra feedback 👍/👎 de uma resposta (sinal para curar RAG/few-shot). */
export async function saveFeedback(opts: {
  userId: string;
  sessionId?: string | null;
  userQuestion?: string;
  assistantAnswer?: string;
  rating: 1 | -1;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("message_feedback").insert({
    user_id: opts.userId,
    session_id: opts.sessionId ?? null,
    user_question: opts.userQuestion?.slice(0, 2000) ?? null,
    assistant_answer: opts.assistantAnswer?.slice(0, 4000) ?? null,
    rating: opts.rating,
  });
  if (error) console.warn("[feedback] insert failed:", error.message);
}
