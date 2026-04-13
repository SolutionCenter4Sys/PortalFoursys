import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2, X } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { useApp } from '../../context/AppContext'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useLanguage } from '../../i18n'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlagshipOffer {
  id: string
  badge: string
  title: string
  tagline: string
  description: string
  metrics: { value: string; label: string }[]
  highlights: string[]
  color: string
  bg: string
  border: string
  navigateTo: 'services'
}

// ─── Dados das ofertas flagship ───────────────────────────────────────────────

const FLAGSHIP_OFFERS_PT: FlagshipOffer[] = [
  {
    id: 'ai-squad',
    badge: 'Destaque',
    title: 'AI Squad',
    tagline: 'Valor em semanas, não em meses.',
    description:
      'Squad operacional Humano + IA com mais de 20 agentes especializados por fase (Discovery → Design → Desenvolvimento → Qualidade → Deploy). Framework SDD proprietário, documentação completa (C4, ADRs, specs de API), dashboards de performance em tempo real e agentes treinados na sua stack e domínio.',
    metrics: [
      { value: '65%', label: 'Redução de lead time' },
      { value: '80%', label: 'Ganho de produtividade' },
      { value: '70%', label: 'Queda de retrabalho' },
    ],
    highlights: [
      'Squad: PO, AI Engineer, Devs e QA amplificados por 20+ agentes de IA',
      'Framework SDD (OpenSpec) com agentes por fase do ciclo',
      'Documentação completa: C4, ADRs, user stories, specs de API e testes',
      'Dashboards: velocidade, burndown, custos, taxa de aceitação de IA',
      'Agentes treinados na stack, domínio e regras de negócio do cliente',
      'Conformidade GDPR & EU AI Act, cloud isolada por cliente',
      'Autonomia total: código aberto para evolução, sem lock-in',
    ],
    color: '#FF6600',
    bg: 'from-orange-500/15 to-orange-600/5',
    border: 'border-orange-500/30',
    navigateTo: 'services' as const,
  },
  {
    id: 'modernizacao',
    badge: 'Destaque',
    title: 'Modernização de Legado',
    tagline: 'Do legado ao cloud, sem trauma.',
    description:
      'Solução integrada com aceleradores 4AI (Extrator de Regras, Conversor de Código, Certificação) que combina transformação tecnológica, segurança avançada e capacitação humana. Ciclos de release de 6 semanas com automação IA + supervisão humana (50/50).',
    metrics: [
      { value: '+30%', label: 'Redução de custos' },
      { value: '+70%', label: 'Aceleração time-to-market' },
      { value: '+60%', label: 'Segurança de código' },
    ],
    highlights: [
      'Aceleradores 4AI: extração de regras, conversão de código e certificação',
      'Cobertura: COBOL, VB6, .NET, Java, Angular, React, Vue',
      'Automação 50/50: IA + supervisão humana em cada ciclo',
      'Ciclos de release escaláveis de 6 semanas',
      '3 modelos: Essencial, Estratégica e Evolução',
      'Segurança, observabilidade e FinOps integrados',
      'POC/POT com amostra real do legado antes da contratação',
    ],
    color: '#8B5CF6',
    bg: 'from-violet-500/15 to-violet-600/5',
    border: 'border-violet-500/30',
    navigateTo: 'services' as const,
  },
  {
    id: 'ciberseguranca',
    badge: 'Destaque',
    title: 'Cibersegurança',
    tagline: 'Proteção, conformidade e gestão de riscos digitais.',
    description:
      'Mitigamos vulnerabilidades e fortalecemos controles para proteger ativos, atender regulações e reduzir exposição a incidentes. Abordagem integrada com automação de controles e monitoramento contínuo.',
    metrics: [
      { value: '-80%', label: 'Redução de vulnerabilidades' },
      { value: '+70%', label: 'Conformidade regulatória' },
      { value: '-60%', label: 'Tempo de resposta a incidentes' },
    ],
    highlights: [
      'Visão integrada: segurança como atributo, não como barreira',
      'Experiência em ambientes regulados (LGPD, Bacen, PCI-DSS)',
      'Automação de controles e monitoramento contínuo',
      'Cultura de segurança embarcada nos times de desenvolvimento',
    ],
    color: '#84CC16',
    bg: 'from-lime-500/15 to-lime-600/5',
    border: 'border-lime-500/30',
    navigateTo: 'services' as const,
  },
  {
    id: 'fourblox',
    badge: 'Destaque',
    title: 'FourBlox',
    tagline: 'Chega de projetos intermináveis. Sua solução digital pronta em 30 dias.',
    description:
      'Plataforma modular de soluções por assinatura com +18 soluções prontas em 9 categorias (Gestão de Pessoas, Operações, Financeiro, Comercial, Projetos, ESG, Dados & Analytics, Governança). Diagnóstico estruturado, desenho personalizado, configuração sob medida e produção em até 30 dias.',
    metrics: [
      { value: '30',    label: 'Dias para go live' },
      { value: '18+',   label: 'Soluções disponíveis' },
      { value: 'SaaS',  label: 'Modelo por assinatura' },
    ],
    highlights: [
      'Produção em 30 dias — sem projetos de 6 a 12 meses',
      'Modelo por assinatura com previsibilidade financeira',
      'Modularidade inteligente: ative apenas o que gera valor',
      'UX centrada no usuário: adoção real, não imposição',
      'Evolução contínua baseada em dados',
      'Kits pré-configurados para resultados acelerados',
      '9 categorias e +18 soluções prontas para personalizar',
    ],
    color: '#4ADE80',
    bg: 'from-green-500/15 to-green-600/5',
    border: 'border-green-500/30',
    navigateTo: 'services' as const,
  },
  {
    id: 'quality-ia',
    badge: 'Destaque',
    title: 'Qualidade & Testes com IA',
    tagline: 'Qualidade no escopo não é custo a mais — é o que evita custo maior.',
    description:
      'Prática de Qualidade de Software com duas torres: COE (Excelência — metodologia, padrões, ferramentas, indicadores) e CSC (Operação — QA nas squads, certificação GMUD, automação funcional). Framework Shift-Left com Agente Automatizador que gera +120 cenários/mês vs 20 manuais.',
    metrics: [
      { value: '+10x', label: 'Visibilidade de riscos' },
      { value: '+80%', label: 'Prevenção falhas críticas' },
      { value: '+6x',  label: 'Aceleração de testes' },
    ],
    highlights: [
      'Duas torres: COE (Excelência) + CSC (Operação) — plug\'n\'play',
      'Framework Shift-Left: qualidade antecipada desde design de cenários',
      'Agente Automatizador: +120 cenários/mês (6x mais que manual)',
      'DataForge: massa sintética integrada em 1 dia, sem vício de dados',
      'Cenários BDD/Gherkin com cobertura de testes +70%',
      'Dashboards com 5+ indicadores (Planejado vs Executado, Defeitos, Status)',
      'Certificação GMUD com automação de caminho crítico em 2 dias',
    ],
    color: '#F59E0B',
    bg: 'from-amber-500/15 to-amber-600/5',
    border: 'border-amber-500/30',
    navigateTo: 'services' as const,
  },
]

const FLAGSHIP_OFFERS_EN: FlagshipOffer[] = [
  {
    id: 'ai-squad',
    badge: 'Featured',
    title: 'AI Squad',
    tagline: 'Value in weeks, not months.',
    description:
      'Human + AI operational squad with over 20 specialized agents per phase (Discovery → Design → Development → Quality → Deploy). Proprietary SDD Framework, complete documentation (C4, ADRs, API specs), real-time performance dashboards and agents trained on your stack and domain.',
    metrics: [
      { value: '65%', label: 'Lead time reduction' },
      { value: '80%', label: 'Productivity gain' },
      { value: '70%', label: 'Rework reduction' },
    ],
    highlights: [
      'Squad: PO, AI Engineer, Devs and QA amplified by 20+ AI agents',
      'SDD Framework (OpenSpec) with agents per cycle phase',
      'Complete documentation: C4, ADRs, user stories, API specs and tests',
      'Dashboards: velocity, burndown, costs, AI acceptance rate',
      'Agents trained on the client\'s stack, domain and business rules',
      'GDPR & EU AI Act compliance, isolated cloud per client',
      'Full autonomy: open code for evolution, no lock-in',
    ],
    color: '#FF6600',
    bg: 'from-orange-500/15 to-orange-600/5',
    border: 'border-orange-500/30',
    navigateTo: 'services' as const,
  },
  {
    id: 'modernizacao',
    badge: 'Featured',
    title: 'Legacy Modernization',
    tagline: 'From legacy to cloud, trauma-free.',
    description:
      'Integrated solution with 4AI accelerators (Rule Extractor, Code Converter, Certification) combining technology transformation, advanced security and human upskilling. 6-week release cycles with AI automation + human supervision (50/50).',
    metrics: [
      { value: '+30%', label: 'Cost reduction' },
      { value: '+70%', label: 'Time-to-market acceleration' },
      { value: '+60%', label: 'Code security' },
    ],
    highlights: [
      '4AI Accelerators: rule extraction, code conversion and certification',
      'Coverage: COBOL, VB6, .NET, Java, Angular, React, Vue',
      '50/50 Automation: AI + human supervision in each cycle',
      'Scalable 6-week release cycles',
      '3 models: Essential, Strategic and Evolution',
      'Integrated security, observability and FinOps',
      'POC/POT with real legacy sample before contracting',
    ],
    color: '#8B5CF6',
    bg: 'from-violet-500/15 to-violet-600/5',
    border: 'border-violet-500/30',
    navigateTo: 'services' as const,
  },
  {
    id: 'ciberseguranca',
    badge: 'Featured',
    title: 'Cybersecurity',
    tagline: 'Protection, compliance and digital risk management.',
    description:
      'We mitigate vulnerabilities and strengthen controls to protect assets, meet regulations and reduce incident exposure. Integrated approach with control automation and continuous monitoring.',
    metrics: [
      { value: '-80%', label: 'Vulnerability reduction' },
      { value: '+70%', label: 'Regulatory compliance' },
      { value: '-60%', label: 'Incident response time' },
    ],
    highlights: [
      'Integrated vision: security as an attribute, not a barrier',
      'Experience in regulated environments (LGPD, Bacen, PCI-DSS)',
      'Control automation and continuous monitoring',
      'Security culture embedded in development teams',
    ],
    color: '#84CC16',
    bg: 'from-lime-500/15 to-lime-600/5',
    border: 'border-lime-500/30',
    navigateTo: 'services' as const,
  },
  {
    id: 'fourblox',
    badge: 'Featured',
    title: 'FourBlox',
    tagline: 'No more endless projects. Your digital solution ready in 30 days.',
    description:
      'Modular subscription-based solution platform with 18+ ready solutions across 9 categories (People Management, Operations, Finance, Sales, Projects, ESG, Data & Analytics, Governance). Structured diagnosis, custom design, tailored configuration and production in up to 30 days.',
    metrics: [
      { value: '30',    label: 'Days to go live' },
      { value: '18+',   label: 'Solutions available' },
      { value: 'SaaS',  label: 'Subscription model' },
    ],
    highlights: [
      'Production in 30 days — no 6 to 12-month projects',
      'Subscription model with financial predictability',
      'Smart modularity: activate only what creates value',
      'User-centered UX: real adoption, not imposition',
      'Continuous evolution based on data',
      'Pre-configured kits for accelerated results',
      '9 categories and 18+ solutions ready to customize',
    ],
    color: '#4ADE80',
    bg: 'from-green-500/15 to-green-600/5',
    border: 'border-green-500/30',
    navigateTo: 'services' as const,
  },
  {
    id: 'quality-ia',
    badge: 'Featured',
    title: 'Quality & AI Testing',
    tagline: 'Quality in scope isn\'t an extra cost — it\'s what prevents greater cost.',
    description:
      'Software Quality practice with two towers: COE (Excellence — methodology, standards, tools, indicators) and CSC (Operations — QA in squads, GMUD certification, functional automation). Shift-Left Framework with Automator Agent generating 120+ scenarios/month vs 20 manual.',
    metrics: [
      { value: '+10x', label: 'Risk visibility' },
      { value: '+80%', label: 'Critical failure prevention' },
      { value: '+6x',  label: 'Test acceleration' },
    ],
    highlights: [
      'Two towers: COE (Excellence) + CSC (Operations) — plug\'n\'play',
      'Shift-Left Framework: quality anticipated from scenario design',
      'Automator Agent: 120+ scenarios/month (6x more than manual)',
      'DataForge: synthetic data integrated in 1 day, no data bias',
      'BDD/Gherkin scenarios with 70%+ test coverage',
      'Dashboards with 5+ indicators (Planned vs Executed, Defects, Status)',
      'GMUD certification with critical path automation in 2 days',
    ],
    color: '#F59E0B',
    bg: 'from-amber-500/15 to-amber-600/5',
    border: 'border-amber-500/30',
    navigateTo: 'services' as const,
  },
]

// ─── Modal de detalhe da oferta ───────────────────────────────────────────────

function OfferModal({
  offer,
  onClose,
  onNavigate,
}: {
  offer: FlagshipOffer
  onClose: () => void
  onNavigate: () => void
}) {
  const trapRef = useFocusTrap(true)
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={offer.title}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        ref={trapRef}
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 bg-foursys-dark-2 border border-white/[0.12] rounded-t-2xl sm:rounded-2xl max-w-xl w-full overflow-y-auto max-h-[90dvh]"
      >
        {/* Header */}
        <div
          className={`p-7 bg-gradient-to-br ${offer.bg} border-b ${offer.border}`}
        >
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 text-foursys-text-muted transition-colors"
          >
            <X size={16} />
          </button>
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border mb-3 inline-block"
            style={{ color: offer.color, borderColor: `${offer.color}44`, backgroundColor: `${offer.color}15` }}
          >
            {offer.badge}
          </span>
          <h3 className="text-2xl font-black text-white mb-1">{offer.title}</h3>
          <p style={{ color: offer.color }} className="text-sm font-semibold">{offer.tagline}</p>
        </div>

        {/* Conteúdo */}
        <div className="p-7 space-y-5">
          <p className="text-sm text-foursys-text-muted leading-relaxed">{offer.description}</p>

          {/* Métricas */}
          <div className="grid grid-cols-3 gap-3">
            {offer.metrics.map(m => (
              <div
                key={m.label}
                className="text-center p-3 rounded-xl border border-white/[0.06] bg-foursys-surface/30"
              >
                <div className="text-xl font-black" style={{ color: offer.color }}>{m.value}</div>
                <div className="text-[10px] text-foursys-text-dim mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Destaques */}
          <ul className="space-y-2">
            {offer.highlights.map(h => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-foursys-text-muted">
                <CheckCircle2 size={14} style={{ color: offer.color }} className="flex-shrink-0 mt-0.5" />
                {h}
              </li>
            ))}
          </ul>

          <button
            onClick={onNavigate}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: `${offer.color}20`, color: offer.color, border: `1px solid ${offer.color}40` }}
          >
            {t('common.seeDetails')} <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Card da oferta ───────────────────────────────────────────────────────────

function OfferCard({
  offer,
  index,
  onClick,
}: {
  offer: FlagshipOffer
  index: number
  onClick: () => void
}) {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      onClick={onClick}
      className={`p-6 rounded-2xl bg-gradient-to-br ${offer.bg} border ${offer.border} cursor-pointer hover:-translate-y-1 transition-all duration-300 flex flex-col group`}
    >
      {/* Badge */}
      <span
        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border mb-3 self-start"
        style={{ color: offer.color, borderColor: `${offer.color}44`, backgroundColor: `${offer.color}15` }}
      >
        {offer.badge}
      </span>

      {/* Título */}
      <h3 className="text-lg font-black text-white mb-1 leading-tight">{offer.title}</h3>
      <p style={{ color: offer.color }} className="text-xs font-semibold mb-3 leading-snug">
        {offer.tagline}
      </p>

      {/* Descrição curta */}
      <p className="text-xs text-foursys-text-muted leading-relaxed flex-1 line-clamp-3 mb-4">
        {offer.description}
      </p>

      {/* Métricas */}
      <div className="flex gap-3 mb-4">
        {offer.metrics.slice(0, 2).map(m => (
          <div key={m.label} className="border-l-2 pl-2" style={{ borderColor: `${offer.color}60` }}>
            <div className="text-base font-black leading-none" style={{ color: offer.color }}>{m.value}</div>
            <div className="text-[9px] text-foursys-text-dim mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>

      <div
        className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: offer.color }}
      >
        {t('common.seeMore')} <ArrowRight size={12} />
      </div>
    </motion.div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionOffersFlag() {
  const { navigate, setDeepDiveHint } = useApp()
  const { t, lang } = useLanguage()
  const flagshipOffers = useMemo(
    () => lang === 'pt' ? FLAGSHIP_OFFERS_PT : FLAGSHIP_OFFERS_EN,
    [lang]
  )
  const [selectedOffer, setSelectedOffer] = useState<FlagshipOffer | null>(null)

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 md:mb-10"
        >
          <div className="flex items-start md:items-end justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-primary mb-2">
                {t('offersFlag.badge')}
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-none">
                {t('offersFlag.title')}
              </h2>
              <p className="text-foursys-text-muted mt-2 text-sm md:text-base max-w-xl leading-relaxed">
                {t('offersFlag.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <InterestButton section="offers-flagship" />
              {[
                { value: '26', label: t('common.years') },
                { value: '3,6%', label: 'turnover' },
                { value: '30K+', label: t('common.projects') },
              ].map(stat => (
                <div key={stat.label} className="text-center px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-foursys-surface/40 border border-white/[0.08]">
                  <div className="text-base md:text-lg font-black text-foursys-primary">{stat.value}</div>
                  <div className="text-[10px] text-foursys-text-dim">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 md:mt-6 h-px bg-gradient-to-r from-foursys-primary/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* ── Grid de ofertas: 1 col mobile, 2 tablet, 5 desktop ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-10">
          {flagshipOffers.map((offer, i) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              index={i}
              onClick={() => setSelectedOffer(offer)}
            />
          ))}
        </div>

      </div>

      <AnimatePresence>
        {selectedOffer && (
          <OfferModal
            offer={selectedOffer}
            onClose={() => setSelectedOffer(null)}
            onNavigate={() => {
              if (selectedOffer.id === 'ai-squad') {
                setDeepDiveHint('ai-augmented-squad')
              } else if (selectedOffer.id === 'modernizacao') {
                setDeepDiveHint('modernizacao-legados')
              } else if (selectedOffer.id === 'ciberseguranca') {
                setDeepDiveHint('ciberseguranca')
              } else if (selectedOffer.id === 'quality-ia') {
                setDeepDiveHint('quality-testes-ia')
              } else if (selectedOffer.id === 'fourblox') {
                setDeepDiveHint('fourblox')
              }
              navigate(selectedOffer.navigateTo)
              setSelectedOffer(null)
            }}
          />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
