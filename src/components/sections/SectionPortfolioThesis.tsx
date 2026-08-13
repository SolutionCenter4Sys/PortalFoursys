import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ChevronDown,
  Compass,
  Sparkles,
  Cpu,
  Database,
  Cloud,
  ShieldCheck,
  Layers,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'
import { getPortfolio } from '../../data/portfolio'
import type { PortfolioAxis, PortfolioRole } from '../../types'

const AXIS_ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  cpu: Cpu,
  layers: Layers,
  database: Database,
  cloud: Cloud,
  'shield-check': ShieldCheck,
}

function AxisCard({
  axis,
  offerNames,
  index,
  expanded,
  onToggle,
  onSeeOffers,
}: {
  axis: PortfolioAxis
  offerNames: { code: string; name: string }[]
  index: number
  expanded: boolean
  onToggle: () => void
  onSeeOffers: () => void
}) {
  const { t } = useLanguage()
  const Icon = AXIS_ICONS[axis.icon] ?? Layers

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      data-voz-detalhe={`portfolio-axis-${axis.id}`}
      data-voz-detalhe-secao="portfolio-thesis"
      data-voz-detalhe-rotulo={axis.name}
      className="rounded-2xl border bg-foursys-surface/30 overflow-hidden flex flex-col"
      style={{ borderColor: `${axis.color}33` }}
    >
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className="p-5 text-left flex flex-col gap-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${axis.color}1A`, border: `1px solid ${axis.color}40` }}
            >
              <Icon size={18} style={{ color: axis.color }} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim">
                {t('portfolio.thesis.axisWord')} {axis.number}
              </div>
              <h3 className="text-base font-black text-white leading-tight">{axis.name}</h3>
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`flex-shrink-0 mt-1 text-foursys-text-dim transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>

        <p className="text-xs text-foursys-text-muted leading-relaxed">{axis.promise}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
            style={{ color: axis.color, borderColor: `${axis.color}40`, backgroundColor: `${axis.color}12` }}
          >
            {offerNames.length} {t('portfolio.thesis.offersInAxis')}
          </span>
          <span className="text-[10px] text-foursys-text-dim">{axis.audience}</span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t"
            style={{ borderColor: `${axis.color}22` }}
          >
            <div className="p-5 pt-4 space-y-3">
              <ul className="space-y-2">
                {offerNames.map(offer => (
                  <li key={offer.code} className="flex items-start gap-2.5 text-xs text-foursys-text-muted">
                    <span
                      className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{ color: axis.color, backgroundColor: `${axis.color}15` }}
                    >
                      {offer.code}
                    </span>
                    {offer.name}
                  </li>
                ))}
              </ul>

              {axis.upcomingOffers && axis.upcomingOffers.length > 0 && (
                <div className="rounded-xl border border-dashed p-3" style={{ borderColor: `${axis.color}33` }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-2">
                    {t('portfolio.thesis.axisEmpty')}
                  </p>
                  <ul className="space-y-1.5">
                    {axis.upcomingOffers.map(name => (
                      <li key={name} className="text-xs text-foursys-text-muted flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: axis.color }} />
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {offerNames.length > 0 && (
                <button
                  onClick={onSeeOffers}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ backgroundColor: `${axis.color}18`, color: axis.color, border: `1px solid ${axis.color}38` }}
                >
                  {t('portfolio.thesis.seeOffers')} <ArrowRight size={13} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function RoleGroup({
  variant,
  axes,
  offersByAxis,
  expandedAxis,
  setExpandedAxis,
  onSeeOffers,
  startIndex,
}: {
  variant: PortfolioRole
  axes: PortfolioAxis[]
  offersByAxis: Record<string, { code: string; name: string }[]>
  expandedAxis: string | null
  setExpandedAxis: (id: string | null) => void
  onSeeOffers: (axisId: string) => void
  startIndex: number
}) {
  const { t } = useLanguage()
  const isShowcase = variant === 'diferenciacao'
  const accent = isShowcase ? '#22D3EE' : '#94A3B8'

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span
          className="text-[11px] font-bold uppercase tracking-[0.16em]"
          style={{ color: accent }}
        >
          {isShowcase ? t('portfolio.thesis.showcase') : t('portfolio.thesis.engine')}
        </span>
        <span className="text-[11px] text-foursys-text-dim">
          {isShowcase ? t('portfolio.thesis.showcaseHint') : t('portfolio.thesis.engineHint')}
        </span>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accent}44, transparent)` }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
        {axes.map((axis, i) => (
          <AxisCard
            key={axis.id}
            axis={axis}
            offerNames={offersByAxis[axis.id] ?? []}
            index={startIndex + i}
            expanded={expandedAxis === axis.id}
            onToggle={() => setExpandedAxis(expandedAxis === axis.id ? null : axis.id)}
            onSeeOffers={() => onSeeOffers(axis.id)}
          />
        ))}
      </div>
    </div>
  )
}

export function SectionPortfolioThesis() {
  const { navigate, setDeepDiveHint } = useApp()
  const { t, lang } = useLanguage()
  const { axes, offers, thesis, institutionalBacking } = useMemo(() => getPortfolio(lang), [lang])
  const [expandedAxis, setExpandedAxis] = useState<string | null>(null)

  const offersByAxis = useMemo(() => {
    const map: Record<string, { code: string; name: string }[]> = {}
    for (const offer of offers) {
      map[offer.axisId] = map[offer.axisId] ?? []
      map[offer.axisId].push({ code: offer.code, name: offer.name })
    }
    return map
  }, [offers])

  const showcaseAxes = axes.filter(a => a.role === 'diferenciacao')
  const engineAxes = axes.filter(a => a.role === 'capacidade')

  const handleSeeOffers = (axisId: string) => {
    setDeepDiveHint(`axis:${axisId}`)
    navigate('portfolio-offers')
  }

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
                <Compass size={13} /> {t('portfolio.badge')}
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-none">
                {t('portfolio.thesis.title')}
              </h2>
              <p className="text-foursys-text-muted mt-2 text-sm md:text-base max-w-2xl leading-relaxed">
                {t('portfolio.thesis.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <InterestButton section="portfolio-thesis" />
              {institutionalBacking.map(stat => (
                <div
                  key={stat.label}
                  className="text-center px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-foursys-surface/40 border border-white/[0.08]"
                >
                  <div className="text-base md:text-lg font-black text-cyan-400">{stat.value}</div>
                  <div className="text-[10px] text-foursys-text-dim">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 md:mt-6 h-px bg-gradient-to-r from-cyan-400/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* ── Tese comercial ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
          className="mb-8 md:mb-10 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/[0.07] to-transparent p-5 md:p-7"
        >
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            <div className="lg:w-2/5">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {thesis.sequence.map((step, i) => (
                  <span key={step} className="flex items-center gap-2">
                    {i > 0 && <ArrowRight size={13} className="text-cyan-400/60" />}
                    <span className="text-sm md:text-base font-black text-white">{step}</span>
                  </span>
                ))}
              </div>
              <p className="text-xs text-cyan-300/80 font-semibold uppercase tracking-wider">
                {thesis.label}
              </p>
            </div>
            <div className="lg:w-3/5 space-y-3">
              <p className="text-sm text-foursys-text-muted leading-relaxed">{thesis.description}</p>
              <ul className="space-y-2">
                {thesis.principles.map(p => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-foursys-text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* ── Eixos: vitrine e motor ── */}
        <div
          data-voz-caixa="portfolio-axes-grid"
          data-voz-caixa-secao="portfolio-thesis"
          data-voz-caixa-rotulo={t('portfolio.thesis.title')}
          tabIndex={-1}
          className="space-y-8 focus:outline-none"
        >
          <RoleGroup
            variant="diferenciacao"
            axes={showcaseAxes}
            offersByAxis={offersByAxis}
            expandedAxis={expandedAxis}
            setExpandedAxis={setExpandedAxis}
            onSeeOffers={handleSeeOffers}
            startIndex={0}
          />
          <RoleGroup
            variant="capacidade"
            axes={engineAxes}
            offersByAxis={offersByAxis}
            expandedAxis={expandedAxis}
            setExpandedAxis={setExpandedAxis}
            onSeeOffers={handleSeeOffers}
            startIndex={showcaseAxes.length}
          />
        </div>

      </div>
    </SectionWrapper>
  )
}
