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

export const awards: Award[] = [
  {
    id: 'colaborar-inovar',
    title: 'Colaborar para Inovar',
    subtitle: 'Reconhecimento por parceria estratégica e co-criação com clientes',
    years: ['2020', '2022', '2023', '2024'],
    icon: '🤝',
    category: 'inovacao',
    color: 'from-amber-400 to-amber-600',
    glow: '#F59E0B',
  },
  {
    id: 'agilidade-brasil',
    title: 'Prêmio Agilidade Brasil',
    subtitle: 'Excelência em práticas ágeis e transformação organizacional',
    years: ['2024', '2025'],
    icon: '🏆',
    category: 'premio',
    color: 'from-violet-400 to-violet-600',
    glow: '#8B5CF6',
  },
  {
    id: 'open-startups',
    title: '100 Open Startups',
    subtitle: 'Top ranking nacional em inovação aberta corporativa',
    years: ['2023', '2024'],
    icon: '🚀',
    category: 'inovacao',
    color: 'from-cyan-400 to-cyan-600',
    glow: '#06B6D4',
  },
  {
    id: 'saude-emocional',
    title: 'Destaque Saúde Emocional',
    subtitle: 'Premiação Jungle por cuidado com bem-estar dos colaboradores',
    years: ['2022'],
    icon: '💚',
    category: 'cultura',
    color: 'from-green-400 to-green-600',
    glow: '#22C55E',
  },
  {
    id: 'gptw',
    title: 'Great Place to Work',
    subtitle: '3,6% turnover — referência no setor de tecnologia',
    years: ['2023', '2024', '2025'],
    icon: '⭐',
    category: 'cultura',
    color: 'from-orange-400 to-orange-600',
    glow: '#F97316',
  },
]

export const certifications: Certification[] = [
  { id: 'iso-9001', label: 'ISO 9001', fullName: 'Gestão da Qualidade', icon: '🏅' },
  { id: 'iso-27001', label: 'ISO 27001', fullName: 'Segurança da Informação', icon: '🔒' },
  { id: 'iso-27701', label: 'ISO 27701', fullName: 'Privacidade da Informação', icon: '🛡️' },
  { id: 'iso-14001', label: 'ISO 14001', fullName: 'Gestão Ambiental', icon: '🌱' },
]
