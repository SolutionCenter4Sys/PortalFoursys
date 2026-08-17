import type { EvidenceStatus } from '../types'

/**
 * Tokens do portfólio.
 *
 * As cores de eixo vivem no dado (`portfolio.ts`) em hexadecimal porque a UI
 * compõe alpha por concatenação (`${cor}22`). Tudo o que não vem do dado é
 * variável CSS, para acompanhar a troca de tema claro/escuro.
 */

export const EVIDENCE_COLOR: Record<EvidenceStatus, string> = {
  'liberado': 'rgb(var(--c-evidence-proven))',
  'em-validacao': 'rgb(var(--c-evidence-validating))',
  'sem-lastro': 'rgb(var(--c-evidence-none))',
}

/** Cor de eixo ausente no dado. Hex por causa da composição de alpha. */
export const AXIS_FALLBACK_COLOR = '#22D3EE'

/** Identidade de cada pilar do ecossistema. Hex pelo mesmo motivo. */
export const PILLAR_COLOR = {
  showcase: '#FF6600',
  engine: '#38BDF8',
  future: '#A78BFA',
  foundation: '#94A3B8',
} as const

export const MUTED_COLOR = 'rgb(var(--c-text-muted))'
export const SURFACE_DEEP_COLOR = 'rgb(var(--c-dark-2))'
