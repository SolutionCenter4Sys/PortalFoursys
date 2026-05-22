import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppProvider } from '../context/AppContext'
import { LanguageProvider } from '../i18n/LanguageContext'
import { SectionHome } from '../components/sections/SectionHome'
import { SectionIdentity } from '../components/sections/SectionIdentity'
import { SectionCases } from '../components/sections/SectionCases'
import { SectionServices } from '../components/sections/SectionServices'
import { SectionDelivery } from '../components/sections/SectionDelivery'
import { SectionWhyFoursys } from '../components/sections/SectionWhyFoursys'
import { SectionClients } from '../components/sections/SectionClients'
import { SectionInsights } from '../components/sections/SectionInsights'
import { SectionInnovation } from '../components/sections/SectionInnovation'
import { SectionAlliances } from '../components/sections/SectionAlliances'
import { SectionAIFoursys } from '../components/sections/SectionAIFoursys'
import { SectionKiamComparison } from '../components/sections/SectionKiamComparison'

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <LanguageProvider>
      <AppProvider>{ui}</AppProvider>
    </LanguageProvider>
  )
}

describe('Section smoke tests', () => {
  it('SectionHome renders without crash', () => {
    const { container } = renderWithProvider(<SectionHome />)
    expect(container).toBeTruthy()
  })

  it('SectionIdentity renders without crash', () => {
    const { container } = renderWithProvider(<SectionIdentity />)
    expect(container).toBeTruthy()
  })

  it('SectionCases renders without crash', () => {
    const { container } = renderWithProvider(<SectionCases />)
    expect(container).toBeTruthy()
  })

  it('SectionServices renders without crash', () => {
    const { container } = renderWithProvider(<SectionServices />)
    expect(container).toBeTruthy()
  })

  it('SectionDelivery renders without crash', () => {
    const { container } = renderWithProvider(<SectionDelivery />)
    expect(container).toBeTruthy()
  })

  it('SectionWhyFoursys renders without crash', () => {
    const { container } = renderWithProvider(<SectionWhyFoursys />)
    expect(container).toBeTruthy()
  })

  it('SectionClients renders without crash', () => {
    const { container } = renderWithProvider(<SectionClients />)
    expect(container).toBeTruthy()
  })

  it('SectionInsights renders without crash', () => {
    const { container } = renderWithProvider(<SectionInsights />)
    expect(container).toBeTruthy()
  })

  it('SectionInnovation renders without crash', () => {
    const { container } = renderWithProvider(<SectionInnovation />)
    expect(container).toBeTruthy()
  })

  it('SectionAlliances renders without crash', () => {
    const { container } = renderWithProvider(<SectionAlliances />)
    expect(container).toBeTruthy()
  })

  it('SectionAIFoursys renders without crash', () => {
    const { container } = renderWithProvider(<SectionAIFoursys />)
    expect(container).toBeTruthy()
  })

  it('SectionKiamComparison renders without crash', () => {
    const { container } = renderWithProvider(<SectionKiamComparison />)
    expect(container).toBeTruthy()
  })
})

describe('AI section content', () => {
  it('SectionAIFoursys mostra os 10 Pilares de Governança', () => {
    renderWithProvider(<SectionAIFoursys />)
    expect(screen.getByText(/10 Pilares de Governan/i)).toBeTruthy()
  })

  it('SectionAIFoursys não contém mais a string MOXE', () => {
    renderWithProvider(<SectionAIFoursys />)
    const moxeElements = screen.queryAllByText(/\bMOXE\b/)
    expect(moxeElements.length).toBe(0)
  })

  it('SectionAIFoursys mostra a marca KIAM', () => {
    renderWithProvider(<SectionAIFoursys />)
    expect(screen.getAllByText(/KIAM/).length).toBeGreaterThan(0)
  })

  it('SectionKiamComparison mostra a matriz comparativa', () => {
    renderWithProvider(<SectionKiamComparison />)
    expect(screen.getAllByText(/KIAM/i).length).toBeGreaterThan(0)
  })
})

describe('SectionHome content', () => {
  it('displays Foursys branding', () => {
    renderWithProvider(<SectionHome />)
    expect(screen.getByText(/foursys/i)).toBeTruthy()
  })
})

describe('SectionWhyFoursys content', () => {
  it('renders comparison table header', () => {
    renderWithProvider(<SectionWhyFoursys />)
    expect(screen.getByText(/por que a foursys/i)).toBeTruthy()
  })
})

describe('SectionInnovation content', () => {
  it('renders innovation trends', () => {
    renderWithProvider(<SectionInnovation />)
    expect(screen.getByText(/tendências/i)).toBeTruthy()
  })
})
