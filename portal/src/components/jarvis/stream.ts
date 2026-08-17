import { createStreamAudioPlayer } from './audio-queue'

export type ChatTurn = { role: 'user' | 'assistant'; content: string }

type StreamEvent = {
  type: string
  transcript?: string
  full?: string
  text?: string
  mime?: string
  b64?: string
  error?: string
}

export async function runVoiceStream(
  form: FormData,
  opts: {
    signal: AbortSignal
    onTranscript: (text: string) => void
    onAssistantText: (text: string) => void
    onSpeaking: () => void
  },
): Promise<string> {
  const res = await fetch('/api/voice/stream', {
    method: 'POST',
    body: form,
    signal: opts.signal,
  })
  if (!res.ok || !res.body) {
    const j = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(j.error ?? `Jarvis API HTTP ${res.status}`)
  }

  const player = createStreamAudioPlayer()
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  let assistantText = ''
  let firstAudio = true

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    let nl: number
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim()
      buf = buf.slice(nl + 1)
      if (!line) continue
      const f = JSON.parse(line) as StreamEvent
      if (f.type === 'transcript' && f.transcript) opts.onTranscript(f.transcript)
      else if (f.type === 'text' && f.full) {
        assistantText = f.full
        opts.onAssistantText(assistantText)
      } else if (f.type === 'audio' && f.b64 && f.mime) {
        if (firstAudio) {
          firstAudio = false
          opts.onSpeaking()
        }
        player.enqueue(`data:${f.mime};base64,${f.b64}`)
      } else if (f.type === 'assistant' && f.text) {
        assistantText = f.text
        opts.onAssistantText(assistantText)
      } else if (f.type === 'error') {
        throw new Error(f.error ?? 'stream error')
      }
    }
  }

  await player.done()
  return assistantText
}

export function getRecorderMime(): string {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? 'audio/webm'
}
