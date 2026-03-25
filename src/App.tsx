import { useEffect } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { TopBar } from './components/navigation/TopBar'
import { NavigationMenu } from './components/navigation/NavigationMenu'
import { SearchOverlay } from './components/navigation/SearchOverlay'
import { SessionPanel } from './components/session/SessionPanel'
import { SessionWizard } from './components/session/SessionWizard'
import { SectionRenderer } from './components/SectionRenderer'
import { ClientSelector } from './components/client/ClientSelector'
import { useKeyboard } from './hooks/useKeyboard'

function AppInner() {
  const { state, toggleFullscreen, toggleMetricsPanel } = useApp()
  useKeyboard()

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault()
        toggleFullscreen()
      }
      // Ctrl+Shift+M — Analytics panel
      if (e.key === 'M' && e.ctrlKey && e.shiftKey) {
        e.preventDefault()
        toggleMetricsPanel()
      }
    }
    window.addEventListener('keydown', handleKeys)
    return () => window.removeEventListener('keydown', handleKeys)
  }, [toggleFullscreen, toggleMetricsPanel])

  return (
    <div className="flex h-screen overflow-hidden bg-foursys-dark-2">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 -left-60 w-[500px] h-[500px] bg-foursys-blue/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-foursys-blue/6 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-foursys-blue/4 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-foursys-cyan/4 rounded-full blur-3xl" />
      </div>

      {/* Sidebar — sempre visível (oculta em fullscreen) */}
      {!state.isFullscreen && <NavigationMenu />}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
        <TopBar />
        <main className="flex-1 relative overflow-hidden">
          <SectionRenderer />
        </main>
      </div>

      {/* Overlays */}
      <SearchOverlay />
      <SessionPanel />
      <ClientSelector />
      <SessionWizard />

      {/* Fullscreen click-to-exit hint */}
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
