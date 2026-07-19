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
