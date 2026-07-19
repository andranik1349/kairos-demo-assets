#!/usr/bin/env node
/**
 * Kairos image pipeline — LOCAL ONLY (never runs on Vercel).
 *
 * Reads raster masters from assets/masters/ and emits responsive AVIF + WebP
 * variants plus an original-format fallback into site/img/ (mirrored folder
 * structure). SVGs are copied through unchanged. Design references and non-image
 * inputs are skipped.
 *
 *   npm run images            # generate only what's missing or stale
 *   npm run images -- --force # regenerate everything
 *
 * Output is COMMITTED to the repo (images are only ever generated here, locally).
 */

import { readdir, stat, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "assets", "masters");
const OUT_DIR = path.join(ROOT, "site", "img");

// ---------------------------------------------------------------------------
// CONFIG — per-path overrides. The point of running this locally is granular,
// per-image control. Keys are path prefixes relative to assets/masters/; the
// LONGEST matching prefix wins. Any field omitted falls back to DEFAULTS.
//   widths  — target output widths (px). Widths larger than the source are
//             skipped; if the source is narrower than the largest width, the
//             source's intrinsic width is added as the top size.
//   avif/webp — encoder quality (0-100).
//   skip    — true to exclude matching masters entirely.
// ---------------------------------------------------------------------------
const DEFAULTS = { widths: [480, 960, 1440], avif: 50, webp: 75 };

const CONFIG = {
  // P0: the six 3D marketing renders — the only rasters processed this phase.
  "mock-3d-screens": { widths: [480, 960, 1440], avif: 50, webp: 75 },

  // P2: the OG/social-share image. Single exact size — crawlers fetch the PNG
  // fallback (og-image-1200.png); no responsive variants needed.
  "og": { widths: [1200], webp: 85 },

  // P4: the decomposed showcase layers (transparent PNG-2x). Alpha survives
  // AVIF/WebP/PNG. Masters are ~880px 2x exports rendering at ~400-550px CSS,
  // so 880 is the working size; 440 serves small mobile scenes; the 1440 rung
  // only matters for the one wider-than-screen layer (select-person, 1424px,
  // which keeps its native width via the source-width rule). reference.png is
  // skipped globally.
  "decomposed": { widths: [440, 880, 1440], avif: 55, webp: 80 },
};

// Never treat these as site images.
const SKIP_BASENAMES = new Set(["reference.png", "MANIFEST.md"]);
const SKIP_EXTS = new Set([".html", ".md"]);
const RASTER_EXTS = new Set([".png", ".jpg", ".jpeg"]);

const FORCE = process.argv.includes("--force");

function optionsFor(relPath) {
  let best = null;
  let bestLen = -1;
  for (const [prefix, opts] of Object.entries(CONFIG)) {
    if ((relPath === prefix || relPath.startsWith(prefix + path.sep)) && prefix.length > bestLen) {
      best = opts;
      bestLen = prefix.length;
    }
  }
  return { ...DEFAULTS, ...(best || {}) };
}

/** Widths to emit given the source width (see CONFIG doc above). */
function resolveWidths(configWidths, srcWidth) {
  const maxCfg = Math.max(...configWidths);
  let widths = configWidths.filter((w) => w <= srcWidth);
  if (srcWidth < maxCfg && !widths.includes(srcWidth)) widths.push(srcWidth);
  return [...new Set(widths)].sort((a, b) => a - b);
}

/** Recursively collect every file under dir. */
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

/** True if output is missing or older than the master (unless --force). */
async function isStale(outPath, srcMtimeMs) {
  if (FORCE) return true;
  if (!existsSync(outPath)) return true;
  return (await stat(outPath)).mtimeMs < srcMtimeMs;
}

let made = 0;
let skipped = 0;
let copied = 0;

async function processRaster(srcPath, relPath) {
  const opts = optionsFor(relPath);
  if (opts.skip) return;

  const srcStat = await stat(srcPath);
  const meta = await sharp(srcPath).metadata();
  const widths = resolveWidths(opts.widths, meta.width);
  const largest = Math.max(...widths);

  const relDir = path.dirname(relPath);
  const stem = path.basename(relPath, path.extname(relPath));
  const outDir = path.join(OUT_DIR, relDir);
  await mkdir(outDir, { recursive: true });

  const srcExt = path.extname(relPath).toLowerCase();

  // Build the full job list: AVIF + WebP at every width, plus an
  // original-format fallback at the largest width.
  const jobs = [];
  for (const w of widths) {
    jobs.push({ w, ext: "avif", encode: (p) => p.avif({ quality: opts.avif }) });
    jobs.push({ w, ext: "webp", encode: (p) => p.webp({ quality: opts.webp }) });
  }
  const fallbackExt = srcExt === ".jpeg" ? ".jpg" : srcExt;
  jobs.push({
    w: largest,
    ext: fallbackExt.slice(1),
    encode: (p) => (fallbackExt === ".png" ? p.png() : p.jpeg({ quality: 82 })),
  });

  for (const job of jobs) {
    const outPath = path.join(outDir, `${stem}-${job.w}.${job.ext}`);
    if (!(await isStale(outPath, srcStat.mtimeMs))) {
      skipped++;
      continue;
    }
    await job
      .encode(sharp(srcPath).resize({ width: job.w, withoutEnlargement: true }))
      .toFile(outPath);
    made++;
    console.log(`  ✓ ${path.relative(ROOT, outPath)}`);
  }
}

async function copySvg(srcPath, relPath) {
  const srcStat = await stat(srcPath);
  const outPath = path.join(OUT_DIR, relPath);
  if (!(await isStale(outPath, srcStat.mtimeMs))) {
    skipped++;
    return;
  }
  await mkdir(path.dirname(outPath), { recursive: true });
  await copyFile(srcPath, outPath);
  copied++;
  console.log(`  ✓ ${path.relative(ROOT, outPath)} (copied)`);
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`No masters directory at ${SRC_DIR}`);
    process.exit(1);
  }
  console.log(`Image pipeline${FORCE ? " (--force)" : ""}: ${path.relative(ROOT, SRC_DIR)} → ${path.relative(ROOT, OUT_DIR)}`);

  const files = await walk(SRC_DIR);
  for (const srcPath of files.sort()) {
    const relPath = path.relative(SRC_DIR, srcPath);
    const base = path.basename(relPath);
    const ext = path.extname(relPath).toLowerCase();

    if (SKIP_BASENAMES.has(base) || SKIP_EXTS.has(ext)) continue;

    if (ext === ".svg") {
      await copySvg(srcPath, relPath);
    } else if (RASTER_EXTS.has(ext)) {
      await processRaster(srcPath, relPath);
    }
    // anything else is silently ignored
  }

  console.log(`\nDone. ${made} generated, ${copied} copied, ${skipped} up-to-date.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
