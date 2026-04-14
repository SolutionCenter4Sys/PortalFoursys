import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Clock, ChevronDown, ChevronUp, BookOpen, Mic, Video, FileText, Award, Search as SearchIcon } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { getInsights, getInsightCategories, type Insight, type InsightType } from '../../data/insights'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'

const typeIcons: Record<InsightType, React.ReactNode> = {
  'Artigo': <BookOpen size={12} />,
  'Pesquisa': <SearchIcon size={12} />,
  'Relatório': <FileText size={12} />,
  'Caso de Sucesso': <Award size={12} />,
  'Podcast': <Mic size={12} />,
  'Webinar': <Video size={12} />,
  'Article': <BookOpen size={12} />,
  'Research': <SearchIcon size={12} />,
  'Report': <FileText size={12} />,
  'Case Study': <Award size={12} />,
}

const badgeStyles: Record<string, string> = {
  'Novo': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Em destaque': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Urgente': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Gravação': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'Pesquisa 2026': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Relatório 2026': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Caso Real': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
}

const insightImages: Record<string, string> = {
  'ia-first-roi':          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=480&q=70&auto=format',
  'modernizacao-ondas':    'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=480&q=70&auto=format',
  'turnover-squads':       'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=480&q=70&auto=format',
  'lead-time-case':        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480&q=70&auto=format',
  'governanca-ia-2026':    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=480&q=70&auto=format',
  'agentes-ia-producao':   'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=480&q=70&auto=format',
  'zero-trust-regulados':  'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=480&q=70&auto=format',
  'lgpd-multas-2026':      'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=480&q=70&auto=format',
  'finops-ia-custo':       'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=480&q=70&auto=format',
  'multicloud-estrategia': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=480&q=70&auto=format',
  'data-mesh-brasil':      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=480&q=70&auto=format',
  'observabilidade-case':  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=480&q=70&auto=format',
  'dilemas-cto-2026':      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=480&q=70&auto=format',
  'podcast-transformacao':  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=480&q=70&auto=format',
  'webinar-ia-saude':      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=480&q=70&auto=format',
  'safe-pratica':          'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=480&q=70&auto=format',
}

function InsightCard({ insight, index, featured = false }: { insight: Insight; index: number; featured?: boolean }) {
  const { navigate, setDeepDiveHint } = useApp()
  const { t, lang } = useLanguage()
  const [expanded, setExpanded] = useState(false)

  const typeLabel = (type: InsightType): string => {
    const map: Record<string, string> = {
      'Artigo': t('insights.types.article'),
      'Pesquisa': t('insights.types.research'),
      'Relatório': t('insights.types.report'),
      'White Paper': t('insights.types.whitepaper'),
    }
    return map[type] ?? type
  }

  const badgeLabel = (badge: string): string => {
    const map: Record<string, string> = {
      'Novo': t('insights.badges.new'),
      'Em destaque': t('insights.badges.featured'),
    }
    return map[badge] ?? badge
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(0.06 * index, 0.6), duration: 0.4 }}
      className={`group rounded-2xl border border-white/[0.08] overflow-hidden hover:border-white/[0.16] transition-all duration-300 ${featured ? 'flex flex-col' : ''}`}
      style={{ background: `linear-gradient(160deg, ${insight.color}08 0%, transparent 40%), rgba(255,255,255,0.015)` }}
    >
      {/* Image banner */}
      <div
        className={`relative overflow-hidden ${featured ? 'h-36 md:h-44' : 'h-24 md:h-28'} flex items-end p-5`}
      >
        {insightImages[insight.id] && (
          <img
            src={insightImages[insight.id]}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className={`absolute inset-0 bg-gradient-to-br ${insight.gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,20,0.95)] via-[rgba(10,12,20,0.4)] to-transparent" />
        <div className="relative z-10 flex items-center gap-2 flex-wrap">
          {insight.badge && (
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeStyles[insight.badge] ?? 'bg-white/10 text-white/70 border-white/20'}`}>
              {badgeLabel(insight.badge)}
            </span>
          )}
          <span
            className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.12]"
            style={{ color: insight.color }}
          >
            {typeIcons[insight.type]}
            {typeLabel(insight.type)}
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-foursys-text-muted border border-white/[0.08]">
            {insight.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-left w-full"
        >
          <h3 className={`font-black text-white leading-snug mb-2 group-hover:text-foursys-cyan transition-colors ${featured ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}>
            {insight.title}
          </h3>
          <p className={`text-foursys-text-muted leading-relaxed mb-4 ${featured ? 'text-sm' : 'text-xs'}`}>
            {insight.excerpt}
          </p>
        </button>

        <div className="mt-auto">
          <div className="flex items-center gap-3 text-[10px] text-foursys-text-dim mb-3">
            <span>{insight.date}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={10} /> {insight.readTime} {t('insights.readTime')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: `${insight.color}33`, border: `1px solid ${insight.color}55` }}
              >
                {insight.author.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="text-[11px] font-semibold text-foursys-text">{insight.author.name}</div>
                <div className="text-[9px] text-foursys-text-dim">{insight.author.role}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              {expanded
                ? <ChevronUp size={16} className="text-foursys-text-dim" />
                : <ChevronDown size={16} className="text-foursys-text-dim" />
              }
            </button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-white/[0.06]">
                <p className="text-sm text-foursys-text-muted leading-relaxed mb-4">
                  {insight.content}
                </p>
                {insight.sectionLink && (
                  <button
                    type="button"
                    onClick={() => {
                      if (insight.detailId && insight.sectionLink === 'services') {
                        setDeepDiveHint(insight.detailId)
                      }
                      navigate(insight.sectionLink!, insight.detailId)
                    }}
                    className="flex items-center gap-2 text-xs font-semibold text-foursys-primary hover:text-foursys-cyan transition-colors"
                  >
                    {lang === 'pt' ? 'Explorar seção' : 'Explore section'} <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}

export function SectionInsights() {
  const { t, lang } = useLanguage()
  const insights = useMemo(() => getInsights(lang), [lang])
  const insightCategories = useMemo(() => getInsightCategories(lang), [lang])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const featured = insights.filter(i => i.featured)
  const regular = activeCategory
    ? insights.filter(i => !i.featured && i.category === activeCategory)
    : insights.filter(i => !i.featured)

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-12 max-w-6xl mx-auto">

        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-foursys-primary mb-3">
            {t('insights.badge')}
          </p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            {t('insights.title')}
          </h2>
          <p className="text-sm md:text-base text-foursys-text-muted max-w-2xl mx-auto leading-relaxed">
            {t('insights.subtitle')}
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8 justify-center"
        >
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
              activeCategory === null
                ? 'bg-foursys-primary/20 border-foursys-primary/40 text-foursys-primary'
                : 'border-white/[0.1] text-foursys-text-muted hover:border-white/[0.2] hover:text-white'
            }`}
          >
            {t('common.allFilter')}
          </button>
          {insightCategories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-foursys-primary/20 border-foursys-primary/40 text-foursys-primary'
                  : 'border-white/[0.1] text-foursys-text-muted hover:border-white/[0.2] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Featured section */}
        {!activeCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-sm font-bold text-foursys-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-foursys-primary" />
              {t('insights.badges.featured')}
            </h3>
            <p className="text-xs text-foursys-text-dim mb-5">
              {lang === 'pt' ? 'Leituras recomendadas' : 'Recommended reads'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {featured.map((insight, i) => (
                <InsightCard key={insight.id} insight={insight} index={i} featured />
              ))}
            </div>
          </motion.div>
        )}

        {/* Divider */}
        {!activeCategory && (
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent my-8" />
        )}

        {/* All articles count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-between mb-5"
        >
          <span className="text-sm text-foursys-text-dim">
            {regular.length + (activeCategory ? 0 : featured.length)} {lang === 'pt' ? 'publicações' : 'publications'}
          </span>
          {activeCategory && (
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className="text-xs text-foursys-primary hover:text-foursys-cyan transition-colors flex items-center gap-1"
            >
              {lang === 'pt' ? 'Ver todos' : 'View all'} <ArrowRight size={12} />
            </button>
          )}
        </motion.div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {(activeCategory ? insights.filter(i => i.category === activeCategory) : regular).map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} index={i} />
          ))}
        </div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 md:mt-16 p-6 md:p-10 rounded-2xl bg-gradient-to-br from-foursys-primary/10 via-foursys-surface/50 to-transparent border border-foursys-primary/20 text-center"
        >
          <h3 className="text-lg md:text-2xl font-black text-white mb-2">
            {lang === 'pt' ? 'Newsletter Foursys' : 'Foursys Newsletter'}
          </h3>
          <p className="text-sm text-foursys-text-muted max-w-md mx-auto mb-5">
            {lang === 'pt'
              ? 'Receba os melhores insights direto no seu e-mail. Publicações quinzenais sobre IA, transformação digital, liderança tech e casos reais.'
              : 'Get the best insights straight to your inbox. Biweekly publications on AI, digital transformation, tech leadership and real cases.'}
          </p>
          <div className="flex items-center gap-3 max-w-md mx-auto">
            <div className="flex-1 h-10 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center px-3">
              <span className="text-xs text-foursys-text-dim">{lang === 'pt' ? 'seu@email.com' : 'your@email.com'}</span>
            </div>
            <button
              type="button"
              className="h-10 px-5 rounded-lg bg-foursys-primary text-white text-xs font-bold hover:bg-foursys-primary/80 transition-colors flex-shrink-0"
            >
              {lang === 'pt' ? 'Quero receber' : 'Subscribe'}
            </button>
          </div>
          <p className="text-[10px] text-foursys-text-dim mt-3">
            {lang === 'pt'
              ? 'Sem spam. Cancele a qualquer momento. LGPD compliant.'
              : 'No spam. Cancel anytime. LGPD/GDPR compliant.'}
          </p>
        </motion.div>

      </div>
    </SectionWrapper>
  )
}
