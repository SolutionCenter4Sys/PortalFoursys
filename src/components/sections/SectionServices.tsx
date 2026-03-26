import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  CloudCog,
  GitMerge,
  Layers3,
  Network,
  ShieldCheck,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { serviceLines } from '../../data/services'

const SERVICE_ICONS: Record<string, LucideIcon> = {
  'outsourcing-sustentacao': Users,
  'modernizacao-legados': GitMerge,
  'arquitetura-devops': Layers3,
  'integracoes-open-finance': Network,
  'engenharia-software-ia': BrainCircuit,
  'cloud-finops': CloudCog,
  'dados-analytics': BarChart3,
  'quality-testes-ia': CheckCircle2,
  'ciberseguranca': ShieldCheck,
  'hiperautomacao-rpa': Workflow,
}

const SERVICE_VISUALS: Record<string, { text: string; softBg: string; border: string; glow: string }> = {
  'outsourcing-sustentacao': { text: 'text-indigo-300', softBg: 'bg-indigo-400/15', border: 'border-indigo-400/35', glow: '#31458A' },
  'modernizacao-legados': { text: 'text-violet-300', softBg: 'bg-violet-400/15', border: 'border-violet-400/35', glow: '#7C3AED' },
  'arquitetura-devops': { text: 'text-fuchsia-300', softBg: 'bg-fuchsia-400/15', border: 'border-fuchsia-400/35', glow: '#B832C8' },
  'integracoes-open-finance': { text: 'text-pink-300', softBg: 'bg-pink-400/15', border: 'border-pink-400/35', glow: '#DB2777' },
  'engenharia-software-ia': { text: 'text-rose-300', softBg: 'bg-rose-400/15', border: 'border-rose-400/35', glow: '#F43F5E' },
  'cloud-finops': { text: 'text-orange-300', softBg: 'bg-orange-400/15', border: 'border-orange-400/35', glow: '#FB923C' },
  'dados-analytics': { text: 'text-amber-300', softBg: 'bg-amber-400/15', border: 'border-amber-400/35', glow: '#F59E0B' },
  'quality-testes-ia': { text: 'text-yellow-200', softBg: 'bg-yellow-300/15', border: 'border-yellow-300/35', glow: '#FACC15' },
  'ciberseguranca': { text: 'text-lime-200', softBg: 'bg-lime-300/15', border: 'border-lime-300/35', glow: '#A3E635' },
  'hiperautomacao-rpa': { text: 'text-cyan-200', softBg: 'bg-cyan-300/15', border: 'border-cyan-300/35', glow: '#67E8F9' },
}

const ORBIT_POSITIONS: Record<string, { top: string; left: string; align: string }> = {
  'outsourcing-sustentacao': { top: '19%', left: '22%', align: 'items-end text-right' },
  'modernizacao-legados': { top: '8%', left: '50%', align: 'items-center text-center' },
  'arquitetura-devops': { top: '19%', left: '78%', align: 'items-start text-left' },
  'integracoes-open-finance': { top: '40%', left: '91%', align: 'items-start text-left' },
  'engenharia-software-ia': { top: '62%', left: '86%', align: 'items-start text-left' },
  'cloud-finops': { top: '82%', left: '74%', align: 'items-start text-left' },
  'dados-analytics': { top: '92%', left: '50%', align: 'items-center text-center' },
  'quality-testes-ia': { top: '82%', left: '26%', align: 'items-end text-right' },
  'ciberseguranca': { top: '62%', left: '14%', align: 'items-end text-right' },
  'hiperautomacao-rpa': { top: '40%', left: '9%', align: 'items-end text-right' },
}

const CONTRACT_MODELS = [
  'Modelos de Contratação Flexíveis',
  'Squads',
  'Projetos (Escopo Fechado)',
  'Alocação',
  'AMS',
]

function OrbitNode({
  service,
  active,
  onSelect,
}: {
  service: typeof serviceLines[number]
  active: boolean
  onSelect: (id: string) => void
}) {
  const Icon = SERVICE_ICONS[service.id] ?? Layers3
  const visual = SERVICE_VISUALS[service.id]
  const position = ORBIT_POSITIONS[service.id]

  return (
    <button
      type="button"
      onClick={() => onSelect(service.id)}
      className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 ${position.align}`}
      style={{ top: position.top, left: position.left }}
    >
      <span className={`hidden xl:block max-w-[180px] text-[11px] leading-tight ${active ? 'text-white' : 'text-foursys-text-muted'}`}>
        <strong className="block text-sm">{service.title}</strong>
        <span>{service.subtitle}</span>
      </span>
      <span
        className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-200 ${visual.softBg} ${visual.border}`}
        style={{
          boxShadow: active ? `0 0 0 8px ${visual.glow}22, 0 0 24px ${visual.glow}88` : `0 0 14px ${visual.glow}55`,
        }}
      >
        <Icon size={22} className={visual.text} />
      </span>
    </button>
  )
}

function CompactServiceCard({
  service,
  index,
  active,
  onSelect,
}: {
  service: typeof serviceLines[number]
  index: number
  active: boolean
  onSelect: (id: string) => void
}) {
  const Icon = SERVICE_ICONS[service.id] ?? Layers3
  const visual = SERVICE_VISUALS[service.id]

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 + index * 0.04 }}
      onClick={() => onSelect(service.id)}
      className={`text-left rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-1 ${
        active ? `${visual.border} bg-white/[0.06]` : 'border-white/[0.08] bg-foursys-surface/25'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${visual.softBg}`}>
          <Icon size={18} className={visual.text} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-white leading-snug">{service.title}</h3>
          <p className={`text-xs mt-1 ${visual.text}`}>{service.subtitle}</p>
        </div>
      </div>
    </motion.button>
  )
}

export function SectionServices() {
  const [activeServiceId, setActiveServiceId] = useState(serviceLines[0]?.id ?? '')
  const activeService = serviceLines.find(service => service.id === activeServiceId) ?? serviceLines[0]
  const activeVisual = SERVICE_VISUALS[activeService.id] ?? SERVICE_VISUALS['modernizacao-legados']
  const ActiveIcon = SERVICE_ICONS[activeService.id] ?? Layers3

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
                Estruturamos a seção com base no slide de referência, cobrindo as {serviceLines.length} frentes apresentadas em um portfólio integrado de evolução tecnológica.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: `${serviceLines.length}`, label: 'frentes' },
                { value: '360°', label: 'cobertura' },
                { value: 'B2B', label: 'execução enterprise' },
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

            <div className="mt-10">
              <h3 className="text-3xl md:text-5xl font-light leading-tight text-white max-w-xl">
                Tecnologia bem feita respeita o legado,{' '}
                <span className="text-foursys-blue">organiza o presente</span>{' '}
                e constrói o futuro.
              </h3>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceLines.slice(0, 4).map(service => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setActiveServiceId(service.id)}
                  className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                    activeService.id === service.id
                      ? `${SERVICE_VISUALS[service.id].border} bg-white/[0.06]`
                      : 'border-white/[0.08] bg-foursys-surface/20'
                  }`}
                >
                  <div className={`text-xs font-bold uppercase tracking-widest ${SERVICE_VISUALS[service.id].text}`}>
                    foco
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">{service.title}</div>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.16 }}
            className="rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-4 md:p-6"
          >
            <div className="relative hidden md:block aspect-square max-w-[620px] mx-auto">
              <div className="absolute inset-[12%] rounded-full border border-white/10 bg-white/[0.02]" />
              <div className="absolute inset-[26%] rounded-full border border-white/10 bg-white/[0.03]" />
              <div className="absolute inset-[36%] rounded-full border border-white/10 bg-foursys-surface/40 shadow-[0_0_60px_rgba(0,0,0,0.35)]" />
              <div className="absolute inset-[39%] rounded-full bg-[#23243D] border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-white">foursys</div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-foursys-text-dim mt-1">serviços & ofertas</div>
                </div>
              </div>

              {serviceLines.map(service => (
                <OrbitNode
                  key={service.id}
                  service={service}
                  active={activeService.id === service.id}
                  onSelect={setActiveServiceId}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
              {serviceLines.map((service, index) => (
                <CompactServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                  active={activeService.id === service.id}
                  onSelect={setActiveServiceId}
                />
              ))}
            </div>

            <div className="mt-5 flex flex-wrap justify-between gap-y-2 border-t border-white/[0.08] pt-4">
              {CONTRACT_MODELS.map((model, index) => (
                <div key={model} className="flex items-center text-center">
                  <div className="px-3 md:px-5">
                    <span className="text-[11px] md:text-xs uppercase tracking-[0.24em] text-foursys-text-muted">
                      {model}
                    </span>
                  </div>
                  {index < CONTRACT_MODELS.length - 1 && (
                    <div className="hidden md:block h-10 w-px bg-white/[0.12]" />
                  )}
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
          className="rounded-[28px] border border-white/[0.08] bg-foursys-surface/25 p-6 md:p-7 mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeVisual.softBg}`}>
                  <ActiveIcon size={22} className={activeVisual.text} />
                </div>
                <div>
                  <div className={`text-[10px] font-bold uppercase tracking-[0.22em] ${activeVisual.text}`}>
                    Serviço em destaque
                  </div>
                  <h3 className="text-2xl font-black text-white mt-1">{activeService.title}</h3>
                </div>
              </div>

              <p className={`text-sm font-semibold ${activeVisual.text}`}>{activeService.subtitle}</p>
              <p className="text-foursys-text-muted text-base leading-relaxed mt-3 max-w-3xl">
                {activeService.problem}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-foursys-blue">
                Explore a oferta <ArrowRight size={16} />
              </div>
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

        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-blue mb-2">
            Portfólio completo
          </p>
          <h3 className="text-xl md:text-2xl font-black text-white">
            Todas as frentes presentes no slide
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {serviceLines.map((service, index) => (
            <CompactServiceCard
              key={service.id}
              service={service}
              index={index}
              active={activeService.id === service.id}
              onSelect={setActiveServiceId}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
