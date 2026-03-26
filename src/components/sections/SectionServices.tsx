import { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Layers3, X, CheckCircle2 } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
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
            className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-foursys-blue rounded-full z-10"
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
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-foursys-blue hover:text-foursys-cyan transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foursys-blue rounded"
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
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foursys-blue"
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
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foursys-blue z-10"
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
          <div className="grid grid-cols-3 gap-2.5 md:gap-3 mb-5">
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

/* ── SectionServices ─────────────────────────────────────────────────────────── */

export function SectionServices() {
  const [activeServiceId, setActiveServiceId] = useState(serviceLines[0]?.id ?? '')
  const [mobileSheetId, setMobileSheetId] = useState<string | null>(null)
  const [offerDetailId, setOfferDetailId] = useState<string | null>(null)
  const activeService = serviceLines.find(s => s.id === activeServiceId) ?? serviceLines[0]
  const activeVisual = SERVICE_VISUALS[activeService.id] ?? DEFAULT_VISUAL
  const orbitRef = useRef<HTMLDivElement>(null)

  const mobileSheetService = mobileSheetId
    ? serviceLines.find(s => s.id === mobileSheetId) ?? null
    : null

  const offerDetailService = offerDetailId
    ? serviceLines.find(s => s.id === offerDetailId) ?? null
    : null

  useEffect(() => {
    if (mobileSheetId || offerDetailId) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [mobileSheetId, offerDetailId])

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
    setOfferDetailId(id)
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
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-blue mb-1.5">
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
                  <div className="text-base font-black text-foursys-blue">{stat.value}</div>
                  <div className="text-[9px] text-foursys-text-dim uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-foursys-blue/30 via-white/[0.06] to-transparent" />
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
        </>,
        document.body,
      )}
    </SectionWrapper>
  )
}
