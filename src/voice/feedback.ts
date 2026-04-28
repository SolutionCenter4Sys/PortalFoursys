/**
 * Feedback por síntese de voz (Web Speech API).
 *
 * Mantém uma única utterance por vez, cancela a anterior se uma nova
 * chega antes de terminar. No-op silencioso se a API não existe.
 */
import type { IdiomaVoz } from './types'

let lastUtter: SpeechSynthesisUtterance | null = null

export function falar(texto: string, idioma: IdiomaVoz, opts?: { silenciar?: boolean }): void {
  if (opts?.silenciar) return
  if (typeof window === 'undefined') return
  const synth = window.speechSynthesis
  if (!synth || !texto) return
  try {
    if (lastUtter) synth.cancel()
    const u = new SpeechSynthesisUtterance(texto)
    u.lang = idioma
    u.rate = 1.05
    u.pitch = 1
    u.volume = 1
    lastUtter = u
    synth.speak(u)
  } catch {
    // ignore: motores não disponíveis em alguns ambientes (ex.: jsdom)
  }
}

export function pararFala(): void {
  if (typeof window === 'undefined') return
  try {
    window.speechSynthesis?.cancel()
    lastUtter = null
  } catch {
    /* noop */
  }
}
