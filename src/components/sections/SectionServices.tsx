import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Layers3 } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { serviceLines } from '../../data/services'
import { SERVICE_ICONS, SERVICE_VISUALS, DEFAULT_VISUAL } from '../../data/serviceVisuals'
import { useApp } from '../../context/AppContext'

const CONTRACT_MODELS = [
  { title: 'Squads', desc: 'Times multidisciplinares integrados' },
  { title: 'Projetos', desc: 'Escopo fechado com entregas claras' },
  { title: 'Alocação', desc: 'Especialistas sob demanda' },
  { title: 'AMS', desc: 'Sustentação contínua com SLA' },
]

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
      className="relative aspect-square max-w-[440px] lg:max-w-[520px] mx-auto"
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
          <div className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-none">foursys</div>
          <div className="text-[8px] md:text-[9px] uppercase tracking-[0.28em] text-foursys-text-dim mt-1">
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
              className={`w-11 h-11 lg:w-14 lg:h-14 rounded-full border flex items-center justify-center transition-all duration-300 ${visual.softBg} ${visual.border}`}
              style={{
                boxShadow: isActive
                  ? `0 0 0 5px ${visual.glow}30, 0 0 24px ${visual.glow}70`
                  : `0 0 10px ${visual.glow}30`,
                transform: isActive ? 'scale(1.18)' : 'scale(1)',
              }}
            >
              <Icon size={18} className={visual.text} />
            </span>
            <span
              className={`absolute max-w-[100px] text-[9px] lg:text-[10px] font-semibold leading-tight pointer-events-none transition-colors duration-300 ${labelPos} ${
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

export function SectionServices() {
  const { navigate } = useApp()
  const [activeServiceId, setActiveServiceId] = useState(serviceLines[0]?.id ?? '')
  const activeService = serviceLines.find(s => s.id === activeServiceId) ?? serviceLines[0]
  const activeVisual = SERVICE_VISUALS[activeService.id] ?? DEFAULT_VISUAL
  const ActiveIcon = SERVICE_ICONS[activeService.id] ?? Layers3
  const orbitRef = useRef<HTMLDivElement>(null)

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

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 md:mb-10"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-blue mb-2">
                Nossos serviços e ofertas
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-none">
                Linhas de Serviço
              </h2>
              <p className="text-foursys-text-muted mt-2 text-base max-w-2xl leading-relaxed">
                Portfólio integrado de {serviceLines.length} frentes cobrindo toda a jornada tecnológica
                — da sustentação à inovação com IA.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: `${serviceLines.length}`, label: 'frentes' },
                { value: '360°', label: 'cobertura' },
                { value: 'B2B', label: 'enterprise' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="text-center px-4 py-2 rounded-xl bg-foursys-surface/40 border border-white/[0.08]"
                >
                  <div className="text-lg font-black text-foursys-blue">{stat.value}</div>
                  <div className="text-[10px] text-foursys-text-dim uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 h-px bg-gradient-to-r from-foursys-blue/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* Orbit — md+ */}
        <motion.div
          ref={orbitRef}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="hidden md:block mb-8 px-12 lg:px-20"
        >
          <OrbitRing activeId={activeServiceId} onSelect={setActiveServiceId} onKeyNav={handleKeyNav} />
        </motion.div>

        {/* Grid — mobile */}
        <div className="grid grid-cols-2 gap-2.5 mb-6 md:hidden">
          {serviceLines.map((service, index) => {
            const Icon = SERVICE_ICONS[service.id] ?? Layers3
            const visual = SERVICE_VISUALS[service.id] ?? DEFAULT_VISUAL
            const isActive = activeService.id === service.id

            return (
              <motion.button
                key={service.id}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * index }}
                onClick={() => setActiveServiceId(service.id)}
                className={`text-left rounded-xl border p-3 transition-all duration-200 ${
                  isActive
                    ? `${visual.border} bg-white/[0.07]`
                    : 'border-white/[0.08] bg-foursys-surface/25'
                }`}
                style={isActive ? { boxShadow: `0 0 16px ${visual.glow}20` } : undefined}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${visual.softBg}`}
                  >
                    <Icon size={14} className={visual.text} />
                  </div>
                  <span
                    className={`text-[11px] font-semibold leading-snug ${isActive ? 'text-white' : 'text-foursys-text-muted'}`}
                  >
                    {service.title}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Detail panel — harmonized with active service color */}
        <motion.div
          key={activeService.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-[24px] md:rounded-[28px] border p-5 md:p-8 mb-6 transition-[border-color,box-shadow] duration-500"
          style={{
            borderColor: `${activeVisual.glow}30`,
            background: `linear-gradient(145deg, ${activeVisual.glow}06 0%, transparent 50%), rgba(255,255,255,0.015)`,
            boxShadow: `0 0 40px ${activeVisual.glow}08`,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 ${activeVisual.softBg}`}
                  style={{ boxShadow: `0 0 20px ${activeVisual.glow}25` }}
                >
                  <ActiveIcon size={20} className={activeVisual.text} />
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-black text-white leading-tight">
                    {activeService.title}
                  </h3>
                  <p className={`text-xs md:text-sm font-semibold mt-0.5 transition-colors duration-300 ${activeVisual.text}`}>
                    {activeService.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-foursys-text-muted text-sm md:text-base leading-relaxed mt-3 max-w-3xl">
                {activeService.problem}
              </p>

              <button
                type="button"
                onClick={() => navigate('delivery')}
                className="mt-5 flex items-center gap-2 text-sm font-semibold text-foursys-blue hover:text-foursys-cyan transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foursys-blue rounded"
              >
                Ver modelos de entrega <ArrowRight size={16} />
              </button>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 md:p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
                Onde gera valor
              </p>
              <p className="text-sm text-foursys-text-muted leading-relaxed mb-4">
                {activeService.target}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {activeService.tags.map(tag => (
                  <span
                    key={tag}
                    className={`px-2 py-0.5 rounded-full text-[10px] border transition-colors duration-300 bg-white/[0.02] ${activeVisual.border} ${activeVisual.text}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contract models */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {CONTRACT_MODELS.map(model => (
            <div
              key={model.title}
              className="text-center px-3 py-3 rounded-xl bg-foursys-surface/20 border border-white/[0.06]"
            >
              <div className="text-[11px] font-bold text-foursys-text uppercase tracking-widest">
                {model.title}
              </div>
              <div className="text-[10px] text-foursys-text-dim mt-0.5">{model.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
