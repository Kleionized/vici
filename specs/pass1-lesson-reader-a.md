# Pass 1 — second reader — Lesson Reader A

Bundle **Email Login**. Frames **Lesson-Scroll-1, -2, -3, -7**.
App: `src/components/lesson/scroll.tsx`, `src/app/lesson/day/[day].tsx`, `src/content/lessonScroll01.ts`.

Canvas is 393 × 852. Every `top` in the frames includes the 54px status bar the app never
builds, so **app top = canvas top − 54**; both numbers are given below.

Read in full: raw `.uifinal/final/Email Login/Lesson-Scroll-{1,2,3,7}.html` and pretty
`.uifinal/pretty/final/Email Login/…`. App files read in full.

Legend: `MISMATCH` = the app can close it. `MISMATCH*` = RN cannot express the CSS; the
substitute is named.

---

## 0. Shared chrome (identical declarations in all four frames)

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 1,2,3,7 | board | width × height | 393 × 852 | flex:1 device board | match |
| 1,2,3,7 | board | background | `#F4F3F0` | `#F4F3F0` (scroll.tsx:334) | match |
| 1,2,3,7 | board | overflow | `hidden` | (screen root) | match |
| 1,2,3,7 | board | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | `sans()` → `System` (theme.ts:163) | match |
| 1,2,3,7 | board | -webkit-font-smoothing | `antialiased` | AppText adds on web only (AppText.tsx:127) | match |
| 1,2,3,7 | board | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | match (canvas card chrome, not the screen) |
| 1,2,3,7 | grain | position | `inset:0` | `absolute 0/0/0/0` (Grain.tsx:16) | match |
| 1,2,3,7 | grain | background-image | `url('noise-dark.png')`, no `background-size` → tiles at 96 × 96 | `assets/images/noise-dark.png` (96 × 96 verified), `resizeMode="repeat"` | match |
| 1,2,3,7 | grain | opacity | `0.07` | `0.07` (scroll.tsx:335) | match |
| 1,2,3,7 | grain | pointer-events | `none` | `pointerEvents="none"` | match |
| 1,2,3,7 | grain | z-order | first child, below everything | first child (scroll.tsx:335) | match |
| 1,2,3,7 | status bar | height / padding | 54px, `padding:6px 32px 0 46px`, z-index 20 | OS status bar via `<StatusBar style="dark" />` ([day].tsx:59) | MISMATCH* (RN cannot draw the OS bar; the real bar is the substitute) |
| 1,2,3,7 | status bar clock | size/weight/colour/tracking | 17 / 600 / `#1D1C1A` / `-0.2px` | OS | MISMATCH* (same) |
| 1,2,3,7 | status bar glyphs | 3 SVGs, gap 7, viewBoxes 19×12, 17×12, 27×13 | verbatim `d` in frame | OS | MISMATCH* (same) |
| 1,2,3,7 | Close | left | `16px` | `16` (scroll.tsx:352) | match |
| 1,2,3,7 | Close | top | canvas `66px` → app `12` | `12` (scroll.tsx:352) | match |
| 1,2,3,7 | Close | font-size | `17px` | `17` (scroll.tsx:353) | match |
| 1,2,3,7 | Close | font-weight | `400` | `sans('400')` | match |
| 1,2,3,7 | Close | colour | `#3A3934` | `#3A3934` | match |
| 1,2,3,7 | Close | letter-spacing / line-height | not declared | dropped by AppText (own fontSize, no ls/lh) | match |
| 1,2,3,7 | Close | z-index | `5` | `zIndex: 5` | match |
| 1,2,3,7 | Close | copy | `Close` | `Close` | match |
| 1,2,3,7 | progress track | left / right | `16 / 16` | `16 / 16` (scroll.tsx:357) | match |
| 1,2,3,7 | progress track | top | canvas `108px` → app `54` | `54` | match |
| 1,2,3,7 | progress track | height | `2px` | `2` | match |
| 1,2,3,7 | progress track | border-radius | `1px` | `1` | match |
| 1,2,3,7 | progress track | background | `rgba(0,0,0,0.05)` | `rgba(0,0,0,0.05)` | match |
| 1,2,3,7 | progress track | z-index | `5` | `5` | match |
| 1,2,3,7 | progress fill | background | `#B4B1AB` | `#B4B1AB` (scroll.tsx:358) | match |
| 1,2,3,7 | progress fill | border-radius | `1px` | `1` | match |
| 1,2,3,7 | progress fill | geometry | `left:0; top:0; bottom:0` | `height: 2` in flow | match |
| 1 | progress fill | width | `4%` | `round(1/26×100)` = 4 | match |
| 2 | progress fill | width | `8%` | `round(2/26×100)` = 8 | match |
| 3 | progress fill | width | `12%` | `round(3/26×100)` = 12 | match |
| 7 | progress fill | width | `27%` | `round(7/26×100)` = 27 | match |
| 1,2,3,7 | stack | position | `inset:0` — centred in the **whole** 852 | `top:-54, height: innerHeight+54` (scroll.tsx:365) | **MISMATCH** — see Findings F-1 |
| 1,2,3,7 | stack | flex-direction | `column` | RN default column | match |
| 1,2,3,7 | stack | align-items | `center` | `alignItems:'center'` | match |
| 1,2,3,7 | stack | justify-content | `center` | `justifyContent:'center'` | match |
| 1,2,3,7 | stack | padding | `0 38px` | `paddingHorizontal: 38` | match |
| 1,2,3,7 | stack | box-sizing | `border-box` | RN default border-box | match |
| 1,2,3,7 | stack | z-index | none (auto) — Close and hairline sit above it via their `z-index:5` | no zIndex; Close/hairline at 5 | match |
| 2,3,7 | stack | gap | `48px` | `STACK_GAP = 48` (scroll.tsx:26) | match |
| 1 | stack | gap | `36px` | `COVER_GAP = 36` (scroll.tsx:27) | match |

---

## 1. Lesson-Scroll-1 — the cover

### 1a. Text stack

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 1 | eyebrow | copy | `WEEK I &middot; RESET` → `WEEK I · RESET` (U+00B7) | `'WEEK I · RESET'` (lessonScroll01.ts:30) — U+00B7 verified | match |
| 1 | eyebrow | font-size | `12px` | `12` (scroll.tsx:33) | match |
| 1 | eyebrow | font-weight | `600` | `sans('600')` | match |
| 1 | eyebrow | letter-spacing | `1.8px` | `1.8` | match |
| 1 | eyebrow | text-align | `center` | `center` | match |
| 1 | eyebrow | colour | `#B0AEA8` | `#B0AEA8` | match |
| 1 | eyebrow | line-height | not declared | AppText drops the variant leading | match |
| 1 | eyebrow | text-transform | none (authored in caps) | no transform, caps in content | match |
| 1 | spacer 1 | height | `14px` | `<Spacer height={14} />` ([day].tsx:92) | match |
| 1 | title | copy | `Surviving the Night` | same (lessonScroll01.ts:30) | match |
| 1 | title | font-size | `28px` | `28` (scroll.tsx:38) | match |
| 1 | title | font-weight | `500` | `sans('500')` | match |
| 1 | title | line-height | `40px` | `40` | match |
| 1 | title | text-align | `center` | `center` | match |
| 1 | title | colour | `#1D1C1A` | `#1D1C1A` | match |
| 1 | title | max-width | `280px` | `280` | match |
| 1 | title | letter-spacing | not declared | dropped by AppText | match |
| 1 | title | text-wrap | `balance` | web gets `pretty` (AppText.tsx:128, variant `body`); native none | MISMATCH* — RN has no `text-wrap`; substitute is the platform's greedy line breaker |
| 1 | spacer 2 | height | `10px` | `<Spacer height={10} />` ([day].tsx:94) | match |
| 1 | meta | copy | `6 min` | `'6 min'` | match |
| 1 | meta | font-size | `15px` | `15` (scroll.tsx:43) | match |
| 1 | meta | font-weight | `500` | `sans('500')` | match |
| 1 | meta | text-align | `center` | `center` | match |
| 1 | meta | colour | `#8B8882` | `#8B8882` | match |
| 1 | meta | line-height / letter-spacing | not declared | both dropped | match |
| 1 | stack order | children | eyebrow, sp14, title, sp10, meta, scene (6 children @ gap 36 ⇒ 86 / 82 / 36) | identical ([day].tsx:89–97) | match |

### 1b. Cover scene — slot and wrapper

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 1 | scene slot | width × height | `270 × 224` | `270 × 224` ([day].tsx:268) | match |
| 1 | scene slot | position | `relative` | RN default | match |
| 1 | scene slot | flex-shrink | `0` | RN default 0 | match |
| 1 | scene wrapper | left | `50%` + `margin-left:-120px` ⇒ **15** | `left: 15` ([day].tsx:269) | match |
| 1 | scene wrapper | top | `0` | `top: 0` | match |
| 1 | scene wrapper | width × height | `240 × 200` | `240 × 200` | match |
| 1 | scene wrapper | transform | `scale(1.12)` | `[{ scale: 1.12 }]` | match |
| 1 | scene wrapper | transform-origin | `top center` | `'top center'` | match |
| 1 | scene clip | position / overflow | `inset:0`, `overflow:hidden` | `absolute 0,0 240×200`, `overflow:'hidden'` ([day].tsx:270) | match |

### 1c. Cover scene — layers, in paint order

| # | Frame | Layer | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|---|
| 1 | 1 | floor | box | `left:-28 top:166 w:296 h:64` | Path `M-28 192 A148 26 0 0 1 268 192 L268 230 L-28 230 Z` ([day].tsx:273) | match |
| 1 | 1 | floor | border-radius | `50% 50% 0 0 / 26px 26px 0 0` ⇒ semi-ellipse rx 148 ry 26 centred (120,192), apex y 166 | arc rx 148 ry 26, chord 296 = 2·rx, sweep 1 ⇒ exact semi-ellipse | match |
| 1 | 1 | floor | background | `#EAE9E3` | `#EAE9E3` | match |
| 2 | 1 | window glow | box | `left:26 top:118 w:80 h:80` ⇒ centre (66,158) | `Circle cx 66 cy 158 r 40` ([day].tsx:300) | match |
| 2 | 1 | window glow | gradient | `radial-gradient(closest-side, rgba(203,218,232,0.24), rgba(203,218,232,0) 76%)` — closest-side on a square ⇒ r 40 | `#CBDAE8` (= rgb 203,218,232) stop 0 @ α 0.24, stop 0.76 @ α 0 ([day].tsx:275–278) | match |
| 2 | 1 | window glow | filter | `blur(5px)` | none | MISMATCH* — absorbed into the gradient falloff (documented [day].tsx:262–265) |
| 3 | 1 | window glass | box | `left:44 top:16 w:58 h:72` | same ([day].tsx:304) | match |
| 3 | 1 | window glass | border-radius | `6px` | `6` | match |
| 3 | 1 | window glass | background | `linear-gradient(180deg, #12151B 0%, #1A2027 100%)` over the 72-tall box | `cs-glass` x1 0 y1 **16** → x2 0 y2 **88**, userSpaceOnUse, referenced inside a **58 × 72** `<Svg>` whose origin is the window's own top-left ([day].tsx:279–282, 305–307) | **MISMATCH** — see Findings F-3 |
| 3 | 1 | window glass | gradient host | — | `cs-glass` is declared in a **different** `<Svg>` root than the `<Rect>` that uses it | **MISMATCH** — see Findings F-2 |
| 3 | 1 | window glass | box-shadow | `0 0 0 6px #E4E3DE, 0 5px 12px rgba(40,38,32,0.14)` | identical string ([day].tsx:304) | match |
| 4 | 1 | mullion | box / colour | `left:71 top:16 w:4 h:72`, `#E4E3DE` | same ([day].tsx:309) | match |
| 5 | 1 | sill | box / radius / colour | `left:37 top:88 w:72 h:7`, r 3, `#D6D5D0` | same ([day].tsx:310) | match |
| 6 | 1 | moon | box / radius / colour | `left:82 top:28 w:13 h:13`, r 50%, `#DCDED8` | `13 × 13`, `borderRadius 6.5`, `#DCDED8` ([day].tsx:311) | match |
| 6 | 1 | moon | box-shadow | `0 0 10px rgba(220,222,216,0.6)` | identical | match |
| 7 | 1 | star A | box / colour | `left:54 top:50 w:2.5 h:2.5`, r 50%, `rgba(244,243,240,0.6)` | `2.5`, `borderRadius 1.25`, same rgba ([day].tsx:312) | match |
| 8 | 1 | star B | box / colour | `left:62 top:68 w:2 h:2`, r 50%, `rgba(244,243,240,0.4)` | same ([day].tsx:313) | match |
| 9 | 1 | table shadow | box | `left:53 top:167 w:50 h:11`, r 50% ⇒ centre (78,172.5) rx 25 ry 5.5 | `Ellipse cx 78 cy 172.5 rx 25 ry 5.5` ([day].tsx:317) | match |
| 9 | 1 | table shadow | fill + blur | `rgba(0,0,0,0.08)` + `blur(5px)` | 4-stop ramp α 0.08 / 0.058 @0.5 / 0.024 @0.78 / 0 @1 | MISMATCH* — blur redrawn as its own falloff |
| 9 | 1 | table shadow | gradient host | — | `cs-sh1` declared in a different `<Svg>` root ([day].tsx:287–292 vs 316–318) | **MISMATCH** — see Findings F-2 |
| 10 | 1 | table top | box / radius / colour | `left:56 top:136 w:44 h:28`, r 5, `#E4E3DE` | same ([day].tsx:319) | match |
| 11 | 1 | drawer line | box / radius / colour | `left:65 top:145 w:26 h:4`, r 2, `#B4B1AB` | same ([day].tsx:320) | match |
| 12 | 1 | table leg L | box / colour | `left:60 top:164 w:5 h:6`, `#C6C5C0`, no radius | same ([day].tsx:321) | match |
| 13 | 1 | table leg R | box / colour | `left:91 top:164 w:5 h:6`, `#C6C5C0` | same ([day].tsx:322) | match |
| 14 | 1 | lamp glow | box | `left:62 top:98 w:32 h:32` ⇒ centre (78,114) r 16 | `Circle cx 78 cy 114 r 16` ([day].tsx:324) | match |
| 14 | 1 | lamp glow | gradient | `radial-gradient(closest-side, rgba(226,186,120,0.45), rgba(226,186,120,0) 74%)` | `#E2BA78` α 0.45 @0, α 0 @0.74 ([day].tsx:283–286) | match |
| 14 | 1 | lamp glow | filter | `blur(5px)` | none | MISMATCH* — absorbed into the falloff |
| 14 | 1 | lamp glow | gradient host | — | `cs-lamp` declared in a different `<Svg>` root | **MISMATCH** — see Findings F-2 |
| 15 | 1 | lamp shade | box / radius / colour | `left:67 top:100 w:22 h:15`, r `8 8 3 3`, `#E9D2A4` | TL 8 TR 8 BR 3 BL 3, `#E9D2A4` ([day].tsx:326) | match |
| 16 | 1 | lamp stem | box / colour | `left:76.5 top:115 w:3 h:16`, `#C6C5C0` | same ([day].tsx:327) | match |
| 17 | 1 | lamp base | box / radius / colour | `left:70 top:131 w:16 h:5`, r 2.5, `#C6C5C0` | same ([day].tsx:328) | match |
| 18 | 1 | bed shadow | box | `left:115 top:167 w:118 h:11`, r 50% ⇒ centre (174,172.5) rx 59 ry 5.5 | `Ellipse cx 174 cy 172.5 rx 59 ry 5.5` ([day].tsx:332) | match |
| 18 | 1 | bed shadow | fill + blur | `rgba(0,0,0,0.09)` + `blur(5px)` | ramp α 0.09 / 0.065 @0.5 / 0.027 @0.78 / 0 @1 | MISMATCH* — blur redrawn as its own falloff |
| 18 | 1 | bed shadow | gradient host | — | `cs-sh2` declared in a different `<Svg>` root ([day].tsx:293–298 vs 331–333) | **MISMATCH** — see Findings F-2 |
| 19 | 1 | headboard | box / radius / colour | `left:114 top:108 w:10 h:62`, r `5 5 3 3`, `#D6D5D0` | same ([day].tsx:334) | match |
| 20 | 1 | mattress | box / radius / colour | `left:122 top:138 w:104 h:24`, r `6 10 5 5`, `#E0DFDA` | same ([day].tsx:335) | match |
| 21 | 1 | duvet | box / radius / colour | `left:156 top:136 w:70 h:26`, r `12 12 5 4`, `#C9C8C1` | same ([day].tsx:336) | match |
| 22 | 1 | duvet highlight | box / radius / colour | `left:162 top:142 w:56 h:4`, r 2, `rgba(255,255,255,0.55)` | same ([day].tsx:337) | match |
| 23 | 1 | pillow | box / radius / colour | `left:126 top:129 w:28 h:14`, r `7 7 5 5`, `#FFFFFF` | same ([day].tsx:338–340) | match |
| 23 | 1 | pillow | box-shadow | `inset 0 -2.5px 0 #D6D5D0, 0 1.5px 3px rgba(40,38,32,0.14)` | identical string | match |
| 24 | 1 | bed leg L | box / radius / colour | `left:124 top:162 w:6 h:8`, r `0 0 2 2`, `#C6C5C0` | same ([day].tsx:341) | match |
| 25 | 1 | bed leg R | box / radius / colour | `left:216 top:162 w:6 h:8`, r `0 0 2 2`, `#C6C5C0` | same ([day].tsx:342) | match |
| 26 | 1 | sky speck A | box / colour | `left:212 top:40 w:2 h:2`, r 50%, `rgba(200,225,235,0.4)` | same ([day].tsx:344) | match |
| 27 | 1 | sky speck B | box / colour | `left:198 top:68 w:2 h:2`, r 50%, `rgba(200,225,235,0.3)` | same ([day].tsx:345) | match |
| — | 1 | all 27 layers | paint order | as listed | identical order in JSX ([day].tsx:272–345) | match |

### 1d. Cover chevron

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 1 | chevron rail | left / right | `0 / 0` | `0 / 0` (scroll.tsx:370) | match |
| 1 | chevron rail | bottom | `42px` from the 852 board bottom | `bottom: 42` **inside a bottom-safe-area inset view** | **MISMATCH** — see Findings F-4 |
| 1 | chevron rail | justify-content | `center` | `alignItems:'center'` on a column | match |
| 1 | chevron rail | z-index | `5` | `5` | match |
| 1 | chevron | width × height | `22 × 12` | `22 × 12` (scroll.tsx:371) | match |
| 1 | chevron | viewBox | `0 0 22 12` | `0 0 22 12` | match |
| 1 | chevron | path d | `M2 2l9 8 9-8` | `M2 2l9 8 9-8` | match |
| 1 | chevron | fill | `none` | `fill="none"` on `<Svg>`, no fill on Path | match |
| 1 | chevron | stroke | `#B0AEA8` | `#B0AEA8` | match |
| 1 | chevron | stroke-width | `2.4` | `2.4` | match |
| 1 | chevron | linecap / linejoin | `round` / `round` | `round` / `round` | match |

---

## 2. Lesson-Scroll-2 — the epigraph

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 2 | sun box | width × height | `12 × 12` | `12 × 12` (scroll.tsx:152) | match |
| 2 | sun box | position / flex-shrink | `relative` / `0` | RN defaults | match |
| 2 | sun halo | offset | `left:-13 top:-13` | `left:-13 top:-13` (scroll.tsx:153, `off = 13`) | match |
| 2 | sun halo | width × height | `38 × 38` | `38 × 38` (`halo = 38`) | match |
| 2 | sun halo | gradient | `radial-gradient(closest-side, rgba(226,186,120,0.4), rgba(226,186,120,0) 76%)`, closest-side ⇒ r 19 | `cx/cy 19, rx/ry 19`, `#E2BA78` α 0.4 @0, α 0 @0.76 (scroll.tsx:155–160) | match |
| 2 | sun halo | filter | `blur(3px)` | none | MISMATCH* — absorbed into the falloff |
| 2 | sun halo | z-order | drawn **before** the dot ⇒ dot on top | halo `<Svg>` before the dot `<View>`; native paints in tree order, and on web both land in CSS paint step 8 (halo `z-index:auto`, RNW View base `position:relative; z-index:0` — `react-native-web/dist/exports/View/index.js:132,134`) so tree order still puts the dot on top | match |
| 2 | sun dot | box | `inset:0` on the 12 box | `12 × 12`, `borderRadius 6` (scroll.tsx:162) | match |
| 2 | sun dot | gradient centre | `circle at 34% 30%` ⇒ (4.08, 3.6) | `cx 4.08, cy 3.6` (scroll.tsx:165) | match |
| 2 | sun dot | gradient radius | no size keyword ⇒ farthest-corner = √(7.92² + 8.4²) = 11.545 | `Math.hypot(12×0.66, 12×0.7)` = 11.545 (scroll.tsx:150) | match |
| 2 | sun dot | stops | `#F3E3C4 0%`, `#E2BA78 58%`, `#C49856 100%` | `0 / 0.58 / 1` with the same hexes | match |
| 2 | sun dot | box-shadow | `0 2px 6px rgba(160,120,50,0.3)` | identical string (scroll.tsx:162) | match |
| 2 | epigraph | copy | `A journey of a thousand miles begins with a single step.` (no entities) | identical (lessonScroll01.ts:31) | match |
| 2 | epigraph | font-family | `'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif` | `"Iowan Old Style, Palatino, Georgia, serif"` — a CSS stack in a single RN `fontFamily`, and `'Palatino Linotype'` dropped (scroll.tsx:63) | **MISMATCH** — see Findings F-5 |
| 2 | epigraph | font-size | `28px` | `28` | match |
| 2 | epigraph | font-weight | `500` | `'500'` | match |
| 2 | epigraph | line-height | `44px` | `44` | match |
| 2 | epigraph | text-align | `center` | `center` prop | match |
| 2 | epigraph | colour | `#1D1C1A` | `#1D1C1A` | match |
| 2 | epigraph | max-width | `300px` | `300` | match |
| 2 | epigraph | letter-spacing | not declared | dropped by AppText (own fontSize, no ls) | match |
| 2 | epigraph | text-wrap | `balance` | web `pretty`, native none | MISMATCH* — no RN equivalent |
| 2 | attribution row | display / align / justify | flex row, `center` / `center` | `flexDirection:'row', alignItems:'center', justifyContent:'center'` (scroll.tsx:77) | match |
| 2 | attribution row | gap | `14px` | `14` | match |
| 2 | attribution rule L | width × height | `22 × 1.5` | `22 × 1.5` (scroll.tsx:78) | match |
| 2 | attribution rule L | background | `#C9C7C0` | `#C9C7C0` | match |
| 2 | attribution rule R | width × height / colour | `22 × 1.5` / `#C9C7C0` | same (scroll.tsx:80) | match |
| 2 | attribution text | copy | `LAO TZU` | `'LAO TZU'` (lessonScroll01.ts:31) | match |
| 2 | attribution text | font-size | `12px` | `12` (scroll.tsx:79) | match |
| 2 | attribution text | font-weight | `600` | `sans('600')` | match |
| 2 | attribution text | letter-spacing | `1.8px` | `1.8` | match |
| 2 | attribution text | colour | `#B0AEA8` | `#B0AEA8` | match |
| 2 | attribution text | text-align | not declared (centred by the row) | no `center` prop; row centres it | match |
| 2 | stack | children | sun, epigraph, attribution (3, gap 48) | identical ([day].tsx:99–106) | match |

---

## 3. Lesson-Scroll-3 — the crescent statement

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 3 | crescent box | width × height | `34 × 30` | `34 × 30` (scroll.tsx:184) | match |
| 3 | crescent box | position / flex-shrink | `relative` / `0` | RN defaults | match |
| 3 | crescent disc | box | `left:0 top:2 w:28 h:28`, r 50% ⇒ centre (14,16) r 14 | `Circle cx 14 cy 16 r 14` (scroll.tsx:198) | match |
| 3 | crescent disc | background | `#C5C4BD` | `#C5C4BD` | match |
| 3 | crescent disc | mask | `radial-gradient(circle at 23px 9px, transparent 11px, #000 11.5px)` — coords local to the disc box (top 2) ⇒ mark-box centre (23, 11) | `<Mask>`: white `Rect 0,2,28,28` + `Circle cx 23 cy 11 r 11.5` filled black→black@0.9565→white@1 (0.9565 × 11.5 = 11.000) (scroll.tsx:188–197) | MISMATCH* — `mask-image` has no RN form; the substitute is an SVG luminance `<Mask>` reproducing the same 11 → 11.5 ramp |
| 3 | crescent speck | box | `right:0 top:0 w:3 h:3` on a 34-wide box ⇒ centre (32.5, 1.5) r 1.5 | `Circle cx 32.5 cy 1.5 r 1.5` (scroll.tsx:199) | match |
| 3 | crescent speck | background | `#C6C5C0` | `#C6C5C0` | match |
| 3 | statement | copy | `You do not need to fix your life tonight.` (no entities) | identical (lessonScroll01.ts:32) | match |
| 3 | statement | font-size | `26px` | `26` (scroll.tsx:91) | match |
| 3 | statement | font-weight | `500` | `sans('500')` | match |
| 3 | statement | line-height | `38px` | `38` | match |
| 3 | statement | text-align | `center` | `center` | match |
| 3 | statement | colour | `#1D1C1A` | `#1D1C1A` | match |
| 3 | statement | max-width | **`280px`** | `300` | **MISMATCH** — see Findings F-6 |
| 3 | statement | letter-spacing | not declared | dropped by AppText | match |
| 3 | statement | text-wrap | `balance` | web `pretty`, native none | MISMATCH* — no RN equivalent |
| 3 | stack | children | crescent, statement (2, gap 48) | identical ([day].tsx:107–114; `before` absent) | match |

---

## 4. Lesson-Scroll-7 — the fading cascade

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| 7 | cascade column | display / flex-direction | flex / `column` | RN default column (scroll.tsx:111) | match |
| 7 | cascade column | align-items | `center` | `alignItems:'center'` | match |
| 7 | cascade column | gap | `26px` | `26` | match |
| 7 | cascade column | width | shrink-to-fit | shrink-to-fit (no `alignSelf:'stretch'`) | match |
| 7 | line 1 | copy | `Never again.` | `'Never again.'` (lessonScroll01.ts:40) | match |
| 7 | line 1 | colour | `#8B8882` | `CASCADE_FADE[0]` = `#8B8882` (scroll.tsx:107) | match |
| 7 | line 2 | copy | `Ninety days.` | `'Ninety days.'` | match |
| 7 | line 2 | colour | `#A5A29B` | `CASCADE_FADE[1]` = `#A5A29B` | match |
| 7 | line 3 | copy | `The rest of your life.` | `'The rest of your life.'` | match |
| 7 | line 3 | colour | `#BBB8B1` | `CASCADE_FADE[2]` = `#BBB8B1` | match |
| 7 | all lines | font-size | `22px` | `22` (scroll.tsx:116) | match |
| 7 | all lines | font-weight | `500` | `sans('500')` | match |
| 7 | all lines | line-height | `32px` | `32` | match |
| 7 | all lines | text-align | `center` | `center` prop | match |
| 7 | all lines | max-width | `300px` | `300` | match |
| 7 | all lines | letter-spacing | not declared | dropped by AppText | match |
| 7 | all lines | text-wrap | `balance` | web `pretty`, native none | MISMATCH* — no RN equivalent |
| 7 | stack | children | one column (gap 48 has nothing to act on) | `before`/`after` both absent ⇒ single child ([day].tsx:124–131) | match |
| 7 | page | footer pill | none drawn | `PageFooter` returns null for `cascade` ([day].tsx:170) | match |
| 7 | page | chevron | not drawn | `chevron` only when `kind === 'cover'` ([day].tsx:64) | match |

---

## Findings

Every MISMATCH, in severity order. `MISMATCH*` entries that are already the documented RN
substitute (`filter: blur`, `mask-image`, `text-wrap: balance`, the OS status bar) are not
repeated here — they are marked in the tables above and need no change.

**F-1 — the centred stack is 14.5pt high, and drifts with the device's insets.**
`src/components/lesson/scroll.tsx:365`
Current: `style={{ position:'absolute', left:0, right:0, top:-54, height: height + 54, … }}`,
where `height` is the height of a view already inset on **both** edges by `SafeAreaView
edges={['top','bottom']}` (scroll.tsx:346).
On a 393 × 852 device with insets (top 59, bottom 34): inner height = 759, so the box spans
inner-y −54 → 759, centre at inner-y 352.5, screen-y **411.5**.
Design: the stack is `inset:0` on the full 852 ⇒ centre at screen-y **426.0**.
Error = 14.5pt, and generally `399 + topInset/2 − bottomInset/2` instead of a constant 426.
The construction is only exact when topInset is 54 and bottomInset is 0. Closing it needs the
box pinned to the real insets (`top: -topInset`, `height: 852`), not to the literal 54.

**F-2 — four cover-scene gradients are declared in a different `<Svg>` root from the node that uses them, so they resolve to nothing on native.**
`src/app/lesson/day/[day].tsx:274–299` declares `cs-win`, `cs-glass`, `cs-lamp`, `cs-sh1`,
`cs-sh2` inside the first `SceneSvg`. Only `cs-win` is consumed there (line 300). The other
four are consumed from separate `<Svg>` roots: `cs-glass` at line 306, `cs-sh1` at line 317,
`cs-lamp` at line 324, `cs-sh2` at line 332.
react-native-svg 15.15.4 scopes gradient definitions **per `<Svg>` instance**, not globally:
`_painters` is an instance `NSMutableDictionary` on `RNSVGSvgView`
(`node_modules/react-native-svg/apple/Elements/RNSVGSvgView.mm:29`, `definePainter`/
`getDefinedPainter` at 439/450), and `mDefinedBrushes` is an instance `HashMap` on `SvgView`
(`node_modules/react-native-svg/android/src/main/java/com/horcrux/svg/SvgView.java:177`,
`defineBrush`/`getDefinedBrush` at 430/434). A cross-root `url(#id)` returns null.
Effect on iOS and Android: the window's dark glass, the lamp glow, and both cast shadows do
not paint. On web the reference resolves document-wide, which is why the frame looks right in
a browser check. Fix: move each `<Defs>` into the `<Svg>` that references it (or draw the whole
scene in one `<Svg>`).

**F-3 — the window-glass gradient is written in scene coordinates inside a 58 × 72 SVG.**
`src/app/lesson/day/[day].tsx:279–282`
Current: `<SvgLinearGradient id="cs-glass" x1="0" y1="16" x2="0" y2="88" gradientUnits="userSpaceOnUse">`,
referenced by `<Rect x=0 y=0 width=58 height=72>` inside `SceneSvg width={58} height={72}`
(line 305–307), whose origin is the window's own top-left — not the scene box.
Design: `linear-gradient(180deg, #12151B 0%, #1A2027 100%)` spanning the full 72pt of the glass.
As written the ramp starts 16pt below the glass top (rows 0–16 pad flat at `#12151B`) and
reaches only (72−16)/(88−16) = 0.7778 of the way at the bottom, i.e. `#181E24` where the
design has `#1A2027`.
This is live on web today, and becomes live on native the moment F-2 is fixed.
Design value: `y1="0"`, `y2="72"`.

**F-4 — the cover chevron sits 34pt too high.**
`src/components/lesson/scroll.tsx:370`
Current: `bottom: 42` inside the `SafeAreaView edges={['top','bottom']}` subtree, so on a
34pt home-indicator device it lands 76pt above the board bottom.
Design: `bottom:42px` measured from the bottom of the 852 board (the frame draws no home
indicator). Design value in app space: 42 − bottomInset, i.e. the rail must not take the
bottom inset.

**F-5 — the epigraph serif never resolves; frame 2 renders in the system sans.**
`src/components/lesson/scroll.tsx:63`
Current: `fontFamily: "Iowan Old Style, Palatino, Georgia, serif"`.
RN's `fontFamily` on iOS and Android takes **one** family name, not a CSS stack; nothing in
the repo registers this string (only reference is this line — no `expo-font` entry, no
`app.json` asset). The name fails to resolve and the text falls back to the system face, so
the one serif slot in the whole reader renders as SF.
Design value: `'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif` — on iOS the head
of that list ships with the OS under the family name `Iowan Old Style`, so the platform-split
literal is `Platform.select({ ios: 'Iowan Old Style', android: 'serif', web: "'Iowan Old
Style','Palatino Linotype',Palatino,Georgia,serif" })`.
Also affects frame 25, the other `Epigraph`.

**F-6 — the Statement slot hard-codes 300 where frame 3 declares 280.**
`src/components/lesson/scroll.tsx:91`
Current: `maxWidth: 300`.
Design (Lesson-Scroll-3): `max-width:280px`.
Census of the 14 frames carrying the 26/500/38 statement style: `300` ×11 (5, 6, 9, 10, 11,
13, 17, 20, 22, 23, 26), `280` ×1 (3), `310` ×1 (16), `320` ×1 (24) — so the slot has four
authored widths, not one, and 280 / 310 / 320 are all currently rendered at 300. Frame 3's own
copy happens to break to two lines at either width, so the visible cost here is only the
centring box; frames 16 and 24 are outside this audit.
