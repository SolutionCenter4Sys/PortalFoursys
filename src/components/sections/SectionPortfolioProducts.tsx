import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Blocks,
  CheckCircle2,
  Package,
  PackageCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { BackToOriginChip } from '../ui/BackToOriginChip'
import { OfferCard } from '../portfolio/OfferCard'
import { OfferModal } from '../portfolio/OfferModal'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'
import {
  getPortfolio,
  productAssets,
  productAxis,
  productOffers,
  sectionForOffer,
} from '../../data/portfolio'
import type { PortfolioOffer } from '../../types'

const ASSET_ICONS: Record<string, LucideIcon> = {
  blocks: Blocks,
  package: Package,
}

export function SectionPortfolioProducts() {
  const { state, navigate, clearDeepDiveHint, setDeepDiveHint, trackOfferView } = useApp()
  const { t, lang } = useLanguage()
  const { axes, offers, assets, defaultEngagement } = useMemo(() => getPortfolio(lang), [lang])

  const axis = useMemo(() => productAxis(axes), [axes])
  const catalog = useMemo(() => productOffers(offers), [offers])
  const productOnlyAssets = useMemo(() => productAssets(assets), [assets])

  const entryHint = state.deepDiveHint
  const [selected, setSelected] = useState<PortfolioOffer | null>(() =>
    entryHint?.startsWith('offer:')
      ? catalog.find(o => o.code === entryHint.slice(6)) ?? null
      : null,
  )

  useEffect(() => {
    if (entryHint) clearDeepDiveHint()
  }, [entryHint, clearDeepDiveHint])

  const openOffer = useCallback(
    (offer: PortfolioOffer) => {
      if (sectionForOffer(offer) !== 'portfolio-products') {
        setDeepDiveHint(`offer:${offer.code}`)
        navigate(sectionForOffer(offer))
        return
      }
      trackOfferView(offer.code, offer.name)
      setSelected(offer)
    },
    [navigate, setDeepDiveHint, trackOfferView],
  )

  const trackedEntry = useRef(false)
  useEffect(() => {
    if (trackedEntry.current || !selected) return
    trackedEntry.current = true
    trackOfferView(selected.code, selected.name)
  }, [selected, trackOfferView])

  const axesById = useMemo(() => {
    const map: Record<string, (typeof axes)[number]> = {}
    for (const item of axes) map[item.id] = item
    return map
  }, [axes])

  const offersByCode = useMemo(() => {
    const map: Record<string, PortfolioOffer> = {}
    for (const offer of offers) map[offer.code] = offer
    return map
  }, [offers])

  if (!axis) return null

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
        <BackToOriginChip className="mb-4" />

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 md:mb-7"
        >
          <div className="flex items-start md:items-end justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400 mb-2 flex items-center gap-2">
                <PackageCheck size={13} aria-hidden="true" /> {t('portfolio.badge')}
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-none">
                {t('portfolio.products.title')}
              </h2>
              <p className="text-foursys-text-muted mt-2 text-sm md:text-base max-w-2xl leading-relaxed">
                {t('portfolio.products.subtitle')}
              </p>
            </div>

            <InterestButton section="portfolio-products" />
          </div>
          <div className="mt-4 md:mt-6 h-px bg-gradient-to-r from-cyan-400/30 via-white/[0.06] to-transparent" />
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.35 }}
          className="mb-6 md:mb-8 p-5 md:p-6 rounded-2xl border bg-foursys-surface/25"
          style={{ borderColor: `${axis.color}33` }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border"
              style={{
                backgroundColor: `${axis.color}1A`,
                borderColor: `${axis.color}40`,
                boxShadow: `0 0 16px ${axis.color}30`,
              }}
            >
              <PackageCheck size={18} style={{ color: axis.color }} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-label font-bold uppercase tracking-[0.16em] text-foursys-text-dim">
                {axis.name}
              </p>
              <h3 className="text-lg md:text-xl font-black text-white leading-tight">{axis.promise}</h3>
            </div>
          </div>
          <details className="group mt-4 rounded-xl border border-white/[0.07] bg-foursys-surface/20 overflow-hidden">
            <summary className="list-none cursor-pointer p-3.5 flex items-center justify-between gap-3 rounded-xl hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60">
              <span>
                <span className="block text-sm font-bold text-white">{t('portfolio.products.modelDetails')}</span>
                <span className="block text-label text-foursys-text-dim mt-0.5">
                  {t('portfolio.products.axisAudience')}: {axis.audience}
                </span>
              </span>
              <span className="text-label font-bold group-open:hidden" style={{ color: axis.color }}>
                {t('common.seeMore')}
              </span>
            </summary>
            <ul className="grid sm:grid-cols-2 gap-2 p-4 border-t border-white/[0.06]">
              {[
                t('portfolio.products.pointSaaS'),
                t('portfolio.products.pointModules'),
                t('portfolio.products.pointGoLive'),
                t('portfolio.products.pointEvolution'),
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-foursys-text-muted">
                  <CheckCircle2 size={14} style={{ color: axis.color }} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </details>
        </motion.article>

        <div
          data-voz-caixa="portfolio-products-grid"
          data-voz-caixa-secao="portfolio-products"
          data-voz-caixa-rotulo={t('portfolio.products.title')}
          tabIndex={-1}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 focus:outline-none mb-8"
        >
          {catalog.map((offer, i) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              axis={axesById[offer.axisId]}
              index={i}
              onClick={() => openOffer(offer)}
            />
          ))}
        </div>

        {productOnlyAssets.length > 0 && (
          <div>
            <h3 className="text-label font-bold uppercase tracking-[0.16em] text-foursys-text-dim mb-3">
              {t('portfolio.products.assetsTitle')}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {productOnlyAssets.map(asset => {
                const Icon = ASSET_ICONS[asset.icon] ?? Package
                return (
                  <div
                    key={asset.id}
                    className="p-4 rounded-xl border border-white/[0.08] bg-foursys-surface/25"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-foursys-primary/10 border border-foursys-primary/25 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-foursys-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">{asset.name}</h4>
                        <p className="text-xs text-foursys-text-muted leading-relaxed mt-1">{asset.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <OfferModal
            offer={selected}
            axis={axesById[selected.axisId]}
            offersByCode={offersByCode}
            engagement={selected.engagement ?? defaultEngagement}
            onClose={() => setSelected(null)}
            onOpenOffer={next => openOffer(next)}
          />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
