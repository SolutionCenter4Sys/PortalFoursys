/**
 * Cobertura do classificador determinístico de voz.
 *
 * Foco: garantir que o pipeline (ordem de regras) classifica corretamente
 * comandos representativos PT-BR e EN-US e que cada tipo de IntencaoVoz
 * é alcançável a partir de pelo menos uma frase humana.
 */
import { describe, it, expect } from 'vitest'
import { classificadorRegex } from './classifierRegex'
import type { ContextoClassificacao } from './types'

const navegacaoBase: ContextoClassificacao['navegacao'] = [
  { secao: 'home', rotulo: 'Início', descricao: '', categoria: 'Início', icone: '' },
  { secao: 'cases', rotulo: 'Cases de Sucesso', descricao: '', categoria: 'Provas', icone: '' },
  { secao: 'innovation', rotulo: 'Inovação', descricao: '', categoria: 'Ofertas', icone: '' },
  { secao: 'awards', rotulo: 'Premiações', descricao: '', categoria: 'Provas', icone: '' },
  { secao: 'esg', rotulo: 'FourLives — ESG', descricao: '', categoria: 'ESG', icone: '' },
]

const ctxPT: ContextoClassificacao = {
  navegacao: navegacaoBase,
  clientesDisponiveis: [
    { id: 'santander', rotulo: 'Santander' },
    { id: 'bradesco', rotulo: 'Bradesco' },
  ],
  caixasDisponiveis: [
    { id: 'home-kpis', secao: 'home', rotulo: 'KPIs', rotulos: ['kpis', 'indicadores'] },
    { id: 'home-aliancas', secao: 'home', rotulo: 'Alianças', rotulos: ['parceiros', 'aliancas'] },
  ],
  filtrosDisponiveis: [
    { grupo: 'setor', valor: 'Financeiro', rotulo: 'Financeiro', sinonimos: ['banco', 'banking'] },
    { grupo: 'setor', valor: 'Saúde', rotulo: 'Saúde', sinonimos: ['health'] },
    { grupo: 'categoria', valor: 'Todos', rotulo: 'Todos', sinonimos: [] },
  ],
  detalhesDisponiveis: [
    {
      id: 'innovation-ia-generativa',
      secao: 'innovation',
      rotulo: 'IA Generativa',
      sinonimos: ['ia generativa', 'agentic ai', 'agentes autonomos'],
    },
    {
      id: 'offers-ai-squad',
      secao: 'offers-flagship',
      rotulo: 'AI Squad',
      sinonimos: ['ai squad', 'squad de ia'],
    },
  ],
}

function classificar(transcricao: string, idioma: 'pt-BR' | 'en-US' = 'pt-BR') {
  return classificadorRegex.classificarSync(
    { transcricao, idioma, recebidoEm: Date.now() },
    ctxPT,
  )
}

describe('classifierRegex — ajuda e pausa', () => {
  it('reconhece "ajuda"', () => {
    expect(classificar('ajuda').tipo).toBe('falar-ajuda')
  })
  it('reconhece "que comandos posso falar"', () => {
    expect(classificar('que comandos eu posso falar').tipo).toBe('falar-ajuda')
  })
  it('reconhece "pausar voz"', () => {
    expect(classificar('pausar voz').tipo).toBe('pausar-voz')
  })
  it('reconhece "help" em inglês', () => {
    expect(classificar('help', 'en-US').tipo).toBe('falar-ajuda')
  })
})

describe('classifierRegex — alternar', () => {
  it('alternar tema → "modo escuro"', () => {
    const i = classificar('modo escuro')
    expect(i.tipo).toBe('alternar')
    if (i.tipo === 'alternar') expect(i.alvo).toBe('tema')
  })
  it('alternar idioma → "mudar para inglês"', () => {
    const i = classificar('mudar para ingles')
    expect(i.tipo).toBe('alternar')
    if (i.tipo === 'alternar') expect(i.alvo).toBe('idioma')
  })
  it('fullscreen → "tela cheia"', () => {
    const i = classificar('tela cheia')
    expect(i.tipo).toBe('alternar')
    if (i.tipo === 'alternar') expect(i.alvo).toBe('fullscreen')
  })
  it('toggle theme em inglês', () => {
    const i = classificar('toggle theme', 'en-US')
    expect(i.tipo).toBe('alternar')
    if (i.tipo === 'alternar') expect(i.alvo).toBe('tema')
  })
})

describe('classifierRegex — direção', () => {
  it('próximo / next', () => {
    expect(classificar('proximo').tipo).toBe('navegar-direcao')
    expect(classificar('next', 'en-US').tipo).toBe('navegar-direcao')
  })
  it('anterior / previous (mudança explícita de seção)', () => {
    const a = classificar('anterior')
    const b = classificar('previous', 'en-US')
    expect(a.tipo).toBe('navegar-direcao')
    expect(b.tipo).toBe('navegar-direcao')
    if (a.tipo === 'navegar-direcao') expect(a.direcao).toBe('anterior')
    if (b.tipo === 'navegar-direcao') expect(b.direcao).toBe('anterior')
  })
})

describe('classifierRegex — busca', () => {
  it('"buscar por modernização"', () => {
    const i = classificar('buscar por modernizacao')
    expect(i.tipo).toBe('buscar')
    if (i.tipo === 'buscar') expect(i.termo).toBe('modernizacao')
  })
  it('"search for cases" em inglês', () => {
    const i = classificar('search for cases', 'en-US')
    expect(i.tipo).toBe('buscar')
    if (i.tipo === 'buscar') expect(i.termo).toBe('cases')
  })
})

describe('classifierRegex — selecionar cliente', () => {
  it('reconhece e fuzzy-matcha o id', () => {
    const i = classificar('selecionar cliente santander')
    expect(i.tipo).toBe('selecionar-cliente')
    if (i.tipo === 'selecionar-cliente') expect(i.nomeOuId).toBe('santander')
  })
  it('client mode em inglês', () => {
    const i = classificar('select client bradesco', 'en-US')
    expect(i.tipo).toBe('selecionar-cliente')
  })
})

describe('classifierRegex — navegar para seção', () => {
  it('com verbo: "ir para cases"', () => {
    const i = classificar('ir para cases')
    expect(i.tipo).toBe('navegar')
    if (i.tipo === 'navegar') expect(i.secao).toBe('cases')
  })
  it('apenas o nome: "premiações"', () => {
    const i = classificar('premiacoes')
    expect(i.tipo).toBe('navegar')
    if (i.tipo === 'navegar') expect(i.secao).toBe('awards')
  })
  it('"go to innovation" em inglês', () => {
    const i = classificar('go to innovation', 'en-US')
    expect(i.tipo).toBe('navegar')
    if (i.tipo === 'navegar') expect(i.secao).toBe('innovation')
  })
})

describe('classifierRegex — caixas internas', () => {
  it('abrir caixa de KPIs', () => {
    const i = classificar('abrir caixa de kpis')
    expect(i.tipo).toBe('abrir-caixa')
    if (i.tipo === 'abrir-caixa') expect(i.caixaId).toBe('home-kpis')
  })
  it('focar nas alianças', () => {
    const i = classificar('focar nas aliancas')
    expect(i.tipo).toBe('abrir-caixa')
    if (i.tipo === 'abrir-caixa') expect(i.caixaId).toBe('home-aliancas')
  })
  it('fechar caixa', () => {
    expect(classificar('fechar caixa').tipo).toBe('fechar-caixa')
  })
})

describe('classifierRegex — drill-down contextual (sem alvo)', () => {
  it('"trazer detalhes" → abrir-detalhe-foco', () => {
    expect(classificar('trazer detalhes').tipo).toBe('abrir-detalhe-foco')
  })
  it('"detalhar isso" → abrir-detalhe-foco', () => {
    expect(classificar('detalhar isso').tipo).toBe('abrir-detalhe-foco')
  })
  it('"explorar este item" → abrir-detalhe-foco', () => {
    expect(classificar('explorar este item').tipo).toBe('abrir-detalhe-foco')
  })
  it('"mais detalhes" → abrir-detalhe-foco', () => {
    expect(classificar('mais detalhes').tipo).toBe('abrir-detalhe-foco')
  })
  it('"show details" em inglês → abrir-detalhe-foco', () => {
    expect(classificar('show details', 'en-US').tipo).toBe('abrir-detalhe-foco')
  })
  it('"explore this" em inglês → abrir-detalhe-foco', () => {
    expect(classificar('explore this', 'en-US').tipo).toBe('abrir-detalhe-foco')
  })
  it('"explorar IA Generativa" continua sendo abrir-detalhe específico', () => {
    const i = classificar('explorar ia generativa')
    expect(i.tipo).toBe('abrir-detalhe')
  })
})

describe('classifierRegex — drill-down (detalhes)', () => {
  it('explorar IA Generativa', () => {
    const i = classificar('explorar ia generativa')
    expect(i.tipo).toBe('abrir-detalhe')
    if (i.tipo === 'abrir-detalhe') expect(i.detalheId).toBe('innovation-ia-generativa')
  })
  it('me conta sobre AI Squad', () => {
    const i = classificar('me conta sobre ai squad')
    expect(i.tipo).toBe('abrir-detalhe')
    if (i.tipo === 'abrir-detalhe') expect(i.detalheId).toBe('offers-ai-squad')
  })
  it('fechar detalhe', () => {
    expect(classificar('fechar detalhe').tipo).toBe('fechar-detalhe')
  })
  it('"deep dive into AI Squad" em inglês', () => {
    const i = classificar('deep dive into ai squad', 'en-US')
    expect(i.tipo).toBe('abrir-detalhe')
    if (i.tipo === 'abrir-detalhe') expect(i.detalheId).toBe('offers-ai-squad')
  })
})

describe('classifierRegex — filtros', () => {
  it('filtrar por banco (sinônimo)', () => {
    const i = classificar('filtrar por banco')
    expect(i.tipo).toBe('aplicar-filtro')
    if (i.tipo === 'aplicar-filtro') {
      expect(i.grupo).toBe('setor')
      expect(i.valor).toBe('Financeiro')
    }
  })
  it('filtro direto sem verbo: "saude"', () => {
    const i = classificar('saude')
    expect(i.tipo).toBe('aplicar-filtro')
  })
  it('limpar filtros', () => {
    const i = classificar('limpar filtros')
    expect(i.tipo).toBe('limpar-filtro')
  })
  it('limpar filtro de setor', () => {
    const i = classificar('limpar filtros setor')
    expect(i.tipo).toBe('limpar-filtro')
    if (i.tipo === 'limpar-filtro') expect(i.grupo).toBe('setor')
  })
})

describe('classifierRegex — rolar página (scroll)', () => {
  it('"rolar para baixo" → rolar(baixo)', () => {
    const i = classificar('rolar para baixo')
    expect(i.tipo).toBe('rolar')
    if (i.tipo === 'rolar') expect(i.direcao).toBe('baixo')
  })
  it('"descer um pouco" → rolar(baixo)', () => {
    const i = classificar('descer um pouco')
    expect(i.tipo).toBe('rolar')
    if (i.tipo === 'rolar') expect(i.direcao).toBe('baixo')
  })
  it('"subir a página" → rolar(cima)', () => {
    const i = classificar('subir a pagina')
    expect(i.tipo).toBe('rolar')
    if (i.tipo === 'rolar') expect(i.direcao).toBe('cima')
  })
  it('"ir para o topo" → rolar(topo)', () => {
    const i = classificar('ir para o topo')
    expect(i.tipo).toBe('rolar')
    if (i.tipo === 'rolar') expect(i.direcao).toBe('topo')
  })
  it('"fim da página" → rolar(fim)', () => {
    const i = classificar('fim da pagina')
    expect(i.tipo).toBe('rolar')
    if (i.tipo === 'rolar') expect(i.direcao).toBe('fim')
  })
  it('"scroll down" em inglês → rolar(baixo)', () => {
    const i = classificar('scroll down', 'en-US')
    expect(i.tipo).toBe('rolar')
    if (i.tipo === 'rolar') expect(i.direcao).toBe('baixo')
  })
  it('"go to bottom" em inglês → rolar(fim)', () => {
    const i = classificar('go to bottom', 'en-US')
    expect(i.tipo).toBe('rolar')
    if (i.tipo === 'rolar') expect(i.direcao).toBe('fim')
  })
  it('palavra única "topo" → rolar(topo)', () => {
    const i = classificar('topo')
    expect(i.tipo).toBe('rolar')
    if (i.tipo === 'rolar') expect(i.direcao).toBe('topo')
  })
  it('palavra única "down" em inglês → rolar(baixo)', () => {
    const i = classificar('down', 'en-US')
    expect(i.tipo).toBe('rolar')
    if (i.tipo === 'rolar') expect(i.direcao).toBe('baixo')
  })
  it('"desce até inovação" NÃO vira scroll (palavra solta exige isolamento)', () => {
    const i = classificar('desce ate inovacao')
    expect(i.tipo).not.toBe('rolar')
  })
})

describe('classifierRegex — voltar contextual', () => {
  it('"voltar" sozinho vira intent voltar', () => {
    const i = classificar('voltar')
    expect(i.tipo).toBe('voltar')
  })
  it('"volta" sozinho vira intent voltar', () => {
    expect(classificar('volta').tipo).toBe('voltar')
  })
  it('"volte" sozinho vira intent voltar', () => {
    expect(classificar('volte').tipo).toBe('voltar')
  })
  it('"voltar atras" vira intent voltar (multi-palavra)', () => {
    expect(classificar('voltar atras').tipo).toBe('voltar')
  })
  it('"back" em inglês vira intent voltar', () => {
    expect(classificar('back', 'en-US').tipo).toBe('voltar')
  })
  it('"go back" em inglês vira intent voltar', () => {
    expect(classificar('go back', 'en-US').tipo).toBe('voltar')
  })
  it('"anterior" continua sendo navegar-direcao (mudança de seção)', () => {
    const i = classificar('anterior')
    expect(i.tipo).toBe('navegar-direcao')
    if (i.tipo === 'navegar-direcao') expect(i.direcao).toBe('anterior')
  })
  it('"sessao anterior" continua sendo navegar-direcao', () => {
    const i = classificar('sessao anterior')
    expect(i.tipo).toBe('navegar-direcao')
  })
  it('"previous" em inglês continua navegar-direcao', () => {
    const i = classificar('previous', 'en-US')
    expect(i.tipo).toBe('navegar-direcao')
  })
  it('"voltar" não dispara navegar-direcao mais', () => {
    const i = classificar('voltar')
    expect(i.tipo).not.toBe('navegar-direcao')
  })
})

describe('classifierRegex — desconhecido', () => {
  it('texto fora do vocabulário', () => {
    const i = classificar('xpto qwerty')
    expect(i.tipo).toBe('desconhecido')
  })
  it('texto vazio', () => {
    const i = classificar('   ')
    expect(i.tipo).toBe('desconhecido')
  })
})

describe('classifierRegex — fallback fuzzy (comandos parecidos)', () => {
  it('"ajud" (faltou letra) → falar-ajuda', () => {
    expect(classificar('ajud').tipo).toBe('falar-ajuda')
  })
  it('"voltarr" (letra duplicada) → voltar', () => {
    expect(classificar('voltarr').tipo).toBe('voltar')
  })
  it('"topu" (letra trocada) → rolar topo', () => {
    const i = classificar('topu')
    expect(i.tipo).toBe('rolar')
    if (i.tipo === 'rolar') expect(i.direcao).toBe('topo')
  })
  it('"proximu" (letra trocada) → navegar-direcao próximo', () => {
    const i = classificar('proximu')
    expect(i.tipo).toBe('navegar-direcao')
    if (i.tipo === 'navegar-direcao') expect(i.direcao).toBe('proximo')
  })
  it('"inico" (letra trocada) → navegar-direcao início', () => {
    const i = classificar('inico')
    expect(i.tipo).toBe('navegar-direcao')
    if (i.tipo === 'navegar-direcao') expect(i.direcao).toBe('inicio')
  })
  it('"fechar moodal" (letra duplicada) → fechar-detalhe', () => {
    expect(classificar('fechar moodal').tipo).toBe('fechar-detalhe')
  })
  it('"helpe" em inglês (letra extra) → falar-ajuda', () => {
    expect(classificar('helpe', 'en-US').tipo).toBe('falar-ajuda')
  })
  it('"backk" em inglês (letra duplicada) → voltar', () => {
    expect(classificar('backk', 'en-US').tipo).toBe('voltar')
  })
  it('texto sem similaridade alguma continua desconhecido', () => {
    expect(classificar('xpto qwerty asdf').tipo).toBe('desconhecido')
  })
})
