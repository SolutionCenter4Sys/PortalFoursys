export interface ShowcaseClient {
  id: string
  name: string
  sector: string
  color: string
  textColor: string
}

export const showcaseClients: ShowcaseClient[] = [
  // Financeiro
  { id: 'santander', name: 'Santander', sector: 'Financeiro', color: '#EC0000', textColor: '#EC0000' },
  { id: 'bradesco', name: 'Bradesco', sector: 'Financeiro', color: '#CC092F', textColor: '#CC092F' },
  { id: 'abc-brasil', name: 'ABC Brasil', sector: 'Financeiro', color: '#003B71', textColor: '#5B9BD5' },
  { id: 'bmg', name: 'BMG', sector: 'Financeiro', color: '#FF6600', textColor: '#FF6600' },
  { id: 'mufg', name: 'MUFG', sector: 'Financeiro', color: '#D50032', textColor: '#D50032' },
  { id: 'btg', name: 'BTG Pactual', sector: 'Financeiro', color: '#003366', textColor: '#6699CC' },

  // Seguros
  { id: 'porto', name: 'Porto Seguro', sector: 'Seguros', color: '#005BAA', textColor: '#5B9BD5' },
  { id: 'tokio-marine', name: 'Tokio Marine', sector: 'Seguros', color: '#0033A0', textColor: '#5B9BD5' },

  // Saúde
  { id: 'profarma', name: 'Profarma', sector: 'Saúde', color: '#00A651', textColor: '#00A651' },
  { id: 'dasa', name: 'Dasa', sector: 'Saúde', color: '#0071BC', textColor: '#5B9BD5' },

  // Tecnologia & Serviços
  { id: 'equifax', name: 'Equifax', sector: 'Tecnologia', color: '#9F2241', textColor: '#C85A7C' },
  { id: 'totvs', name: 'TOTVS', sector: 'Tecnologia', color: '#00A3E0', textColor: '#00A3E0' },
]

export const sectors = [...new Set(showcaseClients.map(c => c.sector))]
