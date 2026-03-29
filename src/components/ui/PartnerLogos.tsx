interface LogoProps {
  className?: string
  size?: number
  color?: string
}

export function MicrosoftLogo({ className = '', size = 24 }: LogoProps) {
  return (
    <svg viewBox="0 0 23 23" width={size} height={size} className={className} aria-label="Microsoft">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  )
}

export function AwsLogo({ className = '', size = 40 }: LogoProps) {
  return (
    <svg viewBox="0 0 80 48" width={size * 2} height={size * 1.2} className={className} aria-label="AWS">
      <path d="M22.7 21.8c0 .8.1 1.5.3 2 .2.5.5 1.1.8 1.7.1.2.2.4.2.5 0 .2-.1.4-.4.6l-1.2.8c-.2.1-.3.2-.5.2-.2 0-.4-.1-.6-.3-.3-.3-.5-.6-.7-.9-.2-.3-.4-.7-.6-1.1-1.5 1.8-3.4 2.7-5.8 2.7-1.6 0-3-.5-3.9-1.4-1-.9-1.5-2.2-1.5-3.7 0-1.6.6-3 1.8-3.9 1.2-1 2.7-1.5 4.8-1.5.7 0 1.4 0 2.1.1.7.1 1.5.2 2.3.4V16c0-1.5-.3-2.5-1-3.1-.6-.6-1.7-.9-3.2-.9-.7 0-1.4.1-2.1.3-.7.2-1.4.4-2.1.8-.3.2-.6.2-.7.3-.1 0-.2.1-.3.1-.3 0-.4-.2-.4-.6v-1c0-.3 0-.5.1-.7.1-.1.2-.3.5-.4.7-.4 1.5-.7 2.5-.9 1-.3 2-.4 3.1-.4 2.4 0 4.1.5 5.2 1.6 1.1 1.1 1.6 2.7 1.6 4.9v6.4h.1zM16.2 25c.7 0 1.4-.1 2.1-.4.7-.3 1.4-.7 1.9-1.3.3-.4.6-.8.7-1.3.1-.5.2-1.1.2-1.8v-.9c-.6-.1-1.2-.2-1.9-.3-.7-.1-1.3-.1-1.9-.1-1.3 0-2.2.2-2.9.7-.7.5-1 1.2-1 2.1 0 .9.2 1.5.7 2 .5.4 1.2.7 2.1.7v-.4zm12.6 1.8c-.3 0-.6-.1-.7-.2-.2-.1-.3-.4-.4-.8L24 12.5c-.1-.4-.2-.6-.2-.8 0-.3.2-.5.5-.5h1.9c.4 0 .6.1.7.2.2.1.3.4.4.8l2.7 10.5L32.5 12c.1-.4.2-.7.4-.8.2-.1.5-.2.8-.2h1.5c.4 0 .6.1.8.2.2.1.3.4.4.8l2.6 10.7L41.7 12c.1-.4.2-.7.4-.8.2-.1.5-.2.7-.2h1.8c.3 0 .5.2.5.5 0 .1 0 .2-.1.4 0 .1-.1.3-.2.5l-3.8 13.3c-.1.4-.2.7-.4.8-.2.1-.5.2-.7.2h-1.7c-.4 0-.6-.1-.8-.2-.2-.2-.3-.4-.4-.8l-2.5-10.3-2.5 10.3c-.1.4-.2.7-.4.8-.2.2-.5.2-.8.2h-1.6v.1zm20.1.5c-1 0-2-.1-3-.4-.9-.3-1.7-.6-2.2-1-.3-.2-.5-.4-.6-.6 0-.2-.1-.4-.1-.5v-1c0-.4.2-.6.5-.6.1 0 .3 0 .4.1.1.1.3.2.5.3.7.3 1.4.6 2.2.8.8.2 1.5.3 2.3.3 1.2 0 2.2-.2 2.8-.7.6-.5 1-1.1 1-2 0-.6-.2-1-.5-1.4-.4-.4-1-.7-1.9-1l-2.8-.9c-1.4-.4-2.4-1.1-3.1-1.9-.7-.8-1-1.7-1-2.7 0-.8.2-1.5.5-2.1.4-.6.8-1.2 1.4-1.6.6-.4 1.3-.8 2-.1 .8-.2 1.6-.3 2.5-.3.4 0 .9 0 1.4.1.5.1.9.2 1.3.3.4.1.8.3 1.1.4.3.1.6.3.7.4.2.2.4.3.5.5.1.2.1.4.1.7v.9c0 .4-.2.6-.5.6-.2 0-.5-.1-.8-.3-1.2-.5-2.5-.8-3.9-.8-1.1 0-2 .2-2.6.6-.6.4-.9 1-.9 1.8 0 .6.2 1.1.6 1.4.4.4 1.1.7 2.1 1l2.7.9c1.4.4 2.3 1.1 2.9 1.8.6.8.8 1.6.8 2.6 0 .8-.2 1.6-.5 2.2-.4.7-.8 1.2-1.5 1.7-.6.5-1.3.8-2.2 1-.9.3-1.7.4-2.7.4z" fill="#FFF" />
      <path d="M50.1 33.6c-5.5 4.1-13.5 6.2-20.4 6.2-9.6 0-18.3-3.6-24.9-9.5-.5-.5-.1-1.1.6-.7 7.1 4.1 15.8 6.6 24.9 6.6 6.1 0 12.8-1.3 19-3.9.9-.4 1.7.6.8 1.3z" fill="#FF9900" />
      <path d="M52.4 31c-.7-.9-4.6-.4-6.4-.2-.5.1-.6-.4-.1-.7 3.1-2.2 8.2-1.6 8.8-.8.6.7-.2 5.8-3.1 8.2-.4.4-.9.2-.7-.3.7-1.7 2.2-5.3 1.5-6.2z" fill="#FF9900" />
    </svg>
  )
}

export function GoogleCloudLogo({ className = '', size = 24 }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-label="Google Cloud">
      <path d="M12.19 5.52c2.35-.06 4.6 1.04 6.03 2.95l-2.09 1.63c-.91-1.29-2.39-2.1-3.98-2.13-2.73-.07-5.01 2.13-5.09 4.87-.04 1.33.45 2.62 1.37 3.59.92.97 2.2 1.52 3.53 1.54 1.96.03 3.63-1.12 4.3-2.85h-4.34v-2.46h7.1c.37 2.1-.19 4.26-1.51 5.88-1.32 1.63-3.31 2.6-5.42 2.64-2.09.05-4.1-.77-5.58-2.25-1.49-1.48-2.33-3.49-2.33-5.58C4.17 9.84 7.72 5.64 12.19 5.52z" fill="#4285F4" />
      <path d="M21.38 10.07l-2.36-1.5c.62.84 1 1.84 1.1 2.87H24l-.01-.04c-.12-.56-.36-1.07-.65-1.48l-1.96.15z" fill="#EA4335" />
    </svg>
  )
}

export function SapLogo({ className = '', size = 40 }: LogoProps) {
  return (
    <svg viewBox="0 0 92 46" width={size * 2} height={size} className={className} aria-label="SAP">
      <path d="M0 0h92v46H0z" fill="#0FAAFF" rx="4" />
      <path d="M31.5 33.5h-5.7l-5.3-10.8h-.1l.2 10.8H16V12.9h6l5 10.2h.1l-.2-10.2h4.6v20.6zm12.9-15.8h-4.1c-.1-1.4-1.2-2.3-3-2.3-1.6 0-2.7.7-2.7 1.8 0 1 .7 1.5 2.7 2l2.4.6c3.6.9 5.1 2.4 5.1 5.1 0 3.8-3.2 6.3-7.8 6.3-4.8 0-7.8-2.4-8-6.4h4.4c.2 1.7 1.5 2.7 3.6 2.7 1.8 0 3-.8 3-2 0-1-.7-1.6-2.8-2.2l-2.6-.7c-3.2-.8-4.8-2.6-4.8-5.3 0-3.5 3-5.8 7.3-5.8 4.3 0 7 2.2 7.3 5.9v.3zm17.5 5.4c0 .7-.1 1.4-.1 1.7h-11c.3 2.2 1.7 3.3 4 3.3 1.7 0 3-.7 3.6-1.8h3.8c-.9 3.2-3.9 5.3-7.5 5.3-4.8 0-8-3.2-8-8 0-4.9 3.2-8.2 7.8-8.2 4.9 0 7.4 3.4 7.4 7.7zM57.4 21c-.3-1.8-1.5-3-3.5-3-2 0-3.3 1.1-3.7 3h7.2zm19.8-.5h-3.8c-.1-1.4-1.2-2.3-2.9-2.3-1.6 0-2.6.7-2.6 1.8 0 1 .7 1.5 2.7 2l2.3.5c3.5.8 5.1 2.4 5.1 5.1 0 3.8-3.2 6.3-7.8 6.3-4.7 0-7.7-2.5-8-6.4h4.4c.2 1.7 1.5 2.7 3.6 2.7 1.8 0 3-.8 3-2 0-1-.8-1.6-2.8-2.2l-2.6-.7c-3.1-.8-4.8-2.6-4.8-5.2 0-3.5 3-5.8 7.3-5.8 4.2 0 6.9 2.2 7.2 5.8l.7.4z" fill="#FFF" />
    </svg>
  )
}

export function OracleLogo({ className = '', size = 24 }: LogoProps) {
  return (
    <svg viewBox="0 0 100 28" width={size * 3.5} height={size} className={className} aria-label="Oracle">
      <path d="M13.9 27.8C6.2 27.8 0 21.6 0 13.9 0 6.2 6.2 0 13.9 0h72.2c7.7 0 13.9 6.2 13.9 13.9 0 7.7-6.2 13.9-13.9 13.9H13.9z" fill="none" stroke="#F80000" strokeWidth="2.5" />
      <text x="50" y="19.5" textAnchor="middle" fill="#F80000" fontSize="16" fontWeight="bold" fontFamily="Arial, sans-serif">ORACLE</text>
    </svg>
  )
}

export function ServiceNowLogo({ className = '', size = 24 }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-label="ServiceNow">
      <circle cx="12" cy="12" r="11" fill="#62D84E" />
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="#FFF" strokeWidth="2" />
    </svg>
  )
}

export function SalesforceLogo({ className = '', size = 32 }: LogoProps) {
  return (
    <svg viewBox="0 0 48 32" width={size * 1.5} height={size} className={className} aria-label="Salesforce">
      <path d="M20 4c2.7 0 5.1 1.1 6.8 2.9C28.5 5.7 30.6 5 33 5c5.5 0 10 4.5 10 10s-4.5 10-10 10c-.7 0-1.3-.1-2-.2C29.5 27 27 28.5 24 28.5c-1.5 0-2.9-.4-4.1-1.1C18.6 29 16.4 30 14 30 9 30 5 26 5 21c0-1.3.3-2.5.8-3.6C4.1 16 3 13.9 3 11.5 3 7.4 6.4 4 10.5 4c1.8 0 3.5.7 4.8 1.8C16.8 4.7 18.3 4 20 4z" fill="#00A1E0" />
      <text x="24" y="20" textAnchor="middle" fill="#FFF" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif">salesforce</text>
    </svg>
  )
}

export function DatabricksLogo({ className = '', size = 24 }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-label="Databricks">
      <path d="M12 1L2 6.5v11L12 23l10-5.5v-11L12 1z" fill="none" stroke="#FF3621" strokeWidth="1.5" />
      <path d="M12 1L2 6.5 12 12l10-5.5L12 1z" fill="#FF3621" opacity=".9" />
      <path d="M2 6.5v11L12 23V12L2 6.5z" fill="#FF3621" opacity=".6" />
      <path d="M22 6.5L12 12v11l10-5.5V6.5z" fill="#FF3621" opacity=".3" />
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
