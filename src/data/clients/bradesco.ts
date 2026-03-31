import type { ClientConfig } from '../../types'

export const bradescoClient: ClientConfig = {
  id: 'bradesco',
  name: 'Bradesco',
  colors: { primary: '#CC0000', accent: '#FF6600' },
  tagline: 'Transformação digital com governança e resultado mensurável',
  relationship: 'Parceiro estratégico em modernização e IA',
  yearsPartnership: 12,
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
      id: 'bia-genai',
      title: 'BIA e a Evolução para GenAI',
      description:
        'O Bradesco foi pioneiro com a BIA (assistente virtual baseada em Watson). Com 2+ bilhões de interações, o desafio agora é evoluir para IA generativa mantendo governança e segurança em um banco com 70+ milhões de clientes.',
      solution:
        'Migração orquestrada de modelos clássicos para GenAI com supervisão humana. Agentes IA especializados por domínio (cartões, seguros, investimentos) com framework de governança integrado ao compliance do banco.',
      icon: '🧠',
    },
    {
      id: 'next-modernizacao',
      title: 'Next — Modernização Digital em Escala',
      description:
        'O programa "Next" posiciona o Bradesco na vanguarda digital. Com R$ 1,9 trilhão em ativos e 100+ milhões de clientes (incluindo Next e Digio), a modernização de plataformas legadas exige abordagem progressiva sem impacto na operação.',
      solution:
        'Modernização progressiva SDD por ondas: encapsulamento de legado, replatforming de serviços críticos e cloud-native para novos módulos. Zero downtime como premissa — 12+ anos de experiência no ecossistema Bradesco.',
      icon: '⚡',
    },
    {
      id: 'open-finance',
      title: 'Open Finance e Ecossistema Aberto',
      description:
        'Com a regulamentação Open Finance do BACEN, o Bradesco precisa expor APIs seguras e consumir dados de concorrentes para oferecer produtos hiperpersonalizados. O desafio é velocidade de integração com governança.',
      solution:
        'Plataformas de API Management e Developer Portal. Squads especializados em integrações Open Finance com pipelines de teste automatizado para garantir compliance e SLA dos serviços expostos.',
      icon: '🔗',
    },
    {
      id: 'seguros-previdencia',
      title: 'Bradesco Seguros — Líder do Mercado',
      description:
        'Bradesco Seguros é o maior grupo segurador da América Latina. A digitalização de produtos de seguros, previdência e capitalização exige jornadas simples para milhões de clientes com cálculos atuariais complexos no backend.',
      solution:
        'Plataformas digitais de contratação e gestão de seguros com UX simplificada. Motores de cálculo atuarial modernizados com microsserviços e APIs de precificação em tempo real.',
      icon: '🛡️',
    },
    {
      id: 'pix-pagamentos',
      title: 'PIX e Novos Meios de Pagamento',
      description:
        'O PIX processou bilhões de transações e novas modalidades (PIX por aproximação, PIX garantido, PIX automático) exigem evolução contínua da infraestrutura transacional de alto throughput.',
      solution:
        'Squads especializados em sistemas de alto throughput e baixa latência (< 100ms). Experiência em integração com SPB/BACEN e arquiteturas event-driven para processamento em tempo real.',
      icon: '💳',
    },
    {
      id: 'cybersecurity-fraude',
      title: 'Cybersecurity e Prevenção a Fraude',
      description:
        'Com 70+ milhões de clientes digitais, o Bradesco enfrenta volume crescente de tentativas de fraude. A detecção precisa exigir modelos de ML que equilibrem segurança com experiência do cliente (falsos positivos).',
      solution:
        'Modelos de ML para detecção de fraude em tempo real com taxa de falso positivo < 0,1%. Monitoramento contínuo de segurança com SAST/DAST integrado ao pipeline de desenvolvimento.',
      icon: '🔒',
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
