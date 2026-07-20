# Session handoff — Kairos landing (Figma → code port)

**Last updated:** 2026-07-20 (section-ports session) · **Branch:** `main` (all work pushed, tree clean).
For a fresh session: read `CLAUDE.md` → `docs/design-guardrails.md` → `docs/kairos-landing-implementation-plan.md` → `docs/p5-change-list.md` (esp. the **Addenda**) → `README.md`, plus `docs/figma-to-css-map.md`. The persistent memories cover the cross-session gotchas.

---

## Where the project is

The site (P0–P6a) is built and deployed on Vercel (auto-deploys on push to `main`). The **section-by-section Figma port is now largely complete**: every section sits on one unified layout system, and Search / Evaluate / Features / What-is have had their individual Figma content ports. **The next step is P6 — the final polish/release pass** (`docs/prompts/p6b-polish-release.md`). Figma nodes come from the **Kairos-HeroUI** file (`aMpAPMPUynx0mdB91C9Quc`), adopted **case-by-case** with `p5-change-list.md` as the baseline.

## This session (2026-07-20) — section ports, unified layout, fixes (all committed + pushed)

Continued the Figma port and cleared several build-wide items. Node IDs from **Kairos-HeroUI**; value mappings appended to `figma-to-css-map.md`.

**Layout system (site-wide)**
- **Split `#how` into two real sections**, `#search` + `#evaluate` (`9f92e2c`) — each a first-class section with its own gold headline. Nav already linked to them; reveal trigger + scroll-spy follow automatically.
- **Unified every section onto the hero's structure** (`aae84a0`): full-bleed `<section>` (holds ambient bg) → `px-6 py-24 md:p-24` padding wrapper (96px all sides) → `max-w-[1280px]` content container (70ch for FAQ). Backgrounds bleed to the viewport instead of capping at 1280; vertical rhythm is a uniform 96px (was `md:py-32`/`py-40`). Footer dead link `/#how`→`/#search` fixed on all 4 pages.
- **Column-based hairline/indent** for the text sections (`4b77d1c`, superseding the first fixed-`pl-[108px]` attempt `bbf881d`): the block is a nested `md:grid md:grid-cols-6 md:gap-6`; the hairline is a **1-column spacer** (`border-l-2`) in col 1, content is `col-span-4` (cols 2–5). Rail = one grid column, so the indent scales with the viewport and stays on the column rhythm.

**Section content ports (Figma)**
- **Search** (`24173-30970/77`, `84a3d9c`): headline into the left column, showcase beside it (even 50/50, `gap-6`), Search block indented past the hairline, numbered list at `text-xl` (20/28) with teal mono numbers.
- **Evaluate** (`24173-30995`, `9c69f4c`): mirror of Search — showcase left, text right, headline left-aligned (was right-aligned).
- **Features** (`24173-31020`, `5cff525`): twin of Search un-mirrored; indented block is a serif title + muted body (no list). Showcase centered (dropped its `translate-x-6`).
- **What is** (`24143-49152`, `e66f724`): headline retyped per `24143-49155` — 72px Cormorant, `leading-none`, "KAIROS Calculates" semibold gold + "It doesn't divine" **italic muted**, no periods. Two ledger lists rebalanced to 6/5 cols, top-aligned; rows 20px with 24px padding on hairline rules; `+` teal, `×` red. **`what.sub` paragraph dropped** (absent in the Figma header).

**Tokens / typography**
- **Hero "Auspicious Moment"** moved off base `--color-bronze` (`#7A6C53`) to `--color-bronze-soft-fg-dark` (`#C8B493`) for contrast (`f983e66`) — resolves the flagged bronze large-text a11y item.
- **New `--color-negative` token** (`#DB3B3E`, `ef7f8fa`) — the "isn't" `×` marks; a negative/error color the palette was missing. Available as `text-negative` / `bg-negative` / `border-negative`.
- **Cormorant Garamond italic now actually loads** (`3f9b028`): the Google Fonts URL requested no `ital` axis, so every italic was **faux** (slanted upright). Added `ital,wght@0,400;0,500;0,600;1,400;1,500;1,600` (all our italic text is weight 400); dropped unused 700. Synced across all 5 pages.

**Components / consistency**
- **Final CTA** now uses the hero's **dark-glass pill** store buttons (`f053bda`, was bare badges).
- **Footer** store badges → **text-only social pills** (Instagram/X/TikTok/LinkedIn, no icons, easy to edit) + removed the redundant Legal "Social" link (`93b4f08`). Shell-synced.

**Behavior / JS**
- **Nav reveal is now two-way** (`034abeb`): it was one-way (fired once, then removed its own listeners), so it never shrank back. Now re-evaluates the trigger geometry every frame in both directions — shrinks again at the top of the hero.
- **Hero ambient CSS animations pause off-screen** (`75661b6`): the starfield canvas rAF loop already stopped off-screen, but the 6 infinite CSS animations (sky/ring spin, core breathe, 3× nebula drift) didn't. `syncLoop` now toggles `#hero.anim-idle` (same IntersectionObserver + visibilitychange) → `animation-play-state: paused`. Finishes the visibility gating; the page can reach idle off-screen (perf + cleaner tool snapshots).

**Cleanup**
- **Removed the two fixed dark-canvas radial glows** (`99cedbd`): they were `background-attachment: fixed` on `body` and tiled/clipped against the new per-section `overflow-x-clip`, showing hard seams at boundaries. Per-section backgrounds will be reintroduced as needed.

---

## Prior session — the initial Figma port (nav + hero)

1. **Nav section-links — three states** (`24143-36144`): pill links (`.nav-link`), default muted / hover purple / current soft-purple fill via a scroll-spy (`aria-current="location"`).
2. **Hero background-to-top fix**: negative top margin on the hero cancels the sticky header's flow so the ambient background fills to y=0.
3. **Hero recompose onto the real 12-col grid** (`24143-48617` + sub-nodes):
   - Logo top-left · **two-tone headline** ("The" fg italic 64px + "Auspicious Moment" bronze caps 96px, two-line) · **dark-glass download pills** · sub-copy bottom-left (shortened — dropped "A flight search for timing.") · **scroll hint** bottom-right (Phosphor mouse-scroll).
   - **96px padding is on the hero wrapper, NOT the grid container** (this tripped me up once — fixed).
   - **Orrery wheel fills the container height, uncapped** (`24154-31377`) — supersedes P3's "never cropped".
4. **Nav grow states** (default `24143-34375` / full `24143-48876`): auto-width pill, **compact (links only) → grows horizontally** to reveal logo + **purple-gradient CTA** once the hero is ~40% scrolled (`grid-template-columns: 0fr→1fr`; observes `#how`). `.nav-reveal` CSS → `.nav-grow` + `.nav-cta-btn`. Shell-synced across all four pages.
5. **Hero wheel flattened to a decorative showpiece** (`site/js/hero-chart.js` + `#hero` CSS, commit `15f5719`, 2026-07-20 02:10). The wheel now **spins as one rigid group** instead of ~50 independently-animating parts. Full before/after below.

Details + exact node IDs are in `p5-change-list.md` → Addenda; value mappings in `figma-to-css-map.md`.

### Hero wheel flatten — before/after (referenced from `hero-chart.js`)

The P3 wheel animated almost everything on the sky independently; the flatten keeps
only what reads as "a slowly spinning wheel." Nothing about the wheel's geometry,
data, or the ambient layers (nebula, starfield) changed — this is purely which
elements *move*.

| Element | Before (P3, `6de4c59`) | After (`15f5719`) |
|---|---|---|
| Sky group (zodiac + planets + aspects) | spins ~4 min/rev (`#sky` / `k-skyspin`) | **unchanged** — still spins |
| Zodiac + planet **glyphs** | each wrapped in `<g class="cr">` counter-rotating (`k-counterspin`, 240s) to stay screen-**upright** while the sky turned — ~30+ separately-animated elements | **static radial orientation** (`radialDeg`): fixed to the wheel like clock-face numerals, ride the spin rigidly. No `.cr` wrappers, no `k-counterspin`. |
| Retrograde ℞ marks · Part-of-Fortune marker | own `.cr` counter-rotation | static |
| Planet **halos** | each pulsed on a staggered `k-halopulse` (6s) | **static** (`opacity:.85`); `k-halopulse` + per-halo `animationDelay` removed |
| Deco tick-ring spin · center-glow breathe · nebula drift · starfield twinkle · one-shot load entrance | all present | **all unchanged** |

Net: continuously-animating layers dropped from ~50 to ~6. **Visible change:** the
symbols used to stay upright as the wheel turned under them; now they rotate *with*
the wheel (clock-face), and the planet halos no longer pulse. `k-counterspin` and
`k-halopulse` keyframes are deleted; the `prefers-reduced-motion` block dropped
`.cr`/`.halo` (nothing left to disable there). Motive: fewer moving parts →
lighter compositor load (and it partly eases — does **not** eliminate — the
never-idle snapshot race, since sky/deco/core/nebula/starfield still animate).
`docs/prompts/p3-hero.md` still describes the old counter-rotating/pulsing
behavior; it's a historical phase record, superseded here.

## Open items / flagged (not blocking, for later)

**Resolved this session:** bronze headline contrast (moved to `bronze-soft-fg-dark`) · store-badge consistency (hero + final-CTA = glass pills; footer = social pills — no bare badges left anywhere) · faux italics (real Cormorant italic now loads).

**Still open:**
- **`--color-negative`** is minted + in use but not yet shown in `styleguide.html` or listed in the guardrails palette — add during P6.
- **Search / Evaluate scores lines** (`+17 · +13 · +10` / `+5 · -7 · 0`) read a bit bland — earmarked for a P6 polish treatment (Andranik flagged).
- **Features showcase** still uses its own larger `dvh` cap (`min(500px,38dvh)` vs Search/Evaluate `min(430px,34dvh)`) — harmonize if the three phones should match size.
- **Breadth / Pricing / FAQ / Final** are on the unified layout but have **not** had a dedicated Figma content pass — revisit if nodes are provided.
- **Gradient CTA** is a literal (`.nav-cta-btn`, 88deg `#4E43B5→#776CE5`) — tokenize in P6.
- **Mobile** is coded but **not device-verified** — Andranik checks himself.
- **P6 (polish/release)** owes: scroll choreography, seam sweep, glass, remaining hex→tokens, `srcset`, full responsive/a11y, perf, release output (`docs/prompts/p6b-polish-release.md`).

## How to run / verify (IMPORTANT — read before "testing")

- **Build CSS:** `npm run build` (one-off) or `npm run dev` (watch). Built CSS (`site/css/`) is **gitignored** — Vercel rebuilds it.
- **Preview:** `npm run preview` (serves `site/` at `http://localhost:4173`). This is a small Node static server (`scripts/preview-server.mjs`, wired into `.claude/launch.json`) that sends `Cache-Control: no-store` — **it replaced `python -m http.server` on 2026-07-20 to kill the stale-CSS failure below.** No install; applies on any machine that checks out the repo. Run `npm run dev` alongside it for Tailwind watch.
- **Static layout** checks (grid, padding, colors): freshly-loaded screenshots are reliable; computed-style reads of *unchanged* layout are reliable. Real Chrome (`mcp__claude-in-chrome__*`) renders the animating page correctly (the built-in pane drifts stale on it — force-refresh).
- **⚠️ Dynamic behavior (scroll-spy, nav reveal, hover) is genuinely hard to test with either browser tool — full incident record below.** Short version: don't trust a single read from either tool as proof of anything, in either direction. Cross-check (a DOM read + a freshly re-captured screenshot agreeing) before believing a result; if you can't get two independent signals to agree, say so and hand it to Andranik rather than asserting confidence.

### Full incident record — browser-tool unreliability with dynamic state

Two separate incidents, 2026-07-19 and 2026-07-20, root-caused with controlled A/B tests (animating index vs. static `/styleguide.html`, fresh load vs. late-session, DOM read vs. screenshot). Kept in full because the failure modes are counterintuitive and easy to re-trigger.

**Surface 1 — the built-in Browser pane (`mcp__Claude_Browser__*`), 2026-07-19:**

| # | Symptom | Evidence | Verdict |
|---|---|---|---|
| A | `getComputedStyle` goes stale mid-session | On the index, returned `oklab(0 0 0 / 0)` (transparent) for every background — even after setting inline `style.backgroundColor` with `!important`. Fresh-loaded index read correctly; static styleguide never drifted; index after a long session read garbage. | Pane keeps a read-back snapshot that drifts on a page that never idles (hero runs ~50 continuous compositor animations). Force-refresh rebuilds it. |
| B | IntersectionObserver callbacks never delivered for JS-driven `scrollTo` | Reproduced on the static styleguide too. | General pane limitation, not our build. |
| C | `computer scroll` times out and doesn't scroll | 30s timeouts, `scrollY` unchanged. Also reproduced on the static styleguide. | General pane limitation. |
| D | `window.scrollTo` inconsistent | Sometimes moved the page, sometimes reported success with `scrollY` still 0/2. | Unreliable. |

The nasty part of A: **paint stayed correct while read-back went wrong** — screenshots showed the truth, the APIs lied.

> **Update 2026-07-20 — a second, distinct root cause found *and fixed* for the CSS case.** During a follow-up session, incident A's "stale computed styles" reproduced with a different mechanism than snapshot drift: the preview (`python -m http.server`) sent **no `Cache-Control`/`ETag`**, so after `npm run build` the pane kept serving a **stale `site/css/main.css`** — reads *and* screenshots both faithfully rendered the OLD stylesheet (here paint and reads *agreed*, both wrong). The pane's `navigate`/`force` did not reliably re-fetch the subresource; only rewriting the `<link>` href (`?bust=…`) worked. **Fix:** replaced the preview with `scripts/preview-server.mjs` (`Cache-Control: no-store`), wired into `.claude/launch.json`. Verified: a plain `navigate` now loads the current build (43,282 b) with no cache-bust. This is a **separate axis** from the animation snapshot-drift above — that one is untouched and still applies. Bottom line: after this fix, a "stale read" is more likely genuine snapshot drift (force end-state + cross-check), not the stylesheet being old.

**Surface 2 — real Chrome (`mcp__claude-in-chrome__*`), 2026-07-19 and 2026-07-20:**

Rendering is genuinely fixed here, and it's reliable for *static* checks. But it has dynamic-state failures of its own, in **both directions**:

| # | Symptom | Evidence |
|---|---|---|
| E | Scroll-then-read returns stale DOM state | After scrolling well past a reveal threshold (geometry confirmed past it), `classList.contains('show')` read `false` across three different reveal implementations. The nav was working the whole time. |
| F | A misleading *partial* signal | In the same batch, the scroll-spy visibly updated in a screenshot while the nav-reveal read `false` — looked exactly like "one feature broken, one fine," which is what sent 2026-07-19's session down the wrong path. |
| G | Gesture scroll snaps back / is inconsistent | One gesture produced a screenshot of a scrolled page, then `scrollY` read `2` (top). Another time the same gesture persisted at 600. |
| H | `resize_window` doesn't reflow the capture | Resized to 390×844 (reported success), screenshots kept returning desktop width/layout. |
| I | Screenshots come back downscaled | Captures at ~1488×826 while the real viewport was 1991 wide — measure with `getBoundingClientRect`, don't eyeball. |
| **J** | **Screenshot capture lags *behind* correct DOM state (2026-07-20)** — the inverse of E | After a large, single scroll-gesture jump (fresh load, one big `computer scroll`), a screenshot showed the nav still collapsed (no logo/CTA). A `javascript_tool` read taken in the same round trip said `classList.contains('show') === true`, `aria-hidden === "false"`. A **second, later** screenshot then showed the nav correctly grown. The DOM/paint state was correct the whole time; the *capture* was stale. This nearly caused a real fix to be second-guessed and an unnecessary rewrite to be justified on false grounds. |

**The 2026-07-19 cost:** the nav-reveal mechanism got rewritten three times (1px sentinel → hero `intersectionRatio` → `#how` + rootMargin) chasing a "not firing" signal that was never real, until Andranik stopped it — after he'd already said he'd check dynamic behavior himself and that both tools were unreliable for it.

**What IS reliable:** freshly-loaded screenshots for static layout/color/type/spacing; geometry/computed-style reads of *unchanged* layout; forcing a state directly (toggle the class) + screenshot; real Chrome for rendering the animating page at all; **a DOM read and a freshly re-captured screenshot that agree with each other** (2026-07-20 addition — neither alone is proof, agreement between the two is much stronger than either).

**What is NOT reliable, alone:** scroll-then-read of dynamic state in either direction (DOM lagging paint, OR paint/capture lagging DOM — both observed) · IO-driven behavior via injected JS · scroll gestures (both surfaces) · window resize → responsive checks · pixel-eyeballing screenshots · the built-in pane's `getComputedStyle` on the animating page late in a session.

**One honest caveat — it isn't *all* tooling.** Two real IntersectionObserver pitfalls that this unreliable test loop could hide rather than reveal, both found in the 2026-07-20 nav-relabel session and fixed in `site/js/site.js`:
1. A thin `rootMargin` band can miss a fast scroll entirely (a continuous scroll carries an element's edge across the band between two IO check frames, no callback at all) — replaced with a per-frame rAF-throttled geometry recompute, which can't miss it.
2. A two-way reveal observer collapses state if its trigger later scrolls out of view — and its one-way fix (disconnect after first fire) has its own edge case: if IO never fires `true` even once (possible on a large/fast scroll jump per pitfall 1), the reveal can never happen for the rest of the session. Superseded by making the reveal geometry-driven on scroll too (same pattern as the scroll-spy) — no IO left in `initNavReveal` or `initNavCurrentSection` at all.

**The rule going forward:** Andranik verifies animations and dynamic behavior himself. Claude verifies static layout via fresh screenshots and measured geometry, and checks dynamic *visuals* by forcing the end-state. A single `false` read (or a single "it's not showing") after a scroll is never on its own evidence of a bug — get a second, independent signal (a fresh re-capture, or the opposite tool) before concluding anything, and say explicitly when that agreement wasn't obtained.

## Operating rules (durable — also in memory)

- **The Figma was recreated from the build using the app's React-Native UI kit**, so its variables **do not map 1:1** to our CSS — many are **light-mode kit values** (e.g. near-white `surface-translucent`, `border-glass` 84% white, slate `foreground/muted`). **Map by context, snap to Orrery tokens, and ASK when genuinely ambiguous.** Running table: `figma-to-css-map.md`.
- **Case-by-case adoption:** change-list is the baseline; Figma is an approximation. "Ask Kairos" stays cut even though Figma still shows it.
- Every visitor-facing string carries `data-content`. Nav + footer are duplicated across all 4 pages (**shell-sync** any change).

## Next step

**P6b is complete (2026-07-21) — the site is at the release bar.** See `docs/reports/p6b-report.md` for the full delivery + measured numbers. Landed: per-section scroll reveal, per-section ambient depth (seams confirmed impossible by construction), score chips, pricing paid-card glass, showcase tuning, footer-easing harmonization, CTA-gradient tokenization + inline-SVG hex sweep, two new AA-safe tokens (`--color-purple-hover`, `--color-negative-soft`), responsive `srcset`/`sizes` (mobile decomposed payload −47% at DPR1), and the a11y/perf/responsive audit. Hands-off zones (`hero-chart.js`, nav reveal/scroll-spy) untouched.

**What's left is Andranik's to verify on device** (per the doctrine above): the reveal *feel* + reduced-motion at the OS level, showcase parallax feel, hover/press on real input, and the full mobile/tablet pass. **Then fine-comb sessions as needed** — open items are listed under "left for fine-comb" in the P6b report (labeled placeholder copy, the collapsed-nav focusability edge case that sits in the hands-off zone, an optional OG-image slim, and a Lighthouse-CLI run on the deployed URL for precise LCP/CLS).
