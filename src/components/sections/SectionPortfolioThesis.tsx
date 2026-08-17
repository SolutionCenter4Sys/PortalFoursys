import { useCallback, useMemo, useRef, useState } from 'react'
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
  LifeBuoy,
  PackageCheck,
  Layers,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { BackToOriginChip } from '../ui/BackToOriginChip'
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
  'life-buoy': LifeBuoy,
  'package-check': PackageCheck,
}

/* ── Mandala de eixos ─────────────────────────────────────────────────────────── */

function getLabelPosition(angleDeg: number) {
  const norm = ((angleDeg % 360) + 360) % 360
  if (norm > 280 || norm < 70)
    return 'left-[calc(100%+22px)] top-1/2 -translate-y-1/2 text-left'
  if (norm >= 70 && norm <= 110)
    return 'left-1/2 -translate-x-1/2 top-[calc(100%+20px)] text-center'
  if (norm > 110 && norm < 250)
    return 'right-[calc(100%+22px)] top-1/2 -translate-y-1/2 text-right'
  return 'left-1/2 -translate-x-1/2 bottom-[calc(100%+20px)] text-center'
}

function AxisOrbitRing({
  axes,
  activeId,
  offerCountByAxis,
  onSelect,
  onKeyNav,
}: {
  axes: PortfolioAxis[]
  activeId: string
  offerCountByAxis: Record<string, number>
  onSelect: (id: string) => void
  onKeyNav: (e: React.KeyboardEvent, currentId: string) => void
}) {
  const { t, lang } = useLanguage()
  const angleStep = 360 / axes.length
  const radius = 38
  const activeColor = axes.find(a => a.id === activeId)?.color ?? '#22D3EE'

  return (
    <div
      className="relative aspect-square w-full max-w-[380px] lg:max-w-[460px] xl:max-w-[520px] mx-auto"
      role="radiogroup"
      aria-label={t('portfolio.thesis.title')}
    >
      {/* Anel de órbita: passa pelo centro dos nós, mantendo os rótulos fora do desenho */}
      <div className="absolute inset-[12%] rounded-full border border-white/[0.06]" />
      <div className="absolute inset-[24%] rounded-full border border-white/[0.05] bg-white/[0.012]" />
      <div className="absolute inset-[30%] rounded-full border border-white/10 bg-foursys-surface/40 shadow-[0_0_60px_rgba(0,0,0,0.35)]" />

      <div
        className="absolute inset-[33%] rounded-full bg-[#23243D] border border-white/10 flex items-center justify-center transition-all duration-500"
        style={{ boxShadow: `0 0 40px ${activeColor}15, inset 0 0 30px rgba(0,0,0,0.3)` }}
      >
        <div className="text-center px-2">
          <div className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-none">foursys</div>
          <div className="text-[8px] md:text-[9px] uppercase tracking-[0.28em] text-foursys-text-dim mt-1.5">
            {lang === 'pt' ? 'eixos de valor' : 'value axes'}
          </div>
        </div>
      </div>

      {axes.map((axis, index) => {
        const Icon = AXIS_ICONS[axis.icon] ?? Layers
        const angleDeg = -90 + index * angleStep
        const angleRad = (angleDeg * Math.PI) / 180
        const x = 50 + radius * Math.cos(angleRad)
        const y = 50 + radius * Math.sin(angleRad)
        const isActive = activeId === axis.id
        const labelPos = getLabelPosition(angleDeg)
        const offerCount = offerCountByAxis[axis.id] ?? 0

        return (
          <button
            key={axis.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${axis.name} — ${offerCount} ${t('portfolio.thesis.offersInAxis')}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(axis.id)}
            onKeyDown={e => onKeyNav(e, axis.id)}
            data-voz-filtro="eixo-portfolio"
            data-voz-filtro-valor={axis.id}
            data-voz-filtro-sinonimos={axis.name}
            className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-full z-10"
            style={{ top: `${y}%`, left: `${x}%` }}
          >
            <span
              className="w-14 h-14 lg:w-16 lg:h-16 xl:w-[72px] xl:h-[72px] rounded-full border-2 flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: `${axis.color}1A`,
                borderColor: `${axis.color}59`,
                borderStyle: axis.role === 'diferenciacao' ? 'solid' : 'dashed',
                boxShadow: isActive
                  ? `0 0 0 4px ${axis.color}35, 0 0 34px ${axis.color}90`
                  : `0 0 14px ${axis.color}45`,
                transform: isActive ? 'scale(1.12)' : 'scale(1)',
              }}
            >
              <Icon size={22} style={{ color: axis.color }} strokeWidth={2.2} aria-hidden="true" />
            </span>
            {/* Densidade: quantas ofertas o eixo já tem detalhadas */}
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 w-5 h-5 lg:w-[22px] lg:h-[22px] rounded-full flex items-center justify-center text-[10px] lg:text-[11px] font-black border"
              style={{
                backgroundColor: '#0F1524',
                borderColor: `${axis.color}66`,
                color: offerCount > 1 ? axis.color : '#94A3B8',
              }}
            >
              {offerCount}
            </span>
            <span
              className={`absolute w-[104px] lg:w-[120px] text-[11px] lg:text-[12px] font-bold leading-tight pointer-events-none text-white/90 ${labelPos}`}
            >
              {axis.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function AxisDetailPanel({
  axis,
  offerNames,
  onSeeOffers,
}: {
  axis: PortfolioAxis
  offerNames: { code: string; name: string }[]
  onSeeOffers: () => void
}) {
  const { t } = useLanguage()
  const Icon = AXIS_ICONS[axis.icon] ?? Layers
  const isShowcase = axis.role === 'diferenciacao'

  return (
    <>
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${axis.color}1A`, boxShadow: `0 0 16px ${axis.color}25` }}
        >
          <Icon size={18} style={{ color: axis.color }} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-widest text-foursys-text-dim">
            {t('portfolio.thesis.axisWord')} {axis.number} ·{' '}
            {isShowcase ? t('portfolio.thesis.showcase') : t('portfolio.thesis.engine')}
          </div>
          <h3 className="text-lg lg:text-xl font-black text-white leading-tight">{axis.name}</h3>
        </div>
      </div>

      <p className="text-foursys-text-muted text-sm leading-relaxed">{axis.promise}</p>

      <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-foursys-text-dim mb-2">
          {t('portfolio.thesis.audienceLabel')}
        </p>
        <p className="text-xs text-foursys-text-muted leading-relaxed">{axis.audience}</p>
      </div>

      {offerNames.length > 0 && (
        <ul className="mt-4 space-y-2">
          {offerNames.map(offer => (
            <li key={offer.code} className="flex items-start gap-2.5 text-xs text-foursys-text-muted">
              <span
                className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded flex-shrink-0"
                style={{ color: axis.color, backgroundColor: `${axis.color}15` }}
              >
                {offer.code}
              </span>
              {offer.name}
            </li>
          ))}
        </ul>
      )}

      {axis.upcomingOffers && axis.upcomingOffers.length > 0 && (
        <div className="mt-4 rounded-xl border border-dashed p-3" style={{ borderColor: `${axis.color}33` }}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-foursys-text-dim mb-2">
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
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
          style={{ backgroundColor: `${axis.color}18`, color: axis.color, border: `1px solid ${axis.color}38` }}
        >
          {t('portfolio.thesis.seeOffers')} <ArrowRight size={13} aria-hidden="true" />
        </button>
      )}
    </>
  )
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
        aria-controls={`axis-panel-${axis.id}`}
        className="p-5 text-left flex flex-col gap-3 hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${axis.color}1A`, border: `1px solid ${axis.color}40` }}
            >
              <Icon size={18} style={{ color: axis.color }} aria-hidden="true" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-foursys-text-dim">
                {t('portfolio.thesis.axisWord')} {axis.number}
              </div>
              <h3 className="text-base font-black text-white leading-tight">{axis.name}</h3>
            </div>
          </div>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`flex-shrink-0 mt-1 text-foursys-text-dim transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>

        <p className="text-xs text-foursys-text-muted leading-relaxed">{axis.promise}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
            style={{ color: axis.color, borderColor: `${axis.color}40`, backgroundColor: `${axis.color}12` }}
          >
            {offerNames.length} {t('portfolio.thesis.offersInAxis')}
          </span>
          <span className="text-[11px] text-foursys-text-dim">{axis.audience}</span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            id={`axis-panel-${axis.id}`}
            role="region"
            aria-label={axis.name}
            className="overflow-hidden border-t"
            style={{ borderColor: `${axis.color}22` }}
          >
            <div className="p-5 pt-4 space-y-3">
              <ul className="space-y-2">
                {offerNames.map(offer => (
                  <li key={offer.code} className="flex items-start gap-2.5 text-xs text-foursys-text-muted">
                    <span
                      className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded flex-shrink-0"
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
                  <p className="text-[11px] font-bold uppercase tracking-widest text-foursys-text-dim mb-2">
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
                  {t('portfolio.thesis.seeOffers')} <ArrowRight size={13} aria-hidden="true" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
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
  const { axes, offers, institutionalBacking } = useMemo(() => getPortfolio(lang), [lang])
  const [expandedAxis, setExpandedAxis] = useState<string | null>(null)
  const [activeAxisId, setActiveAxisId] = useState<string>(axes[0]?.id ?? '')
  const orbitRef = useRef<HTMLDivElement>(null)

  const offersByAxis = useMemo(() => {
    const map: Record<string, { code: string; name: string }[]> = {}
    for (const offer of offers) {
      map[offer.axisId] = map[offer.axisId] ?? []
      map[offer.axisId].push({ code: offer.code, name: offer.name })
    }
    return map
  }, [offers])

  const offerCountByAxis = useMemo(() => {
    const map: Record<string, number> = {}
    for (const axis of axes) map[axis.id] = offersByAxis[axis.id]?.length ?? 0
    return map
  }, [axes, offersByAxis])

  const showcaseAxes = axes.filter(a => a.role === 'diferenciacao')
  const engineAxes = axes.filter(a => a.role === 'capacidade')

  const activeAxis = axes.find(a => a.id === activeAxisId) ?? axes[0]

  const handleSeeOffers = (axisId: string) => {
    setDeepDiveHint(`axis:${axisId}`)
    navigate('portfolio-offers')
  }

  const handleKeyNav = useCallback(
    (e: React.KeyboardEvent, currentId: string) => {
      const ids = axes.map(a => a.id)
      const idx = ids.indexOf(currentId)
      let nextIdx = idx

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        nextIdx = (idx + 1) % ids.length
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        nextIdx = (idx - 1 + ids.length) % ids.length
      } else if (e.key === 'Home') {
        e.preventDefault()
        nextIdx = 0
      } else if (e.key === 'End') {
        e.preventDefault()
        nextIdx = ids.length - 1
      } else {
        return
      }

      setActiveAxisId(ids[nextIdx])
      const buttons = orbitRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      buttons?.[nextIdx]?.focus()
    },
    [axes],
  )

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-5 md:py-7 max-w-[1400px] mx-auto">

        <BackToOriginChip className="mb-4" />

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 md:mb-5"
        >
          <div className="flex items-start md:items-end justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400 mb-2 flex items-center gap-2">
                <Compass size={13} aria-hidden="true" /> {t('portfolio.badge')}
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
                  <div className="text-[11px] text-foursys-text-dim">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 md:mt-4 h-px bg-gradient-to-r from-cyan-400/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* ── Eixos: vitrine e motor ── */}
        <div
          data-voz-caixa="portfolio-axes-grid"
          data-voz-caixa-secao="portfolio-thesis"
          data-voz-caixa-rotulo={t('portfolio.thesis.title')}
          tabIndex={-1}
          className="focus:outline-none"
        >
          {/* Desktop: mandala + painel lateral (abaixo de lg não há folga para os rótulos) */}
          <div className="hidden lg:block mb-6">
            <div className="flex items-center gap-4 flex-wrap mb-3 md:mb-4">
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-400">
                <span className="w-3 h-3 rounded-full border-2 border-cyan-400/60" aria-hidden="true" />
                {t('portfolio.thesis.showcase')}
              </span>
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                <span className="w-3 h-3 rounded-full border-2 border-dashed border-slate-400/60" aria-hidden="true" />
                {t('portfolio.thesis.engine')}
              </span>
              <span className="flex items-center gap-2 text-[11px] text-foursys-text-dim">
                <span
                  className="w-[18px] h-[18px] rounded-full border border-white/25 flex items-center justify-center text-[10px] font-black text-foursys-text-dim"
                  aria-hidden="true"
                >
                  n
                </span>
                {t('portfolio.thesis.densityHint')}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-5 lg:gap-8 xl:gap-10 items-center min-h-[min(68vh,640px)]">
              <motion.div
                ref={orbitRef}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="px-[140px] xl:px-[150px] py-12 xl:py-14 flex items-center justify-center"
              >
                <AxisOrbitRing
                  axes={axes}
                  activeId={activeAxis.id}
                  offerCountByAxis={offerCountByAxis}
                  onSelect={setActiveAxisId}
                  onKeyNav={handleKeyNav}
                />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAxis.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-[24px] border p-5 lg:p-6 xl:p-7 transition-[border-color,box-shadow] duration-500 self-center"
                  style={{
                    borderColor: `${activeAxis.color}30`,
                    background: `linear-gradient(145deg, ${activeAxis.color}08 0%, transparent 55%), rgba(255,255,255,0.015)`,
                    boxShadow: `0 0 40px ${activeAxis.color}08`,
                  }}
                >
                  <AxisDetailPanel
                    axis={activeAxis}
                    offerNames={offersByAxis[activeAxis.id] ?? []}
                    onSeeOffers={() => handleSeeOffers(activeAxis.id)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile e tablet: cards por papel ── */}
          <div className="space-y-8 lg:hidden">
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

      </div>
    </SectionWrapper>
  )
}
