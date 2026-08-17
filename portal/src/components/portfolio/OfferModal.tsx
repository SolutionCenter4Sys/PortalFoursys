import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Eye, Handshake, Link2, X } from 'lucide-react'
import { EvidenceBadge } from './EvidenceBadge'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLanguage } from '../../i18n'
import { AXIS_FALLBACK_COLOR } from '../../theme/portfolioTokens'
import type {
  AppSection,
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
  presenterMode,
  engagement,
  onClose,
  onOpenOffer,
  onCompareLegacy,
}: {
  offer: PortfolioOffer
  axis: PortfolioAxis | undefined
  offersByCode: Record<string, PortfolioOffer>
  presenterMode: boolean
  engagement: PortfolioEngagement
  onClose: () => void
  onOpenOffer: (offer: PortfolioOffer) => void
  onCompareLegacy: (section: AppSection) => void
}) {
  const trapRef = useFocusTrap(true)
  const { t } = useLanguage()
  const accent = axis?.color ?? AXIS_FALLBACK_COLOR

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
            {offer.portfolioRole && (
              <span
                className="text-label font-bold px-2 py-0.5 rounded-full border"
                style={{
                  color: AXIS_FALLBACK_COLOR,
                  borderColor: `${AXIS_FALLBACK_COLOR}44`,
                  backgroundColor: `${AXIS_FALLBACK_COLOR}12`,
                }}
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
            <span className="text-label text-foursys-text-dim">
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
                    className="text-label px-2.5 py-1 rounded-lg bg-foursys-surface/40 border border-white/[0.08] text-foursys-text-muted"
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
          </div>

          {/* Notas de condução — apenas em modo apresentador */}
          {presenterMode && (
            <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] space-y-2">
              <h4 className="text-label font-bold uppercase tracking-[0.14em] text-amber-400 flex items-center gap-1.5">
                <Eye size={11} aria-hidden="true" /> {t('portfolio.presenter.title')}
              </h4>
              <div>
                <span className="text-meta uppercase tracking-wider text-amber-400/70 font-bold">
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
                  <span className="text-meta uppercase tracking-wider text-amber-400/70 font-bold">
                    {t('portfolio.presenter.care')}
                  </span>
                  <p className="text-xs text-foursys-text-muted leading-relaxed">{offer.editorialCare}</p>
                </div>
              )}
            </div>
          )}

          {/* Base comercial: modelo de contratação sempre; valor, nunca sem proposta */}
          <div className="p-4 rounded-xl border border-white/[0.07] bg-foursys-surface/20 space-y-3">
            <h4 className="text-label font-bold uppercase tracking-[0.14em] text-foursys-text-muted flex items-center gap-1.5">
              <Handshake size={12} aria-hidden="true" /> {t('portfolio.offer.engagement')}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {engagement.models.map(model => (
                <li key={model} className="text-xs text-foursys-text-muted flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-foursys-primary flex-shrink-0 mt-1.5" />
                  {model}
                </li>
              ))}
            </ul>
            <p className="text-xs text-foursys-text-dim leading-relaxed">{engagement.sizing}</p>
            {presenterMode && (
              <p className="text-xs text-amber-300/90 leading-relaxed border-t border-amber-500/20 pt-2">
                {engagement.investmentGuidance}
              </p>
            )}
          </div>

          {/* Comparação com a seção legada */}
          {offer.legacyEquivalent && (
            <button
              onClick={() => onCompareLegacy(offer.legacyEquivalent!.section)}
              className="w-full text-left p-3 rounded-xl border border-white/[0.07] bg-foursys-surface/20 hover:border-white/20 transition-colors flex items-center justify-between gap-3"
            >
              <span className="text-label text-foursys-text-dim">
                {t('portfolio.offer.legacy')}:{' '}
                <span className="text-foursys-text-muted">{offer.legacyEquivalent.label}</span>
              </span>
              <ArrowRight size={13} className="text-foursys-text-dim flex-shrink-0" aria-hidden="true" />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
