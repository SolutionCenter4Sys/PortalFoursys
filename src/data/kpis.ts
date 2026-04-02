import type { KPI, TimelineItem } from '../types'

export const heroStats = {
  years: 26,
  projects: '500K+',
  cities: '7',
  turnover: '3,6%',
  sla: '99,9%',
  continents: 2,
}

export const kpis: KPI[] = [
  {
    value: 26,
    suffix: '',
    label: 'Anos de Mercado',
    description: 'Transformando negócios desde 2000'
  },
  {
    value: 500,
    suffix: 'K+',
    label: 'Projetos Entregues',
    description: 'Em múltiplos setores e países'
  },
  {
    value: 150,
    suffix: '+',
    label: 'Clientes Atendidos',
    description: 'Incluindo os maiores do Brasil e exterior'
  },
  {
    value: 7,
    suffix: '',
    label: 'Cidades com Escritórios',
    description: 'São Paulo, Barueri, Curitiba, Rio, Boca Raton, Lisboa e Inovabra'
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

export const timeline: TimelineItem[] = [
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
    year: '2015',
    title: 'Escritório nos EUA — operação global',
    description: 'Expansão internacional com projetos para clientes globais, levando a expertise brasileira para o mercado americano.',
    highlight: true,
    icon: 'globe',
    era: 'Crescimento',
    kpi: { value: '2', label: 'continentes' },
  },
  {
    year: '2018',
    title: 'Presença na Europa e expansão global',
    description: 'Operação consolidada em Portugal, com escritórios em 7 cidades e projetos internacionais em 2 continentes.',
    icon: 'globe',
    era: 'Expansão Global',
    kpi: { value: '7', label: 'cidades' },
  },
  {
    year: '2020',
    title: 'Portfólio Cloud, Dados & IA',
    description: 'Lançamento de novas linhas de serviço em cloud, engenharia de dados e inteligência artificial. Parcerias com AWS e Databricks.',
    highlight: true,
    icon: 'cloud',
    era: 'Expansão Global',
    kpi: { value: '3x', label: 'crescimento em IA' },
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
    year: '2024',
    title: 'Agentes IA Híbridos — pioneiros no Brasil',
    description: 'Primeira empresa brasileira a entregar soluções produtivas com agentes IA híbridos, combinando autonomia de IA com expertise humana.',
    highlight: true,
    icon: 'brain-circuit',
    era: 'Inovação',
    kpi: { value: '1ª', label: 'do Brasil em agentes' },
  },
  {
    year: '2026',
    title: 'AI First com ROI em 4–6 semanas',
    description: 'Oferta AI First homologada por grandes instituições financeiras. Framework Quality AI operando em escala com retorno mensurável.',
    highlight: true,
    icon: 'star',
    era: 'Futuro',
    kpi: { value: '4–6', label: 'semanas para ROI' },
  },
]
