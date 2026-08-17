// Generates src/data/casesReference.ts from the official Foursys case index (Excel export).
// Input: a JSON array of { ranking, code, desc, client, sector, nature, tech, tag }
// Output: TypeScript with referenceCasesPt / referenceCasesEn (CaseStudy[]).
// IMPORTANT: factual metadata only — no fabricated metrics/outcomes.

import { readFileSync, writeFileSync } from 'node:fs'

const SRC = process.argv[2]
const OUT = process.argv[3]
const rows = JSON.parse(readFileSync(SRC, 'utf8').replace(/^\uFEFF/, ''))

// ---- helpers ----
const clean = (s) => (s == null ? '' : String(s).replace(/\s+/g, ' ').trim())

function stripLangMarker(title) {
  return clean(
    title
      .replace(/\((?:portugu[eê]s|ingl[eê]s|por|eng|en|pt)\)/gi, '')
      .replace(/\s{2,}/g, ' ')
  )
}

function titleCase(s) {
  return s
    .toLowerCase()
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}

// Known client name normalizations (keep acronyms untouched otherwise)
const CLIENT_FIX = {
  bradesco: 'Bradesco',
  BRADESCO: 'Bradesco',
  'bradesco cartões': 'Bradesco Cartões',
  santander: 'Santander',
  safra: 'Safra',
  Safra: 'Safra',
  itaú: 'Itaú',
  Desconhecido: '__CONFIDENTIAL__',
  'Recicladora ANÔNIMA': 'Recicladora (Confidencial)',
}
function fixClient(c) {
  const t = clean(c)
  if (CLIENT_FIX[t]) return CLIENT_FIX[t]
  // normalize ALL-CAPS single tokens that are not acronyms (len>5)
  return t
}

// sector: source(pt) -> [pt, en]
const SECTOR = {
  Financeira: ['Financeiro', 'Financial'],
  Saúde: ['Saúde', 'Healthcare'],
  Seguros: ['Seguros', 'Insurance'],
  Serviços: ['Serviços', 'Services'],
  Indústria: ['Indústria', 'Industry'],
  Varejo: ['Varejo', 'Retail'],
  Turismo: ['Turismo', 'Tourism'],
  Cosméticos: ['Cosméticos', 'Cosmetics'],
  Energia: ['Energia', 'Energy'],
  Esportiva: ['Esporte', 'Sports'],
  Educação: ['Educação', 'Education'],
  interno: ['Interno', 'Internal'],
  Interno: ['Interno', 'Internal'],
  Construção: ['Construção', 'Construction'],
}
function mapSector(s) {
  const t = clean(s)
  return SECTOR[t] ?? (t ? [t, t] : ['Outros', 'Other'])
}

// nature: source(pt) -> [pt, en]
const NATURE = {
  Projeto: ['Projeto', 'Project'],
  Consultoria: ['Consultoria', 'Consulting'],
  'Squad as a Service': ['Squad as a Service', 'Squad as a Service'],
  Squad: ['Squad Ágil', 'Agile Squad'],
  'Alocação - Bodyshop': ['Alocação de Especialistas', 'Staff Augmentation'],
}
function mapNature(s) {
  const t = clean(s)
  return NATURE[t] ?? (t ? [t, t] : ['Projeto', 'Project'])
}

// PT -> EN dictionary (phrases first / longest match). Applied to titles & tech.
const DICT = [
  // multi-word phrases
  ['squad as a service', 'Squad as a Service'],
  ['squad ágil', 'Agile Squad'],
  ['squad as a service', 'Squad as a Service'],
  ['squads ágeis', 'agile squads'],
  ['substituição de sistema', 'system replacement'],
  ['substituição', 'replacement'],
  ['desenho de arquitetura', 'architecture design'],
  ['desenho da solução', 'solution design'],
  ['desenvolvimento de sistemas', 'systems development'],
  ['construção e configuração de api', 'API build and configuration'],
  ['definição do mvp', 'MVP definition'],
  ['jornada do cliente', 'customer journey'],
  ['banco de dados oracle', 'Oracle database'],
  ['banco de dados', 'database'],
  ['migração de dados', 'data migration'],
  ['arquitetura de microsserviços', 'microservices architecture'],
  ['arquitetura de micro serviços', 'microservices architecture'],
  ['microsserviços', 'microservices'],
  ['micro serviços', 'microservices'],
  ['micro serviço', 'microservice'],
  ['microserviços', 'microservices'],
  ['inteligência artificial', 'artificial intelligence'],
  ['inteligência analítica', 'analytical intelligence'],
  ['modernização de legado', 'legacy modernization'],
  ['modernização de legados', 'legacy modernization'],
  ['modernização dos sistemas', 'systems modernization'],
  ['transformação organizacional', 'organizational transformation'],
  ['transformação digital', 'digital transformation'],
  ['transformação ágil', 'agile transformation'],
  ['transformação cultural', 'cultural transformation'],
  ['gestão da carteira', 'portfolio management'],
  ['gestão documental', 'document management'],
  ['gestão e acompanhamento', 'management and tracking'],
  ['gestão de diagnósticos', 'diagnostics management'],
  ['gestão veicular', 'fleet management'],
  ['gestão assistência', 'assistance management'],
  ['gestão de pessoas', 'people management'],
  ['atualização tecnológica', 'technology upgrade'],
  ['evolução tecnológica', 'technology evolution'],
  ['pagamentos integrados', 'integrated payments'],
  ['meios de pagamento', 'payment methods'],
  ['produtos agregados', 'add-on products'],
  ['propostas de financiamentos', 'financing proposals'],
  ['propostas de financiamento', 'financing proposals'],
  ['novo processo de precificação', 'new pricing process'],
  ['cobrança de aluguel de máquinas', 'machine rental billing'],
  ['cobrança de aluguel', 'rental billing'],
  ['análise de leads', 'lead analysis'],
  ['análise leads', 'lead analysis'],
  ['diversos projetos', 'various projects'],
  ['projetos diversos', 'various projects'],
  ['compensação e reserva', 'clearing and reserve'],
  ['compensação na reserva bancária', 'banking reserve clearing'],
  ['reserva bancária', 'banking reserve'],
  ['conta corrente internacional', 'international checking account'],
  ['mobilidade urbana', 'urban mobility'],
  ['gerenciamento de rotas', 'route management'],
  ['empresa de transporte', 'transportation company'],
  ['plataforma de viagens', 'travel platform'],
  ['plataforma parametrizável de viagem', 'configurable travel platform'],
  ['plataforma de telemetria', 'telemetry platform'],
  ['plataforma unificada de telemetria', 'unified telemetry platform'],
  ['plataforma de e-commerce', 'e-commerce platform'],
  ['plataforma gestão de diagnósticos', 'diagnostics management platform'],
  ['revisão de arquitetura', 'architecture review'],
  ['programa de revisão de arquitetura', 'architecture review program'],
  ['desenvolvimento ágil para arquitetura', 'agile development for architecture'],
  ['governança para integração', 'integration governance'],
  ['desenvolvimento de templates', 'template development'],
  ['especificação de apis', 'API specification'],
  ['mapeamento de api', 'API mapping'],
  ['monitoramento de eventos de dados', 'data event monitoring'],
  ['monitoramento de eventos', 'event monitoring'],
  ['monitoramento de referenciado', 'referral monitoring'],
  ['estratégia de dados', 'data strategy'],
  ['estratégias de dados', 'data strategies'],
  ['frente estratégica de dados', 'strategic data initiative'],
  ['análise de dados', 'data analytics'],
  ['gestão e análise de dados', 'data management and analytics'],
  ['fornecimento de dados analíticos', 'analytical data provisioning'],
  ['ingestão de dados', 'data ingestion'],
  ['indicadores administrativos', 'administrative indicators'],
  ['indicadores comerciais', 'commercial indicators'],
  ['indicadores operacionais', 'operational indicators'],
  ['assistência ao paciente', 'patient assistance'],
  ['produto de genética', 'genetics product'],
  ['medicina de telereabilitação', 'tele-rehabilitation medicine'],
  ['experiencia do atendimento do cliente', 'customer service experience'],
  ['experiência do atendimento do cliente', 'customer service experience'],
  ['reconstrução e atualização do portal do cliente', 'customer portal rebuild and upgrade'],
  ['portal do cliente', 'customer portal'],
  ['novo portal', 'new portal'],
  ['novo website', 'new website'],
  ['sustentar aplicações', 'application sustaining'],
  ['sustentação sap', 'SAP sustaining'],
  ['serviço de implantação e customização', 'deployment and customization service'],
  ['implantação das integrações', 'integrations rollout'],
  ['implantação das migrações', 'migrations rollout'],
  ['escolha de erp', 'ERP selection'],
  ['implantação de erp', 'ERP deployment'],
  ['registro de operações', 'operations registry'],
  ['célula ágil', 'agile cell'],
  ['agilidade e maturidade', 'agility and maturity'],
  ['agilidade escalada', 'scaled agility'],
  ['implementação de squads', 'squads implementation'],
  ['agile coach', 'Agile Coach'],
  ['gerador de insights', 'insights generator'],
  ['comportamento do consumidor', 'consumer behavior'],
  ['consolidação de 2 sistemas consignados', 'consolidation of two payroll-loan systems'],
  ['consolidação de sistemas', 'systems consolidation'],
  ['integração do gateway ao e-commerce', 'gateway-to-e-commerce integration'],
  ['gateway autorizador', 'authorization gateway'],
  ['consultoria de emissão e adquirência', 'issuing and acquiring consulting'],
  ['automação de processos', 'process automation'],
  ['design de soluções', 'solution design'],
  ['design system', 'Design System'],
  ['nova leitura de contratos', 'new contract reading experience'],
  ['screen module', 'Screen Module'],
  ['no crédito imobiliário', 'in real estate credit'],
  ['crédito imobiliário', 'real estate credit'],
  ['aplicativo white label', 'white-label app'],
  ['white label', 'white-label'],
  ['carteiras digitais', 'digital wallets'],
  ['app cartões', 'cards app'],
  ['super app', 'super app'],
  ['programa de fidelidade', 'loyalty program'],
  ['gestão do prestador', 'provider management'],
  ['contract origination', 'Contract Origination'],
  ['originação de contrato', 'contract origination'],
  ['open finance', 'Open Finance'],
  ['cadastro positivo', 'Positive Registry'],
  ['integrador pj', 'corporate integrator'],
  ['apis de integração b2b', 'B2B integration APIs'],
  ['construção das apis de negócio', 'business APIs development'],
  ['construção de aplicação', 'application development'],
  ['construção do app', 'app development'],
  ['criação da adquirência', 'acquiring business creation'],
  ['criação de conta corrente', 'checking account creation'],
  ['soluções de irpf para grande banco', 'income-tax solutions for a major bank'],
  ['arquitetura blockchain', 'blockchain architecture'],
  ['arquitetura multicanal', 'multichannel architecture'],
  ['concepções ágeis', 'agile concepts'],
  ['transformação ágil e produtiva', 'agile and productive transformation'],
  ['evolução da plataforma integrada', 'integrated platform evolution'],
  ['evolução da plataforma', 'platform evolution'],
  ['posição pagamento e demonstrativo pagamento', 'payment position and payment statement'],
  ['apoio à produção de sistemas corporativos', 'support to corporate systems production'],
  ['sistemas corporativos', 'corporate systems'],
  // single words
  ['projeto', 'project'],
  ['consultoria', 'consulting'],
  ['construção', 'development'],
  ['criação', 'creation'],
  ['plataforma', 'platform'],
  ['viagens', 'travel'],
  ['viagem', 'travel'],
  ['gestão', 'management'],
  ['carteira', 'portfolio'],
  ['documental', 'document'],
  ['aquisições', 'acquisitions'],
  ['implementação', 'implementation'],
  ['implantação', 'deployment'],
  ['squads', 'squads'],
  ['agilidade', 'agility'],
  ['maturidade', 'maturity'],
  ['escalada', 'scaled'],
  ['transformação', 'transformation'],
  ['organizacional', 'organizational'],
  ['ágil', 'agile'],
  ['ágeis', 'agile'],
  ['modernização', 'modernization'],
  ['legado', 'legacy'],
  ['legados', 'legacy'],
  ['atualização', 'upgrade'],
  ['tecnológica', 'technology'],
  ['evolução', 'evolution'],
  ['pagamentos', 'payments'],
  ['pagamento', 'payment'],
  ['integrados', 'integrated'],
  ['integrado', 'integrated'],
  ['produtos', 'products'],
  ['produto', 'product'],
  ['agregados', 'add-on'],
  ['financiamentos', 'financing'],
  ['financiamento', 'financing'],
  ['câmbio', 'foreign exchange'],
  ['confidencial', 'confidential'],
  ['indicadores', 'indicators'],
  ['administrativos', 'administrative'],
  ['comerciais', 'commercial'],
  ['operacionais', 'operational'],
  ['assistência', 'assistance'],
  ['paciente', 'patient'],
  ['genética', 'genetics'],
  ['medicina', 'medicine'],
  ['sustentação', 'sustaining'],
  ['sustentar', 'sustaining'],
  ['aplicações', 'applications'],
  ['aplicação', 'application'],
  ['reconstrução', 'rebuild'],
  ['portal', 'portal'],
  ['cliente', 'customer'],
  ['gateway', 'gateway'],
  ['autorizador', 'authorizer'],
  ['inteligência', 'intelligence'],
  ['analítica', 'analytics'],
  ['serviço', 'service'],
  ['customização', 'customization'],
  ['integração', 'integration'],
  ['integrações', 'integrations'],
  ['migrações', 'migrations'],
  ['migração', 'migration'],
  ['escolha', 'selection'],
  ['novo', 'new'],
  ['nova', 'new'],
  ['website', 'website'],
  ['performance', 'performance'],
  ['caminhões', 'trucks'],
  ['unificada', 'unified'],
  ['telemetria', 'telemetry'],
  ['veicular', 'vehicle'],
  ['multimarca', 'multi-brand'],
  ['revisão', 'review'],
  ['arquitetura', 'architecture'],
  ['programa', 'program'],
  ['soluções', 'solutions'],
  ['solução', 'solution'],
  ['mapeamento', 'mapping'],
  ['monitoramento', 'monitoring'],
  ['eventos', 'events'],
  ['evento', 'event'],
  ['dados', 'data'],
  ['estratégia', 'strategy'],
  ['estratégias', 'strategies'],
  ['estratégica', 'strategic'],
  ['frente', 'initiative'],
  ['gerenciamento', 'management'],
  ['rotas', 'routes'],
  ['empresa', 'company'],
  ['transporte', 'transportation'],
  ['seguro', 'insurance'],
  ['seguros', 'insurance'],
  ['mobilidade', 'mobility'],
  ['urbana', 'urban'],
  ['consolidação', 'consolidation'],
  ['sistemas', 'systems'],
  ['sistema', 'system'],
  ['consignados', 'payroll loans'],
  ['consignado', 'payroll loan'],
  ['adquirência', 'acquiring'],
  ['emissão', 'issuing'],
  ['automação', 'automation'],
  ['processos', 'processes'],
  ['processo', 'process'],
  ['eletrônico', 'electronic'],
  ['especificação', 'specification'],
  ['governança', 'governance'],
  ['framework', 'framework'],
  ['desenvolvimento', 'development'],
  ['templates', 'templates'],
  ['precificação', 'pricing'],
  ['análise', 'analysis'],
  ['leads', 'leads'],
  ['marketing', 'marketing'],
  ['diversos', 'various'],
  ['projetos', 'projects'],
  ['compensação', 'clearing'],
  ['reserva', 'reserve'],
  ['bancária', 'banking'],
  ['normativa', 'regulation'],
  ['mensagens', 'messages'],
  ['conta', 'account'],
  ['corrente', 'checking'],
  ['internacional', 'international'],
  ['banco', 'bank'],
  ['brasileiro', 'brazilian'],
  ['consentimento', 'consent'],
  ['fidelidade', 'loyalty'],
  ['prestador', 'provider'],
  ['negócio', 'business'],
  ['negócios', 'business'],
  ['digitais', 'digital'],
  ['digital', 'digital'],
  ['diagnósticos', 'diagnostics'],
  ['referenciado', 'referral'],
  ['hiperautomação', 'hyperautomation'],
]

// Non-destructive translation: replaces only dictionary terms (case-insensitive),
// preserving every other token (proper nouns, tech names) with original casing.
function translate(text) {
  let s = clean(text)
  for (const [pt, en] of DICT) {
    const re = new RegExp(
      `(^|[^\\p{L}\\p{N}])(${escapeRe(pt)})(?=[^\\p{L}\\p{N}]|$)`,
      'giu'
    )
    s = s.replace(re, (_m, pre) => `${pre}${en}`)
  }
  // connectives (case-insensitive, keep surrounding spaces)
  s = s
    .replace(/\s+(da|de|do|das|dos)\s+/gi, ' ')
    .replace(/\s+para\s+/gi, ' for ')
    .replace(/\s+e\s+/gi, ' and ')
    .replace(/\s+(no|na|em)\s+/gi, ' in ')
    .replace(/\s+com\s+/gi, ' with ')
  return clean(s)
}
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function splitTech(tech) {
  if (!tech) return []
  return Array.from(
    new Set(
      tech
        .split(',')
        .map((x) => clean(x))
        .filter(Boolean)
        // drop parenthetical PT glosses like "(integração)"
        .map((x) => x.replace(/\s*\([^)]*\)\s*/g, ' ').trim())
        .filter(Boolean)
    )
  ).slice(0, 12)
}

const SECTOR_COLORS = {
  Financeiro: 'from-blue-600 to-blue-800',
  Saúde: 'from-emerald-600 to-emerald-800',
  Seguros: 'from-violet-600 to-violet-800',
  Serviços: 'from-sky-600 to-sky-800',
  Indústria: 'from-indigo-600 to-indigo-800',
  Varejo: 'from-amber-600 to-amber-800',
  Turismo: 'from-cyan-600 to-cyan-800',
  Cosméticos: 'from-pink-600 to-pink-800',
  Energia: 'from-lime-600 to-lime-800',
  Esporte: 'from-teal-600 to-teal-800',
  Educação: 'from-fuchsia-600 to-fuchsia-800',
  Interno: 'from-slate-600 to-slate-800',
  Construção: 'from-orange-600 to-orange-800',
  Outros: 'from-gray-600 to-gray-800',
}

// ---- dedup (por código E por cliente+título) ----
const seenKey = new Set()
const seenCode = new Set()
const items = []
for (const r of rows) {
  const code = clean(r.code)
  const rawTitle = stripLangMarker(r.desc)
  const clientRaw = fixClient(r.client)
  const key = `${clientRaw}::${rawTitle.toLowerCase()}`
  // mesmo código repetido na planilha (ex.: C181) gera id duplicado -> pular
  if (code && seenCode.has(code.toLowerCase())) continue
  if (seenKey.has(key)) continue
  if (code) seenCode.add(code.toLowerCase())
  seenKey.add(key)
  items.push({ ...r, code, rawTitle, clientRaw })
}

// ---- build CaseStudy objects ----
function build(item, lang) {
  const [sectorPt, sectorEn] = mapSector(item.sector)
  const [naturePt, natureEn] = mapNature(item.nature)
  const sector = lang === 'en' ? sectorEn : sectorPt
  const nature = lang === 'en' ? natureEn : naturePt
  const isConf = item.clientRaw === '__CONFIDENTIAL__'
  const client = isConf
    ? lang === 'en'
      ? 'Confidential Client'
      : 'Cliente Confidencial'
    : item.clientRaw
  const titlePt = item.rawTitle
  const title = lang === 'en' ? translate(item.rawTitle) : titlePt
  const stackPt = splitTech(item.tech)
  const stack = lang === 'en' ? stackPt.map((t) => translate(t)) : stackPt
  const techInline = stackPt.slice(0, 6).join(', ')
  const techInlineL = lang === 'en' ? stack.slice(0, 6).join(', ') : techInline

  let overview, challenge, solution, results
  if (lang === 'en') {
    overview = `${title} — ${nature.toLowerCase()} delivered for ${client} (${sector} sector).`
    challenge = `${client} required a ${nature.toLowerCase()} initiative in the ${sector.toLowerCase()} sector, demanding delivery with quality, security and predictability.`
    solution = stack.length
      ? `Foursys engagement on "${title}", applying ${techInlineL}.`
      : `Foursys engagement on "${title}", with specialized squads and Foursys engineering practices.`
    results = [`${nature} initiative delivered for ${client}.`]
    if (stack.length) results.push(`Technologies and disciplines applied: ${techInlineL}.`)
  } else {
    overview = `${titlePt} — ${naturePt.toLowerCase()} para ${client} (setor ${sectorPt}).`
    challenge = `${client} demandou uma iniciativa de ${naturePt.toLowerCase()} no setor de ${sectorPt.toLowerCase()}, exigindo execução com qualidade, segurança e previsibilidade de entrega.`
    solution = stackPt.length
      ? `Atuação da Foursys no contexto "${titlePt}", aplicando ${techInline}.`
      : `Atuação da Foursys no contexto "${titlePt}", com squads especializadas e práticas de engenharia da Foursys.`
    results = [`Iniciativa de ${naturePt} conduzida para ${client}.`]
    if (stackPt.length) results.push(`Tecnologias e disciplinas aplicadas: ${techInline}.`)
  }

  return {
    id: `ref-${item.code.toLowerCase()}`,
    title,
    client,
    sector,
    type: nature,
    challenge,
    solution,
    stack,
    results,
    color: SECTOR_COLORS[sectorPt] ?? SECTOR_COLORS.Outros,
    overview,
  }
}

const pt = items.map((i) => build(i, 'pt'))
const en = items.map((i) => build(i, 'en'))

function ser(arr) {
  return JSON.stringify(arr, null, 2)
}

const banner = `// AUTO-GERADO a partir do índice oficial de cases da Foursys (não editar manualmente).
// Fonte: "INDICE dos CASOS REFERÊNCIAS Foursys" — apenas cases prontos (PPT = sim).
// Conteúdo factual (cliente, setor, natureza, tecnologias). Sem métricas fabricadas.
`

const out = `${banner}import type { CaseStudy } from '../types'

export const referenceCasesPt: CaseStudy[] = ${ser(pt)}

export const referenceCasesEn: CaseStudy[] = ${ser(en)}
`

writeFileSync(OUT, out, 'utf8')
console.log(`Generated ${pt.length} reference cases -> ${OUT}`)
