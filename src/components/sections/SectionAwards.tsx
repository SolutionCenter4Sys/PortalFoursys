import { motion } from 'framer-motion'
import { SectionWrapper } from '../ui/SectionWrapper'
import { DynIcon } from '../../utils/iconMap'
import { awards, certifications } from '../../data/awards'

const CATEGORY_LABELS: Record<string, string> = {
  premio: 'Premiações',
  cultura: 'Cultura & Pessoas',
  inovacao: 'Inovação Aberta',
}

export function SectionAwards() {
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
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-primary mb-2">
            Provas de resultado
          </p>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-none mb-3">
            Premiações & Reconhecimentos
          </h2>
          <p className="text-foursys-text-muted max-w-2xl text-sm md:text-base leading-relaxed">
            Prêmios conquistados ao longo da nossa história que celebram dedicação, inovação,
            trabalho em equipe e compromisso com o jeito de ser Foursys.
          </p>
          <div className="mt-5 h-px bg-gradient-to-r from-amber-500/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-10">
          {awards.map((award, i) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.4 }}
              className="group relative rounded-2xl border border-white/[0.08] p-5 md:p-6 transition-all duration-300 hover:border-white/[0.15]"
              style={{
                background: `linear-gradient(145deg, ${award.glow}08 0%, transparent 55%), rgba(255,255,255,0.015)`,
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <DynIcon name={award.icon} size={28} className="flex-shrink-0" style={{ color: award.glow }} />
                <div>
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: award.glow }}
                  >
                    {CATEGORY_LABELS[award.category]}
                  </span>
                  <h3 className="text-base md:text-lg font-black text-white leading-tight mt-0.5">
                    {award.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-foursys-text-muted leading-relaxed mb-4">
                {award.subtitle}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {award.years.map(year => (
                  <span
                    key={year}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold border"
                    style={{
                      borderColor: `${award.glow}30`,
                      color: award.glow,
                      background: `${award.glow}10`,
                    }}
                  >
                    {year}
                  </span>
                ))}
              </div>

              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: `inset 0 0 40px ${award.glow}06, 0 0 30px ${award.glow}05` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-foursys-text-dim mb-5">
            Certificações que reforçam nosso compromisso
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                className="group flex flex-col items-center p-5 rounded-xl bg-foursys-surface/30 border border-white/[0.08] hover:border-foursys-primary/30 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-foursys-primary/10 border-2 border-foursys-primary/20 flex items-center justify-center mb-3 group-hover:border-foursys-primary/40 transition-colors">
                  <DynIcon name={cert.icon} size={20} className="text-foursys-primary" />
                </div>
                <div className="text-sm font-black text-white">{cert.label}</div>
                <div className="text-[10px] text-foursys-text-dim mt-1 text-center leading-snug">
                  {cert.fullName}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-3 gap-4 text-center"
        >
          {[
            { value: `${awards.length}+`, label: 'Premiações' },
            { value: `${certifications.length}`, label: 'Certificações ISO' },
            { value: '26', label: 'Anos de Entrega' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-2xl md:text-3xl font-black text-foursys-primary">{stat.value}</div>
              <div className="text-[10px] text-foursys-text-dim uppercase tracking-widest mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
