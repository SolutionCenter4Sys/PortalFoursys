import type {
  PortfolioAsset,
  PortfolioAxis,
  PortfolioBundle,
  PortfolioEngagement,
  PortfolioFutureItem,
  PortfolioOffer,
  PortfolioPersona,
  PortfolioSegment,
  PortfolioThesis,
} from '../types'
import type { Language } from '../i18n/types'

// Fonte: Portfólio Brasil v5 (Linha Mestra), Documento de Foco v2 e os 12 kits comerciais
// do ciclo 2026 S2. Só entram aqui os blocos classificados como publicáveis: resumo da
// oferta, método de entrega, one-pager e dados de mercado com fonte. Pricing, benchmark
// competitivo, pitches e playbooks de condução ficam fora por decisão de exposição.

// ─── Tese comercial ───────────────────────────────────────────────────────────

const thesis: PortfolioThesis = {
  label: 'Inteligência Artificial aplicada à transformação de negócios',
  sequence: ['Marca', 'Pipeline', 'Ticket'],
  description:
    'O portfólio se organiza em oito eixos de valor, separados por função na conversa. Três eixos são de diferenciação: definem posicionamento, abrem a agenda no nível certo e criam a preferência. Cinco são de capacidade: sustentam a entrega, o volume e a continuidade da conta. A sequência importa porque quem entra pela capacidade compete por preço, e quem entra pela diferenciação decide o critério.',
  principles: [
    'Diferenciação abre a conversa; capacidade sustenta o contrato. As duas coisas são necessárias e não se substituem.',
    'Toda oferta tem uma porta de entrada declarada e uma fronteira: quando não é a oferta certa, dizemos qual é.',
    'Número próprio só aparece com lastro. Onde a medição ainda não existe, publicamos o método em vez da promessa.',
    'Entrar pela dor que o cliente nomeou é legítimo. O erro é ter só uma porta.',
  ],
}

const institutionalBacking = [
  { value: '26', label: 'anos' },
  { value: '8', label: 'eixos' },
  { value: '18', label: 'ofertas' },
]

// ─── Eixos de valor ───────────────────────────────────────────────────────────

const axes: PortfolioAxis[] = [
  {
    id: 'eixo-1',
    number: 1,
    name: 'Inovação & Estratégia',
    role: 'diferenciacao',
    promise:
      'Transforma inovação de evento isolado em portfólio governado e conecta a decisão do conselho à operação que a executa.',
    audience: 'CEO, board e diretoria de inovação',
    color: '#22D3EE',
    icon: 'sparkles',
  },
  {
    id: 'eixo-2',
    number: 2,
    name: 'IA Estratégica & Governança',
    role: 'diferenciacao',
    promise:
      'Leva a IA de piloto a produção com critério de investimento, governança que se prova e controle sobre a stack.',
    audience: 'CIO, CTO, CDO e comitê de risco',
    color: '#A78BFA',
    icon: 'cpu',
  },
  {
    id: 'eixo-3',
    number: 3,
    name: 'Engenharia & Modernização acelerada por IA',
    role: 'capacidade',
    promise:
      'Moderniza o legado que trava o negócio e sustenta a construção de software em escala industrial, com qualidade medida.',
    audience: 'CIO, CTO, arquitetura e engenharia',
    color: '#8B5CF6',
    icon: 'layers',
  },
  {
    id: 'eixo-4',
    number: 4,
    name: 'Inteligência de Dados & Decisão',
    role: 'capacidade',
    promise:
      'Prepara o dado para a era dos agentes e transforma informação dispersa em decisão confiável e rastreável.',
    audience: 'CDO, CIO e áreas de negócio',
    color: '#38BDF8',
    icon: 'database',
    upcomingOffers: [
      '4.1 Data Readiness para IA',
      '4.2 Decision Intelligence',
      '4.3 Autonomous Intelligence',
    ],
  },
  {
    id: 'eixo-5',
    number: 5,
    name: 'Cloud, DevOps & FinOps · SharpOps',
    role: 'capacidade',
    promise:
      'Sustenta a plataforma cloud-native e a esteira de entrega, e recupera previsibilidade de custo em cloud e on-premise, com a economia medida contra a linha de base do cliente.',
    audience: 'CFO, CIO, arquitetura e infraestrutura',
    color: '#34D399',
    icon: 'cloud',
    upcomingOffers: [
      '5.2 Otimização de Ambientes On-Premise',
      '5.3 Tokenomics',
    ],
  },
  {
    id: 'eixo-6',
    number: 6,
    name: 'Cybersegurança · Zeragon',
    role: 'capacidade',
    promise:
      'Segurança como pré-condição da transformação e da governança de IA, conduzida pela Zeragon, empresa do grupo.',
    audience: 'CISO, risco e compliance',
    color: '#84CC16',
    icon: 'shield-check',
    upcomingOffers: ['Demais frentes da Zeragon detalhadas fora deste ciclo'],
  },
  {
    id: 'eixo-7',
    number: 7,
    name: 'Sustentação, Continuidade e Evolução',
    role: 'capacidade',
    promise:
      'Assume a operação de ambientes críticos com SLA, governança e visibilidade executiva, e mantém a evolução acontecendo sem sobressalto.',
    audience: 'CIO, head de operações de TI e donos de sistema crítico',
    color: '#818CF8',
    icon: 'life-buoy',
    upcomingOffers: ['Modelos de operação assistida detalhados fora deste ciclo'],
  },
  {
    id: 'eixo-8',
    number: 8,
    name: 'Produtos Foursys',
    role: 'diferenciacao',
    promise:
      'Entrega resultado por produto próprio em modelo de assinatura, com go-live em semanas em vez de projeto de meses.',
    audience: 'CIO, COO e diretores de área que precisam de solução em produção rápido',
    color: '#4ADE80',
    icon: 'package-check',
    upcomingOffers: ['Novas soluções do catálogo publicadas a cada ciclo'],
  },
]

// ─── Ofertas ──────────────────────────────────────────────────────────────────

const offers: PortfolioOffer[] = [
  // ══ Eixo 1 ══════════════════════════════════════════════════════════════════
  {
    id: 'roadmap-inovacao',
    code: '1.1',
    axisId: 'eixo-1',
    role: 'diferenciacao',
    name: 'Roadmap e Projetos de Inovação',
    headline: 'Inovação que vira crescimento mensurável',
    tagline: 'Inovação deixa de ser evento e passa a ser portfólio governado.',
    whatItIs:
      'Não é ideação nem hackathon. É a arquitetura de gestão que transforma inovação de evento isolado em portfólio governado, com funil, critério de avanço e ligação direta com a capacidade de construir. Estruturamos o modelo e transferimos a operação para o time do cliente.',
    pain:
      'A empresa gera ideias, patrocina provas de conceito e ainda assim não consegue mostrar o que a inovação devolveu. Falta funil com gate, critério comparável entre iniciativas e uma ponte entre o que foi aprovado e quem constrói.',
    outcomes: [
      'Funil de inovação com estágios, gates e critério de avanço explícito',
      'Portfólio priorizado, com leitura de negócio e não só de viabilidade técnica',
      'Modelo de financiamento e gestão do portfólio conectado ao orçamento',
      'Governança definida: quem decide o quê, em que fórum e com que evidência',
      'Ligação entre iniciativa aprovada e capacidade de construção',
      'Operação transferida ao time do cliente, com o playbook adaptado à casa',
    ],
    differentials: [
      {
        title: 'Praticamos antes de oferecer',
        detail:
          'Operamos o nosso próprio Innovation Center e já replicamos o modelo em hubs e aceleradoras de terceiros. O playbook vem de operação, não de literatura.',
      },
      {
        title: 'Playbook adaptável, não modelo de prateleira',
        detail:
          'O funil é desenhado sobre a estrutura de decisão que já existe na casa, em vez de importar um framework que a organização não consegue sustentar.',
      },
      {
        title: 'Inovação conectada à capacidade de construir',
        detail:
          'A mesma casa que estrutura a governança constrói o que for aprovado, o que elimina o vão entre gate aprovado e entrega.',
      },
      {
        title: 'Leitura de negócio na priorização',
        detail:
          'A fila é ordenada por efeito no negócio, não por entusiasmo técnico ou por quem defendeu melhor a ideia.',
      },
    ],
    phases: [
      {
        name: 'Diagnóstico',
        duration: 'semanas 1 a 3',
        focus: 'Leitura da agenda de inovação atual, do funil real e de onde as iniciativas morrem.',
      },
      {
        name: 'Estruturação',
        duration: 'semanas 3 a 8',
        focus: 'Desenho do funil, gates, critério de priorização e modelo de financiamento do portfólio.',
      },
      {
        name: 'Ativação e transferência',
        duration: 'semanas 8 a 12',
        focus: 'Operação assistida do modelo e transferência para o time do cliente via Fusion Teams.',
      },
    ],
    totalDuration: '10 a 12 semanas',
    marketStats: [],
    personas: [
      {
        role: 'CEO e board',
        value: 'Passa a ter resposta defensável para o que a inovação devolveu no período.',
      },
      {
        role: 'Diretor de Inovação ou Transformação',
        value: 'Ganha funil com critério, o que reduce a disputa política por patrocínio de ideia.',
      },
      {
        role: 'CIO e CTO',
        value: 'Recebe uma fila de iniciativas já dimensionada em vez de demanda avulsa.',
      },
    ],
    cta: 'Traga a agenda de inovação atual. Em uma conversa curta lemos o funil como ele está hoje e mostramos onde as iniciativas estão morrendo.',
    connects: ['1.2', '1.3', '2.1A'],
    boundary:
      'Se o objetivo é gerar volume de ideias ou sensibilizar a organização, esta não é a oferta: aqui o produto é governança do portfólio.',
    proof: {
      status: 'sem-lastro',
      note: 'O kit pede iniciativas do próprio Innovation Center que avançaram ou morreram por gate, e esse material ainda não foi documentado. Não há case liberado.',
    },
    legacyEquivalent: {
      label: 'Inovação → Estrutura e Governança de Inovação, Gestão do Portfólio (TBM)',
      section: 'innovation',
    },
  },
  {
    id: 'lab-as-a-service',
    code: '1.2',
    axisId: 'eixo-1',
    role: 'diferenciacao',
    name: 'Lab as a Service',
    headline: 'Valide antes de investir pesado',
    tagline: 'Da hipótese ao MVP, sem carregar a lógica corporativa para dentro do experimento.',
    whatItIs:
      'Laboratório operado como serviço, que leva uma tese de negócio da hipótese ao MVP em ciclos curtos. Método e engenharia na mesma casa, com a decisão de seguir ou parar tomada com evidência de uso, não com opinião.',
    pain:
      'A lógica corporativa e a lógica de experimentação são incompatíveis: comitê mensal, orçamento anual e aversão a erro matam a tese antes de ela ser testada. O resultado é investir pesado no que não foi validado, ou não investir em nada.',
    outcomes: [
      'Tese de negócio enquadrada com hipótese crítica e critério de morte explícito',
      'MVP funcionando, com usuário real e evidência de uso',
      'Decisão fundamentada de escalar, pivotar ou encerrar',
      'Arquitetura e código entregues ao cliente, prontos para evoluir',
      'Aprendizado documentado, inclusive das teses descartadas',
      'Propriedade integral do resultado: o cliente mantém 100% do que foi criado',
    ],
    differentials: [
      {
        title: 'Método e engenharia na mesma casa, sem equity',
        detail:
          'Não somos venture builder: não pedimos participação no que é criado. O cliente mantém 100% da propriedade do produto e do código.',
      },
      {
        title: 'Visão de negócio antes da solução',
        detail:
          'O ciclo começa pela hipótese de negócio e pelo critério de morte, não pela escolha de stack ou de plataforma.',
      },
      {
        title: 'Jornada acelerada por IA',
        detail:
          'A construção usa nossos aceleradores quando faz sentido, e roda igualmente bem na stack do próprio cliente.',
      },
    ],
    phases: [
      {
        name: 'Enquadramento',
        duration: 'semanas 1 a 2',
        focus: 'Definição da tese, da hipótese crítica e do critério que encerra o experimento.',
      },
      {
        name: 'Experimentação e MVP',
        duration: 'semanas 2 a 8',
        focus: 'Construção do mínimo necessário para testar a hipótese com usuário real.',
      },
      {
        name: 'Decisão',
        duration: 'a partir da semana 8',
        focus: 'Leitura da evidência e decisão de escalar, pivotar ou encerrar, com o aprendizado registrado.',
      },
    ],
    totalDuration: '8 a 12 semanas por tese',
    marketStats: [],
    personas: [
      {
        role: 'CEO e board',
        value: 'Testa aposta nova sem comprometer capital de projeto completo.',
      },
      {
        role: 'Diretor de Inovação',
        value: 'Ganha um caminho de validação que a estrutura corporativa não consegue oferecer internamente.',
      },
      {
        role: 'Líder de produto ou de nova unidade',
        value: 'Chega ao comitê com produto funcionando e evidência de uso, não com apresentação.',
      },
    ],
    cta: 'Traga uma tese travada — daquelas que ninguém aprova nem descarta. Em um ciclo curto ela sai com evidência para decidir.',
    connects: ['1.1', '1.3', '3.2'],
    boundary:
      'Se a decisão de construir já foi tomada e o escopo está fechado, o caminho é engenharia direto, não laboratório.',
    proof: {
      status: 'em-validacao',
      note: 'O kit aponta o NEXUS como case-âncora (produto próprio em produção com cliente pagante), mas o detalhamento de setor, porte e escopo ainda depende de liberação. Os demais MVPs seguem pendentes de documentação.',
    },
    legacyEquivalent: {
      label: 'IA na Foursys → Laboratório de Inovação Aberta; Inovação → Studio de Inovação',
      section: 'innovation',
    },
  },
  {
    id: 'novo-modelo-operacional',
    code: '1.3',
    axisId: 'eixo-1',
    role: 'diferenciacao',
    portfolioRole: 'Conversa de board',
    name: 'Novo Modelo Operacional para a Era da IA',
    headline: 'Reinvente, não só otimize',
    tagline: 'A régua que separa quem ganhou eficiência de quem reinventou a estrutura de custo.',
    whatItIs:
      'Leitura de maturidade e construção da tese de operação para a era da IA, percorrendo a régua que vai de eficiência a aumentação e a reinvenção. Termina em roadmap de travessia: da decisão do conselho à operação funcionando.',
    pain:
      'A armadilha é comemorar quinze por cento de produtividade enquanto o concorrente reinventa a própria estrutura de custo. Eficiência pontual não muda a posição competitiva, e a conversa de board fica sem régua para saber em que degrau a casa está.',
    outcomes: [
      'Leitura de maturidade da operação nos três degraus da régua',
      'Tese de modelo operacional construída sobre a cultura que existe, não sobre um modelo de prateleira',
      'Roadmap de travessia com sequência, dependências e decisões de conselho',
      'Efeito esperado na estrutura de custo, não só na produtividade da tarefa',
      'Definição de quais capacidades ficam dentro e quais são compradas',
      'Linguagem comum entre conselho, diretoria e operação sobre o que muda',
    ],
    differentials: [
      {
        title: 'Praticamos na própria casa',
        detail:
          'A travessia que descrevemos é a que estamos fazendo: squads com agentes, plataforma própria em produção e trilha de capacitação interna com belts.',
      },
      {
        title: 'Tese sobre a cultura existente',
        detail:
          'O modelo é desenhado a partir de como a organização decide hoje. Modelo importado sem essa leitura não sobrevive ao primeiro trimestre.',
      },
      {
        title: 'Da decisão do conselho à operação funcionando',
        detail:
          'A mesma casa que constrói a tese executa a travessia, o que evita o desenho que ninguém consegue implementar.',
      },
    ],
    phases: [
      {
        name: 'Leitura de maturidade',
        duration: 'semanas 1 a 3',
        focus: 'Diagnóstico do degrau atual e do que trava a passagem para o próximo.',
      },
      {
        name: 'Tese de modelo operacional',
        duration: 'semanas 3 a 7',
        focus: 'Construção da tese de operação e do efeito esperado na estrutura de custo.',
      },
      {
        name: 'Roadmap de travessia',
        duration: 'semanas 7 a 10',
        focus: 'Sequenciamento das ondas, dependências e pontos de decisão do conselho.',
      },
    ],
    totalDuration: '8 a 10 semanas',
    marketStats: [
      {
        stat: 'Até 2027, metade das decisões de negócio será aumentada ou automatizada por agentes de IA.',
        source: 'Gartner, via itbrief.news, maio de 2026',
      },
    ],
    personas: [
      {
        role: 'CEO e board',
        value: 'Ganha régua para saber se a casa está otimizando ou realmente reinventando.',
      },
      {
        role: 'COO',
        value: 'Recebe a travessia desenhada em ondas, com efeito de capacidade e de custo declarado.',
      },
      {
        role: 'CIO e CTO',
        value: 'Alinha a agenda de tecnologia à tese de operação, em vez de responder a demandas soltas.',
      },
    ],
    cta: 'Uma conversa de board sobre a régua de maturidade: em que degrau a operação está hoje e o que separa a casa do degrau seguinte.',
    connects: ['3.4', '2.3', '2.2', '1.1'],
    boundary:
      'Se a pergunta é qual processo automatizar primeiro, o caminho é Hiper-eficiência. Esta oferta trata do modelo, não da cadeia.',
    proof: {
      status: 'sem-lastro',
      note: 'O kit registra a narrativa da própria travessia da Foursys como o case mais importante a documentar de todo o portfólio — e ele ainda não existe em formato liberado.',
    },
  },

  // ══ Eixo 2 ══════════════════════════════════════════════════════════════════
  {
    id: 'ai-strategy-roadmap',
    code: '2.1A',
    axisId: 'eixo-2',
    role: 'diferenciacao',
    name: 'AI Strategy & Roadmap',
    headline: 'Decida onde investir em IA com critério, não com intuição',
    tagline: 'O custo unitário entra na conta antes da aprovação, não depois.',
    whatItIs:
      'Estratégia e roadmap de IA com o custo de inferência dimensionado antes da decisão de investir. Percorre identificação de casos, quantificação de valor, dimensionamento técnico, custo unitário e retorno, na sequência que sustenta aprovação.',
    pain:
      'A dor não é falta de casos de uso, é excesso deles sem critério de decisão. Some-se a isso o custo de modelo, que escala com o uso e é o item mais subestimado da conta — e também o mais defensável quando entra na priorização.',
    entryTriggers: [
      'Board cobrou uma agenda de IA',
      'Lista de casos de uso sem ordem',
      'Custo de modelo surpreendeu depois do piloto',
      'Investimento travado por falta de retorno estimado',
    ],
    outcomes: [
      'Casos de uso priorizados por valor e complexidade, comparáveis entre áreas',
      'Custo unitário de inferência estimado por caso, antes da aprovação',
      'Retorno projetado com premissas explícitas e revisáveis',
      'Roadmap com sequência, dependências técnicas e pontos de decisão',
      'Recomendação de arquitetura sem vínculo com fornecedor',
      'Plano de capacitação para os times que vão operar',
    ],
    differentials: [
      {
        title: 'Custo de inferência dimensionado antes da aprovação',
        detail:
          'Um método de cinco etapas leva o caso de uso da identificação ao custo unitário e ao retorno. É o que faz iniciativas mudarem de posição na fila.',
      },
      {
        title: 'Priorização feita por quem constrói',
        detail:
          'A leitura de complexidade vem de engenharia e dados, não de consultoria que entrega o roadmap e sai antes da execução.',
      },
      {
        title: 'Recomendação sem vínculo com fornecedor',
        detail:
          'Não revendemos licença nem consumo de plataforma, então a recomendação de modelo e de arquitetura não tem interesse embutido.',
      },
    ],
    phases: [
      {
        name: 'Estratégia',
        duration: '3 a 4 semanas',
        focus: 'Enquadramento da ambição, dos drivers de negócio e do critério de decisão.',
      },
      {
        name: 'Mapeamento',
        duration: '4 a 6 semanas',
        focus: 'Identificação, quantificação e dimensionamento dos casos, com custo unitário e retorno.',
      },
      {
        name: 'Aceleração',
        duration: '8 a 16 semanas',
        focus: 'Execução das primeiras ondas do roadmap com o time do cliente envolvido.',
      },
    ],
    totalDuration: 'a calibrar por escopo',
    marketStats: [
      {
        stat: '88% dos pilotos de agentes de IA nunca chegam à produção. Os bloqueadores são infraestrutura (41%), governança e segurança (38%) e medição de retorno (33%).',
        source: 'Anaconda e Forrester, via Digital Applied, abril de 2026',
      },
      {
        stat: 'Mais de 70% das organizações estão modernizando infraestrutura para suportar IA.',
        source: 'Deloitte, 2026',
      },
    ],
    personas: [
      {
        role: 'CIO e CTO',
        value: 'Sai com uma fila defensável e com o custo de operação da IA estimado antes do compromisso.',
      },
      {
        role: 'CDO',
        value: 'Vê onde o dado é pré-condição e onde ele é o próprio gargalo do caso de uso.',
      },
      {
        role: 'CFO',
        value: 'Recebe retorno projetado com premissa explícita, incluindo o custo por execução.',
      },
    ],
    cta: 'Traga sua lista de iniciativas de IA. Mostramos quais mudam de posição quando o custo unitário entra na conta.',
    connects: ['2.1C', '2.1B', '2.2', '2.3'],
    boundary:
      'Se ainda não há critério nem orçamento definido, o caminho de menor atrito é o AI Discovery Workshop.',
    proof: {
      status: 'em-validacao',
      note: 'Os cases de estratégia dependem de liberação sobre setor, porte e escopo. O que já é demonstrável é a plataforma própria em produção.',
    },
    legacyEquivalent: {
      label: 'IA na Foursys → AI Strategy & Roadmap',
      section: 'ai-foursys',
    },
  },
  {
    id: 'governanca-soberania-ia',
    code: '2.1B',
    axisId: 'eixo-2',
    role: 'diferenciacao',
    portfolioRole: 'Âncora do portfólio',
    name: 'Governança e Soberania de IA',
    headline: 'Escale IA sem perder o controle dela',
    tagline: 'Política de IA é o que você publica; governança é o que você prova depois.',
    whatItIs:
      'Governança de IA instrumentada, não declarada: inventário vivo de agentes, matriz de risco por caso de uso, guardrails aplicados em runtime e trilha auditável. Inclui a camada de soberania — independência de fornecedor, residência do dado e controle sobre a stack.',
    pain:
      'Quase nenhuma organização sabe quantos agentes tem em produção, quem responde por cada um e o que eles acessaram. A política existe no papel e a governança não existe no runtime, o que transforma cada auditoria e cada incidente em investigação manual.',
    outcomes: [
      'Inventário vivo dos agentes e modelos em produção, com dono nomeado',
      'Matriz de risco por caso de uso, com classificação e controles proporcionais',
      'Guardrails aplicados na execução, não apenas descritos em política',
      'Trilha auditável de decisão automatizada, pronta para auditoria e regulador',
      'Régua de maturidade e painel de comitê para acompanhar a evolução',
      'Independência declarada: multi-cloud, troca de modelo e controle da stack',
    ],
    differentials: [
      {
        title: 'Governança instrumentada, não declarada',
        detail:
          'A diferença é provar depois. Entregamos inventário, trilha e guardrail rodando, não um documento de política que ninguém consegue verificar.',
      },
      {
        title: 'Soberania em três dimensões',
        detail:
          'Independência de fornecedor, residência territorial do dado e controle sobre a stack. Rodar em região brasileira de um hyperscaler resolve a segunda e não resolve a terceira.',
      },
      {
        title: 'Conformidade acompanhada, não presumida',
        detail:
          'A leitura regulatória é revisada a cada ciclo, porque o calendário europeu e o brasileiro estão em movimento.',
      },
      {
        title: 'Governança em runtime, com quem opera',
        detail:
          'A instrumentação é implantada na nossa plataforma ou na stack do cliente, e a operação é transferida por Fusion Teams.',
      },
    ],
    components: [
      'Protocolo de inventário de agentes e modelos',
      'Matriz de risco por caso de uso',
      'Biblioteca de políticas e guardrails',
      'Trilha auditável de decisão automatizada',
      'Roteamento por política (qual modelo pode o quê)',
      'Painel de comitê de IA',
      'Régua de maturidade de governança',
    ],
    assets: ['NEXUS', 'Fusion Teams', 'Zeragon'],
    phases: [
      {
        name: 'Raio-X',
        duration: '3 a 5 semanas',
        focus: 'Levantamento do que já roda, de quem responde e de onde estão as lacunas de controle.',
      },
      {
        name: 'Régua e política',
        duration: '4 a 8 semanas',
        focus: 'Definição da matriz de risco, das políticas e da régua de maturidade da casa.',
      },
      {
        name: 'Instrumentação',
        duration: '8 a 16 semanas por onda',
        focus: 'Implantação de inventário, guardrails, trilha e painel no ambiente do cliente.',
      },
      {
        name: 'Operação e transferência',
        duration: '3 a 6 meses',
        focus: 'Operação assistida do comitê e transferência da rotina para o time do cliente.',
      },
    ],
    totalDuration: 'a calibrar por escopo',
    marketStats: [
      {
        stat: '57% das organizações já têm agentes de IA em produção.',
        source: 'LangChain, State of AI Agents',
      },
      {
        stat: 'Quase 38% já operam mais de 100 agentes — número que dobrou em um único trimestre.',
        source: 'Gravitee, State of AI Agent Security, abril de 2026',
      },
      {
        stat: '44% colocam agentes em produção sem dono nomeado e apenas 21% têm modelo maduro de governança.',
        source: 'Forrester, via Digital Applied, 2026',
      },
      {
        stat: 'O uso de IA não autorizada dentro das empresas cresceu quatro vezes em um ano.',
        source: 'Verizon Data Breach Investigations Report, 2026',
      },
      {
        stat: 'Mais de 40% das organizações terão algum incidente ligado a IA não autorizada até 2030.',
        source: 'Gartner',
      },
    ],
    regulatory: [
      'Digital Omnibus — Regulamento (UE) 2026/1744, em vigor desde 27 de julho de 2026: adia o Anexo III para 2 de dezembro de 2027 e o Anexo I para 2 de agosto de 2028.',
      'Artigo 50 do AI Act europeu (transparência) já vale desde 2 de agosto de 2026.',
      'PL 2338/2023, marco legal da IA no Brasil, em tramitação na Câmara.',
      'BACEN com estudo publicado sobre IA no sistema financeiro, ainda sem norma.',
      'LGPD aplicável a todo tratamento de dado pessoal por modelo ou agente.',
    ],
    personas: [
      {
        role: 'CIO e CTO',
        value: 'Recupera a visão de quantos agentes existem, quem responde por eles e o que acessam.',
      },
      {
        role: 'CISO e risco',
        value: 'Ganha controle verificável e trilha auditável em vez de política declarativa.',
      },
      {
        role: 'Jurídico e compliance',
        value: 'Passa a acompanhar o calendário regulatório com evidência produzida pelo próprio ambiente.',
      },
      {
        role: 'CEO e board',
        value: 'Tem resposta para quem assina embaixo das decisões automatizadas da companhia.',
      },
    ],
    cta: 'Traga o inventário de agentes que você não consegue fechar hoje. Ele é o melhor diagnóstico inicial que existe.',
    connects: ['2.1C', '2.2', '2.1A', '2.3'],
    boundary:
      'Se a organização ainda não tem nada em produção, a conversa começa por estratégia ou por discovery — governança sem parque para governar vira documento.',
    proof: {
      status: 'em-validacao',
      note: 'Parte dos sete componentes já é ativo formalizado e parte precisa de confirmação. A instrumentação em runtime é demonstrável na plataforma própria; os cases de cliente dependem de liberação.',
    },
    legacyEquivalent: {
      label: 'IA na Foursys → Governança de IA e 10 Pilares de Governança',
      section: 'ai-foursys',
    },
  },
  {
    id: 'ai-discovery-workshop',
    code: '2.1C',
    axisId: 'eixo-2',
    role: 'diferenciacao',
    portfolioRole: 'Rampa de entrada',
    name: 'AI Discovery Workshop',
    headline: 'Saia com quatro decisões, não com cinquenta ideias',
    tagline: 'O produto é decisão fundamentada, incluindo o que foi descartado e por quê.',
    whatItIs:
      'Engajamento curto que leva a organização de "precisamos fazer alguma coisa com IA" a decisões defensáveis: quais casos merecem investimento, qual a prontidão real da casa e qual o primeiro recorte de roadmap. Conduzido por quem executa depois.',
    pain:
      'Três situações levam a esta conversa: pressão sem direção, quando o board cobrou e cada área trouxe uma ideia; orçamento travado por incerteza, a mais comum; e o piloto que não foi a lugar nenhum. O mercado de workshop está saturado de sensibilização que termina em relatório que ninguém abre.',
    entryTriggers: [
      'Pressão do board sem direção definida',
      'Orçamento travado por incerteza',
      'Piloto anterior que não avançou',
      'Cada área trouxe uma ideia diferente',
    ],
    outcomes: [
      'Mapa de casos priorizado, com valor estimado e complexidade comparável entre áreas',
      'Leitura de prontidão nas quatro dimensões: dado, capacidade técnica, capacidade de negócio e governança',
      'Primeiro recorte de roadmap: o que fazer antes, o que fica para depois e por quê',
      'Ordem de grandeza de esforço e de investimento',
      'Motivo registrado de cada descarte — o resultado mais subestimado',
      'Alinhamento entre áreas e material que o patrocinador usa para defender internamente',
    ],
    differentials: [
      {
        title: 'O produto é decisão, não ideação',
        detail:
          'O workshop otimiza para descarte fundamentado. Sair com quatro casos e o motivo de ter descartado os outros vale mais que sair com cinquenta possibilidades.',
      },
      {
        title: 'Conduzido por quem executa depois',
        detail:
          'A sala é conduzida por engenharia, dados e IA, não por facilitador de método. O dimensionamento vem de quem vai construir.',
      },
      {
        title: 'Prontidão nas quatro dimensões que travam pilotos',
        detail:
          'Dado, capacidade técnica, capacidade de negócio e governança. São exatamente as dimensões que aparecem como bloqueador quando o piloto não vira produção.',
      },
    ],
    phases: [
      {
        name: 'Preparação e enquadramento',
        duration: 'a calibrar',
        focus: 'Definição do perímetro, das áreas envolvidas e do critério de decisão.',
      },
      {
        name: 'Sessões de levantamento',
        duration: 'a calibrar',
        focus: 'Coleta dos casos candidatos diretamente com as áreas donas do processo.',
      },
      {
        name: 'Dimensionamento e prontidão',
        duration: 'a calibrar',
        focus: 'Estimativa de esforço e leitura de prontidão nas quatro dimensões.',
      },
      {
        name: 'Priorização e roadmap de entrada',
        duration: 'a calibrar',
        focus: 'Ordenação dos casos e definição do primeiro recorte, com os descartes registrados.',
      },
      {
        name: 'Devolutiva executiva',
        duration: 'a calibrar',
        focus: 'Apresentação das decisões ao patrocinador, em formato de defesa interna.',
      },
    ],
    totalDuration: 'a calibrar por escopo',
    marketStats: [
      {
        stat: '88% dos pilotos de agentes de IA nunca chegam à produção. Infraestrutura (41%), governança e segurança (38%) e medição de retorno (33%) são os bloqueadores.',
        source: 'Anaconda e Forrester, via Digital Applied, abril de 2026',
      },
    ],
    personas: [
      {
        role: 'CIO, CTO ou CDO',
        value: 'Sai com fila priorizada e leitura de prontidão em vez de lista de possibilidades.',
      },
      {
        role: 'Diretor de Inovação ou Transformação',
        value: 'Ganha critério comparável entre áreas e encerra a disputa por patrocínio de ideia.',
      },
      {
        role: 'CEO e VP',
        value: 'Recebe a devolutiva executiva pronta para sustentar a decisão diante do board.',
      },
    ],
    cta: 'Escolha um caso de uso que vocês estão considerando. Em uma conversa percorremos o método por alto sobre ele.',
    connects: ['2.1A', '2.1B', '2.2', '2.3'],
    boundary:
      'Se já existe critério e orçamento, vá direto para AI Strategy & Roadmap. Se o objetivo é capacitar pessoas, esta não é a oferta.',
    proof: {
      status: 'sem-lastro',
      note: 'O número de discoveries conduzidos e a taxa de conversão da rampa são a pendência número um do eixo, e ainda não há dado consolidado para publicar.',
    },
  },
  {
    id: 'fabrica-agentes-ia',
    code: '2.2',
    axisId: 'eixo-2',
    role: 'capacidade',
    portfolioRole: 'Delivery puxado',
    name: 'Fábrica de Agentes de IA',
    headline: 'A unidade de entrega é agente em produção, não agente construído',
    tagline: 'O gargalo não é o primeiro agente. É o quadragésimo continuar de pé.',
    whatItIs:
      'Desenho, construção e operação de agentes de IA em escala industrial, com padrão de construção, governança embutida e a infraestrutura que sustenta agente em produção. Inclui o modelo de sustentação: quem responde, como se mede, como se atualiza e como se desativa.',
    pain:
      'Construir o primeiro agente deixou de ser difícil. O problema é colocá-los e mantê-los em produção em escala: a demanda cresce mais rápido que a capacidade de construir com padrão, e em doze meses a casa tem um parque heterogêneo que ninguém mantém nem audita.',
    outcomes: [
      'Agentes prontos para produção, cada um com dono, trilha e guardrail',
      'Segurança de agente por padrão, e não como camada adicionada depois',
      'Padrão de construção reutilizável, que reduz o custo do agente seguinte',
      'Custo por execução medido e acompanhado como instrumento de decisão',
      'Modelo de sustentação com critério de atualização e de desativação',
      'Capacidade transferida ao time do cliente',
    ],
    differentials: [
      {
        title: 'Agente pronto para produção como unidade de entrega',
        detail:
          'No primeiro dia já se nomeia tudo que precisa estar resolvido para o agente ir a produção. Agente construído que não sobe não conta como entrega.',
      },
      {
        title: 'Governança embutida na construção',
        detail:
          'Dono, classificação de risco, guardrail e trilha entram durante a construção. Governança aplicada depois é retrabalho e costuma não acontecer.',
      },
      {
        title: 'Escala industrial com integração ao legado crítico',
        detail:
          'O agente precisa conversar com o sistema que sustenta a operação, e é aí que a maioria das plataformas para.',
      },
    ],
    components: [
      'Identidade própria por agente, com credencial gerenciada',
      'Menor privilégio e segregação de ambiente',
      'Proteção contra injeção de prompt',
      'Gestão de segredo',
      'Arquitetura de referência e padrão de construção',
      'Instrumentação e esteira de deploy',
    ],
    assets: ['NEXUS', 'Fusion Teams', 'Zeragon'],
    phases: [
      {
        name: 'Enquadramento e backlog',
        duration: 'a calibrar',
        focus: 'Definição dos agentes candidatos, dos donos e do critério de produção.',
      },
      {
        name: 'Fundação',
        duration: 'a calibrar',
        focus: 'Arquitetura de referência, padrão de construção, instrumentação e esteira de deploy.',
      },
      {
        name: 'Ondas de construção',
        duration: 'a calibrar',
        focus: 'Construção dos agentes sobre a fundação, cada onda com escopo fechado.',
      },
      {
        name: 'Sustentação e transferência',
        duration: 'a calibrar',
        focus: 'Operação do parque e transferência de capacidade por Fusion Teams.',
      },
    ],
    totalDuration: 'a calibrar por escopo',
    marketStats: [
      {
        stat: '88% dos pilotos de agentes de IA nunca chegam à produção. Dois dos três bloqueadores — governança e segurança (38%) e medição de retorno (33%) — não são de construção, e sim de sustentação.',
        source: 'Anaconda e Forrester, via Digital Applied, abril de 2026',
      },
      {
        stat: '44% colocam agentes em produção sem dono nomeado e apenas 21% têm modelo maduro de governança para agentes autônomos.',
        source: 'Forrester, via Digital Applied, 2026',
      },
      {
        stat: 'Quase 38% já operam mais de 100 agentes — número que praticamente dobrou em um trimestre.',
        source: 'Gravitee, State of AI Agent Security, abril de 2026',
      },
    ],
    personas: [
      {
        role: 'CIO e CTO',
        value: 'Ganha padrão e instrumentação para escalar sem gerar parque ingovernável.',
      },
      {
        role: 'COO e dono do processo',
        value: 'Recebe agente sustentado na operação, com responsável nomeado.',
      },
      {
        role: 'Arquitetura e segurança',
        value: 'Vê identidade, privilégio e trilha resolvidos por padrão de construção.',
      },
    ],
    cta: 'Escolha um agente que já está em produção na sua casa. Percorremos com você o que precisaria estar resolvido para ele sobreviver ao próximo ano.',
    connects: ['2.1C', '2.1B', '2.3', '2.1A'],
    boundary:
      'Esta oferta é puxada, não de abertura. Se o assunto é software, o caminho é Agentic Squad Model; se é processo de negócio, é Hiper-eficiência.',
    editorialCare:
      'Não reforçar contagem de agentes como métrica de sucesso. Quantidade de agentes é sintoma; agente sustentado em produção é o resultado.',
    proof: {
      status: 'sem-lastro',
      note: 'A prova central da oferta seria o número real de agentes em produção sustentados, com tempo de vida e taxa de sobrevivência. Esse dado ainda não está consolidado.',
    },
    legacyEquivalent: {
      label: 'IA na Foursys → Criação de Agentes de IA',
      section: 'ai-foursys',
    },
  },
  {
    id: 'hiper-eficiencia',
    code: '2.3',
    axisId: 'eixo-2',
    role: 'diferenciacao',
    name: 'IA para Hiper-eficiência de Áreas Meio e de Negócio',
    headline: 'Absorva mais volume sem crescer a operação na mesma proporção',
    tagline: 'Três alavancas na mesma intervenção: desenho do trabalho, automação e IA.',
    whatItIs:
      'Redesenho de cadeias de processo em áreas meio e de negócio, combinando organização do trabalho, automação e IA na mesma intervenção, com medição antes e depois e estrutura de sustentação. Aplica-se a back office, financeiro, compras, jurídico, RH, atendimento, sinistros, crédito e suprimentos.',
    pain:
      'A organização já automatizou tarefas e o custo da operação não caiu, porque o problema não era a tarefa: era o desenho do processo em volta dela. O tempo se perde nas fronteiras entre áreas — espera, reentrada de dado, conferência dupla, exceção manual e conhecimento concentrado em poucas pessoas.',
    entryTriggers: [
      'Automação já feita sem queda no custo da operação',
      'Volume crescendo mais rápido que a estrutura consegue absorver',
      'Exceção e documento não estruturado consumindo tempo do time',
      'Conhecimento de processo concentrado em poucas pessoas',
      'Meta de eficiência cobrada sem linha de base confiável',
    ],
    outcomes: [
      'Processo redesenhado com ganho medido contra linha de base própria',
      'Linha de base quantificada como entregável, não como premissa',
      'Redução de tempo de ciclo e de retrabalho na cadeia escolhida',
      'Capacidade de absorver volume maior sem crescer a operação na mesma proporção',
      'Exceção deixando de depender de conhecimento concentrado em poucas pessoas',
      'Ganho sustentado com indicador, dono e rotina de revisão',
      'Padrão replicável para as cadeias seguintes',
    ],
    differentials: [
      {
        title: 'Três alavancas, uma equipe',
        detail:
          'Organização do trabalho, automação e IA entram na mesma intervenção. Separadas em três fornecedores, o ganho se perde na costura.',
      },
      {
        title: 'IA onde a automação tradicional sempre parou',
        detail:
          'A exceção, o documento não estruturado e o julgamento. É o pedaço do processo que o robô nunca alcançou e que concentra o custo.',
      },
      {
        title: 'Ganho medido e sustentado',
        detail:
          'A linha de base é entregável do diagnóstico, e o ganho fica com indicador, dono e rotina de revisão. Sem isso o resultado se dissolve no ano seguinte.',
      },
      {
        title: 'Transferência com upskilling',
        detail:
          'As pessoas cujas atividades mudam de natureza são requalificadas por Fusion Teams durante o programa.',
      },
    ],
    assets: ['NEXUS', 'Fusion Teams'],
    phases: [
      {
        name: 'Linha de base e diagnóstico',
        duration: '3 a 6 semanas',
        focus: 'Medição da cadeia como ela é hoje e construção do caso de eficiência.',
      },
      {
        name: 'Processo-alvo e caso de eficiência',
        duration: '4 a 6 semanas',
        focus: 'Desenho do processo-alvo com as três alavancas e o ganho projetado.',
      },
      {
        name: 'Implantação por ondas',
        duration: '8 a 20 semanas',
        focus: 'Implantação incremental, com medição a cada onda contra a linha de base.',
      },
      {
        name: 'Sustentação e replicação',
        duration: '3 a 6 meses',
        focus: 'Rotina de sustentação do ganho e replicação do padrão para a cadeia seguinte.',
      },
    ],
    totalDuration: 'a calibrar por escopo',
    marketStats: [],
    regulatory: [
      'Quando a cadeia redesenhada envolve crédito, sinistro ou seleção de pessoas, a decisão automatizada entra no perímetro da LGPD e exige trilha auditável e revisão humana definida.',
    ],
    personas: [
      {
        role: 'COO e diretor de Operações',
        value: 'Absorve crescimento de volume sem crescer a estrutura na mesma proporção.',
      },
      {
        role: 'CFO',
        value: 'Vê o ganho medido contra linha de base auditável, não contra estimativa.',
      },
      {
        role: 'Gerentes das áreas afetadas',
        value: 'Deixam de depender de conhecimento concentrado para tratar exceção.',
      },
      {
        role: 'CIO e CTO',
        value: 'Garante que o redesenho respeite integração, governança e segurança do ambiente.',
      },
    ],
    cta: 'Escolha a cadeia que mais consome sua operação. O diagnóstico entrega a linha de base quantificada e o caso de eficiência — e vale mesmo que a implantação seja feita por outro.',
    connects: ['2.2', '2.1B', '2.1C', '3.1'],
    boundary:
      'Hiper-eficiência decide se, onde e por quê mudar o processo. A construção dos agentes é a Fábrica de Agentes. A conversa de modelo operacional inteiro é 1.3.',
    editorialCare:
      'Jamais comunicar como redução de quadro. O enquadramento é capacidade: absorver mais volume com a mesma estrutura. Promessa de corte ativa RH, jurídico e relação sindical e trava o programa.',
    proof: {
      status: 'sem-lastro',
      note: 'Os cases de eficiência e o dado de mercado sobre custo de áreas meio no Brasil seguem pendentes. O que existe é o método e a régua de medição.',
    },
    legacyEquivalent: {
      label: 'Linhas de Serviço → Hiperautomação & RPA',
      section: 'services',
    },
  },

  // ══ Eixo 3 ══════════════════════════════════════════════════════════════════
  {
    id: 'modernizacao-aplicacoes',
    code: '3.1',
    axisId: 'eixo-3',
    role: 'capacidade',
    name: 'Modernização e Otimização de Aplicações',
    headline: 'Seu legado deixa de ser o limite',
    tagline: 'A regra de negócio volta documentada, mesmo quando ninguém mais a conhece.',
    whatItIs:
      'Modernização de aplicações e de arquitetura, com IA acelerando a análise do legado, a refatoração e a migração. Endereça o sistema caro de manter, lento de evoluir e que trava tanto a agenda tecnológica quanto a de negócio.',
    pain:
      'O legado sustenta a operação e impede a evolução: custa cada vez mais manter, depende de gente que está saindo do mercado, não tem documentação e bloqueia qualquer iniciativa que precise de dado limpo e de API.',
    entryTriggers: [
      'Fim de suporte do fabricante',
      'Escassez de mão de obra especializada',
      'Custo de manutenção crescente',
      'Risco regulatório e de cibersegurança',
      'Movimento para cloud',
      'Fusão ou aquisição',
      'Iniciativa de IA bloqueada por falta de dado e de API',
    ],
    outcomes: [
      'Redução de custo e de risco operacional do legado (referência de projetos anteriores: até 30%)',
      'Ciclo de modernização acelerado (referência de projetos anteriores: até 70% de time-to-market)',
      'Lógica de negócio preservada e testada, mesmo sem documentação ou desenvolvedor original',
      'O conhecimento do seu legado de volta, documentado pelo Extrator de Regras',
      'Base API-first e cloud-ready, pronta para evoluir',
      'Alinhamento regulatório e redução da dívida técnica',
    ],
    differentials: [
      {
        title: 'Profundidade real em modernização acelerada por IA',
        detail:
          'Método próprio de seis etapas, ciclos de release de seis semanas e composição de metade automação, metade supervisão humana sênior. Cobertura de COBOL, VB6, .NET, Java, Angular, React, Vue, mainframe e AS400.',
      },
      {
        title: 'Escala em duas dimensões',
        detail:
          'Industrial, com mais de três mil profissionais em Brasil, Estados Unidos e Portugal; e de complexidade, com monolito de milhões de linhas e mainframe em produção.',
      },
      {
        title: 'Arquitetura aberta e conhecimento devolvido',
        detail:
          'O alvo multi-cloud é verificável no desenho, e a documentação gerada devolve ao cliente a lógica que só existia dentro do código.',
      },
    ],
    assets: [
      'NEXUS · Extrator de Regras',
      'NEXUS · Conversor de Código',
      'NEXUS · Certificação',
      'NEXUS · DataForge',
      'NEXUS · CodeCompare',
    ],
    phases: [
      {
        name: 'Assessment e inventário',
        duration: '3 a 4 semanas',
        focus: 'Mapeamento das regras de negócio, do custo de manter e do caminho de modernização.',
      },
      {
        name: 'Setup da arquitetura-alvo',
        duration: 'por ciclo',
        focus: 'Definição e preparação do alvo, com verificação de portabilidade multi-cloud.',
      },
      {
        name: 'Construir e testar',
        duration: 'ciclo de 6 semanas',
        focus: 'Conversão e refatoração com supervisão sênior sobre o que a IA produz.',
      },
      {
        name: 'QA e certificação',
        duration: 'por ciclo',
        focus: 'Certificação de equivalência funcional entre legado e alvo.',
      },
      {
        name: 'Homologação',
        duration: 'por ciclo',
        focus: 'Validação com as áreas donas do sistema antes da virada.',
      },
      {
        name: 'Produção e hyper care',
        duration: 'por ciclo',
        focus: 'Entrada em produção com acompanhamento reforçado no período crítico.',
      },
    ],
    totalDuration: 'ciclos de release de 6 semanas',
    marketStats: [
      {
        stat: 'O ônus de sistemas bancários desatualizados pode chegar a US$ 57 bilhões anuais até 2028.',
        source: 'IDC Financial Insights, via TI Inside, abril de 2026',
      },
      {
        stat: '78% das organizações já usam IA em iniciativas de modernização de aplicações.',
        source: 'Red Hat, State of Application Modernization, via SoftDesign, fevereiro de 2026',
      },
    ],
    personas: [
      {
        role: 'CIO e CTO',
        value: 'Reduz custo e risco do legado sem parar a evolução do negócio.',
      },
      {
        role: 'CFO',
        value: 'Vê o custo de manter quantificado e comparado ao investimento de modernizar.',
      },
      {
        role: 'Arquiteto-chefe',
        value: 'Valida um alvo aberto, com portabilidade verificável em vez de prometida.',
      },
      {
        role: 'CISO',
        value: 'Endereça exposição regulatória e de segurança que o legado carrega.',
      },
    ],
    cta: 'Um diagnóstico de legado que mapeia as regras de negócio, quantifica o custo de manter e mostra o caminho de modernização com prazo e investimento.',
    connects: ['3.3', '3.2', '2.1B', '1.3'],
    boundary:
      'Se o problema real é dado fragmentado e não código legado, a entrada é pelo eixo de Inteligência de Dados.',
    proof: {
      status: 'liberado',
      note: 'É a única oferta do portfólio com cases nomeados e liberados para uso comercial.',
      cases: [
        'Instituição financeira nos Estados Unidos — monolito de 4 milhões de linhas convertido em microsserviços Python em 12 meses.',
        'Seguradora — mais de 2 milhões de linhas de mainframe COBOL e Visual Age migradas para .NET e React, acompanhadas de cerca de 20% de aumento de negócios do cliente.',
        'Risk Score Global — AS400 migrado para Java em cloud, com 600 mil linhas e tempo de instalação caindo de 12 para 3 meses.',
      ],
    },
    legacyEquivalent: {
      label: 'Principais Ofertas e Linhas de Serviço → Modernização de Legados',
      section: 'services',
    },
  },
  {
    id: 'engenharia-digital',
    code: '3.2',
    axisId: 'eixo-3',
    role: 'capacidade',
    name: 'Engenharia Digital acelerada por IA',
    headline: 'A oferta que a Foursys faz há 26 anos, agora acelerada por IA',
    tagline: 'Construção de software em escala, com custo unitário visível.',
    whatItIs:
      'Design e engenharia de software de ponta a ponta, do produto à sustentação, acelerados por IA em todas as fases do ciclo. É a oferta gênesis da casa: o que fazemos desde a fundação, agora com aceleradores e medição de custo unitário de entrega.',
    pain:
      'O roadmap de produto trava na capacidade de engenharia, o ciclo de entrega é longo demais para a competição atual e o custo por produto entregue está acima do que o negócio sustenta. A resposta usual — contratar mais gente — piora a previsibilidade.',
    entryTriggers: [
      'Roadmap travado por falta de capacidade de engenharia',
      'Ciclo de entrega longo frente à competição',
      'Custo unitário de entrega insustentável',
      'Necessidade de capacidade elástica sem inflar o time fixo',
      'Continuidade de Lab as a Service, modernização ou novo modelo operacional que puxa a engenharia',
    ],
    outcomes: [
      'Produtos digitais entregues mais rápido, com IA no ciclo',
      'Redução do custo unitário de entrega',
      'Capacidade elástica que destrava o roadmap sem inflar o time fixo',
      'Método de SDLC com IA capacitado no time do cliente',
      'Aceleradores customizados ao ambiente que o cliente já tem',
      'Base pronta para evoluir sem dependência de fornecedor único',
    ],
    differentials: [
      {
        title: 'Pensamento sistêmico antes do código',
        detail:
          'A leitura organizacional e de negócio vem antes da construção. Reduz risco de entrega e faz a conversa ir além do software entregue.',
      },
      {
        title: 'Portfólio de aceleradores escolhido por contexto',
        detail:
          'O diferencial não é uma ferramenta única: é saber qual usar, quando, e integrá-la ao ambiente do cliente. NEXUS quando há ganho de governança e orquestração; aceleradores de mercado quando o ambiente pede.',
      },
      {
        title: 'Continuidade com contexto estratégico',
        detail:
          'Delivery conectado à governança do Eixo 2 e às conversas de inovação, não fábrica avulsa contratada por headcount.',
      },
      {
        title: 'Multi-cloud, sem aprisionamento',
        detail:
          'Argumento que entra quando existe dor real de lock-in: o alvo é aberto e o cliente segue operando sem depender de um fornecedor.',
      },
    ],
    components: [
      'Engenharia ponta a ponta, do design ao deploy',
      'Modalidade em squad gerenciada ou projeto fechado, definida na qualificação',
      'Elasticidade de capacidade via Capacity as a Service',
      'Capacitação do método de SDLC com IA no time do cliente',
    ],
    assets: ['NEXUS', 'Capacity as a Service', 'Aceleradores de mercado selecionados por contexto'],
    phases: [
      {
        name: 'Qualificação e enquadramento',
        duration: 'a calibrar',
        focus:
          'Definição de escopo, modalidade (squad gerenciada ou projeto fechado) e da métrica única de sucesso, acordada por escrito antes do início.',
      },
      {
        name: 'Piloto de entrega — mês 1',
        duration: '1 mês',
        focus: 'Linha de base e rampa em uma frente do roadmap, com entregável previsto em produção.',
      },
      {
        name: 'Piloto de entrega — meses 2 e 3',
        duration: '2 meses',
        focus: 'Operação medida contra a linha de base, na métrica escolhida pelo cliente: custo unitário de entrega ou lead time.',
      },
      {
        name: 'Escala e sustentação',
        duration: 'a calibrar',
        focus: 'Ampliação da capacidade com padrão e métrica já validados, e transferência de método ao time do cliente.',
      },
    ],
    totalDuration: 'piloto mínimo de 3 meses, depois operação contínua conforme a modalidade',
    marketStats: [],
    personas: [
      {
        role: 'CIO, CTO e VP de Engenharia',
        value: 'Destrava o roadmap e ganha capacidade de construir na velocidade do negócio.',
      },
      {
        role: 'Head de Produto',
        value: 'Recupera prioridade e ritmo de entrega sem abrir mão de qualidade e documentação.',
      },
      {
        role: 'CFO ou controladoria, quando o custo unitário já é tema',
        value: 'Passa a comparar custo por unidade entregue em vez de negociar taxa-hora.',
      },
    ],
    cta: 'Comece por um piloto de entrega de três meses em uma frente do roadmap, com critério de sucesso acordado por escrito sobre uma métrica única: custo unitário de entrega ou lead time.',
    connects: ['3.3', '3.4', '3.1'],
    boundary:
      'Não é oferta de abertura por padrão: o delivery é puxado por Lab as a Service, Modernização ou Novo Modelo Operacional. É a contraparte de engenharia de software frente à hiper-eficiência de processos, que não constrói sistema. Se o problema é o legado que impede evoluir, comece por Modernização.',
    proof: {
      status: 'em-validacao',
      note: 'O kit é enxuto: não tem one-pager formal, case liberado nem número próprio de produtividade validado. Parte do escopo embutido segue pendente de confirmação com delivery. A prova disponível é o histórico de entrega e os cases de modernização da oferta 3.1.',
    },
    legacyEquivalent: {
      label: 'Linhas de Serviço → Design e Engenharia de Software com IA',
      section: 'services',
    },
  },
  {
    id: 'engenharia-qualidade',
    code: '3.3',
    axisId: 'eixo-3',
    role: 'capacidade',
    name: 'Engenharia de Qualidade acelerada por IA',
    headline: 'Studio de Engenharia de Qualidade: CoE define o padrão, CSC executa na squad',
    tagline: 'Duas torres autônomas sob governança única, com agentes de IA no ciclo de QA.',
    whatItIs:
      'Studio de Engenharia de Qualidade com duas torres que podem ser contratadas separadamente: o CoE, torre estratégica que define metodologia, padrões, indicadores e testes não funcionais transversais; e o CSC, torre de execução que coloca QA dentro das squads em modelo plug and play — inclusive em squad que não é da Foursys.',
    pain:
      'No CoE, a dor é QA desigual entre squads, sem padrão comum nem visibilidade executiva do estado real da qualidade. No CSC, é qualidade tratada como etapa final e gargalo: defeito tardio, retrabalho, release arriscado e, quando a squad é de fornecedor, nenhuma medição independente.',
    entryTriggers: [
      'QA desigual entre múltiplas squads, sem padrão comum',
      'Ausência de indicador executivo de qualidade',
      'Bug escape alto em uma squad específica',
      'Release travado por falta de confiança',
      'Necessidade de medição independente em squad de terceiro',
      'Qualidade virando gargalo depois do ganho de produtividade em engenharia',
    ],
    outcomes: [
      'Qualidade contínua embarcada no ciclo, em abordagem shift-left',
      'Pipeline com onze etapas e onze gates, do assessment ao go/no-go',
      'Cobertura de teste ampliada por agentes de IA',
      'Menos defeito chegando em produção e release mais confiável',
      'No CoE: padrão único replicável entre squads e indicadores executivos diários',
      'No CSC: pipeline conectado, gates ativos e report padronizado na squad',
      'Reports: dashboard executivo, Allure por sprint e alerta em tempo real',
    ],
    differentials: [
      {
        title: 'CoE e CSC sob governança única',
        detail:
          'Prática estruturada e replicável, com TMO e QA Lead como elo entre a torre estratégica e a execução. Não é apenas ferramenta de automação.',
      },
      {
        title: 'CSC em modelo plug and play',
        detail:
          'A célula de qualidade se conecta a squad que não é da Foursys, sem exigir a troca do fornecedor de engenharia.',
      },
      {
        title: 'Agentes de IA no ciclo de QA',
        detail:
          'Analista Gherkin para cenário, DataForge para massa sintética e Validador de US para checar a história antes da construção, integrados aos critérios de aceite com Negócio.',
      },
      {
        title: 'Pipeline shift-left com onze gates',
        detail:
          'Quanto mais cedo o defeito aparece, mais barato ele custa. Cada etapa tem critério de passagem e evidência.',
      },
    ],
    components: [
      'CoE: metodologia, padrões, reports e indicadores, testes não funcionais transversais, equalização e treinamentos',
      'CSC: teste funcional manual e automatizado, certificação de patch e GMUD, regressão e caminho crítico',
      'Validação de US antes do desenvolvimento',
      'Design de cenário em BDD e Gherkin',
      'Massa sintética e evidência de gate',
    ],
    assets: [
      'Studio de Engenharia de Qualidade (CoE + CSC)',
      'TMO · QA Lead',
      'Analista Gherkin',
      'DataForge',
      'Validador de US',
    ],
    phases: [
      {
        name: 'Assessment de Maturidade de QA — porta do CoE',
        duration: '3 a 6 semanas',
        focus: 'Diagnóstico de maturidade, mapa por squad, roadmap com OKRs e linha de base dos indicadores.',
      },
      {
        name: 'Piloto de QA em uma squad — porta do CSC',
        duration: '8 a 12 semanas',
        focus: 'Pipeline conectado, gates ativos, agentes onde couber e report padronizado, comparado ao histórico da squad.',
      },
      {
        name: 'CoE em operação',
        duration: 'contínuo',
        focus: 'Metodologia, padrão, indicadores e testes não funcionais transversais às squads.',
      },
      {
        name: 'CSC em operação',
        duration: 'contínuo por squad',
        focus: 'QA dentro da squad, com certificação de GMUD, regressão e caminho crítico.',
      },
    ],
    totalDuration: 'assessment de 3 a 6 semanas · piloto de 8 a 12 semanas · operação contínua',
    marketStats: [
      {
        stat: 'QA estruturado está associado a até 37% de redução no custo total de projetos e a 22% menos retrabalho.',
        source: 'Benchmarks de setor (NIST e DORA State of DevOps) — não são métricas da Foursys',
      },
      {
        stat: 'O custo de corrigir um defeito cai até 100 vezes quando ele é identificado antes da produção.',
        source: 'Benchmarks de setor (NIST e DORA State of DevOps) — não são métricas da Foursys',
      },
    ],
    personas: [
      {
        role: 'CTO e VP de Engenharia',
        value: 'Padroniza a prática de qualidade entre squads e ganha indicador executivo diário.',
      },
      {
        role: 'Head de Qualidade ou Gerente de Qualidade',
        value: 'Recebe metodologia, régua e agentes em vez de esforço manual disperso.',
      },
      {
        role: 'Gerente de Produto',
        value: 'Ganha confiabilidade da squad e evidência de qualidade por release.',
      },
      {
        role: 'CIO',
        value: 'Sustenta o programa quando a prática atravessa toda a organização.',
      },
    ],
    cta: 'Duas portas de entrada: o Assessment de Maturidade de QA, com roadmap, OKRs e linha de base; ou um piloto de QA em uma squad, com pipeline, gates e report padronizado.',
    connects: ['3.2', '3.1', '3.4'],
    boundary:
      'São duas ofertas autônomas e não devem ser confundidas: o CoE trata de organização e governança da qualidade, o CSC de capacidade dentro de uma squad. Se a dor é volume de construção e não escape de defeito, a conversa começa por Engenharia Digital.',
    editorialCare:
      'Os ganhos próprios da prática (multiplicadores de cenário, massa e automação) estão marcados para validação de origem no material interno. Não publicar percentual até haver projeto, período e metodologia citáveis; usar apenas como ordem de grandeza em conversa.',
    proof: {
      status: 'sem-lastro',
      note: 'Não há case liberado neste kit. Todos os números de ganho da prática estão marcados para validação de origem e lastro. Por isso publicamos o método, as torres e os gates, e os dados de mercado aparecem identificados como benchmark de setor, não como métrica da casa.',
    },
    legacyEquivalent: {
      label: 'Principais Ofertas e Linhas de Serviço → Qualidade & Testes com IA',
      section: 'services',
    },
  },
  {
    id: 'agentic-squad-model',
    code: '3.4',
    axisId: 'eixo-3',
    role: 'capacidade',
    name: 'Agentic Squad Model',
    headline: 'A squad que opera, não a que se promete',
    tagline: 'Squads híbridas humano-agente, governadas, medidas e entregando software.',
    whatItIs:
      'Squads híbridas em que engenheiros humanos operam com agentes de IA integrados a cada fase do ciclo, do discovery à sustentação. Traz a camada de governança e controle embarcada — operacional, financeiro e de conformidade quando o contexto exige —, papéis redesenhados e régua própria de produtividade e maturidade. A oferta é o time híbrido em operação entregando software, não consultoria de redesenho.',
    pain:
      'Os times adotaram IA de forma pontual, como copiloto, sem redesenhar papéis, fluxo e métricas — e capturaram só uma fração do ganho. Quem avançou perdeu controle: consumo de modelo sem atribuição, escala travada por medo do gasto, agente sem trilha auditável e nenhuma métrica ligando o investimento em IA ao resultado de entrega.',
    entryTriggers: [
      'Copiloto adotado com ganho aquém do esperado',
      'Custo de IA sem atribuição por time ou produto',
      'Escala de IA travada por incerteza de gasto',
      'Ausência de rastreabilidade e de guardrails no ciclo de engenharia',
      'Exigência regulatória sobre o uso de IA na engenharia',
      'Necessidade de materializar o novo modelo operacional na engenharia',
    ],
    outcomes: [
      'Squad híbrida em operação, entregando software',
      'Ganho de produtividade medido por régua própria, não apenas prometido',
      'Governança e controle embarcados, inclusive o financeiro: consumo por squad, agente e fase',
      'Papéis redesenhados para a colaboração entre pessoas e agentes',
      'Framework calibrado à realidade do cliente, com guardrails e trilha auditável',
      'Time do cliente capacitado a operar o modelo com autonomia',
    ],
    differentials: [
      {
        title: 'Governança e controle embarcados',
        detail:
          'Operacional, financeiro e de conformidade quando aplicável, via NEXUS ou por playbook aplicado sobre o ferramental que o cliente já usa.',
      },
      {
        title: 'Framework construído para o contexto do cliente',
        detail:
          'Não é modelo de prateleira: composição da squad, agentes, gates e régua de medição são calibrados caso a caso.',
      },
      {
        title: 'Praticamos na própria casa',
        detail:
          'O Agentic Squad Model é aplicado à engenharia da Foursys antes de ser oferecido ao cliente.',
      },
      {
        title: 'Squad que opera, medida por régua própria',
        detail:
          'Operação com métrica de produtividade e de maturidade acompanhada desde o início, em vez de promessa de ganho.',
      },
    ],
    components: [
      'Agentes por fase do ciclo: discovery, design, desenvolvimento, qualidade, deploy e sustentação',
      'Guardrails, rastreabilidade e trilha auditável do uso de IA',
      'Controle de consumo por squad, agente e fase',
      'Régua própria de produtividade e maturidade',
      'Papéis redesenhados para colaboração humano-agente',
    ],
    assets: ['NEXUS', 'Fusion Teams', 'Capacity as a Service', 'Régua de produtividade e maturidade'],
    phases: [
      {
        name: 'Setup do ambiente e da squad',
        duration: 'semanas 1 a 4',
        focus:
          'Desenho do modelo, composição híbrida, governança com guardrails e controle de consumo, adequação regulatória quando exigida e definição da régua.',
      },
      {
        name: 'Operação',
        duration: 'contínuo',
        focus: 'A squad entrega software com agentes do discovery à sustentação, com medição contínua e visibilidade de custo de IA.',
      },
      {
        name: 'Transferência de maturidade',
        duration: 'contínuo',
        focus: 'Capacitação do time do cliente, com compromisso de autonomia via Fusion Teams.',
      },
    ],
    totalDuration: 'setup de 1 a 4 semanas, depois operação contínua, com escala via Capacity as a Service',
    marketStats: [
      {
        stat: 'Até 2027, metade das decisões de negócio será aumentada ou automatizada por agentes de IA.',
        source: 'Gartner, via itbrief.news, maio de 2026',
      },
    ],
    personas: [
      {
        role: 'CTO e VP de Engenharia',
        value: 'Materializa o ganho de IA além do copiloto, com régua de medição e controle de custo.',
      },
      {
        role: 'CIO',
        value: 'Produtividade medida e governada, sem uso de IA fora do radar.',
      },
      {
        role: 'CISO',
        value: 'Guardrails, trilha auditável e adequação regulatória quando o setor exige.',
      },
      {
        role: 'CFO e controladoria',
        value: 'Atribuição do custo de IA ligada à entrega, quando o gasto já é tema na casa.',
      },
      {
        role: 'Tech lead e arquiteto',
        value: 'Agentes amplificam o julgamento humano, com papéis redesenhados em vez de sobrepostos.',
      },
    ],
    cta: 'A conversa começa por onde a engenharia captura só uma fração do ganho de IA — e quanto disso sai em custo sem virar entrega.',
    connects: ['3.2', '3.3', '1.3', '2.2'],
    boundary:
      'Não é exclusiva de setor regulado: governança é universal e conformidade (BACEN, ANS, ANPD, LGPD) é caso de aplicação. Não é consultoria de redesenho nem squad por headcount. Se a necessidade é agente de negócio operando em processo, e não construção de software, o caminho é a Fábrica de Agentes; se é processo de negócio sem engenharia, é hiper-eficiência.',
    proof: {
      status: 'sem-lastro',
      note: 'O ganho de produtividade real das squads Foursys medido pela régua interna está marcado para formalização e não pode ser publicado como percentual. O kit reconhece a exposição: concorrentes têm números públicos, a casa ainda não. Publicamos a composição, o método e a instrumentação de custo.',
    },
    legacyEquivalent: {
      label: 'Principais Ofertas → AI Squad; Delivery → Squad + Agentes IA',
      section: 'offers-flagship',
    },
  },

  // ══ Eixo 4 ══════════════════════════════════════════════════════════════════
  {
    id: 'dados-analytics',
    code: '4.4',
    axisId: 'eixo-4',
    role: 'capacidade',
    name: 'Dados e Analytics · All In Data',
    headline: 'A base analítica que transforma volume em decisão confiável',
    tagline: 'Seis frentes em um CoE de dados: plataforma, engenharia, produtos, analytics, governança e cultura.',
    whatItIs:
      'Construção e modernização da base analítica da companhia, organizada em seis frentes que podem ser contratadas em conjunto ou por recorte: plataforma de dados, engenharia, produtos de dados, analytics, governança e cultura. Vai do desenho do Modern Data Stack — inclusive em modelo gerenciado, MDS as a Service — à operação de dashboards, modelos e indicadores, com um centro de excelência que concentra framework, padrão e conhecimento reutilizável.',
    pain:
      'O dado existe, mas está espalhado entre sistemas, sem dono claro e sem qualidade garantida na origem. Relatório que deveria ser instantâneo leva dias e chega quando a decisão já passou; cada área tem a sua versão do número; e a agenda de IA trava porque o dado não está pronto para alimentar modelo nem agente. É nesse contexto que a maioria dos projetos de dados não chega a gerar valor.',
    entryTriggers: [
      'Relatório executivo montado à mão, com dias de defasagem',
      'Múltiplas fontes sem integração e números divergentes entre áreas',
      'Ambiente analítico legado que não sustenta o volume atual',
      'Agenda de IA barrada porque o dado não está pronto',
      'Ausência de catálogo, linhagem e controle de qualidade',
      'Demanda de autoatendimento analítico que hoje passa toda pelo time de BI',
    ],
    outcomes: [
      'Plataforma de dados moderna: Modern Data Stack, data warehouse, data lake ou lakehouse conforme o caso',
      'Pipelines construídos com DataOps e MLOps, do ingest à disponibilização',
      'Dashboards, KPIs automatizados e alertas inteligentes em tempo real',
      'Governança desde a origem: qualidade, catálogo, observabilidade, active metadata, segurança e privacidade',
      'Produtos de dados descritivos, diagnósticos, preditivos e prescritivos, incluindo LLM e visão computacional',
      'Cultura data-driven com alfabetização em dados e self-service BI',
      'CoE de dados com frameworks reutilizáveis, padrões aplicados e métricas de qualidade',
    ],
    differentials: [
      {
        title: 'Governança e qualidade desde a origem',
        detail:
          'Catálogo, observabilidade, active metadata, segurança e privacidade entram no desenho da plataforma, não como camada posterior. É o ponto onde a maior parte dos projetos de dados falha.',
      },
      {
        title: 'Parceria estratégica com Databricks',
        detail:
          'Data lakehouse unificando data warehouse e data lake, com arquitetura escolhida pelo problema: lakehouse, data mesh ou data fabric conforme o modelo de ownership da casa.',
      },
      {
        title: 'Analytics em tempo real',
        detail:
          'Ingestão de múltiplas fontes, streaming, dashboards vivos e alertas automáticos: o relatório de três dias vira informação instantânea.',
      },
      {
        title: 'Dado como produto, não como relatório',
        detail:
          'Modelos descritivos, diagnósticos, preditivos e prescritivos, agentes autônomos, LLM e visão computacional tratados como produto com dono, ciclo e MLOps em produção.',
      },
      {
        title: 'IA generativa aplicada ao analytics',
        detail:
          'Consulta em linguagem natural — ask your data — democratiza o acesso ao insight, e dado sintético endereça a restrição de privacidade no treinamento de modelo.',
      },
      {
        title: 'CoE de dados',
        detail:
          'Repositório de conhecimento centralizado, capacitação contínua, aconselhamento just in time, artefatos reutilizáveis e métricas de qualidade mensuráveis.',
      },
    ],
    components: [
      'Plataforma de dados: construção de Modern Data Stack, modernização do ambiente analítico e MDS as a Service',
      'Engenharia: pipelines, DataOps e MLOps, data warehouse, data lake, lakehouse, data mesh e data fabric',
      'Produtos de dados: modelos descritivos, diagnósticos, preditivos e prescritivos, agentes autônomos, LLM, NLP, visão computacional e automação inteligente',
      'Analytics: dashboards e relatórios interativos, indicadores e KPIs automatizados, alertas inteligentes em tempo real',
      'Governança de dados: segurança e privacidade, catálogo, observabilidade e active metadata',
      'Cultura: assessment de maturidade analítica, alfabetização em dados, self-service BI e cultura data-driven',
    ],
    assets: [
      'CoE de Dados e Analytics',
      'Parceria estratégica Databricks',
      'Frameworks e artefatos reutilizáveis de plataforma e governança',
    ],
    phases: [
      {
        name: 'Assessment de maturidade analítica',
        duration: '3 a 6 semanas',
        focus: 'Diagnóstico das fontes, da arquitetura atual, da governança e da cultura, com priorização dos casos de uso.',
      },
      {
        name: 'Desenho e construção da plataforma',
        duration: '2 a 4 meses',
        focus: 'Arquitetura-alvo, Modern Data Stack, pipelines e DataOps, com governança e qualidade embarcadas na origem.',
      },
      {
        name: 'Produtos de dados e analytics',
        duration: '2 a 4 meses',
        focus: 'Dashboards, KPIs, alertas em tempo real e modelos preditivos ou prescritivos com MLOps em produção.',
      },
      {
        name: 'Governança, cultura e operação em CoE',
        duration: 'contínuo',
        focus: 'Catálogo, observabilidade, alfabetização em dados, self-service BI e evolução da maturidade.',
      },
    ],
    totalDuration: 'assessment de 3 a 6 semanas · plataforma de 2 a 4 meses · produtos de dados de 2 a 4 meses · CoE contínuo',
    marketStats: [
      {
        stat: 'O mercado global de Big Data e Analytics deve alcançar US$ 350 bilhões em 2026, com real-time analytics crescendo 28% ao ano e ferramentas de data governance, 35%.',
        source: 'Dados de mercado citados no material de linhas de serviço — benchmark de setor, não métrica da Foursys',
      },
      {
        stat: 'Empresas data-driven têm 23 vezes mais chance de adquirir clientes e 6 vezes mais de retê-los, enquanto 73% dos projetos de dados falham.',
        source: 'Dados de mercado citados no material de linhas de serviço — benchmark de setor, não métrica da Foursys',
      },
      {
        stat: 'O material cita case com 40% de redução de ruptura de estoque, 280% de ROI no primeiro ano e relatórios que saíram de três dias para instantâneos.',
        source: 'Case citado no material de linhas de serviço — pendente de liberação de setor, porte e escopo',
      },
    ],
    regulatory: [
      'LGPD: segurança, privacidade e controle de acesso ao dado desde a origem',
      'Dado sintético como alternativa ao uso de base real em treinamento de modelo',
    ],
    personas: [
      {
        role: 'CDO',
        value: 'Plataforma, governança e cultura tratadas como um programa só, com maturidade medida e evolução planejada.',
      },
      {
        role: 'CIO e CTO',
        value: 'Ambiente analítico moderno e sustentável, com engenharia de dados operando em DataOps e MLOps.',
      },
      {
        role: 'Head de BI e Analytics',
        value: 'Sai da fila de relatório manual para self-service, alerta automático e indicador confiável.',
      },
      {
        role: 'Diretor de negócio e operações',
        value: 'Decide com número único e atualizado, em vez de conciliar versões divergentes entre áreas.',
      },
    ],
    cta: 'A porta de entrada é o assessment de maturidade analítica: onde o dado está, o que impede a confiança nele e qual o primeiro caso de uso que paga a plataforma.',
    connects: ['2.1B', '2.2', '5.4'],
    boundary:
      'Não é projeto isolado de dashboard nem implantação de ferramenta de BI. Se a dor é governar o uso de IA e não preparar o dado, a conversa começa pela oferta 2.1B; se é infraestrutura e custo do ambiente, pelo eixo de cloud.',
    editorialCare:
      'Os números de redução de ruptura e ROI vêm de case citado no material de linhas de serviço e ainda não têm setor, porte e escopo liberados. Usar como ordem de grandeza, sem nomear cliente, e manter os dados de mercado identificados como benchmark de setor.',
    proof: {
      status: 'em-validacao',
      note: 'Há case citado no material com número de ruptura e de ROI, mas a liberação de setor, porte e escopo está pendente. O que já é publicável é a estrutura das seis frentes, o CoE e a arquitetura de referência.',
    },
    legacyEquivalent: {
      label: 'Linhas de Serviço → Dados & Analytics',
      section: 'services',
    },
  },

  // ══ Eixo 5 ══════════════════════════════════════════════════════════════════
  {
    id: 'finops-automation',
    code: '5.1',
    axisId: 'eixo-5',
    role: 'capacidade',
    portfolioRole: 'Rampa de entrada',
    name: 'Otimização de Cloud e FinOps · SharpOps',
    headline: 'Do achado ao deploy, sem sair do controle do cliente',
    tagline: 'Economia executada por Pull Request e cobrada só depois de comprovada em produção.',
    whatItIs:
      'Operação de FinOps conduzida pela SharpOps, unidade de FinOps do grupo, em quatro passos: o motor proprietário identifica a oportunidade, a mudança é proposta como Pull Request no repositório do próprio cliente, o cliente aprova e o deploy acontece. Não há licença de software nem hora de consultoria: o modelo é pure success fee, uma fração da economia que aparece no billing.',
    pain:
      'O custo de cloud cresce mais rápido do que a capacidade de governá-lo. Assessment tradicional entrega recomendação em PDF que o time interno nunca tem janela para executar; ferramenta SaaS resolve o outro extremo, mas muda o ambiente em caixa preta, exige acesso amplo de leitura e chega a mandar dado bruto de billing para modelo de linguagem. No fim, a economia fica na projeção e não no extrato.',
    entryTriggers: [
      'Fatura de cloud subindo mais rápido que o crescimento do negócio',
      'Assessment anterior parado em relatório, sem execução',
      'Time de infraestrutura sem janela para o backlog de otimização',
      'Segurança barrando ferramenta que aplica mudança direto no ambiente',
      'CFO cobrando previsibilidade e economia com número verificável',
    ],
    outcomes: [
      'Baseline de custo por recurso, usada para decidir por onde começar',
      'Oportunidades entregues como Pull Request revisável no repositório do cliente',
      'Economia aferida pela diferença de custo real medida depois da mudança em produção',
      'Modelo pure success fee: sem licença de software e sem cobrança de horas',
      'Infraestrutura como código no repositório do cliente, sem lock-in na saída',
      'Inventário de operações e controles compensatórios validado com o CISO antes da assinatura',
    ],
    differentials: [
      {
        title: 'Compliance por design, em GitOps',
        detail:
          'Nada muda no ambiente sem Pull Request aprovado pelo cliente. A mudança vive no repositório do cliente, não em um sistema proprietário: se o contrato termina, a infraestrutura não é afetada.',
      },
      {
        title: 'Baseline prioriza, aferição cobra',
        detail:
          'A linha de base serve só para escolher por onde começar. O fee é calculado pela diferença de custo real, medida em janela de 15 dias depois do deploy — não há mecanismo para inflar projeção, porque o que conta é o impacto no billing.',
      },
      {
        title: 'Contratação por modalidade',
        detail:
          'Assessment com 15% quando a identificação é da SharpOps e a execução fica com o cliente; 15% quando o cliente identifica e a SharpOps executa; 30% quando as duas pontas são da SharpOps.',
      },
      {
        title: 'CISO-ready, sem caixa preta',
        detail:
          'Due diligence disponibilizada antes da assinatura, módulos críticos de infraestrutura como código com escrow e IA isolada para texto, sem enviar dado bruto de billing para modelo de linguagem.',
      },
      {
        title: 'Saída sem penalidade escondida',
        detail:
          'Encerramento pelo cliente mantém o fee residual apenas das tranches já em produção. Encerramento pela SharpOps cessa toda cobrança futura, com o cliente retendo as mudanças no próprio repositório.',
      },
    ],
    components: [
      'Assessment inicial do ambiente com baseline por recurso e priorização de oportunidades',
      'Identificação contínua de oportunidades pelo motor proprietário SharpOps',
      'Execução via Pull Request revisado no repositório do cliente',
      'Aferição da economia em janela de 15 dias após o deploy',
      'Documento de inventário de operações e controles compensatórios para o CISO',
      'Escrow dos módulos críticos de infraestrutura como código',
    ],
    assets: [
      'SharpOps — unidade de FinOps do grupo',
      'Motor proprietário de identificação de oportunidades',
      'Módulos de infraestrutura como código com escrow',
    ],
    phases: [
      {
        name: 'Assessment sem custo',
        duration: 'a calibrar por ambiente',
        focus: 'Mapeamento inicial do ambiente para priorizar oportunidades e definir a baseline.',
      },
      {
        name: 'Validação conjunta',
        duration: 'a calibrar por escopo',
        focus: 'Revisão dos resultados com a engenharia do cliente e definição das modalidades de execução.',
      },
      {
        name: 'Assinatura e formalização',
        duration: 'a calibrar por escopo',
        focus: 'Acordo de escopo por recurso, métrica da janela de 15 dias e estruturação dos repositórios.',
      },
      {
        name: 'Primeiros Pull Requests',
        duration: 'primeiras semanas',
        focus: 'Início da execução com as primeiras propostas de infraestrutura no repositório do cliente.',
      },
    ],
    totalDuration: 'assessment inicial sem custo · primeiros Pull Requests em semanas · fee residual de 12 meses por tranche executada',
    marketStats: [
      {
        stat: 'A régua de fee do modelo é de 15% para identificação, 15% para execução e 30% quando as duas pontas são da SharpOps.',
        source: 'Modelo comercial SharpOps FinOps Automation',
      },
      {
        stat: 'O material comercial usa um cenário ilustrativo de R$ 435 mil de economia mensal em run-rate sobre um custo de R$ 1,85 milhão por mês.',
        source: 'Cenário ilustrativo do material SharpOps — não é resultado medido de cliente',
      },
    ],
    personas: [
      {
        role: 'CFO',
        value: 'Paga apenas pela economia que aparece no billing, com fee proporcional ao valor capturado.',
      },
      {
        role: 'CIO e CTO',
        value: 'Ganha execução sem abrir mão do controle: toda mudança entra por Pull Request no repositório da casa.',
      },
      {
        role: 'Head de Infraestrutura e Cloud',
        value: 'Recebe capacidade para o backlog de otimização que nunca encontra janela no time interno.',
      },
      {
        role: 'CISO e risco',
        value: 'Avalia inventário de operações e controles compensatórios antes de assinar, sem push direto no ambiente.',
      },
    ],
    cta: 'A porta de entrada é o assessment sem custo: mapeamento do ambiente, baseline por recurso e priorização. A decisão de executar vem depois, já com número na mesa.',
    connects: ['3.1', '3.4'],
    boundary:
      'Não é migração para cloud nem consultoria de arquitetura: o foco é o custo do que já está em produção. Se a dor é desenho de plataforma ou modernização do legado, a conversa começa pelo eixo de engenharia.',
    editorialCare:
      'O cenário de economia é ilustrativo e não pode ser apresentado como resultado de cliente. Não citar nome de cliente, número de proposta ou valores de proposta específica em conversa comercial.',
    proof: {
      status: 'sem-lastro',
      note: 'O material comercial traz cenário ilustrativo de economia, não caso medido e liberado. Por isso publicamos o método — GitOps com Pull Request, success fee e janela de aferição de 15 dias — em vez de percentual de economia.',
    },
    legacyEquivalent: {
      label: 'Linhas de Serviço → Arquitetura, DevOps, Cloud e FinOps',
      section: 'services',
    },
  },
  {
    id: 'arquitetura-devops-cloud',
    code: '5.4',
    axisId: 'eixo-5',
    role: 'capacidade',
    name: 'Arquitetura, DevOps e Cloud',
    headline: 'Plataforma cloud-native que sustenta escala, resiliência e cadência de entrega',
    tagline: 'Arquitetura moderna, estratégia multicloud, esteira DevOps e integração tratada como produto.',
    whatItIs:
      'Estruturação de arquiteturas cloud-native, estratégias multicloud, esteiras DevOps e integrações via API — incluindo Open Finance — para suportar crescimento, alta disponibilidade, ciclos mais rápidos e conectividade segura entre ecossistemas. Cobre o desenho da arquitetura-alvo, a migração legacy-to-cloud, a automação de delivery, a observabilidade e a governança de APIs, do design à operação.',
    pain:
      'O crescimento esbarra na arquitetura: ambiente monolítico que não escala, deploy raro e arriscado, indisponibilidade em pico, custo de cloud sem previsibilidade e dependência de um único provedor. Integração feita ponto a ponto vira dívida silenciosa, e o time descobre o problema só quando o negócio precisa de velocidade que a plataforma não entrega.',
    entryTriggers: [
      'Crescimento ou pico de demanda travado pela arquitetura atual',
      'Deploy pouco frequente, com janela longa e risco alto',
      'Incidentes de disponibilidade em sistema de missão crítica',
      'Migração de legado para cloud sem poder parar a operação',
      'Exigência regulatória de soberania de dados ou de trilha na integração',
      'Agenda de Open Finance ou de abertura de APIs para parceiros',
    ],
    outcomes: [
      'Arquitetura cloud-native com microsserviços, event-driven e infraestrutura elástica',
      'Migração legacy-to-cloud conduzida sem downtime da operação',
      'Esteira de CI/CD previsível, com frequência de deploy maior e rollback claro',
      'Kubernetes, containers e serverless operando em ambiente de missão crítica',
      'Observabilidade end-to-end e prática de SRE sustentando alta disponibilidade',
      'Governança multicloud reduzindo dependência de um único provedor',
      'APIs, eventos e integrações governadas do design à operação',
    ],
    differentials: [
      {
        title: 'Arquitetura desenhada para o ritmo do negócio',
        detail:
          'Microsserviços, event-driven e infraestrutura elástica escolhidos pelo problema real, não por moda. A arquitetura-alvo vem com roadmap incremental, não com reescrita big-bang.',
      },
      {
        title: 'DevOps por previsibilidade, não só por velocidade',
        detail:
          'A esteira é construída para reduzir risco de release: automação, gates, infraestrutura como código e rollback ensaiado. Velocidade é consequência da confiança, não o objetivo isolado.',
      },
      {
        title: 'Parceria direta com os três grandes provedores',
        detail:
          'Relação direta com Microsoft Azure, AWS e Google Cloud, com governança multicloud e sovereign cloud quando o setor regulado exige — financeiro, saúde e governo.',
      },
      {
        title: 'Integração tratada como produto',
        detail:
          'APIs, eventos e integrações complexas com governança do design à operação, com experiência prática em Open Finance e ambientes regulados.',
      },
      {
        title: 'FinOps como disciplina embarcada',
        detail:
          'A eficiência de custo entra desde o desenho da plataforma e continua na operação. Quando a dor é o custo do que já está rodando, a execução acontece pela oferta 5.1, com economia medida contra a linha de base.',
      },
    ],
    components: [
      'Assessment de arquitetura, plataforma e maturidade de delivery',
      'Desenho da arquitetura-alvo cloud-native e estratégia multicloud',
      'Migração legacy-to-cloud sem downtime',
      'Esteira DevOps com CI/CD, infraestrutura como código e automação de release',
      'Kubernetes, containers e serverless para missão crítica',
      'Observabilidade end-to-end e prática de SRE',
      'Governança de APIs, eventos e integrações, incluindo Open Finance',
    ],
    assets: [
      'Parcerias diretas com Microsoft Azure, AWS e Google Cloud',
      'SharpOps — unidade de FinOps do grupo',
    ],
    phases: [
      {
        name: 'Assessment de arquitetura e plataforma',
        duration: '3 a 6 semanas',
        focus: 'Diagnóstico do ambiente, gargalos de escala e disponibilidade, maturidade de delivery e linha de base de custo.',
      },
      {
        name: 'Arquitetura-alvo e roadmap',
        duration: '4 a 8 semanas',
        focus: 'Desenho cloud-native, estratégia multicloud, plano de migração e governança de APIs, com sequência incremental.',
      },
      {
        name: 'Implantação da plataforma e da esteira',
        duration: '3 a 6 meses',
        focus: 'Infraestrutura como código, CI/CD, Kubernetes, observabilidade e migração legacy-to-cloud por onda, sem parar a operação.',
      },
      {
        name: 'Operação e evolução',
        duration: 'contínuo',
        focus: 'SRE, confiabilidade, evolução da arquitetura e eficiência de custo contínua junto à SharpOps.',
      },
    ],
    totalDuration: 'assessment de 3 a 6 semanas · arquitetura-alvo de 4 a 8 semanas · implantação de 3 a 6 meses · operação contínua',
    marketStats: [
      {
        stat: 'O mercado global de cloud computing alcançou US$ 832 bilhões em 2025, e 92% dos workloads devem estar em cloud até 2028.',
        source: 'Dados de mercado citados no material de linhas de serviço — benchmark de setor, não métrica da Foursys',
      },
      {
        stat: 'A prática declara redução média de 35% em custo de cloud com FinOps, aumento de 40% na frequência de deploy e redução de 60% em vendor lock-in com governança multicloud.',
        source: 'Números da prática declarados no material de linhas de serviço — pendentes de lastro por projeto e período',
      },
    ],
    regulatory: [
      'Sovereign cloud para setores regulados: financeiro, saúde e governo',
      'Open Finance e integrações que exigem trilha, segurança e governança de API',
    ],
    personas: [
      {
        role: 'CIO e CTO',
        value: 'Ganha plataforma que sustenta o crescimento sem trocar disponibilidade por velocidade.',
      },
      {
        role: 'Head de Arquitetura e Plataforma',
        value: 'Arquitetura-alvo com roadmap incremental, padrão de integração e governança de API do design à operação.',
      },
      {
        role: 'Head de Infraestrutura e Cloud',
        value: 'Esteira, infraestrutura como código e observabilidade que reduzem risco de release e tempo de resposta a incidente.',
      },
      {
        role: 'CFO',
        value: 'Previsibilidade de custo de cloud tratada como disciplina, com continuidade na execução de FinOps.',
      },
    ],
    cta: 'A porta de entrada é o assessment de arquitetura e plataforma: onde a escala trava, onde o release arrisca e onde o custo escapa — com arquitetura-alvo e roadmap incremental na saída.',
    connects: ['5.1', '3.1', '3.2'],
    boundary:
      'Não é otimização de custo do que já está em produção, que é o escopo da oferta 5.1, nem modernização de código legado, que vive no eixo de engenharia. Aqui a conversa é sobre a plataforma e a esteira que sustentam o software.',
    editorialCare:
      'Os percentuais de redução de custo, frequência de deploy e vendor lock-in vêm do material de linhas de serviço e ainda não têm projeto, período e metodologia citáveis. Usar apenas como ordem de grandeza em conversa, nunca como resultado medido pela casa.',
    proof: {
      status: 'em-validacao',
      note: 'A experiência de plataforma, migração e integração é demonstrável no histórico de entrega, mas os cases dependem de liberação sobre setor, porte e escopo. Os percentuais herdados do material de linhas de serviço seguem pendentes de lastro.',
    },
    legacyEquivalent: {
      label: 'Linhas de Serviço → Arquitetura, DevOps, Cloud e FinOps',
      section: 'services',
    },
  },

  // ══ Eixo 6 ══════════════════════════════════════════════════════════════════
  {
    id: 'ciberseguranca-riscos',
    code: '6.1',
    axisId: 'eixo-6',
    role: 'capacidade',
    name: 'Cibersegurança, Riscos e Privacidade · Zeragon',
    headline: 'Segurança como atributo da transformação, não como barreira',
    tagline: 'Consultoria e assessment ou segurança sob demanda, conduzidos pela Zeragon, empresa do grupo.',
    whatItIs:
      'Capacidade dedicada de cibersegurança, riscos corporativos e privacidade conduzida pela Zeragon, empresa do grupo especializada no tema. Chega por dois modelos de contratação: Consulting & Assessment, para definir estratégia, medir maturidade e estruturar o programa; e SECaaS, segurança sob demanda por assinatura ou contrato, da esteira de AppSec ao SOC. O portfólio cobre seis frentes: Segurança da Informação, Continuidade de Negócios e Gestão de Crises, Riscos Corporativos, Prevenção de Fraudes, Privacidade de Dados e Gestão de Risco de Terceiros.',
    pain:
      'Vulnerabilidade conhecida sem dono e sem prazo, exigência regulatória que o time não consegue evidenciar e segurança que só aparece no fim do ciclo, como veto ao release. Quando o incidente chega, falta plano de continuidade e playbook de crise; o risco do fornecedor crítico não é medido; e a agenda de IA amplia a superfície de exposição antes que a governança acompanhe.',
    entryTriggers: [
      'Apontamento de auditoria, do regulador ou de cliente corporativo',
      'Incidente, tentativa de ransomware ou vazamento recente',
      'Exigência de certificação ISO 27001 ou ISO 27701',
      'Programa de LGPD parado no diagnóstico, sem política nem processo',
      'Agenda de IA avançando sem controle de dado, acesso e trilha',
      'Fornecedor crítico sem avaliação de risco de terceiro',
      'Fraude com burla de biometria ou de camadas antifraude',
    ],
    outcomes: [
      'Score de maturidade em NIST, arquitetura segura, SDLC e privacidade, com roadmap de evolução',
      'Plano Diretor de Segurança da Informação, políticas e procedimentos formalizados',
      'Gestão contínua de vulnerabilidades com scanning, pentest e Red Team',
      'SOC, blue team e resposta a incidentes com plano de ação definido',
      'DevSecOps e Security Champions embarcados no ciclo de desenvolvimento',
      'Continuidade testada: BIA, PCN, plano de disaster recovery e playbook de crise',
      'Programa de LGPD, gestão de risco de terceiros e camadas antifraude em operação',
    ],
    differentials: [
      {
        title: 'Empresa do grupo dedicada ao tema',
        detail:
          'A Zeragon, antiga Sec4Sys, é a vertical de riscos corporativos e cibersegurança do grupo. Não é time genérico alocado: é capacidade especializada em estratégia, detecção de ameaça, proteção de dado e mitigação de risco.',
      },
      {
        title: 'Dois modelos de contratação',
        detail:
          'Consulting & Assessment para estratégia, maturidade e programa; SECaaS para segurança sob demanda por assinatura ou contrato, escalável e sem montar estrutura própria.',
      },
      {
        title: 'Segurança como atributo, não como barreira',
        detail:
          'DevSecOps, arquitetura de referência, requisitos de segurança e Security Champions colocam o controle dentro do ciclo de desenvolvimento, em vez de transformá-lo em gate no fim da entrega.',
      },
      {
        title: 'Liderança de segurança como serviço',
        detail:
          'CISO as a Service, BISO as a Service e Red Team as a Service dão acesso à senioridade e à capacidade ofensiva sem depender de contratação própria.',
      },
      {
        title: 'Experiência em ambiente regulado',
        detail:
          'LGPD, Bacen, PCI-DSS, ISO 27001 e ISO 27701, com automação de controle e monitoramento contínuo em vez de evidência montada na véspera da auditoria.',
      },
      {
        title: 'Pré-condição da agenda de IA',
        detail:
          'A mesma capacidade sustenta a governança e a soberania de IA: controle de dado, acesso, trilha e superfície de exposição dos agentes.',
      },
    ],
    components: [
      'Consulting & Assessment: maturidade NIST, arquitetura segura, SDLC, privacidade, ransomware, PDSI, políticas, risk assessment, TPRM e cultura',
      'SECaaS: AppSec, pentest e ethical hacking, gestão de vulnerabilidades, operações (DLP, WAF, antispam), SOC, IAM, DevSecOps, segurança de redes, phishing e GRC',
      'Segurança da Informação: ISO 27001 e 27701, CISO e BISO as a Service, Red Team, threat intelligence, segurança em nuvem e VIP protection',
      'Continuidade e crise: BIA, PCN, disaster recovery, planos de resposta, playbook, simulações e treinamento',
      'Riscos corporativos: GRC, controles internos e testes de efetividade, dashboard de apetite, cultura de risco e prevenção à lavagem de dinheiro',
      'Prevenção de fraudes: score de maturidade, arquitetura e camadas antifraude, pentest de burla de biometria e fraud prevention as a service',
      'Privacidade de dados: score de LGPD, políticas, procedimentos e programa de proteção de dados',
      'Gestão de risco de terceiros: score TPRM, políticas e programa de gestão',
    ],
    assets: ['Zeragon — empresa do grupo, ex-Sec4Sys', 'NEXUS', 'Fusion Teams'],
    phases: [
      {
        name: 'Assessment e score de maturidade',
        duration: '3 a 6 semanas',
        focus: 'Diagnóstico em NIST, arquitetura segura, SDLC, privacidade e risco de terceiro, com priorização das lacunas.',
      },
      {
        name: 'Plano diretor e políticas',
        duration: '4 a 8 semanas',
        focus: 'PDSI, políticas, procedimentos e roadmap de evolução, com dono e prazo por controle.',
      },
      {
        name: 'Implantação de controles e programas',
        duration: '3 a 6 meses',
        focus: 'DevSecOps, IAM, gestão de vulnerabilidades, continuidade, antifraude e programa de LGPD conforme a prioridade definida.',
      },
      {
        name: 'Operação contínua em SECaaS',
        duration: 'contínuo',
        focus: 'SOC, resposta a incidentes, pentest recorrente, threat intelligence, campanhas de phishing e evolução da maturidade.',
      },
    ],
    totalDuration: 'assessment de 3 a 6 semanas · plano diretor de 4 a 8 semanas · implantação de 3 a 6 meses · operação contínua',
    marketStats: [
      {
        stat: 'A prática declara redução de 80% em vulnerabilidades, aumento de 70% em conformidade regulatória e queda de 60% no tempo de resposta a incidentes.',
        source: 'Números da prática declarados no material de linhas de serviço — pendentes de lastro por projeto e período',
      },
    ],
    regulatory: [
      'LGPD: programa, políticas e score de proteção e privacidade de dados',
      'ISO 27001 e ISO 27701: apoio e qualificação',
      'Bacen e PCI-DSS: experiência em ambiente financeiro regulado',
      'Prevenção à lavagem de dinheiro e gestão de risco de terceiros',
    ],
    personas: [
      {
        role: 'CISO',
        value: 'Ganha score de maturidade, plano diretor e capacidade de execução sem montar estrutura própria.',
      },
      {
        role: 'CIO e CTO',
        value: 'Segurança embarcada no ciclo de desenvolvimento, com DevSecOps em vez de veto no fim da entrega.',
      },
      {
        role: 'DPO e jurídico',
        value: 'Programa de LGPD com política, procedimento e evidência, não apenas diagnóstico.',
      },
      {
        role: 'Head de Risco e Compliance',
        value: 'GRC, controles internos testados, risco de terceiro medido e continuidade de negócio exercitada.',
      },
    ],
    cta: 'A porta de entrada é o assessment de maturidade: onde estão as lacunas de controle, quais têm exposição regulatória e o que entra primeiro no plano diretor. A execução vem em consultoria ou em SECaaS, conforme o momento da casa.',
    connects: ['2.1B', '5.4', '3.1'],
    boundary:
      'Não é revenda de ferramenta de segurança nem projeto pontual de implantação de produto. Se a dor é governança da agenda de IA — política de uso, trilha e comitê —, a conversa começa pela oferta 2.1B, com a Zeragon entrando como capacidade de segurança.',
    editorialCare:
      'Os percentuais de redução de vulnerabilidade, conformidade e tempo de resposta vêm do material de linhas de serviço e ainda não têm projeto, período e metodologia citáveis. Usar apenas como ordem de grandeza em conversa, nunca como resultado medido.',
    proof: {
      status: 'em-validacao',
      note: 'A capacidade é demonstrável pelo portfólio estruturado da Zeragon e pelos modelos de contratação, mas os cases dependem de liberação sobre setor, porte e escopo — o que é regra em segurança. Os percentuais herdados do material de linhas de serviço seguem pendentes de lastro.',
    },
    legacyEquivalent: {
      label: 'Linhas de Serviço → Cibersegurança (Sec4Sys)',
      section: 'services',
    },
  },

  // ══ Eixo 7 ══════════════════════════════════════════════════════════════════
  {
    id: 'outsourcing-sustentacao',
    code: '7.1',
    axisId: 'eixo-7',
    role: 'capacidade',
    portfolioRole: 'Delivery puxado',
    name: 'Outsourcing e Sustentação',
    headline: 'Continuidade operacional com SLA, governança e evolução controlada',
    tagline: 'A operação do ambiente crítico assumida por squads orientadas a resultado, não por alocação.',
    whatItIs:
      'Assunção da operação e da evolução de ambientes críticos — sustentação de aplicações, AMS e operação assistida — com SLA acordado, governança clara e visibilidade executiva. O time não entra apenas para manter o que existe: absorve o backlog técnico, reduz volatilidade da operação e mantém a evolução do sistema acontecendo, com aceleração por IA onde o ganho é real.',
    pain:
      'O ambiente crítico consome o time interno em chamado e apagão, e o que deveria evoluir fica parado no backlog. O custo da operação é imprevisível, a indisponibilidade aparece sem explicação e o contrato de terceiro entrega presença, não resultado. Quando o fornecedor sai, o conhecimento vai junto, porque nada estava documentado nem medido.',
    entryTriggers: [
      'Time interno consumido por chamado, sem espaço para evolução',
      'Indisponibilidade recorrente em sistema crítico do negócio',
      'Backlog técnico acumulado sem previsão de queima',
      'Contrato de sustentação medido por presença, e não por resultado',
      'Troca de fornecedor com risco de perda de conhecimento',
      'Necessidade de previsibilidade de custo na operação de TI',
    ],
    outcomes: [
      'Operação assumida com SLA acordado e métrica objetiva de cumprimento',
      'Indisponibilidade operacional reduzida em ambiente crítico',
      'Backlog técnico em queima contínua, com prioridade acordada com o negócio',
      'Time interno liberado para agenda de evolução e de produto',
      'Visibilidade executiva da operação: indicador, tendência e risco',
      'Conhecimento documentado e retido, com transição reversível',
      'Aceleração por IA no atendimento e na sustentação, sem abrir mão de qualidade e segurança',
    ],
    differentials: [
      {
        title: 'Squad orientada a resultado, não a alocação',
        detail:
          'O compromisso é com indicador de operação e queima de backlog, não com headcount presente. Especialistas entram pelo problema, não pela vaga.',
      },
      {
        title: 'Governança e SLA com métrica objetiva',
        detail:
          'Acordo de nível de serviço, ritual de governança e visibilidade executiva desde o primeiro mês, para que a discussão seja sobre o número e não sobre percepção.',
      },
      {
        title: 'Sustentação que evolui, não só mantém',
        detail:
          'A operação absorve dívida técnica e evolução controlada em paralelo ao atendimento, para que o ambiente não envelheça enquanto está estável.',
      },
      {
        title: 'Aceleração por IA com qualidade preservada',
        detail:
          'IA aplicada ao ciclo de atendimento e de sustentação onde reduz tempo de resposta e retrabalho, mantendo o padrão de qualidade e os controles de segurança.',
      },
      {
        title: 'Experiência em ambiente crítico e regulado',
        detail:
          'Operação de sistemas de missão crítica em setores com exigência de continuidade, trilha e conformidade.',
      },
    ],
    components: [
      'Sustentação de aplicações e AMS com SLA acordado',
      'Operação assistida e suporte a ambientes críticos',
      'Gestão e queima de backlog técnico',
      'Governança, rituais e visibilidade executiva de indicadores',
      'Evolução controlada do ambiente em paralelo ao atendimento',
      'Aceleração por IA no atendimento e na sustentação',
      'Documentação e retenção de conhecimento para transição reversível',
    ],
    assets: ['Fusion Teams', 'Modelos de contratação por projeto, squad e operação assistida'],
    phases: [
      {
        name: 'Assessment do ambiente e do contrato',
        duration: '2 a 4 semanas',
        focus: 'Mapa das aplicações críticas, volume de chamado, backlog acumulado e linha de base de disponibilidade e custo.',
      },
      {
        name: 'Transição e assunção da operação',
        duration: '4 a 8 semanas',
        focus: 'Transferência de conhecimento, documentação, definição de SLA, rituais de governança e painel de indicadores.',
      },
      {
        name: 'Estabilização',
        duration: '2 a 3 meses',
        focus: 'Redução de incidente recorrente, queima das prioridades de backlog e ajuste fino do acordo de nível de serviço.',
      },
      {
        name: 'Operação e evolução contínua',
        duration: 'contínuo',
        focus: 'Sustentação com SLA cumprido, evolução controlada do ambiente e revisão periódica de escopo com o negócio.',
      },
    ],
    totalDuration: 'assessment de 2 a 4 semanas · transição de 4 a 8 semanas · estabilização de 2 a 3 meses · operação contínua',
    marketStats: [
      {
        stat: 'A prática declara redução de 50% na indisponibilidade operacional, aumento de 30% na eficiência dos times internos e queda de 20% no backlog técnico.',
        source: 'Números da prática declarados no material de linhas de serviço — pendentes de lastro por projeto e período',
      },
    ],
    personas: [
      {
        role: 'CIO',
        value: 'Previsibilidade de custo e de risco na operação, com indicador executivo em vez de percepção.',
      },
      {
        role: 'Head de Operações de TI',
        value: 'Chamado sob controle, backlog em queima e time interno liberado para a agenda de evolução.',
      },
      {
        role: 'Dono de sistema crítico no negócio',
        value: 'Continuidade do sistema que sustenta a operação, com evolução acontecendo em paralelo.',
      },
      {
        role: 'CFO',
        value: 'Custo de sustentação previsível e ligado a nível de serviço acordado.',
      },
    ],
    cta: 'A porta de entrada é o assessment do ambiente: quais aplicações concentram o risco, qual o tamanho real do backlog e qual a linha de base de disponibilidade e custo antes de qualquer compromisso de SLA.',
    connects: ['3.1', '5.4', '6.1'],
    boundary:
      'Não é alocação de profissional por hora nem projeto fechado de construção. Se a dor é reescrever o legado, a conversa começa pela oferta 3.1; se é a plataforma que hospeda o ambiente, pelo eixo de cloud.',
    editorialCare:
      'Os percentuais de indisponibilidade, eficiência e backlog vêm do material de linhas de serviço e ainda não têm projeto, período e metodologia citáveis. Usar apenas como ordem de grandeza em conversa. Evitar posicionar a oferta como body shop: o compromisso declarado é com resultado.',
    proof: {
      status: 'em-validacao',
      note: 'O histórico de operação em ambiente crítico é a prova mais forte, mas os cases dependem de liberação sobre setor, porte e escopo. Os percentuais herdados do material de linhas de serviço seguem pendentes de lastro.',
    },
    legacyEquivalent: {
      label: 'Linhas de Serviço → Outsourcing & Sustentação',
      section: 'services',
    },
  },

  // ══ Eixo 8 ══════════════════════════════════════════════════════════════════
  {
    id: 'produtos-foursys',
    code: '8.1',
    axisId: 'eixo-8',
    role: 'diferenciacao',
    portfolioRole: 'Rampa de entrada',
    name: 'Produto Foursys',
    headline: 'Chega de projeto interminável: a solução digital em produção em até 30 dias',
    tagline: 'Plataforma modular por assinatura, configurada para a realidade da casa e com evolução contínua inclusa.',
    whatItIs:
      'Plataformas digitais prontas, customizáveis e mantidas pela Foursys em modelo SaaS. O FourBlox reúne mais de 18 soluções modulares em nove categorias de negócio, ativadas por bloco e configuradas sob medida; o FourMakers é o programa e a plataforma de co-criação e produtividade. O cliente contrata o resultado, não o esforço: assinatura mensal sem investimento inicial, com hospedagem, atualização, suporte e evolução inclusos.',
    pain:
      'Sistemas que não conversam entre si, planilha paralela fora de controle e baixa adoção das ferramentas que já existem. Quando a área tenta resolver, entra em projeto que nunca termina, com investimento alto e retorno indefinido — ou compra solução genérica que não cabe na realidade da operação.',
    entryTriggers: [
      'Processo crítico rodando em planilha paralela',
      'Necessidade de solução em produção em semanas, não em meses',
      'Projeto de software interno parado ou estourado em prazo',
      'Ferramenta comprada com baixa adoção pelo time',
      'Restrição de investimento inicial, com espaço para custo mensal previsível',
      'Área de negócio sem fila na TI para construir do zero',
    ],
    outcomes: [
      'Go-live em até 30 dias, com solução configurada para o fluxo real da área',
      'Assinatura mensal com previsibilidade financeira e sem investimento inicial',
      'Modularidade: ativa-se apenas o bloco que gera valor, e a solução cresce por adição',
      'Retrabalho reduzido e eficiência operacional ampliada no processo atendido',
      'Visibilidade gerencial e dado estruturado para decisão, no lugar da planilha',
      'Menor risco de investimento e time-to-value acelerado',
      'Hospedagem, atualização, suporte e evolução contínua inclusos na assinatura',
    ],
    differentials: [
      {
        title: 'Produção em 30 dias',
        detail:
          'O ciclo é de semanas, não de 6 a 12 meses. A entrega é uma solução em produção com acompanhamento e ajuste fino, não um piloto.',
      },
      {
        title: 'Modelo por assinatura',
        detail:
          'Previsibilidade financeira sem investimento inicial: hospedagem, atualização e suporte entram no mesmo custo mensal.',
      },
      {
        title: 'Modularidade inteligente',
        detail:
          'Mais de 18 soluções prontas em nove categorias — pessoas, operações, financeiro, comercial, projetos, ESG, dados e governança —, ativadas por bloco conforme a necessidade.',
      },
      {
        title: 'UX centrada no usuário',
        detail:
          'A configuração parte do fluxo de quem usa, o que gera adoção real em vez de ferramenta imposta e abandonada.',
      },
      {
        title: 'Evolução contínua baseada em dados',
        detail:
          'A solução cresce com a empresa: novos blocos e ajustes entram pelo uso observado, não por um novo projeto.',
      },
      {
        title: 'Kits pré-configurados',
        detail:
          'Combinações prontas para resultado acelerado: eficiência operacional, gestão de pessoas 360°, performance comercial e governança executiva.',
      },
    ],
    components: [
      'FourBlox — plataforma modular de soluções por assinatura',
      'FourMakers — programa e plataforma de co-criação e produtividade',
      'Gestão de Pessoas: mapa de alocação inteligente, performance e OKR tracker, banco de talentos estratégico',
      'Operações: controle de demandas e SLA, workflow personalizado, checkin de audiências, gestão de eventos',
      'Financeiro: gestão de orçamento por área, forecast inteligente, cartão de crédito consignado, gestão orçamentária',
      'Comercial: pipeline e performance comercial, gestão de comissões, prospecção e retenção de PMEs, CRM e SDR',
      'Projetos, ESG, Dados e Governança: portfólio de projetos, monitor de indicadores ESG, data hub executivo e gestão de guarda compartilhada',
      'Kits: Eficiência Operacional, Gestão de Pessoas 360°, Performance Comercial e Governança Executiva',
    ],
    assets: ['FourBlox', 'FourMakers'],
    phases: [
      {
        name: 'Diagnóstico profundo',
        duration: 'dias',
        focus: 'Mapeamento de dores, usuários, fluxos e necessidades reais da área.',
      },
      {
        name: 'Arquitetura da solução',
        duration: 'dias',
        focus: 'Definição dos blocos necessários para resolver o problema, com escopo acordado.',
      },
      {
        name: 'Configuração personalizada',
        duration: 'semanas',
        focus: 'Customização inteligente dentro da plataforma modular, sem construção do zero.',
      },
      {
        name: 'Go-live e evolução',
        duration: 'até 30 dias no total, depois contínuo',
        focus: 'Entrega em produção com acompanhamento, ajuste fino e evolução contínua baseada em uso.',
      },
    ],
    totalDuration: 'go-live em até 30 dias · evolução contínua inclusa na assinatura',
    marketStats: [
      {
        stat: 'O catálogo declara go-live em 30 dias, mais de 18 soluções prontas em nove categorias de negócio e modelo de assinatura mensal.',
        source: 'Material de Principais Ofertas (Produtos · FourMakers · FourBlox) — números de catálogo, atualizados a cada ciclo',
      },
    ],
    personas: [
      {
        role: 'Diretor de área — pessoas, financeiro, comercial ou operações',
        value: 'Resolve o processo que hoje vive em planilha sem entrar na fila de projeto da TI.',
      },
      {
        role: 'CIO e CTO',
        value: 'Reduz demanda de construção sob medida para problemas já resolvidos por bloco pronto, com hospedagem e suporte inclusos.',
      },
      {
        role: 'COO',
        value: 'Ganha controle de demanda, SLA e visibilidade da operação em semanas.',
      },
      {
        role: 'CFO',
        value: 'Custo mensal previsível, sem investimento inicial e com risco de investimento menor.',
      },
    ],
    cta: 'A porta de entrada é o diagnóstico estruturado: quais dores, usuários e fluxos estão em jogo e quais blocos resolvem o problema dentro da janela de 30 dias.',
    connects: ['3.2', '4.4', '7.1'],
    boundary:
      'Não é software sob medida construído do zero: o valor está em configurar bloco pronto. Se o processo exige construção específica ou integração profunda com o legado, a conversa começa pelo eixo de engenharia.',
    editorialCare:
      'O go-live de 30 dias vale para solução configurada dentro do catálogo — não prometer a mesma janela para necessidade que exige construção. O número de soluções e categorias muda a cada ciclo e deve ser conferido no catálogo antes de citar.',
    proof: {
      status: 'em-validacao',
      note: 'O catálogo de soluções, os kits e o modelo de assinatura são demonstráveis, mas os cases de cliente com número de adoção e de ganho dependem de liberação sobre setor, porte e escopo.',
    },
    legacyEquivalent: {
      label: 'Principais Ofertas → Produtos · FourMakers · FourBlox',
      section: 'offers-flagship',
    },
  },
]

// ─── Personas (Documento de Foco — camada 1) ──────────────────────────────────

const personas: PortfolioPersona[] = [
  {
    id: 'ceo',
    role: 'CEO e Board',
    concern:
      'Saber se a companhia está apenas otimizando enquanto o concorrente reinventa a estrutura de custo.',
    icon: 'building',
    color: '#22D3EE',
    shortlist: ['1.3', '2.1B', '2.1C', '1.1', '1.2'],
  },
  {
    id: 'cio',
    role: 'CIO e CTO',
    concern:
      'Escalar IA e modernizar o legado sem perder controle de custo, de risco e de governança.',
    icon: 'server',
    color: '#A78BFA',
    shortlist: ['2.1B', '2.1A', '3.1', '2.2', '3.4'],
  },
  {
    id: 'coo',
    role: 'COO',
    concern:
      'Absorver mais volume sem crescer a operação na mesma proporção, e sem depender de poucas pessoas.',
    icon: 'settings',
    color: '#34D399',
    shortlist: ['1.3', '2.3', '2.2', '2.1C', '3.1'],
  },
  {
    id: 'cfo',
    role: 'CFO',
    concern:
      'Previsibilidade: custo de cloud, custo de IA e retorno declarado com premissa verificável.',
    icon: 'coins',
    color: '#F59E0B',
    shortlist: ['2.3', '3.4', '2.1A', '3.1', '3.2'],
  },
  {
    id: 'cdo',
    role: 'CDO',
    concern:
      'Preparar o dado para a era dos agentes e transformar informação dispersa em decisão confiável.',
    icon: 'database',
    color: '#38BDF8',
    shortlist: ['2.1C', '2.1A', '2.1B', '2.2', '3.1'],
  },
]

// ─── Overlay por segmento (Documento de Foco — camada 2) ──────────────────────

const segments: PortfolioSegment[] = [
  {
    id: 'financeiro',
    name: 'Serviços financeiros',
    pain: 'Legado crítico em produção, agenda regulatória em movimento e pressão por eficiência com risco controlado.',
    priorityOffers: ['2.1B', '3.1', '2.3'],
  },
  {
    id: 'seguros',
    name: 'Seguros',
    pain: 'Sinistro e subscrição com muito documento não estruturado e decisão que precisa de trilha auditável.',
    priorityOffers: ['2.3', '2.1B', '3.1'],
  },
  {
    id: 'saude',
    name: 'Saúde',
    pain: 'Jornada fragmentada entre sistemas, dado sensível e conformidade difícil de evidenciar.',
    priorityOffers: ['2.1B', '2.3', '3.1'],
  },
  {
    id: 'industria',
    name: 'Indústria',
    pain: 'Operação com forte dependência de processo manual nas áreas meio e integração pendente entre plantas e corporativo.',
    priorityOffers: ['2.3', '1.3', '3.2'],
  },
  {
    id: 'agro',
    name: 'Agronegócio',
    pain: 'Crescimento rápido com estrutura administrativa que não acompanha e dado espalhado entre unidades.',
    priorityOffers: ['2.3', '2.1C', '3.2'],
  },
  {
    id: 'utilities',
    name: 'Utilities',
    pain: 'Base instalada legada, exigência regulatória de continuidade e necessidade de eficiência em atendimento.',
    priorityOffers: ['3.1', '2.3', '2.1B'],
  },
  {
    id: 'varejo',
    name: 'Varejo',
    pain: 'Cadência de entrega alta, sazonalidade e custo de operação digital sob pressão constante.',
    priorityOffers: ['3.2', '2.3', '3.4'],
  },
]

// ─── Visão de futuro ──────────────────────────────────────────────────────────

const futureVision: PortfolioFutureItem[] = [
  {
    id: 'tokenizacao',
    name: 'Tokenização e Economia Digital',
    description:
      'Estratégia e construção de soluções de tokenização com plataforma proprietária: da tese ao ativo tokenizado em produção, com trilha digital verificável.',
    horizon: 'Em construção',
    icon: 'coins',
  },
  {
    id: 'esg-tech',
    name: 'GreenOps e GreenToken',
    description:
      'ESG tratado como oferta tecnológica e auditável: o GreenOps mede e reduz a pegada da operação digital, o GreenToken tokeniza e monetiza o resultado.',
    horizon: 'Em construção',
    icon: 'leaf',
  },
  {
    id: 'machine-customer',
    name: 'Machine as Customer',
    description:
      'Preparar produto e canal para o cliente que é uma máquina: agente que pesquisa, negocia e compra sem humano no meio.',
    horizon: 'Emergente',
    icon: 'bot',
  },
  {
    id: 'emergentes',
    name: 'Tecnologias Emergentes',
    description:
      'Acompanhamento aplicado de computação quântica, wearables, robótica e IoT industrial, com leitura de quando cada uma entra na conta.',
    horizon: 'Observação ativa',
    icon: 'cpu',
  },
]

// ─── Ativos transversais ──────────────────────────────────────────────────────

const assets: PortfolioAsset[] = [
  {
    id: 'nexus',
    name: 'NEXUS',
    description:
      'Sistema operacional cognitivo da casa: cria, orquestra e governa agentes, fluxos agênticos e skills em multi-cloud, com seleção dinâmica de modelo e integração ao conhecimento do cliente.',
    icon: 'brain-circuit',
  },
  {
    id: 'fusion-teams',
    name: 'Fusion Teams',
    description:
      'Times híbridos de execução e capacitação, com trilha de maturidade por belts e compromisso de autonomia do cliente ao final do programa.',
    icon: 'users',
  },
  {
    id: 'agentes-alocados',
    name: 'Agentes de IA alocados junto às pessoas',
    description:
      'Agentes treinados e customizados que amplificam cada profissional da casa, com o contexto do cliente e o método de entrega da Foursys.',
    icon: 'bot',
  },
  {
    id: 'fourblox',
    name: 'FourBlox',
    description:
      'Catálogo modular de soluções por assinatura, com mais de 18 soluções em 9 categorias e entrada em produção em prazo curto.',
    icon: 'blocks',
  },
  {
    id: 'fourmakers',
    name: 'FourMakers',
    description:
      'Plataforma de gestão de pessoas e de talento técnico que sustenta a formação e a alocação dos times.',
    icon: 'package',
  },
  {
    id: 'zeragon',
    name: 'Zeragon',
    description:
      'Empresa do grupo especializada em cibersegurança (ex-Sec4Sys), com capacidade dedicada conectada à tese de governança e soberania de IA.',
    icon: 'shield-check',
  },
  {
    id: 'sharpops',
    name: 'SharpOps',
    description:
      'Unidade de negócio dedicada a FinOps, responsável pelo eixo de Cloud e otimização de custo com foco em resultado realizado.',
    icon: 'cloud',
  },
  {
    id: 'capacity',
    name: 'Capacity as a Service',
    description:
      'Elasticidade de capacidade técnica especializada sob demanda, em squad dedicada ou alocação, com o padrão de entrega da casa.',
    icon: 'wrench',
  },
]

// ─── Base comercial ───────────────────────────────────────────────────────────

const defaultEngagement: PortfolioEngagement = {
  models: [
    'Projeto fechado — escopo, prazo e entregáveis definidos',
    'Squad dedicada — alocação mensal com time multidisciplinar',
    'Operação assistida — sustentação e evolução contínua com SLA',
    'Assinatura de produto — FourBlox e FourMakers por licença',
  ],
  sizing: 'Squad dimensionada por fase, conforme o cronograma da própria oferta.',
  investmentGuidance:
    'Faixa de investimento sai da proposta comercial, depois do dimensionamento aprovado. Não citar valor em apresentação sem passar pelo Solution Center.',
}

// ─── Bundle ───────────────────────────────────────────────────────────────────

const portfolioPt: PortfolioBundle = {
  thesis,
  axes,
  offers,
  personas,
  segments,
  futureVision,
  assets,
  institutionalBacking,
  defaultEngagement,
}

// O conteúdo dos kits comerciais 2026 S2 só existe em português. Até a versão
// traduzida ser liberada pelo time de portfólio, a navegação em inglês usa o
// mesmo conjunto para não exibir texto pela metade.
export function getPortfolio(_lang: Language): PortfolioBundle {
  return portfolioPt
}

export { portfolioPt }
