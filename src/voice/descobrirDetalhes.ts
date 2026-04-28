/**
 * Auto-discovery de itens "drilláveis" (cards que abrem modais) marcados
 * no DOM via `data-voz-detalhe`.
 *
 * Convenção:
 *   - `data-voz-detalhe="id-estavel"` (obrigatório)
 *   - `data-voz-detalhe-secao="ai-foursys"` (obrigatório — deve ser um
 *     `AppSection` válido; usado para priorizar/filtrar)
 *   - `data-voz-detalhe-rotulo="Texto humano"` (opcional — fala melhor)
 *   - `data-voz-detalhe-sinonimos="sin1,sin2"` (opcional)
 *
 * Diferente de `data-voz-caixa` (que apenas foca/scrolla), o executor
 * dispara `.click()` real no elemento marcado, abrindo o modal.
 */
import type { AppSection } from '../types'
import type { DetalheDisponivel } from './types'

function firstNonEmpty(...values: ReadonlyArray<string | null | undefined>): string | null {
  for (const v of values) {
    const trimmed = v?.trim()
    if (trimmed) return trimmed
  }
  return null
}

export function descobrirDetalhes(): ReadonlyArray<DetalheDisponivel> {
  if (typeof document === 'undefined') return []
  const els = Array.from(
    document.querySelectorAll<HTMLElement>('[data-voz-detalhe][data-voz-detalhe-secao]'),
  )
  const seen = new Set<string>()
  const out: DetalheDisponivel[] = []
  for (const el of els) {
    const id = el.dataset.vozDetalhe ?? ''
    const secao = (el.dataset.vozDetalheSecao ?? '') as AppSection
    if (!id || !secao) continue
    if (seen.has(id)) continue
    seen.add(id)
    const rotulo =
      firstNonEmpty(
        el.dataset.vozDetalheRotulo,
        el.getAttribute('aria-label'),
        el.textContent?.trim(),
      ) ?? id
    const sinRaw = el.dataset.vozDetalheSinonimos ?? ''
    const sinonimos = sinRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    out.push({ id, secao, rotulo, sinonimos })
  }
  return out
}
