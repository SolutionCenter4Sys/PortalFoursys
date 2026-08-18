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
  component: 'client-opening' | 'client-insights' | 'client-cases' | 'client-extra-1' | 'client-extra-2'
}

export interface ClientPartnership {
  contractSince: string
  contractLabel: string
  contractDescription: string
  bigNumbers: { value: string; label: string }[]
  actionAreasTitle: string
  actionAreas: string[]
  alliancesTitle?: string
  alliances?: string[]
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
  partnership?: ClientPartnership
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
  image?: string
  overview?: string
  detail?: {
    context: string
    delivery: string
    technicalDetails: string
    challengesOvercome: string
    successFactors?: string
    businessImpact?: string[]
    dimensions?: { features?: string; months?: string; hours?: string }
    keyMetrics?: { value: string; label: string }[]
    profiles?: string[]
    responsibles?: string[]
  }
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


// ─── Portfólio 2026 S2 ────────────────────────────────────────────────────────

/** Classificação da Linha Mestra: vitrine abre a conversa, motor sustenta o ticket. */
export type PortfolioRole = 'diferenciacao' | 'capacidade'

/** Status de lastro de um número ou case, definido pelos kits comerciais. */
export type EvidenceStatus = 'liberado' | 'em-validacao' | 'sem-lastro'

export interface PortfolioAxis {
  id: string
  number: number
  name: string
  role: PortfolioRole
  promise: string
  audience: string
  color: string
  icon: string
  /** Ofertas nomeadas na Linha Mestra que ainda não têm kit detalhado no ciclo. */
  upcomingOffers?: string[]
}

export interface PortfolioPhase {
  name: string
  duration: string
  focus: string
}

export interface PortfolioMarketStat {
  stat: string
  source: string
}

export interface PortfolioDifferential {
  title: string
  detail: string
}

export interface PortfolioPersonaFit {
  role: string
  value: string
}

export interface PortfolioProof {
  status: EvidenceStatus
  note: string
  cases?: string[]
}

export interface PortfolioOffer {
  id: string
  code: string
  axisId: string
  role: PortfolioRole
  /** Papel especial no portfólio: âncora, rampa de entrada, delivery puxado. */
  portfolioRole?: string
  name: string
  headline: string
  tagline: string
  whatItIs: string
  pain: string
  entryTriggers?: string[]
  outcomes: string[]
  differentials: PortfolioDifferential[]
  components?: string[]
  assets?: string[]
  phases: PortfolioPhase[]
  totalDuration: string
  marketStats: PortfolioMarketStat[]
  regulatory?: string[]
  personas: PortfolioPersonaFit[]
  cta: string
  connects: string[]
  boundary?: string
  /** Como esta oferta NÃO deve ser comunicada ao cliente. */
  editorialCare?: string
  proof: PortfolioProof
  /** Onde o mesmo assunto vive na seção legada, para comparação. */
  legacyEquivalent?: { label: string; section: AppSection }
  /** Base comercial específica. Ausente = usa o padrão do bundle. */
  engagement?: PortfolioEngagement
}

/**
 * Base comercial de uma oferta.
 *
 * Valores de investimento NÃO vivem aqui: eles saem da proposta, com
 * dimensionamento aprovado. O portal expõe modelo de contratação e a orientação
 * de como conduzir a conversa — nunca um número que ninguém assinou.
 */
export interface PortfolioEngagement {
  /** Modelos de contratação aplicáveis. */
  models: string[]
  /** Dimensionamento típico, sem preço. */
  sizing: string
  /** Como conduzir a conversa de investimento. Visível só em modo apresentador. */
  investmentGuidance: string
}

export interface PortfolioPersona {
  id: string
  role: string
  concern: string
  icon: string
  color: string
  /** Códigos de oferta em ordem de abertura. */
  shortlist: string[]
}

export interface PortfolioSegment {
  id: string
  name: string
  pain: string
  /** Códigos de oferta que sobem na prioridade neste segmento. */
  priorityOffers: string[]
}

export interface PortfolioThesis {
  label: string
  sequence: string[]
  description: string
  principles: string[]
}

export interface PortfolioFutureItem {
  id: string
  name: string
  description: string
  horizon: string
  icon: string
}

export interface PortfolioAsset {
  id: string
  name: string
  description: string
  icon: string
}

export interface PortfolioBundle {
  thesis: PortfolioThesis
  axes: PortfolioAxis[]
  offers: PortfolioOffer[]
  personas: PortfolioPersona[]
  segments: PortfolioSegment[]
  futureVision: PortfolioFutureItem[]
  assets: PortfolioAsset[]
  institutionalBacking: { value: string; label: string }[]
  /** Base comercial aplicada a toda oferta que não declara a sua. */
  defaultEngagement: PortfolioEngagement
}

// ─── App Sections ─────────────────────────────────────────────────────────────

export type AppSection =
  // Institucional
  | 'home'
  | 'identity'
  | 'global'
  | 'timeline'
  | 'why-foursys'
  // Portfólio 2026 S2 (nova seção — sucessora candidata de Ofertas e Serviços)
  | 'portfolio-thesis'
  | 'portfolio-offers'
  | 'portfolio-start'
  | 'portfolio-future'
  | 'portfolio-assets'
  | 'portfolio-ecosystem'
  | 'portfolio-products'
  // Ofertas
  | 'offers-flagship'
  // Serviços
  | 'services'
  | 'delivery'
  | 'alliances'
  | 'innovation'
  | 'ai-foursys'
  // IA — sub-sessões dedicadas
  | 'kiam-comparison'
  // Provas
  | 'cases'
  | 'testimonials'
  | 'awards'
  | 'clients-showcase'
  | 'capabilities'
  | 'benchmark'
  | 'rh-talentos'
  // ESG
  | 'esg'
  // Referência
  | 'insights'
  | 'faq'
  | 'export-pdf'
  // Mídia & Reconhecimento
  | 'media'
  // Cliente (injetadas dinamicamente)
  | 'client-opening'
  | 'client-insights'
  | 'client-cases'
  | 'client-extra-1'
  | 'client-extra-2'

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

/** Quantas vezes cada oferta do portfólio foi aberta na sessão. */
export interface OfferStat {
  code: string
  name: string
  openCount: number
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
  offerStats: OfferStat[]
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
  deepDiveHint: string | null
  detailId: string | null
  searchVoiceOnOpen: boolean
}

export type AppAction =
  | { type: 'NAVIGATE'; section: AppSection; timestamp: number; detailId?: string }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'TOGGLE_MENU' }
  | { type: 'OPEN_SEARCH'; voice?: boolean }
  | { type: 'CLOSE_SEARCH' }
  | { type: 'START_TRAIL'; trailId: string; firstSection: AppSection; timestamp: number }
  | { type: 'STOP_TRAIL' }
  | { type: 'TOGGLE_METRICS_PANEL' }
  | { type: 'SET_CLIENT'; clientId: string; timestamp: number }
  | { type: 'CLEAR_CLIENT' }
  | { type: 'TOGGLE_CLIENT_SELECTOR' }
  | { type: 'TOGGLE_INTEREST'; section: AppSection }
  | { type: 'TRACK_OFFER_VIEW'; code: string; name: string }
  | { type: 'SET_PROFILE'; profile: SessionProfile }
  | { type: 'CLOSE_WIZARD' }
  | { type: 'TOGGLE_OVERVIEW' }
  | { type: 'TOGGLE_EXPORT_MODAL' }
  | { type: 'SET_DEEP_DIVE_HINT'; serviceId: string }
  | { type: 'CLEAR_DEEP_DIVE_HINT' }
  | { type: 'CLEAR_DETAIL_ID' }
