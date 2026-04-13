import type { NavigationItem } from '../types'
import type { Language } from '../i18n/types'

const navigationItemsPt: NavigationItem[] = [
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

const navigationItemsEn: NavigationItem[] = [
  // ── Home ───────────────────────────────────────────────────────────────────
  {
    id: 'home',
    label: 'Home',
    icon: 'home',
    category: 'Home',
    description: '26 years transforming business with technology',
  },

  // ── About Us ───────────────────────────────────────────────────────────────
  {
    id: 'identity',
    label: 'Who We Are',
    icon: 'star',
    category: 'About Us',
    description: 'KPIs, mission and Foursys positioning',
  },
  {
    id: 'global',
    label: 'Global Presence',
    icon: 'globe',
    category: 'About Us',
    description: 'Brazil, United States and Portugal',
  },
  {
    id: 'timeline',
    label: 'Our Journey',
    icon: 'calendar',
    category: 'About Us',
    description: 'Evolution and milestones — 26 years of delivery',
  },
  {
    id: 'why-foursys',
    label: 'Why Foursys?',
    icon: 'award',
    category: 'About Us',
    description: 'Competitive advantages that make us the right choice',
  },

  // ── Solutions & Services ───────────────────────────────────────────────────
  {
    id: 'offers-flagship',
    label: 'Key Solutions',
    icon: 'rocket',
    category: 'Solutions & Services',
    description: 'AI Squad, Modernization, Cybersecurity, FourBlox and Quality & AI Testing',
  },
  {
    id: 'services',
    label: 'Service Lines',
    icon: 'layout-grid',
    category: 'Solutions & Services',
    description: 'What we do, for whom and what problem we solve',
  },
  {
    id: 'delivery',
    label: 'Delivery Framework',
    icon: 'package',
    category: 'Solutions & Services',
    description: 'Projects, Squads, Staff Aug, AMS and AI Squads',
  },
  {
    id: 'alliances',
    label: 'Strategic Alliances',
    icon: 'network',
    category: 'Solutions & Services',
    description: 'Adobe, AWS, Databricks, Digibee, Google Cloud, Intel, Microsoft, Pega, Snowflake',
  },
  {
    id: 'innovation',
    label: 'Innovation',
    icon: 'sparkles',
    category: 'Solutions & Services',
    description: 'Global trends in AI, Cloud, CX, Cyber and Data & Analytics',
  },

  // ── Proof Points ───────────────────────────────────────────────────────────
  {
    id: 'cases',
    label: 'Success Stories',
    icon: 'trophy',
    category: 'Proof Points',
    description: 'Measurable results in Healthcare, Financial and Insurance',
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: 'message-circle',
    category: 'Proof Points',
    description: 'What our clients say about partnering with Foursys',
  },
  {
    id: 'awards',
    label: 'Awards',
    icon: 'award',
    category: 'Proof Points',
    description: 'Awards, certifications and recognitions that validate our delivery',
  },
  {
    id: 'clients-showcase',
    label: 'Our Clients',
    icon: 'briefcase',
    category: 'Proof Points',
    description: 'Companies that trust Foursys across 3 regions worldwide',
  },
  {
    id: 'capabilities',
    label: 'Technical Capabilities',
    icon: 'code',
    category: 'Proof Points',
    description: 'Stack, methods and expertise by area',
  },

  // ── ESG ────────────────────────────────────────────────────────────────────
  {
    id: 'esg',
    label: 'FourLives — ESG',
    icon: 'leaf',
    category: 'ESG',
    description: 'Technology that transforms lives — social impact and sustainability',
  },

  // ── Reference ──────────────────────────────────────────────────────────────
  {
    id: 'insights',
    label: 'Insights',
    icon: 'file-text',
    category: 'Reference',
    description: 'Thought leadership and strategic technology perspectives',
  },
  {
    id: 'faq',
    label: 'FAQ',
    icon: 'help-circle',
    category: 'Reference',
    description: 'Common questions and how we answer them',
  },
  {
    id: 'export-pdf',
    label: 'Export to PDF',
    icon: 'file-down',
    category: 'Reference',
    description: 'Select sections, subsections or specific items to generate a PDF',
  },
]

const sectionCategoriesPt = [
  'Início',
  'Institucional',
  'Ofertas e Serviços',
  'Provas',
  'ESG',
  'Referência',
]

const sectionCategoriesEn = [
  'Home',
  'About Us',
  'Solutions & Services',
  'Proof Points',
  'ESG',
  'Reference',
]

export function getNavigationItems(lang: Language): NavigationItem[] {
  return lang === 'en' ? navigationItemsEn : navigationItemsPt
}

export function getSectionCategories(lang: Language): string[] {
  return lang === 'en' ? sectionCategoriesEn : sectionCategoriesPt
}

export const navigationItems = navigationItemsPt
export const sectionCategories = sectionCategoriesPt
