/**
 * Types do subsistema de voz "Touchless".
 *
 * Espelha a arquitetura de IntencaoVoz/ContextoClassificacao usada no
 * FoursysPortal_Fourblox, mas adaptada à arquitetura simples do
 * PortalFoursys (Context API + useReducer, sem Clean Arch nem DI).
 */
import type { AppSection, NavigationItem } from '../types'
import type { Language } from '../i18n/types'

// ─── Idiomas suportados ─────────────────────────────────────────────────────

export type IdiomaVoz = 'pt-BR' | 'en-US'

export function idiomaVozFrom(lang: Language): IdiomaVoz {
  return lang === 'en' ? 'en-US' : 'pt-BR'
}

// ─── Comando bruto recebido do reconhecimento de voz ────────────────────────

export interface ComandoVoz {
  readonly transcricao: string
  readonly idioma: IdiomaVoz
  readonly recebidoEm: number
}

// ─── Alvos de "alternar" ────────────────────────────────────────────────────

export type AlvoAlternar =
  | 'tema'
  | 'idioma'
  | 'fullscreen'
  | 'menu'
  | 'overview'
  | 'cliente-selector'
  | 'export-pdf'
  | 'analytics'
  | 'busca'

// ─── Direções de navegação ──────────────────────────────────────────────────

export type DirecaoNavegacao = 'proximo' | 'anterior' | 'inicio'

// ─── União das intenções classificadas ──────────────────────────────────────

export type IntencaoVoz =
  | { readonly tipo: 'desconhecido'; readonly transcricao: string }
  | { readonly tipo: 'falar-ajuda' }
  | { readonly tipo: 'pausar-voz' }
  | { readonly tipo: 'alternar'; readonly alvo: AlvoAlternar }
  | { readonly tipo: 'navegar'; readonly secao: AppSection; readonly rotuloAlvo?: string }
  | { readonly tipo: 'navegar-direcao'; readonly direcao: DirecaoNavegacao }
  | { readonly tipo: 'buscar'; readonly termo: string }
  | { readonly tipo: 'selecionar-cliente'; readonly nomeOuId: string }
  | { readonly tipo: 'abrir-caixa'; readonly caixaId: string; readonly rotuloAlvo?: string }
  | { readonly tipo: 'fechar-caixa' }
  | {
      readonly tipo: 'abrir-detalhe'
      readonly detalheId: string
      readonly rotuloAlvo?: string
    }
  | { readonly tipo: 'fechar-detalhe' }
  | {
      readonly tipo: 'aplicar-filtro'
      readonly grupo: string
      readonly valor: string
      readonly rotuloAlvo?: string
    }
  | { readonly tipo: 'limpar-filtro'; readonly grupo?: string }

// ─── Caixa interna (auto-foco por voz) ──────────────────────────────────────

export interface CaixaSecao {
  readonly id: string
  readonly secao: AppSection
  readonly rotulo: string
  /** Sinônimos / variações para fuzzy matching */
  readonly rotulos: ReadonlyArray<string>
}

// ─── Filtro descoberto dinamicamente no DOM ─────────────────────────────────

export interface FiltroDisponivel {
  readonly grupo: string
  readonly valor: string
  readonly rotulo: string
  readonly sinonimos: ReadonlyArray<string>
}

// ─── Drill-down (modal/detalhe) descoberto no DOM ───────────────────────────

export interface DetalheDisponivel {
  /** Identificador estável do item drillável (ex.: 'innovation-ia-generativa'). */
  readonly id: string
  /** Seção em que o detalhe está (auxilia o classificador a priorizar). */
  readonly secao: AppSection
  /** Rótulo humano (PT/EN) — usado na fala de feedback. */
  readonly rotulo: string
  /** Sinônimos / variações para fuzzy matching. */
  readonly sinonimos: ReadonlyArray<string>
}

// ─── Cliente disponível (para fuzzy de "selecionar cliente") ────────────────

export interface ClienteDisponivel {
  readonly id: string
  readonly rotulo: string
}

// ─── Contexto de classificação ──────────────────────────────────────────────

export interface ContextoClassificacao {
  readonly navegacao: ReadonlyArray<NavegacaoItem>
  readonly clientesDisponiveis?: ReadonlyArray<ClienteDisponivel>
  readonly caixasDisponiveis?: ReadonlyArray<CaixaSecao>
  readonly filtrosDisponiveis?: ReadonlyArray<FiltroDisponivel>
  readonly detalhesDisponiveis?: ReadonlyArray<DetalheDisponivel>
}

/**
 * Versão local de NavigationItem com a `secao` (AppSection) tipada.
 * Mantemos um alias para o item de navegação que o classificador usa.
 */
export interface NavegacaoItem {
  readonly secao: AppSection
  readonly rotulo: string
  readonly descricao: string
  readonly categoria: string
  readonly icone: string
}

export function navItemFromNavigation(item: NavigationItem): NavegacaoItem {
  return {
    secao: item.id,
    rotulo: item.label,
    descricao: item.description,
    categoria: item.category,
    icone: item.icon,
  }
}

// ─── Interface do classificador ─────────────────────────────────────────────

export interface IClassificadorIntencao {
  readonly id: string
  classificarSync(comando: ComandoVoz, contexto: ContextoClassificacao): IntencaoVoz
  classificar(comando: ComandoVoz, contexto: ContextoClassificacao): Promise<IntencaoVoz>
}

// ─── Status de escuta ───────────────────────────────────────────────────────

export type StatusVoz = 'idle' | 'listening' | 'processing' | 'error'
