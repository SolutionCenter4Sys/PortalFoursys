import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  FlaskConical,
  Library,
  Link2,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { useApp } from '../../context/AppContext'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLanguage } from '../../i18n'
import { getPortfolio } from '../../data/portfolio'
import type { AppSection, EvidenceStatus, PortfolioAxis, PortfolioOffer, PortfolioRole } from '../../types'

// ─── Selo de lastro de prova ─────────────────────────────────────────────────

const EVIDENCE_STYLE: Record<EvidenceStatus, { color: string; icon: typeof BadgeCheck }> = {
  'liberado': { color: '#4ADE80', icon: BadgeCheck },
  'em-validacao': { color: '#F59E0B', icon: FlaskConical },
  'sem-lastro': { color: '#94A3B8', icon: ShieldAlert },
}

function EvidenceBadge({ status, compact = false }: { status: EvidenceStatus; compact?: boolean }) {
  const { t } = useLanguage()
  const style = EVIDENCE_STYLE[status]
  const Icon = style.icon

  return (
    <span
      title={t(`portfolio.evidence.${status}Hint`)}
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${
        compact ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-1'
      }`}
      style={{ color: style.color, borderColor: `${style.color}44`, backgroundColor: `${style.color}12` }}
    >
      <Icon size={compact ? 9 : 11} />
      {t(`portfolio.evidence.${status}`)}
    </span>
  )
}

// ─── Modal de detalhe da oferta ──────────────────────────────────────────────

function Block({
  title,
  children,
  accent,
}: {
  title: string
  children: React.ReactNode
  accent: string
}) {
  return (
    <div>
      <h4
        className="text-[11px] font-bold uppercase tracking-[0.14em] mb-2.5"
        style={{ color: accent }}
      >
        {title}
      </h4>
      {children}
    </div>
  )
}

function OfferModal({
  offer,
  axis,
  offersByCode,
  presenterMode,
  onClose,
  onOpenOffer,
  onCompareLegacy,
}: {
  offer: PortfolioOffer
  axis: PortfolioAxis | undefined
  offersByCode: Record<string, PortfolioOffer>
  presenterMode: boolean
  onClose: () => void
  onOpenOffer: (offer: PortfolioOffer) => void
  onCompareLegacy: (section: AppSection) => void
}) {
  const trapRef = useFocusTrap(true)
  const { t } = useLanguage()
  const accent = axis?.color ?? '#22D3EE'

  const roleLabel =
    offer.role === 'diferenciacao'
      ? t('portfolio.thesis.showcase')
      : t('portfolio.thesis.engine')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={offer.name}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        ref={trapRef}
        initial={{ scale: 0.96, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 18 }}
        onClick={e => e.stopPropagation()}
        data-voz-scroll-root
        className="relative z-10 bg-foursys-dark-2 border border-white/[0.12] rounded-t-2xl sm:rounded-2xl max-w-3xl w-full overflow-y-auto max-h-[92dvh]"
      >
        {/* ── Cabeçalho ── */}
        <div
          className="p-6 md:p-7 border-b"
          style={{
            borderColor: `${accent}33`,
            background: `linear-gradient(135deg, ${accent}1F 0%, transparent 70%)`,
          }}
        >
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            data-voz-fechar-detalhe="true"
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 text-foursys-text-muted transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2 flex-wrap mb-3 pr-10">
            <span
              className="font-mono text-[11px] font-bold px-2 py-0.5 rounded"
              style={{ color: accent, backgroundColor: `${accent}1A`, border: `1px solid ${accent}40` }}
            >
              {offer.code}
            </span>
            {axis && (
              <span className="text-[10px] text-foursys-text-dim uppercase tracking-widest">
                {t('portfolio.thesis.axisWord')} {axis.number} · {axis.name}
              </span>
            )}
            <span className="text-[10px] text-foursys-text-dim">·</span>
            <span className="text-[10px] text-foursys-text-dim uppercase tracking-widest">{roleLabel}</span>
            {offer.portfolioRole && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                style={{ color: '#22D3EE', borderColor: '#22D3EE44', backgroundColor: '#22D3EE12' }}
              >
                {offer.portfolioRole}
              </span>
            )}
          </div>

          <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-2">{offer.name}</h3>
          <p className="text-sm md:text-base font-semibold" style={{ color: accent }}>
            {offer.headline}
          </p>

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <EvidenceBadge status={offer.proof.status} />
            <span className="text-[11px] text-foursys-text-dim">
              {t('portfolio.offer.duration')}: {offer.totalDuration}
            </span>
          </div>
        </div>

        {/* ── Corpo ── */}
        <div className="p-6 md:p-7 space-y-6">

          <div className="grid md:grid-cols-2 gap-5">
            <Block title={t('portfolio.offer.whatItIs')} accent={accent}>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{offer.whatItIs}</p>
            </Block>
            <Block title={t('portfolio.offer.pain')} accent={accent}>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{offer.pain}</p>
            </Block>
          </div>

          {offer.entryTriggers && offer.entryTriggers.length > 0 && (
            <Block title={t('portfolio.offer.triggers')} accent={accent}>
              <div className="flex flex-wrap gap-2">
                {offer.entryTriggers.map(trigger => (
                  <span
                    key={trigger}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-foursys-surface/40 border border-white/[0.08] text-foursys-text-muted"
                  >
                    {trigger}
                  </span>
                ))}
              </div>
            </Block>
          )}

          {/* Você sai com */}
          <Block title={t('portfolio.offer.outcomes')} accent={accent}>
            <ul className="grid md:grid-cols-2 gap-2">
              {offer.outcomes.map(outcome => (
                <li key={outcome} className="flex items-start gap-2.5 text-sm text-foursys-text-muted">
                  <CheckCircle2 size={14} style={{ color: accent }} className="flex-shrink-0 mt-0.5" />
                  {outcome}
                </li>
              ))}
            </ul>
          </Block>

          {/* Diferenciais */}
          <Block title={t('portfolio.offer.differentials')} accent={accent}>
            <div className="space-y-2.5">
              {offer.differentials.map(diff => (
                <div
                  key={diff.title}
                  className="p-3 rounded-xl bg-foursys-surface/30 border-l-2"
                  style={{ borderColor: accent }}
                >
                  <div className="text-sm font-bold text-white mb-0.5">{diff.title}</div>
                  <p className="text-xs text-foursys-text-muted leading-relaxed">{diff.detail}</p>
                </div>
              ))}
            </div>
          </Block>

          {/* Método */}
          <Block title={t('portfolio.offer.method')} accent={accent}>
            <ol className="space-y-2.5">
              {offer.phases.map((phase, i) => (
                <li key={phase.name} className="flex gap-3">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black"
                      style={{ backgroundColor: `${accent}1F`, color: accent, border: `1px solid ${accent}44` }}
                    >
                      {i + 1}
                    </span>
                    {i < offer.phases.length - 1 && (
                      <div className="w-px flex-1 mt-1" style={{ backgroundColor: `${accent}30` }} />
                    )}
                  </div>
                  <div className="pb-2">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">{phase.name}</span>
                      <span className="text-[10px] text-foursys-text-dim">{phase.duration}</span>
                    </div>
                    <p className="text-xs text-foursys-text-muted leading-relaxed mt-0.5">{phase.focus}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Block>

          {/* Entregáveis e ativos */}
          {((offer.components?.length ?? 0) > 0 || (offer.assets?.length ?? 0) > 0) && (
            <div className="grid md:grid-cols-2 gap-5">
              {offer.components && offer.components.length > 0 && (
                <Block title={t('portfolio.offer.components')} accent={accent}>
                  <ul className="space-y-1.5">
                    {offer.components.map(c => (
                      <li key={c} className="text-xs text-foursys-text-muted flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: accent }} />
                        {c}
                      </li>
                    ))}
                  </ul>
                </Block>
              )}
              {offer.assets && offer.assets.length > 0 && (
                <Block title={t('portfolio.offer.assets')} accent={accent}>
                  <div className="flex flex-wrap gap-2">
                    {offer.assets.map(a => (
                      <span
                        key={a}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border"
                        style={{ color: accent, borderColor: `${accent}33`, backgroundColor: `${accent}10` }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </Block>
              )}
            </div>
          )}

          {/* Mercado e regulatório */}
          {offer.marketStats.length > 0 && (
            <Block title={t('portfolio.offer.market')} accent={accent}>
              <div className="space-y-2">
                {offer.marketStats.map(stat => (
                  <div key={stat.stat} className="p-3 rounded-xl bg-foursys-surface/25 border border-white/[0.06]">
                    <p className="text-sm text-white leading-snug">{stat.stat}</p>
                    <p className="text-[10px] text-foursys-text-dim mt-1">{stat.source}</p>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {offer.regulatory && offer.regulatory.length > 0 && (
            <Block title={t('portfolio.offer.regulatory')} accent={accent}>
              <ul className="space-y-1.5">
                {offer.regulatory.map(r => (
                  <li key={r} className="text-xs text-foursys-text-muted flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: accent }} />
                    {r}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {/* Personas */}
          <Block title={t('portfolio.offer.personas')} accent={accent}>
            <div className="grid md:grid-cols-2 gap-2">
              {offer.personas.map(p => (
                <div key={p.role} className="p-3 rounded-xl bg-foursys-surface/25 border border-white/[0.06]">
                  <div className="text-xs font-bold text-white">{p.role}</div>
                  <p className="text-[11px] text-foursys-text-muted leading-relaxed mt-0.5">{p.value}</p>
                </div>
              ))}
            </div>
          </Block>

          {/* Conexões */}
          {offer.connects.length > 0 && (
            <Block title={t('portfolio.offer.connects')} accent={accent}>
              <div className="flex flex-wrap gap-2">
                {offer.connects.map(code => {
                  const target = offersByCode[code]
                  if (!target) {
                    return (
                      <span
                        key={code}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-foursys-surface/30 border border-white/[0.06] text-foursys-text-dim"
                      >
                        {code}
                      </span>
                    )
                  }
                  return (
                    <button
                      key={code}
                      onClick={() => onOpenOffer(target)}
                      className="text-[11px] px-2.5 py-1 rounded-lg border text-foursys-text-muted hover:text-white hover:border-white/20 transition-colors flex items-center gap-1.5"
                      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                    >
                      <Link2 size={10} />
                      <span className="font-mono font-bold">{target.code}</span> {target.name}
                    </button>
                  )
                })}
              </div>
            </Block>
          )}

          {/* Fronteira */}
          {offer.boundary && (
            <div className="p-4 rounded-xl bg-foursys-surface/25 border border-white/[0.08]">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-foursys-text-dim mb-1.5">
                {t('portfolio.offer.boundary')}
              </h4>
              <p className="text-xs text-foursys-text-muted leading-relaxed">{offer.boundary}</p>
            </div>
          )}

          {/* CTA */}
          <div
            className="p-4 md:p-5 rounded-xl border"
            style={{ borderColor: `${accent}33`, backgroundColor: `${accent}0D` }}
          >
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: accent }}>
              {t('portfolio.offer.cta')}
            </h4>
            <p className="text-sm text-white leading-relaxed">{offer.cta}</p>
          </div>

          {/* Notas de condução — apenas em modo apresentador */}
          {presenterMode && (
            <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-amber-400 flex items-center gap-1.5">
                <Eye size={11} /> {t('portfolio.presenter.title')}
              </h4>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-400/70 font-bold">
                  {t('portfolio.offer.proof')}
                </span>
                <p className="text-xs text-foursys-text-muted leading-relaxed">{offer.proof.note}</p>
              </div>
              {offer.proof.cases && offer.proof.cases.length > 0 && (
                <ul className="space-y-1">
                  {offer.proof.cases.map(c => (
                    <li key={c} className="text-xs text-foursys-text-muted flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              )}
              {offer.editorialCare && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-amber-400/70 font-bold">
                    {t('portfolio.presenter.care')}
                  </span>
                  <p className="text-xs text-foursys-text-muted leading-relaxed">{offer.editorialCare}</p>
                </div>
              )}
            </div>
          )}

          {/* Comparação com a seção legada */}
          {offer.legacyEquivalent && (
            <button
              onClick={() => onCompareLegacy(offer.legacyEquivalent!.section)}
              className="w-full text-left p-3 rounded-xl border border-white/[0.07] bg-foursys-surface/20 hover:border-white/20 transition-colors flex items-center justify-between gap-3"
            >
              <span className="text-[11px] text-foursys-text-dim">
                {t('portfolio.offer.legacy')}:{' '}
                <span className="text-foursys-text-muted">{offer.legacyEquivalent.label}</span>
              </span>
              <ArrowRight size={13} className="text-foursys-text-dim flex-shrink-0" />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Card da oferta ──────────────────────────────────────────────────────────

function OfferCard({
  offer,
  axis,
  index,
  onClick,
}: {
  offer: PortfolioOffer
  axis: PortfolioAxis | undefined
  index: number
  onClick: () => void
}) {
  const { t } = useLanguage()
  const accent = axis?.color ?? '#22D3EE'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.35 }}
      onClick={onClick}
      data-voz-detalhe={`portfolio-offer-${offer.id}`}
      data-voz-detalhe-secao="portfolio-offers"
      data-voz-detalhe-rotulo={offer.name}
      className="p-5 rounded-2xl bg-foursys-surface/30 border cursor-pointer hover:-translate-y-1 hover:bg-foursys-surface/45 transition-all duration-300 flex flex-col group"
      style={{ borderColor: `${accent}2E` }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span
          className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
          style={{ color: accent, backgroundColor: `${accent}18`, border: `1px solid ${accent}38` }}
        >
          {offer.code}
        </span>
        <EvidenceBadge status={offer.proof.status} compact />
      </div>

      <h3 className="text-base font-black text-white leading-tight mb-1">{offer.name}</h3>
      <p className="text-xs font-semibold mb-3 leading-snug" style={{ color: accent }}>
        {offer.tagline}
      </p>

      <p className="text-xs text-foursys-text-muted leading-relaxed flex-1 line-clamp-3 mb-3">
        {offer.pain}
      </p>

      <div className="space-y-1.5 mb-3">
        {offer.outcomes.slice(0, 2).map(outcome => (
          <div key={outcome} className="flex items-start gap-1.5 text-[11px] text-foursys-text-dim">
            <CheckCircle2 size={11} style={{ color: accent }} className="flex-shrink-0 mt-0.5" />
            <span className="line-clamp-1">{outcome}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/[0.06]">
        <span className="text-[10px] text-foursys-text-dim">{offer.totalDuration}</span>
        <span
          className="flex items-center gap-1 text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: accent }}
        >
          {t('common.seeMore')} <ArrowRight size={11} />
        </span>
      </div>
    </motion.div>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────

export function SectionPortfolioOffers() {
  const { state, navigate, clearDeepDiveHint } = useApp()
  const { t, lang } = useLanguage()
  const { axes, offers } = useMemo(() => getPortfolio(lang), [lang])

  // Quem chega da tese pede um eixo; quem chega da shortlist pede uma oferta aberta.
  const entryHint = state.deepDiveHint
  const [axisFilter, setAxisFilter] = useState<string>(() =>
    entryHint?.startsWith('axis:') ? entryHint.slice(5) : 'all',
  )
  const [roleFilter, setRoleFilter] = useState<PortfolioRole | 'all'>('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<PortfolioOffer | null>(() =>
    entryHint?.startsWith('offer:')
      ? offers.find(o => o.code === entryHint.slice(6)) ?? null
      : null,
  )
  const [presenterMode, setPresenterMode] = useState(false)

  useEffect(() => {
    if (entryHint) clearDeepDiveHint()
  }, [entryHint, clearDeepDiveHint])

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
  }, [offers, axisFilter, roleFilter, query])

  const usedAxes = useMemo(
    () => axes.filter(axis => offers.some(o => o.axisId === axis.id)),
    [axes, offers],
  )

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">

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
                <Library size={13} /> {t('portfolio.badge')}
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
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold border transition-colors ${
                  presenterMode
                    ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                    : 'text-foursys-text-dim border-white/[0.08] bg-foursys-surface/40 hover:text-foursys-text-muted'
                }`}
              >
                {presenterMode ? <Eye size={12} /> : <EyeOff size={12} />}
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
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foursys-text-dim" />
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
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
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

          <div
            data-voz-filtro="portfolio-axis-filter"
            data-voz-filtro-secao="portfolio-offers"
            className="flex items-center gap-1.5 flex-wrap"
          >
            <button
              onClick={() => setAxisFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
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
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors"
                  style={
                    active
                      ? { color: axis.color, borderColor: `${axis.color}55`, backgroundColor: `${axis.color}18` }
                      : { color: '#64748B', borderColor: 'rgba(255,255,255,0.08)' }
                  }
                >
                  {t('portfolio.thesis.axisWord')} {axis.number} · {axis.name}
                </button>
              )
            })}
          </div>

          <p className="text-[11px] text-foursys-text-dim">
            {t('portfolio.offers.resultCount')
              .replace('{count}', String(filtered.length))
              .replace('{total}', String(offers.length))}
          </p>
        </motion.div>

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
              onClick={() => setSelected(offer)}
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
            onClose={() => setSelected(null)}
            onOpenOffer={next => setSelected(next)}
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
