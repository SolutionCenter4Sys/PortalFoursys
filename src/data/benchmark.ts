import type { Language } from '../i18n/types'
import { getSantanderClient } from './clients/santander'
import { getItforumClient } from './clients/itforum'
import type { SocialContact } from '../components/sections/client/SectionClientExtra2'

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type BenchmarkSource = 'santander' | 'itforum' | 'bench-empresas'

export interface BenchmarkContact extends SocialContact {
  source: BenchmarkSource
  sourceLabel: string
}

// ─── Bench Empresas (Pre-Sales Intelligence) ───────────────────────────────

interface BenchEmpresaRaw {
  file: string
  name: string
  company: string
  city: string
  revenue: string
  role: { pt: string; en: string }
  sector: { pt: string; en: string }
  topOffer: { pt: string; en: string }
}

const PRESALES_FOCUS = { pt: 'Pré-Vendas · Inteligência', en: 'Pre-Sales · Intelligence' }

const BENCH_EMPRESAS_RAW: BenchEmpresaRaw[] = [
  {
    file: 'anna-vidal-ifood.html', name: 'Anna Vidal', company: 'iFood', city: 'Osasco/SP',
    revenue: '~R$ 7 bi (FY25)',
    role: { pt: 'Liderança de Tecnologia', en: 'Technology Leadership' },
    sector: { pt: 'Foodtech · Delivery', en: 'Foodtech · Delivery' },
    topOffer: { pt: 'Salesforce / CRM', en: 'Salesforce / CRM' },
  },
  {
    file: 'compra-agora-unilever.html', name: 'Compra Agora · Unilever', company: 'Unilever', city: 'São Paulo/SP',
    revenue: 'N/I',
    role: { pt: 'Compras · RFI/RFP', en: 'Procurement · RFI/RFP' },
    sector: { pt: 'FMCG · B2B Digital', en: 'FMCG · B2B Digital' },
    topOffer: { pt: 'Adobe / RFI-RFP', en: 'Adobe / RFI-RFP' },
  },
  {
    file: 'danilo-guardieiro-caixa-consorcio.html', name: 'Danilo Guardieiro', company: 'CAIXA Consórcio', city: 'São Paulo/SP',
    revenue: 'R$ 44 bi em cotas',
    role: { pt: 'Liderança de TI', en: 'IT Leadership' },
    sector: { pt: 'Consórcios · Serviços Financeiros', en: 'Consortia · Financial Services' },
    topOffer: PRESALES_FOCUS,
  },
  {
    file: 'edson-pereira-filho-bank-of-america.html', name: 'Edson G. Pereira Filho', company: 'Bank of America Brasil', city: 'São Paulo/SP',
    revenue: 'US$ 113,1 bi (FY25)',
    role: { pt: 'CIO · SVP', en: 'CIO · SVP' },
    sector: { pt: 'Banco de Investimento', en: 'Investment Banking' },
    topOffer: PRESALES_FOCUS,
  },
  {
    file: 'gestores-de-compras-unilever.html', name: 'Gestores de Compras', company: 'Unilever', city: 'São Paulo/SP',
    revenue: '€30 bi (2025)',
    role: { pt: 'Compras · Procurement', en: 'Procurement' },
    sector: { pt: 'FMCG · Procurement', en: 'FMCG · Procurement' },
    topOffer: PRESALES_FOCUS,
  },
  {
    file: 'izaias-gomes-piracanjuba.html', name: 'Izaias Gomes', company: 'Grupo Piracanjuba', city: 'Goiânia/GO',
    revenue: 'N/I',
    role: { pt: 'Diretor de TI (CIO)', en: 'IT Director (CIO)' },
    sector: { pt: 'Laticínios · Alimentos', en: 'Dairy · Food' },
    topOffer: PRESALES_FOCUS,
  },
  {
    file: 'joao-borbinha-victoria-seguros.html', name: 'João Borbinha', company: 'VICTORIA Seguros', city: 'Lisboa, PT',
    revenue: 'N/I',
    role: { pt: 'Diretor de Informática', en: 'IT Director' },
    sector: { pt: 'Seguros · Vida & Não Vida', en: 'Insurance · Life & Non-Life' },
    topOffer: PRESALES_FOCUS,
  },
  {
    file: 'joao-santos-ovol-shared-center.html', name: 'João Santos', company: 'OVOL Shared Center', city: 'Oeiras, PT',
    revenue: 'N/I',
    role: { pt: 'Gestor de TI', en: 'IT Manager' },
    sector: { pt: 'Distribuição B2B · Papel/Embalagem', en: 'B2B Distribution · Paper/Packaging' },
    topOffer: PRESALES_FOCUS,
  },
  {
    file: 'kleber-couto-pagar.html', name: 'Kleber Couto', company: 'Pagar', city: 'Minas Gerais',
    revenue: 'N/I',
    role: { pt: 'IT Director', en: 'IT Director' },
    sector: { pt: 'Serviços Financeiros · Pagamentos · BaaS', en: 'Financial Services · Payments · BaaS' },
    topOffer: PRESALES_FOCUS,
  },
  {
    file: 'marcio-maldonado-cinpal.html', name: 'Marcio Maldonado', company: 'CINPAL', city: 'Taboão da Serra/SP',
    revenue: '+20,9% (2024)',
    role: { pt: 'Head de TI', en: 'Head of IT' },
    sector: { pt: 'Indústria · Autopeças', en: 'Industry · Auto Parts' },
    topOffer: PRESALES_FOCUS,
  },
  {
    file: 'mariana-moyses-oliveira-afip.html', name: 'Mariana Moyses Oliveira', company: 'AFIP', city: 'São Paulo/SP',
    revenue: 'N/I',
    role: { pt: 'Liderança de TI', en: 'IT Leadership' },
    sector: { pt: 'Saúde · Medicina Diagnóstica', en: 'Healthcare · Diagnostics' },
    topOffer: PRESALES_FOCUS,
  },
  {
    file: 'quartz-architecture-bank-of-america.html', name: 'Quartz Architecture & QuartzReady', company: 'Bank of America', city: 'São Paulo/SP',
    revenue: 'N/I',
    role: { pt: 'Brief Técnico', en: 'Technical Brief' },
    sector: { pt: 'Banking Tech · Engenharia', en: 'Banking Tech · Engineering' },
    topOffer: { pt: 'Modernização / Quartz', en: 'Modernization / Quartz' },
  },
  {
    file: 'sofia-costa-moreira-cuf.html', name: 'Sofia Costa Moreira', company: 'CUF', city: 'Lisboa, PT',
    revenue: '€890,9 M (2024)',
    role: { pt: 'Gestora de Programas e Projetos de SI', en: 'IT Programs & Projects Manager' },
    sector: { pt: 'Saúde Privada Hospitalar', en: 'Private Hospital Healthcare' },
    topOffer: PRESALES_FOCUS,
  },
  {
    file: 'stella-prearo-borgonovi-vivara.html', name: 'Stella Prearo Borgonovi', company: 'Vivara', city: 'São Paulo/SP',
    revenue: '> R$ 2,7 bi (2025)',
    role: { pt: 'Liderança de TI', en: 'IT Leadership' },
    sector: { pt: 'Varejo · Joalheria', en: 'Retail · Jewelry' },
    topOffer: PRESALES_FOCUS,
  },
  {
    file: 'thermo-fisher-scientific.html', name: 'Thermo Fisher Scientific', company: 'Thermo Fisher Scientific', city: 'Waltham/MA · São Paulo',
    revenue: 'N/I',
    role: { pt: 'Empresa', en: 'Company' },
    sector: { pt: 'Life Sciences Tools', en: 'Life Sciences Tools' },
    topOffer: { pt: 'Integração de TI', en: 'IT Integration' },
  },
  {
    file: 'thiago-habiro-newave-energia.html', name: 'Thiago Habiro', company: 'Newave Energia', city: 'São Paulo/SP',
    revenue: 'N/I',
    role: { pt: 'Liderança de TI', en: 'IT Leadership' },
    sector: { pt: 'Energia Renovável · Comercialização', en: 'Renewable Energy · Trading' },
    topOffer: PRESALES_FOCUS,
  },
  {
    file: 'vendor-ecosystem-bank-of-america.html', name: 'Vendor Ecosystem & Battle Cards', company: 'Bank of America Brasil', city: 'São Paulo/SP',
    revenue: 'N/I',
    role: { pt: 'Inteligência Competitiva', en: 'Competitive Intelligence' },
    sector: { pt: 'Banking · Inteligência Competitiva', en: 'Banking · Competitive Intel' },
    topOffer: { pt: 'Battle Cards', en: 'Battle Cards' },
  },
  {
    file: 'wander-cunha-santander-brasil.html', name: 'Wander Cunha', company: 'Santander Brasil', city: 'São Paulo/SP',
    revenue: 'R$ 83,5 bi (2025)',
    role: { pt: 'Director · F1RST Digital Services', en: 'Director · F1RST Digital Services' },
    sector: { pt: 'Bancário · Serviços Financeiros', en: 'Banking · Financial Services' },
    topOffer: PRESALES_FOCUS,
  },
  {
    file: 'ygor-cezar-oec.html', name: 'Ygor Cezar', company: 'OEC', city: 'São Paulo/SP',
    revenue: 'US$ 2,8 bi (2025e)',
    role: { pt: 'Liderança de TI', en: 'IT Leadership' },
    sector: { pt: 'Construção Pesada · Engenharia', en: 'Heavy Construction · Engineering' },
    topOffer: PRESALES_FOCUS,
  },
]

function getBenchEmpresasContacts(lang: Language): BenchmarkContact[] {
  const label = lang === 'en' ? 'Company Bench' : 'Bench Empresas'
  const briefingLabel = lang === 'en' ? 'Pre-Sales Briefing' : 'Briefing Pré-Vendas'
  return BENCH_EMPRESAS_RAW.map(b => ({
    source: 'bench-empresas',
    sourceLabel: label,
    name: b.name,
    role: b.role[lang],
    company: b.company,
    sector: b.sector[lang],
    city: b.city,
    revenue: b.revenue,
    opportunities: 0,
    topOffer: b.topOffer[lang],
    topScore: 0,
    briefingFiles: [{ label: briefingLabel, file: b.file }],
  }))
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

  return [...santanderContacts, ...itforumContacts, ...getBenchEmpresasContacts(lang)]
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
