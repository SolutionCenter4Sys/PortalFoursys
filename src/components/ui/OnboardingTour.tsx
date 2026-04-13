import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
import { useLanguage } from '../../i18n'

const STORAGE_KEY = 'foursysportal_onboarding_v1'

interface TourStep {
  title: string
  description: string
  target: string
}

const TOUR_TARGETS = ['menu', 'search', 'swipe', 'analytics', 'fullscreen'] as const
const TOUR_STEP_KEYS = ['navigation', 'search', 'gestures', 'analytics', 'fullscreen'] as const

export function OnboardingTour() {
  const { t } = useLanguage()

  const TOUR_STEPS: TourStep[] = useMemo(() =>
    TOUR_TARGETS.map((target, i) => ({
      title: t(`onboarding.steps.${TOUR_STEP_KEYS[i]}.title`),
      description: t(`onboarding.steps.${TOUR_STEP_KEYS[i]}.description`),
      target,
    })),
    [t],
  )
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY)
    if (!seen) {
      const timer = setTimeout(() => setIsVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = useCallback(() => {
    setIsVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }, [])

  const next = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      dismiss()
    }
  }, [currentStep, dismiss])

  const prev = useCallback(() => {
    if (currentStep > 0) setCurrentStep(s => s - 1)
  }, [currentStep])

  const step = TOUR_STEPS[currentStep]

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-[2px]"
            onClick={dismiss}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label={t('onboarding.tourLabel')}
            className="fixed z-[201] bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/[0.1] bg-foursys-dark-3 shadow-2xl overflow-hidden"
          >
            <div className="relative p-6">
              <button
                onClick={dismiss}
                aria-label={t('onboarding.closeTour')}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/[0.08] text-foursys-text-dim hover:text-foursys-text transition-colors"
              >
                <X size={14} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-foursys-primary" />
                <span className="text-[10px] font-semibold text-foursys-primary uppercase tracking-widest">
                  {t('onboarding.tip')} {currentStep + 1}/{TOUR_STEPS.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-sm font-bold text-foursys-text mb-1.5">{step.title}</h3>
                  <p className="text-xs text-foursys-text-muted leading-relaxed">{step.description}</p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-5">
                <div className="flex gap-1">
                  {TOUR_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === currentStep ? 'w-5 bg-foursys-primary' : 'w-1.5 bg-white/[0.12]'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {currentStep > 0 && (
                    <button
                      onClick={prev}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-foursys-text-muted hover:text-foursys-text hover:bg-white/[0.06] transition-colors"
                    >
                      <ChevronLeft size={12} />
                      {t('common.previous')}
                    </button>
                  )}
                  <button
                    onClick={next}
                    className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-semibold bg-foursys-primary/15 border border-foursys-primary/30 text-foursys-primary hover:bg-foursys-primary/25 transition-colors"
                  >
                    {currentStep < TOUR_STEPS.length - 1 ? (
                      <>{t('common.next')} <ChevronRight size={12} /></>
                    ) : (
                      t('common.start')
                    )}
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
