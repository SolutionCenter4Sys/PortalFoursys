/** Solicita permissão de microfone e libera stream imediatamente. */
export async function ensureMicPermission(): Promise<void> {
  const stream = await navigator.mediaDevices.getUserMedia({
    // Anti-eco: mesmas constraints do VAD — evita captar o alto-falante.
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });
  stream.getTracks().forEach((t) => t.stop());
}

/** Aguarda liberação do microfone após SpeechRecognition. */
export function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Aguarda condição com polling (ex.: VAD carregando).
 * Retorna false se timeout.
 */
export async function waitUntil(
  predicate: () => boolean,
  opts: { intervalMs?: number; timeoutMs?: number } = {},
): Promise<boolean> {
  const { intervalMs = 200, timeoutMs = 12_000 } = opts;
  const started = Date.now();
  while (!predicate()) {
    if (Date.now() - started > timeoutMs) return false;
    await delayMs(intervalMs);
  }
  return true;
}
