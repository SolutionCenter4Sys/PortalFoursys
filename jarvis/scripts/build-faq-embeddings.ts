/**
 * Gera embeddings offline para cada item do FAQ institucional.
 * Uso: npm run build:faq-embeddings
 *   (ou: npx --yes tsx --env-file=.env.local scripts/build-faq-embeddings.ts)
 *
 * Cada item vira 1 vetor a partir de `question + aliases.join(" ")` — dá
 * cobertura semântica ampla sem inflar o JSON.
 *
 * Output: src/lib/portal/institutional-faq.embeddings.json
 * Formato: [{ id: string, dims: number, vector: number[] }, ...]
 *
 * Ao editar INSTITUTIONAL_FAQ (adicionar/alterar item, aliases), RE-EXECUTE
 * este script — sem isso o vetor fica desatualizado e o match semântico erra.
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { GoogleGenAI } from "@google/genai";

import { INSTITUTIONAL_FAQ } from "../src/lib/portal/institutional-faq";

const OUTPUT_PATH = join(
  process.cwd(),
  "src/lib/portal/institutional-faq.embeddings.json",
);
const EMBED_DIMS = Number.parseInt(process.env.OLLAMA_EMBED_DIMS ?? "768", 10);
const EMBED_MODEL =
  process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";

type Row = { id: string; dims: number; vector: number[] };

function fitDims(vec: number[]): number[] {
  if (vec.length === EMBED_DIMS) return vec;
  if (vec.length > EMBED_DIMS) return vec.slice(0, EMBED_DIMS);
  return [...vec, ...new Array(EMBED_DIMS - vec.length).fill(0)];
}

/** Vetor unitário — casa com o pré-normalized do semantic-cache. */
function normalize(v: number[]): number[] {
  let sum = 0;
  for (let i = 0; i < v.length; i++) sum += v[i] * v[i];
  const norm = Math.sqrt(sum);
  if (norm === 0) return v;
  const out = new Array<number>(v.length);
  for (let i = 0; i < v.length; i++) out[i] = v[i] / norm;
  return out;
}

async function main() {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    console.error("GEMINI_API_KEY missing (.env.local)");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey: key });
  console.log(
    `[build-faq-embeddings] ${INSTITUTIONAL_FAQ.length} items · model=${EMBED_MODEL} · dims=${EMBED_DIMS}`,
  );

  // 1 vetor por item: concatena question + aliases (cobertura semântica ampla).
  const texts = INSTITUTIONAL_FAQ.map(
    (it) => `${it.question} ${it.aliases.join(" ")}`.trim(),
  );

  // Batch pequeno para evitar payload gigante.
  const BATCH = 16;
  const rows: Row[] = [];
  for (let i = 0; i < texts.length; i += BATCH) {
    const batch = texts.slice(i, i + BATCH);
    const res = await ai.models.embedContent({
      model: EMBED_MODEL,
      contents: batch,
      config: { outputDimensionality: EMBED_DIMS },
    });
    const embeddings = res.embeddings ?? [];
    for (let j = 0; j < embeddings.length; j++) {
      const values = embeddings[j]?.values ?? [];
      if (values.length === 0) {
        console.warn(`skip empty embedding for id=${INSTITUTIONAL_FAQ[i + j].id}`);
        continue;
      }
      const vector = normalize(fitDims(values));
      rows.push({
        id: INSTITUTIONAL_FAQ[i + j].id,
        dims: vector.length,
        vector,
      });
      process.stdout.write(".");
    }
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(rows, null, 0), "utf8");
  console.log(`\n[build-faq-embeddings] wrote ${rows.length} vectors → ${OUTPUT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
