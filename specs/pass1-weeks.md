# Pass 1 — Week overview boards (second reader)

**Bundle** `Email Login`
**Frames audited (7)**

| Frame | Pretty path |
|---|---|
| Week-I-Reset | `.uifinal/pretty/final/Email Login/Week-I-Reset.html` |
| Week-I-Reset-P2 | `.uifinal/pretty/final/Email Login/Week-I-Reset-P2.html` |
| Week-IV-Know-Your-Brain | `.uifinal/pretty/final/Email Login/Week-IV-Know-Your-Brain.html` |
| Week-IV-Know-Your-Brain-P2 | `.uifinal/pretty/final/Email Login/Week-IV-Know-Your-Brain-P2.html` |
| Week-VIII-Boredom-and-Meaning | `.uifinal/pretty/final/Email Login/Week-VIII-Boredom-and-Meaning.html` |
| Week-XII-Leave-It-Behind | `.uifinal/pretty/final/Email Login/Week-XII-Leave-It-Behind.html` |
| Week-XII-Leave-It-Behind-P2 | `.uifinal/pretty/final/Email Login/Week-XII-Leave-It-Behind-P2.html` |

**App files**
`/Users/admin/Documents/tideline/src/app/week/[week].tsx`
`/Users/admin/Documents/tideline/src/components/journey/WeekScene.tsx`
`/Users/admin/Documents/tideline/src/content/weekScenes.ts`
supporting: `src/components/ui/AppText.tsx`, `src/components/ui/Grain.tsx`, `src/components/ui/press-scale.tsx`, `src/lib/theme.ts`, `src/content/curriculum84.ts`

**Canvas convention.** Every frame is 393 × 852 and its `top` values include a 54px status bar the app never builds. App top = canvas top − 54. Both numbers are given in every positional row.

**Structural reading of the P2 frames.** `Week-I-Reset-P2` is byte-identical to `Week-I-Reset` outside the row column (verified by diff on `Week-XII`: only the three titles and three numbers differ, plus the trailing rows). Both frames put their first row at canvas 486 and use the same 80 pitch. They are one scrolling column at two scroll positions, not two boards. The app's single `ScrollView` is the right reading.

---

## A. Screen chrome — shared by all seven frames

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 7 | frame root | background | `#F4F3F0` | `#F4F3F0` — `[week].tsx:61` | match |
| all 7 | frame root | width × height | 393 × 852 | device window | match (board size) |
| all 7 | frame root | overflow | `hidden` | screen root, n/a | match |
| all 7 | frame root | box-shadow | `0 0 0 1px rgba(0,0,0,0.09), 0 16px 40px rgba(40,38,32,0.16)` | none | match — frame-presentation chrome, not screen paint |
| all 7 | grain | position | `inset:0` | `absolute` top/left/right/bottom 0 — `Grain.tsx:16` | match |
| all 7 | grain | background-image | `url('noise-dark.png')`, no `background-size` → tiles at intrinsic 96 × 96 | `Image resizeMode="repeat"`, asset measured 96 × 96 @1x | match |
| all 7 | grain | opacity | `0.07` | `0.07` — `[week].tsx:63` | match |
| all 7 | grain | pointer-events | `none` | `pointerEvents="none"` | match |
| all 7 | grain | z-order | first child → under every sibling | rendered before `SafeAreaView` | match |
| all 7 | status bar | height / content | 54, `9:41` 17/600/−0.2 `#1D1C1A` + 3 glyphs, z-index 20 | not built; `<StatusBar style="dark" />` | match by convention |
| all 7 | back chevron box | left | 16 | 16 — `[week].tsx:72` | match |
| all 7 | back chevron box | top | canvas 64 → app 10 | 10 | match |
| all 7 | back chevron box | display / align-items / gap | `flex` / `center` / 9 | single child, no gap effect | match |
| all 7 | back chevron | svg width × height | 11 × 19 | 11 × 19 — `[week].tsx:73` | match |
| all 7 | back chevron | viewBox | `0 0 11 19` | `0 0 11 19` | match |
| all 7 | back chevron | path `d` | `M9.5 1.5L2 9.5l7.5 8` | `M9.5 1.5L2 9.5l7.5 8` | match |
| all 7 | back chevron | fill | `none` (on path) | `fill="none"` on `<Svg>`, inherited by `<Path>` | match |
| all 7 | back chevron | stroke | `#55534E` | `#55534E` | match |
| all 7 | back chevron | stroke-width | 2.4 | 2.4 | match |
| all 7 | back chevron | linecap / linejoin | `round` / `round` | `round` / `round` | match |
| all 7 | back chevron | hit target | none declared | `minHeight:0`, `hitSlop:16` all sides, `zIndex:5` | match (additions, no paint) |
| I / IV / VIII / XII | title | text | `Reset` / `Know Your Brain` / `Boredom and Meaning` / `Leave It Behind` | `data.name` — `curriculum84.ts` weeks 1/4/8/12, all four verified verbatim | match |
| all 7 | title | left | 24 | 24 — `[week].tsx:79` | match |
| all 7 | title | top | canvas 114 → app 60 | 60 | match |
| all 7 | title | font-family | `-apple-system,'SF Pro Text',system-ui,…` | `sans('600')` → `System` on iOS | match |
| all 7 | title | font-weight | 600 | `'600'` | match |
| all 7 | title | font-size | 27 | 27 | match |
| all 7 | title | letter-spacing | −0.2px | −0.2 | match |
| all 7 | title | color | `#1D1C1A` | `#1D1C1A` | match |
| all 7 | title | line-height | not declared (normal) | `AppText` deletes the inherited variant leading when the caller names a size (`AppText.tsx:119,139`) | match |
| all 7 | title | max lines | not declared | not declared | match |
| I / IV / VIII / XII | blurb | text | `Week I · Survive the nights and steady the basics.` / `Week IV · The machinery behind the pull.` / `Week VIII · Empty hours, and what fills them well.` / `Week XII · Make it permanent, then let it go.` | `Week {data.roman} · {data.blurb}` — all four verified verbatim against `curriculum84.ts` | match |
| all 7 | blurb | left | 24 | 24 — `[week].tsx:83` | match |
| all 7 | blurb | right | 60 | `right: 60` | match |
| all 7 | blurb | top | canvas 158 → app 104 | 104 | match |
| all 7 | blurb | font-weight | 400 | `sans('400')` | match |
| all 7 | blurb | font-size | 14.5 | 14.5 | match |
| all 7 | blurb | line-height | 21px | 21 | match |
| all 7 | blurb | letter-spacing | not declared | deleted by `AppText.tsx:120,138` | match |
| all 7 | blurb | color | `#55534E` | `#55534E` | match |
| all 7 | blurb | text-wrap | `pretty` | no RN equivalent; `AppText` emits `textWrap:'pretty'` on web only (`AppText.tsx:128`), native uses the platform breaker | **MISMATCH\*** — substitute: platform line-breaker |
| all 7 | scene band | left / right | 0 / 0 | 0 / 0 — `[week].tsx:88` | match |
| all 7 | scene band | top | canvas 214 → app 160 | 160 | match |
| all 7 | scene band | height | 258 | `WEEK_SCENE_HEIGHT = 258` | match |
| all 7 | scene band | overflow | `hidden` | `overflow:'hidden'` + `<Svg height={258}>` viewport | match |
| all 7 | scene band | background | `linear-gradient(180deg, #F4F3F0 0%, #F3EEE1 58%, #F4F3F0 100%)` | `<Rect>` filled by `wsky` stops 0→`#F4F3F0`, 0.58→`#F3EEE1`, 1→`#F4F3F0`, userSpaceOnUse y 0→258 — `WeekScene.tsx:215-221` | match |
| all 7 | scene band | z-order | after blurb, before rows | same | match |

## B. Row column and the three states

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 7 | row card | left / right | 24 / 24 | `marginHorizontal: 24` — `[week].tsx:127` | match |
| all 7 | row 1 | top | canvas 486 → app 432 | `ScrollView` `top: 432`, no `paddingTop` | match |
| all 7 | row pitch | top deltas | 486 → 566 → 646 → 726 = 80 | `ROW_H 56` + `Pips` 24 = 80 | match |
| all 7 | row card | height | 56 | `height: 56`, `minHeight: 56` (overrides `PressScale`'s 44) | match |
| all 7 | row card | border-radius | `14px` — a circular arc | `borderRadius: 14` **plus `borderCurve: 'continuous'`** — `[week].tsx:130-131` | **MISMATCH** — added squircle; the frame declares a plain circular 14 |
| all 7 | row card | background | `#FFFFFF` | `#FFFFFF` | match |
| I, IV, VIII, XII | row card | box-shadow (done / locked) | `0 0 0 1px rgba(0,0,0,0.06)` | `'0 0 0 1px rgba(0,0,0,0.06)'` | match |
| — | row card | box-shadow (current) | `0 0 0 2px #131313, 0 10px 24px rgba(40,38,32,0.12)` | `'0 0 0 2px #131313, 0 10px 24px rgba(40,38,32,0.12)'` | match — state absent from these 7 frames; verified against `Week-II-Changing-Your-Mindset-P2.html`, the one frame in the bundle that draws it |
| all 7 | row card | flex-direction | `flex` row | `flexDirection: 'row'` | match |
| all 7 | row card | align-items | `center` | `center` | match |
| all 7 | row card | gap | 13 | 13 | match |
| all 7 | row card | padding | `0 16px` | `paddingHorizontal: 16` | match |
| all 7 | row card | box-sizing | `border-box` | RN is border-box | match |
| all 7 | disc | width × height | 30 × 30 | 30 × 30 | match |
| all 7 | disc | border-radius | `50%` | 15 | match |
| I (all rows) | disc | background (done) | `#131313` | `#131313` | match |
| — | disc | background (current) | `#131313` | `#131313` | match (Week-II-…-P2) |
| IV, VIII, XII | disc | background (locked) | `rgba(19,19,19,0.05)` | `'rgba(19,19,19,0.05)'` | match |
| IV, VIII, XII | disc | box-shadow (locked) | `inset 0 0 0 1.5px rgba(0,0,0,0.08)` | `'inset 0 0 0 1.5px rgba(0,0,0,0.08)'` | match |
| I | disc | box-shadow (done/current) | none | `undefined` | match |
| all 7 | disc | flex-shrink / align / justify | 0 / center / center | fixed 30 width, `center` / `center` | match |
| I | done glyph | svg width × height | 12 × 10 | 12 × 10 | match |
| I | done glyph | viewBox | `0 0 16 13` | `0 0 16 13` | match |
| I | done glyph | path `d` | `M1.5 7l4.4 4.5L14.5 1.5` | `M1.5 7l4.4 4.5L14.5 1.5` | match |
| I | done glyph | fill / stroke | `none` / `#F4F3F0` | inherited `none` / `#F4F3F0` | match |
| I | done glyph | stroke-width | 2.8 | 2.8 | match |
| I | done glyph | linecap / linejoin | `round` / `round` | `round` / `round` | match |
| — | current glyph | svg w×h, viewBox | 13 × 13, `0 0 24 24` | 13 × 13, `0 0 24 24` | match (Week-II-…-P2) |
| — | current glyph | path `d` | `M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z` | identical | match |
| — | current glyph | fill | `#F4F3F0` | `#F4F3F0` | match |
| IV, VIII, XII | locked glyph | svg w×h, viewBox | 12 × 13, `0 0 16 17` | 12 × 13, `0 0 16 17` | match |
| IV, VIII, XII | locked glyph | rect | `x3 y7.5 w10 h7.5 rx2 fill #A5A29B` | `x=3 y=7.5 w=10 h=7.5 rx=2 fill #A5A29B` | match |
| IV, VIII, XII | locked glyph | path `d` | `M5.2 7.5 V5.6 a2.8 2.8 0 0 1 5.6 0 V7.5` | identical | match |
| IV, VIII, XII | locked glyph | path stroke / width / fill | `#A5A29B` / 1.8 / `none` | `#A5A29B` / 1.8 / inherited `none` | match |
| IV, VIII, XII | locked glyph | paint order | `<rect>` then `<path>` | `<Path>` then `<Rect>` — `[week].tsx:158-161` | match — both are `#A5A29B`, the 0.9pt overlap is the same colour, zero pixel difference |
| all 7 | row title | flex | 1 | `flex: 1` | match |
| all 7 | row title | font-size | 15.5 | 15.5 | match |
| all 7 | row title | font-weight | 500 | `sans('500')` | match |
| I | row title | color (done) | `#1D1C1A` | `#1D1C1A` | match |
| — | row title | color (current) | `#1D1C1A` | `#1D1C1A` | match (Week-II-…-P2) |
| IV, VIII, XII | row title | color (locked) | `#8B8882` | `#8B8882` | match |
| all 7 | row title | line-height / letter-spacing | neither declared | both deleted by `AppText` | match |
| all 7 | row title | max lines | none (a `<span>`, would wrap) | `numberOfLines={1}` | match — widest frame string `What Changed in Your Brain` measures well inside the ~239pt track; the clamp is never reached |
| all 7 | row number | font-size | 12.5 | 12.5 | match |
| I, IV, VIII, XII | row number | font-weight (done / locked) | 500 | `sans('500')` | match |
| — | row number | font-weight (current) | 600 | `sans('600')` | match (Week-II-…-P2) |
| I | row number | color (done) | `#8B8882` | `#8B8882` | match |
| IV, VIII, XII | row number | color (locked) | `#B0AEA8` | `#B0AEA8` | match |
| — | row number | color (current) | `#1D1C1A` | `#1D1C1A` | match (Week-II-…-P2) |
| all 7 | row number | text | zero-padded 2-digit day | `String(lesson.day).padStart(2,'0')` | match |
| I / I-P2 | row titles + numbers | content | `Surviving the Night 01`, `A New Start 02`, `Get Outside 03`, `Fix Your Sleep 04` / `What Replaces Porn? 05`, `Isolation 06`, `One Week In 07` | `curriculum84` week 1, days 1–7, verbatim | match |
| IV / IV-P2 | row titles + numbers | content | `The Reward System 22`, `The Control Center 23`, `Hungry and Tired 24`, `Angry and Lonely 25` / `The Pull of Novelty 26`, `Change Your State 27`, `Autopilot 28` | `curriculum84` week 4, days 22–28, verbatim | match |
| VIII | row titles + numbers | content | `Boredom 50`, `Escaping Boredom 51`, `Learn to Be Bored 52`, `Screen Boundaries 53` | `curriculum84` week 8, days 50–53, verbatim | match |
| XII / XII-P2 | row titles + numbers | content | `What Forever Means 78`, `Twelve Weeks Ago 79`, `What Changed in Your Brain 80`, `Winning the Battle 81` / `Lessons From Addiction Recovery 82`, `Saying Goodbye 83`, `The Future 84` | `curriculum84` week 12, days 78–84, verbatim | match |
| all 7 | pip | left | 52 | 52 — `[week].tsx:179-180`, inside a full-width gap view, so 52 is frame-absolute | match |
| all 7 | pip 1 | top | canvas 547 = row bottom (542) + 5 | gap-local 5 | match |
| all 7 | pip 2 | top | canvas 555 = row bottom + 13 | gap-local 13 | match |
| all 7 | pip | width × height | 3.5 × 3.5 | 3.5 × 3.5 | match |
| all 7 | pip | border-radius | `50%` | 1.75 | match |
| all 7 | pip | background | `rgba(40,38,32,0.2)` | `'rgba(40,38,32,0.2)'` | match |
| all 7 | pips | count per gap | 2 | 2 | match |
| all 7 | pips | after last row | absent | `index < length - 1` | match |
| I+I-P2 etc. | row column | rows per week | 7 (4 in P1 + 3 in P2, both starting at canvas 486) | `data.lessons.length === 7` | match |
| all 7 | row column | paddingBottom | not declared | 108 | not attested — app-only clearance so the last row clears the 54pt closing band |

## C. Closing land

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 7 | closing band | left / right | 0 / 0 | 0 / 0 — `[week].tsx:196` | match |
| all 7 | closing band | top / bottom | canvas 798 → app 744 / 0 → height 54 | `bottom: 0`, `height: 54` | match |
| all 7 | closing band | overflow | `hidden` | `overflow:'hidden'` + 54-tall Svg viewport | match |
| all 7 | closing band | background | `linear-gradient(180deg, #ECEBE6, #E7E6E0)` | Rect filled 0→`#ECEBE6`, 1→`#E7E6E0`, userSpaceOnUse y 0→54 | match |
| all 7 | dome A | left / right | −30 / 40% → x −30, w 265.8 @393 | `aX = -30`, `aW = width*0.6 + 30` = 265.8 @393 | match |
| all 7 | dome A | top | 30 | 30 | match |
| all 7 | dome A | height | 80 | 80 | match |
| all 7 | dome A | border-radius | `50% 50% 0 0 / 44px 44px 0 0` → top edge one arc, rx w/2 = 132.9, ry 44 | `dome(aX, aW, 30, 80, 44)`, rx = w/2 | match |
| all 7 | dome A | background | `#CFD9E2` | `#CFD9E2` | match |
| all 7 | dome B | left / right | 35% / −40 → x 137.55, w 295.45 @393 | `bX = width*0.35`, `bW = width*0.65 + 40` | match |
| all 7 | dome B | top | 38 | 38 | match |
| all 7 | dome B | height | 80 | 80 | match |
| all 7 | dome B | border-radius | `… / 40px 40px 0 0` → rx w/2 = 147.725, ry 40 | `dome(bX, bW, 38, 80, 40)` | match |
| all 7 | dome B | background | `#C4D2DE` | `#C4D2DE` | match |
| all 7 | closing band | z-order | last frame child, above the rows | rendered after the `ScrollView` | match |
| all 7 | closing band | pointer-events | not declared | `pointerEvents="none"` | match (addition, no paint) |

## D. WeekScene renderer — the CSS each layer declares

| Frame | Element | Property | Design value | Current app value | Verdict |
|---|---|---|---|---|---|
| all 7 | layer | left / top | band-local px | `x = layer.left`, `y = layer.top` — `WeekScene.tsx:134-136` | match |
| I, IV, VIII, XII | layer | bottom:0 | y = 258 − h = 214 | `WEEK_SCENE_HEIGHT - bottom - h` | match |
| I, IV, XII | layer | width > 393 (473 / 483) | fixed 473/483 from a fixed left | `width + (layerWidth − 393)` — re-measured off live width | match @393; deliberate off-canvas behaviour (`WeekScene.tsx:11-14`) |
| all | layer | `border-radius:50%` | ellipse | `<Ellipse rx=w/2 ry=h/2>` | match |
| I, IV, VIII, XII | layer | `border-radius:50% 50% 0 0 / Npx …` | whole top edge is one elliptical arc, radii w/2 × N | `domePath` — `A w/2 N 0 0 1` | match |
| I, IV, VIII, XII | layer | `border-radius:<single px>` | CSS scales **all** radii by `f = min(1, side ÷ Σ radii on that side)`; for every cloud pill here `2r > h`, so the effective radius is exactly `h/2`, circular | `<Rect rx={r} ry={r}>` — SVG clamps each axis independently, so `rx` stays 8 / 7 while `ry` drops to `h/2`: an **elliptical** corner | **MISMATCH** — 10 pills across weeks 1/4/8/12 (+ 4 grass blades) |
| XII | layer | `border-radius:5px 5px 16px 16px` | on a 60.8 × 14.25 box, `f = 14.25 ÷ 21 = 0.678571…` → 3.392857 / 3.392857 / 10.857142 / 10.857142 | `cornersPath` uses the raw 5/5/16/16 and emits `V134.15` on a box whose top is `y=135.9` — the vertical goes **above** the box, producing a self-intersecting path | **MISMATCH** |
| I, IV, VIII, XII | layer | `filter: blur(Npx)` on a gradient | 4px Gaussian on the glow discs | dropped (`WeekScene.tsx:113-118`) | **MISMATCH\*** — no RN SVG filter; substitute: the unblurred radial falloff |
| I, VIII, XII | layer | `filter: blur(Npx)` on a solid | the blur *is* the shape; the ellipse spreads ~1 blur beyond the declared box | 4-stop radial `1.0 / 0.72 / 0.30 / 0` confined to `rx=w/2, ry=h/2` | **MISMATCH\*** — substitute named; the app's version does not spread past the box |
| VIII, XII (and II per data) | layer | `transform: rotate(Ndeg)` | about `50% 50%` | `rotate(N, x+w/2, y+h/2)` | match |
| XII | layer | `clip-path: polygon(…)` | % of the box | `<ClipPath><Polygon>`, % resolved against w/h | match |
| I, IV, VIII, XII | layer | `radial-gradient(closest-side, …)` | on a square box, r = half the box | `<RadialGradient rx=w/2 ry=h/2>`, stop offsets carried over unchanged | match |
| I, IV, VIII, XII | layer | `linear-gradient(180deg, …)` | top → bottom | `x1=x2`, `y1=y`, `y2=y+h` | match — every gradient in these 4 weeks is 180deg; the parser discards the angle, which would break on any other |
| all | layer | `rgba(r,g,b,a)` | e.g. `rgba(226,186,120,0.42)` | `#e2ba78` + `stopOpacity 0.42` (`splitColor`) | match |
| XII | layer | `box-shadow` | sail `0 1px 2px rgba(0,0,0,0.06)`; hull `0 0 0 1px rgba(0,0,0,0.05)` | `gen-week-scenes.mjs` never reads `box-shadow`; `WeekSceneLayer` has no field for it; both dropped | **MISMATCH** (hull ring → `stroke`) / **MISMATCH\*** (sail drop shadow) |
| VIII, XII | layer | inline `<svg>` child | a stroked bird path | generator captures only the `style` `left`/`top`; `width`/`height`/`viewBox` are attributes and the `<path>` is inner markup, so all are lost. The stub renders as `<Rect width={liveWidth} height={0} fill={undefined}/>` → nothing | **MISMATCH** |
| all | scene | sky rect | drawn under every layer | `<Rect>` before `layers.map` | match |
| all | scene | paint order | DOM order | array order | match |

## E. Layer data vs frame, layer by layer

Every number below was transcribed from the frame and compared against the corresponding entry in `weekScenes.ts`. Where the app column says "as frame" the whole layer's declared set — left, top, width, height, radius, background, blur, rotate, clip — is byte-equal.

### E1 · Week-I-Reset / Week-I-Reset-P2 → `WEEK_SCENES[1]` (17 frame children, 17 data entries)

| # | left | top | w | h | radius | background | extra | Data (`weekScenes.ts:33-49`) | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 116 | 28 | 106 | 106 | 50% | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)` | blur 4 | as frame | match; blur → MISMATCH\* (D) |
| 2 | 146 | 58 | 46 | 46 | 50% | `#E9D2A4` | — | as frame | match |
| 3 | 52 | 52 | 44 | 11 | 8px → CSS effective 5.5 | `rgba(255,255,255,0.85)` | — | `r: 8` | radius MISMATCH (D) |
| 4 | 66 | 45 | 26 | 10 | 7px → CSS effective 5.0 | `rgba(255,255,255,0.75)` | — | `r: 7` | radius MISMATCH (D) |
| 5 | 292 | 40 | 35.2 | 8.8 | 8px → CSS effective 4.4 | `rgba(255,255,255,0.85)` | — | `r: 8` | radius MISMATCH (D) |
| 6 | 303.2 | 34.4 | 20.8 | 8 | 7px → CSS effective 4.0 | `rgba(255,255,255,0.75)` | — | `r: 7` | radius MISMATCH (D) |
| 7 | −40 | 150 | 473 | 90 | dome ry 26 | `#C8D7E5` | — | as frame | match |
| 8 | −60 | 170 | 473 | 84 | dome ry 22 | `#D5E1EA` | — | as frame | match |
| 9 | −40 | 196 | 473 | 90 | dome ry 22 | `#EDE7D8` | — | as frame | match |
| 10 | −70 | 216 | 473 | 80 | dome ry 18 | `#F2EDE0` | — | as frame | match |
| 11 | 106 | 204 | 56 | 10 | 50% | `rgba(0,0,0,0.08)` | blur 4 | as frame | match; blur → MISMATCH\* (D) |
| 12 | 126 | 152 | 4 | 54 | 2px (no clamp: 2r = w) | `#B4B1AB` | — | as frame | match |
| 13 | 130 | 152 | 22 | 14 | 1px | `#E9D2A4` | — | as frame | match |
| 14 | 58 | 178 | 24 | 4 | 2px (no clamp: 2r = h) | `rgba(255,255,255,0.6)` | — | as frame | match |
| 15 | 316 | 186 | 20 | 4 | 2px | `rgba(255,255,255,0.5)` | — | as frame | match |
| 16 | 206 | 206 | 26 | 4 | 2px | `rgba(255,255,255,0.45)` | — | as frame | match |
| 17 | 0 / right 0 | bottom 0 | — | 44 | none | `linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)` | — | as frame | match |

### E2 · Week-IV-Know-Your-Brain / -P2 → `WEEK_SCENES[4]` (11 frame children, 11 data entries)

| # | left | top | w | h | radius | background | extra | Data (`weekScenes.ts:84-94`) | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 96 | −4 | 200 | 200 | 50% | `radial-gradient(closest-side, rgba(226,186,120,0.55), rgba(226,186,120,0) 74%)` | blur 4 | as frame — note the **0.55** alpha, distinct from every other week's 0.42 | match |
| 2 | 130 | 20 | 118 | 118 | 50% | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)` | blur 4 | as frame | match |
| 3 | 160 | 50 | 58 | 58 | 50% | `#E9D2A4` | — | as frame | match |
| 4 | 48 | 72 | 39.6 | 9.9 | 8px → CSS effective 4.95 | `rgba(255,255,255,0.85)` | — | `r: 8` | radius MISMATCH (D) |
| 5 | 60.6 | 65.7 | 23.400000000000002 | 9 | 7px → CSS effective 4.5 | `rgba(255,255,255,0.75)` | — | `r: 7`, width kept to full float precision | radius MISMATCH (D) |
| 6 | 296 | 60 | 35.2 | 8.8 | 8px → CSS effective 4.4 | `rgba(255,255,255,0.85)` | — | `r: 8` | radius MISMATCH (D) |
| 7 | 307.2 | 54.4 | 20.8 | 8 | 7px → CSS effective 4.0 | `rgba(255,255,255,0.75)` | — | `r: 7` | radius MISMATCH (D) |
| 8 | −40 | 154 | 473 | 110 | dome ry 48 | `#DEDDD6` | — | as frame | match |
| 9 | −90 | 180 | 483 | 100 | dome ry 42 | `#CFCEC7` | — | as frame | match |
| 10 | 150 | 196 | 44 | 4 | 2px | `rgba(255,255,255,0.5)` | — | as frame | match |
| 11 | 0 / right 0 | bottom 0 | — | 44 | none | `linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)` | — | as frame | match |

### E3 · Week-VIII-Boredom-and-Meaning → `WEEK_SCENES[8]` (17 frame children, 17 data entries)

| # | left | top | w | h | radius | background | extra | Data (`weekScenes.ts:144-160`) | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 60 | 10 | 94 | 94 | 50% | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)` | blur 4 | as frame | match |
| 2 | 90 | 40 | 34 | 34 | 50% | `#E9D2A4` | — | as frame | match |
| 3 | 198 | 38 | 41.8 | 10.45 | 8px → CSS effective 5.225 | `rgba(255,255,255,0.85)` | — | `r: 8` | radius MISMATCH (D) |
| 4 | 211.3 | 31.35 | 24.7 | 9.5 | 7px → CSS effective 4.75 | `rgba(255,255,255,0.75)` | — | `r: 7` | radius MISMATCH (D) |
| 5 | 288 | 58 | 30.799999999999997 | 7.699999999999999 | 8px → CSS effective 3.85 | `rgba(255,255,255,0.85)` | — | `r: 8` | radius MISMATCH (D) |
| 6 | 297.8 | 53.1 | 18.2 | 7 | 7px → CSS effective 3.5 | `rgba(255,255,255,0.75)` | — | `r: 7` | radius MISMATCH (D) |
| **7** | **258** | **92** | **svg 16** | **svg 8** | — | — | `viewBox 0 0 16 8`; `<path d="M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6" fill="none" stroke="#8A857C" stroke-width="1.6" stroke-linecap="round">` | `{ left: 258, top: 92, radius: {kind:'none'} }` — width, height, viewBox, path, stroke all dropped | **MISMATCH — layer absent** |
| 8 | −40 | 168 | 473 | 56 | dome ry 12 | `#E8E4D6` | — | as frame | match |
| 9 | −40 | 198 | 473 | 80 | none (no `border-radius`) | `#F0EBDD` | — | `radius: {kind:'none'}` | match |
| 10 | 96 | 176 | 58 | 4 | 2px | `rgba(255,255,255,0.6)` | — | as frame | match |
| 11 | 250 | 188 | 40 | 4 | 2px | `rgba(255,255,255,0.45)` | — | as frame | match |
| 12 | 76 | 214 | 3 | 4 | 2px → CSS effective 1.5 | `#C9CEC0` | rotate −14deg | `r: 2`, `rotate: -14` | offsets/rotate match; radius MISMATCH (D) |
| 13 | 84 | 212 | 3 | 4 | 2px → 1.5 | `#C9CEC0` | rotate 10deg | `r: 2`, `rotate: 10` | as above |
| 14 | 210 | 224 | 3 | 4 | 2px → 1.5 | `#C9CEC0` | rotate −12deg | `r: 2`, `rotate: -12` | as above |
| 15 | 310 | 210 | 3 | 4 | 2px → 1.5 | `#C9CEC0` | rotate 12deg | `r: 2`, `rotate: 12` | as above |
| 16 | 140 | 226 | 90 | 14 | 50% | `rgba(0,0,0,0.04)` | blur 5 | as frame | match; blur → MISMATCH\* (D) |
| 17 | 0 / right 0 | bottom 0 | — | 44 | none | `linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)` | — | as frame | match |

### E4 · Week-XII-Leave-It-Behind / -P2 → `WEEK_SCENES[12]` (16 frame children, 16 data entries)

| # | left | top | w | h | radius | background | extra | Data (`weekScenes.ts:211-226`) | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 48 | 66 | 96 | 96 | 50% | `radial-gradient(closest-side, rgba(226,186,120,0.42), rgba(226,186,120,0) 74%)` | blur 4 | as frame | match |
| 2 | 78 | 96 | 36 | 36 | 50% | `#E9D2A4` | — | as frame | match |
| 3 | 220 | 42 | 39.6 | 9.9 | 8px → CSS effective 4.95 | `rgba(255,255,255,0.85)` | — | `r: 8` | radius MISMATCH (D) |
| 4 | 232.6 | 35.7 | 23.400000000000002 | 9 | 7px → CSS effective 4.5 | `rgba(255,255,255,0.75)` | — | `r: 7` | radius MISMATCH (D) |
| **5** | **132** | **60** | **svg 16** | **svg 8** | — | — | `viewBox 0 0 16 8`, 1:1; path `M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6`, `fill none`, stroke `#8A857C`, stroke-width 1.6, linecap round | `{ left: 132, top: 60, radius:{kind:'none'} }` | **MISMATCH — layer absent** |
| **6** | **160** | **48** | **svg 13** | **svg 7** | — | — | same `viewBox 0 0 16 8` → `xMidYMid meet` scale `min(13/16, 7/8) = 0.8125`, content 13 × 6.5 centred → y offset 0.25, effective stroke-width `1.6 × 0.8125 = 1.3` | `{ left: 160, top: 48, radius:{kind:'none'} }` | **MISMATCH — layer absent** |
| 7 | −40 | 148 | 473 | 90 | dome ry 26 | `#C8D7E5` | — | as frame | match |
| 8 | −60 | 168 | 473 | 84 | dome ry 22 | `#D5E1EA` | — | as frame | match |
| 9 | 153.7 | 135.9 | 60.8 | 9.5 | 50% | `rgba(0,0,0,0.06)` | blur 3 | as frame | match; blur → MISMATCH\* (D) |
| 10 | 176.5 | 96 | 3 | 41.8 | none | `#C6C5C0` | — | as frame | match |
| 11 | 155.6 | 101.7 | 20.9 | 34.199999999999996 | none | `#F7F6F2` | `clip-path: polygon(100% 0, 100% 100%, 0 100%)`; **`box-shadow: 0 1px 2px rgba(0,0,0,0.06)`** | clip as frame; **no shadow field** | geometry/clip match; shadow **MISMATCH\*** |
| 12 | 182.2 | 109.3 | 15.2 | 26.599999999999998 | none | `#EDECE7` | `clip-path: polygon(0 0, 100% 100%, 0 100%)` | as frame | match |
| 13 | 148 | 135.9 | 60.8 | 14.25 | `5px 5px 16px 16px` → CSS effective 3.392857 / 3.392857 / 10.857142 / 10.857142 | `#E4E3DE` | **`box-shadow: 0 0 0 1px rgba(0,0,0,0.05)`** | `corners:[5,5,16,16]`, **no shadow field** | radius **MISMATCH** + ring **MISMATCH** |
| 14 | 120 | 212 | 26 | 4 | 2px | `rgba(255,255,255,0.6)` | — | as frame | match |
| 15 | 96 | 224 | 20 | 4 | 2px | `rgba(255,255,255,0.45)` | — | as frame | match |
| 16 | 0 / right 0 | bottom 0 | — | 44 | none | `linear-gradient(180deg, rgba(244,243,240,0) 0%, #F4F3F0 100%)` | — | as frame | match |

## F. Notes that are not mismatches

- **Origin.** The app hangs every absolute top off a `SafeAreaView edges={['top']}`, whose inset on a 393 × 852 iPhone is 59, not the canvas's 54. Every `canvas − 54` top therefore lands 5pt lower than the canvas literal, while `bottom:0` on the closing land lands exactly. This is the project convention, applied consistently; recorded here so the 5pt is not later mistaken for a transcription slip.
- **Row state semantics.** `stateFor` derives done/current/locked purely from `user.createdAt` and `lesson.day`; the `progress` map is used only as a loaded/not-loaded gate (`[week].tsx:102`). No frame contradicts this, but it means a completed-but-future lesson still draws locked. Behaviour, not paint.
- **Off-canvas widths.** Layers wider than 393 are re-measured off the live width rather than scaled, so a wider phone shows more of the same hill. At 393 the geometry is identical to the frame.

---

## Findings

Rows written: 173 (43 chrome, 55 row column, 16 closing land, 18 renderer, 61 layer-data). Mismatches: **9** (6 MISMATCH, 3 MISMATCH\*).

1. **`src/content/weekScenes.ts:150`** — Week VIII bird layer is empty: `{ left: 258, top: 92, radius: {"kind":"none"} }`. Design: an inline `<svg width="16" height="8" viewBox="0 0 16 8">` at band-local (258, 92) holding `<path d="M1 6 Q4.5 1.5 8 5 Q11.5 1.5 15 6" fill="none" stroke="#8A857C" stroke-width="1.6" stroke-linecap="round">`. The renderer turns the stub into a zero-height `Rect`, so the bird does not draw at all. Root cause: `scripts/uifinal/gen-week-scenes.mjs:49-84` reads only the `style` attribute, and an `<svg>` carries its width/height/viewBox as attributes and its geometry as inner markup.

2. **`src/content/weekScenes.ts:215`** — Week XII bird 1 is the same empty stub: `{ left: 132, top: 60, radius: {"kind":"none"} }`. Design: `<svg width="16" height="8" viewBox="0 0 16 8">` at (132, 60), same path, `#8A857C`, stroke-width 1.6, linecap round. Not drawn.

3. **`src/content/weekScenes.ts:216`** — Week XII bird 2 is the same empty stub: `{ left: 160, top: 48, radius: {"kind":"none"} }`. Design: `<svg width="13" height="7" viewBox="0 0 16 8">` at (160, 48) — a 0.8125 uniform down-scale, content 13 × 6.5 centred at y +0.25, effective stroke-width 1.3. Not drawn.

4. **`src/components/journey/WeekScene.tsx:197-198`** — `radius.kind === 'round'` emits `<Rect rx={r} ry={r}>` with the raw CSS value. CSS scales all radii by `f = min(1, side ÷ Σ radii)`; SVG clamps each axis on its own. Every cloud pill in these four weeks has `2r > h`, so the design corner is circular at exactly `h/2` while the app draws an elliptical corner `r × h/2`. Affected: week 1 layers 3–6 (`8→5.5`, `7→5.0`, `8→4.4`, `7→4.0`), week 4 layers 4–7 (`8→4.95`, `7→4.5`, `8→4.4`, `7→4.0`), week 8 layers 3–6 (`8→5.225`, `7→4.75`, `8→3.85`, `7→3.5`) and 12–15 (`2→1.5`), week 12 layers 3–4 (`8→4.95`, `7→4.5`). Fix: `r = Math.min(r, w/2, h/2)`.

5. **`src/components/journey/WeekScene.tsx:32-46` (`cornersPath`), applied at `weekScenes.ts:223`** — Week XII's boat hull is `60.8 × 14.25` with `border-radius: 5px 5px 16px 16px`. CSS scales by `f = 14.25 ÷ (5 + 16) = 0.678571…` giving `3.392857 / 3.392857 / 10.857142 / 10.857142`. The app passes 5/5/16/16 straight through, so the emitted path is `M153 135.9 H203.8 A5 5 0 0 1 208.8 140.9 V134.15 …` — the `V` runs to 134.15, above the box's own top at 135.9, and the shape self-intersects. (The same layer shape recurs at `weekScenes.ts:139` for week 7, `39.68 × 9.3`, where CSS `f = 9.3 ÷ 21 = 0.442857…` → `2.214285 / 2.214285 / 7.085714 / 7.085714`.)

6. **`src/content/weekScenes.ts:223`** — Week XII hull drops `box-shadow: 0 0 0 1px rgba(0,0,0,0.05)`. A zero-blur zero-spread ring is directly expressible in SVG as `stroke="rgba(0,0,0,0.05)" strokeWidth={1}`; `WeekSceneLayer` has no shadow field and `gen-week-scenes.mjs` never reads `box-shadow`.

7. **`src/app/week/[week].tsx:131`** — `borderCurve: 'continuous'` on the lesson row. All seven frames declare a plain `border-radius: 14px`, a circular arc; `continuous` draws an iOS squircle. An addition, not a transcription of the canvas. (House style — 35 call sites across `src/` — so the caller may want to keep it deliberately rather than close it.)

8. **`src/components/journey/WeekScene.tsx:113-127` — MISMATCH\*** — `filter: blur(4px)` / `blur(3px)` / `blur(5px)`. RN SVG has no filter primitive. On the glow discs (week 1 #1, week 4 #1–2, week 8 #1, week 12 #1) the blur is dropped into the existing radial falloff. On the solid shadow ellipses (week 1 #11 `56 × 10` blur 4, week 8 #16 `90 × 14` blur 5, week 12 #9 `60.8 × 9.5` blur 3) it is substituted by a four-stop radial `1.0 / 0.72 / 0.30 / 0` bounded by the box, so the app's shadow does not spread the ~1 blur radius past the declared box that CSS gives it. Also `src/content/weekScenes.ts:221` — Week XII sail drops `box-shadow: 0 1px 2px rgba(0,0,0,0.06)`, which needs the same blur primitive; substitute would be an offset duplicate path at low alpha.

9. **`src/app/week/[week].tsx:83-85` — MISMATCH\*** — the blurb's `text-wrap: pretty`. `AppText` emits it on web (`AppText.tsx:128`) but native has no equivalent; substitute is the platform line-breaker, which may leave a shorter last line than the canvas draws.
