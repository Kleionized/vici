# Pass 1 — Campaign Map (Email Login · Campaign-Map, Campaign-Map-II, Campaign-Map-III)

Second reader. Frames read in full from `.uifinal/pretty/final/Email Login/` and cross-checked
against `.uifinal/final/Email Login/` (raw). App read in full:

- `/Users/admin/Documents/tideline/src/components/onboarding/art.tsx`
  (`CampaignMapField` 1006–1029, `CAMPAIGN_WEEKS` 1037–1050, `CampaignMapRail` 1059–1065,
  `CampaignWeekArt` 1072–1234, `CampaignWeekRow` 1236–1267, `Wash` 36–52, `Noise` 54–63)
- `/Users/admin/Documents/tideline/src/components/onboarding/v3.tsx`
  (`O3Reading` 1604–1622, `PagerTap` 1630–1641, `O3Shell` 212–284, `Ambient` 287–328,
  `O3PaperCTA` 421–443)
- `/Users/admin/Documents/tideline/src/app/(onboarding)/welcome.tsx` line 139
  (`reading: { paper: 'map', backTop: 64 - 54 }`), line 142 (`NOBAR` includes `reading`)

Canvas convention: frame `top` includes the 54px status bar the app never builds, so
**app top = canvas top − 54**. Both are given below.

Page mapping verified: frame I = weeks IV·III·II·I = app `page 1`; frame II = VIII·VII·VI·V =
`page 2`; frame III = XII·XI·X·IX = `page 3`.

---

## 1. Frame chrome — identical byte-for-byte on all three frames

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 3 | screen | size | 393 × 852 | device frame | match |
| all 3 | screen | background | `linear-gradient(180deg,#F6F4F0 0%,#FCFBF9 100%)` | `LinearGradient ['#F6F4F0','#FCFBF9']`, start `{0,0}` end `{0,1}` (art 1009) | match |
| all 3 | screen | font-family | `-apple-system,'SF Pro Text',system-ui,…` | `sans()` → `sansFamily[w]` = `'System'` on iOS (theme.ts 161–170) | match |
| all 3 | screen | box-shadow | `0 0 0 1px rgba(0,0,0,.09), 0 16px 40px rgba(40,38,32,.16)` | not drawn | match (device chrome, out of scope) |
| all 3 | top bloom | box | left −40, top −140, 540 × 270 | `left:-40, top:-140, 540×270` (art 1016) | match |
| all 3 | top bloom | fill | `radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)` | `Wash` stops `0%→rgb(180,170,150)@0.14`, `72%→rgb(19,19,19)@0` (art 1012–1015) | match |
| all 3 | top bloom | shape | `closest-side` ellipse (rx 270 / ry 135) on a `border-radius:50%` box | `RadialGradient rx=50% ry=50%` in a 540×270 rect → rx 270 / ry 135 | match |
| all 3 | top bloom | filter | `blur(6px)` | none | **MISMATCH\*** — RN SVG has no blur filter; substitute is the gradient's own falloff (art 1010 note) |
| all 3 | bottom glow | box | left 50%, margin-left −280, bottom −300, 560 × 560 | `left:'50%', marginLeft:-280, bottom:-300, 560×560` (art 1024) | match |
| all 3 | bottom glow | stops | `rgba(255,236,196,0.52)` 0%, `…,0.23` 45%, `…,0` 72% | `0%@0.52`, `45%@0.23`, `72%@0` (art 1020–1022) | match |
| all 3 | noise | image / opacity | `url('noise-dark.png')`, `opacity:0.12` | `<Noise opacity={0.12}/>` → `assets/images/noise-dark.png`, `contentFit:'cover'` (art 1026) | match |
| all 3 | status bar | whole row | h 54, `9:41` 17/600 `#1D1C1A` ls −0.2, three glyphs gap 7 | not built | match (per convention) |
| all 3 | Back | position | left 16, canvas top 64 → **app 10** | `left:16, top:backTop` with `backTop = 64-54 = 10` (welcome 139, v3 267) | match |
| all 3 | Back | gap | 9 | `gap: 9` (v3 267) | match |
| all 3 | Back chevron | svg | `11×19`, viewBox `0 0 11 19` | `width 11 height 19 viewBox "0 0 11 19"` (v3 268) | match |
| all 3 | Back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | `M9.5 1.5L2 9.5l7.5 8` (v3 269) | match |
| all 3 | Back chevron | stroke | `#55534E`, width 2.4, cap/join round, `fill:none` | `stroke={backInk}` = `tone.ink2` = `colors.textMuted` = `#55534E` (v3 235, theme 55); `strokeWidth 2.4`, round/round | match |
| all 3 | Back label | type | 17px / 400 / `#55534E` | `sans('400')`, `fontSize 17`, `color #55534E` (v3 271) | match |
| all 3 | progress bar | presence | frame draws none | `NOBAR` contains `reading` (welcome 142) | match |
| all 3 | heading | position | left 26, right 26, canvas top 126 → **app 72** | `left:26, right:26, top:72` (v3 1608) | match |
| all 3 | heading | type | 22px / 500 / lh 1.32 (= 29.04) / ls 0.1 / `#1D1C1A` / centre | `sans('500')`, 22, `lineHeight 29.04`, `letterSpacing 0.1`, `#1D1C1A`, `center` | match |
| all 3 | heading | text | `Your twelve weeks.` | `Your twelve weeks.` | match |
| all 3 | heading | text-wrap | `pretty` | — | **MISMATCH\*** — RN has no `text-wrap`; string is single-line at this width, so no visible effect |
| all 3 | rail track | box | right 9, canvas top 192 → **app 138**, 4 × 450, radius 2 | `right:9, top:138, width:4, height:450, borderRadius:2` (art 1061) | match |
| all 3 | rail track | fill | `rgba(0,0,0,0.06)` | `rgba(0,0,0,0.06)` | match |
| all 3 | rail thumb | box | 4 × 144, radius 2, `#C6C5C0` | `width:4, height:144, borderRadius:2, #C6C5C0` (art 1062) | match |
| I | rail thumb | offset | `bottom:0` → top 306 of 450 | `153*(3−1)` = 306 | match |
| II | rail thumb | offset | `top:153px` | `153*(3−2)` = 153 | match |
| III | rail thumb | offset | `top:0` | `153*(3−3)` = 0 | match |
| all 3 | footer copy | position | left 26, right 26, canvas top 696 → **app 642** | `left:26, right:26, top:642` (v3 1616) | match |
| all 3 | footer copy | type | 15px / 400 / lh 22px / `#55534E` / centre | `sans('400')`, 15, `lineHeight 22`, `#55534E`, `center` | match |
| all 3 | footer copy | text | `Twelve weeks, one path. Move at your own pace &mdash; there's no clock.` | same, U+2014 em dash + straight apostrophe (`&apos;`) | match |
| all 3 | CTA | box | left 24, right 24, canvas top 764, h 58, radius 29 | `left:24, right:24, bottom:852−764−58=30, h 58, radius h/2=29` (v3 1619, 421–443) | match |
| all 3 | CTA | fill | `#131313` | `#131313` | match |
| all 3 | CTA | label | `Show me my path`, 17 / 600 / ls 0.3 / `#FFFFFF` | `ls={0.3}`, 17, `sans('600')`, `#FFFFFF` | match |
| all 3 | — | app-only control | frame draws no pager control | `PagerTap` × 2, invisible 30pt bands right edge, top 138 / 450, h 138 (v3 1630–1641) | app-only (documented D-038) — no design row to violate |

---

## 2. The row shell — same on all twelve rows

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 3 | row | box | left 24, right 24, h 96; tops 192 / 310 / 428 / 546 → **app 138 / 256 / 374 / 492** | `left:24, right:24, top:w.top, height:96`; tops `138,256,374,492` (art 1038–1049, 1239) | match |
| all 3 | tile | inset / overflow | `inset:0`, `overflow:hidden` | `top/left/right/bottom:0`, `overflow:'hidden'` (art 1240) | match |
| all 3 | tile | border-radius | `14px` (circular, all four corners) | `borderRadius:14` **plus `borderCurve:'continuous'`** (art 1240) | **MISMATCH** — the extra `borderCurve` makes it a squircle; the canvas states a plain circular 14 |
| all 3 | tile | background | `#F0EFE9` | `#F0EFE9` | match |
| all 3 | tile | box-shadow | `0 0 0 1px rgba(0,0,0,0.05)` | `'0 0 0 1px rgba(0,0,0,0.05)'` | match |
| all 3 | ground shadow | box | left 38, top 74, 52 × 9, `border-radius:50%` | `left:38, top:74, 52×9` (art 1242) | match |
| all 3 | ground shadow | fill | flat `rgba(0,0,0,0.08)` | radial `0%→rgb(0,0,0)@0.08`, `100%→0` | **MISMATCH\*** (paired with the blur below) — flat fill + blur replaced by one falloff |
| all 3 | ground shadow | filter | `blur(3px)` | none | **MISMATCH\*** — RN SVG has no blur; substitute is the 0.08→0 radial falloff |
| all 3 | halo | box | left 9, top 7, 110 × 110, `border-radius:50%` (all twelve rows state top 7) | `left:9, top:7, 110×110` (art 1248) | match |
| all 3 | halo | stops | `rgba(255,236,196,H)` 0% → `rgba(255,236,196,0)` 72% | `0%@w.halo`, `72%@0` (art 1244–1247) | match |
| all 3 | halo | H per row, top→bottom | 0.62 / 0.5 / 0.38 / 0.3 on **every** page | `halo` 0.62/0.5/0.38/0.3 repeated per page (art 1038–1049) | match |
| all 3 | text column | box | left 126, right 14, `top:50%; transform:translateY(-50%)` | `left:126, right:14, top:0, bottom:0, justifyContent:'center'` (art 1252) | match (equivalent centring) |
| all 3 | eyebrow | type | 12.5 / 600 / `#8B8882` | `sans('600')`, 12.5, `#8B8882` (art 1254) | match |
| all 3 | title | type | `margin-top:4`, 600, `#1D1C1A`, size per row | `marginTop:4`, `sans('600')`, `#1D1C1A`, `w.titleSize` (art 1261) | match |
| I | "You are here" chip | layout | row with eyebrow, `gap:8` | `flexDirection:'row', alignItems:'center', gap:8` (art 1253) | match |
| I | "You are here" chip | box | radius 8, `padding:3px 8px`, bg `#131313` | `borderRadius:8, paddingHorizontal:8, paddingVertical:3, #131313` (art 1256) | match |
| I | "You are here" chip | type | 12.5 / 600 / `#FFFFFF` | `sans('600')`, 12.5, `#FFFFFF` | match |
| — | chip | states | drawn on Week I only | `here: true` on week 1 only (art 1049) | match |

Eyebrow / title / title-size, all twelve, checked one by one — every string and size matches:
XII `Leave It Behind` 16 · XI `Build a Life You Want` 15.5 · X `Yourself` 16 · IX `Connection` 16 ·
VIII `Boredom and Meaning` 15.5 · VII `Relapse and Adversity` 15.5 · VI `Discipline` 16 ·
V `Why It Feels Worth It` 15.5 · IV `Know Your Brain` 16 · III `In the Moment` 16 ·
II `Changing Your Mindset` 15.5 · I `Reset` 16.

---

## 3. Campaign-Map (page 1) — the four drawings

All tile-local coordinates. Paint order in the frame = DOM order (every element is
`position:absolute`).

### Week IV — `Know Your Brain` (canvas row top 192 → app 138)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| ring | box | left 38, top 22, 48 × 48, `border-radius:50%` | `left:38, top:22, 48×48, borderRadius:24` (art 1106) | match |
| ring | stroke | `box-shadow: inset 0 0 0 2px #D6D5D0`, no fill | `boxShadow:'inset 0 0 0 2px #D6D5D0'`, no `backgroundColor` | match |
| core | box / fill | left 50, top 34, 24 × 24, 50%, `#E9D2A4` | `left:50, top:34, 24×24, r12, #E9D2A4` (art 1107) | match |
| satellite | box / fill | left 82, top 30, 6 × 6, 50%, `#C6C5C0` | `left:82, top:30, 6×6, r3, #C6C5C0` (art 1108) | match |
| — | z-order | ring → core → satellite | same order | match |

### Week III — `In the Moment` (canvas 310 → app 256)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| wave svg | size / viewBox | `width 52 height 40 viewBox "0 0 26 20"` | `width 52 height 40 viewBox "0 0 26 20"` (art 1097) | match |
| wave svg | position | left 38, top 26 | `left:38, top:26` | match |
| wave path | `d` | `M2 13c4-8 9 3 13-3s7 2 9-2` | `M2 13c4-8 9 3 13-3s7 2 9-2` (art 1098) | match |
| wave path | stroke | `#55534E`, width 2.2, `fill:none`, cap round | `#55534E`, 2.2, `fill none`, `strokeLinecap round` | match |

### Week II — `Changing Your Mindset` (canvas 428 → app 374)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| amber disc | box / fill | left 66, top 22, 20 × 20, 50%, `#E9D2A4` | `left:66, top:22, 20×20, r10, #E9D2A4` (art 1087) | match |
| small grey disc | box / fill | left 38, top 40, 24 × 24, 50%, `#E0DFDA` | `left:38, top:40, 24×24, r12, #E0DFDA` (art 1088) | match |
| large grey disc | box / fill | left 54, top 34, 30 × 30, 50%, `#D6D5D0` | `left:54, top:34, 30×30, r15, #D6D5D0` (art 1089) | match |
| bar | box / radius / fill | left 34, top 52, 56 × 16, radius 10, `#E0DFDA` | `left:34, top:52, 56×16, borderRadius:10, #E0DFDA` (art 1090) | match (both clamp 10 → 8) |
| — | z-order | amber → small → large → bar | same order | match |

### Week I — `Reset` (canvas 546 → app 492)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| course 1 | box / radius / fill | left 40, top 58, 48 × 11, radius 3, `#C6C5C0` | identical (art 1077) | match |
| course 2 | box / radius / fill | left 46, top 46, 34 × 11, radius 3, `#D6D5D0` | identical (art 1078) | match |
| course 3 | box / radius / fill | left 53, top 36, 20 × 9, radius 3, `#E0DFDA` | identical (art 1079) | match |

---

## 4. Campaign-Map-II (page 2) — the four drawings

### Week VIII — `Boredom and Meaning` (canvas 192 → app 138)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| sun | box / fill | left 58, top 26, 18 × 18, 50%, `#E9D2A4` | `left:58, top:26, 18×18, r9, #E9D2A4` (art 1157) | match |
| hill | box | left 30, top 52, 66 × 18 | path spans x 30→96, y 52→70 (art 1159) | match |
| hill | radius | `50% 50% 0 0 / 10px 10px 0 0` → rx 33, ry 10 on both top corners (sum 66 = width, unscaled) | `M30 70 L30 62 A 33 10 0 0 1 96 62 L96 70 Z` | match (substitute: SVG arc) |
| hill | fill | `#E0DFDA` | `#E0DFDA` | match |
| mark L | box / fill / transform | left 42, top 48, 3 × 6, radius 2, `#C6C5C0`, `rotate(-12deg)` | identical, `rotate:'-12deg'` (art 1161) | match |
| mark R | box / fill / transform | left 80, top 46, 3 × 6, radius 2, `#C6C5C0`, `rotate(10deg)` | identical, `rotate:'10deg'` (art 1162) | match |
| — | z-order | sun → hill → marks | sun View → Svg(hill) → marks | match |

### Week VII — `Relapse and Adversity` (canvas 310 → app 256)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| body | box / fill | left 40, top 22, 48 × 48, 50%, `#E0DFDA` | `left:40, top:22, 48×48, r24, #E0DFDA` (art 1144) | match |
| face | box / fill | left 53, top 35, 22 × 22, 50%, `#FAF8F4` | `left:53, top:35, 22×22, r11, #FAF8F4` (art 1145) | match |
| tick N | box / radius / fill | left 61, top 24, 6 × 8, radius 2, `#C6C5C0` | identical (art 1146) | match |
| tick S | box / radius / fill | left 61, top 60, 6 × 8, radius 2, `#C6C5C0` | identical (art 1147) | match |
| tick W | box / radius / fill | left 42, top 43, 8 × 6, radius 2, `#C6C5C0` | identical (art 1148) | match |
| tick E | box / radius / fill | left 78, top 43, 8 × 6, radius 2, `#C6C5C0` | identical (art 1149) | match |

### Week VI — `Discipline` (canvas 428 → app 374)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| far peak | geometry | left 34, top 42, 34 × 26, `polygon(50% 0,100% 100%,0 100%)` → (51,42) (68,68) (34,68) | `Polygon points="51,42 68,68 34,68"` (art 1131) | match (substitute: SVG Polygon) |
| far peak | fill | `#E0DFDA` | `#E0DFDA` | match |
| near peak | geometry | left 52, top 26, 42 × 42, same polygon → (73,26) (94,68) (52,68) | `Polygon points="73,26 94,68 52,68"` (art 1132) | match |
| near peak | fill | `#D6D5D0` | `#D6D5D0` | match |
| snow cap | geometry | left 66, top 26, 14 × 11, `polygon(50% 0,100% 100%,72% 70%,50% 95%,28% 70%,0 100%)` → (73,26) (80,37) (76.08,33.7) (73,36.45) (69.92,33.7) (66,37) | `Polygon points="73,26 80,37 76.08,33.7 73,36.45 69.92,33.7 66,37"` (art 1133) | match |
| snow cap | fill | `#F9F8F4` | `#F9F8F4` | match |
| pole | box / radius / fill | left 72, top 12, 2.5 × 15, radius 1, `#8A857C` | identical (art 1136) | match |
| flag | geometry / fill | left 74, top 12, 10 × 7, `polygon(0 0,100% 50%,0 100%)` → (74,12) (84,15.5) (74,19), `#E9D2A4` | `Polygon points="74,12 84,15.5 74,19"` `#E9D2A4` (art 1134) | match |
| pole vs flag | **z-order** | frame paints pole **then** flag → flag on top over x 74–74.5 | Svg (holding the flag) is declared first, pole `View` after → **pole on top** | **MISMATCH** — inverted paint order (art 1130–1136) |

### Week V — `Why It Feels Worth It` (canvas 546 → app 492)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| base | box / radius / fill | left 52, top 60, 24 × 6, radius 3, `#C6C5C0` | identical (art 1116) | match |
| post | box / radius / fill | left 61, top 32, 4 × 30, radius 2, `#C6C5C0` | identical (art 1117) | match |
| beam | box / radius / fill / transform | left 40, top 30, 46 × 4, radius 2, `#8A857C`, `rotate(7deg)` | identical, `rotate:'7deg'` (art 1118) | match |
| pan L | box / radius / fill | left 34, top 32, 16 × 8, `border-radius:0 0 9px 9px`, `#D6D5D0` | `borderBottomLeftRadius:9, borderBottomRightRadius:9` (art 1121) | match (both clamp by 8/9 → 8) |
| pan R | box / radius / fill | left 76, top 42, 16 × 8, `0 0 9px 9px`, `#E9D2A4` | identical (art 1122) | match |
| — | z-order | base → post → beam → pan L → pan R | same order | match |

---

## 5. Campaign-Map-III (page 3) — the four drawings

### Week XII — `Leave It Behind` (canvas 192 → app 138)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| stone | box / fill | left 44, top 54, 42 × 11, `#C6C5C0` | identical (art 1224) | match |
| stone | radius | `3px 3px 12px 12px` (TL 3, TR 3, BR 12, BL 12) | `borderTopLeftRadius:3, borderTopRightRadius:3, borderBottomRightRadius:12, borderBottomLeftRadius:12` | match |
| post | box / radius / fill | left 64, top 24, 2.5 × 30, radius 1, `#8A857C` | identical (art 1226) | match |
| board L | geometry / fill | left 50, top 26, 14 × 28, `polygon(100% 0,100% 100%,0 100%)` → (64,26) (64,54) (50,54), `#F9F8F4` | `Polygon points="64,26 64,54 50,54"` `#F9F8F4` (art 1228) | match |
| board R | geometry / fill | left 68, top 30, 13 × 24, `polygon(0 0,100% 100%,0 100%)` → (68,30) (81,54) (68,54), `#E9D2A4` | `Polygon points="68,30 81,54 68,54"` `#E9D2A4` (art 1229) | match |
| road | box / radius / fill | left 36, top 68, 20 × 3, radius 2, `#D6D5D0` | identical (art 1231) | match |
| — | z-order | stone → post → board L → board R → road | same (boards after the post; no overlap either way) | match |

### Week XI — `Build a Life You Want` (canvas 310 → app 256)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| house | box / radius / fill | left 40, top 22, 48 × 46, `6px 6px 0 0`, `#E0DFDA` | `borderTopLeftRadius:6, borderTopRightRadius:6` (art 1201) | match |
| interior | box / radius / fill | left 47, top 28, 34 × 40, `3px 3px 0 0`, `#F9F8F4` | `borderTopLeftRadius:3, borderTopRightRadius:3` (art 1202) | match |
| lamp | box / fill | left 60, top 40, 9 × 9, 50%, `#E9D2A4` | `9×9, borderRadius:4.5, #E9D2A4` (art 1203) | match |
| light shaft | box / radius / fill | left 88, top 26, 15 × 44, radius 2, `#D6D5D0` | identical (art 1204–1216) | match |
| light shaft | transform | `skewY(-8deg)`, `transform-origin:left top` | `transform:[{skewY:'-8deg'}]`, `transformOrigin:'left top'` | match |

### Week X — `Yourself` (canvas 428 → app 374)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| mirror | box / radius | left 46, top 22, 32 × 44, `border-radius:16px / 22px` → full ellipse centred (62,44), rx 16, ry 22 | `Ellipse cx=62 cy=44 rx=16 ry=22` (art 1186) | match (substitute: SVG Ellipse) |
| mirror | fill | `#F9F8F4` | `#F9F8F4` | match |
| mirror | ring | `box-shadow: inset 0 0 0 3px #D6D5D0` | `Ellipse rx=14.5 ry=20.5 stroke #D6D5D0 strokeWidth 3` (art 1189) | match (inset centreline r − w/2; a true CSS inset offset-curve differs sub-pixel off-axis) |
| highlight | box / radius / fill / transform | left 53, top 28, 7 × 14, radius 4, `#FFFFFF`, `rotate(18deg)` | identical (art 1191) | match |
| leg L | box / radius / fill / transform | left 50, top 64, 5 × 9, radius 2, `#C6C5C0`, `rotate(18deg)` | identical (art 1192) | match |
| leg R | box / radius / fill / transform | left 69, top 64, 5 × 9, radius 2, `#C6C5C0`, `rotate(-18deg)` | identical (art 1193) | match |

### Week IX — `Connection` (canvas 546 → app 492)

| Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|
| tent L | box | left 28, top 44, 40 × 26 | path spans x 28→68, y 44→70 (art 1171) | match |
| tent L | radius | `50% 50% 0 0 / 24px 24px 0 0` → rx 20, ry 24 | `M28 70 L28 68 A 20 24 0 0 1 68 68 L68 70 Z` | match |
| tent L | fill | `#E0DFDA` | `#E0DFDA` | match |
| tent R | box | left 58, top 38, 44 × 32 | path spans x 58→102, y 38→70 (art 1172) | match |
| tent R | radius | `50% 50% 0 0 / 28px 28px 0 0` → rx 22, ry 28 | `M58 70 L58 66 A 22 28 0 0 1 102 66 L102 70 Z` | match |
| tent R | fill | `#D6D5D0` | `#D6D5D0` | match |
| pole L | box / radius / fill | left 46, top 32, 2.5 × 13, radius 1, `#8A857C` | identical (art 1176) | match |
| flag L | geometry / fill | left 48, top 32, 9 × 6, `polygon(0 0,100% 50%,0 100%)` → (48,32) (57,35) (48,38), `#E9D2A4` | `Polygon points="48,32 57,35 48,38"` (art 1173) | match |
| pole R | box / radius / fill | left 78, top 26, 2.5 × 13, radius 1, `#8A857C` | identical (art 1177) | match |
| flag R | geometry / fill | left 80, top 26, 9 × 6, same polygon → (80,26) (89,29) (80,32), `#E9D2A4` | `Polygon points="80,26 89,29 80,32"` (art 1174) | match |
| poles vs flags | **z-order** | frame paints pole L → flag L → pole R → flag R (flags on top over x 46–48.5 / 78–80.5) | Svg holds both flags and is declared **before** both pole Views → **poles on top** | **MISMATCH** — inverted paint order (art 1170–1177) |

---

## Findings

Every MISMATCH, in order.

1. **`src/components/onboarding/art.tsx:1130–1136` — Week VI flagpole z-order inverted.**
   Current: the `<Svg>` carrying the flag polygon (`74,12 84,15.5 74,19`, `#E9D2A4`) is declared
   first and the 2.5 × 15 `#8A857C` pole `View` after it, so the pole paints over the flag's left
   0.5pt (x 74 → 74.5).
   Design (Campaign-Map-II, Week VI): the pole div precedes the flag div, so the flag paints over
   the pole. Fix by moving the pole into the same `<Svg>` as a `<Rect x=72 y=12 width=2.5 height=15
   rx=1>` before the flag polygon.

2. **`src/components/onboarding/art.tsx:1170–1177` — Week IX tent poles z-order inverted (both).**
   Current: the `<Svg>` holding both flag polygons is declared before the two `#8A857C` pole
   `View`s, so each pole paints over its flag's left 0.5pt (x 46 → 48.5 and 78 → 80.5).
   Design (Campaign-Map-III, Week IX): DOM order is pole L, flag L, pole R, flag R — flags on top.
   Fix by drawing both poles as `<Rect>`s inside the same `<Svg>`, each immediately before its flag.

3. **`src/components/onboarding/art.tsx:1240` — row tile carries `borderCurve: 'continuous'`.**
   Current: `borderRadius: 14, borderCurve: 'continuous'` (an iOS squircle).
   Design: all three frames state a plain `border-radius:14px`, i.e. a circular corner. Drop
   `borderCurve` on this tile.

### MISMATCH\* — RN cannot express the CSS (substitute named, no app change possible)

- `art.tsx:1010–1017` — top bloom `filter: blur(6px)`. RN SVG has no blur filter; substitute is
  the `closest-side` radial's own falloff, drawn at the frame's exact box and stops.
- `art.tsx:1242` — each row's ground shadow is a flat `rgba(0,0,0,0.08)` ellipse with
  `filter: blur(3px)`. Substitute is a single radial ramp `rgb(0,0,0)@0.08 → 0` over the same
  52 × 9 box, so the centre density matches and the edge softens instead of being blurred.
- `v3.tsx:1608` — heading `text-wrap: pretty`. No RN equivalent; `Your twelve weeks.` sets on one
  line at 341pt of width, so there is nothing for it to rebalance.

### Notes (not mismatches)

- `art.tsx:1068` — `TILE_W = 393 - 48 - 14 = 331` is described as "the row less its 14pt right
  inset", but the tile is `inset:0` inside the row and is actually 345 wide. The constant only
  sizes the un-`viewBox`ed `<Svg>` canvases, and every drawn point sits at x < 103, so nothing
  clips. Comment is wrong, geometry is not.
- `v3.tsx:1630–1641` — `PagerTap` is an app-only invisible control; the frames draw only the rail.
- App tops are `canvas − 54` throughout and are measured from the SafeAreaView inset, so on a
  device whose top inset is not 54 the whole page shifts together. That is the run's convention,
  not a per-element error.
