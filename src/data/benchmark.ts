import type { Language } from '../i18n/types'
import { getSantanderClient } from './clients/santander'
import { getItforumClient } from './clients/itforum'
import type { SocialContact } from '../components/sections/client/SectionClientExtra2'

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type BenchmarkSource = 'santander' | 'itforum'

export interface BenchmarkContact extends SocialContact {
  source: BenchmarkSource
  sourceLabel: string
}

// ─── Acesso seguro ao bloco extra2 dos clients (fonte dos contatos) ────────

interface SocialContent {
  contacts: SocialContact[]
}

function extractContacts(extra2: { content: unknown } | undefined): SocialContact[] {
  if (!extra2 || typeof extra2 !== 'object') return []
  const c = extra2.content as SocialContent | undefined
  if (!c || !Array.isArray(c.contacts)) return []
  return c.contacts
}

// ─── Lista unificada (Santander + IT Fórum) ────────────────────────────────

export function getBenchmarkContacts(lang: Language = 'pt'): BenchmarkContact[] {
  const santander = getSantanderClient(lang)
  const itforum = getItforumClient(lang)

  const santanderLabel = lang === 'en' ? 'Santander' : 'Santander'
  const itforumLabel = lang === 'en' ? 'IT Forum' : 'IT Fórum'

  const santanderContacts: BenchmarkContact[] = extractContacts(santander.extra2).map(c => ({
    ...c,
    source: 'santander',
    sourceLabel: santanderLabel,
  }))

  const itforumContacts: BenchmarkContact[] = extractContacts(itforum.extra2).map(c => ({
    ...c,
    source: 'itforum',
    sourceLabel: itforumLabel,
  }))

  return [...santanderContacts, ...itforumContacts]
}

// ─── Metadados da seção Benchmark ──────────────────────────────────────────

export function getBenchmarkMeta(lang: Language = 'pt') {
  if (lang === 'en') {
    return {
      title: 'Benchmark — Strategic Contacts',
      subtitle:
        'Unified network of IT leaders mapped across Santander Brazil and IT Forum Trancoso 2026 — ready for strategic outreach and partnership conversations.',
    }
  }
  return {
    title: 'Benchmark — Contatos Estratégicos',
    subtitle:
      'Rede unificada de líderes de TI mapeados no Santander Brasil e no IT Fórum Trancoso 2026 — prontos para abordagens estratégicas e conversas de parceria.',
  }
}
