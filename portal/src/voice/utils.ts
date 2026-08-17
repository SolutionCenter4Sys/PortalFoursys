/**
 * Utilitários de texto para o classificador de voz.
 *
 * - normalizar: lowercase + NFD (remove acentos) + colapso de espaços.
 * - similaridade: Levenshtein normalizado em [0, 1] tolerante.
 * - contemPalavra: testa palavra inteira (com bordas \b ASCII).
 */

export function normalizar(texto: string): string {
  return (texto ?? '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function contemPalavra(texto: string, palavra: string): boolean {
  if (!palavra) return false
  const t = texto
  const p = palavra
  // Bordas baseadas em "não-letra/dígito" — funciona para PT já normalizado.
  const padrao = new RegExp(`(^|[^a-z0-9])${escapeRegex(p)}([^a-z0-9]|$)`)
  return padrao.test(t)
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Similaridade entre 0 e 1 (1 = igual). Combina prefix-overlap + Levenshtein. */
export function similaridade(a: string, b: string): number {
  if (!a || !b) return 0
  if (a === b) return 1
  if (a.includes(b) || b.includes(a)) {
    const menor = Math.min(a.length, b.length)
    const maior = Math.max(a.length, b.length)
    return 0.85 + 0.15 * (menor / maior)
  }
  const distancia = levenshtein(a, b)
  const denom = Math.max(a.length, b.length)
  return denom === 0 ? 0 : 1 - distancia / denom
}

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp = new Array<number>(n + 1)
  for (let j = 0; j <= n; j++) dp[j] = j
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j]
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost)
      prev = tmp
    }
  }
  return dp[n]
}
