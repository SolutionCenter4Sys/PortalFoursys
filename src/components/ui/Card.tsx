interface CardProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', glow = false, hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border border-white/10 bg-foursys-surface/60 backdrop-blur-md
        ${glow ? 'shadow-[0_0_40px_rgba(0,119,204,0.15)]' : ''}
        ${hover ? 'hover:border-foursys-blue/40 hover:bg-foursys-surface/80 transition-all duration-300 cursor-pointer hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
