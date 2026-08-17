-- Jarvis — Governança de LLMs (Fase 3): config dinâmica + FinOps
-- Executar no SQL Editor do Supabase ou via supabase db push
--
-- Entrega:
--   1. profiles.is_admin        — quem gerencia LLMs e vê consumo
--   2. llm_settings (singleton) — provider ativo + parâmetros por provider (hot reload)
--   3. llm_prices               — preço por modelo (US$/1M tokens) p/ custo estimado
--   4. llm_calls                — log imutável de consumo por turno (tokens, custo, latência)

-- ─── 1. Admin flag ──────────────────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- Admins podem ler o is_admin de qualquer perfil (necessário p/ policies abaixo).
-- SECURITY DEFINER evita recursão de RLS ao checar o próprio flag.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_admin FROM profiles WHERE id = auth.uid()), false);
$$;

-- ─── 2. Configuração de LLM (linha única) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS llm_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  provider TEXT NOT NULL DEFAULT 'gemini'
    CHECK (provider IN ('local', 'openai', 'openai-llm', 'gemini', 'gemini-llm')),
  -- parâmetros por provider (model, maxTokens, temperature, thinkingBudget, vozes…)
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- linha única inicial (valores herdam do .env se ausentes no config)
INSERT INTO llm_settings (id, provider, config)
VALUES (1, COALESCE(NULLIF(current_setting('app.default_provider', true), ''), 'gemini'), '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ─── 3. Preços por modelo (US$/1M tokens) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS llm_prices (
  model TEXT PRIMARY KEY,
  input_per_1m NUMERIC NOT NULL DEFAULT 0,
  output_per_1m NUMERIC NOT NULL DEFAULT 0,
  -- tokens de "thinking" (Gemini 2.5) — cobrados como saída por padrão
  thinking_per_1m NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- seed com preços públicos aproximados (ajustáveis pela UI)
INSERT INTO llm_prices (model, input_per_1m, output_per_1m, thinking_per_1m) VALUES
  ('gpt-4o-mini',       0.15,  0.60,  0.00),
  ('gpt-4o',           2.50, 10.00,  0.00),
  ('gemini-2.5-flash', 0.30,  2.50,  2.50),
  ('gemini-2.5-pro',   1.25, 10.00, 10.00)
ON CONFLICT (model) DO NOTHING;

-- ─── 4. Log de consumo (imutável) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS llm_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  model TEXT,
  intent TEXT,
  prompt_tokens INT NOT NULL DEFAULT 0,
  completion_tokens INT NOT NULL DEFAULT 0,
  thinking_tokens INT NOT NULL DEFAULT 0,
  total_tokens INT NOT NULL DEFAULT 0,
  cost_usd NUMERIC NOT NULL DEFAULT 0,
  latency_ms INT NOT NULL DEFAULT 0,
  cache_hit BOOLEAN NOT NULL DEFAULT false,
  voice_mode TEXT
);

CREATE INDEX IF NOT EXISTS idx_llm_calls_created ON llm_calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_llm_calls_model ON llm_calls(model, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_llm_calls_user ON llm_calls(user_id, created_at DESC);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
-- Escrita/leitura server-side usa a service_role key (bypassa RLS). As policies
-- abaixo liberam LEITURA/edição pela UI apenas para admins.
ALTER TABLE llm_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY llm_settings_admin_read ON llm_settings FOR SELECT USING (public.is_admin());
CREATE POLICY llm_settings_admin_write ON llm_settings FOR UPDATE USING (public.is_admin());

CREATE POLICY llm_prices_admin_read ON llm_prices FOR SELECT USING (public.is_admin());
CREATE POLICY llm_prices_admin_write ON llm_prices FOR UPDATE USING (public.is_admin());

CREATE POLICY llm_calls_admin_read ON llm_calls FOR SELECT USING (public.is_admin());
-- sem policy de INSERT/UPDATE/DELETE p/ usuários: log é imutável e só o servidor grava (service_role).
