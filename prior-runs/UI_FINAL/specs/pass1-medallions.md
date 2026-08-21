# Pass 1 · second reading — Medallions

Bundle **Email Login**. Frames read in full from `.uifinal/pretty/final/Email Login/`
(cross-checked against the raw `.uifinal/final/Email Login/` for dropped declarations —
the raw files carry nothing the pretty files lost; the only `cursor:` in the three is the
`Take it` button, and none of the three draws a hover/active state).

| Frame file | App file |
| --- | --- |
| `Medallions.html` | `src/app/(app)/milestones.tsx` (+ `src/components/keepsakes/Medallion.tsx`, `src/components/StoicTabBar.tsx`) |
| `Medallions-Still-To-Earn.html` | same |
| `Medallion-Received.html` | `src/app/medallion-post.tsx` + `MailArrival` in `src/app/letter.tsx` |

Canvas tops are the 393 × 852 frame's and include the 54pt status bar the app never
builds; the app equivalent is `canvas − 54`. Both are given as `canvas / app`.

`MISMATCH*` = RN cannot express the CSS; the substitute is named.

---

## 1 · `Medallions.html` — earned segment

### 1.1 Screen shell

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallions | root | width × height | 393 × 852 | device | match |
| Medallions | root | background | `#F4F3F0` | `#F4F3F0` (milestones.tsx:132) | match |
| Medallions | root | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sans()` → `System` (iOS) | match |
| Medallions | root | overflow | `hidden` | n/a (screen) | match |
| Medallions | root | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | match (frame-plate artefact, not screen chrome) |
| Medallions | grain | background-image | `noise-dark.png`, repeat at file size | `Grain source={noiseDark}` → `Image resizeMode="repeat"` (milestones.tsx:134) | match |
| Medallions | grain | opacity | `0.07` | `0.07` | match |
| Medallions | grain | inset | `0` (over the field, under everything) | `position:absolute` `top/left/right/bottom:0`, first child | match |
| Medallions | grain | pointer-events | `none` | `pointerEvents="none"` | match |
| Medallions | status bar | height / contents | 54, `9:41` + 3 glyphs | not built (safe-area inset) | match (convention) |

### 1.2 Header

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallions | back chevron | left / top | `16` / `64` → app `10` | `left:16, top:10` (milestones.tsx:149) | match |
| Medallions | back chevron | svg size / viewBox | `11 × 19` / `0 0 11 19` | `11 × 19` / `0 0 11 19` (:150) | match |
| Medallions | back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | `M9.5 1.5L2 9.5l7.5 8` (:151) | match |
| Medallions | back chevron | stroke / width / caps | `#55534E` / `2.4` / round, round | `#55534E` / `2.4` / round, round | match |
| Medallions | back chevron | fill | `none` | `none` | match |
| Medallions | page dots | right / top | `20` / `72` → app `18` | `right:20, top:18` (:156) | match |
| Medallions | page dots | count / gap | 3 / `4.5` | 3 / `gap:4.5` | match |
| Medallions | page dots | size / radius / colour | `4.5 × 4.5` / `50%` / `#55534E` | `4.5 × 4.5` / `2.25` / `#55534E` (:158) | match |
| Medallions | page dots | z-index | `6` (over the field) | source order, above field | match |
| Medallions | title | left / top | `16` / `114` → app `60` | `left:16, top:60` (:163) | match |
| Medallions | title | text | `Medallions` | `Medallions` | match |
| Medallions | title | size / weight | `27` / `600` | `27` / `sans('600')` | match |
| Medallions | title | letter-spacing / colour | `-0.2` / `#1D1C1A` | `-0.2` / `#1D1C1A` | match |
| Medallions | title | line-height | not stated (natural) | none — `AppText` drops the variant leading when the caller names a size | match |

### 1.3 Segmented control

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallions | segment track | left / right / top | `16` / `16` / `168` → app `114` | `16` / `16` / `114` (milestones.tsx:166-177) | match |
| Medallions | segment track | height / radius | `38` / `19` | `38` / `19` | match |
| Medallions | segment track | background | `rgba(0,0,0,0.06)` | `rgba(0,0,0,0.06)` | match |
| Medallions | segment track | padding / box-sizing | `3` / `border-box` | `padding:3` (Yoga is border-box) | match |
| Medallions | segment track | flex direction | `row` (default) | `flexDirection:'row'` | match |
| Medallions | active half | flex | `1` | `flex:1` | match |
| Medallions | active half | radius / background | `16` / `#FFFFFF` | `16` / `#FFFFFF` (:189-192) | match |
| Medallions | active half | box-shadow | `0 1px 4px rgba(40,38,32,0.14), 0 0 0 0.5px rgba(0,0,0,0.04)` | identical string (:193) | match |
| Medallions | active half | align / justify | center / center | center / center | match |
| Medallions | active label | text / size / weight / colour | `Earned` / `14` / `600` / `#1D1C1A` | same (:195) | match |
| Medallions | inactive half | background / shadow | none | `transparent`, `boxShadow: undefined` | match |
| Medallions | inactive label | text / size / weight / colour | `Still to earn` / `14` / `500` / `#8B8882` | same (:195) | match |
| Medallions | segment state | which half is on | left (`Earned`) | `segment` state, defaults `'earned'` (:65) | match |

### 1.4 Count line and rail

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallions | count line | left / top | `16` / `230` → app `176` | `16` / `176` (milestones.tsx:202) | match |
| Medallions | count line | size / weight / colour | `13` / `600` / `#55534E` | `13` / `600` / `#55534E` | match |
| Medallions | count line | text | `6 of 11 earned` | `${nEarned} of ${struck.length} earned` — 12 faces in `KK_ALBUM` (:203) | match (rule carried; the app album adds `backondeck`, documented at :22-26) |
| Medallions | rail | left / right / top | `16` / `16` / `256` → app `202` | `16` / `16` / `202` (:208) | match |
| Medallions | rail | height / radius | `5` / `3` | `5` / `3` | match |
| Medallions | rail | background / overflow | `rgba(0,0,0,0.12)` / `hidden` | `rgba(0,0,0,0.12)` / `overflow:'hidden'` | match |
| Medallions | rail fill | width | `55%` | `${(nEarned/struck.length)*100}%` (:209) | match (live) |
| Medallions | rail fill | height / radius / colour | `100%` / `3` / `#131313` | `100%` / `3` / `#131313` | match |

### 1.5 Grid and card

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallions | grid | left / right | `20` / `20` | `paddingHorizontal:20` (milestones.tsx:215) | match |
| Medallions | grid | first row top | `290` → app `236` | header block `height:236` (:142), ScrollView has no `paddingTop` | match |
| Medallions | grid | row stride | `290 → 475 → 660` = 185 (168 + 17) | `height:168` + `gap:17` | match |
| Medallions | grid | column gap | `17` | `gap:17` (:217) | match |
| Medallions | grid | flex direction | `row` | `flexDirection:'row'` | match |
| Medallions | card | flex | `1` | `flex:1` (:279) | match |
| Medallions | card | height | `168` | `height:168, minHeight:168` | match |
| Medallions | card | box-sizing / padding | `border-box` / `12` | `padding:12` | match |
| Medallions | card | radius | `16` | `16` | match |
| Medallions | card | corner curve | CSS circular | `borderCurve:'continuous'` (:282) | note — iOS squircle vs the canvas's circular arc; app-wide convention |
| Medallions | card | background | `#FFFFFF` | `#FFFFFF` | match |
| Medallions | card | shadow / border | none | none | match |
| Medallions | card | direction / align / justify / gap | column / center / center / `10` | column / center / center / `10` | match |
| Medallions | rim | box-shadow | `0 0 0 1.5px rgba(0,0,0,0.2), 0 0 0 5px #FFFFFF, 0 0 0 6.5px rgba(0,0,0,0.16)` | identical string (:293) | match |
| Medallions | rim | radius / overflow | `50%` / `hidden` | `borderRadius:9999`; disc clipped inside the SVG (`ClipPath` r 50) | match |
| Medallions | disc | width × height | `68 × 68` | `size={68}` (:294) | match |
| Medallions | name | text-align | center | `AppText center` (:297) | match |
| Medallions | name | size / weight / colour | `14.5` / `500` / `#1D1C1A` | `14.5` / `500` / `#1D1C1A` | match |
| Medallions | name | line-height | `1.3` → 18.85 | `18.85` | match |
| Medallions | state line | margin-top | `4` | `marginTop:4` (:300) | match |
| Medallions | state line | size / weight / colour | `12.5` / `600` / `#8B8882` | `12.5` / `600` / `#8B8882` | match |
| Medallions | state line | line-height | not stated (natural) | dropped by `AppText` (own size, no own leading) | match |

### 1.6 The paper disc (`Medallion.tsx`, `metal="paper"`, `sun` on)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallions | disc field | gradient | `linear-gradient(180deg, #F1F0EB 0%, #ECEAE3 100%)` | `x1 0 y1 0 x2 0 y2 1`, stops `#F1F0EB` @0, `#ECEAE3` @1 (Medallion.tsx:370-373, 50) | match |
| Medallions | dune 1 | box | `left:-25% right:-25% top:64% height:80%` → x −25…125, y 64…144 | `M-25 100.8 A75 36.8 0 0 1 125 100.8 L125 144 L-25 144 Z` (:425) | match |
| Medallions | dune 1 | radius | `50% 50% 0 0 / 46% 46% 0 0` → rx 75, ry 36.8 | `A75 36.8` | match |
| Medallions | dune 1 | fill | `#DEDDD6` | `#DEDDD6` (:51) | match |
| Medallions | dune 2 | box | `left:-45% right:-15% top:78% height:80%` → x −45…115, y 78…158 | `M-45 110 A80 32 0 0 1 115 110 L115 158 L-45 158 Z` (:426) | match |
| Medallions | dune 2 | radius | `50% 50% 0 0 / 40% 40% 0 0` → rx 80, ry 32 | `A80 32` | match |
| Medallions | dune 2 | fill | `#CFCEC7` | `#CFCEC7` | match |
| Medallions | sun | gradient | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 75%)` | `#E2BA78` @0 α0.42 → @0.75 α0 (:409-412) | match |
| Medallions | sun · Veni | box | `left:16% top:6% 56 × 56` → c(44,34) r28 | `veni:{cx:44,cy:34,r:28}` (:297) | match |
| Medallions | sun · First light | box | `left:16% top:6% 56 × 56` → c(44,34) r28 | `firstlight:{44,34,28}` | match |
| Medallions | sun · Vidi | box | `right:6% top:34% 44 × 44` → c(72,56) r22 | `vidi:{72,56,22}` | match |
| Medallions | sun · Vici | box | `left:24% top:4% 54 × 54` → c(51,31) r27 | `vici:{51,31,27}` | match |
| Medallions | sun · Storm | box | `left:26% top:2% 50 × 50` → c(51,27) r25 | `storm:{51,27,25}` | match |
| Medallions | sun · Never failed twice | box | `left:16% top:6% 56 × 56` → c(44,34) r28 | `bounce:{44,34,28}` | match |
| Medallions | disc | paint order | field → sun → dune 1 → dune 2 → device | same (:421-435) | match |
| Medallions | disc (paper) | rim ring / sheen / seat wash | none drawn | drawn only when `face.kind==='struck'` (:427) | match |

### 1.7 The six earned devices (100 × 100 viewBox)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallions | ink wash | gradient | `#4A4843` @0 → `#1D1C19` @1, vertical | identical (Medallion.tsx:364-367) | match |
| Medallions | Veni | ground | `ellipse cx 50 cy 68 rx 21 ry 3.5 fill rgba(40,38,32,0.14)` | identical (:158) | match |
| Medallions | Veni | sail | `M52 24 L52 50 L35 50 Z` fill `#3A3934` | identical (:159) | match |
| Medallions | Veni | hull | `M29 54 L73 54 Q69 64 51 64 Q33 64 29 54 Z` fill ink | identical (:160) | match |
| Medallions | Veni | waterline | `M34 56.5 L68 56.5` stroke `rgba(255,255,255,0.18)` w2 round | identical (:161) | match |
| Medallions | First light | horizon | `M28 58 L72 58` stroke `#8A857C` w3 round | `a.struct` = `#8A857C` (:202, :104) | match |
| Medallions | First light | sun body | `M38 58 a12 12 0 0 1 24 0 Z` fill `#E2BA78` | `a.warm` = `#E2BA78` (:203) | match |
| Medallions | First light | rays | `M50 34 v-6 M35 41 l-4 -4 M65 41 l4 -4` stroke `#C99F5F` w3 round | `a.ray` = `#C99F5F` (:204) | match |
| Medallions | Vidi | moon | `circle cx 40 cy 32 r 15` fill `#E6E5DE → #C3C2BB` diagonal | identical gradient (:374-377, :167) | match |
| Medallions | Vidi | crescent bite | `circle cx 48 cy 26 r 14` **filled `#F1F0EB`** over moon *and* field | `Mask` punches a transparent hole (:167, :414-417) | **MISMATCH** — where the bite circle overhangs the moon the canvas paints flat `#F1F0EB` on the disc; the app shows the disc gradient (and, on the earned face, the sun) through it |
| Medallions | Vidi | star A | `circle 34,38 r2.2 #CFCEC7` | `a.starA` = `#CFCEC7` (:168) | match |
| Medallions | Vidi | star D | `circle 41,29 r1.5 #D6D5CE` | `a.starD` = `#D6D5CE` (:169) | match |
| Medallions | Vidi | star B | `circle 66,20 r1.8 #C7C6BF` | `a.starB` = `#C7C6BF` (:170) | match |
| Medallions | Vidi | star C | `circle 24,46 r1.5 #D2D1CA` | `a.starC` = `#D2D1CA` (:171) | match |
| Medallions | Vici | ground | `ellipse 48,72 rx16 ry3 rgba(40,38,32,0.14)` | identical (:177) | match |
| Medallions | Vici | staff | `rect x44 y22 w4.5 h48 rx2.2 fill #C4C3BC` | `a.pole` = `#C4C3BC` at `variant='album'` (:178, :441) | match |
| Medallions | Vici | banner | `M50 24 C57 21.5 61 25.5 69 24 L69 37 C61 38.5 57 34.5 50 40 Z` fill ink | identical (:179) | match |
| Medallions | Storm weathered | ground | `ellipse 50,70 rx14 ry3` | identical (:258) | match |
| Medallions | Storm weathered | mast | `rect 47,38 6 × 30 rx3 #C4C3BC` | `staff` (:259) | match |
| Medallions | Storm weathered | lamp | `rect 40,24 20 × 14 rx6` fill ink | identical (:260) | match |
| Medallions | Storm weathered | lamp highlight | `rect 42,27 16 × 2.5 rx1.2 rgba(255,255,255,0.16)` | identical (:261) | match |
| Medallions | Storm weathered | flame | `circle 50,31 r2.2 #E2BA78` | `a.warm` (:262) | match |
| Medallions | Never failed twice | ground | `ellipse 50,71 rx18 ry3` | identical (:194) | match |
| Medallions | Never failed twice | tick | `M30 44 L46 60 L70 30` stroke ink w6 round/round | identical (:195) | match |
| Medallions | Never failed twice | spark | `circle 71,26 r3 #E2BA78` | identical (:196) | match |

### 1.8 State lines (earned)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallions | Veni | text | `Day 0 · Jun 9` | `Day 0 · ${shortDate(user.createdAt)}` (milestones.tsx:112) | match |
| Medallions | First light | text | `Jun 9` | `shortDate(firstCheckin)` (:113) | match |
| Medallions | Vidi | text | `Tier II · Day VII` | `Tier ${roman(reached)} · Day ${roman(step)}`, steps `[3,7,…]` (:255) | match |
| Medallions | Vici | text | `Tier II · ×5` | `Tier II · ×5`, steps `[1,5,…]` | match |
| Medallions | Storm weathered | text | `Jun 21` | `shortDate(first force-nine)` (:114) | match |
| Medallions | Never failed twice | text | `Tier I · ×1` | `Tier I · ×1`, steps `[1,10,…]` | match |
| Medallions | card order | earned grid | Veni, First light / Vidi, Vici / Storm weathered, Never failed twice | `KK_ALBUM` order → Veni, Vidi / Vici, Never failed twice / First light, Storm weathered | note — the canvas's earned grid reads as an earn-date sort, its unearned grid as album order (§2.4); the app uses album order in both. Not counted: the frame cannot distinguish the two rules from one sample |

### 1.9 Tab bar (drawn by `StoicTabBar.tsx`, not by the audited screens)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallions | bar | top / height | `769` → 83 tall | `TAB_BAR_CONTENT 63 + max(inset.bottom, 20)` = 83 with a 20 inset, 97 on a home-indicator phone (StoicTabBar.tsx:54-57) | note — the frame draws no home indicator |
| Medallions | bar | background | `rgba(255,255,255,0.95)` | `rgba(255,255,255,0.95)` (:87) | match |
| Medallions | bar | z-index | `14` | last sibling | match |
| Medallions | tabs | centres | `70 / 196 / 318` (3 tabs) | `12.5 / 37.5 / 62.5 / 87.5%` → `49.1 / 147.4 / 245.6 / 343.9` (4 tabs) (:39-42) | MISMATCH — documented deviation (:20-24): the app carries a fourth `All` tab the canvas never draws |
| Medallions | tab | glyph top / size / viewBox | `14` / `30 × 29` / `0 0 24 26` | `paddingTop:14`, `30 × 29`, `0 0 24 26` (:99, :114) | match |
| Medallions | tab | label margin-top / size / weight | `5` / `13` / `500` | `5` / `13` / `500` (:101) | match |
| Medallions | Home (active) | glyph `d` / fill | `M4.5 24 L4.5 10 Q4.5 2 12 2 Q19.5 2 19.5 10 L19.5 24 Z` / `#2A2924` | identical / `colors.textTitle` = `#2A2924` (:115) | match |
| Medallions | Home (active) | knob | `circle 15.2,14 r1.7 #FFFFFF @0.92` | identical (:116) | match |
| Medallions | Home (active) | label colour | `#2A2924` | `#2A2924`; `milestones` counts as Home (:76) | match |
| Medallions | Log (rest) | rect / rules / fill | `rect 4.5,2 15 × 22 rx3` `#C6C5C0`; `M8.5 8.5h7M8.5 13h7M8.5 17.5h4.5` w2.2 `#FFFFFF` @0.95 | identical / `colors.track` = `#C6C5C0` (:125-126) | match |
| Medallions | Library (rest) | three rects | `x5 / x10.9 / x16.8, y2.5, 4.4 × 21, rx1.8` `#C6C5C0` | identical (:136-138) | match |
| Medallions | Log / Library | label colour | `#8B8882` | `colors.textSoft` = `#8B8882` | match |

---

## 2 · `Medallions-Still-To-Earn.html` — the deltas

### 2.1 Header and count

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Still to earn | shell / grain / chrome | all | identical to §1.1–1.2 | identical | match |
| Still to earn | active half | which | right (`Still to earn`) | `segment === 'ahead'` (milestones.tsx:178-198) | match |
| Still to earn | `Earned` label | weight / colour | `500` / `#8B8882` | `500` / `#8B8882` | match |
| Still to earn | `Still to earn` label | weight / colour | `600` / `#1D1C1A` | `600` / `#1D1C1A` | match |
| Still to earn | count line | left / top | `16` / `230` → `176` | same node, same top | match |
| Still to earn | count line | text | `5 left` | `${struck.length - nEarned} left` (:203) | match |
| Still to earn | rail | presence | **not drawn** | `segment === 'earned' ? … : null` (:207) | match |
| Still to earn | grid | first row top | `262` → app `208` | header block `height:208` (:142) | match |
| Still to earn | grid | row stride | `262 → 447 → 632` = 185 | `168` + `gap:17` | match |
| Still to earn | disc | sun | **no sun div on any card** | `sun={struck.earned}` → false (:294) | match |

### 2.2 The odd last row

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Still to earn | row 3 | wrapper flex | `flex: 0 0 calc(50% - 8.5px)` → 168 at 393 | `width: (393 − 40 − 17)/2` = 168 (milestones.tsx:272, 279) | match |
| Still to earn | row 3 | inner card width | `100%` | same 168 | match |
| Still to earn | row 3 | height / padding / gap | `168` / `12` / `10` | identical | match |
| Still to earn | row 3 | trailing spacer | none | none | match |

### 2.3 The five unearned devices

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Still to earn | Letter sent | ground | `ellipse 50,71 rx18 ry3 rgba(40,38,32,0.14)` | identical (Medallion.tsx:185) | match |
| Still to earn | Letter sent | body | `rect 30,34 40 × 29 rx4` fill ink | identical (:186) | match |
| Still to earn | Letter sent | flap | `M33 38 L50 52 L67 38` stroke `#F1F0EB` w2.4 round/round | `a.light` = `#F1F0EB` (:187) | match |
| Still to earn | Letter sent | seal | `circle 50,52 r4 #E2BA78` | `a.warm` (:188) | match |
| Still to earn | Honest ink | ground | `ellipse 50,71 rx18 ry3` | identical (:210) | match |
| Still to earn | Honest ink | rule | `M34 70 Q50 66 66 70` stroke `#8A857C` w2.5 round | identical (:211) | match |
| Still to earn | Honest ink | quill transform | `rotate(-38 50 48)` | identical (:212) | match |
| Still to earn | Honest ink | shaft | `rect 46,26 9 × 34 rx2` fill ink | identical (:213) | match |
| Still to earn | Honest ink | nib | `M46 60 L55 60 L50.5 70 Z` fill `#8A857C` | `a.struct` (:214) | match |
| Still to earn | Honest ink | band | `rect 46,26 9 × 5 rx2 #E2BA78` | `a.warm` (:215) | match |
| Still to earn | Steady study | ground | `ellipse 50,77 rx26 ry4.5 rgba(40,38,32,0.10)` | identical, incl. the `0.10` (:222) | match |
| Still to earn | Steady study | card gradient | `#FFFFFF → #EBEAE3` diagonal (`x2 1 y2 1`) | identical (:378-381) | match |
| Still to earn | Steady study | card 1 | `rotate(-5 37 52)`, `rect 21,33 30 × 40 rx3.5` | identical (:223-224) | match |
| Still to earn | Steady study | card 1 rules | `27,42 16 × 3 rx1.5 #DBDAD3`; `27,49 18 × 3 #E1E0D9` | `a.rule` / `a.rule2` (:225-226) | match |
| Still to earn | Steady study | card 2 | `rotate(3 64 52)`, `rect 49,31 30 × 40 rx3.5` | identical (:228-229) | match |
| Still to earn | Steady study | card 2 rules | `55,40 15 × 3`; `55,47 17 × 3` | identical (:230-231) | match |
| Still to earn | Steady study | pen | `rect 44,44 36 × 4.5 rx2.2` fill ink `rotate(-33 62 46)` | identical (:233) | match |
| Still to earn | Ground taken | ground | `ellipse 50,71 rx18 ry3` | identical (:239) | match |
| Still to earn | Ground taken | bars | `29,52 12 × 14 rx2 #9C9992`; `44,44 12 × 22 #8B8880`; `59,34 12 × 32` ink | `a.stack` / `a.stack2` / ink (:240-242) | match |
| Still to earn | Ground taken | spark | `circle 65,27 r2.5 #E2BA78` | identical (:243) | match |
| Still to earn | Let someone in | ground | `ellipse 50,71 rx18 ry3` | identical (:249) | match |
| Still to earn | Let someone in | bubble | `rect 28,30 44 × 26 rx8` fill ink | identical (:250) | match |
| Still to earn | Let someone in | tail | `M40 56 L40 66 L50 56 Z` fill ink | identical (:251) | match |
| Still to earn | Let someone in | tick | `M38 43 l6 6 L62 37` stroke `#F1F0EB` w4 round/round | `a.light` (:252) | match |

### 2.4 State lines (unearned)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Still to earn | Letter sent | text | `Not yet · first ×1` | `Not yet · first ${kkRung(face, steps[0])}` → `Not yet · first ×1` (milestones.tsx:258) | match |
| Still to earn | Honest ink | text | `4 of 10` | `${count} of ${steps[0]}`, steps `[10,…]` | match |
| Still to earn | Steady study | text | `3 of 5` | `${count} of 5`, steps `[5,…]` | match |
| Still to earn | Ground taken | text | `Not yet` | `Not yet · first ×1` — `groundtaken.steps[0] = 1`, so the same branch as Letter sent (:258, Medallion.tsx:616) | **MISMATCH** |
| Still to earn | Let someone in | text | `Gold, once · not yet` | `${TITLE_CASE[MINT.told]}, once · not yet` → `Gold, once · not yet` (:259, :35) | match |
| Still to earn | order | grid order | Letter sent, Honest ink / Steady study, Ground taken / Let someone in | `KK_ALBUM` filtered → identical five, identical order | match |

---

## 3 · `Medallion-Received.html` → `medallion-post.tsx` + `MailArrival`

### 3.1 Field

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallion Received | root | background | `linear-gradient(180deg, #F6EEDD 0%, #F0E1C2 100%)` | `field={['#F6EEDD','#F0E1C2']}` → `LinearGradient` default start `{0.5,0}` end `{0.5,1}` (medallion-post.tsx:68, letter.tsx:194) | match |
| Medallion Received | root | gradient inset | full bleed | `top/left/right/bottom:0`, outside the safe area | match |
| Medallion Received | halo | size | `340 × 340` | `halo[0] = 340` (medallion-post.tsx:69) | match |
| Medallion Received | halo | horizontal centre | `left:50%; margin-left:-170` | `left:0,right:0,alignItems:'center'` (letter.tsx:196) | match |
| Medallion Received | halo | top | `70` → app `16` (below the status bar) | `top:16` measured **from the screen top** — the halo block is a sibling of the full-bleed field, outside `SafeAreaView` (letter.tsx:196) | **MISMATCH** — sits one full top inset (~59) high; the canvas gap from halo top to art-frame top is 70, the app's is 129 |
| Medallion Received | halo | gradient | `radial-gradient(closest-side, rgba(226,186,120,0.38), rgba(226,186,120,0) 74%)` | `#E2BA78` @0 α0.38 → @0.74 α0; `rx/ry = 170` = closest side (letter.tsx:199-204) | match |
| Medallion Received | halo | radius / pointer-events | `50%` / `none` (parent) | ellipse / `pointerEvents="none"` | match |
| Medallion Received | grain | image / opacity / order | `noise-dark.png` / `0.07` / **over** the halo | `Grain … opacity 0.07` rendered after the halo (letter.tsx:209) | match |
| Medallion Received | letter washes | presence | none | `opacity: field ? 0 : 1` (letter.tsx:211) | match |
| Medallion Received | status bar | — | 54, not built | safe-area inset | match |

### 3.2 Chrome and eyebrow

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallion Received | close X | right / top | `20` / `66` → app `12` | `right:20, top:12` (letter.tsx:246) | match |
| Medallion Received | close X | size / viewBox | `18 × 18` / `0 0 18 18` | identical (:247) | match |
| Medallion Received | close X | path `d` | `M3 3l12 12M15 3L3 15` | identical (:248) | match |
| Medallion Received | close X | stroke / width / cap | `#55534E` / `2.2` / round | identical | match |
| Medallion Received | close X | action | closes | `onClose ?? onSecondary` → `shelve` (medallion-post.tsx:41-44) | match |
| Medallion Received | eyebrow | left / right / top | `0` / `0` / `100` → app `46` | `left:0,right:0,top:46` (letter.tsx:253) | match |
| Medallion Received | eyebrow | text | `MEDALLION EARNED` | `eyebrow="MEDALLION EARNED"` (medallion-post.tsx:70) | match |
| Medallion Received | eyebrow | align / size / weight | center / `11` / `600` | center / `11` / `600` | match |
| Medallion Received | eyebrow | letter-spacing / colour | `1.6` / `rgba(91,74,40,0.55)` | `1.6` / `rgba(91,74,40,0.55)` | match |

### 3.3 The medallion object (260 × 260 frame)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallion Received | art frame | left / top | `50%`, `margin-left:-130` / `140` → app `86` | `left:'50%', marginLeft:-130, top:artTop=86` (letter.tsx:258, medallion-post.tsx:71) | match |
| Medallion Received | art frame | size | `260 × 260` | `260 × 260` | match |
| Medallion Received | glow | left / top / size | `30` / `20` / `200 × 200` | `left:30, top:20`, `200 × 200` (medallion-post.tsx:112) | match |
| Medallion Received | glow | gradient | `radial-gradient(closest-side, rgba(226,186,120,0.55), rgba(226,186,120,0) 74%)` | `#E2BA78` @0 α0.55 → @0.74 α0, rx/ry 100 (:114-119) | match |
| Medallion Received | glow | filter | `blur(6px)` | none | MISMATCH* — RN SVG has no blur filter; substitute is the gradient's own falloff |
| Medallion Received | contact shadow | left / top / size | `52` / `230` / `156 × 16` | `left:52, top:230`, `156 × 16` (:121) | match |
| Medallion Received | contact shadow | fill / radius | `rgba(0,0,0,0.11)` solid, `border-radius:50%` | radial `#000` α0.11 @0 → α0.055 @0.6 → α0 @1 (:123-129) | MISMATCH* — the flat fill + `blur(6px)` is redrawn as a graded ellipse |
| Medallion Received | disc | left / top / size | `62` / `52` / `136 × 136` | `left:62, top:52`, `136 × 136` (:132-139) | match |
| Medallion Received | disc | radius | `50%` | `borderRadius:68` | match |
| Medallion Received | disc | face gradient | `radial-gradient(circle at 38% 30%, #F0DBB4, #E2BA78 62%, #C99F5F 100%)` | `cx 38% cy 30% rx/ry 93.5%` (CSS farthest-corner in a 136 square = 127.17 = 93.5%), stops `#F0DBB4` @0, `#E2BA78` @0.62, `#C99F5F` @1 (:150-154) | match |
| Medallion Received | disc | box-shadow | `inset 0 0 0 4px rgba(255,255,255,0.25), inset 0 -8px 18px rgba(120,88,40,0.28), 0 14px 30px rgba(180,140,70,0.45)` | identical string (:140) | match |
| Medallion Received | disc | transform | `rotate(-3deg)` | `[{rotate:'-3deg'}]` (:141) | match |
| Medallion Received | disc | direction / align / justify / gap | column / center / center / `7` | column / center / center / `7` (:142-144) | match |
| Medallion Received | inner ring | inset / radius | `9` / `50%` | `top/left/right/bottom:9`, `borderRadius:59` (:162) | match |
| Medallion Received | inner ring | box-shadow | `inset 0 0 0 1.5px rgba(91,74,40,0.35)` | identical | match |
| Medallion Received | laurel | width / viewBox | `42` / `0 0 40 26` | `width={42}`, height 27.3, `0 0 40 26` (letter.tsx:394) | match |
| Medallion Received | laurel | opacity | `0.55` | `opacity={0.55}` | match |
| Medallion Received | laurel | path 1 | `M21 3 L21 16 L12 16 Z` fill `#5b4a28` | identical (:395) | match |
| Medallion Received | laurel | path 2 | `M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z` fill `#5b4a28` | identical (:396) | match |
| Medallion Received | numeral | font-family | `Georgia,'Times New Roman',serif` | `fonts.quote` → `Georgia` (iOS) (medallion-post.tsx:166) | match |
| Medallion Received | numeral | size / weight | `17` / `600` | `17` / `'600'` | match |
| Medallion Received | numeral | letter-spacing / colour / opacity | `3` / `#5b4a28` / `0.6` | `3` / `#5b4a28` / `0.6` | match |
| Medallion Received | numeral | margin-right / text | `-3` / `V` | `-3` / `V` | match |

### 3.4 Copy block

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallion Received | title | left / right / top | `36` / `36` / `432` → app `378` | `36` / `36` / `titleTop=378` (letter.tsx:266, medallion-post.tsx:73) | match |
| Medallion Received | title | align / size | center / `27` | center / `27` (`titleStyle`) | match |
| Medallion Received | title | **weight** | `600` | `500` — `sans('500')` is the base and `titleStyle` overrides only `fontSize` and `letterSpacing` (letter.tsx:265-267, medallion-post.tsx:74) | **MISMATCH** |
| Medallion Received | title | letter-spacing / colour | `-0.2` / `#1D1C1A` | `-0.2` / `#1D1C1A` | match |
| Medallion Received | title | line-height | not stated (natural ≈ 32.2) | `32` (kept, because the style array names one) | match (within the natural box) |
| Medallion Received | title | text | `Veni` | `Back on Deck` | note — the app screen is the Vici/back-on-deck post (110 → 173), not the vow medallion; copy is deliberate |
| Medallion Received | chip | top | `476` → app `422` | `top:422` (letter.tsx:272) | match |
| Medallion Received | chip | centring | `left:0;right:0;justify-content:center` | `left:0,right:0,alignItems:'center'` | match |
| Medallion Received | chip | height / radius | `30` / `15` | `30` / `15` (:273) | match |
| Medallion Received | chip | background / shadow | `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.1)` | identical | match |
| Medallion Received | chip | padding | `0 14` | `paddingHorizontal:14`, `justifyContent:'center'` | match |
| Medallion Received | chip | label size / weight / colour | `12.5` / `600` / `#55534E` | `12.5` / `600` / `#55534E` (:274) | match |
| Medallion Received | chip | text | `Tier I · The Vow` | `Tier II · The Return` | note — same content substitution as the title |
| Medallion Received | sub | left / right / top | `44` / `44` / `530` → app `476` | `44` / `44` / `subTop=476` (letter.tsx:278, medallion-post.tsx:78) | match |
| Medallion Received | sub | align / size / weight | center / `15.5` / `400` | center / `15.5` / `400` | match |
| Medallion Received | sub | line-height / colour | `23` / `#55534E` | `23` / `#55534E` | match |
| Medallion Received | sub | text-wrap | `pretty` | native: none; web: `AppText` sets `textWrap:'pretty'` for the body variant | MISMATCH* — no RN equivalent on native; substitute is the platform's greedy wrap |

### 3.5 Actions

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| Medallion Received | primary | left / right | `24` / `24` | `24` / `24` (letter.tsx:287-288) | match |
| Medallion Received | primary | top → floor | `688`, height `56` → 108 from the frame bottom | `bottom:108` (:289) | match |
| Medallion Received | primary | height / radius | `56` / `28` | `56` / `28` | match |
| Medallion Received | primary | background | `#131313` | `#131313` | match |
| Medallion Received | primary | align / justify | center / center | center / center | match |
| Medallion Received | primary | label size / weight | `17` / `600` | `17` / `600` (:296) | match |
| Medallion Received | primary | label tracking / colour | `0.2` / `#FFFFFF` | `0.2` / `#FFFFFF` | match |
| Medallion Received | primary | text | `Take it` | `Take it` (medallion-post.tsx:79) | match |
| Medallion Received | primary | pressed state | `cursor:pointer` only | `PressScale` → `scale(0.99)` | match (app convention) |
| Medallion Received | secondary | top → floor | `764` → ≈70 from the frame bottom | `bottom:70` (letter.tsx:302) | match |
| Medallion Received | secondary | align / size / weight / colour | center / `15` / `500` / `#8B8882` | center / `15` / `500` / `#8B8882` (:303) | match |
| Medallion Received | secondary | text | `Put it on the shelf` | `Put it on the shelf` (medallion-post.tsx:80) | match |
| Medallion Received | screen | tab bar | none drawn | route lives outside `(app)` | match |

---

## Findings

1. **`src/app/letter.tsx:196` — the halo is positioned from the screen top, not from the safe area.**
   Current: `<View style={{ position:'absolute', left:0, right:0, top: halo[1], … }}` rendered as a
   sibling of the full-bleed gradient, *outside* `SafeAreaView`, with `halo[1] = 16`
   (`medallion-post.tsx:69`). Design: canvas top `70`, i.e. 16 **below** the 54pt status bar —
   which on device is `inset + 16`. As written the disc of light sits one whole top inset
   (~59pt) above where the canvas puts it: the canvas measures 70pt from the halo's top to the
   art frame's top, the app measures 129. Fix by passing 70 (screen-top coordinates, like the
   field and the grain) or by moving the halo inside the safe-area child that the art uses.

2. **`src/app/medallion-post.tsx:74` (via `src/app/letter.tsx:265-267`) — the arrival title renders at weight 500, design 600.**
   Current: base style `sans('500')` with `titleStyle={{ fontSize: 27, letterSpacing: -0.2 }}` —
   the override never names a weight, so `fontWeight:'500'` survives. Design: `font-weight:600`
   on the 27px `Veni` title. Fix: add `fontWeight: '600'` to `titleStyle` (the base default stays
   500 for `Letter Arrival` / `Drop Received`, which do draw 500).

3. **`src/app/(app)/milestones.tsx:258` — `Ground taken` unearned reads `Not yet · first ×1`, design reads `Not yet`.**
   Current: `stateLine` sends every stepped face with `count === 0` down one branch,
   `` `Not yet · first ${kkRung(face, face.steps[0])}` ``, and `groundtaken.steps[0] = 1`
   (`Medallion.tsx:616`). Design: the frame draws `Not yet · first ×1` on **Letter sent** and a
   bare `Not yet` on **Ground taken** — two forms for the same state, so the rule needs the
   second one (worlds are not counted in `×N` on this card).

4. **`src/components/keepsakes/Medallion.tsx:167` + `:414-417` — Vidi's crescent bite is a mask, design is a painted disc.**
   Current: `<Circle … mask={crescent}>` with a black `circle cx 48 cy 26 r 14` in the mask, which
   punches a transparent hole. Design: a *filled* `circle cx 48 cy 26 r 14 fill #F1F0EB` painted
   over the moon **and** over the disc field it overhangs (the bite circle reaches 24 units from
   the moon's centre, the moon is r15). Where it overhangs, the canvas shows flat `#F1F0EB`; the
   app shows the disc's own `#F1F0EB → #ECEAE3` ramp, and on the earned face the top-right corner
   of the sun as well.

5. **`src/components/StoicTabBar.tsx:39-42` — tab centres 49.1 / 147.4 / 245.6 / 343.9, design 70 / 196 / 318.**
   Current: four tabs on even quarters (`12.5% / 37.5% / 62.5% / 87.5%`). Design: three tabs at
   hand-set centres 70 / 196 / 318 with label boxes 44 / 52 / 60. Already documented as a
   deliberate deviation (the fourth `All` tab has nowhere else to live) — listed because these
   frames draw the bar and the row positions do not match it.

Not counted as mismatches, recorded above as notes: the earned grid's order (album order vs the
frame's apparent earn-date order — the unearned grid matches album order exactly, so the frame
cannot settle it); `6 of 11` vs a 12-face album; `borderCurve:'continuous'` on the face card;
the tab bar's height on a home-indicator phone; and the `Back on Deck` / `Tier II · The Return`
copy, which is a different medallion by design.
