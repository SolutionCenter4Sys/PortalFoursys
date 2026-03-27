import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { DynIcon } from '../../utils/iconMap'

const benefits = [
  'Geração automática de casos de teste com LLMs',
  'Análise de impacto inteligente em mudanças de código',
  'Identificação de riscos de regressão antes do deploy',
  'Integração nativa com Jenkins, Jira e SonarQube',
  'Dashboard executivo de qualidade em tempo real',
  'Relatórios de coverage e tendências automatizados'
]

const metrics = [
  { value: '3x', label: 'Mais velocidade de release', color: 'text-foursys-cyan' },
  { value: '60%', label: 'Redução de defeitos em produção', color: 'text-green-400' },
  { value: '78%', label: 'Aumento na cobertura de testes', color: 'text-violet-400' },
  { value: '100%', label: 'Homologado pelo Santander', color: 'text-red-400' }
]

export function SectionQualityIA() {
  return (
    <SectionWrapper>
      <div className="px-8 py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-blue/15 border border-foursys-blue/30 text-foursys-cyan text-sm mb-4">
            Framework Quality IA
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs mb-4 ml-2">
            ✓ Homologado pelo Santander
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foursys-text mb-4">
            Qualidade acelerada por IA
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            Nosso framework proprietário de automação inteligente de testes — já em uso no Santander e comprovado em produção.
          </p>
        </motion.div>

        {/* Architecture diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10 p-8 rounded-2xl bg-foursys-surface/50 border border-foursys-blue/20"
        >
          <div className="text-sm font-semibold text-foursys-cyan text-center mb-6 uppercase tracking-widest">
            Arquitetura Quality IA
          </div>

          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 items-center">
            {[
              { label: 'Repositório\nde Código', icon: 'folder-open', color: 'bg-blue-500/20 border-blue-500/30' },
              { label: '→', icon: '', color: 'bg-transparent border-transparent', arrow: true },
              { label: 'Quality IA\nEngine', icon: 'brain-circuit', color: 'bg-foursys-blue/30 border-foursys-blue/50', highlight: true },
              { label: '→', icon: '', color: 'bg-transparent border-transparent', arrow: true },
              { label: 'CI/CD\nPipeline', icon: 'rocket', color: 'bg-green-500/20 border-green-500/30' }
            ].map((item, i) => (
              item.arrow ? (
                <div key={i} className="text-foursys-text-dim text-2xl text-center hidden md:block">→</div>
              ) : (
                <div
                  key={i}
                  className={`p-4 rounded-xl border text-center ${item.color} ${item.highlight ? 'shadow-[0_0_30px_rgba(0,85,179,0.3)]' : ''}`}
                >
                  <div className="mb-2"><DynIcon name={item.icon} size={24} className={item.highlight ? 'text-foursys-cyan' : 'text-foursys-text-muted'} /></div>
                  <div className={`text-xs font-medium ${item.highlight ? 'text-foursys-cyan' : 'text-foursys-text-muted'} whitespace-pre-line`}>
                    {item.label}
                  </div>
                </div>
              )
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Geração de Testes por IA', 'Análise de Impacto', 'Risk Scoring', 'Reports Automáticos'].map(f => (
              <div key={f} className="text-center text-xs text-foursys-text-dim px-3 py-2 rounded-lg bg-foursys-blue/10 border border-foursys-blue/20">
                {f}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-foursys-surface/50 border border-white/10"
          >
            <h3 className="text-lg font-bold text-foursys-text mb-4">Capacidades do Framework</h3>
            <div className="space-y-3">
              {benefits.map(b => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foursys-text-muted">{b}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="p-6 rounded-2xl bg-foursys-surface/60 border border-white/10 text-center"
                >
                  <div className={`text-4xl font-black mb-2 ${m.color}`}>{m.value}</div>
                  <div className="text-xs text-foursys-text-muted leading-tight">{m.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Santander seal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-red-600/15 to-red-500/8 border border-red-500/30 flex items-center gap-6"
        >
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center">
            <span className="text-white font-black text-xs text-center leading-tight">✓<br/>APROV</span>
          </div>
          <div>
            <div className="font-bold text-foursys-text mb-1">Homologado pelo Santander Brasil</div>
            <p className="text-sm text-foursys-text-muted">
              O Framework Quality IA passou pelo rigoroso processo de homologação técnica e de segurança do Santander e está aprovado para uso corporativo em todos os projetos do banco.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
