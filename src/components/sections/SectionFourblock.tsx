import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'

const blocks = [
  { icon: '🔐', name: 'AuthBlock', desc: 'Autenticação completa (OAuth2, MFA, SSO) em 3 dias' },
  { icon: '📊', name: 'DashBlock', desc: 'Dashboard analítico com gráficos e KPIs em 5 dias' },
  { icon: '🔔', name: 'NotifyBlock', desc: 'Sistema de notificações multicanal (email, SMS, push) em 2 dias' },
  { icon: '💳', name: 'PayBlock', desc: 'Integração de pagamentos PIX/cartão em 5 dias' },
  { icon: '🤖', name: 'AIBlock', desc: 'Copiloto IA com RAG e contexto de negócio em 7 dias' },
  { icon: '📋', name: 'FormBlock', desc: 'Engine de formulários dinâmicos e workflows em 4 dias' },
  { icon: '🔍', name: 'SearchBlock', desc: 'Busca semântica com vetores em qualquer base de dados' },
  { icon: '📁', name: 'DocBlock', desc: 'Gestão e assinatura digital de documentos em 5 dias' }
]

const phases = [
  { week: 'Semana 1', label: 'Discovery + Design', icon: '📐' },
  { week: 'Semana 2', label: 'Blocos + Integração', icon: '🧱' },
  { week: 'Semana 3', label: 'Customização + Testes', icon: '🔧' },
  { week: 'Semana 4', label: 'Deploy + Handover', icon: '🚀' }
]

export function SectionFourblock() {
  return (
    <SectionWrapper>
      <div className="px-8 py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-blue/15 border border-foursys-blue/30 text-foursys-cyan text-sm mb-4">
            ⬛ Fourblock
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foursys-text mb-4">
            Produtos digitais em{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foursys-cyan to-foursys-blue">
              30 dias
            </span>
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            Combinamos blocos de software pré-construídos e validados com customização para o contexto do cliente — entregando em semanas, não meses.
          </p>
        </motion.div>

        {/* Value prop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-8 mb-10"
        >
          {[
            { value: '70%', label: 'Menos tempo de desenvolvimento', color: 'text-foursys-cyan' },
            { value: '30d', label: 'Prazo máximo de entrega', color: 'text-green-400' },
            { value: '∞', label: 'Customização por contexto', color: 'text-violet-400' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-center"
            >
              <div className={`text-4xl font-black ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-foursys-text-dim">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Blocks catalog */}
        <div className="mb-10">
          <div className="text-sm font-semibold text-foursys-cyan text-center uppercase tracking-widest mb-5">
            Catálogo de Blocos Disponíveis
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {blocks.map((block, i) => (
              <motion.div
                key={block.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="p-4 rounded-2xl bg-foursys-surface/50 border border-white/10 hover:border-foursys-blue/30 transition-all duration-200 hover:-translate-y-1"
              >
                <div className="text-2xl mb-2">{block.icon}</div>
                <div className="font-bold text-foursys-cyan text-sm mb-1">{block.name}</div>
                <div className="text-xs text-foursys-text-dim leading-relaxed">{block.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-7 rounded-2xl bg-foursys-surface/40 border border-white/10"
        >
          <div className="text-sm font-semibold text-foursys-cyan text-center uppercase tracking-widest mb-5">
            Como entregamos em 30 dias
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {phases.map((phase, i) => (
              <div key={phase.week} className="text-center">
                <div className="relative mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-foursys-blue/20 border border-foursys-blue/30 flex items-center justify-center text-xl mx-auto">
                    {phase.icon}
                  </div>
                  {i < phases.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-foursys-blue/40 to-transparent" />
                  )}
                </div>
                <div className="text-xs text-foursys-cyan font-semibold">{phase.week}</div>
                <div className="text-xs text-foursys-text-dim mt-1">{phase.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            <Zap size={16} className="text-foursys-cyan" />
            <p className="text-sm text-foursys-text-muted">
              Garantia de entrega em 30 dias ou o cliente não paga pela última semana.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
