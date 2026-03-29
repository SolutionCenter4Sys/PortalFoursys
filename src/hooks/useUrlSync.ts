import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import type { AppSection } from '../types'

const VALID_SECTIONS: AppSection[] = [
  'home', 'identity', 'global', 'timeline', 'offers-flagship',
  'services', 'delivery',
  'lab-ia', 'fourmakers', 'alliances', 'cases', 'awards',
  'clients-showcase', 'capabilities', 'esg', 'insights', 'faq',
]

export function useUrlSync() {
  const { state, navigate } = useApp()

  // On mount: read URL and navigate to section if valid
  useEffect(() => {
    const path = window.location.pathname.replace(/^\//, '') || 'home'
    if (VALID_SECTIONS.includes(path as AppSection) && path !== state.currentSection) {
      navigate(path as AppSection)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // On section change: update URL
  useEffect(() => {
    const targetPath = state.currentSection === 'home' ? '/' : `/${state.currentSection}`
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath)
    }
  }, [state.currentSection])

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '') || 'home'
      if (VALID_SECTIONS.includes(path as AppSection)) {
        navigate(path as AppSection)
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [navigate])
}
