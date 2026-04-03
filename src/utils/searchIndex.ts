import { navigationItems } from '../data/navigation'
import { faqItems } from '../data/faq'
import { cases } from '../data/cases'
import { serviceLines, deliveryModels } from '../data/services'
import { insights } from '../data/insights'
import { awards, certifications } from '../data/awards'
import { alliances } from '../data/alliances'
import { innovationTrends } from '../data/innovation'
import { kpis, timeline } from '../data/kpis'
import { showcaseClients } from '../data/clientShowcase'
import type { AppSection } from '../types'

export type SearchResultKind =
  | 'section'
  | 'faq'
  | 'case'
  | 'service'
  | 'delivery'
  | 'insight'
  | 'award'
  | 'certification'
  | 'alliance'
  | 'innovation'
  | 'kpi'
  | 'timeline'
  | 'client'

export interface SearchEntry {
  id: string
  kind: SearchResultKind
  title: string
  subtitle: string
  searchable: string
  icon: string
  targetSection: AppSection
  category: string
}

function norm(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

let _index: SearchEntry[] | null = null

export function buildSearchIndex(): SearchEntry[] {
  if (_index) return _index

  const entries: SearchEntry[] = []

  for (const nav of navigationItems) {
    entries.push({
      id: `nav-${nav.id}`,
      kind: 'section',
      title: nav.label,
      subtitle: `${nav.category} · ${nav.description}`,
      searchable: norm(`${nav.label} ${nav.description} ${nav.category}`),
      icon: nav.icon,
      targetSection: nav.id,
      category: 'Sessões',
    })
  }

  for (const faq of faqItems) {
    entries.push({
      id: `faq-${faq.id}`,
      kind: 'faq',
      title: faq.question,
      subtitle: faq.answer.slice(0, 120) + '…',
      searchable: norm(`${faq.question} ${faq.answer} ${faq.category}`),
      icon: 'help-circle',
      targetSection: 'faq',
      category: 'FAQ',
    })
  }

  for (const c of cases) {
    entries.push({
      id: `case-${c.id}`,
      kind: 'case',
      title: c.title,
      subtitle: `${c.client} · ${c.sector} · ${c.type}`,
      searchable: norm(
        `${c.title} ${c.client} ${c.sector} ${c.type} ${c.challenge} ${c.solution} ${c.stack.join(' ')} ${c.results.join(' ')} ${c.overview ?? ''} ${c.testimonial?.quote ?? ''}`
      ),
      icon: 'trophy',
      targetSection: 'cases',
      category: 'Cases',
    })
  }

  for (const svc of serviceLines) {
    entries.push({
      id: `svc-${svc.id}`,
      kind: 'service',
      title: svc.title,
      subtitle: svc.subtitle,
      searchable: norm(
        `${svc.title} ${svc.subtitle} ${svc.problem} ${svc.target} ${svc.tags.join(' ')} ${svc.offerDetail?.valueProposition ?? ''} ${svc.offerDetail?.differentials?.join(' ') ?? ''}`
      ),
      icon: 'layout-grid',
      targetSection: 'services',
      category: 'Serviços',
    })
  }

  for (const dm of deliveryModels) {
    entries.push({
      id: `dm-${dm.id}`,
      kind: 'delivery',
      title: dm.title,
      subtitle: dm.description,
      searchable: norm(`${dm.title} ${dm.description} ${dm.features.join(' ')}`),
      icon: 'package',
      targetSection: 'delivery',
      category: 'Delivery',
    })
  }

  for (const ins of insights) {
    entries.push({
      id: `ins-${ins.id}`,
      kind: 'insight',
      title: ins.title,
      subtitle: `${ins.category} · ${ins.type} · ${ins.author.name}`,
      searchable: norm(`${ins.title} ${ins.excerpt} ${ins.content} ${ins.category} ${ins.type} ${ins.author.name}`),
      icon: 'file-text',
      targetSection: 'insights',
      category: 'Insights',
    })
  }

  for (const aw of awards) {
    entries.push({
      id: `aw-${aw.id}`,
      kind: 'award',
      title: aw.title,
      subtitle: `${aw.subtitle} (${aw.years.join(', ')})`,
      searchable: norm(`${aw.title} ${aw.subtitle} ${aw.years.join(' ')}`),
      icon: 'award',
      targetSection: 'awards',
      category: 'Premiações',
    })
  }

  for (const cert of certifications) {
    entries.push({
      id: `cert-${cert.id}`,
      kind: 'certification',
      title: cert.label,
      subtitle: cert.fullName,
      searchable: norm(`${cert.label} ${cert.fullName}`),
      icon: 'shield-check',
      targetSection: 'awards',
      category: 'Certificações',
    })
  }

  for (const al of alliances) {
    entries.push({
      id: `al-${al.id}`,
      kind: 'alliance',
      title: al.name,
      subtitle: `${al.level} · ${al.description.slice(0, 80)}…`,
      searchable: norm(`${al.name} ${al.level} ${al.description}`),
      icon: 'network',
      targetSection: 'alliances',
      category: 'Alianças',
    })
  }

  for (const trend of innovationTrends) {
    entries.push({
      id: `trend-${trend.id}`,
      kind: 'innovation',
      title: trend.title,
      subtitle: trend.tagline,
      searchable: norm(
        `${trend.title} ${trend.tagline} ${trend.description} ${trend.foursysPosition} ${trend.keyCapabilities.join(' ')} ${trend.deepDive.overview}`
      ),
      icon: 'sparkles',
      targetSection: 'innovation',
      category: 'Inovação',
    })
  }

  for (const kpi of kpis) {
    entries.push({
      id: `kpi-${kpi.label}`,
      kind: 'kpi',
      title: `${kpi.value}${kpi.suffix} ${kpi.label}`,
      subtitle: kpi.description,
      searchable: norm(`${kpi.value} ${kpi.suffix} ${kpi.label} ${kpi.description}`),
      icon: 'bar-chart-2',
      targetSection: 'identity',
      category: 'KPIs',
    })
  }

  for (const t of timeline) {
    entries.push({
      id: `tl-${t.year}-${t.title.slice(0, 20)}`,
      kind: 'timeline',
      title: `${t.year} — ${t.title}`,
      subtitle: t.description.slice(0, 100) + (t.description.length > 100 ? '…' : ''),
      searchable: norm(`${t.year} ${t.title} ${t.description} ${t.era ?? ''}`),
      icon: 'calendar',
      targetSection: 'timeline',
      category: 'Trajetória',
    })
  }

  for (const cl of showcaseClients) {
    entries.push({
      id: `cl-${cl.id}`,
      kind: 'client',
      title: cl.name,
      subtitle: `Setor: ${cl.sector}`,
      searchable: norm(`${cl.name} ${cl.sector}`),
      icon: 'briefcase',
      targetSection: 'clients-showcase',
      category: 'Clientes',
    })
  }

  _index = entries
  return entries
}

export function search(query: string, limit = 30): SearchEntry[] {
  const index = buildSearchIndex()
  if (!query.trim()) return []

  const terms = norm(query).split(/\s+/).filter(Boolean)

  const scored: { entry: SearchEntry; score: number }[] = []

  for (const entry of index) {
    let score = 0
    let allMatch = true

    for (const term of terms) {
      const idx = entry.searchable.indexOf(term)
      if (idx === -1) {
        allMatch = false
        break
      }

      score += 10

      const titleNorm = norm(entry.title)
      if (titleNorm.includes(term)) score += 20
      if (titleNorm.startsWith(term)) score += 15

      if (entry.kind === 'section') score += 5
    }

    if (allMatch && score > 0) {
      scored.push({ entry, score })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map(s => s.entry)
}
