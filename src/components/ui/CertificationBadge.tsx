interface CertificationBadgeProps {
  label: string
  size?: 'sm' | 'md'
}

const ISO_REGEX = /^ISO\s/

export function CertificationBadge({ label, size = 'md' }: CertificationBadgeProps) {
  const dim = size === 'sm' ? 'w-10 h-10' : 'w-14 h-14'
  const textSize = size === 'sm' ? 'text-[7px]' : 'text-[8px]'
  const labelSize = size === 'sm' ? 'text-[6px]' : 'text-[7px]'
  const isISO = ISO_REGEX.test(label)

  return (
    <div className="group relative flex flex-col items-center gap-1">
      <div
        className={`${dim} rounded-full border-2 border-foursys-primary/30 bg-foursys-primary/[0.06] flex items-center justify-center group-hover:border-foursys-primary/50 transition-colors duration-300`}
      >
        {isISO ? (
          <div className="text-center leading-none">
            <div className={`${textSize} font-black text-foursys-primary tracking-tight`}>
              {label.replace('ISO ', '')}
            </div>
            <div className={`${labelSize} font-bold text-foursys-text-dim uppercase tracking-widest mt-px`}>
              ISO
            </div>
          </div>
        ) : label === 'SAFe' ? (
          <SafeLogo size={size} />
        ) : label === 'GPTW' ? (
          <GptwLogo size={size} />
        ) : (
          <div className={`${textSize} font-black text-foursys-primary tracking-tight text-center`}>
            {label}
          </div>
        )}
      </div>
      <span className={`${labelSize} text-foursys-text-dim font-medium`}>{label}</span>
    </div>
  )
}

function SafeLogo({ size }: { size: 'sm' | 'md' }) {
  const s = size === 'sm' ? 28 : 38
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 28.5C8 28.5 10.5 25 14 25C17.5 25 18 27.5 20 27.5C22 27.5 22.5 25 26 25C29.5 25 32 28.5 32 28.5" stroke="#FF6600" strokeWidth="2.5" strokeLinecap="round" />
      <text x="20" y="20" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="900" fill="#FF6600" letterSpacing="-0.5">SAFe</text>
    </svg>
  )
}

function GptwLogo({ size }: { size: 'sm' | 'md' }) {
  const s = size === 'sm' ? 28 : 38
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="8" width="20" height="24" rx="3" stroke="#FF6600" strokeWidth="1.5" fill="none" />
      <text x="20" y="24" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="8" fontWeight="900" fill="#FF6600">GPTW</text>
    </svg>
  )
}
