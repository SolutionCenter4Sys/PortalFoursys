import { AnimatePresence } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { SectionOpening } from './sections/SectionOpening'
import { SectionIdentity } from './sections/SectionIdentity'
import { SectionTimeline } from './sections/SectionTimeline'
import { SectionGlobal } from './sections/SectionGlobal'
import { SectionSantanderInsights } from './sections/SectionSantanderInsights'
import { SectionQualityIA } from './sections/SectionQualityIA'
import { SectionSHICase } from './sections/SectionSHICase'
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
import { SectionFAQ } from './sections/SectionFAQ'

export function SectionRenderer() {
  const { state } = useApp()

  return (
    <AnimatePresence mode="wait">
      {state.currentSection === 'opening' && <SectionOpening key="opening" />}
      {state.currentSection === 'identity' && <SectionIdentity key="identity" />}
      {state.currentSection === 'timeline' && <SectionTimeline key="timeline" />}
      {state.currentSection === 'global' && <SectionGlobal key="global" />}
      {state.currentSection === 'santander-insights' && <SectionSantanderInsights key="santander-insights" />}
      {state.currentSection === 'quality-ia' && <SectionQualityIA key="quality-ia" />}
      {state.currentSection === 'shi-case' && <SectionSHICase key="shi-case" />}
      {state.currentSection === 'services' && <SectionServices key="services" />}
      {state.currentSection === 'delivery' && <SectionDelivery key="delivery" />}
      {state.currentSection === 'sdd-legacy' && <SectionSDD key="sdd-legacy" />}
      {state.currentSection === 'cyber-security' && <SectionCyberSecurity key="cyber-security" />}
      {state.currentSection === 'fourblock' && <SectionFourblock key="fourblock" />}
      {state.currentSection === 'lab-ia' && <SectionLabIA key="lab-ia" />}
      {state.currentSection === 'fourmakers' && <SectionFourmakers key="fourmakers" />}
      {state.currentSection === 'alliances' && <SectionAlliances key="alliances" />}
      {state.currentSection === 'cases' && <SectionCases key="cases" />}
      {state.currentSection === 'capabilities' && <SectionCapabilities key="capabilities" />}
      {state.currentSection === 'faq' && <SectionFAQ key="faq" />}
    </AnimatePresence>
  )
}
