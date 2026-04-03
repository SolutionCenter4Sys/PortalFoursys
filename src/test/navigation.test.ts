import { describe, it, expect } from 'vitest'
import { navigationItems, sectionCategories } from '../data/navigation'

const SECTION_RENDERER_CASES = [
  'home', 'identity', 'timeline', 'global', 'why-foursys',
  'offers-flagship', 'services', 'delivery', 'alliances', 'innovation',
  'cases', 'testimonials', 'awards', 'clients-showcase', 'capabilities',
  'esg', 'insights', 'faq', 'export-pdf',
  'client-opening', 'client-insights', 'client-cases', 'client-extra-1',
]

describe('Navigation items integrity', () => {
  it('each item has id, label, icon, category, description', () => {
    for (const item of navigationItems) {
      expect(item.id).toBeTruthy()
      expect(typeof item.label).toBe('string')
      expect(item.label.length).toBeGreaterThan(0)
      expect(item.icon).toBeTruthy()
      expect(item.category).toBeTruthy()
      expect(typeof item.description).toBe('string')
    }
  })

  it('all item categories belong to sectionCategories', () => {
    for (const item of navigationItems) {
      expect(sectionCategories).toContain(item.category)
    }
  })

  it('no duplicate navigation item ids', () => {
    const ids = navigationItems.map(n => n.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every navigation item id has a SectionRenderer case', () => {
    for (const item of navigationItems) {
      expect(SECTION_RENDERER_CASES).toContain(item.id)
    }
  })

  it('sectionCategories has no duplicates', () => {
    expect(new Set(sectionCategories).size).toBe(sectionCategories.length)
  })
})
