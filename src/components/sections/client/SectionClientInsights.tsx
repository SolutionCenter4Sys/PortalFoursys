import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronUp,
  X,
  TrendingUp,
  Target,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Zap,
} from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import { SectionWrapper } from '../../ui/SectionWrapper'
import { ClientBackButton } from './ClientBackButton'
import { getClientById } from '../../../data/clients'
import type { ClientInsight } from '../../../types'
import {
  santanderStrategicContext,
  santanderDrillDowns,
  type SantanderDrillDown,
  type SantanderStrategicContext,
} from '../../../data/clients/santander'

// ─── Helpers ────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, a: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

// ─── Santander Strategic Hero (top of page) ─────────────────────────────────

function SantanderStrategicHero({
  ctx,
  color,
}: {
  ctx: SantanderStrategicContext
  color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      {/* Report badge */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{ background: hexToRgba(color, 0.15), color }}
        >
          {ctx.reportTitle}
        </div>
        <span className="text-xs text-foursys-text-dim">{ctx.period}</span>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {ctx.kpis.slice(0, 8).map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-foursys-surface/30 p-3"
          >
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
              }}
            />
            <div
              className="text-lg md:text-xl font-black leading-none relative"
              style={{ color }}
            >
              {kpi.value}
            </div>
            <div className="text-[10px] text-foursys-text-muted mt-1.5 leading-tight relative">
              {kpi.label}
            </div>
            {kpi.delta && (
              <div className="text-[9px] text-foursys-text-dim mt-1 relative">
                {kpi.delta}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Strategy pillars */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {ctx.strategyPillars.map((pillar, i) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-foursys-surface/20 p-5"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: `linear-gradient(to right, ${pillar.color}, transparent)`,
              }}
            />
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{pillar.icon}</span>
              <div>
                <h4
                  className="text-sm font-black leading-none"
                  style={{ color: pillar.color }}
                >
                  {pillar.title}
                </h4>
                <p className="text-[10px] text-foursys-text-dim mt-0.5">
                  {pillar.subtitle}
                </p>
              </div>
            </div>
            <ul className="space-y-2">
              {pillar.points.map((point) => (
                <li
                  key={point}
                  className="text-xs text-foursys-text-muted leading-relaxed flex gap-2"
                >
                  <ArrowRight
                    size={10}
                    className="flex-shrink-0 mt-1"
                    style={{ color: pillar.color }}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Highlights strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="rounded-xl border border-white/[0.06] bg-foursys-surface/10 p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={14} style={{ color }} />
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color }}>
            Destaques do Resultado
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
          {ctx.highlights.map((h) => (
            <p key={h} className="text-[11px] text-foursys-text-dim leading-relaxed flex gap-2">
              <span style={{ color }} className="flex-shrink-0">•</span>
              {h}
            </p>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Drill-down Modal ───────────────────────────────────────────────────────

function DrillDownModal({
  insight,
  drillDown,
  color,
  onClose,
}: {
  insight: ClientInsight
  drillDown: SantanderDrillDown
  color: string
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Análise detalhada: ${insight.title}`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/[0.1] bg-[#0c0c14]"
        aria-live="polite"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero header */}
        <div
          className="relative overflow-hidden p-6 md:p-8"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(color, 0.15)}, ${hexToRgba(color, 0.03)} 70%)`,
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 80% 20%, ${color}, transparent 60%)`,
            }}
          />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors z-20"
          >
            <X size={16} />
          </button>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{insight.icon}</span>
              <div>
                <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                  {insight.title}
                </h2>
              </div>
            </div>

            {/* Hero stat */}
            <div className="flex items-end gap-4 mt-6">
              <div>
                <div className="text-4xl md:text-5xl font-black" style={{ color }}>
                  {drillDown.heroStat.value}
                </div>
                <div className="text-sm text-white/60 mt-1">
                  {drillDown.heroStat.label}
                </div>
              </div>
              <div className="flex gap-3 mb-2">
                {drillDown.relevantKpis.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.04]"
                  >
                    <div className="text-sm font-bold text-white">{kpi.value}</div>
                    <div className="text-[9px] text-white/50">{kpi.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Contexto estratégico */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} style={{ color }} />
              <h3 className="text-sm font-bold text-white uppercase tracking-[0.1em]">
                Contexto Estratégico
              </h3>
            </div>
            <p className="text-sm text-foursys-text-muted leading-relaxed">
              {drillDown.context}
            </p>
          </div>

          {/* Desafio */}
          <div
            className="p-4 rounded-xl border-l-[3px]"
            style={{
              borderColor: color,
              backgroundColor: hexToRgba(color, 0.05),
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} style={{ color }} />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color }}
              >
                O Desafio
              </span>
            </div>
            <p className="text-sm text-foursys-text-muted leading-relaxed">
              {drillDown.challenge}
            </p>
          </div>

          {/* Abordagem Foursys */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} style={{ color }} />
              <h3 className="text-sm font-bold text-white uppercase tracking-[0.1em]">
                Abordagem Foursys
              </h3>
            </div>
            <div className="grid gap-2">
              {drillDown.foursysApproach.map((approach, i) => (
                <motion.div
                  key={approach}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]"
                >
                  <CheckCircle2
                    size={16}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color }}
                  />
                  <span className="text-sm text-foursys-text-muted leading-relaxed">
                    {approach}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Impacto esperado */}
          <div
            className="rounded-xl p-5"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(color, 0.08)}, transparent 70%)`,
              border: `1px solid ${hexToRgba(color, 0.12)}`,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} style={{ color }} />
              <h3
                className="text-sm font-bold uppercase tracking-[0.1em]"
                style={{ color }}
              >
                Impacto Esperado
              </h3>
            </div>
            <div className="space-y-2">
              {drillDown.expectedImpact.map((impact) => (
                <div key={impact} className="flex items-start gap-3">
                  <ArrowRight
                    size={12}
                    className="flex-shrink-0 mt-1.5"
                    style={{ color }}
                  />
                  <span className="text-sm text-white/80 leading-relaxed font-medium">
                    {impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Insight Card ───────────────────────────────────────────────────────────

function InsightCard({
  insight,
  index,
  clientColor,
  hasDrillDown,
  onDrillDown,
}: {
  insight: ClientInsight
  index: number
  clientColor: string
  hasDrillDown: boolean
  onDrillDown: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="group relative rounded-2xl border border-white/[0.08] bg-foursys-surface/30 overflow-hidden hover:border-white/[0.14] transition-colors"
    >
      {/* Top accent */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: expanded ? 1 : 0 }}
        style={{
          background: `linear-gradient(to right, ${clientColor}, transparent)`,
          transformOrigin: 'left',
        }}
      />

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-start gap-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-2xl flex-shrink-0 mt-0.5">{insight.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-foursys-text leading-snug">
            {insight.title}
          </h3>
          <p className="text-xs text-foursys-text-muted mt-1 line-clamp-2 leading-relaxed">
            {insight.description}
          </p>
        </div>
        <div className="flex-shrink-0 mt-0.5 text-foursys-text-dim">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="mx-5 mb-5 p-4 rounded-xl border-l-[3px]"
              style={{
                borderColor: clientColor,
                backgroundColor: `${clientColor}08`,
              }}
            >
              <div
                className="text-[10px] font-bold uppercase tracking-[0.14em] mb-2"
                style={{ color: clientColor }}
              >
                Resposta Foursys
              </div>
              <p className="text-sm text-foursys-text-muted leading-relaxed">
                {insight.solution}
              </p>

              {hasDrillDown && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDrillDown()
                  }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${clientColor}, ${hexToRgba(clientColor, 0.7)})`,
                    color: '#fff',
                    boxShadow: `0 4px 16px ${hexToRgba(clientColor, 0.3)}`,
                  }}
                >
                  <BarChart3 size={12} />
                  Ver análise completa
                  <ArrowRight size={12} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Componente principal ───────────────────────────────────────────────────

export function SectionClientInsights() {
  const { state } = useApp()
  const client = state.activeClientId ? getClientById(state.activeClientId) : null
  const [activeDrillDown, setActiveDrillDown] = useState<{
    insight: ClientInsight
    drillDown: SantanderDrillDown
  } | null>(null)

  if (!client) return null

  const insights = client.insights ?? []
  const clientColor = client.colors.primary
  const isSantander = client.id === 'santander'

  const getDrillDown = (insightId: string): SantanderDrillDown | undefined =>
    santanderDrillDowns.find((d) => d.insightId === insightId)

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-5xl mx-auto">
        {/* ── Voltar ── */}
        <ClientBackButton clientName={client.name} color={clientColor} />

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <span
            className="text-xs font-bold uppercase tracking-[0.18em] mb-2 block"
            style={{ color: clientColor }}
          >
            {client.name}
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-none mb-3">
            {isSantander
              ? 'Conhecemos seus desafios'
              : `Percepções ${client.name}`}
          </h2>
          <p className="text-foursys-text-muted text-base max-w-2xl leading-relaxed">
            {isSantander
              ? 'Análise estratégica baseada na Apresentação Institucional 4T25 do Santander Brasil — sabemos como impulsionar os resultados que vocês precisam.'
              : `O que identificamos nas operações e no contexto do ${client.name} — dores reais com respostas concretas.`}
          </p>
          <div
            className="mt-6 h-px bg-gradient-to-r from-transparent via-transparent to-transparent"
            style={{
              background: `linear-gradient(to right, ${clientColor}50, rgba(255,255,255,0.06), transparent)`,
            }}
          />
        </motion.div>

        {/* ── Santander Strategic Context ── */}
        {isSantander && (
          <SantanderStrategicHero ctx={santanderStrategicContext} color={clientColor} />
        )}

        {insights.length > 0 ? (
          <>
            {/* ── Separator before insights ── */}
            {isSantander && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3">
                  <Zap size={16} style={{ color: clientColor }} />
                  <h3 className="text-lg font-black text-white">
                    Como podemos impulsionar cada pilar
                  </h3>
                </div>
                <p className="text-xs text-foursys-text-dim mt-1 ml-7">
                  Clique em cada desafio para ver a análise completa com dados, abordagem e impacto esperado.
                </p>
              </motion.div>
            )}

            {/* ── Grid de percepções ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              {insights.map((insight, i) => {
                const drillDown = isSantander ? getDrillDown(insight.id) : undefined
                return (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    index={i}
                    clientColor={clientColor}
                    hasDrillDown={!!drillDown}
                    onDrillDown={() =>
                      drillDown && setActiveDrillDown({ insight, drillDown })
                    }
                  />
                )
              })}
            </div>

            {/* ── Resumo ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl border border-white/[0.08] bg-foursys-surface/20"
            >
              <h3 className="text-sm font-bold text-foursys-text mb-3">
                {isSantander
                  ? 'Nossa posição privilegiada'
                  : `Nossa abordagem para ${client.name}`}
              </h3>
              <p className="text-sm text-foursys-text-muted leading-relaxed">
                {isSantander
                  ? 'Com 17+ anos dentro do ecossistema Santander, a Foursys tem uma posição única: combinamos conhecimento profundo do negócio bancário, domínio técnico do legado e capacidade de inovação com IA. Cada percepção acima foi mapeada diretamente a partir dos pilares estratégicos declarados na apresentação institucional 4T25 — não vendemos tecnologia genérica, entregamos aceleração dos resultados que o Santander já traçou.'
                  : `Cada percepção listada acima foi identificada a partir de experiências reais nos projetos do ${client.name}. Nossa proposta não é vender tecnologia genérica — é resolver os problemas específicos que impedem a velocidade, a qualidade e a inovação do ${client.name}.`}
              </p>
            </motion.div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-foursys-text-muted text-sm">
            Percepções em preparação. Entre em contato para detalhes.
          </div>
        )}
      </div>

      {/* ── Drill-down modal ── */}
      <AnimatePresence>
        {activeDrillDown && (
          <DrillDownModal
            insight={activeDrillDown.insight}
            drillDown={activeDrillDown.drillDown}
            color={clientColor}
            onClose={() => setActiveDrillDown(null)}
          />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
