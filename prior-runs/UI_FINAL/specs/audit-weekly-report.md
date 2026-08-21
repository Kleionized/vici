# Property audit — Report Ready + Weekly Report (031–033)

**Frames audited (read in full, pretty + raw cross-checked):**

| Frame | Pretty | Raw | decls |
|---|---|---|---|
| Report-Ready | `.uifinal/pretty/final/Email Login/Report-Ready.html` | `.uifinal/final/Email Login/Report-Ready.html` | 173 |
| Weekly-Report | `.uifinal/pretty/final/Email Login/Weekly-Report.html` | `.uifinal/final/Email Login/Weekly-Report.html` | 231 |
| Weekly-Report-Days | `.uifinal/pretty/final/Email Login/Weekly-Report-Days.html` | `.uifinal/final/Email Login/Weekly-Report-Days.html` | 294 |
| Weekly-Report-Urges | `.uifinal/pretty/final/Email Login/Weekly-Report-Urges.html` | `.uifinal/final/Email Login/Weekly-Report-Urges.html` | 263 |

Raw declaration count == pretty declaration count on all four, so the pretty reformat dropped nothing. Every SVG attribute was re-extracted from the **raw** files and compared against the app verbatim.

**App files read in full:**
- `/Users/admin/Documents/tideline/src/app/report-ready.tsx` (193 lines)
- `/Users/admin/Documents/tideline/src/app/weekly-report.tsx` (595 lines)
- supporting: `/Users/admin/Documents/tideline/src/lib/theme.ts`, `/Users/admin/Documents/tideline/src/lib/weeklyReport.ts`, `/Users/admin/Documents/tideline/src/components/ui/AppText.tsx`, `/Users/admin/Documents/tideline/src/components/ui/Grain.tsx`, `/Users/admin/Documents/tideline/src/components/ui/press-scale.tsx`

**Coordinate rule.** Every frame is 393 × 852 and its `top` values include a 54px status bar the app never builds. App-equivalent top = canvas top − 54. Both are given in every offset row below, written `canvas N → app N−54`.

There is no global stylesheet in `.uifinal` (checked: no `.css`, no `index.html`), so every frame is self-contained inline style and the CSS box model defaults to **content-box** except where a rule declares `box-sizing:border-box`. This matters for the urge rows (§E) and is handled correctly by the app.

**Legend.** `MISMATCH` = a difference the app can close. `MISMATCH*` = the CSS has no React Native expression (`filter: blur`, `text-wrap`), row states what the app substitutes.

---

## A · Report-Ready → `src/app/report-ready.tsx`

### A1 · Frame / field

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Report-Ready | frame | width × height | 393 × 852 | device viewport (393 on the reference device) | match |
| Report-Ready | frame | background | `#F4F3F0` | `colors.bg` = `#F4F3F0` (theme.ts:29), line 33 | match |
| Report-Ready | frame | position / overflow | `relative` / `hidden` | root `View flex:1`; screen clips natively | match (n/a) |
| Report-Ready | frame | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | iOS `System`; web `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif` (theme.ts:159–189) | match — first entry identical, resolves to SF Pro on target; fallback tail differs (web only) |
| Report-Ready | frame | -webkit-font-smoothing | `antialiased` | `AppText` sets `WebkitFontSmoothing:'antialiased'` on web (AppText.tsx:126) | match |
| Report-Ready | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | not drawn | match (n/a — canvas mockup chrome, not app chrome) |
| Report-Ready | status bar row | height / padding / z-index / glyphs | 54px, `6px 32px 0 46px`, z 20, 3 SVGs | not built | n/a per brief |
| Report-Ready | noise overlay | position / inset | `absolute` / `0` | `Grain` wrapper `absolute top/left/right/bottom 0` (Grain.tsx:16) | match |
| Report-Ready | noise overlay | background-image | `url('noise-dark.png')`, no `background-size` → tiles at natural 96 × 96 | `require('assets/images/noise-dark.png')` + `resizeMode="repeat"` (Grain.tsx:17) | match |
| Report-Ready | noise overlay | opacity | `0.07` | `0.07` (line 37) | match |
| Report-Ready | noise overlay | pointer-events | `none` | `pointerEvents="none"` | match |
| Report-Ready | noise overlay | z-order | 1st child of frame | 1st child of root (line 37) | match |

### A2 · Ambient washes

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Report-Ready | wash container | position / inset / overflow / pointer-events | `absolute` / `0` / `hidden` / `none` | `absolute`, `top/left/right/bottom 0`, `overflow:'hidden'`, `pointerEvents="none"` (line 40) | match |
| Report-Ready | wash container | z-order | after noise, before status bar | after `Grain` (line 40) | match |
| Report-Ready | top wash | left | `-15%` → −58.95 @393 | `-width*0.15` = −58.95 (line 42) | match |
| Report-Ready | top wash | top | `-190px` (frame-anchored, not status-bar-relative) | `-190` (line 42) | match |
| Report-Ready | top wash | width | `130%` → 510.9 @393 | `width*1.3` = 510.9 (line 42) | match |
| Report-Ready | top wash | height | `300px` | `300` (line 42) | match |
| Report-Ready | top wash | border-radius | `50%` (ellipse clip) | `Ellipse rx=255.45 ry=150` (line 50) | match |
| Report-Ready | top wash | gradient shape/extent | `radial-gradient(closest-side, …)` → rx 255.45, ry 150 | `RadialGradient cx 50% cy 50% rx 50% ry 50%` on a 510.9 × 300 Svg → rx 255.45, ry 150 (line 44) | match |
| Report-Ready | top wash | stop 0 | `rgba(180,170,150,0.32)` @0 | `#B4AA96` opacity `0.32` @0 — `#B4AA96` = rgb(180,170,150) (line 45) | match |
| Report-Ready | top wash | stop 1 | `rgba(180,170,150,0.1)` @55% | `#B4AA96` opacity `0.1` @0.55 (line 46) | match |
| Report-Ready | top wash | stop 2 | `rgba(180,170,150,0)` @75% | `#B4AA96` opacity `0` @0.75 (line 47) | match |
| Report-Ready | top wash | **filter** | `blur(5px)` | none | **MISMATCH\*** — RN-SVG has no blur filter; app substitutes the gradient's own falloff. Alpha is already 0 at 75% of the radius so the blurred spread beyond the box is negligible. |
| Report-Ready | bottom wash | left / margin-left | `50%` / `-260px` | `left:'50%'`, `marginLeft:-260` (line 52) | match |
| Report-Ready | bottom wash | bottom | `-260px` | `bottom:-260` (line 52) | match |
| Report-Ready | bottom wash | width × height | `520 × 520` | `520 × 520` (line 52) | match |
| Report-Ready | bottom wash | border-radius | `50%` | `Ellipse rx=260 ry=260` (line 60) | match |
| Report-Ready | bottom wash | gradient extent | `closest-side` on 520 × 520 → r 260 | `rx 50% ry 50%` → 260 (line 54) | match |
| Report-Ready | bottom wash | stop 0 | `rgba(255,236,196,0.4)` @0 | `#FFECC4` opacity `0.4` @0 — `#FFECC4` = rgb(255,236,196) (line 55) | match |
| Report-Ready | bottom wash | stop 1 | `rgba(255,236,196,0.18)` @45% | `#FFECC4` opacity `0.18` @0.45 (line 56) | match |
| Report-Ready | bottom wash | stop 2 | `rgba(255,236,196,0)` @72% | `#FFECC4` opacity `0` @0.72 (line 57) | match |
| Report-Ready | bottom wash | filter | none declared | none | match |

### A3 · Close control

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Report-Ready | close X | position | `absolute; right:20px` | `right:20` (line 74) | match |
| Report-Ready | close X | top | canvas `66` → app `12` | `top:12` (line 74) | match |
| Report-Ready | close X | svg width/height | `18` / `18` | `18` / `18` (line 75) | match |
| Report-Ready | close X | viewBox | `0 0 18 18` | `0 0 18 18` (line 75) | match |
| Report-Ready | close X | path `d` | `M3 3l12 12M15 3L3 15` | `M3 3l12 12M15 3L3 15` (line 76) | match |
| Report-Ready | close X | stroke | `#55534E` | `#55534E` | match |
| Report-Ready | close X | stroke-width | `2.2` | `2.2` | match |
| Report-Ready | close X | stroke-linecap | `round` | `round` | match |
| Report-Ready | close X | hit target | none declared (`cursor` absent) | `hitSlop 18` all sides, `minHeight:0` overriding PressScale's 44 | match (n/a — app affordance) |

### A4 · Report art — container + light

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Report-Ready | art container | left / margin-left | `50%` / `-130px` | `left:'50%'`, `marginLeft:-130` (line 126) | match |
| Report-Ready | art container | top | canvas `150` → app `96` | `top:96` (line 126) | match |
| Report-Ready | art container | width × height | `260 × 280` | `260 × 280` (line 126) | match |
| Report-Ready | art container | overflow | not declared → `visible` | RN default `visible` | match |
| Report-Ready | back glow | left / top | `44` / `16` (container-relative) | `left:44, top:16` (line 128) | match |
| Report-Ready | back glow | width × height | `172 × 172` | `172 × 172` (line 128) | match |
| Report-Ready | back glow | border-radius | `50%` | `Ellipse rx=86 ry=86` (line 135) | match |
| Report-Ready | back glow | gradient extent | `closest-side` on 172 × 172 → r 86 | `rx 50% ry 50%` → 86 (line 130) | match |
| Report-Ready | back glow | stop 0 | `rgba(226,186,120,0.46)` @0 | `#E2BA78` opacity `0.46` @0 — `#E2BA78` = rgb(226,186,120) (line 131) | match |
| Report-Ready | back glow | stop 1 | `rgba(226,186,120,0)` @74% | `#E2BA78` opacity `0` @0.74 (line 132) | match |
| Report-Ready | back glow | **filter** | `blur(5px)` | none | **MISMATCH\*** — substitutes the gradient falloff; alpha reaches 0 at r 63.64 of 86, so the 5px spread has nothing to carry outward. Additionally the RN `<Svg>` clips at 172 × 172 where CSS would spread ~5px past it. |
| Report-Ready | contact shadow | left / top | `52` / `248` (container-relative) | `left:52, top:248` (line 139) | match |
| Report-Ready | contact shadow | width × height | `156 × 15` | `156 × 15` (line 139) | match |
| Report-Ready | contact shadow | border-radius | `50%` | `Ellipse rx=78 ry=7.5` (line 147) | match |
| Report-Ready | contact shadow | **fill** | **solid** `rgba(0,0,0,0.10)` (flat, no gradient) | 3-stop radial: `#000` @0.10 → `#000` @0.05 (0.6) → `#000` @0 (1.0) (lines 141–145) | **MISMATCH\*** — the design's flat disc is feathered by `filter: blur(6px)`; RN has no blur, so the app bakes the feather into the fill. |
| Report-Ready | contact shadow | **filter** | `blur(6px)` | none | **MISMATCH\*** — CSS blur spreads the 156 × 15 disc to roughly 168 × 27 of soft ink (parent has no `overflow:hidden`); the RN `<Svg>` hard-clips at 156 × 15, so the app's shadow is both narrower and shorter than the design's rendered result. |

### A5 · Report art — the sheet

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Report-Ready | sheet | left / top | `70` / `44` (container-relative) | `left:70, top:44` (line 152–154) | match |
| Report-Ready | sheet | width × height | `120 × 164` | `120 × 164` | match |
| Report-Ready | sheet | border-radius | `9px` (all four corners) | `borderRadius:9` | match |
| Report-Ready | sheet | background | `#FFFFFF` | `#FFFFFF` | match |
| Report-Ready | sheet | box-shadow (hairline) | `0 0 0 1px rgba(0,0,0,0.07)` | `0 0 0 1px rgba(0,0,0,0.07)` (line 159) | match |
| Report-Ready | sheet | box-shadow (lift) | `0 18px 36px rgba(40,38,32,0.16)` | `0 18px 36px rgba(40,38,32,0.16)` (line 159) | match |
| Report-Ready | sheet | transform | `rotate(2.5deg)` | `[{ rotate: '2.5deg' }]` (line 160) | match |
| Report-Ready | sheet | overflow | `hidden` | `overflow:'hidden'` (line 161) | match |
| Report-Ready | sheet grain | inset / opacity | `0` / `0.05` | `Grain opacity 0.05` (line 163) | match |
| Report-Ready | sheet grain | z-order | 1st child of sheet | 1st child of sheet | match |
| Report-Ready | title bar 1 | left/top/w/h | `14 / 14 / 44 / 5` | `14 / 14 / 44 / 5` (line 165) | match |
| Report-Ready | title bar 1 | border-radius / background | `3px` / `#E0DFDA` | `3` / `#E0DFDA` | match |
| Report-Ready | title bar 2 | left/top/w/h | `14 / 26 / 28 / 5` | `14 / 26 / 28 / 5` (line 166) | match |
| Report-Ready | title bar 2 | border-radius / background | `3px` / `#EAE8E1` | `3` / `#EAE8E1` | match |
| Report-Ready | sparkline | position | `left:14; top:46` | `left:14, top:46` (line 168) | match |
| Report-Ready | sparkline | svg width/height/viewBox | `92` / `64` / `0 0 92 64` | `92` / `64` / `0 0 92 64` (line 168) | match |
| Report-Ready | sparkline area | path `d` | `M2 54 C20 50 34 42 50 32 C64 23 78 14 90 8 L90 64 L2 64 Z` | identical verbatim (line 169) | match |
| Report-Ready | sparkline area | fill | `rgba(19,19,19,0.08)` | `rgba(19,19,19,0.08)` | match |
| Report-Ready | sparkline stroke | path `d` | `M2 54 C20 50 34 42 50 32 C64 23 78 14 90 8` | identical verbatim (line 170) | match |
| Report-Ready | sparkline stroke | stroke / width / fill / linecap | `#131313` / `2.2` / `none` / `round` | `#131313` / `2.2` / `none` / `round` | match |
| Report-Ready | sparkline dot | cx/cy/r/fill | `90` / `8` / `3.4` / `#131313` | `90` / `8` / `3.4` / `#131313` (line 171) | match |
| Report-Ready | body bar 1 | left/top/w/h/radius/bg | `14 / 122 / 60 / 4 / 2 / #EAE8E1` | identical (line 174) | match |
| Report-Ready | body bar 2 | left/top/w/h/radius/bg | `14 / 132 / 48 / 4 / 2 / #EFEDE6` | identical (line 175) | match |
| Report-Ready | seal | right / bottom | `12` / `12` | `right:12, bottom:12` (line 177) | match |
| Report-Ready | seal | width × height | `26 × 26` | `26 × 26` (line 177) | match |
| Report-Ready | seal | border-radius | `50%` | `Circle cx13 cy13 r13` (line 187) | match |
| Report-Ready | seal | gradient shape / centre | `circle at 38% 30%` → (9.88, 7.80) | `cx="38%" cy="30%"` → (9.88, 7.80) (line 181) | match |
| Report-Ready | seal | gradient extent | implicit `farthest-corner` → 24.3124 (93.5094% of the 26 normalised diagonal) | `rx/ry = 93.5%` → 24.3100 (line 181) | match — 0.0024px short of the literal; sub-pixel, documented in the app's own comment |
| Report-Ready | seal | stop 0 | `#F0DBB4` @0 | `#F0DBB4` @0 (line 182) | match |
| Report-Ready | seal | stop 1 | `#E2BA78` @70% | `#E2BA78` @0.7 (line 183) | match |
| Report-Ready | seal | stop past 70% | CSS holds the last stop → `#E2BA78` | explicit `#E2BA78` @1 (line 184) | match |

### A6 · Copy and actions

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Report-Ready | headline | left / right | `36` / `36` | `left:36, right:36` (line 84) | match |
| Report-Ready | headline | top | canvas `472` → app `418` | `top:418` (line 84) | match |
| Report-Ready | headline | text-align | `center` | `center` prop → `textAlign:'center'` (line 83) | match |
| Report-Ready | headline | font-size | `24px` | `24` | match |
| Report-Ready | headline | font-weight | `500` | `sans('500')` → `fontWeight:'500'` | match |
| Report-Ready | headline | line-height | `32px` | `32` | match |
| Report-Ready | headline | letter-spacing | `-0.1px` | `-0.1` | match |
| Report-Ready | headline | color | `#1D1C1A` | `#1D1C1A` | match |
| Report-Ready | headline | **text-wrap** | `balance` | `pretty` on web (AppText.tsx:128, variant `body`); no equivalent on native | **MISMATCH\*** — native RN has no `text-wrap`; on web the app emits `pretty` where the canvas asks for `balance`, so a 2-line break can land differently. |
| Report-Ready | headline | copy | `Your weekly report is ready.` | `Your weekly report is ready.` | match |
| Report-Ready | subline | left / right | `44` / `44` | `left:44, right:44` (line 87) | match |
| Report-Ready | subline | top | canvas `522` → app `468` | `top:468` | match |
| Report-Ready | subline | text-align | `center` | `center` prop | match |
| Report-Ready | subline | font-size | `15.5px` | `15.5` | match |
| Report-Ready | subline | font-weight | `400` | `sans('400')` | match |
| Report-Ready | subline | line-height | `23px` | `23` | match |
| Report-Ready | subline | letter-spacing | not declared → `normal` | dropped by AppText (own `fontSize`, no own `letterSpacing` → variant tracking deleted, AppText.tsx:138) | match |
| Report-Ready | subline | color | `#55534E` | `#55534E` | match |
| Report-Ready | subline | text-wrap | `pretty` | `pretty` on web | match |
| Report-Ready | subline | copy | `Score, urges, and the pattern — two quiet minutes.` (`&mdash;`) | `Score, urges, and the pattern — two quiet minutes.` (U+2014) | match |
| Report-Ready | CTA pill | left / right | `24` / `24` | `left:24, right:24` (line 96–97) | match |
| Report-Ready | CTA pill | top | canvas `688` → app `634` | `top:634` (line 98) | match |
| Report-Ready | CTA pill | height | `56px` | `56` | match |
| Report-Ready | CTA pill | border-radius | `28px` | `28` | match |
| Report-Ready | CTA pill | background | `#131313` | `#131313` | match |
| Report-Ready | CTA pill | align-items / justify-content | `center` / `center` | `center` / `center` | match |
| Report-Ready | CTA pill | min-height | n/a | PressScale's `minHeight:44` is overridden by the explicit `height:56` | match |
| Report-Ready | CTA label | font-size / weight | `17px` / `600` | `17` / `sans('600')` (line 105) | match |
| Report-Ready | CTA label | letter-spacing | `0.2px` | `0.2` | match |
| Report-Ready | CTA label | color | `#FFFFFF` | `#FFFFFF` | match |
| Report-Ready | CTA label | copy | `Open the report` | `Open the report` | match |
| Report-Ready | Later | left / right | `0` / `0` | `left:0, right:0` (line 111) | match |
| Report-Ready | Later | top | canvas `764` → app `710` | `top:710` | match |
| Report-Ready | Later | text-align | `center` | `alignItems:'center'` on the wrapper | match |
| Report-Ready | Later | font-size / weight / color | `15px` / `500` / `#8B8882` | `15` / `sans('500')` / `#8B8882` (line 112) | match |
| Report-Ready | Later | copy | `Later` | `Later` | match |
| Report-Ready | paint order | z-order | noise → washes → status bar (z20) → X → art → headline → subline → CTA → Later | Grain → washes → X → art → headline → subline → CTA → Later | match |

---

## B · Standing header — identical across Weekly-Report, -Days, -Urges

Three separate 393 × 852 frames in the canvas; one floated header over a horizontally-paged `ScrollView` in the app (`weekly-report.tsx:127–162`). Every row below was verified byte-for-byte identical in all three frames' raw HTML.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 3 | frame | width × height / background | `393 × 852` / `#F4F3F0` | viewport / `colors.bg` = `#F4F3F0` (line 121) | match |
| all 3 | frame | font-family / smoothing | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` / `antialiased` | `System` (iOS) / `antialiased` on web | match (fallback tail differs on web only) |
| all 3 | frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | not drawn | match (n/a — mockup chrome) |
| all 3 | noise | inset / image / opacity / pointer-events | `0` / `noise-dark.png` tiled / `0.07` / `none` | `Grain` inset 0, `resizeMode="repeat"`, `0.07`, `pointerEvents="none"` (line 123) | match |
| all 3 | status bar | height / padding / z-index / glyphs | 54px, `6px 32px 0 46px`, z 20, 3 SVGs | not built | n/a per brief |
| all 3 | back row | left | `16` | `left:16` (line 179) | match |
| all 3 | back row | top | canvas `64` → app `10` | `top:10` (line 179) | match |
| all 3 | back row | display / align-items / gap | `flex` / `center` / `9px` | `flexDirection:'row'` / `alignItems:'center'` / `gap:9` | match |
| all 3 | back chevron | svg width / height / viewBox | `11` / `19` / `0 0 11 19` | `11` / `19` / `0 0 11 19` (line 180) | match |
| all 3 | back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | `M9.5 1.5L2 9.5l7.5 8` (line 181) | match |
| all 3 | back chevron | fill / stroke / width / linecap / linejoin | `none` / `#55534E` / `2.4` / `round` / `round` | `none` / `#55534E` / `2.4` / `round` / `round` | match |
| all 3 | back label | font-size / weight / color | `17px` / `400` / `#55534E` | `17` / `sans('400')` / `#55534E` (line 183) | match |
| all 3 | back label | copy | `Back` | `Back` (or `Settings` when `?from=settings` — a different frame, 93D, out of scope) | match |
| all 3 | week label | right | `20` | `right:20` (line 146) | match |
| all 3 | week label | top | canvas `68` → app `14` | `top:14` (line 146) | match |
| all 3 | week label | font-size / weight / color | `14px` / `500` / `#8B8882` | `14` / `sans('500')` / `#8B8882` | match |
| all 3 | week label | copy | `Jul 14–20` (`&ndash;`) | `report.label`, built as `${MONTH} ${d}–${d}` with U+2013 (weeklyReport.ts:88) | match |
| all 3 | title | left | `24` | `left:24` (line 147) | match |
| all 3 | title | top | canvas `114` → app `60` | `top:60` (line 147) | match |
| all 3 | title | font-size / weight | `27px` / `600` | `27` / `sans('600')` | match |
| all 3 | title | line-height | `1` → 27px box | `lineHeight:27` | match |
| all 3 | title | letter-spacing / color | `-0.2px` / `#1D1C1A` | `-0.2` / `#1D1C1A` | match |
| all 3 | title | copy | `Weekly report` | `Weekly report` | match |
| all 3 | subtitle | left | `24` | `left:24` (line 150) | match |
| all 3 | subtitle | top | canvas `157` → app `103` | `top:103` | match |
| all 3 | subtitle | font-size / weight / color | `14.5px` / `400` / `#8B8882` | `14.5` / `sans('400')` / `#8B8882` | match |
| all 3 | subtitle | copy | `Your week at a glance` | `Your week at a glance` | match |

### B1 · Desk lamp (`DeskLamp`, weekly-report.tsx:197–232)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 3 | lamp container | right | `16` | `right:16` (line 200) | match |
| all 3 | lamp container | top | canvas `100` → app `46` | `top:46` (line 200) | match |
| all 3 | lamp container | width × height | `88 × 78` | `88 × 78` | match |
| all 3 | lamp glow | box | separate `<div>` at `left:4; top:-2; 56 × 56; border-radius:50%` → centre (32, 26), r 28 | `<Ellipse cx=32 cy=26 rx=28 ry=28>` inside the lamp Svg (line 217) | match on geometry |
| all 3 | lamp glow | gradient extent | `closest-side` on 56 × 56 → r 28 | `rx 50% ry 50%` → 28 | match |
| all 3 | lamp glow | stop 0 | `rgba(226,186,120,0.45)` @0 | `#E2BA78` opacity `0.45` @0 (line 212) | match |
| all 3 | lamp glow | stop 1 | `rgba(226,186,120,0)` @74% | `#E2BA78` opacity `0` @0.74 (line 213) | match |
| all 3 | lamp glow | z-order | before the lamp `<svg>` → behind | first shape drawn inside the Svg → behind | match |
| all 3 | lamp glow | **filter** | `blur(3px)` | none | **MISMATCH\*** — no RN-SVG blur; substitutes the radial falloff. |
| all 3 | lamp glow | **clipping** | free `<div>` in a container with no `overflow:hidden` — the `top:-2` band renders | re-hosted inside the `88 × 78` Svg, which clips at y = 0, cutting the glow's top 2px | **MISMATCH\*** (same substitution) — at r 26–28 the gradient alpha is already 0 (it reaches 0 at r 20.72), so the clipped band is transparent; only the blurred spread the app can't draw would have shown there. |
| all 3 | lamp svg | width / height / viewBox / inset | `88` / `78` / `0 0 88 78` / `absolute inset:0` | `88` / `78` / `0 0 88 78` (line 201) | match |
| all 3 | lamp defs | shade gradient | `linearGradient x1 0 y1 0 x2 0 y2 1`, `#4A4843` @0 → `#1D1C19` @1 | identical (`shade${id}`, lines 203–206) | match |
| all 3 | lamp defs | page gradient | `linearGradient x1 0 y1 0 x2 1 y2 1`, `#FFFFFF` @0 → `#E8E7E0` @1 | identical (`page${id}`, lines 207–210) | match |
| all 3 | lamp defs | 2nd gradient (`wrTh?b`) | `x1 0 y1 0 x2 1 y2 1`, `#E6E5DE` → `#C3C2BB` — **declared but referenced by nothing** in all three raw frames | not declared | match (n/a — dead def, zero paint) |
| all 3 | lamp shadow A | ellipse cx/cy/rx/ry/fill | `28` / `67` / `15` / `2.6` / `rgba(40,38,32,0.13)` | identical (line 218) | match |
| all 3 | lamp shadow B | ellipse cx/cy/rx/ry/fill | `66` / `69` / `19` / `2.8` / `rgba(40,38,32,0.13)` | identical (line 219) | match |
| all 3 | lamp stem | rect x/y/w/h/rx/fill | `26.8` / `34` / `2.6` / `30` / `1.3` / `#C4C3BC` | identical (line 220) | match |
| all 3 | lamp head | circle cx/cy/r/fill | `28` / `27` / `8.5` / `url(shade)` | identical (line 221) | match |
| all 3 | lamp highlight | path `d` | `M22.5 24.5 A7 7 0 0 1 28 21.5` | identical verbatim (line 222) | match |
| all 3 | lamp highlight | stroke / width / fill / linecap | `rgba(255,255,255,0.22)` / `1.6` / `none` / `round` | identical | match |
| all 3 | lamp base | rect x/y/w/h/rx/fill | `20` / `63` / `16` / `2.6` / `1.3` / `#C4C3BC` | identical (line 223) | match |
| all 3 | book spine | rect x/y/w/h/rx/fill | `58` / `43` / `16` / `6.5` / `2.4` / `url(shade)` | identical (line 224) | match |
| all 3 | book page | rect x/y/w/h/rx | `50` / `50` / `34` / `16` / `3` | identical (line 225) | match |
| all 3 | book page | fill / stroke / stroke-width | `url(page)` / `rgba(0,0,0,0.14)` / `1` | identical | match |
| all 3 | book rule | path `d` / stroke / width / linecap | `M56 58 L78 58` / `rgba(0,0,0,0.1)` / `1.4` / `round` | identical (line 226) | match |
| all 3 | book foot L | rect x/y/w/h/fill | `53` / `66` / `2.4` / `4` / `#C4C3BC` | identical (line 227) | match |
| all 3 | book foot R | rect x/y/w/h/fill | `78.6` / `66` / `2.4` / `4` / `#C4C3BC` | identical (line 228) | match |
| all 3 | lamp paint order | z-order | glow, shadowA, shadowB, stem, head, highlight, base, spine, page, rule, footL, footR | identical order (lines 217–228) | match |

### B2 · Count chips + page dots

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 3 | chip row | left | `24` | `left:24` (line 152) | match |
| all 3 | chip row | top | canvas `212` → app `158` | `top:158` | match |
| all 3 | chip row | display / gap | `flex` / `8px` | `flexDirection:'row'` / `gap:8` | match |
| all 3 | chip | height | `27px` | `27` (line 190) | match |
| all 3 | chip | border-radius | `14px` | `14` | match |
| all 3 | chip | background | `#FFFFFF` | `#FFFFFF` | match |
| all 3 | chip | box-shadow | `0 0 0 1px rgba(0,0,0,0.08)` | `0 0 0 1px rgba(0,0,0,0.08)` | match |
| all 3 | chip | padding | `0 12px` | `paddingHorizontal:12` | match |
| all 3 | chip | align-items | `center` | `justifyContent:'center'` (column axis; equivalent for the single child) | match |
| all 3 | chip label | font-size / weight / color | `13px` / `600` / `#1D1C1A` | `13` / `sans('600')` / `#1D1C1A` (line 191) | match |
| all 3 | chip 1 | copy | `7 check-ins` | `` `${report.checkins} check-in(s)` `` (line 153) | match |
| all 3 | chip 2 | copy | `3 urges` | `` `${report.urges} urge(s)` `` (line 154) | match |
| all 3 | chip 3 | copy | `0 relapses` | `` `${report.relapses} relapse(s)` `` (line 155) | match |
| all 3 | dot row | left / right | `0` / `0` | `left:0, right:0` (line 158) | match |
| all 3 | dot row | top | canvas `684` → app `630` | `top:630` | match |
| all 3 | dot row | justify-content / gap | `center` / `8px` | `justifyContent:'center'` / `gap:8` | match |
| all 3 | dot | width × height / border-radius | `7 × 7` / `50%` | `7 × 7` / `3.5` (line 160) | match |
| all 3 | dot active | background | `#131313` | `#131313` | match |
| all 3 | dot inactive | background | `rgba(19,19,19,0.16)` | `rgba(19,19,19,0.16)` | match |
| Weekly-Report | dot state | active index | 1st | `page === 0` | match |
| -Days | dot state | active index | 2nd | `page === 1` | match |
| -Urges | dot state | active index | 3rd | `page === 2` | match |

---

## C · Weekly-Report (031 · score) → `ScorePage`, weekly-report.tsx:270–374

### C1 · Section heading and trend pill

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Weekly-Report | section title | left | `24` | `left:24` (line 236) | match |
| Weekly-Report | section title | top | canvas `294` → app `240` | `top:240` (line 236) | match |
| Weekly-Report | section title | font-size / weight | `20px` / `600` | `20` / `sans('600')` | match |
| Weekly-Report | section title | letter-spacing / color | `-0.1px` / `#1D1C1A` | `-0.1` / `#1D1C1A` | match |
| Weekly-Report | section title | line-height | not declared → normal | AppText deletes the inherited variant leading (own `fontSize`, no own `lineHeight`) → platform normal | match |
| Weekly-Report | section title | copy | `Recovery score` | `Recovery score` (line 298) | match |
| Weekly-Report | trend pill | right | `24` | `right:24` (line 303) | match |
| Weekly-Report | trend pill | top | canvas `288` → app `234` | `top:234` (line 304) | match |
| Weekly-Report | trend pill | height / border-radius | `30px` / `15px` | `30` / `15` | match |
| Weekly-Report | trend pill | background | `#FFFFFF` | `#FFFFFF` | match |
| Weekly-Report | trend pill | box-shadow | `0 0 0 1px rgba(0,0,0,0.1)` | `0 0 0 1px rgba(0,0,0,0.1)` (line 308) | match |
| Weekly-Report | trend pill | display / align-items / gap / padding | `flex` / `center` / `6px` / `0 12px` | `row` / `center` / `6` / `paddingHorizontal:12` | match |
| Weekly-Report | trend icon | svg width / height / viewBox | `13` / `9` / `0 0 14 10` | `13` / `9` / `0 0 14 10` (line 314) | match |
| Weekly-Report | trend icon | path `d` | `M1 8.5L5 4.5l2.5 2L12.5 1.5` | identical verbatim (line 315) | match |
| Weekly-Report | trend icon | stroke / width / fill / linecap / linejoin | `#1D1C1A` / `1.8` / `none` / `round` / `round` | identical | match |
| Weekly-Report | trend label | font-size / weight / color | `12px` / `600` / `#1D1C1A` | `12` / `sans('600')` / `#1D1C1A` (line 317) | match |
| Weekly-Report | trend label | copy | `steady climb` | `steady climb` when `gain > 0` (line 317) | match |
| Weekly-Report | trend label | states | only the positive state is drawn | app adds `a dip, then back` (`gain < 0`) and `holding` (`gain === 0`) | app-only states — design silent |

### C2 · Chart geometry

The design's chart is one `<svg width="393" height="220" viewBox="0 0 393 220">` at canvas `top:340` → app `top:286`, `left:0`. The app draws `<Svg width={width} height={220}>` with **no viewBox**, remapping x through
`px(x) = 50 + (x − 50) · (width − 66) / 327` (line 275). At the reference width 393 this is the exact identity — verified numerically: `px(50)=50`, `px(56)=56`, `px(352)=352`, `px(377)=377`.

**Design plot box (svg-local):** gridlines x 50 → 377 at y 30 / 94 / 158 (64 apart); data x 56 → 352; floor y 195; dashed rule x 352 from y 16 to y 195; end dot (352, 30).

**App plot box @393:** gridlines `px(50)=50` → `px(377)=377` at y 30 / 94 / 158; data x = `px(56 + i·296/6)` = 56, 105.3333, 154.6667, 204, 253.3333, 302.6667, 352; floor 195; dashed rule `px(352)=352` from `endY − 14` to 195; end dot (352, `endY`). `y(v) = 30 + (top − v)·64/step` so the gridline pitch is 64 by construction, and `gridValue(row) = top − row·step`.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Weekly-Report | chart svg | left | `0` | `left:0` (line 326) | match |
| Weekly-Report | chart svg | top | canvas `340` → app `286` | `top:286` (line 326) | match |
| Weekly-Report | chart svg | width / height | `393` / `220` | `width` (=393 on reference) / `220` | match |
| Weekly-Report | chart svg | viewBox | `0 0 393 220` | none; coordinates remapped by `px()` | match @393 (identity); above 393 the design would scale strokes uniformly whereas the app holds the 50/16 gutters and stroke widths fixed — deliberate, per the app's comment (lines 272–274) |
| Weekly-Report | fill gradient | x1/y1/x2/y2 | `0` / `0` / `0` / `1` | `0` / `0` / `0` / `1` (line 328) | match |
| Weekly-Report | fill gradient | stop 0 | `rgba(19,19,19,0.10)` | `rgba(19,19,19,0.10)` (line 329) | match |
| Weekly-Report | fill gradient | stop 1 | `rgba(19,19,19,0)` | `rgba(19,19,19,0)` (line 330) | match |
| Weekly-Report | gridline 1 | x1/y1/x2/y2 | `50` / `30` / `377` / `30` | `px(50)=50` / `30` / `px(377)=377` / `30` (line 333) | match |
| Weekly-Report | gridline 2 | x1/y1/x2/y2 | `50` / `94` / `377` / `94` | `50` / `94` / `377` / `94` (line 334) | match |
| Weekly-Report | gridline 3 | x1/y1/x2/y2 | `50` / `158` / `377` / `158` | `50` / `158` / `377` / `158` (line 335) | match |
| Weekly-Report | gridlines | stroke / stroke-width | `rgba(19,19,19,0.07)` / `1` | `rgba(19,19,19,0.07)` / `1` | match |
| Weekly-Report | dashed rule | x1 / x2 | `352` / `352` | `px(352)=352` / `px(352)=352` (line 337) | match |
| Weekly-Report | dashed rule | y1 | `16` | `endY − 14` = 16 when `endY = 30` (the canvas's own sample) | match — parametrised to hold the 14pt gap above the end dot wherever the week lands |
| Weekly-Report | dashed rule | y2 | `195` | `195` | match |
| Weekly-Report | dashed rule | stroke / width / dasharray | `rgba(19,19,19,0.14)` / `1` / `3 5` | `rgba(19,19,19,0.14)` / `1` / `3 5` | match |
| Weekly-Report | area fill | path `d` | `M56,178 C110,170 150,158 200,132 C250,106 310,60 352,30 L352,195 L56,195 Z` — two hand-drawn cubics over 3 anchors | `` `${line} L352,195 L56,195 Z` `` where `line` is 6 Catmull-Rom cubics over the 7 real day scores, coords rounded to 0.1 (lines 338, 575–586) | match (parametric) — the closing edge `L352,195 L56,195 Z` and the plot box are identical; the curve's literal `d` cannot match because the canvas's is sample data |
| Weekly-Report | area fill | fill | `url(#wr3F)` | `url(#fill${id})`, same gradient | match |
| Weekly-Report | line | path `d` | `M56,178 C110,170 150,158 200,132 C250,106 310,60 352,30` | same generated `line` (line 339) | match (parametric) |
| Weekly-Report | line | fill / stroke / stroke-width / linecap | `none` / `#131313` / `2.4` / `round` | `none` / `#131313` / `2.4` / `round` | match |
| Weekly-Report | line | stroke-linejoin | not declared → `miter` | not declared → `miter` | match |
| Weekly-Report | end dot outer | cx / cy | `352` / `30` | `px(352)=352` / `endY` (=30 at the canvas sample) (line 340) | match |
| Weekly-Report | end dot outer | r / fill | `9` / `#F6F5F2` | `9` / `#F6F5F2` | match |
| Weekly-Report | end dot outer | stroke / stroke-width | `rgba(19,19,19,0.22)` / `1.5` | `rgba(19,19,19,0.22)` / `1.5` | match |
| Weekly-Report | end dot inner | cx / cy / r / fill | `352` / `30` / `4.5` / `#131313` | `352` / `endY` / `4.5` / `#131313` (line 341) | match |
| Weekly-Report | chart paint order | z-order | defs, grid×3, dashed, area, line, dot outer, dot inner | identical (lines 328–341) | match |

### C3 · Axis labels, reading pill, day letters

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Weekly-Report | axis label 1 | left | `16` | `left:16` (line 321) | match |
| Weekly-Report | axis label 1 | top | canvas `362` → app `308` | `308 + 0·64` = 308 | match |
| Weekly-Report | axis label 2 | top | canvas `426` → app `372` | `308 + 1·64` = 372 | match |
| Weekly-Report | axis label 3 | top | canvas `490` → app `436` | `308 + 2·64` = 436 | match |
| Weekly-Report | axis labels | font-size / weight / color | `11.5px` / `500` / `#B0AEA8` | `11.5` / `sans('500')` / `#B0AEA8` | match |
| Weekly-Report | axis labels | copy | `1,240` / `1,220` / `1,200` (step 20, thousands separator) | `gridValue(row).toLocaleString()` → `top − row·step`; the step ladder includes 20 (`NICE_STEPS`, line 43) and `toLocaleString` gives the comma | match |
| Weekly-Report | reading pill | left + transform | `left:352; transform:translateX(-50%)` → centre 352 | 100-wide centred box at `left: px(352) − 50 = 302` → centre 352 (line 347) | match |
| Weekly-Report | reading pill | top | canvas `330` → app `276` | `286 + endY − 40` = 276 at `endY = 30` | match — parametrised to hold the 3pt gap above the r9 dot |
| Weekly-Report | reading pill | height / border-radius | `28px` / `14px` | `28` / `14` (line 348) | match |
| Weekly-Report | reading pill | background | `#131313` | `#131313` | match |
| Weekly-Report | reading pill | padding | `0 12px` | `paddingHorizontal:12` | match |
| Weekly-Report | reading pill | box-shadow | `0 6px 14px rgba(19,19,19,0.22)` | `0 6px 14px rgba(19,19,19,0.22)` | match |
| Weekly-Report | reading pill | z-index | `6` — paints above the later auto-z siblings (day letters, verdict, dots) | document order: after the chart, before the day letters / verdict / dots | match — the pill's box (app y 276–304, worst case 424–452) never reaches the day letters (510), verdict (538) or dots (630), so the stacking difference is unobservable at every value the step logic allows |
| Weekly-Report | reading pill label | font-size / weight / color | `12.5px` / `600` / `#FFFFFF` | `12.5` / `sans('600')` / `#FFFFFF` (line 349) | match |
| Weekly-Report | reading pill label | copy | `1,240` | `Math.round(end).toLocaleString()` | match |
| Weekly-Report | day letters | left / right | `50` / `16` | `left:50, right:16` (line 353) | match |
| Weekly-Report | day letters | top | canvas `564` → app `510` | `top:510` | match |
| Weekly-Report | day letters | display / justify-content | `flex` / `space-between` | `flexDirection:'row'` / `space-between` | match |
| Weekly-Report | day letters | font-size / weight / color | `12px` / `500` / `#8B8882` | `12` / `sans('500')` / `#8B8882` (line 355) | match |
| Weekly-Report | day letters | copy | `M T W T F S S` | `DOW = ['M','T','W','T','F','S','S']` (line 30) | match |

### C4 · Verdict card (score page)

`Verdict` (weekly-report.tsx:241–266) is the shared box; the three frames differ only in glyph and copy.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 3 | verdict card | left / right | `16` / `16` | `left:16, right:16` (line 247–248) | match |
| all 3 | verdict card | top | canvas `592` → app `538` | `top:538` (line 249) | match |
| all 3 | verdict card | height | `76px` | `76` | match |
| all 3 | verdict card | box-sizing | `border-box` (declared) | RN is border-box | match |
| all 3 | verdict card | border-radius | `18px` | `18` | match |
| all 3 | verdict card | background | `#FFFFFF` | `#FFFFFF` | match |
| all 3 | verdict card | box-shadow (hairline) | `0 0 0 1px rgba(0,0,0,0.06)` | `0 0 0 1px rgba(0,0,0,0.06)` (line 252) | match |
| all 3 | verdict card | box-shadow (lift) | `0 10px 24px rgba(40,38,32,0.06)` | `0 10px 24px rgba(40,38,32,0.06)` | match |
| all 3 | verdict card | display / align-items / gap / padding | `flex` / `center` / `12px` / `0 14px` | `row` / `center` / `12` / `paddingHorizontal:14` | match |
| all 3 | verdict disc | width × height / border-radius | `38 × 38` / `50%` | `38 × 38` / `19` (line 258) | match |
| all 3 | verdict disc | background | `#131313` | `#131313` | match |
| all 3 | verdict disc | align / justify / flex-shrink | `center` / `center` / `0` | `center` / `center` / RN default shrink 0 | match |
| all 3 | verdict title block | flex-shrink | `0` | RN default 0 | match |
| all 3 | verdict title | font-size / weight / color | `13.5px` / `600` / `#1D1C1A` | `13.5` / `sans('600')` / `#1D1C1A` (line 260) | match |
| all 3 | verdict sub | margin-top | `2px` | `marginTop:2` (line 261) | match |
| all 3 | verdict sub | font-size / weight / color | `11.5px` / `400` / `#8B8882` | `11.5` / `sans('400')` / `#8B8882` | match |
| all 3 | verdict body | flex / padding-left | `1` (`flex:1 1 0%`) / `8px` | `flex:1` (grow 1, shrink 1, basis 0%) / `paddingLeft:8` (line 263) | match |
| all 3 | verdict body | font-size / weight | `12.5px` / `400` | `12.5` / `sans('400')` | match |
| all 3 | verdict body | line-height / color | `17px` / `#55534E` | `17` / `#55534E` | match |
| all 3 | verdict body | **text-wrap** | not declared → UA default `wrap` | `pretty` on web (AppText.tsx:128); no equivalent on native | **MISMATCH\*** — web-only; `pretty` avoids a last-line orphan the canvas's default wrapping would allow. Native is unaffected. |
| Weekly-Report | verdict glyph | svg width / height / viewBox | `16` / `11` / `0 0 16 11` | `16` / `11` / `0 0 16 11` (line 363) | match |
| Weekly-Report | verdict glyph | path 1 `d` | `M1.5 9.5L6 5l3 2.5L14.5 1.5` | identical verbatim (line 364) | match |
| Weekly-Report | verdict glyph | path 2 `d` | `M10.8 1.5h3.7V5.2` | identical verbatim (line 365) | match |
| Weekly-Report | verdict glyph | stroke / width / fill / linecap / linejoin | `#FFFFFF` / `1.9` / `none` / `round` / `round` (both paths) | identical | match |
| Weekly-Report | verdict title | copy | `+12 points` | `` `${gain >= 0 ? '+' : '−'}${Math.abs(gain)} points` `` (line 368) | match |
| Weekly-Report | verdict sub | copy | `this week` | `this week` (line 369) | match |
| Weekly-Report | verdict body | copy | `A steady climb. Keep the evenings boring.` | same string when `gain > 0` (line 370) | match |
| Weekly-Report | verdict body | states | only the positive state is drawn | app adds negative and flat sentences | app-only states — design silent |

---

## D · Weekly-Report-Days (032) → `DaysPage`, weekly-report.tsx:378–447

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| -Days | section title | left / top | `24` / canvas `294` → app `240` | `left:24, top:240` (line 236, 399) | match |
| -Days | section title | font-size / weight / letter-spacing / color | `20px` / `600` / `-0.1px` / `#1D1C1A` | `20` / `sans('600')` / `-0.1` / `#1D1C1A` | match |
| -Days | section title | copy | `Day by day` | `Day by day` | match |
| -Days | day-letter row | left / right | `24` / `24` | `left:24, right:24` (line 401) | match |
| -Days | day-letter row | top | canvas `342` → app `288` | `top:288` | match |
| -Days | day-letter row | display / gap | `flex` / `7px` | `flexDirection:'row'` / `gap:7` | match |
| -Days | day letter | flex | `1` | `flex:1` (line 403) | match |
| -Days | day letter | text-align | `center` | `center` prop | match |
| -Days | day letter | font-size / weight / color | `11px` / `500` / `#8B8882` | `11` / `sans('500')` / `#8B8882` | match |
| -Days | day letters | copy | `M T W T F S S` | `DOW` | match |
| -Days | "Last week" | left / top | `24` / canvas `374` → app `320` | `left:24, top:320` (line 409) | match |
| -Days | "Last week" | font-size / weight / color | `12.5px` / `500` / `#8B8882` | `12.5` / `sans('500')` / `#8B8882` | match |
| -Days | "Last week" | copy | `Last week` | `Last week` | match |
| -Days | last-week row | left / right | `24` / `24` | `left:24, right:24` (line 433) | match |
| -Days | last-week row | top | canvas `398` → app `344` | `top={344}` (line 410) | match |
| -Days | last-week row | display / gap | `flex` / `7px` | `row` / `gap:7` | match |
| -Days | last-week row | opacity | `0.4` | `opacity: faded ? 0.4 : 1` with `faded` set (line 410, 433) | match |
| -Days | last-week cell | flex / height / border-radius | `1` / `44px` / `12px` | `flex:1` / `44` / `12` (lines 438–440) | match |
| -Days | last-week cells | fill sequence | `#CDC9BD`, `#A9A597`, `#A9A597`, `#CDC9BD`, `#A9A597`, `#767267`, `#A9A597` | `DAY_TONES[MOOD_TONE[mood−1]]`, `DAY_TONES = ['#CDC9BD','#A9A597','#767267','#131313']` (line 39) | match — all four literals present and no fifth invented |
| -Days | "This week" | left / top | `24` / canvas `466` → app `412` | `left:24, top:412` (line 412) | match |
| -Days | "This week" | font-size / weight / color / copy | `12.5px` / `500` / `#8B8882` / `This week` | identical | match |
| -Days | this-week row | left / right / top | `24` / `24` / canvas `490` → app `436` | `left:24, right:24, top={436}` (line 413) | match |
| -Days | this-week row | opacity | not declared → `1` | `1` (`faded` unset) | match |
| -Days | this-week row | display / gap | `flex` / `7px` | `row` / `gap:7` | match |
| -Days | this-week cell | flex / height / border-radius | `1` / `44px` / `12px` | `flex:1` / `44` / `12` | match |
| -Days | this-week cells | fill sequence | `#A9A597`, `#767267`, `#A9A597`, `#767267`, `#131313`, `#767267`, `#767267` | same tone ramp | match |
| -Days | day cell | empty state | not drawn — the canvas has no null day | `rgba(19,19,19,0.06)` when `mood == null` (line 441) | app-only state — design silent |
| -Days | verdict card | box | as §C4 | as §C4 | match |
| -Days | verdict glyph | svg width / height / viewBox | `15` / `15` / `0 0 18 18` | `15` / `15` / `0 0 18 18` (line 417) | match |
| -Days | verdict glyph | rect x/y/w/h/rx | `1.5` / `3` / `15` / `13.5` / `3` | identical (line 418) | match |
| -Days | verdict glyph | rect fill / stroke / stroke-width | `none` / `#FFFFFF` / `1.8` | identical | match |
| -Days | verdict glyph | path `d` | `M5.5 1.5v3M12.5 1.5v3M1.5 7.5h15` | identical verbatim (line 419) | match |
| -Days | verdict glyph | path stroke / width / linecap | `#FFFFFF` / `1.8` / `round` | identical | match |
| -Days | verdict title | copy | `Stronger week` | `Stronger week` when `thisAvg >= lastAvg` (line 422) | match |
| -Days | verdict title | states | only `Stronger week` drawn | app adds `A heavier week` and `Your first week` | app-only states — design silent |
| -Days | verdict sub | copy | `vs Jul 7–13` (`&ndash;`) | `` `vs ${prev}` ``, `prev = rangeLabel(startMs − 7d)` → `Jul 7–13` with U+2013 (line 593) | match |
| -Days | verdict body | copy | `Five steady days of seven. Friday was the test.` | `` `${COUNT_WORD[steady]} steady day(s) of seven. ${DAY_NAME[test]} was the test.` `` (line 424) — on the canvas's row, `steady`=5 (5 cells at tone ≥ `#767267`) and `test`=Friday (the row's one `#131313`) | match |

---

## E · Weekly-Report-Urges (033) → `UrgesPage`, weekly-report.tsx:451–546

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| -Urges | section title | left / top | `24` / canvas `294` → app `240` | `left:24, top:240` (line 236, 457) | match |
| -Urges | section title | font-size / weight / letter-spacing / color | `20px` / `600` / `-0.1px` / `#1D1C1A` | `20` / `sans('600')` / `-0.1` / `#1D1C1A` | match |
| -Urges | section title | copy | `This week’s urges` (`&rsquo;`) | `This week’s urges` (U+2019) | match |
| -Urges | urge row 1 | left / right | `24` / `24` | `left:24, right:24` (line 496–497) | match |
| -Urges | urge row 1 | top | canvas `348` → app `294` | `294 + 0·64` = 294 (line 464) | match |
| -Urges | urge row 2 | top | canvas `412` → app `358` | `294 + 1·64` = 358 | match |
| -Urges | urge row 3 | top | canvas `476` → app `422` | `294 + 2·64` = 422 | match |
| -Urges | urge row | height + box model | `height:56` with **content-box** (no `box-sizing` declared) + `border-bottom:1px` → 57 border-box | `height:57` with `borderBottomWidth:1` (border-box) → 56 content box | match — same 57 total, same 56 centring box, hairline lands on the same pixel |
| -Urges | urge row | display / align-items / gap | `flex` / `center` / `13px` | `row` / `center` / `gap:13` | match |
| -Urges | urge row | border-bottom | `1px solid rgba(0,0,0,0.05)` | `borderBottomWidth:1`, `borderBottomColor:'rgba(0,0,0,0.05)'` (line 505–506) | match |
| -Urges | urge disc | width × height / border-radius | `36 × 36` / `50%` | `36 × 36` / `18` (line 508) | match |
| -Urges | urge disc | background | `#F1EFE9` | `#F1EFE9` | match |
| -Urges | urge disc | align / justify / flex-shrink | `center` / `center` / `0` | `center` / `center` / RN default 0 | match |
| -Urges | row 1 glyph (moon) | svg width / height / viewBox | `15` / `15` / `0 0 30 30` | `15` / `15` / `0 0 30 30` (line 533) | match |
| -Urges | row 1 glyph | path `d` | `M17 3 A11 11 0 1 0 25.5 20 A8.6 8.6 0 1 1 17 3 Z` | identical verbatim (line 534) | match |
| -Urges | row 1 glyph | fill | `#131313` | `#131313` | match |
| -Urges | row 1 glyph | trigger mapping | drawn for `Late night` | `t === 'late night' \|\| t === 'tired'` (line 531) | match |
| -Urges | row 2 glyph (ring) | box | `<div> 12 × 12; border-radius:50%` | `<View> 12 × 12; borderRadius:6` (line 545) | match |
| -Urges | row 2 glyph | ring | `box-shadow: inset 0 0 0 3.5px #131313` → 12 outer / 3.5 ring / 5 hole | `borderWidth:3.5, borderColor:'#131313'` (RN border-box) → 12 outer / 3.5 ring / 5 hole, inner radius 2.5 | match |
| -Urges | row 2 glyph | trigger mapping | drawn for `Boredom` | falls through to the ring (line 545) | match |
| -Urges | row 3 glyph (spike) | svg width / height / viewBox | `14` / `11` / `0 0 14 11` | `14` / `11` / `0 0 14 11` (line 540) | match |
| -Urges | row 3 glyph | path `d` | `M1 9.5L5 5l3 3 5-6.5` | identical verbatim (line 541) | match |
| -Urges | row 3 glyph | stroke / width / fill / linecap / linejoin | `#131313` / `2.6` / `none` / `round` / `round` | identical | match |
| -Urges | row 3 glyph | trigger mapping | drawn for `Stress` | `t === 'stress' \|\| t === 'argument'` (line 538) | match |
| -Urges | urge text block | flex | `1` | `flex:1` (line 511) | match |
| -Urges | urge title | font-size / weight / color | `14.5px` / `600` / `#1D1C1A` | `14.5` / `sans('600')` / `#1D1C1A` (line 512) | match |
| -Urges | urge title | copy row 1 / 2 / 3 | `Late night · Intense` / `Boredom · Mild` / `Stress · Strong` (`&middot;`) | `` `${trigger} · ${severityWord(severity)}` `` with the same U+00B7 separator (line 484); `severityWord` yields Intense/Mild/Strong (weeklyReport.ts:123–130) | match |
| -Urges | urge sub | margin-top | `2px` | `marginTop:2` (line 513) | match |
| -Urges | urge sub | font-size / weight / color | `12px` / `400` / `#8B8882` | `12` / `sans('400')` / `#8B8882` | match |
| -Urges | urge sub | copy row 1 / 2 / 3 | `Tuesday · 11:40 pm` / `Thursday · 3:10 pm` / `Friday · 9:05 pm` | `` `${DAY_NAME[dow]} · ${time}` `` with `toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}).toLowerCase()` → `11:40 pm` (line 514) | match |
| -Urges | urge outcome | font-size / weight / color | `12.5px` / `400` / `#8B8882` | `12.5` / `sans('400')` / `#8B8882` (line 517) | match |
| -Urges | urge outcome | copy row 1 / 2 / 3 | `rode it out` / `surfed the timer` / `rode it out` | `whatHelped.toLowerCase()`, else `slipped` / `rode it out` (line 486) | match |
| -Urges | urge outcome | flex-shrink | CSS flex-item default `1` | RN default `0` | match @393 (both fit); the app will not shrink the outcome on a narrower device where CSS would |
| -Urges | urge chevron | svg width / height / viewBox | `6` / `10` / `0 0 8 14` | `6` / `10` / `0 0 8 14` (line 518) | match |
| -Urges | urge chevron | path `d` | `M1.5 1.5L6.5 7l-5 5.5` | identical verbatim (line 519) | match |
| -Urges | urge chevron | fill / stroke / stroke-width / linecap | `none` / `#B0AEA8` / `2` / `round` | identical | match |
| -Urges | urge chevron | flex-shrink | `0` | RN default 0 | match |
| -Urges | urge row | row count | 3 rows drawn | `urges.slice(0, 3)` (line 453) | match |
| -Urges | urge list | empty state | not drawn | `No urges logged this week.` at 14/400/`#8B8882`, top 294 (line 460) | app-only state — design silent |
| -Urges | verdict card | box | as §C4 | as §C4 | match |
| -Urges | verdict glyph | svg width / height / viewBox | `15` / `12` / `0 0 16 13` | `15` / `12` / `0 0 16 13` (line 469) | match |
| -Urges | verdict glyph | path `d` | `M1.5 7l4.5 4.5L14.5 1.5` | identical verbatim (line 470) | match |
| -Urges | verdict glyph | stroke / width / fill / linecap / linejoin | `#FFFFFF` / `2` / `none` / `round` / `round` | identical | match |
| -Urges | verdict title | copy | `2 of 3 ridden out` | `` `${ridden} of ${urges.length} ridden out` `` (line 473) | match |
| -Urges | verdict sub | copy | `no relapse` | `no relapse` when `relapses === 0` (line 474) | match |
| -Urges | verdict sub | states | only `no relapse` drawn | app adds `${n} slip(s)` | app-only state — design silent |
| -Urges | verdict body | copy | `The timer did its job twice.` | same string when `ridden === 2` (line 475) | match |
| -Urges | verdict body | states | only the `ridden === 2` state drawn | app adds 0 / 1 / n forms | app-only states — design silent |

---

## Findings

**379 comparison rows written across 4 frames. 8 rows carry a MISMATCH verdict, all of them MISMATCH\* and all of them a CSS `filter: blur` or `text-wrap` that React Native cannot express; they group into 6 distinct defects (the contact shadow's `fill` and `filter` are one substitution, as are the lamp glow's `filter` and `clipping`). Zero plain MISMATCH: no offset, size, colour, alpha, radius, shadow, gradient stop, font metric, flex property, icon dimension, viewBox or path `d` differs from its design literal.**

1. **MISMATCH\* — `src/app/report-ready.tsx:42` · Report-Ready, top ambient wash, `filter`.**
   Design: `filter: blur(5px)`. App: no blur — the `<Svg>` renders the raw 3-stop radial only.
   Substitute: the gradient's own falloff. Alpha reaches 0 at 75% of the radius, so the 5px spread has no visible ink to carry past the box; the difference is a marginally harder mid-ramp.

2. **MISMATCH\* — `src/app/report-ready.tsx:128` · Report-Ready, report-art back glow, `filter`.**
   Design: `filter: blur(5px)` on a 172 × 172 `radial-gradient(closest-side, rgba(226,186,120,0.46), rgba(226,186,120,0) 74%)`. App: no blur, and the `<Svg>` hard-clips at 172 × 172 where CSS would spread ~5px beyond it.
   Substitute: the gradient falloff (alpha is 0 at r 63.64 of 86, so nothing reaches the clip edge).

3. **MISMATCH\* — `src/app/report-ready.tsx:139–147` · Report-Ready, sheet contact shadow, `background` + `filter`.**
   Design: a **flat** `rgba(0,0,0,0.10)` ellipse, 156 × 15, feathered by `filter: blur(6px)` — the parent has no `overflow:hidden`, so the rendered blob is roughly 168 × 27 of soft ink.
   App: a 3-stop radial (`#000` 0.10 → 0.05 @0.6 → 0 @1.0) inside a `<Svg>` hard-clipped to 156 × 15.
   Net: the app's shadow is both narrower and shorter than the design's rendered result, and its core is lighter than the design's flat 0.10 disc.

4. **MISMATCH\* — `src/app/report-ready.tsx:84` · Report-Ready, headline, `text-wrap`.**
   Design: `text-wrap: balance`. App: `AppText` emits `text-wrap: pretty` on web (variant `body`, `AppText.tsx:128`); native RN has no `text-wrap` at all.
   Substitute: greedy wrapping on native, `pretty` on web. The web half is closeable (route the headline through the `display`/`title` variant, which already emits `balance`); the native half is not.

5. **MISMATCH\* — `src/app/weekly-report.tsx:211–217` · all three Weekly-Report frames, desk-lamp glow, `filter` + clipping.**
   Design: a free `<div>` at `left:4; top:-2; 56 × 56` with `filter: blur(3px)`, sitting in a container with no `overflow:hidden`, so its 2px top overhang renders.
   App: re-hosted as `<Ellipse cx=32 cy=26 rx=28 ry=28>` inside the `88 × 78` lamp `<Svg>`, which clips at y = 0, and with no blur.
   Geometry of the ellipse is exact (centre and radius verified). The clipped band lies at r 26–28 where the gradient alpha is already 0 (it reaches 0 at r 20.72), so only the blurred spread the app cannot draw would have shown there.

6. **MISMATCH\* — `src/app/weekly-report.tsx:263` · all three Weekly-Report frames, verdict-card body, `text-wrap`.**
   Design: no `text-wrap` declared → UA default `wrap`. App: `pretty` on web (`AppText.tsx:128`).
   Web-only; `pretty` will avoid a last-line orphan that the canvas's default wrapping allows in the two-line verdict sentence. Native is unaffected.

### Things deliberately **not** counted as mismatches

- **Chart path `d`** (`weekly-report.tsx:338–339`). The canvas's `M56,178 C110,170 150,158 200,132 C250,106 310,60 352,30` is two hand-drawn cubics over sample data; the app generates 6 Catmull-Rom cubics from the seven real day scores. The plot box, the closing edge `L352,195 L56,195 Z`, the gridline pitch (64), the floor (195), the data span (x 56 → 352) and both end-dot radii are identical.
- **Chart `viewBox`.** Design `0 0 393 220`; the app omits it and remaps x through `px()`. Verified numerically identical at 393 (`px(50)=50`, `px(56)=56`, `px(352)=352`, `px(377)=377`). Divergence only above the reference width, and it is the intended responsive behaviour.
- **Dashed-rule `y1` and reading-pill `top`.** Design literals 16 and 330; the app parametrises them as `endY − 14` and `286 + endY − 40`, which reproduce 16 and 276 exactly at the canvas's `endY = 30`.
- **Reading-pill `z-index: 6`.** The app relies on document order instead. The pill's box never overlaps any later sibling at any value the step logic permits (worst case y 424–452 vs day letters at 510), so the stacking difference is unobservable.
- **Seal gradient extent** (`report-ready.tsx:181`). CSS implicit `farthest-corner` = 93.50936%; the app writes 93.5%. Delta 0.0024px.
- **Unused lamp gradient `wrTh?b`** (`#E6E5DE` → `#C3C2BB`) is declared in all three raw frames and referenced by nothing; the app omits it. Zero paint.
- **App-only states** the canvas never draws: negative/flat trend labels and verdict sentences, the `A heavier week` / `Your first week` titles, the `${n} slip(s)` sub, the empty day-cell tone `rgba(19,19,19,0.06)`, and the `No urges logged this week.` empty row. None of these contradicts a design literal.
- **Font-family fallback tail.** `-apple-system` is the first entry in both stacks, so the resolved face is identical on the target platform; only the web fallback list after it differs.
