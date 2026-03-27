import {
  Home, Users, User, Clock, Globe, Rocket, LayoutGrid, Package,
  GitMerge, ShieldCheck, ShieldAlert, BrainCircuit, Hammer, Network,
  Trophy, Code2, HelpCircle, Leaf, Building2, ScanEye, Zap, Star,
  Award, Briefcase, FileText, Heart, TreePine, Target, Lightbulb,
  Lock, Telescope, MessageCircle, Scissors, Flag, GraduationCap,
  Crown, DollarSign, Monitor, Settings, BarChart3, Cloud, Link2,
  CheckCircle2, Calendar, ClipboardList, Wrench, Search, Brain,
  Landmark, Bell, CreditCard, FolderOpen, Pencil, Mic, FlaskConical,
  Palette, Blocks, Ruler, BrickWall, AlertTriangle, Handshake,
  Sprout, Cpu, type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  users: Users,
  user: User,
  clock: Clock,
  calendar: Calendar,
  globe: Globe,
  rocket: Rocket,
  'layout-grid': LayoutGrid,
  package: Package,
  'git-merge': GitMerge,
  'shield-check': ShieldCheck,
  'shield-alert': ShieldAlert,
  'brain-circuit': BrainCircuit,
  brain: Brain,
  hammer: Hammer,
  wrench: Wrench,
  network: Network,
  trophy: Trophy,
  code: Code2,
  'help-circle': HelpCircle,
  leaf: Leaf,
  sprout: Sprout,
  building: Building2,
  landmark: Landmark,
  'scan-eye': ScanEye,
  zap: Zap,
  star: Star,
  award: Award,
  briefcase: Briefcase,
  'file-text': FileText,
  heart: Heart,
  'tree-pine': TreePine,
  target: Target,
  lightbulb: Lightbulb,
  lock: Lock,
  telescope: Telescope,
  'message-circle': MessageCircle,
  scissors: Scissors,
  flag: Flag,
  'graduation-cap': GraduationCap,
  crown: Crown,
  'dollar-sign': DollarSign,
  monitor: Monitor,
  settings: Settings,
  'bar-chart': BarChart3,
  cloud: Cloud,
  link: Link2,
  'check-circle': CheckCircle2,
  'clipboard-list': ClipboardList,
  search: Search,
  bell: Bell,
  'credit-card': CreditCard,
  'folder-open': FolderOpen,
  pencil: Pencil,
  mic: Mic,
  flask: FlaskConical,
  palette: Palette,
  blocks: Blocks,
  ruler: Ruler,
  'brick-wall': BrickWall,
  'alert-triangle': AlertTriangle,
  handshake: Handshake,
  cpu: Cpu,
}

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Star
}

export function DynIcon({
  name,
  size = 18,
  className = '',
  style,
}: {
  name: string
  size?: number
  className?: string
  style?: React.CSSProperties
}) {
  const Icon = ICON_MAP[name] ?? Star
  return <Icon size={size} className={className} style={style} />
}
