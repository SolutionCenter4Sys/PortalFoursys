import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { EvidenceBadge } from './EvidenceBadge'
import { useLanguage } from '../../i18n'
import { AXIS_FALLBACK_COLOR } from '../../theme/portfolioTokens'
import type { PortfolioAxis, PortfolioOffer } from '../../types'

// ─── Card da oferta ──────────────────────────────────────────────────────────

export function OfferCard({
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
  const accent = axis?.color ?? AXIS_FALLBACK_COLOR

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.35 }}
      onClick={onClick}
      aria-label={t('portfolio.offers.openDetail').replace('{name}', offer.name)}
      data-voz-detalhe={`portfolio-offer-${offer.id}`}
      data-voz-detalhe-secao="portfolio-offers"
      data-voz-detalhe-rotulo={offer.name}
      className="p-5 text-left rounded-2xl bg-foursys-surface/30 border cursor-pointer hover:-translate-y-1 hover:bg-foursys-surface/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 transition-all duration-300 flex flex-col group"
      style={{ borderColor: `${accent}2E` }}
    >
      <div className="flex items-start justify-between gap-2 mb-3 w-full">
        <span
          className="font-mono text-label font-bold px-1.5 py-0.5 rounded flex-shrink-0"
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

      <div className="flex items-start gap-2 mb-4 w-full flex-1">
        <CheckCircle2 size={12} style={{ color: accent }} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
        <span className="text-label text-foursys-text-muted leading-relaxed line-clamp-2">
          {offer.outcomes[0]}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/[0.06] w-full">
        <span className="text-label text-foursys-text-dim">{offer.totalDuration}</span>
        <span
          className="flex items-center gap-1 text-label font-semibold"
          style={{ color: accent }}
        >
          {t('common.seeMore')} <ArrowRight size={11} aria-hidden="true" />
        </span>
      </div>
    </motion.button>
  )
}
