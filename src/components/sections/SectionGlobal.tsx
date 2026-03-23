import { motion } from 'framer-motion'
import { SectionWrapper } from '../ui/SectionWrapper'

const regions = [
  {
    flag: '🇧🇷',
    name: 'Brasil',
    city: 'São Paulo — Sede',
    description: 'Sede global da Foursys. Centro de excelência técnica, inovação e gestão. Maior concentração de clientes e projetos.',
    highlights: ['800+ profissionais', 'Clientes Tier 1 financeiros', 'Laboratório de IA', 'FourMakers HQ'],
    color: 'from-green-500/20 to-green-600/10',
    border: 'border-green-500/30',
    badge: 'text-green-400 bg-green-500/15 border-green-500/25'
  },
  {
    flag: '🇺🇸',
    name: 'Estados Unidos',
    city: 'Nova York / Flórida',
    description: 'Escritórios de negócios e delivery para o mercado americano. Projetos para empresas do mercado financeiro e tecnologia.',
    highlights: ['Presença em NY e FL', 'Mercado financeiro americano', 'Time bilíngue dedicado', 'Entrega US-compliant'],
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
    badge: 'text-blue-400 bg-blue-500/15 border-blue-500/25'
  },
  {
    flag: '🇵🇹',
    name: 'Europa',
    city: 'Portugal · Espanha',
    description: 'Expansão europeia com projetos em Portugal e Espanha. Porta de entrada para o mercado da União Europeia.',
    highlights: ['Conformidade GDPR', 'Projetos Ibéricos', 'Parceiros locais', 'Expansão em curso'],
    color: 'from-violet-500/20 to-violet-600/10',
    border: 'border-violet-500/30',
    badge: 'text-violet-400 bg-violet-500/15 border-violet-500/25'
  }
]

export function SectionGlobal() {
  return (
    <SectionWrapper>
      <div className="px-8 py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-blue/15 border border-foursys-blue/30 text-foursys-cyan text-sm mb-4">
            🌎 Presença Global
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foursys-text mb-4">
            Local onde importa, global onde é preciso
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            Presença ativa em 3 continentes, com capacidade de delivery remoto e presencial para qualquer localidade.
          </p>
        </motion.div>

        {/* World map illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-10 p-8 rounded-2xl bg-foursys-surface/40 border border-white/10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-foursys-blue/5 to-transparent" />

          {/* Simple SVG world map visualization */}
          <svg viewBox="0 0 800 300" className="w-full h-auto opacity-30">
            <ellipse cx="400" cy="150" rx="390" ry="140" fill="none" stroke="rgba(0,119,204,0.4)" strokeWidth="1"/>
            <ellipse cx="400" cy="150" rx="390" ry="140" fill="rgba(0,119,204,0.03)"/>
            {/* Grid lines */}
            {[-120,-60,0,60,120].map(y => (
              <line key={y} x1="10" y1={150+y*0.9} x2="790" y2={150+y*0.9} stroke="rgba(0,119,204,0.15)" strokeWidth="0.5"/>
            ))}
            {[-3,-2,-1,0,1,2,3].map(x => (
              <ellipse key={x} cx="400" cy="150" rx={390-(x<0?-x:x)*40} ry="140" fill="none" stroke="rgba(0,119,204,0.1)" strokeWidth="0.5"/>
            ))}
          </svg>

          {/* Location pins */}
          <div className="absolute inset-0 flex items-center justify-around px-16">
            {[
              { left: '20%', top: '40%', label: 'Brasil', color: '#22c55e' },
              { left: '15%', top: '30%', label: 'EUA', color: '#3b82f6' },
              { left: '55%', top: '28%', label: 'Europa', color: '#8b5cf6' }
            ].map(pin => (
              <div
                key={pin.label}
                className="absolute flex flex-col items-center"
                style={{ left: pin.left, top: pin.top }}
              >
                <div
                  className="w-4 h-4 rounded-full animate-pulse shadow-lg"
                  style={{ backgroundColor: pin.color, boxShadow: `0 0 15px ${pin.color}` }}
                />
                <div className="mt-1 text-xs font-bold" style={{ color: pin.color }}>{pin.label}</div>
              </div>
            ))}
          </div>

          <div className="relative text-center text-xs text-foursys-text-dim mt-4">
            3 continentes · 12 países · Delivery 24/7
          </div>
        </motion.div>

        {/* Region cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {regions.map((region, i) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`p-6 rounded-2xl bg-gradient-to-b ${region.color} border ${region.border} backdrop-blur-md`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{region.flag}</div>
                <div>
                  <div className="font-bold text-foursys-text">{region.name}</div>
                  <div className="text-xs text-foursys-text-muted">{region.city}</div>
                </div>
              </div>

              <p className="text-sm text-foursys-text-dim mb-4 leading-relaxed">{region.description}</p>

              <div className="space-y-2">
                {region.highlights.map(h => (
                  <div key={h} className={`text-xs px-2 py-1 rounded-lg border inline-flex mr-1 mb-1 ${region.badge}`}>
                    {h}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
