/**
 * ExecutorIntencao — port de presentation que aplica intenções
 * classificadas contra os callbacks do AppContext.
 */
import type { AppSection } from '../types'
import type {
  AlvoAlternar,
  DirecaoNavegacao,
  DirecaoScroll,
  IdiomaVoz,
  IntencaoVoz,
} from './types'

export interface ExecutorCallbacks {
  readonly idioma: IdiomaVoz

  readonly navegar: (secao: AppSection, detailId?: string) => void
  readonly direcao: (d: DirecaoNavegacao) => void
  readonly rolar: (d: DirecaoScroll) => void

  readonly alternar: (alvo: AlvoAlternar) => void

  readonly buscar: (termo: string) => void

  readonly selecionarCliente: (nomeOuId: string) => boolean

  readonly abrirCaixa: (caixaId: string) => boolean
  readonly fecharCaixa: () => void

  readonly abrirDetalhe: (detalheId: string) => boolean
  /** Drill-down contextual: devolve `{ sucesso, rotuloEncontrado? }`
   *  para que o executor possa falar o nome do item aberto. */
  readonly abrirDetalheFoco: () => { sucesso: boolean; rotuloEncontrado?: string }
  readonly fecharDetalhe: () => void

  readonly aplicarFiltro: (
    grupo: string,
    valor: string,
  ) => { sucesso: boolean; rotuloEncontrado?: string }
  readonly limparFiltro: (grupo?: string) => boolean

  /** "Voltar" contextual: devolve qual ação foi tomada para o feedback. */
  readonly voltar: () => 'modal-fechado' | 'caixa-desfocada' | 'secao-anterior' | 'nada'

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
  | 'rolar_baixo'
  | 'rolar_cima'
  | 'rolar_topo'
  | 'rolar_fim'
  | 'buscando'
  | 'cliente_ok'
  | 'cliente_falha'
  | 'caixa_ok'
  | 'caixa_falha'
  | 'caixa_fechada'
  | 'detalhe_ok'
  | 'detalhe_falha'
  | 'detalhe_fechado'
  | 'detalhe_foco_falha'
  | 'voltar_modal'
  | 'voltar_caixa'
  | 'voltar_secao'
  | 'voltar_nada'
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
  desconhecido: () => 'Repita.',
  pausada: () => 'Voz pausada.',
  ajuda: () => 'Aqui está a lista de comandos.',
  navegando: (a) => `Indo para ${a}.`,
  direcao_proximo: () => 'Próxima sessão.',
  direcao_anterior: () => 'Sessão anterior.',
  direcao_inicio: () => 'Voltando ao início.',
  rolar_baixo: () => 'Descendo a página.',
  rolar_cima: () => 'Subindo a página.',
  rolar_topo: () => 'Indo ao topo.',
  rolar_fim: () => 'Indo ao fim da página.',
  buscando: (a) => `Buscando por ${a}.`,
  cliente_ok: (a) => `Cliente ${a} selecionado.`,
  cliente_falha: () => 'Não encontrei esse cliente.',
  caixa_ok: (a) => `Abrindo ${a}.`,
  caixa_falha: () => 'Não encontrei essa caixa nesta sessão.',
  caixa_fechada: () => 'Caixa fechada.',
  detalhe_ok: (a) => `Abrindo detalhes de ${a}.`,
  detalhe_falha: () => 'Não encontrei esse detalhe nesta sessão.',
  detalhe_fechado: () => 'Detalhes fechados.',
  detalhe_foco_falha: () => 'Não encontrei nada para detalhar aqui.',
  voltar_modal: () => 'Fechando detalhe.',
  voltar_caixa: () => 'Saindo da caixa.',
  voltar_secao: () => 'Voltando à sessão anterior.',
  voltar_nada: () => 'Você já está no início.',
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
  desconhecido: () => 'Repeat.',
  pausada: () => 'Voice paused.',
  ajuda: () => 'Here is the list of commands.',
  navegando: (a) => `Going to ${a}.`,
  direcao_proximo: () => 'Next section.',
  direcao_anterior: () => 'Previous section.',
  direcao_inicio: () => 'Returning home.',
  rolar_baixo: () => 'Scrolling down.',
  rolar_cima: () => 'Scrolling up.',
  rolar_topo: () => 'Scrolling to top.',
  rolar_fim: () => 'Scrolling to bottom.',
  buscando: (a) => `Searching for ${a}.`,
  cliente_ok: (a) => `Client ${a} selected.`,
  cliente_falha: () => 'I could not find that client.',
  caixa_ok: (a) => `Opening ${a}.`,
  caixa_falha: () => 'I could not find that box on this section.',
  caixa_fechada: () => 'Box closed.',
  detalhe_ok: (a) => `Opening details for ${a}.`,
  detalhe_falha: () => 'I could not find that detail on this section.',
  detalhe_fechado: () => 'Details closed.',
  detalhe_foco_falha: () => 'I could not find anything to expand here.',
  voltar_modal: () => 'Closing detail.',
  voltar_caixa: () => 'Leaving the box.',
  voltar_secao: () => 'Going to previous section.',
  voltar_nada: () => 'You are already at the beginning.',
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

/**
 * Helper para construir um `ResultadoExecucao` cujo feedback NÃO é falado.
 * Mantém a mensagem (para o indicador visual) mas marca `silenciar: true`,
 * fazendo o `useVoiceAssistant` pular a chamada ao TTS.
 *
 * Foi adotado a pedido do usuário, que pediu para remover todos os áudios
 * de retorno após comandos de voz (mantendo apenas o feedback visual).
 */
function muda(idioma: IdiomaVoz, chave: Chave, alvo?: string): ResultadoExecucao {
  return { mensagem: frase(idioma, chave, alvo), silenciar: true }
}

export function executarIntencao(
  intencao: IntencaoVoz,
  cb: ExecutorCallbacks,
): ResultadoExecucao {
  switch (intencao.tipo) {
    case 'desconhecido':
      return muda(cb.idioma, 'desconhecido')

    case 'falar-ajuda': {
      cb.abrirAjuda()
      return muda(cb.idioma, 'ajuda')
    }

    case 'pausar-voz': {
      cb.pausarVoz()
      return muda(cb.idioma, 'pausada')
    }

    case 'alternar': {
      cb.alternar(intencao.alvo)
      const chave: Chave = (`alternou_${intencao.alvo.replace(/-/g, '_')}` as Chave)
      return muda(cb.idioma, chave)
    }

    case 'navegar': {
      cb.navegar(intencao.secao)
      // Feedback "Indo para ..." removido por preferência do usuário:
      // a navegação é visualmente óbvia e a confirmação por voz era
      // redundante. O mapa `frase('navegando', ...)` é mantido caso
      // queiramos reativar no futuro.
      return { mensagem: null, silenciar: true }
    }

    case 'navegar-direcao': {
      cb.direcao(intencao.direcao)
      const chave: Chave =
        intencao.direcao === 'proximo'
          ? 'direcao_proximo'
          : intencao.direcao === 'anterior'
            ? 'direcao_anterior'
            : 'direcao_inicio'
      return muda(cb.idioma, chave)
    }

    case 'rolar': {
      cb.rolar(intencao.direcao)
      const chave: Chave = (`rolar_${intencao.direcao}` as Chave)
      return muda(cb.idioma, chave)
    }

    case 'voltar': {
      const acao = cb.voltar()
      const chave: Chave =
        acao === 'modal-fechado'
          ? 'voltar_modal'
          : acao === 'caixa-desfocada'
            ? 'voltar_caixa'
            : acao === 'secao-anterior'
              ? 'voltar_secao'
              : 'voltar_nada'
      return muda(cb.idioma, chave)
    }

    case 'buscar': {
      cb.buscar(intencao.termo)
      return muda(cb.idioma, 'buscando', intencao.termo)
    }

    case 'selecionar-cliente': {
      const ok = cb.selecionarCliente(intencao.nomeOuId)
      return ok
        ? muda(cb.idioma, 'cliente_ok', intencao.nomeOuId)
        : muda(cb.idioma, 'cliente_falha')
    }

    case 'abrir-caixa': {
      const ok = cb.abrirCaixa(intencao.caixaId)
      return ok
        ? muda(cb.idioma, 'caixa_ok', intencao.rotuloAlvo ?? intencao.caixaId)
        : muda(cb.idioma, 'caixa_falha')
    }

    case 'fechar-caixa': {
      cb.fecharCaixa()
      return muda(cb.idioma, 'caixa_fechada')
    }

    case 'abrir-detalhe': {
      const ok = cb.abrirDetalhe(intencao.detalheId)
      return ok
        ? muda(cb.idioma, 'detalhe_ok', intencao.rotuloAlvo ?? intencao.detalheId)
        : muda(cb.idioma, 'detalhe_falha')
    }

    case 'abrir-detalhe-foco': {
      const r = cb.abrirDetalheFoco()
      return r.sucesso
        ? muda(cb.idioma, 'detalhe_ok', r.rotuloEncontrado ?? '')
        : muda(cb.idioma, 'detalhe_foco_falha')
    }

    case 'fechar-detalhe': {
      cb.fecharDetalhe()
      return muda(cb.idioma, 'detalhe_fechado')
    }

    case 'aplicar-filtro': {
      const r = cb.aplicarFiltro(intencao.grupo, intencao.valor)
      return r.sucesso
        ? muda(cb.idioma, 'filtro_ok', r.rotuloEncontrado ?? intencao.valor)
        : muda(cb.idioma, 'filtro_falha')
    }

    case 'limpar-filtro': {
      const ok = cb.limparFiltro(intencao.grupo)
      return ok
        ? muda(cb.idioma, 'filtro_limpo')
        : muda(cb.idioma, 'filtro_sem_aplicado')
    }
  }
}
