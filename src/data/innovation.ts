export interface InnovationLeader {
  name: string
  approach: string
  highlight: string
}

export interface InnovationTrend {
  id: string
  title: string
  tagline: string
  description: string
  icon: string
  color: string
  accent: string
  gradient: string
  leaders: InnovationLeader[]
  foursysPosition: string
  keyCapabilities: string[]
  stats: { value: string; label: string }[]
  deepDive: {
    overview: string
    whyItMatters: string
    marketSize: string
    futureOutlook: string
  }
}

export const innovationTrends: InnovationTrend[] = [
  {
    id: 'gen-ai-agents',
    title: 'IA Generativa & Agentes Autônomos',
    tagline: 'A revolução da inteligência que executa',
    description: 'Modelos de linguagem, agentes autônomos e automação cognitiva estão redefinindo como empresas operam, decidem e entregam valor.',
    icon: 'brain-circuit',
    color: '#8B5CF6',
    accent: '#C084FC',
    gradient: 'from-violet-600/40 via-purple-800/20 to-transparent',
    leaders: [
      {
        name: 'Accenture',
        approach: 'GenAI Platform Factory — plataforma proprietária que reduz tempo de deploy de IA generativa em 30%. Mais de 45.000 profissionais dedicados a dados & IA, com US$ 3B investidos em AI nos últimos 3 anos.',
        highlight: '30% redução no deploy de GenAI',
      },
      {
        name: 'McKinsey (QuantumBlack)',
        approach: 'Divisão QuantumBlack lidera projetos de IA com rates premium (US$ 300-500+/h). Comprovaram ganhos de 40% em eficiência de warehouse. Modelo "AI at Scale" para industrializar projetos de IA.',
        highlight: '40% ganho em eficiência operacional',
      },
      {
        name: 'Cognizant',
        approach: 'Reconhecida pela Fortune como "Most Innovative" 4 anos seguidos. AI Builder para adoção e escala de IA. 65 patentes de IA do AI Lab. IA embutida em 100% da entrega de consultoria.',
        highlight: '65 patentes de IA, Fortune Most Innovative 4x',
      },
    ],
    foursysPosition: 'Método IA First: de piloto a ROI mensurável em 6 semanas. Laboratório de IA Híbrida com agentes controlados, auditáveis e com supervisão humana. 85% de conversão de piloto para produção.',
    keyCapabilities: [
      'Agentes Autônomos com Governança',
      'RAG & Fine-tuning Empresarial',
      'Automação Cognitiva de Processos',
      'IA Generativa para Code & QA',
      'Hiperautomação com LLMs',
    ],
    stats: [
      { value: '$184B', label: 'Mercado GenAI 2030' },
      { value: '85%', label: 'Conversão piloto→prod Foursys' },
      { value: '6 sem', label: 'Piloto a ROI mensurável' },
      { value: '3x', label: 'Velocidade com AI-Augmented' },
    ],
    deepDive: {
      overview: 'A IA Generativa evoluiu de chatbots experimentais para agentes autônomos que executam fluxos de trabalho complexos. Em 2026, empresas que não adotaram IA generativa em produção estão 2-3 anos atrás dos líderes de seus setores.',
      whyItMatters: 'Segundo o Gartner, 80% das empresas terão implantado agentes de IA até 2028. O diferencial não é mais "ter IA", mas ter governança, auditabilidade e resultados mensuráveis. A abordagem "piloto eterno" está custando bilhões em oportunidade perdida.',
      marketSize: 'O mercado global de IA Generativa deve alcançar US$ 184 bilhões até 2030 (CAGR 36%). Agentes autônomos representam o segmento de maior crescimento, com projeção de US$ 47B até 2028.',
      futureOutlook: 'Agentes multi-modal (texto, imagem, código, voz) integrados a ERPs e CRMs serão o padrão. A supervisão humana permanece crítica. Empresas precisam de frameworks de governança para escalar com segurança.',
    },
  },
  {
    id: 'cloud-native',
    title: 'Cloud-Native & Multicloud',
    tagline: 'Infraestrutura que acompanha a velocidade do negócio',
    description: 'Arquiteturas cloud-native, microsserviços, event-driven e estratégias multicloud são o alicerce da transformação digital moderna.',
    icon: 'cloud',
    color: '#06B6D4',
    accent: '#22D3EE',
    gradient: 'from-cyan-600/40 via-teal-800/20 to-transparent',
    leaders: [
      {
        name: 'Deloitte',
        approach: 'Líder no Gartner Magic Quadrant para Cloud IT Transformation por 5 anos consecutivos. Deloitte Fabric com 800+ clientes e 92% de renovação. Especialistas em migração de workloads regulados.',
        highlight: 'Gartner Leader 5 anos, 92% renewal rate',
      },
      {
        name: 'Capgemini',
        approach: 'Cloud Center of Excellence com mais de 30.000 profissionais cloud. Parcerias premium com AWS, Azure e GCP. Framework RISE para migração SAP to cloud com zero downtime.',
        highlight: '30.000+ profissionais cloud dedicados',
      },
      {
        name: 'TCS',
        approach: 'TCS Cloud Counsel — plataforma de advisory com IA para otimização de custos cloud. Expertise em multicloud para indústrias reguladas. Maior equipe de profissionais certificados em cloud da Ásia.',
        highlight: 'Cloud Counsel: IA para otimização de custos',
      },
    ],
    foursysPosition: 'Arquiteturas cloud-native com microsserviços, event-driven e infraestrutura elástica. Parceria direta com Microsoft Azure, AWS e Google Cloud. Especialistas em migração de sistemas legados para cloud sem downtime.',
    keyCapabilities: [
      'Migração Legacy-to-Cloud',
      'Kubernetes & Containers',
      'Serverless & Event-Driven',
      'FinOps & Otimização de Custos',
      'Multicloud Governance',
    ],
    stats: [
      { value: '$832B', label: 'Mercado Cloud 2025' },
      { value: '92%', label: 'Workloads em cloud até 2028' },
      { value: 'Zero', label: 'Downtime em migrações Foursys' },
      { value: '40%', label: 'Redução média TCO' },
    ],
    deepDive: {
      overview: 'Cloud-native não é apenas "mover para a nuvem". É repensar arquitetura, operações e cultura para extrair máximo valor da elasticidade, automação e escala global que plataformas cloud oferecem.',
      whyItMatters: 'O IDC projeta que 92% dos workloads estarão em cloud até 2028. Empresas com estratégia multicloud reduzem vendor lock-in em 60% e melhoram resiliência. Mas 67% das migrações excedem orçamento — planejamento é crítico.',
      marketSize: 'O mercado global de cloud computing alcançou US$ 832 bilhões em 2025 e deve ultrapassar US$ 1.2 trilhão até 2028. Cloud-native applications representam o segmento de maior crescimento.',
      futureOutlook: 'Edge computing + cloud cria infraestrutura distribuída inteligente. FinOps se torna obrigatório para controlar custos. Sovereign cloud ganha força em setores regulados (financeiro, saúde, governo).',
    },
  },
  {
    id: 'industry-iot',
    title: 'Industry 4.0 & IoT',
    tagline: 'Fábricas inteligentes e operações conectadas',
    description: 'Manufatura inteligente, digital twins, sensores IoT e automação industrial estão transformando cadeias produtivas inteiras com dados em tempo real.',
    icon: 'factory',
    color: '#F43F5E',
    accent: '#FB7185',
    gradient: 'from-rose-600/40 via-pink-800/20 to-transparent',
    leaders: [
      {
        name: 'Siemens (MindSphere)',
        approach: 'Plataforma MindSphere conecta ativos industriais à nuvem. Digital twins para simulação e otimização de fábricas inteiras antes da implantação física. Líder global em automação industrial.',
        highlight: 'Digital Twins para fábricas inteiras',
      },
      {
        name: 'Roland Berger',
        approach: 'Principal consultoria estratégica europeia para Industry 4.0. Framework de maturidade digital para manufatura. Forte em transformação de cadeias automotivas e farmacêuticas.',
        highlight: 'Líder europeu em estratégia industrial',
      },
      {
        name: 'NTT Data',
        approach: 'Centros de inovação IoT no Japão, Europa e EUA. Soluções end-to-end de smart factory com edge computing, analytics preditivo e integração OT-IT para indústrias de grande escala.',
        highlight: 'Edge + IoT para smart factories',
      },
    ],
    foursysPosition: 'Integração de sistemas industriais com plataformas cloud, dashboards de monitoramento operacional em tempo real e automação de processos de manufatura com IA e analytics preditivo.',
    keyCapabilities: [
      'Integração OT-IT Industrial',
      'Dashboards Operacionais Real-time',
      'Analytics Preditivo & Manutenção',
      'Automação com IA para Manufatura',
      'Edge Computing & IoT Gateways',
    ],
    stats: [
      { value: '$377B', label: 'Mercado Industry 4.0 2029' },
      { value: '30%', label: 'Redução downtime com IoT' },
      { value: '25%', label: 'Ganho produtividade média' },
      { value: '75B', label: 'Dispositivos IoT até 2030' },
    ],
    deepDive: {
      overview: 'Industry 4.0 representa a convergência de automação industrial com tecnologias digitais — IoT, IA, cloud, robótica e digital twins. Fábricas inteligentes usam dados em tempo real para otimizar produção, qualidade e manutenção.',
      whyItMatters: 'Segundo a McKinsey, fábricas que implementam Industry 4.0 reduzem downtime em 30-50%, aumentam produtividade em 20-30% e reduzem custos de qualidade em até 35%. A competitividade industrial depende diretamente de maturidade digital.',
      marketSize: 'O mercado global de Industry 4.0 deve alcançar US$ 377 bilhões até 2029 (CAGR 20.7%). IoT industrial representa US$ 110B, digital twins US$ 48B e robótica colaborativa US$ 12B deste total.',
      futureOutlook: 'Fábricas autônomas com IA generativa para planejamento de produção. 5G privado habilita IoT de ultra-baixa latência. Gêmeos digitais evoluem de simulação para operação autônoma com IA.',
    },
  },
  {
    id: 'cybersecurity-zero-trust',
    title: 'Cybersecurity & Zero Trust',
    tagline: 'Segurança que habilita, não que restringe',
    description: 'Arquitetura Zero Trust, segurança em camadas e compliance contínuo são essenciais para operar em um mundo de ameaças sofisticadas.',
    icon: 'shield',
    color: '#10B981',
    accent: '#34D399',
    gradient: 'from-emerald-600/40 via-green-800/20 to-transparent',
    leaders: [
      {
        name: 'IBM Security',
        approach: 'IBM X-Force é referência global em threat intelligence. QRadar SIEM + Watson para detecção de ameaças com IA. Managed Security Services para 4.000+ clientes. Resposta a incidentes em 130+ países.',
        highlight: '4.000+ clientes MSS, 130+ países',
      },
      {
        name: 'EY',
        approach: 'EY CyberSecurity Center com SOCs globais 24/7. Forte em compliance regulatório (PCI-DSS, GDPR, LGPD, SOX). Modelo "Security by Design" integrado ao ciclo de desenvolvimento.',
        highlight: 'SOCs 24/7, Security by Design',
      },
      {
        name: 'PwC',
        approach: 'Divisão Cybersecurity & Privacy com 5.000+ profissionais. Líderes em GRC (Governance, Risk, Compliance). Framework proprietário de Zero Trust Assessment. Forte em simulação de ataques (Red Team).',
        highlight: '5.000+ profissionais, Red Team premium',
      },
    ],
    foursysPosition: 'Portfolio Cyber Security completo: SAST, DAST, pentest, compliance regulatório (BACEN, LGPD, PCI-DSS). Modelo Zero Trust integrado à esteira DevSecOps com monitoramento contínuo.',
    keyCapabilities: [
      'Zero Trust Architecture',
      'DevSecOps Pipeline',
      'SAST/DAST Automatizado',
      'SOC & Monitoramento 24/7',
      'Compliance BACEN/LGPD/PCI',
    ],
    stats: [
      { value: '$298B', label: 'Mercado Cyber 2028' },
      { value: '$4.5M', label: 'Custo médio de um breach' },
      { value: '277 dias', label: 'Tempo médio para detectar breach' },
      { value: '65%', label: 'Redução com Zero Trust' },
    ],
    deepDive: {
      overview: 'A arquitetura Zero Trust parte do princípio "nunca confie, sempre verifique". Em 2026, com trabalho remoto consolidado e APIs expostas, o perímetro de segurança tradicional deixou de existir.',
      whyItMatters: 'O custo médio de um data breach alcançou US$ 4.5 milhões em 2025 (IBM). Empresas que implementam Zero Trust reduzem o custo de brechas em 65%. Regulações como LGPD e DORA da UE exigem compliance contínuo.',
      marketSize: 'O mercado global de cybersecurity deve alcançar US$ 298 bilhões até 2028 (CAGR 12.4%). Zero Trust Network Access (ZTNA) é o segmento de maior crescimento, substituindo VPNs tradicionais.',
      futureOutlook: 'IA ofensiva vs IA defensiva define o próximo capítulo. Quantum-safe cryptography se prepara para a era pós-quântica. Identity-first security se torna o novo perímetro corporativo.',
    },
  },
  {
    id: 'data-analytics',
    title: 'Data & Analytics',
    tagline: 'Dados são o novo petróleo — analytics é a refinaria',
    description: 'Data platforms, analytics em tempo real, data mesh e democratização de dados são fundamentais para decisões baseadas em evidências.',
    icon: 'bar-chart-3',
    color: '#F59E0B',
    accent: '#FBBF24',
    gradient: 'from-amber-600/40 via-orange-800/20 to-transparent',
    leaders: [
      {
        name: 'KPMG Lighthouse',
        approach: 'Centro de excelência em dados e IA do KPMG. Combina domain expertise financeiro com plataformas de analytics avançado. Forte em data governance para setores regulados.',
        highlight: '#1 em Inovação no Consultancy.org',
      },
      {
        name: 'McKinsey QuantumBlack',
        approach: 'Divisão de dados e analytics da McKinsey. Rates premium (US$ 300-500+/h) justificados por ROI comprovado. Plataforma Horizon para MLOps e model governance. 1.000+ data scientists.',
        highlight: '1.000+ data scientists, ROI comprovado',
      },
      {
        name: 'Deloitte + Databricks',
        approach: 'Parceria estratégica com Databricks para Data Lakehouse. Deloitte Fabric integra 800+ clientes em uma plataforma unificada de dados. Forte em real-time analytics e streaming.',
        highlight: 'Deloitte Fabric: 800+ clientes, 92% renewal',
      },
    ],
    foursysPosition: 'Data Platform com ingestão de múltiplas fontes, dashboards em tempo real e alertas automáticos. Parceria Databricks. Casos comprovados: 40% redução de ruptura de estoque, relatórios de 3 dias para instantâneo.',
    keyCapabilities: [
      'Data Lakehouse (Databricks)',
      'Real-time Analytics & Streaming',
      'Data Governance & Quality',
      'BI & Dashboards Executivos',
      'MLOps & Model Management',
    ],
    stats: [
      { value: '$350B', label: 'Mercado Data & Analytics 2026' },
      { value: '40%', label: 'Redução ruptura (case Foursys)' },
      { value: '280%', label: 'ROI primeiro ano' },
      { value: '3d→0', label: 'Relatórios instantâneos' },
    ],
    deepDive: {
      overview: 'Data & Analytics evoluiu de relatórios estáticos para plataformas de decisão em tempo real. Data Mesh descentraliza ownership de dados para os domínios de negócio, enquanto Data Lakehouse unifica data warehouse e data lake.',
      whyItMatters: 'Segundo o IDC, empresas data-driven têm 23x mais chances de adquirir clientes e 6x mais de retê-los. Mas 73% dos projetos de dados ainda falham — a diferença está em governance, qualidade e cultura de dados.',
      marketSize: 'O mercado global de Big Data & Analytics deve alcançar US$ 350 bilhões em 2026. Real-time analytics cresce 28% ao ano. Data Governance Tools crescem 35% impulsionados por regulação.',
      futureOutlook: 'Data Fabric e Data Mesh se tornam complementares. IA generativa aplicada a analytics ("ask your data") democratiza insights. Synthetic data resolve desafios de privacidade em treinamento de modelos.',
    },
  },
]
