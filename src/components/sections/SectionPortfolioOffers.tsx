import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Library, Search } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { BackToOriginChip } from '../ui/BackToOriginChip'
import { EVIDENCE_STYLE } from '../portfolio/EvidenceBadge'
import { OfferCard } from '../portfolio/OfferCard'
import { OfferModal } from '../portfolio/OfferModal'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'
import { getPortfolio, isExtractedAxis, sectionForOffer, serviceAxes, serviceOffers } from '../../data/portfolio'
import { MUTED_COLOR } from '../../theme/portfolioTokens'
import type { EvidenceStatus, PortfolioAxis, PortfolioOffer, PortfolioRole } from '../../types'

// ─── Componente principal ────────────────────────────────────────────────────

export function SectionPortfolioOffers() {
  const { state, navigate, clearDeepDiveHint, setDeepDiveHint, trackOfferView } = useApp()
  const { t, lang } = useLanguage()
  const bundle = useMemo(() => getPortfolio(lang), [lang])
  const axes = useMemo(() => serviceAxes(bundle.axes), [bundle.axes])
  const offers = useMemo(() => serviceOffers(bundle.offers), [bundle.offers])
  const { defaultEngagement } = bundle

  // Quem chega da tese pede um eixo; quem chega da shortlist pede uma oferta aberta.
  const entryHint = state.deepDiveHint
  const [axisFilter, setAxisFilter] = useState<string>(() =>
    entryHint?.startsWith('axis:') ? entryHint.slice(5) : 'all',
  )
  const [roleFilter, setRoleFilter] = useState<PortfolioRole | 'all'>('all')
  const [evidenceFilter, setEvidenceFilter] = useState<EvidenceStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<PortfolioOffer | null>(() =>
    entryHint?.startsWith('offer:')
      ? offers.find(o => o.code === entryHint.slice(6)) ?? null
      : null,
  )
  const [presenterMode, setPresenterMode] = useState(false)

  // Quem chegou filtrado precisa saber disso — senão lê 3 ofertas achando que são todas.
  const [entryAxisId] = useState<string | null>(() => {
    if (!entryHint?.startsWith('axis:')) return null
    const axisId = entryHint.slice(5)
    return isExtractedAxis(axisId) ? null : axisId
  })

  useEffect(() => {
    if (!entryHint) return
    if (entryHint.startsWith('axis:') && isExtractedAxis(entryHint.slice(5))) {
      navigate(sectionForOffer({ axisId: entryHint.slice(5) }))
      return
    }
    if (entryHint.startsWith('offer:')) {
      const target = bundle.offers.find(o => o.code === entryHint.slice(6))
      if (target && isExtractedAxis(target.axisId)) {
        navigate(sectionForOffer(target))
        return
      }
    }
    clearDeepDiveHint()
  }, [entryHint, bundle.offers, clearDeepDiveHint, navigate])

  // Qual oferta o cliente pediu para ver é o sinal comercial mais forte da sessão.
  const openOffer = useCallback(
    (offer: PortfolioOffer) => {
      const section = sectionForOffer(offer)
      if (section !== 'portfolio-offers') {
        setDeepDiveHint(`offer:${offer.code}`)
        navigate(section)
        return
      }
      trackOfferView(offer.code, offer.name)
      setSelected(offer)
    },
    [navigate, setDeepDiveHint, trackOfferView],
  )

  // Deep-link (chegou com a oferta já aberta) também conta como visualização.
  const trackedEntry = useRef(false)
  useEffect(() => {
    if (trackedEntry.current || !selected) return
    trackedEntry.current = true
    trackOfferView(selected.code, selected.name)
  }, [selected, trackOfferView])

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return offers.filter(offer => {
      if (axisFilter !== 'all' && offer.axisId !== axisFilter) return false
      if (roleFilter !== 'all' && offer.role !== roleFilter) return false
      if (evidenceFilter !== 'all' && offer.proof.status !== evidenceFilter) return false
      if (!q) return true
      const haystack = [
        offer.code,
        offer.name,
        offer.tagline,
        offer.whatItIs,
        offer.pain,
        ...offer.outcomes,
        ...offer.differentials.map(d => d.title),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [offers, axisFilter, roleFilter, evidenceFilter, query])

  const evidenceCounts = useMemo(() => {
    const map = { 'liberado': 0, 'em-validacao': 0, 'sem-lastro': 0 } as Record<EvidenceStatus, number>
    for (const offer of offers) map[offer.proof.status] += 1
    return map
  }, [offers])

  const usedAxes = useMemo(
    () => axes.filter(axis => offers.some(o => o.axisId === axis.id)),
    [axes, offers],
  )

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">

        <div className="mb-4">
          <BackToOriginChip />
        </div>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 md:mb-7"
        >
          <div className="flex items-start md:items-end justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400 mb-2 flex items-center gap-2">
                <Library size={13} aria-hidden="true" /> {t('portfolio.badge')}
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-none">
                {t('portfolio.offers.title')}
              </h2>
              <p className="text-foursys-text-muted mt-2 text-sm md:text-base max-w-2xl leading-relaxed">
                {t('portfolio.offers.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <InterestButton section="portfolio-offers" />
              <button
                onClick={() => setPresenterMode(v => !v)}
                aria-pressed={presenterMode}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-label font-semibold border transition-colors ${
                  presenterMode
                    ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                    : 'text-foursys-text-dim border-white/[0.08] bg-foursys-surface/40 hover:text-foursys-text-muted'
                }`}
              >
                {presenterMode ? <Eye size={12} aria-hidden="true" /> : <EyeOff size={12} aria-hidden="true" />}
                {t('portfolio.presenter.toggle')}
              </button>
            </div>
          </div>

          <div className="mt-4 md:mt-6 h-px bg-gradient-to-r from-cyan-400/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* ── Filtros ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.06 }}
          className="mb-5 space-y-3"
        >
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1 max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foursys-text-dim" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('portfolio.offers.searchPlaceholder')}
                aria-label={t('portfolio.offers.searchPlaceholder')}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-foursys-surface/40 border border-white/[0.08] text-sm text-white placeholder:text-foursys-text-dim focus:outline-none focus:border-cyan-400/40"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'diferenciacao', 'capacidade'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  aria-pressed={roleFilter === role}
                  className={`px-3 py-2 min-h-touch md:min-h-0 rounded-lg text-label font-semibold border transition-colors ${
                    roleFilter === role
                      ? 'text-white border-cyan-400/40 bg-cyan-500/15'
                      : 'text-foursys-text-dim border-white/[0.08] hover:text-foursys-text-muted'
                  }`}
                >
                  {role === 'all'
                    ? t('portfolio.offers.filterAll')
                    : role === 'diferenciacao'
                      ? t('portfolio.thesis.showcase')
                      : t('portfolio.thesis.engine')}
                </button>
              ))}
            </div>
          </div>

          {/* Com 8 eixos os chips viram parede no celular: rolagem horizontal abaixo de md */}
          <div
            data-voz-filtro="portfolio-axis-filter"
            data-voz-filtro-secao="portfolio-offers"
            className="flex items-center gap-1.5 overflow-x-auto stealth-scrollbar pb-1 -mx-1 px-1 md:flex-wrap md:overflow-x-visible md:pb-0 md:mx-0 md:px-0"
          >
            <button
              onClick={() => setAxisFilter('all')}
              aria-pressed={axisFilter === 'all'}
              className={`flex-shrink-0 whitespace-nowrap px-3 py-2 min-h-touch md:min-h-0 rounded-lg text-label font-semibold border transition-colors ${
                axisFilter === 'all'
                  ? 'text-white border-cyan-400/40 bg-cyan-500/15'
                  : 'text-foursys-text-dim border-white/[0.08] hover:text-foursys-text-muted'
              }`}
            >
              {t('portfolio.offers.filterAll')}
            </button>
            {usedAxes.map(axis => {
              const active = axisFilter === axis.id
              return (
                <button
                  key={axis.id}
                  onClick={() => setAxisFilter(axis.id)}
                  aria-pressed={active}
                  className="flex-shrink-0 whitespace-nowrap px-3 py-2 min-h-touch md:min-h-0 rounded-lg text-label font-semibold border transition-colors"
                  style={
                    active
                      ? { color: axis.color, borderColor: `${axis.color}55`, backgroundColor: `${axis.color}18` }
                      : { color: MUTED_COLOR, borderColor: 'rgba(255,255,255,0.08)' }
                  }
                >
                  {t('portfolio.thesis.axisWord')} {axis.number} · {axis.name}
                </button>
              )
            })}
          </div>

          {/* Lastro de prova como filtro: quem apresenta precisa saber o que pode afirmar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-label font-bold uppercase tracking-[0.14em] text-foursys-text-dim mr-1">
              {t('portfolio.offers.filterEvidence')}
            </span>
            <button
              onClick={() => setEvidenceFilter('all')}
              aria-pressed={evidenceFilter === 'all'}
              className={`px-3 py-2 min-h-touch md:min-h-0 rounded-lg text-label font-semibold border transition-colors ${
                evidenceFilter === 'all'
                  ? 'text-white border-cyan-400/40 bg-cyan-500/15'
                  : 'text-foursys-text-dim border-white/[0.08] hover:text-foursys-text-muted'
              }`}
            >
              {t('portfolio.offers.filterAll')} ({offers.length})
            </button>
            {(['liberado', 'em-validacao', 'sem-lastro'] as const).map(status => {
              const style = EVIDENCE_STYLE[status]
              const StatusIcon = style.icon
              const active = evidenceFilter === status
              return (
                <button
                  key={status}
                  onClick={() => setEvidenceFilter(status)}
                  aria-pressed={active}
                  className="inline-flex items-center gap-1.5 px-3 py-2 min-h-touch md:min-h-0 rounded-lg text-label font-semibold border transition-colors"
                  style={
                    active
                      ? { color: style.color, borderColor: `${style.color}66`, backgroundColor: `${style.color}1A` }
                      : { color: MUTED_COLOR, borderColor: 'rgba(255,255,255,0.08)' }
                  }
                >
                  <StatusIcon size={11} aria-hidden="true" />
                  {t(`portfolio.evidence.${status}`)} ({evidenceCounts[status]})
                </button>
              )
            })}
          </div>

          <p className="text-label text-foursys-text-dim">
            {t('portfolio.offers.resultCount')
              .replace('{count}', String(filtered.length))
              .replace('{total}', String(offers.length))}
          </p>
        </motion.div>

        {/* Contexto de chegada: o usuário veio do mapa com um eixo já aplicado */}
        {entryAxisId && axisFilter === entryAxisId && axesById[entryAxisId] && (
          <div
            className="mb-4 flex items-center gap-3 flex-wrap rounded-xl border px-4 py-3"
            style={{
              borderColor: `${axesById[entryAxisId].color}33`,
              backgroundColor: `${axesById[entryAxisId].color}10`,
            }}
          >
            <span className="text-label font-bold uppercase tracking-wider" style={{ color: axesById[entryAxisId].color }}>
              {t('portfolio.thesis.axisWord')} {axesById[entryAxisId].number}
            </span>
            <span className="text-sm text-foursys-text-muted flex-1 min-w-[180px]">
              {t('portfolio.offers.contextFrom').replace('{axis}', axesById[entryAxisId].name)}
            </span>
            <button
              type="button"
              onClick={() => setAxisFilter('all')}
              className="flex items-center gap-1.5 px-3 py-2 min-h-touch md:min-h-0 rounded-lg text-label font-semibold border border-white/[0.12] text-foursys-text-muted hover:text-white hover:border-white/25 transition-colors"
            >
              {t('portfolio.offers.contextClear').replace('{total}', String(offers.length))}
            </button>
          </div>
        )}

        {/* ── Grid ── */}
        <div
          data-voz-caixa="portfolio-offers-grid"
          data-voz-caixa-secao="portfolio-offers"
          data-voz-caixa-rotulo={t('portfolio.offers.title')}
          tabIndex={-1}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 focus:outline-none"
        >
          {filtered.map((offer, i) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              axis={axesById[offer.axisId]}
              index={i}
              onClick={() => openOffer(offer)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-sm text-foursys-text-dim text-center py-12">{t('portfolio.offers.empty')}</p>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <OfferModal
            offer={selected}
            axis={axesById[selected.axisId]}
            offersByCode={offersByCode}
            presenterMode={presenterMode}
            engagement={selected.engagement ?? defaultEngagement}
            onClose={() => setSelected(null)}
            onOpenOffer={next => openOffer(next)}
            onCompareLegacy={section => {
              setSelected(null)
              navigate(section)
            }}
          />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}

