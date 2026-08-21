# Pass 1 — Today (bundle "Email Login")

Second-reader audit. Frames read in full from
`.uifinal/pretty/final/Email Login/` and cross-checked against the raw
`.uifinal/final/Email Login/` for prettifier loss (none found in these four).

Frames:

| Slug | Screen label | Lines |
| --- | --- | --- |
| `Today-Home.html` | Today Home | 907 |
| `Today-Home-II.html` | Today Home II | 610 |
| `Today-Home-Task.html` | Today Home Task | 638 |
| `Today-Home-III.html` | Today Home III | 350 |

App under audit:

- `/Users/admin/Documents/tideline/src/app/(app)/today.tsx` (643 lines)
- `/Users/admin/Documents/tideline/src/components/today/kit.tsx` (463 lines)

Supporting reads (values quoted, not audited as targets):
`src/lib/theme.ts`, `src/components/ui/AppText.tsx`,
`src/components/ui/press-scale.tsx`, `src/components/ui/Grain.tsx`,
`src/lib/backend/convex.ts`, `src/content/curriculum84.ts`,
`src/content/seedLessons.ts`, `src/lib/lessonArt.ts`.

## Canvas → app coordinate rule

Every frame is 393 × 852 with a 54px status bar the app never builds, so
**app y = canvas y − 54**. Both are given in every row. The app's own origin for
that arithmetic is the bottom of the 37pt mark row
(`today.tsx:126`, `height: 37` = `paddingTop: 10` + a 27pt mark), which lands at
app y 37 = canvas y 91.

There is **no global `box-sizing` reset** in `_helmet.html` (checked: it carries
only a `body` rule, a link colour and two keyframes). Elements that need
border-box declare it inline (the status bar, the urge bar). Everything else is
**content-box**, which matters in exactly one place on these frames — the Trend
pill — and is reported as such.

---

## 1. Frame chrome — shared by all four frames

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| all | screen root | background | `#F4F3F0` | `colors.bg` = `#F4F3F0` (`today.tsx:121`) | match |
| all | screen root | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sansFamily.ios = 'System'` via `sans()` | match |
| all | screen root | size | 393 × 852 | device viewport | match (frame is the reference) |
| all | grain overlay | image | `url('noise-dark.png')` | `require('assets/images/noise-dark.png')` (`today.tsx:35`) | match |
| all | grain overlay | opacity | `0.07` | `0.07` (`today.tsx:122`) | match |
| all | grain overlay | inset | `inset:0` | `position:absolute; top/left/right/bottom: 0` (`Grain.tsx:16`) | match |
| all | grain overlay | tiling | `background-image` with no `background-size` → repeats at file size | `resizeMode="repeat"` (`Grain.tsx:17`) | match |
| all | grain overlay | z-order | first child of root → below everything | first child of root View (`today.tsx:122`) | match |
| all | status bar | height / content | 54px, `9:41` + 3 glyphs | not built | out of scope (canvas fact) |
| all | laurel mark | left / top | `left:16` / `top:64` → app y 10 | `paddingHorizontal:16`, `paddingTop:10` (`today.tsx:126`) | match |
| all | laurel mark | size | 27 × 27 | `width:27, height:27` (`today.tsx:127`) | match |
| all | laurel mark | object-fit | `contain` | `contentFit="contain"` | match |
| all | profile glyph | right / top | `right:16` / `top:64` → app y 10 | row `paddingHorizontal:16`, `alignItems:'flex-start'` | match |
| all | profile glyph | svg size / viewBox | `26 × 26`, `0 0 26 26` | `26 × 26`, `0 0 26 26` (`today.tsx:129`) | match |
| all | profile glyph | circle | `cx13 cy9.5 r4 fill=none stroke=#55534E sw=2` | same; stroke `colors.textMuted` = `#55534E` (`today.tsx:130`) | match |
| all | profile glyph | path `d` | `M4.5 22.5c1-4.5 4.2-6.8 8.5-6.8s7.5 2.3 8.5 6.8` | verbatim (`today.tsx:131`) | match |
| all | profile glyph | stroke-linecap | `round` | `strokeLinecap="round"` | match |
| all | urge bar | top / height | `top:705` → app y 651, `height:64` | 64pt bar pinned under the pager (`today.tsx:181`) | match |
| all | urge bar | radius | `18px 18px 0 0` | `borderTopLeftRadius:18, borderTopRightRadius:18` | match |
| all | urge bar | background | `#131313` | `colors.ink` = `#131313` | match |
| all | urge bar | layout | `flex; align-items:center; gap:13; padding:0 16; box-sizing:border-box` | `flexDirection:'row', alignItems:'center', gap:13, paddingHorizontal:16` | match |
| all | urge bar circle | size / radius / fill | 40 × 40, 50%, `rgba(244,243,240,0.12)` | 40 × 40, `borderRadius:20`, same rgba (`today.tsx:189`) | match |
| all | urge bar wave | svg / viewBox | `20 × 13`, `0 0 26 16` | `20 × 13`, `0 0 26 16` (`today.tsx:190`) | match |
| all | urge bar wave | path `d` | `M2 12c4-7 8 3 12-3s8 2 10-2` | verbatim | match |
| all | urge bar wave | stroke | `#F4F3F0`, `2.4`, `round`, `fill:none` | `#F4F3F0`, `2.4`, `round`, Svg `fill="none"` | match |
| all | urge bar title | size / weight / colour | `14.5px` / `600` / `#F7F6F2` | `14.5` / `sans('600')` / `#F7F6F2` (`today.tsx:195`) | match |
| all | urge bar sub | margin-top / size / weight / colour | `2` / `12.5px` / `400` / `rgba(244,243,240,0.55)` | `2` / `12.5` / `sans('400')` / same rgba | match |
| all | urge bar sub | copy | `Urge surfing · SOS` | `Urge surfing · SOS` | match |
| all | urge bar chevron | svg / viewBox / `d` | `7 × 12`, `0 0 8 14`, `M1.5 1.5L6.5 7l-5 5.5` | identical (`today.tsx:198`) | match |
| all | urge bar chevron | stroke | `rgba(244,243,240,0.5)`, `2`, `round` | identical | match |
| all | tab bar | top / bg / z | `top:769` → app y 715, `rgba(255,255,255,0.95)`, `z-index:14` | `StoicTabBar` | out of scope (separate file) |

---

## 2. `Today-Home` — page one

### 2.1 Day count

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Today-Home | `Day 41` | left | `16` | `marginLeft:16` (`today.tsx:228`) | match |
| Today-Home | `Day 41` | top | `114` → app y 60 | `37 + marginTop 23` = 60 | match |
| Today-Home | `Day 41` | font-size | `27px` | `27` | match |
| Today-Home | `Day 41` | weight | `600` | `sans('600')` | match |
| Today-Home | `Day 41` | line-height | `1` → 27px | `lineHeight: 27` | match |
| Today-Home | `Day 41` | letter-spacing | `-0.2px` | `-0.2` | match |
| Today-Home | `Day 41` | colour | `#1D1C1A` | `colors.text` = `#1D1C1A` | match |

### 2.2 Score card shell

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Today-Home | score card | left / right | `12` / `12` | `marginHorizontal:12` (`today.tsx:272`) | match |
| Today-Home | score card | top | `164` → app y 110 | `60 + 27 + 23` = 110 | match |
| Today-Home | score card | height | `222` | `222` | match |
| Today-Home | score card | border-radius | `22` (circular) | `22` + `borderCurve:'continuous'` (`today.tsx:274-275`) | MISMATCH (see F-9) |
| Today-Home | score card | overflow | `hidden` | `overflow:'hidden'` | match |
| Today-Home | score card | background | `#0C0D10` | `#0C0D10` | match |
| Today-Home | score card | box-shadow | `0 0 0 1px rgba(0,0,0,0.25), 0 14px 30px rgba(30,28,24,0.28)` | identical string | match |

### 2.3 Score card sky

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Today-Home | sky | gradient angle | `180deg` | `x1=0 y1=0 x2=0 y2=1` | match |
| Today-Home | sky | stops | `#08090B 0%`, `#0E1014 55%`, `#151920 100%` | `0/#08090B`, `0.55/#0E1014`, `1/#151920` (`today.tsx:284-286`) | match |
| Today-Home | sky | extent | `inset:0` (222 tall) | `Rect 0,0,100%,222` | match |
| Today-Home | star 1 | box → centre | `left:116 top:34 2×2` → c(117,35) r1 | `Circle cx=117 cy=35 r=1` (`today.tsx:318`) | match |
| Today-Home | star 1 | fill | `rgba(244,243,240,0.45)` | `#F4F3F0` @ `0.45` | match |
| Today-Home | star 2 | box → centre | `right:150 top:56 2.5×2.5` → c(W−151.25, 57.25) r1.25 | `cx={W-151.25} cy=57.25 r=1.25` | match |
| Today-Home | star 2 | fill | `rgba(244,243,240,0.35)` | `#F4F3F0` @ `0.35` | match |
| Today-Home | star 3 | box → centre | `left:52 top:96 2×2` → c(53,97) r1 | `cx=53 cy=97 r=1` | match |
| Today-Home | star 3 | fill | `rgba(244,243,240,0.3)` | `#F4F3F0` @ `0.3` | match |
| Today-Home | halo | box → centre | `right:24 top:34 84×84` → c(W−66,76) r42 | `cx={W-66} cy=76 r=42` (`today.tsx:321`) | match |
| Today-Home | halo | gradient stops | `closest-side`, `rgba(223,220,211,0.15) 0%` → `rgba(223,220,211,0) 72%` (2 stops, linear) | 3 stops: `0/0.15`, `0.4/0.07`, `0.72/0` (`today.tsx:310-312`) | MISMATCH (see F-4) |
| Today-Home | halo | colour | `rgb(223,220,211)` | `#DFDCD3` = rgb(223,220,211) | match |
| Today-Home | halo | filter | `blur(5px)` | none | MISMATCH\* — no substitute named; gradient falloff alone (see F-5) |
| Today-Home | moon | box → centre | `right:48 top:56 30×30` → c(W−63,71) r15 | `cx={W-63} cy=71 r=15` (`today.tsx:323`) | match |
| Today-Home | moon | gradient centre | `circle at 36% 30%` | `cx="36%" cy="30%"` (fx/fy default to cx/cy) | match |
| Today-Home | moon | gradient extent | farthest-corner = √((0.64·30)²+(0.70·30)²) = 28.4535 → 94.845% | `rx/ry = 94.8%` = 28.44 | match (Δ 0.014px) |
| Today-Home | moon | stops | `#F5F3EC 0%`, `#D9D6CD 46%`, `#A5A197 100%` | `0/#F5F3EC`, `0.46/#D9D6CD`, `1/#A5A197` | match |
| Today-Home | moon | box-shadow | `0 0 26px rgba(223,220,211,0.26)` | erf-fitted radial, r=41, stops `0.366/0.13 · 0.512/0.085 · 0.683/0.042 · 0.829/0.015 · 1/0` (`today.tsx:302-308, 322`) | MISMATCH\* — RN SVG has no shadow blur; substitute named in code and numerically defensible |
| Today-Home | paint order | z | grain → stars → halo → moon-shadow → moon | same order (`today.tsx:318-323`) | match |

### 2.4 Score card ridges and water

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Today-Home | ridge svg | viewBox | `0 0 369 76` | `0 0 369 76` (`today.tsx:327`) | match |
| Today-Home | ridge svg | preserveAspectRatio | `none` | `none` | match |
| Today-Home | ridge svg | left/right/top | `0` / `0` / `102` | `left:0, right:0, top:102` | match |
| Today-Home | ridge svg | width / height | `100%` / `64` | `100%` / `64` | match |
| Today-Home | `hsH1` | stops | `#232830` → `#0A0B0D`, vertical | `0/#232830`, `1/#0A0B0D`, `x2=0 y2=1` | match |
| Today-Home | `hsH2` | stops | `#2A303B` → `#0C0D10`, vertical | `0/#2A303B`, `1/#0C0D10` | match |
| Today-Home | ridge 1 | path `d` | `M-4,76 L-4,50 Q56,22 124,48 Q160,61 188,68 L188,76 Z` | verbatim (`today.tsx:338`) | match |
| Today-Home | ridge 2 | path `d` | `M168,76 L168,66 Q226,57 270,36 Q316,17 373,25 L373,76 Z` | verbatim (`today.tsx:339`) | match |
| Today-Home | waterline glow | top / height | `154` / `12` | `Svg top:154`, `Rect y=0 h=12` (`today.tsx:343,360`) | match |
| Today-Home | waterline glow | gradient | `180deg, rgba(233,199,138,0) 0%` → `rgba(233,199,138,0.12) 100%` | `#E9C78A` @0 → `#E9C78A` @0.12 (`#E9C78A` = rgb(233,199,138)) | match |
| Today-Home | waterline glow | filter | `blur(3px)` | none, and no substitute named | MISMATCH\* (see F-6) |
| Today-Home | sea | top / bottom | `166` → `0` (height 56) | `Rect y=12 h=56` inside a Svg at top 154 (`today.tsx:361`) | match |
| Today-Home | sea | gradient | `180deg, #131720 0%, #0B0C0F 100%` | `0/#131720`, `1/#0B0C0F` | match |
| Today-Home | reflection shaft | box → centre | `right:50 top:168 38×44` → c(W−69, y190) | `Ellipse cx={W-69} cy=36` (local, = abs 190) `rx=22 ry=26` (`today.tsx:364`) | MISMATCH\* — grown from 19×22 to 22×26 to stand in for `blur(5px)`; substitute named |
| Today-Home | reflection shaft | gradient | linear `180deg rgba(223,220,211,0.15)` → `rgba(223,220,211,0)` | radial `cx50% cy0% rx50% ry100%`, `#DFDCD3` 0.13 → 0 (`today.tsx:355-358`) | MISMATCH\* — linear-in-a-blurred-box redrawn as a radial; substitute named; peak alpha 0.13 vs 0.15 |
| Today-Home | shaft z | order | after the sea div | drawn after the sea Rect | match |

### 2.5 Score card content

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Today-Home | `Recovery score` | left / top | `20` / `22` | `left:20, top:22` (`today.tsx:367`) | match |
| Today-Home | `Recovery score` | size / weight / colour | `13px` / `500` / `#F7F6F2` | `13` / `sans('500')` / `#F7F6F2` | match |
| Today-Home | Trend pill | right / top | `16` / `16` | `right:16, top:16` (`today.tsx:371-372`) | match |
| Today-Home | Trend pill | height | `height:30` **content-box** + `border:1px` → **32 outer** | `height:30` + `borderWidth:1` (RN is border-box) → **30 outer** (`today.tsx:373,375`) | MISMATCH (see F-3) |
| Today-Home | Trend pill | border-radius | `15` | `15` | match |
| Today-Home | Trend pill | border | `1px solid rgba(244,243,240,0.28)` | `borderWidth:1`, `borderColor:'rgba(244,243,240,0.28)'` | match |
| Today-Home | Trend pill | background | `rgba(20,19,16,0.25)` | `rgba(20,19,16,0.25)` | match |
| Today-Home | Trend pill | padding / gap | `0 12px` / `6` | `paddingHorizontal:12`, `gap:6` | match |
| Today-Home | Trend icon | svg / viewBox | `14 × 10`, `0 0 14 10` | `14 × 10`, `0 0 14 10` (`today.tsx:384`) | match |
| Today-Home | Trend icon | path 1 `d` | `M1 8.5L5 4.5l2.5 2L12.5 1.5` | verbatim | match |
| Today-Home | Trend icon | path 2 `d` | `M9.2 1.5h3.3V4.8` | verbatim | match |
| Today-Home | Trend icon | stroke | `#F4F3F0`, `1.8`, `round`, `round`, `fill:none` | identical + Svg `fill="none"` | match |
| Today-Home | `Trend` label | size / weight / colour | `12px` / `600` / `#F4F3F0` | `12` / `sans('600')` / `#F4F3F0` | match |
| Today-Home | score row | left / top | `20` / `48` | `left:20, top:48` (`today.tsx:391`) | match |
| Today-Home | score row | align / gap | `baseline` / `9` | `alignItems:'baseline', gap:9` | match |
| Today-Home | score number | size / weight | `43px` / `500` | `43` / `sans('500')` | match |
| Today-Home | score number | letter-spacing | `1.5px` | `1.5` | match |
| Today-Home | score number | colour | `#F7F6F2` | `#F7F6F2` | match |
| Today-Home | score number | font-variant | not declared → proportional figures | `fontVariant:['tabular-nums']` (`today.tsx:392`) | MISMATCH (see F-8) |
| Today-Home | delta group | align / gap | `baseline` / `3` | `alignItems:'baseline', gap:3` | match |
| Today-Home | delta arrow | svg / viewBox / `d` | `9 × 8`, `0 0 10 9`, `M5 0.5L9.5 8.5H0.5z` | identical for `delta > 0` (`today.tsx:397-398`) | match |
| Today-Home | delta arrow | fill | `rgba(244,243,240,0.8)` | same | match |
| Today-Home | delta value | size / weight / colour | `13px` / `500` / `rgba(244,243,240,0.8)` | `13` / `sans('500')` / same | match |
| Today-Home | delta group | states | frame draws `▲ 18` only | app adds a `▼` path and hides at `delta === 0` | extra state (not drawn by frame) |
| Today-Home | progress track | left / right / bottom | `20` / `20` / `50` | same (`today.tsx:405`) | match |
| Today-Home | progress track | height / radius / fill | `6` / `3` / `rgba(244,243,240,0.14)` | `6` / `3` / same | match |
| Today-Home | progress fill | width / height / radius / fill | `60%` / `100%` / `3` / `rgba(244,243,240,0.92)` | `${progress*100}%` / `6` / `3` / same | match |
| Today-Home | rank row | left / right / bottom | `20` / `20` / `22` | same (`today.tsx:408`) | match |
| Today-Home | rank row | justify | `space-between` | `justifyContent:'space-between'` | match |
| Today-Home | rank labels | size / weight / colour | `11px` / `500` / `rgba(244,243,240,0.55)` | `11` / `sans('500')` / same | match |
| Today-Home | rank labels | copy | `Navigator · 1,150` / `Helmsman · 1,300` | `{rank.name} · {rank.at.toLocaleString()}` etc. | match (data-driven) |
| Today-Home | card grain | opacity / position | `0.06`, last child, `inset:0` | `<Grain opacity={0.06} />` last child (`today.tsx:419`) | match |

### 2.6 "This morning" row + readings strip

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Today-Home | `This morning` | left / top | `20` / `402` → app y 348 | `paddingHorizontal:20`, `marginTop:16` after a 222 card at 110 → 348 (`today.tsx:237`) | match |
| Today-Home | `This morning` | size / weight / colour | `12.5px` / `600` / `#8B8882` | `12.5` / `sans('600')` / `colors.textSoft` = `#8B8882` | match |
| Today-Home | row chevron | right / top | `20` / `402` → app y 348 | right edge of the same row, `alignItems:'flex-start'` | match |
| Today-Home | row chevron | svg / viewBox / `d` | `7 × 12`, `0 0 8 14`, `M1.5 1.5L6.5 7l-5 5.5` | identical (`today.tsx:585-586`) | match |
| Today-Home | row chevron | stroke | `#B0AEA8`, `2`, `round`, `fill:none` | literal `#B0AEA8`, `2`, `round` | match |
| Today-Home | readings row | left / right / top | `12` / `12` / `428` → app y 374 | `marginHorizontal:12`; flow lands at ≈374.4 (see §5) | match (Δ ≈0.4) |
| Today-Home | readings row | height | `48` | `48` (`kit.tsx:80`) | match |
| Today-Home | readings row | columns / gap | `grid 1fr 1fr` / `8` | `flexDirection:'row'`, two `flex:1`, `gap:8` | match |
| Today-Home | reading pill | radius | `12` | `12` + `borderCurve:'continuous'` (`kit.tsx:68`) | MISMATCH (see F-9) |
| Today-Home | reading pill | background | `#FFFFFF` | `colors.surface` = `#FFFFFF` | match |
| Today-Home | reading pill | box-shadow | `0 0 0 1px rgba(0,0,0,0.06)` | identical string | match |
| Today-Home | mood dots | left / top / bottom | `13` / `0` / `0` | `left:13, top:0, bottom:0` (`kit.tsx:22`) | match |
| Today-Home | mood dots | align / gap | `center` / `5` | `alignItems:'center', gap:5` | match |
| Today-Home | mood dot | size / radius | `9 × 9` / `50%` | `9 × 9` / `4.5` | match |
| Today-Home | mood dot | on fill | `#131313` | `colors.ink` = `#131313` | match |
| Today-Home | mood dot | off fill | `rgba(19,19,19,0.13)` | `rgba(19,19,19,0.13)` | match |
| Today-Home | mood dot | selected ring | `0 0 0 1.5px #FFFFFF, 0 0 0 2.5px #131313` on index 2 | same string when `i === value` (`kit.tsx:33`) | match |
| Today-Home | mood dots | fill rule | dots 0–2 filled, ring on 2, 3–4 off | `on = i <= value`; ring on `i === value` | match |
| Today-Home | mood word | right / top / bottom | `13` / `0` / `0`, centred | `right:13, top:0, bottom:0, justifyContent:'center'` (`kit.tsx:70`) | match |
| Today-Home | mood word | size / weight / colour | `12px` / `600` / `#1D1C1A` | `12` / `sans('600')` / `colors.text` | match |
| Today-Home | mood word | copy | `Fine` (= index 2) | `MOOD_WORD[2] = 'Fine'` (`today.tsx:37`) | match |
| Today-Home | energy bars | left / bottom | `13` / `9` | `left:13, bottom:9` (`kit.tsx:45`) | match |
| Today-Home | energy bars | align / gap | `flex-end` / `3.5` | `alignItems:'flex-end', gap:3.5` | match |
| Today-Home | energy bar | width / radius | `6.5` / `3` | `6.5` / `3` | match |
| Today-Home | energy bar | heights | `9, 13, 17, 21, 25` | `[9, 13, 17, 21, 25]` | match |
| Today-Home | energy bar | on / off fill | `#131313` / `rgba(19,19,19,0.13)` | `colors.ink` / same rgba | match |
| Today-Home | energy bar | selected ring | `0 0 0 1.5px #FFFFFF, 0 0 0 2.5px #131313` on index 1 | same when `i === value` (`kit.tsx:56`) | match |
| Today-Home | energy word | copy | `Low` (= index 1) | `ENERGY_WORD[1] = 'Low'` (`today.tsx:38`) | match |

---

## 3. Last-30-days grid — geometry

Everything below is read off `Today-Home.html` lines 439–690 (raw confirmed).

### 3.1 Card box

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Today-Home | held card | left / right | `12` / `12` | `marginHorizontal:12` (`today.tsx:530`) | match |
| Today-Home | held card | top | `492` → app y 438 | flow lands at ≈438.4 (374.4 + 48 + 16) | match (Δ ≈0.4) |
| Today-Home | held card | height | `184` | `184` | match |
| Today-Home | held card | border-radius | `20` | `20` + `borderCurve:'continuous'` | MISMATCH (see F-9) |
| Today-Home | held card | overflow | `hidden` | not set (`today.tsx:528-536`) | MISMATCH (see F-10) |
| Today-Home | held card | background | `#FFFFFF` | `colors.surface` = `#FFFFFF` | match |
| Today-Home | held card | box-shadow | `0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)` | identical string | match |
| Today-Home | `Last 30 days` | left / top | `20` / `20` | `left:20, top:20` (`today.tsx:537`) | match |
| Today-Home | `Last 30 days` | size / weight / colour | `13px` / `500` / `#1D1C1A` | `13` / `sans('500')` / `colors.text` | match |
| Today-Home | `27 held` | right / top | `20` / `20` | `right:20, top:20` (`today.tsx:538`) | match |
| Today-Home | `27 held` | size / weight / colour | `12.5px` / `500` / `#8B8882` | `12.5` / `sans('500')` / `colors.textSoft` | match |

### 3.2 Grid origin, pitch and column count

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| container left (card-relative) | `35` | `left: 35` (`today.tsx:539`) | match |
| container top (card-relative) | `58` | `top: 58` | match |
| container width | `299` (fixed) — right edge at 334, so 35/35 either side of a 369-wide card | `right: 35` (stretches: `width − 24 − 70`) | match at 393; app generalises the fixed width to a symmetric inset |
| display | `flex` + `flex-wrap: wrap` | `flexDirection:'row', flexWrap:'wrap'` | match |
| gap (column) | `11` (from the `gap: 11px` shorthand) | `gap = (inner − 200) / 9` = 11.0 at 393 | match |
| gap (row) | `11` (same shorthand) | same `gap` value — RN `gap` sets both axes | match |
| dot size | `20 × 20` | `20 × 20` (`today.tsx:544-545`) | match |
| dot radius | `50%` | `10` | match |
| horizontal pitch | `20 + 11 = 31` | `31` at 393 | match |
| columns | `floor((299 + 11) / 31) = 10`; `10·20 + 9·11 = 299` exactly, no slack | 10 at 393 (gap derived so the fit is exact) | match |
| rows | `ceil(30 / 10) = 3` | 3 | match |
| row pitch | `20 + 11 = 31` | `31` | match |
| row baselines (card-relative) | `58`, `89`, `120` | same | match |
| grid bottom (card-relative) | `120 + 20 = 140`; 44pt of card below it | same | match |
| dot count | 30 | `Array.from({length: 30})` (`today.tsx:99`) | match |

### 3.3 Fill rules

The frame draws exactly two tones. Enumerating the 30 divs in DOM order,
1-indexed, the **rings are at 9, 17 and 26** — 3 rings, 27 filled, and the
header reads `27 held`. So the counter equals the filled count; it is not an
independent string.

| Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- |
| held tone | `background: #131313`, no ring | `backgroundColor: colors.ink` (`#131313`), `boxShadow: undefined` (`today.tsx:547-548`) | match |
| not-held tone | no background, `box-shadow: inset 0 0 0 1.5px rgba(0,0,0,0.18)` | `backgroundColor: undefined`, `boxShadow:'inset 0 0 0 1.5px rgba(0,0,0,0.18)'` | match |
| tone count | 2 (no third tone drawn) | 2 | match |
| header counter | `27 held` = 30 − 3 rings | `held.filter(Boolean).length` + `' held'` (`today.tsx:538`) | match |
| ordering | not stated by the frame | oldest first: index 0 = 29 days ago, index 29 = today (`today.tsx:99-104`) | not contradicted |

### 3.4 Edge cases the app must answer (frame is silent on all of these)

| Case | App behaviour (`today.tsx:91-104`) | Note |
| --- | --- | --- |
| day carries a `lapse` event | ring | the frame's only stated meaning for a ring |
| day precedes `user.createdAt` | ring — same tone as a lapse | deliberate (comment at `today.tsx:88-90`); the frame has no third tone, so a pre-account day is indistinguishable from a lapse |
| `user.createdAt` missing | every non-lapsed day held | reasonable |
| multiple lapses on one day | one ring (keys are `Set`-deduped) | correct |
| the sign-up day itself | the slot uses `now − k·86 400 000`, i.e. the *same clock time* N days ago, not local midnight. If the account was created yesterday at 20:00 and `now` is today 09:00, yesterday's probe is 09:00 < 20:00 → yesterday rings even though the account existed for part of it | off-by-one for the first ~24 h |
| DST boundary in the window | `now − k·86 400 000` drifts one hour across a transition, so the derived local date key can repeat or skip a day inside the 30 | a day can be double-counted or missed |
| future/timezone-shifted lapse | key built from `event.createdAt` in local time, same convention as the slot key | consistent |
| 0 held / 30 held | `0 held` / `30 held`; all rings or all fills | frame does not draw these |
| narrow screen (`width < 294`) | `gap` clamps to 0 (`Math.max(0, …)`), 10 × 20 = 200 > inner, so the row wraps to fewer than 10 columns and the block grows to 4 rows (80pt) — still inside the card's 126pt of space | degrades safely |
| wide screen | `right: 35` stretches the container and `gap` grows with it; 10 columns hold | the canvas's fixed `width: 299` does not |
| fractional gap | `gap` is computed so `10·20 + 9·gap` equals `inner` exactly; a float rounding up by 1 ulp at some widths could wrap the 10th dot to the next row | latent, not observed at 375/390/393/402/428 |

---

## 4. `Today-Home-II` and `Today-Home-Task` — page two

### 4.1 Section row

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| II / Task | `This week` | left / top | `20` / `138` → app y 84 | `paddingHorizontal:20`, `marginTop:47` from 37 → 84 (`today.tsx:483`) | match |
| II / Task | `This week` | size / weight / colour | `12.5px` / `600` / `#8B8882` | `12.5` / `sans('600')` / `colors.textSoft` | match |
| II / Task | `Library` | right / top | `20` / `136` → app y 82 | inner View `marginTop: -2` from row top 84 → 82 (`today.tsx:483, 583`) | match |
| II / Task | `Library` | size / weight | `11px` / `600` | `11` / `sans('600')` | match |
| II / Task | `Library` | letter-spacing | `0.5px` | `0.5` | match |
| II / Task | `Library` | colour | `#8B8882` | `colors.textSoft` | match |
| II / Task | `Library` | text-transform | none (mixed case) | none | match |
| II / Task | row gap | gap | `5` | `gap: 5` | match |
| II / Task | row chevron | svg / viewBox / stroke | `7 × 12`, `0 0 8 14`, `#B0AEA8` sw 2 round | identical | match |

### 4.2 Lesson card

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| II / Task | lesson card | left / right / top | `12` / `12` / `164` → app y 110 | `marginHorizontal:12`; flow ≈110.4 (`today.tsx:485-486`) | match (Δ ≈0.4) |
| II / Task | lesson card | height | `152` | `152` (`today.tsx:434`) | match |
| II / Task | lesson card | radius | `20` | `20` + `borderCurve:'continuous'` | MISMATCH (see F-9) |
| II / Task | lesson card | overflow | `hidden` | `overflow:'hidden'` | match |
| II / Task | lesson card | background | `#FFFFFF` | `colors.surface` | match |
| II / Task | lesson card | box-shadow | `0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)` | identical | match |
| II / Task | title | left / top | `20` / `26` | `left:20, top:26` (`today.tsx:441`) | match |
| II / Task | title | right bound / max lines | none declared, no clamp | `right:168`, `numberOfLines={1}` | MISMATCH (see F-7) |
| II / Task | title | size / weight | `19px` / `600` | `19` / `sans('600')` | match |
| II / Task | title | letter-spacing | `-0.2px` | `-0.2` | match |
| II / Task | title | colour | `#1D1C1A` | `colors.text` | match |
| II / Task | meta | left / top | `20` / `56` | `left:20, top:56` (`today.tsx:444`) | match |
| II / Task | meta | size / weight / colour | `12.5px` / `400` / `#8B8882` | `12.5` / `sans('400')` / `colors.textSoft` | match |
| II / Task | meta | copy | `Lesson 5 · Week II` | `Lesson ${orderIndex + 1} · Week ${week}` → e.g. `Lesson 12 · Week 2` (`today.tsx:488`) | MISMATCH (see F-2) |
| II / Task | card chevron | right / top | `16` / `22` | `right:16, top:22` (`today.tsx:448`) | match |
| II / Task | card chevron | svg / viewBox | `8 × 14`, `0 0 8 14` | `8 × 14`, `0 0 8 14` | match |
| II / Task | card chevron | stroke | `#8B8882`, `2`, `round` | `colors.textSoft` = `#8B8882`, `2`, `round` | match |
| II / Task | progress bars | left / right / bottom | `20` / `20` / `20` | same (`today.tsx:452`) | match |
| II / Task | progress bars | count / gap | 6 / `7` | 6 / `gap: 7` | match |
| II / Task | progress bar | flex / height / radius | `1` / `4.5` / `2.5` | `flex:1` / `4.5` / `2.5` | match |
| II / Task | progress bar | on / off fill | `#131313` / `rgba(19,19,19,0.15)` | `colors.ink` / `rgba(19,19,19,0.15)` | match |
| II / Task | progress bars | drawn state | 4 of 6 filled | `done = lessonsDone % 6` | match (data-driven) |

### 4.3 Lesson dome

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| II / Task | dome | right / top | `44` / `16` | `right:44, top:16` (`kit.tsx:430`) | match |
| II / Task | dome | size | `108 × 80` | `108 × 80` | match |
| II / Task | dome | radius | `999px 999px 0 0` (CSS scales to 54px circular corners) | `borderTopLeftRadius:999, borderTopRightRadius:999` (RN clamps the same way) | match |
| II / Task | dome | overflow | `hidden` | `overflow:'hidden'` | match |
| II / Task | dome | background | `180deg, #F1F0EA 0%, #E8E6DF 100%` | Rect + `0/#F1F0EA`, `1/#E8E6DF` (`kit.tsx:433-436, 447`) | match |
| II / Task | dome glow | box → ellipse | `left:50% top:10 70×58 ml:-35` → c(54,39) rx35 ry29 | `Ellipse cx=54 cy=39 rx=35 ry=29` (`kit.tsx:448`) | match |
| II / Task | dome glow | gradient | `closest-side, rgba(226,186,120,0.5)` → `rgba(226,186,120,0) 75%` | `0/0.5`, `0.42/0.22`, `0.75/0` — the mid stop is exactly on the linear ramp (`kit.tsx:438-440`) | match |
| II / Task | dome glow | colour | `rgb(226,186,120)` | `#E2BA78` | match |
| II / Task | dome glow | filter | `blur(3px)` | none | MISMATCH\* — no RN equivalent; gradient falloff alone |
| II / Task | dome svg | viewBox / fit | `0 0 108 80`, inset 0, 100%/100% | `108 × 80`, `viewBox="0 0 108 80"` | match |
| II / Task | shadow ellipse | geometry / fill | `cx55 cy66 rx21 ry3.5`, `rgba(40,38,32,0.12)` | identical (`kit.tsx:449`) | match |
| II / Task | tag rect | geometry / radius | `x37 y30 w36 h23 rx5` | identical (`kit.tsx:450`) | match |
| II / Task | tag rect | gradient | `#4A4843` → `#1D1C19`, vertical | `0/#4A4843`, `1/#1D1C19` | match |
| II / Task | tag rect | transform | `rotate(-16 54 42)` on the wrapping `<g>` | `rotate(-16 54 42)` applied per element | match |
| II / Task | tag hole | geometry / fill | `cx44.5 cy41.5 r3`, `#F1F0EA` | identical (`kit.tsx:451`) | match |
| II / Task | tag rules | path `d` | `M52 37.5 L66 37.5 M52 45 L61 45` | verbatim (`kit.tsx:453`) | match |
| II / Task | tag rules | stroke | `rgba(255,255,255,0.28)`, `2.2`, `round` | identical | match |
| II / Task | string | path `d` | `M42 38 C 34 30, 32 20, 33 10` | verbatim (`kit.tsx:459`) | match |
| II / Task | string | stroke | `#C4C3BC`, `1.8`, `none` fill, `round` | identical | match |
| II / Task | paint order | z | bg → glow → shadow → tag → string | same order | match |

### 4.4 Task card shell and night

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| II / Task | task card | left / right / top | `12` / `12` / `340` → app y 286 | `marginHorizontal:12`; flow ≈286.4 (`today.tsx:495-496`) | match (Δ ≈0.4) |
| II / Task | task card | height | `274` | `274` (`kit.tsx:200`) | match |
| II / Task | task card | radius | `20` | `20` + `borderCurve:'continuous'` | MISMATCH (see F-9) |
| II / Task | task card | overflow / bg / shadow | `hidden` / `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)` | identical | match |
| II / Task | night band | left/right/top/height | `0` / `0` / `0` / `124` | same (`kit.tsx:160`) | match |
| II / Task | night band | overflow | `hidden` | `overflow:'hidden'` | match |
| II / Task | night band | gradient | `180deg, #0B0C0F 0%, #12151B 60%, #1A2027 100%` | `0/#0B0C0F`, `0.6/#12151B`, `1/#1A2027` (`kit.tsx:163-166`) | match |
| II / Task | star 1 | left/top/size/fill | `58` / `18` / `2×2` / `rgba(244,243,240,0.45)` | identical, radius 1 (`kit.tsx:171`) | match |
| II / Task | star 2 | left/top/size/fill | `112` / `40` / `1.5×1.5` / `rgba(244,243,240,0.3)` | identical, radius 0.75 (`kit.tsx:172`) | match |
| II / Task | star 3 | right/top/size/fill | `124` / `22` / `2×2` / `rgba(244,243,240,0.35)` | identical (`kit.tsx:173`) | match |
| II / Task | moon halo | left/top/size | `26` / `12` / `44×44` | identical (`kit.tsx:174`) | match |
| II / Task | moon halo | gradient | `closest-side, rgba(223,220,211,0.16)` → `rgba(223,220,211,0) 72%` | `#DFDCD3` @0.16 → 0 @0.72 | match |
| II / Task | crescent | left / top / size | `38` / `22` / `20×20` | identical (`kit.tsx:175-176`) | match |
| II / Task | crescent | viewBox / `d` | `0 0 24 24`, `M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z` | verbatim (`kit.tsx:148`) | match |
| II / Task | crescent | fill | `#E8E6DC` | `#E8E6DC` | match |
| II / Task | ridge svg | viewBox / PAR | `0 0 361 96` / `none` | `0 0 361 96` / `none` (`kit.tsx:178`) | match |
| II / Task | ridge svg | box | `inset:0` inside a 124-tall band → 100% × 124 | `width="100%" height={124}` | match (correctly stretched from 96) |
| II / Task | ridge | path `d` / fill | `M-4,96 L-4,72 Q80,58 170,68 Q260,80 365,66 L365,96 Z` / `#171B22` | verbatim / `#171B22` (`kit.tsx:179`) | match |

### 4.5 Task card object — `Today-Home-II` (generic state, phone)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| II | warm glow | right/top/size | `40` / `20` / `70×70` | identical (`kit.tsx:306`) | match |
| II | warm glow | gradient | `closest-side, rgba(226,186,120,0.20)` → `rgba(226,186,120,0) 74%` | `#E2BA78` @0.2 → 0 @0.74 | match |
| II | phone body | right/top/size/radius | `60` / `26` / `38×52` / `5` | identical (`kit.tsx:307`) | match |
| II | phone body | gradient | `180deg, #343A44 0%, #262B33 100%` | `Face` Rect `0/#343A44`, `1/#262B33` (`kit.tsx:273-278`) | match |
| II | screen band 1 | left/right/top/height/radius/fill | `4` / `4` / `7` / `14` / `3` / `rgba(244,243,240,0.10)` | identical (`kit.tsx:309`) | match |
| II | screen band 2 | left/right/top/height/radius/fill | `4` / `4` / `24` / `14` / `3` / `rgba(244,243,240,0.06)` | identical (`kit.tsx:310`) | match |
| II | speaker pill | left/top/size/radius/fill | `14` / `12` / `10×3` / `1.5` / `rgba(244,243,240,0.35)` | identical (`kit.tsx:311`) | match |
| II | tilted card | left/top/size/radius | `8` / `5` / `9×17` / `2` | identical (`kit.tsx:312-323`) | match |
| II | tilted card | fill / inner ring | `#0E1116` / `inset 0 0 0 1px rgba(244,243,240,0.22)` | identical strings | match |
| II | tilted card | transform | `rotate(-14deg)` | `[{rotate:'-14deg'}]` | match |
| II | caption | left / right / top | `20` / `24` / `194` | `left:20, right:24, top:194` (`kit.tsx:255`) | match |
| II | caption | size / weight | `18px` / `600` | `18` / `sans('600')` | match |
| II | caption | line-height | `26px` | `26` | match |
| II | caption | letter-spacing | `-0.1px` | `-0.1` | match |
| II | caption | colour | `#1D1C1A` | `colors.text` | match |
| II | caption | text-wrap | `pretty` | native has no equivalent (`AppText` sets it on web only) | MISMATCH\* — substitute: none on native |
| II | caption | copy | `Put your phone somewhere difficult to access before you sleep.` | `DAY_STEPS[0].caption`, byte-identical (`today.tsx:46`) | match |
| II | card label icon | circle size/radius/fill | `34×34` / `50%` / `#131313` | `34×34` / `17` / `colors.ink` (`kit.tsx:210`) | match |
| II | card label icon | crescent | `15 × 15`, `0 0 24 24`, `#F4F3F0` | `Crescent size={15} color="#F4F3F0"` (`kit.tsx:218`) | match |
| II | card label | left / top / gap | `20` / `142` / `10` | identical (`kit.tsx:209`) | match |
| II | card label | size / weight / colour | `13px` / `600` / `#1D1C1A` | `13` / `sans('600')` / `colors.text` (`kit.tsx:224`) | match |
| II | card label | copy | `Today’s task` (curly apostrophe) | `'Today’s task'` (curly) | match |
| II | check ring | right / top / size | `20` / `146` / `26×26` | identical (`kit.tsx:229-236`) | match |
| II | check ring | radius / ring | `50%` / `inset 0 0 0 2px rgba(19,19,19,0.22)` | `13` / identical string | match |
| II | check ring | done state | not drawn | ink fill + a 13pt tick | extra state |

### 4.6 Task card object — `Today-Home-Task` (lesson state)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Task | warm glow | presence | absent | absent in `LessonNightArt` (`kit.tsx:335`) | match |
| Task | bed post | left/top/size/radius/fill | `96` / `62` / `7×38` / `2.5` / `#2C3844` | identical (`kit.tsx:338`) | match |
| Task | mattress | left/top/size/radius/fill | `101` / `80` / `64×17` / `5` / `#394656` | identical (`kit.tsx:339`) | match |
| Task | pillow | left/top/size/radius/fill | `106` / `73` / `22×9` / `4` / `#55677C` | identical (`kit.tsx:340`) | match |
| Task | bed foot | left/top/size/radius/fill | `158` / `90` / `5×10` / `2` / `#26303C` | identical (`kit.tsx:341`) | match |
| Task | shelf | right/top/size/radius/fill | `64` / `66` / `42×8` / `3` / `#2C3844` | identical (`kit.tsx:342`) | match |
| Task | shelf leg | right/top/size/radius/fill | `81` / `74` / `7×28` / `2` / `#26303C` | identical (`kit.tsx:343`) | match |
| Task | phone on shelf | right/top/size/radius/fill | `76` / `42` / `13×22` / `3` / `#DCE3EA` | identical (`kit.tsx:344`) | match |
| Task | seal | right/top/size/radius/fill | `60` / `34` / `17×17` / `50%` / `#E9D2A4` | identical, radius 8.5 (`kit.tsx:346`) | match |
| Task | seal tick | svg / viewBox / `d` | `9 × 8`, `0 0 9 8`, `M1.5 4l2 2 4-4.5` | verbatim (`kit.tsx:347-348`) | match |
| Task | seal tick | stroke | `#131313`, `1.6`, `round`, `round`, `fill:none` | identical | match |
| Task | label icon | svg / viewBox | `16 × 16`, `0 0 20 20` | `16 × 16`, `0 0 20 20` (`kit.tsx:212`) | match |
| Task | label icon path 1 | `d` / stroke-width | `M3 15.5V6` / `1.7` | verbatim / `1.7` (`kit.tsx:213`) | match |
| Task | label icon path 1 | stroke-linecap | `round` | **absent** → butt | MISMATCH (see F-1) |
| Task | label icon path 2 | `d` / stroke-width / linejoin | `M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5` / `1.7` / `round` | verbatim / `1.7` / `round` (`kit.tsx:214`) | match |
| Task | label icon path 2 | stroke-linecap | `round` | **absent** → butt | MISMATCH (see F-1) |
| Task | label icon circle | geometry / fill | `cx5.6 cy8.9 r1.5` / `#F4F3F0` | identical (`kit.tsx:215`) | match |
| Task | card label | copy | `Surviving the night` | `step.lesson` = `dayLesson.task.cardTitle` = `"Surviving the night"` (`curriculum84.ts:80`) | match |
| Task | caption | left / right / top | `20` / `24` / `190` | `left:20, right:24, top:190` (`kit.tsx:251`) | match |
| Task | caption | size / weight | `15px` / `500` | `15` / `sans('500')` | match |
| Task | caption | line-height | `22px` | `22` | match |
| Task | caption | letter-spacing | not declared → 0 | not set; `AppText` drops the inherited `-0.1` because the caller names its own size | match |
| Task | caption | colour | `#1D1C1A` | `colors.text` | match |
| Task | caption | text-wrap | `pretty` | none on native | MISMATCH\* — substitute: none |
| Task | caption | copy | `Put the device you use for porn out of reach before you sleep.` | `dayLesson.task.cardSummary`, byte-identical (`curriculum84.ts:81`) | match |

---

## 5. `Today-Home-III` — page three

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| III | `Goal & pledge` | left / top | `20` / `138` → app y 84 | `marginTop:47` from 37 (`today.tsx:505`) | match |
| III | `Goal & pledge` | size / weight / colour | `12.5px` / `600` / `#8B8882` | `12.5` / `sans('600')` / `colors.textSoft` | match |
| III | `Past pledges` | right / top | `20` / `136` → app y 82 | `actionOffset: -2` | match |
| III | `Past pledges` | size / weight / ls / colour | `11px` / `600` / `0.5px` / `#8B8882` | identical | match |
| III | pledge card | left / right / top | `12` / `12` / `164` → app y 110 | `marginHorizontal:12`; flow ≈110.4 | match (Δ ≈0.4) |
| III | pledge card | height | `140` | `140` (`today.tsx:610`) | match |
| III | pledge card | overflow | `hidden` | `overflow:'hidden'` | match |
| III | pledge card | radius | `14` | `14` + `borderCurve:'continuous'` | MISMATCH (see F-9) |
| III | pledge card | background | `#FFFFFF` | `colors.surface` | match |
| III | pledge card | box-shadow | `0 0 0 1px rgba(0,0,0,0.06)` | identical | match |
| III | open quote | left / top | `16` / `26` | `left:16, top:26` (`today.tsx:617`) | match |
| III | open quote | font-family | `Georgia,'Times New Roman',serif` | `fonts.quote` → iOS `Georgia`, web `Georgia,'Times New Roman',serif` | match |
| III | open quote | size / line-height | `32px` / `20px` | `32` / `20` | match |
| III | open quote | colour | `#C9C0AC` | `#C9C0AC` | match |
| III | open quote | glyph | `&ldquo;` | `&ldquo;` | match |
| III | body | left / right / top | `38` / `38` / `32` | `left:38, right:38, top:32` (`today.tsx:618`) | match |
| III | body | font-family | Georgia stack | `fonts.quote` | match |
| III | body | size / line-height | `17.5px` / `27px` | `17.5` / `27` | match |
| III | body | colour | `#3A3934` | `#3A3934` | match |
| III | body | weight | not declared → 400 | inherited `sans('400')`; only `fontFamily` overridden | match |
| III | body | letter-spacing | not declared → 0 | dropped by `AppText` (caller names its own size) | match |
| III | body | text-wrap | `pretty` | none on native | MISMATCH\* — substitute: none |
| III | reason run | underline | `border-bottom:1px solid rgba(0,0,0,0.22)` + `padding-bottom:1px` (rule sits 1px below the inline box) | `textDecorationLine:'underline'`, `textDecorationColor:'rgba(0,0,0,0.22)'` (`today.tsx:621`) | MISMATCH\* — RN has no border on an inline text run; substitute is the font's own underline metric, which sits higher and crosses descenders; `textDecorationColor` is iOS-only |
| III | reason run | copy split | stem `I am abstaining today because `, run `the mornings are mine again`, trailing `.` | `indexOf('because ')` split, same three parts (`today.tsx:596-598`) | match |
| III | signature row | left / right / bottom | `16` / `16` / `11` | identical (`today.tsx:628`) | match |
| III | signature row | align / justify | `flex-end` / `space-between` | `alignItems:'flex-end', justifyContent:'space-between'` | match |
| III | `Signed 7:12 AM` | size / weight | `11px` / `500` | `11` / `sans('500')` | match |
| III | `Signed 7:12 AM` | letter-spacing / colour | `0.3px` / `#A5A29B` | `0.3` / `#A5A29B` | match |
| III | name | font-family | `'Snell Roundhand','Savoye LET','Segoe Script',cursive` | `fonts.script` → iOS `Snell Roundhand`, web the same stack | match |
| III | name | size / line-height | `24px` / `1` = 24 | `24` / `24` | match |
| III | name | colour | `#1D1C1A` | `colors.text` | match |
| III | name | transform | `rotate(-3.5deg)` | `[{rotate:'-3.5deg'}]` | match |
| III | rule | margin-top / width / height | `4` / `92` / `1` | `4` / `92` / `1` (`today.tsx:635`) | match |
| III | rule | alignment / fill | `margin-left:auto` (right-aligned) / `rgba(0,0,0,0.2)` | `alignItems:'flex-end'` / same rgba | match |
| III | unsigned state | — | not drawn | app adds `Not signed yet today` + a bare rule | extra state |

---

## 6. Vertical flow — canvas absolute vs app flow

The canvas pins every block absolutely; the app rebuilds page one, two and three
as a flow whose gaps are stated in `marginTop`. Where a gap sits under a text
block, the app's y depends on the platform line box, because `AppText` deletes
the inherited variant leading whenever a caller names its own `fontSize` and no
`lineHeight` (`AppText.tsx:130`). The section-row label is `12.5pt` with no
stated leading, so its box is the platform natural (~14.9 on iOS SF) where the
canvas implies 14.5.

| Block | Canvas top | App equivalent (−54) | App computed | Δ |
| --- | --- | --- | --- | --- |
| mark row | 64 | 10 | 10 | 0 |
| `Day 41` | 114 | 60 | 37 + 23 = 60 | 0 |
| score card | 164 | 110 | 60 + 27 + 23 = 110 | 0 |
| `This morning` | 402 | 348 | 110 + 222 + 16 = 348 | 0 |
| readings strip | 428 | 374 | 348 + ~14.9 + 11.5 ≈ 374.4 | ≈ +0.4 |
| held card | 492 | 438 | 374.4 + 48 + 16 ≈ 438.4 | ≈ +0.4 |
| `This week` / `Goal & pledge` | 138 | 84 | 37 + 47 = 84 | 0 |
| lesson / pledge card | 164 | 110 | 84 + ~14.9 + 11.5 ≈ 110.4 | ≈ +0.4 |
| task card | 340 | 286 | 110.4 + 152 + 24 ≈ 286.4 | ≈ +0.4 |
| urge bar | 705 | 651 | pinned to the bottom above the tab bar | n/a |

Sub-half-point; recorded, not raised as a finding.

---

## Findings

Row count behind this: **305 audited (element, property) rows** across the four
frames, plus 45 rows in the grid-geometry, edge-case and vertical-flow tables.
Twelve findings are MISMATCH or MISMATCH\*; the rest match.

**F-1 — bed icon strokes lose their round caps.**
`src/components/today/kit.tsx:213` and `:214`.
Current: `<Path d="M3 15.5V6" stroke="#F4F3F0" strokeWidth={1.7} />` and
`<Path d="M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5" stroke="#F4F3F0" strokeWidth={1.7} strokeLinejoin="round" />`.
Design (`Today-Home-Task.html:369, 371`): both paths carry
`stroke-linecap="round"`. At 1.7 units on a 16pt icon every stroke end renders
square instead of round.

**F-2 — the lesson meta prints an Arabic week where the design prints a Roman numeral.**
`src/app/(app)/today.tsx:488`.
Current: `` `Lesson ${lesson.lesson.orderIndex + 1} · Week ${lesson.lesson.week}` `` →
`Lesson 12 · Week 2`.
Design: `Lesson 5 · Week II`.
`lesson.week` is a number (`seedLessons.ts`), and `roman()` already exists at
`src/lib/lessonArt.ts:35`. The same component's own no-lesson fallback on
`today.tsx:488` already says `'Week I'`, so the two branches disagree with each
other.
Secondary, and a place the canvas contradicts itself: `orderIndex + 1` is a
**global** lesson number (0-based across all 104 lessons; week 1 alone holds 11).
Under global numbering "Lesson 5" always falls in Week I, so the frame's own
pairing of `5` with `II` is unreachable. The evidence therefore supports a
**within-week** lesson index, not a global one.

**F-3 — Trend pill is 2px shorter than the design.**
`src/app/(app)/today.tsx:373` (`height: 30`) with `:375` (`borderWidth: 1`).
The frame's pill declares no `box-sizing`, and `_helmet.html` carries no reset,
so it is content-box: `30` content + `2 × 1px` border = **32px outer**, spanning
canvas y 16–48 inside the card. RN is always border-box, so the app renders
**30px outer**, y 16–46. Design radius `15` also implies a 30-tall *inner* box.
Fix is `height: 32` (or `height: 30` with the border drawn as a shadow ring).

**F-4 — halo mid-stop is rounded.**
`src/app/(app)/today.tsx:311`.
Current: `<Stop offset="0.4" stopColor="#DFDCD3" stopOpacity={0.07} />`.
Design: the CSS is a two-stop linear ramp `0.15 @ 0%` → `0 @ 72%`, so 40% is
`0.15 × (1 − 0.4/0.72)` = **0.0666667**, not `0.07`. The companion dome glow at
`kit.tsx:439` gets this exactly right (`0.42 → 0.22` is on the line), which is
what makes the rounding here visible as an inconsistency rather than a choice.
Either drop the mid stop or set it to `0.0667`.

**F-5 — halo `filter: blur(5px)` dropped with no substitute.**
`src/app/(app)/today.tsx:321` (and the gradient at `:309-313`).
Design (`Today-Home.html:248`): `filter: blur(5px)` on the 84×84 disc.
RN SVG cannot express it (MISMATCH\*). Unlike the moon shadow and the water
shaft, no compensating change was made and no comment names the substitute —
the gradient is drawn at its unblurred extent.

**F-6 — waterline glow `filter: blur(3px)` dropped with no substitute.**
`src/app/(app)/today.tsx:360` (gradient `:345-348`).
Design (`Today-Home.html:296`): a 12px band with `filter: blur(3px)`, which in
the frame softens the band into the ridge above and the sea below. The app draws
a hard-edged 12px rect. MISMATCH\*; substitute would be extending the gradient a
few points either side of the 12px band.

**F-7 — lesson title is clamped and right-bounded where the design is neither.**
`src/app/(app)/today.tsx:441`.
Current: `numberOfLines={1}` and `right: 168` (text right edge at x 201 in a
369-wide card).
Design (`Today-Home-II.html:423-433`): `left:20; top:26` with no right bound and
no line clamp; the title is free to run under the dome, which starts at x 217.
The app truncates 16pt earlier than the art does and forbids a second line.

**F-8 — score number forces tabular figures.**
`src/app/(app)/today.tsx:392`.
Current: `fontVariant: ['tabular-nums']`.
Design (`Today-Home.html:364-371`): no `font-variant`/`font-feature-settings`,
so `-apple-system` renders its default proportional figures. At 43pt the width
of `1,240` differs measurably, which shifts the delta group that sits 9pt to its
right.

**F-9 — every card corner is a squircle where the design draws a circular arc.**
`src/app/(app)/today.tsx:275` (score), `:435` (lesson), `:533` (held), `:612`
(pledge); `src/components/today/kit.tsx:68` (reading pill), `:201` (task card).
Current: `borderCurve: 'continuous'` alongside the radius.
Design: plain `border-radius: 22/20/20/14/12/20`, i.e. circular corners.
Systematic and probably deliberate, but it is a difference from the literal on
six surfaces and is recorded here rather than assumed.

**F-10 — held card drops `overflow: hidden`.**
`src/app/(app)/today.tsx:528-536`.
Design (`Today-Home.html:446`): the card declares `overflow: hidden`; the app's
`HeldStrip` is the only one of the five cards on these frames that does not.
Inert at the design's 3-row grid (which ends 44pt above the card's bottom), but
it is the one thing standing between a 4th wrapped row on a narrow screen and a
grid that spills past the card edge.

**F-11 — `text-wrap: pretty` has no native equivalent.**
`src/components/today/kit.tsx:251` and `:255`, `src/app/(app)/today.tsx:618`.
Design declares `text-wrap: pretty` on both task captions and the pledge body.
`AppText` applies it on web only (`AppText.tsx:120-124`). MISMATCH\*; no native
substitute exists — the orphan-avoidance the frame's line breaks assume will not
happen on device.

**F-12 — the pledge underline is a text decoration, not a border.**
`src/app/(app)/today.tsx:621`.
Design (`Today-Home-III.html:159-164`):
`border-bottom: 1px solid rgba(0,0,0,0.22)` with `padding-bottom: 1px`, i.e. a
rule one pixel below the inline box's bottom edge, clear of the descenders.
Current substitute: `textDecorationLine: 'underline'` +
`textDecorationColor: 'rgba(0,0,0,0.22)'`, which draws at the font's own
underline position — higher, and through the descenders of `g` in "mornings".
`textDecorationColor` is also ignored on Android. MISMATCH\*.

### Observations that are not property mismatches

- **`Today-Home-II`'s exact composition is unreachable for days 1–84.**
  `today.tsx:112-117` prefers `lessonForDay(day)` over `DAY_STEPS`, and the
  curriculum covers days 1–84, so the crescent + 18pt-caption + `PhoneDownArt`
  state the frame draws first fires on day 86. Both states exist and both are
  faithful; only the reachability is worth knowing.
- **Stale comment.** `kit.tsx:157` says the task night is "96 tall"; it is 124
  (the `96` is the ridge viewBox height, not the band).
- The `held` grid's `right: 35` generalises the canvas's fixed `width: 299`
  correctly for non-393 widths; the canvas's literal would leave a growing gap
  on the right.
