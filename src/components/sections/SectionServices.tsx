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

function OrbitRing({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  const angleStep = 360 / serviceLines.length
  const radius = 42

  return (
    <div className="relative aspect-square max-w-[520px] mx-auto" role="radiogroup" aria-label="Linhas de serviço">
      <div className="absolute inset-[8%] rounded-full border border-white/[0.06]" />
      <div className="absolute inset-[22%] rounded-full border border-white/[0.08] bg-white/[0.02]" />
      <div className="absolute inset-[36%] rounded-full border border-white/10 bg-foursys-surface/40 shadow-[0_0_60px_rgba(0,0,0,0.35)]" />
      <div className="absolute inset-[39%] rounded-full bg-[#23243D] border border-white/10 flex items-center justify-center">
        <div className="text-center px-2">
          <div className="text-2xl md:text-3xl font-black text-white leading-none">foursys</div>
          <div className="text-[9px] uppercase tracking-[0.28em] text-foursys-text-dim mt-1">serviços & ofertas</div>
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

        return (
          <button
            key={service.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={service.title}
            onClick={() => onSelect(service.id)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-foursys-blue rounded-full"
            style={{ top: `${y}%`, left: `${x}%` }}
          >
            <span
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center transition-all duration-200 ${visual.softBg} ${visual.border}`}
              style={{
                boxShadow: isActive
                  ? `0 0 0 6px ${visual.glow}25, 0 0 22px ${visual.glow}80`
                  : `0 0 12px ${visual.glow}40`,
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
              }}
            >
              <Icon size={20} className={visual.text} />
            </span>
            <span
              className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap text-[10px] font-semibold leading-none transition-opacity pointer-events-none ${
                isActive ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-foursys-text-muted'
              }`}
            >
              {service.title.length > 22 ? service.title.slice(0, 20) + '\u2026' : service.title}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function ServiceSelector({
  service,
  active,
  onSelect,
  onKeyNav,
}: {
  service: (typeof serviceLines)[number]
  active: boolean
  onSelect: (id: string) => void
  onKeyNav: (e: React.KeyboardEvent, id: string) => void
}) {
  const Icon = SERVICE_ICONS[service.id] ?? Layers3
  const visual = SERVICE_VISUALS[service.id] ?? DEFAULT_VISUAL

  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onClick={() => onSelect(service.id)}
      onKeyDown={e => onKeyNav(e, service.id)}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-foursys-blue ${
        active
          ? `${visual.border} bg-white/[0.06] border`
          : 'border border-transparent hover:bg-white/[0.03]'
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${visual.softBg}`}>
        <Icon size={15} className={visual.text} />
      </div>
      <div className="min-w-0">
        <div className={`text-xs font-semibold leading-snug truncate ${active ? 'text-white' : 'text-foursys-text-muted'}`}>
          {service.title}
        </div>
      </div>
    </button>
  )
}

export function SectionServices() {
  const { navigate } = useApp()
  const [activeServiceId, setActiveServiceId] = useState(serviceLines[0]?.id ?? '')
  const activeService = serviceLines.find(s => s.id === activeServiceId) ?? serviceLines[0]
  const activeVisual = SERVICE_VISUALS[activeService.id] ?? DEFAULT_VISUAL
  const ActiveIcon = SERVICE_ICONS[activeService.id] ?? Layers3
  const listRef = useRef<HTMLDivElement>(null)

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
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]')
    buttons?.[nextIdx]?.focus()
  }, [])

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
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
                Portfólio integrado de {serviceLines.length} frentes cobrindo toda a jornada tecnológica — da sustentação à inovação com IA.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: `${serviceLines.length}`, label: 'frentes' },
                { value: '360°', label: 'cobertura' },
                { value: 'B2B', label: 'enterprise' },
              ].map(stat => (
                <div key={stat.label} className="text-center px-4 py-2 rounded-xl bg-foursys-surface/40 border border-white/[0.08]">
                  <div className="text-lg font-black text-foursys-blue">{stat.value}</div>
                  <div className="text-[10px] text-foursys-text-dim uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 h-px bg-gradient-to-r from-foursys-blue/30 via-white/[0.06] to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-6 items-start mb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-6 md:p-8"
          >
            <p className="text-foursys-text-muted text-lg md:text-xl leading-relaxed max-w-md">
              Visão estratégica com execução técnica disciplinada e foco em resultados.
            </p>
            <p className="text-foursys-text-muted text-lg md:text-xl leading-relaxed max-w-md mt-4">
              IA aplicada com pragmatismo, governança e retorno mensurável.
            </p>

            <div className="mt-8">
              <h3 className="text-3xl md:text-4xl font-light leading-tight text-white max-w-xl">
                Tecnologia bem feita respeita o legado,{' '}
                <span className="text-foursys-blue">organiza o presente</span>{' '}
                e constrói o futuro.
              </h3>
            </div>

            <div ref={listRef} className="mt-8 space-y-1" role="listbox" aria-label="Selecionar linha de serviço">
              {serviceLines.map(service => (
                <ServiceSelector
                  key={service.id}
                  service={service}
                  active={activeService.id === service.id}
                  onSelect={setActiveServiceId}
                  onKeyNav={handleKeyNav}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.16 }}
            className="rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-4 md:p-6"
          >
            <div className="hidden md:block">
              <OrbitRing activeId={activeServiceId} onSelect={setActiveServiceId} />
            </div>

            <div className="grid grid-cols-2 gap-3 md:hidden">
              {serviceLines.map(service => {
                const Icon = SERVICE_ICONS[service.id] ?? Layers3
                const visual = SERVICE_VISUALS[service.id] ?? DEFAULT_VISUAL
                const isActive = activeService.id === service.id

                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setActiveServiceId(service.id)}
                    className={`text-left rounded-2xl border p-3 transition-all ${
                      isActive ? `${visual.border} bg-white/[0.06]` : 'border-white/[0.08] bg-foursys-surface/25'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${visual.softBg}`}>
                        <Icon size={14} className={visual.text} />
                      </div>
                      <span className="text-xs font-semibold text-white leading-snug">{service.title}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-white/[0.08] pt-4">
              {CONTRACT_MODELS.map(model => (
                <div key={model.title} className="text-center px-2 py-2">
                  <div className="text-xs font-bold text-foursys-text uppercase tracking-widest">{model.title}</div>
                  <div className="text-[10px] text-foursys-text-dim mt-0.5">{model.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          key={activeService.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[28px] border border-white/[0.08] bg-foursys-surface/25 p-6 md:p-7"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeVisual.softBg}`}>
                  <ActiveIcon size={22} className={activeVisual.text} />
                </div>
                <h3 className="text-2xl font-black text-white">{activeService.title}</h3>
              </div>

              <p className={`text-sm font-semibold ${activeVisual.text}`}>{activeService.subtitle}</p>
              <p className="text-foursys-text-muted text-base leading-relaxed mt-3 max-w-3xl">
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

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
                Onde gera valor
              </p>
              <p className="text-sm text-foursys-text-muted leading-relaxed mb-4">{activeService.target}</p>

              <div className="flex flex-wrap gap-2">
                {activeService.tags.map(tag => (
                  <span
                    key={tag}
                    className={`px-2.5 py-1 rounded-full text-[10px] border ${activeVisual.border} ${activeVisual.text} bg-white/[0.02]`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
