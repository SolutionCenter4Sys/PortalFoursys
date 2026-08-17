import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

export interface CyanBandProps {
  title: string
  subtitle?: string
  milestones: string[]
  /** Atalho semântico para usos institucionais. Default: ShieldCheck. */
  icon?: React.ReactNode
}

/**
 * Banda institucional ciano usada em narrativas de "compromisso continuado"
 * (certificações, longevidade, qualidade). Ex.: faixa "26 anos de compromisso
 * com qualidade" do Portfólio_Digital_Foursys_V16 (slide 05).
 *
 * O componente é puramente apresentacional e i18n-agnostic — quem chama é
 * responsável por passar `title`, `subtitle` e `milestones` já traduzidos.
 */
export function CyanBand({ title, subtitle, milestones, icon }: CyanBandProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45 }}
      className="relative my-8 md:my-10 rounded-2xl overflow-hidden border border-cyan-400/30 bg-gradient-to-r from-cyan-500/15 via-cyan-400/8 to-transparent backdrop-blur-sm"
      role="region"
      aria-label={title}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_left,rgba(0,194,224,0.18),transparent_60%)]" />
      <div className="relative p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="flex items-center gap-3 md:flex-shrink-0">
          <div className="w-11 h-11 rounded-xl bg-cyan-400/15 border border-cyan-300/40 flex items-center justify-center text-cyan-300">
            {icon ?? <ShieldCheck size={20} />}
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300/80">
              {subtitle}
            </div>
            <div className="text-sm md:text-base font-black text-white leading-snug">
              {title}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-wrap gap-2">
          {milestones.map(m => (
            <span
              key={m}
              className="text-[11px] md:text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-100/90"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
