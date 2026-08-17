import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageProvider } from '../i18n/LanguageContext'
import { EvidenceBadge } from '../components/portfolio/EvidenceBadge'
import { OfferCard } from '../components/portfolio/OfferCard'
import { portfolioPt } from '../data/portfolio'

const offer = portfolioPt.offers[0]
const axis = portfolioPt.axes.find(a => a.id === offer.axisId)

function renderWithLang(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>)
}

describe('Componentes do portfólio', () => {
  it('EvidenceBadge renderiza os três status de lastro', () => {
    for (const status of ['liberado', 'em-validacao', 'sem-lastro'] as const) {
      const { container } = renderWithLang(<EvidenceBadge status={status} />)
      expect(container.textContent?.length).toBeGreaterThan(0)
    }
  })

  // O card é o alvo de clique do catálogo: precisa ser botão para chegar via
  // teclado e anunciar nome acessível.
  it('OfferCard é um botão com rótulo acessível', () => {
    renderWithLang(<OfferCard offer={offer} axis={axis} index={0} onClick={() => {}} />)
    const botao = screen.getByRole('button')
    expect(botao.getAttribute('aria-label')).toContain(offer.name)
    expect(botao.textContent).toContain(offer.code)
  })
})
