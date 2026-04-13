import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, ChevronRight, Building2, Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { clients } from '../../data/clients'
import { useLanguage } from '../../i18n'
import { ClientLogo } from '../ui/ClientLogos'

function norm(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

// ─── Cores padrão por cliente ─────────────────────────────────────────────────

function ClientCard({
  client,
  isActive,
  onSelect,
}: {
  client: (typeof clients)[0]
  isActive: boolean
  onSelect: () => void
}) {
  const { t } = useLanguage()
  const color = client.colors.primary

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`
        w-full p-5 rounded-xl border text-left transition-all duration-200 flex items-center gap-4
        ${isActive
          ? 'bg-white/[0.06] border-white/25'
          : 'bg-foursys-surface/30 border-white/[0.08] hover:border-white/20 hover:bg-foursys-surface/50'
        }
      `}
    >
      {/* Logo do cliente */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color}15, ${color}08)`, border: `1px solid ${color}30` }}
      >
        <ClientLogo id={client.id} size={16} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-bold text-foursys-text">{client.name}</span>
          {isActive && (
            <span
              className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border"
              style={{ color, backgroundColor: `${color}15`, borderColor: `${color}40` }}
            >
              {t('clientSelector.active')}
            </span>
          )}
        </div>
        <p className="text-xs text-foursys-text-muted truncate">{client.tagline}</p>
        <p className="text-[10px] text-foursys-text-dim mt-0.5">
          {client.sections.length} {t('clientSelector.customSections')}
        </p>
      </div>

      <ChevronRight size={14} className="text-foursys-text-dim flex-shrink-0" />
    </motion.button>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function ClientSelector() {
  const { t, lang } = useLanguage()
  const { state, setClient, clearClient, toggleClientSelector } = useApp()
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.isClientSelectorOpen) {
      setSearch('')
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [state.isClientSelectorOpen])

  const filtered = useMemo(() => {
    if (!search.trim()) return clients
    const q = norm(search.trim())
    return clients.filter(c =>
      norm(c.name).includes(q) || norm(c.tagline).includes(q)
    )
  }, [search])

  return (
    <AnimatePresence>
      {state.isClientSelectorOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          onClick={toggleClientSelector}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.95, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 16, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            className="relative z-10 bg-foursys-dark-2 border border-white/[0.12] rounded-t-2xl sm:rounded-2xl w-full max-w-md flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-white/[0.06] flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255,102,0,0.15)', border: '1px solid rgba(255,102,0,0.3)' }}
                  >
                    <Building2 size={14} style={{ color: '#FF6600' }} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foursys-text">{t('clientSelector.title')}</h2>
                    <p className="text-[10px] text-foursys-text-dim">{t('clientSelector.subtitle')}</p>
                  </div>
                </div>
                <button
                  onClick={toggleClientSelector}
                  aria-label={t('clientSelector.closeSelector')}
                  className="p-2 rounded-xl hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <p className="text-xs text-foursys-text-muted mb-3">
                {t('clientSelector.description')}
              </p>

              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foursys-text-dim" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={lang === 'pt' ? 'Buscar cliente...' : 'Search client...'}
                  className="w-full pl-9 pr-8 py-2 bg-foursys-surface/40 border border-white/[0.08] rounded-lg text-xs text-foursys-text placeholder:text-foursys-text-dim focus:outline-none focus:border-foursys-primary/50 transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foursys-text-dim hover:text-foursys-text"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Body – scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {filtered.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-foursys-text-dim">
                    {lang === 'pt' ? 'Nenhum cliente encontrado.' : 'No clients found.'}
                  </p>
                </div>
              ) : (
                filtered.map(client => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    isActive={state.activeClientId === client.id}
                    onSelect={() => {
                      if (state.activeClientId === client.id) {
                        clearClient()
                      } else {
                        setClient(client.id)
                      }
                    }}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 flex-shrink-0">
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-foursys-text-dim">
                  <Users size={11} />
                  <span>
                    {filtered.length !== clients.length
                      ? `${filtered.length}/${clients.length}`
                      : clients.length
                    } {t('clientSelector.availableClients')}
                  </span>
                </div>

                {state.activeClientId && (
                  <button
                    onClick={clearClient}
                    className="text-xs text-foursys-text-dim hover:text-foursys-text-muted transition-colors underline underline-offset-2"
                  >
                    {t('clientSelector.backToInstitutional')}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
