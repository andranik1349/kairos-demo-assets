# P6b · Polish & release — Claude Code prompt

> The final pass. Requires P6a **and the post-P6a section-by-section Figma port** complete (they are — see `docs/session-handoff.md`, 2026-07-20 section-ports session). After this, the site is release-ready; remaining tweaks happen as fine-comb sessions.
>
> **Revised 2026-07-20** to reflect the port: `#how` no longer exists (split into `#search` + `#evaluate`), the layout system is unified, several previously-owed items are already resolved, and the verification doctrine is mandatory reading.

---

## Before anything

1. Read `CLAUDE.md`, `docs/design-guardrails.md`, `README.md`, `docs/p5-change-list.md` (incl. Addenda), **`docs/session-handoff.md` — especially "How to run / verify"; its rules are binding for this session**, and `docs/figma-to-css-map.md`.
2. Invoke **`high-end-visual-design`** and **`design:accessibility-review`**.
3. Preview via `npm run preview` (the no-store server) + `npm run dev` for Tailwind watch. **Never** claim a dynamic behavior (scroll reveal, spy, hover) is broken or working from a single tool read — two agreeing independent signals or hand it to Andranik. Dynamic behavior and mobile are **Andranik's to verify**; your job is code-level correctness, static verification, and forced end-states.

## Hands-off zones

- **`site/js/site.js` nav patterns:** the geometry-driven rAF scroll checks (reveal + scroll-spy) replaced IntersectionObserver deliberately after documented failures. Do not reintroduce IO there, do not "optimize" the pattern, do not rewrite the two-way reveal.
- **`site/js/hero-chart.js`:** the flattened wheel (rigid spin, radial glyphs, static halos) and the `anim-idle` off-screen gating are settled. No motion re-additions.
- Section structure, order, nav scheme (8 items), copy: frozen. This prompt finishes; it does not redesign.

## Work items

1. **Scroll choreography, page-wide:** each section gets **one gentle fade/rise** on first entry — a single reveal per section, never a per-element cascade. IntersectionObserver is fine *for this* (it's one-shot, coarse, and unaffected by the nav pitfalls — but read the handoff's IO pitfalls first; use generous margins, `once` semantics with a geometry fallback on load for sections already in view). Transform/opacity only, custom easing, fully off under `prefers-reduced-motion`. The hero keeps its own entrance; don't double-animate it. Must not fight the hero's `anim-idle` gating.
2. **Seam sweep + ambient depth restoration:** the old body-level fixed radial glows were removed (they clipped at section boundaries — `99cedbd`). Walk the full page and (a) confirm no visible seams anywhere (the hard page-composition rule), (b) **reintroduce ambient background depth per-section where the canvas now feels flat** — glows/gradient fields living inside sections' full-bleed layers, bleeding across boundaries, never `background-attachment: fixed`. The hero's ambient treatment sets the standard.
3. **Scores-lines treatment (Andranik-flagged):** the `+17 · +13 · +10` / `+5 · -7 · 0` lines under Search/Evaluate read bland. Design a worthy small treatment (e.g. score chips in the app's visual language — Space Mono, teal for positive, `--color-negative` available for the -7, hairline containers) — restrained, one idea, no new section furniture.
4. **Showcase harmonization + tuning:** decide the Features showcase height cap (`min(500px,38dvh)`) vs Search/Evaluate (`min(430px,34dvh)`) — harmonize if the three phones should read the same size, or keep the centerpiece larger *deliberately*; state the choice. Then the motion-coefficient pass on `site/js/showcase.js` (small refinements, "alive but assembled") and an aria-label consistency check.
5. **Strategic glass:** nav pill + download pills already carry the glass identity. At most **one or two** further spots if they earn their place (pricing preferred card is the candidate); `prefers-reduced-transparency` fallback; zero is acceptable.
6. **Micro-interactions:** press states, hover refinements, focus-visible on every interactive element (nav pill links have states; accordion, toggle, buttons, social pills need the same care), custom easing throughout.
7. **Sections without a dedicated Figma pass** (Breadth, Pricing, FAQ, Final): a consistency pass in the established vocabulary — typography scale, hairline/indent rails where they fit, 96px rhythm already in place. No re-layout; make them feel like the ported sections' siblings.
8. **Housekeeping:**
   - Tokenize the nav CTA gradient (`.nav-cta-btn` literal `88deg #4E43B5→#776CE5`) into theme values.
   - Sweep remaining raw brand hex outside `src/main.css` (inline SVGs etc.) → token vars.
   - Add `--color-negative` to `site/styleguide.html` (guardrails entry already done).
   - Wire the 440px image variants into real `srcset`/`sizes`; re-run `npm run images`; report mobile payload before/after.
9. **Accessibility once-over** (`design:accessibility-review`): WCAG AA contrast audit — verify the hero headline's `bronze-soft-fg-dark` now passes large-text (expected, confirm with numbers), white-on-purple-gradient CTA, muted-on-canvas body, `--color-negative` marks; alt/aria audit; full keyboard walk (nav states incl. `aria-current`, accordion, toggle, focus order per the final section order); reduced-motion via the OS setting (hero static wheel, showcases static, reveals off).
10. **Responsive, code-level:** audit all sections at 390/768/1024/1280/1728 widths for collapse correctness (chips wrap, ledgers stack, grids single-column, no horizontal scroll). Report what you verified statically; **list what needs Andranik's device check** rather than claiming it.
11. **Performance & release output:** Lighthouse-style numbers (LCP, CLS, page weight, hero JS size); OG tags validated on all four pages; final `npm run build`; README + handoff refresh to release state; update the plan's progress log; write `docs/reports/p6b-report.md` in the established format, including a "left for fine-comb" list.

## Acceptance checklist

- [ ] One reveal per section, hero untouched, reduced-motion clean (OS-level check)
- [ ] No visible section seams at any viewport; ambient depth restored per-section without `background-attachment: fixed`
- [ ] Scores lines have their treatment; Features cap decision stated
- [ ] Glass ≤ 2 new spots with fallbacks (or zero, stated)
- [ ] No raw brand hex outside `src/main.css`; gradient tokenized; `--color-negative` in styleguide
- [ ] `srcset`/`sizes` live; payload numbers reported
- [ ] Contrast numbers reported (hero headline, purple CTA, negative marks); keyboard walk clean
- [ ] Responsive audit reported honestly (verified vs needs-device-check)
- [ ] Perf numbers + OG validation reported; README/handoff/report/plan updated
- [ ] `site.js` nav patterns and `hero-chart.js` untouched (`git diff` scoped accordingly)

Commit in logical chunks, push, report the preview URL, all measured numbers, and the fine-comb list.
