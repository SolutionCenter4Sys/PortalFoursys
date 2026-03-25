import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  GitMerge,
  BarChart3,
  Monitor,
  ShieldCheck,
  CheckCircle,
  CloudCog,
  Layers3,
  Package,
  Zap,
  Users,
  Clock,
} from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { serviceLines } from '../../data/services'

// ─── Ícones Lucide por serviço ────────────────────────────────────────────────

const SERVICE_ICONS: Record<string, React.ElementType> = {
  'modernizacao':     GitMerge,
  'engenharia-dados': BarChart3,
  'desenvolvimento':  Monitor,
  'cyber-security':   ShieldCheck,
  'quality-assurance':CheckCircle,
  'cloud-devops':     CloudCog,
  'salesforce':       Layers3,
  'fourblock':        Package,
}

// ─── Cores de destaque por serviço ────────────────────────────────────────────

const SERVICE_ACCENT: Record<string, string> = {
  'modernizacao':     'from-blue-500/20 to-blue-600/5  border-blue-500/25  text-blue-400',
  'engenharia-dados': 'from-violet-500/20 to-violet-600/5 border-violet-500/25 text-violet-400',
  'desenvolvimento':  'from-cyan-500/20 to-cyan-600/5  border-cyan-500/25   text-cyan-400',
  'cyber-security':   'from-red-500/20 to-red-600/5    border-red-500/25    text-red-400',
  'quality-assurance':'from-green-500/20 to-green-600/5 border-green-500/25 text-green-400',
  'cloud-devops':     'from-orange-500/20 to-orange-600/5 border-orange-500/25 text-orange-400',
  'salesforce':       'from-sky-500/20 to-sky-600/5    border-sky-500/25    text-sky-400',
  'fourblock':        'from-foursys-blue/20 to-foursys-blue/5 border-foursys-blue/25 text-foursys-blue',
}

const SERVICE_ICON_BG: Record<string, string> = {
  'modernizacao':     'bg-blue-500/15 text-blue-400',
  'engenharia-dados': 'bg-violet-500/15 text-violet-400',
  'desenvolvimento':  'bg-cyan-500/15 text-cyan-400',
  'cyber-security':   'bg-red-500/15 text-red-400',
  'quality-assurance':'bg-green-500/15 text-green-400',
  'cloud-devops':     'bg-orange-500/15 text-orange-400',
  'salesforce':       'bg-sky-500/15 text-sky-400',
  'fourblock':        'bg-foursys-blue/15 text-foursys-blue',
}

// ─── Categorias de filtro ──────────────────────────────────────────────────────

const FILTERS = ['Todos', 'Core', 'IA & Dados', 'Segurança', 'Agilidade', 'Inovação']

const SERVICE_FILTER: Record<string, string> = {
  'modernizacao':     'Core',
  'engenharia-dados': 'IA & Dados',
  'desenvolvimento':  'Core',
  'cyber-security':   'Segurança',
  'quality-assurance':'Agilidade',
  'cloud-devops':     'Core',
  'salesforce':       'Core',
  'fourblock':        'Inovação',
}

// ─── Featured card (hero do AI-Augmented Squad) ───────────────────────────────

function FeaturedServiceCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="col-span-full relative overflow-hidden rounded-2xl border border-foursys-blue/20 bg-gradient-to-br from-foursys-blue/10 to-transparent group cursor-pointer"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] h-full">
        {/* Conteúdo */}
        <div className="p-5 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 rounded-full bg-foursys-blue/20 border border-foursys-blue/30 text-foursys-blue text-[11px] font-bold tracking-widest uppercase">
                Flagship
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/8 border border-white/10 text-foursys-text-dim text-[11px] font-semibold tracking-wide uppercase">
                AI-Augmented
              </span>
            </div>
            <h3 className="text-3xl font-black text-white mb-3 leading-tight">
              AI-Augmented Squad
            </h3>
            <p className="text-foursys-text-muted text-base leading-relaxed max-w-xl">
              Squads humanos amplificados por mais de 20 agentes de IA especializados.
              Entrega 3–6× mais rápida com governança e rastreabilidade em cada fase — da descoberta ao deploy.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-8 mt-4 md:mt-6">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-foursys-blue" />
              <span className="text-sm text-foursys-text-muted">SDD Framework</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} className="text-foursys-blue" />
              <span className="text-sm text-foursys-text-muted">+20 Agentes IA</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-foursys-blue" />
              <span className="text-sm text-foursys-text-muted">Valor em semanas</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-foursys-blue text-sm font-semibold group-hover:gap-3 transition-all">
              Saiba mais <ArrowRight size={15} />
            </div>
          </div>
        </div>

        {/* Imagem */}
        <div className="relative hidden sm:block sm:w-[300px] md:w-[480px] overflow-hidden">
          <img
            src="/images/foursys-human-ai-squad-v10.png"
            alt="AI-Augmented Squad"
            className="h-full w-full object-cover object-center opacity-90 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foursys-dark-2/90 via-foursys-dark-2/20 to-transparent" />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Card de serviço ──────────────────────────────────────────────────────────

function ServiceCard({
  service,
  index,
}: {
  service: typeof serviceLines[number]
  index: number
}) {
  const Icon     = SERVICE_ICONS[service.id] ?? Layers3
  const accent   = SERVICE_ACCENT[service.id] ?? 'from-white/5 to-white/0 border-white/10 text-white'
  const iconBg   = SERVICE_ICON_BG[service.id] ?? 'bg-white/10 text-white'
  const [, , textCls] = accent.split(' ')

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.06 }}
      className={`group relative rounded-2xl border bg-gradient-to-b ${accent} overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col`}
    >
      {/* Linha de destaque superior */}
      <div className={`h-px w-full bg-gradient-to-r ${accent.split(' ')[0].replace('/20', '/60')} from-current`} />

      <div className="p-6 flex flex-col flex-1">
        {/* Ícone + badge */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
            <Icon size={18} strokeWidth={1.5} />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${textCls} opacity-70`}>
            {SERVICE_FILTER[service.id]}
          </span>
        </div>

        {/* Título */}
        <h3 className="font-bold text-white text-[15px] leading-snug mb-1">
          {service.title}
        </h3>
        <p className={`text-xs font-medium mb-3 ${textCls}`}>{service.subtitle}</p>

        {/* Problema */}
        <p className="text-sm text-foursys-text-muted leading-relaxed flex-1">
          {service.problem}
        </p>

        {/* Para quem */}
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <p className="text-[11px] text-foursys-text-dim leading-snug">{service.target}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {service.tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-foursys-text-dim"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA hover */}
        <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${textCls} opacity-0 group-hover:opacity-100 transition-opacity`}>
          Ver detalhes <ArrowRight size={12} />
        </div>
      </div>
    </motion.article>
  )
}

// ─── Painel de imagem do Squad slide ─────────────────────────────────────────

function SquadSlidePanel() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="col-span-full mt-2 rounded-2xl overflow-hidden border border-white/[0.07]"
    >
      <div className="relative">
        <img
          src="/images/foursys_ai_augmented_squad_slide_v3.png"
          alt="AI-Augmented Squad — Problemas x Solução"
          className="w-full object-cover"
          style={{ maxHeight: '420px', objectPosition: 'center top' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foursys-dark-2/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-8">
          <p className="text-xs font-bold uppercase tracking-widest text-foursys-blue mb-1">Metodologia</p>
          <h4 className="text-xl font-black text-white">THE SOLUTION: Foursys AI-Augmented Squad</h4>
          <p className="text-sm text-foursys-text-muted mt-1">SDD Framework — Metodologia completa com +20 agentes especializados</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionServices() {
  const [filter, setFilter] = useState('Todos')

  const filtered = filter === 'Todos'
    ? serviceLines
    : serviceLines.filter(s => SERVICE_FILTER[s.id] === filter)

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-blue mb-2">
                O que fazemos
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-none">
                Linhas de Serviço
              </h2>
              <p className="text-foursys-text-muted mt-2 text-base max-w-lg leading-relaxed">
                8 capacidades cobrindo toda a jornada — do core banking legado à IA em produção.
              </p>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    filter === f
                      ? 'bg-foursys-blue/20 border border-foursys-blue/40 text-foursys-blue'
                      : 'bg-white/[0.04] border border-white/[0.08] text-foursys-text-dim hover:text-foursys-text-muted hover:border-white/20'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Divisor */}
          <div className="mt-6 h-px bg-gradient-to-r from-foursys-blue/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Featured card apenas no filtro "Todos" */}
          {filter === 'Todos' && <FeaturedServiceCard />}

          {filtered.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>

        {/* ── Slide metodologia ── */}
        {filter === 'Todos' && <SquadSlidePanel />}

      </div>
    </SectionWrapper>
  )
}
