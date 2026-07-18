# Kairos Landing — Implementation Plan (Stage 5 execution)

**Status:** Draft for review · **Owner:** Andranik · **Last updated:** 2026-07-16

**What this is:** the build broken into a handful of consecutive phases. Each phase is scoped to become **its own Claude Code prompt**, crafted separately and run in order. This doc says *what* each phase builds and in *what sequence*; the actual per-phase prompts get written after this plan is ratified. Planning/prompt-crafting happens in Cowork; the build itself runs in Claude Code.

**Reads alongside:** `kairos-prototype-build-decisions.md` (the ratified how-we-build decisions), `kairos-landing-stage2-ia.md` (the 10-block content order), `kairos-figma-handoff.html` (color/type tokens), `build-assets/` (all imagery + logo + chart).

## Setup (settled)
- **Code location:** the existing repo at `kairos-demo-build/` (remote `github.com/andranik1349/kairos-demo-assets`). Current contents are throwaway demo files — **P0 clears them** and lays down the new structure. The redundant `kairos-chart.html` copy in that repo is discarded (the chart is integrated into the hero from `build-assets/` in P3).
- **Pages (4 total):** `index` (the landing) + `terms` + `privacy` (placeholder legal) + a styled `404`.
- **Deploy:** **Vercel** (Andranik's account, connected to his GitHub). Vercel auto-runs the build on every push and serves the output, giving shareable preview URLs — no committed build output, no GitHub-Pages folder tricks or `.nojekyll`. Vercel deploy tooling is also available from this environment if we want to push from here.

## Ground rules carried in (not re-litigated here)
No React · hand-coded clean HTML now, SSG deferred · full Tailwind via a real build (not the Play CDN) · Orrery tokens from the handoff · content-as-components with every string a marked placeholder · wireframe is content structure, **not** layout (adapt freely, style > substance) · Claude may generate SVG / algorithmic art to fill asset gaps · keep source images as masters, build generates resized WebP/AVIF.

---

## The phases

Six phases, `P0`–`P5`. Each lists **Goal**, **Builds**, **Inputs**, **Depends on**, **Open calls** (decisions to settle when we write that phase's prompt), and **Done when**.

### P0 · Foundation & setup
- **Goal (plain):** stand up the empty project so everything after it has tokens, tooling, and fonts ready — nothing visible to a visitor yet.
- **Builds:** project scaffold (folders for pages, styles, source images, generated images); Node project + Tailwind CLI build wired with watch/build scripts; Tailwind config with the Orrery tokens mapped in (colors → `bg-surface`, `text-accent`, etc.; the three fonts → `font`, `font-display`, `font-data`); base stylesheet (dark canvas + the handoff's background gradients); the three Google fonts loaded; a stroke icon set (Phosphor/Lucide) installed; the image pipeline script (`sharp`) that turns `build-assets/` masters into resized WebP/AVIF + fallback; a throwaway "styleguide" page to eyeball tokens/fonts/base buttons; and a minimal Vercel build config (build command + static output directory) so every push auto-deploys.
- **Inputs:** `kairos-figma-handoff.html` (`:root` tokens + font links), `build-assets/`.
- **Depends on:** nothing (first step).
- **Open calls:** confirm current Tailwind major-version setup (changed since Claude's knowledge cutoff); pick the icon set.
- **Done when:** `npm run build` produces a CSS file, the styleguide page renders in brand colors/fonts, and one test image comes out as optimized WebP/AVIF.

### P1 · Shell & content model
- **Goal (plain):** the frame every page shares, plus the pattern for how content is stored so a CMS can bolt on later.
- **Builds:** page template; sticky nav (logo + download CTA that reveals on scroll past the hero, per the wireframe behavior); footer (block 10 — logo, descriptor, Terms/Privacy links, contact, social, store badges); the four page stubs (`index`, `terms`, `privacy`, `404`); **and the content-as-components convention** — a single clearly-structured content source where every string is a labeled placeholder, established here so all later sections follow it.
- **Inputs:** IA block 10; decisions doc (content-as-components rule); logo from `build-assets/`.
- **Depends on:** P0.
- **Open calls:** exact shape of the content source (inline structured partials vs. a small JSON/JS data file) — pick the simplest thing that maps cleanly to CMS fields later.
- **Done when:** all four pages open with shared nav/footer, the download CTA reveal works, and the placeholder-content pattern is demonstrated on at least one live string.

### P2 · Standard content sections
- **Goal (plain):** build the bulk of the page — every section that's type, grid, accordion, or toggle and doesn't need a decomposed-UI showcase.
- **Builds, in IA order:** block 2 *What it is / isn't*; block 5 *What you can do* (14-category grid + Related Persons + To-Dos); block 6 *Ask Kairos*; block 7 *Pricing* (two plans + monthly/yearly toggle); block 8 *FAQ* (accordion); block 9 *Final CTA*. Imagery here uses **Mokker shots**, generated SVG/motif art, and **Krea-generated** imagery where useful (incl. an OG/social-share image for the preview link).
- **Inputs:** IA sections 2,5,6,7,8,9; `build-assets/mock 3d screens/`; `orrery-graphic.svg`; anti-slop guardrails from the IA (layout variety, eyebrow restraint, one CTA intent, no em-dashes).
- **Depends on:** P1 (shell + content pattern).
- **Open calls:** pricing is placeholder numbers; FAQ birth-time answer is TBD (unresolved product question) — use a marked placeholder.
- **Done when:** these six sections render to hi-fi with real placeholder copy, responsive, functional accordion + pricing toggle.

### P3 · Hero
- **Goal (plain):** the top-of-page centerpiece with the live chart — isolated as its own phase because the animated wheel is the fiddliest piece.
- **Builds:** block 1 hero — promise headline (Cormorant), sub-line, single download CTA (store badges as real styled components, placeholder links), center-aligned allowed; integrate the **simplified, slow-spin** chart wheel from `kairos-chart.html` as the hero visual (hero is the only place the heavy animated wheel is allowed).
- **Inputs:** IA section 1; `build-assets/kairos-chart.html` + `CHART_DEMO_NOTES.md`; Stage 1 hero refinements (simplify chart, slow loop, center-align, Cormorant not Playfair).
- **Depends on:** P0 (tokens/fonts), P1 (nav). Can run in parallel-ish with P2 but slot after for focus.
- **Open calls:** how much of the full chart to keep vs. strip for performance; exact spin speed; whether the wheel sits behind, beside, or under the copy.
- **Done when:** hero renders with the animated wheel performing smoothly, promise + CTA above the fold.

### P4 · Flat A decomposed showcases
- **Goal (plain):** the premium moment — the three torn-apart app screens that float/tilt, plus the generated background art around them.
- **Builds:** a **reusable showcase component** (flat PNG-2x layers, CSS 3D tilt + parallax, the technique proven in `kairos-poc-decomposition.html`); the three compositions — **home dashboard**, **evaluation result**, **activity input form** — placed into the highest-value narrative sections (block 3 *How it works* → activity-form + evaluation-result screens; block 4 *Feature showcase* → home dashboard); **background art** to fill space around them — hand-authored SVG/algorithmic (starfield, orbital arcs, gradient fields, an animated variant of `orrery-graphic.svg`) and/or **Krea-generated** atmospheric textures/video.
- **Inputs:** `build-assets/decomposed/screen-1|2|3/` (references + flat layers); the PoC file as the wiring reference; `orrery-graphic.svg`.
- **Depends on:** P0 (image pipeline), P1 (shell), ideally P2 (so the surrounding sections exist to place them in).
- **Open calls:** **which showcase anchors which section** (design call), and **motion treatment** — current leaning is disassemble/parallax-away, explicitly tentative and expected to be refined after v1.
- **Done when:** the three showcases render at hi-fi in their sections with the layer/parallax effect and background art, holding frame rate.

### P5 · Motion, polish & release-ready output
- **Goal (plain):** make it feel finished and hand over deployable files.
- **Builds:** scroll/parallax choreography and the showcase motion (the P4 leaning, refined against the built v1); micro-interactions and hover states; strategic CSS glass where it earns its place; full responsive pass (mobile/tablet); a quick accessibility once-over (contrast, alt text, focus, reduced-motion); run the image pipeline across everything (resized WebP/AVIF + fallback); produce the final static build.
- **Inputs:** everything from P0–P4; anti-slop guardrails; decisions doc (glass allowed on web, `prefers-reduced-motion`).
- **Depends on:** P2, P3, P4.
- **Open calls:** final motion refinement (post-v1).
- **Done when:** the site is responsive, optimized, clickable end-to-end, and auto-deploying to Vercel on push with a shareable preview URL — the "show it around" bar from the plan.

---

## Sequence & dependencies
`P0 → P1 → { P2, P3 } → P4 → P5`. P2 and P3 both sit on P1 and can be done in either order (P2 first is recommended so P4 has sections to drop showcases into). P4 wants P2 done. P5 is the final pass over everything.

Rough sense of weight: P0 and P1 are setup (small but load-bearing), P2 is the biggest content chunk, P3 and P4 are the two "special" technical pieces, P5 is finish.

## Cross-cutting open decisions (resolve as their phase comes up)
- **Showcase placement + motion** (P4) — which screen anchors which section; disassemble/parallax-away is a leaning, refine after v1.
- **Hero chart fidelity** (P3) — how much to simplify for performance.
- **Pricing numbers, FAQ birth-time answer, working titles** ("To-Dos", "Ask Kairos") — placeholder until the client resolves; don't block on them.
- **Deploy** — settled: **Vercel**, auto-build on push (connected to Andranik's GitHub).

## Next step
Ratify these phases (adjust count, order, or scope), then craft the **P0 prompt** for Claude Code as the first executable step.
