# P6b · Polish & release — build report

**Phase:** P6b (final polish + release output) · **Built:** 2026-07-21 ·
**Prompt:** `docs/prompts/p6b-polish-release.md` · **Live:** https://kairos-demo-bice.vercel.app
**Commits:** `d3985ed` (core polish) · `5aa8b84` (reveal + showcase) · `b4892f6` (shell easing) · docs commit on `main`.

This was the final pass before release — polish and housekeeping, not redesign. Section structure, order, the 8-item nav, and copy stayed frozen. The two hands-off zones (`site/js/hero-chart.js`; the nav reveal + scroll-spy in `site/js/site.js`) were left untouched — verified by `git diff` (hero-chart.js empty; site.js additions only, no nav-IIFE lines changed).

---

## What was delivered

**1 · Scroll choreography.** Each of the 8 non-hero sections fades/rises in (48px, opacity) as it enters — one reveal for the section as a whole, never a per-element cascade. New `initSectionReveal` IIFE in `site/js/site.js` uses an IntersectionObserver (coarse — threshold 0 + generous margin, immune to the thin-band pitfall that forced the nav patterns off IO). Reduced-motion bails to the static end-state (CSS `.reveal` override + JS `matchMedia` bail). Transform/opacity only, site easing. Hero excluded (keeps its own `.loaded` entrance).

*Post-review follow-up (2026-07-21, on Andranik's feedback):* three adjustments after first look — (a) added `html { scroll-behavior: smooth }` so nav-anchor clicks glide instead of teleport (auto under reduced motion); (b) strengthened the reveal from 24px→**48px** travel so it's clearly visible, not barely-there; (c) made the reveal **two-way** — it resets when a section fully leaves the viewport and **replays** on the way back, superseding the original once-only spec (the observer now just toggles `.is-visible` on `isIntersecting`). Verified: two-way reset confirmed by a DOM read after a real scroll (sections scrolled past reset to hidden while in-view ones stay revealed) agreeing with a screenshot.

**2 · Seam sweep + ambient depth.** Confirmed **no section carries its own background-color or boundary border** — every section is transparent over the single `body` canvas (`--color-bg`), so seams are impossible by construction; the full scroll-through showed one continuous field. Restored per-section ambient depth on the four previously-flat sections (`#what`, `#breadth`, `#pricing`, `#faq`) with faint `.section-glow` radial fields living inside each section's full-bleed layer, bleeding across boundaries via the root `overflow-x:clip`. **No `background-attachment: fixed`** (that was exactly what `99cedbd` removed). Composed-asymmetric placement + two temperatures (purple / teal).

**3 · Score chips.** The bland `+17 · +13 · +10` / `+5 · -7 · 0` lines became in-app-style score badges: hairline Space Mono pills, teal-soft for positives, `negative-soft` red for the `-7`, muted for `0`. `data-content` keys preserved; chips wrap on narrow widths.

**4 · Showcase.** Features stays the **deliberate centerpiece** (kept `min(500px,38dvh)` vs Search/Evaluate `min(430px,34dvh)`) — un-mirrored, serif-titled hero of the three; the size difference is intended hierarchy. Motion-coefficient pass: satellite parallax eased `0.22 → 0.18` (deep layers separate a touch less — "alive but assembled"); lean/smoothing unchanged. Showcase aria-labels confirmed parallel.

**5 · Strategic glass.** One new spot (≤2 budget): the pricing paid/preferred card's inner core now carries a `backdrop-blur` translucent surface (`.paid-card-glass`), echoing the nav/download pill glass. Fallback to a solid surface under `prefers-reduced-transparency` **and** no-`backdrop-filter` support.

**6 · Micro-interactions.** Global `:focus-visible` already reaches every control; kept it, added no per-control rings (the teal-soft outline reads fine on every surface). Filled the easing gap: footer product/legal links moved from Tailwind's default transition timing to the site easing (`cubic-bezier(.32,.72,0,1)`), shell-synced across all four pages. Press states (`motion-safe:active:scale`) already consistent on buttons/pills.

**7 · Consistency pass** (Breadth/Pricing/FAQ/Final). No re-layout. Confirmed all four already sit in the established vocabulary — gold-serif headlines (`bronze-soft-fg-dark`), double-bezel cards with concentric radii, hairline chips/rails, 96px rhythm. The ambient fields (item 2) were the real gap; filled. Layout variety preserved (no forced hairline rails where a different layout family is intentional).

**8 · Housekeeping.** Tokenized the nav-CTA gradient literal into `--color-cta-grad-from/-to`. Swept inline-SVG raw hex (`#5B4FD4`, `#EEF1F8`, `#0FB8AC` in the search/evaluate/features/final background art) to token vars via inline `style="fill/stroke: var(...)"`. `#6a5fe0` → `--color-purple-hover`. `--color-negative` + new `--color-negative-soft` added to the styleguide; stale "Canvas gradient" prose replaced. Wired width-descriptor `srcset` + `sizes` across all 13 decomposed showcase layers.

**9 · Accessibility.** WCAG AA contrast audited with numbers (below); two sub-threshold values found and fixed. alt/aria audited; keyboard names confirmed. Reduced-motion path confirmed in code.

**10 · Responsive** (code-level). No horizontal overflow at 390 / 768 / 1728 (measured `scrollWidth − clientWidth = 0`); intermediate widths safe (centered `max-w-1280` + `overflow-x:clip` guard). Mobile hero collapses to logo + CTA; pricing/breadth/ledgers stack single-column.

**11 · Release output.** Perf numbers below; OG tags validated on all four public pages; final `npm run build`; README/handoff/plan refreshed.

## Measured results

**Contrast (WCAG AA), computed from token hex:**

| Pair | Ratio | Requirement | Result |
|---|---|---|---|
| Hero headline `bronze-soft-fg-dark #C8B493` on `bg` | 9.72 | 3.0 (large) | ✅ (passes normal too) |
| CTA white text on purple dark stop `#4E43B5` | 6.65 | 4.5 | ✅ |
| CTA white text on `purple #5B4FD4` | 5.29 | 4.5 | ✅ |
| CTA white text on `purple-hover` (was `#6A5FE0` = 4.29 ❌ → now `#645AD9`) | 4.64 | 4.5 | ✅ fixed |
| Muted `#8B95A9` body on `bg` | 6.51 | 4.5 | ✅ |
| Negative chip `-7` (was `#DB3B3E` = 4.18 ❌ → now `negative-soft #F16D6F`) | 6.36 | 4.5 | ✅ fixed |
| Positive chip `teal-soft #6EEAE3` on chip surface | 12.92 | 4.5 | ✅ |
| `negative #DB3B3E` × marks (decorative, aria-hidden) on bg | 4.39 | exempt | ✅ (decorative) |
| Paid-card body `fg/85` on `surface-2` | 10.49 | 4.5 | ✅ |

**Performance (localhost, desktop 1280):**

| Metric | Value |
|---|---|
| DOMContentLoaded / load | 45 ms / 46 ms (localhost, no network) |
| Initial requests / transfer (uncompressed) | 13 / ~273 KB |
| — of which fonts (Google, cached cross-site) | ~100 KB |
| — CSS (main.css, minified, raw) | 44.5 KB |
| — JS (deferred, raw) | 28.8 KB total — hero-chart 16.6 · site 8.2 · showcase 4.0 |
| — above-fold SVG (logo + 2 badges) | ~37 KB |
| CLS | ~0 by construction (reveal is transform/opacity only; all `<img>` carry width/height) |
| Mobile decomposed-image payload (AVIF, DPR 1) | **323 KB → 171 KB (−47%)** via srcset |

*LCP/CLS precise figures need the Lighthouse CLI (not available in this session). LCP is text (no hero raster — the wheel is inline SVG drawn by JS), so it tracks FCP + font swap. Production adds brotli on HTML/CSS/JS (~4–5× on text assets), so real first-load transfer is well under the localhost raw figure.*

**Cross-browser bug caught & fixed:** the minifier (Lightning CSS) was dropping the standard `backdrop-filter` from `.paid-card-glass`, leaving only `-webkit-backdrop-filter` (would break Firefox). Reordering to `-webkit-` first, then standard (matching Tailwind's own utilities) keeps both.

## Verified vs. handed to Andranik

**Verified (static / forced-state / two agreeing signals):** score-chip colors + appearance; paid-card glass (`backdrop-filter: blur(20px)` computed + frosted panel screenshot); ambient glows present (computed + subtly visible); **no seams** (structural + full scroll-through); section reveal (initial opacity 0 → mid-transition capture → settled visible — two agreeing signals); no horizontal overflow at 390/768/1728; mobile hero + pricing stacking; contrast ratios; all srcset files exist; token/hex sweep; hands-off zones clean via `git diff`.

**Handed to Andranik (dynamic / device — per the verification doctrine):**
- Reveal *feel* and reduced-motion *device* behavior (code confirmed: CSS `.reveal` reduced-motion override + JS `matchMedia` bail both present).
- Showcase parallax/lean *feel* after the 0.18 tuning.
- Hover/press feel on real input.
- Full mobile/tablet device pass (live reflow at real DPR).

## Left for fine-comb

- **Placeholder copy** (labeled placeholders, copy frozen — out of P6b scope): `faq.items.birthtime.a`, `faq.items.privacy.a`; pricing `pricing.paid.price` (`$X`/`$Y`); `breadth.todos.title` working title.
- **Nav collapsed-state focusability:** at the top of the page the collapsed logo/CTA (`.nav-grow`, width 0, `aria-hidden`) remain in the tab order. Fixing cleanly touches the hands-off nav pattern, so deferred — flagged for a dedicated pass.
- **Two explanatory-comment hex references** remain in `index.html` (a Figma-slate `#58637a` traceability note and a `#DB3B3E` note) — comments only, no rendered raw hex.
- **OG image** is a 706 KB PNG (crawler-only, not on the load path) — could be slimmed if desired.
- Precise **Lighthouse** LCP/CLS/SEO scores via the CLI on the deployed URL.
