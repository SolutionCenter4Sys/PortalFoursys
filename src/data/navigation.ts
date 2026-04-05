import type { NavigationItem } from '../types'

export const navigationItems: NavigationItem[] = [
  // ── Início ─────────────────────────────────────────────────────────────────
  {
    id: 'home',
    label: 'Início',
    icon: 'home',
    category: 'Início',
    description: '26 anos transformando negócios com tecnologia',
  },

  // ── Institucional ──────────────────────────────────────────────────────────
  {
    id: 'identity',
    label: 'Quem Somos',
    icon: 'star',
    category: 'Institucional',
    description: 'KPIs, missão e posicionamento da Foursys',
  },
  {
    id: 'global',
    label: 'Presença Global',
    icon: 'globe',
    category: 'Institucional',
    description: 'Brasil, Estados Unidos e Portugal',
  },
  {
    id: 'timeline',
    label: 'Nossa Trajetória',
    icon: 'calendar',
    category: 'Institucional',
    description: 'Evolução e marcos históricos — 26 anos de entrega',
  },
  {
    id: 'why-foursys',
    label: 'Por que a Foursys?',
    icon: 'award',
    category: 'Institucional',
    description: 'Diferenciais competitivos que nos tornam a escolha certa',
  },

  // ── Ofertas e Serviços ─────────────────────────────────────────────────────
  {
    id: 'offers-flagship',
    label: 'Principais Ofertas',
    icon: 'rocket',
    category: 'Ofertas e Serviços',
    description: 'AI Squad, Modernização, Cibersegurança, FourBlox e Qualidade & Testes com IA',
  },
  {
    id: 'services',
    label: 'Linhas de Serviço',
    icon: 'layout-grid',
    category: 'Ofertas e Serviços',
    description: 'O que fazemos, para quem e que problema resolve',
  },
  {
    id: 'delivery',
    label: 'Estrutura de Delivery',
    icon: 'package',
    category: 'Ofertas e Serviços',
    description: 'Projetos, Squads, Alocação, AMS e AI Squads',
  },
  {
    id: 'alliances',
    label: 'Alianças Estratégicas',
    icon: 'network',
    category: 'Ofertas e Serviços',
    description: 'Adobe, AWS, Databricks, Digibee, Google Cloud, Intel, Microsoft, Pega, Snowflake',
  },
  {
    id: 'innovation',
    label: 'Inovação',
    icon: 'sparkles',
    category: 'Ofertas e Serviços',
    description: 'Tendências globais em IA, Cloud, CX, Cyber e Data & Analytics',
  },

  // ── Provas ─────────────────────────────────────────────────────────────────
  {
    id: 'cases',
    label: 'Cases de Sucesso',
    icon: 'trophy',
    category: 'Provas',
    description: 'Resultados mensuráveis em Saúde, Financeiro e Seguros',
  },
  {
    id: 'testimonials',
    label: 'Depoimentos',
    icon: 'message-circle',
    category: 'Provas',
    description: 'O que nossos clientes dizem sobre a parceria com a Foursys',
  },
  {
    id: 'awards',
    label: 'Premiações',
    icon: 'award',
    category: 'Provas',
    description: 'Prêmios, certificações e reconhecimentos que validam nossa entrega',
  },
  {
    id: 'clients-showcase',
    label: 'Nossos Clientes',
    icon: 'briefcase',
    category: 'Provas',
    description: 'Empresas que confiam na Foursys em 3 regiões do globo',
  },
  {
    id: 'capabilities',
    label: 'Capacidades Técnicas',
    icon: 'code',
    category: 'Provas',
    description: 'Stack, métodos e expertise por área',
  },

  // ── ESG ────────────────────────────────────────────────────────────────────
  {
    id: 'esg',
    label: 'FourLives — ESG',
    icon: 'leaf',
    category: 'ESG',
    description: 'Tecnologia que transforma vidas — impacto social e sustentabilidade',
  },

  // ── Referência ─────────────────────────────────────────────────────────────
  {
    id: 'insights',
    label: 'Insights',
    icon: 'file-text',
    category: 'Referência',
    description: 'Thought leadership e visões estratégicas sobre tecnologia',
  },
  {
    id: 'faq',
    label: 'Perguntas Frequentes',
    icon: 'help-circle',
    category: 'Referência',
    description: 'Perguntas clássicas e como respondemos',
  },
  {
    id: 'export-pdf',
    label: 'Exportar para PDF',
    icon: 'file-down',
    category: 'Referência',
    description: 'Selecione sessões, subsessões ou itens específicos para gerar um PDF',
  },
]

export const sectionCategories = [
  'Início',
  'Institucional',
  'Ofertas e Serviços',
  'Provas',
  'ESG',
  'Referência',
]
