import { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Bot,
  BrainCircuit,
  Cloud,
  Cpu,
  Coins,
  Database,
  Gauge,
  Layers,
  Leaf,
  LifeBuoy,
  Network,
  Package,
  PackageCheck,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { BackToOriginChip } from '../ui/BackToOriginChip'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'
import { getPortfolio, sectionForAxis, serviceAssets, serviceAxes, serviceOffers } from '../../data/portfolio'
import { PILLAR_COLOR } from '../../theme/portfolioTokens'
import type { PortfolioAxis } from '../../types'

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  cpu: Cpu,
  layers: Layers,
  database: Database,
  cloud: Cloud,
  'shield-check': ShieldCheck,
  'life-buoy': LifeBuoy,
  'package-check': PackageCheck,
  'brain-circuit': BrainCircuit,
  users: Users,
  bot: Bot,
  package: Package,
  wrench: Wrench,
  coins: Coins,
  leaf: Leaf,
}

/* ── Categoria: coluna do ecossistema ─────────────────────────────────────── */

function PillarHeader({
  icon: Icon,
  accent,
  kicker,
  hint,
}: {
  icon: LucideIcon
  accent: string
  kicker: string
  hint: string
}) {
  return (
    <div className="mb-4">
      <div className="h-[3px] rounded-full mb-4" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border"
          style={{
            backgroundColor: `${accent}14`,
            borderColor: `${accent}40`,
            boxShadow: `0 0 24px ${accent}25`,
          }}
        >
          <Icon size={20} style={{ color: accent }} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg md:text-xl font-black leading-none" style={{ color: accent }}>
            {kicker}
          </h3>
          <p className="text-label text-foursys-text-dim mt-1 leading-snug">{hint}</p>
        </div>
      </div>
    </div>
  )
}

function AxisCard({
  axis,
  index,
  onOpen,
  openLabel,
}: {
  axis: PortfolioAxis
  index: number
  onOpen?: () => void
  openLabel?: string
}) {
  const Icon = ICONS[axis.icon] ?? Layers
  const interactive = Boolean(onOpen)

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.05, duration: 0.4 }}
      whileHover={interactive ? { y: -4 } : undefined}
      data-voz-detalhe={`portfolio-ecosystem-${axis.id}`}
      data-voz-detalhe-secao="portfolio-ecosystem"
      data-voz-detalhe-rotulo={axis.name}
      className={`group relative rounded-2xl bg-foursys-surface/30 border border-white/[0.07] p-4 overflow-hidden ${
        interactive
          ? 'hover:border-white/20 focus-within:ring-2 focus-within:ring-cyan-400/60'
          : ''
      }`}
    >
      {/* Botão em camada: mantém a lista como conteúdo válido e dá semântica real de ação */}
      {interactive && (
        <button
          type="button"
          onClick={onOpen}
          aria-label={openLabel}
          className="absolute inset-0 z-10 cursor-pointer focus:outline-none"
        />
      )}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${axis.color}, transparent)` }}
        aria-hidden="true"
      />
      <div
        className="absolute -right-10 -top-10 w-28 h-28 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ backgroundColor: `${axis.color}22` }}
        aria-hidden="true"
      />

      <div className="relative flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border"
          style={{
            backgroundColor: `${axis.color}1A`,
            borderColor: `${axis.color}40`,
            boxShadow: `0 0 16px ${axis.color}30`,
          }}
        >
          <Icon size={16} style={{ color: axis.color }} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-black text-white leading-tight">
            {axis.name.replace(/\s*·\s*(SharpOps|Zeragon)\s*$/i, '')}
          </h4>
          <p className="mt-1.5 text-label text-foursys-text-muted leading-relaxed">
            {axis.promise}
          </p>
        </div>
      </div>
    </motion.article>
  )
}


/* ── Seção ─────────────────────────────────────────────────────────────────── */

export function SectionPortfolioEcosystem() {
  const { navigate, setDeepDiveHint } = useApp()
  const { t, lang } = useLanguage()
  const bundle = useMemo(() => getPortfolio(lang), [lang])
  const axes = useMemo(() => serviceAxes(bundle.axes), [bundle.axes])
  const offers = useMemo(() => serviceOffers(bundle.offers), [bundle.offers])
  const assets = useMemo(() => serviceAssets(bundle.assets), [bundle.assets])
  const { futureVision } = bundle

  const axesWithOffers = useMemo(() => {
    const set = new Set<string>()
    for (const offer of offers) set.add(offer.axisId)
    return set
  }, [offers])

  const openAxis = useCallback(
    (axisId: string) => {
      setDeepDiveHint(`axis:${axisId}`)
      navigate(sectionForAxis(axisId))
    },
    [navigate, setDeepDiveHint],
  )

  const axisCardProps = useCallback(
    (axis: PortfolioAxis) =>
      axesWithOffers.has(axis.id)
        ? {
            onOpen: () => openAxis(axis.id),
            openLabel: t('portfolio.ecosystem.openAxis').replace(
              '{name}',
              axis.name.replace(/\s*·\s*(SharpOps|Zeragon)\s*$/i, ''),
            ),
          }
        : {},
    [axesWithOffers, openAxis, t],
  )

  const showcaseAxes = useMemo(() => axes.filter(a => a.role === 'diferenciacao'), [axes])
  const engineAxes = useMemo(() => axes.filter(a => a.role === 'capacidade'), [axes])

  return (
    <SectionWrapper>
      <div className="relative px-4 md:px-8 py-6 md:py-9 max-w-[1500px] mx-auto">
        {/* Brilhos de fundo — confinados para não gerar rolagem horizontal */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.div
            className="absolute -top-24 left-1/4 w-[420px] h-[420px] rounded-full bg-foursys-primary/[0.07] blur-[110px]"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-[360px] h-[360px] rounded-full bg-cyan-400/[0.06] blur-[110px]"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </div>

        <BackToOriginChip className="relative mb-4" />

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative mb-5 md:mb-7"
        >
          <div className="flex items-start md:items-end justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-primary mb-2 flex items-center gap-2">
                <Network size={13} aria-hidden="true" /> {t('portfolio.badge')}
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-none">
                {t('portfolio.ecosystem.title')}
              </h2>
              <p className="text-foursys-text-muted mt-2 text-sm md:text-base max-w-3xl leading-relaxed">
                {t('portfolio.ecosystem.subtitle')}
              </p>
            </div>
            <InterestButton section="portfolio-ecosystem" />
          </div>

          <div className="mt-4 md:mt-5 h-px bg-gradient-to-r from-foursys-primary/30 via-white/[0.06] to-transparent" />
        </motion.div>

        <div
          data-voz-caixa="portfolio-ecosystem-mapa"
          data-voz-caixa-secao="portfolio-ecosystem"
          data-voz-caixa-rotulo={t('portfolio.ecosystem.title')}
          tabIndex={-1}
          className="relative focus:outline-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.25fr_0.85fr] gap-4 lg:gap-5 items-start">
            {/* Diferenciação */}
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-3xl border border-white/[0.07] bg-white/[0.015] p-4 lg:p-5"
            >
              <PillarHeader
                icon={Sparkles}
                accent={PILLAR_COLOR.showcase}
                kicker={t('portfolio.ecosystem.showcaseTitle')}
                hint={t('portfolio.ecosystem.showcaseHint')}
              />
              <div className="space-y-3">
                {showcaseAxes.map((axis, i) => (
                  <AxisCard
                    key={axis.id}
                    axis={axis}
                    index={i}
                    {...axisCardProps(axis)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Escala */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="rounded-3xl border border-white/[0.07] bg-white/[0.015] p-4 lg:p-5"
            >
              <PillarHeader
                icon={Gauge}
                accent={PILLAR_COLOR.engine}
                kicker={t('portfolio.ecosystem.engineTitle')}
                hint={t('portfolio.ecosystem.engineHint')}
              />
              {/* 2 colunas só a partir de xl: em lg esta coluna tem ~380px e os cards ficariam espremidos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                {engineAxes.map((axis, i) => (
                  <AxisCard
                    key={axis.id}
                    axis={axis}
                    index={i}
                    {...axisCardProps(axis)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Futuro */}
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="rounded-3xl border border-white/[0.07] bg-white/[0.015] p-4 lg:p-5"
            >
              <PillarHeader
                icon={Rocket}
                accent={PILLAR_COLOR.future}
                kicker={t('portfolio.ecosystem.futureTitle')}
                hint={t('portfolio.ecosystem.futureHint')}
              />
              <div className="space-y-3">
                {futureVision.map((item, i) => {
                  const Icon = ICONS[item.icon] ?? Rocket
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.05, duration: 0.35 }}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate('portfolio-future')}
                      aria-label={t('portfolio.ecosystem.openFuture').replace('{name}', item.name)}
                      data-voz-detalhe={`portfolio-ecosystem-${item.id}`}
                      data-voz-detalhe-secao="portfolio-ecosystem"
                      data-voz-detalhe-rotulo={item.name}
                      className="group relative w-full text-left rounded-2xl bg-foursys-surface/30 border border-white/[0.07] p-4 overflow-hidden cursor-pointer hover:border-violet-400/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-px opacity-60 bg-gradient-to-r from-transparent via-violet-400 to-transparent"
                        aria-hidden="true"
                      />
                      <div
                        className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-violet-400/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        aria-hidden="true"
                      />
                      <div className="relative flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-400/10 border border-violet-400/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(167,139,250,0.2)]">
                          <Icon size={16} className="text-violet-300" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-black text-white leading-tight">{item.name}</h4>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Forças transversais — o alicerce */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="relative mt-4 lg:mt-5 rounded-3xl border border-foursys-primary/25 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-foursys-primary/[0.10] via-foursys-primary/[0.04] to-transparent" aria-hidden="true" />
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-foursys-primary via-foursys-primary/40 to-transparent" aria-hidden="true" />

            <div className="relative p-4 lg:p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-foursys-primary/12 border border-foursys-primary/35 flex items-center justify-center flex-shrink-0 shadow-[0_0_24px_rgba(255,102,0,0.18)]">
                  <Layers size={20} className="text-foursys-primary" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg md:text-xl font-black text-white leading-none">
                    {t('portfolio.ecosystem.foundationTitle')}
                  </h3>
                  <p className="text-xs text-foursys-text-muted mt-1.5 leading-relaxed max-w-3xl">
                    {t('portfolio.ecosystem.foundationDesc')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {assets.map((asset, i) => {
                  const Icon = ICONS[asset.icon] ?? Wrench
                  return (
                    <motion.button
                      key={asset.id}
                      type="button"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.22 + i * 0.04, duration: 0.3 }}
                      whileHover={{ y: -2 }}
                      onClick={() => navigate('portfolio-assets')}
                      aria-label={`${t('portfolio.ecosystem.openAsset').replace('{name}', asset.name)} — ${asset.description}`}
                      data-voz-detalhe={`portfolio-ecosystem-asset-${asset.id}`}
                      data-voz-detalhe-secao="portfolio-ecosystem"
                      data-voz-detalhe-rotulo={asset.name}
                      className="flex items-center gap-2 px-3 py-2 min-h-[36px] rounded-xl bg-foursys-surface/40 border border-white/[0.08] hover:border-foursys-primary/40 hover:shadow-[0_0_20px_rgba(255,102,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 transition-all duration-300"
                    >
                      <Icon size={14} className="text-foursys-primary flex-shrink-0" aria-hidden="true" />
                      <span className="text-xs font-bold text-white leading-none">{asset.name}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
