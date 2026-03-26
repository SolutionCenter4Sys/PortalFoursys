import type { ServiceLine, DeliveryModel } from '../types'

export const serviceLines: ServiceLine[] = [
  {
    id: 'outsourcing-sustentacao',
    title: 'Outsourcing & Sustentação',
    subtitle: 'Continuidade operacional, previsibilidade de custo e governança',
    problem: 'Assumimos a operação e evolução de ambientes críticos com SLAs, governança e visibilidade executiva para reduzir risco e dar estabilidade ao negócio.',
    target: 'Empresas que precisam sustentar aplicações críticas com eficiência, controle e menor volatilidade operacional.',
    icon: '🧩',
    color: 'from-indigo-500 to-indigo-700',
    tags: ['AMS', 'Sustentação', 'SLAs', 'Governança', 'Operação Assistida']
  },
  {
    id: 'modernizacao-legados',
    title: 'Modernização de Legados',
    subtitle: 'Redução de custo e evolução tecnológica',
    problem: 'Transformamos plataformas legadas sem ruptura do core, reduzindo obsolescência, custo operacional e dependência de tecnologias limitantes.',
    target: 'Organizações com sistemas críticos que precisam modernizar com risco controlado e roadmap incremental.',
    icon: '🔄',
    color: 'from-violet-500 to-violet-700',
    tags: ['Legado', 'Migração', 'Replatform', 'APIs', 'SDD']
  },
  {
    id: 'arquitetura-devops',
    title: 'Arquitetura & DevOps',
    subtitle: 'Plataformas resilientes e escaláveis',
    problem: 'Estruturamos arquiteturas modernas e esteiras de entrega para suportar crescimento, alta disponibilidade e ciclos mais rápidos com segurança.',
    target: 'Times que precisam ganhar escala e previsibilidade com arquitetura robusta e automação de delivery.',
    icon: '🏗️',
    color: 'from-fuchsia-500 to-fuchsia-700',
    tags: ['Arquitetura', 'DevOps', 'CI/CD', 'Observabilidade', 'Resiliência']
  },
  {
    id: 'integracoes-open-finance',
    title: 'Integrações via API & Open Finance',
    subtitle: 'Conectividade, escalabilidade e novos modelos de negócio',
    problem: 'Conectamos ecossistemas, canais e parceiros por APIs escaláveis, habilitando jornadas integradas e novas oportunidades de negócio digital.',
    target: 'Empresas que dependem de integração entre plataformas, parceiros e ecossistemas regulados.',
    icon: '🔗',
    color: 'from-pink-500 to-pink-700',
    tags: ['APIs', 'Open Finance', 'Integração', 'Microservices', 'Ecossistemas']
  },
  {
    id: 'engenharia-software-ia',
    title: 'Design e Engenharia de Software com IA',
    subtitle: 'Engenharia acelerada com qualidade e controle',
    problem: 'Aplicamos IA ao ciclo de engenharia para acelerar discovery, desenvolvimento e documentação, sem perder governança, rastreabilidade ou padrão técnico.',
    target: 'Empresas que querem aumentar throughput de software com qualidade enterprise e uso pragmático de IA.',
    icon: '🧠',
    color: 'from-rose-500 to-rose-700',
    tags: ['IA', 'Software Engineering', 'Discovery', 'Code Assist', 'Governança']
  },
  {
    id: 'cloud-finops',
    title: 'Cloud & FinOps',
    subtitle: 'Escala cloud com eficiência financeira',
    problem: 'Otimizamos ambientes cloud para equilibrar performance, governança e custo, transformando consumo em eficiência mensurável.',
    target: 'Empresas que já operam em nuvem e precisam melhorar previsibilidade, eficiência e governança financeira.',
    icon: '☁️',
    color: 'from-orange-400 to-orange-600',
    tags: ['Cloud', 'FinOps', 'AWS', 'Azure', 'Otimização de Custos']
  },
  {
    id: 'dados-analytics',
    title: 'Dados & Analytics',
    subtitle: 'Inteligência para tomada de decisão',
    problem: 'Estruturamos dados, analytics e informação gerencial para transformar volume em decisão mais rápida, confiável e orientada por evidência.',
    target: 'Negócios que precisam elevar maturidade analítica e acelerar decisões com dados confiáveis.',
    icon: '📊',
    color: 'from-amber-400 to-amber-600',
    tags: ['Analytics', 'BI', 'Dados', 'Databricks', 'Inteligência']
  },
  {
    id: 'quality-testes-ia',
    title: 'Qualidade & Testes com IA',
    subtitle: 'Menos falhas, mais previsibilidade',
    problem: 'Elevamos a confiabilidade das entregas com automação, inteligência aplicada a testes e foco em redução de defeitos em produção.',
    target: 'Times que precisam acelerar releases sem comprometer estabilidade, conformidade e experiência do usuário.',
    icon: '✅',
    color: 'from-yellow-400 to-yellow-600',
    tags: ['QA', 'Testes', 'IA', 'Automação', 'Confiabilidade']
  },
  {
    id: 'ciberseguranca',
    title: 'Cibersegurança',
    subtitle: 'Proteção, conformidade e gestão de riscos',
    problem: 'Mitigamos vulnerabilidades e fortalecemos controles para proteger ativos, atender regulações e reduzir exposição a incidentes.',
    target: 'Empresas com exigência elevada de segurança, compliance e gestão contínua de riscos digitais.',
    icon: '🛡️',
    color: 'from-lime-400 to-lime-600',
    tags: ['Segurança', 'Risco', 'Compliance', 'LGPD', 'Proteção']
  },
  {
    id: 'hiperautomacao-rpa',
    title: 'Hiperautomação & RPA',
    subtitle: 'Eficiência operacional em escala',
    problem: 'Automatizamos processos ponta a ponta para reduzir esforço manual, eliminar gargalos e ampliar produtividade com controle.',
    target: 'Áreas operacionais que precisam escalar processos com menos fricção e maior eficiência.',
    icon: '⚙️',
    color: 'from-cyan-300 to-cyan-500',
    tags: ['RPA', 'Automação', 'Eficiência', 'Workflow', 'Produtividade']
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
