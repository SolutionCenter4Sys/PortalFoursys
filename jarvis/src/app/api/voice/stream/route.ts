import { NextResponse } from "next/server";

import { assertProviderReady, isRagOnly } from "@/lib/inference/config";
import {
  getLlmSettings,
  isGeminiFull,
  isOpenAi,
} from "@/lib/llm/settings";
import { resolveLlmRoute, type LlmRoute } from "@/lib/llm/model-router";
import {
  llmTtftTimeoutMs,
  resolveFallbackRoute,
  withLlmTimeout,
} from "@/lib/llm/llm-fallback";
import { recordLlmCall, EMPTY_USAGE, type LlmUsage } from "@/lib/llm/usage";
import {
  chatCompletionOpenAIStream,
  isOpenAiAvailable,
  transcribeAudioOpenAI,
} from "@/lib/inference/openai-provider";
import {
  chatCompletionGeminiStream,
  transcribeAudioGemini,
} from "@/lib/inference/gemini-provider";
import {
  preferredCloudTts,
  synthesizeCloudSpeech,
} from "@/lib/inference/tts-pipeline";
import { buildPortalPromptParts, buildSystemPrompt } from "@/lib/jarvis-context";
import { getUserDisplayName } from "@/lib/profile/display-name";
import { hitsToCitations, ragQuery, shouldUseRag } from "@/lib/rag/query";
import {
  matchInstitutionalFaq,
  matchInstitutionalFaqSemantic,
} from "@/lib/portal/institutional-faq";
import { isLikelyEcho } from "@/lib/voice/echo-guard";
import { appendSessionMessages } from "@/lib/redis/session-cache";
import { isVoiceAuthRequired } from "@/lib/supabase/config";
import { runHarness, logHarnessAudit } from "@/lib/tokenops/harness";
import type { HarnessOutput } from "@/lib/tokenops/harness";
import {
  buildPredictiveSuggestions,
  formatPredictiveBlock,
} from "@/lib/tokenops/predictive";
import {
  canUseSemanticCacheHit,
  lookupSemanticCache,
  precomputeQueryEmbedding,
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
import {
  agentApproveAck,
  approveAgentJob,
  createAgentJob,
  looksLikeAgentApproveIntent,
  looksLikeAgentWriteIntent,
  resolveWorkspaceAlias,
} from "@/lib/agent/bridge-client";
import { toSpeechText } from "@/lib/voice/speech-text";
import { isUsableSttText, normalizeAudioMime } from "@/lib/voice/stt-text";
import { recordError } from "@/lib/observability/errors";
import type { ChatMessage } from "@/lib/voice/types";

export const maxDuration = 210;
export const runtime = "nodejs";

function parseHistory(raw: FormDataEntryValue | null): ChatMessage[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed)
      ? parsed.filter(
          (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
        )
      : [];
  } catch {
    return [];
  }
}

/**
 * Se o texto termina no meio de uma frase (sem .!?…\n), corta para a última
 * frase completa. Safety net contra truncamento por max_tokens — evita falar
 * "...com forte atuação em ci" (pedaço morto) no fim da resposta.
 * Retorna o texto original se já termina em terminador OU se não há nenhum
 * terminador dentro dele (edge case: 1 frase única incompleta — melhor falar).
 */
function trimToLastCompleteSentence(text: string): string {
  const t = text.trim();
  if (!t) return t;
  if (/[.!?…\n]$/.test(t)) return t;
  const lastTerm = Math.max(
    t.lastIndexOf("."),
    t.lastIndexOf("!"),
    t.lastIndexOf("?"),
    t.lastIndexOf("…"),
    t.lastIndexOf("\n"),
  );
  if (lastTerm <= 0) return t;
  return t.slice(0, lastTerm + 1).trim();
}

/** Extrai frases COMPLETAS de um texto (até o último terminador . ! ? … \n). */
function completeSentences(text: string): { sentences: string[]; consumed: number } {
  const re = /[^.!?…\n]*[.!?…\n]+/g;
  const sentences: string[] = [];
  let consumed = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const s = m[0].trim();
    if (s) sentences.push(s);
    consumed = re.lastIndex;
  }
  return { sentences, consumed };
}

export async function POST(request: Request) {
  const started = Date.now();
  const llm = await getLlmSettings();

  try {
    assertProviderReady(llm.provider);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Config error" },
      { status: 500 },
    );
  }

  // v1: streaming só para cloud completo (openai/gemini). Client cai no /turn nos demais.
  const geminiFull = isGeminiFull(llm);
  const openaiFull = isOpenAi(llm) && llm.provider === "openai";
  if (!geminiFull && !openaiFull) {
    return NextResponse.json(
      { error: "Streaming disponível apenas nos providers openai/gemini (full)." },
      { status: 400 },
    );
  }

  const form = await request.formData();
  const audio = form.get("audio");
  const history = parseHistory(form.get("history"));
  const clientTranscript = form.get("transcript");
  const sessionIdRaw = form.get("sessionId");
  const sessionId =
    typeof sessionIdRaw === "string" && sessionIdRaw.trim() ? sessionIdRaw.trim() : null;
  const pendingAgentJobIdRaw = form.get("pendingAgentJobId");
  const pendingAgentJobId =
    typeof pendingAgentJobIdRaw === "string" && pendingAgentJobIdRaw.trim()
      ? pendingAgentJobIdRaw.trim()
      : null;
  const surfaceRaw = form.get("surface");
  const surface: "app" | "portal" =
    typeof surfaceRaw === "string" && surfaceRaw.trim().toLowerCase() === "portal"
      ? "portal"
      : "app";
  const portalMode = surface === "portal";
  const hasClientTranscript =
    typeof clientTranscript === "string" && clientTranscript.trim().length > 0;

  let buffer = Buffer.alloc(0);
  let ext = "wav";
  let mimeType = "audio/wav";
  if (audio instanceof Blob) {
    mimeType = normalizeAudioMime(audio.type || "audio/webm");
    ext = mimeType.includes("wav") ? "wav" : mimeType.includes("ogg") ? "ogg" : "webm";
    buffer = Buffer.from(await audio.arrayBuffer());
  }
  if (!(audio instanceof Blob) && !hasClientTranscript) {
    return NextResponse.json({ error: "Campo 'audio' ou 'transcript' obrigatório" }, { status: 400 });
  }

  // ── B1: Auth + STT + harness ANTES do stream (status HTTP 401/422/429).
  //     RAG / memória / agent / cache / LLM rodam DEPOIS de abrir o NDJSON
  //     e emitir `transcript` — cliente vê bolha do user cedo.
  let userId: string | null = null;
  let harness: HarnessOutput;
  let rawTranscript: string;
  try {
    userId = await getAuthenticatedUserId();
    if (isVoiceAuthRequired()) {
      if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      await assertVoiceAllowed(userId);
    }

    if (hasClientTranscript) {
      rawTranscript = (clientTranscript as string).trim();
    } else {
      rawTranscript = "";
      // Portal: Whisper (OpenAI) primeiro — STT bem mais rápido que Gemini
      // multimodal. Gemini fica como fallback. Override: PORTAL_STT_PREFER=gemini.
      const portalPreferOpenaiStt =
        portalMode &&
        isOpenAiAvailable() &&
        process.env.PORTAL_STT_PREFER !== "gemini";
      if (portalPreferOpenaiStt) {
        try {
          rawTranscript = await transcribeAudioOpenAI(buffer, `turn.${ext}`, mimeType, {
            meter: { userId, voiceMode: "oss_stream" },
          });
        } catch (sttErr) {
          console.warn(
            "[voice/stream] OpenAI STT (portal) falhou:",
            sttErr instanceof Error ? sttErr.message : sttErr,
          );
        }
      }
      if (!isUsableSttText(rawTranscript) && geminiFull) {
        try {
          rawTranscript = await transcribeAudioGemini(buffer, `turn.${ext}`, mimeType, {
            model: llm.gemini.sttModel,
            meter: { userId, voiceMode: "oss_stream" },
          });
        } catch (sttErr) {
          console.warn(
            "[voice/stream] Gemini STT falhou:",
            sttErr instanceof Error ? sttErr.message : sttErr,
          );
        }
      }
      if (
        !isUsableSttText(rawTranscript) &&
        !portalPreferOpenaiStt &&
        isOpenAiAvailable()
      ) {
        rawTranscript = await transcribeAudioOpenAI(buffer, `turn.${ext}`, mimeType, {
          meter: { userId, voiceMode: "oss_stream" },
        });
      }
    }
    if (!isUsableSttText(rawTranscript)) {
      console.warn("[voice/stream] STT vazio/lixo", {
        bytes: buffer.length,
        mimeType,
        raw: rawTranscript.slice(0, 40),
      });
      return NextResponse.json({ error: "Não foi possível transcrever o áudio" }, { status: 422 });
    }

    harness = await runHarness({ rawTranscript, history, userId });

    // Anti-eco (Portal): se o transcrito é a própria saudação/resposta do Jarvis
    // voltando pelo alto-falante, descarta o turno em vez de "responder ao eco".
    if (portalMode && isLikelyEcho(harness.transcript, history)) {
      console.info(
        "[voice/stream] echo descartado:",
        harness.transcript.slice(0, 60),
      );
      return NextResponse.json({ echo: true }, { status: 409 });
    }

    if (harness.blocked || harness.rateLimited) {
      const assistantText =
        harness.blockReason ??
        "Não posso processar esse pedido agora. Reformule sem dados sensíveis.";
      logHarnessAudit({
        intent: harness.intent,
        transcript: harness.transcript,
        latencyMs: Date.now() - started,
        voiceMode: "oss_stream",
        blocked: harness.blocked,
        rateLimited: harness.rateLimited,
      });
      return NextResponse.json(
        { error: assistantText, transcript: harness.transcript },
        { status: harness.blocked ? 422 : 429 },
      );
    }

    // ADR-015 — aprovação write por voz (desligado no Portal)
    if (!portalMode && pendingAgentJobId && looksLikeAgentApproveIntent(harness.transcript)) {
      const approved = await approveAgentJob(pendingAgentJobId);
      const assistantText = agentApproveAck(Boolean(approved));
      const encoder = new TextEncoder();
      const stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          const send = (obj: unknown) =>
            controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
          send({
            type: "transcript",
            transcript: harness.transcript,
            intent: "code",
          });
          send({ type: "text", full: assistantText });
          try {
            const out = await synthesizeCloudSpeech(toSpeechText(assistantText), {
              gemini: { voice: llm.gemini.ttsVoice, model: llm.gemini.ttsModel },
              openai: { voice: llm.openai.ttsVoice, model: llm.openai.ttsModel },
              meter: { userId, voiceMode: "oss_stream" },
            });
            send({
              type: "audio",
              seq: 0,
              mime: out.mimeType,
              b64: out.audio.toString("base64"),
            });
          } catch {
            /* client may fall back */
          }
          send({ type: "assistant", text: assistantText });
          send({
            type: "done",
            latencyMs: Date.now() - started,
            agentJob: {
              id: pendingAgentJobId,
              status: approved?.status ?? "awaiting_approval",
              prompt: harness.transcript,
            },
          });
          controller.close();
        },
      });
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
      return new Response(stream, {
        headers: {
          "Content-Type": "application/x-ndjson; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }

    const sttDoneAt = Date.now();
    // Portal: FAQ in-process (matchInstitutionalFaq, abaixo) curto-circuita as
    // perguntas comuns → instantâneo. Pro resto, RAG usa o índice rico (seções,
    // cases, serviços, Nexus…) quando a pergunta é de conhecimento OU casa tópicos
    // institucionais / nomes de cliente. shouldUseRag já cobre knowledge/foursys;
    // o regex pega clientes/temas ditos sem a palavra "foursys".
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

    // B5 — LLM route (Flash default; OpenAI só hard/premium). TTS fica no pipeline.
    let llmRoute = resolveLlmRoute(llm, {
      intent: harness.intent,
      transcript: harness.transcript,
    });
    let llmModel = llmRoute.model;
    const ttsCloud = (t: string) =>
      synthesizeCloudSpeech(t, {
        prefer: portalMode ? preferredCloudTts("portal") : preferredCloudTts("app"),
        gemini: { voice: llm.gemini.ttsVoice, model: llm.gemini.ttsModel },
        openai: { voice: llm.openai.ttsVoice, model: llm.openai.ttsModel },
        meter: { userId, voiceMode: "oss_stream" },
        // Portal: não espera 8s no Gemini TTS se preferir OpenAI
        geminiTimeoutMs: portalMode ? 4_000 : undefined,
        // Portal: cache de áudio por frase (FAQ + frases recorrentes → instantâneo)
        cache: portalMode,
      });
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (obj: unknown) =>
          controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));

        // B1 — transcript imediatamente (bolha user + fase searching no client)
        send({
          type: "transcript",
          transcript: harness.transcript,
          rawTranscript: rawTranscript !== harness.transcript ? rawTranscript : undefined,
          intent: harness.intent,
          sttMs: sttDoneAt - started,
        });

        let systemPrompt = "";
        // Portal: parte DINÂMICA (intent hint + RAG) que é prepend no transcript
        // pra manter systemInstruction estável e habilitar prompt caching.
        let portalDynamicPrefix = "";
        let citations: ReturnType<typeof hitsToCitations> | undefined;
        let ragContext: string | undefined;
        // ── timers p/ achar o ofensor de latência ──
        let prepDoneAt = sttDoneAt; // fim de RAG/memória/cache + systemPrompt
        let firstTokenAt = 0; // 1º token do LLM (TTFT)
        let firstAudioAt = 0; // 1º chunk de áudio enviado ao client (TTFA — métrica-chave)
        let genDoneAt = 0; // fim da geração de texto
        let suggestedNext: string[] = [];
        let memoriesSaved: string[] = [];
        let tasksChanged: TasksChanged[] = [];
        let notesChanged: NotesChanged[] = [];
        let tasksSaveNote: string | undefined;
        let agentJob: { id: string; status: string; prompt?: string } | undefined;
        let cached: Awaited<ReturnType<typeof lookupSemanticCache>> = null;
        let cacheKind: "exact" | "semantic" | undefined;
        // Embedding do transcript computado 1× por turn (dentro do Promise.all
        // do cacheP) e reusado no writeSemanticCache. Elimina 1 embed round-trip
        // por turno de voz vs versão que embedava em cada chamada.
        let queryEmbedding: number[] | null = null;

        try {
          // Portal FAQ in-process — hit pula RAG+LLM (STT→TTS).
          // Dia 3: dois níveis. (1) Jaccard rápido (~5ms, sem embed). Se miss,
          // (2) computa embedding e tenta semântico (cosine ≥ 0.82) contra os
          // 24 vetores in-memory. O embedding, se computado aqui, é REUSADO no
          // cache lookup do Promise.all abaixo — sem custo extra.
          let faqHit = portalMode
            ? matchInstitutionalFaq(harness.transcript)
            : null;
          if (portalMode && !faqHit) {
            queryEmbedding = await precomputeQueryEmbedding(harness.transcript);
            faqHit = matchInstitutionalFaqSemantic(queryEmbedding);
          }
          if (faqHit) {
            cached = {
              assistantText: faqHit.answer,
              score: faqHit.score,
              kind: "exact",
            };
            cacheKind = "exact";
            console.info(
              `[portal/faq] HIT id=${faqHit.id} path=${faqHit.path ?? "?"} score=${faqHit.score.toFixed(2)}`,
            );
            send({
              type: "phase",
              phase: "thinking",
              prepMs: Date.now() - sttDoneAt,
              faqId: faqHit.id,
              llmRoute: {
                family: "cache",
                model: "portal-faq",
                reason: "institutional_faq",
              },
            });
            systemPrompt = "";
          } else {
          // B1 — RAG ∥ memória/tasks/notes ∥ agent ∥ cache (quando aplicável)
          const memEnabledP =
            !portalMode && userId ? isMemoryEnabled(userId) : Promise.resolve(false);
          const tasksEnabledP =
            !portalMode && userId ? isTasksEnabled(userId) : Promise.resolve(false);
          const displayNameP =
            !portalMode && userId
              ? getUserDisplayName(userId)
              : Promise.resolve(null);

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

          const memoryTasksP = (async () => {
            if (portalMode) {
              return {
                memoryBlock: undefined as string | undefined,
                tasksBlock: undefined as string | undefined,
                predictiveBlock: undefined as string | undefined,
              };
            }
            const [memEnabled, tasksEnabled] = await Promise.all([memEnabledP, tasksEnabledP]);
            if (userId && tasksEnabled) {
              let tr = await applyTaskIntents(userId, harness.transcript);
              if (tr.changed.length === 0 && rawTranscript !== harness.transcript) {
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
            if (tasksChanged.length > 0) {
              const ack = formatTasksAck(tasksChanged);
              tasksBlock = `${tasksBlock ? `${tasksBlock}\n\n` : ""}AÇÃO DESTE TURNO (já gravada no banco — baseia a resposta nisto; NÃO digas que não encontraste, que falhou, nem que vais adicionar de novo): ${ack}`;
            }
            if (notesChanged.length > 0) {
              const ack = formatNotesAck(notesChanged);
              tasksBlock = `${tasksBlock ? `${tasksBlock}\n\n` : ""}AÇÃO DESTE TURNO (notas — já gravada no banco): ${ack}`;
            }

            suggestedNext = buildPredictiveSuggestions({
              memories: memoriesForPrompt,
              tasksBlock,
              transcript: harness.transcript,
            });
            return {
              memoryBlock,
              tasksBlock,
              predictiveBlock: formatPredictiveBlock(suggestedNext),
            };
          })();

          const agentP = (async () => {
            if (portalMode) return "";
            if (harness.intent !== "code") return "";
            const wantsWrite = looksLikeAgentWriteIntent(harness.transcript);
            const workspace = resolveWorkspaceAlias(harness.transcript);
            const job = await createAgentJob({
              prompt: harness.transcript,
              workspace,
              mode: wantsWrite ? "write" : "read",
            });
            if (job) {
              agentJob = {
                id: job.id,
                status: job.status,
                prompt: harness.transcript,
              };
              return wantsWrite
                ? `AGENT BRIDGE (write pendente): job ${job.id} no workspace "${job.workspace ?? workspace}" (${job.cwd ?? "cwd default"}). Diz ao utilizador para aprovar por voz ("autorizado", "pode executar", "aprova") OU clicar em "Aprovar write" no Contexto — sem isso o agente NÃO cria/altera ficheiros. Paths relativos ao workspace; não peças caminho absoluto. NÃO digas que não tens acesso ao filesystem.`
                : `AGENT BRIDGE (ativo): job ${job.id} no workspace "${job.workspace ?? workspace}" (${job.cwd ?? "cwd default"}). Confirma que logs estão no Contexto. Paths relativos ao workspace. NÃO digas que não tens acesso ao filesystem.`;
            }
            return "AGENT BRIDGE (offline): não foi possível contactar http://127.0.0.1:8787. Diz ao utilizador para iniciar o agent-bridge e verificar AGENT_BRIDGE_* no .env.local.";
          })();

          // B4 — lookup sempre (∥ RAG/mem); aplica só se elegível (sem RAG/side-effect)
          warnSemanticCacheIfMissing("/api/voice/stream");
          const cacheP =
            harness.intent === "code"
              ? Promise.resolve(null)
              : (async () => {
                  // Reusa embedding se já foi computado no FAQ semântico acima.
                  // Só embeda se ainda não temos — evita 2ª round-trip.
                  if (!queryEmbedding) {
                    queryEmbedding = await precomputeQueryEmbedding(harness.transcript);
                  }
                  return lookupSemanticCache(harness.transcript, queryEmbedding);
                })();

          const [, memPack, agentBridgeNote, cacheHitRow, userDisplayName] =
            await Promise.all([
              ragP,
              memoryTasksP,
              agentP,
              cacheP,
              displayNameP,
            ]);

          if (
            cacheHitRow &&
            canUseSemanticCacheHit({
              intent: harness.intent,
              ragContext,
              tasksChanged: tasksChanged.length,
              notesChanged: notesChanged.length,
              memoriesSaved: memoriesSaved.length,
            })
          ) {
            cached = cacheHitRow;
            cacheKind = cacheHitRow.kind;
          }

            if (portalMode) {
              // Split para habilitar prompt caching implícito: só a parte ESTÁVEL
              // (persona + PORTAL_NATIVE_BRIEF, ~2200 tok) vira systemInstruction —
              // idêntico em todo turn. O DINÂMICO (hint intent + RAG) é prepend
              // na transcrição, isolado do que o provider tentará cachear.
              const parts = buildPortalPromptParts(harness.intent, ragContext);
              systemPrompt = parts.stable;
              portalDynamicPrefix = parts.dynamic;
            } else {
              systemPrompt = buildSystemPrompt(
                harness.intent,
                harness.intent === "code" ? undefined : ragContext,
                memPack.memoryBlock,
                harness.intent === "code" ? false : isRagOnly(),
                [memPack.tasksBlock, memPack.predictiveBlock, agentBridgeNote]
                  .filter(Boolean)
                  .join("\n\n") || undefined,
                userDisplayName,
                surface,
              );
            }

          if (citations && citations.length > 0) {
            send({ type: "citations", citations });
          }
          send({
            type: "phase",
            phase: "thinking",
            prepMs: Date.now() - sttDoneAt,
            llmRoute: {
              family: llmRoute.family,
              model: llmRoute.model,
              reason: llmRoute.reason,
            },
          });
          } // end else (!faqHit)
        } catch (prepErr) {
          const message =
            prepErr instanceof Error ? prepErr.message : "Falha no preparo do turno";
          send({ type: "error", error: message });
          controller.close();
          void recordError({
            route: "/api/voice/stream",
            message,
            userId,
            context: { provider: llm.provider, phase: "prep" },
          });
          return;
        }

        let fullRaw = "";
        let emitted = 0;
        let seq = 0;
        prepDoneAt = Date.now(); // RAG/memória/cache + systemPrompt prontos
        // Voz-first: fala a resposta inteira. 0/vazio = sem limite de blocos;
        // defina VOICE_MAX_SPOKEN>0 só para limitar quantos blocos são falados.
        const MAX_SPOKEN = Number.parseInt(process.env.VOICE_MAX_SPOKEN ?? "0", 10) || Infinity;
        // Tamanho mínimo do bloco falado (agrupa frases → fala mais fluida, menos pausas).
        // Portal: respostas curtas (≤300 tokens); 160 chars faz o TTFA esperar quase toda
        // a geração. Baixamos para 60 → começa a falar após a 1ª frase completa.
        const MIN_FLUSH_CHARS = portalMode
          ? Number.parseInt(process.env.PORTAL_VOICE_MIN_FLUSH_CHARS ?? "60", 10)
          : Number.parseInt(process.env.VOICE_MIN_FLUSH_CHARS ?? "160", 10);
        let usage: LlmUsage = EMPTY_USAGE;
        let cacheHit = false;

        /** Strip leve p/ flush incremental (remove código/markup da fala). */
        function stripForStream(text: string): string {
          return text
            .replace(/```[\s\S]*?```/g, " ")
            .replace(/```[\s\S]*$/g, " ")
            .replace(/`([^`]+)`/g, "$1")
            .replace(/\s{2,}/g, " ")
            .trim();
        }

        // ── TTS concorrente, com ordem de reprodução preservada ──────────────
        // Sintetizar blocos EM PARALELO (não sequencial). O gargalo antes era o
        // "runway race": com síntese sequencial, o áudio do texto que vem DEPOIS
        // de uma visualização (tabela/diagrama) só começava a ser gerado tarde,
        // e a fala da introdução acabava antes → pausa de 5–10 s. Agora, assim que
        // o texto de um bloco existe, o TTS dele já dispara em paralelo; o
        // drainLoop envia os áudios prontos SEMPRE na ordem correta.
        const TTS_CONCURRENCY = Math.max(
          1,
          Number.parseInt(process.env.VOICE_TTS_CONCURRENCY ?? "4", 10) || 4,
        );
        let inFlight = 0;
        const ttsWaiters: Array<() => void> = [];
        async function acquireTts() {
          while (inFlight >= TTS_CONCURRENCY) {
            await new Promise<void>((r) => ttsWaiters.push(r));
          }
          inFlight += 1;
        }
        function releaseTts() {
          inFlight -= 1;
          ttsWaiters.shift()?.();
        }
        type TtsResult = { mime: string; b64: string } | null;
        const ttsJobs: Array<Promise<TtsResult>> = [];
        let queuedBlocks = 0;
        /** Enfileira a síntese de um bloco (não bloqueia o loop de detecção). */
        function enqueueSpeak(sentence: string) {
          if (queuedBlocks >= MAX_SPOKEN) return;
          const clean = toSpeechText(sentence);
          if (!clean.trim()) return;
          queuedBlocks += 1;
          ttsJobs.push(
            (async (): Promise<TtsResult> => {
              await acquireTts();
              try {
                const out = await ttsCloud(clean);
                return { mime: out.mimeType, b64: out.audio.toString("base64") };
              } catch (ttsErr) {
                console.warn(
                  "[voice/stream] TTS falhou (bloco ignorado):",
                  ttsErr instanceof Error ? ttsErr.message : ttsErr,
                );
                return null;
              } finally {
                releaseTts();
              }
            })(),
          );
        }

        let genDone = false;
        let speakDone = false;
        // Flush por estagnação: se o texto falável parar de crescer (ex.: o modelo
        // está "desenhando" um bloco de código/mermaid, removido da fala), solta o
        // bloco pendente mesmo abaixo de MIN_FLUSH_CHARS — evita pausa longa.
        // Portal: se o texto falável estagnou por 300ms (vs 600ms default), já solta
        // o bloco pendente — corta pausa perceptível na abertura da resposta.
        const STALL_FLUSH_MS = portalMode
          ? Number.parseInt(process.env.PORTAL_VOICE_STALL_FLUSH_MS ?? "300", 10)
          : Number.parseInt(process.env.VOICE_STALL_FLUSH_MS ?? "600", 10);
        let lastSpokenLen = 0;
        let lastGrowthAt = Date.now();
        /** Detecta blocos faláveis e ENFILEIRA TTS (síntese roda em paralelo). */
        async function speakLoop() {
          for (;;) {
            if (queuedBlocks >= MAX_SPOKEN) {
              speakDone = true;
              return;
            }
            const spoken = stripForStream(fullRaw);
            if (spoken.length !== lastSpokenLen) {
              lastSpokenLen = spoken.length;
              lastGrowthAt = Date.now();
            }
            const pending = spoken.slice(emitted);
            const { sentences, consumed } = completeSentences(pending);
            const combinedLen = sentences.reduce((s, x) => s + x.length, 0);
            const stalled = Date.now() - lastGrowthAt > STALL_FLUSH_MS;
            // enfileira quando o bloco é grande o bastante, no fim, ou quando estagnou
            if (consumed > 0 && (combinedLen >= MIN_FLUSH_CHARS || genDone || stalled)) {
              emitted += consumed;
              // Enfileira CADA FRASE como job próprio — TTS_CONCURRENCY sintetiza
              // em paralelo (drainLoop preserva ordem). Antes: sentences.join(" ")
              // virava 1 job gigante → concurrency ocioso → +2-2.5s de TTFA em
              // cache-hit e respostas curtas. Agora N sentenças = N calls paralelos.
              for (const s of sentences) {
                if (s.trim()) enqueueSpeak(s);
              }
              continue;
            }
            if (genDone) {
              const rest = spoken.slice(emitted).trim();
              if (rest) {
                emitted = spoken.length;
                // Safety net: se o LLM cortou meio-frase (não termina em .!?…),
                // fala só até a última frase completa. Frases anteriores já foram
                // faladas pelo caminho normal — evita cauda tipo "…em ci" audível.
                const speakable = trimToLastCompleteSentence(rest);
                if (speakable) {
                  enqueueSpeak(speakable);
                }
                if (speakable.length < rest.length) {
                  console.info(
                    `[voice/stream] tail cortada (${rest.length - speakable.length} chars sem terminador): "${rest.slice(speakable.length).slice(0, 40)}"`,
                  );
                }
              }
              speakDone = true;
              return;
            }
            // nada pronto ainda → cede o event loop sem bloquear a geração
            await new Promise((res) => setTimeout(res, 30));
          }
        }
        /** Envia os áudios sintetizados em ORDEM, conforme ficam prontos. */
        async function drainLoop() {
          let idx = 0;
          let lastSentAt = 0;
          let maxSendGapMs = 0;
          for (;;) {
            if (idx < ttsJobs.length) {
              const res = await ttsJobs[idx];
              idx += 1;
              if (res) {
                const now = Date.now();
                if (!firstAudioAt) firstAudioAt = now; // TTFA — 1º áudio ao client
                if (lastSentAt > 0) {
                  maxSendGapMs = Math.max(maxSendGapMs, now - lastSentAt);
                }
                lastSentAt = now;
                // B6 — marca tempo p/ telemetria do cliente / logs
                send({
                  type: "audio",
                  seq: seq++,
                  mime: res.mime,
                  b64: res.b64,
                });
              }
              continue;
            }
            if (speakDone) {
              if (maxSendGapMs > 300) {
                console.warn(
                  `[voice/stream] B6 sendGap max=${maxSendGapMs}ms (síntese atrasou vs alvo 300ms)`,
                );
              }
              return;
            }
            await new Promise((r) => setTimeout(r, 10));
          }
        }

        try {
          const generate = async () => {
            if (cached) {
              cacheHit = true;
              fullRaw = cached.assistantText;
              firstTokenAt = Date.now();
              send({ type: "text", full: fullRaw });
              return;
            }

            const ttftMs = llmTtftTimeoutMs();

            // Portal: resposta falada curta (voz). Limita tokens → geração termina
            // antes E gera menos blocos de TTS (corta o "sendGap" da cauda).
            // Override: PORTAL_MAX_TOKENS.
            const portalMaxTokens = Number.parseInt(
              process.env.PORTAL_MAX_TOKENS ?? "300",
              10,
            );
            const geminiMax = portalMode
              ? Math.min(llm.gemini.maxTokens, portalMaxTokens)
              : llm.gemini.maxTokens;
            const openaiMax = portalMode
              ? Math.min(llm.openai.maxTokens, portalMaxTokens)
              : llm.openai.maxTokens;

            // Portal: respostas curtas ancoradas em FAQ+brief. Reasoning (thinking)
            // queima até GEMINI_THINKING_BUDGET tokens ANTES do 1º token visível
            // → −300 a −800 ms de TTFT. Override: PORTAL_GEMINI_THINKING_BUDGET.
            const portalThinkingBudget = Number.parseInt(
              process.env.PORTAL_GEMINI_THINKING_BUDGET ?? "0",
              10,
            );
            const geminiThinkingBudget = portalMode
              ? portalThinkingBudget
              : llm.gemini.thinkingBudget;

            // Portal split: prepend do dinâmico (intent hint + RAG) na fala do
            // usuário. Assim o systemInstruction fica estável → prompt caching.
            const effectiveTranscript = portalDynamicPrefix
              ? `${portalDynamicPrefix.trim()}\n\n${harness.transcript}`
              : harness.transcript;

            const runStreamOnce = async (route: LlmRoute) => {
              const gen =
                route.family === "gemini"
                  ? chatCompletionGeminiStream(effectiveTranscript, {
                      history: harness.history,
                      systemPrompt,
                      model: llm.gemini.model,
                      maxTokens: geminiMax,
                      temperature: llm.gemini.temperature,
                      thinkingBudget: geminiThinkingBudget,
                    })
                  : chatCompletionOpenAIStream(effectiveTranscript, {
                      history: harness.history,
                      systemPrompt,
                      model: llm.openai.model,
                      maxTokens: openaiMax,
                      temperature: llm.openai.temperature,
                    });

              // B7 — timeout só no 1º token; depois deixa fluir
              let r = await withLlmTimeout(gen.next(), ttftMs, "ttft");
              if (!firstTokenAt) firstTokenAt = Date.now();
              while (!r.done) {
                fullRaw += r.value;
                send({ type: "text", full: fullRaw });
                r = await gen.next();
              }
              usage = r.value;
            };

            try {
              await runStreamOnce(llmRoute);
            } catch (primaryErr) {
              // Só fallback se ainda não emitiu texto (evita resposta híbrida)
              if (fullRaw.trim().length > 0) throw primaryErr;
              const fb = resolveFallbackRoute(llmRoute, llm);
              if (!fb) throw primaryErr;
              console.warn(
                `[voice/stream] B7 ${llmRoute.family} falhou → ${fb.family}:`,
                primaryErr instanceof Error ? primaryErr.message : primaryErr,
              );
              send({
                type: "phase",
                phase: "switching",
                from: llmRoute.family,
                to: fb.family,
                message: "Trocando modelo…",
              });
              llmRoute = fb;
              llmModel = fb.model;
              fullRaw = "";
              await runStreamOnce(fb);
            }
          };

          // geração de texto, detecção de blocos e envio de áudio rodam em paralelo.
          // speakLoop enfileira TTS (paralelo); drainLoop envia áudio pronto em ordem.
          let genErr: unknown = null;
          const producer = (async () => {
            try {
              await generate();
            } catch (e) {
              genErr = e;
            } finally {
              genDone = true;
              genDoneAt = Date.now();
            }
          })();
          await Promise.all([producer, speakLoop(), drainLoop()]);
          if (genErr) throw genErr;

          // Safety net: trim fullRaw à última frase completa antes de exibir/persistir.
          // No-op se resposta já termina em .!?… (caminho normal). Evita transcript
          // com cauda morta tipo "…em ci" quando o LLM bateu no max_tokens.
          fullRaw = trimToLastCompleteSentence(fullRaw);

          if (
            memoriesSaved.length > 0 ||
            tasksChanged.length > 0 ||
            notesChanged.length > 0 ||
            tasksSaveNote
          ) {
            const ackParts = [
              memoriesSaved.length > 0 ? formatMemoryAck(memoriesSaved) : "",
              notesChanged.length > 0 ? formatNotesAck(notesChanged) : "",
              tasksChanged.length > 0 ? formatTasksAck(tasksChanged) : "",
              tasksSaveNote
                ? "Não consegui gravar a tarefa no banco. Tente de novo ou adicione em Configurações."
                : "",
            ].filter(Boolean);
            if (memoriesSaved.length > 0) {
              fullRaw = stripRedundantMemoryAck(fullRaw);
            }
            fullRaw = `${ackParts.join(" ")} ${fullRaw}`.trim();
          }

          send({
            type: "assistant",
            text: fullRaw,
            citations: harness.intent === "code" ? undefined : citations,
            memoriesSaved:
              memoriesSaved.length > 0 ? memoriesSaved : undefined,
            tasksChanged: tasksChanged.length > 0 ? tasksChanged : undefined,
            notesChanged: notesChanged.length > 0 ? notesChanged : undefined,
          });

          const total = Date.now() - started;
          // ── breakdown p/ achar o ofensor ──
          const sttMs = sttDoneAt - started;
          const prepMs = Math.max(0, prepDoneAt - sttDoneAt);
          const ttftMs2 = firstTokenAt ? Math.max(0, firstTokenAt - prepDoneAt) : 0;
          const genMs = firstTokenAt && genDoneAt ? Math.max(0, genDoneAt - firstTokenAt) : 0;
          const ttsTailMs = genDoneAt ? Math.max(0, total - (genDoneAt - started)) : 0;
          // TTFA (Time-To-First-Audio): métrica-chave da percepção de latência —
          // do início do request até o usuário ouvir a 1ª sílaba. Alvo Portal: <1.5s cache-hit / <2.5s miss.
          const ttfaMs = firstAudioAt ? firstAudioAt - started : 0;
          // Prompt cache hit ratio: se >0, o provider cacheou parte do prefixo
          // (system prompt + brief). Alvo: cachedInput ≈ promptTokens após 2-3 turnos.
          const cachedIn = usage.cachedInputTokens ?? 0;
          const promptIn = usage.promptTokens || 0;
          const cachedPct =
            promptIn > 0 ? Math.round((cachedIn / promptIn) * 100) : 0;
          console.info(
            `[voice/stream] timing total=${total}ms ttfa=${ttfaMs}ms | stt=${sttMs} prep=${prepMs} ttft=${ttftMs2} gen=${genMs} ttsTail=${ttsTailMs} | rag=${ragEligible} cache=${cacheHit} promptCache=${cachedIn}/${promptIn}tok(${cachedPct}%) route=${llmRoute.family}/${llmRoute.model} chars=${fullRaw.length}`,
          );
          send({
            type: "done",
            latencyMs: total,
            ttfaMs,
            cacheHit,
            cacheKind: cacheHit ? cacheKind : undefined,
            llmRoute: {
              family: llmRoute.family,
              model: llmRoute.model,
              reason: llmRoute.reason,
            },
            memoriesSaved:
              memoriesSaved.length > 0 ? memoriesSaved : undefined,
            tasksChanged: tasksChanged.length > 0 ? tasksChanged : undefined,
            notesChanged: notesChanged.length > 0 ? notesChanged : undefined,
            agentJob,
            suggestedNext:
              suggestedNext.length > 0 ? suggestedNext : undefined,
          });
          controller.close();

          // ── pós-processamento (best-effort, não bloqueia a fala) ──
          void recordLlmCall({
            userId,
            provider: llm.provider,
            model: llmModel,
            intent: harness.intent,
            usage,
            latencyMs: total,
            cacheHit,
            voiceMode: "oss_stream",
          });
          logHarnessAudit({
            intent: harness.intent,
            transcript: harness.transcript,
            latencyMs: total,
            voiceMode: "oss_stream",
            cacheHit,
          });
          if (userId) void recordVoiceMinutes(userId, total / 1000);
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
              assistantText: fullRaw,
              intent: harness.intent,
              // Reusa o embedding computado no lookup — evita 2º embedOne no turn.
              precomputedEmbedding: queryEmbedding,
            });
          }
          if (userId && sessionId) {
            void saveTranscriptTurn({
              userId,
              sessionId,
              userText: harness.transcript,
              assistantText: fullRaw,
              citations,
            });
            void appendSessionMessages(sessionId, [
              { role: "user", content: harness.transcript },
              { role: "assistant", content: fullRaw, citations },
            ]);
          }
          // memórias já gravadas cedo (memoriesSaved)
        } catch (err) {
          const message = err instanceof Error ? err.message : "stream failed";
          send({ type: "error", error: message });
          controller.close();
          void recordError({
            route: "/api/voice/stream",
            message,
            userId,
            context: { provider: llm.provider, phase: "mid-stream" },
          });
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    if (err instanceof AuthRequiredError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (err instanceof UsageLimitError)
      return NextResponse.json({ error: err.message, code: "USAGE_LIMIT" }, { status: 402 });
    console.error("[voice/stream]", err);
    const message = err instanceof Error ? err.message : "Pipeline stream failed";
    void recordError({ route: "/api/voice/stream", message, status: 502, context: { provider: llm.provider } });
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
