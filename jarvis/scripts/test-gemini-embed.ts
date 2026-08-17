/** Smoke: npx tsx scripts/test-gemini-embed.ts */
import { readFileSync } from "fs";
import { join } from "path";
import { GoogleGenAI } from "@google/genai";

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (!m) continue;
      const k = m[1].trim();
      const v = m[2].trim();
      if (!process.env[k]) process.env[k] = v;
    }
  } catch {
    /* ignore */
  }
}

async function main() {
  loadEnvLocal();
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("GEMINI_API_KEY missing");
    process.exit(1);
  }
  const ai = new GoogleGenAI({ apiKey: key });
  const res = await ai.models.embedContent({
    model: process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001",
    contents: ["trajetória da Foursys desde 2000"],
    config: { outputDimensionality: 768 },
  });
  const values = res.embeddings?.[0]?.values;
  console.log("dims", values?.length);
  if (values?.length !== 768) process.exit(2);
  console.log("OK gemini embed");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
