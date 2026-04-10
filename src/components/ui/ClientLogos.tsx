interface LogoProps {
  size?: number
  className?: string
}

function SantanderLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 120 40" width={size * 2.5} height={size} aria-label="Santander">
      <path d="M30 8c2 0 3.5 3 3.5 7s-3 12-3.5 12S27 19 27 15s1-7 3-7z" fill="#EC0000" />
      <path d="M38 5c2 0 3.5 3 3.5 7s-3 15-3.5 15-3-11-3-15 1-7 3-7z" fill="#EC0000" />
      <path d="M46 8c2 0 3.5 3 3.5 7s-3 12-3.5 12-3-8-3-12 1-7 3-7z" fill="#EC0000" />
      <text x="75" y="24" textAnchor="middle" fill="#EC0000" fontSize="11" fontWeight="700" fontFamily="Arial,sans-serif">Santander</text>
    </svg>
  )
}

function BradescoLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 120 40" width={size * 2.5} height={size} aria-label="Bradesco">
      <path d="M20 28c-5-3-8-8-8-14 0-2 .5-4 1.5-5.5C16 5 20 4 24 6c2 1 3.5 3 4 5.5.5 3-.5 6.5-3 9l-5 7.5z" fill="#CC092F" />
      <text x="72" y="24" textAnchor="middle" fill="#CC092F" fontSize="12" fontWeight="800" fontFamily="Arial,sans-serif">bradesco</text>
    </svg>
  )
}

function SafraLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 100 40" width={size * 2} height={size} aria-label="Safra">
      <circle cx="18" cy="20" r="8" fill="none" stroke="#1C3A6B" strokeWidth="2" />
      <path d="M14 20l3 3 5-6" fill="none" stroke="#1C3A6B" strokeWidth="1.5" />
      <text x="58" y="25" textAnchor="middle" fill="#6699CC" fontSize="15" fontWeight="700" fontFamily="Georgia,serif">Safra</text>
    </svg>
  )
}

function AbcBrasilLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 100 40" width={size * 2} height={size} aria-label="ABC Brasil">
      <text x="50" y="20" textAnchor="middle" fill="#5B9BD5" fontSize="14" fontWeight="900" fontFamily="Arial,sans-serif">ABC</text>
      <text x="50" y="32" textAnchor="middle" fill="#5B9BD5" fontSize="8" fontWeight="400" fontFamily="Arial,sans-serif">Brasil</text>
    </svg>
  )
}

function BmgLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 80 40" width={size * 1.6} height={size} aria-label="BMG">
      <rect x="10" y="8" width="60" height="24" rx="4" fill="#FF6600" opacity="0.15" />
      <text x="40" y="26" textAnchor="middle" fill="#FF6600" fontSize="18" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="2">BMG</text>
    </svg>
  )
}

function MufgLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 80 40" width={size * 1.6} height={size} aria-label="MUFG">
      <text x="40" y="26" textAnchor="middle" fill="#D50032" fontSize="16" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="3">MUFG</text>
    </svg>
  )
}

function BtgLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 120 40" width={size * 2.5} height={size} aria-label="BTG Pactual">
      <text x="60" y="20" textAnchor="middle" fill="#6699CC" fontSize="14" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="2">BTG</text>
      <text x="60" y="32" textAnchor="middle" fill="#6699CC" fontSize="8" fontWeight="400" fontFamily="Arial,sans-serif" letterSpacing="1">PACTUAL</text>
    </svg>
  )
}

function AndbankLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 120 40" width={size * 2.5} height={size} aria-label="Andbank">
      <text x="60" y="22" textAnchor="middle" fill="#7BA3D0" fontSize="13" fontWeight="300" fontFamily="Arial,sans-serif" letterSpacing="3">ANDBANK</text>
      <line x1="20" y1="28" x2="100" y2="28" stroke="#7BA3D0" strokeWidth="0.5" />
      <text x="60" y="35" textAnchor="middle" fill="#7BA3D0" fontSize="5" fontFamily="Arial,sans-serif" letterSpacing="2">Private Bankers</text>
    </svg>
  )
}

function CaixaVidaLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 120 40" width={size * 2.5} height={size} aria-label="Caixa Vida e Previdência">
      <text x="10" y="20" fill="#5B9BD5" fontSize="12" fontWeight="800" fontFamily="Arial,sans-serif">CAIXA</text>
      <text x="10" y="32" fill="#5B9BD5" fontSize="7" fontWeight="400" fontFamily="Arial,sans-serif">Vida e Previdência</text>
    </svg>
  )
}

function BancoVwLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 130 40" width={size * 2.8} height={size} aria-label="Banco Volkswagen">
      <text x="65" y="18" textAnchor="middle" fill="#5B9BD5" fontSize="9" fontWeight="400" fontFamily="Arial,sans-serif">Banco</text>
      <text x="65" y="30" textAnchor="middle" fill="#5B9BD5" fontSize="10" fontWeight="700" fontFamily="Arial,sans-serif">Volkswagen</text>
      <circle cx="115" cy="20" r="9" fill="none" stroke="#5B9BD5" strokeWidth="1.2" />
      <text x="115" y="24" textAnchor="middle" fill="#5B9BD5" fontSize="8" fontWeight="900" fontFamily="Arial,sans-serif">VW</text>
    </svg>
  )
}

function SafraNatLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 130 40" width={size * 2.8} height={size} aria-label="Safra National Bank">
      <circle cx="16" cy="20" r="7" fill="none" stroke="#6699CC" strokeWidth="1.5" />
      <text x="75" y="18" textAnchor="middle" fill="#6699CC" fontSize="10" fontWeight="700" fontFamily="Georgia,serif">Safra National Bank</text>
      <text x="75" y="30" textAnchor="middle" fill="#6699CC" fontSize="7" fontFamily="Georgia,serif">of New York</text>
    </svg>
  )
}

function CaixaConsLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 120 40" width={size * 2.5} height={size} aria-label="Caixa Consórcios">
      <text x="10" y="20" fill="#5B9BD5" fontSize="12" fontWeight="800" fontFamily="Arial,sans-serif">CAIXA</text>
      <text x="10" y="32" fill="#5B9BD5" fontSize="7" fontWeight="400" fontFamily="Arial,sans-serif">Consórcios</text>
    </svg>
  )
}

function BvLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 60 40" width={size * 1.2} height={size} aria-label="BV">
      <circle cx="30" cy="20" r="14" fill="none" stroke="#5B9BD5" strokeWidth="2" />
      <text x="30" y="25" textAnchor="middle" fill="#5B9BD5" fontSize="14" fontWeight="800" fontFamily="Arial,sans-serif">BV</text>
    </svg>
  )
}

function NextLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 80 40" width={size * 1.6} height={size} aria-label="Next">
      <path d="M15 12l8 10-8 10" fill="none" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="50" y="27" textAnchor="middle" fill="#00C853" fontSize="14" fontWeight="700" fontFamily="Arial,sans-serif">next</text>
    </svg>
  )
}

function TokioLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 120 40" width={size * 2.5} height={size} aria-label="Tokio Marine">
      <text x="60" y="18" textAnchor="middle" fill="#5B9BD5" fontSize="12" fontWeight="800" fontFamily="Arial,sans-serif">Tokio</text>
      <text x="60" y="32" textAnchor="middle" fill="#5B9BD5" fontSize="9" fontWeight="400" fontFamily="Arial,sans-serif">Marine</text>
    </svg>
  )
}

function BradescoSegLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 120 40" width={size * 2.5} height={size} aria-label="Bradesco Seguros">
      <path d="M16 28c-4-3-6-7-6-12 0-2 .4-3.5 1.2-4.5C13 9 16 8 19 9.5c1.5.8 2.5 2.2 3 4 .4 2.5-.4 5.5-2.5 7.5L16 28z" fill="#CC092F" />
      <text x="72" y="18" textAnchor="middle" fill="#CC092F" fontSize="11" fontWeight="800" fontFamily="Arial,sans-serif">bradesco</text>
      <text x="72" y="30" textAnchor="middle" fill="#CC092F" fontSize="8" fontWeight="400" fontFamily="Arial,sans-serif">seguros</text>
    </svg>
  )
}

function SompoLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 120 40" width={size * 2.5} height={size} aria-label="Sompo Seguros">
      <circle cx="18" cy="20" r="8" fill="#5B9BD5" opacity="0.2" />
      <text x="18" y="24" textAnchor="middle" fill="#5B9BD5" fontSize="8" fontWeight="900">S</text>
      <text x="72" y="18" textAnchor="middle" fill="#5B9BD5" fontSize="11" fontWeight="700" fontFamily="Arial,sans-serif">SOMPO</text>
      <text x="72" y="30" textAnchor="middle" fill="#5B9BD5" fontSize="7" fontWeight="400" fontFamily="Arial,sans-serif">SEGUROS</text>
    </svg>
  )
}

function YouseLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 80 40" width={size * 1.6} height={size} aria-label="Youse">
      <text x="40" y="27" textAnchor="middle" fill="#A66CC8" fontSize="16" fontWeight="800" fontFamily="Arial,sans-serif" letterSpacing="1">youse</text>
    </svg>
  )
}

function HdiLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 80 40" width={size * 1.6} height={size} aria-label="HDI">
      <rect x="12" y="8" width="56" height="24" rx="3" fill="#006633" opacity="0.15" />
      <text x="40" y="26" textAnchor="middle" fill="#4CAF50" fontSize="18" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="3">HDI</text>
    </svg>
  )
}

function ProfarmaLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 100 40" width={size * 2} height={size} aria-label="Profarma">
      <text x="50" y="26" textAnchor="middle" fill="#00A651" fontSize="13" fontWeight="700" fontFamily="Arial,sans-serif">Profarma</text>
    </svg>
  )
}

function DasaLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 80 40" width={size * 1.6} height={size} aria-label="Dasa">
      <text x="40" y="27" textAnchor="middle" fill="#5B9BD5" fontSize="17" fontWeight="800" fontFamily="Arial,sans-serif" letterSpacing="2">Dasa</text>
    </svg>
  )
}

function EquifaxLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 100 40" width={size * 2} height={size} aria-label="Equifax">
      <text x="50" y="26" textAnchor="middle" fill="#C85A7C" fontSize="14" fontWeight="800" fontFamily="Arial,sans-serif" letterSpacing="1">Equifax</text>
    </svg>
  )
}

function TotvsLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 80 40" width={size * 1.6} height={size} aria-label="TOTVS">
      <text x="40" y="27" textAnchor="middle" fill="#00A3E0" fontSize="16" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="3">TOTVS</text>
    </svg>
  )
}

function CsuLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 100 40" width={size * 2} height={size} aria-label="CSU Digital">
      <text x="50" y="20" textAnchor="middle" fill="#7986CB" fontSize="14" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="1">CSU</text>
      <text x="50" y="32" textAnchor="middle" fill="#7986CB" fontSize="7" fontWeight="400" fontFamily="Arial,sans-serif">Digital</text>
    </svg>
  )
}

function MercadoEletroLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 130 40" width={size * 2.8} height={size} aria-label="Mercado Eletrônico">
      <text x="15" y="18" fill="#FF7043" fontSize="7" fontWeight="900" fontFamily="Arial,sans-serif">M</text>
      <text x="22" y="18" fill="#FF7043" fontSize="7" fontWeight="400" fontFamily="Arial,sans-serif">e</text>
      <text x="15" y="32" fill="#FF7043" fontSize="7" fontWeight="400" fontFamily="Arial,sans-serif" letterSpacing="0.5">mercado</text>
      <text x="62" y="32" fill="#FF7043" fontSize="7" fontWeight="400" fontFamily="Arial,sans-serif" letterSpacing="0.5">eletrônico</text>
    </svg>
  )
}

function NaturaLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 80 40" width={size * 1.6} height={size} aria-label="Natura">
      <path d="M40 6c2 4 6 6 6 12s-6 14-6 14-6-8-6-14 4-8 6-12z" fill="#FF9800" opacity="0.3" />
      <text x="40" y="35" textAnchor="middle" fill="#FF9800" fontSize="10" fontWeight="400" fontFamily="Georgia,serif" letterSpacing="2">natura</text>
    </svg>
  )
}

function VwCamLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 100 40" width={size * 2} height={size} aria-label="VW Caminhões">
      <circle cx="30" cy="20" r="12" fill="none" stroke="#5B9BD5" strokeWidth="1.5" />
      <text x="30" y="24" textAnchor="middle" fill="#5B9BD5" fontSize="9" fontWeight="900" fontFamily="Arial,sans-serif">VW</text>
      <text x="68" y="17" textAnchor="middle" fill="#5B9BD5" fontSize="7" fontWeight="400" fontFamily="Arial,sans-serif">Caminhões</text>
      <text x="68" y="28" textAnchor="middle" fill="#5B9BD5" fontSize="7" fontWeight="400" fontFamily="Arial,sans-serif">e Ônibus</text>
    </svg>
  )
}

function AbinbevLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 100 40" width={size * 2} height={size} aria-label="ABInBev">
      <text x="50" y="26" textAnchor="middle" fill="#D4A017" fontSize="13" fontWeight="800" fontFamily="Arial,sans-serif">
        <tspan fontWeight="900">AB</tspan>
        <tspan fontWeight="400">In</tspan>
        <tspan fontWeight="900">Bev</tspan>
      </text>
    </svg>
  )
}

function SyngentaLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 100 40" width={size * 2} height={size} aria-label="Syngenta">
      <text x="50" y="26" textAnchor="middle" fill="#4CAF50" fontSize="13" fontWeight="700" fontFamily="Arial,sans-serif" letterSpacing="1">syngenta</text>
    </svg>
  )
}

function OrizonLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 120 40" width={size * 2.5} height={size} aria-label="Orizon">
      <circle cx="20" cy="20" r="10" fill="none" stroke="#26A69A" strokeWidth="2" />
      <path d="M15 20h10M20 15v10" stroke="#26A69A" strokeWidth="1.5" strokeLinecap="round" />
      <text x="72" y="25" textAnchor="middle" fill="#26A69A" fontSize="14" fontWeight="700" fontFamily="Arial,sans-serif" letterSpacing="1">Orizon</text>
    </svg>
  )
}

function TecbanLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 100 40" width={size * 2} height={size} aria-label="TecBan">
      <rect x="8" y="10" width="20" height="20" rx="3" fill="#003DA5" opacity="0.2" />
      <text x="18" y="25" textAnchor="middle" fill="#5B9BD5" fontSize="10" fontWeight="900" fontFamily="Arial,sans-serif">T</text>
      <text x="62" y="25" textAnchor="middle" fill="#5B9BD5" fontSize="13" fontWeight="700" fontFamily="Arial,sans-serif">TecBan</text>
    </svg>
  )
}

function FisFidelityLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 120 40" width={size * 2.5} height={size} aria-label="FIS-Fidelity">
      <text x="60" y="18" textAnchor="middle" fill="#5B9BD5" fontSize="16" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="3">FIS</text>
      <text x="60" y="30" textAnchor="middle" fill="#5B9BD5" fontSize="7" fontWeight="400" fontFamily="Arial,sans-serif" letterSpacing="1">Fidelity</text>
    </svg>
  )
}

function BancoSumitomoLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 140 40" width={size * 3} height={size} aria-label="Banco Sumitomo">
      <rect x="5" y="12" width="16" height="16" rx="2" fill="#009B3A" opacity="0.2" />
      <text x="13" y="24" textAnchor="middle" fill="#4CAF50" fontSize="9" fontWeight="900" fontFamily="Arial,sans-serif">S</text>
      <text x="80" y="18" textAnchor="middle" fill="#4CAF50" fontSize="8" fontWeight="400" fontFamily="Arial,sans-serif">Banco</text>
      <text x="80" y="30" textAnchor="middle" fill="#4CAF50" fontSize="11" fontWeight="700" fontFamily="Arial,sans-serif">Sumitomo</text>
    </svg>
  )
}

function PasaLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 80 40" width={size * 1.6} height={size} aria-label="PASA">
      <text x="40" y="27" textAnchor="middle" fill="#5B9BD5" fontSize="18" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="3">PASA</text>
    </svg>
  )
}

function StellantisLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 150 40" width={size * 3.2} height={size} aria-label="Stellantis Financiamentos">
      <path d="M15 12l5 8-5 8M25 12l-5 8 5 8" fill="none" stroke="#7986CB" strokeWidth="1.5" strokeLinecap="round" />
      <text x="85" y="18" textAnchor="middle" fill="#7986CB" fontSize="11" fontWeight="800" fontFamily="Arial,sans-serif" letterSpacing="1">STELLANTIS</text>
      <text x="85" y="30" textAnchor="middle" fill="#7986CB" fontSize="6" fontWeight="400" fontFamily="Arial,sans-serif" letterSpacing="0.5">Financiamentos</text>
    </svg>
  )
}

function DubaiLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 130 40" width={size * 2.8} height={size} aria-label="Dubai Construtora">
      <path d="M12 30V14l8-6 8 6v16" fill="none" stroke="#D4A017" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="17" y="20" width="6" height="10" fill="#D4A017" opacity="0.2" />
      <text x="78" y="18" textAnchor="middle" fill="#D4A017" fontSize="12" fontWeight="800" fontFamily="Arial,sans-serif">Dubai</text>
      <text x="78" y="30" textAnchor="middle" fill="#D4A017" fontSize="7" fontWeight="400" fontFamily="Arial,sans-serif">Construtora</text>
    </svg>
  )
}

function SiemensLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 100 40" width={size * 2} height={size} aria-label="Siemens">
      <text x="50" y="27" textAnchor="middle" fill="#26C6DA" fontSize="15" fontWeight="700" fontFamily="Arial,sans-serif" letterSpacing="2">SIEMENS</text>
    </svg>
  )
}

function ItauLogo({ size = 48 }: LogoProps) {
  return (
    <svg viewBox="0 0 80 40" width={size * 1.6} height={size} aria-label="Itaú">
      <rect x="8" y="6" width="64" height="28" rx="4" fill="#FF6600" />
      <text x="40" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="900" fontFamily="Arial,sans-serif" letterSpacing="1">itaú</text>
    </svg>
  )
}

type ClientId = string

const LOGO_MAP: Record<ClientId, React.FC<LogoProps>> = {
  'bradesco': BradescoLogo,
  'santander': SantanderLogo,
  'itau': ItauLogo,
  'safra': SafraLogo,
  'btg': BtgLogo,
  'mufg': MufgLogo,
  'bv': BvLogo,
  'andbank': AndbankLogo,
  'banco-sumitomo': BancoSumitomoLogo,
  'stellantis': StellantisLogo,
  'abc-brasil': AbcBrasilLogo,
  'bmg': BmgLogo,
  'caixa-vida': CaixaVidaLogo,
  'banco-volkswagen': BancoVwLogo,
  'safra-national': SafraNatLogo,
  'caixa-consorcios': CaixaConsLogo,
  'next': NextLogo,
  'tokio-marine': TokioLogo,
  'bradesco-seguros': BradescoSegLogo,
  'sompo': SompoLogo,
  'youse': YouseLogo,
  'hdi': HdiLogo,
  'orizon': OrizonLogo,
  'pasa': PasaLogo,
  'profarma': ProfarmaLogo,
  'dasa': DasaLogo,
  'tecban': TecbanLogo,
  'fis-fidelity': FisFidelityLogo,
  'equifax': EquifaxLogo,
  'totvs': TotvsLogo,
  'csu-digital': CsuLogo,
  'mercado-eletro': MercadoEletroLogo,
  'dubai': DubaiLogo,
  'natura': NaturaLogo,
  'vw-caminhoes': VwCamLogo,
  'abinbev': AbinbevLogo,
  'syngenta': SyngentaLogo,
  'siemens': SiemensLogo,
}

export function ClientLogo({ id, size = 28, className = '' }: LogoProps & { id: string }) {
  const Logo = LOGO_MAP[id]
  if (!Logo) return null
  return <Logo size={size} className={className} />
}
