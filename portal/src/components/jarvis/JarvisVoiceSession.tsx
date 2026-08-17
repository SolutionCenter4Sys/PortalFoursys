import { useCallback, useEffect, useRef, useState } from 'react'
import { VoiceOrb, type VoiceOrbState } from './VoiceOrb'
import { speakJarvis, stopSpeech } from './speak'
import { runVoiceStream, type ChatTurn } from './stream'
import { startUtteranceListen, type UtteranceListen } from './pcm-wav'

const GREETING_PT = 'Olá! Sou o Jarvis, assistente da Foursys. Em que posso ajudar?'
const GREETING_EN = "Hi! I'm Jarvis, Foursys assistant. How can I help?"
const MIN_TURN_MS = 700

type Props = {
  lang: 'pt' | 'en'
}

export function JarvisVoiceSession({ lang }: Props) {
  const [orbState, setOrbState] = useState<VoiceOrbState>('idle')
  const [error, setError] = useState<string | null>(null)

  const historyRef = useRef<ChatTurn[]>([])
  const abortRef = useRef<AbortController | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const listenRef = useRef<UtteranceListen | null>(null)
  const busyRef = useRef(false)
  const aliveRef = useRef(true)
  const listeningRef = useRef(false)
  const startListeningRef = useRef<() => Promise<void>>(async () => {})

  const greeting = lang === 'en' ? GREETING_EN : GREETING_PT

  const teardownMic = useCallback(() => {
    try {
      listenRef.current?.stop()
    } catch {
      /* noop */
    }
    listenRef.current = null
    listeningRef.current = false
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  const sendAudio = useCallback(
    async (blob: Blob) => {
      if (busyRef.current || !aliveRef.current) return
      if (blob.size < 2500) {
        void startListeningRef.current()
        return
      }
      busyRef.current = true
      setOrbState('processing')
      setError(null)
      const abort = new AbortController()
      abortRef.current = abort
      let failed = false
      let retryListen = false
      try {
        const form = new FormData()
        form.append('audio', blob, 'turn.wav')
        form.append('history', JSON.stringify(historyRef.current))
        const assistantText = await runVoiceStream(form, {
          signal: abort.signal,
          onTranscript: (text) => {
            const turn: ChatTurn = { role: 'user', content: text }
            historyRef.current = [...historyRef.current, turn].slice(-16)
          },
          onAssistantText: () => undefined,
          onSpeaking: () => {
            if (aliveRef.current) setOrbState('speaking')
          },
        })
        if (assistantText) {
          const turn: ChatTurn = { role: 'assistant', content: assistantText }
          historyRef.current = [...historyRef.current, turn].slice(-16)
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        const msg = err instanceof Error ? err.message : 'Falha no Jarvis'
        failed = true
        if (/transcrever/i.test(msg)) {
          retryListen = true
          await speakJarvis(
            lang === 'en' ? "I didn't catch that. Please say it again." : 'Não entendi. Pode repetir?',
            lang,
          )
        } else if (/requisições|aguarde|429/i.test(msg)) {
          retryListen = true
          await speakJarvis(
            lang === 'en' ? 'One moment. Try again shortly.' : 'Um momento. Pode falar de novo já já.',
            lang,
          )
          await new Promise((r) => setTimeout(r, 2000))
        } else {
          setError(msg)
          setOrbState('error')
        }
      } finally {
        busyRef.current = false
        abortRef.current = null
        if (aliveRef.current && (!failed || retryListen)) {
          await new Promise((r) => setTimeout(r, 450))
          if (aliveRef.current) void startListeningRef.current()
        }
      }
    },
    [lang],
  )

  const finishTurn = useCallback(() => {
    if (!listeningRef.current) return
    listeningRef.current = false
    const rec = listenRef.current
    listenRef.current = null
    const captured = rec?.stop()
    const stream = streamRef.current
    streamRef.current = null
    stream?.getTracks().forEach((t) => t.stop())
    if (!captured?.heardSpeech || captured.durationMs < MIN_TURN_MS) {
      void startListeningRef.current()
      return
    }
    void sendAudio(captured.blob)
  }, [sendAudio])

  const startListening = useCallback(async () => {
    if (!aliveRef.current || busyRef.current || listeningRef.current) return
    teardownMic()
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      })
      if (!aliveRef.current) {
        stream.getTracks().forEach((t) => t.stop())
        return
      }
      streamRef.current = stream
      listeningRef.current = true
      setOrbState('listening')
      listenRef.current = startUtteranceListen({
        stream,
        lang,
        onUtteranceEnd: () => finishTurn(),
      })
    } catch {
      setError(
        lang === 'en' ? 'Microphone permission denied' : 'Permissão de microfone negada',
      )
      setOrbState('error')
    }
  }, [finishTurn, lang, teardownMic])

  startListeningRef.current = startListening

  const onOrbClick = () => {
    if (orbState === 'processing') return
    if (orbState === 'speaking') {
      stopSpeech()
      void startListening()
      return
    }
    if (listeningRef.current) {
      finishTurn()
      return
    }
    void startListening()
  }

  useEffect(() => {
    aliveRef.current = true
    let cancelled = false
    void (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true })
        s.getTracks().forEach((t) => t.stop())
      } catch {
        if (!cancelled) {
          setError(
            lang === 'en'
              ? 'Microphone permission denied'
              : 'Permissão de microfone negada',
          )
          setOrbState('error')
        }
        return
      }
      if (cancelled) return
      setOrbState('speaking')
      historyRef.current = [{ role: 'assistant', content: greeting }]
      await speakJarvis(greeting, lang)
      if (cancelled || !aliveRef.current) return
      await new Promise((r) => setTimeout(r, 600))
      if (cancelled || !aliveRef.current) return
      void startListeningRef.current()
    })()
    return () => {
      cancelled = true
      aliveRef.current = false
      stopSpeech()
      abortRef.current?.abort()
      teardownMic()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <VoiceOrb
        state={orbState}
        onClick={onOrbClick}
        disabled={orbState === 'processing'}
      />
      <p className="sr-only" role="status">
        {orbState}
      </p>
      {error && (
        <p className="max-w-sm px-6 text-center text-sm text-[#ffb4b4]" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
