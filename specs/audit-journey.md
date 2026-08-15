# Property audit — the journey chapters, the campaign, and the two lesson-overview frames

Frames read in full (pretty, one declaration per line):

| # | Frame file | Screen label | App code |
|---|---|---|---|
| 1 | `.uifinal/pretty/final/Email Login/Journey-Chapter-I.html` | Journey Chapter I — The Landing | `src/app/journey/[chapter].tsx` → `JourneyChapter` |
| 2 | `.uifinal/pretty/final/Email Login/Journey-Campaign.html` | Journey Campaign — **chapter II, The Crossing** | same |
| 3 | `.uifinal/pretty/final/Email Login/Journey-Chapter-III.html` | Journey Chapter III — The Highlands | same |
| 4 | `.uifinal/pretty/final/Email Login/Journey-Chapter-IV.html` | Journey Chapter IV — The Watch | same |
| 5 | `.uifinal/pretty/final/exports-Journey Campaign/Journey-Campaign.html` | The campaign — five grounds | `CampaignGrounds` + `WorldCardArt.tsx` |
| 6 | `.uifinal/pretty/final/exports-Lesson Detail/Story-Detail.html` | Story Detail | `src/app/lesson-overview/[slug].tsx` → `DetailBody` |
| 7 | `.uifinal/pretty/final/exports-Lesson Parts/Story-Tracks.html` | Story Tracks | same → `TracksBody` |

Every frame is 393 × 852 and its `top` values include a 54px status bar the app never
builds, so **app top = canvas top − 54**; both are given. Design values are transcribed
literals; CSS `border-radius` values are given as authored *and* as the browser draws them
after the standard clamp (`f = min(1, side ÷ Σradii)` over all four sides), because that
clamped number is what the app must reproduce.

`MISMATCH*` = RN cannot express the CSS (`filter: blur`), and the substitution is named.

---

## 1 · Chrome shared by all four chapter frames

App: `src/components/journey/JourneyScreens.tsx` (`JourneyChapter` 307, `ChapterBody` 256, `BackRow` 162)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Ch I–IV | Frame | width × height | 393 × 852 | `flex: 1` on the window | match |
| Ch I–IV | Frame | background | `#F4F3F0` | `#F4F3F0` (JourneyScreens:317) | match |
| Ch I–IV | Frame | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sans()` → `System` (iOS), `-apple-system, BlinkMacSystemFont, …` (web) | match |
| Ch I–IV | Frame | overflow | `hidden` | `overflow: 'hidden'` on the body block (259) | match |
| Ch I–IV | Grain | background-image | `noise-dark.png` | `require('assets/images/noise-dark.png')` (31) | match |
| Ch I–IV | Grain | opacity | `0.07` | `0.07` (318) | match |
| Ch I–IV | Grain | inset | `0` all sides | `top/left/right/bottom: 0` (Grain.tsx:16) | match |
| Ch I–IV | Grain | pointer-events | `none` | `pointerEvents="none"` | match |
| Ch I–IV | Status bar | whole row | 54px, 9:41 + three glyphs | not built (app convention) | n/a |
| Ch I–IV | Back row | left | `16` | `16` (169) | match |
| Ch I–IV | Back row | top | `64` (app 10) | `10` (169) | match |
| Ch I–IV | Back row | display / align | `flex` / `center` | `flexDirection: 'row'`, `alignItems: 'center'` | match |
| Ch I–IV | Back row | gap | `9` | `9` (169) | match |
| Ch I–IV | Back chevron | svg width × height | `11 × 19` | `11 × 19` (170) | match |
| Ch I–IV | Back chevron | viewBox | `0 0 11 19` | `0 0 11 19` | match |
| Ch I–IV | Back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | `M9.5 1.5L2 9.5l7.5 8` | match |
| Ch I–IV | Back chevron | fill / stroke | `none` / `#55534E` | `none` / `#55534E` | match |
| Ch I–IV | Back chevron | stroke-width | `2.4` | `2.4` | match |
| Ch I–IV | Back chevron | linecap / linejoin | `round` / `round` | `round` / `round` | match |
| Ch I–IV | Back label | text | `Back` | `Back` (173) | match |
| Ch I–IV | Back label | font-size | `17` | `17` | match |
| Ch I–IV | Back label | weight | `400` | `sans('400')` | match |
| Ch I–IV | Back label | colour | `#55534E` | `#55534E` | match |
| Ch I–IV | Title | left | `24` | `24` (260) | match |
| Ch I–IV | Title | top | `114` (app 60) | `60` | match |
| Ch I–IV | Title | font-size | `27` | `27` | match |
| Ch I–IV | Title | weight | `600` | `sans('600')` | match |
| Ch I–IV | Title | letter-spacing | `-0.2` | `-0.2` | match |
| Ch I–IV | Title | colour | `#1D1C1A` | `#1D1C1A` | match |
| Ch I–IV | Title | line-height | not stated (normal) | not set — `AppText` drops variant leading when a size is named (AppText:119) | match |
| Ch I–IV | Line | left / right | `24` / `60` | `24` / `60` (261) | match |
| Ch I–IV | Line | top | `162` (app 108) | `108` | match |
| Ch I–IV | Line | font-size | `14.5` | `14.5` | match |
| Ch I–IV | Line | weight | `400` | `sans('400')` | match |
| Ch I–IV | Line | line-height | `21` | `21` | match |
| Ch I–IV | Line | colour | `#55534E` | `#55534E` | match |
| Ch I–IV | Line | text-wrap | `pretty` | `textWrap: 'pretty'` on web, native default elsewhere | match |
| Ch I–IV | Scene band | left / right | `0` / `0` | `0` / `0` (263) | match |
| Ch I–IV | Scene band | top | `214` (app 160) | `160` | match |
| Ch I–IV | Scene band | height | `338` | `SCENE_H = 338` (WorldArt:43) | match |
| Ch I–IV | Scene band | overflow | `hidden` | `overflow: 'hidden'` | match |
| Ch I–IV | Scene band | background | `linear-gradient(180deg, #F4F3F0 0%, #F3EEE1 58%, #F4F3F0 100%)` | `band-` LinearGradient x1/y1 0,0 → x2/y2 0,1; stops `0 #F4F3F0`, `0.58 #F3EEE1`, `1 #F4F3F0` (WorldArt:184) | match |
| Ch I–IV | Scene fade | bottom / height | `0` / `44` | `y = 338 − 44 = 294`, height 44 (WorldArt:215) | match |
| Ch I–IV | Scene fade | background | `linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)` | `fade-` stops `0 #F4F3F0 @0`, `1 #F4F3F0 @1` | match |
| Ch I–IV | Row 1 | left / right | `24` / `24` | `24` / `24` (267) | match |
| Ch I–IV | Row 1 | top | `566` (app 512) | `512` | match |
| Ch I–IV | Row card | height (normal) | `56` | `56` (215) | match |
| Ch I–IV | Row card | height (current) | `60` | `60` (215) | match |
| Ch I–IV | Row card | border-radius | `14` | `14` | match |
| Ch I–IV | Row card | background | `#FFFFFF` | `#FFFFFF` | match |
| Ch I–IV | Row card | shadow (normal) | `0 0 0 1px rgba(0,0,0,0.06)` | `'0 0 0 1px rgba(0,0,0,0.06)'` (217) | match |
| Ch I–IV | Row card | shadow (current) | `0 0 0 2px #131313, 0 10px 22px rgba(40,38,32,0.12)` | identical string (217) | match |
| Ch I–IV | Row card | opacity (locked) | `0.6` | `0.6` (222) | match |
| Ch I–IV | Row card | flex-direction / align | `row` / `center` | `row` / `center` | match |
| Ch I–IV | Row card | gap | `13` | `13` | match |
| Ch I–IV | Row card | padding | `0 16` (border-box) | `paddingHorizontal: 16` | match |
| Ch I–IV | Glyph · done | size / radius | `30 × 30` / `50%` | `30 × 30` / `15` (201) | match |
| Ch I–IV | Glyph · done | background | `#131313` | `#131313` | match |
| Ch I–IV | Glyph · done | svg size / viewBox | `12 × 10` / `0 0 16 13` | `12 × 10` / `0 0 16 13` | match |
| Ch I–IV | Glyph · done | path `d` | `M1.5 7l4.4 4.5L14.5 1.5` | same | match |
| Ch I–IV | Glyph · done | stroke / width / caps | `#F4F3F0` / `2.8` / `round` | same | match |
| Ch I–IV | Glyph · current | size / radius | `32 × 32` / `50%` | `32 × 32` / `16` (192) | match |
| Ch I–IV | Glyph · current | background | `#131313` | `#131313` | match |
| Ch I–IV | Glyph · current | svg | `viewBox 0 0 40 26`, `width:18px` (height auto → 11.7) | `width 18`, `height 11.7`, `viewBox 0 0 40 26` (193) | match |
| Ch I–IV | Glyph · current | sail path | `M21 3 L21 16 L12 16 Z` fill `#F4F3F0` | same | match |
| Ch I–IV | Glyph · current | hull path | `M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z` fill `#F4F3F0` | same | match |
| Ch I–IV | Glyph · locked | size / radius / bg | `30 × 30` / `50%` / `#EDECE7` | `30 × 30` / `15` / `#EDECE7` (182) | match |
| Ch I–IV | Glyph · locked | svg size / viewBox | `11 × 13` / `0 0 14 16` | `11 × 13` / `0 0 14 16` | match |
| Ch I–IV | Glyph · locked | body rect | `x1.5 y7 w11 h8 rx2` fill `#8B8882` | same | match |
| Ch I–IV | Glyph · locked | shackle path | `M4 7V5a3 3 0 016 0v2`, stroke `#8B8882`, width `2`, fill none | same | match |
| Ch I–IV | Row label | flex | `1` | `flex: 1` (225) | match |
| Ch I–IV | Row label | font-size | `15.5` | `15.5` | match |
| Ch I–IV | Row label | weight (normal / current) | `500` / `700` | `sans('500')` / `sans('700')` | match |
| Ch I–IV | Row label | colour | `#1D1C1A` | `#1D1C1A` | match |
| Ch I–IV | Row label | max lines | 1 (single flex span) | `numberOfLines={1}` (tail ellipsis rather than frame clip) | match |
| Ch I–IV | Row meta | font-size | `12.5` | `12.5` (228) | match |
| Ch I–IV | Row meta | weight (normal / current) | `500` / `600` | `sans('500')` / `sans('600')` | match |
| Ch I–IV | Row meta | colour (normal / current) | `#8B8882` / `#1D1C1A` | `#8B8882` / `#1D1C1A` | match |
| Ch I–IV | Row gap | height | 24 (622→646, 706→730) | `24` (235) | match |
| Ch I–IV | Gap pip ×2 | left | `52` | `28` inside a container at left 24 → 52 (237) | match |
| Ch I–IV | Gap pip 1 | top | row bottom + 5 (627 / 707 / 711) | `5` (237) | match |
| Ch I–IV | Gap pip 2 | top | row bottom + 13 (635 / 715 / 719) | `13` (238) | match |
| Ch I–IV | Gap pip | size / radius | `3.5 × 3.5` / `50%` | `3.5 × 3.5` / `1.75` | match |
| Ch I–IV | Gap pip | background | `rgba(40,38,32,0.2)` | `rgba(40,38,32,0.2)` | match |
| Ch I–IV | Footer band | top / bottom | `798` (app 744) / `0` | `bottom: 0`, `height: FOOTER_H = 54` (279) | match |
| Ch I–IV | Footer band | overflow | `hidden` | Svg viewport 54 tall clips | match |
| Ch I–IV | Footer band | background | `linear-gradient(180deg, #ECEBE6, #E7E6E0)` | `land-` stops `0 #ECEBE6`, `1 #E7E6E0` (WorldArt:239) | match |
| Ch I–III | Footer hill 1 | box | `left −30, right 40%, top 30, h 80` → x −30 → 235.8, w 265.8 @393 | `swell(-30, 30, width*0.6 + 30, 80, 44)` = 265.8 @393 (WorldArt:247) | match |
| Ch I–III | Footer hill 1 | radius | `50% 50% 0 0 / 44px 44px 0 0` | arc ry `44`, rx = w/2 | match |
| Ch I–III | Footer hill 2 | box | `left 35%, right −40, top 38, h 80` → x 137.55, w 295.45 @393 | `swell(width*0.35, 38, width*0.65 + 40, 80, 40)` = 295.45 @393 | match |
| Ch I–III | Footer hill 2 | radius | `… / 40px 40px 0 0` | arc ry `40` | match |
| Ch I | Footer hills | fill | `#CFD9E2`, `#C4D2DE` | `landing: ['#CFD9E2','#C4D2DE']` (WorldArt:222) | match |
| Ch II | Footer hills | fill | `#DAD9D2`, `#D0CFC8` | `crossing: ['#DAD9D2','#D0CFC8']` | match |
| Ch III | Footer hills | fill | `#D8D7D0`, `#CFCEC7` | `highlands: ['#D8D7D0','#CFCEC7']` | match |
| Ch IV | Footer hills | presence | none drawn | `watch: null` (WorldArt:225) | match |
| Ch IV | Footer laurel | layout | flex row, `align center`, `justify center`, gap `9` | same, gap 9 (JourneyScreens:282) | match |
| Ch IV | Footer laurel | image | `laurel-mark.webp` `20 × 20`, opacity `0.8` | `laurel-mark.webp`, 20 × 20, opacity 0.8 (283) | match |
| Ch IV | Footer laurel | label | `Day 90 · the vow, renewed`, 12.5 / 600 / `#8B8882` | identical (284) | match |

---

## 2 · Chapter I — The Landing (scene + row content)

App: `WorldArt.tsx:92–112`, `JourneyScreens.tsx:113–123`. Scene tops are band-relative in both.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Ch I | Title | text | `The Landing` | `The Landing` | match |
| Ch I | Line | text | `Getting ashore — the vow, the first check-ins, the first wave faced.` | identical (116) | match |
| Ch I | Sun halo | box | `left 70, top 100, 130 × 130`, radius 50% | `Ellipse cx 135, cy 165, rx 65, ry 65` (centre 135,165) | match |
| Ch I | Sun halo | gradient | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)` | `#E2BA78` @0.42 → @0.2436 at 0.4 → @0 at 0.74 | **MISMATCH\*** — the extra 0.4 stop (α×0.58) stands in for `filter: blur(4px)`; a true 2-stop ramp reads 0.193 there |
| Ch I | Sun halo | filter | `blur(4px)` | none | **MISMATCH\*** — folded into the gradient falloff above |
| Ch I | Sun disc | box | `left 116, top 144, 38 × 38`, radius 50% | `Circle cx 135, cy 163, r 19` | match |
| Ch I | Sun disc | background | `#E9D2A4` | `#E9D2A4` | match |
| Ch I | Swell 1 | box | `left −40, right −40, top 242, h 90` → w 473 @393 | `swell(-40, 242, w+80, 90, 26)` = 473 @393 | match |
| Ch I | Swell 1 | radius / fill | `/ 26px` / `#C8D7E5` | ry 26 / `#C8D7E5` | match |
| Ch I | Swell 2 | box | `left −60, right −20, top 260, h 80` → w 473 | `swell(-60, 260, w+80, 80, 22)` | match |
| Ch I | Swell 2 | radius / fill | `/ 22px` / `#D5E1EA` | ry 22 / `#D5E1EA` | match |
| Ch I | Swell 3 | box | `left −40, right −40, top 288, h 90` → w 473 | `swell(-40, 288, w+80, 90, 22)` | match |
| Ch I | Swell 3 | radius / fill | `/ 22px` / `#EDE7D8` | ry 22 / `#EDE7D8` | match |
| Ch I | Swell 4 | box | `left −70, right −20, top 308, h 80` → w 483 | `swell(-70, 308, w+90, 80, 18)` = 483 | match |
| Ch I | Swell 4 | radius / fill | `/ 18px` / `#F2EDE0` | ry 18 / `#F2EDE0` | match |
| Ch I | Hull shadow | box | `left 206, top 326, 96 × 11`, radius 50% | `Ellipse cx 254, cy 331.5, rx 48, ry 5.5` | match |
| Ch I | Hull shadow | colour | `rgba(0,0,0,0.09)` flat | `#000000` radial (1 → 0.86@0.55 → 0@1) × opacity 0.09 | **MISMATCH\*** — substitutes `blur(4px)`; centre alpha is right, the edge fades inside the ellipse instead of spreading past it |
| Ch I | Hull | box | `left 210, top 300, 88 × 22` | `roundRect(210, 300, 88, 22, …)` | match |
| Ch I | Hull | radius | authored `6 6 18 18` → drawn `5.5 5.5 16.5 16.5` (f = 22/24) | `5.5, 5.5, 16.5, 16.5` | match |
| Ch I | Hull | background | `#E4E3DE` | `#E4E3DE` | match |
| Ch I | Hull ring | box-shadow | `0 0 0 1px rgba(0,0,0,0.05)` | `roundRect(209, 299, 90, 24, 6.5, 6.5, 17.5, 17.5)` filled `rgba(0,0,0,0.05)` behind the hull | match |
| Ch I | Deck line | box / radius / fill | `left 216, top 304, 76 × 4` / `2` / `#D6D5D0` | `Rect 216,304,76,4 rx2 #D6D5D0` | match |
| Ch I | Mast | box / radius / fill | `left 128, top 260, 4 × 58` / `2` / `#B4B1AB` | `Rect 128,260,4,58 rx2 #B4B1AB` | match |
| Ch I | Pennant | box / radius / fill | `left 132, top 260, 20 × 12` / `2` / `#E9D2A4` | `Rect 132,260,20,12 rx2 #E9D2A4` | match |
| Ch I | Mast shadow | box | `left 112, top 320, 44 × 8`, radius 50% | `Ellipse cx 134, cy 324, rx 22, ry 4` | match |
| Ch I | Mast shadow | colour / filter | `rgba(0,0,0,0.08)` / `blur(3px)` | shade radial × opacity 0.08, no blur | **MISMATCH\*** — same substitution |
| Ch I | Foam 1 | box / radius / fill | `left 60, top 270, 24 × 4` / `2` / `rgba(255,255,255,0.55)` | identical | match |
| Ch I | Foam 2 | box / radius / fill | `left 320, top 278, 20 × 4` / `2` / `rgba(255,255,255,0.5)` | identical | match |
| Ch I | Scene z-order | paint order | halo, sun, 4 swells, hull shadow, hull, deck, mast, pennant, mast shadow, foam ×2 | identical order (WorldArt:95–110) | match |
| Ch I | Row 1 | label / meta | `The vow` / `Day 0` | same (118) | match |
| Ch I | Row 1 | state drawn | done | `vowed ? 'done' : 'locked'` — data | match |
| Ch I | Row 2 | label / meta | `Seven mornings` / `Days 1–7 · held` | same (120) | match |
| Ch I | Row 3 | label / meta | `First wave outlasted` / `×1` | `First wave outlasted` / `×{waves}` — data | match |

---

## 3 · Journey Campaign frame = Chapter II — The Crossing

App: `WorldArt.tsx:113–137`, `JourneyScreens.tsx:126–136`.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Ch II | Title | text | `The Crossing` | `The Crossing` | match |
| Ch II | Line | text | `Open water — the first honest weeks. Hold the pledge, ride the waves, learn your triggers.` | identical (129) | match |
| Ch II | Sun halo | box | `left 212, top 98, 140 × 140` | `Ellipse cx 282, cy 168, rx 70, ry 70` | match |
| Ch II | Sun halo | gradient / filter | `rgba(226,186,120,0.42) → 0 @74%` / `blur(4px)` | `#E2BA78` 0.42 / 0.2436@0.4 / 0@0.74, no blur | **MISMATCH\*** — blur folded into the ramp |
| Ch II | Sun disc | box / fill | `left 262, top 148, 40 × 40` / `#E9D2A4` | `Circle 282,168 r20 #E9D2A4` | match |
| Ch II | Cloud 1 | box | `left 24, top 126, 52 × 14` | `Rect 24,126,52,14` | match |
| Ch II | Cloud 1 | radius | authored `9` → drawn `7` (f = 14/18) | `rx 7` | match |
| Ch II | Cloud 1 | fill | `#F9F8F4` | `#F9F8F4` | match |
| Ch II | Cloud 2 | box / opacity | `left 52, top 112, 34 × 11` / `0.85` | `Rect 52,112,34,11`, opacity 0.85 | match |
| Ch II | Cloud 2 | radius | authored `7` → drawn `5.5` (f = 11/14) | `rx 5.5` | match |
| Ch II | Headland 1 | box | `left −60, right 55%, top 188, h 120` → x −60 → 176.85, w 236.85 @393 | `swell(-60, 188, w*0.45 + 60, 120, 56)` = 236.85 | match |
| Ch II | Headland 1 | radius / fill | `/ 56px` / `#DEDDD6` | ry 56 / `#DEDDD6` | match |
| Ch II | Headland 2 | box | `left −90, right 70%, top 212, h 120` → w 207.9 @393 | `swell(-90, 212, w*0.3 + 90, 120, 44)` = 207.9 | match |
| Ch II | Headland 2 | radius / fill | `/ 44px` / `#D2D1CA` | ry 44 / `#D2D1CA` | match |
| Ch II | Swell 1 | box / radius / fill | `left −40, right −40, top 260, h 120` / `/30px` / `#C8D7E5` | `swell(-40, 260, w+80, 120, 30)` | match |
| Ch II | Swell 2 | box / radius / fill | `left −60, right −20, top 282, h 110` / `/24px` / `#D5E1EA` | `swell(-60, 282, w+80, 110, 24)` | match |
| Ch II | Wake | box | `left 196, top 298, 96 × 12`, radius 50% | `Ellipse cx 244, cy 304, rx 48, ry 6` | match |
| Ch II | Wake | colour / filter | `rgba(40,60,90,0.14)` / `blur(4px)` | `#283C5A` radial (1 → 0.86@0.55 → 0) × opacity 0.14 | **MISMATCH\*** — blur → falloff |
| Ch II | Sail | box | `left 236, top 224, 34 × 52` | quarter-ellipse `M236 224A34 52 0 0 1 270 276L236 276Z` | match |
| Ch II | Sail | radius | `0 100% 0 0` (top-right 34 × 52 quarter) | arc rx 34, ry 52 | match |
| Ch II | Sail | fill | `#F7F6F2` | `#F7F6F2` | match |
| Ch II | Sail ring | box-shadow | `0 0 0 1px rgba(0,0,0,0.04)` | outset path `M235 223H236A35 53 0 0 1 271 276V277H235Z` fill `rgba(0,0,0,0.04)` | match |
| Ch II | Mast | box / radius / fill | `left 232, top 216, 4 × 70` / `2` / `#B4B1AB` | identical | match |
| Ch II | Pennant | box / radius / fill | `left 222, top 216, 10 × 7` / `2` / `#E9D2A4` | identical | match |
| Ch II | Hull | box | `left 204, top 284, 76 × 18` | `roundRect(204, 284, 76, 18, …)` | match |
| Ch II | Hull | radius | authored `4 4 14 14`, f = 1 (4+14 = 18 = height) → drawn `4 4 14 14` | `4, 4, 14, 14` | match |
| Ch II | Hull | fill / ring | `#E4E3DE` / `0 0 0 1px rgba(0,0,0,0.05)` | `#E4E3DE` / `roundRect(203,283,78,20,5,5,15,15)` | match |
| Ch II | Foam 1 | box / fill | `left 150, top 316, 26 × 4` / `rgba(255,255,255,0.6)` | identical | match |
| Ch II | Foam 2 | box / fill | `left 300, top 328, 20 × 4` / `rgba(255,255,255,0.5)` | identical | match |
| Ch II | Foam 3 | box / fill | `left 96, top 340, 22 × 4` / `rgba(255,255,255,0.45)` | identical | match |
| Ch II | Row 1 | label / meta / state | `The Landing` / `Days 1–7 · held` / done | same, `standingIn('landing')` | match |
| Ch II | Row 2 | label / meta / state | `The Crossing` / `Day 13 of 30` / current | `Day {min(30, day)} of 30`, `standingIn('crossing')` | match |
| Ch II | Row 2 | top / height | `646` (app 592) / `60` | 512 + 56 + 24 = 592, height 60 | match |
| Ch II | Row 3 | label / meta / state | `The Highlands` / `Days 31–60` / locked, opacity 0.6 | same, `standingIn('highlands')` | match |
| Ch II | Row 3 | top | `730` (app 676) | 592 + 60 + 24 = 676 | match |

---

## 4 · Chapter III — The Highlands

App: `WorldArt.tsx:138–154`, `JourneyScreens.tsx:137–146`.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Ch III | Title | text | `The Highlands` | `The Highlands` | match |
| Ch III | Line | text | `Thinner air, longer views — the habits hold under real stress.` | identical | match |
| Ch III | Sun halo | box | `right 56, top 96, 130 × 130` → centre (272, 161) @393 | `Ellipse cx w−121 (272), cy 161, rx 65` | match |
| Ch III | Sun halo | gradient / filter | `rgba(226,186,120,0.4) → 0 @74%` / `blur(4px)` | `HALO.highlands = 0.4`, mid stop 0.232@0.4, no blur | **MISMATCH\*** — blur → falloff |
| Ch III | Sun disc | box / fill | `right 98, top 134, 34 × 34` → centre (278, 151) | `Circle cx w−115 (278), cy 151, r 17`, `#E9D2A4` | match |
| Ch III | Ridge 1 | box | `left −80, right 34%, top 184, h 200` → w 339.38 @393 | `swell(-80, 184, w*0.66 + 80, 200, 130)` = 339.38 | match |
| Ch III | Ridge 1 | radius / fill | `/ 130px` / `#D8D7D0` | ry 130 / `#D8D7D0` | match |
| Ch III | Ridge 2 | box | `left 28%, right −80, top 214, h 170` → x 110.04, w 362.96 | `swell(w*0.28, 214, w*0.72 + 80, 170, 100)` = 362.96 | match |
| Ch III | Ridge 2 | radius / fill | `/ 100px` / `#CBCAC3` | ry 100 / `#CBCAC3` | match |
| Ch III | Swell | box / radius / fill | `left −40, right −40, top 268, h 120` / `/48px` / `#C0BFB8` | `swell(-40, 268, w+80, 120, 48)` | match |
| Ch III | Flagpole | box / radius / fill | `left 116, top 144, 4 × 46` / `2` / `#B4B1AB` | identical | match |
| Ch III | Flag | box / radius / fill | `left 120, top 144, 18 × 11` / `2` / `#E9D2A4` | identical | match |
| Ch III | Pole shadow | box | `left 104, top 188, 36 × 7`, radius 50% | `Ellipse cx 122, cy 191.5, rx 18, ry 3.5` | match |
| Ch III | Pole shadow | colour / filter | `rgba(0,0,0,0.10)` / `blur(3px)` | shade radial × opacity 0.1 | **MISMATCH\*** — blur → falloff |
| Ch III | Foam 1 | box / fill / rotate | `left 150, top 310, 16 × 4` / `rgba(255,255,255,0.5)` / `-14deg` about centre (158, 312) | `Rect 150,310,16,4 rx2`, `rotate(-14 158 312)` | match |
| Ch III | Foam 2 | box / fill / rotate | `left 176, top 296, 13 × 4` / `rgba(255,255,255,0.45)` / `-14deg` about (182.5, 298) | `rotate(-14 182.5 298)` | match |
| Ch III | Foam 3 | box / fill / rotate | `left 200, top 282, 11 × 4` / `rgba(255,255,255,0.4)` / `-14deg` about (205.5, 284) | `rotate(-14 205.5 284)` | match |
| Ch III | Row 1 | label / meta | `The Long Climb` / `Days 31–45` | same (142) | match |
| Ch III | Row 2 | label / meta | `The Pass` / `Days 46–53` | same (143) | match |
| Ch III | Row 3 | label / meta | `The Ridge` / `Days 54–60` | same (144) | match |
| Ch III | Rows 1–3 | state drawn | all locked, opacity 0.6 | `past(45)/past(53)/past(60)` — locked until the day passes | match |

---

## 5 · Chapter IV — The Watch

App: `WorldArt.tsx:155–177`, `JourneyScreens.tsx:147–156`.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Ch IV | Title | text | `The Watch` | `The Watch` | match |
| Ch IV | Line | text | `The habit is yours — now you keep the light on for the long run.` | identical | match |
| Ch IV | Moon back | box / fill | `left 44, top 114, 36 × 36`, radius 50% / `#DCDED8` | `Circle cx 62, cy 132, r 18`, `#DCDED8` | match |
| Ch IV | Moon front | box / fill | `left 36, top 108, 36 × 36` / `#EFEEE8` | `Circle cx 54, cy 126, r 18`, `#EFEEE8` | match |
| Ch IV | Star 1 | box / fill | `left 120, top 132, 2.5 × 2.5` / `rgba(142,153,168,0.7)` | `Circle cx 121.25, cy 133.25, r 1.25` | match |
| Ch IV | Star 2 | box / fill | `left 88, top 168, 2 × 2` / `rgba(142,153,168,0.55)` | `Circle cx 89, cy 169, r 1` | match |
| Ch IV | Sun halo | box | `left 204, top 152, 100 × 100` | `Ellipse cx 254, cy 202, rx 50` | match |
| Ch IV | Sun halo | gradient / filter | `rgba(226,186,120,0.45) → 0 @74%` / `blur(4px)` | `HALO.watch = 0.45`, mid 0.261@0.4, no blur | **MISMATCH\*** — blur → falloff |
| Ch IV | Swell 1 | box / radius / fill | `left −40, right −40, top 268, h 110` / `/26px` / `#D8D7D0` | `swell(-40, 268, w+80, 110, 26)` | match |
| Ch IV | Swell 2 | box / radius / fill | `left −40, right −40, top 292, h 100` / `/22px` / `#C8D7E5` | `swell(-40, 292, w+80, 100, 22)` | match |
| Ch IV | Swell 3 | box / radius / fill | `left −70, right −20, top 312, h 90` / `/18px` / `#D5E1EA` | `swell(-70, 312, w+90, 90, 18)` = w 483 | match |
| Ch IV | Beam | box | `left 258, top 188, 110 × 26` | `Rect 258,188,110,26` | match |
| Ch IV | Beam | gradient | `linear-gradient(90deg, rgba(233,210,164,0.4), rgba(233,210,164,0))` | `beam-` x1 0 → x2 1, `#E9D2A4` 0.4 → 0 | match |
| Ch IV | Beam | transform | `rotate(8deg)` about centre (313, 201) | `rotate(8 313 201)` | match |
| Ch IV | Beam | filter | `blur(2px)` | none | **MISMATCH\*** — the app draws the beam hard-edged; nothing substitutes the 2px softening |
| Ch IV | Lamp shadow | box | `left 216, top 288, 76 × 10`, radius 50% | `Ellipse cx 254, cy 293, rx 38, ry 5` | match |
| Ch IV | Lamp shadow | colour / filter | `rgba(0,0,0,0.10)` / `blur(4px)` | shade radial × opacity 0.1 | **MISMATCH\*** — blur → falloff |
| Ch IV | Tower | box | `left 232, top 212, 40 × 82` | `roundRect(232, 212, 40, 82, …)` | match |
| Ch IV | Tower | radius | authored `6 6 2 2`, f = 1 → drawn `6 6 2 2` | `6, 6, 2, 2` | match |
| Ch IV | Tower | fill / ring | `#F7F6F2` / `0 0 0 1px rgba(0,0,0,0.05)` | `#F7F6F2` / `roundRect(231,211,42,84,7,7,3,3)` | match |
| Ch IV | Tower band | box / fill / radius | `left 232, top 244, 40 × 10` / `#E0DFDA` / none | `Rect 232,244,40,10 #E0DFDA` | match |
| Ch IV | Gallery | box / radius / fill | `left 228, top 200, 48 × 14` / `3` / `#55534E` | `Rect 228,200,48,14 rx3 #55534E` | match |
| Ch IV | Lamp | box / radius / fill | `left 240, top 188, 24 × 14` / `3` / `#E9D2A4` | `Rect 240,188,24,14 rx3 #E9D2A4` | match |
| Ch IV | Cap | box / radius / fill | `left 236, top 180, 32 × 10` / `6 6 0 0` (f = 1) / `#55534E` | `roundRect(236,180,32,10,6,6,0,0)` | match |
| Ch IV | Row 1 | label / meta | `Home waters` / `Days 61–75` | same (152) | match |
| Ch IV | Row 2 | label / meta | `Keeping the watch` / `Days 76–90` | same (153) | match |
| Ch IV | Row 3 | label / meta | `The vow, renewed` / `Day 90` | same (154) | match |
| Ch IV | Rows 1–3 | state drawn | all locked, opacity 0.6 | `past(75)/past(90)/past(90)` | match |

---

## 6 · exports-Journey Campaign — "The campaign", five grounds

App: `JourneyScreens.tsx:520–774` (`CampaignGrounds`), `WorldCardArt.tsx:119–257`.
Card width in both = 393 − 48 = **345**; the interlude breaks out to the full 393.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Campaign | Frame | background / grain | `#F4F3F0` / noise @ `0.07` | `#F4F3F0` / `Grain opacity 0.07` (733) | match |
| Campaign | Back row | left / top / gap / label | `16` / `64` (app 10) / `9` / `Back` | same `BackRow` as the chapters | match |
| Campaign | Title | left / top | `24` / `114` (app 60) | `24` / `60` (740) | match |
| Campaign | Title | size / weight / tracking / colour | `31` / `600` / `-0.4` / `#2A2924` | `31` / `sans('600')` / `-0.4` / `#2A2924` | match |
| Campaign | Sub | left / right / top | `24` / `80` / `160` (app 106) | `24` / `80` / `106` (741) | match |
| Campaign | Sub | size / weight / line-height / colour | `15` / `400` / `23` / `#55534E` | `15` / `sans('400')` / `23` / `#55534E` | match |
| Campaign | Sub | text | `Five grounds, from landing to triumph.` | identical | match |
| Campaign | Column | left / right / top | `24` / `24` / `210` (app 156) | ScrollView top `156`, `paddingHorizontal: 24` (746) | match |
| Campaign | Column | gap | `0` (heights carry the rhythm) | no gap; link blocks carry it | match |
| Campaign | Card | height / radius | `116` / `16` | `GROUND_CARD_H = 116` / `16` (678) | match |
| Campaign | Card | overflow | `hidden` | art clipped by an inner `overflow: 'hidden'` box (685) | match |
| Campaign | Card I | field gradient | `linear-gradient(180deg, #E9EFF4 0%, #F0EDE5 100%)` | `['#E9EFF4','#F0EDE5']` | match |
| Campaign | Card I | shadow | `0 0 0 1px rgba(0,0,0,0.07)` | `0 0 0 1px rgba(0,0,0,0.07)` | match |
| Campaign | Card II | field gradient | `#E3ECF3 → #EDEAE2` | `['#E3ECF3','#EDEAE2']` | match |
| Campaign | Card II | shadow | `0 0 0 2px #131313, 0 10px 22px rgba(40,38,32,0.18)` | identical string | match |
| Campaign | Card III | field gradient / shadow | `#E4E9EE → #EBE9E3` / `0 0 0 1px rgba(0,0,0,0.06)` | `['#E4E9EE','#EBE9E3']` / same | match |
| Campaign | Card IV | field gradient / shadow | `#E9EFF4 → #F0EDE5` / `1px rgba(0,0,0,0.06)` | `['#E9EFF4','#F0EDE5']` / same | match |
| Campaign | Card V | field gradient / shadow | `#E9EFF4 → #F0EDE5` / `1px rgba(0,0,0,0.06)` | `['#E9EFF4','#F0EDE5']` / same | match |
| Campaign | Card grain | opacity | `0.06` | `0.06` (688) | match |
| Campaign | Numeral | left / top | `18` / `16` | `18` / `16` (691) | match |
| Campaign | Numeral | size / weight / tracking | `11` / `600` / `2.2` | `11` / `sans('600')` / `2.2` | match |
| Campaign | Numeral | colour I / II / III–V | `#8B8882` / `#6E6C66` / `#A5A29B` | `here ? #6E6C66 : ahead ? #A5A29B : #8B8882` | match |
| Campaign | Name | left / bottom | `18` / `32` | `18` / `32` (698) | match |
| Campaign | Name | size I / II / III–V | `20` / `21` / `20` | `here ? 21 : 20` | match |
| Campaign | Name | weight I / II / III–V | `600` / `700` / `600` | `here ? '700' : '600'` | match |
| Campaign | Name | colour I / II / III–V | `#1D1C1A` / `#131313` / `#6E6C66` | `here ? #131313 : ahead ? #6E6C66 : #1D1C1A` | match |
| Campaign | Name | right bound | none (nowrap) | `right: 18`, `numberOfLines={1}` | match |
| Campaign | Line | left / bottom / size / weight | `18` / `13` / `12.5` / `400` | `18` / `13` / `12.5` / `sans('400')` (702) | match |
| Campaign | Line | colour I–II / III–V | `#55534E` / `#98958E` | `ahead ? #98958E : #55534E` | match |
| Campaign | Badge · taken | right / top / height / radius | `14` / `14` / `24` / `12` | `14` / `14` / `24` / `12` (609) | match |
| Campaign | Badge · taken | padding / gap / background | `0 11 0 8` / `5` / `rgba(19,19,19,0.08)` | `paddingLeft 8, paddingRight 11` / `5` / same | match |
| Campaign | Badge · taken | tick svg | `11 × 9`, `0 0 16 13`, `M1.5 7l4.4 4.5L14.5 1.5`, stroke `#131313` w `2.8` | identical (622) | match |
| Campaign | Badge · taken | label | `Taken`, 10.5 / 600 / ls 0.3 / `#131313` | identical (625) | match |
| Campaign | Badge · here | box | right 14, top 14, h 24, padding `0 10`, radius 12, bg `#131313` | identical (632) | match |
| Campaign | Badge · here | label | `YOU ARE HERE`, 9 / 600 / ls 1.3 / `#FFFFFF` | identical (642) | match |
| Campaign | Badge · locked | box | right 14, top 14, `24 × 24`, radius 50%, `rgba(19,19,19,0.07)` | identical (648) | match |
| Campaign | Badge · locked | svg | `11 × 13`, `0 0 17 19`; rect `1.5,8,14,9.5 rx2.4` stroke `#8B8882` w1.9; path `M4.8 8V5.6a3.7 3.7 0 0 1 7.4 0V8` | identical (659) | match |
| Campaign | Link | height | `64` | `64` (595) | match |
| Campaign | Link pebbles | tops | `9, 23, 38, 52` | `9, 23, 38, 52` | match |
| Campaign | Link pebbles | dx from 50% | `−9, +2, −10, +1` | `−9, 2, −10, 1` | match |
| Campaign | Link pebbles | size / fill | `7 #C3CEDA, 8 #B2C1D0, 8 #B2C1D0, 7 #C3CEDA` | identical | match |
| Campaign | Link placement | order | after I, after II, **not** after III, after IV | `i > 0 && GROUNDS[i−1].key !== 'deep'` (751) | match |
| Campaign | Art I | sun | `right 104, top 4, 50 × 50`, `rgba(243,227,196,0.9) → 0 @78%` | `Ellipse cx w−129 (216), cy 29, rx 25`, `SUN_ALPHA.landing 0.9`, stop 0.78 | match |
| Campaign | Art I | dune 1 | `left 150, right −60, top 64, h 110, /46` → w 255 | `swell(150, 64, w−90, 110, 46)` = 255 | match |
| Campaign | Art I | dune 1 / 2 fill | `#EADFC9` / `#E0D2B4` | identical | match |
| Campaign | Art I | dune 2 | `left 238, right −100, top 84, h 110, /38` → w 207 | `swell(238, 84, w−138, 110, 38)` = 207 | match |
| Campaign | Art I | flagpole | `right 56, top 42, 2.5 × 28`, radius 2 → drawn 1.25, `#55534E` | `Rect x w−58.5 (286.5), y 42, 2.5 × 28, rx 1.25` | match |
| Campaign | Art I | pennant | border-left 13 `#3A3934`, border-top/bottom 5 transparent at `right 41, top 44` → triangle (291,44)(304,49)(291,54) | `M w−54 44 L w−41 49 L w−54 54 Z` | match |
| Campaign | Art I | cloud | `left 170, top 14, 36 × 11`, radius 7 → 5.5, `#FFFFFF` @0.65 | `Rect 170,14,36,11 rx5.5 fillOpacity 0.65` | match |
| Campaign | Art I | pebbles ×3 | `right 96/84/74, top 84/78/84, 5 × 3.5`, `#CDBD92`, rotate `−14/−10/0` | `Ellipse cx w−98.5/−86.5/−76.5, rx 2.5 ry 1.75`, same rotations | match |
| Campaign | Art II | sun | `right 70, top 2, 56 × 56`, `rgba(243,227,196,0.95) → 0 @78%` | `Ellipse cx w−98 (247), cy 30, rx 28`, `SUN_ALPHA.crossing 0.95` | match |
| Campaign | Art II | swell 1 | `left 130, right −70, top 60, h 110, /44` → w 285, `#D8E3EE` | `swell(130, 60, w−60, 110, 44)` = 285 | match |
| Campaign | Art II | swell 2 | `left 210, right −40, top 78, h 110, /38` → w 175, `#C7D8E7` | `swell(210, 78, w−170, 110, 38)` = 175 | match |
| Campaign | Art II | swell 3 | `left 160, right −120, top 96, h 110, /32` → w 305, `#B9CDDF` | `swell(160, 96, w−40, 110, 32)` = 305 | match |
| Campaign | Art II | sail | bottom-border 20 `#3A3934`, right-border 13 at `right 102, top 30` → (230,30)(230,50)(243,50) | `M w−115 30 L w−115 50 L w−102 50 Z` | match |
| Campaign | Art II | hull | `right 94, top 51, 28 × 7`, radius `3 8 9 9` → f = 7/17 → `1.235 3.294 3.706 3.706` | `roundRect(w−122, 51, 28, 7, 1.24, 3.29, 3.71, 3.71)` | match (2-dp) |
| Campaign | Art II | hull fill | `#131313` | `#131313` | match |
| Campaign | Art II | far sail | bottom 9 `#8DA0B2`, right 6 at `right 170, top 44` → (169,44)(169,53)(175,53) | `M w−176 44 L w−176 53 L w−170 53 Z` | match |
| Campaign | Art II | foam ×2 | `right 150, top 68, 22 × 3` `rgba(255,255,255,0.55)`; `right 58, top 86, 18 × 3` `…0.45` | `Rect w−172,68` and `w−76,86`, rx 1.5 | match |
| Campaign | Art II | birds | svg `22 × 8` at `right 44, top 18`; `M1 6C3 3 5 3 7 5.5M12 5c2-3.5 4.5-3.5 7-0.5`, `#8DA0B2` w1.5 | `translate(w−66, 18)` + identical path | match |
| Campaign | Art III | group opacity | `0.55` | `G opacity 0.55` | match |
| Campaign | Art III | swells | `left 120/190/150, right −80/−50/−130, top 56/76/94, h 110, /46/38/32` → w 305/205/325 | `swell(120,56,w−40,…) / (190,76,w−140,…) / (150,94,w−20,…)` | match |
| Campaign | Art III | swell fills | `#C4D3E1`, `#B0C4D6`, `#9FB7CC` | identical | match |
| Campaign | Art III | foam ×2 | `right 120, top 66, 24 × 3` @0.5; `right 66, top 84, 16 × 3` @0.4 | `Rect w−144,66` and `w−82,84` | match |
| Campaign | Art III | cloud | `right 52, top 28, 34 × 10`, radius 7 → 5, `#FFFFFF` @0.5 (× group 0.55) | `Rect w−86,28,34,10 rx5 fillOpacity 0.5` inside the 0.55 group | match |
| Campaign | Art IV | dunes | `left 140/230, right −70/−110, top 62/84, h 110, /44/36` → w 275/225 | `swell(140,62,w−70,…) / (230,84,w−120,…)` | match |
| Campaign | Art IV | dune fills | `#E2D7BE`, `#D6C8A6` | identical | match |
| Campaign | Art IV | cairn ×3 | `right 64/66.5/68, top 56/50/45`, `14 × 5` r3→2.5, `9 × 4` r2, `6 × 3` r2→1.5; `#8B8882 / #98958E / #A5A29B` | `Rect w−78 / w−75.5 / w−74` with rx `2.5 / 2 / 1.5` and the same fills | match |
| Campaign | Art IV | pebbles ×3 | `right 132/114/96, top 82/75/68, 4 × 3`, `#C2B592` | `Ellipse cx w−134 / w−116 / w−98, rx 2 ry 1.5` | match |
| Campaign | Art IV | cloud | `left 160, top 18, 32 × 10`, radius 7 → 5, `#FFFFFF` @0.6 | `Rect 160,18,32,10 rx5 fillOpacity 0.6` | match |
| Campaign | Art V | sun | `right 106, top 6, 46 × 46`, `rgba(243,227,196,0.9) → 0 @78%` | `Ellipse cx w−129 (216), cy 29, rx 23`, `SUN_ALPHA.camp 0.9` | match |
| Campaign | Art V | dune | `left 130, right −80, top 66, h 110, /44` → w 295, `#E6DCC6` | `swell(130, 66, w−50, 110, 44)` = 295 | match |
| Campaign | Art V | tent | bottom 26 `#55534E`, left/right 17 at `right 56, top 40` → (255,66)(289,66)(272,40) | `M w−90 66 L w−56 66 L w−73 40 Z` | match |
| Campaign | Art V | pole | `right 71, top 56, 4 × 10`, radius `2 2 0 0`, `#2A2924` | `roundRect(w−75, 56, 4, 10, 2, 2, 0, 0)` | match |
| Campaign | Art V | log | `right 106, top 63, 12 × 3`, radius 2 → 1.5, `#8B8882` | `Rect w−118, 63, 12, 3, rx 1.5` | match |
| Campaign | Art V | flame | `right 104, top 58, 8 × 6`, radius `50% 50% 40% 40%` → arcs rx4/ry3 top, rx3.2/ry2.4 bottom, `#D9A05B` | longhand path with exactly those four arcs (WorldCardArt:187) | match |
| Campaign | Art V | sparks ×2 | `right 101, top 50, 3 × 3` `#B4B1AB`; `right 97, top 44, 2.5 × 2.5` `#C6C5C0` | `Circle cx w−102.5 cy 51.5 r1.5`; `cx w−98.25 cy 45.25 r1.25` | match |
| Campaign | Interlude | height / margin | `236` / `0 −24` | `GROUND_INTERLUDE_H = 236` / `marginHorizontal: −24` (755) | match |
| Campaign | Interlude | overflow | `hidden` | `overflow: 'hidden'` | match |
| Campaign | Interlude | glow | `left 50%, top 16, 150 × 150, margin-left −52`, `#F3E3C4 52% → 0 @100%` | `Ellipse cx w/2 + 23 (219.5), cy 91, rx 75`, stops 1 / 1@0.52 / 0@1 | match |
| Campaign | Interlude | clouds ×3 | `44,36 52 × 14 r9→7 @0.7`; `66,27 34 × 12 r8→6 @0.55`; `right 60, 52, 40 × 12 r8→6 @0.6` | `Rect 44,36 rx7`; `66,27 rx6`; `w−100,52 rx6` with those opacities | match |
| Campaign | Interlude | birds | svg `28 × 10` at `right 120, top 78`, `#9AA9B8` w1.7 | `translate(w−148, 78)` + identical path | match |
| Campaign | Interlude | dome 1 | `left −80, right −80, top 98, h 220, /120`, `#E9EFF3` | `swell(-80, 98, w+160, 220, 120)` | match |
| Campaign | Interlude | dome 2 | `left 130, right −150, top 122, h 220, /100` → w 413, `#DBE4ED` | `swell(130, 122, w+20, 220, 100)` = 413 | match |
| Campaign | Interlude | town ×4 | `right 64/80/48/94, top 138/146/148/152`, `12 × 26 / 10 × 20 / 10 × 18 / 8 × 14`, radius `6 6 0 0 / 5 5 0 0 / 5 5 0 0 / 4 4 0 0`, `#EAF0F5 / #E4ECF3 / #E4ECF3 / #DFE9F1` | `roundRect(w−76 / w−90 / w−58 / w−102, …)` with the same radii and fills | match |
| Campaign | Interlude | dome 3 | `left −120, right 140, top 112, h 240, /110` → w 373, `#D3DEE9` | `swell(-120, 112, w−20, 240, 110)` = 373 | match |
| Campaign | Interlude | walker | head `left 63, top 87, 7 × 7`; body `left 60, top 95, 13 × 17` radius `6 6 3 3`; `#7A8794` | `Circle 66.5,90.5 r3.5`; `roundRect(60,95,13,17,6,6,3,3)` | match |
| Campaign | Interlude | boat sail | bottom 16 `#5C6B7A`, right 10 at `right 98, top 148` → (285,148)(285,164)(295,164) | `M w−108 148 L w−108 164 L w−98 164 Z` | match |
| Campaign | Interlude | boat hull | `right 92, top 165, 20 × 5`, radius `2 5 6 6` → f = 5/11 → `0.909 2.273 2.727 2.727`, `#3A3934` | `roundRect(w−112, 165, 20, 5, 0.91, 2.27, 2.73, 2.73)` | match (2-dp) |
| Campaign | Interlude | dome 4 | `left −60, right −60, top 178, h 160, /70`, `#C6D5E3` | `swell(-60, 178, w+120, 160, 70)` | match |
| Campaign | Bottom fade | box | `left 0, right 0, bottom 0, h 64`, z-index 5, pointer-events none | same box, `pointerEvents="none"`, drawn last (766) | match |
| Campaign | Bottom fade | gradient | `linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 82%)` | `['rgba(244,243,240,0)', '#F4F3F0']`, `locations={[0, 0.82]}` | match |
| Campaign | Screen | reachability | frame exists in the bundle | `CampaignGrounds` is exported but **no route renders it** (only `JourneyScroll` and `JourneyChapter` are routed) | note — see Findings |

---

## 7 · exports-Lesson Detail — Story Detail

App: `src/app/lesson-overview/[slug].tsx` (`DetailBody` 126) + `src/components/lesson/scenes.tsx`
(`LessonCoverScene` 358, `LessonHorizon` 439). The frame's lesson ("An urge is a wave") takes
the **water** tint via `tintForLesson`, so tint values below are the water column of `TINTS`.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Detail | Frame | background | `#F4F3F0` | `colors.bg = #F4F3F0` | match |
| Detail | Cover band | top / height | `0` / `330` | first child of the scroll, height `330` (144) | match |
| Detail | Cover band | background | `linear-gradient(180deg, #E7EEF4 0%, #EFEDE8 62%, #F4F3F0 100%)` | `dsky-water`: `#E7EEF4` @0, `#EFEDE8` @0.62, `#F4F3F0` @1 | match |
| Detail | Cover band | overflow | `hidden` | `overflow: 'hidden'` (373) | match |
| Detail | Cover grain | opacity / order | `0.05`, painted over the sky and under the art | `Grain opacity 0.05` passed as `children`, drawn between the two Svgs | match |
| Detail | Moon glow | box | `left 18, top 60, 150 × 150` | `Circle cx 93, cy 135, r 75` | match |
| Detail | Moon glow | gradient | `radial-gradient(closest-side, rgba(255,244,214,0.55), rgba(255,244,214,0) 72%)` | `#FFF4D6` @0.55 → @0 at 0.72 | match |
| Detail | Moon glow | filter | `blur(6px)` | none | **MISMATCH\*** — the app keeps the radial as authored and drops the 6px softening |
| Detail | Drawing box | left | `76` (240 × 170 at top 100) | `g = width/2 − 120` → **76.5** at 393 | **MISMATCH** — the whole boat/moon group sits 0.5 right of the design at the canvas width |
| Detail | Warm halo | box | box-relative `left 55, top 6, 130 × 130` → centre (196, 171) | `Circle cx g+120 (196.5), cy 171, r 65` | match (inherits the 0.5) |
| Detail | Warm halo | gradient / filter | `rgba(226,186,120,0.4) → 0 @74%` / `blur(4px)` | `#E2BA78` 0.4 → 0 @0.74, no blur | **MISMATCH\*** — blur dropped |
| Detail | Moon back | box / fill | `left 20, top 14, 34 × 34` → centre (113, 131) / `#DCDED8` | `Circle cx g+37, cy 131, r 17`, `#DCDED8` | match |
| Detail | Moon front | box / fill | `left 12, top 8, 34 × 34` → centre (105, 125) / `#FBFAF7` | `Circle cx g+29, cy 125, r 17`, `#FBFAF7` | match |
| Detail | Water line 1 | box / radius / fill | `left 0, top 104, 240 × 3` / `2` → drawn 1.5 / `#C9D6E4` | `Rect g, 204, 240 × 3, rx 1.5` | match |
| Detail | Water line 2 | box / fill | `left 14, top 118, 212 × 3` / `#D8E2EC` | `Rect g+14, 218, 212 × 3, rx 1.5` | match |
| Detail | Water line 3 | box / fill | `left 44, top 132, 152 × 3` / `#E4E9F1` | `Rect g+44, 232, 152 × 3, rx 1.5` | match |
| Detail | Hull | box / radius | `left 96, top 74, 48 × 22` / `4 10 12 12`, f = 1 (10+12 = 22) | `roundedRect(g+96, 174, 48, 22, 4, 10, 12, 12)` | match |
| Detail | Hull | fill | `#3A3934` | `#3A3934` | match |
| Detail | Mast | box / fill / radius | `left 117, top 44, 3 × 32` / `#55534E` / none | `Rect g+117, 144, 3 × 32`, `#55534E` | match |
| Detail | Sail | shape | left-border 20 `#C6C5C0`, top/bottom 11 transparent at `left 120, top 46` → (196,146)(196,168)(216,157) | `M g+120 146 L g+120 168 L g+140 157 Z`, `#C6C5C0` | match |
| Detail | Far sail | shape | bottom-border 10 `#B9C4CE`, right 7 at `left 196, top 86` → (272,196)(279,196)(272,186) | `M g+196 196 L g+203 196 L g+196 186 Z`, `#B9C4CE` | match |
| Detail | Cloud 1 | box / radius / fill / rotate | `left 56, top 36, 14 × 5` / `3` → 2.5 / `#C6C5C0` / `-8deg` about (139, 138.5) | `Rect g+56, 136, 14 × 5, rx 2.5`, `rotate(-8 g+63 138.5)` | match |
| Detail | Cloud 2 | box / radius / fill / rotate | `left 74, top 28, 11 × 4` / `2` / `#D6D5D0` / `6deg` about (155.5, 130) | `Rect g+74, 128, 11 × 4, rx 2`, `rotate(6 g+79.5 130)` | match |
| Detail | Cover fade | box / gradient | `bottom 0, h 74` / `rgba(244,243,240,0) → #F4F3F0` | `Rect y 256, h 74`, `dfade` | match |
| Detail | Back row | left / top | `16` / `64` (app 10) | `paddingHorizontal: 16`; row is a 40pt box centred at the safe-area top → glyph top ≈ 10 (237) | match |
| Detail | Back row | gap / z-order | `9` / `z-index: 5` above the cover | `gap: 9`; rendered last, absolutely positioned (115) | match |
| Detail | Back label | text / size / weight / colour | `Library` / `17` / `400` / `#55534E` | identical (247) | match |
| Detail | Back chevron | svg / path / stroke / width | `11 × 19`, `0 0 11 19`, `M9.5 1.5L2 9.5l7.5 8`, `#55534E`, `2.4` | identical (244) | match |
| Detail | Title | left / top | `16` / `366` | `marginLeft 16` / 330 + `marginTop 36` = **366** (152) | match |
| Detail | Title | size / weight / tracking / colour | `27` / `500` / `-0.3` / `#1D1C1A` | `27` / `sans('500')` / `-0.3` / `#1D1C1A` | match |
| Detail | Title | wrapping | `white-space: nowrap` (clipped by the frame) | `numberOfLines={1}`, no right bound (tail ellipsis instead of a clip) | match |
| Detail | Meta row | left / top | `16` / `414` | `marginLeft 16`; 366 + title line box (≈32.2 at 27pt) + `marginTop 16` ≈ 414.2 (155) | match |
| Detail | Meta row | display / align / gap | `flex` / `center` / `18` | `row` / `center` / `18` (71) | match |
| Detail | Meta · minutes | text / size / weight / colour | `7 min` / `14` / `500` / `#8B8882` | `{estimatedMinutes ?? 4} min` / `14` / `sans('500')` / `#8B8882` | match |
| Detail | Meta · inner | gap | `7` | `7` (73) | match |
| Detail | Book glyph | svg size / viewBox | `16 × 13` / `0 0 19 15` | `16 × 13` / `0 0 19 15` (291) | match |
| Detail | Book glyph | path 1 `d` | `M9.5 2.5C7.5 1 4.5 1 1.5 2v11c3-1 6-1 8 0.5 2-1.5 5-1.5 8-0.5V2c-3-1-6-1-8 0.5z` | identical | match |
| Detail | Book glyph | path 2 `d` / stroke / width / fill | `M9.5 2.5v11` / `#8B8882` / `1.6` / none | identical | match |
| Detail | Meta · where | text / size / weight / colour | `Week 1 · Foundations` / `14` / `500` / `#8B8882` | `Week {n} · {world.sub}` / same metrics | match |
| Detail | Blurb | left / right / top | `16` / `60` / `454` | `marginLeft 16` / `marginRight 60` / ≈453.7 (161) | match |
| Detail | Blurb | size / weight / line-height / colour | `15` / `400` / `24` / `#55534E` | `15` / `sans('400')` / `24` / `#55534E` | match |
| Detail | Blurb | box height | auto (band pinned at 508 regardless) | fixed `height: 48` + `numberOfLines={2}` so the band still lands at 508 | match |
| Detail | Blurb | text-wrap | `pretty` | `textWrap: 'pretty'` on web | match |
| Detail | Horizon band | top / height / overflow | `508` / `112` / `hidden` | 454 + 48 + `marginTop 6` = **508**, height `112`, clipped (166) | match |
| Detail | Horizon sun | box / gradient | `right 58, top 6, 66 × 66`, `rgba(243,227,196,0.9) → 0 @78%` | `Circle cx width−91 (302), cy 39, r 33`, `#F3E3C4` @0.9 → 0 @0.78 | match |
| Detail | Horizon cloud 1 | box / radius / fill / opacity | `left 52, top 16, 40 × 12` / `8` → 6 / `#FFFFFF` / `0.7` | `Rect 52,16,40,12 rx6`, opacity 0.7 | match |
| Detail | Horizon cloud 2 | box / radius / opacity | `left 72, top 9, 26 × 10` / `7` → 5 / `0.55` | `Rect 72,9,26,10 rx5`, opacity 0.55 | match |
| Detail | Horizon birds | placement | svg `24 × 9` at `right 132, top 22` → origin (237, 22) | path anchored at `width−155 (238), 29` = svg point (1,7) | match |
| Detail | Horizon birds | path / stroke / width / cap | `M1 7C3.5 3 6 3 8.5 6M14 5c2.5-4 5-4 8-1` / `#9AA9B8` / `1.6` / round | same curve in absolute coords, `T.bird` water = `#9AA9B8`, 1.6, round | match |
| Detail | Horizon foam | box / fill | `right 96, top 76, 22 × 3`, radius 2 → 1.5, `rgba(255,255,255,0.55)` | `Rect width−118, 76, 22 × 3, rx 1.5` | match |
| Detail | Far sail | shape / fill | bottom 17 `#AEB9C6`, right 11 at `left 120, top 26` → (120,43)(131,43)(120,26) | `M120 43L131 43L120 26Z`, `T.farSail` = `#AEB9C6` | match |
| Detail | Far hull | box / fill | `left 116, top 44, 18 × 3`, radius 2 → 1.5, `#8E9AA8` | `Rect 116,44,18,3 rx1.5`, `T.farHull` = `#8E9AA8` | match |
| Detail | Headland 1 | box / radius / fill | `left −60, right −60, top 52, h 170, /96` / `#E6EDF3` | `headland(-60, width+60, 52, 170, 96)`, `T.far1` | match |
| Detail | Headland 2 | box / radius / fill | `left −140, right −40, top 74, h 170, /84` / `#DAE4EE` | `headland(-140, width+40, 74, 170, 84)`, `T.far2` | match |
| Detail | Headland 3 | box / radius / fill | `left −40, right −160, top 94, h 170, /72` / `#CCDBE8` | `headland(-40, width+160, 94, 170, 72)`, `T.far3` | match |
| Detail | Horizon | z-order | sun, clouds, birds, foam, far sail, far hull, then the three headlands over them | identical order (scenes.tsx:453–469) | match |
| Detail | Count row | top / justify / gap | `650` / `center` / `7` | 508 + 112 + `marginTop 30` = **650**, `justifyContent: 'center'`, gap 7 (170) | match |
| Detail | Count dots | size / radius | `7 × 7` / `50%` | `7 × 7` / `3.5` | match |
| Detail | Count dots | fill (1st / rest) | `#131313` / `rgba(19,19,19,0.28)` | `index ? 'rgba(19,19,19,0.28)' : '#131313'` | match |
| Detail | Count dots | number | 3 (a 3-part lesson) | `Math.min(parts, 8)` — data | match |
| Detail | Count label | margin-left / size / weight / colour | `7` / `13.5` / `500` / `#8B8882` | `7` / `13.5` / `sans('500')` / `#8B8882` (177) | match |
| Detail | Count label | text | `3 short parts` | `{n} short parts` / `1 short part` | match |
| Detail | CTA pill | left / right | `16` / `16` | `paddingHorizontal: 16` (98) | match |
| Detail | CTA pill | top | `692` | pinned above the bar: `paddingBottom 25` + height 52 → top 692 when the bar starts at 769 | match |
| Detail | CTA pill | height / radius / background | `52` / `26` / `#131313` | `52` / `26` / `#131313` | match |
| Detail | CTA label | text / size / weight / colour | `Start lesson` / `17` / `600` / `#FFFFFF` | `Start lesson` / `17` / `sans('600')` / `#FFFFFF` | match |

---

## 8 · exports-Lesson Parts — Story Tracks

App: `TracksBody` (186) + `LessonScene` (scenes.tsx:257), `LessonTrail` (639), `PartRow` (259).

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Tracks | Header band | top / height | `0` / `232` | first child of the scroll, height `232` (203) | match |
| Tracks | Header band | background | `linear-gradient(180deg, #E7EEF4 0%, #EFEDE8 100%)` | `lsky-water`: `#E7EEF4` → `#EFEDE8` | match |
| Tracks | Header band | overflow | `hidden` | `overflow: 'hidden'` (273) | match |
| Tracks | Header grain | opacity / order | `0.05`, over the sky, under the art | `Grain opacity 0.05` as `children` between the Svgs | match |
| Tracks | Sun | box | `left 50%, top 26, 110 × 110, margin-left −30` → centre (221.5, 81) | `Circle cx width/2 + 25 (221.5), cy 81, r 55` | match |
| Tracks | Sun | gradient | `radial-gradient(closest-side, #F3E3C4 50%, rgba(243,227,196,0) 100%)` | stops `0 @1`, `0.5 @1`, `1 @0` | match |
| Tracks | Cloud 1 | box / radius / fill / opacity | `left 36, top 52, 44 × 13` / `8` → 6.5 / `#FFFFFF` / `0.75` | `Rect 36,52,44,13 rx6.5`, opacity 0.75 | match |
| Tracks | Cloud 2 | box / radius / opacity | `left 58, top 44, 30 × 11` / `7` → 5.5 / `0.6` | `Rect 58,44,30,11 rx5.5`, opacity 0.6 | match |
| Tracks | Birds | placement | svg `26 × 10` at `right 74, top 58` → origin (293, 58) | path anchored at `width−99 (294), 66` = svg point (1,8) | match |
| Tracks | Birds | path / stroke / width / cap | `M1 8C4 3 7 3 10 7M15 6c3-5 6-5 9-1` / `#9AA9B8` / `1.8` / round | same curve in absolute coords, `T.bird`, 1.8, round | match |
| Tracks | Headland 1 | box / radius / fill | `left −90, right −90, top 118, h 180, /90` / `#DFE8F0` | `headland(-90, width+90, 118, 180, 90)`, `T.hill1` | match |
| Tracks | Headland 2 | box / radius / fill | `left 150, right −130, top 140, h 180, /76` / `#D0DDE9` | `headland(150, width+130, 140, 180, 76)`, `T.hill2` | match |
| Tracks | Sail | shape / fill | bottom 22 `#3A3934`, right 14 at `right 118, top 112` → (261,112)(261,134)(275,134) | `M width−132 112 L width−132 134 L width−118 134 Z` | match |
| Tracks | Hull | box | `right 109, top 135, 30 × 8` → x 254 | `roundedRect(width−139 (254), 135, 30, 8, …)` | match |
| Tracks | Hull | radius | authored `3 8 10 10`, f = 8/18 → `1.333 3.556 4.444 4.444` | `3*(8/18), 8*(8/18), 10*(8/18), 10*(8/18)` | match |
| Tracks | Hull | fill | `#131313` | `#131313` | match |
| Tracks | Headland 3 | box / radius / fill | `left −60, right −60, top 168, h 160, /62` / `#C2D2E1` | `headland(-60, width+60, 168, 160, 62)`, `T.hill3` | match |
| Tracks | Foam | box / radius / fill | `right 150, top 186, 20 × 3` / `2` → 1.5 / `rgba(255,255,255,0.5)` | `Rect width−170 (223), 186, 20 × 3, rx 1.5` | match |
| Tracks | Header fade | box / gradient | `bottom 0, h 70` / `rgba(244,243,240,0) → #F4F3F0` | `Rect y 162, h 70`, `lfade` | match |
| Tracks | Back row | left / top / gap / label | `16` / `64` (app 10) / `9` / `Library` | same shared `BackRow` | match |
| Tracks | Title | left / top | `16` / `256` | `marginLeft 16` / 232 + `marginTop 24` = **256** (209) | match |
| Tracks | Title | font-size | `26` | `26` | match |
| Tracks | Title | weight | `500` | `sans('500')` | match |
| Tracks | Title | letter-spacing | `-0.3` | `-0.1` | **MISMATCH** |
| Tracks | Title | colour | `#1D1C1A` | `#1D1C1A` | match |
| Tracks | Title | wrapping | `white-space: nowrap` | `numberOfLines={1}` | match |
| Tracks | Meta row | left / top | `16` / `302` | `marginLeft 16`; 256 + line box (≈31 at 26pt) + `marginTop 15` ≈ 302 (212) | match |
| Tracks | Meta row | gap / inner gap | `18` / `7` | `18` / `7` | match |
| Tracks | Meta · minutes | `7 min`, 14 / 500 / `#8B8882` | as Story Detail | identical component | match |
| Tracks | Meta · where | `Week 1 · Foundations`, 14 / 500 / `#8B8882` | as Story Detail | identical component | match |
| Tracks | Trail | top / justify / gap | `344` / `center` / `11` | 302 + meta (≈16.7) + `marginTop 25` ≈ 343.7; `justifyContent: 'center'`, gap 11 (214, 648) | match |
| Tracks | Trail dots | sizes | `7, 8, 8, 7` | `7, 8, 8, 7` | match |
| Tracks | Trail dots | margin-top | `6, −4, 5, −3` | `6, −4, 5, −3` | match |
| Tracks | Trail dots | fills | `#C3CEDA, #B2C1D0, #B2C1D0, #C3CEDA` | `pip1, pip2, pip2, pip1` (water) = same four | match |
| Tracks | Part rows | left / right | `16` / `16` | `paddingHorizontal: 16` (218) | match |
| Tracks | Part row 1 | top | `392` | 343.7 + trail box 13 + `marginTop 35` ≈ 391.7 | match |
| Tracks | Part rows | pitch | `62` (392, 454, 516, 578, 640) | height 44 + `marginTop 18` = 62 (263) | match |
| Tracks | Part row | height / align / gap | `44` / `center` / `16` | `44` / `center` / `16` | match |
| Tracks | Disc | size / radius | `36 × 36` / `50%` | `36 × 36` / `18` (265) | match |
| Tracks | Disc · done | background | `#131313` | `#131313` | match |
| Tracks | Disc · done | tick svg / viewBox | `14 × 11` / `0 0 16 13` | `14 × 11` / `0 0 16 13` (275) | match |
| Tracks | Disc · done | path / stroke / width / caps | `M1.5 7l4.4 4.5L14.5 1.5` / `#F4F3F0` / `2.6` / round | identical | match |
| Tracks | Disc · current | background | `#E7EEF4` | `tintTones(tint).disc` = water `#E7EEF4` | match |
| Tracks | Disc · current | shadow | `0 0 0 1px rgba(0,0,0,0.07)` | `'0 0 0 1px rgba(0,0,0,0.07)'` (272) | match |
| Tracks | Disc · current | caret svg / viewBox / margin | `12 × 15` / `0 0 18 22` / `margin-left: 3` | `12 × 15` / `0 0 18 22` / `marginLeft: 3` (279) | match |
| Tracks | Disc · current | caret path / fill | `M3 2v18L16.5 11z` / `#131313` | identical | match |
| Tracks | Disc · ahead | background / caret fill | `rgba(0,0,0,0.05)` / `#8B8882` | `rgba(0,0,0,0.05)` / `#8B8882` | match |
| Tracks | Part label | size / weight | `16` / `500` | `16` / `sans('500')` (284) | match |
| Tracks | Part label | colour done/current | `#1D1C1A` | `#1D1C1A` | match |
| Tracks | Part label | colour ahead | `#8B8882` | `#8B8882` | match |
| Tracks | Part label | text | `Part I: …` … `Part V: Try the tool` | `Part {numeral}: {headline}`, closing row `Try the tool` (307) | match |
| Tracks | Part states | which row is current | 3 done, row 4 current, row 5 ahead | `reached = done ? all : started ? 1 : 0` — any open lesson marks only Part I done | match (data model, not a drawn property) |
| Tracks | CTA pill | left / right / top | `16` / `16` / `704` | `paddingHorizontal 16`; `paddingBottom 17` + height 48 → top 704 above a bar starting at 769 | match |
| Tracks | CTA pill | height / radius / background | `48` / `24` / `#131313` | `48` / `24` / `#131313` | match |
| Tracks | CTA label | text / size / weight / colour | `Continue — Part IV` / `16.5` / `600` / `#FFFFFF` | `Continue — {next.number}` / `16.5` / `sans('600')` / `#FFFFFF` | match |

---

## 9 · The tab bar drawn on both lesson frames

Drawn by `src/components/StoicTabBar.tsx` — a shared component outside the four named app
files, but it is on these two frames, so it is measured here.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Detail, Tracks | Bar | top / height | `769` → height `83` | `TAB_BAR_CONTENT 63 + max(bottom inset, 20)` = 83 at inset ≤ 20; 97 on a 34pt inset | match at the canvas's implied inset |
| Detail, Tracks | Bar | background | `#FFFFFF` | `rgba(255,255,255,0.95)` | **MISMATCH** |
| Detail, Tracks | Bar | z-index | `16` (over the pill) | rendered after the scroll and the pill | match |
| Detail, Tracks | Tabs | count | 3 (Home, Log, Library) | 4 (Home, Log, Library, All) | **MISMATCH** (documented departure, StoicTabBar:19–24) |
| Detail, Tracks | Tabs | centres | `70`, `196`, `318` | `12.5% / 37.5% / 62.5% / 87.5%` = 49.1, 147.4, 245.6, 343.9 @393 | **MISMATCH** |
| Detail, Tracks | Tab label boxes | width | `44`, `52`, `60` | `60`, `60`, `66`, `60` | **MISMATCH** |
| Detail, Tracks | Glyph | top | `14` | `14` | match |
| Detail, Tracks | Glyph | box height | `30` | `29` | **MISMATCH** |
| Detail, Tracks | Glyph · Home | drawing | 16 × 30 r3 `#E0DFDA` panel + 4 × 22 r2 `#C6C5C0` edge, in a 26 × 30 box | arched door `M4.5 24 L4.5 10 Q4.5 2 12 2 Q19.5 2 19.5 10 L19.5 24 Z` + 1.7 dot, 30 × 29 of `0 0 24 26` | **MISMATCH** |
| Detail, Tracks | Glyph · Log | drawing | svg `24 × 30` of `0 0 26 30`; rect `4,3,18,24 r3` `#C6C5C0`; lines `M9 10.5h8M9 15.5h8M9 20.5h5` `#FFFFFF` w2.4 @0.95 | svg `30 × 29` of `0 0 24 26`; rect `4.5,2,15,22 r3`; lines `M8.5 8.5h7M8.5 13h7M8.5 17.5h4.5` w2.2 @0.95 | **MISMATCH** |
| Detail, Tracks | Glyph · Library | drawing | four bars 6 wide, heights 24/26/26/26, gap 3, first `rotate(-9deg)`, `#3A3934` | three bars 4.4 wide, 21 tall, r1.8, no rotation, `colors.textTitle #2A2924` | **MISMATCH** |
| Detail, Tracks | Label | margin-top / size / weight | `5` / `13` / `500` | `5` / `13` / `sans('500')` | match |
| Detail, Tracks | Label | colour inactive / active | `#8B8882` / `#2A2924` | `colors.textSoft #8B8882` / `colors.textTitle #2A2924` | match |
| Detail, Tracks | Active tab | which | Library | `pathname.startsWith('/lesson')` matches `/lesson-overview/…` → Library lit | match |

---

## Findings

Rows written: **443** — 418 match, **10 MISMATCH**, **13 `MISMATCH*`** rows covering 12
blurred elements, 1 `n/a` (the status bar the app never builds), and 1 note row (the
five-grounds screen is drawn correctly but not routed, item 11 below).

### MISMATCH — differences the app can close

1. **Story Tracks title letter-spacing.** `src/app/lesson-overview/[slug].tsx:209` —
   current `letterSpacing: -0.1`; design `letter-spacing:-0.3px`
   (`exports-Lesson Parts/Story-Tracks.html:221`). The sibling Story Detail title at 27px
   uses −0.3 in both design and app, so this is the odd one out. No frame in
   `.uifinal/pretty/final` pairs a 26px lesson title with −0.1.

2. **Story Detail cover drawing origin.** `src/components/lesson/scenes.tsx:371` —
   `const g = width / 2 - 120` gives **76.5** at the 393 canvas width; design pins the
   240 × 170 drawing at `left:76px` (`Story-Detail.html:42`). Everything inside it (both
   moons, the warm halo, the three water lines, hull, mast, both sails, both clouds) carries
   the same 0.5 offset.

3. **Tab bar background.** `src/components/StoicTabBar.tsx:88` — current
   `rgba(255,255,255,0.95)`; design `#FFFFFF` (`Story-Detail.html:492`,
   `Story-Tracks.html:502`).

4. **Tab bar tab count.** `StoicTabBar.tsx:38–43` — four tabs (Home, Log, Library, All);
   both frames draw three. The fourth is a deliberate, commented addition.

5. **Tab bar centres.** `StoicTabBar.tsx:38–43` — `12.5/37.5/62.5/87.5%` = 49.1 / 147.4 /
   245.6 / 343.9 at 393; design centres are 70 / 196 / 318 (`left 48 w 44`, `left 170 w 52`,
   `left 288 w 60`).

6. **Tab bar label-box widths.** current `60, 60, 66, 60`; design `44, 52, 60`.

7. **Tab bar glyph box height.** `StoicTabBar.tsx:100` — current `29`; design `30` on all
   three tabs.

8. **Home glyph geometry.** `StoicTabBar.tsx:113` — an arched door in a `0 0 24 26` viewBox
   at 30 × 29; design is a 16 × 30 `#E0DFDA` panel plus a 4 × 22 `#C6C5C0` edge in a 26 × 30
   box (`Story-Detail.html:508–527`).

9. **Log glyph geometry.** `StoicTabBar.tsx:122` — rect `4.5,2,15,22`, rules
   `M8.5 8.5h7M8.5 13h7M8.5 17.5h4.5` at stroke 2.2, rendered 30 × 29 of `0 0 24 26`; design
   rect `4,3,18,24`, rules `M9 10.5h8M9 15.5h8M9 20.5h5` at stroke 2.4, rendered 24 × 30 of
   `0 0 26 30` (`Story-Detail.html:545–553`).

10. **Library glyph geometry.** `StoicTabBar.tsx:131` — three 4.4-wide bars, r1.8, none
    rotated, fill `#2A2924`; design four 6-wide bars (heights 24/26/26/26, gap 3), the first
    `rotate(-9deg)`, fill `#3A3934` (`Story-Detail.html:577–605`).

11. **`CampaignGrounds` is unreachable.** `src/components/journey/JourneyScreens.tsx:725` —
    the whole five-grounds screen (the `exports-Journey Campaign` frame, plus
    `GroundCardArt` and `GroundInterludeArt` in `WorldCardArt.tsx`) is exported but no route
    renders it; `grep -rn CampaignGrounds src/` returns only the definition and one comment.
    Every property of it audited above matches, so this is a wiring gap, not a drawing one.

### MISMATCH\* — CSS the app cannot express

All twelve elements below (13 rows — the Chapter I halo is scored on both its gradient and
its filter) fail on `filter: blur`, which `react-native-svg` has no equivalent for.

| # | Frame · element | Design | App substitution |
|---|---|---|---|
| 1 | Ch I · sun halo | `blur(4px)` on a 2-stop radial `rgba(226,186,120,0.42) → 0 @74%` | third stop at 0.4 carrying α × 0.58 = 0.2436 (a true 2-stop ramp reads 0.193 there) — `WorldArt.tsx:193` |
| 2 | Ch I · hull shadow | flat `rgba(0,0,0,0.09)` + `blur(4px)` | `shade` radial 1 → 0.86@0.55 → 0, × opacity 0.09 — `WorldArt.tsx:198` |
| 3 | Ch I · mast shadow | flat `rgba(0,0,0,0.08)` + `blur(3px)` | same `shade` radial × 0.08 |
| 4 | Ch II · sun halo | `blur(4px)`, α 0.42 | same mid-stop treatment |
| 5 | Ch II · wake | flat `rgba(40,60,90,0.14)` + `blur(4px)` | `wake` radial on `#283C5A`, × 0.14 — `WorldArt.tsx:203` |
| 6 | Ch III · sun halo | `blur(4px)`, α 0.4 | mid stop 0.232 |
| 7 | Ch III · pole shadow | flat `rgba(0,0,0,0.10)` + `blur(3px)` | `shade` radial × 0.1 |
| 8 | Ch IV · sun halo | `blur(4px)`, α 0.45 | mid stop 0.261 |
| 9 | Ch IV · lamp beam | `blur(2px)` on a 90° linear fade | none — the beam is drawn hard-edged (`WorldArt.tsx:167`) |
| 10 | Ch IV · lamp shadow | flat `rgba(0,0,0,0.10)` + `blur(4px)` | `shade` radial × 0.1 |
| 11 | Story Detail · moon glow | `blur(6px)` on `rgba(255,244,214,0.55) → 0 @72%` | none — radial drawn as authored (`scenes.tsx:389`) |
| 12 | Story Detail · warm halo | `blur(4px)` on `rgba(226,186,120,0.4) → 0 @74%` | none — radial drawn as authored (`scenes.tsx:393`) |

In every blurred case the shape's box, centre and centre alpha are exact; only the edge
spread past the box is lost.

### Notes carried alongside the table (not mismatches)

- Vertical positions that ride on a text line box — Story Detail's meta (414) and blurb
  (454), Story Tracks' meta (302), trail (344) and first part row (392) — land within ~0.3pt
  of the design when SF Pro's natural leading is applied. They are stacked with margins
  rather than absolute tops, so they will move if a future `AppText` change reintroduces
  variant leading.
- `JourneyChapter` clamps its body to `max(798, height − insets.top)`; on a phone whose top
  inset is 59 rather than the canvas's 54 the closing land band runs 5pt past the viewport.
  That is the canvas-to-device gap, not a value difference.
- Chapter row states, the `×{waves}` and `Day {n} of 30` metas, the Story Detail part count
  and the Story Tracks `reached` index are all data-derived; each of the three drawn states
  (done / current / locked, and done / current / ahead) matches the frames exactly.
