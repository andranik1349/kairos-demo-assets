# P4 · Flat A decomposed showcases — Claude Code prompt

> Phase P4 (see `docs/kairos-landing-implementation-plan.md`). Requires P0–P3 complete. This is the premium visual moment of the page: the three app screens torn into floating layers.

---

## Before anything

1. Read `CLAUDE.md`, `docs/design-guardrails.md`, `README.md`, and `docs/content/p2-sections.md` (blocks 3 and 4 — copy and composition for this phase).
2. Copy `../kairos-poc-decomposition.html` (working folder, sibling of this repo) into `docs/reference/poc-decomposition.html`, and **study it** — it's the proven proof-of-concept for the Flat A technique (CSS 3D tilt, layer stacking, parallax wiring, FPS instrumentation). Reuse its approach; don't reinvent the wiring.
3. Invoke **`high-end-visual-design`** and **`frontend-design`**. Guardrails' overrides beat skill instructions (dials 6/6/3, static stack, Orrery tokens, sanctioned orbital SVG art).

## Ratified decisions for this phase (do not re-open)

- **Technique = Flat A:** flat straight-on PNG-2x layers; all tilt, depth, and motion applied in CSS. Never re-export or pre-bake angles. PNG masters are final (don't re-pitch SVG).
- **Mapping:** `#how` gets the **activity-input-form** showcase (screen-3, the "ask" moment, SEARCH row) and the **evaluation-result** showcase (screen-2, the "answer" moment, EVALUATE row). `#features` gets the **home-dashboard** showcase (screen-1) as its single centerpiece.
- **Motion = assembled with depth** (decided 2026-07-19, supersedes the earlier "disassemble on scroll" leaning): each composition stays whole; subtle per-layer parallax as the visitor scrolls through, slight lean on pointer (desktop only). No disassembly, no scroll-scrubbed separation. P5 may refine after it can be felt.
- **Background art = hand-authored SVG**, continuing the hero's vocabulary: orbital arcs, faint gradient fields, sparse star dots, token-colored, dissolving between sections. Krea is NOT used in this phase; if a spot feels flat, flag it for a follow-up instead.

## Assets & pipeline

Masters: `assets/masters/decomposed/screen-1|2|3/` — each holds flat transparent PNG-2x layers plus a `reference.png` (the intact screen, for alignment only; never shipped).

- Enable the decomposed layers in the image-pipeline config (left disabled in P0) and run `npm run images`. Output must **preserve alpha** (WebP/AVIF with transparency + PNG fallback) at widths suited to their display size (layers are ~880px-wide 2x exports rendering at roughly 400–550px; don't generate absurdly large variants).
- Layer inventories are in `assets/masters/MANIFEST.md`. Screen-1: phone+chart, To-Do card stack, two info pills, tab bar. Screen-2: phone bg, score chip, date/time cards, save button. Screen-3: phone bg, person-picker cards, form inputs, two CTA buttons.

## The showcase component

One reusable pattern, three instances. Per the PoC:

- A perspective-tilted 3D stack: layers positioned to match `reference.png` alignment exactly, then separated along the z-axis (satellite layers — pills, cards, buttons — lifted above the phone base).
- **Scroll parallax:** small per-layer translate offsets tied to the section's progress through the viewport (satellite layers drift a few px more than the base). Subtle: the composition must always read as one assembled screen.
- **Pointer lean (desktop only):** the whole stack leans a few degrees toward the cursor, layers shifting slightly by depth. Smooth lerp, transform-only, no jank.
- **Reduced motion / touch:** a static tilted composition, fully assembled, no parallax or lean.
- Soft depth shadows under lifted layers (tinted to the canvas, never pure black); optional hairline glow on the teal elements. All motion `transform`/`opacity`, 60fps with all three instances live (the PoC proved x6, so this is comfortable).

## Sections

Copy exact from the deck with `data-content` labels; composition notes from the deck govern layout.

- **`#how`** — headline, then the two mode rows (SEARCH / EVALUATE) with alternating orientation, each pairing the uniform 3-step structure + sample scores (Space Mono) with its showcase instance. This spends the page's entire zigzag allowance; the rows may vary in vertical rhythm to avoid a stamped-twice look.
- **`#features`** — the home-dashboard showcase large and slightly offset as the centerpiece, `features.centerpiece.*` copy composed against it. Airy (density 3). At most one minor Mokker accent, only if the composition needs it.
- **Background art** behind/around both sections per the ratified decision, dissolving across section boundaries — **no hard transitions** (page-wide rule; the seam from P3's hero into `#what` sets the standard).

## Acceptance checklist

- [ ] All three showcases assembled pixel-faithful to their `reference.png` (overlay-compare during dev), tilted, breathing with scroll parallax and pointer lean
- [ ] Reduced-motion and touch devices get clean static tilted compositions
- [ ] Frame rate holds with all three instances plus the hero on one page (test scrolling top to bottom; report findings)
- [ ] Pipeline outputs alpha-preserving variants; `reference.png` files not shipped to `site/img/`
- [ ] `#how` and `#features` stubs replaced; copy exact from deck with labels; zigzag cap respected; no eyebrows added
- [ ] Background art token-colored, section seams invisible
- [ ] Mobile pass: compositions scale down assembled and legible, no horizontal overflow
- [ ] `npm run build` clean; Vercel preview verified; `docs/reference/poc-decomposition.html` committed

Commit in logical chunks, push, report the preview URL, FPS observations, and any deviations with reasons.

## Out of scope

Scroll choreography for non-showcase elements, glass extras, responsive/a11y full pass (all P5). No restyling of P0–P3 output beyond seam-blending where the new sections meet their neighbors. If layer assets don't align with a reference, stop and flag rather than nudging art by eye.
