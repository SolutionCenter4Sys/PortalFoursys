-- Jarvis — Memória por usuário (mem0-style) + Feedback de respostas (Fase 2)
-- Executar no SQL Editor do Supabase ou via supabase db push

-- ─── Memória por usuário ────────────────────────────────────────────────────
-- Fatos/preferências extraídos das conversas, injetados no contexto do LLM.
-- Opt-in por usuário via profiles.prefs.memoryEnabled.
CREATE TABLE user_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'fact' CHECK (kind IN ('fact', 'preference', 'context')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_memories_user ON user_memories(user_id, created_at DESC);

-- ─── Feedback de respostas (👍/👎) ──────────────────────────────────────────
-- Sinal para curar RAG / few-shot no futuro. rating: 1 = útil, -1 = ruim.
CREATE TABLE message_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  user_question TEXT,
  assistant_answer TEXT,
  rating SMALLINT NOT NULL CHECK (rating IN (-1, 1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_message_feedback_user ON message_feedback(user_id, created_at DESC);
CREATE INDEX idx_message_feedback_rating ON message_feedback(rating, created_at DESC);

-- RLS — cada usuário só acessa o próprio
ALTER TABLE user_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_memories_all_own ON user_memories FOR ALL USING (user_id = auth.uid());
CREATE POLICY message_feedback_all_own ON message_feedback FOR ALL USING (user_id = auth.uid());
