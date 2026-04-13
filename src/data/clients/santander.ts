import type { ClientConfig } from '../../types'
import type { Language } from '../../i18n/types'

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

const santanderStrategicContextEn: SantanderStrategicContext = {
  reportTitle: 'Institutional Presentation Q4 2025',
  period: 'Q4 2025 (BRGAAP)',
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
      id: 'client-extra-1',
      label: 'Quality AI Framework',
      description: 'Plugin approved by Santander',
      icon: 'zap',
      component: 'client-extra-1',
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
}

export function getSantanderClient(lang: Language = 'pt'): ClientConfig {
  return lang === 'en' ? santanderClientEn : santanderClient
}
