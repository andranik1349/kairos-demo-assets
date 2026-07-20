# P6c · Motion uplift — Claude Code prompt

> Corrective pass after P6b. **The problem:** P6b's motion works technically but is imperceptible — Andranik had to squint to spot the reveals, and the decomposed showcases "could've been static PNGs." The Stage 1 dial said motion **6/10**; what shipped reads ~2. Andranik's directive (2026-07-20): **"crank it to at least 12"** — this build's ratified rule is *style over substance*, and the style has to carry the page.
>
> This prompt recalibrates what 6/10 means: **a first-time visitor must notice the page moving without looking for it.** Everything below states minimum amplitudes. They are floors, not suggestions — do not soften them for taste. **If you are unsure whether an effect is visible, it isn't: increase it.**

---

## Before anything

1. Read `CLAUDE.md`, `docs/design-guardrails.md` (motion section revised for this pass), `docs/session-handoff.md` (verification doctrine — still binding), `docs/reports/p6b-report.md`.
2. Invoke **`high-end-visual-design`**.
3. Hands-off zones, unchanged: **nav patterns in `site.js`** (reveal/spy geometry checks) and **`hero-chart.js`** (the flattened wheel). Everything else motion-related — the section-reveal code, `showcase.js`, showcase CSS, ambient backgrounds — is this prompt's to rewrite.

## 1 · Showcases: disassemble-on-scroll + idle float (the headline item)

Revive the original disassemble concept (it was Andranik's first instinct; the calm "assembled with depth" experiment is over):

- **Scroll-linked separation:** as a showcase section traverses the viewport, layers visibly pull apart and re-assemble. At the section's entry and exit, satellite layers (pills, cards, buttons) sit clearly displaced from the base — **60–120px** offsets scaled by layer depth, with a few degrees of individual rotation for the shallowest layers — converging to the assembled composition when the section is centered. Scrubbed by scroll progress (the existing per-frame rAF pattern in `showcase.js` extends naturally; the `-p * z * 0.18` coefficient becomes a real disassembly curve).
- **Idle float:** satellites breathe continuously — **±4–6px** vertical drift on 4–7s loops, phases staggered per layer, so the composition is alive even with no scroll or pointer input. CSS keyframes, paused off-screen (reuse the visibility-gating pattern).
- **Pointer lean:** double it — ±5°/±7° (from ±2.5/3.5), same lerp smoothing.
- Reduced-motion / touch: static assembled tilt, as now.

**Self-verification (works within the tool limits):** set `scrollY` to fixed offsets stepping a showcase section through the viewport, screenshot each step — the layer separation must be *obvious in the stills* at entry/exit steps and gone at center. If consecutive stills look identical, the amplitude fails the floor.

## 2 · Section reveals: staggered, bigger, replayable

Rewrite `initSectionReveal` + `.reveal` CSS:

- **Cascade:** each section reveals in **2–4 staggered pieces** (headline → content block → visual), **80–140ms** apart. Travel **40–64px**, duration ~0.9s, the site's custom easing. Optional slight scale (0.97→1) on visuals.
- **Trigger late enough to be seen:** a piece starts animating when it crosses **~75% of viewport height** (not at the first pixel of intersection) so the motion plays in the reader's field of attention, not below it.
- **Replayable:** when a section leaves the viewport *entirely* (plus ~15% margin of hysteresis so boundary jitter can't flicker it), it resets and replays on re-entry — both scroll directions. The existing rAF-geometry pattern (nav scroll-spy) is the reference implementation; IO's once-semantics no longer fit.
- Reduced-motion: everything visible immediately, no animation, as now.

## 3 · Background parallax, page-wide

The ambient layers (section background SVG art, glow fields, orrery graphics — NOT text content) drift at a different rate than the content while scrolling: offsets of roughly **6–10% of scroll delta** (i.e. 40–80px of relative travel across a viewport). Transform-only, driven by the same rAF scroll pattern, disabled under reduced-motion. The hero already has depth from the wheel; apply from `#search` downward, including the final CTA's motif.

## 4 · Score chips + small life (quick wins)

- The P6b score chips: give them a tiny staggered pop as part of their section's reveal cascade (they're the product's voice — let them land with emphasis).
- Nav pill: the grow/shrink is already two-way — verify its transition duration is long enough to *read* (≥0.4s) rather than snap.

## Perceptibility acceptance (the point of this prompt)

- [ ] Scroll the page top-to-bottom at normal speed in real Chrome: reveals, disassembly, and parallax each visibly occur —**capture screenshots at stepped scroll positions as evidence** (stills must differ obviously)
- [ ] Scroll up and back down: reveals replay
- [ ] Leave the page idle on a showcase: the float is visible within 5 seconds of watching
- [ ] All floors met or exceeded in code (report the final numbers per effect)
- [ ] 60fps holds with everything live (hero + 3 disassembling showcases + parallax); report worst frame
- [ ] Reduced-motion (OS-level): completely still page, all content visible
- [ ] Nav patterns + `hero-chart.js` untouched (scoped `git diff`)
- [ ] Final dynamic sign-off is Andranik's (per the verification doctrine) — deliver with the stepped-screenshot evidence and the numbers, not with "it works"

Taste still exists — easing stays custom, motion stays choreographed rather than chaotic, teal/purple discipline holds, one continuous canvas. But where taste and perceptibility conflict at the margin, **perceptibility wins**. Commit in logical chunks, push, update the plan log + a short `docs/reports/p6c-report.md`.
