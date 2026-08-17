import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileDown, Check, Minus, CheckCheck, AlertCircle, Loader2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useExportPdf } from '../../hooks/useExportPdf'
import { useLanguage } from '../../i18n'
import { DynIcon } from '../../utils/iconMap'

export function ExportPdfModal() {
  const { state, toggleExportModal } = useApp()
  const {
    selectedSections,
    groupedSections,
    progress,
    isGenerating,
    toggleSection,
    toggleCategory,
    selectAll,
    clearSelection,
    isCategoryFullySelected,
    isCategoryPartiallySelected,
    generatePdf,
    resetProgress,
  } = useExportPdf()
  const { t } = useLanguage()

  useEffect(() => {
    if (!state.isExportModalOpen) {
      resetProgress()
    }
  }, [state.isExportModalOpen, resetProgress])

  useEffect(() => {
    if (!state.isExportModalOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isGenerating) toggleExportModal()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [state.isExportModalOpen, isGenerating, toggleExportModal])

  const allSelected = groupedSections.every(g =>
    g.items.every(item => selectedSections.has(item.id))
  )

  const progressPct = progress
    ? Math.round((progress.current / progress.total) * 100)
    : 0

  return (
    <AnimatePresence>
      {state.isExportModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isGenerating && toggleExportModal()}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[3px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('exportPdf.title')}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-[61] w-auto sm:w-[520px] max-h-[85dvh] sm:max-h-[80dvh] flex flex-col bg-foursys-dark border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-foursys-primary/15">
                  <FileDown size={18} className="text-foursys-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foursys-text">{t('exportPdf.title')}</h2>
                  <p className="text-[11px] text-foursys-text-dim mt-0.5">
                    {t('exportPdf.selectSections')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isGenerating && toggleExportModal()}
                disabled={isGenerating}
                aria-label={t('common.close')}
                className="p-1.5 rounded-lg hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text transition-colors disabled:opacity-40"
              >
                <X size={16} />
              </button>
            </div>

            {/* Actions bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <button
                  onClick={allSelected ? clearSelection : selectAll}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-foursys-primary/10 text-foursys-primary hover:bg-foursys-primary/20 border border-foursys-primary/20 transition-all disabled:opacity-40"
                >
                  {allSelected ? (
                    <><X size={12} /> {t('exportPdf.clearSelection')}</>
                  ) : (
                    <><CheckCheck size={12} /> {t('exportPdf.selectAllSections')}</>
                  )}
                </button>
              </div>
              <span className="text-[11px] text-foursys-text-dim font-medium">
                {selectedSections.size} {selectedSections.size !== 1 ? t('exportPdf.sectionsCount') : t('exportPdf.sectionCount')} {selectedSections.size !== 1 ? t('exportPdf.selectedPlural') : t('exportPdf.selectedSingular')}
              </span>
            </div>

            {/* Section list */}
            <div className="flex-1 overflow-y-auto stealth-scrollbar px-6 py-4">
              <div className="space-y-5">
                {groupedSections.map(group => {
                  const isFullySelected = isCategoryFullySelected(group.category)
                  const isPartial = isCategoryPartiallySelected(group.category)

                  return (
                    <div key={group.category}>
                      {/* Category header */}
                      <button
                        onClick={() => toggleCategory(group.category)}
                        disabled={isGenerating}
                        className="flex items-center gap-2.5 mb-2 group w-full text-left disabled:opacity-40"
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                          isFullySelected
                            ? 'bg-foursys-primary border-foursys-primary'
                            : isPartial
                              ? 'bg-foursys-primary/30 border-foursys-primary/60'
                              : 'border-white/20 group-hover:border-white/40'
                        }`}>
                          {isFullySelected && <Check size={10} className="text-white" strokeWidth={3} />}
                          {isPartial && <Minus size={10} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-[10px] font-bold text-foursys-text-dim uppercase tracking-[0.12em] group-hover:text-foursys-text-muted transition-colors">
                          {group.category}
                        </span>
                        <span className="text-[9px] text-foursys-text-dim/60">
                          ({group.items.filter(i => selectedSections.has(i.id)).length}/{group.items.length})
                        </span>
                      </button>

                      {/* Section items */}
                      <div className="space-y-1 ml-1">
                        {group.items.map(item => {
                          const isSelected = selectedSections.has(item.id)
                          return (
                            <button
                              key={item.id}
                              onClick={() => toggleSection(item.id)}
                              disabled={isGenerating}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 text-left disabled:opacity-40 ${
                                isSelected
                                  ? 'bg-foursys-primary/8 border border-foursys-primary/20'
                                  : 'hover:bg-white/[0.04] border border-transparent'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
                                isSelected
                                  ? 'bg-foursys-primary border-foursys-primary'
                                  : 'border-white/20'
                              }`}>
                                {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                              </div>
                              <DynIcon name={item.icon} size={14} className={`flex-shrink-0 ${isSelected ? 'text-foursys-primary' : 'text-foursys-text-dim'}`} />
                              <div className="min-w-0 flex-1">
                                <div className={`text-xs font-medium truncate ${isSelected ? 'text-foursys-text' : 'text-foursys-text-muted'}`}>
                                  {item.label}
                                </div>
                                <div className="text-[10px] text-foursys-text-dim truncate">
                                  {item.description}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/[0.06]">
              {/* Progress bar */}
              {progress && progress.status !== 'done' && progress.status !== 'error' && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] text-foursys-text-muted font-medium flex items-center gap-1.5">
                      <Loader2 size={12} className="animate-spin text-foursys-primary" />
                      {progress.status === 'preparing' && `${t('exportPdf.preparingSection')}: ${progress.currentSection}`}
                      {progress.status === 'capturing' && `${t('exportPdf.capturingSection')}: ${progress.currentSection}`}
                      {progress.status === 'building' && t('exportPdf.assembling')}
                    </span>
                    <span className="text-[10px] text-foursys-text-dim font-mono">
                      {progress.current}/{progress.total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-foursys-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.3 }}
                      style={{ boxShadow: '0 0 8px rgba(255,102,0,0.4)' }}
                    />
                  </div>
                </div>
              )}

              {/* Success message */}
              {progress?.status === 'done' && (
                <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCheck size={14} className="text-emerald-400" />
                  <span className="text-[11px] text-emerald-300 font-medium">
                    {t('exportPdf.successMessage')}
                  </span>
                </div>
              )}

              {/* Error message */}
              {progress?.status === 'error' && (
                <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertCircle size={14} className="text-red-400" />
                  <span className="text-[11px] text-red-300 font-medium">
                    {t('exportPdf.errorMessage')}
                  </span>
                </div>
              )}

              <button
                onClick={generatePdf}
                disabled={selectedSections.size === 0 || isGenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-foursys-primary/15 border border-foursys-primary/30 hover:bg-foursys-primary/25 hover:border-foursys-primary/50 text-foursys-primary shadow-[0_0_20px_rgba(255,102,0,0.1)]"
              >
                {isGenerating ? (
                  <><Loader2 size={16} className="animate-spin" /> {t('exportPdf.generating')}</>
                ) : (
                  <><FileDown size={16} /> {t('exportPdf.generateButton')} — {selectedSections.size} {selectedSections.size !== 1 ? t('exportPdf.sectionsCount') : t('exportPdf.sectionCount')}</>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
