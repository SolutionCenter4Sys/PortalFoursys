import type { ServiceLine, DeliveryModel } from '../types'
import type { Language } from '../i18n/types'

const serviceLinesPt: ServiceLine[] = [
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
    subtitle: 'Redução de custo e evolução tecnológica com aceleradores 4AI',
    problem: 'Squads tradicionais de migração enfrentam riscos de big-bang rewrite, perda de regras de negócio, downtime, custos imprevisíveis e dependência de tecnologias obsoletas. A Foursys resolve com aceleradores 4AI (Extrator de Regras, Conversor de Código e Certificação), ciclos de release de 6 semanas e automação IA + supervisão humana (50/50).',
    target: 'Organizações com sistemas críticos em COBOL, VB6, .NET, Java ou mainframe que precisam modernizar com risco controlado, roadmap incremental e aceleração via IA.',
    icon: 'git-merge',
    color: 'from-violet-500 to-violet-700',
    tags: ['Legado', 'Migração', 'Replatform', '4AI', 'Cloud', 'Modernização'],
    offerDetail: {
      valueProposition: 'A única solução de modernização que combina transformação tecnológica, segurança avançada e capacitação humana em uma abordagem integrada — com aceleradores 4AI que cobrem COBOL, VB6, .NET, Java, Angular, React e Vue. Metodologia, documentação de sistemas e negócio, ambiente preparado com agentes aceleradores, cyber segurança, observabilidade e FinOps.',
      metrics: [
        { value: '+30%', label: 'Redução de Custos' },
        { value: '+70%', label: 'Aceleração Time to Market' },
        { value: '+60%', label: 'Aumento da Segurança de Código' },
      ],
      differentials: [
        'Aceleradores 4AI: Extrator de Regras, Conversor de Código e Certificação com IA.',
        'Cobertura de linguagens: COBOL, VB6, .NET Core/Framework, Java (Spring, Struts, SpringBoot), Angular, React e Vue.',
        'Automação 50/50: IA + supervisão humana em cada ciclo de release.',
        'Ciclos de release escaláveis de 6 semanas com governança de qualidade completa.',
        '3 modelos de contratação flexíveis: Essencial, Estratégica e Evolução.',
        'Cyber segurança, observabilidade e FinOps integrados desde o início.',
        'POC/POT com amostra real do legado antes da contratação — comprovação de valor.',
      ],
    },
  },
  {
    id: 'arquitetura-devops',
    title: 'Arquitetura, Cloud e DevOps',
    subtitle: 'Plataformas cloud-native, resilientes e escaláveis',
    problem: 'Estruturamos arquiteturas cloud-native, estratégias multicloud e esteiras DevOps para suportar crescimento, alta disponibilidade, otimização de custos e ciclos mais rápidos com segurança.',
    target: 'Times e empresas que precisam ganhar escala, resiliência e previsibilidade com arquitetura moderna, cloud e automação de delivery.',
    icon: 'landmark',
    color: 'from-fuchsia-500 to-fuchsia-700',
    tags: ['Arquitetura', 'Cloud-Native', 'Multicloud', 'DevOps', 'CI/CD', 'Kubernetes', 'FinOps', 'Observabilidade'],
    offerDetail: {
      valueProposition: 'Construir plataformas cloud-native resilientes, escaláveis e eficientes — alinhando arquitetura moderna, estratégias multicloud, práticas DevOps e FinOps ao ritmo real do negócio. O mercado global de cloud computing alcançou US$ 832 bilhões em 2025 e 92% dos workloads estarão em cloud até 2028.',
      metrics: [
        { value: '$832B', label: 'Mercado Cloud 2025' },
        { value: '40%', label: 'Redução Média TCO' },
        { value: 'Zero', label: 'Downtime em Migrações' },
        { value: '+40%', label: 'Frequência de Deploy' },
      ],
      differentials: [
        'Arquiteturas cloud-native com microsserviços, event-driven e infraestrutura elástica.',
        'Parceria direta com Microsoft Azure, AWS e Google Cloud.',
        'Migração de sistemas legados para cloud sem downtime (Legacy-to-Cloud).',
        'DevOps com foco em previsibilidade, não só velocidade.',
        'FinOps & otimização de custos cloud — redução média de 40% em TCO.',
        'Kubernetes, containers e serverless em ambientes de missão crítica.',
        'Multicloud governance — redução de vendor lock-in em 60%.',
        'Sovereign cloud para setores regulados (financeiro, saúde, governo).',
        'Observabilidade end-to-end e SRE para alta disponibilidade.',
        'Edge computing + cloud para infraestrutura distribuída inteligente.',
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
    id: 'ai-augmented-squad',
    title: 'AI Squad',
    subtitle: 'Times humanos + IA com framework SDD e governança enterprise',
    problem: 'Squads tradicionais sofrem com atrasos, falta de padronização de código, baixa cobertura de testes, qualidade inconsistente, retrabalho, escassez de profissionais e ausência de documentação. O AI Squad resolve estes problemas com times humanos amplificados por mais de 20 agentes de IA especializados em cada fase do processo.',
    target: 'Empresas que precisam acelerar entregas com qualidade enterprise, reduzir lead time e eliminar gargalos de squads tradicionais com uso pragmático de IA.',
    icon: 'brain-circuit',
    color: 'from-orange-500 to-orange-700',
    tags: ['AI Squad', 'SDD', 'Agentes IA', 'Framework', 'Governança'],
    offerDetail: {
      valueProposition: 'Squad operacional Humano + IA com PO, AI Engineer, Desenvolvedores e QA amplificados por mais de 20 agentes especializados. Framework SDD proprietário (Discovery → Design → Desenvolvimento → Qualidade → Deploy), documentação completa (C4, ADRs, specs de API), dashboards de performance em tempo real e agentes treinados na stack, domínio e regras de negócio do cliente — sem lock-in.',
      metrics: [
        { value: '80%', label: 'Ganho de Produtividade' },
        { value: '65%', label: 'Redução de Lead Time' },
        { value: '70%', label: 'Queda de Retrabalho' },
      ],
      differentials: [
        'Framework SDD (OpenSpec) com agentes especializados em cada fase do ciclo.',
        'Documentação completa: diagramas C4, ADRs, user stories, especificações de API e testes.',
        'Dashboards em tempo real: velocidade, burndown, custos, taxa de aceitação de IA, qualidade de código.',
        'Agentes treinados na stack, domínio e regras de negócio do cliente — não genéricos.',
        'Cloud isolada e criptografada por cliente com conformidade GDPR & EU AI Act.',
        'Autonomia total do cliente: código aberto para evolução contínua, sem dependência.',
        'Dois modelos de implantação: ambiente do cliente ou ambiente Foursys.',
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
    subtitle: 'Inteligência para tomada de decisão em tempo real',
    problem: 'Estruturamos data platforms, analytics em tempo real, data mesh e democratização de dados para transformar volume em decisão mais rápida, confiável e orientada por evidência. Empresas data-driven têm 23x mais chances de adquirir clientes e 6x mais de retê-los.',
    target: 'Negócios que precisam elevar maturidade analítica, construir plataformas de dados modernas e acelerar decisões com dados confiáveis.',
    icon: 'bar-chart',
    color: 'from-amber-400 to-amber-600',
    tags: ['Analytics', 'BI', 'Data Lakehouse', 'Databricks', 'Data Mesh', 'Real-time', 'MLOps', 'Data Governance'],
    offerDetail: {
      valueProposition: 'Transformar dados em decisões mais rápidas e confiáveis, construindo a base analítica que o negócio precisa para crescer com inteligência. O mercado global de Big Data & Analytics deve alcançar US$ 350 bilhões em 2026, com real-time analytics crescendo 28% ao ano e Data Governance Tools 35%.',
      metrics: [
        { value: '$350B', label: 'Mercado Data & Analytics 2026' },
        { value: '280%', label: 'ROI Primeiro Ano' },
        { value: '40%', label: 'Redução Ruptura (Case Foursys)' },
        { value: '3d→0', label: 'Relatórios Instantâneos' },
      ],
      differentials: [
        'Data Platform com ingestão de múltiplas fontes, dashboards em tempo real e alertas automáticos.',
        'Parceria estratégica com Databricks para Data Lakehouse — unificando data warehouse e data lake.',
        'Data Governance & Quality integrada desde a origem — diferencial crítico quando 73% dos projetos de dados falham.',
        'Real-time Analytics & Streaming para decisões em tempo real.',
        'Arquitetura moderna: Data Mesh descentraliza ownership para os domínios de negócio.',
        'MLOps & Model Management para governança de modelos em produção.',
        'BI & Dashboards Executivos — de relatórios de 3 dias para instantâneo.',
        'IA generativa aplicada a analytics ("ask your data") para democratizar insights.',
        'Synthetic data para resolver desafios de privacidade em treinamento de modelos.',
        'Casos comprovados: 40% redução de ruptura de estoque, 280% ROI no primeiro ano.',
      ],
    },
  },
  {
    id: 'quality-testes-ia',
    title: 'Qualidade & Testes com IA',
    subtitle: 'Qualidade no escopo não é custo a mais — é o que evita custo maior',
    problem: 'Squads tradicionais enfrentam retrabalho, falhas em produção, falta de visibilidade sobre riscos, inconsistência de processos e desperdício de tempo. A Prática de Qualidade Foursys resolve com duas torres especializadas (COE + CSC), Framework Shift-Left, Agente Automatizador com IA e DataForge para massas sintéticas.',
    target: 'Times que precisam acelerar releases sem comprometer estabilidade, conformidade e experiência do usuário, com modelo plug\'n\'play flexível.',
    icon: 'check-circle',
    color: 'from-yellow-400 to-yellow-600',
    tags: ['QA', 'Testes', 'IA', 'Automação', 'Shift-Left', 'COE', 'Gherkin'],
    offerDetail: {
      valueProposition: 'Prática de Qualidade de Software com duas torres: COE (Torre de Excelência — metodologia, padrões, ferramentas, indicadores, NFT, produtos, templates) e CSC (Torre de Execução — QA nas squads, certificação GMUD, automação funcional, treinamentos). Modelo plug\'n\'play para conexão flexível com equipes e projetos do cliente.',
      metrics: [
        { value: '+10x', label: 'Visibilidade sobre Riscos' },
        { value: '+80%', label: 'Prevenção de Falhas Críticas' },
        { value: '+6x', label: 'Aceleração de Testes com IA' },
      ],
      differentials: [
        'Duas torres especializadas: COE (Excelência) + CSC (Operação) em modelo plug\'n\'play.',
        'Framework Shift-Left: qualidade antecipada desde o design de cenários, validação de requisitos e massa de dados.',
        'Agente Automatizador com IA: +120 cenários/mês vs 20 manuais (6x mais produtividade).',
        'DataForge: geração de massa sintética integrada em 1 dia, sem vício de dados.',
        'Cenários BDD/Gherkin com cobertura de testes funcionais +70%.',
        'Dashboards com 5+ indicadores (Planejado vs Executado, Defeitos, Status, Categoria, Frente).',
        'Certificação GMUD com automação de caminho crítico em 2 dias.',
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
    subtitle: 'Soluções personalizadas em até 30 dias — chega de projetos intermináveis',
    problem: 'A maioria das empresas enfrenta sistemas que não conversam entre si, planilhas paralelas fora de controle, baixa adoção de ferramentas, projetos que nunca terminam, alto investimento sem retorno claro e soluções genéricas que não atendem à realidade. O problema não é tecnologia — é falta de personalização com método.',
    target: 'Empresas que precisam de soluções digitais personalizadas com rapidez, previsibilidade financeira e evolução contínua, sem projetos de 6 a 12 meses.',
    icon: 'blocks',
    color: 'from-emerald-500 to-emerald-700',
    tags: ['Plataforma', 'Modular', 'Assinatura', 'SaaS', '30 dias', 'Personalizado'],
    offerDetail: {
      valueProposition: 'Plataforma modular de soluções por assinatura com +18 soluções prontas em 9 categorias. Diagnóstico estruturado, desenho personalizado da solução, configuração sob medida, produção em até 30 dias e evolução contínua baseada em dados.',
      metrics: [
        { value: '30d', label: 'Produção em até 30 dias' },
        { value: '18+', label: 'Soluções disponíveis' },
        { value: '9', label: 'Categorias de negócio' },
      ],
      differentials: [
        'Produção em 30 dias — sem projetos de 6 a 12 meses.',
        'Modelo por assinatura com previsibilidade financeira.',
        'Modularidade inteligente: ative apenas o que gera valor.',
        'UX centrada no usuário: adoção real, não imposição.',
        'Evolução contínua: a solução cresce com sua empresa.',
        'Kits pré-configurados para resultados acelerados (Eficiência Operacional, Gestão de Pessoas 360, Performance Comercial, Governança Executiva).',
        '9 categorias: Gestão de Pessoas, Operações, Financeiro, Comercial, Projetos, ESG, Dados & Analytics, Governança.',
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

const serviceLinesEn: ServiceLine[] = [
  {
    id: 'outsourcing-sustentacao',
    title: 'Outsourcing & Support',
    subtitle: 'Operational continuity, cost predictability, and governance',
    problem: 'We manage the operation and evolution of critical environments with SLAs, governance, and executive visibility to reduce risk and provide business stability.',
    target: 'Companies that need to sustain critical applications with efficiency, control, and reduced operational volatility.',
    icon: 'blocks',
    color: 'from-indigo-500 to-indigo-700',
    tags: ['AMS', 'Support', 'SLAs', 'Governance', 'Managed Operations'],
    offerDetail: {
      valueProposition: 'Ensure operational continuity, cost predictability, and controlled evolution with outcome-driven teams.',
      metrics: [
        { value: '-50%', label: 'Operational Downtime' },
        { value: '+30%', label: 'Internal Team Efficiency' },
        { value: '-20%', label: 'Technical Backlog Reduction' },
      ],
      differentials: [
        'Squads and specialists focused on outcomes, not just staffing.',
        'Clear governance, SLAs, and objective metrics.',
        'AI-powered acceleration while maintaining quality and security.',
        'Extensive experience in critical and regulated environments.',
      ],
    },
  },
  {
    id: 'modernizacao-legados',
    title: 'Legacy Modernization',
    subtitle: 'Cost reduction and technology evolution with 4AI accelerators',
    problem: 'Traditional migration squads face big-bang rewrite risks, loss of business rules, downtime, unpredictable costs, and dependence on obsolete technologies. Foursys solves this with 4AI accelerators (Rule Extractor, Code Converter, and Certification), 6-week release cycles, and AI automation + human oversight (50/50).',
    target: 'Organizations with critical systems in COBOL, VB6, .NET, Java, or mainframe that need to modernize with controlled risk, incremental roadmap, and AI-powered acceleration.',
    icon: 'git-merge',
    color: 'from-violet-500 to-violet-700',
    tags: ['Legacy', 'Migration', 'Replatform', '4AI', 'Cloud', 'Modernization'],
    offerDetail: {
      valueProposition: 'The only modernization solution that combines technological transformation, advanced security, and human empowerment in an integrated approach — with 4AI accelerators covering COBOL, VB6, .NET, Java, Angular, React, and Vue. Methodology, system and business documentation, environment prepared with accelerator agents, cybersecurity, observability, and FinOps.',
      metrics: [
        { value: '+30%', label: 'Cost Reduction' },
        { value: '+70%', label: 'Time to Market Acceleration' },
        { value: '+60%', label: 'Code Security Improvement' },
      ],
      differentials: [
        '4AI Accelerators: Rule Extractor, Code Converter, and AI-Powered Certification.',
        'Language coverage: COBOL, VB6, .NET Core/Framework, Java (Spring, Struts, SpringBoot), Angular, React, and Vue.',
        '50/50 Automation: AI + human oversight in each release cycle.',
        'Scalable 6-week release cycles with comprehensive quality governance.',
        '3 flexible engagement models: Essential, Strategic, and Evolution.',
        'Cybersecurity, observability, and FinOps integrated from day one.',
        'POC/POT with real legacy samples before contracting — proven value.',
      ],
    },
  },
  {
    id: 'arquitetura-devops',
    title: 'Architecture, Cloud & DevOps',
    subtitle: 'Cloud-native, resilient, and scalable platforms',
    problem: 'We design cloud-native architectures, multicloud strategies, and DevOps pipelines to support growth, high availability, cost optimization, and faster cycles with security.',
    target: 'Teams and companies that need to gain scale, resilience, and predictability with modern architecture, cloud, and delivery automation.',
    icon: 'landmark',
    color: 'from-fuchsia-500 to-fuchsia-700',
    tags: ['Architecture', 'Cloud-Native', 'Multicloud', 'DevOps', 'CI/CD', 'Kubernetes', 'FinOps', 'Observability'],
    offerDetail: {
      valueProposition: 'Build resilient, scalable, and efficient cloud-native platforms — aligning modern architecture, multicloud strategies, DevOps practices, and FinOps to the real pace of business. The global cloud computing market reached $832 billion in 2025, and 92% of workloads will be on cloud by 2028.',
      metrics: [
        { value: '$832B', label: 'Cloud Market 2025' },
        { value: '40%', label: 'Average TCO Reduction' },
        { value: 'Zero', label: 'Downtime in Migrations' },
        { value: '+40%', label: 'Deploy Frequency' },
      ],
      differentials: [
        'Cloud-native architectures with microservices, event-driven design, and elastic infrastructure.',
        'Direct partnership with Microsoft Azure, AWS, and Google Cloud.',
        'Legacy-to-Cloud migration with zero downtime.',
        'DevOps focused on predictability, not just speed.',
        'FinOps & cloud cost optimization — average 40% TCO reduction.',
        'Kubernetes, containers, and serverless in mission-critical environments.',
        'Multicloud governance — 60% reduction in vendor lock-in.',
        'Sovereign cloud for regulated sectors (financial, healthcare, government).',
        'End-to-end observability and SRE for high availability.',
        'Edge computing + cloud for intelligent distributed infrastructure.',
      ],
    },
  },
  {
    id: 'integracoes-open-finance',
    title: 'API Integration & Open Finance',
    subtitle: 'Connectivity, scalability, and new business models',
    problem: 'We connect ecosystems, channels, and partners through scalable APIs, enabling integrated journeys and new digital business opportunities.',
    target: 'Companies that depend on integration across platforms, partners, and regulated ecosystems.',
    icon: 'link',
    color: 'from-pink-500 to-pink-700',
    tags: ['APIs', 'Open Finance', 'Integration', 'Microservices', 'Ecosystems'],
    offerDetail: {
      valueProposition: 'Connect systems, partners, and ecosystems with security, scalability, and governance, enabling new business models.',
      metrics: [
        { value: '-30%', label: 'Failure Reduction' },
        { value: '5x', label: 'Scalability Improvement' },
        { value: '+30%', label: 'New Business Revenue' },
      ],
      differentials: [
        'Strong expertise in APIs, events, and complex integrations.',
        'Hands-on experience with Open Finance and regulated environments.',
        'API governance from design to operations.',
        'Integration designed as a product, not just technology.',
      ],
    },
  },
  {
    id: 'engenharia-software-ia',
    title: 'Software Design & Engineering with AI',
    subtitle: 'Accelerated engineering with quality and control',
    problem: 'We apply AI to the engineering lifecycle to accelerate discovery, development, and documentation without losing governance, traceability, or technical standards.',
    target: 'Companies looking to increase software throughput with enterprise quality and pragmatic use of AI.',
    icon: 'brain',
    color: 'from-rose-500 to-rose-700',
    tags: ['AI', 'Software Engineering', 'Discovery', 'Code Assist', 'Governance'],
    offerDetail: {
      valueProposition: 'Deliver critical software faster with greater quality and control, using AI responsibly throughout the entire lifecycle.',
      metrics: [
        { value: '+50%', label: 'Team Productivity' },
        { value: '+35%', label: 'Development Acceleration' },
        { value: '-20%', label: 'Cost per Feature Reduction' },
      ],
      differentials: [
        'AI integrated into the SDLC (analysis, development, testing, and maintenance).',
        'Disciplined engineering: AI accelerates, it doesn\'t replace fundamentals.',
        'Strong governance, traceability, and quality.',
        'Experience with core and regulated systems.',
      ],
    },
  },
  {
    id: 'ai-augmented-squad',
    title: 'AI Squad',
    subtitle: 'Human teams + AI with SDD framework and enterprise governance',
    problem: 'Traditional squads suffer from delays, lack of code standardization, low test coverage, inconsistent quality, rework, talent scarcity, and missing documentation. The AI Squad solves these problems with human teams amplified by over 20 AI agents specialized in each phase of the process.',
    target: 'Companies looking to accelerate deliveries with enterprise quality, reduce lead time, and eliminate traditional squad bottlenecks with pragmatic AI adoption.',
    icon: 'brain-circuit',
    color: 'from-orange-500 to-orange-700',
    tags: ['AI Squad', 'SDD', 'AI Agents', 'Framework', 'Governance'],
    offerDetail: {
      valueProposition: 'Operational Human + AI Squad with PO, AI Engineer, Developers, and QA amplified by over 20 specialized agents. Proprietary SDD framework (Discovery → Design → Development → Quality → Deploy), comprehensive documentation (C4, ADRs, API specs), real-time performance dashboards, and agents trained on the client\'s stack, domain, and business rules — without lock-in.',
      metrics: [
        { value: '80%', label: 'Productivity Gain' },
        { value: '65%', label: 'Lead Time Reduction' },
        { value: '70%', label: 'Rework Decrease' },
      ],
      differentials: [
        'SDD (OpenSpec) Framework with specialized agents at each lifecycle phase.',
        'Comprehensive documentation: C4 diagrams, ADRs, user stories, API specifications, and tests.',
        'Real-time dashboards: velocity, burndown, costs, AI acceptance rate, code quality.',
        'Agents trained on the client\'s stack, domain, and business rules — not generic.',
        'Isolated and encrypted cloud per client with GDPR & EU AI Act compliance.',
        'Full client autonomy: open-source code for continuous evolution, no dependency.',
        'Two deployment models: client environment or Foursys environment.',
      ],
    },
  },
  {
    id: 'cloud-finops',
    title: 'Cloud & FinOps',
    subtitle: 'Cloud scale with financial efficiency',
    problem: 'We optimize cloud environments to balance performance, governance, and cost, turning consumption into measurable efficiency.',
    target: 'Companies already operating in the cloud that need to improve predictability, efficiency, and financial governance.',
    icon: 'cloud',
    color: 'from-orange-400 to-orange-600',
    tags: ['Cloud', 'FinOps', 'AWS', 'Azure', 'Cost Optimization'],
    offerDetail: {
      valueProposition: 'Balance scale, cost, and governance in cloud environments, turning consumption into measurable and predictable efficiency.',
      metrics: [
        { value: '-35%', label: 'Cloud Cost Reduction' },
        { value: '+99.9%', label: 'Service Availability' },
        { value: '+40%', label: 'Financial Visibility' },
      ],
      differentials: [
        'FinOps as a discipline, not just a tool.',
        'Continuous optimization with real business metrics.',
        'Multi-cloud experience (AWS, Azure, GCP).',
        'Financial governance integrated with technical operations.',
      ],
    },
  },
  {
    id: 'dados-analytics',
    title: 'Data & Analytics',
    subtitle: 'Intelligence for real-time decision making',
    problem: 'We build data platforms, real-time analytics, data mesh, and data democratization to turn volume into faster, more reliable, and evidence-driven decisions. Data-driven companies are 23x more likely to acquire customers and 6x more likely to retain them.',
    target: 'Businesses that need to elevate their analytical maturity, build modern data platforms, and accelerate decisions with reliable data.',
    icon: 'bar-chart',
    color: 'from-amber-400 to-amber-600',
    tags: ['Analytics', 'BI', 'Data Lakehouse', 'Databricks', 'Data Mesh', 'Real-time', 'MLOps', 'Data Governance'],
    offerDetail: {
      valueProposition: 'Turn data into faster and more reliable decisions, building the analytical foundation your business needs to grow intelligently. The global Big Data & Analytics market is expected to reach $350 billion by 2026, with real-time analytics growing 28% annually and Data Governance Tools at 35%.',
      metrics: [
        { value: '$350B', label: 'Data & Analytics Market 2026' },
        { value: '280%', label: 'First Year ROI' },
        { value: '40%', label: 'Stockout Reduction (Foursys Case)' },
        { value: '3d→0', label: 'Instant Reports' },
      ],
      differentials: [
        'Data Platform with multi-source ingestion, real-time dashboards, and automated alerts.',
        'Strategic Databricks partnership for Data Lakehouse — unifying data warehouse and data lake.',
        'Data Governance & Quality integrated from the source — a critical differentiator when 73% of data projects fail.',
        'Real-time Analytics & Streaming for real-time decisions.',
        'Modern architecture: Data Mesh decentralizes ownership to business domains.',
        'MLOps & Model Management for model governance in production.',
        'BI & Executive Dashboards — from 3-day reports to instant.',
        'Generative AI applied to analytics ("ask your data") to democratize insights.',
        'Synthetic data to solve privacy challenges in model training.',
        'Proven cases: 40% reduction in stockouts, 280% ROI in the first year.',
      ],
    },
  },
  {
    id: 'quality-testes-ia',
    title: 'AI-Powered Quality & Testing',
    subtitle: 'Quality in scope is not an extra cost — it prevents greater costs',
    problem: 'Traditional squads face rework, production failures, lack of risk visibility, process inconsistency, and wasted time. Foursys\'s Quality Practice solves this with two specialized towers (COE + CSC), Shift-Left Framework, AI Automator Agent, and DataForge for synthetic data.',
    target: 'Teams that need to accelerate releases without compromising stability, compliance, and user experience, with a flexible plug-and-play model.',
    icon: 'check-circle',
    color: 'from-yellow-400 to-yellow-600',
    tags: ['QA', 'Testing', 'AI', 'Automation', 'Shift-Left', 'COE', 'Gherkin'],
    offerDetail: {
      valueProposition: 'Software Quality Practice with two towers: COE (Excellence Tower — methodology, standards, tools, indicators, NFT, products, templates) and CSC (Execution Tower — QA in squads, GMUD certification, functional automation, training). Plug-and-play model for flexible connection with client teams and projects.',
      metrics: [
        { value: '+10x', label: 'Risk Visibility' },
        { value: '+80%', label: 'Critical Failure Prevention' },
        { value: '+6x', label: 'Test Acceleration with AI' },
      ],
      differentials: [
        'Two specialized towers: COE (Excellence) + CSC (Operations) in a plug-and-play model.',
        'Shift-Left Framework: quality anticipated from scenario design, requirements validation, and test data.',
        'AI Automator Agent: +120 scenarios/month vs 20 manual (6x more productivity).',
        'DataForge: synthetic data generation integrated in 1 day, bias-free.',
        'BDD/Gherkin scenarios with +70% functional test coverage.',
        'Dashboards with 5+ indicators (Planned vs Executed, Defects, Status, Category, Front).',
        'GMUD Certification with critical path automation in 2 days.',
      ],
    },
  },
  {
    id: 'ciberseguranca',
    title: 'Cybersecurity',
    subtitle: 'Protection, compliance, and risk management',
    problem: 'We mitigate vulnerabilities and strengthen controls to protect assets, meet regulations, and reduce incident exposure.',
    target: 'Companies with high security, compliance, and continuous digital risk management requirements.',
    icon: 'shield-check',
    color: 'from-lime-400 to-lime-600',
    tags: ['Security', 'Risk', 'Compliance', 'LGPD', 'Protection'],
    offerDetail: {
      valueProposition: 'Protect digital assets, ensure compliance, and reduce risk exposure with an integrated and continuous approach.',
      metrics: [
        { value: '-80%', label: 'Vulnerability Reduction' },
        { value: '+70%', label: 'Regulatory Compliance' },
        { value: '-60%', label: 'Incident Response Time' },
      ],
      differentials: [
        'Integrated vision: security as an attribute, not a barrier.',
        'Experience in regulated environments (LGPD, Bacen, PCI-DSS).',
        'Control automation and continuous monitoring.',
        'Security culture embedded in development teams.',
      ],
    },
  },
  {
    id: 'fourblox',
    title: 'FourBlox',
    subtitle: 'Custom solutions in up to 30 days — no more never-ending projects',
    problem: 'Most companies face systems that don\'t communicate with each other, out-of-control parallel spreadsheets, low tool adoption, projects that never finish, high investment without clear returns, and generic solutions that don\'t fit their reality. The problem isn\'t technology — it\'s a lack of customization with methodology.',
    target: 'Companies that need custom digital solutions with speed, financial predictability, and continuous evolution, without 6 to 12-month projects.',
    icon: 'blocks',
    color: 'from-emerald-500 to-emerald-700',
    tags: ['Platform', 'Modular', 'Subscription', 'SaaS', '30 days', 'Custom'],
    offerDetail: {
      valueProposition: 'Modular subscription-based solution platform with 18+ ready solutions across 9 categories. Structured assessment, custom solution design, tailored configuration, production in up to 30 days, and continuous data-driven evolution.',
      metrics: [
        { value: '30d', label: 'Production in up to 30 days' },
        { value: '18+', label: 'Available solutions' },
        { value: '9', label: 'Business categories' },
      ],
      differentials: [
        'Production in 30 days — no 6 to 12-month projects.',
        'Subscription model with financial predictability.',
        'Intelligent modularity: activate only what delivers value.',
        'User-centered UX: real adoption, not imposition.',
        'Continuous evolution: the solution grows with your company.',
        'Pre-configured kits for accelerated results (Operational Efficiency, People Management 360, Sales Performance, Executive Governance).',
        '9 categories: People Management, Operations, Finance, Sales, Projects, ESG, Data & Analytics, Governance.',
      ],
    },
  },
  {
    id: 'hiperautomacao-rpa',
    title: 'Hyperautomation & RPA',
    subtitle: 'Operational efficiency at scale',
    problem: 'We automate end-to-end processes to reduce manual effort, eliminate bottlenecks, and increase productivity with control.',
    target: 'Operational areas that need to scale processes with less friction and greater efficiency.',
    icon: 'cpu',
    color: 'from-cyan-300 to-cyan-500',
    tags: ['RPA', 'Automation', 'Efficiency', 'Workflow', 'Productivity'],
    offerDetail: {
      valueProposition: 'Automate end-to-end processes, reducing manual effort and increasing productivity with governance and control.',
      metrics: [
        { value: '-70%', label: 'Manual Effort Reduction' },
        { value: '+50%', label: 'Operational Productivity' },
        { value: '-40%', label: 'Process Cycle Time' },
      ],
      differentials: [
        'Intelligent automation: RPA + AI + orchestration.',
        'Focus on critical processes with measurable ROI.',
        'Continuous robot governance and monitoring.',
        'Enterprise-scale experience in complex environments.',
      ],
    },
  }
]

const deliveryModelsPt: DeliveryModel[] = [
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

const deliveryModelsEn: DeliveryModel[] = [
  {
    id: 'projeto',
    title: 'Project',
    description: 'Defined scope, timeline, and cost. Ideal for initiatives with clear objectives and fixed deliverables.',
    icon: 'clipboard-list',
    features: [
      'Dedicated project management',
      'Milestone-based delivery',
      'Contractual scope guarantee',
      'Periodic executive reports'
    ]
  },
  {
    id: 'squad',
    title: 'Dedicated Squad',
    description: 'Exclusive multidisciplinary team for the client. Maximum flexibility and delivery speed.',
    icon: 'users',
    features: [
      'Complete full-stack squad',
      'Agile rituals integrated with the client',
      'Ability to adapt priorities',
      'Continuous delivery (CI/CD)'
    ]
  },
  {
    id: 'alocacao',
    title: 'Staff Augmentation',
    description: 'Specialized professionals integrated into the client\'s team. Fills specific skill gaps.',
    icon: 'user',
    features: [
      'Senior professionals and specialists',
      'Integration with the client\'s processes',
      'Foursys quality and development management',
      'Rapid replacement in case of absence'
    ]
  },
  {
    id: 'squad-agentes',
    title: 'Squad + AI Agents',
    description: 'The evolution of the squad: professionals amplified by AI agents that automate repetitive tasks and accelerate deliveries.',
    icon: 'brain-circuit',
    features: [
      'AI agents for task automation',
      'AI-assisted code generation',
      'AI-powered automated testing',
      '3x faster than traditional squads',
      'Continuously AI-monitored quality'
    ],
    highlight: true
  },
  {
    id: 'sustentacao-suporte',
    title: 'Support & Maintenance',
    description: 'Continuous operation of critical environments with rigorous SLAs, proactive governance, and ongoing evolution — ensuring stability and predictability for the business.',
    icon: 'headphones',
    features: [
      'Contractual SLAs with penalties and clear targets',
      '24/7 monitoring with incident response',
      'Evolutionary backlog management and prioritized fixes',
      'Availability and performance management reports',
      'Continuous knowledge transfer and documentation'
    ]
  },
  {
    id: 'produtos-assinatura',
    title: 'Foursys Subscription Products',
    description: 'Ready-made, customizable digital platforms maintained by Foursys in a SaaS model. The client pays for results, not effort — with go-live in weeks and continuous evolution included.',
    icon: 'package-check',
    features: [
      'Ready-made platforms: check-in, event management, portals, and more',
      'Brand, workflow, and business rule customization',
      'Monthly subscription model with no upfront investment',
      'Updates, hosting, and support included',
      'Scalable on demand with cloud-native infrastructure'
    ]
  }
]

export const serviceLines = serviceLinesPt
export const deliveryModels = deliveryModelsPt

export function getServiceLines(lang: Language): ServiceLine[] {
  return lang === 'en' ? serviceLinesEn : serviceLinesPt
}

export function getDeliveryModels(lang: Language): DeliveryModel[] {
  return lang === 'en' ? deliveryModelsEn : deliveryModelsPt
}
