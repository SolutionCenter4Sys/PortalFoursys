/**
 * Cobertura de auto-discovery de elementos voice-aware no DOM.
 *
 * - `descobrirDetalhes`: itens drilláveis (cards que abrem modais)
 * - `descobrirFiltros`: filtros instrumentados via `data-voz-filtro`
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { descobrirDetalhes } from './descobrirDetalhes'
import { descobrirFiltros } from './descobrirFiltros'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('descobrirDetalhes', () => {
  it('retorna array vazio quando não há elementos marcados', () => {
    expect(descobrirDetalhes()).toEqual([])
  })

  it('coleta um detalhe completo (id, seção, rótulo, sinônimos)', () => {
    document.body.innerHTML = `
      <button
        data-voz-detalhe="innovation-ia"
        data-voz-detalhe-secao="innovation"
        data-voz-detalhe-rotulo="IA Generativa"
        data-voz-detalhe-sinonimos="ia, agentes, gen ai"
      >Card</button>
    `
    const out = descobrirDetalhes()
    expect(out).toHaveLength(1)
    expect(out[0]).toEqual({
      id: 'innovation-ia',
      secao: 'innovation',
      rotulo: 'IA Generativa',
      sinonimos: ['ia', 'agentes', 'gen ai'],
    })
  })

  it('aplica fallback de rótulo: aria-label → textContent → id', () => {
    document.body.innerHTML = `
      <button data-voz-detalhe="a" data-voz-detalhe-secao="cases" aria-label="Aria Label">x</button>
      <button data-voz-detalhe="b" data-voz-detalhe-secao="cases">Texto Puro</button>
      <button data-voz-detalhe="c" data-voz-detalhe-secao="cases"></button>
    `
    const [a, b, c] = descobrirDetalhes()
    expect(a.rotulo).toBe('Aria Label')
    expect(b.rotulo).toBe('Texto Puro')
    expect(c.rotulo).toBe('c')
  })

  it('descarta elementos sem id ou sem seção', () => {
    document.body.innerHTML = `
      <button data-voz-detalhe="" data-voz-detalhe-secao="cases">x</button>
      <button data-voz-detalhe="a" data-voz-detalhe-secao="">y</button>
    `
    expect(descobrirDetalhes()).toHaveLength(0)
  })

  it('elimina duplicatas pelo mesmo id', () => {
    document.body.innerHTML = `
      <button data-voz-detalhe="dup" data-voz-detalhe-secao="cases">A</button>
      <button data-voz-detalhe="dup" data-voz-detalhe-secao="cases">B</button>
    `
    const out = descobrirDetalhes()
    expect(out).toHaveLength(1)
    expect(out[0].rotulo).toBe('A')
  })
})

describe('descobrirFiltros', () => {
  it('retorna array vazio sem nada marcado', () => {
    expect(descobrirFiltros()).toEqual([])
  })

  it('coleta filtros e separa sinônimos', () => {
    document.body.innerHTML = `
      <button
        data-voz-filtro="setor"
        data-voz-filtro-valor="Financeiro"
        data-voz-filtro-sinonimos="banco, banking"
        aria-label="Financeiro"
      >Financeiro</button>
    `
    const out = descobrirFiltros()
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({
      grupo: 'setor',
      valor: 'Financeiro',
      rotulo: 'Financeiro',
      sinonimos: ['banco', 'banking'],
    })
  })

  it('elimina (grupo, valor) duplicados', () => {
    document.body.innerHTML = `
      <button data-voz-filtro="g" data-voz-filtro-valor="v">A</button>
      <button data-voz-filtro="g" data-voz-filtro-valor="v">B</button>
    `
    expect(descobrirFiltros()).toHaveLength(1)
  })
})
