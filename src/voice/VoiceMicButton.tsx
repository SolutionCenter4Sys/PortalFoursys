/**
 * VoiceMicButton — botão de microfone na TopBar com indicador
 * visual de listening/processing/error. Acompanhado de um botão
 * pequeno de ajuda (?) que abre o VoiceHelpDialog.
 */
import { Mic, MicOff, HelpCircle } from 'lucide-react'
import { useVoice } from './VoiceProvider'
import { useLanguage } from '../i18n'

export function VoiceMicButton() {
  const voice = useVoice()
  const { t } = useLanguage()

  if (!voice.isSupported) return null

  const ouvindo = voice.status === 'listening'
  const processando = voice.status === 'processing'
  const erro = voice.status === 'error'

  const aria = ouvindo
    ? t('voice.stopListening')
    : t('voice.startListening')

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={voice.toggle}
        aria-label={aria}
        title={aria}
        className={`relative min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:p-1.5 flex items-center justify-center rounded-lg transition-colors ${
          ouvindo
            ? 'bg-red-500/15 text-red-400 border border-red-400/30'
            : erro
              ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-400/30'
              : processando
                ? 'bg-foursys-primary/15 text-foursys-primary'
                : 'hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text'
        }`}
      >
        {ouvindo && (
          <span className="absolute inset-0 rounded-lg border-2 border-red-400/60 animate-ping pointer-events-none" />
        )}
        {voice.silenciado ? (
          <MicOff size={15} className="relative z-10" />
        ) : (
          <Mic size={15} className="relative z-10" />
        )}
      </button>

      <button
        type="button"
        onClick={voice.abrirAjuda}
        aria-label={t('voice.openHelp')}
        title={t('voice.openHelp')}
        className="hidden md:flex p-1.5 rounded-lg hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text transition-colors"
      >
        <HelpCircle size={14} />
      </button>
    </div>
  )
}
