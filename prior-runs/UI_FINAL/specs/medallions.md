# Medallions · Still To Earn · Medallion Received — pixel spec

## Header

| Field | Value |
| --- | --- |
| Sticky-note number | The bundle carries none (`data-screen-label` only). The app files number themselves: `022–023 · Medallions` (milestones.tsx), `110 → 173` (medallion-post.tsx). Numbers below are quoted from the app, not the canvas. |
| Frame labels | `Medallions`, `Medallions Still To Earn`, `Medallion Received` |
| Final frames | `.uifinal/pretty/final/Email Login/Medallions.html` (960 lines)<br>`.uifinal/pretty/final/Email Login/Medallions-Still-To-Earn.html` (819 lines)<br>`.uifinal/pretty/final/Email Login/Medallion-Received.html` (274 lines) |
| Prev frames | `.uifinal/pretty/prev/Email Login/<same names>` — all three changed |
| Diffs | `.uifinal/diffs/Medallions.html.diff`, `Medallions-Still-To-Earn.html.diff`, `Medallion-Received.html.diff` |
| Target app files | `/Users/admin/Documents/tideline/src/app/(app)/milestones.tsx`<br>`/Users/admin/Documents/tideline/src/app/medallion-post.tsx`<br>`/Users/admin/Documents/tideline/src/components/keepsakes/Medallion.tsx`<br>(secondary, shared) `/Users/admin/Documents/tideline/src/app/letter.tsx` → `MailArrival`, `LaurelStrike` |
| Frame box | 393 × 852, `overflow:hidden`, `flex-shrink:0`, frame shadow `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` (chrome of the board, not the app) |
| Status bar | Canvas reserves 54px at the top. **App top = canvas top − 54** everywhere below; both numbers are stated. |
| Font stack | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif`, `-webkit-font-smoothing:antialiased` → app `sans(weight)` (System on iOS). One exception: the received medallion's numeral is `Georgia,'Times New Roman',serif` → `fonts.quote`. |

### What the diff changed (final vs prev)

**Medallions / Medallions Still To Earn** — identical edit applied to every grid row:

| Property | Prev | Final |
| --- | --- | --- |
| Row inset | `left:12px; right:12px` | `left:20px; right:20px` |
| Row gap | `gap:10px` | `gap:17px` |
| Row cross-align | `align-items:stretch` | *(removed)* |
| Card height | *(none — intrinsic)* | `height:168px` + `box-sizing:border-box` |
| Card padding | `14px 12px 12px` | `12px` (uniform) |
| Card main-axis | *(none — flex-start)* | `justify-content:center` |
| Row 2 top (Earned) | 458 | 475 |
| Row 3 top (Earned) | 626 | 660 |
| Row 2 top (Still) | 430 | 447 |
| Row 3 top (Still) | 598 | 632 |
| Lone-card basis | `flex:0 0 calc(50% - 5px)` | `flex:0 0 calc(50% - 8.5px)` |

Row 1 tops did not move (290 Earned / 262 Still). Nothing inside the coin changed.

**Medallion Received** — the screen was re-authored:

| Property | Prev | Final |
| --- | --- | --- |
| Field | `#F4F3F0` | `linear-gradient(180deg, #F6EEDD 0%, #F0E1C2 100%)` |
| Washes | grain first, then two washes: grey top ellipse (`rgba(180,170,150,…)`, `blur(5px)`, 130% × 300 at top −190) and warm bottom circle (`rgba(255,236,196,…)`, 520 × 520 at bottom −260) | one gold circle 340 × 340 at top 70 centred, **then** grain over it |
| Eyebrow | — | new: `MEDALLION EARNED`, top 100 |
| Art frame top | 160 | 140 |
| Title | top 472, 24px/500, lh 32, ls −0.1, `text-wrap:balance`, "You earned a medallion." | top 432, 27px/600, ls −0.2, no wrap hint, "Veni" |
| Tier chip | — | new white pill at top 476, "Tier I · The Vow" |
| Sub top | 522 | 530 |
| Sub copy | "Vici, tier II — five ridden. Each one shortens the next." | "You signed your name to twelve weeks. The campaign begins tonight." |

The 260 × 260 art (glow, contact shadow, 136 disc, engraved ring, laurel, numeral) and both buttons are byte-identical to prev.

---

## A. Frames 022 / 023 — Medallions (Earned) and Still to earn

The two frames are the same screen with the segment flipped. Everything from the
status bar down to the count line is shared; the Earned segment additionally
draws the progress rail, and its grid starts 28 lower.

### A1. Field and chrome

| Element | Property | Value | App top |
| --- | --- | --- | --- |
| Frame | background | `#F4F3F0` | — |
| Grain | position | `absolute; inset:0` | — |
| | image | `url('noise-dark.png')`, `opacity:0.07`, `pointer-events:none` | — |
| Status bar | box | `top:0; left:0; right:0; height:54px`, flex row, `align-items:center`, `justify-content:space-between`, `padding:6px 32px 0 46px`, `box-sizing:border-box`, `z-index:20` | not built |
| | clock | 17px / 600 / `#1D1C1A` / ls −0.2px | not built |
| Back chevron | box | `left:16px; top:64px`, flex row, `align-items:center`, `gap:9px` | **10** |
| | svg | `width=11 height=19 viewBox="0 0 11 19"` | |
| | stroke | `#55534E`, `stroke-width:2.4`, `linecap:round`, `linejoin:round`, `fill:none` | |
| Page dots | box | `right:20px; top:72px`, flex row, `gap:4.5px`, `z-index:6` | **18** |
| | each dot | `4.5 × 4.5`, `border-radius:50%`, `background:#55534E` | |
| Title | box | `left:16px; top:114px` | **60** |
| | type | 27px / 600 / ls −0.2px / `#1D1C1A`, text `Medallions` | |

Back chevron path (verbatim):

```
M9.5 1.5L2 9.5l7.5 8
```

### A2. Segmented control (both frames)

| Property | Value |
| --- | --- |
| Box | `left:16px; right:16px; top:168px` (**app 114**), `height:38px` |
| Radius | `19px` (full pill) |
| Background | `rgba(0,0,0,0.06)` |
| Layout | `display:flex`, `padding:3px`, `box-sizing:border-box` (no gap; two `flex:1` children) |
| Selected pill | `flex:1`, `border-radius:16px`, `background:#FFFFFF`, `box-shadow:0 1px 4px rgba(40,38,32,0.14), 0 0 0 0.5px rgba(0,0,0,0.04)`, flex centre both axes |
| Selected label | 14px / **600** / `#1D1C1A` |
| Unselected pill | `flex:1`, flex centre both axes, no background, no shadow |
| Unselected label | 14px / **500** / `#8B8882` |
| Order | `Earned` left, `Still to earn` right (Medallions selects left; Still-To-Earn selects right) |

### A3. Count line and progress rail

| Element | Property | Earned frame | Still-to-earn frame |
| --- | --- | --- | --- |
| Count line | box | `left:16px; top:230px` (**app 176**) | `left:16px; top:230px` (**app 176**) |
| | type | 13px / 600 / `#55534E` | 13px / 600 / `#55534E` |
| | text | `6 of 11 earned` | `5 left` |
| Rail | box | `left:16px; right:16px; top:256px` (**app 202**), `height:5px`, `border-radius:3px`, `overflow:hidden` | **absent** |
| | track | `rgba(0,0,0,0.12)` | — |
| | fill | `width:55%`, `height:100%`, `border-radius:3px`, `background:#131313` | — |

`55%` is the canvas's own rounding of 6/11 = 54.5454…%. The rule is the fraction,
not the literal 55.

### A4. Grid geometry

| Property | Value |
| --- | --- |
| Row box | `position:absolute; left:20px; right:20px` → row width **353** |
| Row layout | `display:flex; gap:17px` (no `align-items` — items are fixed-height) |
| Card width | two `flex:1` children over 353 with a 17 gap → **168** each |
| Card height | `height:168px` + `box-sizing:border-box` → the card is a **168 × 168 square** |
| Row tops — Earned | 290, 475, 660 (**app 236, 421, 606**) → stride **185**, vertical gap **185 − 168 = 17** |
| Row tops — Still | 262, 447, 632 (**app 208, 393, 578**) → same 185 stride, gap 17 |
| Lone card in a row | wrapper `flex:0 0 calc(50% - 8.5px)` = 176.5 − 8.5 = **168** (identical to a paired card), inner card `width:100%; height:168px` |
| Last row bottom | 660 + 168 = 828, i.e. the grid runs **under** the translucent tab bar (top 769) |

### A5. Card interior (identical on all 11 cards, both frames)

| Element | Property | Value |
| --- | --- | --- |
| Card | radius | `16px` all corners |
| | background | `#FFFFFF` |
| | border / shadow | none |
| | padding | `12px` all four sides |
| | layout | `display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px` |
| Coin mount | box | `68 × 68`, `border-radius:50%`, `overflow:hidden` |
| | rim | `box-shadow:0 0 0 1.5px rgba(0,0,0,0.2), 0 0 0 5px #FFFFFF, 0 0 0 6.5px rgba(0,0,0,0.16)` (three stacked spreads: 1.5 hairline, 5 white, 6.5 outer) |
| Text block | box | `text-align:center` (no width — shrinks to content) |
| Name | type | 14.5px / 500 / `line-height:1.3` (= **18.85**) / `#1D1C1A` |
| State line | box | `margin-top:4px` |
| | type | 12.5px / 600 / `#8B8882` |

Content height inside the card: 12 + 68 + 10 + 18.85 + 4 + ≈15 + 12 ≈ **140** in a
168 box — `justify-content:center` leaves ≈14 of slack top and bottom. This is why
the final frame added both `height:168px` and `justify-content:center`; an
intrinsic-height card is ~26 short.

### A6. The 11 cards, in canvas order

**Earned frame** (all six carry the low sun):

| # | Row/col | Name | State line | Sun box (%) | Sun in 100-units (cx, cy, r) |
| --- | --- | --- | --- | --- | --- |
| 1 | r1 c1 | Veni | `Day 0 · Jun 9` | left 16, top 6, 56 × 56 | 44, 34, 28 |
| 2 | r1 c2 | First light | `Jun 9` | left 16, top 6, 56 × 56 | 44, 34, 28 |
| 3 | r2 c1 | Vidi | `Tier II · Day VII` | right 6, top 34, 44 × 44 | 72, 56, 22 |
| 4 | r2 c2 | Vici | `Tier II · ×5` | left 24, top 4, 54 × 54 | 51, 31, 27 |
| 5 | r3 c1 | Storm weathered | `Jun 21` | left 26, top 2, 50 × 50 | 51, 27, 25 |
| 6 | r3 c2 | Never failed twice | `Tier I · ×1` | left 16, top 6, 56 × 56 | 44, 34, 28 |

**Still-to-earn frame** (no sun on any card):

| # | Row/col | Name | State line |
| --- | --- | --- | --- |
| 1 | r1 c1 | Letter sent | `Not yet · first ×1` |
| 2 | r1 c2 | Honest ink | `4 of 10` |
| 3 | r2 c1 | Steady study | `3 of 5` |
| 4 | r2 c2 | Ground taken | `Not yet` |
| 5 | r3 c1 (lone) | Let someone in | `Gold, once · not yet` |

The middot in every state line is `&middot;` (` · `), the multiplier is `&times;` (`×`).

> **Canvas contradiction.** *Letter sent* and *Ground taken* are both unearned,
> both tiered, both at count 0, and both have a first rung of ×1 — but one reads
> `Not yet · first ×1` and the other reads `Not yet`. Two readings are possible:
> (a) the long form is the rule and *Ground taken* is an abbreviation slip, or
> (b) the short form appears when the first rung is ×1 and therefore uninformative
> — which *Letter sent* immediately falsifies, since its first rung is also ×1.
> The evidence supports (a): the app's existing rule (`Not yet · first ${rung}`
> whenever the face is tiered) reproduces *Letter sent* exactly and only differs
> on the one card that contradicts itself. **Keep the app rule.** Do not special-case
> *Ground taken*.

### A7. Tab bar (both frames)

| Property | Value |
| --- | --- |
| Box | `left:0; right:0; top:769px; bottom:0` → **83 tall**, `z-index:14` |
| Background | `rgba(255,255,255,0.95)` (no blur, no hairline) |
| Item boxes | Home `left:48px; width:44px`; Log `left:170px; width:52px`; Library `left:288px; width:60px` — all `top:14px`, `text-align:center` → centres 70 / 196 / 318 |
| Glyph | `width=30 height=29 viewBox="0 0 24 26"`, `display:block; margin:0 auto` |
| Label | `margin-top:5px`, 13px / 500 — active `#2A2924`, inactive `#8B8882` |
| Active glyph fill | `#2A2924`; inactive `#C6C5C0` |

Home glyph (active):

```
M4.5 24 L4.5 10 Q4.5 2 12 2 Q19.5 2 19.5 10 L19.5 24 Z
```
plus `<circle cx="15.2" cy="14" r="1.7" fill="#FFFFFF" fill-opacity="0.92"/>`

Log glyph: `<rect x="4.5" y="2" width="15" height="22" rx="3" fill="#C6C5C0"/>` plus

```
M8.5 8.5h7M8.5 13h7M8.5 17.5h4.5
```
(`stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.95"`)

Library glyph: three rects `x=5 / 10.9 / 16.8`, `y=2.5`, `4.4 × 21`, `rx=1.8`, fill `#C6C5C0`.

---

## B. Visualization — the medallion disc

### B1. Coordinate system

The album face is a **68 × 68** box; every drawing inside it is expressed as a
percentage of that box or, for the SVG device, in a **`viewBox="0 0 100 100"`**
that fills it (`position:absolute; inset:0; width:100%; height:100%`). 1 unit =
0.68 device px. The disc is the full circle of the box (`border-radius:50%` +
`overflow:hidden` on the mount), i.e. centre (50, 50) radius 50.

Paint order, bottom to top:

1. **Stock** — `linear-gradient(180deg, #F1F0EB 0%, #ECEAE3 100%)` over `inset:0`.
2. **Sun** (earned faces only) — a `border-radius:50%` box with
   `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 75%)`.
   `closest-side` in a square box = half the box, so the box maps to a circle of
   centre (left + w/2, top + h/2) and radius w/2 in 100-units. Stops: offset 0 →
   `#E2BA78` @ 0.42; offset 0.75 → `#E2BA78` @ 0. See §A6 for the six placements.
3. **Dune 1** — box `left:-25%; right:-25%; top:64%; height:80%`,
   `border-radius:50% 50% 0 0 / 46% 46% 0 0`, fill `#DEDDD6`.
   Width 150, so rx = 75; height 80, so ry = 0.46 × 80 = 36.8; the arc springs at
   y = 64 + 36.8 = 100.8 and the box bottom is 144.
4. **Dune 2** — box `left:-45%; right:-15%; top:78%; height:80%`,
   `border-radius:50% 50% 0 0 / 40% 40% 0 0`, fill `#CFCEC7`.
   Width 160 → rx = 80; ry = 0.40 × 80 = 32; arc springs at y = 110, bottom 158.
5. **Device** — the per-face SVG, drawn last, never clipped by anything but the disc.

There is **no** metal wash, sheen, seat shading or inner hairline on paper — those
belong to the struck metals on the 024–028 detail frames, which these two frames
never show. Nothing is greyed, dimmed, locked or ghosted on the unearned segment:
the *only* difference between an earned and an unearned face is the sun.

### B2. Device paths — verbatim

Every gradient below is the same two-stop vertical ink
(`x1="0" y1="0" x2="0" y2="1"`, stop 0 `#4A4843` → stop 1 `#1D1C19`); the canvas
re-declares it per card under a different id (`cg2`, `cg5`, `cg4`, `nf1`, `ls1`,
`hi1`, `cg1b`, `gt1`, `lsi1`). The ground smudge is `rgba(40,38,32,0.14)` except
*Steady study*, which uses `rgba(40,38,32,0.10)`.

**Veni** — ellipse `cx=50 cy=68 rx=21 ry=3.5`, then:

```
M52 24 L52 50 L35 50 Z
```
(fill `#3A3934` — a flat grey, **not** the ink gradient)

```
M29 54 L73 54 Q69 64 51 64 Q33 64 29 54 Z
```
(fill ink gradient)

```
M34 56.5 L68 56.5
```
(`stroke="rgba(255,255,255,0.18)" stroke-width="2" stroke-linecap="round"`)

**First light** — no ground ellipse.

```
M28 58 L72 58
```
(`stroke="#8A857C" stroke-width="3" stroke-linecap="round"`)

```
M38 58 a12 12 0 0 1 24 0 Z
```
(fill `#E2BA78`)

```
M50 34 v-6 M35 41 l-4 -4 M65 41 l4 -4
```
(`stroke="#C99F5F" stroke-width="3" stroke-linecap="round"`)

**Vidi** — moon gradient `cm3` is diagonal (`x1=0 y1=0 x2=1 y2=1`), `#E6E5DE` → `#C3C2BB`.

- `<circle cx="40" cy="32" r="15" fill="url(#cm3)"/>`
- `<circle cx="48" cy="26" r="14" fill="#F1F0EB"/>` ← the crescent bite, drawn as a **stock-coloured overpaint**
- `<circle cx="34" cy="38" r="2.2" fill="#CFCEC7"/>`
- `<circle cx="41" cy="29" r="1.5" fill="#D6D5CE"/>`
- `<circle cx="66" cy="20" r="1.8" fill="#C7C6BF"/>`
- `<circle cx="24" cy="46" r="1.5" fill="#D2D1CA"/>`

**Vici** — ellipse `cx=48 cy=72 rx=16 ry=3`; staff `<rect x="44" y="22" width="4.5" height="48" rx="2.2" fill="#C4C3BC"/>`; banner:

```
M50 24 C57 21.5 61 25.5 69 24 L69 37 C61 38.5 57 34.5 50 40 Z
```

**Storm weathered** — ellipse `cx=50 cy=70 rx=14 ry=3`;
`<rect x="47" y="38" width="6" height="30" rx="3" fill="#C4C3BC"/>`;
`<rect x="40" y="24" width="20" height="14" rx="6" fill="url(#cg4)"/>`;
`<rect x="42" y="27" width="16" height="2.5" rx="1.2" fill="rgba(255,255,255,0.16)"/>`;
`<circle cx="50" cy="31" r="2.2" fill="#E2BA78"/>`

**Never failed twice** — ellipse `cx=50 cy=71 rx=18 ry=3`:

```
M30 44 L46 60 L70 30
```
(`stroke="url(#nf1)" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"`), then `<circle cx="71" cy="26" r="3" fill="#E2BA78"/>`

**Letter sent** — ellipse `cx=50 cy=71 rx=18 ry=3`;
`<rect x="30" y="34" width="40" height="29" rx="4" fill="url(#ls1)"/>`:

```
M33 38 L50 52 L67 38
```
(`stroke="#F1F0EB" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"`), then `<circle cx="50" cy="52" r="4" fill="#E2BA78"/>`

**Honest ink** — ellipse `cx=50 cy=71 rx=18 ry=3`:

```
M34 70 Q50 66 66 70
```
(`stroke="#8A857C" stroke-width="2.5" fill="none" stroke-linecap="round"`)

then `<g transform="rotate(-38 50 48)">` containing
`<rect x="46" y="26" width="9" height="34" rx="2" fill="url(#hi1)"/>`,

```
M46 60 L55 60 L50.5 70 Z
```
(fill `#8A857C`), and `<rect x="46" y="26" width="9" height="5" rx="2" fill="#E2BA78"/>`

**Steady study** — ellipse `cx=50 cy=77 rx=26 ry=4.5 fill="rgba(40,38,32,0.10)"`.
Sheet gradient `cp1b` is diagonal, `#FFFFFF` → `#EBEAE3`.

- `<g transform="rotate(-5 37 52)">`: `<rect x="21" y="33" width="30" height="40" rx="3.5" fill="url(#cp1b)"/>`, `<rect x="27" y="42" width="16" height="3" rx="1.5" fill="#DBDAD3"/>`, `<rect x="27" y="49" width="18" height="3" rx="1.5" fill="#E1E0D9"/>`
- `<g transform="rotate(3 64 52)">`: `<rect x="49" y="31" width="30" height="40" rx="3.5" fill="url(#cp1b)"/>`, `<rect x="55" y="40" width="15" height="3" rx="1.5" fill="#DBDAD3"/>`, `<rect x="55" y="47" width="17" height="3" rx="1.5" fill="#E1E0D9"/>`
- `<rect x="44" y="44" width="36" height="4.5" rx="2.2" fill="url(#cg1b)" transform="rotate(-33 62 46)"/>`

**Ground taken** — ellipse `cx=50 cy=71 rx=18 ry=3`;
`<rect x="29" y="52" width="12" height="14" rx="2" fill="#9C9992"/>`;
`<rect x="44" y="44" width="12" height="22" rx="2" fill="#8B8880"/>`;
`<rect x="59" y="34" width="12" height="32" rx="2" fill="url(#gt1)"/>`;
`<circle cx="65" cy="27" r="2.5" fill="#E2BA78"/>`

**Let someone in** — ellipse `cx=50 cy=71 rx=18 ry=3`;
`<rect x="28" y="30" width="44" height="26" rx="8" fill="url(#lsi1)"/>`:

```
M40 56 L40 66 L50 56 Z
```
(fill `url(#lsi1)`)

```
M38 43 l6 6 L62 37
```
(`stroke="#F1F0EB" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"`)

### B3. States the frames show

| State | Rendering |
| --- | --- |
| Earned | stock + sun + dunes + device, full-colour |
| Unearned | stock + dunes + device, full-colour, **no sun** |
| Pressed | not drawn |
| Disabled / locked | does not exist — there is no lock glyph, no reduced opacity, no ghost |
| In progress | not drawn — the canvas has no ring/arc on the album face; progress lives in the text line only |
| Empty segment | not drawn |

### B4. Verification against `Medallion.tsx`

Every path, radius, colour, gradient and sun placement above was compared
character-for-character with `src/components/keepsakes/Medallion.tsx`
(`KK_SCENES`, `DISC.paper`, `ACCENT.paper`, `SUN`). **All match.** Two deliberate,
equivalent re-expressions:

- The dunes are CSS boxes on canvas and arcs in the app —
  `M-25 100.8 A75 36.8 0 0 1 125 100.8 L125 144 L-25 144 Z` and
  `M-45 110 A80 32 0 0 1 115 110 L115 158 L-45 158 Z` are the exact traces of the
  two `border-radius` boxes (§B1 3–4).
- Vidi's crescent bite is an opaque `#F1F0EB` circle on canvas and a `Mask` hole
  (`Circle cx=48 cy=26 r=14`) in the app. Same geometry; over the stock top colour
  the two are visually identical.

---

## C. Frame 110 — Medallion Received

### C1. Field

| Element | Property | Value | App top |
| --- | --- | --- | --- |
| Frame | background | `linear-gradient(180deg, #F6EEDD 0%, #F0E1C2 100%)` — 180deg = top → bottom, stop 0% `#F6EEDD`, stop 100% `#F0E1C2` | — |
| Wash wrapper | box | `inset:0`, `overflow:hidden`, `pointer-events:none` | — |
| Halo | box | `left:50%; top:70px; width:340px; height:340px; margin-left:-170px; border-radius:50%` | **16** |
| | fill | `radial-gradient(closest-side, rgba(226,186,120,0.38), rgba(226,186,120,0) 74%)` — centre (196.5, 240) canvas, r 170; stops 0 → `#E2BA78`@0.38, 0.74 → `#E2BA78`@0 | |
| | blur | **none** (prev had `blur(5px)` on its washes; this one has none) | |
| Grain | box | `inset:0`, `background-image:url('noise-dark.png')`, `opacity:0.07` — **inside** the wrapper, painted **over** the halo | — |
| Status bar | — | identical to §A1 | not built |

### C2. Content

| Element | Property | Value | App top |
| --- | --- | --- | --- |
| Close X | box | `right:20px; top:66px`, `width=18 height=18 viewBox="0 0 18 18"` | **12** |
| | stroke | `#55534E`, `stroke-width:2.2`, `stroke-linecap:round` | |
| Eyebrow | box | `left:0; right:0; top:100px`, `text-align:center` | **46** |
| | type | 11px / 600 / `letter-spacing:1.6px` / `rgba(91,74,40,0.55)` | |
| | text | `MEDALLION EARNED` (literal caps in the markup — no `text-transform`) | |
| Art frame | box | `left:50%; top:140px; width:260px; height:260px; margin-left:-130px` | **86** |
| Title | box | `left:36px; right:36px; top:432px`, `text-align:center` | **378** |
| | type | 27px / 600 / ls −0.2px / `#1D1C1A`, no explicit line-height, no wrap hint | |
| | text | `Veni` — the medallion's **name** | |
| Tier chip | wrapper | `left:0; right:0; top:476px`, `display:flex; justify-content:center` | **422** |
| | pill | `height:30px`, `border-radius:15px`, `background:#FFFFFF`, `box-shadow:0 0 0 1px rgba(0,0,0,0.1)`, `padding:0 14px`, flex `align-items:center` | |
| | type | 12.5px / 600 / `#55534E`, text `Tier I · The Vow` | |
| Sub | box | `left:44px; right:44px; top:530px`, `text-align:center`, `text-wrap:pretty` | **476** |
| | type | 15.5px / 400 / `line-height:23px` / `#55534E` | |
| | text | `You signed your name to twelve weeks. The campaign begins tonight.` | |
| Primary | box | `left:24px; right:24px; top:688px`, `height:56px`, `border-radius:28px`, `background:#131313`, flex centre both, `cursor:pointer` | **634** |
| | type | 17px / 600 / `letter-spacing:0.2px` / `#FFFFFF`, text `Take it` | |
| Secondary | box | `left:0; right:0; top:764px`, `text-align:center` | **710** |
| | type | 15px / 500 / `#8B8882`, text `Put it on the shelf` | |

### C3. The 260 × 260 art (unchanged from prev — app already matches)

| Element | Property | Value |
| --- | --- | --- |
| Glow | box | `left:30px; top:20px; 200 × 200`, `border-radius:50%` |
| | fill | `radial-gradient(closest-side, rgba(226,186,120,0.55), rgba(226,186,120,0) 74%)` |
| | filter | `blur(6px)` |
| Contact shadow | box | `left:52px; top:230px; 156 × 16`, `border-radius:50%`, `background:rgba(0,0,0,0.11)`, `filter:blur(6px)` |
| Disc | box | `left:62px; top:52px; 136 × 136`, `border-radius:50%` |
| | fill | `radial-gradient(circle at 38% 30%, #F0DBB4, #E2BA78 62%, #C99F5F 100%)` — CSS default extent is farthest-corner: in a 136 box the far corner is 0.935 of the box away, so the ramp runs to 93.5% |
| | shadow | `inset 0 0 0 4px rgba(255,255,255,0.25), inset 0 -8px 18px rgba(120,88,40,0.28), 0 14px 30px rgba(180,140,70,0.45)` |
| | transform | `rotate(-3deg)` |
| | layout | flex column, `align-items:center`, `justify-content:center`, `gap:7px` |
| Engraved ring | box | `inset:9px`, `border-radius:50%`, `box-shadow:inset 0 0 0 1.5px rgba(91,74,40,0.35)` |
| Laurel | svg | `viewBox="0 0 40 26"`, `width:42px`, `opacity:0.55` |
| Numeral | type | `Georgia,'Times New Roman',serif` / 17px / 600 / `letter-spacing:3px` / `#5b4a28` / `opacity:0.6` / `margin-right:-3px`, text `V` |

Laurel paths (verbatim, both `fill="#5b4a28"`):

```
M21 3 L21 16 L12 16 Z
```
```
M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z
```

Close-X path (verbatim):

```
M3 3l12 12M15 3L3 15
```

> **Ambiguity, named.** The chip reads `Tier I` but the numeral struck on the disc
> is `V`. If the numeral were the tier it would be `I`. Two readings: (a) `V` is
> the initial of *Veni*; (b) `V` is a fixed VICI house mark on every disc. The
> frame set gives no third data point (the Detail-* frames carry no numeral at
> all), so the evidence rules out only the tier-numeral reading. The app already
> hard-codes `V`, which is safe under both surviving readings — leave it alone
> unless the album is made to drive it.

---

## D. Comparison

### D1. `src/app/(app)/milestones.tsx`

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| Field colour | `#F4F3F0` | `#F4F3F0` | match |
| Grain | `noise-dark.png` @ 0.07, inset 0 | `noiseDark` @ 0.07, inset 0 | match |
| Back chevron top | canvas 64 → app 10 | `top: 10`, left 16 | match |
| Back chevron path/stroke | `M9.5 1.5L2 9.5l7.5 8`, `#55534E`, 2.4, round/round | identical | match |
| Page dots | canvas 72 → 18, right 20, gap 4.5, 4.5² `#55534E` | `top: 18`, right 20, gap 4.5, 4.5², `#55534E` | match |
| Title | canvas 114 → 60, 27/600/−0.2/`#1D1C1A` | `top: 60`, 27, `sans('600')`, −0.2, `#1D1C1A` | match |
| Segmented box | canvas 168 → 114, h 38, r 19, `rgba(0,0,0,0.06)`, padding 3 | `top: 114`, 38, 19, `rgba(0,0,0,0.06)`, padding 3 | match |
| Segmented pill | r 16, `#FFFFFF`, `0 1px 4px rgba(40,38,32,0.14), 0 0 0 0.5px rgba(0,0,0,0.04)` | identical string | match |
| Segment labels | 14 / 600 `#1D1C1A` on, 500 `#8B8882` off | identical | match |
| Count line | canvas 230 → 176, 13/600/`#55534E` | `top: 176`, 13, `sans('600')`, `#55534E` | match |
| Count copy | `6 of 11 earned` / `5 left` | `${n} of ${total} earned` / `${n} left` | match (format) |
| Rail | canvas 256 → 202, h 5, r 3, track `rgba(0,0,0,0.12)`, fill `#131313`, earned-only | `top: 202`, 5, 3, same colours, `segment === 'earned'` gate | match |
| Rail fill width | 55% (= 6/11 rounded) | `${(nEarned / struck.length) * 100}%` | match (rule) |
| **Grid horizontal inset** | **left 20 / right 20** | `paddingHorizontal: 12` | **MISMATCH** |
| **Column gap** | **17** | `gap: 10` on the row | **MISMATCH** |
| **Row gap (vertical)** | **17** (185 stride − 168 card) | `gap: 26` on the contentContainer | **MISMATCH** |
| **Card width** | **168** on a 393 device | (393 − 24 − 10) / 2 = **179.5** | **MISMATCH** |
| **Card height** | **`height: 168` fixed** | `minHeight: 142` (renders ≈142) | **MISMATCH** |
| **Card padding** | **12 / 12 / 12 / 12** | `paddingTop: 14`, `paddingHorizontal: 12`, `paddingBottom: 12` | **MISMATCH** (top) |
| **Card main-axis** | **`justify-content: center`** | not set (flex-start) | **MISMATCH** |
| **Lone-card width** | **`calc(50% - 8.5px)` = 168** | `(width − 24 − 10) / 2` = 179.5 | **MISMATCH** |
| First row top — Earned | canvas 290 → app 236 | header block `height: 236` | match |
| First row top — Still | canvas 262 → app 208 | header block `height: 208` | match |
| Card radius / fill | 16, `#FFFFFF`, no border | 16, `#FFFFFF`, no border | match |
| Coin mount | 68, circle, triple rim shadow | `KKMedallion size={68}` in a `borderRadius: 9999` box with the identical shadow string | match |
| Coin → text gap | 10 | `gap: 10` | match |
| Name type | 14.5 / 500 / lh 18.85 / `#1D1C1A` / centre | 14.5, `sans('500')`, 18.85, `#1D1C1A`, `center` | match |
| State-line type | mt 4 / 12.5 / 600 / `#8B8882` / centre | `marginTop: 4`, 12.5, `sans('600')`, `#8B8882`, `center` | match |
| Earned card = sun on | yes | `sun={struck.earned}` | match |
| Unearned card = paper, no sun, no lock | yes | `metal="paper"`, sun false, no lock, no arc | match |
| State line — tiered earned | `Tier II · Day VII`, `Tier II · ×5`, `Tier I · ×1` | `Tier ${kkRoman} · ${kkRung}` | match |
| State line — one-time earned | `Day 0 · Jun 9`, `Jun 9`, `Jun 21` | `DATE[key]` / `'Minted'` | match |
| State line — tiered unearned | `4 of 10`, `3 of 5`, `Not yet · first ×1` | `${count} of ${step0}` / `Not yet · first ${rung}` | match |
| State line — *Ground taken* | `Not yet` | `Not yet · first ×1` | **canvas self-contradiction — keep the app** (see §A6) |
| State line — minting face | `Gold, once · not yet` | `${TITLE_CASE[MINT]} , once · not yet` | match |
| Album size | 11 faces | 12 (`backondeck` added on purpose, documented in `Medallion.tsx`) | deliberate divergence |
| Tab bar | 83 tall, `rgba(255,255,255,0.95)`, 3 tabs at 70/196/318 | `TAB_BAR_CONTENT 63 + max(inset,20)` = 83; 4 tabs on even quarters | deliberate divergence, documented in `StoicTabBar.tsx` |

### D2. `src/app/medallion-post.tsx` (+ `MailArrival` in `src/app/letter.tsx`)

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| **Field** | `linear-gradient(180deg, #F6EEDD 0%, #F0E1C2 100%)` | flat `#F4F3F0` (`medallion-post.tsx` L59) | **MISMATCH** |
| **Halo** | one circle, 340 × 340, centred, top 70 (app 16), `rgba(226,186,120,0.38)` → 0 @ 74%, no blur | two washes: grey `#B4AA96` ellipse `width*1.3 × 300` at top −190, and `#FFECC4` 520 circle at bottom −260 (`letter.tsx` L163–185) | **MISMATCH** |
| **Paint order** | halo first, grain over it | grain first, washes over it | **MISMATCH** |
| Close X | right 20, canvas 66 → app 12; 18², `#55534E`, 2.2, round | right 20, `top: 12`, 18², `#55534E`, 2.2, round | match |
| **Eyebrow** | `MEDALLION EARNED`, canvas 100 → app 46, 11/600/ls 1.6/`rgba(91,74,40,0.55)`, centred | **absent** | **MISMATCH** |
| **Art frame top** | canvas 140 → **app 86** | `top: 106` (`letter.tsx` L204) | **MISMATCH** (20 low) |
| Art frame box | 260 × 260, centred by `left:50%; margin-left:-130` | `left: '50%'`, 260 × 260, `marginLeft: -130` | match |
| Glow | left 30 / top 20, 200², `rgba(226,186,120,0.55)` → 0 @ 74% | `Svg 200×200` at left 30 / top 20, stops 0→0.55, 0.74→0 | match |
| Contact shadow | left 52 / top 230, 156 × 16, `rgba(0,0,0,0.11)`, blur 6 | `Svg 156×16` at left 52 / top 230, radial 0→0.11, 0.6→0.055, 1→0 | match (blur re-expressed as falloff) |
| Disc | left 62 / top 52, 136², rotate −3°, gradient + 3-part shadow, gap 7 | identical numbers and identical shadow string | match |
| Engraved ring | inset 9, `inset 0 0 0 1.5px rgba(91,74,40,0.35)` | `top/left/right/bottom: 9`, `borderRadius: 59`, same shadow | match |
| Laurel | `viewBox 0 0 40 26`, width 42, opacity 0.55, `#5b4a28`, both paths | `LaurelStrike width={42}` — same viewBox, opacity, paths, colour | match |
| Numeral | Georgia 17 / 600 / ls 3 / `#5b4a28` / opacity 0.6 / mr −3, `V` | `fonts.quote` (Georgia on iOS), 17, '600', ls 3, `#5b4a28`, 0.6, `marginRight: -3`, `V` | match |
| **Title top** | canvas 432 → **app 378** | `top: 418` (`letter.tsx` L210) | **MISMATCH** |
| **Title size/weight** | **27 / 600 / ls −0.2 / no line-height** | 24 / `sans('500')` / ls −0.1 / `lineHeight: 32` | **MISMATCH** (4 properties) |
| **Title copy** | the medallion's **name** (`Veni`) | `"You earned a medallion."` (`medallion-post.tsx` L65) | **MISMATCH** |
| **Tier chip** | white pill, canvas 476 → app 422, h 30, r 15, `0 0 0 1px rgba(0,0,0,0.1)`, px 14, 12.5/600/`#55534E`, `Tier I · The Vow` | **absent** | **MISMATCH** |
| **Sub top** | canvas 530 → **app 476** | `top: 468` (`letter.tsx` L213) | **MISMATCH** (8 high) |
| Sub type | 15.5 / 400 / lh 23 / `#55534E` / centre | 15.5, `sans('400')`, 23, `#55534E`, `center` | match |
| Sub inset | left 44 / right 44 | left 44 / right 44 | match |
| **Sub copy** | the face's story line for the tier just reached | hard-coded `"Vici, tier II — five ridden…"` | **MISMATCH** (should read `KK_ALBUM[…].stories[tier-1]`) |
| Primary button | canvas 688 → app 634; left/right 24, h 56, r 28, `#131313` | `bottom: 108` on an 852 frame = top 688 ✓, same box | match |
| Primary label | 17 / 600 / ls 0.2 / `#FFFFFF`, `Take it` | 17, `sans('600')`, 0.2, `#FFFFFF`, `Take it` | match |
| Secondary | canvas 764 → app 710; 15 / 500 / `#8B8882`, `Put it on the shelf` | `bottom: 70`, 15, `sans('500')`, `#8B8882`, same copy | match |
| Read phase (`MailSheet`) | `Medallion-Letter.html` — unchanged in this bundle | unchanged | match (out of scope) |

### D3. `src/components/keepsakes/Medallion.tsx`

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| Disc stock | `linear-gradient(180deg, #F1F0EB, #ECEAE3)` | `DISC.paper.face` `from '#F1F0EB' to '#ECEAE3'`, vertical | match |
| Dune 1 | box → rx 75, ry 36.8, springs y 100.8, `#DEDDD6` | `M-25 100.8 A75 36.8 0 0 1 125 100.8 L125 144 L-25 144 Z` | match |
| Dune 2 | box → rx 80, ry 32, springs y 110, `#CFCEC7` | `M-45 110 A80 32 0 0 1 115 110 L115 158 L-45 158 Z` | match |
| Sun gradient | `rgba(226,186,120,0.42)` → `rgba(226,186,120,0)` @ 75% | Stop 0 `#E2BA78` 0.42, Stop 0.75 `#E2BA78` 0 | match |
| Sun placements | 6 values, §A6 | `SUN` map — all six identical | match |
| Ink gradient | `#4A4843` → `#1D1C19`, vertical | `kkv` gradient, identical | match |
| Accents (paper) | `#8A857C`, `#C4C3BC`, `#E2BA78`, `#F1F0EB`, `#C99F5F`, `#DBDAD3`, `#E1E0D9`, `#9C9992`, `#8B8880`, `#CFCEC7`, `#C7C6BF`, `#D2D1CA`, `#D6D5CE` | `ACCENT.paper` — all identical | match |
| Every device path | §B2 | `KK_SCENES` — every `d`, `rx`, `cx/cy/r`, stroke width, cap and join identical | match |
| Ground smudge | `rgba(40,38,32,0.14)`; study `rgba(40,38,32,0.10)` | `GROUND` + study's literal `rgba(40,38,32,0.10)` | match |
| Vidi crescent | opaque `#F1F0EB` circle `cx 48 cy 26 r 14` | `Mask` with the same circle | match (equivalent) |
| Paper rim / sheen / seat | none on paper | gated on `disc.face.kind === 'struck'` | match |
| Progress arc | none in either frame | only when `progress` prop is passed (milestones passes none) | match |

**No change is required in `Medallion.tsx`.** It is the one file of the three that
the frames fully corroborate.

---

## E. What must change

1. **`src/app/(app)/milestones.tsx` — grid metrics.** In the `ScrollView`
   `contentContainerStyle`, change `paddingHorizontal: 12` → `20` and `gap: 26` →
   `17`. In the row `View`, change `gap: 10` → `17`. Together these give a 353pt row,
   a 168pt card and a 185pt stride, which is what all six grid rows across the two
   frames measure.
2. **`src/app/(app)/milestones.tsx` — `FaceCard` box.** Replace `minHeight: 142`
   with `height: 168`; replace `paddingTop: 14` / `paddingHorizontal: 12` /
   `paddingBottom: 12` with a single `padding: 12`; add
   `justifyContent: 'center'`. The final frame added the fixed height and the
   centring in the same edit — one without the other reintroduces the ~26pt gap
   the diff closed.
3. **`src/app/(app)/milestones.tsx` — lone-card width.** `halfW` becomes
   `(useWindowDimensions().width - 40 - 17) / 2` (was `- 24 - 10`), i.e. the
   canvas's `calc(50% - 8.5px)` of a 353 row = 168. Update the two comment blocks
   above it (L220–225 and L268–272) that still quote "369pt row" and "10pt gap".
4. **`src/app/medallion-post.tsx` — stop borrowing the letter's arrival.** The
   Received frame no longer shares a composition with `Drop-Received.html` or
   `Letter-Arrival.html` (both still on the old `#F4F3F0` field, title 24px at
   canvas 472). Either give `MailArrival` optional props — `field` (gradient),
   `halo`, `eyebrow`, `chip`, `titleStyle`, `artTop`, `titleTop`, `subTop` — or
   write a local arrival in `medallion-post.tsx`. **Do not edit `MailArrival`'s
   defaults**; `letter.tsx` and `drop.tsx` are still correct against their frames.
5. **`src/app/medallion-post.tsx` — field and halo.** Field becomes
   `LinearGradient` `['#F6EEDD', '#F0E1C2']` top→bottom. Drop both letter washes.
   Add one 340 × 340 centred halo at app top 16, `radial-gradient(closest-side,
   rgba(226,186,120,0.38), rgba(226,186,120,0) 74%)`, **no blur**, with the grain
   painted over it, not under.
6. **`src/app/medallion-post.tsx` — new eyebrow.** `MEDALLION EARNED` at app top
   46, full width, centred, 11 / 600 / letter-spacing 1.6 / `rgba(91,74,40,0.55)`.
   Literal caps in the string (the canvas uses no `text-transform`).
7. **`src/app/medallion-post.tsx` — art frame to app top 86** (canvas 140), down
   from the shared 106. The 260 × 260 contents move with it unchanged.
8. **`src/app/medallion-post.tsx` — title.** App top 378 (canvas 432), left/right
   36, centred, **27 / 600 / letter-spacing −0.2**, no `lineHeight`, colour
   `#1D1C1A`. Copy becomes the medallion's own name (`KK_ALBUM` `name`), not
   "You earned a medallion."
9. **`src/app/medallion-post.tsx` — new tier chip** at app top 422 (canvas 476):
   a centred white pill, height 30, radius 15, `boxShadow: '0 0 0 1px
   rgba(0,0,0,0.1)'`, horizontal padding 14, label 12.5 / 600 / `#55534E`, reading
   `Tier ${kkRoman(tier)} · ${rungName}`. The frame's `The Vow` is a rung name the
   album does not yet carry for `veni`; either add a short rung label to `KKFace`
   or fall back to `kkRung(face, step)`.
10. **`src/app/medallion-post.tsx` — sub.** Move to app top 476 (canvas 530; the
    shared component has it at 468). Type is already correct. Copy becomes the
    face's story for the tier reached — `KK_ALBUM[…].stories[reached - 1]` —
    rather than the hard-coded Vici line.
11. **Nothing to do in `src/components/keepsakes/Medallion.tsx`.** Every path,
    colour, gradient and sun placement in both album frames already matches
    character-for-character (§D3).
12. **Do not "fix" the *Ground taken* state line** to the canvas's bare `Not yet`
    (§A6) — the frame contradicts itself on that one card and the app's rule is
    the reading the rest of the frame supports.
