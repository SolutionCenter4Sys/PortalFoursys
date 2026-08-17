import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Blocks,
  BrainCircuit,
  Bot,
  Cloud,
  Package,
  ShieldCheck,
  Wrench,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { BackToOriginChip } from '../ui/BackToOriginChip'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'
import { getPortfolio } from '../../data/portfolio'

const ICONS: Record<string, LucideIcon> = {
  'brain-circuit': BrainCircuit,
  users: Users,
  bot: Bot,
  blocks: Blocks,
  package: Package,
  'shield-check': ShieldCheck,
  wrench: Wrench,
  cloud: Cloud,
}

export function SectionPortfolioAssets() {
  const { navigate, setDeepDiveHint } = useApp()
  const { t, lang } = useLanguage()
  const { assets, offers } = useMemo(() => getPortfolio(lang), [lang])

  // Um ativo transversal só prova que é transversal quando mostra onde é usado.
  const offersByAsset = useMemo(() => {
    const map: Record<string, { code: string; name: string }[]> = {}
    for (const asset of assets) {
      const needle = asset.name.toLowerCase()
      map[asset.id] = offers
        .filter(offer =>
          [
            ...(offer.assets ?? []),
            ...(offer.components ?? []),
            offer.name,
            offer.whatItIs,
            ...offer.differentials.map(d => `${d.title} ${d.detail}`),
          ]
            .join(' ')
            .toLowerCase()
            .includes(needle),
        )
        .map(offer => ({ code: offer.code, name: offer.name }))
    }
    return map
  }, [assets, offers])

  const openOffer = (code: string) => {
    setDeepDiveHint(`offer:${code}`)
    navigate('portfolio-offers')
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {assets.map((asset, i) => {
              const Icon = ICONS[asset.icon] ?? Wrench
              const usedIn = offersByAsset[asset.id] ?? []
              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  data-voz-detalhe={`portfolio-asset-${asset.id}`}
                  data-voz-detalhe-secao="portfolio-assets"
                  data-voz-detalhe-rotulo={asset.name}
                  className="p-4 rounded-2xl bg-foursys-surface/25 border border-white/[0.07] flex flex-col"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-foursys-primary/10 border border-foursys-primary/25 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-foursys-primary" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-white leading-tight mb-1">{asset.name}</h4>
                      <p className="text-xs text-foursys-text-muted leading-relaxed">{asset.description}</p>
                    </div>
                  </div>

                  {usedIn.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.06]">
                      <p className="text-label font-bold uppercase tracking-[0.14em] text-foursys-text-dim mb-2">
                        {t('portfolio.assets.usedIn').replace('{count}', String(usedIn.length))}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {usedIn.map(offer => (
                          <button
                            key={offer.code}
                            onClick={() => openOffer(offer.code)}
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
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </SectionWrapper>
  )
}
