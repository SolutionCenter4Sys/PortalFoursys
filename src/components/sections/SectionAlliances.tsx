import { motion } from 'framer-motion'
import { SectionWrapper } from '../ui/SectionWrapper'
import { alliances } from '../../data/alliances'

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

        {/* Alliance logos wall */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
          {[
            { name: 'Microsoft',          logo: 'Microsoft',    tagline: 'Azure · Copilot · 365',         color: '#00A4EF', bg: 'from-blue-400/15 to-blue-500/5',   border: 'border-blue-400/30' },
            { name: 'Amazon Web Services', logo: 'AWS',          tagline: 'Cloud · AI · Data',             color: '#FF9900', bg: 'from-amber-500/15 to-amber-600/5', border: 'border-amber-500/30' },
            { name: 'Google Cloud',        logo: 'Google Cloud', tagline: 'BigQuery · Vertex AI · GKE',    color: '#4285F4', bg: 'from-blue-500/15 to-blue-600/5',   border: 'border-blue-500/30' },
            { name: 'SAP',                 logo: 'SAP',          tagline: 'S/4HANA · BTP · ERP',           color: '#0FAAFF', bg: 'from-sky-500/15 to-sky-600/5',     border: 'border-sky-500/30' },
            { name: 'Oracle',              logo: 'Oracle',       tagline: 'OCI · Database · ERP',          color: '#F80000', bg: 'from-red-600/15 to-red-700/5',     border: 'border-red-600/30' },
            { name: 'ServiceNow',          logo: 'ServiceNow',   tagline: 'ITSM · HRSD · Automação',       color: '#62D84E', bg: 'from-green-400/15 to-green-500/5', border: 'border-green-400/30' },
            { name: 'Salesforce',          logo: 'Salesforce',   tagline: 'CRM · Sales · Service Cloud',   color: '#00A1E0', bg: 'from-sky-500/15 to-sky-600/5',     border: 'border-sky-500/30' },
            { name: 'Databricks',          logo: 'Databricks',   tagline: 'Data Lakehouse · ML · AI',      color: '#FF3621', bg: 'from-red-500/15 to-red-600/5',     border: 'border-red-500/30' },
          ].map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-2xl bg-gradient-to-br ${partner.bg} border ${partner.border} flex flex-col items-center text-center hover:-translate-y-1 transition-all duration-300`}
            >
              <div
                className="text-2xl md:text-4xl lg:text-5xl font-black mb-3"
                style={{ color: partner.color }}
              >
                {partner.logo}
              </div>
              <div className="font-bold text-foursys-text text-sm mb-1">{partner.name}</div>
              <div className="text-xs text-foursys-text-dim">{partner.tagline}</div>
            </motion.div>
          ))}
        </div>

        {/* Details */}
        <div className="space-y-4">
          {alliances.map((alliance, i) => (
            <motion.div
              key={alliance.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-5 rounded-2xl bg-foursys-surface/50 border border-white/10 flex gap-5"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                style={{ backgroundColor: `${alliance.color}22`, color: alliance.color, border: `1px solid ${alliance.color}44` }}
              >
                {alliance.logo.slice(0, 3)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
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
