import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { useApp } from '../../context/AppContext'

const steps = [
  { label: 'Desafio', icon: '🎯', content: 'O Santander Housing Investments precisava de um portal centralizado para gestão do portfólio imobiliário, integrando dados de 12 sistemas legados com visibilidade em tempo real.' },
  { label: 'Solução', icon: '⚡', content: 'Portal web em React com APIs REST Java Spring Boot, API Gateway unificando fontes legadas, dashboards interativos e relatórios automatizados — entregue em squads ágeis Foursys.' },
  { label: 'Resultado', icon: '🏆', content: 'Tempo de consulta de portfólio reduzido de 3 dias para 10 minutos. 15 relatórios Excel eliminados. 200+ gestores com visibilidade em tempo real.' }
]

const techStack = ['React', 'TypeScript', 'Java 17', 'Spring Boot', 'AWS EKS', 'API Gateway', 'PostgreSQL', 'D3.js', 'Jenkins CI/CD']

export function SectionSHICase() {
  const { navigate } = useApp()

  return (
    <SectionWrapper>
      <div className="px-8 py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-blue/15 border border-foursys-blue/30 text-foursys-cyan text-sm mb-4">
            🏢 Case Santander
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foursys-text mb-4">
            Portal Imobiliário SHI
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            Digitalização completa do portfólio imobiliário do Santander Housing Investments — entregue pela Foursys.
          </p>
        </motion.div>

        {/* Journey steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="p-6 rounded-2xl bg-foursys-surface/50 border border-white/10 relative"
            >
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-foursys-dark-2 border border-foursys-blue/40 text-xs font-semibold text-foursys-cyan">
                {step.label}
              </div>
              <div className="text-3xl mb-4 mt-2">{step.icon}</div>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{step.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Key metric */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-foursys-blue/20 to-foursys-cyan/10 border border-foursys-blue/30 text-center"
        >
          <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foursys-cyan to-foursys-blue mb-3">
            99%
          </div>
          <div className="text-xl font-bold text-foursys-text mb-2">Redução no tempo de consulta de portfólio</div>
          <div className="text-foursys-text-muted">De 3 dias → 10 minutos · 200+ gestores beneficiados · 15 relatórios Excel eliminados</div>
        </motion.div>

        {/* Stack + Results */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-foursys-surface/50 border border-white/10"
          >
            <h3 className="font-bold text-foursys-text mb-4">Stack Tecnológica</h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map(t => (
                <span key={t} className="text-xs px-3 py-1.5 rounded-lg bg-foursys-blue/15 border border-foursys-blue/25 text-foursys-cyan">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-foursys-surface/50 border border-white/10"
          >
            <h3 className="font-bold text-foursys-text mb-4">Resultados Detalhados</h3>
            <ul className="space-y-2">
              {[
                'Tempo de consulta: 3 dias → 10 minutos',
                'Visibilidade 100% do portfólio em tempo real',
                '15 relatórios Excel eliminados',
                '200+ gestores com acesso self-service',
                'Zero downtime durante a implantação',
                'Conformidade BACEN e LGPD garantida'
              ].map(r => (
                <li key={r} className="flex items-start gap-2 text-sm text-foursys-text-muted">
                  <span className="text-green-400 flex-shrink-0">✓</span> {r}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 flex gap-3"
        >
          <button
            onClick={() => navigate('cases')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foursys-blue/20 border border-foursys-blue/30 text-foursys-cyan text-sm hover:bg-foursys-blue/30 transition-colors"
          >
            Ver todos os cases <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
