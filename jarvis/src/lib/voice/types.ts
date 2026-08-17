import type { NotesChanged } from "@/lib/memory/service";
import type { JarvisIntent } from "@/lib/jarvis-context";

import type { RagCitation } from "@/lib/rag/query";
import type { TasksChanged } from "@/lib/tasks/service";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  citations?: RagCitation[];
  /** true quando o usuário interrompeu a resposta do Jarvis */
  interrupted?: boolean;
  /** conteúdos gravados em user_memories neste turno */
  memoriesSaved?: string[];
  /** listas/itens alterados neste turno (ADR-016) */
  tasksChanged?: TasksChanged[];
  /** notas apagadas/editadas neste turno */
  notesChanged?: NotesChanged[];
  /** epoch ms — exibido no hover do transcript */
  timestamp?: number;
};

export type VoiceOrbState =
  | "idle"
  | "standby"
  | "armed"
  | "listening"
  | "processing"
  | "speaking"
  | "interrupted"
  | "error";

/** standby = aguardando "Olá Jarvis" · armed = pronto para comando */
export type WakePhase = "off" | "standby" | "armed";

/**
 * Sub-fase do turno enquanto o orb está em "processing"/"speaking".
 * Dá feedback granular no hint (percepção de fluidez):
 * transcribing → searching → thinking → speaking.
 * `null` quando não há turno em andamento.
 */
export type TurnPhase =
  | "transcribing"
  | "searching"
  | "thinking"
  | "switching"
  | "speaking"
  | null;

export type TurnMessage = ChatMessage;

export type VoiceTurnResponse = {
  transcript: string;
  rawTranscript?: string;
  assistantText: string;
  audioBase64: string;
  audioMimeType: string;
  /** "browser" = cliente deve usar speechSynthesis; "audio" = reproduzir audioBase64 */
  ttsProvider?: "browser" | "audio";
  voiceMode: "oss_turn";
  intent?: JarvisIntent;
  citations?: RagCitation[];
  /** true quando a resposta veio do cache semântico TokenOps */
  cacheHit?: boolean;
  /** B4 — exact (hash) | semantic (cosine) */
  cacheKind?: "exact" | "semantic";
  /** B5 — família/modelo escolhidos pelo router */
  llmRoute?: {
    family: "gemini" | "openai";
    model: string;
    reason: string;
  };
  /** fatos/notas gravados neste turno (chip UI) */
  memoriesSaved?: string[];
  /** mutações de tarefas neste turno */
  tasksChanged?: TasksChanged[];
  /** mutações de notas (apagar/editar) neste turno */
  notesChanged?: NotesChanged[];
  /** job submetido ao Local Agent Bridge (ADR-015) */
  agentJob?: {
    id: string;
    status: string;
    prompt?: string;
  };
  /** TokenOps PLUS — sugestões preditivas (widget nextSteps) */
  suggestedNext?: string[];
  latencyMs: {
    stt: number;
    llm: number;
    tts: number;
    total: number;
  };
};
