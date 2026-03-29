import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { AppProvider } from '../context/AppContext'
import { SectionHome } from '../components/sections/SectionHome'
import { SectionIdentity } from '../components/sections/SectionIdentity'
import { SectionCases } from '../components/sections/SectionCases'

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
})
