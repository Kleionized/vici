# Group `paywall-reminders` — analysis (Vici Overhaul)

Frames (bundle `Email-Login`, split files in `.overhaul/final/Email-Login/`):
`Reminders-Setup`, `Paywall`, `Day-Zero`, `Paywall-Rescue`, `Paywall-Confirmed`,
`Manage-Subscription`, `Morning-Check-in-Time`, `Nightly-Check-in-Time`.

Design PNGs: `.overhaul/shots/design/Email-Login/<Frame>.png`. Layout signatures of every frame in
this group were captured this pass and are kept for the implementers:
`.overhaul/sig/pr-d-rem.txt` (Reminders Setup), `pr-d-pw.txt` (Paywall), `pr-d-dz.txt` (Day Zero),
`pr-d-resc.txt` (Rescue), `pr-d-conf.txt` (Confirmed), `pr-d-sub.txt` (Manage Subscription),
`pr-d-morning.txt` (Morning time). Nightly = Morning with different wheel values (body diffed).
Diff an app capture against them with `node scripts/overhaul/sigdiff.mjs pr-d-xxx <app-sig>`.

All y below are **canvas y**. App y under the safe area = canvas y − 54 for top-anchored boxes
(D009); bottom-anchored boxes (`primary`, `ghost`, footers) are measured off the frame's own bottom
edge (D026) — e.g. `bottom:96` is `bottom: 96` in the app with no bottom inset spent.

---

## 0. What is common to all eight frames

| property | value (transcribed) | today in the app |
| --- | --- | --- |
| ground | `#0D0D0D` | `#F4F3F0` / `#FAF8F3` paper |
| texture | `noise.png` tiled (96px, no background-size), `opacity: 0.05` over the whole frame | `noise-dark.png` at 0.07 (some screens), none on 48 |
| status bar | light glyphs (`#F2F0EC`) → `<StatusBar style="light" />` | every file in the group writes `style="dark"` |
| face | Lato only (400/700/900). `sans('700')` etc. | already Lato via theme remap, but `PW_SERIF` (Times New Roman) and `PW_SYS` (system) are still used in `PaywallFlow.tsx` |
| washes / gradients / glows / ridges | none | sunrise band (`PwBand`), floor glow (`PwFloorGlow`), confirmed ridge (`PwConfirmedRidge`), Day-0 night shore card — all removed |
| primary pill | kit `primary`: `left/right 24`, `height 58`, `radius 29`, bg `#F2F0EC`, label 16/700/`letterSpacing 0.1`/`#111111`, nowrap. `bottom` 48 (default), 82, 96 per frame | 54–58 tall `#131313` pills with 16.5–17.5/600 white labels, some with gold arrow |
| ghost link | kit `ghost`: full-width centred, 15/400 `#9B968E`, `bottom` 56/60 | 13.5–15/500 `#8B8882` |
| nav row | kit `nav`: `top 60`, `height 40`, `padding 0 22`, left slot 36×40, right slot 36×40 (flex-end) | text "‹ Back" rows at canvas y 64 |

**Laurel mark** (`assets/images/laurel-mark.webp`, byte-identical to the bundle's). The file is
**280 × 252** — not square — and the frames place it with `<img width=W height=W>` and no
`object-fit`, i.e. **stretched to fill** a square box, under `filter: brightness(0) invert(1)`,
which paints every non-transparent pixel pure **`#FFFFFF`** (not `#F2F0EC`). App: `expo-image`
`contentFit="fill"` (or RN `Image resizeMode="stretch"`) + `tintColor="#FFFFFF"`. The previous
recipe already found `contentFit="contain"` loses ink against the canvas's `<img>`.

**Text wrapping on web.** `AppText` gives every body run `textWrap: 'pretty'` on web. Several runs
in these frames state **no** `text-wrap` (initial value `wrap`) and end on a short last line that
`pretty` would rebalance: the notification bodies (`…head at` / `today?`, `…one tap` / `away.`),
the Rescue rows (`…unless you` / `cancel`), the Paywall feature labels, Day-0 card text, the
subscription rows. Those runs must pass `{ textWrap: 'wrap' }` on web (the `WRAP` idiom already in
`handover.tsx` / `routines/kit.tsx`). Runs the kit writes as `h1` are `balance`, `p` are `pretty`.

**Short phones.** Every board in the group is laid out absolutely with a bottom-anchored pill, and
on 375 × 667 (inset 20) the pill lands on content: Reminders cards end at 670 vs pill top
`852−96−58=698` (on 667: 513); Paywall features end 626 vs pill 712 (667: 527); Day-0 text ends 623
vs 746 (667: 561); time pickers' chips end 616 vs 746 (667: 561); Rescue rows end 515 vs 698 (667:
513); Confirmed text ends 535 vs 712 (667: 527); Subscription rows end 748 vs cancel 778. Each board
needs the same treatment: a `ScrollView` whose content has `minHeight = window − topInset`, the
canvas stack in flow at its canvas offset, a flex spacer, then the pill/ghost at their canvas
bottoms — identical at 852, scrolls instead of overlapping on 667. (The previous build overlapped on
667 too; this is not new, but the brief asks for it to be checked.) See §8 for the wheel caveat.

---

## 1. `Reminders Setup` (FLOW `42 · Reminders`)

**Where today.** `src/components/onboarding/handover.tsx` → `O3Reminders` (+ `NotificationCard`,
`Frame`, `Cta`, `Quiet`), rendered by `src/app/(onboarding)/welcome.tsx` step `reminders`
(`WHOLE_FRAME`). Props: `window` = `windowFor(answers)[2]` (`src/components/onboarding/v3.tsx:1173`),
`onAllow` (sets answer `reminder: 'yes'`, `next()`), `skip` (`next()`).

**Reach.** `/welcome`, `--initseed=.overhaul/f-funnel-user.js`, `--do="window.__H='rem'"`,
`--script=.overhaul/drives/handover-walk.js` (recipe `.overhaul/recipes/handover.json`). The walk
answers `Late at night`, which gives the frame's `Late night`. NB the walk's labels belong to the
funnel/tail groups and will change with their overhaul.

**What the frame draws** (`pr-d-rem.txt`):
- `frame` + `nav(noBack)` → nav row present but **both slots empty**: no Back, no Skip.
- Hero **bell** (`data-hero="bell"`): `<svg width=393 height=240 viewBox="0 0 393 240">` at
  `left 0, top 90`, `overflow: visible`, `transform: scale(1.1)`, `transform-origin: 196px 190px`
  ⇒ wrap the art in `<G transform="translate(196 190) scale(1.1) translate(-196 -190)">` (x' = 1.1x
  − 19.6, y' = 1.1y − 19), and give the `<Svg>` room for the overflow (rendered box −19.6..412.7 ×
  71..335). Paths, in paint order:
  1. `<ellipse cx=196 cy=200 rx=64 ry=3.84 fill=#3A3835>` (shadow)
  2. `<circle cx=196 cy=60 r=6 fill=none stroke=#F2F0EC stroke-width=3 stroke-linejoin=round>`
  3. `<rect x=193 y=64 width=6 height=14 fill=#F2F0EC>`
  4. `<path d="M196 76 C 164 76 150 102 150 130 V160 H242 V130 C 242 102 228 76 196 76 Z" fill=#F2F0EC>`
  5. `<rect x=138 y=158 width=116 height=8 rx=4 fill=#F2F0EC>`
  6. `<circle cx=196 cy=177 r=8 fill=#F2F0EC>`
  7. `<path d="M166 130 C 167 112, 175 100, 187 93" fill=none stroke=#0D0D0D stroke-width=3 linecap/linejoin round>` (the shine)
  8. `<path d="M128 98 L118 90 M264 98 L274 90 M120 130 H108 M272 130 H284" fill=none stroke=#F2F0EC stroke-width=3 round>` (ring lines)
  (The kit's `H.bell` has slightly different coordinates — circle cy 62 etc.; **use the frame's**.)
- `stack(320, gap 18)`: `h1` "Late night is when you’re most likely to watch." 26/700/−0.6/lh 33
  `#F2F0EC`, balance → 2 lines (`…when you’re` / `most likely to watch.`), box 24,320,345×66; `p`
  "Want VICI there before that time?" 15/400/lh 24 `#B5B0A8` at y 404.
- `stack(470, gap 14)` of two **notification cards** (bespoke `notif` in `mono-onboarding.js:405`):
  `radius 20`, bg `#1E1E1E`, `padding 16 18`, row `gap 14`, `align-items: flex-start`,
  `box-shadow: 0 1px 2px rgba(0,0,0,0.04)`; laurel 40×40 (`radius 10`, white, stretched); text
  column `gap 3`, `flex 1`: header row `space-between`, `align-items: baseline` — title 15/700
  `#F2F0EC`, when 12/700 `#9B968E`; body 14/400/lh 20 `#B5B0A8` (no text-wrap → `wrap`). Card 1
  24,470,345×93; card 2 24,577,345×93.
  - "Morning check-in" · "now" · "Twenty seconds — where’s your head at today?"
  - "Late night ahead" · "You pick the time" · "The time you told us about. SOS is one tap away."
- `primary('Turn on reminders', bottom 96)` → 24,698,345×58.
- `ghost('Not now', bottom 60)` → text box 0,774,393×18.

**What must change.**
- Paper `Frame` → ground + noise; StatusBar light.
- Title: centred 22/500 `#1D1C1A` at canvas 140 → **left-aligned** h1 26/700/−0.6/33 at 320.
  Keep the computed string `${riskWindow} is when you’re most likely to watch.` (frame = the default
  `Late night` case). Greedy wrap at 345 gives the frame's break for `Late night`; on web add
  `textWrap: 'balance'` so other windows balance like the canvas would.
- Sub: centred 15.5/400 `#55534E` at 214 → left p 15/24 `#B5B0A8` at 404.
- New: the bell hero.
- Cards: white 16-radius hairline cards at 280/392 with a 24pt laurel at 0.8 → dark 20-radius cards
  at 470/577 with a 40pt **white** laurel, top-aligned row; title 15.5/600 → 15/700; when 12.5/500
  → 12/700 `#9B968E`; body 14.5/21 `#55534E` with `marginTop 8` → 14/20 `#B5B0A8` with `gap 3`.
  **The second card is no longer dimmed** (0.55 → 1).
- Copy: card-1 body `where's` (U+0027) → `where’s` (U+2019). Everything else unchanged.
- Pill: canvas top 688, 56 tall, `#131313` → `bottom 96`, 58 tall, ink `#F2F0EC`, label `#111111`
  16/700/0.1. "Not now": 15/500 `#8B8882` at 764 → ghost 15/400 `#9B968E` at `bottom 60`.

**Preserve.** `Turn on reminders` records the answer and advances; `Not now` advances; headline
personalisation via `windowFor`. (Note: nothing in the app requests OS notification permission —
neither here nor in `/reminders`; out of scope, unchanged.)

---

## 2. `Paywall` (FLOW `43 · Paywall`)

**Where today.** `src/components/paywall/PaywallFlow.tsx` → `PaywallFlow` → `PwMain` (+ `PwX`,
`PW_SMALL_X`, `PwCTA`, `PwBand`, `PwPlanRow`, `PwRadio`, `PW_ON/PW_OFF`, `PW_PROMISES`,
`PwPromiseIcon`, `PwPromiseColumn`, `savingBadge`, `DRAWN_MONEY`). Two entry points:
`src/app/paywall.tsx` (standalone; `PAYWALL_SOURCE` picks `PaywallFlow` under mock/`designed`,
`OfferingPaywall` with a RevenueCat key, `RevenueCatPaywall` under `=revenuecat`) and
`src/app/(onboarding)/welcome.tsx` step `paywall` (`<PaywallFlow embedded …>` always).
`src/components/paywall/OfferingPaywall.tsx` draws the same board from a live offering (D152).

**Reach.** `/paywall` with `wait 1800` (mock pins `PAYWALL_SOURCE` to `designed`). In the funnel:
`/welcome` + `.overhaul/drives/v-pw-funnel48.js`. Entry points in-app: Settings → Manage
subscription → Change plan; `(app)/locked.tsx`; All → Plan → Paywall.

**What the frame draws** (`pr-d-pw.txt`). No nav row at all.
- "Restore": `position absolute; right 24; top 70`; 15/700 `#9B968E` (box 316.1,70,52.9×18).
- Brand lockup `left 24; top 66`, row, `align-items center`, `gap 10`: laurel 28×28 (white,
  stretched) + "VICI Unlimited" 14/700 `#F2F0EC` nowrap (text at 62,71.5).
- `stack(130, gap 14)`: h1 "Take your life back." **34**/700/−0.6/lh **40** (1 line, 24,130,345×40);
  p "Break the cycle, rebuild your self-control, and become someone you can trust again." 15/24
  `#B5B0A8` (2 lines: `…self-control, and` / `become someone…`; 24,184,345×48).
- Plans row `left 24; right 24; top 318`, `display flex; gap 12` → two cards 166.5 × 153, each
  `flex 1; radius 22; padding 20 18 18`:
  - **Yearly (selected)**: bg `#F2F0EC`, `position relative`.
    - Badge "Save 74%" (title case — **no** `text-transform`): `position absolute; top −12; left 18;
      height 24; radius 12; bg #1E1E1E; box-shadow 0 0 0 1.5px #F2F0EC; padding 0 10`; 11/700,
      `letterSpacing 1`, `#F2F0EC`, nowrap (box 42,306,74.8×24 — overhangs the card top by 12).
    - Row `space-between, align center`: "Yearly" 18/700 `#111111`; radio 22×22 `radius 11`
      bg `#1E1E1E` holding a check 12×12 (viewBox 0 0 14 14, `M2 7.5l3.2 3L12 3.5`, stroke `#F2F0EC`,
      2.2, round) (row box 42,338,130.5×22).
    - "Best value" `marginTop 6`, 12/700 `rgba(17,17,17,0.6)` (y 366).
    - Price `marginTop 22`: "$39.99" 26/700/`letterSpacing −0.8` `#111111` with an inline span
      "/year" 13/700 `rgba(17,17,17,0.6)` `letterSpacing 0` (nested `<Text>`; y 403, h 32).
    - "$3.33 a month" `marginTop 2`, 13/700 `rgba(17,17,17,0.7)` (y 437).
  - **Monthly (unselected)**: bg `#1E1E1E`, `box-shadow 0 0 0 1.5px #2E2E2E` (outside ring — not a
    border). "Monthly" 18/700 `#F2F0EC`; radio 22 empty with `box-shadow 0 0 0 1.5px #2E2E2E`;
    "Cancel anytime" 12/700 `#9B968E`; "$12.99" 26/700/−0.8 `#F2F0EC` + "/month" 13/700 `#9B968E`;
    "Billed monthly" 13/700 `#9B968E`.
- `caps('What you get')` at `top 520`, left-aligned, 13/700 `#9B968E`.
- Features row `top 552`, `display flex; gap 8` → four columns 80.25 wide (`flex 1`), each
  `column, align center, gap 8`: disc 34×34 `radius 17` bg `#F2F0EC` with check 14×14 (stroke
  `#111111`, 2.2); label 12/700/lh 16 `#B5B0A8` centred. Labels **with no forced breaks**:
  "12-week plan", "SOS help" (1 line each), "Weekly insights", "Progress tracking" (wrap to 2 lines
  at 80.25 — `text-wrap` not set → `wrap`).
- `primary('Continue', bottom 82)` → 24,712,345×58. No arrow.
- Footer `bottom 52`, full width centred: "Terms · Restore" 12/700/`letterSpacing 0.4` `#9B968E`
  (y 785).

**What must change.**
- Remove `PwBand` (sunrise ridge), the paper (`#FAF8F3`) and the serif wordmark + gold `UNLIMITED`
  pill → laurel + "VICI Unlimited". Remove `PW_SERIF` (Lato only).
- "Restore": 15/400 `#55534E` at top 16(app) → 15/700 `#9B968E` at canvas top 70 (app 16) — same
  position, new weight/colour.
- Headline: centred 26/600 at 262(app) → left 34/700/−0.6/40 at canvas 130. Sub: centred
  13.5/20 `#55534E` inset 40 → left 15/24 `#B5B0A8` full 345.
- Plans: two stacked full-width rows (74 + 64 tall, radius 18, gold ring, gold tab top-right, "Best
  value" pill beside the name, price right-aligned) → **two side-by-side cards** as above. Copy:
  `SAVE 74%` → **`Save 74%`** (change `savingBadge()` and `DRAWN_MONEY.yearSaving`, and
  `OfferingPaywall.savingFor`); "Best value" moves from a pill to the card's tagline; Monthly's
  "Cancel anytime" moves to the tagline and a **new bottom line "Billed monthly"** appears; Yearly
  keeps "$3.33 a month" as its bottom line (`${yearPerMonth} a month`).
- Radio: 24pt gold disc / inset hairline → 22pt `#1E1E1E` disc with `#F2F0EC` check (on) / 22pt
  empty with 1.5 `#2E2E2E` outer ring (off).
- "What you get": centred between two hairlines, 12.5/500 → left caps 13/700 `#9B968E`.
- Promises: 50pt radial discs with four bespoke icons (`PwPromiseIcon`) → four identical 34pt ink
  discs with a `#111111` check. Labels lose their `\n` (`'12-week\nplan'` → `'12-week plan'`, etc.)
  and become 12/700/16 `#B5B0A8`. `PwPromiseIcon` and the gold `PW_GOLD` art are retired.
- CTA: 54 tall `#131313` with a gold arrow at top 690(app) → kit primary 58 tall at `bottom 82`.
- Footer: 11.5/400 `#8B8882` → 12/700/0.4 `#9B968E` at `bottom 52`.
- **The frame draws no close/skip control** (old: 34pt `PwX` top-left, label `Close` / `Skip`).
  See Open Question 1 — the control must survive.

**States not drawn.** *Monthly chosen*: invert the two palettes (Monthly card takes the ink fill,
`#111111` name/price, `rgba(17,17,17,0.6)` tagline + cycle, `rgba(17,17,17,0.7)` bottom line and the
filled radio; Yearly takes `#1E1E1E` + `#2E2E2E` ring, `#F2F0EC` name/price, `#9B968E` tagline/
cycle/bottom line and the empty ring radio). The "Save 74%" badge is unchanged in both states (it is
already a dark pill with an ink ring, legible on either card) — D153's gold-on-paper problem no
longer exists. Pressed states: `PressScale` as today.

**Preserve.** Plan selection (radio semantics, `accessibilityRole="radio"`, `accessibilityState`,
label `"Yearly, $39.99/year"`); `Continue` → `start(plan)` (mock: drawn pay sheet; live: store
purchase via `purchases.purchase`, busy-guard); `Restore` → `restore()` with its Alerts; the
one-time rescue on dismiss (`decline()`: `offered`/`hasTrial`); `onDone(false|true)`; all prices,
cycles, per-month price, trial length and saving computed from the offering (`money` memo), with the
canvas numbers as offline fallback; `embedded` (funnel) vs standalone close semantics.

### 2a. `OfferingPaywall` (no separate frame — draws `Paywall` from a live offering)
Same restyle, but N packages from the offering. Map per package: name → card title; badge
(`copy.badges[id]` ?? "Best value" on `bestValueId`) → **tagline**; non-best tagline → "Cancel
anytime" (today `subtitleFor` returns it for monthly); bottom line → `${pricePerMonth} a month` when
the cycle is not monthly, "Billed monthly" for monthly, intro-offer text when eligible (today's
`subtitleFor` logic, re-slotted); "Save NN%" badge (title case) on the best-value card. Keep the
metadata overrides (`eyebrow` now means the lockup text — default "VICI Unlimited"; `headline`,
`benefitsTitle`, `benefits` (exactly 4, now **without** `\n`), `cta`, `footnote`,
`defaultPackage`). Loading state (`!purchases.ready`) is an `ActivityIndicator` on `#FAF8F3` → ground
`#0D0D0D` + noise, spinner `#F2F0EC`. Empty offering → falls back to `PaywallFlow` (keep). Layout for
≠ 2 packages: Open Question 5. Update `src/lib/purchases/metadata.ts` docstring (eyebrow, benefits
without `\n`).

### 2b. `RevenueCatPaywall`
Renders RevenueCat's own native paywall; only its `ready === false` placeholder View
(`colors.bg`, already remapped to `#0D0D0D` by the new theme) is ours. No change beyond that.

---

## 3. `Day Zero` (FLOW `44 · Day 0`)

**Where today.** `src/components/onboarding/handover.tsx` → `O3DayZero({ lesson, next })`, rendered
by `welcome.tsx` step `day-zero` with `lesson="Lesson I · Surviving the Night — seven minutes."` and
`next={() => void finish()}` (`finish` writes profile/letter/life map, `completeOnboarding()`, then
`router.replace('/routines/morning-time')`).

**Reach.** `/welcome`, `--initseed=.overhaul/f-pw-funnel-seed.js`,
`--script=.overhaul/drives/v-pw-dayzero.js` (walks the whole funnel; ends with `Not now` on
Reminders, `Skip` on the paywall, `No thanks` on the rescue). Labels will change with the funnel
groups' work and with Open Question 1.

**What the frame draws** (`pr-d-dz.txt`):
- `nav(noBack)` — empty nav row.
- Hero **sunrise** (`data-hero`): svg 393×240 at `top 126`, scale 1.1 @ 196,190 (same transform as
  the bell). Paint order:
  1. `<path d="M128 190 A68 68 0 0 1 264 190 Z" fill=#F2F0EC>` (sun)
  2. `<path d="M196 108 L196 92 M237 118.99 L245 105.13 M267.01 149 L280.87 141 M155 118.99 L147 105.13 M124.99 149 L111.13 141" fill=none stroke=#F2F0EC stroke-width=3.5 round>` (rays)
  3. `<path d="M-40 190 V170 C 0 158, 62 154, 104 161 C 134 166, 158 177, 176 190 Z" fill=#55524D>` (left hill — overlaps the sun's foot)
  4. `<path d="M432 190 V170 C 392 158, 330 154, 288 161 C 258 166, 234 177, 216 190 Z" fill=#55524D>` (right hill)
  5. `<rect x=-40 y=188.25 width=473 height=3.5 rx=1.75 fill=#F2F0EC>` (horizon)
  Art extends past the frame (x −63.6..456.7 after scaling) and is clipped by the frame; on wider
  phones centre the 393 box (`left: (W−393)/2`) so the horizon still spans the width.
  (Kit `heroSunrise(84)` and `H.sunrise` differ — **use the frame's paths and top 126**.)
- `stack(382, gap 8, center)`: `caps('Today')` centred 13/700 `#9B968E` (y 382, h 16); h1 "Day 0"
  **44**/700/−0.6/lh **50** centred (y 406).
- `stack(504, gap 18, center)`:
  - Lesson card (shrink-wraps, centred: 95,504,203.1×79): `radius 20; bg #1E1E1E; padding 18 20;
    column; gap 4; text-align left`; "Lesson 1" 13/700 `#9B968E` nowrap (y 522, h 16); "Prepare for
    tonight" 19/700 `#F2F0EC` (y 542, h 23).
  - p "Your first lesson is ready. Start with one thing today." 15/400/lh **22** `#B5B0A8` centred
    (y 601, one line at 393).
- `primary('Begin')` default `bottom 48` → 24,746,345×58.

**What must change.**
- Old: "Day 0" 22/500 at canvas 118, the sentence under it at 158, a 281-wide card at 236 whose top
  248pt is a painted night shore (moon, bench, lamp, phone, a "Today" sun chip) and a 54 pill at
  `bottom 84` → new: sunrise hero, "Today" caps + 44pt "Day 0", a small text-only lesson card, the
  sentence **below** the card, kit primary at `bottom 48`.
- Copy: `"Lesson I · Surviving the Night — seven minutes."` → two runs **"Lesson 1"** (Arabic
  numeral, no duration) and **"Prepare for tonight"** (lesson 1's new title in the rebuilt course,
  `Vici Overhaul/project/gen/lessons-v3.json`). Recommend `O3DayZero` take `{ number, title }` and
  `welcome.tsx` pass `lessonForDay(1)` from `src/content/curriculum84.ts` once the lesson group
  regenerates it (today it still says "Surviving the Night") — or the literal until then. See OQ 10.
- Remove the night-shore art, `LinearGradient`, the moon/lamp radial `<Svg>`s.

**Preserve.** `Begin` → `finish()` (all persistence, `completeOnboarding`, route to the morning
time board).

---

## 4. `Paywall Rescue` (FLOW `11B · Paywall — Three Days Free`)

**Where today.** `PaywallFlow.tsx` → `PwTrialOffer` (+ `OfferIcon`, `pwOffer(money)`, `PwX`,
`PwCTA`, `PwFloorGlow`, grain), shown when `offer` is true (first dismiss on PwMain while
`hasTrial`).

**Reach.** `/paywall`, `--do="await tap('Close'); await waitFor('No thanks')"` (recipe
`paywall.json`) — depends on OQ 1 for the trigger.

**What the frame draws** (`pr-d-resc.txt`):
- `nav(close, noBack)`: right slot holds kit `closeX` — `<svg 18×18 viewBox 0 0 18 18>` path
  `M2 2l14 14M16 2L2 16` stroke `#F2F0EC` 2 round cap (svg at 353,71). No disc.
- `stack(257)`: h1 "Before you go — three days on us." 26/700/−0.6/33, balance → `Before you go —` /
  `three days on us.` (24,257,345×66). Greedy wrap at 345 would put "three days" on line 1, so keep
  the explicit `\n` after the em dash (today's code already does, for any `trialDays`).
- `stack(367, gap 0)`: three timeline rows (`tRow`), each `display flex; gap 16`:
  - left column `width 22; column; align center; flex-shrink 0`: disc 22×22 `radius 11`;
    row 1 ("now") bg `#F2F0EC` + check 11×11 (stroke `#111111` 2.2); rows 2–3 bg `#1E1E1E` +
    `box-shadow 0 0 0 1.5px #F2F0EC` (outer ring), empty. Rows 1–2 continue with a connector
    `flex 1; border-left 2px dashed #5A574F; margin 6px 0` → **x 34..36, y 395..411 and 445..461**.
    Measured in the PNG: Chrome fits the dashes to the 16pt run as **dash 6 / gap 4 / dash 6**
    (395–401, 405–411). RN cannot dash a single side reliably on native → two 2×6 `#5A574F` Views
    per connector (or an `<Svg>` line with `strokeDasharray="6 4"`, positioned absolutely).
  - text `flex 1`, 16/lh 24 `#F2F0EC`, `padding-bottom 26` on rows 1–2 (row height 50), 0 on row 3
    (2 lines → 48); row 1 **700**, rows 2–3 **400**; no text-wrap → `wrap`.
    "Today — everything unlocks" / "Day 2 — a reminder, before any charge" / "Day 3 — $39.99/year
    begins, unless you cancel" (`…unless you` / `cancel`).
- `primary('Start free trial', bottom 96)`; `ghost('No thanks', bottom 60)`.

**What must change.**
- ✕: 34pt disc top-**left** (left 20, top 12 app) → plain 18pt ✕ top-**right** in the nav slot.
- Title 28/500/−0.2/36 at app top 104, `right: 60` → 26/700/−0.6/33 at canvas 257 (app 203),
  full 345.
- Rows: 44pt icon discs (lock / bell / card icons, `OfferIcon`) with a solid 2pt
  `rgba(0,0,0,0.12)` thread at a 96 pitch → the 22pt timeline above; text 15/500/21 → 16/24 with
  700 on the first row. `OfferIcon` retired.
- **Copy:** CTA `Start my ${trialDays} free days` → **"Start free trial"** (fixed). "No thanks"
  13.5/500 `#8B8882` at `bottom 56` → ghost 15/400 `#9B968E` at `bottom 60`.
- Remove grain 0.07 + `PwFloorGlow`; ground + noise.

**Preserve.** ✕ and "No thanks" → `onDone(false)` (closes `/paywall`; in the funnel advances to Day
0); "Start free trial" → `start('trial')` (mock: pay sheet with trial line; live: purchase yearly);
`trialDays` from the offering drives "Day N" rows, the price row, and the title's day word.

---

## 5. `Paywall Confirmed` (FLOW `11C · Paywall — Confirmed`)

**Where today.** `PaywallFlow.tsx` → `PwConfirmed({ plan, name, email, money, confirmLabel,
onDone })` (+ `PwConfirmedRidge`, `PwFloorGlow`, grain), shown when `done`.

**Reach.** `/paywall`, `--initseed=.overhaul/f-pw-confirmed-seed.js` (Sam / sam@hey.com, clock
21 Jul 2026 → "Jul 24"), `--script=.overhaul/drives/pw-confirmed-trial.js` (Close → `Start my 3 free
days` → pay sheet → "Confirm with Side Button"). The drive's CTA label must become
`Start free trial`.

**What the frame draws** (`pr-d-conf.txt`):
- `nav(noBack)` empty.
- Disc row `top 266`, centred: 132×132 `radius 66` bg `#F2F0EC`; check 56×56 (viewBox 0 0 14 14,
  stroke `#111111` 2.2 → 8.8 on screen, round) (disc at 130.5,266).
- `stack(436, gap 18, center)`: h1 "We’re in, Sam." 26/700/−0.6/33 centred (y 436); p "Let’s take
  the first ground. Nothing is charged until Jul 24 — cancelling is one tap in Settings." 15/24
  `#B5B0A8` centred, 2 lines (`…charged until` / `Jul 24 — cancelling…`; y 487).
- `primary('Begin', bottom 82)`.
- Footer `bottom 52`: "Receipt sent to sam@hey.com" 12/**700** `#9B968E` centred (y 785).

**What must change.**
- Remove ridge, gold rings, floor glow, grain; 84pt `#131313` disc with drop shadow and a 34pt
  `#F4F3F0` tick (24-unit path) → 132pt ink disc with the kit check at 56.
- Title: `We're in, ${name}.` (U+0027, 28/500) → **`We’re in, ${name}.`** (U+2019), 26/700/−0.6/33.
  Fallback without a name: `We’re in.`
- Line: all three variants `Let's …` → **`Let’s …`** (the old comment "105 sets its apostrophes as
  plain U+0027" no longer holds); 14.5/22 `#55534E` inset 56 → 15/24 `#B5B0A8` inset 24.
- CTA: default `confirmLabel = 'Begin Day I'` → **`'Begin'`** (no caller passes one); `bottom 96`
  → `bottom 82`.
- Footer: 12/400 `#8B8882` at `bottom 60` → 12/700 `#9B968E` at `bottom 52`.

**States not drawn.** Yearly purchase line ("…The whole campaign is yours until July 2027.") and
monthly line ("…The campaign is unlocked, month by month.") — same layout, curly apostrophes.

**Preserve.** "Begin" → `onDone(true)`; first name from the intake / account; receipt email (fallback
"your Apple ID"); trial end date computed from `trialDays` (`fmtShort`).

### 5a. The drawn Apple Pay sheet (`PwPaySheet`, mock only) — no frame
Imitates the iOS system sheet (light `#FCFCFE` card, `PW_SYS` system face, Apple logo, blue side-
button). No frame in the bundle draws it. See OQ 7.

---

## 6. `Manage Subscription` (FLOW `15 · Manage Subscription`)

**Where today.** `src/app/subscription.tsx` (`Row`, `GroupLabel`, `Card`, `ICON`, `STORE_NAME`).
Entry: Settings → "Manage subscription" (`(app)/settings.tsx:106`), `drop.tsx:105`, All.

**Reach.** `/subscription`, `--initseed=.overhaul/f-pw-sub-dated.js` (premium Sam, clock 10 Jul
2026 → "10 Jul 2027"), `wait 1800`.

**What the frame draws** (`pr-d-sub.txt`):
- `nav({ title: 'Subscription' })`: chevronL (12×20, `M10 2L2 10l8 8`, stroke `#F2F0EC` 2.2 round)
  at 22,70; centred title "Subscription" 13/700 `#9B968E` nowrap (159.9,72); right slot empty.
- `stack(136, gap 18)`:
  1. Membership `card` (r 24, bg `#1E1E1E`, padding 22; 24,136,345×149):
     - row `space-between, align flex-start`: left — "Yearly" 24/700/−0.5 `#F2F0EC` (h 29), then
       `marginTop 4` "$39.99 a year. Renews 10 Jul 2027" 14/400 `#B5B0A8` (y 191); right — "Active"
       pill `height 28; radius 14; bg #F2F0EC; padding 0 12`, 12/700 `#111111` (288.2,158,58.8×28).
     - `marginTop 20; paddingTop 16; borderTop 1px #2E2E2E`; row `space-between`, 15px: "Next
       charge" 400 `#9B968E`; "$39.99 on 10 Jul 2027" 700 `#F2F0EC` (y 245).
  2. spacer 10 · 3. `caps('Plan')` (y 331) · 4. `listRows` (r 22, bg `#1E1E1E`, `overflow hidden`;
     24,365,345×182): rows `height 60; padding 0 20; gap 12; space-between`, rows 2+ add
     `borderTop 1px #2E2E2E` **on top of** the 60 (CSS content-box → 61 tall); label 16/400
     `#F2F0EC` nowrap; right cluster `gap 10`: optional value 16/700 `#F2F0EC` + chevronR 14×14
     (`M5 2l5 5-5 5`, stroke `#9B968E` 2 round). Rows: "Change plan" · "Yearly"; "Redeem a code";
     "Restore purchases".
  5. spacer 10 · 6. `caps('Billing')` (y 593) · 7. `listRows` (24,627,345×121): "Payment method" ·
     "Apple ID"; "Receipts & invoices".
- `ghost('Cancel subscription', bottom 56)` → y 778.

**What must change.**
- Header: "‹ Back" (17/400 `#55534E`) + 27/600 left title at 68 → kit nav chevron + centred 13/700
  `#9B968E` "Subscription".
- Membership block: unboxed text → the card above. Copy: `` `${price}${cycle} · renews ${renews}` ``
  (`$39.99 / year · renews 10 Jul 2027`) → **`$39.99 a year. Renews 10 Jul 2027`**. Pill 12.5/600
  `#F4F3F0` on `#131313` → 12/700 `#111111` on `#F2F0EC`, `height 28`. Next-charge row 14 → 15,
  value 500 → 700, rule `rgba(0,0,0,0.09)` → `#2E2E2E`, spacing 18/14 → `marginTop 20 / paddingTop 16`.
- Group labels: 12.5/600 `#8B8882` at left 28 → caps 13/700 `#9B968E` at left 24 (in the stack).
- Rows: white hairline cards with 32pt icon chips (`ICON.*`) and 15/500 labels → kit `listRows`
  with **no icons**; detail `${planName} · ${price}` (13.5/400 grey) → value **`Yearly`** only (16/700
  ink). `ICON` retired. Chevron 7×12 `rgba(0,0,0,0.28)` → kit chevronR 14 `#9B968E`.
- Cancel: 15/500 `#8B8882` at fixed top 658 → ghost 15/400 `#9B968E` at `bottom 56`. The page
  must scroll on short phones (today: `contentContainerStyle={{ height: 700 }}`).

**States not drawn** (keep, restyle): free account ("Free tools" / "Core tools included" / pill
"Free", no next-charge row, no cancel line); lifetime (`${price} · billed once`, no next charge);
cancelled-but-active (`runs until`, no next charge); monthly. Proposed wording in the new sentence
style — OQ 6.

**Preserve.** CustomerInfo-driven plan/price/renewal (`membership`, `planFor`), Change plan →
`/paywall`, Redeem a code → `presentCodeRedemption` → Customer Center → store settings, Restore →
`restore()` + Alerts, Payment method / Receipts / Cancel → `presentCustomerCenter` →
`manageSubscriptions` (D-092), `STORE_NAME` mapping, Back → `router.back()` or Settings.

---

## 7. `Morning Check-in Time` / `Nightly Check-in Time` (FLOW `19B` / `19C`)

**Where today.** `src/app/routines/morning-time.tsx`, `src/app/routines/night-time.tsx`, built from
`src/components/routines/kit.tsx` (`RoutineShell`, `RoutineBack`, `RoutineCTA`, `CheckinPicker`,
day store `useCheckinDays`/`saveCheckinDays`) and `src/components/routines/wheel.tsx` (`TimeWheel`,
`Column`). Times in `src/lib/routines.ts` (`DEFAULT_ROUTINES`, `useRoutines`, `useSaveRoutines`).
Entry: end of onboarding (`finish()` → morning → night → `/today`), Settings rows
(`?from=settings`), All.

**Reach.** `/routines/morning-time`, `/routines/night-time`, `--initseed=.overhaul/v-premium-seed.js`,
`wait 1800`. Morning: the frame now parks on **8:00 AM**; `DEFAULT_ROUTINES.morning` is 7:00 AM, so
either change the default (OQ 2) or seed `tideline.routines.v2` with 8:00 AM. Night: default 10:30
PM = the frame.

**What the frames draw** (`pr-d-morning.txt`; Nightly identical but for values):
- `nav({})`: chevronL only at 22,70 (no "Back" word); right slot empty.
- `stack(136, gap 18)`:
  1. h1 26/700/−0.6/33 left: "When should the morning check-in come?" / "When should the nightly
     check-in come?" — balance breaks after **"the"** (`When should the` / `morning check-in
     come?`). Greedy wrap at 345 would keep "morning"/"nightly" on line 1, and the copy is fixed →
     write `'When should the\nmorning check-in come?'` / `'When should the\nnightly check-in come?'`.
     (24,136,345×66)
  2. spacer 6 · 3. `caps('Select time')` 13/700 `#9B968E` left (y 244)
  4. **time picker** (bespoke `timePicker` in `mono-core.js`): box `position relative; height 220;
     justify center` (24,278,345×220).
     - band: `position absolute; left 40; right 40; top 88; height 44; radius 14; bg #1E1E1E` →
       x 64..329, y 366..410.
     - columns row `position relative; display flex; gap 12`, centred: hour col **70** wide, colon
       col, minute col **70**, AM/PM col **60** → x 74.5 / colon 156.5 (8 wide) / 176.5 / 258.5.
     - each column = 5 rows × `height 44`, centred text: offset 0 → **30/900 `#F2F0EC`**; ±1 →
       22/400 `#9B968E`; ±2 → 22/400 `#2E2E2E`.
     - colon column: `height 220; align center`, ":" 30/700 `#F2F0EC`.
     - Morning: hours 6,7,[**8**],9,10 · minutes 58,59,[**00**],01,02 · period '', '', [**AM**], PM, ''.
     - Nightly: hours 8,9,[**10**],11,12 · minutes 28,29,[**30**],31,32 · period '', AM, [**PM**], '', ''.
     - Both period columns are now **consistent with a real 2-item wheel** (AM above PM, selection
       in the band) and both hour runs are real sequences — **D120/D154 no longer apply**; draw the
       wheel straight.
  5. spacer 6 · 6. `caps('Select days')` (y 540)
  7. day toggles: `display flex; justify space-between` across 345, seven 42×42 `radius 21` discs,
     14/700: on = bg `#F2F0EC`, text `#111111` (both frames draw all seven on: Su M Tu W Th F Sa at
     x 24, 74.5, 125, 175.5, 226, 276.5, 327; y 574).
- `primary('Save time')` default `bottom 48` → 24,746,345×58.

**What must change.**
- `RoutineBack`: chevron 11×19 `#55534E` + "Back"/"Settings" 17/400 → kit chevronL 12×20 `#F2F0EC`
  at nav slot (22,70), no word. **`Settings Check-in Time` (group `settings`) is now byte-identical
  to `Nightly Check-in Time`**, so the `?from=settings` variant loses both its "Settings" label and
  its reassurance `note` ("Set it for the start of your riskiest hours — you can change this any
  time.") — remove `backLabel`/`note` from `RoutineShell`; keep the `from=settings` *navigation*.
- Title: centred 22/500 `#1D1C1A` in a 76 block → left h1 at 136 with explicit `\n`.
- Section labels: centred 14.5/600 `#2A2924` → left caps 13/700 `#9B968E`.
- Wheel (`wheel.tsx`) rebuilt: 7-row perspective stack (30/22/21/20 on 44/29 leading, 36.5 snap
  interval with re-centring nudges, `STEPS` greys, translucent `rgba(0,0,0,0.08)` band r11 at
  46..347, no colon, columns 40/50/60 padded from x 105) → **5 rows on a flat 44 pitch, snap 44**,
  the three-step palette above, band `#1E1E1E` r14 at 64..329, a static ":" column, column widths
  70/70/60 with gap 12, centred cluster (74.5..318.5). AM/PM column: non-looping, two values with 2
  blank rows of padding either side (as drawn). Hours/minutes keep looping.
- Day chips: 38pt `#131313`/`#EFEEEA` inside `paddingHorizontal 34`, 14/600 → 42pt across the full
  345 (space-between), 14/700, on `#F2F0EC`/`#111111`, **off (not drawn) = kit `dayToggles`: bg
  `#1E1E1E`, text `#F2F0EC`**.
- CTA: 361×48 r25 17.5/600 at fixed spacing → kit primary 345×58 r29 16/700/0.1 at `bottom 48`
  (remove the 46/60 spacer arithmetic).

**Preserve.** Wheel scrolling/snap/loop + web idle-settle (D065), accessibility (`adjustable`,
label, value), stored-time hydration (draft stays null until touched), day toggles
(`accessibilityRole="checkbox"`, day names), `Save time` → save time + days, then: onboarding →
night board → `replace('/today')`; Settings → `back()`. Back: `router.back()` or
`/(app)/settings` / `/(app)/today`.

---

## 8. App screens in this area that no frame draws

| screen / state | where | closest frame analog | notes |
| --- | --- | --- | --- |
| `/reminders` (Settings → All → Reminders) | `src/app/reminders.tsx` | **Reminders Setup** | Same two notes (already D099-aligned; fix `where's` → `where’s`). Needs a way back: kit nav **chevronL** (it is a pushed sub-page). Headline/sub ("Two reminders a day." / "Timed to your risky window. Nothing noisy, nothing shaming.") are unauthored — OQ 4. "Turn on reminders" writes `morningCheckin`/`riskTimeSupport` and goes back. Add "Not now" ghost → back for parity, or omit (it has Back). |
| `/notify-primer` | `src/app/notify-primer.tsx` | **Reminders Setup** with kit nav **close** (it has a ✕ today) | Still carries the **retired** note copy ("10:41 PM", "Your risky window. The wave tool is one tap away.") that D099 removed from `/reminders` — should take Reminders Setup's two notes. Has a 9-dash progress strip, a lock + "Discreet by default. Nothing names the habit." line, `colors.*`-driven paper styling, ScrollView. |
| Paywall — Monthly chosen | `PwMain` | Paywall | palettes inverted (§2). |
| Paywall — no trial available (`hasTrial` false) | `PaywallFlow.decline` | Paywall | dismiss closes immediately, no rescue. |
| Drawn Apple Pay sheet (mock) | `PwPaySheet` | none | OQ 7. |
| Confirmed — yearly / monthly purchase lines | `PwConfirmed` | Paywall Confirmed | §5. |
| `OfferingPaywall` with 1 / 3+ packages, loading spinner | `OfferingPaywall.tsx` | Paywall | §2a, OQ 5. |
| `RevenueCatPaywall` placeholder | `RevenueCatPaywall.tsx` | ground | theme handles. |
| Subscription — free / lifetime / cancelled / monthly | `subscription.tsx` | Manage Subscription | OQ 6. |
| Time picker mid-scroll, days deselected | `wheel.tsx`, `kit.tsx` | Morning/Nightly | step colours by rounded distance; off chip per kit. |
| `/routines/night-time?from=settings` (= frame `Settings Check-in Time`, group `settings`) | same files | Nightly Check-in Time (identical) | §7. |
| store / restore Alerts | native `Alert.alert` | — | system UI, unchanged. |

---

## 9. Files

**Owned by this group (will be rewritten):**
- `src/components/paywall/PaywallFlow.tsx` (PwMain, PwTrialOffer, PwConfirmed, flow; retire
  PwBand, PwFloorGlow, PwConfirmedRidge, PwPromiseIcon, OfferIcon, PW_SERIF, PW_SMALL_X, PwX disc)
- `src/components/paywall/OfferingPaywall.tsx`
- `src/components/paywall/RevenueCatPaywall.tsx` (placeholder only)
- `src/app/paywall.tsx` (StatusBar light; comment)
- `src/app/subscription.tsx`
- `src/app/routines/morning-time.tsx`, `src/app/routines/night-time.tsx`
- `src/components/routines/kit.tsx`, `src/components/routines/wheel.tsx`
- `src/app/reminders.tsx`, `src/app/notify-primer.tsx` (unframed, this area)
- `O3Reminders` + `O3DayZero` — today inside `src/components/onboarding/handover.tsx`.
  **Recommend moving them to a new `src/components/onboarding/reminders.tsx`** owned by this group
  (the rest of handover.tsx — Letter, Vow, Medallion — belongs to group `tail`), with
  `welcome.tsx`'s import updated.

**Shared (conflict risk):**
- `src/app/(onboarding)/welcome.tsx` — groups `auth-funnel`/`tail` also edit it. This group needs
  only: the `O3Reminders`/`O3DayZero` import path, `O3DayZero`'s new props (`number`/`title` from
  `lessonForDay(1)`), nothing in the step list.
- `src/components/onboarding/handover.tsx` — group `tail` (only if the move above is not done).
- `src/lib/routines.ts` — `DEFAULT_ROUTINES.morning` 7:00 → 8:00 AM (OQ 2); read by Settings.
- `src/lib/purchases/metadata.ts` — docstring only (eyebrow default, benefits without `\n`).
- `src/components/routines/*` also render group `settings`'s `Settings Check-in Time`.
- `src/content/curriculum84.ts` (generated; lesson group) — only read (`lessonForDay(1).title`).
- Orchestrator-owned: `src/lib/theme.ts`, `src/components/mono/*`.

**Recipes to update** (`.overhaul/recipes/paywall.json`, `handover.json`, drives):
`pw-confirmed-trial.js` taps `Start my 3 free days` → `Start free trial`; `v-pw-dayzero.js` taps
`Skip` on the paywall (depends on OQ 1); Morning recipe needs an 8:00 AM seed if the default is not
changed; the Nightly recipe's D120 residue note is obsolete; `Settings Check-in Time` recipe's
"back label + reassurance line" note is obsolete.

---

## 10. Kit components this group needs (`src/components/mono/*`, orchestrator)

`Frame` (ground `#0D0D0D` + `noise.png` 0.05 tiled; light status bar; optional scroll-with-min-height
mode so bottom-anchored pills fall back to flow on short phones), `Nav` (back chevronL 12×20 /
`closeX` 18×18 / centred 13/700 title / empty slots; `top 60`, `h 40`, `padding 0 22`), `H1` (26/33
default; 34/40; 44/50; `center`; balance on web), `P` (15/24 default; 15/22; `center`; pretty),
`Caps` (13/700 `#9B968E`, nowrap), `Primary` (`bottom` 48/82/96), `Ghost` (`bottom` 56/60),
`Stack`, `Card` (r24 p22 / r20 p18·20), `ListRows` (60 + 1px top border rows, value + chevronR),
`Hero`/`svgWrap` (393×240, `scale 1.1` about 196,190, overflow room, absolute-positioned `<Svg>`),
`Check` glyph (`M2 7.5l3.2 3L12 3.5` in a 14 viewBox at 11/12/14/56, stroke 2.2), `ChevronR` 14,
`CloseX` 18, `LaurelMark` (white tint, stretched), `Ring` (`box-shadow 0 0 0 1.5px`), `DayToggles`
(42 discs). Bespoke to this group (build locally unless the kit wants them): plan cards, feature
discs, notification card, rescue timeline + dashed connector, 132 confirm disc, `Active`/`Save 74%`
pills, the 5-row time wheel.

---

## 11. Open questions / contradictions

1. **The Paywall frame draws no way to dismiss it.** Old 48 had a ✕ (`Close` standalone, `Skip` in
   the funnel) that led to the one-time Rescue; the new frame's top-left is the brand lockup and the
   top-right is "Restore". Without a control the funnel cannot be skipped and `/paywall` cannot be
   closed on web (the rescue becomes unreachable). The control must stay (functionality). Options:
   **(A, recommended)** draw kit `closeX` in the nav's right slot — exactly where `Paywall Rescue`
   puts its ✕ (svg 353,71) so the ✕ does not move between the two boards — and keep Restore
   reachable through the footer's "Restore" (make that word tappable; the frame already prints
   Restore twice). Cost: the top-right "Restore" text is replaced by the ✕ on this one board.
   (B) keep "Restore" and add the ✕ to its left (e.g. right slot at 335..371, Restore shifted to
   end at ~x 327). (C) add a ghost "Not now" — no room: pill ends 770, footer 785..800. Record the
   choice as a D2xx.
2. **Morning default time.** `Morning Check-in Time` parks on **8:00 AM** and the new `Settings`
   frame's Morning row also says **8:00 AM** — the two frames that state it now agree, unlike D120's
   night case. Recommend `DEFAULT_ROUTINES.morning = { hour: 8, minute: 0, period: 'AM' }`.
3. **Night default.** `Nightly Check-in Time` / `Settings Check-in Time` park on **10:30 PM**,
   `Settings`' row says **9:30 PM** — still contradictory. Keep 10:30 PM (the wheel frames) and seed
   per frame as before.
4. **`/reminders` headline.** D099 kept "Two reminders a day." / "Timed to your risky window…".
   Keep (no frame authors it) or adopt Reminders Setup's title/sub? Also: `/notify-primer` still
   ships the retired "10:41 PM" / "wave tool" copy.
5. **OfferingPaywall with ≠ 2 packages.** The frame is two side-by-side cards. Recommend: 2 →
   exactly the frame; 1 → one full-width card; 3+ → a 2-column wrap with row gap ≥ 24 (the "Save"
   badge overhangs 12 above its card) inside the scroll; or a stacked full-width fallback. Needs a
   ruling.
6. **Subscription copy for undrawn states.** Proposed in the frame's sentence style: monthly
   "$12.99 a month. Renews 10 Aug 2026"; cancelled "$39.99 a year. Runs until 10 Jul 2027"; lifetime
   "$X, billed once."; free "Core tools included" + pill "Free" (same pill style or an outlined
   variant: `#1E1E1E`? — on a `#1E1E1E` card an outlined pill `0 0 0 1.5px #2E2E2E` with `#F2F0EC`
   text reads better). Change plan value when free: "Free".
7. **Drawn Apple Pay sheet** (mock only). It imitates an OS sheet in the system face — keep light +
   system font as an OS imitation (only reachable offline), or restyle in Lato/dark? The brief bans
   a bare `fontFamily: 'System'`; this is the one place it is deliberate.
8. **Generator vs frame** (frame wins in every case; listed so nobody "fixes" back to the kit):
   laurel `brightness(0)` (kit, would be black on black) vs `brightness(0) invert(1)` (frames);
   `VICI UNLIMITED` 12/700/ls 3 (kit) vs "VICI Unlimited" 14/700; `SAVE 74%` vs "Save 74%"; Yearly
   card text `#FFFFFF` on INK (kit) vs `#111111`; badge check `INK` on `#FFFFFF` (kit) vs `#F2F0EC`
   on `#1E1E1E`; Day-0 hero top 84 (kit) vs 126; bell 60 vs 90; Day-0 stacks 348/470 gap 14 vs
   382/504 gap 18; "Lesson I · Seven minutes" / "Surviving the Night" vs "Lesson 1" / "Prepare for
   tonight"; Confirmed `p` gap 14 vs 18, "Begin Day I" vs "Begin"; Rescue title top 140 vs 257, rows
   250 vs 367, "Start my 3 free days" vs "Start free trial"; Subscription "/ year · renews" vs "a
   year. Renews", "Active" `#FFFFFF` vs `#111111`; time wheel/day-chip on-text `#FFFFFF` vs `#111111`;
   kit `noise-dark.png` 0.06 vs frames `noise.png` 0.05.
9. **Footer "Terms · Restore"** is drawn as text; today neither word does anything. With OQ 1 (A)
   "Restore" must become tappable; "Terms" has no destination in the app (leave inert or link the
   terms URL if one exists).
10. **Day-0 lesson title source.** "Prepare for tonight" is lesson 1's title in the rebuilt course;
    `curriculum84.ts` still says "Surviving the Night" until the lesson group regenerates it. Wire
    to `lessonForDay(1)` (and accept a transient mismatch) or hard-code the frame's string.
11. **Rescue with `trialDays ≠ 3`.** The CTA is now the fixed "Start free trial" (good), but the
    title's "three days" and rows "Day 2/Day 3" still derive from `trialDays` — keep that.

## 12. Risks

- **SVG on web**: both heroes share a parent with absolutely positioned boxes → the `<Svg>` must be
  `position: absolute; top/left` (BRIEF) or it paints invisible while the sig passes. Scale via a
  `<G transform="translate(196 190) scale(1.1) translate(-196 -190)">`, never `rotation/origin`
  props. Look at the PNG.
- **Outer rings** (`0 0 0 1.5px`) on the Monthly card, its radio, the Save badge and the rescue
  discs must be `boxShadow` (outside the box), not borders, or the 22pt discs shrink to 19.
- **Inline price span**: "$39.99" + "/year" baseline-aligned in one line box of 26px normal leading
  (h 32) — nested `<Text>`; a sibling `View` row will misalign the baseline.
- **`pretty` on web** reflows the no-wrap runs listed in §0.
- **Wheel inside a ScrollView** (for short phones): nested vertical scrollers — on native the inner
  column wins the gesture only after a pause; consider keeping the board non-scrolling at ≥ 740pt
  and scrolling only below that, and test on 375 × 667.
- **Funnel drives** (`handover-walk.js`, `v-pw-dayzero.js`) pass through screens other groups are
  rebuilding; their labels will drift.
- `welcome.tsx` / `handover.tsx` edits collide with groups `auth-funnel` and `tail`.
- The laurel will look "thin" if `contentFit="contain"` is used (the canvas stretches 280×252 to a
  square).
- `PwPaySheet` relies on `PressScale` text lookup in `pw-confirmed-trial.js` ("Confirm with Side
  Button") — keep that string if the sheet is restyled.
