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

/**
 * Em modo contínuo, alguns navegadores (especialmente Chrome) ainda emitem
 * `onend` periodicamente — após silêncio prolongado, mudança de aba ou erro
 * `no-speech`. Reagendamos um restart com pequeno backoff para manter o mic
 * vivo até o usuário pedir para parar (botão ou voz).
 *
 * Valor reduzido para ~120 ms para minimizar o "tempo morto" entre ciclos
 * de reconhecimento e dar a sensação de escuta praticamente contínua.
 */
const RESTART_BACKOFF_MS = 120

/**
 * Janela de espera após receber um resultado "final" do navegador antes
 * de despachar o comando. Permite que o usuário faça pequenas pausas
 * naturais no meio de um comando (ex.: "navegar para... clientes") sem
 * que o trecho parcial seja processado prematuramente. Resultados
 * adicionais que chegam dentro da janela são concatenados.
 */
const FINAL_DEBOUNCE_MS = 700

/**
 * Salvaguarda contra estados travados: se ficamos `processing` por mais que
 * isso, forçamos voltar a `listening`. Não impacta a duração da escuta.
 */
const PROCESSING_TIMEOUT_MS = 8_000

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
  /** Modo "always-on": uma vez iniciado, o mic só desliga quando o usuário
   *  pede (botão ou voz "pausar voz"). */
  const continuousRef = useRef(false)
  /** Timer agendado para auto-restart depois de um onend espontâneo. */
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** Buffer de resultados "final" dentro da janela de debounce. */
  const finalBufferRef = useRef<string>('')
  /** Timer do debounce que dispara o handleTranscricao após silêncio. */
  const finalDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
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
  /** Indireção para permitir auto-restart sem auto-referência fechada. */
  const startRecognitionRef = useRef<() => void>(() => {})

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
  const clearRestartTimer = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current)
      restartTimerRef.current = null
    }
  }, [])

  const clearFinalDebounce = useCallback(() => {
    if (finalDebounceTimerRef.current) {
      clearTimeout(finalDebounceTimerRef.current)
      finalDebounceTimerRef.current = null
    }
    finalBufferRef.current = ''
  }, [])

  const stop = useCallback(() => {
    // Desliga o modo contínuo ANTES de parar para impedir o auto-restart
    // disparado em onend.
    continuousRef.current = false
    clearRestartTimer()
    clearFinalDebounce()
    try {
      recognitionRef.current?.stop()
    } catch {
      /* recognition pode já estar finalizando */
    }
    setStatus('idle')
    setTranscricaoAoVivo('')
  }, [clearRestartTimer, clearFinalDebounce])

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
      // Respeita tanto o silenciamento global (`silenciado`) quanto o
      // silenciamento por intenção (`resultado.silenciar`). Mensagens de
      // confirmação foram silenciadas a pedido do usuário; o feedback
      // visual (mensagemUltima) é mantido.
      if (resultado.mensagem && !resultado.silenciar) {
        falar(resultado.mensagem, idioma, { silenciar: silenciado })
      }
      // Em modo contínuo o mic continua escutando; senão, retorna para idle.
      // O `pausarVoz` (acionado pelo intent "pausar voz") já fez stop() antes
      // deste ponto, logo `continuousRef.current` será false e cairemos em idle.
      setStatus(continuousRef.current ? 'listening' : 'idle')
      setTranscricaoAoVivo('')
    },
    [navegacao, clientes, idioma, silenciado],
  )

  /**
   * Cria + inicia uma instância de SpeechRecognition. Função separada de
   * `start` porque é reutilizada pelo auto-restart sem precisar resetar o
   * `continuousRef` (que indica intenção do usuário, não da instância).
   */
  const startRecognition = useCallback(() => {
    const Ctor = getSpeechRecognition()
    if (!Ctor) {
      setStatus('error')
      return
    }
    // Garante que não há instância anterior viva.
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch {
        /* noop */
      }
      recognitionRef.current = null
    }

    const recognition = new Ctor()
    recognition.lang = idioma
    recognition.interimResults = true
    // Modo contínuo no nível da API: o reconhecimento entrega múltiplos
    // resultados em sequência sem precisar de start() repetido a cada fala.
    recognition.continuous = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setStatus('listening')
      setTranscricaoAoVivo('')
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) final += result[0].transcript
        else interim += result[0].transcript
      }
      // Mostra ao usuário o que já foi capturado (buffer + final + interim).
      const buffer = finalBufferRef.current
      setTranscricaoAoVivo(
        [buffer, final, interim].filter(Boolean).join(' ').trim(),
      )
      if (final) {
        // Acumula resultados finais e despacha após FINAL_DEBOUNCE_MS sem
        // novos finais. Isso dá ao usuário tempo extra para concluir o
        // comando caso faça uma pausa breve no meio da fala.
        finalBufferRef.current = (
          finalBufferRef.current + ' ' + final
        ).trim()
        if (finalDebounceTimerRef.current) {
          clearTimeout(finalDebounceTimerRef.current)
        }
        finalDebounceTimerRef.current = setTimeout(() => {
          const texto = finalBufferRef.current.trim()
          finalBufferRef.current = ''
          finalDebounceTimerRef.current = null
          if (texto) handleTranscricao(texto)
        }, FINAL_DEBOUNCE_MS)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // 'no-speech' e 'aborted' são esperados em modo contínuo: o navegador
      // encerra a sessão sozinho. Reagendamos o restart se ainda estamos
      // em modo always-on.
      if (event.error === 'no-speech' || event.error === 'aborted') {
        // onend cuidará do restart abaixo.
        return
      }
      // Erros reais ('not-allowed', 'audio-capture', 'network', etc.):
      // saímos do modo contínuo para evitar loop.
      continuousRef.current = false
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }

    recognition.onend = () => {
      recognitionRef.current = null
      // Se ainda estamos em "always-on", reagenda o reconhecimento. O backoff
      // pequeno evita loops ocupados em alguns navegadores que disparam
      // onend imediatamente após start (raro, mas possível).
      if (continuousRef.current) {
        setStatus((s) => (s === 'processing' ? s : 'listening'))
        clearRestartTimer()
        restartTimerRef.current = setTimeout(() => {
          if (continuousRef.current) startRecognitionRef.current()
        }, RESTART_BACKOFF_MS)
        return
      }
      setStatus((s) => (s === 'processing' ? s : 'idle'))
      setTranscricaoAoVivo('')
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch {
      // Se já havia uma instância iniciando, o navegador joga InvalidState.
      // Em modo contínuo, deixamos onend agendar a próxima tentativa.
      if (!continuousRef.current) {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    }
  }, [idioma, handleTranscricao, clearRestartTimer])

  // Mantém o ref do startRecognition sempre apontando para a versão mais
  // recente, para que o auto-restart no onend pegue closures atualizados
  // (ex.: idioma trocado durante a sessão).
  useEffect(() => {
    startRecognitionRef.current = startRecognition
  }, [startRecognition])

  const start = useCallback(() => {
    continuousRef.current = true
    startRecognition()
  }, [startRecognition])

  const toggle = useCallback(() => {
    if (status === 'listening') stop()
    else start()
  }, [status, start, stop])

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      continuousRef.current = false
      clearRestartTimer()
      clearFinalDebounce()
      try {
        recognitionRef.current?.abort()
      } catch {
        /* noop */
      }
      recognitionRef.current = null
      pararFala()
    }
  }, [clearRestartTimer, clearFinalDebounce])

  // Salvaguarda: se ficamos travados em "processing" por muito tempo
  // (ex.: TTS muito longo + onend perdido), volta para listening/idle.
  useEffect(() => {
    if (status !== 'processing') return
    const id = setTimeout(() => {
      setStatus(continuousRef.current ? 'listening' : 'idle')
    }, PROCESSING_TIMEOUT_MS)
    return () => clearTimeout(id)
  }, [status])

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

    rolar: (d) => {
      const alvo = encontrarContainerScrollavel()

      const passo = Math.max(
        Math.round(
          (alvo?.clientHeight ?? window.innerHeight) * 0.75,
        ),
        320,
      )

      const aplicar = (top: number) => {
        if (alvo) alvo.scrollBy({ top, behavior: 'smooth' })
        else window.scrollBy({ top, behavior: 'smooth' })
      }
      const irPara = (top: number) => {
        if (alvo) alvo.scrollTo({ top, behavior: 'smooth' })
        else window.scrollTo({ top, behavior: 'smooth' })
      }

      switch (d) {
        case 'baixo':
          aplicar(passo)
          break
        case 'cima':
          aplicar(-passo)
          break
        case 'topo':
          irPara(0)
          break
        case 'fim': {
          const max =
            alvo?.scrollHeight ??
            Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
          irPara(max)
          break
        }
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

    abrirDetalheFoco: () => {
      const el = encontrarDetalheContextual()
      if (!el) return { sucesso: false }
      const rotulo = (
        el.dataset.vozDetalheRotulo ??
        el.getAttribute('aria-label') ??
        el.textContent?.trim() ??
        ''
      ).trim()
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
        el.click()
        return { sucesso: true, rotuloEncontrado: rotulo || undefined }
      } catch {
        return { sucesso: false }
      }
    },

    fecharDetalhe: () => {
      fecharDetalheNoDom()
    },

    voltar: () => {
      // 1. Modal/drill-down aberto? Fecha.
      if (document.querySelector('[role="dialog"]')) {
        fecharDetalheNoDom()
        return 'modal-fechado'
      }
      // 2. Caixa em foco? Tira o foco.
      const caixasFoco = document.querySelectorAll<HTMLElement>(
        '[data-voz-caixa-foco="true"]',
      )
      if (caixasFoco.length > 0) {
        caixasFoco.forEach((el) => el.removeAttribute('data-voz-caixa-foco'))
        return 'caixa-desfocada'
      }
      // 3. Senão, navega para a seção anterior (se houver).
      const idx = app.activeNavigationItems.findIndex(
        (n) => n.id === app.state.currentSection,
      )
      const prev = app.activeNavigationItems[idx - 1]
      if (prev) {
        app.navigate(prev.id as AppSection)
        return 'secao-anterior'
      }
      return 'nada'
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

/**
 * Fecha qualquer modal/drill-down aberto no DOM, na ordem:
 * 1. botão dentro de [role=dialog] com data-voz-fechar-detalhe="true"
 * 2. botão dentro de [role=dialog] com aria-label contendo "ech" (close/fechar)
 * 3. fallback: dispara Escape no document (handlers padrão Radix/Dialog)
 */
function fecharDetalheNoDom(): void {
  if (typeof document === 'undefined') return
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
}

/**
 * Procura o container scrollável atual.
 *
 * O App tem várias camadas com `overflow-y-auto` (o `<main>` global e o
 * `SectionWrapper` interno de cada seção). Ambos são marcados com
 * `data-voz-scroll-root`. Para que o comando "descer" rola dentro da
 * seção atual (não no main vazio), iteramos do MAIS ESPECÍFICO (último no
 * DOM, normalmente o SectionWrapper) para o MAIS EXTERNO, escolhendo o
 * primeiro que tem overflow real (`scrollHeight > clientHeight`).
 *
 * Se nenhum candidato tiver overflow real, devolve o último candidato
 * marcado (mesmo "vazio") — assim continua sendo possível rolar a 0/fim
 * para reposicionar o scroll, e o navegador ignora silenciosamente.
 *
 * Fallback final: `<main>` ou `null` (caller usa `window`).
 */
/**
 * Encontra o melhor `[data-voz-detalhe]` para abrir quando o usuário
 * pediu drill-down sem nomear o item. Heurística:
 *
 * 1. Caixa em foco (`data-voz-caixa-foco="true"`):
 *    - se a própria caixa for `[data-voz-detalhe]`, usa-a.
 *    - senão, primeiro descendente `[data-voz-detalhe]` dela.
 * 2. Senão, dentre todos os `[data-voz-detalhe]` visíveis no viewport,
 *    o que está mais próximo do **centro vertical** da tela.
 * 3. Senão, `null` (executor reporta "não encontrei nada").
 */
function encontrarDetalheContextual(): HTMLElement | null {
  if (typeof document === 'undefined') return null

  const caixaFoco = document.querySelector<HTMLElement>('[data-voz-caixa-foco="true"]')
  if (caixaFoco) {
    if (caixaFoco.hasAttribute('data-voz-detalhe')) return caixaFoco
    const dentro = caixaFoco.querySelector<HTMLElement>('[data-voz-detalhe]')
    if (dentro) return dentro
  }

  const todos = Array.from(document.querySelectorAll<HTMLElement>('[data-voz-detalhe]'))
  if (todos.length === 0) return null

  const vh = window.innerHeight
  const centroViewportY = vh / 2

  let melhor: { el: HTMLElement; dist: number } | null = null
  for (const el of todos) {
    const rect = el.getBoundingClientRect()
    // ignora elementos completamente fora do viewport
    if (rect.bottom <= 0 || rect.top >= vh) continue
    // ignora elementos sem tamanho (display:none / aria-hidden)
    if (rect.width < 4 || rect.height < 4) continue
    const elCentroY = rect.top + rect.height / 2
    const dist = Math.abs(elCentroY - centroViewportY)
    if (!melhor || dist < melhor.dist) melhor = { el, dist }
  }
  return melhor?.el ?? null
}

function encontrarContainerScrollavel(): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const candidatos = Array.from(
    document.querySelectorAll<HTMLElement>('[data-voz-scroll-root]'),
  )
  // Itera do mais interno para o mais externo.
  for (const el of [...candidatos].reverse()) {
    if (el.scrollHeight - el.clientHeight > 4) return el
  }
  // Nenhum tem overflow agora — usa o mais interno mesmo assim para que
  // "topo"/"fim" tenham efeito visual ao mudar de seção, e devolve null
  // como fallback final para cair em window.
  return candidatos[candidatos.length - 1] ??
    document.querySelector<HTMLElement>('main') ??
    null
}

/** Executor inerte usado como valor inicial estável para o ref. */
const NOOP_EXECUTOR: ExecutorCallbacks = {
  idioma: 'pt-BR',
  navegar: () => {},
  direcao: () => {},
  rolar: () => {},
  alternar: () => {},
  buscar: () => {},
  selecionarCliente: () => false,
  abrirCaixa: () => false,
  fecharCaixa: () => {},
  abrirDetalhe: () => false,
  abrirDetalheFoco: () => ({ sucesso: false }),
  fecharDetalhe: () => {},
  voltar: () => 'nada',
  aplicarFiltro: () => ({ sucesso: false }),
  limparFiltro: () => false,
  abrirAjuda: () => {},
  pausarVoz: () => {},
}
