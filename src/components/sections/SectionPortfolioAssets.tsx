import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Blocks,
  BrainCircuit,
  Bot,
  Cloud,
  LifeBuoy,
  Package,
  ShieldCheck,
  Users,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { BackToOriginChip } from '../ui/BackToOriginChip'
import { OfferModal } from '../portfolio/OfferModal'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'
import {
  getPortfolio,
  sectionForOffer,
  serviceAssets,
  serviceOffers,
  SUSTAIN_AXIS_ID,
  sustainAxis,
  sustainOffers,
} from '../../data/portfolio'
import type { PortfolioOffer } from '../../types'

const ICONS: Record<string, LucideIcon> = {
  'brain-circuit': BrainCircuit,
  users: Users,
  bot: Bot,
  blocks: Blocks,
  package: Package,
  'shield-check': ShieldCheck,
  wrench: Wrench,
  cloud: Cloud,
  'life-buoy': LifeBuoy,
}

export function SectionPortfolioAssets() {
  const { state, navigate, clearDeepDiveHint, setDeepDiveHint, trackOfferView } = useApp()
  const { t, lang } = useLanguage()
  const bundle = useMemo(() => getPortfolio(lang), [lang])
  const assets = useMemo(() => serviceAssets(bundle.assets), [bundle.assets])
  const catalogOffers = useMemo(() => serviceOffers(bundle.offers), [bundle.offers])
  const axis = useMemo(() => sustainAxis(bundle.axes), [bundle.axes])
  const sustainCatalog = useMemo(() => sustainOffers(bundle.offers), [bundle.offers])
  const primarySustain = sustainCatalog[0] ?? null

  const entryHint = state.deepDiveHint
  const [selected, setSelected] = useState<PortfolioOffer | null>(() => {
    if (entryHint?.startsWith('offer:')) {
      return sustainCatalog.find(o => o.code === entryHint.slice(6)) ?? null
    }
    if (entryHint?.startsWith('axis:') && entryHint.slice(5) === SUSTAIN_AXIS_ID) {
      return primarySustain
    }
    return null
  })

  useEffect(() => {
    if (entryHint) clearDeepDiveHint()
  }, [entryHint, clearDeepDiveHint])

  const openLocalOffer = useCallback(
    (offer: PortfolioOffer) => {
      if (sectionForOffer(offer) !== 'portfolio-assets') {
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
    const map: Record<string, (typeof bundle.axes)[number]> = {}
    for (const item of bundle.axes) map[item.id] = item
    return map
  }, [bundle.axes])

  const offersByCode = useMemo(() => {
    const map: Record<string, PortfolioOffer> = {}
    for (const offer of bundle.offers) map[offer.code] = offer
    return map
  }, [bundle.offers])

  const offersByAsset = useMemo(() => {
    const map: Record<string, { code: string; name: string }[]> = {}
    for (const asset of assets) {
      const needle = asset.name.toLowerCase()
      map[asset.id] = catalogOffers
        .filter(offer => offer.assets?.some(name => name.toLowerCase() === needle))
        .map(offer => ({ code: offer.code, name: offer.name }))
    }
    return map
  }, [assets, catalogOffers])

  const openAssetOffer = (code: string) => {
    const offer = bundle.offers.find(o => o.code === code)
    if (!offer) return
    if (sectionForOffer(offer) === 'portfolio-assets') {
      openLocalOffer(offer)
      return
    }
    setDeepDiveHint(`offer:${code}`)
    navigate(sectionForOffer(offer))
  }

  const openSustainDetail = () => {
    if (primarySustain) openLocalOffer(primarySustain)
  }

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">

        <BackToOriginChip className="mb-4" />

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-start md:items-end justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-primary mb-2 flex items-center gap-2">
                <Blocks size={13} aria-hidden="true" /> {t('portfolio.badge')}
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-none">
                {t('portfolio.assets.title')}
              </h2>
              <p className="text-foursys-text-muted mt-2 text-sm md:text-base max-w-2xl leading-relaxed">
                {t('portfolio.assets.subtitle')}
              </p>
            </div>
            <InterestButton section="portfolio-assets" />
          </div>

          <div className="mt-4 md:mt-6 h-px bg-gradient-to-r from-foursys-primary/30 via-white/[0.06] to-transparent" />
        </motion.div>

        <div
          data-voz-caixa="portfolio-assets-grid"
          data-voz-caixa-secao="portfolio-assets"
          data-voz-caixa-rotulo={t('portfolio.assets.title')}
          tabIndex={-1}
          className="focus:outline-none"
        >
          <h3 className="text-label font-bold uppercase tracking-[0.16em] text-foursys-text-dim mb-3">
            {t('portfolio.assets.foundationTitle')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {axis && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                onClick={openSustainDetail}
                aria-label={t('portfolio.offers.openDetail').replace('{name}', primarySustain?.name ?? axis.name)}
                data-voz-caixa="portfolio-assets-sustain"
                data-voz-caixa-secao="portfolio-assets"
                data-voz-caixa-rotulo={t('portfolio.assets.sustainEyebrow')}
                data-voz-detalhe="portfolio-asset-sustain"
                data-voz-detalhe-secao="portfolio-assets"
                data-voz-detalhe-rotulo={axis.name}
                className="p-4 rounded-2xl bg-foursys-surface/25 border border-white/[0.07] flex flex-col text-left cursor-pointer hover:-translate-y-0.5 hover:bg-foursys-surface/40 hover:border-foursys-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-foursys-primary/10 border border-foursys-primary/25 flex items-center justify-center flex-shrink-0">
                    <LifeBuoy size={16} className="text-foursys-primary" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-white leading-tight mb-1">{axis.name}</h4>
                    <p className="text-xs text-foursys-text-muted leading-relaxed">{axis.promise}</p>
                  </div>
                </div>

                {sustainCatalog.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/[0.06]">
                    <p className="text-label font-bold uppercase tracking-[0.14em] text-foursys-text-dim mb-2">
                      {t('portfolio.assets.usedIn').replace('{count}', String(sustainCatalog.length))}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {sustainCatalog.map(offer => (
                        <span
                          key={offer.code}
                          title={offer.name}
                          className="font-mono text-label font-bold px-3 py-2 min-h-touch md:min-h-[30px] md:px-2.5 md:py-1.5 rounded-lg border border-foursys-primary/30 bg-foursys-primary/10 text-foursys-primary"
                        >
                          {offer.code}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.button>
            )}

            {assets.map((asset, i) => {
              const Icon = ICONS[asset.icon] ?? Wrench
              const usedIn = offersByAsset[asset.id] ?? []
              return (
                <motion.details
                  key={asset.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i + 1) * 0.04, duration: 0.35 }}
                  data-voz-detalhe={`portfolio-asset-${asset.id}`}
                  data-voz-detalhe-secao="portfolio-assets"
                  data-voz-detalhe-rotulo={asset.name}
                  className="group rounded-2xl bg-foursys-surface/25 border border-white/[0.07] overflow-hidden"
                >
                  <summary className="list-none cursor-pointer p-4 flex items-center justify-between gap-3 rounded-xl hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60">
                    <span className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-foursys-primary/10 border border-foursys-primary/25 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-foursys-primary" aria-hidden="true" />
                    </div>
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-white leading-tight">{asset.name}</span>
                      <span className="block text-label text-foursys-text-dim mt-1">
                        {t('portfolio.assets.usedIn').replace('{count}', String(usedIn.length))}
                      </span>
                    </span>
                    </span>
                    <span className="text-label font-bold text-foursys-primary group-open:hidden">
                      {t('common.seeMore')}
                    </span>
                  </summary>

                  <div className="p-4 pt-3 border-t border-white/[0.06]">
                    <p className="text-xs text-foursys-text-muted leading-relaxed">{asset.description}</p>
                    {usedIn.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.06]">
                      <p className="text-label font-bold uppercase tracking-[0.14em] text-foursys-text-dim mb-2">
                        {t('portfolio.assets.usedIn').replace('{count}', String(usedIn.length))}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {usedIn.map(offer => (
                          <button
                            key={offer.code}
                            onClick={() => openAssetOffer(offer.code)}
                            title={offer.name}
                            aria-label={t('portfolio.start.openOffer').replace(
                              '{name}',
                              `${offer.code} ${offer.name}`,
                            )}
                            className="font-mono text-label font-bold px-3 py-2 min-h-touch md:min-h-[30px] md:px-2.5 md:py-1.5 rounded-lg border border-foursys-primary/30 bg-foursys-primary/10 text-foursys-primary hover:bg-foursys-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 transition-colors"
                          >
                            {offer.code}
                          </button>
                        ))}
                      </div>
                    </div>
                    )}
                  </div>
                </motion.details>
              )
            })}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {selected && (
          <OfferModal
            offer={selected}
            axis={axesById[selected.axisId]}
            offersByCode={offersByCode}
            engagement={selected.engagement ?? bundle.defaultEngagement}
            onClose={() => setSelected(null)}
            onOpenOffer={next => openLocalOffer(next)}
          />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
