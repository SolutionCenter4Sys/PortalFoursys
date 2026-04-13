import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BrainCircuit, Factory, Bot,
  X, ArrowRight, ChevronRight, Sparkles, TrendingUp,
  Zap, CheckCircle2, Quote,
} from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { useLanguage } from '../../i18n'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { innovationTrends } from '../../data/innovation'
import type { InnovationTrend } from '../../data/innovation'

const ICON_MAP: Record<string, React.ReactNode> = {
  'brain-circuit': <BrainCircuit />,
  'factory': <Factory />,
  'bot': <Bot />,
}

function hexToRgba(hex: string, a: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

// ─── Trend Card ──────────────────────────────────────────────────────────────

function TrendCard({ trend, index, onClick }: { trend: InnovationTrend; index: number; onClick: () => void }) {
  const { t } = useLanguage()
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.5, type: 'spring', stiffness: 120 }}
      className="group relative w-full text-left rounded-3xl overflow-hidden cursor-pointer"
      style={{ minHeight: 280 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: hovered
            ? `linear-gradient(160deg, ${hexToRgba(trend.color, 0.18)} 0%, ${hexToRgba(trend.color, 0.04)} 40%, rgba(10,12,20,0.95) 100%)`
            : `linear-gradient(160deg, ${hexToRgba(trend.color, 0.06)} 0%, rgba(10,12,20,0.95) 100%)`,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Border */}
      <div
        className="absolute inset-0 rounded-3xl transition-all duration-500"
        style={{
          border: hovered ? `1.5px solid ${hexToRgba(trend.color, 0.4)}` : '1.5px solid rgba(255,255,255,0.06)',
        }}
      />

      {/* Top glow line */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
        animate={{ width: hovered ? '80%' : '0%', opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: `linear-gradient(90deg, transparent, ${trend.color}, transparent)` }}
      />

      {/* Large background icon */}
      <motion.div
        className="absolute -right-4 -bottom-4 opacity-[0.04] transition-all duration-700"
        animate={{ opacity: hovered ? 0.08 : 0.03, scale: hovered ? 1.1 : 1 }}
      >
        <div style={{ color: trend.color, width: 200, height: 200 }}>
          {ICON_MAP[trend.icon]}
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 p-7 md:p-8 flex flex-col h-full">
        {/* Icon + Number */}
        <div className="flex items-center justify-between mb-5">
          <motion.div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            animate={{
              boxShadow: hovered
                ? `0 0 30px ${hexToRgba(trend.color, 0.3)}, 0 0 60px ${hexToRgba(trend.color, 0.1)}`
                : `0 0 0 ${hexToRgba(trend.color, 0)}`,
            }}
            transition={{ duration: 0.4 }}
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(trend.color, 0.2)}, ${hexToRgba(trend.color, 0.08)})`,
              border: `1px solid ${hexToRgba(trend.color, 0.3)}`,
              color: trend.color,
            }}
          >
            <div className="w-6 h-6">
              {ICON_MAP[trend.icon]}
            </div>
          </motion.div>

          <span
            className="text-6xl font-black leading-none"
            style={{ color: hexToRgba(trend.color, 0.08) }}
          >
            0{index + 1}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-black text-white leading-tight mb-2 group-hover:text-white/95 transition-colors">
          {trend.title}
        </h3>

        <p
          className="text-xs font-bold uppercase tracking-[0.15em] mb-3 transition-colors duration-300"
          style={{ color: hovered ? trend.color : hexToRgba(trend.color, 0.6) }}
        >
          {trend.tagline}
        </p>

        <p className="text-sm text-foursys-text-muted leading-relaxed mb-5 flex-1">
          {trend.description}
        </p>

        {/* Leaders preview */}
        <div className="flex items-center gap-2 mb-4">
          {trend.leaders.map((l, i) => (
            <span
              key={l.name}
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border transition-all duration-300"
              style={{
                borderColor: hexToRgba(trend.color, hovered ? 0.4 : 0.15),
                color: hexToRgba(trend.color, hovered ? 0.9 : 0.5),
                background: hexToRgba(trend.color, hovered ? 0.1 : 0.03),
                transitionDelay: `${i * 50}ms`,
              }}
            >
              {l.name}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm font-bold transition-all duration-300" style={{ color: trend.color }}>
          {t('innovation.exploreTrend')}
          <motion.div animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={16} />
          </motion.div>
        </div>
      </div>

      {/* Bottom glow */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full pointer-events-none"
        animate={{ opacity: hovered ? 0.5 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(ellipse, ${hexToRgba(trend.color, 0.25)} 0%, transparent 70%)`,
          filter: 'blur(12px)',
        }}
      />
    </motion.button>
  )
}

// ─── Drill-Down Modal ────────────────────────────────────────────────────────

function DrillDownModal({ trend, onClose }: { trend: InnovationTrend; onClose: () => void }) {
  const { t, lang } = useLanguage()
  const trapRef = useFocusTrap(true)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-label={`${lang === 'pt' ? 'Tendência' : 'Trend'}: ${trend.title}`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      <motion.div
        initial={{ scale: 0.92, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
        onClick={e => e.stopPropagation()}
        aria-live="polite"
        ref={trapRef}
        className="relative z-10 w-full max-w-5xl mx-4 my-8 rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(trend.color, 0.08)} 0%, rgba(10,14,22,0.98) 15%, rgba(10,14,22,0.99) 100%)`,
          border: `1px solid ${hexToRgba(trend.color, 0.2)}`,
        }}
      >
        {/* Hero header */}
        <div className="relative overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${trend.gradient} opacity-60`}
            style={{ height: 280 }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(10,14,22,0.99) 100%)', height: 280 }} />

          {/* Decorative elements */}
          <div className="absolute top-6 right-6 z-20">
            <button
              type="button"
              onClick={onClose}
              aria-label={t('common.close')}
              className="p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.12] transition-colors"
            >
              <X size={18} className="text-white/70" />
            </button>
          </div>

          <div className="relative z-10 px-8 md:px-12 pt-10 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4 mb-6"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${hexToRgba(trend.color, 0.3)}, ${hexToRgba(trend.color, 0.1)})`,
                  border: `1.5px solid ${hexToRgba(trend.color, 0.4)}`,
                  boxShadow: `0 0 40px ${hexToRgba(trend.color, 0.2)}`,
                  color: trend.color,
                }}
              >
                <div className="w-7 h-7">{ICON_MAP[trend.icon]}</div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: trend.color }}>
                  {lang === 'pt' ? 'Tendência de Inovação' : 'Innovation Trend'}
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                  {trend.title}
                </h2>
              </div>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {trend.stats.map(s => (
                <div
                  key={s.label}
                  className="p-3 rounded-xl text-center"
                  style={{
                    background: hexToRgba(trend.color, 0.06),
                    border: `1px solid ${hexToRgba(trend.color, 0.12)}`,
                  }}
                >
                  <div className="text-xl md:text-2xl font-black" style={{ color: trend.color }}>{s.value}</div>
                  <div className="text-[9px] text-foursys-text-dim uppercase tracking-wider font-bold mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 md:px-12 pb-10 space-y-8">

          {/* Overview & Why it matters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} style={{ color: trend.color }} />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: trend.color }}>{t('innovation.overview')}</h4>
              </div>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{trend.deepDive.overview}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} style={{ color: trend.color }} />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: trend.color }}>{t('innovation.whyItMatters')}</h4>
              </div>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{trend.deepDive.whyItMatters}</p>
            </div>
          </motion.div>

          {/* Foursys position */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="relative p-6 md:p-8 rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, rgba(255,102,0,0.08), rgba(255,102,0,0.02))`,
              border: '1.5px solid rgba(255,102,0,0.2)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #FF6600, transparent)' }} />
            <div className="flex items-center gap-3 mb-4">
              <Zap size={18} className="text-foursys-primary" />
              <h3 className="text-lg font-black text-white">{t('innovation.foursysPosition')}</h3>
            </div>
            <p className="text-sm text-foursys-text-muted leading-relaxed mb-5">
              {trend.foursysPosition}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {trend.keyCapabilities.map(cap => (
                <div key={cap} className="flex items-center gap-2 text-xs text-white/80">
                  <CheckCircle2 size={12} className="text-foursys-primary flex-shrink-0" />
                  {cap}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Market & Outlook */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} style={{ color: trend.color }} />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: trend.color }}>{t('innovation.marketSize')}</h4>
              </div>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{trend.deepDive.marketSize}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <Quote size={14} style={{ color: trend.color }} />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: trend.color }}>{t('innovation.futureOutlook')}</h4>
              </div>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{trend.deepDive.futureOutlook}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Section ────────────────────────────────────────────────────────────

export function SectionInnovation() {
  const { t, lang } = useLanguage()
  const [activeTrend, setActiveTrend] = useState<InnovationTrend | null>(null)

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">

        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center mb-12"
        >
          {/* Decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(255,102,0,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foursys-primary/10 border border-foursys-primary/25 mb-5"
          >
            <Sparkles size={14} className="text-foursys-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-foursys-primary">
              {t('innovation.badge')}
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            {t('innovation.title')}
          </h2>

          <p className="text-sm md:text-base text-foursys-text-muted max-w-2xl mx-auto leading-relaxed">
            {t('innovation.subtitle')}
          </p>

          <div className="mt-6 flex justify-center">
            <div className="h-px w-48 bg-gradient-to-r from-transparent via-foursys-primary/40 to-transparent" />
          </div>
        </motion.div>

        {/* Trends grid */}
        <div className="grid grid-cols-1 tablet:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12">
          {innovationTrends.map((trend, i) => (
            <TrendCard key={trend.id} trend={trend} index={i} onClick={() => setActiveTrend(trend)} />
          ))}
        </div>

        {/* Bottom insight */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative text-center pt-8 border-t border-white/[0.06]"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-foursys-primary/40 to-transparent" />
          <p className="text-sm text-foursys-text-muted leading-relaxed max-w-xl mx-auto">
            {lang === 'pt' ? (
              <>A Foursys combina o <span className="text-foursys-primary font-black">melhor das referências globais</span> com
              a agilidade, proximidade e custo-benefício que só uma empresa brasileira com{' '}
              <span className="text-white font-bold">26 anos de história</span> pode oferecer.</>
            ) : (
              <>Foursys combines the <span className="text-foursys-primary font-black">best of global references</span> with
              the agility, proximity and cost-effectiveness that only a Brazilian company with{' '}
              <span className="text-white font-bold">26 years of history</span> can offer.</>
            )}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-foursys-primary">
            <ArrowRight size={14} />
            {lang === 'pt' ? 'Fale com nossos especialistas' : 'Talk to our specialists'}
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeTrend && (
          <DrillDownModal trend={activeTrend} onClose={() => setActiveTrend(null)} />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
