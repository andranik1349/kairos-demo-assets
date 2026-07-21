# P6d · Breadth category chips — organic float + depth (fine-comb)

> Small corrective on `#breadth`. Andranik (2026-07-20): the 14 category chips need to "blob more naturally, maybe add some depth." They currently read as staggered rows of static pills. The design idea: they are **bodies suspended around the orrery sphere** — the section's background graphic finally earning its metaphor. Perceptibility floors below are floors (P6c rule: unsure if it's visible = increase it).

## Constraints

- Markup/content untouched in meaning: same 14 labeled chips (`breadth.categories.*`), same `data-content` names. Presentation only; chips stay non-interactive links-wise (no hrefs), but gain hover response.
- Transform/opacity/filter only; reduced-motion = static composition (organic scatter + depth styling stay, motion stops).
- Hands-off zones per `p6c-motion-uplift.md` still apply elsewhere.

## 1 · Organic scatter (the "blob")

Break the row rhythm: position chips as an **irregular constellation cluster** filling the left column around/over the orrery graphic — varied x/y offsets, no two chips aligned on a straight row of more than two, slight per-chip rotation (−2°…+2°). Compose deliberately (readability first: no overlaps at rest, labels never clipped), but it must not look like justified rows. Below `md`: collapse to a simple wrapping cloud (safe flexbox wrap with varied gaps), no absolute positioning.

## 2 · Depth (three tiers)

Assign each chip a depth tier and style it accordingly:

| tier | scale | opacity | extras |
|---|---|---|---|
| near (4–5 chips) | 1.0 | 1.0 | hairline-strong border, soft tinted drop shadow, subtle teal glow on 1–2 |
| mid (5–6) | 0.9 | 0.8 | hairline border |
| far (4–5) | 0.8 | 0.55 | `blur(0.6px)`, no shadow |

Distribute tiers spatially mixed (not near=top). Tier choice can be static in markup (a `--depth` var per chip).

## 3 · Motion

- **Idle drift:** every chip floats on its own loop — **±6–12px** travel (larger for near tier), **5–9s** durations, phases staggered so the cluster never moves in unison. CSS keyframes (2–3 keyframe variants reused with per-chip `animation-duration`/`delay`), paused when the section is off-screen (existing visibility-gating pattern).
- **Scroll parallax between tiers:** near tier drifts ~1.5× the mid tier, far ~0.5×, using the page-wide ambient-parallax mechanism from P6c — the cluster visibly deepens as you scroll through.
- **Hover:** chip lifts — scale 1.06, brightens to full opacity (mid/far tiers), teal-soft border, ~0.35s custom easing. The orrery graphic behind may brighten slightly when any chip is hovered (optional, one `:has()` rule, skip if it fights).

## Acceptance

- [ ] At rest the cluster reads organic (no row alignment), with obvious depth layering in a single screenshot
- [ ] Idle drift visible within 5 seconds of watching; tiers visibly parallax while scrolling (stepped-screenshot evidence)
- [ ] No label clipping/overlap at rest at 1280/1440/1728; mobile fallback clean, no absolute positioning
- [ ] Hover response on all chips; reduced-motion static but still scattered + deep
- [ ] 60fps holds (14 chips animating is trivial, but confirm alongside everything else)

One commit or two, push, note it in the plan log. No report needed — this is a fine-comb item.
