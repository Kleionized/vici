# Spec — Morning Check-in Time + Nightly Check-in Time

| Sticky | Frame (`data-screen-label`) | Split file | Target app file(s) |
| --- | --- | --- | --- |
| 108 (app JSDoc; the bundle carries no sticky number) | `Morning Check-in Time` | `.uifinal/final/Email Login/Morning-Check-in-Time.html` | `src/app/routines/morning-time.tsx` + `src/components/routines/kit.tsx` + `src/components/routines/wheel.tsx` |
| 109 (app JSDoc; the bundle carries no sticky number) | `Nightly Check-in Time` | `.uifinal/final/Email Login/Nightly-Check-in-Time.html` | `src/app/routines/night-time.tsx` + `src/components/routines/kit.tsx` + `src/components/routines/wheel.tsx` |

Sources read in full for this spec:

- `.uifinal/pretty/final/Email Login/Morning-Check-in-Time.html` (412 lines)
- `.uifinal/pretty/final/Email Login/Nightly-Check-in-Time.html` (412 lines)
- `.uifinal/pretty/prev/Email Login/Morning-Check-in-Time.html`
- `.uifinal/pretty/prev/Email Login/Nightly-Check-in-Time.html`
- `.uifinal/diffs/Morning-Check-in-Time.html.diff`
- `.uifinal/diffs/Nightly-Check-in-Time.html.diff`
- `/Users/admin/Documents/tideline/src/app/routines/morning-time.tsx`
- `/Users/admin/Documents/tideline/src/app/routines/night-time.tsx`
- `/Users/admin/Documents/tideline/src/components/routines/kit.tsx`
- `/Users/admin/Documents/tideline/src/components/routines/wheel.tsx`
- supporting: `src/components/ui/AppText.tsx`, `src/components/ui/press-scale.tsx`, `src/lib/theme.ts` (`sans`), `src/lib/routines.ts`

> **The 54px rule.** Every canvas `top` in this file includes the frame's 54px status
> bar, which the app never builds. Each table gives **canvas top** and
> **app top = canvas − 54**.

---

## 0. What actually changed since the last bundle

Both diffs carry exactly one edit, repeated seven times — the day-chip label colour.
A byte-level re-diff (whitespace-stripped) of prev vs final confirms there is nothing
else in either file:

```
286c286  |color:#1D1C1A;  →  |color:#F4F3F0;   (Su)
300c300  |color:#1D1C1A;  →  |color:#F4F3F0;   (M)
314c314  |color:#1D1C1A;  →  |color:#F4F3F0;   (Tu)
328c328  |color:#1D1C1A;  →  |color:#F4F3F0;   (W)
342c342  |color:#1D1C1A;  →  |color:#F4F3F0;   (Th)
356c356  |color:#1D1C1A;  →  |color:#F4F3F0;   (F)
370c370  |color:#1D1C1A;  →  |color:#F4F3F0;   (Sa)
```

The chip fill is `#131313` in both prev and final, so the previous bundle drew
near-black text on near-black fill. **`#F4F3F0` is the correction, and the app still
carries the old `#1D1C1A`.** This is the headline finding.

The same seven-line edit lands identically in `Settings-Check-in-Time.html`, which is a
byte-clone of `Nightly-Check-in-Time.html` apart from `data-screen-label` and the back
label. `specs/settings.md` §9 already records the same mismatch from the settings side —
one fix in `kit.tsx` closes all three frames.

---

## 1. The two frames are one frame

`diff Morning-Check-in-Time.html Nightly-Check-in-Time.html` differs in exactly four
places. Everything else — every offset, size, colour, radius, gap — is byte-identical.

| # | Morning | Nightly |
| --- | --- | --- |
| 1 | `data-screen-label="Morning Check-in Time"` | `data-screen-label="Nightly Check-in Time"` |
| 2 | question: `When should the morning check-in come?` | question: `When should the nightly check-in come?` |
| 3 | wheel sample values (hours `4 5 6 [7] 8 9 10`, minutes `57 58 59 [00] 01 02 03`, period `[AM] PM`) | wheel sample values (hours `7 11 12 [10] 11 12 1`, minutes `27 28 29 [30] 31 32 33`, period `AM [PM]`) |
| 4 | note: `Twenty seconds, first thing — you can change this any time.` | note: `Set it for the start of your riskiest hours — you can change this any time.` |

The CTA is `Save time` on both. The back label is `Back` on both (contrast
`Settings Check-in Time`, whose back label reads `Settings`).

---

## 2. Frame chrome (both frames, identical)

| Property | Value |
| --- | --- |
| frame box | `width:393px; height:852px; position:relative; overflow:hidden` |
| frame background | `#F4F3F0` |
| frame font stack | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` |
| smoothing | `-webkit-font-smoothing:antialiased` |
| `flex-shrink` | `0` |
| frame shadow — **canvas chrome only, never build** | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` |
| noise layer | **absent.** The first child of the frame is the status bar. This is not a transcription gap — neither file has a noise div, and `RoutineShell` correctly paints none. |
| root `font-weight` | not declared ⇒ every child that declares none inherits the UA default **400** |
| gradients / blend modes / backdrop blur | **none anywhere in either frame** |
| borders | **none** except the battery outline in the status-bar SVG |
| dividers | **none** |
| element shadows | **none** (the only `box-shadow` in the file is the frame's own canvas chrome) |
| explicit `z-index` | only the status bar (`z-index:20`). Everything else stacks by DOM order. |

### 2.1 Status bar — canvas only, the app uses `expo-status-bar`

| Property | Value |
| --- | --- |
| container | `position:absolute; top:0; left:0; right:0; height:54px; display:flex; align-items:center; justify-content:space-between; padding:6px 32px 0 46px; box-sizing:border-box; z-index:20` |
| clock | `9:41`, `font-size:17px; font-weight:600; color:#1D1C1A; letter-spacing:-0.2px` |
| glyph cluster | `display:flex; align-items:center; gap:7px` |
| ink | `#1D1C1A` throughout ⇒ `<StatusBar style="dark" />`, which both screens already set |

Signal bars — `<svg width="19" height="12" viewBox="0 0 19 12">`, four `rect`s, all `fill="#1D1C1A"`, all `rx="0.7"`:

| x | y | width | height |
| --- | --- | --- | --- |
| `0` | `7.5` | `3.2` | `4.5` |
| `4.8` | `5` | `3.2` | `7` |
| `9.6` | `2.5` | `3.2` | `9.5` |
| `14.4` | `0` | `3.2` | `12` |

Wi-Fi — `<svg width="17" height="12" viewBox="0 0 17 12">`, both paths `fill="#1D1C1A"`, plus `<circle cx="8.5" cy="10.5" r="1.5" fill="#1D1C1A"/>`:

```
M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z
```
```
M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z
```

Battery — `<svg width="27" height="13" viewBox="0 0 27 13">`:

- shell `<rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#1D1C1A" stroke-opacity="0.35" fill="none"/>`
- fill `<rect x="2" y="2" width="20" height="9" rx="2" fill="#1D1C1A"/>`
- nub `fill="#1D1C1A"`, `fill-opacity="0.4"`:

```
M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z
```

---

## 3. Vertical skeleton — every top, both frames

| # | Element | Canvas top | **App top** | Height on canvas |
| --- | --- | --- | --- | --- |
| 1 | back row | `64` | **`10`** | ~20 (content) |
| 2 | question | `132` | **`78`** | natural (block held at 76 → next at 208) |
| 3 | `Select time` | `208` | **`154`** | natural (block held at 42 → next at 250) |
| 4 | hour + minute columns | `250` | **`196`** | `218` (7 rows: 29·3 + 44 + 29·3) |
| 4b | selection band | `335` | **`281`** | `44` |
| 4c | period column | `337` | **`283`** | `73` (44 + 29) |
| 5 | `Select days` | `508` | **`454`** | natural (block held at 40 → next at 548) |
| 6 | day chip row | `548` | **`494`** | `38` |
| 7 | note | `676` | **`622`** | `44` (two 22px lines, both frames) |
| 8 | CTA pill | `744` | **`690`** | `48` |
|   | CTA bottom | `792` | **`738`** | 60 to the frame's bottom edge |

Wheel column bottom = `250 + 218 = 468` canvas / **414** app.
Chip row bottom = `548 + 38 = 586` canvas / **532** app. Slack to the note = **90**.

The whole stack closes exactly on a 393 × 852 phone with a 54/34 inset pair:
`54 + 10 + 20 + 48 + 76 + 42 + 218 + 40 + 40 + 38 + 90 + 44 + 24 + 48 + 26 + 34 = 852`.

---

## 4. Element-by-element

### 4.1 Back row

| Property | Design value |
| --- | --- |
| container | `position:absolute; left:16px; top:64px; display:flex; align-items:center; gap:9px` |
| app top | **10** |
| chevron svg | `<svg width="11" height="19" viewBox="0 0 11 19">` |
| chevron stroke | `#55534E` · `stroke-width:2.4` · `stroke-linecap:round` · `stroke-linejoin:round` · `fill:none` |
| label | `Back` |
| label type | `font-size:17px` · `font-weight:400` · `color:#55534E` |
| label tracking / leading | not declared ⇒ `0` / platform natural |
| pressed / disabled | not drawn |

```
M9.5 1.5L2 9.5l7.5 8
```

### 4.2 Question

| Property | Design value |
| --- | --- |
| box | `position:absolute; left:0; right:0; top:132px` (full 393 wide, **no horizontal padding**) |
| app top | **78** |
| align | `text-align:center` |
| type | `font-size:22px` · `font-weight:500` · `color:#1D1C1A` |
| leading / tracking / transform | none declared ⇒ platform natural / `0` / none |
| max-lines | none declared |
| Morning text | `When should the morning check-in come?` |
| Nightly text | `When should the nightly check-in come?` |

### 4.3 `Select time` / `Select days` captions

Identical declarations, two occurrences per frame.

| Property | Design value |
| --- | --- |
| box | `position:absolute; left:0; right:0; text-align:center` |
| tops | `Select time` `208` (app **154**) · `Select days` `508` (app **454**) |
| type | `font-size:14.5px` · `font-weight:600` · `color:#2A2924` |
| leading / tracking / transform | none declared ⇒ natural / `0` / **none — these are sentence case, not caps** |

### 4.4 Selection band

| Property | Design value |
| --- | --- |
| box | `position:absolute; left:46px; top:335px; width:301px; height:44px` |
| app top | **281** |
| radius | `border-radius:11px` (all four corners) |
| fill | `rgba(0,0,0,0.08)` |
| border / shadow | none |
| paint order | declared **before** the three columns ⇒ paints **under** the numbers |
| horizontal | `46 … 347`; right margin `393 − 347 = 46`, i.e. the band is centred on x **196.5** |

**Deliberate 2px offset.** The band sits at `335`, while the selected row's own 44px
line box sits at `337`. The band is 2px higher than the row it marks. Transcribe, do
not "fix".

**Deliberate 5px offset.** The column cluster spans `105 … 298`, centre **201.5** — 5px
right of the band's centre (196.5). The canvas is asymmetric on purpose; `wheel.tsx`
already documents this.

### 4.5 Wheel columns — geometry

| Column | `left` | `width` | `top` | app top | rows |
| --- | --- | --- | --- | --- | --- |
| hour | `105px` | `40px` | `250px` | **196** | 7 |
| minute | `172px` | `50px` | `250px` | **196** | 7 |
| period | `238px` | `60px` | `337px` | **283** | 2 |

All three: `position:absolute; text-align:center`. No background, no border, no radius,
no overflow declaration.

Derived gaps: `105 + 40 = 145`, `172 − 145 = ` **27** · `172 + 50 = 222`,
`238 − 222 = ` **16** · period right edge `238 + 60 = ` **298**.

### 4.6 Wheel rows — the perspective ladder

Straight off the canvas. No `font-weight` is declared on any row ⇒ **400**.

| Distance from selection | `font-size` | `line-height` | `color` |
| --- | --- | --- | --- |
| 0 (selected) | `30px` | `44px` | `#1D1C1A` |
| ±1 | `22px` | `29px` | `rgba(90,88,82,0.55)` |
| ±2 | `21px` | `29px` | `rgba(120,117,110,0.5)` |
| ±3 | `20px` | `29px` | `rgba(140,137,130,0.45)` |

Line boxes, hour/minute column (canvas y):

| Row | Box | Centre | Distance from selected centre |
| --- | --- | --- | --- |
| −3 | `250 … 279` | `264.5` | `94.5` |
| −2 | `279 … 308` | `293.5` | `65.5` |
| −1 | `308 … 337` | `322.5` | `36.5` |
| **0** | `337 … 381` | **`359`** | `0` |
| +1 | `381 … 410` | `395.5` | `36.5` |
| +2 | `410 … 439` | `424.5` | `65.5` |
| +3 | `439 … 468` | `453.5` | `94.5` |

So the spacing law is **`36.5` to the first neighbour, then `+29` per row after**, and
the column's overall centre (`250 + 109 = 359`) is exactly the selected row's centre.
There is no 4th row in either direction — the column ends flush at `250` and `468`.

### 4.7 Wheel sample values

| Column | Morning | Nightly |
| --- | --- | --- |
| hour | `4` `5` `6` **`7`** `8` `9` `10` | `7` `11` `12` **`10`** `11` `12` `1` ⚠ |
| minute | `57` `58` `59` **`00`** `01` `02` `03` | `27` `28` `29` **`30`** `31` `32` `33` |
| period | **`AM`** `PM` | `AM` **`PM`** ⚠ |

Morning's minute run `57 58 59 00 01 02 03` proves both hour and minute wrap.
Nightly's hour run `… 10 11 12 1` proves the hour wraps `12 → 1`.

### 4.8 Day chips

| Property | Design value |
| --- | --- |
| row | `position:absolute; left:34px; right:34px; top:548px; display:flex; justify-content:space-between` |
| app top | **494** |
| row content width | `393 − 34 − 34 = 325` |
| chip | `width:38px; height:38px; border-radius:50%` (⇒ **19** on all four corners) |
| chip fill | `#131313` |
| chip layout | `display:flex; align-items:center; justify-content:center` |
| chip label | `font-size:14px` · `font-weight:600` · **`color:#F4F3F0`** ← the whole diff |
| leading / tracking | none declared ⇒ natural / `0` |
| labels, in order | `Su` `M` `Tu` `W` `Th` `F` `Sa` (Sunday-first) |
| derived gap | `(325 − 7×38) / 6 = 59/6 = ` **`9.8333…`** |
| derived chip x | `34`, `81.8333`, `129.6667`, `177.5`, `225.3333`, `273.1667`, `321` (last right edge `359` ✓) |
| border / shadow | none |
| **unselected state** | **not drawn.** All seven chips are selected in both frames — and in `Settings-Check-in-Time` too. The off-state fill and label colour are **not specified anywhere in the bundle** (`grep -r EFEEEA` over the whole final bundle returns nothing). |
| pressed / disabled | not drawn |

### 4.9 Note

| Property | Design value |
| --- | --- |
| box | `position:absolute; left:36px; right:36px; top:676px` (content width **321**) |
| app top | **622** |
| align | `text-align:center` |
| type | `font-size:15px` · `font-weight:400` · `line-height:22px` · `color:#55534E` |
| wrap | `text-wrap:pretty` (web-only hint) |
| tracking | not declared ⇒ `0` |
| Morning text | `Twenty seconds, first thing &mdash; you can change this any time.` (em dash `—`) |
| Nightly text | `Set it for the start of your riskiest hours &mdash; you can change this any time.` (em dash `—`) |
| measured height | **44** = 2 lines × 22, for both strings at 321px. Confirmed by arithmetic: `676 + 44 + 24 = 744`, the CTA's top. |

### 4.10 CTA

| Property | Design value |
| --- | --- |
| box | `position:absolute; left:16px; top:744px; width:361px; height:48px` |
| app top | **690**; right edge `377` ⇒ symmetric 16pt margins |
| radius | `border-radius:25px` (all four corners) |
| fill | `#131313` |
| layout | `display:flex; align-items:center; justify-content:center` |
| cursor | `pointer` (web only) |
| **pressed** | `style-active="transform:scale(0.99);"` — **the only interaction state either frame declares** |
| label | `Save time` (both frames) |
| label type | `font-size:17.5px` · `font-weight:600` · `color:#FFFFFF` |
| label tracking | declared **twice**: `letter-spacing:0.3px;` then `letter-spacing:0.2px;` |
| disabled / loading | not drawn |

**Canvas contradicts itself on tracking.** CSS last-declaration-wins ⇒ the effective
value is **`0.2px`**. The app already uses `0.2`, so no change — but the spec value is
0.2px, not 0.3px.

---

## 5. Visualization — the time wheel

The frame draws no chart, ring, gauge or calendar. The one custom drawing is the wheel,
and it is a **static perspective stack in the canvas** that has to become a real
scroller in the app. Its full geometry:

**Coordinate system.** Plain DOM boxes, no SVG, no `viewBox`. Everything is
absolutely-positioned line boxes inside the 393 × 852 frame.

**Domain → pixel mapping.** Distance from the selected row (in rows) → y offset from
the column centre:

| rows away `n` | y offset from centre |
| --- | --- |
| `0` | `0` |
| `1` | `36.5` |
| `2` | `65.5` |
| `3` | `94.5` |
| `≥4` | not drawn (outside the 218px column) |

i.e. `offset(n) = n === 0 ? 0 : 36.5 + (n − 1) × 29`.

This is **not** a linear scale, so the app splits it: scroll travel runs on a flat
`ITEM_H = 36.5` interval (so a finger drag and the snap both behave), and each row is
then pulled back toward the centre with `translateY(placed − d × 36.5)`. `wheel.tsx`
implements exactly this and lands every row on the canvas y to the pixel.

**Size / tone ramp.** See §4.6. Four steps; the step index is `min(3, round(|d|))`.

**Axis / ticks / gridlines / dashes / caps / joins / clip paths / masks.** None. The
wheel has no axis, no tick marks, no gridlines, no strokes at all. The only decoration
is the `rgba(0,0,0,0.08)` band (§4.4).

**Column heights.** `218` each (`29 × 3 + 44 + 29 × 3`). The period column draws only 2
rows but occupies `44 + 29 = 73` on the canvas; in the app it is the same 218-tall
scroller as the others, which is what keeps the selected row band-aligned.

**Data domains.** Hours `1…12` (wrapping), minutes `00…59` (wrapping, zero-padded to 2
digits), period `AM | PM` (**not** wrapping — the canvas shows nothing above `AM` in the
Morning frame and nothing below `PM` in the Nightly frame).

**Edge cases.**

| Case | Required rendering |
| --- | --- |
| no-data | Not reachable — `DEFAULT_ROUTINES` always supplies a `TimeOfDay`, so a value is always selected. |
| one-point (period column) | 2 rows only. Selected row centred on the band; the other row at `±36.5`; nothing beyond. |
| min (hour `1`) | Wraps: `10 11 12 [1] 2 3 4`. |
| max (hour `12`) | Wraps: `9 10 11 [12] 1 2 3`. |
| min (minute `00`) | Wraps: `57 58 59 [00] 01 02 03` — this is literally the Morning frame. |
| max (minute `59`) | Wraps: `56 57 58 [59] 00 01 02`. |
| overflow (`|d| ≥ 4`) | Clipped. The ±4 row would sit at `±123.5` from centre, entirely outside the 218 box, and the canvas draws no such row. |
| period at `AM` | Nothing above. Period column top on the canvas = **337** (app 283). |
| period at `PM` | `AM` above at `−36.5`, nothing below. Period column top **must be 308** (app 254) so the selected `PM` centres on the band — see §6.2. |

---

## 6. Where the canvas contradicts itself

### 6.1 The Nightly hour column

It reads, top to bottom: `7`, `11`, `12`, **`10`**, `11`, `12`, `1`.

Below the selection that is correct for a wrapping 1–12 wheel (`10 → 11 → 12 → 1`).
Above it, `7 / 11 / 12` is impossible: three rows above a selected `10` must read
`7 / 8 / 9`. The `7` at −3 is right; the `11` and `12` at −2 and −1 are the slip.

**Evidence supports the app's reading.** Two independent checks: the Morning frame's
hour column is a clean consecutive run (`4 5 6 [7] 8 9 10`), and the Nightly frame's own
minute column is a clean consecutive run (`27 28 29 [30] 31 32 33`). The frame's upper
hour rows are a drawing slip. `wheel.tsx` (`HOURS = 1…12`, looped) renders
`7 / 8 / 9 / [10] / 11 / 12 / 1` and is correct. **Do not transcribe the frame here.**

### 6.2 The Nightly period column position

The period column is declared at `top:337px` in **both** frames. In the Morning frame,
where `AM` is the selected 44px row, that puts the selected line box at `337 … 381` —
exactly aligned with the hour and minute columns' selected rows, and 2px under the band
in the way §4.4 describes. Correct.

In the Nightly frame, `PM` is the selected row but it is the **second** child, so its
box lands at `366 … 410` — its centre (`388`) sits **31px below** the band's centre
(`357`), and the selected `PM` renders outside the band entirely.

**Evidence supports the app's reading.** The band is the selection affordance; the
Morning frame proves the intended alignment; the hour and minute columns in the very
same Nightly frame put their selected rows at `337 … 381`. The Nightly period column
simply kept the AM-selected layout's `top` when the selected row was swapped. The
correct value is `top:308px` (app **254**). `wheel.tsx` centres the selected row inside
the 218-tall column and therefore already draws it right.

### 6.3 The CTA's duplicate `letter-spacing`

`0.3px` then `0.2px` in the same rule. Last wins ⇒ **`0.2px`**. See §4.10.

### 6.4 The wheel values are sample content, not defaults

The picker frames show `7:00 AM` / `10:30 PM`; the `Settings` frame's own summary chips
read `8:00 AM` / `9:30 PM` for the same two routines. The bundle does not agree with
itself, so **no default-time change is warranted** from these frames.
`DEFAULT_ROUTINES` in `src/lib/routines.ts` (`7:00 AM` / `10:00 PM`) is left alone; it
is out of scope for these two frames either way.

---

## 7. Comparison — design vs the app as it stands today

App values read from `src/app/routines/morning-time.tsx`,
`src/app/routines/night-time.tsx`, `src/components/routines/kit.tsx`,
`src/components/routines/wheel.tsx`, plus `AppText.tsx` / `press-scale.tsx` for
inherited behaviour.

### 7.1 Shell and chrome

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| screen background | `#F4F3F0` | `RoutineShell` root `backgroundColor: '#F4F3F0'` | match |
| noise layer | absent | absent | match |
| status bar ink | `#1D1C1A` (dark glyphs) | `<StatusBar style="dark" />` on both screens | match |
| safe areas | canvas assumes 54 top / 34 bottom | `SafeAreaView edges={['top','bottom']}` | match |
| frame shadow | canvas chrome only | not built | match |

### 7.2 Back row

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| back label text | `Back` (both frames) | `RoutineBack` hard-codes `Back` | match |
| container x | `left:16` | `paddingLeft: 16` on the `PressScale` | match |
| app top | `10` | `marginTop: 10` on a 20-tall `justifyContent:'center'` box ⇒ content top ≈ **9.85** | match (±0.5) |
| gap | `9` | `gap: 9` | match |
| chevron | `11×19`, `viewBox 0 0 11 19`, `d="M9.5 1.5L2 9.5l7.5 8"` | identical `Svg`/`Path` | match |
| chevron paint | `#55534E`, `2.4`, round cap + join, `fill:none` | `stroke="#55534E" strokeWidth={2.4}` round/round, `fill="none"` | match |
| label type | `17 / 400 / #55534E` | `sans('400')`, `fontSize: 17`, `color: '#55534E'` | match |
| label tracking | `0` (none declared) | `AppText` drops the `body` variant's `-0.1` because the caller names `fontSize` without `letterSpacing` | match |

### 7.3 Question and captions

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| question app top | `78` | `10 + 20 + 48 = ` **78** | match |
| question box width | full 393, no padding | full width, no padding | match |
| question type | `22 / 500 / #1D1C1A`, centred | `sans('500')`, `fontSize: 22`, `#1D1C1A`, `center` | match |
| question leading | natural (none declared) | `AppText` `dropLeading` ⇒ deleted | match |
| Morning question text | `When should the morning check-in come?` | identical string | match |
| Nightly question text | `When should the nightly check-in come?` | identical string | match |
| `Select time` app top | `154` | `78 + 76 = ` **154** | match |
| `Select time` type | `14.5 / 600 / #2A2924`, centred, sentence case | `sans('600')`, `14.5`, `#2A2924`, `center` | match |
| `Select days` app top | `454` | `196 + 218 + 40 = ` **454** | match |
| `Select days` type | `14.5 / 600 / #2A2924` | same | match |

### 7.4 Wheel

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| wheel app top | `196` | `154 + 42 = ` **196** | match |
| column height | `218` | `COLUMN_H = 218` | match |
| band | `left 46`, app top `281`, `301 × 44`, `r11`, `rgba(0,0,0,0.08)` | `left: 46, width: 301, top: 85` inside a 196-top wheel ⇒ **281**, `height: 44, borderRadius: 11, 'rgba(0,0,0,0.08)'` | match |
| band paint order | under the numbers | absolute sibling declared first, `pointerEvents="none"` | match |
| column x / widths | `105/40`, `172/50`, `238/60` | `paddingLeft: 105`, widths `40` → gap `27` → `50` → gap `16` → `60` | match |
| column flex behaviour | fixed widths | `flexGrow: 0, flexShrink: 0` pinned on each `ScrollView` | match |
| selected row | `30 / lh 44 / #1D1C1A` | `STEPS[0] = { size: 30, leading: 44, color: '#1D1C1A' }` | match |
| ±1 row | `22 / lh 29 / rgba(90,88,82,0.55)` | `STEPS[1]` identical | match |
| ±2 row | `21 / lh 29 / rgba(120,117,110,0.5)` | `STEPS[2]` identical | match |
| ±3 row | `20 / lh 29 / rgba(140,137,130,0.45)` | `STEPS[3]` identical | match |
| row weight | `400` (inherited) | `sans('400')` | match |
| row spacing law | `36.5`, then `+29` per row | `away <= 1 ? d*36.5 : sign(d)*(36.5 + (away−1)*29)` | match |
| rows drawn | 3 either side, nothing beyond | render window `round(offset) ± 4`, and the ±4 row falls outside the 218 box | match |
| hour wrap | `… 12 → 1` | `HOURS = 1…12`, `loop` | match |
| minute wrap | `57 58 59 00 01 02 03` | `MINUTES = 00…59`, `loop` | match |
| period wrap | none | `PERIODS` rendered **without** `loop` | match |
| Nightly hour rows | `7 / 11 / 12 / [10] / 11 / 12 / 1` | `7 / 8 / 9 / [10] / 11 / 12 / 1` | **canvas is wrong; app is right** (§6.1) |
| Nightly period y | selected `PM` at `366 … 410`, 31px below the band centre | selected row centred on the band | **canvas is wrong; app is right** (§6.2) |
| wheel default value shown | `7:00 AM` / `10:30 PM` | `7:00 AM` / `10:00 PM` from `DEFAULT_ROUTINES` | sample content, not a spec (§6.4) |

### 7.5 Day chips

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| row app top | `494` | `454 + 40 = ` **494** | match |
| row inset | `left 34 / right 34`, `space-between` | `paddingHorizontal: 34`, `justifyContent: 'space-between'` | match |
| chip size | `38 × 38` | `width: 38, height: 38` | match |
| chip radius | `50%` ⇒ `19` | `borderRadius: 19` | match |
| chip touch height | — | `minHeight: 0` overrides `PressScale`'s 44, so the chip stays 38 tall | match |
| selected chip fill | `#131313` | `on ? '#131313' : …` | match |
| **selected chip label colour** | **`#F4F3F0`** | **`'#1D1C1A'` — unconditional, near-black on `#131313`** | **MISMATCH** |
| chip label type | `14 / 600` | `sans('600')`, `fontSize: 14` | match |
| chip labels + order | `Su M Tu W Th F Sa` | `DAY_LABELS = ['Su','M','Tu','W','Th','F','Sa']` | match |
| derived chip gap | `9.8333…` | same layout engine ⇒ same | match |
| unselected chip | not drawn anywhere in the bundle | fill `#EFEEEA`, label `#1D1C1A` | canvas silent — app invention, keep |
| chip pressed | not drawn | `PressScale` → `scale 0.96` | canvas silent |

### 7.6 Note and CTA

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| note app top | `622` | `532 + 90` from `flex:1, minHeight:90` ⇒ **622** on a 54/34-inset 852 phone | match |
| note inset | `left 36 / right 36` (321 wide) | `paddingHorizontal: 36` | match |
| note type | `15 / 400 / lh 22 / #55534E`, centred | `sans('400')`, `15`, `lineHeight: 22`, `#55534E`, `center` | match |
| note tracking | `0` | dropped by `AppText` (size named, tracking not) | match |
| note wrap hint | `text-wrap:pretty` | `AppText` sets `textWrap: 'pretty'` for `body` on web; native n/a | match |
| Morning note text | `Twenty seconds, first thing — you can change this any time.` | identical string, real em dash | match |
| Nightly note text | `Set it for the start of your riskiest hours — you can change this any time.` | identical string, real em dash | match |
| note → CTA gap | `24` | `<View style={{ height: 24 }} />` | match |
| CTA app top | `690` | stack lands it at **690** | match |
| CTA box | `left 16`, `361 × 48` | `marginHorizontal: 16` ⇒ 361 wide, `height: 48` | match |
| CTA radius | `25` | `borderRadius: 25` | match |
| CTA fill | `#131313` | `'#131313'` | match |
| CTA label | `Save time` (both) | `label="Save time"` on both screens | match |
| CTA label type | `17.5 / 600 / #FFFFFF` | `sans('600')`, `17.5`, `#FFFFFF` | match |
| CTA tracking | `0.2px` (last of two declarations) | `letterSpacing: 0.2` | match |
| **CTA pressed** | **`transform:scale(0.99)`** | **`PressScale` → `withTiming(0.96, { duration: 110 })`** | **MISMATCH** |
| CTA disabled | not drawn | `opacity: enabled ? 1 : 0.32`; neither screen passes `enabled`, so always 1 | canvas silent |
| CTA → bottom | `26` above the 34pt inset | `<View style={{ height: 26 }} />` | match |

### 7.7 Behaviour the frames imply

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| Morning back | `Back` chevron | `router.back()`, else `replace('/(app)/today')` | match |
| Morning forward | `Save time` | saves `morning`, saves days, `push('/routines/night-time')` | match |
| Nightly forward | `Save time` | saves `night`, saves days, `replace('/(app)/today')` | match |
| day toggle | all 7 on in the frame | `EVERY_DAY = [0..6]` default, toggle add/remove + sort | match |

---

## 8. What must change

Ordered. Two edits, one of which touches shared code.

1. **`src/components/routines/kit.tsx` — `CheckinPicker`, the day-chip label colour must
   follow the chip state.** Line 155 reads

   ```tsx
   <AppText style={[sans('600'), { fontSize: 14, color: '#1D1C1A' }]}>{label}</AppText>
   ```

   The `on` flag is already in scope on line 140. Make the colour conditional:
   selected ⇒ **`#F4F3F0`** (the canvas value), unselected ⇒ keep `#1D1C1A` on the
   `#EFEEEA` fill. Today every chip renders `#1D1C1A` on `#131313` — the exact bug the
   new bundle fixed. This single edit closes `Morning Check-in Time`,
   `Nightly Check-in Time` **and** `Settings Check-in Time`.

2. **`src/components/ui/press-scale.tsx` (or a prop on `RoutineCTA` in
   `src/components/routines/kit.tsx`) — the CTA's press scale is `0.99`, not `0.96`.**
   The frames declare `style-active="transform:scale(0.99);"` on the pill and nowhere
   else. `PressScale` animates to `0.96` for every consumer in the app, so changing the
   constant has app-wide blast radius; the contained fix is a `scaleTo`-style prop that
   `RoutineCTA` passes as `0.99`. Decide which, but the design value for this pill is
   **0.99**.

3. **No change — record the three canvas slips so nobody "fixes" the app toward them.**
   (a) Nightly hour column `7 / 11 / 12 / [10]` is a drawing error; `wheel.tsx` is right
   (§6.1). (b) Nightly period column `top:337` leaves the selected `PM` 31px below the
   band; `wheel.tsx` is right (§6.2). (c) The CTA's duplicate `letter-spacing` resolves
   to `0.2px`, which the app already uses (§6.3).

4. **No change — the unselected chip is undrawn.** No frame in the bundle shows an
   off-state chip, and `#EFEEEA` appears nowhere in the final bundle. The app's
   `#EFEEEA` fill is an invention that the canvas neither confirms nor contradicts.
   Leave it; flag it if a future bundle draws a partially-selected day row.

5. **No change — the wheel's sample times are not defaults.** The picker frames show
   `7:00 AM` / `10:30 PM` while `Settings` shows `8:00 AM` / `9:30 PM` for the same two
   routines. `DEFAULT_ROUTINES` stays as it is (§6.4).
