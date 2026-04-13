import type { ClientConfig } from '../../types'
import type { Language } from '../../i18n/types'

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

const bradescoClientEn: ClientConfig = {
  id: 'bradesco',
  name: 'Bradesco',
  colors: { primary: '#CC0000', accent: '#FF6600' },
  tagline: 'Digital transformation with governance and measurable results',
  relationship: 'Strategic partner in modernization and AI',
  yearsPartnership: 12,
  sections: [
    {
      id: 'client-opening',
      label: 'Foursys × Bradesco',
      description: 'Strategic partnership in digital evolution',
      icon: 'handshake',
      component: 'client-opening',
    },
    {
      id: 'client-insights',
      label: 'Bradesco Insights',
      description: 'Opportunities identified in the Bradesco ecosystem',
      icon: 'search',
      component: 'client-insights',
    },
    {
      id: 'client-cases',
      label: 'Bradesco Cases',
      description: 'Deliveries and results within Bradesco',
      icon: 'trophy',
      component: 'client-cases',
    },
  ],
  insights: [
    {
      id: 'bia-genai',
      title: 'BIA and the Evolution to GenAI',
      description:
        'Bradesco was a pioneer with BIA (Watson-based virtual assistant). With 2+ billion interactions, the challenge now is evolving to generative AI while maintaining governance and security in a bank with 70+ million customers.',
      solution:
        'Orchestrated migration from classical models to GenAI with human supervision. Domain-specialized AI Agents (cards, insurance, investments) with a governance framework integrated into the bank\'s compliance.',
      icon: '🧠',
    },
    {
      id: 'next-modernizacao',
      title: 'Next — Digital Modernization at Scale',
      description:
        'The "Next" program positions Bradesco at the digital forefront. With BRL 1.9 trillion in assets and 100+ million customers (including Next and Digio), legacy platform modernization requires a progressive approach without impacting operations.',
      solution:
        'Progressive SDD modernization in waves: legacy encapsulation, replatforming of critical services, and cloud-native for new modules. Zero downtime as a premise — 12+ years of experience in the Bradesco ecosystem.',
      icon: '⚡',
    },
    {
      id: 'open-finance',
      title: 'Open Finance and Open Ecosystem',
      description:
        'With BACEN\'s Open Finance regulation, Bradesco needs to expose secure APIs and consume competitor data to offer hyper-personalized products. The challenge is integration speed with governance.',
      solution:
        'API Management platforms and Developer Portal. Squads specialized in Open Finance integrations with automated testing pipelines to ensure compliance and SLA of exposed services.',
      icon: '🔗',
    },
    {
      id: 'seguros-previdencia',
      title: 'Bradesco Seguros — Market Leader',
      description:
        'Bradesco Seguros is the largest insurance group in Latin America. Digitizing insurance, pension, and capitalization products requires simple journeys for millions of customers with complex actuarial calculations on the backend.',
      solution:
        'Digital platforms for insurance contracting and management with simplified UX. Modernized actuarial calculation engines with microservices and real-time pricing APIs.',
      icon: '🛡️',
    },
    {
      id: 'pix-pagamentos',
      title: 'PIX and New Payment Methods',
      description:
        'PIX has processed billions of transactions and new modalities (contactless PIX, guaranteed PIX, automatic PIX) require continuous evolution of the high-throughput transactional infrastructure.',
      solution:
        'Squads specialized in high-throughput, low-latency systems (< 100ms). Experience in SPB/BACEN integration and event-driven architectures for real-time processing.',
      icon: '💳',
    },
    {
      id: 'cybersecurity-fraude',
      title: 'Cybersecurity and Fraud Prevention',
      description:
        'With 70+ million digital customers, Bradesco faces a growing volume of fraud attempts. Accurate detection requires ML models that balance security with customer experience (false positives).',
      solution:
        'ML models for real-time fraud detection with false positive rate < 0.1%. Continuous security monitoring with SAST/DAST integrated into the development pipeline.',
      icon: '🔒',
    },
  ],
  cases: [
    {
      id: 'bradesco-case-1',
      title: 'Coming Soon',
      sector: 'Financial',
      type: 'In Progress',
      challenge: 'Case details will be added soon.',
      solution: 'Information being prepared.',
      stack: [],
      results: ['Case in preparation — contact us for details'],
    },
  ],
}

export function getBradescoClient(lang: Language = 'pt'): ClientConfig {
  return lang === 'en' ? bradescoClientEn : bradescoClient
}
