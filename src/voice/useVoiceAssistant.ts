/**
 * useVoiceAssistant — orquestrador de voz "touchless".
 *
 * Responsabilidades:
 * - Mantém SpeechRecognition (start/stop/toggle) com lang dinâmico.
 * - Construir contexto (navegação, clientes, caixas, filtros) com base
 *   no AppContext + DOM.
 * - Classificar a transcrição via classificadorRegex.
 * - Executar a intenção via ExecutorCallbacks.
 * - Falar feedback via Web Speech.
 *
 * Não substitui o `useVoiceSearch` existente (que continua útil
 * dentro do SearchOverlay). Este hook é de nível superior.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../i18n'
import { getAllClients } from '../data/clients'
import { idiomaVozFrom, navItemFromNavigation, type ContextoClassificacao, type IntencaoVoz, type StatusVoz } from './types'
import { classificadorRegex } from './classifierRegex'
import { catalogoCaixas, descobrirCaixasNoDom } from './catalogoCaixas'
import { descobrirFiltros } from './descobrirFiltros'
import { descobrirDetalhes } from './descobrirDetalhes'
import { executarIntencao, type ExecutorCallbacks } from './executor'
import { falar, pararFala } from './feedback'
import type { AppSection, NavigationItem } from '../types'

const MAX_LISTEN_MS = 12_000

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null
}

interface UseVoiceAssistantReturn {
  readonly status: StatusVoz
  readonly isSupported: boolean
  readonly transcricaoUltima: string
  /** Texto sendo reconhecido em tempo real (interim results). */
  readonly transcricaoAoVivo: string
  readonly intencaoUltima: IntencaoVoz | null
  readonly mensagemUltima: string | null
  readonly ajudaAberta: boolean
  readonly silenciado: boolean
  readonly start: () => void
  readonly stop: () => void
  readonly toggle: () => void
  readonly abrirAjuda: () => void
  readonly fecharAjuda: () => void
  readonly toggleSilenciado: () => void
  /** Snapshot atual de filtros descobertos (útil para o dialog) */
  readonly snapshotFiltros: () => ReturnType<typeof descobrirFiltros>
  /** Snapshot atual de caixas (estáticas + DOM) */
  readonly snapshotCaixas: () => ReturnType<typeof descobrirCaixasNoDom>
  /** Snapshot atual de detalhes drilláveis (DOM) */
  readonly snapshotDetalhes: () => ReturnType<typeof descobrirDetalhes>
}

export function useVoiceAssistant(): UseVoiceAssistantReturn {
  const app = useApp()
  const { toggleTheme } = useTheme()
  const { lang, setLang } = useLanguage()
  const idioma = idiomaVozFrom(lang)

  const [status, setStatus] = useState<StatusVoz>('idle')
  const [transcricaoUltima, setTranscricaoUltima] = useState('')
  const [transcricaoAoVivo, setTranscricaoAoVivo] = useState('')
  const [intencaoUltima, setIntencaoUltima] = useState<IntencaoVoz | null>(null)
  const [mensagemUltima, setMensagemUltima] = useState<string | null>(null)
  const [ajudaAberta, setAjudaAberta] = useState(false)
  const [silenciado, setSilenciado] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSupported = getSpeechRecognition() !== null

  const clientes = useMemo(
    () => getAllClients(lang).map((c) => ({ id: c.id, rotulo: c.name })),
    [lang],
  )

  const navegacao = useMemo(
    () => app.activeNavigationItems.map((n: NavigationItem) => navItemFromNavigation(n)),
    [app.activeNavigationItems],
  )

  // Contexto refeito a cada classificação para refletir DOM atual.
  const contextoRef = useRef<ContextoClassificacao>({ navegacao, clientesDisponiveis: clientes })
  useEffect(() => {
    contextoRef.current = {
      navegacao,
      clientesDisponiveis: clientes,
      caixasDisponiveis: [],
      filtrosDisponiveis: [],
      detalhesDisponiveis: [],
    }
  }, [navegacao, clientes])

  const stopRef = useRef<() => void>(() => {})

  // ─── Executor: callbacks aplicando intenções ────────────────────────────
  // Inicializa com no-op estável; o conteúdo real é construído via useEffect
  // para evitar referenciar refs durante render (regra react-hooks/refs).
  const executorRef = useRef<ExecutorCallbacks>(NOOP_EXECUTOR)
  useEffect(() => {
    executorRef.current = buildExecutor({
      idioma,
      app,
      setLang,
      toggleTheme,
      lang,
      abrirAjuda: () => setAjudaAberta(true),
      pausarVoz: () => stopRef.current(),
    })
  }, [idioma, app, setLang, toggleTheme, lang])

  // ─── Reconhecimento ─────────────────────────────────────────────────────
  const clearSafetyTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    clearSafetyTimeout()
    recognitionRef.current?.stop()
    setStatus('idle')
  }, [clearSafetyTimeout])

  useEffect(() => {
    stopRef.current = stop
  }, [stop])

  const handleTranscricao = useCallback(
    (texto: string) => {
      setTranscricaoUltima(texto)
      const ctx: ContextoClassificacao = {
        navegacao,
        clientesDisponiveis: clientes,
        caixasDisponiveis: [
          ...catalogoCaixas(idioma),
          ...descobrirCaixasNoDom(),
        ],
        filtrosDisponiveis: descobrirFiltros(),
        detalhesDisponiveis: descobrirDetalhes(),
      }
      contextoRef.current = ctx
      setStatus('processing')
      const intencao = classificadorRegex.classificarSync(
        { transcricao: texto, idioma, recebidoEm: Date.now() },
        ctx,
      )
      setIntencaoUltima(intencao)
      const resultado = executarIntencao(intencao, executorRef.current)
      setMensagemUltima(resultado.mensagem)
      if (resultado.mensagem) falar(resultado.mensagem, idioma, { silenciar: silenciado })
      setStatus('idle')
    },
    [navegacao, clientes, idioma, silenciado],
  )

  const start = useCallback(() => {
    const Ctor = getSpeechRecognition()
    if (!Ctor) {
      setStatus('error')
      return
    }
    if (recognitionRef.current) recognitionRef.current.abort()
    clearSafetyTimeout()

    const recognition = new Ctor()
    recognition.lang = idioma
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setStatus('listening')
      setTranscricaoAoVivo('')
      timeoutRef.current = setTimeout(() => recognitionRef.current?.stop(), MAX_LISTEN_MS)
    }
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) final += result[0].transcript
        else interim += result[0].transcript
      }
      // Atualiza preview em tempo real (não classifica ainda).
      setTranscricaoAoVivo((interim + final).trim())
      // Só dispara classificação no resultado final.
      if (final) handleTranscricao(final.trim())
    }
    recognition.onspeechend = () => recognitionRef.current?.stop()
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      clearSafetyTimeout()
      if (event.error === 'aborted' || event.error === 'no-speech') {
        setStatus('idle')
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    }
    recognition.onend = () => {
      clearSafetyTimeout()
      setStatus((s) => (s === 'processing' ? s : 'idle'))
      setTranscricaoAoVivo('')
      recognitionRef.current = null
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch {
      clearSafetyTimeout()
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }, [idioma, handleTranscricao, clearSafetyTimeout])

  const toggle = useCallback(() => {
    if (status === 'listening') stop()
    else start()
  }, [status, start, stop])

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      clearSafetyTimeout()
      recognitionRef.current?.abort()
      recognitionRef.current = null
      pararFala()
    }
  }, [clearSafetyTimeout])

  return {
    status,
    isSupported,
    transcricaoUltima,
    transcricaoAoVivo,
    intencaoUltima,
    mensagemUltima,
    ajudaAberta,
    silenciado,
    start,
    stop,
    toggle,
    abrirAjuda: () => setAjudaAberta(true),
    fecharAjuda: () => setAjudaAberta(false),
    toggleSilenciado: () => setSilenciado((s) => !s),
    snapshotFiltros: () => descobrirFiltros(),
    snapshotCaixas: () => [...catalogoCaixas(idioma), ...descobrirCaixasNoDom()],
    snapshotDetalhes: () => descobrirDetalhes(),
  }
}

// ─── Construtor de callbacks de execução ────────────────────────────────

interface BuildArgs {
  readonly idioma: ReturnType<typeof idiomaVozFrom>
  readonly app: ReturnType<typeof useApp>
  readonly lang: 'pt' | 'en'
  readonly setLang: (lang: 'pt' | 'en') => void
  readonly toggleTheme: () => void
  readonly abrirAjuda: () => void
  readonly pausarVoz: () => void
}

function buildExecutor(args: BuildArgs): ExecutorCallbacks {
  const { app, lang, setLang, toggleTheme, idioma, abrirAjuda, pausarVoz } = args

  return {
    idioma,

    navegar: (secao) => app.navigate(secao),
    direcao: (d) => {
      const idx = app.activeNavigationItems.findIndex((n) => n.id === app.state.currentSection)
      if (d === 'proximo') {
        const next = app.activeNavigationItems[idx + 1]
        if (next) app.navigate(next.id as AppSection)
      } else if (d === 'anterior') {
        const prev = app.activeNavigationItems[idx - 1]
        if (prev) app.navigate(prev.id as AppSection)
      } else {
        app.navigate('home')
      }
    },

    alternar: (alvo) => {
      switch (alvo) {
        case 'tema':
          toggleTheme()
          break
        case 'idioma':
          setLang(lang === 'pt' ? 'en' : 'pt')
          break
        case 'fullscreen':
          app.toggleFullscreen()
          break
        case 'menu':
          app.toggleMenu()
          break
        case 'overview':
          app.toggleOverview()
          break
        case 'cliente-selector':
          app.toggleClientSelector()
          break
        case 'export-pdf':
          app.toggleExportModal()
          break
        case 'analytics':
          app.toggleMetricsPanel()
          break
        case 'busca':
          app.openSearch()
          break
      }
    },

    buscar: (termo) => {
      app.openSearch()
      // Pequeno delay para permitir que o overlay monte antes de despachar
      setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>(
          '[role="dialog"] input[type="text"], [role="dialog"] input',
        )
        if (input) {
          const setter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value',
          )?.set
          setter?.call(input, termo)
          input.dispatchEvent(new Event('input', { bubbles: true }))
          input.focus()
        }
      }, 220)
    },

    selecionarCliente: (nomeOuId) => {
      const all = getAllClients(lang)
      const target =
        all.find((c) => c.id === nomeOuId) ??
        all.find((c) => c.name.toLowerCase() === nomeOuId.toLowerCase())
      if (!target) return false
      app.setClient(target.id)
      return true
    },

    abrirCaixa: (caixaId) => {
      const el = document.querySelector<HTMLElement>(`[data-voz-caixa="${cssEscape(caixaId)}"]`)
      if (!el) return false
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
        el.setAttribute('data-voz-caixa-foco', 'true')
        el.focus({ preventScroll: true })
        // limpa foco anterior em outros elementos
        document
          .querySelectorAll<HTMLElement>('[data-voz-caixa-foco="true"]')
          .forEach((other) => {
            if (other !== el) other.removeAttribute('data-voz-caixa-foco')
          })
      } catch {
        /* noop */
      }
      return true
    },

    fecharCaixa: () => {
      document
        .querySelectorAll<HTMLElement>('[data-voz-caixa-foco="true"]')
        .forEach((el) => el.removeAttribute('data-voz-caixa-foco'))
    },

    abrirDetalhe: (detalheId) => {
      const el = document.querySelector<HTMLElement>(
        `[data-voz-detalhe="${cssEscape(detalheId)}"]`,
      )
      if (!el) return false
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
        el.click()
      } catch {
        return false
      }
      return true
    },

    fecharDetalhe: () => {
      // 1) fecha overlays Radix/dialog através do botão de fechar marcado;
      // 2) fallback: dispara Escape no document para handlers padrões.
      const fecharBtn = document.querySelector<HTMLElement>(
        '[role="dialog"] [data-voz-fechar-detalhe="true"], [role="dialog"] [aria-label*="ech" i]',
      )
      if (fecharBtn) {
        try {
          fecharBtn.click()
          return
        } catch {
          /* fallback abaixo */
        }
      }
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    },

    aplicarFiltro: (grupo, valor) => {
      const sel = `[data-voz-filtro="${cssEscape(grupo)}"][data-voz-filtro-valor="${cssEscape(valor)}"]`
      const el = document.querySelector<HTMLElement>(sel)
      if (!el) return { sucesso: false }
      const rotulo =
        (el.getAttribute('aria-label') ?? el.textContent ?? valor).trim()
      try {
        el.click()
        return { sucesso: true, rotuloEncontrado: rotulo }
      } catch {
        return { sucesso: false }
      }
    },

    limparFiltro: (grupo) => {
      const seletorBase = grupo
        ? `[data-voz-filtro="${cssEscape(grupo)}"]`
        : '[data-voz-filtro]'
      const todos = Array.from(document.querySelectorAll<HTMLElement>(seletorBase))
      const alvos = todos.filter((el) => {
        const valor = (el.dataset.vozFiltroValor ?? '').toLowerCase()
        return (
          el.dataset.vozFiltroLimpa === 'true' ||
          valor === 'todos' ||
          valor === 'all' ||
          valor === '*'
        )
      })
      if (alvos.length === 0) return false
      let clicado = false
      for (const el of alvos) {
        try {
          el.click()
          clicado = true
        } catch {
          /* noop */
        }
      }
      return clicado
    },

    abrirAjuda,
    pausarVoz,
  }
}

function cssEscape(s: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') return CSS.escape(s)
  return s.replace(/["\\]/g, '\\$&')
}

/** Executor inerte usado como valor inicial estável para o ref. */
const NOOP_EXECUTOR: ExecutorCallbacks = {
  idioma: 'pt-BR',
  navegar: () => {},
  direcao: () => {},
  alternar: () => {},
  buscar: () => {},
  selecionarCliente: () => false,
  abrirCaixa: () => false,
  fecharCaixa: () => {},
  abrirDetalhe: () => false,
  fecharDetalhe: () => {},
  aplicarFiltro: () => ({ sucesso: false }),
  limparFiltro: () => false,
  abrirAjuda: () => {},
  pausarVoz: () => {},
}
