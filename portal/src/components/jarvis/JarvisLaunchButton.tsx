/**
 * Substitui o mic Touchless: abre o overlay do Jarvis.
 */
import { Sparkles } from 'lucide-react'

type Props = {
  active: boolean
  onClick: () => void
  label: string
}

export function JarvisLaunchButton({ active, onClick, label }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`relative min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:px-2 md:py-1.5 flex items-center justify-center gap-1.5 rounded-lg transition-colors ${
        active
          ? 'bg-foursys-primary/20 text-foursys-primary border border-foursys-primary/40'
          : 'hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text'
      }`}
    >
      {active && (
        <span className="absolute inset-0 rounded-lg border-2 border-foursys-primary/50 animate-ping pointer-events-none" />
      )}
      <Sparkles size={15} className="relative z-10" />
      <span className="relative z-10 hidden text-[11px] font-semibold uppercase tracking-wide lg:inline">
        Jarvis
      </span>
    </button>
  )
}
