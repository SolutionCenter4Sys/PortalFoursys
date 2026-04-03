import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Blocks,
  BrainCircuit,
  CheckCircle2,
  CloudCog,
  GitMerge,
  Layers3,
  Network,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-react'

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  'outsourcing-sustentacao': Users,
  'modernizacao-legados': GitMerge,
  'arquitetura-devops': Layers3,
  'integracoes-open-finance': Network,
  'engenharia-software-ia': BrainCircuit,
  'ai-augmented-squad': Sparkles,
  'cloud-finops': CloudCog,
  'dados-analytics': BarChart3,
  'quality-testes-ia': CheckCircle2,
  'ciberseguranca': ShieldCheck,
  'fourblox': Blocks,
  'hiperautomacao-rpa': Workflow,
}

export const SERVICE_VISUALS: Record<
  string,
  { text: string; softBg: string; border: string; glow: string }
> = {
  'outsourcing-sustentacao': { text: 'text-indigo-300', softBg: 'bg-indigo-400/15', border: 'border-indigo-400/35', glow: '#31458A' },
  'modernizacao-legados': { text: 'text-violet-300', softBg: 'bg-violet-400/15', border: 'border-violet-400/35', glow: '#7C3AED' },
  'arquitetura-devops': { text: 'text-fuchsia-300', softBg: 'bg-fuchsia-400/15', border: 'border-fuchsia-400/35', glow: '#B832C8' },
  'integracoes-open-finance': { text: 'text-pink-300', softBg: 'bg-pink-400/15', border: 'border-pink-400/35', glow: '#DB2777' },
  'engenharia-software-ia': { text: 'text-rose-300', softBg: 'bg-rose-400/15', border: 'border-rose-400/35', glow: '#F43F5E' },
  'ai-augmented-squad': { text: 'text-orange-300', softBg: 'bg-orange-500/15', border: 'border-orange-500/35', glow: '#FF6600' },
  'cloud-finops': { text: 'text-orange-300', softBg: 'bg-orange-400/15', border: 'border-orange-400/35', glow: '#FB923C' },
  'dados-analytics': { text: 'text-amber-300', softBg: 'bg-amber-400/15', border: 'border-amber-400/35', glow: '#F59E0B' },
  'quality-testes-ia': { text: 'text-yellow-200', softBg: 'bg-yellow-300/15', border: 'border-yellow-300/35', glow: '#FACC15' },
  'ciberseguranca': { text: 'text-lime-200', softBg: 'bg-lime-300/15', border: 'border-lime-300/35', glow: '#A3E635' },
  'fourblox': { text: 'text-emerald-200', softBg: 'bg-emerald-300/15', border: 'border-emerald-300/35', glow: '#34D399' },
  'hiperautomacao-rpa': { text: 'text-cyan-200', softBg: 'bg-cyan-300/15', border: 'border-cyan-300/35', glow: '#67E8F9' },
}

export const DEFAULT_VISUAL = SERVICE_VISUALS['modernizacao-legados']
export const DEFAULT_ICON = Layers3
