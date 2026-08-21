import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Bot,
  Coins,
  Cpu,
  Leaf,
  Network,
  Telescope,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { BackToOriginChip } from '../ui/BackToOriginChip'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'
import { getPortfolio } from '../../data/portfolio'

const ICONS: Record<string, LucideIcon> = {
  coins: Coins,
  leaf: Leaf,
  bot: Bot,
  cpu: Cpu,
}

export function SectionPortfolioFuture() {
  const { navigate } = useApp()
  const { t, lang } = useLanguage()
  const { futureVision } = useMemo(() => getPortfolio(lang), [lang])

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">

        <BackToOriginChip className="mb-4" />

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-start md:items-end justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-400 mb-2 flex items-center gap-2">
                <Telescope size={16} aria-hidden="true" /> {t('portfolio.badge')}
              </p>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-none">
                {t('portfolio.future.title')}
              </h2>
              <p className="text-foursys-text-muted mt-2 text-base md:text-lg max-w-2xl leading-relaxed">
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
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.35 }}
                        data-voz-detalhe={`portfolio-future-${item.id}`}
                        data-voz-detalhe-secao="portfolio-future"
                        data-voz-detalhe-rotulo={item.name}
                        className="rounded-2xl bg-cyan-500/[0.045] border border-cyan-400/20 overflow-hidden"
                      >
                        <div className="p-5 flex flex-col">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
                              <Icon size={22} className="text-cyan-400" aria-hidden="true" />
                            </div>
                          </div>
                          <h4 className="text-lg md:text-xl font-black text-white leading-tight mt-4">{item.name}</h4>
                        </div>
                        <div className="p-5 pt-3 border-t border-white/[0.06]">
                          <p className="text-sm md:text-base text-foursys-text-muted leading-relaxed">
                            {item.description}
                          </p>
                          <div className="mt-4 p-4 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                          <div className="text-xs uppercase tracking-widest text-cyan-400/80 font-bold">
                            {t('portfolio.future.example')}
                          </div>
                          <p className="text-sm text-foursys-text-muted leading-relaxed mt-1">{item.example}</p>
                          </div>
                          <div className="mt-4 pt-4 border-t border-white/[0.06]">
                            <span className="text-xs uppercase tracking-widest text-foursys-text-dim">
                              {t('portfolio.future.maturity')}
                            </span>
                            <div className="text-sm font-semibold text-white/80 leading-snug mt-1">{item.maturity}</div>
                          </div>
                        </div>
                      </motion.article>
                    )
                  })}
          </div>

          <button
            onClick={() => navigate('portfolio-ecosystem')}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 transition-colors"
          >
            <Network size={13} aria-hidden="true" />
            {t('portfolio.future.seeOnMap')}
          </button>
        </div>

      </div>
    </SectionWrapper>
  )
}
