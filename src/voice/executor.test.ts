/**
 * Cobertura do executor de intenções de voz.
 *
 * Verifica que cada IntencaoVoz aciona o callback correto e devolve uma
 * mensagem de feedback localizada (pt-BR / en-US).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { executarIntencao, type ExecutorCallbacks } from './executor'

function criarCallbacks(
  overrides: Partial<ExecutorCallbacks> = {},
): ExecutorCallbacks {
  return {
    idioma: 'pt-BR',
    navegar: vi.fn(),
    direcao: vi.fn(),
    alternar: vi.fn(),
    buscar: vi.fn(),
    selecionarCliente: vi.fn().mockReturnValue(true),
    abrirCaixa: vi.fn().mockReturnValue(true),
    fecharCaixa: vi.fn(),
    abrirDetalhe: vi.fn().mockReturnValue(true),
    fecharDetalhe: vi.fn(),
    aplicarFiltro: vi.fn().mockReturnValue({ sucesso: true, rotuloEncontrado: 'Banco' }),
    limparFiltro: vi.fn().mockReturnValue(true),
    abrirAjuda: vi.fn(),
    pausarVoz: vi.fn(),
    ...overrides,
  }
}

describe('executor — desconhecido / ajuda / pausa', () => {
  let cb: ExecutorCallbacks
  beforeEach(() => {
    cb = criarCallbacks()
  })

  it('desconhecido devolve fallback PT', () => {
    const r = executarIntencao({ tipo: 'desconhecido', transcricao: 'xpto' }, cb)
    expect(r.mensagem).toMatch(/Não entendi/i)
  })

  it('falar-ajuda chama abrirAjuda', () => {
    const r = executarIntencao({ tipo: 'falar-ajuda' }, cb)
    expect(cb.abrirAjuda).toHaveBeenCalledOnce()
    expect(r.mensagem).toBeTruthy()
  })

  it('pausar-voz chama pausarVoz', () => {
    executarIntencao({ tipo: 'pausar-voz' }, cb)
    expect(cb.pausarVoz).toHaveBeenCalledOnce()
  })
})

describe('executor — alternar', () => {
  it.each([
    'tema',
    'idioma',
    'fullscreen',
    'menu',
    'overview',
    'cliente-selector',
    'export-pdf',
    'analytics',
    'busca',
  ] as const)('alternar(%s) chama callback e devolve mensagem', (alvo) => {
    const cb = criarCallbacks()
    const r = executarIntencao({ tipo: 'alternar', alvo }, cb)
    expect(cb.alternar).toHaveBeenCalledWith(alvo)
    expect(r.mensagem).toBeTruthy()
  })
})

describe('executor — navegação', () => {
  it('navegar dispara callback com seção', () => {
    const cb = criarCallbacks()
    executarIntencao({ tipo: 'navegar', secao: 'cases', rotuloAlvo: 'Cases' }, cb)
    expect(cb.navegar).toHaveBeenCalledWith('cases')
  })

  it('navegar-direcao próxima', () => {
    const cb = criarCallbacks()
    const r = executarIntencao({ tipo: 'navegar-direcao', direcao: 'proximo' }, cb)
    expect(cb.direcao).toHaveBeenCalledWith('proximo')
    expect(r.mensagem).toMatch(/Próxima/i)
  })

  it('navegar-direcao início', () => {
    const cb = criarCallbacks()
    const r = executarIntencao({ tipo: 'navegar-direcao', direcao: 'inicio' }, cb)
    expect(r.mensagem).toMatch(/início/i)
  })
})

describe('executor — buscar / cliente', () => {
  it('buscar passa termo', () => {
    const cb = criarCallbacks()
    const r = executarIntencao({ tipo: 'buscar', termo: 'modernização' }, cb)
    expect(cb.buscar).toHaveBeenCalledWith('modernização')
    expect(r.mensagem).toContain('modernização')
  })

  it('selecionar-cliente sucesso', () => {
    const cb = criarCallbacks()
    const r = executarIntencao({ tipo: 'selecionar-cliente', nomeOuId: 'santander' }, cb)
    expect(r.mensagem).toMatch(/santander/i)
  })

  it('selecionar-cliente falha → mensagem alternativa', () => {
    const cb = criarCallbacks({ selecionarCliente: vi.fn().mockReturnValue(false) })
    const r = executarIntencao({ tipo: 'selecionar-cliente', nomeOuId: 'inexistente' }, cb)
    expect(r.mensagem).toMatch(/Não encontrei/i)
  })
})

describe('executor — caixas', () => {
  it('abrir-caixa sucesso', () => {
    const cb = criarCallbacks()
    const r = executarIntencao({ tipo: 'abrir-caixa', caixaId: 'home-kpis', rotuloAlvo: 'KPIs' }, cb)
    expect(cb.abrirCaixa).toHaveBeenCalledWith('home-kpis')
    expect(r.mensagem).toContain('KPIs')
  })

  it('abrir-caixa falha → mensagem de "não encontrei"', () => {
    const cb = criarCallbacks({ abrirCaixa: vi.fn().mockReturnValue(false) })
    const r = executarIntencao({ tipo: 'abrir-caixa', caixaId: 'nope' }, cb)
    expect(r.mensagem).toMatch(/Não encontrei/i)
  })

  it('fechar-caixa', () => {
    const cb = criarCallbacks()
    executarIntencao({ tipo: 'fechar-caixa' }, cb)
    expect(cb.fecharCaixa).toHaveBeenCalled()
  })
})

describe('executor — drill-down', () => {
  it('abrir-detalhe sucesso', () => {
    const cb = criarCallbacks()
    const r = executarIntencao(
      { tipo: 'abrir-detalhe', detalheId: 'innovation-ia', rotuloAlvo: 'IA Generativa' },
      cb,
    )
    expect(cb.abrirDetalhe).toHaveBeenCalledWith('innovation-ia')
    expect(r.mensagem).toMatch(/IA Generativa/)
  })

  it('abrir-detalhe falha', () => {
    const cb = criarCallbacks({ abrirDetalhe: vi.fn().mockReturnValue(false) })
    const r = executarIntencao({ tipo: 'abrir-detalhe', detalheId: 'fantasma' }, cb)
    expect(r.mensagem).toMatch(/Não encontrei/i)
  })

  it('fechar-detalhe', () => {
    const cb = criarCallbacks()
    executarIntencao({ tipo: 'fechar-detalhe' }, cb)
    expect(cb.fecharDetalhe).toHaveBeenCalled()
  })
})

describe('executor — filtros', () => {
  it('aplicar-filtro sucesso', () => {
    const cb = criarCallbacks()
    const r = executarIntencao(
      { tipo: 'aplicar-filtro', grupo: 'setor', valor: 'Financeiro', rotuloAlvo: 'Banco' },
      cb,
    )
    expect(cb.aplicarFiltro).toHaveBeenCalledWith('setor', 'Financeiro')
    expect(r.mensagem).toMatch(/Banco/)
  })

  it('aplicar-filtro falha', () => {
    const cb = criarCallbacks({
      aplicarFiltro: vi.fn().mockReturnValue({ sucesso: false }),
    })
    const r = executarIntencao(
      { tipo: 'aplicar-filtro', grupo: 'setor', valor: 'Foo' },
      cb,
    )
    expect(r.mensagem).toMatch(/Não encontrei/i)
  })

  it('limpar-filtro sucesso', () => {
    const cb = criarCallbacks()
    const r = executarIntencao({ tipo: 'limpar-filtro' }, cb)
    expect(cb.limparFiltro).toHaveBeenCalled()
    expect(r.mensagem).toMatch(/Filtros limpos/i)
  })

  it('limpar-filtro falha → "não há filtros para limpar"', () => {
    const cb = criarCallbacks({ limparFiltro: vi.fn().mockReturnValue(false) })
    const r = executarIntencao({ tipo: 'limpar-filtro' }, cb)
    expect(r.mensagem).toMatch(/Não há filtros/i)
  })
})

describe('executor — i18n EN', () => {
  it('mensagens em inglês quando idioma="en-US"', () => {
    const cb = criarCallbacks({ idioma: 'en-US' })
    const r = executarIntencao(
      { tipo: 'navegar', secao: 'cases', rotuloAlvo: 'Cases' },
      cb,
    )
    expect(r.mensagem).toMatch(/Going to/i)
  })

  it('feedback de drill-down em EN', () => {
    const cb = criarCallbacks({ idioma: 'en-US' })
    const r = executarIntencao(
      { tipo: 'abrir-detalhe', detalheId: 'foo', rotuloAlvo: 'AI Squad' },
      cb,
    )
    expect(r.mensagem).toMatch(/Opening details/i)
  })

  it('feedback de busca em EN', () => {
    const cb = criarCallbacks({ idioma: 'en-US' })
    const r = executarIntencao({ tipo: 'buscar', termo: 'cases' }, cb)
    expect(r.mensagem).toMatch(/Searching for/i)
  })
})
