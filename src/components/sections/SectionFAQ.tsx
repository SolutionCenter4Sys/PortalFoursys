import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowRight, Search, Mic, MicOff, X } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { faqItems } from '../../data/faq'
import { useApp } from '../../context/AppContext'
import { useVoiceSearch } from '../../hooks/useVoiceSearch'
import type { AppSection } from '../../types'

const categories = ['Todos', 'Institucional', 'Serviços', 'Tecnologia', 'Parceria', 'Santander', 'Comercial']

export function SectionFAQ() {
  const { navigate } = useApp()
  const [openId, setOpenId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [search, setSearch] = useState('')

  const onVoiceResult = useCallback((transcript: string) => {
    setSearch(transcript)
  }, [])
  const voice = useVoiceSearch(onVoiceResult)

  const filtered = faqItems.filter(item => {
    const matchCategory = activeCategory === 'Todos' || item.category === activeCategory
    const matchSearch = !search || item.question.toLowerCase().includes(search.toLowerCase()) || item.answer.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-primary/15 border border-foursys-primary/30 text-foursys-cyan text-sm mb-4">
            Perguntas Frequentes
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-foursys-text mb-4">
            Sempre prontos para responder
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            Perguntas que os clientes sempre fazem — e as respostas que todo mundo na Foursys deve saber de cor.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-5"
        >
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
            voice.status === 'listening'
              ? 'border-foursys-primary/50 bg-foursys-primary/5 shadow-[0_0_20px_rgba(255,102,0,0.12)]'
              : 'border-white/[0.1] bg-foursys-surface/60 focus-within:border-foursys-primary/50'
          }`}>
            <Search size={16} className="text-foursys-text-dim shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={voice.status === 'listening' ? 'Ouvindo...' : 'Buscar pergunta...'}
              className="flex-1 bg-transparent text-sm text-foursys-text placeholder-foursys-text-dim outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="p-1 rounded-full hover:bg-white/10 text-foursys-text-dim hover:text-white transition-colors"
                aria-label="Limpar busca"
              >
                <X size={14} />
              </button>
            )}
            {voice.isSupported && (
              <button
                type="button"
                onClick={voice.toggle}
                className={`p-1.5 rounded-full transition-all ${
                  voice.status === 'listening'
                    ? 'bg-foursys-primary/20 text-foursys-primary animate-pulse'
                    : voice.status === 'error'
                      ? 'text-red-400'
                      : 'text-foursys-text-dim hover:text-white hover:bg-white/10'
                }`}
                aria-label={voice.status === 'listening' ? 'Parar gravação' : 'Buscar por voz'}
              >
                {voice.status === 'listening' ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}
          </div>
          {voice.status === 'listening' && (
            <p className="text-[10px] text-foursys-primary mt-1.5 ml-1 animate-pulse">Ouvindo... fale o termo que deseja buscar</p>
          )}
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeCategory === cat
                  ? 'bg-foursys-primary/30 border border-foursys-primary/50 text-foursys-cyan'
                  : 'border border-white/15 text-foursys-text-muted hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-foursys-surface/50 border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex-1">
                  <div className="text-xs text-foursys-text-dim mb-1">{item.category}</div>
                  <div className="text-sm font-semibold text-foursys-text">{item.question}</div>
                </div>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-foursys-text-muted transition-transform duration-200 ${
                    openId === item.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-6 pb-5 border-t border-white/8">
                      <p className="text-sm text-foursys-text-muted leading-relaxed mt-4 mb-4">{item.answer}</p>
                      {item.sectionLink && (
                        <button
                          onClick={() => navigate(item.sectionLink as AppSection)}
                          className="flex items-center gap-2 text-xs text-foursys-cyan hover:text-foursys-cyan/80 transition-colors"
                        >
                          {item.sectionLabel} <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-foursys-text-dim">
            Nenhuma pergunta encontrada para "{search}"
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
