# Session handoff — Kairos landing (Figma → code port)

**Last updated:** 2026-07-20 · **Branch:** `main` (all work pushed, tree clean).
For a fresh session: read `CLAUDE.md` → `docs/design-guardrails.md` → `docs/kairos-landing-implementation-plan.md` → `docs/p5-change-list.md` (esp. the **Addenda**) → `README.md`, plus `docs/figma-to-css-map.md`. The persistent memories cover the cross-session gotchas.

---

## Where the project is

The site (P0–P6a) is built and deployed on Vercel (auto-deploys on push to `main`). We are now in a **section-by-section Figma port** (post-P6a): Andranik hands over individual Figma nodes from the **Kairos-HeroUI** file (`aMpAPMPUynx0mdB91C9Quc`), and we adopt them **case-by-case** — the ratified `p5-change-list.md` stays the baseline. **P6b (polish/release) has not started.**

## What this session landed (all committed + pushed)

1. **Nav section-links — three states** (`24143-36144`): pill links (`.nav-link`), default muted / hover purple / current soft-purple fill via a scroll-spy (`aria-current="location"`).
2. **Hero background-to-top fix**: negative top margin on the hero cancels the sticky header's flow so the ambient background fills to y=0.
3. **Hero recompose onto the real 12-col grid** (`24143-48617` + sub-nodes):
   - Logo top-left · **two-tone headline** ("The" fg italic 64px + "Auspicious Moment" bronze caps 96px, two-line) · **dark-glass download pills** · sub-copy bottom-left (shortened — dropped "A flight search for timing.") · **scroll hint** bottom-right (Phosphor mouse-scroll).
   - **96px padding is on the hero wrapper, NOT the grid container** (this tripped me up once — fixed).
   - **Orrery wheel fills the container height, uncapped** (`24154-31377`) — supersedes P3's "never cropped".
4. **Nav grow states** (default `24143-34375` / full `24143-48876`): auto-width pill, **compact (links only) → grows horizontally** to reveal logo + **purple-gradient CTA** once the hero is ~40% scrolled (`grid-template-columns: 0fr→1fr`; observes `#how`). `.nav-reveal` CSS → `.nav-grow` + `.nav-cta-btn`. Shell-synced across all four pages.

Details + exact node IDs are in `p5-change-list.md` → Addenda; value mappings in `figma-to-css-map.md`.

## Open items / flagged (not blocking, for later)

- **Store-badge consistency:** hero badges are now glass pills; **footer + final-CTA badges are still bare**. The shared `store-badges` block has two variants now — Andranik may want to unify (not yet decided).
- **Bronze headline contrast:** hero headline is `--color-bronze` `#7a6c53` (darker than the sandy `bronze-soft-fg-dark`) — **flag for the P6b a11y pass** (may fail large-text 3:1).
- **Gradient CTA** is a literal (`.nav-cta-btn`, 88deg `#4E43B5→#776CE5`) — tokenize in P6b.
- **Mobile** for the hero + nav is coded but **not device-verified** — Andranik checks these himself.
- **P6b** still owes: scroll choreography, seam sweep, glass, hex→tokens, `srcset`, full responsive/a11y, perf, release output (`docs/prompts/p6b-polish-release.md`).

## How to run / verify (IMPORTANT — read before "testing")

- **Build CSS:** `npm run build` (one-off) or `npm run dev` (watch). Built CSS (`site/css/`) is **gitignored** — Vercel rebuilds it.
- **Preview:** no dev server; serve `site/` statically, e.g. `cd site && python -m http.server 8123`, open `http://127.0.0.1:8123`.
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

Wait for Andranik's next Figma node(s) for the port, or start P6b if directed.
