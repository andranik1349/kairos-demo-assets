#!/usr/bin/env node
/**
 * Kairos favicon + OG placeholder generator — LOCAL ONLY (never runs on Vercel).
 *
 * The main image pipeline (scripts/images.mjs) only emits AVIF/WebP/fallback sets
 * or copies SVGs through — it has no notion of favicons or compositing onto a
 * background. Favicons need that (apple-touch-icons handle transparency poorly,
 * and the orrery mark is low-contrast on its own), so they get this dedicated
 * one-off step. Output is committed like all other image output.
 *
 *   npm run favicons
 *
 * Source: assets/masters/orrery-graphic.svg (541x541 orbital mark).
 * Output: site/img/favicon/{favicon.svg,favicon-32.png,apple-touch-icon-180.png}
 *         site/img/og-placeholder.png (1200x630; real OG image is a P2 deliverable)
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "assets", "masters", "orrery-graphic.svg");
const OUT_IMG = path.join(ROOT, "site", "img");
const OUT_FAV = path.join(OUT_IMG, "favicon");

const CANVAS = "#070C13"; // --color-bg, the dark canvas
const TEAL = "#0FB8AC";

async function main() {
  const orrery = await readFile(SRC, "utf8");
  // Strip the outer <svg …> … </svg> to reuse just the orbital paths.
  const rawInner = orrery
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();

  // The orrery's rings/strokes are the dark canvas color (#0D1520) — invisible
  // on our dark background. Recolor them to teal-soft and lift the faint ring
  // opacities so the orbital mark actually reads at favicon sizes.
  const inner = rawInner
    .replace(/#0D1520/gi, "#6EEAE3")
    .replace(/opacity="0\.2[0-4]?"/g, 'opacity="0.85"')
    .replace(/opacity="0\.43"/g, 'opacity="0.9"');

  await mkdir(OUT_FAV, { recursive: true });

  // --- favicon.svg: a bold orbital mark DERIVED from the orrery motif.
  // The full 541px orrery graphic is far too fine to read at 16–32px (its rings
  // average out to near-black), so the favicon is a simplified, legible take on
  // the same idea — concentric teal orbits around a center point on the dark
  // canvas. The full orrery is still used for the larger OG image below.
  const TEAL_SOFT = "#6EEAE3";
  const PURPLE_SOFT = "#9B8FEA";
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${CANVAS}"/>
  <g fill="none" stroke="${TEAL_SOFT}" stroke-width="2">
    <circle cx="32" cy="32" r="22" opacity="0.45"/>
    <ellipse cx="32" cy="32" rx="22" ry="8.5" opacity="0.9" transform="rotate(22 32 32)"/>
    <ellipse cx="32" cy="32" rx="22" ry="8.5" opacity="0.6" transform="rotate(-34 32 32)"/>
  </g>
  <circle cx="32" cy="32" r="3.4" fill="${TEAL_SOFT}"/>
  <circle cx="50.6" cy="24.8" r="2.6" fill="${PURPLE_SOFT}"/>
</svg>
`;
  await writeFile(path.join(OUT_FAV, "favicon.svg"), faviconSvg);

  // Rasterize favicon PNGs straight from the dark-backed SVG (no transparency
  // needed — the rect already supplies the background).
  const faviconBuf = Buffer.from(faviconSvg);
  await sharp(faviconBuf, { density: 384 })
    .resize(32, 32)
    .png()
    .toFile(path.join(OUT_FAV, "favicon-32.png"));

  await sharp(faviconBuf, { density: 384 })
    .resize(180, 180)
    .png()
    .toFile(path.join(OUT_FAV, "apple-touch-icon-180.png"));

  // --- og-placeholder.png (1200x630): dark canvas + glow + orrery + wordmark.
  // Placeholder only — the real share image is generated in P2. Georgia is used
  // (widely available) as a stand-in for the Cormorant display face.
  const W = 1200;
  const H = 630;
  const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glowP" cx="82%" cy="-6%" r="60%">
      <stop offset="0%" stop-color="#5B4FD4" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#5B4FD4" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowT" cx="6%" cy="8%" r="55%">
      <stop offset="0%" stop-color="#0FB8AC" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#0FB8AC" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${CANVAS}"/>
  <rect width="${W}" height="${H}" fill="url(#glowP)"/>
  <rect width="${W}" height="${H}" fill="url(#glowT)"/>
  <g transform="translate(860,315) scale(0.62) translate(-270.5,-270.5)" opacity="0.9">${inner}</g>
  <text x="90" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="118" font-weight="600" fill="#EEF1F8" letter-spacing="2">Kairos</text>
  <text x="94" y="360" font-family="'Courier New', monospace" font-size="24" fill="${TEAL}" letter-spacing="6">THE AUSPICIOUS MOMENT</text>
  <text x="94" y="404" font-family="Georgia, serif" font-size="30" fill="#8B95A9">Electional astrology, calculated.</text>
</svg>
`;
  await sharp(Buffer.from(ogSvg), { density: 144 })
    .resize(W, H)
    .png()
    .toFile(path.join(OUT_IMG, "og-placeholder.png"));

  console.log("favicons + OG placeholder generated:");
  console.log("  site/img/favicon/favicon.svg");
  console.log("  site/img/favicon/favicon-32.png");
  console.log("  site/img/favicon/apple-touch-icon-180.png");
  console.log("  site/img/og-placeholder.png  (placeholder — real OG image is P2)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
