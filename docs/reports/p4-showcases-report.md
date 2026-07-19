# P4 · Decomposed showcases — build report

**Phase:** P4 (Flat A decomposed showcases) · **Built + deployed:** 2026-07-19 ·
**Prompt:** `docs/prompts/p4-showcases.md` · **Live:** https://kairos-demo-bice.vercel.app
**Commits:** `5f7e101` … `5de65d3` on `main`.

---

## What was delivered

- **Three showcase instances of one reusable pattern** ("Flat A": flat 2x PNG
  layers, all tilt/depth/motion in CSS + JS, per the PoC now committed at
  `docs/reference/poc-decomposition.html`):
  - `#how` · SEARCH row → activity-input-form showcase (screen-3)
  - `#how` · EVALUATE row (mirrored) → evaluation-result showcase (screen-2)
  - `#features` → home-dashboard showcase (screen-1) as the single centerpiece
- **Motion = "assembled with depth"** as ratified: compositions stay whole;
  per-layer scroll parallax (a few px, scaled by each layer's depth) and a
  slight pointer lean, desktop fine-pointers only. One shared animation loop
  (`site/js/showcase.js`, 3.9 KB raw / 1.6 KB gzipped) that stops whenever no
  showcase is on screen or the tab is hidden. Touch devices and
  `prefers-reduced-motion` get the static assembled tilt straight from CSS —
  the loop never starts.
- **Sections** built with the deck's exact copy and `data-content` labels:
  `#how` headline + two mode rows (uniform 3-step structures, Space Mono
  sample scores), `#features` headline + centerpiece copy. The two `#how` rows
  spend the page's entire zigzag allowance; no eyebrows added (page total
  stays at 2).
- **Background art**: hand-authored token-colored SVG (orbital ellipses, one
  faint purple gradient field, sparse star dots) continuing the hero's
  vocabulary; no hard seams between sections. Krea was not used (per plan).
- **Image pipeline** enabled for `assets/masters/decomposed/` with
  alpha-preserving AVIF/WebP/PNG output; `reference.png` files are not
  shipped.

## Measured results

| Check | Result |
|---|---|
| Frame rate, forced 4 s top-to-bottom scroll at 1440×900 (hero + all three showcases live) | 60 fps average, worst instantaneous frame 53 fps |
| Image payload actually downloaded by a modern browser (AVIF, all 14 layers) | 323 KB (WebP tier 577 KB; PNG fallback tier 3.3 MB, legacy browsers only) |
| Alignment | Layer positions computed by template matching against each `reference.png`; two content-identical anchor layers matched at mean per-channel error 0.17 and 1.85 (effectively exact); all positions land on the design grid. Verified by recompositing all three screens from their layers and comparing against the references. |
| Mobile (390×844) | Compositions assembled and legible at 71–75% of viewport height; no horizontal scroll |
| `npm run build` / console | Clean; zero console errors |

## Deviations from the plan, with reasons

1. **The `reference.png` files are an older content revision than the layer
   exports.** Screen-1's reference shows three identical To-Do cards where the
   layers carry five distinct ones; screen-3's person carousel has a different
   person order. Frame geometry, sizes, and slot positions match exactly, so
   the build proceeded on structural fidelity (positions measured by template
   matching, nothing nudged by eye) and the discrepancy is flagged here
   instead of blocking the phase. "Pixel-faithful to reference" is therefore
   satisfied for layout, not for placeholder text content. If a future QA pass
   wants literal overlay-diffing, the references should be re-exported from
   the current design file.
2. **`assets/masters/MANIFEST.md` had the screen-2 and screen-3 headers
   swapped** relative to the folders' actual contents (screen-2 is the
   evaluation result, screen-3 the activity form; the P4 prompt and the files
   agree). Corrected in the manifest with a note.
3. **Two layers are deliberately larger than their slots** — screen-1's To-Do
   stack is taller than the phone, screen-3's person carousel wider. Their
   overflow is dissolved with CSS fade masks (bottom fade on the stack, right
   fade on the carousel) so the compositions read as one assembled screen
   instead of hard-clipping at section edges. Not in the plan; required by the
   assets' actual geometry.
4. **Shadows use `drop-shadow` filters, not the PoC's `box-shadow`.** The
   PoC's layers were rectangular screenshots; ours are transparent cutouts,
   and a box-shadow would paint a rectangle around them. `drop-shadow`
   follows the PNG alpha. Tinted to the canvas per the prompt; static, so no
   per-frame blur cost.
5. **Showcase `aria-label`s are invented placeholder copy** (e.g. "The home
   dashboard, decomposed into floating layers") with `data-content` labels —
   the deck provides no attribute strings for these, and the images are
   meaningful content. Marked with an adjacent comment for the client pass.
6. **Pipeline widths for this folder are 440/880 (+ native for oversize
   masters), not the default 480/960/1440** — matched to the layers' actual
   2x display sizes so no absurd upscales are generated.
7. One em-dash grep hit lives in `site/styleguide.html` — the unlinked P0
   foundation test page, not part of the visitor-facing site. Left as-is.

## Fixes after the initial P4 deploy

1. **Re-imported `screen-2/sticky-button.png`** after the source file was
   adjusted in the working folder (client request). Same 880×216 canvas, so
   layer geometry was untouched; variants regenerated, verified live
   byte-identical on Vercel. (`cdf0010`)
2. **Viewport-height sizing bug (client-reported): showcases rendered
   near-full-screen on laptops.** Root cause: scene width was capped only by
   column width; at the compositions' 880:1912 aspect, 430–500 px wide means
   930–1090 px tall — taller than a typical laptop viewport. The dev-time
   check missed it because the preview pane letterboxes scaled screenshots.
   Fix: each scene's width cap now carries a viewport-height term —
   `min(430px, 34dvh)` for the `#how` rows, `min(500px, 38dvh)` for the
   centerpiece — pinning showcase height to ~74% / ~83% of any viewport while
   keeping composition and aspect ratio intact. Verified at 1728×1117,
   1280×800, and 390×844. (`5de65d3`)

## Known items handed to P5

- Showcase motion refinement "after it can be felt" is the plan's own
  expectation; parallax/lean coefficients live in `site/js/showcase.js` and
  the resting tilt in each instance's `--rx`/`--ry` markup props.
- Reduced-motion behavior is verified at the CSS/JS level; a hands-on check
  with a device set to "reduce motion" belongs in P5's accessibility pass
  (same note as P3's hero).
- If any spot around the showcases still feels flat, the sanctioned follow-up
  is Krea atmospheric texture (explicitly deferred out of P4).
