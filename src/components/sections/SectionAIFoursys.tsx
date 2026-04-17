import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BrainCircuit, Users, Rocket, DollarSign, Lightbulb,
  GraduationCap, BookOpen, Shield, CheckCircle2,
  Bot, Scale, Blocks, FlaskConical, Building2, Layers,
  ArrowRight, ChevronRight, TrendingUp, X, Sparkles,
  Waypoints, Compass, Gift, Zap, Gem, BadgeCheck, Timer,
  Target, AlertTriangle, RefreshCw, GitBranch, ExternalLink,
} from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { useLanguage } from '../../i18n'
import { useFocusTrap } from '../../hooks/useFocusTrap'

function hexToRgba(hex: string, a: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

const ORANGE = '#FF5315'
const MINT = '#89BAB1'

// ─── Data ────────────────────────────────────────────────────────────────────

interface ResultItem {
  icon: React.ReactNode
  title: { pt: string; en: string }
  desc: { pt: string; en: string }
  color: string
}

interface DetailSection {
  type: 'text' | 'steps' | 'belts' | 'metrics' | 'phases' | 'cards' | 'highlight' | 'list' | 'dimensions'
  title: { pt: string; en: string }
  body?: { pt: string; en: string }
  note?: { pt: string; en: string }
  items?: { pt: string[]; en: string[] }
  steps?: { num: string; title: { pt: string; en: string }; desc: { pt: string; en: string } }[]
  belts?: { name: string; label: { pt: string; en: string }; desc: { pt: string; en: string }; color: string }[]
  metrics?: { value: string; label: { pt: string; en: string } }[]
  phases?: { name: { pt: string; en: string }; items: { pt: string[]; en: string[] }; color: string }[]
  cards?: { title: { pt: string; en: string }; desc: { pt: string; en: string } }[]
  dimensions?: { icon: React.ReactNode; name: { pt: string; en: string }; items: { pt: string[]; en: string[] } }[]
}

interface ServiceItem {
  icon: React.ReactNode
  title: { pt: string; en: string }
  desc: { pt: string; en: string }
  marketBadge: { pt: string; en: string }
  bullets: { pt: string[]; en: string[] }
  color: string
  detail?: {
    tagline: { pt: string; en: string }
    sections: DetailSection[]
  }
}

interface HowItem {
  icon: React.ReactNode
  title: { pt: string; en: string }
  subtitle?: { pt: string; en: string }
  desc: { pt: string; en: string }
  highlight?: boolean
  color: string
  bullets?: { pt: string[]; en: string[] }
  pillars?: { icon: React.ReactNode; title: { pt: string; en: string }; desc: { pt: string; en: string } }[]
  detail?: {
    tagline: { pt: string; en: string }
    sections: DetailSection[]
  }
}

interface DetailableItem {
  icon: React.ReactNode
  title: { pt: string; en: string }
  color: string
  detail: { tagline: { pt: string; en: string }; sections: DetailSection[] }
}

const RESULTS: ResultItem[] = [
  {
    icon: <Users size={20} />,
    title: { pt: 'Performance nas Equipes', en: 'Team Performance' },
    desc: { pt: 'Aumento médio de 40% na produtividade com agentes de IA integrados ao fluxo de trabalho das equipes', en: 'Average 40% productivity increase with AI agents integrated into team workflows' },
    color: ORANGE,
  },
  {
    icon: <Rocket size={20} />,
    title: { pt: 'Redução do Time-to-Market', en: 'Time-to-Market Reduction' },
    desc: { pt: 'Redução de até 35% no tempo de entrega com automação inteligente e deploys assistidos por IA', en: 'Up to 35% faster delivery with intelligent automation and AI-assisted deployments' },
    color: '#60A5FA',
  },
  {
    icon: <DollarSign size={20} />,
    title: { pt: 'Redução de Custo', en: 'Cost Reduction' },
    desc: { pt: 'Economia média de 25% nos custos operacionais com ROI esperado entre 6 e 9 meses após a implantação', en: 'Average 25% operational cost savings with expected ROI within 6 to 9 months after deployment' },
    color: '#34D399',
  },
  {
    icon: <Lightbulb size={20} />,
    title: { pt: 'Inovação Aplicada', en: 'Applied Innovation' },
    desc: { pt: 'Mais de 70% dos nossos clientes já operam soluções de IA Agêntica em produção ou piloto avançado', en: 'Over 70% of our clients already run Agentic AI solutions in production or advanced pilot' },
    color: '#FBBF24',
  },
  {
    icon: <GraduationCap size={20} />,
    title: { pt: 'Profissionais Capacitados', en: 'Skilled Professionals' },
    desc: { pt: 'Capacitação contínua em IA com certificação, elevando o nível técnico para adoção acelerada', en: 'Continuous AI training with certification, raising technical proficiency for accelerated adoption' },
    color: '#A78BFA',
  },
  {
    icon: <BookOpen size={20} />,
    title: { pt: 'Retenção de Conhecimento', en: 'Knowledge Retention' },
    desc: { pt: 'Base de conhecimento corporativa alimentada por IA que preserva o know-how e reduz a dependência individual', en: 'AI-powered corporate knowledge base that preserves know-how and reduces individual dependency' },
    color: MINT,
  },
  {
    icon: <Layers size={20} />,
    title: { pt: 'Padronização e Consistência', en: 'Standardization & Consistency' },
    desc: { pt: 'Redução de até 45% no tempo de auditorias com governança unificada e processos padronizados por IA', en: 'Up to 45% reduction in audit time with unified governance and AI-standardized processes' },
    color: '#F472B6',
  },
  {
    icon: <Shield size={20} />,
    title: { pt: 'Segurança e Compliance', en: 'Security & Compliance' },
    desc: { pt: 'Framework de segurança integrado com conformidade regulatória e rastreabilidade de decisões de IA', en: 'Integrated security framework with regulatory compliance and AI decision traceability' },
    color: '#FB923C',
  },
]

const SERVICES: ServiceItem[] = [
  {
    icon: <Users size={22} />,
    title: { pt: 'AI Squad', en: 'AI Squad' },
    desc: {
      pt: 'Squads dedicados que combinam engenheiros, cientistas de dados e especialistas de domínio para acelerar a adoção de IA na sua operação.',
      en: 'Dedicated squads combining engineers, data scientists and domain specialists to accelerate AI adoption in your operation.',
    },
    marketBadge: {
      pt: '60% mais produtividade em equipes humano+IA',
      en: '60% more productivity in human+AI teams',
    },
    bullets: {
      pt: ['Engenharia de IA integrada ao negócio', 'Ciclos de entrega contínuos', 'Métricas de impacto mensuráveis'],
      en: ['AI engineering integrated with business', 'Continuous delivery cycles', 'Measurable impact metrics'],
    },
    color: ORANGE,
  },
  {
    icon: <Bot size={22} />,
    title: { pt: 'Criação de Agentes de IA', en: 'AI Agent Development' },
    desc: {
      pt: 'Design, desenvolvimento e deploy de agentes autônomos e semi-autônomos que automatizam processos complexos com inteligência contextual.',
      en: 'Design, development and deployment of autonomous and semi-autonomous agents that automate complex processes with contextual intelligence.',
    },
    marketBadge: {
      pt: '42% das Fortune 500 já operam agentes',
      en: '42% of Fortune 500 already run agents',
    },
    bullets: {
      pt: ['Agentes de atendimento e suporte', 'Automação de processos cognitivos', 'Integração com sistemas legados'],
      en: ['Customer service agents', 'Cognitive process automation', 'Legacy system integration'],
    },
    color: '#60A5FA',
  },
  {
    icon: <Scale size={22} />,
    title: { pt: 'Governança de IA', en: 'AI Governance' },
    desc: {
      pt: 'Frameworks de governança que garantem compliance, ética e rastreabilidade em todas as iniciativas de IA, alinhados com EU AI Act e LGPD.',
      en: 'Governance frameworks ensuring compliance, ethics and traceability across all AI initiatives, aligned with EU AI Act and LGPD.',
    },
    marketBadge: {
      pt: '60% das empresas sem framework formalizado',
      en: '60% of companies without formal framework',
    },
    bullets: {
      pt: ['Avaliação de risco e viés', 'Auditoria automatizada', 'Políticas de uso responsável'],
      en: ['Risk and bias assessment', 'Automated auditing', 'Responsible use policies'],
    },
    color: '#34D399',
  },
  {
    icon: <Blocks size={22} />,
    title: { pt: 'AI Framework', en: 'AI Framework' },
    desc: {
      pt: 'Implementação e evolução contínua de um framework de IA enterprise-ready que padroniza, escala e monitora todas as soluções de IA.',
      en: 'Implementation and continuous evolution of an enterprise-ready AI framework that standardizes, scales and monitors all AI solutions.',
    },
    marketBadge: {
      pt: 'Mercado de IA Agêntica: $89.6B em 2026',
      en: 'Agentic AI Market: $89.6B in 2026',
    },
    bullets: {
      pt: ['Catálogo de modelos e agentes', 'Orquestração multi-LLM', 'Observabilidade e monitoramento'],
      en: ['Model and agent catalog', 'Multi-LLM orchestration', 'Observability and monitoring'],
    },
    color: '#FBBF24',
    detail: {
      tagline: {
        pt: 'AI-SDLC Framework™ — o novo ciclo de vida de software na era pós-IA generativa',
        en: 'AI-SDLC Framework™ — the new software lifecycle in the post-generative-AI era',
      },
      sections: [
        {
          type: 'text',
          title: { pt: 'A Proposta', en: 'The Proposition' },
          body: {
            pt: 'O novo ciclo de vida de software começa na tela real em menos de uma semana. A Foursys combina especificações vivas (SDD), agentes de IA orquestrados e delivery humano em um framework auditável que substitui o SDLC tradicional — menos retrabalho, mais valor, documentação que nunca envelhece.',
            en: 'The new software lifecycle starts on a real screen in less than a week. Foursys combines living specifications (SDD), orchestrated AI agents and human delivery in an auditable framework that replaces traditional SDLC — less rework, more value, documentation that never ages.',
          },
        },
        {
          type: 'metrics',
          title: { pt: 'Indicadores do Framework', en: 'Framework KPIs' },
          metrics: [
            { value: '< 1 sem', label: { pt: 'Brief → Tela navegável', en: 'Brief → Navigable screen' } },
            { value: '4×', label: { pt: 'Aceleração de Upstream', en: 'Upstream acceleration' } },
            { value: '≥ 70%', label: { pt: 'Cobertura de testes', en: 'Test coverage' } },
            { value: '< 2%', label: { pt: 'Regressões pós-deploy', en: 'Post-deploy regressions' } },
          ],
        },
        {
          type: 'text',
          title: { pt: 'Por que o SDLC tradicional morreu em 2025', en: 'Why traditional SDLC died in 2025' },
          body: {
            pt: 'Escassez de sênior, EU AI Act, dívida técnica explosiva e commoditização de "IA que escreve código" mudaram o jogo. O valor migrou do modelo para o framework.',
            en: 'Senior talent scarcity, EU AI Act, exploding technical debt and commoditization of "AI that writes code" changed the game. Value migrated from the model to the framework.',
          },
          items: {
            pt: [
              '1970 · Waterfall — previsível, mas lento',
              '2001 · Scrum/Ágil — iterativo, com retrabalho',
              '2010 · DevOps — deploy veloz, upstream lento',
              '2020 · DevSecOps — segurança shift-left',
              '2026 · AI-SDLC · SDD — specs vivas + agentes + self-healing',
            ],
            en: [
              '1970 · Waterfall — predictable, but slow',
              '2001 · Scrum/Agile — iterative, with rework',
              '2010 · DevOps — fast deploy, slow upstream',
              '2020 · DevSecOps — shift-left security',
              '2026 · AI-SDLC · SDD — living specs + agents + self-healing',
            ],
          },
        },
        {
          type: 'phases',
          title: { pt: 'AI-SDLC Framework™ em 5 Camadas', en: 'AI-SDLC Framework™ in 5 Layers' },
          phases: [
            {
              name: { pt: '5 · Camada Humana', en: '5 · Human Layer' },
              color: '#A78BFA',
              items: {
                pt: ['C-level, Product Owner, Tech Lead e Stakeholders', 'Decisão, criatividade e relacionamento', 'O humano sobe de camada: deixa de caçar bug, passa a decidir direção'],
                en: ['C-level, Product Owner, Tech Lead and Stakeholders', 'Decision, creativity and relationship', 'Humans move up: stop hunting bugs, start deciding direction'],
              },
            },
            {
              name: { pt: '4 · Governança', en: '4 · Governance' },
              color: '#F472B6',
              items: {
                pt: ['Self-Healing por IA e rastreabilidade spec→código', 'LGPD/ANPD e EU AI Act by design', 'SOC2, ISO 27001 e controle de merge com regressão automática'],
                en: ['AI Self-Healing and spec→code traceability', 'LGPD/ANPD and EU AI Act by design', 'SOC2, ISO 27001 and merge control with automated regression'],
              },
            },
            {
              name: { pt: '3 · Orquestração', en: '3 · Orchestration' },
              color: '#34D399',
              items: {
                pt: ['Novo Produto — 17 steps', 'Engenharia Reversa — 8 steps', 'Evolução de Produto — 14 steps', 'Gates de qualidade obrigatórios entre fases'],
                en: ['New Product — 17 steps', 'Reverse Engineering — 8 steps', 'Product Evolution — 14 steps', 'Mandatory quality gates between phases'],
              },
            },
            {
              name: { pt: '2 · Agentes Especialistas', en: '2 · Specialist Agents' },
              color: '#FBBF24',
              items: {
                pt: ['30+ agentes orquestrados', 'UpStream: Visão, Produto, UX (@the-visionary, @the-artista Bella)', 'Habilitadores: Arquitetura, Segurança, Design (@the-architect-C4L4, @the-critico)', 'DownStream: Dev FE/BE por stack + QA Gherkin (@gherkinflow-agent)'],
                en: ['30+ orchestrated agents', 'UpStream: Vision, Product, UX (@the-visionary, @the-artista Bella)', 'Enablers: Architecture, Security, Design (@the-architect-C4L4, @the-critico)', 'DownStream: FE/BE Dev per stack + QA Gherkin (@gherkinflow-agent)'],
              },
            },
            {
              name: { pt: '1 · Specs Vivas', en: '1 · Living Specs' },
              color: '#60A5FA',
              items: {
                pt: ['Épicos e Features versionados', 'C4 Model L1-L4 e User Stories FE/BE', 'Gherkin, Security Assessment e Design System', 'Fonte única da verdade — sempre sincronizada com o código'],
                en: ['Versioned Epics and Features', 'C4 Model L1-L4 and FE/BE User Stories', 'Gherkin, Security Assessment and Design System', 'Single source of truth — always in sync with code'],
              },
            },
          ],
        },
        {
          type: 'cards',
          title: { pt: 'AS-IS × TO-BE — O Salto Concreto', en: 'AS-IS × TO-BE — The Concrete Leap' },
          cards: [
            {
              title: { pt: '❌ SDLC Tradicional (AS-IS)', en: '❌ Traditional SDLC (AS-IS)' },
              desc: {
                pt: '2-4 sem briefing · 3-6 sem wireframe · 4-6 sem specs · 8-16 sem dev FE · 8-16 sem dev BE · 4-8 sem QA manual. Total: 6 a 12 meses até produção, com docs desatualizadas em semanas.',
                en: '2-4 wk briefing · 3-6 wk wireframe · 4-6 wk specs · 8-16 wk FE dev · 8-16 wk BE dev · 4-8 wk manual QA. Total: 6 to 12 months to production, with outdated docs in weeks.',
              },
            },
            {
              title: { pt: '✅ AI-SDLC Foursys (TO-BE)', en: '✅ Foursys AI-SDLC (TO-BE)' },
              desc: {
                pt: '1-3 dias briefing + diagnóstico · 3-5 dias priorização + arquitetura · < 1 sem MVP navegável · 1 sem specs BE + security · 2-3 sem dev + testes + peer review. Total: 6 a 10 semanas até produção com governança completa.',
                en: '1-3 days briefing + diagnosis · 3-5 days prioritization + architecture · < 1 wk navigable MVP · 1 wk BE specs + security · 2-3 wk dev + tests + peer review. Total: 6 to 10 weeks to production with full governance.',
              },
            },
            {
              title: { pt: '♾️ Documentação Viva', en: '♾️ Living Documentation' },
              desc: {
                pt: 'DevOps + App Integrada + Self-Healing em dias. Engenharia Reversa pós-deploy mantém as docs eternamente sincronizadas com o código real — nunca mais documentação defasada.',
                en: 'DevOps + Integrated App + Self-Healing in days. Post-deploy Reverse Engineering keeps docs eternally in sync with real code — no more outdated documentation.',
              },
            },
          ],
        },
        {
          type: 'dimensions',
          title: { pt: 'Três Portas de Entrada', en: 'Three Entry Paths' },
          note: {
            pt: 'Começando do zero, entendendo um legado ou evoluindo um produto existente — todos plugáveis na sua stack.',
            en: 'Starting from zero, understanding a legacy or evolving an existing product — all pluggable into your stack.',
          },
          dimensions: [
            {
              icon: <Rocket size={18} />,
              name: { pt: 'Porta A · Greenfield', en: 'Path A · Greenfield' },
              items: {
                pt: ['Novo Produto — 17 steps · 6 fases · 6-10 semanas', 'Do briefing ao MVP em produção', 'Épicos → Priorização WSJF → Arquitetura + DS', 'MVP navegável < 1 sem → Specs BE → Dev FE/BE → DevOps'],
                en: ['New Product — 17 steps · 6 phases · 6-10 weeks', 'From briefing to MVP in production', 'Epics → WSJF Prioritization → Architecture + DS', 'Navigable MVP < 1 wk → BE Specs → FE/BE Dev → DevOps'],
              },
            },
            {
              icon: <Compass size={18} />,
              name: { pt: 'Porta B · Brownfield sem docs', en: 'Path B · Brownfield no docs' },
              items: {
                pt: ['Engenharia Reversa — 8 steps · 4 fases · 5-10 dias', 'Mapeia legados derivando do código real, sem suposições', 'Épicos do código → Features reais → C4 L1-L4 + 12 HTMLs', 'Design System inventário → Gherkin → OWASP + LGPD → US sincronizadas'],
                en: ['Reverse Engineering — 8 steps · 4 phases · 5-10 days', 'Maps legacies deriving from real code, no assumptions', 'Code Epics → Real Features → C4 L1-L4 + 12 HTMLs', 'Design System inventory → Gherkin → OWASP + LGPD → synced US'],
              },
            },
            {
              icon: <Layers size={18} />,
              name: { pt: 'Porta C · Brownfield com docs', en: 'Path C · Brownfield with docs' },
              items: {
                pt: ['Evolução de Produto — 14 steps · 4 fases · 8-15 dias', 'Novas features respeitando arquitetura, DS e BD existentes — zero regressão', 'Novos épicos (sem duplicar) → Features → FE mock + Usab >9', 'Gherkin + US BE → Evolução BD + Security → Dev + Tests + Review >8'],
                en: ['Product Evolution — 14 steps · 4 phases · 8-15 days', 'New features respecting existing architecture, DS and DB — zero regression', 'New epics (no duplicates) → Features → FE mock + Usab >9', 'Gherkin + BE US → DB Evolution + Security → Dev + Tests + Review >8'],
              },
            },
          ],
        },
        {
          type: 'steps',
          title: { pt: 'Loop Virtuoso do AI-SDLC', en: 'AI-SDLC Virtuous Loop' },
          note: {
            pt: 'Specs alimentam agentes · agentes são orquestrados por workflows · workflows passam por governança · humano valida no topo · feedback retorna para refinar as specs.',
            en: 'Specs feed agents · agents are orchestrated by workflows · workflows pass through governance · humans validate at top · feedback returns to refine specs.',
          },
          steps: [
            { num: '01', title: { pt: 'Specs Vivas', en: 'Living Specs' }, desc: { pt: 'Fonte da verdade', en: 'Source of truth' } },
            { num: '02', title: { pt: 'Agentes IA', en: 'AI Agents' }, desc: { pt: '30+ especialistas', en: '30+ specialists' } },
            { num: '03', title: { pt: 'Orquestração', en: 'Orchestration' }, desc: { pt: '3 workflows + gates', en: '3 workflows + gates' } },
            { num: '04', title: { pt: 'Governança', en: 'Governance' }, desc: { pt: 'Self-Healing + LGPD', en: 'Self-Healing + LGPD' } },
            { num: '05', title: { pt: 'Humano', en: 'Human' }, desc: { pt: 'Valida e decide', en: 'Validates and decides' } },
            { num: '✓', title: { pt: 'Produção', en: 'Production' }, desc: { pt: 'Docs vivas pós-deploy', en: 'Living post-deploy docs' } },
          ],
        },
        {
          type: 'cards',
          title: { pt: 'Cases Reais em < 1 Semana', en: 'Real Cases in < 1 Week' },
          cards: [
            {
              title: { pt: 'Check-in de Audiência — Grande Banco', en: 'Audience Check-in — Large Bank' },
              desc: {
                pt: 'Setor Financeiro · Jornada de check-in digital para audiências, integrada ao ecossistema do banco, com validação presencial e remota. React + Design System corporativo, mobile-first.',
                en: 'Financial Sector · Digital check-in journey for audiences, integrated with the bank ecosystem, with in-person and remote validation. React + corporate Design System, mobile-first.',
              },
            },
            {
              title: { pt: 'Pipeline de Dados — Cliente EUA', en: 'Data Pipeline — US Client' },
              desc: {
                pt: 'Dashboard para orquestrar, monitorar e governar pipelines de dados (ETL/ELT) de ponta a ponta, com visibilidade de latência, custos e SLA. React + Observability + Multi-source.',
                en: 'Dashboard to orchestrate, monitor and govern data pipelines (ETL/ELT) end-to-end, with latency, cost and SLA visibility. React + Observability + Multi-source.',
              },
            },
            {
              title: { pt: 'Gestão de Eventos Médicos', en: 'Medical Events Management' },
              desc: {
                pt: 'Saúde · Plataforma para planejar, promover e gerenciar eventos médicos e científicos: agenda de palestrantes, inscrições, credenciamento e relatórios. React + Multi-perfil.',
                en: 'Healthcare · Platform to plan, promote and manage medical and scientific events: speaker agenda, registrations, accreditation and reports. React + Multi-profile.',
              },
            },
            {
              title: { pt: 'Guarda Compartilhada — Governo', en: 'Shared Custody — Government' },
              desc: {
                pt: 'Setor Público · Plataforma para acompanhamento e gestão de processos de guarda compartilhada, conectando órgãos públicos e judiciário. React + LGPD by design + Acessibilidade.',
                en: 'Public Sector · Platform for tracking and managing shared custody processes, connecting public agencies and the judiciary. React + LGPD by design + Accessibility.',
              },
            },
          ],
        },
        {
          type: 'list',
          title: { pt: '5 Modelos de Engajamento', en: '5 Engagement Models' },
          items: {
            pt: [
              '🎁 Diagnóstico Express — Gratuito · 2 semanas · AS-IS/TO-BE, 3 quick-wins e projeção de ROI customizada',
              '⚡ Pilot — 4-6 semanas · preço fixo · 1 feature real entregue end-to-end com métricas comparáveis ao baseline',
              '🚀 Squad-as-a-Service — Trimestral renovável · Tech Lead + agentes + devs sênior Foursys com KPIs contratados',
              '🏛️ Framework License — Anual + enablement · seu time opera o framework com certificação; Foursys evolui',
              '💎 Outcome-based — Parceria estratégica · compartilhamento de ganho sobre redução de TTM ou custo',
            ],
            en: [
              '🎁 Express Diagnostic — Free · 2 weeks · AS-IS/TO-BE, 3 quick-wins and customized ROI projection',
              '⚡ Pilot — 4-6 weeks · fixed price · 1 real feature delivered end-to-end with metrics comparable to baseline',
              '🚀 Squad-as-a-Service — Quarterly renewable · Tech Lead + agents + Foursys senior devs with contracted KPIs',
              '🏛️ Framework License — Annual + enablement · your team operates the framework with certification; Foursys evolves it',
              '💎 Outcome-based — Strategic partnership · gain-sharing on TTM or cost reduction',
            ],
          },
        },
        {
          type: 'highlight',
          title: { pt: 'Próximo Passo', en: 'Next Step' },
          body: {
            pt: 'Vamos colocar seu próximo produto na tela real em menos de uma semana? Comece pelo Diagnóstico Express gratuito — sem amarra, sem obrigação. Se fizer sentido, avançamos para o Pilot. Se não, você leva o relatório com insights acionáveis.',
            en: 'Shall we put your next product on a real screen in less than a week? Start with the free Express Diagnostic — no strings, no obligation. If it makes sense, we move to Pilot. If not, you leave with a report of actionable insights.',
          },
        },
      ],
    },
  },
  {
    icon: <Waypoints size={22} />,
    title: { pt: 'Fusion Teams', en: 'Fusion Teams' },
    desc: {
      pt: 'Célula multidisciplinar que se anexa à sua área, mapeia jornadas, entrega automações com IA e low/no-code, e capacita seu time até a autonomia — entregando legado, não dependência.',
      en: 'Multidisciplinary cell that attaches to your area, maps journeys, delivers automations with AI and low/no-code, and trains your team to autonomy — leaving legacy, not dependency.',
    },
    marketBadge: {
      pt: '+10.000h economizadas em fluxos automatizados',
      en: '+10,000h saved in automated flows',
    },
    bullets: {
      pt: [
        'Ciclo Anexar/Desanexar com sprints iterativos de diagnóstico ao go-live',
        'Trilha de belts — do iniciante ao Champion autônomo em 6 meses',
        'Time integrado: PO/PM + Arquiteto/Dev IA + SME do cliente desde o dia um',
      ],
      en: [
        'Attach/Detach cycle with iterative sprints from diagnosis to go-live',
        'Belt track — from beginner to autonomous Champion in 6 months',
        'Integrated team: PO/PM + AI Architect/Dev + client SME from day one',
      ],
    },
    color: '#2DD4BF',
    detail: {
      tagline: {
        pt: 'Resolve dores reais do negócio enquanto capacita seu time em inovação e IA',
        en: 'Solves real business pain while training your team in innovation and AI',
      },
      sections: [
        {
          type: 'text',
          title: { pt: 'O Desafio do CIO Hoje', en: 'The CIO Challenge Today' },
          body: {
            pt: 'Áreas operacionais travadas em trabalho manual. Iniciativas de inovação que não saem do PowerPoint. Capacitações genéricas que não viram resultado. Pressão para entregar produtividade com IA — sem um modelo operacional que combine entrega concreta e formação de pessoas.',
            en: 'Operational areas stuck in manual work. Innovation initiatives that never leave PowerPoint. Generic training that produces no results. Pressure to deliver AI productivity — without an operational model that combines concrete delivery and people development.',
          },
        },
        {
          type: 'text',
          title: { pt: 'O que é Fusion Teams', en: 'What is Fusion Teams' },
          body: {
            pt: 'Uma célula de especialistas Foursys que se anexa a uma área do cliente por um ciclo estruturado, mapeia jornadas, entrega automações com IA e low/no-code, e simultaneamente capacita um profissional da área até que ele se torne multiplicador autônomo. Ao final, o time desanexa — deixando o legado rodando.',
            en: 'A Foursys specialist cell that attaches to a client area for a structured cycle, maps journeys, delivers automations with AI and low/no-code, and simultaneously trains an area professional until they become an autonomous multiplier. At the end, the team detaches — leaving the legacy running.',
          },
          items: {
            pt: [
              'Multidisciplinaridade real: Jornada (PO/PM), Tech/IA (Arquiteto/Dev), Negócio (SME do cliente)',
              'Autonomia com propósito: decide e executa dentro das diretrizes do Studio',
              'Ciclo ágil e iterativo: sprints curtos com hipóteses, testes e validação contínua',
              'Aprendizado constante: cada ciclo registra práticas e alimenta os próximos projetos',
            ],
            en: [
              'Real multidisciplinarity: Journey (PO/PM), Tech/AI (Architect/Dev), Business (client SME)',
              'Purposeful autonomy: decides and executes within Studio guidelines',
              'Agile iterative cycle: short sprints with hypotheses, tests and continuous validation',
              'Constant learning: each cycle records practices and feeds future projects',
            ],
          },
        },
        {
          type: 'steps',
          title: { pt: 'Ciclo Anexar / Desanexar', en: 'Attach / Detach Cycle' },
          note: {
            pt: 'Os ciclos 01→05 se repetem iterativamente até a desanexação, com o SME do cliente evoluindo em belts de maturidade.',
            en: 'Cycles 01→05 repeat iteratively until detachment, with the client SME evolving through maturity belts.',
          },
          steps: [
            { num: '01', title: { pt: 'Diagnóstico', en: 'Diagnosis' }, desc: { pt: 'Maturidade inicial', en: 'Initial maturity' } },
            { num: '02', title: { pt: 'Mapeamento', en: 'Mapping' }, desc: { pt: 'Processos, dores e oportunidades', en: 'Processes, pain points and opportunities' } },
            { num: '03', title: { pt: 'Priorização', en: 'Prioritization' }, desc: { pt: 'Quick wins e alto impacto', en: 'Quick wins and high impact' } },
            { num: '04', title: { pt: 'Ideação', en: 'Ideation' }, desc: { pt: 'Cocriação de soluções', en: 'Solution co-creation' } },
            { num: '05', title: { pt: 'Dev MVP', en: 'Dev MVP' }, desc: { pt: 'Construção iterativa', en: 'Iterative building' } },
            { num: '✓', title: { pt: 'Go-live', en: 'Go-live' }, desc: { pt: 'Entrega e validação', en: 'Delivery and validation' } },
          ],
        },
        {
          type: 'belts',
          title: { pt: 'Trilha de Maturidade', en: 'Maturity Track' },
          note: {
            pt: 'Em 6 meses, o objetivo é levar o SME até Yellow/Green Belt com autonomia para operar IA e no-code.',
            en: 'In 6 months, the goal is to bring the SME to Yellow/Green Belt with autonomy to operate AI and no-code.',
          },
          belts: [
            { name: 'WHITE', label: { pt: 'Introdução', en: 'Introduction' }, desc: { pt: 'Fundamentos de inovação e jornadas', en: 'Innovation and journey fundamentals' }, color: '#E5E7EB' },
            { name: 'YELLOW', label: { pt: 'Ferramentas', en: 'Tools' }, desc: { pt: 'Mapeamento, priorização e ideação', en: 'Mapping, prioritization and ideation' }, color: '#FBBF24' },
            { name: 'GREEN', label: { pt: 'Autonomia com IA', en: 'AI Autonomy' }, desc: { pt: 'Prompt engineering e no-code', en: 'Prompt engineering and no-code' }, color: '#34D399' },
            { name: 'BLUE', label: { pt: 'Champion', en: 'Champion' }, desc: { pt: 'Lidera novos ciclos na área', en: 'Leads new cycles in the area' }, color: '#60A5FA' },
            { name: 'BLACK', label: { pt: 'Estratégico', en: 'Strategic' }, desc: { pt: 'Visão apurada e tendências', en: 'Sharp vision and trends' }, color: '#9CA3AF' },
          ],
        },
        {
          type: 'metrics',
          title: { pt: 'Resultados Comprovados', en: 'Proven Results' },
          metrics: [
            { value: '+12', label: { pt: 'Clientes atendidos', en: 'Clients served' } },
            { value: '+30', label: { pt: 'Fluxos automatizados', en: 'Automated flows' } },
            { value: '+10.000h', label: { pt: 'Economizadas', en: 'Hours saved' } },
          ],
        },
        {
          type: 'highlight',
          title: { pt: 'Case Destaque', en: 'Featured Case' },
          body: {
            pt: 'Cinco áreas do Centro de Serviços Compartilhados de uma corporação com 2 mil colaboradores (RH, Jurídico, Operações, Marketing e Financeiro) passaram pelo Fusion Teams. Cada área teve ao menos uma jornada priorizada, com soluções entregues via ferramentas de mercado ou automações no-code — liberando os times para atuação estratégica.',
            en: 'Five areas of a Shared Services Center in a 2,000-employee corporation (HR, Legal, Operations, Marketing and Finance) went through Fusion Teams. Each area had at least one prioritized journey, with solutions delivered via market tools or no-code automations — freeing teams for strategic work.',
          },
        },
      ],
    },
  },
  {
    icon: <Compass size={22} />,
    title: { pt: 'AI Strategy & Roadmap', en: 'AI Strategy & Roadmap' },
    desc: {
      pt: 'Programa estruturado que leva sua organização da visão estratégica de IA até a execução dos primeiros casos priorizados — com diagnóstico de maturidade, governança e capacitação integrados.',
      en: 'Structured program that takes your organization from AI strategic vision to execution of prioritized use cases — with integrated maturity assessment, governance and training.',
    },
    marketBadge: {
      pt: 'ROI mensurável em cada caso priorizado',
      en: 'Measurable ROI on every prioritized case',
    },
    bullets: {
      pt: [
        'Framework de 3 fases: Estratégia, Mapeamento e Aceleração com método proprietário',
        'Priorização por ROI: funil de 5 etapas com matriz Valor × Complexidade',
        'Capacitação integrada: 7 módulos de IA com low-code para áreas de negócio e TI',
      ],
      en: [
        '3-phase framework: Strategy, Mapping and Acceleration with proprietary method',
        'ROI-driven prioritization: 5-stage funnel with Value × Complexity matrix',
        'Integrated training: 7 AI modules with low-code for business and IT teams',
      ],
    },
    color: '#818CF8',
    detail: {
      tagline: {
        pt: 'Inteligência Artificial que começa pela estratégia — não pela ferramenta',
        en: 'Artificial Intelligence that starts with strategy — not the tool',
      },
      sections: [
        {
          type: 'text',
          title: { pt: 'O Desafio do CEO e do COO', en: 'The CEO and COO Challenge' },
          body: {
            pt: 'A pressão para adotar IA é concreta, mas o ruído é maior. Ferramentas surgem a cada semana. POCs nascem soltos em áreas diferentes, sem critério de priorização. Investimentos vão para casos de baixo retorno. Custos de modelo escapam ao controle. O executivo não precisa de mais uma iniciativa isolada — precisa de uma visão orquestrada que transforme IA em vantagem competitiva mensurável.',
            en: 'The pressure to adopt AI is real, but the noise is louder. Tools emerge every week. POCs spring up across different areas with no prioritization criteria. Investments go to low-return cases. Model costs spiral out of control. Executives don\'t need another isolated initiative — they need an orchestrated vision that turns AI into measurable competitive advantage.',
          },
        },
        {
          type: 'text',
          title: { pt: 'O que é AI Strategy & Roadmap', en: 'What is AI Strategy & Roadmap' },
          body: {
            pt: 'Programa estruturado que leva a organização da visão estratégica de IA até a execução dos primeiros casos priorizados. Combina diagnóstico de maturidade, benchmarking de ferramentas, desenho de governança e comitês, capacitação de equipes e seleção rigorosa de casos de uso com método proprietário Foursys — construído a partir de 25 anos de experiência em transformação digital em grandes corporações.',
            en: 'Structured program that takes the organization from AI strategic vision to execution of prioritized use cases. Combines maturity assessment, tool benchmarking, governance and committee design, team training and rigorous use case selection with proprietary Foursys method — built from 25 years of digital transformation experience in large corporations.',
          },
        },
        {
          type: 'phases',
          title: { pt: 'Framework Foursys', en: 'Foursys Framework' },
          phases: [
            {
              name: { pt: 'Estratégia', en: 'Strategy' },
              color: '#818CF8',
              items: {
                pt: ['Tendências de mercado e tecnológicas', 'Avaliação de maturidade e definição da estratégia de IA', 'Plano de recursos para adoção de IA', 'Desenho de governança e comitês'],
                en: ['Market and technology trends', 'Maturity assessment and AI strategy definition', 'Resource plan for AI adoption', 'Governance and committee design'],
              },
            },
            {
              name: { pt: 'Mapeamento', en: 'Mapping' },
              color: '#60A5FA',
              items: {
                pt: ['Capacitação das equipes de negócio e TI', 'Avaliação Construir vs. Comprar tecnologias', 'Identificação de parceiros tecnológicos', 'Identificação e priorização de casos de uso'],
                en: ['Business and IT team training', 'Build vs. Buy technology assessment', 'Technology partner identification', 'Use case identification and prioritization'],
              },
            },
            {
              name: { pt: 'Aceleração', en: 'Acceleration' },
              color: '#34D399',
              items: {
                pt: ['Detalhamento e seleção dos casos', 'Experimentações e POCs dos casos priorizados', 'Análise de resultados com métricas de negócio', 'Rollout de produto ou projeto em escala'],
                en: ['Case detailing and selection', 'Experiments and POCs of prioritized cases', 'Results analysis with business metrics', 'Product or project rollout at scale'],
              },
            },
          ],
        },
        {
          type: 'steps',
          title: { pt: 'Método de Priorização — ROI Mensurável', en: 'Prioritization Method — Measurable ROI' },
          note: {
            pt: 'Priorização final via matriz Valor × Complexidade — considerando P&L endereçável, impacto, escala, alinhamento estratégico, complexidade de dados e riscos.',
            en: 'Final prioritization via Value × Complexity matrix — considering addressable P&L, impact, scale, strategic alignment, data complexity and risks.',
          },
          steps: [
            { num: '01', title: { pt: 'Identificação', en: 'Identification' }, desc: { pt: 'Oportunidades de IA', en: 'AI opportunities' } },
            { num: '02', title: { pt: 'Quantificação', en: 'Quantification' }, desc: { pt: 'Impacto dos problemas', en: 'Problem impact' } },
            { num: '03', title: { pt: 'Dimensionamento', en: 'Sizing' }, desc: { pt: 'Tamanho da oportunidade', en: 'Opportunity size' } },
            { num: '04', title: { pt: 'Estimativa', en: 'Estimation' }, desc: { pt: 'Custo de implantação', en: 'Implementation cost' } },
            { num: '05', title: { pt: 'Cálculo do ROI', en: 'ROI Calculation' }, desc: { pt: 'Retorno sobre investimento', en: 'Return on investment' } },
          ],
        },
        {
          type: 'dimensions',
          title: { pt: 'Seleção de Modelo de IA', en: 'AI Model Selection' },
          note: {
            pt: 'Matriz de 3 dimensões que protege o cliente de decisões que parecem boas no POC mas quebram em produção.',
            en: '3-dimension matrix that protects the client from decisions that look good in POC but break in production.',
          },
          dimensions: [
            {
              icon: <Shield size={18} />,
              name: { pt: 'Aplicabilidade', en: 'Applicability' },
              items: {
                pt: ['Cloud vs. Local (on-premise)', 'Modelo grande vs. pequeno', 'Requisitos de modalidade', 'Necessidade de fine-tuning', 'Privacidade e segurança'],
                en: ['Cloud vs. On-premise', 'Large vs. small model', 'Modality requirements', 'Fine-tuning needs', 'Privacy and security'],
              },
            },
            {
              icon: <Rocket size={18} />,
              name: { pt: 'Performance', en: 'Performance' },
              items: {
                pt: ['Capacidade de raciocínio', 'Compreensão de linguagem', 'Matemática e programação', 'Latência'],
                en: ['Reasoning capability', 'Language comprehension', 'Math and programming', 'Latency'],
              },
            },
            {
              icon: <DollarSign size={18} />,
              name: { pt: 'Custo', en: 'Cost' },
              items: {
                pt: ['Custo por token', 'Taxas de fine-tuning', 'Despesas com engenharia', 'Requisitos de hardware (on-premise)'],
                en: ['Cost per token', 'Fine-tuning fees', 'Engineering expenses', 'Hardware requirements (on-premise)'],
              },
            },
          ],
        },
        {
          type: 'cards',
          title: { pt: 'Arquétipos de Casos de Uso', en: 'Use Case Archetypes' },
          cards: [
            {
              title: { pt: 'Melhoria de Produtividade', en: 'Productivity Improvement' },
              desc: { pt: 'Chatbots internos, análise e criação de documentos, suporte a desenvolvimento, detecção de fraude', en: 'Internal chatbots, document analysis and creation, development support, fraud detection' },
            },
            {
              title: { pt: 'Interação com Cliente', en: 'Customer Interaction' },
              desc: { pt: 'Argumentos de vendas, co-pilots para agentes, hiper-personalização, criação de conteúdo visual', en: 'Sales arguments, agent co-pilots, hyper-personalization, visual content creation' },
            },
            {
              title: { pt: 'Automação Externa', en: 'External Automation' },
              desc: { pt: 'Chatbots externos, automação de WhatsApp, respostas em mídias sociais, relatórios personalizados', en: 'External chatbots, WhatsApp automation, social media responses, custom reports' },
            },
          ],
        },
        {
          type: 'list',
          title: { pt: 'Capacitação Integrada — 7 Módulos', en: 'Integrated Training — 7 Modules' },
          items: {
            pt: [
              'I — IA Generativa: introdução e fundamentos para áreas administrativas',
              'II — Fundamentos técnicos de IA e LLMs',
              'III — Ferramentas e aplicações práticas',
              'IV — IA Generativa avançada para áreas administrativas',
              'V — Estratégias de implementação e gestão',
              'VI — Criatividade e inovação com IA',
              'VII — Projeto prático aplicado a caso real da empresa',
            ],
            en: [
              'I — Generative AI: introduction and fundamentals for administrative areas',
              'II — Technical AI and LLM fundamentals',
              'III — Tools and practical applications',
              'IV — Advanced Generative AI for administrative areas',
              'V — Implementation and management strategies',
              'VI — Creativity and innovation with AI',
              'VII — Practical project applied to a real company case',
            ],
          },
        },
      ],
    },
  },
]

const HOW_ITEMS: HowItem[] = [
  {
    icon: <FlaskConical size={24} />,
    title: { pt: 'Laboratório de Inovação Aberta', en: 'Open Innovation Lab' },
    desc: {
      pt: 'Ambiente de experimentação rápida onde prototipamos e validamos soluções de IA com ciclos curtos, co-criando com o cliente antes de escalar.',
      en: 'Rapid experimentation environment where we prototype and validate AI solutions with short cycles, co-creating with the client before scaling.',
    },
    color: MINT,
  },
  {
    icon: <Building2 size={24} />,
    title: { pt: 'Estrutura de Soluções e Entregas', en: 'Solutions & Delivery Framework' },
    desc: {
      pt: 'Metodologia proprietária que conecta discovery, arquitetura, implementação e sustentação em um fluxo integrado com governança de ponta a ponta.',
      en: 'Proprietary methodology connecting discovery, architecture, implementation and sustain in an integrated flow with end-to-end governance.',
    },
    color: '#A78BFA',
  },
  {
    icon: <BrainCircuit size={24} />,
    title: { pt: 'MOXE', en: 'MOXE' },
    subtitle: {
      pt: 'O sistema operacional cognitivo da sua empresa',
      en: 'Your company\'s cognitive operating system',
    },
    desc: {
      pt: 'Crie, orquestre e governe agentes de IA em escala em uma única plataforma SaaS. Multi-cloud e multi-modelo, integrada ao DNA da sua organização — com produtividade, segurança e controle de custo desde o dia um.',
      en: 'Create, orchestrate and govern AI agents at scale on a single SaaS platform. Multi-cloud and multi-model, integrated into your organization\'s DNA — with productivity, security and cost control from day one.',
    },
    highlight: true,
    color: ORANGE,
    bullets: {
      pt: [
        'Construção para todos — de devs a analistas de negócio, sem depender de engenharia para sair do POC',
        'LLM Routing multi-modelo — seleção automática do melhor modelo por tarefa, sem lock-in de provedor',
        'Integrações nativas — CRM, Jira, GitHub, WhatsApp, Teams, RAG e mais, com contexto real do negócio',
        'Governança no núcleo — AI Safety, FinOps, auditoria e rastreabilidade embutidos, não como plugin',
      ],
      en: [
        'Built for everyone — from devs to business analysts, no engineering dependency to move past POC',
        'Multi-model LLM Routing — automatic best-model selection per task, no provider lock-in',
        'Native integrations — CRM, Jira, GitHub, WhatsApp, Teams, RAG and more, with real business context',
        'Core governance — AI Safety, FinOps, auditing and traceability built-in, not bolted on',
      ],
    },
    pillars: [
      {
        icon: <Shield size={16} />,
        title: { pt: 'Construção Segura', en: 'Secure Building' },
        desc: { pt: 'Boas práticas no desenho de agentes com análise estática e dinâmica dos fluxos', en: 'Best practices in agent design with static and dynamic flow analysis' },
      },
      {
        icon: <Scale size={16} />,
        title: { pt: 'Proteção de Dados', en: 'Data Protection' },
        desc: { pt: 'Políticas granulares de quais informações, modelos e usuários podem interagir', en: 'Granular policies for which data, models and users can interact' },
      },
      {
        icon: <DollarSign size={16} />,
        title: { pt: 'FinOps Nativo', en: 'Native FinOps' },
        desc: { pt: 'Billing e consumo por usuário, agente ou projeto — sem surpresas no fim do mês', en: 'Billing and consumption per user, agent or project — no end-of-month surprises' },
      },
    ],
    detail: {
      tagline: {
        pt: 'Crie, orquestre e governe agentes de IA em escala — com produtividade, segurança e controle de custo desde o dia um',
        en: 'Create, orchestrate and govern AI agents at scale — with productivity, security and cost control from day one',
      },
      sections: [
        {
          type: 'text',
          title: { pt: 'O Desafio da IA Corporativa Hoje', en: 'The Corporate AI Challenge Today' },
          body: {
            pt: 'Empresas estão adotando IA em múltiplas frentes e ferramentas diferentes, sem uma camada que unifique criação, operação e governança. O resultado é previsível: custos descontrolados, riscos de segurança, retrabalho de agentes parecidos em áreas diferentes e dependência de um único hyperscaler que limita escolhas.',
            en: 'Companies are adopting AI across multiple fronts and different tools, without a layer that unifies creation, operation and governance. The result is predictable: uncontrolled costs, security risks, rework of similar agents across different areas and dependency on a single hyperscaler that limits choices.',
          },
        },
        {
          type: 'text',
          title: { pt: 'O que é MOXE', en: 'What is MOXE' },
          body: {
            pt: 'MOXE é um sistema operacional cognitivo entregue como SaaS. Em uma única plataforma, sua empresa cria, orquestra e governa agentes autônomos, fluxos agênticos e skills. Opera em ambiente multi-cloud e seleciona dinamicamente o melhor modelo de IA para cada tarefa. Integra-se aos sistemas, canais e bases de conhecimento da empresa — aprendendo o DNA da organização e entregando respostas assertivas e contextualizadas.',
            en: 'MOXE is a cognitive operating system delivered as SaaS. On a single platform, your company creates, orchestrates and governs autonomous agents, agentic flows and skills. It operates in a multi-cloud environment and dynamically selects the best AI model for each task. It integrates with your company\'s systems, channels and knowledge bases — learning the organization\'s DNA and delivering assertive, contextualized responses.',
          },
        },
        {
          type: 'cards',
          title: { pt: 'Capacidades-Chave', en: 'Key Capabilities' },
          cards: [
            {
              title: { pt: 'Construção para Todos', en: 'Built for Everyone' },
              desc: { pt: 'De desenvolvedor a analista de negócio, qualquer usuário constrói agentes, fluxos e skills. Elimina a dependência de time de engenharia para tirar IA do POC.', en: 'From developer to business analyst, any user builds agents, flows and skills. Eliminates engineering team dependency to move AI past POC.' },
            },
            {
              title: { pt: 'Inteligência Multi-Modelo', en: 'Multi-Model Intelligence' },
              desc: { pt: 'LLM Routing seleciona automaticamente o melhor modelo para cada tarefa. Sem amarração a um único provedor, com custo otimizado por consumo.', en: 'LLM Routing automatically selects the best model for each task. No single-provider lock-in, with consumption-optimized cost.' },
            },
            {
              title: { pt: 'Conectado à sua Empresa', en: 'Connected to Your Business' },
              desc: { pt: 'Integrações nativas com CRM, Jira, GitHub, bases de conhecimento (RAG), WhatsApp, Teams, IDEs e mais. Agentes com contexto real do seu negócio.', en: 'Native integrations with CRM, Jira, GitHub, knowledge bases (RAG), WhatsApp, Teams, IDEs and more. Agents with real business context.' },
            },
            {
              title: { pt: 'Governança desde o Núcleo', en: 'Core Governance' },
              desc: { pt: 'AI Safety, FinOps, políticas de uso, auditoria e rastreabilidade. Controle que nenhum hyperscaler entrega em produto pronto.', en: 'AI Safety, FinOps, usage policies, auditing and traceability. Control that no hyperscaler delivers out of the box.' },
            },
          ],
        },
        {
          type: 'steps',
          title: { pt: 'Os 3 Pilares da Governança MOXE', en: 'The 3 MOXE Governance Pillars' },
          note: {
            pt: 'O que diferencia MOXE de qualquer toolkit de hyperscaler: governança não é plugin, é núcleo do produto.',
            en: 'What sets MOXE apart from any hyperscaler toolkit: governance is not a plugin, it\'s the product\'s core.',
          },
          steps: [
            { num: '01', title: { pt: 'Construção Segura e Guiada', en: 'Secure Guided Building' }, desc: { pt: 'Boas práticas aplicadas por padrão no desenho de agentes e skills, com análise estática e dinâmica dos fluxos construídos', en: 'Best practices applied by default in agent and skill design, with static and dynamic analysis of built flows' } },
            { num: '02', title: { pt: 'Proteção de Dados Sensíveis', en: 'Sensitive Data Protection' }, desc: { pt: 'Políticas de uso granulares: controle de quais informações podem ser processadas, por quais modelos, por quais usuários', en: 'Granular usage policies: control which data can be processed, by which models, by which users' } },
            { num: '03', title: { pt: 'Controle de Custo de IA', en: 'AI Cost Control' }, desc: { pt: 'FinOps nativo: billing, consumo de modelos e avaliações por usuário, agente ou projeto. Sem surpresas no fim do mês', en: 'Native FinOps: billing, model consumption and evaluations per user, agent or project. No end-of-month surprises' } },
          ],
        },
        {
          type: 'dimensions',
          title: { pt: 'Posicionamento no Mercado', en: 'Market Positioning' },
          note: {
            pt: 'MOXE é produto pronto com governança embutida, adaptado ao DNA da empresa — não um toolkit técnico genérico.',
            en: 'MOXE is a ready-made product with built-in governance, adapted to the company\'s DNA — not a generic technical toolkit.',
          },
          dimensions: [
            {
              icon: <Layers size={18} />,
              name: { pt: 'vs. Hyperscalers', en: 'vs. Hyperscalers' },
              items: {
                pt: ['Copilot Studio, Bedrock, Vertex entregam toolkit técnico', 'Sem governança nativa nem personalização ao negócio', 'MOXE: produto pronto, governança embutida, adaptado ao DNA da empresa'],
                en: ['Copilot Studio, Bedrock, Vertex deliver technical toolkit', 'No native governance or business customization', 'MOXE: ready product, built-in governance, adapted to company DNA'],
              },
            },
            {
              icon: <Bot size={18} />,
              name: { pt: 'vs. Plataformas Dev', en: 'vs. Dev Platforms' },
              items: {
                pt: ['Focam em code generation e produtividade de squads técnicos', 'Limitadas à engenharia de software', 'MOXE: transforma toda a operação corporativa, não só engenharia'],
                en: ['Focus on code generation and technical squad productivity', 'Limited to software engineering', 'MOXE: transforms the entire corporate operation, not just engineering'],
              },
            },
            {
              icon: <Blocks size={18} />,
              name: { pt: 'vs. Open-Source', en: 'vs. Open-Source' },
              items: {
                pt: ['LangGraph, CrewAI e similares exigem time de engenharia dedicado', 'Construção e manutenção sob responsabilidade do cliente', 'MOXE: SaaS pronto; qualquer usuário da empresa constrói'],
                en: ['LangGraph, CrewAI and similar require dedicated engineering team', 'Building and maintenance under client responsibility', 'MOXE: ready SaaS; any company user can build'],
              },
            },
          ],
        },
        {
          type: 'list',
          title: { pt: 'Prova de Maturidade', en: 'Proof of Maturity' },
          items: {
            pt: [
              'Nascida dentro da Foursys para resolver um problema real de engenharia em escala',
              'Escalou para toda a companhia como camada corporativa de IA',
              'Clientes pagantes ativos nos setores de Serviços, Financeiro e Meios de Pagamento',
              'Sustentada pela engenharia e capacidade de dados & IA da Foursys — 25 anos de mercado',
              '5 Studios integrados, certificações ISO 9001, 27001, 27701 (LGPD/GDPR)',
            ],
            en: [
              'Born inside Foursys to solve a real engineering problem at scale',
              'Scaled across the entire company as a corporate AI layer',
              'Active paying clients in Services, Financial and Payment sectors',
              'Backed by Foursys engineering and data & AI capabilities — 25 years in the market',
              '5 integrated Studios, ISO 9001, 27001, 27701 (LGPD/GDPR) certifications',
            ],
          },
        },
        {
          type: 'metrics',
          title: { pt: 'Modelo Comercial', en: 'Commercial Model' },
          metrics: [
            { value: 'SaaS', label: { pt: 'Assinatura mensal', en: 'Monthly subscription' } },
            { value: 'R$ 19.900', label: { pt: 'Plano recomendado /mês', en: 'Recommended plan /mo' } },
            { value: '100', label: { pt: 'Usuários ativos inclusos', en: 'Active users included' } },
            { value: 'R$ 0', label: { pt: 'Setup e onboarding', en: 'Setup and onboarding' } },
          ],
        },
        {
          type: 'highlight',
          title: { pt: 'MOXE + Fusion Teams — Adoção Acelerada', en: 'MOXE + Fusion Teams — Accelerated Adoption' },
          body: {
            pt: 'MOXE pode ser adotada isoladamente como SaaS. Para empresas que querem extrair valor máximo desde o primeiro ciclo, o programa Fusion Teams do Studio de Inovação Foursys embarca com uma célula multidisciplinar que capacita o time do cliente e entrega as primeiras jornadas automatizadas diretamente na plataforma — deixando autonomia residual para a área continuar inovando sozinha.',
            en: 'MOXE can be adopted standalone as SaaS. For companies wanting to extract maximum value from the first cycle, the Foursys Innovation Studio Fusion Teams program brings a multidisciplinary cell that trains the client team and delivers the first automated journeys directly on the platform — leaving residual autonomy for the area to continue innovating on its own.',
          },
        },
      ],
    },
  },
]

// ─── Result Card ─────────────────────────────────────────────────────────────

function ResultCard({ item, index, lang }: { item: ResultItem; index: number; lang: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.5, type: 'spring', stiffness: 120 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl overflow-hidden cursor-default"
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          background: hovered
            ? `linear-gradient(145deg, ${hexToRgba(item.color, 0.12)} 0%, rgba(10,12,20,0.95) 100%)`
            : `linear-gradient(145deg, ${hexToRgba(item.color, 0.04)} 0%, rgba(10,12,20,0.95) 100%)`,
        }}
        transition={{ duration: 0.4 }}
      />
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-400"
        style={{ border: hovered ? `1px solid ${hexToRgba(item.color, 0.35)}` : '1px solid rgba(255,255,255,0.06)' }}
      />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
        animate={{ width: hovered ? '60%' : '0%', opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
      />

      <div className="relative z-10 p-5 flex flex-col h-full" style={{ minHeight: 160 }}>
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-shadow duration-400"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(item.color, 0.2)}, ${hexToRgba(item.color, 0.06)})`,
              border: `1px solid ${hexToRgba(item.color, 0.3)}`,
              color: item.color,
              boxShadow: hovered ? `0 0 20px ${hexToRgba(item.color, 0.25)}` : 'none',
            }}
          >
            {item.icon}
          </div>
        </div>
        <h4 className="text-sm font-bold text-white mb-1">{item.title[lang as 'pt' | 'en']}</h4>
        <p className="text-xs text-foursys-text-muted leading-relaxed">{item.desc[lang as 'pt' | 'en']}</p>
      </div>
    </motion.div>
  )
}

// ─── Service Card ────────────────────────────────────────────────────────────

function ServiceCard({ item, index, lang, onShowDetail }: { item: ServiceItem; index: number; lang: string; onShowDetail?: (item: ServiceItem) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.5, type: 'spring', stiffness: 120 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          background: hovered
            ? `linear-gradient(160deg, ${hexToRgba(item.color, 0.15)} 0%, ${hexToRgba(item.color, 0.03)} 40%, rgba(10,12,20,0.95) 100%)`
            : `linear-gradient(160deg, ${hexToRgba(item.color, 0.05)} 0%, rgba(10,12,20,0.95) 100%)`,
        }}
        transition={{ duration: 0.5 }}
      />
      <div
        className="absolute inset-0 rounded-3xl transition-all duration-500"
        style={{ border: hovered ? `1.5px solid ${hexToRgba(item.color, 0.4)}` : '1.5px solid rgba(255,255,255,0.06)' }}
      />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
        animate={{ width: hovered ? '70%' : '0%', opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }}
      />

      <div className="relative z-10 p-6 md:p-7">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-shadow duration-400"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(item.color, 0.25)}, ${hexToRgba(item.color, 0.08)})`,
              border: `1px solid ${hexToRgba(item.color, 0.35)}`,
              color: item.color,
              boxShadow: hovered ? `0 0 30px ${hexToRgba(item.color, 0.3)}` : 'none',
            }}
          >
            {item.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-white leading-tight">{item.title[lang as 'pt' | 'en']}</h3>
            <span
              className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{
                background: hexToRgba(item.color, 0.1),
                border: `1px solid ${hexToRgba(item.color, 0.25)}`,
                color: item.color,
              }}
            >
              <TrendingUp size={10} />
              {item.marketBadge[lang as 'pt' | 'en']}
            </span>
          </div>
        </div>

        <p className="text-sm text-foursys-text-muted leading-relaxed mb-4">{item.desc[lang as 'pt' | 'en']}</p>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-white/[0.06] space-y-2">
                {item.bullets[lang as 'pt' | 'en'].map(b => (
                  <div key={b} className="flex items-center gap-2 text-xs text-white/80">
                    <CheckCircle2 size={12} style={{ color: item.color }} className="flex-shrink-0" />
                    {b}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2 text-xs font-bold" style={{ color: item.color }}>
            {expanded
              ? (lang === 'pt' ? 'Recolher' : 'Collapse')
              : (lang === 'pt' ? 'Ver detalhes' : 'View details')}
            <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight size={14} />
            </motion.div>
          </div>
          {item.detail && onShowDetail && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onShowDetail(item) }}
              className="flex items-center gap-1.5 text-xs font-bold transition-colors duration-200 hover:text-white"
              style={{ color: hexToRgba(item.color, 0.7) }}
            >
              {lang === 'pt' ? 'Explorar completo' : 'Explore full'}
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>

      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full pointer-events-none"
        animate={{ opacity: hovered ? 0.4 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(ellipse, ${hexToRgba(item.color, 0.2)} 0%, transparent 70%)`,
          filter: 'blur(12px)',
        }}
      />
    </motion.div>
  )
}

// ─── How Card ────────────────────────────────────────────────────────────────

function HowCard({ item, index, lang, onShowDetail }: { item: HowItem; index: number; lang: string; onShowDetail?: (item: HowItem) => void }) {
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const hasExtra = item.bullets || item.pillars

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.12, duration: 0.5, type: 'spring', stiffness: 120 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={hasExtra ? () => setExpanded(!expanded) : undefined}
      className={`group relative rounded-3xl overflow-hidden${hasExtra ? ' cursor-pointer' : ''}`}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          background: item.highlight
            ? hovered
              ? `linear-gradient(160deg, ${hexToRgba(ORANGE, 0.18)} 0%, ${hexToRgba(ORANGE, 0.06)} 40%, rgba(10,12,20,0.96) 100%)`
              : `linear-gradient(160deg, ${hexToRgba(ORANGE, 0.10)} 0%, ${hexToRgba(ORANGE, 0.02)} 40%, rgba(10,12,20,0.96) 100%)`
            : hovered
              ? `linear-gradient(160deg, ${hexToRgba(item.color, 0.12)} 0%, rgba(10,12,20,0.95) 100%)`
              : `linear-gradient(160deg, ${hexToRgba(item.color, 0.04)} 0%, rgba(10,12,20,0.95) 100%)`,
        }}
        transition={{ duration: 0.5 }}
      />
      <div
        className="absolute inset-0 rounded-3xl transition-all duration-500"
        style={{
          border: item.highlight
            ? `1.5px solid ${hexToRgba(ORANGE, hovered ? 0.5 : 0.25)}`
            : hovered ? `1.5px solid ${hexToRgba(item.color, 0.35)}` : '1.5px solid rgba(255,255,255,0.06)',
        }}
      />
      {item.highlight && (
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)` }} />
      )}

      <div className="relative z-10 p-6 md:p-7 flex flex-col h-full" style={{ minHeight: 220 }}>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-shadow duration-400"
            style={{
              background: `linear-gradient(135deg, ${hexToRgba(item.color, 0.25)}, ${hexToRgba(item.color, 0.08)})`,
              border: `1px solid ${hexToRgba(item.color, 0.35)}`,
              color: item.color,
              boxShadow: hovered ? `0 0 30px ${hexToRgba(item.color, 0.3)}` : 'none',
            }}
          >
            {item.icon}
          </div>
          {item.highlight && (
            <span
              className="text-[9px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full"
              style={{
                background: hexToRgba(ORANGE, 0.12),
                border: `1px solid ${hexToRgba(ORANGE, 0.3)}`,
                color: ORANGE,
              }}
            >
              {lang === 'pt' ? 'Plataforma Proprietária · SaaS' : 'Proprietary Platform · SaaS'}
            </span>
          )}
        </div>

        <h3 className="text-xl font-black text-white leading-tight mb-1">{item.title[lang as 'pt' | 'en']}</h3>
        {item.subtitle && (
          <p className="text-xs font-semibold mb-3" style={{ color: item.color }}>
            {item.subtitle[lang as 'pt' | 'en']}
          </p>
        )}
        <p className="text-sm text-foursys-text-muted leading-relaxed flex-1">{item.desc[lang as 'pt' | 'en']}</p>

        <AnimatePresence>
          {expanded && hasExtra && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden"
            >
              {item.bullets && (
                <div className="pt-4 mt-4 border-t border-white/[0.06]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: item.color }}>
                    {lang === 'pt' ? 'Capacidades-chave' : 'Key Capabilities'}
                  </p>
                  <div className="space-y-2">
                    {item.bullets[lang as 'pt' | 'en'].map(b => (
                      <div key={b} className="flex items-start gap-2 text-xs text-white/80">
                        <CheckCircle2 size={12} style={{ color: item.color }} className="flex-shrink-0 mt-0.5" />
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {item.pillars && (
                <div className="pt-4 mt-4 border-t border-white/[0.06]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: item.color }}>
                    {lang === 'pt' ? 'Pilares de Governança' : 'Governance Pillars'}
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {item.pillars.map(p => (
                      <div
                        key={p.title.pt}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl"
                        style={{ background: hexToRgba(item.color, 0.05), border: `1px solid ${hexToRgba(item.color, 0.1)}` }}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: hexToRgba(item.color, 0.12), color: item.color }}
                        >
                          {p.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white leading-tight">{p.title[lang as 'pt' | 'en']}</p>
                          <p className="text-[11px] text-foursys-text-muted leading-snug mt-0.5">{p.desc[lang as 'pt' | 'en']}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {(hasExtra || item.detail) && (
          <div className="flex items-center gap-4 mt-4">
            {hasExtra && (
              <div className="flex items-center gap-2 text-xs font-bold" style={{ color: item.color }}>
                {expanded
                  ? (lang === 'pt' ? 'Recolher' : 'Collapse')
                  : (lang === 'pt' ? 'Ver capacidades' : 'View capabilities')}
                <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight size={14} />
                </motion.div>
              </div>
            )}
            {item.detail && onShowDetail && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onShowDetail(item) }}
                className="flex items-center gap-1.5 text-xs font-bold transition-colors duration-200 hover:text-white"
                style={{ color: hexToRgba(item.color, 0.7) }}
              >
                {lang === 'pt' ? 'Explorar completo' : 'Explore full'}
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full pointer-events-none"
        animate={{ opacity: hovered ? 0.4 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(ellipse, ${hexToRgba(item.color, 0.2)} 0%, transparent 70%)`,
          filter: 'blur(12px)',
        }}
      />
    </motion.div>
  )
}

// ─── Service Detail Modal ───────────────────────────────────────────────────

function ServiceDetailModal({ item, onClose, lang }: { item: DetailableItem; onClose: () => void; lang: string }) {
  const trapRef = useFocusTrap(true)
  const pt = lang === 'pt'
  const L = lang as 'pt' | 'en'
  const c = item.color
  const d = item.detail

  function renderSection(section: DetailSection, idx: number) {
    switch (section.type) {
      case 'text':
        return (
          <div key={idx} className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: c }}>{section.title[L]}</h4>
            {section.body && <p className="text-sm text-foursys-text-muted leading-relaxed">{section.body[L]}</p>}
            {section.items && (
              <div className="space-y-2 mt-3">
                {section.items[L].map(it => (
                  <div key={it} className="flex items-start gap-2 text-xs text-white/80">
                    <CheckCircle2 size={12} style={{ color: c }} className="flex-shrink-0 mt-0.5" />
                    {it}
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'steps':
        return (
          <div key={idx} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: c }}>{section.title[L]}</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {section.steps!.map((s, i) => (
                <div key={i} className="text-center p-3 rounded-xl" style={{ background: hexToRgba(c, 0.06), border: `1px solid ${hexToRgba(c, 0.12)}` }}>
                  <div className="text-lg font-black mb-1" style={{ color: c }}>{s.num}</div>
                  <div className="text-[11px] font-bold text-white leading-tight">{s.title[L]}</div>
                  <div className="text-[10px] text-foursys-text-dim mt-0.5 leading-tight">{s.desc[L]}</div>
                </div>
              ))}
            </div>
            {section.note && <p className="text-[11px] text-foursys-text-dim italic">{section.note[L]}</p>}
          </div>
        )

      case 'belts':
        return (
          <div key={idx} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: c }}>{section.title[L]}</h4>
            <div className="flex flex-wrap gap-2">
              {section.belts!.map(b => (
                <div key={b.name} className="flex-1 min-w-[120px] p-3 rounded-xl text-center" style={{ background: hexToRgba(b.color, 0.08), border: `1px solid ${hexToRgba(b.color, 0.2)}` }}>
                  <div className="text-[10px] font-black uppercase tracking-wider mb-1" style={{ color: b.color }}>{b.name}</div>
                  <div className="text-[11px] font-bold text-white">{b.label[L]}</div>
                  <div className="text-[10px] text-foursys-text-dim mt-0.5">{b.desc[L]}</div>
                </div>
              ))}
            </div>
            {section.note && <p className="text-[11px] text-foursys-text-dim italic">{section.note[L]}</p>}
          </div>
        )

      case 'metrics':
        return (
          <div key={idx} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: c }}>{section.title[L]}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {section.metrics!.map(m => (
                <div key={m.label.pt} className="p-4 rounded-xl text-center" style={{ background: hexToRgba(c, 0.06), border: `1px solid ${hexToRgba(c, 0.12)}` }}>
                  <div className="text-xl md:text-2xl font-black" style={{ color: c }}>{m.value}</div>
                  <div className="text-[9px] text-foursys-text-dim uppercase tracking-wider font-bold mt-1">{m.label[L]}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'phases':
        return (
          <div key={idx} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: c }}>{section.title[L]}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {section.phases!.map(p => (
                <div key={p.name.pt} className="p-4 rounded-xl" style={{ background: hexToRgba(p.color, 0.05), border: `1px solid ${hexToRgba(p.color, 0.15)}` }}>
                  <div className="text-[10px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: p.color }}>{p.name[L]}</div>
                  <div className="space-y-2">
                    {p.items[L].map(it => (
                      <div key={it} className="flex items-start gap-2 text-[11px] text-white/80">
                        <ChevronRight size={10} style={{ color: p.color }} className="flex-shrink-0 mt-0.5" />
                        {it}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'dimensions':
        return (
          <div key={idx} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: c }}>{section.title[L]}</h4>
            {section.note && <p className="text-[11px] text-foursys-text-dim italic mb-2">{section.note[L]}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {section.dimensions!.map(dim => (
                <div key={dim.name.pt} className="p-4 rounded-xl" style={{ background: hexToRgba(c, 0.04), border: `1px solid ${hexToRgba(c, 0.12)}` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: hexToRgba(c, 0.12), color: c }}>{dim.icon}</div>
                    <div className="text-xs font-bold text-white">{dim.name[L]}</div>
                  </div>
                  <div className="space-y-1.5">
                    {dim.items[L].map(it => (
                      <div key={it} className="text-[11px] text-foursys-text-muted flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: c }} />
                        {it}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'cards':
        return (
          <div key={idx} className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: c }}>{section.title[L]}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {section.cards!.map(card => (
                <div key={card.title.pt} className="p-4 rounded-xl" style={{ background: hexToRgba(c, 0.04), border: `1px solid ${hexToRgba(c, 0.1)}` }}>
                  <div className="text-xs font-bold text-white mb-1.5">{card.title[L]}</div>
                  <div className="text-[11px] text-foursys-text-muted leading-relaxed">{card.desc[L]}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'highlight':
        return (
          <div key={idx} className="p-5 rounded-2xl" style={{ background: hexToRgba(c, 0.06), border: `1px solid ${hexToRgba(c, 0.15)}` }}>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] mb-2" style={{ color: c }}>{section.title[L]}</h4>
            {section.body && <p className="text-sm text-foursys-text-muted leading-relaxed">{section.body[L]}</p>}
          </div>
        )

      case 'list':
        return (
          <div key={idx} className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: c }}>{section.title[L]}</h4>
            <div className="space-y-2">
              {section.items![L].map((it, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl" style={{ background: hexToRgba(c, i % 2 === 0 ? 0.03 : 0.06) }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-black" style={{ background: hexToRgba(c, 0.12), color: c }}>
                    {i + 1}
                  </div>
                  <span className="text-xs text-white/80 leading-relaxed pt-0.5">{it}</span>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain py-8"
      role="dialog"
      aria-modal="true"
      aria-label={item.title[L]}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
      <motion.div
        initial={{ scale: 0.92, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
        onClick={e => e.stopPropagation()}
        ref={trapRef}
        className="relative z-10 w-full max-w-4xl mx-4 rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(c, 0.08)} 0%, rgba(10,14,22,0.98) 12%, rgba(10,14,22,0.99) 100%)`,
          border: `1px solid ${hexToRgba(c, 0.2)}`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${c}, transparent)` }} />
        <div className="absolute top-6 right-6 z-20">
          <button type="button" onClick={onClose} aria-label="Close" className="p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.12] transition-colors">
            <X size={18} className="text-white/70" />
          </button>
        </div>

        <div className="p-8 md:p-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${hexToRgba(c, 0.25)}, ${hexToRgba(c, 0.1)})`, border: `1px solid ${hexToRgba(c, 0.35)}`, color: c }}>
              {item.icon}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white">{item.title[L]}</h2>
              <p className="text-sm font-semibold mt-0.5" style={{ color: c }}>{d.tagline[L]}</p>
            </div>
          </div>

          <div className="h-px my-6" style={{ background: `linear-gradient(90deg, transparent, ${hexToRgba(c, 0.3)}, transparent)` }} />

          <div className="space-y-8">
            {d.sections.map((section, idx) => renderSection(section, idx))}
          </div>

          <div className="h-px mt-8 mb-4" style={{ background: `linear-gradient(90deg, transparent, ${hexToRgba(c, 0.2)}, transparent)` }} />
          <p className="text-[10px] text-foursys-text-dim text-center italic">
            {pt ? 'Studio de Inovação Foursys — 25 anos de mercado' : 'Foursys Innovation Studio — 25 years in the market'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── AI Framework Modal (fidelity to HTML, DS tokens only) ──────────────────

function AIFrameworkModal({ onClose, lang }: { onClose: () => void; lang: string }) {
  const trapRef = useFocusTrap(true)
  const pt = lang === 'pt'
  const c = '#FBBF24'
  const danger = '#F87171'
  const ok = '#34D399'

  const stats = [
    { value: '< 1 sem', label: pt ? 'Brief → Tela navegável' : 'Brief → Navigable screen' },
    { value: '4×', label: pt ? 'Aceleração Upstream' : 'Upstream acceleration' },
    { value: '≥ 70%', label: pt ? 'Cobertura de testes' : 'Test coverage' },
    { value: '< 2%', label: pt ? 'Regressões pós-deploy' : 'Post-deploy regressions' },
    { value: '100%', label: pt ? 'Docs sincronizadas' : 'Synced docs' },
  ]

  const timeline: { year: string; title: string; desc: string; color: string; highlight?: boolean }[] = [
    { year: '1970', title: 'Waterfall', desc: pt ? 'Previsível, mas lento' : 'Predictable, but slow', color: '#64748B' },
    { year: '2001', title: 'Scrum / Ágil', desc: pt ? 'Iterativo, com retrabalho' : 'Iterative, with rework', color: '#60A5FA' },
    { year: '2010', title: 'DevOps', desc: pt ? 'Deploy veloz · upstream lento' : 'Fast deploy · slow upstream', color: '#34D399' },
    { year: '2020', title: 'DevSecOps', desc: pt ? 'Segurança shift-left' : 'Shift-left security', color: '#F472B6' },
    { year: '2026', title: 'AI-SDLC · SDD', desc: pt ? 'Specs vivas + agentes + self-healing' : 'Living specs + agents + self-healing', color: c, highlight: true },
  ]

  const layers = [
    { n: 1, name: pt ? 'Specs Vivas' : 'Living Specs', color: '#60A5FA',
      items: pt ? ['Épicos e Features versionados', 'C4 Model L1-L4 · User Stories FE/BE', 'Gherkin · Security Assessment · Design System', 'Fonte única da verdade — sempre sincronizada com o código']
                : ['Versioned Epics and Features', 'C4 Model L1-L4 · FE/BE User Stories', 'Gherkin · Security Assessment · Design System', 'Single source of truth — always in sync with code'] },
    { n: 2, name: pt ? 'Agentes Especialistas' : 'Specialist Agents', color: c,
      items: pt ? ['30+ agentes orquestrados', 'UpStream: @the-visionary · @the-artista Bella', 'Habilitadores: @the-architect-C4L4 · @the-critico', 'DownStream: dev FE/BE por stack · @gherkinflow']
                : ['30+ orchestrated agents', 'UpStream: @the-visionary · @the-artista Bella', 'Enablers: @the-architect-C4L4 · @the-critico', 'DownStream: FE/BE dev per stack · @gherkinflow'] },
    { n: 3, name: pt ? 'Orquestração' : 'Orchestration', color: '#34D399',
      items: pt ? ['Novo Produto — 17 steps · 6 fases', 'Engenharia Reversa — 8 steps · 4 fases', 'Evolução de Produto — 14 steps · 4 fases', 'Gates de qualidade obrigatórios entre fases']
                : ['New Product — 17 steps · 6 phases', 'Reverse Engineering — 8 steps · 4 phases', 'Product Evolution — 14 steps · 4 phases', 'Mandatory quality gates between phases'] },
    { n: 4, name: pt ? 'Governança' : 'Governance', color: '#F472B6',
      items: pt ? ['Self-Healing por IA · rastreabilidade spec→código', 'EU AI Act · LGPD/ANPD · SOC2 · ISO 27001', 'Auditoria · controle de merge · regressão automática']
                : ['AI Self-Healing · spec→code traceability', 'EU AI Act · LGPD/ANPD · SOC2 · ISO 27001', 'Audit · merge control · automated regression'] },
    { n: 5, name: pt ? 'Camada Humana' : 'Human Layer', color: '#A78BFA',
      items: pt ? ['C-level · PO · Tech Lead · Stakeholders', 'Decisão · criatividade · relacionamento', 'O humano sobe de camada: deixa de caçar bug, passa a decidir direção']
                : ['C-level · PO · Tech Lead · Stakeholders', 'Decision · creativity · relationship', 'Humans move up: stop hunting bugs, start deciding direction'] },
  ]

  const asIs: { time: string; step: string }[] = pt ? [
    { time: '2-4 sem', step: 'Briefing e alinhamento' },
    { time: '3-6 sem', step: 'Wireframe no Figma' },
    { time: '2-4 sem', step: 'Protótipo Hi-Fi descartável' },
    { time: '—', step: 'Validação com retrabalho' },
    { time: '4-6 sem', step: 'Specs manuais' },
    { time: '4-8 sem', step: 'Arquitetura' },
    { time: '8-16 sem', step: 'Dev Frontend' },
    { time: '8-16 sem', step: 'Dev Backend' },
    { time: '4-8 sem', step: 'QA manual' },
    { time: '2-4 sem', step: 'Deploy + regressões' },
  ] : [
    { time: '2-4 wk', step: 'Briefing and alignment' },
    { time: '3-6 wk', step: 'Figma wireframe' },
    { time: '2-4 wk', step: 'Disposable Hi-Fi prototype' },
    { time: '—', step: 'Validation with rework' },
    { time: '4-6 wk', step: 'Manual specs' },
    { time: '4-8 wk', step: 'Architecture' },
    { time: '8-16 wk', step: 'Frontend Dev' },
    { time: '8-16 wk', step: 'Backend Dev' },
    { time: '4-8 wk', step: 'Manual QA' },
    { time: '2-4 wk', step: 'Deploy + regressions' },
  ]

  const toBe: { time: string; step: string; highlight?: boolean }[] = pt ? [
    { time: '1-3 dias', step: 'Briefing + Diagnóstico Express' },
    { time: '3-5 dias', step: 'Priorização + Arquitetura antecipadas' },
    { time: '< 1 sem', step: 'MVP NAVEGÁVEL com mock realista', highlight: true },
    { time: '—', step: 'Validação direta na tela real (score >9)' },
    { time: '1 sem', step: 'Specs BE + DB + Security' },
    { time: '2-3 sem', step: 'Dev FE/BE + testes + Peer Review' },
    { time: 'Dias', step: 'DevOps + App Integrada + Self-Healing' },
    { time: '♾️', step: 'Eng. Reversa pós-deploy → docs vivas' },
  ] : [
    { time: '1-3 days', step: 'Briefing + Express Diagnostic' },
    { time: '3-5 days', step: 'Prioritization + Upfront Architecture' },
    { time: '< 1 wk', step: 'NAVIGABLE MVP with realistic mock', highlight: true },
    { time: '—', step: 'Validation directly on real screen (score >9)' },
    { time: '1 wk', step: 'BE Specs + DB + Security' },
    { time: '2-3 wk', step: 'Dev FE/BE + tests + Peer Review' },
    { time: 'Days', step: 'DevOps + Integrated App + Self-Healing' },
    { time: '♾️', step: 'Post-deploy Reverse Eng → living docs' },
  ]

  const doors = [
    {
      letter: 'A',
      icon: <Rocket size={18} />,
      title: pt ? 'Greenfield · Novo Produto' : 'Greenfield · New Product',
      meta: pt ? '17 steps · 6 fases · 6-10 sem' : '17 steps · 6 phases · 6-10 wk',
      color: '#60A5FA',
      flow: pt ? ['Épicos & Features', 'Priorização WSJF', 'Arquitetura + DS', 'MVP navegável < 1 sem', 'Specs BE + Security', 'Dev FE/BE + Tests', 'DevOps + App integrada']
                : ['Epics & Features', 'WSJF Prioritization', 'Architecture + DS', 'Navigable MVP < 1 wk', 'BE Specs + Security', 'FE/BE Dev + Tests', 'DevOps + Integrated App'],
      highlightIdx: 3,
    },
    {
      letter: 'B',
      icon: <Compass size={18} />,
      title: pt ? 'Brownfield sem docs · Eng. Reversa' : 'Brownfield no docs · Reverse Eng',
      meta: pt ? '8 steps · 4 fases · 5-10 dias' : '8 steps · 4 phases · 5-10 days',
      color: '#34D399',
      flow: pt ? ['Épicos do código', 'Features reais', 'C4 L1-L4 + 12 HTMLs', 'DS inventário', 'Gherkin por feature', 'OWASP + LGPD', 'US FE/BE sincronizadas']
                : ['Code Epics', 'Real Features', 'C4 L1-L4 + 12 HTMLs', 'DS inventory', 'Gherkin per feature', 'OWASP + LGPD', 'Synced FE/BE US'],
      highlightIdx: 2,
    },
    {
      letter: 'C',
      icon: <Layers size={18} />,
      title: pt ? 'Brownfield com docs · Evolução' : 'Brownfield with docs · Evolution',
      meta: pt ? '14 steps · 4 fases · 8-15 dias' : '14 steps · 4 phases · 8-15 days',
      color: '#A78BFA',
      flow: pt ? ['Novos épicos (sem duplicar)', 'Features novas', 'Frontend mock + Usab >9', 'Gherkin + US BE', 'Evolução BD + Security', 'Dev + Tests + Review >8', 'DevOps + App integrada']
                : ['New epics (no duplicates)', 'New features', 'Frontend mock + Usab >9', 'Gherkin + BE US', 'DB Evolution + Security', 'Dev + Tests + Review >8', 'DevOps + Integrated App'],
      highlightIdx: 2,
    },
  ]

  const cases = [
    { title: pt ? 'Check-in de Audiência' : 'Audience Check-in', sub: pt ? 'Grande Banco · Financeiro' : 'Large Bank · Financial',
      desc: pt ? 'Jornada de check-in digital para audiências, integrada ao ecossistema do banco, com validação presencial e remota.'
                : 'Digital check-in journey for audiences, integrated with the bank ecosystem, with in-person and remote validation.',
      stack: 'React + DS corporativo + Mobile-first', g1: '#60A5FA', g2: '#818CF8',
      url: 'https://nice-ground-0e6881a1e.6.azurestaticapps.net/' },
    { title: pt ? 'Gestão de Pipeline de Dados' : 'Data Pipeline Management', sub: pt ? 'Cliente EUA · Dados' : 'US Client · Data',
      desc: pt ? 'Dashboard para orquestrar, monitorar e governar pipelines ETL/ELT de ponta a ponta, com visibilidade de latência, custos e SLA.'
                : 'Dashboard to orchestrate, monitor and govern ETL/ELT pipelines end-to-end, with latency, cost and SLA visibility.',
      stack: 'React + Observability + Multi-source', g1: '#34D399', g2: '#2DD4BF',
      url: 'https://gentle-forest-0142c430f.6.azurestaticapps.net/' },
    { title: pt ? 'Gestão de Eventos Médicos' : 'Medical Events Management', sub: pt ? 'Saúde · Eventos' : 'Healthcare · Events',
      desc: pt ? 'Plataforma para planejar, promover e gerenciar eventos médicos e científicos: agenda, inscrições, credenciamento e relatórios.'
                : 'Platform to plan, promote and manage medical and scientific events: agenda, registrations, accreditation and reports.',
      stack: 'React + Multi-perfil + Relatórios', g1: '#F472B6', g2: '#EC4899',
      url: 'https://lemon-stone-0a8ef171e.1.azurestaticapps.net/' },
    { title: pt ? 'Guarda Compartilhada' : 'Shared Custody', sub: pt ? 'Governo · Setor Público' : 'Government · Public Sector',
      desc: pt ? 'Plataforma para acompanhamento e gestão de processos de guarda compartilhada, conectando órgãos públicos e judiciário.'
                : 'Platform for tracking and managing shared custody processes, connecting public agencies and the judiciary.',
      stack: 'React + LGPD + Multi-órgão + Acessibilidade', g1: c, g2: '#F59E0B',
      url: 'https://witty-forest-0437c781e.1.azurestaticapps.net/' },
  ]

  const engage = [
    { icon: <Gift size={20} />, title: pt ? 'Diagnóstico Express' : 'Express Diagnostic', price: pt ? 'Gratuito · 2 semanas' : 'Free · 2 weeks',
      desc: pt ? 'AS-IS/TO-BE, 3 quick-wins e projeção de ROI customizada' : 'AS-IS/TO-BE, 3 quick-wins and customized ROI projection',
      color: ok, featured: true },
    { icon: <Zap size={20} />, title: 'Pilot', price: pt ? '4-6 semanas · preço fixo' : '4-6 weeks · fixed price',
      desc: pt ? '1 feature real entregue end-to-end com métricas comparáveis ao baseline' : '1 real feature delivered end-to-end with metrics comparable to baseline',
      color: '#60A5FA' },
    { icon: <Rocket size={20} />, title: 'Squad-as-a-Service', price: pt ? 'Trimestral renovável' : 'Quarterly renewable',
      desc: pt ? 'Tech Lead + agentes + devs sênior Foursys com KPIs contratados' : 'Tech Lead + agents + Foursys senior devs with contracted KPIs',
      color: c },
    { icon: <Building2 size={20} />, title: 'Framework License', price: pt ? 'Anual + enablement' : 'Annual + enablement',
      desc: pt ? 'Seu time opera o framework com certificação; Foursys evolui' : 'Your team operates the framework with certification; Foursys evolves it',
      color: '#F472B6' },
    { icon: <Gem size={20} />, title: 'Outcome-based', price: pt ? 'Parceria estratégica' : 'Strategic partnership',
      desc: pt ? 'Compartilhamento de ganho sobre redução de TTM ou custo' : 'Gain-sharing on TTM or cost reduction',
      color: '#A78BFA' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain py-8"
      role="dialog"
      aria-modal="true"
      aria-label="AI Framework"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />
      <motion.div
        initial={{ scale: 0.92, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
        onClick={e => e.stopPropagation()}
        ref={trapRef}
        className="relative z-10 w-full max-w-5xl mx-4 rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(c, 0.10)} 0%, rgba(10,14,22,0.98) 14%, rgba(10,14,22,0.99) 100%)`,
          border: `1px solid ${hexToRgba(c, 0.22)}`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${c}, transparent)` }} />
        <div className="absolute top-6 right-6 z-20">
          <button type="button" onClick={onClose} aria-label="Close"
            className="p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.12] transition-colors">
            <X size={18} className="text-white/70" />
          </button>
        </div>

        <div className="p-6 md:p-10 space-y-10">

          {/* HERO */}
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(ellipse, ${hexToRgba(c, 0.12)} 0%, transparent 70%)`, filter: 'blur(40px)' }} />
            <div className="relative flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${hexToRgba(c, 0.28)}, ${hexToRgba(c, 0.1)})`, border: `1px solid ${hexToRgba(c, 0.38)}`, color: c }}>
                <Blocks size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: c }}>
                  {pt ? 'AI-SDLC Framework™ · 2026' : 'AI-SDLC Framework™ · 2026'}
                </p>
                <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">AI Framework</h2>
              </div>
            </div>
            <p className="text-sm md:text-base text-foursys-text-muted leading-relaxed max-w-3xl">
              {pt
                ? 'O novo ciclo de vida de software começa na tela real em menos de uma semana. Combinamos specs vivas (SDD), agentes de IA orquestrados e delivery humano em um framework auditável.'
                : 'The new software lifecycle starts on a real screen in less than a week. We combine living specs (SDD), orchestrated AI agents and human delivery in an auditable framework.'}
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 mt-6">
              {stats.map(s => (
                <div key={s.label} className="p-3 rounded-xl text-center"
                  style={{ background: hexToRgba(c, 0.06), border: `1px solid ${hexToRgba(c, 0.14)}` }}>
                  <div className="text-xl md:text-2xl font-black" style={{ color: c }}>{s.value}</div>
                  <div className="text-[9px] text-foursys-text-dim uppercase tracking-wider font-bold mt-1 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${hexToRgba(c, 0.3)}, transparent)` }} />

          {/* TIMELINE */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} style={{ color: c }} />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">
                {pt ? 'Por que o SDLC tradicional morreu em 2025' : 'Why traditional SDLC died in 2025'}
              </h3>
            </div>
            <p className="text-xs text-foursys-text-muted mb-5 leading-relaxed">
              {pt
                ? 'Escassez de sênior, EU AI Act, dívida técnica explosiva e commoditização de "IA que escreve código" mudaram o jogo. O valor migrou do modelo para o framework.'
                : 'Senior talent scarcity, EU AI Act, exploding technical debt and commoditization of "AI that writes code" changed the game. Value migrated from the model to the framework.'}
            </p>

            <div className="relative">
              <div className="absolute left-0 right-0 top-[22px] h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.08), rgba(255,255,255,0.16), rgba(255,255,255,0.08))' }} />
              <div className="grid grid-cols-5 gap-2 relative">
                {timeline.map(era => (
                  <div key={era.year} className="flex flex-col items-center text-center">
                    <div className="relative w-11 h-11 rounded-full flex items-center justify-center mb-2.5"
                      style={{
                        background: era.highlight ? `linear-gradient(135deg, ${era.color}, ${hexToRgba(era.color, 0.5)})` : hexToRgba(era.color, 0.12),
                        border: `2px solid ${era.highlight ? era.color : hexToRgba(era.color, 0.35)}`,
                        boxShadow: era.highlight ? `0 0 24px ${hexToRgba(era.color, 0.55)}` : 'none',
                      }}>
                      <span className="text-[10px] font-black" style={{ color: era.highlight ? '#0B0F17' : era.color }}>
                        {era.highlight ? '★' : '•'}
                      </span>
                    </div>
                    <div className="text-[11px] font-black" style={{ color: era.color }}>{era.year}</div>
                    <div className="text-[11px] font-bold text-white mt-0.5">{era.title}</div>
                    <div className="text-[10px] text-foursys-text-dim leading-snug mt-0.5 px-1">{era.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${hexToRgba(c, 0.2)}, transparent)` }} />

          {/* 5 LAYERS STACK */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Layers size={16} style={{ color: c }} />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">
                {pt ? 'AI-SDLC Framework™ em 5 Camadas' : 'AI-SDLC Framework™ in 5 Layers'}
              </h3>
            </div>
            <p className="text-xs text-foursys-text-muted mb-5 leading-relaxed">
              {pt ? 'Cada camada se apoia na seguinte — specs alimentam agentes, agentes são orquestrados, orquestração é governada e o humano decide direção no topo.'
                  : 'Each layer builds on the next — specs feed agents, agents get orchestrated, orchestration is governed and humans decide direction at the top.'}
            </p>

            <div className="space-y-2.5">
              {layers.map((layer, i) => (
                <div key={layer.n} className="relative">
                  <div className="rounded-2xl p-4 md:p-5 relative overflow-hidden"
                    style={{ background: hexToRgba(layer.color, 0.05), border: `1px solid ${hexToRgba(layer.color, 0.22)}` }}>
                    <div className="absolute top-0 left-0 bottom-0 w-1" style={{ background: layer.color }} />
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-lg"
                        style={{ background: `linear-gradient(135deg, ${hexToRgba(layer.color, 0.3)}, ${hexToRgba(layer.color, 0.1)})`, border: `1px solid ${hexToRgba(layer.color, 0.4)}`, color: layer.color }}>
                        {layer.n}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-black text-white mb-2">{layer.name}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                          {layer.items.map(it => (
                            <div key={it} className="flex items-start gap-2 text-[11px] text-white/80">
                              <ChevronRight size={10} style={{ color: layer.color }} className="flex-shrink-0 mt-0.5" />
                              <span className="leading-snug">{it}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {i < layers.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ChevronRight size={14} className="text-white/30 rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${hexToRgba(c, 0.2)}, transparent)` }} />

          {/* AS-IS × TO-BE */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw size={16} style={{ color: c }} />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">
                {pt ? 'AS-IS × TO-BE — O Salto Concreto' : 'AS-IS × TO-BE — The Concrete Leap'}
              </h3>
            </div>
            <p className="text-xs text-foursys-text-muted mb-5 leading-relaxed">
              {pt ? 'De 6-12 meses de SDLC tradicional para 6-10 semanas com governança completa e docs que nunca envelhecem.'
                  : 'From 6-12 months of traditional SDLC to 6-10 weeks with full governance and docs that never age.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* AS-IS */}
              <div className="rounded-2xl p-5 relative overflow-hidden"
                style={{ background: hexToRgba(danger, 0.04), border: `1px solid ${hexToRgba(danger, 0.18)}` }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black"
                    style={{ background: hexToRgba(danger, 0.15), color: danger }}>✕</div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider" style={{ color: danger }}>AS-IS</div>
                    <div className="text-sm font-black text-white">{pt ? 'SDLC Tradicional' : 'Traditional SDLC'}</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {asIs.map((row, i) => (
                    <div key={i} className="flex items-center gap-3 py-1 border-b border-white/[0.04] last:border-0">
                      <span className="text-[10px] font-bold w-16 text-right flex-shrink-0" style={{ color: hexToRgba(danger, 0.85) }}>{row.time}</span>
                      <span className="text-[11px] text-white/75 leading-snug">{row.step}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-2.5 rounded-lg flex items-center gap-2"
                  style={{ background: hexToRgba(danger, 0.08), border: `1px solid ${hexToRgba(danger, 0.2)}` }}>
                  <AlertTriangle size={12} style={{ color: danger }} />
                  <span className="text-[11px] font-bold" style={{ color: danger }}>
                    {pt ? 'Total: 6 a 12 meses · docs defasadas em semanas' : 'Total: 6 to 12 months · outdated docs in weeks'}
                  </span>
                </div>
              </div>

              {/* TO-BE */}
              <div className="rounded-2xl p-5 relative overflow-hidden"
                style={{ background: `linear-gradient(160deg, ${hexToRgba(ok, 0.08)}, ${hexToRgba(c, 0.04)})`, border: `1px solid ${hexToRgba(ok, 0.25)}` }}>
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${ok}, transparent)` }} />
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black"
                    style={{ background: hexToRgba(ok, 0.18), color: ok }}>✓</div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider" style={{ color: ok }}>TO-BE</div>
                    <div className="text-sm font-black text-white">AI-SDLC Foursys</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {toBe.map((row, i) => (
                    <div key={i} className={`flex items-center gap-3 py-1 border-b border-white/[0.04] last:border-0 ${row.highlight ? 'px-2 rounded-lg' : ''}`}
                      style={row.highlight ? { background: hexToRgba(c, 0.1), border: `1px solid ${hexToRgba(c, 0.25)}` } : undefined}>
                      <span className={`text-[10px] font-bold w-16 text-right flex-shrink-0`} style={{ color: row.highlight ? c : hexToRgba(ok, 0.9) }}>{row.time}</span>
                      <span className={`text-[11px] leading-snug ${row.highlight ? 'font-black text-white' : 'text-white/80'}`}>
                        {row.highlight && <Target size={10} className="inline mr-1" style={{ color: c }} />}
                        {row.step}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-2.5 rounded-lg flex items-center gap-2"
                  style={{ background: hexToRgba(ok, 0.1), border: `1px solid ${hexToRgba(ok, 0.28)}` }}>
                  <BadgeCheck size={12} style={{ color: ok }} />
                  <span className="text-[11px] font-bold" style={{ color: ok }}>
                    {pt ? 'Total: 6 a 10 semanas · governança completa · docs vivas' : 'Total: 6 to 10 weeks · full governance · living docs'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${hexToRgba(c, 0.2)}, transparent)` }} />

          {/* 3 DOORS */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <GitBranch size={16} style={{ color: c }} />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">
                {pt ? 'Três Portas de Entrada' : 'Three Entry Paths'}
              </h3>
            </div>
            <p className="text-xs text-foursys-text-muted mb-5 leading-relaxed">
              {pt ? 'Começando do zero, entendendo um legado ou evoluindo um produto existente — todos plugáveis na sua stack.'
                  : 'Starting from zero, understanding a legacy or evolving an existing product — all pluggable into your stack.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {doors.map(door => (
                <div key={door.letter} className="rounded-2xl p-5 flex flex-col"
                  style={{ background: `linear-gradient(160deg, ${hexToRgba(door.color, 0.08)}, rgba(10,14,22,0.6))`, border: `1px solid ${hexToRgba(door.color, 0.25)}` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg"
                      style={{ background: `linear-gradient(135deg, ${hexToRgba(door.color, 0.3)}, ${hexToRgba(door.color, 0.1)})`, border: `1px solid ${hexToRgba(door.color, 0.4)}`, color: door.color }}>
                      {door.letter}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5" style={{ color: door.color }}>
                        {door.icon}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{pt ? 'Porta' : 'Path'} {door.letter}</span>
                      </div>
                      <div className="text-xs font-black text-white leading-tight">{door.title}</div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 mb-4 px-2.5 py-1 rounded-full text-[10px] font-bold self-start"
                    style={{ background: hexToRgba(door.color, 0.1), border: `1px solid ${hexToRgba(door.color, 0.22)}`, color: door.color }}>
                    <Timer size={10} />
                    {door.meta}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    {door.flow.map((f, i) => (
                      <div key={i} className={`flex items-center gap-2 py-1.5 px-2.5 rounded-lg ${i === door.highlightIdx ? '' : ''}`}
                        style={i === door.highlightIdx
                          ? { background: hexToRgba(c, 0.12), border: `1px solid ${hexToRgba(c, 0.28)}` }
                          : { background: hexToRgba(door.color, 0.04) }}>
                        <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black"
                          style={i === door.highlightIdx
                            ? { background: c, color: '#0B0F17' }
                            : { background: hexToRgba(door.color, 0.2), color: door.color }}>
                          {i + 1}
                        </span>
                        <span className={`text-[11px] leading-snug ${i === door.highlightIdx ? 'font-bold text-white' : 'text-white/75'}`}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${hexToRgba(c, 0.2)}, transparent)` }} />

          {/* CASES */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} style={{ color: c }} />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">
                {pt ? 'Cases Reais em < 1 Semana' : 'Real Cases in < 1 Week'}
              </h3>
            </div>
            <p className="text-xs text-foursys-text-muted mb-5 leading-relaxed">
              {pt ? 'Produtos reais colocados em tela navegável em menos de uma semana — prova concreta do framework em execução.'
                  : 'Real products put on navigable screens in less than a week — concrete proof of the framework in action.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cases.map(cs => (
                <div key={cs.title} className="rounded-2xl overflow-hidden flex flex-col"
                  style={{ background: 'rgba(10,14,22,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="relative h-20 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${hexToRgba(cs.g1, 0.4)}, ${hexToRgba(cs.g2, 0.25)})` }}>
                    <div className="absolute inset-0"
                      style={{ background: `radial-gradient(circle at 30% 50%, ${hexToRgba(cs.g1, 0.35)} 0%, transparent 60%)` }} />
                    <div className="absolute inset-0 flex items-center justify-between px-5">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: cs.g1 }}>{cs.sub}</div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: hexToRgba(cs.g1, 0.2), border: `1px solid ${hexToRgba(cs.g1, 0.35)}`, color: cs.g1 }}>
                        <Target size={18} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-sm font-black text-white leading-tight mb-2">{cs.title}</div>
                    <p className="text-[11px] text-foursys-text-muted leading-relaxed mb-3 flex-1">{cs.desc}</p>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ background: hexToRgba(cs.g1, 0.08), border: `1px solid ${hexToRgba(cs.g1, 0.2)}`, color: cs.g1 }}>
                        <Blocks size={10} />
                        {cs.stack}
                      </div>
                      <a
                        href={cs.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${cs.g1}, ${cs.g2})`,
                          color: '#0B0F17',
                          boxShadow: `0 0 16px ${hexToRgba(cs.g1, 0.45)}`,
                        }}
                      >
                        {pt ? 'Ver ao vivo' : 'View live'}
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${hexToRgba(c, 0.2)}, transparent)` }} />

          {/* ENGAGEMENT MODELS */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} style={{ color: c }} />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.15em]">
                {pt ? '5 Modelos de Engajamento' : '5 Engagement Models'}
              </h3>
            </div>
            <p className="text-xs text-foursys-text-muted mb-5 leading-relaxed">
              {pt ? 'Do diagnóstico gratuito à parceria estratégica baseada em resultado — escolha o formato que cabe no seu momento.'
                  : 'From free diagnostic to outcome-based strategic partnership — choose the format that fits your moment.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {engage.map(e => (
                <div key={e.title} className="rounded-2xl p-4 flex flex-col relative overflow-hidden"
                  style={{
                    background: e.featured
                      ? `linear-gradient(160deg, ${hexToRgba(e.color, 0.14)}, rgba(10,14,22,0.7))`
                      : `linear-gradient(160deg, ${hexToRgba(e.color, 0.06)}, rgba(10,14,22,0.7))`,
                    border: `1px solid ${hexToRgba(e.color, e.featured ? 0.35 : 0.18)}`,
                  }}>
                  {e.featured && (
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${e.color}, transparent)` }} />
                  )}
                  {e.featured && (
                    <div className="absolute top-2 right-2 text-[8px] font-black uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-full"
                      style={{ background: hexToRgba(e.color, 0.18), border: `1px solid ${hexToRgba(e.color, 0.35)}`, color: e.color }}>
                      {pt ? 'Grátis' : 'Free'}
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `linear-gradient(135deg, ${hexToRgba(e.color, 0.25)}, ${hexToRgba(e.color, 0.08)})`, border: `1px solid ${hexToRgba(e.color, 0.3)}`, color: e.color }}>
                    {e.icon}
                  </div>
                  <div className="text-sm font-black text-white leading-tight mb-1">{e.title}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: e.color }}>{e.price}</div>
                  <p className="text-[11px] text-foursys-text-muted leading-relaxed">{e.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-3xl p-6 md:p-8 relative overflow-hidden"
            style={{ background: `linear-gradient(160deg, ${hexToRgba(c, 0.1)} 0%, ${hexToRgba(ORANGE, 0.05)} 100%)`, border: `1px solid ${hexToRgba(c, 0.3)}` }}>
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${c}, ${ORANGE}, transparent)` }} />
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${c}, ${hexToRgba(c, 0.5)})`, boxShadow: `0 0 24px ${hexToRgba(c, 0.5)}`, color: '#0B0F17' }}>
                <Target size={22} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: c }}>
                  {pt ? 'Próximo Passo' : 'Next Step'}
                </div>
                <h3 className="text-lg md:text-xl font-black text-white leading-tight mb-2">
                  {pt ? 'Vamos colocar seu próximo produto na tela real em menos de uma semana?'
                      : 'Shall we put your next product on a real screen in less than a week?'}
                </h3>
                <p className="text-xs md:text-sm text-foursys-text-muted leading-relaxed">
                  {pt ? 'Comece pelo Diagnóstico Express gratuito — sem amarra, sem obrigação. Se fizer sentido, avançamos para o Pilot. Se não, você leva o relatório com insights acionáveis.'
                      : 'Start with the free Express Diagnostic — no strings, no obligation. If it makes sense, we move to Pilot. If not, you leave with a report of actionable insights.'}
                </p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-foursys-text-dim text-center italic">
            {pt ? 'Studio de Inovação Foursys — AI-SDLC Framework™ · 25 anos de mercado' : 'Foursys Innovation Studio — AI-SDLC Framework™ · 25 years in the market'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Market Highlight Modal ──────────────────────────────────────────────────

function MarketModal({ onClose, lang }: { onClose: () => void; lang: string }) {
  const trapRef = useFocusTrap(true)
  const pt = lang === 'pt'

  const stats = [
    { value: '$89.6B', label: pt ? 'Mercado IA Agêntica 2026' : 'Agentic AI Market 2026' },
    { value: '42%', label: pt ? 'Fortune 500 com Agentes' : 'Fortune 500 with Agents' },
    { value: '540%', label: pt ? 'ROI Médio 18 meses' : 'Average ROI 18 months' },
    { value: '72%', label: pt ? 'Empresas em Produção/Piloto' : 'Enterprises in Production/Pilot' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-label={pt ? 'Dados de Mercado IA' : 'AI Market Data'}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
      <motion.div
        initial={{ scale: 0.92, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
        onClick={e => e.stopPropagation()}
        ref={trapRef}
        className="relative z-10 w-full max-w-3xl mx-4 my-8 rounded-3xl overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${hexToRgba(ORANGE, 0.08)} 0%, rgba(10,14,22,0.98) 15%, rgba(10,14,22,0.99) 100%)`,
          border: `1px solid ${hexToRgba(ORANGE, 0.2)}`,
        }}
      >
        <div className="absolute top-6 right-6 z-20">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.12] transition-colors"
          >
            <X size={18} className="text-white/70" />
          </button>
        </div>

        <div className="p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${hexToRgba(ORANGE, 0.25)}, ${hexToRgba(ORANGE, 0.1)})`,
                border: `1px solid ${hexToRgba(ORANGE, 0.35)}`,
                color: ORANGE,
              }}
            >
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: ORANGE }}>
                {pt ? 'Dados de Mercado' : 'Market Data'}
              </p>
              <h2 className="text-2xl font-black text-white">{pt ? 'IA Enterprise em 2026' : 'Enterprise AI in 2026'}</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {stats.map(s => (
              <div
                key={s.label}
                className="p-4 rounded-xl text-center"
                style={{ background: hexToRgba(ORANGE, 0.06), border: `1px solid ${hexToRgba(ORANGE, 0.12)}` }}
              >
                <div className="text-xl md:text-2xl font-black" style={{ color: ORANGE }}>{s.value}</div>
                <div className="text-[9px] text-foursys-text-dim uppercase tracking-wider font-bold mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: ORANGE }}>
                {pt ? 'Adoção por Indústria' : 'Industry Adoption'}
              </h4>
              <p className="text-sm text-foursys-text-muted leading-relaxed">
                {pt
                  ? 'Serviços Financeiros lideram com 58%, seguido por Tecnologia (52%), Varejo (38%), Saúde (31%) e Manufatura (27% — crescimento mais rápido: 340% ano a ano).'
                  : 'Financial Services leads at 58%, followed by Technology (52%), Retail (38%), Healthcare (31%) and Manufacturing (27% — fastest growth: 340% YoY).'}
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: ORANGE }}>
                {pt ? 'Governança: O Diferencial Competitivo' : 'Governance: The Competitive Edge'}
              </h4>
              <p className="text-sm text-foursys-text-muted leading-relaxed">
                {pt
                  ? 'Governança de IA agora supera cibersegurança como prioridade de conselho. Apenas 1 em 5 empresas tem modelo maduro — uma oportunidade estratégica para quem se posicionar primeiro.'
                  : 'AI Governance now ranks above cybersecurity as a board priority. Only 1 in 5 companies has a mature model — a strategic opportunity for first movers.'}
              </p>
            </div>
          </div>

          <p className="mt-6 text-[10px] text-foursys-text-dim text-center italic">
            {pt ? 'Fontes: Deloitte State of AI 2026, Stanford Enterprise AI Playbook, Axis Intelligence, GII Research' : 'Sources: Deloitte State of AI 2026, Stanford Enterprise AI Playbook, Axis Intelligence, GII Research'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Section ────────────────────────────────────────────────────────────

export function SectionAIFoursys() {
  const { t, lang } = useLanguage()
  const [showMarket, setShowMarket] = useState(false)
  const [detailService, setDetailService] = useState<ServiceItem | null>(null)
  const [detailHow, setDetailHow] = useState<HowItem | null>(null)
  const pt = lang === 'pt'

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">

        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center mb-14"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(255,83,21,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foursys-primary/10 border border-foursys-primary/25 mb-5"
          >
            <BrainCircuit size={14} className="text-foursys-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-foursys-primary">
              {pt ? 'Inteligência Artificial' : 'Artificial Intelligence'}
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            {t('nav.sections.aifoursys')}
          </h2>

          <p className="text-sm md:text-base text-foursys-text-muted max-w-2xl mx-auto leading-relaxed">
            {pt
              ? 'Da estratégia à execução: squads de IA, agentes autônomos, governança e framework — tudo integrado para transformar sua operação.'
              : 'From strategy to execution: AI squads, autonomous agents, governance and framework — fully integrated to transform your operations.'}
          </p>

          <div className="mt-6 flex justify-center">
            <div className="h-px w-48 bg-gradient-to-r from-transparent via-foursys-primary/40 to-transparent" />
          </div>
        </motion.div>

        {/* ── Bloco 1: Resultados ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-6">
            <Sparkles size={18} className="text-foursys-primary" />
            <h3 className="text-xl md:text-2xl font-black text-white">{pt ? 'Resultados Comprovados' : 'Proven Results'}</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {RESULTS.map((item, i) => (
              <ResultCard key={item.title.pt} item={item} index={i} lang={lang} />
            ))}
          </div>
        </motion.div>

        {/* ── Bloco 2: Serviços ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-6">
            <Blocks size={18} className="text-foursys-primary" />
            <h3 className="text-xl md:text-2xl font-black text-white">{pt ? 'Nossos Serviços' : 'Our Services'}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SERVICES.map((item, i) => (
              <ServiceCard key={item.title.pt} item={item} index={i} lang={lang} onShowDetail={setDetailService} />
            ))}
          </div>
        </motion.div>

        {/* ── Bloco 3: Como ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <FlaskConical size={18} className="text-foursys-primary" />
            <h3 className="text-xl md:text-2xl font-black text-white">{pt ? 'Como Fazemos' : 'How We Deliver'}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_ITEMS.map((item, i) => (
              <HowCard key={item.title.pt} item={item} index={i} lang={lang} onShowDetail={setDetailHow} />
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative text-center pt-8 border-t border-white/[0.06]"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-foursys-primary/40 to-transparent" />
          <p className="text-sm text-foursys-text-muted leading-relaxed max-w-xl mx-auto mb-4">
            {pt ? (
              <>O mercado global de IA Agêntica atinge <span className="text-foursys-primary font-black">$89.6 bilhões em 2026</span>.
              A Foursys já está posicionada para levar essa transformação à sua empresa com{' '}
              <span className="text-white font-bold">expertise, metodologia e plataforma própria</span>.</>
            ) : (
              <>The global Agentic AI market reaches <span className="text-foursys-primary font-black">$89.6 billion in 2026</span>.
              Foursys is already positioned to bring this transformation to your company with{' '}
              <span className="text-white font-bold">expertise, methodology and proprietary platform</span>.</>
            )}
          </p>
          <button
            type="button"
            onClick={() => setShowMarket(true)}
            className="inline-flex items-center gap-2 text-xs font-bold text-foursys-primary hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <TrendingUp size={14} />
            {pt ? 'Ver dados de mercado' : 'View market data'}
            <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showMarket && <MarketModal onClose={() => setShowMarket(false)} lang={lang} />}
        {detailService && detailService.title.pt === 'AI Framework' && (
          <AIFrameworkModal onClose={() => setDetailService(null)} lang={lang} />
        )}
        {detailService && detailService.title.pt !== 'AI Framework' && (
          <ServiceDetailModal item={detailService as DetailableItem} onClose={() => setDetailService(null)} lang={lang} />
        )}
        {detailHow && detailHow.detail && <ServiceDetailModal item={{ icon: detailHow.icon, title: detailHow.title, color: detailHow.color, detail: detailHow.detail }} onClose={() => setDetailHow(null)} lang={lang} />}
      </AnimatePresence>
    </SectionWrapper>
  )
}
