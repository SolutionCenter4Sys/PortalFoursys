import type { ServiceLine, DeliveryModel } from '../types'

export const serviceLines: ServiceLine[] = [
  {
    id: 'modernizacao',
    title: 'Modernização de Sistemas',
    subtitle: 'Do legado ao futuro sem big-bang',
    problem: 'Sistemas legados que freiam a inovação e geram risco operacional',
    target: 'Bancos, seguradoras e empresas com sistemas core críticos',
    icon: '🔄',
    color: 'from-blue-500 to-blue-700',
    tags: ['Java', 'COBOL Migration', 'Cloud', 'SDD', 'APIs']
  },
  {
    id: 'engenharia-dados',
    title: 'Engenharia de Dados e IA',
    subtitle: 'Dados como ativo estratégico',
    problem: 'Dados dispersos que não geram insight acionável para o negócio',
    target: 'Empresas que precisam de analytics avançado e modelos preditivos',
    icon: '📊',
    color: 'from-violet-500 to-violet-700',
    tags: ['Databricks', 'AWS', 'Python', 'Machine Learning', 'LLMs']
  },
  {
    id: 'desenvolvimento',
    title: 'Desenvolvimento de Produtos Digitais',
    subtitle: 'Da ideia ao produto em produção',
    problem: 'Falta de capacidade interna para construir produtos digitais com velocidade e qualidade',
    target: 'Empresas que querem lançar ou evoluir produtos digitais B2B ou B2C',
    icon: '💻',
    color: 'from-cyan-500 to-cyan-700',
    tags: ['React', 'Node.js', 'Mobile', 'AWS', 'DevOps']
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security',
    subtitle: 'Segurança como habilitadora de negócio',
    problem: 'Vulnerabilidades em sistemas financeiros e conformidade regulatória (BACEN, LGPD)',
    target: 'Instituições financeiras com exigências regulatórias e de risco',
    icon: '🛡️',
    color: 'from-red-500 to-red-700',
    tags: ['SAST', 'DAST', 'Pentest', 'LGPD', 'ISO 27001']
  },
  {
    id: 'quality-assurance',
    title: 'Quality & Automation',
    subtitle: 'Qualidade acelerada por IA',
    problem: 'Ciclos de teste lentos que bloqueiam releases frequentes',
    target: 'Times de desenvolvimento que precisam de velocity sem sacrificar qualidade',
    icon: '✅',
    color: 'from-green-500 to-green-700',
    tags: ['Quality IA', 'Selenium', 'Cypress', 'JMeter', 'AI Testing']
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    subtitle: 'Infraestrutura como código, entrega como cultura',
    problem: 'Infraestrutura cara, lenta de provisionar e difícil de escalar',
    target: 'Empresas migrando para cloud ou querendo otimizar operações existentes',
    icon: '☁️',
    color: 'from-orange-500 to-orange-700',
    tags: ['AWS', 'Azure', 'Kubernetes', 'Terraform', 'CI/CD']
  },
  {
    id: 'salesforce',
    title: 'Salesforce & CRM',
    subtitle: 'CRM que realmente funciona para o negócio',
    problem: 'CRM subutilizado ou mal configurado que não acompanha o processo de vendas real',
    target: 'Empresas que usam ou querem implantar Salesforce como plataforma de relacionamento',
    icon: '☁️',
    color: 'from-sky-500 to-sky-700',
    tags: ['Salesforce', 'CRM', 'Sales Cloud', 'Service Cloud', 'Marketing Cloud']
  },
  {
    id: 'fourblock',
    title: 'Fourblock — Produtos em 30 dias',
    subtitle: 'Produtos prontos, customizados para seu contexto',
    problem: 'Necessidade de soluções digitais rápidas sem abrir mão de qualidade e governança',
    target: 'Empresas com urgência de entrega ou precisando validar rapidamente um conceito',
    icon: '⬛',
    color: 'from-foursys-blue to-foursys-cyan',
    tags: ['Blocos pré-built', 'Customização', 'IA integrada', 'Entrega em 30 dias']
  }
]

export const deliveryModels: DeliveryModel[] = [
  {
    id: 'projeto',
    title: 'Projeto',
    description: 'Escopo, prazo e custo definidos. Ideal para iniciativas com objetivo claro e entrega fechada.',
    icon: '📋',
    features: [
      'Gestão de projeto dedicada',
      'Entrega por marcos (milestones)',
      'Garantia de escopo contratual',
      'Relatórios executivos periódicos'
    ]
  },
  {
    id: 'squad',
    title: 'Squad Dedicado',
    description: 'Equipe multidisciplinar exclusiva para o cliente. Máxima flexibilidade e velocidade de entrega.',
    icon: '👥',
    features: [
      'Squad full-stack completo',
      'Rituais ágeis integrados ao cliente',
      'Capacidade de adaptar prioridades',
      'Entrega contínua (CI/CD)'
    ]
  },
  {
    id: 'alocacao',
    title: 'Alocação',
    description: 'Profissionais especializados integrados ao time do cliente. Complementa lacunas específicas.',
    icon: '👤',
    features: [
      'Profissionais seniores e especialistas',
      'Integração ao processo do cliente',
      'Gestão Foursys de qualidade e evolução',
      'Substituição rápida em caso de ausência'
    ]
  },
  {
    id: 'squad-agentes',
    title: 'Squad + Agentes IA',
    description: 'A evolução do squad: profissionais amplificados por agentes de IA que automatizam tarefas repetitivas e aceleram entregas.',
    icon: '🤖',
    features: [
      'Agentes IA para automação de tarefas',
      'Geração de código assistida por IA',
      'Testes automatizados por IA',
      'Velocidade 3x maior vs. squad tradicional',
      'Qualidade monitorada por IA continuamente'
    ],
    highlight: true
  }
]
