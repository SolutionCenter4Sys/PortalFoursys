import { lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../i18n'

const SectionHome = lazy(() => import('./sections/SectionHome').then(m => ({ default: m.SectionHome })))
const SectionIdentity = lazy(() => import('./sections/SectionIdentity').then(m => ({ default: m.SectionIdentity })))
const SectionTimeline = lazy(() => import('./sections/SectionTimeline').then(m => ({ default: m.SectionTimeline })))
const SectionGlobal = lazy(() => import('./sections/SectionGlobal').then(m => ({ default: m.SectionGlobal })))
const SectionWhyFoursys = lazy(() => import('./sections/SectionWhyFoursys').then(m => ({ default: m.SectionWhyFoursys })))
const SectionOffersFlag = lazy(() => import('./sections/SectionOffersFlag').then(m => ({ default: m.SectionOffersFlag })))
const SectionServices = lazy(() => import('./sections/SectionServices').then(m => ({ default: m.SectionServices })))
const SectionDelivery = lazy(() => import('./sections/SectionDelivery').then(m => ({ default: m.SectionDelivery })))
const SectionAlliances = lazy(() => import('./sections/SectionAlliances').then(m => ({ default: m.SectionAlliances })))
const SectionInnovation = lazy(() => import('./sections/SectionInnovation').then(m => ({ default: m.SectionInnovation })))
const SectionAIFoursys = lazy(() => import('./sections/SectionAIFoursys').then(m => ({ default: m.SectionAIFoursys })))
const SectionCases = lazy(() => import('./sections/SectionCases').then(m => ({ default: m.SectionCases })))
const SectionTestimonials = lazy(() => import('./sections/SectionTestimonials').then(m => ({ default: m.SectionTestimonials })))
const SectionAwards = lazy(() => import('./sections/SectionAwards').then(m => ({ default: m.SectionAwards })))
const SectionClients = lazy(() => import('./sections/SectionClients').then(m => ({ default: m.SectionClients })))
const SectionCapabilities = lazy(() => import('./sections/SectionCapabilities').then(m => ({ default: m.SectionCapabilities })))
const SectionESG = lazy(() => import('./sections/SectionESG').then(m => ({ default: m.SectionESG })))
const SectionInsights = lazy(() => import('./sections/SectionInsights').then(m => ({ default: m.SectionInsights })))
const SectionFAQ = lazy(() => import('./sections/SectionFAQ').then(m => ({ default: m.SectionFAQ })))
const SectionExportPdf = lazy(() => import('./sections/SectionExportPdf').then(m => ({ default: m.SectionExportPdf })))
// Client sections
const SectionClientOpening = lazy(() => import('./sections/client/SectionClientOpening').then(m => ({ default: m.SectionClientOpening })))
const SectionClientInsights = lazy(() => import('./sections/client/SectionClientInsights').then(m => ({ default: m.SectionClientInsights })))
const SectionClientCases = lazy(() => import('./sections/client/SectionClientCases').then(m => ({ default: m.SectionClientCases })))
const SectionClientExtra1 = lazy(() => import('./sections/client/SectionClientExtra1').then(m => ({ default: m.SectionClientExtra1 })))
const SectionClientExtra2 = lazy(() => import('./sections/client/SectionClientExtra2').then(m => ({ default: m.SectionClientExtra2 })))

function SectionSkeleton() {
  const { t } = useLanguage()
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-foursys-primary/30 border-t-foursys-primary rounded-full animate-spin" />
        <span className="text-xs text-foursys-text-dim">{t('common.loading')}</span>
      </div>
    </div>
  )
}

export function SectionRenderer() {
  const { state } = useApp()
  const section = state.currentSection

  return (
    <Suspense fallback={<SectionSkeleton />}>
      <AnimatePresence mode="wait">
        {/* ── Início ── */}
        {section === 'home'           && <SectionHome key="home" />}

        {/* ── Institucional ── */}
        {section === 'identity'       && <SectionIdentity key="identity" />}
        {section === 'timeline'       && <SectionTimeline key="timeline" />}
        {section === 'global'         && <SectionGlobal key="global" />}
        {section === 'why-foursys'    && <SectionWhyFoursys key="why-foursys" />}

        {/* ── Ofertas e Serviços ── */}
        {section === 'offers-flagship' && <SectionOffersFlag key="offers-flagship" />}
        {section === 'services'       && <SectionServices key="services" />}
        {section === 'delivery'       && <SectionDelivery key="delivery" />}
        {section === 'alliances'      && <SectionAlliances key="alliances" />}
        {section === 'innovation'     && <SectionInnovation key="innovation" />}
        {section === 'ai-foursys'    && <SectionAIFoursys key="ai-foursys" />}

        {/* ── Provas ── */}
        {section === 'cases'              && <SectionCases key="cases" />}
        {section === 'testimonials'       && <SectionTestimonials key="testimonials" />}
        {section === 'awards'             && <SectionAwards key="awards" />}
        {section === 'clients-showcase'   && <SectionClients key="clients-showcase" />}
        {section === 'capabilities'       && <SectionCapabilities key="capabilities" />}

        {/* ── ESG ── */}
        {section === 'esg'            && <SectionESG key="esg" />}

        {/* ── Referência ── */}
        {section === 'insights'       && <SectionInsights key="insights" />}
        {section === 'faq'            && <SectionFAQ key="faq" />}
        {section === 'export-pdf'     && <SectionExportPdf key="export-pdf" />}

        {/* ── Seções de Cliente (dinâmicas) ── */}
        {section === 'client-opening'  && <SectionClientOpening key="client-opening" />}
        {section === 'client-insights' && <SectionClientInsights key="client-insights" />}
        {section === 'client-cases'    && <SectionClientCases key="client-cases" />}
        {section === 'client-extra-1'  && <SectionClientExtra1 key="client-extra-1" />}
        {section === 'client-extra-2'  && <SectionClientExtra2 key="client-extra-2" />}
      </AnimatePresence>
    </Suspense>
  )
}
