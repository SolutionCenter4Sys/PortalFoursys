import { describe, it, expect } from 'vitest'
import { innovationTrends } from '../data/innovation'

const VALID_ICONS = ['brain-circuit', 'factory', 'bot']

describe('Innovation trends data', () => {
  it('each trend has a unique id', () => {
    const ids = innovationTrends.map(t => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('each trend icon is present in the ICON_MAP', () => {
    for (const trend of innovationTrends) {
      expect(VALID_ICONS).toContain(trend.icon)
    }
  })

  it('each trend has title, tagline, description', () => {
    for (const trend of innovationTrends) {
      expect(trend.title).toBeTruthy()
      expect(trend.tagline).toBeTruthy()
      expect(trend.description.length).toBeGreaterThan(20)
    }
  })

  it('each trend has foursysPosition and keyCapabilities', () => {
    for (const trend of innovationTrends) {
      expect(trend.foursysPosition).toBeTruthy()
      expect(trend.keyCapabilities.length).toBeGreaterThan(0)
    }
  })

  it('each trend has leaders with required fields', () => {
    for (const trend of innovationTrends) {
      expect(trend.leaders.length).toBeGreaterThan(0)
      for (const leader of trend.leaders) {
        expect(leader.name).toBeTruthy()
        expect(leader.approach).toBeTruthy()
        expect(leader.highlight).toBeTruthy()
      }
    }
  })

  it('each trend has stats with value and label', () => {
    for (const trend of innovationTrends) {
      expect(trend.stats.length).toBeGreaterThan(0)
      for (const stat of trend.stats) {
        expect(stat.value).toBeTruthy()
        expect(stat.label).toBeTruthy()
      }
    }
  })

  it('each trend has deepDive with all required fields', () => {
    for (const trend of innovationTrends) {
      expect(trend.deepDive).toBeTruthy()
      expect(trend.deepDive.overview.length).toBeGreaterThan(20)
      expect(trend.deepDive.whyItMatters.length).toBeGreaterThan(20)
      expect(trend.deepDive.marketSize.length).toBeGreaterThan(20)
      expect(trend.deepDive.futureOutlook.length).toBeGreaterThan(20)
    }
  })

  it('has valid color and gradient for each trend', () => {
    for (const trend of innovationTrends) {
      expect(trend.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(trend.gradient).toBeTruthy()
    }
  })
})
