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
  {
    id: 'ai-robotics',
    title: 'IA & Robótica',
    tagline: 'Inteligência física — da fábrica ao mundo real',
    description: 'Robôs humanoides, cobots com IA, veículos autônomos e robótica cirúrgica estão criando a era da "Physical AI", onde a inteligência artificial ganha corpo, mãos e mobilidade.',
    icon: 'bot',
    color: '#EC4899',
    accent: '#F472B6',
    gradient: 'from-pink-600/40 via-fuchsia-800/20 to-transparent',
    leaders: [
      {
        name: 'NVIDIA',
        approach: 'Plataforma Isaac para robótica (simulação, treino e deploy). Foundation model GR00T para humanoides. Cosmos para geração de dados sintéticos. Jetson para inferência de IA na borda. Ecossistema de parceiros inclui FANUC, ABB, KUKA, Yaskawa, Figure AI e Agility Robotics.',
        highlight: 'Isaac + GR00T: infraestrutura de IA para toda a indústria robótica',
      },
      {
        name: 'Tesla (Optimus)',
        approach: '8.000 unidades acumuladas em deploy nas próprias fábricas (jan/2026). Venda ao público prevista para 2027. Usa pipeline de visão computacional do FSD (Full Self-Driving) para manipulação generalista. Objetivo: robô utilitário de US$ 20-30 mil para tarefas domésticas e industriais.',
        highlight: '8.000 Optimus em produção, venda pública em 2027',
      },
      {
        name: 'Unitree',
        approach: 'Líder mundial em vendas de humanoides: 5.500 unidades em 2025. Modelo mais acessível do mercado a partir de US$ 5.900. Estratégia de democratização da robótica humanoide com produção em escala na China.',
        highlight: '5.500 unidades, a partir de US$ 5.900',
      },
    ],
    foursysPosition: 'A Foursys monitora ativamente o ecossistema de Physical AI e posiciona-se como parceira de integração para empresas que desejam incorporar robótica inteligente em suas operações — desde automação de warehouse até RPA avançado com agentes físicos, conectando plataformas NVIDIA Isaac, cobots industriais e soluções FourBlox para orquestração.',
    keyCapabilities: [
      'Integração de Cobots com Sistemas Enterprise',
      'Plataformas NVIDIA Isaac & Omniverse',
      'Automação Inteligente de Warehouse',
      'RPA Avançado com Agentes Físicos',
      'Digital Twins para Simulação Robótica',
      'Orquestração via FourBlox',
    ],
    stats: [
      { value: '50K+', label: 'Humanoides previstos 2026' },
      { value: '700%', label: 'Crescimento embarques 2025→2026' },
      { value: '$39B', label: 'Valuation Figure AI' },
      { value: '2.5B', label: 'Robôs projetados 2035' },
    ],
    deepDive: {
      overview: 'A convergência de IA generativa com robótica está criando a era da "Physical AI" — máquinas que não apenas pensam, mas agem no mundo físico. Em 2025, os embarques globais de robôs humanoides ultrapassaram 14.500 unidades, e a projeção para 2026 é de mais de 50.000 — um crescimento de 700%. A China domina 90% dos embarques, mas os EUA lideram em investimento e valuations. O mercado se divide em cinco segmentos: Robôs Humanoides (Unitree, AgiBot, Tesla Optimus, Figure AI, UBTECH, Agility Robotics, Fourier, Sanctuary AI, Apptronik), Robótica Industrial (FANUC, ABB, KUKA, Yaskawa, Universal Robots), Infraestrutura de IA para Robótica (NVIDIA Isaac, GR00T, Cosmos, Jetson), Robótica Autônoma e Logística (Boston Dynamics, Amazon Robotics, Waymo), e Robótica Cirúrgica (Intuitive Surgical, Medtronic).',
      whyItMatters: 'A robótica com IA resolve o problema fundamental de escassez de mão de obra em manufatura, logística, saúde e serviços. FANUC tem mais de 1 milhão de robôs instalados globalmente. Amazon opera +750 mil robôs em seus armazéns. Intuitive Surgical já realizou +9 milhões de cirurgias robóticas. Figure AI alcançou valuation de US$ 39 bilhões após captar US$ 1 bilhão em 2025. A NVIDIA conecta todo o ecossistema com sua plataforma Isaac, fornecendo simulação (Omniverse), modelos foundation (GR00T), dados sintéticos (Cosmos) e inferência na borda (Jetson) para os principais fabricantes do mundo.',
      marketSize: 'O mercado global de robótica inteligente deve ultrapassar US$ 260 bilhões até 2030. Robôs humanoides, que em 2025 geraram ~US$ 200 milhões, devem alcançar US$ 38 bilhões até 2035. Robótica industrial (FANUC, ABB, KUKA, Yaskawa) já movimenta US$ 55B/ano. Cobots (Universal Robots) crescem 30% ao ano. Robótica cirúrgica (Intuitive, Medtronic) projeta US$ 18B até 2028. A projeção é de 2,5 bilhões de robôs no mundo até 2035.',
      futureOutlook: 'Robôs humanoides generalistas (Tesla Optimus, Figure AI) chegarão ao consumidor a partir de 2027-2028. Cobots com IA generativa entenderão instruções em linguagem natural. Cirurgia robótica autônoma (Intuitive, Medtronic + NVIDIA) reduzirá erros médicos. Digital Twins com NVIDIA Omniverse permitirão testar robôs inteiros em simulação antes do deploy físico. A NVIDIA se consolida como a "plataforma das plataformas" — fornecendo infraestrutura de IA para praticamente todos os fabricantes de robôs do planeta.',
    },
  },
]
