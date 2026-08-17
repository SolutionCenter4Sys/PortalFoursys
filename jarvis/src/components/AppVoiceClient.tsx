"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { TranscriptPanel } from "@/components/TranscriptPanel";
import { FreeLimitModal } from "@/components/FreeLimitModal";
import { PoweredByFoursys } from "@/components/JarvisLogo";
import { VoiceOrb } from "@/components/VoiceOrb";
import { WidgetPanel } from "@/components/WidgetPanel";
import { InferenceHealthBadge } from "@/components/InferenceHealthBadge";
import type { InferenceHealthSnapshot } from "@/components/InferenceHealthBadge";
import { NotesTodayWidget } from "@/components/NotesTodayWidget";
import { TasksTodayWidget } from "@/components/TasksTodayWidget";
import { ConversationDrawer } from "@/components/ConversationDrawer";
import type { SessionSummary } from "@/lib/transcripts/service";
import type { RagCitation } from "@/lib/rag/query";
import type { JarvisIntent } from "@/lib/jarvis-context";
import { resolveWidgets, rehydrateWidgetsFromMessages, withAgentJobWidget } from "@/lib/widgets/registry";
import {
  isPinnedId,
  loadPinnedWidgets,
  mergePinnedAndEphemeral,
  savePinnedWidgets,
  toPinnedWidget,
} from "@/lib/widgets/pin";
import type { Widget } from "@/lib/widgets/types";
import { playWakeChime } from "@/lib/voice/play-wake-chime";
import { useSileroVad } from "@/lib/voice/useSileroVad";
import { useWakeWord } from "@/lib/voice/useWakeWord";
import { captureCommand, isBrowserSttSupported } from "@/lib/voice/browser-stt";
import { speakText, stopBrowserSpeech } from "@/lib/voice/browser-tts";
import { speakJarvis } from "@/lib/voice/speak-jarvis";
import { waitAudioFullyPlayed } from "@/lib/voice/wait-audio";
import { createStreamAudioPlayer } from "@/lib/voice/audio-queue";
import { useToast } from "@/lib/ui/useToast";
import {
  agentApproveAck,
  looksLikeAgentApproveIntent,
} from "@/lib/agent/bridge-client";
import type {
  TurnMessage,
  TurnPhase,
  VoiceOrbState,
  VoiceTurnResponse,
  WakePhase,
} from "@/lib/voice/types";
import { ARMED_TIMEOUT_MS, WAKE_PHRASE } from "@/lib/voice/wake-word";
import { delayMs, ensureMicPermission, waitUntil } from "@/lib/voice/mic-utils";

const INACTIVITY_WARN_MS = 4 * 60 * 1000;  // 4 min → toast aviso
const INACTIVITY_STOP_MS = 5 * 60 * 1000;  // 5 min → desativa mic
/** persiste a conversa ativa para retomar no refresh */
const LAST_SESSION_KEY = "jarvis:lastSession";

const EMBED_GREETING_DEFAULT =
  "Olá! Sou o Jarvis, assistente de voz da Foursys. Posso te guiar por quem somos, serviços, trajetória e cases. O que você quer saber?";

/** Texto do hint por sub-fase do turno (feedback de fluidez). */
const PHASE_LABELS: Record<NonNullable<TurnPhase>, string> = {
  transcribing: "Transcrevendo sua fala…",
  searching: "Buscando no seu contexto…",
  thinking: "Pensando na resposta…",
  switching: "Trocando modelo…",
  speaking: "Respondendo…",
};

/** Embed Portal: sem cara de “buscador”; anfitrião natural. */
const PHASE_LABELS_EMBED: Record<NonNullable<TurnPhase>, string> = {
  transcribing: "Ouvindo…",
  searching: "Um instante…",
  thinking: "Um instante…",
  switching: "Um instante…",
  speaking: "Respondendo…",
};

export type AppVoiceClientProps = {
  /** full = app /app · embed = iframe PortalFoursys */
  variant?: "full" | "embed";
};

export function AppVoiceClient({ variant = "full" }: AppVoiceClientProps) {
  const isEmbed = variant === "embed";
  const [orbState, setOrbState] = useState<VoiceOrbState>("idle");
  const [wakePhase, setWakePhase] = useState<WakePhase>("off");
  // US-3.2 — sub-fase do turno (transcrevendo → buscando → pensando → falando)
  const [turnPhase, setTurnPhase] = useState<TurnPhase>(null);
  // A4 — true do início do turno até a 1ª parte da resposta aparecer (typing dots)
  const [awaitingReply, setAwaitingReply] = useState(false);
  const [messages, setMessages] = useState<TurnMessage[]>([]);
  const [vadMode, setVadMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  // "browser" = OPENAI_LLM_ONLY: STT e TTS ficam no browser
  const [sttMode, setSttMode] = useState<"server" | "browser">("server");
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [pinnedWidgets, setPinnedWidgets] = useState<Widget[]>([]);
  const [widgetDismissed, setWidgetDismissed] = useState(false);
  const [notesRefreshKey, setNotesRefreshKey] = useState(0);
  const [tasksRefreshKey, setTasksRefreshKey] = useState(0);
  const [widgetsOpenMobile, setWidgetsOpenMobile] = useState(false);

  // histórico de conversas
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null);

  const { toast } = useToast();

  const sessionIdRef = useRef<string | null>(null);
  const sessionStartedRef = useRef<number | null>(null);
  /** ADR-015 — job write à espera de "autorizado" / "pode executar" por voz */
  const pendingAgentJobIdRef = useRef<string | null>(null);

  const displayWidgets = useMemo(
    () => mergePinnedAndEphemeral(pinnedWidgets, widgets),
    [pinnedWidgets, widgets],
  );
  const pinnedIdSet = useMemo(
    () => new Set(pinnedWidgets.map((w) => w.id)),
    [pinnedWidgets],
  );

  const persistPins = useCallback((next: Widget[]) => {
    savePinnedWidgets(sessionIdRef.current, next);
  }, []);

  const togglePinWidget = useCallback(
    (widget: Widget) => {
      if (isPinnedId(widget.id) || pinnedIdSet.has(widget.id)) {
        setPinnedWidgets((prev) => {
          const next = prev.filter((p) => p.id !== widget.id);
          persistPins(next);
          return next;
        });
        toast.info("Card desafixado");
        return;
      }
      const snap = toPinnedWidget(widget);
      setPinnedWidgets((prev) => {
        const next = [...prev, snap];
        persistPins(next);
        return next;
      });
      // tira o efêmero — senão aparece duplicado (id diferente)
      setWidgets((prev) => prev.filter((w) => w.id !== widget.id));
      toast.success("Fixado no contexto");
    },
    [persistPins, pinnedIdSet, toast],
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // US-3.2 — streaming frase-a-frase ligado (via health) para openai/gemini full
  const streamModeRef = useRef(false);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const busyRef = useRef(false);
  const isPlayingRef = useRef(false);
  // true durante a saudação inicial do Portal (activateFromPortal). Suprime o
  // barge-in nesta janela — antes disso o mic capturava a própria voz do
  // Jarvis (leak alto-falante) ou ruído da sala e disparava handleBargeIn,
  // parando a saudação e enviando o blob de ruído pra /api/voice/stream.
  const initialGreetingRef = useRef(false);
  const turnAbortRef = useRef<AbortController | null>(null);
  // Player de áudio do stream ativo — mantido em ref para poder parar (stop)
  // no barge-in / novo turno e evitar áudios simultâneos de players diferentes.
  const streamPlayerRef = useRef<ReturnType<typeof createStreamAudioPlayer> | null>(null);
  const wakePhaseRef = useRef(wakePhase);
  const messagesRef = useRef(messages);
  const armedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vadReadyRef = useRef(false);
  /** A5 — toast "Mic pronto" só 1× por sessão (não re-tosta em reinit/aba) */
  const vadReadyToastShownRef = useRef(false);
  const inactivityWarnRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactivityStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // transição otimista transcribing → searching (RAG roda no server, sem evento)
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTurnPhase = useCallback(() => {
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
    setTurnPhase(null);
    setAwaitingReply(false);
  }, []);

  wakePhaseRef.current = wakePhase;
  messagesRef.current = messages;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Preview visual dos widgets (?widgetPreview=1) — valida os cards sem inferência.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("widgetPreview")) {
      return;
    }
    void import("@/lib/widgets/samples").then((m) => {
      setWidgets(m.sampleWidgets);
    });
  }, []);

  /** A6 — health badge atualiza stream/STT sem re-renderizar o shell a cada tick */
  const onHealthSnapshot = useCallback((snap: InferenceHealthSnapshot) => {
    streamModeRef.current =
      Boolean(snap.streaming) &&
      (snap.mode === "openai" || snap.mode === "gemini");
    const nextStt: "server" | "browser" =
      snap.mode === "openai-llm" || snap.mode === "gemini-llm"
        ? "browser"
        : "server";
    setSttMode((prev) => (prev === nextStt ? prev : nextStt));
  }, []);

  const healthShouldSkip = useCallback(
    () => busyRef.current || isPlayingRef.current,
    [],
  );

  useEffect(() => {
    if (isEmbed) return;
    fetch("/api/usage")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { minutesRemaining: number | null } | null) => {
        if (data) setMinutesRemaining(data.minutesRemaining);
      })
      .catch(() => {});
    // variant/isEmbed fixo por montagem (full vs embed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEmbed) {
      // Portal: só conversa em memória — sem sessão/tarefas/notas no backend
      sessionStartedRef.current = Date.now();
      return;
    }
    sessionStartedRef.current = Date.now();
    let cancelled = false;

    const applySession = (id: string) => {
      if (cancelled) return;
      sessionIdRef.current = id;
      setActiveSessionId(id);
      try {
        localStorage.setItem(LAST_SESSION_KEY, id);
      } catch {
        /* localStorage indisponível */
      }
    };

    const startNew = () => {
      void fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { sessionId?: string } | null) => {
          if (data?.sessionId) applySession(data.sessionId);
        })
        .catch(() => {});
    };

    // retoma a última conversa se houver — senão cria nova
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(LAST_SESSION_KEY);
    } catch {
      stored = null;
    }

    if (stored) {
      void fetch(`/api/sessions?id=${encodeURIComponent(stored)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { messages?: TurnMessage[] } | null) => {
          if (cancelled) return;
          if (data?.messages && data.messages.length > 0) {
            setMessages(data.messages);
            sessionIdRef.current = stored!;
            setActiveSessionId(stored);
            setWidgets(rehydrateWidgetsFromMessages(data.messages));
            setPinnedWidgets(loadPinnedWidgets(stored!));
            setWidgetDismissed(false);
          } else {
            startNew();
          }
        })
        .catch(() => {
          if (!cancelled) startNew();
        });
    } else {
      startNew();
    }

    return () => {
      cancelled = true;
      const sid = sessionIdRef.current;
      const started = sessionStartedRef.current;
      if (!sid || !started) return;
      const durationSeconds = Math.round((Date.now() - started) / 1000);
      void fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "end",
          sessionId: sid,
          durationSeconds,
        }),
        keepalive: true,
      });
    };
    // variant/isEmbed fixo por montagem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Histórico de conversas ─────────────────────────────────────────────────
  const loadSessionList = useCallback(() => {
    if (isEmbed) return;
    setSessionsLoading(true);
    void fetch("/api/sessions")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { sessions?: SessionSummary[] } | null) => {
        setSessions(data?.sessions ?? []);
      })
      .catch(() => setSessions([]))
      .finally(() => setSessionsLoading(false));
  }, [isEmbed]);

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
    loadSessionList();
  }, [loadSessionList]);

  const resetTurnContext = useCallback((sid: string) => {
    sessionIdRef.current = sid;
    sessionStartedRef.current = Date.now();
    setActiveSessionId(sid);
    setWidgets([]);
    setPinnedWidgets(loadPinnedWidgets(sid));
    setWidgetDismissed(false);
    try {
      localStorage.setItem(LAST_SESSION_KEY, sid);
    } catch {
      /* ignore */
    }
  }, []);

  const handleNewConversation = useCallback(() => {
    setDrawerOpen(false);
    void fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start" }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { sessionId?: string } | null) => {
        if (!data?.sessionId) return;
        setMessages([]);
        resetTurnContext(data.sessionId);
      })
      .catch(() => {});
  }, [resetTurnContext]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      setDrawerOpen(false);
      if (id === sessionIdRef.current) return;
      void fetch(`/api/sessions?id=${encodeURIComponent(id)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { messages?: TurnMessage[] } | null) => {
          const msgs = data?.messages ?? [];
          setMessages(msgs);
          resetTurnContext(id);
          setWidgets(rehydrateWidgetsFromMessages(msgs));
          setWidgetDismissed(false);
        })
        .catch(() => {});
    },
    [resetTurnContext],
  );

  const clearArmedTimeout = useCallback(() => {
    if (armedTimeoutRef.current) {
      clearTimeout(armedTimeoutRef.current);
      armedTimeoutRef.current = null;
    }
  }, []);

  const clearInactivityTimers = useCallback(() => {
    if (inactivityWarnRef.current) {
      clearTimeout(inactivityWarnRef.current);
      inactivityWarnRef.current = null;
    }
    if (inactivityStopRef.current) {
      clearTimeout(inactivityStopRef.current);
      inactivityStopRef.current = null;
    }
  }, []);

  /** Inicia timers de inatividade — chamado ao entrar em standby */
  const startInactivityTimers = useCallback(() => {
    clearInactivityTimers();
    inactivityWarnRef.current = setTimeout(() => {
      toast.info("Nenhuma atividade em 4 min. O microfone será desativado em 1 minuto.");
    }, INACTIVITY_WARN_MS);
    inactivityStopRef.current = setTimeout(() => {
      // enterOff será chamado via ref para evitar dep circular
      enterOffRef.current();
    }, INACTIVITY_STOP_MS);
  }, [clearInactivityTimers, toast]);

  const playResponse = useCallback(async (
    base64: string,
    mimeType: string,
    assistantText?: string,
    ttsProvider?: "browser" | "audio",
  ) => {
    setOrbState("speaking");
    setTurnPhase("speaking");
    isPlayingRef.current = true;

    if (ttsProvider === "browser" && assistantText) {
      // Browser TTS — speechSynthesis
      await speakText(assistantText).catch(() => {});
    } else if (base64 && mimeType) {
      // Audio base64 — Piper / OpenAI / Gemini TTS
      const src = `data:${mimeType};base64,${base64}`;
      if (!audioRef.current) audioRef.current = new Audio();
      const audio = audioRef.current;
      audio.src = src;
      await waitAudioFullyPlayed(audio);
    }

    isPlayingRef.current = false;
    setOrbState("idle");
    clearTurnPhase();
    busyRef.current = false;
  }, [clearTurnPhase]);

  const sendTurnRef = useRef<
    (blob: Blob | null, opts?: { transcript?: string; mimeType?: string }) => Promise<void>
  >(() => Promise.resolve());

  const enterStandbyRef = useRef<() => void>(() => {});
  const enterOffRef = useRef<() => void>(() => {});

  const vad = useSileroVad({
    enabled: vadMode,
    // A5 — MicVAD sobe após idle + prefetch WASM/ONNX (não no 1º paint).
    // Embed/Portal: boot eager — VAD precisa estar pronto antes da 1ª fala do
    // usuário (senão cai no gravador manual e "responde padrão" no silêncio).
    bootAfterIdle: !isEmbed,
    onSpeechStart: () => {
      // Saudação inicial: mic captando a própria voz do Jarvis (leak) ou ruído
      // NÃO deve disparar barge-in nem enviar turn. Ignora silenciosamente.
      if (initialGreetingRef.current) return;
      // Barge-in: usuário fala enquanto Jarvis está respondendo
      if (isPlayingRef.current) {
        handleBargeInRef.current();
        return;
      }
      if (busyRef.current || wakePhaseRef.current !== "armed") return;
      clearArmedTimeout();
      setOrbState("listening");
    },
    onSpeechEnd: (blob) => {
      // Mesma guarda que onSpeechStart: durante a saudação, descarta qualquer
      // blob capturado. Sem isso, o VAD manda o ruído da sala pra /voice/stream.
      if (initialGreetingRef.current) return;
      if (busyRef.current || wakePhaseRef.current !== "armed") return;
      // Anti-ruído: WAV 16kHz mono 16-bit ≈ 32000 bytes/s (+44 header).
      // Fala curta = ruído/clique → ignora. Ambiente ruidoso: subir p/ 600-800ms
      // via NEXT_PUBLIC_VOICE_MIN_UTTERANCE_MS descarta mais falso-positivo.
      const minMs =
        Number.parseInt(process.env.NEXT_PUBLIC_VOICE_MIN_UTTERANCE_MS ?? "380", 10) ||
        380;
      const MIN_SPEECH_BYTES = 44 + Math.round((minMs / 1000) * 32000);
      if (blob.size < MIN_SPEECH_BYTES) return;
      void sendTurnRef.current(blob, { mimeType: "audio/wav" });
    },
    onError: (msg) => setError(msg),
    onReady: () => {
      if (vadReadyToastShownRef.current) return;
      vadReadyToastShownRef.current = true;
      toast.success("Mic pronto");
    },
  });

  const {
    ready: vadReady,
    active: vadActive,
    start: vadStart,
    pause: vadPause,
    release: vadRelease,
    reinitialize: vadReinit,
  } = vad;

  vadReadyRef.current = vadReady;

  const handleBargeInRef = useRef<() => void>(() => {});

  const handleBargeIn = useCallback(() => {
    if (!isPlayingRef.current) return;

    // Para o áudio imediatamente (audio element, stream player ou speechSynthesis)
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.src = ""; }
    streamPlayerRef.current?.stop();
    streamPlayerRef.current = null;
    stopBrowserSpeech();
    isPlayingRef.current = false;

    // Cancela fetch em andamento se ainda existir
    turnAbortRef.current?.abort();
    turnAbortRef.current = null;

    // Marca a última msg do assistente como interrompida
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last.role !== "assistant") return prev;
      return [...prev.slice(0, -1), { ...last, interrupted: true }];
    });

    busyRef.current = false;
    setOrbState("interrupted");
    clearTurnPhase();

    // Curto delay visual; depois arma para o novo comando
    setTimeout(() => {
      setOrbState("armed");
      setWakePhase("armed");
      clearArmedTimeout();
      armedTimeoutRef.current = setTimeout(() => {
        if (!busyRef.current && wakePhaseRef.current === "armed") {
          enterStandbyRef.current();
        }
      }, ARMED_TIMEOUT_MS);
    }, 300);
  }, [clearArmedTimeout, clearTurnPhase]);

  handleBargeInRef.current = handleBargeIn;

  const armForCommand = useCallback(
    async (inlineCommand?: string) => {
      clearInactivityTimers(); // atividade do usuário reseta inatividade
      playWakeChime();
      setWakePhase("armed");
      setOrbState("armed");
      setError(null);

      if (inlineCommand) {
        await delayMs(350);
        void sendTurnRef.current(null, { transcript: inlineCommand });
        return;
      }

      // Modo browser STT — usa Web Speech API sem Silero VAD
      if (sttMode === "browser") {
        await delayMs(350); // gap após wake word recognition parar
        setOrbState("listening");
        try {
          const result = await captureCommand(8_000);
          void sendTurnRef.current(null, { transcript: result.transcript });
        } catch (err) {
          setError(err instanceof Error ? err.message : "Erro na captura de voz");
          enterStandbyRef.current();
        }
        return;
      }

      // Modo Silero VAD (server STT)
      // Half-duplex: cooldown antes de religar o mic pós-fala. Curto demais e a
      // cauda/eco do próprio Jarvis (AEC não cancela 100% em alto-falante/sala
      // reverberante) re-dispara captura → turno-eco. Tunável p/ ajustar ao setup.
      // Embed default 350ms (era 150). Env: NEXT_PUBLIC_VOICE_MIC_REARM_MS.
      const rearmMs = Number.parseInt(
        process.env.NEXT_PUBLIC_VOICE_MIC_REARM_MS ?? (isEmbed ? "350" : "450"),
        10,
      );
      await delayMs(Number.isFinite(rearmMs) ? rearmMs : isEmbed ? 350 : 450);

      const ready = await waitUntil(() => vadReadyRef.current, {
        timeoutMs: isEmbed ? 12_000 : 15_000,
      });
      if (!ready) {
        // Embed / Portal: VAD às vezes falha no proxy — cai no gravador manual
        if (isEmbed) {
          setError(null);
          void startManualRecordingRef.current?.({ autoStopMs: 10_000 });
          return;
        }
        setError(
          "Modelo VAD ainda carregando — aguarde e clique no orb novamente",
        );
        enterStandbyRef.current();
        return;
      }

      const started = await vadStart();
      if (!started) {
        if (isEmbed) {
          setError(null);
          void startManualRecordingRef.current?.({ autoStopMs: 10_000 });
          return;
        }
        setError("Não foi possível capturar áudio — tente o modo Manual");
        enterStandbyRef.current();
        return;
      }

      clearArmedTimeout();
      armedTimeoutRef.current = setTimeout(() => {
        if (!busyRef.current && wakePhaseRef.current === "armed") {
          // Embed: sem fala no prazo → idle (toque no orb). Evita loop de chime
          // e não força "olá jarvis". App: volta a standby (wake word).
          if (isEmbed) enterOffRef.current();
          else enterStandbyRef.current();
        }
      }, ARMED_TIMEOUT_MS);
    },
    [vadStart, clearArmedTimeout, clearInactivityTimers, sttMode, isEmbed],
  );

  const wakeWord = useWakeWord({
    enabled: vadMode && wakePhase === "standby",
    onWakeWord: ({ inlineCommand }) => {
      void armForCommand(inlineCommand);
    },
    onError: (msg) => setError(msg),
  });

  const enterStandby = useCallback(async () => {
    clearArmedTimeout();
    clearInactivityTimers();
    clearTurnPhase();
    vadPause();
    setError(null);

    try {
      await ensureMicPermission();
    } catch {
      setOrbState("error");
      setError("Permissão de microfone negada — libere nas configurações do navegador");
      setTimeout(() => setOrbState("idle"), 2500);
      return;
    }

    setWakePhase("standby");
    setOrbState("standby");
    startInactivityTimers();
  }, [clearArmedTimeout, clearInactivityTimers, clearTurnPhase, vadPause, startInactivityTimers]);

  enterStandbyRef.current = enterStandby;

  /**
   * Pós-turno. Portal/embed = conversa contínua: re-arma direto (sem "olá jarvis").
   * App = volta a standby (wake word) ou desliga.
   */
  const resumeAfterTurn = useCallback(() => {
    if (isEmbed) {
      void armForCommand();
    } else if (vadMode) {
      void enterStandby();
    } else {
      enterOffRef.current();
    }
  }, [isEmbed, vadMode, armForCommand, enterStandby]);

  const resumeAfterTurnRef = useRef<() => void>(() => {});
  resumeAfterTurnRef.current = resumeAfterTurn;

  // Libera o microfone quando a aba perde foco; retoma ao voltar.
  // Não interrompe processamento ou reprodução de áudio em andamento.
  const pausedByVisibilityRef = useRef(false);

  useEffect(() => {
    if (isEmbed) return; // iframe: parent controla lifecycle
    function handleVisibility() {
      if (document.hidden) {
        const phase = wakePhaseRef.current;
        // Só age se o mic estava em escuta ativa
        if (phase === "standby" || phase === "armed") {
          pausedByVisibilityRef.current = true;
          clearArmedTimeout();
          wakeWord.stop();
          // release() destrói o MicVAD e fecha o getUserMedia → libera o mic no OS
          vadRelease();
          setWakePhase("off");
          setOrbState("idle");
        }
      } else {
        // Aba voltou — reinicia VAD e retoma standby
        if (pausedByVisibilityRef.current) {
          pausedByVisibilityRef.current = false;
          vadReinit(); // cria novo MicVAD + getUserMedia em background
          void enterStandby();
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isEmbed, clearArmedTimeout, vadRelease, vadReinit, wakeWord, enterStandby]);

  const enterOff = useCallback(() => {
    clearArmedTimeout();
    clearInactivityTimers();
    clearTurnPhase();
    wakeWord.stop();
    vadPause();
    setWakePhase("off");
    setOrbState("idle");
  }, [clearArmedTimeout, clearInactivityTimers, clearTurnPhase, wakeWord, vadPause]);

  enterOffRef.current = enterOff;

  const embedActivatedRef = useRef(false);
  const embedGreetingLockRef = useRef(false);

  /** Portal iframe: 1 saudação só (postMessage do parent). Sem auto-activate no mount. */
  const activateFromPortal = useCallback(
    async (greeting?: string) => {
      // Lock síncrono + ref: evita Strict Mode / double postMessage
      if (embedActivatedRef.current || embedGreetingLockRef.current) return;
      embedGreetingLockRef.current = true;
      embedActivatedRef.current = true;
      const text = (greeting?.trim() || EMBED_GREETING_DEFAULT).slice(0, 400);
      try {
        await ensureMicPermission();
        clearArmedTimeout();
        clearInactivityTimers();
        setError(null);
        // Enquanto fala a saudação: estado "speaking" e wake-word DESLIGADO
        // (wakePhase != "standby" impede o mic de ouvir a própria saudação).
        setWakePhase("off");
        setOrbState("speaking");
        setMessages((prev) => {
          // Não duplicar bolha se HMR/Strict reentrar com o mesmo texto
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last.content === text) return prev;
          return [
            ...prev,
            { role: "assistant", content: text, timestamp: Date.now() },
          ];
        });
        // Flag anti-barge-in: cobre toda a janela saudação+gap. VAD pode disparar
        // com o leak da própria voz OU ruído da sala — os handlers ignoram.
        initialGreetingRef.current = true;
        isPlayingRef.current = true;
        await speakJarvis(text, "portal");
        isPlayingRef.current = false;
        clearTurnPhase();
        // Gap anti-eco: mic não deve ouvir a cauda da própria saudação
        await delayMs(900);
        // Só libera barge-in DEPOIS do gap — daí em diante conversa real.
        initialGreetingRef.current = false;
        await armForCommand();
      } catch (err) {
        initialGreetingRef.current = false;
        isPlayingRef.current = false;
        clearTurnPhase();
        embedActivatedRef.current = false;
        embedGreetingLockRef.current = false;
        setError(err instanceof Error ? err.message : "Falha ao ativar Jarvis");
        setOrbState("error");
        setTimeout(() => setOrbState("idle"), 2500);
      }
    },
    [armForCommand, clearArmedTimeout, clearInactivityTimers, clearTurnPhase],
  );

  const activateFromPortalRef = useRef(activateFromPortal);
  activateFromPortalRef.current = activateFromPortal;

  useEffect(() => {
    if (!isEmbed) return;
    function onMsg(ev: MessageEvent) {
      const data = ev.data as { type?: string; greeting?: string } | null;
      if (!data || typeof data !== "object") return;
      if (data.type === "jarvis:activate") {
        void activateFromPortalRef.current(data.greeting);
      }
      if (data.type === "jarvis:stop") {
        embedActivatedRef.current = false;
        embedGreetingLockRef.current = false;
        enterOffRef.current();
      }
    }
    window.addEventListener("message", onMsg);
    try {
      window.parent?.postMessage({ type: "jarvis:ready" }, "*");
    } catch {
      /* cross-origin */
    }
    // Fallback se parent não mandar activate em 2.5s (dev / race)
    const fallback = window.setTimeout(() => {
      if (!embedActivatedRef.current) {
        void activateFromPortalRef.current(EMBED_GREETING_DEFAULT);
      }
    }, 2500);
    return () => {
      window.removeEventListener("message", onMsg);
      window.clearTimeout(fallback);
    };
    // Deps só [isEmbed]: efeito roda 1× por montagem. Usar refs evita re-post de
    // "ready" + re-armar fallback quando callbacks trocam de identidade (cold
    // start / VAD ready) — o que causava saudação dupla/sobreposta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmbed]);

  // US-3.2 — consome o stream NDJSON e toca os segmentos de áudio em fila,
  // começando a falar na 1ª frase. Retorna os dados finais do turno.
  const runStream = useCallback(
    async (form: FormData, abort: AbortController) => {
      const res = await fetch("/api/voice/stream", {
        method: "POST",
        body: form,
        signal: abort.signal,
      });
      if (res.status === 402) {
        setLimitModalOpen(true);
        throw new Error("Limite Free atingido");
      }
      if (res.status === 409) {
        // Anti-eco: servidor descartou a própria fala do Jarvis. Silencioso.
        throw new Error("__ECHO__");
      }
      if (!res.ok || !res.body) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }

      if (!audioRef.current) audioRef.current = new Audio();
      // Para qualquer áudio anterior ainda tocando (saudação via audioRef ou
      // player de stream de um turno anterior) — evita filas simultâneas.
      if (audioRef.current.src) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
      }
      streamPlayerRef.current?.stop();
      // B6 — fila com prefetch; gap alvo ≤300ms entre frases
      const player = createStreamAudioPlayer({
        maxGapMs: Number.parseInt(
          process.env.NEXT_PUBLIC_VOICE_MAX_GAP_MS ?? "300",
          10,
        ) || 300,
      });
      streamPlayerRef.current = player;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let userText = "";
      let userPushed = false;
      let assistantPushed = false;
      let assistantText = "";
      let intent: string | undefined;
      let citations: RagCitation[] | undefined;
      let latencyMs = 0;
      let firstAudio = true;
      let memoriesSaved: string[] | undefined;
      let tasksChanged: VoiceTurnResponse["tasksChanged"];
      let notesChanged: VoiceTurnResponse["notesChanged"];
      let agentJob: VoiceTurnResponse["agentJob"];
      let suggestedNext: string[] | undefined;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line) continue;
          const f = JSON.parse(line) as {
            type: string;
            transcript?: string;
            intent?: string;
            citations?: RagCitation[];
            phase?: "transcribing" | "searching" | "thinking" | "switching" | "speaking";
            full?: string;
            text?: string;
            mime?: string;
            b64?: string;
            latencyMs?: number;
            memoriesSaved?: string[];
            tasksChanged?: VoiceTurnResponse["tasksChanged"];
            notesChanged?: VoiceTurnResponse["notesChanged"];
            agentJob?: VoiceTurnResponse["agentJob"];
            suggestedNext?: string[];
            error?: string;
          };
          if (f.type === "transcript") {
            userText = f.transcript ?? "";
            intent = f.intent;
            citations = f.citations ?? citations;
            // B1 — STT pronto; RAG/prep ainda pode estar rodando
            if (phaseTimerRef.current) {
              clearTimeout(phaseTimerRef.current);
              phaseTimerRef.current = null;
            }
            setTurnPhase("searching");
            setOrbState("processing");
            // A3 — bolha do usuário aparece já (antes do LLM), sem esperar a fala
            if (userText && !userPushed) {
              userPushed = true;
              setMessages((prev) => [
                ...prev,
                { role: "user", content: userText, timestamp: Date.now() },
              ]);
            }
          } else if (f.type === "citations") {
            citations = f.citations ?? citations;
          } else if (f.type === "phase") {
            if (
              f.phase === "thinking" ||
              f.phase === "speaking" ||
              f.phase === "switching" ||
              f.phase === "searching"
            ) {
              setTurnPhase(f.phase);
              // Orb acompanha a fase (embed não tem transcript — visual é o feedback)
              if (f.phase === "speaking") {
                setOrbState("speaking");
              } else {
                setOrbState("processing");
              }
            }
          } else if (f.type === "text") {
            assistantText = f.full ?? assistantText;
            // Só exibe o texto DEPOIS que a fala começa (TTS pronto) — enquanto
            // isso, fica "pensando" com os 3 pontos. Evita texto 2s antes da voz.
            if (assistantPushed) {
              const content = assistantText;
              setMessages((prev) => {
                const li = prev.length - 1;
                if (li < 0 || prev[li].role !== "assistant") return prev;
                const copy = prev.slice();
                copy[li] = { ...copy[li], content };
                return copy;
              });
            }
          } else if (f.type === "audio") {
            if (firstAudio) {
              firstAudio = false;
              isPlayingRef.current = true;
              setOrbState("speaking");
              setTurnPhase("speaking");
              // revela o texto exatamente quando a voz começa (sincronia texto↔fala)
              if (!assistantPushed) {
                assistantPushed = true;
                setAwaitingReply(false);
                const content = assistantText;
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", content, timestamp: Date.now() },
                ]);
              }
            }
            const src = `data:${f.mime};base64,${f.b64}`;
            player.enqueue(src);
          } else if (f.type === "assistant") {
            assistantText = f.text ?? assistantText;
            citations = f.citations ?? citations;
            if (f.memoriesSaved) memoriesSaved = f.memoriesSaved;
            if (f.tasksChanged) tasksChanged = f.tasksChanged;
            if (f.notesChanged) notesChanged = f.notesChanged;
          } else if (f.type === "done") {
            latencyMs = f.latencyMs ?? 0;
            if (f.memoriesSaved) memoriesSaved = f.memoriesSaved;
            if (f.tasksChanged) tasksChanged = f.tasksChanged;
            if (f.notesChanged) notesChanged = f.notesChanged;
            if (f.agentJob) agentJob = f.agentJob;
            if (f.suggestedNext) suggestedNext = f.suggestedNext;
          } else if (f.type === "error") {
            throw new Error(f.error ?? "stream error");
          }
        }
      }
      // Fallback: TTS não produziu áudio (falha/cache sem áudio) → mostra o texto
      if (!assistantPushed && assistantText) {
        assistantPushed = true;
        setAwaitingReply(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: assistantText, timestamp: Date.now() },
        ]);
      }
      const playStats = await player.done();
      if (playStats.overBudget > 0) {
        console.info(
          `[voice/B6] maxGap=${playStats.maxGapMs}ms overBudget=${playStats.overBudget}/${playStats.gapsMs.length}`,
        );
      }
      // libera a ref só se ainda for este player (um novo turno pode tê-la trocado)
      if (streamPlayerRef.current === player) streamPlayerRef.current = null;
      isPlayingRef.current = false;
      return {
        userText,
        userPushed,
        assistantPushed,
        assistantText,
        intent,
        citations,
        latencyMs,
        memoriesSaved,
        tasksChanged,
        notesChanged,
        agentJob,
        suggestedNext,
      };
    },
    [setLimitModalOpen],
  );

  const sendTurn = useCallback(
    async (
      blob: Blob | null,
      opts?: { transcript?: string; mimeType?: string },
    ) => {
      if (busyRef.current) return;
      if (minutesRemaining !== null && minutesRemaining <= 0) {
        setLimitModalOpen(true);
        return;
      }

      // ADR-015 — aprovação write por voz (texto já no browser, sem LLM)
      const voiceApproveText = opts?.transcript?.trim() ?? "";
      if (
        !isEmbed &&
        voiceApproveText &&
        looksLikeAgentApproveIntent(voiceApproveText) &&
        pendingAgentJobIdRef.current
      ) {
        const jobId = pendingAgentJobIdRef.current;
        busyRef.current = true;
        clearInactivityTimers();
        setWakePhase("off");
        setOrbState("processing");
        setError(null);
        clearArmedTimeout();
        wakeWord.stop();
        vadPause();
        try {
          const res = await fetch(
            `/api/agent/jobs/${encodeURIComponent(jobId)}/approve`,
            { method: "POST" },
          );
          const ok = res.ok;
          const assistantText = agentApproveAck(ok);
          const now = Date.now();
          setMessages((prev) => [
            ...prev,
            { role: "user", content: voiceApproveText, timestamp: now },
            { role: "assistant", content: assistantText, timestamp: now },
          ]);
          if (ok) {
            setWidgets((prev) =>
              prev.map((w) =>
                w.kind === "agentJob" && w.jobId === jobId
                  ? { ...w, status: "running" }
                  : w,
              ),
            );
            toast.success("Write autorizado por voz");
          } else {
            toast.error("Falha ao autorizar write");
          }
          setOrbState("speaking");
          await speakJarvis(assistantText).catch(() => {});
          if (vadMode) void enterStandby();
          else enterOff();
        } catch (err) {
          setOrbState("error");
          setError(err instanceof Error ? err.message : "Erro ao aprovar");
          setTimeout(() => {
            if (vadMode) void enterStandby();
            else enterOff();
          }, 2000);
        } finally {
          busyRef.current = false;
        }
        return;
      }

      busyRef.current = true;
      clearInactivityTimers();
      setWakePhase("off");
      setOrbState("processing");
      setTurnPhase("transcribing");
      setAwaitingReply(true);
      // RAG roda server-side sem evento próprio; após a janela de STT trocamos
      // para "buscando" de forma otimista (o evento transcript corrige p/ pensando).
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = setTimeout(() => {
        setTurnPhase((p) => (p === "transcribing" ? "searching" : p));
      }, 700);
      setError(null);
      clearArmedTimeout();
      wakeWord.stop();
      vadPause();

      const abort = new AbortController();
      turnAbortRef.current = abort;

      const form = new FormData();
      if (blob && blob.size > 0) {
        const mimeType = opts?.mimeType ?? (blob.type || "audio/wav");
        const ext = mimeType.includes("wav") ? "wav" : "webm";
        form.append("audio", blob, `turn.${ext}`);
      }
      if (opts?.transcript) {
        form.append("transcript", opts.transcript);
      }
      form.append("history", JSON.stringify(messagesRef.current.slice(-8)));
      if (isEmbed) {
        form.append("surface", "portal");
      }
      if (sessionIdRef.current) {
        form.append("sessionId", sessionIdRef.current);
      }
      if (pendingAgentJobIdRef.current) {
        form.append("pendingAgentJobId", pendingAgentJobIdRef.current);
      }

      try {
        // ── US-3.2: caminho de streaming frase-a-frase (cloud full, flag ligada) ──
        // Embed/Portal SEMPRE usa streaming: áudio começa na 1ª frase → latência
        // percebida cai muito (TTS sobrepõe o LLM em vez de esperar o turno todo).
        if ((streamModeRef.current || isEmbed) && blob && blob.size > 0) {
          const r = await runStream(form, abort);
          busyRef.current = false;
          const now = Date.now();
          const assistantMsg: TurnMessage = {
            role: "assistant",
            content: r.assistantText,
            citations: r.citations,
            memoriesSaved: r.memoriesSaved,
            tasksChanged: r.tasksChanged,
            notesChanged: r.notesChanged,
            timestamp: now,
          };
          // A3/A4 — user e assistant já foram renderizados ao vivo (transcript/text).
          // Finaliza: consolida a última bolha assistant (acks, citações, memórias).
          setMessages((prev) => {
            if (r.assistantPushed) {
              const li = prev.length - 1;
              if (li >= 0 && prev[li].role === "assistant") {
                const copy = prev.slice();
                copy[li] = { ...copy[li], ...assistantMsg };
                return copy;
              }
            }
            // Fallback: nada streamado — anexa respeitando o que já entrou (A3)
            return r.userPushed
              ? [...prev, assistantMsg]
              : [
                  ...prev,
                  { role: "user", content: r.userText, timestamp: now },
                  assistantMsg,
                ];
          });
          if (
            (r.memoriesSaved && r.memoriesSaved.length > 0) ||
            (r.notesChanged && r.notesChanged.length > 0)
          ) {
            setNotesRefreshKey((k) => k + 1);
          }
          if (r.tasksChanged && r.tasksChanged.length > 0) {
            setTasksRefreshKey((k) => k + 1);
          }
          setLastLatency(r.latencyMs);
          if (minutesRemaining !== null) {
            setMinutesRemaining((m) =>
              m === null ? m : Math.max(0, Math.round((m - r.latencyMs / 60000) * 10) / 10),
            );
          }
          setWidgetDismissed(false);
          setWidgets(
            withAgentJobWidget(
              resolveWidgets({
                userTranscript: r.userText,
                assistantText: r.assistantText,
                citations: r.citations,
                intent: (r.intent ?? "chat") as JarvisIntent,
                suggestedNext: r.suggestedNext,
              }),
              r.agentJob,
            ),
          );
          if (r.agentJob?.status === "awaiting_approval") {
            pendingAgentJobIdRef.current = r.agentJob.id;
          } else if (
            r.agentJob &&
            (r.agentJob.status === "done" || r.agentJob.status === "failed")
          ) {
            if (pendingAgentJobIdRef.current === r.agentJob.id) {
              pendingAgentJobIdRef.current = null;
            }
          }
          if (!abort.signal.aborted) {
            clearTurnPhase();
            resumeAfterTurnRef.current();
          }
          return;
        }

        const res = await fetch("/api/voice/turn", {
          method: "POST",
          body: form,
          signal: abort.signal,
        });
        if (res.status === 409) {
          // Anti-eco: descarta a própria fala do Jarvis. Silencioso.
          throw new Error("__ECHO__");
        }
        const data = (await res.json()) as VoiceTurnResponse & {
          error?: string;
          code?: string;
        };

        if (res.status === 402 || data.code === "USAGE_LIMIT") {
          setLimitModalOpen(true);
          throw new Error(data.error ?? "Limite Free atingido");
        }

        if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);

        const userText = data.transcript;
        const now = Date.now();
        setAwaitingReply(false); // resposta pronta (fallback single-shot)
        setMessages((prev) => [
          ...prev,
          { role: "user", content: userText, timestamp: now },
          {
            role: "assistant",
            content: data.assistantText,
            citations: data.citations,
            memoriesSaved: data.memoriesSaved,
            tasksChanged: data.tasksChanged,
            notesChanged: data.notesChanged,
            timestamp: now,
          },
        ]);
        if (
          (data.memoriesSaved && data.memoriesSaved.length > 0) ||
          (data.notesChanged && data.notesChanged.length > 0)
        ) {
          setNotesRefreshKey((k) => k + 1);
        }
        if (data.tasksChanged && data.tasksChanged.length > 0) {
          setTasksRefreshKey((k) => k + 1);
        }
        setLastLatency(data.latencyMs.total);

        if (minutesRemaining !== null) {
          setMinutesRemaining((m) =>
            m === null ? m : Math.max(0, Math.round((m - data.latencyMs.total / 60000) * 10) / 10),
          );
        }

        setWidgetDismissed(false);
        setWidgets(
          withAgentJobWidget(
            resolveWidgets({
              userTranscript: userText,
              assistantText: data.assistantText,
              citations: data.citations,
              intent: data.intent,
              suggestedNext: data.suggestedNext,
            }),
            data.agentJob,
          ),
        );
        if (data.agentJob?.status === "awaiting_approval") {
          pendingAgentJobIdRef.current = data.agentJob.id;
        } else if (
          data.agentJob &&
          (data.agentJob.status === "running" ||
            data.agentJob.status === "queued")
        ) {
          // aprovado por voz no servidor — widget continua a pollar
          pendingAgentJobIdRef.current = data.agentJob.id;
        } else if (
          data.agentJob &&
          (data.agentJob.status === "done" || data.agentJob.status === "failed")
        ) {
          if (pendingAgentJobIdRef.current === data.agentJob.id) {
            pendingAgentJobIdRef.current = null;
          }
        }

        await playResponse(data.audioBase64, data.audioMimeType, data.assistantText, data.ttsProvider);
        // Pós-turno: embed segue conversa (re-arma); app volta a standby.
        if (!abort.signal.aborted) {
          resumeAfterTurnRef.current();
        }
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return; // interrompido — handleBargeIn cuida do estado
        busyRef.current = false;
        // Anti-eco: turno descartado (própria fala do Jarvis). Sem erro na UI —
        // apenas volta a ouvir.
        if ((err as Error)?.message === "__ECHO__") {
          setAwaitingReply(false);
          clearTurnPhase();
          resumeAfterTurnRef.current();
          return;
        }
        setOrbState("error");
        setError(err instanceof Error ? err.message : "Erro no turno de voz");
        setTimeout(() => {
          resumeAfterTurnRef.current();
        }, 2000);
      } finally {
        if (turnAbortRef.current === abort) turnAbortRef.current = null;
      }
    },
    [
      playResponse,
      runStream,
      vadMode,
      vadPause,
      wakeWord,
      clearArmedTimeout,
      clearInactivityTimers,
      enterStandby,
      enterOff,
      minutesRemaining,
      toast,
      isEmbed,
    ],
  );

  sendTurnRef.current = sendTurn;

  /** Persiste transcript editado/excluído no servidor (best-effort). */
  const syncTranscript = useCallback(async (next: TurnMessage[]) => {
    const sid = sessionIdRef.current;
    if (!sid) return;
    try {
      await fetch("/api/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sid,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
    } catch {
      /* best-effort */
    }
  }, []);

  const handleCopyAnswer = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      toast.error("Não foi possível copiar");
    }
  }, [toast]);

  const handleDeleteTurn = useCallback(
    (startIndex: number, length: number) => {
      if (busyRef.current || orbState === "processing") {
        toast.info("Aguarda o Jarvis terminar o turno atual.");
        return;
      }
      const next = [
        ...messagesRef.current.slice(0, startIndex),
        ...messagesRef.current.slice(startIndex + length),
      ];
      messagesRef.current = next;
      setMessages(next);
      setWidgets(rehydrateWidgetsFromMessages(next));
      setWidgetDismissed(false);
      void syncTranscript(next);
    },
    [syncTranscript, toast, orbState],
  );

  const handleResendTurn = useCallback(
    (startIndex: number, _length: number, newQuestion: string) => {
      const q = newQuestion.trim();
      if (!q) return;

      // Interrompe fala/turno em curso para poder reenviar
      stopBrowserSpeech();
      const abort = turnAbortRef.current;
      if (abort) {
        abort.abort();
        turnAbortRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
      }
      streamPlayerRef.current?.stop();
      streamPlayerRef.current = null;
      isPlayingRef.current = false;
      busyRef.current = false;

      // remove este turno e tudo depois — reenvia com contexto anterior
      const next = messagesRef.current.slice(0, startIndex);
      messagesRef.current = next;
      setMessages(next);
      setWidgets(rehydrateWidgetsFromMessages(next));
      setWidgetDismissed(false);
      void syncTranscript(next);
      toast.info("A reenviar pergunta…");
      void sendTurnRef.current(null, { transcript: q });
    },
    [syncTranscript, toast],
  );

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    recorder.stop();
    setIsRecording(false);
  }, []);

  const startManualRecording = useCallback(
    async (opts?: { autoStopMs?: number }) => {
      setError(null);
      let autoStopped = false;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        const recorder = new MediaRecorder(stream, {
          mimeType: getSupportedMimeType(),
        });
        chunksRef.current = [];

        // ── VAD leve por energia (fallback quando o Silero não carregou) ──
        // Detecta que a pessoa COMEÇOU a falar e só encerra no silêncio final,
        // em vez de cortar em X segundos fixos. Assim fala longa não é cortada.
        let monitorTimer: number | undefined;
        let audioCtx: AudioContext | undefined;
        const cleanupMonitor = () => {
          if (monitorTimer !== undefined) window.clearInterval(monitorTimer);
          monitorTimer = undefined;
          if (audioCtx && audioCtx.state !== "closed") void audioCtx.close();
          audioCtx = undefined;
        };

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          cleanupMonitor();
          stream.getTracks().forEach((t) => t.stop());
          setIsRecording(false);
          // Só descarta se a pessoa NUNCA falou (ruído/silêncio) — evita STT
          // alucinar "resposta padrão". Se falou, envia mesmo que longo.
          if (autoStopped) {
            if (isEmbed) enterOffRef.current();
            else setOrbState("idle");
            return;
          }
          const blob = new Blob(chunksRef.current, {
            type: recorder.mimeType || "audio/webm",
          });
          if (blob.size > 0) await sendTurn(blob);
          else setOrbState("idle");
        };

        mediaRecorderRef.current = recorder;
        recorder.start();
        setIsRecording(true);
        setWakePhase("armed");
        setOrbState("listening");

        // Monitor de energia: começa a "ouvir" e adapta o corte à fala real.
        try {
          const AudioCtor =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext })
              .webkitAudioContext;
          if (AudioCtor) {
            audioCtx = new AudioCtor();
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 512;
            source.connect(analyser);
            const buf = new Uint8Array(analyser.fftSize);

            const startedAt = Date.now();
            let speechStartedAt = 0; // 1º frame com voz
            let lastVoiceAt = 0; // último frame com voz
            // Limiares (mic com noiseSuppression → ambiente baixo)
            const VOICE_RMS = Number.parseFloat(
              process.env.NEXT_PUBLIC_MANUAL_VAD_RMS ?? "0.02",
            );
            const SILENCE_HANG_MS = 1200; // silêncio após fala → encerra e envia
            const NO_SPEECH_MS = opts?.autoStopMs ?? 8_000; // nunca falou → descarta
            const MAX_MS = 30_000; // teto duro mesmo falando

            monitorTimer = window.setInterval(() => {
              if (
                mediaRecorderRef.current !== recorder ||
                recorder.state === "inactive"
              ) {
                cleanupMonitor();
                return;
              }
              analyser.getByteTimeDomainData(buf);
              let sum = 0;
              for (let i = 0; i < buf.length; i++) {
                const v = (buf[i] - 128) / 128;
                sum += v * v;
              }
              const rms = Math.sqrt(sum / buf.length);
              const now = Date.now();
              const elapsed = now - startedAt;

              if (rms >= VOICE_RMS) {
                if (!speechStartedAt) speechStartedAt = now;
                lastVoiceAt = now;
              }

              const stopAndSend = () => {
                autoStopped = false;
                recorder.stop();
                setIsRecording(false);
              };
              const stopAndDiscard = () => {
                autoStopped = true;
                recorder.stop();
                setIsRecording(false);
              };

              if (speechStartedAt) {
                // Já falou: encerra no silêncio final OU no teto duro.
                if (now - lastVoiceAt >= SILENCE_HANG_MS) stopAndSend();
                else if (elapsed >= MAX_MS) stopAndSend();
              } else if (elapsed >= NO_SPEECH_MS) {
                // Nunca falou → descarta (não envia silêncio ao STT).
                stopAndDiscard();
              }
            }, 100);
          } else if (opts?.autoStopMs && opts.autoStopMs > 0) {
            // Sem AudioContext: cai no timer cego antigo.
            window.setTimeout(() => {
              if (
                mediaRecorderRef.current === recorder &&
                recorder.state !== "inactive"
              ) {
                autoStopped = true;
                recorder.stop();
                setIsRecording(false);
              }
            }, opts.autoStopMs);
          }
        } catch {
          // Monitor é best-effort; recorder segue funcionando via clique/toggle.
        }
      } catch {
        setOrbState("error");
        setError("Permissão de microfone negada ou indisponível");
        setTimeout(() => setOrbState("idle"), 2000);
      }
    },
    [sendTurn, isEmbed],
  );

  const startManualRecordingRef = useRef(startManualRecording);
  startManualRecordingRef.current = startManualRecording;

  const toggleMic = () => {
    if (orbState === "processing" || orbState === "speaking") return;

    // Gravador manual (fallback embed ou modo Manual)
    if (isRecording) {
      stopRecording();
      return;
    }

    if (vadMode) {
      if (wakePhase === "standby") {
        void armForCommand();
        return;
      }
      if (wakePhase === "armed") {
        enterOff();
        return;
      }
      if (wakePhase !== "off") {
        enterOff();
        return;
      }
      // Embed/Portal: sem wake word — toque no orb arma a captura direto.
      if (isEmbed) {
        void armForCommand();
        return;
      }
      if (!wakeWord.supported) {
        setError(
          "Wake word indisponível neste navegador — use Chrome/Edge ou modo Manual",
        );
        return;
      }
      void enterStandby();
      return;
    }

    void startManualRecording();
  };

  const hint = (() => {
    if (!mounted) {
      return "Carregando interface de voz…";
    }
    if (orbState === "interrupted") {
      return "Pode falar — interrompeu a resposta";
    }
    // Enquanto Jarvis fala: sempre indicar fala (nunca "clique no orb")
    if (orbState === "speaking") {
      const lbl = turnPhase
        ? (isEmbed ? PHASE_LABELS_EMBED : PHASE_LABELS)[turnPhase]
        : null;
      return lbl ?? (isEmbed ? "Falando…" : "Jarvis está falando…");
    }
    // Turno em andamento: mostra a sub-fase (transcrevendo → buscando → pensando → falando)
    if (orbState === "processing" && turnPhase) {
      return (isEmbed ? PHASE_LABELS_EMBED : PHASE_LABELS)[turnPhase];
    }
    if (!vadMode) {
      return isRecording
        ? "Gravando… clique no orb para enviar"
        : "Modo manual — clique para falar (sem wake word)";
    }
    if (wakePhase === "standby") {
      return wakeWord.listening
        ? `Aguardando "${WAKE_PHRASE}"… · ou clique no orb para falar`
        : `Iniciando escuta… · diga "${WAKE_PHRASE}" ou clique no orb`;
    }
    if (wakePhase === "armed") {
      return vadActive
        ? "Pode falar — estou ouvindo seu comando"
        : "Preparando captura de áudio…";
    }
    if (wakePhase === "off") {
      if (!vadReady) {
        return "Preparando microfone em segundo plano…";
      }
      return wakeWord.supported
        ? `Clique no orb para ativar · diga "${WAKE_PHRASE}"`
        : "Wake word indisponível — use modo Manual";
    }
    return "Processando…";
  })();

  return (
    <>
      <div
        className={
          isEmbed
            ? "mx-auto flex w-full min-h-0 flex-1 flex-col gap-3 overflow-hidden p-3"
            : "mx-auto flex w-full max-w-[1600px] min-h-0 flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 xl:px-10 2xl:max-w-[1800px]"
        }
      >
        {!isEmbed && (
        <div className="flex flex-wrap items-center justify-end gap-3 text-xs text-[var(--jarvis-fg-muted)]">
          {/* Histórico de conversas — abre o drawer */}
          <button
            type="button"
            onClick={openDrawer}
            aria-label="Abrir histórico de conversas"
            className="mr-auto flex items-center gap-1.5 rounded-full border border-[var(--jarvis-border)] px-3 py-1 text-[var(--jarvis-fg-muted)] transition-colors hover:bg-[var(--jarvis-hover)] hover:text-[var(--jarvis-fg)]"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4M12 8v4l3 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline">Conversas</span>
          </button>
          {/* A6 — health badge async (estado próprio; não re-renderiza o shell) */}
          <InferenceHealthBadge
            shouldSkip={healthShouldSkip}
            onSnapshot={onHealthSnapshot}
          />
          {minutesRemaining !== null && (
            <span>{minutesRemaining} min restantes</span>
          )}
          {lastLatency !== null && (
            <span className="hidden sm:inline">{lastLatency}ms</span>
          )}
          <button
            type="button"
            onClick={() => {
              enterOff();
              setVadMode((v) => !v);
            }}
            className={`rounded-full px-2 py-1 ${
              vadMode
                ? "bg-[var(--jarvis-accent-mint)]/20 text-[var(--jarvis-accent-mint)]"
                : "bg-[var(--jarvis-hover)] text-[var(--jarvis-fg-subtle)]"
            }`}
          >
            {vadMode ? "VAD + Wake word" : "Manual"}
          </button>
          {wakePhase === "standby" && (
            <span className="rounded-full bg-[var(--jarvis-accent-mint)]/15 px-2 py-1 text-[var(--jarvis-accent-mint)]">
              Standby
            </span>
          )}
          {wakePhase === "armed" && (
            <span className="rounded-full bg-[var(--jarvis-accent)]/20 px-2 py-1 text-[var(--jarvis-accent-hover)]">
              Ativo
            </span>
          )}
          <span className="hidden rounded-full bg-[var(--jarvis-hover)] px-2 py-1 text-[var(--jarvis-fg-subtle)] sm:inline">
            OSS turn-based
          </span>
        </div>
        )}

        {/* 3 zonas imersivas (lg+): conversa · orb · widgets — embed = orb + transcript */}
        <div
          className={
            isEmbed
              ? "flex min-h-0 flex-1 flex-col items-center gap-3"
              : "flex min-h-0 flex-1 flex-col gap-4 lg:grid lg:grid-cols-[minmax(320px,1fr)_minmax(280px,400px)_minmax(320px,1fr)] lg:grid-rows-1 lg:items-center lg:gap-6 xl:gap-8"
          }
        >
          {/* centro: orb + controles (primeiro no DOM = topo no mobile) */}
          <div
            className={
              isEmbed
                ? "relative flex flex-1 flex-col items-center justify-center gap-3 py-2"
                : "relative flex flex-col items-center justify-center gap-4 py-2 md:py-4 lg:col-start-2 lg:row-start-1"
            }
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,83,21,0.04),transparent_65%)]"
            />
            <VoiceOrb
              state={orbState}
              onClick={toggleMic}
              disabled={orbState === "processing" || orbState === "speaking"}
            />
            <p
              role="status"
              aria-live="polite"
              className={
                isEmbed
                  ? `max-w-sm px-4 text-center text-sm font-medium ${
                      orbState === "processing"
                        ? "text-[var(--jarvis-accent-vanilla)]"
                        : orbState === "speaking"
                          ? "text-[var(--jarvis-accent-hover)]"
                          : orbState === "listening" || orbState === "armed"
                            ? "text-[var(--jarvis-accent-mint)]"
                            : "text-white/80"
                    }`
                  : "px-4 text-center text-sm text-[var(--jarvis-fg-muted)]"
              }
            >
              {hint}
            </p>
            {error && (
              <p
                role="alert"
                aria-live="assertive"
                className="max-w-md text-center text-sm text-[var(--jarvis-danger-fg)]"
              >
                {error}
              </p>
            )}
          </div>

          {/* esquerda: conversa — oculto no embed (só voz + orb) */}
          {!isEmbed && (
          <div className="flex min-h-0 min-w-0 flex-col lg:col-start-1 lg:row-start-1 lg:h-full lg:self-stretch">
            <TranscriptPanel
              messages={messages}
              streaming={awaitingReply}
              sessionId={activeSessionId}
              actions={{
                onCopyAnswer: handleCopyAnswer,
                onDeleteTurn: handleDeleteTurn,
                onResendTurn: handleResendTurn,
                disabled: orbState === "processing",
              }}
            />
          </div>
          )}

          {!isEmbed && (
          <div className="min-h-0 lg:col-start-3 lg:row-start-1 lg:h-full lg:self-stretch">
            {/* direita: notas de hoje + widgets */}
            <button
              type="button"
              onClick={() => setWidgetsOpenMobile((o) => !o)}
              aria-expanded={widgetsOpenMobile}
              className="flex w-full items-center justify-between rounded-xl border border-[var(--jarvis-border)] bg-[var(--jarvis-hover)] px-4 py-2.5 text-left md:hidden"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--jarvis-accent-vanilla)]">
                Notas & contexto
                {!widgetDismissed && widgets.length > 0
                  ? ` (${widgets.length})`
                  : pinnedWidgets.length > 0
                    ? ` (${pinnedWidgets.length} fixado${pinnedWidgets.length > 1 ? "s" : ""})`
                    : ""}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className={`text-[var(--jarvis-fg-muted)] transition-transform ${
                  widgetsOpenMobile ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              className={`${
                widgetsOpenMobile ? "mt-2 block" : "hidden"
              } scrollbar-invisible scroll-fade-y flex flex-col gap-3 md:block md:fixed md:top-14 md:right-0 md:bottom-0 md:z-40 md:mt-0 md:w-80 md:overflow-y-auto md:border-l md:border-[var(--jarvis-border)] md:bg-[var(--jarvis-bg)]/95 md:p-4 md:backdrop-blur-md lg:static lg:z-auto lg:flex lg:h-full lg:w-auto lg:border-0 lg:bg-transparent lg:px-1 lg:py-3 lg:backdrop-blur-none`}
            >
              <NotesTodayWidget refreshKey={notesRefreshKey} />
              <TasksTodayWidget refreshKey={tasksRefreshKey} />
              {(pinnedWidgets.length > 0 ||
                (!widgetDismissed && widgets.length > 0)) && (
                <WidgetPanel
                  widgets={
                    widgetDismissed
                      ? pinnedWidgets
                      : displayWidgets
                  }
                  pinnedIds={pinnedIdSet}
                  onTogglePin={togglePinWidget}
                  onDismiss={() => {
                    setWidgetDismissed(true);
                    setWidgets([]);
                  }}
                  onAgentJobComplete={(result) => {
                    if (pendingAgentJobIdRef.current === result.jobId) {
                      pendingAgentJobIdRef.current = null;
                    }
                    const text =
                      result.status === "done"
                        ? `Agent Bridge concluído${result.workspace ? ` (workspace ${result.workspace})` : ""}. ${result.summary}`
                        : `Agent Bridge falhou. ${result.summary}`;
                    setMessages((prev) => [
                      ...prev,
                      {
                        role: "assistant",
                        content: text,
                        timestamp: Date.now(),
                      },
                    ]);
                    void speakJarvis(text).catch(() => {});
                  }}
                />
              )}
            </div>
          </div>
          )}
        </div>
      </div>

      <FreeLimitModal
        open={limitModalOpen}
        onClose={() => setLimitModalOpen(false)}
      />

      {!isEmbed && (
      <ConversationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        loading={sessionsLoading}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
      />
      )}

      {!isEmbed && (
      <footer className="flex flex-col items-center gap-1.5 border-t border-[var(--jarvis-border)] px-4 py-3 text-center text-xs text-[var(--jarvis-fg-subtle)] sm:flex-row sm:justify-between md:px-6">
        <span>
          🔒 Áudio não gravado · Wake word → Silero VAD → STT → LLM → TTS
        </span>
        <PoweredByFoursys />
      </footer>
      )}
    </>
  );
}

function getSupportedMimeType(): string {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/wav",
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "audio/webm";
}
