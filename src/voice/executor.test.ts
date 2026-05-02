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
    rolar: vi.fn(),
    alternar: vi.fn(),
    buscar: vi.fn(),
    selecionarCliente: vi.fn().mockReturnValue(true),
    abrirCaixa: vi.fn().mockReturnValue(true),
    fecharCaixa: vi.fn(),
    abrirDetalhe: vi.fn().mockReturnValue(true),
    abrirDetalheFoco: vi.fn().mockReturnValue({ sucesso: true, rotuloEncontrado: 'Card Foco' }),
    fecharDetalhe: vi.fn(),
    voltar: vi.fn().mockReturnValue('secao-anterior'),
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
    expect(r.mensagem).toMatch(/Repita/i)
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

describe('executor — rolar página', () => {
  it.each(['baixo', 'cima', 'topo', 'fim'] as const)(
    'rolar(%s) chama callback e devolve mensagem',
    (direcao) => {
      const cb = criarCallbacks()
      const r = executarIntencao({ tipo: 'rolar', direcao }, cb)
      expect(cb.rolar).toHaveBeenCalledWith(direcao)
      expect(r.mensagem).toBeTruthy()
    },
  )

  it('feedback PT para "baixo" menciona "página"', () => {
    const cb = criarCallbacks()
    const r = executarIntencao({ tipo: 'rolar', direcao: 'baixo' }, cb)
    expect(r.mensagem).toMatch(/página/i)
  })

  it('feedback EN para "topo"', () => {
    const cb = criarCallbacks({ idioma: 'en-US' })
    const r = executarIntencao({ tipo: 'rolar', direcao: 'topo' }, cb)
    expect(r.mensagem).toMatch(/Scrolling to top/i)
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

  it('abrir-detalhe-foco sucesso → fala o rótulo encontrado', () => {
    const cb = criarCallbacks()
    const r = executarIntencao({ tipo: 'abrir-detalhe-foco' }, cb)
    expect(cb.abrirDetalheFoco).toHaveBeenCalledOnce()
    expect(r.mensagem).toMatch(/Card Foco/)
  })

  it('abrir-detalhe-foco falha → mensagem "nada para detalhar"', () => {
    const cb = criarCallbacks({
      abrirDetalheFoco: vi.fn().mockReturnValue({ sucesso: false }),
    })
    const r = executarIntencao({ tipo: 'abrir-detalhe-foco' }, cb)
    expect(r.mensagem).toMatch(/nada para detalhar/i)
  })
})

describe('executor — voltar contextual', () => {
  it('voltar fechando modal devolve mensagem de detalhe (PT)', () => {
    const cb = criarCallbacks({ voltar: vi.fn().mockReturnValue('modal-fechado') })
    const r = executarIntencao({ tipo: 'voltar' }, cb)
    expect(cb.voltar).toHaveBeenCalledOnce()
    expect(r.mensagem).toMatch(/Fechando detalhe/i)
  })

  it('voltar tirando foco da caixa devolve mensagem de caixa (PT)', () => {
    const cb = criarCallbacks({ voltar: vi.fn().mockReturnValue('caixa-desfocada') })
    const r = executarIntencao({ tipo: 'voltar' }, cb)
    expect(r.mensagem).toMatch(/Saindo da caixa/i)
  })

  it('voltar para seção anterior devolve mensagem de seção (PT)', () => {
    const cb = criarCallbacks({ voltar: vi.fn().mockReturnValue('secao-anterior') })
    const r = executarIntencao({ tipo: 'voltar' }, cb)
    expect(r.mensagem).toMatch(/sessão anterior/i)
  })

  it('voltar quando já está no início devolve fallback (PT)', () => {
    const cb = criarCallbacks({ voltar: vi.fn().mockReturnValue('nada') })
    const r = executarIntencao({ tipo: 'voltar' }, cb)
    expect(r.mensagem).toMatch(/já está no início/i)
  })

  it('voltar fechando modal em inglês', () => {
    const cb = criarCallbacks({
      idioma: 'en-US',
      voltar: vi.fn().mockReturnValue('modal-fechado'),
    })
    const r = executarIntencao({ tipo: 'voltar' }, cb)
    expect(r.mensagem).toMatch(/Closing detail/i)
  })

  it('voltar para seção anterior em inglês', () => {
    const cb = criarCallbacks({
      idioma: 'en-US',
      voltar: vi.fn().mockReturnValue('secao-anterior'),
    })
    const r = executarIntencao({ tipo: 'voltar' }, cb)
    expect(r.mensagem).toMatch(/previous section/i)
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
      { tipo: 'navegar-direcao', direcao: 'proximo' },
      cb,
    )
    expect(r.mensagem).toMatch(/Next section/i)
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
