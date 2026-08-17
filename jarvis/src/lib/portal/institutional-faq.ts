/**
 * FAQ institucional do PortalFoursys — lookup local (sem Redis / sem RAG / sem LLM).
 * Fonte espelhada de PortalFoursys/src/data/faq.ts + KPIs/timeline.
 * Hit → voz responde em ~STT+TTS (pula embed+pgvector+Gemini).
 */

export type InstitutionalFaqItem = {
  id: string;
  question: string;
  /** Frases alternativas que o usuário pode falar */
  aliases: string[];
  answer: string;
};

const STOP = new Set([
  "a",
  "o",
  "os",
  "as",
  "de",
  "da",
  "do",
  "das",
  "dos",
  "e",
  "é",
  "em",
  "um",
  "uma",
  "para",
  "por",
  "com",
  "que",
  "qual",
  "quais",
  "como",
  "onde",
  "quando",
  "seu",
  "sua",
  "me",
  "te",
  "se",
  "na",
  "no",
  "nos",
  "nas",
  "ao",
  "à",
  "já",
  "tem",
  "têm",
  "ser",
  "são",
  "foi",
  "foursys",
  "empresa",
  "sobre",
  "fala",
  "conte",
  "diz",
  "explique",
]);

export const INSTITUTIONAL_FAQ: InstitutionalFaqItem[] = [
  {
    id: "faq-1",
    question: "O que é a Foursys e qual é o diferencial dela?",
    aliases: [
      "o que é a foursys",
      "quem é a foursys",
      "o que faz a foursys",
      "diferencial da foursys",
      "apresente a foursys",
      "fale da foursys",
    ],
    answer:
      "A Foursys é uma empresa de tecnologia com 26 anos de mercado, especializada em transformação digital para setores regulados. O diferencial combina expertise técnica, metodologia ágil com governança enterprise e agentes de IA híbridos. São 4% de turnover e mais de 30 mil projetos entregues.",
  },
  {
    id: "faq-2",
    question: "A Foursys tem experiência com bancos de grande porte?",
    aliases: [
      "experiência com bancos",
      "atende bancos",
      "setor financeiro",
      "bancos e seguradoras",
      "mercado financeiro",
    ],
    answer:
      "Sim. A Foursys tem 26 anos com os maiores bancos e seguradoras do Brasil e exterior: core banking, modernização de legado, dados, qualidade com IA e cibersegurança em ambientes de missão crítica.",
  },
  {
    id: "faq-3",
    question: "A Foursys é uma empresa nacional ou tem presença global?",
    aliases: [
      "presença global",
      "escritórios",
      "onde fica a foursys",
      "localidades",
      "filiais",
      "internacional",
      "expansão",
      "expansao",
      "roadmap",
      "futuro",
      "china",
      "xangai",
      "dubai",
      "emirados",
      "oriente médio",
    ],
    answer:
      "Hoje somos 8 localidades em 4 regiões operacionais: Barueri, São Paulo, Curitiba, Rio, Belo Horizonte, Boca Raton nos Estados Unidos, Lisboa em Portugal e, desde 2026, o novo hub em Tel Aviv, Israel. No roadmap de expansão temos ainda Xangai, na China, previsto para 2027, e Dubai, nos Emirados Árabes, previsto para 2028 — levando a Foursys também para Ásia e Oriente Médio.",
  },
  {
    id: "faq-4",
    question: "Que tipos de serviços a Foursys oferece?",
    aliases: [
      "linhas de serviço",
      "portfólio de serviços",
      "quais serviços oferece",
    ],
    answer:
      "As oito linhas de serviço vão de Modernização de Legados e Cloud com FinOps até Cibersegurança, Dados e Analytics, Qualidade e Testes com IA e Sustentação. E em 2026 organizamos tudo num portfólio de seis eixos de valor, ancorado em IA aplicada — com o Foursys Nexus, nosso sistema operacional cognitivo, como plataforma central. Posso detalhar os eixos, o Nexus ou uma linha específica.",
  },
  {
    id: "faq-5",
    question: "Como funciona a estrutura de delivery da Foursys?",
    aliases: [
      "modelo de delivery",
      "squad",
      "alocação",
      "como entrega",
      "modelos de contratação delivery",
    ],
    answer:
      "Quatro modelos: projeto com escopo e prazo; squad dedicado; alocação de profissionais; e squad mais agentes de IA, que chega a cerca de 3 vezes a velocidade de um squad tradicional.",
  },
  {
    id: "faq-6",
    question: "O que é o FourBlox e como funciona?",
    aliases: [
      "fourblox",
      "four blox",
      "fourblock",
      "produto em 30 dias",
      "blocos pré-construídos",
      "blocos modulares",
      "soluções modulares",
    ],
    answer:
      "FourBlox é o nosso portfólio de 18 e mais soluções modulares em 9 categorias de negócio — de gestão de pessoas a governança —, entregues em até 30 dias por modelo de assinatura. Combina blocos pré-construídos (autenticação, dashboards, integrações) que aceleram o desenvolvimento em até 70% sem perder governança.",
  },
  {
    id: "faq-7",
    question: "Quais tecnologias a Foursys domina?",
    aliases: [
      "stack",
      "tecnologias",
      "tecnologia",
      "capacidades técnicas",
      "o que usa",
    ],
    answer:
      "Cloud AWS e Azure com Kubernetes; frontend React, Angular e React Native; backend Java Spring, Node e Python; dados com Databricks, Spark e LLMs; segurança SAST, DAST e BACEN; DevOps e qualidade com IA. Mais de 200 profissionais certificados.",
  },
  {
    id: "faq-8",
    question: "O que é o Framework Qualidade e Testes com IA?",
    aliases: [
      "qualidade com ia",
      "quality ia",
      "testes com ia",
      "framework de testes",
      "automação de testes",
    ],
    answer:
      "Framework proprietário de automação inteligente de testes, homologado pelo Santander. Usa LLMs para gerar casos, riscos de regressão e impacto de mudança. Resultado: cerca de 60% menos defeitos em produção e releases até 3 vezes mais rápidos.",
  },
  {
    id: "faq-9",
    question: "Como a Foursys moderniza sistemas legados sem parar a operação?",
    aliases: [
      "modernização",
      "legado",
      "sdd",
      "software defined delivery",
      "modernizar sistemas",
    ],
    answer:
      "Abordagem SDD: modernização incremental, nunca big-bang. API layer, decomposição em microserviços e migração módulo a módulo com o legado 100% ativo.",
  },
  {
    id: "faq-10",
    question: "Como funciona o modelo de Agentes IA Híbridos?",
    aliases: [
      "agentes ia",
      "agentes híbridos",
      "ia híbrida",
      "squad com ia",
    ],
    answer:
      "Humano define o objetivo; agente executa tarefas repetitivas — boilerplate, testes, documentação, padrões; humano revisa e aprova. Multiplica capacidade sem perder governança.",
  },
  {
    id: "faq-11",
    question: "Quais são as alianças estratégicas da Foursys?",
    aliases: [
      "alianças",
      "parceiros",
      "parcerias",
      "aws",
      "databricks",
      "salesforce",
      "pega",
    ],
    answer:
      "Parceiros certificados de AWS, Databricks, Salesforce e Pega — com treinamentos, suporte privilegiado e co-desenvolvimento.",
  },
  {
    id: "faq-12",
    question: "O que é o FourMakers?",
    aliases: ["fourmakers", "four makers", "comunidade de inovação"],
    answer:
      "FourMakers é a comunidade e programa de inovação que conecta clientes, parceiros e profissionais para co-criar soluções — eventos, hackathons e labs.",
  },
  {
    id: "faq-nexus",
    question: "O que é o Foursys Nexus?",
    aliases: [
      "foursys nexus",
      "o que é o nexus",
      "nexus",
      "sistema operacional cognitivo",
      "plataforma de agentes",
      "o que era o kiam",
      "kiam",
    ],
    answer:
      "Foursys Nexus é o nosso sistema operacional cognitivo entregue como SaaS. Numa única plataforma a empresa cria, orquestra e governa agentes autônomos, fluxos agênticos e skills, em ambiente multi-cloud e multi-modelo. O diferencial é que governança não é um plugin, é o núcleo do produto — e qualquer usuário da empresa constrói, sem precisar de um time de engenharia dedicado como exigem os toolkits de hyperscaler.",
  },
  {
    id: "faq-portfolio",
    question: "Como está organizado o portfólio da Foursys?",
    aliases: [
      "portfólio da foursys",
      "seis eixos",
      "6 eixos",
      "eixos de valor",
      "portfólio 2026",
      "ofertas do portfólio",
      "como se organiza o portfólio",
    ],
    answer:
      "O portfólio de 2026 se organiza em seis eixos de valor: dois de diferenciação, que abrem a conversa no nível certo — Inovação e Estratégia, e IA Estratégica e Governança —, e quatro de capacidade, que sustentam a entrega — Engenharia e Modernização por IA, Inteligência de Dados e Decisão, Cloud e FinOps com o SharpOps, e Cibersegurança com a Zeragon. São doze ofertas ativas ancoradas em IA aplicada à transformação de negócios.",
  },
  {
    id: "faq-zeragon",
    question: "O que é a Zeragon?",
    aliases: [
      "zeragon",
      "empresa de cibersegurança do grupo",
      "cibersegurança zeragon",
    ],
    answer:
      "Zeragon é a empresa de cibersegurança do grupo Foursys, que conduz o eixo de segurança do portfólio. A tese é segurança como pré-condição da transformação e da governança de IA — não como barreira depois. Ela sustenta as ofertas de cyber ao lado dos ativos transversais Foursys Nexus e Fusion Teams.",
  },
  {
    id: "faq-13",
    question: "O que a Foursys já entregou para o Santander?",
    aliases: [
      "santander",
      "case santander",
      "shi",
      "portal imobiliário",
      "cnpj alfanumérico",
      "cobol santander",
      "quality ia santander",
      "spb",
    ],
    answer:
      "Parceria ininterrupta desde 2009, mais de 17 anos, em core banking, cartões, meios de pagamento, risco, mainframe e antifraude. Entre os destaques: o Portal Imobiliário SHI cortou a consulta de portfólio de 3 dias para 10 minutos; modernizamos 450 mil linhas de COBOL para .NET Core com aproximadamente 4 vezes mais capacidade transacional; adequamos o legado COBOL ao CNPJ alfanumérico ajustando 1.915 programas em compliance com a Nota Técnica 49 de 2024; automatizamos a liquidação do SPB de reserva bancária; entregamos QA em consórcio com 65% menos tempo de execução e 200 scripts automatizados; e operamos uma alocação multinacional com mais de 700 profissionais em 6 países, turnover de 4,26% e eNPS 92%. O nosso Framework Quality IA foi homologado pelo próprio banco.",
  },
  {
    id: "faq-14",
    question: "Quais setores ou verticais a Foursys atende?",
    aliases: [
      "setores",
      "verticais",
      "indústrias que atende",
      "mercados",
      "segmentos",
      "quais mercados",
      "onde atua",
      "áreas de atuação",
    ],
    answer:
      "Atendemos cinco verticais com cases entregues — Financeiro, Seguros, Saúde, Indústria e Farma, e Varejo — e temos dois em construção no roadmap 2026-2027: Agronegócio e Utilities. A base histórica é Financeiro desde 2000, e o acervo total tem mais de 200 cases em 13 setores, entre eles serviços, cosméticos, esporte, energia, turismo e educação.",
  },
  {
    id: "faq-case-saude",
    question: "A Foursys tem cases em saúde?",
    aliases: [
      "case saúde",
      "cases em saúde",
      "hospital",
      "healthcare",
      "einstein",
      "hiae",
      "hospital israelita",
      "unimed",
      "healthtech",
      "operadora de saúde",
      "clínica",
      "clinica",
    ],
    answer:
      "Sim, saúde é um dos nossos verticais fortes. Entregamos oito cases só em cases estruturados: no Hospital Albert Einstein e HIAE fizemos a plataforma Predicta Genética, telereabilitação digital, o squad Cockpit e indicadores e KPIs do app Conecta com mais 20% de eficiência operacional e mais 20% de retenção. Na Siemens Healthineers construímos o eHealth Patient Portal com interoperabilidade FHIR. E em uma operadora de saúde nacional desbloqueamos 100 projetos em 12 meses. Além disso, temos mais de 20 cases de referência em saúde no acervo.",
  },
  {
    id: "faq-case-seguros",
    question: "A Foursys tem cases em seguros?",
    aliases: [
      "case seguros",
      "cases em seguros",
      "seguradora",
      "sinistro",
      "bradesco seguros",
      "hdi",
      "sias",
      "pega seguros",
      "vida em grupo",
      "corretor",
    ],
    answer:
      "Sim. Na Bradesco Seguros construímos três fluxos PEGA — faturamento digital de vida em grupo, assistência pessoa chave e seguro micro-empresa — e a plataforma Databricks com CRM Analytics que atingiu 98% de aderência aos SLAs de TI. Na HDI Seguros entregamos o app do corretor. Em uma seguradora de vida (SIAS) convertemos 1,6 milhão de linhas de código de legado. E em automação de sinistros para instituição financeira reduzimos 70% em etapas críticas.",
  },
  {
    id: "faq-case-varejo",
    question: "A Foursys tem cases em varejo?",
    aliases: [
      "case varejo",
      "cases em varejo",
      "retail",
      "gpa",
      "groupé casino",
      "grupo pão de açúcar",
      "mercado eletrônico",
      "e-commerce",
    ],
    answer:
      "Sim. No Groupé Casino (GPA) executamos 75% da migração cloud em 8 meses. No Mercado Eletrônico automatizamos 22 processos com RPA e IA. E em uma rede de varejo nacional o projeto de dados reduziu 40% da ruptura de estoque.",
  },
  {
    id: "faq-case-industria",
    question: "A Foursys tem cases em indústria ou farma?",
    aliases: [
      "case indústria",
      "cases em indústria",
      "farmacêutica",
      "farma",
      "profarma",
      "sesi",
      "indústria",
      "manufatura",
      "laboratório",
    ],
    answer:
      "Sim. Em uma indústria farmacêutica entregamos +82% de previsibilidade de entrega com transformação ágil. No SESI fizemos a migração cloud educacional com 99,9% de disponibilidade. E temos iniciativas de dados e integração na Profarma. Além dos cases estruturados, há mais entradas em indústria e farmacêutica no acervo de referência.",
  },
  {
    id: "faq-case-caixa",
    question: "A Foursys tem case na Caixa?",
    aliases: [
      "caixa",
      "cef",
      "caixa econômica",
      "case caixa",
      "banco estatal",
      "caixa econômica federal",
    ],
    answer:
      "Sim. Conduzimos um programa completo de transformação ágil na Caixa Econômica Federal, um dos raros casos de agilidade em banco estatal no Brasil, com escala e governança compatíveis com a criticidade da operação.",
  },
  {
    id: "faq-case-mufg",
    question: "A Foursys tem case no MUFG?",
    aliases: [
      "mufg",
      "case mufg",
      "auditoria banco",
      "banco de investimento",
      "cobit",
      "iso 27001",
      "banco japonês",
    ],
    answer:
      "Sim. No MUFG resolvemos mais de 100 apontamentos de auditoria de TI e Segurança da Informação com uma squad multidisciplinar, com base em COBIT 2019, ISO 27001 e NIST. Resultado: 60% de redução no backlog, 40% de aumento no fechamento mensal e 30% menos reincidência de não conformidades críticas.",
  },
  {
    id: "faq-case-sicredi",
    question: "A Foursys tem case no Sicredi?",
    aliases: [
      "sicredi",
      "case sicredi",
      "open finance",
      "bfm",
      "cooperativa de crédito",
      "organizador financeiro",
    ],
    answer:
      "Sim. No Sicredi construímos o primeiro BFM (Business Financial Management) do Brasil e conduzimos a modernização de sistemas com redução de 30% no esforço via IA.",
  },
  {
    id: "faq-case-bvs",
    question: "A Foursys tem case na Boa Vista Serviços?",
    aliases: [
      "boa vista",
      "bvs",
      "boa vista serviços",
      "cadastro positivo",
      "case boa vista",
      "radar bvs",
      "app boa vista",
    ],
    answer:
      "Sim, é um dos nossos clientes de longo prazo. Fizemos a revisão de arquitetura multi-cloud, o app do Cadastro Positivo que virou número 1 na loja, a reconstrução do motor Radar migrando de AS400 para GCP com 60% menos acessos ao AS400, e um squad ágil de evolução do app do consumidor com 30% mais agilidade nas entregas.",
  },
  {
    id: "faq-case-einstein",
    question: "A Foursys tem case no Einstein?",
    aliases: [
      "einstein",
      "case einstein",
      "hospital albert einstein",
      "albert einstein",
      "hiae",
      "app conecta",
      "predicta",
      "cockpit einstein",
      "telereabilitação",
    ],
    answer:
      "Sim, o Hospital Albert Einstein é referência no nosso portfólio de saúde. Construímos a plataforma Predicta Genética, a solução de telereabilitação digital, o squad Cockpit que zerou o backlog priorizado, e os indicadores e KPIs do app Conecta com 20% mais eficiência operacional e 20% mais retenção de usuários.",
  },
  {
    id: "faq-awards",
    question: "Quais prêmios e reconhecimentos a Foursys já recebeu?",
    aliases: [
      "prêmios",
      "premios",
      "reconhecimentos",
      "awards",
      "gptw",
      "great place to work",
      "iso",
      "certificações",
      "certificacoes",
      "iso 9001",
      "iso 27001",
      "iso 27701",
      "iso 14001",
      "agilidade brasil",
      "prêmio agilidade",
      "100 open startups",
      "open startups",
      "colaborar para inovar",
      "saúde emocional",
      "jungle",
      "prêmios que ganhou",
      "certificações que tem",
      "conquistas",
      "troféus",
      "trofeus",
    ],
    answer:
      "Somos Great Place to Work em 2023, 2024 e 2025, com 4% de turnover que é referência no setor de tecnologia. Ganhamos o Prêmio Agilidade Brasil em 2024 e 2025 pela excelência em práticas ágeis e transformação organizacional; entramos no ranking 100 Open Startups em 2023 e 2024 em inovação aberta corporativa; e recebemos o Colaborar para Inovar em 2020, 2022, 2023 e 2024 pela parceria estratégica e co-criação com clientes. Também tivemos o Destaque Saúde Emocional da Jungle em 2022 pelo cuidado com o bem-estar dos colaboradores. Em certificações, somos ISO 9001 (Gestão da Qualidade), ISO 27001 (Segurança da Informação), ISO 27701 (Privacidade) e ISO 14001 (Gestão Ambiental).",
  },
  {
    id: "faq-case-bradesco-seguros",
    question: "A Foursys tem case na Bradesco Seguros?",
    aliases: [
      "bradesco seguros",
      "case bradesco seguros",
      "pega bradesco",
      "vida em grupo bradesco",
      "databricks bradesco",
      "crm analytics bradesco",
    ],
    answer:
      "Sim, quatro cases estruturados. Em PEGA entregamos três fluxos ponta a ponta — faturamento digital de vida em grupo, assistência pessoa chave e seguro micro-empresa. Em dados construímos a plataforma Databricks integrada ao CRM Analytics, alcançando 98% de aderência aos SLAs de TI da seguradora.",
  },
  {
    id: "faq-15",
    question: "Como é o processo de contratação da Foursys?",
    aliases: [
      "contratação",
      "como contratar",
      "proposta comercial",
      "kickoff",
      "como começar",
    ],
    answer:
      "Escopo em cerca de 1 hora; proposta técnica e comercial em até 5 dias úteis; kickoff em até 2 semanas após assinatura. Alocação pode liberar profissionais em até 1 semana.",
  },
  {
    id: "kpi-timeline",
    question: "Qual a trajetória ou história da Foursys?",
    aliases: [
      "trajetória",
      "história",
      "linha do tempo",
      "timeline",
      "fundação",
      "quando foi fundada",
      "desde quando",
      "anos de mercado",
      "marcos",
      "expansão",
      "expansao",
      "roadmap",
      "futuro",
      "china",
      "xangai",
      "dubai",
      "emirados",
    ],
    answer:
      "Fundada em 2000 em São Paulo no mercado financeiro. Em 2005 já no top-10 bancos; 2010 pioneira em agilidade; 2018 EUA; 2023 Lisboa; 2024 IA generativa e cyber em escala; 2026 agentes especialistas e hub em Tel Aviv, Israel. No roadmap declarado, estão previstos os hubs de Xangai, na China, em 2027, e Dubai, nos Emirados Árabes, em 2028. São 26 anos, 30 mil projetos e cerca de 2,8 mil colaboradores.",
  },
  {
    id: "kpi-numbers",
    question: "Quais são os números principais da Foursys?",
    aliases: [
      "números",
      "kpis",
      "quantos projetos",
      "quantos colaboradores",
      "turnover",
      "quantos clientes",
    ],
    answer:
      "26 anos de mercado, mais de 30 mil projetos, 150 mais clientes, 8 localidades em 4 regiões, turnover de 4% e cerca de 2,8 mil colaboradores.",
  },
  {
    id: "faq-who",
    question: "Quem somos?",
    aliases: [
      "quem somos",
      "missão",
      "visão",
      "valores",
      "posicionamento",
      "por que a foursys",
      "diferenciais",
    ],
    answer:
      "Somos a Foursys: 26 anos em transformação digital para setores regulados. Combinamos entrega enterprise, baixo turnover e agentes de IA híbridos. No Portal isso aparece em Quem Somos e Por que a Foursys.",
  },
  {
    id: "faq-ai-squad",
    question: "O que é o AI Squad da Foursys?",
    aliases: [
      "ai squad",
      "squad com agentes de ia",
      "time humano mais ia",
      "squad aumentado por ia",
    ],
    answer:
      "É um time humano amplificado por mais de 20 agentes de IA especializados em cada fase, sobre o nosso framework SDD e com governança enterprise. Na prática dá 80% de ganho de produtividade, 65% menos lead time e 70% menos retrabalho, com o código aberto pro cliente evoluir sem lock-in.",
  },
  {
    id: "faq-dados",
    question: "O que a Foursys faz em Dados e Analytics?",
    aliases: [
      "dados e analytics",
      "engenharia de dados",
      "databricks",
      "data lakehouse",
      "business intelligence",
    ],
    answer:
      "Construímos plataformas de dados modernas com Databricks e lakehouse, analytics em tempo real, data mesh e MLOps, com governança desde a origem. Os cases chegam a 280% de ROI no primeiro ano e transformam relatórios de 3 dias em consulta instantânea.",
  },
  {
    id: "faq-cyber",
    question: "Como funciona a cibersegurança da Foursys?",
    aliases: [
      "cibersegurança",
      "segurança da informação",
      "cyber security",
      "compliance e segurança",
    ],
    answer:
      "Segurança como atributo, não como barreira, embarcada no time de desenvolvimento e pensada para ambientes regulados, LGPD, BACEN e PCI-DSS. Reduz em torno de 80% das vulnerabilidades e 60% do tempo de resposta a incidentes, com monitoramento contínuo.",
  },
  {
    id: "faq-modernizacao-num",
    question: "Quais os ganhos de modernizar legado com a Foursys?",
    aliases: [
      "resultado da modernização",
      "ganhos de modernização",
      "aceleradores 4ai",
      "modernizar cobol",
    ],
    answer:
      "Com os aceleradores 4AI e ciclos de 6 semanas, a modernização entrega cerca de 30% de redução de custo, 70% de aceleração no time-to-market e 60% mais segurança de código. E é incremental, sem big-bang: o legado segue 100% ativo durante a migração.",
  },
  {
    id: "faq-nav",
    question: "O que tem neste Portal?",
    aliases: [
      "o que tem no portal",
      "como navegar",
      "quais seções",
      "me guia no portal",
      "mapa do portal",
    ],
    answer:
      "Este Portal mostra a Foursys de ponta a ponta: Quem Somos, Presença Global, Trajetória, Linhas de Serviço, Delivery, Alianças, Inovação, cases e FAQ. Diz o tema que eu te levo na conversa.",
  },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text: string): Set<string> {
  const out = new Set<string>();
  for (const t of normalize(text).split(" ")) {
    if (t.length < 3 || STOP.has(t)) continue;
    out.add(t);
  }
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  return inter / (a.size + b.size - inter);
}

export type InstitutionalFaqHit = {
  id: string;
  answer: string;
  score: number;
  question: string;
  /** Como o match aconteceu: exato (substring), jaccard (lexical), semantic (cosine). */
  path?: "exact" | "jaccard" | "semantic";
};

// ─── Match semântico (cosine) — Dia 3 ────────────────────────────────────────
//
// Vetores pré-computados em build time (scripts/build-faq-embeddings.ts).
// 1 vetor por item (question + aliases). Escaneia in-memory: 24 dot products
// ~ <5ms. Se o JSON não existir (script não rodado), semantic vira no-op e
// fica só o Jaccard (compatibilidade).

type FaqEmbeddingRow = { id: string; dims: number; vector: number[] };
let _embeddings: FaqEmbeddingRow[] | null | undefined; // undefined = ainda não tentei carregar

function loadEmbeddings(): FaqEmbeddingRow[] | null {
  if (_embeddings !== undefined) return _embeddings;
  try {
    // require dinâmico p/ evitar erro se o JSON não existir na build inicial.
    // Ao editar o FAQ, rode `npm run build:faq-embeddings` para regenerar.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const raw = require("./institutional-faq.embeddings.json") as FaqEmbeddingRow[];
    _embeddings = Array.isArray(raw) ? raw : null;
  } catch {
    _embeddings = null;
  }
  return _embeddings;
}

function dot(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let d = 0;
  for (let i = 0; i < a.length; i++) d += a[i] * b[i];
  return d;
}

/**
 * Match por similaridade cosine com o queryEmbedding pré-computado no route.
 * O queryEmbedding DEVE estar normalizado (vetor unitário) — o script offline
 * grava normalizado, e o `precomputeQueryEmbedding` também normaliza.
 *
 * Threshold default 0.82 — calibrado para pt-BR embeddings-001. Sobe para 0.85
 * se aparecerem falsos positivos; baixa para 0.78 se muitos misses.
 */
export function matchInstitutionalFaqSemantic(
  queryEmbedding: number[] | null | undefined,
  minScore = Number.parseFloat(
    process.env.PORTAL_FAQ_SEMANTIC_MIN_SCORE ?? "0.82",
  ) || 0.82,
): InstitutionalFaqHit | null {
  if (!queryEmbedding || queryEmbedding.length === 0) return null;
  const rows = loadEmbeddings();
  if (!rows || rows.length === 0) return null;

  let bestId: string | null = null;
  let bestScore = 0;
  for (const row of rows) {
    if (row.vector.length !== queryEmbedding.length) continue;
    const s = dot(queryEmbedding, row.vector);
    if (s >= minScore && s > bestScore) {
      bestScore = s;
      bestId = row.id;
    }
  }
  if (!bestId) return null;

  const item = INSTITUTIONAL_FAQ.find((it) => it.id === bestId);
  if (!item) return null;

  return {
    id: item.id,
    answer: item.answer,
    score: bestScore,
    question: item.question,
    path: "semantic",
  };
}

/**
 * Match lexical rápido (sem embed). Threshold default 0.42.
 * Alias exact / substring → score 1.
 */
export function matchInstitutionalFaq(
  transcript: string,
  minScore = Number.parseFloat(process.env.PORTAL_FAQ_MIN_SCORE ?? "0.6") ||
    0.6,
): InstitutionalFaqHit | null {
  const q = normalize(transcript);
  if (q.length < 8) return null;
  const qTokens = tokens(q);
  let best: InstitutionalFaqHit | null = null;

  for (const item of INSTITUTIONAL_FAQ) {
    const phrases = [item.question, ...item.aliases].map(normalize);
    for (const p of phrases) {
      // Exact = sempre. Substring só com frase específica (≥14 chars) — evita
      // que 1 palavra genérica ("serviços") force resposta canned sem raciocínio.
      const substringOk = p.length >= 14 && (q.includes(p) || p.includes(q));
      if (q === p || substringOk) {
        return {
          id: item.id,
          answer: item.answer,
          score: 1,
          question: item.question,
          path: "exact",
        };
      }
    }
    const score = Math.max(
      ...phrases.map((p) => jaccard(qTokens, tokens(p))),
      jaccard(qTokens, tokens(`${item.question} ${item.aliases.join(" ")}`)),
    );
    if (score >= minScore && (!best || score > best.score)) {
      best = {
        id: item.id,
        answer: item.answer,
        score,
        question: item.question,
        path: "jaccard",
      };
    }
  }
  return best;
}
