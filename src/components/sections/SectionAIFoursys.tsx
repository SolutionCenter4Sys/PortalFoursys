import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BrainCircuit, Users, Rocket, DollarSign, Lightbulb,
  GraduationCap, BookOpen, Shield, CheckCircle2,
  Bot, Scale, Blocks, FlaskConical, Building2, Layers,
  ArrowRight, ChevronRight, TrendingUp, X, Sparkles,
  Waypoints, Compass,
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

interface ServiceItem {
  icon: React.ReactNode
  title: { pt: string; en: string }
  desc: { pt: string; en: string }
  marketBadge: { pt: string; en: string }
  bullets: { pt: string[]; en: string[] }
  color: string
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
  },
  {
    icon: <Waypoints size={22} />,
    title: { pt: 'Fusion Teams', en: 'Fusion Teams' },
    desc: {
      pt: 'Célula multidisciplinar que se anexa à sua área, mapeia jornadas, entrega automações com IA e low/no-code, e capacita seu time até a autonomia — entregando legado, não dependência.',
      en: 'Multidisciplinary cell that attaches to your area, maps journeys, delivers automations with AI and low/no-code, and trains your team to autonomy — leaving legacy, not dependency.',
    },
    marketBadge: {
      pt: '+1.000h economizadas em processos automatizados',
      en: '+1,000h saved in automated processes',
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

function ServiceCard({ item, index, lang }: { item: ServiceItem; index: number; lang: string }) {
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

        <div className="flex items-center gap-2 mt-3 text-xs font-bold" style={{ color: item.color }}>
          {expanded
            ? (lang === 'pt' ? 'Recolher' : 'Collapse')
            : (lang === 'pt' ? 'Ver detalhes' : 'View details')}
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={14} />
          </motion.div>
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

function HowCard({ item, index, lang }: { item: HowItem; index: number; lang: string }) {
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

        {hasExtra && (
          <div className="flex items-center gap-2 mt-4 text-xs font-bold" style={{ color: item.color }}>
            {expanded
              ? (lang === 'pt' ? 'Recolher' : 'Collapse')
              : (lang === 'pt' ? 'Ver capacidades' : 'View capabilities')}
            <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronRight size={14} />
            </motion.div>
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
              <ServiceCard key={item.title.pt} item={item} index={i} lang={lang} />
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
              <HowCard key={item.title.pt} item={item} index={i} lang={lang} />
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
      </AnimatePresence>
    </SectionWrapper>
  )
}
