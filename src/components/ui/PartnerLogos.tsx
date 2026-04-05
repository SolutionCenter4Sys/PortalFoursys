interface LogoProps {
  className?: string
  size?: number
}

export function MicrosoftLogo({ className = '', size = 32 }: LogoProps) {
  return (
    <svg viewBox="0 0 21 21" width={size} height={size} className={className} aria-label="Microsoft">
      <rect x="0" y="0" width="10" height="10" fill="#F25022" rx="1" />
      <rect x="11" y="0" width="10" height="10" fill="#7FBA00" rx="1" />
      <rect x="0" y="11" width="10" height="10" fill="#00A4EF" rx="1" />
      <rect x="11" y="11" width="10" height="10" fill="#FFB900" rx="1" />
    </svg>
  )
}

export function AwsLogo({ className = '', size = 32 }: LogoProps) {
  const w = size * 2.2
  const h = size
  return (
    <svg viewBox="0 0 100 60" width={w} height={h} className={className} aria-label="AWS">
      <text x="50" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="30" fontWeight="900" fontFamily="'Amazon Ember', Arial, sans-serif" letterSpacing="2">AWS</text>
      <path d="M20 42c12 6 30 8 48 2" fill="none" stroke="#FF9900" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M72 38l8 5-10 2" fill="none" stroke="#FF9900" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function GoogleCloudLogo({ className = '', size = 32 }: LogoProps) {
  return (
    <svg viewBox="0 0 256 206" width={size * 1.25} height={size} className={className} aria-label="Google Cloud">
      <path d="M170.252 56.819l22.253-22.253 1.483-9.37C153.437-11.677 88.976-7.496 52.42 33.92 42.267 45.423 34.39 58.958 29.312 73.728l7.973-1.09 44.505-7.34 3.436-3.511s7.473-12.39 20.227-17.147c17.393-6.18 37.59-3.18 37.59-3.18l27.209 15.36z" fill="#EA4335"/>
      <path d="M224.205 73.918a100.249 100.249 0 00-30.217-38.722l-31.232 31.232a55.515 55.515 0 0120.379 44.037v5.544c15.351 0 27.797 12.446 27.797 27.797 0 15.352-12.446 27.57-27.797 27.57h-55.594l-5.544 5.926v33.34l5.544 5.544h55.594c39.984.376 72.725-31.595 73.1-71.579a72.762 72.762 0 00-31.83-70.69z" fill="#4285F4"/>
      <path d="M72.248 206.1h55.594v-44.505H72.248a27.388 27.388 0 01-11.46-2.526l-7.936 2.447-22.405 22.253-1.952 7.636a72.243 72.243 0 0043.753 14.695z" fill="#34A853"/>
      <path d="M72.248 60.785C32.264 61.032-.173 93.924.002 133.908a72.762 72.762 0 0028.493 57.473l32.293-32.293c-14.07-6.376-20.311-22.943-13.935-37.013a27.796 27.796 0 0113.935-13.935l32.293-32.293A72.224 72.224 0 0072.248 60.785z" fill="#FBBC05"/>
    </svg>
  )
}

export function DatabricksLogo({ className = '', size = 32 }: LogoProps) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} className={className} aria-label="Databricks">
      <path d="M18 2L3 10v4.5l15 8 15-8V10L18 2z" fill="#FF3621" />
      <path d="M3 14.5v4.5l15 8 15-8v-4.5l-15 8-15-8z" fill="#FF3621" opacity=".7" />
      <path d="M3 23v4.5L18 36l15-8.5V23l-15 8.5L3 23z" fill="#FF3621" opacity=".45" />
    </svg>
  )
}

export function AdobeLogo({ className = '', size = 32 }: LogoProps) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} aria-label="Adobe">
      <path d="M16 4H4v32L16 4z" fill="#FF0000" />
      <path d="M24 4h12v32L24 4z" fill="#FF0000" />
      <path d="M20 17l8 19h-6l-2.4-6H14l6-13z" fill="#FF0000" />
    </svg>
  )
}

export function DigibeeLogo({ className = '', size = 32 }: LogoProps) {
  const w = size * 1.8
  const h = size
  return (
    <svg viewBox="0 0 120 40" width={w} height={h} className={className} aria-label="Digibee">
      <circle cx="14" cy="20" r="8" fill="#00D4AA" opacity="0.9" />
      <circle cx="14" cy="20" r="4" fill="#009977" />
      <text x="30" y="26" fill="#00D4AA" fontSize="18" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="0.5">Digibee</text>
    </svg>
  )
}

export function IntelLogo({ className = '', size = 32 }: LogoProps) {
  const w = size * 1.8
  const h = size
  return (
    <svg viewBox="0 0 100 40" width={w} height={h} className={className} aria-label="Intel">
      <circle cx="82" cy="8" r="4" fill="#0071C5" />
      <text x="50" y="30" textAnchor="middle" fill="#0071C5" fontSize="26" fontWeight="400" fontFamily="system-ui, sans-serif" fontStyle="italic" letterSpacing="-0.5">intel</text>
    </svg>
  )
}

export function PegaLogo({ className = '', size = 32 }: LogoProps) {
  const w = size * 1.8
  const h = size
  return (
    <svg viewBox="0 0 100 40" width={w} height={h} className={className} aria-label="Pega">
      <text x="50" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="700" fontFamily="system-ui, sans-serif" fontStyle="italic" letterSpacing="1">Pega</text>
    </svg>
  )
}

export function SnowflakeLogo({ className = '', size = 32 }: LogoProps) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} className={className} aria-label="Snowflake">
      <g fill="#29B5E8" stroke="#29B5E8" strokeWidth="1.5">
        <line x1="18" y1="2" x2="18" y2="34" />
        <line x1="4" y1="10" x2="32" y2="26" />
        <line x1="4" y1="26" x2="32" y2="10" />
        <line x1="14" y1="1" x2="18" y2="5" />
        <line x1="22" y1="1" x2="18" y2="5" />
        <line x1="14" y1="35" x2="18" y2="31" />
        <line x1="22" y1="35" x2="18" y2="31" />
        <circle cx="18" cy="18" r="3" fill="#29B5E8" stroke="none" />
        <circle cx="18" cy="6" r="2" stroke="none" />
        <circle cx="18" cy="30" r="2" stroke="none" />
        <circle cx="7" cy="11.5" r="2" stroke="none" />
        <circle cx="29" cy="24.5" r="2" stroke="none" />
        <circle cx="7" cy="24.5" r="2" stroke="none" />
        <circle cx="29" cy="11.5" r="2" stroke="none" />
      </g>
    </svg>
  )
}

export type PartnerId = 'microsoft' | 'aws' | 'google-cloud' | 'databricks' | 'adobe' | 'digibee' | 'intel' | 'pega' | 'snowflake'

const LOGO_MAP: Record<PartnerId, React.FC<LogoProps>> = {
  'microsoft': MicrosoftLogo,
  'aws': AwsLogo,
  'google-cloud': GoogleCloudLogo,
  'databricks': DatabricksLogo,
  'adobe': AdobeLogo,
  'digibee': DigibeeLogo,
  'intel': IntelLogo,
  'pega': PegaLogo,
  'snowflake': SnowflakeLogo,
}

export function PartnerLogo({ id, ...props }: LogoProps & { id: PartnerId }) {
  const Logo = LOGO_MAP[id]
  if (!Logo) return null
  return <Logo {...props} />
}
