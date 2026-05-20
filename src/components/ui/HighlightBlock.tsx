import { motion } from 'framer-motion'
import { DynIcon } from '../../utils/iconMap'

export interface HighlightItem {
  id: string
  title: string
  description: string
  icon: string
}

export interface HighlightBlockProps {
  badge: string
  title: string
  subtitle?: string
  items: HighlightItem[]
  /** Cor de destaque (HEX). Default: laranja Foursys (#FF6600). */
  accentColor?: string
}

/**
 * Bloco de destaque com badge + título + grid de cards. Usado em narrativas
 * de "Frentes Estratégicas / Novas linhas de serviço em curso" (Portfólio
 * V16 slide 05) e em outros contextos similares (e.g. roadmap, capacidades
 * em construção).
 *
 * Componente puramente apresentacional. Conteúdo deve chegar já traduzido.
 */
export function HighlightBlock({
  badge,
  title,
  subtitle,
  items,
  accentColor = '#FF6600',
}: HighlightBlockProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45 }}
      aria-label={title}
      className="relative mt-10 md:mt-12"
    >
      <div className="text-center mb-6">
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em] border"
          style={{
            color: accentColor,
            borderColor: `${accentColor}55`,
            backgroundColor: `${accentColor}1f`,
          }}
        >
          {badge}
        </span>
        <h3 className="text-xl md:text-2xl font-black text-white mt-3">{title}</h3>
        {subtitle && (
          <p className="text-sm md:text-base text-foursys-text-muted mt-2 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {items.map((it, i) => (
          <motion.div
            key={it.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className="rounded-2xl p-4 md:p-5 bg-foursys-surface/40 border border-white/[0.08] hover:border-white/20 transition-colors"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{
                backgroundColor: `${accentColor}18`,
                border: `1px solid ${accentColor}40`,
                color: accentColor,
              }}
            >
              <DynIcon name={it.icon} size={18} style={{ color: accentColor }} />
            </div>
            <div className="text-sm md:text-base font-bold text-white mb-1.5">{it.title}</div>
            <p className="text-xs md:text-sm text-foursys-text-dim leading-relaxed">
              {it.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
