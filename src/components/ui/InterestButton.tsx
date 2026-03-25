import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import type { AppSection } from '../../types'

interface InterestButtonProps {
  section: AppSection
  className?: string
}

export function InterestButton({ section, className = '' }: InterestButtonProps) {
  const { state, toggleInterest } = useApp()
  const isMarked = state.interestedSections.includes(section)

  return (
    <motion.button
      onClick={() => toggleInterest(section)}
      title={isMarked ? 'Remover interesse' : 'Marcar interesse'}
      className={`group relative flex items-center gap-1.5 px-3 py-2.5 md:px-2.5 md:py-1.5 min-h-[44px] md:min-h-0 rounded-full text-xs font-medium transition-all ${
        isMarked
          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
          : 'bg-white/5 text-white/40 border border-white/10 hover:bg-amber-400/10 hover:text-amber-300/70 hover:border-amber-400/20'
      } ${className}`}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        animate={isMarked ? { rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        <Star
          size={13}
          className={isMarked ? 'fill-amber-400 text-amber-400' : 'text-current'}
        />
      </motion.div>
      <span>{isMarked ? 'Interesse marcado' : 'Marcar interesse'}</span>
    </motion.button>
  )
}
