export interface PortfolioGlossaryItem {
  term: string
  definition: { pt: string; en: string }
  clientLanguage: { pt: string; en: string }
}

export interface PortfolioBridge {
  id: string
  clientAgenda: { pt: string; en: string }
  entryCode: string
  capacityCodes: string[]
  assetNames: string[]
}

/** Pontes de cross-sell: uma porta, capacidades puxadas e ativos habilitadores. */
export const portfolioBridges: PortfolioBridge[] = [
  {
    id: 'ia-controlada',
    clientAgenda: { pt: 'Escalar IA com controle', en: 'Scale AI with control' },
    entryCode: '2.1C',
    capacityCodes: ['2.1B', '2.2'],
    assetNames: ['NEXUS', 'Zeragon'],
  },
  {
    id: 'operacao-enxuta',
    clientAgenda: { pt: 'Absorver volume sem inflar operação', en: 'Absorb volume without inflating operations' },
    entryCode: '1.3',
    capacityCodes: ['2.3', '3.4'],
    assetNames: ['NEXUS', 'Fusion Teams'],
  },
  {
    id: 'decisao-dados',
    clientAgenda: { pt: 'Decidir com dado confiável', en: 'Make decisions with trusted data' },
    entryCode: '4.1',
    capacityCodes: ['4.2', '4.3'],
    assetNames: ['NEXUS', 'Fusion Teams'],
  },
  {
    id: 'modernizacao',
    clientAgenda: { pt: 'Modernizar com cadência e qualidade', en: 'Modernize with cadence and quality' },
    entryCode: '3.1',
    capacityCodes: ['3.2', '3.3', '3.4'],
    assetNames: ['Fusion Teams', 'NEXUS'],
  },
  {
    id: 'custo-digital',
    clientAgenda: { pt: 'Controlar custo de cloud e IA', en: 'Control cloud and AI costs' },
    entryCode: '5.1',
    capacityCodes: ['5.3', '5.4'],
    assetNames: ['SharpOps', 'NEXUS'],
  },
]

export const portfolioGlossary: PortfolioGlossaryItem[] = [
  {
    term: 'NEXUS',
    definition: {
      pt: 'Plataforma Foursys que cria, orquestra e governa fluxos e agentes de IA.',
      en: 'Foursys platform that creates, orchestrates and governs AI agents and workflows.',
    },
    clientLanguage: {
      pt: 'O painel e o motor de controle da IA em produção.',
      en: 'The control panel and engine for AI in production.',
    },
  },
  {
    term: 'Guardrail',
    definition: {
      pt: 'Regra técnica que limita o que modelo ou agente pode acessar e fazer.',
      en: 'A technical rule that limits what a model or agent can access and do.',
    },
    clientLanguage: {
      pt: 'A cerca de segurança aplicada durante a execução.',
      en: 'The safety fence applied while AI is running.',
    },
  },
  {
    term: 'Soberania de IA',
    definition: {
      pt: 'Capacidade de controlar fornecedor, local do dado e stack operacional.',
      en: 'Ability to control providers, data location and the operating stack.',
    },
    clientLanguage: {
      pt: 'Liberdade para trocar tecnologia sem perder controle.',
      en: 'Freedom to change technology without losing control.',
    },
  },
  {
    term: 'Data Readiness',
    definition: {
      pt: 'Prontidão do dado para uso confiável por modelos e agentes.',
      en: 'Data readiness for reliable use by models and agents.',
    },
    clientLanguage: {
      pt: 'Dado organizado, explicado, protegido e com dono.',
      en: 'Data that is organized, explained, protected and owned.',
    },
  },
  {
    term: 'Camada semântica',
    definition: {
      pt: 'Definições de negócio que dão significado comum aos dados.',
      en: 'Business definitions that give data a shared meaning.',
    },
    clientLanguage: {
      pt: 'A tradução entre tabela técnica e linguagem do negócio.',
      en: 'The translation between technical tables and business language.',
    },
  },
  {
    term: 'Decision Intelligence',
    definition: {
      pt: 'Dados, lógica e interface conectados a uma decisão rastreável.',
      en: 'Data, logic and interfaces connected to a traceable decision.',
    },
    clientLanguage: {
      pt: 'Não só mostrar o número: explicar e orientar a ação.',
      en: 'Not only showing the number, but explaining it and guiding action.',
    },
  },
  {
    term: 'Autonomous Intelligence',
    definition: {
      pt: 'Modelo que recomenda ou age dentro de limites e controles.',
      en: 'A model that recommends or acts within defined limits and controls.',
    },
    clientLanguage: {
      pt: 'A inteligência que prevê e executa com freios.',
      en: 'Intelligence that predicts and acts with safeguards.',
    },
  },
  {
    term: 'FinOps',
    definition: {
      pt: 'Disciplina de gestão e otimização do custo de cloud.',
      en: 'Discipline for managing and optimizing cloud costs.',
    },
    clientLanguage: {
      pt: 'Saber onde gasta, mudar e comprovar a economia.',
      en: 'Know where money is spent, make changes and prove savings.',
    },
  },
  {
    term: 'Tokenomics',
    definition: {
      pt: 'Governança econômica do consumo por tokens de IA, APIs e orquestração.',
      en: 'Economic governance for AI token, API and orchestration consumption.',
    },
    clientLanguage: {
      pt: 'FinOps para faturas baseadas em token.',
      en: 'FinOps for token-based bills.',
    },
  },
  {
    term: 'Tokenização',
    definition: {
      pt: 'Representação digital de ativos e direitos com trilha verificável.',
      en: 'Digital representation of assets and rights with a verifiable trail.',
    },
    clientLanguage: {
      pt: 'Transformar um ativo em unidade digital negociável.',
      en: 'Turn an asset into a tradable digital unit.',
    },
  },
  {
    term: 'Fusion Teams',
    definition: {
      pt: 'Times Foursys e cliente trabalhando juntos com transferência de autonomia.',
      en: 'Foursys and client teams working together while transferring autonomy.',
    },
    clientLanguage: {
      pt: 'Entregamos junto e deixamos o cliente capaz de continuar.',
      en: 'We deliver together and enable the client to continue.',
    },
  },
  {
    term: 'Agentic Squad',
    definition: {
      pt: 'Squad de software com pessoas e agentes integrados ao ciclo.',
      en: 'Software squad with people and agents integrated into the lifecycle.',
    },
    clientLanguage: {
      pt: 'Time humano ampliado por agentes, com custo e governança medidos.',
      en: 'A human team augmented by agents, with measured cost and governance.',
    },
  },
  {
    term: 'SharpOps',
    definition: {
      pt: 'Unidade Foursys especializada em FinOps e economia realizada.',
      en: 'Foursys unit specialized in FinOps and realized savings.',
    },
    clientLanguage: {
      pt: 'Quem encontra, executa e mede a economia de cloud.',
      en: 'The team that finds, executes and measures cloud savings.',
    },
  },
  {
    term: 'Zeragon',
    definition: {
      pt: 'Empresa do grupo dedicada a cibersegurança, riscos e privacidade.',
      en: 'Group company dedicated to cybersecurity, risk and privacy.',
    },
    clientLanguage: {
      pt: 'Especialista de segurança que protege a transformação e a IA.',
      en: 'Security specialist protecting transformation and AI.',
    },
  },
]
