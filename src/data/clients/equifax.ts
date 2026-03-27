import type { ClientConfig } from '../../types'

export const equifaxClient: ClientConfig = {
  id: 'equifax',
  name: 'Equifax',
  colors: { primary: '#003087', accent: '#0057B7' },
  tagline: 'Dados, IA e segurança para decisões mais inteligentes',
  relationship: 'Parceiro em dados, analytics e governança de IA',
  sections: [
    {
      id: 'client-opening',
      label: 'Foursys × Equifax',
      description: 'Parceria em dados e inteligência analítica',
      icon: 'handshake',
      component: 'client-opening',
    },
    {
      id: 'client-insights',
      label: 'Percepções Equifax',
      description: 'Oportunidades no ecossistema Equifax',
      icon: 'search',
      component: 'client-insights',
    },
    {
      id: 'client-cases',
      label: 'Cases no Equifax',
      description: 'Projetos e resultados entregues',
      icon: 'trophy',
      component: 'client-cases',
    },
  ],
  insights: [
    {
      id: 'dados-governanca',
      title: 'Governança de Dados com IA',
      description:
        'Volume crescente de dados sensíveis exigindo pipelines robustos, compliance regulatório e rastreabilidade end-to-end.',
      solution:
        'Governança de IA & Dados: catálogo, linhagem, qualidade e compliance com visibilidade em tempo real.',
      icon: 'bar-chart',
    },
    {
      id: 'modelos-risco',
      title: 'Modelos de Risco e Crédito',
      description:
        'Necessidade de modelos mais precisos e auditáveis para scoring de crédito e detecção de fraude.',
      solution:
        'Dados & Inteligência com Databricks: modelos ML em produção com explicabilidade e monitoramento contínuo.',
      icon: 'shield-check',
    },
    {
      id: 'plataforma-dados',
      title: 'Plataforma de Dados Unificada',
      description:
        'Silos de dados dispersos limitando a criação de produtos analíticos de alto valor para clientes.',
      solution:
        'Data Lakehouse: camadas Bronze/Silver/Gold com ingestão em tempo real e APIs de consumo padronizadas.',
      icon: 'link',
    },
  ],
  cases: [
    {
      id: 'equifax-case-1',
      title: 'Em breve',
      sector: 'Dados & Analytics',
      type: 'Em configuração',
      challenge: 'Detalhes do case serão adicionados em breve.',
      solution: 'Informações em preparação.',
      stack: [],
      results: ['Case em preparação — entre em contato para detalhes'],
    },
  ],
}
