/**
 * Espera o <audio> tocar até o fim real.
 * data: URLs + Chrome às vezes disparam `onended` cedo → corta a última palavra.
 * Estratégia: floor pelo duration + pad configurável (B6: pad curto entre clips).
 */
export function waitAudioFullyPlayed(
  audio: HTMLAudioElement,
  opts?: { tailPadMs?: number },
): Promise<void> {
  const tailPadMs = opts?.tailPadMs ?? 40;

  return new Promise((resolve) => {
    let settled = false;
    let durationTimer: ReturnType<typeof setTimeout> | null = null;

    const done = () => {
      if (settled) return;
      settled = true;
      if (durationTimer) clearTimeout(durationTimer);
      resolve();
    };

    const armDurationFloor = () => {
      const dur = audio.duration;
      if (!Number.isFinite(dur) || dur <= 0) return;
      if (durationTimer) clearTimeout(durationTimer);
      const remainingMs = Math.max(0, (dur - audio.currentTime) * 1000);
      // B6 — pad curto (antes +150ms +80ms ≈ 230ms de silêncio entre frases)
      durationTimer = setTimeout(done, Math.ceil(remainingMs) + tailPadMs);
    };

    audio.onloadedmetadata = () => armDurationFloor();
    audio.ondurationchange = () => armDurationFloor();
    audio.onended = () => {
      // Se já temos duration, o timer é a fonte da verdade (evita corte precoce)
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        armDurationFloor();
        return;
      }
      done();
    };
    audio.onerror = () => done();

    void audio.play().then(() => armDurationFloor()).catch(() => done());
  });
}
