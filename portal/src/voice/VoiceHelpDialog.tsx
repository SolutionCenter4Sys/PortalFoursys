/**
 * VoiceHelpDialog — overlay com lista dinâmica de comandos disponíveis
 * na sessão atual. Mostra:
 *   - Atalhos gerais (ajuda, pausar, alternar, navegar, busca)
 *   - Caixas focáveis na sessão atual (estáticas + descobertas no DOM)
 *   - Filtros descobertos no DOM agrupados por grupo
 *   - Última transcrição + intenção classificada (debug útil ao vivo)
 */
import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mic, Volume2, VolumeX } from 'lucide-react'
import { useVoice } from './VoiceProvider'
import { useApp } from '../context/AppContext'
import { useLanguage } from '../i18n'
import { idiomaVozFrom, type FiltroDisponivel } from './types'

export function VoiceHelpDialog() {
  const voice = useVoice()
  const { state, activeNavigationItems } = useApp()
  const { t, lang } = useLanguage()
  const idioma = idiomaVozFrom(lang)

  const aberto = voice.ajudaAberta

  const caixasNaSecao = useMemo(() => {
    if (!aberto) return []
    const todas = voice.snapshotCaixas()
    return todas.filter((c) => c.secao === state.currentSection)
  }, [aberto, voice, state.currentSection])

  const detalhesNaSecao = useMemo(() => {
    if (!aberto) return []
    const todos = voice.snapshotDetalhes()
    return todos.filter((d) => d.secao === state.currentSection)
  }, [aberto, voice, state.currentSection])

  const filtros = useMemo(() => (aberto ? voice.snapshotFiltros() : []), [aberto, voice])

  const filtrosPorGrupo = useMemo(() => {
    const map = new Map<string, FiltroDisponivel[]>()
    for (const f of filtros) {
      const arr = map.get(f.grupo) ?? []
      arr.push(f)
      map.set(f.grupo, arr)
    }
    return Array.from(map.entries())
  }, [filtros])

  const proximas = useMemo(() => {
    const idx = activeNavigationItems.findIndex((n) => n.id === state.currentSection)
    return [activeNavigationItems[idx - 1], activeNavigationItems[idx + 1]].filter(Boolean)
  }, [activeNavigationItems, state.currentSection])

  if (!voice.isSupported) return null

  const exemplosBase = idioma === 'en-US'
    ? [
        '"help"',
        '"pause voice"',
        '"toggle theme" / "toggle language"',
        '"open menu" / "fullscreen" / "agenda"',
        '"next" / "previous" / "home"',
        '"scroll down" / "scroll up" / "go to top" / "go to bottom"',
        '"go to <section>"',
        '"search for <term>"',
        '"select client <name>"',
        '"explore <item>" / "tell me about <item>"',
        '"show details" / "explore this" (no name needed)',
        '"close detail" / "close modal"',
        '"back" / "go back" (closes modal → unfocuses → previous section)',
      ]
    : [
        '"ajuda"',
        '"pausar voz"',
        '"alternar tema" / "alternar idioma"',
        '"abrir menu" / "tela cheia" / "agenda"',
        '"próximo" / "anterior" / "início"',
        '"descer a página" / "subir a página" / "ir para o topo" / "fim da página"',
        '"ir para <sessão>"',
        '"buscar por <termo>"',
        '"selecionar cliente <nome>"',
        '"explorar <item>" / "me conta sobre <item>"',
        '"trazer detalhes" / "explorar isso" (sem precisar do nome)',
        '"fechar detalhe" / "fechar modal"',
        '"voltar" (fecha modal → tira foco da caixa → seção anterior)',
      ]

  return (
    <AnimatePresence>
      {aberto && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={voice.fecharAjuda}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-12 sm:top-16 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-3 sm:px-0"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="voice-help-title"
              className="bg-foursys-dark-2/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex items-center gap-3 p-4 border-b border-white/10">
                <Mic
                  size={18}
                  className={voice.status === 'listening' ? 'text-red-400' : 'text-foursys-primary'}
                />
                <div className="flex-1">
                  <h2 id="voice-help-title" className="text-sm font-bold text-foursys-text">
                    {t('voice.helpTitle')}
                  </h2>
                  <p className="text-[11px] text-foursys-text-dim">
                    {t('voice.helpSubtitle')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={voice.toggleSilenciado}
                  aria-label={voice.silenciado ? t('voice.unmute') : t('voice.mute')}
                  className="p-1.5 rounded-lg hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text transition-colors"
                >
                  {voice.silenciado ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
                <button
                  type="button"
                  onClick={voice.fecharAjuda}
                  aria-label={t('common.close')}
                  className="p-1.5 rounded-lg hover:bg-white/8 text-foursys-text-dim hover:text-foursys-text transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="max-h-[65dvh] overflow-y-auto stealth-scrollbar p-4 space-y-5">
                {/* Última transcrição */}
                {voice.transcricaoUltima && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-1">
                      {t('voice.lastTranscription')}
                    </div>
                    <div className="text-sm text-foursys-text">"{voice.transcricaoUltima}"</div>
                    {voice.intencaoUltima && (
                      <div className="text-[11px] text-foursys-text-dim mt-1">
                        {t('voice.intent')}: <span className="text-foursys-primary">{voice.intencaoUltima.tipo}</span>
                        {voice.mensagemUltima && (
                          <>
                            {' · '}
                            <span className="text-foursys-text-muted">{voice.mensagemUltima}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Atalhos gerais */}
                <Section title={t('voice.generalShortcuts')}>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {exemplosBase.map((ex) => (
                      <li
                        key={ex}
                        className="text-xs text-foursys-text-muted flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]"
                      >
                        <kbd className="text-[10px] text-foursys-primary">{ex}</kbd>
                      </li>
                    ))}
                  </ul>
                </Section>

                {/* Próximas sessões */}
                {proximas.length > 0 && (
                  <Section title={t('voice.nearbySections')}>
                    <ul className="flex flex-wrap gap-1.5">
                      {proximas.map((nav) => (
                        <li
                          key={nav.id}
                          className="text-[11px] text-foursys-text-muted px-2 py-1 rounded-full border border-white/[0.08] bg-white/[0.03]"
                        >
                          "{nav.label}"
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                {/* Caixas da sessão atual */}
                {caixasNaSecao.length > 0 && (
                  <Section title={t('voice.boxesOnPage')}>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {caixasNaSecao.map((c) => (
                        <li
                          key={c.id}
                          className="text-xs text-foursys-text-muted flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]"
                        >
                          <span className="text-[10px] text-foursys-primary">"{idioma === 'en-US' ? 'open box of' : 'abrir caixa de'} {c.rotulo}"</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                {/* Detalhes drilláveis da sessão atual */}
                {detalhesNaSecao.length > 0 && (
                  <Section title={t('voice.detailsOnPage')}>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {detalhesNaSecao.map((d) => (
                        <li
                          key={d.id}
                          className="text-xs text-foursys-text-muted flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]"
                        >
                          <span className="text-[10px] text-foursys-primary">"{idioma === 'en-US' ? 'explore' : 'explorar'} {d.rotulo}"</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}

                {/* Filtros disponíveis */}
                {filtrosPorGrupo.length > 0 && (
                  <Section title={t('voice.filtersOnPage')}>
                    <div className="space-y-2">
                      {filtrosPorGrupo.map(([grupo, items]) => (
                        <div key={grupo} className="rounded-md bg-white/[0.02] border border-white/[0.06] p-2">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-foursys-text-dim mb-1">
                            {grupo}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {items.map((f) => (
                              <span
                                key={`${grupo}::${f.valor}`}
                                className="text-[11px] text-foursys-text-muted px-2 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.03]"
                                title={`"${idioma === 'en-US' ? 'filter by' : 'filtrar por'} ${f.rotulo}"`}
                              >
                                "{f.rotulo}"
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Caixa de comandos sem caixas/filtros/detalhes */}
                {caixasNaSecao.length === 0 &&
                  detalhesNaSecao.length === 0 &&
                  filtrosPorGrupo.length === 0 && (
                    <p className="text-xs text-foursys-text-dim italic">
                      {t('voice.noBoxesOrFilters')}
                    </p>
                  )}
              </div>

              <div className="px-4 py-2.5 border-t border-white/10 text-[11px] text-foursys-text-dim flex items-center justify-between">
                <span>{t('voice.tipPressV')}</span>
                <span>{voice.silenciado ? t('voice.muted') : t('voice.audioOn')}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-foursys-primary mb-1.5">
        {title}
      </h3>
      {children}
    </div>
  )
}
