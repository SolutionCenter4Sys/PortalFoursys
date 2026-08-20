import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Building2,
  ChevronDown,
  Coins,
  Database,
  Route,
  Server,
  Settings2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { BackToOriginChip } from '../ui/BackToOriginChip'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'
import { getPortfolio, sectionForOffer, serviceOffers } from '../../data/portfolio'
import { AXIS_FALLBACK_COLOR, EVIDENCE_COLOR } from '../../theme/portfolioTokens'
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
  const accent = axis?.color ?? AXIS_FALLBACK_COLOR
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
          <span className="font-mono text-label font-bold" style={{ color: accent }}>
            {offer.code}
          </span>
          <span className="text-sm font-bold text-white leading-tight">{offer.name}</span>
          {isOpening && (
            <span
              className="text-meta font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
              style={{ color: accent, backgroundColor: `${accent}18` }}
            >
              {t('portfolio.start.opening')}
            </span>
          )}
        </div>
        <p className="text-xs text-foursys-text-muted leading-relaxed line-clamp-2">{offer.tagline}</p>
        <span
          className="inline-flex items-center gap-1.5 mt-1.5 text-label font-semibold"
          style={{ color: EVIDENCE_COLOR[offer.proof.status] }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: EVIDENCE_COLOR[offer.proof.status] }}
            aria-hidden="true"
          />
          {t(`portfolio.evidence.${offer.proof.status}`)}
        </span>
      </div>

      <ArrowRight size={14} className="text-foursys-text-dim flex-shrink-0 mt-1" aria-hidden="true" />
    </motion.button>
  )
}

export function SectionPortfolioStart() {
  const { navigate, setDeepDiveHint } = useApp()
  const { t, lang } = useLanguage()
  const bundle = useMemo(() => getPortfolio(lang), [lang])
  const { axes, personas, segments } = bundle
  const offers = useMemo(() => serviceOffers(bundle.offers), [bundle.offers])
  const [activePersona, setActivePersona] = useState(personas[0]?.id ?? '')
  const personaRefs = useRef<(HTMLButtonElement | null)[]>([])

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
    const offer = bundle.offers.find(o => o.code === code)
    setDeepDiveHint(`offer:${code}`)
    navigate(offer ? sectionForOffer(offer) : 'portfolio-offers')
  }

  const handlePersonaKeyNav = (e: React.KeyboardEvent, currentId: string) => {
    const ids = personas.map(p => p.id)
    const idx = ids.indexOf(currentId)
    let next = idx

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % ids.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + ids.length) % ids.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = ids.length - 1
    else return

    e.preventDefault()
    setActivePersona(ids[next])
    personaRefs.current[next]?.focus()
  }

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
                <Route size={13} aria-hidden="true" /> {t('portfolio.badge')}
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
          role="radiogroup"
          aria-label={t('portfolio.start.title')}
          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5 md:gap-3 mb-6 focus:outline-none"
        >
          {personas.map((p, i) => {
            const Icon = PERSONA_ICONS[p.icon] ?? Briefcase
            const active = p.id === activePersona
            return (
              <motion.button
                key={p.id}
                ref={el => {
                  personaRefs.current[i] = el
                }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                onClick={() => setActivePersona(p.id)}
                onKeyDown={e => handlePersonaKeyNav(e, p.id)}
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
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
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5"
                  style={{ backgroundColor: `${p.color}1A`, border: `1px solid ${p.color}3A` }}
                >
                  <Icon size={16} style={{ color: p.color }} aria-hidden="true" />
                </div>
                <div className="text-sm font-black text-white leading-tight">{p.role}</div>
                <p className="text-label font-semibold mt-1" style={{ color: p.color }}>
                  {t('portfolio.start.seePaths')}
                </p>
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
              <p className="text-label font-bold uppercase tracking-widest mb-2" style={{ color: persona.color }}>
                {t('portfolio.start.priority')}
              </p>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{persona.concern}</p>
              <div className="mt-4 pt-4 border-t border-white/[0.08]">
                <p className="text-label font-bold uppercase tracking-widest mb-1.5" style={{ color: persona.color }}>
                  {t('portfolio.start.openingQuestion')}
                </p>
                <p className="text-sm text-white/85 leading-relaxed">“{persona.openingQuestion}”</p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-label font-bold uppercase tracking-[0.14em] text-foursys-text-dim mb-3">
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
          <h4 className="text-label font-bold uppercase tracking-[0.14em] text-foursys-text-dim mb-3">
            {t('portfolio.start.segments')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {segments.map((segment, i) => (
              <motion.details
                key={segment.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className="group rounded-2xl bg-foursys-surface/25 border border-white/[0.07] overflow-hidden"
              >
                <summary className="list-none cursor-pointer p-4 flex items-center justify-between gap-3 rounded-xl hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60">
                  <span>
                    <span className="block text-sm font-black text-white">{segment.name}</span>
                    <span className="block text-label text-foursys-text-dim mt-1">
                      {segment.priorityOffers.length} {t('portfolio.start.recommendedPaths')}
                    </span>
                  </span>
                  <ChevronDown
                    size={15}
                    className="text-foursys-text-dim transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="px-4 pb-4 pt-3 border-t border-white/[0.06]">
                  <p className="text-xs text-foursys-text-muted leading-relaxed mb-3">{segment.pain}</p>
                  <div className="flex flex-wrap gap-1.5">
                  {segment.priorityOffers.map(code => {
                    const offer = offersByCode[code]
                    if (!offer) return null
                    const axis = offer ? axesById[offer.axisId] : undefined
                    const accent = axis?.color ?? AXIS_FALLBACK_COLOR
                    const label = offer
                      ? t('portfolio.start.openOffer').replace('{name}', `${offer.code} ${offer.name}`)
                      : code
                    return (
                      <button
                        key={code}
                        onClick={() => openOffer(code)}
                        aria-label={label}
                        title={offer?.name ?? code}
                        className="text-label font-mono font-bold px-3 py-2 min-h-touch md:min-h-[30px] md:px-2.5 md:py-1.5 rounded-lg border transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                        style={{ color: accent, borderColor: `${accent}38`, backgroundColor: `${accent}12` }}
                      >
                        {code}
                      </button>
                    )
                  })}
                  </div>
                </div>
              </motion.details>
            ))}
          </div>
        </div>

      </div>
    </SectionWrapper>
  )
}
