/**
 * B6 — fila de áudio TTS com prefetch (gap alvo ≤300 ms entre frases).
 *
 * Pré-carrega o próximo clip enquanto o atual toca; pad de cauda menor
 * quando já há próximo bufferizado.
 */

import { waitAudioFullyPlayed } from "@/lib/voice/wait-audio";

const DEFAULT_MAX_GAP_MS = 300;

function whenCanPlay(audio: HTMLAudioElement): Promise<void> {
  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      audio.removeEventListener("canplaythrough", finish);
      audio.removeEventListener("canplay", finish);
      audio.removeEventListener("error", finish);
      resolve();
    };
    audio.addEventListener("canplaythrough", finish, { once: true });
    audio.addEventListener("canplay", finish, { once: true });
    audio.addEventListener("error", finish, { once: true });
    // timeout de segurança — não trava a fila se metadata falhar
    window.setTimeout(finish, 2500);
  });
}

function preload(src: string): HTMLAudioElement {
  const a = new Audio();
  a.preload = "auto";
  a.src = src;
  void a.load();
  return a;
}

export type StreamAudioPlayerStats = {
  gapsMs: number[];
  maxGapMs: number;
  overBudget: number;
};

export function createStreamAudioPlayer(opts?: {
  maxGapMs?: number;
  /** pad (ms) quando há próximo clip pronto */
  seamlessPadMs?: number;
  /** pad (ms) no último clip */
  finalPadMs?: number;
}) {
  const maxGapMs = opts?.maxGapMs ?? DEFAULT_MAX_GAP_MS;
  const seamlessPadMs = opts?.seamlessPadMs ?? 15;
  const finalPadMs = opts?.finalPadMs ?? 50;

  const buffer: HTMLAudioElement[] = [];
  let pumping = false;
  let pumpChain: Promise<void> = Promise.resolve();
  let lastEndedAt = 0;
  let stopped = false;
  let nowPlaying: HTMLAudioElement | null = null;
  const gapsMs: number[] = [];

  function hardStop(el: HTMLAudioElement | null): void {
    if (!el) return;
    try {
      el.pause();
      el.src = "";
      el.load();
    } catch {
      /* ignore */
    }
  }

  async function pump(): Promise<void> {
    if (pumping) return;
    pumping = true;
    try {
      while (buffer.length > 0) {
        if (stopped) break;
        const current = buffer.shift()!;
        nowPlaying = current;
        // aquece o próximo enquanto garante o atual
        if (buffer[0]) void whenCanPlay(buffer[0]);
        await whenCanPlay(current);
        if (stopped) {
          hardStop(current);
          break;
        }

        if (lastEndedAt > 0) {
          const gap = Date.now() - lastEndedAt;
          gapsMs.push(gap);
          if (gap > maxGapMs) {
            console.warn(
              `[voice/B6] gap entre frases ${gap}ms (alvo ≤${maxGapMs}ms)`,
            );
          }
        }

        const hasNext = buffer.length > 0;
        await waitAudioFullyPlayed(current, {
          tailPadMs: hasNext ? seamlessPadMs : finalPadMs,
        });
        lastEndedAt = Date.now();
      }
    } finally {
      pumping = false;
    }
  }

  return {
    enqueue(src: string) {
      if (stopped) return;
      buffer.push(preload(src));
      pumpChain = pumpChain.then(() => pump());
    },
    /** Interrompe imediatamente: para o clip atual, descarta a fila e impede
     *  novos enqueues. Usado em barge-in / novo turno para evitar áudios
     *  simultâneos de players diferentes. */
    stop() {
      stopped = true;
      const pending = buffer.splice(0, buffer.length);
      hardStop(nowPlaying);
      nowPlaying = null;
      for (const el of pending) hardStop(el);
    },
    async done(): Promise<StreamAudioPlayerStats> {
      await pumpChain;
      return {
        gapsMs,
        maxGapMs: gapsMs.length ? Math.max(...gapsMs) : 0,
        overBudget: gapsMs.filter((g) => g > maxGapMs).length,
      };
    },
  };
}
