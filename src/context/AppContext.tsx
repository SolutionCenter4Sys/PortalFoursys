import { createContext, useContext, useReducer, useCallback, useMemo, type ReactNode } from 'react'
import type { AppState, AppAction, AppSection, SectionStat, NavigationItem, SessionProfile } from '../types'
import { navigationItems, sectionCategories } from '../data/navigation'
import { getTrailById } from '../data/trails'
import { getClientById } from '../data/clients'

const now = Date.now()

const initialState: AppState = {
  currentSection: 'home',
  previousSection: null,
  isFullscreen: false,
  isMenuOpen: false,
  isSearchOpen: false,
  visitedSections: ['home'],
  // Trilha
  currentTrailId: null,
  trailVisitedSections: [],
  // Analytics
  sessionStartedAt: now,
  sectionEnteredAt: now,
  sessionStats: [],
  isMetricsPanelOpen: false,
  // Cliente
  activeClientId: null,
  isClientSelectorOpen: false,
  // Interesse e perfil
  interestedSections: [],
  sessionProfile: null,
  isWizardOpen: false,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function accumulateStat(
  stats: SectionStat[],
  section: AppSection,
  seconds: number
): SectionStat[] {
  if (seconds <= 0) return stats
  const existing = stats.find(s => s.section === section)
  if (existing) {
    return stats.map(s =>
      s.section === section
        ? { ...s, visitCount: s.visitCount + 1, totalSeconds: s.totalSeconds + seconds }
        : s
    )
  }
  return [...stats, { section, visitCount: 1, totalSeconds: seconds }]
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {

    case 'NAVIGATE': {
      const secondsOnPrev = Math.round((action.timestamp - state.sectionEnteredAt) / 1000)
      const updatedStats = accumulateStat(state.sessionStats, state.currentSection, secondsOnPrev)

      let updatedTrailVisited = state.trailVisitedSections
      if (state.currentTrailId) {
        const trail = getTrailById(state.currentTrailId)
        const isTrailSection = trail?.steps.some(s => s.sectionId === action.section)
        if (isTrailSection && !updatedTrailVisited.includes(action.section)) {
          updatedTrailVisited = [...updatedTrailVisited, action.section]
        }
      }

      return {
        ...state,
        previousSection: state.currentSection,
        currentSection: action.section,
        isMenuOpen: false,
        isSearchOpen: false,
        visitedSections: state.visitedSections.includes(action.section)
          ? state.visitedSections
          : [...state.visitedSections, action.section],
        sectionEnteredAt: action.timestamp,
        sessionStats: updatedStats,
        trailVisitedSections: updatedTrailVisited,
      }
    }

    case 'START_TRAIL': {
      const secondsOnPrev = Math.round((action.timestamp - state.sectionEnteredAt) / 1000)
      const updatedStats = accumulateStat(state.sessionStats, state.currentSection, secondsOnPrev)

      return {
        ...state,
        currentTrailId: action.trailId,
        trailVisitedSections: [action.firstSection],
        previousSection: state.currentSection,
        currentSection: action.firstSection,
        visitedSections: state.visitedSections.includes(action.firstSection)
          ? state.visitedSections
          : [...state.visitedSections, action.firstSection],
        sectionEnteredAt: action.timestamp,
        sessionStats: updatedStats,
        isMenuOpen: false,
        isSearchOpen: false,
      }
    }

    case 'STOP_TRAIL':
      return { ...state, currentTrailId: null, trailVisitedSections: [] }

    case 'TOGGLE_FULLSCREEN':
      return { ...state, isFullscreen: !state.isFullscreen }

    case 'TOGGLE_MENU':
      return { ...state, isMenuOpen: !state.isMenuOpen, isSearchOpen: false }

    case 'OPEN_SEARCH':
      return { ...state, isSearchOpen: true, isMenuOpen: false }

    case 'CLOSE_SEARCH':
      return { ...state, isSearchOpen: false }

    case 'TOGGLE_METRICS_PANEL':
      return { ...state, isMetricsPanelOpen: !state.isMetricsPanelOpen }

    case 'SET_CLIENT': {
      const client = getClientById(action.clientId)
      if (!client) return state

      const secondsOnPrev = Math.round((action.timestamp - state.sectionEnteredAt) / 1000)
      const updatedStats = accumulateStat(state.sessionStats, state.currentSection, secondsOnPrev)
      const firstClientSection = client.sections[0]?.id ?? 'home'

      return {
        ...state,
        activeClientId: action.clientId,
        isClientSelectorOpen: false,
        previousSection: state.currentSection,
        currentSection: firstClientSection,
        visitedSections: state.visitedSections.includes(firstClientSection)
          ? state.visitedSections
          : [...state.visitedSections, firstClientSection],
        sectionEnteredAt: action.timestamp,
        sessionStats: updatedStats,
        isMenuOpen: false,
        isSearchOpen: false,
      }
    }

    case 'CLEAR_CLIENT':
      return {
        ...state,
        activeClientId: null,
        isClientSelectorOpen: false,
        currentSection: 'home',
        previousSection: state.currentSection,
      }

    case 'TOGGLE_CLIENT_SELECTOR':
      return { ...state, isClientSelectorOpen: !state.isClientSelectorOpen }

    case 'TOGGLE_INTEREST': {
      const already = state.interestedSections.includes(action.section)
      return {
        ...state,
        interestedSections: already
          ? state.interestedSections.filter(s => s !== action.section)
          : [...state.interestedSections, action.section],
      }
    }

    case 'SET_PROFILE':
      return { ...state, sessionProfile: action.profile, isWizardOpen: false }

    case 'CLOSE_WIZARD':
      return { ...state, isWizardOpen: false }

    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState
  navigate: (section: AppSection) => void
  toggleFullscreen: () => void
  toggleMenu: () => void
  openSearch: () => void
  closeSearch: () => void
  startTrail: (trailId: string) => void
  stopTrail: () => void
  toggleMetricsPanel: () => void
  setClient: (clientId: string) => void
  clearClient: () => void
  toggleClientSelector: () => void
  toggleInterest: (section: AppSection) => void
  setProfile: (profile: SessionProfile) => void
  closeWizard: () => void
  // Helpers derivados
  getSectionLabel: (section: AppSection) => string
  getSectionIcon: (section: AppSection) => string
  // Navegação combinada (base + cliente ativo)
  activeNavigationItems: NavigationItem[]
  activeSectionCategories: string[]
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const navigate = useCallback(
    (section: AppSection) => dispatch({ type: 'NAVIGATE', section, timestamp: Date.now() }),
    []
  )

  const startTrail = useCallback((trailId: string) => {
    const trail = getTrailById(trailId)
    if (!trail || trail.steps.length === 0) return
    dispatch({
      type: 'START_TRAIL',
      trailId,
      firstSection: trail.steps[0].sectionId,
      timestamp: Date.now(),
    })
  }, [])

  const setClient = useCallback(
    (clientId: string) => dispatch({ type: 'SET_CLIENT', clientId, timestamp: Date.now() }),
    []
  )

  const clearClient = useCallback(() => dispatch({ type: 'CLEAR_CLIENT' }), [])
  const toggleClientSelector = useCallback(() => dispatch({ type: 'TOGGLE_CLIENT_SELECTOR' }), [])
  const toggleInterest = useCallback((section: AppSection) => dispatch({ type: 'TOGGLE_INTEREST', section }), [])
  const setProfile = useCallback((profile: SessionProfile) => dispatch({ type: 'SET_PROFILE', profile }), [])
  const closeWizard = useCallback(() => dispatch({ type: 'CLOSE_WIZARD' }), [])

  // Combina navegação base com seções do cliente ativo
  const { activeNavigationItems, activeSectionCategories } = useMemo(() => {
    const client = state.activeClientId ? getClientById(state.activeClientId) : null

    if (!client) {
      return {
        activeNavigationItems: navigationItems,
        activeSectionCategories: sectionCategories,
      }
    }

    const clientNavItems: NavigationItem[] = client.sections.map(s => ({
      id: s.id,
      label: s.label,
      icon: s.icon,
      category: client.name,
      description: s.description,
    }))

    const clientCategory = client.name

    return {
      activeNavigationItems: [...navigationItems, ...clientNavItems],
      activeSectionCategories: [...sectionCategories, clientCategory],
    }
  }, [state.activeClientId])

  const getSectionLabel = useCallback(
    (section: AppSection) =>
      activeNavigationItems.find(n => n.id === section)?.label ?? section,
    [activeNavigationItems]
  )

  const getSectionIcon = useCallback(
    (section: AppSection) =>
      activeNavigationItems.find(n => n.id === section)?.icon ?? 'file-text',
    [activeNavigationItems]
  )

  const value: AppContextValue = {
    state,
    navigate,
    toggleFullscreen: () => dispatch({ type: 'TOGGLE_FULLSCREEN' }),
    toggleMenu:       () => dispatch({ type: 'TOGGLE_MENU' }),
    openSearch:       () => dispatch({ type: 'OPEN_SEARCH' }),
    closeSearch:      () => dispatch({ type: 'CLOSE_SEARCH' }),
    startTrail,
    stopTrail:        () => dispatch({ type: 'STOP_TRAIL' }),
    toggleMetricsPanel: () => dispatch({ type: 'TOGGLE_METRICS_PANEL' }),
    setClient,
    clearClient,
    toggleClientSelector,
    toggleInterest,
    setProfile,
    closeWizard,
    getSectionLabel,
    getSectionIcon,
    activeNavigationItems,
    activeSectionCategories,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
