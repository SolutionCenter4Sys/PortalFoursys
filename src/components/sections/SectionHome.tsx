import { motion } from 'framer-motion'
import { useCountUp } from '../../hooks/useCountUp'
import { useApp } from '../../context/AppContext'
import { SectionWrapper } from '../ui/SectionWrapper'
import { CertificationBadge } from '../ui/CertificationBadge'
import { PartnerLogo, type PartnerId } from '../ui/PartnerLogos'
import { heroStats } from '../../data/kpis'

// ─── Dados ────────────────────────────────────────────────────────────────────

const flagshipOffers = [
  'AI-Augmented Squad',
  'Modernização de Legado',
  'IA First',
  'FourBlox',
  'Quality IA',
]

const allianceLogos: { id: PartnerId; label: string }[] = [
  { id: 'microsoft',    label: 'Microsoft' },
  { id: 'aws',          label: 'AWS' },
  { id: 'google-cloud', label: 'Google Cloud' },
  { id: 'sap',          label: 'SAP' },
  { id: 'databricks',   label: 'Databricks' },
  { id: 'salesforce',   label: 'Salesforce' },
  { id: 'oracle',       label: 'Oracle' },
  { id: 'servicenow',   label: 'ServiceNow' },
]

// ─── Chama Foursys ────────────────────────────────────────────────────────────

function FoursysLogo() {
  return (
    <div className="relative select-none flex items-center justify-center py-4">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,102,0,0.25) 0%, rgba(255,80,0,0.08) 45%, transparent 75%)',
          filter: 'blur(30px)',
          transform: 'scale(1.6)',
        }}
      />

      {/* Stage light beams */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 120%, transparent 30%, rgba(255,100,0,0.06) 40%, transparent 50%, rgba(255,100,0,0.04) 60%, transparent 70%)',
          filter: 'blur(8px)',
          transform: 'scale(2)',
        }}
      />

      {/* Floor reflection */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-10 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,80,0,0.4) 0%, transparent 70%)',
          filter: 'blur(12px)',
        }}
      />

      {/* Logo */}
      <motion.div
        className="relative z-10"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          width="340"
          height="124"
          viewBox="0 0 220 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_24px_rgba(255,100,0,0.5)]"
        >
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF8C00" />
              <stop offset="50%" stopColor="#FF6600" />
              <stop offset="100%" stopColor="#CC4400" />
            </linearGradient>
            <linearGradient id="logoShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFB366" />
              <stop offset="40%" stopColor="#FF6600" />
              <stop offset="100%" stopColor="#993D00" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Accent line */}
          <rect x="20" y="16" width="4" height="28" rx="2" fill="url(#logoGrad)" opacity="0.9" />

          {/* Main text: foursys */}
          <text
            x="34"
            y="42"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="38"
            fontWeight="900"
            letterSpacing="-1"
            fill="url(#logoShine)"
            filter="url(#glow)"
          >
            foursys
          </text>

          {/* Tagline */}
          <text
            x="36"
            y="60"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="9"
            fontWeight="600"
            letterSpacing="5"
            fill="rgba(255,255,255,0.35)"
          >
            DIGITAL SOLUTIONS
          </text>

          {/* Decorative dot */}
          <circle cx="198" cy="30" r="4" fill="url(#logoGrad)" opacity="0.7" />
        </svg>
      </motion.div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

// ─── Frases de dor contextualizadas ─────────────────────────────────────────

const PAIN_STATEMENTS: Record<string, Record<string, string>> = {
  financeiro: {
    ceo: 'Velocidade de entrega travada por legado?',
    cfo: 'Custo de operação digital fora de controle?',
    cto: 'Dívida técnica impedindo escala?',
    diretor: 'Time de TI pressionado por demanda crescente?',
    gestor: 'Processos manuais consumindo capacidade do time?',
    default: 'Transformação digital com segurança e escala?',
  },
  saude: {
    ceo: 'Operação clínica fragmentada em sistemas legados?',
    cfo: 'Custos invisíveis na jornada do paciente?',
    cto: 'Dados de saúde sem integração nem governança?',
    diretor: 'Conformidade regulatória difícil de garantir?',
    gestor: 'Fluxos clínicos lentos por processos não automatizados?',
    default: 'Inovação em saúde com segurança e compliance?',
  },
  seguros: {
    ceo: 'Time-to-market de novos produtos em anos, não meses?',
    cfo: 'Fraude e sinistro consumindo margem?',
    cto: 'Core de seguros difícil de evoluir?',
    diretor: 'Experiência do segurado abaixo das expectativas?',
    gestor: 'Subscrição e emissão lentas por processos manuais?',
    default: 'Modernização de seguros com agilidade e controle?',
  },
  outro: {
    default: 'Como acelerar entregas digitais sem perder governança?',
  },
}

function getPainStatement(sector: string | null, role: string | null): string | null {
  if (!sector) return null
  const sectorMap = PAIN_STATEMENTS[sector] ?? PAIN_STATEMENTS['outro']
  return (role && sectorMap[role]) ? sectorMap[role] : sectorMap['default'] ?? null
}

export function SectionHome() {
  const { navigate, state } = useApp()

  const kpi1 = useCountUp(heroStats.years,      1400)
  const kpi2 = useCountUp(500,                  1800)
  const kpi3 = useCountUp(7,                    1600)

  const painStatement = getPainStatement(state.sessionProfile?.sector ?? null, state.sessionProfile?.role ?? null)

  const kpis = [
    { ref: kpi1, suffix: ' anos',  label: 'de história e entrega' },
    { ref: kpi2, suffix: 'K+',     label: 'projetos entregues' },
    { ref: kpi3, suffix: '',       label: 'cidades em 3 continentes' },
  ]

  return (
    <SectionWrapper>
      <div className="h-full flex flex-col overflow-y-auto overflow-x-hidden">

        {/* ── Área principal: 1 col mobile / 3 col desktop ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[2.5fr_3fr_2.5fr]">

          {/* ── Coluna central (em mobile vem primeiro): Chama + tagline ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-8 lg:py-6 cursor-pointer order-1 lg:order-2"
            onClick={() => navigate('identity')}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('identity') } }}
          >
            <FoursysLogo />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-4 text-center px-6"
            >
              <h1 className="text-lg md:text-xl font-black text-white leading-snug mb-2">
                Soluções digitais que conectam
                <br />
                <span className="text-foursys-primary">estratégia, execução e evolução</span>
              </h1>

              {painStatement && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="mt-3 px-4 py-2.5 rounded-xl bg-foursys-primary/10 border border-foursys-primary/25 text-foursys-primary text-sm font-semibold leading-snug"
                >
                  "{painStatement}"
                </motion.div>
              )}

              <div
                className="text-xs font-semibold tracking-[0.22em] uppercase mt-3 hidden lg:block"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                clique para começar
              </div>
            </motion.div>
          </motion.div>

          {/* ── Coluna esquerda: KPIs ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center px-5 md:px-10 py-6 md:py-8 gap-5 md:gap-7 order-2 lg:order-1 border-t lg:border-t-0 lg:border-r border-white/[0.06]"
          >
            <div>
              <span className="text-xs font-bold tracking-[0.18em] uppercase text-foursys-primary">
                Fundada em 2000
              </span>
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4 lg:gap-7">
              {kpis.map(({ ref, suffix, label }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
                  className="border-l-[3px] border-foursys-primary pl-3 lg:pl-5"
                >
                  <div className="text-3xl md:text-5xl lg:text-[68px] leading-none font-black text-white tracking-tight tabular-nums">
                    {ref.count}
                    <span className="text-xl md:text-2xl lg:text-4xl">{suffix}</span>
                  </div>
                  <div className="text-[10px] md:text-sm text-foursys-text-muted mt-1 font-medium leading-tight">{label}</div>
                </motion.div>
              ))}
            </div>

          </motion.div>

          {/* ── Coluna direita: Ofertas Flagship ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center px-5 md:px-8 py-6 md:py-8 gap-3 md:gap-4 order-3 border-t lg:border-t-0 lg:border-l border-white/[0.06]"
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-foursys-primary mb-1">
              Ofertas Flagship
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-4">
              {flagshipOffers.map((offer, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.4 }}
                  className="border-l-[3px] border-foursys-primary pl-3 lg:pl-5 cursor-pointer hover:border-foursys-primary/80 transition-colors"
                  onClick={() => navigate('offers-flagship')}
                >
                  <span className="text-sm md:text-lg font-semibold text-white leading-snug">{offer}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Barra inferior ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 border-t border-white/[0.08]"
        >
          {/* Estrutura de entrega */}
          <div className="px-5 md:px-10 py-4 md:py-5 border-b sm:border-b-0 sm:border-r border-white/[0.06]">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-foursys-primary mb-2">
              Modelos de Entrega
            </div>
            <div className="text-xs md:text-sm text-foursys-text-muted leading-relaxed">
              Squads · Projetos · Alocação · AMS · Produtos
            </div>
          </div>

          {/* Certificações */}
          <div className="px-5 md:px-10 py-4 md:py-5 border-b sm:border-b-0 sm:border-r border-white/[0.06]">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-foursys-primary mb-3">
              Certificações
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {['ISO 9001', 'ISO 27001', 'ISO 27701', 'ISO 14001', 'SAFe'].map(cert => (
                <CertificationBadge key={cert} label={cert} size="sm" />
              ))}
            </div>
          </div>

          {/* Alianças */}
          <div className="px-5 md:px-10 py-4 md:py-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-foursys-primary mb-3">
              Parceiros Estratégicos
            </div>
            <div className="flex items-center gap-5 flex-wrap">
              {allianceLogos.map(a => (
                <div
                  key={a.id}
                  className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity duration-200"
                  title={a.label}
                >
                  <PartnerLogo id={a.id} size={14} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Rodapé ── */}
        <div className="text-center text-[10px] md:text-[11px] text-foursys-text-dim py-2.5 border-t border-white/[0.04] tracking-wide px-4">
          {heroStats.years} anos · {heroStats.turnover} turnover · {heroStats.projects} projetos · Brasil · EUA · Portugal
        </div>

      </div>
    </SectionWrapper>
  )
}
