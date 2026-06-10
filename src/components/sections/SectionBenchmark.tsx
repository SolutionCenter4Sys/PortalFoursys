import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Building2,
  TrendingUp,
  Users,
  X,
  ChevronRight,
  FileText,
  Search,
  Mic,
  MicOff,
  Tag,
  UserX,
  Layers,
} from 'lucide-react'
import { useLanguage } from '../../i18n'
import { useVoiceSearch } from '../../hooks/useVoiceSearch'
import { SectionWrapper } from '../ui/SectionWrapper'
import {
  getBenchmarkContacts,
  getBenchmarkMeta,
  type BenchmarkContact,
  type BenchmarkSource,
} from '../../data/benchmark'

// ─── Estilo por origem ─────────────────────────────────────────────────────

const SOURCE_COLORS: Record<BenchmarkSource, { bg: string; text: string; border: string; primary: string }> = {
  santander: { bg: 'rgba(204,0,0,0.12)', text: '#FF6B6B', border: 'rgba(204,0,0,0.32)', primary: '#CC0000' },
  itforum: { bg: 'rgba(0,114,206,0.12)', text: '#5BB4FF', border: 'rgba(0,114,206,0.32)', primary: '#004C97' },
  'bench-empresas': { bg: 'rgba(139,92,246,0.12)', text: '#A78BFA', border: 'rgba(139,92,246,0.32)', primary: '#8B5CF6' },
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function getOpportunityColor(count: number) {
  if (count > 5) return { bg: 'rgba(16,185,129,0.15)', text: '#10b981', border: 'rgba(16,185,129,0.3)' }
  if (count > 0) return { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' }
  return { bg: 'rgba(107,114,128,0.15)', text: '#6b7280', border: 'rgba(107,114,128,0.3)' }
}

function getScoreColor(score: number) {
  if (score >= 80) return '#10b981'
  if (score >= 50) return '#3b82f6'
  if (score >= 30) return '#f59e0b'
  return '#6b7280'
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function contactMatchesQuery(c: BenchmarkContact, q: string): boolean {
  const n = norm(q)
  return [c.name, c.role, c.company, c.sector, c.city, c.revenue, c.topOffer, c.tag ?? '', c.sourceLabel]
    .some(f => norm(f).includes(n))
}

const MAX_STAGGER_DELAY = 0.4
const ACCENT = '#f59e0b'

// ─── Componente principal ─────────────────────────────────────────────────

export function SectionBenchmark() {
  const { lang, t } = useLanguage()
  const [selectedContact, setSelectedContact] = useState<BenchmarkContact | null>(null)
  const [search, setSearch] = useState('')
  const [activeSource, setActiveSource] = useState<BenchmarkSource | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const speechLang = lang === 'en' ? 'en-US' : 'pt-BR'
  const onVoiceResult = useCallback((transcript: string) => {
    setSearch(transcript)
  }, [])
  const voice = useVoiceSearch(onVoiceResult, speechLang)

  const meta = getBenchmarkMeta(lang)
  const contacts = useMemo(() => getBenchmarkContacts(lang), [lang])

  const sourceCounts = useMemo(() => {
    const map = new Map<BenchmarkSource, number>()
    contacts.forEach(c => map.set(c.source, (map.get(c.source) ?? 0) + 1))
    return map
  }, [contacts])

  const tags = useMemo(() => {
    const baseContacts = activeSource ? contacts.filter(c => c.source === activeSource) : contacts
    const set = new Set<string>()
    baseContacts.forEach(c => {
      if (c.tag) set.add(c.tag)
    })
    const preferred = ['Reunião Foursys', 'Foursys Meeting', 'Demais CIO', 'Other CIOs', 'Grupo NC', 'NC Group']
    return Array.from(set).sort((a, b) => {
      const ia = preferred.indexOf(a)
      const ib = preferred.indexOf(b)
      if (ia !== -1 && ib !== -1) return ia - ib
      if (ia !== -1) return -1
      if (ib !== -1) return 1
      return a.localeCompare(b)
    })
  }, [contacts, activeSource])

  const tagCounts = useMemo(() => {
    const baseContacts = activeSource ? contacts.filter(c => c.source === activeSource) : contacts
    const map = new Map<string, number>()
    baseContacts.forEach(c => {
      if (c.tag) map.set(c.tag, (map.get(c.tag) ?? 0) + 1)
    })
    return map
  }, [contacts, activeSource])

  const filtered = useMemo(() => {
    let result = contacts
    if (activeSource) result = result.filter(c => c.source === activeSource)
    if (activeTag) result = result.filter(c => c.tag === activeTag)
    if (search.trim()) result = result.filter(c => contactMatchesQuery(c, search.trim()))
    return result
  }, [contacts, search, activeSource, activeTag])

  const isFiltered = activeSource !== null || activeTag !== null || search.trim() !== ''

  const staggerStep = filtered.length > 0
    ? Math.min(0.04, MAX_STAGGER_DELAY / filtered.length)
    : 0.04

  return (
    <SectionWrapper>
      <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-7 md:py-10 max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-7 sm:mb-10"
        >
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit mb-3 sm:mb-4"
            style={{ borderColor: `${ACCENT}40`, backgroundColor: `${ACCENT}12`, color: ACCENT }}
          >
            <Layers size={14} />
            <span className="text-sm font-semibold">
              {lang === 'pt' ? 'Provas · Benchmark' : 'Proof Points · Benchmark'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-white leading-tight mb-2 sm:mb-3">
            {meta.title}
          </h2>
          <p className="text-foursys-text-muted text-sm sm:text-base max-w-2xl leading-relaxed">
            {meta.subtitle}
          </p>
          <div
            className="mt-5 sm:mt-6 h-px"
            style={{
              background: `linear-gradient(to right, ${ACCENT}50, rgba(255,255,255,0.06), transparent)`,
            }}
          />
        </motion.div>

        {/* Source filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-4 sm:mb-5 flex flex-wrap gap-2"
        >
          <button
            onClick={() => { setActiveSource(null); setActiveTag(null) }}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 touch-manipulation whitespace-nowrap ${
              activeSource === null
                ? 'bg-white/10 border border-white/30 text-white'
                : 'border border-white/[0.1] text-foursys-text-muted hover:border-white/30 hover:text-white active:bg-white/5'
            }`}
          >
            <Users size={12} />
            {lang === 'pt' ? 'Todas as origens' : 'All sources'} ({contacts.length})
          </button>
          {(['santander', 'itforum', 'bench-empresas'] as BenchmarkSource[]).map(src => {
            const palette = SOURCE_COLORS[src]
            const count = sourceCounts.get(src) ?? 0
            const active = activeSource === src
            const label =
              src === 'santander'
                ? 'Santander'
                : src === 'itforum'
                  ? (lang === 'pt' ? 'IT Fórum' : 'IT Forum')
                  : (lang === 'pt' ? 'Bench Empresas' : 'Company Bench')
            return (
              <button
                key={src}
                onClick={() => { setActiveSource(active ? null : src); setActiveTag(null) }}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold transition-all touch-manipulation whitespace-nowrap"
                style={{
                  backgroundColor: active ? palette.bg : 'transparent',
                  borderColor: active ? palette.border : 'rgba(255,255,255,0.1)',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  color: active ? palette.text : 'rgba(255,255,255,0.6)',
                }}
              >
                {label} ({count})
              </button>
            )
          })}
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 sm:mb-5"
        >
          <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all duration-200 ${
            voice.status === 'listening'
              ? 'border-foursys-primary/50 bg-foursys-primary/5 shadow-[0_0_20px_rgba(255,102,0,0.12)]'
              : 'border-white/[0.1] bg-foursys-surface/60 focus-within:border-foursys-primary/50'
          }`}>
            <Search size={16} className="text-foursys-text-dim shrink-0" />
            <input
              inputMode="search"
              enterKeyHint="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={voice.status === 'listening'
                ? t('common.listening')
                : (lang === 'pt' ? 'Buscar por nome, empresa, setor, cidade...' : 'Search by name, company, sector, city...')}
              className="flex-1 bg-transparent text-sm text-foursys-text placeholder-foursys-text-dim outline-none min-w-0"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="p-2 -m-1 rounded-full hover:bg-white/10 text-foursys-text-dim hover:text-white transition-colors touch-manipulation"
                aria-label={t('common.clearSearch')}
              >
                <X size={14} />
              </button>
            )}
            {voice.isSupported && (
              <button
                type="button"
                onClick={voice.toggle}
                className={`p-2 -m-0.5 rounded-full transition-all touch-manipulation ${
                  voice.status === 'listening'
                    ? 'bg-foursys-primary/20 text-foursys-primary animate-pulse'
                    : voice.status === 'error'
                      ? 'text-red-400'
                      : 'text-foursys-text-dim hover:text-white hover:bg-white/10'
                }`}
                aria-label={voice.status === 'listening'
                  ? (lang === 'pt' ? 'Parar gravação' : 'Stop recording')
                  : t('common.voiceSearch')}
              >
                {voice.status === 'listening' ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            )}
          </div>
          {voice.status === 'listening' && (
            <p className="text-[10px] text-foursys-primary mt-1.5 ml-1 animate-pulse">
              {lang === 'pt' ? 'Ouvindo... fale o nome, empresa ou setor que deseja buscar' : 'Listening... say the name, company, or sector you want to search'}
            </p>
          )}
          {isFiltered && (
            <p className="text-[11px] text-foursys-text-muted mt-2 ml-1">
              {filtered.length === 0
                ? (lang === 'pt' ? 'Nenhum contato encontrado' : 'No contacts found')
                : (lang === 'pt'
                    ? `${filtered.length} de ${contacts.length} contatos`
                    : `${filtered.length} of ${contacts.length} contacts`)}
            </p>
          )}
        </motion.div>

        {/* Tag filters */}
        {tags.length > 0 && (
          <div className="mb-4 sm:mb-5 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-none">
            <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap pb-1 sm:pb-0">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 touch-manipulation whitespace-nowrap ${
                  activeTag === null
                    ? 'bg-foursys-primary/30 border border-foursys-primary/50 text-foursys-primary'
                    : 'border border-white/[0.1] text-foursys-text-muted hover:border-white/30 hover:text-white active:bg-white/5'
                }`}
              >
                <Tag size={12} />
                {lang === 'pt' ? 'Todos' : 'All'}
              </button>
              {tags.map(tg => (
                <button
                  key={tg}
                  onClick={() => setActiveTag(activeTag === tg ? null : tg)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all touch-manipulation whitespace-nowrap ${
                    activeTag === tg
                      ? 'bg-foursys-primary/30 border border-foursys-primary/50 text-foursys-primary'
                      : 'border border-white/[0.1] text-foursys-text-muted hover:border-white/30 hover:text-white active:bg-white/5'
                  }`}
                >
                  {tg} ({tagCounts.get(tg) ?? 0})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contact grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 sm:py-20 gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <UserX size={24} className="text-foursys-text-dim" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foursys-text-muted mb-1">
                {lang === 'pt' ? 'Nenhum contato encontrado' : 'No contacts found'}
              </p>
              <p className="text-xs text-foursys-text-dim max-w-xs">
                {lang === 'pt'
                  ? 'Tente ajustar os filtros ou o termo de busca.'
                  : 'Try adjusting the filters or search term.'}
              </p>
            </div>
            <button
              onClick={() => { setSearch(''); setActiveTag(null); setActiveSource(null) }}
              className="mt-2 px-4 py-2 rounded-lg text-xs font-medium border border-white/[0.1] text-foursys-text-muted hover:text-white hover:border-white/30 transition-colors touch-manipulation"
            >
              {lang === 'pt' ? 'Limpar filtros' : 'Clear filters'}
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filtered.map((contact, i) => {
              const oppColor = getOpportunityColor(contact.opportunities)
              const scoreColor = getScoreColor(contact.topScore)
              const palette = SOURCE_COLORS[contact.source]
              const hasBriefing = contact.briefingFiles && contact.briefingFiles.length > 0

              return (
                <motion.div
                  key={`${contact.source}-${contact.name}-${contact.company}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * staggerStep, duration: 0.35 }}
                  className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-white/[0.08] bg-foursys-surface/30 hover:border-white/20 hover:bg-foursys-surface/50 transition-all duration-300 ${hasBriefing ? 'cursor-pointer group active:scale-[0.98]' : ''}`}
                  onClick={() => hasBriefing && setSelectedContact(contact)}
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2.5 sm:mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-white truncate">{contact.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Building2 size={11} className="text-foursys-text-muted flex-shrink-0" />
                        <span className="text-xs text-foursys-text-muted truncate">
                          {contact.role} · {contact.company}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                      {hasBriefing && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-white/5 text-foursys-text-muted border border-white/10 group-hover:border-white/30 group-hover:text-white transition-colors">
                          <FileText size={10} />
                          <span className="hidden sm:inline">{t('clientSections.extra2.briefing')}</span>
                          <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      )}
                      {contact.source !== 'bench-empresas' && (
                        <div
                          className="w-8 h-8 sm:w-auto sm:h-auto sm:px-2 sm:py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: `${scoreColor}20`, color: scoreColor, border: `1px solid ${scoreColor}40` }}
                        >
                          {contact.topScore}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5 sm:mb-3">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ backgroundColor: palette.bg, color: palette.text, border: `1px solid ${palette.border}` }}
                    >
                      {contact.sourceLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium max-w-[40%] truncate bg-white/[0.04] text-foursys-text-muted border border-white/10">
                      {contact.sector}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-foursys-text-muted border border-white/10">
                      <MapPin size={9} />
                      {contact.city}
                    </span>
                    {(contact.tag === 'Reunião Foursys' || contact.tag === 'Foursys Meeting' || contact.tag === 'Demais CIO' || contact.tag === 'Other CIOs') && (
                      contact.briefingFiles?.[0]?.file?.includes('_nrespondeu-it') ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {lang === 'pt' ? 'Não Respondeu IT Fórum' : 'Did Not Reply IT Forum'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          ✓ {lang === 'pt' ? 'Respondeu IT Fórum' : 'Replied IT Forum'}
                        </span>
                      )
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      {contact.revenue !== 'N/I' && contact.revenue !== 'N/A' && contact.revenue !== '' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                          <TrendingUp size={9} />
                          {contact.revenue}
                        </span>
                      )}
                      {contact.source !== 'bench-empresas' && (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap"
                          style={{ backgroundColor: oppColor.bg, color: oppColor.text, border: `1px solid ${oppColor.border}` }}
                        >
                          {contact.opportunities} {t('clientSections.extra2.projects')}
                        </span>
                      )}
                    </div>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold truncate max-w-[120px] sm:max-w-[140px]"
                      style={{ backgroundColor: `${scoreColor}15`, color: scoreColor, border: `1px solid ${scoreColor}30` }}
                    >
                      {contact.topOffer}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        <AnimatePresence>
          {selectedContact && (
            <ContactBriefingModal
              contact={selectedContact}
              onClose={() => setSelectedContact(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  )
}

// ─── Modal de briefing ─────────────────────────────────────────────────────

function ContactBriefingModal({
  contact,
  onClose,
}: {
  contact: BenchmarkContact
  onClose: () => void
}) {
  const { t, lang } = useLanguage()
  const files = contact.briefingFiles ?? []
  const [activeFile, setActiveFile] = useState(0)
  const palette = SOURCE_COLORS[contact.source]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3, type: 'spring', damping: 25 }}
        className="relative w-full sm:max-w-4xl md:max-w-6xl h-[95vh] sm:h-[90vh] rounded-t-2xl sm:rounded-2xl border border-white/[0.12] bg-foursys-bg overflow-hidden flex flex-col shadow-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex sm:hidden justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3 border-b border-white/[0.08] bg-foursys-surface/50">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: palette.bg, color: palette.text }}
            >
              {contact.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate">{contact.name}</h3>
              <p className="text-xs text-foursys-text-muted truncate">
                {contact.role} · {contact.company} · <span style={{ color: palette.text }}>{contact.sourceLabel}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 -mr-1 rounded-xl hover:bg-white/10 text-foursys-text-muted hover:text-white transition-colors flex-shrink-0 touch-manipulation"
            aria-label={lang === 'pt' ? 'Fechar' : 'Close'}
          >
            <X size={18} />
          </button>
        </div>

        {files.length > 1 && (
          <div className="flex items-center gap-1 px-3 sm:px-4 py-2 border-b border-white/[0.08] bg-foursys-surface/30 overflow-x-auto scrollbar-none">
            {files.map((f, i) => (
              <button
                key={f.file}
                onClick={() => setActiveFile(i)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all touch-manipulation ${
                  activeFile === i
                    ? 'text-white'
                    : 'text-foursys-text-muted hover:text-white hover:bg-white/5'
                }`}
                style={activeFile === i ? { backgroundColor: palette.bg, color: palette.text } : undefined}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 min-h-0">
          {files.length > 0 ? (
            <iframe
              key={files[activeFile].file}
              src={`/briefings/${contact.source}/${files[activeFile].file}`}
              className="w-full h-full border-0"
              title={`${t('clientSections.extra2.briefing')} — ${contact.name}`}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-foursys-text-muted text-sm">
              {t('common.loading')}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
