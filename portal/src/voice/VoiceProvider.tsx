/**
 * VoiceProvider — distribui o estado do assistente de voz para
 * componentes irmãos (TopBar, dialog de ajuda, etc) sem prop drilling.
 */
import { createContext, useContext, type ReactNode } from 'react'
import { useVoiceAssistant } from './useVoiceAssistant'

type VoiceContextValue = ReturnType<typeof useVoiceAssistant>

const VoiceContext = createContext<VoiceContextValue | null>(null)

export function VoiceProvider({ children }: { children: ReactNode }) {
  const value = useVoiceAssistant()
  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
}

export function useVoice() {
  const ctx = useContext(VoiceContext)
  if (!ctx) throw new Error('useVoice deve ser usado dentro de VoiceProvider')
  return ctx
}
