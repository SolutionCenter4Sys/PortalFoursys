import type { NavigationItem } from '../types'

export const navigationItems: NavigationItem[] = [
  // ── Início ─────────────────────────────────────────────────────────────────
  {
    id: 'home',
    label: 'Início',
    icon: '🏠',
    category: 'Início',
    description: '26 anos transformando negócios com tecnologia',
  },

  // ── Institucional ──────────────────────────────────────────────────────────
  {
    id: 'identity',
    label: 'Quem Somos',
    icon: '🌟',
    category: 'Institucional',
    description: 'KPIs, missão e posicionamento da Foursys',
  },
  {
    id: 'timeline',
    label: 'Nossa Trajetória',
    icon: '📅',
    category: 'Institucional',
    description: 'Evolução e marcos históricos — 26 anos de entrega',
  },
  {
    id: 'global',
    label: 'Presença Global',
    icon: '🌎',
    category: 'Institucional',
    description: 'Brasil, Estados Unidos e Portugal',
  },

  // ── Ofertas ────────────────────────────────────────────────────────────────
  {
    id: 'offers-flagship',
    label: 'Ofertas Flagship',
    icon: '🚀',
    category: 'Ofertas',
    description: 'AI-Augmented Squad, Modernização, IA First, FourBlox e Quality IA',
  },

  // ── Serviços ───────────────────────────────────────────────────────────────
  {
    id: 'services',
    label: 'Linhas de Serviço',
    icon: '⚙️',
    category: 'Serviços',
    description: 'O que fazemos, para quem e que problema resolve',
  },
  {
    id: 'delivery',
    label: 'Estrutura de Delivery',
    icon: '📦',
    category: 'Serviços',
    description: 'Projetos, Squads, Alocação, AMS e AI-Augmented Squads',
  },
  {
    id: 'sdd-legacy',
    label: 'Modernização de Legado',
    icon: '🔄',
    category: 'Serviços',
    description: 'Do core ao cloud, sem trauma — modernização por ondas',
  },
  {
    id: 'cyber-security',
    label: 'Cyber Security',
    icon: '🛡️',
    category: 'Serviços',
    description: 'Resiliência e identidade no centro da proteção',
  },
  {
    id: 'fourblock',
    label: 'FourBlox',
    icon: '⬛',
    category: 'Serviços',
    description: 'Produtos digitais por assinatura, prontos para escalar',
  },

  // ── Inovação ───────────────────────────────────────────────────────────────
  {
    id: 'lab-ia',
    label: 'Lab IA + Agentes',
    icon: '🤖',
    category: 'Inovação',
    description: 'Laboratório de IA e agentes híbridos Foursys',
  },
  {
    id: 'fourmakers',
    label: 'FourMakers',
    icon: '🛠️',
    category: 'Inovação',
    description: 'Comunidade e programa de inovação aberta',
  },
  {
    id: 'alliances',
    label: 'Alianças Estratégicas',
    icon: '🤝',
    category: 'Inovação',
    description: 'Microsoft, AWS, Google Cloud, SAP, Oracle, Salesforce e mais',
  },

  // ── Provas ─────────────────────────────────────────────────────────────────
  {
    id: 'cases',
    label: 'Cases de Sucesso',
    icon: '🏆',
    category: 'Provas',
    description: 'Resultados mensuráveis em Saúde, Financeiro e Seguros',
  },
  {
    id: 'awards',
    label: 'Premiações',
    icon: '🏅',
    category: 'Provas',
    description: 'Prêmios, certificações e reconhecimentos que validam nossa entrega',
  },
  {
    id: 'clients-showcase',
    label: 'Nossos Clientes',
    icon: '🏢',
    category: 'Provas',
    description: 'Empresas que confiam na Foursys em 3 continentes',
  },
  {
    id: 'capabilities',
    label: 'Capacidades Técnicas',
    icon: '💡',
    category: 'Provas',
    description: 'Stack, métodos e expertise por área',
  },

  // ── ESG ────────────────────────────────────────────────────────────────────
  {
    id: 'esg',
    label: 'FourLives — ESG',
    icon: '🌱',
    category: 'ESG',
    description: 'Tecnologia que transforma vidas — impacto social e sustentabilidade',
  },

  // ── Referência ─────────────────────────────────────────────────────────────
  {
    id: 'insights',
    label: 'Insights',
    icon: '📝',
    category: 'Referência',
    description: 'Thought leadership e visões estratégicas sobre tecnologia',
  },
  {
    id: 'faq',
    label: 'Perguntas Frequentes',
    icon: '💬',
    category: 'Referência',
    description: 'Perguntas clássicas e como respondemos',
  },
]

export const sectionCategories = [
  'Início',
  'Institucional',
  'Ofertas',
  'Serviços',
  'Inovação',
  'Provas',
  'ESG',
  'Referência',
]
