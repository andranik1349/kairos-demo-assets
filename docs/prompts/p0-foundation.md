# P0 · Foundation & setup — Claude Code prompt

> Phase 1 of 6 (P0–P5) from `docs/kairos-landing-implementation-plan.md`. Run from the repo root (`kairos-demo-build/`). Later phases assume everything here exists exactly as specified.

---

## Context

You are setting up the foundation for the **Kairos landing page** — a small static marketing site (4 pages: index, terms, privacy, 404) for an electional-astrology mobile app. This phase builds **no visitor-facing content**: only the scaffold, tokens, tooling, fonts, image pipeline, a styleguide page for eyeballing the foundation, and deploy config.

**Stack (ratified, do not re-litigate):** no React, no SSG (deferred to launch). Hand-coded semantic HTML. **Tailwind CSS v4** via `@tailwindcss/cli` with a real build step — never the Play CDN. Deploys on **Vercel** (already connected to this repo's GitHub remote; every push to `main` auto-deploys). Vercel's build does the **CSS compile only** — image optimization always runs locally, never on Vercel.

If Tailwind v4 specifics below don't match the currently installed version's behavior, trust the official docs for the installed version and note the deviation in your final summary.

## Step 0 — Clear the throwaway demo

The repo currently contains a leftover demo `index.html` at the root. Delete it.
**Do not touch:** `.git/`, `docs/` (contains the implementation plan and these prompts).

## Step 1 — Repo structure

```
kairos-demo-build/
├── docs/                  # (exists) plan + prompts + handoff docs — leave as-is
├── assets/
│   └── masters/           # git-tracked raw asset sources (copied in Step 2)
├── scripts/
│   └── images.mjs         # image pipeline (Step 5)
├── src/
│   └── main.css           # Tailwind input: @theme tokens + base styles
├── site/                  # ← everything Vercel serves
│   ├── index.html         # minimal stub (real hero/sections come in P1–P4)
│   ├── styleguide.html    # foundation test page (unlinked, reachable by URL)
│   ├── css/               # compiled CSS lands here — gitignored
│   └── img/               # optimized image output — committed
├── package.json
├── vercel.json
├── .gitignore
└── README.md
```

`.gitignore`: `node_modules/`, `site/css/`, `.vercel`, `.DS_Store`.
(`site/css/` is gitignored because Vercel recompiles it on every deploy; `site/img/` **is** committed because images are only ever generated locally.)

## Step 2 — Copy asset masters into the repo

Copy the contents of `../build-assets/` (sibling of this repo in the parent working folder) into `assets/masters/`, **normalizing all names to lowercase-kebab-case** (no spaces): e.g. `mock 3d screens/Mokker01.png` → `mock-3d-screens/mokker-01.png`, `decomposed/screen-1/Frame 7.png` → `decomposed/screen-1/frame-7.png`, `iPhone 16 & 17 Pro Max - 270.png` → `phone-frame.png` (descriptive rename where the original name is noise).

Expected inventory (verify all arrive):
- `decomposed/screen-1|2|3/` — flat PNG-2x UI layers + one `reference.png` each (the three P4 showcase screens)
- `mock-3d-screens/` — 6 Mokker PNG renders
- `kairos-logo-full.svg`, `orrery-graphic.svg`
- `kairos-chart.html` — the animated chart demo (P3 input; not an image, just store it)

Record the old→new name mapping in `assets/masters/MANIFEST.md`. This folder is the canonical asset source from now on — the repo must be self-sufficient for handover.

## Step 3 — Node project + Tailwind v4

`npm init`, then install dev deps: `tailwindcss`, `@tailwindcss/cli`, `sharp`.

`package.json` scripts:
- `dev` → `npx @tailwindcss/cli -i ./src/main.css -o ./site/css/main.css --watch`
- `build` → same without `--watch` (+ `--minify`)
- `images` → `node scripts/images.mjs`

### `src/main.css` — tokens (Tailwind v4 CSS-first config, no `tailwind.config.js`)

```css
@import "tailwindcss";

@theme {
  /* Orrery palette — source of truth: kairos-figma-handoff.html (01_Base / colors/orrery, Dark canvas) */
  --color-bg: #070C13;
  --color-bg-2: #0A1019;
  --color-bg-3: #0C1320;
  --color-surface: #0F1826;
  --color-surface-2: #172238;
  --color-surface-3: #1F2D49;
  --color-fg: #EEF1F8;
  --color-muted: #8B95A9;
  --color-teal: #0FB8AC;
  --color-teal-hover: #14C4B8;
  --color-teal-soft: #6EEAE3;
  --color-purple: #5B4FD4;
  --color-purple-soft: #9B8FEA;
  --color-bronze: #7A6C53;
  --color-bronze-soft: #C8B493;
  --color-hair: rgba(240, 243, 248, .10);
  --color-hair-strong: rgba(240, 243, 248, .18);

  /* Type — three roles */
  --font-display: "Cormorant Garamond", Georgia, serif;      /* headlines */
  --font-sans: "Space Grotesk", system-ui, sans-serif;       /* body */
  --font-data: "Space Mono", ui-monospace, monospace;        /* data/labels/eyebrows */
}
```

Base layer (in the same file, `@layer base`): body gets `bg-bg`, `text-fg`, `font-sans`, antialiasing, and the handoff's fixed dark-canvas glow:

```css
background-image:
  radial-gradient(900px 500px at 78% -8%, rgba(91, 79, 212, .10), transparent 60%),
  radial-gradient(700px 420px at 8% 4%, rgba(15, 184, 172, .08), transparent 55%);
background-attachment: fixed;
```

Content max-width convention: **1080px** (use Tailwind utilities per-page; no global wrapper class yet — P1 owns the page shell).

## Step 4 — Fonts & icons

**Fonts — Google Fonts via `<link>`** (decided; not self-hosted). In every page `<head>`, with `preconnect`:

```
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Space+Grotesk:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap
```

**Icons — Phosphor**, inline-SVG approach: install `@phosphor-icons/core` (dev dep; it's a folder of raw SVGs). Usage convention: copy the needed icon's SVG markup **inline into the HTML**, `fill="currentColor"`, default the **thin or light weight** (matches the refined editorial look). No icon font, no icon JS, no runtime dependency. Document this convention in the README.

## Step 5 — Image pipeline (`scripts/images.mjs`)

A Node script using `sharp`. **Local-only** (never runs on Vercel).

- **Input:** `assets/masters/` (recursive). **Output:** `site/img/`, flat or mirrored structure — your call, but document it.
- **Skip:** `reference.png` files (design references, not site assets), `kairos-chart.html`, `MANIFEST.md`.
- **SVGs:** copy through unchanged.
- **Raster (PNG):** for each master emit **AVIF + WebP** at widths `[480, 960, 1440]` (skip widths larger than the source; always include the source's intrinsic width as the largest size if smaller than 1440), plus a fallback (original format, largest width). Naming: `<stem>-<width>.<ext>`.
- **Config block at the top of the script:** a small per-path override map (widths / quality / skip) with sensible defaults (e.g. AVIF q50, WebP q75) — granular control per image is the point of running this locally.
- Idempotent: safe to re-run; only regenerate when the master is newer than the output (or a `--force` flag).

For P0, **run it on the 6 Mokker masters only** (add the decomposed layers to the config but leave them commented/disabled — P4 will decide their exact treatment). Commit the generated `site/img/` output.

## Step 6 — Pages

Two minimal pages, both with proper `<head>` (charset, viewport, title, fonts links, `css/main.css`):

1. **`site/index.html`** — near-empty stub: dark canvas + centered logo (`assets` logo SVG copied via pipeline) + a `<!-- P1: page shell replaces this stub -->` comment. Exists so the Vercel deploy shows something sane.
2. **`site/styleguide.html`** — the foundation test page (unlinked; fine to keep plain):
   - all color tokens as labeled swatches (name + hex)
   - the background gradient visible on the canvas
   - type specimens: display (Cormorant, a few sizes), body (Space Grotesk), data (Space Mono eyebrow/label style)
   - base button samples: primary (teal, hover state), ghost/outline
   - 3–4 sample Phosphor icons inline (thin weight) to verify the convention
   - one optimized Mokker image via `<picture>` (AVIF → WebP → fallback) to verify the pipeline output renders

## Step 7 — Vercel config

`vercel.json`: `buildCommand` `npm run build`, `outputDirectory` `site`, `cleanUrls: true` (so `/styleguide` works without `.html`). Nothing else — no functions, no env.

## Step 8 — README.md (the handoff doc)

Root-level, short and plain: what this project is (Kairos landing, static HTML + Tailwind v4, no framework); folder map; commands (`dev`, `build`, `images`); where asset masters live and that the pipeline runs locally with committed output; fonts/icons conventions; deploy (Vercel auto-build on push, CSS-only build); pointer to `docs/` for the plan and phase prompts. Update it in later phases as pieces land.

## Acceptance checklist

- [ ] `npm run build` exits clean and produces `site/css/main.css`
- [ ] `npm run images` produces AVIF/WebP variants of the 6 Mokker masters in `site/img/`
- [ ] `site/styleguide.html` renders: correct brand colors, all three fonts loading, gradient glow visible, buttons + icons + `<picture>` image all correct
- [ ] `site/index.html` stub renders on the dark canvas
- [ ] Throwaway demo `index.html` (repo root) is gone; `docs/` untouched
- [ ] `assets/masters/` complete per Step 2 inventory + `MANIFEST.md`
- [ ] `.gitignore` working: `node_modules/` and `site/css/` not staged

Then commit in logical chunks (e.g. scaffold / masters / pipeline+output / pages+config) with clear messages and push to `main`. Confirm the Vercel deploy succeeds and report the preview URL.

## Out of scope (later phases)

Page shell, nav, footer, content sections, hero, chart integration, showcases, motion, responsive polish. Do not start them. If something here blocks or contradicts, stop and flag it rather than improvising around it.
