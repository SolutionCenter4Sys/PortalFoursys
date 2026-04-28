/**
 * Auto-discovery de filtros marcados no DOM via `data-voz-filtro`.
 *
 * Convenção:
 *   - `data-voz-filtro="grupo"` (obrigatório)
 *   - `data-voz-filtro-valor="valor"` (obrigatório)
 *   - `data-voz-filtro-sinonimos="sin1,sin2,sin3"` (opcional)
 *   - `aria-label` recomendado para servir de rótulo se o textContent
 *     não for descritivo.
 */
import type { FiltroDisponivel } from './types'

export function descobrirFiltros(): ReadonlyArray<FiltroDisponivel> {
  if (typeof document === 'undefined') return []
  const els = Array.from(
    document.querySelectorAll<HTMLElement>('[data-voz-filtro][data-voz-filtro-valor]'),
  )
  const seen = new Set<string>()
  const out: FiltroDisponivel[] = []
  for (const el of els) {
    const grupo = el.dataset.vozFiltro ?? ''
    const valor = el.dataset.vozFiltroValor ?? ''
    if (!grupo) continue
    const chave = `${grupo}::${valor}`
    if (seen.has(chave)) continue
    seen.add(chave)
    const rotulo = (el.getAttribute('aria-label') ?? el.textContent ?? valor).trim()
    const sinRaw = el.dataset.vozFiltroSinonimos ?? ''
    const sinonimos = sinRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    out.push({ grupo, valor, rotulo, sinonimos })
  }
  return out
}
