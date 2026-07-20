# P5 → P6 ratified change list

**What this is:** the agreed outcome of the P5 Figma pass, walked through frame-by-frame with Andranik on 2026-07-19. The Figma file is an **approximation, not an authority** — this list is what's ratified; where Figma and this list disagree, this list wins. P6 implements it.

**Figma frames** (file `aMpAPMPUynx0mdB91C9Quc`, "Kairos-HeroUI"): full page `24143-34372` · viewport detail `24143-49245` · section-frame example `24143-48618` (96px padding all sides) · grid container example `24143-48619` (12-col, 1280 max) · nav default `24143-34375` · nav after scroll `24143-49660`.

---

## Global structure — ADOPT

- Content max width **1080 → 1280px**; 12-column grid discipline inside sections.
- Uniform section rhythm: **96px padding** on all sides of each section frame.
- **All clipping removed** from sections/blocks — backgrounds and effects bleed over naturally (reinforces the existing no-hard-transitions rule).

## Tokens — EXTEND the bronze family (base values verified unchanged)

Current CSS `--color-bronze #7A6C53` matches Figma `bronze` exactly; current `--color-bronze-soft #C8B493` is Figma's `bronze-soft-fg-dark`. Adopt the app's naming and add the new values:

| token | value | note |
|---|---|---|
| `bronze` | `#7A6C53` | unchanged |
| `bronze-hover` | `#8F826D` | new |
| `bronze-soft` | `#70624C` at 16% | new (true soft fill); our old `bronze-soft` renames to `bronze-soft-fg-dark` |
| `bronze-soft-fg-dark` | `#C8B493` | existing value, renamed |
| `bronze-soft-fg-light` | `#52483B` | new |

Rename carefully: audit existing `bronze-soft` usages when remapping. Teal/purple values unchanged.

## Typography — ADOPT

**Section headlines go gold serif:** Cormorant Garamond in the bronze family (the sandy `bronze-soft-fg-dark` register per Figma) replaces white display type for all section titles, matching the app's existing title treatment. Applies to every section, including the two being re-styled that aren't in Figma (final CTA, footer context). The handoff doc predates this; Figma + these values are current.

## CTA colors — ADOPT (client-approved brand deviation, recorded in guardrails)

- **Purple = conversion actions:** nav "Get the App", paid-plan button.
- **Teal = product signals** (scores, auspiciousness, in-app UI) and secondary accents (step numbers stay teal).
- Free-plan CTA stays ghost/outline.
- CTA label normalized to **"Get the App"** everywhere (deck updated).

## Nav — ADOPT (two states)

- **Default (top of page):** floating pill, **section links only** — no logo, no CTA.
- **After scroll past hero:** pill grows the **new logo lockup** left (teal orbital mark + bronze KAIROS wordmark + "The Auspicious Moment" descriptor) and the **purple CTA** right. Same IntersectionObserver mechanism, reveal now covers logo + CTA together.
- **Remove the "Ask Kairos" nav link** (section cut; Figma's nav still shows it — Figma is wrong here).

## Hero — ADOPT copy/layout, KEEP the wheel untouched

- New headline: **"The Auspicious Moment"** (bronze serif caps, italic "The"), badges directly beneath, sub-line moves to small copy lower in the hero.
- **The animated wheel stays exactly as built in P3** — it wasn't altered in Figma (only absent because it's live/animated). Recompose the copy around it per the frame.

## Section order — ADOPT

`hero → how → features → what → breadth → pricing → faq → final CTA → footer`.
(How/features move ahead of what; **Ask Kairos section is CUT** — deferred feature; final CTA + footer stay together at the bottom and get the facelift to match, since Figma doesn't include them.)

## Section restyles — ADOPT per Figma frames

- **what:** headline split "Kairos calculates." / "It doesn't divine." (line 2 italic serif); "isn't" column becomes labeled divider rows.
- **breadth:** flipped — chips left, headline right; Related Persons + To-Dos cards below.
- **pricing / faq:** per frames (gold serif headlines, purple paid CTA, casing normalized).
- **final CTA + footer:** not in Figma; restyle in the new vocabulary (gold serif headline, unclipped bleed, new logo lockup in footer).

## Showcases — PRESERVE, add glow

The Flat A decomposed treatment **survives intact** (Figma's flat phones are an import limitation, not a direction). ADOPT the added **background glow fields** behind each showcase — the app UI shares the site's palette and needs the glow to stand out from the canvas.

## Ask Kairos residuals — "coming soon" treatment

Section cut, nav link cut. Pricing paid plan keeps the line as "Ask Kairos: AI-tuned and custom rules (coming soon)"; FAQ free-vs-paid answer mentions it as joining the paid plan when it ships. (Deck updated with both.)

## Assets

- **New logo SVGs:** `../build-assets/logo-variants/` (color/monochrome × horizontal/vertical) → import into `assets/masters/logo-variants/` (normalize the comma-space filenames), use per Figma (nav lockup, footer). Supersedes the P0 white-silhouette placeholder treatment.
- **Official store badges:** present in the Figma hero — export from the Figma file (or Andranik supplies the exports) and drop into the reusable `store-badges` component, replacing P1's placeholders.

## Explicitly NOT adopted

- Figma's nav "Ask Kairos" link (see above).
- Any flattening of the showcases.
- Nothing else in the Figma file overrides the built hero wheel, motion work, or content model.

---

## Addenda — section-by-section Figma port (post-P6a)

Fixes ratified after P6a, as Andranik feeds individual Figma nodes for the settled
layout. Same rule as above (list wins over Figma); value mappings go in
[`figma-to-css-map.md`](figma-to-css-map.md). Verified in real Chrome (the built-in
preview pane can't drive live scroll/IO — see the port memory).

- **Nav section links — three states** (Figma node `24143-36144`, 2026-07-19).
  Desktop section links became pills (`.nav-link`, Space Grotesk 16px — was Space
  Mono 13px in the pre-Figma build): **default** = muted; **hover** = purple text
  (was white); **current** = muted text on a soft-purple fill (`--color-purple` @
  18%, from Figma `accent/accent-secondary-soft`). The **current** state is new
  behavior — a scroll-spy (`initNavCurrentSection` in `site/js/site.js`) sets
  `aria-current="location"` on the link whose section is in view (index only).
  Shell-synced across all four pages. Container gap tightened `gap-5 → gap-1` (the
  node is the link atom; inter-link spacing was a judgment call).
- **Hero background reached the top** (layout fix, not a Figma node, 2026-07-19).
  The sticky `<header>` occupies ~76/84px of flow, which pushed `#hero` (owner of
  the starfield + nebula + glow, `overflow-hidden` so it can't paint above its own
  box) down and left a dead dark strip behind the nav. Fixed with a negative top
  margin on the index hero (`-mt-[76px] sm:-mt-[84px]`, cancelling `header mt +
  nav h-16`) so the ambient background fills to y=0 and the glass nav floats over
  live starfield. Index-only; content re-centers to the true viewport middle.
- **Hero recompose onto the 12-col grid** (Figma `24143-48617` + sub-nodes, 2026-07-20).
  Centered stack → editorial 12-column grid (`max-w-1280`, `gap-6`): logo `col 1-4/row 1`,
  headline `col 3-10/rows 2-3`, download buttons `col 3-10/row 4`, sub-copy `col 1-4/row 5`,
  scroll hint `col 9-12/row 5`; collapses to a centered single-column stack below `md`.
  **96px padding lives on the hero wrapper, NOT the grid container** (Figma structure —
  earlier mistake corrected). Headline now **two-tone**: "The" in `--color-fg` italic (64px)
  + "Auspicious Moment" in `--color-bronze` uppercase (96px), two-line stack. Download
  badges wrapped in **dark-glass pills** (Figma `24143-48944`; near-white token is a
  light-mode artifact — Andranik chose dark glass; footer/final still bare — flagged).
  Sub-copy moved bottom-left, enlarged, and **shortened** — "A flight search for timing."
  dropped per Figma `24143-48997` (Andranik approved; deck updated). New **scroll hint**
  bottom-right ("Start scrolling to learn more" + Phosphor mouse-scroll, `hero.scrollhint`).
  Logo added top-left. **Orrery wheel now fills the container height, uncapped** (Figma
  `24154-31377`) — this **supersedes P3's "shown whole, never cropped"** (it bleeds sides on
  portrait; recorded in `design-guardrails.md`).
- **Nav grow states** (Figma default `24143-34375` / full `24143-48876`, 2026-07-20).
  Full-width bar → **auto-width pill**: default = compact pill hugging just the links; after
  the hero is ~40% scrolled the logo (left) + CTA (right) **grow in horizontally** and the
  pill widens (`grid-template-columns: 0fr→1fr` for clean width animation), centered so it
  grows from the middle. CTA restyled to the **purple gradient** (`.nav-cta-btn`, 88deg
  `#4E43B5→#776CE5`), `rounded-[24px]`, 48px, 14px medium. Reveal moved from the hero
  badges to fire when `#how` enters the top 60% of the viewport (`initNavReveal` in
  `site.js`) — the old reveal fired too late. `.nav-reveal` CSS replaced by `.nav-grow`.
  Shell-synced across all four pages (subpages carry `show` = full state always). "Ask
  Kairos" stays cut (Figma still shows it — wrong, per the top of this doc).
- **Nav links re-labeled/rewired, 8-item scheme** (Andranik's spec, not a Figma node,
  2026-07-20). Nav now carries one link per section, front logo (`/`, home) through
  "Get the App" CTA (`#final`): **Search** (`#search`) → **Evaluate** (`#evaluate`) →
  **Keep Track** (`#features`) → **What is Kairos** (`#what`) → **Uses** (`#breadth`)
  → **Pricing** (`#pricing`) → **FAQ** (`#faq`) → **Get the App** (`#final`, unchanged
  CTA pill). Search/Evaluate are new: the `#how` section held both under one link
  ("How it works") — split into two anchors (`#search`, `#evaluate`, `scroll-mt-24`)
  on the section's two existing rows, no content change. `features` (home-dashboard
  showcase) relabeled **Keep Track** and `what` ("Kairos calculates...") relabeled
  **What is Kairos** — section ids and content untouched, label only. `nav.links.how`
  is retired. Shell-synced across all four pages; scroll-spy (`initNavCurrentSection`)
  needs no changes — it matches on href hash, not a hardcoded list.
- **Two nav bugs fixed, surfaced by the relabel above** (2026-07-20, `site/js/site.js`).
  (1) **Scroll-spy lagged behind the true section**, sometimes by half a section or
  more: `initNavCurrentSection` used a thin (~5%-of-viewport) IntersectionObserver
  band that only fires on edge-crossing events, and a fast/continuous scroll can
  carry a section's edge across that band between two IO check frames with no
  callback at all — the highlight then didn't correct itself until some later,
  unrelated crossing happened to fire. Replaced the IO with a scroll+`resize`
  listener (rAF-throttled) driving the same `update()` geometry check every frame;
  can no longer miss a transition. (2) **The grown nav (logo + CTA) collapsed back**
  to its hidden state once `#how` scrolled fully out of view (around "Keep Track" /
  the old "Features" section) — `initNavReveal`'s IntersectionObserver toggled
  `setShown()` on every intersection change instead of firing once.
  **Superseded same day:** the first fix (one-shot `io.disconnect()` after the
  first `isIntersecting`) turned out to have its own edge case — IO only reports
  intersection at discrete checks, so a large/fast scroll jump can skip over
  `#how` without ever rendering a frame where it "intersects," meaning the
  one-shot observer could disconnect having never fired, leaving the reveal
  permanently stuck hidden. `initNavReveal` now uses the same scroll+rAF
  geometry check as the scroll-spy (checks `#how`'s live `getBoundingClientRect()`
  on every scroll frame, stops listening once shown) — no `IntersectionObserver`
  left in `site/js/site.js` at all. Verified in real Chrome via genuine scroll
  gestures (not `window.scrollTo`), cross-checking a `javascript_tool` DOM read
  against a freshly re-captured screenshot — neither alone was trustworthy this
  session (a screenshot taken immediately after a large scroll jump once showed
  the nav still collapsed while the DOM read said it was already correctly
  shown; a second screenshot then matched the DOM). Full incident record in
  `docs/session-handoff.md`.
- **Hero wheel flattened to a decorative showpiece** (Andranik, not a Figma node,
  2026-07-20 — commit `15f5719`; `site/js/hero-chart.js` + `#hero` CSS in
  `src/main.css`). The P3 wheel animated nearly everything on the sky
  independently; this reduces it to **one rigid spinning group** plus the few
  ambient layers, cutting continuously-animating elements from ~50 to ~6 with
  **no change to the wheel's geometry, data, or the nebula/starfield**.
  - **Glyphs no longer counter-rotate.** P3 wrapped every zodiac/planet glyph in
    a `<g class="cr">` running `k-counterspin` (240s) so it stayed screen-upright
    against `#sky`'s spin. Now each glyph gets a **static radial rotation**
    (`radialDeg` in `hero-chart.js`) — fixed to the wheel like clock-face
    numerals, riding the spin rigidly. `.cr` wrappers gone (glyphs, retrograde ℞
    marks, Part-of-Fortune marker); `@keyframes k-counterspin` deleted.
  - **Planet halos no longer pulse** — `k-halopulse` + the per-halo staggered
    `animationDelay` removed; halos are static `opacity:.85`.
  - **Kept:** sky spin, deco tick-ring spin, center-glow breathe, nebula drift,
    starfield twinkle, one-shot load entrance. `prefers-reduced-motion` still
    collapses to static (block updated to drop the now-inert `.cr`/`.halo`).
  - **Visible change:** symbols used to stay upright as the wheel turned under
    them; now they turn *with* the wheel, and the planet halos sit still. Motive:
    lighter compositor load; partly eases (does not eliminate) the never-idle
    snapshot race. Supersedes the counter-rotate/pulse behavior described in
    `docs/prompts/p3-hero.md` (kept as a historical phase record). Full
    before/after table in `docs/session-handoff.md`.

### Section-ports session (2026-07-20)

_Full narrative changelog in `docs/session-handoff.md`; value mappings in `figma-to-css-map.md`. Ratified entries:_

- **`#how` split into `#search` + `#evaluate`** (commit `9f92e2c`). The two "how it works" rows became first-class sections, each with its own gold headline (old combined line split at the comma). Nav links/labels unchanged; reveal trigger repointed `#how`→`#search`; scroll-spy follows automatically.
- **Unified section layout system** (commit `aae84a0`). Every content section now uses the hero's structure: full-bleed `<section>` (holds the ambient bg so it bleeds to the viewport) → `px-6 py-24 md:p-24` padding wrapper (96px all sides) → `max-w-[1280px]` content container (`70ch` for FAQ). Replaces "max-width + padding both on the section." Uniform 96px vertical rhythm. Footer `/#how`→`/#search` (was dead after the split; shell-synced).
- **Column-based hairline indent** (commit `4b77d1c`, superseding fixed-px `bbf881d`). Text sections indent past a vertical hairline built as a nested `md:grid md:grid-cols-6 md:gap-6`: a **1-column spacer** with `border-l-2 border-hair` in col 1, content in `col-span-4`. Rail = one grid column, so the indent scales with the viewport (matches Frame `24173-30978` inside `24173-30977`).
- **Search / Evaluate / Features / What-is content ports** (`24173-30970`, `24173-30995`, `24173-31020`, `24143-49152`; commits `84a3d9c`, `9c69f4c`, `5cff525`, `e66f724`). Search: headline in the left column, showcase right (50/50), 20px numbered list. Evaluate: mirror (showcase left). Features: un-mirrored twin, serif title + body (no list). What-is: 72px Cormorant headline ("KAIROS Calculates" gold + "It doesn't divine" italic muted, no periods, per `24143-49155`); two ledger lists (6/5 cols, top-aligned) with teal `+` / red `×`; **`what.sub` paragraph dropped** (absent in Figma).
- **Hero headline contrast** (commit `f983e66`). "Auspicious Moment" moved off base `--color-bronze` (`#7A6C53`) to `--color-bronze-soft-fg-dark` (`#C8B493`) — resolves the flagged large-text a11y risk.
- **New `--color-negative` token** (`#DB3B3E`, commit `ef7f8fa`) for the "isn't" `×` marks — a negative/error colour the palette was missing (`text-negative` etc.).
- **Cormorant Garamond italic fix** (commit `3f9b028`). The Google Fonts URL requested no `ital` axis → every italic was **faux** (slanted upright). Added the italic axis (400/500/600 both styles; dropped unused 700); shell-synced across 5 pages.
- **Final-CTA store buttons → hero glass pills** (commit `f053bda`); **footer store badges → text-only social pills** + redundant Legal "Social" link removed (commit `93b4f08`).
- **Nav reveal made two-way** (commit `034abeb`). Was one-way (removed its own listeners after first reveal); now re-evaluates geometry every frame, so it shrinks back at the top of the hero.
- **Hero ambient CSS animations pause off-screen** (commit `75661b6`). Finishes the visibility gating the starfield canvas already had: `syncLoop` toggles `#hero.anim-idle` → `animation-play-state: paused` on the 6 infinite CSS animations when the hero is out of view or the tab is hidden.
- **Removed the two fixed dark-canvas radial glows** (commit `99cedbd`) — `background-attachment: fixed` on `body`, tiling/clipping against the per-section `overflow-x-clip` and showing hard seams. Per-section backgrounds return as needed.
