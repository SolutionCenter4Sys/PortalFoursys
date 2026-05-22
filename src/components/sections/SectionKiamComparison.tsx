import { motion } from 'framer-motion'
import {
  BrainCircuit, Shield, DollarSign, Timer, Lock, Layers,
  Bot, Blocks, CheckCircle2, XCircle, AlertTriangle,
  ArrowRight, ArrowLeft, Scale,
} from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { useLanguage } from '../../i18n'
import { useApp } from '../../context/AppContext'

const ORANGE = '#FF5315'
const MINT = '#89BAB1'

function hexToRgba(hex: string, a: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

type Verdict = 'win' | 'tie' | 'loss'

interface CriterionRow {
  icon: React.ReactNode
  criterion: { pt: string; en: string }
  kiam: { verdict: Verdict; note: { pt: string; en: string } }
  hyper: { verdict: Verdict; note: { pt: string; en: string } }
  devplat: { verdict: Verdict; note: { pt: string; en: string } }
  oss: { verdict: Verdict; note: { pt: string; en: string } }
}

const ROWS: CriterionRow[] = [
  {
    icon: <Shield size={16} />,
    criterion: { pt: 'Governança no núcleo', en: 'Governance at the core' },
    kiam: {
      verdict: 'win',
      note: { pt: 'AI Safety, FinOps e auditoria embutidos por padrão', en: 'AI Safety, FinOps and auditing built-in by default' },
    },
    hyper: {
      verdict: 'loss',
      note: { pt: 'Toolkit técnico — governança via plugins e configuração manual', en: 'Technical toolkit — governance via plugins and manual setup' },
    },
    devplat: {
      verdict: 'loss',
      note: { pt: 'Focado em produtividade do dev — governança fora do escopo', en: 'Developer-productivity focused — governance out of scope' },
    },
    oss: {
      verdict: 'loss',
      note: { pt: 'Cliente constrói a governança em cima do framework', en: 'Client builds governance on top of the framework' },
    },
  },
  {
    icon: <DollarSign size={16} />,
    criterion: { pt: 'Custo previsível (FinOps)', en: 'Predictable cost (FinOps)' },
    kiam: {
      verdict: 'win',
      note: { pt: 'Billing por usuário/agente/projeto — sem surpresas', en: 'Billing per user/agent/project — no surprises' },
    },
    hyper: {
      verdict: 'tie',
      note: { pt: 'Consumption-based — exige FinOps interno robusto', en: 'Consumption-based — requires solid internal FinOps' },
    },
    devplat: {
      verdict: 'tie',
      note: { pt: 'Licença por seat + custo dos modelos provedor externo', en: 'Per-seat license + external model provider cost' },
    },
    oss: {
      verdict: 'loss',
      note: { pt: 'Custos ocultos: time, infra, observabilidade, manutenção', en: 'Hidden costs: team, infra, observability, maintenance' },
    },
  },
  {
    icon: <Timer size={16} />,
    criterion: { pt: 'Tempo até o primeiro valor', en: 'Time to first value' },
    kiam: {
      verdict: 'win',
      note: { pt: 'SaaS pronto — semanas com Fusion Teams; dias em standalone', en: 'Ready SaaS — weeks with Fusion Teams; days standalone' },
    },
    hyper: {
      verdict: 'tie',
      note: { pt: 'POC rápido, produção exige squad técnico dedicado', en: 'Quick POC, production needs dedicated technical squad' },
    },
    devplat: {
      verdict: 'tie',
      note: { pt: 'Acelera engenharia, não a operação corporativa', en: 'Accelerates engineering, not corporate operations' },
    },
    oss: {
      verdict: 'loss',
      note: { pt: 'Meses para chegar em produção segura', en: 'Months to reach safe production' },
    },
  },
  {
    icon: <Lock size={16} />,
    criterion: { pt: 'Lock-in de provedor', en: 'Vendor lock-in' },
    kiam: {
      verdict: 'win',
      note: { pt: 'Multi-cloud e LLM Routing — sem amarração', en: 'Multi-cloud and LLM Routing — no lock-in' },
    },
    hyper: {
      verdict: 'loss',
      note: { pt: 'Forte amarração ao ecossistema do hyperscaler', en: 'Strong lock-in to the hyperscaler ecosystem' },
    },
    devplat: {
      verdict: 'tie',
      note: { pt: 'Amarração ao provedor da plataforma', en: 'Lock-in to platform vendor' },
    },
    oss: {
      verdict: 'win',
      note: { pt: 'Liberdade total — mas com custo de manutenção', en: 'Full freedom — but with maintenance cost' },
    },
  },
  {
    icon: <Layers size={16} />,
    criterion: { pt: 'Adaptação ao DNA da empresa', en: 'Adaptation to company DNA' },
    kiam: {
      verdict: 'win',
      note: { pt: 'RAG corporativo + integrações nativas + Fusion Teams', en: 'Corporate RAG + native integrations + Fusion Teams' },
    },
    hyper: {
      verdict: 'tie',
      note: { pt: 'Possível, mas exige projetos de integração custom', en: 'Possible, but requires custom integration projects' },
    },
    devplat: {
      verdict: 'loss',
      note: { pt: 'Foco em código, não no DNA do negócio', en: 'Focus on code, not on business DNA' },
    },
    oss: {
      verdict: 'tie',
      note: { pt: 'Adaptável, mas o cliente faz todo o trabalho', en: 'Adaptable, but the client does all the work' },
    },
  },
  {
    icon: <Bot size={16} />,
    criterion: { pt: 'Multi-modelo (escolha do melhor LLM)', en: 'Multi-model (best-LLM routing)' },
    kiam: {
      verdict: 'win',
      note: { pt: 'LLM Routing automático por tarefa, performance e custo', en: 'Automatic LLM Routing per task, performance and cost' },
    },
    hyper: {
      verdict: 'loss',
      note: { pt: 'Limitado aos modelos do próprio hyperscaler', en: 'Limited to the hyperscaler\'s own models' },
    },
    devplat: {
      verdict: 'tie',
      note: { pt: 'Suporte a alguns modelos, sem roteamento dinâmico', en: 'Supports some models, no dynamic routing' },
    },
    oss: {
      verdict: 'win',
      note: { pt: 'Suporte amplo — implementação por conta do time', en: 'Wide support — implementation up to the team' },
    },
  },
  {
    icon: <Blocks size={16} />,
    criterion: { pt: 'Quem pode construir agentes', en: 'Who can build agents' },
    kiam: {
      verdict: 'win',
      note: { pt: 'De analistas de negócio a devs — low/no-code + pro-code', en: 'From business analysts to devs — low/no-code + pro-code' },
    },
    hyper: {
      verdict: 'tie',
      note: { pt: 'Engenheiros e desenvolvedores qualificados', en: 'Qualified engineers and developers' },
    },
    devplat: {
      verdict: 'loss',
      note: { pt: 'Quase exclusivamente engenheiros', en: 'Almost exclusively engineers' },
    },
    oss: {
      verdict: 'loss',
      note: { pt: 'Apenas times de engenharia experientes', en: 'Only experienced engineering teams' },
    },
  },
]

const COMPETITORS = [
  {
    key: 'hyper',
    label: { pt: 'Hyperscalers', en: 'Hyperscalers' },
    sub: { pt: 'Copilot Studio · Bedrock · Vertex', en: 'Copilot Studio · Bedrock · Vertex' },
    color: '#60A5FA',
  },
  {
    key: 'devplat',
    label: { pt: 'Plataformas Dev', en: 'Dev Platforms' },
    sub: { pt: 'Cursor · GitHub Copilot Workspaces', en: 'Cursor · GitHub Copilot Workspaces' },
    color: '#A78BFA',
  },
  {
    key: 'oss',
    label: { pt: 'Open-Source', en: 'Open-Source' },
    sub: { pt: 'LangGraph · CrewAI · AutoGen', en: 'LangGraph · CrewAI · AutoGen' },
    color: '#FBBF24',
  },
] as const

function VerdictBadge({ verdict, lang }: { verdict: Verdict; lang: 'pt' | 'en' }) {
  const cfg = {
    win: { icon: <CheckCircle2 size={12} />, color: '#34D399', label: lang === 'pt' ? 'Forte' : 'Strong' },
    tie: { icon: <AlertTriangle size={12} />, color: '#FBBF24', label: lang === 'pt' ? 'Parcial' : 'Partial' },
    loss: { icon: <XCircle size={12} />, color: '#F87171', label: lang === 'pt' ? 'Fraco' : 'Weak' },
  }[verdict]

  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{
        background: hexToRgba(cfg.color, 0.12),
        border: `1px solid ${hexToRgba(cfg.color, 0.3)}`,
        color: cfg.color,
      }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

export function SectionKiamComparison() {
  const { lang } = useLanguage()
  const { navigate } = useApp()
  const pt = lang === 'pt'
  const L = lang as 'pt' | 'en'

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">

        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate('ai-foursys')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-foursys-text-muted hover:text-white transition-all"
          >
            <ArrowLeft size={12} />
            {pt ? 'Voltar para IA na Foursys' : 'Back to AI at Foursys'}
          </button>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center mb-12"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(255,83,21,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foursys-primary/10 border border-foursys-primary/25 mb-5"
          >
            <Scale size={14} className="text-foursys-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-foursys-primary">
              {pt ? 'Comparativo de Plataformas' : 'Platform Comparison'}
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
            {pt
              ? <>KIAM <span className="text-foursys-primary">vs.</span> Mercado</>
              : <>KIAM <span className="text-foursys-primary">vs.</span> Market</>}
          </h2>

          <p className="text-sm md:text-base text-foursys-text-muted max-w-2xl mx-auto leading-relaxed">
            {pt
              ? 'Por que KIAM é a única opção com governança no núcleo, produto pronto e adaptação ao DNA da empresa — comparada a Hyperscalers, Plataformas Dev e Open-Source.'
              : 'Why KIAM is the only option with governance at the core, ready product and adaptation to company DNA — compared to Hyperscalers, Dev Platforms and Open-Source.'}
          </p>

          <div className="mt-6 flex justify-center">
            <div className="h-px w-48 bg-gradient-to-r from-transparent via-foursys-primary/40 to-transparent" />
          </div>
        </motion.div>

        {/* Resumo dos 4 players (header cards) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          data-voz-caixa="kiam-comp-resumo"
          data-voz-caixa-secao="kiam-comparison"
          data-voz-caixa-rotulo={pt ? 'Resumo dos players' : 'Players summary'}
          tabIndex={-1}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 focus:outline-none"
        >
          {/* KIAM destacado */}
          <div
            className="relative rounded-2xl p-4 text-center order-first md:order-none md:col-span-1"
            style={{
              background: `linear-gradient(160deg, ${hexToRgba(ORANGE, 0.18)} 0%, rgba(10,12,20,0.95) 100%)`,
              border: `2px solid ${hexToRgba(ORANGE, 0.5)}`,
              boxShadow: `0 0 30px ${hexToRgba(ORANGE, 0.2)}`,
            }}
          >
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-foursys-primary text-white">
              {pt ? 'Foursys' : 'Foursys'}
            </span>
            <div className="flex items-center justify-center gap-2 mb-1 mt-1">
              <BrainCircuit size={20} className="text-foursys-primary" />
              <span className="text-lg font-black text-white">KIAM</span>
            </div>
            <p className="text-[10px] text-foursys-text-muted leading-tight">
              {pt ? 'Sistema operacional cognitivo SaaS' : 'SaaS cognitive operating system'}
            </p>
          </div>

          {COMPETITORS.map(c => (
            <div
              key={c.key}
              className="relative rounded-2xl p-4 text-center"
              style={{
                background: `linear-gradient(160deg, ${hexToRgba(c.color, 0.08)} 0%, rgba(10,12,20,0.95) 100%)`,
                border: `1px solid ${hexToRgba(c.color, 0.2)}`,
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-1 mt-1">
                <span className="text-base font-bold" style={{ color: c.color }}>{c.label[L]}</span>
              </div>
              <p className="text-[10px] text-foursys-text-muted leading-tight">
                {c.sub[L]}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Matriz comparativa */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          data-voz-caixa="kiam-comp-matriz"
          data-voz-caixa-secao="kiam-comparison"
          data-voz-caixa-rotulo={pt ? 'Matriz comparativa por critério' : 'Comparison matrix per criterion'}
          tabIndex={-1}
          className="space-y-4 mb-10 focus:outline-none"
        >
          {ROWS.map((row, i) => (
            <motion.div
              key={row.criterion.pt}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
              className="rounded-2xl p-4 md:p-5"
              style={{
                background: 'rgba(10,12,20,0.6)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${hexToRgba(ORANGE, 0.18)}, ${hexToRgba(ORANGE, 0.05)})`,
                    border: `1px solid ${hexToRgba(ORANGE, 0.25)}`,
                    color: ORANGE,
                  }}
                >
                  {row.icon}
                </div>
                <h3 className="text-base md:text-lg font-black text-white leading-tight">
                  {row.criterion[L]}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: hexToRgba(ORANGE, 0.1),
                    border: `1.5px solid ${hexToRgba(ORANGE, 0.4)}`,
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black text-foursys-primary">KIAM</span>
                    <VerdictBadge verdict={row.kiam.verdict} lang={L} />
                  </div>
                  <p className="text-[11px] text-white/85 leading-relaxed">{row.kiam.note[L]}</p>
                </div>

                {COMPETITORS.map(c => {
                  const cell = row[c.key]
                  return (
                    <div
                      key={c.key}
                      className="rounded-xl p-3"
                      style={{
                        background: hexToRgba(c.color, 0.04),
                        border: `1px solid ${hexToRgba(c.color, 0.18)}`,
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold" style={{ color: c.color }}>{c.label[L]}</span>
                        <VerdictBadge verdict={cell.verdict} lang={L} />
                      </div>
                      <p className="text-[11px] text-foursys-text-muted leading-relaxed">{cell.note[L]}</p>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Resumo executivo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-6 mb-10"
          style={{
            background: `linear-gradient(135deg, ${hexToRgba(ORANGE, 0.12)}, ${hexToRgba(MINT, 0.06)})`,
            border: `1px solid ${hexToRgba(ORANGE, 0.25)}`,
          }}
        >
          <h3 className="text-lg md:text-xl font-black text-white mb-3 flex items-center gap-2">
            <BrainCircuit size={18} className="text-foursys-primary" />
            {pt ? 'Em uma frase' : 'In one sentence'}
          </h3>
          <p className="text-sm md:text-base text-white/90 leading-relaxed">
            {pt
              ? <>KIAM é o único produto pronto que combina <span className="text-foursys-primary font-bold">governança no núcleo</span>, <span className="text-foursys-primary font-bold">FinOps nativo</span> e <span className="text-foursys-primary font-bold">adaptação ao DNA da empresa</span> — entregando valor em semanas em vez de meses, sem lock-in de provedor.</>
              : <>KIAM is the only ready product combining <span className="text-foursys-primary font-bold">core governance</span>, <span className="text-foursys-primary font-bold">native FinOps</span> and <span className="text-foursys-primary font-bold">company-DNA adaptation</span> — delivering value in weeks instead of months, with no vendor lock-in.</>}
          </p>
        </motion.div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center pt-8 border-t border-white/[0.06]"
        >
          <p className="text-sm text-foursys-text-muted mb-4">
            {pt ? 'Quer ver KIAM em ação na sua operação?' : 'Want to see KIAM in action in your operation?'}
          </p>
          <a
            href="mailto:contato@foursys.com.br?subject=KIAM%20-%20Plataforma%20de%20IA"
            data-voz-detalhe="kiam-comp-cta"
            data-voz-detalhe-secao="kiam-comparison"
            data-voz-detalhe-rotulo={pt ? 'Falar com a Foursys' : 'Talk to Foursys'}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foursys-primary text-white text-sm font-bold hover:bg-foursys-primary/90 transition-all cursor-pointer"
          >
            {pt ? 'Falar com a Foursys sobre KIAM' : 'Talk to Foursys about KIAM'}
            <ArrowRight size={14} />
          </a>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
