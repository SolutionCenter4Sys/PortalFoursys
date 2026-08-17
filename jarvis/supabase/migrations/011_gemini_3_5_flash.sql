-- Jarvis — Gemini 3.5 Flash (LLM/STT) + TTS 3.1 (modelo TTS real da API)
-- Nota: NÃO existe gemini-3.5-flash-preview-tts. TTS suportados (ListModels):
--   gemini-2.5-flash-preview-tts | gemini-2.5-pro-preview-tts | gemini-3.1-flash-tts-preview

INSERT INTO llm_prices (model, input_per_1m, output_per_1m, thinking_per_1m)
VALUES
  ('gemini-3.5-flash', 1.50, 9.00, 9.00),
  ('gemini-3.1-flash-tts-preview', 0.15, 6.00, 0.00)
ON CONFLICT (model) DO UPDATE SET
  input_per_1m = EXCLUDED.input_per_1m,
  output_per_1m = EXCLUDED.output_per_1m,
  thinking_per_1m = EXCLUDED.thinking_per_1m,
  updated_at = now();

-- Remove preço fantasma se alguém cadastrou o ID inválido
DELETE FROM llm_prices WHERE model = 'gemini-3.5-flash-preview-tts';

UPDATE llm_settings
SET
  config = jsonb_set(
    jsonb_set(
      jsonb_set(
        COALESCE(config, '{}'::jsonb),
        '{gemini,model}',
        '"gemini-3.5-flash"'::jsonb,
        true
      ),
      '{gemini,sttModel}',
      '"gemini-3.5-flash"'::jsonb,
      true
    ),
    '{gemini,ttsModel}',
    '"gemini-3.1-flash-tts-preview"'::jsonb,
    true
  ),
  updated_at = now()
WHERE id = 1;
