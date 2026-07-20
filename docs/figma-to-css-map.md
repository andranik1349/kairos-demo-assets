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
| `accent/accent-secondary-soft` | `#5446db2e` (≈ purple @ 18%) | `color-mix(in srgb, var(--color-purple) 18%, transparent)` | Figma base `#5446db` differs slightly from our `#5B4FD4`; **snapped to the brand token**. Nav-link "current" pill fill. |
| `accent/accent-tertiary` | `#7a6c53` | `--color-bronze` (`#7A6C53`) | Exact. Hero headline "Auspicious Moment". Darker/lower-contrast than the sandy `bronze-soft-fg-dark` — **flagged for the P6b a11y pass**. |
| `foreground` (fg) | `#eef1f8` | `--color-fg` | Exact. Hero headline "The". |
| `#8b95a9` (used raw) | `#8b95a9` | `--color-muted` | Exact. Hero sub-copy. |
| `foreground/muted` | `#58637a` (app-kit slate) | dim `--color-muted` (`/80`) | **Light-mode kit value** (dark slate); snapped to our muted. Hero scroll hint. |
| `surface/surface-translucent` | `#f7f9fc` @ 80% (near-white) | **dark glass** (`bg-surface/60` + `backdrop-blur`) | **LIGHT-MODE ARTIFACT** — the render shows dark glass, not near-white (Andranik confirmed). Hero download-button pills + nav pill fill. |
| `border-glass` | `rgba(255,255,255,0.84)` | `--color-hair-strong` | **Light-mode artifact** — render shows a subtle hairline, not an 84%-white border. Glass buttons + nav. |
| `border-glass` | `#ffffff0f` (white @ ~6%) | `--color-hair` | Search section (`24173-30970`) vertical divider beside the Search block — genuinely faint, snapped to the plain hairline token (not `-strong`). |
| `Gradient-Accent-Primary` | `88deg #4E43B5 → #776CE5` | `.nav-cta-btn` (literal gradient) | Purple accent gradient on the nav "Get the App" CTA. Literal for now; P6b can tokenise. |

## Spacing / radius / type

| Figma variable | Figma value | → CSS | Context / notes |
|---|---|---|---|
| `dimensions/spacing/1` | `4` | `gap-1` | Nav-link gap. |
| `dimensions/spacing/2` | `8` | `8px` (`py-2`) | |
| `dimensions/spacing/4` | `16` | `16px` (`px-4`) | |
| `dimensions/spacing/6` | `24` | `gap-6` | 12-col grid gap. |
| `dimensions/spacing/24` | `96` | `p-24` (96px) | **Padding on the HERO**, not the grid container (Figma structure: hero `24143-48617` holds the padding; grid `24143-34421` has none). |
| `dimensions/radius/rounded-full` | `9999` | `rounded-full` / `9999px` | |
| `dimensions/radius/rounded-2_5xl` | `20` | `rounded-[20px]` | Hero download-button pills. |
| `dimensions/radius/rounded-3xl` | `24` | `rounded-[24px]` | Nav "Get the App" CTA. |
| `font` (family) | `Space Grotesk` | `--font-sans` | |
| `Body/lg` | 16 / lh 24 / w 400 | `.nav-link` (`16px`/`24px`) | Nav links. Pre-Figma build used Space Mono 13px; Figma (app kit) is Space Grotesk 16px — adopted. |
| Cormorant headline | "The" 64px italic / "Auspicious Moment" 96px semibold, tracking −1.8px | `md:text-[64px]` / `md:text-[96px]`, `tracking-[-0.02em]` (`font-display`) | Hero headline, two-tone (fg + bronze). |
| `text-2xl` | 24 / lh 32 | `text-2xl` | Hero sub-copy. |
| `text-sm` (Button sm) | 14 / lh 20 / w 500 | `text-sm font-medium` | Nav "Get the App" CTA. |
| `dimensions/font/text-xl` + `leading/text-xl` | 20 / lh 28 | `text-xl leading-7` | Search section (`24173-30977`) numbered-list step text (was base ~16px). |
| left-panel split | 628 + 24 gap + 628 (of 1280) | `md:grid-cols-12` `col-span-6` / `gap-6` / `col-span-6` | Search section (`24173-30970`) — even 50/50 text↔showcase (was 5/7). |
| list left rail + gap | 84.67 rail + 24 gap → content @108.67 | `md:ml-[84px] md:border-l md:border-hair md:pl-6` | Search block indent + vertical hairline. |

## Open / ask-Andranik

_(none outstanding)_
