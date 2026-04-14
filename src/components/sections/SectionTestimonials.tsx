import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Quote, MessageCircle, Star, ArrowRight } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { getCases } from '../../data/cases'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'

const SECTOR_ACCENT: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'Saúde':      { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  'Healthcare': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  'Financeiro': { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/20',    dot: 'bg-blue-400' },
  'Financial':  { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/20',    dot: 'bg-blue-400' },
  'Seguros':    { bg: 'bg-violet-500/10',   text: 'text-violet-400',  border: 'border-violet-500/20',  dot: 'bg-violet-400' },
  'Insurance':  { bg: 'bg-violet-500/10',   text: 'text-violet-400',  border: 'border-violet-500/20',  dot: 'bg-violet-400' },
  'Varejo':     { bg: 'bg-amber-500/10',    text: 'text-amber-400',   border: 'border-amber-500/20',   dot: 'bg-amber-400' },
  'Retail':     { bg: 'bg-amber-500/10',    text: 'text-amber-400',   border: 'border-amber-500/20',   dot: 'bg-amber-400' },
  'Indústria':  { bg: 'bg-indigo-500/10',   text: 'text-indigo-400',  border: 'border-indigo-500/20',  dot: 'bg-indigo-400' },
  'Industry':   { bg: 'bg-indigo-500/10',   text: 'text-indigo-400',  border: 'border-indigo-500/20',  dot: 'bg-indigo-400' },
}

const DEFAULT_ACCENT = { bg: 'bg-foursys-primary/10', text: 'text-foursys-primary', border: 'border-foursys-primary/20', dot: 'bg-foursys-primary' }

export function SectionTestimonials() {
  const { navigate } = useApp()
  const { t, lang } = useLanguage()
  const cases = useMemo(() => getCases(lang), [lang])
  const testimonials = useMemo(() => cases
    .filter(c => c.testimonial)
    .map(c => ({
      caseId: c.id,
      quote: c.testimonial!.quote,
      author: c.testimonial!.author,
      role: c.testimonial!.role,
      sector: c.sector,
      caseTitle: c.title,
      caseType: c.type,
      metric: c.metric,
    })), [cases])
  const [activeSector, setActiveSector] = useState('Todos')
  const sectors = ['Todos', ...Array.from(new Set(testimonials.map(tm => tm.sector)))]
  const filtered = activeSector === 'Todos' ? testimonials : testimonials.filter(tm => tm.sector === activeSector)

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-12 max-w-5xl mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14"
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={16} className="text-foursys-primary" />
            <p className="text-xs text-foursys-text-dim uppercase tracking-wider font-bold">{t('testimonials.badge')}</p>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-sm md:text-base text-foursys-text-muted max-w-2xl leading-relaxed">
            {t('testimonials.subtitle')}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {testimonials.slice(0, 4).map((t, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-foursys-primary/15 border-2 border-foursys-dark flex items-center justify-center text-[10px] font-bold text-foursys-primary"
                  >
                    {t.author.charAt(0)}
                  </div>
                ))}
              </div>
              <span className="text-xs text-foursys-text-dim">
                <span className="text-white font-bold">{testimonials.length}</span> {t('testimonials.count')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={14} className="fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs text-foursys-text-dim ml-1">{t('testimonials.satisfaction')}</span>
            </div>
          </div>
        </motion.div>

        {/* Sector filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {sectors.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setActiveSector(s)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                activeSector === s
                  ? 'bg-foursys-primary/20 border-foursys-primary/40 text-foursys-primary'
                  : 'border-white/[0.1] text-foursys-text-muted hover:border-white/[0.2] hover:text-white'
              }`}
            >
              {s === 'Todos' ? t('testimonials.filterAll') : s}
            </button>
          ))}
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item, i) => {
            const accent = SECTOR_ACCENT[item.sector] ?? DEFAULT_ACCENT

            return (
              <motion.article
                key={`${item.author}-${item.sector}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                className={`relative p-6 md:p-8 rounded-2xl border ${accent.border} ${accent.bg} backdrop-blur-sm overflow-hidden group hover:border-white/[0.15] transition-all duration-300`}
              >
                {/* Decorative */}
                <div className="absolute top-4 right-4 opacity-[0.06]">
                  <Quote size={80} />
                </div>

                {/* Sector badge */}
                <div className="flex items-center gap-2 mb-5">
                  <span className={`w-2 h-2 rounded-full ${accent.dot}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${accent.text}`}>
                    {item.sector}
                  </span>
                  {item.metric && (
                    <>
                      <span className="text-foursys-text-dim/30">·</span>
                      <span className={`text-[10px] font-bold ${accent.text}`}>{item.metric.value} {item.metric.label}</span>
                    </>
                  )}
                </div>

                {/* Quote */}
                <div className="relative z-10 mb-6">
                  <Quote size={18} className="text-foursys-primary/40 mb-3" />
                  <p className="text-sm md:text-base text-foursys-text-muted italic leading-relaxed">
                    {item.quote}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 relative z-10">
                  <div className={`w-11 h-11 rounded-full ${accent.bg} border ${accent.border} flex items-center justify-center text-sm font-bold ${accent.text}`}>
                    {item.author.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white">{item.author}</div>
                    <div className="text-[11px] text-foursys-text-dim">{item.role}</div>
                  </div>
                </div>

                {/* Case link */}
                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-foursys-text-dim uppercase tracking-wider mb-0.5">{t('testimonials.relatedCase')}</div>
                      <div className="text-xs font-semibold text-foursys-text-muted">{item.caseTitle}</div>
                      <div className="text-[10px] text-foursys-text-dim">{item.caseType}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('cases', item.caseId)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-foursys-primary hover:text-foursys-cyan transition-colors group/link"
                    >
                      {t('testimonials.viewCase')}
                      <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 md:mt-16 text-center"
        >
          <p className="text-sm text-foursys-text-muted mb-4">
            {t('testimonials.ctaQuestion')}
          </p>
          <button
            type="button"
            onClick={() => navigate('cases')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foursys-primary/15 border border-foursys-primary/30 hover:bg-foursys-primary/25 hover:border-foursys-primary/50 text-foursys-primary font-semibold text-sm transition-all duration-200"
          >
            {t('testimonials.ctaButton')}
            <ArrowRight size={16} />
          </button>
        </motion.div>

      </div>
    </SectionWrapper>
  )
}
