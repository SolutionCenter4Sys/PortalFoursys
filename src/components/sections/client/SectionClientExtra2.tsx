import { motion } from 'framer-motion'
import { MapPin, Building2, TrendingUp, Users } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import { useLanguage } from '../../../i18n'
import { SectionWrapper } from '../../ui/SectionWrapper'
import { InterestButton } from '../../ui/InterestButton'
import { ClientBackButton } from './ClientBackButton'
import { getClientById } from '../../../data/clients'

interface SocialContact {
  name: string
  role: string
  company: string
  sector: string
  city: string
  revenue: string
  opportunities: number
  topOffer: string
  topScore: number
}

interface SocialSellingContent {
  contacts: SocialContact[]
}

function isSocialContent(c: unknown): c is SocialSellingContent {
  return (
    typeof c === 'object' &&
    c !== null &&
    'contacts' in c &&
    Array.isArray((c as SocialSellingContent).contacts)
  )
}

function getOpportunityColor(count: number) {
  if (count > 5) return { bg: 'rgba(16,185,129,0.15)', text: '#10b981', border: 'rgba(16,185,129,0.3)' }
  if (count > 0) return { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' }
  return { bg: 'rgba(107,114,128,0.15)', text: '#6b7280', border: 'rgba(107,114,128,0.3)' }
}

function getScoreColor(score: number) {
  if (score >= 80) return '#10b981'
  if (score >= 50) return '#3b82f6'
  if (score >= 30) return '#f59e0b'
  return '#6b7280'
}

export function SectionClientExtra2() {
  const { state } = useApp()
  const { t } = useLanguage()
  const client = state.activeClientId ? getClientById(state.activeClientId) : null

  if (!client?.extra2) return null

  const { title, subtitle, content } = client.extra2
  const clientColor = client.colors.primary

  if (!isSocialContent(content)) {
    return (
      <SectionWrapper>
        <div className="flex items-center justify-center h-48 text-foursys-text-muted text-sm">
          {t('common.loading')}
        </div>
      </SectionWrapper>
    )
  }

  const { contacts } = content
  const totalOpportunities = contacts.reduce((sum, c) => sum + c.opportunities, 0)
  const avgScore = Math.round(contacts.reduce((sum, c) => sum + c.topScore, 0) / contacts.length)

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto">

        <ClientBackButton clientName={client.name} color={clientColor} />

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border w-fit mb-4"
            style={{ borderColor: `${clientColor}40`, backgroundColor: `${clientColor}12`, color: clientColor }}
          >
            <Users size={14} />
            <span className="text-sm font-semibold">{client.name}</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-black text-white leading-none mb-3">{title}</h2>
          <p className="text-foursys-text-muted text-base max-w-2xl leading-relaxed">{subtitle}</p>
          <div className="mt-4">
            <InterestButton section="client-extra-2" />
          </div>

          <div
            className="mt-6 h-px"
            style={{
              background: `linear-gradient(to right, ${clientColor}50, rgba(255,255,255,0.06), transparent)`,
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          <div className="p-4 rounded-2xl border border-white/[0.08] bg-foursys-surface/40 text-center">
            <div className="text-2xl font-black" style={{ color: clientColor }}>{contacts.length}</div>
            <div className="text-xs text-foursys-text-muted">{t('clientSections.extra2.totalContacts')}</div>
          </div>
          <div className="p-4 rounded-2xl border border-white/[0.08] bg-foursys-surface/40 text-center">
            <div className="text-2xl font-black text-emerald-400">{totalOpportunities}</div>
            <div className="text-xs text-foursys-text-muted">{t('clientSections.extra2.totalOpportunities')}</div>
          </div>
          <div className="p-4 rounded-2xl border border-white/[0.08] bg-foursys-surface/40 text-center col-span-2 md:col-span-1">
            <div className="text-2xl font-black text-blue-400">{avgScore}</div>
            <div className="text-xs text-foursys-text-muted">{t('clientSections.extra2.avgScore')}</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact, i) => {
            const oppColor = getOpportunityColor(contact.opportunities)
            const scoreColor = getScoreColor(contact.topScore)

            return (
              <motion.div
                key={`${contact.name}-${contact.company}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.04, duration: 0.4 }}
                className="p-5 rounded-2xl border border-white/[0.08] bg-foursys-surface/30 hover:border-white/20 hover:bg-foursys-surface/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">{contact.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Building2 size={11} className="text-foursys-text-muted flex-shrink-0" />
                      <span className="text-xs text-foursys-text-muted truncate">
                        {contact.role} · {contact.company}
                      </span>
                    </div>
                  </div>
                  <div
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0"
                    style={{ backgroundColor: `${scoreColor}20`, color: scoreColor, border: `1px solid ${scoreColor}40` }}
                  >
                    {contact.topScore}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ backgroundColor: `${clientColor}15`, color: clientColor, border: `1px solid ${clientColor}30` }}
                  >
                    {contact.sector}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-foursys-text-muted border border-white/10">
                    <MapPin size={9} />
                    {contact.city}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {contact.revenue !== 'N/I' && contact.revenue !== 'N/A' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <TrendingUp size={9} />
                        {contact.revenue}
                      </span>
                    )}
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ backgroundColor: oppColor.bg, color: oppColor.text, border: `1px solid ${oppColor.border}` }}
                    >
                      {contact.opportunities} {t('clientSections.extra2.projects')}
                    </span>
                  </div>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold truncate max-w-[140px]"
                    style={{ backgroundColor: `${scoreColor}15`, color: scoreColor, border: `1px solid ${scoreColor}30` }}
                  >
                    {contact.topOffer}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
