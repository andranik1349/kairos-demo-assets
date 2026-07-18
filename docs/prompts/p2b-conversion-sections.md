# P2b · Conversion sections + OG image — Claude Code prompt

> Second half of Phase P2. Requires P2a complete (pill nav + first three sections live). See `docs/kairos-landing-implementation-plan.md`.

---

## Before anything

1. Read `CLAUDE.md`, `docs/design-guardrails.md`, `README.md`, and `docs/content/p2-sections.md` (the copy deck; this prompt builds its last three sections).
2. Invoke **`high-end-visual-design`** and **`frontend-design`**. For the OG image, invoke **`krea-marketing`** (Krea MCP must be connected and authenticated in this session; if it isn't, build everything else and flag the OG image as skipped).
3. Guardrails' overrides beat skill instructions: dials 6/6/3, static HTML + Tailwind v4 + vanilla JS stack, Orrery tokens over skill palettes, sanctioned hand-authored orbital SVG art.

## What this prompt builds

Sections **`#pricing`** (IA block 7), **`#faq`** (block 8), **`#final`** (block 9) on `index.html`, replacing their P1 stubs, plus the **OG/social-share image** wired into every page's meta tags.

## Section builds

Copy from `docs/content/p2-sections.md`, exact strings with `data-content` names, placeholder flags as adjacent HTML comments. Composition notes from the deck; skill vocabulary for execution.

- **`#pricing`** — two plan cards, the paid plan visually preferred (teal border or glow, greater presence; not just a badge). Working monthly/yearly toggle in vanilla JS: swaps `pricing.paid.price`/`per` values ($X/month vs $Y/year placeholders), `aria-pressed` kept in sync, no layout shift on switch. Card CTAs are buttons labeled `cta.label` linking `#final` (placeholder store links live there). Uniform repeating structure for plan features per the content convention.
- **`#faq`** — native `details`/`summary` accordion, one readable column (~70ch). Hairline dividers, Space Mono open/close markers, generous tap targets, `summary` focus-visible state. The two placeholder answers (birth time, privacy) render their placeholder text as visible copy with the flag kept in an adjacent comment.
- **`#final`** — short, center-aligned (the sanctioned exception), generous vertical space, subtle orbital motif background (the `orrery-graphic.svg` treatment or a hand-authored arc variant, faint, behind the content), headline + sub + the two official store badges (the identical labeled badge block from P1's footer). No new verbs, no extra links.

## OG / social-share image

Generate via Krea (`krea-marketing` workflow) a **1200×630** image for link previews: dark Orrery canvas, the orbital/chart motif, the Kairos wordmark legible at thumbnail size, no body text, no UI screenshots. On-brand per guardrails: teal/purple ambience allowed, no sparkle textures, no zodiac glyphs. Quality-check the output with vision before accepting; regenerate if off-brand.

- Save the accepted master to `assets/masters/og/og-image.png` (git-tracked), run it through the pipeline (single-size output is fine: exact 1200×630 PNG or high-quality WebP+PNG), output committed to `site/img/`.
- Update `og:image` (absolute URL on the production domain), `og:title`, `og:description` on **all four pages** using deck-consistent copy (`final.sub` works as the OG description baseline). Add `twitter:card` = `summary_large_image`.

## Constraints

Same as P2a: no scroll-entrance animations (P5), interaction states only with custom easing; teal owns actions; zero em-dashes; Phosphor inline icons; explicit mobile collapse (plans stack, accordion full-width, final CTA stays centered). Eyebrow in this half: exactly 1 (`pricing.eyebrow`).

## Acceptance checklist

- [ ] `#pricing`, `#faq`, `#final` render to hi-fi with exact deck copy and `data-content` labels
- [ ] Toggle works: prices and period text swap, `aria-pressed` correct, no layout shift
- [ ] Accordion: keyboard operable, focus visible, opens/closes cleanly without JS
- [ ] All 10 index sections now render (hero stub + P4 stubs still placeholder is expected); page reads as one coherent composition with P2a's sections
- [ ] OG image on-brand, wired on all four pages, validates in a link-preview checker
- [ ] Zero em-dashes; total eyebrow count across all P2 sections: 2
- [ ] Mobile pass; `npm run build` clean; Vercel preview verified

Commit in logical chunks, push, report preview URL, flag any deviation (especially if Krea was unavailable).

## Out of scope

Hero (P3), showcases (P4), scroll choreography and glass extras (P5). Don't restyle P2a's sections beyond what page-level coherence strictly requires; if something in P2a looks wrong, flag it instead of silently changing it.
