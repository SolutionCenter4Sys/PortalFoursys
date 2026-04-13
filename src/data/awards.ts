import type { Language } from '../i18n/types'

export interface Award {
  id: string
  title: string
  subtitle: string
  years: string[]
  icon: string
  category: 'premio' | 'cultura' | 'inovacao'
  color: string
  glow: string
}

export interface Certification {
  id: string
  label: string
  fullName: string
  icon: string
}

const awardsPt: Award[] = [
  {
    id: 'colaborar-inovar',
    title: 'Colaborar para Inovar',
    subtitle: 'Reconhecimento por parceria estratégica e co-criação com clientes',
    years: ['2020', '2022', '2023', '2024'],
    icon: 'handshake',
    category: 'inovacao',
    color: 'from-amber-400 to-amber-600',
    glow: '#F59E0B',
  },
  {
    id: 'agilidade-brasil',
    title: 'Prêmio Agilidade Brasil',
    subtitle: 'Excelência em práticas ágeis e transformação organizacional',
    years: ['2024', '2025'],
    icon: 'trophy',
    category: 'premio',
    color: 'from-violet-400 to-violet-600',
    glow: '#8B5CF6',
  },
  {
    id: 'open-startups',
    title: '100 Open Startups',
    subtitle: 'Top ranking nacional em inovação aberta corporativa',
    years: ['2023', '2024'],
    icon: 'rocket',
    category: 'inovacao',
    color: 'from-cyan-400 to-cyan-600',
    glow: '#06B6D4',
  },
  {
    id: 'saude-emocional',
    title: 'Destaque Saúde Emocional',
    subtitle: 'Premiação Jungle por cuidado com bem-estar dos colaboradores',
    years: ['2022'],
    icon: 'heart',
    category: 'cultura',
    color: 'from-green-400 to-green-600',
    glow: '#22C55E',
  },
  {
    id: 'gptw',
    title: 'Great Place to Work',
    subtitle: '3,6% turnover — referência no setor de tecnologia',
    years: ['2023', '2024', '2025'],
    icon: 'star',
    category: 'cultura',
    color: 'from-orange-400 to-orange-600',
    glow: '#F97316',
  },
]

const awardsEn: Award[] = [
  {
    id: 'colaborar-inovar',
    title: 'Collaborate to Innovate',
    subtitle: 'Recognition for strategic partnership and co-creation with clients',
    years: ['2020', '2022', '2023', '2024'],
    icon: 'handshake',
    category: 'inovacao',
    color: 'from-amber-400 to-amber-600',
    glow: '#F59E0B',
  },
  {
    id: 'agilidade-brasil',
    title: 'Brazil Agility Award',
    subtitle: 'Excellence in agile practices and organizational transformation',
    years: ['2024', '2025'],
    icon: 'trophy',
    category: 'premio',
    color: 'from-violet-400 to-violet-600',
    glow: '#8B5CF6',
  },
  {
    id: 'open-startups',
    title: '100 Open Startups',
    subtitle: 'National top ranking in corporate open innovation',
    years: ['2023', '2024'],
    icon: 'rocket',
    category: 'inovacao',
    color: 'from-cyan-400 to-cyan-600',
    glow: '#06B6D4',
  },
  {
    id: 'saude-emocional',
    title: 'Emotional Health Highlight',
    subtitle: 'Jungle Award for employee well-being care',
    years: ['2022'],
    icon: 'heart',
    category: 'cultura',
    color: 'from-green-400 to-green-600',
    glow: '#22C55E',
  },
  {
    id: 'gptw',
    title: 'Great Place to Work',
    subtitle: '3.6% turnover — benchmark in the technology sector',
    years: ['2023', '2024', '2025'],
    icon: 'star',
    category: 'cultura',
    color: 'from-orange-400 to-orange-600',
    glow: '#F97316',
  },
]

const certificationsPt: Certification[] = [
  { id: 'iso-9001', label: 'ISO 9001', fullName: 'Gestão da Qualidade', icon: 'award' },
  { id: 'iso-27001', label: 'ISO 27001', fullName: 'Segurança da Informação', icon: 'lock' },
  { id: 'iso-27701', label: 'ISO 27701', fullName: 'Privacidade da Informação', icon: 'shield-check' },
  { id: 'iso-14001', label: 'ISO 14001', fullName: 'Gestão Ambiental', icon: 'sprout' },
]

const certificationsEn: Certification[] = [
  { id: 'iso-9001', label: 'ISO 9001', fullName: 'Quality Management', icon: 'award' },
  { id: 'iso-27001', label: 'ISO 27001', fullName: 'Information Security', icon: 'lock' },
  { id: 'iso-27701', label: 'ISO 27701', fullName: 'Information Privacy', icon: 'shield-check' },
  { id: 'iso-14001', label: 'ISO 14001', fullName: 'Environmental Management', icon: 'sprout' },
]

export const awards = awardsPt
export const certifications = certificationsPt

export function getAwards(lang: Language): Award[] {
  return lang === 'en' ? awardsEn : awardsPt
}

export function getCertifications(lang: Language): Certification[] {
  return lang === 'en' ? certificationsEn : certificationsPt
}
