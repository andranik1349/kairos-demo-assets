# Figma → CSS value map

**Why this exists.** This was **not** a traditional Figma-first build. The
original CSS/HTML build came first; Andranik then *recreated* that build inside
Figma — reusing the Kairos **React-Native app's UI kit** — and applied the P5/P6
design changes there. We're now taking that Figma back into code. Because the
Figma was assembled from the app's kit rather than from our stylesheet,
**Figma variables do NOT map 1:1 to our CSS tokens.** Variable names, and even
base hex values, can differ from ours for what is, in context, the same intended
colour / size / type role.

**The rule (applies to every node we translate).** Map each Figma value to the
closest Orrery CSS token **by context — not by variable name and not by exact
hex.** A Figma var whose hex sits a hair off one of our tokens is almost always
*meant* to be that token: snap it to the token (this is the guardrails'
"tokens beat any external palette" rule, extended to Figma). **When the intended
mapping is genuinely ambiguous, ASK Andranik — do not guess.**

This file is the running lookup table. Add a row every time a node is translated
so the mapping stays consistent across sections.

---

## Colour

| Figma variable | Figma value | → CSS | Context / notes |
|---|---|---|---|
| `accent/accent-secondary` | `#5b4fd4` | `--color-purple` (`#5B4FD4`) | Exact match. Conversion/accent purple. |
| `accent/accent-secondary-soft` | `#5446db2e` (≈ purple @ 18%) | `color-mix(in srgb, var(--color-purple) 18%, transparent)` | Figma base `#5446db` differs slightly from our `#5B4FD4`; **snapped to the brand token**. Used as the nav-link "current" pill fill. |

## Spacing / radius / type

| Figma variable | Figma value | → CSS | Context / notes |
|---|---|---|---|
| `dimensions/spacing/2` | `8` | `8px` (`py-2`) | |
| `dimensions/spacing/4` | `16` | `16px` (`px-4`) | |
| `dimensions/radius/rounded-full` | `9999` | `rounded-full` / `9999px` | |
| `font` (family) | `Space Grotesk` | `--font-sans` | |
| `Body/lg` | size 16 / lh 24 / weight 400 | `.nav-link` (`16px`/`24px`) | Nav section links. Note: the pre-Figma build had used Space Mono 13px here; the Figma (from the app kit) is Space Grotesk 16px — adopted. |

## Open / ask-Andranik

_(none outstanding)_
