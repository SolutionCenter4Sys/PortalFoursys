import type { ClientConfig } from '../../types'

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
