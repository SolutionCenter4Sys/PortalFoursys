import { motion } from 'framer-motion'
import { useCountUp } from '../../../hooks/useCountUp'
import { useApp } from '../../../context/AppContext'
import { SectionWrapper } from '../../ui/SectionWrapper'
import { ClientLogo } from '../../ui/ClientLogos'
import { getClientById } from '../../../data/clients'

// ─── Helpers de cor ──────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function rgba(hex: string, a: number) {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}

// ─── Visual Hero dinâmico por cliente ────────────────────────────────────────

function ClientBrandHero({ clientId, color, accent }: { clientId: string; color: string; accent: string }) {
  return (
    <div className="relative select-none flex items-center justify-center w-64 h-64">
      {/* Anel orbital externo */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1.5px solid ${rgba(color, 0.15)}`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
          style={{ background: rgba(color, 0.7), boxShadow: `0 0 8px ${rgba(color, 0.5)}` }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: rgba(accent, 0.5) }}
        />
      </motion.div>

      {/* Anel orbital interno */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: '24px',
          border: `1px solid ${rgba(accent, 0.1)}`,
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{ background: rgba(accent, 0.6), boxShadow: `0 0 6px ${rgba(accent, 0.4)}` }}
        />
      </motion.div>

      {/* Glow externo difuso */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${rgba(color, 0.2)} 0%, ${rgba(color, 0.06)} 40%, transparent 70%)`,
          filter: 'blur(20px)',
          transform: 'scale(1.5)',
        }}
      />

      {/* Reflexo inferior */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-10 rounded-full"
        style={{
          background: `radial-gradient(ellipse, ${rgba(color, 0.35)} 0%, transparent 70%)`,
          filter: 'blur(12px)',
        }}
      />

      {/* Container central com logo */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Hexágono de fundo com glow */}
        <div className="relative">
          <svg viewBox="0 0 200 220" width={160} height={176} className="absolute -inset-2 opacity-60">
            <defs>
              <linearGradient id={`hex-grad-${clientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={rgba(color, 0.25)} />
                <stop offset="100%" stopColor={rgba(accent, 0.1)} />
              </linearGradient>
              <filter id={`hex-glow-${clientId}`}>
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
              </filter>
            </defs>
            <polygon
              points="100,10 185,60 185,160 100,210 15,160 15,60"
              fill={`url(#hex-grad-${clientId})`}
              filter={`url(#hex-glow-${clientId})`}
            />
          </svg>

          <div
            className="relative w-36 h-36 rounded-2xl flex items-center justify-center overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${rgba(color, 0.12)}, ${rgba(accent, 0.05)})`,
              border: `1.5px solid ${rgba(color, 0.25)}`,
              boxShadow: `
                0 0 40px ${rgba(color, 0.2)},
                0 0 80px ${rgba(color, 0.08)},
                inset 0 1px 0 ${rgba(color, 0.15)}
              `,
            }}
          >
            {/* Reflexo de luz */}
            <div
              className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, ${rgba(color, 0.08)} 0%, transparent 100%)`,
                borderRadius: '16px 16px 0 0',
              }}
            />

            <motion.div
              className="relative z-10"
              style={{
                filter: `drop-shadow(0 0 20px ${rgba(color, 0.5)}) drop-shadow(0 0 40px ${rgba(color, 0.25)})`,
              }}
            >
              <ClientLogo id={clientId} size={52} />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Partículas animadas */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3 + (i % 2),
            height: 3 + (i % 2),
            background: i % 2 === 0 ? rgba(color, 0.6) : rgba(accent, 0.4),
            boxShadow: `0 0 4px ${i % 2 === 0 ? rgba(color, 0.3) : rgba(accent, 0.2)}`,
          }}
          animate={{
            x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 8), 0],
            y: [0, -(30 + i * 10), 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionClientOpening() {
  const { state, navigate, clearClient } = useApp()
  const client = state.activeClientId ? getClientById(state.activeClientId) : null

  const kpi1 = useCountUp(26,    1400)
  const kpi2 = useCountUp(500,   1800)
  const kpi3 = useCountUp(client?.yearsPartnership ?? 5, 1600)

  if (!client) return null

  const clientColor = client.colors.primary

  const kpis = [
    { ref: kpi1, suffix: ' anos',  label: 'de história Foursys' },
    { ref: kpi2, suffix: 'K+',     label: 'projetos entregues' },
    { ref: kpi3, suffix: '+',      label: `anos com ${client.name}` },
  ]

  const clientSections = client.sections.slice(1)

  return (
    <SectionWrapper>
      <div className="h-full flex flex-col overflow-hidden">

        {/* ── Área principal 3 colunas ── */}
        <div className="flex-1 grid grid-cols-[2.5fr_3fr_2.5fr]">

          {/* ── Coluna esquerda: KPIs ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center px-10 py-8 gap-7"
          >
            <div>
              <span
                className="text-xs font-bold tracking-[0.18em] uppercase"
                style={{ color: clientColor }}
              >
                Foursys × {client.name}
              </span>
            </div>

            {kpis.map(({ ref, suffix, label }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
                className="border-l-[3px] pl-5"
                style={{ borderColor: clientColor }}
              >
                <div className="text-[68px] leading-none font-black text-white tracking-tight tabular-nums">
                  {ref.count}
                  <span className="text-4xl">{suffix}</span>
                </div>
                <div className="text-sm text-foursys-text-muted mt-1 font-medium">{label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Coluna central: Visual do cliente ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-6"
          >
            <ClientBrandHero clientId={client.id} color={clientColor} accent={client.colors.accent} />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-2 text-center px-6"
            >
              <h1 className="text-lg font-black text-white leading-snug mb-1">
                {client.tagline}
              </h1>
              <p className="text-sm text-foursys-text-muted">{client.relationship}</p>
            </motion.div>

            {/* Badge do cliente */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-3"
            >
              <div
                className="px-4 py-2 rounded-full border text-sm font-bold"
                style={{
                  borderColor: `${clientColor}60`,
                  backgroundColor: `${clientColor}12`,
                  color: clientColor,
                }}
              >
                Apresentação Personalizada · {client.name}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Coluna direita: Seções do cliente ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center px-8 py-8 gap-4"
          >
            <div
              className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1"
              style={{ color: clientColor }}
            >
              Nesta apresentação
            </div>

            {clientSections.map((section, i) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.4 }}
                onClick={() => navigate(section.id)}
                className="border-l-[3px] pl-5 text-left hover:opacity-80 transition-opacity"
                style={{ borderColor: clientColor }}
              >
                <span className="text-lg font-semibold text-white leading-snug">
                  {section.icon} {section.label}
                </span>
                <p className="text-xs text-foursys-text-muted mt-0.5">{section.description}</p>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* ── Barra inferior ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="grid grid-cols-3 border-t border-white/[0.08]"
        >
          <div className="px-10 py-5 border-r border-white/[0.06]">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.16em] mb-2"
              style={{ color: clientColor }}
            >
              Estrutura de Entrega
            </div>
            <div className="text-sm text-foursys-text-muted leading-relaxed">
              Projetos · Squads · Alocação
              <br />+ Agentes · Produtos · AMS
            </div>
          </div>

          <div className="px-10 py-5 border-r border-white/[0.06]">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.16em] mb-2"
              style={{ color: clientColor }}
            >
              Diferenciais
            </div>
            <div className="text-sm text-foursys-text-muted leading-relaxed">
              26 anos · 3,6% turnover · ISO 9001
              <br />
              ISO 27001 · SAFe · GPTW
            </div>
          </div>

          <div className="px-10 py-5 flex flex-col justify-center">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.16em] mb-2"
              style={{ color: clientColor }}
            >
              Modo de visualização
            </div>
            <button
              onClick={clearClient}
              className="text-xs text-foursys-text-dim hover:text-foursys-text-muted transition-colors underline underline-offset-2 text-left"
            >
              Voltar para apresentação institucional →
            </button>
          </div>
        </motion.div>

        {/* ── Rodapé ── */}
        <div
          className="text-center text-[11px] py-2.5 border-t border-white/[0.04] tracking-wide"
          style={{ color: `${clientColor}80` }}
        >
          Foursys × {client.name} · {client.relationship}
        </div>

      </div>
    </SectionWrapper>
  )
}
