export interface ShowcaseClient {
  id: string
  name: string
  sector: string
  color: string
  textColor: string
}

export const showcaseClients: ShowcaseClient[] = [
  // Financeiro
  { id: 'itau',             name: 'Itaú',                   sector: 'Financeiro', color: '#FF6600', textColor: '#FF6600' },
  { id: 'santander',        name: 'Santander',              sector: 'Financeiro', color: '#EC0000', textColor: '#EC0000' },
  { id: 'bradesco',         name: 'Bradesco',               sector: 'Financeiro', color: '#CC092F', textColor: '#CC092F' },
  { id: 'safra',            name: 'Safra',                  sector: 'Financeiro', color: '#1C3A6B', textColor: '#6699CC' },
  { id: 'abc-brasil',       name: 'ABC Brasil',             sector: 'Financeiro', color: '#003B71', textColor: '#5B9BD5' },
  { id: 'bmg',              name: 'BMG',                    sector: 'Financeiro', color: '#FF6600', textColor: '#FF6600' },
  { id: 'mufg',             name: 'MUFG',                   sector: 'Financeiro', color: '#D50032', textColor: '#D50032' },
  { id: 'btg',              name: 'BTG Pactual',            sector: 'Financeiro', color: '#003366', textColor: '#6699CC' },
  { id: 'andbank',          name: 'Andbank',                sector: 'Financeiro', color: '#1B365D', textColor: '#7BA3D0' },
  { id: 'caixa-vida',       name: 'Caixa Vida e Prev.',     sector: 'Financeiro', color: '#005CA9', textColor: '#5B9BD5' },
  { id: 'banco-volkswagen', name: 'Banco Volkswagen',       sector: 'Financeiro', color: '#001E50', textColor: '#5B9BD5' },
  { id: 'safra-national',   name: 'Safra National Bank',    sector: 'Financeiro', color: '#1C3A6B', textColor: '#6699CC' },
  { id: 'caixa-consorcios', name: 'Caixa Consórcios',       sector: 'Financeiro', color: '#005CA9', textColor: '#5B9BD5' },
  { id: 'bv',               name: 'BV',                     sector: 'Financeiro', color: '#0066CC', textColor: '#5B9BD5' },
  { id: 'banco-daycoval',   name: 'Banco Daycoval',         sector: 'Financeiro', color: '#003399', textColor: '#6699CC' },
  { id: 'next',             name: 'Next',                   sector: 'Financeiro', color: '#00C853', textColor: '#00C853' },

  // Seguros
  { id: 'porto',            name: 'Porto Seguro',           sector: 'Seguros', color: '#005BAA', textColor: '#5B9BD5' },
  { id: 'tokio-marine',     name: 'Tokio Marine',           sector: 'Seguros', color: '#0033A0', textColor: '#5B9BD5' },
  { id: 'bradesco-seguros', name: 'Bradesco Seguros',       sector: 'Seguros', color: '#CC092F', textColor: '#CC092F' },
  { id: 'sompo',            name: 'Sompo Seguros',          sector: 'Seguros', color: '#003E7E', textColor: '#5B9BD5' },
  { id: 'youse',            name: 'Youse',                  sector: 'Seguros', color: '#6B2D8B', textColor: '#A66CC8' },
  { id: 'bmg-seguros',      name: 'BMG Seguros',            sector: 'Seguros', color: '#FF6600', textColor: '#FF6600' },
  { id: 'hdi',              name: 'HDI',                    sector: 'Seguros', color: '#006633', textColor: '#4CAF50' },

  // Saúde
  { id: 'profarma',         name: 'Profarma',               sector: 'Saúde', color: '#00A651', textColor: '#00A651' },
  { id: 'dasa',             name: 'Dasa',                   sector: 'Saúde', color: '#0071BC', textColor: '#5B9BD5' },

  // Tecnologia & Serviços
  { id: 'equifax',          name: 'Equifax',                sector: 'Tecnologia', color: '#9F2241', textColor: '#C85A7C' },
  { id: 'totvs',            name: 'TOTVS',                  sector: 'Tecnologia', color: '#00A3E0', textColor: '#00A3E0' },
  { id: 'csu-digital',      name: 'CSU Digital',            sector: 'Tecnologia', color: '#1A237E', textColor: '#7986CB' },
  { id: 'mercado-eletro',   name: 'Mercado Eletrônico',     sector: 'Tecnologia', color: '#FF5722', textColor: '#FF7043' },

  // Indústria & Varejo
  { id: 'natura',           name: 'Natura',                 sector: 'Indústria', color: '#FF6F00', textColor: '#FF9800' },
  { id: 'vw-caminhoes',     name: 'VW Caminhões',           sector: 'Indústria', color: '#001E50', textColor: '#5B9BD5' },
  { id: 'abinbev',          name: 'ABInBev',                sector: 'Indústria', color: '#D4A017', textColor: '#D4A017' },
  { id: 'syngenta',         name: 'Syngenta',               sector: 'Indústria', color: '#3E8E41', textColor: '#4CAF50' },
  { id: 'siemens',          name: 'Siemens',                sector: 'Indústria', color: '#009999', textColor: '#26C6DA' },
]

export const sectors = [...new Set(showcaseClients.map(c => c.sector))]
