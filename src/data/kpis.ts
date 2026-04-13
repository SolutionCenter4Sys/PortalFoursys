import type { KPI, TimelineItem } from '../types'
import type { Language } from '../i18n/types'

export const heroStats = {
  years: 26,
  projects: '30K+',
  cities: '8',
  turnover: '3,6%',
  sla: '99,9%',
  continents: 4,
}

const heroStatsEn = {
  years: 26,
  projects: '30K+',
  cities: '8',
  turnover: '3.6%',
  sla: '99.9%',
  continents: 4,
}

const kpisPt: KPI[] = [
  {
    value: 26,
    suffix: '',
    label: 'Anos de Mercado',
    description: 'Transformando negócios desde 2000'
  },
  {
    value: 30,
    suffix: 'K+',
    label: 'Projetos Entregues',
    description: 'Em múltiplos setores e países'
  },
  {
    value: 150,
    suffix: '+',
    label: 'Clientes Atendidos',
    description: 'Incluindo os maiores líderes globais de cada segmento'
  },
  {
    value: 8,
    suffix: '',
    label: 'Cidades com Escritórios',
    description: 'São Paulo, Barueri, Curitiba, Rio, Boca Raton, Lisboa, Inovabra e Tel Aviv'
  },
  {
    value: 3.6,
    suffix: '%',
    label: 'Turnover',
    description: 'Retenção 6x superior à média do mercado de TI'
  },
  {
    value: 98,
    suffix: '%',
    label: 'NPS de Clientes',
    description: 'Satisfação comprovada por dados'
  }
]

const kpisEn: KPI[] = [
  {
    value: 26,
    suffix: '',
    label: 'Years in Market',
    description: 'Transforming businesses since 2000'
  },
  {
    value: 30,
    suffix: 'K+',
    label: 'Projects Delivered',
    description: 'Across multiple industries and countries'
  },
  {
    value: 150,
    suffix: '+',
    label: 'Clients Served',
    description: 'Including top global leaders in each segment'
  },
  {
    value: 8,
    suffix: '',
    label: 'Office Locations',
    description: 'São Paulo, Barueri, Curitiba, Rio, Boca Raton, Lisbon, Inovabra and Tel Aviv'
  },
  {
    value: 3.6,
    suffix: '%',
    label: 'Turnover',
    description: '6x better than IT industry average'
  },
  {
    value: 98,
    suffix: '%',
    label: 'Client NPS',
    description: 'Data-driven satisfaction score'
  }
]

const timelinePt: TimelineItem[] = [
  {
    year: '2000',
    title: 'Nasce a Foursys em São Paulo',
    description: 'Consultoria focada em sistemas críticos para o mercado financeiro — onde erro não é opção.',
    icon: 'rocket',
    era: 'Origem',
    kpi: { value: '1º', label: 'cliente financeiro' },
  },
  {
    year: '2005',
    title: 'Top-10 bancos do Brasil como clientes',
    description: 'Consolidação como parceiro estratégico em setores regulados de alta criticidade — bancos, seguradoras e financeiras.',
    icon: 'landmark',
    era: 'Origem',
    kpi: { value: '5+', label: 'grandes bancos' },
  },
  {
    year: '2010',
    title: 'Pioneiros em agilidade no Brasil',
    description: 'Primeiro centro de excelência ágil do setor, treinando centenas de equipes em Scrum e XP antes de ser mainstream.',
    icon: 'zap',
    era: 'Crescimento',
    kpi: { value: '200+', label: 'equipes treinadas' },
  },
  {
    year: '2018',
    title: 'Escritório nos EUA — operação global',
    description: 'Expansão internacional com projetos para clientes globais, levando a expertise brasileira para o mercado americano.',
    highlight: true,
    icon: 'globe',
    era: 'Crescimento',
    kpi: { value: '2', label: 'regiões do globo' },
  },
  {
    year: '2020',
    title: 'Transformação Digital Acelerada',
    description: 'Expansão das capacidades de delivery com novas frentes tecnológicas, acelerando a transformação digital dos clientes em setores regulados.',
    highlight: true,
    icon: 'cloud',
    era: 'Expansão Global',
    kpi: { value: '3x', label: 'crescimento em delivery' },
  },
  {
    year: '2022',
    title: 'Lab de Inovação e FourMakers',
    description: 'Criação do laboratório de inovação para PoCs aceleradas e do programa FourMakers para capacitação e aceleração de produtos.',
    icon: 'flask',
    era: 'Inovação',
    kpi: { value: '30+', label: 'PoCs entregues' },
  },
  {
    year: '2023',
    title: 'Presença na Europa — Lisboa',
    description: 'Abertura do escritório em Lisboa, Portugal, consolidando a presença da Foursys em 4 regiões do globo e ampliando o alcance para o mercado europeu.',
    icon: 'globe',
    era: 'Expansão Global',
    kpi: { value: '4', label: 'regiões do globo' },
  },
  {
    year: '2024',
    title: 'Equipes Híbridas com Agentes de IA',
    description: 'Adoção de modelos de entrega com equipes híbridas, combinando profissionais humanos e agentes de IA para acelerar resultados com governança.',
    highlight: true,
    icon: 'brain-circuit',
    era: 'Inovação',
    kpi: { value: 'Híbrido', label: 'humano + IA' },
  },
  {
    year: '2026',
    title: 'Cibersegurança e Qualidade & Testes com IA',
    description: 'Oferta de Cibersegurança com proteção e conformidade para setores regulados. Framework Qualidade & Testes com IA operando em escala com retorno mensurável.',
    highlight: true,
    icon: 'star',
    era: 'Futuro',
    kpi: { value: '4–6', label: 'semanas para ROI' },
  },
]

const timelineEn: TimelineItem[] = [
  {
    year: '2000',
    title: 'Foursys is born in São Paulo',
    description: 'Consultancy focused on mission-critical systems for the financial market — where failure is not an option.',
    icon: 'rocket',
    era: 'Origin',
    kpi: { value: '1º', label: 'financial client' },
  },
  {
    year: '2005',
    title: 'Top-10 banks in Brazil as clients',
    description: 'Consolidation as a strategic partner in highly regulated, mission-critical industries — banks, insurers and financial firms.',
    icon: 'landmark',
    era: 'Origin',
    kpi: { value: '5+', label: 'major banks' },
  },
  {
    year: '2010',
    title: 'Agile pioneers in Brazil',
    description: 'First agile center of excellence in the sector, training hundreds of teams in Scrum and XP before it went mainstream.',
    icon: 'zap',
    era: 'Growth',
    kpi: { value: '200+', label: 'teams trained' },
  },
  {
    year: '2018',
    title: 'US office — global operations',
    description: 'International expansion with projects for global clients, bringing Brazilian expertise to the American market.',
    highlight: true,
    icon: 'globe',
    era: 'Growth',
    kpi: { value: '2', label: 'global regions' },
  },
  {
    year: '2020',
    title: 'Accelerated Digital Transformation',
    description: 'Expansion of delivery capabilities with new technology fronts, accelerating client digital transformation in regulated industries.',
    highlight: true,
    icon: 'cloud',
    era: 'Global Expansion',
    kpi: { value: '3x', label: 'delivery growth' },
  },
  {
    year: '2022',
    title: 'Innovation Lab and FourMakers',
    description: 'Creation of the innovation lab for accelerated PoCs and the FourMakers program for product enablement and acceleration.',
    icon: 'flask',
    era: 'Innovation',
    kpi: { value: '30+', label: 'PoCs delivered' },
  },
  {
    year: '2023',
    title: 'European presence — Lisbon',
    description: 'Opening of the Lisbon, Portugal office, consolidating Foursys presence across 4 global regions and expanding reach to the European market.',
    icon: 'globe',
    era: 'Global Expansion',
    kpi: { value: '4', label: 'global regions' },
  },
  {
    year: '2024',
    title: 'Hybrid Teams with AI Agents',
    description: 'Adoption of delivery models with hybrid teams, combining human professionals and AI agents to accelerate results with governance.',
    highlight: true,
    icon: 'brain-circuit',
    era: 'Innovation',
    kpi: { value: 'Hybrid', label: 'human + AI' },
  },
  {
    year: '2026',
    title: 'Cybersecurity and Quality & AI Testing',
    description: 'Cybersecurity offering with protection and compliance for regulated industries. Quality & AI Testing framework operating at scale with measurable ROI.',
    highlight: true,
    icon: 'star',
    era: 'Future',
    kpi: { value: '4–6', label: 'weeks to ROI' },
  },
]

export function getHeroStats(lang: Language) {
  return lang === 'en' ? heroStatsEn : heroStats
}

export function getKpis(lang: Language): KPI[] {
  return lang === 'en' ? kpisEn : kpisPt
}

export function getTimeline(lang: Language): TimelineItem[] {
  return lang === 'en' ? timelineEn : timelinePt
}

export const kpis = kpisPt
export const timeline = timelinePt
