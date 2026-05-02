/**
 * VoiceLiveIndicator — overlay flutuante (canto inferior) que mostra:
 *  - estado "ouvindo" com pulso e prévia de transcrição em tempo real
 *  - última transcrição reconhecida + intenção classificada por ~4s após processar
 *
 * Não interfere com layout: é position: fixed, pointer-events-none por padrão,
 * pointer-events-auto quando há ações (botão fechar implícito = ESC).
 */
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Sparkles } from 'lucide-react'
import { useVoice } from './VoiceProvider'
import { useLanguage } from '../i18n'

const POST_DISPLAY_MS = 4500

export function VoiceLiveIndicator() {
  const voice = useVoice()
  const { t } = useLanguage()
  const [showFeedback, setShowFeedback] = useState(false)

  // Quando a transcrição final é classificada, mostra a "bolha de feedback"
  // por POST_DISPLAY_MS. O setState síncrono é intencional aqui — é o
  // padrão clássico de "toast com timeout", não um sync derivável.
  useEffect(() => {
    if (!voice.intencaoUltima) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowFeedback(true)
    const id = setTimeout(() => setShowFeedback(false), POST_DISPLAY_MS)
    return () => clearTimeout(id)
  }, [voice.intencaoUltima, voice.mensagemUltima])

  if (!voice.isSupported) return null

  const ouvindo = voice.status === 'listening'
  const processando = voice.status === 'processing'
  const visivel = ouvindo || processando || showFeedback

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          key="voice-live"
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.22 }}
          className="fixed bottom-4 right-4 z-[150] max-w-[min(420px,calc(100vw-32px))] pointer-events-none"
          role="status"
          aria-live="polite"
        >
          <div
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 backdrop-blur-xl shadow-2xl ${
              ouvindo
                ? 'border-red-400/40 bg-red-500/10 text-red-100'
                : processando
                  ? 'border-foursys-primary/40 bg-foursys-primary/10 text-white'
                  : 'border-white/15 bg-foursys-dark-2/85 text-white'
            }`}
          >
            <div className="relative mt-0.5">
              <Mic
                size={18}
                className={
                  ouvindo
                    ? 'text-red-300'
                    : processando
                      ? 'text-foursys-primary'
                      : 'text-foursys-primary'
                }
              />
              {ouvindo && (
                <span className="absolute inset-[-4px] rounded-full border-2 border-red-400/60 animate-ping pointer-events-none" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {ouvindo && (
                <>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                    {t('common.listening')}
                  </div>
                  <div className="text-sm font-medium leading-snug truncate">
                    {voice.transcricaoAoVivo
                      ? `"${voice.transcricaoAoVivo}"`
                      : <span className="opacity-60">{t('voice.tipPressV')}</span>}
                  </div>
                </>
              )}

              {processando && !ouvindo && (
                <>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                    {t('voice.intent')}…
                  </div>
                  <div className="text-sm font-medium leading-snug truncate">
                    "{voice.transcricaoUltima || voice.transcricaoAoVivo}"
                  </div>
                </>
              )}

              {!ouvindo && !processando && showFeedback && voice.intencaoUltima && (
                <>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-primary flex items-center gap-1.5">
                    <Sparkles size={10} />
                    {voice.intencaoUltima.tipo}
                  </div>
                  {voice.transcricaoUltima && (
                    <div className="text-xs text-foursys-text-muted leading-snug truncate">
                      "{voice.transcricaoUltima}"
                    </div>
                  )}
                  {voice.mensagemUltima && (
                    <div className="text-sm font-medium leading-snug">
                      {voice.mensagemUltima}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
