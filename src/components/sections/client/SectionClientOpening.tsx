import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

import { useApp } from '../../../context/AppContext'
import { useLanguage } from '../../../i18n'
import { SectionWrapper } from '../../ui/SectionWrapper'
import { ClientLogo } from '../../ui/ClientLogos'
import { DynIcon } from '../../../utils/iconMap'
import { getClientById } from '../../../data/clients'

// ─── Helpers de cor ──────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function rgba(hex: string, a: number) {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}

// ─── Visual exclusivo Santander (chama original) ────────────────────────────

function SantanderFlame() {
  return (
    <div className="relative select-none flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 50% 65%, rgba(200,60,0,0.35) 0%, rgba(255,100,0,0.12) 50%, transparent 80%)',
          filter: 'blur(24px)',
          transform: 'scale(1.4)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-8 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,80,0,0.55) 0%, transparent 75%)',
          filter: 'blur(10px)',
        }}
      />
      <motion.img
        src="/images/foursys-flame.png"
        alt="Santander"
        className="relative z-10 w-48 h-auto drop-shadow-[0_0_32px_rgba(255,80,0,0.6)]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'drop-shadow(0 0 28px rgba(255,100,0,0.55))' }}
      />
    </div>
  )
}

// ─── Visual Hero dinâmico por cliente ────────────────────────────────────────

function ClientBrandHero({ clientId, color, accent }: { clientId: string; color: string; accent: string }) {
  return (
    <div className="relative select-none flex items-center justify-center w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
      {/* Anel orbital externo */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1.5px solid ${rgba(color, 0.15)}`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
          style={{ background: rgba(color, 0.7), boxShadow: `0 0 8px ${rgba(color, 0.5)}` }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: rgba(accent, 0.5) }}
        />
      </motion.div>

      {/* Anel orbital interno */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: '24px',
          border: `1px solid ${rgba(accent, 0.1)}`,
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{ background: rgba(accent, 0.6), boxShadow: `0 0 6px ${rgba(accent, 0.4)}` }}
        />
      </motion.div>

      {/* Glow externo difuso */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${rgba(color, 0.2)} 0%, ${rgba(color, 0.06)} 40%, transparent 70%)`,
          filter: 'blur(20px)',
          transform: 'scale(1.5)',
        }}
      />

      {/* Reflexo inferior */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-10 rounded-full"
        style={{
          background: `radial-gradient(ellipse, ${rgba(color, 0.35)} 0%, transparent 70%)`,
          filter: 'blur(12px)',
        }}
      />

      {/* Container central com logo */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Hexágono de fundo com glow */}
        <div className="relative">
          <svg viewBox="0 0 200 220" width={160} height={176} className="absolute -inset-2 opacity-60">
            <defs>
              <linearGradient id={`hex-grad-${clientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={rgba(color, 0.25)} />
                <stop offset="100%" stopColor={rgba(accent, 0.1)} />
              </linearGradient>
              <filter id={`hex-glow-${clientId}`}>
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
              </filter>
            </defs>
            <polygon
              points="100,10 185,60 185,160 100,210 15,160 15,60"
              fill={`url(#hex-grad-${clientId})`}
              filter={`url(#hex-glow-${clientId})`}
            />
          </svg>

          <div
            className="relative w-36 h-36 rounded-2xl flex items-center justify-center overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${rgba(color, 0.12)}, ${rgba(accent, 0.05)})`,
              border: `1.5px solid ${rgba(color, 0.25)}`,
              boxShadow: `
                0 0 40px ${rgba(color, 0.2)},
                0 0 80px ${rgba(color, 0.08)},
                inset 0 1px 0 ${rgba(color, 0.15)}
              `,
            }}
          >
            {/* Reflexo de luz */}
            <div
              className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none"
              style={{
                background: `linear-gradient(180deg, ${rgba(color, 0.08)} 0%, transparent 100%)`,
                borderRadius: '16px 16px 0 0',
              }}
            />

            <motion.div
              className="relative z-10"
              style={{
                filter: `drop-shadow(0 0 20px ${rgba(color, 0.5)}) drop-shadow(0 0 40px ${rgba(color, 0.25)})`,
              }}
            >
              <ClientLogo id={clientId} size={52} />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Partículas animadas */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3 + (i % 2),
            height: 3 + (i % 2),
            background: i % 2 === 0 ? rgba(color, 0.6) : rgba(accent, 0.4),
            boxShadow: `0 0 4px ${i % 2 === 0 ? rgba(color, 0.3) : rgba(accent, 0.2)}`,
          }}
          animate={{
            x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 8), 0],
            y: [0, -(30 + i * 10), 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Botão de navegação para seções do cliente ──────────────────────────────

function SectionNavButton({
  icon,
  label,
  description,
  color,
  delay,
  onClick,
}: {
  icon: string
  label: string
  description: string
  color: string
  delay: number
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-xl text-left overflow-hidden transition-all duration-300 active:scale-[0.98] min-h-[44px]"
      style={{
        border: `1px solid ${hovered ? rgba(color, 0.35) : 'rgba(255,255,255,0.06)'}`,
        background: hovered
          ? `linear-gradient(135deg, ${rgba(color, 0.1)}, ${rgba(color, 0.03)})`
          : 'rgba(255,255,255,0.02)',
      }}
    >
      {/* Barra lateral animada */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        animate={{
          scaleY: hovered ? 1 : 0.4,
          opacity: hovered ? 1 : 0.5,
        }}
        style={{
          background: `linear-gradient(to bottom, ${color}, ${rgba(color, 0.3)})`,
          transformOrigin: 'top',
        }}
        transition={{ duration: 0.25 }}
      />

      {/* Glow no hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `radial-gradient(circle at 0% 50%, ${rgba(color, 0.12)}, transparent 70%)`,
        }}
      />

      <div className="relative flex items-center gap-3.5 pl-5 pr-4 py-3.5">
        {/* Ícone Lucide */}
        <motion.div
          className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
          animate={{
            background: hovered
              ? `linear-gradient(135deg, ${rgba(color, 0.2)}, ${rgba(color, 0.08)})`
              : 'rgba(255,255,255,0.04)',
            borderColor: hovered ? rgba(color, 0.3) : 'rgba(255,255,255,0.06)',
          }}
          style={{ border: '1px solid' }}
          transition={{ duration: 0.25 }}
        >
          <DynIcon
            name={icon}
            size={16}
            style={{
              color: hovered ? color : 'rgba(255,255,255,0.5)',
              transition: 'color 0.25s ease',
            }}
          />
        </motion.div>

        {/* Texto */}
        <div className="flex-1 min-w-0">
          <span
            className="text-sm font-bold leading-snug block transition-colors duration-200"
            style={{ color: hovered ? '#fff' : 'rgba(255,255,255,0.85)' }}
          >
            {label}
          </span>
          <p
            className="text-[11px] mt-0.5 leading-snug transition-colors duration-200"
            style={{ color: hovered ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)' }}
          >
            {description}
          </p>
        </div>

        {/* Seta */}
        <motion.div
          className="flex-shrink-0"
          animate={{
            x: hovered ? 0 : -4,
            opacity: hovered ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={16} style={{ color }} />
        </motion.div>
      </div>
    </motion.button>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SectionClientOpening() {
  const { state, navigate, clearClient } = useApp()
  const { t } = useLanguage()
  const client = state.activeClientId ? getClientById(state.activeClientId) : null

  if (!client) return null

  const clientColor = client.colors.primary

  const clientSections = client.sections.slice(1)

  return (
    <SectionWrapper>
      <div className="h-full flex flex-col overflow-y-auto">

        {/* ── Área principal: 1 coluna mobile → 3 colunas desktop ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[3fr_2.5fr]">

          {/* ── Coluna central: Visual do cliente (aparece primeiro no mobile) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-6 lg:py-6 order-1"
          >
            <div className="scale-75 md:scale-90 lg:scale-100">
              {client.id === 'santander'
                ? <SantanderFlame />
                : <ClientBrandHero clientId={client.id} color={clientColor} accent={client.colors.accent} />
              }
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-2 text-center px-4 md:px-6"
            >
              <h1 className="text-base md:text-lg font-black text-white leading-snug mb-1">
                {client.tagline}
              </h1>
              <p className="text-xs md:text-sm text-foursys-text-muted">{client.relationship}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-3"
            >
              <div
                className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border text-xs md:text-sm font-bold"
                style={{
                  borderColor: `${clientColor}60`,
                  backgroundColor: `${clientColor}12`,
                  color: clientColor,
                }}
              >
                {t('clientSections.opening.customPresentation').replace('{client}', client.name)}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Coluna direita: Seções do cliente ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center px-4 md:px-6 lg:px-8 py-4 lg:py-8 gap-2 lg:gap-3 order-2"
          >
            <div
              className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1 lg:mb-2"
              style={{ color: clientColor }}
            >
              {t('clientSections.opening.inThisPresentation')}
            </div>

            {clientSections.map((section, i) => (
              <SectionNavButton
                key={section.id}
                icon={section.icon}
                label={section.label}
                description={section.description}
                color={clientColor}
                delay={0.25 + i * 0.08}
                onClick={() => navigate(section.id)}
              />
            ))}
          </motion.div>
        </div>

        {/* ── Barra inferior ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 border-t border-white/[0.08]"
        >
          <div className="px-4 md:px-6 lg:px-10 py-3 sm:py-5 sm:border-r border-b sm:border-b-0 border-white/[0.06]">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.16em] mb-1 sm:mb-2"
              style={{ color: clientColor }}
            >
              {t('clientSections.opening.deliveryStructure')}
            </div>
            <div className="text-xs sm:text-sm text-foursys-text-muted leading-relaxed">
              {t('clientSections.opening.deliveryItems')}
            </div>
          </div>

          <div className="px-4 md:px-6 lg:px-10 py-3 sm:py-5 sm:border-r border-b sm:border-b-0 border-white/[0.06]">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.16em] mb-1 sm:mb-2"
              style={{ color: clientColor }}
            >
              {t('clientSections.opening.differentials')}
            </div>
            <div className="text-xs sm:text-sm text-foursys-text-muted leading-relaxed">
              {t('clientSections.opening.differentialsList')}
            </div>
          </div>

          <div className="px-4 md:px-6 lg:px-10 py-3 sm:py-5 flex flex-col justify-center">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.16em] mb-1 sm:mb-2"
              style={{ color: clientColor }}
            >
              {t('clientSections.opening.viewMode')}
            </div>
            <button
              onClick={clearClient}
              className="text-xs text-foursys-text-dim hover:text-foursys-text-muted active:text-white transition-colors underline underline-offset-2 text-left min-h-[44px] flex items-center"
            >
              {t('clientSections.opening.backToInstitutional')}
            </button>
          </div>
        </motion.div>

        {/* ── Rodapé ── */}
        <div
          className="text-center text-[11px] py-2.5 border-t border-white/[0.04] tracking-wide"
          style={{ color: `${clientColor}80` }}
        >
          Foursys × {client.name} · {client.relationship}
        </div>

      </div>
    </SectionWrapper>
  )
}
