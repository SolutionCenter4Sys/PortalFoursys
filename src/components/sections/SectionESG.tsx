import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, X, ExternalLink, Tv, Accessibility } from 'lucide-react'
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

// ─── Vídeos FourCamp ──────────────────────────────────────────────────────────

const videos = [
  {
    id: 'fourcamp-bomdiasp',
    youtubeId: 'CmGlSnfF0_U',
    title: 'FourCamp no Bom Dia SP',
    subtitle: 'Rede Globo',
    description:
      'O programa FourCamp de capacitação tecnológica ganhou destaque no Bom Dia SP da Globo, mostrando como a Foursys transforma vidas por meio da educação em tecnologia.',
    icon: Tv,
    color: '#FF6600',
    accent: '#FF8833',
    gradient: 'from-orange-600 via-orange-500 to-amber-500',
    tags: ['Mídia Nacional', 'Capacitação', 'Impacto Social'],
  },
  {
    id: 'fourcamp-pcd',
    youtubeId: 'M2MyVNDLDTE',
    title: 'FourCamp PCD',
    subtitle: 'Programa de Inclusão',
    description:
      'O FourCamp PCD é o programa de capacitação e inserção profissional de Pessoas com Deficiência na área de tecnologia — inclusão que gera transformação real.',
    icon: Accessibility,
    color: '#8B5CF6',
    accent: '#A78BFA',
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-500',
    tags: ['Inclusão', 'PCD', 'Diversidade'],
  },
]

function VideoCard({
  video,
  index,
  onPlay,
}: {
  video: (typeof videos)[0]
  index: number
  onPlay: (id: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const Icon = video.icon
  const thumb = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.12, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`Assistir: ${video.title}`}
      onClick={() => onPlay(video.id)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPlay(video.id) } }}
    >
      {/* Thumbnail background */}
      <div className="absolute inset-0">
        <img
          src={thumb}
          alt=""
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: hovered ? 0.7 : 0.4 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `linear-gradient(135deg, ${video.color}40, transparent 60%)`,
        }}
      />

      {/* Animated top glow line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, transparent, ${video.color}, transparent)` }}
        animate={{ opacity: hovered ? 1 : 0.4, scaleX: hovered ? 1 : 0.5 }}
        transition={{ duration: 0.4 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between p-5 md:p-7 min-h-[280px] md:min-h-[320px]">
        {/* Top: badge + icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${video.color}30, ${video.color}10)`,
                border: `1px solid ${video.color}40`,
              }}
            >
              <Icon size={18} style={{ color: video.color }} />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
              style={{
                background: `${video.color}20`,
                color: video.color,
                border: `1px solid ${video.color}30`,
              }}
            >
              {video.subtitle}
            </span>
          </div>
          <motion.div
            animate={{ rotate: hovered ? 15 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ExternalLink size={16} className="text-white/30" />
          </motion.div>
        </div>

        {/* Center: play button */}
        <div className="flex items-center justify-center">
          <motion.div
            className="relative"
            animate={{
              scale: hovered ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Ripple rings */}
            {hovered && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${video.color}` }}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${video.color}` }}
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                />
              </>
            )}

            {/* Play circle */}
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-shadow duration-400"
              style={{
                background: `linear-gradient(135deg, ${video.color}, ${video.accent})`,
                boxShadow: hovered
                  ? `0 0 40px ${video.color}80, 0 0 80px ${video.color}40`
                  : `0 0 20px ${video.color}40`,
              }}
            >
              <Play
                size={28}
                className="text-white ml-1"
                fill="white"
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom: title + description + tags */}
        <div>
          <h3 className="text-lg md:text-xl font-black text-white mb-1.5 leading-tight">
            {video.title}
          </h3>
          <p className="text-xs md:text-sm text-white/60 leading-relaxed mb-3 line-clamp-2">
            {video.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {video.tags.map(tag => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.08] text-white/50"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom glow on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(ellipse 80% 100% at 50% 100%, ${video.color}25, transparent)`,
        }}
      />
    </motion.div>
  )
}

function VideoPlayerModal({
  video,
  onClose,
}: {
  video: (typeof videos)[0]
  onClose: () => void
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Vídeo: ${video.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative z-10 w-full max-w-4xl"
        aria-live="polite"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: `${video.color}25`,
                border: `1px solid ${video.color}40`,
              }}
            >
              <video.icon size={16} style={{ color: video.color }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{video.title}</h3>
              <p className="text-[11px] text-white/40">{video.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/[0.08] hover:bg-white/[0.15] active:scale-95 flex items-center justify-center transition-all min-h-[44px] min-w-[44px]"
            aria-label="Fechar vídeo"
          >
            <X size={18} className="text-white/70" />
          </button>
        </div>

        {/* Video embed */}
        <div
          className="relative rounded-2xl overflow-hidden border border-white/[0.1]"
          style={{
            boxShadow: `0 0 60px ${video.color}20, 0 25px 50px rgba(0,0,0,0.5)`,
          }}
        >
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionESG() {
  const { navigate } = useApp()
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const playingVideo = activeVideo ? videos.find(v => v.id === activeVideo) : null

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

        {/* ── Vídeos FourCamp ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mb-8 md:mb-10"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-foursys-primary/15 border border-foursys-primary/30 flex items-center justify-center">
              <Play size={16} className="text-foursys-primary ml-0.5" fill="currentColor" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">FourCamp na Mídia</h3>
              <p className="text-[11px] text-foursys-text-dim">Nosso impacto reconhecido em rede nacional</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {videos.map((video, i) => (
              <VideoCard
                key={video.id}
                video={video}
                index={i}
                onPlay={setActiveVideo}
              />
            ))}
          </div>
        </motion.div>

        {/* Video player modal */}
        <AnimatePresence>
          {playingVideo && (
            <VideoPlayerModal
              video={playingVideo}
              onClose={() => setActiveVideo(null)}
            />
          )}
        </AnimatePresence>

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
