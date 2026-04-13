import type { Language } from '../i18n/types'

export interface ShowcaseClient {
  id: string
  name: string
  sector: string
  color: string
  textColor: string
}

const sectorTranslations: Record<string, string> = {
  'Financeiro': 'Financial',
  'Seguros': 'Insurance',
  'Saúde': 'Healthcare',
  'Tecnologia': 'Technology',
  'Pagamentos': 'Payments',
  'Indústria': 'Industry',
  'Construção': 'Construction',
}

const showcaseClientsPt: ShowcaseClient[] = [
  // Financeiro
  { id: 'bradesco',         name: 'Bradesco',               sector: 'Financeiro', color: '#CC092F', textColor: '#CC092F' },
  { id: 'santander',        name: 'Santander',              sector: 'Financeiro', color: '#EC0000', textColor: '#EC0000' },
  { id: 'itau',             name: 'Itaú',                   sector: 'Financeiro', color: '#FF6600', textColor: '#FF6600' },
  { id: 'safra',            name: 'Safra',                  sector: 'Financeiro', color: '#1C3A6B', textColor: '#6699CC' },
  { id: 'btg',              name: 'BTG Pactual',            sector: 'Financeiro', color: '#003366', textColor: '#6699CC' },
  { id: 'mufg',             name: 'MUFG',                   sector: 'Financeiro', color: '#D50032', textColor: '#D50032' },
  { id: 'bv',               name: 'BV',                     sector: 'Financeiro', color: '#0066CC', textColor: '#5B9BD5' },
  { id: 'andbank',          name: 'Andbank',                sector: 'Financeiro', color: '#1B365D', textColor: '#7BA3D0' },
  { id: 'banco-sumitomo',   name: 'Banco Sumitomo',         sector: 'Financeiro', color: '#009B3A', textColor: '#4CAF50' },
  { id: 'stellantis',       name: 'Stellantis Financiamentos', sector: 'Financeiro', color: '#1C2340', textColor: '#7986CB' },
  { id: 'abc-brasil',       name: 'ABC Brasil',             sector: 'Financeiro', color: '#003B71', textColor: '#5B9BD5' },
  { id: 'bmg',              name: 'BMG',                    sector: 'Financeiro', color: '#FF6600', textColor: '#FF6600' },
  { id: 'caixa-vida',       name: 'Caixa Vida e Prev.',     sector: 'Financeiro', color: '#005CA9', textColor: '#5B9BD5' },
  { id: 'banco-volkswagen', name: 'Banco Volkswagen',       sector: 'Financeiro', color: '#001E50', textColor: '#5B9BD5' },
  { id: 'safra-national',   name: 'Safra National Bank',    sector: 'Financeiro', color: '#1C3A6B', textColor: '#6699CC' },
  { id: 'caixa-consorcios', name: 'Caixa Consórcios',       sector: 'Financeiro', color: '#005CA9', textColor: '#5B9BD5' },
  { id: 'next',             name: 'Next',                   sector: 'Financeiro', color: '#00C853', textColor: '#00C853' },

  // Seguros
  { id: 'tokio-marine',     name: 'Tokio Marine',           sector: 'Seguros', color: '#0033A0', textColor: '#5B9BD5' },
  { id: 'bradesco-seguros', name: 'Bradesco Seguros',       sector: 'Seguros', color: '#CC092F', textColor: '#CC092F' },
  { id: 'sompo',            name: 'Sompo Seguros',          sector: 'Seguros', color: '#003E7E', textColor: '#5B9BD5' },
  { id: 'youse',            name: 'Youse',                  sector: 'Seguros', color: '#6B2D8B', textColor: '#A66CC8' },
  { id: 'hdi',              name: 'HDI',                    sector: 'Seguros', color: '#006633', textColor: '#4CAF50' },

  // Saúde
  { id: 'orizon',           name: 'Orizon',                 sector: 'Saúde', color: '#00897B', textColor: '#26A69A' },
  { id: 'pasa',             name: 'PASA',                   sector: 'Saúde', color: '#0D47A1', textColor: '#5B9BD5' },
  { id: 'profarma',         name: 'Profarma',               sector: 'Saúde', color: '#00A651', textColor: '#00A651' },
  { id: 'dasa',             name: 'Dasa',                   sector: 'Saúde', color: '#0071BC', textColor: '#5B9BD5' },

  // Tecnologia & Serviços
  { id: 'tecban',           name: 'TecBan',                 sector: 'Tecnologia', color: '#003DA5', textColor: '#5B9BD5' },
  { id: 'fis-fidelity',     name: 'FIS-Fidelity',           sector: 'Tecnologia', color: '#003168', textColor: '#5B9BD5' },
  { id: 'equifax',          name: 'Equifax',                sector: 'Tecnologia', color: '#9F2241', textColor: '#C85A7C' },
  { id: 'totvs',            name: 'TOTVS',                  sector: 'Tecnologia', color: '#00A3E0', textColor: '#00A3E0' },
  { id: 'csu-digital',      name: 'CSU Digital',            sector: 'Tecnologia', color: '#1A237E', textColor: '#7986CB' },
  { id: 'mercado-eletro',   name: 'Mercado Eletrônico',     sector: 'Tecnologia', color: '#FF5722', textColor: '#FF7043' },

  // Indústria & Varejo
  { id: 'dubai',            name: 'Dubai Construtora',      sector: 'Indústria', color: '#BF8C2C', textColor: '#D4A017' },
  { id: 'natura',           name: 'Natura',                 sector: 'Indústria', color: '#FF6F00', textColor: '#FF9800' },
  { id: 'vw-caminhoes',     name: 'VW Caminhões',           sector: 'Indústria', color: '#001E50', textColor: '#5B9BD5' },
  { id: 'abinbev',          name: 'ABInBev',                sector: 'Indústria', color: '#D4A017', textColor: '#D4A017' },
  { id: 'syngenta',         name: 'Syngenta',               sector: 'Indústria', color: '#3E8E41', textColor: '#4CAF50' },
  { id: 'siemens',          name: 'Siemens',                sector: 'Indústria', color: '#009999', textColor: '#26C6DA' },
]

const showcaseClientsEn: ShowcaseClient[] = showcaseClientsPt.map(client => ({
  ...client,
  sector: sectorTranslations[client.sector] ?? client.sector,
}))

export const showcaseClients = showcaseClientsPt

export function getShowcaseClients(lang: Language): ShowcaseClient[] {
  return lang === 'en' ? showcaseClientsEn : showcaseClientsPt
}

export const sectors = [...new Set(showcaseClientsPt.map(c => c.sector))]

export function getSectors(lang: Language): string[] {
  const clients = getShowcaseClients(lang)
  return [...new Set(clients.map(c => c.sector))]
}
