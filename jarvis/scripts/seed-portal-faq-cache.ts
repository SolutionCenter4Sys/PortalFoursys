/**
 * Seed Redis semantic cache com FAQ institucional do Portal.
 * Uso: node --env-file=.env.local --import tsx scripts/seed-portal-faq-cache.ts
 * (ou: npm run seed:portal-faq)
 *
 * Best-effort: se Redis/embed falhar, o match in-process (matchInstitutionalFaq)
 * continua a cobrir o caminho rápido no Portal.
 */

import {
  INSTITUTIONAL_FAQ,
} from "../src/lib/portal/institutional-faq";
import { writeSemanticCache } from "../src/lib/tokenops/semantic-cache";
import { isRedisAvailable, readyRedis } from "../src/lib/redis/client";

async function main() {
  console.log(`[seed-portal-faq] ${INSTITUTIONAL_FAQ.length} itens`);
  if (!isRedisAvailable()) {
    console.warn(
      "[seed-portal-faq] Redis OFF — skip seed. FAQ in-process ainda funciona no Portal.",
    );
    process.exit(0);
  }
  const redis = await readyRedis();
  if (!redis) {
    console.warn("[seed-portal-faq] Redis connect failed — skip.");
    process.exit(0);
  }

  let ok = 0;
  let fail = 0;
  for (const item of INSTITUTIONAL_FAQ) {
    const phrases = [item.question, ...item.aliases];
    for (const transcript of phrases) {
      try {
        await writeSemanticCache({
          transcript,
          assistantText: item.answer,
          intent: "knowledge",
        });
        ok += 1;
        process.stdout.write(".");
      } catch (e) {
        fail += 1;
        console.warn(`\nfail: ${transcript.slice(0, 60)}`, e);
      }
    }
  }
  console.log(`\n[seed-portal-faq] done ok=${ok} fail=${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
