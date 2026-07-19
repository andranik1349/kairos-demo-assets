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
