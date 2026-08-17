import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Bot,
  Coins,
  Cpu,
  Leaf,
  Telescope,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { useLanguage } from '../../i18n'
import { getPortfolio } from '../../data/portfolio'

const ICONS: Record<string, LucideIcon> = {
  coins: Coins,
  leaf: Leaf,
  bot: Bot,
  cpu: Cpu,
}

export function SectionPortfolioFuture() {
  const { t, lang } = useLanguage()
  const { futureVision } = useMemo(() => getPortfolio(lang), [lang])

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-start md:items-end justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400 mb-2 flex items-center gap-2">
                <Telescope size={13} aria-hidden="true" /> {t('portfolio.badge')}
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-none">
                {t('portfolio.future.title')}
              </h2>
              <p className="text-foursys-text-muted mt-2 text-sm md:text-base max-w-2xl leading-relaxed">
                {t('portfolio.future.subtitle')}
              </p>
            </div>
            <InterestButton section="portfolio-future" />
          </div>

          <div className="mt-4 md:mt-6 h-px bg-gradient-to-r from-cyan-400/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* ── Visão de futuro ── */}
        <div
          data-voz-caixa="portfolio-future-grid"
          data-voz-caixa-secao="portfolio-future"
          data-voz-caixa-rotulo={t('portfolio.future.futureTitle')}
          tabIndex={-1}
          className="focus:outline-none"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
            {futureVision.map((item, i) => {
              const Icon = ICONS[item.icon] ?? Telescope
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  data-voz-detalhe={`portfolio-future-${item.id}`}
                  data-voz-detalhe-secao="portfolio-future"
                  data-voz-detalhe-rotulo={item.name}
                  className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/[0.08] to-transparent border border-cyan-400/20 flex flex-col"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mb-3">
                    <Icon size={18} className="text-cyan-400" aria-hidden="true" />
                  </div>
                  <h4 className="text-sm font-black text-white leading-tight mb-1.5">{item.name}</h4>
                  <p className="text-xs text-foursys-text-muted leading-relaxed flex-1">{item.description}</p>
                  <div className="mt-3 pt-3 border-t border-white/[0.06]">
                    <span className="text-[10px] uppercase tracking-widest text-foursys-text-dim">
                      {t('portfolio.future.horizon')}
                    </span>
                    <div className="text-[11px] font-semibold text-cyan-400/90">{item.horizon}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </SectionWrapper>
  )
}
