import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import { SectionWrapper } from '../../ui/SectionWrapper'
import { getClientById } from '../../../data/clients'

// ─── Componente de card de percepção ─────────────────────────────────────────

function InsightCard({
  insight,
  index,
  clientColor,
}: {
  insight: { id: string; title: string; description: string; solution: string; icon: string }
  index: number
  clientColor: string
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="rounded-2xl border border-white/[0.08] bg-foursys-surface/30 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-start gap-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-2xl flex-shrink-0 mt-0.5">{insight.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-foursys-text leading-snug">{insight.title}</h3>
          <p className="text-xs text-foursys-text-muted mt-1 line-clamp-2 leading-relaxed">
            {insight.description}
          </p>
        </div>
        <div className="flex-shrink-0 mt-0.5 text-foursys-text-dim">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="mx-5 mb-5 p-4 rounded-xl border-l-[3px]"
              style={{
                borderColor: clientColor,
                backgroundColor: `${clientColor}08`,
              }}
            >
              <div
                className="text-[10px] font-bold uppercase tracking-[0.14em] mb-2"
                style={{ color: clientColor }}
              >
                Resposta Foursys
              </div>
              <p className="text-sm text-foursys-text-muted leading-relaxed">{insight.solution}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionClientInsights() {
  const { state } = useApp()
  const client = state.activeClientId ? getClientById(state.activeClientId) : null

  if (!client) return null

  const insights = client.insights ?? []
  const clientColor = client.colors.primary

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-5xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <span
            className="text-xs font-bold uppercase tracking-[0.18em] mb-2 block"
            style={{ color: clientColor }}
          >
            {client.name}
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-none mb-3">
            Percepções {client.name}
          </h2>
          <p className="text-foursys-text-muted text-base max-w-2xl leading-relaxed">
            O que identificamos nas operações e no contexto do {client.name} — dores reais com respostas concretas.
          </p>
          <div
            className="mt-6 h-px bg-gradient-to-r from-transparent via-transparent to-transparent"
            style={{
              background: `linear-gradient(to right, ${clientColor}50, rgba(255,255,255,0.06), transparent)`,
            }}
          />
        </motion.div>

        {insights.length > 0 ? (
          <>
            {/* ── Grid de percepções ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
              {insights.map((insight, i) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  index={i}
                  clientColor={clientColor}
                />
              ))}
            </div>

            {/* ── Resumo ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl border border-white/[0.08] bg-foursys-surface/20"
            >
              <h3 className="text-sm font-bold text-foursys-text mb-3">
                Nossa abordagem para {client.name}
              </h3>
              <p className="text-sm text-foursys-text-muted leading-relaxed">
                Cada percepção listada acima foi identificada a partir de experiências reais nos projetos do {client.name}.
                Nossa proposta não é vender tecnologia genérica — é resolver os problemas específicos que impedem
                a velocidade, a qualidade e a inovação do {client.name}.
              </p>
            </motion.div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-foursys-text-muted text-sm">
            Percepções em preparação. Entre em contato para detalhes.
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
