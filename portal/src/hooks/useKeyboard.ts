import { useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import type { AppSection } from '../types'

function requestNativeFullscreen() {
  const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => Promise<void> }
  if (el.requestFullscreen) return el.requestFullscreen()
  if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen()
  return Promise.resolve()
}

function exitNativeFullscreen() {
  const doc = document as Document & { webkitExitFullscreen?: () => Promise<void> }
  if (document.fullscreenElement || (doc as any).webkitFullscreenElement) {
    if (doc.exitFullscreen) return doc.exitFullscreen()
    if (doc.webkitExitFullscreen) return doc.webkitExitFullscreen()
  }
  return Promise.resolve()
}

function isNativeFullscreen(): boolean {
  return !!(document.fullscreenElement || (document as any).webkitFullscreenElement)
}

export function useKeyboard() {
  const { state, navigate, toggleFullscreen, openSearch, toggleMenu, toggleMetricsPanel, toggleOverview, activeNavigationItems } = useApp()

  const handleToggleFullscreen = useCallback(async () => {
    if (isNativeFullscreen()) {
      await exitNativeFullscreen()
    } else {
      await requestNativeFullscreen()
    }
    toggleFullscreen()
  }, [toggleFullscreen])

  useEffect(() => {
    const onFullscreenChange = () => {
      const native = isNativeFullscreen()
      if (native !== state.isFullscreen) {
        toggleFullscreen()
      }
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
    }
  }, [state.isFullscreen, toggleFullscreen])

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
        handleToggleFullscreen()
        return
      }

      if (e.key === 'M' && e.ctrlKey && e.shiftKey) {
        e.preventDefault()
        toggleMetricsPanel()
        return
      }

      if (e.key === 'A' && e.ctrlKey && e.shiftKey) {
        e.preventDefault()
        toggleOverview()
        return
      }

      if (e.key === 'Escape') {
        if (state.isFullscreen) {
          handleToggleFullscreen()
        } else {
          toggleMenu()
        }
        return
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        const next = activeNavigationItems[idx + 1]
        if (next) navigate(next.id as AppSection)
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const prev = activeNavigationItems[idx - 1]
        if (prev) navigate(prev.id as AppSection)
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.currentSection, state.isFullscreen, navigate, handleToggleFullscreen, openSearch, toggleMenu, toggleMetricsPanel, toggleOverview, activeNavigationItems])
}
