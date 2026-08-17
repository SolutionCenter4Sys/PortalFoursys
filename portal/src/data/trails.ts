import type { Trail } from '../types'
import type { Language } from '../i18n/types'

const trailsPt: Trail[] = [
  {
    id: 'express',
    label: 'Trilha Express',
    description: 'Visão estratégica essencial — do posicionamento ao resultado em tempo reduzido',
    icon: 'zap',
    duration: '25 min',
    audience: 'C-Level com agenda restrita',
    color: 'foursys-primary',
    colorHex: '#FF6600',
    steps: [
      { sectionId: 'home',           estimatedMinutes: 3 },
      { sectionId: 'identity',       estimatedMinutes: 5 },
      { sectionId: 'offers-flagship',estimatedMinutes: 7 },
      { sectionId: 'cases',          estimatedMinutes: 7 },
      { sectionId: 'alliances',      estimatedMinutes: 3 },
    ]
  },
  {
    id: 'executiva',
    label: 'Trilha Executiva',
    description: 'Jornada completa — contexto, diferenciação, serviços e prova de resultado',
    icon: 'target',
    duration: '90 min',
    audience: 'Comitê executivo · Diretores',
    color: 'violet-500',
    colorHex: '#8B5CF6',
    steps: [
      { sectionId: 'home',           estimatedMinutes: 3  },
      { sectionId: 'identity',       estimatedMinutes: 5  },
      { sectionId: 'timeline',       estimatedMinutes: 5  },
      { sectionId: 'global',         estimatedMinutes: 5  },
      { sectionId: 'offers-flagship',estimatedMinutes: 10 },
      { sectionId: 'services',       estimatedMinutes: 10 },
      { sectionId: 'delivery',       estimatedMinutes: 8  },
      { sectionId: 'alliances',      estimatedMinutes: 6  },
      { sectionId: 'cases',          estimatedMinutes: 10 },
      { sectionId: 'awards',         estimatedMinutes: 4  },
      { sectionId: 'clients-showcase', estimatedMinutes: 3 },
      { sectionId: 'esg',            estimatedMinutes: 5  },
      { sectionId: 'faq',            estimatedMinutes: 6  },
    ]
  },
  {
    id: 'tech',
    label: 'Trilha Tech',
    description: 'Capacidades técnicas, IA e modernização — para quem quer profundidade técnica',
    icon: 'brain-circuit',
    duration: '45 min',
    audience: 'CTO · Arquitetos · Tech Leads',
    color: 'cyan-400',
    colorHex: '#00C2E0',
    steps: [
      { sectionId: 'home',           estimatedMinutes: 3  },
      { sectionId: 'offers-flagship',estimatedMinutes: 8  },
      { sectionId: 'alliances',      estimatedMinutes: 8  },
      { sectionId: 'services',       estimatedMinutes: 12 },
      { sectionId: 'capabilities',   estimatedMinutes: 8  },
    ]
  },
  {
    id: 'negocio',
    label: 'Trilha Negócio',
    description: 'ROI, cases de impacto e ecossistema de alianças — foco em crescimento',
    icon: 'bar-chart',
    duration: '50 min',
    audience: 'CEO · CFO · Diretores de Negócio',
    color: 'green-400',
    colorHex: '#4ADE80',
    steps: [
      { sectionId: 'home',           estimatedMinutes: 3  },
      { sectionId: 'identity',       estimatedMinutes: 5  },
      { sectionId: 'offers-flagship',estimatedMinutes: 10 },
      { sectionId: 'cases',          estimatedMinutes: 12 },
      { sectionId: 'awards',         estimatedMinutes: 4  },
      { sectionId: 'clients-showcase', estimatedMinutes: 3 },
      { sectionId: 'alliances',      estimatedMinutes: 5  },
      { sectionId: 'esg',            estimatedMinutes: 5  },
      { sectionId: 'insights',       estimatedMinutes: 5  },
      { sectionId: 'faq',            estimatedMinutes: 5  },
    ]
  }
]

const trailsEn: Trail[] = [
  {
    id: 'express',
    label: 'Express Trail',
    description: 'Essential strategic overview — from positioning to results in reduced time',
    icon: 'zap',
    duration: '25 min',
    audience: 'C-Level with tight schedule',
    color: 'foursys-primary',
    colorHex: '#FF6600',
    steps: [
      { sectionId: 'home',           estimatedMinutes: 3 },
      { sectionId: 'identity',       estimatedMinutes: 5 },
      { sectionId: 'offers-flagship',estimatedMinutes: 7 },
      { sectionId: 'cases',          estimatedMinutes: 7 },
      { sectionId: 'alliances',      estimatedMinutes: 3 },
    ]
  },
  {
    id: 'executiva',
    label: 'Executive Trail',
    description: 'Complete journey — context, differentiation, services and proven results',
    icon: 'target',
    duration: '90 min',
    audience: 'Executive committee · Directors',
    color: 'violet-500',
    colorHex: '#8B5CF6',
    steps: [
      { sectionId: 'home',           estimatedMinutes: 3  },
      { sectionId: 'identity',       estimatedMinutes: 5  },
      { sectionId: 'timeline',       estimatedMinutes: 5  },
      { sectionId: 'global',         estimatedMinutes: 5  },
      { sectionId: 'offers-flagship',estimatedMinutes: 10 },
      { sectionId: 'services',       estimatedMinutes: 10 },
      { sectionId: 'delivery',       estimatedMinutes: 8  },
      { sectionId: 'alliances',      estimatedMinutes: 6  },
      { sectionId: 'cases',          estimatedMinutes: 10 },
      { sectionId: 'awards',         estimatedMinutes: 4  },
      { sectionId: 'clients-showcase', estimatedMinutes: 3 },
      { sectionId: 'esg',            estimatedMinutes: 5  },
      { sectionId: 'faq',            estimatedMinutes: 6  },
    ]
  },
  {
    id: 'tech',
    label: 'Tech Trail',
    description: 'Technical capabilities, AI and modernization — for those seeking technical depth',
    icon: 'brain-circuit',
    duration: '45 min',
    audience: 'CTO · Architects · Tech Leads',
    color: 'cyan-400',
    colorHex: '#00C2E0',
    steps: [
      { sectionId: 'home',           estimatedMinutes: 3  },
      { sectionId: 'offers-flagship',estimatedMinutes: 8  },
      { sectionId: 'alliances',      estimatedMinutes: 8  },
      { sectionId: 'services',       estimatedMinutes: 12 },
      { sectionId: 'capabilities',   estimatedMinutes: 8  },
    ]
  },
  {
    id: 'negocio',
    label: 'Business Trail',
    description: 'ROI, impact cases and alliance ecosystem — focused on growth',
    icon: 'bar-chart',
    duration: '50 min',
    audience: 'CEO · CFO · Business Directors',
    color: 'green-400',
    colorHex: '#4ADE80',
    steps: [
      { sectionId: 'home',           estimatedMinutes: 3  },
      { sectionId: 'identity',       estimatedMinutes: 5  },
      { sectionId: 'offers-flagship',estimatedMinutes: 10 },
      { sectionId: 'cases',          estimatedMinutes: 12 },
      { sectionId: 'awards',         estimatedMinutes: 4  },
      { sectionId: 'clients-showcase', estimatedMinutes: 3 },
      { sectionId: 'alliances',      estimatedMinutes: 5  },
      { sectionId: 'esg',            estimatedMinutes: 5  },
      { sectionId: 'insights',       estimatedMinutes: 5  },
      { sectionId: 'faq',            estimatedMinutes: 5  },
    ]
  }
]

export const trails = trailsPt

export function getTrails(lang: Language): Trail[] {
  return lang === 'en' ? trailsEn : trailsPt
}

export function getTrailById(id: string, lang?: Language): Trail | undefined {
  const list = lang ? getTrails(lang) : trails
  return list.find(t => t.id === id)
}
