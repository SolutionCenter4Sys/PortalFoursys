import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { SectionWrapper } from '../ui/SectionWrapper'
import { kpis } from '../../data/kpis'

function KPICard({ kpi, delay }: { kpi: typeof kpis[0]; delay: number }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          const duration = 2000
          const start = performance.now()
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(kpi.value * eased))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [kpi.value, started])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center p-6 rounded-2xl bg-foursys-surface/60 border border-white/10 backdrop-blur-md hover:border-foursys-blue/30 transition-all duration-300 group"
    >
      <div className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-foursys-cyan to-foursys-blue mb-2">
        {count.toLocaleString('pt-BR')}{kpi.suffix}
      </div>
      <div className="text-base font-semibold text-foursys-text mb-1">{kpi.label}</div>
      <div className="text-xs text-foursys-text-dim text-center">{kpi.description}</div>
    </motion.div>
  )
}

export function SectionIdentity() {
  return (
    <SectionWrapper>
      <div className="px-4 md:px-8 py-6 md:py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foursys-blue/15 border border-foursys-blue/30 text-foursys-cyan text-sm mb-4">
            🌟 Quem Somos
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-foursys-text mb-4">
            A Foursys em números
          </h2>
          <p className="text-lg text-foursys-text-muted max-w-2xl mx-auto">
            Mais de duas décadas transformando o setor financeiro com tecnologia, metodologia e resultados comprovados.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 md:mb-12">
          {kpis.map((kpi, i) => (
            <KPICard key={kpi.label} kpi={kpi} delay={i * 0.1} />
          ))}
        </div>

        {/* Mission / Vision / Values */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Missão',
              icon: '🎯',
              content: 'Ser o parceiro estratégico que transforma a tecnologia em vantagem competitiva real para nossos clientes — com velocidade, qualidade e inovação.',
              gradient: 'from-foursys-blue/20 to-transparent'
            },
            {
              title: 'Visão',
              icon: '🔭',
              content: 'Ser reconhecidos globalmente como referência em transformação digital no setor financeiro, combinando expertise humana e inteligência artificial.',
              gradient: 'from-foursys-cyan/15 to-transparent'
            },
            {
              title: 'Propósito',
              icon: '💡',
              content: 'Fazer a tecnologia trabalhar de verdade para as pessoas — simplificando o complexo, acelerando o possível e inovando com responsabilidade.',
              gradient: 'from-violet-500/15 to-transparent'
            }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className={`p-6 rounded-2xl bg-gradient-to-b ${item.gradient} border border-white/10 backdrop-blur-md`}
            >
              <div className="text-2xl mb-3">{item.icon}</div>
              <div className="text-sm font-semibold text-foursys-cyan uppercase tracking-widest mb-2">{item.title}</div>
              <p className="text-foursys-text-muted text-sm leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
