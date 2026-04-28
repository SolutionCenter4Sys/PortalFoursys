# Touchless — Assistente de Voz do PortalFoursys

> Sistema de comando por voz **bilíngue (PT‑BR / EN‑US)** para navegar e operar
> o portal sem usar mouse/teclado, ideal para apresentações comerciais e modo
> kiosk.

---

## 1. Visão geral

O subsistema `src/voice/` permite que o usuário fale comandos como
_"abrir caixa de KPIs"_, _"explorar IA Generativa"_, _"filtrar por banco"_ ou
_"ir para inovação"_ e que o portal reaja sem nenhum clique.

A arquitetura é **determinística** (regex + fuzzy match em estruturas
descobertas no DOM) — sem custo de LLM e com latência praticamente nula.

```
┌──────────────┐    ┌─────────────┐    ┌───────────────┐    ┌──────────────┐
│ SpeechRecog. │ →  │ classifier  │ →  │   executor    │ →  │ AppContext   │
│ (Web Speech) │    │ (Regex+Fuzzy)│    │ (callbacks)   │    │ + DOM scroll │
└──────────────┘    └─────────────┘    └───────────────┘    └──────────────┘
        │                                       │
        ▼                                       ▼
  Live transcription          Feedback falado (TTS) +
  (`VoiceLiveIndicator`)      `VoiceLiveIndicator`
```

---

## 2. Arquivos do módulo

| Arquivo | Responsabilidade |
|---|---|
| `types.ts` | `IntencaoVoz`, `ContextoClassificacao`, `DetalheDisponivel`, etc. |
| `vocabulary.ts` | Tabelas de verbos/sinônimos PT‑BR e EN‑US. |
| `classifierRegex.ts` | Pipeline determinístico que transforma transcrição → `IntencaoVoz`. |
| `executor.ts` | Mapeia `IntencaoVoz` em chamadas de callback + mensagem de feedback. |
| `useVoiceAssistant.ts` | Hook React com SpeechRecognition, contexto e callbacks. |
| `VoiceProvider.tsx` | Context provider que injeta o assistente na árvore. |
| `VoiceMicButton.tsx` | Botão flutuante que liga/desliga a escuta. |
| `VoiceHelpDialog.tsx` | Modal "?" com lista dinâmica de comandos da seção atual. |
| `VoiceLiveIndicator.tsx` | Overlay com transcrição ao vivo + última mensagem. |
| `catalogoCaixas.ts` | Catálogo estático de caixas conhecidas por seção. |
| `descobrirCaixasNoDom.ts` | Descobre caixas marcadas com `data-voz-caixa`. |
| `descobrirFiltros.ts` | Descobre filtros marcados com `data-voz-filtro`. |
| `descobrirDetalhes.ts` | Descobre drill‑downs marcados com `data-voz-detalhe`. |

Testes ficam ao lado: `*.test.ts` (Vitest + jsdom).

---

## 3. Tipos de intenção suportados

| Intenção | Exemplo PT | Exemplo EN |
|---|---|---|
| `falar-ajuda` | _"ajuda"_, _"que comandos posso falar"_ | _"help"_ |
| `pausar-voz` | _"pausar voz"_ | _"pause voice"_ |
| `alternar` | _"modo escuro"_, _"tela cheia"_, _"abrir menu"_ | _"toggle theme"_, _"fullscreen"_ |
| `navegar` | _"ir para cases"_, _"premiações"_ | _"go to innovation"_ |
| `navegar-direcao` | _"próximo"_, _"anterior"_, _"início"_ | _"next"_, _"back"_, _"home"_ |
| `buscar` | _"buscar por modernização"_ | _"search for cases"_ |
| `selecionar-cliente` | _"selecionar cliente Santander"_ | _"select client Bradesco"_ |
| `abrir-caixa` | _"abrir caixa de KPIs"_, _"focar nas alianças"_ | _"open box of partners"_ |
| `fechar-caixa` | _"fechar caixa"_ | _"close box"_ |
| `abrir-detalhe` | _"explorar IA Generativa"_, _"me conta sobre AI Squad"_ | _"deep dive into AI Squad"_, _"tell me about innovation"_ |
| `fechar-detalhe` | _"fechar detalhe"_, _"fechar modal"_ | _"close modal"_ |
| `aplicar-filtro` | _"filtrar por banco"_, _"saúde"_ | _"filter by health"_ |
| `limpar-filtro` | _"limpar filtros"_, _"limpar filtros setor"_ | _"clear filters"_ |

> A ordem do pipeline em `classifierRegex.classificarSync` é **importante**:
> intents mais específicos (fechar/abrir detalhe, limpar filtro, abrir caixa)
> vêm antes dos genéricos (navegar, busca direta) para evitar overlap.

---

## 4. Como instrumentar uma seção nova

A descoberta é **automática** via atributos `data-*` no DOM. Não é preciso
editar código TS para adicionar uma nova caixa, filtro ou drill‑down.

### 4.1 Caixa interna (foco/scroll)

Use quando quiser apenas chamar a atenção do espectador para um bloco:

```tsx
<div
  data-voz-caixa="meu-bloco"
  data-voz-caixa-secao="cases"
  data-voz-caixa-rotulo="Indicadores Financeiros"
  tabIndex={-1}
  className="focus:outline-none"
>
  ...
</div>
```

| Atributo | Obrigatório | Descrição |
|---|---|---|
| `data-voz-caixa` | sim | Id estável (ex.: `cases-bancos`). |
| `data-voz-caixa-secao` | sim | Deve ser um `AppSection` válido. |
| `data-voz-caixa-rotulo` | recomendado | Rótulo humano usado na fala. |
| `tabIndex={-1}` + `focus:outline-none` | recomendado | Permite foco programático sem outline visual. |

Comando: _"abrir caixa de indicadores financeiros"_, _"focar nos cases"_.

### 4.2 Drill‑down (modal/detalhe)

Use em cards/botões que abrem um modal com mais informações. O executor
**clica no elemento** marcado:

```tsx
<motion.button
  data-voz-detalhe="innovation-ia"
  data-voz-detalhe-secao="innovation"
  data-voz-detalhe-rotulo="IA Generativa"
  data-voz-detalhe-sinonimos="agentic ai, agentes autonomos"
  onClick={openModal}
>
  ...
</motion.button>
```

Comando: _"explorar IA Generativa"_, _"me conta sobre agentes autônomos"_.

E no botão de fechar do modal:

```tsx
<button
  data-voz-fechar-detalhe="true"
  aria-label="Fechar"
  onClick={close}
>
  <X />
</button>
```

Comando: _"fechar detalhe"_, _"fechar modal"_, _"close modal"_.

### 4.3 Filtros

Use em chips, botões de filtro, abas de categoria etc:

```tsx
<button
  data-voz-filtro="setor"
  data-voz-filtro-valor="Financeiro"
  data-voz-filtro-sinonimos="banco, banking, finance"
  aria-label="Financeiro"
  onClick={selectSector}
>
  Banco
</button>
```

Comando: _"filtrar por banco"_, _"financeiro"_, _"limpar filtros setor"_.

### 4.4 Limpar tudo

Para o botão "limpar filtros", basta marcar:

```tsx
<button data-voz-limpar-filtros="true">Limpar</button>
```

(Tratado pelo executor genérico.)

---

## 5. Adicionando vocabulário

Se um verbo novo for necessário (ex.: gíria de cliente), edite `vocabulary.ts`
e adicione o termo às listas `verbosNavegacao`, `verbosAbrirDetalhe`, etc.,
**em ambos** `ptBR` e `enUS`.

Para caixas conhecidas em pré‑produção, adicione entradas em
`catalogoCaixas.ts` com `id`, `secao`, `rotulo` e `rotulos` (sinônimos). Isso
melhora o fuzzy match mesmo antes de a página carregar.

---

## 6. UX e feedback

- **`VoiceMicButton`**: botão flutuante (canto inferior direito) com 3 estados
  visuais — _idle_, _listening_ (pulsante azul), _processing_ (girando).
- **`VoiceLiveIndicator`**: overlay no topo do viewport com:
  - texto da transcrição em tempo real (`interimResults`),
  - mensagem TTS curta após o intent ser executado (auto‑some em 2.5s).
- **`VoiceHelpDialog`**: aberta por _"ajuda"_ ou pelo `?` na TopBar; lista
  comandos relevantes da seção atual + caixas/filtros/detalhes descobertos.
- **TTS**: o feedback é falado pela `feedback.ts` (Web SpeechSynthesis) com
  voz nativa do idioma — silenciável via _"pausar voz"_.

---

## 7. Atalhos de teclado

| Atalho | Ação |
|---|---|
| `M` | Liga/desliga a escuta |
| `?` | Abre o `VoiceHelpDialog` |
| `Esc` | Fecha qualquer modal/detalhe aberto |

---

## 8. Testes

```bash
npm test                       # roda toda a suíte
npx vitest run src/voice/      # somente o módulo de voz
```

Cobertura atual:

- `classifierRegex.test.ts` — 30 cenários (PT/EN) cobrindo todo o pipeline.
- `executor.test.ts` — 31 testes para cada `IntencaoVoz` + i18n.
- `descobrir.test.ts` — 8 testes de auto‑discovery no DOM (jsdom).

Total: **69 testes** verdes.

---

## 9. Checklist ao adicionar uma nova seção

1. ✅ Marque caixas internas com `data-voz-caixa[…]` e `tabIndex={-1}`.
2. ✅ Marque cards que abrem modais com `data-voz-detalhe[…]`.
3. ✅ Marque o botão de fechar dos modais com `data-voz-fechar-detalhe="true"`.
4. ✅ Marque filtros com `data-voz-filtro[…]`.
5. ✅ Adicione entradas em `catalogoCaixas.ts` (PT + EN) para as 2‑3 caixas
   principais da seção (melhora o fuzzy quando a página ainda nem renderizou).
6. ✅ Teste falando _"ajuda"_ na seção — o `VoiceHelpDialog` deve listar tudo
   que você marcou.

---

## 10. Limites conhecidos

- O Web Speech API só funciona em navegadores baseados em Chromium e Safari
  recente; Firefox cai no fallback "sem suporte" (botão fica disabled).
- Reconhecimento offline depende do navegador; em Chrome a transcrição vai
  para servidores Google.
- A precisão do classifier degrada se o usuário falar frases muito longas;
  recomendamos comandos curtos (3‑6 palavras).
