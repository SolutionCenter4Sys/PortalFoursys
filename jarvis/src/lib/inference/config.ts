/**
 * INFERENCE_PROVIDER controla qual stack de inferência usar:
 *   "local"       — Ollama + Whisper + Piper (requer servidor remoto)
 *   "openai"      — OpenAI completo: Whisper API + GPT-4o-mini + TTS-1
 *   "openai-llm"  — OpenAI só LLM + STT/TTS no browser (sem créditos de áudio)
 *   "gemini"      — Gemini completo: STT + LLM + TTS do Google (alias: "gemini-full")
 *   "gemini-llm"  — Gemini só LLM + STT/TTS no browser
 */
export type InferenceProvider =
  | "local"
  | "openai"
  | "openai-llm"
  | "gemini"
  | "gemini-llm";

function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function resolveProvider(): InferenceProvider {
  const raw = process.env.INFERENCE_PROVIDER?.trim().toLowerCase();
  if (raw === "openai") return "openai";
  if (raw === "openai-llm") return "openai-llm";
  if (raw === "gemini" || raw === "gemini-full") return "gemini";
  if (raw === "gemini-llm") return "gemini-llm";
  // Compatibilidade: se OPENAI_API_KEY set e OPENAI_LLM_ONLY=true, mantém comportamento antigo
  if (!raw && process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_LLM_ONLY === "true" ? "openai-llm" : "openai";
  }
  return "local";
}

export const inferenceConfig = {
  provider: resolveProvider() as InferenceProvider,
  localLlmEnabled: process.env.LOCAL_LLM_ENABLED === "true",
  localLlmBaseUrl: process.env.LOCAL_LLM_BASE_URL ?? "",
  localLlmModel: process.env.LOCAL_LLM_MODEL ?? "llama3.2:3b",
  whisperBaseUrl: process.env.WHISPER_BASE_URL ?? "",
  whisperModel: process.env.WHISPER_MODEL ?? "Systran/faster-whisper-small",
  piperWyomingUrl: process.env.PIPER_WYOMING_URL ?? "",
  voiceGatewayUrl: process.env.VOICE_GATEWAY_URL ?? "",
  voiceDevMode: process.env.VOICE_DEV_MODE !== "false",
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  openAiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  openAiTtsVoice: process.env.OPENAI_TTS_VOICE ?? "nova",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-3.5-flash",
  geminiTtsVoice: process.env.GEMINI_TTS_VOICE ?? "Charon",
  voiceStreamUrl: process.env.VOICE_STREAM_URL ?? "",
};

/** E3 Fase B — streaming full-duplex via Pipecat (WebSocket). */
export function isVoiceStreamingEnabled(): boolean {
  return Boolean(inferenceConfig.voiceStreamUrl.trim());
}

/** US-3.2 — streaming frase-a-frase da resposta do turno (/api/voice/stream).
 *  Só cloud (openai/gemini full). Ligado por padrão (fala começa na 1ª frase);
 *  desative com VOICE_STREAMING=false para cair no turno single-shot. */
export function isAudioStreamingEnabled(): boolean {
  return process.env.VOICE_STREAMING !== "false";
}

export function isVoiceGatewayEnabled(): boolean {
  return inferenceConfig.provider === "local" &&
    Boolean(inferenceConfig.voiceGatewayUrl.trim());
}

/** Retorna true para qualquer provider OpenAI (openai ou openai-llm). */
export function isOpenAiMode(): boolean {
  return inferenceConfig.provider === "openai" || inferenceConfig.provider === "openai-llm";
}

/** Retorna true apenas para openai-llm (STT + TTS ficam no browser). */
export function isOpenAiLlmOnly(): boolean {
  return inferenceConfig.provider === "openai-llm";
}

/** Retorna true para qualquer provider Gemini (gemini ou gemini-llm). */
export function isGeminiMode(): boolean {
  return inferenceConfig.provider === "gemini" || inferenceConfig.provider === "gemini-llm";
}

/** Pipeline Gemini completo (STT + LLM + TTS do Google). */
export function isGeminiFull(): boolean {
  return inferenceConfig.provider === "gemini";
}

/** Gemini só LLM (STT + TTS ficam no browser). */
export function isGeminiLlmOnly(): boolean {
  return inferenceConfig.provider === "gemini-llm";
}

/** Qualquer modo "só LLM" (áudio no browser) — openai-llm ou gemini-llm. */
export function isLlmOnlyMode(): boolean {
  return isOpenAiLlmOnly() || isGeminiLlmOnly();
}

/**
 * Modo ancorado (RAG-only): o LLM responde SÓ com base no contexto fixo, nos
 * fatos Foursys e nas fontes recuperadas — sem conhecimento geral/internet.
 * Default ligado; desative com LLM_RAG_ONLY=false.
 */
export function isRagOnly(): boolean {
  return process.env.LLM_RAG_ONLY !== "false";
}

/** Valida se o provider informado tem as credenciais/URLs necessárias no .env.
 *  As chaves de API NUNCA vão para o banco — só o provider/params são dinâmicos. */
export function assertProviderReady(provider: InferenceProvider) {
  if (provider === "openai" || provider === "openai-llm") {
    required("OPENAI_API_KEY", inferenceConfig.openAiApiKey);
    return;
  }
  if (provider === "gemini" || provider === "gemini-llm") {
    required("GEMINI_API_KEY", inferenceConfig.geminiApiKey);
    return;
  }
  if (isVoiceGatewayEnabled()) {
    required("VOICE_GATEWAY_URL", inferenceConfig.voiceGatewayUrl);
    return;
  }
  required("LOCAL_LLM_BASE_URL", inferenceConfig.localLlmBaseUrl);
  required("WHISPER_BASE_URL", inferenceConfig.whisperBaseUrl);
  required("PIPER_WYOMING_URL", inferenceConfig.piperWyomingUrl);
}

export function assertInferenceConfig() {
  assertProviderReady(inferenceConfig.provider);
}
