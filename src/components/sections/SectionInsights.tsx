import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { insights, insightCategories } from '../../data/insights'
import { useApp } from '../../context/AppContext'

export function SectionInsights() {
  const { navigate } = useApp()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = activeCategory
    ? insights.filter(i => i.category === activeCategory)
    : insights

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 md:mb-10"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-blue mb-2">
            Thought Leadership
          </p>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-none mb-3">
            Insights Foursys
          </h2>
          <p className="text-foursys-text-muted max-w-2xl text-sm md:text-base leading-relaxed">
            Visões estratégicas e técnicas sobre os temas que movem a transformação digital
            nas empresas que atendemos.
          </p>
          <div className="mt-5 h-px bg-gradient-to-r from-foursys-blue/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              activeCategory === null
                ? 'bg-foursys-blue/20 border-foursys-blue/40 text-foursys-blue'
                : 'border-white/[0.1] text-foursys-text-muted hover:border-white/[0.2]'
            }`}
          >
            Todos
          </button>
          {insightCategories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-foursys-blue/20 border-foursys-blue/40 text-foursys-blue'
                  : 'border-white/[0.1] text-foursys-text-muted hover:border-white/[0.2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {filtered.map((insight, i) => {
            const isExpanded = expandedId === insight.id

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.35 }}
                className="rounded-2xl border border-white/[0.08] overflow-hidden transition-all duration-300 hover:border-white/[0.15]"
                style={{
                  background: `linear-gradient(145deg, ${insight.color}06 0%, transparent 50%), rgba(255,255,255,0.015)`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : insight.id)}
                  className="w-full text-left p-5 md:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest"
                        style={{ color: insight.color }}
                      >
                        {insight.category}
                      </span>
                      <h3 className="text-sm md:text-base font-black text-white leading-snug mt-1 mb-2">
                        {insight.title}
                      </h3>
                      <p className="text-xs text-foursys-text-muted leading-relaxed">
                        {insight.excerpt}
                      </p>
                    </div>
                    <div className="flex-shrink-0 mt-1">
                      {isExpanded
                        ? <ChevronUp size={18} className="text-foursys-text-dim" />
                        : <ChevronDown size={18} className="text-foursys-text-dim" />
                      }
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[10px] text-foursys-text-dim">{insight.date}</span>
                    <span className="text-[10px] text-foursys-text-dim">·</span>
                    <span className="flex items-center gap-1 text-[10px] text-foursys-text-dim">
                      <Clock size={10} /> {insight.readTime}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                        <div className="h-px bg-white/[0.06] mb-4" />
                        <p className="text-sm text-foursys-text-muted leading-relaxed mb-4">
                          {insight.content}
                        </p>
                        {insight.sectionLink && (
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation()
                              navigate(insight.sectionLink!)
                            }}
                            className="flex items-center gap-2 text-xs font-semibold text-foursys-blue hover:text-foursys-cyan transition-colors"
                          >
                            Explorar seção <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
