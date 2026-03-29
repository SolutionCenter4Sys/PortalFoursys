import type { ServiceLine, DeliveryModel } from '../types'

export const serviceLines: ServiceLine[] = [
  {
    id: 'outsourcing-sustentacao',
    title: 'Outsourcing & Sustentação',
    subtitle: 'Continuidade operacional, previsibilidade de custo e governança',
    problem: 'Assumimos a operação e evolução de ambientes críticos com SLAs, governança e visibilidade executiva para reduzir risco e dar estabilidade ao negócio.',
    target: 'Empresas que precisam sustentar aplicações críticas com eficiência, controle e menor volatilidade operacional.',
    icon: 'blocks',
    color: 'from-indigo-500 to-indigo-700',
    tags: ['AMS', 'Sustentação', 'SLAs', 'Governança', 'Operação Assistida'],
    offerDetail: {
      valueProposition: 'Garantir continuidade operacional, previsibilidade de custo e evolução controlada, com equipes comprometidas com o resultado.',
      metrics: [
        { value: '-50%', label: 'Indisponibilidade Operacional' },
        { value: '+30%', label: 'Eficiência de Times Internos' },
        { value: '-20%', label: 'Redução de Backlog Técnico' },
      ],
      differentials: [
        'Squads e especialistas orientados a resultados, não apenas alocação.',
        'Governança clara, SLAs e métricas objetivas.',
        'Aceleração com IA mantendo qualidade e segurança.',
        'Forte experiência em ambientes críticos e regulados.',
      ],
    },
  },
  {
    id: 'modernizacao-legados',
    title: 'Modernização de Legados',
    subtitle: 'Redução de custo e evolução tecnológica',
    problem: 'Transformamos plataformas legadas sem ruptura do core, reduzindo obsolescência, custo operacional e dependência de tecnologias limitantes.',
    target: 'Organizações com sistemas críticos que precisam modernizar com risco controlado e roadmap incremental.',
    icon: 'git-merge',
    color: 'from-violet-500 to-violet-700',
    tags: ['Legado', 'Migração', 'Replatform', 'APIs', 'SDD'],
    offerDetail: {
      valueProposition: 'Modernizar sistemas críticos sem interromper o negócio, reduzindo dívida técnica e criando base sólida para crescimento, inovação e escala.',
      metrics: [
        { value: '+30%', label: 'Redução de Custos' },
        { value: '+70%', label: 'Aceleração Time to Market' },
        { value: '+60%', label: 'Aumento da Segurança de Código' },
      ],
      differentials: [
        'Abordagem incremental e pragmática, sem "big bang".',
        'Uso de IA como acelerador real (análise, refatoração, testes e migração).',
        'Forte experiência em ambientes complexos e regulados.',
        'Integração entre modernização, arquitetura e operação (AMS).',
      ],
    },
  },
  {
    id: 'arquitetura-devops',
    title: 'Arquitetura & DevOps',
    subtitle: 'Plataformas resilientes e escaláveis',
    problem: 'Estruturamos arquiteturas modernas e esteiras de entrega para suportar crescimento, alta disponibilidade e ciclos mais rápidos com segurança.',
    target: 'Times que precisam ganhar escala e previsibilidade com arquitetura robusta e automação de delivery.',
    icon: 'landmark',
    color: 'from-fuchsia-500 to-fuchsia-700',
    tags: ['Arquitetura', 'DevOps', 'CI/CD', 'Observabilidade', 'Resiliência'],
    offerDetail: {
      valueProposition: 'Construir plataformas resilientes, escaláveis e eficientes, alinhando arquitetura moderna, práticas DevOps e cloud ao ritmo real do negócio.',
      metrics: [
        { value: '+30%', label: 'Controle de Custos' },
        { value: '-30%', label: 'Redução de Indisponibilidade' },
        { value: '+40%', label: 'Frequência de Deploy' },
      ],
      differentials: [
        'Arquitetura enterprise-grade, orientada a desempenho e resiliência.',
        'DevOps com foco em previsibilidade, não só velocidade.',
        'Cloud como meio, não como fim: custo, segurança e governança no centro.',
        'Experiência comprovada em ambientes de missão crítica.',
      ],
    },
  },
  {
    id: 'integracoes-open-finance',
    title: 'Integrações via API & Open Finance',
    subtitle: 'Conectividade, escalabilidade e novos modelos de negócio',
    problem: 'Conectamos ecossistemas, canais e parceiros por APIs escaláveis, habilitando jornadas integradas e novas oportunidades de negócio digital.',
    target: 'Empresas que dependem de integração entre plataformas, parceiros e ecossistemas regulados.',
    icon: 'link',
    color: 'from-pink-500 to-pink-700',
    tags: ['APIs', 'Open Finance', 'Integração', 'Microservices', 'Ecossistemas'],
    offerDetail: {
      valueProposition: 'Conectar sistemas, parceiros e ecossistemas com segurança, escalabilidade e governança, viabilizando novos modelos de negócio.',
      metrics: [
        { value: '-30%', label: 'Redução de Falhas' },
        { value: '5x', label: 'Aumento da Escalabilidade' },
        { value: '+30%', label: 'Novos Negócios' },
      ],
      differentials: [
        'Forte domínio de APIs, eventos e integrações complexas.',
        'Experiência prática em Open Finance e ambientes regulados.',
        'Governança de APIs desde o design até a operação.',
        'Integração pensada como produto, não apenas como tecnologia.',
      ],
    },
  },
  {
    id: 'engenharia-software-ia',
    title: 'Design e Engenharia de Software com IA',
    subtitle: 'Engenharia acelerada com qualidade e controle',
    problem: 'Aplicamos IA ao ciclo de engenharia para acelerar discovery, desenvolvimento e documentação, sem perder governança, rastreabilidade ou padrão técnico.',
    target: 'Empresas que querem aumentar throughput de software com qualidade enterprise e uso pragmático de IA.',
    icon: 'brain',
    color: 'from-rose-500 to-rose-700',
    tags: ['IA', 'Software Engineering', 'Discovery', 'Code Assist', 'Governança'],
    offerDetail: {
      valueProposition: 'Entregar software crítico com mais velocidade, qualidade e controle, usando IA de forma responsável ao longo de todo o ciclo de vida.',
      metrics: [
        { value: '+50%', label: 'Produtividade dos Times' },
        { value: '+35%', label: 'Aceleração do Desenvolvimento' },
        { value: '-20%', label: 'Redução de Custo por Funcionalidade' },
      ],
      differentials: [
        'IA integrada ao SDLC (análise, desenvolvimento, testes e manutenção).',
        'Engenharia disciplinada: IA acelera, não substitui fundamentos.',
        'Forte governança, rastreabilidade e qualidade.',
        'Experiência em sistemas core e regulados.',
      ],
    },
  },
  {
    id: 'cloud-finops',
    title: 'Cloud & FinOps',
    subtitle: 'Escala cloud com eficiência financeira',
    problem: 'Otimizamos ambientes cloud para equilibrar performance, governança e custo, transformando consumo em eficiência mensurável.',
    target: 'Empresas que já operam em nuvem e precisam melhorar previsibilidade, eficiência e governança financeira.',
    icon: 'cloud',
    color: 'from-orange-400 to-orange-600',
    tags: ['Cloud', 'FinOps', 'AWS', 'Azure', 'Otimização de Custos'],
    offerDetail: {
      valueProposition: 'Equilibrar escala, custo e governança em ambientes cloud, transformando consumo em eficiência mensurável e previsível.',
      metrics: [
        { value: '-35%', label: 'Redução de Custo Cloud' },
        { value: '+99.9%', label: 'Disponibilidade de Serviços' },
        { value: '+40%', label: 'Visibilidade Financeira' },
      ],
      differentials: [
        'FinOps como disciplina, não apenas ferramenta.',
        'Otimização contínua com métricas reais de negócio.',
        'Experiência multi-cloud (AWS, Azure, GCP).',
        'Governança financeira integrada à operação técnica.',
      ],
    },
  },
  {
    id: 'dados-analytics',
    title: 'Dados & Analytics',
    subtitle: 'Inteligência para tomada de decisão',
    problem: 'Estruturamos dados, analytics e informação gerencial para transformar volume em decisão mais rápida, confiável e orientada por evidência.',
    target: 'Negócios que precisam elevar maturidade analítica e acelerar decisões com dados confiáveis.',
    icon: 'bar-chart',
    color: 'from-amber-400 to-amber-600',
    tags: ['Analytics', 'BI', 'Dados', 'Databricks', 'Inteligência'],
    offerDetail: {
      valueProposition: 'Transformar dados em decisões mais rápidas e confiáveis, construindo a base analítica que o negócio precisa para crescer com inteligência.',
      metrics: [
        { value: '+50%', label: 'Velocidade de Decisão' },
        { value: '-40%', label: 'Redução de Custo Operacional' },
        { value: '+80%', label: 'Dados Disponíveis para BI' },
      ],
      differentials: [
        'Governança de dados integrada desde a origem.',
        'Arquitetura moderna: data lake, lakehouse, streaming.',
        'IA e analytics aplicados a cenários reais de negócio.',
        'Parceria com Databricks, AWS e Azure.',
      ],
    },
  },
  {
    id: 'quality-testes-ia',
    title: 'Qualidade & Testes com IA',
    subtitle: 'Menos falhas, mais previsibilidade',
    problem: 'Elevamos a confiabilidade das entregas com automação, inteligência aplicada a testes e foco em redução de defeitos em produção.',
    target: 'Times que precisam acelerar releases sem comprometer estabilidade, conformidade e experiência do usuário.',
    icon: 'check-circle',
    color: 'from-yellow-400 to-yellow-600',
    tags: ['QA', 'Testes', 'IA', 'Automação', 'Confiabilidade'],
    offerDetail: {
      valueProposition: 'Garantir qualidade como atributo estratégico, reduzindo riscos e aumentando a confiabilidade das entregas com IA e automação.',
      metrics: [
        { value: '-60%', label: 'Defeitos em Produção' },
        { value: '+50%', label: 'Cobertura de Testes' },
        { value: '+40%', label: 'Velocidade de Feedback' },
      ],
      differentials: [
        'IA aplicada a geração, priorização e execução de testes.',
        'Automação orientada a risco e impacto real.',
        'Integração com esteiras CI/CD e DevOps.',
        'Foco em resultado: menos defeitos, mais confiança.',
      ],
    },
  },
  {
    id: 'ciberseguranca',
    title: 'Cibersegurança',
    subtitle: 'Proteção, conformidade e gestão de riscos',
    problem: 'Mitigamos vulnerabilidades e fortalecemos controles para proteger ativos, atender regulações e reduzir exposição a incidentes.',
    target: 'Empresas com exigência elevada de segurança, compliance e gestão contínua de riscos digitais.',
    icon: 'shield-check',
    color: 'from-lime-400 to-lime-600',
    tags: ['Segurança', 'Risco', 'Compliance', 'LGPD', 'Proteção'],
    offerDetail: {
      valueProposition: 'Proteger ativos digitais, garantir conformidade e reduzir exposição a riscos com abordagem integrada e contínua.',
      metrics: [
        { value: '-80%', label: 'Redução de Vulnerabilidades' },
        { value: '+70%', label: 'Conformidade Regulatória' },
        { value: '-60%', label: 'Tempo de Resposta a Incidentes' },
      ],
      differentials: [
        'Visão integrada: segurança como atributo, não como barreira.',
        'Experiência em ambientes regulados (LGPD, Bacen, PCI-DSS).',
        'Automação de controles e monitoramento contínuo.',
        'Cultura de segurança embarcada nos times de desenvolvimento.',
      ],
    },
  },
  {
    id: 'fourblox',
    title: 'FourBlox',
    subtitle: 'Produtos digitais pré-construídos e escaláveis',
    problem: 'Combinamos blocos de software pré-construídos e validados com customização para o contexto do cliente — entregando produtos digitais completos em semanas, não meses.',
    target: 'Empresas que precisam lançar produtos digitais rapidamente, sem abrir mão de qualidade, governança e customização.',
    icon: 'blocks',
    color: 'from-emerald-500 to-emerald-700',
    tags: ['Produtos Digitais', 'Blocos', 'MVP', 'Aceleração', '30 dias'],
    offerDetail: {
      valueProposition: 'Entregar produtos digitais completos em 30 dias usando um catálogo de blocos pré-construídos e validados, customizados para o contexto do cliente.',
      metrics: [
        { value: '70%', label: 'Menos tempo de dev' },
        { value: '30d', label: 'Prazo máximo' },
        { value: '8+', label: 'Blocos disponíveis' },
      ],
      differentials: [
        'Catálogo de blocos prontos: autenticação, dashboards, pagamentos, IA e mais.',
        'Customização por contexto — não é template, é produto sob medida.',
        'Garantia de entrega em 30 dias.',
        'Escalável desde o dia 1 com arquitetura cloud-native.',
      ],
    },
  },
  {
    id: 'hiperautomacao-rpa',
    title: 'Hiperautomação & RPA',
    subtitle: 'Eficiência operacional em escala',
    problem: 'Automatizamos processos ponta a ponta para reduzir esforço manual, eliminar gargalos e ampliar produtividade com controle.',
    target: 'Áreas operacionais que precisam escalar processos com menos fricção e maior eficiência.',
    icon: 'cpu',
    color: 'from-cyan-300 to-cyan-500',
    tags: ['RPA', 'Automação', 'Eficiência', 'Workflow', 'Produtividade'],
    offerDetail: {
      valueProposition: 'Automatizar processos ponta a ponta, reduzindo esforço manual e aumentando produtividade com governança e controle.',
      metrics: [
        { value: '-70%', label: 'Redução de Esforço Manual' },
        { value: '+50%', label: 'Produtividade Operacional' },
        { value: '-40%', label: 'Tempo de Ciclo de Processos' },
      ],
      differentials: [
        'Automação inteligente: RPA + IA + orquestração.',
        'Foco em processos críticos com ROI mensurável.',
        'Governança e monitoramento contínuo de robôs.',
        'Experiência em escala enterprise com ambientes complexos.',
      ],
    },
  }
]

export const deliveryModels: DeliveryModel[] = [
  {
    id: 'projeto',
    title: 'Projeto',
    description: 'Escopo, prazo e custo definidos. Ideal para iniciativas com objetivo claro e entrega fechada.',
    icon: 'clipboard-list',
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
    icon: 'users',
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
    icon: 'user',
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
    icon: 'brain-circuit',
    features: [
      'Agentes IA para automação de tarefas',
      'Geração de código assistida por IA',
      'Testes automatizados por IA',
      'Velocidade 3x maior vs. squad tradicional',
      'Qualidade monitorada por IA continuamente'
    ],
    highlight: true
  },
  {
    id: 'sustentacao-suporte',
    title: 'Sustentação e Suporte',
    description: 'Operação contínua de ambientes críticos com SLAs rigorosos, governança proativa e evolução permanente — garantindo estabilidade e previsibilidade para o negócio.',
    icon: 'headphones',
    features: [
      'SLAs contratuais com penalidades e metas claras',
      'Monitoramento 24×7 com resposta a incidentes',
      'Gestão de backlog evolutivo e correções priorizadas',
      'Relatórios gerenciais de disponibilidade e performance',
      'Transferência de conhecimento e documentação contínua'
    ]
  },
  {
    id: 'produtos-assinatura',
    title: 'Produtos Foursys por Assinatura',
    description: 'Plataformas digitais prontas, customizáveis e mantidas pela Foursys em modelo SaaS. O cliente contrata o resultado, não o esforço — com go-live em semanas e evolução contínua inclusa.',
    icon: 'package-check',
    features: [
      'Plataformas prontas: check-in, gestão de eventos, portais e mais',
      'Personalização de marca, fluxos e regras de negócio',
      'Modelo por assinatura mensal sem investimento inicial',
      'Atualizações, hospedagem e suporte inclusos',
      'Escalável sob demanda com infraestrutura cloud-native'
    ]
  }
]
