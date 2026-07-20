# Kairos — Landing Page

A small static marketing site for **Kairos**, an electional-astrology mobile app.
Four pages when complete: `index`, `terms`, `privacy`, and a styled `404`.

**Stack:** hand-coded semantic HTML + [Tailwind CSS v4](https://tailwindcss.com)
compiled with a real build step. No framework, no React, no static-site generator.
Deployed on Vercel.

> Status: **P6a (Figma change-list implementation)** complete. The P5 Figma pass
> was ratified into `docs/p5-change-list.md` and implemented here: new bronze
> token family, 1280 grid + 96px rhythm + unclipped bleed, section order
> `hero → how → features → what → breadth → pricing → faq → final → footer`
> (the `#ai` "Ask Kairos" section is cut), the two-state nav (links-only →
> logo lockup + purple CTA), the "The Auspicious Moment" hero, gold serif
> section headlines, restyled `#what` / `#breadth` / pricing / FAQ, showcase glow
> fields, the new logo lockup + real store badges. The three "Flat A" decomposed
> showcases (`#how` ×2, `#features`) are unchanged in behavior (glow is additive
> background only). Remaining: **P6b** (choreography, seam sweep, glass, srcset,
> a11y, release output). See [`docs/`](docs/) for the full plan and prompts.

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
│   ├── js/site.js       Vanilla JS (nav-CTA reveal, scroll-spy, pricing toggle, section reveal); loaded `defer` on every page
│   ├── js/hero-chart.js Hero chart wheel + starfield (index only; vendored from the chart prototype)
│   ├── js/showcase.js   Decomposed-showcase motion: scroll parallax + pointer lean (index only)
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
| `npm run preview`   | Serve `site/` locally with `Cache-Control: no-store` (see Preview).  |

There is no framework dev server. To preview locally, run `npm run dev` in one
terminal (Tailwind watch → rebuilds `site/css/main.css` on change) and
`npm run preview` in another (serves `site/` at `http://localhost:4173`). Open
the HTML as a bare `file://` URL only in a pinch — some engines don't apply the
full stylesheet, so serve over HTTP for an accurate preview.

### Preview server (`npm run preview`) — why it's not `python -m http.server`

[`scripts/preview-server.mjs`](scripts/preview-server.mjs) is a tiny
zero-dependency Node static server (Node built-ins only — no install). It exists
for one reason beyond parity: it sends **`Cache-Control: no-store`** on every
response. A bare `python -m http.server` sends no cache headers at all, which
lets a browser — **and especially Claude Code's built-in Browser pane, whose
`navigate` doesn't reliably hard-reload subresources** — keep serving a **stale
`site/css/main.css` after `npm run build`**, so reads/screenshots reflect the
*old* stylesheet until you manually cache-bust. `no-store` forces a fresh fetch
every time, so a rebuild is always picked up. It also mirrors `vercel.json`
(`cleanUrls` + `404.html`) so local matches production.

This is wired into `.claude/launch.json` (the `kairos-static` config Claude Code's
preview tooling launches), so it applies automatically on **any machine that
checks out this repo** — nothing to install or configure. Port 4173; override
with `npm run preview -- 8080` or `PORT=8080 npm run preview`.

> **Note:** this fixes only the *stale-cache* class of browser-tool flakiness.
> The separate *snapshot/animation* race (screenshots/DOM reads drifting on the
> continuously-animating hero) is inherent to observing a never-idle page through
> a capture channel — see `docs/session-handoff.md` for that.

## Design tokens

The Orrery palette and the three type roles live in [`src/main.css`](src/main.css)
under `@theme` (Tailwind v4's CSS-first config — there is no `tailwind.config.js`).
Source of truth: `kairos-figma-handoff.html`. Colors are exposed as utilities
(`bg-bg`, `text-fg`, `bg-teal`, `border-hair`, …) and fonts as `font-display`
(Cormorant Garamond), `font-sans` (Space Grotesk), `font-data` (Space Mono).

Content max-width convention: **1280px** (12-column grid inside sections;
raised from 1080px in P6a). Sections are centered at this width; per-section
visual clipping was removed so backgrounds/glows bleed across boundaries, with a
single `html { overflow-x: clip }` guard keeping the page from ever scrolling
sideways.

New bronze token family (P6a): `bronze` `#7A6C53`, `bronze-hover` `#8F826D`,
`bronze-soft` (a true 16% fill, `#70624C @ 16%`), `bronze-soft-fg-dark` `#C8B493`
(the sandy serif register used for **all section headlines** — the old
`bronze-soft` was renamed to this), and `bronze-soft-fg-light` `#52483B`.

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

## Nav (grow states) — Figma port 2026-07-20

The floating pill nav is **auto-width** and grows horizontally between two states
(Figma default `24143-34375` / full `24143-48876`), driven by a **geometry-driven,
rAF-throttled scroll check** in `site/js/site.js` (`initNavReveal`) — **not** an
IntersectionObserver (a thin-band IO can miss a fast scroll jump; see the handoff's
IO pitfalls):

- **Default (top of page):** a **compact pill hugging just the section links** —
  no logo, no CTA.
- **After the hero is ~40% scrolled** (the check watches `#search` — the first
  section after the hero — entering the top 60% of the viewport): the **logo**
  grows in on the left and the
  **purple-gradient "Get the App"** CTA on the right, and the pill **widens with
  them** — `grid-template-columns: 0fr→1fr` on the `.nav-grow` wrappers animates
  the width to natural size; centered, so it grows from the middle out.
- **Subpages** (terms / privacy / 404) have no hero, so the logo/CTA carry `show`
  in the markup = **full (grown) state always**.
- **Mobile** shows the logo + CTA only (links hidden, no hamburger); both stay
  grown (no scroll reveal).

Classes: `.nav-grow` (+ `.show`) and `.nav-cta-btn` (the gradient) in
`src/main.css`. This is a per-page shell block — **keep it in sync across all four
pages** (only the link hrefs and the subpage `show`/`aria-hidden` differ).

### Section links — three states (Figma port, 2026-07-19)

The desktop section links are pills (`.nav-link` in `src/main.css`, Space Grotesk
16px), ported from Figma node `24143-36144` with three states:

- **Default:** muted text (`--color-muted`), no fill.
- **Hover:** purple text (`--color-purple`).
- **Current:** the link for the section currently in view gets a soft-purple pill
  fill (`--color-purple` @ 18%) and `aria-current="location"`.

The **current** state is driven by a scroll-spy in `site/js/site.js`
(`initNavCurrentSection`): a **geometry-driven, rAF-throttled scroll check** (again,
not an IntersectionObserver) marks whichever section's top has most recently crossed
a reading line ~40% down the viewport. It's **index only** — subpage nav hrefs are
cross-page (`/#id`) and match no local section, so nothing is marked there. The
links live in `#nav-links`; keep this block in sync across all four pages like the
rest of the shell.

### Section scroll reveal (P6b)

Each section below the hero carries a `.reveal` class and fades/rises in (48px,
opacity) as it enters the viewport — one reveal for the section as a whole, never a
per-element cascade. It's **two-way** (2026-07-21): a section resets when it fully
leaves the viewport, so the reveal **replays** each time it scrolls back into view.
Driven by an IntersectionObserver (`initSectionReveal` in `site/js/site.js`) that
just toggles `.is-visible` on `isIntersecting` — coarse (threshold 0 + a generous
`-18%` bottom margin), so it gets reliable enter/leave callbacks and is not the
thin-band pitfall that forced the *nav* off IO. Reduced motion bails to the static
end-state (CSS + JS). Transform/opacity only, site easing. The hero is excluded (it
keeps its own `.loaded` entrance). Anchor clicks smooth-scroll via
`html { scroll-behavior: smooth }` (also disabled under reduced motion).

## Logo

The nav lockup and footer use the **new logo lockup** (teal orbital mark + bronze
`KAIROS` wordmark + "The Auspicious Moment" descriptor), replacing the P0
white-silhouette treatment. Masters live in `assets/masters/logo-variants/`
(color / monochrome × horizontal / vertical, kebab-cased). The site uses
`color-horizontal-dark.svg` — a dark-canvas recolor of the color/horizontal
variant whose wordmark is remapped from the exported slate `#58637A` to the
bronze `#C8B493` register (matching the Figma direction). SVGs pipe through
`npm run images` unchanged into `site/img/logo-variants/`.

## Store badges

The App Store / Google Play buttons are the **official badge artwork**
(white-content transparent SVGs, sized for the dark canvas). Masters live in
`assets/masters/store-badges/` (`app-store.svg`, `google-play.svg`) and pipe
through `npm run images` into `site/img/store-badges/`. They live in the reusable
`store-badges` component, used identically in the hero, final CTA, and every
footer (P1's clearly-marked placeholders are retired).

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

**Favicons** are generated separately by `npm run favicons`
([`scripts/favicons.mjs`](scripts/favicons.mjs)) from the orrery mark — the main
pipeline only does AVIF/WebP. Output (also committed): `site/img/favicon/`
(`favicon.svg`, `favicon-32.png`, `apple-touch-icon-180.png`). The favicon is a
simplified orbital mark derived from the orrery, because the full graphic is too
fine to read at 16–32px.

**OG / social-share image** (P2): master at `assets/masters/og/og-image.png`
(1200×630; Krea-generated orbital background + the wordmark composited locally),
run through the normal pipeline with a single-size override. Every page's
`og:image` points at the absolute production URL of
`site/img/og/og-image-1200.png`. The old `site/img/og-placeholder.png` from P0
is superseded.

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
