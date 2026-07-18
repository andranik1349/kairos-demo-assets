# P1 · Shell & content model — Claude Code prompt

> Phase 2 of 6 (P0–P5) from `docs/kairos-landing-implementation-plan.md`. Requires P0 complete (tokens, Tailwind build, image pipeline, styleguide all live). Run from the repo root.

---

## Context

You are building the **shared frame** of the Kairos landing site and establishing the **content-as-components convention** every later phase follows. Still no real marketing content — sections arrive in P2–P4. This phase delivers: the page shell (nav + footer + head), four working pages, and the labeling pattern that makes a future headless CMS bolt-on mechanical.

**Ratified decisions (do not re-litigate):** content lives **in the HTML, labeled** (no data file, no injection script); mobile nav is **logo + CTA only** (no hamburger); store buttons use the **official Apple/Google badge artwork**.

## The content convention (the load-bearing piece)

Every visitor-facing string is a **placeholder** and must be traceable. The rules:

1. **Label every string** with a `data-content` attribute using dot-notation: `data-content="<section>.<item>.<field>"` — e.g. `data-content="footer.descriptor"`, `data-content="nav.links.pricing"`. Repeating items get an index or slug: `faq.items.birth-time.question`.
2. **Repeating structures are strictly uniform** — every FAQ item, plan card, nav link, footer column uses identical markup, differing only in content. No one-off variations.
3. **Attribute-bound copy counts too**: `alt` text, `aria-label`s, meta descriptions, OG tags — label the element (`data-content-attrs="alt"` alongside `data-content`) or, for `<head>` meta, a `<!-- content: meta.description -->` comment above the tag.
4. Document the convention in the README (short section: "How content is stored / how a CMS maps on later").

This costs nothing visually — the attributes are invisible — and makes every string greppable by name.

## Step 1 — Page template & head

Define the canonical page skeleton used by all four pages. `<head>` must include: charset, viewport, per-page `<title>` + meta description (labeled placeholders), the P0 Google Fonts links + preconnect, `css/main.css`, favicon set, `theme-color` (#070C13), and **placeholder OG tags** (`og:title`, `og:description`, `og:image` pointing at a `site/img/og-placeholder` slot — the real OG image is generated in P2).

**Favicon:** derive from `assets/masters/orrery-graphic.svg` — an SVG favicon plus PNG fallbacks (32px) and `apple-touch-icon` (180px, on the dark canvas color, since apple-touch-icons don't support transparency well). Generate via the image pipeline or a one-off sharp call; committed like all image output.

**No include mechanism exists** (no SSG yet), so nav and footer are duplicated across the four pages. Mark each shared block with clear boundary comments (`<!-- shell:nav (keep in sync across pages) -->` … `<!-- /shell:nav -->`) and note in the README that shell edits must be applied to all pages. Four small pages — acceptable until the SSG migration.

## Step 2 — Sticky nav

- Left: Kairos logo (use the P0 white-silhouette treatment for now; final logo treatment is a later design call). Links home (`/`).
- Center/right (desktop only): section anchor links — What it is (`#what`), How it works (`#how`), Features (`#features`), Uses (`#breadth`), Ask Kairos (`#ai`), Pricing (`#pricing`), FAQ (`#faq`). All labels labeled as content (`nav.links.*`). These are index-page anchors; on terms/privacy/404 they point to `/#what` etc.
- Right: **download CTA** (a compact button, not the full store badges — those live in hero/final/footer). Behavior on the index page: hidden while the hero's store badges are on screen, revealed once scrolled past — IntersectionObserver watching the hero CTA block, the exact pattern proven in `../kairos-landing-wireframe.html` (translate it, don't reinvent: `.show` class toggle, `aria-hidden` sync, reduced-motion guard, graceful fallback to always-visible if IO is unavailable). On the other three pages: always visible.
- Style: sticky, dark translucent surface over the canvas with a hairline bottom border (`--color-hair`), backdrop blur allowed (web build — the app's no-blur constraint does not apply).
- **Mobile (< ~760px): section links disappear entirely.** Logo + CTA only. No hamburger, no menu JS.

JS lives in `site/js/site.js` (plain vanilla JS, no build step, loaded `defer` on all pages).

## Step 3 — Footer (IA block 10)

Three-column desktop / stacked mobile, all strings labeled placeholders:
1. **Brand:** logo, descriptor line ("The Auspicious Moment" — placeholder), the two official store badges.
2. **Product:** How it works, Pricing, FAQ (anchor links).
3. **Legal & contact:** Terms (`/terms`), Privacy (`/privacy`), Contact (placeholder `mailto:`), one Social placeholder link.

Bottom line: `© 2026 Kairos` + placeholder note removed — this is the production shell now, keep it clean. Hairline top border, muted text, Space Mono for the small labels.

## Step 4 — Official store badges

Download the official artwork: Apple's **"Download on the App Store"** badge (Apple's marketing resources provide SVG) and Google's **"Get it on Google Play"** badge (Google's badge generator / brand site). English versions, standard black. Store them in `assets/masters/badges/` (git-tracked masters, as always) and copy through the pipeline to `site/img/`. If a badge can't be fetched from the official source, build a clearly-marked placeholder box and flag it in your report — do not hand-draw an imitation badge.

Both badges link to `#` placeholders (real store URLs are a client deliverable). Wrap each in a labeled component (`store-badges.app-store`, `store-badges.google-play`) — the same block is reused in hero (P3), final CTA (P2), and footer, so its markup must be identical everywhere.

## Step 5 — The four pages

1. **`index.html`** — real shell (nav + footer) around a `<main>` containing **empty, ID'd section stubs** in IA order: `#hero`, `#what`, `#how`, `#features`, `#breadth`, `#ai`, `#pricing`, `#faq`, `#final`. Each stub: the section element, its ID, and a `<!-- P2/P3/P4: ... -->` comment naming what lands there. The hero stub carries a temporary minimal block (logo mark + placeholder store badges) so the nav CTA reveal has something real to observe. Nav anchors must all resolve.
2. **`terms.html`** and **`privacy.html`** — shell + a simple legal-document layout: page title (display font), "Last updated" placeholder, 3–4 placeholder sections with headings and clearly-marked placeholder paragraphs (`[PLACEHOLDER — final legal copy from client]`). Readable measure (~70ch), muted body text.
3. **`404.html`** — shell (nav CTA always visible, no anchors needed) + a short on-brand message (display-font headline, one line of body copy, a "Back to home" button). Vercel serves `404.html` automatically for missing routes on static deploys — verify this works on the preview after deploy.

Delete the P0 stub content from `index.html` (the centered-logo placeholder) — the shell replaces it.

## Step 6 — README update

Add: the content-labeling convention (with one concrete example), the shell-sync rule (nav/footer duplicated, edit all four pages), where badge masters came from, and the page inventory.

## Acceptance checklist

- [ ] All four pages render with shared nav + footer, identical shell markup (diff-check the shell blocks across pages)
- [ ] Nav CTA: hidden at top of index, reveals on scroll past hero stub, always visible on terms/privacy/404; reduced-motion and no-IO fallbacks work
- [ ] Mobile viewport: nav shows logo + CTA only; footer stacks
- [ ] Official badges render in footer + hero stub, from pipeline-processed masters
- [ ] Favicon + theme-color + OG placeholders present on all pages
- [ ] Every visitor-facing string carries a `data-content` label (spot-check: grep a few names)
- [ ] `npm run build` clean; anchors resolve; `/terms`, `/privacy` work with cleanUrls; 404 verified on the deployed preview
- [ ] README updated

Commit in logical chunks, push to `main`, confirm the Vercel deploy, report the preview URL and any flags (e.g. badge fetch failures).

## Out of scope

All real content sections (P2), hero + chart (P3), showcases (P4), motion polish (P5). The hero stub is scaffolding, not the hero. If blocked or contradicted by anything here, stop and flag it.
