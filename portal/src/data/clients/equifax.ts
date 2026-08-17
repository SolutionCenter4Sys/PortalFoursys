import type { ClientConfig } from '../../types'
import type { Language } from '../../i18n/types'

export const equifaxClient: ClientConfig = {
  id: 'equifax',
  name: 'Equifax',
  colors: { primary: '#003087', accent: '#0057B7' },
  tagline: 'Dados, IA e segurança para decisões mais inteligentes',
  relationship: 'Parceiro em dados, analytics e governança de IA',
  yearsPartnership: 8,
  sections: [
    {
      id: 'client-opening',
      label: 'Foursys × Equifax',
      description: 'Parceria em dados e inteligência analítica',
      icon: 'handshake',
      component: 'client-opening',
    },
    {
      id: 'client-insights',
      label: 'Percepções Equifax',
      description: 'Oportunidades no ecossistema Equifax',
      icon: 'search',
      component: 'client-insights',
    },
    {
      id: 'client-cases',
      label: 'Cases na Equifax',
      description: 'Projetos e resultados entregues',
      icon: 'trophy',
      component: 'client-cases',
    },
  ],
  insights: [
    {
      id: 'data-fabric',
      title: 'Data Fabric — Arquitetura de Dados Unificada',
      description:
        'A Equifax processa bilhões de registros de crédito globalmente. No Brasil, a integração de dados de birôs, Cadastro Positivo, Open Finance e fontes alternativas exige uma arquitetura de dados unificada com ingestão em tempo real.',
      solution:
        'Data Lakehouse com camadas Bronze/Silver/Gold no Databricks. Ingestão em tempo real via Kafka, data quality automatizada e APIs de consumo padronizadas para cada produto de scoring.',
      icon: '📊',
    },
    {
      id: 'ml-scoring',
      title: 'Modelos de Scoring com IA Explicável',
      description:
        'Regulamentação do BACEN exige explicabilidade nos modelos de crédito. Modelos de ML precisam ser auditáveis, reproduzíveis e com monitoramento de drift — sem sacrificar a acurácia que diferencia a Equifax no mercado.',
      solution:
        'MLOps com pipelines reproduzíveis: feature store, versionamento de modelos, monitoramento de drift e SHAP/LIME para explicabilidade. Integração com frameworks regulatórios BACEN e conformidade LGPD.',
      icon: '🧠',
    },
    {
      id: 'cadastro-positivo',
      title: 'Cadastro Positivo e Open Finance',
      description:
        'Com a universalização do Cadastro Positivo e a evolução do Open Finance, a Equifax precisa enriquecer seus produtos de scoring com dados transacionais em tempo real — processando volumes massivos sem degradar latência.',
      solution:
        'Pipelines de enriquecimento de dados em streaming com processamento < 500ms. Integração com APIs Open Finance para ingestão de dados consentidos. Modelos de scoring enriquecidos com dados transacionais.',
      icon: '🔗',
    },
    {
      id: 'fraud-detection',
      title: 'Detecção de Fraude e Identidade Digital',
      description:
        'A Equifax atua em prevenção à fraude com soluções de verificação de identidade. O desafio é combinar velocidade (decisão em < 200ms), acurácia (< 0,01% falso negativo) e experiência do consumidor sem fricção.',
      solution:
        'Modelos de detecção de fraude em tempo real com ensemble de ML (gradient boosting + redes neurais). Device fingerprinting, análise comportamental e verificação biométrica integrados em orquestrador decisório.',
      icon: '🛡️',
    },
    {
      id: 'cloud-migration',
      title: 'Migração Cloud e Modernização',
      description:
        'A Equifax globalmente migrou para Google Cloud. No Brasil, a operação local precisa alinhar-se à estratégia global de cloud mantendo compliance com regulamentação local (dados em território nacional, LGPD, BACEN).',
      solution:
        'Estratégia de cloud híbrida com workloads sensíveis em nuvem soberana. Containerização com Kubernetes, IaC com Terraform e GitOps para consistência entre ambientes globais e locais.',
      icon: '☁️',
    },
    {
      id: 'lgpd-governance',
      title: 'LGPD e Governança de Dados Sensíveis',
      description:
        'Como processadora de dados creditícios de 150+ milhões de brasileiros, a Equifax precisa de governança impecável: catálogo de dados, linhagem, consentimento, anonimização e direito ao esquecimento — tudo auditável.',
      solution:
        'Plataforma de governança de dados com catálogo automatizado, linhagem end-to-end, gestão de consentimento e anonimização dinâmica. Dashboards de compliance LGPD para DPO com alertas em tempo real.',
      icon: '🔒',
    },
  ],
  cases: [
    {
      id: 'equifax-case-1',
      title: 'Em breve',
      sector: 'Dados & Analytics',
      type: 'Em configuração',
      challenge: 'Detalhes do case serão adicionados em breve.',
      solution: 'Informações em preparação.',
      stack: [],
      results: ['Case em preparação — entre em contato para detalhes'],
    },
  ],
}

const equifaxClientEn: ClientConfig = {
  id: 'equifax',
  name: 'Equifax',
  colors: { primary: '#003087', accent: '#0057B7' },
  tagline: 'Data, AI, and security for smarter decisions',
  relationship: 'Partner in data, analytics, and AI governance',
  yearsPartnership: 8,
  sections: [
    {
      id: 'client-opening',
      label: 'Foursys × Equifax',
      description: 'Partnership in data and analytical intelligence',
      icon: 'handshake',
      component: 'client-opening',
    },
    {
      id: 'client-insights',
      label: 'Equifax Insights',
      description: 'Opportunities in the Equifax ecosystem',
      icon: 'search',
      component: 'client-insights',
    },
    {
      id: 'client-cases',
      label: 'Equifax Cases',
      description: 'Projects and delivered results',
      icon: 'trophy',
      component: 'client-cases',
    },
  ],
  insights: [
    {
      id: 'data-fabric',
      title: 'Data Fabric — Unified Data Architecture',
      description:
        'Equifax processes billions of credit records globally. In Brazil, integrating data from credit bureaus, Cadastro Positivo, Open Finance, and alternative sources requires a unified data architecture with real-time ingestion.',
      solution:
        'Data Lakehouse with Bronze/Silver/Gold layers on Databricks. Real-time ingestion via Kafka, automated data quality, and standardized consumption APIs for each scoring product.',
      icon: '📊',
    },
    {
      id: 'ml-scoring',
      title: 'Scoring Models with Explainable AI',
      description:
        'BACEN regulations require explainability in credit models. ML models must be auditable, reproducible, and drift-monitored — without sacrificing the accuracy that differentiates Equifax in the market.',
      solution:
        'MLOps with reproducible pipelines: feature store, model versioning, drift monitoring, and SHAP/LIME for explainability. Integration with BACEN regulatory frameworks and LGPD compliance.',
      icon: '🧠',
    },
    {
      id: 'cadastro-positivo',
      title: 'Positive Credit Registry and Open Finance',
      description:
        'With the universalization of Cadastro Positivo and the evolution of Open Finance, Equifax needs to enrich its scoring products with real-time transactional data — processing massive volumes without degrading latency.',
      solution:
        'Streaming data enrichment pipelines with < 500ms processing. Integration with Open Finance APIs for consented data ingestion. Scoring models enriched with transactional data.',
      icon: '🔗',
    },
    {
      id: 'fraud-detection',
      title: 'Fraud Detection and Digital Identity',
      description:
        'Equifax operates in fraud prevention with identity verification solutions. The challenge is combining speed (< 200ms decision), accuracy (< 0.01% false negative), and frictionless consumer experience.',
      solution:
        'Real-time fraud detection models with ML ensemble (gradient boosting + neural networks). Device fingerprinting, behavioral analysis, and biometric verification integrated into a decision orchestrator.',
      icon: '🛡️',
    },
    {
      id: 'cloud-migration',
      title: 'Cloud Migration and Modernization',
      description:
        'Equifax globally migrated to Google Cloud. In Brazil, the local operation must align with the global cloud strategy while maintaining compliance with local regulations (data residency, LGPD, BACEN).',
      solution:
        'Hybrid cloud strategy with sensitive workloads on sovereign cloud. Containerization with Kubernetes, IaC with Terraform, and GitOps for consistency across global and local environments.',
      icon: '☁️',
    },
    {
      id: 'lgpd-governance',
      title: 'LGPD and Sensitive Data Governance',
      description:
        'As a processor of credit data for 150+ million Brazilians, Equifax needs impeccable governance: data catalog, lineage, consent, anonymization, and right to be forgotten — all auditable.',
      solution:
        'Data governance platform with automated catalog, end-to-end lineage, consent management, and dynamic anonymization. LGPD compliance dashboards for DPO with real-time alerts.',
      icon: '🔒',
    },
  ],
  cases: [
    {
      id: 'equifax-case-1',
      title: 'Coming Soon',
      sector: 'Data & Analytics',
      type: 'In Progress',
      challenge: 'Case details will be added soon.',
      solution: 'Information being prepared.',
      stack: [],
      results: ['Case in preparation — contact us for details'],
    },
  ],
}

export function getEquifaxClient(lang: Language = 'pt'): ClientConfig {
  return lang === 'en' ? equifaxClientEn : equifaxClient
}
