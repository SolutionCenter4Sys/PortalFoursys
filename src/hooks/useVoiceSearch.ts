import { useState, useCallback, useRef, useEffect } from 'react'

export type VoiceStatus = 'idle' | 'listening' | 'error'

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

export function useVoiceSearch(onResult: (transcript: string) => void) {
  const [status, setStatus] = useState<VoiceStatus>('idle')
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isSupported = getSpeechRecognition() !== null

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setStatus('idle')
  }, [])

  const start = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognition()
    if (!SpeechRecognitionCtor) {
      setStatus('error')
      return
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }

    const recognition = new SpeechRecognitionCtor()
    recognition.lang = 'pt-BR'
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setStatus('listening')
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      onResult(transcript)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'aborted' || event.error === 'no-speech') {
        setStatus('idle')
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    }

    recognition.onend = () => {
      setStatus('idle')
      recognitionRef.current = null
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }, [onResult])

  const toggle = useCallback(() => {
    if (status === 'listening') {
      stop()
    } else {
      start()
    }
  }, [status, start, stop])

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
      recognitionRef.current = null
    }
  }, [])

  return { status, isSupported, start, stop, toggle }
}
