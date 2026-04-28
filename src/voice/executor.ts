/**
 * ExecutorIntencao — port de presentation que aplica intenções
 * classificadas contra os callbacks do AppContext.
 */
import type { AppSection } from '../types'
import type { AlvoAlternar, DirecaoNavegacao, IdiomaVoz, IntencaoVoz } from './types'

export interface ExecutorCallbacks {
  readonly idioma: IdiomaVoz

  readonly navegar: (secao: AppSection, detailId?: string) => void
  readonly direcao: (d: DirecaoNavegacao) => void

  readonly alternar: (alvo: AlvoAlternar) => void

  readonly buscar: (termo: string) => void

  readonly selecionarCliente: (nomeOuId: string) => boolean

  readonly abrirCaixa: (caixaId: string) => boolean
  readonly fecharCaixa: () => void

  readonly abrirDetalhe: (detalheId: string) => boolean
  readonly fecharDetalhe: () => void

  readonly aplicarFiltro: (
    grupo: string,
    valor: string,
  ) => { sucesso: boolean; rotuloEncontrado?: string }
  readonly limparFiltro: (grupo?: string) => boolean

  readonly abrirAjuda: () => void
  readonly pausarVoz: () => void
}

export interface ResultadoExecucao {
  readonly mensagem: string | null
  readonly silenciar?: boolean
}

// Mapa de feedback PT/EN — espelha o ExecutarIntencaoUseCase do Fourblox.
type Chave =
  | 'desconhecido'
  | 'pausada'
  | 'ajuda'
  | 'navegando'
  | 'direcao_proximo'
  | 'direcao_anterior'
  | 'direcao_inicio'
  | 'buscando'
  | 'cliente_ok'
  | 'cliente_falha'
  | 'caixa_ok'
  | 'caixa_falha'
  | 'caixa_fechada'
  | 'detalhe_ok'
  | 'detalhe_falha'
  | 'detalhe_fechado'
  | 'filtro_ok'
  | 'filtro_falha'
  | 'filtro_limpo'
  | 'filtro_sem_aplicado'
  | 'alternou_tema'
  | 'alternou_idioma'
  | 'alternou_fullscreen'
  | 'alternou_menu'
  | 'alternou_overview'
  | 'alternou_cliente_selector'
  | 'alternou_export_pdf'
  | 'alternou_analytics'
  | 'alternou_busca'

const FRASES_PT: Record<Chave, (a?: string) => string> = {
  desconhecido: () => 'Não entendi. Diga "ajuda" para ver os comandos.',
  pausada: () => 'Voz pausada.',
  ajuda: () => 'Aqui está a lista de comandos.',
  navegando: (a) => `Indo para ${a}.`,
  direcao_proximo: () => 'Próxima sessão.',
  direcao_anterior: () => 'Sessão anterior.',
  direcao_inicio: () => 'Voltando ao início.',
  buscando: (a) => `Buscando por ${a}.`,
  cliente_ok: (a) => `Cliente ${a} selecionado.`,
  cliente_falha: () => 'Não encontrei esse cliente.',
  caixa_ok: (a) => `Abrindo ${a}.`,
  caixa_falha: () => 'Não encontrei essa caixa nesta sessão.',
  caixa_fechada: () => 'Caixa fechada.',
  detalhe_ok: (a) => `Abrindo detalhes de ${a}.`,
  detalhe_falha: () => 'Não encontrei esse detalhe nesta sessão.',
  detalhe_fechado: () => 'Detalhes fechados.',
  filtro_ok: (a) => `Filtro aplicado: ${a}.`,
  filtro_falha: () => 'Não encontrei esse filtro.',
  filtro_limpo: () => 'Filtros limpos.',
  filtro_sem_aplicado: () => 'Não há filtros para limpar.',
  alternou_tema: () => 'Tema alternado.',
  alternou_idioma: () => 'Idioma alternado.',
  alternou_fullscreen: () => 'Modo apresentação alternado.',
  alternou_menu: () => 'Menu alternado.',
  alternou_overview: () => 'Agenda alternada.',
  alternou_cliente_selector: () => 'Seletor de cliente alternado.',
  alternou_export_pdf: () => 'Exportar PDF aberto.',
  alternou_analytics: () => 'Painel de métricas alternado.',
  alternou_busca: () => 'Busca aberta.',
}

const FRASES_EN: Record<Chave, (a?: string) => string> = {
  desconhecido: () => 'I did not understand. Say "help" for commands.',
  pausada: () => 'Voice paused.',
  ajuda: () => 'Here is the list of commands.',
  navegando: (a) => `Going to ${a}.`,
  direcao_proximo: () => 'Next section.',
  direcao_anterior: () => 'Previous section.',
  direcao_inicio: () => 'Returning home.',
  buscando: (a) => `Searching for ${a}.`,
  cliente_ok: (a) => `Client ${a} selected.`,
  cliente_falha: () => 'I could not find that client.',
  caixa_ok: (a) => `Opening ${a}.`,
  caixa_falha: () => 'I could not find that box on this section.',
  caixa_fechada: () => 'Box closed.',
  detalhe_ok: (a) => `Opening details for ${a}.`,
  detalhe_falha: () => 'I could not find that detail on this section.',
  detalhe_fechado: () => 'Details closed.',
  filtro_ok: (a) => `Filter applied: ${a}.`,
  filtro_falha: () => 'I could not find that filter.',
  filtro_limpo: () => 'Filters cleared.',
  filtro_sem_aplicado: () => 'No filters to clear.',
  alternou_tema: () => 'Theme toggled.',
  alternou_idioma: () => 'Language toggled.',
  alternou_fullscreen: () => 'Presentation mode toggled.',
  alternou_menu: () => 'Menu toggled.',
  alternou_overview: () => 'Overview toggled.',
  alternou_cliente_selector: () => 'Client selector toggled.',
  alternou_export_pdf: () => 'Export PDF opened.',
  alternou_analytics: () => 'Metrics panel toggled.',
  alternou_busca: () => 'Search opened.',
}

function frase(idioma: IdiomaVoz, chave: Chave, alvo?: string): string {
  const tabela = idioma === 'en-US' ? FRASES_EN : FRASES_PT
  const fn = tabela[chave]
  return fn(alvo)
}

export function executarIntencao(
  intencao: IntencaoVoz,
  cb: ExecutorCallbacks,
): ResultadoExecucao {
  switch (intencao.tipo) {
    case 'desconhecido':
      return { mensagem: frase(cb.idioma, 'desconhecido') }

    case 'falar-ajuda': {
      cb.abrirAjuda()
      return { mensagem: frase(cb.idioma, 'ajuda') }
    }

    case 'pausar-voz': {
      cb.pausarVoz()
      return { mensagem: frase(cb.idioma, 'pausada') }
    }

    case 'alternar': {
      cb.alternar(intencao.alvo)
      const chave: Chave = (`alternou_${intencao.alvo.replace(/-/g, '_')}` as Chave)
      return { mensagem: frase(cb.idioma, chave) }
    }

    case 'navegar': {
      cb.navegar(intencao.secao)
      const alvo = intencao.rotuloAlvo ?? String(intencao.secao)
      return { mensagem: frase(cb.idioma, 'navegando', alvo) }
    }

    case 'navegar-direcao': {
      cb.direcao(intencao.direcao)
      const chave: Chave =
        intencao.direcao === 'proximo'
          ? 'direcao_proximo'
          : intencao.direcao === 'anterior'
            ? 'direcao_anterior'
            : 'direcao_inicio'
      return { mensagem: frase(cb.idioma, chave) }
    }

    case 'buscar': {
      cb.buscar(intencao.termo)
      return { mensagem: frase(cb.idioma, 'buscando', intencao.termo) }
    }

    case 'selecionar-cliente': {
      const ok = cb.selecionarCliente(intencao.nomeOuId)
      return ok
        ? { mensagem: frase(cb.idioma, 'cliente_ok', intencao.nomeOuId) }
        : { mensagem: frase(cb.idioma, 'cliente_falha') }
    }

    case 'abrir-caixa': {
      const ok = cb.abrirCaixa(intencao.caixaId)
      return ok
        ? { mensagem: frase(cb.idioma, 'caixa_ok', intencao.rotuloAlvo ?? intencao.caixaId) }
        : { mensagem: frase(cb.idioma, 'caixa_falha') }
    }

    case 'fechar-caixa': {
      cb.fecharCaixa()
      return { mensagem: frase(cb.idioma, 'caixa_fechada') }
    }

    case 'abrir-detalhe': {
      const ok = cb.abrirDetalhe(intencao.detalheId)
      return ok
        ? { mensagem: frase(cb.idioma, 'detalhe_ok', intencao.rotuloAlvo ?? intencao.detalheId) }
        : { mensagem: frase(cb.idioma, 'detalhe_falha') }
    }

    case 'fechar-detalhe': {
      cb.fecharDetalhe()
      return { mensagem: frase(cb.idioma, 'detalhe_fechado') }
    }

    case 'aplicar-filtro': {
      const r = cb.aplicarFiltro(intencao.grupo, intencao.valor)
      return r.sucesso
        ? { mensagem: frase(cb.idioma, 'filtro_ok', r.rotuloEncontrado ?? intencao.valor) }
        : { mensagem: frase(cb.idioma, 'filtro_falha') }
    }

    case 'limpar-filtro': {
      const ok = cb.limparFiltro(intencao.grupo)
      return ok
        ? { mensagem: frase(cb.idioma, 'filtro_limpo') }
        : { mensagem: frase(cb.idioma, 'filtro_sem_aplicado') }
    }
  }
}
