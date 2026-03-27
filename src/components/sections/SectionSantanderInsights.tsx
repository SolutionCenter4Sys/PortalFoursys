import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { DynIcon } from '../../utils/iconMap'
import { santanderClient } from '../../data/clients/santander'
import { useApp } from '../../context/AppContext'

const perceptions = santanderClient.insights ?? []

export function SectionSantanderInsights() {
  const { navigate } = useApp()

  return (
    <SectionWrapper>
      <div className="px-8 py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-sm mb-4">
            Percepções Santander
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foursys-text mb-4">
            O que identificamos
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            Baseado em anos de parceria e projetos dentro do ecossistema Santander, mapeamos os principais desafios — e temos soluções prontas para cada um.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {perceptions.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-foursys-surface/50 border border-white/10 hover:border-foursys-blue/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="mb-4"><DynIcon name={p.icon} size={28} className="text-foursys-blue" /></div>

              <h3 className="text-lg font-bold text-foursys-text mb-2">{p.title}</h3>

              <p className="text-sm text-foursys-text-dim leading-relaxed mb-4">{p.description}</p>

              <div className="pt-4 border-t border-white/8">
                <div className="text-xs font-semibold text-foursys-cyan uppercase tracking-wide mb-2">Nossa resposta</div>
                <p className="text-sm text-foursys-text-muted leading-relaxed">{p.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Insights Valdir */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-8 rounded-2xl bg-gradient-to-r from-foursys-blue/15 to-foursys-cyan/8 border border-foursys-blue/30"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0"><DynIcon name="clipboard-list" size={28} className="text-foursys-blue" /></div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-foursys-cyan uppercase tracking-wide mb-2">Material Estratégico Interno</div>
              <h3 className="text-xl font-bold text-foursys-text mb-3">Insights do Material do Valdir</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Oportunidade de expansão em Quality e Automação',
                  'Demanda crescente por modernização de legado Java/COBOL',
                  'Abertura do Santander para soluções de IA com governança',
                  'Necessidade de squads com maior velocidade de entrega',
                  'Prioridade em conformidade regulatória BACEN 2025',
                  'Demanda por engenharia de dados e analytics avançado'
                ].map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-foursys-cyan mt-2 flex-shrink-0" />
                    <span className="text-sm text-foursys-text-muted">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate('client-extra-1')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-foursys-blue/20 border border-foursys-blue/30 text-foursys-cyan text-sm hover:bg-foursys-blue/30 transition-colors"
            >
              Ver Framework Quality IA <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigate('services')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 text-foursys-text-muted text-sm hover:border-white/30 transition-colors"
            >
              Ver nossos serviços <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
