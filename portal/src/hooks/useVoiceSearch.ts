import { useState, useCallback, useRef, useEffect } from 'react'

export type VoiceStatus = 'idle' | 'listening' | 'error'

const MAX_LISTEN_MS = 12_000

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export function useVoiceSearch(onResult: (transcript: string) => void, speechLang: 'pt-BR' | 'en-US' = 'pt-BR') {
  const [status, setStatus] = useState<VoiceStatus>('idle')
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSupported = getSpeechRecognition() !== null

  const clearSafetyTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    clearSafetyTimeout()
    recognitionRef.current?.stop()
    setStatus('idle')
  }, [clearSafetyTimeout])

  const start = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognition()
    if (!SpeechRecognitionCtor) {
      setStatus('error')
      return
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort()
    }
    clearSafetyTimeout()

    const ios = isIOS()
    const recognition = new SpeechRecognitionCtor()
    recognition.lang = speechLang
    recognition.interimResults = !ios
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setStatus('listening')
      timeoutRef.current = setTimeout(() => {
        recognitionRef.current?.stop()
      }, MAX_LISTEN_MS)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      onResult(transcript)
    }

    recognition.onspeechend = () => {
      recognitionRef.current?.stop()
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      clearSafetyTimeout()
      if (event.error === 'aborted' || event.error === 'no-speech') {
        setStatus('idle')
      } else if (event.error === 'not-allowed') {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 4000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    }

    recognition.onend = () => {
      clearSafetyTimeout()
      setStatus('idle')
      recognitionRef.current = null
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch {
      clearSafetyTimeout()
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }, [onResult, clearSafetyTimeout, speechLang])

  const toggle = useCallback(() => {
    if (status === 'listening') {
      stop()
    } else {
      start()
    }
  }, [status, start, stop])

  useEffect(() => {
    return () => {
      clearSafetyTimeout()
      recognitionRef.current?.abort()
      recognitionRef.current = null
    }
  }, [clearSafetyTimeout])

  return { status, isSupported, start, stop, toggle }
}
