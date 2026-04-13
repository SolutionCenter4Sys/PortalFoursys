import {
  Search,
  Home,
  Users,
  Clock,
  Globe,
  Rocket,
  LayoutGrid,
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
  Mic,
  type LucideIcon,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../i18n'
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
  'Ofertas e Serviços': 'text-foursys-primary',
  'Provas':       'text-amber-400',
  'ESG':          'text-green-400',
  'Referência':   'text-slate-400',
  'Home':         'text-foursys-primary',
  'About Us':     'text-slate-400',
  'Solutions & Services': 'text-foursys-primary',
  'Proof Points': 'text-amber-400',
  'Reference':    'text-slate-400',
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

  const { isDark } = useTheme()
  const { t } = useLanguage()
  const activeClient = state.activeClientId ? getClientById(state.activeClientId) : null

  function handleNavigate(id: string) {
    navigate(id as AppSection)
    // O reducer NAVIGATE já define isMenuOpen: false — não chamar toggleMenu aqui
  }

  return (
    <aside aria-label="Menu principal" className="w-64 flex-shrink-0 h-full flex flex-col bg-foursys-dark overflow-hidden z-10" style={{ borderRight: '1px solid var(--border-subtle)' }}>

      {/* ── Header — logo Foursys ── */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="group relative mb-1.5">
          <img
            src={isDark ? '/images/foursys-logo.png' : '/images/foursys-logo-dark.png'}
            alt="Foursys"
            className="h-7 w-auto object-contain relative z-10 transition-all duration-400"
            style={{
              filter: isDark ? 'drop-shadow(0 0 10px rgba(255,102,0,0.35)) drop-shadow(0 0 20px rgba(255,102,0,0.15))' : 'none',
            }}
          />
          <div
            className="absolute -inset-2 rounded-xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 80% at 30% 50%, rgba(255,102,0,0.06), transparent 70%)',
            }}
          />
        </div>
        <p className="text-[10px] text-foursys-text-dim leading-snug tracking-wide">
          {t('nav.tagline')}
        </p>
      </div>

      {/* ── Seletor de cliente ── */}
      <div className="px-3 py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <button
          onClick={toggleClientSelector}
          className={`
            w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs transition-all duration-150
            ${state.activeClientId
              ? 'bg-foursys-primary/10 border-foursys-primary/30 text-foursys-primary'
              : 'bg-foursys-surface/40 border-foursys-dark-4/50 text-foursys-text-dim hover:text-foursys-text-muted hover:border-foursys-primary/30'
            }
          `}
        >
          <Building2 size={13} className="flex-shrink-0" />
          <span className="truncate">
            {activeClient ? `${t('nav.presentationPrefix')} ${activeClient.name}` : t('nav.selectClient')}
          </span>
        </button>
      </div>

      {/* ── Search ── */}
      <div className="px-3 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-1">
          <button
            onClick={() => openSearch()}
            className="flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg bg-foursys-surface/40 border border-foursys-dark-4/50 text-foursys-text-dim hover:text-foursys-text-muted hover:border-foursys-primary/30 transition-all duration-150 text-xs"
          >
            <Search size={13} className="flex-shrink-0" />
            <span>{t('nav.searchSection')}</span>
          </button>
          <button
            onClick={() => openSearch(true)}
            aria-label={t('common.voiceSearch')}
            className="flex-shrink-0 p-2 rounded-lg bg-foursys-surface/40 border border-foursys-dark-4/50 text-foursys-text-dim hover:text-foursys-primary hover:border-foursys-primary/30 transition-all duration-150"
          >
            <Mic size={13} />
          </button>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar px-2 py-3 space-y-5">
        {activeSectionCategories.map(category => {
          const items = activeNavigationItems.filter(n => n.category === category)
          if (items.length === 0) return null

          // Para categorias de cliente, usa a cor do cliente ativo
          const coreCategories = ['Início', 'Institucional', 'Ofertas e Serviços', 'Provas', 'ESG', 'Referência', 'Home', 'About Us', 'Solutions & Services', 'Proof Points', 'Reference']
          const isClientCategory = !coreCategories.includes(category)
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
                          : 'text-foursys-text-muted hover:bg-foursys-dark-4/30 hover:text-foursys-text rounded-lg border-l-2 border-transparent'
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
      <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <p className="text-[9px] text-foursys-text-dim text-center leading-relaxed tracking-wide hidden lg:block">
          {t('nav.footerDesktop')}
        </p>
        <p className="text-[9px] text-foursys-text-dim text-center leading-relaxed tracking-wide lg:hidden">
          {t('nav.footerMobile')}
        </p>
      </div>
    </aside>
  )
}
