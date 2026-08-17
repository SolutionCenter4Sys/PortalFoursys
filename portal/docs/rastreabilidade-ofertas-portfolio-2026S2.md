# Matriz de Rastreabilidade — Seção "Ofertas e Serviços" × Portfólio 2026 S2

**Data:** 12/08/2026
**Portal:** `PortalFoursys` — categoria `Ofertas e Serviços` (6 subseções)
**Fonte institucional:** `Materiais Institucionais Foursys — 01_INSTITUCIONAL E OFERTAS/Institucional/Portfólio_2026_Sem_2` (15 PDFs: índice mestre de kits, Documento de Foco, Linha Mestra v5 e 12 kits de oferta — todos lidos bloco a bloco)

**Leia primeiro:** o achado mais urgente não é de cobertura, é de exposição — o portal publica como métrica firme números que os kits classificam como não validados ou inexistentes (§9). Depois disso, os gaps de tese em §7.

---

## 1. Escopo comparado

### Lado A — Portal (subseções de `Ofertas e Serviços`)

| # | Subseção | id | Fonte de conteúdo | Itens |
|---|----------|-----|-------------------|-------|
| 1 | Principais Ofertas | `offers-flagship` | `SectionOffersFlag.tsx` | 5 ofertas destaque |
| 2 | Linhas de Serviço | `services` | `data/services.ts` + `SectionServices.tsx` | 8 linhas na grade + 2 flagship-only (AI Squad, FourBlox) |
| 3 | Estrutura de Delivery | `delivery` | `data/services.ts` + `SectionDelivery.tsx` | 6 modelos + drill-downs |
| 4 | Alianças Estratégicas | `alliances` | `data/alliances.ts` | 9 parceiros |
| 5 | Inovação | `innovation` | `SectionInnovation.tsx` + `data/innovation.ts` | 3 outcomes, 5 serviços, Studio, 6 tendências |
| 6 | IA na Foursys | `ai-foursys` | `SectionAIFoursys.tsx` | 6 serviços de IA, 10 pilares de governança, Nexus |

### Lado B — Portfólio Brasil v5 (Linha Mestra)

6 eixos de valor + camada de Visão de Futuro + 6 ativos transversais.
Hierarquia declarada: **Eixos 1 e 2 = diferenciação (vitrine)**; **Eixos 3, 4, 5, 6 = capacidade (motor)**.
Tese: *Marca → Pipeline → Ticket*. Eixo 3 vendido avulso é explicitamente tratado como risco de commodity.

### Legenda de status

| Status | Significado |
|--------|-------------|
| ✅ Coberto | Oferta existe no portal com nome e substância equivalentes |
| 🟡 Parcial | Conteúdo existe, mas com nome divergente, escopo reduzido ou USP institucional ausente |
| ❌ Ausente | Sem correspondência na seção Ofertas e Serviços |

---

## 2. Matriz principal — Portfólio → Portal

### Eixo 1 · Inovação & Estratégia (diferenciação · CEO/Board)

| Oferta (portfólio) | Kit PDF | Status | Onde está no portal | Gap |
|---|---|---|---|---|
| 1.1 Roadmap e Projetos de Inovação | `Oferta_1_1_Roadmap_Inovacao_Comercial` | 🟡 Parcial | Inovação → "Estrutura e Governança de Inovação" + "Gestão do Portfólio e Financiamento (TBM)" | Não é oferta nomeada; falta a USP do Innovation Center próprio ("aplicamos primeiro, oferecemos depois") e a governança do funil discovery→escalonamento |
| 1.2 Lab as a Service | `Oferta_1_2_Lab_as_a_Service_Comercial` | 🟡 Parcial | IA na Foursys → "Laboratório de Inovação Aberta"; Inovação → "Studio de Inovação Foursys" | Nome comercial ausente; falta a jornada hipótese → MVP e o argumento "valida antes de investir pesado" |
| 1.3 Novo Modelo Operacional para a Era da IA | `Oferta_1_3_Novo_Modelo_Operacional_Comercial` | ❌ Ausente | — | **Maior gap estratégico.** É a conversa de board mais alta do portfólio e não existe no portal. Sem régua de maturidade (eficiência → reinvenção) nem conexão com Agentic Enterprise |

### Eixo 2 · IA Estratégica & Governança (diferenciação · âncora da tese)

| Oferta (portfólio) | Kit PDF | Status | Onde está no portal | Gap |
|---|---|---|---|---|
| 2.1A AI Strategy & Roadmap | `Oferta_2_1A_AI_Strategy_Roadmap_Comercial` | ✅ Coberto | IA na Foursys → "AI Strategy & Roadmap" (fases Estratégia / Mapeamento / Aceleração, priorização por ROI, 7 módulos de capacitação) | Alinhado. Falta apenas nomear o método proprietário (Identificação → Quantificação → Dimensionamento → Custo → ROI) e a matriz Valor × Complexidade |
| 2.1B Governança & Soberania de IA | `Oferta_2_1B_Governanca_Soberania_Comercial` | 🟡 Parcial | IA na Foursys → "Governança de IA" + "10 Pilares de Governança Foursys" | Falta toda a tese de **soberania**: multi-cloud, independência de modelo, anti-lock-in, "quem assina embaixo das decisões automatizadas". No portfólio é a **oferta âncora**; no portal é um serviço entre seis |
| 2.1C AI Discovery Workshop | `Oferta_2_1C_AI_Discovery_Comercial` | ❌ Ausente | — | Porta de entrada de baixo atrito e rampa de pipeline. Nenhum equivalente no portal |
| 2.2 Fábrica de Agentes de IA | `Oferta_2_2_Fabrica_de_Agentes_Comercial_Enxuto` | 🟡 Parcial | IA na Foursys → "Criação de Agentes de IA" | Nome divergente; falta o enquadramento de escala industrial + governança desde o primeiro agente e a opção de construir na plataforma do próprio cliente (sem exigir Nexus) |
| 2.3 IA para Hiper-eficiência de Áreas Meio e de Negócio | `Oferta_2_3_Hiper_eficiencia_Comercial` | 🟡 Parcial | Linhas de Serviço → "Hiperautomação & RPA" | O portal vende RPA + orquestração; o portfólio vende **org design + automação + IA** com CoEs, ancorado na governança do Eixo 2. Reposicionamento necessário, não só renomeação |

### Eixo 3 · Engenharia & Modernização acelerada por IA (capacidade)

| Oferta (portfólio) | Kit PDF | Status | Onde está no portal | Gap |
|---|---|---|---|---|
| 3.1 Modernização e Otimização de Aplicações | `Oferta_3_1_Modernizacao_Aplicacoes_Comercial` | ✅ Coberto | Principais Ofertas + Linhas de Serviço → "Modernização de Legados" (aceleradores 4AI, ciclos de 6 semanas, POC/POT, 3 modelos) | Portal é **mais rico** em processo, mas **mais pobre em prova**: o kit é o único com cases nomeados e liberados (4M linhas de monolito → microsserviços em 12 meses; +2M linhas COBOL/Visual Age → .NET+React; AS400 → Java com instalação de 12 → 3 meses) e o portal não os exibe. Falta também o gancho "modernização destrava IA" e os demais gatilhos (EOL, escassez de COBOL, risco regulatório, M&A). Divergência de nomenclatura: portal diz "aceleradores 4AI" (3), kit diz NEXUS (5: Extrator de Regras, Conversor de Código, Certificação, DataForge, CodeCompare) |
| 3.2 Engenharia Digital acelerada por IA | `Oferta_3_2_Engenharia_Digital_Comercial_Enxuto` | 🟡 Parcial | Linhas de Serviço → "Design e Engenharia de Software com IA" | Nome divergente; falta o enquadramento "oferta gênesis da Foursys, 26 anos de lastro" e a substituição dos aceleradores pelos do cliente |
| 3.3 Qualidade | `Oferta_3_3_Qualidade_Comercial_Enxuto` | ✅ Coberto | Principais Ofertas + Linhas de Serviço → "Qualidade & Testes com IA" (COE + CSC, Shift-Left, Agente Automatizador, DataForge, GMUD) | Portal detalha mais que o kit em narrativa, mas usa **8 passos de shift-left** onde o kit descreve **pipeline de 11 etapas com 11 gates**. Falta a tese de mercado (qualidade vira o novo gargalo quando engenharia acelera) e o terceiro agente do kit, o Validador de US. **Atenção**: todos os números de ganho que o portal publica nesta oferta estão marcados `[VALIDAR ORIGEM E LASTRO]` no kit — ver §9 |
| 3.4 Agentic Squad Model | `Oferta_3_4_Agentic_Squad_Model_Comercial` | 🟡 Parcial | Principais Ofertas → "AI Squad"; Delivery → "Squad + Agentes IA"; IA na Foursys → "AI Squad" | Substância coberta (SDD, 20+ agentes, dashboards, sem lock-in), mas o **nome institucional não aparece**. Falta a camada de **controle financeiro de IA** (consumo por squad, agente e fase), que é o diferencial nº 1 do kit. Ver §9: o portal publica números de produtividade que o kit declara inexistentes |

### Eixo 4 · Inteligência de Dados & Decisão (capacidade)

| Oferta (portfólio) | Kit PDF | Status | Onde está no portal | Gap |
|---|---|---|---|---|
| 4.1 Data Readiness para IA | sem kit | 🟡 Parcial | Linhas de Serviço → "Dados & Analytics" (Data Governance & Quality, Data CoE, Data Mesh, MLOps) | O portal vende plataforma de dados clássica. Falta o reenquadramento AI-readiness: prontidão, camada/modelo semântico, metadados ativos, dados como produto, "prepare seus dados para a era dos agentes" |
| 4.2 Decision Intelligence | sem kit | 🟡 Parcial | Dados & Analytics → "ask your data", BI e dashboards executivos | Nome e tese ausentes. O portfólio declara dashboard como componente, não produto; o portal ainda vende dashboard como entrega |
| 4.3 Autonomous Intelligence | sem kit | ❌ Ausente | — | Sem oferta de modelos que preveem **e agem** (preditivo, classificação, recomendação, decisão autônoma com guardrails). Ponte natural para a Fábrica de Agentes não existe no portal |

### Eixo 5 · Cloud & FinOps (capacidade/diferenciação · SharpOps)

| Oferta (portfólio) | Kit PDF | Status | Onde está no portal | Gap |
|---|---|---|---|---|
| 5.1 Otimização de Cloud e FinOps | sem kit | 🟡 Parcial | Linhas de Serviço → "Arquitetura, DevOps, Cloud e FinOps" (–35% de custo cloud) | Falta o que mais diferencia: a unidade de negócio **SharpOps** e o modelo comercial **gain-share** (ganhamos só sobre a economia gerada), além do argumento das "seis ferramentas de observabilidade vs. uma" |
| 5.2 Otimização de Ambientes On-Premise | sem kit | ❌ Ausente | — | Nenhuma menção a otimização de desktops/infra local |
| 5.3 Tokenomics | sem kit | ❌ Ausente | — | — |

### Eixo 6 · Cybersegurança (via Zeragon)

| Item | Status | Onde está no portal | Gap |
|---|---|---|---|
| Cybersegurança de grupo | 🟡 Parcial | Principais Ofertas + Linhas de Serviço → "Cibersegurança"; deep dive traz a vertical **Sec4Sys** (6 domínios, SECaaS) | **Divergência de marca:** o portfólio usa **Zeragon (ex-Sec4Sys)**; o portal ainda usa Sec4Sys. Falta a conexão explícita com governança de IA e dado sensível como porta de entrada |

### Visão de Futuro

| Item | Status | Onde está no portal | Gap |
|---|---|---|---|
| Tokenização e Economia Digital | ❌ Ausente | — | Plataforma proprietária de tokenização não aparece |
| Soluções ESG (GreenOps + GreenToken) | ❌ Ausente na seção | Existe seção `ESG` separada, fora de Ofertas e Serviços | GreenOps/GreenToken como oferta tecnológica não aparece |
| Machine as Customer | ✅ Coberto | Inovação → tendência "Machine Customers & M2M" | Alinhado |
| Tecnologias Emergentes | 🟡 Parcial | Inovação → "Industry 4.0 & IoT", "IA & Robótica" | Faltam Quantum e Wearables |

### Ativos transversais

| Ativo | Status | Onde está no portal | Observação |
|---|---|---|---|
| NEXUS | ✅ Coberto | IA na Foursys → "Foursys Nexus" (3 pilares, posicionamento vs. hyperscalers, SaaS) | Nomenclatura do portal: "Foursys Nexus" |
| Fusion Teams | ✅ Coberto | IA na Foursys → serviço + drill (belts WHITE→BLACK, +12 clientes, +10.000h) | Alinhado |
| Agentes de IA alocados junto às pessoas | ✅ Coberto | Delivery → "Squad + Agentes IA"; AI Squad | Conceito presente, nome institucional não |
| Capacity as a Service | 🟡 Parcial | Delivery → "Alocação" e "Squad Dedicado" | Termo comercial não usado |
| Fourmakers | ✅ Coberto | Delivery → card de produtos + drill "#FOURTALENT" (fourmakers.io) | Portal detalha mais que o portfólio |
| Fourblox | ✅ Coberto | Principais Ofertas + deep dive (+18 soluções, 9 categorias, 30 dias, kits) | **O portfólio traz `Fourblox, {descrever}` — placeholder vazio.** O portal é a fonte melhor; deve alimentar o institucional |
| [NEXUS-PROVA] / cases-âncora | ❌ Ausente na seção | Cases vivem na categoria `Provas` | Ofertas não referenciam case/número — mesma fraqueza apontada no índice mestre |

### Camada de posicionamento (estrutural)

| Item | Status | Gap |
|---|---|---|
| Hierarquia diferenciação × capacidade | ❌ Ausente | O portal apresenta as ofertas em plano único. A vitrine ("Principais Ofertas") abre por Modernização, Cibersegurança e Qualidade — exatamente os Eixos 3 e 6, que o portfólio classifica como motor, não vitrine |
| Ordem de uso (abrir pela vitrine, puxar o motor) | ❌ Ausente | Nenhum caminho de navegação sugere Eixo 1/2 → Eixo 3 |
| Mapa de reframing e pontes entre ofertas | ❌ Ausente | Ofertas do portal não se referenciam entre si |
| Posicionamento competitivo (GFT, CI&T, Accenture, Avanade, BRQ, ACT, Capgemini) | ❌ Ausente | Material interno; avaliar se entra em área restrita do portal |

---

## 3. Matriz reversa — Portal → Portfólio

Conteúdo que existe no portal e **não tem correspondência** na Linha Mestra v5:

| Item do portal | Onde | Leitura |
|---|---|---|
| Arquitetura, DevOps, Cloud e FinOps (linha única) | Linhas de Serviço | Mistura Eixo 3 e Eixo 5 num só card; no portfólio são eixos distintos |
| Outsourcing & Sustentação / AMS | Linhas de Serviço + Delivery | Não é oferta do portfólio (é delivery puxado). Receita relevante sem lugar na tese |
| AI Framework (AI-SDLC Framework™) | IA na Foursys | Framework proprietário ausente do portfólio |
| 10 Pilares de Governança Foursys | IA na Foursys | Ativo forte de governança que o kit 2.1B não documenta |
| Alianças estratégicas (9 parceiros) | Alianças | Portfólio não trata ecossistema de parceiros — e reconhece a falta de visibilidade em quadrantes como exposição |
| Capacidades Técnicas (8 categorias, 200+ certificações) | Provas (adjacente) | Prova técnica não conectada às ofertas |
| Studio de Inovação, TBM, Design de Novos Modelos de Negócio | Inovação | Mais granular que a oferta 1.1 do portfólio |
| Tendências (6 cards com fontes) | Inovação | Cobre parcialmente a Visão de Futuro, com recorte diferente |
| Verticais (Público, Financeiro, Indústria, Saúde, Serviços) | IA na Foursys | Portfólio prevê versões segmentadas — o portal já tem o filtro |

---

## 4. Placar de cobertura

| Bloco | ✅ | 🟡 | ❌ | Total |
|---|---|---|---|---|
| Eixo 1 · Inovação & Estratégia | 0 | 2 | 1 | 3 |
| Eixo 2 · IA & Governança | 1 | 3 | 1 | 5 |
| Eixo 3 · Engenharia & Modernização | 2 | 2 | 0 | 4 |
| Eixo 4 · Dados & Decisão | 0 | 2 | 1 | 3 |
| Eixo 5 · Cloud & FinOps | 0 | 1 | 2 | 3 |
| Eixo 6 · Cybersegurança | 0 | 1 | 0 | 1 |
| Visão de Futuro | 1 | 1 | 2 | 4 |
| Ativos transversais | 5 | 1 | 1 | 7 |
| **Total** | **9** | **13** | **8** | **30** |

Leitura: cobertura é **inversamente proporcional à tese**. Os eixos de capacidade (3) estão bem cobertos; os eixos de diferenciação (1 e 2), que o portfólio define como vitrine, concentram os gaps.

---

## 5. Divergências de nomenclatura (renomeações candidatas)

| Portfólio 2026 S2 | Portal hoje | Ação sugerida |
|---|---|---|
| Zeragon (ex-Sec4Sys) | Sec4Sys | Atualizar marca |
| Agentic Squad Model | AI Squad / Squad + Agentes IA | Adotar nome institucional ou declarar equivalência |
| Fábrica de Agentes de IA | Criação de Agentes de IA | Renomear |
| Modernização e Otimização de Aplicações | Modernização de Legados | Avaliar (o termo do portal é mais direto ao cliente) |
| Engenharia Digital acelerada por IA | Design e Engenharia de Software com IA | Alinhar |
| IA para Hiper-eficiência | Hiperautomação & RPA | Renomear **e** reposicionar o conteúdo |
| SharpOps (unidade FinOps) | FinOps dentro de Arquitetura/Cloud | Criar identidade própria |
| Lab as a Service | Laboratório de Inovação Aberta | Alinhar |
| NEXUS | Foursys Nexus | Consistência entre materiais |

---

## 6. Documento de Foco × Portal (camadas de condução comercial)

O Documento de Foco v2 organiza a venda em três camadas. Nenhuma delas tem equivalente estruturado na seção Ofertas e Serviços.

### Núcleo da tese ("ponta de lança", vale para toda venda)

| Papel | Oferta | Existe no portal? |
|---|---|---|
| Âncora / diferenciação | 2B · Governança & Soberania de IA | 🟡 Existe como "Governança de IA", sem soberania e sem status de âncora |
| Rampa de entrada | 2C · AI Discovery Workshop | ❌ Não existe |
| Conversa de board | 1.3 · Novo Modelo Operacional | ❌ Não existe |

**As três ofertas que deveriam aparecer em quase toda conversa são justamente as que o portal não sustenta.**

### Camada 1 — Shortlist por persona

O Documento de Foco define 5 ofertas ordenadas para cada persona:

| Persona | Oferta #1 (abertura) | Cobertura no portal |
|---|---|---|
| CEO / Board | 1.3 Novo Modelo Operacional | ❌ |
| CIO / CTO | 2B Governança & Soberania | 🟡 |
| COO | 1.3 Novo Modelo Operacional | ❌ |
| CFO | 5.1 Cloud & FinOps (gain-share) | 🟡 sem o gain-share |
| CDO | 4.2 Decision Intelligence | ❌ |

No portal, o mais próximo disso são as **4 trilhas de navegação** (`data/trails.ts`): Express (C-level com agenda curta), Executiva (comitê), Tech (CTO/arquitetos) e Negócio (CEO/CFO/diretores). São trilhas **por seção**, não por oferta, e não existem trilhas para COO nem CDO — duas das cinco personas do Documento de Foco. Nenhuma trilha reflete a ordem Marca → Pipeline → Ticket: as quatro abrem por `home` → `identity` → `offers-flagship`, e `offers-flagship` hoje lidera com Eixo 3.

### Camada 2 — Overlay por segmento

O Documento de Foco define 7 segmentos (Financeiro, Saúde, Indústria, Agro, Utilities, Varejo, Financeiro-estratégico) com o que sobe na prioridade, a dor específica e as objeções típicas.

O portal tem um filtro de **5 verticais** em IA na Foursys (Público, Financeiro, Indústria, Saúde, Serviços) e um wizard de perfil de sessão (`SessionProfile`: setor financeiro/saúde/seguros/outro + papel + objetivo). Cobertura parcial e desalinhada: faltam Agro, Utilities e Varejo — três segmentos que o Documento de Foco detalha com dor e objeção próprias — e sobra "Setor Público", que o Documento de Foco não trata. O filtro também não muda a priorização das ofertas, só o conteúdo exibido.

### Camada 3 — Kit de condução (qualificação, objeções, reframing)

Sem equivalente. O portal tem um FAQ genérico de 15 perguntas (`data/faq.ts`), não vinculado a oferta e sem lógica de contorno de objeção. O Documento de Foco traz, por oferta, perguntas de qualificação, sinais de fit e objeções com resposta — material que hoje não chega a quem apresenta.

### Achados de qualidade no FAQ (correções independentes da matriz)

Durante a comparação apareceram inconsistências do FAQ com o próprio portal:

| # | Problema | Onde |
|---|---|---|
| 1 | `sectionLink` aponta para `shi-case`, `santander-insights` e `quality-ia`, que **não existem** no tipo `AppSection`. O valor é forçado com `as AppSection` no `SectionFAQ`, então o TypeScript não acusa, e o `SectionRenderer` (cadeia de `section === '...' &&`, sem fallback) **renderiza tela vazia** | `data/faq.ts` linhas 66, 106, 114 (PT) e 189, 229, 237 (EN) |
| 2 | FAQ diz "8 linhas de serviço" e cita **Salesforce & CRM**, que não existe em `services.ts` nem entre as 9 alianças | `faq-4` |
| 3 | FAQ chama o produto de **Fourblock** e o descreve como catálogo de blocos técnicos; o portal vende **FourBlox** como 18+ soluções em 9 categorias | `faq-6` |
| 4 | FAQ diz **4 modelos de delivery**; o portal tem 6 | `faq-5` |
| 5 | FAQ define **SDD como "Software Defined Delivery"**; no AI Squad, SDD é o framework Spec-Driven (OpenSpec). Mesma sigla, dois significados | `faq-9` vs `services.ts` |
| 6 | FAQ lista alianças "AWS, Databricks, Salesforce e Pega"; `alliances.ts` tem 9 parceiros e nenhum Salesforce | `faq-11` |
| 7 | FAQ descreve **FourMakers** como comunidade/programa de eventos; em Delivery é a plataforma de gestão de pessoas (fourmakers.io, #FOURTALENT) | `faq-12` vs `SectionDelivery` |
| 8 | Duas perguntas Santander-específicas dentro do FAQ institucional genérico | `faq-13`, `faq-14` |

---

## 7. Backlog priorizado

**P0 — defeito funcional**

0. Corrigir os três `sectionLink` inválidos do FAQ (tela em branco ao clicar) e tipar `sectionLink` como `AppSection` em `FAQItem` para o compilador passar a barrar o erro.

**P0 — risco de exposição**

0b. Rever os cards de métrica de AI Squad, Qualidade & Testes, Design e Engenharia e Hiperautomação: são números que os kits classificam como não validados ou inexistentes e o portal publica como compromisso. Detalhe e encaminhamento em §9.

**P0 — gaps que quebram a tese comercial**

1. Criar oferta **Novo Modelo Operacional para a Era da IA** (1.3) — hoje inexistente e é a conversa de board mais alta.
2. Elevar **Governança & Soberania de IA** (2.1B) a oferta âncora, com a tese de soberania (multi-cloud, independência de modelo, anti-lock-in).
3. Reordenar **Principais Ofertas** para abrir pela vitrine (Eixos 1 e 2) e posicionar engenharia como motor puxado — **sem esconder modernização**: o kit 3.1 trata a entrada pela dor de legado como caminho legítimo (Caminho B) e adverte que forçar conversa estratégica não pedida perde o deal.
4. Criar **AI Discovery Workshop** (2.1C) como porta de entrada de baixo atrito — o kit está completo, com headline, CTA e método prontos para portar (§8.8).

**P1 — reposicionamento de conteúdo existente**

5. Reenquadrar **Dados & Analytics** em 4.1 Data Readiness + 4.2 Decision Intelligence.
6. Reposicionar **Hiperautomação & RPA** como 2.3 Hiper-eficiência (org design + automação + IA).
7. Extrair **SharpOps / FinOps gain-share** de dentro da linha de arquitetura.
8. Nomear **Lab as a Service** e **Roadmap de Inovação** na subseção Inovação.

**P2 — completude e consistência**

9. Criar 4.3 Autonomous Intelligence.
10. Atualizar Sec4Sys → Zeragon e conectar cyber à governança de IA.
11. Adicionar Tokenização, GreenOps/GreenToken, Quantum/Wearables.
12. Conectar cases-âncora ([NEXUS-PROVA]) a cada oferta — objeção "cadê o número?" é a mais crítica segundo o índice mestre.

**Contrafluxo (portal → institucional)**

13. Enviar ao time de portfólio o conteúdo de **Fourblox** (placeholder `{descrever}` no institucional), **AI-SDLC Framework™** e os **10 Pilares de Governança**, que só existem no portal.

---

## 8. Rastreabilidade em nível de bloco (kits comerciais)

### 8.1 Anatomia padrão do kit e regra de exposição

Cada kit segue até 12 blocos. Antes de portar qualquer conteúdo, vale a classificação de exposição — os kits são marcados "uso interno / compartilhamento restrito" e o portal roda **em frente ao cliente**.

| # | Bloco do kit | Exposição no portal |
|---|---|---|
| 1 | Resumo da oferta (o que é, a dor, resultados esperados, USP) | ✅ Publicável — é a matéria-prima natural do `offerDetail` |
| 2 | Benchmark competitivo (concorrentes nominados, onde estamos expostos) | ⛔ Nunca expor |
| 3 | Como entregamos (fases, movimentos, duração) | ✅ Publicável |
| 4 | Modelos de pricing (faixas estimadas, `[AJUSTE FOURSYS]`) | ⛔ Nunca expor |
| 5 | Estrutura de sponsors no cliente | 🔒 Uso do apresentador |
| 6 | One-pager (headline, "você sai com", CTA) | ✅ Publicável — melhor fonte para card e modal |
| 7 | Elevator pitches por persona | 🔒 Uso do apresentador |
| 8 | Pitches detalhados por persona | 🔒 Uso do apresentador |
| 9 | Roteiro de qualificação (fases e gates) | 🔒 Uso do apresentador |
| 10 | Objeções com resposta | 🔒 Uso do apresentador (parte pode virar FAQ por oferta, reescrita) |
| 10b | Bloco de prova (camadas contra ceticismo) | 🟡 Parcial — a evidência sim, a tática de contorno não |
| 11 | Reframing playbook | ⛔ Nunca expor — descreve como não deixar a conversa virar preço |

Consequência prática: cerca de **um terço de cada kit é publicável**. O restante é munição de quem apresenta. Se o portal for ganhar essa camada, ela precisa de uma área restrita ou de um modo apresentador — não do fluxo normal de navegação.

### 8.2 Estado dos kits

Dos 12 kits, **sete são completos** (1.1, 1.2, 1.3, 2.1A, 2.1B, 2.1C, 2.3, 3.1) e **quatro são enxutos** (2.2, 3.2, 3.3, 3.4), sem one-pager, pitches, roteiro de qualificação nem bloco de objeções. Dois trazem blocos que não existem em nenhum outro: o **10c** da 2.3 (como responder "isso vai reduzir o time?", com regra inegociável de não prometer corte de quadro) e a **Escada de valor** da 3.1, que substitui o reframing playbook e aceita competir no terreno comoditizado.

Os quatro kits do núcleo da tese (1.2, 1.3, 2.1A, 2.1B) **não são enxutos**: todos têm os 12 blocos. Os dois do Eixo 2 trazem ainda "Como posicionar" (Caminho A proativo / Caminho B reativo), "Quando recusar", "Nota de portfólio" e uma lista de "Pendências abertas" (8 itens no 2.1A, 11 no 2.1B). O 2.1B é o mais extenso do portfólio, com 19 páginas.

### 8.3 Oferta 1.1 · Roadmap e Projetos de Inovação

| Bloco do kit | Conteúdo-chave | Equivalente no portal | Ação |
|---|---|---|---|
| Resumo | "Não é ideação nem hackathon, é a arquitetura de gestão que transforma inovação de evento em portfólio governado" | Inovação → "Estrutura e Governança de Inovação" (frase genérica) | Portar o enquadramento e a dor |
| USP (4) | Praticamos e já replicamos (Innovation Center + hubs/aceleradoras para terceiros) · playbook adaptável · inovação conectada à capacidade de construir · leitura de negócio na priorização | Ausente | Portar os 4 |
| Como entregamos | 3 movimentos: Diagnóstico (sem. 1–3), Estruturação (3–8), Ativação e transferência (8–12) · total 10–12 semanas · Fusion Teams na transferência | Ausente | Portar |
| One-pager | "Inovação que vira crescimento mensurável" · CTA de 45 min para ler a agenda atual | Ausente | Portar headline e CTA |
| Prova (10b) | `[INSERIR: 1-2 iniciativas do próprio Innovation Center que avançaram ou morreram por gate]` | — | Lacuna do institucional |

### 8.4 Oferta 1.2 · Lab as a Service

| Bloco do kit | Conteúdo-chave | Equivalente no portal | Ação |
|---|---|---|---|
| Resumo | Laboratório como serviço, da hipótese ao MVP; a dor é a distância entre a lógica corporativa e a lógica de experimentação | "Laboratório de Inovação Aberta" (menção, sem oferta) | Criar oferta |
| USP (3) | Método + engenharia na mesma casa **sem equity** (cliente mantém 100%) · visão de negócio antes da solução · jornada acelerada por IA, NEXUS opcional | Ausente | Portar — "sem equity" é resposta direta à objeção "isso é venture builder?" |
| Como entregamos | 3 ciclos: Enquadramento (sem. 1–2), Experimentação e MVP (2–8), Decisão (8+) · 8–12 semanas por tese · pode ser contínuo ou pontual | Ausente | Portar |
| One-pager | "Valide antes de investir pesado" · CTA: "traga uma tese travada" | Ausente | Portar |
| Prova | `[INSERIR: MVPs/produtos que a Foursys validou e construiu]` · NEXUS citado como case-âncora (produto em produção com cliente pagante) | — | Lacuna do institucional |

### 8.5 Oferta 1.3 · Novo Modelo Operacional (conversa de board)

| Bloco do kit | Conteúdo-chave | Equivalente no portal | Ação |
|---|---|---|---|
| Resumo | Régua de maturidade eficiência → aumentação → reinvenção; a armadilha é comemorar 15% de produtividade enquanto o concorrente reinventa estrutura de custo | Ausente | **Criar oferta (P0)** |
| USP (3) | Praticamos na própria casa · tese construída sobre a cultura existente, não modelo de prateleira · da decisão do conselho à operação funcionando | Ausente | Portar |
| Como entregamos | 3 movimentos: Leitura de maturidade (sem. 1–3), Tese (3–7), Roadmap de travessia (7–10) · 8–10 semanas | Ausente | Portar |
| Dado de mercado | "Até 2027, metade das decisões de negócio será aumentada ou automatizada por agentes de IA" (Gartner via itbrief.news, mai/2026) | Ausente | Portar com fonte |
| One-pager | "Reinvente, não só otimize" · CTA: conversa de board sobre a régua de maturidade | Ausente | Portar |
| Prova | `[INSERIR: a narrativa da própria travessia da Foursys]` — o kit marca como **"o case mais importante a documentar de todo o portfólio"** | Portal tem os insumos: Fusion Teams, AI Squad, Nexus em produção, belts | **Contrafluxo forte:** o portal já tem a matéria-prima dessa narrativa |
| Conexões | Puxa Agentic Squad Model, Hiper-eficiência (2.3) e Fábrica de Agentes | Ausente | Modelar como navegação entre ofertas |

### 8.6 Oferta 2.1A · AI Strategy & Roadmap

| Bloco do kit | Conteúdo-chave | Equivalente no portal | Ação |
|---|---|---|---|
| Resumo | A dor não é falta de casos, é excesso sem critério de decisão. Sete drivers, sendo o custo de modelo escalando o "mais subestimado e mais defensável" | IA na Foursys → drill "AI Strategy & Roadmap" (3 fases, priorização por ROI) | Enriquecer o existente |
| USP (3) | **Custo de inferência dimensionado antes da aprovação** (método de 5 etapas) · priorização feita por quem constrói · recomendação sem vínculo com fornecedor | Portal cita priorização por ROI, sem o método nomeado nem o custo unitário | Portar — é o argumento mais defensável e o portal não usa |
| Como entregamos | Estratégia (3–4 sem.) → Mapeamento (4–6) → Aceleração (8–16), durações marcadas `[AJUSTE FOURSYS]` | Portal tem as 3 fases sem duração | Portar durações após calibração |
| Dados de mercado | 88% dos pilotos de agentes não chegam à produção (bloqueadores: infra 41%, governança/segurança 38%, ROI 33% — Anaconda/Forrester via Digital Applied, abr/2026) · +70% modernizando infraestrutura para IA (Deloitte, 2026) | Portal usa "mercado de IA agêntica $89.6B 2026" | Substituir por dados de dor, mais acionáveis que tamanho de mercado |
| One-pager | "Decida onde investir em IA com critério, não com intuição" · CTA: "traga sua lista de iniciativas — mostramos quais mudam de posição quando o custo unitário entra na conta" | Ausente | Portar — CTA excelente |

### 8.7 Oferta 2.1B · Governança e Soberania de IA (âncora)

| Bloco do kit | Conteúdo-chave | Equivalente no portal | Ação |
|---|---|---|---|
| Resumo | **Governança instrumentada vs. declarada:** "Política de IA é o que você publica. Governança é o que você consegue provar depois." Quase nenhum cliente sabe quantos agentes tem em produção e quem responde por cada um | "Governança de IA" + 10 Pilares — **declarativos** | **Reposicionar (P0):** o portal está exatamente no lado fraco da própria distinção do kit |
| 4 frentes | Governança (política, comitê, matriz de risco, inventário vivo, AI TRiSM) · soberania · conformidade (EU AI Act, marco legal BR, agenda BACEN, LGPD) · governança em runtime | Parcial nos 10 Pilares | Reestruturar |
| Soberania (3 dimensões) | Independência de fornecedor · residência territorial · controle sobre a stack — o kit nota que rodar em região brasileira de hyperscaler entrega a segunda mas **não** a terceira | Ausente | Portar — é o núcleo da diferenciação |
| 7 componentes | Protocolo de inventário · matriz de risco por caso de uso · biblioteca de políticas e guardrails · trilha auditável · roteamento por política · painel de comitê · régua de maturidade | Ausente | Portar como entregáveis |
| Como entregamos | Raio-X (3–5 sem.) → Régua (4–8) → Instrumentação (8–16 por onda) → Operação e transferência (3–6 meses), via Fusion Teams | Ausente; portal já tem Fusion Teams com belts | Conectar |
| Dados de mercado | 57% já têm agentes em produção (LangChain) · ~38% operam +100 agentes, dobrou em um trimestre (Gravitee, abr/2026) · só 21% com governança madura e 44% sem dono nomeado (Forrester) · shadow AI 4× em um ano (Verizon DBIR 2026) · +40% terão incidente com IA não autorizada até 2030 (Gartner) | Ausente | Portar — é a melhor munição de urgência do portfólio |
| Regulatório | Digital Omnibus / Regulamento (UE) 2026/1744, em vigor 27/07/2026, adia Anexo III para 02/12/2027 e Anexo I para 02/08/2028; Artigo 50 vale desde 02/08/2026 · PL 2338/2023 na Câmara · BACEN com estudo, não norma | Portal cita "EU AI Act" genericamente no AI Framework | Atualizar com as datas — conteúdo perecível, revisar a cada ciclo |
| One-pager | "Escale IA sem perder o controle dela" · CTA: "traga o inventário que você não consegue fechar hoje" | Ausente | Portar |
| Ativos | NEXUS como instrumentação em runtime (demonstrável) · Fusion Teams para transferência · **Zeragon** para segurança ofensiva | Portal tem Nexus e Fusion Teams; usa **Sec4Sys**, não Zeragon | Corrigir marca e conectar |

### 8.8 Oferta 2.1C · AI Discovery Workshop (rampa de entrada)

| Bloco do kit | Conteúdo-chave | Equivalente no portal | Ação |
|---|---|---|---|
| Resumo | Única porta paga do Eixo 2 e rampa universal do portfólio: leva de "precisamos fazer algo com IA" a decisões defensáveis. Três dores: pressão sem direção, orçamento travado por incerteza (a mais comum), piloto que não foi a lugar nenhum | Ausente | **Criar oferta (P0)** — é a porta de entrada que falta ao portal |
| USP (3) | O produto é decisão, não ideação (otimiza para **descarte fundamentado com motivo registrado**) · conduzido por quem executa depois · prontidão avaliada em 4 dimensões: dado, capacidade técnica, capacidade de negócio, governança | Ausente | Portar os 3 |
| Como entregamos | 5 movimentos: enquadramento → sessões de levantamento → dimensionamento e prontidão → priorização e roadmap de entrada → devolutiva executiva. Duração `[AJUSTE FOURSYS]`. Método é a 2.1A condensada | Ausente | Portar sem durações |
| One-pager | "Saia com quatro decisões, não com cinquenta ideias" · CTA: "escolha um caso de uso que vocês estão considerando; percorremos o método por alto nele" | Ausente | Portar — melhor CTA de baixa fricção do portfólio |
| Benchmark | O workshop gratuito do hyperscaler existe porque o produto é o consumo; a big four diagnostica e terceiriza a execução; a boutique gera volume de ideias sem dimensionamento | Ausente | Vira bloco "por que pagar por um Discovery" |
| Prova | `[VALIDAR EM CAMPO]` nº de Discoveries conduzidos e **taxa de conversão da rampa — pendência nº 1 do Eixo 2** | — | Lacuna do institucional |

### 8.9 Oferta 2.2 · Fábrica de Agentes de IA (kit enxuto)

| Bloco do kit | Conteúdo-chave | Equivalente no portal | Ação |
|---|---|---|---|
| Resumo | Delivery **puxado — nunca oferta de abertura**. O gargalo deixou de ser construir o primeiro agente; é sustentar em produção. Em doze meses a casa tem um parque heterogêneo que ninguém mantém nem audita | IA na Foursys → "Criação de Agentes de IA" (uma das seis capacidades) | Manter, mas **não** promover a oferta de entrada |
| USP (3) | A unidade de entrega é agente **pronto para produção**, não agente construído · governança embutida na construção (dono, classificação de risco, guardrail, trilha) · escala industrial com integração ao legado crítico | Ausente | Portar |
| Segurança de agente | Identidade própria, credencial gerenciada, menor privilégio, segregação de ambiente, proteção contra injeção, gestão de segredo | Ausente | Portar — é o bloco que diferencia de plataforma de ISV |
| Dados de mercado | 88,4% relataram ao menos um incidente ligado a agentes em 12 meses e só 23% têm framework de segurança específico (AvePoint, 750 líderes de TI) · 44% colocam agentes em produção sem dono nomeado (Forrester) | Ausente | Portar |
| Pricing | Custo por execução é **instrumento de decisão, não base de cobrança** | — | ⛔ Não expor |
| Regra de leitura | "Se a sala fala em quantidade de agentes, a venda está no lugar errado" | Ausente | ⛔ Interno — mas o portal não deve reforçar contagem de agentes como métrica |
| Prova | `[NEXUS-PROVA]` — nº real de agentes em produção sustentados, com tempo de vida e taxa de sobrevivência. O kit declara ser **a prova central da oferta** | — | Lacuna do institucional |

Blocos ausentes no kit: one-pager, elevator pitches, pitches detalhados, roteiro de qualificação, 20 objeções e bloco de prova.

### 8.10 Oferta 2.3 · IA para Hiper-eficiência

| Bloco do kit | Conteúdo-chave | Equivalente no portal | Ação |
|---|---|---|---|
| Resumo | Três alavancas na mesma intervenção — organização do trabalho, automação e IA — com medição antes/depois. A dor: já se automatizou tarefa e o custo não caiu, porque o problema estava no desenho do processo em volta dela | Linhas de Serviço → "Hiperautomação & RPA" | **Reposicionar** — o portal vende a alavanca isolada que o kit diz não resolver |
| USP (4) | As três alavancas com uma equipe só · IA onde a automação tradicional sempre parou (exceção, documento não estruturado, julgamento) · **linha de base como entregável** · transferência por Fusion Teams com upskilling de quem tem a atividade alterada | Ausente | Portar |
| Como entregamos | Linha de base e diagnóstico (3–6 sem.) → processo-alvo e caso de eficiência (4–6) → implantação por ondas (8–20) → sustentação e replicação (3–6 meses), tudo `[AJUSTE FOURSYS]` | Ausente | Portar após calibração |
| One-pager | "Absorva mais volume sem crescer a operação na mesma proporção" · CTA: o diagnóstico entrega a linha de base quantificada **e vale mesmo que a implantação seja feita por outro** | Ausente | Portar — o CTA remove a trava de lock-in |
| **Bloco 10c** (exclusivo) | "Isso vai reduzir o time?" — três respostas graduadas (capacidade, recomposição de perfil, redução como decisão do cliente) e uma **regra inegociável: não prometer redução de quadro em nenhum cenário**, porque ativa RH, jurídico e relação sindical | Portal publica "-70% de esforço manual" e "+50% de produtividade operacional" nos cards | **Revisar copy:** a métrica de esforço manual, sem o enquadramento de capacidade, lê como corte de quadro para RH |
| Sponsors | Gatekeeper silencioso é **RH e relações trabalhistas** — podem parar o projeto quando surpreendidos | — | ⛔ Interno |
| Pricing | Gain-share só com linha de base auditável por escrito, perímetro de atribuição delimitado e cláusula de revisão | — | ⛔ Nunca expor |

### 8.11 Oferta 3.1 · Modernização e Otimização de Aplicações

| Bloco do kit | Conteúdo-chave | Equivalente no portal | Ação |
|---|---|---|---|
| Sete drivers | EOL de fabricante, escassez de mão de obra, custo de manutenção crescente, risco regulatório e cyber, move to cloud, M&A, IA bloqueada por falta de dado limpo e API. O kit alerta que **amarrar a oferta só à IA estreita o funil** | Portal amarra a narrativa a aceleradores de IA | Ampliar os gatilhos de entrada |
| USP (3) | Método de 6 etapas em ciclos de 6 semanas, composição 50/50 IA + supervisão sênior · escala industrial **e** de complexidade (4M linhas, mainframe, AS400) · arquitetura aberta com alvo multi-cloud verificável e conhecimento devolvido pelo Extrator de Regras | Portal tem ciclos de 6 semanas e 3 modelos; falta o 50/50 e o "conhecimento devolvido" | Portar os 2 que faltam |
| Aceleradores | **NEXUS**: Extrator de Regras, Conversor de Código, Certificação, DataForge, CodeCompare | Portal: "aceleradores 4AI" (3) | **Unificar marca e completar a lista** |
| Cases (liberados) | 4M linhas de monolito → microsserviços Python em 12 meses (instituição financeira EUA) · +2M linhas COBOL/Visual Age → .NET + React, com ~20% de aumento de negócios (seguradora) · AS400 → Java em cloud, instalação de 12 → 3 meses, 600 mil linhas (Risk Score Global) | Ausentes no portal | **Publicar (P1)** — único kit com prova nomeada e sem `[NEXUS-PROVA]` |
| Dados de mercado | Ônus de sistemas bancários desatualizados pode chegar a US$ 57 bi/ano até 2028 (IDC Financial Insights via TI Inside, abr/2026) · 78% já usam IA em modernização (Red Hat) | Ausente | Portar |
| Bloco 11 (Escada de valor) | Degrau 1 elevar, degrau 2 competir bem na commodity. "O erro a evitar não é virar commodity — é perder o deal tentando forçar uma conversa estratégica que o cliente não pediu" | — | ⛔ Interno, mas **nuança o item P0 nº 3**: modernização é porta de entrada legítima; o problema é ser a *única* |

### 8.12 Oferta 3.2 · Engenharia Digital (kit enxuto)

O kit é o mais enxuto do portfólio e traz o enquadramento de **oferta gênesis** (o que a Foursys faz há 26 anos), o piloto de entrega de 3 meses e a métrica de custo unitário. O portal chama a mesma coisa de "Design e Engenharia de Software com IA" e publica ganhos percentuais que **não aparecem no kit** — ver §9.

### 8.13 Oferta 3.3 · Qualidade (kit enxuto)

| Bloco do kit | Conteúdo-chave | Equivalente no portal | Ação |
|---|---|---|---|
| Nome | "Engenharia de Qualidade acelerada por IA" / "Studio de Engenharia de Qualidade" | "Qualidade & Testes com IA" | Alinhar nomenclatura |
| Pipeline | 11 etapas com 11 gates | Shift-left em 8 passos | Reconciliar — provavelmente o portal condensou |
| Agentes | Analista Gherkin, DataForge, **Validador de US** | Analista Gherkin, DataForge, Agente Automatizador | Confirmar o inventário real de agentes |
| Modelo CSC | Célula operando dentro de squad de terceiro, com limite de responsabilidade definido | Portal tem COE + CSC | ⛔ Limite de responsabilidade é cláusula contratual, não conteúdo de portal |
| Números | Todos marcados `[VALIDAR ORIGEM E LASTRO]`, com instrução de usar **só como ordem de grandeza, nunca como compromisso** | Portal publica como métrica de card | **Ver §9 — P0** |

### 8.14 Oferta 3.4 · Agentic Squad Model

| Bloco do kit | Conteúdo-chave | Equivalente no portal | Ação |
|---|---|---|---|
| Diferencial nº 1 | **Controle financeiro de IA**: consumo medido por squad, por agente e por fase do ciclo | Ausente | Portar — é o que separa a oferta de "squad com Copilot" |
| Nome | "Agentic Squad Model" | "AI Squad" | Decidir a marca única |
| Ambiente duplo para setores regulados | Aparece na Linha Mestra v5, **não é detalhado no kit** | Ausente nos dois | Lacuna do institucional, não do portal |
| Números de produtividade | `[NEXUS-PROVA]` — o kit declara que **não existe número medido** | Portal publica 80% de produtividade, 65% de lead time, 70% de retrabalho | **Ver §9 — P0** |

### 8.15 Lacunas de prova (comuns a todos os kits)

Os mesmos marcadores abertos atravessam o portfólio e são o gargalo real de qualquer melhoria no portal:

- `[NEXUS-PROVA]` — em 1.2, 2.1A, 2.1B, 2.1C, 2.2, 2.3 e 3.4, com nota de "definir o que pode ser dito: setor, porte, escopo". **3.1 é a única oferta que já tem prova nomeada e liberada**
- `[INSERIR: ...]` — exemplos concretos no bloco de prova de cada oferta; no 1.3, a narrativa da travessia da própria Foursys
- `[AJUSTE FOURSYS]` — todas as durações de fase do Eixo 2 e do Eixo 3 e todas as tabelas de pricing
- `[VALIDAR ...]` — no 2.1B, quais dos 7 componentes já são ativo formalizado; no 2.1C, a taxa de conversão da rampa; no 3.3, a origem de todos os números de ganho

Enquanto esses campos estiverem abertos, o portal só pode publicar a tese das ofertas, não a prova.

---

## 9. Risco de números sem lastro (achado transversal, P0)

Este é o achado mais consequente do cruzamento e não estava previsto no escopo original da matriz. **O portal publica como métrica firme números que os próprios kits institucionais classificam como não validados ou inexistentes.**

| Onde no portal | Número publicado | O que o kit correspondente diz |
|---|---|---|
| AI Squad | 80% de ganho de produtividade · 65% de redução de lead time · 70% de queda de retrabalho | Kit 3.4: números de produtividade Foursys **inexistentes**, marcados `[NEXUS-PROVA]` |
| Qualidade & Testes com IA | +6× em cobertura · +120 cenários/mês · DataForge em 1 dia · +80% de visibilidade · +10× | Kit 3.3: todos marcados `[VALIDAR ORIGEM E LASTRO]`, com instrução explícita de usar **só como ordem de grandeza, nunca como compromisso** |
| Design e Engenharia de Software com IA | +50% de produtividade · +35% · -20% | Kit 3.2: não constam |
| Hiperautomação & RPA | -70% de esforço manual · +50% de produtividade operacional | Kit 2.3 não traz esses números e proíbe qualquer promessa que se leia como redução de quadro |
| Modernização de Legados | até 30% de redução de custo · até 70% de aceleração | ✅ Batem com o kit 3.1 (referências Foursys declaradas) · o "+60% de segurança de código" do portal **não** consta |

Por que importa: o portal é material de cliente. Um número que a área comercial trata internamente como ordem de grandeza vira, na tela, um compromisso implícito — e a prova para sustentá-lo não existe hoje em nenhum dos kits. O risco é de expectativa contratual, não de marketing.

Encaminhamento sugerido, em ordem: (1) rotular esses cards como "referência de projetos anteriores, variável por contexto" enquanto a validação não sai; (2) abrir a mesma pendência de lastro que os kits já registram, com dono; (3) substituir, onde for possível, ganho percentual próprio por dado de mercado com fonte — o Eixo 2 tem munição sobrando para isso (88% dos pilotos, 88,4% de incidentes com agentes, 44% sem dono nomeado).
