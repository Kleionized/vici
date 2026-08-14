# Spec — the lesson reader's artwork (frames Lesson Scroll 1, 9, 13, 18, 23, 24)

A **pure artwork spec**. Layout, type and copy are covered by
`specs/lesson-reader-16-26.md` for frames 16 → 26; this file supersedes that file's
section `e.1` with a fuller, numerically-verified transcription and adds the four
drawings it does not cover (frames 1, 9, 13, and frame 24's icon set).

Source frames, all read line by line, in full:

| Frame | Pretty file | Raw file |
| --- | --- | --- |
| Lesson Scroll 1 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-1.html` | `.uifinal/final/Email Login/Lesson-Scroll-1.html` |
| Lesson Scroll 9 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-9.html` | `.uifinal/final/Email Login/Lesson-Scroll-9.html` |
| Lesson Scroll 13 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-13.html` | `.uifinal/final/Email Login/Lesson-Scroll-13.html` |
| Lesson Scroll 18 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-18.html` | `.uifinal/final/Email Login/Lesson-Scroll-18.html` |
| Lesson Scroll 23 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-23.html` | `.uifinal/final/Email Login/Lesson-Scroll-23.html` |
| Lesson Scroll 24 | `.uifinal/pretty/final/Email Login/Lesson-Scroll-24.html` | `.uifinal/final/Email Login/Lesson-Scroll-24.html` |

App files read in full: `src/components/lesson/scenes.tsx` (1002 lines),
`src/components/lesson/cover.tsx` (98), `src/components/lesson/marks.tsx` (122),
`src/components/lesson/pages.tsx` (563), `src/app/lesson/[slug].tsx` (588),
`src/lib/theme.ts`.

### Reading conventions

* Every frame is a `393 × 852` `position:relative; overflow:hidden` div whose declared
  `top` values include a 54px status bar the app never builds. Offsets into the frame
  are given as **canvas → (canvas − 54)**.
* The pretty-printer prefixes each text node with `· `. That bullet is **not** copy —
  verified against the raw files, where `>9:41<` carries no bullet.
* Entities are resolved and flagged: `&middot;` → `·` (U+00B7 MIDDLE DOT),
  `&rsquo;` → `’` (U+2019 RIGHT SINGLE QUOTATION MARK). No `&mdash;` occurs in these six
  frames.
* The frame's own `box-shadow:0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)`
  is the design tool's device-card shadow. It is not app chrome and must not be built.
* **Every absolute number in this file was measured, not estimated.** The six frames were
  loaded into headless Chrome 393px wide and every element's
  `getBoundingClientRect()` and `getComputedStyle()` recorded. Where a figure is derived
  (blur equivalences, gradient endpoints, skew matrices) the arithmetic is shown so it can
  be re-derived.

---

## a. Frame inventory

| Frame | Page kind | Artwork it carries | App component that should own the artwork |
| --- | --- | --- | --- |
| Lesson Scroll 1 | Lesson cover board | **Drawing A — Night room**, 240 × 200 drawn at ×1.12 | new `NightRoomScene` in `src/components/lesson/scenes.tsx` |
| Lesson Scroll 9 | Statement board | **Drawing B — Half-risen sun**, 240 × 96 | new `SunriseScene` in `scenes.tsx` |
| Lesson Scroll 13 | Recall-prompt board | **Drawing C — Clock face**, 96 × 96 | new `ClockScene` in `scenes.tsx` |
| Lesson Scroll 18 | Art board | **Drawing D — Bedroom, door, desk**, 340 × 200 at ×1 | new `BedroomScene` in `scenes.tsx` |
| Lesson Scroll 23 | Task board (scene) | **Drawing D** again, at ×0.85 → 289 × 170 | same `BedroomScene`, `scale` prop |
| Lesson Scroll 24 | Task board (options) | **Drawing E — four 20 × 20 line icons** | new `SleepPlaceIcon` in `scenes.tsx` |

Five distinct drawings across six frames. Frames 18 and 23 carry a **byte-identical**
artwork subtree — verified by diffing the 291 pretty-printed lines of each: zero
differences. Only the wrapper differs.

Every one of the five drawings is a fixed-size box centred on the frame's centre line
(x = 196.5). Measured centres: A 62.1 + 134.4 = 196.5; B 76.5 + 120 = 196.5;
C 148.5 + 48 = 196.5; D(18) 26.5 + 170 = 196.5; D(23) 52 + 144.5 = 196.5.

---

## b. Artwork grammar — the construction kinds

Not one of the five drawings is an SVG on the canvas. **All artwork on frames 1, 9, 13, 18
and 23 is built from absolutely-positioned CSS `<div>`s**, painted in source order (later
divs over earlier), inside a box with `overflow:hidden`. Frame 24 is the only frame whose
artwork is real `<svg>` markup.

Six CSS constructs appear. Each needs a different treatment in React Native:

| # | Construct | Occurrences | RN status |
| --- | --- | --- | --- |
| B1 | Solid box with per-corner **circular** radii | 46 pieces | RN `View` handles it; `react-native-svg` needs a `<Path>` (SVG `rx` is uniform) |
| B2 | Box with **elliptical** radius, `50% 50% 0 0 / 26px 26px 0 0` | 2 pieces (the floor domes) | **No RN equivalent.** SVG `<Path>` with an `A` arc |
| B3 | `border-radius:50%` on a **non-square** box (an ellipse) | 7 pieces (all drop shadows) | **No RN equivalent.** SVG `<Ellipse>` |
| B4 | `linear-gradient` / `radial-gradient` background | 7 pieces | SVG `<LinearGradient>` / `<RadialGradient>`, or `expo-linear-gradient` for the linear ones |
| B5 | `filter: blur(Npx)` | 9 pieces | **No RN equivalent at all.** See §e.7 |
| B6 | `mask`, `clip-path`, `skewY` | 3 pieces | SVG `<Mask>` / `<Path>` / `transform` matrix |

### b.1 Complete property table — the CSS box kind (B1)

Every crisp piece in drawings A, C and D is exactly this shape. Nothing else is ever set.

| Property | Values that occur | Notes |
| --- | --- | --- |
| `position` | `absolute` on every piece; the containers are `relative` | |
| `left` / `top` | integers, plus `76.5`, `46.5`, `46.75`, `99.75999999999999`, `129.5` | never round these |
| `width` / `height` | integers, plus `1.5`, `2.5`, `3.5` | |
| `border-radius` | `1px` `1.5px` `2px` `2.5px` `3px` `4px` `5px` `6px` `8px` `12px` `50%`; and the four-value forms `5px 5px 3px 3px`, `6px 10px 5px 5px`, `12px 12px 5px 4px`, `7px 7px 5px 5px`, `8px 8px 3px 3px`, `0 0 2px 2px`, `6px 6px 0 0`, `50% 50% 0 0 / 26px 26px 0 0` | order is TL TR BR BL |
| `background` | flat hex, `rgba()`, `linear-gradient`, `radial-gradient` | |
| `box-shadow` | `0 0 0 6px #E4E3DE, 0 5px 12px rgba(40,38,32,0.14)`; `0 0 10px rgba(220,222,216,0.6)`; `inset 0 -2.5px 0 #D6D5D0, 0 1.5px 3px rgba(40,38,32,0.14)`; `inset 0 0 0 6px #E4E3DE, 0 6px 14px rgba(40,38,32,0.12)`; `-4px 3px 7px rgba(40,38,32,0.16)`; `0 0 0 1.6px #2A2E35`; `inset 0 0 0 2.5px #E4E2DB, 0 8px 20px rgba(40,38,32,0.1)` | pass verbatim to RN's `boxShadow` string |
| `filter` | `blur(4px)`, `blur(5px)` | |
| `transform` | `scale(1.12)`, `scale(0.85)`, `rotate(-52deg)`, `skewY(-7deg)` | |
| `transform-origin` | `top center`, `50% 100%`, `top right` | |
| `overflow` | `hidden` on four containers | |
| `z-index` | **never set on any artwork piece.** Paint order is DOM order alone | |
| border width / colour | **never set.** There is not one `border` in any of the five drawings — every hairline is a `box-shadow` spread ring | |

### b.2 The border-radius clamp rule, applied

CSS scales *all* corner radii by a single factor
`f = min(edgeLength / sumOfAdjacentRadii)` over the four edges, whenever any sum exceeds
its edge. Three pieces in these frames are actually clamped; every other piece has `f = 1`
and must be transcribed unmodified.

| Piece | Box | Declared | Sum vs edge | f | Used radius |
| --- | --- | --- | --- | --- | --- |
| B/horizon line | 240 × 1.5 | `1px` | left edge 1 + 1 = 2 > 1.5 | **0.75** | **0.75px** all corners |
| B/left dash | 26 × 3.5 | `2px` | left edge 2 + 2 = 4 > 3.5 | **0.875** | **1.75px** all corners |
| B/right dash | 20 × 3.5 | `2px` | 4 > 3.5 | **0.875** | **1.75px** |
| A/floor dome | 296 × 64 | `50% 50% 0 0 / 26px 26px 0 0` | top edge 148 + 148 = 296 = width | 1.000 | rx 148, ry 26 |
| D/floor dome | 400 × 72 | same | 200 + 200 = 400 = width | 1.000 | rx 200, ry 26 |
| A/headboard, D/headboard | 10 × 62 | `5px 5px 3px 3px` | top 5 + 5 = 10 = width | 1.000 | unmodified |
| A/lamp base | 16 × 5 | `2.5px` | left 2.5 + 2.5 = 5 = height | 1.000 | stadium ends |
| D/desk top | 40 × 8 | `4px` | left 4 + 4 = 8 = height | 1.000 | stadium ends |
| D/desk legs | 5 × 20 | `2.5px` | top 2.5 + 2.5 = 5 = width | 1.000 | stadium ends |
| C/hands | 3 × 28 and 3 × 20 | `1.5px` | top 1.5 + 1.5 = 3 = width | 1.000 | stadium ends |

Four of these sit exactly at `f = 1`, i.e. the design deliberately drew stadium ends. They
must not be nudged.

### b.3 Palette — every colour in the five drawings

| Hex / rgba | Where | In `src/lib/theme.ts`? | Elsewhere in `src/`? |
| --- | --- | --- | --- |
| `#EAE9E3` | A, D floor dome | no | **absent from the whole app** |
| `#E4E3DE` | A window frame + mullion + nightstand, B dashes, D door-frame ring | no | `day/kit.tsx`, `urge/index.tsx`, `roughDays/kit.tsx`, `journey/WorldArt.tsx` |
| `#D6D5D0` | A sill + headboard, B horizon, D headboard + door leaf + pillow inset | no | `lesson/scenes.tsx` and 6 others |
| `#E0DFDA` | A mattress, D mattress | no | `lesson/scenes.tsx` and 11 others |
| `#C9C8C1` | A duvet, D duvet | no | `app/(app)/log.tsx` only |
| `#C6C5C0` | A lamp stem/base + legs, D bed legs + desk legs | `colors.track` | `lesson/scenes.tsx` and 7 others |
| `#C5C4BD` | D crescent moon | no | `app/letter.tsx`, `day/kit.tsx` |
| `#DEDDD7` | D desk top | no | **absent** |
| `#8A857C` | D door handle | no | `keepsakes/Medallion.tsx` |
| `#DCDED8` | A moon disc | no | `lesson/scenes.tsx` and 5 others |
| `#B4B1AB` | A drawer line | `colors.textSofter` | `lesson/scenes.tsx` and 9 others |
| `#F7F6F2` | D door frame fill | no | `lesson/scenes.tsx` and 9 others |
| `#FFFFFF` | A pillow, C clock face, D pillow | `colors.surface` | everywhere |
| `#E9D2A4` | A lamp shade | no | `lesson/scenes.tsx` and 9 others |
| `#E4E2DB` | C clock ring (inset) | no | **absent** |
| `#C9C7C0` | C ticks | no | **absent** |
| `#1D1C1A` | C hands + hub | `colors.text` | everywhere |
| `#12151B` → `#1A2027` | A window pane, D phone body (gradient) | no | `today/kit.tsx`, `day/kit.tsx` |
| `#2A2E35` | D phone bezel ring | no | **absent** |
| `#F3E3C4` / `#E2BA78` / `#C49856` | B sun disc gradient | no | `#F3E3C4` ×5, `#E2BA78` ×19, **`#C49856` absent** |
| `rgba(226,186,120,·)` (= `#E2BA78`) | A lamp halo 0.45, B sun halo 0.42, D phone halo 0.4 | no | as above |
| `rgba(203,218,232,·)` (= `#CBDAE8`) | A cool pool 0.24 | no | **absent** |
| `rgba(200,225,235,·)` (= `#C8E1EB`) | A stars 0.4/0.3, D stars 0.35/0.3/0.4 | no | **absent** |
| `rgba(244,243,240,·)` (= `colors.bg`) | A stars 0.6/0.4 | `colors.bg` | everywhere |
| `rgba(190,205,220,0.28)` (= `#BECDDC`) | D phone glint | no | **absent** |
| `rgba(233,210,164,·)` (= `#E9D2A4`) | D doorway light 0.8, spill 0.5 / 0.06 | no | see `#E9D2A4` |
| `rgba(243,227,196,0.3)` (= `#F3E3C4`) | D doorway light mid stop | no | see `#F3E3C4` |
| `rgba(255,255,255,0.55)` | A, D duvet highlight | no | |
| `rgba(0,0,0,0.07 / 0.08 / 0.09)` | the seven drop shadows | `colors.border` is `rgba(0,0,0,0.09)` | |
| `#3A3934` | E, the four icons' stroke | `colors.textTitle` is `#2A2924` — **different** | `pages.tsx` uses `#3A3934` for the Close label |
| `#B0AEA8` | frame-1 chevron stroke | no | |

Seven colours are absent from the codebase entirely: `#EAE9E3`, `#DEDDD7`, `#E4E2DB`,
`#C9C7C0`, `#2A2E35`, `#C49856`, and the two blue-greys `#CBDAE8` / `#C8E1EB` / `#BECDDC`.

---

## c. Per-frame table — kind and exact copy

Copy is the raw text with entities resolved. `·` is U+00B7, `’` is U+2019.

| Frame | Kind | Every string on it, verbatim |
| --- | --- | --- |
| 1 | Lesson cover board | `9:41` · `Close` · `WEEK I · RESET` · `Surviving the Night` · `6 min` |
| 9 | Statement board | `9:41` · `Close` · `Get to tomorrow.` |
| 13 | Recall-prompt board | `9:41` · `Close` · `Think about the last night` · `Go back to the last time it happened at night. Where were you before the searching started?` |
| 18 | Art board | `9:41` · `Close` · `If the phone is across the room, you have to stand up. If it is downstairs, you have to leave the bed.` |
| 23 | Task board (scene) | `9:41` · `Close` · `DAY 1 · TONIGHT’S TASK` · `Surviving the night` · `Set up tonight before you get tired. Use the option that matches where you sleep.` · `Done when you can’t reach your usual device from bed without standing up.` |
| 24 | Task board (options) | `9:41` · `Close` · `DAY 1 · TONIGHT’S TASK` · `Match where you sleep` · `Own bedroom` · `Set the alarm now. Charge the phone outside the room. Put a laptop or tablet in a closed bag, drawer, or cupboard away from the bed.` · `Shared room` · `Put the device in a bag, locker, desk drawer, or fixed charging spot that you cannot reach while lying down.` · `Studio, sofa bed, or temporary space` · `Put the device at the farthest practical point from where you sleep: a kitchen counter, shelf, zipped bag, or other fixed place.` · `Phone needed as an alarm` · `Set the alarm first. Put the phone across the room or outside it. Turn off non-essential notifications before you put it down.` |

Note frames 1 and 23 both name the lesson but with different casing:
`Surviving the Night` (title case, frame 1, 28px) vs `Surviving the night` (sentence case,
frame 23, 26px). That is not a transcription slip — the raw files differ.

---

## d. Chrome shared by all six frames

Identical markup on every frame, byte for byte.

| Element | Declaration | App-space top (canvas − 54) |
| --- | --- | --- |
| grain | `position:absolute; inset:0; background-image:url('noise-dark.png'); opacity:0.07; pointer-events:none` | full bleed |
| status bar | `top:0; height:54px; padding:6px 32px 0 46px; z-index:20`, `9:41` at 17px/600/`#1D1C1A`/`ls -0.2px`, three SVG glyphs, `gap:7px` | **not built** |
| close affordance | `position:absolute; left:16px; top:66px; font-size:17px; font-weight:400; color:#3A3934; z-index:5` — a text label reading `Close`, **not an icon** | **top 12** |
| progress track | `position:absolute; left:16px; right:16px; top:108px; height:2px; border-radius:1px; background:rgba(0,0,0,0.05); z-index:5` — measured 361px wide | **top 54** |
| progress fill | `left:0; top:0; bottom:0; width:<pct>; border-radius:1px; background:#B4B1AB` | |

Fill percentage per frame, with the measured pixel width of the 361px track:

| Frame | 1 | 9 | 13 | 18 | 23 | 24 |
| --- | --- | --- | --- | --- | --- | --- |
| declared | `4%` | `35%` | `50%` | `69%` | `88%` | `92%` |
| measured px | 14.438 | 126.344 | 180.5 | 249.078 | 317.672 | 332.109 |

Frame 1 alone carries a scroll affordance at the foot:
`position:absolute; left:0; right:0; bottom:42px; display:flex; justify-content:center; z-index:5`
holding

```svg
<svg width="22" height="12" viewBox="0 0 22 12">
  <path d="M2 2l9 8 9-8" fill="none" stroke="#B0AEA8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
```

The canvas's chrome is a **2px hairline bar**, not a dot row and not a 7px bar. See §f.

---

## e. Visualization

### e.0 Where each drawing sits, and its coordinate transform

All measured in the 393 × 852 frame.

| Drawing | Outer box (canvas) | Outer box (canvas − 54) | Local space | Screen ← local mapping |
| --- | --- | --- | --- | --- |
| A Night room | L 61.5, T 452.5, 270 × 224 | T **398.5** | 240 × 200 | `x = 62.1 + 1.12·xL`, `y = 452.5 + 1.12·yL` |
| B Half-risen sun | L 76.5, T 335, 240 × 96 | T **281** | 240 × 96 | `x = 76.5 + xL`, `y = 335 + yL` |
| C Clock | L 148.5, T 343, 96 × 96 | T **289** | 96 × 96 | `x = 148.5 + xL`, `y = 343 + yL` |
| D Bedroom (frame 18) | L 26.5, T 230, 340 × 200 | T **176** | 340 × 200 | `x = 26.5 + xL`, `y = 230 + yL` |
| D Bedroom (frame 23) | L 52, T 286.5, 289 × 170 | T **232.5** | 340 × 200 | `x = 52 + 0.85·xL`, `y = 286.5 + 0.85·yL` |

Verification of A's mapping: the floor dome's local `left:-28` predicts
`62.1 + 1.12·(−28) = 30.74`; measured `L30.74`. Its local `top:166` predicts
`452.5 + 1.12·166 = 638.42`; measured `T638.42`. ✅

Verification of D-at-23: the crescent's local `(43, 31)` predicts
`52 + 0.85·43 = 88.55`, `286.5 + 0.85·31 = 312.85`; measured `L88.55 T312.85`. ✅

**Drawing A's wrapper is a two-layer trick.** The outer `270 × 224` box holds a
`240 × 200` box at `left:50%; margin-left:-120px; transform:scale(1.12);
transform-origin:top center`. 240 × 1.12 = 268.8 and 200 × 1.12 = 224, so the outer box's
270 × 224 is the scaled footprint plus 1.2px of horizontal slack (0.6px each side). The
`overflow:hidden` sits on the **inner, unscaled** 240 × 200 box, so clipping happens in
local space and the clip itself is then scaled.

**Drawing D at frame 23** is wrapped in `height:170px; display:flex;
justify-content:center; flex-shrink:0`, whose child carries `transform:scale(0.85);
transform-origin:top center`. Measured: the wrapper is 340 wide at L 26.5 (identical to
frame 18's placement) and the scaled content lands at L 52, 289 × 170. On frames 18 and
23 the drawing overruns the column's `padding:0 38px` — the content box is 317 wide and
the drawing is 340 — so it bleeds 11.5px past the gutter on each side. That is intended;
do not clamp it to the gutter.

---

### e.1 Drawing A — Night room (frame 1)

**Coordinate system.** `viewBox="0 0 240 200"`, y down, origin top-left, clipped to that
box. Rendered at 1.12× into a 268.8 × 224 footprint.

Painted in this order. `abs` is the measured frame-absolute rect, for verification only.

| z | Piece | Local box | Fill | Radius / filter / shadow | abs (canvas) |
| --- | --- | --- | --- | --- | --- |
| 1 | floor dome | −28, 166, 296 × 64 | `#EAE9E3` | `50% 50% 0 0 / 26px 26px 0 0` | L30.74 T638.42 331.52 × 71.68 |
| 2 | cool pool | 26, 118, 80 × 80 | `radial-gradient(closest-side, rgba(203,218,232,0.24), rgba(203,218,232,0) 76%)` | `50%`, `blur(5px)` | L91.22 T584.66 89.6 × 89.6 |
| 3 | window pane | 44, 16, 58 × 72 | `linear-gradient(180deg, #12151B 0%, #1A2027 100%)` | `6px`; `box-shadow:0 0 0 6px #E4E3DE, 0 5px 12px rgba(40,38,32,0.14)` | L111.38 T470.42 64.96 × 80.64 |
| 4 | mullion | 71, 16, 4 × 72 | `#E4E3DE` | none | L141.62 T470.42 4.48 × 80.64 |
| 5 | sill | 37, 88, 72 × 7 | `#D6D5D0` | `3px` | L103.54 T551.06 80.64 × 7.84 |
| 6 | moon | 82, 28, 13 × 13 | `#DCDED8` | `50%`; `box-shadow:0 0 10px rgba(220,222,216,0.6)` | L153.94 T483.86 14.56 × 14.56 |
| 7 | star | 54, 50, 2.5 × 2.5 | `rgba(244,243,240,0.6)` | `50%` | L122.58 T508.5 2.8 × 2.8 |
| 8 | star | 62, 68, 2 × 2 | `rgba(244,243,240,0.4)` | `50%` | L131.54 T528.66 2.24 × 2.24 |
| 9 | nightstand shadow | 53, 167, 50 × 11 | `rgba(0,0,0,0.08)` | `50%`, `blur(5px)` | L121.46 T639.54 56 × 12.32 |
| 10 | nightstand body | 56, 136, 44 × 28 | `#E4E3DE` | `5px` | L124.82 T604.82 49.28 × 31.36 |
| 11 | drawer line | 65, 145, 26 × 4 | `#B4B1AB` | `2px` | L134.9 T614.9 29.12 × 4.48 |
| 12 | nightstand leg L | 60, 164, 5 × 6 | `#C6C5C0` | none | L129.3 T636.18 5.6 × 6.72 |
| 13 | nightstand leg R | 91, 164, 5 × 6 | `#C6C5C0` | none | L164.02 T636.18 5.6 × 6.72 |
| 14 | lamp halo | 62, 98, 32 × 32 | `radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)` | `50%`, `blur(5px)` | L131.54 T562.26 35.84 × 35.84 |
| 15 | lamp shade | 67, 100, 22 × 15 | `#E9D2A4` | `8px 8px 3px 3px` | L137.14 T564.5 24.64 × 16.8 |
| 16 | lamp stem | **76.5**, 115, 3 × 16 | `#C6C5C0` | none | L147.78 T581.3 3.36 × 17.92 |
| 17 | lamp base | 70, 131, 16 × 5 | `#C6C5C0` | `2.5px` | L140.5 T599.22 17.92 × 5.6 |
| 18 | bed shadow | 115, 167, 118 × 11 | `rgba(0,0,0,0.09)` | `50%`, `blur(5px)` | L190.9 T639.54 132.16 × 12.32 |
| 19 | headboard | 114, 108, 10 × 62 | `#D6D5D0` | `5px 5px 3px 3px` | L189.78 T573.46 11.2 × 69.44 |
| 20 | mattress | 122, 138, 104 × 24 | `#E0DFDA` | `6px 10px 5px 5px` | L198.74 T607.06 116.48 × 26.88 |
| 21 | duvet | 156, 136, 70 × 26 | `#C9C8C1` | `12px 12px 5px 4px` | L236.82 T604.82 78.4 × 29.12 |
| 22 | duvet highlight | 162, 142, 56 × 4 | `rgba(255,255,255,0.55)` | `2px` | L243.54 T611.54 62.72 × 4.48 |
| 23 | pillow | 126, 129, 28 × 14 | `#FFFFFF` | `7px 7px 5px 5px`; `box-shadow:inset 0 -2.5px 0 #D6D5D0, 0 1.5px 3px rgba(40,38,32,0.14)` | L203.22 T596.98 31.36 × 15.68 |
| 24 | bed leg L | 124, 162, 6 × 8 | `#C6C5C0` | `0 0 2px 2px` | L200.98 T633.94 6.72 × 8.96 |
| 25 | bed leg R | 216, 162, 6 × 8 | `#C6C5C0` | `0 0 2px 2px` | L304.02 T633.94 6.72 × 8.96 |
| 26 | star | 212, 40, 2 × 2 | `rgba(200,225,235,0.4)` | `50%` | L299.54 T497.3 2.24 × 2.24 |
| 27 | star | 198, 68, 2 × 2 | `rgba(200,225,235,0.3)` | `50%` | L283.86 T528.66 2.24 × 2.24 |

Notes that change the drawing if missed:

* **The window's 6px spread ring is a fifth solid rectangle**, not a border. `0 0 0 6px
  #E4E3DE` extends the visible window unit to `(38, 10) → (108, 94)`, 70 × 84, with a 6px
  radius that CSS grows to `6 + 6 = 12px` on the ring's own outer corners. The blurred
  drop `0 5px 12px rgba(40,38,32,0.14)` is painted *under* that ring.
* The sill (z 5) is painted **after** the window, so it covers the ring's bottom edge from
  x 37 → 109. That overlap is what makes it read as a sill.
* Pieces 26 and 27 are stars at x 198–214 — *outside* the window, floating on the wall.
  They are in the canvas and are not a mistake to be tidied away.
* The floor dome runs `top:166 + 64 = 230` against a 200-tall clip, so its bottom 30px is
  cut. Its left/right run −28 → 268 against a 0 → 240 clip, so both dome shoulders are cut.
  The clip is what makes it a horizon rather than a lozenge.
* Piece 16's `left:76.5px` is a half-pixel and is what centres the 3px stem on the shade's
  22px width (`67 + 11 = 78`, stem centre `76.5 + 1.5 = 78`). Do not round to 76 or 77.

**The floor dome as an SVG path.** Elliptical top corners, rx = 296/2 = 148, ry = 26, both
adjacent sums exactly equal their edge so `f = 1`:

```
M-28 192 A148 26 0 0 1 268 192 L268 230 L-28 230 Z
```

(`192 = 166 + 26`, `230 = 166 + 64`.) `src/components/lesson/scenes.tsx:270-271` already
carries the generator for exactly this shape:
`headland(x0, x1, top, boxHeight, ry)` → `M${x0} ${top+ry} A${(x1-x0)/2} ${ry} 0 0 1 ${x1} ${top+ry} L${x1} ${top+boxHeight} L${x0} ${top+boxHeight} Z`.
Call it as `headland(-28, 268, 166, 64, 26)`.

---

### e.2 Drawing B — Half-risen sun (frame 9)

**Coordinate system.** `viewBox="0 0 240 96"`. **There is no `overflow:hidden` on the
container** — piece 1 is 100 tall from `top:8`, so it bleeds 12px below the box, and the
frame's own clip is the only thing containing it. If you build this in SVG you must set
the viewBox to `0 -0 240 108` or let the `<Svg>` overflow, or you will crop the halo.

| z | Piece | Local box | Fill | Radius / filter | abs (canvas) |
| --- | --- | --- | --- | --- | --- |
| 1 | sun halo | 70, 8, 100 × 100 | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 76%)` | `50%`, **`blur(4px)`** | L146.5 T343 100 × 100 |
| 2 | horizon clip | 96, 56, 48 × 24 | — | `overflow:hidden` | L172.5 T391 48 × 24 |
| 2a | sun disc (child of 2) | 0, 0, 48 × 48 | `radial-gradient(circle at 40% 30%, #F3E3C4 0%, #E2BA78 58%, #C49856 100%)` | `50%` | L172.5 T391 48 × 48, clipped to 24 tall |
| 3 | horizon line | 0, 79, 240 × 1.5 | `#D6D5D0` | `1px` → clamped to **0.75px** | L76.5 T414 240 × 1.5 |
| 4 | dash L | 24, 78, 26 × 3.5 | `#E4E3DE` | `2px` → clamped to **1.75px** | L100.5 T413 26 × 3.5 |
| 5 | dash R | 192, 78, 20 × 3.5 | `#E4E3DE` | `2px` → clamped to **1.75px** | L268.5 T413 20 × 3.5 |

The geometry that makes this drawing work: the disc's centre is at
`(96 + 24, 56 + 24) = (120, 80)`. The horizon line spans `y 79 → 80.5`. **The sun's centre
sits exactly on the horizon** and the clip box shows precisely its top half. It is a sun
at the moment of rising, not a sun above a line. Get the clip wrong by 1px and the drawing
loses its point.

The halo is *not* concentric with the disc: halo centre `(70 + 50, 8 + 50) = (120, 58)`,
disc centre `(120, 80)`. The halo hangs 22px above the sun.

**The disc's gradient, resolved.** `circle` with no size keyword → `farthest-corner`.
Centre `(0.40 × 48, 0.30 × 48) = (19.2, 14.4)`. Corner distances from that centre:
`(0,0)` 24.000, `(48,0)` 32.199, `(0,48)` 38.700, `(48,48)` **44.2538** ← farthest. So:

```jsx
<RadialGradient id="sun" gradientUnits="userSpaceOnUse" cx={19.2} cy={14.4} r={44.2538}>
  <Stop offset="0"    stopColor="#F3E3C4" />
  <Stop offset="0.58" stopColor="#E2BA78" />
  <Stop offset="1"    stopColor="#C49856" />
</RadialGradient>
```

Using `r="50%"` in objectBoundingBox units would give r = 24 — **46 % too small** — and the
disc would go to `#C49856` at its own edge instead of never reaching it. That is the single
most likely way to get this drawing wrong.

---

### e.3 Drawing C — Clock (frame 13)

**Coordinate system.** `viewBox="0 0 96 96"`, no clip.

| z | Piece | Local box | Fill | Radius / transform / shadow | abs (canvas) |
| --- | --- | --- | --- | --- | --- |
| 1 | face | 0, 0, 96 × 96 | `#FFFFFF` | `50%`; `box-shadow:inset 0 0 0 2.5px #E4E2DB, 0 8px 20px rgba(40,38,32,0.1)` | L148.5 T343 96 × 96 |
| 2 | tick 12 | 46.75, 8, 2.5 × 7 | `#C9C7C0` | `1px` | L195.25 T351 |
| 3 | tick 6 | 46.75, 81, 2.5 × 7 | `#C9C7C0` | `1px` | L195.25 T424 |
| 4 | tick 9 | 8, 46.75, 7 × 2.5 | `#C9C7C0` | `1px` | L156.5 T389.75 |
| 5 | tick 3 | 81, 46.75, 7 × 2.5 | `#C9C7C0` | `1px` | L229.5 T389.75 |
| 6 | long hand | 46.5, 20, 3 × 28 | `#1D1C1A` | `1.5px` | L195 T363 3 × 28 |
| 7 | short hand | 46.5, 28, 3 × 20 | `#1D1C1A` | `1.5px`; `transform:rotate(-52deg); transform-origin:50% 100%` | bbox L179.816 T377.505 17.607 × 14.677 |
| 8 | hub | 44, 44, 8 × 8 | `#1D1C1A` | `50%` | L192.5 T387 8 × 8 |

* The hands' pivot is `(48, 48)` — the box centre. Piece 7's origin `50% 100%` on a 3 × 20
  box is `(1.5, 20)` local, i.e. `(48, 48)` in the drawing. Chrome's computed matrix is
  `matrix(0.615661, -0.788011, 0.788011, 0.615661, 0, 0)` = exactly `rotate(-52°)`.
* SVG equivalent: `transform="rotate(-52 48 48)"` on the rect.
* The short hand's tip centre lands at
  `(48 − 20·sin52°, 48 − 20·cos52°) = (48 − 15.7602, 48 − 12.3132) = (32.240, 35.687)`.
* The ticks are only at 12 / 3 / 6 / 9. There are no other marks.
* `left:46.75px` and `top:46.75px` on the ticks are the half-pixels that centre a 2.5px bar
  on 48: `46.75 + 1.25 = 48`. Never round.
* The clock reads roughly **10:00** — long hand at 12, short hand 52° anticlockwise.

---

### e.4 Drawing D — Bedroom, door, desk (frames 18 and 23)

**Coordinate system.** `viewBox="0 0 340 200"`, `overflow:hidden`. Frame 23 renders the
same 27 pieces at `scale(0.85)`, origin `top center` → 289 × 170.

| z | Piece | Local box | Fill | Radius / filter / shadow / transform | abs on frame 18 |
| --- | --- | --- | --- | --- | --- |
| 1 | crescent moon | 43, 31, 18 × 18 | `#C5C4BD` | `50%`; `mask:radial-gradient(circle at 15.299999999999999px 5.58px, transparent 7.0200000000000005px, #000 7.38px)` | L69.5 T261 18 × 18 |
| 2 | star | 96, 30, 2 × 2 | `rgba(200,225,235,0.35)` | `50%` | L122.5 T260 |
| 3 | star | 30, 74, 2 × 2 | `rgba(200,225,235,0.3)` | `50%` | L56.5 T304 |
| 4 | floor dome | −30, 158, 400 × 72 | `#EAE9E3` | `50% 50% 0 0 / 26px 26px 0 0` | L−3.5 T388 400 × 72 |
| 5 | bed shadow | 29, 155, 118 × 11 | `rgba(0,0,0,0.09)` | `50%`, `blur(5px)` | L55.5 T385 |
| 6 | headboard | 28, 96, 10 × 62 | `#D6D5D0` | `5px 5px 3px 3px` | L54.5 T326 |
| 7 | mattress | 36, 126, 104 × 24 | `#E0DFDA` | `6px 10px 5px 5px` | L62.5 T356 |
| 8 | duvet | 70, 124, 70 × 26 | `#C9C8C1` | `12px 12px 5px 4px` | L96.5 T354 |
| 9 | duvet highlight | 76, 130, 56 × 4 | `rgba(255,255,255,0.55)` | `2px` | L102.5 T360 |
| 10 | pillow | 40, 117, 28 × 14 | `#FFFFFF` | `7px 7px 5px 5px`; `box-shadow:inset 0 -2.5px 0 #D6D5D0, 0 1.5px 3px rgba(40,38,32,0.14)` | L66.5 T347 |
| 11 | bed leg L | 38, 150, 6 × 8 | `#C6C5C0` | `0 0 2px 2px` | L64.5 T380 |
| 12 | bed leg R | 130, 150, 6 × 8 | `#C6C5C0` | `0 0 2px 2px` | L156.5 T380 |
| 13 | door frame | 196, 54, 64 × 104 | `#F7F6F2` | `6px 6px 0 0`; `box-shadow:inset 0 0 0 6px #E4E3DE, 0 6px 14px rgba(40,38,32,0.12)` | L222.5 T284 |
| 14 | doorway light | 204, 62, 42 × 96 | `linear-gradient(90deg, rgba(233,210,164,0.8) 0%, rgba(243,227,196,0.3) 55%, rgba(244,243,240,0.12) 100%)` | none | L230.5 T292 |
| 15 | door leaf | 240, 60, 20 × 98 | `#D6D5D0` | `2px`; `box-shadow:-4px 3px 7px rgba(40,38,32,0.16)`; `transform:skewY(-7deg); transform-origin:top right` | L266.5 T290 20 × **100.456** |
| 16 | door handle | 244, **99.75999999999999**, 4 × 4 | `#8A857C` | `50%` | L270.5 T329.75 |
| 17 | light spill | 200, 158, 84 × 12 | `linear-gradient(100deg, rgba(233,210,164,0.5), rgba(233,210,164,0.06))` | `clip-path:polygon(6% 0, 78% 0, 100% 100%, 0 100%)` | L226.5 T388 |
| 18 | door shadow | 193, 160, 82 × 11 | `rgba(0,0,0,0.07)` | `50%`, `blur(5px)` | L219.5 T390 |
| 19 | desk shadow | 283, 160, 38 × 11 | `rgba(0,0,0,0.08)` | `50%`, `blur(5px)` | L309.5 T390 |
| 20 | desk top | 282, 136, 40 × 8 | `#DEDDD7` | `4px` | L308.5 T366 |
| 21 | desk leg L | 289, 144, 5 × 20 | `#C6C5C0` | `2.5px` | L315.5 T374 |
| 22 | desk leg R | 310, 144, 5 × 20 | `#C6C5C0` | `2.5px` | L336.5 T374 |
| 23 | phone halo | 285, 113, 34 × 34 | `radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)` | `50%`, `blur(5px)` | L311.5 T343 |
| 24 | phone shadow | 279, 135, 46 × 11 | `rgba(0,0,0,0.09)` | `50%`, `blur(5px)` | L305.5 T365 |
| 25 | phone body | 284, 127, 36 × 9 | `linear-gradient(180deg, #12151B 0%, #1A2027 100%)` | `4px`; `box-shadow:0 0 0 1.6px #2A2E35` | L310.5 T357 |
| 26 | phone glint | 296, **129.5**, 12 × 2.5 | `rgba(190,205,220,0.28)` | `1px` | L322.5 T359.5 |
| 27 | star | 258, 36, 2.5 × 2.5 | `rgba(200,225,235,0.4)` | `50%` | L284.5 T266 |

**The floor dome as a path.** rx = 400/2 = 200, ry = 26, `f = 1`:

```
M-30 184 A200 26 0 0 1 370 184 L370 230 L-30 230 Z
```

Clipped to `0 → 340` horizontally and `→ 200` vertically. Equivalent call to the existing
helper: `headland(-30, 370, 158, 72, 26)`.

**Piece 1, the crescent — the mask resolved.** The three magic numbers are percentages of
the 18px box, which is why they carry float dust:

| Declared | Fraction of 18 |
| --- | --- |
| `circle at 15.299999999999999px` | **85 %** |
| `5.58px` | **31 %** |
| `transparent 7.0200000000000005px` | **39 %** |
| `#000 7.38px` | **41 %** |

So: an 18px `#C5C4BD` disc centred `(9, 9)`, with a bite of radius 7.02 → 7.38 (0.36px
feather, midpoint **7.2**) centred at `(15.3, 5.58)`. Centre separation
`√(6.3² + 3.42²) = √51.3864 = 7.16843` — the biting circle's centre sits 7.168 from the
disc's centre and its radius is 7.2, so the bite passes 0.03px *inside* the disc's centre.
The crescent is razor thin at the top-right and opens toward the lower-left.

In scene space (add the piece's `left:43; top:31`): disc centre `(52, 40)`, r 9; bite
centre `(58.3, 36.58)`, r 7.2.

Verbatim `react-native-svg` construction, even-odd, no mask needed:

```jsx
<Path
  fillRule="evenodd"
  fill="#C5C4BD"
  d="M43 40 A9 9 0 1 1 61 40 A9 9 0 1 1 43 40 Z M51.1 36.58 A7.2 7.2 0 1 1 65.5 36.58 A7.2 7.2 0 1 1 51.1 36.58 Z"
/>
```

The even-odd path gives a hard edge where the canvas has a 0.36px feather. At 3× that is
1.08 device pixels of difference — below the anti-aliasing the renderer adds anyway.
If exactness matters, use `<Mask>` with a `<RadialGradient>` on the biting circle:
stops white → offset `7.02/7.38 = 0.95122` white, offset `1` black, `r = 7.38`.

Do **not** fake the bite with a paper-coloured disc: the frame lays a 7 % noise texture
over everything, so a `#F4F3F0` disc would show as a lighter patch against the grain.

**Piece 15, the door leaf — the skew resolved.** Chrome's computed matrix is
`matrix(1, -0.122785, 0, 1, 0, 0)` with `transform-origin: 20px 0px` (top right of the
20-wide box). `tan(7°) = 0.1227846`. Mapping in scene space, with the origin at
`(260, 60)`:

```
(x, y) → (x, y + (260 − x) · 0.1227846)
```

Corners: `(240,60) → (240, 62.4557)`, `(260,60) → (260, 60)`,
`(260,158) → (260, 158)`, `(240,158) → (240, 160.4557)`. The measured bounding box is
`20 × 100.456` — 98 + 2.4557 ✅. The left edge of the door drops 2.456px; the door tilts
open at the top.

As a single `react-native-svg` transform on the rect:

```jsx
<Rect x={240} y={60} width={20} height={98} rx={2} fill="#D6D5D0"
      transform="matrix(1 -0.1227846 0 1 0 31.924)" />
```

(`31.924 = 260 × 0.1227846`; check `x = 260` → `y' = y − 31.924 + 31.924 = y` ✅.)
On an RN `View` the same thing is `transform: [{ skewY: '-7deg' }]` with
`transformOrigin: 'top right'` — both are supported on RN ≥ 0.76, which Expo SDK 56 ships.

**Piece 17, the light spill — the clip resolved.** `polygon(6% 0, 78% 0, 100% 100%, 0 100%)`
on an 84 × 12 box at `(200, 158)`:

```
M205.04 158 L265.52 158 L284 170 L200 170 Z
```

(`6 % of 84 = 5.04`, `78 % of 84 = 65.52`.) The spill is a trapezium narrower at the top,
splaying out toward the viewer.

**Piece 17's gradient, resolved into SVG endpoints.** CSS `100deg` means the gradient line
points 100° clockwise from "to top", so its unit direction is
`(sin 100°, −cos 100°) = (0.9848078, 0.1736482)`. Line length for an 84 × 12 box is
`|84·sin θ| + |12·cos θ| = 82.72386 + 2.083778 = 84.80764`; half is 42.40382; the box
centre is `(42, 6)`. Therefore:

| | user space (local to the piece) | objectBoundingBox fraction |
| --- | --- | --- |
| start | `(0.23033, −1.36340)` | `x1 = 0.002742`, `y1 = −0.113617` |
| end | `(83.76967, 13.36340)` | `x2 = 0.997258`, `y2 = 1.113617` |

Stops: `rgba(233,210,164,0.5)` at 0, `rgba(233,210,164,0.06)` at 1 — i.e. `#E9D2A4` with
`stopOpacity` 0.5 → 0.06. A naive `x1="0" y1="0" x2="1" y2="0"` (pure horizontal) is 10°
off and puts the wrong end of the wedge in shadow.

**Piece 14's gradient.** `90deg` = to the right. `x1="0" y1="0" x2="1" y2="0"`. Three stops:
`#E9D2A4` @ 0 opacity 0.8; `#F3E3C4` @ 0.55 opacity 0.3; `#F4F3F0` @ 1 opacity 0.12.

**Piece 25's gradient.** `180deg` = to the bottom. `x1="0" y1="0" x2="0" y2="1"`.
`#12151B` @ 0 → `#1A2027` @ 1. Its `box-shadow: 0 0 0 1.6px #2A2E35` is a solid 1.6px
bezel, drawn as a second rounded rect at `(282.4, 125.4, 39.2 × 12.2)` with radius
`4 + 1.6 = 5.6`, painted *under* the body.

**Edge cases for drawing D.**

* At `scale(0.85)` every dimension scales including the blurs and the 2px stars, which
  become 1.7px (measured: `1.7 × 1.7`). Do not round them up.
* The floor dome bleeds off both sides and its bottom 30px is cut (`158 + 72 = 230` vs a
  200 clip). Keep the clip.
* Piece 15's skew makes the leaf 100.456 tall — 2.456 taller than declared — so the leaf's
  bottom-left corner sits at y 160.456, *below* the floor dome's crest at y 184. It reads
  as standing on the floor. A build that skews about the centre instead of the top right
  would drop the leaf 1.228 and lift the top by the same, and the door would float.
* Nothing in the drawing is `z-index`ed. The bed is behind the duvet because it is earlier
  in the DOM, and the light spill (17) is *over* the floor dome (4) but *under* the door
  shadow (18). Reorder anything and the drawing breaks.

---

### e.5 Drawing E — the four sleep-place icons (frame 24)

The only real `<svg>` artwork in the six frames. Each icon sits in a `38 × 38` white tile
with `border-radius:12px` and
`box-shadow:0 0 0 1px rgba(0,0,0,0.08), 0 3px 8px rgba(40,38,32,0.06)`, centred, and is
rendered `width="22" height="22" viewBox="0 0 20 20"` — i.e. a **1.1× upscale** of a 20-unit
grid. Stroke `#3A3934` throughout.

Measured tile tops (canvas → canvas − 54): 311.5 → 257.5; 412.5 → 358.5; 513.5 → 459.5;
636.5 → 582.5. Tile left 32 on all four. Icon rect measured `40, +8` inside each tile.

**Icon 1 — Own bedroom (a bed):**

```svg
<svg width="22" height="22" viewBox="0 0 20 20">
  <path d="M3 15.5V6" stroke="#3A3934" stroke-width="1.6" stroke-linecap="round"></path>
  <path d="M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5" stroke="#3A3934" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"></path>
  <circle cx="5.6" cy="8.9" r="1.5" fill="#3A3934"></circle>
</svg>
```

**Icon 2 — Shared room (a bunk):**

```svg
<svg width="22" height="22" viewBox="0 0 20 20">
  <rect x="4" y="3" width="12" height="14" rx="1.8" fill="none" stroke="#3A3934" stroke-width="1.6"></rect>
  <path d="M10 3v14" stroke="#3A3934" stroke-width="1.6"></path>
  <path d="M6.8 7.5h0M13.2 7.5h0" stroke="#3A3934" stroke-width="1.8" stroke-linecap="round"></path>
  <path d="M6.8 10.5v2M13.2 10.5v2" stroke="#3A3934" stroke-width="1.6" stroke-linecap="round"></path>
</svg>
```

**Icon 3 — Studio, sofa bed, or temporary space (a sofa):**

```svg
<svg width="22" height="22" viewBox="0 0 20 20">
  <path d="M4 9V7.5A2.5 2.5 0 0 1 6.5 5h7A2.5 2.5 0 0 1 16 7.5V9" fill="none" stroke="#3A3934" stroke-width="1.6"></path>
  <path d="M3.5 9a1.8 1.8 0 0 1 1.8 1.8V12h9.4v-1.2A1.8 1.8 0 0 1 16.5 9a1.5 1.5 0 0 1 1.5 1.5V14a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14v-3.5A1.5 1.5 0 0 1 3.5 9Z" fill="none" stroke="#3A3934" stroke-width="1.6" stroke-linejoin="round"></path>
</svg>
```

**Icon 4 — Phone needed as an alarm (an alarm clock):**

```svg
<svg width="22" height="22" viewBox="0 0 20 20">
  <circle cx="10" cy="11" r="6" fill="none" stroke="#3A3934" stroke-width="1.6"></circle>
  <path d="M10 8.2V11l2 1.4" fill="none" stroke="#3A3934" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
  <path d="M4.5 4.5L3 6M15.5 4.5L17 6" stroke="#3A3934" stroke-width="1.6" stroke-linecap="round"></path>
</svg>
```

**Trap.** Icon 2's `M6.8 7.5h0M13.2 7.5h0` are **zero-length subpaths** relying on
`stroke-linecap:round` to render as two 1.8px dots (the pillows). SVG says they render;
Core Graphics and `android.graphics.Path`, which `react-native-svg` sits on, render
nothing for a zero-length segment. Measured in Chrome: `path` #38 is `7.04 × 0` — the
browser draws the caps, RN will not. Replace with
`<Circle cx={6.8} cy={7.5} r={0.9} fill="#3A3934" />` ×2.

**Frame 23's rule card also carries a drawn icon** (20 × 20 rendered from an 18-unit grid):

```svg
<svg width="20" height="20" viewBox="0 0 18 18" style="flex-shrink:0;">
  <circle cx="9" cy="9" r="7.5" fill="none" stroke="#1D1C1A" stroke-width="1.6"></circle>
  <path d="M5.8 9l2.3 2.3 4.1-4.6" fill="none" stroke="#1D1C1A" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
```

Note the two stroke widths differ: 1.6 on the ring, **1.7** on the tick.

---

### e.6 Every gradient in the five drawings, with every stop

| Drawing / piece | Declaration | Resolved for `react-native-svg` |
| --- | --- | --- |
| A/2 cool pool | `radial-gradient(closest-side, rgba(203,218,232,0.24), rgba(203,218,232,0) 76%)` on 80 × 80 | `<RadialGradient cx="50%" cy="50%" r="50%">`, `#CBDAE8` @ 0 op 0.24, `#CBDAE8` @ 0.76 op 0 → r in user space = **40** |
| A/3 window pane | `linear-gradient(180deg, #12151B 0%, #1A2027 100%)` | `x1=0 y1=0 x2=0 y2=1`; `#12151B` @ 0, `#1A2027` @ 1 |
| A/14 lamp halo | `radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)` on 32 × 32 | `cx/cy 50%`, r = **16**; `#E2BA78` @ 0 op 0.45, @ 0.74 op 0 |
| B/1 sun halo | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 76%)` on 100 × 100 | r = **50**; `#E2BA78` @ 0 op 0.42, @ 0.76 op 0 |
| B/2a sun disc | `radial-gradient(circle at 40% 30%, #F3E3C4 0%, #E2BA78 58%, #C49856 100%)` on 48 × 48 | **userSpaceOnUse**, cx 19.2, cy 14.4, **r 44.2538**; stops 0 / 0.58 / 1 |
| D/14 doorway light | `linear-gradient(90deg, rgba(233,210,164,0.8) 0%, rgba(243,227,196,0.3) 55%, rgba(244,243,240,0.12) 100%)` | `x1=0 y1=0 x2=1 y2=0`; `#E9D2A4` op 0.8 @ 0, `#F3E3C4` op 0.3 @ 0.55, `#F4F3F0` op 0.12 @ 1 |
| D/17 light spill | `linear-gradient(100deg, rgba(233,210,164,0.5), rgba(233,210,164,0.06))` | `x1=0.002742 y1=−0.113617 x2=0.997258 y2=1.113617`; `#E9D2A4` op 0.5 @ 0, op 0.06 @ 1 |
| D/23 phone halo | `radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)` on 34 × 34 | r = **17**; `#E2BA78` @ 0 op 0.4, @ 0.74 op 0 |
| D/25 phone body | `linear-gradient(180deg, #12151B 0%, #1A2027 100%)` | as A/3 |

`closest-side` with no shape keyword resolves to an **ellipse** whose radii are the two
half-sizes; every box that uses it here is square, so it collapses to a circle of r = half
the box. That is why `r="50%"` in objectBoundingBox units is right for these five and
wrong for the sun disc, which names `circle` and therefore defaults to `farthest-corner`.

---

### e.7 `filter: blur()` — what it is, what RN can do, and how far off that is

**What CSS does.** `filter: blur(R)` is defined as `feGaussianBlur` with
`stdDeviation σ = R / 2`. So `blur(5px)` is σ 2.5 and `blur(4px)` is σ 2. The blur is
applied to the element *after* it is painted, so it softens the shape's alpha as well as
its colour, and it spreads the element ~2σ beyond its own box (3σ is visually zero).

**What React Native has.** Nothing. `react-native-svg` (v15, which Expo SDK 56 ships)
exposes no `<Filter>`, no `<FeGaussianBlur>` and no `filter` prop. RN's own
`experimental_backgroundImage` / `filter` style props do not cover blur on iOS.
`expo-blur` is a backdrop blur over a live view, not a shape blur, and cannot be used to
soften a drawn ellipse. **Every blurred piece must be re-authored as a gradient.**

There are two shapes of blurred piece and they need different treatments.

#### e.7.1 The seven blurred drop shadows — a flat ellipse under a Gaussian

All seven are `border-radius:50%` on a box **11px tall** with `blur(5px)`, so σ = 2.5 and
`b = 5.5` for every one of them.

*Peak.* For an ellipse of uniform alpha α, the centre value after the blur is
`α · erf(b/(σ√2)) · erf(a/(σ√2))`. With b = 5.5, σ = 2.5 the vertical factor is
`erf(1.55563) = 0.97219`; the horizontal factor is 1.0000 for every one of these (the
shortest is 38 wide, a = 19 = 7.6σ).

| Piece | Box | Declared α | **Peak after blur** | Effective rx | Effective ry |
| --- | --- | --- | --- | --- | --- |
| A/9 nightstand | 50 × 11 | 0.08 | **0.07778** | 30.0 | 10.5 |
| A/18 bed | 118 × 11 | 0.09 | **0.08750** | 64.0 | 10.5 |
| D/5 bed | 118 × 11 | 0.09 | **0.08750** | 64.0 | 10.5 |
| D/18 door | 82 × 11 | 0.07 | **0.06805** | 46.0 | 10.5 |
| D/19 desk | 38 × 11 | 0.08 | **0.07778** | 24.0 | 10.5 |
| D/24 phone | 46 × 11 | 0.09 | **0.08750** | 28.0 | 10.5 |

(Effective radii are the declared half-size plus 2σ = 5.)

*Profile.* The blurred edge is at exactly 50 % of peak on the shape's own outline
(a property of any Gaussian across a straight edge) and dies over 5px each way. Sampled
across the 21px-tall effective box:

| offset (top → bottom) | y (px from centre) | value ÷ peak |
| --- | --- | --- |
| 0.000 | −10.500 | 0.0234 |
| 0.125 | −7.875 | 0.1759 |
| 0.250 | −5.250 | 0.5553 |
| 0.375 | −2.625 | 0.8994 |
| 0.500 | 0 | 1.0000 |
| 0.625 | +2.625 | 0.8994 |
| 0.750 | +5.250 | 0.5553 |
| 0.875 | +7.875 | 0.1759 |
| 1.000 | +10.500 | 0.0234 |

**How far off the closest RN construction is.** The obvious replacement —
`<Ellipse rx={w/2} ry={h/2}>` filled by a `<RadialGradient cx="50%" cy="50%" r="50%">` —
is what `SignWash` in `src/components/lesson/scenes.tsx:690-729` already does, and it is
wrong in two ways:

1. **Its footprint is 5px short on every side.** The gradient dies at the shape's own
   outline, where the true blur is still at 50 % of peak. The shadow reads as a hard-edged
   grey lozenge rather than a fade.
2. **objectBoundingBox units stretch the falloff with the box.** On a 118 × 11 ellipse the
   radial's horizontal falloff is spread over 59px while its vertical falloff is spread
   over 5.5px. The true blur is 5px on *both* axes. The ends of the shadow come out roughly
   **11× too soft**.

The faithful construction, given no blur exists, is a rounded rect with a **vertical
linear gradient**, because these ellipses are 3.5–11× wider than tall and the blur is
effectively one-dimensional across the middle:

```jsx
// bed shadow, drawing D piece 5 — declared 118 × 11 at (29, 155), α 0.09
<Defs>
  <LinearGradient id="drop" x1="0" y1="0" x2="0" y2="1">
    <Stop offset="0"     stopColor="#000" stopOpacity={0.0875 * 0.0234} />
    <Stop offset="0.125" stopColor="#000" stopOpacity={0.0875 * 0.1759} />
    <Stop offset="0.25"  stopColor="#000" stopOpacity={0.0875 * 0.5553} />
    <Stop offset="0.375" stopColor="#000" stopOpacity={0.0875 * 0.8994} />
    <Stop offset="0.5"   stopColor="#000" stopOpacity={0.0875} />
    <Stop offset="0.625" stopColor="#000" stopOpacity={0.0875 * 0.8994} />
    <Stop offset="0.75"  stopColor="#000" stopOpacity={0.0875 * 0.5553} />
    <Stop offset="0.875" stopColor="#000" stopOpacity={0.0875 * 0.1759} />
    <Stop offset="1"     stopColor="#000" stopOpacity={0.0875 * 0.0234} />
  </LinearGradient>
</Defs>
<Rect x={24} y={150} width={128} height={21} rx={10.5} fill="url(#drop)" />
```

(x, y, w, h are the declared box grown by 2σ = 5 on every side; `rx` = half the new
height.) Horizontally this ends 2px harder than the true blur — measured, the true
horizontal profile on the *shortest* of these (a = 19) falls 1.000 → 0.788 → 0.500 →
0.212 → 0.023 over x = 17 → 24, and a stadium end cuts that to a single step. At ≤ 9 %
black on a paper field that difference is not visible; the vertical error of the naive
radial is.

#### e.7.2 The four blurred haloes — a radial cone under a Gaussian

These are already radial gradients, so the blur only lowers the peak and pushes the tail
out. For a linear cone `A(1 − r/R₀)` convolved with a 2-D Gaussian, the centre value is
`A(1 − σ√(π/2) / R₀)` — the truncation term is below 1e-4 for all four.

| Piece | Box | Declared A | Stop % | R₀ | σ | **Peak after blur** | ×A | Effective r |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A/2 cool pool | 80 | 0.24 | 76 | 30.400 | 2.5 | **0.21526** | 0.8969 | 35.400 |
| A/14 lamp halo | 32 | 0.45 | 74 | 11.840 | 2.5 | **0.33091** | 0.7354 | 16.840 |
| B/1 sun halo | 100 | 0.42 | 76 | 38.000 | 2.0 | **0.39230** | 0.9340 | 42.000 |
| D/23 phone halo | 34 | 0.40 | 74 | 12.580 | 2.5 | **0.30037** | 0.7509 | 17.580 |

So the correct RN transcription of, say, the phone halo is **not** `#E2BA78` at 0.40 with
a zero stop at 0.74 — it is `#E2BA78` at **0.300** with the zero stop pushed out to
`R₀ + 2σ = 17.58` (i.e. offset `12.58 / 17.58 = 0.7156` for the cone's own end, then 0 at
1.0 over a radius of 17.58 rather than 17). Transcribing the declared numbers straight
across makes the two small haloes **33 % too bright** — the largest single colour error
in the whole set.

`SignWash` in `scenes.tsx:695-700` currently writes `#E2BA78` at the declared α with a
zero stop at 0.74 on an unexpanded radius. That is the error above, already shipped.

#### e.7.3 `box-shadow` blur — a different divisor, and one piece uses it

A `box-shadow`'s blur radius `B` also maps to σ = B/2. Drawing A's moon carries
`0 0 10px rgba(220,222,216,0.6)`, so σ = 5 on a 6.5-radius disc. Numerically integrating
the disc under that Gaussian:

| distance from moon centre | alpha |
| --- | --- |
| 0 | 0.3423 (hidden under the opaque disc) |
| 4.0 | 0.2787 |
| **6.5 (the disc's own edge)** | **0.1975** |
| 8.0 | 0.1475 |
| 10.0 | 0.0901 |
| 12.0 | 0.0485 |
| 16.5 | 0.0074 |

RN passes `boxShadow` strings through to the platform (the app already relies on this in
`scenes.tsx` and `cover.tsx`), so on a `View` this needs no change at all. Inside an
`<Svg>` there is no box-shadow: draw a `<Circle cx cy r={16.5}>` filled with a
`<RadialGradient>` carrying `#DCDED8` at the offsets above ÷ 16.5, then the solid
`r = 6.5` disc over it.

---

## f. Comparison against the app as it stands

Middle column read from the files, never guessed.

### f.1 The drawings themselves

| Property | Design | Current app | Verdict |
| --- | --- | --- | --- |
| Night-room drawing (frame 1) | 240 × 200, 27 pieces, drawn at ×1.12 | **nothing.** `PageOpen` (`src/app/lesson/[slug].tsx:208-225`) draws `<LessonCover size={128} />` — a 128px circular medallion of three domes | **MISSING** |
| Cover art position | art **below** eyebrow / title / meta; measured art top 452.5 → 398.5, eyebrow top 175.5 → 121.5 | medallion **above** them: `paddingTop: 236 − 54 − CHROME_H`, then `marginTop: 70` to the eyebrow | **MISMATCH** (inverted order) |
| Cover art shape | a rectangular drawn scene, no frame, no ring | a circle with `0 0 0 1.5px rgba(0,0,0,0.2), 0 0 0 6px #F4F3F0, 0 0 0 7.5px rgba(0,0,0,0.14), 0 16px 32px rgba(40,38,32,0.22)` (`cover.tsx:52-54`) | **MISMATCH** |
| Half-risen sun (frame 9) | 240 × 96, 5 pieces | **nothing** | **MISSING** |
| Clock (frame 13) | 96 × 96, 8 pieces | **nothing.** `LessonMark` (`marks.tsx`) has `rings`, a 132 × 64 concentric-circle line mark — a different object | **MISSING** |
| Bedroom scene (frames 18, 23) | 340 × 200, 27 pieces | **nothing.** `SignScene` (`scenes.tsx:736-844`) is 190 × 152 and draws five other subjects | **MISSING** |
| Sleep-place icons (frame 24) | four `20 × 20` line icons at 1.6 stroke, `#3A3934` | `HabitIcon` (`scenes.tsx:968-1002`) is `21 × 21` from a `24 × 24` grid, stroke `#1D1C1A` at 2.5 (off) / `#F4F3F0` at 1.8 (on), and draws coffee / teeth / commute / bed / own — only `bed` is even adjacent | **MISMATCH** |

### f.2 Constructs the app already has right, and can be reused

| Construct | Design | Current app | Verdict |
| --- | --- | --- | --- |
| Elliptical-top dome as a path | `50% 50% 0 0 / 26px 26px 0 0` → `M x0 (top+ry) A rx ry 0 0 1 x1 (top+ry) L x1 bottom L x0 bottom Z` | `headland()` in `scenes.tsx:270-271` and `441-442`, and the `DOMES` loop in `cover.tsx:80-94`, emit exactly that | **match** |
| Four-radius rounded rect as a path | needed for 12 pieces | `roundedRect(x, y, w, h, tl, tr, br, bl)` in `scenes.tsx:334-347`, which even implements the CSS `f` scaling by hand at line 321 | **match** |
| Blur → gradient, as a policy | required | `SignWash` (`scenes.tsx:690-729`) and the header comment at `scenes.tsx:13-15` already state it | **match in principle** |
| `boxShadow` strings passed verbatim | required for 7 shadows | `scenes.tsx:742/767/776/792/806/833`, `cover.tsx:52` | **match** |
| Per-instance SVG gradient ids | required (5 drawings may co-exist on a scroll) | `useId().replace(/:/g,'')` at `scenes.tsx:86, 505, 691` | **match** |

### f.3 Constructs the app gets wrong

| Property | Design | Current app | Verdict |
| --- | --- | --- | --- |
| Blurred drop-shadow footprint | declared half-size **+ 5px** on every side (2σ) | `SignWash` uses `rx={shadow.w/2} ry={shadow.h/2}` — unexpanded (`scenes.tsx:721-722`) | **MISMATCH**, 5px short all round |
| Blurred drop-shadow falloff | 5px on **both** axes; profile 1.000 / 0.899 / 0.555 / 0.176 / 0.023 across the height | one objectBoundingBox radial, so the falloff stretches with the box — on a 118 × 11 ellipse the horizontal fade is 59px wide | **MISMATCH**, ends ≈ 11× too soft |
| Blurred drop-shadow peak | 0.9722 × declared α | full declared α at offset 0 (`scenes.tsx:703`) | **MISMATCH** (small: 2.8 %) |
| Blurred drop-shadow mid stop | 0.5553 at offset 0.25 of the expanded box | `0.55 → opacity × 0.6` (`scenes.tsx:704`) | close, but measured against the wrong radius |
| Blurred halo peak | 0.331 (lamp), 0.300 (phone), 0.392 (sun), 0.215 (pool) | `SignWash` writes the **declared** α (`scenes.tsx:697`) | **MISMATCH**, up to 33 % too bright |
| Blurred halo zero stop | pushed out to `R₀ + 2σ` | fixed at `0.74` on an unexpanded radius (`scenes.tsx:698`) | **MISMATCH** |
| Dark surfaces | `linear-gradient(180deg, #12151B 0%, #1A2027 100%)` — a blue-black | flat `#131313` (`colors.ink`, used at `scenes.tsx:743, 795`) | **MISMATCH** |
| Zero-length subpath dots | frame 24 icon 2 relies on them | n/a — but `HabitIcon` at `scenes.tsx:990` already ships `M8.8 13.8h.01M15.2 13.8h.01`, the same trap with a 0.01 nudge | note |
| Icon stroke colour | `#3A3934` | `#1D1C1A` (`scenes.tsx:969`) | **MISMATCH** |
| Progress indicator | 2px hairline bar, `rgba(0,0,0,0.05)` track, `#B4B1AB` fill, full width less 16 gutters | `FlowChrome` (`[slug].tsx:90-129`) draws a 7px dot row for ≤ 17 steps, else a 180 × 7 bar with `rgba(0,0,0,0.18)` / `#131313` | **MISMATCH** (covered in `specs/lesson-reader-16-26.md`) |

### f.4 Where the canvas contradicts itself

1. **Frame 1's art container is 270 wide but its content is 268.8.** The `scale(1.12)` on a
   240 box gives 268.8; the wrapper declares 270. Measured, the art lands at L 62.1 inside a
   wrapper at L 61.5 — 0.6px of slack each side, symmetric. Evidence supports treating the
   drawing as **268.8 × 224 centred**, and dropping the 270 entirely.
2. **Frames 18 and 23 declare a 340-wide drawing inside a 317-wide content box**
   (`padding: 0 38px` on a 393 frame). Chrome resolves this as a symmetric 11.5px overrun
   on each side — measured L 26.5 on both frames. Evidence supports **letting it bleed**,
   not clamping to the gutter; the gutter is for type only.
3. **Frames 1 and 23 disagree on the lesson's title case** — `Surviving the Night` vs
   `Surviving the night`. Both are in the raw files. The cover board (1) is title case, the
   task board (23) is sentence case; treat them as two different strings, not one.
4. **Frame 9's halo escapes its own box** (100 tall from top 8 in a 96-tall container, no
   `overflow:hidden`) while frames 1, 18 and 23 all clip. Evidence supports **no clip on
   drawing B**; a clip would slice 12px off the bottom of the glow, which is the softest
   part of it.

---

## g. What must change — in order

1. **`src/components/lesson/scenes.tsx` — fix `SignWash` first.** It is the app's existing
   blur-substitute and it is wrong in three ways that every new drawing will inherit.
   * Grow every shadow ellipse by 2σ: `rx = shadow.w/2 + 5`, `ry = shadow.h/2 + 5`
     (currently `scenes.tsx:721-722`).
   * Replace the objectBoundingBox `<RadialGradient>` for shadows with a vertical
     `<LinearGradient>` on a rounded `<Rect>`, using the nine stops in §e.7.1 — the
     current radial stretches the 5px falloff to 59px on a 118-wide ellipse.
   * Multiply the shadow peak by **0.9722** and each halo peak by the factor in §e.7.2's
     table (0.7354 / 0.7509 / 0.9340 / 0.8969), and push each halo's zero stop out to
     `R₀ + 2σ` (currently a flat `0.74` at `scenes.tsx:698`).

2. **`src/components/lesson/scenes.tsx` — add `BedroomScene({ scale = 1 })`.** One `<Svg>`,
   `viewBox="0 0 340 200"`, `width = 340 * scale`, `height = 200 * scale`, the 27 pieces of
   §e.4 in that exact order. Use the existing `roundedRect()` for pieces 6–13, 20–22 and 25;
   `headland(-30, 370, 158, 72, 26)` for piece 4; the even-odd `<Path>` of §e.4 for the
   crescent; `matrix(1 -0.1227846 0 1 0 31.924)` for the door leaf; the four-point `<Path>`
   `M205.04 158 L265.52 158 L284 170 L200 170 Z` for the light spill with the 100°
   gradient endpoints `(0.002742, −0.113617) → (0.997258, 1.113617)`. Frames 18 and 23 both
   consume it: `scale={1}` and `scale={0.85}`.

3. **`src/components/lesson/scenes.tsx` — add `NightRoomScene()`.** One `<Svg>`,
   `viewBox="0 0 240 200"`, rendered `width={268.8} height={224}`, the 27 pieces of §e.1.
   Draw the window's `0 0 0 6px #E4E3DE` ring as an explicit rounded rect at
   `(38, 10, 70 × 84)` radius 12 *under* the pane, since SVG has no spread shadow. Keep the
   sill after the window.

4. **`src/components/lesson/scenes.tsx` — add `SunriseScene()`.** `viewBox="0 0 240 108"`
   (not 96 — see §f.4.4), five pieces, the disc's gradient in **userSpaceOnUse** with
   `cx 19.2 cy 14.4 r 44.2538`, and the two dashes and the horizon line at their **clamped**
   radii 1.75 and 0.75.

5. **`src/components/lesson/scenes.tsx` — add `ClockScene()`.** `viewBox="0 0 96 96"`, eight
   pieces, hands as `<Rect rx={1.5}>` with `transform="rotate(-52 48 48)"` on the short one.
   The half-pixel `left`s (46.5, 46.75) are load-bearing; do not round.

6. **`src/components/lesson/scenes.tsx` — add `SleepPlaceIcon({ name })`** carrying the four
   verbatim SVGs of §e.5 at `width={22} height={22} viewBox="0 0 20 20"`, stroke `#3A3934`.
   Replace icon 2's `M6.8 7.5h0M13.2 7.5h0` with two `<Circle r={0.9} />` — RN will not draw
   the zero-length caps.

7. **`src/components/lesson/cover.tsx` — stop using `LessonCover` on the lesson-open board.**
   The canvas's cover board carries `NightRoomScene` below the title, not a circular
   medallion above it. Either retire the medallion from `PageOpen` /`PageComplete`
   (`src/app/lesson/[slug].tsx:212, 367`) or scope it to the lesson-overview screens that
   still draw it. `cover.tsx` itself needs no geometry change — its dome maths is already
   the canvas's.

8. **`src/lib/theme.ts` — add the seven missing colours** rather than substituting near
   neighbours: `#EAE9E3` (floor), `#DEDDD7` (desk), `#E4E2DB` (clock ring), `#C9C7C0`
   (clock ticks), `#2A2E35` (phone bezel), `#C49856` (sun's outer stop), and the blue-grey
   family `#CBDAE8` / `#C8E1EB` / `#BECDDC`. `colors.track` (`#C6C5C0`) and
   `colors.textSofter` (`#B4B1AB`) already match the canvas exactly and should be used by
   name; nothing else in the palette is a legitimate stand-in.

9. **Do not substitute `colors.ink` (`#131313`) for the canvas's dark gradient.** The window
   pane and the phone body are `#12151B → #1A2027`. Both hexes already exist in
   `src/components/today/kit.tsx` and `src/components/day/kit.tsx`; lift them into the
   theme as a named pair rather than flattening to ink.
