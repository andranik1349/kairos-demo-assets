# P2 sections — copy deck & composition map

**What this is:** the placeholder copy and layout direction for the six P2 sections. Both P2 prompts (`p2a`, `p2b`) build from this file; do not invent copy that isn't here. All strings are placeholders pending client approval, but they are grounded in the real product (feature breakdown + report-flow docs + brand deck) and must not be replaced with generic marketing filler.

**Voice:** precision instrument, not horoscope. Plain verbs, specific mechanics, quiet confidence. The anchor test: "This calculates. It doesn't divine."

**House rules in force:** zero em-dashes anywhere. Eyebrow budget for these six sections: **2 total** (assigned below to Ask Kairos and Pricing; no other section gets one). One CTA intent (download), one label everywhere: **"Get the app"**. Scores in copy use Space Mono.

---

## Shared / cross-section

| content name | string |
|---|---|
| `cta.label` | Get the app |
| `nav.cta.label` | Get the app |

---

## Block 2 · What it is / isn't — `what`

**Composition:** asymmetric ledger, NOT two equal boxes. The "is" column dominant (larger, teal-accented, roughly two-thirds weight); the "isn't" column recessive (narrower, muted, smaller type, almost a footnote). The imbalance is the message. No eyebrow.

| content name | string |
|---|---|
| `what.headline` | This calculates. It doesn't divine. |
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

## Block 6 · Ask Kairos — `ai`

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
| `pricing.free.cta` | Get the app |
| `pricing.paid.name` | Paid |
| `pricing.paid.price` | $X / $Y |
| `pricing.paid.per` | month / year |
| `pricing.paid.flag` | [PLACEHOLDER PRICES: real figures from client] |
| `pricing.paid.items.1` | Up to 7 saved charts (Related Persons) |
| `pricing.paid.items.2` | The complete rule sets, every category |
| `pricing.paid.items.3` | Ask Kairos: AI-tuned and custom rules |
| `pricing.paid.items.4` | Timing for recurring events |
| `pricing.paid.cta` | Get the app |

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
| `faq.items.freepaid.a` | Free covers one chart, a starter rule set, and the core Search and Evaluate. Paid unlocks all rule sets, up to 7 charts, Ask Kairos, and recurring-event timing. |
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

**Composition:** center-aligned (the sanctioned exception). Simplified animated chart wheel as the hero object, dimmed, large, shown whole (never cropped) behind/below the copy; starfield + nebula ambient layers fill the hero canvas and dissolve seamlessly into the next section (no hard hero edge). Store badges are the only CTA. No eyebrow.

| content name | string |
|---|---|
| `hero.headline` | The opportune moment, calculated. |
| `hero.sub` | Score the best times for what you're planning, against your own birth chart. A flight search for timing. |

---

## Layout-family ledger (anti-repetition check)

what = asymmetric two-column ledger · breadth = chip field + card pair · ai = split copy/graphic · pricing = card pair + toggle · faq = single column accordion · final = centered short block. Six sections, five distinct families (pricing and breadth both end in cards; differentiate by the chip field and toggle context). P3 hero and P4 showcases add their own families.
