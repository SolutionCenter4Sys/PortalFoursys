export interface Section {
  id: string
  title: string
  subtitle?: string
  icon: string
  category: SectionCategory
  order: number
}

export type SectionCategory =
  | 'abertura'
  | 'institucional'
  | 'santander'
  | 'servicos'
  | 'inovacao'
  | 'cases'
  | 'faq'

export interface KPI {
  value: number
  suffix: string
  label: string
  description: string
}

export interface TimelineItem {
  year: string
  title: string
  description: string
  highlight?: boolean
}

export interface ServiceLine {
  id: string
  title: string
  subtitle: string
  problem: string
  target: string
  icon: string
  color: string
  tags: string[]
}

export interface DeliveryModel {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  highlight?: boolean
}

export interface Alliance {
  id: string
  name: string
  logo: string
  level: string
  description: string
  color: string
  bgColor: string
}

export interface CaseStudy {
  id: string
  title: string
  client: string
  sector: string
  type: string
  challenge: string
  solution: string
  stack: string[]
  results: string[]
  metric?: { value: string; label: string }
  color: string
}

export interface Capability {
  category: string
  technologies: { name: string; level: 'expert' | 'advanced' | 'solid' }[]
}

export interface FAQItem {
  id: string
  category: string
  question: string
  answer: string
  sectionLink?: string
  sectionLabel?: string
}

export interface Perception {
  id: string
  title: string
  description: string
  solution: string
  icon: string
}

export type AppSection =
  | 'opening'
  | 'identity'
  | 'global'
  | 'timeline'
  | 'santander-insights'
  | 'quality-ia'
  | 'shi-case'
  | 'services'
  | 'delivery'
  | 'sdd-legacy'
  | 'cyber-security'
  | 'fourblock'
  | 'innovation'
  | 'lab-ia'
  | 'fourmakers'
  | 'alliances'
  | 'cases'
  | 'capabilities'
  | 'faq'

export interface NavigationItem {
  id: AppSection
  label: string
  icon: string
  category: string
  description: string
}

// ─── Trilhas de Navegação ────────────────────────────────────────────────────

export interface TrailStep {
  sectionId: AppSection
  estimatedMinutes: number
}

export interface Trail {
  id: string
  label: string
  description: string
  icon: string
  duration: string
  audience: string
  color: string        // Tailwind color class base (ex: 'foursys-blue')
  colorHex: string     // Hex direto para uso em inline styles/shadows
  steps: TrailStep[]
}

// ─── Analytics de Sessão ────────────────────────────────────────────────────

export interface SectionStat {
  section: AppSection
  visitCount: number
  totalSeconds: number
}

// ─── Estado e Ações ──────────────────────────────────────────────────────────

export interface AppState {
  currentSection: AppSection
  previousSection: AppSection | null
  isFullscreen: boolean
  isMenuOpen: boolean
  isSearchOpen: boolean
  visitedSections: AppSection[]
  // Trilha ativa
  currentTrailId: string | null
  trailVisitedSections: AppSection[]
  // Analytics de sessão
  sessionStartedAt: number
  sectionEnteredAt: number
  sessionStats: SectionStat[]
  isMetricsPanelOpen: boolean
}

export type AppAction =
  | { type: 'NAVIGATE'; section: AppSection; timestamp: number }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'TOGGLE_MENU' }
  | { type: 'OPEN_SEARCH' }
  | { type: 'CLOSE_SEARCH' }
  | { type: 'START_TRAIL'; trailId: string; firstSection: AppSection; timestamp: number }
  | { type: 'STOP_TRAIL' }
  | { type: 'TOGGLE_METRICS_PANEL' }
