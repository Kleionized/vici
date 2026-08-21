# Property audit — onboarding 1b (V3 Q5 · Q6 · Q7 · Section 3 Intro · Q8 · Q9)

Design source (read in full, one CSS declaration per line):
`/.uifinal/pretty/final/Email Login/{V3-Q5,V3-Q6,V3-Q7,V3-Section-3-Intro,V3-Q8,V3-Q9}.html`
Raw frames cross-checked for element counts (`div`/`svg` counts identical to the pretty
copies in all six, so nothing was dropped by prettifying).

App source (read in full): `/Users/admin/Documents/tideline/src/components/onboarding/v3.tsx`
Host that mounts it: `/Users/admin/Documents/tideline/src/app/(onboarding)/welcome.tsx`
(`chrome = {}` for every question and section-intro step → `bar=true`, `onBack=back`,
`backTop=undefined → 40`, `lit=false`, `segments=undefined`.)
Supporting files read: `src/lib/theme.ts` (`sans`, `colors`), `src/components/ui/AppText.tsx`,
`src/components/ui/press-scale.tsx`, `src/components/ui/Grain.tsx`.

## Reading the table

* Every canvas `top` includes the 54px status bar the app never builds. Design tops are
  given as `canvas N (app-equivalent N−54)`; the app column gives the literal in the source.
* The canvas frame is 393 × 852. The app frame is the device screen: top-anchored elements
  sit below the safe-area inset (the port's stand-in for the 54px bar) and the bottom-anchored
  pill holds the canvas's own distance from the bottom edge (`852 − top − height`).
* One row per (element, property). Where the design writes one shorthand declaration
  (`background: linear-gradient(…)`, `padding: 0 4px`) that is one row, with the sides spelled
  out in the value.
* **MISMATCH\*** = the app cannot express the CSS; the substitution is named in the row.
* Rows marked **n/a** are web-only declarations with no native counterpart (`cursor`,
  `-webkit-font-smoothing`, `box-sizing`, the canvas frame's own gallery shadow) or the
  status-bar block the app never builds. They are not counted as mismatches.

## 0 · Shared chrome — verified byte-identical in all six frames

Diffed lines 1–141 of V3-Q5 against each of the other five: the *only* per-frame differences
are the frame gradient, the low sun (bottom / width / height / margin-left / gradient) and the
rule fill width. Everything below is literally the same declaration in all six files, so it is
audited once.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 6 | Frame | width | 393px | device width (port convention) | n/a |
| all 6 | Frame | height | 852px | device height (port convention) | n/a |
| all 6 | Frame | position / overflow | relative / hidden | root `View flex:1`, ambient layer `overflow:'hidden'` (v3.tsx:301) | match |
| all 6 | Frame | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sans(w).fontFamily` → `'System'` on iOS (theme.ts:161-171) | match |
| all 6 | Frame | -webkit-font-smoothing | antialiased | native default; AppText sets it on web only (AppText.tsx:120) | n/a |
| all 6 | Frame | flex-shrink | 0 | — (gallery-only) | n/a |
| all 6 | Frame | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | — (gallery card chrome, not app content) | n/a |
| all 6 | Ambient wrapper | position / inset | absolute / 0 | `position:'absolute', top/left/right/bottom:0` (v3.tsx:301) | match |
| all 6 | Ambient wrapper | overflow | hidden | `overflow:'hidden'` (v3.tsx:301) | match |
| all 6 | Ambient wrapper | pointer-events | none | `pointerEvents="none"` (v3.tsx:301) | match |
| all 6 | Corner bloom | left | -40px | `left:-40` (v3.tsx:306) | match |
| all 6 | Corner bloom | top | -140px | `top:-140` (v3.tsx:306) | match |
| all 6 | Corner bloom | width | 540px | `width={540}` (v3.tsx:306) | match |
| all 6 | Corner bloom | height | 270px | `height={270}` (v3.tsx:306) | match |
| all 6 | Corner bloom | border-radius | 50% | `Ellipse rx={270} ry={135}` (v3.tsx:313) | match |
| all 6 | Corner bloom | background | `radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)` | `RadialGradient cx/cy 50%, rx/ry 50%`; stop 0 `#B4AA96` @0.14, stop 0.72 `#131313` @0 (v3.tsx:308-311) | match |
| all 6 | Corner bloom | filter | `blur(6px)` | none — RN SVG has no blur filter; the gradient's own falloff carries it (comment v3.tsx:303-305) | **MISMATCH\*** |
| all 6 | Noise | position / inset | absolute / 0 | `Grain` wrapper `absolute, 0,0,0,0` (Grain.tsx:16) | match |
| all 6 | Noise | background-image | `url('noise-dark.png')` | `require('assets/images/noise-dark.png')`, `resizeMode="repeat"` (v3.tsx:54, 325) | match |
| all 6 | Noise | opacity | 0.12 | `opacity={0.12}` (v3.tsx:325) | match |
| all 6 | Noise | z-order | last child of ambient (above sun) | last child of ambient (v3.tsx:325) | match |
| all 6 | Status bar | height / padding / contents | 54px, `padding:6px 32px 0 46px`, "9:41" 17/600/-0.2px + 3 glyphs, z-index 20 | never built — OS status bar over the safe-area inset | n/a |
| all 6 | Progress track | left / right | 24px / 24px | `left:24, right:24` (v3.tsx:257) | match |
| all 6 | Progress track | top | canvas 66 (app-equiv 12) | `top:12` (v3.tsx:257) | match |
| all 6 | Progress track | height | 4px | `height:4` (v3.tsx:257) | match |
| all 6 | Progress track | border-radius | 2px | `borderRadius:2` (v3.tsx:257) | match |
| all 6 | Progress track | background | `rgba(255,255,255,0.2)` | `NIGHT.track = 'rgba(255,255,255,0.2)'` (v3.tsx:80, 257) | match |
| all 6 | Progress fill | left / top | 0 / 0 (absolute) | flow child at track origin (v3.tsx:258) | match |
| all 6 | Progress fill | height | 4px | `height:4` (v3.tsx:258) | match |
| all 6 | Progress fill | border-radius | 2px | `borderRadius:2` (v3.tsx:258) | match |
| all 6 | Progress fill | background | `#F4F3F0` | `NIGHT.ink = '#F4F3F0'` (v3.tsx:74, 258) | match |
| all 6 | Back row | left | 16px | `left:16` (v3.tsx:267) | match |
| all 6 | Back row | top | canvas 94 (app-equiv 40) | `top: backTop ?? 40`, `backTop` undefined for these steps (v3.tsx:267, welcome.tsx:122/279) | match |
| all 6 | Back row | flex direction / align | row / center | `flexDirection:'row', alignItems:'center'` (v3.tsx:267) | match |
| all 6 | Back row | gap | 9px | `gap:9` (v3.tsx:267) | match |
| all 6 | Back chevron | width / height | 11 / 19 | `width={11} height={19}` (v3.tsx:268) | match |
| all 6 | Back chevron | viewBox | `0 0 11 19` | `viewBox="0 0 11 19"` (v3.tsx:268) | match |
| all 6 | Back chevron | path d | `M9.5 1.5L2 9.5l7.5 8` | `M9.5 1.5L2 9.5l7.5 8` (v3.tsx:269) | match |
| all 6 | Back chevron | fill | none | `fill="none"` (v3.tsx:268) | match |
| all 6 | Back chevron | stroke | `rgba(244,243,240,0.75)` | `backInk = 'rgba(244,243,240,0.75)'` when `lit=false` (v3.tsx:235, 269) | match |
| all 6 | Back chevron | stroke-width | 2.4 | `strokeWidth={2.4}` (v3.tsx:269) | match |
| all 6 | Back chevron | linecap / linejoin | round / round | `strokeLinecap="round" strokeLinejoin="round"` (v3.tsx:269) | match |
| all 6 | Back label | text | "Back" | `Back` (v3.tsx:271) | match |
| all 6 | Back label | font-size | 17px | `fontSize:17` (v3.tsx:271) | match |
| all 6 | Back label | font-weight | 400 | `sans('400')` (v3.tsx:271) | match |
| all 6 | Back label | colour | `rgba(244,243,240,0.75)` | `backInk` (v3.tsx:271) | match |
| all 6 | Back label | letter-spacing | not stated (normal) | none set; AppText drops the variant's inherited tracking when a size is named (AppText.tsx:129) | match |
| all 6 | Low sun | left / margin-left | `50%` / `−width/2` | `left:'50%', marginLeft:-sun/2` (v3.tsx:315) | match |
| all 6 | Low sun | border-radius | 50% | `Ellipse rx=ry=sun/2` (v3.tsx:323) | match |
| all 6 | Low sun | gradient 3rd stop | `<glow> 0` at 72% | `Stop offset="0.72" stopOpacity={0}` (v3.tsx:320) | match |

## 1 · V3-Q5 — "When are you most likely to slip?" (grid, multi)

App row of the field table: `O3_QUESTIONS['triggers']` is index 4 → `O3_Q_FIELD[4] = 7` →
`O3_FIELD[7]` (v3.tsx:130, 163, 732).

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Q5 | Frame field | background | `linear-gradient(180deg, rgb(18,18,16) 0%, rgb(31,30,28) 100%)` | `LinearGradient colors=['rgb(18,18,16)','rgb(31,30,28)']`, default start (0.5,0) → end (0.5,1) = 180deg (v3.tsx:130, 302) | match |
| Q5 | Low sun | bottom | -251px | `off = -251` (v3.tsx:130, 315) | match |
| Q5 | Low sun | width / height | 457 / 457 | `sun = 457` (v3.tsx:130, 315) | match |
| Q5 | Low sun | margin-left | -228.5px | `-sun/2 = -228.5` (v3.tsx:315) | match |
| Q5 | Low sun | gradient stop 0 | `rgba(255,255,255,0.17)` | `O3_COOL '#FFFFFF'` @ `a0 0.17` (v3.tsx:130, 318) | match |
| Q5 | Low sun | gradient stop 45% | `rgba(255,255,255,0.08)` | `#FFFFFF` @ `a45 0.08`, offset 0.45 (v3.tsx:319) | match |
| Q5 | Progress fill | width | 22% | `field.rule = 22` → `width:'22%'` (v3.tsx:130, 232, 258) | match |
| Q5 | Title | text | "When are you most likely to slip?" | identical (v3.tsx:1127) | match |
| Q5 | Title | left / right | 44px / 44px | `left:44, right:44` (v3.tsx:926) | match |
| Q5 | Title | top | canvas 158 (app-equiv 104) | `top:104` (v3.tsx:926) | match |
| Q5 | Title | text-align | center | `center` prop → `textAlign:'center'` (v3.tsx:926, AppText.tsx:124) | match |
| Q5 | Title | font-size | 22px | `fontSize:22` (v3.tsx:926) | match |
| Q5 | Title | font-weight | 500 | `sans('500')` (v3.tsx:926) | match |
| Q5 | Title | line-height | 1.32 (= 29.04px) | `lineHeight:29.04` (v3.tsx:926) | match |
| Q5 | Title | letter-spacing | 0.1px | `letterSpacing:0.1` (v3.tsx:926) | match |
| Q5 | Title | colour | `#F4F3F0` | `INK = '#F4F3F0'` (v3.tsx:696, 926) | match |
| Q5 | Title | text-wrap | pretty | no native equivalent — greedy line-breaking; AppText sets `textWrap:'pretty'` on web only (AppText.tsx:120) | **MISMATCH\*** |
| Q5 | "Select all that apply" | text | "Select all that apply" | identical (v3.tsx:931) | match |
| Q5 | "Select all that apply" | left / right | 0 / 0 | `left:0, right:0` (v3.tsx:930) | match |
| Q5 | "Select all that apply" | top | canvas 226 (app-equiv 172) | `top:172` (v3.tsx:930) | match |
| Q5 | "Select all that apply" | text-align | center | `center` prop (v3.tsx:930) | match |
| Q5 | "Select all that apply" | font-size | 13px | `fontSize:13` (v3.tsx:930) | match |
| Q5 | "Select all that apply" | font-weight | 500 | `sans('500')` (v3.tsx:930) | match |
| Q5 | "Select all that apply" | colour | `rgba(244,243,240,0.55)` | `'rgba(244,243,240,0.55)'` (v3.tsx:930) | match |
| Q5 | Tile row 1 | left / right | 24px / 24px | `left:24, right:24` (v3.tsx:765) | match |
| Q5 | Tile row 1 | top | canvas 278 (app-equiv 224) | `(278−54) + 102·0 = 224` (v3.tsx:763, 765) | match |
| Q5 | Tile row 2 | top | canvas 380 (app-equiv 326) | `224 + 102·1 = 326` (v3.tsx:765) | match |
| Q5 | Tile row 3 | top | canvas 482 (app-equiv 428) | `224 + 102·2 = 428` (v3.tsx:765) | match |
| Q5 | Tile row | display / direction | flex / row | `flexDirection:'row'` (v3.tsx:765) | match |
| Q5 | Tile row | gap | 10px | `gap:10` (v3.tsx:765) | match |
| Q5 | Tile (all 9) | flex | 1 | `flex:1` (v3.tsx:774) | match |
| Q5 | Tile (all 9) | height | 94px | `height:94` (v3.tsx:775) | match |
| Q5 | Tile (all 9) | border-radius | 16px (all four corners) | `borderRadius:16` (v3.tsx:776); no `borderCurve` → circular, as CSS | match |
| Q5 | Tile (all 9) | position | relative | RN default static box, badge is the only absolute child | match |
| Q5 | Tile (all 9) | flex-direction | column | RN default `column` (v3.tsx:773-783) | match |
| Q5 | Tile (all 9) | align-items | center | `alignItems:'center'` (v3.tsx:777) | match |
| Q5 | Tile (all 9) | justify-content | center | `justifyContent:'center'` (v3.tsx:778) | match |
| Q5 | Tile (all 9) | gap | 8px | `gap:8` (v3.tsx:779) | match |
| Q5 | Tile (all 9) | padding | `0 4px` (t0 r4 b0 l4) | `paddingHorizontal:4` (v3.tsx:780) | match |
| Q5 | Tile (all 9) | box-sizing | border-box | RN default | n/a |
| Q5 | Tile, unselected | background | `rgba(255,255,255,0.07)` | `'rgba(255,255,255,0.07)'` (v3.tsx:781) | match |
| Q5 | Tile, unselected | box-shadow | `0 0 0 1px rgba(255,255,255,0.2)` | `'0 0 0 1px rgba(255,255,255,0.2)'` (v3.tsx:782) | match |
| Q5 | Tile, selected (Late night · After stress · Phone in bed) | background | `#F4F3F0` | `INK '#F4F3F0'` (v3.tsx:781) | match |
| Q5 | Tile, selected | box-shadow | `0 0 0 1px rgba(0,0,0,0)` (fully transparent) | `undefined` (v3.tsx:782) | match |
| Q5 | Check badge | right / top | 8px / 8px | `right:8, top:8` (v3.tsx:785) | match |
| Q5 | Check badge | width / height | 15 / 15 | `width:15, height:15` (v3.tsx:785) | match |
| Q5 | Check badge | border-radius | 50% | `borderRadius:7.5` (v3.tsx:785) | match |
| Q5 | Check badge | background | `#131313` | `ON_INK '#131313'` (v3.tsx:697, 785) | match |
| Q5 | Check badge | align / justify | center / center | `alignItems:'center', justifyContent:'center'` (v3.tsx:785) | match |
| Q5 | Check badge tick | width / height | 8 / 6 | `width={8} height={6}` (v3.tsx:786) | match |
| Q5 | Check badge tick | viewBox | `0 0 16 12` | `viewBox="0 0 16 12"` (v3.tsx:786) | match |
| Q5 | Check badge tick | path d | `M1.5 6l4.4 4.5L14.5 1.5` | identical (v3.tsx:787) | match |
| Q5 | Check badge tick | stroke / width | `#F4F3F0` / 2.8 | `INK` / `strokeWidth={2.8}` (v3.tsx:787) | match |
| Q5 | Check badge tick | linecap / linejoin | round / round | identical (v3.tsx:787) | match |
| Q5 | Tile icon (all 9) | width / height | 22 / 22 | `Svg width={22} height={22}` (v3.tsx:565) | match |
| Q5 | Icon "Late night" | viewBox | `0 0 30 30` | `'0 0 30 30'` (v3.tsx:571) | match |
| Q5 | Icon "Late night" | path d | `M17 4 A10.5 10.5 0 1 0 25 20 A8.2 8.2 0 1 1 17 4 Z` | identical (v3.tsx:571) | match |
| Q5 | Icon "Late night" | fill / stroke | fill `#131313` (selected), no stroke | `fill={c}` = `ON_INK` when on (v3.tsx:571, 791) | match |
| Q5 | Icon "Early morning" | viewBox | `0 0 24 24` | default `'0 0 24 24'` (v3.tsx:565) | match |
| Q5 | Icon "Early morning" | path d | `M7 15a5 5 0 0 1 10 0` + `M3 18h18M12 4v3M5 7l2 2M19 7l-2 2` | identical, same order (v3.tsx:575-576) | match |
| Q5 | Icon "Early morning" | stroke-width | 2.5 / 2.5 | 2.5 / 2.5 (v3.tsx:575-576) | match |
| Q5 | Icon "Early morning" | linecap | none on arc, round on rays | none / `strokeLinecap="round"` (v3.tsx:575-576) | match |
| Q5 | Icon "Early morning" | stroke colour | `#F4F3F0` (unselected) | `c = INK` when off (v3.tsx:791) | match |
| Q5 | Icon "Bored daytime" | shapes | `circle cx12 cy12 r8.5` + `M12 7.5V12l3 2` | identical (v3.tsx:583-584) | match |
| Q5 | Icon "Bored daytime" | stroke-width | 2.5 / 2.5 | 2.5 / 2.5 (v3.tsx:583-584) | match |
| Q5 | Icon "Bored daytime" | fill | none / none | `fill="none"` (v3.tsx:583-584) | match |
| Q5 | Icon "Bored daytime" | linecap / linejoin (hands) | round / round | identical (v3.tsx:584) | match |
| Q5 | Icon "After stress" | path d | `M3 16l5-6 4 4 6-8` | identical (v3.tsx:589) | match |
| Q5 | Icon "After stress" | stroke-width | 2.6 | `strokeWidth={2.6}` (v3.tsx:589) | match |
| Q5 | Icon "After stress" | linecap / linejoin | round / round | identical (v3.tsx:589) | match |
| Q5 | Icon "After stress" | stroke colour | `#131313` (selected) | `ON_INK` when on (v3.tsx:791) | match |
| Q5 | Icon "Can’t sleep" | path d | `M3 7v10M3 14h18v3M3 11h18v3` | identical (v3.tsx:594) | match |
| Q5 | Icon "Can’t sleep" | rect | `x5 y8.5 w6 h3 rx1.5` filled | `Rect x={5} y={8.5} width={6} height={3} rx={1.5} fill={c}` (v3.tsx:595) | match |
| Q5 | Icon "Can’t sleep" | stroke-width | 2.5 | 2.5 (v3.tsx:594) | match |
| Q5 | Icon "Can’t sleep" | linecap / linejoin | round / round | identical (v3.tsx:594) | match |
| Q5 | Icon "Weekends" | rect | `x3.5 y5 w17 h15 rx3`, stroke, fill none | identical (v3.tsx:601) | match |
| Q5 | Icon "Weekends" | path d | `M8 3v4M16 3v4M3.5 10h17` | identical (v3.tsx:602) | match |
| Q5 | Icon "Weekends" | stroke-width | 2.5 / 2.5 | 2.5 / 2.5 (v3.tsx:601-602) | match |
| Q5 | Icon "Weekends" | linecap | round (bars only) | `strokeLinecap="round"` on the bars only (v3.tsx:602) | match |
| Q5 | Icon "Drinking" | path d | `M7 3h10l-1.2 13a3.8 3.8 0 0 1-7.6 0Z` + `M9 21h6M12 17v4` | identical (v3.tsx:608-609) | match |
| Q5 | Icon "Drinking" | stroke-width | 2.5 / 2.5 | 2.5 / 2.5 (v3.tsx:608-609) | match |
| Q5 | Icon "Drinking" | linejoin / linecap | round (bowl) / round (stem) | identical (v3.tsx:608-609) | match |
| Q5 | Icon "Home alone" | path d | `M4 11l8-7 8 7` + `M6 10v10h12V10` | identical (v3.tsx:615-616) | match |
| Q5 | Icon "Home alone" | stroke-width | 2.5 / 2.5 | 2.5 / 2.5 (v3.tsx:615-616) | match |
| Q5 | Icon "Home alone" | linecap / linejoin | roof round/round, body join round only | identical (v3.tsx:615-616) | match |
| Q5 | Icon "Phone in bed" | rect | `x7 y3 w10 h18 rx2.5`, fill none | identical (v3.tsx:623) | match |
| Q5 | Icon "Phone in bed" | path d | `M10.5 18h3` | identical (v3.tsx:624) | match |
| Q5 | Icon "Phone in bed" | stroke-width | 2.5 / 2.5 | 2.5 / 2.5 (v3.tsx:623-624) | match |
| Q5 | Icon "Phone in bed" | stroke colour | `#131313` (selected) | `ON_INK` when on (v3.tsx:791) | match |
| Q5 | Tile label (all 9) | font-size | 12px | `fontSize:12` (v3.tsx:792) | match |
| Q5 | Tile label (all 9) | font-weight | 500 | `sans('500')` (v3.tsx:792) | match |
| Q5 | Tile label (all 9) | line-height | 15px | `lineHeight:15` (v3.tsx:792) | match |
| Q5 | Tile label (all 9) | text-align | center | `center` prop (v3.tsx:792) | match |
| Q5 | Tile label | colour unselected / selected | `#F4F3F0` / `#131313` | `on ? ON_INK : INK` (v3.tsx:792) | match |
| Q5 | Tile labels | copy + order | Late night, Early morning, Bored daytime / After stress, Can’t sleep, Weekends / Drinking, Home alone, Phone in bed | identical order and strings, apostrophe is U+2019 in both (v3.tsx:1127) | match |
| Q5 | CTA pill | left / right | 24px / 24px | `left:24, right:24` (v3.tsx:954) | match |
| Q5 | CTA pill | top / bottom | canvas top 744 → 52 from frame bottom | `bottom: O3_MD_CTA_BOTTOM = 852−744−56 = 52` (v3.tsx:414, 954) | match |
| Q5 | CTA pill | height | 56px | `size='md'` → `height:56` (v3.tsx:396, 950) | match |
| Q5 | CTA pill | border-radius | 28px | `borderRadius:28` (v3.tsx:398) | match |
| Q5 | CTA pill | background | `#F4F3F0` | `tone.fill = NIGHT.fill = '#F4F3F0'` (v3.tsx:81, 397) | match |
| Q5 | CTA pill | align / justify | center / center | `alignItems/justifyContent:'center'` (v3.tsx:399-400) | match |
| Q5 | CTA pill | cursor | pointer | — (touch target) | n/a |
| Q5 | CTA label | text | "Continue · 3" (`&middot;`, 3 tiles lit) | `` `Continue · ${chosen.length}` `` — separator is U+00B7 (v3.tsx:951) | match |
| Q5 | CTA label | font-size | 16.5px | `md → fontSize:16.5` (v3.tsx:404) | match |
| Q5 | CTA label | font-weight | 600 | `sans('600')` (v3.tsx:404) | match |
| Q5 | CTA label | colour | `#131313` | `tone.onFill = '#131313'` (v3.tsx:82, 404) | match |
| Q5 | CTA label | letter-spacing | not stated (normal) | `letterSpacing: md ? 0 : 0.2` → 0 (v3.tsx:404) | match |

## 2 · V3-Q6 — "What feeling is most often underneath it?" (grid, multi)

`O3_QUESTIONS['emotions']` index 5 → `O3_Q_FIELD[5] = 8` → `O3_FIELD[8]` (v3.tsx:131).
Eight options → three rows (3 / 3 / 2), so the app takes the three-row top.

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Q6 | Frame field | background | `linear-gradient(180deg, rgb(19,19,17) 0%, rgb(32,31,29) 100%)` | `['rgb(19,19,17)','rgb(32,31,29)']` (v3.tsx:131, 302) | match |
| Q6 | Low sun | bottom | -256px | `off = -256` (v3.tsx:131) | match |
| Q6 | Low sun | width / height | 466 / 466 | `sun = 466` (v3.tsx:131) | match |
| Q6 | Low sun | margin-left | -233px | `-sun/2 = -233` (v3.tsx:315) | match |
| Q6 | Low sun | gradient stop 0 | `rgba(255,236,196,0.19)` | `O3_WARM '#FFECC4'` @ 0.19 (v3.tsx:118, 131, 318) | match |
| Q6 | Low sun | gradient stop 45% | `rgba(255,236,196,0.09)` | `#FFECC4` @ 0.09, offset 0.45 (v3.tsx:319) | match |
| Q6 | Progress fill | width | 26% | `field.rule = 26` (v3.tsx:131) | match |
| Q6 | Title | text | "What feeling is most often underneath it?" | identical (v3.tsx:1128) | match |
| Q6 | Title | top | canvas 158 (app-equiv 104) | `top:104` (v3.tsx:926) | match |
| Q6 | Title | left / right | 44 / 44 | `left:44, right:44` (v3.tsx:926) | match |
| Q6 | Title | size / weight / leading / tracking / colour | 22px / 500 / 1.32 (29.04) / 0.1px / `#F4F3F0` | 22 / `sans('500')` / 29.04 / 0.1 / `INK` (v3.tsx:926) | match |
| Q6 | Title | text-wrap | pretty | greedy wrap on native (web-only in AppText) | **MISMATCH\*** |
| Q6 | "Select all that apply" | top / size / weight / colour | 226 (172) / 13px / 500 / `rgba(244,243,240,0.55)` | 172 / 13 / `sans('500')` / same rgba (v3.tsx:930) | match |
| Q6 | Tile row 1 | top | canvas 278 (app-equiv 224) | `(278−54) + 0 = 224` — `rows.length = 3` (v3.tsx:761-765) | match |
| Q6 | Tile row 2 | top | canvas 380 (app-equiv 326) | 326 (v3.tsx:765) | match |
| Q6 | Tile row 3 | top | canvas 482 (app-equiv 428) | 428 (v3.tsx:765) | match |
| Q6 | Tile row | gap | 10px | `gap:10` (v3.tsx:765) | match |
| Q6 | Row-3 spacer | flex / visibility | `flex:1; visibility:hidden` | `<View style={{flex:1}} />`, rendered after the two tiles (v3.tsx:796) | match |
| Q6 | Tile (all 8) | height / radius / gap / padding | 94 / 16 / 8 / `0 4px` | 94 / 16 / 8 / `paddingHorizontal:4` (v3.tsx:775-780) | match |
| Q6 | Tile, unselected | background / box-shadow | `rgba(255,255,255,0.07)` / `0 0 0 1px rgba(255,255,255,0.2)` | identical (v3.tsx:781-782) | match |
| Q6 | Tile, selected (Anxiety · Boredom) | background / box-shadow | `#F4F3F0` / transparent ring | `INK` / `undefined` (v3.tsx:781-782) | match |
| Q6 | Check badge | geometry + tick | right 8, top 8, 15×15, r50%, `#131313`; tick 8×6 vb `0 0 16 12`, `M1.5 6l4.4 4.5L14.5 1.5`, `#F4F3F0`, 2.8, round | identical (v3.tsx:785-788) | match |
| Q6 | Icon "Loneliness" | shapes | `circle cx12 cy8 r3.6` + `M5 20a7 7 0 0 1 14 0` | identical (v3.tsx:630-631) | match |
| Q6 | Icon "Loneliness" | stroke-width | 2.5 / 2.5 | 2.5 / 2.5 (v3.tsx:630-631) | match |
| Q6 | Icon "Loneliness" | linecap | round (shoulders only) | `strokeLinecap="round"` on the arc only (v3.tsx:631) | match |
| Q6 | Icon "Anxiety" | path d / width / caps | `M3 16l5-6 4 4 6-8` / 2.6 / round · round | identical, shared case with "After stress" (v3.tsx:587-589) | match |
| Q6 | Icon "Anxiety" | stroke colour | `#131313` (selected) | `ON_INK` (v3.tsx:791) | match |
| Q6 | Icon "Boredom" | shapes / widths | `circle r8.5` + `M12 7.5V12l3 2` / 2.5 · 2.5 | identical, shared case with "Bored daytime" (v3.tsx:579-585) | match |
| Q6 | Icon "Boredom" | stroke colour | `#131313` (selected) | `ON_INK` (v3.tsx:791) | match |
| Q6 | Icon "Low mood" | path d | `M12 3.5c3.5 4.2 6 7.2 6 10.2a6 6 0 1 1-12 0c0-3 2.5-6 6-10.2Z` | identical (v3.tsx:636) | match |
| Q6 | Icon "Low mood" | stroke-width / linejoin / fill | 2.5 / round / none | identical (v3.tsx:636) | match |
| Q6 | Icon "Anger" | path d | `M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8` | identical (v3.tsx:640) | match |
| Q6 | Icon "Anger" | stroke-width / linecap | 2.5 / round | identical (v3.tsx:641-643) | match |
| Q6 | Icon "Numbness" | shape | `circle cx12 cy12 r7.5`, fill none | identical (v3.tsx:647) | match |
| Q6 | Icon "Numbness" | stroke-width | 2.5 | 2.5 (v3.tsx:647) | match |
| Q6 | Icon "Numbness" | stroke-dasharray | `3.5 4` | `strokeDasharray="3.5 4"` (v3.tsx:647) | match |
| Q6 | Icon "Habit" | path d | `M18.5 12a6.5 6.5 0 1 1-2-4.7` + `M16 3.5l1 3.5-3.5 1` | identical (v3.tsx:651-652) | match |
| Q6 | Icon "Habit" | stroke-width / caps | 2.5 / 2.5; round, round·round | identical (v3.tsx:651-652) | match |
| Q6 | Icon "Desire" | path d | `M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.6 2.2-5.2.6 1 1.4 1.7 2.3 2C11 7.5 11.4 5 12 3Z` | identical (v3.tsx:658) | match |
| Q6 | Icon "Desire" | stroke-width / linejoin / fill | 2.5 / round / none | identical (v3.tsx:657-662) | match |
| Q6 | Tile label (all 8) | size / weight / leading / align | 12 / 500 / 15 / center | identical (v3.tsx:792) | match |
| Q6 | Tile labels | copy + order | Loneliness, Anxiety, Boredom / Low mood, Anger, Numbness / Habit, Desire | identical (v3.tsx:1128) | match |
| Q6 | CTA pill | geometry | left/right 24, top 744 (bottom 52), h 56, r 28, `#F4F3F0` | identical (v3.tsx:396-400, 954) | match |
| Q6 | CTA label | text | "Continue · 2" | `Continue · ${chosen.length}` (v3.tsx:951) | match |
| Q6 | CTA label | size / weight / colour | 16.5 / 600 / `#131313` | identical (v3.tsx:404) | match |

## 3 · V3-Q7 — "Where does it usually happen?" (grid, multi, two rows)

`O3_QUESTIONS['places']` index 6 → `O3_Q_FIELD[6] = 9` → `O3_FIELD[9]` (v3.tsx:132).

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Q7 | Frame field | background | `linear-gradient(180deg, rgb(20,20,18) 0%, rgb(34,33,31) 100%)` | `['rgb(20,20,18)','rgb(34,33,31)']` (v3.tsx:132, 302) | match |
| Q7 | Low sun | bottom | -261px | `off = -261` (v3.tsx:132) | match |
| Q7 | Low sun | width / height | 475 / 475 | `sun = 475` (v3.tsx:132) | match |
| Q7 | Low sun | margin-left | -237.5px | `-sun/2 = -237.5` (v3.tsx:315) | match |
| Q7 | Low sun | gradient stop 0 / 45% | `rgba(255,255,255,0.21)` / `rgba(255,255,255,0.09)` | `#FFFFFF` @ 0.21 / 0.09 (v3.tsx:132, 318-319) | match |
| Q7 | Progress fill | width | 30% | `field.rule = 30` (v3.tsx:132) | match |
| Q7 | Title | text | "Where does it usually happen?" | identical (v3.tsx:1129) | match |
| Q7 | Title | top / insets | canvas 158 (app-equiv 104) / 44 · 44 | 104 / 44 · 44 (v3.tsx:926) | match |
| Q7 | Title | size / weight / leading / tracking / colour | 22 / 500 / 29.04 / 0.1 / `#F4F3F0` | identical (v3.tsx:926) | match |
| Q7 | Title | text-wrap | pretty | greedy wrap on native | **MISMATCH\*** |
| Q7 | "Select all that apply" | top / size / weight / colour | 226 (172) / 13 / 500 / `rgba(244,243,240,0.55)` | identical (v3.tsx:930) | match |
| Q7 | Tile row 1 | top | canvas 298 (app-equiv 244) | `(298−54) + 0 = 244` — `rows.length = 2` takes the 298 branch (v3.tsx:763) | match |
| Q7 | Tile row 2 | top | canvas 400 (app-equiv 346) | `244 + 102 = 346` (v3.tsx:765) | match |
| Q7 | Tile row | gap | 10px | `gap:10` (v3.tsx:765) | match |
| Q7 | Tile (all 6) | height / radius / gap / padding / align / justify | 94 / 16 / 8 / `0 4px` / center / center | identical (v3.tsx:775-780) | match |
| Q7 | Tile, unselected | background / box-shadow | `rgba(255,255,255,0.07)` / `0 0 0 1px rgba(255,255,255,0.2)` | identical (v3.tsx:781-782) | match |
| Q7 | Tile, selected (Bedroom · My phone) | background / box-shadow | `#F4F3F0` / transparent ring | `INK` / `undefined` (v3.tsx:781-782) | match |
| Q7 | Check badge | geometry + tick | as Q5/Q6 | identical (v3.tsx:785-788) | match |
| Q7 | Icon "Bedroom" | path d + rect | `M3 7v10M3 14h18v3M3 11h18v3` + `x5 y8.5 w6 h3 rx1.5` | identical, shared case with "Can’t sleep" (v3.tsx:590-596) | match |
| Q7 | Icon "Bedroom" | stroke-width / caps / colour | 2.5 / round·round / `#131313` selected | identical (v3.tsx:594, 791) | match |
| Q7 | Icon "Bathroom" | path d | `M12 3.5c3.5 4.2 6 7.2 6 10.2a6 6 0 1 1-12 0c0-3 2.5-6 6-10.2Z` | identical, shared case with "Low mood" (v3.tsx:634-636) | match |
| Q7 | Icon "Bathroom" | stroke-width / linejoin | 2.5 / round | identical (v3.tsx:636) | match |
| Q7 | Icon "Desk" | rect | `x3.5 y4.5 w17 h11.5 rx2`, fill none | identical (v3.tsx:668) | match |
| Q7 | Icon "Desk" | path d | `M9 20h6M12 16.5V20` | identical (v3.tsx:669) | match |
| Q7 | Icon "Desk" | stroke-width / linecap | 2.5 / 2.5, round on stand | identical (v3.tsx:668-669) | match |
| Q7 | Icon "Living room" | path d (3) | `M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3`; `M3.5 13a2 2 0 0 1 4 0v1h9v-1a2 2 0 0 1 4 0v3a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z`; `M6 18v2M18 18v2` | identical, same order (v3.tsx:675-677) | match |
| Q7 | Icon "Living room" | stroke-width | 2.5 / 2.5 / 2.5 | identical (v3.tsx:675-677) | match |
| Q7 | Icon "Living room" | linejoin / linecap | back none; body join round; legs cap round | identical (v3.tsx:675-677) | match |
| Q7 | Icon "My phone" | rect + path | `x7 y3 w10 h18 rx2.5` + `M10.5 18h3` | identical, shared case with "Phone in bed" (v3.tsx:619-624) | match |
| Q7 | Icon "My phone" | stroke-width / colour | 2.5 / `#131313` selected | identical (v3.tsx:623-624, 791) | match |
| Q7 | Icon "Away" | path d | `M12 21s-6.5-5.3-6.5-10a6.5 6.5 0 0 1 13 0c0 4.7-6.5 10-6.5 10Z` | identical (v3.tsx:683) | match |
| Q7 | Icon "Away" | circle | `cx12 cy10.6 r2.2`, filled | identical (v3.tsx:684) | match |
| Q7 | Icon "Away" | stroke-width / linejoin | 2.5 / round | identical (v3.tsx:683) | match |
| Q7 | Tile label (all 6) | size / weight / leading / align | 12 / 500 / 15 / center | identical (v3.tsx:792) | match |
| Q7 | Tile labels | copy + order | Bedroom, Bathroom, Desk / Living room, My phone, Away | identical (v3.tsx:1129) | match |
| Q7 | CTA pill | geometry | left/right 24, top 744 (bottom 52), h 56, r 28, `#F4F3F0` | identical (v3.tsx:396-400, 954) | match |
| Q7 | CTA label | text / size / weight / colour | "Continue · 2" / 16.5 / 600 / `#131313` | identical (v3.tsx:951, 404) | match |

## 4 · V3-Section-3-Intro — "How you've been feeling lately"

`O3_SECTIONS` index 2 (`at: 7`) → `O3_SECTION_FIELD[2] = 11` → `O3_FIELD[11]` (v3.tsx:134, 164, 1177).

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| S3 | Frame field | background | `linear-gradient(180deg, rgb(21,21,19) 0%, rgb(36,35,33) 100%)` | `['rgb(21,21,19)','rgb(36,35,33)']` (v3.tsx:134, 302) | match |
| S3 | Low sun | bottom | -271px | `off = -271` (v3.tsx:134) | match |
| S3 | Low sun | width / height | 493 / 493 | `sun = 493` (v3.tsx:134) | match |
| S3 | Low sun | margin-left | -246.5px | `-sun/2 = -246.5` (v3.tsx:315) | match |
| S3 | Low sun | gradient stop 0 / 45% | `rgba(255,255,255,0.25)` / `rgba(255,255,255,0.11)` | `#FFFFFF` @ 0.25 / 0.11 (v3.tsx:134, 318-319) | match |
| S3 | Progress fill | width | 35% | `field.rule = 35` (v3.tsx:134) | match |
| S3 | Eyebrow | text | "Section 3 of 6" | `'Section 3 of 6'` (v3.tsx:1168) | match |
| S3 | Eyebrow | left / right | 0 / 0 | `left:0, right:0` (v3.tsx:1180) | match |
| S3 | Eyebrow | top | canvas 308 (app-equiv 254) | `top:254` (v3.tsx:1180) | match |
| S3 | Eyebrow | text-align | center | `center` prop (v3.tsx:1180) | match |
| S3 | Eyebrow | font-size | 13px | `fontSize:13` (v3.tsx:1180) | match |
| S3 | Eyebrow | font-weight | 600 | `sans('600')` (v3.tsx:1180) | match |
| S3 | Eyebrow | letter-spacing | 0.3px | `letterSpacing:0.3` (v3.tsx:1180) | match |
| S3 | Eyebrow | text-transform | none stated | none applied (this is not the `label` variant) | match |
| S3 | Eyebrow | colour | `rgba(244,243,240,0.55)` | `'rgba(244,243,240,0.55)'` (v3.tsx:1180) | match |
| S3 | Title | text | "How you’ve been feeling lately" | `'How you’ve been feeling lately'` (v3.tsx:1168) | match |
| S3 | Title | left / right | 36px / 36px | `left:36, right:36` (v3.tsx:1183) | match |
| S3 | Title | top | canvas 338 (app-equiv 284) | `top:284` (v3.tsx:1183) | match |
| S3 | Title | text-align | center | `center` prop (v3.tsx:1183) | match |
| S3 | Title | font-size | 26px | `fontSize:26` (v3.tsx:1183) | match |
| S3 | Title | font-weight | 500 | `sans('500')` (v3.tsx:1183) | match |
| S3 | Title | line-height | 1.3 (= 33.8px) | `lineHeight:33.8` (v3.tsx:1183) | match |
| S3 | Title | letter-spacing | -0.2px | `letterSpacing:-0.2` (v3.tsx:1183) | match |
| S3 | Title | colour | `#F4F3F0` | `INK` (v3.tsx:1183) | match |
| S3 | Title | text-wrap | balance | no native equivalent — greedy wrap; on web AppText emits `pretty`, not `balance` (AppText.tsx:120) | **MISMATCH\*** |
| S3 | Body | text | "A bigger picture than the habit alone. It often points at what’s really driving things." | identical, `’` apostrophe (v3.tsx:1168) | match |
| S3 | Body | left / right | 44px / 44px | `left:44, right:44` (v3.tsx:1186) | match |
| S3 | Body | top | canvas 420 (app-equiv 366) | `top:366` (v3.tsx:1186) | match |
| S3 | Body | text-align | center | `center` prop (v3.tsx:1186) | match |
| S3 | Body | font-size | 15.5px | `fontSize:15.5` (v3.tsx:1186) | match |
| S3 | Body | font-weight | 400 | `sans('400')` (v3.tsx:1186) | match |
| S3 | Body | line-height | 24px | `lineHeight:24` (v3.tsx:1186) | match |
| S3 | Body | colour | `rgba(244,243,240,0.7)` | `'rgba(244,243,240,0.7)'` (v3.tsx:1186) | match |
| S3 | Body | text-wrap | pretty | greedy wrap on native | **MISMATCH\*** |
| S3 | CTA pill | left / right | 24px / 24px | `left:24, right:24` (v3.tsx:1189) | match |
| S3 | CTA pill | top / bottom | canvas 744 → 52 from bottom | `bottom: O3_MD_CTA_BOTTOM = 52` (v3.tsx:414, 1189) | match |
| S3 | CTA pill | height | 56px | `size="md"` → 56 (v3.tsx:396, 1189) | match |
| S3 | CTA pill | border-radius | 28px | `borderRadius:28` (v3.tsx:398) | match |
| S3 | CTA pill | background | `#F4F3F0` | `tone.fill` (v3.tsx:397) | match |
| S3 | CTA label | text | "Continue" | `'Continue'` (v3.tsx:1189) | match |
| S3 | CTA label | font-size / weight / colour | 16.5px / 600 / `#131313` | 16.5 / `sans('600')` / `tone.onFill` (v3.tsx:404) | match |
| S3 | CTA label | letter-spacing | not stated (normal) | 0 for `md` (v3.tsx:404) | match |

## 5 · V3-Q8 — "How are your energy and drive most days?" (single-select list)

`O3_QUESTIONS['energy']` index 7 → `O3_Q_FIELD[7] = 12` → `O3_FIELD[12]` (v3.tsx:135).
Design draws no CTA on this frame; the app renders none (`hasCta = multi || typed || skip` = false,
v3.tsx:737, 948).

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Q8 | Frame field | background | `linear-gradient(180deg, rgb(21,21,19) 0%, rgb(36,35,33) 100%)` | `['rgb(21,21,19)','rgb(36,35,33)']` (v3.tsx:135, 302) | match |
| Q8 | Low sun | bottom | -271px | `off = -271` (v3.tsx:135) | match |
| Q8 | Low sun | width / height | 493 / 493 | `sun = 493` (v3.tsx:135) | match |
| Q8 | Low sun | margin-left | -246.5px | `-sun/2 = -246.5` (v3.tsx:315) | match |
| Q8 | Low sun | gradient stop 0 / 45% | `rgba(255,255,255,0.25)` / `rgba(255,255,255,0.11)` | `#FFFFFF` @ 0.25 / 0.11 (v3.tsx:135) | match |
| Q8 | Progress fill | width | 35% | `field.rule = 35` (v3.tsx:135) | match |
| Q8 | Title | text | "How are your energy and drive most days?" | identical (v3.tsx:1131) | match |
| Q8 | Title | left / right / top | 44 / 44 / canvas 158 (app-equiv 104) | 44 / 44 / 104 (v3.tsx:926) | match |
| Q8 | Title | size / weight / leading / tracking / colour / align | 22 / 500 / 29.04 / 0.1 / `#F4F3F0` / center | identical (v3.tsx:926) | match |
| Q8 | Title | text-wrap | pretty | greedy wrap on native | **MISMATCH\*** |
| Q8 | "Select all that apply" | presence | absent (single-select) | not rendered — gated on `multi` (v3.tsx:929) | match |
| Q8 | Row 1 | top | canvas 310 (app-equiv 256) | `256 + 74·0` (v3.tsx:906) | match |
| Q8 | Row 2 | top | canvas 384 (app-equiv 330) | `256 + 74·1` (v3.tsx:906) | match |
| Q8 | Row 3 | top | canvas 458 (app-equiv 404) | `256 + 74·2` (v3.tsx:906) | match |
| Q8 | Row 4 | top | canvas 532 (app-equiv 478) | `256 + 74·3` (v3.tsx:906) | match |
| Q8 | Row (all 4) | left / right | 24px / 24px | `left:24, right:24` (v3.tsx:904-905) | match |
| Q8 | Row (all 4) | height | 60px | `height:60` (v3.tsx:907) | match |
| Q8 | Row (all 4) | border-radius | 16px | `borderRadius:16` (v3.tsx:908) | match |
| Q8 | Row (all 4) | flex direction | row | `flexDirection:'row'` (v3.tsx:909) | match |
| Q8 | Row (all 4) | align-items | center | `alignItems:'center'` (v3.tsx:910) | match |
| Q8 | Row (all 4) | justify-content | space-between | `justifyContent:'space-between'` (v3.tsx:911) | match |
| Q8 | Row (all 4) | gap | 12px | `gap:12` (v3.tsx:912) | match |
| Q8 | Row (all 4) | padding | `0 22px` (t0 r22 b0 l22) | `paddingHorizontal:22` (v3.tsx:913) | match |
| Q8 | Row, unselected | background | `rgba(255,255,255,0.07)` | `'rgba(255,255,255,0.07)'` (v3.tsx:914) | match |
| Q8 | Row, unselected | box-shadow | `0 0 0 1px rgba(255,255,255,0.22)` | `'0 0 0 1px rgba(255,255,255,0.22)'` (v3.tsx:915) | match |
| Q8 | Row, selected ("Up and down") | background | `#F4F3F0` | `INK` (v3.tsx:914) | match |
| Q8 | Row, selected | box-shadow | `0 0 0 1px rgba(0,0,0,0)` (transparent) | `undefined` (v3.tsx:915) | match |
| Q8 | Row label | font-size | 17px (all four) | `opt.fs ?? 17` — no `fs` on any Q8 option (v3.tsx:917, 1131) | match |
| Q8 | Row label | font-weight | 500 | `sans('500')` (v3.tsx:917) | match |
| Q8 | Row label | line-height | 20px | `lineHeight:20` (v3.tsx:917) | match |
| Q8 | Row label | colour unselected / selected | `#F4F3F0` / `#131313` | `on ? ON_INK : INK` (v3.tsx:917) | match |
| Q8 | Row label | letter-spacing | not stated (normal) | none set; inherited tracking dropped (AppText.tsx:129) | match |
| Q8 | Row labels | copy + order | Running on empty most of the time / Low more often than not / Up and down / Generally good | identical (v3.tsx:1131) | match |
| Q8 | Selected tick | width / height | 16 / 12 | `width={16} height={12}` (v3.tsx:529) | match |
| Q8 | Selected tick | viewBox | `0 0 16 12` | `viewBox="0 0 16 12"` (v3.tsx:529) | match |
| Q8 | Selected tick | path d | `M1.5 6l4.4 4.5L14.5 1.5` | identical (v3.tsx:530) | match |
| Q8 | Selected tick | fill / stroke | none / `#131313` | `fill="none"` / `c = ON_INK` (v3.tsx:529-530, 918) | match |
| Q8 | Selected tick | stroke-width | 2.4 | `strokeWidth={2.4}` (v3.tsx:530) | match |
| Q8 | Selected tick | linecap / linejoin | round / round | identical (v3.tsx:530) | match |
| Q8 | Unselected rows | tick | absent | `on ? <O3Tick/> : null` (v3.tsx:918) | match |
| Q8 | CTA pill | presence | absent | not rendered (v3.tsx:948) | match |

## 6 · V3-Q9 — "How much sense of purpose do you feel right now?" (single-select list)

`O3_QUESTIONS['meaning']` index 8 → `O3_Q_FIELD[8] = 13` → `O3_FIELD[13]` (v3.tsx:136).

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| Q9 | Frame field | background | `linear-gradient(180deg, rgb(22,22,20) 0%, rgb(37,36,34) 100%)` | `['rgb(22,22,20)','rgb(37,36,34)']` (v3.tsx:136, 302) | match |
| Q9 | Low sun | bottom | -277px | `off = -277` (v3.tsx:136) | match |
| Q9 | Low sun | width / height | 503 / 503 | `sun = 503` (v3.tsx:136) | match |
| Q9 | Low sun | margin-left | -251.5px | `-sun/2 = -251.5` (v3.tsx:315) | match |
| Q9 | Low sun | gradient stop 0 / 45% | `rgba(255,255,255,0.27)` / `rgba(255,255,255,0.12)` | `#FFFFFF` @ 0.27 / 0.12 (v3.tsx:136) | match |
| Q9 | Progress fill | width | 39% | `field.rule = 39` (v3.tsx:136) | match |
| Q9 | Title | text | "How much sense of purpose do you feel right now?" | identical (v3.tsx:1132) | match |
| Q9 | Title | left / right / top | 44 / 44 / canvas 158 (app-equiv 104) | 44 / 44 / 104 (v3.tsx:926) | match |
| Q9 | Title | size / weight / leading / tracking / colour / align | 22 / 500 / 29.04 / 0.1 / `#F4F3F0` / center | identical (v3.tsx:926) | match |
| Q9 | Title | text-wrap | pretty | greedy wrap on native | **MISMATCH\*** |
| Q9 | "Select all that apply" | presence | absent | not rendered (v3.tsx:929) | match |
| Q9 | Row 1 | top | canvas 310 (app-equiv 256) | `256 + 74·0` (v3.tsx:906) | match |
| Q9 | Row 2 | top | canvas 384 (app-equiv 330) | `256 + 74·1` (v3.tsx:906) | match |
| Q9 | Row 3 | top | canvas 458 (app-equiv 404) | `256 + 74·2` (v3.tsx:906) | match |
| Q9 | Row 4 | top | canvas 532 (app-equiv 478) | `256 + 74·3` (v3.tsx:906) | match |
| Q9 | Row (all 4) | left / right / height / radius | 24 / 24 / 60 / 16 | identical (v3.tsx:904-908) | match |
| Q9 | Row (all 4) | direction / align / justify / gap / padding | row / center / space-between / 12 / `0 22px` | identical (v3.tsx:909-913) | match |
| Q9 | Row, unselected | background / box-shadow | `rgba(255,255,255,0.07)` / `0 0 0 1px rgba(255,255,255,0.22)` | identical (v3.tsx:914-915) | match |
| Q9 | Row, selected ("Some, but it feels thin") | background / box-shadow | `#F4F3F0` / transparent ring | `INK` / `undefined` (v3.tsx:914-915) | match |
| Q9 | Row 1–3 label | font-size | 17px | `opt.fs ?? 17` (v3.tsx:917) | match |
| Q9 | Row 4 label | font-size | 15.5px | `o('I’m clear on what matters to me', 15.5)` → `opt.fs = 15.5` (v3.tsx:1132, 917) | match |
| Q9 | Row label (all 4) | font-weight | 500 | `sans('500')` (v3.tsx:917) | match |
| Q9 | Row label (all 4) | line-height | 20px (incl. the 15.5 row) | `lineHeight:20` for every row (v3.tsx:917) | match |
| Q9 | Row label | colour unselected / selected | `#F4F3F0` / `#131313` | `on ? ON_INK : INK` (v3.tsx:917) | match |
| Q9 | Row labels | copy + order | I feel pretty lost / Some, but it feels thin / It comes and goes / I’m clear on what matters to me | identical, U+2019 apostrophe (v3.tsx:1132) | match |
| Q9 | Selected tick | 16×12, vb `0 0 16 12`, d `M1.5 6l4.4 4.5L14.5 1.5`, `#131313`, 2.4, round·round | as drawn | `O3Tick c={ON_INK}` (v3.tsx:527-533, 918) | match |
| Q9 | Unselected rows | tick | absent | `on ? … : null` (v3.tsx:918) | match |
| Q9 | CTA pill | presence | absent | not rendered (v3.tsx:948) | match |

## Findings

**350 rows written: 334 match, 8 n/a (web-only declarations and the status bar the app never
builds), 8 MISMATCH. All eight mismatches are MISMATCH\* — CSS that React Native cannot express.
Zero closeable mismatches: every number, hex, alpha, path `d`, offset, radius, weight, leading
and string literal on these six frames is reproduced exactly.**

1. **MISMATCH\*** — corner bloom, `filter: blur(6px)` — all six frames.
   `src/components/onboarding/v3.tsx:306-314`. Design: `filter:blur(6px)` on the 540×270
   `radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)` ellipse.
   App: no filter — `react-native-svg` has no blur primitive, so the substitute is the radial
   gradient's own falloff (stop 0 `#B4AA96` @0.14 → stop 0.72 `#131313` @0). The box, the
   position and both stops are exact; only the 6px softening is absent.
2. **MISMATCH\*** — Q5 title, `text-wrap: pretty`. `v3.tsx:926`. App substitutes the platform's
   greedy line-breaker; `AppText` emits `textWrap:'pretty'` on web only (`AppText.tsx:120`).
3. **MISMATCH\*** — Q6 title, `text-wrap: pretty`. `v3.tsx:926`. Same substitution.
4. **MISMATCH\*** — Q7 title, `text-wrap: pretty`. `v3.tsx:926`. Same substitution.
5. **MISMATCH\*** — Q8 title, `text-wrap: pretty`. `v3.tsx:926`. Same substitution.
6. **MISMATCH\*** — Q9 title, `text-wrap: pretty`. `v3.tsx:926`. Same substitution.
7. **MISMATCH\*** — Section-3 title, `text-wrap: balance`. `v3.tsx:1183`. App substitutes greedy
   breaking on native; on web `AppText` emits `pretty` (the `balance` treatment is reserved for
   the `hero`/`display`/`title` variants, and this line is rendered at the default `body`
   variant), so even the web build states the wrong keyword.
8. **MISMATCH\*** — Section-3 body, `text-wrap: pretty`. `v3.tsx:1186`. Same substitution as 2–6.

### Rows behind the "no closeable mismatch" claim (spot-checks worth recording)

* Field table rows resolve correctly for all six frames: `triggers→O3_FIELD[7]`,
  `emotions→[8]`, `places→[9]`, `Section 3→[11]`, `energy→[12]`, `meaning→[13]`
  (`v3.tsx:130-136, 163-164`). Gradient ends, sun box, sun hang, glow colour and both stated
  stops are literal matches in every case, as is each rule width (22 / 26 / 30 / 35 / 35 / 39%).
* Grid top selection is right on both branches: 9 and 8 options → three rows → canvas 278
  (app 224); 6 options → two rows → canvas 298 (app 244) — `v3.tsx:763`.
* All 23 tile glyphs across Q5/Q6/Q7 match path-for-path including the shared cases
  (`Bored daytime`/`Boredom`, `After stress`/`Anxiety`, `Can’t sleep`/`Bedroom`,
  `Phone in bed`/`My phone`, `Low mood`/`Bathroom`) — `v3.tsx:569-689`.
* Text literals are byte-exact including punctuation: the CTA separator is U+00B7 (`&middot;`)
  and every apostrophe is U+2019 (`&rsquo;`) — verified by codepoint on `Can’t sleep`,
  `I’m clear on what matters to me` and `How you’ve been feeling lately`.
* Q9's fourth row is the only row on these six frames that drops to 15.5px, and the app carries
  it as the option's own `fs` while keeping the 20px leading (`v3.tsx:917, 1132`).
* The two frames that draw no button (Q8, Q9) get none: `hasCta` is false for single-select
  (`v3.tsx:737`), and the tap self-advances after 260 ms (`v3.tsx:742-746`) — motion the canvas
  does not draw, so nothing to compare.
