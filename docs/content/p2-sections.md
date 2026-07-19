# P2 sections — copy deck & composition map

**What this is:** the placeholder copy and layout direction for the six P2 sections. Both P2 prompts (`p2a`, `p2b`) build from this file; do not invent copy that isn't here. All strings are placeholders pending client approval, but they are grounded in the real product (feature breakdown + report-flow docs + brand deck) and must not be replaced with generic marketing filler.

**Voice:** precision instrument, not horoscope. Plain verbs, specific mechanics, quiet confidence. The anchor test: "This calculates. It doesn't divine."

**House rules in force:** eyebrow budget for these six sections: **2 total** (assigned below to Ask Kairos and Pricing; no other section gets one). One CTA intent (download), one label everywhere: **"Get the App"**. Scores in copy use Space Mono. (The original zero-em-dash rule was lifted 2026-07-19: strategic dashes are now allowed; existing copy stays dash-free until the P6 Figma/copy pass.)

---

## Shared / cross-section

| content name | string |
|---|---|
| `cta.label` | Get the App |
| `nav.cta.label` | Get the App |

---

## Block 2 · What it is / isn't — `what`

**Composition:** asymmetric ledger, NOT two equal boxes. The "is" column dominant (larger, teal-accented, roughly two-thirds weight); the "isn't" column recessive (narrower, muted, smaller type, almost a footnote). The imbalance is the message. No eyebrow.

| content name | string |
|---|---|
| `what.headline.1` | Kairos calculates. |
| `what.headline.2` | It doesn't divine. |
| (note) | [P5: headline split across two styled lines per Figma — line 1 dominant, line 2 italic serif. Replaces the single-line "This calculates. It doesn't divine."] |
| `what.sub` | Kairos is electional astrology: timing for things you plan to do, scored against your own birth chart. |
| `what.is.title` | What Kairos is |
| `what.is.items.1` | A timing engine for planned actions, from signing a contract to scheduling surgery |
| `what.is.items.2` | Scored against your own birth chart, not a generic forecast |
| `what.is.items.3` | Rule-based and specific: every score comes from named astrological rules |
| `what.is.items.4` | Ranked results you can act on, with a plain-language reason for each |
| `what.isnt.title` | What it isn't |
| `what.isnt.items.1` | A daily horoscope |
| `what.isnt.items.2` | Personality readings |
| `what.isnt.items.3` | Vague vibes |
| `what.isnt.items.4` | Notifications about who you are |

## Block 5 · What you can do (breadth) — `breadth`

**Composition:** full-width chip field for the 14 categories (loose two-row arrangement, not a rigid grid), `orrery-graphic.svg` as a faint background element behind it. Below, Related Persons and To-Dos as two double-bezel cards (high-end-visual-design construction), asymmetric widths if it composes better. No eyebrow.

| content name | string |
|---|---|
| `breadth.headline` | From surgery to signing a lease. |
| `breadth.sub` | Fourteen categories of plannable life, each backed by its own set of astrological rules. Pick one, or just describe what you're doing. |
| `breadth.categories.1` … `.14` | Finance & Trade · Business & Career · Real Estate · Science & Education · Beauty & Wellbeing · Agriculture & Gardening · Marriage & Children · Relating & Friendship · Domestic Animals · Health & Medical · Travel & Messaging · Gambling & Sports · Litigations & Conflicts · Religion & Spiritual |
| `breadth.persons.title` | Related Persons |
| `breadth.persons.body` | Timing isn't only about you. Save the birth charts of people you plan around, your partner, your kids, a business partner, and calculate timings for them too. |
| `breadth.todos.title` | To-Dos |
| `breadth.todos.body` | Found a good window? Save it, get reminded, push it to your calendar. Afterwards, log how it went. |
| `breadth.todos.flag` | [WORKING TITLE: "To-Dos" pending client confirmation] |

## Block 6 · Ask Kairos — `ai` — **CUT 2026-07-19 (deferred feature; section removed from the page in P6, nav link removed too. Strings kept below for when the feature ships.)**

**Composition:** split section. Copy on one side; on the other, the **stylized exchange**: a brand-graphic treatment (token-styled, clearly a graphic, NOT a fake chat screenshot) of one real request and result. Eyebrow allowed here (1 of 2).

| content name | string |
|---|---|
| `ai.eyebrow` | The smart layer |
| `ai.headline` | Describe it in your words. |
| `ai.body` | Kairos reads a plain-language request and finds the rule set that actually fits, even when it isn't the obvious one. When nothing preset matches, it writes a new rule set for your case. |
| `ai.exchange.request` | "Buying life insurance that will benefit my children" |
| `ai.exchange.response.label` | Rule set matched |
| `ai.exchange.response.value` | Heritage, under Finance & Trade |
| `ai.exchange.response.note` | Not Investing. Kairos recognized the beneficiary intent. |
| `ai.flag` | Part of the paid plan. [MARK AS FORTHCOMING if client confirms; "Ask Kairos" is a working title] |

## Block 7 · Pricing — `pricing`

**Composition:** two plan cards, paid plan visually preferred (teal border/glow, slightly larger), working monthly/yearly toggle (JS already proven in the wireframe). Center-aligned header acceptable here if it composes better; keep the cards asymmetric in emphasis, not size-identical treatments. Eyebrow allowed here (2 of 2).

| content name | string |
|---|---|
| `pricing.eyebrow` | Plans |
| `pricing.headline` | Start free. Upgrade when you need the full engine. |
| `pricing.toggle.monthly` | Monthly |
| `pricing.toggle.yearly` | Yearly |
| `pricing.free.name` | Free |
| `pricing.free.price` | $0 |
| `pricing.free.per` | forever |
| `pricing.free.items.1` | Your birth chart, one profile |
| `pricing.free.items.2` | A starter set of timing rules |
| `pricing.free.items.3` | Core Search and Evaluate |
| `pricing.free.cta` | Get the App |
| `pricing.paid.name` | Paid |
| `pricing.paid.price` | $X / $Y |
| `pricing.paid.per` | month / year |
| `pricing.paid.flag` | [PLACEHOLDER PRICES: real figures from client] |
| `pricing.paid.items.1` | Up to 7 saved charts (Related Persons) |
| `pricing.paid.items.2` | The complete rule sets, every category |
| `pricing.paid.items.3` | Ask Kairos: AI-tuned and custom rules (coming soon) |
| `pricing.paid.items.4` | Timing for recurring events |
| `pricing.paid.cta` | Get the App |

## Block 8 · FAQ — `faq`

**Composition:** single readable column (~70ch), native details/summary accordion styled to brand (hairline dividers, Space Mono markers). No eyebrow.

| content name | string |
|---|---|
| `faq.headline` | Before you download. |
| `faq.items.horoscope.q` | Is this a horoscope app? |
| `faq.items.horoscope.a` | No. Kairos doesn't describe your personality or your day. It scores the timing of things you're planning to do, using electional astrology: rules about when to begin something. |
| `faq.items.knowledge.q` | Do I need to know astrology? |
| `faq.items.knowledge.a` | No. You describe the activity in plain words. Kairos returns scored time windows and a plain-language reason for each. The rules stay under the hood. |
| `faq.items.scores.q` | What do the scores mean? |
| `faq.items.scores.a` | When Kairos searches for times, higher is better: a +17 window beats a +10. When it evaluates dates you already have, each gets a score from -20 to +20, so you can see at a glance which of your options is workable and which to avoid. |
| `faq.items.birthtime.q` | What if I don't know my exact birth time? |
| `faq.items.birthtime.a` | [PLACEHOLDER: depends on the unresolved birth-time-fallback product decision. Do not finalize.] |
| `faq.items.others.q` | Can I use it for other people? |
| `faq.items.others.a` | Yes. Save them as Related Persons with their birth data, and run any search or evaluation for them. The paid plan holds up to 7 charts. |
| `faq.items.freepaid.q` | What's free and what's paid? |
| `faq.items.freepaid.a` | Free covers one chart, a starter rule set, and the core Search and Evaluate. Paid unlocks all rule sets, up to 7 charts, and recurring-event timing. Ask Kairos, the AI layer, joins the paid plan when it ships. |
| `faq.items.privacy.q` | Is my birth data private? |
| `faq.items.privacy.a` | [PLACEHOLDER: final wording follows the Privacy policy; keep the reassurance factual, no marketing.] |

## Block 9 · Final CTA — `final`

**Composition:** short, center-aligned (sanctioned exception), generous vertical space, `orrery-graphic.svg` or a subtle orbital arc motif as background, official store badges as the only action. No eyebrow, no new verbs.

| content name | string |
|---|---|
| `final.headline` | Stop guessing when. Start knowing. |
| `final.sub` | The opportune moment, calculated. |

---

## Block 1 · Hero — `hero` (built in P3, strings live here so content stays in one file)

**Composition (revised 2026-07-20, Figma `24143-48617`):** editorial 12-column grid, not a centered stack — logo top-left, two-tone headline centered (rows 2-3), dark-glass download-button pills centered (row 4), sub-copy bottom-left, scroll hint bottom-right (row 5). The animated chart wheel now **fills the container height (uncapped)** behind the copy — the old "shown whole, never cropped" is superseded; starfield + nebula ambient layers fill the canvas and dissolve into the next section (no hard hero edge). No eyebrow.

| content name | string |
|---|---|
| `hero.headline` | The Auspicious Moment |
| `hero.headline.note` | [P6: two-tone — "The" in fg italic (64px), "Auspicious Moment" in bronze uppercase (96px), two-line stack (Figma `24143-34661`). Was all-bronze single register.] |
| `hero.sub` | Score the best times for what you're planning, against your own birth chart |
| `hero.sub.note` | [P6: "A flight search for timing." dropped per Figma `24143-48997` (Andranik approved 2026-07-19); moved bottom-left, enlarged to 24px.] |
| `hero.scrollhint` | Start scrolling to learn more |
| `hero.scrollhint.note` | [P6: new — bottom-right with a Phosphor mouse-scroll icon (Figma `24143-34666`). Dim (app-kit slate → our muted).] |
| `hero.logo` | (Kairos logo lockup, top-left; same asset as the nav) |

---

## Block 3 · How it works — `how` (built in P4)

**Composition:** two mode rows, alternating orientation (the zigzag cap of 2 is exactly spent here): SEARCH row with steps on one side and the **activity-input-form showcase** (screen-3) on the other; EVALUATE row mirrored, with the **evaluation-result showcase** (screen-2). Steps are a uniform repeating structure. Sample scores in Space Mono. No eyebrow.

| content name | string |
|---|---|
| `how.headline` | Find the time, or grade the times you have. |
| `how.search.title` | Search |
| `how.search.intro` | You know what you want to do, not when. |
| `how.search.steps.1` | Choose an activity, or describe it in your own words |
| `how.search.steps.2` | Set your date range, plus the days and hours that actually work for you |
| `how.search.steps.3` | Get a ranked list of time windows, each scored and explained |
| `how.search.scores` | +17 · +13 · +10 |
| `how.evaluate.title` | Evaluate |
| `how.evaluate.intro` | Already have dates in mind? |
| `how.evaluate.steps.1` | Choose the activity |
| `how.evaluate.steps.2` | Enter your candidate dates |
| `how.evaluate.steps.3` | Each one gets a score from -20 to +20, with the reason why |
| `how.evaluate.scores` | +5 · -7 · 0 |

## Block 4 · Feature showcase — `features` (built in P4)

**Composition:** one centerpiece moment, not a row list: the **home-dashboard showcase** (screen-1) large and slightly offset, copy composed against it. Airy; at most one minor Mokker accent if the composition truly needs it. No eyebrow.

| content name | string |
|---|---|
| `features.headline` | The real thing, in your hand. |
| `features.centerpiece.title` | Your chart and what's coming, at a glance. |
| `features.centerpiece.body` | The home screen pairs your live chart with your upcoming saved timings, so the next right moment is never a surprise. |

---

## Layout-family ledger (anti-repetition check)

what = asymmetric two-column ledger · breadth = chip field + card pair · ai = split copy/graphic · pricing = card pair + toggle · faq = single column accordion · final = centered short block. Six sections, five distinct families (pricing and breadth both end in cards; differentiate by the chip field and toggle context). P3 hero and P4 showcases add their own families.
