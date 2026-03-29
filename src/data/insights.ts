import type { AppSection } from '../types'

export interface Insight {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  readTime: string
  sectionLink?: AppSection
  color: string
}

export const insightCategories = [
  'IA & Automação',
  'Modernização',
  'Cloud & Dados',
  'Qualidade',
  'Estratégia',
  'Segurança',
]

export const insights: Insight[] = [
  {
    id: 'ia-engenharia-software',
    title: 'IA na Engenharia de Software: acelerador ou atalho perigoso?',
    excerpt: 'Como usar IA de forma responsável no ciclo de desenvolvimento sem comprometer governança e qualidade.',
    content:
      'A adoção de IA generativa na engenharia de software cresceu exponencialmente, mas sem governança adequada, gera código frágil, dívida técnica e riscos de segurança. Na Foursys, integramos IA ao SDLC como acelerador disciplinado: análise de requisitos, geração assistida de código, testes automatizados e documentação — sempre com revisão humana e rastreabilidade. O resultado é +50% de produtividade sem perder padrão enterprise. A chave não é substituir engenheiros, mas amplificar sua capacidade com controle.',
    category: 'IA & Automação',
    date: 'Mar 2026',
    readTime: '4 min',
    sectionLink: 'services',
    color: '#8B5CF6',
  },
  {
    id: 'modernizacao-sem-trauma',
    title: 'Modernização de Legados: por que o "big bang" falha',
    excerpt: 'A abordagem incremental que reduz risco e entrega valor desde a primeira sprint.',
    content:
      'Projetos de modernização "big bang" falham em 70% dos casos. O motivo: tentam reescrever tudo de uma vez, paralisando o negócio por meses. Nossa abordagem SDD (Strangler-Driven Design) decompõe o legado em domínios, moderniza incrementalmente e mantém o core operando. Usamos IA para análise de código legado, mapeamento de dependências e geração de testes de regressão. Clientes reportam +30% de redução de custos e +70% de aceleração do time-to-market. Modernizar não precisa ser traumático.',
    category: 'Modernização',
    date: 'Fev 2026',
    readTime: '5 min',
    sectionLink: 'services',
    color: '#06B6D4',
  },
  {
    id: 'finops-cloud',
    title: 'FinOps: como parar de desperdiçar dinheiro na nuvem',
    excerpt: 'Disciplina financeira em cloud que transforma consumo em eficiência mensurável.',
    content:
      'Empresas migram para cloud buscando agilidade, mas muitas descobrem que gastam mais do que o previsto. FinOps não é ferramenta — é disciplina. Envolve visibilidade de custos por squad/produto, rightsizing contínuo, reservas inteligentes e cultura de accountability. Na Foursys, implementamos FinOps como prática integrada à operação: dashboards executivos, alertas de anomalia e otimização automatizada. Clientes reduzem em média 35% dos custos cloud sem perder performance.',
    category: 'Cloud & Dados',
    date: 'Jan 2026',
    readTime: '4 min',
    sectionLink: 'services',
    color: '#F97316',
  },
  {
    id: 'qualidade-ia-testes',
    title: 'Quality IA: quando a IA testa melhor que humanos',
    excerpt: 'Como IA aplicada a testes reduz defeitos em produção em até 60%.',
    content:
      'Testes manuais são lentos, caros e propensos a erro humano. Com IA aplicada, geramos cenários de teste a partir de requisitos, priorizamos por risco real, executamos regressão em paralelo e identificamos padrões de defeito antes da produção. O Framework Quality IA da Foursys, homologado em instituições financeiras de grande porte, reduziu defeitos em produção em 60% e aumentou cobertura de testes em 50%. Qualidade deixou de ser gargalo para ser vantagem competitiva.',
    category: 'Qualidade',
    date: 'Mar 2026',
    readTime: '3 min',
    sectionLink: 'services',
    color: '#22C55E',
  },
  {
    id: 'squads-agentes-ia',
    title: 'AI-Augmented Squads: o futuro das equipes de desenvolvimento',
    excerpt: 'Squads amplificados por agentes de IA que entregam 3x mais rápido.',
    content:
      'O modelo tradicional de squads tem um teto de produtividade. AI-Augmented Squads quebram esse teto integrando agentes de IA especializados ao time humano: agentes de code review, de geração de testes, de documentação e de análise de requisitos. Na prática, o squad ganha "membros virtuais" que trabalham 24/7 sem cansaço. Resultados reais: velocidade 3x maior, qualidade monitorada por IA continuamente e custo por funcionalidade 20% menor. O futuro não é substituir pessoas — é amplificá-las.',
    category: 'IA & Automação',
    date: 'Fev 2026',
    readTime: '5 min',
    sectionLink: 'offers-flagship',
    color: '#8B5CF6',
  },
  {
    id: 'ciberseguranca-devsecops',
    title: 'DevSecOps: segurança como atributo, não como barreira',
    excerpt: 'Como integrar segurança ao ciclo de desenvolvimento sem frear a entrega.',
    content:
      'Segurança aplicada no final do ciclo é cara, lenta e ineficiente. DevSecOps integra controles de segurança desde o design: SAST/DAST automatizados na esteira CI/CD, scanning de dependências, políticas de compliance como código e monitoramento contínuo. Na Foursys, experiência em ambientes regulados (BACEN, LGPD, PCI-DSS) nos ensinou que segurança precisa ser invisível para o desenvolvedor e visível para o auditor. Resultado: -80% de vulnerabilidades e -60% no tempo de resposta a incidentes.',
    category: 'Segurança',
    date: 'Jan 2026',
    readTime: '4 min',
    sectionLink: 'services',
    color: '#EF4444',
  },
  {
    id: 'dados-decisao',
    title: 'De dados brutos a decisões: a jornada analítica que funciona',
    excerpt: 'Arquitetura de dados moderna que transforma volume em inteligência de negócio.',
    content:
      'Ter dados não é ter inteligência. A maioria das empresas acumula petabytes sem conseguir responder perguntas simples de negócio. A jornada analítica que funciona começa com governança na origem, passa por uma arquitetura moderna (data lake, lakehouse, streaming) e termina em analytics e IA aplicados a cenários reais. Com parceria Databricks e experiência em ambientes regulados, entregamos +50% de velocidade de decisão e +80% de dados disponíveis para BI. Dados são o novo petróleo — mas só se refinados.',
    category: 'Cloud & Dados',
    date: 'Dez 2025',
    readTime: '4 min',
    sectionLink: 'services',
    color: '#F59E0B',
  },
  {
    id: 'hiperautomacao-rpa',
    title: 'Além do RPA: hiperautomação inteligente em escala',
    excerpt: 'Automação ponta a ponta que vai muito além de robôs repetitivos.',
    content:
      'RPA tradicional automatiza tarefas isoladas. Hiperautomação combina RPA + IA + orquestração de processos para automatizar fluxos inteiros, de ponta a ponta. Na Foursys, identificamos processos críticos com ROI mensurável, desenhamos a automação com governança e monitoramento contínuo, e escalamos para ambientes enterprise complexos. Resultados típicos: -70% de esforço manual, +50% de produtividade operacional e -40% no tempo de ciclo. Automação inteligente é eficiência com controle.',
    category: 'IA & Automação',
    date: 'Nov 2025',
    readTime: '3 min',
    sectionLink: 'services',
    color: '#06B6D4',
  },
]
