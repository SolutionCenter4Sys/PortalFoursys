import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'

const capabilities = [
  { icon: '🔍', title: 'SAST', subtitle: 'Static Application Security Testing', desc: 'Análise de vulnerabilidades no código-fonte antes do deploy, integrada ao pipeline CI/CD.' },
  { icon: '🕵️', title: 'DAST', subtitle: 'Dynamic Application Security Testing', desc: 'Testes de segurança em aplicações em execução, simulando ataques reais.' },
  { icon: '🎯', title: 'Pentest', subtitle: 'Penetration Testing', desc: 'Testes de intrusão por especialistas certificados (OSCP, CEH) em sistemas e APIs.' },
  { icon: '☁️', title: 'Cloud Security', subtitle: 'Segurança em Cloud', desc: 'Hardening, IAM, CIS Benchmarks e monitoramento de configurações em AWS/Azure.' },
  { icon: '📋', title: 'Compliance', subtitle: 'BACEN · LGPD · ISO 27001', desc: 'Adequação regulatória para o setor financeiro brasileiro e internacional.' },
  { icon: '🚨', title: 'SOC & SIEM', subtitle: 'Security Operations Center', desc: 'Monitoramento 24/7, detecção de ameaças e resposta a incidentes em tempo real.' }
]

const regulations = [
  { name: 'BACEN Res. 4.658', desc: 'Política de segurança cibernética para IFs' },
  { name: 'BACEN Res. 4.893', desc: 'Continuidade de negócios e TIBER' },
  { name: 'LGPD', desc: 'Lei Geral de Proteção de Dados' },
  { name: 'ISO 27001', desc: 'Sistema de Gestão de Segurança' },
  { name: 'PCI DSS', desc: 'Segurança para dados de cartão' },
  { name: 'SOX', desc: 'Sarbanes-Oxley para empresas listadas' }
]

export function SectionCyberSecurity() {
  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-sm mb-4">
            🛡️ Cyber Security
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-foursys-text mb-4">
            Segurança como habilitadora de negócio
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            Para o setor financeiro, segurança não é opcional — é fundação. Cobrimos toda a cadeia de segurança cibernética.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09 }}
              className="p-6 rounded-2xl bg-foursys-surface/50 border border-white/10 hover:border-red-500/25 transition-all duration-300 group"
            >
              <div className="text-2xl mb-3">{cap.icon}</div>
              <div className="font-bold text-foursys-text text-base">{cap.title}</div>
              <div className="text-xs text-foursys-text-dim mb-3">{cap.subtitle}</div>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{cap.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-7 rounded-2xl bg-gradient-to-r from-red-500/15 to-orange-500/8 border border-red-500/25"
        >
          <div className="flex items-center gap-3 mb-5">
            <Shield size={22} className="text-red-400" />
            <div>
              <div className="font-bold text-foursys-text">Conformidade Regulatória Financeira</div>
              <div className="text-xs text-foursys-text-dim">Todos os frameworks e regulações relevantes para o setor</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {regulations.map(reg => (
              <div key={reg.name} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="font-semibold text-red-400 text-sm">{reg.name}</div>
                <div className="text-xs text-foursys-text-dim mt-0.5">{reg.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
