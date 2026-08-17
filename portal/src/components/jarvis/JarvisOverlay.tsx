/**
 * Overlay: Portal com blur + Jarvis original em iframe (/embed).
 * Voz = pipeline Jarvis (STT/TTS cloud), não Web Speech do browser.
 */
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { pararFala } from '../../voice/feedback'
import { useVoice } from '../../voice/VoiceProvider'

const JARVIS_EMBED = '/embed'

const GREETING_PT =
  'Olá! Sou o Jarvis, assistente de voz da Foursys. Posso te guiar por quem somos, serviços, trajetória e cases. O que você quer saber?'
const GREETING_EN =
  "Hi! I'm Jarvis, Foursys' voice assistant. I can guide you through who we are, services, timeline and cases. What would you like to know?"

type Props = {
  open: boolean
  onClose: () => void
  lang: 'pt' | 'en'
}

export function JarvisOverlay({ open, onClose, lang }: Props) {
  const voice = useVoice()
  const frameRef = useRef<HTMLIFrameElement>(null)
  const activatedRef = useRef(false)

  useEffect(() => {
    if (!open) return
    try {
      voice.stop()
      pararFala()
    } catch {
      /* noop */
    }
  }, [open, voice])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      activatedRef.current = false
      return
    }

    function activate() {
      if (activatedRef.current) return
      const win = frameRef.current?.contentWindow
      if (!win) return
      activatedRef.current = true
      win.postMessage(
        {
          type: 'jarvis:activate',
          greeting: lang === 'en' ? GREETING_EN : GREETING_PT,
        },
        '*',
      )
    }

    function onMsg(ev: MessageEvent) {
      const data = ev.data as { type?: string } | null
      if (!data || data.type !== 'jarvis:ready') return
      activate()
    }

    window.addEventListener('message', onMsg)
    // Se o iframe já estava ready antes do listener, tenta activate no load
    const frame = frameRef.current
    function onLoad() {
      activate()
    }
    frame?.addEventListener('load', onLoad)

    return () => {
      window.removeEventListener('message', onMsg)
      frame?.removeEventListener('load', onLoad)
      frameRef.current?.contentWindow?.postMessage({ type: 'jarvis:stop' }, '*')
      activatedRef.current = false
    }
  }, [open, lang])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/10 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Jarvis"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white md:right-8 md:top-8"
        aria-label="Fechar Jarvis"
      >
        <X size={20} />
      </button>
      <iframe
        ref={frameRef}
        title="Jarvis"
        src={JARVIS_EMBED}
        allow="microphone; autoplay; clipboard-write; speaker-selection; fullscreen"
        allowTransparency
        className="h-full w-full border-0 bg-transparent"
        style={{ backgroundColor: 'transparent', colorScheme: 'normal' }}
      />
    </div>
  )
}
