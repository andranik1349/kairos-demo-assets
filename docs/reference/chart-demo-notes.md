# Kairos — Chart Visualization Demo: Technical Notes

A dev-friendly summary of what was built, how it works, and where the bodies are buried.

---

## 1. What this is

A high-fidelity, self-contained prototype of the Kairos astrological **chart wheel** plus a
landing page, built for client/stakeholder review and hosted on GitHub Pages.

Two deliverables (both single-file, no build step to run, no dependencies except Google Fonts):

| File | Purpose |
|---|---|
| `kairos-chart.html` | The chart visualization. Standalone view + in-app mockup view, animated date switcher. |
| `index.html` | Landing page for the demo repo — logo, title, and cards linking to each demo. |
| `kairos-chart-v1-fallback.html` | Frozen earlier version kept as a safety net. |

Live (once both are pushed + Pages is enabled):
`https://andranik1349.github.io/kairos-demo-assets/`

> Note: `.gitignore` is currently allow-listed to `index.html` + `kairos-chart.html` only.
> Add files explicitly (`!filename`) if you want them tracked.

---

## 2. Source vs. build artifacts

The shipped HTML files are **generated** — they bake several assets inline. The source pieces and
build scripts live in the working directory (not in the repo). If you want to maintain this, pull
these into the repo:

```
wheel_core.js        # pure geometry + SVG scene builder (runs in browser AND node)
template.html        # the chart page shell: CSS, markup, browser JS, placeholders
build_html.py        # injects sprite + data + core + mockup PNG -> kairos-chart.html
build_glyphs.py      # composites Figma SVG fragments -> glyph_sprite.svg
glyph_sprite.svg     # generated <symbol> sprite of all astrological glyphs

index_template.html  # landing page shell with __LOGO__ placeholder
build_index.py       # injects logo -> index.html
kairos_logo.svg      # recolored Kairos logo (from client-provided SVG)

# verification (node, uses @resvg/resvg-js + jsdom; no browser needed)
verify_render.js / render_wheel_only.js / preview_render.js / render_rotated.js / render_frames.js
verify_html.js       # jsdom smoke test (counts elements, runs page JS, checks for errors)
```

Rebuild the chart: `python3 build_html.py` (reads `template.html`, `glyph_sprite.svg`,
`wheel_core.js`, the horoscope JSON, and `home mockup export.png`).

---

## 3. Data model

Driven by the `get_horoscope` response shape (sample: `kairos api/get_horoscope.json`):

- `Planets[]` — `{Planet, Degree, Speed}`. 13 bodies: `SO MO ME VE MA JU SA UR NE PL NN CH SN`.
  `Speed < 0` ⇒ retrograde (drawn with an `℞` mark).
- `Houses[]` — `{House, Degree}` cusps (sample uses equal house).
- `CPoints[]` — `ASC DSC MC IC PF PS` (Ascendant, Descendant, Midheaven, Imum Coeli,
  Lot of Fortune, Lot of Spirit).
- `PlanetAsps[]` — `{Planet1, Planet2, Aspect, AspMode, Orbis}`. Aspect codes →
  `-1-`=conjunction(0°), `-2-`=opposition(180°), `-3-`=trine(120°), `-4-`=square(90°),
  `-5-`=quintile(72°), `-6-`=sextile(60°), `-8-`=semisquare(45°), `-3/8-`=sesquisquare(135°).

**Swap point:** the page calls `WheelCore.buildScene(DATA)` once with the inlined JSON. Replacing the
sample with a real `get_horoscope` response is a one-liner — same shape in, same chart out.

---

## 4. Geometry (`wheel_core.js`)

SVG viewBox is `0 0 1000 1000`, center `C = (500,500)`. Radii live in `WheelCore.R`:

```
decoOuter 488 / decoInner 472   decorative tick ring (slow ambient spin)
zodOuter 462 / zodInner 396     zodiac band; sign glyphs at zodGlyph 429
houseOuter 250 / houseInner 178 house-number band (moved inward per client ref)
houseNum 214                    house number radius
planetGlyph 350                 planet ring (just inside zodiac; bumped out for legibility)
planetTick 390                  true-degree tick (near zodiac inner edge)
axisGlyph 305                   AC/MC glyph radius (pulled inward of the planet ring)
aspect 178                      aspect-line hub radius (== houseInner, lines touch the ring)
cuspInner 178                   cusp spokes terminate here (no dangling into centre)
```

**Coordinate transform** — Ascendant pinned to 9 o'clock (left), zodiac increasing CCW:

```js
function toXY(e, r, ascDeg){
  var a = (180 + (e - ascDeg)) * PI/180;   // math angle, ASC -> 180° (left)
  return { x: C + r*cos(a), y: C - r*sin(a) };   // y flipped for SVG
}
```
Sanity checks (verified): `ASC → (200,500)` exactly left; `MC` upper-left; Sun `338.6°` lower-left.

**Glyph collision spacing** — planets are plotted at their true degree but glyphs would overlap in
clusters (this snapshot jams ~9 bodies into Aquarius–Pisces). `spaceAngles(items, minSep=9.5°)`
relaxes display angles apart over a few passes; a thin connector line links each glyph back to its
true-degree tick. Bigger planet ring radius (350) + 9.5° spacing keeps the cluster legible.

---

## 5. Glyph sprite (`build_glyphs.py` → `glyph_sprite.svg`)

All astrological symbols are **inline SVG `<symbol>`s** referenced by `<use href="#g-XX">`. They were
composited from the Figma planet/zodiac icon sets:

- Each Figma glyph is a set of stroke **fragments** (separate SVGs with `viewBox` + `% inset`
  positioning, fill `var(--fill-0, #18181B)`). The script downloads fragments, recolors fills/strokes
  to `currentColor`, and nests each into a `24×24` symbol via `<svg x y width height viewBox>` at the
  computed inset, applying `flipx/flipy/rot180` where the Figma component used transforms.
- `currentColor` means glyph color is controlled by CSS (`.sign-glyph`, `.planet-glyph`, etc.), so
  the same sprite recolors for any theme and supports the glow/active states.
- Two glyphs are **hand-drawn** (not composited): the **Sun** (ring + center dot — its Figma asset URL
  had expired) and the **lunar node** `g-NODE` (the classic horseshoe + two foot-circles; the original
  composite came out as a plain circle). North Node uses `g-NODE` as-is (☊); South Node is the same
  symbol rotated 180° (☋). See `glyphUse()`.

Everything is baked into the final HTML, so there are **no external image dependencies** and nothing
expires.

---

## 6. Scene structure (z-order, inside `#wheel` SVG)

```
defs (radial-gradient halos per body, core glow)
core glow circle
.deco-ring        (ambient spin)
.rings            (concentric circles: zodiac + house bands)         ┐ FIXED
.houses           (cusp spokes + numbers)                            │ (Ascendant-relative,
.axes             (ASC/DSC + MC/IC lines, AC/MC glyphs)              ┘  never moves)
#sky {                                                               ┐ ROTATES on date change
  .zodiac (sign-boundary dividers + sign glyphs)                     │
  #aspects (aspect threads)                                          │
  #halos (radial-gradient glow circles)                             │
  #planets (.planet groups: core dot, glyph, retro mark, hit area)   ┘
}
```

The split is the key architectural decision for the date switcher (§9): **houses/axes are pinned to
the Ascendant and never move; everything celestial lives in `#sky`.**

---

## 7. Styling

Dark "premium" theme pulled from the Figma dark-mode screen:

- Background `#05080f → #0d161f` radial gradient; drifting nebula blobs; canvas starfield.
- Accent teal `#0fb8ac` (ASC axis, CTAs), ink `#e9eeff`, gold `#d0b07e` (serif accents).
- Fonts: **Space Grotesk** (UI), **Space Mono** (data/numerals), **Playfair Display** (serif accents,
  landing page). Loaded from Google Fonts with graceful system fallbacks.
- Per-body halo colors in `WheelCore.BODY_COLOR`; aspect colors in `WheelCore.ASPECTS`
  (harmonious = cool/teal, hard = warm).

---

## 8. Views & responsiveness

Body carries a mode class: `mode-standalone` (default) or `mode-app`. A top-right control toggles them.

- **Standalone** — full-bleed responsive; wheel = `min(94vmin, 880px)`, centered.
- **In-app** — a `440×956` "device" (exact iPhone 17 Pro Max logical size) holding the wheel positioned
  in the upper portion (`left:15, top:28, 410×410`) with `home mockup export.png` (transparent UI chrome,
  base64-embedded) overlaid on top. The mockup is `pointer-events:none` so planet hover still works
  through it.
- **Mobile fill** — `fitDevice()` checks `innerWidth <= 560`. On phones it switches the device from
  *contain* (framed mockup floating on the backdrop, desktop) to **cover** (`scale = max(vw/440, vh/956)`,
  no border-radius/shadow) so the app view fills the screen edge-to-edge, cropping minimally. The chart
  keeps its relative position because the whole `440×956` space scales uniformly.

The animated space background sits behind the device and shows through the mockup's transparent areas,
giving a continuous backdrop in app mode.

---

## 9. Animation system

**Entrance** — `body.loaded` (set on 2nd rAF) triggers staggered fades; planets pop in with
per-index `transition-delay`.

**Ambient (cosmetic, data-independent)** — slow `.deco-ring` rotation (260s), halo opacity pulse,
nebula drift, starfield twinkle, center-glow breathe. All CSS/canvas; `prefers-reduced-motion` kills them.

**Pointer parallax** — mousemove lerps a translate/rotate on `.parallax` (reduced factor in app mode).

**Hover/tap** — each `.planet` has a transparent `.phit` hit circle. On enter: bloom its halo, dim other
planets, light up its aspect threads (`.aspect.lit`), and show a glass tooltip (name, sign+degree,
retrograde, aspect list). Tap = sticky on touch.

**Date switcher (the "it's functional" showcase)** — standalone only (CSS-hidden in app mode):

```
3 date pills (OPTS), middle selected by default. Each carries an `asc` delta in degrees.
On click selectDate(i):
  d = normalize(OPTS[i].asc)                       // shortest arc, [-180,180]
  #sky.style.transform = rotate(d)                 // zodiac + planets + aspects turn together
  every .cr-glyph .style.transform = rotate(base - d)   // counter-rotate to stay upright
                                                        // (base = 180 for South Node, else 0)
  update caption datetime
```

- Smoothness comes from **CSS transitions** on `transform` (`1.15s` ease), not rAF — GPU-cheap and it
  doesn't interrupt the ambient animations (elements aren't recreated).
- `transform-box: view-box` + per-element `transform-origin` make `#sky` rotate about (500,500) and each
  glyph counter-rotate about its own center.
- Houses, cusps, numbers, and the ASC/MC axes are **outside `#sky`** → they stay put, which is correct:
  they're Ascendant-relative and the Ascendant is pinned left.

**Physical model / known simplification:** the switcher does a **rigid "diurnal" rotation** of the sky by
an Ascendant delta — planets keep their positions relative to the zodiac. That's accurate for same-day
time changes (the demo's three times) and reads great, but it is **not** the full results-page behavior.
For production (per the design summary) the real path is: two `get_horoscope` snapshots (state A/B),
**shortest-arc per-planet interpolation**, house rotation from the actual ASC shift, and an aspect-line
**crossfade** between configurations. The hooks are there (`buildScene` is pure and re-runnable); the
work is adding per-body tweening + recomputed aspects.

---

## 10. Verification (no browser in the build env)

Headless Chromium wouldn't launch in the sandbox, so verification used:

- **`@resvg/resvg-js`** to rasterize static SVG states (default chart, rotated end-state, glyph grid,
  in-app composite, animation frames → GIF) for visual inspection.
- **jsdom** (`verify_html.js`) to execute the page's inline JS with canvas/rAF stubbed: asserts element
  counts (14 bodies, 16 aspects, 12 signs, 12 house numbers, 26 glyph symbols), exercises the label
  toggle / hover / date switcher, and checks for runtime errors.
- Numeric spot-checks of `toXY` against known degrees.

The CSS-transition animation itself can't be rendered headless; it's standard and was validated by
end-state geometry + jsdom (transforms get set correctly, no errors).

---

## 11. Quick reference — extending it

- **New demo on the landing page:** copy the card block marked `<!-- ===== DEMO CARD ... ===== -->`
  in `index.html`, change `href`/title/description.
- **Real data:** replace the inlined `DATA` JSON (build-time) with a live `get_horoscope` response.
- **More/real dates in the switcher:** edit `OPTS` in `template.html`; for true accuracy, generate
  snapshots and animate per-planet (see §9 production note).
- **Theme:** colors in `:root` CSS vars + `WheelCore.BODY_COLOR` / `ASPECTS`.
- **Glyph tweaks:** edit `build_glyphs.py` and regenerate `glyph_sprite.svg`, then `build_html.py`.
