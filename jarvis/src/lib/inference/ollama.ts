import { inferenceConfig } from "./config";
import type { ChatMessage } from "@/lib/voice/types";

const DEFAULT_SYSTEM_PROMPT = `Você é Jarvis, assistente de voz da Foursys.
Responda em português brasileiro, de forma clara e concisa (2–4 frases).`;

export type { ChatMessage };

export async function chatCompletion(
  userText: string,
  options: {
    history?: ChatMessage[];
    systemPrompt?: string;
  } = {},
): Promise<string> {
  const { history = [], systemPrompt } = options;
  const baseUrl = inferenceConfig.localLlmBaseUrl.replace(/\/$/, "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  const system = systemPrompt ?? DEFAULT_SYSTEM_PROMPT;
  // Temperatura baixa → modelo pequeno erra menos sintaxe (mermaid) e segue
  // melhor as instruções. repeat_penalty evita loops/repetição do 3B.
  const temperature = Number.parseFloat(
    process.env.OLLAMA_TEMPERATURE ?? "0.3",
  );

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: inferenceConfig.localLlmModel,
        messages: [
          { role: "system", content: system },
          ...history,
          { role: "user", content: userText },
        ],
        stream: false,
        temperature: Number.isFinite(temperature) ? temperature : 0.3,
        top_p: 0.9,
        frequency_penalty: 0.3,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Ollama error ${res.status}: ${body}`);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("Ollama returned empty response");
    }
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const base = inferenceConfig.localLlmBaseUrl.replace(/\/v1$/, "");
    const res = await fetch(`${base}/api/tags`, {
      signal: AbortSignal.timeout(5_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
