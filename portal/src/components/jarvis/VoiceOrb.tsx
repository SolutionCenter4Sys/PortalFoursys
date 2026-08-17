export type VoiceOrbState =
  | 'idle'
  | 'standby'
  | 'armed'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'interrupted'
  | 'error'

type Props = {
  state: VoiceOrbState
  onClick?: () => void
  disabled?: boolean
  className?: string
}

const STATE_LABELS: Record<VoiceOrbState, string> = {
  idle: 'Assistente de voz inativo. Toque para ativar.',
  standby: 'Assistente em espera. Toque para falar.',
  armed: 'Assistente pronto. Pode falar agora.',
  listening: 'Ouvindo você falar.',
  processing: 'Processando sua fala.',
  speaking: 'Assistente respondendo.',
  interrupted: 'Resposta interrompida.',
  error: 'Erro no assistente de voz. Toque para tentar de novo.',
}

export function VoiceOrb({ state, onClick, disabled, className }: Props) {
  return (
    <button
      type="button"
      data-state={state}
      onClick={onClick}
      disabled={disabled}
      aria-label={STATE_LABELS[state]}
      className={`jarvis-orb relative flex h-[180px] w-[180px] items-center justify-center rounded-full transition-transform duration-300 hover:scale-[1.04] disabled:cursor-not-allowed md:h-[240px] md:w-[240px] ${className ?? ''}`}
    >
      <span aria-hidden="true" className="jarvis-orb__halo" />
      <span aria-hidden="true" className="jarvis-orb__ring jarvis-orb__ring--1" />
      <span aria-hidden="true" className="jarvis-orb__ring jarvis-orb__ring--3" />
      <span aria-hidden="true" className="jarvis-orb__body">
        <span className="jarvis-orb__plasma" />
        <span className="jarvis-orb__plasma jarvis-orb__plasma--b" />
        <span className="jarvis-orb__energy jarvis-orb__energy--orange" />
        <span className="jarvis-orb__energy jarvis-orb__energy--mint" />
        <span className="jarvis-orb__energy jarvis-orb__energy--red" />
        <span className="jarvis-orb__nucleus jarvis-orb__nucleus--a" />
        <span className="jarvis-orb__nucleus jarvis-orb__nucleus--b" />
        <span className="jarvis-orb__nucleus jarvis-orb__nucleus--c" />
        <span className="jarvis-orb__core" />
        <span className="jarvis-orb__shimmer" />
        <span className="jarvis-orb__sheen" />
      </span>
      <span aria-hidden="true" className="jarvis-orb__ring jarvis-orb__ring--2" />
      <span aria-hidden="true" className="jarvis-orb__ring jarvis-orb__ring--4" />
      {state === 'error' && (
        <span className="relative z-10 text-2xl font-semibold text-white/90">!</span>
      )}
      {(state === 'listening' || state === 'armed') && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 animate-ping rounded-full border ${
            state === 'listening' ? 'border-[#ff5315]/40' : 'border-[#89bab1]/40'
          }`}
        />
      )}
      {state === 'speaking' && (
        <>
          <span
            aria-hidden="true"
            className="animate-jarvis-wave absolute inset-0 rounded-full border-2 border-[#ff5315]/50"
          />
          <span
            aria-hidden="true"
            className="animate-jarvis-wave absolute inset-0 rounded-full border-2 border-[#ff5315]/40 [animation-delay:600ms]"
          />
        </>
      )}
    </button>
  )
}
