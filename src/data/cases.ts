import type { CaseStudy, Capability } from '../types'

export const cases: CaseStudy[] = [
  {
    id: 'saude-modernizacao',
    title: '100 Projetos Desbloqueados',
    client: 'Operadora de Saúde (Grupo Nacional)',
    sector: 'Saúde',
    type: 'Modernização de Legado',
    challenge: 'Core system de 15 anos travava integração com novos parceiros e impedia lançamento de produtos. Risco de parada crítica em 18 meses.',
    solution: 'Modernização em ondas: encapsulamento do core legado, APIs de integração e substituição gradual por domínios. Piloto em módulo de autorizações em 12 semanas.',
    stack: ['Java 21', 'Spring Boot', 'AWS', 'API Gateway', 'Kafka', 'PostgreSQL'],
    results: [
      '100 projetos de integração desbloqueados em 12 meses',
      'Tempo de integração de novos parceiros reduzido de meses para dias',
      'Zero downtime durante modernização — continuidade operacional garantida',
      'Risco de parada crítica eliminado com arquitetura resiliente',
    ],
    metric: { value: '100', label: 'Projetos desbloqueados em 12 meses' },
    color: 'from-blue-600 to-blue-800',
    testimonial: {
      quote: 'A Foursys não entregou apenas tecnologia — entregou uma transformação completa na forma como operamos. Hoje integramos parceiros em dias, não meses.',
      author: 'Ricardo Mendes',
      role: 'CTO, Operadora de Saúde',
    },
  },
  {
    id: 'fintech-lead-time',
    title: '70% Redução no Lead Time',
    client: 'Fintech de Crédito',
    sector: 'Financeiro',
    type: 'AI-Augmented Squad',
    challenge: 'Backlog de 8 meses sem previsão. Time interno sobrecarregado. Lançamentos críticos bloqueados por falta de capacidade de entrega.',
    solution: 'AI-Augmented Squad com playbook de qualidade e segurança. Duas squads (frontend + backend) integradas ao time e processos existentes da Fintech.',
    stack: ['React', 'Node.js', 'AWS', 'GitHub Actions', 'Quality IA', 'Agentes IA'],
    results: [
      '70% de redução no lead time de entrega',
      'Backlog de 8 meses reduzido para 3 meses em 12 semanas',
      'Turnover de 3,6% — time estável durante todo o projeto',
      'Throughput 3x superior ao modelo anterior',
    ],
    metric: { value: '70%', label: 'Redução no lead time' },
    color: 'from-green-600 to-green-800',
    testimonial: {
      quote: 'Em 12 semanas saímos de um backlog travado para um ritmo de entrega que nunca tivemos. O modelo AI-Augmented Squad mudou nossa realidade.',
      author: 'Fernanda Oliveira',
      role: 'VP de Engenharia, Fintech de Crédito',
    },
  },
  {
    id: 'seguradora-ia',
    title: '85% Redução no Tempo de Análise',
    client: 'Seguradora Multi-linha',
    sector: 'Seguros',
    type: 'IA First',
    challenge: 'Processo de análise de sinistros demorava 5 dias úteis. Alta taxa de fraude e retrabalho manual gerando prejuízo operacional.',
    solution: 'IA com Impacto: mapeamento de oportunidades, PoC de triagem automática de sinistros com LLMs, business case com ROI de 8 meses.',
    stack: ['Python', 'LLMs', 'AWS SageMaker', 'FastAPI', 'Power BI', 'Databricks'],
    results: [
      '85% de redução no tempo de análise de sinistros',
      'De 5 dias para menos de 18 horas por sinistro',
      'ROI calculado em 8 meses — aprovado pela diretoria em 6 semanas',
      '6 pilotos anteriores sem resultado → 1 PoC com impacto real',
    ],
    metric: { value: '85%', label: 'Redução no tempo de análise' },
    color: 'from-violet-600 to-violet-800',
    testimonial: {
      quote: 'Já tínhamos tentado 6 pilotos de IA sem resultado. A Foursys entregou impacto real na primeira PoC — com business case aprovado pela diretoria.',
      author: 'Carlos Eduardo Santos',
      role: 'Diretor de Inovação, Seguradora Multi-linha',
    },
  },
  {
    id: 'data-lakehouse',
    title: 'R$ 45M de Otimização Identificados',
    client: 'Banco Tier 1 (confidencial)',
    sector: 'Financeiro',
    type: 'Engenharia de Dados',
    challenge: 'Dados de crédito, risco e operações dispersos em 12 sistemas legados sem integração, impossibilitando análises cross-funcionais e modelos de risco em tempo real.',
    solution: 'Implementação de Data Lakehouse com Databricks na AWS: ingestão de dados em tempo real, camadas Bronze/Silver/Gold e dashboards executivos conectados ao Power BI.',
    stack: ['Databricks', 'AWS S3', 'Apache Spark', 'Delta Lake', 'Power BI', 'Python'],
    results: [
      'Unificação de 12 fontes de dados em plataforma única',
      'Modelos de risco com latência reduzida de 24h para 15 minutos',
      'R$ 45M em otimização de provisões detectados nos primeiros 6 meses',
      'Time de analytics independente — sem dependência de TI para consultas',
    ],
    metric: { value: 'R$ 45M', label: 'Otimização identificada em 6 meses' },
    color: 'from-amber-600 to-amber-800'
  },
  {
    id: 'cyber-compliance',
    title: '100% Conformidade BACEN no Prazo',
    client: 'Banco Regional (confidencial)',
    sector: 'Financeiro',
    type: 'Cyber Security',
    challenge: 'Banco com prazo regulatório BACEN Resolução 4.658 — necessidade de implementar programa de segurança cibernética completo em 9 meses.',
    solution: 'Implementação completa do programa: SAST/DAST em pipeline CI/CD, SOC interno, gestão de vulnerabilidades, pentest de APIs e sistemas, treinamento de equipes.',
    stack: ['SonarQube', 'OWASP ZAP', 'Fortify', 'Splunk SIEM', 'CrowdStrike'],
    results: [
      '100% de conformidade com BACEN Res. 4.658 no prazo',
      '347 vulnerabilidades identificadas e corrigidas',
      'Tempo de detecção de incidentes reduzido de 72h para 4h',
      'Zero incidentes de segurança nos 12 meses pós-implementação',
    ],
    metric: { value: '100%', label: 'Conformidade BACEN no prazo' },
    color: 'from-red-600 to-orange-700'
  },
]

export const capabilities: Capability[] = [
  {
    category: 'Cloud & Infraestrutura',
    technologies: [
      { name: 'AWS', level: 'expert' },
      { name: 'Azure', level: 'advanced' },
      { name: 'Kubernetes', level: 'expert' },
      { name: 'Terraform', level: 'advanced' },
      { name: 'Docker', level: 'expert' }
    ]
  },
  {
    category: 'Frontend & Mobile',
    technologies: [
      { name: 'React / Next.js', level: 'expert' },
      { name: 'TypeScript', level: 'expert' },
      { name: 'React Native', level: 'advanced' },
      { name: 'Flutter', level: 'solid' },
      { name: 'Angular', level: 'advanced' }
    ]
  },
  {
    category: 'Backend & APIs',
    technologies: [
      { name: 'Java / Spring Boot', level: 'expert' },
      { name: 'Node.js', level: 'expert' },
      { name: 'Python', level: 'advanced' },
      { name: 'Go', level: 'solid' },
      { name: 'GraphQL / REST', level: 'expert' }
    ]
  },
  {
    category: 'Dados & IA',
    technologies: [
      { name: 'Databricks', level: 'expert' },
      { name: 'Apache Spark', level: 'advanced' },
      { name: 'Python / Pandas', level: 'expert' },
      { name: 'LLMs / OpenAI', level: 'advanced' },
      { name: 'Power BI / Looker', level: 'advanced' }
    ]
  },
  {
    category: 'Segurança',
    technologies: [
      { name: 'SAST / DAST', level: 'expert' },
      { name: 'Pentest', level: 'advanced' },
      { name: 'OWASP / BACEN', level: 'expert' },
      { name: 'SonarQube', level: 'expert' },
      { name: 'SIEM / SOC', level: 'advanced' }
    ]
  },
  {
    category: 'Qualidade & DevOps',
    technologies: [
      { name: 'CI/CD (Jenkins/GH Actions)', level: 'expert' },
      { name: 'Quality IA Framework', level: 'expert' },
      { name: 'Selenium / Cypress', level: 'expert' },
      { name: 'Scrum / SAFe', level: 'expert' },
      { name: 'BMAD Agents', level: 'expert' }
    ]
  }
]
