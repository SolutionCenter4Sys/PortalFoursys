"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  containsWakePhrase,
  extractCommandAfterWake,
  isWakeWordSupported,
} from "@/lib/voice/wake-word";

type WakeWordEvent = {
  /** Comando na mesma frase, se houver ("Olá Jarvis, …"). */
  inlineCommand?: string;
};

type UseWakeWordOptions = {
  enabled: boolean;
  onWakeWord: (event: WakeWordEvent) => void;
  onError?: (message: string) => void;
};

type SpeechRecognitionInstance = EventTarget & {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [alt: number]: { transcript: string };
    };
  };
};

function createRecognition(): SpeechRecognitionInstance | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.SpeechRecognition ?? window.webkitSpeechRecognition;
  if (!Ctor) return null;
  return new Ctor() as SpeechRecognitionInstance;
}

export function useWakeWord({
  enabled,
  onWakeWord,
  onError,
}: UseWakeWordOptions) {
  /** false no SSR; detectado no useEffect — evita hydration mismatch */
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const enabledRef = useRef(enabled);
  const shouldRestartRef = useRef(false);
  const firedRef = useRef(false);
  const callbacksRef = useRef({ onWakeWord, onError });

  useEffect(() => {
    setSupported(isWakeWordSupported());
  }, []);

  useEffect(() => {
    callbacksRef.current = { onWakeWord, onError };
  }, [onWakeWord, onError]);

  const stopInternal = useCallback(() => {
    shouldRestartRef.current = false;
    firedRef.current = false;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
  }, []);

  const stop = useCallback(() => {
    stopInternal();
    setListening(false);
  }, [stopInternal]);

  const start = useCallback(() => {
    if (!supported) return;

    stopInternal();
    shouldRestartRef.current = true;
    firedRef.current = false;

    const recognition = createRecognition();
    if (!recognition) {
      callbacksRef.current.onError?.(
        "Reconhecimento de voz não disponível neste navegador",
      );
      return;
    }

    recognition.lang = "pt-BR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event) => {
      if (firedRef.current) return;

      let combined = "";
      for (let i = 0; i < event.results.length; i++) {
        combined += ` ${event.results[i][0].transcript}`;
      }

      if (!containsWakePhrase(combined)) return;

      firedRef.current = true;
      shouldRestartRef.current = false;

      const inlineCommand = extractCommandAfterWake(combined) ?? undefined;
      recognition.stop();
      setListening(false);
      callbacksRef.current.onWakeWord({ inlineCommand });
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted" || event.error === "no-speech") return;
      if (event.error === "not-allowed") {
        callbacksRef.current.onError?.(
          "Permissão de microfone negada para wake word",
        );
        shouldRestartRef.current = false;
        setListening(false);
        return;
      }
      // Rede/indisponível — reinicia no onend
    };

    recognition.onend = () => {
      setListening(false);
      if (shouldRestartRef.current && enabledRef.current && !firedRef.current) {
        try {
          recognition.start();
          setListening(true);
        } catch {
          // start() pode falhar se chamado cedo demais
          setTimeout(() => {
            if (shouldRestartRef.current && enabledRef.current) {
              try {
                recognition.start();
                setListening(true);
              } catch {
                /* noop */
              }
            }
          }, 300);
        }
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setListening(true);
    } catch (err) {
      callbacksRef.current.onError?.(
        err instanceof Error ? err.message : "Falha ao iniciar wake word",
      );
    }
  }, [supported, stop]);

  useEffect(() => {
    enabledRef.current = enabled;
    if (!enabled) {
      stopInternal();
      setListening(false);
      return;
    }
    if (supported) start();
  }, [enabled, supported, start, stopInternal]);

  useEffect(() => () => stopInternal(), [stopInternal]);

  return { supported, listening, start, stop };
}
