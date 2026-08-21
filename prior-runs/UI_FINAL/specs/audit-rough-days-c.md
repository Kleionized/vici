# Property audit — Rough Days, batch C

Frames (5), read in full from `.uifinal/pretty/final/Email Login/`:

- `Rough-Late-night-III.html` (391 lines)
- `Rough-Home-alone-I.html` (348 lines)
- `Rough-Home-alone-II.html` (337 lines)
- `Rough-Home-alone-III.html` (378 lines)
- `Rough-An-argument-I.html` (371 lines)

App files read in full:

- `/Users/admin/Documents/tideline/src/components/roughDays/kit.tsx` (749 lines) — the target
- `/Users/admin/Documents/tideline/src/content/roughDays.ts` (104 lines) — the strings the kit renders
- `/Users/admin/Documents/tideline/src/app/rough-protocol.tsx` (42 lines) — the caller (`total`, `index`)
- `/Users/admin/Documents/tideline/src/components/ui/AppText.tsx`, `Grain.tsx`, `press-scale.tsx`, `/Users/admin/Documents/tideline/src/lib/theme.ts` (`sans`) — resolves what the kit's text styles actually become

Pretty frames verified byte-faithful to the raw frames (whitespace/prefix-normalised compare of
`.uifinal/final/...` vs `.uifinal/pretty/final/...`: all five identical, 5913 / 5924 / 5420 / 5933 / 5934 chars).

## Coordinate conversion

Only two elements are positioned against the 393 × 852 **frame**; everything else lives inside
the sheet and is sheet-local, so it needs no conversion.

| Element | Canvas top | App-equivalent top (canvas − 54) | App value |
| --- | --- | --- | --- |
| Status bar row | 0 (height 54) | n/a — the app never builds it | OS status bar; `<StatusBar style="dark" />` (rough-protocol.tsx:28) |
| Sheet (`#F4F3F0` rounded panel) | 52 | −2 (2 above where the status bar ends) | `top: Math.max(0, insets.top - 2)` (kit.tsx:708) |

Every `top` quoted in the artwork and body tables below is **sheet-local** (design) / **sheet-local**
(app) and is therefore directly comparable with no 54 subtracted.

Legend: **MISMATCH** = the app can close it. **MISMATCH\*** = RN cannot express the CSS; the
substitution is named in the row.

---

## 1. Frame shell and page chrome

Lines 2–107 of all five pretty frames are byte-identical (verified by line-diff); only the
`data-screen-label` differs. These rows therefore read "All 5".

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| All 5 | Frame root | width | 393px | device width (screen) | match — canvas viewport |
| All 5 | Frame root | height | 852px | device height (screen) | match — canvas viewport |
| All 5 | Frame root | position | relative | root `View flex:1` (kit.tsx:702) | match |
| All 5 | Frame root | overflow | hidden | screen root | match |
| All 5 | Frame root | background | `#EDECE7` | `backgroundColor: '#EDECE7'` (kit.tsx:702) | match |
| All 5 | Frame root | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sans()` → iOS `'System'`, web `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif` (theme.ts:159–189) | match |
| All 5 | Frame root | -webkit-font-smoothing | antialiased | `WebkitFontSmoothing:'antialiased'` on web (AppText.tsx:127) | match |
| All 5 | Frame root | flex-shrink | 0 | n/a — not in a canvas flow | n/a (canvas presentation) |
| All 5 | Frame root | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | n/a — the board's drop shadow under the phone, not app UI |
| All 5 | Status bar row | top / left / right / height | 0 / 0 / 0 / 54px | not built | n/a — OS-drawn (canvas fact) |
| All 5 | Status bar row | padding | `6px 32px 0 46px` | n/a | n/a — OS-drawn |
| All 5 | Status bar row | display / align / justify | flex / center / space-between | n/a | n/a — OS-drawn |
| All 5 | Status bar row | z-index | 20 | n/a | n/a — OS-drawn |
| All 5 | Status-bar clock | font-size / weight / colour / tracking | 17px / 600 / `#1D1C1A` / −0.2px | OS | n/a — OS-drawn; `StatusBar style="dark"` requests the dark ink |
| All 5 | Status-bar signal svg | size / viewBox / bars | 19×12 / `0 0 19 12` / 4 rects x 0,4.8,9.6,14.4 w3.2 rx0.7 `#1D1C1A` | OS | n/a — OS-drawn |
| All 5 | Status-bar wifi svg | size / viewBox / paths | 17×12 / `0 0 17 12` / 2 paths + circle r1.5 `#1D1C1A` | OS | n/a — OS-drawn |
| All 5 | Status-bar battery svg | size / viewBox | 27×13 / `0 0 27 13`; shell rx3.5 stroke `#1D1C1A` @0.35, fill rect rx2, nub `#1D1C1A` @0.4 | OS | n/a — OS-drawn |
| All 5 | Status-bar icon row | gap | 7px | OS | n/a — OS-drawn |
| All 5 | Sheet | left / right / bottom | 0 / 0 / 0 | `left:0, right:0, bottom:0` (kit.tsx:706–709) | match |
| All 5 | Sheet | top | 52px (frame) → −2 app-equivalent | `Math.max(0, insets.top - 2)` (kit.tsx:708) | match |
| All 5 | Sheet | border-radius | `24px 24px 0 0` | `borderTopLeftRadius:24, borderTopRightRadius:24` (kit.tsx:710–711) | match |
| All 5 | Sheet | background | `#F4F3F0` | `backgroundColor:'#F4F3F0'` (kit.tsx:712) | match |
| All 5 | Sheet | overflow | hidden | `overflow:'hidden'` (kit.tsx:713) | match |
| All 5 | Grain | position / inset | absolute / 0 | `position:'absolute', top/left/right/bottom:0` (Grain.tsx:16) | match |
| All 5 | Grain | background-image | `url('noise-dark.png')` | `require('../../../assets/images/noise-dark.png')` (kit.tsx:9) | match |
| All 5 | Grain | tiling | `background-image`, no `background-size` → repeats at file size | `resizeMode="repeat"` (Grain.tsx:17) | match |
| All 5 | Grain | opacity | 0.07 | `opacity={0.07}` (kit.tsx:715) | match |
| All 5 | Grain | pointer-events | none | `pointerEvents="none"` (Grain.tsx:16) | match |
| All 5 | Grain | z-order | first child of sheet | first child of sheet (kit.tsx:715) | match |
| All 5 | Grabber | left / right / top | 0 / 0 / 12px | `left:0, right:0, top:12` (kit.tsx:637) | match |
| All 5 | Grabber | justify-content | center | `alignItems:'center'` on a column (kit.tsx:637) | match |
| All 5 | Grabber bar | width / height | 38px / 5px | 38 / 5 (kit.tsx:638) | match |
| All 5 | Grabber bar | border-radius | 3px | 3 (kit.tsx:638) | match |
| All 5 | Grabber bar | background | `rgba(19,19,19,0.16)` | `rgba(19,19,19,0.16)` (kit.tsx:638) | match |
| All 5 | Close icon | position right / top | 22px / 26px | `right:22, top:26` (kit.tsx:649) | match |
| All 5 | Close icon | svg width / height / viewBox | 20 / 20 / `0 0 20 20` | 20 / 20 / `0 0 20 20` (kit.tsx:650) | match |
| All 5 | Close icon | path `d` | `M3 3l14 14M17 3L3 17` | `M3 3l14 14M17 3L3 17` (kit.tsx:651) | match |
| All 5 | Close icon | stroke | `#55534E` | `#55534E` (kit.tsx:651) | match |
| All 5 | Close icon | stroke-width | 2 | 2 (kit.tsx:651) | match |
| All 5 | Close icon | stroke-linecap | round | round (kit.tsx:651) | match |
| All 5 | Close icon | hit target | 20 × 20 (`cursor:pointer`) | 20 × 20 + `hitSlop` 16 all round, `minHeight:0` (kit.tsx:648–649) | match — hit slop is not drawn |
| All 5 | Close icon | pressed state | none drawn | `scale → 0.96` over 110 ms (press-scale.tsx:25) | match — canvas draws no press state |
| All 5 | Dot rail | left / right / top | 0 / 0 / 66px | `left:0, right:0, top:66` (kit.tsx:659) | match |
| All 5 | Dot rail | display / justify / gap | flex / center / 6px | `flexDirection:'row', justifyContent:'center', gap:6` (kit.tsx:659) | match |
| All 5 | Dot — inactive | width / height | 6.5px / 6.5px | 6.5 / 6.5 (kit.tsx:661) | match |
| All 5 | Dot — inactive | border-radius | 4px | 4 (kit.tsx:661) | match |
| All 5 | Dot — inactive | background | `rgba(19,19,19,0.18)` | `rgba(19,19,19,0.18)` (kit.tsx:661) | match |
| All 5 | Dot — active | width / height | 20px / 6.5px | 20 / 6.5 (kit.tsx:661) | match |
| All 5 | Dot — active | border-radius | 4px | 4 (kit.tsx:661) | match |
| All 5 | Dot — active | background | `#131313` | `#131313` (kit.tsx:661) | match |
| All 5 | Dot rail | count | 3 | `total = p.pages.length` = 3 (rough-protocol.tsx:22) | match |
| All 5 | Headline | left / right / top | 36 / 36 / 104px | `left:36, right:36, top:104` (kit.tsx:719) | match |
| All 5 | Headline | text-align | center | `center` prop (kit.tsx:719) | match |
| All 5 | Headline | font-size | 26px | 26 (kit.tsx:719) | match |
| All 5 | Headline | font-weight | 500 | `sans('500')` → fontWeight `'500'` (kit.tsx:719, theme.ts:196) | match |
| All 5 | Headline | line-height | 33px | 33 (kit.tsx:719) | match |
| All 5 | Headline | letter-spacing | −0.2px | −0.2 (kit.tsx:719) | match |
| All 5 | Headline | color | `#1D1C1A` | `#1D1C1A` (kit.tsx:719) | match |
| All 5 | Sub | left / right / top | 44 / 44 / 152px | `left:44, right:44, top:152` (kit.tsx:722) | match |
| All 5 | Sub | text-align | center | `center` prop (kit.tsx:722) | match |
| All 5 | Sub | font-size | 14.5px | 14.5 (kit.tsx:722) | match |
| All 5 | Sub | font-weight | 400 | `sans('400')` (kit.tsx:722) | match |
| All 5 | Sub | line-height | 21px | 21 (kit.tsx:722) | match |
| All 5 | Sub | letter-spacing | not declared → 0 | variant `-0.1` is dropped because the caller names its own `fontSize` without tracking (AppText.tsx:118–138) → 0 | match |
| All 5 | Sub | color | `#8B8882` | `#8B8882` (kit.tsx:722) | match |
| All 5 | Sub | text-wrap | balance | RN has no `text-wrap`; on web `AppText` emits `textWrap:'pretty'` for variant `body` (AppText.tsx:128) | **MISMATCH\*** — app substitutes greedy wrapping (native) / `pretty` (web) |
| All 5 | Artwork slot | left / top | 76 / 216px | `left:76, top:216` (kit.tsx:725) | match |
| All 5 | Artwork slot | width / height | 240 / 220px | 240 / 220 (kit.tsx:725) | match |
| All 5 | Artwork inner | position / inset / overflow | absolute / 0 / hidden | `width:240, height:220, overflow:'hidden'` (kit.tsx:121) | match |
| All 5 | CTA button | left / right / bottom | 24 / 24 / 88px | `left:24, right:24, bottom:88` (kit.tsx:736) | match |
| All 5 | CTA button | height | 54px | `height:54, minHeight:54` (kit.tsx:736) | match |
| All 5 | CTA button | border-radius | 27px | 27 (kit.tsx:736) | match |
| All 5 | CTA button | background | `#131313` | `#131313` (kit.tsx:736) | match |
| All 5 | CTA button | align-items / justify-content | center / center | `alignItems:'center', justifyContent:'center'` (kit.tsx:736) | match |
| All 5 | CTA button | border / shadow | none | none | match |
| All 5 | CTA button | pressed state | none drawn (`cursor:pointer`) | `scale → 0.96` 110 ms in, 160 ms out (press-scale.tsx) | match — canvas draws no press state |
| All 5 | CTA label | font-size | 16.5px | 16.5 (kit.tsx:737) | match |
| All 5 | CTA label | font-weight | 600 | `sans('600')` (kit.tsx:737) | match |
| All 5 | CTA label | letter-spacing | 0.2px | 0.2 (kit.tsx:737) | match |
| All 5 | CTA label | color | `#FFFFFF` | `#FFFFFF` (kit.tsx:737) | match |
| All 5 | CTA label | line-height | not declared → normal | dropped (caller names size, not leading — AppText.tsx:119/139) | match |
| All 5 | Ghost link | left / right / bottom | 0 / 0 / 44px | `left:0, right:0, bottom:44` (kit.tsx:743) | match |
| All 5 | Ghost link | text-align | center | `alignItems:'center'` (kit.tsx:743) | match |
| All 5 | Ghost link | font-size | 14.5px | 14.5 (kit.tsx:744) | match |
| All 5 | Ghost link | font-weight | 500 | `sans('500')` (kit.tsx:744) | match |
| All 5 | Ghost link | color | `#8B8882` | `#8B8882` (kit.tsx:744) | match |
| All 5 | Ghost link | letter-spacing / line-height | not declared | both dropped (AppText.tsx:119–139) | match |

---

## 2. Rough Late night III — `charging`

App page: `RD_PROTOCOLS.latenight.pages[2]` (roughDays.ts:82), rendered at `index = 2`.

### 2a. Text, dots and buttons

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Late night III | Dot rail | active index | 3rd (dots 1,2 inactive; 3rd `20px` `#131313`) | `index = 2` of 3 (kit.tsx:661) | match |
| Late night III | Headline | text | `End it on purpose.` | `'End it on purpose.'` (roughDays.ts:82) | match |
| Late night III | Sub | text | `Close the day before it closes you.` | `'Close the day before it closes you.'` (roughDays.ts:82) | match |
| Late night III | Act line | left / right / top | 48 / 48 / 452px | `left:48, right:48, top:452` (kit.tsx:729) | match |
| Late night III | Act line | text-align | center | `center` prop (kit.tsx:729) | match |
| Late night III | Act line | font-size | 16px | 16 (kit.tsx:729) | match |
| Late night III | Act line | font-weight | 500 | `sans('500')` (kit.tsx:729) | match |
| Late night III | Act line | line-height | 24px | 24 (kit.tsx:729) | match |
| Late night III | Act line | letter-spacing | not declared → 0 | dropped → 0 (AppText.tsx:120/138) | match |
| Late night III | Act line | color | `#1D1C1A` | `#1D1C1A` (kit.tsx:729) | match |
| Late night III | Act line | text-wrap | balance | no RN equivalent; web `pretty` | **MISMATCH\*** — greedy wrapping substituted |
| Late night III | Act line | text | `Phone on the charger, outside the room. Go to bed bored.` | identical (roughDays.ts:82) | match |
| Late night III | CTA label | text | `Done` | `RD_CTA[2] = 'Done'` (kit.tsx:669) | match |
| Late night III | Ghost link | text | `Back` | `RD_GHOST[2] = 'Back'` (kit.tsx:670) | match |

### 2b. Artwork `charging` (kit.tsx:411–430) — 16 elements, board-local

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Late night III | Glow | left / top | 140 / 34 | `l={140} t={34}` (kit.tsx:413) | match |
| Late night III | Glow | width / height | 96 / 96 | `size={96}` (kit.tsx:413) | match |
| Late night III | Glow | border-radius | 50% | SVG `Ellipse rx=ry=48` (kit.tsx:37) | match |
| Late night III | Glow | background | `radial-gradient(closest-side, rgba(226,186,120,0.3), rgba(226,186,120,0) 74%)` | `RadialGradient cx/cy 50% r 50%`; Stop 0 `#E2BA78` @0.3, Stop 0.74 `#E2BA78` @0 (kit.tsx:32–35) | match — `closest-side` on a square box = r 50% |
| Late night III | Glow | filter | `blur(4px)` | none | **MISMATCH\*** — the gradient falloff stands in for the blur; the app's glow is hard-clipped to the 96 box instead of bleeding ~4px past it |
| Late night III | Moon back disc | left / top / size | 196 / 64 / 20 × 20 | `Moon l=188 t=58 size=20` → back at `l+8, t+6` = 196 / 64 / 20 × 20 (kit.tsx:113, 414) | match |
| Late night III | Moon back disc | border-radius | 50% | `size/2` = 10 on a 20 square (kit.tsx:113) | match |
| Late night III | Moon back disc | background | `#DCDED8` | `#DCDED8` (kit.tsx:113) | match |
| Late night III | Moon front disc | left / top / size | 188 / 58 / 20 × 20 | 188 / 58 / 20 (kit.tsx:114) | match |
| Late night III | Moon front disc | border-radius | 50% | 10 (kit.tsx:114) | match |
| Late night III | Moon front disc | background | `#F4F3F0` | `#F4F3F0` (kit.tsx:114) | match |
| Late night III | Moon | z-order | back then front | back then front (kit.tsx:113–114) | match |
| Late night III | Speck A | left / top / size / radius | 216 / 20 / 2 × 2 / 50% | `Specks` default `a=[216,20]`, 2 × 2, radius 1 (kit.tsx:100–103, 415) | match |
| Late night III | Speck A | background | `rgba(200,225,235,0.4)` | `rgba(200,225,235,0.4)` (kit.tsx:103) | match |
| Late night III | Speck B | left / top / size / radius | 8 / 48 / 2 × 2 / 50% | `b=[8,48]`, 2 × 2, radius 1 (kit.tsx:104) | match |
| Late night III | Speck B | background | `rgba(200,225,235,0.3)` | `rgba(200,225,235,0.3)` (kit.tsx:104) | match |
| Late night III | Cable pole | left / top / w / h | 36 / 36 / 8 / 150 | 36 / 36 / 8 / 150 (kit.tsx:416) | match |
| Late night III | Cable pole | border-radius | 4px | 4 (kit.tsx:416) | match |
| Late night III | Cable pole | background | `#D6D5D0` | `#D6D5D0` (kit.tsx:416) | match |
| Late night III | Floor line | left / top / w / h | 60 / 150 / 150 / 4 | 60 / 150 / 150 / 4 (kit.tsx:417) | match |
| Late night III | Floor line | border-radius | 2px | 2 (kit.tsx:417) | match |
| Late night III | Floor line | background | `#D6D5D0` | `#D6D5D0` (kit.tsx:417) | match |
| Late night III | Socket plate | left / top / w / h | 150 / 64 / 30 / 44 | 150 / 64 / 30 / 44 (kit.tsx:418) | match |
| Late night III | Socket plate | border-radius | 6px | 6 (kit.tsx:418) | match |
| Late night III | Socket plate | background | `#E4E3DE` | `#E4E3DE` (kit.tsx:418) | match |
| Late night III | Socket slot L | left / top / w / h / radius / bg | 158 / 74 / 5 / 12 / 2px / `#B4B1AB` | identical (kit.tsx:419) | match |
| Late night III | Socket slot R | left / top / w / h / radius / bg | 168 / 74 / 5 / 12 / 2px / `#B4B1AB` | identical (kit.tsx:420) | match |
| Late night III | Socket earth | left / top / w / h / radius / bg | 160 / 96 / 12 / 9 / 2px / `#C6C5C0` | identical (kit.tsx:421) | match |
| Late night III | Cable svg | left / top | 112 / 104 | 112 / 104 (kit.tsx:422) | match |
| Late night III | Cable svg | width / height / viewBox | 56 / 48 / `0 0 56 48` | 56 / 48 / `0 0 56 48` (kit.tsx:422) | match |
| Late night III | Cable path | `d` | `M52 2 C52 26 30 22 16 30 C8 34 6 40 6 46` | identical (kit.tsx:423) | match |
| Late night III | Cable path | stroke / stroke-width / fill / linecap | `#B4B1AB` / 2.5 / none / round | identical (kit.tsx:423) | match |
| Late night III | Phone body | left / top / w / h / radius / bg | 86 / 132 / 56 / 20 / 5px / `#C6C5C0` | identical (kit.tsx:425) | match |
| Late night III | Phone screen | left / top / w / h / radius / bg | 104 / 138 / 20 / 8 / 2px / `#E4E3DE` | identical (kit.tsx:426) | match |
| Late night III | Charge LED | left / top / w / h / radius / bg | 132 / 139 / 4 / 6 / 1px / `#E2BA78` | identical (kit.tsx:427) | match |
| Late night III | Ground shadow | left / top / w / h | 80 / 160 / 80 / 13 | `Shade l=80 t=160 w=80 h=13` (kit.tsx:428) | match |
| Late night III | Ground shadow | border-radius | 50% (on a non-square box → ellipse) | SVG `Ellipse rx=40 ry=6.5` (kit.tsx:54) | match |
| Late night III | Ground shadow | background | solid `rgba(0,0,0,0.10)` | radial gradient: `#000` @0.10 to offset 0.45, then to `#000` @0 at offset 1 (kit.tsx:49–51) | **MISMATCH\*** — the solid fill is replaced by a falloff that reproduces the blurred edge |
| Late night III | Ground shadow | filter | `blur(5px)` | none | **MISMATCH\*** — falloff substituted; the app's shadow is clipped to the 80 × 13 box rather than bleeding ~5px past it |
| Late night III | Artwork | z-order | glow → moon back → moon front → specks → pole → floor → socket → cable → phone → LED → shadow | same order (kit.tsx:413–428) | match |
| Late night III | Artwork | element count | 16 | 16 | match |

---

## 3. Rough Home alone I — `house`

App page: `RD_PROTOCOLS.homealone.pages[0]` (roughDays.ts:88), rendered at `index = 0`.

### 3a. Text, dots and buttons

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Home alone I | Dot rail | active index | 1st (`20px` `#131313` first) | `index = 0` of 3 | match |
| Home alone I | Headline | text | `Empty house.` | `'Empty house.'` (roughDays.ts:88) | match |
| Home alone I | Sub | text | `Privacy is opportunity &mdash; the brain clocks it before you do.` | `'Privacy is opportunity — the brain clocks it before you do.'` (roughDays.ts:88) | match — `&mdash;` = U+2014 |
| Home alone I | Act line | presence | absent | `act` undefined → block not rendered (kit.tsx:728) | match |
| Home alone I | CTA label | text | `Walk through it` | `RD_CTA[0] = 'Walk through it'` (kit.tsx:669) | match |
| Home alone I | Ghost link | text | `Not tonight` | `RD_GHOST[0] = 'Not tonight'` (kit.tsx:670) | match |

### 3b. Artwork `house` (kit.tsx:432–456) — 11 top-level elements, board-local

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Home alone I | Glow | left / top / size | 64 / 36 / 120 × 120 | `l={64} t={36} size={120}` (kit.tsx:434) | match |
| Home alone I | Glow | background | `radial-gradient(closest-side, rgba(226,186,120,0.38), rgba(226,186,120,0) 74%)` | Stop 0 `#E2BA78` @0.38, Stop 0.74 @0, r 50% (kit.tsx:32–35, 434) | match |
| Home alone I | Glow | border-radius | 50% | `Ellipse rx=ry=60` | match |
| Home alone I | Glow | filter | `blur(4px)` | none | **MISMATCH\*** — falloff substituted, glow clipped to the 120 box |
| Home alone I | Moon back disc | left / top / size / radius / bg | 202 / 16 / 24 × 24 / 50% / `#DCDED8` | `Moon l=194 t=10 size=24` → 202 / 16 / 24 / 12 / `#DCDED8` (kit.tsx:113, 435) | match |
| Home alone I | Moon front disc | left / top / size / radius / bg | 194 / 10 / 24 × 24 / 50% / `#F4F3F0` | 194 / 10 / 24 / 12 / `#F4F3F0` (kit.tsx:114) | match |
| Home alone I | Speck A | left / top / size / bg | 216 / 20 / 2 × 2 / `rgba(200,225,235,0.4)` | default `Specks` (kit.tsx:436) | match |
| Home alone I | Speck B | left / top / size / bg | 8 / 48 / 2 × 2 / `rgba(200,225,235,0.3)` | default `Specks` (kit.tsx:436) | match |
| Home alone I | House svg | left / top | 40 / 44 | 40 / 44 (kit.tsx:437) | match |
| Home alone I | House svg | width / height / viewBox | 160 / 136 / `0 0 160 136` | 160 / 136 / `0 0 160 136` (kit.tsx:437) | match |
| Home alone I | Path — ground | `d` / stroke / width / linecap | `M14 124 L146 124` / `rgba(19,19,19,0.18)` / 3 / round | identical (kit.tsx:438) | match |
| Home alone I | Path — roof | `d` | `M24 58 L80 20 L136 58` | identical (kit.tsx:439) | match |
| Home alone I | Path — roof | fill / stroke / width / linecap / linejoin | none / `#C6C5C0` / 9 / round / round | identical (kit.tsx:439) | match |
| Home alone I | Rect — wall | x / y / w / h / rx / fill | 32 / 58 / 96 / 66 / 5 / `#E4E3DE` | identical (kit.tsx:440) | match |
| Home alone I | Rect — chimney | x / y / w / h / rx / fill | 96 / 26 / 12 / 20 / 2 / `#C6C5C0` | identical (kit.tsx:441) | match |
| Home alone I | Rect — door | x / y / w / h / rx / fill | 90 / 86 / 22 / 38 / 3 / `#D6D5D0` | identical (kit.tsx:442) | match |
| Home alone I | Circle — knob | cx / cy / r / fill | 108 / 106 / 2.5 / `#B4B1AB` | identical (kit.tsx:443) | match |
| Home alone I | Rect — lit window | x / y / w / h / rx / fill / opacity | 46 / 72 / 26 / 22 / 2.5 / `#E2BA78` / 0.85 | identical (kit.tsx:444) | match |
| Home alone I | Rect — mullion v | x / y / w / h / fill | 58 / 72 / 2 / 22 / `#E4E3DE` | identical (kit.tsx:445) | match |
| Home alone I | Rect — mullion h | x / y / w / h / fill | 46 / 82 / 26 / 2 / `#E4E3DE` | identical (kit.tsx:446) | match |
| Home alone I | Ellipse — bush L | cx / cy / rx / ry / fill | 26 / 120 / 12 / 8 / `#C6C5C0` | identical (kit.tsx:447) | match |
| Home alone I | Ellipse — bush R | cx / cy / rx / ry / fill | 144 / 122 / 9 / 6 / `#D6D5D0` | identical (kit.tsx:448) | match |
| Home alone I | Window glow | left / top / size | 76 / 102 / 56 × 56 | `l={76} t={102} size={56}` (kit.tsx:450) | match |
| Home alone I | Window glow | background | `radial-gradient(closest-side, rgba(226,186,120,0.32), rgba(226,186,120,0) 74%)` | Stop 0 @0.32, Stop 0.74 @0 (kit.tsx:450) | match |
| Home alone I | Window glow | filter | `blur(4px)` | none | **MISMATCH\*** — falloff substituted, clipped to the 56 box |
| Home alone I | Path stone 1 | left / top / w / h | 64 / 182 / 18 / 6 | `Oval l=64 t=182 w=18 h=6` (kit.tsx:451) | match |
| Home alone I | Path stone 1 | border-radius | 50% on 18 × 6 → ellipse | SVG `Ellipse rx=9 ry=3` (kit.tsx:64) | match |
| Home alone I | Path stone 1 | background | `#D6D5D0` | `#D6D5D0` (kit.tsx:451) | match |
| Home alone I | Path stone 2 | left / top / w / h / bg | 94 / 188 / 16 / 6 / `#E4E3DE` | identical (kit.tsx:452) | match |
| Home alone I | Path stone 3 | left / top / w / h / bg | 122 / 184 / 18 / 6 / `#D6D5D0` | identical (kit.tsx:453) | match |
| Home alone I | Ground shadow | left / top / w / h | 48 / 178 / 150 / 13 | `Shade l=48 t=178 w=150 h=13` (kit.tsx:454) | match |
| Home alone I | Ground shadow | background | solid `rgba(0,0,0,0.10)` | radial falloff `#000` @0.10 → 0 (kit.tsx:49–51) | **MISMATCH\*** — falloff stands in for the blurred edge |
| Home alone I | Ground shadow | filter | `blur(5px)` | none | **MISMATCH\*** — clipped to the 150 × 13 box |
| Home alone I | Artwork | z-order | glow → moon → specks → house svg → window glow → 3 stones → shadow | same (kit.tsx:434–454) | match |
| Home alone I | Artwork | element count | 11 top-level (11 svg children) | 11 / 11 | match |

---

## 4. Rough Home alone II — `frontdoor`

App page: `RD_PROTOCOLS.homealone.pages[1]` (roughDays.ts:89), rendered at `index = 1`.

### 4a. Text, dots and buttons

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Home alone II | Dot rail | active index | 2nd (`20px` `#131313` in the middle) | `index = 1` of 3 | match |
| Home alone II | Headline | text | `The door is a switch.` | `'The door is a switch.'` (roughDays.ts:89) | match |
| Home alone II | Sub | text | `Alone drops the cost of a slip to zero. Knowing that is half the defense.` | identical (roughDays.ts:89) | match |
| Home alone II | Act line | presence | absent | `act` undefined → not rendered | match |
| Home alone II | CTA label | text | `Next` | `RD_CTA[1] = 'Next'` (kit.tsx:669) | match |
| Home alone II | Ghost link | text | `Back` | `RD_GHOST[1] = 'Back'` (kit.tsx:670) | match |

### 4b. Artwork `frontdoor` (kit.tsx:458–477) — 12 elements, board-local

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Home alone II | Glow | left / top / size | 110 / 44 / 104 × 104 | `l={110} t={44} size={104}` (kit.tsx:460) | match |
| Home alone II | Glow | background | `radial-gradient(closest-side, rgba(226,186,120,0.3), rgba(226,186,120,0) 74%)` | Stop 0 @0.3, Stop 0.74 @0 (kit.tsx:460) | match |
| Home alone II | Glow | filter | `blur(4px)` | none | **MISMATCH\*** — falloff substituted, clipped to the 104 box |
| Home alone II | Moon | presence | absent | absent (kit.tsx:458–477) | match |
| Home alone II | Speck A | left / top / size / bg | 216 / 20 / 2 × 2 / `rgba(200,225,235,0.4)` | default `Specks` (kit.tsx:461) | match |
| Home alone II | Speck B | left / top / size / bg | 8 / 48 / 2 × 2 / `rgba(200,225,235,0.3)` | default `Specks` (kit.tsx:461) | match |
| Home alone II | Door slab | left / top / w / h | 56 / 48 / 78 / 130 | 56 / 48 / 78 / 130 (kit.tsx:462) | match |
| Home alone II | Door slab | border-radius / bg | 7px / `#D6D5D0` | 7 / `#D6D5D0` (kit.tsx:462) | match |
| Home alone II | Door panel top | left / top / w / h / radius / bg | 64 / 58 / 62 / 52 / 4px / `#E4E3DE` | identical (kit.tsx:463) | match |
| Home alone II | Door panel bottom | left / top / w / h / radius / bg | 64 / 118 / 62 / 52 / 4px / `#E4E3DE` | identical (kit.tsx:464) | match |
| Home alone II | Door knob | left / top / w / h | 120 / 106 / 8 / 8 | 120 / 106 / 8 / 8 (kit.tsx:465) | match |
| Home alone II | Door knob | border-radius | 50% (square box) | 4 on an 8 square (kit.tsx:465) | match |
| Home alone II | Door knob | background | `#8B8880` | `#8B8880` (kit.tsx:465) | match |
| Home alone II | Hook rail | left / top / w / h / radius / bg | 152 / 70 / 56 / 6 / 3px / `#C6C5C0` | identical (kit.tsx:466) | match |
| Home alone II | Hook svg | left / top / w / h / viewBox | 158 / 78 / 14 / 18 / `0 0 14 18` | identical (kit.tsx:467) | match |
| Home alone II | Hook path | `d` | `M7 0 L7 8 C7 14 12 14 12 10` | identical (kit.tsx:468) | match |
| Home alone II | Hook path | stroke / width / fill / linecap | `#B4B1AB` / 2.5 / none / round | identical (kit.tsx:468) | match |
| Home alone II | Coat svg | left / top / w / h / viewBox | 184 / 78 / 20 / 34 / `0 0 20 34` | identical (kit.tsx:470) | match |
| Home alone II | Coat circle | cx / cy / r / fill / stroke / width | 10 / 7 / 5.5 / none / `#B4B1AB` / 2.5 | identical (kit.tsx:471) | match |
| Home alone II | Coat path | `d` | `M10 12 L10 30 M10 24 L16 24 M10 18 L15 18` | identical (kit.tsx:472) | match |
| Home alone II | Coat path | stroke / width / linecap | `#B4B1AB` / 2.5 / round | identical (kit.tsx:472) | match |
| Home alone II | Floor line | left / top / w / h / radius / bg | 30 / 170 / 186 / 4 / 2px / `#D6D5D0` | identical (kit.tsx:474) | match |
| Home alone II | Ground shadow | left / top / w / h | 60 / 178 / 80 / 13 | `Shade l=60 t=178 w=80 h=13` (kit.tsx:475) | match |
| Home alone II | Ground shadow | background | solid `rgba(0,0,0,0.10)` | radial falloff `#000` @0.10 → 0 | **MISMATCH\*** — falloff stands in for the blurred edge |
| Home alone II | Ground shadow | filter | `blur(5px)` | none | **MISMATCH\*** — clipped to the 80 × 13 box |
| Home alone II | Artwork | z-order | glow → specks → slab → panels → knob → rail → hook → coat → floor → shadow | same (kit.tsx:460–475) | match |
| Home alone II | Artwork | element count | 12 | 12 | match |

---

## 5. Rough Home alone III — `curtains`

App page: `RD_PROTOCOLS.homealone.pages[2]` (roughDays.ts:90), rendered at `index = 2`.

### 5a. Text, dots and buttons

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Home alone III | Dot rail | active index | 3rd | `index = 2` of 3 | match |
| Home alone III | Headline | text | `Change the room.` | `'Change the room.'` (roughDays.ts:90) | match |
| Home alone III | Sub | text | `Light and sightlines change the odds.` | identical (roughDays.ts:90) | match |
| Home alone III | Act line | left / right / top | 48 / 48 / 452px | `left:48, right:48, top:452` (kit.tsx:729) | match |
| Home alone III | Act line | font-size / weight / line-height / colour | 16px / 500 / 24px / `#1D1C1A` | 16 / `sans('500')` / 24 / `#1D1C1A` (kit.tsx:729) | match |
| Home alone III | Act line | text-align | center | `center` prop | match |
| Home alone III | Act line | letter-spacing | not declared → 0 | dropped → 0 | match |
| Home alone III | Act line | text-wrap | balance | no RN equivalent; web `pretty` | **MISMATCH\*** — greedy wrapping substituted |
| Home alone III | Act line | text | `Open the curtains and work where you can be seen &mdash; or leave for twenty minutes.` | `'Open the curtains and work where you can be seen — or leave for twenty minutes.'` (roughDays.ts:90) | match |
| Home alone III | CTA label | text | `Done` | `RD_CTA[2] = 'Done'` | match |
| Home alone III | Ghost link | text | `Back` | `RD_GHOST[2] = 'Back'` | match |

### 5b. Artwork `curtains` (kit.tsx:479–500) — 15 elements, board-local

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Home alone III | Glow | left / top / size | 96 / 40 / 116 × 116 | `l={96} t={40} size={116}` (kit.tsx:481) | match |
| Home alone III | Glow | background | `radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 74%)` | Stop 0 @0.4, Stop 0.74 @0 (kit.tsx:481) | match |
| Home alone III | Glow | filter | `blur(4px)` | none | **MISMATCH\*** — falloff substituted, clipped to the 116 box |
| Home alone III | Speck A | left / top / size / bg | 216 / 20 / 2 × 2 / `rgba(200,225,235,0.4)` | default `Specks` (kit.tsx:482) | match |
| Home alone III | Speck B | left / top / size / bg | 8 / 48 / 2 × 2 / `rgba(200,225,235,0.3)` | default `Specks` (kit.tsx:482) | match |
| Home alone III | Window frame | left / top / w / h / radius / bg | 64 / 44 / 116 / 112 / 8px / `#E4E3DE` | identical (kit.tsx:483) | match |
| Home alone III | Window pane | left / top / w / h | 72 / 52 / 100 / 96 | `VGrad l=72 t=52 w=100 h=96` (kit.tsx:484) | match |
| Home alone III | Window pane | border-radius | 4px | `rx=ry=4` (kit.tsx:80) | match |
| Home alone III | Window pane | background | `linear-gradient(180deg, #FCFBF7, #F0EDE2)` | `LinearGradient x1 0 y1 0 x2 0 y2 1`; Stop 0 `#FCFBF7`, Stop 1 `#F0EDE2` (kit.tsx:75–78, 484) | match — 180deg = top→bottom, both stops at their implicit 0 / 100% |
| Home alone III | Pane mullion | left / top / w / h / bg | 121 / 52 / 2 / 96 / `#D6D5D0` | identical, no radius (kit.tsx:485) | match |
| Home alone III | Curtain L | left / top / w / h / radius / bg | 52 / 40 / 20 / 120 / 8px / `#C6C5C0` | identical (kit.tsx:486) | match |
| Home alone III | Curtain R | left / top / w / h / radius / bg | 172 / 40 / 20 / 120 / 8px / `#C6C5C0` | identical (kit.tsx:487) | match |
| Home alone III | Tieback L | left / top / w / h / radius / bg | 50 / 96 / 24 / 8 / 4px / `#E2BA78` | identical (kit.tsx:488) | match |
| Home alone III | Tieback R | left / top / w / h / radius / bg | 170 / 96 / 24 / 8 / 4px / `#E2BA78` | identical (kit.tsx:489) | match |
| Home alone III | Sill | left / top / w / h / radius / bg | 58 / 156 / 128 / 7 / 3px / `#D6D5D0` | identical (kit.tsx:490) | match |
| Home alone III | Plant svg | left / top / w / h / viewBox | 196 / 120 / 26 / 40 / `0 0 26 40` | identical (kit.tsx:491) | match |
| Home alone III | Plant path | `d` | `M13 38 L13 20 M13 24 C6 22 4 14 6 8 C12 10 14 16 13 24 M13 28 C20 26 22 18 20 12 C14 14 12 20 13 28` | identical (kit.tsx:492) | match |
| Home alone III | Plant path | stroke / width / fill / linecap | `#B4B1AB` / 2.2 / none / round | identical (kit.tsx:492) | match |
| Home alone III | Plant pot | left / top / w / h | 190 / 156 / 20 / 14 | identical (kit.tsx:494) | match |
| Home alone III | Plant pot | border-radius (per corner) | `2px 2px 5px 5px` → TL 2, TR 2, BR 5, BL 5 | TL 2, TR 2, BR 5, BL 5 (kit.tsx:494) | match |
| Home alone III | Plant pot | background | `#B4B1AB` | `#B4B1AB` (kit.tsx:494) | match |
| Home alone III | Light pool svg | left / top / w / h / viewBox | 80 / 162 / 90 / 30 / `0 0 90 30` | identical (kit.tsx:495) | match |
| Home alone III | Light pool path | `d` / fill | `M2 2 L88 2 L74 28 L16 28 Z` / `rgba(226,186,120,0.22)` | identical (kit.tsx:496) | match |
| Home alone III | Ground shadow | left / top / w / h | 58 / 164 / 132 / 13 | `Shade l=58 t=164 w=132 h=13` (kit.tsx:498) | match |
| Home alone III | Ground shadow | background | solid `rgba(0,0,0,0.10)` | radial falloff `#000` @0.10 → 0 | **MISMATCH\*** — falloff stands in for the blurred edge |
| Home alone III | Ground shadow | filter | `blur(5px)` | none | **MISMATCH\*** — clipped to the 132 × 13 box |
| Home alone III | Artwork | z-order | glow → specks → frame → pane → mullion → curtains → tiebacks → sill → plant → pot → light pool → shadow | same (kit.tsx:481–498) | match |
| Home alone III | Artwork | element count | 15 | 15 | match |

---

## 6. Rough An argument I — `clash`

App page: `RD_PROTOCOLS.argument.pages[0]` (roughDays.ts:96), rendered at `index = 0`.

### 6a. Text, dots and buttons

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| An argument I | Dot rail | active index | 1st | `index = 0` of 3 | match |
| An argument I | Headline | text | `Still burning.` | `'Still burning.'` (roughDays.ts:96) | match |
| An argument I | Sub | text | `Anger wants a win &mdash; and a slip feels like one, briefly.` | `'Anger wants a win — and a slip feels like one, briefly.'` (roughDays.ts:96) | match |
| An argument I | Act line | presence | absent | `act` undefined → not rendered | match |
| An argument I | CTA label | text | `Walk through it` | `RD_CTA[0]` (kit.tsx:669) | match |
| An argument I | Ghost link | text | `Not tonight` | `RD_GHOST[0]` (kit.tsx:670) | match |

### 6b. Artwork `clash` (kit.tsx:502–529) — 15 elements, board-local

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| An argument I | Glow | left / top / size | 64 / 46 / 116 × 116 | `l={64} t={46} size={116}` (kit.tsx:504) | match |
| An argument I | Glow | background | `radial-gradient(closest-side, rgba(226,186,120,0.38), rgba(226,186,120,0) 74%)` | Stop 0 @0.38, Stop 0.74 @0 (kit.tsx:504) | match |
| An argument I | Glow | filter | `blur(4px)` | none | **MISMATCH\*** — falloff substituted, clipped to the 116 box |
| An argument I | Speck A | left / top / size / bg | 216 / 20 / 2 × 2 / `rgba(200,225,235,0.4)` | default `Specks` (kit.tsx:505) | match |
| An argument I | Speck B | left / top / size / bg | 8 / 48 / 2 × 2 / `rgba(200,225,235,0.3)` | default `Specks` (kit.tsx:505) | match |
| An argument I | Bubble 1 | left / top / w / h | 14 / 40 / 108 / 56 | identical (kit.tsx:506) | match |
| An argument I | Bubble 1 | border-radius | 14px | 14 (kit.tsx:506) | match |
| An argument I | Bubble 1 | background | `#E0DFDA` | `#E0DFDA` (kit.tsx:506) | match |
| An argument I | Bubble 1 | transform | `rotate(-4deg)` (origin 50% 50%) | `[{ rotate: '-4deg' }]`, RN default origin = centre (kit.tsx:506) | match |
| An argument I | Bubble 1 tail svg | left / top / w / h / viewBox | 38 / 92 / 24 / 20 / `0 0 24 20` | identical (kit.tsx:507) | match |
| An argument I | Bubble 1 tail path | `d` / fill | `M4 0 L4 16 L20 0 Z` / `#E0DFDA` | identical (kit.tsx:509) | match |
| An argument I | Bubble 1 tail path | transform | `rotate(-4 12 8)` on the path | `<G transform="rotate(-4 12 8)">` wrapping the path (kit.tsx:508–510) | match — same rotation about the same centre |
| An argument I | Bubble 1 line 1 | left / top / w / h / radius / bg / transform | 30 / 56 / 64 / 5 / 3px / `#C6C5C0` / `rotate(-4deg)` | identical (kit.tsx:512) | match |
| An argument I | Bubble 1 line 2 | left / top / w / h / radius / bg / transform | 30 / 70 / 44 / 5 / 3px / `#C6C5C0` / `rotate(-4deg)` | identical (kit.tsx:513) | match |
| An argument I | Bubble 2 | left / top / w / h | 120 / 92 / 108 / 56 | identical (kit.tsx:514) | match |
| An argument I | Bubble 2 | border-radius | 14px | 14 (kit.tsx:514) | match |
| An argument I | Bubble 2 | background | `#F7F6F2` | `#F7F6F2` (kit.tsx:514) | match |
| An argument I | Bubble 2 | ring | `box-shadow: inset 0 0 0 2px #D6D5D0` | `borderWidth: 2, borderColor: '#D6D5D0'` (kit.tsx:514) | match — a 2px inset spread shadow and a 2px RN border paint the same band inside the same 14px-radius box |
| An argument I | Bubble 2 | transform | `rotate(3deg)` | `[{ rotate: '3deg' }]` (kit.tsx:514) | match |
| An argument I | Bubble 2 tail svg | left / top / w / h / viewBox | 176 / 144 / 24 / 20 / `0 0 24 20` | identical (kit.tsx:515) | match |
| An argument I | Bubble 2 tail path | `d` | `M20 0 L20 16 L4 0 Z` | identical (kit.tsx:517) | match |
| An argument I | Bubble 2 tail path | fill / stroke / stroke-width | `#F7F6F2` / `#D6D5D0` / 2 | identical (kit.tsx:517) | match |
| An argument I | Bubble 2 tail path | transform | `rotate(3 12 8)` | `<G transform="rotate(3 12 8)">` (kit.tsx:516–518) | match |
| An argument I | Bubble 2 line 1 | left / top / w / h / radius / bg / transform | 136 / 108 / 64 / 5 / 3px / `#D6D5D0` / `rotate(3deg)` | identical (kit.tsx:520) | match |
| An argument I | Bubble 2 line 2 | left / top / w / h / radius / bg / transform | 136 / 122 / 40 / 5 / 3px / `#D6D5D0` / `rotate(3deg)` | identical (kit.tsx:521) | match |
| An argument I | Cross svg | left / top / w / h / viewBox | 100 / 74 / 30 / 30 / `0 0 30 30` | identical (kit.tsx:522) | match |
| An argument I | Cross path | `d` | `M6 24 L24 6 M6 6 L24 24` | identical (kit.tsx:523) | match |
| An argument I | Cross path | stroke / stroke-width / linecap / opacity | `#E2BA78` / 3.5 / round / 0.85 | identical (kit.tsx:523) | match |
| An argument I | Floor line | left / top / w / h / radius / bg | 36 / 170 / 170 / 4 / 2px / `#D6D5D0` | identical (kit.tsx:525) | match |
| An argument I | Ground shadow L | left / top / w / h | 24 / 178 / 90 / 13 | `Shade l=24 t=178 w=90 h=13` (kit.tsx:526) | match |
| An argument I | Ground shadow L | background | solid `rgba(0,0,0,0.10)` | radial falloff `#000` @0.10 → 0 | **MISMATCH\*** — falloff stands in for the blurred edge |
| An argument I | Ground shadow L | filter | `blur(5px)` | none | **MISMATCH\*** — clipped to the 90 × 13 box |
| An argument I | Ground shadow R | left / top / w / h | 130 / 178 / 90 / 13 | `Shade l=130 t=178 w=90 h=13` (kit.tsx:527) | match |
| An argument I | Ground shadow R | background | solid `rgba(0,0,0,0.10)` | radial falloff `#000` @0.10 → 0 | **MISMATCH\*** — falloff stands in for the blurred edge |
| An argument I | Ground shadow R | filter | `blur(5px)` | none | **MISMATCH\*** — clipped to the 90 × 13 box |
| An argument I | Artwork | z-order | glow → specks → bubble 1 + tail + lines → bubble 2 + tail + lines → cross → floor → shadow L → shadow R | same (kit.tsx:504–527) | match |
| An argument I | Artwork | element count | 15 | 15 | match |

---

## Findings

**Zero MISMATCH.** Nothing in these five frames is a difference the app can close.

Every literal the frames declare — every offset, size, radius (including the per-corner
`2px 2px 5px 5px` pot), hex, rgba alpha, gradient stop and stop position, rotation, stroke width,
`viewBox`, verbatim path `d`, font size, numeric weight, line-height, letter-spacing and every
string — is reproduced exactly in `/Users/admin/Documents/tideline/src/components/roughDays/kit.tsx`.
Element counts and paint order match per drawing: `charging` 16/16, `house` 11/11 (plus 11/11 svg
children), `frontdoor` 12/12, `curtains` 15/15, `clash` 15/15.

**21 MISMATCH\* rows** — CSS RN cannot express. All four kinds are structural to
react-native-svg / React Native, not to this file, and each is already documented in the kit's own
comments (kit.tsx:21–23, 42–43):

1. **`filter: blur(4px)` on every warm glow** — 6 rows.
   `kit.tsx:413` (Late night III), `434` and `450` (Home alone I — subject glow and window glow),
   `460` (Home alone II), `481` (Home alone III), `504` (An argument I).
   *App substitutes*: `Glow` (kit.tsx:28–40) draws the same `radial-gradient` stops as an SVG
   `RadialGradient` and lets the falloff stand in for the blur. Consequence: the glow is clipped
   to its own box instead of bleeding ~4px past it.

2. **`filter: blur(5px)` on every ground shadow** — 6 rows.
   `kit.tsx:428` (Late night III), `454` (Home alone I), `475` (Home alone II), `498` (Home
   alone III), `526` and `527` (An argument I — two shadows, one under each bubble).
   *App substitutes*: `Shade` (kit.tsx:44–57) draws a radial falloff clipped to the stated box.

3. **`background: rgba(0,0,0,0.10)` (solid) on every ground shadow** — 6 rows, the same six call
   sites. The design fills the ellipse flat and blurs it; the app cannot blur, so the flat fill is
   replaced by a gradient (`#000` @0.10 held to offset 0.45, then falling to 0 at offset 1) that
   reproduces the blurred edge. The literal differs by construction, not by oversight.

4. **`text-wrap: balance`** — 3 rows covering 7 frame-instances: the sub line on all five frames
   (one shared row, `kit.tsx:722`) and the act line on Late night III and Home alone III
   (`kit.tsx:729`).
   *App substitutes*: nothing on native (RN has no `text-wrap`); on web `AppText` emits
   `textWrap:'pretty'` for the `body` variant (AppText.tsx:128). Consequence: line breaks in the
   two- and three-line copy may fall differently from the frame.

### Row count behind the "no MISMATCH" claim

| Section | Rows |
| --- | --- |
| 1. Frame shell and page chrome (× all 5) | 87 |
| 2. Late night III — text / artwork | 14 + 41 |
| 3. Home alone I — text / artwork | 6 + 35 |
| 4. Home alone II — text / artwork | 6 + 27 |
| 5. Home alone III — text / artwork | 11 + 28 |
| 6. An argument I — text / artwork | 6 + 37 |
| **Total** | **298** |

Of those 298 comparison rows: **266 match, 21 MISMATCH\*, 11 n/a** (the canvas's own board
shadow, its `flex-shrink`, and the 54px status bar the app never builds). **0 MISMATCH.**
