import { useState, useCallback, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { navigationItems, sectionCategories } from '../data/navigation'
import { exportSectionsToPdf, type PdfExportProgress } from '../utils/pdfExport'
import type { AppSection, NavigationItem } from '../types'

export function useExportPdf() {
  const { state, navigate, getSectionLabel, activeNavigationItems, activeSectionCategories } = useApp()
  const [selectedSections, setSelectedSections] = useState<Set<AppSection>>(new Set())
  const [progress, setProgress] = useState<PdfExportProgress | null>(null)
  const isGenerating = progress !== null && progress.status !== 'done' && progress.status !== 'error'

  const availableItems = useMemo(() => {
    if (state.activeClientId) {
      return activeNavigationItems
    }
    return navigationItems
  }, [state.activeClientId, activeNavigationItems])

  const availableCategories = useMemo(() => {
    if (state.activeClientId) {
      return activeSectionCategories
    }
    return sectionCategories
  }, [state.activeClientId, activeSectionCategories])

  const groupedSections = useMemo(() => {
    const groups: { category: string; items: NavigationItem[] }[] = []
    for (const category of availableCategories) {
      const items = availableItems.filter(item => item.category === category)
      if (items.length > 0) {
        groups.push({ category, items })
      }
    }
    return groups
  }, [availableItems, availableCategories])

  const toggleSection = useCallback((sectionId: AppSection) => {
    setSelectedSections(prev => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
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
        categoryIds.forEach(id => next.delete(id))
      } else {
        categoryIds.forEach(id => next.add(id))
      }
      return next
    })
  }, [availableItems, selectedSections])

  const selectAll = useCallback(() => {
    setSelectedSections(new Set(availableItems.map(item => item.id)))
  }, [availableItems])

  const clearSelection = useCallback(() => {
    setSelectedSections(new Set())
  }, [])

  const isCategoryFullySelected = useCallback((category: string): boolean => {
    const categoryItems = availableItems.filter(item => item.category === category)
    return categoryItems.length > 0 && categoryItems.every(item => selectedSections.has(item.id))
  }, [availableItems, selectedSections])

  const isCategoryPartiallySelected = useCallback((category: string): boolean => {
    const categoryItems = availableItems.filter(item => item.category === category)
    const someSelected = categoryItems.some(item => selectedSections.has(item.id))
    const allSelected = categoryItems.every(item => selectedSections.has(item.id))
    return someSelected && !allSelected
  }, [availableItems, selectedSections])

  const generatePdf = useCallback(async () => {
    if (selectedSections.size === 0 || isGenerating) return

    const orderedSections = availableItems
      .filter(item => selectedSections.has(item.id))
      .map(item => item.id)

    await exportSectionsToPdf(
      orderedSections,
      getSectionLabel,
      navigate,
      setProgress
    )
  }, [selectedSections, isGenerating, availableItems, getSectionLabel, navigate])

  const resetProgress = useCallback(() => {
    setProgress(null)
  }, [])

  return {
    selectedSections,
    groupedSections,
    progress,
    isGenerating,
    toggleSection,
    toggleCategory,
    selectAll,
    clearSelection,
    isCategoryFullySelected,
    isCategoryPartiallySelected,
    generatePdf,
    resetProgress,
  }
}
