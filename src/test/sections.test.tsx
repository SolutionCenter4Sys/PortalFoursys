import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppProvider } from '../context/AppContext'
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

function renderWithProvider(ui: React.ReactElement) {
  return render(<AppProvider>{ui}</AppProvider>)
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
