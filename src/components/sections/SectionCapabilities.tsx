import { motion } from 'framer-motion'
import { SectionWrapper } from '../ui/SectionWrapper'
import { capabilities } from '../../data/cases'

const levelColors = {
  expert: { bar: 'bg-foursys-cyan', label: 'Expert', text: 'text-foursys-cyan' },
  advanced: { bar: 'bg-foursys-blue', label: 'Avançado', text: 'text-foursys-blue-light' },
  solid: { bar: 'bg-foursys-text-muted', label: 'Sólido', text: 'text-foursys-text-muted' }
}

const levelWidth = {
  expert: 'w-full',
  advanced: 'w-4/5',
  solid: 'w-3/5'
}

export function SectionCapabilities() {
  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-blue/15 border border-foursys-blue/30 text-foursys-cyan text-sm mb-4">
            Capacidades Técnicas
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-foursys-text mb-4">
            Stack e expertise por área
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            Nossa capacidade técnica mapeada por área — com nível de proficiência comprovado em projetos reais.
          </p>
        </motion.div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mb-8">
          {Object.entries(levelColors).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${val.bar}`} />
              <span className={`text-xs ${val.text}`}>{val.label}</span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((area, i) => (
            <motion.div
              key={area.category}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-foursys-surface/50 border border-white/10 hover:border-foursys-blue/25 transition-all duration-300"
            >
              <h3 className="font-bold text-foursys-text mb-4 text-sm uppercase tracking-wide">{area.category}</h3>

              <div className="space-y-3">
                {area.technologies.map(tech => (
                  <div key={tech.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foursys-text-muted">{tech.name}</span>
                      <span className={`text-xs ${levelColors[tech.level].text}`}>{levelColors[tech.level].label}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 'auto' }}
                        className={`h-full rounded-full ${levelColors[tech.level].bar} ${levelWidth[tech.level]}`}
                        style={{ transition: `width ${0.8 + i * 0.05}s ease-out` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-5 rounded-2xl bg-foursys-surface/30 border border-white/8 text-center"
        >
          <p className="text-sm text-foursys-text-muted">
            200+ certificações técnicas · Plano de capacitação contínua · Times dedicados por especialidade
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
