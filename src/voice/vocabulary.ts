/**
 * Vocabulário PT-BR e en-US para o classificador de voz.
 *
 * Cada bloco lista as variações naturais que o classificador aceitará.
 * Mantemos as listas extensas de propósito: cobre coloquialismos,
 * plurais e formas com preposição ("filtrar pelo", "abrir caixa de...").
 */
import type { AlvoAlternar, DirecaoNavegacao, IdiomaVoz } from './types'

export interface VocabularioVoz {
  readonly ajuda: ReadonlyArray<string>
  readonly pausar: ReadonlyArray<string>
  readonly verbosNavegacao: ReadonlyArray<string>
  readonly verbosBusca: ReadonlyArray<string>
  readonly verbosAbrirCaixa: ReadonlyArray<string>
  readonly fecharCaixa: ReadonlyArray<string>
  readonly verbosAbrirDetalhe: ReadonlyArray<string>
  readonly fecharDetalhe: ReadonlyArray<string>
  readonly verbosAplicarFiltro: ReadonlyArray<string>
  readonly limparFiltro: ReadonlyArray<string>
  readonly selecionarCliente: ReadonlyArray<string>
  readonly direcoes: Record<DirecaoNavegacao, ReadonlyArray<string>>
  readonly alternar: Record<AlvoAlternar, ReadonlyArray<string>>
  /** Sinônimos por id de seção (ex.: 'home' → ['início', 'inicio']) */
  readonly sinonimosRotulo: Record<string, ReadonlyArray<string>>
}

// ─── PT-BR ──────────────────────────────────────────────────────────────────

const ptBR: VocabularioVoz = {
  ajuda: ['ajuda', 'me ajude', 'mostrar ajuda', 'que comandos', 'o que posso falar', 'help'],
  pausar: ['pausar voz', 'parar voz', 'desligar microfone', 'parar de ouvir', 'pausar microfone', 'pause'],

  verbosNavegacao: [
    'ir para',
    'ir pra',
    'vai para',
    'vai pra',
    'vamos para',
    'vamos pra',
    'navegar para',
    'navegar pra',
    'navega para',
    'navega pra',
    'abrir',
    'abra',
    'abre',
    'mostrar',
    'mostra',
    'me mostra',
    'me mostre',
    'exibir',
    'exiba',
    'visualizar',
    'visualiza',
    've',
    'ver',
    'me leva para',
    'me leve para',
    'me leva pra',
    'me leve pra',
    'leva para',
    'leva pra',
  ],

  verbosBusca: ['buscar', 'busca', 'procurar', 'procura', 'pesquisar', 'pesquisa', 'achar', 'encontrar'],

  verbosAbrirCaixa: [
    'abrir detalhes da',
    'abrir detalhes do',
    'abrir detalhes de',
    'abrir detalhes das',
    'abrir detalhes dos',
    'abrir detalhe da',
    'abrir detalhe do',
    'abrir detalhe de',
    'abrir caixa da',
    'abrir caixa do',
    'abrir caixa de',
    'abrir a caixa de',
    'abrir caixa',
    'mostrar detalhes da',
    'mostrar detalhes do',
    'mostrar detalhes de',
    'mostrar detalhes das',
    'mostrar detalhes dos',
    'mostrar caixa de',
    'mostrar caixa',
    'ver detalhes da',
    'ver detalhes do',
    'ver detalhes de',
    'ver detalhes das',
    'ver detalhes dos',
    'focar na',
    'focar no',
    'focar nas',
    'focar nos',
    'focar em',
    'destacar',
    'rolar para',
    'rolar até',
    'ir para a caixa de',
    'ir para a caixa',
  ],

  fecharCaixa: [
    'fechar caixa',
    'fechar a caixa',
    'esconder caixa',
    'tirar foco',
    'desfocar caixa',
  ],

  verbosAbrirDetalhe: [
    'explorar',
    'explora',
    'explorar completo',
    'explorar completa',
    'explorar tudo de',
    'aprofundar',
    'aprofunda',
    'aprofundar em',
    'aprofundar sobre',
    'detalhar',
    'detalha',
    'detalhar a',
    'detalhar o',
    'detalhar de',
    'abrir modal',
    'abrir modal de',
    'abrir modal da',
    'abrir modal do',
    'abrir drilldown',
    'abrir drill down',
    'abrir drilldown de',
    'abrir drill down de',
    'abrir tela cheia',
    'abrir o detalhe',
    'abrir o detalhe de',
    'abrir o detalhe da',
    'abrir o detalhe do',
    'abrir detalhe completo',
    'abrir detalhe completo de',
    'abrir detalhe completo da',
    'abrir detalhe completo do',
    'mostrar tudo de',
    'mostrar tudo da',
    'mostrar tudo do',
    'me conta sobre',
    'me conte sobre',
    'me fala sobre',
    'me fale sobre',
    'me explica',
    'me explique',
  ],

  fecharDetalhe: [
    'fechar detalhes',
    'fechar detalhe',
    'fechar modal',
    'fechar o modal',
    'fechar drilldown',
    'fechar drill down',
    'esconder detalhe',
    'esconder detalhes',
    'esconder modal',
    'voltar do detalhe',
    'volta do detalhe',
  ],

  verbosAplicarFiltro: [
    'aplicar filtro de',
    'aplicar filtro pelo',
    'aplicar filtro pela',
    'aplicar filtro para',
    'aplicar filtro',
    'aplica filtro de',
    'aplica filtro',
    'filtrar por',
    'filtrar pelo',
    'filtrar pela',
    'filtrar pelos',
    'filtrar pelas',
    'filtra por',
    'filtra pelo',
    'filtra pela',
    'filtrar',
    'filtra',
    'mostrar somente',
    'mostrar so',
    'mostrar apenas',
    'mostra somente',
    'mostra apenas',
    'mostra so',
    'somente',
    'apenas',
    'so',
  ],

  limparFiltro: [
    'limpar filtro',
    'limpar filtros',
    'limpar os filtros',
    'limpa filtro',
    'limpa filtros',
    'remover filtro',
    'remover filtros',
    'remove filtro',
    'remove filtros',
    'tirar filtro',
    'tirar filtros',
    'tira filtro',
    'tira filtros',
    'resetar filtro',
    'resetar filtros',
    'reseta filtros',
    'mostrar tudo',
    'mostrar todos',
    'mostrar todas',
    'sem filtro',
    'sem filtros',
    'todos',
    'todas',
  ],

  selecionarCliente: [
    'selecionar cliente',
    'seleciona cliente',
    'mudar cliente',
    'muda cliente',
    'trocar cliente',
    'troca cliente',
    'cliente',
    'modo cliente',
    'apresentar para',
    'apresentar para cliente',
  ],

  direcoes: {
    proximo: ['proximo', 'proxima', 'avancar', 'avance', 'avanca', 'segue', 'seguir', 'next', 'continuar', 'continua', 'depois'],
    anterior: ['anterior', 'voltar', 'volte', 'volta', 'retornar', 'retorna', 'previous', 'antes'],
    inicio: ['inicio', 'home', 'comeco', 'principal', 'tela inicial', 'pagina inicial'],
  },

  alternar: {
    tema: ['modo escuro', 'modo claro', 'dark mode', 'light mode', 'mudar tema', 'trocar tema', 'alterna tema', 'alternar tema'],
    idioma: ['mudar idioma', 'trocar idioma', 'alternar idioma', 'mudar lingua', 'trocar lingua', 'mudar para ingles', 'mudar para portugues', 'falar ingles', 'falar portugues', 'switch language'],
    fullscreen: ['tela cheia', 'modo apresentacao', 'apresentacao', 'fullscreen', 'sair de tela cheia', 'sair de apresentacao', 'maximizar', 'minimizar'],
    menu: ['abrir menu', 'fechar menu', 'mostrar menu', 'esconder menu', 'menu lateral'],
    overview: ['agenda', 'visao geral', 'overview', 'mostrar agenda', 'mostrar visao geral', 'esconder agenda', 'fechar agenda'],
    'cliente-selector': ['trocar cliente', 'mudar cliente', 'selecionar cliente', 'modo cliente', 'abrir clientes'],
    'export-pdf': ['exportar pdf', 'exporta pdf', 'baixar pdf', 'gerar pdf', 'salvar pdf', 'modal de exportacao'],
    analytics: ['analytics', 'metricas', 'metricas da sessao', 'painel de analytics', 'estatisticas'],
    busca: ['abrir busca', 'fechar busca', 'mostrar busca', 'esconder busca', 'campo de busca'],
  },

  sinonimosRotulo: {
    home: ['inicio', 'home', 'principal', 'tela inicial'],
    identity: ['quem somos', 'identidade', 'sobre nos', 'sobre a foursys'],
    global: ['presenca global', 'global', 'mapa', 'paises', 'mundo'],
    timeline: ['trajetoria', 'historia', 'linha do tempo', 'evolucao'],
    'why-foursys': ['por que foursys', 'porque foursys', 'diferenciais', 'vantagens'],
    'offers-flagship': ['principais ofertas', 'ofertas flagship', 'ofertas principais', 'flagships'],
    services: ['servicos', 'linhas de servico', 'ofertas', 'solucoes'],
    delivery: ['delivery', 'entrega', 'modelos de entrega', 'estrutura de delivery', 'modelos'],
    alliances: ['aliancas', 'parceiros', 'parcerias', 'aliancas estrategicas'],
    innovation: ['inovacao', 'tendencias', 'inovacoes'],
    'ai-foursys': ['ia na foursys', 'ia foursys', 'inteligencia artificial', 'ai foursys', 'agentes de ia'],
    cases: ['cases', 'casos', 'cases de sucesso', 'estudos de caso', 'historias de sucesso'],
    testimonials: ['depoimentos', 'testemunhos', 'testimonials', 'feedbacks'],
    awards: ['premios', 'premiacoes', 'reconhecimentos', 'certificacoes'],
    'clients-showcase': ['clientes', 'nossos clientes', 'showcase de clientes', 'vitrine de clientes'],
    capabilities: ['capacidades', 'capacidades tecnicas', 'tech stack', 'stack tecnologica', 'expertise'],
    esg: ['esg', 'fourlives', 'sustentabilidade', 'impacto social'],
    insights: ['insights', 'percepcoes', 'thought leadership'],
    faq: ['faq', 'perguntas frequentes', 'duvidas', 'perguntas'],
    'export-pdf': ['exportar pdf', 'exportar', 'baixar pdf', 'gerar pdf'],
  },
}

// ─── en-US ──────────────────────────────────────────────────────────────────

const enUS: VocabularioVoz = {
  ajuda: ['help', 'show help', 'what can i say', 'commands'],
  pausar: ['pause voice', 'stop voice', 'stop listening', 'turn off microphone', 'pause'],

  verbosNavegacao: [
    'go to',
    'navigate to',
    'open',
    'show',
    'show me',
    'display',
    'view',
    'see',
    'take me to',
    'bring me to',
  ],

  verbosBusca: ['search', 'find', 'look for', 'look up'],

  verbosAbrirCaixa: [
    'open details of',
    'open details for',
    'open the details of',
    'open box of',
    'open box',
    'open the box of',
    'show details of',
    'show details for',
    'show box of',
    'view details of',
    'view box of',
    'focus on',
    'highlight',
    'scroll to',
    'go to box of',
    'go to the box of',
  ],

  fecharCaixa: [
    'close box',
    'close the box',
    'hide box',
    'unfocus',
  ],

  verbosAbrirDetalhe: [
    'explore',
    'explore full',
    'explore in full',
    'explore everything about',
    'deep dive',
    'deep dive into',
    'deep dive on',
    'deep dive about',
    'open modal',
    'open modal of',
    'open the modal',
    'open the modal of',
    'open drilldown',
    'open drilldown of',
    'open drill down',
    'open drill down of',
    'open full detail',
    'open full detail of',
    'tell me about',
    'tell me more about',
    'show me more about',
    'detail',
    'detail of',
    'expand',
    'expand on',
  ],

  fecharDetalhe: [
    'close detail',
    'close details',
    'close modal',
    'close the modal',
    'close drilldown',
    'close drill down',
    'hide detail',
    'hide details',
    'hide modal',
    'back from detail',
  ],

  verbosAplicarFiltro: [
    'apply filter for',
    'apply filter by',
    'apply filter',
    'filter by',
    'filter for',
    'filter',
    'show only',
    'only',
    'just',
  ],

  limparFiltro: [
    'clear filter',
    'clear filters',
    'clear all filters',
    'remove filter',
    'remove filters',
    'reset filter',
    'reset filters',
    'show all',
    'show everything',
    'no filter',
    'no filters',
    'all',
  ],

  selecionarCliente: ['select client', 'switch client', 'change client', 'client', 'client mode', 'present to'],

  direcoes: {
    proximo: ['next', 'forward', 'continue', 'after', 'go next'],
    anterior: ['previous', 'back', 'go back', 'before', 'return'],
    inicio: ['home', 'start', 'main', 'main page', 'beginning'],
  },

  alternar: {
    tema: ['dark mode', 'light mode', 'toggle theme', 'switch theme', 'change theme'],
    idioma: ['change language', 'switch language', 'toggle language', 'speak portuguese', 'speak english'],
    fullscreen: ['fullscreen', 'full screen', 'presentation mode', 'exit fullscreen', 'exit presentation', 'maximize', 'minimize'],
    menu: ['open menu', 'close menu', 'show menu', 'hide menu', 'side menu'],
    overview: ['agenda', 'overview', 'show overview', 'hide overview', 'close overview'],
    'cliente-selector': ['switch client', 'change client', 'select client', 'client mode', 'open clients'],
    'export-pdf': ['export pdf', 'download pdf', 'generate pdf', 'save pdf', 'export modal'],
    analytics: ['analytics', 'metrics', 'session metrics', 'analytics panel', 'statistics'],
    busca: ['open search', 'close search', 'show search', 'hide search', 'search field'],
  },

  sinonimosRotulo: {
    home: ['home', 'start', 'main'],
    identity: ['who we are', 'about us', 'identity'],
    global: ['global', 'global presence', 'world map', 'countries'],
    timeline: ['timeline', 'history', 'journey', 'evolution'],
    'why-foursys': ['why foursys', 'differentiators', 'advantages'],
    'offers-flagship': ['key solutions', 'main offers', 'flagship offers', 'flagships'],
    services: ['services', 'service lines', 'solutions'],
    delivery: ['delivery', 'delivery framework', 'delivery models'],
    alliances: ['alliances', 'partners', 'partnerships', 'strategic alliances'],
    innovation: ['innovation', 'trends'],
    'ai-foursys': ['ai at foursys', 'ai foursys', 'artificial intelligence', 'ai agents'],
    cases: ['cases', 'success stories', 'case studies'],
    testimonials: ['testimonials', 'feedback', 'reviews'],
    awards: ['awards', 'certifications', 'recognitions'],
    'clients-showcase': ['clients', 'our clients', 'client showcase'],
    capabilities: ['capabilities', 'technical capabilities', 'tech stack', 'expertise'],
    esg: ['esg', 'fourlives', 'sustainability', 'social impact'],
    insights: ['insights', 'thought leadership', 'perspectives'],
    faq: ['faq', 'questions', 'frequently asked questions'],
    'export-pdf': ['export pdf', 'export', 'download pdf', 'generate pdf'],
  },
}

// ─── Acessor ────────────────────────────────────────────────────────────────

const VOCAB: Record<IdiomaVoz, VocabularioVoz> = {
  'pt-BR': ptBR,
  'en-US': enUS,
}

export function vocabularioPara(idioma: IdiomaVoz): VocabularioVoz {
  return VOCAB[idioma] ?? ptBR
}
