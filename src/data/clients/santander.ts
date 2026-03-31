import type { ClientConfig } from '../../types'

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
