-- Jarvis — Assistente pessoal: kind=note em user_memories
-- Extende o CHECK de 005 para permitir notas explícitas ("anota que…")

ALTER TABLE user_memories
  DROP CONSTRAINT IF EXISTS user_memories_kind_check;

ALTER TABLE user_memories
  ADD CONSTRAINT user_memories_kind_check
  CHECK (kind IN ('fact', 'preference', 'context', 'note'));
