import type { Alliance, Perception } from '../types'

export const alliances: Alliance[] = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    logo: 'AWS',
    level: 'Select Consulting Partner',
    description: 'Parceria para projetos de cloud, dados, IA e modernização de infraestrutura. Certificações em arquitetura, desenvolvimento e operações AWS.',
    color: '#FF9900',
    bgColor: '#1A1000'
  },
  {
    id: 'databricks',
    name: 'Databricks',
    logo: 'Databricks',
    level: 'Partner Certificado',
    description: 'Implementação de Data Lakehouse, engenharia de dados e projetos de IA/ML com a plataforma Databricks. Cases em grandes instituições financeiras.',
    color: '#FF3621',
    bgColor: '#1A0800'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    logo: 'Salesforce',
    level: 'Consulting Partner',
    description: 'Implementação e customização de Sales Cloud, Service Cloud e Marketing Cloud. Times certificados em Salesforce para o mercado financeiro.',
    color: '#00A1E0',
    bgColor: '#001526'
  },
  {
    id: 'pega',
    name: 'Pega Systems',
    logo: 'Pega',
    level: 'Partner Certificado',
    description: 'Implementação de automação de processos e CRM com Pega. Expertise em BPM e decisões em tempo real para o setor financeiro.',
    color: '#00D4AA',
    bgColor: '#001A15'
  }
]

export const perceptions: Perception[] = [
  {
    id: 'legado',
    title: 'Pressão do Legado',
    description: 'Sistemas core críticos em COBOL e tecnologias antigas geram risco operacional e impedem a velocidade de inovação exigida pelo mercado.',
    solution: 'Modernização progressiva com SDD — sem big-bang rewrite, com continuidade operacional garantida.',
    icon: '🏚️'
  },
  {
    id: 'qualidade',
    title: 'Gargalo de Qualidade',
    description: 'Ciclos de testes manuais lentos que bloqueiam releases frequentes e geram retrabalho — impactando time-to-market.',
    solution: 'Framework Quality IA: automação inteligente de testes com IA, já homologado pelo Santander.',
    icon: '🔍'
  },
  {
    id: 'dados',
    title: 'Fragmentação de Dados',
    description: 'Dados críticos dispersos em silos sem integração adequada — decisões baseadas em informações parciais ou desatualizadas.',
    solution: 'Data Lakehouse com Databricks: visão unificada de dados para analytics e IA.',
    icon: '📊'
  },
  {
    id: 'velocidade',
    title: 'Velocidade de Entrega',
    description: 'Demand de produtos digitais superando a capacidade de entrega interna — backlog crescente e squads sobrecarregados.',
    solution: 'Squads + Agentes IA Foursys: velocidade 3x superior ao modelo tradicional.',
    icon: '⚡'
  },
  {
    id: 'seguranca',
    title: 'Conformidade e Segurança',
    description: 'Exigências regulatórias crescentes (BACEN Res. 4.658, LGPD) com necessidade de auditorias contínuas e gestão de vulnerabilidades.',
    solution: 'Portfolio Cyber Security Foursys: SAST, DAST, pentest e compliance regulatório.',
    icon: '🛡️'
  },
  {
    id: 'inovacao',
    title: 'Inovação com IA',
    description: 'Necessidade de integrar IA generativa e agentes autônomos nos processos internos sem perder controle e governança.',
    solution: 'Laboratório de IA Híbrida Foursys: agentes controlados, auditáveis e com supervisão humana.',
    icon: '🤖'
  }
]
