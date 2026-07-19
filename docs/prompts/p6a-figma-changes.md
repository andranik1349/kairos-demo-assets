# P6a · Implement the P5 change list — Claude Code prompt

> First half of Phase P6 (see `docs/kairos-landing-implementation-plan.md`). Requires P0–P4 built and the P5 Figma pass ratified. Companion `p6b-polish-release.md` runs AFTER this one.

---

## Before anything

1. Read `CLAUDE.md`, `docs/design-guardrails.md` (note the revised CTA-color rules), `README.md`, **`docs/p5-change-list.md` (the authority for this phase — where Figma and it disagree, it wins)**, and `docs/content/p2-sections.md` (updated strings).
2. Invoke **`high-end-visual-design`** and **`frontend-design`**. Guardrails' overrides still stand (dials 6/6/3, static stack, tokens over skill palettes).
3. The Figma frames listed at the top of the change list are available for visual reference via the Figma MCP (screenshots of specific frames; node-scoped variable reads if a value is in doubt). If you pull design context from Figma, invoke the `figma-design-to-code` skill first, per its own requirement. Don't try to ingest the whole page node at once — it's huge; work frame-by-frame.

## Work items (all from the change list — details live there)

1. **Tokens:** extend/rename the bronze family per the change-list table (`bronze-hover`, true `bronze-soft` at 16%, `bronze-soft-fg-dark`, `bronze-soft-fg-light`). The rename (`bronze-soft` → `bronze-soft-fg-dark`) requires auditing every existing `bronze-soft` usage — grep before and after; no orphaned classes may survive the build.
2. **Global structure:** content max width 1080 → **1280px** everywhere (sections, nav pill width logic); normalize section rhythm to the **96px** padding model; remove boxed visual clipping so backgrounds/effects bleed across section boundaries. Caveat: *visual* clipping is what's being removed — keep whatever functional overflow guards prevent horizontal scrollbars (e.g. the wide carousel layer in screen-3's showcase); page must still never scroll sideways.
3. **Section reorder:** `hero → how → features → what → breadth → pricing → faq → final → footer`. **Delete the `#ai` section markup** (strings stay in the deck, marked cut) and **remove the "Ask Kairos" nav link** on all four pages. Keep all other section IDs unchanged (anchors, analytics).
4. **Nav, two states** (all four pages, shell-sync rule): default = floating pill with **links only**; after scrolling past the hero badges = pill grows the **new logo lockup** (color-horizontal variant: teal orbital mark, bronze wordmark, "The Auspicious Moment" descriptor) left and the **purple "Get the App"** CTA right — same IntersectionObserver mechanism, reveal now animates logo + CTA together (smooth width/opacity, reduced-motion instant). Subpages (terms/privacy/404): full state always.
5. **Hero recomposition:** new headline `hero.headline` ("The Auspicious Moment" — bronze serif caps with italic "The", per frame `24143-34372`), badges directly beneath, sub-line as smaller copy lower in the hero. **The animated wheel and its JS stay untouched** — recompose copy around it; `site/js/hero-chart.js` should show no diff this phase.
6. **Section restyles per the change list:** gold serif section headlines page-wide (`bronze-soft-fg-dark` register, Cormorant); `#what` split headline (two styled lines) + "isn't" column as labeled divider rows; `#breadth` flipped (chips left, headline right); pricing + FAQ per frames (purple paid CTA, ghost free CTA); **final CTA + footer get the facelift by extension** — they're not in Figma, so apply the new vocabulary (gold serif headline, unclipped bleed, new logo lockup in the footer) with design judgment consistent with the rest.
7. **Showcase glow fields:** add the purple-leaning background glows behind all three showcases per the frames. The Flat A decomposed treatment itself must survive byte-identical in behavior — glow is additive background only.
8. **Assets:** import `../build-assets/logo-variants/` into `assets/masters/logo-variants/` (normalize the `color=color, layout=horizontal.svg`-style names to kebab-case), pipeline them through, and replace the P0 white-silhouette logo treatment where the change list says (nav lockup, footer). **Store badges:** export the official badge artwork from the Figma hero frame via the Figma MCP asset tooling; if export fails, keep placeholders and flag loudly — do not hand-draw.
9. **Copy:** the deck is already updated — sync every changed string ("Get the App" everywhere, new hero headline, split what-headline, pricing "(coming soon)" line, revised FAQ free-vs-paid answer). `data-content` names updated where the deck renamed them (`what.headline.1`/`.2`).
10. Update `README.md` (logo treatment, nav states, 1280 grid) and the plan's progress log.

## Acceptance checklist

- [ ] Section order matches; `#ai` gone from markup and nav on all four pages; no dead anchors
- [ ] Tokens extended + renamed with zero orphaned utility classes (`npm run build` clean, grep audit shown in report)
- [ ] 1280 max width and 96px rhythm applied; no horizontal scroll at any viewport
- [ ] Nav: links-only at top, logo + purple CTA reveal on scroll, full state on subpages, reduced-motion instant
- [ ] Hero: new headline treatment, wheel untouched (`git diff` on hero-chart.js empty), badges + sub per frame
- [ ] Gold serif headlines page-wide incl. restyled final CTA + footer; purple/teal split per change list
- [ ] Showcases behave exactly as before, now with glow fields
- [ ] New logo lockup live (nav + footer); badges real (exported) or flagged
- [ ] All copy matches the updated deck; Vercel preview verified

Commit in logical chunks, push, report preview URL + deviations. **Do not start P6b work** (choreography, seams, glass, srcset, a11y) — that prompt runs next on this settled layout.
