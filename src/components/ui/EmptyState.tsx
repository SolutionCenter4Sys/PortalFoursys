import { motion } from 'framer-motion'
import { DynIcon } from '../../utils/iconMap'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-foursys-primary/10 border border-foursys-primary/20 flex items-center justify-center mb-5">
        <DynIcon name={icon} size={28} className="text-foursys-primary/60" />
      </div>

      <h3 className="text-sm font-bold text-foursys-text mb-2">{title}</h3>
      <p className="text-xs text-foursys-text-muted leading-relaxed max-w-xs">{description}</p>

      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-5 py-2 rounded-xl text-xs font-semibold bg-foursys-primary/15 border border-foursys-primary/30 text-foursys-primary hover:bg-foursys-primary/25 transition-colors"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}
