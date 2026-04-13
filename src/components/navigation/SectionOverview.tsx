import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'
import { DynIcon } from '../../utils/iconMap'
import type { AppSection } from '../../types'

interface SectionOverviewProps {
  isOpen: boolean
  onClose: () => void
}

export function SectionOverview({ isOpen, onClose }: SectionOverviewProps) {
  const { navigate, state, activeNavigationItems, activeSectionCategories } = useApp()
  const { t } = useLanguage()

  function handleNavigate(sectionId: string) {
    navigate(sectionId as AppSection)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-8 z-[70] bg-foursys-dark-2 border border-white/[0.1] rounded-2xl overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Visão geral das seções"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div>
                <h2 className="text-lg font-black text-white">{t('overview.title')}</h2>
                <p className="text-xs text-foursys-text-muted mt-0.5">
                  {t('overview.progress').replace('{visited}', String(state.visitedSections.length)).replace('{total}', String(activeNavigationItems.length))}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/[0.08] text-foursys-text-dim hover:text-white transition-colors"
                aria-label="Fechar agenda"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">
              {activeSectionCategories.map(category => {
                const items = activeNavigationItems.filter(n => n.category === category)
                if (items.length === 0) return null

                return (
                  <div key={category} className="mb-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.16em] text-foursys-primary mb-3">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                      {items.map(item => {
                        const isVisited = state.visitedSections.includes(item.id as AppSection)
                        const isCurrent = state.currentSection === item.id

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavigate(item.id)}
                            className={`group relative flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${
                              isCurrent
                                ? 'bg-foursys-primary/15 border-foursys-primary/40 shadow-[0_0_12px_rgba(255,102,0,0.1)]'
                                : isVisited
                                ? 'bg-white/[0.03] border-white/[0.1] hover:border-foursys-primary/30 hover:bg-white/[0.05]'
                                : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04]'
                            }`}
                          >
                            <DynIcon
                              name={item.icon}
                              size={16}
                              className={`flex-shrink-0 mt-0.5 ${
                                isCurrent ? 'text-foursys-primary' : 'text-foursys-text-dim group-hover:text-foursys-text-muted'
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <div className={`text-xs font-semibold leading-snug ${
                                isCurrent ? 'text-foursys-primary' : 'text-white'
                              }`}>
                                {item.label}
                              </div>
                              <div className="text-[10px] text-foursys-text-dim mt-0.5 leading-snug line-clamp-2">
                                {item.description}
                              </div>
                            </div>
                            {isVisited && (
                              <Check size={12} className="flex-shrink-0 text-foursys-success mt-0.5" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
