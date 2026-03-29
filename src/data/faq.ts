import type { FAQItem } from '../types'

export const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Institucional',
    question: 'O que é a Foursys e qual é o diferencial dela?',
    answer: 'A Foursys é uma empresa de tecnologia com 26 anos de mercado, especializada em transformação digital para setores regulados. Nosso diferencial está na combinação de expertise técnica profunda, metodologia ágil consolidada com governança enterprise, e agentes de IA híbridos que aceleram a entrega de projetos complexos. 3,6% de turnover e 500K+ projetos entregues confirmam nossa consistência.',
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
    answer: 'Temos presença global: escritórios e projetos ativos no Brasil (São Paulo, como sede), nos Estados Unidos e na Europa. Atendemos clientes em mais de 12 países e temos capacidade de delivery remoto e presencial em múltiplas localidades.',
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
    answer: 'Nossa stack cobre toda a cadeia tecnológica: Cloud (AWS, Azure, Kubernetes), Frontend (React, Angular, React Native), Backend (Java/Spring Boot, Node.js, Python), Dados (Databricks, Spark, LLMs), Segurança (SAST, DAST, pentest, BACEN compliance) e DevOps (CI/CD, Quality IA). Temos mais de 200 profissionais certificados em diversas tecnologias.',
    sectionLink: 'capabilities',
    sectionLabel: 'Ver Capacidades Técnicas'
  },
  {
    id: 'faq-8',
    category: 'Tecnologia',
    question: 'O que é o Framework Quality IA e como ele funciona?',
    answer: 'Quality IA é nosso framework proprietário de automação inteligente de testes, já homologado pelo Santander para uso corporativo. Ele usa LLMs para gerar automaticamente casos de teste, identificar riscos de regressão e sugerir análises de impacto de mudança. Resultado prático: redução de 60% nos defeitos em produção e ciclos de release 3x mais rápidos.',
    sectionLink: 'quality-ia',
    sectionLabel: 'Ver Framework Quality IA'
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
    sectionLink: 'lab-ia',
    sectionLabel: 'Ver Lab IA'
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
    sectionLink: 'fourmakers',
    sectionLabel: 'Ver FourMakers'
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
