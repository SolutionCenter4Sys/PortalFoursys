import { motion } from 'framer-motion'
import { useCountUp } from '../../hooks/useCountUp'
import { useApp } from '../../context/AppContext'
import { SectionWrapper } from '../ui/SectionWrapper'

// ─── Dados do dashboard ───────────────────────────────────────────────────────

const services = [
  'AI-Augmented Squad',
  'IA First',
  'Core Banking',
  'Antifraudes',
  'FourBlox',
  'Cyber Security',
]

const allianceLogos = [
  { id: 'aws',        label: 'aws',        color: '#FF9900' },
  { id: 'databricks', label: 'databricks', color: '#FF3621' },
  { id: 'salesforce', label: 'salesforce', color: '#00A1E0' },
  { id: 'pega',       label: 'PEGA',       color: '#009A44' },
]

// ─── Formatador ───────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n.toLocaleString('pt-BR')
}

// ─── Chama Foursys (imagem real com glow) ────────────────────────────────────

function FoursysFlame() {
  return (
    <div className="relative select-none flex items-center justify-center">

      {/* Halo de luz radial por trás */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 65%, rgba(200,60,0,0.35) 0%, rgba(255,100,0,0.12) 50%, transparent 80%)',
          filter: 'blur(24px)',
          transform: 'scale(1.4)',
        }}
      />

      {/* Reflexo no chão */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-8 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,80,0,0.55) 0%, transparent 75%)',
          filter: 'blur(10px)',
        }}
      />

      {/* Imagem da chama */}
      <motion.img
        src="/images/foursys-flame.png"
        alt="Foursys Flame"
        className="relative z-10 w-56 h-auto drop-shadow-[0_0_32px_rgba(255,80,0,0.6)]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 28px rgba(255,100,0,0.55))' }}
      />
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionOpening() {
  const { navigate } = useApp()

  const kpi1 = useCountUp(69,    1600)
  const kpi2 = useCountUp(78624, 2200)
  const kpi3 = useCountUp(110,   1600)

  const kpis = [
    { ref: kpi1, hasThousands: false, label: 'Especialistas dedicados' },
    { ref: kpi2, hasThousands: true,  label: 'Horas de serviço em 2026' },
    { ref: kpi3, hasThousands: false, label: 'Projetos ativos' },
  ]

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
            className="flex flex-col justify-center px-10 py-8 gap-8"
          >
            {/* DESDE 2009 */}
            <div>
              <span className="text-xs font-bold tracking-[0.18em] uppercase text-foursys-blue">
                Desde 2009
              </span>
            </div>

            {kpis.map(({ ref, hasThousands, label }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
                className="border-l-[3px] border-foursys-blue pl-5"
              >
                <div className="text-[72px] leading-none font-black text-white tracking-tight tabular-nums">
                  {hasThousands ? fmt(ref.count) : ref.count}
                </div>
                <div className="text-sm text-foursys-text-muted mt-1 font-medium">
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Coluna central: Chama ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-6 cursor-pointer"
            onClick={() => navigate('identity')}
          >
            <FoursysFlame />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-2 text-center"
            >
              <div
                className="text-xs font-semibold tracking-[0.22em] uppercase mb-1"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                clique para começar
              </div>
            </motion.div>
          </motion.div>

          {/* ── Coluna direita: Serviços ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center px-8 py-8 gap-5"
          >
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08, duration: 0.4 }}
                className="border-l-[3px] border-foursys-blue pl-5"
              >
                <span className="text-xl font-semibold text-white leading-snug">
                  {service}
                </span>
              </motion.div>
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
          {/* Estrutura de entrega */}
          <div className="px-10 py-5 border-r border-white/[0.06]">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-foursys-blue mb-2">
              Estrutura de Entrega
            </div>
            <div className="text-sm text-foursys-text-muted leading-relaxed">
              Projetos · Squads · Alocação
              <br />+ Agentes · Produtos · AMS
            </div>
          </div>

          {/* Destaques */}
          <div className="px-10 py-5 border-r border-white/[0.06]">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-foursys-blue mb-2">
              Destaques
            </div>
            <div className="text-sm text-foursys-text-muted leading-relaxed">
              FourMakers · Portal Imobiliário SHI
            </div>
          </div>

          {/* Alianças estratégicas */}
          <div className="px-10 py-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-foursys-blue mb-3">
              Alianças Estratégicas
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {allianceLogos.map(a => (
                <span
                  key={a.id}
                  className="text-sm font-bold tracking-wide"
                  style={{ color: a.color }}
                >
                  {a.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Rodapé ── */}
        <div className="text-center text-[11px] text-foursys-text-dim py-2.5 border-t border-white/[0.04] tracking-wide">
          Foursys × Santander — Construindo o futuro digital juntos há 17 anos
        </div>

      </div>
    </SectionWrapper>
  )
}
