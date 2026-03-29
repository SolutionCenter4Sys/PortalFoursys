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

export function SapLogo({ className = '', size = 32 }: LogoProps) {
  const w = size * 2
  const h = size
  return (
    <svg viewBox="0 0 100 50" width={w} height={h} className={className} aria-label="SAP">
      <rect width="100" height="50" rx="5" fill="#0FAAFF" />
      <text x="50" y="35" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="3">SAP</text>
    </svg>
  )
}

export function OracleLogo({ className = '', size = 32 }: LogoProps) {
  const w = size * 2.5
  const h = size
  return (
    <svg viewBox="0 0 120 40" width={w} height={h} className={className} aria-label="Oracle">
      <text x="60" y="29" textAnchor="middle" fill="#F80000" fontSize="26" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="2">ORACLE</text>
    </svg>
  )
}

export function ServiceNowLogo({ className = '', size = 32 }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-label="ServiceNow">
      <circle cx="50" cy="50" r="46" fill="#293E40" stroke="#62D84E" strokeWidth="4" />
      <circle cx="50" cy="50" r="16" fill="#62D84E" />
      <circle cx="50" cy="50" r="8" fill="#293E40" />
    </svg>
  )
}

export function SalesforceLogo({ className = '', size = 32 }: LogoProps) {
  const w = size * 1.5
  const h = size
  return (
    <svg viewBox="0 0 150 100" width={w} height={h} className={className} aria-label="Salesforce">
      <path d="M63 12c8.5 0 16 4.2 20.5 10.7C87.5 18 93 16 99 16c18.5 0 33.5 15 33.5 33.5S117.5 83 99 83c-2.5 0-4.9-.3-7.2-.8C88.1 88.3 81.5 92 74 92c-5 0-9.6-1.5-13.4-4.1C57.2 92.5 51.5 95 45 95c-16 0-29-13-29-29 0-4.2.9-8.1 2.5-11.7C12 51 8 44.5 8 37 8 23.2 19.2 12 33 12c5.5 0 10.6 1.8 14.7 4.8C51.5 13.8 57 12 63 12z" fill="#00A1E0" />
      <text x="58" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="700" fontFamily="Arial, sans-serif">salesforce</text>
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

export type PartnerId = 'microsoft' | 'aws' | 'google-cloud' | 'sap' | 'oracle' | 'servicenow' | 'salesforce' | 'databricks'

const LOGO_MAP: Record<PartnerId, React.FC<LogoProps>> = {
  'microsoft': MicrosoftLogo,
  'aws': AwsLogo,
  'google-cloud': GoogleCloudLogo,
  'sap': SapLogo,
  'oracle': OracleLogo,
  'servicenow': ServiceNowLogo,
  'salesforce': SalesforceLogo,
  'databricks': DatabricksLogo,
}

export function PartnerLogo({ id, ...props }: LogoProps & { id: PartnerId }) {
  const Logo = LOGO_MAP[id]
  if (!Logo) return null
  return <Logo {...props} />
}
