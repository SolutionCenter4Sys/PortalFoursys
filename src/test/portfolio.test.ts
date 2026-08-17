import { describe, it, expect } from 'vitest'
import { portfolioPt } from '../data/portfolio'

const { axes, offers, personas, segments, futureVision, assets, defaultEngagement } = portfolioPt
const codes = new Set(offers.map(o => o.code))

describe('Portfólio 2026 S2 — integridade dos dados', () => {
  it('tem 8 eixos e 18 ofertas', () => {
    expect(axes.length).toBe(8)
    expect(offers.length).toBe(18)
  })

  it('não há códigos nem ids de oferta duplicados', () => {
    expect(codes.size).toBe(offers.length)
    expect(new Set(offers.map(o => o.id)).size).toBe(offers.length)
  })

  it('toda oferta aponta para um eixo existente', () => {
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

  it('todo status de lastro vem acompanhado de justificativa', () => {
    for (const offer of offers) {
      expect(['liberado', 'em-validacao', 'sem-lastro']).toContain(offer.proof.status)
      expect(offer.proof.note.length).toBeGreaterThan(0)
      if (offer.proof.status === 'liberado') {
        expect(offer.proof.cases?.length ?? 0).toBeGreaterThan(0)
      }
    }
  })

  it('conexões entre ofertas referenciam códigos existentes', () => {
    for (const offer of offers) {
      for (const code of offer.connects) {
        expect(codes).toContain(code)
      }
      expect(offer.connects).not.toContain(offer.code)
    }
  })

  it('shortlist de cada persona referencia ofertas existentes e sem repetição', () => {
    for (const persona of personas) {
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

  it('cada eixo de diferenciação tem ao menos uma oferta', () => {
    for (const axis of axes.filter(a => a.role === 'diferenciacao')) {
      expect(offers.some(o => o.axisId === axis.id)).toBe(true)
    }
  })

  // O mapa do ecossistema só torna o card navegável quando o eixo tem oferta, e
  // a mandala exibe a contagem no nó: eixo zerado quebraria as duas leituras.
  it('todo eixo tem ao menos uma oferta detalhada', () => {
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
      expect(base!.investmentGuidance.length).toBeGreaterThan(0)
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
  })
})
