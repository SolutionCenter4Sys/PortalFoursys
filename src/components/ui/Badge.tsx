interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'cyan' | 'green' | 'red' | 'orange' | 'purple' | 'gray'
  size?: 'sm' | 'md'
}

const variants = {
  blue: 'bg-foursys-blue/20 text-foursys-cyan border-foursys-blue/30',
  cyan: 'bg-foursys-cyan/20 text-foursys-cyan border-foursys-cyan/30',
  green: 'bg-green-500/20 text-green-400 border-green-500/30',
  red: 'bg-red-500/20 text-red-400 border-red-500/30',
  orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  purple: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  gray: 'bg-white/10 text-foursys-text-muted border-white/10'
}

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1'
}

export function Badge({ children, variant = 'gray', size = 'sm' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}
