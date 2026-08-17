/**
 * Classificador determinístico (regex + fuzzy) das intenções de voz.
 *
 * Pipeline (ordem importa):
 *   1. Ajuda / Pausa
 *   2. Fechar detalhe / Fechar caixa  (frases isoladas)
 *   3. Limpar filtro (frase isolada)
 *   4. Abrir detalhe / Abrir caixa / Aplicar filtro (verbos específicos)
 *   5. Selecionar cliente
 *   6. Rolar página (scroll de viewport — antes de alternar/direcao
 *      para evitar colisão com palavras curtas como "topo"/"down")
 *   7. Alternar (tema, idioma, fullscreen, menu, etc)
 *   8. Direção (próximo / anterior / início)
 *   9. Buscar
 *  10. Navegar com verbo + destino
 *  11. Fallbacks: detalhe / caixa por verbo de nav, filtro só com rótulo,
 *      navegar só com nome do destino
 *  12. Desconhecido
 */
import type {
  AlvoAlternar,
  CaixaSecao,
  ComandoVoz,
  ContextoClassificacao,
  DetalheDisponivel,
  DirecaoNavegacao,
  DirecaoScroll,
  FiltroDisponivel,
  IClassificadorIntencao,
  IntencaoVoz,
  NavegacaoItem,
} from './types'
import { contemPalavra, normalizar, similaridade } from './utils'
import { vocabularioPara, type VocabularioVoz } from './vocabulary'

const THRESHOLD_FUZZY = 0.78
const THRESHOLD_FUZZY_CAIXA = 0.78
const THRESHOLD_FUZZY_DETALHE = 0.78
const THRESHOLD_FUZZY_FILTRO = 0.78
const THRESHOLD_FUZZY_FILTRO_DIRETO = 0.86
const THRESHOLD_FUZZY_NAV_DIRETO = 0.86
/**
 * Threshold do fallback fuzzy global: usado como última tentativa
 * antes de retornar `desconhecido`. Compara a transcrição contra todas
 * as frases canônicas de comandos sem alvo nomeado (ajuda, pausar,
 * voltar, fechar caixa/detalhe, scroll, direção, alternar...). Mais
 * permissivo (0.72) porque o reconhecimento de fala costuma errar
 * 1-2 letras em palavras curtas como "topu" vs "topo".
 */
const THRESHOLD_FUZZY_FALLBACK = 0.72

interface CandidatoNavegacao {
  readonly item: NavegacaoItem
  readonly score: number
}
interface CandidatoCaixa {
  readonly item: CaixaSecao
  readonly score: number
}
interface CandidatoDetalhe {
  readonly item: DetalheDisponivel
  readonly score: number
}
interface CandidatoFiltro {
  readonly item: FiltroDisponivel
  readonly score: number
}

export class RegexIntencaoClassifier implements IClassificadorIntencao {
  readonly id = 'regex'

  async classificar(c: ComandoVoz, ctx: ContextoClassificacao): Promise<IntencaoVoz> {
    return this.classificarSync(c, ctx)
  }

  classificarSync(c: ComandoVoz, ctx: ContextoClassificacao): IntencaoVoz {
    const orig = c.transcricao
    const t = normalizar(orig)
    if (!t) return { tipo: 'desconhecido', transcricao: orig }

    const v = vocabularioPara(c.idioma)

    if (v.ajuda.some((p) => contemFrase(t, p))) return { tipo: 'falar-ajuda' }
    if (v.pausar.some((p) => contemFrase(t, p))) return { tipo: 'pausar-voz' }

    const fecharDetalhe = casarFecharDetalhe(t, v)
    if (fecharDetalhe) return fecharDetalhe

    const fecharCaixa = casarFecharCaixa(t, v)
    if (fecharCaixa) return fecharCaixa

    const limparFiltro = casarLimparFiltro(t, v, ctx)
    if (limparFiltro) return limparFiltro

    // Detalhe contextual ANTES de abrir-detalhe específico para que
    // "trazer detalhes" não exija termo nem lista de drillables.
    const abrirDetalheFoco = casarAbrirDetalheFoco(t, v)
    if (abrirDetalheFoco) return abrirDetalheFoco

    const abrirDetalhe = casarAbrirDetalhe(t, v, ctx)
    if (abrirDetalhe) return abrirDetalhe

    const abrirCaixa = casarAbrirCaixa(t, v, ctx)
    if (abrirCaixa) return abrirCaixa

    const aplicarFiltro = casarAplicarFiltro(t, v, ctx)
    if (aplicarFiltro) return aplicarFiltro

    const cliente = casarSelecionarCliente(t, v, ctx)
    if (cliente) return cliente

    const rolar = casarRolarPagina(t, v)
    if (rolar) return rolar

    // "Voltar" contextual ANTES de direcao para que "voltar" não dispare
    // mudança de seção quando há um modal aberto (a intent `voltar`
    // resolve isso no executor: modal → caixa-foco → seção anterior).
    const voltar = casarVoltar(t, v)
    if (voltar) return voltar

    const alternar = casarAlternar(t, v)
    if (alternar) return alternar

    const direcao = casarDirecao(t, v)
    if (direcao) return direcao

    const busca = casarBusca(t, v)
    if (busca) return busca

    const navegarVerbo = casarNavegarComVerbo(t, v, ctx)
    if (navegarVerbo) return navegarVerbo

    const detalhePeloVerboNav = casarAbrirDetalhePorVerboNav(t, v, ctx)
    if (detalhePeloVerboNav) return detalhePeloVerboNav

    const caixaPeloVerboNav = casarAbrirCaixaPorVerboNav(t, v, ctx)
    if (caixaPeloVerboNav) return caixaPeloVerboNav

    const filtroDireto = casarAplicarFiltroSemVerbo(t, ctx)
    if (filtroDireto) return filtroDireto

    const navegarDireto = casarNavegarSemVerbo(t, v, ctx)
    if (navegarDireto) return navegarDireto

    // Última tentativa: fuzzy match global contra todas as frases
    // canônicas de comandos sem alvo. Cobre casos típicos de erro
    // de reconhecimento (1-2 letras trocadas, plural/singular).
    const fuzzyFallback = casarFuzzyFallback(t, v)
    if (fuzzyFallback) return fuzzyFallback

    return { tipo: 'desconhecido', transcricao: orig }
  }
}

export const classificadorRegex = new RegexIntencaoClassifier()

// ───────────────────────────── matchers ─────────────────────────────

function casarAlternar(t: string, v: VocabularioVoz): IntencaoVoz | null {
  const alvos = Object.entries(v.alternar) as Array<[AlvoAlternar, ReadonlyArray<string>]>
  for (const [alvo, frases] of alvos) {
    if (frases.some((p) => contemFrase(t, p))) {
      return { tipo: 'alternar', alvo }
    }
  }
  return null
}

function casarDirecao(t: string, v: VocabularioVoz): IntencaoVoz | null {
  const direcoes = Object.entries(v.direcoes) as Array<[DirecaoNavegacao, ReadonlyArray<string>]>
  for (const [direcao, frases] of direcoes) {
    if (frases.some((p) => contemPalavra(t, p))) {
      return { tipo: 'navegar-direcao', direcao }
    }
  }
  return null
}

/**
 * Casa intent `voltar` contextual. Para palavras isoladas exige
 * transcrição == frase; para multi-palavras usa `contemFrase`.
 */
function casarVoltar(t: string, v: VocabularioVoz): IntencaoVoz | null {
  for (const frase of v.voltar) {
    const fraseN = normalizar(frase)
    if (!fraseN) continue
    if (fraseN.includes(' ')) {
      if (contemFrase(t, fraseN)) return { tipo: 'voltar' }
    } else if (t === fraseN) {
      return { tipo: 'voltar' }
    }
  }
  return null
}

/**
 * Casa intent `rolar` (scroll de página). Para frases multi-palavras usa
 * `contemFrase`; para palavras únicas (ex.: "desce", "topo", "down") exige
 * que a transcrição inteira seja apenas aquela palavra — assim "desce até
 * inovação" não vira scroll, mas "desce" sim.
 */
function casarRolarPagina(t: string, v: VocabularioVoz): IntencaoVoz | null {
  const direcoes = Object.entries(v.scroll) as Array<[DirecaoScroll, ReadonlyArray<string>]>
  for (const [direcao, frases] of direcoes) {
    for (const frase of frases) {
      const fraseN = normalizar(frase)
      if (!fraseN) continue
      if (fraseN.includes(' ')) {
        if (contemFrase(t, fraseN)) return { tipo: 'rolar', direcao }
      } else if (t === fraseN) {
        return { tipo: 'rolar', direcao }
      }
    }
  }
  return null
}

function casarBusca(t: string, v: VocabularioVoz): IntencaoVoz | null {
  for (const verbo of v.verbosBusca) {
    const padrao = new RegExp(
      `(^|\\s)${escapeRegex(normalizar(verbo))}\\s+(?:por\\s+|for\\s+)?(.+)$`,
    )
    const m = padrao.exec(t)
    if (m && m[2]) {
      const termo = m[2].replace(/[.,;:!?]+$/g, '').trim()
      if (termo.length >= 2) return { tipo: 'buscar', termo }
    }
  }
  return null
}

function casarSelecionarCliente(
  t: string,
  v: VocabularioVoz,
  ctx: ContextoClassificacao,
): IntencaoVoz | null {
  for (const verbo of v.selecionarCliente) {
    const padrao = new RegExp(
      `(^|\\s)${escapeRegex(normalizar(verbo))}\\s+(.+)$`,
    )
    const m = padrao.exec(t)
    if (m && m[2]) {
      const nome = m[2].replace(/[.,;:!?]+$/g, '').trim()
      if (nome.length >= 2) {
        return {
          tipo: 'selecionar-cliente',
          nomeOuId: melhorClienteId(nome, ctx) ?? nome,
        }
      }
    }
  }
  return null
}

function melhorClienteId(nomeFalado: string, ctx: ContextoClassificacao): string | null {
  const candidatos = ctx.clientesDisponiveis ?? []
  if (candidatos.length === 0) return null
  const alvo = normalizar(nomeFalado)
  let melhor: { id: string; score: number } | null = null
  for (const c of candidatos) {
    const s = Math.max(
      similaridade(alvo, normalizar(c.id)),
      similaridade(alvo, normalizar(c.rotulo)),
    )
    if (!melhor || s > melhor.score) melhor = { id: c.id, score: s }
  }
  return melhor && melhor.score >= 0.7 ? melhor.id : null
}

function casarNavegarComVerbo(
  t: string,
  v: VocabularioVoz,
  ctx: ContextoClassificacao,
): IntencaoVoz | null {
  for (const verbo of v.verbosNavegacao) {
    const padrao = new RegExp(
      `(^|\\s)${escapeRegex(normalizar(verbo))}\\s+(.+)$`,
    )
    const m = padrao.exec(t)
    if (m && m[2]) {
      const destino = m[2].replace(/[.,;:!?]+$/g, '').trim()
      const cand = melhorCandidato(destino, ctx.navegacao, v)
      if (cand && cand.score >= THRESHOLD_FUZZY) {
        return { tipo: 'navegar', secao: cand.item.secao, rotuloAlvo: cand.item.rotulo }
      }
    }
  }
  return null
}

function casarNavegarSemVerbo(
  t: string,
  v: VocabularioVoz,
  ctx: ContextoClassificacao,
): IntencaoVoz | null {
  const cand = melhorCandidato(t, ctx.navegacao, v)
  if (cand && cand.score >= THRESHOLD_FUZZY_NAV_DIRETO) {
    return { tipo: 'navegar', secao: cand.item.secao, rotuloAlvo: cand.item.rotulo }
  }
  return null
}

function casarFecharCaixa(t: string, v: VocabularioVoz): IntencaoVoz | null {
  return v.fecharCaixa.some((p) => contemFrase(t, p)) ? { tipo: 'fechar-caixa' } : null
}

function casarFecharDetalhe(t: string, v: VocabularioVoz): IntencaoVoz | null {
  return v.fecharDetalhe.some((p) => contemFrase(t, p)) ? { tipo: 'fechar-detalhe' } : null
}

/**
 * Casa intent contextual `abrir-detalhe-foco` — frases sem termo nomeado
 * (ex.: "trazer detalhes", "explorar isso", "show details"). O alvo é
 * resolvido pelo executor inspecionando o DOM (caixa em foco ou card
 * mais centralizado no viewport).
 */
function casarAbrirDetalheFoco(t: string, v: VocabularioVoz): IntencaoVoz | null {
  return v.abrirDetalheFoco.some((p) => contemFrase(t, p))
    ? { tipo: 'abrir-detalhe-foco' }
    : null
}

function casarAbrirDetalhe(
  t: string,
  v: VocabularioVoz,
  ctx: ContextoClassificacao,
): IntencaoVoz | null {
  const detalhes = ctx.detalhesDisponiveis
  if (!detalhes || detalhes.length === 0) return null

  for (const verbo of v.verbosAbrirDetalhe) {
    const padrao = new RegExp(
      `(^|\\s)${escapeRegex(normalizar(verbo))}\\s+(.+)$`,
    )
    const m = padrao.exec(t)
    if (m && m[2]) {
      const termo = m[2].replace(/[.,;:!?]+$/g, '').trim()
      if (termo.length < 2) continue
      const cand = melhorDetalhe(termo, detalhes)
      if (cand && cand.score >= THRESHOLD_FUZZY_DETALHE) {
        return { tipo: 'abrir-detalhe', detalheId: cand.item.id, rotuloAlvo: cand.item.rotulo }
      }
    }
  }
  return null
}

function casarAbrirDetalhePorVerboNav(
  t: string,
  v: VocabularioVoz,
  ctx: ContextoClassificacao,
): IntencaoVoz | null {
  const detalhes = ctx.detalhesDisponiveis
  if (!detalhes || detalhes.length === 0) return null
  for (const verbo of v.verbosNavegacao) {
    const padrao = new RegExp(
      `(^|\\s)${escapeRegex(normalizar(verbo))}\\s+(.+)$`,
    )
    const m = padrao.exec(t)
    if (m && m[2]) {
      const termo = m[2].replace(/[.,;:!?]+$/g, '').trim()
      if (termo.length < 2) continue
      const cand = melhorDetalhe(termo, detalhes)
      if (cand && cand.score >= 0.9) {
        return { tipo: 'abrir-detalhe', detalheId: cand.item.id, rotuloAlvo: cand.item.rotulo }
      }
    }
  }
  return null
}

function casarAbrirCaixa(
  t: string,
  v: VocabularioVoz,
  ctx: ContextoClassificacao,
): IntencaoVoz | null {
  const caixas = ctx.caixasDisponiveis
  if (!caixas || caixas.length === 0) return null

  for (const verbo of v.verbosAbrirCaixa) {
    const padrao = new RegExp(
      `(^|\\s)${escapeRegex(normalizar(verbo))}\\s+(.+)$`,
    )
    const m = padrao.exec(t)
    if (m && m[2]) {
      const termo = m[2].replace(/[.,;:!?]+$/g, '').trim()
      if (termo.length < 2) continue
      const cand = melhorCaixa(termo, caixas)
      if (cand && cand.score >= THRESHOLD_FUZZY_CAIXA) {
        return { tipo: 'abrir-caixa', caixaId: cand.item.id, rotuloAlvo: cand.item.rotulo }
      }
    }
  }
  return null
}

function casarAbrirCaixaPorVerboNav(
  t: string,
  v: VocabularioVoz,
  ctx: ContextoClassificacao,
): IntencaoVoz | null {
  const caixas = ctx.caixasDisponiveis
  if (!caixas || caixas.length === 0) return null
  for (const verbo of v.verbosNavegacao) {
    const padrao = new RegExp(
      `(^|\\s)${escapeRegex(normalizar(verbo))}\\s+(.+)$`,
    )
    const m = padrao.exec(t)
    if (m && m[2]) {
      const termo = m[2].replace(/[.,;:!?]+$/g, '').trim()
      if (termo.length < 2) continue
      const cand = melhorCaixa(termo, caixas)
      if (cand && cand.score >= 0.86) {
        return { tipo: 'abrir-caixa', caixaId: cand.item.id, rotuloAlvo: cand.item.rotulo }
      }
    }
  }
  return null
}

function casarLimparFiltro(
  t: string,
  v: VocabularioVoz,
  ctx: ContextoClassificacao,
): IntencaoVoz | null {
  const filtros = ctx.filtrosDisponiveis
  if (!filtros || filtros.length === 0) return null

  for (const frase of v.limparFiltro) {
    const fraseN = normalizar(frase)
    if (!fraseN) continue
    if (t === fraseN) return { tipo: 'limpar-filtro' }
    if (fraseN.includes(' ')) {
      const padraoComGrupo = new RegExp(`^${escapeRegex(fraseN)}(?:\\s+(.+))?$`)
      const m = padraoComGrupo.exec(t)
      if (m) {
        const grupoFalado = (m[1] ?? '').replace(/[.,;:!?]+$/g, '').trim()
        if (grupoFalado.length === 0) return { tipo: 'limpar-filtro' }
        const grupo = melhorGrupoFiltro(grupoFalado, filtros)
        if (grupo) return { tipo: 'limpar-filtro', grupo }
        // resíduo desconhecido — não tratamos como limpar-filtro.
      }
    } else if (contemPalavra(t, fraseN)) {
      if (t.split(/\s+/).filter(Boolean).length === 1) return { tipo: 'limpar-filtro' }
    }
  }
  return null
}

function casarAplicarFiltro(
  t: string,
  v: VocabularioVoz,
  ctx: ContextoClassificacao,
): IntencaoVoz | null {
  const filtros = ctx.filtrosDisponiveis
  if (!filtros || filtros.length === 0) return null

  for (const verbo of v.verbosAplicarFiltro) {
    const padrao = new RegExp(
      `(^|\\s)${escapeRegex(normalizar(verbo))}\\s+(.+)$`,
    )
    const m = padrao.exec(t)
    if (m && m[2]) {
      const termo = m[2].replace(/[.,;:!?]+$/g, '').trim()
      if (termo.length < 2) continue
      const cand = melhorFiltro(termo, filtros)
      if (cand && cand.score >= THRESHOLD_FUZZY_FILTRO) {
        return {
          tipo: 'aplicar-filtro',
          grupo: cand.item.grupo,
          valor: cand.item.valor,
          rotuloAlvo: cand.item.rotulo,
        }
      }
    }
  }
  return null
}

function casarAplicarFiltroSemVerbo(
  t: string,
  ctx: ContextoClassificacao,
): IntencaoVoz | null {
  const filtros = ctx.filtrosDisponiveis
  if (!filtros || filtros.length === 0) return null
  const cand = melhorFiltro(t, filtros)
  if (cand && cand.score >= THRESHOLD_FUZZY_FILTRO_DIRETO) {
    return {
      tipo: 'aplicar-filtro',
      grupo: cand.item.grupo,
      valor: cand.item.valor,
      rotuloAlvo: cand.item.rotulo,
    }
  }
  return null
}

/**
 * Fallback fuzzy global: tenta encontrar uma intent sem alvo nomeado
 * (ajuda, pausar, voltar, fechar caixa/detalhe, scroll, direção,
 * alternar) cuja frase canônica seja suficientemente próxima da
 * transcrição. Útil para corrigir pequenos erros de reconhecimento
 * como "ajdua" → "ajuda", "topu" → "topo", "voltarr" → "voltar",
 * "modu escuro" → "modo escuro".
 *
 * Estratégia:
 *  - frase canônica multi-palavra: similaridade(transcrição, frase).
 *  - frase canônica de palavra única: também testa cada palavra da
 *    transcrição contra a frase (cobre "topu pagina" → "topo").
 *  - retorna a intent do melhor score se >= THRESHOLD_FUZZY_FALLBACK.
 */
function casarFuzzyFallback(t: string, v: VocabularioVoz): IntencaoVoz | null {
  const candidatos: Array<{ frase: string; intent: IntencaoVoz }> = [
    ...v.ajuda.map((p) => ({ frase: p, intent: { tipo: 'falar-ajuda' } as IntencaoVoz })),
    ...v.pausar.map((p) => ({ frase: p, intent: { tipo: 'pausar-voz' } as IntencaoVoz })),
    ...v.voltar.map((p) => ({ frase: p, intent: { tipo: 'voltar' } as IntencaoVoz })),
    ...v.fecharCaixa.map((p) => ({ frase: p, intent: { tipo: 'fechar-caixa' } as IntencaoVoz })),
    ...v.fecharDetalhe.map((p) => ({ frase: p, intent: { tipo: 'fechar-detalhe' } as IntencaoVoz })),
    ...v.abrirDetalheFoco.map((p) => ({
      frase: p,
      intent: { tipo: 'abrir-detalhe-foco' } as IntencaoVoz,
    })),
  ]
  for (const [direcao, frases] of Object.entries(v.direcoes) as Array<
    [DirecaoNavegacao, ReadonlyArray<string>]
  >) {
    for (const p of frases) {
      candidatos.push({
        frase: p,
        intent: { tipo: 'navegar-direcao', direcao } as IntencaoVoz,
      })
    }
  }
  for (const [direcao, frases] of Object.entries(v.scroll) as Array<
    [DirecaoScroll, ReadonlyArray<string>]
  >) {
    for (const p of frases) {
      candidatos.push({
        frase: p,
        intent: { tipo: 'rolar', direcao } as IntencaoVoz,
      })
    }
  }
  for (const [alvo, frases] of Object.entries(v.alternar) as Array<
    [AlvoAlternar, ReadonlyArray<string>]
  >) {
    for (const p of frases) {
      candidatos.push({
        frase: p,
        intent: { tipo: 'alternar', alvo } as IntencaoVoz,
      })
    }
  }

  const palavrasT = t.split(/\s+/).filter(Boolean)
  let melhor: { intent: IntencaoVoz; score: number } | null = null
  for (const c of candidatos) {
    const fraseN = normalizar(c.frase)
    if (!fraseN) continue
    let score = similaridade(t, fraseN)
    // Para frases canônicas de uma palavra, também tenta cada palavra
    // da transcrição. Isso permite que "topu pagina" case "topo".
    if (!fraseN.includes(' ')) {
      for (const pt of palavrasT) {
        const s = similaridade(pt, fraseN)
        if (s > score) score = s
      }
    }
    if (!melhor || score > melhor.score) melhor = { intent: c.intent, score }
  }
  return melhor && melhor.score >= THRESHOLD_FUZZY_FALLBACK ? melhor.intent : null
}

// ───────────────────────────── helpers ─────────────────────────────

function contemFrase(textoNormalizado: string, frase: string): boolean {
  const padrao = normalizar(frase)
  if (!padrao) return false
  if (padrao.includes(' ')) return textoNormalizado.includes(padrao)
  return contemPalavra(textoNormalizado, padrao)
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function melhorCaixa(termo: string, itens: ReadonlyArray<CaixaSecao>): CandidatoCaixa | null {
  const alvo = normalizar(termo)
  if (!alvo) return null
  let melhor: CandidatoCaixa | null = null
  for (const item of itens) {
    const candidatos = [normalizar(item.id), normalizar(item.rotulo), ...item.rotulos.map((r) => normalizar(r))]
    let score = 0
    for (const c of candidatos) {
      if (!c) continue
      const s = similaridade(alvo, c)
      if (s > score) score = s
    }
    if (!melhor || score > melhor.score) melhor = { item, score }
  }
  return melhor
}

function melhorDetalhe(
  termo: string,
  itens: ReadonlyArray<DetalheDisponivel>,
): CandidatoDetalhe | null {
  const alvo = normalizar(termo)
  if (!alvo) return null
  let melhor: CandidatoDetalhe | null = null
  for (const item of itens) {
    const candidatos = [
      normalizar(item.id),
      normalizar(item.rotulo),
      ...item.sinonimos.map((s) => normalizar(s)),
    ]
    let score = 0
    for (const c of candidatos) {
      if (!c) continue
      const s = similaridade(alvo, c)
      if (s > score) score = s
    }
    if (!melhor || score > melhor.score) melhor = { item, score }
  }
  return melhor
}

function melhorFiltro(termo: string, itens: ReadonlyArray<FiltroDisponivel>): CandidatoFiltro | null {
  const alvo = normalizar(termo)
  if (!alvo) return null
  let melhor: CandidatoFiltro | null = null
  for (const item of itens) {
    const candidatos = [normalizar(item.valor), normalizar(item.rotulo), ...item.sinonimos.map((s) => normalizar(s))]
    let score = 0
    for (const c of candidatos) {
      if (!c) continue
      const s = similaridade(alvo, c)
      if (s > score) score = s
    }
    if (!melhor || score > melhor.score) melhor = { item, score }
  }
  return melhor
}

function melhorGrupoFiltro(grupoFalado: string, itens: ReadonlyArray<FiltroDisponivel>): string | null {
  const alvo = normalizar(grupoFalado)
  if (!alvo) return null
  let melhor: { grupo: string; score: number } | null = null
  const grupos = Array.from(new Set(itens.map((i) => i.grupo)))
  for (const g of grupos) {
    const s = similaridade(alvo, normalizar(g))
    if (!melhor || s > melhor.score) melhor = { grupo: g, score: s }
  }
  return melhor && melhor.score >= 0.7 ? melhor.grupo : null
}

function melhorCandidato(
  termo: string,
  itens: ReadonlyArray<NavegacaoItem>,
  vocab: VocabularioVoz,
): CandidatoNavegacao | null {
  const alvo = normalizar(termo)
  if (!alvo) return null
  let melhor: CandidatoNavegacao | null = null
  for (const item of itens) {
    const candidatos: string[] = [
      normalizar(item.rotulo),
      normalizar(item.descricao),
      normalizar(item.categoria),
      normalizar(String(item.secao)),
    ]
    const sinId = vocab.sinonimosRotulo[String(item.secao)]
    if (sinId) for (const s of sinId) candidatos.push(normalizar(s))
    const sinCat = vocab.sinonimosRotulo[item.categoria]
    if (sinCat) for (const s of sinCat) candidatos.push(normalizar(s))
    let score = 0
    for (const c of candidatos) {
      if (!c) continue
      const s = similaridade(alvo, c)
      if (s > score) score = s
    }
    if (!melhor || score > melhor.score) melhor = { item, score }
  }
  return melhor
}
