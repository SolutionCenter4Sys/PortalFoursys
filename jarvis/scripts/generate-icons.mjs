/**
 * Gera o kit de marca Jarvis × Foursys a partir de um SVG master.
 *
 * Uso:
 *   npm i --no-save sharp png-to-ico opentype.js
 *   node scripts/generate-icons.mjs
 *
 * Saídas:
 *   src/app/favicon.ico            16+32+48 (abas/legado)
 *   src/app/icon.svg               favicon vetorial (browsers modernos)
 *   src/app/apple-icon.png         180×180 full-bleed (iOS arredonda sozinho)
 *   public/brand/jarvis-icon.svg   master do ícone
 *   public/brand/jarvis-icon-{192,512,1024}.png
 *   public/brand/jarvis-icon-maskable-512.png   (PWA, safe zone 80%)
 *   public/brand/jarvis-icon-mono.svg           (chevrons brancos, fundo transparente)
 *   public/brand/jarvis-logo.svg                (ícone + wordmark claro, p/ fundo escuro)
 *   public/brand/jarvis-logo-dark.svg           (wordmark navy, p/ fundo claro)
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import opentype from "opentype.js";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const APP = path.join(ROOT, "src", "app");
const BRAND = path.join(ROOT, "public", "brand");

const ORANGE = "#FF5315";
const NAVY_FG = "#181828";
const OFFWHITE = "#F7F6F2";
const MINT = "#89BAB1";

/** ponto sobre a elipse da órbita (rx 238 / ry 92, rotação -20°) */
function orbitPoint(deg) {
  const t = (deg * Math.PI) / 180;
  const rot = (-20 * Math.PI) / 180;
  const x = 238 * Math.cos(t);
  const y = 92 * Math.sin(t);
  return {
    x: 256 + x * Math.cos(rot) - y * Math.sin(rot),
    y: 256 + x * Math.sin(rot) + y * Math.cos(rot),
  };
}

/**
 * SVG master 512×512.
 * rounded: cantos arredondados (favicon/brand) ou full-bleed (apple/maskable)
 * safe: escala do conteúdo p/ safe zone maskable (1 = normal, 0.78 = maskable)
 */
function iconSvg({ rounded = true, safe = 1 } = {}) {
  const rx = rounded ? 112 : 0;
  const dot = orbitPoint(200);
  return `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#2e2e4a"/>
      <stop offset="55%" stop-color="#222239"/>
      <stop offset="100%" stop-color="#14141f"/>
    </radialGradient>
    <radialGradient id="glowO" cx="36%" cy="32%" r="55%">
      <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.5"/>
      <stop offset="50%" stop-color="${ORANGE}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${ORANGE}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowM" cx="70%" cy="74%" r="50%">
      <stop offset="0%" stop-color="${MINT}" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="${MINT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="${rx}" fill="url(#bg)"/>
  <rect width="512" height="512" rx="${rx}" fill="url(#glowO)"/>
  <rect width="512" height="512" rx="${rx}" fill="url(#glowM)"/>
  <g transform="translate(256 256) scale(${safe}) translate(-256 -256)">
    <ellipse cx="256" cy="256" rx="238" ry="92" transform="rotate(-20 256 256)"
      stroke="${MINT}" stroke-opacity="0.30" stroke-width="6"/>
    <circle cx="${dot.x.toFixed(1)}" cy="${dot.y.toFixed(1)}" r="9" fill="${OFFWHITE}" fill-opacity="0.95"/>
    <g transform="translate(116 116) scale(14)">
      <path d="M4 4l6 6-6 6" stroke="${ORANGE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10 4l6 6-6 6" stroke="#ff7848" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
</svg>`;
}

/** chevrons brancos, fundo transparente — usos monocromáticos */
const monoSvg = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(116 116) scale(14)">
    <path d="M4 4l6 6-6 6" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 4l6 6-6 6" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
  </g>
</svg>`;

async function fetchNunitoBlack() {
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap",
    { headers: { "User-Agent": "curl/8" } }, // UA legado → URLs .ttf em vez de .woff2
  ).then((r) => r.text());
  const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
  if (!url) throw new Error("URL do TTF Nunito não encontrada no CSS:\n" + css);
  const buf = await fetch(url).then((r) => r.arrayBuffer());
  return opentype.parse(buf);
}

/**
 * Vetoriza texto glifo a glifo (com kerning), sem passar pelo shaper
 * do opentype.js — o GSUB do Nunito usa um formato que ele não suporta.
 */
function textToPath(font, text, x, baseline, size) {
  const scale = size / font.unitsPerEm;
  let cursor = x;
  let d = "";
  let prev = null;
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    if (prev) cursor += font.getKerningValue(prev, glyph) * scale;
    d += glyph.getPath(cursor, baseline, size).toPathData(2);
    cursor += glyph.advanceWidth * scale;
    prev = glyph;
  }
  return { d, width: cursor - x };
}

/** logo horizontal: ícone 96px + wordmark "jarvis." vetorizado */
function logoSvg(font, { textColor }) {
  const SIZE = 96; // font-size do wordmark
  const ICON = 96;
  const GAP = 26;
  const baseline = 82; // centro óptico do cap-height alinhado ao centro do ícone
  const textX = ICON + GAP;

  const word = textToPath(font, "jarvis", textX, baseline, SIZE);
  const dot = textToPath(font, ".", textX + word.width, baseline, SIZE);
  const wordPath = word.d;
  const dotPath = dot.d;
  const width = Math.ceil(textX + word.width + dot.width + 8);
  const height = 120; // sobra p/ descender do "j"

  const icon = iconSvg({ rounded: true })
    .replace(/^<svg[^>]*>/, `<g transform="scale(${ICON / 512})">`)
    .replace(/<\/svg>$/, "</g>");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${icon}
  <path d="${wordPath}" fill="${textColor}"/>
  <path d="${dotPath}" fill="${ORANGE}"/>
</svg>`;
}

async function main() {
  await mkdir(BRAND, { recursive: true });

  const rounded = iconSvg({ rounded: true });
  const fullBleed = iconSvg({ rounded: false });
  const maskable = iconSvg({ rounded: false, safe: 0.78 });

  // SVGs
  await writeFile(path.join(APP, "icon.svg"), rounded);
  await writeFile(path.join(BRAND, "jarvis-icon.svg"), rounded);
  await writeFile(path.join(BRAND, "jarvis-icon-mono.svg"), monoSvg);

  // PNGs
  const png = (svg, size) =>
    sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

  await writeFile(path.join(APP, "apple-icon.png"), await png(fullBleed, 180));
  await writeFile(path.join(BRAND, "jarvis-icon-192.png"), await png(rounded, 192));
  await writeFile(path.join(BRAND, "jarvis-icon-512.png"), await png(rounded, 512));
  await writeFile(path.join(BRAND, "jarvis-icon-1024.png"), await png(rounded, 1024));
  await writeFile(
    path.join(BRAND, "jarvis-icon-maskable-512.png"),
    await png(maskable, 512),
  );

  // favicon.ico multi-tamanho
  const icoPngs = await Promise.all([16, 32, 48].map((s) => png(rounded, s)));
  await writeFile(path.join(APP, "favicon.ico"), await pngToIco(icoPngs));

  // logos com wordmark Nunito Black vetorizado
  const font = await fetchNunitoBlack();
  await writeFile(
    path.join(BRAND, "jarvis-logo.svg"),
    logoSvg(font, { textColor: OFFWHITE }),
  );
  await writeFile(
    path.join(BRAND, "jarvis-logo-dark.svg"),
    logoSvg(font, { textColor: NAVY_FG }),
  );

  console.log("✓ Kit de marca gerado em src/app/ e public/brand/");
}

await main();
