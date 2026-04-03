import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { DynIcon } from '../../utils/iconMap'
import { search, buildSearchIndex, type SearchEntry, type SearchResultKind } from '../../utils/searchIndex'
import type { AppSection } from '../../types'

const KIND_LABEL: Record<SearchResultKind, string> = {
  section: 'Sessão',
  faq: 'FAQ',
  case: 'Case',
  service: 'Serviço',
  delivery: 'Delivery',
  insight: 'Insight',
  award: 'Premiação',
  certification: 'Certificação',
  alliance: 'Aliança',
  innovation: 'Inovação',
  kpi: 'KPI',
  timeline: 'Trajetória',
  client: 'Cliente',
}

const KIND_COLOR: Record<SearchResultKind, string> = {
  section: 'text-foursys-primary bg-foursys-primary/15 border-foursys-primary/25',
  faq: 'text-sky-400 bg-sky-400/15 border-sky-400/25',
  case: 'text-amber-400 bg-amber-400/15 border-amber-400/25',
  service: 'text-violet-400 bg-violet-400/15 border-violet-400/25',
  delivery: 'text-teal-400 bg-teal-400/15 border-teal-400/25',
  insight: 'text-pink-400 bg-pink-400/15 border-pink-400/25',
  award: 'text-yellow-400 bg-yellow-400/15 border-yellow-400/25',
  certification: 'text-emerald-400 bg-emerald-400/15 border-emerald-400/25',
  alliance: 'text-blue-400 bg-blue-400/15 border-blue-400/25',
  innovation: 'text-green-400 bg-green-400/15 border-green-400/25',
  kpi: 'text-cyan-400 bg-cyan-400/15 border-cyan-400/25',
  timeline: 'text-orange-400 bg-orange-400/15 border-orange-400/25',
  client: 'text-indigo-400 bg-indigo-400/15 border-indigo-400/25',
}

function highlightMatch(text: string, query: string): JSX.Element {
  if (!query.trim()) return <>{text}</>

  const terms = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/\s+/)
    .filter(Boolean)

  const textNorm = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const ranges: [number, number][] = []
  for (const term of terms) {
    let startPos = 0
    while (true) {
      const idx = textNorm.indexOf(term, startPos)
      if (idx === -1) break
      ranges.push([idx, idx + term.length])
      startPos = idx + 1
    }
  }

  if (ranges.length === 0) return <>{text}</>

  ranges.sort((a, b) => a[0] - b[0])
  const merged: [number, number][] = []
  for (const r of ranges) {
    const last = merged[merged.length - 1]
    if (last && r[0] <= last[1]) {
      last[1] = Math.max(last[1], r[1])
    } else {
      merged.push([...r])
    }
  }

  const parts: JSX.Element[] = []
  let cursor = 0
  for (const [start, end] of merged) {
    if (cursor < start) {
      parts.push(<span key={`t-${cursor}`}>{text.slice(cursor, start)}</span>)
    }
    parts.push(
      <mark key={`h-${start}`} className="bg-foursys-primary/30 text-foursys-primary rounded-sm px-px">
        {text.slice(start, end)}
      </mark>
    )
    cursor = end
  }
  if (cursor < text.length) {
    parts.push(<span key={`t-${cursor}`}>{text.slice(cursor)}</span>)
  }

  return <>{parts}</>
}

export function SearchOverlay() {
  const { state, navigate, closeSearch, activeNavigationItems } = useApp()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => { buildSearchIndex() }, [])

  const results: SearchEntry[] = useMemo(() => {
    if (!query.trim()) {
      return activeNavigationItems.map(item => ({
        id: `nav-${item.id}`,
        kind: 'section' as SearchResultKind,
        title: item.label,
        subtitle: `${item.category} · ${item.description}`,
        searchable: '',
        icon: item.icon,
        targetSection: item.id,
        category: 'Sessões',
      }))
    }
    return search(query, 40)
  }, [query, activeNavigationItems])

  const groupedResults = useMemo(() => {
    const groups: { category: string; items: SearchEntry[] }[] = []
    const seen = new Set<string>()
    for (const r of results) {
      if (!seen.has(r.category)) {
        seen.add(r.category)
        groups.push({ category: r.category, items: [] })
      }
      groups.find(g => g.category === r.category)!.items.push(r)
    }
    return groups
  }, [results])

  useEffect(() => {
    if (state.isSearchOpen) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [state.isSearchOpen])

  useEffect(() => {
    setSelected(0)
  }, [query])

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-selected="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.isSearchOpen) return
      if (e.key === 'Escape') { closeSearch(); return }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); return }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); return }
      if (e.key === 'Enter' && results[selected]) {
        navigate(results[selected].targetSection as AppSection)
        closeSearch()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.isSearchOpen, results, selected, navigate, closeSearch])

  let flatIdx = -1

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
            className="fixed top-12 sm:top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-3 sm:px-0"
          >
            <div role="dialog" aria-modal="true" className="bg-foursys-dark-2/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl">

              {/* Search input */}
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <Search size={18} className="text-foursys-primary flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar qualquer coisa — sessões, cases, FAQ, clientes, serviços..."
                  className="flex-1 bg-transparent text-foursys-text placeholder-foursys-text-dim outline-none text-sm"
                />
                {query && (
                  <span className="text-[10px] text-foursys-text-dim bg-white/[0.06] px-2 py-0.5 rounded-full font-mono">
                    {results.length}
                  </span>
                )}
                <button onClick={closeSearch} aria-label="Fechar busca" className="text-foursys-text-dim hover:text-foursys-text transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {results.length === 0 && query.trim() && (
                  <div className="px-6 py-10 text-center">
                    <Search size={28} className="mx-auto text-foursys-text-dim/30 mb-2" />
                    <p className="text-sm text-foursys-text-dim">
                      Nenhum resultado para "<span className="text-foursys-text font-medium">{query}</span>"
                    </p>
                    <p className="text-xs text-foursys-text-dim/60 mt-1">
                      Tente outros termos como "Modernização", "Santander", "ISO" ou "AI"
                    </p>
                  </div>
                )}

                {groupedResults.map(group => (
                  <div key={group.category}>
                    {query.trim() && (
                      <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-foursys-text-dim">
                          {group.category}
                        </span>
                        <span className="text-[9px] text-foursys-text-dim/50">({group.items.length})</span>
                        <div className="flex-1 h-px bg-white/[0.04]" />
                      </div>
                    )}

                    {group.items.map(item => {
                      flatIdx++
                      const idx = flatIdx
                      const isSelected = idx === selected

                      return (
                        <button
                          key={item.id}
                          data-selected={isSelected}
                          onClick={() => { navigate(item.targetSection as AppSection); closeSearch() }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors group ${
                            isSelected ? 'bg-foursys-primary/15' : 'hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                            isSelected
                              ? 'bg-foursys-primary/20 border-foursys-primary/30'
                              : 'bg-white/[0.03] border-white/[0.06]'
                          }`}>
                            <DynIcon
                              name={item.icon}
                              size={15}
                              className={isSelected ? 'text-foursys-primary' : 'text-foursys-text-dim'}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${isSelected ? 'text-foursys-text' : 'text-foursys-text-muted'}`}>
                              {highlightMatch(item.title, query)}
                            </div>
                            <div className="text-[11px] text-foursys-text-dim truncate">
                              {highlightMatch(item.subtitle, query)}
                            </div>
                          </div>

                          {query.trim() && (
                            <span className={`flex-shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${KIND_COLOR[item.kind]}`}>
                              {KIND_LABEL[item.kind]}
                            </span>
                          )}

                          <ArrowRight
                            size={12}
                            className={`flex-shrink-0 transition-all ${
                              isSelected
                                ? 'text-foursys-primary translate-x-0 opacity-100'
                                : 'text-foursys-text-dim -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60'
                            }`}
                          />
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-white/10 flex items-center justify-between">
                <div className="flex gap-4 text-[10px] text-foursys-text-dim">
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono text-[9px]">↑↓</kbd> navegar</span>
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono text-[9px]">Enter</kbd> ir</span>
                  <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono text-[9px]">Esc</kbd> fechar</span>
                </div>
                {!query.trim() && (
                  <span className="text-[10px] text-foursys-text-dim/50">
                    Busca em {buildSearchIndex().length} itens
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
