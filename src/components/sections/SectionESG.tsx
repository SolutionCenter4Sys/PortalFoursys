import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { useApp } from '../../context/AppContext'
import { DynIcon } from '../../utils/iconMap'

// ─── Dados FourLives ──────────────────────────────────────────────────────────

const impactStats = [
  { value: '3.000+', label: 'Vidas impactadas', icon: 'heart' },
  { value: '1',      label: 'Árvore plantada por profissional/ano', icon: 'tree-pine' },
  { value: '3',      label: 'Frentes de impacto social', icon: 'target' },
  { value: '26',     label: 'Anos de responsabilidade ESG', icon: 'calendar' },
]

const fronts = [
  {
    id: 'capacitacao',
    icon: 'graduation-cap',
    title: 'Capacitação',
    color: '#FF6600',
    bg: 'from-orange-500/15 to-orange-600/5',
    border: 'border-orange-500/30',
    description:
      'Programas de educação tecnológica para comunidades de baixa renda, formando profissionais para o mercado de TI. Mais de 500 jovens capacitados em programação e infraestrutura cloud.',
    highlights: [
      '500+ jovens capacitados em TI',
      'Parceria com institutos de ensino',
      'Certificação profissional incluída',
      'Taxa de empregabilidade de 80%+',
    ],
  },
  {
    id: 'inclusao',
    icon: 'handshake',
    title: 'Inclusão',
    color: '#8B5CF6',
    bg: 'from-violet-500/15 to-violet-600/5',
    border: 'border-violet-500/30',
    description:
      'Iniciativas de diversidade e inclusão para ampliar oportunidades de grupos sub-representados na tecnologia. Metas de diversidade de gênero, raça e PcD em todas as contratações.',
    highlights: [
      '40%+ mulheres em posições tech',
      'Programa de mentoria para PCDs',
      'Comitê de diversidade ativo',
      'Parceria com comunidades LGBTQIA+',
    ],
  },
  {
    id: 'sustentabilidade',
    icon: 'sprout',
    title: 'Sustentabilidade',
    color: '#4ADE80',
    bg: 'from-green-500/15 to-green-600/5',
    border: 'border-green-500/30',
    description:
      'Plantio de uma árvore por profissional a cada ano e metas de redução de pegada de carbono nas operações. Uso de energia renovável em todos os escritórios brasileiros.',
    highlights: [
      '2.000+ árvores plantadas por ano',
      'Energia 100% renovável nos escritórios',
      'Meta carbono neutro até 2030',
      'Redução de 30% de resíduos em 3 anos',
    ],
  },
]

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionESG() {
  const { navigate } = useApp()
  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 md:mb-10"
        >
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-primary mb-2">
                Propósito e ESG
              </p>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-none mb-3">
                FourLives
              </h2>
              <p className="text-lg text-foursys-primary font-semibold mb-2">
                Tecnologia que transforma vidas
              </p>
              <p className="text-foursys-text-muted max-w-xl leading-relaxed text-sm">
                Para a Foursys, tecnologia é meio, não fim. O FourLives é nosso programa de impacto social que conecta
                capacitação, inclusão e sustentabilidade — porque escolher um parceiro de tecnologia também é escolher
                um parceiro de propósito.
              </p>
            </div>

            {/* Stats compactos */}
            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              {impactStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="p-4 rounded-xl bg-foursys-surface/40 border border-white/[0.08] text-center min-w-[130px]"
                >
                  <div className="mb-1"><DynIcon name={stat.icon} size={24} className="text-foursys-primary" /></div>
                  <div className="text-xl font-black text-foursys-primary">{stat.value}</div>
                  <div className="text-[10px] text-foursys-text-dim mt-0.5 leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-6 h-px bg-gradient-to-r from-green-500/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* ── 3 Frentes de impacto ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-8 md:mb-10">
          {fronts.map((front, i) => (
            <motion.div
              key={front.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
              className={`p-6 rounded-2xl bg-gradient-to-br ${front.bg} border ${front.border} flex flex-col`}
            >
              <div className="mb-3"><DynIcon name={front.icon} size={28} className="text-white/80" /></div>
              <h3 className="text-lg font-black text-white mb-3">{front.title}</h3>
              <p className="text-sm text-foursys-text-muted leading-relaxed mb-4 flex-1">
                {front.description}
              </p>
              <ul className="space-y-1.5">
                {front.highlights.map(h => (
                  <li key={h} className="flex items-start gap-2 text-xs text-foursys-text-muted">
                    <span style={{ color: front.color }} className="flex-shrink-0 mt-0.5">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ── CTA Premiações ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-2 pt-6 border-t border-white/[0.06]"
        >
          <button
            type="button"
            onClick={() => navigate('awards')}
            className="w-full flex items-center justify-between p-5 rounded-xl bg-foursys-surface/30 border border-white/[0.08] hover:border-foursys-primary/30 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <DynIcon name="award" size={24} className="text-foursys-primary" />
              <div className="text-left">
                <div className="text-sm font-bold text-white">Premiações & Certificações</div>
                <div className="text-[11px] text-foursys-text-muted mt-0.5">
                  GPTW, Agilidade Brasil, 100 Open Startups, ISO 9001, 27001 e mais
                </div>
              </div>
            </div>
            <ArrowRight size={18} className="text-foursys-text-dim group-hover:text-foursys-primary transition-colors" />
          </button>
        </motion.div>

      </div>
    </SectionWrapper>
  )
}
