/** VAD por energia (RMS) com piso de ruído adaptativo. */

export type SilenceVadOpts = {
  stream: MediaStream
  minSpeechMs?: number
  silenceMs?: number
  maxMs?: number
  /** ignora energia no início (eco do TTS / calibração) */
  ignoreMs?: number
  onSpeechStart?: () => void
  onSilence: () => void
}

function rmsFromBytes(buf: Uint8Array): number {
  let sum = 0
  for (let i = 0; i < buf.length; i++) {
    const v = (buf[i] - 128) / 128
    sum += v * v
  }
  return Math.sqrt(sum / buf.length)
}

export function startSilenceVad(opts: SilenceVadOpts): () => void {
  const minSpeechMs = opts.minSpeechMs ?? 450
  const silenceMs = opts.silenceMs ?? 900
  const maxMs = opts.maxMs ?? 16_000
  const calibrateMs = 320
  const ignoreMs = opts.ignoreMs ?? 500

  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  const ctx = new AC()
  const src = ctx.createMediaStreamSource(opts.stream)
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 1024
  analyser.smoothingTimeConstant = 0.35
  src.connect(analyser)

  const buf = new Uint8Array(analyser.fftSize)
  let noiseFloor = 0.02
  let samples = 0
  let noiseSum = 0
  let heardSpeech = false
  let speechAt = 0
  let silentSince = 0
  let raf = 0
  const started = Date.now()
  let stopped = false

  const tick = () => {
    if (stopped) return
    analyser.getByteTimeDomainData(buf)
    const rms = rmsFromBytes(buf)
    const now = Date.now()
    const elapsed = now - started

    if (elapsed < calibrateMs) {
      noiseSum += rms
      samples += 1
      raf = requestAnimationFrame(tick)
      return
    }
    if (samples > 0) {
      noiseFloor = Math.max(0.004, Math.min(0.06, noiseSum / samples))
      samples = 0
    }
    if (elapsed < ignoreMs) {
      raf = requestAnimationFrame(tick)
      return
    }

    const speechRms = Math.max(noiseFloor * 2.4, noiseFloor + 0.012)
    const silenceRms = noiseFloor * 1.55 + 0.004

    if (rms >= speechRms) {
      if (!heardSpeech) {
        heardSpeech = true
        speechAt = now
        opts.onSpeechStart?.()
      }
      silentSince = 0
    } else if (heardSpeech && rms < silenceRms) {
      if (!silentSince) silentSince = now
      const spokeLongEnough = now - speechAt >= minSpeechMs
      if (spokeLongEnough && now - silentSince >= silenceMs) {
        stop()
        opts.onSilence()
        return
      }
    }

    if (elapsed >= maxMs) {
      stop()
      opts.onSilence()
      return
    }
    raf = requestAnimationFrame(tick)
  }

  const stop = () => {
    if (stopped) return
    stopped = true
    cancelAnimationFrame(raf)
    try {
      src.disconnect()
    } catch {
      /* noop */
    }
    void ctx.close()
  }

  void ctx.resume()
  raf = requestAnimationFrame(tick)
  return stop
}
