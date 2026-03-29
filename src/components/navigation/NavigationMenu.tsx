import {
  Search,
  Home,
  Users,
  Clock,
  Globe,
  Rocket,
  LayoutGrid,
  BrainCircuit,
  Hammer,
  Network,
  Trophy,
  Code2,
  HelpCircle,
  Leaf,
  Building2,
  ScanEye,
  Zap,
  Star,
  Award,
  Briefcase,
  FileText,
  type LucideIcon,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getClientById } from '../../data/clients'
import type { AppSection } from '../../types'

// ─── Mapeamento de ícones Lucide por seção ───────────────────────────────────

const SECTION_ICONS: Record<string, LucideIcon> = {
  'home':            Home,
  'identity':        Users,
  'timeline':        Clock,
  'global':          Globe,
  'offers-flagship': Star,
  'services':        LayoutGrid,
  'delivery':        Rocket,
  'lab-ia':          BrainCircuit,
  'fourmakers':      Hammer,
  'alliances':       Network,
  'cases':           Trophy,
  'awards':          Award,
  'clients-showcase': Briefcase,
  'capabilities':    Code2,
  'esg':             Leaf,
  'insights':        FileText,
  'faq':             HelpCircle,
  // Client sections
  'client-opening':  Building2,
  'client-insights': ScanEye,
  'client-cases':    Trophy,
  'client-extra-1':  Zap,
  'client-extra-2':  Zap,
}

// ─── Cores por categoria ──────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  'Início':       'text-foursys-primary',
  'Institucional':'text-slate-400',
  'Ofertas':      'text-orange-400',
  'Serviços':     'text-foursys-primary',
  'Inovação':     'text-violet-400',
  'Provas':       'text-amber-400',
  'ESG':          'text-green-400',
  'Referência':   'text-slate-400',
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function NavigationMenu() {
  const {
    state,
    navigate,
    openSearch,
    toggleClientSelector,
    activeNavigationItems,
    activeSectionCategories,
  } = useApp()

  const activeClient = state.activeClientId ? getClientById(state.activeClientId) : null

  function handleNavigate(id: string) {
    navigate(id as AppSection)
    // O reducer NAVIGATE já define isMenuOpen: false — não chamar toggleMenu aqui
  }

  return (
    <aside aria-label="Menu principal" className="w-64 flex-shrink-0 h-full flex flex-col bg-foursys-dark border-r border-white/[0.06] overflow-hidden z-10">

      {/* ── Header — logo Foursys ── */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 mb-0.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #FF6600, #FF9933)',
              boxShadow: '0 0 16px rgba(255,102,0,0.45)',
            }}
          >
            F4
          </div>
          <span className="text-sm font-bold text-foursys-text tracking-widest">FOURSYS</span>
        </div>
        <p className="text-[10px] text-foursys-text-dim pl-11 leading-snug tracking-wide">
          Portal Institucional Navegável
        </p>
      </div>

      {/* ── Seletor de cliente ── */}
      <div className="px-3 py-2 border-b border-white/[0.06]">
        <button
          onClick={toggleClientSelector}
          className={`
            w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs transition-all duration-150
            ${state.activeClientId
              ? 'bg-foursys-primary/10 border-foursys-primary/30 text-foursys-primary'
              : 'bg-white/[0.04] border-white/[0.07] text-foursys-text-dim hover:text-foursys-text-muted hover:border-foursys-primary/30'
            }
          `}
        >
          <Building2 size={13} className="flex-shrink-0" />
          <span className="truncate">
            {activeClient ? `Apresentação: ${activeClient.name}` : 'Selecionar cliente...'}
          </span>
        </button>
      </div>

      {/* ── Search ── */}
      <div className="px-3 py-3 border-b border-white/[0.06]">
        <button
          onClick={openSearch}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.07] text-foursys-text-dim hover:text-foursys-text-muted hover:border-foursys-primary/30 transition-all duration-150 text-xs"
        >
          <Search size={13} className="flex-shrink-0" />
          <span>Buscar seção...</span>
          <span className="ml-auto text-[10px] bg-white/10 rounded px-1.5 py-0.5 font-mono">⌘K</span>
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-2 py-3 space-y-5">
        {activeSectionCategories.map(category => {
          const items = activeNavigationItems.filter(n => n.category === category)
          if (items.length === 0) return null

          // Para categorias de cliente, usa a cor do cliente ativo
          const isClientCategory = !['Início', 'Institucional', 'Ofertas', 'Serviços', 'Inovação', 'Provas', 'ESG', 'Referência'].includes(category)
          const categoryColorClass = isClientCategory ? '' : (CATEGORY_COLORS[category] ?? 'text-foursys-text-dim')

          return (
            <div key={category}>
              <div
                className={`text-[9px] font-bold uppercase tracking-[0.14em] mb-1.5 px-3 ${categoryColorClass}`}
                style={isClientCategory && activeClient ? { color: activeClient.colors.primary } : undefined}
              >
                {category}
              </div>
              <div className="space-y-0.5">
                {items.map(item => {
                  const isActive  = state.currentSection === item.id
                  const isVisited = state.visitedSections.includes(item.id as AppSection)
                  const Icon      = SECTION_ICONS[item.id] ?? LayoutGrid

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`
                        w-full flex items-center gap-2.5 px-3 py-[7px] text-left transition-all duration-150 text-[13px] relative group
                        ${isActive
                          ? 'bg-foursys-primary/10 text-foursys-primary rounded-r-lg border-l-2 border-foursys-primary'
                          : 'text-foursys-text-muted hover:bg-white/[0.04] hover:text-foursys-text rounded-lg border-l-2 border-transparent'
                        }
                      `}
                    >
                      <Icon
                        size={14}
                        className={`flex-shrink-0 transition-colors ${
                          isActive
                            ? 'text-foursys-primary'
                            : 'text-foursys-text-dim group-hover:text-foursys-text-muted'
                        }`}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      <span className="font-medium truncate flex-1 leading-none">{item.label}</span>
                      {isVisited && !isActive && (
                        <span className="w-1 h-1 rounded-full bg-foursys-primary/50 flex-shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="px-4 py-3 border-t border-white/[0.06]">
        <p className="text-[9px] text-foursys-text-dim text-center leading-relaxed tracking-wide hidden lg:block">
          ← → navegar &nbsp;·&nbsp; F11 apresentação &nbsp;·&nbsp; ⌃⇧M métricas
        </p>
        <p className="text-[9px] text-foursys-text-dim text-center leading-relaxed tracking-wide lg:hidden">
          Deslize para navegar entre seções
        </p>
      </div>
    </aside>
  )
}
