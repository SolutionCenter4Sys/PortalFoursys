import type { ClientConfig } from '../../types'

// ─── Dados estratégicos extraídos da Apresentação Institucional 4T25 ────────

export interface SantanderStrategicContext {
  reportTitle: string
  period: string
  kpis: { value: string; label: string; delta?: string }[]
  strategyPillars: {
    id: string
    title: string
    subtitle: string
    icon: string
    color: string
    points: string[]
  }[]
  segmentation: { segment: string; description: string }[]
  creditMix: { label: string; percentage: string }[]
  highlights: string[]
}

export const santanderStrategicContext: SantanderStrategicContext = {
  reportTitle: 'Apresentação Institucional 4T25',
  period: '4º Trimestre 2025 (BRGAAP)',
  kpis: [
    { value: 'R$ 1,256T', label: 'Total de Ativos', delta: '' },
    { value: 'R$ 708B', label: 'Carteira de Crédito', delta: '' },
    { value: 'R$ 670B', label: 'Captação de Clientes', delta: '' },
    { value: 'R$ 4,1B', label: 'Lucro Líq. 4T25', delta: '' },
    { value: '17,6%', label: 'ROAE', delta: 'Estável vs 3T25' },
    { value: '73,9M', label: 'Clientes Totais', delta: '' },
    { value: '49.661', label: 'Colaboradores', delta: '' },
    { value: '15,4%', label: 'Índice de Basileia', delta: '+1,1 p.p. vs 4T24' },
  ],
  strategyPillars: [
    {
      id: 'think-value',
      title: 'Think Value',
      subtitle: 'Eficiência e Produtividade',
      icon: '⚡',
      color: '#CC0000',
      points: [
        'Impulsionar eficiência e produtividade com modernização e automação em escala',
        'Aprimoramento contínuo da gestão de riscos e capital com foco na rentabilidade',
        'Otimização do mix de funding e diversificação de receitas',
      ],
    },
    {
      id: 'think-customer',
      title: 'Think Customer',
      subtitle: 'Experiência e Personalização',
      icon: '🎯',
      color: '#FF3333',
      points: [
        'Experiências hiperpersonalizadas guiadas por dados e antecipação de necessidades',
        'Jornada do cliente fluida e integrada entre os canais',
        'Ofertas de produtos mais simples e direcionadas',
      ],
    },
    {
      id: 'think-global',
      title: 'Think Global',
      subtitle: 'Inovação e Escalabilidade',
      icon: '🌎',
      color: '#FF6644',
      points: [
        'Alavancar plataformas globais para acelerar inovações e reduzir custos',
        'Referência na utilização de GenAI, trazendo vantagem competitiva',
        'Brasil como centro de inovação para exportar modelos digitais',
      ],
    },
  ],
  segmentation: [
    { segment: 'Private Banking', description: 'Investimentos acima de R$ 10 milhões' },
    { segment: 'Select', description: 'Renda acima de R$ 7 mil ou investimentos a partir de R$ 100 mil' },
    { segment: 'Santander PF', description: 'Renda mensal inferior a R$ 7 mil' },
    { segment: 'SCIB / Corporate', description: 'Faturamento acima de R$ 200 milhões' },
    { segment: 'Empresas E3', description: 'Faturamento de R$ 30M a R$ 200M' },
    { segment: 'Empresas E2', description: 'Faturamento de R$ 3M a R$ 30M' },
    { segment: 'Empresas E1 / PMEs', description: 'Faturamento até R$ 3 milhões' },
  ],
  creditMix: [
    { label: 'Pessoa Física', percentage: '38%' },
    { label: 'Grandes Empresas', percentage: '35%' },
    { label: 'PMEs', percentage: '13%' },
    { label: 'Financ. ao Consumo', percentage: '13%' },
  ],
  highlights: [
    'Lucro líquido gerencial de R$ 15,6 bilhões em 2025 (+12,6% YoY)',
    'PMEs com crescimento de 23% na carteira de crédito — segmento de maior expansão',
    'NPS de 49 pontos no segmento Empresas — ambição de ser o banco de escolha',
    'R$ 50,7 bilhões em carteira sustentável — nota "A" no CDP e líder em CBIOs (41%)',
    'Comissões cresceram 3,5% YoY — seguros (+14,7%) e administração de recursos (+25,3%) se destacam',
    'CET1 em 11,6% e Índice de Basileia em 15,4% — capitalização sólida',
    'Custo de crédito em 3,76% com NPL Over 90 em 4,0% — gestão de risco como prioridade',
    '92% dos colaboradores realizaram treinamentos — eNPS de 79 pontos',
  ],
}

// ─── Drill-down data per insight ────────────────────────────────────────────

export interface SantanderDrillDown {
  insightId: string
  heroStat: { value: string; label: string }
  context: string
  challenge: string
  foursysApproach: string[]
  expectedImpact: string[]
  relevantKpis: { value: string; label: string }[]
}

export const santanderDrillDowns: SantanderDrillDown[] = [
  {
    insightId: 'think-value',
    heroStat: { value: 'R$ 1,256T', label: 'em Ativos para Modernizar' },
    context:
      'A estratégia "One Santander" posiciona Think Value como pilar de eficiência: modernizar sistemas legados e automatizar operações em escala para 49.661 colaboradores e 1.685 pontos de atendimento. Cada ponto percentual de eficiência operacional representa centenas de milhões em resultado.',
    challenge:
      'Sistemas core em tecnologias legadas geram risco operacional e bloqueiam a velocidade de inovação. A necessidade de manter operação 24/7 enquanto moderniza exige uma abordagem de zero downtime.',
    foursysApproach: [
      'Modernização progressiva com SDD — sem big-bang rewrite, continuidade operacional garantida',
      'Hiperautomação com Agentes IA para processos repetitivos e de alto volume',
      'DevOps e CI/CD para esteiras de entrega contínua com qualidade',
      '17+ anos de experiência no ecossistema Santander — conhecimento profundo do legado',
    ],
    expectedImpact: [
      'Redução de 30-40% no custo de manutenção de sistemas legados',
      'Aumento de 3x na velocidade de release de novos produtos',
      'Eliminação de processos manuais que custam > R$ 50M/ano',
    ],
    relevantKpis: [
      { value: '49.661', label: 'Colaboradores impactados' },
      { value: '1.685', label: 'Lojas e pontos de atendimento' },
      { value: '17+', label: 'Anos de parceria Foursys' },
    ],
  },
  {
    insightId: 'think-customer',
    heroStat: { value: '73,9M', label: 'Clientes para Hiperpersonalizar' },
    context:
      'O Santander busca experiências hiperpersonalizadas para 73,9 milhões de clientes, com jornada fluida do app ao caixa da agência. O banco serve desde o segmento Private Banking (> R$ 10M em investimentos) até PMEs com faturamento até R$ 3 milhões — cada perfil exige uma experiência diferente.',
    challenge:
      'Dados de clientes fragmentados em silos. Canais digitais e físicos desconectados. Necessidade de antecipar necessidades e oferecer produtos mais simples e direcionados para cada segmento.',
    foursysApproach: [
      'Data Platform com ingestão multi-fonte para visão 360° do cliente',
      'Modelos de IA preditiva para next-best-action e antecipação de necessidades',
      'Squads dedicados a canais digitais de alto tráfego com expertise omnichannel',
      'UX research e design systems para experiências consistentes entre canais',
    ],
    expectedImpact: [
      'Aumento de 15-20% em conversão de ofertas direcionadas',
      'Redução de 40% no churn por desalinhamento de oferta',
      'NPS acima de 55 pontos no segmento Empresas (atual: 49)',
    ],
    relevantKpis: [
      { value: '73,9M', label: 'Clientes totais' },
      { value: '49', label: 'NPS Empresas (4T25)' },
      { value: '7', label: 'Segmentos de cliente' },
    ],
  },
  {
    insightId: 'genai',
    heroStat: { value: 'GenAI', label: 'Prioridade do Comitê de Inovação' },
    context:
      'O Santander declarou ser "referência na utilização de GenAI" como vantagem competitiva. O Comitê de Tecnologia e Inovação do Conselho de Administração supervisiona diretamente esta agenda. O banco global investiu em plataformas de IA que podem ser alavancadas localmente.',
    challenge:
      'Transformar pilotos de GenAI em soluções de produção com governança, segurança e compliance. Garantir ROI mensurável em cada caso de uso enquanto mantém controle sobre dados sensíveis de 73,9 milhões de clientes.',
    foursysApproach: [
      'Método IA First: do piloto à produção em 6 semanas, com 85% de conversão',
      'Framework Quality IA (já homologado pelo Santander) como prova de capacidade',
      'Agentes IA supervisionados com governança e auditabilidade completa',
      'Expertise em LLMs aplicados a processos financeiros com compliance BACEN',
    ],
    expectedImpact: [
      '85% dos pilotos de IA convertidos em produção (vs média de mercado de 25%)',
      'Redução de 60% no custo de operação de processos automatizados por IA',
      'Framework de governança de IA replicável para o grupo global',
    ],
    relevantKpis: [
      { value: '85%', label: 'Conversão piloto → produção' },
      { value: '6 sem', label: 'Tempo médio de piloto' },
      { value: '100%', label: 'Quality IA homologado' },
    ],
  },
  {
    insightId: 'risco-credito',
    heroStat: { value: 'R$ 708B', label: 'Carteira para Proteger' },
    context:
      'Com R$ 708 bilhões em carteira de crédito ampliada, NPL Over 90 em 4,0% e custo de crédito de 3,76%, a gestão de risco é pilar estratégico. O banco concentra 18% da carteira nos 100 maiores tomadores, exigindo modelos sofisticados de análise.',
    challenge:
      'Necessidade de modelos preditivos mais sofisticados para antecipação de inadimplência. NPL formation em 1,17% exige monitoramento em tempo real. Compliance com Basileia III e regulações BACEN em constante evolução.',
    foursysApproach: [
      'Modelos de ML para scoring e detecção de fraude em tempo real (< 200ms)',
      'Analytics preditivo para antecipação de inadimplência com dados alternativos',
      'Integração com plataformas de risco para compliance BACEN e Basileia III',
      'Dashboards executivos de risco de crédito com drill-down por segmento',
    ],
    expectedImpact: [
      'Redução de 0,2 p.p. no custo de crédito — economia de > R$ 1,4B/ano',
      'Detecção antecipada de 30% mais casos de inadimplência',
      'Compliance regulatório automatizado com redução de 50% em audit findings',
    ],
    relevantKpis: [
      { value: '4,0%', label: 'NPL Over 90' },
      { value: '3,76%', label: 'Custo de Crédito' },
      { value: '15,4%', label: 'Índice de Basileia' },
    ],
  },
  {
    insightId: 'pme-crescimento',
    heroStat: { value: '+23%', label: 'Crescimento PMEs YoY' },
    context:
      'Pequenas e Médias Empresas são o segmento de maior crescimento: +23% YoY na carteira de crédito, atingindo R$ 94,8 bilhões. A ambição declarada é "ser o banco de escolha das empresas", com NPS de 49 pontos já alcançado e múltiplos prêmios em 2025.',
    challenge:
      'Escalar soluções digitais para milhões de PMEs com diferentes perfis (E1, E2, E3 e Empresas Digital). Oferecer originação de crédito rápida e integrada com ecossistema de parceiros via Open Banking.',
    foursysApproach: [
      'Plataformas digitais de originação de crédito com esteiras automatizadas de análise',
      'APIs de Open Banking para integração com ecossistema de parceiros',
      'Squads especializados em jornadas digitais para segmentos E1, E2, E3',
      'CRM integrado com analytics de propensão para cross-sell/up-sell',
    ],
    expectedImpact: [
      'Redução de 70% no tempo de aprovação de crédito para PMEs',
      'Aumento de 25% na base ativa de PMEs no canal digital',
      'Crescimento sustentado de 20%+ na carteira PME por 3 anos',
    ],
    relevantKpis: [
      { value: 'R$ 94,8B', label: 'Carteira PMEs' },
      { value: '+23%', label: 'Crescimento YoY' },
      { value: '49', label: 'NPS Empresas' },
    ],
  },
  {
    insightId: 'think-global',
    heroStat: { value: '€ 14,1B', label: 'Lucro Global Santander' },
    context:
      'O Santander Brasil é posicionado como "centro de inovação para exportar modelos digitais" ao grupo global, que opera em 10+ países com €1 trilhão em ativos e 180 milhões de clientes. O ROAE de 17,6% do Brasil supera a média global, confirmando a relevância estratégica.',
    challenge:
      'Desenvolver soluções que atendam padrões globais para serem exportadas. Integrar com plataformas globais mantendo conformidade com regulamentação local. Comunicação bilíngue e adaptação de processos.',
    foursysApproach: [
      'Desenvolvimento de soluções aderentes a padrões globais do grupo Santander',
      'Squads bilíngues (PT/EN) com experiência em integração multi-país',
      '17+ anos de conhecimento acumulado do ecossistema Santander Brasil',
      'Arquiteturas cloud-native e APIs globais reutilizáveis',
    ],
    expectedImpact: [
      'Soluções brasileiras exportadas para 3+ países do grupo em 12 meses',
      'Redução de 40% no time-to-market de adaptação de plataformas globais',
      'Brasil reconhecido como top-3 hub de inovação do grupo global',
    ],
    relevantKpis: [
      { value: '17,6%', label: 'ROAE Brasil' },
      { value: '180M', label: 'Clientes Grupo Global' },
      { value: '€ 148B', label: 'Market Cap Global' },
    ],
  },
  {
    insightId: 'funding-captacao',
    heroStat: { value: 'R$ 670B', label: 'em Captação de Clientes' },
    context:
      'O Santander diversifica captações com foco em pessoa física (55% do mix, +5 p.p. vs 2023). A construção da "melhor plataforma de investimentos do mercado" é meta declarada — com foco em relacionamento humano, escala e excelência digital.',
    challenge:
      'Criar plataformas de investimentos que combinem a sofisticação digital dos neo-banks com o atendimento humano premium do Private Banking. Escalar a experiência Select para conquistar market share no segmento de alta renda.',
    foursysApproach: [
      'Plataformas digitais de investimentos com UX premium e performance',
      'Dashboards de portfólio em tempo real com analytics de mercado',
      'CRM integrado com analytics de recomendação para assessores',
      'Mobile-first com experiência fluida e segura para transações',
    ],
    expectedImpact: [
      'Aumento de 20% na captação líquida de investimentos via digital',
      'Redução de 50% no tempo de setup de novos produtos de investimento',
      'NPS digital 15+ pontos acima do benchmark de mercado',
    ],
    relevantKpis: [
      { value: 'R$ 670B', label: 'Captação Total' },
      { value: '55%', label: 'Mix Pessoa Física' },
      { value: '+3,5%', label: 'Comissões YoY' },
    ],
  },
  {
    insightId: 'sustentabilidade',
    heroStat: { value: 'R$ 50,7B', label: 'Carteira Sustentável' },
    context:
      'O Santander atingiu nota "A" no CDP (Carbon Disclosure Project), lidera CBIOs com 41% de market share, e tem ESG como métrica de avaliação de executivos. O Prospera Santander Microfinanças alcançou R$ 3,5B em carteira com 1,2 milhão de clientes ativos.',
    challenge:
      'Automatizar reporting ESG para reguladores e investidores. Integrar classificação SFICS (Sistema de Finanças Sustentáveis) em processos de crédito. Escalar microfinanças com tecnologia.',
    foursysApproach: [
      'Plataformas de monitoramento e reporting ESG automatizado',
      'Dashboards de KPIs de sustentabilidade para C-Level e investidores',
      'Integração com framework SFICS do grupo Santander',
      'Sistemas de originação digital para microfinanças com scoring inclusivo',
    ],
    expectedImpact: [
      'Redução de 80% no tempo de geração de relatórios ESG',
      'Crescimento de 30% na carteira de microfinanças via canal digital',
      'Manutenção da nota "A" no CDP com compliance automatizado',
    ],
    relevantKpis: [
      { value: 'R$ 50,7B', label: 'Carteira Sustentável' },
      { value: '41%', label: 'Market Share CBIOs' },
      { value: 'A', label: 'Nota CDP' },
    ],
  },
]

export const santanderClient: ClientConfig = {
  id: 'santander',
  name: 'Santander',
  colors: { primary: '#CC0000', accent: '#FF3333' },
  tagline: 'Construindo o futuro digital juntos há mais de 17 anos',
  relationship: 'Parceiro estratégico de tecnologia — 17+ anos de entrega contínua',
  yearsPartnership: 17,
  sections: [
    {
      id: 'client-opening',
      label: 'Foursys × Santander',
      description: 'Parceria estratégica de longa data',
      icon: 'handshake',
      component: 'client-opening',
    },
    {
      id: 'client-insights',
      label: 'Percepções Santander',
      description: 'O que identificamos nos projetos do Santander',
      icon: 'search',
      component: 'client-insights',
    },
    {
      id: 'client-extra-1',
      label: 'Framework Quality IA',
      description: 'Plugin homologado pelo Santander',
      icon: 'zap',
      component: 'client-extra-1',
    },
    {
      id: 'client-cases',
      label: 'Cases no Santander',
      description: 'Entregas dentro do ecossistema Santander',
      icon: 'building',
      component: 'client-cases',
    },
  ],
  insights: [
    {
      id: 'think-value',
      title: 'Think Value — Modernização e Automação em Escala',
      description:
        'O Santander declarou como pilar estratégico "impulsionar eficiência e produtividade com modernização e automação em escala". Com R$ 1,256 trilhão em ativos e 49.661 colaboradores, cada ponto de eficiência representa milhões em resultado.',
      solution:
        'Modernização progressiva com SDD (sem big-bang rewrite) + Hiperautomação com Agentes IA. Já entregamos 17+ anos de modernização contínua no ecossistema Santander, com zero downtime em migrações.',
      icon: '⚡',
    },
    {
      id: 'think-customer',
      title: 'Think Customer — Hiperpersonalização com Dados e IA',
      description:
        'O banco busca "experiências hiperpersonalizadas guiadas por dados e antecipação de necessidades" para 73,9 milhões de clientes. A jornada deve ser "fluida e integrada entre os canais" — de lojas físicas ao app.',
      solution:
        'Data Platform com ingestão multi-fonte para visão 360° do cliente + modelos de IA preditiva para next-best-action. Squads dedicados ao desenvolvimento de canais digitais de alto tráfego com expertise em omnichannel.',
      icon: '🎯',
    },
    {
      id: 'genai',
      title: 'GenAI como Vantagem Competitiva',
      description:
        'O Santander posiciona ser "referência na utilização de GenAI, trazendo vantagem competitiva e melhor experiência para o cliente". IA generativa é prioridade estratégica do Comitê de Tecnologia e Inovação do Conselho.',
      solution:
        'Método IA First: piloto a produção em 6 semanas, com 85% de conversão. Framework Quality IA (já homologado pelo Santander) demonstra nossa capacidade de entregar IA aplicada no ecossistema do banco.',
      icon: '🧠',
    },
    {
      id: 'risco-credito',
      title: 'Gestão de Risco e Qualidade de Crédito',
      description:
        'Com carteira de R$ 708B e NPL Over 90 em 4,0%, o Santander aprimora continuamente a gestão de riscos e capital. O custo de crédito (3,76%) e NPL formation exigem modelos cada vez mais sofisticados de predição.',
      solution:
        'Modelos de ML para scoring e detecção de fraude em tempo real (< 200ms). Analytics preditivo para antecipação de inadimplência. Integração com plataformas de risco para compliance BACEN e Basileia III.',
      icon: '📊',
    },
    {
      id: 'pme-crescimento',
      title: 'PMEs — Segmento de Maior Crescimento (+23%)',
      description:
        'Pequenas e Médias Empresas cresceram 23% YoY na carteira de crédito, sendo a ambição do Santander "ser o banco de escolha das empresas". Este segmento exige soluções digitais ágeis e escaláveis.',
      solution:
        'Plataformas digitais de originação de crédito para PMEs com esteiras automatizadas. APIs de Open Banking para integração com ecossistema de parceiros. Squads especializados em produtos para empresas.',
      icon: '🚀',
    },
    {
      id: 'think-global',
      title: 'Think Global — Brasil como Hub de Inovação',
      description:
        'O Santander Brasil é posicionado como "centro de inovação para exportar modelos digitais" para o grupo global, alavancando plataformas globais para acelerar inovações e reduzir custos. ROAE de 17,6% comprova a relevância.',
      solution:
        'Suporte para desenvolvimento de soluções exportáveis ao grupo global. Squads bilíngues (PT/EN) com experiência em integração com plataformas Santander Global. 17+ anos de conhecimento acumulado do ecossistema.',
      icon: '🌎',
    },
    {
      id: 'funding-captacao',
      title: 'Otimização de Funding e Plataforma de Investimentos',
      description:
        'Diversificação das captações com foco em pessoa física (PF passou de 50% para 55% do mix). Construção da "melhor plataforma de investimentos do mercado, pautada no relacionamento humano com escala e excelência digital".',
      solution:
        'Desenvolvimento de plataformas digitais de investimentos com UX premium. Dashboards de acompanhamento de portfólio em tempo real. Integração de sistemas de CRM para assessores com analytics de recomendação.',
      icon: '💰',
    },
    {
      id: 'sustentabilidade',
      title: 'ESG e Finanças Sustentáveis — R$ 50,7B em Carteira',
      description:
        'O Santander atingiu R$ 50,7 bilhões em carteira sustentável e nota "A" no CDP. Líder em CBIOs com 41% de market share. ESG é métrica de avaliação dos executivos do Conselho de Administração.',
      solution:
        'Plataformas de monitoramento e reporting ESG automatizado. Dashboards de KPIs de sustentabilidade para compliance e comunicação ao mercado. Integração com frameworks SFICS do grupo Santander.',
      icon: '🌱',
    },
  ],
  cases: [
    {
      id: 'shi-portal',
      title: 'Portal Imobiliário SHI',
      sector: 'Financeiro / Imobiliário',
      type: 'Produto Digital',
      challenge:
        'O Santander precisava de um portal centralizado para gestão do portfólio imobiliário do SHI, integrando dados de múltiplas fontes legadas e oferecendo dashboards executivos em tempo real.',
      solution:
        'Desenvolvimento de portal web com React, APIs REST em Java Spring Boot, integração com sistemas legados via camada de API Gateway e dashboards interativos com D3.js.',
      stack: ['React', 'Java Spring Boot', 'AWS', 'API Gateway', 'PostgreSQL', 'D3.js'],
      results: [
        'Tempo de consulta de portfólio reduzido de 3 dias para 10 minutos',
        'Visibilidade em tempo real de 100% dos imóveis do portfólio',
        'Eliminação de 15 relatórios manuais em Excel',
        'Adoção imediata por 200+ gestores do banco',
      ],
      metric: { value: '99%', label: 'Redução no tempo de consulta' },
    },
    {
      id: 'quality-ia-impl',
      title: 'Framework Quality IA',
      sector: 'Financeiro',
      type: 'Framework / Produto',
      challenge:
        'O time de QA do Santander realizava testes majoritariamente manuais, gerando ciclos de release de 6 semanas e alta taxa de defeitos em produção.',
      solution:
        'Desenvolvimento do Framework Quality IA: plugin de automação inteligente de testes que usa IA para geração automática de casos de teste, identificação de riscos e análise de impacto.',
      stack: ['Python', 'LLMs', 'Selenium', 'Jenkins', 'SonarQube', 'Jira Integration'],
      results: [
        'Ciclo de release reduzido de 6 semanas para 2 semanas',
        '78% de aumento na cobertura de testes automatizados',
        'Redução de 60% nos defeitos em produção',
        'Framework homologado pelo Santander para uso corporativo',
      ],
      metric: { value: '3x', label: 'Mais velocidade de release' },
    },
  ],
  extra1: {
    title: 'Framework Quality IA',
    subtitle: 'Plugin de automação inteligente de testes — homologado pelo Santander',
    content: {
      phases: [
        {
          id: 'analise',
          title: 'Análise Inteligente',
          description: 'IA analisa o código e identifica automaticamente os pontos de maior risco e impacto para priorização de testes.',
          icon: 'search',
        },
        {
          id: 'geracao',
          title: 'Geração de Casos',
          description: 'LLMs geram automaticamente casos de teste baseados nas mudanças do código, histórico de bugs e regras de negócio.',
          icon: 'zap',
        },
        {
          id: 'execucao',
          title: 'Execução Paralela',
          description: 'Execução paralela de testes com orquestração inteligente — reduzindo tempo de ciclo de validação em até 70%.',
          icon: 'rocket',
        },
        {
          id: 'relatorio',
          title: 'Relatório Executivo',
          description: 'Dashboard em tempo real com score de qualidade, cobertura, risco e recomendações priorizadas por impacto.',
          icon: 'bar-chart',
        },
      ],
      metrics: [
        { value: '78%', label: 'Aumento de cobertura' },
        { value: '3x', label: 'Velocidade de release' },
        { value: '60%', label: 'Redução de defeitos' },
        { value: '100%', label: 'Homologado Santander' },
      ],
    },
  },
}
