import { motion } from 'framer-motion'
import { SectionWrapper } from '../ui/SectionWrapper'

const steps = [
  { icon: '🔍', title: 'Diagnóstico', desc: 'Mapeamento completo do sistema legado — código, dependências, riscos e oportunidades de modernização.' },
  { icon: '🏗️', title: 'API Gateway', desc: 'Criação de uma camada de abstração API que expõe as funcionalidades do legado sem modificá-lo.' },
  { icon: '✂️', title: 'Decomposição', desc: 'Identificação dos módulos de maior valor e risco para extração incremental em microserviços.' },
  { icon: '🔄', title: 'Migração Gradual', desc: 'Migração módulo a módulo, com o sistema legado 100% operacional durante todo o processo.' },
  { icon: '☁️', title: 'Cloudificação', desc: 'Deploy dos novos microserviços em Kubernetes/AWS com CI/CD, observabilidade e auto-scaling.' },
  { icon: '🏁', title: 'Descomissionamento', desc: 'Encerramento seguro do sistema legado após validação completa de todas as funcionalidades migradas.' }
]

export function SectionSDD() {
  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-blue/15 border border-foursys-blue/30 text-foursys-cyan text-sm mb-4">
            🔄 SDD com Legado
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-foursys-text mb-4">
            Modernizar sem parar
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            <strong className="text-foursys-text">Software Defined Delivery</strong> — nossa metodologia de modernização incremental que garante continuidade operacional durante toda a transformação.
          </p>
        </motion.div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-red-500/10 border border-red-500/25"
          >
            <div className="text-lg font-bold text-red-400 mb-3">❌ Big-Bang Rewrite (problema)</div>
            <ul className="space-y-2 text-sm text-foursys-text-dim">
              <li>• Alto risco de falha e downtime</li>
              <li>• Meses ou anos sem entrega de valor</li>
              <li>• Custo imprevisível e scope creep</li>
              <li>• Perda de conhecimento do negócio no código legado</li>
              <li>• Dependência de fases de "big bang" deploy</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-green-500/10 border border-green-500/25"
          >
            <div className="text-lg font-bold text-green-400 mb-3">✅ SDD — Foursys (solução)</div>
            <ul className="space-y-2 text-sm text-foursys-text-muted">
              <li>• Zero downtime — legado opera durante toda a migração</li>
              <li>• Valor entregue a cada sprint (módulo por módulo)</li>
              <li>• Custo controlado e previsível por fase</li>
              <li>• Conhecimento de negócio preservado e evoluído</li>
              <li>• Rollback possível a qualquer momento</li>
            </ul>
          </motion.div>
        </div>

        {/* SDD Steps */}
        <div className="relative">
          <div className="text-sm font-semibold text-foursys-cyan text-center mb-6 uppercase tracking-widest">
            A jornada SDD passo a passo
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="p-5 rounded-2xl bg-foursys-surface/50 border border-white/10 hover:border-foursys-blue/25 transition-colors relative"
              >
                <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-foursys-blue/30 border border-foursys-blue/50 flex items-center justify-center text-xs font-bold text-foursys-cyan">
                  {i + 1}
                </div>
                <div className="text-2xl mb-3">{step.icon}</div>
                <div className="font-semibold text-foursys-text text-sm mb-2">{step.title}</div>
                <p className="text-xs text-foursys-text-dim leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-foursys-blue/15 to-transparent border border-foursys-blue/25"
        >
          <p className="text-sm text-foursys-text-muted text-center">
            💡 <strong className="text-foursys-text">Resultado típico com SDD:</strong> sistema legado 100% operacional durante toda a migração, com entrega de valor a cada 2 semanas e custo até 40% menor que o big-bang rewrite.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
