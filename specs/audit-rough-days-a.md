# Property audit — Rough Days, set A

Six frames, three app files (plus the two shared primitives they route through), every declaration compared one at a time.

**Frames (pretty source, read in full):** `.uifinal/pretty/final/Email Login/{Rough-Loneliness-I, Rough-Loneliness-II, Rough-Loneliness-III, Rough-Anxiety-II, Rough-Anxiety-III, Rough-Stress-I}.html`

The pretty copies were verified lossless against `.uifinal/final/Email Login/` before use: declaration lists and non-`style` attribute lists are byte-identical per frame (255/255, 203/203, 215/215, 199/199, 198/198, 223/223 declarations; 66/81/85/87/81/74 attributes).

**App source (read in full):**
- `/Users/admin/Documents/tideline/src/components/roughDays/kit.tsx` (749 lines) — cited below as `kit:NNN`. Draws every one of these six frames.
- `/Users/admin/Documents/tideline/src/content/roughDays.ts` (104 lines) — cited as `rd:NNN`. All strings.
- `/Users/admin/Documents/tideline/src/app/(app)/rough-days.tsx` (94 lines) — cited as `days:NNN`. **None of the six frames draw this screen.** It is the picker shelf the v3 canvas dropped (`kit:12-17`, `days:12-20`); no frame in this set contains a `Rough days` heading, a `The universal interrupt` card or a seven-row list. Its only surface of contact with these six frames is the data it reads, audited in §9.
- `/Users/admin/Documents/tideline/src/app/rough-protocol.tsx` (42 lines) — cited as `prot:NNN`. The host that feeds `RDMovePage`; carries no styling of its own but selects the page index, which the dots and the two button labels depend on.
- Supporting primitives read in full and cited where they change a value: `src/components/ui/AppText.tsx`, `src/components/ui/press-scale.tsx`, `src/components/ui/Grain.tsx`, `src/lib/theme.ts`.

## Coordinate rules used throughout

1. Each frame is a `393 × 852` div whose `top` values include a **54px status bar the app never builds**.
2. All six frames draw one **paper sheet** at frame `top:52`, `bottom:0` — an 800pt box. Every child inside that sheet is positioned against the *sheet*, not the frame, so **child tops are compared verbatim**; only the sheet itself carries the −54. Sheet top: canvas `52` → **app-equivalent `−2`** (2pt above where the status bar ends). App writes `top: Math.max(0, insets.top − 2)` (`kit:708`).
3. For any sheet child quoted below, the frame-absolute top is `sheet-local + 52` and the app-equivalent (measured from the safe-area top) is `sheet-local − 2`. Example: the headline at sheet-local `104` is frame-absolute `156`, app-equivalent `102`. Both are given here once rather than repeated on 300 rows.
4. **Device caveat, stated once:** the canvas models a 393×852 device with a 54pt bar; a real 393×852 iPhone reports a 59pt top inset. Everything inside the sheet therefore lands 5pt lower on device than on canvas. That is a canvas-vs-hardware fact, not a port defect, and is not counted as a mismatch. Bottom-anchored elements (the pill at `bottom:88`, the ghost at `bottom:44`) are unaffected — both sheets end at the screen bottom.
5. Artwork shapes are quoted board-local, against the `240 × 220` slot at sheet-local `left:76 top:216`. Neither the canvas nor the app applies any offset inside that slot, so board-local numbers compare verbatim.

## Verdict tokens

- `match` — the app carries the design's literal.
- `MISMATCH` — the app carries a different value; actionable.
- `MISMATCH*` — the design uses a CSS feature React Native cannot express (`filter: blur()`, `text-wrap: balance`). The app substitutes an approximation. Listed separately in Findings; the numbers differ and the row says so.
- `n/a` — canvas gallery chrome with no app counterpart.

Rows are `(element, property)`. Where the design declares nothing for a property, a row appears only if the app declares something (so additions are visible). Artwork shape rows carry the shape's whole geometry tuple in one row — every number in the tuple is transcribed on both sides, so no value is elided.

---

## 0 · Frame shell (identical in all six frames — audited once)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | Frame root | width | `393px` | device viewport width (393 on the modelled device) | match |
| all 6 | Frame root | height | `852px` | device viewport height (852) | match |
| all 6 | Frame root | position | `relative` | root `View flex:1` (`kit:702`) | match |
| all 6 | Frame root | overflow | `hidden` | not set — screen root, nothing to clip (the sheet clips its own children) | match |
| all 6 | Frame root | background | `#EDECE7` | `'#EDECE7'` (`kit:702`) | match |
| all 6 | Frame root | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | iOS `'System'` for every weight (`theme.ts:162-170`, via `sans()` `theme.ts:191-197`) | match |
| all 6 | Frame root | -webkit-font-smoothing | `antialiased` | applied on web only (`AppText.tsx:125-127`) | match |
| all 6 | Frame root | flex-shrink | `0` | n/a — canvas gallery layout | n/a |
| all 6 | Frame root | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | n/a — canvas device-frame chrome, not an app surface | n/a |
| all 6 | Status bar row | position / top / left / right | `absolute` / `0` / `0` / `0` | not built — OS status bar | match (by design) |
| all 6 | Status bar row | height / padding / box-sizing / z-index | `54px` / `6px 32px 0 46px` / `border-box` / `20` | not built — OS status bar | match (by design) |
| all 6 | Status bar row | display / align-items / justify-content | `flex` / `center` / `space-between` | not built | match (by design) |
| all 6 | Status bar · clock | text / size / weight / letter-spacing / colour | `9:41` / `17px` / `600` / `-0.2px` / `#1D1C1A` | OS-drawn; app sets `StatusBar style="dark"` (`prot:28`) | match (by design) |
| all 6 | Status bar · glyph row | display / align-items / gap | `flex` / `center` / `7px` | OS-drawn | match (by design) |
| all 6 | Status bar · signal svg | size / viewBox / 4 rects / rx / fill | `19×12` / `0 0 19 12` / `(0,7.5,3.2,4.5) (4.8,5,3.2,7) (9.6,2.5,3.2,9.5) (14.4,0,3.2,12)` / `0.7` / `#1D1C1A` | OS-drawn | match (by design) |
| all 6 | Status bar · wifi svg | size / viewBox / 2 paths + circle / fill | `17×12` / `0 0 17 12` / `M8.5 3.2C10.8 3.2…Z`, `M8.5 6.8C9.9 6.8…Z`, `cx 8.5 cy 10.5 r 1.5` / `#1D1C1A` | OS-drawn | match (by design) |
| all 6 | Status bar · battery svg | size / viewBox / shell / fill / cap | `27×13` / `0 0 27 13` / `rect 0.5,0.5,23,12 rx 3.5 stroke #1D1C1A @0.35` / `rect 2,2,20,9 rx 2 #1D1C1A` / `path M25 4.5V8.5… #1D1C1A @0.4` | OS-drawn | match (by design) |

## 1 · Paper sheet (identical in all six frames)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | Paper sheet | position | `absolute` | `'absolute'` (`kit:705`) | match |
| all 6 | Paper sheet | left | `0` | `0` (`kit:706`) | match |
| all 6 | Paper sheet | right | `0` | `0` (`kit:707`) | match |
| all 6 | Paper sheet | top | `52` (frame) → app-equivalent `−2` | `Math.max(0, insets.top − 2)` = `−2` from the safe-area top (`kit:708`) | match |
| all 6 | Paper sheet | bottom | `0` | `0` (`kit:709`) | match |
| all 6 | Paper sheet | border-radius | `24px 24px 0 0` | `borderTopLeftRadius: 24`, `borderTopRightRadius: 24`, bottom corners unset → `0` (`kit:710-711`) | match |
| all 6 | Paper sheet | background | `#F4F3F0` | `'#F4F3F0'` (`kit:712`) | match |
| all 6 | Paper sheet | overflow | `hidden` | `'hidden'` (`kit:713`) | match |
| all 6 | Paper sheet | z-order vs status bar | below (bar carries `z-index:20`) | OS status bar composites above the app | match |

## 2 · Grain overlay (identical in all six frames)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | Grain | position / inset | `absolute` / `0` | `absolute`, `top/left/right/bottom: 0` (`Grain.tsx:16`) | match |
| all 6 | Grain | background-image | `url('noise-dark.png')` | `require('assets/images/noise-dark.png')` (`kit:9`, used `kit:715`) | match |
| all 6 | Grain | tiling | CSS default `repeat` at the file's own size | `resizeMode="repeat"` (`Grain.tsx:17`) | match |
| all 6 | Grain | opacity | `0.07` | `0.07` (`kit:715`) | match |
| all 6 | Grain | pointer-events | `none` | `pointerEvents="none"` (`Grain.tsx:16`) | match |
| all 6 | Grain | z-order | first child of the sheet | first child of the sheet (`kit:715`, before `RDGrabber`) | match |

## 3 · Grabber (identical in all six frames)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | Grabber rail | position / left / right / top | `absolute` / `0` / `0` / `12` | `absolute` / `0` / `0` / `12` (`kit:637`) | match |
| all 6 | Grabber rail | horizontal centring | `display:flex; justify-content:center` | `alignItems: 'center'` on a column (`kit:637`) | match |
| all 6 | Grabber pill | width | `38px` | `38` (`kit:638`) | match |
| all 6 | Grabber pill | height | `5px` | `5` (`kit:638`) | match |
| all 6 | Grabber pill | border-radius | `3px` | `3` (`kit:638`) | match |
| all 6 | Grabber pill | background | `rgba(19,19,19,0.16)` | `'rgba(19,19,19,0.16)'` (`kit:638`) | match |

## 4 · Close cross (identical in all six frames)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | Close X | position / right / top | `absolute` / `22` / `26` | `absolute` / `22` / `26` (`kit:649`) | match |
| all 6 | Close X | svg width / height | `20` / `20` | `20` / `20` (`kit:650`; hit box also `20×20`, `kit:649`) | match |
| all 6 | Close X | viewBox | `0 0 20 20` | `0 0 20 20` (`kit:650`) | match |
| all 6 | Close X | path `d` | `M3 3l14 14M17 3L3 17` | `M3 3l14 14M17 3L3 17` (`kit:651`) | match |
| all 6 | Close X | stroke | `#55534E` | `#55534E` (`kit:651`) | match |
| all 6 | Close X | stroke-width | `2` | `2` (`kit:651`) | match |
| all 6 | Close X | stroke-linecap | `round` | `round` (`kit:651`) | match |
| all 6 | Close X | fill | not declared → SVG default `black` (both subpaths are zero-area lines, nothing paints) | not declared → same default, same nothing (`kit:651`) | match |
| all 6 | Close X | stroke-linejoin | not declared | not declared | match |
| all 6 | Close X | hit target | `cursor:pointer` on the bare svg | `PressScale` `minHeight:0` + `hitSlop 16` all round (`kit:648-649`) | n/a (no visual) |

## 5 · Progress dots

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | Dot rail | position / left / right / top | `absolute` / `0` / `0` / `66` | `absolute` / `0` / `0` / `66` (`kit:659`) | match |
| all 6 | Dot rail | direction / justify-content | row (`display:flex`) / `center` | `flexDirection: 'row'` / `justifyContent: 'center'` (`kit:659`) | match |
| all 6 | Dot rail | gap | `6px` | `6` (`kit:659`) | match |
| all 6 | Dot rail | count | 3 | `total` = `p.pages.length` = 3 (`prot:22`, `rd:42`) | match |
| all 6 | Dot · active | width | `20px` | `i === index ? 20` (`kit:661`) | match |
| all 6 | Dot · active | height | `6.5px` | `6.5` (`kit:661`) | match |
| all 6 | Dot · active | border-radius | `4px` | `4` (`kit:661`) | match |
| all 6 | Dot · active | background | `#131313` | `'#131313'` (`kit:661`) | match |
| all 6 | Dot · inactive | width | `6.5px` | `6.5` (`kit:661`) | match |
| all 6 | Dot · inactive | height | `6.5px` | `6.5` (`kit:661`) | match |
| all 6 | Dot · inactive | border-radius | `4px` | `4` (`kit:661`) | match |
| all 6 | Dot · inactive | background | `rgba(19,19,19,0.18)` | `'rgba(19,19,19,0.18)'` (`kit:661`) | match |
| Rough-Loneliness-I | Dot rail | active index | 1st (`20px` dot first) | `index` 0 → 1st (`prot:23`, `kit:661`) | match |
| Rough-Loneliness-II | Dot rail | active index | 2nd | `index` 1 → 2nd | match |
| Rough-Loneliness-III | Dot rail | active index | 3rd | `index` 2 → 3rd | match |
| Rough-Anxiety-II | Dot rail | active index | 2nd | `index` 1 → 2nd | match |
| Rough-Anxiety-III | Dot rail | active index | 3rd | `index` 2 → 3rd | match |
| Rough-Stress-I | Dot rail | active index | 1st | `index` 0 → 1st | match |

## 6 · Headline

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | Headline | position / left / right | `absolute` / `36` / `36` | `absolute` / `36` / `36` (`kit:719`) | match |
| all 6 | Headline | top | `104` (sheet-local; frame-absolute `156`, app-equivalent `102`) | `104` (`kit:719`) | match |
| all 6 | Headline | text-align | `center` | `center` prop (`kit:719`, `AppText.tsx:132`) | match |
| all 6 | Headline | font-size | `26px` | `26` (`kit:719`) | match |
| all 6 | Headline | font-weight | `500` | `sans('500')` (`kit:719`) | match |
| all 6 | Headline | letter-spacing | `-0.2px` | `-0.2` (`kit:719`); explicit, so `AppText` keeps it (`AppText.tsx:120,138`) | match |
| all 6 | Headline | line-height | `33px` | `33` (`kit:719`); explicit, so no repair applies (`AppText.tsx:139-143`) | match |
| all 6 | Headline | color | `#1D1C1A` | `'#1D1C1A'` (`kit:719`) | match |
| all 6 | Headline | text-wrap | not declared → `wrap` | native: nothing; web only: `'pretty'` added by the `body` variant (`AppText.tsx:128`) | match (native); web-only addition, noted in Findings |
| Rough-Loneliness-I | Headline | text | `Lonely tonight.` | `'Lonely tonight.'` (`rd:48`) | match |
| Rough-Loneliness-II | Headline | text | `It wants company.` | `'It wants company.'` (`rd:49`) | match |
| Rough-Loneliness-III | Headline | text | `One text.` | `'One text.'` (`rd:50`) | match |
| Rough-Anxiety-II | Headline | text | `The valve refills itself.` | `'The valve refills itself.'` (`rd:57`) | match |
| Rough-Anxiety-III | Headline | text | `Ten slow breaths.` | `'Ten slow breaths.'` (`rd:58`) | match |
| Rough-Stress-I | Headline | text | `Heavy day.` | `'Heavy day.'` (`rd:64`) | match |

## 7 · Sub-line

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | Sub | position / left / right | `absolute` / `44` / `44` | `absolute` / `44` / `44` (`kit:722`) | match |
| all 6 | Sub | top | `152` (frame-absolute `204`, app-equivalent `150`) | `152` (`kit:722`) | match |
| all 6 | Sub | text-align | `center` | `center` prop (`kit:722`) | match |
| all 6 | Sub | font-size | `14.5px` | `14.5` (`kit:722`) | match |
| all 6 | Sub | font-weight | `400` | `sans('400')` (`kit:722`) | match |
| all 6 | Sub | line-height | `21px` | `21` (`kit:722`) | match |
| all 6 | Sub | color | `#8B8882` | `'#8B8882'` (`kit:722`) | match |
| all 6 | Sub | letter-spacing | not declared → `normal` | inherited `body` `-0.1` is deleted because the caller names its own `fontSize` and no tracking (`AppText.tsx:120,138`) | match |
| all 6 | Sub | text-wrap | `balance` | native: no equivalent, nothing applied; web: `'pretty'` (`AppText.tsx:128`) | MISMATCH* |
| Rough-Loneliness-I | Sub | text | `The pull isn’t about the screen. It’s about the empty room.` | identical, same `’` (`rd:48`) | match |
| Rough-Loneliness-II | Sub | text | `The itch is for another person, not a screen — the screen just answers fastest.` | identical, same `—` (`rd:49`) | match |
| Rough-Loneliness-III | Sub | text | `Reach outward, not inward.` | identical (`rd:50`) | match |
| Rough-Anxiety-II | Sub | text | `The urge promises release, then hands the pressure back with interest.` | identical (`rd:57`) | match |
| Rough-Anxiety-III | Sub | text | `Slow the body first; the mind follows.` | identical (`rd:58`) | match |
| Rough-Stress-I | Sub | text | `Stress narrows the mind to the nearest exit — and it knows a fast one.` | identical, same `—` (`rd:64`) | match |

## 8 · Artwork slot (the box, not its contents)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | Art slot | position / left / top | `absolute` / `76` / `216` | `absolute` / `76` / `216` (`kit:725`) | match |
| all 6 | Art slot | width / height | `240` / `220` | `240` / `220` (`kit:725`) | match |
| all 6 | Art board (inner) | inset / overflow | `0` / `hidden` | fills the slot at `0,0`, `width 240 height 220`, `overflow:'hidden'` (`kit:121`) | match |
| all 6 | Art board | children coordinate origin | board-local (no offset) | board-local via `abs()` (`kit:25`) | match |

## 9 · Instruction line (`act`) — third pages only

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Loneliness-III, Anxiety-III | Act line | position / left / right | `absolute` / `48` / `48` | `absolute` / `48` / `48` (`kit:729`) | match |
| Loneliness-III, Anxiety-III | Act line | top | `452` (frame-absolute `504`, app-equivalent `450`) | `452` (`kit:729`) | match |
| Loneliness-III, Anxiety-III | Act line | text-align | `center` | `center` prop (`kit:729`) | match |
| Loneliness-III, Anxiety-III | Act line | font-size | `16px` | `16` (`kit:729`) | match |
| Loneliness-III, Anxiety-III | Act line | font-weight | `500` | `sans('500')` (`kit:729`) | match |
| Loneliness-III, Anxiety-III | Act line | line-height | `24px` | `24` (`kit:729`) | match |
| Loneliness-III, Anxiety-III | Act line | color | `#1D1C1A` | `'#1D1C1A'` (`kit:729`) | match |
| Loneliness-III, Anxiety-III | Act line | letter-spacing | not declared | inherited `-0.1` deleted (`AppText.tsx:120,138`) | match |
| Loneliness-III, Anxiety-III | Act line | text-wrap | `balance` | native: nothing; web: `'pretty'` (`AppText.tsx:128`) | MISMATCH* |
| Rough-Loneliness-III | Act line | text | `Message one person — not about this. A meme counts.` | identical (`rd:50`) | match |
| Rough-Anxiety-III | Act line | text | `Four counts in, six counts out — ten times through.` | identical (`rd:58`) | match |
| Loneliness-I, Loneliness-II, Anxiety-II, Stress-I | Act line | presence | absent | `act` undefined on pages 1 and 2 → not rendered (`kit:728`, `rd:48-49,57,64`) | match |

## 10 · Primary pill

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | Primary pill | position / left / right | `absolute` / `24` / `24` | `absolute` / `24` / `24` (`kit:736`) | match |
| all 6 | Primary pill | bottom | `88` | `88` (`kit:736`) | match |
| all 6 | Primary pill | height | `54` | `height: 54`, `minHeight: 54` (`kit:736`) — the `minHeight:44` default from `PressScale` (`press-scale.tsx:33`) is overridden | match |
| all 6 | Primary pill | border-radius | `27px` | `27` (`kit:736`) | match |
| all 6 | Primary pill | background | `#131313` | `'#131313'` (`kit:736`) | match |
| all 6 | Primary pill | align-items | `center` | `'center'` (`kit:736`) | match |
| all 6 | Primary pill | justify-content | `center` | `'center'` (`kit:736`) | match |
| all 6 | Primary pill | border / shadow | none declared | none | match |
| all 6 | Pill label | font-size | `16.5px` | `16.5` (`kit:737`) | match |
| all 6 | Pill label | font-weight | `600` | `sans('600')` (`kit:737`) | match |
| all 6 | Pill label | letter-spacing | `0.2px` | `0.2` (`kit:737`) | match |
| all 6 | Pill label | color | `#FFFFFF` | `'#FFFFFF'` (`kit:737`) | match |
| all 6 | Pill label | line-height | not declared → normal | inherited `body` leading deleted (caller names its own size, no leading) (`AppText.tsx:119,139`) | match |
| Rough-Loneliness-I | Pill label | text | `Walk through it` | `RD_CTA[0] = 'Walk through it'` (`kit:669`, step 0 `kit:699`) | match |
| Rough-Loneliness-II | Pill label | text | `Next` | `RD_CTA[1] = 'Next'` (`kit:669`) | match |
| Rough-Loneliness-III | Pill label | text | `Done` | `RD_CTA[2] = 'Done'` (`kit:669`) | match |
| Rough-Anxiety-II | Pill label | text | `Next` | `RD_CTA[1]` | match |
| Rough-Anxiety-III | Pill label | text | `Done` | `RD_CTA[2]` | match |
| Rough-Stress-I | Pill label | text | `Walk through it` | `RD_CTA[0]` | match |
| all 6 | Primary pill | pressed state | none drawn (only `cursor:pointer`) | `scale 0.96` over 110ms (`press-scale.tsx:25`) | n/a — no state drawn to compare |

## 11 · Ghost link

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | Ghost | position / left / right | `absolute` / `0` / `0` | `absolute` / `0` / `0` (`kit:743`) | match |
| all 6 | Ghost | bottom | `44` | `44` (`kit:743`) | match |
| all 6 | Ghost | text-align | `center` | `alignItems:'center'` on the full-width row (`kit:743`) | match |
| all 6 | Ghost | intrinsic height | one normal line box of 14.5px text (no `height`, no `line-height`) | `minHeight: 0` overriding `PressScale`'s 44 (`kit:743`, `press-scale.tsx:33`); text keeps its natural line box | match |
| all 6 | Ghost label | font-size | `14.5px` | `14.5` (`kit:744`) | match |
| all 6 | Ghost label | font-weight | `500` | `sans('500')` (`kit:744`) | match |
| all 6 | Ghost label | color | `#8B8882` | `'#8B8882'` (`kit:744`) | match |
| all 6 | Ghost label | line-height | not declared | inherited leading deleted (`AppText.tsx:119,139`) | match |
| all 6 | Ghost label | letter-spacing | not declared | inherited `-0.1` deleted (`AppText.tsx:120,138`) | match |
| Rough-Loneliness-I | Ghost label | text | `Not tonight` | `RD_GHOST[0] = 'Not tonight'` (`kit:670`) | match |
| Rough-Loneliness-II | Ghost label | text | `Back` | `RD_GHOST[1] = 'Back'` (`kit:670`) | match |
| Rough-Loneliness-III | Ghost label | text | `Back` | `RD_GHOST[2] = 'Back'` (`kit:670`) | match |
| Rough-Anxiety-II | Ghost label | text | `Back` | `RD_GHOST[1]` | match |
| Rough-Anxiety-III | Ghost label | text | `Back` | `RD_GHOST[2]` | match |
| Rough-Stress-I | Ghost label | text | `Not tonight` | `RD_GHOST[0]` | match |
| all 6 | Ghost | hit target | `cursor:pointer` on the text block | `hitSlop` 16 top/bottom, 20 left/right (`kit:742`) | n/a (no visual) |

## 12 · Shared drawing primitives (how the app expresses the CSS constructs every drawing reuses)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | Glow disc | gradient type | `radial-gradient(closest-side, …)` on a square box | `RadialGradient cx/cy 50% r 50%` painting an `Ellipse rx/ry = size/2` (`kit:32-37`) — for a square bbox `closest-side` and `r 50%` are the same radius | match |
| all 6 | Glow disc | stop 1 | colour at `0%`, stated alpha | `Stop offset="0" stopOpacity={alpha}` (`kit:33`) | match |
| all 6 | Glow disc | stop 2 | same colour, alpha `0`, at `74%` | `Stop offset="0.74" stopOpacity={0}` (`kit:34`) | match |
| all 6 | Glow disc | colour | `rgb(226,186,120)` on every glow in these six frames | `color = '#E2BA78'` default (`kit:28`) = `rgb(226,186,120)` | match |
| all 6 | Glow disc | border-radius | `50%` | `Ellipse` (`kit:37`) | match |
| all 6 | Glow disc | filter | `blur(4px)` | not applied — RN has no blur filter; the gradient falloff alone stands in (`kit:23-24`) | MISMATCH* |
| all 6 | Ground shade | fill | flat `rgba(0,0,0,0.10)` across the whole ellipse | radial ramp: `#000 @0.10` held to `45%`, then to `0` at `100%` (`kit:48-52`) | MISMATCH* |
| all 6 | Ground shade | border-radius | `50%` on a non-square box → ellipse | `Ellipse rx=w/2 ry=h/2` (`kit:54`) | match |
| all 6 | Ground shade | filter | `blur(5px)` | not applied — the radial ramp above is the substitute (`kit:42-43`) | MISMATCH* |
| Loneliness-I, Loneliness-III | Pane gradient | `linear-gradient(180deg, A, B)` | two stops, top to bottom | `LinearGradient x1 0 y1 0 x2 0 y2 1`, `Stop 0 = from`, `Stop 1 = to` on an `Rect rx/ry = r` (`kit:75-80`) | match |
| all 6 | Speck a | left / top / w / h / radius / fill | `216` / `20` / `2` / `2` / `50%` / `rgba(200,225,235,0.4)` | `abs(216, 20, 2, 2, r 1, 'rgba(200,225,235,0.4)')` (`kit:100,103`) | match |
| all 6 | Speck b | left / top / w / h / radius / fill | `8` / `48` / `2` / `2` / `50%` / `rgba(200,225,235,0.3)` | `abs(8, 48, 2, 2, r 1, 'rgba(200,225,235,0.3)')` (`kit:100,104`) | match |

## 13 · Artwork — Rough-Loneliness-I (`emptyroom`, `kit:122-142`)

19 shapes. Design paint order top-to-bottom; the app emits them in the same order.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Loneliness-I | art name | binding | (drawing #1 of the loneliness run) | `art: 'emptyroom'` (`rd:48`) | match |
| Loneliness-I | 1 glow | left / top / w / h / alpha | `120` / `36` / `120` / `120` / `0.38` | `Glow l=120 t=36 size=120 alpha=0.38` (`kit:124`) | match |
| Loneliness-I | 2 moon shadow | left / top / w / h / radius / fill | `30` / `14` / `30` / `30` / `50%` / `#DCDED8` | `abs(30, 14, 30, 30, r 15, '#DCDED8')` via `Moon l=22 t=8 size=30` (`kit:113`, call `kit:125`) | match |
| Loneliness-I | 3 moon disc | left / top / w / h / radius / fill | `22` / `8` / `30` / `30` / `50%` / `#F4F3F0` | `abs(22, 8, 30, 30, r 15, '#F4F3F0')` (`kit:114`) | match |
| Loneliness-I | 4–5 specks | (see §12) | `216,20` @0.4 / `8,48` @0.3 | `Specks` defaults (`kit:126`) | match |
| Loneliness-I | 6 window frame | left / top / w / h / radius / fill | `138` / `30` / `86` / `122` / `8` / `#E4E3DE` | `abs(138, 30, 86, 122, r 8, '#E4E3DE')` (`kit:127`) | match |
| Loneliness-I | 7 pane | left / top / w / h / radius / gradient | `146` / `38` / `70` / `106` / `4` / `linear-gradient(180deg, #F7F6F2, #EDECE7)` | `VGrad l=146 t=38 w=70 h=106 r=4 from '#F7F6F2' to '#EDECE7'` (`kit:128`) | match |
| Loneliness-I | 8 mullion (vert) | left / top / w / h / fill | `180` / `38` / `2` / `106` / `#D6D5D0` | `abs(180, 38, 2, 106, '#D6D5D0')` (`kit:129`) | match |
| Loneliness-I | 9 mullion (horz) | left / top / w / h / fill | `146` / `90` / `70` / `2` / `#D6D5D0` | `abs(146, 90, 70, 2, '#D6D5D0')` (`kit:130`) | match |
| Loneliness-I | 10 curtain | left / top / w / h / radius / fill | `132` / `26` / `14` / `130` / `7` / `#D6D5D0` | `abs(132, 26, 14, 130, r 7, '#D6D5D0')` (`kit:131`) | match |
| Loneliness-I | 11 chair back | left / top / w / h / radius / fill | `26` / `104` / `14` / `58` / `7` / `#C6C5C0` | `abs(26, 104, 14, 58, r 7, '#C6C5C0')` (`kit:132`) | match |
| Loneliness-I | 12 chair seat | left / top / w / h / radius / fill | `26` / `148` / `68` / `18` / `6` / `#D6D5D0` | `abs(26, 148, 68, 18, r 6, '#D6D5D0')` (`kit:133`) | match |
| Loneliness-I | 13 chair arm | left / top / w / h / radius / fill | `86` / `126` / `11` / `40` / `5` / `#C6C5C0` | `abs(86, 126, 11, 40, r 5, '#C6C5C0')` (`kit:134`) | match |
| Loneliness-I | 14 chair leg L | left / top / w / h / radius / fill | `32` / `166` / `5` / `14` / none / `#B4B1AB` | `abs(32, 166, 5, 14, '#B4B1AB')` (`kit:135`) | match |
| Loneliness-I | 15 chair leg R | left / top / w / h / radius / fill | `84` / `166` / `5` / `14` / none / `#B4B1AB` | `abs(84, 166, 5, 14, '#B4B1AB')` (`kit:136`) | match |
| Loneliness-I | 16 table top | left / top / w / h / radius / fill | `108` / `148` / `28` / `5` / `2` / `#D6D5D0` | `abs(108, 148, 28, 5, r 2, '#D6D5D0')` (`kit:137`) | match |
| Loneliness-I | 17 table stem | left / top / w / h / radius / fill | `119` / `153` / `4` / `24` / none / `#C6C5C0` | `abs(119, 153, 4, 24, '#C6C5C0')` (`kit:138`) | match |
| Loneliness-I | 18 shade (chair) | left / top / w / h | `20` / `182` / `90` / `13` | `Shade l=20 t=182 w=90 h=13 alpha 0.1` (`kit:139`) | match (geometry); fill/blur → §12 |
| Loneliness-I | 19 shade (window) | left / top / w / h | `136` / `158` / `90` / `13` | `Shade l=136 t=158 w=90 h=13 alpha 0.1` (`kit:140`) | match (geometry); fill/blur → §12 |
| Loneliness-I | paint order | z-order | glow → moon×2 → specks → frame → pane → mullions → curtain → chair → table → shades | identical emission order (`kit:124-140`) | match |

## 14 · Artwork — Rough-Loneliness-II (`mugphone`, `kit:144-162`)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Loneliness-II | art name | binding | (drawing #2 of the loneliness run) | `art: 'mugphone'` (`rd:49`) | match |
| Loneliness-II | 1 glow | left / top / w / h / alpha | `126` / `58` / `110` / `110` / `0.32` | `Glow l=126 t=58 size=110 alpha=0.32` (`kit:146`) | match |
| Loneliness-II | 2–3 specks | (see §12) | `216,20` @0.4 / `8,48` @0.3 | `Specks` defaults (`kit:147`) | match |
| Loneliness-II | 4 table line | left / top / w / h / radius / fill | `30` / `158` / `180` / `4` / `2` / `#D6D5D0` | `abs(30, 158, 180, 4, r 2, '#D6D5D0')` (`kit:148`) | match |
| Loneliness-II | 5 mug body | left / top / w / h / radius / fill | `52` / `132` / `66` / `24` / `7` / `#C6C5C0` | `abs(52, 132, 66, 24, r 7, '#C6C5C0')` (`kit:149`) | match |
| Loneliness-II | 6 mug dot | left / top / w / h / radius / fill | `60` / `139` / `7` / `7` / `50%` / `#B4B1AB` | `abs(60, 139, 7, 7, r 3.5, '#B4B1AB')` (`kit:150`) | match |
| Loneliness-II | 7 phone | left / top / w / h / radius / fill | `146` / `112` / `40` / `44` / `5px 5px 8px 8px` / `#E4E3DE` | `abs(146, 112, 40, 44, TL 5 TR 5 BR 8 BL 8, '#E4E3DE')` (`kit:151`) | match |
| Loneliness-II | 8 mug handle | svg w / h / viewBox / left / top | `16` / `26` / `0 0 16 26` / `182` / `120` | `16` / `26` / `0 0 16 26` / `182` / `120` (`kit:152`) | match |
| Loneliness-II | 8 mug handle | path `d` / stroke / stroke-width / fill / linecap | `M2 4 C13 4 13 22 2 22` / `#D6D5D0` / `4` / `none` / not declared | `M2 4 C13 4 13 22 2 22` / `#D6D5D0` / `4` / `none` / not set (`kit:153`) | match |
| Loneliness-II | 9 steam | svg w / h / viewBox / left / top | `34` / `34` / `0 0 34 34` / `150` / `74` | `34` / `34` / `0 0 34 34` / `150` / `74` (`kit:155`) | match |
| Loneliness-II | 9 steam | path `d` / stroke / stroke-width / fill / linecap | `M8 30 C4 22 12 20 8 12 M20 32 C16 24 24 22 20 14` / `#D6D5D0` / `2.5` / `none` / `round` | identical (`kit:156`) | match |
| Loneliness-II | 10 phone shadow bar | left / top / w / h / radius / fill | `140` / `156` / `52` / `6` / `3` / `#D6D5D0` | `abs(140, 156, 52, 6, r 3, '#D6D5D0')` (`kit:158`) | match |
| Loneliness-II | 11 shade (mug) | left / top / w / h | `46` / `166` / `80` / `13` | `Shade l=46 t=166 w=80 h=13` (`kit:159`) | match (geometry); fill/blur → §12 |
| Loneliness-II | 12 shade (phone) | left / top / w / h | `138` / `168` / `64` / `13` | `Shade l=138 t=168 w=64 h=13` (`kit:160`) | match (geometry); fill/blur → §12 |
| Loneliness-II | paint order | z-order | glow → specks → table → mug → dot → phone → handle → steam → bar → shades | identical (`kit:146-160`) | match |

## 15 · Artwork — Rough-Loneliness-III (`sendtext`, `kit:164-185`)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Loneliness-III | art name | binding | (drawing #3 of the loneliness run) | `art: 'sendtext'` (`rd:50`) | match |
| Loneliness-III | 1 glow | left / top / w / h / alpha | `56` / `44` / `120` / `120` / `0.34` | `Glow l=56 t=44 size=120 alpha=0.34` (`kit:166`) | match |
| Loneliness-III | 2–3 specks | (see §12) | `216,20` @0.4 / `8,48` @0.3 | `Specks` defaults (`kit:167`) | match |
| Loneliness-III | 4 phone shell | left / top / w / h / radius / fill | `82` / `76` / `56` / `100` / `11` / `#E0DFDA` | `abs(82, 76, 56, 100, r 11, '#E0DFDA')` (`kit:168`) | match |
| Loneliness-III | 5 screen | left / top / w / h / radius / gradient | `88` / `83` / `44` / `80` / `6` / `linear-gradient(180deg, #F7F6F2, #EDECE7)` | `VGrad l=88 t=83 w=44 h=80 r=6 from '#F7F6F2' to '#EDECE7'` (`kit:169`) | match |
| Loneliness-III | 6 home bar | left / top / w / h / radius / fill | `102` / `167` / `16` / `3` / `2` / `#B4B1AB` | `abs(102, 167, 16, 3, r 2, '#B4B1AB')` (`kit:170`) | match |
| Loneliness-III | 7 bubble | left / top / w / h / radius / fill | `144` / `52` / `72` / `42` / `12` / `#C6C5C0` | `abs(144, 52, 72, 42, r 12, '#C6C5C0')` (`kit:171`) | match |
| Loneliness-III | 8 bubble tail | svg w / h / viewBox / left / top | `20` / `16` / `0 0 20 16` / `150` / `88` | `20` / `16` / `0 0 20 16` / `150` / `88` (`kit:172`) | match |
| Loneliness-III | 8 bubble tail | path `d` / fill | `M4 0 L4 12 L16 0 Z` / `#C6C5C0` | identical (`kit:173`) | match |
| Loneliness-III | 9 bubble line 1 | left / top / w / h / radius / fill | `156` / `64` / `46` / `5` / `3` / `#F7F6F2` | `abs(156, 64, 46, 5, r 3, '#F7F6F2')` (`kit:175`) | match |
| Loneliness-III | 10 bubble line 2 | left / top / w / h / radius / fill | `156` / `76` / `30` / `5` / `3` / `#F7F6F2` | `abs(156, 76, 30, 5, r 3, '#F7F6F2')` (`kit:176`) | match |
| Loneliness-III | 11 paper plane | svg w / h / viewBox / left / top | `30` / `26` / `0 0 30 26` / `36` / `110` | `30` / `26` / `0 0 30 26` / `36` / `110` (`kit:177`) | match |
| Loneliness-III | 11 paper plane | path `d` / fill | `M2 12 L28 2 L18 24 L13 15 Z` / `#B4B1AB` | identical (`kit:178`) | match |
| Loneliness-III | 12 dashed arc | svg w / h / viewBox / left / top | `44` / `20` / `0 0 44 20` / `58` / `96` | `44` / `20` / `0 0 44 20` / `58` / `96` (`kit:180`) | match |
| Loneliness-III | 12 dashed arc | path `d` / stroke / width / dasharray / fill / linecap | `M2 18 C 14 8 30 4 42 2` / `#D6D5D0` / `2` / `2 5` / `none` / `round` | identical, `strokeDasharray="2 5"` (`kit:181`) | match |
| Loneliness-III | 13 shade | left / top / w / h | `78` / `182` / `72` / `13` | `Shade l=78 t=182 w=72 h=13` (`kit:183`) | match (geometry); fill/blur → §12 |
| Loneliness-III | paint order | z-order | glow → specks → shell → screen → bar → bubble → tail → lines → plane → arc → shade | identical (`kit:166-183`) | match |

## 16 · Artwork — Rough-Anxiety-II (`kettle`, `kit:205-225`)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Anxiety-II | art name | binding | (drawing #2 of the anxiety run) | `art: 'kettle'` (`rd:57`) | match |
| Anxiety-II | 1 glow | left / top / w / h / alpha | `70` / `60` / `110` / `110` / `0.3` | `Glow l=70 t=60 size=110 alpha=0.3` (`kit:207`) | match |
| Anxiety-II | 2–3 specks | (see §12) | `216,20` @0.4 / `8,48` @0.3 | `Specks` defaults (`kit:208`) | match |
| Anxiety-II | 4 kettle body | left / top / w / h / radius / fill | `82` / `96` / `78` / `58` / `26px 26px 12px 12px` / `#D6D5D0` | `abs(82, 96, 78, 58, TL 26 TR 26 BR 12 BL 12, '#D6D5D0')` (`kit:209`) | match |
| Anxiety-II | 5 lid | left / top / w / h / radius / fill | `104` / `88` / `34` / `10` / `5` / `#C6C5C0` | `abs(104, 88, 34, 10, r 5, '#C6C5C0')` (`kit:210`) | match |
| Anxiety-II | 6 knob | left / top / w / h / radius / fill | `117` / `81` / `9` / `9` / `50%` / `#B4B1AB` | `abs(117, 81, 9, 9, r 4.5, '#B4B1AB')` (`kit:211`) | match |
| Anxiety-II | 7 spout | svg w / h / viewBox / left / top | `26` / `20` / `0 0 26 20` / `154` / `104` | `26` / `20` / `0 0 26 20` / `154` / `104` (`kit:212`) | match |
| Anxiety-II | 7 spout | path `d` / fill | `M2 16 L18 16 L24 4 L16 4 Z` / `#C6C5C0` | identical (`kit:213`) | match |
| Anxiety-II | 8 handle | svg w / h / viewBox / left / top | `60` / `30` / `0 0 60 30` / `92` / `62` | `60` / `30` / `0 0 60 30` / `92` / `62` (`kit:215`) | match |
| Anxiety-II | 8 handle | path `d` / stroke / width / fill / linecap | `M6 28 C6 6 54 6 54 28` / `#B4B1AB` / `4` / `none` / `round` | identical (`kit:216`) | match |
| Anxiety-II | 9 steam | svg w / h / viewBox / left / top | `30` / `44` / `0 0 30 44` / `166` / `58` | `30` / `44` / `0 0 30 44` / `166` / `58` (`kit:218`) | match |
| Anxiety-II | 9 steam | path `d` / stroke / width / fill / linecap | `M8 40 C4 30 14 28 10 18 M20 42 C16 32 26 30 22 20 M14 22 C12 14 20 12 16 4` / `#D6D5D0` / `2.5` / `none` / `round` | identical (`kit:219`) | match |
| Anxiety-II | 10 burner bar | left / top / w / h / radius / fill | `72` / `158` / `98` / `4` / `2` / `#B4B1AB` | `abs(72, 158, 98, 4, r 2, '#B4B1AB')` (`kit:221`) | match |
| Anxiety-II | 11 burner glow | left / top / w / h / alpha | `96` / `140` / `52` / `52` / `0.4` | `Glow l=96 t=140 size=52 alpha=0.4` (`kit:222`) | match |
| Anxiety-II | 12 shade | left / top / w / h | `70` / `168` / `104` / `13` | `Shade l=70 t=168 w=104 h=13` (`kit:223`) | match (geometry); fill/blur → §12 |
| Anxiety-II | paint order | z-order | glow → specks → body → lid → knob → spout → handle → steam → bar → burner glow → shade | identical (`kit:207-223`) | match |

## 17 · Artwork — Rough-Anxiety-III (`candle`, `kit:227-246`)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Anxiety-III | art name | binding | (drawing #3 of the anxiety run) | `art: 'candle'` (`rd:58`) | match |
| Anxiety-III | 1 glow | left / top / w / h / alpha | `74` / `34` / `110` / `110` / `0.5` | `Glow l=74 t=34 size=110 alpha=0.5` (`kit:229`) | match |
| Anxiety-III | 2–3 specks | (see §12) | `216,20` @0.4 / `8,48` @0.3 | `Specks` defaults (`kit:230`) | match |
| Anxiety-III | 4 jar | left / top / w / h / radius / fill | `106` / `96` / `30` / `64` / `5` / `#F7F6F2` | `abs(106, 96, 30, 64, r 5, '#F7F6F2')` (`kit:233`) | match |
| Anxiety-III | 4 jar | inner band | `box-shadow: inset 0 0 0 1.5px rgba(0,0,0,0.07)` | `borderWidth: 1.5`, `borderColor: 'rgba(0,0,0,0.07)'` (`kit:233`) — RN paints the border inside the 30×64 box, same 1.5pt band, same 5 → 3.5 inner radius; no child content to displace | match |
| Anxiety-III | 5 wax notch | left / top / w / h / radius / fill | `102` / `108` / `7` / `16` / `4` / `#E4E3DE` | `abs(102, 108, 7, 16, r 4, '#E4E3DE')` (`kit:234`) | match |
| Anxiety-III | 6 wick | left / top / w / h / radius / fill | `119.5` / `88` / `3` / `9` / none / `#55534E` | `abs(119.5, 88, 3, 9, '#55534E')` (`kit:235`) | match |
| Anxiety-III | 7 flame | svg w / h / viewBox / left / top | `18` / `26` / `0 0 18 26` / `112` / `66` | `18` / `26` / `0 0 18 26` / `112` / `66` (`kit:236`) | match |
| Anxiety-III | 7 flame outer | path `d` / fill | `M9 0 C15 8 18 14 18 18 A9 8 0 1 1 0 18 C0 14 3 8 9 0 Z` / `#E2BA78` | identical (`kit:237`) | match |
| Anxiety-III | 7 flame inner | path `d` / fill | `M9 8 C12 12 14 15 14 18 A5 4.5 0 1 1 4 18 C4 15 6 12 9 8 Z` / `#F0DBB4` | identical (`kit:238`) | match |
| Anxiety-III | 8 smoke | svg w / h / viewBox / left / top | `24` / `34` / `0 0 24 34` / `118` / `30` | `24` / `34` / `0 0 24 34` / `118` / `30` (`kit:240`) | match |
| Anxiety-III | 8 smoke | path `d` / stroke / width / fill / linecap | `M12 32 C6 24 18 18 12 8 C10 5 10 3 12 0` / `#D6D5D0` / `2` / `none` / `round` | identical (`kit:241`) | match |
| Anxiety-III | 9 saucer | left / top / w / h / radius / fill | `88` / `160` / `66` / `9` / `5` / `#C6C5C0` | `abs(88, 160, 66, 9, r 5, '#C6C5C0')` (`kit:243`) | match |
| Anxiety-III | 10 shade | left / top / w / h | `84` / `172` / `78` / `13` | `Shade l=84 t=172 w=78 h=13` (`kit:244`) | match (geometry); fill/blur → §12 |
| Anxiety-III | paint order | z-order | glow → specks → jar → notch → wick → flame → smoke → saucer → shade | identical (`kit:229-244`) | match |

## 18 · Artwork — Rough-Stress-I (`loadbag`, `kit:248-266`)

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| Stress-I | art name | binding | (drawing #1 of the stress run) | `art: 'loadbag'` (`rd:64`) | match |
| Stress-I | 1 glow | left / top / w / h / alpha | `60` / `40` / `120` / `120` / `0.32` | `Glow l=60 t=40 size=120 alpha=0.32` (`kit:250`) | match |
| Stress-I | 2–3 specks | (see §12) | `216,20` @0.4 / `8,48` @0.3 | `Specks` defaults (`kit:251`) | match |
| Stress-I | 4 bag body | left / top / w / h / radius / fill | `56` / `76` / `92` / `96` / `18` / `#C6C5C0` | `abs(56, 76, 92, 96, r 18, '#C6C5C0')` (`kit:252`) | match |
| Stress-I | 5 bag pocket | left / top / w / h / radius / fill | `74` / `124` / `56` / `40` / `10` / `#D6D5D0` | `abs(74, 124, 56, 40, r 10, '#D6D5D0')` (`kit:253`) | match |
| Stress-I | 6 pocket seam | left / top / w / h / radius / fill | `99` / `124` / `6` / `40` / none / `#C6C5C0` | `abs(99, 124, 6, 40, '#C6C5C0')` (`kit:254`) | match |
| Stress-I | 7 strap tab L | left / top / w / h / radius / fill | `68` / `70` / `13` / `20` / `6` / `#B4B1AB` | `abs(68, 70, 13, 20, r 6, '#B4B1AB')` (`kit:255`) | match |
| Stress-I | 8 strap tab R | left / top / w / h / radius / fill | `122` / `70` / `13` / `20` / `6` / `#B4B1AB` | `abs(122, 70, 13, 20, r 6, '#B4B1AB')` (`kit:256`) | match |
| Stress-I | 9 handle | svg w / h / viewBox / left / top | `36` / `20` / `0 0 36 20` / `84` / `56` | `36` / `20` / `0 0 36 20` / `84` / `56` (`kit:257`) | match |
| Stress-I | 9 handle | path `d` / stroke / width / fill / linecap | `M4 18 C4 2 32 2 32 18` / `#B4B1AB` / `4.5` / `none` / `round` | identical (`kit:258`) | match |
| Stress-I | 10 slab (bottom) | left / top / w / h / radius / fill / transform | `162` / `150` / `48` / `11` / `3` / `#E4E3DE` / `rotate(-2deg)` | `abs(162, 150, 48, 11, r 3, '#E4E3DE', rotate '-2deg')` (`kit:260`) | match |
| Stress-I | 11 slab (middle) | left / top / w / h / radius / fill / transform | `166` / `138` / `42` / `11` / `3` / `#D6D5D0` / `rotate(2deg)` | `abs(166, 138, 42, 11, r 3, '#D6D5D0', rotate '2deg')` (`kit:261`) | match |
| Stress-I | 12 slab (top) | left / top / w / h / radius / fill / transform | `162` / `126` / `46` / `11` / `3` / `#C6C5C0` / `rotate(-1deg)` | `abs(162, 126, 46, 11, r 3, '#C6C5C0', rotate '-1deg')` (`kit:262`) | match |
| Stress-I | 10–12 slabs | transform-origin | not declared → `50% 50%` | not declared → RN default centre | match |
| Stress-I | 13 shade (bag) | left / top / w / h | `52` / `176` / `104` / `13` | `Shade l=52 t=176 w=104 h=13` (`kit:263`) | match (geometry); fill/blur → §12 |
| Stress-I | 14 shade (slabs) | left / top / w / h | `158` / `166` / `58` / `13` | `Shade l=158 t=166 w=58 h=13` (`kit:264`) | match (geometry); fill/blur → §12 |
| Stress-I | paint order | z-order | glow → specks → bag → pocket → seam → tabs → handle → slabs → shades | identical (`kit:250-264`) | match |

## 19 · `rough-days.tsx` and the data it reads

None of these six frames draw the picker screen, so there is nothing to compare it against here. What *is* checkable is the data contract these frames share with it.

| Frame | Element | Property | Design value | Current app value | match / MISMATCH |
|---|---|---|---|---|---|
| all 6 | protocol run | page count | 3 pages per feeling (dots show 3 on every frame) | `pages: [RDPage, RDPage, RDPage]` (`rd:42`) | match |
| Loneliness ×3 | protocol key | membership | frames labelled `Rough Loneliness I/II/III` | `RD_PROTOCOLS.loneliness.pages[0..2]` (`rd:45-52`), key present in `RD_KEYS` (`rd:104`), rendered by `days:81-88` | match |
| Anxiety ×2 | protocol key | membership | frames labelled `Rough Anxiety II/III` | `RD_PROTOCOLS.anxiety.pages[1..2]` (`rd:53-60`), key in `RD_KEYS` | match |
| Stress-I | protocol key | membership | frame labelled `Rough Stress I` | `RD_PROTOCOLS.stress.pages[0]` (`rd:61-68`), key in `RD_KEYS` | match |
| all 6 | `data-screen-label` | on-screen text | none — a canvas gallery label, never rendered | not rendered | n/a |
| n/a | picker shelf (`days:41-93`) | every property | **no frame in this set draws it** | `Rough days` heading, ink card, seven-row list | n/a — out of scope for these six frames |

---

# Findings

**266 rows across 6 frames** — 254 `match`, **0 `MISMATCH`**, 5 `MISMATCH*` (React Native cannot express the CSS), 7 `n/a` (canvas gallery chrome, OS status bar, and the picker screen no frame in this set draws).

## A · Actionable mismatches

**None.** Every literal the six frames state — every offset, size, radius, hex, alpha, gradient stop, weight, tracking, leading, `viewBox`, `stroke-width`, `stroke-linecap`, `stroke-dasharray`, `transform` and path `d` — is carried verbatim by `kit.tsx` and `roughDays.ts`. That is 254 matching rows, including all 88 artwork-shape rows across the six drawings and all 26 string rows (headline, sub, act, pill label, ghost label).

The two places where the app could have drifted and did not, worth naming because they are the usual failure points:

- **Paint order.** All six drawings emit their shapes in the frames' own DOM order, including the two cases where order carries meaning: the moon's dull disc painting *under* its pale one (`kit:113-114` vs `Rough-Loneliness-I.html:190-209`), and the kettle's burner glow painting *over* the burner bar (`kit:221-222` vs `Rough-Anxiety-II.html:264-284`).
- **`AppText`'s inherited metrics.** Four of the five text runs on these frames declare a size but no tracking, and three declare no leading. `AppText.tsx:117-143` deletes the `body` variant's inherited `-0.1` tracking and its `1.5×` leading in exactly those cases, so the design's "not declared" survives as not declared rather than silently picking up variant metrics.

## B · MISMATCH* — CSS React Native cannot express (5 rows, 4 distinct constructs)

1. **`filter: blur(4px)` on every glow disc.** `src/components/roughDays/kit.tsx:28-39` (`Glow`).
   Current app value: no blur; the radial gradient's own `0 → 0.74` falloff is the whole softness.
   Design value: `blur(4px)` on top of that gradient — `Rough-Loneliness-I.html:187`, `Rough-Loneliness-II.html:187`, `Rough-Loneliness-III.html:187`, `Rough-Anxiety-II.html:187` and `:282` (burner), `Rough-Anxiety-III.html:187`, `Rough-Stress-I.html:187`.
   Seven glow instances across the six frames. The substitute is close because the source is already a soft gradient; the blur only feathers the 74% cut-off.

2. **`filter: blur(5px)` on every ground shade, and the flat fill under it.** `src/components/roughDays/kit.tsx:44-56` (`Shade`).
   Current app value: a radial ramp — `#000` at alpha `0.10` held flat to `45%` of the radius, then falling linearly to `0` at `100%`.
   Design value: a *flat* `rgba(0,0,0,0.10)` ellipse with `border-radius:50%`, blurred 5px — `Rough-Loneliness-I.html:353` and `:364`, `Rough-Loneliness-II.html:284` and `:295`, `Rough-Loneliness-III.html:302`, `Rough-Anxiety-II.html:293`, `Rough-Anxiety-III.html:276`, `Rough-Stress-I.html:308` and `:319`.
   Nine shade instances. This is the loosest of the four substitutions: on a 90 × 13 shade the app's horizontal falloff spans ~24.8pt against the design's ~5pt blur margin, so the app's shade reads narrower and softer across than the canvas's. Counted as one row in §12 rather than nine because `Shade` is a single implementation.

3. **`text-wrap: balance` on the sub-line.** `src/components/roughDays/kit.tsx:722`.
   Current app value: nothing on native; `'pretty'` on web, applied by the `body` variant at `src/components/ui/AppText.tsx:128`.
   Design value: `balance` — `Rough-Loneliness-I.html:163` and the same line number in all six frames.
   Affects where the two- and three-line subs break (`Rough-Loneliness-II`, `Rough-Anxiety-II`, `Rough-Stress-I` are the ones long enough to wrap).

4. **`text-wrap: balance` on the instruction line.** `src/components/roughDays/kit.tsx:729`.
   Current app value: nothing on native; `'pretty'` on web.
   Design value: `balance` — `Rough-Loneliness-III.html:317`, `Rough-Anxiety-III.html:291`.

## C · One noted addition (not counted)

`AppText` adds `textWrap: 'pretty'` on **web** to the headline (`src/components/ui/AppText.tsx:128`), where the design declares no `text-wrap` at all (`Rough-Loneliness-I.html:139-150` and the equivalent block in all six). Inert on iOS and Android — RN native has no `textWrap` — so it is a match on the shipping target. Recorded here because it is an app-side value the design does not state, and because it is an `AppText` policy affecting every `body`-variant run in the app, not something these frames introduced.
