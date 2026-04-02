import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Quote, Shield, CheckCircle2 } from 'lucide-react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { cases } from '../../data/cases'
import type { CaseStudy } from '../../types'

const HERO_STATS = [
  { value: '100+', label: 'projetos desbloqueados' },
  { value: '85%', label: 'redução de tempo médio' },
  { value: '40%', label: 'redução de custo operacional' },
  { value: '82%', label: 'previsibilidade de entrega' },
]

const SECTOR_COLORS: Record<string, string> = {
  'Saúde':      'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  'Financeiro': 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  'Seguros':    'bg-violet-500/15 text-violet-400 border-violet-500/25',
  'Varejo':     'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'Indústria':  'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
}

const TYPE_COLORS: Record<string, string> = {
  'Modernização de Legado':    'text-emerald-400',
  'AI-Augmented Squad':        'text-blue-400',
  'IA First':                  'text-violet-400',
  'Engenharia de Dados':       'text-amber-400',
  'Dados & Inteligência':      'text-amber-400',
  'Cibersegurança & Zero Trust': 'text-red-400',
  'Agilidade & Org Design':    'text-indigo-400',
}

function CaseFullCard({ c, index }: { c: CaseStudy; index: number }) {
  const sectorStyle = SECTOR_COLORS[c.sector] ?? 'bg-white/10 text-white/70 border-white/20'
  const typeColor = TYPE_COLORS[c.type] ?? 'text-foursys-primary'

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
      className="rounded-2xl border border-white/[0.08] bg-foursys-surface/20 overflow-hidden hover:border-white/[0.14] transition-all duration-300"
    >
      {/* Header */}
      <div className="p-6 md:p-8 pb-0">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-foursys-text-dim mb-2">
              Caso {c.sector} — <span className="text-foursys-text-muted">{c.client}</span>
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${sectorStyle}`}>
                {c.sector}
              </span>
              <span className={`text-xs font-semibold ${typeColor}`}>
                {c.type}
              </span>
            </div>
          </div>
          {c.metric && (
            <div className="text-right flex-shrink-0">
              <div className={`text-2xl md:text-3xl font-black ${typeColor}`}>{c.metric.value}</div>
              <div className="text-[10px] text-foursys-text-dim max-w-[140px]">{c.metric.label}</div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-5">
        <div>
          <p className="text-sm text-foursys-text-muted leading-relaxed">
            <span className="font-bold text-white">Desafio:</span>{' '}
            {c.challenge}
          </p>
        </div>

        <div>
          <p className="text-sm text-foursys-text-muted leading-relaxed">
            <span className="font-bold text-white">Solução:</span>{' '}
            {c.solution}
          </p>
        </div>

        {/* Testimonial */}
        {c.testimonial && (
          <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex gap-3">
              <Quote size={20} className="text-foursys-primary/50 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foursys-text-muted italic leading-relaxed mb-3">
                  &ldquo;{c.testimonial.quote}&rdquo;
                </p>
                <p className="text-xs">
                  <span className="text-foursys-text-dim">—</span>{' '}
                  <span className="font-semibold text-white">{c.testimonial.author}</span>
                  <span className="text-foursys-text-dim"> — {c.testimonial.role}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          type="button"
          className="flex items-center gap-2 text-xs font-semibold text-foursys-primary hover:text-foursys-cyan transition-colors group/cta"
        >
          Tenho um desafio parecido
          <ArrowRight size={14} className="group-hover/cta:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.article>
  )
}

export function SectionCases() {
  const [filter, setFilter] = useState('Todos')

  const sectors = ['Todos', ...Array.from(new Set(cases.map(c => c.sector)))]
  const filtered = filter === 'Todos' ? cases : cases.filter(c => c.sector === filter)

  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-12 max-w-5xl mx-auto">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-14"
        >
          <p className="text-xs text-foursys-text-dim mb-3">+100 empresas transformadas</p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            Mostre ao seu board que<br />
            tecnologia entrega ROI —{' '}
            <span className="text-foursys-primary">em semanas</span>
          </h2>
          <p className="text-sm md:text-base text-foursys-text-muted max-w-2xl leading-relaxed">
            Cada caso segue o formato Problema → Solução → Impacto mensurável.
            Não contamos histórias — mostramos números.
          </p>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {HERO_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="p-4 rounded-xl bg-foursys-surface/40 border border-white/[0.08] text-center"
              >
                <div className="text-xl md:text-2xl font-black text-foursys-primary">{stat.value}</div>
                <div className="text-[9px] text-foursys-text-dim mt-1 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sector filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {sectors.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                filter === s
                  ? 'bg-foursys-primary/20 border-foursys-primary/40 text-foursys-primary'
                  : 'border-white/[0.1] text-foursys-text-muted hover:border-white/[0.2] hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </motion.div>

        {/* Cases list */}
        <div className="space-y-5">
          {filtered.map((c, i) => (
            <CaseFullCard key={c.id} c={c} index={i} />
          ))}
        </div>

        {/* Certifications banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 p-5 rounded-xl bg-foursys-surface/30 border border-white/[0.06] flex items-center justify-center gap-4 md:gap-6 flex-wrap"
        >
          {['ISO 9001', 'ISO 27001', 'ISO 27701', 'ISO 14001', 'SAFe', 'GPTW'].map(cert => (
            <div key={cert} className="flex items-center gap-1.5">
              <Shield size={12} className="text-foursys-primary/60" />
              <span className="text-[10px] font-semibold text-foursys-text-dim uppercase tracking-wider">{cert}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA - Diagnóstico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 md:mt-16 p-6 md:p-10 rounded-2xl bg-gradient-to-br from-foursys-primary/10 via-foursys-surface/50 to-transparent border border-foursys-primary/20"
        >
          <div className="max-w-lg mx-auto text-center">
            <h3 className="text-lg md:text-2xl font-black text-white mb-2">
              Tem um desafio parecido?
            </h3>
            <p className="text-sm text-foursys-text-muted mb-6">
              45 minutos com um especialista. Sem compromisso.
            </p>

            <div className="space-y-3 mb-6">
              <div className="h-10 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center px-3">
                <span className="text-xs text-foursys-text-dim">Seu nome</span>
              </div>
              <div className="h-10 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center px-3">
                <span className="text-xs text-foursys-text-dim">E-mail corporativo</span>
              </div>
              <div className="h-10 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center px-3">
                <span className="text-xs text-foursys-text-dim">Setor da empresa</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full h-11 rounded-lg bg-foursys-primary text-white text-sm font-bold hover:bg-foursys-primary/80 transition-colors"
            >
              Quero meu diagnóstico gratuito
            </button>

            <div className="flex items-center justify-center gap-4 mt-4">
              {[
                { icon: <Shield size={10} />, label: 'Dados protegidos — LGPD' },
                { icon: <CheckCircle2 size={10} />, label: 'Resposta em até 24h' },
                { icon: <CheckCircle2 size={10} />, label: 'Sem compromisso' },
              ].map(item => (
                <span key={item.label} className="flex items-center gap-1 text-[9px] text-foursys-text-dim">
                  {item.icon} {item.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 md:mt-16 text-center"
        >
          <p className="text-xs text-foursys-text-dim mb-2">+100 empresas transformadas</p>
          <h3 className="text-lg md:text-2xl font-black text-white mb-6">
            Pronto para ser o próximo caso de sucesso?
          </h3>
          <div className="flex items-center justify-center gap-3 text-xs text-foursys-text-dim">
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-foursys-primary" /> Diagnóstico gratuito</span>
            <span>·</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-foursys-primary" /> Resposta em 24h</span>
            <span>·</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-foursys-primary" /> Sem compromisso</span>
          </div>
        </motion.div>

      </div>
    </SectionWrapper>
  )
}
