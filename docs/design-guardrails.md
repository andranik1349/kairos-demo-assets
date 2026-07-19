# Kairos Landing — Design Guardrails

**What this is:** the design rules that govern every visual phase (P2–P5) but are too detailed for the implementation plan. Sourced from the Stage 1 concept (`kairos-landing-stage1-concept.md`), the brand deck's do/don't rules, and session decisions. **Read this before building or restyling anything visitor-facing.** Last updated: 2026-07-19.

---

## Reading Figma into code (non-traditional workflow — read before any Figma port)

This was **not** a Figma-first build. The CSS/HTML build came first; the Figma
was **recreated from it using the React-Native app's UI kit**, with the P5/P6
changes applied there. Consequence: **Figma variables do not map 1:1 to our CSS
tokens** — names and base hex values can differ for what is contextually the same
value. When porting a node, snap each Figma value to the closest Orrery token
**by context, not by name/hex**; when the mapping is ambiguous, **ask — don't
guess**. The running translation table lives in
[`figma-to-css-map.md`](figma-to-css-map.md) — consult and extend it every time.

---

## The three dials (working values)

Judge every section against these. They override any skill's own dial defaults.

- **Design variance: 6/10** — composed asymmetry. Never "three equal cards." Deliberate, instrument-like, not art-project chaotic.
- **Motion intensity: 6/10** — ambient, slow, atmospheric. The hero chart earns real motion; everything else stays calm.
- **Visual density: 3/10** — airy. Generous negative space, one idea per section.

## Brand rules (inherited from the Visual Identity deck — non-negotiable)

- **CTA color — REVISED 2026-07-19 (client-approved deviation from the deck):** the P5 Figma pass deliberately introduces **purple/lavender CTAs** (nav "Get the App", paid-plan button). This overrides the deck's original "teal owns every CTA" rule. Exact split between purple and teal actions is being ratified in the P5→P6 walkthrough; until then, don't mass-convert existing teal CTAs — follow the ratified change list.
- **Teal** still owns "auspiciousness" (scores, positive signals) and remains an action color where the change list says so.
- **Bronze/gold** is reserved for serif accents and context, never actions. (The P5 hero headline uses it at display scale — sanctioned there.)
- **Purple** was decoration/depth only; as of P5 it may also be an action color per the change list. Ambient purple presence is broadly increased in the P5 direction.
- No zodiac glyphs as decoration (only where they carry real meaning, e.g. inside the actual chart).
- No sparkle / star-dust textures. No orange-on-dark. No tarot / parchment / mystical aesthetics.
- **Glass is strategic, not dogma:** a few deliberate layering spots (nav, overlays), never the overall style. Web build may use `backdrop-filter` freely (the app's React-Native no-blur constraint does not apply here).
- Anchor test for everything: **"This calculates. It doesn't divine."** Precision instrument, not horoscope.

## House anti-slop rules (ratified from Stage 3 cleanup + IA guardrails)

- **Em/en dashes: allowed, strategically** (ban lifted by Andranik 2026-07-19, overriding any skill's dash ban). The v1 copy shipped dash-free and stays as-is for now; dashes may be introduced deliberately during the P6 Figma/copy pass. Don't sprinkle them reflexively; a dash should earn its place.
- **Eyebrows** (small uppercase labels above headings): max ~3 on the whole page.
- **One CTA intent** — download. One unified label for it everywhere (nav, hero, final CTA). No synonym drift ("Get the app" vs "Download" vs "Try Kairos" — pick one).
- **Layout variety:** consecutive sections must not repeat the same layout family; no more than two image+text splits in a row.
- Copy is placeholder but **specific to real Kairos mechanics** — extrapolated from `kairos_feature_breakdown_2.html`, `report-generation-flow-for-design.md`, and the Visual Identity deck (project knowledge, outside this repo). Never generic marketing filler. Working placeholder promise line: "The opportune moment, calculated."

## Page composition (added 2026-07-19)

**No hard transitions between sections/blocks on the home page.** The page is one continuous dark canvas: no visible section borders, no abrupt background changes, no banded color blocks. Sections blend into one another via shared canvas, gradual gradients, and ambient elements that dissolve rather than stop. Hairlines are allowed *within* a section's components (cards, dividers), not as section boundaries. The hero especially has no visible bottom edge. The final polish phase (P6) must smooth any seams earlier phases left.

## Motion vocabulary

- Ambient always-on, slow: hero orbit/starfield drift only.
- On scroll: one gentle fade/rise per section as it enters. A single reveal, not a cascade.
- On interaction: small physical "press" on buttons; custom easing curves, never `linear`/`ease-in-out`.
- Animate only `transform` and `opacity`.
- **Hard rule:** everything above the gentlest level collapses to static under `prefers-reduced-motion`.

## Navigation treatment (decided 2026-07-18)

The site nav is a **floating detached pill**: a rounded-full glass bar floating below the top edge (not an edge-to-edge sticky strip), hairline border, backdrop blur, dark translucent fill. P1 shipped a conventional sticky bar as scaffolding; the pill treatment supersedes it (retrofit scheduled alongside P2). Unchanged: mobile shows logo + download CTA only (no hamburger); the download CTA reveal-on-scroll behavior stays.

## Hero (P3) — preference order

1. **Ambient background layer only** — orbit ring + nebula + starfield behind headline/CTA (recommended starting point).
2. **Full wheel as offset hero object** — escalation if option 1 feels too quiet.

Chart notes: read `CHART_DEMO_NOTES.md` before extracting anything from `assets/masters/kairos-chart.html`; swap its Playfair Display → **Cormorant Garamond**; simplify + slow looped spin; hero is the only place the heavy animated wheel is allowed (a lightweight/static variant — `orrery-graphic.svg` — may appear elsewhere as background). `kairos-chart-v1-fallback.html` (working folder, outside repo) is the frozen safety net. Hero may be center-aligned — the one sanctioned exception to the asymmetry default.

## Skill lineup for build sessions (Claude Code)

Invoke per phase, with the overrides below:

- **`high-end-visual-design`** — the primary visual skill (P2, P3, P4). Its "Ethereal Glass" archetype is the closest match to Orrery. Its double-bezel card construction, button-in-button CTAs, heavy whitespace, custom cubic-bezier easing, and floating pill nav are all wanted here.
- **`frontend-design`** — process + copy discipline (any visual phase).
- **`krea-marketing`** — the OG/social-share image (P2). **`krea-generate`** — atmospheric backgrounds/textures if needed (P4). Krea MCP must be connected + authenticated in the session.
- **`design:accessibility-review`** — final polish pass (P6).
- **Do NOT load:** `design-taste-frontend` (dropped 2026-07-18 — its house rules that we keep are inlined above) and `theme-factory` (preset-theme picker; brand is locked, adds nothing).

**Overrides that beat any skill instruction:**
1. Dials are **6/6/3** (above), not the skill's own defaults.
2. Stack is **static HTML + Tailwind v4 + vanilla JS** — no React, no Next, no animation libraries. Apply the skills' *design judgment*, ignore their stack/framework sections.
3. **Orrery tokens** (in `src/main.css`) override any palette/font a skill suggests. Fonts are brand-fixed: Cormorant Garamond / Space Grotesk / Space Mono, loaded via Google Fonts link (decided; ignore "self-host only" advice).
4. Hand-authored SVG / algorithmic art **is sanctioned** for brand-derived orbital/atmospheric graphics (orbits, arcs, starfields, gradient fields) — an explicit exception to any "no hand-rolled SVG" rule. Icons still come from Phosphor (inline SVG, thin/light weight), never hand-drawn.

## Asset notes

- Masters live in `assets/masters/` (git-tracked); optimization runs locally via `npm run images`, output committed to `site/img/`. Never optimize on Vercel.
- Known gap: `home mockup export.png` (transparent iPhone chrome overlay, useful for custom crops) exists in the working folder but was never copied into masters — add it if P4 needs a custom composition.
- The three decomposed showcase screens (`assets/masters/decomposed/screen-1|2|3/`) are P4-only; every other screen illustration is a Mokker shot.
