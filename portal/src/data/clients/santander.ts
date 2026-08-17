import type { ClientConfig } from '../../types'
import type { Language } from '../../i18n/types'

// ─── Dados estratégicos do Santander Brasil ─────────────────────────────────

export interface SantanderStrategicContext {
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

const santanderStrategicContextEn: SantanderStrategicContext = {
  kpis: [
    { value: 'BRL 1.256T', label: 'Total Assets', delta: '' },
    { value: 'BRL 708B', label: 'Credit Portfolio', delta: '' },
    { value: 'BRL 670B', label: 'Client Funding', delta: '' },
    { value: 'BRL 4.1B', label: 'Net Income Q4 2025', delta: '' },
    { value: '17.6%', label: 'ROAE', delta: 'Stable vs Q3 2025' },
    { value: '73.9M', label: 'Total Clients', delta: '' },
    { value: '49,661', label: 'Employees', delta: '' },
    { value: '15.4%', label: 'Basel Index', delta: '+1.1 p.p. vs Q4 2024' },
  ],
  strategyPillars: [
    {
      id: 'think-value',
      title: 'Think Value',
      subtitle: 'Efficiency and Productivity',
      icon: '⚡',
      color: '#CC0000',
      points: [
        'Drive efficiency and productivity through modernization and automation at scale',
        'Continuous improvement of risk and capital management focused on profitability',
        'Funding mix optimization and revenue diversification',
      ],
    },
    {
      id: 'think-customer',
      title: 'Think Customer',
      subtitle: 'Experience and Personalization',
      icon: '🎯',
      color: '#FF3333',
      points: [
        'Hyper-personalized experiences driven by data and anticipation of needs',
        'Seamless and integrated customer journey across channels',
        'Simpler and more targeted product offerings',
      ],
    },
    {
      id: 'think-global',
      title: 'Think Global',
      subtitle: 'Innovation and Scalability',
      icon: '🌎',
      color: '#FF6644',
      points: [
        'Leverage global platforms to accelerate innovation and reduce costs',
        'Reference in GenAI adoption, delivering competitive advantage',
        'Brazil as an innovation hub to export digital models',
      ],
    },
  ],
  segmentation: [
    { segment: 'Private Banking', description: 'Investments above BRL 10 million' },
    { segment: 'Select', description: 'Income above BRL 7K or investments from BRL 100K' },
    { segment: 'Santander Retail', description: 'Monthly income below BRL 7K' },
    { segment: 'SCIB / Corporate', description: 'Revenue above BRL 200 million' },
    { segment: 'Companies E3', description: 'Revenue from BRL 30M to BRL 200M' },
    { segment: 'Companies E2', description: 'Revenue from BRL 3M to BRL 30M' },
    { segment: 'Companies E1 / SMEs', description: 'Revenue up to BRL 3 million' },
  ],
  creditMix: [
    { label: 'Retail', percentage: '38%' },
    { label: 'Large Corporates', percentage: '35%' },
    { label: 'SMEs', percentage: '13%' },
    { label: 'Consumer Finance', percentage: '13%' },
  ],
  highlights: [
    'Managerial net income of BRL 15.6 billion in 2025 (+12.6% YoY)',
    'SMEs with 23% credit portfolio growth — fastest-growing segment',
    'NPS of 49 points in the Business segment — ambition to be the bank of choice',
    'BRL 50.7 billion in sustainable portfolio — "A" CDP rating and CBIO leader (41%)',
    'Fees grew 3.5% YoY — insurance (+14.7%) and asset management (+25.3%) stood out',
    'CET1 at 11.6% and Basel Index at 15.4% — solid capitalization',
    'Cost of credit at 3.76% with NPL Over 90 at 4.0% — risk management as a priority',
    '92% of employees completed training — eNPS of 79 points',
  ],
}

export function getSantanderStrategicContext(lang: Language = 'pt'): SantanderStrategicContext {
  return lang === 'en' ? santanderStrategicContextEn : santanderStrategicContext
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

const santanderDrillDownsEn: SantanderDrillDown[] = [
  {
    insightId: 'think-value',
    heroStat: { value: 'BRL 1.256T', label: 'in Assets to Modernize' },
    context:
      'The "One Santander" strategy positions Think Value as the efficiency pillar: modernize legacy systems and automate operations at scale for 49,661 employees and 1,685 service points. Each percentage point of operational efficiency represents hundreds of millions in results.',
    challenge:
      'Core systems on legacy technologies generate operational risk and block innovation speed. The need to maintain 24/7 operations while modernizing requires a zero-downtime approach.',
    foursysApproach: [
      'Progressive modernization with SDD — no big-bang rewrite, guaranteed operational continuity',
      'Hyperautomation with AI Agents for repetitive, high-volume processes',
      'DevOps and CI/CD for continuous delivery pipelines with quality',
      '17+ years of experience in the Santander ecosystem — deep legacy knowledge',
    ],
    expectedImpact: [
      '30-40% reduction in legacy system maintenance costs',
      '3x increase in new product release velocity',
      'Elimination of manual processes costing > BRL 50M/year',
    ],
    relevantKpis: [
      { value: '49,661', label: 'Employees impacted' },
      { value: '1,685', label: 'Stores and service points' },
      { value: '17+', label: 'Years of Foursys partnership' },
    ],
  },
  {
    insightId: 'think-customer',
    heroStat: { value: '73.9M', label: 'Clients to Hyper-Personalize' },
    context:
      'Santander seeks hyper-personalized experiences for 73.9 million clients, with a seamless journey from app to branch teller. The bank serves from Private Banking (> BRL 10M in investments) to SMEs with revenue up to BRL 3 million — each profile requires a different experience.',
    challenge:
      'Customer data fragmented in silos. Digital and physical channels disconnected. Need to anticipate needs and offer simpler, more targeted products for each segment.',
    foursysApproach: [
      'Data Platform with multi-source ingestion for 360° customer view',
      'Predictive AI models for next-best-action and needs anticipation',
      'Squads dedicated to high-traffic digital channels with omnichannel expertise',
      'UX research and design systems for consistent cross-channel experiences',
    ],
    expectedImpact: [
      '15-20% increase in targeted offer conversion',
      '40% reduction in churn from offer misalignment',
      'NPS above 55 points in the Business segment (current: 49)',
    ],
    relevantKpis: [
      { value: '73.9M', label: 'Total clients' },
      { value: '49', label: 'Business NPS (Q4 2025)' },
      { value: '7', label: 'Customer segments' },
    ],
  },
  {
    insightId: 'genai',
    heroStat: { value: 'GenAI', label: 'Innovation Committee Priority' },
    context:
      'Santander declared being a "reference in GenAI utilization" as a competitive advantage. The Board\'s Technology and Innovation Committee directly oversees this agenda. The global bank invested in AI platforms that can be leveraged locally.',
    challenge:
      'Transform GenAI pilots into production solutions with governance, security, and compliance. Ensure measurable ROI in each use case while maintaining control over sensitive data from 73.9 million clients.',
    foursysApproach: [
      'AI First method: pilot to production in 6 weeks, with 85% conversion',
      'Quality AI Framework (already approved by Santander) as proof of capability',
      'Supervised AI Agents with complete governance and auditability',
      'Expertise in LLMs applied to financial processes with BACEN compliance',
    ],
    expectedImpact: [
      '85% of AI pilots converted to production (vs 25% market average)',
      '60% reduction in operating costs for AI-automated processes',
      'AI governance framework replicable for the global group',
    ],
    relevantKpis: [
      { value: '85%', label: 'Pilot → production conversion' },
      { value: '6 wks', label: 'Average pilot time' },
      { value: '100%', label: 'Quality AI approved' },
    ],
  },
  {
    insightId: 'risco-credito',
    heroStat: { value: 'BRL 708B', label: 'Portfolio to Protect' },
    context:
      'With BRL 708 billion in expanded credit portfolio, NPL Over 90 at 4.0%, and cost of credit at 3.76%, risk management is a strategic pillar. The bank concentrates 18% of the portfolio in the top 100 borrowers, requiring sophisticated analysis models.',
    challenge:
      'Need for more sophisticated predictive models for delinquency anticipation. NPL formation at 1.17% requires real-time monitoring. Compliance with Basel III and constantly evolving BACEN regulations.',
    foursysApproach: [
      'ML models for real-time scoring and fraud detection (< 200ms)',
      'Predictive analytics for delinquency anticipation with alternative data',
      'Integration with risk platforms for BACEN and Basel III compliance',
      'Executive credit risk dashboards with segment-level drill-down',
    ],
    expectedImpact: [
      '0.2 p.p. reduction in cost of credit — savings of > BRL 1.4B/year',
      '30% more delinquency cases detected early',
      'Automated regulatory compliance with 50% reduction in audit findings',
    ],
    relevantKpis: [
      { value: '4.0%', label: 'NPL Over 90' },
      { value: '3.76%', label: 'Cost of Credit' },
      { value: '15.4%', label: 'Basel Index' },
    ],
  },
  {
    insightId: 'pme-crescimento',
    heroStat: { value: '+23%', label: 'SME Growth YoY' },
    context:
      'Small and Medium Enterprises are the fastest-growing segment: +23% YoY in credit portfolio, reaching BRL 94.8 billion. The declared ambition is to "be the bank of choice for companies," with an NPS of 49 points already achieved and multiple awards in 2025.',
    challenge:
      'Scale digital solutions for millions of SMEs with different profiles (E1, E2, E3, and Digital Companies). Offer fast credit origination integrated with the partner ecosystem via Open Banking.',
    foursysApproach: [
      'Digital credit origination platforms with automated analysis pipelines',
      'Open Banking APIs for partner ecosystem integration',
      'Squads specialized in digital journeys for E1, E2, E3 segments',
      'CRM integrated with propensity analytics for cross-sell/up-sell',
    ],
    expectedImpact: [
      '70% reduction in credit approval time for SMEs',
      '25% increase in active SME base on digital channel',
      'Sustained 20%+ SME portfolio growth for 3 years',
    ],
    relevantKpis: [
      { value: 'BRL 94.8B', label: 'SME Portfolio' },
      { value: '+23%', label: 'YoY Growth' },
      { value: '49', label: 'Business NPS' },
    ],
  },
  {
    insightId: 'think-global',
    heroStat: { value: '€ 14.1B', label: 'Santander Global Profit' },
    context:
      'Santander Brazil is positioned as an "innovation hub to export digital models" to the global group, which operates in 10+ countries with €1 trillion in assets and 180 million clients. Brazil\'s 17.6% ROAE surpasses the global average, confirming its strategic relevance.',
    challenge:
      'Develop solutions that meet global standards for export. Integrate with global platforms while maintaining compliance with local regulations. Bilingual communication and process adaptation.',
    foursysApproach: [
      'Development of solutions adhering to Santander group global standards',
      'Bilingual squads (PT/EN) with multi-country integration experience',
      '17+ years of accumulated knowledge in the Santander Brazil ecosystem',
      'Cloud-native architectures and reusable global APIs',
    ],
    expectedImpact: [
      'Brazilian solutions exported to 3+ group countries within 12 months',
      '40% reduction in time-to-market for global platform adaptation',
      'Brazil recognized as a top-3 innovation hub within the global group',
    ],
    relevantKpis: [
      { value: '17.6%', label: 'Brazil ROAE' },
      { value: '180M', label: 'Global Group Clients' },
      { value: '€ 148B', label: 'Global Market Cap' },
    ],
  },
  {
    insightId: 'funding-captacao',
    heroStat: { value: 'BRL 670B', label: 'in Client Funding' },
    context:
      'Santander diversifies funding with a focus on retail (55% of mix, +5 p.p. vs 2023). Building the "best investment platform in the market" is a declared goal — focused on human relationships, scale, and digital excellence.',
    challenge:
      'Create investment platforms that combine the digital sophistication of neo-banks with the premium human service of Private Banking. Scale the Select experience to capture market share in the high-income segment.',
    foursysApproach: [
      'Digital investment platforms with premium UX and performance',
      'Real-time portfolio dashboards with market analytics',
      'CRM integrated with recommendation analytics for advisors',
      'Mobile-first with seamless and secure transaction experience',
    ],
    expectedImpact: [
      '20% increase in net investment funding via digital',
      '50% reduction in setup time for new investment products',
      'Digital NPS 15+ points above market benchmark',
    ],
    relevantKpis: [
      { value: 'BRL 670B', label: 'Total Funding' },
      { value: '55%', label: 'Retail Mix' },
      { value: '+3.5%', label: 'Fees YoY' },
    ],
  },
  {
    insightId: 'sustentabilidade',
    heroStat: { value: 'BRL 50.7B', label: 'Sustainable Portfolio' },
    context:
      'Santander achieved an "A" rating on CDP (Carbon Disclosure Project), leads CBIOs with 41% market share, and has ESG as an executive evaluation metric. Prospera Santander Microfinance reached BRL 3.5B in portfolio with 1.2 million active clients.',
    challenge:
      'Automate ESG reporting for regulators and investors. Integrate SFICS (Sustainable Finance System) classification into credit processes. Scale microfinance with technology.',
    foursysApproach: [
      'Automated ESG monitoring and reporting platforms',
      'Sustainability KPI dashboards for C-Level and investors',
      'Integration with Santander group SFICS framework',
      'Digital origination systems for microfinance with inclusive scoring',
    ],
    expectedImpact: [
      '80% reduction in ESG report generation time',
      '30% growth in microfinance portfolio via digital channel',
      'Maintained "A" CDP rating with automated compliance',
    ],
    relevantKpis: [
      { value: 'BRL 50.7B', label: 'Sustainable Portfolio' },
      { value: '41%', label: 'CBIO Market Share' },
      { value: 'A', label: 'CDP Rating' },
    ],
  },
]

export function getSantanderDrillDowns(lang: Language = 'pt'): SantanderDrillDown[] {
  return lang === 'en' ? santanderDrillDownsEn : santanderDrillDowns
}

// ─── Client Config ──────────────────────────────────────────────────────────

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
  partnership: {
    contractSince: '2009',
    contractLabel: 'CONTRATO ATIVO DESDE',
    contractDescription: 'Atuação ininterrupta da Foursys junto ao Santander.',
    bigNumbers: [
      { value: '69', label: 'Quantidade de profissionais envolvidos' },
      { value: '78.624', label: 'Horas de serviços' },
      { value: '110', label: 'Atuação em projetos em 2020' },
      { value: '1,58%', label: 'Turnover médio mensal' },
    ],
    actionAreasTitle: 'Atuação nas seguintes áreas',
    actionAreas: [
      'CASH MANAGEMENT',
      'AGRONEGÓCIO',
      'MEIOS DE PAGAMENTOS',
      'PAGAMENTOS E ARRECADAÇÕES',
      'RECEBÍVEIS',
      'CONSÓRCIO',
      'EMPRÉSTIMOS',
      'PLATAFORMA DE INVESTIMENTOS / COMEX',
      'ADQUIRÊNCIA',
      'BNDES',
      'RISCO PJ / PF',
      'FINANCEIRA',
      'COBRANÇA E DDA',
      'CARTÕES',
      'INFRAESTRUTURA MAINFRAME',
      'ANTIFRAUDES',
      'CORE BANKING',
      'CANAIS',
    ],
    alliancesTitle: 'Alianças Estratégicas',
    alliances: ['aws', 'databricks', 'salesforce', 'pega'],
  },
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
    {
      id: 'qa-consorcio-automacao',
      title: 'Certificação e Automação de Qualidade em Consórcio',
      sector: 'Financeiro / Consórcio (F1RST)',
      type: 'Software Escopo Fechado',
      challenge:
        'O sistema de consórcio da F1RST precisava de maior cobertura e profundidade na qualidade de software para garantir continuidade operacional, preservar funcionalidades existentes e avançar em automação com IA para ampliar escala, confiabilidade e velocidade nas entregas. O processo demandava estabilização de massas de testes, governança e Centro de Excelência (CoE) integrado ao CI/CD.',
      solution:
        'Implementação de processo de certificação com automação de 200 scripts de testes back-end no fluxo crítico, geração e descaracterização de massa de dados conforme LGPD, agentes inteligentes para automação de APIs com RestAssured e BDD/Gherkin. Modelo CoE + CsC (Centro de Serviços Compartilhados) para padronização, governança, dashboards e capacitação contínua.',
      stack: ['BDD/Gherkin', 'RestAssured', 'Cucumber', 'Selenium', 'Appium', 'Jenkins', 'Azure DevOps', 'SonarQube', 'OWASP ZAP', 'Agentes IA'],
      results: [
        '200 scripts automatizados no fluxo crítico do consórcio',
        '8 a 10x redução no tempo de testes regressivos',
        '~65% redução total no tempo de execução dos testes',
        '80% queda em falhas críticas em produção (Studio de Qualidade)',
        '30 a 40% queda em defeitos críticos pós-deploy',
        '50% redução no tempo de preparação de dados (compliance LGPD)',
        '3x aumento na cobertura de cenários por ciclo',
      ],
      metric: { value: '65%', label: 'Redução no tempo de execução de testes' },
    },
    {
      id: 'qa-aumentado-ia',
      title: 'QA Aumentado com IA — Célula Especializada',
      sector: 'Financeiro / Empréstimo e Financiamento',
      type: 'Célula Especializada',
      challenge:
        'O Santander enfrentava limitações na esteira de QA com esforço manual elevado na documentação, riscos de conformidade pelo uso de dados produtivos em testes e modelo tradicional insuficiente para escalar a complexidade e volume de testes exigidos pela área de empréstimo e financiamento.',
      solution:
        'Célula de Engenharia de Eficiência com agentes de IA para geração automática de cenários Gherkin (passou de 5 para ~50 por jornada), provisionamento de massa sintética realista (CPF/CNPJ/CEP válidos sem uso de dados reais), automação de scripts em Java/Maven e dashboards de indicadores. POC comparou framework IA × processo tradicional, confirmando ganhos relevantes.',
      stack: ['Agentes IA', 'BDD/Gherkin', 'Java', 'Maven', 'Framework Foursys', 'Kanban', 'Massa Sintética'],
      results: [
        '+80% qualidade de software assegurada',
        '≥50% redução no tempo de automação de testes',
        '≥80% cenários Gherkin executáveis sem ajustes (framework IA)',
        '+200% aumento na cobertura funcional de testes',
        '70% cobertura de testes com massa sintética',
        '10x aumento de visibilidade sobre riscos de qualidade',
        '6x redução no tempo de criação de testes automatizados',
      ],
      metric: { value: '6x', label: 'Mais rápido na criação de testes' },
    },
    {
      id: 'gestao-alocacao-agile',
      title: 'Gestão Estratégica de Alocação Ágil',
      sector: 'Tecnologia / Squads e Alocação',
      type: 'Alocação Estratégica',
      challenge:
        'O Santander necessitava manter baixa rotatividade e alta capacitação em equipes alocadas, com mobilização ágil para múltiplos países e demandas, gestão proativa contra ociosidade, governança de fornecedores e administração rigorosa do ciclo de vida dos colaboradores em modelo Agile/Scrum.',
      solution:
        'Serviço completo de alocação com gestão integral: mobilização ágil, acompanhamento personalizado, PDI (Plano de Desenvolvimento Individual), People Care, mentoria, comunidades de prática, programa de inclusão e administração do ciclo de vida via plataforma Fourmakers. Estrutura dedicada de atendimento com gerentes exclusivos por cliente.',
      stack: ['Fourmakers', 'PDI', 'People Care', 'Agile/Scrum', 'Mentoring', 'Communities of Practice', 'Analytics de Sentimentos'],
      results: [
        '4,26% turnover médio anual sustentável',
        '700+ profissionais gerenciados',
        'Atendimento em 6 países',
        '15% redução no tempo médio de mobilização',
        '20% queda na rotatividade em times críticos',
        '12% ganho de produtividade em times de tecnologia',
      ],
      metric: { value: '4,26%', label: 'Turnover anual sustentável' },
    },
    {
      id: 'cnpj-alfanumerico-cobol',
      title: 'Adequação do Legado COBOL ao CNPJ Alfanumérico',
      sector: 'Financeiro / Regulatório (F1RST)',
      type: 'Software Escopo Fechado',
      challenge:
        'Adequar todos os programas e sistemas da F1RST à normativa da Receita Federal (Nota Técnica 49/2024) para tratamento do CNPJ alfanumérico, com ajustes em código COBOL, estruturas DB2 e consultas, preservando integridade e performance do legado. Prazo restrito de 8 meses para desenvolvimento em 3 ondas + 3 meses de homologação integrada + 1 mês de implantação + 3 meses pós-implantação.',
      solution:
        'Engenharia de software com IA para análise de impacto, desenvolvimento iterativo (Dual-Track + Kanban), automação de testes regressivos, integração DevOps com CI/CD. Cobertura das versões COBOL Gravity (FTB, FTG, FTF) com testes BDD em Gherkin e governança em ciclos semanais, mensais e trimestrais.',
      stack: ['COBOL', 'Copybooks', 'DB2', 'IA Foursys', 'Automação de Testes', 'BDD/Gherkin', 'DevOps', 'CI/CD'],
      results: [
        '1.915 programas COBOL impactados e adequados',
        '144 programas online alterados e recompilados',
        '1.656 documentações funcionais (cenários Gherkin) geradas',
        '~25% ganho de produtividade no desenvolvimento',
        '~30% redução em defeitos pós-implantação',
        'Compliance integral com Nota Técnica 49/2024',
        '15 domínios corporativos padronizados',
      ],
      metric: { value: '1.915', label: 'Componentes COBOL ajustados' },
    },
    {
      id: 'fidc-backend-qa',
      title: 'Alocação Estratégica FIDC — Backend e QA',
      sector: 'Financeiro / FIDC e Crédito',
      type: 'Alocação Especializada',
      challenge:
        'O FIDC do Santander demandava profissionais qualificados para desenvolvimento backend e garantia de qualidade, com mobilização ágil em até 15 dias úteis para aumento e 20 dias úteis para redução, gestão rigorosa de horas produtivas, baixo turnover e adaptação flexível ao tamanho da equipe conforme demandas de mercado e regulatórias.',
      solution:
        'Alocação de 6 profissionais (2 Dev Backend Avançado, 2 Dev Backend Intermediário, 2 QA Engineer) em modelo híbrido Anywhere Office, metodologia ágil com sprints e indicadores, arquitetura de microserviços, APIs RESTful, integração contínua e automação de testes. People Care e gestão Fourmakers para reter talentos críticos do FIDC.',
      stack: ['APIs RESTful', 'Microserviços', 'Cloud / PaaS', 'Selenium', 'Appium', 'JUnit', 'TestNG', 'CI/CD'],
      results: [
        '25% redução do lead time de entrega de features',
        '30% queda na taxa de defeitos em produção',
        '20% redução do ramp-up de profissionais',
        '336 horas mensais por profissional alocado',
        '4,26% turnover alinhado ao programa global',
        'Escalabilidade da plataforma FIDC sem perda de performance',
      ],
      metric: { value: '25%', label: 'Redução do lead time de entrega' },
    },
    {
      id: 'sites-aem-santander',
      title: 'Três Sites Institucionais com Adobe AEM',
      sector: 'Marketing / Comunicação Corporativa',
      type: 'Software Escopo Fechado',
      challenge:
        'O Grupo Santander precisava modernizar sua presença digital institucional com sites robustos, multilíngues, otimizados para SEO, com acessibilidade WCAG e gestão de conteúdo descentralizada, mantendo padrões rígidos de governança, segurança e monitoramento — tudo em prazo de 5 meses com SLAs de validação definidos.',
      solution:
        'Desenvolvimento de 3 sites institucionais em Adobe Experience Manager (AEM), com design responsivo, suporte multilíngue, SEO técnico, acessibilidade WCAG, integração com Creative Cloud e monitoramento Dynatrace. Metodologia ITIL + PMP + Scrum + SAFE e treinamento de 15 profissionais ADM para autonomia em manutenção.',
      stack: ['Adobe AEM', 'Java', 'JavaScript', 'HTML', 'CSS', 'Dynatrace', 'Creative Cloud', 'SEO Tools', 'Hot Map Analytics'],
      results: [
        '3 sites institucionais entregues em 5 meses',
        '100 dobras consideradas (40 novas + 60 reaproveitadas)',
        '30% queda no tempo médio de carregamento das páginas',
        '15% aumento na conversão de formulários',
        '20% redução no tempo de publicação de conteúdos',
        '15 profissionais ADM capacitados em AEM para autonomia',
      ],
      metric: { value: '3', label: 'Sites institucionais com AEM' },
    },
    {
      id: 'gravity-24x7-mainframe',
      title: 'Squad Gravity 24x7 — Mainframe Bilíngue',
      sector: 'Serviços Financeiros / Espanha',
      type: 'Squad Gerenciada',
      challenge:
        'O projeto Gravity demandava cobertura operacional 24x7 alinhada ao fuso horário da Espanha (GMT+1), com escalabilidade, custo-eficiência, comunicação bilíngue PT/ES, governança clara e alta performance em sustentação de aplicações core em Mainframe. Necessidade de retenção de conhecimento crítico em ambiente complexo.',
      solution:
        'Squad remota de 10 profissionais sênior/pleno + 1 Tech Lead híbrido presencial 3x/semana, organizada em escalas 8x1 ou 12x36 alinhadas a GMT+1. Equipe bilíngue (Português/Espanhol) com governança Foursys, backlog priorizado pelo cliente e shadowing para retenção de conhecimento da operação Gravity.',
      stack: ['Mainframe', 'TSO', 'CICS', 'DB2', 'VPN', 'Squad Gerenciada Bilíngue'],
      results: [
        'Cobertura 24x7 bilíngue PT/ES garantida',
        '10 profissionais remotos + 1 Tech Lead híbrido',
        '30% aumento na disponibilidade de aplicações Gravity',
        '20% redução no tempo médio de resolução de incidentes',
        '15% melhoria na produtividade da equipe de sustentação',
        'Comunicação integrada Brasil-Espanha com menos ruídos',
      ],
      metric: { value: '24x7', label: 'Cobertura operacional bilíngue' },
    },
    {
      id: 'modernizacao-cobol-net-cloud',
      title: 'Modernização COBOL → .NET Core e Cibersegurança',
      sector: 'Tecnologia / Transformação Digital',
      type: 'Software Escopo Fechado',
      challenge:
        'Migrar legado mainframe com cadeia batch de ~6 horas e alto custo de licenciamento para arquitetura moderna escalável em curto prazo, garantindo alta disponibilidade, capacitação de equipe, integração de times multinacionais e fortalecimento simultâneo da postura de cibersegurança para jornadas digitais críticas.',
      solution:
        'Modernização com IA para transpilação de código COBOL → .NET Core, transformação de monolito em microserviços, migração de DB2 para SQL Server, esteira DevOps com Jenkins + AWS CodePipeline, conteinerização em Docker, orquestração Kubernetes, monitoramento Grafana/Prometheus e camadas robustas de cibersegurança com gestão contínua de vulnerabilidades.',
      stack: ['COBOL', '.NET Core', 'Microserviços', 'Kubernetes', 'Docker', 'SQL Server', 'Jenkins', 'AWS CodePipeline', 'Grafana', 'Prometheus', 'IA Foursys'],
      results: [
        '450.000 linhas de código migradas',
        '2.400 métodos de APIs implementados',
        '14 milhões de requisições bloqueadas/mês em cibersegurança',
        '65% redução no tempo de provisionamento de ambientes',
        '50% redução no ciclo médio de entrega de releases',
        '40% queda em incidentes de alta severidade',
        '~4x aumento na capacidade transacional',
        '100% cobertura de testes',
      ],
      metric: { value: '65%', label: 'Redução em provisionamento de ambientes' },
    },
    {
      id: 'ae-cadastro-grupo-economico',
      title: 'AE — Identificador Cadastro Grupo Econômico',
      sector: 'Financeiro / Risco de Crédito',
      type: 'Software Escopo Fechado',
      challenge:
        'O ambiente do Santander demandava melhorias nas consultas e aprovações considerando tipo de pessoa (PF/PJ) para adequação de filtros e cálculo de risco, com tratamento diferenciado em processos batch (revolving, renovação de limites) e múltiplos canais — minimizando inconsistências entre sistemas, retrabalho em risco e exposição por grupo econômico.',
      solution:
        'Projeto fechado em modelo Anywhere Office para implementação do AE — Identificador Cadastro Grupo Econômico, com tratamentos específicos em filtros online (Risco Online PF/PJ) e processos batch (Revolving, Limite Inconsistente), integração de layouts compartilhados via repositório, entrega segmentada com validação mensal e alinhamento diário entre times.',
      stack: ['Plataforma Online', 'Batch Processing', 'APIs de Integração', 'Sistemas de Crédito e Risco', 'Ferramentas QA'],
      results: [
        '39 features em 6 meses (36 semanas)',
        '34 componentes online e batch tratados',
        'Até 25% redução em falhas de consulta e aprovação',
        '20% ganho de produtividade em análises de crédito',
        '15% redução de inconsistências de limite entre sistemas',
        '10% queda em retrabalho de risco de crédito',
      ],
      metric: { value: '25%', label: 'Redução em falhas de consulta/aprovação' },
    },
    {
      id: 'alocacao-multinacional',
      title: 'Alocação Multinacional — 700 Profissionais',
      sector: 'Tecnologia / Pessoas e Cultura',
      type: 'Alocação Estratégica',
      challenge:
        'Mobilizar e reter 700+ profissionais alocados em múltiplas frentes do Santander, com baixa rotatividade, capacitação contínua, prevenção de ociosidade, atualização constante de habilidades técnicas e alinhamento à cultura do cliente — em ambiente data-driven com fornecedores estratégicos (AWS, Google, Microsoft).',
      solution:
        'Gestão integral de alocados com Data Driven Design, parcerias AWS/Google/Microsoft, plataforma Fourmakers, programas PLUGandPLAY com Digibee/Axway, analytics de sentimentos, +10.000 horas anuais de treinamento, PDI estruturado, mentoria e monitoramento ativo contra ociosidade. Estrutura dedicada People & Culture.',
      stack: ['Fourmakers', 'Data Driven Design', 'AWS', 'Google Cloud', 'Microsoft', 'Digibee', 'Axway', 'PDI', 'Analytics de Sentimentos'],
      results: [
        '700 profissionais no programa',
        '400 profissionais capacitados em tecnologia',
        '+10.000 horas anuais em treinamento',
        '92% dos profissionais recomendam a Foursys (eNPS)',
        '4,26% turnover anual em tecnologia',
        'Operação em 6 países',
      ],
      metric: { value: '700+', label: 'Profissionais gerenciados' },
    },
    {
      id: 'imobiliario-portal-evolucao',
      title: 'Plataforma Santander Imóveis — Site, Portal e Sustentação',
      sector: 'Financeiro / Imobiliário',
      type: 'Squad Gerenciada + Escopo Aberto',
      challenge:
        'O Santander precisava modernizar o site Santander Imóveis e implementar portal administrativo, com infraestrutura segura na AWS, sustentação 24/7, integrações com Benner/leiloeiros/geolocalização e transição arquitetural de WordPress para Java + Angular para escalabilidade, segurança transacional e expansão omnicanal.',
      solution:
        'Fase 1: site e portal em WordPress + AWS Cloud com WAF, Sophos UTM, monitoria Dynatrace e sustentação 24/7 com SLAs. Fase 2: recodificação em Java + Angular, modelagem de dados dedicada, squad gerenciada, integração com Benner, automação Excel, chatbot e portal administrativo robusto com 10+ funcionalidades prioritárias e 300+ user stories.',
      stack: ['Java', 'Angular', 'WordPress', 'AWS', 'AWS WAF', 'Sophos UTM', 'Dynatrace', 'API Benner', 'Microserviços', 'Geolocalização'],
      results: [
        '~99,9% disponibilidade do site e portal',
        '40% queda em incidentes críticos recorrentes',
        '30% aumento na conversão de leads em propostas',
        '40% redução de esforço manual em cadastros e relatórios',
        '25% redução no tempo médio de atendimento digital',
        '+25% tráfego orgânico qualificado',
        '300+ user stories implementadas',
      ],
      metric: { value: '99,9%', label: 'Disponibilidade do site e portal' },
    },
    {
      id: 'investimentos-fundos-squad',
      title: 'Squad Fundos de Investimento — Sustentação e Regulatório',
      sector: 'Financeiro / Investimentos',
      type: 'Squad Gerenciada',
      challenge:
        'Sistemas legados Mainframe/COBOL com base de conhecimento fragilizada após desmobilização e aposentadoria de especialistas, integração de 34 sistemas (Sinquea + camada F1RST) em migração gradual 2-3 anos, sob forte pressão regulatória CVM/BACEN com prazos rígidos entre dezembro e janeiro para CDB, Letras e outros produtos de investimento.',
      solution:
        'Squad gerenciada híbrida (3x/semana presencial) com perfis Java + Mainframe, metodologia SAFe, gestão de backlog com cadências semanais/mensais/trimestrais. Plataforma Fourmakers para mitigação de turnover, trilhas de carreira, PDI, gestão de conhecimento crítico e atuação regulatória (MPs e exigências CVM/BACEN).',
      stack: ['Java Spring', 'Mainframe COBOL', 'Oracle', 'AWS', 'Big Data', 'SAFe', 'Fourmakers'],
      results: [
        '34 sistemas integrados atendidos',
        'Até 95% aderência a prazos regulatórios',
        'Até 30% redução em riscos operacionais',
        '30% diminuição no lead time de demandas regulatórias',
        '25% diminuição da rotatividade em perfis críticos',
        '20% queda em incidentes críticos em produção',
        '15% redução de não conformidade regulatória',
      ],
      metric: { value: '95%', label: 'Aderência a prazos regulatórios' },
    },
    {
      id: 'continuidade-pcn-zurich',
      title: 'Gestão de Continuidade de Negócios (PCN) — Santander e Zurich',
      sector: 'Financeiro e Seguros / Risco Operacional',
      type: 'Alocação Especializada',
      challenge:
        'O Santander demandava gestão estruturada do Plano de Continuidade de Negócios (PCN), com manutenção de BIAs em sistemas Banco Santander e Zurich, testes diversos (PRD, Cloud, Call Tree, VPN, cenários não TI), gestão de crises (perda de tecnologia, pessoal, infraestrutura) e certificação de KRIs para resiliência operacional contínua.',
      solution:
        'Alocação de Analista de Continuidade de Negócios Sênior em modelo híbrido, gestão integral de PCN, manutenção de BIAs, coordenação regular de testes de PCN, gestão de crises, Pílulas de Conhecimento para cultura de resiliência, validação contínua de KRIs e monitoramento via Sistema de Gestão de Riscos (SGR).',
      stack: ['Sistemas Banco Santander', 'Sistemas Zurich', 'Infraestrutura Cloud', 'VPN', 'Call Tree', 'SGR', 'Ferramentas PCN'],
      results: [
        '30% aumento na eficácia da continuidade',
        '40% aumento na taxa de sucesso dos testes de PCN',
        '30% redução média no tempo de recuperação em crises',
        '25% queda em incidentes de impacto operacional grave',
        'Maturidade elevada em gestão de crises Banco + Seguros',
        'Cultura de resiliência fortalecida com Pílulas de Conhecimento',
      ],
      metric: { value: '30%', label: 'Aumento na eficácia da continuidade' },
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
  extra2: {
    title: 'Social Selling — Contatos Estratégicos',
    subtitle: 'Líderes de TI estratégicos no ecossistema Santander Brasil',
    content: {
      contacts: [
        {
          name: 'Wander Cunha',
          role: 'Director — F1RST Digital Services',
          company: 'F1RST Digital Services (Grupo Santander Brasil)',
          sector: 'Bancário e Serviços Financeiros',
          city: 'São Paulo - SP',
          revenue: 'F1RST: ~R$ 2 bi orçamento anual de TI',
          opportunities: 4,
          topOffer: 'AI Squad',
          topScore: 96,
          briefingFiles: [{ label: 'Wander Cunha — Santander Brasil', file: 'wander-cunha.html' }],
          tag: 'F1RST / Santander Brasil',
        },
      ],
    },
  },
}

const santanderClientEn: ClientConfig = {
  id: 'santander',
  name: 'Santander',
  colors: { primary: '#CC0000', accent: '#FF3333' },
  tagline: 'Building the digital future together for over 17 years',
  relationship: 'Strategic technology partner — 17+ years of continuous delivery',
  yearsPartnership: 17,
  sections: [
    {
      id: 'client-opening',
      label: 'Foursys × Santander',
      description: 'Long-standing strategic partnership',
      icon: 'handshake',
      component: 'client-opening',
    },
    {
      id: 'client-insights',
      label: 'Santander Insights',
      description: 'What we identified across Santander projects',
      icon: 'search',
      component: 'client-insights',
    },
    {
      id: 'client-cases',
      label: 'Santander Cases',
      description: 'Deliveries within the Santander ecosystem',
      icon: 'building',
      component: 'client-cases',
    },
  ],
  insights: [
    {
      id: 'think-value',
      title: 'Think Value — Modernization and Automation at Scale',
      description:
        'Santander declared as a strategic pillar to "drive efficiency and productivity through modernization and automation at scale." With BRL 1.256 trillion in assets and 49,661 employees, each efficiency point represents millions in results.',
      solution:
        'Progressive modernization with SDD (no big-bang rewrite) + Hyperautomation with AI Agents. We have delivered 17+ years of continuous modernization in the Santander ecosystem, with zero downtime in migrations.',
      icon: '⚡',
    },
    {
      id: 'think-customer',
      title: 'Think Customer — Hyper-Personalization with Data and AI',
      description:
        'The bank seeks "hyper-personalized experiences driven by data and anticipation of needs" for 73.9 million clients. The journey must be "seamless and integrated across channels" — from physical stores to the app.',
      solution:
        'Data Platform with multi-source ingestion for 360° customer view + predictive AI models for next-best-action. Squads dedicated to high-traffic digital channel development with omnichannel expertise.',
      icon: '🎯',
    },
    {
      id: 'genai',
      title: 'GenAI as a Competitive Advantage',
      description:
        'Santander positions itself as a "reference in GenAI utilization, delivering competitive advantage and better customer experience." Generative AI is a strategic priority of the Board\'s Technology and Innovation Committee.',
      solution:
        'AI First method: pilot to production in 6 weeks, with 85% conversion. Quality AI Framework (already approved by Santander) demonstrates our ability to deliver applied AI within the bank\'s ecosystem.',
      icon: '🧠',
    },
    {
      id: 'risco-credito',
      title: 'Risk Management and Credit Quality',
      description:
        'With a BRL 708B portfolio and NPL Over 90 at 4.0%, Santander continuously improves risk and capital management. The cost of credit (3.76%) and NPL formation require increasingly sophisticated prediction models.',
      solution:
        'ML models for real-time scoring and fraud detection (< 200ms). Predictive analytics for delinquency anticipation. Integration with risk platforms for BACEN and Basel III compliance.',
      icon: '📊',
    },
    {
      id: 'pme-crescimento',
      title: 'SMEs — Fastest-Growing Segment (+23%)',
      description:
        'Small and Medium Enterprises grew 23% YoY in credit portfolio, with Santander\'s ambition being "to be the bank of choice for companies." This segment demands agile and scalable digital solutions.',
      solution:
        'Digital credit origination platforms for SMEs with automated pipelines. Open Banking APIs for partner ecosystem integration. Squads specialized in business products.',
      icon: '🚀',
    },
    {
      id: 'think-global',
      title: 'Think Global — Brazil as an Innovation Hub',
      description:
        'Santander Brazil is positioned as an "innovation hub to export digital models" to the global group, leveraging global platforms to accelerate innovation and reduce costs. 17.6% ROAE confirms its relevance.',
      solution:
        'Support for developing exportable solutions to the global group. Bilingual squads (PT/EN) with experience integrating with Santander Global platforms. 17+ years of accumulated ecosystem knowledge.',
      icon: '🌎',
    },
    {
      id: 'funding-captacao',
      title: 'Funding Optimization and Investment Platform',
      description:
        'Funding diversification focused on retail (retail went from 50% to 55% of mix). Building the "best investment platform in the market, grounded in human relationships with scale and digital excellence."',
      solution:
        'Development of digital investment platforms with premium UX. Real-time portfolio tracking dashboards. CRM system integration for advisors with recommendation analytics.',
      icon: '💰',
    },
    {
      id: 'sustentabilidade',
      title: 'ESG and Sustainable Finance — BRL 50.7B Portfolio',
      description:
        'Santander reached BRL 50.7 billion in sustainable portfolio and an "A" CDP rating. CBIO leader with 41% market share. ESG is an evaluation metric for Board executives.',
      solution:
        'Automated ESG monitoring and reporting platforms. Sustainability KPI dashboards for compliance and market communication. Integration with Santander group SFICS frameworks.',
      icon: '🌱',
    },
  ],
  partnership: {
    contractSince: '2009',
    contractLabel: 'ACTIVE CONTRACT SINCE',
    contractDescription: 'Foursys uninterrupted work alongside Santander.',
    bigNumbers: [
      { value: '69', label: 'Professionals involved' },
      { value: '78,624', label: 'Service hours' },
      { value: '110', label: 'Projects in 2020' },
      { value: '1.58%', label: 'Average monthly turnover' },
    ],
    actionAreasTitle: 'Engaged across the following areas',
    actionAreas: [
      'CASH MANAGEMENT',
      'AGRIBUSINESS',
      'PAYMENT METHODS',
      'PAYMENTS & RECEIPTS',
      'RECEIVABLES',
      'CONSORTIUM',
      'LOANS',
      'INVESTMENT PLATFORM / COMEX',
      'ACQUIRING',
      'BNDES',
      'CORPORATE & RETAIL RISK',
      'CONSUMER FINANCE',
      'COLLECTIONS & DDA',
      'CARDS',
      'MAINFRAME INFRASTRUCTURE',
      'ANTI-FRAUD',
      'CORE BANKING',
      'CHANNELS',
    ],
    alliancesTitle: 'Strategic Alliances',
    alliances: ['aws', 'databricks', 'salesforce', 'pega'],
  },
  cases: [
    {
      id: 'shi-portal',
      title: 'SHI Real Estate Portal',
      sector: 'Financial / Real Estate',
      type: 'Digital Product',
      challenge:
        'Santander needed a centralized portal for SHI real estate portfolio management, integrating data from multiple legacy sources and providing real-time executive dashboards.',
      solution:
        'Web portal development with React, REST APIs in Java Spring Boot, legacy system integration via API Gateway layer, and interactive dashboards with D3.js.',
      stack: ['React', 'Java Spring Boot', 'AWS', 'API Gateway', 'PostgreSQL', 'D3.js'],
      results: [
        'Portfolio query time reduced from 3 days to 10 minutes',
        'Real-time visibility of 100% of portfolio properties',
        'Elimination of 15 manual Excel reports',
        'Immediate adoption by 200+ bank managers',
      ],
      metric: { value: '99%', label: 'Reduction in query time' },
    },
    {
      id: 'quality-ia-impl',
      title: 'Quality AI Framework',
      sector: 'Financial',
      type: 'Framework / Product',
      challenge:
        'Santander\'s QA team performed mostly manual tests, generating 6-week release cycles and a high defect rate in production.',
      solution:
        'Development of the Quality AI Framework: an intelligent test automation plugin that uses AI for automatic test case generation, risk identification, and impact analysis.',
      stack: ['Python', 'LLMs', 'Selenium', 'Jenkins', 'SonarQube', 'Jira Integration'],
      results: [
        'Release cycle reduced from 6 weeks to 2 weeks',
        '78% increase in automated test coverage',
        '60% reduction in production defects',
        'Framework approved by Santander for corporate use',
      ],
      metric: { value: '3x', label: 'Faster release velocity' },
    },
    {
      id: 'qa-consorcio-automacao',
      title: 'Quality Certification and Automation for Consortium',
      sector: 'Financial / Consortium (F1RST)',
      type: 'Closed Scope Software',
      challenge:
        'F1RST\'s consortium system required broader and deeper software quality coverage to ensure operational continuity, preserve existing functionality and advance AI-based automation to scale reliability and delivery speed. The process demanded test mass stabilization, governance and a CI/CD-integrated Center of Excellence (CoE).',
      solution:
        'Quality certification process with automation of 200 back-end test scripts across critical consortium flows, LGPD-compliant test data generation and de-identification, intelligent agents for API automation with RestAssured and BDD/Gherkin. CoE + Shared Services Center (CsC) model for standardization, governance, dashboards and continuous capability building.',
      stack: ['BDD/Gherkin', 'RestAssured', 'Cucumber', 'Selenium', 'Appium', 'Jenkins', 'Azure DevOps', 'SonarQube', 'OWASP ZAP', 'AI Agents'],
      results: [
        '200 automated scripts across critical consortium flows',
        '8 to 10x reduction in regression test execution time',
        '~65% overall reduction in total test execution time',
        '80% drop in critical production failures (Quality Studio)',
        '30 to 40% reduction in critical post-deploy defects',
        '50% reduction in data preparation time (LGPD compliance)',
        '3x increase in scenario coverage per cycle',
      ],
      metric: { value: '65%', label: 'Reduction in test execution time' },
    },
    {
      id: 'qa-aumentado-ia',
      title: 'AI-Augmented QA — Specialized Cell',
      sector: 'Financial / Loans and Financing',
      type: 'Specialized Cell',
      challenge:
        'Santander faced QA pipeline limitations with high manual documentation effort, compliance risks from using production data in tests and a traditional model insufficient to scale the complexity and volume required by loans and financing.',
      solution:
        'Efficiency Engineering cell with AI agents for automatic Gherkin scenario generation (from 5 to ~50 per journey), realistic synthetic data provisioning (valid CPF/CNPJ/postal codes with no real data), Java/Maven script automation and indicator dashboards. A POC compared the AI framework × traditional process, confirming significant gains.',
      stack: ['AI Agents', 'BDD/Gherkin', 'Java', 'Maven', 'Foursys Framework', 'Kanban', 'Synthetic Data'],
      results: [
        '+80% software quality assured',
        '≥50% reduction in test automation time',
        '≥80% executable Gherkin scenarios without adjustments (AI framework)',
        '+200% increase in functional test coverage',
        '70% test coverage with synthetic data',
        '10x increase in visibility over quality risks',
        '6x reduction in automated test creation time',
      ],
      metric: { value: '6x', label: 'Faster test creation' },
    },
    {
      id: 'gestao-alocacao-agile',
      title: 'Strategic Agile Allocation Management',
      sector: 'Technology / Squads and Allocation',
      type: 'Strategic Allocation',
      challenge:
        'Santander needed to maintain low turnover and high capability in allocated teams, with agile mobilization across countries and demands, proactive management against idleness, supplier governance and rigorous lifecycle administration for collaborators in an Agile/Scrum model.',
      solution:
        'Full allocation service with integrated management: agile mobilization, personalized follow-up, IDP (Individual Development Plan), People Care, mentoring, communities of practice, inclusion program and lifecycle administration via the Fourmakers platform. Dedicated service structure with exclusive managers per client.',
      stack: ['Fourmakers', 'IDP', 'People Care', 'Agile/Scrum', 'Mentoring', 'Communities of Practice', 'Sentiment Analytics'],
      results: [
        '4.26% sustainable average annual turnover',
        '700+ managed professionals',
        'Service across 6 countries',
        '15% reduction in average mobilization time',
        '20% drop in turnover within critical teams',
        '12% productivity gain in technology teams',
      ],
      metric: { value: '4.26%', label: 'Sustainable annual turnover' },
    },
    {
      id: 'cnpj-alfanumerico-cobol',
      title: 'Adapting COBOL Legacy to Alphanumeric CNPJ',
      sector: 'Financial / Regulatory (F1RST)',
      type: 'Closed Scope Software',
      challenge:
        'Adapt all F1RST programs and systems to the Brazilian Federal Revenue regulation (Technical Note 49/2024) for alphanumeric CNPJ handling, with adjustments in COBOL code, DB2 structures and queries, preserving integrity and performance of the legacy. Tight deadline of 8 months for development in 3 waves + 3 months of integrated homologation + 1 month implementation + 3 months post-implementation.',
      solution:
        'Software engineering with AI for impact analysis, iterative development (Dual-Track + Kanban), automated regression testing, DevOps integration with CI/CD. Coverage of COBOL Gravity versions (FTB, FTG, FTF) with BDD/Gherkin tests and governance in weekly, monthly and quarterly cycles.',
      stack: ['COBOL', 'Copybooks', 'DB2', 'Foursys AI', 'Test Automation', 'BDD/Gherkin', 'DevOps', 'CI/CD'],
      results: [
        '1,915 COBOL programs impacted and adapted',
        '144 online programs modified and recompiled',
        '1,656 functional documentations (Gherkin scenarios) generated',
        '~25% productivity gain in development',
        '~30% reduction in post-implementation defects',
        'Full compliance with Technical Note 49/2024',
        '15 corporate domains standardized',
      ],
      metric: { value: '1,915', label: 'COBOL components adapted' },
    },
    {
      id: 'fidc-backend-qa',
      title: 'Strategic FIDC Allocation — Backend and QA',
      sector: 'Financial / FIDC and Credit',
      type: 'Specialized Allocation',
      challenge:
        'Santander\'s FIDC required qualified professionals for backend development and quality assurance, with agile mobilization within up to 15 business days for ramp-up and 20 business days for ramp-down, rigorous management of productive hours, low turnover and flexible team adjustment per market and regulatory demands.',
      solution:
        'Allocation of 6 professionals (2 Advanced Backend Devs, 2 Intermediate Backend Devs, 2 QA Engineers) in hybrid Anywhere Office model, agile methodology with sprints and indicators, microservices architecture, RESTful APIs, continuous integration and test automation. People Care and Fourmakers management to retain critical FIDC talent.',
      stack: ['RESTful APIs', 'Microservices', 'Cloud / PaaS', 'Selenium', 'Appium', 'JUnit', 'TestNG', 'CI/CD'],
      results: [
        '25% reduction in feature delivery lead time',
        '30% drop in production defect rate',
        '20% reduction in professional ramp-up time',
        '336 monthly hours per allocated professional',
        '4.26% turnover aligned with the global program',
        'FIDC platform scalability without performance loss',
      ],
      metric: { value: '25%', label: 'Reduction in delivery lead time' },
    },
    {
      id: 'sites-aem-santander',
      title: 'Three Institutional Sites with Adobe AEM',
      sector: 'Marketing / Corporate Communications',
      type: 'Closed Scope Software',
      challenge:
        'Grupo Santander needed to modernize its institutional digital presence with robust, multilingual, SEO-optimized sites, with WCAG accessibility and decentralized content management, maintaining strict standards of governance, security and monitoring — all within a 5-month deadline with defined validation SLAs.',
      solution:
        'Development of 3 institutional sites on Adobe Experience Manager (AEM), with responsive design, multilingual support, technical SEO, WCAG accessibility, Creative Cloud integration and Dynatrace monitoring. ITIL + PMP + Scrum + SAFE methodology and training of 15 ADM professionals for content management autonomy.',
      stack: ['Adobe AEM', 'Java', 'JavaScript', 'HTML', 'CSS', 'Dynatrace', 'Creative Cloud', 'SEO Tools', 'Hot Map Analytics'],
      results: [
        '3 institutional sites delivered in 5 months',
        '100 page templates considered (40 new + 60 reused)',
        '30% drop in average page loading time',
        '15% increase in form conversion rate',
        '20% reduction in content publishing time',
        '15 ADM professionals trained in AEM for autonomy',
      ],
      metric: { value: '3', label: 'Institutional sites with AEM' },
    },
    {
      id: 'gravity-24x7-mainframe',
      title: 'Gravity 24x7 Squad — Bilingual Mainframe',
      sector: 'Financial Services / Spain',
      type: 'Managed Squad',
      challenge:
        'The Gravity project required 24x7 operational coverage aligned with Spain\'s time zone (GMT+1), with scalability, cost-efficiency, bilingual PT/ES communication, clear governance and high performance in supporting core Mainframe applications. Critical knowledge retention in a complex environment was required.',
      solution:
        'Remote squad of 10 senior/mid-level professionals + 1 hybrid Tech Lead onsite 3x/week, organized in 8x1 or 12x36 shifts aligned with GMT+1. Bilingual team (Portuguese/Spanish) with Foursys governance, client-prioritized backlog and shadowing for Gravity operation knowledge retention.',
      stack: ['Mainframe', 'TSO', 'CICS', 'DB2', 'VPN', 'Bilingual Managed Squad'],
      results: [
        '24x7 bilingual PT/ES coverage guaranteed',
        '10 remote professionals + 1 hybrid Tech Lead',
        '30% increase in Gravity application availability',
        '20% reduction in average incident resolution time',
        '15% improvement in support team productivity',
        'Integrated Brazil-Spain communication with less friction',
      ],
      metric: { value: '24x7', label: 'Bilingual operational coverage' },
    },
    {
      id: 'modernizacao-cobol-net-cloud',
      title: 'COBOL → .NET Core Modernization and Cybersecurity',
      sector: 'Technology / Digital Transformation',
      type: 'Closed Scope Software',
      challenge:
        'Migrate mainframe legacy with ~6-hour batch chain and high licensing costs to a scalable modern architecture in a short timeframe, ensuring high availability, team capability building, integration of multinational teams and simultaneous strengthening of cybersecurity posture for critical digital journeys.',
      solution:
        'Modernization with AI for COBOL → .NET Core code transpilation, monolith-to-microservices transformation, DB2 → SQL Server migration, DevOps pipeline with Jenkins + AWS CodePipeline, Docker containerization, Kubernetes orchestration, Grafana/Prometheus monitoring and robust cybersecurity layers with continuous vulnerability management.',
      stack: ['COBOL', '.NET Core', 'Microservices', 'Kubernetes', 'Docker', 'SQL Server', 'Jenkins', 'AWS CodePipeline', 'Grafana', 'Prometheus', 'Foursys AI'],
      results: [
        '450,000 lines of code migrated',
        '2,400 API methods implemented',
        '14 million requests blocked/month in cybersecurity',
        '65% reduction in environment provisioning time',
        '50% reduction in average release delivery cycle',
        '40% drop in high-severity incidents',
        '~4x increase in transactional capacity',
        '100% test coverage',
      ],
      metric: { value: '65%', label: 'Reduction in environment provisioning' },
    },
    {
      id: 'ae-cadastro-grupo-economico',
      title: 'AE — Economic Group Registration Identifier',
      sector: 'Financial / Credit Risk',
      type: 'Closed Scope Software',
      challenge:
        'Santander\'s environment required improvements in queries and approvals considering person type (Retail/Corporate) for filter adequacy and risk calculation, with differentiated batch processing (revolving, limit renewal) and multiple channels — minimizing inconsistencies between systems, risk rework and exposure by economic group.',
      solution:
        'Closed-scope project in Anywhere Office model implementing the AE — Economic Group Registration Identifier, with specific treatments in online filters (Online Risk Retail/Corporate) and batch processes (Revolving, Inconsistent Limit), shared layout integration via repository, segmented delivery with monthly validation and daily team alignment.',
      stack: ['Online Platform', 'Batch Processing', 'Integration APIs', 'Credit & Risk Systems', 'QA Tools'],
      results: [
        '39 features in 6 months (36 weeks)',
        '34 online and batch components addressed',
        'Up to 25% reduction in query and approval failures',
        '20% productivity gain in credit analysis',
        '15% reduction in limit inconsistencies between systems',
        '10% drop in credit risk rework',
      ],
      metric: { value: '25%', label: 'Reduction in query/approval failures' },
    },
    {
      id: 'alocacao-multinacional',
      title: 'Multinational Allocation — 700 Professionals',
      sector: 'Technology / People and Culture',
      type: 'Strategic Allocation',
      challenge:
        'Mobilize and retain 700+ professionals allocated to multiple Santander fronts, with low turnover, continuous capability building, idleness prevention, constant technical skill updates and alignment with client culture — in a data-driven environment with strategic partners (AWS, Google, Microsoft).',
      solution:
        'Full management of allocated professionals with Data Driven Design, AWS/Google/Microsoft partnerships, Fourmakers platform, PLUGandPLAY programs with Digibee/Axway, sentiment analytics, +10,000 annual training hours, structured IDP, mentoring and active idleness monitoring. Dedicated People & Culture structure.',
      stack: ['Fourmakers', 'Data Driven Design', 'AWS', 'Google Cloud', 'Microsoft', 'Digibee', 'Axway', 'IDP', 'Sentiment Analytics'],
      results: [
        '700 professionals in the program',
        '400 professionals trained in technology',
        '+10,000 annual training hours',
        '92% of professionals recommend Foursys (eNPS)',
        '4.26% annual turnover in technology',
        'Operations across 6 countries',
      ],
      metric: { value: '700+', label: 'Managed professionals' },
    },
    {
      id: 'imobiliario-portal-evolucao',
      title: 'Santander Real Estate Platform — Site, Portal and Support',
      sector: 'Financial / Real Estate',
      type: 'Managed Squad + Open Scope',
      challenge:
        'Santander needed to modernize the Santander Imóveis site and implement an administrative portal, with secure AWS infrastructure, 24/7 support, integrations with Benner/auctioneers/geolocation and architectural transition from WordPress to Java + Angular for scalability, transactional security and omnichannel expansion.',
      solution:
        'Phase 1: site and portal in WordPress + AWS Cloud with WAF, Sophos UTM, Dynatrace monitoring and 24/7 support with SLAs. Phase 2: re-coding in Java + Angular, dedicated data modeling, managed squad, Benner integration, Excel automation, chatbot and robust administrative portal with 10+ priority functionalities and 300+ user stories.',
      stack: ['Java', 'Angular', 'WordPress', 'AWS', 'AWS WAF', 'Sophos UTM', 'Dynatrace', 'Benner API', 'Microservices', 'Geolocation'],
      results: [
        '~99.9% site and portal availability',
        '40% drop in recurring critical incidents',
        '30% increase in lead-to-proposal conversion',
        '40% reduction in manual effort for registrations and reports',
        '25% reduction in average digital service time',
        '+25% qualified organic traffic',
        '300+ user stories implemented',
      ],
      metric: { value: '99.9%', label: 'Site and portal availability' },
    },
    {
      id: 'investimentos-fundos-squad',
      title: 'Investment Funds Squad — Support and Regulatory',
      sector: 'Financial / Investments',
      type: 'Managed Squad',
      challenge:
        'Legacy Mainframe/COBOL systems with weakened knowledge base after team demobilization and specialist retirements, integration of 34 systems (Sinquea + F1RST layer) under gradual 2-3 year migration, with strong regulatory pressure (CVM/BACEN) and tight deadlines between December and January for CDB, Letras and other investment products.',
      solution:
        'Hybrid managed squad (3x/week onsite) with Java + Mainframe profiles, SAFe methodology, backlog management with weekly/monthly/quarterly cadences. Fourmakers platform for turnover mitigation, career paths, IDP, critical knowledge management and regulatory delivery (Provisional Measures and CVM/BACEN requirements).',
      stack: ['Java Spring', 'Mainframe COBOL', 'Oracle', 'AWS', 'Big Data', 'SAFe', 'Fourmakers'],
      results: [
        '34 integrated systems supported',
        'Up to 95% adherence to regulatory deadlines',
        'Up to 30% reduction in operational risks',
        '30% reduction in regulatory demand lead time',
        '25% reduction in critical profile turnover',
        '20% drop in critical production incidents',
        '15% reduction in regulatory non-conformities',
      ],
      metric: { value: '95%', label: 'Regulatory deadline adherence' },
    },
    {
      id: 'continuidade-pcn-zurich',
      title: 'Business Continuity Management (BCM) — Santander and Zurich',
      sector: 'Financial & Insurance / Operational Risk',
      type: 'Specialized Allocation',
      challenge:
        'Santander required structured management of the Business Continuity Plan (BCP), with BIA maintenance for Banco Santander and Zurich systems, multiple tests (DRP, Cloud, Call Tree, VPN, non-IT scenarios), crisis management (loss of technology, personnel, infrastructure) and KRI certification for continuous operational resilience.',
      solution:
        'Allocation of Senior Business Continuity Analyst in hybrid model, integrated BCP management, BIA maintenance, regular BCP test coordination, crisis management, Knowledge Pills for resilience culture, continuous KRI validation and monitoring via the Risk Management System (SGR).',
      stack: ['Banco Santander Systems', 'Zurich Systems', 'Cloud Infrastructure', 'VPN', 'Call Tree', 'SGR', 'BCP Tools'],
      results: [
        '30% increase in continuity effectiveness',
        '40% increase in BCP test success rate',
        '30% average reduction in crisis recovery time',
        '25% drop in severe operational impact incidents',
        'High maturity in Bank + Insurance crisis management',
        'Resilience culture strengthened with Knowledge Pills',
      ],
      metric: { value: '30%', label: 'Increase in continuity effectiveness' },
    },
  ],
  extra1: {
    title: 'Quality AI Framework',
    subtitle: 'Intelligent test automation plugin — approved by Santander',
    content: {
      phases: [
        {
          id: 'analise',
          title: 'Intelligent Analysis',
          description: 'AI analyzes the code and automatically identifies the highest risk and impact points for test prioritization.',
          icon: 'search',
        },
        {
          id: 'geracao',
          title: 'Test Case Generation',
          description: 'LLMs automatically generate test cases based on code changes, bug history, and business rules.',
          icon: 'zap',
        },
        {
          id: 'execucao',
          title: 'Parallel Execution',
          description: 'Parallel test execution with intelligent orchestration — reducing validation cycle time by up to 70%.',
          icon: 'rocket',
        },
        {
          id: 'relatorio',
          title: 'Executive Report',
          description: 'Real-time dashboard with quality score, coverage, risk, and recommendations prioritized by impact.',
          icon: 'bar-chart',
        },
      ],
      metrics: [
        { value: '78%', label: 'Coverage increase' },
        { value: '3x', label: 'Release velocity' },
        { value: '60%', label: 'Defect reduction' },
        { value: '100%', label: 'Santander approved' },
      ],
    },
  },
  extra2: {
    title: 'Social Selling — Strategic Contacts',
    subtitle: 'Strategic IT leaders in the Santander Brazil ecosystem',
    content: {
      contacts: [
        {
          name: 'Wander Cunha',
          role: 'Director — F1RST Digital Services',
          company: 'F1RST Digital Services (Santander Brazil Group)',
          sector: 'Banking & Financial Services',
          city: 'São Paulo - SP',
          revenue: 'F1RST: ~BRL 2bi annual IT budget',
          opportunities: 4,
          topOffer: 'AI Squad',
          topScore: 96,
          briefingFiles: [{ label: 'Wander Cunha — Santander Brazil', file: 'wander-cunha.html' }],
          tag: 'F1RST / Santander Brazil',
        },
      ],
    },
  },
}

export function getSantanderClient(lang: Language = 'pt'): ClientConfig {
  return lang === 'en' ? santanderClientEn : santanderClient
}
