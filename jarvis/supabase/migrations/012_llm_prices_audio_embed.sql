-- FinOps: preços p/ STT/TTS/embed (aprox. públicos — ajustáveis em /admin/llm)
INSERT INTO llm_prices (model, input_per_1m, output_per_1m, thinking_per_1m) VALUES
  ('gemini-3.1-flash-tts-preview', 0.50, 10.00, 0.00),
  ('gemini-embedding-001',         0.15,  0.00, 0.00),
  ('text-embedding-3-small',       0.02,  0.00, 0.00),
  ('whisper-1',                    0.00,  0.00, 0.00),
  ('tts-1',                        0.00,  0.00, 0.00),
  ('tts-1-hd',                     0.00,  0.00, 0.00)
ON CONFLICT (model) DO UPDATE SET
  input_per_1m = EXCLUDED.input_per_1m,
  output_per_1m = EXCLUDED.output_per_1m,
  thinking_per_1m = EXCLUDED.thinking_per_1m,
  updated_at = now();
