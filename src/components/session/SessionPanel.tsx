import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, BarChart2, MapPin, Copy, CheckCheck, ChevronRight, Star, History, FileDown, Download } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'
import { DynIcon } from '../../utils/iconMap'
import { getTrailById, trails } from '../../data/trails'
import { useSessionHistory } from '../../hooks/useSessionHistory'
import { getCTAClicks } from '../../hooks/useSessionPersistence'
import { SessionHistory } from './SessionHistory'
import { getClientById } from '../../data/clients'
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
  const { state, toggleMetricsPanel, getSectionLabel, getSectionIcon, navigate, activeNavigationItems, toggleExportModal } = useApp()
  const { t, lang } = useLanguage()
  const { save } = useSessionHistory()
  const [elapsed, setElapsed] = useState(0)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'session' | 'history'>('session')

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
    const dateFmt = lang === 'pt' ? 'pt-BR' : 'en-US'
    const date = new Date().toLocaleDateString(dateFmt, { dateStyle: 'long' })
    const interestLabels = state.interestedSections.map(s => getSectionLabel(s as AppSection))
    const profileLine = state.sessionProfile
      ? `[${t('session.summaryProfile')}] ${state.sessionProfile.role?.toUpperCase() ?? '—'} · ${state.sessionProfile.sector ?? '—'} · ${state.sessionProfile.objective ?? '—'}`
      : ''
    const lines = [
      t('session.summaryTitle'),
      `${t('session.summaryDate')}: ${date}`,
      `${t('session.summaryDuration')}: ${formatHMS(elapsed)}`,
      `${t('session.summaryPresented')}: ${visitedStats.length}`,
      currentTrail ? `${t('session.summaryTrail')}: ${currentTrail.label}` : '',
      profileLine,
      ``,
      interestLabels.length > 0 ? `${t('session.summaryInterest')}: ${interestLabels.join(', ')}` : '',
      ``,
      `── ${t('session.summarySectionsPresented')} ──`,
      ...visitedStats.map(s =>
        `${getSectionIcon(s.section)} ${getSectionLabel(s.section)} — ${formatShort(s.totalSeconds)}`
      ),
      ``,
      t('session.summaryNextSteps'),
      visitedStats.some(s => s.section === 'offers-flagship')
        ? `• ${t('session.summaryStepOffers')}` : '',
      visitedStats.some(s => s.section === 'cases')
        ? `• ${t('session.summaryStepCases')}` : '',
      visitedStats.some(s => s.section === 'services')
        ? `• ${t('session.summaryStepServices')}` : '',
      visitedStats.some(s => s.section === 'client-cases')
        ? `• ${t('session.summaryStepClientCases')}` : '',
      visitedStats.some(s => s.section === 'alliances')
        ? `• ${t('session.summaryStepAlliances')}` : '',
      ``,
      `${t('session.summaryGenerated')} — ${new Date().toLocaleTimeString(dateFmt)}`,
    ].filter(l => l !== undefined && l !== null && l !== '')

    navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)

    // Salvar registro no histórico
    const activeClient = state.activeClientId ? getClientById(state.activeClientId) : null
    const topSections = [...visitedStats]
      .sort((a, b) => b.totalSeconds - a.totalSeconds)
      .slice(0, 3)
      .map(s => ({ section: s.section, seconds: s.totalSeconds }))

    save({
      id: String(Date.now()),
      date: new Date().toISOString(),
      clientId: state.activeClientId,
      clientName: activeClient?.name ?? null,
      profileSector: state.sessionProfile?.sector ?? null,
      profileRole: state.sessionProfile?.role ?? null,
      trailId: state.currentTrailId,
      durationSeconds: elapsed,
      sectionsVisited: visitedStats.length,
      topSections,
      interestedSections: state.interestedSections,
    })
  }, [elapsed, visitedStats, currentTrail, getSectionIcon, getSectionLabel, state.interestedSections, state.sessionProfile, state.activeClientId, state.currentTrailId, save, t, lang])

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
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[380px] flex flex-col bg-foursys-dark border-l border-white/[0.07] shadow-2xl overflow-hidden"
          >

            {/* Header */}
            <div className="border-b border-white/[0.06]">
              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <BarChart2 size={16} className="text-foursys-primary" />
                  <span className="text-sm font-bold text-foursys-text">{t('session.analytics')}</span>
                </div>
                <button
                  onClick={toggleMetricsPanel}
                  aria-label={t('session.closePanel')}
                  className="p-1.5 rounded-lg hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
              {/* Tabs */}
              <div className="flex px-5 gap-1 pb-0">
                <button
                  onClick={() => setActiveTab('session')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t-lg border-b-2 transition-all ${
                    activeTab === 'session'
                      ? 'border-foursys-primary text-foursys-primary'
                      : 'border-transparent text-foursys-text-dim hover:text-foursys-text-muted'
                  }`}
                >
                  <BarChart2 size={11} />
                  {t('session.sessionTab')}
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t-lg border-b-2 transition-all ${
                    activeTab === 'history'
                      ? 'border-foursys-primary text-foursys-primary'
                      : 'border-transparent text-foursys-text-dim hover:text-foursys-text-muted'
                  }`}
                >
                  <History size={11} />
                  {t('session.historyTab')}
                </button>
              </div>
            </div>

            {activeTab === 'session' && (<>
            {/* KPIs do topo */}
            <div className="grid grid-cols-3 gap-2 px-4 py-4 border-b border-white/[0.06]">
              {/* Tempo */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-foursys-dark-3/60 border border-white/[0.05]">
                <Clock size={13} className="text-foursys-primary mb-1.5" />
                <span className="text-base font-black text-foursys-text font-mono">{formatHMS(elapsed)}</span>
                <span className="text-[10px] text-foursys-text-dim mt-0.5">{t('session.duration')}</span>
              </div>
              {/* Seções */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-foursys-dark-3/60 border border-white/[0.05]">
                <MapPin size={13} className="text-foursys-primary mb-1.5" />
                <span className="text-base font-black text-foursys-text">
                  {visitedStats.length}<span className="text-foursys-text-dim text-xs font-normal">/{activeNavigationItems.length}</span>
                </span>
                <span className="text-[10px] text-foursys-text-dim mt-0.5">{t('session.sections')}</span>
              </div>
              {/* Engajamento */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-foursys-dark-3/60 border border-white/[0.05]">
                <BarChart2 size={13} className="text-foursys-primary mb-1.5" />
                <span className="text-base font-black text-foursys-text">
                  {visitedStats.length > 0 ? Math.round(visitedStats.reduce((a, s) => a + s.totalSeconds, 0) / visitedStats.length) : 0}
                  <span className="text-foursys-text-dim text-xs font-normal">s</span>
                </span>
                <span className="text-[10px] text-foursys-text-dim mt-0.5">{t('session.avgPerSection')}</span>
              </div>
            </div>

            {/* Trilha ativa */}
            {currentTrail && (
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DynIcon name={currentTrail.icon} size={16} className="text-foursys-text-muted" />
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
                      className="mt-2 w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-foursys-primary/10 border border-transparent hover:border-foursys-primary/30 transition-all duration-150 group"
                    >
                      <span className="text-xs text-foursys-text-muted group-hover:text-foursys-text">
                        {t('session.next')} <span className="font-medium">{getSectionLabel(nextStep.sectionId)}</span>
                      </span>
                      <ChevronRight size={12} className="text-foursys-text-dim group-hover:text-foursys-primary transition-colors" />
                    </button>
                  )
                })()}
              </div>
            )}

            {/* Interesses marcados */}
            {state.interestedSections.length > 0 && (
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-1.5 mb-2">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-semibold text-amber-300/80 uppercase tracking-widest">
                    {t('session.interests')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {state.interestedSections.map(s => (
                    <span
                      key={s}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10px] font-medium"
                    >
                      <DynIcon name={getSectionIcon(s as AppSection)} size={12} className="text-amber-300" />
                      {getSectionLabel(s as AppSection)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Alto Interesse — seções com mais de 60s */}
            {(() => {
              const highInterest = visitedStats.filter(s => s.totalSeconds >= 60)
              if (highInterest.length === 0) return null
              return (
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock size={11} className="text-emerald-400" />
                    <span className="text-[10px] font-semibold text-emerald-300/80 uppercase tracking-widest">
                      {t('session.highEngagement')} (&gt;60s)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {highInterest.map(s => (
                      <button
                        key={s.section}
                        onClick={() => navigate(s.section as AppSection)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/25 text-emerald-300 text-[10px] font-medium hover:bg-emerald-400/20 transition-colors"
                      >
                        <DynIcon name={getSectionIcon(s.section as AppSection)} size={12} className="text-emerald-300" />
                        {getSectionLabel(s.section as AppSection)} · {formatShort(s.totalSeconds)}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* CTAs clicados */}
            {(() => {
              const clicks = getCTAClicks()
              const entries = Object.entries(clicks).sort((a, b) => b[1] - a[1])
              if (entries.length === 0) return null
              return (
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <ChevronRight size={11} className="text-foursys-cyan" />
                    <span className="text-[10px] font-semibold text-foursys-cyan/80 uppercase tracking-widest">
                      {t('session.ctasTriggered')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {entries.slice(0, 8).map(([label, count]) => (
                      <span
                        key={label}
                        className="px-2 py-0.5 rounded-full bg-foursys-cyan/10 border border-foursys-cyan/20 text-foursys-cyan text-[10px] font-medium"
                      >
                        {label} × {count}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* Lista de seções visitadas */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3">
              <div className="text-[10px] font-semibold text-foursys-text-dim uppercase tracking-widest mb-3">
                {t('session.timePerSection')}
              </div>

              {visitedStats.length === 0 ? (
                <p className="text-xs text-foursys-text-dim text-center py-8">
                  {t('session.navigateHint')}
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
                            ? 'bg-foursys-primary/10 border border-foursys-primary/25'
                            : 'hover:bg-white/[0.04] border border-transparent'
                          }`}
                      >
                        <DynIcon name={getSectionIcon(stat.section as AppSection)} size={16} className="text-foursys-text-muted flex-shrink-0" />
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-medium truncate ${isActive ? 'text-foursys-primary' : 'text-foursys-text-muted group-hover:text-foursys-text'}`}>
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

            </>)}

            {activeTab === 'history' && (
              <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-3">
                <SessionHistory />
              </div>
            )}

            {/* Footer — trilhas disponíveis */}
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <div className="text-[10px] font-semibold text-foursys-text-dim uppercase tracking-widest mb-2">
                {t('session.availableTrails')}
              </div>
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {trails.map(tr => (
                  <button
                    key={tr.id}
                    onClick={() => {
                      toggleMetricsPanel()
                    }}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all duration-150
                      ${state.currentTrailId === tr.id
                        ? 'border'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border border-transparent'
                      }`}
                    style={state.currentTrailId === tr.id ? {
                      borderColor: `${tr.colorHex}50`,
                      backgroundColor: `${tr.colorHex}12`,
                    } : {}}
                  >
                    <DynIcon name={tr.icon} size={16} className="text-foursys-text-muted" />
                    <div>
                      <div className="text-[10px] font-semibold text-foursys-text leading-tight">{tr.label}</div>
                      <div className="text-[9px] text-foursys-text-dim">{tr.duration}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Gerar resumo */}
              <div className="flex gap-2 pb-[env(safe-area-inset-bottom)]">
                <button
                  onClick={generateSummary}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-foursys-primary/15 border border-foursys-primary/30 hover:bg-foursys-primary/22 hover:border-foursys-primary/50 text-foursys-primary transition-all duration-150 font-semibold text-sm shadow-[0_0_15px_rgba(255,102,0,0.12)]"
                >
                  {copied
                    ? <><CheckCheck size={14} /> {t('session.copied')}</>
                    : <><Copy size={14} /> {t('session.generateSummary')}</>
                  }
                </button>
                <button
                  onClick={() => {
                    const activeClient = state.activeClientId ? getClientById(state.activeClientId) : null
                    const data = {
                      app: 'FoursysPortal',
                      date: new Date().toISOString(),
                      duration: formatHMS(elapsed),
                      durationSeconds: elapsed,
                      profile: state.sessionProfile,
                      client: activeClient?.name ?? null,
                      trail: currentTrail?.label ?? null,
                      sectionsVisited: visitedStats.map(s => ({
                        section: getSectionLabel(s.section),
                        seconds: s.totalSeconds,
                        visits: s.visitCount,
                      })),
                      interests: state.interestedSections.map(s => getSectionLabel(s as AppSection)),
                    }
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `foursys-sessao-${new Date().toISOString().slice(0, 10)}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-foursys-text-muted hover:text-foursys-text hover:bg-white/[0.08] transition-all text-xs font-medium"
                  aria-label={t('session.exportJson')}
                  title={t('session.exportSessionTitle')}
                >
                  <Download size={14} />
                </button>
                <button
                  onClick={() => { toggleMetricsPanel(); toggleExportModal() }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-foursys-text-muted hover:text-foursys-text hover:bg-white/[0.08] transition-all text-xs font-medium"
                  aria-label={t('session.exportPdfAria')}
                  title={t('session.exportPdfAria')}
                >
                  <FileDown size={14} />
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
