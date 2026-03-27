import type { ClientConfig } from '../../types'

export const bradescoClient: ClientConfig = {
  id: 'bradesco',
  name: 'Bradesco',
  colors: { primary: '#CC0000', accent: '#FF6600' },
  tagline: 'Transformação digital com governança e resultado mensurável',
  relationship: 'Parceiro estratégico em modernização e IA',
  sections: [
    {
      id: 'client-opening',
      label: 'Foursys × Bradesco',
      description: 'Parceria estratégica em evolução digital',
      icon: 'handshake',
      component: 'client-opening',
    },
    {
      id: 'client-insights',
      label: 'Percepções Bradesco',
      description: 'Oportunidades identificadas no ecossistema Bradesco',
      icon: 'search',
      component: 'client-insights',
    },
    {
      id: 'client-cases',
      label: 'Cases no Bradesco',
      description: 'Entregas e resultados dentro do Bradesco',
      icon: 'trophy',
      component: 'client-cases',
    },
  ],
  insights: [
    {
      id: 'modernizacao',
      title: 'Modernização de Plataformas',
      description:
        'Sistemas legados de alta criticidade que limitam a velocidade de inovação e a integração com novas tecnologias.',
      solution:
        'Modernização progressiva por ondas: encapsulamento, replatforming e refatoração com risco controlado.',
      icon: 'git-merge',
    },
    {
      id: 'ia-operacional',
      title: 'IA em Operações',
      description:
        'Oportunidades de automatizar processos operacionais repetitivos com IA para ganho de eficiência e redução de custo.',
      solution:
        'IA First em 4–6 semanas: mapeamento, PoC e business case com ROI estimado para casos priorizados.',
      icon: 'brain-circuit',
    },
    {
      id: 'qualidade',
      title: 'Qualidade e Velocidade',
      description:
        'Ciclos de entrega longos e alta taxa de retrabalho comprometendo time-to-market de novos produtos.',
      solution:
        'AI-Augmented Squads com Quality IA integrado: entregas em semanas com governança embutida.',
      icon: 'zap',
    },
  ],
  cases: [
    {
      id: 'bradesco-case-1',
      title: 'Em breve',
      sector: 'Financeiro',
      type: 'Em configuração',
      challenge: 'Detalhes do case serão adicionados em breve.',
      solution: 'Informações em preparação.',
      stack: [],
      results: ['Case em preparação — entre em contato para detalhes'],
    },
  ],
}
