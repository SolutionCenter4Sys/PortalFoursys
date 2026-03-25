import { motion } from 'framer-motion'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'

const initiatives = [
  {
    icon: '🤖',
    title: 'Agentes BMAD',
    status: 'Em produção',
    statusColor: 'text-green-400 bg-green-500/15 border-green-500/25',
    desc: 'Framework proprietário de agentes de IA para desenvolvimento de software: do briefing ao código rodando, de forma autônoma e supervisionada.'
  },
  {
    icon: '⚡',
    title: 'Quality IA',
    status: 'Homologado em produção',
    statusColor: 'text-red-400 bg-red-500/15 border-red-500/25',
    desc: 'Automação inteligente de testes com LLMs — geração de casos de teste, análise de impacto e risk scoring em tempo real.'
  },
  {
    icon: '📊',
    title: 'DataSense IA',
    status: 'Beta',
    statusColor: 'text-orange-400 bg-orange-500/15 border-orange-500/25',
    desc: 'Motor de análise de dados financeiros com IA generativa — consulta em linguagem natural para analistas sem SQL.'
  },
  {
    icon: '🔍',
    title: 'CodeReview IA',
    status: 'Em produção',
    statusColor: 'text-green-400 bg-green-500/15 border-green-500/25',
    desc: 'Agente que faz peer review automático de código, detectando bugs, violações de padrão e oportunidades de melhoria.'
  }
]

const agentTypes = [
  { role: 'Humano', color: 'bg-foursys-blue', desc: 'Define objetivos, aprova decisões críticas, valida qualidade' },
  { role: 'Agente IA', color: 'bg-foursys-cyan', desc: 'Executa tarefas repetitivas, gera código, testa, documenta' },
  { role: 'Sistema', color: 'bg-violet-500', desc: 'APIs, bancos de dados, ferramentas de CI/CD, monitoramento' }
]

export function SectionLabIA() {
  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-blue/15 border border-foursys-blue/30 text-foursys-cyan text-sm mb-4">
            🤖 Lab IA · Inovação
          </div>
          <div className="flex justify-center mt-2 mb-2">
            <InterestButton section="lab-ia" />
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-foursys-text mb-4">
            Laboratório de IA Foursys
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            Pesquisa aplicada e produtos de IA em produção — não ficamos só experimentando, colocamos IA para gerar valor real.
          </p>
        </motion.div>

        {/* Hybrid agent model */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10 p-8 rounded-2xl bg-foursys-surface/50 border border-foursys-blue/20"
        >
          <div className="text-sm font-semibold text-foursys-cyan text-center uppercase tracking-widest mb-6">
            Modelo de Agentes Híbridos — Como Funciona
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-5 md:mb-6">
            {agentTypes.map((agent, i) => (
              <motion.div
                key={agent.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 rounded-2xl ${agent.color}/20 border border-white/20 flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg`}>
                  {i === 0 ? '👤' : i === 1 ? '🤖' : '⚙️'}
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${agent.color}/20 text-white border border-white/20`}>
                  {agent.role}
                </div>
                <p className="text-xs text-foursys-text-dim leading-relaxed">{agent.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-foursys-blue/10 border border-foursys-blue/20 text-center">
            <p className="text-sm text-foursys-text-muted">
              💡 <strong className="text-foursys-text">Resultado:</strong> um profissional humano com agentes IA produz o equivalente a 3-5 profissionais tradicionais, mantendo governança, auditabilidade e qualidade.
            </p>
          </div>
        </motion.div>

        {/* Initiatives */}
        <div className="text-sm font-semibold text-foursys-cyan text-center uppercase tracking-widest mb-5">
          Iniciativas do Laboratório
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {initiatives.map((init, i) => (
            <motion.div
              key={init.title}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="p-6 rounded-2xl bg-foursys-surface/50 border border-white/10 hover:border-foursys-blue/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0">{init.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="font-bold text-foursys-text">{init.title}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${init.statusColor}`}>
                      {init.status}
                    </span>
                  </div>
                  <p className="text-sm text-foursys-text-muted leading-relaxed">{init.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
