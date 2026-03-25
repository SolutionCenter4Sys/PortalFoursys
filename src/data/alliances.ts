import type { Alliance } from '../types'

export const alliances: Alliance[] = [
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
    id: 'aws',
    name: 'Amazon Web Services',
    logo: 'AWS',
    level: 'Select Consulting Partner',
    description: 'Parceria para projetos de cloud, dados, IA e modernização de infraestrutura. Certificações em arquitetura, desenvolvimento, machine learning e operações AWS.',
    color: '#FF9900',
    bgColor: '#1A1000'
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
    id: 'sap',
    name: 'SAP',
    logo: 'SAP',
    level: 'Enterprise Partner',
    description: 'Implementação, customização e suporte de soluções SAP para mercados regulados. Experiência em S/4HANA, BTP e integrações com ecossistemas legados.',
    color: '#0FAAFF',
    bgColor: '#001A2E'
  },
  {
    id: 'oracle',
    name: 'Oracle',
    logo: 'Oracle',
    level: 'Enterprise Partner',
    description: 'Projetos de banco de dados, ERP e cloud Oracle para grandes empresas. OCI (Oracle Cloud Infrastructure), Oracle DB e integrações enterprise de alto volume.',
    color: '#F80000',
    bgColor: '#200000'
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    logo: 'ServiceNow',
    level: 'Enterprise Partner',
    description: 'Implementação da plataforma ServiceNow para ITSM, HRSD e digitalização de fluxos de trabalho. Automação de processos e gestão de serviços em escala enterprise.',
    color: '#62D84E',
    bgColor: '#0A1A00'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    logo: 'Salesforce',
    level: 'Consulting Partner',
    description: 'Implementação e customização de Sales Cloud, Service Cloud e Marketing Cloud. Times certificados em Salesforce para o mercado financeiro e de seguros.',
    color: '#00A1E0',
    bgColor: '#001526'
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
]
