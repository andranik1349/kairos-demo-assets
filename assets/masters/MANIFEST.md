# Asset Masters — Manifest

Canonical source for all Kairos landing imagery. Copied from the parent working
folder's `build-assets/` on 2026-07-19 (P0), with all names normalized to
lowercase-kebab-case (no spaces). **This folder is the source of truth from now
on** — the repo is self-sufficient; the original `build-assets/` is no longer
referenced by the build.

The image pipeline (`scripts/images.mjs`) reads from here and writes optimized
output to `site/img/`. `reference.png` files, `kairos-chart.html`, and this
`MANIFEST.md` are pipeline-skipped (design references / non-image inputs).

## Old → new name mapping

### `decomposed/screen-1/` — P4 showcase: home dashboard
| Original | Normalized |
| --- | --- |
| `Frame 7.png` | `frame-7.png` |
| `Frame 8.png` | `frame-8.png` |
| `content.png` | `content.png` |
| `iPhone 16 & 17 Pro Max - 270.png` | `phone-frame.png` (descriptive rename) |
| `navbar.png` | `navbar.png` |
| `reference.png` | `reference.png` (design reference — pipeline-skipped) |

### `decomposed/screen-2/` — P4 showcase: activity input form
| Original | Normalized |
| --- | --- |
| `Frame 41.png` | `frame-41.png` |
| `bg.png` | `bg.png` |
| `date-and-location.png` | `date-and-location.png` |
| `reference.png` | `reference.png` (design reference — pipeline-skipped) |
| `sticky-button.png` | `sticky-button.png` |

### `decomposed/screen-3/` — P4 showcase: evaluation result
| Original | Normalized |
| --- | --- |
| `CustomButton1.png` | `custom-button-1.png` |
| `CustomButton2.png` | `custom-button-2.png` |
| `bg.png` | `bg.png` |
| `form.png` | `form.png` |
| `reference.png` | `reference.png` (design reference — pipeline-skipped) |
| `select person.png` | `select-person.png` |

### `mock-3d-screens/` — 6 Mokker PNG renders (P2 imagery)
| Original | Normalized |
| --- | --- |
| `Mokker01.png` | `mokker-01.png` |
| `Mokker02.png` | `mokker-02.png` |
| `Mokker03.png` | `mokker-03.png` |
| `Mokker04.png` | `mokker-04.png` |
| `Mokker05.png` | `mokker-05.png` |
| `Mokker06.png` | `mokker-06.png` |

### Root
| Original | Normalized |
| --- | --- |
| `kairos-logo-full.svg` | `kairos-logo-full.svg` |
| `orrery-graphic.svg` | `orrery-graphic.svg` |
| `kairos-chart.html` | `kairos-chart.html` (P3 hero chart input — pipeline-skipped, stored not optimized) |

### `og/` — OG/social-share image (P2)
| File | Notes |
| --- | --- |
| `og-image.png` | 1200×630 master. Krea-generated orbital background (gpt-image-2) with the wordmark composited locally from `kairos-logo-full.svg` (recolored to `--color-fg`). Pipeline emits the exact-size `site/img/og/og-image-1200.png` wired into every page's `og:image`. |

### Skipped from source
Four macOS `.DS_Store` files were not copied.
