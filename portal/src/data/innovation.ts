import type { Language } from '../i18n/types'

export interface InnovationLeader {
  name: string
  approach: string
  highlight: string
}

export interface InnovationTrend {
  id: string
  title: string
  tagline: string
  description: string
  icon: string
  color: string
  accent: string
  gradient: string
  leaders: InnovationLeader[]
  foursysPosition: string
  keyCapabilities: string[]
  stats: { value: string; label: string }[]
  deepDive: {
    overview: string
    whyItMatters: string
    marketSize: string
    futureOutlook: string
  }
}

const innovationTrendsPt: InnovationTrend[] = [
  {
    id: 'gen-ai-agents',
    title: 'IA Generativa & Agentes Autônomos',
    tagline: 'A revolução da inteligência que executa',
    description: 'Modelos de linguagem, agentes autônomos e automação cognitiva estão redefinindo como empresas operam, decidem e entregam valor.',
    icon: 'brain-circuit',
    color: '#8B5CF6',
    accent: '#C084FC',
    gradient: 'from-violet-600/40 via-purple-800/20 to-transparent',
    leaders: [
      {
        name: 'Accenture',
        approach: 'GenAI Platform Factory — plataforma proprietária que reduz tempo de deploy de IA generativa em 30%. Mais de 45.000 profissionais dedicados a dados & IA, com US$ 3B investidos em AI nos últimos 3 anos.',
        highlight: '30% redução no deploy de GenAI',
      },
      {
        name: 'McKinsey (QuantumBlack)',
        approach: 'Divisão QuantumBlack lidera projetos de IA com rates premium (US$ 300-500+/h). Comprovaram ganhos de 40% em eficiência de warehouse. Modelo "AI at Scale" para industrializar projetos de IA.',
        highlight: '40% ganho em eficiência operacional',
      },
      {
        name: 'Cognizant',
        approach: 'Reconhecida pela Fortune como "Most Innovative" 4 anos seguidos. AI Builder para adoção e escala de IA. 65 patentes de IA do AI Lab. IA embutida em 100% da entrega de consultoria.',
        highlight: '65 patentes de IA, Fortune Most Innovative 4x',
      },
    ],
    foursysPosition: 'Método IA First: de piloto a ROI mensurável em 6 semanas. Laboratório de IA Híbrida com agentes controlados, auditáveis e com supervisão humana. 85% de conversão de piloto para produção.',
    keyCapabilities: [
      'Agentes Autônomos com Governança',
      'RAG & Fine-tuning Empresarial',
      'Automação Cognitiva de Processos',
      'IA Generativa para Code & QA',
      'Hiperautomação com LLMs',
    ],
    stats: [
      { value: '$184B', label: 'Mercado GenAI 2030' },
      { value: '85%', label: 'Conversão piloto→prod Foursys' },
      { value: '6 sem', label: 'Piloto a ROI mensurável' },
      { value: '3x', label: 'Velocidade com AI Squad' },
    ],
    deepDive: {
      overview: 'A IA Generativa evoluiu de chatbots experimentais para agentes autônomos que executam fluxos de trabalho complexos. Em 2026, empresas que não adotaram IA generativa em produção estão 2-3 anos atrás dos líderes de seus setores.',
      whyItMatters: 'Segundo o Gartner, 80% das empresas terão implantado agentes de IA até 2028. O diferencial não é mais "ter IA", mas ter governança, auditabilidade e resultados mensuráveis. A abordagem "piloto eterno" está custando bilhões em oportunidade perdida.',
      marketSize: 'O mercado global de IA Generativa deve alcançar US$ 184 bilhões até 2030 (CAGR 36%). Agentes autônomos representam o segmento de maior crescimento, com projeção de US$ 47B até 2028.',
      futureOutlook: 'Agentes multi-modal (texto, imagem, código, voz) integrados a ERPs e CRMs serão o padrão. A supervisão humana permanece crítica. Empresas precisam de frameworks de governança para escalar com segurança.',
    },
  },
  {
    id: 'industry-iot',
    title: 'Industry 4.0 & IoT',
    tagline: 'Fábricas inteligentes e operações conectadas',
    description: 'Manufatura inteligente, digital twins, sensores IoT e automação industrial estão transformando cadeias produtivas inteiras com dados em tempo real.',
    icon: 'factory',
    color: '#F43F5E',
    accent: '#FB7185',
    gradient: 'from-rose-600/40 via-pink-800/20 to-transparent',
    leaders: [
      {
        name: 'Siemens (MindSphere)',
        approach: 'Plataforma MindSphere conecta ativos industriais à nuvem. Digital twins para simulação e otimização de fábricas inteiras antes da implantação física. Líder global em automação industrial.',
        highlight: 'Digital Twins para fábricas inteiras',
      },
      {
        name: 'Roland Berger',
        approach: 'Principal consultoria estratégica europeia para Industry 4.0. Framework de maturidade digital para manufatura. Forte em transformação de cadeias automotivas e farmacêuticas.',
        highlight: 'Líder europeu em estratégia industrial',
      },
      {
        name: 'NTT Data',
        approach: 'Centros de inovação IoT no Japão, Europa e EUA. Soluções end-to-end de smart factory com edge computing, analytics preditivo e integração OT-IT para indústrias de grande escala.',
        highlight: 'Edge + IoT para smart factories',
      },
    ],
    foursysPosition: 'Integração de sistemas industriais com plataformas cloud, dashboards de monitoramento operacional em tempo real e automação de processos de manufatura com IA e analytics preditivo.',
    keyCapabilities: [
      'Integração OT-IT Industrial',
      'Dashboards Operacionais Real-time',
      'Analytics Preditivo & Manutenção',
      'Automação com IA para Manufatura',
      'Edge Computing & IoT Gateways',
    ],
    stats: [
      { value: '$377B', label: 'Mercado Industry 4.0 2029' },
      { value: '30%', label: 'Redução downtime com IoT' },
      { value: '25%', label: 'Ganho produtividade média' },
      { value: '75B', label: 'Dispositivos IoT até 2030' },
    ],
    deepDive: {
      overview: 'Industry 4.0 representa a convergência de automação industrial com tecnologias digitais — IoT, IA, cloud, robótica e digital twins. Fábricas inteligentes usam dados em tempo real para otimizar produção, qualidade e manutenção.',
      whyItMatters: 'Segundo a McKinsey, fábricas que implementam Industry 4.0 reduzem downtime em 30-50%, aumentam produtividade em 20-30% e reduzem custos de qualidade em até 35%. A competitividade industrial depende diretamente de maturidade digital.',
      marketSize: 'O mercado global de Industry 4.0 deve alcançar US$ 377 bilhões até 2029 (CAGR 20.7%). IoT industrial representa US$ 110B, digital twins US$ 48B e robótica colaborativa US$ 12B deste total.',
      futureOutlook: 'Fábricas autônomas com IA generativa para planejamento de produção. 5G privado habilita IoT de ultra-baixa latência. Gêmeos digitais evoluem de simulação para operação autônoma com IA.',
    },
  },
  {
    id: 'ai-robotics',
    title: 'IA & Robótica',
    tagline: 'Inteligência física — da fábrica ao mundo real',
    description: 'Robôs humanoides, cobots com IA, veículos autônomos e robótica cirúrgica estão criando a era da "Physical AI", onde a inteligência artificial ganha corpo, mãos e mobilidade.',
    icon: 'bot',
    color: '#EC4899',
    accent: '#F472B6',
    gradient: 'from-pink-600/40 via-fuchsia-800/20 to-transparent',
    leaders: [
      {
        name: 'NVIDIA',
        approach: 'Plataforma Isaac para robótica (simulação, treino e deploy). Foundation model GR00T para humanoides. Cosmos para geração de dados sintéticos. Jetson para inferência de IA na borda. Ecossistema de parceiros inclui FANUC, ABB, KUKA, Yaskawa, Figure AI e Agility Robotics.',
        highlight: 'Isaac + GR00T: infraestrutura de IA para toda a indústria robótica',
      },
      {
        name: 'Tesla (Optimus)',
        approach: '8.000 unidades acumuladas em deploy nas próprias fábricas (jan/2026). Venda ao público prevista para 2027. Usa pipeline de visão computacional do FSD (Full Self-Driving) para manipulação generalista. Objetivo: robô utilitário de US$ 20-30 mil para tarefas domésticas e industriais.',
        highlight: '8.000 Optimus em produção, venda pública em 2027',
      },
      {
        name: 'Unitree',
        approach: 'Líder mundial em vendas de humanoides: 5.500 unidades em 2025. Modelo mais acessível do mercado a partir de US$ 5.900. Estratégia de democratização da robótica humanoide com produção em escala na China.',
        highlight: '5.500 unidades, a partir de US$ 5.900',
      },
    ],
    foursysPosition: 'A Foursys monitora ativamente o ecossistema de Physical AI e posiciona-se como parceira de integração para empresas que desejam incorporar robótica inteligente em suas operações — desde automação de warehouse até RPA avançado com agentes físicos, conectando plataformas NVIDIA Isaac, cobots industriais e soluções FourBlox para orquestração.',
    keyCapabilities: [
      'Integração de Cobots com Sistemas Enterprise',
      'Plataformas NVIDIA Isaac & Omniverse',
      'Automação Inteligente de Warehouse',
      'RPA Avançado com Agentes Físicos',
      'Digital Twins para Simulação Robótica',
      'Orquestração via FourBlox',
    ],
    stats: [
      { value: '50K+', label: 'Humanoides previstos 2026' },
      { value: '700%', label: 'Crescimento embarques 2025→2026' },
      { value: '$39B', label: 'Valuation Figure AI' },
      { value: '2.5B', label: 'Robôs projetados 2035' },
    ],
    deepDive: {
      overview: 'A convergência de IA generativa com robótica está criando a era da "Physical AI" — máquinas que não apenas pensam, mas agem no mundo físico. Em 2025, os embarques globais de robôs humanoides ultrapassaram 14.500 unidades, e a projeção para 2026 é de mais de 50.000 — um crescimento de 700%. A China domina 90% dos embarques, mas os EUA lideram em investimento e valuations. O mercado se divide em cinco segmentos: Robôs Humanoides (Unitree, AgiBot, Tesla Optimus, Figure AI, UBTECH, Agility Robotics, Fourier, Sanctuary AI, Apptronik), Robótica Industrial (FANUC, ABB, KUKA, Yaskawa, Universal Robots), Infraestrutura de IA para Robótica (NVIDIA Isaac, GR00T, Cosmos, Jetson), Robótica Autônoma e Logística (Boston Dynamics, Amazon Robotics, Waymo), e Robótica Cirúrgica (Intuitive Surgical, Medtronic).',
      whyItMatters: 'A robótica com IA resolve o problema fundamental de escassez de mão de obra em manufatura, logística, saúde e serviços. FANUC tem mais de 1 milhão de robôs instalados globalmente. Amazon opera +750 mil robôs em seus armazéns. Intuitive Surgical já realizou +9 milhões de cirurgias robóticas. Figure AI alcançou valuation de US$ 39 bilhões após captar US$ 1 bilhão em 2025. A NVIDIA conecta todo o ecossistema com sua plataforma Isaac, fornecendo simulação (Omniverse), modelos foundation (GR00T), dados sintéticos (Cosmos) e inferência na borda (Jetson) para os principais fabricantes do mundo.',
      marketSize: 'O mercado global de robótica inteligente deve ultrapassar US$ 260 bilhões até 2030. Robôs humanoides, que em 2025 geraram ~US$ 200 milhões, devem alcançar US$ 38 bilhões até 2035. Robótica industrial (FANUC, ABB, KUKA, Yaskawa) já movimenta US$ 55B/ano. Cobots (Universal Robots) crescem 30% ao ano. Robótica cirúrgica (Intuitive, Medtronic) projeta US$ 18B até 2028. A projeção é de 2,5 bilhões de robôs no mundo até 2035.',
      futureOutlook: 'Robôs humanoides generalistas (Tesla Optimus, Figure AI) chegarão ao consumidor a partir de 2027-2028. Cobots com IA generativa entenderão instruções em linguagem natural. Cirurgia robótica autônoma (Intuitive, Medtronic + NVIDIA) reduzirá erros médicos. Digital Twins com NVIDIA Omniverse permitirão testar robôs inteiros em simulação antes do deploy físico. A NVIDIA se consolida como a "plataforma das plataformas" — fornecendo infraestrutura de IA para praticamente todos os fabricantes de robôs do planeta.',
    },
  },
  {
    id: 'machine-customers-m2m',
    title: 'Machine Customers & M2M',
    tagline: 'A nova economia onde máquinas compram de máquinas',
    description: 'Agentes autônomos de IA tornam-se clientes corporativos: negociam crédito, reabastecem estoques, comparam seguros e fecham contratos em milissegundos — sem intervenção humana. Empresas que não preparam APIs e canais para este novo público ficarão invisíveis para o próximo grande comprador, que é algorítmico.',
    icon: 'network',
    color: '#06B6D4',
    accent: '#22D3EE',
    gradient: 'from-cyan-600/40 via-sky-800/20 to-transparent',
    leaders: [
      {
        name: 'Gartner',
        approach: 'Cunhou o termo "Machine Customers" e projeta que até 2030 haverá 25 bilhões de máquinas conectadas atuando como clientes, gerando até US$ 30 trilhões em transações comerciais. Posiciona o tema como uma das transformações mais profundas das próximas décadas para CIOs e CMOs.',
        highlight: 'US$ 30T em transações por máquinas até 2030',
      },
      {
        name: 'Mastercard & Visa (Agentic Payments)',
        approach: 'Desenvolvem trilhos de pagamento dedicados a agentes autônomos: identidade do agente, limites delegados, auditabilidade ponta-a-ponta e canais machine-to-machine para disputas financeiras. Pilotos com bancos globais já em produção em 2025-2026.',
        highlight: 'Agentic Payments com identidade e limite de agentes',
      },
      {
        name: 'OpenAI & Anthropic',
        approach: 'Foundation models (GPT-5, Claude) que executam ferramentas, navegam APIs e fecham transações em nome do usuário. Operator e Computer Use abriram o caminho para agentes que compram, comparam e contratam — transformando experimentos em produtos comerciais reais.',
        highlight: 'Foundation models que executam transações reais',
      },
    ],
    foursysPosition: 'A Foursys ajuda corporates a se tornarem "agent-ready": redesenho de APIs e jornadas para clientes não-humanos, construção de canais M2M para procurement e disputas financeiras, governança e auditabilidade de Agentic Payments, e AI Squads para criar os próprios agentes compradores corporativos com supervisão humana e compliance LGPD/regulatório.',
    keyCapabilities: [
      'APIs Agent-Ready (orientadas a agentes)',
      'Canais M2M para Procurement & Disputas',
      'Agentic Payments com Governança',
      'Reposição Autônoma de Estoque',
      'Agentes de Fluxo de Caixa Corporativo',
      'Auditabilidade & Compliance de Agentes',
    ],
    stats: [
      { value: '$30T', label: 'Transações por máquinas 2030' },
      { value: '20%', label: 'Compras corporates via agentes 2028' },
      { value: 'ms', label: 'Velocidade de decisão M2M' },
      { value: '25B', label: 'Machine customers conectados 2030' },
    ],
    deepDive: {
      overview: 'Machine Customers são agentes autônomos de IA que atuam como clientes independentes — analisam dados, tomam decisões de compra e executam transações sem intervenção humana direta. Já operam hoje monitorando saldos corporativos, antecipando boletos, comparando seguros, renegociando linhas de crédito, reabastecendo estoques via APIs e contratando fornecedores em milissegundos. O conceito conecta-se diretamente com Agentic Payments (pagamentos iniciados e executados por agentes) e com canais M2M para disputas financeiras — duas frentes já prototipáveis em corporates do Brasil.',
      whyItMatters: 'O próximo grande cliente da sua empresa pode ser um algoritmo. Sistemas de relacionamento, crédito, atendimento e procurement precisam ser redesenhados para atender máquinas — não apenas pessoas. Empresas cujas APIs não são "agent-ready" simplesmente não serão vistas pelos agentes compradores: serão filtradas no primeiro milissegundo. Para bancos, varejo, seguros, saúde e indústria, ignorar Machine Customers é o equivalente a ignorar o e-commerce em 2005.',
      marketSize: 'Gartner projeta que Machine Customers movimentarão US$ 30 trilhões em transações até 2030, com 25 bilhões de máquinas conectadas atuando como clientes. Até 2028, 20% das compras corporativas serão iniciadas por agentes autônomos. O mercado de Agentic Payments deve ultrapassar US$ 1,5 trilhão em volume processado até 2029.',
      futureOutlook: 'B2B se transformará em B2A (Business-to-Agent). APIs serão escritas para máquinas antes de humanos. Bancos terão produtos específicos para "clientes algorítmicos" — com limites delegados, identidade do agente e canais M2M para resolução de disputas. Seguradoras lidarão com renovação e portabilidade automatizadas a cada vencimento. Hospitais, indústrias e varejistas adotarão agentes de compra preditiva integrados a IoT e protocolos clínicos/operacionais.',
    },
  },
  {
    id: 'living-intelligence',
    title: 'Living Intelligence',
    tagline: 'Sistemas vivos que aprendem e evoluem 24/7',
    description: 'A convergência de IA, sensores avançados e biotecnologia computacional cria organizações vivas: mercados autoajustáveis, motores de risco que se recalibram a cada transação e estratégias contínuas que tornam o planejamento anual obsoleto.',
    icon: 'dna',
    color: '#10B981',
    accent: '#34D399',
    gradient: 'from-emerald-600/40 via-teal-800/20 to-transparent',
    leaders: [
      {
        name: 'Gartner',
        approach: 'Posiciona Living Intelligence entre as Top 10 Strategic Technology Trends. Define como a convergência de três pilares — IA, sensores avançados (commodity) e biotecnologia computacional — formando sistemas inteiros que aprendem e evoluem continuamente, substituindo processos estáticos por adaptação contínua.',
        highlight: 'Top 10 Strategic Trends — convergência IA + sensores + biotech',
      },
      {
        name: 'Microsoft (Industrial Metaverse + Adaptive AI)',
        approach: 'Plataformas Azure IoT, Fabric e Copilot orquestram sistemas industriais adaptativos com sensorização end-to-end. Modelos de Adaptive AI que se recalibram em produção sem retreino manual. Casos reais em manufatura, energia e healthcare com aprendizado contínuo.',
        highlight: 'Adaptive AI em produção sem retreino manual',
      },
      {
        name: 'Google DeepMind (AlphaFold + Continuous Learning)',
        approach: 'Pioneirismo em modelos auto-melhoráveis. AlphaFold revolucionou biologia computacional. Gemini com aprendizado contínuo, raciocínio e ferramentas. Convergência IA + biotech: do DNA aos sistemas operacionais corporativos vivos.',
        highlight: 'IA + biotech computacional para sistemas vivos',
      },
    ],
    foursysPosition: 'A Foursys constrói sistemas vivos para corporates: Risk Engines auto-recalibráveis com FourBlox para orquestração contínua, plataformas de precificação e sortimento vivos, defesas cibernéticas evolutivas e governança de modelos adaptativos com supervisão humana. AI Squads dedicados a ML em aprendizado contínuo, MLOps e observabilidade de modelos em produção.',
    keyCapabilities: [
      'Risk Engines Auto-Recalibráveis',
      'Precificação & Sortimento Vivos',
      'Defesas Cibernéticas Evolutivas',
      'ML com Aprendizado Contínuo',
      'Sensorização Avançada + IA',
      'Governança de Sistemas Adaptativos',
    ],
    stats: [
      { value: 'Top 10', label: 'Strategic Trends 2026' },
      { value: '40%', label: 'Redução fraudes com risk engines vivos' },
      { value: '24/7', label: 'Recalibração contínua' },
      { value: '0 dias', label: 'Lag entre evento e resposta' },
    ],
    deepDive: {
      overview: 'Living Intelligence vai além da IA isolada. É a tese de que IA é apenas uma das três pernas de uma transformação muito maior — as outras duas são sensores avançados (que se tornaram commodity, com custo marginal próximo de zero) e biotecnologia computacional (que começa a convergir com a computação). Combinados, criam organizações cujos sistemas de dados, agentes e contratos aprendem continuamente. O paradigma é claro: enquanto Machine Customers responde "quem compra", Living Intelligence responde "como o sistema inteiro evolui".',
      whyItMatters: 'O planejamento anual da sua empresa leva semanas para ser aprovado. Enquanto isso, existem organizações cujos sistemas de crédito, estoque e risco se recalibram sozinhos a cada transação. Esse delta de velocidade é a próxima grande vantagem competitiva. Bancos com Risk Engines vivos detectam novos padrões de fraude antes que escalem; varejistas ajustam preços e mix em tempo real; fazendas adaptativas evoluem a estratégia agronômica a cada safra. Quem fica preso ao planejamento estático perde mercado a cada ciclo.',
      marketSize: 'O mercado combinado de Adaptive AI + IoT industrial + biotech computacional deve ultrapassar US$ 500 bilhões até 2030. Apenas Adaptive AI cresce a CAGR 30%+, sensores IoT industriais movimentam US$ 110B/ano, e biotech computacional (drug discovery, sintética) supera US$ 75B até 2029. A integração via plataformas Living Intelligence é o vetor de crescimento mais acelerado da década.',
      futureOutlook: 'Surge o conceito de "Agentic Living Enterprise" — empresas onde dados, agentes, contratos e estratégias aprendem continuamente, substituindo o planejamento anual por adaptação contínua. Serviços públicos preditivos personalizados serão padrão em cidades inteligentes. Saúde terá triagem hospitalar viva (sensores de leito + epidemiologia preditiva + realocação de recursos em tempo real). A indústria opera processos adaptativos com IA distribuída. A questão não é mais "se", mas "quão rápido" cada empresa consegue migrar do estático ao vivo.',
    },
  },
  {
    id: 'synthetic-economy',
    title: 'Economia Sintética',
    tagline: 'IA gerando valor a custo marginal quase zero',
    description: 'Dados sintéticos, gêmeos digitais financeiros, conteúdo infinito e ativos virtuais formam uma nova camada econômica. Empresas treinam modelos sem expor dados reais, testam produtos antes de produzir e simulam mercados inteiros — eliminando riscos regulatórios, custos físicos e tempo de desenvolvimento.',
    icon: 'flask-conical',
    color: '#FACC15',
    accent: '#FDE047',
    gradient: 'from-yellow-500/40 via-amber-800/20 to-transparent',
    leaders: [
      {
        name: 'Gartner',
        approach: 'Projeta que até 2030, mais de 60% dos dados de treinamento de IA serão sintéticos — superando dados reais. Posiciona dados sintéticos e gêmeos digitais como tecnologias de impacto disruptivo, com aplicações imediatas em compliance LGPD/GDPR, drug discovery, finanças e simulação industrial.',
        highlight: '60% dos dados de treino de IA serão sintéticos até 2030',
      },
      {
        name: 'NVIDIA (Omniverse + Cosmos)',
        approach: 'Omniverse cria gêmeos digitais industriais de alta fidelidade física. Cosmos gera dados sintéticos para treinar robôs, veículos autônomos e modelos físicos. Plataforma de referência mundial para "world simulation" — testar bilhões de cenários sem nenhum custo físico real.',
        highlight: 'Plataforma global de gêmeos digitais e dados sintéticos',
      },
      {
        name: 'Mostly AI & Synthesis AI',
        approach: 'Startups líderes em geração de dados sintéticos enterprise para compliance LGPD/GDPR. Mostly AI gera tabelas sintéticas estatisticamente equivalentes aos dados reais; Synthesis AI gera dados visuais sintéticos para treinamento de modelos. Casos de uso em bancos, seguradoras e healthcare.',
        highlight: 'Dados sintéticos enterprise LGPD/GDPR-compliant by design',
      },
    ],
    foursysPosition: 'A Foursys constrói pipelines de Economia Sintética para corporates: dados sintéticos LGPD-compliant by design para modelos de crédito (sem expor clientes reais), gêmeos digitais financeiros para stress test e precificação, simuladores hiper-realistas para treinamento corporativo, e sandboxes sintéticos para inovação acelerada. AI Squads especializados em geração e validação estatística de dados sintéticos.',
    keyCapabilities: [
      'Dados Sintéticos LGPD-Compliant',
      'Gêmeos Digitais Financeiros',
      'Simuladores Hiper-Realistas (Treinamento)',
      'Prova Virtual & Design Generativo',
      'Sandboxes Sintéticos para Inovação',
      'Geração de Conteúdo Sob Demanda',
    ],
    stats: [
      { value: '60%', label: 'Dados de treino sintéticos 2030' },
      { value: '$2.34B', label: 'Mercado dados sintéticos 2030' },
      { value: '90%', label: 'Redução em custos de testes' },
      { value: 'LGPD', label: 'Compliance by design' },
    ],
    deepDive: {
      overview: 'A Economia Sintética é uma nova camada econômica onde IA gera valor com custo marginal quase zero: dados sintéticos que substituem dados reais, conteúdo infinito sob demanda, simulações de mercados inteiros, gêmeos digitais que reproduzem fábricas e portfólios, e ativos que não existem no mundo físico — mas têm valor real e impacto direto nos negócios. É o tema mais disruptivo da agenda de inovação de 2026: para corporates, representa simultaneamente uma ameaça (fornecedores de software e consultoria podem desaparecer) e uma oportunidade (substituir dados reais protegidos por LGPD).',
      whyItMatters: 'Sua empresa quer lançar novos produtos mas falta dado, compliance bloqueia ou testar no mundo real custa caro? A Economia Sintética é a resposta: IA gera os dados, simula os cenários e valida os produtos — tudo sem tocar em um cliente real, sem parar uma linha de produção e sem risco regulatório. Bancos treinam modelos de crédito em datasets sintéticos com compliance LGPD garantido por design. Indústrias testam milhares de configurações de linha de montagem em gêmeos digitais. Hospitais geram prontuários sintéticos para pesquisa clínica. RH treina líderes em simuladores adaptativos hiper-realistas.',
      marketSize: 'O mercado global de dados sintéticos deve alcançar US$ 2,34 bilhões até 2030 (CAGR 35%+). Gêmeos digitais ultrapassam US$ 48 bilhões até 2029 (CAGR 38%). Conteúdo gerado por IA (texto, imagem, vídeo, código) movimenta um ecossistema combinado de US$ 100B+ até 2030. Em finanças, gêmeos digitais para stress test, simulação de portfólios e modelos de precificação já estão em uso nos maiores bancos do mundo.',
      futureOutlook: 'Modelos de crédito treinados 100% em dados sintéticos serão padrão regulatório em mercados sensíveis a LGPD/GDPR. Produtos serão criados, testados e otimizados inteiramente em ambientes sintéticos antes de entrar em produção física. Simulações adaptativas substituirão role plays estáticos no treinamento corporativo. Fábricas operarão "test-in-twin-first" — qualquer reconfiguração validada no gêmeo digital antes do físico. Pesquisa clínica acelerará via prontuários sintéticos hiper-realistas, contornando ciclos longos de comitês de ética. A Economia Sintética não substitui o real — ela o protege, acelera e democratiza.',
    },
  },
]

const innovationTrendsEn: InnovationTrend[] = [
  {
    id: 'gen-ai-agents',
    title: 'Generative AI & Autonomous Agents',
    tagline: 'The intelligence revolution that executes',
    description: 'Language models, autonomous agents, and cognitive automation are redefining how companies operate, make decisions, and deliver value.',
    icon: 'brain-circuit',
    color: '#8B5CF6',
    accent: '#C084FC',
    gradient: 'from-violet-600/40 via-purple-800/20 to-transparent',
    leaders: [
      {
        name: 'Accenture',
        approach: 'GenAI Platform Factory — proprietary platform that reduces generative AI deployment time by 30%. Over 45,000 professionals dedicated to data & AI, with US$3B invested in AI over the past 3 years.',
        highlight: '30% reduction in GenAI deployment',
      },
      {
        name: 'McKinsey (QuantumBlack)',
        approach: 'QuantumBlack division leads AI projects with premium rates (US$300-500+/h). Demonstrated 40% warehouse efficiency gains. "AI at Scale" model for industrializing AI projects.',
        highlight: '40% operational efficiency gain',
      },
      {
        name: 'Cognizant',
        approach: 'Recognized by Fortune as "Most Innovative" 4 years in a row. AI Builder for AI adoption and scaling. 65 AI patents from the AI Lab. AI embedded in 100% of consulting delivery.',
        highlight: '65 AI patents, Fortune Most Innovative 4x',
      },
    ],
    foursysPosition: 'AI First Method: from pilot to measurable ROI in 6 weeks. Hybrid AI Lab with controlled, auditable agents with human oversight. 85% pilot-to-production conversion rate.',
    keyCapabilities: [
      'Autonomous Agents with Governance',
      'Enterprise RAG & Fine-tuning',
      'Cognitive Process Automation',
      'Generative AI for Code & QA',
      'Hyperautomation with LLMs',
    ],
    stats: [
      { value: '$184B', label: 'GenAI Market 2030' },
      { value: '85%', label: 'Foursys pilot→prod conversion' },
      { value: '6 wks', label: 'Pilot to measurable ROI' },
      { value: '3x', label: 'Speed with AI Squad' },
    ],
    deepDive: {
      overview: 'Generative AI has evolved from experimental chatbots to autonomous agents that execute complex workflows. In 2026, companies that have not adopted generative AI in production are 2-3 years behind the leaders in their industries.',
      whyItMatters: 'According to Gartner, 80% of enterprises will have deployed AI agents by 2028. The differentiator is no longer "having AI," but having governance, auditability, and measurable results. The "eternal pilot" approach is costing billions in missed opportunities.',
      marketSize: 'The global generative AI market is projected to reach US$184 billion by 2030 (36% CAGR). Autonomous agents represent the fastest-growing segment, with a projection of US$47B by 2028.',
      futureOutlook: 'Multi-modal agents (text, image, code, voice) integrated with ERPs and CRMs will become the standard. Human oversight remains critical. Companies need governance frameworks to scale safely.',
    },
  },
  {
    id: 'industry-iot',
    title: 'Industry 4.0 & IoT',
    tagline: 'Smart factories and connected operations',
    description: 'Smart manufacturing, digital twins, IoT sensors, and industrial automation are transforming entire production chains with real-time data.',
    icon: 'factory',
    color: '#F43F5E',
    accent: '#FB7185',
    gradient: 'from-rose-600/40 via-pink-800/20 to-transparent',
    leaders: [
      {
        name: 'Siemens (MindSphere)',
        approach: 'MindSphere platform connects industrial assets to the cloud. Digital twins for simulation and optimization of entire factories before physical deployment. Global leader in industrial automation.',
        highlight: 'Digital Twins for entire factories',
      },
      {
        name: 'Roland Berger',
        approach: 'Leading European strategic consultancy for Industry 4.0. Digital maturity framework for manufacturing. Strong in automotive and pharmaceutical supply chain transformation.',
        highlight: 'European leader in industrial strategy',
      },
      {
        name: 'NTT Data',
        approach: 'IoT innovation centers in Japan, Europe, and the USA. End-to-end smart factory solutions with edge computing, predictive analytics, and OT-IT integration for large-scale industries.',
        highlight: 'Edge + IoT for smart factories',
      },
    ],
    foursysPosition: 'Integration of industrial systems with cloud platforms, real-time operational monitoring dashboards, and manufacturing process automation with AI and predictive analytics.',
    keyCapabilities: [
      'OT-IT Industrial Integration',
      'Real-time Operational Dashboards',
      'Predictive Analytics & Maintenance',
      'AI-Powered Manufacturing Automation',
      'Edge Computing & IoT Gateways',
    ],
    stats: [
      { value: '$377B', label: 'Industry 4.0 Market 2029' },
      { value: '30%', label: 'Downtime reduction with IoT' },
      { value: '25%', label: 'Average productivity gain' },
      { value: '75B', label: 'IoT devices by 2030' },
    ],
    deepDive: {
      overview: 'Industry 4.0 represents the convergence of industrial automation with digital technologies — IoT, AI, cloud, robotics, and digital twins. Smart factories use real-time data to optimize production, quality, and maintenance.',
      whyItMatters: 'According to McKinsey, factories that implement Industry 4.0 reduce downtime by 30-50%, increase productivity by 20-30%, and reduce quality costs by up to 35%. Industrial competitiveness depends directly on digital maturity.',
      marketSize: 'The global Industry 4.0 market is projected to reach US$377 billion by 2029 (20.7% CAGR). Industrial IoT accounts for US$110B, digital twins US$48B, and collaborative robotics US$12B of this total.',
      futureOutlook: 'Autonomous factories with generative AI for production planning. Private 5G enables ultra-low-latency IoT. Digital twins evolve from simulation to autonomous operation with AI.',
    },
  },
  {
    id: 'ai-robotics',
    title: 'AI & Robotics',
    tagline: 'Physical intelligence — from factory to the real world',
    description: 'Humanoid robots, AI-powered cobots, autonomous vehicles, and surgical robotics are creating the era of "Physical AI," where artificial intelligence gains a body, hands, and mobility.',
    icon: 'bot',
    color: '#EC4899',
    accent: '#F472B6',
    gradient: 'from-pink-600/40 via-fuchsia-800/20 to-transparent',
    leaders: [
      {
        name: 'NVIDIA',
        approach: 'Isaac platform for robotics (simulation, training, and deployment). GR00T foundation model for humanoids. Cosmos for synthetic data generation. Jetson for edge AI inference. Partner ecosystem includes FANUC, ABB, KUKA, Yaskawa, Figure AI, and Agility Robotics.',
        highlight: 'Isaac + GR00T: AI infrastructure for the entire robotics industry',
      },
      {
        name: 'Tesla (Optimus)',
        approach: '8,000 cumulative units deployed in its own factories (Jan/2026). Public sale planned for 2027. Uses FSD (Full Self-Driving) computer vision pipeline for generalist manipulation. Goal: US$20-30K utility robot for household and industrial tasks.',
        highlight: '8,000 Optimus in production, public sale in 2027',
      },
      {
        name: 'Unitree',
        approach: 'Global leader in humanoid sales: 5,500 units in 2025. Most affordable model on the market starting at US$5,900. Strategy of democratizing humanoid robotics with large-scale production in China.',
        highlight: '5,500 units, starting at US$5,900',
      },
    ],
    foursysPosition: 'Foursys actively monitors the Physical AI ecosystem and positions itself as an integration partner for companies looking to incorporate intelligent robotics into their operations — from warehouse automation to advanced RPA with physical agents, connecting NVIDIA Isaac platforms, industrial cobots, and FourBlox solutions for orchestration.',
    keyCapabilities: [
      'Enterprise Systems Cobot Integration',
      'NVIDIA Isaac & Omniverse Platforms',
      'Intelligent Warehouse Automation',
      'Advanced RPA with Physical Agents',
      'Digital Twins for Robotic Simulation',
      'Orchestration via FourBlox',
    ],
    stats: [
      { value: '50K+', label: 'Humanoids forecast 2026' },
      { value: '700%', label: 'Shipment growth 2025→2026' },
      { value: '$39B', label: 'Figure AI Valuation' },
      { value: '2.5B', label: 'Robots projected 2035' },
    ],
    deepDive: {
      overview: 'The convergence of generative AI with robotics is creating the era of "Physical AI" — machines that not only think but act in the physical world. In 2025, global humanoid robot shipments surpassed 14,500 units, and the projection for 2026 is over 50,000 — a 700% growth. China dominates 90% of shipments, but the US leads in investment and valuations. The market is divided into five segments: Humanoid Robots (Unitree, AgiBot, Tesla Optimus, Figure AI, UBTECH, Agility Robotics, Fourier, Sanctuary AI, Apptronik), Industrial Robotics (FANUC, ABB, KUKA, Yaskawa, Universal Robots), AI Infrastructure for Robotics (NVIDIA Isaac, GR00T, Cosmos, Jetson), Autonomous and Logistics Robotics (Boston Dynamics, Amazon Robotics, Waymo), and Surgical Robotics (Intuitive Surgical, Medtronic).',
      whyItMatters: 'AI-powered robotics solves the fundamental problem of labor shortages in manufacturing, logistics, healthcare, and services. FANUC has over 1 million robots installed globally. Amazon operates 750,000+ robots in its warehouses. Intuitive Surgical has performed 9+ million robotic surgeries. Figure AI reached a US$39 billion valuation after raising US$1 billion in 2025. NVIDIA connects the entire ecosystem with its Isaac platform, providing simulation (Omniverse), foundation models (GR00T), synthetic data (Cosmos), and edge inference (Jetson) for the world\'s leading manufacturers.',
      marketSize: 'The global intelligent robotics market is expected to surpass US$260 billion by 2030. Humanoid robots, which generated ~US$200 million in 2025, are projected to reach US$38 billion by 2035. Industrial robotics (FANUC, ABB, KUKA, Yaskawa) already moves US$55B/year. Cobots (Universal Robots) grow 30% annually. Surgical robotics (Intuitive, Medtronic) projects US$18B by 2028. The projection is 2.5 billion robots worldwide by 2035.',
      futureOutlook: 'Generalist humanoid robots (Tesla Optimus, Figure AI) will reach consumers starting in 2027-2028. Cobots with generative AI will understand natural language instructions. Autonomous robotic surgery (Intuitive, Medtronic + NVIDIA) will reduce medical errors. Digital Twins with NVIDIA Omniverse will allow testing entire robots in simulation before physical deployment. NVIDIA consolidates as the "platform of platforms" — providing AI infrastructure for virtually every robot manufacturer on the planet.',
    },
  },
  {
    id: 'machine-customers-m2m',
    title: 'Machine Customers & M2M',
    tagline: 'The new economy where machines buy from machines',
    description: 'Autonomous AI agents become corporate customers: they negotiate credit, replenish inventories, compare insurance, and close contracts in milliseconds — without human intervention. Companies that fail to prepare APIs and channels for this new audience will be invisible to the next big buyer, who is algorithmic.',
    icon: 'network',
    color: '#06B6D4',
    accent: '#22D3EE',
    gradient: 'from-cyan-600/40 via-sky-800/20 to-transparent',
    leaders: [
      {
        name: 'Gartner',
        approach: 'Coined the term "Machine Customers" and projects that by 2030 there will be 25 billion connected machines acting as customers, generating up to US$30 trillion in commercial transactions. Positions the topic as one of the most profound transformations of the coming decades for CIOs and CMOs.',
        highlight: 'US$30T in machine transactions by 2030',
      },
      {
        name: 'Mastercard & Visa (Agentic Payments)',
        approach: 'Developing payment rails dedicated to autonomous agents: agent identity, delegated limits, end-to-end auditability, and machine-to-machine channels for financial disputes. Pilots with global banks already in production in 2025-2026.',
        highlight: 'Agentic Payments with agent identity and limits',
      },
      {
        name: 'OpenAI & Anthropic',
        approach: 'Foundation models (GPT-5, Claude) that execute tools, navigate APIs, and close transactions on behalf of users. Operator and Computer Use paved the way for agents that buy, compare, and contract — turning experiments into real commercial products.',
        highlight: 'Foundation models executing real transactions',
      },
    ],
    foursysPosition: 'Foursys helps corporates become "agent-ready": redesigning APIs and journeys for non-human customers, building M2M channels for procurement and financial disputes, governance and auditability of Agentic Payments, and AI Squads to create their own corporate buyer agents with human oversight and LGPD/regulatory compliance.',
    keyCapabilities: [
      'Agent-Ready APIs',
      'M2M Channels for Procurement & Disputes',
      'Agentic Payments with Governance',
      'Autonomous Inventory Replenishment',
      'Corporate Cash Flow Agents',
      'Agent Auditability & Compliance',
    ],
    stats: [
      { value: '$30T', label: 'Machine transactions 2030' },
      { value: '20%', label: 'Corporate buys via agents 2028' },
      { value: 'ms', label: 'M2M decision speed' },
      { value: '25B', label: 'Connected machine customers 2030' },
    ],
    deepDive: {
      overview: 'Machine Customers are autonomous AI agents acting as independent customers — analyzing data, making purchase decisions, and executing transactions without direct human intervention. They already operate today by monitoring corporate balances, anticipating bill payments, comparing insurance, renegotiating credit lines, replenishing inventory via APIs, and contracting suppliers in milliseconds. The concept directly connects with Agentic Payments (payments initiated and executed by agents) and M2M channels for financial disputes — two fronts already prototypable in Brazilian corporates.',
      whyItMatters: 'Your company\'s next big customer might be an algorithm. Relationship, credit, service, and procurement systems need to be redesigned to serve machines — not just people. Companies whose APIs are not "agent-ready" simply will not be seen by buyer agents: they will be filtered out in the first millisecond. For banks, retail, insurance, healthcare, and industry, ignoring Machine Customers is the equivalent of ignoring e-commerce in 2005.',
      marketSize: 'Gartner projects Machine Customers will move US$30 trillion in transactions by 2030, with 25 billion connected machines acting as customers. By 2028, 20% of corporate purchases will be initiated by autonomous agents. The Agentic Payments market is expected to exceed US$1.5 trillion in processed volume by 2029.',
      futureOutlook: 'B2B will transform into B2A (Business-to-Agent). APIs will be written for machines before humans. Banks will offer products specific to "algorithmic customers" — with delegated limits, agent identity, and M2M channels for dispute resolution. Insurers will handle automated renewal and portability at every expiration. Hospitals, industries, and retailers will adopt predictive purchasing agents integrated with IoT and clinical/operational protocols.',
    },
  },
  {
    id: 'living-intelligence',
    title: 'Living Intelligence',
    tagline: 'Living systems that learn and evolve 24/7',
    description: 'The convergence of AI, advanced sensors, and computational biotechnology creates living organizations: self-adjusting markets, risk engines that recalibrate with every transaction, and continuous strategies that render annual planning obsolete.',
    icon: 'dna',
    color: '#10B981',
    accent: '#34D399',
    gradient: 'from-emerald-600/40 via-teal-800/20 to-transparent',
    leaders: [
      {
        name: 'Gartner',
        approach: 'Positions Living Intelligence among the Top 10 Strategic Technology Trends. Defines it as the convergence of three pillars — AI, advanced sensors (commoditized), and computational biotechnology — forming entire systems that learn and evolve continuously, replacing static processes with continuous adaptation.',
        highlight: 'Top 10 Strategic Trends — AI + sensors + biotech convergence',
      },
      {
        name: 'Microsoft (Industrial Metaverse + Adaptive AI)',
        approach: 'Azure IoT, Fabric, and Copilot platforms orchestrate adaptive industrial systems with end-to-end sensorization. Adaptive AI models that recalibrate in production without manual retraining. Real-world cases in manufacturing, energy, and healthcare with continuous learning.',
        highlight: 'Adaptive AI in production without manual retraining',
      },
      {
        name: 'Google DeepMind (AlphaFold + Continuous Learning)',
        approach: 'Pioneer in self-improving models. AlphaFold revolutionized computational biology. Gemini with continuous learning, reasoning, and tool use. AI + biotech convergence: from DNA to living corporate operating systems.',
        highlight: 'AI + computational biotech for living systems',
      },
    ],
    foursysPosition: 'Foursys builds living systems for corporates: self-recalibrating Risk Engines with FourBlox for continuous orchestration, living pricing and assortment platforms, evolutionary cyber defenses, and governance of adaptive models with human oversight. AI Squads dedicated to continuous-learning ML, MLOps, and observability of models in production.',
    keyCapabilities: [
      'Self-Recalibrating Risk Engines',
      'Living Pricing & Assortment',
      'Evolutionary Cyber Defenses',
      'Continuous-Learning ML',
      'Advanced Sensorization + AI',
      'Adaptive Systems Governance',
    ],
    stats: [
      { value: 'Top 10', label: 'Strategic Trends 2026' },
      { value: '40%', label: 'Fraud reduction with living risk engines' },
      { value: '24/7', label: 'Continuous recalibration' },
      { value: '0 days', label: 'Lag between event and response' },
    ],
    deepDive: {
      overview: 'Living Intelligence goes beyond AI in isolation. Its thesis: AI is just one of three legs of a much bigger transformation — the other two are advanced sensors (commoditized, with near-zero marginal cost) and computational biotechnology (starting to converge with computing). Combined, they create organizations whose data, agents, and contracts learn continuously. The paradigm is clear: while Machine Customers answers "who buys", Living Intelligence answers "how the entire system evolves".',
      whyItMatters: 'Your company\'s annual plan takes weeks to be approved. Meanwhile, organizations exist whose credit, inventory, and risk systems recalibrate themselves with every transaction. That speed delta is the next great competitive advantage. Banks with living risk engines detect new fraud patterns before they scale; retailers adjust prices and mix in real time; adaptive farms evolve their agronomic strategy with every harvest. Whoever sticks to static planning loses market share each cycle.',
      marketSize: 'The combined market of Adaptive AI + industrial IoT + computational biotech is expected to exceed US$500 billion by 2030. Adaptive AI alone grows at 30%+ CAGR, industrial IoT sensors generate US$110B/year, and computational biotech (drug discovery, synthetic) surpasses US$75B by 2029. Integration via Living Intelligence platforms is the fastest-growing vector of the decade.',
      futureOutlook: 'The concept of "Agentic Living Enterprise" emerges — companies where data, agents, contracts, and strategies learn continuously, replacing annual planning with continuous adaptation. Predictive personalized public services will be standard in smart cities. Healthcare will have living hospital triage (bed sensors + predictive epidemiology + real-time resource reallocation). Industry runs adaptive processes with distributed AI. The question is no longer "if", but "how fast" each company can migrate from static to living.',
    },
  },
  {
    id: 'synthetic-economy',
    title: 'Synthetic Economy',
    tagline: 'AI generating value at near-zero marginal cost',
    description: 'Synthetic data, financial digital twins, infinite content, and virtual assets form a new economic layer. Companies train models without exposing real data, test products before producing them, and simulate entire markets — eliminating regulatory risk, physical costs, and development time.',
    icon: 'flask-conical',
    color: '#FACC15',
    accent: '#FDE047',
    gradient: 'from-yellow-500/40 via-amber-800/20 to-transparent',
    leaders: [
      {
        name: 'Gartner',
        approach: 'Projects that by 2030, more than 60% of AI training data will be synthetic — surpassing real data. Positions synthetic data and digital twins as disruptive technologies, with immediate applications in LGPD/GDPR compliance, drug discovery, finance, and industrial simulation.',
        highlight: '60% of AI training data will be synthetic by 2030',
      },
      {
        name: 'NVIDIA (Omniverse + Cosmos)',
        approach: 'Omniverse creates high physical-fidelity industrial digital twins. Cosmos generates synthetic data to train robots, autonomous vehicles, and physical models. World-reference platform for "world simulation" — testing billions of scenarios with zero real physical cost.',
        highlight: 'Global platform for digital twins and synthetic data',
      },
      {
        name: 'Mostly AI & Synthesis AI',
        approach: 'Leading startups in enterprise synthetic data generation for LGPD/GDPR compliance. Mostly AI generates statistically equivalent synthetic tables; Synthesis AI generates synthetic visual data for model training. Use cases in banks, insurers, and healthcare.',
        highlight: 'LGPD/GDPR-compliant enterprise synthetic data by design',
      },
    ],
    foursysPosition: 'Foursys builds Synthetic Economy pipelines for corporates: LGPD-compliant synthetic data by design for credit models (without exposing real customers), financial digital twins for stress testing and pricing, hyper-realistic simulators for corporate training, and synthetic sandboxes for accelerated innovation. AI Squads specialized in generation and statistical validation of synthetic data.',
    keyCapabilities: [
      'LGPD-Compliant Synthetic Data',
      'Financial Digital Twins',
      'Hyper-Realistic Simulators (Training)',
      'Virtual Try-On & Generative Design',
      'Synthetic Sandboxes for Innovation',
      'On-Demand Content Generation',
    ],
    stats: [
      { value: '60%', label: 'Synthetic training data 2030' },
      { value: '$2.34B', label: 'Synthetic data market 2030' },
      { value: '90%', label: 'Reduction in testing costs' },
      { value: 'LGPD', label: 'Compliance by design' },
    ],
    deepDive: {
      overview: 'The Synthetic Economy is a new economic layer where AI generates value at near-zero marginal cost: synthetic data replacing real data, infinite on-demand content, simulations of entire markets, digital twins reproducing factories and portfolios, and assets that don\'t exist in the physical world — but have real value and direct business impact. It\'s the most disruptive theme on the 2026 innovation agenda: for corporates, it represents both a threat (software and consulting suppliers may disappear) and an opportunity (replacing real data protected by LGPD).',
      whyItMatters: 'Your company wants to launch new products but lacks data, compliance is blocking, or testing in the real world is too expensive? The Synthetic Economy is the answer: AI generates the data, simulates the scenarios, and validates the products — all without touching a real customer, stopping a production line, or facing regulatory risk. Banks train credit models on synthetic datasets with LGPD compliance guaranteed by design. Industries test thousands of assembly line configurations on digital twins. Hospitals generate synthetic medical records for clinical research. HR trains leaders in adaptive hyper-realistic simulators.',
      marketSize: 'The global synthetic data market is expected to reach US$2.34 billion by 2030 (35%+ CAGR). Digital twins surpass US$48 billion by 2029 (38% CAGR). AI-generated content (text, image, video, code) moves a combined ecosystem of US$100B+ by 2030. In finance, digital twins for stress testing, portfolio simulation, and pricing models are already in use at the world\'s largest banks.',
      futureOutlook: 'Credit models trained 100% on synthetic data will become a regulatory standard in markets sensitive to LGPD/GDPR. Products will be created, tested, and optimized entirely in synthetic environments before going into physical production. Adaptive simulations will replace static role plays in corporate training. Factories will operate "test-in-twin-first" — any reconfiguration validated in the digital twin before the physical one. Clinical research will accelerate via hyper-realistic synthetic medical records, bypassing long ethics committee cycles. The Synthetic Economy doesn\'t replace the real — it protects, accelerates, and democratizes it.',
    },
  },
]

export function getInnovationTrends(lang: Language): InnovationTrend[] {
  return lang === 'en' ? innovationTrendsEn : innovationTrendsPt
}

export const innovationTrends = innovationTrendsPt
