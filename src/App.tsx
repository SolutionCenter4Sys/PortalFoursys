import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider, useApp } from './context/AppContext'
import { TopBar } from './components/navigation/TopBar'
import { NavigationMenu } from './components/navigation/NavigationMenu'
import { SearchOverlay } from './components/navigation/SearchOverlay'
import { SessionPanel } from './components/session/SessionPanel'
import { SessionWizard } from './components/session/SessionWizard'
import { SectionRenderer } from './components/SectionRenderer'
import { ClientSelector } from './components/client/ClientSelector'
import { useKeyboard } from './hooks/useKeyboard'
import { useSwipe } from './hooks/useSwipe'
import type { AppSection } from './types'

function AppInner() {
  const { state, toggleFullscreen, toggleMetricsPanel, toggleMenu, navigate, activeNavigationItems } = useApp()
  const mainRef = useRef<HTMLDivElement>(null)
  useKeyboard()

  // Swipe hint — aparece uma única vez na primeira visita em mobile
  const [showSwipeHint, setShowSwipeHint] = useState(() => {
    return !localStorage.getItem('foursys_swipe_hint_seen')
  })

  useEffect(() => {
    if (!showSwipeHint) return
    const t = setTimeout(() => {
      setShowSwipeHint(false)
      localStorage.setItem('foursys_swipe_hint_seen', '1')
    }, 3500)
    return () => clearTimeout(t)
  }, [showSwipeHint])

  // Swipe para navegar entre seções no mobile
  const currentIndex = activeNavigationItems.findIndex(n => n.id === state.currentSection)
  useSwipe(mainRef, {
    onSwipeLeft: () => {
      setShowSwipeHint(false)
      const next = activeNavigationItems[currentIndex + 1]
      if (next) navigate(next.id as AppSection)
    },
    onSwipeRight: () => {
      setShowSwipeHint(false)
      const prev = activeNavigationItems[currentIndex - 1]
      if (prev) navigate(prev.id as AppSection)
    },
  })

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault()
        toggleFullscreen()
      }
      if (e.key === 'M' && e.ctrlKey && e.shiftKey) {
        e.preventDefault()
        toggleMetricsPanel()
      }
    }
    window.addEventListener('keydown', handleKeys)
    return () => window.removeEventListener('keydown', handleKeys)
  }, [toggleFullscreen, toggleMetricsPanel])

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-foursys-dark-2 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 -left-60 w-[500px] h-[500px] bg-foursys-blue/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-foursys-blue/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-foursys-blue/4 rounded-full blur-3xl" />
      </div>

      {/* Backdrop drawer mobile */}
      {state.isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar — desktop sempre visível / mobile: drawer deslizante */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${state.isMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${state.isFullscreen ? 'hidden' : ''}
      `}>
        <NavigationMenu />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative w-full">
        <TopBar />
        <main ref={mainRef} className="flex-1 relative overflow-y-auto overflow-x-hidden">
          <SectionRenderer />
        </main>
      </div>

      {/* Overlays */}
      <SearchOverlay />
      <SessionPanel />
      <ClientSelector />
      <SessionWizard />

      {/* Swipe hint — mobile, primeira visita */}
      <AnimatePresence>
        {showSwipeHint && (
          <motion.div
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white text-sm px-5 py-2.5 rounded-full pointer-events-none lg:hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <span>← Deslize para navegar →</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen hint */}
      {state.isFullscreen && (
        <div
          className="fixed inset-0 z-30 cursor-pointer"
          onClick={toggleFullscreen}
        >
          <div className="absolute bottom-4 right-4 text-xs text-white/30 select-none">
            Clique ou pressione ESC para sair do modo apresentação
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}

export default App
