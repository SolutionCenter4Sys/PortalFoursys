import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionWrapper } from '../ui/SectionWrapper'
import { showcaseClients, sectors } from '../../data/clientShowcase'

const STATS = [
  { value: '150+', label: 'Clientes Ativos' },
  { value: `${sectors.length}`, label: 'Setores Atendidos' },
  { value: '98%', label: 'NPS Médio' },
  { value: '12', label: 'Países' },
]

export function SectionClients() {
  const [activeSector, setActiveSector] = useState<string | null>(null)

  const filtered = activeSector
    ? showcaseClients.filter(c => c.sector === activeSector)
    : showcaseClients

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
                no Brasil e no mundo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="p-3 rounded-xl bg-foursys-surface/40 border border-white/[0.08] text-center min-w-[110px]"
                >
                  <div className="text-xl font-black text-foursys-primary">{stat.value}</div>
                  <div className="text-[9px] text-foursys-text-dim mt-0.5 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-5 h-px bg-gradient-to-r from-foursys-primary/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* Sector filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <button
            type="button"
            onClick={() => setActiveSector(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              activeSector === null
                ? 'bg-foursys-primary/20 border-foursys-primary/40 text-foursys-primary'
                : 'border-white/[0.1] text-foursys-text-muted hover:border-white/[0.2]'
            }`}
          >
            Todos
          </button>
          {sectors.map(sector => (
            <button
              key={sector}
              type="button"
              onClick={() => setActiveSector(sector)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                activeSector === sector
                  ? 'bg-foursys-primary/20 border-foursys-primary/40 text-foursys-primary'
                  : 'border-white/[0.1] text-foursys-text-muted hover:border-white/[0.2]'
              }`}
            >
              {sector}
            </button>
          ))}
        </motion.div>

        {/* Client Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
          {filtered.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.35 }}
              className="group flex flex-col items-center justify-center p-5 md:p-6 rounded-xl bg-foursys-surface/25 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300"
            >
              <span
                className="text-lg md:text-xl font-black tracking-tight transition-transform duration-300 group-hover:scale-110"
                style={{ color: client.textColor }}
              >
                {client.name}
              </span>
              <span className="text-[9px] text-foursys-text-dim mt-1.5 uppercase tracking-widest">
                {client.sector}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center pt-6 border-t border-white/[0.06]"
        >
          <p className="text-xs text-foursys-text-dim leading-relaxed max-w-lg mx-auto">
            Mais de 150 empresas confiam na Foursys para conduzir suas jornadas de transformação digital.
            <br />
            <span className="text-foursys-text-muted font-semibold">
              Não somos fornecedores — somos parceiros estratégicos de longo prazo.
            </span>
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
