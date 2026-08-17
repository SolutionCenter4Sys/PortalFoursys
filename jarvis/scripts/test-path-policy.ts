/**
 * Sanity check path-policy (run: npx tsx scripts/test-path-policy.ts)
 */
import {
  isCompanyTimelineQuery,
  ragFilePriority,
  selectRagPaths,
  shouldSkipRagPath,
  timelinePathBoost,
} from "../src/lib/rag/path-policy";

const samples = [
  "public/briefings/itforum/foo.html",
  "src/data/kpis.ts",
  "src/data/cases.ts",
  "src/i18n/translations/pt.ts",
  "public/ofertas/qualidade-testes-ia.html",
  "README.md",
  "node_modules/foo/bar.ts",
  "package.json",
];

console.log("=== skip (scope=all) ===");
for (const p of samples) {
  console.log(
    `${shouldSkipRagPath(p, "all") ? "SKIP" : "KEEP"}  ${p}  (prio=${ragFilePriority(p, "all")})`,
  );
}

const selected = selectRagPaths(
  samples.filter((p) => !shouldSkipRagPath(p, "all")).map((path) => ({ path })),
  { maxFiles: 5, scope: "all" },
);
console.log("\n=== top 5 ===");
selected.forEach((s, i) => console.log(`${i + 1}. ${s.path}`));

if (selected[0]?.path !== "src/data/kpis.ts") {
  console.error("FAIL: kpis.ts should be #1");
  process.exit(1);
}
if (shouldSkipRagPath("public/briefings/itforum/foo.html", "all")) {
  console.error("FAIL: briefings must be KEPT in scope=all");
  process.exit(1);
}
if (!shouldSkipRagPath("public/briefings/itforum/foo.html", "institutional")) {
  console.error("FAIL: briefings must be SKIPPED in institutional");
  process.exit(1);
}
if (!isCompanyTimelineQuery("qual a trajetória da Foursys?")) {
  console.error("FAIL: timeline query detect");
  process.exit(1);
}
if (timelinePathBoost("src/data/kpis.ts") <= 0) {
  console.error("FAIL: kpis boost");
  process.exit(1);
}
if (timelinePathBoost("public/briefings/x.html") >= 0) {
  console.error("FAIL: briefing demote");
  process.exit(1);
}
console.log("\nOK path-policy (Portal Foursys = all + retrieval boost)");
