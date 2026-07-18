# Kairos — Landing Page

A small static marketing site for **Kairos**, an electional-astrology mobile app.
Four pages when complete: `index`, `terms`, `privacy`, and a styled `404`.

**Stack:** hand-coded semantic HTML + [Tailwind CSS v4](https://tailwindcss.com)
compiled with a real build step. No framework, no React, no static-site generator.
Deployed on Vercel.

> Status: **P1 (Shell & content model)** complete. The four pages exist with the
> shared nav + footer, the content-labeling convention, and the nav download-CTA
> reveal — but no real marketing content yet (the index is a shell around empty,
> ID'd section stubs; content lands in P2–P4). See [`docs/`](docs/) for the full
> plan and per-phase prompts.

## Folder map

```
kairos-demo-build/
├── docs/            Implementation plan + per-phase prompts (read these first)
├── assets/
│   └── masters/     Git-tracked raw asset sources — the canonical image source.
│                    See assets/masters/MANIFEST.md for the naming map.
├── scripts/
│   ├── images.mjs   Local image pipeline (sharp): masters → optimized output
│   └── favicons.mjs Local favicon + OG-placeholder generator (sharp)
├── src/
│   └── main.css     Tailwind input: @theme tokens + base styles + nav-CTA reveal
├── site/            ← everything Vercel serves (the deploy output directory)
│   ├── index.html       Landing page (shell + empty ID'd section stubs)
│   ├── terms.html       Placeholder legal page
│   ├── privacy.html     Placeholder legal page
│   ├── 404.html         Styled not-found page (Vercel serves it for missing routes)
│   ├── styleguide.html  Foundation test page (unlinked; open /styleguide)
│   ├── js/site.js       Vanilla JS (nav-CTA reveal); loaded `defer` on every page
│   ├── css/             Compiled CSS — GITIGNORED (Vercel rebuilds on deploy)
│   └── img/             Optimized images + favicons — COMMITTED (generated locally)
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
| `npm run favicons`  | Regenerate the favicon set + OG placeholder from the orrery mark.    |

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

## Content model (how a CMS maps on later)

Every visitor-facing string carries a `data-content` label in dot-notation:
`data-content="<section>.<item>.<field>"`. This makes each string greppable by
name and gives a future headless CMS an obvious mapping — no code archaeology.

- **Repeating structures are strictly uniform.** Every nav link, footer link,
  legal section, and store badge uses identical markup, differing only in
  content. No one-off variants.
- **Attribute-bound copy is labeled too.** For `alt` / `aria-label`, add
  `data-content-attrs="alt"` (or `"aria-label"`) on the same element. For
  `<head>` meta and OG tags, a `<!-- content: meta.description -->` comment sits
  directly above the tag.
- **Shared components** (e.g. the store-badge block) are labeled once as a unit
  (`store-badges.app-store`) and reused verbatim, so the same label legitimately
  appears in more than one place (hero + footer today).

Examples:
`<a href="/#pricing" data-content="nav.links.pricing">Pricing</a>` ·
`<p data-content="footer.brand.descriptor">The Auspicious Moment</p>`.

Scaffolding-only text (the empty section-stub labels) uses a `_stub.*` namespace
and is replaced with real content in P2–P4.

## Shell (nav + footer) — keep in sync

There is no include mechanism yet (SSG is deferred), so the **nav and footer are
duplicated across all four pages**. Each shared block is wrapped in boundary
comments — `<!-- shell:nav (keep in sync across pages) -->` … `<!-- /shell:nav -->`
(same for `shell:head`, `shell:footer`). **Any edit to a shared block must be
applied to all four pages.** The only intended per-page differences: the `<head>`
title / description / OG fields, and the nav anchor hrefs (in-page `#what` on the
index vs. `/#what` on the other pages). When the SSG migration happens, these
blocks become a single partial.

## Store badges

The App Store / Google Play buttons are currently **clearly-marked placeholders**
(dashed border, a "placeholder" tag) — not the official artwork, which is
copyrighted and pending. They live in the reusable `store-badges` component; drop
the official Apple/Google SVG/PNG into each badge's inner slot to finalize.

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

**Favicons + OG image** are generated separately by `npm run favicons`
([`scripts/favicons.mjs`](scripts/favicons.mjs)) from the orrery mark — the main
pipeline only does AVIF/WebP. Output (also committed): `site/img/favicon/`
(`favicon.svg`, `favicon-32.png`, `apple-touch-icon-180.png`) and
`site/img/og-placeholder.png` (1200×630 — a stand-in; the real share image is a
P2 deliverable). The favicon is a simplified orbital mark derived from the
orrery, because the full graphic is too fine to read at 16–32px.

## Deploy

Vercel is connected to this repo's GitHub remote. Every push to `main`
auto-deploys. Vercel runs `npm run build` (CSS compile only) and serves `site/`.
`cleanUrls` is on, so `/styleguide` resolves without the `.html`. Image
optimization is **not** part of the Vercel build — images are pre-generated and
committed.

## Pages

| Page              | Route (cleanUrls) | Notes                                             |
| ----------------- | ----------------- | ------------------------------------------------- |
| `index.html`      | `/`               | Shell + empty ID'd section stubs (P2–P4 content)  |
| `terms.html`      | `/terms`          | Placeholder legal document                        |
| `privacy.html`    | `/privacy`        | Placeholder legal document                        |
| `404.html`        | (missing routes)  | Styled not-found; Vercel serves it automatically  |
| `styleguide.html` | `/styleguide`     | Foundation test page (unlinked; not part of shell)|

## More

See [`docs/kairos-landing-implementation-plan.md`](docs/kairos-landing-implementation-plan.md)
for the six-phase plan (P0–P5) and `docs/prompts/` for the per-phase build prompts.
This README is updated as later phases land.
