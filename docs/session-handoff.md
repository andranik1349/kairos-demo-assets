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
- **⚠️ Do NOT scroll-test dynamic behavior (scroll-spy, nav reveal, hover) in either browser tool.** Both the built-in pane and Claude-in-Chrome return **stale DOM/computed-style reads** after a programmatic scroll — a `classList.contains('show') === false` read is NOT evidence of a bug. I wasted a long stretch this session chasing a phantom "nav not revealing" that was working the whole time. **Andranik verifies animations/dynamic behavior himself.** To sanity-check a dynamic state, force it (toggle the class) and screenshot the *visual*, or hand it to Andranik.
- **Static layout** checks (grid, padding, colors): freshly-loaded screenshots are reliable; computed-style reads of *unchanged* layout are reliable. Real Chrome (`mcp__claude-in-chrome__*`) renders the animating page correctly (the built-in pane drifts stale on it — force-refresh).

## Operating rules (durable — also in memory)

- **The Figma was recreated from the build using the app's React-Native UI kit**, so its variables **do not map 1:1** to our CSS — many are **light-mode kit values** (e.g. near-white `surface-translucent`, `border-glass` 84% white, slate `foreground/muted`). **Map by context, snap to Orrery tokens, and ASK when genuinely ambiguous.** Running table: `figma-to-css-map.md`.
- **Case-by-case adoption:** change-list is the baseline; Figma is an approximation. "Ask Kairos" stays cut even though Figma still shows it.
- Every visitor-facing string carries `data-content`. Nav + footer are duplicated across all 4 pages (**shell-sync** any change).

## Next step

Wait for Andranik's next Figma node(s) for the port, or start P6b if directed.
