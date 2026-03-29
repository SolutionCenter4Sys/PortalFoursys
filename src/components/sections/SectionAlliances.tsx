import { motion } from 'framer-motion'
import { SectionWrapper } from '../ui/SectionWrapper'
import { alliances } from '../../data/alliances'
import { PartnerLogo, type PartnerId } from '../ui/PartnerLogos'

const partnerCards: { id: PartnerId; name: string; tagline: string; color: string; bg: string; border: string }[] = [
  { id: 'microsoft',     name: 'Microsoft',          tagline: 'Azure · Copilot · 365',       color: '#00A4EF', bg: 'from-blue-400/15 to-blue-500/5',   border: 'border-blue-400/30' },
  { id: 'aws',           name: 'Amazon Web Services', tagline: 'Cloud · AI · Data',           color: '#FF9900', bg: 'from-amber-500/15 to-amber-600/5', border: 'border-amber-500/30' },
  { id: 'google-cloud',  name: 'Google Cloud',        tagline: 'BigQuery · Vertex AI · GKE',  color: '#4285F4', bg: 'from-blue-500/15 to-blue-600/5',   border: 'border-blue-500/30' },
  { id: 'sap',           name: 'SAP',                 tagline: 'S/4HANA · BTP · ERP',         color: '#0FAAFF', bg: 'from-sky-500/15 to-sky-600/5',     border: 'border-sky-500/30' },
  { id: 'oracle',        name: 'Oracle',              tagline: 'OCI · Database · ERP',         color: '#F80000', bg: 'from-red-600/15 to-red-700/5',     border: 'border-red-600/30' },
  { id: 'servicenow',    name: 'ServiceNow',          tagline: 'ITSM · HRSD · Automação',     color: '#62D84E', bg: 'from-green-400/15 to-green-500/5', border: 'border-green-400/30' },
  { id: 'salesforce',    name: 'Salesforce',          tagline: 'CRM · Sales · Service Cloud', color: '#00A1E0', bg: 'from-sky-500/15 to-sky-600/5',     border: 'border-sky-500/30' },
  { id: 'databricks',    name: 'Databricks',          tagline: 'Data Lakehouse · ML · AI',    color: '#FF3621', bg: 'from-red-500/15 to-red-600/5',     border: 'border-red-500/30' },
]

export function SectionAlliances() {
  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-primary/15 border border-foursys-primary/30 text-foursys-cyan text-sm mb-4">
            🤝 Alianças Estratégicas
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-foursys-text mb-4">
            Parceiros das maiores plataformas
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            Parcerias certificadas que nos dão acesso a tecnologias de ponta, suporte prioritário e capacidade de co-desenvolver soluções para o cliente.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
          {partnerCards.map((partner, i) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`group relative p-6 md:p-8 rounded-2xl bg-gradient-to-br ${partner.bg} border ${partner.border} flex flex-col items-center text-center hover:-translate-y-1.5 hover:shadow-lg hover:shadow-${partner.id === 'microsoft' ? 'blue' : 'white'}-500/10 transition-all duration-300`}
            >
              <div className="mb-4 h-12 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-300">
                <PartnerLogo id={partner.id} size={partner.id === 'aws' || partner.id === 'sap' ? 20 : partner.id === 'oracle' || partner.id === 'salesforce' ? 18 : 40} />
              </div>
              <div className="font-bold text-foursys-text text-sm mb-1">{partner.name}</div>
              <div className="text-xs text-foursys-text-dim">{partner.tagline}</div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-3">
          {alliances.map((alliance, i) => (
            <motion.div
              key={alliance.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="group p-5 rounded-2xl bg-foursys-surface/50 border border-white/10 hover:border-white/20 flex items-center gap-5 transition-all duration-300"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 duration-300"
                style={{ backgroundColor: `${alliance.color}15`, border: `1px solid ${alliance.color}33` }}
              >
                <PartnerLogo id={alliance.id as PartnerId} size={alliance.id === 'aws' || alliance.id === 'sap' ? 14 : alliance.id === 'oracle' || alliance.id === 'salesforce' ? 12 : 28} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <div className="font-bold text-foursys-text">{alliance.name}</div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full border font-medium"
                    style={{ color: alliance.color, backgroundColor: `${alliance.color}18`, borderColor: `${alliance.color}44` }}
                  >
                    {alliance.level}
                  </span>
                </div>
                <p className="text-sm text-foursys-text-muted">{alliance.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
