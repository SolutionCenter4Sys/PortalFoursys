import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { useLanguage } from '../../i18n'
import { getDeliveryModels } from '../../data/services'
import { DynIcon } from '../../utils/iconMap'

export function SectionDelivery() {
  const { t, lang } = useLanguage()
  const deliveryModels = useMemo(() => getDeliveryModels(lang), [lang])

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-primary/15 border border-foursys-primary/30 text-foursys-cyan text-sm mb-4">
            {t('delivery.badge')}
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-foursys-text mb-4">
            {t('delivery.title')}
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            {t('delivery.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {deliveryModels.map((model, i) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              className={`
                p-7 rounded-2xl border backdrop-blur-md transition-all duration-300
                ${model.highlight
                  ? 'bg-gradient-to-br from-foursys-primary/25 to-foursys-cyan/10 border-foursys-primary/50 shadow-[0_0_40px_rgba(0,85,179,0.2)]'
                  : 'bg-foursys-surface/50 border-white/10 hover:border-white/20 hover:-translate-y-1'
                }
              `}
            >
              {model.highlight && (
                <div className="flex items-center gap-2 mb-4">
                  <Star size={14} className="text-foursys-cyan fill-foursys-cyan" />
                  <span className="text-xs font-semibold text-foursys-cyan uppercase tracking-widest">
                    {t('delivery.highlight')}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 mb-5">
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center
                  ${model.highlight ? 'bg-foursys-primary/30 shadow-[0_0_20px_rgba(0,85,179,0.4)]' : 'bg-foursys-surface border border-white/10'}
                `}>
                  <DynIcon name={model.icon} size={24} className="text-white/80" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${model.highlight ? 'text-foursys-text' : 'text-foursys-text'}`}>
                    {model.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-foursys-text-muted leading-relaxed mb-5">{model.description}</p>

              <div className="space-y-2.5">
                {model.features.map(feature => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check
                      size={15}
                      className={`flex-shrink-0 mt-0.5 ${model.highlight ? 'text-foursys-cyan' : 'text-green-400'}`}
                    />
                    <span className={`text-sm ${model.highlight ? 'text-foursys-text' : 'text-foursys-text-muted'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-5 rounded-2xl bg-foursys-surface/30 border border-white/8 text-center"
        >
          <p className="text-sm text-foursys-text-muted flex items-start justify-center gap-2">
            <DynIcon name="lightbulb" size={18} className="text-foursys-cyan flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-foursys-text">{t('delivery.note')}</strong> {t('delivery.noteDetail')}
            </span>
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
