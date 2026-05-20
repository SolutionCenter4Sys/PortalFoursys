import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import {
  Newspaper, Linkedin, Instagram, Globe, ExternalLink,
  Users, Award, ShieldCheck, Play, Tv, Mic, Calendar, TrendingUp,
} from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { CertificationBadge } from '../ui/CertificationBadge'
import { useLanguage } from '../../i18n'

// ─── i18n local (padrão SectionESG) ───────────────────────────────────────────

interface KpiItem { value: string; label: string; subtitle?: string; icon: React.ReactNode }
interface ChannelItem { id: string; name: string; handle: string; url: string; icon: React.ReactNode; color: string; description?: string }
type MediaType = 'video' | 'tv' | 'live' | 'event' | 'press' | 'investment'
interface MediaCoverageItem {
  id: string
  title: string
  outlet: string
  description: string
  /** YouTube ID — gera thumbnail real do YouTube (1ª prioridade na MediaThumb). */
  youtubeId?: string
  /** Imagem externa/local (logo, screenshot, frame) — 2ª prioridade na MediaThumb.
   *  Pode apontar para `/media/<arquivo>.png` (em `public/`) ou para uma URL pública. */
  imageUrl?: string
  /** URL externa para click (notícia, evento, canal). Quando ausente, mas há youtubeId, abre `youtu.be/<id>`. */
  url?: string
  /** Tipo de mídia — define cor + ícone do placeholder quando não há youtubeId/imageUrl. */
  mediaType?: MediaType
}
interface MediaCoverageGroup { id: string; title: string; subtitle?: string; items: MediaCoverageItem[] }
interface AwardEntry { name: string; years: string }

interface MediaContent {
  badge: string
  title: string
  subtitle: string
  hero: { headline: string; description: string }
  kpis: KpiItem[]
  channels: { sites: ChannelItem[]; socials: ChannelItem[] }
  coverage: MediaCoverageGroup[]
  awards: { title: string; subtitle: string; gptwTitle: string; gptwDescription: string; entries: AwardEntry[] }
  certifications: { title: string; subtitle: string; items: string[]; legacy: string }
}

const CONTENT: Record<'pt' | 'en', MediaContent> = {
  pt: {
    badge: 'Foursys na Mídia',
    title: 'Reconhecimento, cobertura editorial e presença digital',
    subtitle: '26 anos de marca consolidada — premiações continuadas, cobertura recorrente em mídia especializada e 373 mil seguidores acompanhando nossas frentes de inovação.',
    hero: {
      headline: '26 anos de marca consolidada',
      description: 'Reconhecimento contínuo de mercado, cobertura editorial em veículos especializados e uma presença digital ativa que aproxima a Foursys de clientes, parceiros e talentos em quatro regiões do globo.',
    },
    kpis: [
      { value: '5', label: 'Anos consecutivos', subtitle: 'GPTW®',                              icon: <Award size={22} /> },
      { value: '6', label: 'Premiações no último ano', subtitle: 'Inovação · Agilidade · ESG', icon: <Award size={22} /> },
      { value: '373k+', label: 'Seguidores',          subtitle: 'LinkedIn corporativo',         icon: <Users size={22} /> },
      { value: '12+',   label: 'Veículos & mídias',   subtitle: 'Cobertura 2025–2026 + lives',  icon: <Newspaper size={22} /> },
    ],
    channels: {
      sites: [
        { id: 'br',      name: 'foursys.com.br',         handle: 'Site institucional · BR',     url: 'https://www.foursys.com.br',         icon: <Globe size={18} />,    color: '#FF6600' },
        { id: 'pt',      name: 'foursys.pt',             handle: 'Hub Europa',                  url: 'https://www.foursys.pt',             icon: <Globe size={18} />,    color: '#8B5CF6' },
        { id: 'academy', name: 'academy.foursys.com',    handle: 'FourCamp · Capacitação',       url: 'https://academy.foursys.com',        icon: <Globe size={18} />,    color: '#4ADE80' },
        { id: 'linktr',  name: 'linktr.ee/foursys',      handle: 'Hub de redes sociais',         url: 'https://linktr.ee/foursys',          icon: <Globe size={18} />,    color: '#06B6D4' },
      ],
      socials: [
        { id: 'linkedin',  name: 'LinkedIn',  handle: '@foursys',          url: 'https://www.linkedin.com/company/foursys',  icon: <Linkedin size={18} />,  color: '#0A66C2', description: '373k+ seguidores' },
        { id: 'instagram', name: 'Instagram', handle: '@foursysoficial',   url: 'https://www.instagram.com/foursysoficial',   icon: <Instagram size={18} />, color: '#E1306C', description: 'Bastidores · cultura · talentos' },
      ],
    },
    coverage: [
      {
        id: 'br',
        title: 'Brasil · Mídia especializada',
        subtitle: 'Cobertura editorial 2025–2026 em veículos B2B e tecnologia',
        items: [
          { id: 'ti-inside',   title: 'Novo CISO Gabriel Loschi',     outlet: 'TI Inside',       description: 'Movimentação executiva da área de Cibersegurança Foursys.' },
          { id: 'it-section',  title: 'FourCamp Inclusion PcD',       outlet: 'IT Section',      description: 'Reportagem sobre o programa de inclusão profissional de PcDs.' },
          { id: 'it-forum',    title: 'Movimentações de execs',       outlet: 'IT Forum',        description: 'Cobertura recorrente das nomeações e expansão do C-level Foursys.' },
          { id: 'ponto-isp',   title: '400+ contratações em TI',     outlet: 'Ponto ISP',       description: 'Plano de expansão de equipes e impacto no ecossistema brasileiro.' },
          { id: 'ti-bahia',    title: 'Parceria Educ360°',            outlet: 'TI Bahia',        description: 'Capacitação técnica regional em parceria com instituições educacionais.' },
          { id: 'jornal-bras', title: 'Febraban Tech 2025',           outlet: 'Jornal do Brás', description: 'Presença Foursys no maior evento de tecnologia financeira do Brasil.' },
        ],
      },
      {
        id: 'eu',
        title: 'Europa · Cobertura internacional',
        subtitle: 'Imprensa portuguesa cobrindo a expansão europeia',
        items: [
          { id: 'executive',  title: '€2,1M Portugal',                outlet: 'Executive Digest (Sapo)', description: 'Investimento Foursys em Portugal para reforço da operação europeia.' },
          { id: 'business-it', title: '€3M hub Lisboa (dez/25)',     outlet: 'Business-IT.pt',           description: 'Anúncio do hub europeu em Lisboa e plano de contratações 2026.' },
          { id: 'portugal-news', title: '€3M Europa — Ronaldo Rocha & Rafael Ostan', outlet: 'The Portugal News (nov/25)', description: 'Entrevista executiva sobre estratégia europeia e visão de longo prazo.' },
        ],
      },
      {
        id: 'inv',
        title: 'Investimento & Negócios',
        subtitle: 'Aportes, M&A e perfis em plataformas internacionais',
        items: [
          { id: 'stephubs',    title: 'Aporte StepHubs R$ 5,5M', outlet: 'Startupi · Fusões & Aquisições', description: 'Movimento de venture capital da Foursys no ecossistema de startups.', url: 'https://startupi.com.br/?s=foursys+stephubs', imageUrl: '/media/coverage/stephubs-investment.png', mediaType: 'investment' },
          { id: 'cbinsights',  title: 'Perfis Foursys ventures', outlet: 'CB Insights · Bounce Watch',    description: 'Foursys mapeada em plataformas globais de inteligência de mercado.',     url: 'https://www.cbinsights.com/company/foursys',  imageUrl: '/media/coverage/cbinsights-dashboard.png',  mediaType: 'press' },
        ],
      },
      {
        id: 'eventos',
        title: 'Eventos, Lives & Palestras',
        subtitle: 'Presença executiva em eventos, TV e conteúdo',
        items: [
          { id: 'febraban',    title: 'Febraban Tech 2025 · 9 palestrantes',         outlet: 'Evento',             description: 'Jones Costa, Juliana Ostan, Rodrigo Pedrosa, Sandra Figueiredo, Fulvio Mascara, Sergio Medeiros, Tiago Farias, Romulo Siqueira e Alexandre Ibrahim.', url: 'https://www.febrabantech.com.br/', imageUrl: '/media/coverage/febraban-tech.png',      mediaType: 'event' },
          { id: 'robos',       title: 'Robôs Troy & Maximus + Apple Vision Pro',     outlet: 'Febraban Tech 2025', description: 'Stand Foursys com demonstrações imersivas de robótica e XR aplicada.',                                                                              url: 'https://www.febrabantech.com.br/', imageUrl: '/media/coverage/robos-troy-maximus.png', mediaType: 'event' },
          { id: 'ai-festival', title: 'AI Festival Stats 2026',                      outlet: 'Evento',             description: 'Participação Foursys em painéis sobre IA aplicada a negócios.',                                                                                     url: 'https://www.foursys.com.br/',      imageUrl: '/media/coverage/ai-festival.png',     mediaType: 'event' },
          { id: 'bmc',         title: 'BM&C News · "New Deal" (ago/2023)',          outlet: 'TV',                 description: 'Genivaldo Teixeira (Dir. Negócios) sobre IA e tokenização.',                                                                                       youtubeId: 'Q_Ui4Xu2_nE',                                                                              mediaType: 'tv' },
          { id: 'rocketseat',  title: 'Rocketseat (2025) · Liderança 5.0',         outlet: 'Live',               description: 'Rodrigo Pedrosa (Head de Soluções e Delivery) sobre liderança em tecnologia.',                                                                       url: 'https://www.youtube.com/@rocketseat',  imageUrl: '/media/coverage/rocketseat-lideranca.png',  mediaType: 'live' },
        ],
      },
    ],
    awards: {
      title: 'Premiações no último ano',
      subtitle: 'Reconhecimentos contínuos em inovação, agilidade e ESG',
      gptwTitle: 'GPTW® · 5 anos consecutivos',
      gptwDescription: 'Empresa certificada Great Place to Work — cultura validada por pesquisa anônima dos colaboradores.',
      entries: [
        { name: 'Colaborar para Inovar',    years: '\u201920 · \u201922 · \u201923 · \u201924' },
        { name: 'Agilidade Brasil',         years: '\u201924 · \u201925' },
        { name: '100 Open Startups',        years: '\u201923 · \u201924' },
        { name: 'Saúde Emocional · Jungle', years: '\u201922' },
      ],
    },
    certifications: {
      title: 'Certificações vigentes',
      subtitle: 'Trajetória ininterrupta de qualidade e segurança',
      items: ['ISO 9001', 'ISO 27001', 'ISO 27701', 'ISO 14001', 'SAFe'],
      legacy: 'Histórico: CMM 1 → 2 → 3 · Métodos Ágeis desde 2010',
    },
  },
  en: {
    badge: 'Foursys in the Media',
    title: 'Recognition, editorial coverage and digital presence',
    subtitle: '26 years of consolidated brand — continuous awards, recurring coverage in specialized media and 373k followers tracking our innovation fronts.',
    hero: {
      headline: '26 years of consolidated brand',
      description: 'Continuous market recognition, editorial coverage in specialized outlets and an active digital presence that brings Foursys closer to clients, partners and talents across four global regions.',
    },
    kpis: [
      { value: '5',     label: 'Consecutive years',     subtitle: 'GPTW®',                            icon: <Award size={22} /> },
      { value: '6',     label: 'Awards in the last year', subtitle: 'Innovation · Agility · ESG',     icon: <Award size={22} /> },
      { value: '373k+', label: 'Followers',             subtitle: 'Corporate LinkedIn',               icon: <Users size={22} /> },
      { value: '12+',   label: 'Outlets & media',       subtitle: '2025–2026 coverage + lives',       icon: <Newspaper size={22} /> },
    ],
    channels: {
      sites: [
        { id: 'br',      name: 'foursys.com.br',         handle: 'Institutional site · BR',  url: 'https://www.foursys.com.br',         icon: <Globe size={18} />,  color: '#FF6600' },
        { id: 'pt',      name: 'foursys.pt',             handle: 'Europe hub',                url: 'https://www.foursys.pt',             icon: <Globe size={18} />,  color: '#8B5CF6' },
        { id: 'academy', name: 'academy.foursys.com',    handle: 'FourCamp · Training',        url: 'https://academy.foursys.com',        icon: <Globe size={18} />,  color: '#4ADE80' },
        { id: 'linktr',  name: 'linktr.ee/foursys',      handle: 'Social hub',                 url: 'https://linktr.ee/foursys',          icon: <Globe size={18} />,  color: '#06B6D4' },
      ],
      socials: [
        { id: 'linkedin',  name: 'LinkedIn',  handle: '@foursys',          url: 'https://www.linkedin.com/company/foursys',  icon: <Linkedin size={18} />,  color: '#0A66C2', description: '373k+ followers' },
        { id: 'instagram', name: 'Instagram', handle: '@foursysoficial',   url: 'https://www.instagram.com/foursysoficial',   icon: <Instagram size={18} />, color: '#E1306C', description: 'Behind the scenes · culture · talent' },
      ],
    },
    coverage: [
      {
        id: 'br',
        title: 'Brazil · Specialized media',
        subtitle: 'Editorial coverage 2025–2026 in B2B and technology outlets',
        items: [
          { id: 'ti-inside',   title: 'New CISO Gabriel Loschi',        outlet: 'TI Inside',       description: 'Executive movement in the Foursys Cybersecurity practice.' },
          { id: 'it-section',  title: 'FourCamp Inclusion PwD',         outlet: 'IT Section',      description: 'Feature about the professional inclusion program for People with Disabilities.' },
          { id: 'it-forum',    title: 'Executive movements',            outlet: 'IT Forum',        description: 'Recurring coverage of C-level appointments and Foursys expansion.' },
          { id: 'ponto-isp',   title: '400+ IT hires',                  outlet: 'Ponto ISP',       description: 'Team expansion plan and impact on the Brazilian IT ecosystem.' },
          { id: 'ti-bahia',    title: 'Educ360° partnership',            outlet: 'TI Bahia',        description: 'Regional technical training in partnership with educational institutions.' },
          { id: 'jornal-bras', title: 'Febraban Tech 2025',             outlet: 'Jornal do Brás', description: 'Foursys presence at Brazil\'s largest financial technology event.' },
        ],
      },
      {
        id: 'eu',
        title: 'Europe · International coverage',
        subtitle: 'Portuguese press covering the European expansion',
        items: [
          { id: 'executive',     title: '€2.1M Portugal',                                          outlet: 'Executive Digest (Sapo)',     description: 'Foursys investment in Portugal to reinforce European operations.' },
          { id: 'business-it',   title: '€3M Lisbon hub (Dec/25)',                                outlet: 'Business-IT.pt',               description: 'Announcement of the Lisbon European hub and 2026 hiring plan.' },
          { id: 'portugal-news', title: '€3M Europe — Ronaldo Rocha & Rafael Ostan',              outlet: 'The Portugal News (Nov/25)',  description: 'Executive interview about European strategy and long-term vision.' },
        ],
      },
      {
        id: 'inv',
        title: 'Investment & Business',
        subtitle: 'Funding, M&A and profiles on international platforms',
        items: [
          { id: 'stephubs',    title: 'StepHubs R$5.5M investment', outlet: 'Startupi · Fusões & Aquisições', description: 'Foursys venture capital movement in the startup ecosystem.', url: 'https://startupi.com.br/?s=foursys+stephubs', imageUrl: '/media/coverage/stephubs-investment.png', mediaType: 'investment' },
          { id: 'cbinsights',  title: 'Foursys ventures profiles',  outlet: 'CB Insights · Bounce Watch',    description: 'Foursys mapped on global market intelligence platforms.',  url: 'https://www.cbinsights.com/company/foursys',  imageUrl: '/media/coverage/cbinsights-dashboard.png',  mediaType: 'press' },
        ],
      },
      {
        id: 'eventos',
        title: 'Events, Lives & Talks',
        subtitle: 'Executive presence at events, TV and content',
        items: [
          { id: 'febraban',    title: 'Febraban Tech 2025 · 9 speakers',           outlet: 'Event',              description: 'Jones Costa, Juliana Ostan, Rodrigo Pedrosa, Sandra Figueiredo, Fulvio Mascara, Sergio Medeiros, Tiago Farias, Romulo Siqueira and Alexandre Ibrahim.', url: 'https://www.febrabantech.com.br/', imageUrl: '/media/coverage/febraban-tech.png',      mediaType: 'event' },
          { id: 'robos',       title: 'Troy & Maximus robots + Apple Vision Pro', outlet: 'Febraban Tech 2025', description: 'Foursys booth with immersive robotics and applied XR demonstrations.',                                                                                url: 'https://www.febrabantech.com.br/', imageUrl: '/media/coverage/robos-troy-maximus.png', mediaType: 'event' },
          { id: 'ai-festival', title: 'AI Festival Stats 2026',                   outlet: 'Event',              description: 'Foursys participation in panels about applied AI for business.',                                                                                       url: 'https://www.foursys.com.br/',      imageUrl: '/media/coverage/ai-festival.png',     mediaType: 'event' },
          { id: 'bmc',         title: 'BM&C News · "New Deal" (Aug/2023)',        outlet: 'TV',                 description: 'Genivaldo Teixeira (Business Director) on AI and tokenization.',                                                                                      youtubeId: 'Q_Ui4Xu2_nE',                                                                              mediaType: 'tv' },
          { id: 'rocketseat',  title: 'Rocketseat (2025) · Leadership 5.0',      outlet: 'Live',               description: 'Rodrigo Pedrosa (Head of Solutions & Delivery) on leadership in technology.',                                                                          url: 'https://www.youtube.com/@rocketseat', imageUrl: '/media/coverage/rocketseat-lideranca.png',  mediaType: 'live' },
        ],
      },
    ],
    awards: {
      title: 'Awards in the last year',
      subtitle: 'Continuous recognition in innovation, agility and ESG',
      gptwTitle: 'GPTW® · 5 consecutive years',
      gptwDescription: 'Great Place to Work-certified company — culture validated by anonymous employee surveys.',
      entries: [
        { name: 'Colaborar para Inovar',    years: '\u201920 · \u201922 · \u201923 · \u201924' },
        { name: 'Agilidade Brasil',         years: '\u201924 · \u201925' },
        { name: '100 Open Startups',        years: '\u201923 · \u201924' },
        { name: 'Saúde Emocional · Jungle', years: '\u201922' },
      ],
    },
    certifications: {
      title: 'Active certifications',
      subtitle: 'Uninterrupted journey of quality and security',
      items: ['ISO 9001', 'ISO 27001', 'ISO 27701', 'ISO 14001', 'SAFe'],
      legacy: 'Legacy: CMM 1 → 2 → 3 · Agile methods since 2010',
    },
  },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

// Mapa de tipo de mídia → cor + ícone para o placeholder, quando não há youtubeId.
const MEDIA_TYPE_STYLE: Record<MediaType, { color: string; icon: React.ReactNode }> = {
  video:      { color: '#FF0000', icon: <Play size={20} fill="currentColor" /> },
  tv:         { color: '#0066CC', icon: <Tv size={20} /> },
  live:       { color: '#8B5CF6', icon: <Mic size={20} /> },
  event:      { color: '#FF6600', icon: <Calendar size={20} /> },
  press:      { color: '#06B6D4', icon: <Newspaper size={20} /> },
  investment: { color: '#22C55E', icon: <TrendingUp size={20} /> },
}

/**
 * Mini-thumbnail (estilo ESG, mas compacta) para itens de cobertura midiática.
 * Prioridade visual:
 *  1. `youtubeId`  → thumbnail real do YouTube (hqdefault) + overlay Play (igual ESG).
 *  2. `imageUrl`   → imagem externa (logo da fonte, foto, screenshot).
 *  3. fallback     → placeholder colorido com ícone do mediaType.
 *
 * Se `imageUrl` falhar (404/CORS), cai para o placeholder via `onError`.
 */
function MediaThumb({ item }: { item: MediaCoverageItem }) {
  const [imgErrored, setImgErrored] = useState(false)
  const style = MEDIA_TYPE_STYLE[item.mediaType ?? 'video']

  if (item.youtubeId) {
    return (
      <div className="relative w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-black/40 border border-white/10 group-hover:border-white/30 transition-colors">
        <img
          src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center text-white/95">
          <Play size={18} fill="currentColor" />
        </div>
      </div>
    )
  }

  if (item.imageUrl && !imgErrored) {
    return (
      <div className="relative w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-black/40 border border-white/10 group-hover:border-white/30 transition-colors">
        <img
          src={item.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgErrored(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/20 transition-colors" />
        {(item.mediaType === 'tv' || item.mediaType === 'live' || item.mediaType === 'video') && (
          <div className="absolute inset-0 flex items-center justify-center text-white/95 drop-shadow-lg">
            <Play size={18} fill="currentColor" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className="relative w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden flex-shrink-0 border flex items-center justify-center transition-colors"
      style={{
        background: `linear-gradient(135deg, ${style.color}33 0%, ${style.color}10 100%)`,
        borderColor: `${style.color}55`,
        color: style.color,
      }}
    >
      {style.icon}
    </div>
  )
}

function ChannelCard({ ch }: { ch: ChannelItem }) {
  return (
    <a
      href={ch.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-xl border border-white/10 bg-foursys-surface/40 hover:border-white/25 transition-colors p-3 flex items-center gap-3"
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${ch.color}1a`, border: `1px solid ${ch.color}3a`, color: ch.color }}
      >
        {ch.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-white truncate">{ch.name}</div>
        <div className="text-[11px] text-foursys-text-dim truncate">{ch.handle}</div>
        {ch.description && (
          <div className="text-[10px] text-foursys-text-dim/80 mt-0.5 truncate">{ch.description}</div>
        )}
      </div>
      <ExternalLink size={14} className="text-foursys-text-dim/60 group-hover:text-foursys-primary transition-colors flex-shrink-0" />
    </a>
  )
}

function CoverageItemRow({ item }: { item: MediaCoverageItem }) {
  const hasMedia = Boolean(item.youtubeId || item.url)
  const href = item.youtubeId ? `https://youtu.be/${item.youtubeId}` : item.url

  const body = (
    <>
      {hasMedia && <MediaThumb item={item} />}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <div className="text-sm font-bold text-white leading-snug">
            {item.title}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-foursys-text-dim flex-shrink-0">
            {item.outlet}
          </div>
        </div>
        <p className="text-xs text-foursys-text-dim leading-relaxed">{item.description}</p>
      </div>
      {hasMedia && (
        <ExternalLink
          size={14}
          className="text-foursys-text-dim/50 group-hover:text-foursys-primary transition-colors flex-shrink-0 mt-1"
        />
      )}
    </>
  )

  if (hasMedia && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-3 px-4 md:px-5 py-3 hover:bg-white/[0.03] transition-colors"
      >
        {body}
      </a>
    )
  }

  return (
    <div className="flex items-start gap-3 px-4 md:px-5 py-3">
      {body}
    </div>
  )
}

function CoverageCard({ group }: { group: MediaCoverageGroup }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-foursys-surface/40 overflow-hidden">
      <div className="p-4 md:p-5 border-b border-white/[0.06]">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-foursys-primary mb-1">
          {group.title}
        </div>
        {group.subtitle && (
          <div className="text-xs text-foursys-text-dim leading-relaxed">{group.subtitle}</div>
        )}
      </div>
      <div className="divide-y divide-white/[0.05]">
        {group.items.map(item => (
          <CoverageItemRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

// IDs de cobertura promovidos a "destaques" (renderizados próximos ao topo).
// Os demais (Brasil, Europa) ficam no bloco "Cobertura editorial" mais abaixo.
const FEATURED_COVERAGE_IDS = new Set(['inv', 'eventos'])

export function SectionMedia() {
  const { lang } = useLanguage()
  const c = useMemo(() => CONTENT[lang], [lang])

  const featuredCoverage = useMemo(
    () => c.coverage.filter(g => FEATURED_COVERAGE_IDS.has(g.id)),
    [c.coverage],
  )
  const editorialCoverage = useMemo(
    () => c.coverage.filter(g => !FEATURED_COVERAGE_IDS.has(g.id)),
    [c.coverage],
  )

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-primary/15 border border-foursys-primary/30 text-foursys-cyan text-sm mb-4">
            <Newspaper size={14} /> {c.badge}
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-3">
            {c.title}
          </h2>
          <p className="text-base md:text-lg text-foursys-text-muted max-w-3xl mx-auto leading-relaxed">
            {c.subtitle}
          </p>
        </motion.div>

        {/* ── KPIs ── */}
        <div
          data-voz-caixa="media-kpis"
          data-voz-caixa-secao="media"
          data-voz-caixa-rotulo={c.title}
          tabIndex={-1}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10 focus:outline-none"
        >
          {c.kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.07 }}
              className="rounded-2xl border border-white/10 bg-foursys-surface/40 p-4 md:p-5 flex flex-col items-center text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-foursys-primary/15 border border-foursys-primary/30 text-foursys-primary flex items-center justify-center mb-2">
                {k.icon}
              </div>
              <div className="text-2xl md:text-3xl font-black text-white leading-none">{k.value}</div>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-foursys-primary mt-2">
                {k.label}
              </div>
              {k.subtitle && (
                <div className="text-[10px] text-foursys-text-dim mt-1 leading-tight">{k.subtitle}</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* ── Hero block ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-foursys-primary/30 bg-gradient-to-br from-foursys-primary/12 via-foursys-primary/4 to-transparent p-5 md:p-6 mb-8 md:mb-10"
        >
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-primary mb-2">
            {c.hero.headline}
          </div>
          <p className="text-sm md:text-base text-foursys-text leading-relaxed">{c.hero.description}</p>
        </motion.div>

        {/* ── [PROMOVIDO] GPTW + Premiações no último ano ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-4 md:gap-5 mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/12 via-emerald-600/4 to-transparent p-5"
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 mb-1">
              {c.awards.gptwTitle}
            </div>
            <p className="text-sm text-foursys-text-muted leading-relaxed">{c.awards.gptwDescription}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-foursys-primary/30 bg-gradient-to-br from-foursys-primary/10 via-foursys-primary/4 to-transparent p-5"
          >
            <div className="flex items-center gap-2 mb-1">
              <Award size={16} className="text-foursys-primary" />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.14em]">
                {c.awards.title}
              </h3>
            </div>
            <p className="text-[11px] text-foursys-text-dim mb-3">{c.awards.subtitle}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {c.awards.entries.map(e => (
                <li key={e.name} className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5">
                  <div className="text-sm font-bold text-white leading-tight">{e.name}</div>
                  <div className="text-[11px] text-foursys-text-dim mt-0.5">{e.years}</div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ── Galeria de troféus (evidência visual das premiações) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10"
        >
          <figure className="group relative rounded-2xl overflow-hidden border border-white/10 bg-foursys-surface/30 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            <div className="aspect-[3/2] overflow-hidden">
              <img
                src="/media/awards/trofeus-vitrine.png"
                alt={lang === 'pt' ? 'Vitrine de troféus institucionais Foursys' : 'Foursys institutional trophy showcase'}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-foursys-primary mb-0.5">
                {lang === 'pt' ? 'Vitrine institucional' : 'Institutional showcase'}
              </div>
              <p className="text-xs text-white/90 leading-snug">
                {lang === 'pt'
                  ? 'Coleção Foursys: Colaborar p/ Inovar, Agilidade Brasil, 100 Open Startups e Saúde Emocional.'
                  : 'Foursys collection: Colaborar p/ Inovar, Agilidade Brasil, 100 Open Startups and Emotional Health.'}
              </p>
            </figcaption>
          </figure>

          <figure className="group relative rounded-2xl overflow-hidden border border-white/10 bg-foursys-surface/30 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            <div className="aspect-[3/2] overflow-hidden">
              <img
                src="/media/awards/trofeus-agilidade.png"
                alt={lang === 'pt' ? 'Troféus Agilidade Brasil 2024 e 2025 + 100 Open Startups' : 'Agilidade Brasil 2024 and 2025 trophies + 100 Open Startups'}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-foursys-primary mb-0.5">
                {lang === 'pt' ? 'Agilidade Brasil 2024 · 2025' : 'Agilidade Brasil 2024 · 2025'}
              </div>
              <p className="text-xs text-white/90 leading-snug">
                {lang === 'pt'
                  ? 'Destaque Foursys em duas edições consecutivas + reconhecimentos 100 Open Startups.'
                  : 'Foursys highlight in two consecutive editions + 100 Open Startups recognitions.'}
              </p>
            </figcaption>
          </figure>
        </motion.div>

        {/* ── [PROMOVIDO] Investimento & Negócios + Eventos, Lives & Palestras ── */}
        {featuredCoverage.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-8 md:mb-10">
            {featuredCoverage.map(g => (
              <CoverageCard key={g.id} group={g} />
            ))}
          </div>
        )}

        {/* ── Sites + Redes Sociais ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-8 md:mb-10">
          <div className="rounded-2xl border border-white/10 bg-foursys-surface/30 p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Globe size={16} className="text-foursys-primary" />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.14em]">
                {lang === 'pt' ? 'Sites institucionais' : 'Institutional sites'}
              </h3>
            </div>
            <div className="space-y-2">
              {c.channels.sites.map(s => <ChannelCard key={s.id} ch={s} />)}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-foursys-surface/30 p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Linkedin size={16} className="text-foursys-primary" />
              <h3 className="text-sm font-black text-white uppercase tracking-[0.14em]">
                {lang === 'pt' ? 'Redes sociais' : 'Social media'}
              </h3>
            </div>
            <div className="space-y-2">
              {c.channels.socials.map(s => <ChannelCard key={s.id} ch={s} />)}
            </div>
          </div>
        </div>

        {/* ── Cobertura editorial (Brasil + Europa) ── */}
        {editorialCoverage.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-8 md:mb-10">
            {editorialCoverage.map(g => (
              <CoverageCard key={g.id} group={g} />
            ))}
          </div>
        )}

        {/* ── Certificações ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-white/10 bg-foursys-surface/30 p-5 md:p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={16} className="text-foursys-primary" />
            <h3 className="text-sm font-black text-white uppercase tracking-[0.14em]">
              {c.certifications.title}
            </h3>
          </div>
          <p className="text-[11px] text-foursys-text-dim mb-4">{c.certifications.subtitle}</p>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {c.certifications.items.map(cert => (
              <CertificationBadge key={cert} label={cert} size="sm" />
            ))}
          </div>
          <p className="text-[11px] text-foursys-text-dim italic">{c.certifications.legacy}</p>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
