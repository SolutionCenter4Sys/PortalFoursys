import { motion } from 'framer-motion'
import { Phone } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'

// ─── Dados reais das unidades Foursys ────────────────────────────────────────

const units = [
  {
    name: 'Sede Barueri',
    city: 'Barueri – SP',
    address: 'Av. Tamboré, 267\nTorre Norte, 9º andar',
    phone: '(11) 4134 – 2222',
    flag: '🇧🇷',
    color: 'border-green-500/30',
    dot: 'bg-green-400',
    glow: 'rgba(34,197,94,0.5)',
    badge: 'text-green-400 bg-green-500/10 border-green-500/20',
    highlight: true,
  },
  {
    name: 'Unidade Paulista',
    city: 'São Paulo – SP',
    address: 'Av. Paulista, 1912\nConsolação, 15º andar',
    phone: '(11) 4861 – 8560',
    flag: '🇧🇷',
    color: 'border-green-500/20',
    dot: 'bg-green-400',
    glow: 'rgba(34,197,94,0.4)',
    badge: 'text-green-400 bg-green-500/10 border-green-500/20',
    highlight: false,
  },
  {
    name: 'Inovabra Habitat',
    city: 'São Paulo – SP',
    address: 'Av. Angélica, 2529\nBela Vista',
    phone: '',
    flag: '🇧🇷',
    color: 'border-green-500/20',
    dot: 'bg-green-400',
    glow: 'rgba(34,197,94,0.4)',
    badge: 'text-green-400 bg-green-500/10 border-green-500/20',
    highlight: false,
  },
  {
    name: 'Operação Sul',
    city: 'Curitiba – PR',
    address: 'R. Comendador Araújo, 499\nBatel, 10º andar',
    phone: '(41) 2106 – 6709',
    flag: '🇧🇷',
    color: 'border-green-500/20',
    dot: 'bg-green-400',
    glow: 'rgba(34,197,94,0.4)',
    badge: 'text-green-400 bg-green-500/10 border-green-500/20',
    highlight: false,
  },
  {
    name: 'Operação Rio',
    city: 'Rio de Janeiro – RJ',
    address: 'Av. Presidente Vargas, 3131\nCidade Nova, Sala 604',
    phone: '',
    flag: '🇧🇷',
    color: 'border-green-500/20',
    dot: 'bg-green-400',
    glow: 'rgba(34,197,94,0.4)',
    badge: 'text-green-400 bg-green-500/10 border-green-500/20',
    highlight: false,
  },
  {
    name: 'Unidade Europa',
    city: 'Lisboa – Portugal',
    address: 'Av. da Liberdade, 110',
    phone: 'Tel: 1269 – 046',
    flag: '🇵🇹',
    color: 'border-violet-500/30',
    dot: 'bg-violet-400',
    glow: 'rgba(139,92,246,0.5)',
    badge: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    highlight: false,
  },
  {
    name: 'Unidade Estados Unidos',
    city: 'Flórida – EUA',
    address: '980 N. Federal Highway\n#110, Boca Raton, FL 33432',
    phone: '',
    flag: '🇺🇸',
    color: 'border-blue-500/30',
    dot: 'bg-blue-400',
    glow: 'rgba(59,130,246,0.5)',
    badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    highlight: false,
  },
]

const milestones = [
  { year: '2000', label: 'Empresa de software' },
  { year: '2015', label: 'Agilidade como Cultura' },
  { year: '2019', label: 'Design Orientado a Dados' },
  { year: '2022', label: 'Plataforma e Ecossistema Digital' },
  { year: '2025', label: 'Inovação com Tecnologias Disruptivas' },
]

// ─── Mapa SVG simplificado com pins ─────────────────────────────────────────

function WorldMapPins() {
  const pins = [
    { cx: 175, cy: 148, label: 'Brasil',   color: '#22c55e', count: 5 },
    { cx: 120, cy: 110, label: 'EUA',      color: '#3b82f6', count: 1 },
    { cx: 430, cy: 100, label: 'Europa',   color: '#8b5cf6', count: 1 },
  ]

  return (
    <svg viewBox="0 0 700 280" className="w-full h-auto">
      {/* Fundo do mapa */}
      <rect width="700" height="280" fill="rgba(0,85,179,0.04)" rx="12" />

      {/* Linhas de grade horizontais */}
      {[60, 100, 140, 180, 220].map(y => (
        <line key={y} x1="20" y1={y} x2="680" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      {/* Linhas de grade verticais */}
      {[80, 180, 280, 380, 480, 580].map(x => (
        <line key={x} x1={x} y1="20" x2={x} y2="260" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}

      {/* Linhas de conexão entre Brasil e os outros */}
      <line x1="175" y1="148" x2="120" y2="110" stroke="rgba(255,102,0,0.3)" strokeWidth="1" strokeDasharray="4 3" />
      <line x1="175" y1="148" x2="430" y2="100" stroke="rgba(255,102,0,0.3)" strokeWidth="1" strokeDasharray="4 3" />

      {/* Pins */}
      {pins.map(pin => (
        <g key={pin.label}>
          {/* Halo */}
          <circle cx={pin.cx} cy={pin.cy} r="16" fill={pin.color} opacity="0.12" />
          <circle cx={pin.cx} cy={pin.cy} r="10" fill={pin.color} opacity="0.20" />
          {/* Ponto central */}
          <circle cx={pin.cx} cy={pin.cy} r="5" fill={pin.color} />
          {/* Rótulo */}
          <text
            x={pin.cx}
            y={pin.cy + 22}
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill={pin.color}
            fontFamily="Inter, system-ui, sans-serif"
          >
            {pin.label}
          </text>
          {/* Badge de quantidade */}
          {pin.count > 1 && (
            <>
              <circle cx={pin.cx + 10} cy={pin.cy - 10} r="8" fill={pin.color} />
              <text
                x={pin.cx + 10}
                y={pin.cy - 6}
                textAnchor="middle"
                fontSize="8"
                fontWeight="900"
                fill="#000"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {pin.count}
              </text>
            </>
          )}
        </g>
      ))}

      {/* Label central */}
      <text x="350" y="255" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.25)" fontFamily="Inter, system-ui, sans-serif">
        3 continentes · 7 unidades · Delivery 24 /7
      </text>
    </svg>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionGlobal() {
  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto">

        {/* ── Hero ── */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-blue/15 border border-foursys-blue/30 text-foursys-cyan text-xs mb-4">
              🌎 Presença Global
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-foursys-text leading-tight mb-3">
              Transformando negócios pelo mundo{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] to-[#FF9933]">
                com excelência e inovação
              </span>
            </h2>
            <p className="text-sm md:text-base text-foursys-text-muted max-w-xl">
              Presença ativa em Brasil, Estados Unidos e Europa — com capacidade de delivery remoto e presencial em qualquer localidade.
            </p>
          </motion.div>

          {/* KPIs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-6 lg:gap-10 flex-shrink-0"
          >
            {[
              { value: '+2K',   label: 'Colaboradores' },
              { value: '+500K', label: 'Projetos entregues' },
            ].map(kpi => (
              <div key={kpi.label} className="text-center">
                <div className="text-3xl md:text-4xl font-black text-foursys-cyan">{kpi.value}</div>
                <div className="text-xs text-foursys-text-dim mt-1">{kpi.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Mapa + unidades ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mb-8">

          {/* Mapa */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl bg-foursys-surface/40 border border-white/10 p-4 md:p-6 overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim">Nossas bases</span>
              {[
                { flag: '🇧🇷', label: 'Brasil',   color: 'text-green-400' },
                { flag: '🇺🇸', label: 'EUA',      color: 'text-blue-400' },
                { flag: '🇵🇹', label: 'Portugal', color: 'text-violet-400' },
              ].map(b => (
                <span key={b.label} className={`flex items-center gap-1.5 text-xs font-semibold ${b.color}`}>
                  {b.flag} {b.label}
                </span>
              ))}
            </div>
            <WorldMapPins />
          </motion.div>

          {/* Lista de unidades — Brasil */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col gap-2"
          >
            {units.map((unit, i) => (
              <motion.div
                key={unit.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className={`
                  p-3.5 rounded-xl border backdrop-blur-sm transition-all duration-200
                  ${unit.highlight
                    ? 'bg-foursys-blue/10 border-foursys-blue/30'
                    : `bg-foursys-surface/40 ${unit.color} hover:bg-foursys-surface/60`
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                    style={{ backgroundColor: unit.dot.replace('bg-', '').replace('-400', ''), boxShadow: `0 0 6px ${unit.glow}` }}
                  >
                    <div className={`w-2 h-2 rounded-full ${unit.dot}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-foursys-text leading-tight">{unit.name}</span>
                      {unit.highlight && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-foursys-blue/20 border border-foursys-blue/30 text-foursys-blue font-bold uppercase tracking-wider">
                          Sede
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-foursys-text-dim mt-0.5">{unit.city}</div>
                    <div className="text-[11px] text-foursys-text-dim/70 leading-relaxed whitespace-pre-line">
                      {unit.address}
                    </div>
                    {unit.phone && (
                      <div className="flex items-center gap-1 mt-1">
                        <Phone size={9} className="text-foursys-text-dim/50" />
                        <span className="text-[10px] text-foursys-text-dim/60">{unit.phone}</span>
                      </div>
                    )}
                  </div>

                  <span className="text-base flex-shrink-0">{unit.flag}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Timeline de trajetória ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-5 md:p-6 rounded-2xl bg-foursys-surface/40 border border-white/10"
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-5">
            Nossa trajetória é de crescimento e adaptação ao mercado global
          </div>

          {/* Desktop: horizontal */}
          <div className="hidden sm:flex items-start gap-0">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex-1 relative">
                {/* Linha conectora */}
                {i < milestones.length - 1 && (
                  <div className="absolute top-[9px] left-1/2 w-full h-px bg-gradient-to-r from-[#FF6600]/60 to-[#FF6600]/20" />
                )}
                <div className="flex flex-col items-center text-center px-2">
                  <div className="w-4.5 h-4.5 rounded-full border-2 border-[#FF6600] bg-foursys-dark z-10 relative mb-2 flex-shrink-0"
                    style={{ width: '18px', height: '18px', boxShadow: '0 0 10px rgba(255,102,0,0.4)' }}
                  >
                    <div className="absolute inset-[3px] rounded-full bg-[#FF6600]" />
                  </div>
                  <div className="text-sm font-black text-[#FF6600]">{m.year}</div>
                  <div className="text-[10px] text-foursys-text-dim leading-snug mt-1 max-w-[90px]">{m.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: vertical */}
          <div className="flex flex-col gap-4 sm:hidden">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex items-start gap-4 relative">
                {i < milestones.length - 1 && (
                  <div className="absolute left-[8px] top-5 bottom-[-16px] w-px bg-gradient-to-b from-[#FF6600]/50 to-transparent" />
                )}
                <div className="w-4 h-4 rounded-full border-2 border-[#FF6600] flex-shrink-0 mt-0.5 relative z-10"
                  style={{ boxShadow: '0 0 8px rgba(255,102,0,0.4)' }}
                >
                  <div className="absolute inset-[3px] rounded-full bg-[#FF6600]" />
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
