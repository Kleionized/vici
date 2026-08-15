# Pass 1 · second reader · Lesson Card template

Frames: `.uifinal/pretty/final/Lessons and Tasks/Lesson-01.html`, `Lesson-02.html`, `Lesson-82.html`
(raw counterparts under `.uifinal/final/Lessons and Tasks/` — checked for the grain layer, see G-1).
App: `/Users/admin/Documents/tideline/src/app/lesson-card/[day].tsx` (128 lines, read in full).
Data: `/Users/admin/Documents/tideline/src/content/curriculum84.ts` (generated).

## Coordinate note — read before the tables

All three frames are 393 × 852. The status bar occupies **0 → 54**. Everything below it lives
inside **one nested sheet**:

```
position:absolute; left:0; right:0; top:52px; bottom:0;
border-radius:24px 24px 0 0; background:#F4F3F0; overflow:hidden;
```

Every content `top` in these frames is therefore **sheet-relative**, not frame-absolute.
For a sheet-relative value `Y`:

* frame-absolute canvas top = `Y + 52`
* strict app top (canvas − 54) = `Y − 2`
* **repo convention** (stated verbatim in `src/app/drop.tsx:22-23` — "Canvas tops inside the
  sheet are the sheet's own (its top edge is canvas y 52)" — and in `src/app/relapse.tsx:93`
  — "canvas top:52 against a 54pt bar — the sheet crests 2pt above the status bar's baseline")
  is to use `Y` **directly**. The 2pt crest is deliberate.

Design values below are given as `sheet Y (canvas Y+52 / app Y)`. `Y` is the expected app number.

`bottom`-anchored values are the frame's own and pass through unchanged (root layout
`CANVAS_INSETS` sets `bottom: 0` on purpose).

---

## A · Screen shell

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| 01/02/82 | Frame | width × height | 393 × 852 | device | match |
| 01/02/82 | Frame | background (behind sheet) | `#EDECE7` | none — root `View` is `#F4F3F0` edge to edge (line 37) | MISMATCH |
| 01/02/82 | Frame | font-family | `-apple-system, 'SF Pro Text', system-ui, 'Helvetica Neue', sans-serif` | `sans()` → `sansFamily[w]` (system) | match |
| 01/02/82 | Frame | -webkit-font-smoothing | antialiased | set globally in `src/app/_layout.tsx` + `AppText` | match |
| 01/02/82 | Frame | overflow | hidden | n/a on device | match |
| 01/02/82 | Sheet | top | 52 (canvas 52) | not built — no sheet element | MISMATCH |
| 01/02/82 | Sheet | left / right / bottom | 0 / 0 / 0 | full bleed | match |
| 01/02/82 | Sheet | border-radius per corner | TL 24, TR 24, BR 0, BL 0 | none — flat full-screen push (`lesson-card` has no `Stack.Screen` entry and no `_layout.tsx`, so it is a card push, not `presentation:'modal'`) | MISMATCH |
| 01/02/82 | Sheet | background | `#F4F3F0` | `#F4F3F0` (line 37) | match |
| 01/02/82 | Sheet | overflow | hidden | n/a | match |
| 01/02/82 | Screen | grain / noise overlay | **absent** — raw `Lesson-01.html`, `Lesson-02.html`, `Lesson-82.html` contain zero `noise` references (compare `Task-D01-Intro.html`, which does draw `noise-dark.png @ opacity 0.07`) | `<Grain source={noiseDark} opacity={0.07} />` (line 39) | MISMATCH |
| 01/02/82 | Status bar | height / clock / glyphs | 54 tall, 9:41 17/600 `#1D1C1A` ls −0.2, 3 SVG glyphs gap 7 | OS bar, `StatusBar style="dark"` (line 38) | match (deck chrome) |
| 01/02/82 | Safe area | edges | canvas bottom values are measured from the frame's own 852 edge | `edges={['top','bottom']}` (line 41) — bottom inset (34 on device) is added *on top of* the canvas `bottom` | MISMATCH |

`lesson-card/[day].tsx` is the **only** file in `src/app` that combines `edges={['top','bottom']}`
with absolute `bottom:` values taken straight off the canvas; the other 16 files using both edges
anchor from the top. The root layout comment (`src/app/_layout.tsx`) states the rule explicitly.

## B · Close cross (sheet child 1)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| 01/02/82 | Close SVG | right | 22 | 22 (line 48) | match |
| 01/02/82 | Close SVG | top | sheet 24 (canvas 76 / app 24) | 24 (line 48) | match |
| 01/02/82 | Close SVG | width × height | 20 × 20 | 20 × 20 (line 49) | match |
| 01/02/82 | Close SVG | viewBox | `0 0 20 20` | `0 0 20 20` (line 49) | match |
| 01/02/82 | Close path | `d` | `M3 3l14 14M17 3L3 17` | `M3 3l14 14M17 3L3 17` (line 50) | match |
| 01/02/82 | Close path | stroke | `#55534E` | `#55534E` | match |
| 01/02/82 | Close path | stroke-width | 2 | 2 | match |
| 01/02/82 | Close path | stroke-linecap | round | round | match |
| 01/02/82 | Close path | fill | (none stated → SVG default `none` here, path is open) | `fill="none"` on `<Svg>` | match |
| 01/02/82 | Close | z-order | drawn first inside sheet, above the field | `zIndex: 5` | match |
| 01/02/82 | Close | drawn state | single state, no press/hover | `PressScale`, hitSlop 16 all sides | match (affordance, not drawn) |

## C · Seven-dot rail (sheet child 2)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| 01/02/82 | Rail | left / right | 0 / 0 | 0 / 0 (line 55) | match |
| 01/02/82 | Rail | top | sheet 28 (canvas 80 / app 28) | 28 (line 55) | match |
| 01/02/82 | Rail | display / direction | flex, row | `flexDirection:'row'` | match |
| 01/02/82 | Rail | justify-content | center | center | match |
| 01/02/82 | Rail | align-items | center | center | match |
| 01/02/82 | Rail | gap | 7 | 7 | match |
| 01/02/82 | Rail | dot count | 7 | `week.lessons.length` = 7 for all 12 weeks (verified) | match |
| 01 | Active dot | index | 0 (1st) | `indexInWeek` for day 1 = 0 | match |
| 02 | Active dot | index | 1 (2nd) | day 2 → 1 | match |
| 82 | Active dot | index | 4 (5th) | week 12 = days 78-84, day 82 → 4 | match |
| 01/02/82 | Active dot | width × height | 18 × 6 | 18 × 6 (lines 60-61) | match |
| 01/02/82 | Active dot | border-radius | 3 | 3 | match |
| 01/02/82 | Active dot | background | `#131313` | `#131313` | match |
| 01/02/82 | Idle dot | width × height | 6 × 6 | 6 × 6 | match |
| 01/02/82 | Idle dot | border-radius | 3 | 3 | match |
| 01/02/82 | Idle dot | background | `rgba(19,19,19,0.18)` | `rgba(19,19,19,0.18)` | match |

## D · Eyebrow (sheet child 3)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| 01/02/82 | Eyebrow | left / right | 0 / 0 | 0 / 0 (line 72) | match |
| 01/02/82 | Eyebrow | top | sheet 64 (canvas 116 / app 64) | 64 (line 72) | match |
| 01/02/82 | Eyebrow | text-align | center | `center` prop → `textAlign:'center'` | match |
| 01/02/82 | Eyebrow | font-size | 11 | 11 | match |
| 01/02/82 | Eyebrow | font-weight | 600 | `sans('600')` | match |
| 01/02/82 | Eyebrow | letter-spacing | 1.4 | 1.4 | match |
| 01/02/82 | Eyebrow | line-height | not stated → normal | none (AppText drops the inherited variant leading when the caller names a size) | match |
| 01/02/82 | Eyebrow | color | `#B0AEA8` | `#B0AEA8` | match |
| 01 | Eyebrow | text | `LESSON 01 · WEEK I` | `LESSON 01 · WEEK I` (zero-padded, U+00B7) | match |
| 02 | Eyebrow | text | `LESSON 02 · WEEK I` | `LESSON 02 · WEEK I` | match |
| 82 | Eyebrow | text | `LESSON 82 · WEEK XII` | `LESSON 82 · WEEK XII` (roman map verified I–XII) | match |
| 01/02/82 | Eyebrow | max lines | unconstrained, single line | unconstrained | match |

## E · Illustration plate (sheet child 4) — **absent from the app**

The frame draws a 240 × 200 plate between the eyebrow and the title. `[day].tsx` renders nothing
between line 74 (eyebrow) and line 77 (title). Every row in this section is MISMATCH.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| 01/02/82 | Art plate | left | 76 | — | MISMATCH |
| 01/02/82 | Art plate | top | sheet 150 (canvas 202 / app 150) | — | MISMATCH |
| 01/02/82 | Art plate | width × height | 240 × 200 | — | MISMATCH |
| 01/02/82 | Art clip | inset / overflow | `inset:0`, `overflow:hidden` | — | MISMATCH |

### E1 · Lesson-01 plate — 27 layers (all missing)

| # | left | top | w × h | radius | paint / effect |
|---|---|---|---|---|---|
| 1 | −28 | 166 | 296 × 64 | `50% 50% 0 0 / 26px 26px 0 0` | `#EAE9E3` |
| 2 | 26 | 118 | 80 × 80 | 50% | `radial-gradient(closest-side, rgba(203,218,232,0.24), rgba(203,218,232,0) 76%)` + `blur(5px)` |
| 3 | 44 | 16 | 58 × 72 | 6 | `linear-gradient(180deg,#12151B 0%,#1A2027 100%)`; shadow `0 0 0 6px #E4E3DE, 0 5px 12px rgba(40,38,32,0.14)` |
| 4 | 71 | 16 | 4 × 72 | — | `#E4E3DE` |
| 5 | 37 | 88 | 72 × 7 | 3 | `#D6D5D0` |
| 6 | 82 | 28 | 13 × 13 | 50% | `#DCDED8`; shadow `0 0 10px rgba(220,222,216,0.6)` |
| 7 | 54 | 50 | 2.5 × 2.5 | 50% | `rgba(244,243,240,0.6)` |
| 8 | 62 | 68 | 2 × 2 | 50% | `rgba(244,243,240,0.4)` |
| 9 | 53 | 167 | 50 × 11 | 50% | `rgba(0,0,0,0.08)` + `blur(5px)` |
| 10 | 56 | 136 | 44 × 28 | 5 | `#E4E3DE` |
| 11 | 65 | 145 | 26 × 4 | 2 | `#B4B1AB` |
| 12 | 60 | 164 | 5 × 6 | — | `#C6C5C0` |
| 13 | 91 | 164 | 5 × 6 | — | `#C6C5C0` |
| 14 | 62 | 98 | 32 × 32 | 50% | `radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)` + `blur(5px)` |
| 15 | 67 | 100 | 22 × 15 | `8 8 3 3` | `#E9D2A4` |
| 16 | 76.5 | 115 | 3 × 16 | — | `#C6C5C0` |
| 17 | 70 | 131 | 16 × 5 | 2.5 | `#C6C5C0` |
| 18 | 115 | 167 | 118 × 11 | 50% | `rgba(0,0,0,0.09)` + `blur(5px)` |
| 19 | 114 | 108 | 10 × 62 | `5 5 3 3` | `#D6D5D0` |
| 20 | 122 | 138 | 104 × 24 | `6 10 5 5` | `#E0DFDA` |
| 21 | 156 | 136 | 70 × 26 | `12 12 5 4` | `#C9C8C1` |
| 22 | 162 | 142 | 56 × 4 | 2 | `rgba(255,255,255,0.55)` |
| 23 | 126 | 129 | 28 × 14 | `7 7 5 5` | `#FFFFFF`; shadow `inset 0 -2.5px 0 #D6D5D0, 0 1.5px 3px rgba(40,38,32,0.14)` |
| 24 | 124 | 162 | 6 × 8 | `0 0 2 2` | `#C6C5C0` |
| 25 | 216 | 162 | 6 × 8 | `0 0 2 2` | `#C6C5C0` |
| 26 | 212 | 40 | 2 × 2 | 50% | `rgba(200,225,235,0.4)` |
| 27 | 198 | 68 | 2 × 2 | 50% | `rgba(200,225,235,0.3)` |

Layers 2, 9, 14, 18 use `filter: blur(5px)` → MISMATCH\* on RN; the substitute already used
elsewhere in this repo (`src/components/lesson/scenes.tsx`, `report-ready.tsx:127`) is an SVG
`RadialGradient` with matching falloff.

### E2 · Lesson-02 plate — 10 layers (all missing)

| # | left | top | w × h | radius | paint / effect |
|---|---|---|---|---|---|
| 1 | 66 | 22 | 108 × 108 | 50% | `radial-gradient(closest-side, rgba(226,186,120,0.5), rgba(226,186,120,0) 74%)` + `blur(5px)` |
| 2 | 96 | 52 | 48 × 48 | 50% | `#E9D2A4` |
| 3 | 164 | 52 | svg 16 × 8, viewBox `0 0 16 8` | — | path `M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6`, fill none, stroke `#8A857C`, sw 1.6, linecap round |
| 4 | 64 | 44 | svg 13.6 × 6.8, viewBox `0 0 13.6 6.8` | — | path `M1 5.1 Q3.8249999999999997 1.275 6.8 4.25 Q9.775 1.275 12.75 5.1`, fill none, stroke `#8A857C`, sw 1.6, linecap round |
| 5 | −70 | 118 | 250 × 112 | `50% 50% 0 0 / 52px 52px 0 0` | `#ECEBE5` |
| 6 | 70 | 128 | 250 × 102 | `50% 50% 0 0 / 48px 48px 0 0` | `#ECEBE5` |
| 7 | −40 | 146 | 330 × 84 | `50% 50% 0 0 / 40px 40px 0 0` | `#E2E1DB` |
| 8 | 58 | 160 | 12 × 3.5 | 2 | `rgba(255,255,255,0.65)` |
| 9 | 148 | 174 | 12 × 3.5 | 2 | `rgba(255,255,255,0.6)` |
| 10 | 100 | 186 | 12 × 3.5 | 2 | `rgba(255,255,255,0.5)` |

Layers 5–7 overflow the 240-wide plate on both sides and rely on the plate's `overflow:hidden`.

### E3 · Lesson-82 plate — 15 layers (all missing)

| # | left | top | w × h | radius | paint / effect |
|---|---|---|---|---|---|
| 1 | −28 | 172 | 296 × 58 | `50% 50% 0 0 / 24px 24px 0 0` | `#EAE9E3` |
| 2 | 55 | 158 | 130 × 11 | 50% | `rgba(0,0,0,0.1)` + `blur(5px)` |
| 3 | 52 | 142 | 136 × 8 | 4 | `#D6D5D0` |
| 4 | 60 | 150 | 6 × 14 | — | `#C6C5C0` |
| 5 | 174 | 150 | 6 × 14 | — | `#C6C5C0` |
| 6 | 62 | 96 | 13 × 46 | 2 | `#C6C5C0` |
| 7 | 78 | 90 | 15 × 52 | 2 | `#DEDDD7` |
| 8 | 86 | 70 | 36 × 36 | 50% | `radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)` + `blur(5px)` |
| 9 | 96 | 84 | 14 × 58 | 2 | `#E9D2A4`; shadow `inset 0 0 0 1.5px #E2BA78` |
| 10 | 100 | 94 | 6 × 3 | 1.5 | `#E2BA78` |
| 11 | 113 | 92 | 13 × 50 | 2 | `#D6D5D0` |
| 12 | 129 | 98 | 12 × 44 | 2 | `#6B6862` |
| 13 | 144 | 104 | 26 × 38 | 2 | `#DEDDD7`; `transform: rotate(12deg)`, `transform-origin: bottom right` |
| 14 | 196 | 70 | 2 × 2 | 50% | `rgba(200,225,235,0.4)` |
| 15 | 44 | 76 | 2 × 2 | 50% | `rgba(200,225,235,0.3)` |

Layer 13's `transform-origin: bottom right` is MISMATCH\* — RN rotates about the centre only;
the substitute is a pre-offset wrapper (translate by the origin delta, rotate, translate back).

## F · Title (sheet child 5)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| 01/02 | Title | top | sheet **392** (canvas 444 / app 392) | `392 − 54` = **338** (line 85) | **MISMATCH** |
| 82 | Title | top | sheet **396** (canvas 448 / app 396) | `396 − 54` = **342** (line 85) | **MISMATCH** |
| 01/02/82 | Title | left / right | 36 / 36 | 36 / 36 (lines 83-84) | match |
| 01/02 | Title | font-size | 23 | `lesson.titleSize` = 23 | match |
| 82 | Title | font-size | 20 | `lesson.titleSize` = 20 | match |
| 01/02 | Title | line-height | 30 | 30 | match |
| 82 | Title | line-height | 27 | 27 | match |
| 01/02/82 | Title | font-weight | 500 | `sans('500')` | match |
| 01/02/82 | Title | letter-spacing | 0.1 | 0.1 | match |
| 01/02/82 | Title | color | `#1D1C1A` | `#1D1C1A` | match |
| 01/02/82 | Title | text-align | center | `center` | match |
| 01/02/82 | Title | text-wrap | `balance` | AppText sets `textWrap:'pretty'` on web for variant `body`; nothing on native | MISMATCH\* — substitute: `variant="title"` (which emits `balance` on web) or an explicit line break; native has no equivalent |
| 01/02/82 | Title | max lines | unconstrained | unconstrained | match |
| 01 | Title | text | `Surviving the Night` | curriculum day 1 title identical | match |
| 02 | Title | text | `A New Start` | identical | match |
| 82 | Title | text | `Lessons From Addiction Recovery` | identical | match |
| — | Title | size-step rule | canvas steps long titles 23/30 → 20/27 and drops the block 392 → 396 | `titleSize` drives size, leading **and** top; only day 82 carries 20 in the generated data (83 × 23, 1 × 20) | match (rule), MISMATCH (the tops it feeds) |

## G · Summary line (sheet child 6)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| 01/02/82 | Summary | top | sheet **448** (canvas 500 / app 448) | `394` (line 96) | **MISMATCH** |
| 01/02/82 | Summary | left / right | 44 / 44 | 44 / 44 | match |
| 01/02/82 | Summary | font-size | 15.5 | 15.5 | match |
| 01/02/82 | Summary | line-height | 23 | 23 | match |
| 01/02/82 | Summary | font-weight | 400 | `sans('400')` | match |
| 01/02/82 | Summary | letter-spacing | not stated → 0 | none (AppText drops inherited tracking) | match |
| 01/02/82 | Summary | color | `#55534E` | `#55534E` | match |
| 01/02/82 | Summary | text-align | center | `center` | match |
| 01/02/82 | Summary | text-wrap | `pretty` | `pretty` on web, none native | match (web) / MISMATCH\* native — no substitute exists |
| 01 | Summary | text | `The first nights are the steepest. Get through tonight, nothing else.` | identical | match |
| 02 | Summary | text | `Day zero isn't a loss. It's the start of the count that matters.` (U+2019) | identical, U+2019 | match |
| 82 | Summary | text | `Borrow from the recovered: meetings, sponsors, service, honesty.` | identical | match |

The design gap eyebrow → title is **328** (64 → 392) and eyebrow → summary **384** (64 → 448).
The app draws **274** and **330**: the whole middle block is 54 high, matching the 54 subtracted
on lines 85 and 96 but not on lines 48, 55, 72.

## H · Primary CTA (sheet child 7)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| 01/02/82 | CTA | left / right | 24 / 24 | 24 / 24 (lines 105-106) | match |
| 01/02/82 | CTA | bottom | 88 | 88 (line 107) — but see A, the bottom safe-area edge adds 34 on device | match (value) |
| 01/02/82 | CTA | height | 54 | 54, `minHeight` 54 | match |
| 01/02/82 | CTA | border-radius | 27 (all four) | 27 | match |
| 01/02/82 | CTA | background | `#131313` | `#131313` | match |
| 01/02/82 | CTA | border | none | none | match |
| 01/02/82 | CTA | shadow | none | none | match |
| 01/02/82 | CTA | display / align / justify | flex, center, center | `alignItems:'center'`, `justifyContent:'center'` | match |
| 01/02/82 | CTA label | font-size | 17 | 17 (line 115) | match |
| 01/02/82 | CTA label | font-weight | 600 | `sans('600')` | match |
| 01/02/82 | CTA label | letter-spacing | 0.2 | 0.2 | match |
| 01/02/82 | CTA label | color | `#FFFFFF` | `#FFFFFF` | match |
| 01/02/82 | CTA label | text | `Start lesson` | `Start lesson` | match |
| 01/02/82 | CTA | drawn states | one (`cursor:pointer`, no pressed state drawn) | `PressScale` | match |

## I · Back link (sheet child 8)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| 01/02/82 | Back link | left / right | 0 / 0 | 0 / 0 (line 122) | match |
| 01/02/82 | Back link | bottom | 44 | 44 (line 122) — same bottom-inset caveat as H | match (value) |
| 01/02/82 | Back link | text-align | center | `alignItems:'center'` on the wrapper | match |
| 01/02/82 | Back link | font-size | 15 | 15 (line 123) | match |
| 01/02/82 | Back link | font-weight | 500 | `sans('500')` | match |
| 01/02/82 | Back link | letter-spacing | not stated → 0 | none | match |
| 01/02/82 | Back link | color | `#8B8882` | `#8B8882` | match |
| 01 / 02 | Back link | text | `Back to Week I` | `Back to Week I` | match |
| 82 | Back link | text | `Back to Week XII` | `Back to Week XII` | match |

## J · Z-order

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| 01/02/82 | Sheet children | paint order | close → dots → eyebrow → art → title → summary → CTA → back | close (`zIndex:5`) → dots → eyebrow → **(art missing)** → title → summary → CTA → back | MISMATCH (art) |
| 01/02/82 | Status bar | z-index | 20, above the sheet | OS bar | match |

---

## Findings

1. **`src/app/lesson-card/[day].tsx:85` — title top.** Current `(lesson.titleSize === 20 ? 396 : 392) - 54` → **338** (23px titles) / **342** (20px title). Design is sheet-relative **392 / 396** (canvas 444 / 448). The `- 54` is applied to a number that is already sheet-relative; every other top on this screen (lines 48, 55, 72) uses the sheet value raw. The title sits 54pt too high on all 84 lessons.

2. **`src/app/lesson-card/[day].tsx:96` — summary top.** Current `394`. Design is sheet-relative **448** (canvas 500). Same 54pt error; the summary sits 54pt too high on all 84 lessons.

3. **`src/app/lesson-card/[day].tsx:74-77` — illustration plate missing entirely.** Design draws a 240 × 200 plate at sheet `left:76, top:150` (canvas 202) with `overflow:hidden`, carrying 27 layers on Lesson-01, 10 on Lesson-02, 15 on Lesson-82 (full transcriptions in §E1–E3). The app renders nothing between the eyebrow and the title. Blurred layers are MISMATCH\* (RN has no `filter: blur`) — substitute an SVG `RadialGradient` with the same falloff, as `src/components/lesson/scenes.tsx` already does; Lesson-82 layer 13's `transform-origin: bottom right` is MISMATCH\* — substitute a translate/rotate/translate wrapper.

4. **`src/app/lesson-card/[day].tsx:37` + route registration — sheet chrome missing.** Design puts the screen on a sheet at canvas `top:52` with `border-radius: 24px 24px 0 0` over a `#EDECE7` backdrop. The app paints `#F4F3F0` edge to edge and registers no `presentation:'modal'` for `lesson-card` (no `Stack.Screen` entry in `src/app/_layout.tsx`, no `src/app/lesson-card/_layout.tsx`), so it pushes as a flat card with square corners and no backdrop.

5. **`src/app/lesson-card/[day].tsx:41` — `edges={['top','bottom']}`.** Design's `bottom:88` (CTA) and `bottom:44` (back link) are measured from the frame's own 852 edge. With the bottom safe-area edge enabled, a device's 34pt inset is added, lifting both to an effective 122 / 78. This is the only file in `src/app` that pairs `['top','bottom']` with canvas `bottom:` values; the root layout comment in `src/app/_layout.tsx` states the rule. Design value: `edges={['top']}`.

6. **`src/app/lesson-card/[day].tsx:39` — grain overlay not in the design.** Current `<Grain source={noiseDark} opacity={0.07} />`. Raw `Lesson-01.html`, `Lesson-02.html` and `Lesson-82.html` contain no noise layer at all (0 occurrences of `noise`), unlike the Task frames in the same bundle which do draw `noise-dark.png @ 0.07`. Design value: no grain.

7. **`src/app/lesson-card/[day].tsx:77-93` — title `text-wrap: balance`.** MISMATCH\*. The frame sets `text-wrap:balance` on the title (and `pretty` on the summary). `AppText` emits `pretty` for its default `body` variant on web and nothing on native, so the title never balances. Substitute: `variant="title"` (its web branch emits `balance`) or an explicit break; native RN has no equivalent.
