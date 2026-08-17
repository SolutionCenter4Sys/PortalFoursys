import { NextResponse } from "next/server";

import {
  assertInferenceConfig,
  assertProviderReady,
  isVoiceGatewayEnabled,
  isRagOnly,
  inferenceConfig,
} from "@/lib/inference/config";
import {
  getLlmSettings,
  isOpenAi,
  isOpenAiLlmOnly,
  isGeminiFull,
  isGeminiLlmOnly,
  isLlmOnly,
} from "@/lib/llm/settings";
import { resolveLlmRoute, type LlmRoute } from "@/lib/llm/model-router";
import {
  llmCompletionTimeoutMs,
  runWithLlmFallback,
  withLlmTimeout,
} from "@/lib/llm/llm-fallback";
import { recordLlmCall, EMPTY_USAGE, type LlmUsage } from "@/lib/llm/usage";
import { toSpeechText } from "@/lib/voice/speech-text";
import { isLikelyEcho } from "@/lib/voice/echo-guard";
import { recordError } from "@/lib/observability/errors";
import {
  gatewayChatTts,
  gatewayStt,
} from "@/lib/inference/gateway";
import { chatCompletion, checkOllamaHealth } from "@/lib/inference/ollama";
import { checkPiperHealth, synthesizeSpeech } from "@/lib/inference/piper";
import { checkWhisperHealth, transcribeAudio } from "@/lib/inference/whisper";
import {
  chatCompletionOpenAI,
  synthesizeSpeechOpenAI,
  transcribeAudioOpenAI,
  isOpenAiAvailable,
} from "@/lib/inference/openai-provider";
import {
  chatCompletionGemini,
  transcribeAudioGemini,
} from "@/lib/inference/gemini-provider";
import { synthesizeCloudSpeech, preferredCloudTts } from "@/lib/inference/tts-pipeline";
import { buildSystemPrompt } from "@/lib/jarvis-context";
import { matchInstitutionalFaq } from "@/lib/portal/institutional-faq";
import { getUserDisplayName } from "@/lib/profile/display-name";
import { hitsToCitations, ragQuery, shouldUseRag } from "@/lib/rag/query";
import type { RagCitation } from "@/lib/rag/query";
import { appendSessionMessages } from "@/lib/redis/session-cache";
import { isVoiceAuthRequired } from "@/lib/supabase/config";
import { logHarnessAudit, runHarness } from "@/lib/tokenops/harness";
import {
  buildPredictiveSuggestions,
  formatPredictiveBlock,
} from "@/lib/tokenops/predictive";
import {
  canUseSemanticCacheHit,
  lookupSemanticCache,
  warnSemanticCacheIfMissing,
  writeSemanticCache,
} from "@/lib/tokenops/semantic-cache";
import { saveTranscriptTurn } from "@/lib/transcripts/service";
import {
  applyNoteMutations,
  extractMemories,
  formatMemoryAck,
  formatMemoryBlock,
  formatNotesAck,
  getUserMemories,
  isMemoryEnabled,
  looksLikeNoteMutation,
  saveMemories,
  stripRedundantMemoryAck,
  type NotesChanged,
} from "@/lib/memory/service";
import {
  applyTaskIntents,
  formatTasksAck,
  getTasksPromptBlock,
  isTasksEnabled,
  looksLikeTaskIntent,
  type TasksChanged,
} from "@/lib/tasks/service";
import {
  assertVoiceAllowed,
  AuthRequiredError,
  getAuthenticatedUserId,
  recordVoiceMinutes,
  UsageLimitError,
} from "@/lib/usage/service";

import type { ChatMessage, VoiceTurnResponse } from "@/lib/voice/types";
import {
  agentApproveAck,
  approveAgentJob,
  createAgentJob,
  looksLikeAgentApproveIntent,
  looksLikeAgentWriteIntent,
  resolveWorkspaceAlias,
} from "@/lib/agent/bridge-client";

// Deve exceder a soma dos timeouts sequenciais dos providers no path OSS direto
// (whisper 90s + ollama 60s + piper 45s = 195s), senão um turno lento porém
// legítimo é morto no meio antes dos próprios timeouts dispararem.
export const maxDuration = 210;
export const runtime = "nodejs";

function parseHistory(raw: FormDataEntryValue | null): ChatMessage[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string",
    );
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  const started = Date.now();

  // Settings dinâmicas (banco → .env). Definem o provider ATIVO deste turno.
  const llm = await getLlmSettings();
  try {
    assertProviderReady(llm.provider);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Config error" },
      { status: 500 },
    );
  }

  const form = await request.formData();
  const audio = form.get("audio");
  const history = parseHistory(form.get("history"));
  const clientTranscript = form.get("transcript");
  const sessionIdRaw = form.get("sessionId");
  const sessionId =
    typeof sessionIdRaw === "string" && sessionIdRaw.trim()
      ? sessionIdRaw.trim()
      : null;
  const pendingAgentJobIdRaw = form.get("pendingAgentJobId");
  const pendingAgentJobId =
    typeof pendingAgentJobIdRaw === "string" && pendingAgentJobIdRaw.trim()
      ? pendingAgentJobIdRaw.trim()
      : null;
  const surfaceRaw = form.get("surface");
  const portalMode =
    typeof surfaceRaw === "string" &&
    surfaceRaw.trim().toLowerCase() === "portal";

  const hasClientTranscript =
    typeof clientTranscript === "string" && clientTranscript.trim().length > 0;

    // Modo LLM-only (openai-llm / gemini-llm): exige transcript do browser
  if (isLlmOnly(llm) && !hasClientTranscript) {
    return NextResponse.json(
      { error: "Modo LLM-only: envie 'transcript' capturado pelo browser" },
      { status: 400 },
    );
  }

  if (!(audio instanceof Blob) && !hasClientTranscript) {
    return NextResponse.json(
      { error: "Campo 'audio' ou 'transcript' obrigatório" },
      { status: 400 },
    );
  }

  let buffer = Buffer.alloc(0);
  let mimeType = "audio/wav";
  let ext = "wav";

  if (audio instanceof Blob) {
    mimeType = audio.type || "audio/webm";
    ext = mimeType.includes("wav")
      ? "wav"
      : mimeType.includes("ogg")
        ? "ogg"
        : "webm";
    buffer = Buffer.from(await audio.arrayBuffer());
    if (buffer.length === 0 && !hasClientTranscript) {
      return NextResponse.json({ error: "Áudio vazio" }, { status: 400 });
    }
  }

  try {
    const userId = await getAuthenticatedUserId();
    if (isVoiceAuthRequired()) {
      if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      await assertVoiceAllowed(userId);
    }

    const sttStart = Date.now();
    let rawTranscript: string;
    let sttMs: number;

    if (hasClientTranscript) {
      rawTranscript = (clientTranscript as string).trim();
      sttMs = 0;
    } else if (
      portalMode &&
      !isOpenAi(llm) &&
      isOpenAiAvailable() &&
      process.env.PORTAL_STT_PREFER !== "gemini"
    ) {
      // Portal: Whisper (OpenAI) primeiro — mais rápido que Gemini STT.
      try {
        rawTranscript = await transcribeAudioOpenAI(buffer, `turn.${ext}`, mimeType, {
          meter: { userId, voiceMode: "oss_turn" },
        });
      } catch {
        rawTranscript = "";
      }
      if (!rawTranscript && isGeminiFull(llm)) {
        rawTranscript = await transcribeAudioGemini(buffer, `turn.${ext}`, mimeType, {
          model: llm.gemini.sttModel,
          meter: { userId, voiceMode: "oss_turn" },
        });
      }
      sttMs = Date.now() - sttStart;
    } else if (isOpenAi(llm)) {
      rawTranscript = await transcribeAudioOpenAI(buffer, `turn.${ext}`, mimeType, {
        meter: { userId, voiceMode: "oss_turn" },
      });
      sttMs = Date.now() - sttStart;
    } else if (isGeminiFull(llm)) {
      rawTranscript = await transcribeAudioGemini(buffer, `turn.${ext}`, mimeType, {
        model: llm.gemini.sttModel,
        meter: { userId, voiceMode: "oss_turn" },
      });
      sttMs = Date.now() - sttStart;
    } else if (isVoiceGatewayEnabled()) {
      const stt = await gatewayStt(buffer, `turn.${ext}`, mimeType);
      rawTranscript = stt.transcript;
      sttMs = stt.sttMs || Date.now() - sttStart;
    } else {
      rawTranscript = await transcribeAudio(buffer, `turn.${ext}`, mimeType);
      sttMs = Date.now() - sttStart;
    }

    if (!rawTranscript) {
      return NextResponse.json(
        { error: "Não foi possível transcrever o áudio" },
        { status: 422 },
      );
    }

    const harness = await runHarness({
      rawTranscript,
      history,
      userId,
    });

    // Anti-eco (Portal): descarta a própria saudação/resposta captada pelo mic.
    if (portalMode && isLikelyEcho(harness.transcript, history)) {
      console.info("[voice/turn] echo descartado:", harness.transcript.slice(0, 60));
      return NextResponse.json({ echo: true }, { status: 409 });
    }

    // Portal: FAQ institucional responde na hora (sem RAG/LLM/memória) → latência mínima.
    if (portalMode && !harness.blocked && !harness.rateLimited) {
      const faqHit = matchInstitutionalFaq(harness.transcript);
      if (faqHit) {
        const assistantText = faqHit.answer;
        let audioBase64 = "";
        let audioMimeType = "";
        let ttsProvider: "browser" | "audio" = "browser";
        let ttsMs = 0;
        if (!isOpenAiLlmOnly(llm) && !isGeminiLlmOnly(llm)) {
          try {
            const ttsStart = Date.now();
            const ttsOut = await synthesizeCloudSpeech(toSpeechText(assistantText), {
              prefer: preferredCloudTts("portal"),
              gemini: { voice: llm.gemini.ttsVoice, model: llm.gemini.ttsModel },
              openai: { voice: llm.openai.ttsVoice, model: llm.openai.ttsModel },
              meter: { userId, voiceMode: "oss_turn" },
              geminiTimeoutMs: 3_500,
              // FAQ = texto fixo → cache (respostas institucionais instantâneas).
              cache: true,
            });
            audioBase64 = ttsOut.audio.toString("base64");
            audioMimeType = ttsOut.mimeType;
            ttsProvider = "audio";
            ttsMs = Date.now() - ttsStart;
          } catch {
            /* browser TTS fallback */
          }
        }
        const total = Date.now() - started;
        console.info(
          `[portal/faq] HIT id=${faqHit.id} score=${faqHit.score.toFixed(2)} total=${total}ms`,
        );
        return NextResponse.json(
          {
            transcript: harness.transcript,
            assistantText,
            audioBase64,
            audioMimeType,
            ttsProvider,
            voiceMode: "oss_turn",
            intent: harness.intent,
            latencyMs: { stt: sttMs, llm: 0, tts: ttsMs, total },
          } satisfies VoiceTurnResponse,
          { status: 200 },
        );
      }
    }

    if (harness.blocked || harness.rateLimited) {
      const assistantText =
        harness.blockReason ??
        "Não posso processar esse pedido agora. Reformule sem dados sensíveis.";
      const total = Date.now() - started;
      logHarnessAudit({
        intent: harness.intent,
        transcript: harness.transcript,
        latencyMs: total,
        voiceMode: "oss_turn",
        blocked: harness.blocked,
        rateLimited: harness.rateLimited,
      });
      return NextResponse.json(
        {
          transcript: harness.transcript,
          assistantText,
          audioBase64: "",
          audioMimeType: "",
          ttsProvider: "browser",
          voiceMode: "oss_turn",
          intent: harness.intent,
          latencyMs: { stt: sttMs, llm: 0, tts: 0, total },
        } satisfies VoiceTurnResponse,
        { status: harness.blocked ? 422 : 429 },
      );
    }

    // ADR-015 — aprovação write por voz ("autorizado", "pode executar", …)
    if (pendingAgentJobId && looksLikeAgentApproveIntent(harness.transcript)) {
      const approved = await approveAgentJob(pendingAgentJobId);
      const assistantText = agentApproveAck(Boolean(approved));
      let audioWav: Buffer = Buffer.alloc(0);
      let audioMimeType = "";
      let ttsProvider: "browser" | "audio" = "browser";
      let ttsMs = 0;

      if (!isOpenAiLlmOnly(llm) && !isGeminiLlmOnly(llm)) {
        const ttsStart = Date.now();
        try {
          if (isGeminiFull(llm) || isOpenAi(llm)) {
            const ttsOut = await synthesizeCloudSpeech(toSpeechText(assistantText), {
              prefer: preferredCloudTts(portalMode ? "portal" : "app"),
              gemini: { voice: llm.gemini.ttsVoice, model: llm.gemini.ttsModel },
              openai: { voice: llm.openai.ttsVoice, model: llm.openai.ttsModel },
              meter: { userId, voiceMode: "oss_turn" },
              geminiTimeoutMs: portalMode ? 3_500 : undefined,
            });
            audioWav = ttsOut.audio;
            audioMimeType = ttsOut.mimeType;
            ttsProvider = "audio";
          }
        } catch {
          /* browser TTS fallback */
        }
        ttsMs = Date.now() - ttsStart;
      }

      const total = Date.now() - started;
      if (userId) await recordVoiceMinutes(userId, total / 1000);
      if (userId && sessionId) {
        void saveTranscriptTurn({
          userId,
          sessionId,
          userText: harness.transcript,
          assistantText,
        });
        void appendSessionMessages(sessionId, [
          { role: "user", content: harness.transcript },
          { role: "assistant", content: assistantText },
        ]);
      }

      const payload: VoiceTurnResponse = {
        transcript: harness.transcript,
        rawTranscript:
          rawTranscript !== harness.transcript ? rawTranscript : undefined,
        assistantText,
        audioBase64: audioWav.toString("base64"),
        audioMimeType,
        ttsProvider,
        voiceMode: "oss_turn",
        intent: "code",
        agentJob: {
          id: pendingAgentJobId,
          status: approved?.status ?? "awaiting_approval",
          prompt: harness.transcript,
        },
        latencyMs: { stt: sttMs, llm: 0, tts: ttsMs, total },
      };
      return NextResponse.json(payload);
    }

    let ragContext: string | undefined;
    let citations: RagCitation[] | undefined;

    // Portal: FAQ in-process curto-circuita as comuns; pro resto o RAG usa o índice
    // rico quando é knowledge/foursys OU casa tópicos institucionais/nomes de cliente.
    const portalDeepKeywords =
      /\b(santander|shi|ita[uú]|bradesco|equifax|it\s*forum|case|briefing|cio|linkedin|homologad|nexus|servi[cç]|oferta|solu[cç][aã]o|inova|delivery|squad|ciberseg|seguran[cç]a|lgpd|bacen|dados|analytics|databricks|moderniza|legado|cobol|qualidade|teste|rpa|automa[cç]|cloud|finops|fourblox|fourmakers|alian[cç]a|parceria|esg|certifica|iso|talento|turnover|trajet[oó]ria|hist[oó]ria|presen[cç]a|global)\b/i;
    const portalNeedsDeepRag =
      portalMode &&
      process.env.PORTAL_RAG !== "false" &&
      (shouldUseRag(harness.intent, harness.transcript, harness.history) ||
        portalDeepKeywords.test(harness.transcript));
    const ragEligible =
      process.env.RAG_ENABLED !== "false" &&
      (portalMode
        ? portalNeedsDeepRag
        : shouldUseRag(harness.intent, harness.transcript, harness.history));

    // B4 — cache lookup ∥ RAG (aplica hit só se sem ragContext / side-effect)
    warnSemanticCacheIfMissing("/api/voice/turn");
    const cacheLookupP =
      harness.intent === "code"
        ? Promise.resolve(null)
        : lookupSemanticCache(harness.transcript);

    const ragP = (async () => {
      if (!ragEligible) return;
      const ragQ = /\bfoursys\b/i.test(harness.transcript)
        ? harness.transcript
        : `Foursys — ${harness.transcript}`;
      // Portal: RAG lean (só portal-foursys, topK 3, sem agentes)
      const rag = await ragQuery(ragQ, portalMode ? { lean: true } : {});
      if (rag.hits.length > 0) {
        ragContext = rag.contextBlock;
        citations = hitsToCitations(rag.hits);
      }
    })();

    const [cacheLookup] = await Promise.all([cacheLookupP, ragP]);

    // Memória + tarefas — opt-out. Portal não usa assistente pessoal → pula tudo.
    const memEnabled = !portalMode && userId ? await isMemoryEnabled(userId) : false;
    const tasksEnabled = !portalMode && userId ? await isTasksEnabled(userId) : false;
    let memoriesSaved: string[] = [];
    let tasksChanged: TasksChanged[] = [];
    let notesChanged: NotesChanged[] = [];
    let tasksSaveNote: string | undefined;
    if (userId && tasksEnabled) {
      // tenta transcript normalizado e raw (STT às vezes diverge)
      let tr = await applyTaskIntents(userId, harness.transcript);
      if (
        tr.changed.length === 0 &&
        rawTranscript !== harness.transcript
      ) {
        tr = await applyTaskIntents(userId, rawTranscript);
      }
      tasksChanged = tr.changed;
      if (
        tasksChanged.length === 0 &&
        (tr.intents.length > 0 ||
          looksLikeTaskIntent(harness.transcript) ||
          looksLikeTaskIntent(rawTranscript))
      ) {
        tasksSaveNote =
          "FALHA DE GRAVAÇÃO: o sistema NÃO salvou nenhuma tarefa neste turno. NÃO diga que adicionou/criou. Diga em 1 frase que não conseguiu gravar e peça para repetir ou usar Configurações → Minhas tarefas.";
        console.warn("[tasks] save missed", {
          intents: tr.intents,
          error: tr.error,
          transcript: harness.transcript.slice(0, 160),
        });
      }
    }
    if (userId && memEnabled) {
      let nr = await applyNoteMutations(userId, harness.transcript);
      if (
        nr.changed.length === 0 &&
        rawTranscript !== harness.transcript &&
        looksLikeNoteMutation(rawTranscript)
      ) {
        nr = await applyNoteMutations(userId, rawTranscript);
      }
      notesChanged = nr.changed;

      let items = extractMemories(harness.transcript);
      if (
        looksLikeTaskIntent(harness.transcript) ||
        looksLikeTaskIntent(rawTranscript) ||
        tasksChanged.length > 0 ||
        looksLikeNoteMutation(harness.transcript) ||
        looksLikeNoteMutation(rawTranscript) ||
        notesChanged.length > 0
      ) {
        items = items.filter((i) => i.kind !== "note");
      }
      memoriesSaved = await saveMemories(userId, items);
    }
    const memoriesForPrompt = memEnabled
      ? await getUserMemories(userId!)
      : [];
    const memoryBlock = memEnabled
      ? formatMemoryBlock(memoriesForPrompt)
      : undefined;
    let tasksBlock =
      tasksEnabled && userId ? await getTasksPromptBlock(userId) : undefined;
    if (tasksSaveNote) {
      tasksBlock = `${tasksBlock ? `${tasksBlock}\n\n` : ""}${tasksSaveNote}`;
    }
    // applyTaskIntents corre ANTES do prompt → item já sai das pendentes.
    // Sem esta nota o LLM vê a lista sem o item e inventa "não encontrei".
    if (tasksChanged.length > 0) {
      const ack = formatTasksAck(tasksChanged);
      tasksBlock = `${tasksBlock ? `${tasksBlock}\n\n` : ""}AÇÃO DESTE TURNO (já gravada no banco — baseia a resposta nisto; NÃO digas que não encontraste, que falhou, nem que vais adicionar de novo): ${ack}`;
    }
    if (notesChanged.length > 0) {
      const ack = formatNotesAck(notesChanged);
      tasksBlock = `${tasksBlock ? `${tasksBlock}\n\n` : ""}AÇÃO DESTE TURNO (notas — já gravada no banco): ${ack}`;
    }

    // TokenOps PLUS — preditivo leve (memórias + tarefas + transcript)
    const suggestedNext = buildPredictiveSuggestions({
      memories: memoriesForPrompt,
      tasksBlock,
      transcript: harness.transcript,
    });
    const predictiveBlock = formatPredictiveBlock(suggestedNext);

    // ADR-015 — submete job cedo p/ o LLM saber e o widget aparecer
    let agentJob: VoiceTurnResponse["agentJob"];
    let agentBridgeNote = "";
    if (harness.intent === "code") {
      const wantsWrite = looksLikeAgentWriteIntent(harness.transcript);
      const workspace = resolveWorkspaceAlias(harness.transcript);
      const job = await createAgentJob({
        prompt: harness.transcript,
        workspace,
        // write → bridge fica em awaiting_approval até o botão no Contexto
        mode: wantsWrite ? "write" : "read",
      });
      if (job) {
        agentJob = {
          id: job.id,
          status: job.status,
          prompt: harness.transcript,
        };
        agentBridgeNote = wantsWrite
          ? `AGENT BRIDGE (write pendente): job ${job.id} no workspace "${job.workspace ?? workspace}" (${job.cwd ?? "cwd default"}). Diz ao utilizador para aprovar por voz ("autorizado", "pode executar", "aprova") OU clicar em "Aprovar write" no Contexto — sem isso o agente NÃO cria/altera ficheiros. Paths relativos ao workspace; não peças caminho absoluto. NÃO digas que não tens acesso ao filesystem.`
          : `AGENT BRIDGE (ativo): job ${job.id} no workspace "${job.workspace ?? workspace}" (${job.cwd ?? "cwd default"}). Confirma que logs estão no Contexto. Paths relativos ao workspace. NÃO digas que não tens acesso ao filesystem.`;
      } else {
        agentBridgeNote =
          "AGENT BRIDGE (offline): não foi possível contactar http://127.0.0.1:8787. Diz ao utilizador para iniciar o agent-bridge e verificar AGENT_BRIDGE_* no .env.local.";
      }
    }

    const userDisplayName = !portalMode && userId ? await getUserDisplayName(userId) : null;

    const systemPrompt = buildSystemPrompt(
      harness.intent,
      harness.intent === "code" ? undefined : ragContext,
      memoryBlock,
      // modo ancorado RAG bloqueia filesystem — desliga em intent code.
      // No Portal, grounded=false: Jarvis fala como dono do conhecimento (sem citar fonte).
      harness.intent === "code" || portalMode ? false : isRagOnly(),
      [tasksBlock, predictiveBlock, agentBridgeNote].filter(Boolean).join("\n\n") ||
        undefined,
      userDisplayName,
      portalMode ? "portal" : "app",
    );

    // B4 — aplica hit só sem RAG e sem mutações deste turno
    const cached =
      cacheLookup &&
      canUseSemanticCacheHit({
        intent: harness.intent,
        ragContext,
        tasksChanged: tasksChanged.length,
        notesChanged: notesChanged.length,
        memoriesSaved: memoriesSaved.length,
      })
        ? cacheLookup
        : null;
    const cacheHit = cached !== null;
    const cacheKind = cached?.kind;

    let assistantText: string;
    let llmMs = 0;
    let ttsMs = 0;
    let audioWav: Buffer = Buffer.alloc(0);
    let audioMimeType = "audio/wav";
    let ttsProvider: "browser" | "audio" = "audio";
    // FinOps: uso e modelo do LLM deste turno (para gravar em llm_calls)
    let usage: LlmUsage = EMPTY_USAGE;
    let llmModel = inferenceConfig.localLlmModel;

    // B5/B7 — router + timeout/fallback (STT/TTS = pipeline)
    let llmRoute = resolveLlmRoute(llm, {
      intent: harness.intent,
      transcript: harness.transcript,
    });

    const cloudPipeline =
      isLlmOnly(llm) || isGeminiFull(llm) || isOpenAi(llm);

    if (cloudPipeline) {
      llmModel = llmRoute.model;
      if (cached) {
        assistantText = cached.assistantText;
      } else {
        const timeoutMs = llmCompletionTimeoutMs();
        const runOnce = async (route: LlmRoute) => {
          if (route.family === "gemini") {
            return withLlmTimeout(
              chatCompletionGemini(harness.transcript, {
                history: harness.history,
                systemPrompt,
                model: llm.gemini.model,
                maxTokens: llm.gemini.maxTokens,
                temperature: llm.gemini.temperature,
                thinkingBudget: llm.gemini.thinkingBudget,
              }),
              timeoutMs,
              "completion",
            );
          }
          return withLlmTimeout(
            chatCompletionOpenAI(harness.transcript, {
              history: harness.history,
              systemPrompt,
              model: llm.openai.model,
              maxTokens: llm.openai.maxTokens,
              temperature: llm.openai.temperature,
            }),
            timeoutMs,
            "completion",
          );
        };

        const llmStart = Date.now();
        const { value: r, route: used } = await runWithLlmFallback(
          llmRoute,
          llm,
          runOnce,
          ({ from, to }) => {
            console.warn(`[voice/turn] B7 trocando modelo ${from} → ${to}`);
          },
        );
        llmRoute = used;
        llmModel = used.model;
        assistantText = r.text;
        usage = r.usage;
        llmMs = Date.now() - llmStart;
      }

      if (isLlmOnly(llm)) {
        audioMimeType = "";
        ttsProvider = "browser";
      } else if (isGeminiFull(llm)) {
        const ttsStart = Date.now();
        try {
          const ttsOut = await synthesizeCloudSpeech(toSpeechText(assistantText), {
            prefer: preferredCloudTts(portalMode ? "portal" : "app"),
            gemini: { voice: llm.gemini.ttsVoice, model: llm.gemini.ttsModel },
            openai: { voice: llm.openai.ttsVoice, model: llm.openai.ttsModel },
            meter: { userId, voiceMode: "oss_turn" },
            geminiTimeoutMs: portalMode ? 3_500 : undefined,
            // Portal: cache de áudio (respostas repetidas saem instantâneas)
            cache: portalMode,
          });
          audioWav = ttsOut.audio;
          audioMimeType = ttsOut.mimeType;
          ttsMs = Date.now() - ttsStart;
        } catch (ttsErr) {
          console.warn(
            "[voice/turn] Cloud TTS falhou — fallback browser:",
            ttsErr instanceof Error ? ttsErr.message : ttsErr,
          );
          audioWav = Buffer.alloc(0);
          audioMimeType = "";
          ttsProvider = "browser";
          ttsMs = Date.now() - ttsStart;
        }
      } else {
        // OpenAI full pipeline TTS
        const ttsStart = Date.now();
        try {
          const ttsOut = await synthesizeSpeechOpenAI(toSpeechText(assistantText), {
            voice: llm.openai.ttsVoice,
            model: llm.openai.ttsModel,
            meter: { userId, voiceMode: "oss_turn" },
          });
          audioWav = ttsOut.audio;
          audioMimeType = ttsOut.mimeType;
          ttsMs = Date.now() - ttsStart;
        } catch (ttsErr) {
          console.warn(
            "[voice/turn] OpenAI TTS falhou — fallback browser:",
            ttsErr instanceof Error ? ttsErr.message : ttsErr,
          );
          audioWav = Buffer.alloc(0);
          audioMimeType = "";
          ttsProvider = "browser";
          ttsMs = Date.now() - ttsStart;
        }
      }
    } else if (isVoiceGatewayEnabled()) {
      // ── Python Gateway pipeline ────────────────────────────────────────────
      if (cached) {
        // Cache hit — pula LLM combinado do gateway; sintetiza via Piper direto.
        assistantText = cached.assistantText;
        const ttsStart = Date.now();
        audioWav = await synthesizeSpeech(toSpeechText(assistantText));
        ttsMs = Date.now() - ttsStart;
      } else {
        const out = await gatewayChatTts({
          transcript: harness.transcript,
          systemPrompt,
          history: harness.history,
        });
        assistantText = out.assistantText;
        llmMs = out.llmMs;
        ttsMs = out.ttsMs;
        audioWav = Buffer.from(out.audioBase64, "base64");
      }
    } else {
      // ── OSS local pipeline (Ollama + Piper) ────────────────────────────────
      if (cached) {
        assistantText = cached.assistantText;
      } else {
        const llmStart = Date.now();
        assistantText = await chatCompletion(harness.transcript, {
          history: harness.history,
          systemPrompt,
        });
        llmMs = Date.now() - llmStart;
      }

      const ttsStart = Date.now();
      audioWav = await synthesizeSpeech(toSpeechText(assistantText));
      ttsMs = Date.now() - ttsStart;
    }

    // Ack de memória/tarefas no texto (transcript + browser TTS). Antes do payload.
    const ackParts = [
      memoriesSaved.length > 0 ? formatMemoryAck(memoriesSaved) : "",
      notesChanged.length > 0 ? formatNotesAck(notesChanged) : "",
      tasksChanged.length > 0 ? formatTasksAck(tasksChanged) : "",
      tasksSaveNote
        ? "Não consegui gravar a tarefa no banco. Tente de novo ou adicione em Configurações."
        : "",
    ].filter(Boolean);
    if (ackParts.length > 0) {
      if (memoriesSaved.length > 0) {
        assistantText = stripRedundantMemoryAck(assistantText);
      }
      assistantText = `${ackParts.join(" ")} ${assistantText}`.trim();
    }

    const total = Date.now() - started;

    // FinOps — grava consumo do LLM (best-effort). Em cache hit não houve
    // chamada ao LLM: usage zerado e cache_hit=true (p/ métricas de hit-rate).
    void recordLlmCall({
      userId,
      provider: llm.provider,
      model: llmModel,
      intent: harness.intent,
      usage,
      latencyMs: llmMs,
      cacheHit,
      voiceMode: "oss_turn",
    });

    // Grava no cache semântico em miss (assíncrono, best-effort)
    if (
      !cacheHit &&
      canUseSemanticCacheHit({
        intent: harness.intent,
        ragContext,
        tasksChanged: tasksChanged.length,
        notesChanged: notesChanged.length,
        memoriesSaved: memoriesSaved.length,
      })
    ) {
      void writeSemanticCache({
        transcript: harness.transcript,
        assistantText,
        intent: harness.intent,
      });
    }

    if (userId) {
      await recordVoiceMinutes(userId, total / 1000);
    }

    logHarnessAudit({
      intent: harness.intent,
      transcript: harness.transcript,
      latencyMs: total,
      voiceMode: "oss_turn",
      cacheHit,
    });

    if (userId && sessionId) {
      void saveTranscriptTurn({
        userId,
        sessionId,
        userText: harness.transcript,
        assistantText,
        citations,
      });
      void appendSessionMessages(sessionId, [
        { role: "user", content: harness.transcript },
        { role: "assistant", content: assistantText, citations },
      ]);
    }

    // Memórias já gravadas cedo (memoriesSaved); sem segundo save aqui.

    const payload: VoiceTurnResponse = {
      transcript: harness.transcript,
      rawTranscript:
        rawTranscript !== harness.transcript ? rawTranscript : undefined,
      assistantText,
      audioBase64: audioWav.toString("base64"),
      audioMimeType,
      ttsProvider,
      voiceMode: "oss_turn",
      intent: harness.intent,
      citations: harness.intent === "code" ? undefined : citations,
      cacheHit,
      cacheKind: cacheHit ? cacheKind : undefined,
      llmRoute: {
        family: llmRoute.family,
        model: llmRoute.model,
        reason: llmRoute.reason,
      },
      memoriesSaved: memoriesSaved.length > 0 ? memoriesSaved : undefined,
      tasksChanged: tasksChanged.length > 0 ? tasksChanged : undefined,
      notesChanged: notesChanged.length > 0 ? notesChanged : undefined,
      agentJob,
      suggestedNext: suggestedNext.length > 0 ? suggestedNext : undefined,
      latencyMs: { stt: sttMs, llm: llmMs, tts: ttsMs, total },
    };

    return NextResponse.json(payload);
  } catch (err) {
    if (err instanceof AuthRequiredError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof UsageLimitError) {
      return NextResponse.json(
        { error: err.message, code: "USAGE_LIMIT" },
        { status: 402 },
      );
    }
    console.error("[voice/turn]", err);
    const message = err instanceof Error ? err.message : "Pipeline voice failed";
    void recordError({ route: "/api/voice/turn", message, status: 502, context: { provider: llm.provider } });
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function GET() {
  try {
    assertInferenceConfig();
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Config error" },
      { status: 500 },
    );
  }

  const [ollama, whisper, piper] = await Promise.all([
    checkOllamaHealth(),
    checkWhisperHealth(),
    checkPiperHealth(),
  ]);

  return NextResponse.json({
    ok: ollama && whisper && piper,
    services: { ollama, whisper, piper },
  });
}
