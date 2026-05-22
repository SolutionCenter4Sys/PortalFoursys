import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BrainCircuit, Factory, Bot, Network, Dna, FlaskConical,
  X, ArrowRight, ChevronRight, Sparkles, TrendingUp,
  Zap, CheckCircle2, Quote,
  Banknote, Gem, Gauge, Workflow, Lightbulb, Compass,
  Wallet, GraduationCap, Rocket, Telescope, Layers,
} from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { BackToOriginChip } from '../ui/BackToOriginChip'
import { useLanguage } from '../../i18n'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { getInnovationTrends } from '../../data/innovation'
import type { InnovationTrend } from '../../data/innovation'

const ICON_MAP: Record<string, React.ReactNode> = {
  'brain-circuit': <BrainCircuit />,
  'factory': <Factory />,
  'bot': <Bot />,
  'network': <Network />,
  'dna': <Dna />,
  'flask-conical': <FlaskConical />,
}

function hexToRgba(hex: string, a: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

// ─── Trend Card ──────────────────────────────────────────────────────────────

function TrendCard({ trend, index, onClick }: { trend: InnovationTrend; index: number; onClick: () => void }) {
  const { t } = useLanguage()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.5, type: 'spring', stiffness: 120 }}
      data-voz-detalhe={`innovation-${trend.id}`}
      data-voz-detalhe-secao="innovation"
      data-voz-detalhe-rotulo={trend.title}
      className="group relative w-full text-left rounded-3xl overflow-hidden cursor-pointer"
      style={{ minHeight: 280 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: hovered
            ? `linear-gradient(160deg, ${hexToRgba(trend.color, 0.18)} 0%, ${hexToRgba(trend.color, 0.04)} 40%, rgba(10,12,20,0.95) 100%)`
            : `linear-gradient(160deg, ${hexToRgba(trend.color, 0.06)} 0%, rgba(10,12,20,0.95) 100%)`,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Border */}
      <div
        className="absolute inset-0 rounded-3xl transition-all duration-500"
        style={{
          border: hovered ? `1.5px solid ${hexToRgba(trend.color, 0.4)}` : '1.5px solid rgba(255,255,255,0.06)',
        }}
      />

      {/* Top glow line */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
        animate={{ width: hovered ? '80%' : '0%', opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: `linear-gradient(90deg, transparent, ${trend.color}, transparent)` }}
      />

      {/* Large background icon */}
      <motion.div
        className="absolute -right-4 -bottom-4 opacity-[0.04] transition-all duration-700"
        animate={{ opacity: hovered ? 0.08 : 0.03, scale: hovered ? 1.1 : 1 }}
      >
        <div style={{ color: trend.color, width: 200, height: 200 }}>
          {ICON_MAP[trend.icon]}
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 p-7 md:p-8 flex flex-col h-full">
        {/* Icon + Number */}
        <div className="flex items-center justify-between mb-5">
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            animate={{
              boxShadow: hovered
                ? `0 0 30px ${hexToRgba(trend.color, 0.3)}, 0 0 60px ${hexToRgba(trend.color, 0.1)}`
                : `0 0 0 ${hexToRgba(trend.color, 0)}`,
            }}
            transition={{ duration: 0.4 }}
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(trend.color, 0.2)}, ${hexToRgba(trend.color, 0.08)})`,
              border: `1px solid ${hexToRgba(trend.color, 0.3)}`,
              color: trend.color,
            }}
          >
            <div className="w-6 h-6">
              {ICON_MAP[trend.icon]}
            </div>
          </motion.div>

          <span
            className="text-6xl font-black leading-none"
            style={{ color: hexToRgba(trend.color, 0.08) }}
          >
            0{index + 1}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-2 group-hover:text-white/95 transition-colors">
          {trend.title}
        </h3>

        <p
          className="text-xs font-bold uppercase tracking-[0.15em] mb-3 transition-colors duration-300"
          style={{ color: hovered ? trend.color : hexToRgba(trend.color, 0.6) }}
        >
          {trend.tagline}
        </p>

        <p className="text-sm text-foursys-text-muted leading-relaxed mb-5 flex-1">
          {trend.description}
        </p>

        {/* Leaders preview */}
        <div className="flex items-center gap-2 mb-4">
          {trend.leaders.map((l, i) => (
            <span
              key={l.name}
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border transition-all duration-300"
              style={{
                borderColor: hexToRgba(trend.color, hovered ? 0.4 : 0.15),
                color: hexToRgba(trend.color, hovered ? 0.9 : 0.5),
                background: hexToRgba(trend.color, hovered ? 0.1 : 0.03),
                transitionDelay: `${i * 50}ms`,
              }}
            >
              {l.name}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm font-bold transition-all duration-300" style={{ color: trend.color }}>
          {t('innovation.exploreTrend')}
          <motion.div animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={16} />
          </motion.div>
        </div>
      </div>

      {/* Bottom glow */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full pointer-events-none"
        animate={{ opacity: hovered ? 0.5 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(ellipse, ${hexToRgba(trend.color, 0.25)} 0%, transparent 70%)`,
          filter: 'blur(12px)',
        }}
      />
    </motion.button>
  )
}

// ─── Drill-Down Modal ────────────────────────────────────────────────────────

function DrillDownModal({ trend, onClose }: { trend: InnovationTrend; onClose: () => void }) {
  const { t, lang } = useLanguage()
  const trapRef = useFocusTrap(true)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-voz-scroll-root
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-label={`${lang === 'pt' ? 'Tendência' : 'Trend'}: ${trend.title}`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      <motion.div
        initial={{ scale: 0.92, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
        onClick={e => e.stopPropagation()}
        aria-live="polite"
        ref={trapRef}
        className="relative z-10 w-full max-w-5xl mx-4 my-8 rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(trend.color, 0.08)} 0%, rgba(10,14,22,0.98) 15%, rgba(10,14,22,0.99) 100%)`,
          border: `1px solid ${hexToRgba(trend.color, 0.2)}`,
        }}
      >
        {/* Hero header */}
        <div className="relative overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${trend.gradient} opacity-60`}
            style={{ height: 280 }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(10,14,22,0.99) 100%)', height: 280 }} />

          {/* Decorative elements */}
          <div className="absolute top-6 right-6 z-20">
            <button
              type="button"
              onClick={onClose}
              aria-label={t('common.close')}
              data-voz-fechar-detalhe="true"
              className="p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.12] transition-colors"
            >
              <X size={18} className="text-white/70" />
            </button>
          </div>

          <div className="relative z-10 px-8 md:px-12 pt-10 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 mb-6"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${hexToRgba(trend.color, 0.3)}, ${hexToRgba(trend.color, 0.1)})`,
                  border: `1.5px solid ${hexToRgba(trend.color, 0.4)}`,
                  boxShadow: `0 0 40px ${hexToRgba(trend.color, 0.2)}`,
                  color: trend.color,
                }}
              >
                <div className="w-7 h-7">{ICON_MAP[trend.icon]}</div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: trend.color }}>
                  {lang === 'pt' ? 'Tendência de Inovação' : 'Innovation Trend'}
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  {trend.title}
                </h2>
              </div>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {trend.stats.map(s => (
                <div
                  key={s.label}
                  className="p-3 rounded-xl text-center"
                  style={{
                    background: hexToRgba(trend.color, 0.06),
                    border: `1px solid ${hexToRgba(trend.color, 0.12)}`,
                  }}
                >
                  <div className="text-xl md:text-2xl font-black" style={{ color: trend.color }}>{s.value}</div>
                  <div className="text-[9px] text-foursys-text-dim uppercase tracking-wider font-bold mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 md:px-12 pb-10 space-y-8">

          {/* Overview & Why it matters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} style={{ color: trend.color }} />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: trend.color }}>{t('innovation.overview')}</h4>
              </div>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{trend.deepDive.overview}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} style={{ color: trend.color }} />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: trend.color }}>{t('innovation.whyItMatters')}</h4>
              </div>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{trend.deepDive.whyItMatters}</p>
            </div>
          </motion.div>

          {/* Foursys position */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="relative p-6 md:p-8 rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(255,102,0,0.08), rgba(255,102,0,0.02))`,
              border: '1.5px solid rgba(255,102,0,0.2)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #FF6600, transparent)' }} />
            <div className="flex items-center gap-3 mb-4">
              <Zap size={18} className="text-foursys-primary" />
              <h3 className="text-lg font-black text-white">{t('innovation.foursysPosition')}</h3>
            </div>
            <p className="text-sm text-foursys-text-muted leading-relaxed mb-5">
              {trend.foursysPosition}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {trend.keyCapabilities.map(cap => (
                <div key={cap} className="flex items-center gap-2 text-xs text-white/80">
                  <CheckCircle2 size={12} className="text-foursys-primary flex-shrink-0" />
                  {cap}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Market & Outlook */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} style={{ color: trend.color }} />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: trend.color }}>{t('innovation.marketSize')}</h4>
              </div>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{trend.deepDive.marketSize}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <Quote size={14} style={{ color: trend.color }} />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: trend.color }}>{t('innovation.futureOutlook')}</h4>
              </div>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{trend.deepDive.futureOutlook}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Dados: 3 Outcomes / 5 Serviços ──────────────────────────────────────────

interface BiCopy { pt: string; en: string }

interface OutcomeCard {
  num: string
  icon: React.ReactNode
  title: BiCopy
  desc: BiCopy
  color: string
}

interface ServiceCard {
  num: string
  icon: React.ReactNode
  title: BiCopy
  desc: BiCopy
  color: string
}

const OUTCOMES: OutcomeCard[] = [
  {
    num: '01',
    icon: <Banknote size={20} />,
    title: { pt: 'Geração de Novas Fontes de Receita', en: 'Generating New Revenue Streams' },
    desc: {
      pt: 'Estruturação e lançamento de novos modelos de negócio, produtos e serviços além do core bancário atual, com governança, método e foco em captura de valor recorrente.',
      en: 'Structuring and launching new business models, products and services beyond the current banking core — with governance, method and focus on recurring value capture.',
    },
    color: '#34D399',
  },
  {
    num: '02',
    icon: <Gem size={20} />,
    title: { pt: 'Aumento do Valor de Longo Prazo', en: 'Long-Term Value Growth' },
    desc: {
      pt: 'Construção de tese de futuro e portfólio de inovação que aumenta a confiança dos stakeholders, fortalece o posicionamento estratégico e sustenta o valuation da instituição.',
      en: 'Building a future thesis and innovation portfolio that boosts stakeholder confidence, strengthens strategic positioning and sustains the institution\'s valuation.',
    },
    color: '#A78BFA',
  },
  {
    num: '03',
    icon: <Gauge size={20} />,
    title: { pt: 'Otimização do Investimento em Inovação', en: 'Innovation Investment Optimization' },
    desc: {
      pt: 'Gestão disciplinada do portfólio de iniciativas, com critérios claros de priorização, métricas por estágio e visibilidade sobre o retorno de cada aposta, da exploração à escala.',
      en: 'Disciplined portfolio management with clear prioritization criteria, stage-based metrics and visibility into the return of each bet, from exploration to scale.',
    },
    color: '#FBBF24',
  },
]

const INNOVATION_SERVICES: ServiceCard[] = [
  {
    num: '01',
    icon: <Workflow size={20} />,
    title: { pt: 'Estrutura e Governança de Inovação', en: 'Innovation Structure & Governance' },
    desc: {
      pt: 'Desenhamos a arquitetura de inovação da organização: modelo operacional, instâncias de decisão, critérios de portfólio e ritos de acompanhamento. Orquestramos também o ecossistema de Open Innovation, conectando startups, hubs, universidades e parceiros tecnológicos para acelerar a execução da tese estratégica.',
      en: 'We design the organization\'s innovation architecture: operating model, decision bodies, portfolio criteria and tracking rituals. We also orchestrate the Open Innovation ecosystem, connecting startups, hubs, universities and technology partners to accelerate the strategic thesis.',
    },
    color: '#60A5FA',
  },
  {
    num: '02',
    icon: <Lightbulb size={20} />,
    title: { pt: 'Design de Novos Modelos de Negócio', en: 'New Business Model Design' },
    desc: {
      pt: 'É aqui que a inovação se transforma em novas fontes de receita. Aplicamos metodologias de ponta para desenhar, prototipar e validar novos modelos de negócio, produtos e serviços voltados ao mercado. Inclui a estruturação de ventures e unidades dedicadas que combinam autonomia para crescer com alinhamento ao core business.',
      en: 'This is where innovation turns into new revenue streams. We apply leading methodologies to design, prototype and validate new business models, products and market-facing services. Includes structuring ventures and dedicated units that combine growth autonomy with alignment to the core business.',
    },
    color: '#34D399',
  },
  {
    num: '03',
    icon: <Compass size={20} />,
    title: { pt: 'Estratégia de Negócios Digitais', en: 'Digital Business Strategy' },
    desc: {
      pt: 'No setor financeiro, tecnologia deixou de ser suporte e passou a ser o próprio negócio. Ajudamos instituições a transformar sua capacidade tecnológica em vantagem competitiva real — redefinindo modelos operacionais, criando jornadas digitais centradas no cliente, desenvolvendo ecossistemas de parceiros e evoluindo para uma mentalidade de plataforma.',
      en: 'In the financial industry, technology has shifted from support to the business itself. We help institutions turn their tech capability into real competitive advantage — redefining operating models, creating customer-centric digital journeys, developing partner ecosystems and evolving toward a platform mindset.',
    },
    color: '#FF5315',
  },
  {
    num: '04',
    icon: <Wallet size={20} />,
    title: { pt: 'Gestão do Portfólio e Financiamento (TBM)', en: 'Portfolio & Funding Management (TBM)' },
    desc: {
      pt: 'Tratamos inovação como uma classe de ativos a ser gerenciada com disciplina financeira. Implementamos a gestão do portfólio de inovação com métricas de performance por estágio, da exploração à escala, e aplicamos os princípios do TBM (Technology Business Management) para garantir visibilidade total e otimização do retorno sobre cada iniciativa.',
      en: 'We treat innovation as an asset class managed with financial discipline. We implement portfolio management with stage-based performance metrics, from exploration to scale, applying TBM (Technology Business Management) principles to ensure full visibility and optimized return on each initiative.',
    },
    color: '#FBBF24',
  },
  {
    num: '05',
    icon: <GraduationCap size={20} />,
    title: { pt: 'Cultura e Capacitação para Inovação', en: 'Innovation Culture & Enablement' },
    desc: {
      pt: 'Uma estratégia de inovação só ganha vida com as pessoas. Implementamos a jornada para criar uma cultura Innovation Driven em organizações financeiras — capacitação de lideranças e times em novos frameworks, programas de ideação, hackathons corporativos e assessments de maturidade que transformam o mindset sem comprometer a disciplina operacional que o setor exige.',
      en: 'An innovation strategy only comes alive through people. We implement the journey to build an Innovation-Driven culture in financial organizations — leadership and team training in new frameworks, ideation programs, corporate hackathons and maturity assessments that shift the mindset without compromising the operational discipline the industry demands.',
    },
    color: '#89BAB1',
  },
]

// ─── Outcome Card ────────────────────────────────────────────────────────────

function OutcomeCardView({ item, index, lang }: { item: OutcomeCard; index: number; lang: 'pt' | 'en' }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.5, type: 'spring', stiffness: 120 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          background: hovered
            ? `linear-gradient(160deg, ${hexToRgba(item.color, 0.16)} 0%, rgba(10,12,20,0.95) 100%)`
            : `linear-gradient(160deg, ${hexToRgba(item.color, 0.06)} 0%, rgba(10,12,20,0.95) 100%)`,
        }}
        transition={{ duration: 0.4 }}
      />
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-400"
        style={{ border: hovered ? `1.5px solid ${hexToRgba(item.color, 0.4)}` : '1.5px solid rgba(255,255,255,0.06)' }}
      />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
        animate={{ width: hovered ? '70%' : '0%', opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
      />

      <div className="relative z-10 p-5 md:p-6 flex flex-col h-full" style={{ minHeight: 240 }}>
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(item.color, 0.25)}, ${hexToRgba(item.color, 0.08)})`,
              border: `1px solid ${hexToRgba(item.color, 0.35)}`,
              color: item.color,
            }}
          >
            {item.icon}
          </div>
          <span className="text-[11px] font-black tracking-widest" style={{ color: hexToRgba(item.color, 0.7) }}>
            {item.num}
          </span>
        </div>
        <h4 className="text-base md:text-lg font-black text-white leading-tight mb-2">
          {item.title[lang]}
        </h4>
        <p className="text-xs md:text-sm text-foursys-text-muted leading-relaxed">
          {item.desc[lang]}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Service Card (Como atuamos) ─────────────────────────────────────────────

function InnovationServiceCard({ item, index, lang }: { item: ServiceCard; index: number; lang: 'pt' | 'en' }) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.45, type: 'spring', stiffness: 120 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setExpanded(!expanded)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          background: hovered
            ? `linear-gradient(155deg, ${hexToRgba(item.color, 0.14)} 0%, rgba(10,12,20,0.95) 100%)`
            : `linear-gradient(155deg, ${hexToRgba(item.color, 0.05)} 0%, rgba(10,12,20,0.95) 100%)`,
        }}
        transition={{ duration: 0.4 }}
      />
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-400"
        style={{ border: hovered ? `1px solid ${hexToRgba(item.color, 0.4)}` : '1px solid rgba(255,255,255,0.06)' }}
      />

      <div className="relative z-10 p-5 md:p-6">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(item.color, 0.25)}, ${hexToRgba(item.color, 0.08)})`,
              border: `1px solid ${hexToRgba(item.color, 0.35)}`,
              color: item.color,
            }}
          >
            {item.icon}
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-black tracking-widest" style={{ color: hexToRgba(item.color, 0.7) }}>
              {item.num}
            </span>
            <h4 className="text-sm md:text-base font-black text-white leading-tight mt-0.5">
              {item.title[lang]}
            </h4>
          </div>
        </div>

        <p
          className={`text-xs md:text-sm text-foursys-text-muted leading-relaxed transition-all duration-300 ${
            expanded ? '' : 'line-clamp-3'
          }`}
        >
          {item.desc[lang]}
        </p>

        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-bold" style={{ color: item.color }}>
          {expanded
            ? (lang === 'pt' ? 'Recolher' : 'Collapse')
            : (lang === 'pt' ? 'Ler completo' : 'Read full')}
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={12} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Section ────────────────────────────────────────────────────────────

export function SectionInnovation() {
  const { t, lang } = useLanguage()
  const trends = useMemo(() => getInnovationTrends(lang), [lang])
  const [activeTrend, setActiveTrend] = useState<InnovationTrend | null>(null)
  const L = lang as 'pt' | 'en'
  const pt = lang === 'pt'

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">

        <div className="mb-4">
          <BackToOriginChip />
        </div>

        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center mb-12"
        >
          {/* Decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(255,102,0,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foursys-primary/10 border border-foursys-primary/25 mb-5"
          >
            <Sparkles size={14} className="text-foursys-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-foursys-primary">
              {t('innovation.badge')}
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            {t('innovation.title')}
          </h2>

          <p className="text-sm md:text-base text-foursys-text-muted max-w-2xl mx-auto leading-relaxed">
            {t('innovation.subtitle')}
          </p>

          <div className="mt-6 flex justify-center">
            <div className="h-px w-48 bg-gradient-to-r from-transparent via-foursys-primary/40 to-transparent" />
          </div>
        </motion.div>

        {/* ── Bloco 1: O que entregamos (3 Outcomes) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          data-voz-caixa="innovation-outcomes"
          data-voz-caixa-secao="innovation"
          data-voz-caixa-rotulo={pt ? 'O que entregamos' : 'What we deliver'}
          tabIndex={-1}
          className="mb-14 focus:outline-none"
        >
          <div className="flex items-center gap-3 mb-6">
            <Rocket size={18} className="text-foursys-primary" />
            <h3 className="text-xl md:text-2xl font-black text-white">
              {pt ? 'O que entregamos' : 'What we deliver'}
            </h3>
          </div>
          <p className="text-xs md:text-sm text-foursys-text-muted leading-relaxed max-w-3xl mb-5">
            {pt
              ? 'Inovação aplicada ao negócio é tese, portfólio e disciplina. Estes são os três resultados que perseguimos junto com nossos clientes.'
              : 'Business-applied innovation is thesis, portfolio and discipline. These are the three outcomes we pursue with our clients.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {OUTCOMES.map((item, i) => (
              <OutcomeCardView key={item.num} item={item} index={i} lang={L} />
            ))}
          </div>
        </motion.div>

        {/* ── Bloco 2: Como atuamos (5 Serviços) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          data-voz-caixa="innovation-servicos"
          data-voz-caixa-secao="innovation"
          data-voz-caixa-rotulo={pt ? 'Como atuamos' : 'How we work'}
          tabIndex={-1}
          className="mb-14 focus:outline-none"
        >
          <div className="flex items-center gap-3 mb-6">
            <Workflow size={18} className="text-foursys-primary" />
            <h3 className="text-xl md:text-2xl font-black text-white">
              {pt ? 'Como atuamos' : 'How we work'}
            </h3>
          </div>
          <p className="text-xs md:text-sm text-foursys-text-muted leading-relaxed max-w-3xl mb-5">
            {pt
              ? 'Cinco frentes integradas que cobrem do desenho da governança ao financiamento e à cultura — para que inovação saia do PowerPoint e gere caixa.'
              : 'Five integrated workstreams covering from governance design to funding and culture — so innovation moves beyond slides and generates cash.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {INNOVATION_SERVICES.map((item, i) => (
              <InnovationServiceCard key={item.num} item={item} index={i} lang={L} />
            ))}
          </div>
        </motion.div>

        {/* ── Bloco 3: Studio de Inovação Foursys (Featured) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          data-voz-caixa="innovation-studio"
          data-voz-caixa-secao="innovation"
          data-voz-caixa-rotulo={pt ? 'Studio de Inovação Foursys' : 'Foursys Innovation Studio'}
          tabIndex={-1}
          className="relative rounded-3xl overflow-hidden mb-16 focus:outline-none"
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255,83,21,0.18) 0%, rgba(137,186,177,0.10) 50%, rgba(10,12,20,0.95) 100%)',
            }}
          />
          <div
            className="absolute inset-0 rounded-3xl"
            style={{ border: '1.5px solid rgba(255,83,21,0.35)' }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-2/3 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #FF5315, transparent)' }}
          />
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(255,83,21,0.18) 0%, transparent 70%)', filter: 'blur(30px)' }}
          />

          <div className="relative z-10 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-6 lg:gap-10 items-center">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-primary/15 border border-foursys-primary/35 mb-4"
              >
                <Telescope size={13} className="text-foursys-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-foursys-primary">
                  {pt ? 'Capacidade Integrada' : 'Integrated Capability'}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,83,21,0.3), rgba(255,83,21,0.08))',
                    border: '1px solid rgba(255,83,21,0.45)',
                    color: '#FF5315',
                  }}
                >
                  <Sparkles size={26} />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                  {pt ? 'Studio de Inovação' : 'Innovation Studio'}<br />
                  <span className="text-foursys-primary">Foursys</span>
                </h3>
              </div>
              <div className="hidden lg:flex flex-wrap gap-2 mt-2">
                {[
                  { pt: 'Estratégia', en: 'Strategy' },
                  { pt: 'Design', en: 'Design' },
                  { pt: 'Produto', en: 'Product' },
                  { pt: 'Portfólio', en: 'Portfolio' },
                ].map((chip, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(255,83,21,0.10)',
                      border: '1px solid rgba(255,83,21,0.25)',
                      color: '#FF5315',
                    }}
                  >
                    {chip[L]}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm md:text-base text-white/90 leading-relaxed mb-3">
                {pt
                  ? <>O <span className="font-bold text-foursys-primary">Studio de Inovação da Foursys</span> é um motor de crescimento baseado em evidências, que combina <span className="font-bold text-white">visão estratégica, design de soluções, desenvolvimento de produtos e gestão de portfólio</span> em uma capacidade integrada, disponível para nossos clientes como extensão do seu próprio time de inovação.</>
                  : <>The <span className="font-bold text-foursys-primary">Foursys Innovation Studio</span> is an evidence-based growth engine that combines <span className="font-bold text-white">strategic vision, solution design, product development and portfolio management</span> as an integrated capability, available to our clients as an extension of their own innovation team.</>}
              </p>
              <p className="text-xs md:text-sm text-foursys-text-muted leading-relaxed mb-5">
                {pt
                  ? 'Operamos com método, critérios claros de priorização e governança ativa sobre o que deve avançar, ser ajustado ou encerrado. O resultado é inovação conectada à estratégia, à execução e ao negócio.'
                  : 'We operate with method, clear prioritization criteria and active governance over what should advance, be adjusted or be ended. The outcome is innovation connected to strategy, execution and business.'}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {[
                  { icon: <CheckCircle2 size={14} />, label: { pt: 'Baseado em evidências', en: 'Evidence-based' } },
                  { icon: <Layers size={14} />, label: { pt: 'Capacidade integrada', en: 'Integrated capability' } },
                  { icon: <Compass size={14} />, label: { pt: 'Governança ativa', en: 'Active governance' } },
                  { icon: <Zap size={14} />, label: { pt: 'Extensão do seu time', en: 'Your team extended' } },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl px-3 py-2"
                    style={{
                      background: 'rgba(10,12,20,0.55)',
                      border: '1px solid rgba(255,83,21,0.18)',
                    }}
                  >
                    <span className="text-foursys-primary flex-shrink-0">{item.icon}</span>
                    <span className="text-[11px] font-bold text-white leading-tight">{item.label[L]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Bloco 4: Tendências que estamos navegando (existente) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={18} className="text-foursys-primary" />
            <h3 className="text-xl md:text-2xl font-black text-white">
              {pt ? 'Tendências que estamos navegando' : 'Trends we are navigating'}
            </h3>
          </div>
          <p className="text-xs md:text-sm text-foursys-text-muted leading-relaxed max-w-3xl mb-6">
            {pt
              ? 'As fronteiras globais que moldam o nosso pipeline de inovação. Cada tendência abre um deep-dive com posicionamento Foursys, líderes de mercado e perspectiva futura.'
              : 'The global frontiers shaping our innovation pipeline. Each trend opens a deep-dive with Foursys positioning, market leaders and future outlook.'}
          </p>

          <div
            data-voz-caixa="innovation-trends"
            data-voz-caixa-secao="innovation"
            data-voz-caixa-rotulo={pt ? 'Tendências que estamos navegando' : 'Trends we are navigating'}
            tabIndex={-1}
            className="grid grid-cols-1 tablet:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 focus:outline-none"
          >
            {trends.map((trend, i) => (
              <TrendCard key={trend.id} trend={trend} index={i} onClick={() => setActiveTrend(trend)} />
            ))}
          </div>
        </motion.div>

        {/* Bottom insight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative text-center pt-8 border-t border-white/[0.06]"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-foursys-primary/40 to-transparent" />
          <p className="text-sm text-foursys-text-muted leading-relaxed max-w-xl mx-auto">
            {lang === 'pt' ? (
              <>A Foursys combina o <span className="text-foursys-primary font-black">melhor das referências globais</span> com
              a agilidade, proximidade e custo-benefício que só uma empresa brasileira com{' '}
              <span className="text-white font-bold">26 anos de história</span> pode oferecer.</>
            ) : (
              <>Foursys combines the <span className="text-foursys-primary font-black">best of global references</span> with
              the agility, proximity and cost-effectiveness that only a Brazilian company with{' '}
              <span className="text-white font-bold">26 years of history</span> can offer.</>
            )}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-foursys-primary">
            <ArrowRight size={14} />
            {lang === 'pt' ? 'Inovação aplicada aos seus desafios' : 'Innovation applied to your challenges'}
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeTrend && (
          <DrillDownModal trend={activeTrend} onClose={() => setActiveTrend(null)} />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
