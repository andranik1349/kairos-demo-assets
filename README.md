# Kairos — Landing Page

A small static marketing site for **Kairos**, an electional-astrology mobile app.
Four pages when complete: `index`, `terms`, `privacy`, and a styled `404`.

**Stack:** hand-coded semantic HTML + [Tailwind CSS v4](https://tailwindcss.com)
compiled with a real build step. No framework, no React, no static-site generator.
Deployed on Vercel.

> Status: **P0 (Foundation)** complete. No visitor-facing content yet — just the
> scaffold, design tokens, tooling, fonts, image pipeline, and a styleguide test
> page. See [`docs/`](docs/) for the full plan and per-phase prompts.

## Folder map

```
kairos-demo-build/
├── docs/            Implementation plan + per-phase prompts (read these first)
├── assets/
│   └── masters/     Git-tracked raw asset sources — the canonical image source.
│                    See assets/masters/MANIFEST.md for the naming map.
├── scripts/
│   └── images.mjs   Local image pipeline (sharp): masters → optimized output
├── src/
│   └── main.css     Tailwind input: @theme tokens + base styles
├── site/            ← everything Vercel serves (the deploy output directory)
│   ├── index.html       Landing page (P0: minimal stub)
│   ├── styleguide.html  Foundation test page (unlinked; open /styleguide)
│   ├── css/             Compiled CSS — GITIGNORED (Vercel rebuilds on deploy)
│   └── img/             Optimized images — COMMITTED (generated locally only)
├── package.json
├── vercel.json
└── README.md
```

## Commands

| Command             | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | Compile CSS and watch for changes (Tailwind CLI, `--watch`)         |
| `npm run build`     | One-off minified CSS build → `site/css/main.css`                    |
| `npm run images`    | Run the image pipeline (see below). Add `-- --force` to regenerate. |

There is no dev server. To preview locally, run `npm run dev` in one terminal and
serve `site/` with any static server, e.g. `cd site && python3 -m http.server`.
(Opening the HTML as a bare `file://` URL works but some rendering engines don't
apply the full stylesheet — serve over HTTP for an accurate preview.)

## Design tokens

The Orrery palette and the three type roles live in [`src/main.css`](src/main.css)
under `@theme` (Tailwind v4's CSS-first config — there is no `tailwind.config.js`).
Source of truth: `kairos-figma-handoff.html`. Colors are exposed as utilities
(`bg-bg`, `text-fg`, `bg-teal`, `border-hair`, …) and fonts as `font-display`
(Cormorant Garamond), `font-sans` (Space Grotesk), `font-data` (Space Mono).

Content max-width convention: **1080px**.

## Fonts & icons

- **Fonts** are loaded from Google Fonts via `<link>` in each page's `<head>`
  (with `preconnect`) — not self-hosted. Three families: Cormorant Garamond
  (headlines), Space Grotesk (body), Space Mono (data/labels/eyebrows).
- **Icons** are [Phosphor](https://phosphoricons.com/) (`@phosphor-icons/core`,
  a dev-only folder of raw SVGs). Convention: copy the needed icon's SVG markup
  **inline** into the HTML, use `fill="currentColor"`, and default to the **thin**
  weight (matches the editorial look). No icon font, no icon JS, no runtime
  dependency. Source SVGs: `node_modules/@phosphor-icons/core/assets/thin/`.

## Images

Raw masters live in `assets/masters/` and are the canonical source (the repo is
self-sufficient; the original `build-assets/` folder is no longer referenced).

`npm run images` reads the masters and writes optimized output to `site/img/`,
mirroring the folder structure:

- **Raster (PNG):** AVIF + WebP at widths `480 / 960 / 1440` (skipping widths
  larger than the source), plus an original-format fallback at the largest width.
  Naming: `<stem>-<width>.<ext>`.
- **SVG:** copied through unchanged.
- **Skipped:** `reference.png` files, `kairos-chart.html`, `MANIFEST.md`.
- Per-image overrides (widths / quality / skip) are configured at the top of
  [`scripts/images.mjs`](scripts/images.mjs). Defaults: AVIF q50, WebP q75.
- Idempotent: only regenerates when a master is newer than its output (or `--force`).

**The pipeline runs locally only — never on Vercel.** Its output (`site/img/`) is
committed to the repo. Consume images with a `<picture>` element (AVIF → WebP →
fallback); see `site/styleguide.html` for the pattern.

## Deploy

Vercel is connected to this repo's GitHub remote. Every push to `main`
auto-deploys. Vercel runs `npm run build` (CSS compile only) and serves `site/`.
`cleanUrls` is on, so `/styleguide` resolves without the `.html`. Image
optimization is **not** part of the Vercel build — images are pre-generated and
committed.

## More

See [`docs/kairos-landing-implementation-plan.md`](docs/kairos-landing-implementation-plan.md)
for the six-phase plan (P0–P5) and `docs/prompts/` for the per-phase build prompts.
This README is updated as later phases land.
