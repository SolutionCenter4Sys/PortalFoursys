import type { Alliance } from '../types'
import type { Language } from '../i18n/types'

const alliancesPt: Alliance[] = [
  {
    id: 'adobe',
    name: 'Adobe',
    logo: 'Adobe',
    level: 'Solution Partner',
    description: 'Parceria para soluções de experiência digital com Adobe Experience Cloud, Creative Cloud e plataformas de personalização e análise de dados de marketing.',
    color: '#FF0000',
    bgColor: '#1A0000'
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    logo: 'AWS',
    level: 'Select Consulting Partner',
    description: 'Parceria para projetos de cloud, dados, IA e modernização de infraestrutura. Certificações em arquitetura, desenvolvimento, machine learning e operações AWS.',
    color: '#FF9900',
    bgColor: '#1A1000'
  },
  {
    id: 'databricks',
    name: 'Databricks',
    logo: 'Databricks',
    level: 'Advanced Partner',
    description: 'Implementação de Data Lakehouse, engenharia de dados e projetos de IA/ML com a plataforma Databricks. Cases em grandes instituições financeiras e seguradoras.',
    color: '#FF3621',
    bgColor: '#1A0800'
  },
  {
    id: 'digibee',
    name: 'Digibee',
    logo: 'Digibee',
    level: 'Integration Partner',
    description: 'Plataforma de integração como serviço (iPaaS) para conectar sistemas legados e modernos. Automação de fluxos de dados e APIs em escala enterprise.',
    color: '#00D4AA',
    bgColor: '#001A14'
  },
  {
    id: 'google-cloud',
    name: 'Google Cloud',
    logo: 'Google Cloud',
    level: 'Strategic Partner',
    description: 'Projetos de dados, analytics e IA com Google Cloud Platform. BigQuery, Vertex AI e soluções de modernização de aplicações cloud-native.',
    color: '#4285F4',
    bgColor: '#001028'
  },
  {
    id: 'intel',
    name: 'Intel',
    logo: 'Intel',
    level: 'Technology Partner',
    description: 'Parceria tecnológica para otimização de workloads de IA, edge computing e infraestrutura de alto desempenho com processadores e plataformas Intel.',
    color: '#0071C5',
    bgColor: '#001028'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'Microsoft',
    level: 'Strategic Partner',
    description: 'Parceria estratégica para soluções Azure, Microsoft 365, Copilot e modernização de workloads. Certificações em Azure Architecture, DevOps e AI/ML.',
    color: '#00A4EF',
    bgColor: '#001A2E'
  },
  {
    id: 'pega',
    name: 'Pega',
    logo: 'Pega',
    level: 'Consulting Partner',
    description: 'Implementação de soluções de automação inteligente, CRM e BPM com Pega Platform. Low-code para transformação digital de processos complexos.',
    color: '#FFFFFF',
    bgColor: '#1A1A1A'
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    logo: 'Snowflake',
    level: 'Select Partner',
    description: 'Implementação de Data Cloud para analytics, data sharing e engenharia de dados. Soluções de data warehouse moderno e governança de dados em escala.',
    color: '#29B5E8',
    bgColor: '#001A28'
  },
]

const alliancesEn: Alliance[] = [
  {
    id: 'adobe',
    name: 'Adobe',
    logo: 'Adobe',
    level: 'Solution Partner',
    description: 'Partnership for digital experience solutions with Adobe Experience Cloud, Creative Cloud and marketing data personalization and analytics platforms.',
    color: '#FF0000',
    bgColor: '#1A0000'
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    logo: 'AWS',
    level: 'Select Consulting Partner',
    description: 'Partnership for cloud, data, AI and infrastructure modernization projects. Certifications in architecture, development, machine learning and AWS operations.',
    color: '#FF9900',
    bgColor: '#1A1000'
  },
  {
    id: 'databricks',
    name: 'Databricks',
    logo: 'Databricks',
    level: 'Advanced Partner',
    description: 'Data Lakehouse implementation, data engineering and AI/ML projects with the Databricks platform. Case studies in major financial institutions and insurers.',
    color: '#FF3621',
    bgColor: '#1A0800'
  },
  {
    id: 'digibee',
    name: 'Digibee',
    logo: 'Digibee',
    level: 'Integration Partner',
    description: 'Integration platform as a service (iPaaS) to connect legacy and modern systems. Data flow and API automation at enterprise scale.',
    color: '#00D4AA',
    bgColor: '#001A14'
  },
  {
    id: 'google-cloud',
    name: 'Google Cloud',
    logo: 'Google Cloud',
    level: 'Strategic Partner',
    description: 'Data, analytics and AI projects with Google Cloud Platform. BigQuery, Vertex AI and cloud-native application modernization solutions.',
    color: '#4285F4',
    bgColor: '#001028'
  },
  {
    id: 'intel',
    name: 'Intel',
    logo: 'Intel',
    level: 'Technology Partner',
    description: 'Technology partnership for AI workload optimization, edge computing and high-performance infrastructure with Intel processors and platforms.',
    color: '#0071C5',
    bgColor: '#001028'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: 'Microsoft',
    level: 'Strategic Partner',
    description: 'Strategic partnership for Azure solutions, Microsoft 365, Copilot and workload modernization. Certifications in Azure Architecture, DevOps and AI/ML.',
    color: '#00A4EF',
    bgColor: '#001A2E'
  },
  {
    id: 'pega',
    name: 'Pega',
    logo: 'Pega',
    level: 'Consulting Partner',
    description: 'Implementation of intelligent automation, CRM and BPM solutions with Pega Platform. Low-code for digital transformation of complex processes.',
    color: '#FFFFFF',
    bgColor: '#1A1A1A'
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    logo: 'Snowflake',
    level: 'Select Partner',
    description: 'Data Cloud implementation for analytics, data sharing and data engineering. Modern data warehouse solutions and data governance at scale.',
    color: '#29B5E8',
    bgColor: '#001A28'
  },
]

export const alliances = alliancesPt

export function getAlliances(lang: Language): Alliance[] {
  return lang === 'en' ? alliancesEn : alliancesPt
}
