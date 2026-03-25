import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import { SectionWrapper } from '../../ui/SectionWrapper'
import { InterestButton } from '../../ui/InterestButton'
import { getClientById } from '../../../data/clients'
import type { ClientCase } from '../../../types'

// ─── Modal de detalhe ─────────────────────────────────────────────────────────

function CaseModal({
  clientCase,
  clientColor,
  onClose,
}: {
  clientCase: ClientCase
  clientColor: string
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 bg-foursys-dark-2 border border-white/[0.12] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar"
      >
        {/* Header do modal */}
        <div
          className="p-7 border-b border-white/[0.06]"
          style={{ background: `linear-gradient(135deg, ${clientColor}15 0%, transparent 100%)` }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 text-foursys-text-muted transition-colors"
          >
            <X size={16} />
          </button>

          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border mb-4 inline-block"
            style={{ color: clientColor, backgroundColor: `${clientColor}15`, borderColor: `${clientColor}44` }}
          >
            {clientCase.type}
          </span>

          <h3 className="text-2xl font-black text-white leading-tight mb-1">{clientCase.title}</h3>
          <p className="text-sm text-foursys-text-dim">{clientCase.sector}</p>
        </div>

        {/* Conteúdo */}
        <div className="p-7 space-y-5">
          {clientCase.metric && (
            <div className="p-5 rounded-xl bg-foursys-surface/60 border border-white/[0.06] flex items-center gap-5">
              <TrendingUp size={20} style={{ color: clientColor }} />
              <div>
                <div className="text-4xl font-black leading-none" style={{ color: clientColor }}>
                  {clientCase.metric.value}
                </div>
                <div className="text-sm text-foursys-text-muted mt-0.5">{clientCase.metric.label}</div>
              </div>
            </div>
          )}

          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-foursys-text-dim mb-2">Desafio</div>
            <p className="text-sm text-foursys-text-muted leading-relaxed">{clientCase.challenge}</p>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-foursys-text-dim mb-2">Solução</div>
            <p className="text-sm text-foursys-text-muted leading-relaxed">{clientCase.solution}</p>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-foursys-text-dim mb-2">Resultados</div>
            <ul className="space-y-2">
              {clientCase.results.map(r => (
                <li key={r} className="flex items-start gap-2.5 text-sm text-foursys-text-muted">
                  <CheckCircle2 size={14} style={{ color: clientColor }} className="flex-shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {clientCase.stack.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-foursys-text-dim mb-2">Stack</div>
              <div className="flex flex-wrap gap-2">
                {clientCase.stack.map(t => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-lg border"
                    style={{ color: clientColor, backgroundColor: `${clientColor}10`, borderColor: `${clientColor}30` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Card de case ─────────────────────────────────────────────────────────────

function ClientCaseCard({
  clientCase,
  index,
  clientColor,
  onClick,
}: {
  clientCase: ClientCase
  index: number
  clientColor: string
  onClick: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
      onClick={onClick}
      className="group rounded-2xl border border-white/[0.08] bg-foursys-surface/30 overflow-hidden cursor-pointer hover:border-white/[0.18] hover:-translate-y-1 transition-all duration-300 flex flex-col p-6"
      style={{ borderTop: `3px solid ${clientColor}50` }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border mb-3 self-start"
        style={{ color: clientColor, backgroundColor: `${clientColor}12`, borderColor: `${clientColor}40` }}
      >
        {clientCase.type}
      </span>

      <h3 className="text-lg font-black text-white leading-tight mb-1">{clientCase.title}</h3>
      <p className="text-xs text-foursys-text-dim mb-4">{clientCase.sector}</p>

      {clientCase.metric && (
        <div className="mb-4">
          <span className="text-3xl font-black" style={{ color: clientColor }}>
            {clientCase.metric.value}
          </span>
          <span className="text-xs text-foursys-text-dim ml-2">{clientCase.metric.label}</span>
        </div>
      )}

      <p className="text-sm text-foursys-text-muted leading-relaxed flex-1 line-clamp-3">
        {clientCase.challenge}
      </p>

      {clientCase.stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {clientCase.stack.slice(0, 4).map(t => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-md border"
              style={{ color: clientColor, backgroundColor: `${clientColor}08`, borderColor: `${clientColor}25` }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div
        className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: clientColor }}
      >
        Ver case completo <ArrowRight size={12} />
      </div>
    </motion.div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionClientCases() {
  const { state } = useApp()
  const [selectedCase, setSelectedCase] = useState<ClientCase | null>(null)
  const client = state.activeClientId ? getClientById(state.activeClientId) : null

  if (!client) return null

  const cases = client.cases ?? []
  const clientColor = client.colors.primary

  return (
    <SectionWrapper>
      <div className="px-8 py-10 max-w-6xl mx-auto">

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
          <h2 className="text-4xl font-black text-white leading-none mb-3">
            Cases no {client.name}
          </h2>
          <p className="text-foursys-text-muted text-base max-w-2xl leading-relaxed">
            Projetos entregues dentro do ecossistema {client.name} — com métricas reais e impacto mensurável.
          </p>
          <div className="mt-4">
            <InterestButton section="client-cases" />
          </div>
          <div
            className="mt-6 h-px"
            style={{
              background: `linear-gradient(to right, ${clientColor}50, rgba(255,255,255,0.06), transparent)`,
            }}
          />
        </motion.div>

        {cases.length > 0 ? (
          <div className="grid grid-cols-2 gap-5">
            {cases.map((c, i) => (
              <ClientCaseCard
                key={c.id}
                clientCase={c}
                index={i}
                clientColor={clientColor}
                onClick={() => setSelectedCase(c)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-foursys-text-muted text-sm">
            Cases em preparação. Entre em contato para detalhes.
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCase && (
          <CaseModal
            clientCase={selectedCase}
            clientColor={clientColor}
            onClose={() => setSelectedCase(null)}
          />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
