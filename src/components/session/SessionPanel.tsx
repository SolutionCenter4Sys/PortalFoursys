import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, BarChart2, MapPin, Copy, CheckCheck, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getTrailById, trails } from '../../data/trails'
import type { AppSection } from '../../types'

// ─── Utilidades ──────────────────────────────────────────────────────────────

function formatHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatShort(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function SessionPanel() {
  const { state, toggleMetricsPanel, getSectionLabel, getSectionIcon, navigate } = useApp()
  const [elapsed, setElapsed] = useState(0)
  const [copied, setCopied] = useState(false)

  // Timer ao vivo
  useEffect(() => {
    if (!state.isMetricsPanelOpen) return
    const id = setInterval(() => {
      setElapsed(Math.round((Date.now() - state.sessionStartedAt) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [state.isMetricsPanelOpen, state.sessionStartedAt])

  const currentTrail = state.currentTrailId ? getTrailById(state.currentTrailId) : null
  const trailProgress = currentTrail
    ? currentTrail.steps.filter(s => state.trailVisitedSections.includes(s.sectionId)).length
    : 0

  // Seções visitadas com stats, ordenadas por tempo total
  const visitedStats = state.sessionStats
    .filter(s => s.totalSeconds > 0)
    .sort((a, b) => b.totalSeconds - a.totalSeconds)

  const maxSeconds = visitedStats.length > 0 ? visitedStats[0].totalSeconds : 1

  const generateSummary = useCallback(() => {
    const date = new Date().toLocaleDateString('pt-BR', { dateStyle: 'long' })
    const lines = [
      `📋 Reunião Foursys × Santander`,
      `📅 Data: ${date}`,
      `⏱️  Duração: ${formatHMS(elapsed)}`,
      `📊 Seções apresentadas: ${visitedStats.length}/18`,
      currentTrail ? `🗺️  Trilha: ${currentTrail.label}` : '',
      ``,
      `── Seções Apresentadas ──`,
      ...visitedStats.map(s =>
        `${getSectionIcon(s.section)} ${getSectionLabel(s.section)} — ${formatShort(s.totalSeconds)}`
      ),
      ``,
      `── Próximos Passos Sugeridos ──`,
      visitedStats.some(s => s.section === 'quality-ia')
        ? `• Agendar demo do Framework Quality IA com equipe técnica` : '',
      visitedStats.some(s => s.section === 'cases')
        ? `• Solicitar relatório completo dos cases apresentados` : '',
      visitedStats.some(s => s.section === 'lab-ia')
        ? `• Visita ao Lab IA Foursys — POC em 2 semanas` : '',
      visitedStats.some(s => s.section === 'shi-case')
        ? `• Reunião de alinhamento com time SHI / Santander` : '',
      visitedStats.some(s => s.section === 'alliances')
        ? `• Enviar proposta de co-selling com alianças estratégicas` : '',
      ``,
      `Gerado pelo FoursysPortal — ${new Date().toLocaleTimeString('pt-BR')}`,
    ].filter(l => l !== undefined && l !== null && l !== '')

    navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }, [elapsed, visitedStats, currentTrail, getSectionIcon, getSectionLabel])

  return (
    <AnimatePresence>
      {state.isMetricsPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMetricsPanel}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          />

          {/* Painel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-[380px] flex flex-col bg-foursys-dark border-l border-white/[0.07] shadow-2xl overflow-hidden"
          >

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <BarChart2 size={16} className="text-foursys-blue" />
                <span className="text-sm font-bold text-foursys-text">Analytics da Sessão</span>
              </div>
              <button
                onClick={toggleMetricsPanel}
                className="p-1.5 rounded-lg hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* KPIs do topo */}
            <div className="grid grid-cols-3 gap-2 px-4 py-4 border-b border-white/[0.06]">
              {/* Tempo */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-foursys-dark-3/60 border border-white/[0.05]">
                <Clock size={13} className="text-foursys-blue mb-1.5" />
                <span className="text-base font-black text-foursys-text font-mono">{formatHMS(elapsed)}</span>
                <span className="text-[10px] text-foursys-text-dim mt-0.5">Duração</span>
              </div>
              {/* Seções */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-foursys-dark-3/60 border border-white/[0.05]">
                <MapPin size={13} className="text-foursys-blue mb-1.5" />
                <span className="text-base font-black text-foursys-text">
                  {visitedStats.length}<span className="text-foursys-text-dim text-xs font-normal">/18</span>
                </span>
                <span className="text-[10px] text-foursys-text-dim mt-0.5">Seções</span>
              </div>
              {/* Engajamento */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-foursys-dark-3/60 border border-white/[0.05]">
                <BarChart2 size={13} className="text-foursys-blue mb-1.5" />
                <span className="text-base font-black text-foursys-text">
                  {visitedStats.length > 0 ? Math.round(visitedStats.reduce((a, s) => a + s.totalSeconds, 0) / visitedStats.length) : 0}
                  <span className="text-foursys-text-dim text-xs font-normal">s</span>
                </span>
                <span className="text-[10px] text-foursys-text-dim mt-0.5">Média/seção</span>
              </div>
            </div>

            {/* Trilha ativa */}
            {currentTrail && (
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{currentTrail.icon}</span>
                    <span className="text-xs font-semibold text-foursys-text">{currentTrail.label}</span>
                  </div>
                  <span className="text-xs text-foursys-text-dim">{trailProgress}/{currentTrail.steps.length}</span>
                </div>
                {/* Barra de progresso */}
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: currentTrail.colorHex, boxShadow: `0 0 8px ${currentTrail.colorHex}60` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(trailProgress / currentTrail.steps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                {/* Próxima seção da trilha */}
                {trailProgress < currentTrail.steps.length && (() => {
                  const nextStep = currentTrail.steps.find(
                    s => !state.trailVisitedSections.includes(s.sectionId)
                  )
                  if (!nextStep) return null
                  return (
                    <button
                      onClick={() => navigate(nextStep.sectionId)}
                      className="mt-2 w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-foursys-blue/10 border border-transparent hover:border-foursys-blue/30 transition-all duration-150 group"
                    >
                      <span className="text-xs text-foursys-text-muted group-hover:text-foursys-text">
                        Próximo: <span className="font-medium">{getSectionLabel(nextStep.sectionId)}</span>
                      </span>
                      <ChevronRight size={12} className="text-foursys-text-dim group-hover:text-foursys-blue transition-colors" />
                    </button>
                  )
                })()}
              </div>
            )}

            {/* Lista de seções visitadas */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3">
              <div className="text-[10px] font-semibold text-foursys-text-dim uppercase tracking-widest mb-3">
                Tempo por Seção
              </div>

              {visitedStats.length === 0 ? (
                <p className="text-xs text-foursys-text-dim text-center py-8">
                  Navegue entre seções para acumular dados
                </p>
              ) : (
                <div className="space-y-2">
                  {visitedStats.map(stat => {
                    const pct = Math.round((stat.totalSeconds / maxSeconds) * 100)
                    const isActive = state.currentSection === stat.section

                    return (
                      <button
                        key={stat.section}
                        onClick={() => navigate(stat.section as AppSection)}
                        className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150
                          ${isActive
                            ? 'bg-foursys-blue/10 border border-foursys-blue/25'
                            : 'hover:bg-white/[0.04] border border-transparent'
                          }`}
                      >
                        <span className="text-base flex-shrink-0">{getSectionIcon(stat.section as AppSection)}</span>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-medium truncate ${isActive ? 'text-foursys-blue' : 'text-foursys-text-muted group-hover:text-foursys-text'}`}>
                              {getSectionLabel(stat.section as AppSection)}
                            </span>
                            <span className="text-[10px] text-foursys-text-dim ml-2 flex-shrink-0 font-mono">
                              {formatShort(stat.totalSeconds)}
                            </span>
                          </div>
                          {/* Barra de engajamento */}
                          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: isActive ? '#FF6600' : 'rgba(255,102,0,0.45)',
                              }}
                            />
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer — trilhas disponíveis */}
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <div className="text-[10px] font-semibold text-foursys-text-dim uppercase tracking-widest mb-2">
                Trilhas Disponíveis
              </div>
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {trails.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      toggleMetricsPanel()
                    }}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all duration-150
                      ${state.currentTrailId === t.id
                        ? 'border'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border border-transparent'
                      }`}
                    style={state.currentTrailId === t.id ? {
                      borderColor: `${t.colorHex}50`,
                      backgroundColor: `${t.colorHex}12`,
                    } : {}}
                  >
                    <span className="text-sm">{t.icon}</span>
                    <div>
                      <div className="text-[10px] font-semibold text-foursys-text leading-tight">{t.label}</div>
                      <div className="text-[9px] text-foursys-text-dim">{t.duration}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Gerar resumo */}
              <button
                onClick={generateSummary}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-foursys-blue/15 border border-foursys-blue/30 hover:bg-foursys-blue/22 hover:border-foursys-blue/50 text-foursys-blue transition-all duration-150 font-semibold text-sm shadow-[0_0_15px_rgba(255,102,0,0.12)]"
              >
                {copied
                  ? <><CheckCheck size={14} /> Copiado!</>
                  : <><Copy size={14} /> Gerar Resumo da Reunião</>
                }
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
