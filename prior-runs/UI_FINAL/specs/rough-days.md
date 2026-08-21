# Rough Days — pixel spec (Anxiety I, Boredom III, An argument II, An argument III)

## Header

| Sticky-note no. | Frame label | Split file (final) | Diff | Target app file(s) |
|---|---|---|---|---|
| 004 | Rough Anxiety I | `.uifinal/pretty/final/Email Login/Rough-Anxiety-I.html` | `.uifinal/diffs/Rough-Anxiety-I.html.diff` | `src/components/roughDays/kit.tsx` (`RDArtwork` → `tangle`) |
| 012 | Rough Boredom III | `.uifinal/pretty/final/Email Login/Rough-Boredom-III.html` | `.uifinal/diffs/Rough-Boredom-III.html.diff` | `src/components/roughDays/kit.tsx` (`RDArtwork` → `threethings`) |
| 020 | Rough An argument II | `.uifinal/pretty/final/Email Login/Rough-An-argument-II.html` | `.uifinal/diffs/Rough-An-argument-II.html.diff` | `src/components/roughDays/kit.tsx` (`RDArtwork` → `toppled`) |
| 021 | Rough An argument III | `.uifinal/pretty/final/Email Login/Rough-An-argument-III.html` | `.uifinal/diffs/Rough-An-argument-III.html.diff` | `src/components/roughDays/kit.tsx` (`RDArtwork` → `writeit`) |

Also read, unchanged by this family: `src/app/(app)/rough-days.tsx` (the picker shelf — **no frame in this family draws it**), `src/content/roughDays.ts` (copy only), `src/app/rough-protocol.tsx` (the three-page driver).

**Sticky numbers:** the exported bundle carries no sticky-note number — the only frame identity in the HTML is `data-screen-label`, and `.uifinal/diff-email-login.txt` lists frames by label. The numbers above are the repo's own Rough Days numbering (`src/content/roughDays.ts` header: loneliness 001–003, anxiety 004–006, stress 007–009, boredom 010–012, late night 013–015, home alone 016–018, argument 019–021).

## Coordinate conventions used throughout

- Frame is `393 × 852`. `top` values quoted at frame level **include the 54px status bar** the app never builds.
- Every frame puts one sheet at frame `top:52` (`left:0; right:0; bottom:0`). Everything else in the frame is a child of that sheet, so its `top` is **sheet-relative**. The app anchors the same sheet at `Math.max(0, insets.top - 2)` and then reuses the sheet-relative numbers verbatim.
- Conversion table for the chrome:

| Element | Sheet-relative top | Frame-absolute top | App equivalent (frame − 54) |
|---|---|---|---|
| sheet itself | — | 52 | −2 (app: `insets.top - 2`) |
| grabber | 12 | 64 | 10 |
| close cross | 26 | 78 | 24 |
| dot row | 66 | 118 | 64 |
| headline | 104 | 156 | 102 |
| sub line | 152 | 204 | 150 |
| art slot | 216 | 268 | 214 |
| act line (III pages) | 452 | 504 | 450 |
| CTA pill | `bottom:88` | `bottom:88` | `bottom:88` (unaffected) |
| ghost link | `bottom:44` | `bottom:44` | `bottom:44` (unaffected) |

- Artwork children are quoted relative to the **240 × 220 art slot**, never to the frame — no status-bar maths applies to them.

---

# 1. Shared page chrome (identical in all four frames)

| Element | Property | Design value |
|---|---|---|
| Frame root | size | 393 × 852, `position:relative`, `overflow:hidden` |
| | background | `#EDECE7` |
| | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` |
| | font smoothing | `-webkit-font-smoothing:antialiased` |
| | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` — **canvas presentation chrome only, never built** |
| Status bar | box | `top:0; left:0; right:0; height:54; padding:6px 32px 0 46px; box-sizing:border-box; z-index:20` |
| | clock | `9:41`, 17px / 600 / `letter-spacing:-0.2px` / `#1D1C1A` |
| | right cluster | `display:flex; align-items:center; gap:7px` (signal 19×12, wifi 17×12, battery 27×13) |
| | | **not built by the app** |
| Sheet | box | `position:absolute; left:0; right:0; top:52; bottom:0` |
| | radius | `24px 24px 0 0` (TL 24, TR 24, BR 0, BL 0) |
| | background | `#F4F3F0` |
| | overflow | `hidden` |
| Noise | box | `position:absolute; inset:0` |
| | image | `url('noise-dark.png')` |
| | opacity | `0.07`; `pointer-events:none` |
| Grabber wrap | box | `left:0; right:0; top:12; display:flex; justify-content:center` |
| Grabber pill | size / radius | 38 × 5, radius 3 |
| | fill | `rgba(19,19,19,0.16)` |
| Close cross | svg | `width=20 height=20 viewBox="0 0 20 20"`, `position:absolute; right:22; top:26` |
| | stroke | `#55534E`, `stroke-width:2`, `stroke-linecap:round`, no fill |
| Dot row | box | `left:0; right:0; top:66; display:flex; justify-content:center; gap:6` |
| | active dot | 20 × 6.5, radius 4, `#131313` |
| | idle dot | 6.5 × 6.5, radius 4, `rgba(19,19,19,0.18)` |
| Headline | box | `left:36; right:36; top:104` |
| | type | 26px / weight 500 / `line-height:33px` / `letter-spacing:-0.2px` / `text-align:center` |
| | colour | `#1D1C1A`; no max-lines, no transform |
| Sub line | box | `left:44; right:44; top:152` |
| | type | 14.5px / weight 400 / `line-height:21px` / `letter-spacing` unset / `text-align:center` / `text-wrap:balance` |
| | colour | `#8B8882` |
| Art slot | box | `left:76; top:216; width:240; height:220`; inner wrapper `inset:0; overflow:hidden` |
| Act line (III only) | box | `left:48; right:48; top:452` |
| | type | 16px / weight 500 / `line-height:24px` / `text-align:center` / `text-wrap:balance` |
| | colour | `#1D1C1A` |
| CTA pill | box | `left:24; right:24; bottom:88; height:54; border-radius:27` |
| | fill | `#131313`; `display:flex; align-items:center; justify-content:center`; `cursor:pointer` |
| | label | 16.5px / weight 600 / `letter-spacing:0.2px` / `#FFFFFF` |
| Ghost link | box | `left:0; right:0; bottom:44; text-align:center`; `cursor:pointer` |
| | type | 14.5px / weight 500 / `#8B8882` |

Close-cross path (verbatim):

```
M3 3l14 14M17 3L3 17
```

Status-bar glyph paths (transcribed for completeness; the app does not build the status bar):

```
M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z
M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z
M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z
```

## Per-frame chrome state

| Frame | Dot state (3 dots) | Headline | Sub | Act line | CTA label | Ghost label |
|---|---|---|---|---|---|---|
| Rough Anxiety I | 1st active, 2nd + 3rd idle | `Wound up, not turned on.` | `Anxiety and arousal share wiring — the body confuses one for the other.` | *(none)* | `Walk through it` | `Not tonight` |
| Rough Boredom III | 1st + 2nd idle, 3rd active | `The second-easiest thing.` | `The easiest thing is the screen. Pick the next one.` | `Ten push-ups, one glass of water, one open window.` | `Done` | `Back` |
| Rough An argument II | 1st idle, 2nd active, 3rd idle | `It offers control back.` | `The urge shows up right after the argument took your control away.` | *(none)* | `Next` | `Back` |
| Rough An argument III | 1st + 2nd idle, 3rd active | `Write, don’t send.` | `Spend the charge somewhere it can’t cost you.` | `Write the reply you won’t send. Then put it down.` | `Done` | `Back` |

Entities decoded: `&mdash;` = `—` (U+2014), `&rsquo;` = `’` (U+2019).

**States the frames show:** default only. No pressed, disabled, selected, or empty state appears in any of the four frames; the only per-frame variation is the dot index and the CTA/ghost label pair, both already derived in `RDMovePage` from `index`.

## Comparison — chrome (design vs `src/components/roughDays/kit.tsx`)

| Property | Design value | Current app value | Verdict |
|---|---|---|---|
| Screen background | `#EDECE7` | `backgroundColor: '#EDECE7'` (L645) | match |
| Sheet top | `52` (frame), i.e. status-bar bottom − 2 | `Math.max(0, insets.top - 2)` (L651) | match |
| Sheet radius | `24px 24px 0 0` | `borderTopLeftRadius: 24, borderTopRightRadius: 24` (L653–654) | match |
| Sheet fill | `#F4F3F0` | `'#F4F3F0'` (L655) | match |
| Sheet overflow | `hidden` | `overflow: 'hidden'` (L656) | match |
| Noise opacity | `0.07` | `opacity: 0.07` (L658) | match |
| Grabber | 38 × 5, r3, `rgba(19,19,19,0.16)`, top 12, centred | identical (L580–582) | match |
| Close cross | 20 × 20 @ right 22 / top 26, `#55534E`, sw 2, cap round, path `M3 3l14 14M17 3L3 17` | identical (L592–595) | match |
| Dot row | top 66, gap 6, active 20 × 6.5 `#131313`, idle 6.5 × 6.5 `rgba(19,19,19,0.18)`, radius 4 | identical (L602–605) | match |
| Headline | left/right 36, top 104, 26/33, ls −0.2, w500, `#1D1C1A`, centred | identical (L662) | match |
| Sub | left/right 44, top 152, 14.5/21, w400, `#8B8882`, centred | identical (L665) | match |
| Sub `text-wrap:balance` | balance | no RN equivalent | n/a (no RN property exists) |
| Art slot | left 76, top 216, 240 × 220, overflow hidden | `left: 76, top: 216, width: 240, height: 220` (L668) + `overflow:'hidden'` on `RDArtwork` (L108) | match |
| Act line | left/right 48, top 452, 16/24, w500, `#1D1C1A`, centred | identical (L672) | match |
| CTA pill | left/right 24, bottom 88, h 54, r27, `#131313` | identical (L679) | match |
| CTA label | 16.5 / w600 / ls 0.2 / `#FFFFFF` | identical (L680) | match |
| Ghost | bottom 44, 14.5 / w500 / `#8B8882`, centred | identical (L687) | match |
| CTA label sequence | `Walk through it` → `Next` → `Done` | `RD_CTA = ['Walk through it', 'Next', 'Done']` (L612) | match |
| Ghost label sequence | `Not tonight` → `Back` → `Back` | `RD_GHOST = ['Not tonight', 'Back', 'Back']` (L613) | match |

**The page chrome is pixel-identical. Every finding in this family lives inside `RDArtwork`.**

## Comparison — copy (design vs `src/content/roughDays.ts`)

| Frame | Design string | Current app value | Verdict |
|---|---|---|---|
| Anxiety I `h` | `Wound up, not turned on.` | same (L56) | match |
| Anxiety I `s` | `Anxiety and arousal share wiring — the body confuses one for the other.` | same (L56) | match |
| Boredom III `h` | `The second-easiest thing.` | same (L74) | match |
| Boredom III `s` | `The easiest thing is the screen. Pick the next one.` | same (L74) | match |
| Boredom III `act` | `Ten push-ups, one glass of water, one open window.` | same (L74) | match |
| Argument II `h` | `It offers control back.` | same (L97) | match |
| Argument II `s` | `The urge shows up right after the argument took your control away.` | same (L97) | match |
| Argument III `h` | `Write, don’t send.` | same (L98) | match |
| Argument III `s` | `Spend the charge somewhere it can’t cost you.` | same (L98) | match |
| Argument III `act` | `Write the reply you won’t send. Then put it down.` | same (L98) | match |

`src/content/roughDays.ts` needs no edit.

---

# 2. Visualization section — the artwork slots

All four drawings are custom, hand-placed vector scenes, so this section covers them under the "custom drawing" rule.

**Coordinate system.** Each drawing lives in a `240 × 220` box at frame `left:76`, sheet `top:216` (frame-absolute 268; app equivalent 214). The box is `overflow:hidden` — anything past 240 × 220 is clipped. Children are absolutely positioned in that box's own space, origin top-left, y down. There is no data domain, no axis, no tick, no gridline, no clip path, no mask, and no dash array anywhere in these four frames except where called out below. Paint order is document order: later siblings paint on top.

**Two effects the canvas uses that RN cannot express directly**, both already approximated in `kit.tsx` (header comment L20–24):

| Canvas effect | Canvas spec | `kit.tsx` stand-in |
|---|---|---|
| warm glow | `border-radius:50%` box + `background:radial-gradient(closest-side, rgba(226,186,120,α), rgba(226,186,120,0) 74%)` + `filter:blur(4px \| 5px)` | `Glow` (L29–41): `Svg` + `RadialGradient cx=50% cy=50% r=50%`, stops `offset 0 → α`, `offset 0.74 → 0`. **Blur radius is dropped entirely.** |
| ground shade | `border-radius:50%` box + `background:rgba(0,0,0,α)` + `filter:blur(5px)` | `Shade` (L45–58): stops `0 → α`, `0.45 → α`, `1 → 0`. |

**Degenerate cases.** None of these drawings is data-driven — there is no no-data / one-point / min / max / overflow rendering. The only variable is `RDArt`, and an unmatched name renders an empty 240 × 220 box.

## 2.1 Rough Anxiety I — art `tangle` (final)

Paint order top to bottom:

| # | Element | Box (l, t, w, h) | Radius | Fill / stroke | Effect |
|---|---|---|---|---|---|
| 1 | warm glow | 44, 60, 72, 72 | 50% | `radial-gradient(closest-side, rgba(226,186,120,0.32), rgba(226,186,120,0) 74%)` | `blur(5px)` |
| 2 | speck A | 216, 22, 2, 2 | 50% | `rgba(200,225,235,0.4)` | — |
| 3 | speck B | 10, 50, 2, 2 | 50% | `rgba(200,225,235,0.3)` | — |
| 4 | knot svg | 20, 58, 200, 80 — `viewBox="0 0 200 80"` | — | see below | — |
| 5 | amber dot | 206, 94, 9, 9 | 50% | `rgba(226,186,120,1)` | — |
| 6 | dot glow | 194, 82, 32, 32 | 50% | `radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)` | `blur(5px)` |
| 7 | ground shade | 42, 166, 110, 13 | 50% | `rgba(0,0,0,0.10)` | `blur(5px)` |

Note the paint order at 5→6: **the 32 px glow paints *over* the 9 px amber dot**, not behind it.

Knot svg children (all stroke `#B4B1AB`, `stroke-width:2.6`, `fill:none`; no linejoin on the circles, `stroke-linecap:round` on the tail only):

```
circle cx="42" cy="42" r="19"
circle cx="60" cy="42" r="19"
circle cx="78" cy="42" r="19"
```

```
M95 50 C124 58 156 52 186 42
```

Previous version (for reference — this is what the app still draws):

```
M60 62 C40 42 28 66 46 76 C20 78 26 102 48 96 C34 112 58 122 66 106 C70 122 92 116 88 100 C104 110 114 92 98 84 C116 84 114 60 96 62 C104 46 84 38 76 52 C72 38 54 42 60 62 Z
M96 84 C130 84 150 76 196 70
```

## 2.2 Rough Boredom III — art `threethings` (final)

| # | Element | Box (l, t, w, h) | Radius | Fill | Effect |
|---|---|---|---|---|---|
| 1 | warm glow | 112, 36, 108, 108 | 50% | `radial-gradient(closest-side,rgba(226,186,120,0.34),rgba(226,186,120,0) 74%)` | `blur(4px)` |
| 2 | speck A | 216, 20, 2, 2 | 50% | `rgba(200,225,235,0.4)` | — |
| 3 | speck B | 8, 48, 2, 2 | 50% | `rgba(200,225,235,0.3)` | — |
| 4 | window frame | 112, 40, 100, 96 | 7 | `#E4E3DE` | — |
| 5 | upper pane | 120, 48, 84, 38 | 3 | `linear-gradient(180deg, #F7F6F2, #EDECE7)` — 180°, stop 1 `#F7F6F2` @0%, stop 2 `#EDECE7` @100% | — |
| 6 | lower pane | 120, 92, 84, 36 | 3 | `#F7F6F2` | — |
| 7 | glass body | 40, 124, 24, 40 | `3px 3px 5px 5px` (TL3 TR3 BR5 BL5) | `#F7F6F2` | `box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.08)` |
| 8 | water | 43, 140, 18, 21 | `0 0 4px 4px` (TL0 TR0 BR4 BL4) | `#D9E2E8` | — |
| 9 | dumbbell bar | 84, 152, 40, 6 | 3 | `#B4B1AB` | — |
| 10 | weight left | 80, 146, 9, 18 | 3 | `#8B8880` | — |
| 11 | weight right | 119, 146, 9, 18 | 3 | `#8B8880` | — |
| 12 | shade (left group) | 36, 170, 96, 13 | 50% | `rgba(0,0,0,0.10)` | `blur(5px)` |
| 13 | shade (window) | 140, 142, 72, 13 | 50% | `rgba(0,0,0,0.10)` | `blur(5px)` |

No SVG in this drawing at all in the final version. The diff removes exactly two SVGs the previous version carried (both still in the app):

```
M4 0 C20 10 20 50 4 58              (34×60 svg @ 196,54, stroke #D6D5D0, sw 3, cap round)
M2 20 C12 20 14 8 26 8 M12 24 C22 24 24 14 40 14   (44×26 svg @ 58,64, stroke #D6D5D0, sw 2.4, cap round)
```

## 2.3 Rough An argument II — art `toppled` (final, fully redrawn)

| # | Element | Box (l, t, w, h) | Radius | Fill | Effect / transform |
|---|---|---|---|---|---|
| 1 | speck A | 214, 26, 2, 2 | 50% | `rgba(200,225,235,0.4)` | — |
| 2 | speck B | 16, 44, 2, 2 | 50% | `rgba(200,225,235,0.3)` | — |
| 3 | board shade | 45, 180, 150, 11 | 50% | `rgba(0,0,0,0.1)` | `blur(5px)` |
| 4 | board | 52, 134, 136, 44 | 6 | — (tiles fill it) | `overflow:hidden`; `box-shadow:0 3px 8px rgba(40,38,32,0.1)` (x 0, y 3, blur 8, spread 0) |
| 5 | warm glow | 62, 48, 52, 52 | 50% | `radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)` | `blur(5px)` |
| 6 | piece shade | 71, 130, 34, 11 | 50% | `rgba(0,0,0,0.08)` | `blur(5px)` |
| 7 | figure head | 79, 69, 18, 18 | 50% | `#6B6862` | — |
| 8 | figure arms | 76, 89, 24, 5 | 2.5 | `#6B6862` | — |
| 9 | figure body | 81, 94, 14, 26 | `7px 7px 3px 3px` (TL7 TR7 BR3 BL3) | `#6B6862` | — |
| 10 | figure base | 74, 120, 28, 8 | `4px 4px 2px 2px` (TL4 TR4 BR2 BL2) | `#6B6862` | — |
| 11 | toppled group | 132, 96, 52, 30 | — | — | `transform:rotate(84deg); transform-origin:center; opacity:0.85` |
| 12 | amber spark | 88, 60, 5, 5 | 50% | `rgba(226,186,120,0.9)` | — |

**Board tiles (children of #4, clipped to its rounded box).** Twelve tiles, each `22.67 × 22`, no radius, no gap, board-local coordinates. Column x values, verbatim from the canvas: `0px`, `22.67px`, `45.34px`, `68.01px`, `90.68px`, `113.35000000000001px`. Sum check: 113.35 + 22.67 = 136.02 ≈ the 136 board width — the last column overhangs by 0.02px and is clipped.

| Row (`top`) | col 0 | col 1 | col 2 | col 3 | col 4 | col 5 |
|---|---|---|---|---|---|---|
| `0px` | `#EBEAE4` | `#D9D8D2` | `#EBEAE4` | `#D9D8D2` | `#EBEAE4` | `#D9D8D2` |
| `22px` | `#D9D8D2` | `#EBEAE4` | `#D9D8D2` | `#EBEAE4` | `#D9D8D2` | `#EBEAE4` |

**Toppled-piece group children** (coordinates relative to the 52 × 30 rotated group box, all `#B4B1AB`):

| Part | Box (l, t, w, h) | Radius |
|---|---|---|
| head | 0, 11, 15, 15 | 50% |
| neck | 14, 13, 5, 11 | 2 |
| body | 18, 11, 22, 14 | `3px 7px 7px 3px` (TL3 TR7 BR7 BL3) |
| base | 39, 8, 8, 21 | `2px 4px 4px 2px` (TL2 TR4 BR4 BL2) |

Geometry note: the group lays the piece out head→base along +x, then rotates 84° clockwise about the group centre `(158, 111)` in slot space. After rotation the head lands near `(152.6, 93)` and the base near `(156.3, 128)` — the piece reads as standing 6° off vertical, not lying flat. The canvas is internally consistent here; the label "toppled" is the app's naming, not the canvas's.

Previous version (what the app still draws) for reference:

```
M34 6 L50 6 L54 20 L46 26 L52 50 L32 50 L38 26 L30 20 Z     (84×56 svg @ 64,96, G rotate(74 42 28), fill #B4B1AB)
M42 0 L42 10 M37 5 L47 5                                     (same G, stroke #B4B1AB, sw 3, cap round)
M10 24 L26 24 L30 58 L6 58 Z                                 (36×64 svg @ 150,92, fill #D6D5D0, plus circle cx18 cy12 r9 #D6D5D0)
```

## 2.4 Rough An argument III — art `writeit` (final)

| # | Element | Box (l, t, w, h) | Radius | Fill / stroke | Effect / transform |
|---|---|---|---|---|---|
| 1 | warm glow | 70, 42, 120, 120 | 50% | `radial-gradient(closest-side,rgba(226,186,120,0.34),rgba(226,186,120,0) 74%)` | `blur(4px)` |
| 2 | speck A | 216, 20, 2, 2 | 50% | `rgba(200,225,235,0.4)` | — |
| 3 | speck B | 8, 48, 2, 2 | 50% | `rgba(200,225,235,0.3)` | — |
| 4 | notebook | 52, 70, 112, 84 | 8 | `#F7F6F2` | `box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.06)`; `transform:rotate(-2deg)` |
| 5 | spine | 106, 72, 2, 80 | 0 | `#E0DFDA` | `transform:rotate(-2deg)` |
| 6 | rule line 1 | 64, 88, 32, 4 | 2 | `#E0DFDA` | — |
| 7 | rule line 2 | 64, 100, 32, 4 | 2 | `#E0DFDA` | — |
| 8 | rule line 3 | 118, 86, 32, 4 | 2 | `#E0DFDA` | — |
| 9 | pen barrel | 142, 120, 44, 6 | 3 | `#E9D2A4` | `box-shadow:inset 0 -1.5px 0 rgba(0,0,0,0.08)` (x 0, y −1.5, blur 0, spread 0); `transform:rotate(-24deg); transform-origin:left center` |
| 10 | pen nib | 181, 101.5, 8, 6 | 0 | `#55534E` | `clip-path:polygon(0 0, 100% 50%, 0 100%)`; `transform:rotate(-24deg)` (default origin: centre) |
| 11 | pen grip | 139, 119, 7, 6.5 | 3 | `#C6C5C0` | `transform:rotate(-24deg)` (default origin: centre) |
| 12 | crumple large | svg 30 × 28 @ 34, 150 — `viewBox="0 0 30 28"` | — | `fill:#EBEAE4`, `stroke:#D6D5D0`, `stroke-width:1.8` | — |
| 13 | crumple small | svg 26 × 24 @ 66, 160 — `viewBox="0 0 26 24"` | — | `fill:#EBEAE4`, `stroke:#D6D5D0`, `stroke-width:1.6` | — |
| 14 | bin | svg 40 × 60 @ 178, 120 — `viewBox="0 0 40 60"` | — | see below | — |
| 15 | ground shade | 48, 180, 120, 13 | 50% | `rgba(0,0,0,0.10)` | `blur(5px)` |

Crumple large path (verbatim):

```
M15 2 C22 2 28 8 26 15 C29 20 24 26 18 25 C12 28 5 25 5 19 C1 15 4 8 9 7 C10 3 12 2 15 2 Z
```

Crumple small path (verbatim):

```
M13 2 C19 2 24 7 22 13 C25 17 20 22 15 21 C10 24 4 21 4 16 C1 12 4 7 8 6 Z
```

Bin paths (verbatim; body `fill:#D6D5D0`, rim `stroke:#B4B1AB`, `stroke-width:3`, `stroke-linecap:round`):

```
M6 8 L34 8 L30 56 L10 56 Z
M4 8 L36 8
```

The nib triangle in RN: the clip-path polygon `(0 0, 100% 50%, 0 100%)` over an `8 × 6` box is exactly `Svg width={8} height={6} viewBox="0 0 8 6"` with

```
M0 0 L8 3 L0 6 Z
```

---

# 3. Comparison tables — artwork

## 3.1 `tangle` — Rough Anxiety I (`kit.tsx` L174–191)

| Property | Design value | Current app value | Verdict |
|---|---|---|---|
| glow left | 44 | 66 | **MISMATCH** |
| glow top | 60 | 50 | **MISMATCH** |
| glow size | 72 × 72 | 116 × 116 | **MISMATCH** |
| glow stops | `rgba(226,186,120,0.32)` → `rgba(226,186,120,0) 74%` | `#E2BA78` @0.32 → @0 at offset 0.74 | match |
| glow blur | `blur(5px)` (prev: 4px) | none — radial falloff stand-in | **MISMATCH** (documented approximation; the canvas value changed 4 → 5) |
| speck A | 216, 22 | 216, 20 (shared `Specks`, L90) | **MISMATCH** |
| speck B | 10, 50 | 8, 48 (shared `Specks`, L91) | **MISMATCH** |
| speck colours | `rgba(200,225,235,0.4)` / `rgba(200,225,235,0.3)`, 2 × 2, r50% | identical | match |
| knot svg box | 200 × 80 @ 20, 58 | 200 × 120 @ 20, 60 | **MISMATCH** |
| knot svg viewBox | `0 0 200 80` | `0 0 200 120` | **MISMATCH** |
| knot geometry | three circles `r=19`, `cy=42`, `cx=42/60/78` | one closed scribble path + `strokeLinejoin="round"` | **MISMATCH** |
| knot stroke | `#B4B1AB`, sw 2.6, no fill | `#B4B1AB`, sw 2.6, no fill | match |
| tail path | `M95 50 C124 58 156 52 186 42` | `M96 84 C130 84 150 76 196 70` | **MISMATCH** |
| tail stroke | `#B4B1AB`, sw 2.6, cap round | identical | match |
| amber dot pos | 206, 94 | 212, 124 | **MISMATCH** |
| amber dot size/fill | 9 × 9, r50%, `rgba(226,186,120,1)` | 9 × 9, r4.5, `#E2BA78` (same colour) | match |
| dot glow | 32 × 32 @ 194, 82, alpha 0.4, blur 5, **painted above the dot** | absent | **MISMATCH** |
| ground shade | 42, 166, 110 × 13, `rgba(0,0,0,0.10)` | 52, 166, 110 × 13 | **MISMATCH** |

**11 mismatches.**

## 3.2 `threethings` — Rough Boredom III (`kit.tsx` L342–363)

| Property | Design value | Current app value | Verdict |
|---|---|---|---|
| glow | 112, 36, 108, alpha 0.34, blur 4 | `Glow l={112} t={36} size={108} alpha={0.34}` | match |
| specks | 216,20 / 8,48 | shared `Specks` — 216,20 / 8,48 | match |
| window frame | 112, 40, 100 × 96, r7, `#E4E3DE` | identical (L346) | match |
| upper pane | 120, 48, 84 × 38, r3, `linear-gradient(180deg,#F7F6F2,#EDECE7)` | `VGrad … r={3} from="#F7F6F2" to="#EDECE7"` (L347) | match |
| lower pane | 120, 92, 84 × 36, r3, `#F7F6F2` | identical (L348) | match |
| stray svg — curtain curve | **absent** | `Svg 34×60 @196,54`, path `M4 0 C20 10 20 50 4 58` (L349–351) | **MISMATCH** |
| stray svg — breeze | **absent** | `Svg 44×26 @58,64`, path `M2 20 C12 20 14 8 26 8 M12 24 C22 24 24 14 40 14` (L352–354) | **MISMATCH** |
| glass body | 40, 124, 24 × 40, TL3 TR3 BR5 BL5, `#F7F6F2`, inset ring 1.5 `rgba(0,0,0,0.08)` | identical, ring as `borderWidth: 1.5` (L355) | match |
| water | 43, 140, 18 × 21, BR4 BL4, `#D9E2E8` | identical (L356) | match |
| dumbbell bar | 84, 152, 40 × 6, r3, `#B4B1AB` | identical (L357) | match |
| weight left | 80, 146, 9 × 18, r3, `#8B8880` | identical (L358) | match |
| weight right | 119, 146, 9 × 18, r3, `#8B8880` | identical (L359) | match |
| shade 1 | 36, 170, 96 × 13 | identical (L360) | match |
| shade 2 | 140, 142, 72 × 13 | identical (L361) | match |

**2 mismatches** — both are elements the final canvas deleted.

## 3.3 `toppled` — Rough An argument II (`kit.tsx` L525–547)

| Property | Design value | Current app value | Verdict |
|---|---|---|---|
| speck A | 214, 26 | 216, 20 (shared `Specks`) | **MISMATCH** |
| speck B | 16, 44 | 8, 48 (shared `Specks`) | **MISMATCH** |
| board shade | 45, 180, 150 × 11, `rgba(0,0,0,0.1)`, blur 5 | `Shade l={56} t={182} w={120} h={13}` alpha 0.1 | **MISMATCH** |
| board container | 52, 134, 136 × 44, r6, `overflow:hidden`, `box-shadow:0 3px 8px rgba(40,38,32,0.1)` | none — six bare squares, no container, no radius, no clip, no shadow | **MISMATCH** |
| tile grid | 12 tiles, 2 rows × 6 cols, each 22.67 × 22, alternating `#EBEAE4` / `#D9D8D2` | 6 tiles, 1 row, each 24 × 24 at y 156, x 50/74/98/122/146/170, alternating `#E4E3DE` / `#C6C5C0` | **MISMATCH** |
| warm glow | 62, 48, 52 × 52, alpha 0.45, blur 5 | `l={78} t={44} size={112} alpha={0.32}` | **MISMATCH** |
| piece shade | 71, 130, 34 × 11, `rgba(0,0,0,0.08)`, blur 5 | absent | **MISMATCH** |
| standing figure | four boxes in `#6B6862` (head 79,69,18×18 r50%; arms 76,89,24×5 r2.5; body 81,94,14×26 r7/7/3/3; base 74,120,28×8 r4/4/2/2) | absent | **MISMATCH** |
| toppled piece | four boxes in `#B4B1AB` inside a 52 × 30 box @132,96, `rotate(84deg)`, origin centre, `opacity:0.85` | `Svg 84×56 @64,96` with `G transform="rotate(74 42 28)"`, chess-piece path + cross path | **MISMATCH** |
| second grey figure | **absent** | `Svg 36×64 @150,92`: `Circle cx18 cy12 r9 #D6D5D0` + path `M10 24 L26 24 L30 58 L6 58 Z` | **MISMATCH** |
| amber spark | 88, 60, 5 × 5, r50%, `rgba(226,186,120,0.9)` | absent | **MISMATCH** |

**11 mismatches.** This drawing is a full replacement, not a tweak — nothing in the current `toppled` block survives.

## 3.4 `writeit` — Rough An argument III (`kit.tsx` L549–571)

| Property | Design value | Current app value | Verdict |
|---|---|---|---|
| glow | 70, 42, 120, alpha 0.34, blur 4 | `l={70} t={42} size={120} alpha={0.34}` | match |
| specks | 216,20 / 8,48 | shared `Specks` — same | match |
| notebook | 52, 70, 112 × 84, r8, `#F7F6F2`, inset ring 1.5 `rgba(0,0,0,0.06)`, rotate −2° | identical (L553) | match |
| spine | 106, 72, 2 × 80, `#E0DFDA`, rotate −2° | identical (L554) | match |
| rule line 1 | 64, 88, 32 × 4, r2, `#E0DFDA` | identical (L555) | match |
| rule line 2 | 64, 100, 32 × 4, r2, `#E0DFDA` | identical (L556) | match |
| rule line 3 | 118, 86, 32 × 4, r2, `#E0DFDA` | identical (L557) | match |
| pen barrel box | 142, 120, 44 × 6, r3 | 140, 118, 58 × 7, r4 (L558) | **MISMATCH** |
| pen barrel fill | `#E9D2A4` | `#55534E` | **MISMATCH** |
| pen barrel shadow | `inset 0 -1.5px 0 rgba(0,0,0,0.08)` | none | **MISMATCH** |
| pen barrel rotation | `rotate(-24deg)`, origin `left center` | `rotate('-26deg')`, origin `left center` | **MISMATCH** |
| pen nib | 181, 101.5, 8 × 6, `#55534E`, triangle clip, rotate −24° | absent | **MISMATCH** |
| pen grip | 139, 119, 7 × 6.5, r3, `#C6C5C0`, rotate −24° | absent | **MISMATCH** |
| crumple large fill | `#EBEAE4` | `fill="none"` (L560) | **MISMATCH** |
| crumple large stroke | `#D6D5D0`, sw 1.8 | `#C6C5C0`, sw 2.4 | **MISMATCH** |
| crumple large path | `M15 2 C22 2 …` | identical | match |
| crumple small fill | `#EBEAE4` | `fill="none"` (L563) | **MISMATCH** |
| crumple small stroke | `#D6D5D0`, sw 1.6 | `#C6C5C0`, sw 2.2 | **MISMATCH** |
| crumple small path | `M13 2 C19 2 …` | identical | match |
| bin | 40 × 60 @178,120, `M6 8 L34 8 L30 56 L10 56 Z` `#D6D5D0`, rim `M4 8 L36 8` `#B4B1AB` sw 3 cap round | identical (L565–568) | match |
| ground shade | 48, 180, 120 × 13 | identical (L569) | match |

**9 mismatches** (4 on the pen barrel, 2 missing pen parts, 4 on the two crumples — counted as 9 distinct rows above: barrel box, barrel fill, barrel shadow, barrel rotation, nib, grip, crumple-large fill, crumple-large stroke, crumple-small fill, crumple-small stroke = 10; the barrel rotation and box are one edit, so treat 10 rows / 6 edits).

---

# 4. What must change

Ordered. **All edits are in `src/components/roughDays/kit.tsx`.** `src/app/(app)/rough-days.tsx` and `src/content/roughDays.ts` need no edit — no frame in this family draws the picker shelf, and every string already matches.

1. **`Specks` (L87–94) — make the two spark positions overridable.** Give it optional props, e.g. `({ a = [216, 20], b = [8, 48] })`, keeping the current values as defaults so the 18 unchanged artworks are untouched. Then pass `a={[216, 22]} b={[10, 50]}` from `tangle` and `a={[214, 26]} b={[16, 44]}` from `toppled`. Sizes (2 × 2, r 1) and colours (`rgba(200,225,235,0.4)` / `rgba(200,225,235,0.3)`) stay.

2. **`toppled` (L525–547) — replace the whole block.** In paint order: `Specks` with the overrides above; `Shade` at 45, 180, 150 × 11 (alpha 0.1); the board — a `View` at 52, 134, 136 × 44 with `borderRadius: 6`, `overflow: 'hidden'`, `boxShadow: '0 3px 8px rgba(40,38,32,0.1)'` — holding the 12 tiles at the exact x values `0 / 22.67 / 45.34 / 68.01 / 90.68 / 113.35000000000001` and y `0 / 22`, each `22.67 × 22`, colours per the grid table in §2.3; `Glow` at 62, 48, size 52, alpha 0.45; `Shade` at 71, 130, 34 × 11 with `alpha={0.08}`; the four `#6B6862` figure boxes; the rotated 52 × 30 group at 132, 96 with `transform: [{ rotate: '84deg' }]`, `transformOrigin: 'center'`, `opacity: 0.85` holding its four `#B4B1AB` parts; and last the 5 × 5 `rgba(226,186,120,0.9)` spark at 88, 60. Delete both existing `Svg` figures.

3. **`tangle` (L174–191) — retarget the glow and redraw the knot.** `Glow` → `l={44} t={60} size={72}` (alpha stays 0.32). `Specks` → the 216,22 / 10,50 override. Replace the `Svg` with `width={200} height={80} viewBox="0 0 200 80"` at `left: 20, top: 58`, containing three `Circle`s (`cx` 42 / 60 / 78, `cy` 42, `r` 19, `fill="none"`, `stroke="#B4B1AB"`, `strokeWidth={2.6}`) and the tail `Path d="M95 50 C124 58 156 52 186 42"` (same stroke, `strokeLinecap="round"`). Move the amber dot to 206, 94. Add a second `Glow` at 194, 82, size 32, alpha 0.4 **after** the dot so it paints over it. Move `Shade` to `l={42}` (top 166, 110 × 13 unchanged).

4. **`writeit` (L549–571) — rebuild the pen and fill the crumples.** Barrel: 142, 120, 44 × 6, `borderRadius: 3`, `backgroundColor: '#E9D2A4'`, `boxShadow: 'inset 0 -1.5px 0 rgba(0,0,0,0.08)'`, `transform: [{ rotate: '-24deg' }]`, `transformOrigin: 'left center'`. Add the nib: an 8 × 6 `Svg` (`viewBox="0 0 8 6"`, path `M0 0 L8 3 L0 6 Z`, fill `#55534E`) positioned at 181, 101.5 and rotated `-24deg` about its centre. Add the grip: 139, 119, 7 × 6.5, `borderRadius: 3`, `#C6C5C0`, rotated `-24deg` about its centre. On the large crumple set `fill="#EBEAE4" stroke="#D6D5D0" strokeWidth={1.8}`; on the small one `fill="#EBEAE4" stroke="#D6D5D0" strokeWidth={1.6}`. Paths, svg sizes and positions are unchanged.

5. **`threethings` (L349–354) — delete two elements.** Remove the `Svg 34×60` at 196, 54 (`M4 0 C20 10 20 50 4 58`) and the `Svg 44×26` at 58, 64 (`M2 20 C12 20 14 8 26 8 M12 24 C22 24 24 14 40 14`). Nothing else in this drawing changes.

6. **Optional, cross-cutting:** `Glow` (L29–41) drops the canvas blur radius entirely. The canvas now specifies `blur(5px)` on the Anxiety glows and the Argument II glow versus `blur(4px)` on the Boredom and Argument III glows. If the softer edge matters, give `Glow` a stop-position prop so a 5 px blur can be modelled with an earlier falloff; otherwise leave it and record the deviation.

---

# 5. Frames read

- Final: all four files read in full (294 / 365 / 490 / 386 lines).
- Diffs: all four exist and were read in full.
- Prev: `Rough-Anxiety-I.html` and `Rough-Boredom-III.html` prev art blocks read directly to confirm the diff hunks; the other two prev states are fully reconstructed from their unified diffs (which carry every changed line plus context).
- App: `src/components/roughDays/kit.tsx` (692 lines), `src/app/(app)/rough-days.tsx` (95), `src/content/roughDays.ts` (104), `src/app/rough-protocol.tsx` (41) — all read in full.

No self-contradiction was found in any of the four frames. The only ambiguity worth naming is the Argument II piece labelled `toppled`: the canvas rotates it 84°, which reads as 6° off upright rather than lying flat. The CSS is unambiguous (`transform:rotate(84deg); transform-origin:center` on a 52 × 30 box) and should be transcribed as written.
