import { createContext, useContext, useCallback, useMemo, useState, useEffect, type ReactNode } from 'react'
import type { Language } from './types'
import { pt } from './translations/pt'
import { en } from './translations/en'

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'foursys_lang'

const translations: Record<Language, Record<string, unknown>> = { pt, en }

function resolve(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.')
  let current: unknown = obj
  for (const p of parts) {
    if (current == null || typeof current !== 'object') return path
    current = (current as Record<string, unknown>)[p]
  }
  return typeof current === 'string' ? current : path
}

function getInitialLang(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'pt' || stored === 'en') return stored
  } catch { /* SSR / incognito */ }
  return 'pt'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLang)

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en')
    try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* noop */ }
  }, [lang])

  const setLang = useCallback((l: Language) => setLangState(l), [])

  const t = useCallback(
    (key: string) => resolve(translations[lang], key),
    [lang],
  )

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t }),
    [lang, setLang, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
