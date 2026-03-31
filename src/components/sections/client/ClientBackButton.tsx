import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useApp } from '../../../context/AppContext'

export function ClientBackButton({ clientName, color }: { clientName: string; color: string }) {
  const { navigate } = useApp()

  function hexToRgba(hex: string, a: number) {
    const h = hex.replace('#', '')
    const r = parseInt(h.slice(0, 2), 16)
    const g = parseInt(h.slice(2, 4), 16)
    const b = parseInt(h.slice(4, 6), 16)
    return `rgba(${r},${g},${b},${a})`
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate('client-opening')}
      className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 transition-all duration-200"
      style={{
        background: hexToRgba(color, 0.08),
        border: `1px solid ${hexToRgba(color, 0.15)}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hexToRgba(color, 0.15)
        e.currentTarget.style.borderColor = hexToRgba(color, 0.3)
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = hexToRgba(color, 0.08)
        e.currentTarget.style.borderColor = hexToRgba(color, 0.15)
      }}
    >
      <ArrowLeft
        size={14}
        className="transition-transform duration-200 group-hover:-translate-x-0.5"
        style={{ color }}
      />
      <span className="text-xs font-medium" style={{ color }}>
        Voltar para {clientName}
      </span>
    </motion.button>
  )
}
