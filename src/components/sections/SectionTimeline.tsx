import { motion } from 'framer-motion'
import { SectionWrapper } from '../ui/SectionWrapper'
import { timeline } from '../../data/kpis'

export function SectionTimeline() {
  return (
    <SectionWrapper>
      <div className="px-8 py-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-blue/15 border border-foursys-blue/30 text-foursys-cyan text-sm mb-4">
            📅 Nossa Trajetória
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foursys-text mb-4">
            25 anos construindo o futuro
          </h2>
          <p className="text-lg text-foursys-text-muted">
            De uma startup em SP a parceiro estratégico global do setor financeiro.
          </p>
        </motion.div>

        <div className="relative">
          {/* Central line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-foursys-blue via-foursys-cyan to-foursys-blue opacity-30" />

          <div className="space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="relative flex gap-8 pl-8"
              >
                {/* Dot */}
                <div className={`
                  absolute left-0 top-3 w-4 h-4 rounded-full border-2 flex-shrink-0 -translate-x-1/2
                  ${item.highlight
                    ? 'bg-foursys-cyan border-foursys-cyan shadow-[0_0_15px_rgba(0,194,224,0.5)]'
                    : 'bg-foursys-dark-3 border-foursys-blue/60'
                  }
                `} />

                {/* Content */}
                <div className={`
                  flex-1 pb-2 p-5 rounded-2xl border backdrop-blur-md transition-all duration-300
                  ${item.highlight
                    ? 'bg-foursys-blue/15 border-foursys-blue/40 shadow-[0_0_30px_rgba(0,85,179,0.1)]'
                    : 'bg-foursys-surface/40 border-white/8 hover:border-white/20'
                  }
                `}>
                  <div className="flex items-start gap-4">
                    <div className={`
                      flex-shrink-0 text-sm font-black px-3 py-1 rounded-xl
                      ${item.highlight
                        ? 'bg-foursys-cyan/20 text-foursys-cyan'
                        : 'bg-white/8 text-foursys-text-muted'
                      }
                    `}>
                      {item.year}
                    </div>
                    <div>
                      <h3 className={`font-bold text-base mb-1 ${item.highlight ? 'text-foursys-text' : 'text-foursys-text-muted'}`}>
                        {item.title}
                        {item.highlight && <span className="ml-2 text-xs text-foursys-cyan">★</span>}
                      </h3>
                      <p className="text-sm text-foursys-text-dim leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
