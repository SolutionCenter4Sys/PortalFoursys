import { useEffect, useRef, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { useSessionHistory } from './useSessionHistory'
import type { SessionRecord } from '../types'
import { getClientById } from '../data/clients'

const CTA_KEY = 'foursysportal_cta_clicks'

export interface CTAClickMap {
  [label: string]: number
}

function loadCTAClicks(): CTAClickMap {
  try {
    const raw = localStorage.getItem(CTA_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function persistCTAClicks(map: CTAClickMap) {
  try {
    localStorage.setItem(CTA_KEY, JSON.stringify(map))
  } catch { /* storage full */ }
}

export function trackCTAClick(label: string) {
  const map = loadCTAClicks()
  map[label] = (map[label] ?? 0) + 1
  persistCTAClicks(map)
}

export function getCTAClicks(): CTAClickMap {
  return loadCTAClicks()
}

export function useSessionPersistence() {
  const { state, getSectionLabel } = useApp()
  const { save } = useSessionHistory()
  const savedRef = useRef(false)

  const buildRecord = useCallback((): SessionRecord => {
    const now = Date.now()
    const elapsed = Math.round((now - state.sessionStartedAt) / 1000)
    const activeClient = state.activeClientId ? getClientById(state.activeClientId) : null
    const topSections = [...state.sessionStats]
      .sort((a, b) => b.totalSeconds - a.totalSeconds)
      .slice(0, 5)
      .map(s => ({ section: s.section, seconds: s.totalSeconds }))

    return {
      id: String(state.sessionStartedAt),
      date: new Date(state.sessionStartedAt).toISOString(),
      clientId: state.activeClientId,
      clientName: activeClient?.name ?? null,
      profileSector: state.sessionProfile?.sector ?? null,
      profileRole: state.sessionProfile?.role ?? null,
      trailId: state.currentTrailId,
      durationSeconds: elapsed,
      sectionsVisited: state.sessionStats.filter(s => s.totalSeconds > 0).length,
      topSections,
      interestedSections: state.interestedSections,
    }
  }, [state, getSectionLabel])

  useEffect(() => {
    const onBeforeUnload = () => {
      if (savedRef.current) return
      if (state.sessionStats.length === 0) return
      savedRef.current = true
      save(buildRecord())
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [state.sessionStats, buildRecord, save])

  return { trackCTAClick, getCTAClicks, buildRecord }
}
