interface CertificationBadgeProps {
  label: string
  size?: 'sm' | 'md'
}

export function CertificationBadge({ label, size = 'md' }: CertificationBadgeProps) {
  const dim = size === 'sm' ? 'w-10 h-10' : 'w-14 h-14'
  const textSize = size === 'sm' ? 'text-[7px]' : 'text-[8px]'
  const labelSize = size === 'sm' ? 'text-[6px]' : 'text-[7px]'

  return (
    <div className="group relative flex flex-col items-center gap-1">
      <div
        className={`${dim} rounded-full border-2 border-foursys-primary/30 bg-foursys-primary/[0.06] flex items-center justify-center group-hover:border-foursys-primary/50 transition-colors duration-300`}
      >
        <div className="text-center leading-none">
          <div className={`${textSize} font-black text-foursys-primary tracking-tight`}>
            {label.replace('ISO ', '')}
          </div>
          <div className={`${labelSize} font-bold text-foursys-text-dim uppercase tracking-widest mt-px`}>
            ISO
          </div>
        </div>
      </div>
      <span className={`${labelSize} text-foursys-text-dim font-medium`}>{label}</span>
    </div>
  )
}
