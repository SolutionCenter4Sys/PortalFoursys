import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../ui/SectionWrapper'
import { ClientLogo } from '../ui/ClientLogos'
import { showcaseClients, sectors } from '../../data/clientShowcase'
import type { ShowcaseClient } from '../../data/clientShowcase'

const STATS = [
  { value: '150+', label: 'Clientes Ativos', icon: '🏢' },
  { value: '98%', label: 'NPS Médio', icon: '⭐' },
  { value: '3', label: 'Regiões no Globo', icon: '🌎' },
]

function ClientCard({ client, index }: { client: ShowcaseClient; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: Math.min(0.03 * index, 0.5), duration: 0.35, type: 'spring', stiffness: 200 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col items-center justify-center rounded-2xl overflow-hidden cursor-default"
      style={{ minHeight: 140 }}
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background: `conic-gradient(from 0deg, ${client.color}40, transparent 25%, ${client.color}30, transparent 50%, ${client.color}40, transparent 75%, ${client.color}30)`,
          padding: 1.5,
        }}
      />

      {/* Inner bg */}
      <div
        className="absolute inset-[1.5px] rounded-2xl transition-all duration-500"
        style={{
          background: hovered
            ? `linear-gradient(160deg, ${client.color}12 0%, rgba(15,20,35,0.95) 50%, ${client.color}08 100%)`
            : 'rgba(15,20,35,0.6)',
          border: hovered ? `1px solid ${client.color}30` : '1px solid rgba(255,255,255,0.06)',
        }}
      />

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1 : 0.8,
        }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${client.color}15 0%, transparent 70%)`,
        }}
      />

      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
        animate={{ width: hovered ? '60%' : '0%', opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: `linear-gradient(90deg, transparent, ${client.color}, transparent)` }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-5 md:p-6">
        <motion.div
          className="flex items-center justify-center mb-3"
          animate={{
            scale: hovered ? 1.12 : 1,
            y: hovered ? -2 : 0,
          }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
          style={{
            filter: hovered
              ? `drop-shadow(0 0 16px ${client.color}60) drop-shadow(0 0 32px ${client.color}25)`
              : 'drop-shadow(0 0 0 transparent)',
            transition: 'filter 0.4s ease',
          }}
        >
          <ClientLogo id={client.id} size={64} />
        </motion.div>

        <motion.span
          className="text-[9px] font-bold uppercase tracking-[0.18em] transition-colors duration-300"
          animate={{ opacity: hovered ? 1 : 0.5 }}
          style={{ color: hovered ? client.textColor : 'rgba(255,255,255,0.35)' }}
        >
          {client.sector}
        </motion.span>
      </div>

      {/* Bottom glow reflection */}
      <motion.div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full pointer-events-none"
        animate={{ opacity: hovered ? 0.6 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(ellipse, ${client.color}30 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
      />
    </motion.div>
  )
}

export function SectionClients() {
  const [activeSector, setActiveSector] = useState<string | null>(null)

  const filtered = activeSector
    ? showcaseClients.filter(c => c.sector === activeSector)
    : showcaseClients

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-10"
        >
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-primary mb-2">
                Confiança comprovada
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-none mb-3">
                Empresas que confiam na Foursys
              </h2>
              <p className="text-foursys-text-muted max-w-xl text-sm md:text-base leading-relaxed">
                Parceiros estratégicos de longo prazo que estão definindo o futuro de seus setores
                no mundo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="group/stat relative p-3.5 rounded-xl border border-white/[0.08] text-center min-w-[120px] overflow-hidden hover:border-foursys-primary/30 transition-all duration-300"
                  style={{ background: 'linear-gradient(145deg, rgba(255,102,0,0.04), rgba(15,20,35,0.5))' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-foursys-primary/5 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="text-2xl font-black text-foursys-primary">{stat.value}</div>
                    <div className="text-[9px] text-foursys-text-dim mt-0.5 uppercase tracking-wider font-bold">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-6 h-px bg-gradient-to-r from-foursys-primary/40 via-white/[0.08] to-transparent" />
        </motion.div>

        {/* Sector filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2.5 mb-8"
        >
          <button
            type="button"
            onClick={() => setActiveSector(null)}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-300 ${
              activeSector === null
                ? 'bg-foursys-primary/20 border-foursys-primary/50 text-foursys-primary shadow-[0_0_12px_rgba(255,102,0,0.2)]'
                : 'border-white/[0.1] text-foursys-text-muted hover:border-white/[0.25] hover:text-white'
            }`}
          >
            Todos
          </button>
          {sectors.map(sector => (
            <button
              key={sector}
              type="button"
              onClick={() => setActiveSector(sector)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-300 ${
                activeSector === sector
                  ? 'bg-foursys-primary/20 border-foursys-primary/50 text-foursys-primary shadow-[0_0_12px_rgba(255,102,0,0.2)]'
                  : 'border-white/[0.1] text-foursys-text-muted hover:border-white/[0.25] hover:text-white'
              }`}
            >
              {sector}
            </button>
          ))}
        </motion.div>

        {/* Client Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5 mb-10"
          >
            {filtered.map((client, i) => (
              <ClientCard key={client.id} client={client} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative text-center pt-8 border-t border-white/[0.06]"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-foursys-primary/40 to-transparent" />
          <p className="text-sm text-foursys-text-muted leading-relaxed max-w-lg mx-auto">
            Mais de <span className="text-foursys-primary font-black">150 empresas</span> confiam na Foursys para conduzir suas jornadas de transformação digital.
          </p>
          <p className="text-xs text-foursys-text-dim mt-2 font-semibold">
            Não somos fornecedores — somos parceiros estratégicos de longo prazo.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
