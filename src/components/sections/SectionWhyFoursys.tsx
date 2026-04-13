import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Calendar, ShieldCheck, Globe, Network, TrendingUp,
  Zap, Euro, Clock, Heart,
  CheckCircle2, XCircle, Minus, Award, Building2, Target, ChevronDown,
} from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { useLanguage } from '../../i18n'

function hexToRgba(hex: string, a: number) {
  const h = hex.replace('#', '')
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`
}

// ─── Data ────────────────────────────────────────────────────────────────────

const DIFFERENTIALS_PT = [
  { icon: <Users size={20} />, stat: '3,6%', label: 'Turnover', context: 'vs. 22% da média do mercado' },
  { icon: <Calendar size={20} />, stat: '26', label: 'Anos de entrega', context: 'Fundada em 2000' },
  { icon: <ShieldCheck size={20} />, stat: '6', label: 'Certificações', context: 'ISO 9001 · 27001 · 27701 · 14001 · SAFe · GPTW' },
  { icon: <Globe size={20} />, stat: '4', label: 'Regiões do Globo', context: 'Brasil · EUA · Europa · Oriente Médio' },
  { icon: <Network size={20} />, stat: '9+', label: 'Alianças estratégicas', context: 'Microsoft · AWS · Google · Adobe' },
  { icon: <TrendingUp size={20} />, stat: '30K+', label: 'Projetos entregues', context: 'Todos os modelos de delivery' },
]

const DIFFERENTIALS_EN = [
  { icon: <Users size={20} />, stat: '3.6%', label: 'Turnover', context: 'vs. 22% market average' },
  { icon: <Calendar size={20} />, stat: '26', label: 'Years of delivery', context: 'Founded in 2000' },
  { icon: <ShieldCheck size={20} />, stat: '6', label: 'Certifications', context: 'ISO 9001 · 27001 · 27701 · 14001 · SAFe · GPTW' },
  { icon: <Globe size={20} />, stat: '4', label: 'Global Regions', context: 'Brazil · USA · Europe · Middle East' },
  { icon: <Network size={20} />, stat: '9+', label: 'Strategic alliances', context: 'Microsoft · AWS · Google · Adobe' },
  { icon: <TrendingUp size={20} />, stat: '30K+', label: 'Projects delivered', context: 'All delivery models' },
]

interface ComparisonRow {
  dimension: string
  icon: React.ReactNode
  foursys: { value: string; detail: string; score: 'high' | 'mid' | 'low' }
  bigFour: { value: string; detail: string; score: 'high' | 'mid' | 'low' }
  boutique: { value: string; detail: string; score: 'high' | 'mid' | 'low' }
  foursysAdvantage: boolean
}

const COMPARISON_PT: ComparisonRow[] = [
  {
    dimension: 'Custo / Hora',
    icon: <Euro size={15} />,
    foursys: { value: '€ 17-39/h', detail: 'Nearshore competitivo com qualidade enterprise', score: 'high' },
    bigFour: { value: '€ 172-430+/h', detail: 'Premium global, custos elevados', score: 'low' },
    boutique: { value: '€ 129-344/h', detail: 'Variável conforme especialidade', score: 'mid' },
    foursysAdvantage: true,
  },
  {
    dimension: 'Turnover de Equipe',
    icon: <Heart size={15} />,
    foursys: { value: '3,6%', detail: 'GPTW + cultura de retenção', score: 'high' },
    bigFour: { value: '15-22%', detail: 'Rotação alta, perda de conhecimento', score: 'low' },
    boutique: { value: '10-18%', detail: 'Variável, depende da firma', score: 'mid' },
    foursysAdvantage: true,
  },
  {
    dimension: 'Proximidade do Cliente',
    icon: <Target size={15} />,
    foursys: { value: 'Dedicada', detail: 'Squads fixos, 20+ anos com mesmo cliente', score: 'high' },
    bigFour: { value: 'Rotativa', detail: 'Offshoring massivo, equipes variam', score: 'low' },
    boutique: { value: 'Moderada', detail: 'Foco em projeto, não em parceria', score: 'mid' },
    foursysAdvantage: true,
  },
  {
    dimension: 'Velocidade de Entrega',
    icon: <Zap size={15} />,
    foursys: { value: '6 semanas', detail: 'Piloto a produção com IA First', score: 'high' },
    bigFour: { value: '3-6 meses', detail: 'Processos burocráticos complexos', score: 'low' },
    boutique: { value: '2-4 meses', detail: 'Mais ágeis que Big Four', score: 'mid' },
    foursysAdvantage: true,
  },
  {
    dimension: 'Conhecimento Setorial',
    icon: <Building2 size={15} />,
    foursys: { value: 'Profundo', detail: 'Financeiro, Seguros, Saúde — 26 anos', score: 'high' },
    bigFour: { value: 'Amplo', detail: 'Horizontal — todos os setores', score: 'mid' },
    boutique: { value: 'Nicho', detail: 'Foco estreito, 1-2 setores', score: 'mid' },
    foursysAdvantage: true,
  },
  {
    dimension: 'Certificações',
    icon: <Award size={15} />,
    foursys: { value: '4 ISOs + SAFe + GPTW', detail: '9001, 27001, 27701, 14001', score: 'high' },
    bigFour: { value: 'Múltiplas', detail: 'Certificações extensivas', score: 'high' },
    boutique: { value: '1-2 ISOs', detail: 'Certificações limitadas', score: 'low' },
    foursysAdvantage: false,
  },
  {
    dimension: 'Time-to-Value com IA',
    icon: <Clock size={15} />,
    foursys: { value: '85% conversão', detail: 'Piloto → Produção em 6 semanas', score: 'high' },
    bigFour: { value: '30-40%', detail: 'Maioria fica em "piloto eterno"', score: 'low' },
    boutique: { value: '50-60%', detail: 'Melhor que Big Four, menor escala', score: 'mid' },
    foursysAdvantage: true,
  },
]

const COMPARISON_EN: ComparisonRow[] = [
  {
    dimension: 'Cost / Hour',
    icon: <Euro size={15} />,
    foursys: { value: '€ 17-39/h', detail: 'Competitive nearshore with enterprise quality', score: 'high' },
    bigFour: { value: '€ 172-430+/h', detail: 'Global premium, high costs', score: 'low' },
    boutique: { value: '€ 129-344/h', detail: 'Variable depending on specialty', score: 'mid' },
    foursysAdvantage: true,
  },
  {
    dimension: 'Team Turnover',
    icon: <Heart size={15} />,
    foursys: { value: '3.6%', detail: 'GPTW + retention culture', score: 'high' },
    bigFour: { value: '15-22%', detail: 'High rotation, knowledge loss', score: 'low' },
    boutique: { value: '10-18%', detail: 'Variable, firm-dependent', score: 'mid' },
    foursysAdvantage: true,
  },
  {
    dimension: 'Client Proximity',
    icon: <Target size={15} />,
    foursys: { value: 'Dedicated', detail: 'Fixed squads, 20+ years with same client', score: 'high' },
    bigFour: { value: 'Rotating', detail: 'Mass offshoring, teams vary', score: 'low' },
    boutique: { value: 'Moderate', detail: 'Project-focused, not partnership', score: 'mid' },
    foursysAdvantage: true,
  },
  {
    dimension: 'Delivery Speed',
    icon: <Zap size={15} />,
    foursys: { value: '6 weeks', detail: 'Pilot to production with AI First', score: 'high' },
    bigFour: { value: '3-6 months', detail: 'Complex bureaucratic processes', score: 'low' },
    boutique: { value: '2-4 months', detail: 'More agile than Big Four', score: 'mid' },
    foursysAdvantage: true,
  },
  {
    dimension: 'Industry Knowledge',
    icon: <Building2 size={15} />,
    foursys: { value: 'Deep', detail: 'Financial, Insurance, Healthcare — 26 years', score: 'high' },
    bigFour: { value: 'Broad', detail: 'Horizontal — all industries', score: 'mid' },
    boutique: { value: 'Niche', detail: 'Narrow focus, 1-2 industries', score: 'mid' },
    foursysAdvantage: true,
  },
  {
    dimension: 'Certifications',
    icon: <Award size={15} />,
    foursys: { value: '4 ISOs + SAFe + GPTW', detail: '9001, 27001, 27701, 14001', score: 'high' },
    bigFour: { value: 'Multiple', detail: 'Extensive certifications', score: 'high' },
    boutique: { value: '1-2 ISOs', detail: 'Limited certifications', score: 'low' },
    foursysAdvantage: false,
  },
  {
    dimension: 'Time-to-Value with AI',
    icon: <Clock size={15} />,
    foursys: { value: '85% conversion', detail: 'Pilot → Production in 6 weeks', score: 'high' },
    bigFour: { value: '30-40%', detail: 'Most stay in "eternal pilot"', score: 'low' },
    boutique: { value: '50-60%', detail: 'Better than Big Four, smaller scale', score: 'mid' },
    foursysAdvantage: true,
  },
]

const SCORE_ICON = {
  high: <CheckCircle2 size={13} className="text-emerald-400" />,
  mid: <Minus size={13} className="text-amber-400" />,
  low: <XCircle size={13} className="text-red-400/70" />,
}

interface Advantage {
  title: string
  description: string
  color: string
  metric: string
  metricLabel: string
}

const ADVANTAGES_PT: Advantage[] = [
  {
    title: 'Custo-Benefício Superior',
    description: 'Entrega qualidade equivalente às Big Four a uma fração do custo. Nosso modelo nearshore + squads dedicados elimina o overhead de offshoring global.',
    color: '#10B981',
    metric: '60-70%',
    metricLabel: 'menor custo vs Big Four',
  },
  {
    title: 'Continuidade de Conhecimento',
    description: 'Com turnover de 3,6% (vs 22% do mercado), nossos profissionais acumulam anos de conhecimento sobre o negócio do cliente. Zero perda de contexto.',
    color: '#8B5CF6',
    metric: '6x',
    metricLabel: 'menor rotação',
  },
  {
    title: 'IA que Sai do Piloto',
    description: 'Enquanto 70% dos projetos de IA de grandes consultorias ficam em piloto eterno, nosso método IA First converte 85% em produção em 6 semanas.',
    color: '#F59E0B',
    metric: '85%',
    metricLabel: 'piloto → produção',
  },
  {
    title: 'Parceria, não Fornecimento',
    description: 'Clientes que estão conosco há mais de 20 anos. Não vendemos horas — construímos relacionamento de longo prazo com accountability real.',
    color: '#06B6D4',
    metric: '20+',
    metricLabel: 'anos com mesmo cliente',
  },
]

const ADVANTAGES_EN: Advantage[] = [
  {
    title: 'Superior Cost-Benefit',
    description: 'Delivers quality equivalent to Big Four at a fraction of the cost. Our nearshore + dedicated squads model eliminates global offshoring overhead.',
    color: '#10B981',
    metric: '60-70%',
    metricLabel: 'lower cost vs Big Four',
  },
  {
    title: 'Knowledge Continuity',
    description: 'With 3.6% turnover (vs 22% market average), our professionals accumulate years of knowledge about the client\'s business. Zero context loss.',
    color: '#8B5CF6',
    metric: '6x',
    metricLabel: 'lower rotation',
  },
  {
    title: 'AI That Leaves the Pilot',
    description: 'While 70% of AI projects from large consultancies stay in eternal pilot, our AI First method converts 85% to production in 6 weeks.',
    color: '#F59E0B',
    metric: '85%',
    metricLabel: 'pilot → production',
  },
  {
    title: 'Partnership, Not Supply',
    description: 'Clients who have been with us for over 20 years. We don\'t sell hours — we build long-term relationships with real accountability.',
    color: '#06B6D4',
    metric: '20+',
    metricLabel: 'years with same client',
  },
]

// ─── Components ──────────────────────────────────────────────────────────────

function ComparisonTable({ rows }: { rows: ComparisonRow[] }) {
  const { t, lang } = useLanguage()
  const labels = useMemo(() => lang === 'pt' ? {
    title: 'Foursys vs. Consultorias Globais',
    dimension: 'Dimensão',
    bigFour: 'Big Four / Globais',
    boutiques: 'Boutiques',
  } : {
    title: 'Foursys vs. Global Consultancies',
    dimension: 'Dimension',
    bigFour: 'Big Four / Global',
    boutiques: 'Boutiques',
  }, [lang])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h3 className="text-lg font-black text-white mb-5 flex items-center gap-2">
        <Target size={18} className="text-foursys-primary" />
        {labels.title}
      </h3>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[1.8fr_1fr_1fr_1fr] gap-2 mb-2 px-4">
        <div className="text-[9px] font-bold uppercase tracking-wider text-foursys-text-dim">{labels.dimension}</div>
        <div className="text-[9px] font-bold uppercase tracking-wider text-foursys-primary text-center">Foursys</div>
        <div className="text-[9px] font-bold uppercase tracking-wider text-foursys-text-dim text-center">{labels.bigFour}</div>
        <div className="text-[9px] font-bold uppercase tracking-wider text-foursys-text-dim text-center">{labels.boutiques}</div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {rows.map((row, i) => (
          <motion.div
            key={row.dimension}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1fr_1fr] gap-2 md:gap-2 p-3 md:p-4 rounded-xl border transition-all duration-300 hover:border-white/[0.15]"
            style={{
              background: row.foursysAdvantage
                ? 'linear-gradient(90deg, rgba(255,102,0,0.04), transparent 30%)'
                : 'rgba(255,255,255,0.01)',
              borderColor: row.foursysAdvantage ? 'rgba(255,102,0,0.12)' : 'rgba(255,255,255,0.06)',
            }}
          >
            {/* Dimension */}
            <div className="flex items-center gap-2.5">
              <div className="text-foursys-text-dim">{row.icon}</div>
              <span className="text-sm font-bold text-white">{row.dimension}</span>
              {row.foursysAdvantage && (
                <span className="hidden md:inline text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-foursys-primary/15 text-foursys-primary border border-foursys-primary/25">
                  {t('whyFoursys.advantage')}
                </span>
              )}
            </div>

            {/* Foursys */}
            <div className="flex items-center gap-2 md:justify-center pl-6 md:pl-0">
              {SCORE_ICON[row.foursys.score]}
              <div className="md:text-center">
                <div className="text-xs font-bold text-foursys-primary">{row.foursys.value}</div>
                <div className="text-[9px] text-foursys-text-dim hidden lg:block">{row.foursys.detail}</div>
              </div>
            </div>

            {/* Big Four */}
            <div className="flex items-center gap-2 md:justify-center pl-6 md:pl-0">
              {SCORE_ICON[row.bigFour.score]}
              <div className="md:text-center">
                <div className="text-xs font-semibold text-foursys-text-muted">{row.bigFour.value}</div>
                <div className="text-[9px] text-foursys-text-dim hidden lg:block">{row.bigFour.detail}</div>
              </div>
            </div>

            {/* Boutique */}
            <div className="flex items-center gap-2 md:justify-center pl-6 md:pl-0">
              {SCORE_ICON[row.boutique.score]}
              <div className="md:text-center">
                <div className="text-xs font-semibold text-foursys-text-muted">{row.boutique.value}</div>
                <div className="text-[9px] text-foursys-text-dim hidden lg:block">{row.boutique.detail}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function SectionWhyFoursys() {
  const [showComparison, setShowComparison] = useState(false)
  const { t, lang } = useLanguage()
  const differentials = useMemo(() => lang === 'pt' ? DIFFERENTIALS_PT : DIFFERENTIALS_EN, [lang])
  const comparison = useMemo(() => lang === 'pt' ? COMPARISON_PT : COMPARISON_EN, [lang])
  const advantages = useMemo(() => lang === 'pt' ? ADVANTAGES_PT : ADVANTAGES_EN, [lang])

  const uiLabels = useMemo(() => lang === 'pt' ? {
    tableTitle: 'Foursys vs. Consultorias Globais',
    detailedComparison: `— Comparativo detalhado em ${comparison.length} dimensões`,
    clearAdvantage: 'Vantagem clara',
    parity: 'Paridade',
    disadvantage: 'Desvantagem',
    leadsIn: `Foursys lidera em ${comparison.filter(c => c.foursysAdvantage).length} de ${comparison.length} dimensões`,
    ctaPart1: 'A Foursys entrega o calibre de uma consultoria global',
    ctaPart2: 'com a agilidade, proximidade e custo-benefício que só uma empresa global com',
    ctaStats: '26 anos de história, 3,6% de turnover e 6 certificações',
    ctaPart3: 'pode oferecer. Não competimos em escala — competimos em profundidade, resultado e confiança.',
  } : {
    tableTitle: 'Foursys vs. Global Consultancies',
    detailedComparison: `— Detailed comparison across ${comparison.length} dimensions`,
    clearAdvantage: 'Clear advantage',
    parity: 'Parity',
    disadvantage: 'Disadvantage',
    leadsIn: `Foursys leads in ${comparison.filter(c => c.foursysAdvantage).length} of ${comparison.length} dimensions`,
    ctaPart1: 'Foursys delivers the caliber of a global consultancy',
    ctaPart2: 'with the agility, proximity and cost-benefit that only a company with',
    ctaStats: '26 years of history, 3.6% turnover and 6 certifications',
    ctaPart3: 'can offer. We don\'t compete on scale — we compete on depth, results and trust.',
  }, [lang, comparison])

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 md:mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-primary mb-2">
            {t('whyFoursys.badge')}
          </p>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-none mb-3">
            {t('whyFoursys.title')}
          </h2>
          <p className="text-foursys-text-muted max-w-2xl text-sm md:text-base leading-relaxed">
            {t('whyFoursys.subtitle')}
          </p>
          <div className="mt-5 h-px bg-gradient-to-r from-foursys-primary/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* KPI Strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-10"
        >
          {differentials.map((d, i) => (
            <motion.div
              key={d.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="group p-3.5 rounded-xl border border-white/[0.08] bg-foursys-surface/30 hover:border-foursys-primary/30 transition-all duration-300 text-center"
            >
              <div className="text-foursys-primary mb-1 flex justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                {d.icon}
              </div>
              <div className="text-xl md:text-2xl font-black text-white leading-none">{d.stat}</div>
              <div className="text-[9px] font-bold text-foursys-text-dim mt-0.5 uppercase tracking-wider">{d.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Where Foursys stands out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
            <Zap size={18} className="text-foursys-primary" />
            {t('whyFoursys.title')}
          </h3>

          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            {advantages.map((adv, i) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08, duration: 0.4 }}
                className="group relative p-6 rounded-2xl overflow-hidden border transition-all duration-400 hover:border-opacity-40 flex flex-col h-full justify-between"
                style={{
                  background: `linear-gradient(145deg, ${hexToRgba(adv.color, 0.06)}, transparent 60%)`,
                  borderColor: hexToRgba(adv.color, 0.12),
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${adv.color}, transparent)` }}
                />

                <div className="flex items-start justify-between gap-3 mb-4 min-h-[56px]">
                  <h4 className="text-sm font-black text-white flex-1 min-w-0">{adv.title}</h4>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-black" style={{ color: adv.color }}>{adv.metric}</div>
                    <div className="text-[8px] text-foursys-text-dim uppercase tracking-wider whitespace-nowrap">{adv.metricLabel}</div>
                  </div>
                </div>

                <p className="text-xs text-foursys-text-muted leading-relaxed">
                  {adv.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="p-6 md:p-8 rounded-2xl border border-foursys-primary/20 bg-foursys-primary/[0.04] text-center"
        >
          <p className="text-sm md:text-base text-foursys-text-muted leading-relaxed max-w-3xl mx-auto">
            <span className="text-foursys-primary font-black">{uiLabels.ctaPart1}</span>{' '}
            {uiLabels.ctaPart2}{' '}
            <span className="text-white font-bold">{uiLabels.ctaStats}</span>{' '}
            {uiLabels.ctaPart3}
          </p>
        </motion.div>

        {/* Collapsible Comparison Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10"
        >
          <button
            onClick={() => setShowComparison(prev => !prev)}
            className="w-full flex items-center justify-between gap-3 p-4 rounded-xl border border-white/[0.08] bg-foursys-surface/30 hover:border-foursys-primary/25 transition-all duration-300 group"
          >
            <div className="flex items-center gap-2.5">
              <Target size={18} className="text-foursys-primary" />
              <span className="text-sm font-black text-white">{uiLabels.tableTitle}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-foursys-text-dim hidden md:inline">
                {uiLabels.detailedComparison}
              </span>
            </div>
            <ChevronDown
              size={18}
              className={`text-foursys-primary transition-transform duration-300 ${showComparison ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pt-5">
                  <ComparisonTable rows={comparison} />

                  {/* Score summary bar */}
                  <div className="mt-6 p-4 rounded-xl border border-foursys-primary/15 bg-foursys-primary/[0.03] flex flex-wrap items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span className="text-foursys-text-muted">{uiLabels.clearAdvantage}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Minus size={13} className="text-amber-400" />
                      <span className="text-foursys-text-muted">{uiLabels.parity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <XCircle size={13} className="text-red-400/70" />
                      <span className="text-foursys-text-muted">{uiLabels.disadvantage}</span>
                    </div>
                    <div className="h-4 w-px bg-white/10 hidden md:block" />
                    <div className="text-xs font-bold text-foursys-primary">
                      {uiLabels.leadsIn}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
