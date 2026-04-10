import type { KPI, TimelineItem } from '../types'

export const heroStats = {
  years: 26,
  projects: '30K+',
  cities: '8',
  turnover: '3,6%',
  sla: '99,9%',
  continents: 3,
}

export const kpis: KPI[] = [
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
    description: 'Abertura do escritório em Lisboa, Portugal, consolidando a presença da Foursys em 3 regiões do globo e ampliando o alcance para o mercado europeu.',
    icon: 'globe',
    era: 'Expansão Global',
    kpi: { value: '3', label: 'regiões do globo' },
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
