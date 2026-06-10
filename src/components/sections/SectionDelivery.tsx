import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Star, Maximize2, X, ArrowRight, Sparkles } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { useLanguage } from '../../i18n'
import { getDeliveryModels } from '../../data/services'
import { DynIcon } from '../../utils/iconMap'

interface DrillCard {
  title: string
  items: string[]
}
interface DrillBlock {
  num: string
  title: string
  intro?: string
  cards?: DrillCard[]
  tagsTitle?: string
  tags?: string[]
  footer?: string
}
interface AllocDrill {
  badge: string
  title: string
  subtitle: string
  cta: string
  blocks: DrillBlock[]
}

const allocDrillI18n: Record<'pt' | 'en', AllocDrill> = {
  pt: {
    badge: 'Diferenciais da Squad Foursys',
    title: 'Alocação — Times Estáveis e Mitigação de Turnover',
    subtitle:
      'A Squad Foursys é flexível para ter a melhor composição de time alinhada ao objetivo e à necessidade do negócio e do contrato, com atuação presencial ou remota conforme o momento do projeto.',
    cta: 'Ver diferenciais',
    blocks: [
      {
        num: '01',
        title: 'Processo de Contingência',
        intro:
          'Comprometimento em cumprir o backlog definido no planejamento da entrega, garantindo transparência e previsibilidade na entrega dos serviços, na gestão de impedimentos e processos de contingência e no cumprimento do acordado.',
        cards: [
          {
            title: 'Gestão de Conhecimento',
            items: [
              'Documentação no Portal e vídeos de KB',
              'Passagem pessoal com Head dos Studios',
              'Processo de onboarding com 1 semana de shadow',
            ],
          },
          {
            title: 'Contingência Ativa',
            items: [
              'Possibilidade de contingência com máquina do cliente',
              'SYNC mensal com a equipe',
            ],
          },
          {
            title: 'Férias',
            items: [
              'Ativação de contingência com 2 meses de antecedência',
              'Shadow de 1 semana',
            ],
          },
        ],
      },
      {
        num: '02',
        title: 'Mitigação de Turnover',
        cards: [
          {
            title: 'Cultura Organizacional Inclusiva e Colaborativa',
            items: [
              'Ambiente de trabalho mais aberto ao diálogo e a feedbacks constantes',
              'Criação de comunidades internas (guildas técnicas, grupos de afinidade)',
            ],
          },
          {
            title: 'Gestão Técnica Inspiradora',
            items: [
              'Lideranças técnicas com perfil motivacional, que engajam mesmo diante de limitações tecnológicas',
              'Soft skills no processo de promoção para liderança técnica',
            ],
          },
          {
            title: 'Banco de Talentos Ativo',
            items: [
              'Nos perfis mais estratégicos, mantemos um banco de talentos ativo para possíveis situações emergenciais',
            ],
          },
          {
            title: 'Rotas de Crescimento Profissional Claras',
            items: [
              'Planos de carreira bem definidos, mesmo que o ambiente não seja cutting-edge',
              'Mentorias internas com foco no desenvolvimento técnico e comportamental',
            ],
          },
          {
            title: 'Programas de Reconhecimento e Incentivo',
            items: [
              'Reconhecimento por entregas que não envolvam necessariamente inovação (ex.: documentação bem feita, aderência ao compliance)',
              'Premiações mensais ou trimestrais e bonificações não salariais (dias de folga, acesso a eventos etc.)',
            ],
          },
        ],
      },
      {
        num: '03',
        title: 'Plataforma FourMakers — #FOURTALENT',
        intro:
          'Com apoio da área de Pessoas e Cultura, os profissionais têm acesso e acompanhamento pelo produto fourmakers.io — uma plataforma digital abrangente que conecta pessoas e empresas, gerando engajamento, conexão de oportunidades e centralização das habilidades dos colaboradores.',
        tagsTitle: 'Jornadas bonificadas com a contratação da Squad Foursys',
        tags: [
          'Treinamento',
          'PDI — Plano de Desenvolvimento',
          'Análise de Clima (Felizômetro)',
          'Aceleração com Ferramentas de IA',
          'Acompanhamento 1:1',
          'Onboarding',
          'Análise Proativa',
          'Captação Inteligente',
          'Mapa de Skills',
        ],
        footer: 'Pessoas certas nos lugares certos.',
      },
    ],
  },
  en: {
    badge: 'Foursys Squad Differentiators',
    title: 'Staff Augmentation — Stable Teams and Turnover Mitigation',
    subtitle:
      'The Foursys Squad is flexible to assemble the best team composition aligned to the business and contract objectives, working on-site or remotely according to the project phase.',
    cta: 'View differentiators',
    blocks: [
      {
        num: '01',
        title: 'Contingency Process',
        intro:
          'A commitment to deliver the backlog defined during delivery planning, ensuring transparency and predictability in service delivery, in impediment and contingency management, and in honoring what was agreed.',
        cards: [
          {
            title: 'Knowledge Management',
            items: [
              'Portal documentation and KB videos',
              'Personal handover with the Studios Head',
              'Onboarding process with a 1-week shadow',
            ],
          },
          {
            title: 'Active Contingency',
            items: [
              'Option for contingency using the client machine',
              'Monthly SYNC with the team',
            ],
          },
          {
            title: 'Vacations',
            items: [
              'Contingency activated 2 months in advance',
              '1-week shadow',
            ],
          },
        ],
      },
      {
        num: '02',
        title: 'Turnover Mitigation',
        cards: [
          {
            title: 'Inclusive and Collaborative Organizational Culture',
            items: [
              'A workplace more open to dialogue and constant feedback',
              'Creation of internal communities (technical guilds, affinity groups)',
            ],
          },
          {
            title: 'Inspiring Technical Leadership',
            items: [
              'Technical leaders with a motivational profile who engage teams even amid technology constraints',
              'Soft skills included in the promotion path to technical leadership',
            ],
          },
          {
            title: 'Active Talent Pool',
            items: [
              'For the most strategic profiles, we keep an active talent pool for potential emergencies',
            ],
          },
          {
            title: 'Clear Professional Growth Paths',
            items: [
              'Well-defined career plans, even when the environment is not cutting-edge',
              'Internal mentoring focused on technical and behavioral development',
            ],
          },
          {
            title: 'Recognition and Incentive Programs',
            items: [
              'Recognition for deliveries that do not necessarily involve innovation (e.g., well-written documentation, compliance adherence)',
              'Monthly or quarterly awards and non-salary perks (days off, event access, etc.)',
            ],
          },
        ],
      },
      {
        num: '03',
        title: 'FourMakers Platform — #FOURTALENT',
        intro:
          'With support from the People & Culture area, professionals get access and follow-up through the fourmakers.io product — a comprehensive digital platform that connects people and companies, driving engagement, opportunity matching and centralization of employee skills.',
        tagsTitle: 'Journeys bonified with the Foursys Squad contract',
        tags: [
          'Training',
          'IDP — Individual Development Plan',
          'Climate Analysis (Happy-meter)',
          'Acceleration with AI Tools',
          '1:1 Follow-up',
          'Onboarding',
          'Proactive Analysis',
          'Smart Sourcing',
          'Skill Map',
        ],
        footer: 'The right people in the right places.',
      },
    ],
  },
}

const squadDrillI18n: Record<'pt' | 'en', AllocDrill> = {
  pt: {
    badge: 'Diferenciais da Squad Foursys',
    title: 'Squad Dedicado — Times Estáveis e Retaguarda Técnica',
    subtitle:
      'A Squad Foursys é flexível para ter a melhor composição de time alinhada ao objetivo e à necessidade do negócio e do contrato, podendo atuar de forma presencial ou remota de acordo com o momento do projeto.',
    cta: 'Ver diferenciais',
    blocks: [
      {
        num: '01',
        title: 'Times Estáveis',
        intro:
          'Uma squad pensada para sustentar entregas com estabilidade e previsibilidade, equilibrando estratégia de negócio e ritmo de entregas ao longo de todo o projeto.',
        tagsTitle: 'Diferenciais da Squad Foursys',
        tags: [
          'Mitigação de turnover',
          'Perfis de contingência (férias, licenças, reposição)',
          'Retaguarda técnica',
          'Adaptabilidade na composição da squad',
          'Flexibilidade de horário e compensação com banco de horas',
        ],
      },
      {
        num: '02',
        title: 'Retaguarda Técnica e Reposição',
        intro:
          'Os Studios oferecem suporte técnico, padrões e boas práticas para garantir a excelência na execução, enquanto a Foursys atua em conjunto com as áreas internas do banco, seguindo a estrutura de três linhas de defesa e as diretrizes internas.',
        cards: [
          {
            title: 'Studios de Suporte Técnico',
            items: [
              'Studio Cibersegurança',
              'Studio Qualidade',
              'Studio Dados e Analytics',
              'Studio DevOps',
              'Studio Infraestrutura',
              'Studio Arquitetura',
              'AMS Foursys',
            ],
          },
          {
            title: 'Governança e Práticas para Entregas de Excelência',
            items: [
              'Templates para eficiência operacional',
              'Capacitações técnicas',
              'Squad OIM dedicada',
            ],
          },
          {
            title: 'Reposição',
            items: [
              'Turnover Foursys Global inferior a 4%',
              'Reposição com SLA de 15 dias',
            ],
          },
        ],
      },
      {
        num: '03',
        title: 'Flexibilidade e Adaptabilidade da Equipe',
        intro:
          'Considerando o prazo total dos serviços, caso alguns perfis sejam desmobilizados antes do término, oferecemos alternativas — mediante alinhamento e negociação entre as partes (substituição, adição ou subtração de perfis).',
        cards: [
          {
            title: 'Opção 1',
            items: ['Acelerar as entregas dentro do projeto com a substituição do perfil'],
          },
          {
            title: 'Opção 2',
            items: ['Utilização do perfil ou das horas em outras atividades'],
          },
        ],
        footer: 'Nosso foco é o resultado do projeto.',
      },
    ],
  },
  en: {
    badge: 'Foursys Squad Differentiators',
    title: 'Dedicated Squad — Stable Teams and Technical Backup',
    subtitle:
      'The Foursys Squad is flexible to assemble the best team composition aligned to the business and contract objectives, working on-site or remotely according to the project phase.',
    cta: 'View differentiators',
    blocks: [
      {
        num: '01',
        title: 'Stable Teams',
        intro:
          'A squad designed to sustain delivery with stability and predictability, balancing business strategy and delivery pace throughout the whole project.',
        tagsTitle: 'Foursys Squad Differentiators',
        tags: [
          'Turnover mitigation',
          'Contingency profiles (vacations, leaves, replacement)',
          'Technical backup',
          'Adaptability in squad composition',
          'Flexible hours and compensation via hour bank',
        ],
      },
      {
        num: '02',
        title: 'Technical Backup and Replacement',
        intro:
          'The Studios provide technical support, standards and best practices to ensure execution excellence, while Foursys works together with the bank\u2019s internal areas, following the three-lines-of-defense structure and internal guidelines.',
        cards: [
          {
            title: 'Technical Support Studios',
            items: [
              'Cybersecurity Studio',
              'Quality Studio',
              'Data & Analytics Studio',
              'DevOps Studio',
              'Infrastructure Studio',
              'Architecture Studio',
              'Foursys AMS',
            ],
          },
          {
            title: 'Governance and Practices for Delivery Excellence',
            items: [
              'Templates for operational efficiency',
              'Technical enablement',
              'Dedicated OIM Squad',
            ],
          },
          {
            title: 'Replacement',
            items: [
              'Foursys Global turnover below 4%',
              'Replacement with a 15-day SLA',
            ],
          },
        ],
      },
      {
        num: '03',
        title: 'Team Flexibility and Adaptability',
        intro:
          'Considering the total service term, if some profiles are demobilized before the end, we offer alternatives \u2014 upon alignment and negotiation between the parties (replacement, addition or removal of profiles).',
        cards: [
          {
            title: 'Option 1',
            items: ['Accelerate deliveries within the project by replacing the profile'],
          },
          {
            title: 'Option 2',
            items: ['Use of the profile or hours in other activities'],
          },
        ],
        footer: 'Our focus is the project outcome.',
      },
    ],
  },
}

function AllocDrillModal({ content, onClose }: { content: AllocDrill; onClose: () => void }) {
  const { t } = useLanguage()
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={content.title}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed inset-4 sm:inset-8 md:inset-y-8 md:left-[8%] md:right-[8%] z-[61] flex flex-col bg-foursys-dark border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative flex-shrink-0 px-6 md:px-8 py-6 bg-gradient-to-br from-foursys-primary/25 to-foursys-cyan/5 border-b border-white/[0.08]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
            aria-label={t('common.close')}
          >
            <X size={18} />
          </button>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-foursys-cyan mb-2">
            {content.badge}
          </p>
          <h2 className="text-xl md:text-3xl font-black text-white pr-10">{content.title}</h2>
          <p className="text-sm text-foursys-text-muted mt-2 max-w-3xl leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Scrollable content */}
        <div data-voz-scroll-root className="flex-1 overflow-y-auto overscroll-contain stealth-scrollbar">
          <div className="p-6 md:p-8 space-y-8">
            {content.blocks.map(block => (
              <div key={block.num}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-foursys-primary/20 border border-foursys-primary/40 text-foursys-cyan text-sm font-black">
                    {block.num}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-foursys-text">{block.title}</h3>
                </div>

                {block.intro && (
                  <p className="text-sm text-foursys-text-muted leading-relaxed mb-5">{block.intro}</p>
                )}

                {block.cards && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {block.cards.map(card => (
                      <div
                        key={card.title}
                        className="p-5 rounded-xl bg-foursys-surface/40 border border-white/[0.08]"
                      >
                        <p className="text-sm font-bold text-foursys-text mb-3">{card.title}</p>
                        <div className="space-y-2.5">
                          {card.items.map(item => (
                            <div key={item} className="flex items-start gap-2.5">
                              <Check size={15} className="flex-shrink-0 mt-0.5 text-green-400" />
                              <span className="text-sm text-foursys-text-muted leading-relaxed">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {block.tags && (
                  <div className="mt-2">
                    {block.tagsTitle && (
                      <p className="text-xs font-bold text-foursys-text-dim uppercase tracking-wider mb-3">
                        {block.tagsTitle}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {block.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-foursys-primary/10 text-foursys-text-muted border border-foursys-primary/20"
                        >
                          <Sparkles size={11} className="text-foursys-cyan" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {block.footer && (
                  <div className="mt-5 p-4 rounded-xl bg-foursys-primary/10 border border-foursys-primary/25 text-center">
                    <p className="text-sm font-bold text-foursys-text">{block.footer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}

export function SectionDelivery() {
  const { t, lang } = useLanguage()
  const deliveryModels = useMemo(() => getDeliveryModels(lang), [lang])
  const l = lang === 'en' ? 'en' : 'pt'
  const drillMap = useMemo<Record<string, AllocDrill>>(
    () => ({ alocacao: allocDrillI18n[l], squad: squadDrillI18n[l] }),
    [l]
  )
  const [drillId, setDrillId] = useState<string | null>(null)
  const activeDrill = drillId ? drillMap[drillId] : null

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-primary/15 border border-foursys-primary/30 text-foursys-cyan text-sm mb-4">
            {t('delivery.badge')}
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-foursys-text mb-4">
            {t('delivery.title')}
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            {t('delivery.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {deliveryModels.map((model, i) => {
            const drillable = Boolean(drillMap[model.id])
            return (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              data-voz-caixa={`delivery-${model.id}`}
              data-voz-caixa-secao="delivery"
              data-voz-caixa-rotulo={model.title}
              tabIndex={-1}
              onClick={drillable ? () => setDrillId(model.id) : undefined}
              role={drillable ? 'button' : undefined}
              className={`
                relative p-7 rounded-2xl border backdrop-blur-md transition-all duration-300
                ${model.highlight
                  ? 'bg-gradient-to-br from-foursys-primary/25 to-foursys-cyan/10 border-foursys-primary/50 shadow-[0_0_40px_rgba(0,85,179,0.2)]'
                  : 'bg-foursys-surface/50 border-white/10 hover:border-white/20 hover:-translate-y-1'
                }
                ${drillable ? 'cursor-pointer hover:border-foursys-cyan/50 hover:shadow-[0_0_40px_rgba(0,85,179,0.18)]' : ''}
              `}
            >
              {drillable && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-foursys-primary/20 border border-foursys-cyan/40 text-foursys-cyan text-[10px] font-bold uppercase tracking-wider">
                  <Maximize2 size={11} /> Drill down
                </span>
              )}

              {model.highlight && (
                <div className="flex items-center gap-2 mb-4">
                  <Star size={14} className="text-foursys-cyan fill-foursys-cyan" />
                  <span className="text-xs font-semibold text-foursys-cyan uppercase tracking-widest">
                    {t('delivery.highlight')}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 mb-5">
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center
                  ${model.highlight ? 'bg-foursys-primary/30 shadow-[0_0_20px_rgba(0,85,179,0.4)]' : 'bg-foursys-surface border border-white/10'}
                `}>
                  <DynIcon name={model.icon} size={24} className="text-white/80" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${model.highlight ? 'text-foursys-text' : 'text-foursys-text'}`}>
                    {model.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-foursys-text-muted leading-relaxed mb-5">{model.description}</p>

              <div className="space-y-2.5">
                {model.features.map(feature => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check
                      size={15}
                      className={`flex-shrink-0 mt-0.5 ${model.highlight ? 'text-foursys-cyan' : 'text-green-400'}`}
                    />
                    <span className={`text-sm ${model.highlight ? 'text-foursys-text' : 'text-foursys-text-muted'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {drillable && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setDrillId(model.id) }}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foursys-cyan hover:gap-3 transition-all"
                >
                  {drillMap[model.id].cta} <ArrowRight size={15} />
                </button>
              )}
            </motion.div>
          )})}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-5 rounded-2xl bg-foursys-surface/30 border border-white/8 text-center"
        >
          <p className="text-sm text-foursys-text-muted flex items-start justify-center gap-2">
            <DynIcon name="lightbulb" size={18} className="text-foursys-cyan flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-foursys-text">{t('delivery.note')}</strong> {t('delivery.noteDetail')}
            </span>
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {activeDrill && <AllocDrillModal content={activeDrill} onClose={() => setDrillId(null)} />}
      </AnimatePresence>
    </SectionWrapper>
  )
}
