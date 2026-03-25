import { motion } from 'framer-motion'
import { SectionWrapper } from '../ui/SectionWrapper'

const pillars = [
  { icon: '🛠️', title: 'Faça acontecer', desc: 'Cultura de execução e mentalidade maker — ideias que viram produto.' },
  { icon: '🤝', title: 'Comunidade', desc: 'Rede de profissionais, clientes e parceiros comprometidos com inovação real.' },
  { icon: '🧪', title: 'Experimentação', desc: 'Ambiente seguro para testar novas tecnologias, métodos e modelos de negócio.' },
  { icon: '🚀', title: 'Aceleração', desc: 'Programas de aceleração para produtos digitais e startups de tecnologia.' }
]

const activities = [
  { type: 'Hackathon', freq: 'Trimestral', icon: '⚡', desc: 'Desafios de 48h com times multidisciplinares' },
  { type: 'Labs Abertos', freq: 'Mensal', icon: '🔬', desc: 'Sessões práticas com as últimas tecnologias' },
  { type: 'Co-criação', freq: 'Por demanda', icon: '🎨', desc: 'Workshops de design thinking com clientes' },
  { type: 'Demos Day', freq: 'Semestral', icon: '🎤', desc: 'Apresentação de projetos e inovações' }
]

export function SectionFourmakers() {
  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-blue/15 border border-foursys-blue/30 text-foursys-cyan text-sm mb-4">
            🛠️ FourMakers
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-foursys-text mb-4">
            Onde a inovação acontece de verdade
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            FourMakers é nossa comunidade de inovação — um espaço onde clientes, parceiros e nossa equipe co-criam o futuro digital juntos.
          </p>
        </motion.div>

        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 md:mb-10 p-5 md:p-10 rounded-2xl bg-gradient-to-br from-foursys-blue/25 via-foursys-blue/10 to-foursys-cyan/10 border border-foursys-blue/30 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-foursys-cyan/5 rounded-full blur-3xl" />
          </div>
          <div className="text-6xl mb-4">🛠️</div>
          <div className="text-2xl font-black text-foursys-text mb-3">Comunidade · Laboratório · Aceleração</div>
          <p className="text-foursys-text-muted max-w-lg mx-auto">
            Mais de 500 makers ativos. Dezenas de protótipos gerados. Projetos que viraram produtos reais para clientes.
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="p-5 rounded-2xl bg-foursys-surface/50 border border-white/10 hover:border-foursys-blue/25 transition-all text-center"
            >
              <div className="text-3xl mb-3">{p.icon}</div>
              <div className="font-bold text-foursys-text text-sm mb-2">{p.title}</div>
              <p className="text-xs text-foursys-text-dim leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Activities */}
        <div className="text-sm font-semibold text-foursys-cyan text-center uppercase tracking-widest mb-5">
          Atividades e Programas
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {activities.map((act, i) => (
            <motion.div
              key={act.type}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-foursys-surface/50 border border-white/10"
            >
              <div className="text-3xl flex-shrink-0">{act.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foursys-text">{act.type}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-foursys-blue/15 border border-foursys-blue/25 text-foursys-cyan">{act.freq}</span>
                </div>
                <p className="text-sm text-foursys-text-dim">{act.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
