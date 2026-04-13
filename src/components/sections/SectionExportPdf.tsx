import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileDown, Check, Minus, CheckCheck, X,
  AlertCircle, Loader2, ChevronDown, FileText, Layers,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../i18n'
import { navigationItems, sectionCategories } from '../../data/navigation'
import { cases } from '../../data/cases'
import { exportSectionsToPdf, type PdfExportProgress } from '../../utils/pdfExport'
import { DynIcon } from '../../utils/iconMap'
import { SectionWrapper } from '../ui/SectionWrapper'
import type { AppSection, NavigationItem } from '../../types'

interface SubItem {
  id: string
  label: string
  sectionId: AppSection
}

const STATIC_SUBITEMS_I18N: Record<'pt' | 'en', Partial<Record<AppSection, SubItem[]>>> = {
  pt: {
    'home': [
      { id: 'home-hero', label: 'Hero e KPIs', sectionId: 'home' },
      { id: 'home-offers', label: 'Ofertas Flagship', sectionId: 'home' },
      { id: 'home-delivery', label: 'Modelos de Entrega', sectionId: 'home' },
      { id: 'home-certs', label: 'Certificações', sectionId: 'home' },
    ],
    'identity': [
      { id: 'identity-kpis', label: 'Big Numbers', sectionId: 'identity' },
      { id: 'identity-mission', label: 'Missão, Visão e Valores', sectionId: 'identity' },
      { id: 'identity-timeline', label: 'Linha do Tempo', sectionId: 'identity' },
    ],
    'offers-flagship': [
      { id: 'offers-ai-squad', label: 'AI Squad', sectionId: 'offers-flagship' },
      { id: 'offers-legacy', label: 'Modernização de Legado', sectionId: 'offers-flagship' },
      { id: 'offers-ciberseguranca', label: 'Cibersegurança', sectionId: 'offers-flagship' },
      { id: 'offers-fourblox', label: 'FourBlox', sectionId: 'offers-flagship' },
      { id: 'offers-quality', label: 'Qualidade & Testes com IA', sectionId: 'offers-flagship' },
    ],
    'services': [
      { id: 'svc-dev', label: 'Desenvolvimento & Modernização', sectionId: 'services' },
      { id: 'svc-data', label: 'Dados & Inteligência', sectionId: 'services' },
      { id: 'svc-cyber', label: 'Cibersegurança', sectionId: 'services' },
      { id: 'svc-agile', label: 'Agilidade & Design Org.', sectionId: 'services' },
      { id: 'svc-qa', label: 'Quality Assurance', sectionId: 'services' },
    ],
    'global': [
      { id: 'global-map', label: 'Mapa Interativo', sectionId: 'global' },
      { id: 'global-brasil', label: 'Região Brasil', sectionId: 'global' },
      { id: 'global-eua', label: 'Região EUA', sectionId: 'global' },
      { id: 'global-europa', label: 'Região Europa', sectionId: 'global' },
    ],
    'esg': [
      { id: 'esg-fourlives', label: 'FourLives', sectionId: 'esg' },
      { id: 'esg-social', label: 'Impacto Social', sectionId: 'esg' },
      { id: 'esg-sustent', label: 'Sustentabilidade', sectionId: 'esg' },
    ],
  },
  en: {
    'home': [
      { id: 'home-hero', label: 'Hero and KPIs', sectionId: 'home' },
      { id: 'home-offers', label: 'Flagship Offers', sectionId: 'home' },
      { id: 'home-delivery', label: 'Delivery Models', sectionId: 'home' },
      { id: 'home-certs', label: 'Certifications', sectionId: 'home' },
    ],
    'identity': [
      { id: 'identity-kpis', label: 'Big Numbers', sectionId: 'identity' },
      { id: 'identity-mission', label: 'Mission, Vision and Values', sectionId: 'identity' },
      { id: 'identity-timeline', label: 'Timeline', sectionId: 'identity' },
    ],
    'offers-flagship': [
      { id: 'offers-ai-squad', label: 'AI Squad', sectionId: 'offers-flagship' },
      { id: 'offers-legacy', label: 'Legacy Modernization', sectionId: 'offers-flagship' },
      { id: 'offers-ciberseguranca', label: 'Cybersecurity', sectionId: 'offers-flagship' },
      { id: 'offers-fourblox', label: 'FourBlox', sectionId: 'offers-flagship' },
      { id: 'offers-quality', label: 'Quality & AI Testing', sectionId: 'offers-flagship' },
    ],
    'services': [
      { id: 'svc-dev', label: 'Development & Modernization', sectionId: 'services' },
      { id: 'svc-data', label: 'Data & Intelligence', sectionId: 'services' },
      { id: 'svc-cyber', label: 'Cybersecurity', sectionId: 'services' },
      { id: 'svc-agile', label: 'Agility & Org. Design', sectionId: 'services' },
      { id: 'svc-qa', label: 'Quality Assurance', sectionId: 'services' },
    ],
    'global': [
      { id: 'global-map', label: 'Interactive Map', sectionId: 'global' },
      { id: 'global-brasil', label: 'Brazil Region', sectionId: 'global' },
      { id: 'global-eua', label: 'USA Region', sectionId: 'global' },
      { id: 'global-europa', label: 'Europe Region', sectionId: 'global' },
    ],
    'esg': [
      { id: 'esg-fourlives', label: 'FourLives', sectionId: 'esg' },
      { id: 'esg-social', label: 'Social Impact', sectionId: 'esg' },
      { id: 'esg-sustent', label: 'Sustainability', sectionId: 'esg' },
    ],
  },
}

const CASE_SUBITEMS: SubItem[] = cases.map(c => ({
  id: `case-${c.id}`,
  label: `${c.title} — ${c.client}`,
  sectionId: 'cases' as AppSection,
}))

export function SectionExportPdf() {
  const { getSectionLabel, navigate: appNavigate } = useApp()
  const { t, lang } = useLanguage()

  const [selectedSections, setSelectedSections] = useState<Set<AppSection>>(new Set())
  const [selectedSubItems, setSelectedSubItems] = useState<Set<string>>(new Set())
  const [expandedSections, setExpandedSections] = useState<Set<AppSection>>(new Set())
  const [progress, setProgress] = useState<PdfExportProgress | null>(null)

  const isGenerating = progress !== null && progress.status !== 'done' && progress.status !== 'error'

  const sectionSubitems = useMemo<Partial<Record<AppSection, SubItem[]>>>(() => ({
    ...STATIC_SUBITEMS_I18N[lang],
    'cases': CASE_SUBITEMS,
  }), [lang])

  const availableItems = useMemo(() => {
    return navigationItems.filter(item => item.id !== 'export-pdf')
  }, [])

  const groupedSections = useMemo(() => {
    const groups: { category: string; items: NavigationItem[] }[] = []
    for (const category of sectionCategories) {
      const items = availableItems.filter(item => item.category === category)
      if (items.length > 0) {
        groups.push({ category, items })
      }
    }
    return groups
  }, [availableItems])

  const toggleSection = useCallback((sectionId: AppSection) => {
    setSelectedSections(prev => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
        const subs = sectionSubitems[sectionId]
        if (subs) {
          setSelectedSubItems(p => {
            const n = new Set(p)
            subs.forEach(s => n.delete(s.id))
            return n
          })
        }
      } else {
        next.add(sectionId)
        const subs = sectionSubitems[sectionId]
        if (subs) {
          setSelectedSubItems(p => {
            const n = new Set(p)
            subs.forEach(s => n.add(s.id))
            return n
          })
        }
      }
      return next
    })
  }, [sectionSubitems])

  const toggleSubItem = useCallback((subItem: SubItem) => {
    setSelectedSubItems(prev => {
      const next = new Set(prev)
      if (next.has(subItem.id)) {
        next.delete(subItem.id)
      } else {
        next.add(subItem.id)
        setSelectedSections(p => {
          const n = new Set(p)
          n.add(subItem.sectionId)
          return n
        })
      }
      return next
    })
  }, [])

  const toggleCategory = useCallback((category: string) => {
    const categoryItems = availableItems.filter(item => item.category === category)
    const categoryIds = categoryItems.map(item => item.id)
    const allSelected = categoryIds.every(id => selectedSections.has(id))

    setSelectedSections(prev => {
      const next = new Set(prev)
      if (allSelected) {
        categoryIds.forEach(id => {
          next.delete(id)
          const subs = sectionSubitems[id]
          if (subs) {
            setSelectedSubItems(p => {
              const n = new Set(p)
              subs.forEach(s => n.delete(s.id))
              return n
            })
          }
        })
      } else {
        categoryIds.forEach(id => {
          next.add(id)
          const subs = sectionSubitems[id]
          if (subs) {
            setSelectedSubItems(p => {
              const n = new Set(p)
              subs.forEach(s => n.add(s.id))
              return n
            })
          }
        })
      }
      return next
    })
  }, [availableItems, selectedSections, sectionSubitems])

  const toggleExpand = useCallback((sectionId: AppSection) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    const allIds = availableItems.map(item => item.id)
    setSelectedSections(new Set(allIds))
    const allSubs = new Set<string>()
    allIds.forEach(id => {
      sectionSubitems[id]?.forEach(s => allSubs.add(s.id))
    })
    setSelectedSubItems(allSubs)
  }, [availableItems, sectionSubitems])

  const clearSelection = useCallback(() => {
    setSelectedSections(new Set())
    setSelectedSubItems(new Set())
  }, [])

  const isCategoryFullySelected = useCallback((category: string): boolean => {
    const items = availableItems.filter(item => item.category === category)
    return items.length > 0 && items.every(item => selectedSections.has(item.id))
  }, [availableItems, selectedSections])

  const isCategoryPartiallySelected = useCallback((category: string): boolean => {
    const items = availableItems.filter(item => item.category === category)
    const some = items.some(item => selectedSections.has(item.id))
    const all = items.every(item => selectedSections.has(item.id))
    return some && !all
  }, [availableItems, selectedSections])

  const generatePdf = useCallback(async () => {
    if (selectedSections.size === 0 || isGenerating) return

    const orderedSections = availableItems
      .filter(item => selectedSections.has(item.id))
      .map(item => item.id)

    await exportSectionsToPdf(
      orderedSections,
      getSectionLabel,
      appNavigate,
      setProgress
    )
  }, [selectedSections, isGenerating, availableItems, getSectionLabel, appNavigate])

  const allSelected = availableItems.every(item => selectedSections.has(item.id))
  const progressPct = progress ? Math.round((progress.current / progress.total) * 100) : 0

  const totalSubItemsSelected = selectedSubItems.size
  const totalSelectedDisplay = selectedSections.size + (totalSubItemsSelected > 0 ? ` (+${totalSubItemsSelected} ${lang === 'pt' ? 'subitens' : 'sub-items'})` : '')

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-primary/15 border border-foursys-primary/30 text-foursys-cyan text-xs mb-3">
            <FileDown size={14} />
            {t('exportPdf.badge')}
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foursys-text leading-tight mb-2">
            {lang === 'pt' ? 'Exportar para' : 'Export to'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6600] to-[#FF9933]">
              PDF
            </span>
          </h2>
          <p className="text-sm text-foursys-text-muted max-w-2xl">
            {t('exportPdf.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 tablet:grid-cols-[1fr_320px] lg:grid-cols-[1fr_320px] gap-6">

          {/* Left — Selection area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/[0.08] bg-foursys-surface/30 backdrop-blur-sm overflow-hidden"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <button
                  onClick={allSelected ? clearSelection : selectAll}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-foursys-primary/10 text-foursys-primary hover:bg-foursys-primary/20 border border-foursys-primary/20 transition-all disabled:opacity-40"
                >
                  {allSelected ? (
                    <><X size={12} /> {t('exportPdf.clearAll')}</>
                  ) : (
                    <><CheckCheck size={12} /> {t('exportPdf.selectAll')}</>
                  )}
                </button>
              </div>
              <span className="text-[11px] text-foursys-text-dim font-medium">
                {totalSelectedDisplay} {t('exportPdf.selected')}
              </span>
            </div>

            {/* Section list */}
            <div className="max-h-[55dvh] overflow-y-auto custom-scrollbar px-5 py-4">
              <div className="space-y-5">
                {groupedSections.map((group, gi) => {
                  const isFullCat = isCategoryFullySelected(group.category)
                  const isPartialCat = isCategoryPartiallySelected(group.category)

                  return (
                    <motion.div
                      key={group.category}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + gi * 0.04 }}
                    >
                      {/* Category header */}
                      <button
                        onClick={() => toggleCategory(group.category)}
                        disabled={isGenerating}
                        className="flex items-center gap-2.5 mb-2.5 group w-full text-left disabled:opacity-40"
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                          isFullCat
                            ? 'bg-foursys-primary border-foursys-primary'
                            : isPartialCat
                              ? 'bg-foursys-primary/30 border-foursys-primary/60'
                              : 'border-white/20 group-hover:border-white/40'
                        }`}>
                          {isFullCat && <Check size={12} className="text-white" strokeWidth={3} />}
                          {isPartialCat && <Minus size={12} className="text-white" strokeWidth={3} />}
                        </div>
                        <Layers size={14} className="text-foursys-primary/60" />
                        <span className="text-xs font-bold text-foursys-text-muted uppercase tracking-[0.12em] group-hover:text-foursys-text transition-colors">
                          {group.category}
                        </span>
                        <span className="text-[9px] text-foursys-text-dim/60 ml-1">
                          ({group.items.filter(i => selectedSections.has(i.id)).length}/{group.items.length})
                        </span>
                      </button>

                      {/* Section items */}
                      <div className="space-y-1 ml-1">
                        {group.items.map(item => {
                          const isSelected = selectedSections.has(item.id)
                          const subItems = sectionSubitems[item.id]
                          const isExpanded = expandedSections.has(item.id)
                          const hasSubItems = subItems && subItems.length > 0

                          return (
                            <div key={item.id}>
                              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 ${
                                isSelected
                                  ? 'bg-foursys-primary/8 border border-foursys-primary/20'
                                  : 'hover:bg-white/[0.04] border border-transparent'
                              }`}>
                                {/* Checkbox */}
                                <button
                                  onClick={() => toggleSection(item.id)}
                                  disabled={isGenerating}
                                  className="flex-shrink-0 disabled:opacity-40"
                                >
                                  <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                    isSelected
                                      ? 'bg-foursys-primary border-foursys-primary'
                                      : 'border-white/20 hover:border-white/40'
                                  }`}>
                                    {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                                  </div>
                                </button>

                                <DynIcon name={item.icon} size={14} className={`flex-shrink-0 ${isSelected ? 'text-foursys-primary' : 'text-foursys-text-dim'}`} />

                                <button
                                  onClick={() => toggleSection(item.id)}
                                  disabled={isGenerating}
                                  className="min-w-0 flex-1 text-left disabled:opacity-40"
                                >
                                  <div className={`text-xs font-medium truncate ${isSelected ? 'text-foursys-text' : 'text-foursys-text-muted'}`}>
                                    {item.label}
                                  </div>
                                  <div className="text-[10px] text-foursys-text-dim truncate">
                                    {item.description}
                                  </div>
                                </button>

                                {/* Expand subitems */}
                                {hasSubItems && (
                                  <button
                                    onClick={() => toggleExpand(item.id)}
                                    className="flex-shrink-0 p-1 rounded-lg hover:bg-white/[0.06] text-foursys-text-dim hover:text-foursys-text-muted transition-colors"
                                    aria-label={lang === 'pt' ? 'Expandir subitens' : 'Expand sub-items'}
                                  >
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                  </button>
                                )}
                              </div>

                              {/* Subitems */}
                              <AnimatePresence>
                                {hasSubItems && isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="ml-8 pl-3 border-l border-white/[0.06] space-y-0.5 py-1">
                                      {subItems!.map(sub => {
                                        const subSelected = selectedSubItems.has(sub.id)
                                        return (
                                          <button
                                            key={sub.id}
                                            onClick={() => toggleSubItem(sub)}
                                            disabled={isGenerating}
                                            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-all disabled:opacity-40 ${
                                              subSelected
                                                ? 'bg-foursys-primary/6 text-foursys-text'
                                                : 'hover:bg-white/[0.03] text-foursys-text-dim'
                                            }`}
                                          >
                                            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                                              subSelected
                                                ? 'bg-foursys-primary/80 border-foursys-primary'
                                                : 'border-white/15'
                                            }`}>
                                              {subSelected && <Check size={8} className="text-white" strokeWidth={3} />}
                                            </div>
                                            <span className="text-[11px]">{sub.label}</span>
                                          </button>
                                        )
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Right — Preview / Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* Summary card */}
            <div className="rounded-2xl border border-white/[0.08] bg-foursys-surface/30 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-xl bg-foursys-primary/15">
                  <FileText size={18} className="text-foursys-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foursys-text">{t('exportPdf.exportSummary')}</h3>
                  <p className="text-[10px] text-foursys-text-dim">
                    {lang === 'pt' ? 'Conteúdo que será incluído no PDF' : 'Content that will be included in the PDF'}
                  </p>
                </div>
              </div>

              {selectedSections.size === 0 ? (
                <div className="text-center py-6">
                  <Layers size={32} className="mx-auto text-foursys-text-dim/30 mb-2" />
                  <p className="text-xs text-foursys-text-dim">
                    {lang === 'pt' ? 'Selecione pelo menos uma sessão para exportar' : 'Select at least one section to export'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[30dvh] overflow-y-auto custom-scrollbar">
                  {availableItems
                    .filter(item => selectedSections.has(item.id))
                    .map(item => {
                      const subs = sectionSubitems[item.id]
                      const selectedSubs = subs?.filter(s => selectedSubItems.has(s.id)) ?? []

                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]"
                        >
                          <DynIcon name={item.icon} size={12} className="text-foursys-primary mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-[11px] font-medium text-foursys-text truncate">{item.label}</div>
                            {selectedSubs.length > 0 && selectedSubs.length < (subs?.length ?? 0) && (
                              <div className="text-[9px] text-foursys-text-dim mt-0.5">
                                {selectedSubs.map(s => s.label).join(' · ')}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/[0.06]">
                <div className="text-center flex-1">
                  <div className="text-lg font-black text-foursys-primary">{selectedSections.size}</div>
                  <div className="text-[9px] text-foursys-text-dim uppercase tracking-wider">
                    {lang === 'pt' ? 'Sessões' : 'Sections'}
                  </div>
                </div>
                <div className="w-px h-8 bg-white/[0.06]" />
                <div className="text-center flex-1">
                  <div className="text-lg font-black text-foursys-cyan">{totalSubItemsSelected}</div>
                  <div className="text-[9px] text-foursys-text-dim uppercase tracking-wider">
                    {lang === 'pt' ? 'Subitens' : 'Sub-items'}
                  </div>
                </div>
                <div className="w-px h-8 bg-white/[0.06]" />
                <div className="text-center flex-1">
                  <div className="text-lg font-black text-foursys-text">
                    {groupedSections.filter(g =>
                      g.items.some(i => selectedSections.has(i.id))
                    ).length}
                  </div>
                  <div className="text-[9px] text-foursys-text-dim uppercase tracking-wider">
                    {lang === 'pt' ? 'Categorias' : 'Categories'}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            {progress && progress.status !== 'done' && progress.status !== 'error' && (
              <div className="rounded-2xl border border-foursys-primary/20 bg-foursys-primary/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-foursys-text-muted font-medium flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin text-foursys-primary" />
                    {progress.status === 'preparing' && `${t('exportPdf.preparing')} ${progress.currentSection}`}
                    {progress.status === 'capturing' && `${t('exportPdf.capturing')} ${progress.currentSection}`}
                    {progress.status === 'building' && t('exportPdf.assembling')}
                  </span>
                  <span className="text-[10px] text-foursys-text-dim font-mono">
                    {progress.current}/{progress.total}
                  </span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-foursys-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ boxShadow: '0 0 8px rgba(255,102,0,0.4)' }}
                  />
                </div>
              </div>
            )}

            {/* Success */}
            {progress?.status === 'done' && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <CheckCheck size={16} className="text-emerald-400" />
                <span className="text-xs text-emerald-300 font-medium">
                  {t('exportPdf.success')}
                </span>
              </div>
            )}

            {/* Error */}
            {progress?.status === 'error' && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle size={16} className="text-red-400" />
                <span className="text-xs text-red-300 font-medium">
                  {t('exportPdf.error')}
                </span>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={generatePdf}
              disabled={selectedSections.size === 0 || isGenerating}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-foursys-primary/20 to-orange-500/10 border border-foursys-primary/30 hover:from-foursys-primary/30 hover:to-orange-500/20 hover:border-foursys-primary/50 text-foursys-primary shadow-[0_0_30px_rgba(255,102,0,0.12)]"
            >
              {isGenerating ? (
                <><Loader2 size={18} className="animate-spin" /> {t('exportPdf.generatePdf')}</>
              ) : (
                <><FileDown size={18} /> {t('exportPdf.generatePdf')} — {selectedSections.size} {lang === 'pt' ? (selectedSections.size !== 1 ? 'seções' : 'seção') : (selectedSections.size !== 1 ? 'sections' : 'section')}</>
              )}
            </button>

            {/* Hint */}
            <p className="text-[10px] text-foursys-text-dim/60 text-center leading-relaxed px-2">
              {lang === 'pt'
                ? 'O PDF será gerado no formato A4 paisagem, capturando o conteúdo visual de cada sessão selecionada.'
                : 'The PDF will be generated in A4 landscape format, capturing the visual content of each selected section.'}
            </p>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  )
}
