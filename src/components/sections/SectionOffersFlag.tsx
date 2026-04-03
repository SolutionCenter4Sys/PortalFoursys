import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2, X } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { useApp } from '../../context/AppContext'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { DynIcon } from '../../utils/iconMap'

// ─── Dados das ofertas flagship ───────────────────────────────────────────────

const flagshipOffers = [
  {
    id: 'ai-squad',
    badge: 'Destaque',
    title: 'AI-Augmented Squad',
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
    id: 'ia-first',
    badge: 'Destaque',
    title: 'AI First',
    tagline: 'Do piloto ao resultado mensurável em 4–6 semanas.',
    description:
      'Em 4–6 semanas: 2–3 casos priorizados, 1 protótipo e business case com ROI estimado. Para quem quer sair de experimentos de IA e provar valor real.',
    metrics: [
      { value: '+50%', label: 'Produtividade dos times' },
      { value: '+35%', label: 'Aceleração do desenvolvimento' },
      { value: '-20%', label: 'Custo por funcionalidade' },
    ],
    highlights: [
      'Diagnóstico de oportunidades em 1 semana',
      'PoC funcional com dados reais do cliente',
      'Business case com ROI calculado e validado',
      'Roadmap de escala pós-PoC',
    ],
    color: '#00C2E0',
    bg: 'from-cyan-500/15 to-cyan-600/5',
    border: 'border-cyan-500/30',
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
    title: 'Quality AI',
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

// ─── Modal de detalhe da oferta ───────────────────────────────────────────────

function OfferModal({
  offer,
  onClose,
  onNavigate,
}: {
  offer: (typeof flagshipOffers)[0]
  onClose: () => void
  onNavigate: () => void
}) {
  const trapRef = useFocusTrap(true)

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
            aria-label="Fechar"
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
            Ver detalhes completos <ArrowRight size={14} />
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
  offer: (typeof flagshipOffers)[0]
  index: number
  onClick: () => void
}) {
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
        Saiba mais <ArrowRight size={12} />
      </div>
    </motion.div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionOffersFlag() {
  const { navigate, setDeepDiveHint } = useApp()
  const [selectedOffer, setSelectedOffer] = useState<(typeof flagshipOffers)[0] | null>(null)

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
                Nossas principais ofertas
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-none">
                Principais Ofertas
              </h2>
              <p className="text-foursys-text-muted mt-2 text-sm md:text-base max-w-xl leading-relaxed">
                Impacto comprovado — valor em semanas, governança enterprise e resultado mensurável.
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <InterestButton section="offers-flagship" />
              {[
                { value: '26', label: 'anos' },
                { value: '3,6%', label: 'turnover' },
                { value: '500K+', label: 'projetos' },
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

        {/* ── Modelos de trabalho ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="p-4 md:p-6 rounded-2xl bg-foursys-surface/30 border border-white/[0.08]"
        >
          <h3 className="text-sm font-bold text-foursys-text mb-3 md:mb-4">Como trabalhamos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { title: 'Squads',   desc: 'Times multidisciplinares integrados ao seu time, com governança e métricas.', icon: 'users' },
              { title: 'Projetos', desc: 'Escopo definido, prazo e entregas claras. Ideal para modernização e migração.', icon: 'clipboard-list' },
              { title: 'Alocação', desc: 'Profissionais especializados para demandas de curto ou médio prazo.', icon: 'target' },
              { title: 'AMS',      desc: 'Application Management Services com SLAs, NOC e evolução contínua.', icon: 'settings' },
            ].map(model => (
              <div key={model.title} className="flex gap-2.5 md:gap-3">
                <span className="flex-shrink-0 mt-0.5">
                  <DynIcon name={model.icon} size={24} className="text-foursys-text-muted" />
                </span>
                <div>
                  <div className="text-xs md:text-sm font-bold text-foursys-text mb-0.5 md:mb-1">{model.title}</div>
                  <p className="text-[11px] md:text-xs text-foursys-text-muted leading-relaxed">{model.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

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
