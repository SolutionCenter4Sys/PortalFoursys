import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { DynIcon } from '../../utils/iconMap'
import { useLanguage } from '../../i18n'
import { timeline } from '../../data/kpis'
import { useApp } from '../../context/AppContext'

const ERA_STYLES: Record<string, { color: string; glow: string; bg: string; border: string }> = {
  // PT
  Origem:            { color: '#FF6600', glow: 'rgba(255,102,0,0.4)',  bg: 'from-orange-500/12 to-orange-600/4', border: 'border-orange-500/25' },
  Crescimento:       { color: '#00C2E0', glow: 'rgba(0,194,224,0.4)',  bg: 'from-cyan-500/12 to-cyan-600/4',     border: 'border-cyan-500/25' },
  'Expansão Global': { color: '#8B5CF6', glow: 'rgba(139,92,246,0.4)', bg: 'from-violet-500/12 to-violet-600/4', border: 'border-violet-500/25' },
  Inovação:          { color: '#4ADE80', glow: 'rgba(74,222,128,0.4)', bg: 'from-green-500/12 to-green-600/4',   border: 'border-green-500/25' },
  Futuro:            { color: '#FACC15', glow: 'rgba(250,204,21,0.4)', bg: 'from-yellow-500/12 to-yellow-600/4', border: 'border-yellow-500/25' },
  // EN
  Origin:              { color: '#FF6600', glow: 'rgba(255,102,0,0.4)',  bg: 'from-orange-500/12 to-orange-600/4', border: 'border-orange-500/25' },
  Growth:              { color: '#00C2E0', glow: 'rgba(0,194,224,0.4)',  bg: 'from-cyan-500/12 to-cyan-600/4',     border: 'border-cyan-500/25' },
  'Global Expansion':  { color: '#8B5CF6', glow: 'rgba(139,92,246,0.4)', bg: 'from-violet-500/12 to-violet-600/4', border: 'border-violet-500/25' },
  Innovation:          { color: '#4ADE80', glow: 'rgba(74,222,128,0.4)', bg: 'from-green-500/12 to-green-600/4',   border: 'border-green-500/25' },
  Future:              { color: '#FACC15', glow: 'rgba(250,204,21,0.4)', bg: 'from-yellow-500/12 to-yellow-600/4', border: 'border-yellow-500/25' },
}

const DEFAULT_ERA = { color: '#FF6600', glow: 'rgba(255,102,0,0.3)', bg: 'from-white/5 to-transparent', border: 'border-white/10' }

export function SectionTimeline() {
  const { navigate } = useApp()
  const { t } = useLanguage()
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [activeEra, setActiveEra] = useState<string | null>(null)

  const eras = useMemo(() => {
    const seen = new Set<string>()
    return timeline
      .map(t => t.era)
      .filter((e): e is string => {
        if (!e || seen.has(e)) return false
        seen.add(e)
        return true
      })
  }, [])

  const filteredTimeline = activeEra
    ? timeline.filter(t => t.era === activeEra)
    : timeline

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-primary/15 border border-foursys-primary/30 text-foursys-cyan text-sm mb-4">
            {t('timeline.badge')}
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-3">
            {t('timeline.title')}
          </h2>
          <p className="text-base md:text-lg text-foursys-text-muted max-w-2xl mx-auto leading-relaxed">
            {t('timeline.subtitle')}
          </p>
        </motion.div>

        {/* Era filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          <button
            onClick={() => setActiveEra(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
              !activeEra
                ? 'bg-foursys-primary/20 border-foursys-primary/40 text-foursys-primary'
                : 'bg-white/[0.03] border-white/[0.08] text-foursys-text-dim hover:text-foursys-text-muted hover:border-white/15'
            }`}
          >
            {t('common.all')}
          </button>
          {eras.map(era => {
            const style = ERA_STYLES[era] ?? DEFAULT_ERA
            const isActive = activeEra === era
            return (
              <button
                key={era}
                onClick={() => setActiveEra(isActive ? null : era)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                  isActive
                    ? 'text-white'
                    : 'bg-white/[0.03] border-white/[0.08] text-foursys-text-dim hover:text-foursys-text-muted hover:border-white/15'
                }`}
                style={isActive ? {
                  backgroundColor: `${style.color}20`,
                  borderColor: `${style.color}50`,
                  color: style.color,
                } : undefined}
              >
                {era}
              </button>
            )
          })}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Central line */}
          <div className="absolute left-[23px] md:left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-foursys-primary/30 via-white/[0.08] to-transparent" />

          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {filteredTimeline.map((item, i) => {
                const eraStyle = ERA_STYLES[item.era ?? ''] ?? DEFAULT_ERA
                const isExpanded = expandedIdx === i
                const isHighlight = item.highlight

                return (
                  <motion.div
                    key={`${item.year}-${item.title}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                    className="relative pl-14 md:pl-16"
                  >
                    {/* Dot + icon */}
                    <div
                      className="absolute left-0 top-4 w-[18px] h-[18px] md:w-[22px] md:h-[22px] rounded-full flex items-center justify-center z-10"
                      style={{
                        backgroundColor: isHighlight ? eraStyle.color : '#1a1b2e',
                        border: `2px solid ${eraStyle.color}`,
                        boxShadow: isHighlight ? `0 0 14px ${eraStyle.glow}` : 'none',
                      }}
                    >
                      {isHighlight && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>

                    {/* Card */}
                    <button
                      type="button"
                      onClick={() => setExpandedIdx(isExpanded ? null : i)}
                      className={`w-full text-left rounded-2xl border backdrop-blur-sm transition-all duration-300 overflow-hidden group ${
                        isHighlight
                          ? `bg-gradient-to-br ${eraStyle.bg} ${eraStyle.border} shadow-lg`
                          : 'bg-foursys-surface/30 border-white/[0.07] hover:border-white/15'
                      }`}
                      style={isHighlight ? { boxShadow: `0 4px 30px ${eraStyle.glow.replace('0.4', '0.08')}` } : undefined}
                    >
                      <div className="p-4 md:p-5">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          {item.icon && (
                            <div
                              className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{
                                backgroundColor: `${eraStyle.color}15`,
                                border: `1px solid ${eraStyle.color}25`,
                              }}
                            >
                              <DynIcon name={item.icon} size={18} style={{ color: eraStyle.color }} />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            {/* Year + Era badge */}
                            <div className="flex items-center gap-2 mb-1.5">
                              <span
                                className="text-xs font-black px-2 py-0.5 rounded-md"
                                style={{
                                  backgroundColor: `${eraStyle.color}18`,
                                  color: eraStyle.color,
                                }}
                              >
                                {item.year}
                              </span>
                              {item.era && (
                                <span className="text-[10px] font-semibold text-foursys-text-dim uppercase tracking-wider">
                                  {item.era}
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className={`font-bold text-sm md:text-base leading-snug mb-1 ${
                              isHighlight ? 'text-white' : 'text-foursys-text-muted'
                            }`}>
                              {item.title}
                            </h3>

                            {/* Description (always visible, truncated) */}
                            <p className={`text-xs md:text-sm leading-relaxed ${
                              isExpanded ? '' : 'line-clamp-2'
                            } text-foursys-text-dim`}>
                              {item.description}
                            </p>
                          </div>

                          {/* KPI badge + expand arrow */}
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            {item.kpi && (
                              <div className="text-right">
                                <div
                                  className="text-lg md:text-xl font-black leading-none"
                                  style={{ color: eraStyle.color }}
                                >
                                  {item.kpi.value}
                                </div>
                                <div className="text-[9px] md:text-[10px] text-foursys-text-dim uppercase tracking-wider mt-0.5 leading-tight max-w-[80px]">
                                  {item.kpi.label}
                                </div>
                              </div>
                            )}
                            <ChevronDown
                              size={14}
                              className={`text-foursys-text-dim transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>

                        {/* Expanded content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-3 border-t border-white/[0.06]">
                                <p className="text-sm text-foursys-text-muted leading-relaxed">
                                  {item.description}
                                </p>
                                {item.kpi && (
                                  <div
                                    className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                                    style={{
                                      backgroundColor: `${eraStyle.color}10`,
                                      border: `1px solid ${eraStyle.color}20`,
                                    }}
                                  >
                                    <span className="text-sm font-black" style={{ color: eraStyle.color }}>
                                      {item.kpi.value}
                                    </span>
                                    <span className="text-xs text-foursys-text-muted">
                                      {item.kpi.label}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-8 pt-6 border-t border-white/[0.06]"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            <div>
              <p className="text-sm font-bold text-white">{t('timeline.ctaTitle')}</p>
              <p className="text-xs text-foursys-text-dim mt-0.5">
                {t('timeline.ctaSubtitle')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('clients-showcase')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foursys-primary/15 border border-foursys-primary/30 hover:bg-foursys-primary/25 hover:border-foursys-primary/50 text-foursys-primary text-sm font-semibold transition-all duration-200 group"
            >
              {t('timeline.ctaButton')}
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>

      </div>
    </SectionWrapper>
  )
}
