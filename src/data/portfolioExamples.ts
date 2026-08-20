import type { Language } from '../i18n/types'

const EXAMPLES: Record<Language, Record<string, string>> = {
  pt: {
    '1.1': 'Uma empresa reúne iniciativas dispersas, prioriza as que têm valor e encerra cedo as que não passam pelos critérios.',
    '1.2': 'Uma hipótese de novo canal vira protótipo testável antes de receber investimento de escala.',
    '1.3': 'Uma operação revisa onde a IA apenas acelera tarefas e onde permite redesenhar papéis, custos e decisões.',
    '2.1A': 'Um comitê compara casos de IA por valor, risco, prontidão de dados e custo de operação antes de aprovar o roadmap.',
    '2.1B': 'Agentes em áreas diferentes passam a ter inventário, responsáveis, limites de acesso e trilha de auditoria comuns.',
    '2.1C': 'Em um workshop, cinquenta ideias são reduzidas a poucos casos priorizados, com próximos passos e descartes justificados.',
    '2.2': 'Um agente de atendimento sai do piloto com monitoramento, responsável, atualização e regra de desativação definidos.',
    '2.3': 'Uma área de back office absorve mais solicitações ao redesenhar o fluxo e combinar automação com IA.',
    '3.1': 'Um sistema legado crítico tem regras recuperadas, riscos mapeados e migração dividida em ondas seguras.',
    '3.2': 'Um produto digital passa do backlog à produção com engenharia assistida por IA e custo de entrega acompanhado.',
    '3.3': 'Uma organização cria padrões de qualidade no CoE e conecta execução de QA diretamente às squads.',
    '3.4': 'Uma squad combina especialistas e agentes ao longo do ciclo, medindo produtividade, custo e qualidade.',
    '4.1': 'Dados usados por um agente ganham dono, significado comum, qualidade monitorada e acesso protegido.',
    '4.2': 'Uma pergunta executiva recebe resposta com indicador único, origem rastreável e alerta para ação.',
    '4.3': 'Um modelo identifica risco, recomenda uma ação e atua apenas dentro de limites supervisionados.',
    '4.4': 'Plataforma, engenharia, governança e analytics passam a operar sob um padrão reutilizável de dados.',
    '5.1': 'Oportunidades de economia cloud são propostas no repositório, aprovadas pelo cliente e medidas após o deploy.',
    '5.2': 'Servidores e desktops locais são inventariados por uso real para consolidar capacidade sem afetar a operação.',
    '5.3': 'Um produto de IA mede custo por transação e escolhe modelos diferentes conforme valor, risco e orçamento.',
    '5.4': 'Uma aplicação ganha arquitetura-alvo, esteira automatizada, observabilidade e integração segura por APIs.',
    '6.1': 'Uma empresa mede sua maturidade de segurança e prioriza controles para aplicações, dados e terceiros.',
    '7.1': 'Um ambiente crítico passa a operar com SLA, governança, backlog de evolução e responsabilidade definida.',
    '8.1': 'Uma operação ativa no FourBlox os blocos necessários e amplia a solução conforme novas jornadas surgem.',
    '8.2': 'Uma empresa conecta dados de pessoas, competências e desenvolvimento no FourMakers para orientar decisões.',
  },
  en: {
    '1.1': 'A company brings scattered initiatives together, prioritizes those with value and stops weak bets early.',
    '1.2': 'A new-channel hypothesis becomes a testable prototype before receiving scale investment.',
    '1.3': 'An operation reviews where AI speeds up tasks and where it can redesign roles, costs and decisions.',
    '2.1A': 'A committee compares AI cases by value, risk, data readiness and operating cost before approving a roadmap.',
    '2.1B': 'Agents across business areas gain a shared inventory, owners, access limits and audit trail.',
    '2.1C': 'A workshop narrows fifty ideas to a few prioritized cases, with next steps and documented trade-offs.',
    '2.2': 'A service agent leaves pilot stage with monitoring, ownership, updates and retirement rules defined.',
    '2.3': 'A back-office team absorbs more requests by redesigning work and combining automation with AI.',
    '3.1': 'A critical legacy system has its rules recovered, risks mapped and migration split into safe waves.',
    '3.2': 'A digital product moves from backlog to production with AI-assisted engineering and visible delivery cost.',
    '3.3': 'An organization sets quality standards in a CoE and connects QA execution directly to squads.',
    '3.4': 'A squad combines specialists and agents across the lifecycle while measuring productivity, cost and quality.',
    '4.1': 'Data used by an agent gains ownership, shared meaning, monitored quality and protected access.',
    '4.2': 'An executive question gets one traceable metric and an alert that supports action.',
    '4.3': 'A model detects risk, recommends an action and operates only within supervised limits.',
    '4.4': 'Platform, engineering, governance and analytics operate under one reusable data standard.',
    '5.1': 'Cloud savings are proposed in the repository, approved by the client and measured after deployment.',
    '5.2': 'Local servers and desktops are inventoried by actual use to consolidate capacity safely.',
    '5.3': 'An AI product measures cost per transaction and routes work by value, risk and budget.',
    '5.4': 'An application gains a target architecture, automated pipeline, observability and secure API integration.',
    '6.1': 'A company measures security maturity and prioritizes controls for applications, data and third parties.',
    '7.1': 'A critical environment operates with SLAs, governance, an evolution backlog and clear accountability.',
    '8.1': 'An operation activates the FourBlox blocks it needs and expands as new journeys emerge.',
    '8.2': 'A company connects people, skills and development data in FourMakers to guide decisions.',
  },
}

export function getPortfolioExample(code: string, lang: Language): string | undefined {
  return EXAMPLES[lang][code]
}

export function hasPortfolioExample(code: string, lang: Language): boolean {
  return Boolean(EXAMPLES[lang][code])
}
