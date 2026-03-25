import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Clock, MapPin, Star, User } from 'lucide-react'
import { useSessionHistory } from '../../hooks/useSessionHistory'
import type { SessionRecord } from '../../types'

// ─── Utilidades ──────────────────────────────────────────────────────────────

function formatHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const ROLE_LABELS: Record<string, string> = {
  ceo: 'CEO', cfo: 'CFO', cto: 'CTO', diretor: 'Diretor', gestor: 'Gestor',
}
const SECTOR_LABELS: Record<string, string> = {
  financeiro: 'Financeiro', saude: 'Saúde', seguros: 'Seguros', outro: 'Outro',
}

// ─── Card de uma sessão ───────────────────────────────────────────────────────

function RecordCard({ record }: { record: SessionRecord }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3.5 rounded-xl bg-foursys-dark-3/50 border border-white/[0.06] hover:border-white/10 transition-colors"
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div>
          <p className="text-xs font-semibold text-foursys-text leading-tight">
            {record.clientName ?? 'Institucional'}
          </p>
          <p className="text-[10px] text-foursys-text-dim mt-0.5">{formatDate(record.date)}</p>
        </div>
        {record.profileRole && (
          <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-foursys-blue/10 border border-foursys-blue/20 text-foursys-cyan text-[9px] font-semibold">
            {ROLE_LABELS[record.profileRole] ?? record.profileRole}
            {record.profileSector ? ` · ${SECTOR_LABELS[record.profileSector] ?? record.profileSector}` : ''}
          </span>
        )}
      </div>

      {/* KPIs */}
      <div className="flex items-center gap-3 mb-2.5">
        <span className="flex items-center gap-1 text-[10px] text-foursys-text-dim">
          <Clock size={9} className="text-foursys-blue" />
          {formatHMS(record.durationSeconds)}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-foursys-text-dim">
          <MapPin size={9} className="text-foursys-blue" />
          {record.sectionsVisited} seções
        </span>
        {record.interestedSections.length > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-amber-300/70">
            <Star size={9} className="fill-amber-400 text-amber-400" />
            {record.interestedSections.length} interesse{record.interestedSections.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Top seções */}
      {record.topSections.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {record.topSections.map(ts => (
            <span
              key={ts.section}
              className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[9px] text-foursys-text-dim"
            >
              {ts.section}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function SessionHistory() {
  const { load, clear } = useSessionHistory()
  const [records, setRecords] = useState<SessionRecord[]>([])

  useEffect(() => {
    setRecords(load())
  }, [])

  function handleClear() {
    clear()
    setRecords([])
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <User size={28} className="text-foursys-text-dim mb-3" />
        <p className="text-xs text-foursys-text-dim">
          Nenhuma sessão salva ainda.
          <br />
          Gere um resumo para registrar a primeira.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-foursys-text-dim uppercase tracking-widest">
          {records.length} sessão{records.length > 1 ? 'ões' : ''} salva{records.length > 1 ? 's' : ''}
        </span>
        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-[10px] text-foursys-text-dim hover:text-red-400 transition-colors"
        >
          <Trash2 size={10} />
          Limpar histórico
        </button>
      </div>
      {records.map(r => (
        <RecordCard key={r.id} record={r} />
      ))}
    </div>
  )
}
