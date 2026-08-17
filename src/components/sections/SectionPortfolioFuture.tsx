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

  // Agrupar por horizonte deixa explícito o que está sendo construído agora e o
  // que ainda é observação — quatro cards soltos não comunicavam essa diferença.
  const groups = useMemo(() => {
    const order: string[] = []
    const map = new Map<string, typeof futureVision>()
    for (const item of futureVision) {
      if (!map.has(item.horizon)) {
        map.set(item.horizon, [])
        order.push(item.horizon)
      }
      map.get(item.horizon)!.push(item)
    }
    return order.map(horizon => ({ horizon, items: map.get(horizon)! }))
  }, [futureVision])

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
          <div className="space-y-6">
            {groups.map((group, gi) => (
              <div key={group.horizon}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/70" aria-hidden="true" />
                    {group.horizon}
                  </span>
                  <span className="text-[11px] text-foursys-text-dim">
                    {group.items.length} {t('portfolio.future.itemsInHorizon')}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-cyan-400/25 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
                  {group.items.map((item, i) => {
                    const Icon = ICONS[item.icon] ?? Telescope
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: gi * 0.06 + i * 0.05, duration: 0.35 }}
                        data-voz-detalhe={`portfolio-future-${item.id}`}
                        data-voz-detalhe-secao="portfolio-future"
                        data-voz-detalhe-rotulo={item.name}
                        className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/[0.08] to-transparent border border-cyan-400/20 flex flex-col"
                      >
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mb-3">
                          <Icon size={18} className="text-cyan-400" aria-hidden="true" />
                        </div>
                        <h4 className="text-sm font-black text-white leading-tight mb-1.5">{item.name}</h4>
                        <p className="text-xs text-foursys-text-muted leading-relaxed flex-1">
                          {item.description}
                        </p>
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
            ))}
          </div>

          <button
            onClick={() => navigate('portfolio-ecosystem')}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 transition-colors"
          >
            <Network size={13} aria-hidden="true" />
            {t('portfolio.future.seeOnMap')}
          </button>
        </div>

      </div>
    </SectionWrapper>
  )
}
