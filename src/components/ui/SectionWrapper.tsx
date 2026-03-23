import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  className?: string
}

const variants = {
  enter: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  center: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98
  }
}

export function SectionWrapper({ children, className = '' }: SectionWrapperProps) {
  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`h-full w-full overflow-y-auto custom-scrollbar ${className}`}
    >
      {children}
    </motion.div>
  )
}
