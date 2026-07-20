# P6c · Motion uplift — build report

**Phase:** P6c (corrective motion pass after P6b) · **Built:** 2026-07-21 ·
**Prompt:** `docs/prompts/p6c-motion-uplift.md` · **Live:** https://kairos-demo-bice.vercel.app
**Commits:** `45616de` (showcases) · `713211f` (reveals + parallax + chip pop) · docs commit on `main`.

The problem P6c fixes: P6b's motion was technically present but imperceptible (~2/10 where the dial said 6). The recalibrated rule (guardrails, 2026-07-20) is *a first-time visitor must notice the page moving without looking for it*; the amplitudes below are floors, not suggestions. Hands-off zones untouched: `hero-chart.js` (empty diff) and the two nav IIFEs in `site.js` (`initNavReveal` / `initNavCurrentSection`).

---

## What was delivered

**1 · Showcases — disassemble-on-scroll + idle float + doubled lean** (`site/js/showcase.js`, full rewrite). The calm "assembled with depth" is gone. One transform-only rAF loop, running only while a showcase is on screen:
- **Scroll-linked separation:** satellite layers pull apart at the showcase's entry/exit and converge to the assembled composition at center. Magnitude 60–120px scaled by layer depth; 4–6° rotation on the closest layers; direction fanned per layer (choreographed, not chaotic). Scrubbed by the showcase's own viewport position (`|p|`).
- **Idle float:** satellites drift ±4–6px on staggered 4–7s loops, so the composition breathes with no scroll or pointer.
- **Pointer lean doubled:** ±5° X / ±7° Y (from ±2.5/±3.5), same lerp.
- Touch / `prefers-reduced-motion` → static assembled tilt from CSS (loop never starts).

**2 · Section reveals — staggered, bigger, replayable** (`initScrollMotion` in `site/js/site.js`, replacing the IO version; `.reveal-piece` CSS in `src/main.css`; 22 pieces tagged across the 8 sections).
- **Cascade:** each section reveals in 2–3 pieces (headline → content → visual), **110ms** apart (`--ri` × 110ms), **56px** travel, **0.9s**, custom easing; visuals add a `scale(.97→1)`.
- **Trigger at 75%:** a section activates when its top crosses 75% of the viewport height (not the first pixel), so the motion plays in the reader's attention.
- **Replayable both directions:** rAF-geometry (like the nav scroll-spy, not IO — chosen so it can trigger at a precise line and replay); resets only once the section is fully out of view + 15% hysteresis.

**3 · Page-wide background parallax** (`initScrollMotion` + `.parallax*` classes). Every `[data-parallax]` ambient layer (the 3 background SVGs, the 4 section-glow fields, the breadth orrery, the final CTA motif — 9 elements, `#search` downward) drifts via `--sy` at **6–9%** of scroll (transform-only). Three class variants preserve any centering transform the element already had. Not applied to the hero (it has the wheel) or the text content.

**4 · Small life.** Score chips get a small staggered pop (slight overshoot) as part of their section's cascade. Nav pill grow/shrink verified at 0.55s / 0.45s (≥ the 0.4s floor) — no change needed.

## Measured results (verified via applied transforms / computed style)

| Effect | Measurement | Floor | Result |
|---|---|---|---|
| Showcase separation @ entry (`|p|`=0.56) | satellites displaced **46–59px** X, 32–46px Y, 1.7–3.3° rot | 60–120px @ `|p|`=1 | ✅ (scales to ~60–105px at full entry/exit) |
| Showcase @ center (`|p|`=0) | X=0, Y=±1–5px (float only), depth preserved | assembled | ✅ converges |
| Idle float | ±4–6px, staggered periods/phases | ±4–6px | ✅ |
| Pointer lean | ±5° / ±7° in code | ±5/±7 | ✅ |
| Reveal cascade | pieces stagger **0 / 0.11 / 0.22s**; 56px; 0.9s | 80–140ms; 40–64px | ✅ |
| Reveal replay | pieces reset to opacity 0 at page top after being revealed | both directions | ✅ |
| Parallax | `--sy` live at **61–115px**, speed-scaled (centered SVG ~1.8px) | 40–80px relative | ✅ |
| Frame timing (idle float, 120Hz) | avg **~115fps**, worst 34ms (2/118 frames) | 60fps | ✅ (idle); full-scroll = device check |

Stepped stills captured at entry vs center differ obviously (scattered pieces → coherent phone), satisfying the self-verification floor.

## Verified vs. handed to Andranik

**Verified (reliable static / computed / applied-transform reads, two agreeing signals):** showcase separation amplitude at entry and convergence at center (transform matrices); idle-float offsets; reveal-piece stagger delays; reveal reset at page top (replay-ready); parallax `--sy` offsets live and speed-scaled; hands-off zones clean via `git diff`; nav duration; idle-float frame rate.

**Handed to Andranik (dynamic feel / device — per the verification doctrine):**
- The overall *feel* while scrolling top-to-bottom at normal speed (disassembly + reveal + parallax together) — is it now unmistakable?
- **Worst frame under full scroll load** (hero + 3 showcases + parallax + reveals at once) — the idle-float sample held ~115fps and the design is transform/opacity-only (compositor-friendly), but a real scrubbed-scroll fps read needs the device.
- Reduced-motion at the OS level (code path confirmed: `initScrollMotion` and `showcase.js` both bail; CSS forces `.reveal-piece` / `.score-chip` / `.parallax*` to the static state).
- Touch behaviour (static assembled).

## Left for fine-comb

- If the disassembly still reads too strong/weak to taste, the floors are single constants — `mag = 60 + depthN*60` (showcase.js) and the `--ri` stagger / `translateY(56px)` (main.css) — trivially dialable.
- Full-scroll fps confirmation on Andranik's device; Lighthouse CLI pass on the deployed URL.
- Carried from P6b: labeled placeholder copy (FAQ birthtime/privacy answers, pricing `$X`/`$Y`, breadth "To-Dos" title); the collapsed-nav focusability edge case (hands-off nav pattern).
