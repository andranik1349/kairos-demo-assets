# P3 · Hero with the live chart wheel — Claude Code prompt

> Phase P3 (see `docs/kairos-landing-implementation-plan.md`). Requires P0–P2 complete. The hero is isolated as its own phase because the animated wheel is the fiddliest piece on the page.

---

## Before anything

1. Read `CLAUDE.md`, `docs/design-guardrails.md`, `README.md`, and `docs/content/p2-sections.md` (hero strings are in its "Block 1 · Hero" section).
2. Copy `../CHART_DEMO_NOTES.md` (working folder, sibling of this repo) into `docs/reference/chart-demo-notes.md` and **read it fully** — it documents the chart file's architecture (geometry engine, glyph sprite, scene z-order, animation system) and what is safe to extract. Do not start extraction before reading it.
3. Invoke **`high-end-visual-design`** and **`frontend-design`**. Guardrails' overrides beat skill instructions (dials 6/6/3, static stack, Orrery tokens, sanctioned orbital SVG art).

## Ratified decisions for this phase (do not re-open)

- Hero visual = **simplified wheel as hero object** + ambient layers, center-aligned copy, store badges as the only CTA.
- Wheel is **decorative only**: no tooltips, no tap/hover states, no pointer parallax, no date switcher.
- **Sky spin ≈ one revolution per 4 minutes**, plus the prototype's full ambient inventory stays alive: nebula drift, starfield twinkle, planet-halo pulses, center-glow breathe, tick-ring spin, staggered entrance on load.
- Everything collapses to a static (but complete and legible) wheel under `prefers-reduced-motion`.

## Source & extraction

Source: `assets/masters/kairos-chart.html` (self-contained: `WheelCore` geometry engine, inline glyph sprite, scene data JSON, CSS, ambient JS all baked in).

**Extract:** WheelCore + the scene data + glyph sprite + the wheel/ambient CSS, into the hero. Suggested shape: hero markup in `index.html`, chart logic as `site/js/hero-chart.js` (deferred), chart-specific styles either in the Tailwind input's component layer or a small dedicated CSS file — your call, keep it clean and documented.

**Strip (must not ship):** the date-switcher UI and its OPTS logic, the in-app device view (`mode-app`) and its **base64-embedded iPhone mockup PNG** (large; grep for the data URI and confirm it's gone from shipped output), hover/tap tooltips and `.phit` hit areas, pointer parallax, the standalone page chrome (view toggles, captions).

**Simplify the wheel** (Stage 1's "less detail than the in-app wheel"):
- Keep: zodiac band + sign glyphs, planet glyphs with halos and retrograde marks, the connector-tick system if clusters need it, a restrained subset of aspect threads (strongest few by orb, not all 16), decorative tick ring, core glow.
- Drop: house-number band, cusp spokes, house numbers, ASC/DSC/MC/IC axis lines and glyphs. (Axis removal is client-approved, 2026-07-19 — there's precedent in the app itself. Do not re-add for "completeness.")
- The wheel must still read as a real calculated chart, not abstract decoration — real glyphs at real degrees.

**Serif swap:** the chart file uses Playfair Display for serif accents. Production is **Cormorant Garamond** (already loaded). No Playfair reference may survive anywhere in shipped pages.

## Motion spec

- Sky group (zodiac + planets + aspects) rotates continuously, ~4 min per revolution, CSS animation on `transform`; glyphs counter-rotate to stay upright (the mechanism documented in the notes §9 — reuse it, per-glyph `transform-box: view-box` + own-center origins).
- Ambient inventory as listed above; entrance = staggered fade/pop on load per the prototype.
- All animation is `transform`/`opacity` (+ canvas for the starfield). Cap the starfield's device-pixel-ratio and particle count so mobile stays smooth.
- `prefers-reduced-motion`: kill spin, drift, twinkle, pulses, entrance stagger; render the finished static wheel immediately.

## Layout

- Replace the `#hero` stub. Center-aligned stack: `hero.headline` (Cormorant, the page's largest type), `hero.sub`, the store-badges block (the identical labeled component from P1). Max 3 text elements + badges; no eyebrow, no extra links, no scroll cue.
- The wheel sits dimmed behind/below the copy, large but **shown whole — never cropped** by the hero's edges. Ambient layers fill the hero canvas and dissolve gradually. Copy must pass contrast over it (scrim or radial darkening behind the text block if needed).
- **No hard transition out of the hero** (page-wide rule, see guardrails): the hero has no visible bottom edge, border, or background change; its ambient layers and dark canvas fade seamlessly into `#what` below.
- Hero fits the initial viewport (`min-h-[100dvh]`, never `h-screen`): headline, sub, and badges visible without scrolling on common desktop and mobile sizes.
- The P1 nav-CTA reveal observes the hero badges — verify it still works after the stub is replaced.
- Mobile: the wheel scales down but stays whole (sitting more fully behind the copy is fine); badges stack; reduced particle counts are fine.

## Acceptance checklist

- [ ] Hero renders with the simplified wheel spinning imperceptibly slowly, all ambient layers alive, entrance stagger on load
- [ ] Reduced-motion shows a complete static wheel, no dead space
- [ ] No tooltips, no switcher, no parallax, no Playfair, no base64 mockup PNG in shipped output
- [ ] Copy exact from the deck with `data-content` labels; badges block identical to footer's; nav CTA reveal still works
- [ ] Headline + sub + badges above the fold at 1440×900, 1280×800, and 390×844
- [ ] Smooth on a mid-range device (no jank while scrolling past the hero); page weight sane (report hero JS+CSS size)
- [ ] `npm run build` clean; Vercel preview verified; `docs/reference/chart-demo-notes.md` committed

Commit in logical chunks, push, report the preview URL, the shipped hero asset sizes, and any deviations with reasons.

## Out of scope

The `#how`/`#features` showcases (P4), scroll choreography for the rest of the page (P5), any restyling of P2 sections. If the wheel extraction reveals something structurally wrong, stop and flag it.
