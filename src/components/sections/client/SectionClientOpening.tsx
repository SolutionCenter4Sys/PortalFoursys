import { motion } from 'framer-motion'
import { useCountUp } from '../../../hooks/useCountUp'
import { useApp } from '../../../context/AppContext'
import { SectionWrapper } from '../../ui/SectionWrapper'
import { ClientLogo } from '../../ui/ClientLogos'
import { getClientById } from '../../../data/clients'

// ─── Chama Foursys ────────────────────────────────────────────────────────────

function FoursysFlame() {
  return (
    <div className="relative select-none flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 50% 65%, rgba(200,60,0,0.35) 0%, rgba(255,100,0,0.12) 50%, transparent 80%)',
          filter: 'blur(24px)',
          transform: 'scale(1.4)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-8 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,80,0,0.55) 0%, transparent 75%)',
          filter: 'blur(10px)',
        }}
      />
      <motion.img
        src="/images/foursys-flame.png"
        alt="Foursys"
        className="relative z-10 w-48 h-auto drop-shadow-[0_0_32px_rgba(255,80,0,0.6)]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 28px rgba(255,100,0,0.55))' }}
      />
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

          {/* ── Coluna central: Chama ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-6"
          >
            <FoursysFlame />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-4 text-center px-6"
            >
              <h1 className="text-lg font-black text-white leading-snug mb-1">
                {client.tagline}
              </h1>
              <p className="text-sm text-foursys-text-muted">{client.relationship}</p>
            </motion.div>

            {/* Logo + Badge do cliente */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-4 flex flex-col items-center gap-3"
            >
              <div className="opacity-90">
                <ClientLogo id={client.id} size={28} />
              </div>
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
