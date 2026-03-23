import type { CaseStudy, Capability } from '../types'

export const cases: CaseStudy[] = [
  {
    id: 'shi-portal',
    title: 'Portal Imobiliário SHI',
    client: 'Santander Housing Investments',
    sector: 'Financeiro / Imobiliário',
    type: 'Produto Digital',
    challenge: 'O Santander precisava de um portal centralizado para gestão do portfólio imobiliário do SHI, integrando dados de múltiplas fontes legadas e oferecendo dashboards executivos em tempo real.',
    solution: 'Desenvolvimento de portal web com React, APIs REST em Java Spring Boot, integração com sistemas legados via camada de API Gateway, e dashboards interativos com D3.js.',
    stack: ['React', 'Java Spring Boot', 'AWS', 'API Gateway', 'PostgreSQL', 'D3.js'],
    results: [
      'Tempo de consulta de portfólio reduzido de 3 dias para 10 minutos',
      'Visibilidade em tempo real de 100% dos imóveis do portfólio',
      'Eliminação de 15 relatórios manuais em Excel',
      'Adoção imediata por 200+ gestores do banco'
    ],
    metric: { value: '99%', label: 'Redução no tempo de consulta' },
    color: 'from-red-600 to-red-800'
  },
  {
    id: 'quality-ia-impl',
    title: 'Framework Quality IA',
    client: 'Santander Brasil',
    sector: 'Financeiro',
    type: 'Framework / Produto',
    challenge: 'O time de QA do Santander realizava testes majoritariamente manuais, gerando ciclos de release de 6 semanas e alta taxa de defeitos em produção.',
    solution: 'Desenvolvimento do Framework Quality IA: plugin de automação inteligente de testes que usa IA para geração automática de casos de teste, identificação de riscos e análise de impacto.',
    stack: ['Python', 'LLMs', 'Selenium', 'Jenkins', 'SonarQube', 'Jira Integration'],
    results: [
      'Ciclo de release reduzido de 6 semanas para 2 semanas',
      '78% de aumento na cobertura de testes automatizados',
      'Redução de 60% nos defeitos em produção',
      'Framework homologado pelo Santander para uso corporativo'
    ],
    metric: { value: '3x', label: 'Mais velocidade de release' },
    color: 'from-blue-600 to-blue-800'
  },
  {
    id: 'data-lakehouse',
    title: 'Data Lakehouse Financeiro',
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
      'Time de analytics independente — sem dependência de TI para consultas'
    ],
    metric: { value: 'R$ 45M', label: 'Otimização identificada em 6 meses' },
    color: 'from-violet-600 to-violet-800'
  },
  {
    id: 'modernizacao-core',
    title: 'Modernização Core Banking',
    client: 'Fintech Scale-up',
    sector: 'Fintech',
    type: 'Modernização',
    challenge: 'Sistema core em Java legado (2008) sem testes automatizados, impossibilitando releases frequentes e bloqueando crescimento — 200k transações/dia.',
    solution: 'Modernização incremental com SDD: decomposição em microserviços, implementação de testes automatizados (Quality IA), migração gradual de funcionalidades críticas.',
    stack: ['Java 21', 'Spring Boot', 'Kubernetes', 'AWS EKS', 'PostgreSQL', 'Kafka'],
    results: [
      'Deploy de 3x por semana vs. 1x por trimestre anterior',
      'Cobertura de testes de 0% para 85%',
      'Capacidade de processamento escalada de 200k para 2M transações/dia',
      'Zero downtime durante migração'
    ],
    metric: { value: '10x', label: 'Aumento de capacidade de transações' },
    color: 'from-green-600 to-green-800'
  },
  {
    id: 'cyber-compliance',
    title: 'Programa Cyber Security BACEN',
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
      'Zero incidentes de segurança nos 12 meses pós-implementação'
    ],
    metric: { value: '100%', label: 'Conformidade BACEN no prazo' },
    color: 'from-red-600 to-orange-700'
  }
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
