import type { SessionRecord } from '../types'

const STORAGE_KEY = 'foursysportal_sessions_v1'
const MAX_RECORDS = 20

function load(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SessionRecord[]
  } catch {
    return []
  }
}

function save(record: SessionRecord): SessionRecord[] {
  const existing = load()
  const updated = [record, ...existing].slice(0, MAX_RECORDS)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // storage quota exceeded — fail silently
  }
  return updated
}

function clear(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function useSessionHistory() {
  return { load, save, clear }
}
