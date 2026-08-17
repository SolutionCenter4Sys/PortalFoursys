/**
 * A5 — Prefetch dos assets Silero/ORT **depois** do idle do browser.
 * Não compete com o 1º paint de `/app`. MicVAD.new() depois usa o HTTP cache.
 */

const VAD_ASSET_PATHS = [
  "/vad/ort-wasm-simd-threaded.wasm",
  "/vad/ort-wasm-simd-threaded.mjs",
  "/vad/silero_vad_v5.onnx",
  "/vad/silero_vad_legacy.onnx",
  "/vad/vad.worklet.bundle.min.js",
] as const;

let prefetchPromise: Promise<void> | null = null;

/** Baixa os assets críticos do VAD para o cache HTTP (idempotente). */
export function prefetchVadAssets(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (prefetchPromise) return prefetchPromise;

  prefetchPromise = (async () => {
    await Promise.all(
      VAD_ASSET_PATHS.map(async (url) => {
        try {
          const res = await fetch(url, { credentials: "same-origin", cache: "force-cache" });
          // consome o body para garantir cache no browser
          if (res.ok) await res.arrayBuffer();
        } catch {
          /* best-effort — MicVAD.new tentará de novo */
        }
      }),
    );
  })();

  return prefetchPromise;
}

/**
 * Agenda o prefetch quando o browser estiver idle.
 * Fallback: setTimeout se requestIdleCallback não existir.
 */
export function scheduleVadPrefetch(opts?: {
  /** timeout máximo antes de forçar o prefetch (ms). Default 2500. */
  timeoutMs?: number;
  /** atraso mínimo pós-mount antes de idle (ms). Default 400. */
  minDelayMs?: number;
}): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const timeoutMs = opts?.timeoutMs ?? 2500;
  const minDelayMs = opts?.minDelayMs ?? 400;

  return new Promise((resolve) => {
    const run = () => {
      void prefetchVadAssets().finally(() => resolve());
    };

    const afterMinDelay = () => {
      const ric = (
        window as Window & {
          requestIdleCallback?: (
            cb: IdleRequestCallback,
            opts?: IdleRequestOptions,
          ) => number;
        }
      ).requestIdleCallback;

      if (typeof ric === "function") {
        ric(() => run(), { timeout: timeoutMs });
      } else {
        window.setTimeout(run, Math.min(timeoutMs, 1200));
      }
    };

    window.setTimeout(afterMinDelay, minDelayMs);
  });
}
