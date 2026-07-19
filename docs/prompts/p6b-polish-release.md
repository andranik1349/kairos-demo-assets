# P6b · Polish & release — Claude Code prompt

> Second half of Phase P6, the final pass. Requires P6a complete (P5 change list implemented; layout settled). After this, the site is release-ready; any remaining tweaks happen as fine-comb sessions directly in Claude Code.

---

## Before anything

1. Read `CLAUDE.md`, `docs/design-guardrails.md`, `README.md`, `docs/p5-change-list.md` (context for what just changed), and skim the P3/P4 reports' "handed to P5/P6" notes (`docs/reports/`).
2. Invoke **`high-end-visual-design`** and **`design:accessibility-review`** (for the a11y pass). Guardrails' overrides stand.

## Work items

1. **Scroll choreography, page-wide:** each section gets **one gentle fade/rise** as it enters the viewport — a single reveal per section, never a cascade of per-element effects. IntersectionObserver, transform/opacity only, custom cubic-bezier easing, `once` semantics (no re-triggering on scroll-up). Fully disabled under `prefers-reduced-motion`. The hero keeps its own entrance stagger from P3; don't double-animate it.
2. **Seam sweep:** scroll the full page and eliminate any remaining hard visual boundary between sections (the page-composition rule in the guardrails). The hero's dissolve into `#how` (post-reorder) sets the standard. Backgrounds, glows, and orbital art should hand off across boundaries; adjust gradients/bleeds where P2-era sections still band.
3. **Showcase motion tuning:** with the glow fields in, revisit the parallax/lean coefficients in `site/js/showcase.js` and the resting tilts (`--rx`/`--ry`) — small refinements toward "alive but assembled." Give the three showcases' placeholder `aria-label`s a consistency pass.
4. **Strategic glass:** the nav pill already carries the glass identity. At most **two** additional deliberate spots, each passing the "does it earn its place" test — the pricing preferred card is the natural candidate. Solid-fill fallback under `prefers-reduced-transparency`. Zero new glass is an acceptable outcome.
5. **Micro-interactions:** press states (`active` scale/translate), hover refinements, visible focus states on every interactive element — consistent custom easing, never `linear`/`ease-in-out`.
6. **Housekeeping (carried from the P4 review):** replace raw hex values in the inline background SVGs with the CSS token variables (inline SVG can reference `var(--color-*)` via `style`/`class`); wire the generated 440px image variants into real `srcset`/`sizes` so small viewports stop downloading 880px layers; re-run `npm run images` across all masters and confirm nothing is stale.
7. **Responsive full pass:** 390/768/1024/1280/1728-class viewports, every section — chips wrap, plans stack, showcases scale assembled, nav states behave, 96px rhythm compresses sensibly on mobile, no horizontal scroll anywhere.
8. **Accessibility once-over:** WCAG AA contrast audit — pay specific attention to the **new bronze serif headlines on the dark canvas** (large-text 3:1 minimum) and **white-on-purple CTAs** (4.5:1); alt/aria audit page-wide; full keyboard walk (nav pill states, accordion, pricing toggle, focus order after the section reorder); hands-on `prefers-reduced-motion` verification (OS setting, not just DevTools emulation) — hero static wheel, showcases static, reveals off.
9. **Performance & release output:** Lighthouse-style check (LCP on the hero, CLS ≈ 0, total page weight; report numbers); confirm the hero chart JS isn't blocking; OG tags validate in a preview checker on all four pages; final `npm run build`; README + handoff refresh to final state (folder map, conventions, "how to change X" pointers for the production team).
10. Update the plan's progress log; write `docs/reports/p6-report.md` in the established format.

## Acceptance checklist

- [ ] One reveal per section, easing consistent, reduced-motion clean (verified with the OS setting)
- [ ] No visible section boundary anywhere on the page at any viewport
- [ ] Showcase motion refined; aria-labels consistent
- [ ] Glass ≤ 2 new spots with fallbacks (or zero, stated)
- [ ] Inline SVGs token-driven — zero raw brand hex outside `src/main.css`
- [ ] `srcset`/`sizes` live; mobile image payload reported before/after
- [ ] Contrast audit passed (bronze headlines, purple CTAs explicitly reported); keyboard walk clean; alt/aria audit done
- [ ] Responsive pass done at all five viewport classes; no horizontal scroll
- [ ] Perf numbers reported (LCP, CLS, page weight); OG validated
- [ ] README/handoff final; report written; Vercel production URL confirmed

Commit in logical chunks, push, report the preview URL, all measured numbers, and anything deliberately left for the fine-comb sessions.

## Out of scope

New sections, layout changes, copy changes (deck is frozen until the client pass), anything that contradicts the change list. This prompt finishes the site; it doesn't redesign it.
