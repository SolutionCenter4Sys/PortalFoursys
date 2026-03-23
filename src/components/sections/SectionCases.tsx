import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ArrowRight,
  CheckCircle2,
  Building2,
  TrendingUp,
  ShieldCheck,
  Database,
  Zap,
  Code2,
  ExternalLink,
} from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { cases } from '../../data/cases'
import type { CaseStudy } from '../../types'

// ─── Imagens por case ─────────────────────────────────────────────────────────

const CASE_IMAGE: Record<string, string> = {
  'shi-portal':       '/images/fourchickin-intro-slide-v3.png',
  'quality-ia-impl':  '/images/foursys_deliverables_executive_slide.png',
  'data-lakehouse':   '/images/foursys_ai_augmented_squad_slide_v3.png',
  'modernizacao-core':'/images/foursys_requirements_to_start_slide.png',
  'cyber-compliance': '/images/foursys_ai_augmented_squads_team_v5.png',
}

const CASE_ICON: Record<string, React.ElementType> = {
  'shi-portal':       Building2,
  'quality-ia-impl':  Zap,
  'data-lakehouse':   Database,
  'modernizacao-core':Code2,
  'cyber-compliance': ShieldCheck,
}

// ─── Cores por tipo ───────────────────────────────────────────────────────────

const TYPE_STYLE: Record<string, { badge: string; metric: string; check: string }> = {
  'Produto Digital':    { badge: 'bg-red-500/15 text-red-400 border-red-500/25',       metric: 'text-red-400',    check: 'text-red-400' },
  'Framework / Produto':{ badge: 'bg-blue-500/15 text-blue-400 border-blue-500/25',     metric: 'text-blue-400',   check: 'text-blue-400' },
  'Engenharia de Dados':{ badge: 'bg-violet-500/15 text-violet-400 border-violet-500/25',metric: 'text-violet-400', check: 'text-violet-400' },
  'Modernização':       { badge: 'bg-green-500/15 text-green-400 border-green-500/25',  metric: 'text-green-400',  check: 'text-green-400' },
  'Cyber Security':     { badge: 'bg-orange-500/15 text-orange-400 border-orange-500/25',metric: 'text-orange-400', check: 'text-orange-400' },
}

function getTypeStyle(type: string) {
  return TYPE_STYLE[type] ?? { badge: 'bg-foursys-blue/15 text-foursys-blue border-foursys-blue/25', metric: 'text-foursys-blue', check: 'text-foursys-blue' }
}

// ─── Modal de detalhe ─────────────────────────────────────────────────────────

function CaseModal({ case: c, onClose }: { case: CaseStudy; onClose: () => void }) {
  const style = getTypeStyle(c.type)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 bg-foursys-dark-2 border border-white/[0.12] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Imagem */}
        {CASE_IMAGE[c.id] && (
          <div className="relative h-40 overflow-hidden flex-shrink-0">
            <img
              src={CASE_IMAGE[c.id]}
              alt={c.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-foursys-dark-2/40 to-foursys-dark-2" />
          </div>
        )}

        {/* Conteúdo */}
        <div className="p-7 overflow-y-auto custom-scrollbar flex-1">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 text-foursys-text-muted transition-colors"
          >
            <X size={16} />
          </button>

          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${style.badge} mb-4`}>
            {c.type}
          </span>

          <h3 className="text-2xl font-black text-white mb-1 leading-tight">{c.title}</h3>
          <p className="text-sm text-foursys-text-dim mb-5">{c.client} · {c.sector}</p>

          {/* Métrica hero */}
          {c.metric && (
            <div className="mb-6 p-5 rounded-xl bg-foursys-surface/60 border border-white/[0.06] flex items-center gap-5">
              <TrendingUp size={20} className={style.metric} />
              <div>
                <div className={`text-4xl font-black leading-none ${style.metric}`}>{c.metric.value}</div>
                <div className="text-sm text-foursys-text-muted mt-0.5">{c.metric.label}</div>
              </div>
            </div>
          )}

          <div className="space-y-5">
            {/* Desafio */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-foursys-text-dim mb-2">Desafio</div>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{c.challenge}</p>
            </div>
            {/* Solução */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-foursys-text-dim mb-2">Solução</div>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{c.solution}</p>
            </div>
            {/* Resultados */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-foursys-text-dim mb-2">Resultados</div>
              <ul className="space-y-2">
                {c.results.map(r => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-foursys-text-muted">
                    <CheckCircle2 size={14} className={`${style.check} flex-shrink-0 mt-0.5`} />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            {/* Stack */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-foursys-text-dim mb-2">Stack</div>
              <div className="flex flex-wrap gap-2">
                {c.stack.map(t => (
                  <span key={t} className={`text-xs px-2.5 py-1 rounded-lg border ${style.badge}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Featured case card ───────────────────────────────────────────────────────

function FeaturedCaseCard({ c, onClick }: { c: CaseStudy; onClick: () => void }) {
  const style = getTypeStyle(c.type)
  const Icon  = CASE_ICON[c.id] ?? Building2

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      onClick={onClick}
      className="col-span-full relative rounded-2xl border border-white/[0.1] overflow-hidden cursor-pointer group hover:border-white/20 transition-all duration-300"
    >
      <div className="grid grid-cols-[1fr_400px] h-52">
        {/* Texto */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${style.badge}`}>
                <Icon size={10} />
                {c.type}
              </span>
              <span className="text-[10px] text-foursys-text-dim">{c.sector}</span>
            </div>
            <h3 className="text-2xl font-black text-white leading-tight mb-1">{c.title}</h3>
            <p className="text-sm text-foursys-text-muted">{c.client}</p>
          </div>

          <div className="flex items-end gap-8">
            {c.metric && (
              <div>
                <div className={`text-3xl font-black ${style.metric}`}>{c.metric.value}</div>
                <div className="text-xs text-foursys-text-dim">{c.metric.label}</div>
              </div>
            )}
            <div className={`ml-auto flex items-center gap-1.5 text-sm font-semibold ${style.metric} opacity-0 group-hover:opacity-100 transition-all`}>
              Ver case completo <ArrowRight size={14} />
            </div>
          </div>
        </div>

        {/* Imagem */}
        <div className="relative overflow-hidden">
          {CASE_IMAGE[c.id] ? (
            <img
              src={CASE_IMAGE[c.id]}
              alt={c.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="h-full w-full bg-foursys-surface" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-foursys-dark-2/80 via-foursys-dark-2/20 to-transparent" />
        </div>
      </div>
    </motion.article>
  )
}

// ─── Card regular ─────────────────────────────────────────────────────────────

function CaseCard({ c, index, onClick }: { c: CaseStudy; index: number; onClick: () => void }) {
  const style = getTypeStyle(c.type)
  const Icon  = CASE_ICON[c.id] ?? Building2

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.4 }}
      layout
      onClick={onClick}
      className="group rounded-2xl border border-white/[0.08] bg-foursys-surface/30 overflow-hidden cursor-pointer hover:border-white/[0.16] hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Imagem */}
      {CASE_IMAGE[c.id] && (
        <div className="h-36 relative overflow-hidden flex-shrink-0">
          <img
            src={CASE_IMAGE[c.id]}
            alt={c.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foursys-dark-2/90 via-foursys-dark-2/20 to-transparent" />
          <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${style.badge}`}>
            <Icon size={9} />
            {c.type}
          </span>
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[10px] text-foursys-text-dim mb-1.5 tracking-wide">{c.sector} · {c.client}</p>
        <h3 className="font-bold text-white text-sm leading-snug mb-3">{c.title}</h3>

        {/* Métrica */}
        {c.metric && (
          <div className="mb-3">
            <span className={`text-2xl font-black ${style.metric}`}>{c.metric.value}</span>
            <span className="text-xs text-foursys-text-dim ml-2">{c.metric.label}</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {c.stack.slice(0, 3).map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-foursys-text-dim">
              {t}
            </span>
          ))}
          {c.stack.length > 3 && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-foursys-text-dim">
              +{c.stack.length - 3}
            </span>
          )}
        </div>

        <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${style.metric} opacity-0 group-hover:opacity-100 transition-opacity`}>
          Detalhes <ArrowRight size={11} />
        </div>
      </div>
    </motion.article>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionCases() {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null)
  const [filter, setFilter] = useState('Todos')

  const sectors  = ['Todos', ...Array.from(new Set(cases.map(c => c.sector)))]
  const filtered = filter === 'Todos' ? cases : cases.filter(c => c.sector === filter)

  const [featured, ...rest] = cases

  return (
    <SectionWrapper>
      <div className="px-8 py-10 max-w-7xl mx-auto">

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
                Resultados reais
              </p>
              <h2 className="text-4xl font-black text-white leading-none">
                Cases de Sucesso
              </h2>
              <p className="text-foursys-text-muted mt-2 text-base max-w-lg leading-relaxed">
                Projetos entregues com métricas mensuráveis — do core banking à IA em produção.
              </p>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              {sectors.map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    filter === s
                      ? 'bg-foursys-blue/20 border border-foursys-blue/40 text-foursys-blue'
                      : 'bg-white/[0.04] border border-white/[0.08] text-foursys-text-dim hover:text-foursys-text-muted hover:border-white/20'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 h-px bg-gradient-to-r from-foursys-blue/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-3 gap-5">
          {/* Featured apenas no filtro "Todos" */}
          {filter === 'Todos' && (
            <FeaturedCaseCard c={featured} onClick={() => setSelectedCase(featured)} />
          )}

          {(filter === 'Todos' ? rest : filtered).map((c, i) => (
            <CaseCard key={c.id} c={c} index={i} onClick={() => setSelectedCase(c)} />
          ))}
        </div>

        {/* ── Footer stats ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 pt-8 border-t border-white/[0.06] grid grid-cols-4 gap-6"
        >
          {[
            { value: '17+',   label: 'Anos no Santander' },
            { value: '110',   label: 'Projetos ativos' },
            { value: '99,9%', label: 'SLA entregue' },
            { value: '3,6%',  label: 'Turnover vs 22% do mercado' },
          ].map((stat, i) => (
            <div key={i} className="border-l-2 border-foursys-blue/40 pl-4">
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-foursys-text-muted mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>

      </div>

      <AnimatePresence>
        {selectedCase && <CaseModal case={selectedCase} onClose={() => setSelectedCase(null)} />}
      </AnimatePresence>
    </SectionWrapper>
  )
}
