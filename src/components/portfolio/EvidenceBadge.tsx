import { BadgeCheck, FlaskConical, Layers3 } from 'lucide-react'
import { useLanguage } from '../../i18n'
import { EVIDENCE_COLOR } from '../../theme/portfolioTokens'
import type { EvidenceStatus } from '../../types'

// ─── Selo de lastro de prova ─────────────────────────────────────────────────

export const EVIDENCE_STYLE: Record<EvidenceStatus, { color: string; icon: typeof BadgeCheck }> = {
  'liberado': { color: EVIDENCE_COLOR['liberado'], icon: BadgeCheck },
  'em-validacao': { color: EVIDENCE_COLOR['em-validacao'], icon: FlaskConical },
  'sem-lastro': { color: EVIDENCE_COLOR['sem-lastro'], icon: Layers3 },
}

export function EvidenceBadge({ status, compact = false }: { status: EvidenceStatus; compact?: boolean }) {
  const { t } = useLanguage()
  const style = EVIDENCE_STYLE[status]
  const Icon = style.icon

  return (
    <span
      title={t(`portfolio.evidence.${status}Hint`)}
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${
        compact ? 'text-meta px-1.5 py-0.5' : 'text-label px-2 py-1'
      }`}
      style={{ color: style.color, borderColor: `${style.color}44`, backgroundColor: `${style.color}12` }}
    >
      <Icon size={compact ? 9 : 11} aria-hidden="true" />
      {t(`portfolio.evidence.${status}`)}
    </span>
  )
}
