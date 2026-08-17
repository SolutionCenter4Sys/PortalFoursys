/** Float32 PCM → WAV 16-bit mono (Whisper / Gemini STT). */

export function float32ToWavBlob(samples: Float32Array, sampleRate: number): Blob {
  const bytesPerSample = 2
  const dataSize = samples.length * bytesPerSample
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * bytesPerSample, true)
  view.setUint16(32, bytesPerSample, true)
  view.setUint16(34, 16, true)
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  let offset = 44
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i] ?? 0))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    offset += 2
  }

  return new Blob([buffer], { type: 'audio/wav' })
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
}

function rms(data: Float32Array): number {
  let s = 0
  for (let i = 0; i < data.length; i++) s += data[i] * data[i]
  return Math.sqrt(s / data.length)
}

export type UtteranceListen = {
  stop: () => { blob: Blob; durationMs: number; heardSpeech: boolean }
}

type Opts = {
  stream: MediaStream
  lang: 'pt' | 'en'
  /** usuário parou de falar (só se houve fala) */
  onUtteranceEnd: () => void
}

/**
 * Um AudioContext: PCM + VAD. Web Speech só para detectar fim de fala
 * (não usa o transcript do browser — STT continua no Jarvis).
 */
export function startUtteranceListen(opts: Opts): UtteranceListen {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  const ctx = new AC({ sampleRate: 16000 })
  const src = ctx.createMediaStreamSource(opts.stream)
  const proc = ctx.createScriptProcessor(4096, 1, 1)
  const mute = ctx.createGain()
  mute.gain.value = 0
  src.connect(proc)
  proc.connect(mute)
  mute.connect(ctx.destination)
  void ctx.resume()

  const chunks: Float32Array[] = []
  const started = Date.now()
  let heardSpeech = false
  let speechAt = 0
  let silentSince = 0
  let noiseSum = 0
  let noiseN = 0
  let noiseFloor = 0.012
  let ended = false
  let stopped = false

  const ignoreMs = 350
  const calibrateMs = 280
  const minSpeechMs = 500
  const silenceMs = 1100
  const maxMs = 18_000

  const fireEnd = () => {
    if (ended || stopped) return
    if (!heardSpeech) return
    ended = true
    opts.onUtteranceEnd()
  }

  proc.onaudioprocess = (e) => {
    if (stopped || ended) return
    const input = e.inputBuffer.getChannelData(0)
    chunks.push(new Float32Array(input))
    const now = Date.now()
    const elapsed = now - started
    const level = rms(input)

    if (elapsed < calibrateMs) {
      noiseSum += level
      noiseN += 1
      return
    }
    if (noiseN > 0) {
      noiseFloor = Math.max(0.004, Math.min(0.05, noiseSum / noiseN))
      noiseN = 0
    }
    if (elapsed < ignoreMs) return

    const speechRms = Math.max(noiseFloor * 2.8, noiseFloor + 0.01)
    const silenceRms = noiseFloor * 1.7 + 0.003

    if (level >= speechRms) {
      if (!heardSpeech) {
        heardSpeech = true
        speechAt = now
      }
      silentSince = 0
    } else if (heardSpeech && level < silenceRms) {
      if (!silentSince) silentSince = now
      if (now - speechAt >= minSpeechMs && now - silentSince >= silenceMs) {
        fireEnd()
        return
      }
    }

    if (elapsed >= maxMs && heardSpeech) fireEnd()
  }

  const Rec = window.SpeechRecognition ?? window.webkitSpeechRecognition
  let rec: SpeechRecognition | null = null
  if (Rec) {
    rec = new Rec()
    rec.lang = opts.lang === 'en' ? 'en-US' : 'pt-BR'
    rec.continuous = false
    rec.interimResults = true
    rec.maxAlternatives = 1
    let srSpoke = false
    rec.onspeechstart = () => {
      srSpoke = true
      heardSpeech = true
      if (!speechAt) speechAt = Date.now()
    }
    rec.onspeechend = () => {
      if (srSpoke) window.setTimeout(fireEnd, 280)
    }
    rec.onend = () => {
      if (stopped || ended) return
      if (srSpoke) {
        fireEnd()
        return
      }
      try {
        rec?.start()
      } catch {
        /* already started */
      }
    }
    rec.onerror = () => {
      /* energia VAD segue */
    }
    try {
      rec.start()
    } catch {
      rec = null
    }
  }

  return {
    stop() {
      if (stopped) {
        return { blob: new Blob([], { type: 'audio/wav' }), durationMs: 0, heardSpeech: false }
      }
      stopped = true
      ended = true
      try {
        rec?.abort()
      } catch {
        /* noop */
      }
      rec = null
      const sampleRate = ctx.sampleRate
      try {
        proc.disconnect()
        src.disconnect()
        mute.disconnect()
      } catch {
        /* noop */
      }
      void ctx.close()
      let total = 0
      for (const c of chunks) total += c.length
      const samples = new Float32Array(total)
      let o = 0
      for (const c of chunks) {
        samples.set(c, o)
        o += c.length
      }
      return {
        blob: float32ToWavBlob(samples, sampleRate),
        durationMs: sampleRate > 0 ? (total / sampleRate) * 1000 : 0,
        heardSpeech,
      }
    },
  }
}
