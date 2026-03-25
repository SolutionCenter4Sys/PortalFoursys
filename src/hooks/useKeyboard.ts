import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import type { AppSection } from '../types'

export function useKeyboard() {
  const { state, navigate, toggleFullscreen, openSearch, toggleMenu, activeNavigationItems } = useApp()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const idx = activeNavigationItems.findIndex(n => n.id === state.currentSection)

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        openSearch()
        return
      }

      if (e.key === 'F11' || (e.key === 'f' && e.ctrlKey)) {
        e.preventDefault()
        toggleFullscreen()
        return
      }

      if (e.key === 'Escape') {
        toggleMenu()
        return
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        const next = activeNavigationItems[idx + 1]
        if (next) navigate(next.id as AppSection)
        return
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = activeNavigationItems[idx - 1]
        if (prev) navigate(prev.id as AppSection)
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.currentSection, navigate, toggleFullscreen, openSearch, toggleMenu, activeNavigationItems])
}
