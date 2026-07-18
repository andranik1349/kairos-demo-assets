# P2a · Nav retrofit + narrative sections — Claude Code prompt

> First half of Phase P2 (see `docs/kairos-landing-implementation-plan.md`). Requires P0 + P1 complete. Companion prompt `p2b-conversion-sections.md` builds the other three sections and must run AFTER this one.

---

## Before anything

1. Read `CLAUDE.md`, `docs/design-guardrails.md`, `README.md`, and `docs/content/p2-sections.md` (the copy deck; this prompt builds its first three sections).
2. Invoke the skills **`high-end-visual-design`** and **`frontend-design`**.
3. The guardrails' overrides beat anything those skills say: dials are **6/6/3**; the stack is **static HTML + Tailwind v4 + vanilla JS** (ignore the skills' React/framework guidance and apply their design judgment only); Orrery tokens beat any palette/font suggestion; brand-derived orbital SVG art is sanctioned.

## What this prompt builds

1. **Nav retrofit** (all four pages): replace the conventional sticky bar with the **floating detached pill** decided in the guardrails: a rounded-full glass bar (dark translucent fill, backdrop blur, hairline border per `--color-hair`) floating below the top edge, not touching it. Everything else about the nav carries over unchanged: logo, anchor links (desktop), the scroll-revealed "Get the app" CTA with its IntersectionObserver behavior and reduced-motion guard, mobile = logo + CTA only. Respect the shell-sync rule (identical block on all four pages). Update the CTA label to `cta.label` from the copy deck if it differs.
2. **Section `#what`** (IA block 2), **section `#breadth`** (block 5), **section `#ai`** (block 6) on `index.html`, replacing their P1 stubs.

## Section builds

Copy and composition come from `docs/content/p2-sections.md` — every string exactly as written there, with its `data-content` name, placeholder flags preserved as HTML comments adjacent to their element (not visible text). Layout directions from the deck's composition notes, executed with the invoked skills' vocabulary (double-bezel construction, custom cubic-bezier easing, generous `py-24`+ whitespace, hairlines over boxes where hierarchy allows).

- **`#what`** — the asymmetric is/isn't ledger. The "is" side dominant with teal accents; the "isn't" side recessive, muted, visually a footnote. The imbalance carries the message. Not two equal cards.
- **`#breadth`** — the 14-category chip field (loose, organic two-row arrangement; chips are static, not links) with `orrery-graphic.svg` (from `site/img/`, pipeline-processed) as a faint background element behind the field. Below: Related Persons and To-Dos as two double-bezel cards.
- **`#ai`** — split section: copy one side, the **stylized exchange** the other. The exchange is a brand graphic built from tokens (the request as a large quoted line in Cormorant, the matched-rule-set result as a labeled data card in Space Mono, connected by a thin orbital arc or hairline), explicitly NOT a fake chat/phone screenshot. No invented UI chrome, no fake timestamps or avatars.

## Constraints

- **No scroll-entrance animations yet** — choreography is P5's job. Interaction states only: hover, focus-visible, the small press response on interactive elements, custom easing (never `linear`/`ease-in-out`). Everything still honors `prefers-reduced-motion`.
- Teal is the only action color. Purple/bronze per guardrails. Zero em-dashes (the copy deck is already clean; don't introduce any).
- Any new SVG art (orbital arcs, background motifs) is hand-authored, token-colored, and saved as a committed asset or inline; keep it restrained and instrumental, no sparkle, no zodiac-glyph decoration.
- Icons: Phosphor thin/light, inline SVG, per README convention.
- Responsive: each section collapses cleanly below ~768px (single column, chips wrap, cards stack). Declare the collapse in the same markup, don't leave it to chance.
- Run `npm run images` if any new raster master is added (none expected for this half; orrery SVG copies through).

## Acceptance checklist

- [ ] Pill nav on all four pages, visually identical, detached from the top edge, glass treatment, CTA reveal still working on index and always-visible on the other three
- [ ] `#what`, `#breadth`, `#ai` render to hi-fi with the deck's exact copy and `data-content` labels (spot-check names against the deck)
- [ ] The ai exchange reads as a designed graphic, not a screenshot imitation
- [ ] Layout families distinct across the three sections; no equal-cards template look anywhere
- [ ] Mobile pass done for all three sections + nav
- [ ] Zero em-dashes; eyebrow count in this half: exactly 1 (`ai.eyebrow`)
- [ ] `npm run build` clean; deploy verified on Vercel preview

Commit in logical chunks, push, report the preview URL and any deviations from this prompt with reasons.

## Out of scope

Pricing, FAQ, final CTA, OG image (P2b). Hero (P3). Showcases in `#how`/`#features` (P4). Scroll choreography (P5). Leave the remaining stubs untouched.
