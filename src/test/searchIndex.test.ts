import { describe, it, expect } from 'vitest'
import { buildSearchIndex, search } from '../utils/searchIndex'

describe('buildSearchIndex', () => {
  const index = buildSearchIndex()

  it('returns a non-empty array', () => {
    expect(index.length).toBeGreaterThan(0)
  })

  it('each entry has targetSection, title, searchable, kind', () => {
    for (const entry of index) {
      expect(entry.targetSection).toBeTruthy()
      expect(typeof entry.title).toBe('string')
      expect(typeof entry.searchable).toBe('string')
      expect(entry.searchable.length).toBeGreaterThan(0)
      expect(entry.kind).toBeTruthy()
    }
  })

  it('indexes cases content', () => {
    const caseEntries = index.filter(e => e.kind === 'case')
    expect(caseEntries.length).toBeGreaterThan(0)
  })

  it('indexes service content', () => {
    const serviceEntries = index.filter(e => e.kind === 'service')
    expect(serviceEntries.length).toBeGreaterThan(0)
  })

  it('indexes FAQ content', () => {
    const faqEntries = index.filter(e => e.kind === 'faq')
    expect(faqEntries.length).toBeGreaterThan(0)
  })
})

describe('search', () => {
  it('finds "Foursys" across content', () => {
    const results = search('Foursys')
    expect(results.length).toBeGreaterThan(0)
  })

  it('finds "AI" related content', () => {
    const results = search('AI')
    expect(results.length).toBeGreaterThan(0)
  })

  it('returns empty for nonsense query', () => {
    const results = search('xyznonexistentquery12345')
    expect(results.length).toBe(0)
  })

  it('respects limit parameter', () => {
    const results = search('Foursys', 3)
    expect(results.length).toBeLessThanOrEqual(3)
  })

  it('is accent-insensitive', () => {
    const r1 = search('inovacao')
    const r2 = search('inovação')
    expect(r1.length).toBe(r2.length)
  })
})
