import { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Layers3, X, CheckCircle2, Shield, Zap } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { DynIcon } from '../../utils/iconMap'
import { serviceLines } from '../../data/services'
import { SERVICE_ICONS, SERVICE_VISUALS, DEFAULT_VISUAL } from '../../data/serviceVisuals'
import { useApp } from '../../context/AppContext'
import type { ServiceLine } from '../../types'

const CONTRACT_MODELS = [
  { title: 'Squads', desc: 'Times multidisciplinares integrados' },
  { title: 'Projetos', desc: 'Escopo fechado com entregas claras' },
  { title: 'Alocação', desc: 'Especialistas sob demanda' },
  { title: 'AMS', desc: 'Sustentação contínua com SLA' },
]

/* ── helpers ─────────────────────────────────────────────────────────────────── */

function getLabelPosition(angleDeg: number) {
  const norm = ((angleDeg % 360) + 360) % 360
  if (norm > 280 || norm < 70)
    return 'left-[calc(100%+10px)] top-1/2 -translate-y-1/2 text-left'
  if (norm >= 70 && norm <= 110)
    return 'left-1/2 -translate-x-1/2 top-[calc(100%+6px)] text-center'
  if (norm > 110 && norm < 250)
    return 'right-[calc(100%+10px)] top-1/2 -translate-y-1/2 text-right'
  return 'left-1/2 -translate-x-1/2 bottom-[calc(100%+6px)] text-center'
}

/* ── OrbitRing ────────────────────────────────────────────────────────────────── */

function OrbitRing({
  activeId,
  onSelect,
  onKeyNav,
}: {
  activeId: string
  onSelect: (id: string) => void
  onKeyNav: (e: React.KeyboardEvent, currentId: string) => void
}) {
  const angleStep = 360 / serviceLines.length
  const radius = 38
  const activeVisual = SERVICE_VISUALS[activeId] ?? DEFAULT_VISUAL

  return (
    <div
      className="relative aspect-square max-w-[340px] lg:max-w-[420px] xl:max-w-[480px] mx-auto"
      role="radiogroup"
      aria-label="Linhas de serviço"
    >
      <div className="absolute inset-[6%] rounded-full border border-white/[0.05]" />
      <div className="absolute inset-[18%] rounded-full border border-white/[0.07] bg-white/[0.015]" />
      <div className="absolute inset-[32%] rounded-full border border-white/10 bg-foursys-surface/40 shadow-[0_0_60px_rgba(0,0,0,0.35)]" />

      <div
        className="absolute inset-[35%] rounded-full bg-[#23243D] border border-white/10 flex items-center justify-center transition-all duration-500"
        style={{ boxShadow: `0 0 40px ${activeVisual.glow}15, inset 0 0 30px rgba(0,0,0,0.3)` }}
      >
        <div className="text-center px-2">
          <div className="text-lg md:text-xl lg:text-2xl font-black text-white leading-none">foursys</div>
          <div className="text-[7px] md:text-[8px] uppercase tracking-[0.28em] text-foursys-text-dim mt-1">
            serviços & ofertas
          </div>
        </div>
      </div>

      {serviceLines.map((service, index) => {
        const Icon = SERVICE_ICONS[service.id] ?? Layers3
        const visual = SERVICE_VISUALS[service.id] ?? DEFAULT_VISUAL
        const angleDeg = -90 + index * angleStep
        const angleRad = (angleDeg * Math.PI) / 180
        const x = 50 + radius * Math.cos(angleRad)
        const y = 50 + radius * Math.sin(angleRad)
        const isActive = activeId === service.id
        const labelPos = getLabelPosition(angleDeg)

        return (
          <button
            key={service.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={service.title}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(service.id)}
            onKeyDown={e => onKeyNav(e, service.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-foursys-primary rounded-full z-10"
            style={{ top: `${y}%`, left: `${x}%` }}
          >
            <span
              className={`w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full border flex items-center justify-center transition-all duration-300 ${visual.softBg} ${visual.border}`}
              style={{
                boxShadow: isActive
                  ? `0 0 0 5px ${visual.glow}30, 0 0 24px ${visual.glow}70`
                  : `0 0 10px ${visual.glow}30`,
                transform: isActive ? 'scale(1.18)' : 'scale(1)',
              }}
            >
              <Icon size={16} className={visual.text} />
            </span>
            <span
              className={`absolute max-w-[100px] lg:max-w-[110px] text-[9px] lg:text-[10px] xl:text-[11px] font-bold leading-tight pointer-events-none text-white/90 ${labelPos}`}
            >
              {service.title}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ── ServiceDetailPanel (shared: side panel + bottom sheet) ──────────────────── */

function ServiceDetailPanel({
  service,
  onOfferDetail,
  compact,
}: {
  service: ServiceLine
  onOfferDetail: (id: string) => void
  compact?: boolean
}) {
  const visual = SERVICE_VISUALS[service.id] ?? DEFAULT_VISUAL
  const Icon = SERVICE_ICONS[service.id] ?? Layers3

  return (
    <>
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${visual.softBg}`}
          style={{ boxShadow: `0 0 16px ${visual.glow}25` }}
        >
          <Icon size={18} className={visual.text} />
        </div>
        <div className="min-w-0">
          <h3 className={`${compact ? 'text-lg' : 'text-lg lg:text-xl'} font-black text-white leading-tight`}>
            {service.title}
          </h3>
          <p className={`text-xs font-semibold mt-0.5 transition-colors duration-300 ${visual.text}`}>
            {service.subtitle}
          </p>
        </div>
      </div>

      <p className="text-foursys-text-muted text-sm leading-relaxed">
        {service.problem}
      </p>

      <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-2">
          Onde gera valor
        </p>
        <p className="text-xs text-foursys-text-muted leading-relaxed mb-3">
          {service.target}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {service.tags.map(tag => (
            <span
              key={tag}
              className={`px-2 py-0.5 rounded-full text-[10px] border transition-colors duration-300 bg-white/[0.02] ${visual.border} ${visual.text}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {service.offerDetail && (
        <button
          type="button"
          onClick={() => onOfferDetail(service.id)}
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-foursys-primary hover:text-foursys-cyan transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foursys-primary rounded"
        >
          Detalhes da Oferta <ArrowRight size={16} />
        </button>
      )}
    </>
  )
}

/* ── MobileBottomSheet ───────────────────────────────────────────────────────── */

function MobileBottomSheet({
  service,
  onClose,
  onOfferDetail,
}: {
  service: ServiceLine
  onClose: () => void
  onOfferDetail: (id: string) => void
}) {
  const visual = SERVICE_VISUALS[service.id] ?? DEFAULT_VISUAL
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    sheetRef.current?.focus()
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        ref={sheetRef}
        tabIndex={-1}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-t-[24px] border-t p-5 pb-[max(2rem,env(safe-area-inset-bottom))] max-h-[85vh] overflow-y-auto overscroll-contain outline-none"
        style={{
          borderColor: `${visual.glow}35`,
          background: `linear-gradient(180deg, ${visual.glow}12 0%, #1a1b2e 15%, #14152a 100%)`,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={service.title}
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foursys-primary"
          aria-label="Fechar"
        >
          <X size={16} className="text-white/70" />
        </button>

        <ServiceDetailPanel service={service} onOfferDetail={onOfferDetail} compact />
      </motion.div>
    </motion.div>
  )
}

/* ── OfferDetailModal ──────────────────────────────────────────────────────── */

function OfferDetailModal({
  service,
  onClose,
}: {
  service: ServiceLine
  onClose: () => void
}) {
  const visual = SERVICE_VISUALS[service.id] ?? DEFAULT_VISUAL
  const Icon = SERVICE_ICONS[service.id] ?? Layers3
  const detail = service.offerDetail!
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    modalRef.current?.focus()
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <motion.div
        ref={modalRef}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-[20px] border overflow-y-auto overscroll-contain max-h-[90vh] outline-none"
        style={{
          borderColor: `${visual.glow}30`,
          background: `linear-gradient(160deg, ${visual.glow}10 0%, #1a1b2e 18%, #14152a 100%)`,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes da oferta: ${service.title}`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foursys-primary z-10"
          aria-label="Fechar"
        >
          <X size={18} className="text-white/70" />
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${visual.softBg}`}
              style={{ boxShadow: `0 0 20px ${visual.glow}30` }}
            >
              <Icon size={22} className={visual.text} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                {service.title}
              </h3>
              <p className={`text-xs font-semibold mt-0.5 ${visual.text}`}>
                Detalhes da Oferta
              </p>
            </div>
          </div>

          {/* Value Proposition */}
          <div
            className="rounded-xl border p-4 md:p-5 mb-5"
            style={{
              borderColor: `${visual.glow}20`,
              background: `linear-gradient(135deg, ${visual.glow}08 0%, transparent 60%)`,
            }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-2">
              Proposta de Valor
            </p>
            <p className="text-sm md:text-base text-white/90 leading-relaxed font-medium">
              {detail.valueProposition}
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-3 mb-5">
            {detail.metrics.map(metric => (
              <div
                key={metric.label}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 md:p-4 text-center"
              >
                <div
                  className="text-2xl md:text-3xl font-black leading-none mb-1"
                  style={{ color: visual.glow }}
                >
                  {metric.value}
                </div>
                <div className="text-[9px] md:text-[10px] text-foursys-text-muted uppercase tracking-wider font-semibold leading-tight">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Differentials */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
              Diferenciais
            </p>
            <ul className="space-y-2.5">
              {detail.differentials.map((diff, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: visual.glow }}
                  />
                  <span className="text-sm text-foursys-text-muted leading-relaxed">
                    {diff}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Deep-dive content for specific service lines ────────────────────────────── */

const DEEP_DIVE_IDS = ['modernizacao-legados', 'ciberseguranca', 'fourblox', 'ai-augmented-squad', 'quality-testes-ia'] as const

/* ── Modernização de Legados Deep Dive ────────────────────────────────────── */

const modMethodSteps = [
  { icon: 'clipboard-list', title: 'Assessment & Inventário', desc: 'Varredura de código, identificação de regras de negócio e geração de documentação base com 4AI.' },
  { icon: 'layout', title: 'Setup Arquitetura Target', desc: 'SPEC de Engenharia e Arquitetura (Front + Back), definições de DevOps, infra e cloud, padrões de design e componentes.' },
  { icon: 'code', title: 'Construir & Testar', desc: 'Codificação acelerada com SPEC padrão, testes unitários, DataForge para massa de dados, testes funcionais e não-funcionais.' },
  { icon: 'shield-check', title: 'QA & Certificação', desc: 'IA CodeCompare, matriz de rastreabilidade, testes de carga, performance, segurança e SonarQube.' },
  { icon: 'check-circle', title: 'Homologação', desc: 'Critérios de aceite pré-definidos, certificação do caminho crítico e monitoramento de métricas.' },
  { icon: 'rocket', title: 'Produção & Hyper Care', desc: 'Deploy, Hyper Care + sustentação com ciclos de release escaláveis de 6 semanas.' },
]

const modAccelerators = [
  { title: 'Extrator de Regras', icon: 'scan', desc: 'Varredura de código identificando regras de negócio e gerando documentação base — COBOL, VB6, .NET, Java (Spring, Struts, SpringBoot), Angular, React e Vue.' },
  { title: 'Conversor de Código', icon: 'shuffle', desc: 'Conversão via acelerador de VB6 para .NET Core ou Java Spring Boot (backend) e Angular ou React (frontend), com documentação integrada à esteira DevOps.' },
  { title: 'Certificação', icon: 'badge-check', desc: 'Geração de testes unitários e cenários de testes funcionais (Gherkin) a partir dos pontos de alteração, garantindo pleno funcionamento após a transformação.' },
]

const modContractModels = [
  {
    title: 'Essencial',
    items: ['Assessment e Inventário', 'Setup da Arquitetura Target', 'Modernização do Sistema', 'Testes Unitários e Integrados', 'Testes Regressivos e Certificação'],
  },
  {
    title: 'Estratégica',
    items: ['Assessment e Inventário', 'Setup da Arquitetura Target', 'Re-Design e UX da Aplicação', 'Migração de Banco de Dados', 'DevOps', 'Modernização do Sistema', 'Testes Unitários e Integrados', 'Testes Regressivos e Certificação'],
  },
  {
    title: 'Evolução',
    items: ['Assessment e Inventário', 'Setup da Arquitetura Target', 'Re-Design da Aplicação', 'Migração de Banco de Dados', 'DevOps', 'Modernização do Sistema', 'Testes Unitários e Integrados', 'Cyber Security e Performance', 'Testes Regressivos e Certificação', 'Homologação e Convivência', 'Monitoramento'],
  },
]

const modCases = [
  { title: 'Instituição Financeira (EUA)', result: 'Migração de monolito para microserviços Python, DevOps, conteinerização e orquestração — maior escalabilidade, integração via APIs e redução no tempo de execução.', metrics: [{ v: '+4M', l: 'Linhas de código' }, { v: '12', l: 'Meses de projeto' }] },
  { title: 'Seguradora', result: 'Migração de mainframe COBOL e Visual Age para .NET e React com IA para transpiração de código — redução de custo de infraestrutura e adição de funcionalidades estratégicas.', metrics: [{ v: '+2M', l: 'Linhas de código' }, { v: '20%', l: 'Aumento de negócios' }] },
  { title: 'Risk Score (Global)', result: 'Retirada do AS400 para Java com IA e migração para Cloud EUA — produto se tornou global, instalação reduziu de 12 para 3 meses.', metrics: [{ v: '+2Bi', l: 'Novos negócios no 1o ano' }, { v: '600K', l: 'Linhas de código' }] },
]

const modImpacts = [
  'Redução de custos operacionais e facilidade de manutenção',
  'Ampliação da capacidade de inovação',
  'Melhor experiência do cliente',
  'Melhora de desempenho e escalabilidade',
  'Aumento na segurança e confiabilidade',
  'Redução na complexidade dos projetos',
  'Redução de falhas em integrações sistêmicas',
  'Impulso no movimento "Move to Cloud"',
]

function ModernizacaoDeepDive() {
  return (
    <div className="space-y-7">
      {/* Proposta de valor */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-violet-500/15 to-transparent border border-violet-500/25">
        <p className="text-xs text-foursys-text-muted leading-relaxed">
          <strong className="text-foursys-text">Proposta de Valor:</strong> A Foursys oferece a única solução de modernização de legados que combina transformação tecnológica, segurança avançada e capacitação humana em uma abordagem integrada — garantindo que seus sistemas não apenas funcionem melhor hoje, mas sejam a base para a inovação de amanhã.
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: '+30%', label: 'Redução de Custos', color: 'text-green-400' },
          { value: '+70%', label: 'Aceleração Time to Mkt', color: 'text-cyan-400' },
          { value: '+60%', label: 'Segurança de Código', color: 'text-violet-400' },
        ].map(m => (
          <div key={m.label} className="text-center p-3 rounded-xl bg-foursys-surface/50 border border-white/10">
            <div className={`text-xl font-black ${m.color}`}>{m.value}</div>
            <div className="text-[10px] text-foursys-text-dim mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Aceleradores 4AI */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Aceleradores 4AI
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {modAccelerators.map(a => (
            <div key={a.title} className="p-4 rounded-xl bg-violet-500/8 border border-violet-500/20">
              <div className="flex items-center gap-2 mb-2">
                <DynIcon name={a.icon} size={16} className="text-violet-400" />
                <span className="text-xs font-bold text-violet-300">{a.title}</span>
              </div>
              <p className="text-[10px] text-foursys-text-dim leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Metodologia passo a passo */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Metodologia — Ciclos de 6 semanas com automação IA + supervisão humana (50/50)
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {modMethodSteps.map((step, i) => (
            <div key={step.title} className="p-4 rounded-xl bg-foursys-surface/50 border border-white/10 relative">
              <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-violet-500/30 border border-violet-500/50 flex items-center justify-center text-[9px] font-bold text-violet-300">
                {i + 1}
              </div>
              <div className="mb-2">
                <DynIcon name={step.icon} size={18} className="text-white/80" />
              </div>
              <div className="font-semibold text-foursys-text text-xs mb-1">{step.title}</div>
              <p className="text-[10px] text-foursys-text-dim leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modelos de Contratação */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Modelos de Contratação
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {modContractModels.map((model, idx) => (
            <div key={model.title} className={`p-4 rounded-xl border ${idx === 2 ? 'bg-violet-500/12 border-violet-500/30' : 'bg-foursys-surface/50 border-white/10'}`}>
              <div className={`text-xs font-bold mb-3 ${idx === 2 ? 'text-violet-300' : 'text-foursys-text'}`}>
                {model.title}
              </div>
              <ul className="space-y-1.5">
                {model.items.map(item => (
                  <li key={item} className="text-[10px] text-foursys-text-dim flex items-start gap-1.5">
                    <span className="text-violet-400 mt-0.5 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Cases */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Cases e Resultados Comprovados
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {modCases.map(c => (
            <div key={c.title} className="p-4 rounded-xl bg-foursys-surface/50 border border-white/10">
              <div className="text-xs font-bold text-foursys-text mb-2">{c.title}</div>
              <p className="text-[10px] text-foursys-text-dim leading-relaxed mb-3">{c.result}</p>
              <div className="flex gap-3">
                {c.metrics.map(m => (
                  <div key={m.l} className="text-center">
                    <div className="text-sm font-black text-violet-400">{m.v}</div>
                    <div className="text-[9px] text-foursys-text-dim">{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impacto Esperado */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Impacto Esperado
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {modImpacts.map(impact => (
            <div key={impact} className="p-3 rounded-xl bg-green-500/8 border border-green-500/20 flex items-start gap-2">
              <DynIcon name="check-circle" size={12} className="text-green-400 shrink-0 mt-0.5" />
              <span className="text-[10px] text-foursys-text-dim leading-relaxed">{impact}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Próximos Passos */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/15 to-transparent border border-violet-500/25">
        <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-3">
          Próximos Passos em 3 Etapas
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { n: '1', title: 'POT / POC', desc: 'Mapeamos uma amostra do legado e geramos documentação e aplicação em stack target com padrões Clean Code.' },
            { n: '2', title: 'Negociação', desc: 'Definição conjunta do modelo, proposta com escopo, roadmap, estratégia, responsabilidades e investimento.' },
            { n: '3', title: 'Contratação', desc: 'Assinatura contratual, kick-off para alinhar expectativas, apresentar equipe e início formal das atividades.' },
          ].map(s => (
            <div key={s.n} className="text-center">
              <div className="w-7 h-7 rounded-full bg-violet-500/30 border border-violet-500/50 flex items-center justify-center text-xs font-bold text-violet-300 mx-auto mb-2">{s.n}</div>
              <div className="text-xs font-bold text-foursys-text mb-1">{s.title}</div>
              <p className="text-[10px] text-foursys-text-dim leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Sec4Sys (vertical Foursys de cibersegurança) ────────────────────────────

const sec4sysModels = [
  {
    id: 'consulting',
    title: 'Consulting & Assessment',
    icon: 'clipboard-list',
    color: '#EF4444',
    desc: 'Consultoria e Assessment estratégicos para organizações que desejam fortalecer a gestão de riscos corporativos e cibersegurança, promovendo resiliência e alinhamento às melhores práticas.',
    items: [
      'Score/Assessment de Maturidade (NIST)',
      'Score/Assessment de Arquitetura Segura',
      'Score de Desenvolvimento Seguro — SDLC',
      'Score de Privacidade/LGPD',
      'Assessment de Ransomware',
      'PDSI / Políticas / Risk Assessment',
      'Third Party Risk Management Score',
      'Cultura e conscientização de riscos',
    ],
  },
  {
    id: 'secaas',
    title: 'SECaaS',
    icon: 'cloud',
    color: '#F97316',
    desc: 'Soluções de segurança cibernética sob demanda por meio de assinaturas ou contratos personalizados — escaláveis, flexíveis e econômicas.',
    items: [
      'AppSec / SDLC',
      'Pentesting / Ethical Hacking (EHT)',
      'Pentest de Fraude (Bypass Tests)',
      'Gestão de Vulnerabilidades',
      'Operações (DLP, WAF, Antispam, etc.)',
      'SOC e Resposta a Incidentes',
      'Gestão de Acesso e Identidade (GIA)',
      'Arquitetura e requisitos de segurança',
      'DevSecOps',
      'Segurança de Redes',
      'Campanhas de phishing',
      'Continuidade de negócios / Gestão de Crises',
      'Governança, Riscos e Compliance (GRC)',
    ],
  },
]

const sec4sysPortfolio = [
  {
    id: 'seguranca-informacao',
    title: 'Segurança da Informação',
    icon: 'shield-check',
    color: '#EF4444',
    items: [
      'Apoio e qualificação para ISO 27001 e ISO 27701',
      'AppSec (SDLC)',
      'Arquitetura de referência de SI',
      'Assessment de Ransomware',
      'Assessment e apoio evolução maturidade Seguro Cyber',
      'Assessment Score de arquitetura segura',
      'Assessment Score de desenvolvimento seguro — SDLC',
      'Assessment Score de maturidade de SI',
      'BISO As A Service (Segurança nos Negócios)',
      'Campanhas de phishing',
      'CISO As A Service (PDSI, Consulting...)',
      'Framework de desenvolvimento seguro — DevSecOps',
      'Gestão de identidade de acesso (IAM)',
      'Gestão de vulnerabilidade e scanning',
      'Implementação e Suporte de Ferramentas de Segurança',
      'Operações (DLP, WAF, Antispam, AM, AV...)',
      'Pentesting / Ethical Hacking (EHT)',
      'Plano Diretor de Segurança da Informação (PDSI)',
      'Políticas e procedimentos de Segurança da Informação',
      'Programas e treinamentos de conscientização para cibersegurança',
      'Red Team as a Service',
      'Score de ferramentas de SI',
      'Security Champions',
      'Segurança de redes e em nuvem',
      'SOC / Resposta a incidentes / Blue team',
      'Threat Intelligence',
      'VIP Protection',
    ],
  },
  {
    id: 'continuidade-negocios',
    title: 'Continuidade de Negócios e Gestão de Crises',
    icon: 'life-buoy',
    color: '#8B5CF6',
    items: [
      'Elaboração e Análise de Impacto nos Negócios (BIA)',
      'Plano de Continuidade de Negócios (PCN)',
      'Plano de Disaster Recovery (DR)',
      'Planos de Ação e Resposta a Incidentes (PARI)',
      'Playbook de Gestão de Crises',
      'Programas e treinamentos de conscientização para Gestão de Crises',
      'Simulações e exercícios de crise',
      'Suporte a Gestão de Crises',
    ],
  },
  {
    id: 'riscos-corporativos',
    title: 'Riscos Corporativos',
    icon: 'alert-triangle',
    color: '#F59E0B',
    items: [
      'Avaliação de Controles Internos e Testes de Efetividade',
      'Dashboard de apetite e indicadores de riscos',
      'Governança, Riscos e Compliance (GRC)',
      'Políticas e governança de Riscos Corporativos',
      'Programa de Cultura de Riscos',
      'Programa de Prevenção de Lavagem de Dinheiro (PLD)',
    ],
  },
  {
    id: 'prevencao-fraudes',
    title: 'Prevenção de Fraudes',
    icon: 'scan-eye',
    color: '#EC4899',
    items: [
      'Assessment / Score Maturidade de Fraudes',
      'Desenvolvimento de Arquitetura e camadas Antifraude',
      'Fraud Prevention as a Service',
      'Pentesting de burla de biometria',
      'Soluções e ferramentas antifraude',
    ],
  },
  {
    id: 'privacidade-dados',
    title: 'Privacidade de Dados',
    icon: 'lock',
    color: '#06B6D4',
    items: [
      'Assessment Score de Proteção e privacidade (LGPD)',
      'Políticas e procedimentos de Proteção e privacidade de Dados (LGPD)',
      'Programa de Proteção e privacidade de Dados (LGPD)',
    ],
  },
  {
    id: 'tprm',
    title: 'Gestão de Risco de Terceiros (TPRM)',
    icon: 'users',
    color: '#10B981',
    items: [
      'Assessment de Score 3rd party (TPRM)',
      'Políticas e procedimentos para Riscos de Terceiros',
      'Programa de Gestão de Risco de Terceiros',
    ],
  },
]

const sec4sysPillars = [
  { label: 'Confidencialidade', icon: 'lock' },
  { label: 'Integridade', icon: 'check-circle' },
  { label: 'Disponibilidade', icon: 'server' },
  { label: 'Resiliência', icon: 'shield' },
  { label: 'Estabilidade', icon: 'activity' },
  { label: 'Privacidade', icon: 'eye-off' },
]

/* ── FourBlox Deep Dive ──────────────────────────────────────────────────── */

const fbProblems = [
  'Sistemas que não conversam entre si',
  'Planilhas paralelas fora de controle',
  'Baixa adoção de ferramentas',
  'Projetos que nunca terminam',
  'Alto investimento sem retorno claro',
  'Soluções genéricas que não atendem à realidade',
]

const fbSolutionSteps = [
  'Diagnóstico estruturado',
  'Desenho personalizado da solução',
  'Configuração sob medida',
  'Produção em até 30 dias',
  'Evolução contínua baseada em dados',
]

const fbHowItWorks = [
  { n: '01', icon: 'search', title: 'Diagnóstico Profundo', desc: 'Mapeamento de dores, usuários, fluxos e necessidades reais.' },
  { n: '02', icon: 'brain', title: 'Arquitetura da Solução', desc: 'Definição dos blocos (módulos) necessários para resolver o problema.' },
  { n: '03', icon: 'settings', title: 'Configuração Personalizada', desc: 'Customização inteligente dentro da plataforma modular.' },
  { n: '04', icon: 'rocket', title: 'Go Live em até 30 dias', desc: 'Entrega em produção com acompanhamento e ajustes finos.' },
]

const fbDifferentials = [
  { icon: 'clock', title: 'Produção em 30 dias', desc: 'Sem projetos de 6 a 12 meses.' },
  { icon: 'file-text', title: 'Modelo por Assinatura', desc: 'Previsibilidade financeira.' },
  { icon: 'puzzle', title: 'Modularidade Inteligente', desc: 'Você ativa apenas o que gera valor.' },
  { icon: 'users', title: 'UX Centrada no Usuário', desc: 'Adoção real, não imposição.' },
  { icon: 'trending-up', title: 'Evolução Contínua', desc: 'A solução cresce com sua empresa.' },
]

const fbBenefits = [
  { icon: 'bar-chart-2', label: 'Redução de retrabalho' },
  { icon: 'zap', label: 'Aumento de eficiência operacional' },
  { icon: 'eye', label: 'Melhor visibilidade gerencial' },
  { icon: 'database', label: 'Dados estruturados para decisão' },
  { icon: 'shield', label: 'Menor risco de investimento' },
  { icon: 'target', label: 'Time-to-value acelerado' },
]

const fbSolutions = [
  { cat: 'Gestão de Pessoas', items: ['Mapa de Alocação Inteligente', 'Performance & OKR Tracker', 'Banco de Talentos Estratégico'] },
  { cat: 'Operações', items: ['Controle de Demandas & SLA', 'Workflow Personalizado', 'Checkin de Audiências', 'Gestão de Eventos'] },
  { cat: 'Financeiro', items: ['Gestão de Orçamento por Área', 'Forecast Inteligente', 'Cartão de Crédito Consignado', 'Gestão Orçamentária'] },
  { cat: 'Comercial', items: ['Pipeline & Performance Comercial', 'Gestão de Comissões', 'Prospecção e Retenção PMEs', 'CRM', 'SDR'] },
  { cat: 'Projetos', items: ['Gestão de Portfólio de Projetos'] },
  { cat: 'ESG', items: ['Monitor de Indicadores ESG'] },
  { cat: 'Dados & Analytics', items: ['Data Hub Executivo'] },
  { cat: 'Governança', items: ['Gestão de Guarda Compartilhada'] },
]

const fbKits = [
  { title: 'Kit Eficiência Operacional', items: ['Controle de Demandas & SLA', 'Workflow Personalizado', 'Data Hub Executivo'] },
  { title: 'Kit Gestão de Pessoas 360°', items: ['Mapa de Alocação Inteligente', 'Performance & OKR Tracker', 'Banco de Talentos Estratégico'] },
  { title: 'Kit Performance Comercial', items: ['Forecast Inteligente', 'Pipeline & Performance Comercial', 'Gestão de Comissões'] },
  { title: 'Kit Governança Executiva', items: ['Gestão de Portfólio de Projetos', 'Monitor de Indicadores ESG', 'Data Hub Executivo'] },
]

function FourBloxDeepDive() {
  return (
    <div className="space-y-7">
      {/* Proposta de valor */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-transparent border border-emerald-500/25">
        <p className="text-xs text-foursys-text-muted leading-relaxed">
          <strong className="text-foursys-text">Proposta de Valor:</strong> Chega de projetos intermináveis. O FourBlox é uma plataforma modular de soluções por assinatura que entrega sua solução digital pronta em 30 dias — personalizada, modular e com evolução contínua.
        </p>
      </div>

      {/* O Problema */}
      <div>
        <div className="text-center mb-3">
          <span className="text-sm font-bold text-foursys-text">O </span>
          <span className="text-sm font-bold text-orange-400">Problema</span>
        </div>
        <p className="text-[10px] text-foursys-text-dim text-center mb-3">A maioria das empresas enfrenta pelo menos um destes cenários:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {fbProblems.map(p => (
            <div key={p} className="p-3 rounded-xl bg-foursys-surface/50 border border-white/10 flex items-start gap-2">
              <DynIcon name="alert-triangle" size={12} className="text-orange-400 shrink-0 mt-0.5" />
              <span className="text-[10px] text-foursys-text-dim">{p}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-center mt-3">
          <span className="font-bold text-foursys-text">O problema não é tecnologia.</span>{' '}
          <span className="font-bold text-orange-400">É falta de personalização com método.</span>
        </p>
      </div>

      {/* A Solução */}
      <div>
        <div className="text-center mb-3">
          <span className="text-sm font-bold text-foursys-text">A Solução: </span>
          <span className="text-sm font-bold text-orange-400">FourBlox</span>
        </div>
        <p className="text-[10px] text-foursys-text-dim text-center mb-3">Uma plataforma modular de soluções por assinatura que entrega:</p>
        <div className="space-y-2">
          {fbSolutionSteps.map(s => (
            <div key={s} className="p-3 rounded-xl bg-foursys-surface/50 border border-white/10 flex items-center gap-3">
              <DynIcon name="check-circle" size={14} className="text-orange-400 shrink-0" />
              <span className="text-xs font-semibold text-foursys-text">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Como Funciona — 4 etapas */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Como Funciona — Modelo em 4 etapas
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fbHowItWorks.map(step => (
            <div key={step.n} className="p-4 rounded-xl bg-foursys-surface/50 border border-white/10 text-center relative">
              <div className="absolute top-2 right-2 text-lg font-black text-white/10">{step.n}</div>
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-2">
                <DynIcon name={step.icon} size={18} className="text-orange-400" />
              </div>
              <div className="font-bold text-foursys-text text-xs mb-1">{step.title}</div>
              <p className="text-[9px] text-foursys-text-dim leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Catálogo de Soluções */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Biblioteca de Soluções — +18 soluções em 9 categorias
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {fbSolutions.map(cat => (
            <div key={cat.cat} className="p-3 rounded-xl bg-foursys-surface/50 border border-white/10">
              <div className="text-[10px] font-bold text-emerald-400 mb-2">{cat.cat}</div>
              <ul className="space-y-1">
                {cat.items.map(item => (
                  <li key={item} className="text-[9px] text-foursys-text-dim flex items-start gap-1">
                    <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Kits Estratégicos */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Combinações Estratégicas — Kits pré-configurados
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fbKits.map(kit => (
            <div key={kit.title} className="p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
              <div className="text-[10px] font-bold text-emerald-300 mb-2">{kit.title}</div>
              <ul className="space-y-1">
                {kit.items.map(item => (
                  <li key={item} className="text-[9px] text-foursys-text-dim flex items-start gap-1">
                    <DynIcon name="check" size={10} className="text-emerald-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Diferenciais */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Diferenciais
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {fbDifferentials.map(d => (
            <div key={d.title} className="p-3 rounded-xl bg-foursys-surface/50 border border-white/10">
              <DynIcon name={d.icon} size={16} className="text-orange-400 mb-2" />
              <div className="text-[11px] font-bold text-foursys-text mb-0.5">{d.title}</div>
              <p className="text-[9px] text-foursys-text-dim">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefícios para o Negócio */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Benefícios para o Negócio
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {fbBenefits.map(b => (
            <div key={b.label} className="p-3 rounded-xl bg-foursys-surface/50 border border-white/10 flex items-center gap-2">
              <DynIcon name={b.icon} size={14} className="text-emerald-400 shrink-0" />
              <span className="text-[10px] font-semibold text-foursys-text">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 to-transparent border border-emerald-500/25">
        <p className="text-xs text-foursys-text-muted text-center flex flex-wrap items-start justify-center gap-1.5">
          <DynIcon name="zap" size={14} className="text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-foursys-text">Pronto para ativar?</strong> Fale com nosso time e coloque em produção em até 30 dias. Personalizado, por assinatura e modular.
          </span>
        </p>
      </div>
    </div>
  )
}

function Sec4SysDeepDive() {
  const [expandedPortfolio, setExpandedPortfolio] = useState<string | null>(null)
  const [expandedModel, setExpandedModel] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      {/* Sec4Sys Hero */}
      <div className="rounded-xl border border-red-500/25 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-red-600/15 via-orange-500/10 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <Shield size={20} className="text-red-400" />
            </div>
            <div>
              <h4 className="text-base font-black text-white tracking-wide">Sec4Sys</h4>
              <p className="text-[10px] text-red-400 font-semibold uppercase tracking-[0.15em]">
                Vertical Foursys de Cibersegurança
              </p>
            </div>
          </div>
          <p className="text-xs text-foursys-text-muted leading-relaxed">
            A Sec4Sys é uma vertical de negócios Foursys especializada em riscos corporativos e cibersegurança,
            auxiliando clientes na definição de estratégia, detecção de ameaças, proteção de dados e mitigação de riscos.
          </p>
        </div>

        {/* Pilares */}
        <div className="px-5 py-3 bg-white/[0.02] border-t border-red-500/15">
          <div className="flex flex-wrap gap-2 justify-center">
            {sec4sysPillars.map(p => (
              <div
                key={p.label}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20"
              >
                <DynIcon name={p.icon} size={11} className="text-red-400" />
                <span className="text-[10px] text-red-300 font-medium">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modelos de Negócio */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Modelos de Negócio
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {sec4sysModels.map(model => {
            const isOpen = expandedModel === model.id
            return (
              <div key={model.id} className="rounded-xl border border-white/10 bg-foursys-surface/40 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedModel(isOpen ? null : model.id)}
                  className="w-full p-4 flex items-start gap-3 text-left transition-colors hover:bg-white/[0.03] active:scale-[0.99] min-h-[44px]"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${model.color}20`, border: `1px solid ${model.color}35` }}
                  >
                    <DynIcon name={model.icon} size={16} style={{ color: model.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="text-sm font-bold text-white">{model.title}</h5>
                      <DynIcon
                        name={isOpen ? 'chevron-up' : 'chevron-down'}
                        size={14}
                        className="text-white/30 flex-shrink-0"
                      />
                    </div>
                    <p className="text-[10px] text-foursys-text-dim leading-relaxed mt-1">{model.desc}</p>
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <ul className="space-y-1.5">
                        {model.items.map(item => (
                          <li key={item} className="flex items-start gap-2 text-[11px] text-foursys-text-muted">
                            <CheckCircle2 size={12} className="flex-shrink-0 mt-0.5" style={{ color: model.color }} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Portfólio Completo */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Portfólio Sec4Sys
        </div>
        <div className="space-y-2">
          {sec4sysPortfolio.map(area => {
            const isOpen = expandedPortfolio === area.id
            return (
              <div
                key={area.id}
                className="rounded-xl border overflow-hidden transition-colors duration-200"
                style={{
                  borderColor: isOpen ? `${area.color}40` : 'rgba(255,255,255,0.08)',
                  background: isOpen
                    ? `linear-gradient(135deg, ${area.color}08 0%, transparent 60%)`
                    : 'rgba(255,255,255,0.02)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedPortfolio(isOpen ? null : area.id)}
                  className="w-full px-4 py-3.5 flex items-center gap-3 text-left transition-colors hover:bg-white/[0.03] active:scale-[0.99] min-h-[44px]"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${area.color}18`, border: `1px solid ${area.color}30` }}
                  >
                    <DynIcon name={area.icon} size={15} style={{ color: area.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white">{area.title}</h5>
                    <p className="text-[10px] text-foursys-text-dim mt-0.5">
                      {area.items.length} serviços disponíveis
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${area.color}18`, color: area.color }}
                    >
                      {area.items.length}
                    </span>
                    <DynIcon
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={14}
                      className="text-white/30"
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4">
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                      <div className={`grid ${area.items.length > 8 ? 'md:grid-cols-2' : 'grid-cols-1'} gap-1.5`}>
                        {area.items.map(item => (
                          <div
                            key={item}
                            className="flex items-start gap-2 text-[11px] text-foursys-text-muted py-1 px-2 rounded-md hover:bg-white/[0.03] transition-colors"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
                              style={{ background: area.color }}
                            />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA Sec4Sys */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/12 via-orange-500/8 to-transparent border border-red-500/20">
        <div className="flex items-center gap-3">
          <Zap size={18} className="text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-foursys-text-muted leading-relaxed">
              <strong className="text-white">Sec4Sys — Foursys Group.</strong>{' '}
              Soluções e apoio para estabelecer ou ampliar a maturidade em cibersegurança, prevenção à fraudes,
              privacidade de dados, continuidade de negócios e gestão de riscos de terceiros.
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <a
            href="https://www.sec4sys.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-400 hover:text-red-300 transition-colors"
          >
            Visitar sec4sys.com.br
            <DynIcon name="external-link" size={12} />
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── AI Squad Deep Dive ─────────────────────────────────────────── */

const sddPhases = [
  { icon: 'search', title: 'Discovery', desc: 'Análise de contexto, mapeamento de stack e domínio, definição de agentes especializados.' },
  { icon: 'palette', title: 'Design', desc: 'Diagramas C4, ADRs, user stories, especificações de API e arquitetura de referência.' },
  { icon: 'code', title: 'Desenvolvimento', desc: 'Codificação acelerada por agentes treinados na stack e regras de negócio do cliente.' },
  { icon: 'check-circle', title: 'Qualidade', desc: 'Testes automatizados por IA, análise de cobertura e validação de aceitação.' },
  { icon: 'rocket', title: 'Deploy', desc: 'CI/CD integrado, rollout seguro e monitoramento pós-deploy com observabilidade.' },
]

const squadDeliverables = [
  { icon: 'users', title: 'Squad Operacional', desc: 'PO, AI Engineer, Desenvolvedores e QA amplificados por 20+ agentes.', color: '#FF6600' },
  { icon: 'book-open', title: 'Documentação Completa', desc: 'Diagramas C4, ADRs, user stories, specs de API e testes.', color: '#8B5CF6' },
  { icon: 'bar-chart', title: 'Dashboards em Tempo Real', desc: 'Velocidade, burndown, custos, taxa de aceitação de IA, qualidade de código.', color: '#00C2E0' },
  { icon: 'brain', title: 'Agentes Customizados', desc: 'Treinados na stack, domínio e regras de negócio do cliente. Não genéricos.', color: '#4ADE80' },
  { icon: 'unlock', title: 'Autonomia do Cliente', desc: 'Total domínio sobre o código. Aberto para evolução. Sem lock-in.', color: '#F59E0B' },
]


function AISquadDeepDive() {
  return (
    <div className="space-y-6">
      {/* AI Squad (solução) */}
      <div className="p-5 rounded-xl bg-orange-500/10 border border-orange-500/25">
        <div className="text-sm font-bold text-orange-400 mb-2.5">AI Squad (solução)</div>
        <ul className="space-y-1.5 text-xs text-foursys-text-muted">
          <li>• Times humanos + 20+ agentes IA especializados</li>
          <li>• Framework SDD com agentes por fase do ciclo</li>
          <li>• Documentação automática e completa</li>
          <li>• Dashboards de performance em tempo real</li>
          <li>• Agentes treinados na stack e domínio do cliente</li>
          <li>• Código aberto, sem lock-in</li>
          <li>• Dois modelos: ambiente cliente ou Foursys</li>
        </ul>
      </div>

      {/* Framework SDD */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Framework SDD — Fases do Processo
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {sddPhases.map((phase, i) => (
            <div key={phase.title} className="p-4 rounded-xl bg-foursys-surface/50 border border-orange-500/15 relative">
              <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-orange-500/30 border border-orange-500/50 flex items-center justify-center text-[9px] font-bold text-orange-300">
                {i + 1}
              </div>
              <div className="mb-2">
                <DynIcon name={phase.icon} size={18} className="text-orange-300" />
              </div>
              <div className="font-semibold text-foursys-text text-xs mb-1">{phase.title}</div>
              <p className="text-[10px] text-foursys-text-dim leading-relaxed">{phase.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Entregáveis */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          O que você recebe
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {squadDeliverables.map(d => (
            <div key={d.title} className="p-3.5 rounded-xl bg-foursys-surface/40 border border-white/10">
              <div className="mb-1.5">
                <DynIcon name={d.icon} size={16} style={{ color: d.color }} />
              </div>
              <div className="font-bold text-xs text-white mb-0.5">{d.title}</div>
              <div className="text-[10px] text-foursys-text-dim leading-relaxed">{d.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Requisitos */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-foursys-surface/30">
          <div className="flex items-center gap-2 mb-2.5">
            <DynIcon name="building" size={16} className="text-foursys-cyan" />
            <span className="text-xs font-bold text-white">Ambiente do Cliente</span>
          </div>
          <ul className="space-y-1.5 text-[10px] text-foursys-text-dim">
            <li className="flex items-start gap-1.5"><CheckCircle2 size={10} className="text-foursys-cyan mt-0.5 flex-shrink-0" /> Repositório Git com permissões para o squad</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 size={10} className="text-foursys-cyan mt-0.5 flex-shrink-0" /> Pipeline de CI/CD definido ou co-criado</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 size={10} className="text-foursys-cyan mt-0.5 flex-shrink-0" /> Ambientes Dev / Staging / Produção</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 size={10} className="text-foursys-cyan mt-0.5 flex-shrink-0" /> VPN ou acesso seguro de rede</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5">
          <div className="flex items-center gap-2 mb-2.5">
            <DynIcon name="server" size={16} className="text-orange-400" />
            <span className="text-xs font-bold text-white">Ambiente Foursys</span>
          </div>
          <ul className="space-y-1.5 text-[10px] text-foursys-text-dim">
            <li className="flex items-start gap-1.5"><CheckCircle2 size={10} className="text-orange-400 mt-0.5 flex-shrink-0" /> Cloud isolada e criptografada por cliente</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 size={10} className="text-orange-400 mt-0.5 flex-shrink-0" /> VPN dedicada ao codebase</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 size={10} className="text-orange-400 mt-0.5 flex-shrink-0" /> Conformidade GDPR & EU AI Act</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 size={10} className="text-orange-400 mt-0.5 flex-shrink-0" /> Stack de monitoramento e observabilidade inclusa</li>
            <li className="flex items-start gap-1.5"><CheckCircle2 size={10} className="text-orange-400 mt-0.5 flex-shrink-0" /> IDE compatível com BMAD/OpenSpecLLM</li>
          </ul>
        </div>
      </div>

    </div>
  )
}

/* ── Qualidade & Testes com IA Deep Dive ──────────────────────────────── */

const qaShiftLeftSteps = [
  { icon: 'clipboard-list', title: 'Assessment', desc: 'Documento de assessment, acordos e premissas para alinhamento inicial com o cliente.' },
  { icon: 'calendar', title: 'Planejamento', desc: 'Plano de testes, cronograma, comunicação definida (reuniões e reports) e validação de ambientes.' },
  { icon: 'file-text', title: 'Design de Cenários', desc: 'Cenários de teste escritos em BDD/Gherkin (step-by-step), validação funcional e qualidade antecipada.' },
  { icon: 'database', title: 'Sanity Test & Massa', desc: 'Ambientes validados e massa de dados estruturada com DataForge — sintética e sem vício.' },
  { icon: 'play', title: 'Testes Manuais', desc: 'Evidências de testes positivos e negativos, evidência de falhas e dashboard de execução.' },
  { icon: 'repeat', title: 'Automação Funcional', desc: 'Inclusão dos cenários automatizados na regressão com Cypress, Python e Robot Framework.' },
  { icon: 'activity', title: 'Performance (NFT)', desc: 'Simulação de carga, medição de desempenho, identificação de gargalos e ajustes necessários.' },
  { icon: 'shield-check', title: 'Certificação GMUD', desc: 'Merge, automação de caminho crítico (2 dias), atestado de qualidade GO/NO GO.' },
]

const qaTowers = [
  {
    title: 'COE — Torre de Excelência',
    icon: 'award',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    items: ['Metodologia e Padrões', 'Produtos e Ferramentas', 'Templates e Padrões de Reports', 'Indicadores', 'Eventos, Monitoramento e Sincronização', 'Testes Não-Funcionais (NFT)'],
  },
  {
    title: 'CSC — Torre de Execução',
    icon: 'settings',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/25',
    items: ['Serviços de QA nas Squads', 'Certificação Patch GMUD', 'Automação de Testes Funcionais', 'Treinamentos, Capacitações e Contingências'],
  },
]

const qaGains = [
  { value: '+10x', label: 'Visibilidade de riscos', desc: 'Visibilidade sobre riscos e evolução da qualidade nas entregas' },
  { value: '+80%', label: 'Prevenção de falhas', desc: 'Prevenção de falhas críticas evitadas antes de produção' },
  { value: '+6x', label: 'Aceleração de testes', desc: 'Agente Automatizador: +120 cenários/mês vs 20 manuais' },
  { value: '+70%', label: 'Cobertura funcional', desc: 'Cobertura de testes funcionais com massa de dados via DataForge' },
]

const qaAvoids = [
  'Custos com Retrabalho',
  'Desperdício de Tempo',
  'Falta de Visibilidade',
  'Riscos de Mercado',
  'Inconsistência de Processos',
]

const qaRoiItems = [
  'Prevenção de Falhas Críticas',
  'Automação Acelerada',
  'Decisões Inteligentes',
  'Eficiência Operacional',
  'Qualidade Contínua',
  'Agilidade e Confiança',
]

function QualityAIDeepDive() {
  return (
    <div className="space-y-7">
      {/* Proposta de valor */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/25">
        <p className="text-xs text-foursys-text-muted leading-relaxed">
          <strong className="text-foursys-text">Proposta de Valor:</strong> Qualidade no escopo não é custo a mais — é o que evita custo maior. Modelo plug&apos;n&apos;play com duas torres especializadas que garantem qualidade desde o início do projeto, com IA acelerando cada etapa do ciclo de testes.
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {qaGains.map(m => (
          <div key={m.label} className="text-center p-3 rounded-xl bg-foursys-surface/50 border border-white/10">
            <div className="text-xl font-black text-amber-400">{m.value}</div>
            <div className="text-[10px] font-bold text-foursys-text mt-1">{m.label}</div>
            <div className="text-[9px] text-foursys-text-dim mt-0.5">{m.desc}</div>
          </div>
        ))}
      </div>

      {/* Duas Torres */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Estrutura — Duas Torres Especializadas
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {qaTowers.map(tower => (
            <div key={tower.title} className={`p-4 rounded-xl ${tower.bg} border ${tower.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <DynIcon name={tower.icon} size={16} className={tower.color} />
                <span className={`text-xs font-bold ${tower.color}`}>{tower.title}</span>
              </div>
              <ul className="space-y-1.5">
                {tower.items.map(item => (
                  <li key={item} className="text-[10px] text-foursys-text-dim flex items-start gap-1.5">
                    <span className={`${tower.color} mt-0.5 shrink-0`}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Framework Shift-Left */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Framework Shift-Left — Qualidade antecipada em cada etapa
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {qaShiftLeftSteps.map((step, i) => (
            <div key={step.title} className="p-3 rounded-xl bg-foursys-surface/50 border border-white/10 relative">
              <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-amber-500/30 border border-amber-500/50 flex items-center justify-center text-[9px] font-bold text-amber-300">
                {i + 1}
              </div>
              <div className="mb-2">
                <DynIcon name={step.icon} size={16} className="text-white/80" />
              </div>
              <div className="font-semibold text-foursys-text text-[11px] mb-1">{step.title}</div>
              <p className="text-[9px] text-foursys-text-dim leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Aceleradores com IA */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
          Aceleração com IA
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { title: 'Agente Automatizador', icon: 'bot', desc: 'QA Funcional gera +120 cenários/mês (vs 20 manuais). Prompts estruturados e cURL para testes instantâneos de status codes e estruturas.' },
            { title: 'DataForge', icon: 'database', desc: 'Geração de massa sintética integrada em 1 dia, sem vício de dados. Suporte a testes funcionais e regressivos com escalabilidade.' },
            { title: 'Analista Gherkin', icon: 'file-code', desc: 'Cenários de testes padrão Gherkin (positivos, negativos, regressivos) com fácil compreensão para negócios e integração com automação.' },
          ].map(a => (
            <div key={a.title} className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <DynIcon name={a.icon} size={16} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-300">{a.title}</span>
              </div>
              <p className="text-[10px] text-foursys-text-dim leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ROI e Riscos evitados */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-green-500/8 border border-green-500/20">
          <div className="text-[10px] font-bold uppercase tracking-widest text-green-400 mb-3">
            Seu Sucesso é Nosso Foco (ROI)
          </div>
          <div className="grid grid-cols-2 gap-2">
            {qaRoiItems.map(item => (
              <div key={item} className="flex items-start gap-1.5">
                <DynIcon name="check-circle" size={12} className="text-green-400 shrink-0 mt-0.5" />
                <span className="text-[10px] text-foursys-text-dim">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-red-500/8 border border-red-500/20">
          <div className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-3">
            O Que Você Evita Conosco
          </div>
          <ul className="space-y-2">
            {qaAvoids.map(item => (
              <li key={item} className="flex items-start gap-1.5">
                <DynIcon name="x-circle" size={12} className="text-red-400 shrink-0 mt-0.5" />
                <span className="text-[10px] text-foursys-text-dim">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Governança */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/25">
        <p className="text-xs text-foursys-text-muted text-center flex flex-wrap items-start justify-center gap-1.5">
          <DynIcon name="bar-chart-2" size={14} className="text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-foursys-text">Governança de Qualidade:</strong> Metodologias, padrões, indicadores, templates, treinamentos, monitoramentos e ferramentas — com dashboards de 5+ indicadores para tomada de decisão.
          </span>
        </p>
      </div>
    </div>
  )
}

function DeepDiveContent({ serviceId }: { serviceId: string }) {
  if (serviceId === 'modernizacao-legados') {
    return <ModernizacaoDeepDive />
  }

  if (serviceId === 'ciberseguranca') {
    return <Sec4SysDeepDive />
  }

  if (serviceId === 'ai-augmented-squad') {
    return <AISquadDeepDive />
  }

  if (serviceId === 'quality-testes-ia') {
    return <QualityAIDeepDive />
  }

  if (serviceId === 'fourblox') {
    return <FourBloxDeepDive />
  }

  return null
}

function DeepDiveModal({
  service,
  onClose,
}: {
  service: ServiceLine
  onClose: () => void
}) {
  const visual = SERVICE_VISUALS[service.id] ?? DEFAULT_VISUAL
  const Icon = SERVICE_ICONS[service.id] ?? Layers3
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    modalRef.current?.focus()
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <motion.div
        ref={modalRef}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-4xl rounded-[20px] border overflow-y-auto overscroll-contain max-h-[90vh] outline-none"
        style={{
          borderColor: `${visual.glow}30`,
          background: `linear-gradient(160deg, ${visual.glow}10 0%, #1a1b2e 18%, #14152a 100%)`,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="deepdive-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foursys-primary z-10"
          aria-label="Fechar"
        >
          <X size={18} className="text-white/70" />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3.5 mb-5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${visual.softBg}`}
              style={{ boxShadow: `0 0 20px ${visual.glow}30` }}
            >
              <Icon size={22} className={visual.text} />
            </div>
            <div>
              <h3 id="deepdive-title" className="text-xl md:text-2xl font-black text-white leading-tight">
                {service.title}
              </h3>
              <p className={`text-xs font-semibold mt-0.5 ${visual.text}`}>
                {service.subtitle}
              </p>
            </div>
          </div>

          <p className="text-sm text-foursys-text-muted leading-relaxed mb-5">
            {service.problem}
          </p>

          <DeepDiveContent serviceId={service.id} />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── SectionServices ─────────────────────────────────────────────────────────── */

export function SectionServices() {
  const { state, clearDeepDiveHint, navigate } = useApp()
  const [activeServiceId, setActiveServiceId] = useState(serviceLines[0]?.id ?? '')
  const [mobileSheetId, setMobileSheetId] = useState<string | null>(null)
  const [offerDetailId, setOfferDetailId] = useState<string | null>(null)
  const [deepDiveId, setDeepDiveId] = useState<string | null>(null)
  const activeService = serviceLines.find(s => s.id === activeServiceId) ?? serviceLines[0]
  const activeVisual = SERVICE_VISUALS[activeService.id] ?? DEFAULT_VISUAL
  const orbitRef = useRef<HTMLDivElement>(null)
  const returnSectionRef = useRef<string | null>(null)

  useEffect(() => {
    if (state.deepDiveHint) {
      if (state.previousSection && state.previousSection !== 'services') {
        returnSectionRef.current = state.previousSection
      }
      const targetService = serviceLines.find(s => s.id === state.deepDiveHint)
      if (targetService) {
        setActiveServiceId(targetService.id)
        if ((DEEP_DIVE_IDS as readonly string[]).includes(targetService.id)) {
          setDeepDiveId(targetService.id)
        } else {
          setOfferDetailId(targetService.id)
        }
      }
      clearDeepDiveHint()
    }
  }, [state.deepDiveHint, clearDeepDiveHint, state.previousSection])

  const mobileSheetService = mobileSheetId
    ? serviceLines.find(s => s.id === mobileSheetId) ?? null
    : null

  const offerDetailService = offerDetailId
    ? serviceLines.find(s => s.id === offerDetailId) ?? null
    : null

  const deepDiveService = deepDiveId
    ? serviceLines.find(s => s.id === deepDiveId) ?? null
    : null

  useEffect(() => {
    if (mobileSheetId || offerDetailId || deepDiveId) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [mobileSheetId, offerDetailId, deepDiveId])

  const handleKeyNav = useCallback((e: React.KeyboardEvent, currentId: string) => {
    const ids = serviceLines.map(s => s.id)
    const idx = ids.indexOf(currentId)
    let nextIdx = idx

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      nextIdx = (idx + 1) % ids.length
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      nextIdx = (idx - 1 + ids.length) % ids.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIdx = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIdx = ids.length - 1
    } else {
      return
    }

    setActiveServiceId(ids[nextIdx])
    const buttons = orbitRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
    buttons?.[nextIdx]?.focus()
  }, [])

  const handleOfferDetail = useCallback((id: string) => {
    setMobileSheetId(null)
    if ((DEEP_DIVE_IDS as readonly string[]).includes(id)) {
      setDeepDiveId(id)
    } else {
      setOfferDetailId(id)
    }
  }, [])

  const handleCloseAndReturn = useCallback(() => {
    setDeepDiveId(null)
    setOfferDetailId(null)
    const returnTo = returnSectionRef.current
    if (returnTo) {
      returnSectionRef.current = null
      navigate(returnTo as Parameters<typeof navigate>[0])
    }
  }, [navigate])

  return (
    <SectionWrapper>
      <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-primary mb-1.5">
                Nossos serviços e ofertas
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-none">
                Linhas de Serviço
              </h2>
              <p className="text-foursys-text-muted mt-1.5 text-sm md:text-base max-w-xl leading-relaxed">
                Portfólio integrado de {serviceLines.length} frentes cobrindo toda a jornada
                tecnológica — da sustentação à inovação com IA.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: `${serviceLines.length}`, label: 'frentes' },
                { value: '360°', label: 'cobertura' },
                { value: 'B2B', label: 'enterprise' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="text-center px-3 py-1.5 rounded-lg bg-foursys-surface/40 border border-white/[0.08]"
                >
                  <div className="text-base font-black text-foursys-primary">{stat.value}</div>
                  <div className="text-[9px] text-foursys-text-dim uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-foursys-primary/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* Desktop/Tablet: orbit + side panel */}
        <div className="hidden md:grid md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-[1.15fr_0.85fr] gap-4 lg:gap-6 items-center mb-6">
          <motion.div
            ref={orbitRef}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="px-4 lg:px-10 xl:px-14"
          >
            <OrbitRing
              activeId={activeServiceId}
              onSelect={setActiveServiceId}
              onKeyNav={handleKeyNav}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="rounded-[24px] border p-5 lg:p-6 transition-[border-color,box-shadow] duration-500"
              style={{
                borderColor: `${activeVisual.glow}30`,
                background: `linear-gradient(145deg, ${activeVisual.glow}08 0%, transparent 55%), rgba(255,255,255,0.015)`,
                boxShadow: `0 0 40px ${activeVisual.glow}08`,
              }}
            >
              <ServiceDetailPanel service={activeService} onOfferDetail={handleOfferDetail} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile: grid cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 md:hidden">
          {serviceLines.map((service, index) => {
            const Icon = SERVICE_ICONS[service.id] ?? Layers3
            const visual = SERVICE_VISUALS[service.id] ?? DEFAULT_VISUAL

            return (
              <motion.button
                key={service.id}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * index }}
                onClick={() => setMobileSheetId(service.id)}
                className="text-left rounded-xl border border-white/[0.08] bg-foursys-surface/25 p-3 transition-all duration-200 active:scale-[0.97]"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${visual.softBg}`}>
                    <Icon size={14} className={visual.text} />
                  </div>
                  <span className="text-[11px] font-semibold text-foursys-text-muted leading-snug">
                    {service.title}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Contract models */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {CONTRACT_MODELS.map(model => (
            <div
              key={model.title}
              className="text-center px-2 py-2.5 rounded-lg bg-foursys-surface/20 border border-white/[0.06]"
            >
              <div className="text-[10px] font-bold text-foursys-text uppercase tracking-widest">
                {model.title}
              </div>
              <div className="text-[9px] text-foursys-text-dim mt-0.5">{model.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {createPortal(
        <>
          <AnimatePresence>
            {mobileSheetService && (
              <MobileBottomSheet
                service={mobileSheetService}
                onClose={() => setMobileSheetId(null)}
                onOfferDetail={handleOfferDetail}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {offerDetailService && (
              <OfferDetailModal
                service={offerDetailService}
                onClose={handleCloseAndReturn}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {deepDiveService && (
              <DeepDiveModal
                service={deepDiveService}
                onClose={handleCloseAndReturn}
              />
            )}
          </AnimatePresence>
        </>,
        document.body,
      )}
    </SectionWrapper>
  )
}
