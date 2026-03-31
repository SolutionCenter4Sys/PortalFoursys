import { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Layers3, X, CheckCircle2, Shield, Zap } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { DynIcon } from '../../utils/iconMap'
import { serviceLines } from '../../data/services'
import { SERVICE_ICONS, SERVICE_VISUALS, DEFAULT_VISUAL } from '../../data/serviceVisuals'
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
              className={`absolute max-w-[90px] lg:max-w-[100px] text-[8px] lg:text-[9px] xl:text-[10px] font-semibold leading-tight pointer-events-none transition-colors duration-300 ${labelPos} ${
                isActive ? 'text-white' : 'text-foursys-text-muted/70'
              }`}
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
        className="relative w-full max-w-lg rounded-t-[24px] border-t p-5 pb-8 max-h-[85vh] overflow-y-auto outline-none"
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
        className="relative w-full max-w-2xl rounded-[20px] border overflow-y-auto max-h-[90vh] outline-none"
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

const DEEP_DIVE_IDS = ['modernizacao-legados', 'ciberseguranca', 'fourblox'] as const

const sddSteps = [
  { icon: 'search', title: 'Diagnóstico', desc: 'Mapeamento completo do sistema legado — código, dependências, riscos e oportunidades de modernização.' },
  { icon: 'landmark', title: 'API Gateway', desc: 'Criação de uma camada de abstração API que expõe as funcionalidades do legado sem modificá-lo.' },
  { icon: 'scissors', title: 'Decomposição', desc: 'Identificação dos módulos de maior valor e risco para extração incremental em microserviços.' },
  { icon: 'git-merge', title: 'Migração Gradual', desc: 'Migração módulo a módulo, com o sistema legado 100% operacional durante todo o processo.' },
  { icon: 'cloud', title: 'Cloudificação', desc: 'Deploy dos novos microserviços em Kubernetes/AWS com CI/CD, observabilidade e auto-scaling.' },
  { icon: 'flag', title: 'Descomissionamento', desc: 'Encerramento seguro do sistema legado após validação completa de todas as funcionalidades migradas.' },
]

const cyberCapabilities = [
  { icon: 'search', title: 'SAST', subtitle: 'Static Application Security Testing', desc: 'Análise de vulnerabilidades no código-fonte antes do deploy, integrada ao pipeline CI/CD.' },
  { icon: 'scan-eye', title: 'DAST', subtitle: 'Dynamic Application Security Testing', desc: 'Testes de segurança em aplicações em execução, simulando ataques reais.' },
  { icon: 'target', title: 'Pentest', subtitle: 'Penetration Testing', desc: 'Testes de intrusão por especialistas certificados (OSCP, CEH) em sistemas e APIs.' },
  { icon: 'cloud', title: 'Cloud Security', subtitle: 'Segurança em Cloud', desc: 'Hardening, IAM, CIS Benchmarks e monitoramento de configurações em AWS/Azure.' },
  { icon: 'clipboard-list', title: 'Compliance', subtitle: 'BACEN · LGPD · ISO 27001', desc: 'Adequação regulatória para o setor financeiro brasileiro e internacional.' },
  { icon: 'alert-triangle', title: 'SOC & SIEM', subtitle: 'Security Operations Center', desc: 'Monitoramento 24/7, detecção de ameaças e resposta a incidentes em tempo real.' },
]

const cyberRegulations = [
  { name: 'BACEN Res. 4.658', desc: 'Política de segurança cibernética para IFs' },
  { name: 'BACEN Res. 4.893', desc: 'Continuidade de negócios e TIBER' },
  { name: 'LGPD', desc: 'Lei Geral de Proteção de Dados' },
  { name: 'ISO 27001', desc: 'Sistema de Gestão de Segurança' },
  { name: 'PCI DSS', desc: 'Segurança para dados de cartão' },
  { name: 'SOX', desc: 'Sarbanes-Oxley para empresas listadas' },
]

const fourbloxBlocks = [
  { icon: 'lock', name: 'AuthBlock', desc: 'Autenticação completa (OAuth2, MFA, SSO) em 3 dias' },
  { icon: 'bar-chart', name: 'DashBlock', desc: 'Dashboard analítico com gráficos e KPIs em 5 dias' },
  { icon: 'bell', name: 'NotifyBlock', desc: 'Sistema de notificações multicanal (email, SMS, push) em 2 dias' },
  { icon: 'credit-card', name: 'PayBlock', desc: 'Integração de pagamentos PIX/cartão em 5 dias' },
  { icon: 'brain-circuit', name: 'AIBlock', desc: 'Copiloto IA com RAG e contexto de negócio em 7 dias' },
  { icon: 'clipboard-list', name: 'FormBlock', desc: 'Engine de formulários dinâmicos e workflows em 4 dias' },
  { icon: 'search', name: 'SearchBlock', desc: 'Busca semântica com vetores em qualquer base de dados' },
  { icon: 'folder-open', name: 'DocBlock', desc: 'Gestão e assinatura digital de documentos em 5 dias' },
]

const fourbloxPhases = [
  { week: 'Semana 1', label: 'Discovery + Design', icon: 'ruler' },
  { week: 'Semana 2', label: 'Blocos + Integração', icon: 'brick-wall' },
  { week: 'Semana 3', label: 'Customização + Testes', icon: 'wrench' },
  { week: 'Semana 4', label: 'Deploy + Handover', icon: 'rocket' },
]

function DeepDiveContent({ serviceId }: { serviceId: string }) {
  if (serviceId === 'modernizacao-legados') {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/25">
            <div className="text-sm font-bold text-red-400 mb-2.5">Big-Bang Rewrite (problema)</div>
            <ul className="space-y-1.5 text-xs text-foursys-text-dim">
              <li>• Alto risco de falha e downtime</li>
              <li>• Meses ou anos sem entrega de valor</li>
              <li>• Custo imprevisível e scope creep</li>
              <li>• Perda de conhecimento do negócio no código legado</li>
              <li>• Dependência de fases de "big bang" deploy</li>
            </ul>
          </div>
          <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/25">
            <div className="text-sm font-bold text-green-400 mb-2.5">SDD — Foursys (solução)</div>
            <ul className="space-y-1.5 text-xs text-foursys-text-muted">
              <li>• Zero downtime — legado opera durante toda a migração</li>
              <li>• Valor entregue a cada sprint (módulo por módulo)</li>
              <li>• Custo controlado e previsível por fase</li>
              <li>• Conhecimento de negócio preservado e evoluído</li>
              <li>• Rollback possível a qualquer momento</li>
            </ul>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
            A jornada SDD passo a passo
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sddSteps.map((step, i) => (
              <div key={step.title} className="p-4 rounded-xl bg-foursys-surface/50 border border-white/10 relative">
                <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-foursys-primary/30 border border-foursys-primary/50 flex items-center justify-center text-[9px] font-bold text-foursys-cyan">
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

        <div className="p-4 rounded-xl bg-gradient-to-r from-foursys-primary/15 to-transparent border border-foursys-primary/25">
          <p className="text-xs text-foursys-text-muted text-center flex flex-wrap items-start justify-center gap-1.5">
            <DynIcon name="lightbulb" size={14} className="text-foursys-cyan shrink-0 mt-0.5" />
            <span>
              <strong className="text-foursys-text">Resultado típico:</strong> sistema legado 100% operacional durante toda a migração, com entrega de valor a cada 2 semanas e custo até 40% menor que o big-bang rewrite.
            </span>
          </p>
        </div>
      </div>
    )
  }

  if (serviceId === 'ciberseguranca') {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-3">
          {cyberCapabilities.map(cap => (
            <div key={cap.title} className="p-4 rounded-xl bg-foursys-surface/50 border border-white/10">
              <div className="mb-2">
                <DynIcon name={cap.icon} size={18} className="text-white/80" />
              </div>
              <div className="font-bold text-foursys-text text-xs">{cap.title}</div>
              <div className="text-[10px] text-foursys-text-dim mb-1.5">{cap.subtitle}</div>
              <p className="text-[10px] text-foursys-text-muted leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-r from-red-500/15 to-orange-500/8 border border-red-500/25">
          <div className="flex items-center gap-2.5 mb-3.5">
            <Shield size={18} className="text-red-400" />
            <div>
              <div className="font-bold text-foursys-text text-sm">Conformidade Regulatória Financeira</div>
              <div className="text-[10px] text-foursys-text-dim">Frameworks e regulações relevantes</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {cyberRegulations.map(reg => (
              <div key={reg.name} className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="font-semibold text-red-400 text-[11px]">{reg.name}</div>
                <div className="text-[9px] text-foursys-text-dim mt-0.5">{reg.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (serviceId === 'fourblox') {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap justify-center gap-6 mb-2">
          {[
            { value: '70%', label: 'Menos tempo de dev', color: 'text-foursys-cyan' },
            { value: '30d', label: 'Prazo máximo', color: 'text-green-400' },
            { value: '∞', label: 'Customização por contexto', color: 'text-violet-400' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className={`text-2xl font-black ${stat.color} mb-0.5`}>{stat.value}</div>
              <div className="text-[10px] text-foursys-text-dim">{stat.label}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3 text-center">
            Catálogo de Blocos Disponíveis
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {fourbloxBlocks.map(block => (
              <div key={block.name} className="p-3 rounded-xl bg-foursys-surface/50 border border-white/10">
                <div className="mb-1.5">
                  <DynIcon name={block.icon} size={16} className="text-white/80" />
                </div>
                <div className="font-bold text-foursys-cyan text-[11px] mb-0.5">{block.name}</div>
                <div className="text-[9px] text-foursys-text-dim leading-relaxed">{block.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-foursys-surface/40 border border-white/10">
          <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3 text-center">
            Como entregamos em 30 dias
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fourbloxPhases.map((phase, i) => (
              <div key={phase.week} className="text-center">
                <div className="relative mb-2">
                  <div className="w-10 h-10 rounded-xl bg-foursys-primary/20 border border-foursys-primary/30 flex items-center justify-center mx-auto">
                    <DynIcon name={phase.icon} size={18} className="text-white/80" />
                  </div>
                  {i < fourbloxPhases.length - 1 && (
                    <div className="hidden md:block absolute top-5 left-full w-full h-px bg-gradient-to-r from-foursys-primary/40 to-transparent" />
                  )}
                </div>
                <div className="text-[10px] text-foursys-cyan font-semibold">{phase.week}</div>
                <div className="text-[9px] text-foursys-text-dim mt-0.5">{phase.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-1.5">
            <Zap size={14} className="text-foursys-cyan" />
            <p className="text-xs text-foursys-text-muted">
              Garantia de entrega em 30 dias ou o cliente não paga pela última semana.
            </p>
          </div>
        </div>
      </div>
    )
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
        className="relative w-full max-w-3xl rounded-[20px] border overflow-y-auto max-h-[90vh] outline-none"
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
  const [activeServiceId, setActiveServiceId] = useState(serviceLines[0]?.id ?? '')
  const [mobileSheetId, setMobileSheetId] = useState<string | null>(null)
  const [offerDetailId, setOfferDetailId] = useState<string | null>(null)
  const [deepDiveId, setDeepDiveId] = useState<string | null>(null)
  const activeService = serviceLines.find(s => s.id === activeServiceId) ?? serviceLines[0]
  const activeVisual = SERVICE_VISUALS[activeService.id] ?? DEFAULT_VISUAL
  const orbitRef = useRef<HTMLDivElement>(null)

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
                onClose={() => setOfferDetailId(null)}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {deepDiveService && (
              <DeepDiveModal
                service={deepDiveService}
                onClose={() => setDeepDiveId(null)}
              />
            )}
          </AnimatePresence>
        </>,
        document.body,
      )}
    </SectionWrapper>
  )
}
