import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'
import { DynIcon } from '../../utils/iconMap'
import type { SessionProfile } from '../../types'

// ─── Dados das etapas ────────────────────────────────────────────────────────

const SECTOR_IDS = ['financeiro', 'saude', 'seguros', 'outro'] as const
const SECTOR_ICONS = { financeiro: 'landmark', saude: 'heart', seguros: 'shield-check', outro: 'building' } as const

const ROLE_IDS = ['ceo', 'cfo', 'cto', 'diretor', 'gestor'] as const
const ROLE_ICONS = { ceo: 'crown', cfo: 'dollar-sign', cto: 'settings', diretor: 'bar-chart', gestor: 'target' } as const

const OBJECTIVE_IDS = ['apresentacao', 'proposta', 'demo'] as const
const OBJECTIVE_ICONS = { apresentacao: 'clipboard-list', proposta: 'pencil', demo: 'monitor' } as const

// ─── Componente ──────────────────────────────────────────────────────────────

export function SessionWizard() {
  const { state, setProfile, closeWizard } = useApp()
  const { t } = useLanguage()
  const [step, setStep] = useState(0)
  const [profile, setLocalProfile] = useState<SessionProfile>({
    sector: null,
    role: null,
    objective: null,
  })

  const steps = useMemo(() => [
    {
      title: t('wizard.sectorTitle'),
      subtitle: t('wizard.sectorSubtitle'),
      field: 'sector' as const,
      options: SECTOR_IDS.map(id => ({ id, label: t(`wizard.sectors.${id}`), icon: SECTOR_ICONS[id] })),
    },
    {
      title: t('wizard.roleTitle'),
      subtitle: t('wizard.roleSubtitle'),
      field: 'role' as const,
      options: ROLE_IDS.map(id => ({ id, label: t(`wizard.roles.${id}`), icon: ROLE_ICONS[id] })),
    },
    {
      title: t('wizard.objectiveTitle'),
      subtitle: t('wizard.objectiveSubtitle'),
      field: 'objective' as const,
      options: OBJECTIVE_IDS.map(id => ({ id, label: t(`wizard.objectives.${id}`), icon: OBJECTIVE_ICONS[id] })),
    },
  ], [t])

  if (!state.isWizardOpen) return null

  const currentStep = steps[step]
  const currentValue = profile[currentStep.field]
  const isLast = step === steps.length - 1

  function selectOption(id: string) {
    setLocalProfile(prev => ({ ...prev, [currentStep.field]: id }))
  }

  function handleNext() {
    if (!isLast) {
      setStep(s => s + 1)
    } else {
      setProfile(profile)
    }
  }

  function handleBack() {
    setStep(s => s - 1)
  }

  return (
    <AnimatePresence>
      {state.isWizardOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6"
          >
            <div role="dialog" aria-modal="true" aria-labelledby="wizard-title" className="w-full max-w-md bg-[#111218] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.07]">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    {steps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          i <= step ? 'bg-foursys-primary w-8' : 'bg-white/15 w-4'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-foursys-text-dim mt-1">
                    {t('wizard.stepOf').replace('{step}', String(step + 1)).replace('{total}', String(steps.length))}
                  </p>
                </div>
                <button
                  onClick={closeWizard}
                  aria-label={t('wizard.close')}
                  className="p-1.5 rounded-lg hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Corpo da etapa */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.22 }}
                  className="px-6 py-5"
                >
                  <h2 id="wizard-title" className="text-xl font-black text-foursys-text mb-0.5">
                    {currentStep.title}
                  </h2>
                  <p className="text-sm text-foursys-text-muted mb-5">
                    {currentStep.subtitle}
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    {currentStep.options.map(opt => {
                      const isSelected = currentValue === opt.id
                      return (
                        <motion.button
                          key={opt.id}
                          onClick={() => selectOption(opt.id)}
                          whileTap={{ scale: 0.96 }}
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-150 ${
                            isSelected
                              ? 'bg-foursys-primary/15 border-foursys-primary/50 text-foursys-text shadow-[0_0_12px_rgba(255,102,0,0.15)]'
                              : 'bg-white/[0.03] border-white/[0.07] text-foursys-text-muted hover:bg-white/[0.06] hover:border-white/15'
                          }`}
                        >
                          <DynIcon name={opt.icon} size={20} className="text-foursys-text-muted flex-shrink-0" />
                          <span className="text-sm font-semibold">{opt.label}</span>
                          {isSelected && (
                            <Check size={14} className="ml-auto text-foursys-primary flex-shrink-0" />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 pb-5 gap-3">
                <button
                  onClick={closeWizard}
                  className="text-xs text-foursys-text-dim hover:text-foursys-text-muted transition-colors"
                >
                  {t('wizard.skipSetup')}
                </button>

                <div className="flex items-center gap-2">
                  {step > 0 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-foursys-text-muted hover:text-foursys-text text-xs font-medium transition-all"
                    >
                      <ChevronLeft size={13} />
                      {t('wizard.back')}
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={!currentValue}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      currentValue
                        ? 'bg-foursys-primary/20 border border-foursys-primary/40 text-foursys-primary hover:bg-foursys-primary/30'
                        : 'bg-white/[0.03] border border-white/[0.06] text-foursys-text-dim cursor-not-allowed'
                    }`}
                  >
                    {isLast ? t('wizard.confirm') : t('wizard.next')}
                    {!isLast && <ChevronRight size={13} />}
                    {isLast && <Check size={13} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
