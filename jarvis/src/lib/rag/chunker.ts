/**
 * Chunker de texto — ADR-007
 * Default v2: ~256 tokens (≈ 1000 chars), overlap ~40 tokens (≈ 150 chars).
 * Chunk menor = contexto recuperado mais denso/relevante → prompt menor →
 * TTFT do LLM menor na voz. Tunável por env sem reindex de código.
 * Estratégia: quebra por parágrafos, respeita limite de chars.
 */

const CHUNK_SIZE = Number.parseInt(process.env.RAG_CHUNK_SIZE ?? "1000", 10); // chars (~256 tokens)
const OVERLAP    = Number.parseInt(process.env.RAG_CHUNK_OVERLAP ?? "150", 10); // chars (~40 tokens)

export interface TextChunk {
  content: string;
  index: number;
  tokenEstimate: number;
}

/** Estimativa simples de tokens (4 chars ≈ 1 token em pt-BR/en). */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Divide texto em chunks sobrepostos, quebrando em parágrafos quando possível.
 */
export function chunkText(text: string): TextChunk[] {
  // Normaliza quebras de linha e remove excesso de espaços
  const normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (normalized.length <= CHUNK_SIZE) {
    return [{ content: normalized, index: 0, tokenEstimate: estimateTokens(normalized) }];
  }

  const chunks: TextChunk[] = [];
  const paragraphs = normalized.split(/\n\n+/);

  let current = '';
  let idx = 0;

  for (const para of paragraphs) {
    const candidate = current ? `${current}\n\n${para}` : para;

    if (candidate.length > CHUNK_SIZE && current.length > 0) {
      // Salva chunk atual
      chunks.push({
        content: current.trim(),
        index: idx++,
        tokenEstimate: estimateTokens(current),
      });

      // Overlap: pega os últimos OVERLAP chars do chunk anterior
      const tail = current.slice(-OVERLAP);
      current = tail ? `${tail}\n\n${para}` : para;
    } else {
      current = candidate;
    }

    // Parágrafo individual maior que CHUNK_SIZE: força split por linhas
    if (para.length > CHUNK_SIZE) {
      const lines = para.split('\n');
      let sub = '';
      for (const line of lines) {
        if ((sub + '\n' + line).length > CHUNK_SIZE && sub) {
          chunks.push({
            content: sub.trim(),
            index: idx++,
            tokenEstimate: estimateTokens(sub),
          });
          sub = line;
        } else {
          sub = sub ? `${sub}\n${line}` : line;
        }
      }
      if (sub) current = sub;
    }
  }

  if (current.trim()) {
    chunks.push({
      content: current.trim(),
      index: idx,
      tokenEstimate: estimateTokens(current),
    });
  }

  return chunks;
}

/** Extrai título do documento (primeiro heading H1 ou nome do arquivo). */
export function extractTitle(content: string, fallback: string): string {
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  const h2 = content.match(/^##\s+(.+)$/m);
  if (h2) return h2[1].trim();
  return fallback;
}
