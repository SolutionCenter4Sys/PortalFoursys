import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'

/**
 * Chip "Voltar para [origem]" que aparece no topo de uma seção quando o
 * usuário chegou via navigate() vindo de outra seção. Lê state.previousSection
 * do AppContext (mantido automaticamente a cada NAVIGATE).
 *
 * Uso:
 *   <BackToOriginChip />
 *
 * Posição: por padrão fica inline no topo. Para uso fixed, passar className.
 */
export function BackToOriginChip({ className = '' }: { className?: string }) {
  const { state, navigate, getSectionLabel } = useApp()
  const { lang } = useLanguage()

  const origin = state.previousSection
  if (!origin || origin === state.currentSection) {
    return null
  }

  const label = getSectionLabel(origin)
  const prefix = lang === 'pt' ? 'Voltar para' : 'Back to'

  return (
    <motion.button
      type="button"
      onClick={() => navigate(origin)}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.97 }}
      aria-label={`${prefix} ${label}`}
      className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-surface/60 hover:bg-foursys-surface/90 border border-white/10 hover:border-foursys-primary/40 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-foursys-primary ${className}`}
    >
      <ArrowLeft
        size={14}
        className="text-foursys-text-muted group-hover:text-foursys-primary transition-colors duration-200"
        strokeWidth={2.4}
      />
      <span className="text-[11px] uppercase tracking-[0.14em] text-foursys-text-dim group-hover:text-white transition-colors duration-200">
        {prefix}
      </span>
      <span className="text-[12px] font-bold text-foursys-text group-hover:text-foursys-primary transition-colors duration-200">
        {label}
      </span>
    </motion.button>
  )
}
