import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'

type Unit = {
  name: string
  city: string
  address: string
  phone?: string
  main?: boolean
}

type Region = {
  id: string
  flag: string
  region: string
  count: string
  colorHex: string
  bg: string
  border: string
  textCls: string
  summary: string
  spotlight: string
  marker: {
    top: string
    left: string
  }
  stats: Array<{
    label: string
    value: string
  }>
  units: Unit[]
}

const regions: Region[] = [
  {
    id: 'brasil',
    flag: '🇧🇷',
    region: 'Brasil',
    count: '5 unidades',
    colorHex: '#22c55e',
    bg: 'from-green-500/15 to-green-600/5',
    border: 'border-green-500/30',
    textCls: 'text-green-400',
    summary: 'Base principal da operação Foursys, com presença estratégica no Sudeste e no Sul para sustentar delivery, relacionamento e inovação.',
    spotlight: 'Hub central de execução com squads locais, proximidade comercial e capacidade de expansão nacional.',
    marker: { top: '69%', left: '36.5%' },
    stats: [
      { label: 'Escritórios', value: '5 bases ativas' },
      { label: 'Clientes', value: 'Atuação enterprise nacional' },
      { label: 'Projetos', value: 'Delivery contínuo e squads dedicados' },
    ],
    units: [
      { name: 'Sede Barueri', city: 'Barueri – SP', address: 'Av. Tamboré, 267 · Torre Norte, 9º andar', phone: '(11) 4134 – 2222', main: true },
      { name: 'Unidade Paulista', city: 'São Paulo – SP', address: 'Av. Paulista, 1912 · Consolação, 15º andar', phone: '(11) 4861 – 8560' },
      { name: 'Inovabra Habitat', city: 'São Paulo – SP', address: 'Av. Angélica, 2529 · Bela Vista' },
      { name: 'Operação Sul', city: 'Curitiba – PR', address: 'R. Comendador Araújo, 499 · Batel, 10º andar', phone: '(41) 2106 – 6709' },
      { name: 'Operação Rio', city: 'Rio de Janeiro – RJ', address: 'Av. Presidente Vargas, 3131 · Cidade Nova, Sala 604' },
    ],
  },
  {
    id: 'eua',
    flag: '🇺🇸',
    region: 'Estados Unidos',
    count: '1 unidade',
    colorHex: '#3b82f6',
    bg: 'from-blue-500/15 to-blue-600/5',
    border: 'border-blue-500/30',
    textCls: 'text-blue-400',
    summary: 'Operação posicionada nas Américas para ampliar o alcance internacional da marca e apoiar frentes de relacionamento global.',
    spotlight: 'Ponto de apoio internacional com proximidade geográfica para contas globais e modelos de entrega nearshore.',
    marker: { top: '45%', left: '21.5%' },
    stats: [
      { label: 'Escritórios', value: '1 base internacional' },
      { label: 'Clientes', value: 'Expansão para contas globais' },
      { label: 'Projetos', value: 'Frentes nearshore e cross-border' },
    ],
    units: [
      { name: 'Unidade Estados Unidos', city: 'Flórida – EUA', address: '980 N. Federal Highway #110 · Boca Raton, FL 33432' },
    ],
  },
  {
    id: 'europa',
    flag: '🇵🇹',
    region: 'Europa',
    count: '1 unidade',
    colorHex: '#8b5cf6',
    bg: 'from-violet-500/15 to-violet-600/5',
    border: 'border-violet-500/30',
    textCls: 'text-violet-400',
    summary: 'Presença europeia voltada à conexão com o mercado internacional e ao fortalecimento institucional em uma praça estratégica.',
    spotlight: 'Base de relacionamento para iniciativas no exterior, com posicionamento premium e abertura para novas oportunidades.',
    marker: { top: '31%', left: '48.2%' },
    stats: [
      { label: 'Escritórios', value: '1 base em Lisboa' },
      { label: 'Clientes', value: 'Parcerias e expansão regional' },
      { label: 'Projetos', value: 'Iniciativas estratégicas internacionais' },
    ],
    units: [
      { name: 'Unidade Europa', city: 'Lisboa – Portugal', address: 'Av. da Liberdade, 110', phone: 'Tel: 1269 – 046' },
    ],
  },
]

const kpis = [
  { value: '+2K', label: 'Colaboradores', icon: '👥' },
  { value: '+500K', label: 'Projetos entregues', icon: '🚀' },
  { value: '25+', label: 'Anos de mercado', icon: '📅' },
  { value: '7', label: 'Unidades globais', icon: '🏢' },
]

const milestones = [
  { year: '2000', label: 'Empresa de software' },
  { year: '2015', label: 'Agilidade como Cultura' },
  { year: '2019', label: 'Design Orientado a Dados' },
  { year: '2022', label: 'Plataforma e Ecossistema Digital' },
  { year: '2025', label: 'Inovação com Tecnologias Disruptivas' },
]

function UnitRow({
  unit,
  colorHex,
  textCls,
}: {
  unit: Unit
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
          {unit.main && (
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
        {unit.phone && (
          <div className="flex items-center gap-1 mt-0.5">
            <Phone size={8} className="text-foursys-text-dim/40 flex-shrink-0" />
            <span className={`text-[10px] ${textCls} opacity-70`}>{unit.phone}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function RegionMapMarker({
  region,
  isActive,
  onSelect,
}: {
  region: Region
  isActive: boolean
  onSelect: (regionId: string) => void
}) {
  return (
    <motion.button
      type="button"
      aria-label={`Ver detalhes da região ${region.region}`}
      onClick={() => onSelect(region.id)}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
      style={{ top: region.marker.top, left: region.marker.left }}
    >
      <span className="relative flex items-center justify-center">
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: `${region.colorHex}30`, transform: 'scale(1.9)' }}
        />
        <span
          className="relative flex items-center justify-center w-4 h-4 rounded-full border-2 border-white"
          style={{
            backgroundColor: region.colorHex,
            boxShadow: isActive ? `0 0 0 6px ${region.colorHex}30, 0 0 24px ${region.colorHex}90` : `0 0 16px ${region.colorHex}70`,
          }}
        />
      </span>
      <span
        className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border backdrop-blur-sm transition-colors ${
          isActive ? 'text-white' : 'text-foursys-text-dim'
        }`}
        style={{
          borderColor: `${region.colorHex}${isActive ? '90' : '40'}`,
          backgroundColor: isActive ? `${region.colorHex}26` : 'rgba(12, 16, 33, 0.72)',
        }}
      >
        {region.region}
      </span>
    </motion.button>
  )
}

export function SectionGlobal() {
  const [activeRegionId, setActiveRegionId] = useState(regions[0].id)

  const activeRegion = useMemo(
    () => regions.find(region => region.id === activeRegionId) ?? regions[0],
    [activeRegionId]
  )

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto">
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
              <p className="text-sm text-foursys-text-muted mt-2 max-w-2xl">
                Agora com mapa visual da presença Foursys: clique nos pontos para explorar Brasil, Estados Unidos e Europa com suas bases e contexto de atuação.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 flex-shrink-0">
              {kpis.map((kpi, index) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.07 }}
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

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_360px] gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="rounded-[28px] overflow-hidden border border-white/10 bg-foursys-dark-2/80"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,102,0,0.12),transparent_55%)] pointer-events-none" />
              <img
                src="/images/foursys-global-map.png"
                alt="Mapa-múndi com destaque para a presença global da Foursys"
                className="block w-full h-auto"
              />

              {regions.map(region => (
                <RegionMapMarker
                  key={region.id}
                  region={region}
                  isActive={activeRegion.id === region.id}
                  onSelect={setActiveRegionId}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 p-4 border-t border-white/10 bg-foursys-surface/25">
              <span className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mr-2">
                Regiões ativas
              </span>
              {regions.map(region => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => setActiveRegionId(region.id)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    activeRegion.id === region.id ? 'text-white' : 'text-foursys-text-dim'
                  }`}
                  style={{
                    borderColor: `${region.colorHex}${activeRegion.id === region.id ? '90' : '35'}`,
                    backgroundColor: activeRegion.id === region.id ? `${region.colorHex}26` : 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  {region.flag} {region.region}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            key={activeRegion.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22 }}
            className={`rounded-[28px] border bg-gradient-to-b ${activeRegion.bg} ${activeRegion.border} p-5 md:p-6 backdrop-blur-sm`}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{activeRegion.flag}</span>
                  <div>
                    <div className={`text-sm font-black uppercase tracking-[0.22em] ${activeRegion.textCls}`}>
                      {activeRegion.region}
                    </div>
                    <div className="text-xs text-foursys-text-dim mt-1">{activeRegion.count}</div>
                  </div>
                </div>
                <p className="text-sm text-foursys-text-muted leading-relaxed">{activeRegion.summary}</p>
              </div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black shrink-0"
                style={{
                  backgroundColor: `${activeRegion.colorHex}1e`,
                  color: activeRegion.colorHex,
                  border: `1px solid ${activeRegion.colorHex}45`,
                }}
              >
                {activeRegion.units.length}
              </div>
            </div>

            <div
              className="rounded-2xl border p-4 mb-4"
              style={{ borderColor: `${activeRegion.colorHex}30`, backgroundColor: `${activeRegion.colorHex}0f` }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-2">
                Destaque regional
              </p>
              <p className="text-sm text-foursys-text leading-relaxed">{activeRegion.spotlight}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3 mb-4">
              {activeRegion.stats.map(stat => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-foursys-surface/35 px-4 py-3"
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm font-semibold text-foursys-text leading-snug">{stat.value}</div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-3">
                Bases e escritórios
              </p>
              <div className="rounded-2xl border border-white/10 bg-foursys-surface/25 px-4">
                {activeRegion.units.map(unit => (
                  <UnitRow
                    key={unit.name}
                    unit={unit}
                    colorHex={activeRegion.colorHex}
                    textCls={activeRegion.textCls}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-foursys-surface/40 border border-white/10 p-5 md:p-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-5">
            Nossa trajetória é de crescimento e adaptação ao mercado global
          </p>

          <div className="hidden sm:flex items-start">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex-1 relative">
                {index < milestones.length - 1 && (
                  <div className="absolute top-[9px] left-1/2 w-full h-px bg-gradient-to-r from-[#FF6600]/70 to-[#FF6600]/20 pointer-events-none" />
                )}
                <div className="flex flex-col items-center text-center px-1">
                  <div
                    className="w-[18px] h-[18px] rounded-full border-2 border-[#FF6600] bg-foursys-dark-2 z-10 relative mb-2 flex-shrink-0 flex items-center justify-center"
                    style={{ boxShadow: '0 0 12px rgba(255,102,0,0.5)' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#FF6600]" />
                  </div>
                  <div className="text-sm font-black text-[#FF6600]">{milestone.year}</div>
                  <div className="text-[10px] text-foursys-text-dim leading-snug mt-1 max-w-[88px]">{milestone.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:hidden">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex items-start gap-4 relative">
                {index < milestones.length - 1 && (
                  <div className="absolute left-[8px] top-5 bottom-[-16px] w-px bg-gradient-to-b from-[#FF6600]/60 to-transparent" />
                )}
                <div
                  className="w-[18px] h-[18px] rounded-full border-2 border-[#FF6600] bg-foursys-dark-2 flex-shrink-0 flex items-center justify-center z-10"
                  style={{ boxShadow: '0 0 10px rgba(255,102,0,0.4)' }}
                >
                  <div className="w-2 h-2 rounded-full bg-[#FF6600]" />
                </div>
                <div>
                  <div className="text-sm font-black text-[#FF6600]">{milestone.year}</div>
                  <div className="text-xs text-foursys-text-dim leading-snug">{milestone.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
