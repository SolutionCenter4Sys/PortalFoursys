/**
 * Browser STT — captura um único comando via Web Speech API.
 * Usado no modo LLM-only (sem Whisper server).
 */

export type BrowserSttResult = {
  transcript: string;
  confidence: number;
};

type SpeechRecognitionType = typeof window extends { SpeechRecognition: infer T }
  ? T
  : typeof window extends { webkitSpeechRecognition: infer T }
    ? T
    : never;

export function isBrowserSttSupported(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    (window as Window & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
      .SpeechRecognition ??
      (window as Window & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .webkitSpeechRecognition,
  );
}

/**
 * Captura um único comando de voz e retorna o transcript.
 * Resolve quando fala termina ou timeout (8s).
 * Rejeita se não suportado ou permissão negada.
 */
export function captureCommand(timeoutMs = 8_000): Promise<BrowserSttResult> {
  return new Promise((resolve, reject) => {
    if (!isBrowserSttSupported()) {
      reject(new Error("Web Speech API não suportada neste navegador"));
      return;
    }

    const Ctor =
      (
        window as Window & {
          SpeechRecognition?: new () => SpeechRecognition;
          webkitSpeechRecognition?: new () => SpeechRecognition;
        }
      ).SpeechRecognition ??
      (
        window as Window & {
          SpeechRecognition?: new () => SpeechRecognition;
          webkitSpeechRecognition?: new () => SpeechRecognition;
        }
      ).webkitSpeechRecognition;

    if (!Ctor) {
      reject(new Error("SpeechRecognition não disponível"));
      return;
    }

    const recognition = new Ctor();
    recognition.lang = "pt-BR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    let done = false;

    const finish = (result: BrowserSttResult | Error) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      recognition.abort();
      if (result instanceof Error) reject(result);
      else resolve(result);
    };

    const timer = setTimeout(
      () => finish(new Error("Tempo esgotado — nenhuma fala detectada")),
      timeoutMs,
    );

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const alt = e.results[0]?.[0];
      if (alt) {
        finish({ transcript: alt.transcript.trim(), confidence: alt.confidence });
      }
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error === "no-speech") {
        finish(new Error("Nenhuma fala detectada"));
      } else {
        finish(new Error(`Erro STT: ${e.error}`));
      }
    };

    recognition.onend = () => {
      if (!done) finish(new Error("Reconhecimento encerrado sem resultado"));
    };

    try {
      recognition.start();
    } catch (err) {
      finish(err instanceof Error ? err : new Error(String(err)));
    }
  });
}
