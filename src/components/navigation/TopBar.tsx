import { Search, Maximize2, Minimize2, ChevronLeft, ChevronRight, BarChart2, X, Building2, Menu } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getTrailById } from '../../data/trails'
import { getClientById } from '../../data/clients'
import type { AppSection } from '../../types'

export function TopBar() {
  const {
    state,
    navigate,
    openSearch,
    toggleFullscreen,
    toggleMetricsPanel,
    stopTrail,
    toggleClientSelector,
    toggleMenu,
    activeNavigationItems,
  } = useApp()

  const currentNav    = activeNavigationItems.find(n => n.id === state.currentSection)
  const currentIndex  = activeNavigationItems.findIndex(n => n.id === state.currentSection)
  const prevSection   = activeNavigationItems[currentIndex - 1]
  const nextSection   = activeNavigationItems[currentIndex + 1]
  const activeClient  = state.activeClientId ? getClientById(state.activeClientId) : null
  const currentTrail  = state.currentTrailId ? getTrailById(state.currentTrailId) : null
  const trailProgress = currentTrail
    ? currentTrail.steps.filter(s => state.trailVisitedSections.includes(s.sectionId)).length
    : 0

  return (
    <header className={`
      flex items-center gap-2 px-3 md:px-4 py-2.5 border-b border-white/[0.06]
      bg-foursys-dark-2/80 backdrop-blur-xl transition-all duration-300 flex-shrink-0
      pt-[max(0.625rem,env(safe-area-inset-top))]
      ${state.isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
    `}>

      {/* Hambúrguer — visível apenas em mobile */}
      <button
        onClick={toggleMenu}
        className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text transition-colors flex-shrink-0"
        title="Menu"
        aria-label="Abrir menu"
      >
        <Menu size={18} />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm min-w-0 flex-1 lg:flex-none">
        <span className="hidden sm:block text-foursys-text-dim text-xs uppercase tracking-widest font-semibold">
          {currentNav?.category}
        </span>
        <span className="hidden sm:block text-foursys-text-dim/50">/</span>
        <span className="text-foursys-text font-semibold truncate text-xs md:text-sm">{currentNav?.label}</span>
      </div>

      {/* Indicador de trilha ativa */}
      {currentTrail && (
        <div
          className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-semibold flex-shrink-0"
          style={{
            borderColor: `${currentTrail.colorHex}50`,
            backgroundColor: `${currentTrail.colorHex}14`,
            color: currentTrail.colorHex,
          }}
        >
          <span>{currentTrail.icon}</span>
          <span>{currentTrail.label}</span>
          <span className="opacity-70">· {trailProgress}/{currentTrail.steps.length}</span>
          <button
            onClick={stopTrail}
            className="hover:opacity-100 opacity-50 transition-opacity ml-0.5"
            title="Encerrar trilha"
          >
            <X size={11} />
          </button>
        </div>
      )}

      <div className="flex-1" />

      {/* Indicador de cliente ativo — apenas desktop */}
      {activeClient && (
        <button
          onClick={toggleClientSelector}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition-all flex-shrink-0"
          style={{
            borderColor: `${activeClient.colors.primary}50`,
            backgroundColor: `${activeClient.colors.primary}14`,
            color: activeClient.colors.primary,
          }}
        >
          <Building2 size={10} />
          <span>{activeClient.name}</span>
        </button>
      )}

      {/* Progress dots — apenas desktop */}
      <div className="hidden md:flex items-center gap-1">
        {activeNavigationItems.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id as AppSection)}
            title={item.label}
            className={`rounded-full transition-all duration-200 ${
              idx === currentIndex
                ? 'bg-foursys-blue w-4 h-1.5'
                : state.visitedSections.includes(item.id as AppSection)
                ? 'bg-foursys-blue/40 w-1.5 h-1.5'
                : 'bg-white/15 w-1.5 h-1.5'
            }`}
          />
        ))}
      </div>

      {/* Separador */}
      <div className="w-px h-4 bg-white/10 mx-0.5 hidden sm:block" />

      {/* Prev / Next */}
      <button
        onClick={() => prevSection && navigate(prevSection.id as AppSection)}
        disabled={!prevSection}
        className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:p-1.5 flex items-center justify-center rounded-lg hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        title="Anterior (←)"
      >
        <ChevronLeft size={15} />
      </button>

      <button
        onClick={() => nextSection && navigate(nextSection.id as AppSection)}
        disabled={!nextSection}
        className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:p-1.5 flex items-center justify-center rounded-lg hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        title="Próximo (→)"
      >
        <ChevronRight size={15} />
      </button>

      <div className="w-px h-4 bg-white/10 mx-0.5" />

      {/* Client selector */}
      <button
        onClick={toggleClientSelector}
        className={`min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:p-1.5 flex items-center justify-center rounded-lg transition-colors ${
          state.activeClientId
            ? 'bg-foursys-blue/15 text-foursys-blue'
            : 'hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text'
        }`}
        title="Selecionar Cliente"
      >
        <Building2 size={15} />
      </button>

      {/* Search */}
      <button
        onClick={openSearch}
        className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:p-1.5 flex items-center justify-center rounded-lg hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text transition-colors"
        title="Buscar (Ctrl+K)"
      >
        <Search size={15} />
      </button>

      {/* Analytics — visível em todos os tamanhos */}
      <button
        onClick={toggleMetricsPanel}
        className={`min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:p-1.5 flex items-center justify-center rounded-lg transition-colors ${
          state.isMetricsPanelOpen
            ? 'bg-foursys-blue/15 text-foursys-blue'
            : 'hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text'
        }`}
        title="Analytics da Sessão (Ctrl+Shift+M)"
      >
        <BarChart2 size={15} />
      </button>

      {/* Fullscreen — apenas desktop */}
      <button
        onClick={toggleFullscreen}
        className="hidden md:block p-1.5 rounded-lg hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text transition-colors"
        title="Fullscreen (F11)"
      >
        {state.isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
      </button>
    </header>
  )
}
