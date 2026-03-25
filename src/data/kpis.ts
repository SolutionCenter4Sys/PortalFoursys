import type { KPI, TimelineItem } from '../types'

export const kpis: KPI[] = [
  {
    value: 25,
    suffix: '+',
    label: 'Anos de Mercado',
    description: 'Transformando negócios desde 1999'
  },
  {
    value: 800,
    suffix: '+',
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
    value: 12,
    suffix: '',
    label: 'Países com Projetos',
    description: 'Presença global em 3 continentes'
  },
  {
    value: 1200,
    suffix: '+',
    label: 'Profissionais',
    description: 'Especialistas técnicos e de negócio'
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
    year: '1999',
    title: 'Fundação da Foursys',
    description: 'Nascemos em São Paulo com foco em desenvolvimento de sistemas e consultoria tecnológica para o mercado financeiro.',
    highlight: false
  },
  {
    year: '2005',
    title: 'Expansão Financeira',
    description: 'Consolidação como parceiro estratégico dos maiores bancos e seguradoras do Brasil — setores regulados de alta criticidade.',
    highlight: false
  },
  {
    year: '2010',
    title: 'Centro de Excelência Ágil',
    description: 'Pioneiros na adoção de metodologias ágeis no Brasil, treinando centenas de equipes em Scrum e XP.',
    highlight: false
  },
  {
    year: '2015',
    title: 'Internacionalização — EUA',
    description: 'Abertura do escritório nos Estados Unidos. Início de projetos para clientes globais.',
    highlight: true
  },
  {
    year: '2018',
    title: 'Expansão Europa',
    description: 'Presença estabelecida na Europa com projetos em Portugal, Espanha e outros países.',
    highlight: false
  },
  {
    year: '2020',
    title: 'Transformação Digital',
    description: 'Lançamento do portfólio de serviços de cloud, dados e IA. Parceria estratégica com AWS e Databricks.',
    highlight: true
  },
  {
    year: '2022',
    title: 'Foursys Labs e FourMakers',
    description: 'Criação do laboratório de inovação e do programa FourMakers para aceleração de produtos digitais.',
    highlight: false
  },
  {
    year: '2024',
    title: 'Agentes IA Híbridos',
    description: 'Pioneiros no Brasil em soluções de agentes IA híbridos — combinando autonomia de IA com expertise humana.',
    highlight: true
  },
  {
    year: '2026',
    title: 'IA First & Quality IA em Escala',
    description: 'Lançamento da oferta IA First com ROI em 4–6 semanas e homologação do Framework Quality IA em instituições financeiras de grande porte.',
    highlight: true
  }
]
