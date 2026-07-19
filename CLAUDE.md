# Kairos Landing — session instructions

This repo is the Kairos landing page: a small static marketing site (HTML + Tailwind v4 + vanilla JS, no framework), deployed to Vercel on every push to `main`.

**At the start of every session, before doing any work, read:**

1. `docs/design-guardrails.md` — the design rules, brand don't-list, dials, skill lineup, and the overrides that beat any skill's defaults. Non-negotiable for anything visitor-facing.
2. `docs/kairos-landing-implementation-plan.md` — the phase plan (P0–P5) and where the build currently stands.
3. `README.md` — build commands, folder map, conventions (content labeling, shell sync, image pipeline).

Phase prompts live in `docs/prompts/`. Work follows those prompts in order; do not jump ahead of the current phase or rebuild earlier phases without being asked.

**When porting anything from Figma:** the Figma was recreated from the build using the app's UI kit, so its variables do **not** map 1:1 to our CSS tokens. Read `docs/figma-to-css-map.md` (the translation rule + running lookup table) and match values by context, asking when in doubt.

Standing rules: every visitor-facing string is a labeled placeholder (`data-content` convention, see README); image optimization runs locally (`npm run images`), never on Vercel; `docs/` is documentation, not build input; commit in logical chunks with clear messages.
