/** Saída de áudio do overlay: desbloqueia no clique e toca via AudioContext.
 *  `new Audio().play()` após fetch do TTS é bloqueado pelo Chrome (gesto já expirou). */

const SILENT_WAV =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'

type AC = AudioContext

let ctx: AC | null = null
let html: HTMLAudioElement | null = null
let activeSource: AudioBufferSourceNode | null = null

function AudioCtx(): typeof AudioContext {
  return (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  )
}

export async function unlockJarvisAudio(): Promise<void> {
  try {
    const Ctor = AudioCtx()
    if (!ctx || ctx.state === 'closed') ctx = new Ctor()
    if (ctx.state === 'suspended') await ctx.resume()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    gain.gain.value = 0.00008
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.04)
  } catch {
    /* segue HTMLAudio */
  }

  try {
    if (!html) {
      html = new Audio()
      html.preload = 'auto'
    }
    html.muted = false
    html.volume = 1
    html.src = SILENT_WAV
    await html.play().catch(() => undefined)
  } catch {
    /* noop */
  }
}

async function getCtx(): Promise<AC> {
  const Ctor = AudioCtx()
  if (!ctx || ctx.state === 'closed') ctx = new Ctor()
  if (ctx.state === 'suspended') await ctx.resume()
  return ctx
}

function waitSourceEnd(source: AudioBufferSourceNode, duration: number): Promise<void> {
  return new Promise((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      if (activeSource === source) activeSource = null
      resolve()
    }
    source.onended = finish
    window.setTimeout(finish, Math.ceil(duration * 1000) + 80)
  })
}

async function decodeDataUrl(audioCtx: AC, src: string): Promise<AudioBuffer> {
  const res = await fetch(src)
  const raw = await res.arrayBuffer()
  return audioCtx.decodeAudioData(raw.slice(0))
}

export async function playDataUrl(src: string): Promise<void> {
  const audioCtx = await getCtx()
  try {
    const buffer = await decodeDataUrl(audioCtx, src)
    const source = audioCtx.createBufferSource()
    source.buffer = buffer
    source.connect(audioCtx.destination)
    activeSource = source
    source.start()
    await waitSourceEnd(source, buffer.duration)
    return
  } catch {
    /* HTMLAudio fallback */
  }

  const el = html ?? new Audio()
  html = el
  el.muted = false
  el.volume = 1
  el.src = src
  await el.play()
  await new Promise<void>((resolve, reject) => {
    el.onended = () => resolve()
    el.onerror = () => reject(new Error('audio element error'))
    const dur = el.duration
    if (Number.isFinite(dur) && dur > 0) {
      window.setTimeout(() => resolve(), dur * 1000 + 80)
    }
  })
}

export function stopJarvisAudio() {
  try {
    activeSource?.stop()
  } catch {
    /* noop */
  }
  activeSource = null
  try {
    html?.pause()
    if (html) html.currentTime = 0
  } catch {
    /* noop */
  }
  try {
    window.speechSynthesis?.cancel()
  } catch {
    /* noop */
  }
}

export function createCtxStreamPlayer() {
  let chain: Promise<void> = Promise.resolve()
  let nextAt = 0

  async function playOne(src: string) {
    const audioCtx = await getCtx()
    const buffer = await decodeDataUrl(audioCtx, src)
    const startAt = Math.max(audioCtx.currentTime + 0.02, nextAt)
    const source = audioCtx.createBufferSource()
    source.buffer = buffer
    source.connect(audioCtx.destination)
    activeSource = source
    source.start(startAt)
    nextAt = startAt + buffer.duration
    const waitMs = Math.max(0, (nextAt - audioCtx.currentTime) * 1000)
    await new Promise<void>((resolve) => {
      source.onended = () => resolve()
      window.setTimeout(() => resolve(), waitMs + 60)
    })
  }

  return {
    enqueue(src: string) {
      chain = chain.then(() => playOne(src)).catch((err) => {
        console.warn('[jarvis] audio chunk failed', err)
      })
    },
    async done() {
      await chain
    },
    stop() {
      stopJarvisAudio()
      chain = Promise.resolve()
      nextAt = 0
    },
  }
}
