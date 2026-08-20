import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Handshake,
  Lightbulb,
  Link2,
  PackageCheck,
  Route,
  Target,
  X,
} from 'lucide-react'
import { EvidenceBadge } from './EvidenceBadge'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'
import { portfolioBridges, portfolioGlossary } from '../../data/portfolioGuidance'
import { getPortfolioExample } from '../../data/portfolioExamples'
import { trackCTAClick } from '../../hooks/useSessionPersistence'
import { AXIS_FALLBACK_COLOR } from '../../theme/portfolioTokens'
import type {
  PortfolioAxis,
  PortfolioEngagement,
  PortfolioOffer,
} from '../../types'

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
        className="text-label font-bold uppercase tracking-[0.14em] mb-2.5"
        style={{ color: accent }}
      >
        {title}
      </h4>
      {children}
    </div>
  )
}

export function OfferModal({
  offer,
  axis,
  offersByCode,
  engagement,
  onClose,
  onOpenOffer,
}: {
  offer: PortfolioOffer
  axis: PortfolioAxis | undefined
  offersByCode: Record<string, PortfolioOffer>
  engagement: PortfolioEngagement
  onClose: () => void
  onOpenOffer: (offer: PortfolioOffer) => void
}) {
  const trapRef = useFocusTrap(true)
  const { state, toggleInterest, toggleOfferInterest } = useApp()
  const { t, lang } = useLanguage()
  const conversationRequested = state.interestedOffers.some(item => item.code === offer.code)
  const accent = axis?.color ?? AXIS_FALLBACK_COLOR
  const bridge = portfolioBridges.find(item => item.entryCode === offer.code)
  const glossaryHaystack = [
    offer.name,
    offer.headline,
    offer.tagline,
    offer.whatItIs,
    offer.pain,
    ...(offer.assets ?? []),
    ...offer.outcomes,
    ...offer.differentials.flatMap(item => [item.title, item.detail]),
  ].join(' ').toLocaleLowerCase('pt-BR')
  const contextualGlossary = portfolioGlossary.filter(item =>
    glossaryHaystack.includes(item.term.toLocaleLowerCase('pt-BR')),
  )
  const simpleExample =
    getPortfolioExample(offer.code, lang) ??
    t('portfolio.offer.fallbackExample')
      .replace('{trigger}', offer.entryTriggers?.[0] ?? offer.pain)
      .replace('{outcome}', offer.outcomes[0] ?? offer.whatItIs)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  // Sem isto o conteúdo atrás do modal continua rolando ao arrastar no celular.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const roleLabel =
    offer.role === 'diferenciacao'
      ? t('portfolio.thesis.showcase')
      : t('portfolio.thesis.engine')

  const requestConversation = () => {
    if (!state.interestedSections.includes('portfolio-offers')) {
      toggleInterest('portfolio-offers')
    }
    toggleOfferInterest({
      code: offer.code,
      name: offer.name,
      challenge: offer.pain,
      maturity: offer.proof.status,
      nextStep: offer.cta,
      clientId: state.activeClientId,
      sessionRole: state.sessionProfile?.role ?? null,
      createdAt: Date.now(),
    })
    trackCTAClick(`portfolio-offer:${offer.code}`)
  }

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
        className="relative z-10 bg-foursys-dark-2 border border-white/[0.12] rounded-t-2xl sm:rounded-2xl max-w-3xl w-full overflow-y-auto overscroll-contain max-h-[92dvh] safe-bottom sm:pb-0"
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
            className="absolute top-3 right-3 md:top-4 md:right-4 flex items-center justify-center min-w-touch min-h-touch md:min-w-0 md:min-h-0 md:p-2 rounded-xl hover:bg-white/10 text-foursys-text-muted transition-colors"
          >
            <X size={16} aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2 flex-wrap mb-3 pr-10">
            <span
              className="font-mono text-label font-bold px-2 py-0.5 rounded"
              style={{ color: accent, backgroundColor: `${accent}1A`, border: `1px solid ${accent}40` }}
            >
              {offer.code}
            </span>
            {axis && (
              <span className="text-meta text-foursys-text-dim uppercase tracking-widest">
                {t('portfolio.thesis.axisWord')} {axis.number} · {axis.name}
              </span>
            )}
            <span className="text-meta text-foursys-text-dim">·</span>
            <span className="text-meta text-foursys-text-dim uppercase tracking-widest">{roleLabel}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-2">{offer.name}</h3>
          <p className="text-sm md:text-base font-semibold" style={{ color: accent }}>
            {offer.headline}
          </p>

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <EvidenceBadge status={offer.proof.status} />
            <span className="text-label text-foursys-text-dim">
              {t('portfolio.offer.duration')}: {offer.totalDuration}
            </span>
          </div>
        </div>

        {/* ── Corpo ── */}
        <div className="p-6 md:p-7 space-y-6">

          <div>
            <h4 className="text-label font-bold uppercase tracking-[0.14em] text-foursys-text-dim mb-3">
              {t('portfolio.offer.snapshot')}
            </h4>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {[
                {
                  label: t('portfolio.offer.challenge'),
                  value: offer.pain,
                  icon: Target,
                },
                {
                  label: t('portfolio.offer.delivery'),
                  value: offer.outcomes[0] ?? offer.whatItIs,
                  icon: PackageCheck,
                },
                {
                  label: t('portfolio.offer.journey'),
                  value: `${offer.phases.length} ${t('portfolio.offer.steps')} · ${offer.totalDuration}`,
                  icon: Route,
                },
                {
                  label: t('portfolio.offer.cta'),
                  value: offer.cta,
                  icon: ArrowRight,
                },
              ].map(item => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className="p-3.5 rounded-xl border bg-foursys-surface/25 flex items-start gap-3"
                    style={{ borderColor: `${accent}24` }}
                  >
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ color: accent, backgroundColor: `${accent}14` }}
                    >
                      <Icon size={14} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <span className="block text-meta font-bold uppercase tracking-wider" style={{ color: accent }}>
                        {item.label}
                      </span>
                      <p className="text-xs text-foursys-text-muted leading-relaxed mt-1 line-clamp-3">{item.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <details className="group rounded-xl border border-white/[0.07] bg-foursys-surface/15 overflow-hidden">
            <summary className="list-none cursor-pointer p-4 flex items-center justify-between gap-3 rounded-xl hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60">
              <span className="text-sm font-bold text-white">{t('portfolio.offer.understand')}</span>
              <ChevronDown
                size={15}
                className="text-foursys-text-dim transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="grid md:grid-cols-2 gap-5 p-4 border-t border-white/[0.06]">
              <Block title={t('portfolio.offer.whatItIs')} accent={accent}>
                <p className="text-sm text-foursys-text-muted leading-relaxed">{offer.whatItIs}</p>
              </Block>
              <Block title={t('portfolio.offer.pain')} accent={accent}>
                <p className="text-sm text-foursys-text-muted leading-relaxed">{offer.pain}</p>
              </Block>
            </div>
          </details>

          <div
            className="p-4 rounded-xl border flex items-start gap-3"
            style={{ borderColor: `${accent}2E`, backgroundColor: `${accent}0A` }}
          >
            <Lightbulb size={16} style={{ color: accent }} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h4 className="text-label font-bold uppercase tracking-[0.14em] mb-1" style={{ color: accent }}>
                {t('portfolio.offer.example')}
              </h4>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{simpleExample}</p>
            </div>
          </div>

          {contextualGlossary.length > 0 && (
            <Block title={t('portfolio.offer.glossary')} accent={accent}>
              <div className="flex flex-wrap gap-2">
                {contextualGlossary.map(item => (
                  <span
                    key={item.term}
                    title={item.definition[lang]}
                    className="inline-flex items-center gap-1.5 text-label px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-foursys-surface/30 text-foursys-text-muted"
                  >
                    <BookOpen size={10} style={{ color: accent }} aria-hidden="true" />
                    <span className="font-bold text-white">{item.term}</span>
                    <span aria-hidden="true">·</span>
                    {item.clientLanguage[lang]}
                  </span>
                ))}
              </div>
            </Block>
          )}

          {offer.entryTriggers && offer.entryTriggers.length > 0 && (
            <Block title={t('portfolio.offer.triggers')} accent={accent}>
              <div className="flex flex-wrap gap-2">
                {offer.entryTriggers.map(trigger => (
                  <span
                    key={trigger}
                    className="text-label px-2.5 py-1 rounded-lg bg-foursys-surface/40 border border-white/[0.08] text-foursys-text-muted"
                  >
                    {trigger}
                  </span>
                ))}
              </div>
            </Block>
          )}

          <details className="group rounded-xl border border-white/[0.07] bg-foursys-surface/15 overflow-hidden">
            <summary className="list-none cursor-pointer p-4 flex items-center justify-between gap-3 rounded-xl hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60">
              <span className="text-sm font-bold text-white">{t('portfolio.offer.deliveryDetails')}</span>
              <ChevronDown
                size={15}
                className="text-foursys-text-dim transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="p-4 border-t border-white/[0.06] space-y-6">

          {/* Você sai com */}
          <Block title={t('portfolio.offer.outcomes')} accent={accent}>
            <ul className="grid md:grid-cols-2 gap-2">
              {offer.outcomes.map(outcome => (
                <li key={outcome} className="flex items-start gap-2.5 text-sm text-foursys-text-muted">
                  <CheckCircle2 size={14} style={{ color: accent }} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
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
                      className="w-6 h-6 rounded-full flex items-center justify-center text-label font-black"
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
                      <span className="text-label text-foursys-text-dim">{phase.duration}</span>
                    </div>
                    <p className="text-xs text-foursys-text-muted leading-relaxed mt-0.5">{phase.focus}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Block>

          {/* Entregáveis e ativos */}
          {(((offer.components?.length ?? 0) > 0 && !offer.modules?.length) || (offer.assets?.length ?? 0) > 0) && (
            <div className="grid md:grid-cols-2 gap-5">
              {offer.components && offer.components.length > 0 && !offer.modules?.length && (
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
                        className="text-label font-semibold px-2.5 py-1 rounded-lg border"
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

          {offer.modules && offer.modules.length > 0 && (
            <Block title={t('portfolio.offer.modules')} accent={accent}>
              <div className="grid md:grid-cols-2 gap-2.5">
                {offer.modules.map((module, index) => (
                  <details
                    key={module.name}
                    className="group rounded-xl bg-foursys-surface/25 border border-white/[0.07] overflow-hidden"
                  >
                    <summary className="list-none cursor-pointer p-3.5 flex items-center justify-between gap-3 rounded-xl hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60">
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-label font-black flex-shrink-0"
                          style={{ backgroundColor: `${accent}1A`, color: accent }}
                        >
                          {index + 1}
                        </span>
                        <span className="text-sm font-bold text-white leading-tight">{module.name}</span>
                      </span>
                      <ChevronDown
                        size={14}
                        className="text-foursys-text-dim flex-shrink-0 transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="px-3.5 pb-3.5 pt-0 border-t border-white/[0.05]">
                      <p className="text-xs text-foursys-text-muted leading-relaxed mt-3">{module.description}</p>
                      <p className="text-xs text-white leading-relaxed mt-2">
                        <span className="font-bold" style={{ color: accent }}>
                          {t('portfolio.offer.clientValue')}:
                        </span>{' '}
                        {module.clientValue}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {module.deliverables.map(deliverable => (
                          <li key={deliverable} className="text-label text-foursys-text-dim flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: accent }} />
                            {deliverable}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ))}
              </div>
            </Block>
          )}
            </div>
          </details>

          <details className="group rounded-xl border border-white/[0.07] bg-foursys-surface/15 overflow-hidden">
            <summary className="list-none cursor-pointer p-4 flex items-center justify-between gap-3 rounded-xl hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60">
              <span className="text-sm font-bold text-white">{t('portfolio.offer.contextDetails')}</span>
              <ChevronDown
                size={15}
                className="text-foursys-text-dim transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="p-4 border-t border-white/[0.06] space-y-6">

          {/* Mercado e regulatório */}
          {offer.marketStats.length > 0 && (
            <Block title={t('portfolio.offer.market')} accent={accent}>
              <div className="space-y-2">
                {offer.marketStats.map(stat => (
                  <div key={stat.stat} className="p-3 rounded-xl bg-foursys-surface/25 border border-white/[0.06]">
                    <p className="text-sm text-white leading-snug">{stat.stat}</p>
                    <p className="text-label text-foursys-text-dim mt-1">{stat.source}</p>
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
                  <p className="text-label text-foursys-text-muted leading-relaxed mt-0.5">{p.value}</p>
                </div>
              ))}
            </div>
          </Block>
            </div>
          </details>

          {/* Conexões */}
          {offer.connects.length > 0 && (
            <Block title={t('portfolio.offer.connects')} accent={accent}>
              <p className="text-xs text-foursys-text-dim leading-relaxed mb-2.5">
                {t('portfolio.offer.connectsHint').replace('{offer}', offer.name)}
              </p>
              <div className="flex flex-wrap gap-2">
                {offer.connects.map(code => {
                  const target = offersByCode[code]
                  if (!target) {
                    return (
                      <span
                        key={code}
                        className="text-label px-2.5 py-1 rounded-lg bg-foursys-surface/30 border border-white/[0.06] text-foursys-text-dim"
                      >
                        {code}
                      </span>
                    )
                  }
                  return (
                    <button
                      key={code}
                      onClick={() => onOpenOffer(target)}
                      className="text-label px-2.5 py-1 rounded-lg border text-foursys-text-muted hover:text-white hover:border-white/20 transition-colors flex items-center gap-1.5"
                      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                    >
                      <Link2 size={10} aria-hidden="true" />
                      <span className="font-mono font-bold">{target.code}</span> {target.name}
                    </button>
                  )
                })}
              </div>
            </Block>
          )}

          {bridge && (
            <div className="p-4 rounded-xl border border-white/[0.08] bg-foursys-surface/20">
              <h4 className="text-label font-bold uppercase tracking-[0.14em] mb-2" style={{ color: accent }}>
                {t('portfolio.offer.recommendedPath')}
              </h4>
              <p className="text-xs text-foursys-text-muted leading-relaxed mb-3">
                {t('portfolio.offer.pathCondition').replace('{agenda}', bridge.clientAgenda[lang])}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-mono text-label font-bold px-2.5 py-1 rounded-lg border"
                  style={{ color: accent, borderColor: `${accent}44`, backgroundColor: `${accent}12` }}
                >
                  {bridge.entryCode}
                </span>
                <ArrowRight size={13} className="text-foursys-text-dim" aria-hidden="true" />
                {bridge.capacityCodes.map(code => {
                  const target = offersByCode[code]
                  return target ? (
                    <button
                      key={code}
                      onClick={() => onOpenOffer(target)}
                      className="text-label px-2.5 py-1 rounded-lg border border-white/[0.09] text-foursys-text-muted hover:text-white hover:border-white/20 transition-colors"
                    >
                      <span className="font-mono font-bold">{code}</span> {target.name}
                    </button>
                  ) : null
                })}
                {bridge.assetNames.map(asset => (
                  <span
                    key={asset}
                    className="text-label px-2.5 py-1 rounded-lg border border-white/[0.07] bg-white/[0.025] text-foursys-text-dim"
                  >
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Fronteira */}
          {offer.boundary && (
            <div className="p-4 rounded-xl bg-foursys-surface/25 border border-white/[0.08]">
              <h4 className="text-label font-bold uppercase tracking-[0.14em] text-foursys-text-dim mb-1.5">
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
            <h4 className="text-label font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: accent }}>
              {t('portfolio.offer.cta')}
            </h4>
            <p className="text-sm text-white leading-relaxed">{offer.cta}</p>
            <button
              type="button"
              onClick={requestConversation}
              disabled={conversationRequested}
              className={`mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-touch rounded-xl text-sm font-bold border transition-all disabled:cursor-default ${
                conversationRequested
                  ? 'text-emerald-200 border-emerald-300/35 bg-emerald-500/10'
                  : ''
              }`}
              style={
                conversationRequested
                  ? undefined
                  : { color: accent, borderColor: `${accent}55`, backgroundColor: `${accent}14` }
              }
            >
              {conversationRequested ? <CheckCircle2 size={15} aria-hidden="true" /> : <Handshake size={15} aria-hidden="true" />}
              {conversationRequested
                ? t('portfolio.offer.requestRecorded')
                : t('portfolio.offer.requestConversation')}
            </button>
          </div>

          <details className="group rounded-xl border border-white/[0.07] bg-foursys-surface/20 overflow-hidden">
            <summary className="list-none cursor-pointer p-4 flex items-center justify-between gap-3 rounded-xl hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60">
              <span className="text-label font-bold uppercase tracking-[0.14em] text-foursys-text-muted flex items-center gap-1.5">
                <Handshake size={12} aria-hidden="true" /> {t('portfolio.offer.engagement')}
              </span>
              <ChevronDown
                size={15}
                className="text-foursys-text-dim transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="p-4 border-t border-white/[0.06] space-y-3">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {engagement.models.map(model => (
                  <li key={model} className="text-xs text-foursys-text-muted flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-foursys-primary flex-shrink-0 mt-1.5" />
                    {model}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-foursys-text-dim leading-relaxed">{engagement.sizing}</p>
            </div>
          </details>
        </div>
      </motion.div>
    </motion.div>
  )
}
