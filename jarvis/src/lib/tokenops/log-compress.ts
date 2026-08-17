/**
 * TokenOps — compressor RTK-style para logs de Agent Bridge (US-9.7).
 * Mantém erros/stack; colapsa ruído de npm/pytest/docker/webpack.
 */

const ERROR_KEEP =
  /\b(error|erro|fail|failed|exception|traceback|fatal|panic|EADDRINUSE|ENOENT|TypeError|ReferenceError)\b/i;

const NOISE_LINE =
  /^\s*(npm (warn|notice)|warn(ing)?:|info\s|debug\s|Downloading|Progress:|added \d+ packages|audited \d+|found 0 vulnerabilities|✔|✓|·|…|\.\.\.)/i;

const MAX_LINES = 80;
const MAX_CHARS = 12_000;

function collapseRuns(lines: string[]): string[] {
  const out: string[] = [];
  let lastNoise: string | null = null;
  let noiseCount = 0;

  const flushNoise = () => {
    if (noiseCount <= 0) return;
    if (noiseCount === 1 && lastNoise) out.push(lastNoise);
    else if (lastNoise)
      out.push(`[rtk] ${noiseCount} linhas de ruído omitidas (ex.: ${lastNoise.slice(0, 60)})`);
    lastNoise = null;
    noiseCount = 0;
  };

  for (const line of lines) {
    const trimmed = line.replace(/\r$/, "");
    if (!trimmed.trim()) continue;

    if (ERROR_KEEP.test(trimmed)) {
      flushNoise();
      out.push(trimmed);
      continue;
    }

    if (NOISE_LINE.test(trimmed) || trimmed.length > 240) {
      lastNoise = trimmed.slice(0, 120);
      noiseCount += 1;
      continue;
    }

    flushNoise();
    out.push(trimmed);
  }
  flushNoise();
  return out;
}

/** Comprime stdout/stderr de agent jobs antes de UI / prompt. */
export function compressAgentLogs(raw: string): string {
  if (!raw) return "";
  const lines = raw.split("\n");
  let compressed = collapseRuns(lines);

  // Sempre preserve as últimas linhas de erro se truncar
  if (compressed.length > MAX_LINES) {
    const head = compressed.slice(0, Math.floor(MAX_LINES * 0.6));
    const tail = compressed.slice(-Math.floor(MAX_LINES * 0.4));
    compressed = [
      ...head,
      `[rtk] … ${compressed.length - head.length - tail.length} linhas intermediárias omitidas …`,
      ...tail,
    ];
  }

  let text = compressed.join("\n");
  if (text.length > MAX_CHARS) {
    text =
      text.slice(0, MAX_CHARS) +
      `\n[rtk] truncado em ${MAX_CHARS} chars (original ${raw.length})`;
  }
  return text;
}

/** Ratio aproximado pós-compressão (smoke / métricas). */
export function compressionRatio(original: string, compressed: string): number {
  if (!original.length) return 1;
  return compressed.length / original.length;
}
