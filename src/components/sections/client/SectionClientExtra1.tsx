import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import { useLanguage } from '../../../i18n'
import { SectionWrapper } from '../../ui/SectionWrapper'
import { InterestButton } from '../../ui/InterestButton'
import { ClientBackButton } from './ClientBackButton'
import { getClientById } from '../../../data/clients'

// ─── Tipos para os dados de extra1 do Quality IA ─────────────────────────────

interface QualityPhase {
  id: string
  title: string
  description: string
  icon: string
}

interface QualityMetric {
  value: string
  label: string
}

interface QualityIAContent {
  phases: QualityPhase[]
  metrics: QualityMetric[]
}

// ─── Tipos para conteúdo de links (ex.: IT Forum) ───────────────────────────

interface LinkItem {
  title: string
  url: string
  description: string
  icon: string
}

interface EventInfo {
  name: string
  dates: string
  location: string
  city: string
}

interface LinksContent {
  links: LinkItem[]
  eventInfo?: EventInfo
}

function isLinksContent(c: unknown): c is LinksContent {
  return (
    typeof c === 'object' &&
    c !== null &&
    'links' in c &&
    Array.isArray((c as LinksContent).links)
  )
}

function isQualityContent(c: unknown): c is QualityIAContent {
  return (
    typeof c === 'object' &&
    c !== null &&
    'metrics' in c &&
    Array.isArray((c as QualityIAContent).metrics)
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionClientExtra1() {
  const { state } = useApp()
  const { t } = useLanguage()
  const client = state.activeClientId ? getClientById(state.activeClientId) : null

  if (!client?.extra1) return null

  const { title, subtitle, content } = client.extra1
  const clientColor = client.colors.primary

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-5xl mx-auto">

        {/* ── Voltar ── */}
        <ClientBackButton clientName={client.name} color={clientColor} />

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit mb-4"
            style={{ borderColor: `${clientColor}40`, backgroundColor: `${clientColor}12`, color: clientColor }}
          >
            <span className="text-sm">⚡</span>
            <span className="text-sm font-semibold">{client.name}</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-black text-white leading-none mb-3">{title}</h2>
          <p className="text-foursys-text-muted text-base max-w-2xl leading-relaxed">{subtitle}</p>
          <div className="mt-4">
            <InterestButton section="client-extra-1" />
          </div>

          <div
            className="mt-6 h-px"
            style={{
              background: `linear-gradient(to right, ${clientColor}50, rgba(255,255,255,0.06), transparent)`,
            }}
          />
        </motion.div>

        {/* ── Links + Event Info (IT Forum style) ── */}
        {isLinksContent(content) && (
          <>
            {content.eventInfo && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 p-6 rounded-2xl border border-white/[0.08] bg-foursys-surface/40"
                style={{ borderLeftWidth: 3, borderLeftColor: clientColor }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {[
                    { label: '📅', value: content.eventInfo.dates },
                    { label: '📍', value: content.eventInfo.location },
                    { label: '🏙️', value: content.eventInfo.city },
                    { label: '🎯', value: content.eventInfo.name.split(' — ')[0] || content.eventInfo.name },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="text-2xl mb-1">{item.label}</div>
                      <div className="text-xs text-foursys-text-muted leading-snug">{item.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.links.map((link, i) => (
                <motion.a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
                  className="group p-5 rounded-2xl border border-white/[0.08] bg-foursys-surface/30 hover:border-white/20 hover:bg-foursys-surface/50 transition-all duration-300 flex gap-4 items-start cursor-pointer"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: `${clientColor}15`, border: `1px solid ${clientColor}30` }}
                  >
                    {link.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-foursys-text truncate">{link.title}</h3>
                      <ExternalLink
                        size={12}
                        className="text-foursys-text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      />
                    </div>
                    <p className="text-xs text-foursys-text-muted leading-relaxed">{link.description}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </>
        )}

        {/* ── Quality IA content (phases + metrics) ── */}
        {isQualityContent(content) && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
              {content.metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-5 rounded-2xl border border-white/[0.08] bg-foursys-surface/40 text-center"
                >
                  <div className="text-3xl font-black mb-1" style={{ color: clientColor }}>
                    {m.value}
                  </div>
                  <div className="text-xs text-foursys-text-muted">{m.label}</div>
                </motion.div>
              ))}
            </div>

            {content.phases && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                {content.phases.map((phase, i) => (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    className="p-6 rounded-2xl border border-white/[0.08] bg-foursys-surface/30 flex gap-4"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${clientColor}15`, border: `1px solid ${clientColor}30` }}
                    >
                      {phase.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: clientColor }}
                        >
                          {t('clientSections.extra1.phase')} {i + 1}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-foursys-text mb-2">{phase.title}</h3>
                      <p className="text-xs text-foursys-text-muted leading-relaxed">{phase.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Fallback */}
        {!isLinksContent(content) && !isQualityContent(content) && (
          <div className="flex items-center justify-center h-48 text-foursys-text-muted text-sm">
            {t('clientSections.extra1.emptyState')}
          </div>
        )}
      </div>
    </SectionWrapper>
  )
}
