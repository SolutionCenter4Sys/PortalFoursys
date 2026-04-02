// ─── Client System ────────────────────────────────────────────────────────────

export interface ClientInsight {
  id: string
  title: string
  description: string
  solution: string
  icon: string
}

export interface ClientCase {
  id: string
  title: string
  sector: string
  type: string
  challenge: string
  solution: string
  results: string[]
  metric?: { value: string; label: string }
  stack: string[]
}

export interface ClientSection {
  id: AppSection
  label: string
  description: string
  icon: string
  component: 'client-opening' | 'client-insights' | 'client-cases' | 'client-extra-1'
}

export interface ClientConfig {
  id: string
  name: string
  logo?: string
  colors: { primary: string; accent: string }
  tagline: string
  relationship: string
  yearsPartnership?: number
  sections: ClientSection[]
  insights?: ClientInsight[]
  cases?: ClientCase[]
  extra1?: {
    title: string
    subtitle: string
    content: unknown
  }
  extra2?: {
    title: string
    subtitle: string
    content: unknown
  }
}

// ─── Shared domain types ──────────────────────────────────────────────────────


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
  icon?: string
  era?: string
  kpi?: { value: string; label: string }
}

export interface OfferDetail {
  valueProposition: string
  metrics: { value: string; label: string }[]
  differentials: string[]
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
  offerDetail?: OfferDetail
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
  testimonial?: { quote: string; author: string; role: string }
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


// ─── App Sections ─────────────────────────────────────────────────────────────

export type AppSection =
  // Institucional
  | 'home'
  | 'identity'
  | 'global'
  | 'timeline'
  | 'why-foursys'
  // Ofertas
  | 'offers-flagship'
  // Serviços
  | 'services'
  | 'delivery'
  | 'alliances'
  | 'innovation'
  // Provas
  | 'cases'
  | 'awards'
  | 'clients-showcase'
  | 'capabilities'
  // ESG
  | 'esg'
  // Referência
  | 'insights'
  | 'faq'
  // Cliente (injetadas dinamicamente)
  | 'client-opening'
  | 'client-insights'
  | 'client-cases'
  | 'client-extra-1'

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
  color: string
  colorHex: string
  steps: TrailStep[]
}

// ─── Perfil de Sessão (Session Wizard) ───────────────────────────────────────

export interface SessionProfile {
  sector: 'financeiro' | 'saude' | 'seguros' | 'outro' | null
  role: 'ceo' | 'cfo' | 'cto' | 'diretor' | 'gestor' | null
  objective: 'apresentacao' | 'proposta' | 'demo' | null
}

// ─── Histórico de Sessões (localStorage) ─────────────────────────────────────

export interface SessionRecord {
  id: string
  date: string
  clientId: string | null
  clientName: string | null
  profileSector: string | null
  profileRole: string | null
  trailId: string | null
  durationSeconds: number
  sectionsVisited: number
  topSections: { section: AppSection; seconds: number }[]
  interestedSections: AppSection[]
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
  // Cliente ativo
  activeClientId: string | null
  isClientSelectorOpen: boolean
  // Sinais de interesse
  interestedSections: AppSection[]
  // Perfil da reunião
  sessionProfile: SessionProfile | null
  isWizardOpen: boolean
  isOverviewOpen: boolean
  isExportModalOpen: boolean
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
  | { type: 'SET_CLIENT'; clientId: string; timestamp: number }
  | { type: 'CLEAR_CLIENT' }
  | { type: 'TOGGLE_CLIENT_SELECTOR' }
  | { type: 'TOGGLE_INTEREST'; section: AppSection }
  | { type: 'SET_PROFILE'; profile: SessionProfile }
  | { type: 'CLOSE_WIZARD' }
  | { type: 'TOGGLE_OVERVIEW' }
  | { type: 'TOGGLE_EXPORT_MODAL' }
