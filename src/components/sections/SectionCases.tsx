import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, X, Quote, Shield, CheckCircle2, ChevronRight, Clock, Layers, Target, Wrench, Trophy, Search, Mic, MicOff } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { getCases } from '../../data/cases'
import { useVoiceSearch } from '../../hooks/useVoiceSearch'
import { useLanguage } from '../../i18n'
import type { CaseStudy } from '../../types'

function MetricBar({ value, label, index }: { value: string; label: string; index: number }) {
  const numMatch = value.match(/(\d+)/)
  const pct = numMatch ? Math.min(parseInt(numMatch[1]), 100) : null
  return (
    <div className="p-4 rounded-xl bg-foursys-surface/40 border border-white/[0.08] text-center">
      <div className="text-lg md:text-2xl font-black text-foursys-primary">{value}</div>
      <div className="text-[9px] text-foursys-text-dim mt-1 uppercase tracking-wider">{label}</div>
      {pct !== null && (
        <div className="mt-2 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-foursys-primary to-amber-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, delay: 0.3 + index * 0.15 }}
          />
        </div>
      )}
    </div>
  )
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function caseMatchesQuery(c: CaseStudy, q: string): boolean {
  const n = norm(q)
  const fields = [
    c.title, c.client, c.sector, c.type, c.challenge, c.solution,
    c.overview ?? '',
    ...(c.results ?? []),
    ...(c.stack ?? []),
    c.detail?.context ?? '',
    c.detail?.delivery ?? '',
    c.detail?.technicalDetails ?? '',
    c.detail?.challengesOvercome ?? '',
    c.testimonial?.quote ?? '',
  ]
  return fields.some(f => norm(f).includes(n))
}

const SECTOR_COLORS: Record<string, string> = {
  'Saúde':      'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'Healthcare': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'Financeiro': 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  'Financial':  'bg-blue-500/15 text-blue-400 border-blue-500/25',
  'Seguros':    'bg-violet-500/15 text-violet-400 border-violet-500/25',
  'Insurance':  'bg-violet-500/15 text-violet-400 border-violet-500/25',
  'Varejo':     'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'Retail':     'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'Indústria':  'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
  'Industry':   'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
}

const TYPE_BADGE: Record<string, string> = {
  'Modernização de Legado':       'bg-foursys-primary text-white',
  'Legacy Modernization':         'bg-foursys-primary text-white',
  'AI Squad':                      'bg-blue-500 text-white',
  'IA First':                     'bg-violet-500 text-white',
  'AI First':                     'bg-violet-500 text-white',
  'Engenharia de Dados':          'bg-amber-500 text-white',
  'Data Engineering':             'bg-amber-500 text-white',
  'Dados & Inteligência':         'bg-amber-500 text-white',
  'Data & Intelligence':          'bg-amber-500 text-white',
  'Cibersegurança & Zero Trust':  'bg-red-500 text-white',
  'Cybersecurity & Zero Trust':   'bg-red-500 text-white',
  'Agilidade & Org Design':       'bg-indigo-500 text-white',
  'Agility & Org Design':        'bg-indigo-500 text-white',
  'Automação de Processos':       'bg-orange-500 text-white',
  'Process Automation':           'bg-orange-500 text-white',
  'Squad Gerenciada':             'bg-sky-500 text-white',
  'Managed Squad':                'bg-sky-500 text-white',
  'Plataforma PEGA':              'bg-teal-500 text-white',
  'PEGA Platform':                'bg-teal-500 text-white',
  'Consultoria de Arquitetura':   'bg-slate-500 text-white',
  'Architecture Consulting':      'bg-slate-500 text-white',
  'Produto Digital':              'bg-emerald-500 text-white',
  'Digital Product':              'bg-emerald-500 text-white',
  'Open Finance':                 'bg-green-500 text-white',
  'Inovação':                     'bg-yellow-500 text-black',
  'Innovation':                   'bg-yellow-500 text-black',
  'Meios de Pagamento':           'bg-cyan-500 text-white',
  'Payment Methods':              'bg-cyan-500 text-white',
  'DevOps & Cloud':               'bg-lime-500 text-black',
  'UX & Design':                  'bg-rose-500 text-white',
}

function CaseCard({ c, index, onOpen }: { c: CaseStudy; index: number; onOpen: () => void }) {
  const { t } = useLanguage()
  const sectorStyle = SECTOR_COLORS[c.sector] ?? 'bg-white/10 text-white/70 border-white/20'
  const typeBadge = TYPE_BADGE[c.type] ?? 'bg-foursys-primary text-white'

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.06, duration: 0.5 }}
      onClick={onOpen}
      className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-foursys-surface/20 overflow-hidden hover:border-white/[0.15] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(255,102,0,0.08)]"
    >
      {/* Image area */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        {c.image ? (
          <img
            src={c.image}
            alt={c.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-foursys-dark-3 to-foursys-surface flex items-center justify-center">
            <Trophy size={40} className="text-foursys-primary/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${sectorStyle}`}>
            {c.sector}
          </span>
          <span className={`inline-flex px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${typeBadge}`}>
            {c.type}
          </span>
        </div>

        {/* Metric overlay */}
        {c.metric && (
          <div className="absolute top-4 right-4 text-right">
            <div className="text-xl font-black text-white drop-shadow-lg">{c.metric.value}</div>
            <div className="text-[9px] text-white/70 max-w-[120px]">{c.metric.label}</div>
          </div>
        )}

        {/* Title at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-base md:text-lg font-black text-white leading-snug group-hover:text-foursys-primary transition-colors duration-300">
            {c.title}
          </h3>
          <p className="text-[11px] text-white/50 mt-1">{c.client}</p>
        </div>
      </div>

      {/* Content area */}
      <div className="p-5">
        <p className="text-sm text-foursys-text-muted leading-relaxed line-clamp-3">
          {c.overview ?? c.challenge}
        </p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
          <div className="flex flex-wrap gap-1.5">
            {c.stack.slice(0, 3).map(tech => (
              <span key={tech} className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.06] text-foursys-text-dim border border-white/[0.08]">
                {tech}
              </span>
            ))}
            {c.stack.length > 3 && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.06] text-foursys-text-dim">
                +{c.stack.length - 3}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-foursys-primary group-hover:gap-2 transition-all">
            {t('cases.viewCase')} <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

function CaseDetailModal({ c, onClose }: { c: CaseStudy; onClose: () => void }) {
  const { t } = useLanguage()

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={c.title}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed inset-4 sm:inset-8 md:inset-y-8 md:left-[10%] md:right-[10%] z-[61] flex flex-col bg-foursys-dark border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header image */}
        <div className="relative h-44 md:h-56 flex-shrink-0 overflow-hidden">
          {c.image ? (
            <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-foursys-dark-3 to-foursys-surface" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-foursys-dark via-foursys-dark/60 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
            aria-label={t('common.close')}
          >
            <X size={18} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${SECTOR_COLORS[c.sector] ?? 'bg-white/10 text-white/70 border-white/20'}`}>
                {c.sector}
              </span>
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${TYPE_BADGE[c.type] ?? 'bg-foursys-primary text-white'}`}>
                {c.type}
              </span>
            </div>
            <h2 className="text-xl md:text-3xl font-black text-white">{c.title}</h2>
            <p className="text-sm text-white/60 mt-1">{c.client}</p>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar">
          <div className="p-6 md:p-8 space-y-8">

            {/* Key metrics */}
            {(c.detail?.keyMetrics ?? (c.metric ? [c.metric] : [])).length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {(c.detail?.keyMetrics ?? (c.metric ? [c.metric] : [])).map((m, i) => (
                  <MetricBar key={i} value={m.value} label={m.label} index={i} />
                ))}
              </div>
            )}

            {/* Challenge & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-xl bg-red-500/5 border border-red-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <Target size={14} className="text-red-400" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">{t('cases.challenge')}</span>
                </div>
                <p className="text-sm text-foursys-text-muted leading-relaxed">{c.challenge}</p>
              </div>
              <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{t('cases.solution')}</span>
                </div>
                <p className="text-sm text-foursys-text-muted leading-relaxed">{c.solution}</p>
              </div>
            </div>

            {/* Detail sections */}
            {c.detail && (
              <div className="space-y-5">
                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers size={14} className="text-foursys-primary" />
                    <span className="text-xs font-bold text-foursys-primary uppercase tracking-wider">{t('cases.context')}</span>
                  </div>
                  <p className="text-sm text-foursys-text-muted leading-relaxed">{c.detail.context}</p>
                </div>

                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{t('cases.deliveryLabel')}</span>
                  </div>
                  <p className="text-sm text-foursys-text-muted leading-relaxed">{c.detail.delivery}</p>
                </div>

                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench size={14} className="text-sky-400" />
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">{t('cases.technicalDetails')}</span>
                  </div>
                  <p className="text-sm text-foursys-text-muted leading-relaxed">{c.detail.technicalDetails}</p>
                </div>

                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield size={14} className="text-amber-400" />
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{t('cases.challengesOvercome')}</span>
                  </div>
                  <p className="text-sm text-foursys-text-muted leading-relaxed">{c.detail.challengesOvercome}</p>
                </div>

                {c.detail.dimensions && (
                  <div className="flex flex-wrap gap-3">
                    {c.detail.dimensions.features && (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                        <Layers size={12} className="text-foursys-primary" />
                        <span className="text-[11px] text-foursys-text-dim">{t('cases.features')}: <span className="text-white font-semibold">{c.detail.dimensions.features}</span></span>
                      </div>
                    )}
                    {c.detail.dimensions.months && (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                        <Clock size={12} className="text-foursys-primary" />
                        <span className="text-[11px] text-foursys-text-dim">{t('cases.duration')}: <span className="text-white font-semibold">{c.detail.dimensions.months}</span></span>
                      </div>
                    )}
                    {c.detail.dimensions.hours && (
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                        <Clock size={12} className="text-foursys-primary" />
                        <span className="text-[11px] text-foursys-text-dim">{t('cases.hours')}: <span className="text-white font-semibold">{c.detail.dimensions.hours}h</span></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Results */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={14} className="text-foursys-primary" />
                <span className="text-xs font-bold text-foursys-primary uppercase tracking-wider">{t('cases.results')}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {c.results.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.03]">
                    <CheckCircle2 size={14} className="text-foursys-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foursys-text-muted">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack */}
            <div>
              <span className="text-[10px] font-bold text-foursys-text-dim uppercase tracking-wider">{t('cases.techStack')}</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {c.stack.map(tech => (
                  <span key={tech} className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] text-foursys-text-muted border border-white/[0.08] font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            {c.testimonial && (
              <div className="p-6 rounded-xl bg-foursys-primary/5 border border-foursys-primary/15">
                <div className="flex gap-3">
                  <Quote size={20} className="text-foursys-primary/50 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foursys-text-muted italic leading-relaxed mb-3">
                      &ldquo;{c.testimonial.quote}&rdquo;
                    </p>
                    <p className="text-xs font-semibold text-white">
                      {c.testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 md:px-8 py-4 border-t border-white/[0.06] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-foursys-text-dim hover:text-foursys-text transition-colors"
          >
            {t('cases.backToCases')}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foursys-primary/15 border border-foursys-primary/30 hover:bg-foursys-primary/25 text-foursys-primary text-sm font-semibold transition-all"
          >
            {t('cases.similarChallenge')}
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    </>
  )
}

export function SectionCases() {
  const { t, lang } = useLanguage()
  const cases = useMemo(() => getCases(lang), [lang])
  const [filter, setFilter] = useState('Todos')
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const onVoiceResult = useCallback((transcript: string) => {
    setSearchQuery(transcript)
  }, [])
  const voice = useVoiceSearch(onVoiceResult)

  const sectors = ['Todos', ...Array.from(new Set(cases.map(c => c.sector)))]
  const types = ['Todos', ...Array.from(new Set(cases.map(c => c.type)))]
  const [typeFilter, setTypeFilter] = useState('Todos')

  const filtered = cases.filter(c => {
    if (filter !== 'Todos' && c.sector !== filter) return false
    if (typeFilter !== 'Todos' && c.type !== typeFilter) return false
    if (searchQuery.trim() && !caseMatchesQuery(c, searchQuery.trim())) return false
    return true
  })

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilter('Todos')
      setTypeFilter('Todos')
    }
  }, [searchQuery])

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-12 max-w-6xl mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-primary mb-2">{t('cases.badge')}</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            {t('cases.title')}
          </h2>
          <p className="text-sm md:text-base text-foursys-text-muted max-w-2xl leading-relaxed">
            {t('cases.subtitle')}
          </p>

          
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
            voice.status === 'listening'
              ? 'border-foursys-primary/50 bg-foursys-primary/5 shadow-[0_0_20px_rgba(255,102,0,0.12)]'
              : 'border-white/[0.1] bg-foursys-surface/30 focus-within:border-white/[0.25]'
          }`}>
            <Search size={16} className="text-foursys-text-dim shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('cases.searchPlaceholder')}
              className="flex-1 bg-transparent text-sm text-white placeholder-foursys-text-dim outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full hover:bg-white/10 text-foursys-text-dim hover:text-white transition-colors"
                aria-label={t('common.clearSearch')}
              >
                <X size={14} />
              </button>
            )}
            {voice.isSupported && (
              <button
                type="button"
                onClick={voice.toggle}
                className={`p-1.5 rounded-full transition-all ${
                  voice.status === 'listening'
                    ? 'bg-foursys-primary/20 text-foursys-primary animate-pulse'
                    : voice.status === 'error'
                      ? 'text-red-400'
                      : 'text-foursys-text-dim hover:text-white hover:bg-white/10'
                }`}
                aria-label={voice.status === 'listening' ? t('common.listening') : t('common.voiceSearch')}
              >
                {voice.status === 'listening' ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}
          </div>
          {voice.status === 'listening' && (
            <p className="text-[10px] text-foursys-primary mt-1.5 ml-1 animate-pulse">{t('common.listening')}</p>
          )}
          {searchQuery.trim() && (
            <p className="text-[10px] text-foursys-text-dim mt-1.5 ml-1">
              {filtered.length} {t('cases.casesFound')} &ldquo;{searchQuery.trim()}&rdquo;
            </p>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {sectors.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  filter === s
                    ? 'bg-foursys-primary/20 border-foursys-primary/40 text-foursys-primary'
                    : 'border-white/[0.1] text-foursys-text-muted hover:border-white/[0.2] hover:text-white'
                }`}
              >
                {s === 'Todos' ? t('common.allFilter') : s}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {types.map(tp => (
              <button
                key={tp}
                type="button"
                onClick={() => setTypeFilter(tp)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-semibold border transition-all duration-200 ${
                  typeFilter === tp
                    ? 'bg-white/10 border-white/25 text-white'
                    : 'border-white/[0.06] text-foursys-text-dim hover:border-white/[0.15] hover:text-foursys-text-muted'
                }`}
              >
                {tp === 'Todos' ? t('common.allFilter') : tp}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cases grid */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c, i) => (
            <CaseCard key={c.id} c={c} index={i} onOpen={() => setSelectedCase(c)} />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-foursys-text-dim">{t('cases.noResults')}</p>
          </div>
        )}

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 p-5 rounded-xl bg-foursys-surface/30 border border-white/[0.06] flex items-center justify-center gap-4 md:gap-6 flex-wrap"
        >
          {['ISO 9001', 'ISO 27001', 'ISO 27701', 'ISO 14001', 'SAFe', 'GPTW'].map(cert => (
            <div key={cert} className="flex items-center gap-1.5">
              <Shield size={12} className="text-foursys-primary/60" />
              <span className="text-[10px] font-semibold text-foursys-text-dim uppercase tracking-wider">{cert}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 md:mt-16 text-center"
        >
          <p className="text-xs text-foursys-text-dim mb-2">{t('cases.satisfiedClients')}</p>
          <h3 className="text-lg md:text-2xl font-black text-white mb-6">
            {t('cases.ctaQuestion')}
          </h3>
          <div className="flex items-center justify-center gap-3 text-xs text-foursys-text-dim">
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-foursys-primary" /> {t('cases.freeDiagnosis')}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-foursys-primary" /> {t('cases.responseTime')}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-foursys-primary" /> {t('cases.noCommitment')}</span>
          </div>
        </motion.div>

      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedCase && (
          <CaseDetailModal c={selectedCase} onClose={() => setSelectedCase(null)} />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
