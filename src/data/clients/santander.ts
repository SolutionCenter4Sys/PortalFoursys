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
      icon: '🤝',
      component: 'client-opening',
    },
    {
      id: 'client-insights',
      label: 'Percepções Santander',
      description: 'O que identificamos nos projetos do Santander',
      icon: '🔍',
      component: 'client-insights',
    },
    {
      id: 'client-extra-1',
      label: 'Framework Quality IA',
      description: 'Plugin homologado pelo Santander',
      icon: '⚡',
      component: 'client-extra-1',
    },
    {
      id: 'client-cases',
      label: 'Cases no Santander',
      description: 'Entregas dentro do ecossistema Santander',
      icon: '🏢',
      component: 'client-cases',
    },
  ],
  insights: [
    {
      id: 'legado',
      title: 'Pressão do Legado',
      description:
        'Sistemas core críticos em COBOL e tecnologias antigas geram risco operacional e impedem a velocidade de inovação exigida pelo mercado.',
      solution:
        'Modernização progressiva com SDD — sem big-bang rewrite, com continuidade operacional garantida.',
      icon: '🏚️',
    },
    {
      id: 'qualidade',
      title: 'Gargalo de Qualidade',
      description:
        'Ciclos de testes manuais lentos que bloqueiam releases frequentes e geram retrabalho — impactando time-to-market.',
      solution:
        'Framework Quality IA: automação inteligente de testes com IA, já homologado pelo Santander.',
      icon: '🔍',
    },
    {
      id: 'dados',
      title: 'Fragmentação de Dados',
      description:
        'Dados críticos dispersos em silos sem integração adequada — decisões baseadas em informações parciais ou desatualizadas.',
      solution: 'Data Lakehouse com Databricks: visão unificada de dados para analytics e IA.',
      icon: '📊',
    },
    {
      id: 'velocidade',
      title: 'Velocidade de Entrega',
      description:
        'Demanda de produtos digitais superando a capacidade de entrega interna — backlog crescente e squads sobrecarregados.',
      solution: 'Squads + Agentes IA Foursys: velocidade 3x superior ao modelo tradicional.',
      icon: '⚡',
    },
    {
      id: 'seguranca',
      title: 'Conformidade e Segurança',
      description:
        'Exigências regulatórias crescentes (BACEN Res. 4.658, LGPD) com necessidade de auditorias contínuas e gestão de vulnerabilidades.',
      solution:
        'Portfolio Cyber Security Foursys: SAST, DAST, pentest e compliance regulatório.',
      icon: '🛡️',
    },
    {
      id: 'inovacao',
      title: 'Inovação com IA',
      description:
        'Necessidade de integrar IA generativa e agentes autônomos nos processos internos sem perder controle e governança.',
      solution:
        'Laboratório de IA Híbrida Foursys: agentes controlados, auditáveis e com supervisão humana.',
      icon: '🤖',
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
          icon: '🔍',
        },
        {
          id: 'geracao',
          title: 'Geração de Casos',
          description: 'LLMs geram automaticamente casos de teste baseados nas mudanças do código, histórico de bugs e regras de negócio.',
          icon: '⚡',
        },
        {
          id: 'execucao',
          title: 'Execução Paralela',
          description: 'Execução paralela de testes com orquestração inteligente — reduzindo tempo de ciclo de validação em até 70%.',
          icon: '🚀',
        },
        {
          id: 'relatorio',
          title: 'Relatório Executivo',
          description: 'Dashboard em tempo real com score de qualidade, cobertura, risco e recomendações priorizadas por impacto.',
          icon: '📊',
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
