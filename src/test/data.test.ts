import { describe, it, expect } from 'vitest'
import { navigationItems, sectionCategories } from '../data/navigation'
import { clients, getClientById } from '../data/clients'
import { innovationTrends } from '../data/innovation'
import { showcaseClients } from '../data/clientShowcase'
import { getIcon } from '../utils/iconMap'

describe('Navigation data', () => {
  it('has at least 15 navigation items', () => {
    expect(navigationItems.length).toBeGreaterThanOrEqual(15)
  })

  it('each navigation item has required fields', () => {
    for (const item of navigationItems) {
      expect(item.id).toBeTruthy()
      expect(item.label).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.category).toBeTruthy()
    }
  })

  it('has all expected categories', () => {
    expect(sectionCategories).toContain('Início')
    expect(sectionCategories).toContain('Institucional')
    expect(sectionCategories).toContain('Ofertas e Serviços')
  })

  it('every navigation item belongs to a valid category', () => {
    for (const item of navigationItems) {
      expect(sectionCategories).toContain(item.category)
    }
  })
})

describe('Client data', () => {
  it('has at least 4 clients configured', () => {
    expect(clients.length).toBeGreaterThanOrEqual(4)
  })

  it('each client has required fields', () => {
    for (const client of clients) {
      expect(client.id).toBeTruthy()
      expect(client.name).toBeTruthy()
      expect(client.colors.primary).toBeTruthy()
      expect(client.colors.accent).toBeTruthy()
      expect(client.tagline).toBeTruthy()
      expect(client.sections.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('getClientById returns correct client', () => {
    const santander = getClientById('santander')
    expect(santander).toBeTruthy()
    expect(santander?.name).toBe('Santander')
  })

  it('getClientById returns falsy for unknown id', () => {
    const unknown = getClientById('nonexistent')
    expect(unknown).toBeFalsy()
  })

  it('Santander has enriched insights from 4T25', () => {
    const santander = getClientById('santander')
    expect(santander?.insights?.length).toBeGreaterThanOrEqual(6)
    const thinkValue = santander?.insights?.find(i => i.id === 'think-value')
    expect(thinkValue).toBeTruthy()
    expect(thinkValue?.title).toContain('Think Value')
  })

  it('Bradesco has enriched insights', () => {
    const bradesco = getClientById('bradesco')
    expect(bradesco?.insights?.length).toBeGreaterThanOrEqual(5)
  })

  it('Equifax has enriched insights', () => {
    const equifax = getClientById('equifax')
    expect(equifax?.insights?.length).toBeGreaterThanOrEqual(5)
  })

  it('all clients have at least one section', () => {
    for (const client of clients) {
      expect(client.sections.length).toBeGreaterThan(0)
      expect(client.sections[0].component).toBe('client-opening')
    }
  })
})

describe('Innovation data', () => {
  it('has 5 innovation trends', () => {
    expect(innovationTrends.length).toBe(5)
  })

  it('each trend has required fields', () => {
    for (const trend of innovationTrends) {
      expect(trend.id).toBeTruthy()
      expect(trend.title).toBeTruthy()
      expect(trend.tagline).toBeTruthy()
      expect(trend.description).toBeTruthy()
      expect(trend.foursysPosition).toBeTruthy()
      expect(trend.keyCapabilities.length).toBeGreaterThan(0)
    }
  })
})

describe('Client showcase data', () => {
  it('has multiple showcase clients', () => {
    expect(showcaseClients.length).toBeGreaterThanOrEqual(8)
  })

  it('each showcase client has id, name, sector, color', () => {
    for (const client of showcaseClients) {
      expect(client.id).toBeTruthy()
      expect(client.name).toBeTruthy()
      expect(client.sector).toBeTruthy()
      expect(client.color).toBeTruthy()
    }
  })
})

describe('Icon map', () => {
  it('resolves known icons', () => {
    const home = getIcon('home')
    expect(home).toBeTruthy()
  })

  it('returns fallback for unknown icons', () => {
    const unknown = getIcon('nonexistent-icon-xyz')
    expect(unknown).toBeTruthy()
  })

  it('resolves all navigation item icons', () => {
    for (const item of navigationItems) {
      const icon = getIcon(item.icon)
      expect(icon).toBeTruthy()
    }
  })
})
