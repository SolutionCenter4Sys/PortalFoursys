"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { float32ToWavBlob } from "@/lib/voice/float32-to-wav";
import { scheduleVadPrefetch } from "@/lib/voice/prefetch-vad";

/** ADR-003 defaults — turn-based speech_end (not Realtime interrupt).
 *  Ambiente ruidoso: subir positiveSpeechThreshold (0.5→0.7/0.8) e minSpeechMs
 *  (90→250) via env reduz gatilho em ruído de fundo. */
function envNum(key: string, fallback: number, min: number, max: number): number {
  const raw = Number.parseFloat(process.env[key] ?? "");
  return Number.isFinite(raw) ? Math.min(max, Math.max(min, raw)) : fallback;
}

export const VAD_DEFAULTS = {
  positiveSpeechThreshold: envNum("NEXT_PUBLIC_VAD_POSITIVE_THRESHOLD", 0.5, 0.2, 0.95),
  negativeSpeechThreshold: envNum("NEXT_PUBLIC_VAD_NEGATIVE_THRESHOLD", 0.35, 0.1, 0.9),
  minSpeechMs: envNum("NEXT_PUBLIC_VAD_MIN_SPEECH_MS", 90, 40, 1000),
  // Pré-padding: preserva o início da fala (evita cortar a 1ª sílaba).
  preSpeechPadMs: 250,
  // Silêncio tolerado antes de considerar a fala encerrada. 800ms ainda corta
  // em pausas longas; 1400ms é mais confortável. Env / localStorage:
  // NEXT_PUBLIC_VAD_REDEMPTION_MS ou jarvis_vad_redemption_ms (200–3000).
  redemptionMs: 1400,
} as const;

export const VAD_REDEMPTION_STORAGE_KEY = "jarvis_vad_redemption_ms";

/** redemptionMs efetivo — localStorage (Settings) > env > default. */
export function resolveRedemptionMs(): number {
  if (typeof window !== "undefined") {
    const stored = Number.parseInt(
      window.localStorage.getItem(VAD_REDEMPTION_STORAGE_KEY) ?? "",
      10,
    );
    if (Number.isFinite(stored)) return Math.min(3000, Math.max(200, stored));
  }
  const raw = Number.parseInt(
    process.env.NEXT_PUBLIC_VAD_REDEMPTION_MS ?? "",
    10,
  );
  if (Number.isFinite(raw)) return Math.min(3000, Math.max(200, raw));
  return VAD_DEFAULTS.redemptionMs;
}

type MicVadInstance = {
  start: () => void | Promise<void>;
  pause: () => void | Promise<void>;
  destroy: () => void | Promise<void>;
};

type UseSileroVadOptions = {
  enabled: boolean;
  /**
   * A5 — não sobe MicVAD no boot. Espera idle + prefetch dos WASM/ONNX,
   * depois instancia. Default true. Desliga só em testes.
   */
  bootAfterIdle?: boolean;
  onSpeechStart?: () => void;
  onSpeechEnd: (blob: Blob) => void;
  onError?: (message: string) => void;
  /** chamado 1× por ciclo de boot quando MicVAD fica ready */
  onReady?: () => void;
};

export function useSileroVad({
  enabled,
  bootAfterIdle = true,
  onSpeechStart,
  onSpeechEnd,
  onError,
  onReady,
}: UseSileroVadOptions) {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  // Incrementar força destruição + recriação do MicVAD (libera mic e reinicia)
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const vadRef = useRef<MicVadInstance | null>(null);
  const callbacksRef = useRef({ onSpeechStart, onSpeechEnd, onError, onReady });
  callbacksRef.current = { onSpeechStart, onSpeechEnd, onError, onReady };

  useEffect(() => {
    if (!enabled) {
      vadRef.current?.destroy();
      vadRef.current = null;
      setReady(false);
      setActive(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        // A5 — 1º paint livre; só depois do idle baixa ORT/ONNX e sobe MicVAD
        if (bootAfterIdle) {
          await scheduleVadPrefetch();
          if (cancelled) return;
        }

        const { MicVAD } = await import("@ricky0123/vad-web");
        if (cancelled) return;

        const vad = await MicVAD.new({
          baseAssetPath: "/vad/",
          onnxWASMBasePath: "/vad/",
          // Anti-eco: o mic NÃO deve captar o alto-falante (saudação/resposta do
          // próprio Jarvis). echoCancellation corta o feedback na origem.
          // `additionalAudioConstraints` não é tipado nesta versão do vad-web,
          // mas é repassado ao getUserMedia interno em runtime.
          ...({
            additionalAudioConstraints: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          } as Record<string, unknown>),
          positiveSpeechThreshold: VAD_DEFAULTS.positiveSpeechThreshold,
          negativeSpeechThreshold: VAD_DEFAULTS.negativeSpeechThreshold,
          minSpeechMs: VAD_DEFAULTS.minSpeechMs,
          preSpeechPadMs: VAD_DEFAULTS.preSpeechPadMs,
          redemptionMs: resolveRedemptionMs(),
          onSpeechStart: () => {
            callbacksRef.current.onSpeechStart?.();
          },
          onSpeechEnd: (audio) => {
            const blob = float32ToWavBlob(audio, 16000);
            callbacksRef.current.onSpeechEnd(blob);
          },
        });

        if (cancelled) {
          vad.destroy();
          return;
        }

        vadRef.current = vad;
        setReady(true);
        callbacksRef.current.onReady?.();
      } catch (err) {
        callbacksRef.current.onError?.(
          err instanceof Error ? err.message : "Falha ao carregar Silero VAD",
        );
      }
    })();

    return () => {
      cancelled = true;
      vadRef.current?.destroy();
      vadRef.current = null;
      setReady(false);
      setActive(false);
    };
  }, [enabled, bootAfterIdle, reloadTrigger]);

  const start = useCallback(async () => {
    if (!vadRef.current || !ready) return false;
    try {
      await vadRef.current.start();
      setActive(true);
      return true;
    } catch (err) {
      callbacksRef.current.onError?.(
        err instanceof Error ? err.message : "Falha ao iniciar captura de áudio",
      );
      setActive(false);
      return false;
    }
  }, [ready]);

  const pause = useCallback(() => {
    vadRef.current?.pause();
    setActive(false);
  }, []);

  /**
   * Destrói o MicVAD imediatamente, liberando o stream de microfone.
   * Não dispara recriação — chame reinitialize() quando quiser retomar.
   */
  const release = useCallback(() => {
    vadRef.current?.destroy();
    vadRef.current = null;
    setReady(false);
    setActive(false);
  }, []);

  /**
   * Dispara recriação do MicVAD (obtém novo getUserMedia).
   * Chamar após release() para retomar captura.
   */
  const reinitialize = useCallback(() => {
    setReloadTrigger((t) => t + 1);
  }, []);

  return { ready, active, start, pause, release, reinitialize };
}
