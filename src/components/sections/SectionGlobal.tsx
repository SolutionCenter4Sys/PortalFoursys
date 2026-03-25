import { motion } from 'framer-motion'
import { Phone, MapPin } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'

// ─── Dados ───────────────────────────────────────────────────────────────────

const continents = [
  {
    flag: '🇧🇷',
    region: 'Brasil',
    count: '5 unidades',
    colorHex: '#22c55e',
    bg: 'from-green-500/15 to-green-600/5',
    border: 'border-green-500/30',
    textCls: 'text-green-400',
    units: [
      { name: 'Sede Barueri',      city: 'Barueri – SP',         address: 'Av. Tamboré, 267 · Torre Norte, 9º andar', phone: '(11) 4134 – 2222', main: true  },
      { name: 'Unidade Paulista',  city: 'São Paulo – SP',        address: 'Av. Paulista, 1912 · Consolação, 15º andar', phone: '(11) 4861 – 8560' },
      { name: 'Inovabra Habitat',  city: 'São Paulo – SP',        address: 'Av. Angélica, 2529 · Bela Vista' },
      { name: 'Operação Sul',      city: 'Curitiba – PR',         address: 'R. Comendador Araújo, 499 · Batel, 10º andar', phone: '(41) 2106 – 6709' },
      { name: 'Operação Rio',      city: 'Rio de Janeiro – RJ',   address: 'Av. Presidente Vargas, 3131 · Cidade Nova, Sala 604' },
    ],
  },
  {
    flag: '🇺🇸',
    region: 'Estados Unidos',
    count: '1 unidade',
    colorHex: '#3b82f6',
    bg: 'from-blue-500/15 to-blue-600/5',
    border: 'border-blue-500/30',
    textCls: 'text-blue-400',
    units: [
      { name: 'Unidade Estados Unidos', city: 'Flórida – EUA', address: '980 N. Federal Highway #110 · Boca Raton, FL 33432' },
    ],
  },
  {
    flag: '🇵🇹',
    region: 'Europa',
    count: '1 unidade',
    colorHex: '#8b5cf6',
    bg: 'from-violet-500/15 to-violet-600/5',
    border: 'border-violet-500/30',
    textCls: 'text-violet-400',
    units: [
      { name: 'Unidade Europa', city: 'Lisboa – Portugal', address: 'Av. da Liberdade, 110', phone: 'Tel: 1269 – 046' },
    ],
  },
]

const kpis = [
  { value: '+2K',   label: 'Colaboradores',       icon: '👥' },
  { value: '+500K', label: 'Projetos entregues',  icon: '🚀' },
  { value: '25+',   label: 'Anos de mercado',     icon: '📅' },
  { value: '7',     label: 'Unidades globais',    icon: '🏢' },
]

const milestones = [
  { year: '2000', label: 'Empresa de software' },
  { year: '2015', label: 'Agilidade como Cultura' },
  { year: '2019', label: 'Design Orientado a Dados' },
  { year: '2022', label: 'Plataforma e Ecossistema Digital' },
  { year: '2025', label: 'Inovação com Tecnologias Disruptivas' },
]

// ─── Card de unidade dentro do continente ─────────────────────────────────────

function UnitRow({
  unit,
  colorHex,
  textCls,
}: {
  unit: typeof continents[0]['units'][0] & { main?: boolean }
  colorHex: string
  textCls: string
}) {
  return (
    <div className="flex gap-3 py-2.5 border-b border-white/[0.05] last:border-0">
      <div className="flex-shrink-0 mt-0.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: colorHex, boxShadow: `0 0 6px ${colorHex}80` }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-foursys-text leading-snug">{unit.name}</span>
          {'main' in unit && unit.main && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border"
              style={{ color: colorHex, borderColor: `${colorHex}50`, backgroundColor: `${colorHex}18` }}
            >
              Sede
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={9} className="text-foursys-text-dim/50 flex-shrink-0" />
          <span className="text-[10px] text-foursys-text-dim leading-snug">{unit.city}</span>
        </div>
        <div className="text-[10px] text-foursys-text-dim/60 leading-relaxed mt-0.5">{unit.address}</div>
        {'phone' in unit && unit.phone && (
          <div className="flex items-center gap-1 mt-0.5">
            <Phone size={8} className="text-foursys-text-dim/40 flex-shrink-0" />
            <span className={`text-[10px] ${textCls} opacity-70`}>{unit.phone}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Card de continente ───────────────────────────────────────────────────────

function ContinentCard({ continent, index }: { continent: typeof continents[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.12 }}
      className={`rounded-2xl border bg-gradient-to-b ${continent.bg} ${continent.border} backdrop-blur-sm p-5 flex flex-col`}
    >
      {/* Header do continente */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{continent.flag}</span>
          <div>
            <div className={`text-sm font-black ${continent.textCls}`}>{continent.region}</div>
            <div className="text-[10px] text-foursys-text-dim">{continent.count}</div>
          </div>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
          style={{ backgroundColor: `${continent.colorHex}22`, color: continent.colorHex, border: `1px solid ${continent.colorHex}40` }}
        >
          {continent.units.length}
        </div>
      </div>

      {/* Unidades */}
      <div className="flex-1">
        {continent.units.map(unit => (
          <UnitRow
            key={unit.name}
            unit={unit}
            colorHex={continent.colorHex}
            textCls={continent.textCls}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionGlobal() {
  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-blue/15 border border-foursys-blue/30 text-foursys-cyan text-xs mb-3">
            🌎 Presença Global
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foursys-text leading-tight">
                Transformando negócios pelo mundo{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] to-[#FF9933]">
                  com excelência e inovação
                </span>
              </h2>
              <p className="text-sm text-foursys-text-muted mt-2 max-w-xl">
                Presença ativa em 3 continentes — entregando tecnologia de ponta com times dedicados e parceiros estratégicos locais.
              </p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 flex-shrink-0">
              {kpis.map((kpi, i) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-foursys-surface/50 border border-white/10 min-w-[80px]"
                >
                  <span className="text-lg mb-0.5">{kpi.icon}</span>
                  <div className="text-lg font-black text-foursys-cyan leading-none">{kpi.value}</div>
                  <div className="text-[9px] text-foursys-text-dim text-center leading-tight mt-0.5">{kpi.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Continentes ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 mb-6">

          {/* Brasil — maior, à esquerda */}
          <ContinentCard continent={continents[0]} index={0} />

          {/* EUA + Europa — empilhados à direita */}
          <div className="flex flex-col gap-4">
            <ContinentCard continent={continents[1]} index={1} />
            <ContinentCard continent={continents[2]} index={2} />
          </div>
        </div>

        {/* ── Legenda de bases ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 px-1"
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim">Nossas bases:</span>
          {continents.map(c => (
            <span key={c.region} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: c.colorHex, boxShadow: `0 0 6px ${c.colorHex}` }}
              />
              <span className="text-foursys-text-muted">{c.flag} {c.region}</span>
            </span>
          ))}
        </motion.div>

        {/* ── Timeline ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-foursys-surface/40 border border-white/10 p-5 md:p-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-5">
            Nossa trajetória é de crescimento e adaptação ao mercado global
          </p>

          {/* Desktop */}
          <div className="hidden sm:flex items-start">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex-1 relative">
                {i < milestones.length - 1 && (
                  <div className="absolute top-[9px] left-1/2 w-full h-px bg-gradient-to-r from-[#FF6600]/70 to-[#FF6600]/20 pointer-events-none" />
                )}
                <div className="flex flex-col items-center text-center px-1">
                  <div
                    className="w-[18px] h-[18px] rounded-full border-2 border-[#FF6600] bg-foursys-dark-2 z-10 relative mb-2 flex-shrink-0 flex items-center justify-center"
                    style={{ boxShadow: '0 0 12px rgba(255,102,0,0.5)' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#FF6600]" />
                  </div>
                  <div className="text-sm font-black text-[#FF6600]">{m.year}</div>
                  <div className="text-[10px] text-foursys-text-dim leading-snug mt-1 max-w-[88px]">{m.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="flex flex-col gap-4 sm:hidden">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex items-start gap-4 relative">
                {i < milestones.length - 1 && (
                  <div className="absolute left-[8px] top-5 bottom-[-16px] w-px bg-gradient-to-b from-[#FF6600]/60 to-transparent" />
                )}
                <div
                  className="w-[18px] h-[18px] rounded-full border-2 border-[#FF6600] bg-foursys-dark-2 flex-shrink-0 flex items-center justify-center z-10"
                  style={{ boxShadow: '0 0 10px rgba(255,102,0,0.4)' }}
                >
                  <div className="w-2 h-2 rounded-full bg-[#FF6600]" />
                </div>
                <div>
                  <div className="text-sm font-black text-[#FF6600]">{m.year}</div>
                  <div className="text-xs text-foursys-text-dim leading-snug">{m.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </SectionWrapper>
  )
}
