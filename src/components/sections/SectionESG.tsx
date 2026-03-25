import { motion } from 'framer-motion'
import { SectionWrapper } from '../ui/SectionWrapper'

// ─── Dados FourLives ──────────────────────────────────────────────────────────

const impactStats = [
  { value: '3.000+', label: 'Vidas impactadas', icon: '❤️' },
  { value: '1',      label: 'Árvore plantada por profissional/ano', icon: '🌳' },
  { value: '3',      label: 'Frentes de impacto social', icon: '🎯' },
  { value: '26',     label: 'Anos de responsabilidade ESG', icon: '📅' },
]

const fronts = [
  {
    id: 'capacitacao',
    icon: '🎓',
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
    icon: '🤝',
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
    icon: '🌱',
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

const recognitions = [
  { title: 'Great Place to Work', subtitle: '3,6% turnover — referência no setor', icon: '⭐' },
  { title: 'Prêmio Agilidade Brasil', subtitle: '2024 e 2025 — premiação consecutiva', icon: '🏆' },
  { title: '100 Open Startups', subtitle: 'Top ranking 2023 e 2024', icon: '🚀' },
  { title: 'Colaborar para Inovar', subtitle: '2020, 2022, 2023 e 2024', icon: '🤝' },
]

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionESG() {
  return (
    <SectionWrapper>
      <div className="px-8 py-10 max-w-6xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-blue mb-2">
                Propósito e ESG
              </p>
              <h2 className="text-4xl font-black text-white leading-none mb-3">
                FourLives
              </h2>
              <p className="text-lg text-foursys-blue font-semibold mb-2">
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
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-xl font-black text-foursys-blue">{stat.value}</div>
                  <div className="text-[10px] text-foursys-text-dim mt-0.5 leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-6 h-px bg-gradient-to-r from-green-500/30 via-white/[0.06] to-transparent" />
        </motion.div>

        {/* ── 3 Frentes de impacto ── */}
        <div className="grid grid-cols-3 gap-5 mb-10">
          {fronts.map((front, i) => (
            <motion.div
              key={front.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
              className={`p-6 rounded-2xl bg-gradient-to-br ${front.bg} border ${front.border} flex flex-col`}
            >
              <div className="text-3xl mb-3">{front.icon}</div>
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

        {/* ── Reconhecimentos ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-foursys-text-dim mb-4">
            Premiações e Reconhecimentos
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {recognitions.map((rec, i) => (
              <motion.div
                key={rec.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                className="p-4 rounded-xl bg-foursys-surface/30 border border-white/[0.08] flex gap-3 items-start"
              >
                <span className="text-xl flex-shrink-0">{rec.icon}</span>
                <div>
                  <div className="text-xs font-bold text-foursys-text">{rec.title}</div>
                  <div className="text-[10px] text-foursys-text-dim mt-0.5 leading-snug">{rec.subtitle}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Certificações ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-6 border-t border-white/[0.06]"
        >
          <p className="text-xs text-foursys-text-dim text-center mb-4 uppercase tracking-[0.14em]">
            Certificações que reforçam nosso compromisso
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {['ISO 9001', 'ISO 27001', 'ISO 27701', 'ISO 14001', 'SAFe', 'GPTW', 'Agilidade Brasil', '100 Open Startups'].map(cert => (
              <span
                key={cert}
                className="text-xs px-3 py-1.5 rounded-full border border-white/[0.1] text-foursys-text-muted font-medium"
              >
                {cert}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </SectionWrapper>
  )
}
