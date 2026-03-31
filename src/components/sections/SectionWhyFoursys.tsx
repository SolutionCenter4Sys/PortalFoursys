import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Calendar, ShieldCheck, Globe, Network, TrendingUp,
  ChevronDown, ChevronUp, Zap, DollarSign, Clock, Heart,
  CheckCircle2, XCircle, Minus, Award, Building2, Target,
} from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'

function hexToRgba(hex: string, a: number) {
  const h = hex.replace('#', '')
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`
}

// ─── Data ────────────────────────────────────────────────────────────────────

const DIFFERENTIALS = [
  { icon: <Users size={20} />, stat: '3,6%', label: 'Turnover', context: 'vs. 22% da média do mercado' },
  { icon: <Calendar size={20} />, stat: '26', label: 'Anos de entrega', context: 'Fundada em 2000' },
  { icon: <ShieldCheck size={20} />, stat: '4', label: 'Certificações ISO', context: '9001 · 27001 · 27701 · 14001' },
  { icon: <Globe size={20} />, stat: '3', label: 'Continentes', context: 'Brasil · EUA · Portugal' },
  { icon: <Network size={20} />, stat: '6+', label: 'Parcerias tier-1', context: 'Microsoft · AWS · Google · SAP' },
  { icon: <TrendingUp size={20} />, stat: '500K+', label: 'Projetos entregues', context: 'Todos os modelos de delivery' },
]

interface ComparisonRow {
  dimension: string
  icon: React.ReactNode
  foursys: { value: string; detail: string; score: 'high' | 'mid' | 'low' }
  bigFour: { value: string; detail: string; score: 'high' | 'mid' | 'low' }
  boutique: { value: string; detail: string; score: 'high' | 'mid' | 'low' }
  foursysAdvantage: boolean
}

const COMPARISON: ComparisonRow[] = [
  {
    dimension: 'Custo / Hora',
    icon: <DollarSign size={15} />,
    foursys: { value: 'R$ 120-250/h', detail: 'Competitivo para o mercado BR/LatAm', score: 'high' },
    bigFour: { value: 'US$ 200-500+/h', detail: 'Premium global, custos elevados', score: 'low' },
    boutique: { value: 'US$ 150-400/h', detail: 'Variável conforme especialidade', score: 'mid' },
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
    dimension: 'Escala Global',
    icon: <Globe size={15} />,
    foursys: { value: '3 países', detail: 'BR + EUA + Portugal, foco LatAm', score: 'mid' },
    bigFour: { value: '100+ países', detail: 'Presença massiva global', score: 'high' },
    boutique: { value: '5-20 países', detail: 'Regional ou nicho global', score: 'mid' },
    foursysAdvantage: false,
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

const SCORE_ICON = {
  high: <CheckCircle2 size={13} className="text-emerald-400" />,
  mid: <Minus size={13} className="text-amber-400" />,
  low: <XCircle size={13} className="text-red-400/70" />,
}

const ADVANTAGES = [
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
    description: '20+ anos com o mesmo cliente (Itaú, Santander). Não vendemos horas — construímos relacionamento de longo prazo com accountability real.',
    color: '#06B6D4',
    metric: '20+',
    metricLabel: 'anos com mesmo cliente',
  },
]

// ─── Components ──────────────────────────────────────────────────────────────

function ComparisonTable() {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? COMPARISON : COMPARISON.slice(0, 5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h3 className="text-lg font-black text-white mb-5 flex items-center gap-2">
        <Target size={18} className="text-foursys-primary" />
        Foursys vs. Consultorias Globais
      </h3>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[1.8fr_1fr_1fr_1fr] gap-2 mb-2 px-4">
        <div className="text-[9px] font-bold uppercase tracking-wider text-foursys-text-dim">Dimensão</div>
        <div className="text-[9px] font-bold uppercase tracking-wider text-foursys-primary text-center">Foursys</div>
        <div className="text-[9px] font-bold uppercase tracking-wider text-foursys-text-dim text-center">Big Four / Globais</div>
        <div className="text-[9px] font-bold uppercase tracking-wider text-foursys-text-dim text-center">Boutiques</div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        <AnimatePresence>
          {visible.map((row, i) => (
            <motion.div
              key={row.dimension}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
                    Vantagem
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
        </AnimatePresence>
      </div>

      {/* Expand/collapse */}
      {COMPARISON.length > 5 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 mx-auto flex items-center gap-1.5 text-xs font-bold text-foursys-primary hover:text-foursys-cyan transition-colors"
        >
          {expanded ? (
            <>Ver menos <ChevronUp size={14} /></>
          ) : (
            <>Ver todas as {COMPARISON.length} dimensões <ChevronDown size={14} /></>
          )}
        </button>
      )}
    </motion.div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function SectionWhyFoursys() {
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
            Benchmarking Competitivo
          </p>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-none mb-3">
            Por que a Foursys?
          </h2>
          <p className="text-foursys-text-muted max-w-2xl text-sm md:text-base leading-relaxed">
            Avaliação comparativa contra as principais consultorias globais de tecnologia —
            Accenture, Deloitte, McKinsey, BCG, KPMG, PwC, EY e boutiques especializadas.
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
          {DIFFERENTIALS.map((d, i) => (
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

        {/* Comparison Table */}
        <ComparisonTable />

        {/* Score summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 rounded-xl border border-foursys-primary/15 bg-foursys-primary/[0.03] flex flex-wrap items-center justify-center gap-6"
        >
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 size={13} className="text-emerald-400" />
            <span className="text-foursys-text-muted">Vantagem clara</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Minus size={13} className="text-amber-400" />
            <span className="text-foursys-text-muted">Paridade</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <XCircle size={13} className="text-red-400/70" />
            <span className="text-foursys-text-muted">Desvantagem</span>
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <div className="text-xs font-bold text-foursys-primary">
            Foursys lidera em {COMPARISON.filter(c => c.foursysAdvantage).length} de {COMPARISON.length} dimensões
          </div>
        </motion.div>

        {/* Why we win section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
            <Zap size={18} className="text-foursys-primary" />
            Onde a Foursys supera as globais
          </h3>

          <div className="grid md:grid-cols-2 gap-4 md:gap-5">
            {ADVANTAGES.map((adv, i) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.08, duration: 0.4 }}
                className="group relative p-6 rounded-2xl overflow-hidden border transition-all duration-400 hover:border-opacity-40"
                style={{
                  background: `linear-gradient(145deg, ${hexToRgba(adv.color, 0.06)}, transparent 60%)`,
                  borderColor: hexToRgba(adv.color, 0.12),
                }}
              >
                {/* Top accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${adv.color}, transparent)` }}
                />

                <div className="flex items-start justify-between gap-4 mb-3">
                  <h4 className="text-sm font-black text-white">{adv.title}</h4>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-black" style={{ color: adv.color }}>{adv.metric}</div>
                    <div className="text-[8px] text-foursys-text-dim uppercase tracking-wider max-w-[100px]">{adv.metricLabel}</div>
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
          transition={{ delay: 0.9 }}
          className="mt-10 p-6 md:p-8 rounded-2xl border border-foursys-primary/20 bg-foursys-primary/[0.04] text-center"
        >
          <p className="text-sm md:text-base text-foursys-text-muted leading-relaxed max-w-3xl mx-auto">
            <span className="text-foursys-primary font-black">A Foursys entrega o calibre de uma consultoria global</span>{' '}
            com a agilidade, proximidade e custo-benefício que só uma empresa brasileira com{' '}
            <span className="text-white font-bold">26 anos de história, 3,6% de turnover e 4 certificações ISO</span>{' '}
            pode oferecer. Não competimos em escala — competimos em profundidade, resultado e confiança.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
