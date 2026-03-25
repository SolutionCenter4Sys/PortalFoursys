import { motion } from 'framer-motion'
import { useApp } from '../../../context/AppContext'
import { SectionWrapper } from '../../ui/SectionWrapper'
import { InterestButton } from '../../ui/InterestButton'
import { getClientById } from '../../../data/clients'

// ─── Tipos para os dados de extra1 do Quality IA ─────────────────────────────

interface QualityPhase {
  id: string
  title: string
  description: string
  icon: string
}

interface QualityMetric {
  value: string
  label: string
}

interface QualityIAContent {
  phases: QualityPhase[]
  metrics: QualityMetric[]
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionClientExtra1() {
  const { state } = useApp()
  const client = state.activeClientId ? getClientById(state.activeClientId) : null

  if (!client?.extra1) return null

  const { title, subtitle, content } = client.extra1
  const clientColor = client.colors.primary

  // Tenta interpretar como Quality IA content
  const qaContent = content as QualityIAContent | null

  return (
    <SectionWrapper>
      <div className="px-8 py-10 max-w-5xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit mb-4"
            style={{ borderColor: `${clientColor}40`, backgroundColor: `${clientColor}12`, color: clientColor }}
          >
            <span className="text-sm">⚡</span>
            <span className="text-sm font-semibold">{client.name}</span>
          </div>

          <h2 className="text-4xl font-black text-white leading-none mb-3">{title}</h2>
          <p className="text-foursys-text-muted text-base max-w-2xl leading-relaxed">{subtitle}</p>
          <div className="mt-4">
            <InterestButton section="client-extra-1" />
          </div>

          <div
            className="mt-6 h-px"
            style={{
              background: `linear-gradient(to right, ${clientColor}50, rgba(255,255,255,0.06), transparent)`,
            }}
          />
        </motion.div>

        {qaContent?.metrics && (
          <>
            {/* ── Métricas ── */}
            <div className="grid grid-cols-4 gap-4 mb-10">
              {qaContent.metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-5 rounded-2xl border border-white/[0.08] bg-foursys-surface/40 text-center"
                >
                  <div className="text-3xl font-black mb-1" style={{ color: clientColor }}>
                    {m.value}
                  </div>
                  <div className="text-xs text-foursys-text-muted">{m.label}</div>
                </motion.div>
              ))}
            </div>

            {/* ── Fases ── */}
            {qaContent.phases && (
              <div className="grid grid-cols-2 gap-5">
                {qaContent.phases.map((phase, i) => (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    className="p-6 rounded-2xl border border-white/[0.08] bg-foursys-surface/30 flex gap-4"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${clientColor}15`, border: `1px solid ${clientColor}30` }}
                    >
                      {phase.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: clientColor }}
                        >
                          Fase {i + 1}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-foursys-text mb-2">{phase.title}</h3>
                      <p className="text-xs text-foursys-text-muted leading-relaxed">{phase.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Fallback se não houver content estruturado */}
        {!qaContent && (
          <div className="flex items-center justify-center h-48 text-foursys-text-muted text-sm">
            Conteúdo específico sendo preparado.
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
