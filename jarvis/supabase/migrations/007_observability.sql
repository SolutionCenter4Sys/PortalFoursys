-- Jarvis — Observabilidade (US-12.2): captura de erros de runtime
-- Executar no SQL Editor do Supabase. Requer a função public.is_admin() (migration 006).

-- Falhas de turno (voz/stream), ingestão, etc. — para ver o que quebra em uso real.
CREATE TABLE IF NOT EXISTS app_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  route TEXT NOT NULL,
  message TEXT NOT NULL,
  status INT,
  context JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_app_errors_created ON app_errors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_errors_route ON app_errors(route, created_at DESC);

-- Só o servidor grava (service_role, bypassa RLS). Admins leem pela UI.
ALTER TABLE app_errors ENABLE ROW LEVEL SECURITY;
CREATE POLICY app_errors_admin_read ON app_errors FOR SELECT USING (public.is_admin());
