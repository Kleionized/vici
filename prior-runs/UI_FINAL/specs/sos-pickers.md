# Spec — SOS pickers: Where Are You · Name the Feeling · What's Feeding It

| Sticky | Frame label | Split file (final) | Pretty file | Prev / diff |
| --- | --- | --- | --- | --- |
| `29 · SOS — Where Are You` | `Cue Hue Picker` | `/Users/admin/Documents/tideline/.uifinal/final/Email Login/Cue-Hue-Picker.html` | `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/Cue-Hue-Picker.html` | prev exists + `/Users/admin/Documents/tideline/.uifinal/diffs/Cue-Hue-Picker.html.diff` (7335 → 7276 bytes, −59) |
| `29A · SOS — Name the Feeling` | `SOS Feeling Picker` | `/Users/admin/Documents/tideline/.uifinal/final/Email Login/SOS-Feeling-Picker.html` | `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/SOS-Feeling-Picker.html` | **new frame** — no prev, no diff |
| `29A2 · SOS — What's Feeding It` | `SOS Reason Picker` | `/Users/admin/Documents/tideline/.uifinal/final/Email Login/SOS-Reason-Picker.html` | `/Users/admin/Documents/tideline/.uifinal/pretty/final/Email Login/SOS-Reason-Picker.html` | **new frame** — no prev, no diff |

Target app files:

- `/Users/admin/Documents/tideline/src/components/urge/index.tsx` — `WherePage()` (line 975), `PlaceCard()` (line 933), `PLACES` (line 540), `PLACE_ART` / `PLACE_TOP` (lines 922–923), `PhoneCardArt()` / `LaptopCardArt()` / `BedCardArt()` (lines 836–920), `CARD_GRADIENT_START` / `CARD_GRADIENT_END` (lines 930–931), `UrgeFlow()` + `FLOW` (lines 2000–2126)
- `/Users/admin/Documents/tideline/src/app/urge.tsx` — 11-line route wrapper, renders `<UrgeFlow />`; **no change needed unless the flow gains route-level steps**
- Read-only reference for the row recipe already in the codebase: `/Users/admin/Documents/tideline/src/components/MoodLogger.tsx` — `ReasonRow()` (line 489), `ReasonIcon()` (line 407), `REASONS` (line 67), `BoardTitle()` (line 532), `BoardSub()` (line 541)

Sticky numbers were recovered from `/Users/admin/Documents/tideline/UI Final/project/Email Login.dc.html` by taking the Marker-Felt note that immediately precedes each `data-screen-label` in document order.

---

## 0. How to read every number below

**Coordinate systems.** The canvas frame is `393 × 852` and includes a 54px status bar the app never builds. All three frames put their content inside a **sheet** div at frame `top:52`, so the sheet is `393 × 800`. Every `top` quoted in the element tables is **sheet-relative**, because that is the number written literally in the CSS and the number the app already uses verbatim (`PaperSheet` gives its children a content box whose top edge is `insets.top − 2`, i.e. frame y 52 when the inset is the 54 this frame models). Each table also prints:

- **frame top** = sheet top + 52
- **status-bar-deducted top** = frame top − 54 = sheet top − 2

Use the sheet-relative column when writing code inside `PaperSheet`. `left` / `right` carry over unchanged.

**Pretty-printer artifacts.** In `.uifinal/pretty/**` every declaration is prefixed with `| ` and every text node with `· `. Neither is content. Entities in the source decode as: `&mdash;` → `—`, `&rsquo;` → `’`, `&middot;` → `·`.

**Not app chrome.** The frame's own `box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` is the canvas board's device bezel. Do not port it. The 54px status-bar row (clock + three SVGs) is likewise canvas-only; its markup is transcribed in §2.6 for completeness only.

**No visualization section.** None of the three frames contains a chart, ring, gauge, calendar, streak visual or any custom drawing. Every glyph is a 21 × 21 line icon inside a 38pt disc, transcribed verbatim in §3.4 / §4.4 / §5.4. Nothing was skipped.

---

## 1. Flow context — the two new frames are inserted, and four old ones are gone

Sticky chain in `UI Final`, in document order:

| Sticky | Frame label | App counterpart today |
| --- | --- | --- |
| `28 · SOS — First 90 Seconds` | `Cue Intro Modal` | `IntroPage()` |
| `28B · SOS — How Strong` | `SOS Strength` | `StrengthPage()` |
| `29 · SOS — Where Are You` | `Cue Hue Picker` | `WherePage()` |
| **`29A · SOS — Name the Feeling`** | **`SOS Feeling Picker`** | **none** |
| **`29A2 · SOS — What's Feeding It`** | **`SOS Reason Picker`** | **none** |
| `29B · SOS — Step I · Phone Down` | `Cue Set Confirmation` | `MovePage index=0` |
| `30 · SOS — Step II · Out of Bed` | `Surf Step 1` | `MovePage index=1` |
| `31 · SOS — Step III · Cold Water` | `Surf Step 3` | `MovePage index=2` |
| `33 · SOS — The Wave Passed` | `DonePage()` | `DonePage()` |
| `34 · SOS — Slipped` | `Relapse Log` | `/relapse` |

Two facts that follow from this and that the parent agent should weigh before scoping:

1. `FLOW` in `src/components/urge/index.tsx:2001` is `['intro','strength','where','screen','move','cold','sos','done']`. The canvas flow is `intro → strength → where → **feeling** → **reason** → screen → move → cold → done`. Two steps must be inserted after `'where'`.
2. `.uifinal/diff-email-login.txt` lists `Urge SOS Breathe`, `SOS Number Tap`, `SOS Odd One Out` and `SOS Settings` under **REMOVED**, and sticky `32` is now `Journey — The Campaign`, not an SOS stage. The dark SOS block the app renders (`BreatheStage`, `TapStage`, `OddStage`, `WaveStage`, `SosSettingsSheet`, lines 1152–1897) **has no frame in the final bundle at all** — the canvas now runs Step III straight into "The Wave Passed". That is outside this spec's three frames; it is recorded here as evidence, not actioned.

---

## 2. Shared chrome — byte-identical across all three frames

Verified line by line: lines 1–95 of the three pretty files are identical apart from `data-screen-label`. The Continue pill (last block) is identical in all three.

### 2.1 Frame root

| Property | Value |
| --- | --- |
| width × height | `393px × 852px` |
| position / overflow | `relative` / `hidden` |
| background | `#EDECE7` |
| font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` |
| font smoothing | `-webkit-font-smoothing:antialiased` |
| flex-shrink | `0` |
| box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` — canvas bezel, do not port |

### 2.2 The sheet

| Property | Value | App |
| --- | --- | --- |
| position | `absolute; left:0; right:0; top:52px; bottom:0` | `PaperSheet` `marginTop: Math.max(0, insets.top - 2)` |
| computed size | `393 × 800` | flex |
| border-radius | `24px 24px 0 0` (TL 24, TR 24, BR 0, BL 0) | `borderTopLeftRadius: 24, borderTopRightRadius: 24` |
| background | `#F4F3F0` | `SHEET_PAPER = '#F4F3F0'` |
| overflow | `hidden` | `overflow: 'hidden'` |
| ground behind it | `#EDECE7` | `SHEET_EDGE = '#EDECE7'` |

### 2.3 Back affordance (top-left)

| Property | Value | frame top | deducted top |
| --- | --- | --- | --- |
| container | `position:absolute; left:16px; top:14px; display:flex; align-items:center; gap:9px` | 66 | 12 |
| chevron svg | `width="11" height="19" viewBox="0 0 11 19"` | — | — |
| chevron path | `fill="none" stroke="#55534E" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"` | — | — |
| label | `font-size:17px; font-weight:400; color:#55534E`, text `Back` | — | — |
| letter-spacing / line-height | not declared (platform default) | — | — |

```
M9.5 1.5L2 9.5l7.5 8
```

### 2.4 Headline and sub-line

| Frame | Headline text | Sub text |
| --- | --- | --- |
| 29 Hue | `Where are you right now?` | `The first move depends on it. Be honest — nobody's watching.` (ASCII apostrophe in source) |
| 29A Feeling | `What’s underneath it?` (`&rsquo;`) | `The urge is rarely the whole story. Name the feeling under it and it loses most of its grip.` |
| 29A2 Reason | `What’s feeding it?` (`&rsquo;`) | `Urges borrow fuel from somewhere. Point at the source — picking it is half the defusing.` |

| Property | Headline | Sub (29) | Sub (29A, 29A2) |
| --- | --- | --- | --- |
| position | `absolute; left:0; right:0; top:62px` | `absolute; left:40px; right:40px; top:106px` | `absolute; left:36px; right:36px; top:106px` |
| frame top / deducted | 114 / 60 | 158 / 104 | 158 / 104 |
| text-align | `center` | `center` | `center` |
| font-size | `22px` | `15.5px` | `15.5px` |
| font-weight | `500` | `400` | `400` |
| line-height | not declared | `23px` | `23px` |
| letter-spacing | `0.1px` | not declared | not declared |
| colour | `#1D1C1A` | `#55534E` | `#55534E` |
| text-wrap | not declared | not declared | `pretty` |
| max-lines / truncation | none | none | none |

The **only** typographic difference between the old frame and the two new ones is the sub-line inset (40 vs 36) and `text-wrap:pretty`. Everything else in the header block matches character for character.

Do **not** reuse `MoodLogger.BoardTitle` / `BoardSub` for these headers: they encode the check-in boards' numbers, which differ — `top: 64` vs 62, `top: 104` vs 106, `fontSize: 15` with no `lineHeight` vs `15.5 / 23`, and `left: 0, right: 0` vs `left/right: 36|40`.

### 2.5 Continue pill (identical in all three)

| Property | Value | frame top | deducted top |
| --- | --- | --- | --- |
| box | `position:absolute; left:24px; right:24px; top:688px; height:52px` (computed `345 × 52`) | 740 | 686 |
| border-radius | `26px` (all four corners) | — | — |
| background | `#131313` | — | — |
| layout | `display:flex; align-items:center; justify-content:center` | — | — |
| pressed | `style-active="transform:scale(0.99);"` | — | — |
| label | `font-size:17.5px; font-weight:600; letter-spacing:0.3px; color:#FFFFFF`, text `Continue` | — | — |
| bottom-anchored equivalent | `bottom: 800 − (688 + 52) = 60` | — | — |
| disabled state | **not drawn** — the pill is solid ink on all three frames even where nothing is selected | — | — |

### 2.6 Status bar (canvas-only; the app draws none of this)

`position:absolute; top:0; left:0; right:0; height:54px; display:flex; align-items:center; justify-content:space-between; padding:6px 32px 0 46px; box-sizing:border-box; z-index:20`. Clock `font-size:17px; font-weight:600; color:#1D1C1A; letter-spacing:-0.2px`, text `9:41`. Icon cluster `display:flex; align-items:center; gap:7px`.

Signal `svg 19×12 viewBox 0 0 19 12` — four `rect fill="#1D1C1A"`: `(0, 7.5, 3.2, 4.5, rx .7)`, `(4.8, 5, 3.2, 7, rx .7)`, `(9.6, 2.5, 3.2, 9.5, rx .7)`, `(14.4, 0, 3.2, 12, rx .7)`.
Wi-Fi `svg 17×12 viewBox 0 0 17 12` + `circle cx 8.5 cy 10.5 r 1.5 fill #1D1C1A`:

```
M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z
M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z
```

Battery `svg 27×13 viewBox 0 0 27 13`: `rect (0.5, 0.5, 23, 12, rx 3.5) stroke #1D1C1A stroke-opacity .35 fill none`, `rect (2, 2, 20, 9, rx 2) fill #1D1C1A`, and the nub:

```
M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z
```

with `fill="#1D1C1A" fill-opacity="0.4"`.

---

## 3. Frame `29` — Cue Hue Picker ("Where are you right now?")

### 3.1 What the diff did

`.uifinal/diffs/Cue-Hue-Picker.html.diff` replaces the entire body between the sub-line and the Continue pill. Removed: three `248 × 136` gradient cards at `left:72px`, `top:188 / 340 / 492`, `border-radius:14px`, each carrying `background:linear-gradient(150deg, …)` over a `noise-dark.png` tile at `opacity:0.2`, a bespoke prop illustration, a `19px/500` label at `left:14px; bottom:14px`, and a 24pt selection circle at `right:16px; bottom:16px` (`inset 0 0 0 1.5px rgba(0,0,0,0.25)` when off). Added: **five** flat white list rows. The header block, the back affordance and the Continue pill are untouched by the diff. The three card labels (`Phone in hand`, `At a laptop`, `In bed`) are gone; only `In bed` survives, as row 2 of the new list.

The diff file is truncated at 460 lines mid-hunk; the final frame was read in full (360 lines) and is the authority for everything below.

### 3.2 Row geometry

Rows share one recipe; only `top`, the fill of the icon disc, the glyph, the label weight and the presence of the trailing dot vary.

| Property | Value |
| --- | --- |
| position | `absolute; left:24px; right:24px` → computed width `345` |
| height | `60px` |
| border-radius | `18px`, all four corners |
| background | `#FFFFFF` |
| ring — **selected** | `box-shadow:0 0 0 1.6px #131313` (outer, non-inset) |
| ring — default | `box-shadow:0 0 0 1px rgba(0,0,0,0.10)` |
| layout | `display:flex; align-items:center; gap:14px; padding:0 18px` |
| cursor / pressed | `pointer` / `style-active="transform:scale(0.99);"` |
| z-order | source order, no `z-index` anywhere in the sheet |
| overflow | not declared (visible) |

| # | Label | sheet top | frame top | deducted top | State |
| --- | --- | --- | --- | --- | --- |
| 1 | `Somewhere private` | 170 | 222 | 168 | **selected** |
| 2 | `In bed` | 242 | 294 | 240 | default |
| 3 | `A public space` | 314 | 366 | 312 | default |
| 4 | `At work or school` | 386 | 438 | 384 | default |
| 5 | `Out and about` | 458 | 510 | 456 | default |

Pitch 72 = height 60 + gap 12. List spans sheet 170 → 518. Empty band from 518 to the pill at 688 = 170pt; the frame draws **nothing** in it (contrast the two new frames, which put a footnote at 660).

### 3.3 Row anatomy (row-local x, row is 345 wide)

| Part | Selected | Default | x range |
| --- | --- | --- | --- |
| icon disc | `38 × 38`, `border-radius:50%`, `background:#131313`, `flex-shrink:0`, centred flex | same box, `background:#F1EFE9` | 18 → 56 |
| glyph | `svg 21×21 viewBox="0 0 24 24" fill="none" stroke="#F4F3F0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"` | identical but `stroke="#1D1C1A"` | centred in the disc (1.5pt inset each side) |
| gap | `14` | `14` | 56 → 70 |
| label | `flex:1; font-size:15px; font-weight:600; color:#1D1C1A` | `font-weight:500`, otherwise identical | 70 → 306 (selected) / 70 → 327 (default) |
| trailing dot | `7 × 7; border-radius:50%; background:#131313; flex-shrink:0` | **element absent** | 320 → 327 |
| padding-right | `18` | `18` | 327 → 345 |

Label box width: `345 − 18 − 38 − 14 − 18 = 257` on a default row; `345 − 18 − 38 − 14 − 7 − 14 − 18 = 236` on the selected row. No `line-height`, `letter-spacing`, `text-transform` or truncation is declared on the label.

### 3.4 Glyphs — verbatim

All five share `svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`.

Row 1 `Somewhere private` — `rect x="6" y="3.5" width="12" height="17" rx="1.6"` + `circle cx="14.6" cy="12.5" r="1.1"`.

Row 2 `In bed`:

```
M3.5 18.5v-8M3.5 14.5h17v4M3.5 14.5V9h6.6c2.4 0 3.7 1.3 3.7 3.3v2.2
```

plus `circle cx="7.1" cy="11.4" r="1.2"`.

Row 3 `A public space` — `circle cx="8.5" cy="9" r="3.2"`, `circle cx="16.5" cy="9" r="3.2"`, plus:

```
M2.5 20c.8-3.4 3.2-5 6-5 1.4 0 2.7.4 3.5 1.2.8-.8 2.1-1.2 3.5-1.2 2.8 0 5.2 1.6 6 5
```

Row 4 `At work or school` — `rect x="3" y="8" width="18" height="12" rx="2.5"` plus:

```
M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18
```

Row 5 `Out and about`:

```
M12 21s7-5.4 7-11a7 7 0 0 0-14 0c0 5.6 7 11 7 11z
```

plus `circle cx="12" cy="10" r="2.6"`.

### 3.5 States the frame shows

Default, selected, and a declared pressed transform (`scale(0.99)`) on every row and on the pill. No disabled, no empty, no error state is drawn. Exactly one row is selected → **single-select (radio)**.

---

## 4. Frame `29A` — SOS Feeling Picker ("What’s underneath it?")

New frame. 496 pretty lines, read in full.

### 4.1 Row geometry — 66 tall, two lines of text

| Property | Value |
| --- | --- |
| position | `absolute; left:24px; right:24px` → width `345` |
| height | **`66px`** (the only structural change from the 29/29A2 row) |
| border-radius | `18px` |
| background | `#FFFFFF` |
| ring — selected / default | `0 0 0 1.6px #131313` / `0 0 0 1px rgba(0,0,0,0.10)` |
| layout | `display:flex; align-items:center; gap:14px; padding:0 18px` |
| pressed | `transform:scale(0.99)` |

| # | Title | Note (second line) | sheet top | frame top | deducted top | State |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `Hungry` | `Low fuel reads as craving. Eat first.` | 170 | 222 | 168 | default |
| 2 | `Angry` | `Heat looking for the nearest exit.` | 246 | 298 | 244 | default |
| 3 | `Lonely` | `Reaching for any kind of contact.` | 322 | 374 | 320 | default |
| 4 | `Tired` | `Defenses are thinnest when drained.` | 398 | 450 | 396 | default |
| 5 | `Bored` | `An empty minute asking to be filled.` | 474 | 526 | 472 | **selected** |
| 6 | `Stressed` | `Pressure hunting a release valve.` | 550 | 602 | 548 | default |

Pitch 76 = height 66 + gap 10. List spans sheet 170 → 616.

### 4.2 Text block

The label slot is a wrapper div, not a bare span:

| Part | Value |
| --- | --- |
| wrapper | `flex:1; min-width:0` — width `257` default, `236` on the selected row |
| title | `font-size:15px; font-weight:500` (`600` when selected); `color:#1D1C1A`; no line-height / tracking declared |
| note | `margin-top:1px; font-size:12.5px; font-weight:400; color:#8B8882` |
| note truncation | `white-space:nowrap; overflow:hidden; text-overflow:ellipsis` → **exactly one line, ellipsised**, which `min-width:0` on the wrapper is there to permit |
| trailing dot | selected row only: `7 × 7; border-radius:50%; background:#131313; flex-shrink:0` |

### 4.3 Footnote

| Property | Value | frame top | deducted top |
| --- | --- | --- | --- |
| box | `absolute; left:24px; right:24px; top:660px` | 712 | 658 |
| text-align | `center` | — | — |
| type | `font-size:12px; font-weight:500; color:#A8A5A0` | — | — |
| text | `H·A·L·T — the four states that fake an urge best.` (source `H&middot;A&middot;L&middot;T &mdash; …`) | — | — |

Reading note, not a contradiction: the footnote says "four states" while six rows are drawn. Rows 1–4 are exactly H(ungry) · A(ngry) · L(onely) · T(ired) in that order; `Bored` and `Stressed` are additions past the mnemonic. Keep the row order — it is what makes the footnote true.

### 4.4 Glyphs — verbatim

Shared attributes as in §3.4 (`21×21`, `viewBox 0 0 24 24`, `stroke-width 2`, both round joins/caps; `stroke="#1D1C1A"`, or `#F4F3F0` on the selected `Bored` row).

`Hungry`:

```
M4.5 10.5h15a7.5 6.5 0 0 1-15 0z
M9.5 7c0-1 .7-1.3.7-2.3M13.8 7c0-1 .7-1.3.7-2.3
```

`Angry`:

```
M13 2L5 13.5h5.5L10 22l8-11.5h-5.5z
```

`Lonely` — `circle cx="12" cy="8" r="3.6"` plus:

```
M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6
```

`Tired`:

```
M14.5 3.5a8.5 8.5 0 1 0 6 12.5 8 8 0 0 1-6-12.5z
```

`Bored` (selected — stroke `#F4F3F0`):

```
M3.5 13c2.4-3.4 4.6-3.4 7 0s4.6 3.4 7 0
M6.5 7h.01M14.5 7h.01
```

`Stressed`:

```
M3 13.5h3.5L9 8l3 9 2.5-6.5 1.5 3H21
```

### 4.5 States

Default, selected (one row), pressed `scale(0.99)`. Single-select (radio) — one dot, one ring. No disabled/empty state drawn.

---

## 5. Frame `29A2` — SOS Reason Picker ("What’s feeding it?")

New frame. 468 pretty lines, read in full.

### 5.1 Row geometry — same 60pt box as frame 29, but every row carries a 24pt check circle

| # | Label | sheet top | frame top | deducted top | State |
| --- | --- | --- | --- | --- | --- |
| 1 | `Relationship` | 170 | 222 | 168 | **selected** |
| 2 | `Work or school` | 242 | 294 | 240 | **selected** |
| 3 | `Family` | 314 | 366 | 312 | default |
| 4 | `Money` | 386 | 438 | 384 | default |
| 5 | `Health` | 458 | 510 | 456 | default |
| 6 | `No clear reason` | 530 | 582 | 528 | default |

Box, radius, fills, rings, gap, padding and pressed transform are identical to §3.2 (height `60`, radius `18`, `#FFFFFF`, `0 0 0 1.6px #131313` / `0 0 0 1px rgba(0,0,0,0.10)`, `gap:14px`, `padding:0 18px`). Pitch 72. List spans sheet 170 → 590.

### 5.2 Trailing control — a checkbox, not a dot

| Part | Selected | Default |
| --- | --- | --- |
| box | `24 × 24; border-radius:50%; background:#131313; display:flex; align-items:center; justify-content:center; flex-shrink:0` | `24 × 24; border-radius:50%; box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.22); box-sizing:border-box; flex-shrink:0` (no background) |
| glyph | `svg 12×12 viewBox="0 0 14 14"`, path below, `stroke="#F4F3F0" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"` | none |

```
M2.5 7.5l3 3 6-7
```

Label box width with the control present: `345 − 18 − 38 − 14 − 24 − 14 − 18 = 219`. Label is `flex:1; font-size:15px; font-weight:600` when selected, `500` when not, `color:#1D1C1A`, single line, no declared truncation.

**Two rows are selected at once.** That, plus the checkbox affordance (vs the radio dot on 29 and 29A), is the frame's evidence that this picker is **multi-select**. The old card ring on the removed 29 cards used `rgba(0,0,0,0.25)`; this frame uses `rgba(0,0,0,0.22)` — transcribe 0.22, do not carry the old value forward.

### 5.3 Footnote

Same box as §4.3 — `absolute; left:24px; right:24px; top:660px` (frame 712 / deducted 658), `text-align:center`, `font-size:12px; font-weight:500; color:#A8A5A0`. Text: `Nothing here is an excuse — it’s a map.` (source `… &mdash; it&rsquo;s a map.`). Gap from last row bottom (590) to footnote top: 70.

### 5.4 Glyphs — verbatim

Shared attributes as in §3.4. Rows 1 and 2 stroke `#F4F3F0` on an ink disc; rows 3–6 stroke `#1D1C1A` on `#F1EFE9`.

`Relationship`:

```
M12 20.5s-7.6-4.7-9.3-9.1A5.2 5.2 0 0 1 12 6.4a5.2 5.2 0 0 1 9.3 5c-1.7 4.4-9.3 9.1-9.3 9.1z
```

`Work or school` — `rect x="3" y="8" width="18" height="12" rx="2.5"` plus (identical to frame 29 row 4):

```
M9 8V6a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18
```

`Family`:

```
M4 11.5 12 4l8 7.5
M6.5 10v10h11V10
```

`Money` — `rect x="3" y="7" width="18" height="10.5" rx="2.2"` + `circle cx="12" cy="12.2" r="2.5"` plus:

```
M6.2 10h.01M17.8 14.5h.01
```

`Health`:

```
M3 12.5h4l2.5-6 3 11 2.5-6.5H21
```

`No clear reason` — `circle cx="12" cy="12" r="8.5"` plus:

```
M9.8 9.7a2.3 2.3 0 0 1 4.4.5c0 1.5-2.2 1.7-2.2 3.2M12 16.6h.01
```

### 5.5 States

Default, selected (×2), pressed `scale(0.99)`. No disabled/empty state drawn — in particular the Continue pill is solid ink even though a multi-select could legitimately be empty.

---

## 6. Comparison — design vs the app as it stands today

### 6.1 Frame `29` Cue Hue Picker vs `WherePage()` / `PlaceCard()`

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| Sheet ground / paper | `#EDECE7` / `#F4F3F0`, radius `24 24 0 0`, top 52 | `SHEET_EDGE '#EDECE7'` / `SHEET_PAPER '#F4F3F0'`, `borderTopLeft/RightRadius: 24`, `marginTop: insets.top − 2` | match |
| Back container | `left:16px; top:14px; gap:9px` | `left: 16, top: 14, gap: 9` (line 983) | match |
| Back chevron | `11×19`, `M9.5 1.5L2 9.5l7.5 8`, `#55534E`, `2.4`, round/round | identical (lines 984–986) | match |
| Back label | `17px / 400 / #55534E` | `sans('400')`, `fontSize: 17`, `SHEET_MUTED` | match |
| Headline | top 62, `22px / 500 / ls 0.1 / #1D1C1A`, centred, `left:0; right:0` | `top: 62, fontSize: 22, letterSpacing: 0.1, SHEET_TEXT`, `sans('500')`, `center` | match |
| Sub-line | `left:40; right:40; top:106`, `15.5 / 400 / lh 23 / #55534E` | `left: 40, right: 40, top: 106, fontSize: 15.5, lineHeight: 23, SHEET_MUTED` | match |
| Sub-line copy | `The first move depends on it. Be honest — nobody's watching.` | same string, `nobody&apos;s` | match |
| **Option count** | **5** (`Somewhere private`, `In bed`, `A public space`, `At work or school`, `Out and about`) | **3** (`PLACES`: `Phone in hand`, `At a laptop`, `In bed`) | **MISMATCH** |
| **Option box** | `left:24; right:24` → `345 × 60`, radius 18 | `left: 72`, `248 × 136`, radius 14 (`PlaceCard`, line 941) | **MISMATCH** |
| **Option tops** | 170 / 242 / 314 / 386 / 458 (pitch 72) | `PLACE_TOP` 188 / 340 / 492 (pitch 152) | **MISMATCH** |
| **Option fill** | flat `#FFFFFF` | `LinearGradient` per place, `locations={[0, 0.6, 1]}`, `CARD_GRADIENT_START {x:0.256,y:-0.27}` → `END {x:0.744,y:1.27}`; stops `['#ECECE8','#D6D5D0','#B4B1AB']` / `['#E4E4E0','#C6C5C0','#A8A5A0']` / `['#8B8882','#131313','#131313']` | **MISMATCH** (delete) |
| **Noise texture** | none | `Image source={NOISE_DARK} contentFit="cover" opacity 0.2` (line 949) | **MISMATCH** (delete) |
| **Per-option art** | none — a 38pt disc + 21pt line glyph | `PhoneCardArt` / `LaptopCardArt` / `BedCardArt` (lines 836–920), incl. `SoftBlob` washes and `boxShadow: '0 0 12px 4px rgba(226,186,120,0.4)'` | **MISMATCH** (delete) |
| **Icon disc** | `38 × 38`, `50%`, `#131313` selected / `#F1EFE9` default | absent | **MISMATCH** |
| **Glyphs** | five paths, §3.4 | absent | **MISMATCH** |
| **Label type** | `15px / 500` (`600` selected) / `#1D1C1A`, `flex:1`, left-aligned at row x 70 | `sans('500')`, `fontSize: 19`, `left: 14, bottom: 14`, `#FFFFFF` on the bed card (line 951) | **MISMATCH** |
| **Selected ring** | `0 0 0 1.6px #131313` on the row | none — selection lives only in the corner circle | **MISMATCH** |
| **Default ring** | `0 0 0 1px rgba(0,0,0,0.10)` | none | **MISMATCH** |
| **Selected marker** | `7 × 7` ink dot, `flex-shrink:0`, at row x 320–327 | `24 × 24` ink circle + `12×12` check `M2.5 7.5l3 3 6-7` at `right:16, bottom:16` | **MISMATCH** |
| **Unselected marker** | element absent | `24 × 24`, `inset 0 0 0 1.5px rgba(0,0,0,0.25)` | **MISMATCH** |
| Continue pill box | `left:24; right:24; top:688; 345 × 52`, radius 26, `#131313` | `left: 24, right: 24, bottom: 60, height: 52, borderRadius: 26, SHEET_INK` (lines 1002–1012) | match (bottom-anchored = 688 in an 800pt sheet; deliberate, per the code comment) |
| Continue label | `17.5 / 600 / ls 0.3 / #FFFFFF` | `sans('600'), fontSize: 17.5, letterSpacing: 0.3, '#FFFFFF'` | match |
| Pressed transform | `scale(0.99)` on rows and pill | `PressScale` → `withTiming(0.96, 110ms)` in / `withTiming(1, 160ms)` out (`src/components/ui/press-scale.tsx:25`) | **MISMATCH** (global primitive — flag, don't fork it in this screen alone) |
| Row hit target | 60pt | `PressScale` default `minHeight: 44` — harmless at 60, but must be overridden with `minHeight: 60` the way `MoodLogger.ReasonRow` does, or a shorter row would inflate | note |
| Selection default | row 1 selected on load | `useState<UrgePlace>('phone')` → first entry selected | match in spirit |
| Downstream coupling | 5 keys | `SCREEN_STEP` / `MOVE_STEP` are `Record<UrgePlace, …>` keyed by 3 places (lines 546–556) | **MISMATCH** — see §7.6 |

### 6.2 Frame `29A` SOS Feeling Picker vs the app

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| Screen exists | sticky `29A`, between Where-are-you and Step I | **no screen, no route, no component** — `FLOW` (line 2001) jumps `'where' → 'screen'` | **MISMATCH** |
| Headline | top 62, `What’s underneath it?`, `22 / 500 / ls 0.1 / #1D1C1A` | absent | **MISMATCH** |
| Sub-line | `left:36; right:36; top:106`, `15.5 / 400 / lh 23 / #55534E`, `text-wrap:pretty` | absent | **MISMATCH** |
| Rows | 6 × `345 × 66`, radius 18, tops 170/246/322/398/474/550 | absent | **MISMATCH** |
| Two-line label | title `15 / 500|600`, note `12.5 / 400 / #8B8882` single-line ellipsis, `margin-top:1px` | absent | **MISMATCH** |
| Icon discs + glyphs | 6 glyphs, §4.4 | `MoodLogger.ReasonIcon` already carries three of them byte-for-byte: `sleep` = `Tired`, `bolt` = `Angry`, `person` = `Lonely`. `Hungry`, `Bored`, `Stressed` have no equivalent (`pulse` is `M2.5 12.5h4l2-5 3.5 10 2.5-6 1.5 3h5.5`, **not** the `Stressed` path) | **MISMATCH** — 3 reusable, 3 new |
| Selection model | single-select, `7 × 7` ink dot + `1.6px` ring | absent | **MISMATCH** |
| Footnote | top 660, `12 / 500 / #A8A5A0`, `H·A·L·T — the four states that fake an urge best.` | absent | **MISMATCH** |
| Continue pill | as §2.5 | absent | **MISMATCH** |
| Persistence | a feeling is picked but the frame says nothing about storage | `events` table has `trigger`, `precedingState`, `severity`, `reopens` — **no `feeling` field** (`convex/schema.ts:130–139`) | **MISMATCH** — decide before wiring |

### 6.3 Frame `29A2` SOS Reason Picker vs the app

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| Screen exists | sticky `29A2` | **absent** | **MISMATCH** |
| Headline / sub | top 62 `What’s feeding it?`; sub `left:36; right:36; top:106`, `15.5 / 400 / lh 23`, `text-wrap:pretty` | absent | **MISMATCH** |
| Row box | `345 × 60`, radius 18, `#FFFFFF`, rings `1.6px #131313` / `1px rgba(0,0,0,0.10)`, `gap:14`, `padding:0 18` | `MoodLogger.ReasonRow` (line 489) is **already this exact recipe**, including `height: 60, minHeight: 60, borderRadius: 18, borderCurve: 'continuous'` and both rings | reusable — see §7.4 |
| Trailing control | `24 × 24`, ink fill + `12×12` check when on, `inset 0 0 0 1.5px rgba(0,0,0,0.22)` when off | `ReasonRow` uses exactly `rgba(0,0,0,0.22)` and the same check path | reusable |
| Row tops | 170 / 242 / 314 / 386 / 458 / 530 | `MoodLogger` reason list is laid out with a 12 gap from top 206 in its own board | **MISMATCH** — retop at 170 |
| Labels | `Relationship`, `Work or school`, `Family`, `Money`, `Health`, `No clear reason` | `REASONS` (line 67) is a different 13-item vocabulary (`Poor sleep`, `Work stress`, …) | **MISMATCH** — new list |
| Glyphs | 6 paths, §5.4 | only `work` matches byte-for-byte. `home` is `M3.5 10.5 12 3.5l8.5 7` / `M5.5 9.8V20.5h13V9.8` — **not** the `Family` path `M4 11.5 12 4l8 7.5` / `M6.5 10v10h11V10`. `coin` (circle + S) is not the `Money` banknote. `pulse` is not the `Health` path. No heart, no question-mark glyph. | **MISMATCH** — 1 reusable, 5 new |
| Selection model | multi-select, two rows on | absent | **MISMATCH** |
| Footnote | top 660, `12 / 500 / #A8A5A0`, `Nothing here is an excuse — it’s a map.` | absent | **MISMATCH** |
| Continue pill | as §2.5 | absent | **MISMATCH** |
| Persistence | multi-select | `dailyCheckins.reasons: v.optional(v.array(v.string()))` exists but is the check-in table, not `events` | **MISMATCH** — decide before wiring |

---

## 7. What must change — ordered

1. **`src/components/urge/index.tsx` — rebuild `WherePage`'s option list.** Delete `PlaceCard` (line 933), `PLACE_ART` / `PLACE_TOP` (922–923), `PhoneCardArt` / `LaptopCardArt` / `BedCardArt` (836–920), `CARD_GRADIENT_START` / `CARD_GRADIENT_END` (930–931), and the `stops` / `dark` members of `PLACES` (540–544). Replace with five 345 × 60 white rows at sheet tops 170 / 242 / 314 / 386 / 458 built to §3.2–§3.3, keyed in the order `Somewhere private, In bed, A public space, At work or school, Out and about`. Selected = `0 0 0 1.6px #131313` + ink disc + label `600` + a 7 × 7 ink dot; default = `0 0 0 1px rgba(0,0,0,0.10)` + `#F1EFE9` disc + label `500` + no trailing element. Keep headline, sub-line, back and pill exactly as they are — all four already match.
2. **`src/components/urge/index.tsx` — add a shared picker row primitive** rather than three copies. The row differs across the three frames in only two ways: height (60 vs 66) and trailing control (`none | 7pt dot | 24pt checkbox`). Model it as one component with `height`, `trailing: 'none' | 'dot' | 'check'`, and an optional second text line. `MoodLogger.ReasonRow` (line 489) is the reference implementation and already carries the exact ring, disc, gap, padding, radius and check-circle values — mirror it, don't import it (it hard-codes the checkbox trailing and `accessibilityRole="checkbox"`).
3. **`src/components/urge/index.tsx` — add `FeelingPage`** (sticky 29A): headline `What’s underneath it?` at top 62; sub at `left:36 right:36 top:106`, `15.5/23`; six 66pt rows at 170 / 246 / 322 / 398 / 474 / 550 with the title + ellipsised 12.5px note of §4.1–§4.2; footnote at top 660; the standard pill. Single-select, `accessibilityRole="radio"`. Reuse `MoodLogger.ReasonIcon`'s `sleep`/`bolt`/`person` geometry for `Tired`/`Angry`/`Lonely`, but re-declare them with `strokeLinecap="round"` — the canvas sets round caps on every glyph and `sleep`/`work` in `MoodLogger` omit `strokeLinecap`, which changes the open subpath ends. Add new paths for `Hungry`, `Bored`, `Stressed` from §4.4.
4. **`src/components/urge/index.tsx` — add `ReasonPage`** (sticky 29A2): headline `What’s feeding it?`; sub as above; six 60pt rows at 170 / 242 / 314 / 386 / 458 / 530 with the 24pt checkbox of §5.2 on **every** row; footnote at top 660; the standard pill. **Multi-select** — hold a `Set`/array, `accessibilityRole="checkbox"`, and allow zero or many. Add new paths for `Relationship`, `Family`, `Money`, `Health`, `No clear reason` from §5.4; only `Work or school` may reuse `MoodLogger.ReasonIcon`'s `work` geometry (add the round cap).
5. **`src/components/urge/index.tsx` — extend `FLOW`** (line 2001) to `['intro','strength','where','feeling','reason','screen','move','cold','sos','done']` and render the two new pages in `UrgeFlow` (lines 2097–2124), keeping `back()` working so the new frames' Back affordance walks the chain. The two new frames draw a Back control, so they are `back`-style pages like `WherePage`, not `close`-style like `MovePage`.
6. **`src/components/urge/index.tsx` — decide the 5-place → step-copy mapping.** `SCREEN_STEP` and `MOVE_STEP` (546–556) are `Record<UrgePlace, …>` over three keys, and the downstream frames (`Cue Set Confirmation`, `Surf Step 1`, `Surf Step 3`) still draw the phone/bed copy verbatim. The canvas does not state which of the five new places gets which copy — this is an inference and must be labelled as one. Evidence-supported reading: `In bed` → the existing `bed` copy; `Somewhere private` → `phone`; `A public space`, `At work or school`, `Out and about` → `phone` as well, since the `laptop` copy ("Shut the laptop") no longer has an option that names a laptop. Keep the `laptop` strings only if a laptop option is reinstated.
7. **Persistence — raise before wiring.** Neither new frame states storage. `events` (`convex/schema.ts:130–139`) has no `feeling` and no `reasons` column; `dailyCheckins` has `reasons: v.optional(v.array(v.string()))` but is a different table. Either extend the `events` row (`feeling: v.optional(v.string())`, `reasons: v.optional(v.array(v.string()))`) or keep both values local to `UrgeSession` (`src/lib/urgeSession.ts`, which already carries `trigger?: string`). Do not silently drop the answers.
8. **Global, not this screen: press feedback.** The canvas declares `transform:scale(0.99)` on every row and pill across all three frames; `PressScale` animates to `0.96` (`src/components/ui/press-scale.tsx:25`). Every ported screen inherits this. Flag it as a one-line primitive change rather than forking the behaviour here.
9. **Out of scope but load-bearing:** the four dark SOS frames the app still renders (`BreatheStage`, `TapStage`, `OddStage`, `WaveStage`, `SosSettingsSheet`, lines 1152–1897, plus the `'sos'` step) were **removed** from the bundle — see §1. Confirm with the user whether the dark SOS survives before anyone deletes it.
