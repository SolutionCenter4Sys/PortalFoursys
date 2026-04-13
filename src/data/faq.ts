import type { FAQItem } from '../types'
import type { Language } from '../i18n/types'

const faqItemsPt: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Institucional',
    question: 'O que é a Foursys e qual é o diferencial dela?',
    answer: 'A Foursys é uma empresa de tecnologia com 26 anos de mercado, especializada em transformação digital para setores regulados. Nosso diferencial está na combinação de expertise técnica profunda, metodologia ágil consolidada com governança enterprise, e agentes de IA híbridos que aceleram a entrega de projetos complexos. 3,6% de turnover e 30K+ projetos entregues confirmam nossa consistência.',
    sectionLink: 'identity',
    sectionLabel: 'Ver Quem Somos'
  },
  {
    id: 'faq-2',
    category: 'Institucional',
    question: 'A Foursys tem experiência com bancos de grande porte?',
    answer: 'Sim. A Foursys tem 26 anos de atuação com os maiores bancos e seguradoras do Brasil e exterior. Nosso portfólio inclui projetos de core banking, modernização de sistemas legados, engenharia de dados, qualidade com IA e segurança cibernética — sempre em ambientes de missão crítica e setores regulados.',
    sectionLink: 'cases',
    sectionLabel: 'Ver Cases'
  },
  {
    id: 'faq-3',
    category: 'Institucional',
    question: 'A Foursys é uma empresa nacional ou tem presença global?',
    answer: 'Temos presença global com escritórios em 8 cidades: Barueri (sede), São Paulo (Paulista e Inovabra Habitat), Curitiba, Rio de Janeiro, Lisboa (Portugal), Boca Raton (EUA) e Tel Aviv (Israel). Atuamos em 4 regiões do globo com capacidade de delivery remoto e presencial.',
    sectionLink: 'global',
    sectionLabel: 'Ver Presença Global'
  },
  {
    id: 'faq-4',
    category: 'Serviços',
    question: 'Que tipos de serviços a Foursys oferece?',
    answer: 'Oferecemos 8 linhas de serviço principais: Modernização de Sistemas, Engenharia de Dados e IA, Desenvolvimento de Produtos Digitais, Cyber Security, Quality & Automation, Cloud & DevOps, Salesforce & CRM e o Fourblock (produtos em 30 dias). Cada linha tem equipes especializadas e metodologias próprias.',
    sectionLink: 'services',
    sectionLabel: 'Ver Linhas de Serviço'
  },
  {
    id: 'faq-5',
    category: 'Serviços',
    question: 'Como funciona a estrutura de delivery da Foursys?',
    answer: 'Trabalhamos com 4 modelos: (1) Projeto — escopo e prazo definidos; (2) Squad dedicado — equipe exclusiva por tempo determinado; (3) Alocação — profissionais integrados ao time do cliente; (4) Squad + Agentes IA — o nosso modelo mais avançado, onde profissionais são amplificados por agentes de IA, atingindo 3x a velocidade de entrega de um squad tradicional.',
    sectionLink: 'delivery',
    sectionLabel: 'Ver Estrutura de Delivery'
  },
  {
    id: 'faq-6',
    category: 'Serviços',
    question: 'O que é o Fourblock e como funciona?',
    answer: 'Fourblock é nosso modelo de entrega de produtos digitais em 30 dias. Usamos um catálogo de blocos pré-construídos (autenticação, dashboards, integrações, etc.) que são combinados e customizados para a necessidade específica do cliente. Isso reduz o tempo de desenvolvimento em até 70% sem comprometer qualidade ou governança.',
    sectionLink: 'services',
    sectionLabel: 'Ver Linhas de Serviço'
  },
  {
    id: 'faq-7',
    category: 'Tecnologia',
    question: 'Quais tecnologias a Foursys domina?',
    answer: 'Nossa stack cobre toda a cadeia tecnológica: Cloud (AWS, Azure, Kubernetes), Frontend (React, Angular, React Native), Backend (Java/Spring Boot, Node.js, Python), Dados (Databricks, Spark, LLMs), Segurança (SAST, DAST, pentest, BACEN compliance) e DevOps (CI/CD, Qualidade & Testes com IA). Temos mais de 200 profissionais certificados em diversas tecnologias.',
    sectionLink: 'capabilities',
    sectionLabel: 'Ver Capacidades Técnicas'
  },
  {
    id: 'faq-8',
    category: 'Tecnologia',
    question: 'O que é o Framework Qualidade & Testes com IA e como ele funciona?',
    answer: 'Qualidade & Testes com IA é nosso framework proprietário de automação inteligente de testes, já homologado pelo Santander para uso corporativo. Ele usa LLMs para gerar automaticamente casos de teste, identificar riscos de regressão e sugerir análises de impacto de mudança. Resultado prático: redução de 60% nos defeitos em produção e ciclos de release 3x mais rápidos.',
    sectionLink: 'quality-ia',
    sectionLabel: 'Ver Framework Qualidade & Testes com IA'
  },
  {
    id: 'faq-9',
    category: 'Tecnologia',
    question: 'Como a Foursys moderniza sistemas legados sem parar a operação?',
    answer: 'Usamos a abordagem SDD (Software Defined Delivery): modernização incremental, nunca big-bang rewrite. Identificamos os módulos de maior risco e valor, criamos uma camada de API, decompomos gradualmente em microserviços e migramos funcionalidades uma a uma — com a operação legada 100% ativa. O cliente nunca sente o corte.',
    sectionLink: 'services',
    sectionLabel: 'Ver Abordagem SDD'
  },
  {
    id: 'faq-10',
    category: 'Tecnologia',
    question: 'Como funciona o modelo de Agentes IA Híbridos?',
    answer: 'Agentes híbridos combinam a criatividade e julgamento humano com a velocidade e consistência da IA. Na prática: um analista humano define o objetivo, um agente de IA executa tarefas repetitivas (código boilerplate, testes, documentação, revisão de padrões) e o humano revisa e aprova. Isso multiplica a capacidade individual sem perder governança.',
    sectionLink: 'services',
    sectionLabel: 'Ver Linhas de Serviço'
  },
  {
    id: 'faq-11',
    category: 'Parceria',
    question: 'Quais são as alianças estratégicas da Foursys?',
    answer: 'Somos parceiros certificados de AWS, Databricks, Salesforce e Pega. Cada aliança nos dá acesso a treinamentos avançados, suporte técnico privilegiado, co-desenvolvimento de soluções e credenciais que aumentam a confiança do cliente na execução de projetos nas respectivas plataformas.',
    sectionLink: 'alliances',
    sectionLabel: 'Ver Alianças'
  },
  {
    id: 'faq-12',
    category: 'Parceria',
    question: 'O que é o FourMakers?',
    answer: 'FourMakers é nossa comunidade e programa de inovação que conecta clientes, parceiros e nossos profissionais para co-criar soluções e acelerar projetos inovadores. Realizamos eventos, hackathons e laboratórios de co-criação regularmente.',
    sectionLink: 'alliances',
    sectionLabel: 'Ver Alianças'
  },
  {
    id: 'faq-13',
    category: 'Santander',
    question: 'O que a Foursys já entregou para o Santander?',
    answer: 'Temos um histórico relevante com o Santander: Portal Imobiliário SHI (digitalização completa do portfólio imobiliário), Framework Quality IA (homologado e em uso corporativo), além de projetos em curso em áreas de modernização, dados e segurança. O Santander é um cliente estratégico para nós há mais de 15 anos.',
    sectionLink: 'shi-case',
    sectionLabel: 'Ver Case SHI'
  },
  {
    id: 'faq-14',
    category: 'Santander',
    question: 'Como a Foursys pode ajudar com as prioridades atuais do Santander?',
    answer: 'Identificamos 6 frentes críticas onde podemos atuar imediatamente: modernização de legado (SDD), qualidade e automação (Quality IA), engenharia de dados (Databricks), velocidade de entrega (Squad+IA), conformidade regulatória (Cyber Security BACEN) e inovação com IA (Lab Foursys). Podemos conversar sobre qual tem mais urgência para vocês.',
    sectionLink: 'santander-insights',
    sectionLabel: 'Ver Percepções Santander'
  },
  {
    id: 'faq-15',
    category: 'Comercial',
    question: 'Como é o processo de contratação da Foursys?',
    answer: 'O processo é simples e rápido: (1) Reunião de escopo — 1 hora para entender a necessidade; (2) Proposta técnica e comercial — em até 5 dias úteis; (3) Kickoff do projeto — em até 2 semanas após assinatura. Para o modelo de alocação, podemos disponibilizar profissionais em até 1 semana.',
    sectionLink: 'delivery',
    sectionLabel: 'Ver Modelos de Delivery'
  }
]

const faqItemsEn: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'About Us',
    question: 'What is Foursys and what sets it apart?',
    answer: 'Foursys is a technology company with 26 years of market experience, specializing in digital transformation for regulated industries. Our differentiator lies in the combination of deep technical expertise, consolidated agile methodology with enterprise governance, and hybrid AI agents that accelerate the delivery of complex projects. A 3.6% turnover rate and 30K+ delivered projects confirm our consistency.',
    sectionLink: 'identity',
    sectionLabel: 'See About Us'
  },
  {
    id: 'faq-2',
    category: 'About Us',
    question: 'Does Foursys have experience with major banks?',
    answer: 'Yes. Foursys has 26 years of experience working with the largest banks and insurance companies in Brazil and abroad. Our portfolio includes core banking projects, legacy system modernization, data engineering, AI-powered quality assurance, and cybersecurity — always in mission-critical environments and regulated industries.',
    sectionLink: 'cases',
    sectionLabel: 'See Case Studies'
  },
  {
    id: 'faq-3',
    category: 'About Us',
    question: 'Is Foursys a domestic company or does it have a global presence?',
    answer: 'We have a global presence with offices in 8 cities: Barueri (headquarters), São Paulo (Paulista and Inovabra Habitat), Curitiba, Rio de Janeiro, Lisbon (Portugal), Boca Raton (USA), and Tel Aviv (Israel). We operate across 4 global regions with both remote and on-site delivery capabilities.',
    sectionLink: 'global',
    sectionLabel: 'See Global Presence'
  },
  {
    id: 'faq-4',
    category: 'Services',
    question: 'What types of services does Foursys offer?',
    answer: 'We offer 8 main service lines: System Modernization, Data Engineering & AI, Digital Product Development, Cyber Security, Quality & Automation, Cloud & DevOps, Salesforce & CRM, and Fourblock (products in 30 days). Each line has dedicated teams and proprietary methodologies.',
    sectionLink: 'services',
    sectionLabel: 'See Service Lines'
  },
  {
    id: 'faq-5',
    category: 'Services',
    question: 'How does Foursys\'s delivery structure work?',
    answer: 'We work with 4 models: (1) Project — defined scope and timeline; (2) Dedicated Squad — an exclusive team for a set period; (3) Staff Augmentation — professionals integrated into the client\'s team; (4) Squad + AI Agents — our most advanced model, where professionals are amplified by AI agents, achieving 3x the delivery speed of a traditional squad.',
    sectionLink: 'delivery',
    sectionLabel: 'See Delivery Structure'
  },
  {
    id: 'faq-6',
    category: 'Services',
    question: 'What is Fourblock and how does it work?',
    answer: 'Fourblock is our model for delivering digital products in 30 days. We use a catalog of pre-built blocks (authentication, dashboards, integrations, etc.) that are combined and customized to the client\'s specific needs. This reduces development time by up to 70% without compromising quality or governance.',
    sectionLink: 'services',
    sectionLabel: 'See Service Lines'
  },
  {
    id: 'faq-7',
    category: 'Technology',
    question: 'What technologies does Foursys specialize in?',
    answer: 'Our stack covers the entire technology chain: Cloud (AWS, Azure, Kubernetes), Frontend (React, Angular, React Native), Backend (Java/Spring Boot, Node.js, Python), Data (Databricks, Spark, LLMs), Security (SAST, DAST, pentesting, BACEN compliance), and DevOps (CI/CD, AI-Powered Quality & Testing). We have over 200 professionals certified in various technologies.',
    sectionLink: 'capabilities',
    sectionLabel: 'See Technical Capabilities'
  },
  {
    id: 'faq-8',
    category: 'Technology',
    question: 'What is the AI-Powered Quality & Testing Framework and how does it work?',
    answer: 'AI-Powered Quality & Testing is our proprietary intelligent test automation framework, already approved by Santander for corporate use. It uses LLMs to automatically generate test cases, identify regression risks, and suggest change impact analyses. Practical results: 60% reduction in production defects and 3x faster release cycles.',
    sectionLink: 'quality-ia',
    sectionLabel: 'See AI-Powered Quality & Testing Framework'
  },
  {
    id: 'faq-9',
    category: 'Technology',
    question: 'How does Foursys modernize legacy systems without halting operations?',
    answer: 'We use the SDD (Software Defined Delivery) approach: incremental modernization, never big-bang rewrite. We identify the highest-risk and highest-value modules, create an API layer, gradually decompose into microservices, and migrate functionalities one by one — with the legacy operation 100% active. The client never experiences downtime.',
    sectionLink: 'services',
    sectionLabel: 'See SDD Approach'
  },
  {
    id: 'faq-10',
    category: 'Technology',
    question: 'How do Hybrid AI Agents work?',
    answer: 'Hybrid agents combine human creativity and judgment with AI speed and consistency. In practice: a human analyst defines the objective, an AI agent performs repetitive tasks (boilerplate code, testing, documentation, standards review), and the human reviews and approves. This multiplies individual capacity without sacrificing governance.',
    sectionLink: 'services',
    sectionLabel: 'See Service Lines'
  },
  {
    id: 'faq-11',
    category: 'Partnerships',
    question: 'What are Foursys\'s strategic alliances?',
    answer: 'We are certified partners of AWS, Databricks, Salesforce, and Pega. Each alliance gives us access to advanced training, privileged technical support, solution co-development, and credentials that increase client confidence in project execution on their respective platforms.',
    sectionLink: 'alliances',
    sectionLabel: 'See Alliances'
  },
  {
    id: 'faq-12',
    category: 'Partnerships',
    question: 'What is FourMakers?',
    answer: 'FourMakers is our community and innovation program that connects clients, partners, and our professionals to co-create solutions and accelerate innovative projects. We regularly host events, hackathons, and co-creation labs.',
    sectionLink: 'alliances',
    sectionLabel: 'See Alliances'
  },
  {
    id: 'faq-13',
    category: 'Santander',
    question: 'What has Foursys delivered for Santander?',
    answer: 'We have a significant track record with Santander: the SHI Real Estate Portal (complete digitalization of the real estate portfolio), the Quality AI Framework (approved and in corporate use), as well as ongoing projects in modernization, data, and security. Santander has been a strategic client for over 15 years.',
    sectionLink: 'shi-case',
    sectionLabel: 'See SHI Case Study'
  },
  {
    id: 'faq-14',
    category: 'Santander',
    question: 'How can Foursys help with Santander\'s current priorities?',
    answer: 'We have identified 6 critical areas where we can act immediately: legacy modernization (SDD), quality and automation (Quality AI), data engineering (Databricks), delivery speed (Squad+AI), regulatory compliance (Cyber Security BACEN), and AI innovation (Foursys Lab). We can discuss which one is most urgent for you.',
    sectionLink: 'santander-insights',
    sectionLabel: 'See Santander Insights'
  },
  {
    id: 'faq-15',
    category: 'Sales',
    question: 'What is Foursys\'s engagement process?',
    answer: 'The process is simple and fast: (1) Scoping meeting — 1 hour to understand the need; (2) Technical and commercial proposal — within 5 business days; (3) Project kickoff — within 2 weeks after signing. For staff augmentation, we can make professionals available within 1 week.',
    sectionLink: 'delivery',
    sectionLabel: 'See Delivery Models'
  }
]

export const faqItems = faqItemsPt

export function getFaqItems(lang: Language): FAQItem[] {
  return lang === 'en' ? faqItemsEn : faqItemsPt
}
