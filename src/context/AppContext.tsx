import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react'
import type { AppState, AppAction, AppSection, SectionStat } from '../types'
import { navigationItems } from '../data/navigation'
import { getTrailById } from '../data/trails'

const now = Date.now()

const initialState: AppState = {
  currentSection: 'opening',
  previousSection: null,
  isFullscreen: false,
  isMenuOpen: false,
  isSearchOpen: false,
  visitedSections: ['opening'],
  // Trilha
  currentTrailId: null,
  trailVisitedSections: [],
  // Analytics
  sessionStartedAt: now,
  sectionEnteredAt: now,
  sessionStats: [],
  isMetricsPanelOpen: false,
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

      // Atualiza progresso na trilha ativa
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
  // Helpers derivados
  getSectionLabel: (section: AppSection) => string
  getSectionIcon: (section: AppSection) => string
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

  const getSectionLabel = useCallback(
    (section: AppSection) => navigationItems.find(n => n.id === section)?.label ?? section,
    []
  )

  const getSectionIcon = useCallback(
    (section: AppSection) => navigationItems.find(n => n.id === section)?.icon ?? '📄',
    []
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
    getSectionLabel,
    getSectionIcon,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
