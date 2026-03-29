import { motion } from 'framer-motion'
import { SectionWrapper } from '../ui/SectionWrapper'
import { DynIcon } from '../../utils/iconMap'

const differentials = [
  {
    icon: 'users',
    stat: '3,6%',
    label: 'Turnover',
    context: 'vs. 22% da média do mercado',
    description: 'Retenção de talentos que garante continuidade e profundidade técnica nos projetos.',
  },
  {
    icon: 'calendar',
    stat: '26',
    label: 'Anos de entrega contínua',
    context: 'Fundada em 2000',
    description: 'Mais de duas décadas construindo relações duradouras e expertise acumulada em setores regulados.',
  },
  {
    icon: 'shield-check',
    stat: '4',
    label: 'Certificações ISO',
    context: '9001 · 27001 · 27701 · 14001',
    description: 'Qualidade, segurança da informação, privacidade de dados e gestão ambiental certificadas.',
  },
  {
    icon: 'globe',
    stat: '3',
    label: 'Continentes',
    context: 'Brasil · EUA · Portugal',
    description: 'Presença global com delivery centers estrategicamente posicionados para atender diferentes fusos e culturas.',
  },
  {
    icon: 'network',
    stat: '6+',
    label: 'Parcerias tier-1',
    context: 'Microsoft · AWS · Google · Databricks · Salesforce · SAP',
    description: 'Alianças estratégicas com os maiores players de tecnologia do mundo.',
  },
  {
    icon: 'trending-up',
    stat: '500K+',
    label: 'Projetos entregues',
    context: 'Em todos os modelos de delivery',
    description: 'Volume que comprova capacidade de escala sem perder qualidade de entrega.',
  },
]

export function SectionWhyFoursys() {
  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 md:mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-foursys-primary mb-2">
            Diferenciais competitivos
          </p>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-none mb-3">
            Por que a Foursys?
          </h2>
          <p className="text-foursys-text-muted max-w-2xl text-sm md:text-base leading-relaxed">
            Não é só o que fazemos — é como fazemos. Cada número abaixo representa uma decisão estratégica
            que tomamos para entregar mais do que tecnologia: entregamos confiança.
          </p>
          <div className="mt-5 h-px bg-gradient-to-r from-foursys-primary/30 via-white/[0.06] to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {differentials.map((d, i) => (
            <motion.div
              key={d.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
              className="group p-6 rounded-2xl border border-white/[0.08] bg-foursys-surface/30 hover:border-foursys-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2.5 rounded-xl bg-foursys-primary/10 border border-foursys-primary/20">
                  <DynIcon name={d.icon} size={20} className="text-foursys-primary" />
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white leading-none">
                    {d.stat}
                  </div>
                  <div className="text-sm font-semibold text-foursys-text-muted mt-0.5">
                    {d.label}
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-foursys-primary/70 mb-2">
                {d.context}
              </div>
              <p className="text-xs text-foursys-text-muted leading-relaxed">
                {d.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 md:mt-10 p-6 md:p-8 rounded-2xl border border-foursys-primary/20 bg-foursys-primary/[0.04]"
        >
          <p className="text-sm md:text-base text-foursys-text-muted leading-relaxed text-center max-w-3xl mx-auto">
            <span className="text-foursys-primary font-bold">A diferença não está no que entregamos.</span>{' '}
            Está na profundidade com que conhecemos cada setor, na estabilidade da equipe que acompanha seu projeto,
            e na estrutura certificada que garante qualidade em escala.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
