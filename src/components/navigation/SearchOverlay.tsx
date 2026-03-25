import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import type { AppSection } from '../../types'

export function SearchOverlay() {
  const { state, navigate, closeSearch, activeNavigationItems } = useApp()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.trim()
    ? activeNavigationItems.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    : activeNavigationItems

  useEffect(() => {
    if (state.isSearchOpen) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [state.isSearchOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.isSearchOpen) return
      if (e.key === 'Escape') { closeSearch(); return }
      if (e.key === 'ArrowDown') { setSelected(s => Math.min(s + 1, results.length - 1)); return }
      if (e.key === 'ArrowUp') { setSelected(s => Math.max(s - 1, 0)); return }
      if (e.key === 'Enter' && results[selected]) {
        navigate(results[selected].id as AppSection)
        closeSearch()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.isSearchOpen, results, selected, navigate, closeSearch])

  return (
    <AnimatePresence>
      {state.isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 sm:top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-3 sm:px-0"
          >
            <div className="bg-foursys-dark-2/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <Search size={18} className="text-foursys-text-muted flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSelected(0) }}
                  placeholder="Buscar seções..."
                  className="flex-1 bg-transparent text-foursys-text placeholder-foursys-text-dim outline-none text-sm"
                />
                <button onClick={closeSearch} className="text-foursys-text-dim hover:text-foursys-text">
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {results.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => { navigate(item.id as AppSection); closeSearch() }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      ${idx === selected ? 'bg-foursys-blue/20' : 'hover:bg-white/5'}
                    `}
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-foursys-text">{item.label}</div>
                      <div className="text-xs text-foursys-text-dim">{item.category} · {item.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-white/10 flex gap-4 text-xs text-foursys-text-dim">
                <span>↑↓ navegar</span>
                <span>Enter selecionar</span>
                <span>Esc fechar</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
