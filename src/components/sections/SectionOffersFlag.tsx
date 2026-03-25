import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2, X } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { InterestButton } from '../ui/InterestButton'
import { useApp } from '../../context/AppContext'

// ─── Dados das ofertas flagship ───────────────────────────────────────────────

const flagshipOffers = [
  {
    id: 'ai-squad',
    badge: 'Flagship',
    title: 'AI-Augmented Squad',
    tagline: 'Valor em semanas, não em meses.',
    description:
      'Times multidisciplinares (humanos + IA) que entregam em ciclos curtos, com métricas e governança. Diferente de nearshore genérico: playbook de qualidade, segurança e turnover de 3,6%.',
    metrics: [
      { value: '70%', label: 'Redução de lead time' },
      { value: '3,6%', label: 'Turnover (vs 22% mercado)' },
      { value: '3x', label: 'Throughput aumentado' },
    ],
    highlights: [
      'Entrega com governança embutida desde sprint 1',
      'Playbook de qualidade e segurança próprio',
      'Integração transparente com seu time e processos',
      'Métricas de progresso em tempo real',
    ],
    color: '#FF6600',
    bg: 'from-orange-500/15 to-orange-600/5',
    border: 'border-orange-500/30',
    navigateTo: 'delivery' as const,
  },
  {
    id: 'modernizacao',
    badge: 'Flagship',
    title: 'Modernização de Legado',
    tagline: 'Do core ao cloud, sem trauma.',
    description:
      'Plano por ondas (encapsular → replatform → refatorar) com caso piloto e métricas. Para CIO/CTO de empresas com sistemas críticos que precisam modernizar com risco controlado.',
    metrics: [
      { value: '+30%', label: 'Redução de custos' },
      { value: '+70%', label: 'Aceleração time-to-market' },
      { value: '+60%', label: 'Segurança de código' },
    ],
    highlights: [
      'Metodologia por ondas — sem big-bang rewrite',
      'Continuidade operacional garantida durante migração',
      'Piloto em 12 semanas com métricas de ROI',
      'Compatible com qualquer stack legado',
    ],
    color: '#8B5CF6',
    bg: 'from-violet-500/15 to-violet-600/5',
    border: 'border-violet-500/30',
    navigateTo: 'sdd-legacy' as const,
  },
  {
    id: 'ia-first',
    badge: 'Flagship',
    title: 'IA First',
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
    navigateTo: 'lab-ia' as const,
  },
  {
    id: 'fourblox',
    badge: 'Flagship',
    title: 'FourBlox',
    tagline: 'Produtos digitais por assinatura, prontos para escalar.',
    description:
      'Módulos digitais pré-construídos e personalizáveis por assinatura: plataformas de checkin, gestão de eventos, portais corporativos e mais. Go live em 30 dias.',
    metrics: [
      { value: '30',    label: 'Dias para go live' },
      { value: '100%',  label: 'Personalizável' },
      { value: 'SaaS',  label: 'Modelo por assinatura' },
    ],
    highlights: [
      'Módulos prontos — sem desenvolvimento do zero',
      'Personalização de marca e fluxos de negócio',
      'Modelo por assinatura com SLA garantido',
      'Escala sem custo de infraestrutura inicial',
    ],
    color: '#4ADE80',
    bg: 'from-green-500/15 to-green-600/5',
    border: 'border-green-500/30',
    navigateTo: 'fourblock' as const,
  },
  {
    id: 'quality-ia',
    badge: 'Flagship',
    title: 'Quality IA',
    tagline: 'QA, certificação e automação com IA — menos falhas, mais previsibilidade.',
    description:
      'Framework de qualidade com IA integrada para geração automática de testes, análise de risco e cobertura inteligente. Homologado por grandes instituições financeiras.',
    metrics: [
      { value: '78%', label: 'Aumento de cobertura' },
      { value: '60%', label: 'Redução de defeitos' },
      { value: '3x',  label: 'Velocidade de release' },
    ],
    highlights: [
      'Geração automática de casos de teste com LLMs',
      'Análise de risco e priorização por impacto',
      'Integração nativa com CI/CD (Jenkins, GitHub Actions)',
      'Já homologado em ambientes bancários de alta criticidade',
    ],
    color: '#F59E0B',
    bg: 'from-amber-500/15 to-amber-600/5',
    border: 'border-amber-500/30',
    navigateTo: 'capabilities' as const,
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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 bg-foursys-dark-2 border border-white/[0.12] rounded-2xl max-w-xl w-full overflow-hidden"
      >
        {/* Header */}
        <div
          className={`p-7 bg-gradient-to-br ${offer.bg} border-b ${offer.border}`}
        >
          <button
            onClick={onClose}
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
  const { navigate } = useApp()
  const [selectedOffer, setSelectedOffer] = useState<(typeof flagshipOffers)[0] | null>(null)

  return (
    <SectionWrapper>
      <div className="px-8 py-10 max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-blue mb-2">
                Nossas principais ofertas
              </p>
              <h2 className="text-4xl font-black text-white leading-none">
                Ofertas Flagship
              </h2>
              <p className="text-foursys-text-muted mt-2 text-base max-w-xl leading-relaxed">
                Três ofertas, impacto comprovado — valor em semanas, governança enterprise e resultado mensurável.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <InterestButton section="offers-flagship" />
              {[
                { value: '26', label: 'anos' },
                { value: '3,6%', label: 'turnover' },
                { value: '500K+', label: 'projetos' },
              ].map(stat => (
                <div key={stat.label} className="text-center px-4 py-2 rounded-xl bg-foursys-surface/40 border border-white/[0.08]">
                  <div className="text-lg font-black text-foursys-blue">{stat.value}</div>
                  <div className="text-[10px] text-foursys-text-dim">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 h-px bg-gradient-to-r from-foursys-blue/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* ── Grid de ofertas ── */}
        <div className="grid grid-cols-5 gap-4 mb-10">
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
          className="p-6 rounded-2xl bg-foursys-surface/30 border border-white/[0.08]"
        >
          <h3 className="text-sm font-bold text-foursys-text mb-4">Como trabalhamos</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                title: 'Squads',
                desc: 'Times multidisciplinares integrados ao seu time, com governança e métricas.',
                icon: '👥',
              },
              {
                title: 'Projetos',
                desc: 'Escopo definido, prazo e entregas claras. Ideal para modernização e migração.',
                icon: '📋',
              },
              {
                title: 'Alocação',
                desc: 'Profissionais especializados para demandas específicas de curto ou médio prazo.',
                icon: '🎯',
              },
              {
                title: 'AMS',
                desc: 'Application Management Services com SLAs, NOC e evolução contínua.',
                icon: '⚙️',
              },
            ].map(model => (
              <div key={model.title} className="flex gap-3">
                <span className="text-2xl flex-shrink-0">{model.icon}</span>
                <div>
                  <div className="text-sm font-bold text-foursys-text mb-1">{model.title}</div>
                  <p className="text-xs text-foursys-text-muted leading-relaxed">{model.desc}</p>
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
              navigate(selectedOffer.navigateTo)
              setSelectedOffer(null)
            }}
          />
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
