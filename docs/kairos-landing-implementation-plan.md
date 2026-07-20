# Kairos Landing — Implementation Plan (Stage 5 execution)

**Status:** Ratified, in execution · **Owner:** Andranik · **Last updated:** 2026-07-20

**Progress log:**
- ✅ **P0 — Foundation** built + deployed (2026-07-18) · prompt: `prompts/p0-foundation.md`
- ✅ **P1 — Shell & content model** built + deployed (2026-07-18) · prompt: `prompts/p1-shell.md` · note: P1's conventional sticky nav is superseded by the floating pill nav (see `design-guardrails.md`), retrofitted in P2a
- ✅ **P2 — Standard sections** built + deployed (2026-07-19), split in two · P2a: pill-nav retrofit + `#what` / `#breadth` / `#ai` · P2b: `#pricing` / `#faq` / `#final` + OG image (Krea background, wordmark composited locally) · prompts: `prompts/p2a-narrative-sections.md`, `prompts/p2b-conversion-sections.md` · copy deck: `content/p2-sections.md`
- ✅ **P3 — Hero** built + deployed (2026-07-19) · prompt: `prompts/p3-hero.md` · WheelCore vendored into `site/js/hero-chart.js` (no houses/axes, 7 strongest major aspects), new continuous ~4 min/rev sky spin with upright glyphs, full ambient inventory, reduced-motion static wheel · prototype architecture notes committed at `reference/chart-demo-notes.md`
- ✅ **P4 — Showcases** built + deployed (2026-07-19) · prompt: `prompts/p4-showcases.md` · three Flat A showcases live (`#how` = screen-3 + screen-2 zigzag rows, `#features` = screen-1 centerpiece), assembled-with-depth motion (scroll parallax + pointer lean, `site/js/showcase.js`), layer geometry template-matched against each `reference.png`, hand-authored SVG backgrounds · PoC committed at `reference/poc-decomposition.html` · note: references are an older content revision than the layer exports (flagged in the P4 report); MANIFEST screen-2/3 headers corrected
- ✅ **P5 — Figma pass (Andranik)** delivered 2026-07-19 · frames `24143-34372` (full page) + `24143-49245` (viewport detail) in the Kairos-HeroUI file. **Status revised on delivery: the Figma is an APPROXIMATION, not the ultimate source of truth** (code-to-Figma tooling limits; a few hours' pass). Changes are ratified **case-by-case, frame-by-frame** against the build via a structured diff, then fed to P6.
- ✅ **P6a — Figma change-list implementation** built + verified in preview (2026-07-19) · prompt: `prompts/p6a-figma-changes.md` · authority: `p5-change-list.md`. Landed: bronze token family extended + renamed (`bronze-soft` → `bronze-soft-fg-dark`, new `bronze-hover` / true `bronze-soft` 16% fill / `bronze-soft-fg-light`); 1280 max width + 96px rhythm + per-section clipping removed (single `html{overflow-x:clip}` guard, no horizontal scroll at any width); section reorder `hero → how → features → what → breadth → pricing → faq → final`; `#ai` section + "Ask Kairos" nav link cut on all four pages; two-state nav (links-only default → logo lockup + purple "Get the App" reveal together, full state on subpages, mobile logo+CTA); "The Auspicious Moment" hero (bronze serif caps, italic "The"); gold serif section headlines page-wide; `#what` split headline + "isn't" labeled divider rows; `#breadth` flipped (chips left / headline right); pricing purple paid card+CTA / ghost free CTA / "(coming soon)"; showcase glow fields (behavior byte-identical, `hero-chart.js`/`showcase.js` diff empty); new logo lockup (dark-canvas recolor) + real official store badges imported & piped. Copy synced to the deck. **Deviation:** store badges sourced from the supplied `build-assets/download button graphics/` (official artwork) rather than a Figma export — same badges, cleaner path.
- ✅ **P6b — Polish & release** built + verified (2026-07-21) · prompt: `prompts/p6b-polish-release.md` · report: `reports/p6b-report.md`. Landed: two-way per-section scroll reveal (`initSectionReveal`, replays on re-entry, reduced-motion safe, hero excluded) + smooth anchor scrolling; per-section ambient glow fields on the four flat sections (`.section-glow`, no `background-attachment:fixed`, seams confirmed impossible — every section transparent over the body canvas); score chips replacing the bland score lines (teal / `negative-soft` / muted); pricing paid-card glass (`.paid-card-glass` + `prefers-reduced-transparency` fallback); showcase parallax eased `0.22→0.18` (Features kept larger as the deliberate centerpiece); footer-link easing harmonized across the shell; CTA gradient tokenized + inline-SVG hex swept to tokens; new AA-safe tokens `--color-purple-hover` (#645AD9) & `--color-negative-soft` (#F16D6F); `--color-negative`(+soft) added to styleguide; width-descriptor `srcset`/`sizes` on all 13 decomposed layers (mobile decomposed payload −47% at DPR1); README/handoff refreshed; hands-off zones (`hero-chart.js`, nav reveal/scroll-spy) untouched (`git diff` verified). Contrast audited with numbers (two sub-AA values fixed); a Lightning-CSS `backdrop-filter`-drop cross-browser bug caught & fixed. **After P6b: fine-comb sessions directly in Claude Code as needed** (open items in the report's "left for fine-comb").
- ✅ **P6c — Motion uplift** built + verified (2026-07-21) · prompt: `prompts/p6c-motion-uplift.md` · report: `reports/p6c-report.md`. Corrective pass: P6b's motion was imperceptible (~2/10 vs the 6/10 dial); the guardrails motion section was recalibrated (perceptibility floors are the working dial) and Andranik ordered it cranked. Landed: showcases **disassemble-on-scroll** (satellites 60–120px by depth + rotation, converging at center) + **idle float** (±4–6px) + **doubled pointer lean** (±5/±7) — `showcase.js` full rewrite; section reveals rewritten to a **staggered, replayable rAF cascade** (`initScrollMotion` replaces the IO reveal — 2–3 pieces/section at 110ms, 56px, trigger at 75% vh, replay both directions with hysteresis); **page-wide background parallax** (9 ambient layers drift 6–9% of scroll, transform-only); score-chip pop. Verified via applied transforms (entry 46–59px → center 0), parallax `--sy` (61–115px), stagger delays (0/0.11/0.22s), idle-float ~115fps; hands-off zones untouched (`git diff`). Dynamic *feel* + full-scroll fps + reduced-motion device check are Andranik's.
- 🔧 **Section-by-section Figma port (post-P6a, in progress, started 2026-07-19):** Andranik feeds individual Figma nodes for the settled layout; adopted case-by-case (change-list stays baseline). Ratified fixes logged in `p5-change-list.md` → "Addenda"; Figma↔CSS value mappings in `figma-to-css-map.md` (the Figma was recreated from the build via the app's UI kit, so variables don't map 1:1). Landed so far: nav section-links three-state pills + scroll-spy (`24143-36144`); hero background-to-top fix; **hero recompose onto the 12-col grid** — two-tone headline, dark-glass download pills, scroll hint, sub-copy shortened, orrery fills container height uncapped (`24143-48617` + subs, `24154-31377`); **nav grow states** — compact↔full auto-width pill + purple-gradient CTA, reveal at ~40% (`24143-34375`/`24143-48876`); nav relabeled to the 8-item scheme + scroll-spy/reveal bug fixes; **hero wheel flattened to a decorative showpiece** (glyphs ride the spin instead of counter-rotating, halos static — ~50 animating elements down to ~6; before/after in `session-handoff.md`). **Then (section-ports session, 2026-07-20):** split `#how` → `#search` + `#evaluate`; **unified every section onto the hero structure** (full-bleed section + 96px padding wrapper + `max-w-1280` container; column-based 1-col-spacer hairline indent); Figma content ports of **Search** (`24173-30970`), **Evaluate** (`24173-30995`), **Features** (`24173-31020`), **What-is** (`24143-49152`); hero headline → `bronze-soft-fg-dark` (contrast); new `--color-negative` token; **Cormorant italic font fix** (ital axis was never requested → faux italics); final-CTA glass pills; footer social pills (badges removed); two-way nav reveal; hero CSS animations pause off-screen; removed the clipping fixed body glows. **Primary-section port complete — ready for P6.** Full changelog in `session-handoff.md`. (2026-07-19 → 07-20.)
- Rule changes since ratification: **em/en-dash ban lifted 2026-07-19** (strategic use allowed; existing copy untouched until P6). Store badges arrive in P6 (do NOT chase official artwork in P5).
- Also added since ratification: `design-guardrails.md` (design rules + skill lineup, read before any visual work), repo `CLAUDE.md`

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

### P5 · Figma pass (Andranik, by hand — not a session task)
- **Goal (plain):** Andranik redesigns/adjusts the layout in Figma on top of the built v1 (mostly shifting things around) and supplies missing assets (official store badges, possible copy revisions incl. strategic dashes). **The resulting Figma design is the ultimate source of truth**: where it and the built site disagree, Figma wins.
- **Depends on:** P0–P4 (the live v1 is the material he's reworking).
- **Done when:** he hands back the design + notes; those become P6's primary input.

### P6 · Motion, polish & release-ready output
- **Goal (plain):** implement the P5 Figma changes, then make it feel finished and hand over deployable files.
- **Builds:** the P5 layout/design changes; scroll/parallax choreography and the showcase motion refined against the built v1; micro-interactions and hover states; strategic CSS glass where it earns its place; full responsive pass (mobile/tablet); a quick accessibility once-over (contrast, alt text, focus, reduced-motion device check); housekeeping carried from the P4 review (raw hex → tokens in inline SVGs, srcset/sizes pass for the 440px variants); run the image pipeline across everything (resized WebP/AVIF + fallback); produce the final static build.
- **Inputs:** the P5 Figma design (source of truth) + everything from P0–P4; anti-slop guardrails; decisions doc (glass allowed on web, `prefers-reduced-motion`).
- **Depends on:** P2, P3, P4, and P5 (the Figma design it implements).
- **Open calls:** final motion refinement (post-v1); how the Figma changes are read into the build (Figma MCP tooling is available).
- **Done when:** the site is responsive, optimized, clickable end-to-end, and auto-deploying to Vercel on push with a shareable preview URL — the "show it around" bar from the plan.

---

## Sequence & dependencies
`P0 → P1 → { P2, P3 } → P4 → P5 (Figma, Andranik) → P6`. P2 and P3 both sit on P1 and can be done in either order (P2 first is recommended so P4 has sections to drop showcases into). P4 wants P2 done. P5 is Andranik's Figma pass over the built v1; P6 implements it and is the final pass over everything.

Rough sense of weight: P0 and P1 are setup (small but load-bearing), P2 is the biggest content chunk, P3 and P4 are the two "special" technical pieces, P5 is finish.

## Cross-cutting open decisions (resolve as their phase comes up)
- **Showcase placement + motion** (P4) — which screen anchors which section; disassemble/parallax-away is a leaning, refine after v1.
- **Hero chart fidelity** (P3) — how much to simplify for performance.
- **Pricing numbers, FAQ birth-time answer, working titles** ("To-Dos", "Ask Kairos") — placeholder until the client resolves; don't block on them.
- **Deploy** — settled: **Vercel**, auto-build on push (connected to Andranik's GitHub).

## Next step
**P6 — the final polish/release pass** (`prompts/p6b-polish-release.md`): scroll choreography, seam sweep, showcase tuning, glass, remaining hex→tokens, `srcset`, responsive/a11y, perf + release output. The section-by-section Figma port and the unified layout system are in place (as of the 2026-07-20 section-ports session); P6 is the final comb over everything.
