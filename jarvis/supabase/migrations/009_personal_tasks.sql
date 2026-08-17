-- Jarvis — Listas de tarefas pessoais (ADR-016 / Fase A.2)
-- Listas + itens com checklist; RLS por user_id

CREATE TABLE IF NOT EXISTS task_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_lists_user_status
  ON task_lists (user_id, status, updated_at DESC);

CREATE TABLE IF NOT EXISTS task_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES task_lists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_items_list_pos
  ON task_items (list_id, position);

CREATE INDEX IF NOT EXISTS idx_task_items_user
  ON task_items (user_id, created_at DESC);

ALTER TABLE task_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS task_lists_all_own ON task_lists;
CREATE POLICY task_lists_all_own ON task_lists
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS task_items_all_own ON task_items;
CREATE POLICY task_items_all_own ON task_items
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
