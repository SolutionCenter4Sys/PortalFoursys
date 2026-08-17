/**
 * Detecção e saneamento de código mermaid gerado por LLM.
 *
 * O LLM local costuma errar de formas previsíveis: fence sem tag com a palavra
 * "mermaid" solta na primeira linha, tag ```text em conteúdo mermaid, rótulos
 * com parênteses sem aspas, etc. As regras de autofix abaixo foram validadas
 * empiricamente contra mermaid@11 — cada transform só dispara em código que
 * comprovadamente quebra o parser, ou é normalização pura. Na dúvida, não
 * transforma: o DiagramCard tem fallback gracioso mostrando o código cru.
 */

/** graph/flowchart exigem token de direção — evita falso-positivo com
 *  linhas de código tipo `graph = nx.Graph()` */
const FLOWCHART_RE = /^(?:graph|flowchart)\s+(?:TD|TB|BT|RL|LR)\b/i;

/** tipos camelCase/compostos — distintivos o suficiente para prefix-match */
const CAMEL_TYPES_RE =
  /^(?:sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|gitGraph|quadrantChart|xychart-beta|requirementDiagram|C4(?:Context|Container|Component|Dynamic|Deployment)|sankey-beta|block-beta|packet-beta|architecture-beta|zenuml)\b/;

/** palavras minúsculas comuns (timeline, journey…) — só contam se a linha for
 *  exatamente o keyword (é assim que o mermaid as usa), senão qualquer texto
 *  começando com "timeline do projeto" viraria diagrama */
const BARE_TYPES_RE =
  /^(?:journey|gantt|timeline|mindmap|kanban)\s*;?\s*$|^pie(?:\s+(?:title\b|showData\b).*)?\s*$/;

/**
 * Normaliza código mermaid vindo de LLM: CRLF → LF e remove a palavra
 * "mermaid" copiada do info-string do fence para dentro do conteúdo
 * (primeira linha isolada ou prefixo na mesma linha).
 */
export function normalizeMermaidCode(raw: string): string {
  let s = raw.replace(/\r\n?/g, "\n").trim();
  s = s.replace(/^mermaid\b[ \t]*\n+/i, "").replace(/^mermaid\b[ \t]+/i, "");
  return s.trim();
}

/** primeira linha útil — pula frontmatter YAML e diretivas/comentários %% */
function firstMeaningfulLine(s: string): string | null {
  const noFrontmatter = s.replace(/^---\n[\s\S]*?\n---\n?/, "");
  for (const line of noFrontmatter.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("%%")) continue;
    return t;
  }
  return null;
}

/** true se o conteúdo (já sem tag de fence) é um diagrama mermaid */
export function looksLikeMermaid(raw: string): boolean {
  const first = firstMeaningfulLine(normalizeMermaidCode(raw));
  if (!first) return false;
  return (
    FLOWCHART_RE.test(first) ||
    CAMEL_TYPES_RE.test(first) ||
    BARE_TYPES_RE.test(first) ||
    // mindmap pode vir com título na mesma linha: "mindmap Oferta Foursys"
    /^mindmap\b/i.test(first)
  );
}

/**
 * Autofixes seguros aplicados na hora do render (o widget guarda o código
 * original). Flowcharts: aspas em rótulos com ( ) { } | @ — que quebram o
 * parser — em nós [], {}, arestas |…| e títulos de subgraph; seta Graphviz
 * `->` em linhas de aresta puras; comentários `//`/`#` → `%%`. Pie: aspas
 * nos rótulos das fatias (lexer estrito no v11). Válidos ficam intactos:
 * acentos, <br>, ponto-e-vírgula, `-->` em sequenceDiagram, gantt inteiro.
 */
export function sanitizeMermaidCode(raw: string): string {
  let s = normalizeMermaidCode(raw);
  // fences residuais, caso o código chegue de outra origem sem extração
  s = s
    .replace(/^```[ \t]*(?:mermaid)?[ \t]*\n/i, "")
    .replace(/\n[ \t]*```[ \t]*$/, "")
    .trim();

  // mindmap: tabs → 2 espaços; remove setas se o LLM misturou flowchart
  if (/^mindmap\b/im.test(s)) {
    s = s
      .split("\n")
      .map((line) => {
        let l = line.replace(/\t/g, "  ");
        // LLM às vezes cola "mindmap root((x))" numa linha — quebra
        if (/^\s*mindmap\s+\S/i.test(l)) {
          l = l.replace(/^(\s*mindmap)\s+/i, "$1\n  ");
        }
        return l;
      })
      .join("\n");
    // se não há root((…)), promove a 1ª linha indentada a root
    if (!/\broot\s*\(\(/i.test(s)) {
      const lines = s.split("\n");
      const idx = lines.findIndex(
        (l, i) => i > 0 && /^\s+\S/.test(l) && !/^\s*%%/.test(l),
      );
      if (idx > 0) {
        const label = lines[idx].trim().replace(/^["']|["']$/g, "");
        lines[idx] = `  root((${label}))`;
        s = lines.join("\n");
      }
    }
    return s.trim();
  }

  if (/^(?:graph|flowchart)\b/i.test(s)) {
    s = s
      .split("\n")
      .map((line) => {
        // preserva diretivas %%{init}%% e comentários
        if (/^\s*%%/.test(line)) return line;
        let l = line;
        // rótulo de aresta mal-fechado pelo LLM: "-->|texto|>" → "-->|texto|"
        // (o `>` sobrando depois do pipe gera "got TAGEND"). `|>` nunca é válido
        // em flowchart, então a remoção é segura.
        l = l.replace(/\|>/g, "|");
        // "B: texto livre" — o LLM descreve um nó com dois-pontos (inválido:
        // "got NODE_STRING"). Converte em nó puro B["texto"]. Guardas: id simples,
        // sem -->/---/:::/=, e não é keyword de statement (style, classDef…).
        l = l.replace(
          /^(\s*)([A-Za-z]\w*)\s*:\s*(?![:=])([^\n]*\S)\s*$/,
          (m, sp: string, id: string, txt: string) => {
            if (/-->|---|:::|\b(?:subgraph|end|style|classDef|class|linkStyle|click|direction)\b/.test(m))
              return m;
            const clean = txt.replace(/"/g, "").replace(/\s*[,;]\s*$/, "");
            return `${sp}${id}["${clean}"]`;
          },
        );
        // rótulos [] — SEMPRE entre aspas (cobre ( ) & / , : etc.). Lookahead
        // preserva formas [( [/ [\ [[ e rótulos já aspeados (?!").
        l = l.replace(/\[(?![[(/\\!])(?!")([^[\]"\n]+?)\]/g, '["$1"]');
        // rótulos {} — (?!\{) faz {{hexágono}} resolver pelo par interno
        l = l.replace(/\{(?!\{)(?!")([^{}"\n]+?)\}/g, '{"$1"}');
        // rótulos de aresta |…|
        l = l.replace(/\|(?!\|)(?!")([^|"\n]+?)\|/g, '|"$1"|');
        // títulos de subgraph com parênteses
        l = l.replace(
          /^(\s*subgraph\s+)([^["'\n]*[(){}][^"'\n]*?)\s*$/,
          '$1"$2"',
        );
        // seta Graphviz -> só em linhas de aresta puras (global corromperia -.->)
        if (/^\s*[\w.-]+(\s*->\s*[\w.-]+)+\s*;?\s*$/.test(l)) {
          l = l.replace(/->/g, "-->");
        }
        // comentários // ou # → %% (seguro só sob guard de flowchart)
        l = l.replace(/^(\s*)(?:\/\/|#)(?!#)\s?/, "$1%% ");
        return l;
      })
      .join("\n");
  } else if (/^pie\b/.test(s)) {
    // rótulos de fatia sem aspas — lookahead mantém "title Usage: 2024" intacto
    s = s.replace(
      /^([ \t]*)(?!["%]|pie\b|title\b|accTitle|accDescr|showData\b)([^:"\n%]+?)[ \t]*:[ \t]*([\d.]+)[ \t]*$/gm,
      '$1"$2" : $3',
    );
  }
  return s;
}

/** pontos de quebra de um sequenceDiagram achatado numa linha: keywords de
 *  statement e mensagens `X->>Y:` — falso-positivo é inofensivo porque cada
 *  candidato é validado com mermaid.parse antes do render */
const SEQ_BREAK_RE =
  /\s+(?=(?:participant\s|actor\s|autonumber\b|Note\s+(?:over|left\s+of|right\s+of)\s|loop\s|alt\s|else\b|opt\s|par\s|rect\s|critical\s|break\s|end\b|activate\s|deactivate\s|box\s|[A-Za-z_]\w*\s*-{1,2}(?:>>?|[x)])\s*[A-Za-z_]))/g;

/** LLM às vezes emite o sequenceDiagram inteiro numa linha só (sequence não
 *  aceita `;` como separador, diferente de flowchart) — reinsere quebras */
function reflowOneLineSequence(code: string): string | null {
  if (!/^sequenceDiagram\b/.test(code)) return null;
  if (code.includes("\n")) return null;
  const body = code.replace(/^sequenceDiagram\s*/, "");
  const broken = body.replace(SEQ_BREAK_RE, "\n");
  if (!broken.includes("\n")) return null;
  return `sequenceDiagram\n${broken}`;
}

/**
 * Candidatos de render em ordem de preferência, para código possivelmente
 * truncado (resposta cortada por max_tokens) ou achatado numa linha:
 * 1) sanitizado; 2) reflow de sequence de uma linha; 3) sem a(s) última(s)
 * linha(s) — truncamento no meio de uma linha. O renderer valida cada um com
 * mermaid.parse e usa o primeiro que passar.
 */
export function mermaidRenderCandidates(raw: string): string[] {
  const out: string[] = [];
  const add = (c: string) => {
    const t = c.trim();
    if (t && !out.includes(t)) out.push(t);
  };
  const base = sanitizeMermaidCode(raw);
  add(base);
  const reflowed = reflowOneLineSequence(base);
  if (reflowed) add(reflowed);
  const src = reflowed ?? base;
  const lines = src.split("\n");
  if (lines.length > 2) add(lines.slice(0, -1).join("\n"));
  if (lines.length > 3) add(lines.slice(0, -2).join("\n"));
  return out;
}
