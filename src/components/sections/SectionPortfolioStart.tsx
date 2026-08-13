import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Building2,
  Coins,
  Database,
  Route,
  Server,
  Settings2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'
import { getPortfolio } from '../../data/portfolio'
import type { PortfolioAxis, PortfolioOffer } from '../../types'

const PERSONA_ICONS: Record<string, LucideIcon> = {
  building: Building2,
  server: Server,
  settings: Settings2,
  coins: Coins,
  database: Database,
  briefcase: Briefcase,
}

function ShortlistStep({
  offer,
  axis,
  position,
  onOpen,
}: {
  offer: PortfolioOffer
  axis: PortfolioAxis | undefined
  position: number
  onOpen: () => void
}) {
  const { t } = useLanguage()
  const accent = axis?.color ?? '#22D3EE'
  const isOpening = position === 0

  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: position * 0.06, duration: 0.35 }}
      onClick={onOpen}
      className={`w-full text-left p-4 rounded-xl border transition-all hover:-translate-y-0.5 flex items-start gap-3 ${
        isOpening ? 'bg-foursys-surface/50' : 'bg-foursys-surface/25'
      }`}
      style={{ borderColor: isOpening ? `${accent}55` : 'rgba(255,255,255,0.07)' }}
    >
      <span
        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
        style={{ backgroundColor: `${accent}1F`, color: accent, border: `1px solid ${accent}44` }}
      >
        {position + 1}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-mono text-[10px] font-bold" style={{ color: accent }}>
            {offer.code}
          </span>
          <span className="text-sm font-bold text-white leading-tight">{offer.name}</span>
          {isOpening && (
            <span
              className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
              style={{ color: accent, backgroundColor: `${accent}18` }}
            >
              {t('portfolio.start.opening')}
            </span>
          )}
        </div>
        <p className="text-xs text-foursys-text-muted leading-relaxed line-clamp-2">{offer.tagline}</p>
      </div>

      <ArrowRight size={14} className="text-foursys-text-dim flex-shrink-0 mt-1" />
    </motion.button>
  )
}

export function SectionPortfolioStart() {
  const { navigate, setDeepDiveHint } = useApp()
  const { t, lang } = useLanguage()
  const { axes, offers, personas, segments } = useMemo(() => getPortfolio(lang), [lang])
  const [activePersona, setActivePersona] = useState(personas[0]?.id ?? '')

  const axesById = useMemo(() => {
    const map: Record<string, PortfolioAxis> = {}
    for (const axis of axes) map[axis.id] = axis
    return map
  }, [axes])

  const offersByCode = useMemo(() => {
    const map: Record<string, PortfolioOffer> = {}
    for (const offer of offers) map[offer.code] = offer
    return map
  }, [offers])

  const persona = personas.find(p => p.id === activePersona) ?? personas[0]

  const openOffer = (code: string) => {
    setDeepDiveHint(`offer:${code}`)
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
                <Route size={13} /> {t('portfolio.badge')}
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-none">
                {t('portfolio.start.title')}
              </h2>
              <p className="text-foursys-text-muted mt-2 text-sm md:text-base max-w-2xl leading-relaxed">
                {t('portfolio.start.subtitle')}
              </p>
            </div>
            <InterestButton section="portfolio-start" />
          </div>

          <div className="mt-4 md:mt-6 h-px bg-gradient-to-r from-cyan-400/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* ── Seletor de persona ── */}
        <div
          data-voz-caixa="portfolio-personas-grid"
          data-voz-caixa-secao="portfolio-start"
          data-voz-caixa-rotulo={t('portfolio.start.title')}
          tabIndex={-1}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5 md:gap-3 mb-6 focus:outline-none"
        >
          {personas.map((p, i) => {
            const Icon = PERSONA_ICONS[p.icon] ?? Briefcase
            const active = p.id === activePersona
            return (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                onClick={() => setActivePersona(p.id)}
                aria-pressed={active}
                data-voz-detalhe={`portfolio-persona-${p.id}`}
                data-voz-detalhe-secao="portfolio-start"
                data-voz-detalhe-rotulo={p.role}
                className="p-4 rounded-2xl border text-left transition-all hover:-translate-y-0.5"
                style={{
                  borderColor: active ? `${p.color}66` : 'rgba(255,255,255,0.07)',
                  backgroundColor: active ? `${p.color}14` : 'rgba(255,255,255,0.02)',
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${p.color}1A`, border: `1px solid ${p.color}3A` }}
                >
                  <Icon size={16} style={{ color: p.color }} />
                </div>
                <div className="text-sm font-black text-white leading-tight">{p.role}</div>
                <p className="text-[11px] text-foursys-text-dim leading-snug mt-1 line-clamp-2">{p.concern}</p>
              </motion.button>
            )
          })}
        </div>

        {/* ── Shortlist da persona ── */}
        {persona && (
          <motion.div
            key={persona.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid lg:grid-cols-3 gap-5 mb-8"
          >
            <div
              className="lg:col-span-1 p-5 rounded-2xl border"
              style={{ borderColor: `${persona.color}33`, backgroundColor: `${persona.color}0D` }}
            >
              <h3 className="text-lg font-black text-white mb-1">{persona.role}</h3>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: persona.color }}>
                {t('portfolio.start.concern')}
              </p>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{persona.concern}</p>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-foursys-text-dim mb-3">
                {t('portfolio.start.shortlist')}
              </h4>
              <div className="space-y-2">
                {persona.shortlist.map((code, i) => {
                  const offer = offersByCode[code]
                  if (!offer) return null
                  return (
                    <ShortlistStep
                      key={code}
                      offer={offer}
                      axis={axesById[offer.axisId]}
                      position={i}
                      onOpen={() => openOffer(code)}
                    />
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Overlay por segmento ── */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-foursys-text-dim mb-3">
            {t('portfolio.start.segments')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {segments.map((segment, i) => (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className="p-4 rounded-2xl bg-foursys-surface/25 border border-white/[0.07]"
              >
                <div className="text-sm font-black text-white mb-1.5">{segment.name}</div>
                <p className="text-xs text-foursys-text-muted leading-relaxed mb-3">{segment.pain}</p>
                <div className="flex flex-wrap gap-1.5">
                  {segment.priorityOffers.map(code => {
                    const offer = offersByCode[code]
                    const axis = offer ? axesById[offer.axisId] : undefined
                    const accent = axis?.color ?? '#64748B'
                    return (
                      <button
                        key={code}
                        onClick={() => openOffer(code)}
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-opacity hover:opacity-75"
                        style={{ color: accent, borderColor: `${accent}38`, backgroundColor: `${accent}12` }}
                      >
                        {code}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </SectionWrapper>
  )
}
