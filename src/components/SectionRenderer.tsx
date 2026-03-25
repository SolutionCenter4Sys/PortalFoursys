import { AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { SectionHome } from './sections/SectionHome'
import { SectionIdentity } from './sections/SectionIdentity'
import { SectionTimeline } from './sections/SectionTimeline'
import { SectionGlobal } from './sections/SectionGlobal'
import { SectionOffersFlag } from './sections/SectionOffersFlag'
import { SectionServices } from './sections/SectionServices'
import { SectionDelivery } from './sections/SectionDelivery'
import { SectionSDD } from './sections/SectionSDD'
import { SectionCyberSecurity } from './sections/SectionCyberSecurity'
import { SectionFourblock } from './sections/SectionFourblock'
import { SectionLabIA } from './sections/SectionLabIA'
import { SectionFourmakers } from './sections/SectionFourmakers'
import { SectionAlliances } from './sections/SectionAlliances'
import { SectionCases } from './sections/SectionCases'
import { SectionCapabilities } from './sections/SectionCapabilities'
import { SectionESG } from './sections/SectionESG'
import { SectionFAQ } from './sections/SectionFAQ'
// Client sections
import { SectionClientOpening } from './sections/client/SectionClientOpening'
import { SectionClientInsights } from './sections/client/SectionClientInsights'
import { SectionClientCases } from './sections/client/SectionClientCases'
import { SectionClientExtra1 } from './sections/client/SectionClientExtra1'

export function SectionRenderer() {
  const { state } = useApp()
  const section = state.currentSection

  return (
    <AnimatePresence mode="wait">
      {/* ── Início ── */}
      {section === 'home'           && <SectionHome key="home" />}

      {/* ── Institucional ── */}
      {section === 'identity'       && <SectionIdentity key="identity" />}
      {section === 'timeline'       && <SectionTimeline key="timeline" />}
      {section === 'global'         && <SectionGlobal key="global" />}

      {/* ── Ofertas ── */}
      {section === 'offers-flagship' && <SectionOffersFlag key="offers-flagship" />}

      {/* ── Serviços ── */}
      {section === 'services'       && <SectionServices key="services" />}
      {section === 'delivery'       && <SectionDelivery key="delivery" />}
      {section === 'sdd-legacy'     && <SectionSDD key="sdd-legacy" />}
      {section === 'cyber-security' && <SectionCyberSecurity key="cyber-security" />}
      {section === 'fourblock'      && <SectionFourblock key="fourblock" />}

      {/* ── Inovação ── */}
      {section === 'lab-ia'         && <SectionLabIA key="lab-ia" />}
      {section === 'fourmakers'     && <SectionFourmakers key="fourmakers" />}
      {section === 'alliances'      && <SectionAlliances key="alliances" />}

      {/* ── Provas ── */}
      {section === 'cases'          && <SectionCases key="cases" />}
      {section === 'capabilities'   && <SectionCapabilities key="capabilities" />}

      {/* ── ESG ── */}
      {section === 'esg'            && <SectionESG key="esg" />}

      {/* ── Referência ── */}
      {section === 'faq'            && <SectionFAQ key="faq" />}

      {/* ── Seções de Cliente (dinâmicas) ── */}
      {section === 'client-opening'  && <SectionClientOpening key="client-opening" />}
      {section === 'client-insights' && <SectionClientInsights key="client-insights" />}
      {section === 'client-cases'    && <SectionClientCases key="client-cases" />}
      {section === 'client-extra-1'  && <SectionClientExtra1 key="client-extra-1" />}
    </AnimatePresence>
  )
}
