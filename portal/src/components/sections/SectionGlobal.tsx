import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, CalendarClock } from 'lucide-react'
import { DynIcon } from '../../utils/iconMap'
import { SectionWrapper } from '../ui/SectionWrapper'
import { useLanguage } from '../../i18n'

type Unit = {
  name: string
  city: string
  address?: string
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

type RegionContent = Pick<Region, 'region' | 'count' | 'summary' | 'spotlight' | 'stats' | 'units'>

const REGION_STYLES: Omit<Region, 'region' | 'count' | 'summary' | 'spotlight' | 'stats' | 'units'>[] = [
  { id: 'brasil', flag: 'BR', colorHex: '#22c55e', bg: 'from-green-500/15 to-green-600/5',   border: 'border-green-500/30',  textCls: 'text-green-400',  marker: { top: '69%', left: '36.5%' } },
  { id: 'eua',    flag: 'US', colorHex: '#3b82f6', bg: 'from-blue-500/15 to-blue-600/5',     border: 'border-blue-500/30',   textCls: 'text-blue-400',   marker: { top: '45%', left: '21.5%' } },
  { id: 'europa', flag: 'EU', colorHex: '#8b5cf6', bg: 'from-violet-500/15 to-violet-600/5', border: 'border-violet-500/30', textCls: 'text-violet-400', marker: { top: '31%', left: '48.2%' } },
  { id: 'israel', flag: 'IL', colorHex: '#06b6d4', bg: 'from-cyan-500/15 to-cyan-600/5',     border: 'border-cyan-500/30',   textCls: 'text-cyan-400',   marker: { top: '38%', left: '55.5%' } },
]

interface RoadmapMarker {
  id: 'china' | 'emirados'
  flag: string
  label: string
  yearLabel: string
  marker: { top: string; left: string }
}

const ROADMAP_MARKERS: RoadmapMarker[] = [
  { id: 'china',    flag: 'CN', label: 'Xangai · China',    yearLabel: '2027', marker: { top: '38%', left: '76%' } },
  { id: 'emirados', flag: 'AE', label: 'Dubai · Emirados', yearLabel: '2028', marker: { top: '46%', left: '60.5%' } },
]

const SHARED_UNITS: Record<string, Unit[]> = {
  brasil: [
    { name: 'Alphaville', city: 'Barueri – SP', address: 'Av. Tamboré, 267 · Torre Norte, 9º andar', phone: '(11) 4134 – 2222', main: true },
    { name: 'Paulista', city: 'São Paulo – SP', address: 'Av. Paulista, 1912 · Consolação, 15º andar', phone: '(11) 4861 – 8560' },
    { name: 'Inovabra Habitat', city: 'São Paulo – SP', address: 'Av. Angélica, 2529 · Bela Vista' },
  ],
}

const CONTENT: Record<string, RegionContent[]> = {
  pt: [
    {
      region: 'Brasil', count: '6 unidades',
      summary: 'Base principal da operação Foursys, com presença estratégica no Sudeste e no Sul. A partir do Brasil, atendemos também toda a América do Sul.',
      spotlight: 'Hub central de execução com squads locais, proximidade comercial e capacidade de expansão para toda a América do Sul.',
      stats: [
        { label: 'Escritórios', value: '6 bases ativas' },
        { label: 'Clientes', value: 'Atuação enterprise nacional' },
        { label: 'Projetos', value: 'Delivery contínuo e squads dedicados' },
      ],
      units: [
        ...SHARED_UNITS.brasil,
        { name: 'Operação Sul', city: 'Curitiba – PR', address: 'R. Comendador Araújo, 499 · Batel, 10º andar', phone: '(41) 2106 – 6709' },
        { name: 'Operação Rio', city: 'Rio de Janeiro – RJ', address: 'Av. Presidente Vargas, 3131 · Cidade Nova, Sala 604' },
        { name: 'Operação Belo Horizonte', city: 'Belo Horizonte – MG' },
      ],
    },
    {
      region: 'Estados Unidos', count: '1 unidade',
      summary: 'A partir da base nos Estados Unidos, atendemos toda a América do Norte — incluindo Canadá e México — ampliando o alcance internacional da marca.',
      spotlight: 'Ponto de apoio para toda a América do Norte, com proximidade geográfica para contas globais e modelos de entrega nearshore.',
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
      region: 'Europa', count: '1 unidade',
      summary: 'A partir da base em Portugal, atendemos toda a Europa — fortalecendo a conexão com o mercado internacional e o posicionamento institucional.',
      spotlight: 'Base estratégica para atender toda a Europa, com posicionamento premium e abertura para novas oportunidades no continente.',
      stats: [
        { label: 'Escritórios', value: '1 base em Lisboa' },
        { label: 'Clientes', value: 'Parcerias e expansão regional' },
        { label: 'Projetos', value: 'Iniciativas estratégicas internacionais' },
      ],
      units: [
        { name: 'Unidade Europa', city: 'Lisboa – Portugal', address: 'Av. da Liberdade, 110 · 1250-096 Lisboa' },
      ],
    },
    {
      region: 'Israel', count: '1 unidade',
      summary: 'Hub de inovação e IA aberto em 2026 em Tel Aviv. Conexão direta com o ecossistema israelense de cibersegurança e deep-tech, ampliando a Foursys para 4 regiões do globo.',
      spotlight: 'Frente de inovação focada em IA e cibersegurança, com acesso ao ecossistema deep-tech mais avançado do mundo e proximidade aos hubs europeus e do Oriente Médio.',
      stats: [
        { label: 'Escritórios', value: '1 base em Tel Aviv' },
        { label: 'Foco', value: 'Inovação · IA · Cyber · Deep-tech' },
        { label: 'Operação', value: 'Desde 2026' },
      ],
      units: [
        { name: 'Unidade Israel', city: 'Tel Aviv – Israel', address: 'Hub de inovação · 2026' },
      ],
    },
  ],
  en: [
    {
      region: 'Brazil', count: '6 units',
      summary: 'Main hub of Foursys operations, with strategic presence in Southeast and South Brazil. From Brazil, we also serve all of South America.',
      spotlight: 'Central execution hub with local squads, commercial proximity and capacity to expand across all of South America.',
      stats: [
        { label: 'Offices', value: '6 active locations' },
        { label: 'Clients', value: 'National enterprise coverage' },
        { label: 'Projects', value: 'Continuous delivery and dedicated squads' },
      ],
      units: [
        ...SHARED_UNITS.brasil,
        { name: 'Southern Operations', city: 'Curitiba – PR', address: 'R. Comendador Araújo, 499 · Batel, 10º andar', phone: '(41) 2106 – 6709' },
        { name: 'Rio Operations', city: 'Rio de Janeiro – RJ', address: 'Av. Presidente Vargas, 3131 · Cidade Nova, Sala 604' },
        { name: 'Belo Horizonte Operations', city: 'Belo Horizonte – MG' },
      ],
    },
    {
      region: 'United States', count: '1 unit',
      summary: 'From our US base, we serve all of North America — including Canada and Mexico — expanding the international reach of the brand.',
      spotlight: 'Support base for all of North America, with geographic proximity for global accounts and nearshore delivery models.',
      stats: [
        { label: 'Offices', value: '1 international location' },
        { label: 'Clients', value: 'Expansion to global accounts' },
        { label: 'Projects', value: 'Nearshore and cross-border initiatives' },
      ],
      units: [
        { name: 'United States Office', city: 'Florida – USA', address: '980 N. Federal Highway #110 · Boca Raton, FL 33432' },
      ],
    },
    {
      region: 'Europe', count: '1 unit',
      summary: 'From our base in Portugal, we serve all of Europe — strengthening connections with the international market and institutional positioning.',
      spotlight: 'Strategic base to serve all of Europe, with premium positioning and openness to new opportunities across the continent.',
      stats: [
        { label: 'Offices', value: '1 location in Lisbon' },
        { label: 'Clients', value: 'Partnerships and regional expansion' },
        { label: 'Projects', value: 'International strategic initiatives' },
      ],
      units: [
        { name: 'Europe Office', city: 'Lisbon – Portugal', address: 'Av. da Liberdade, 110 · 1250-096 Lisbon' },
      ],
    },
    {
      region: 'Israel', count: '1 unit',
      summary: 'Innovation and AI hub opened in 2026 in Tel Aviv. Direct connection to the Israeli cyber and deep-tech ecosystem, expanding Foursys across 4 global regions.',
      spotlight: 'Innovation front focused on AI and cybersecurity, with access to the world\'s most advanced deep-tech ecosystem and proximity to European and Middle Eastern hubs.',
      stats: [
        { label: 'Offices', value: '1 location in Tel Aviv' },
        { label: 'Focus', value: 'Innovation · AI · Cyber · Deep-tech' },
        { label: 'Operations', value: 'Since 2026' },
      ],
      units: [
        { name: 'Israel Office', city: 'Tel Aviv – Israel', address: 'Innovation hub · 2026' },
      ],
    },
  ],
}

function getRegions(lang: string): Region[] {
  const content = CONTENT[lang] ?? CONTENT.pt
  return REGION_STYLES.map((style, i) => ({ ...style, ...content[i] }))
}


function UnitRow({
  unit,
  colorHex,
  textCls,
  hqLabel,
}: {
  unit: Unit
  colorHex: string
  textCls: string
  hqLabel: string
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
              {hqLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={9} className="text-foursys-text-dim/50 flex-shrink-0" />
          <span className="text-[10px] text-foursys-text-dim leading-snug">{unit.city}</span>
        </div>
        {unit.address && (
          <div className="text-[10px] text-foursys-text-dim/60 leading-relaxed mt-0.5">{unit.address}</div>
        )}
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

function RoadmapPin({ pin }: { pin: RoadmapMarker }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-[5] pointer-events-none select-none"
      style={{ top: pin.marker.top, left: pin.marker.left }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-1.5">
        <span className="relative flex items-center justify-center">
          <span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: 'rgba(255,165,0,0.18)', transform: 'scale(2.0)', filter: 'blur(2px)' }}
          />
          <span
            className="relative flex items-center justify-center w-3.5 h-3.5 rounded-full border-2 border-dashed border-orange-300/80 bg-orange-400/40"
            style={{ boxShadow: '0 0 12px rgba(255,165,0,0.6)' }}
          />
        </span>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-[0.18em] uppercase bg-foursys-dark/85 border border-orange-300/40 text-orange-200">
          {pin.flag} · {pin.yearLabel}
        </span>
      </div>
    </div>
  )
}

function RegionMapMarker({
  region,
  isActive,
  onSelect,
  ariaLabel,
}: {
  region: Region
  isActive: boolean
  onSelect: (regionId: string) => void
  ariaLabel: string
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ top: region.marker.top, left: region.marker.left }}
    >
      <motion.button
        type="button"
        aria-label={`${ariaLabel} ${region.region}`}
        onClick={() => onSelect(region.id)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center gap-2"
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
    </div>
  )
}

export function SectionGlobal() {
  const { t, lang } = useLanguage()
  const regions = useMemo(() => getRegions(lang), [lang])
  const [activeRegionId, setActiveRegionId] = useState(regions[0].id)

  const activeRegion = useMemo(
    () => regions.find(region => region.id === activeRegionId) ?? regions[0],
    [activeRegionId, regions]
  )

  const globalKpis = [
    { value: '+2K', label: t('global.kpis.collaborators'), icon: 'users' },
    { value: '+30K', label: t('global.kpis.projectsDelivered'), icon: 'rocket' },
    { value: '26', label: t('global.kpis.yearsInMarket'), icon: 'calendar' },
    { value: '8', label: t('global.kpis.globalCities'), icon: 'building' },
  ]

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-primary/15 border border-foursys-primary/30 text-foursys-cyan text-xs mb-3">
            {t('global.badge')}
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foursys-text leading-tight">
                {t('global.title')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] to-[#FF9933]">
                  {t('global.titleHighlight')}
                </span>
              </h2>
              <p className="text-sm text-foursys-text-muted mt-2 max-w-2xl">
                {t('global.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 flex-shrink-0">
              {globalKpis.map((kpi, index) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.07 }}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-foursys-surface/50 border border-white/10 min-w-[80px]"
                >
                  <DynIcon name={kpi.icon} size={22} className="text-foursys-primary" />
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
                alt={t('global.mapAlt')}
                className="block w-full h-auto"
              />

              {regions.map(region => (
                <RegionMapMarker
                  key={region.id}
                  region={region}
                  isActive={activeRegion.id === region.id}
                  onSelect={setActiveRegionId}
                  ariaLabel={t('global.seeRegionDetails')}
                />
              ))}

              {ROADMAP_MARKERS.map(pin => (
                <RoadmapPin key={pin.id} pin={pin} />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 p-4 border-t border-white/10 bg-foursys-surface/25">
              <span className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mr-2">
                {t('global.activeRegions')}
              </span>
              {regions.map(region => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => setActiveRegionId(region.id)}
                  data-voz-filtro="regiao"
                  data-voz-filtro-valor={region.region}
                  data-voz-filtro-sinonimos={region.id}
                  aria-label={region.region}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 h-7 rounded-full text-xs border transition-colors ${
                    activeRegion.id === region.id ? 'text-white' : 'text-foursys-text-dim'
                  }`}
                  style={{
                    borderColor: `${region.colorHex}${activeRegion.id === region.id ? '90' : '35'}`,
                    backgroundColor: activeRegion.id === region.id ? `${region.colorHex}26` : 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <span className="text-[10px] font-bold tracking-wide opacity-60">{region.flag}</span> {region.region}
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
                  <span className={`text-3xl font-black ${activeRegion.textCls}`}>{activeRegion.flag}</span>
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
                {t('global.regionalHighlight')}
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
                {t('global.basesAndOffices')}
              </p>
              <div className="rounded-2xl border border-white/10 bg-foursys-surface/25 px-4">
                {activeRegion.units.map(unit => (
                  <UnitRow
                    key={unit.name}
                    unit={unit}
                    colorHex={activeRegion.colorHex}
                    textCls={activeRegion.textCls}
                    hqLabel={t('common.hq')}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Roadmap de expansão (China 2027 · Emirados 2028) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45 }}
          className="mt-2 rounded-2xl border border-orange-300/30 bg-gradient-to-r from-orange-500/12 via-amber-400/6 to-transparent p-5 md:p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:flex-shrink-0">
              <div className="w-11 h-11 rounded-xl bg-orange-400/15 border border-orange-300/40 flex items-center justify-center text-orange-200">
                <CalendarClock size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-200/85">
                  {lang === 'pt' ? 'Próximas frentes' : 'Upcoming fronts'}
                </div>
                <div className="text-sm md:text-base font-black text-white leading-snug">
                  {t('global.roadmap.title')}
                </div>
                <p className="text-xs text-foursys-text-dim mt-1 max-w-xl leading-relaxed">
                  {t('global.roadmap.subtitle')}
                </p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-3">
              {ROADMAP_MARKERS.map(pin => (
                <div
                  key={pin.id}
                  className="rounded-xl border border-orange-300/25 bg-foursys-surface/40 px-3 py-3 flex items-center gap-3"
                >
                  <span className="text-lg font-black text-orange-200">{pin.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{pin.label}</div>
                    <div className="text-[10px] text-foursys-text-dim uppercase tracking-wider">
                      {lang === 'pt' ? 'Início previsto' : 'Planned launch'} · {pin.yearLabel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </SectionWrapper>
  )
}
