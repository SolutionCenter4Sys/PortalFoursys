import { describe, it, expect } from 'vitest'
import { portfolioPt, PRODUCT_AXIS_ID, productOffers, serviceAxes, serviceOffers, sustainOffers } from '../data/portfolio'
import { portfolioBridges, portfolioGlossary } from '../data/portfolioGuidance'
import { hasPortfolioExample } from '../data/portfolioExamples'
import { pt } from '../i18n/translations/pt'
import { en } from '../i18n/translations/en'

const { axes, offers, personas, segments, futureVision, assets, defaultEngagement } = portfolioPt
const codes = new Set(offers.map(o => o.code))

describe('Portfólio 2026 S2 — integridade dos dados', () => {
  it('tem 8 pilares e 24 ofertas na fonte — 6 pilares e 21 ofertas no catálogo de serviço', () => {
    expect(axes.length).toBe(8)
    expect(offers.length).toBe(24)
    expect(serviceAxes(axes).length).toBe(6)
    expect(serviceOffers(offers).length).toBe(21)
    expect(productOffers(offers).length).toBe(2)
    expect(productOffers(offers).every(o => o.axisId === PRODUCT_AXIS_ID)).toBe(true)
    expect(sustainOffers(offers).length).toBe(1)
  })

  it('não há códigos nem ids de oferta duplicados', () => {
    expect(codes.size).toBe(offers.length)
    expect(new Set(offers.map(o => o.id)).size).toBe(offers.length)
  })

  it('toda oferta aponta para um pilar existente', () => {
    const axisIds = new Set(axes.map(a => a.id))
    for (const offer of offers) {
      expect(axisIds).toContain(offer.axisId)
    }
  })

  it('toda oferta tem os blocos publicáveis mínimos', () => {
    for (const offer of offers) {
      expect(offer.headline.length).toBeGreaterThan(0)
      expect(offer.whatItIs.length).toBeGreaterThan(0)
      expect(offer.pain.length).toBeGreaterThan(0)
      expect(offer.outcomes.length).toBeGreaterThanOrEqual(5)
      expect(offer.differentials.length).toBeGreaterThanOrEqual(3)
      expect(offer.phases.length).toBeGreaterThanOrEqual(3)
      expect(offer.personas.length).toBeGreaterThanOrEqual(3)
      expect(offer.cta.length).toBeGreaterThan(0)
    }
  })

  it('todo dado de mercado declara a fonte', () => {
    for (const offer of offers) {
      for (const stat of offer.marketStats) {
        expect(stat.stat.length).toBeGreaterThan(0)
        expect(stat.source.length).toBeGreaterThan(0)
      }
    }
  })

  it('todo status de maturidade é válido e prova liberada possui cases', () => {
    for (const offer of offers) {
      expect(['liberado', 'em-validacao', 'sem-lastro']).toContain(offer.proof.status)
      if (offer.proof.status === 'liberado') {
        expect(offer.proof.cases?.length ?? 0).toBeGreaterThan(0)
      }
    }
  })

  it('conexões entre ofertas referenciam códigos existentes', () => {
    for (const offer of offers) {
      expect(offer.connects.length).toBeGreaterThan(0)
      for (const code of offer.connects) {
        expect(codes).toContain(code)
      }
      expect(offer.connects).not.toContain(offer.code)
    }
  })

  it('shortlist de cada persona referencia ofertas existentes e sem repetição', () => {
    for (const persona of personas) {
      expect(persona.openingQuestion.length).toBeGreaterThan(0)
      expect(persona.shortlist.length).toBeGreaterThanOrEqual(3)
      expect(new Set(persona.shortlist).size).toBe(persona.shortlist.length)
      for (const code of persona.shortlist) {
        expect(codes).toContain(code)
      }
    }
  })

  it('prioridades por segmento referenciam ofertas existentes', () => {
    for (const segment of segments) {
      expect(segment.priorityOffers.length).toBeGreaterThan(0)
      for (const code of segment.priorityOffers) {
        expect(codes).toContain(code)
      }
    }
  })

  it('cada pilar de diferenciação tem ao menos uma oferta', () => {
    for (const axis of axes.filter(a => a.role === 'diferenciacao')) {
      expect(offers.some(o => o.axisId === axis.id)).toBe(true)
    }
  })

  // O mapa do ecossistema só torna o card navegável quando o eixo tem oferta, e
  // a mandala exibe a contagem no nó: eixo zerado quebraria as duas leituras.
  it('todo pilar tem ao menos uma oferta detalhada', () => {
    for (const axis of axes) {
      expect(offers.filter(o => o.axisId === axis.id).length).toBeGreaterThan(0)
    }
  })

  // Ativos transversais só se provam transversais se aparecerem nas ofertas.
  it('a maioria dos ativos transversais é rastreável em ofertas', () => {
    const traceable = assets.filter(asset => {
      const needle = asset.name.toLowerCase()
      return offers.some(offer =>
        [
          ...(offer.assets ?? []),
          ...(offer.components ?? []),
          offer.name,
          offer.whatItIs,
          ...offer.differentials.map(d => `${d.title} ${d.detail}`),
        ]
          .join(' ')
          .toLowerCase()
          .includes(needle),
      )
    })
    expect(traceable.length).toBeGreaterThanOrEqual(Math.ceil(assets.length / 2))
  })

  // O portal expõe COMO contratar, nunca quanto custa: preço sai da proposta,
  // depois do dimensionamento aprovado pelo Solution Center.
  it('base comercial declara modelos e não vaza valor de investimento', () => {
    const bases = [defaultEngagement, ...offers.map(o => o.engagement).filter(Boolean)]
    for (const base of bases) {
      expect(base!.models.length).toBeGreaterThanOrEqual(2)
      expect(base!.sizing.length).toBeGreaterThan(0)
      const texto = [...base!.models, base!.sizing].join(' ')
      expect(texto).not.toMatch(/R\$|US\$|\d+\s?(mil|k\b|milh)/i)
    }
  })

  it('visão de futuro e ativos transversais estão preenchidos', () => {
    expect(futureVision.length).toBeGreaterThanOrEqual(4)
    expect(assets.length).toBeGreaterThanOrEqual(5)
    for (const item of [...futureVision, ...assets]) {
      expect(item.name.length).toBeGreaterThan(0)
      expect(item.description.length).toBeGreaterThan(0)
    }
    for (const item of futureVision) {
      expect(item.example.length).toBeGreaterThan(0)
      expect(item.maturity.length).toBeGreaterThan(0)
    }
  })

  it('Tokenomics trata custo de consumo e não tokenização de ativos', () => {
    const tokenomics = offers.find(o => o.code === '5.3')
    expect(tokenomics).toBeDefined()
    const texto = [
      tokenomics!.name,
      tokenomics!.headline,
      tokenomics!.whatItIs,
      tokenomics!.pain,
      ...tokenomics!.outcomes,
      tokenomics!.boundary,
    ].join(' ')
    expect(texto).toMatch(/custo|consumo/i)
    expect(texto).toMatch(/token de IA|tokens de IA/i)
    expect(tokenomics!.boundary).toMatch(/Não é tokenização de ativos/i)
    expect(tokenomics!.whatItIs).not.toMatch(/ativo tokenizado|smart contract|blockchain/i)
  })

  it('Cibersegurança funciona como oferta-mãe com seis módulos detalhados', () => {
    const cyber = offers.find(o => o.code === '6.1')
    expect(cyber?.modules).toHaveLength(6)
    for (const module of cyber!.modules!) {
      expect(module.name.length).toBeGreaterThan(0)
      expect(module.description.length).toBeGreaterThan(0)
      expect(module.clientValue.length).toBeGreaterThan(0)
      expect(module.deliverables.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('copy pública não contém preço ou claims absolutos bloqueados', () => {
    const texto = offers
      .flatMap(offer => [
        offer.name,
        offer.headline,
        offer.tagline,
        offer.whatItIs,
        offer.pain,
        offer.cta,
        ...offer.outcomes,
        ...offer.marketStats.flatMap(stat => [stat.stat, stat.source]),
      ])
      .join(' ')
    expect(texto).not.toMatch(/R\$|zero risco|100%\s+pront|controle total|somos os únicos|assessment sem custo/i)
  })

  it('glossário cobre termos centrais em linguagem simples', () => {
    expect(portfolioGlossary.length).toBeGreaterThanOrEqual(10)
    expect(portfolioGlossary.some(item => item.term === 'Tokenomics')).toBe(true)
    expect(portfolioGlossary.some(item => item.term === 'Tokenização')).toBe(true)
  })

  it('copy exibida ao cliente não contém instruções internas', () => {
    const clientCopy = JSON.stringify({
      portfolioPt: pt.portfolio,
      portfolioEn: en.portfolio,
      publicBundle: portfolioPt,
    })
    expect(clientCopy).not.toMatch(
      /notas de condução|presenter notes|uso interno|internal use|roteiro comercial|commercial guide|cuidado editorial|editorial care|legacyEquivalent|portfolioRole/i,
    )
    expect(pt.portfolio.evidence['sem-lastro']).toBe('Método disponível')
    expect(pt.portfolio.future.notAvailable).toBe('Em desenvolvimento')
  })

  it('pontes comerciais referenciam ofertas e ativos existentes', () => {
    const assetNames = new Set(assets.map(asset => asset.name))
    for (const bridge of portfolioBridges) {
      expect(codes).toContain(bridge.entryCode)
      expect(bridge.capacityCodes.length).toBeGreaterThan(0)
      for (const code of bridge.capacityCodes) expect(codes).toContain(code)
      for (const name of bridge.assetNames) expect(assetNames).toContain(name)
    }
  })

  it('glossário e pontes preservam acentuação UTF-8', () => {
    const text = JSON.stringify({ portfolioGlossary, portfolioBridges })
    expect(text).not.toMatch(/\uFFFD|Ã[^\s]/)
    expect(text).toContain('operação')
    expect(text).toContain('confiável')
  })

  it('glossário tem linguagem simples em português e inglês', () => {
    for (const item of portfolioGlossary) {
      expect(item.definition.pt.length).toBeGreaterThan(0)
      expect(item.definition.en.length).toBeGreaterThan(0)
      expect(item.clientLanguage.pt.length).toBeGreaterThan(0)
      expect(item.clientLanguage.en.length).toBeGreaterThan(0)
    }
  })

  it('ofertas de dados têm exemplo em linguagem de negócio', () => {
    for (const code of ['4.1', '4.2', '4.3', '4.4']) {
      expect(hasPortfolioExample(code, 'pt')).toBe(true)
    }
  })

  it('todas as ofertas têm exemplo curado em português e inglês', () => {
    for (const offer of offers) {
      expect(hasPortfolioExample(offer.code, 'pt')).toBe(true)
      expect(hasPortfolioExample(offer.code, 'en')).toBe(true)
    }
  })

  it('nomenclatura de marca e separação de produtos permanecem consistentes', () => {
    const texto = JSON.stringify({ offers, assets })
    expect(texto).not.toMatch(/Fourmakers|Sec4Sys/)
    expect(offers.find(offer => offer.code === '8.1')?.name).toContain('FourBlox')
    expect(offers.find(offer => offer.code === '8.1')?.assets).toEqual(['FourBlox'])
    expect(offers.find(offer => offer.code === '8.2')?.name).toContain('FourMakers')
  })

  it('claims internos pendentes não aparecem em blocos públicos', () => {
    const publicText = offers
      .flatMap(offer => [
        ...offer.outcomes,
        ...offer.marketStats.flatMap(stat => [stat.stat, stat.source]),
      ])
      .join(' ')
    expect(publicText).not.toMatch(/a prática declara|pendente de liberação|metas? do produto/i)
  })

  it('usa Pilar como nomenclatura pública em português e inglês', () => {
    expect(pt.portfolio.thesis.axisWord).toBe('Pilar')
    expect(pt.portfolio.thesis.subtitle).toMatch(/seis pilares/i)
    expect(en.portfolio.thesis.axisWord).toBe('Pillar')
    expect(en.portfolio.thesis.subtitle).toMatch(/six value pillars/i)

    const publicData = [
      portfolioPt.thesis.description,
      ...portfolioPt.thesis.principles,
      ...portfolioPt.institutionalBacking.map(item => item.label),
      ...offers.flatMap(offer => [
        offer.boundary ?? '',
        ...offer.differentials.flatMap(item => [item.title, item.detail]),
      ]),
      ...assets.map(asset => asset.description),
    ].join(' ')
    expect(publicData).not.toMatch(/\beixos?\b/i)
    expect(publicData).toMatch(/\bpilares?\b/i)
  })
})
