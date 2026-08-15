# Pass 1 — second reader — Task boards

Bundle: **Lessons and Tasks**.
Frames: `Task-D01-Intro`, `Task-D01-Options`, `Task-D02-Intro`, `Task-D02-Options`, `Task-D74-Options`.
App: `src/app/task/[day].tsx`, `src/components/task/TaskScene.tsx`, `src/content/taskScenes.ts`.

Canvas frames are 393 × 852 and every `top` includes a 54px status bar the app never builds.
**app top = canvas top − 54.** Both are given in every row below.

`MISMATCH` = the app can close it. `MISMATCH*` = RN cannot express the CSS; the substitute is named.

---

## 0. Which template is which

`Task-D01-Intro` and `Task-D01-Options` are the **only** two frames in the 83-day set that are laid out
as a centred flex column (`top:96 / bottom:146|154`, `gap:26`, no `<!--TDESC-->` / `<!--TOPT-->`
markers). The other 82 intro frames and 82 options frames use the absolute template that
`Task-D02-*` shows. Counted directly:

| Board | absolute template (`TDESC`/`TOPT` marker) | flex-column template |
| --- | --- | --- |
| Intro | 82 frames | 1 — `Task-D01-Intro` |
| Options | 82 frames | 1 — `Task-D01-Options` |

`src/app/task/[day].tsx` builds **one** template — the absolute one — for all 84 days. Day 1 is
therefore drawn with day 2's geometry. Section 1 records that, row by row.

Two further facts the app hardcodes past:

* The intro scene's `top` is **not fixed** in the design. Across the 82 absolute intro frames it takes
  251 / 272 / 293 / 307 / 314 / 335 / 419 / 440 — it flows below the description block at
  `desc top 193 + 21 × lines + 16`, and the done-card follows at `scene top + scene height + 20`.
  Distribution: 272 (37 frames), 251 (28), 293 (9), 314 (4), 335 (1), 307 (1), 419 (1, D74), 440 (1, D76).
  The app pins scene = canvas 272 and card = canvas 492, i.e. the 3-line case only.
* The scene box height is 200 on 81 frames, **186** on `Task-D74-Intro` and **164** on `Task-D76-Intro`
  (the design clips the art so the card still fits under a 10-line description).

---

## 1. `Task-D01-Intro` — flex-column intro template (app renders the D02 template instead)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| D01-Intro | Screen | width × height | 393 × 852 | device | match |
| D01-Intro | Screen | background | `#F4F3F0` | `#F4F3F0` ([day].tsx:52) | match |
| D01-Intro | Screen | font-family | `-apple-system,'SF Pro Text',system-ui,'Helvetica Neue',sans-serif` | ios `System`, web `SANS_WEB_STACK` (`sans()`) | match |
| D01-Intro | Grain | image / opacity / inset | `noise-dark.png`, `opacity:0.07`, `inset:0`, `pointer-events:none` | `Grain source=noise-dark opacity={0.07}`, abs 0/0/0/0, `pointerEvents="none"` | match |
| D01-Intro | Status bar | height 54, `9:41` 17/600 ls −0.2 `#1D1C1A`, 3 glyphs gap 7 | drawn by the frame | not built (OS status bar, `StatusBar style="dark"`) | match (by decision) |
| D01-Intro | Close | left / top | `left:16`, `top:66` → app 12 | `left:16, top:12` (:62) | match |
| D01-Intro | Close | size / weight / colour / z | 17 / 400 / `#3A3934` / `z-index:5` | 17 / `sans('400')` / `#3A3934` / `zIndex:5` (:62-63) | match |
| D01-Intro | Content column | box | `left:0 right:0 top:96 (app 42) bottom:146` | no column — every child absolutely placed | **MISMATCH** |
| D01-Intro | Content column | flex | `column`, `align-items:center`, `justify-content:center`, `gap:26` | none | **MISMATCH** |
| D01-Intro | Content column | padding | `0 38px` | n/a (per-child left/right) | **MISMATCH** |
| D01-Intro | Eyebrow | text | `DAY 1 · TONIGHT'S TASK` | `DAY ${n} · ${task.label}`, label `TONIGHT’S TASK` (curriculum84.ts:71) | match |
| D01-Intro | Eyebrow | font-size / weight | 12 / 600 | 12 / `sans('600')` (:67) | match |
| D01-Intro | Eyebrow | letter-spacing | **1.8px** | `letterSpacing: 1.6` (:67) | **MISMATCH** |
| D01-Intro | Eyebrow | colour | **`#B0AEA8`** | `#8B8882` (:67) | **MISMATCH** |
| D01-Intro | Eyebrow | position | flowed, column top + 0 | `top:62` absolute (canvas 116) | **MISMATCH** |
| D01-Intro | Spacer | height | `16px` div between eyebrow and title (adds to the 26 gaps) | not built | **MISMATCH** |
| D01-Intro | Title | text | `Surviving the night` | `task.title` = `Surviving the night` | match |
| D01-Intro | Title | font-size / weight / line-height | **26 / 500 / 38** | 27 / 500 / 35 (:73) | **MISMATCH** |
| D01-Intro | Title | max-width / align | `max-width:320`, centre | `left:30 right:30` (= 333 wide), centre | **MISMATCH** |
| D01-Intro | Title | colour | `#1D1C1A` | `#1D1C1A` | match |
| D01-Intro | Title | text-wrap | `balance` | AppText body variant → `pretty` on web, nothing on native | MISMATCH* (RN has no text-wrap; web substitute is `pretty`) |
| D01-Intro | Scene slot | height / flex | `height:170`, `justify-content:center`, `flex-shrink:0` | `position:absolute left:26 top:218`, no slot | **MISMATCH** |
| D01-Intro | Scene | transform | `scale(0.85)`, `transform-origin:top center` → 289 × 170 drawn | `width = min(340, w−52)` = 340, scale 1.0 → 340 × 200 | **MISMATCH** |
| D01-Intro | Description | font-size / weight / line-height | **21 / 400 / 36** | 14.5 / 400 / 21 (:82) | **MISMATCH** |
| D01-Intro | Description | colour / align / max-width | `#55534E`, centre, `max-width:330` | `#55534E`, centre, `left:38 right:38` (317 wide) | **MISMATCH** (max-width) |
| D01-Intro | Description | text | `Set up tonight before you get tired. Use the option that matches where you sleep.` | identical (curriculum84.ts:72) | match |
| D01-Intro | Done card | box | `align-self:stretch` inside 38px padding → 317 wide | `left:24 right:24` → 345 wide | **MISMATCH** |
| D01-Intro | Done card | padding | **`17px 18px`** (vertical 17) | `paddingHorizontal:18`, `minHeight:68`, no vertical padding | **MISMATCH** |
| D01-Intro | Done card | gap | **14** | 13 (:106) | **MISMATCH** |
| D01-Intro | Done card | radius / bg / shadow | 16 / `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.07), 0 6px 16px rgba(40,38,32,0.05)` | identical (:99-102) | match |
| D01-Intro | Done card icon | svg size / viewBox | `20 × 20`, `viewBox="0 0 18 18"` | `18 × 15`, `viewBox="0 0 16 13"` (:108) | **MISMATCH** |
| D01-Intro | Done card icon | ring | `<circle cx=9 cy=9 r=7.5 fill=none stroke=#1D1C1A stroke-width=1.6>` | absent | **MISMATCH** |
| D01-Intro | Done card icon | tick `d` | `M5.8 9l2.3 2.3 4.1-4.6` | `M1.5 7l4.4 4.5L14.5 1.5` (:109) | **MISMATCH** |
| D01-Intro | Done card icon | tick stroke / width / caps | `#1D1C1A` / 1.7 / round, round | `#131313` / 2.4 / round, round | **MISMATCH** |
| D01-Intro | Done card text | size / weight / line-height | **15 / 500 / 22** | 13.5 / 500 / 19 (:111) | **MISMATCH** |
| D01-Intro | Done card text | colour / align | `#55534E`, `text-align:left` | `#55534E`, default left | match |
| D01-Intro | Done card text | text | `Done when you can’t reach your usual device from bed without standing up.` | identical (curriculum84.ts:79) | match |
| D01-Intro | Dots | top | `706` → app 652 | `top:652` (:149) | match |
| D01-Intro | Dots | gap / sizes / radius | 6 / `18×6` active, `6×6` idle / 3 | identical (:151) | match |
| D01-Intro | Dots | active index / colours | first wide `#131313`, second `rgba(19,19,19,0.18)` | `i === board`, board 0 → first wide, same colours | match |
| D01-Intro | Button | box | `left:24 right:24 top:744 (app 690) height:52 radius:26 bg #131313` | identical (:159-169) | match |
| D01-Intro | Button | label | `Continue`, 17 / 600 / ls 0.2 / `#FFFFFF` | identical (:171-172) | match |

## 2. `Task-D01-Options` — flex-column options template (app renders the D02 template instead)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| D01-Options | Content column | box | `left:0 right:0 top:96 (app 42) bottom:154` | ScrollView `left:24 right:24 top:171 bottom:108` (:118) | **MISMATCH** |
| D01-Options | Content column | padding / gap | `0 32px`, `gap:26` | horizontal 24, no column gap | **MISMATCH** |
| D01-Options | Eyebrow | letter-spacing / colour | **1.8px** / **`#B0AEA8`** | 1.6 / `#8B8882` (:67) | **MISMATCH** |
| D01-Options | Spacer | height 16 between eyebrow and title | present | not built | **MISMATCH** |
| D01-Options | Title | text | `Match where you sleep` | `task.secondTitle` = `Match where you sleep` | match |
| D01-Options | Title | size / weight / line-height / max-width | **26 / 500 / 38 / 320** | 27 / 500 / 35 / `left:30 right:30` | **MISMATCH** |
| D01-Options | Rows wrapper | `flex-direction:column`, `gap:18`, `align-self:stretch` | gap **18** | `contentContainerStyle={{ gap: 22 }}` (:119) | **MISMATCH** |
| D01-Options | Row | `align-items:flex-start`, `gap:16` | gap **16** | gap 14 (:125) | **MISMATCH** |
| D01-Options | Row overflow | container clips (`overflow` is on the outer column) | clip, no scroll | `ScrollView` (scrolls) | MISMATCH (deliberate; design clips) |
| D01-Options | Icon tile | size | **38 × 38** | 40 × 40 (:128-129) | **MISMATCH** |
| D01-Options | Icon tile | radius / bg / shadow / centring | 12 / `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.08), 0 3px 8px rgba(40,38,32,0.06)` / centre | identical (:130-135) | match |
| D01-Options | Glyph | svg size / viewBox | `22 × 22`, `viewBox="0 0 20 20"` | 22 × 22, `icon.attrs.viewBox ?? '0 0 20 20'` (:185) | match |
| D01-Options | Glyph 1 (bed) | children | `path M3 15.5V6` sw1.6 cap round; `path M3 12.5h14M17 15.5v-5a2 2 0 0 0-2-2H8v4.5` sw1.6 round/round fill none; `circle 5.6 8.9 r1.5 fill #3A3934` | verbatim, taskScenes.ts:17591-17619 | match |
| D01-Options | Glyph 2 (shared) | children | `rect 4,3,12,14 rx1.8 sw1.6`; `path M10 3v14`; `path M6.8 7.5h0M13.2 7.5h0` sw1.8; `path M6.8 10.5v2M13.2 10.5v2` sw1.6 | verbatim, taskScenes.ts:17630-17667 | match |
| D01-Options | Glyph 3 (sofa) | children | `path M4 9V7.5A2.5 2.5 0 0 1 6.5 5h7A2.5 2.5 0 0 1 16 7.5V9`; `path M3.5 9a1.8 1.8 0 0 1 1.8 1.8V12h9.4v-1.2A1.8 1.8 0 0 1 16.5 9a1.5 1.5 0 0 1 1.5 1.5V14a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 14v-3.5A1.5 1.5 0 0 1 3.5 9Z` | verbatim, taskScenes.ts:17678-17695 | match |
| D01-Options | Glyph 4 (alarm) | children | `circle 10,11 r6 sw1.6`; `path M10 8.2V11l2 1.4` sw1.6; `path M4.5 4.5L3 6M15.5 4.5L17 6` sw1.6 | verbatim, taskScenes.ts:17706-17735 | match |
| D01-Options | Glyph root | `fill` | absent on `<svg>` (children inherit `black`) | `fill="none"` on `<Svg>` (:185) | match for these four (every closed child names its own fill) |
| D01-Options | Row head | size / weight / line-height / colour | **16 / 600 / 22** / `#1D1C1A` | 15.5 / 600 / 21 / `#1D1C1A` (:140) | **MISMATCH** |
| D01-Options | Row body | margin-top | **4** | 3 (:141) | **MISMATCH** |
| D01-Options | Row body | size / weight / line-height / colour | 13 / 400 / 19 / `#767370` | identical (:141) | match |
| D01-Options | Row body | text-wrap | `pretty` | AppText web `pretty`, native none | MISMATCH* (RN has no text-wrap) |
| D01-Options | Row 1–4 | text | `Own bedroom` / `Shared room` / `Studio, sofa bed, or temporary space` / `Phone needed as an alarm` + bodies | verbatim, curriculum84.ts:74-77 | match |
| D01-Options | Dots | active index | second wide `#131313`, first `rgba(19,19,19,0.18)` | board 1 → `i===1` wide | match |
| D01-Options | Button | label | `Mark as done` | `Mark as done` (`alreadyDone` → `Done`) | match / extra state |

## 3. `Task-D02-Intro` — the absolute intro template (the one the app builds)

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| D02-Intro | Screen | background / grain | `#F4F3F0`, `noise-dark.png` @ 0.07 inset 0 | identical (:52-54) | match |
| D02-Intro | Close | left / top / size / weight / colour | 16 / `66` → app 12 / 17 / 400 / `#3A3934` | 16 / 12 / 17 / 400 / `#3A3934` (:62-63) | match |
| D02-Intro | Close | z-index | none on this frame (`z-index:5` on D01) | `zIndex: 5` | match |
| D02-Intro | Eyebrow | top | `116` → app **62** | `top: 62` (:67) | match |
| D02-Intro | Eyebrow | left / right / align | `left:0 right:0`, `text-align:center` | `left:0 right:0`, `center` | match |
| D02-Intro | Eyebrow | size / weight / letter-spacing / colour | 12 / 600 / **1.6px** / `#8B8882` | 12 / 600 / 1.6 / `#8B8882` (:67) | match |
| D02-Intro | Eyebrow | text | `DAY 2 · TODAY’S TASK` | `DAY 2 · TODAY’S TASK` (curriculum84.ts:94) | match |
| D02-Intro | Title | top / left / right | `144` → app **90** / 30 / 30 | 90 / 30 / 30 (:73) | match |
| D02-Intro | Title | size / weight / line-height / colour | 27 / 500 / 35 / `#1D1C1A` | identical (:73) | match |
| D02-Intro | Title | align / text-wrap | centre / `balance` | centre / `pretty` (web), none (native) | MISMATCH* (no `text-wrap` in RN; AppText's body variant emits `pretty`) |
| D02-Intro | Title | text | `A new start` | `task.title` = `A new start` | match |
| D02-Intro | Description | top / left / right | `193` → app **139** / 38 / 38 | 139 / 38 / 38 (:82) | match |
| D02-Intro | Description | size / weight / line-height / colour / align | 14.5 / 400 / 21 / `#55534E` / centre | identical (:82) | match |
| D02-Intro | Description | text | `Set a 20-minute timer. Clean only the physical and digital space you control. Stop when the timer rings.` | identical (curriculum84.ts:95) | match |
| D02-Intro | Scene box | left / top | 26 / `272` → app **218** | `left:26, top:218` (:87) | match **for day 2 only** — the design's top flows with the description (251/272/293/307/314/335/419/440 across the 82 frames); the app pins 218 | **MISMATCH** (template) |
| D02-Intro | Scene box | width / height / clip | 340 × 200, inner `overflow:hidden` | `min(340, width−52)` = 340 on a 393pt screen, `TASK_SCENE_H × scale`, `overflow:'hidden'` | match |
| D02-Intro | Done card | top / left / right | `492` → app **438** / 24 / 24 | 438 / 24 / 24 (:94-97) | match **for day 2 only** (design = scene top + scene height + 20) | **MISMATCH** (template) |
| D02-Intro | Done card | height | **`height:68`** (fixed) | `minHeight: 68` (grows) | **MISMATCH** |
| D02-Intro | Done card | radius / bg / shadow | 16 / `#FFFFFF` / `0 0 0 1px rgba(0,0,0,0.07), 0 6px 16px rgba(40,38,32,0.05)` | identical (:99-102) | match |
| D02-Intro | Done card | padding / gap / flex | `0 18px` / 13 / row, `align-items:center` | `paddingHorizontal:18`, `gap:13`, row, centre (:103-106) | match |
| D02-Intro | Done card icon | svg width / height / viewBox | **20 / 20 / `0 0 18 18`** | 18 / 15 / `0 0 16 13` (:108) | **MISMATCH** |
| D02-Intro | Done card icon | ring circle | `cx=9 cy=9 r=7.5 fill=none stroke=#1D1C1A stroke-width=1.6` | not drawn | **MISMATCH** |
| D02-Intro | Done card icon | tick `d` / stroke / width | `M5.8 9l2.3 2.3 4.1-4.6` / `#1D1C1A` / 1.7 | `M1.5 7l4.4 4.5L14.5 1.5` / `#131313` / 2.4 (:109) | **MISMATCH** |
| D02-Intro | Done card icon | `flex-shrink` | 0 | RN `Svg` has fixed width, no shrink | match |
| D02-Intro | Done card text | size / weight / line-height / colour | 13.5 / 500 / 19 / `#55534E` | identical (:111) | match |
| D02-Intro | Done card text | text | `Done when the timer rings and your most-used space holds fewer cues.` | identical (curriculum84.ts:102) | match |
| D02-Intro | Dots | top / gap / sizes / colours / active | `706` → 652 / 6 / `18×6` + `6×6` r3 / `#131313`, `rgba(19,19,19,0.18)` / first wide | identical (:149-152) | match |
| D02-Intro | Button | top / left / right / height / radius / bg | `744` → **690** / 24 / 24 / 52 / 26 / `#131313` | identical (:159-169) | match |
| D02-Intro | Button | label / size / weight / letter-spacing / colour | `Continue` / 17 / 600 / 0.2 / `#FFFFFF` | identical (:171-172) | match |

### 3b. `TaskScene` vs the day-2 layer data

`TASK_SCENES["2"]` (taskScenes.ts:307-559) carries **25 layers**; `Task-D02-Intro` draws **25**
(24 boxes + 1 `<svg>`). No layer is dropped, and every `left / top / width / height / border-radius /
background` literal is verbatim — including `48.16`, `95.68`, `218.15`, `43.699999999999996`,
`125.99999999999999deg`. The losses are in the schema and in the renderer.

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| D02-Intro | scene box | composition box | 340 × 200 | `TASK_SCENE_W/H = 340/200` (taskScenes.ts:50-51) | match |
| D02-Intro | L1 star | `left:50 top:44 2.5×2.5 r50% rgba(200,225,235,0.4)` | as design | verbatim | match |
| D02-Intro | L2 star | `left:304 top:34 2×2 r50% rgba(200,225,235,0.35)` | as design | verbatim | match |
| D02-Intro | L3 ground | `left:-30 top:164 400×66 r 50% 50% 0 0 / 26px 26px 0 0 #EAE9E3` | as design | verbatim; `radii()`+`boxPath()` resolve to tl/tr = 200 with ry 26 and flat bottom (rx 0 arcs degenerate to lines) | match |
| D02-Intro | L4 desk shadow | `left:48.16 top:165 95.68×11 r50% rgba(0,0,0,0.09) blur(5px)` | as design | radial falloff via `softStops` (0 / 0.5 / 0.78 / 1), bounded to the box's own ellipse | MISMATCH* (RN SVG has no `filter: blur`; substitute = 4-stop radial, so the spill outside the box is lost) |
| D02-Intro | L5 desk top | `left:44 top:130 104×9 r4.5px #E0DFDA` | as design | verbatim | match |
| D02-Intro | L6/L7 desk legs | `54,139` and `132,139`, `6×32 r3px #C6C5C0` | as design | verbatim | match |
| D02-Intro | L8 book shadow | `63,129 66×11 r50% rgba(0,0,0,0.08) blur(5px)` | as design | as L4 | MISMATCH* |
| D02-Intro | L9 book left | geometry `67,114 29×16 r 6px 2px 2px 4px #FBFAF7` | as design | verbatim | match |
| D02-Intro | L9 book left | **box-shadow** | `inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.14→0.12)` | captured as `shadow` in the data, **never read by `Layer`** | **MISMATCH** |
| D02-Intro | L9 book left | **transform** | `skewY(-6deg)`, `transform-origin:bottom right` | `TaskSceneBox` has no skew field; dropped at generation | **MISMATCH** |
| D02-Intro | L10 book right | geometry `96,114 29×16 r 2px 6px 4px 2px #FBFAF7` | as design | verbatim | match |
| D02-Intro | L10 book right | box-shadow / transform | `inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.12)`; `skewY(6deg)` origin `bottom left` | both dropped | **MISMATCH** |
| D02-Intro | L11 spine | `95,113 2×15 #C6C5C0`, no radius | as design | verbatim | match |
| D02-Intro | L12/L13 page rules | `74,119` and `102,119`, `16×2.5 r1px #C6C5C0`, `skewY(∓6deg)` | geometry as design | geometry verbatim; **skew dropped** | **MISMATCH** |
| D02-Intro | L14 clock shadow | `218.15,166 43.699999999999996×11 r50% rgba(0,0,0,0.08) blur(5px)` | as design | as L4 | MISMATCH* |
| D02-Intro | L15 shelf | `217,138 46×8 r4px #DEDDD7` | as design | verbatim | match |
| D02-Intro | L16/L17 shelf legs | `224,146` and `251,146`, `5×24 r2.5px #C6C5C0` | as design | verbatim | match |
| D02-Intro | L18 clock cast | `210,134 60×11 r50% rgba(0,0,0,0.09) blur(5px)` | as design | as L4 | MISMATCH* |
| D02-Intro | L19 clock face | `214,78 52×52 r50% #F7F6F2` | as design | verbatim | match |
| D02-Intro | L19 clock face | **box-shadow** | `inset 0 0 0 2.6px #55534E, 0 4px 9px rgba(40,38,32,0.14)` — the 2.6px dark rim that reads as the clock's bezel | in the data, **never drawn** | **MISMATCH** |
| D02-Intro | L20 dial wedge | `219,83 42×42 r50%` `conic-gradient(#E9D2A4 0deg 126deg, rgba(0,0,0,0) 126deg 360deg)` | 126° amber sweep from 12 o'clock | `RadialGradient` centred (240, 104), rx/ry 21 | MISMATCH* (RN SVG has no conic gradient; a radial is the substitute) |
| D02-Intro | L20 dial wedge | first stop **colour** | `#E9D2A4` | `gradientStops()` finds no trailing `%`, so `splitColor()` returns the whole chunk: `stopColor="#E9D2A4 0deg 125.99999999999999deg"` — not a colour | **MISMATCH** |
| D02-Intro | L21 clock hand | `238.6,83 2.8×21 r1.5px #55534E`, `rotate(125.99999999999999deg)` | geometry + angle as design | verbatim | match |
| D02-Intro | L21 clock hand | **transform-origin** | `bottom center` = (240, 104) = the dial centre | `rotate(${a} ${x+w/2} ${y+h/2})` = (240, 93.5) (TaskScene.tsx:198) | **MISMATCH** — displaces the hand by (+8.50, +16.67) px, off the 52px dial |
| D02-Intro | L22 hand hub | `237.5,101.5 5×5 r50% #55534E` | as design | verbatim | match |
| D02-Intro | L23 bell | `235,71 10×6 r 3px 3px 0 0 #E2BA78` | as design | verbatim | match |
| D02-Intro | L24 spark | `288,66 4×4 r50% rgba(226,186,120,0.6)` | as design | verbatim | match |
| D02-Intro | L25 wave svg | `left:38 top:84`, 14.4 × 7.2, `viewBox="0 0 14.4 7.2"` | as design | verbatim (taskScenes.ts:531-558) | match |
| D02-Intro | L25 wave path | `d="M1 5.4 Q4.05 1.35 7.2 4.5 Q10.35 1.35 13.5 5.4"`, fill none, stroke `#8A857C`, sw 1.6, cap round | as design | verbatim | match |
| D02-Intro | scene (template) | linear-gradient angle | e.g. `linear-gradient(90deg, …)` on other days | `SvgLinearGradient x1=x y1=y x2=x y2=y+h` — always top→bottom, the CSS angle is parsed off and discarded (TaskScene.tsx:186) | **MISMATCH** (no day-2 layer hits it) |
| D02-Intro | scene (template) | `-webkit-mask` | e.g. day 1's moon crescent | `mask` captured in the data, never read by `Layer` | MISMATCH* (RN SVG has no `mask-image`; a `<Mask>`/clip path is the substitute) |
| D02-Intro | scene (template) | z-order | one stacking context, source order | one absolute `<Svg>` per layer, source order | match |

## 4. `Task-D02-Options` — the absolute options template

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| D02-Options | Close / eyebrow | as D02-Intro (`Close` at 16/12; eyebrow 62, 12/600/1.6/`#8B8882`, `DAY 2 · TODAY’S TASK`) | as design | identical (:62-68) | match |
| D02-Options | Title | text | `Twenty minutes, one space` | `task.secondTitle` (curriculum84.ts:93) | match |
| D02-Options | Title | top / left / right / size / weight / lh / colour | `144` → 90 / 30 / 30 / 27 / 500 / 35 / `#1D1C1A` | identical (:73) | match |
| D02-Options | Options container | left / right / top | 24 / 24 / `225` → app **171** | 24 / 24 / 171 (:118) | match |
| D02-Options | Options container | bottom | `bottom:108` from the 852 canvas edge → bottom edge at canvas 744 = app 690 | `bottom: 108` inside a bottom-inset `SafeAreaView`, so the bottom edge lands at app 690 − bottomInset (≈ 656 on a 34pt inset) | **MISMATCH** — should be `108 − bottomInset`, or anchor by height |
| D02-Options | Options container | flex / overflow | `column`, `overflow:hidden` (clips, no scroll) | `ScrollView` (scrolls), `showsVerticalScrollIndicator={false}` | MISMATCH (design clips) |
| D02-Options | Rows wrapper | `flex-direction:column`, `gap:22` | 22 | `contentContainerStyle={{ gap: 22 }}` (:119) | match |
| D02-Options | Row | `display:flex`, `align-items:flex-start`, `gap:14` | 14 | identical (:125) | match |
| D02-Options | Icon tile | 40 × 40, radius 12, `#FFFFFF` | as design | identical (:128-135) | match |
| D02-Options | Icon tile | shadow | `0 0 0 1px rgba(0,0,0,0.08), 0 3px 8px rgba(40,38,32,0.06)` | identical string (:133) | match |
| D02-Options | Icon tile | centring / shrink | `align-items:center`, `justify-content:center`, `flex-shrink:0` | centre + fixed 40 | match |
| D02-Options | Glyph | svg 22 × 22, `viewBox="0 0 20 20"` | as design | identical (:185) | match |
| D02-Options | Glyph 1 (broom) | children | `path M14.5 3L9.6 9.8` sw1.6 cap round; `path M9.9 9.4c1.8.9 2.9 2.2 3.3 4.3l-5.7 3c-1.5-1.4-2-3-1.7-5.1Z` fill none sw1.5 join round; `path M8.4 12.4l2.5 1.5` sw1.3 cap round; all `#3A3934` | verbatim, taskScenes.ts:17747-17774 | match |
| D02-Options | Glyph 2 (shared) | children | `rect 4,3,12,14 rx1.8 fill none sw1.6`; `path M10 3v14` sw1.6; `path M6.8 7.5h0M13.2 7.5h0` sw1.8 cap round; `path M6.8 10.5v2M13.2 10.5v2` sw1.6 cap round | verbatim, taskScenes.ts:17785-17822 | match |
| D02-Options | Glyph 3 (bag) | children | `path M6 7.6h8l1 8.9H5Z` fill none sw1.6 join round; `path M7.8 7.6V6a2.2 2.2 0 0 1 4.4 0v1.6` fill none sw1.6 | verbatim, taskScenes.ts:17833-17850 | match |
| D02-Options | Glyph 4 (bin) | children | `path M4.5 6h11M8 6V4.6h4V6M6.2 6l.7 10.4h6.2L13.8 6` fill none sw1.6 cap/join round; `path M8.7 9v4.4M11.3 9v4.4` sw1.4 cap round | verbatim, taskScenes.ts:17861-17879 | match |
| D02-Options | Row head | size / weight / line-height / colour | 15.5 / 600 / 21 / `#1D1C1A` | identical (:140) | match |
| D02-Options | Row body | margin-top / size / weight / line-height / colour | 3 / 13 / 400 / 19 / `#767370` | identical (:141) | match |
| D02-Options | Row body | text-wrap | `pretty` | web `pretty` via AppText, native none | MISMATCH* |
| D02-Options | Row 1–4 | copy | `Own room` / `Shared room` / `No fixed room` / `Digital` + bodies (incl. the ASCII hyphens in row 3) | verbatim, curriculum84.ts:97-100 | match |
| D02-Options | Dots | active index | second wide `#131313`, first `rgba(19,19,19,0.18)` | board 1 → `i===1` wide (:151) | match |
| D02-Options | Button | label | `Mark as done` | `Mark as done`; `alreadyDone` swaps in `Done` — a state no frame draws | match / extra state |
| D02-Options | Button | box | `left:24 right:24 top:744 (690) h52 r26 #131313` | identical | match |

## 5. `Task-D74-Options` — the empty-options state

| Frame | Element | Property | Design value | Current app value | Verdict |
| --- | --- | --- | --- | --- | --- |
| D74-Options | Screen | background / grain / close | `#F4F3F0`, noise @0.07, `Close` 16 / `66`→12 / 17 / 400 / `#3A3934` | identical | match |
| D74-Options | Eyebrow | text | `DAY 74 · TODAY’S TASK` | `DAY 74 · TODAY’S TASK` (label `TODAY’S TASK`, curriculum84.ts:1823) | match |
| D74-Options | Eyebrow | top / size / weight / ls / colour | `116`→62 / 12 / 600 / 1.6 / `#8B8882` | identical | match |
| D74-Options | Title | text | `Twenty minutes, today` | `task.secondTitle` (curriculum84.ts:1822) | match |
| D74-Options | Title | top / left / right / size / weight / lh | `144`→90 / 30 / 30 / 27 / 500 / 35 | identical | match |
| D74-Options | Options container | left / right / top / bottom | 24 / 24 / `225`→171 / `bottom:108` | 24 / 24 / 171 / `bottom:108` (safe-area-relative) | match / **MISMATCH** on bottom (see §4) |
| D74-Options | Options container | flex / overflow | `column`, `overflow:hidden` | ScrollView | MISMATCH (design clips) |
| D74-Options | Rows wrapper | children | **empty** — `<div style="display:flex; flex-direction:column; gap:22px;"></div>` with no rows, and **nothing else** in the container | `options.length === 0` renders `<AppText>{task.done}</AppText>` at 14.5 / 400 / 21 / `#8B8882` (:120-123) | **MISMATCH** — the frame draws no fallback copy |
| D74-Options | Rows wrapper | gap | 22 (unused) | 22 | match |
| D74-Options | Dots | top / gap / sizes / colours | `706`→652 / 6 / `6×6` idle then `18×6` active | second wide, board 1 | match |
| D74-Options | Button | top / left / right / height / radius / bg / label | `744`→690 / 24 / 24 / 52 / 26 / `#131313` / `Mark as done` 17/600/0.2/`#FFFFFF` | identical | match |
| D74-Options | Button | enabled state | one state drawn | plus `alreadyDone → 'Done'` | extra state, undrawn |

---

## Findings

Every MISMATCH, in order.

**`src/components/task/TaskScene.tsx`**

1. **:198 — rotate pivot.** `transform={rotate(${layer.rotate} ${x + w / 2} ${y + h / 2})}` rotates
   about the box centre. The canvas says `transform-origin: bottom center`. On day 2's clock hand
   (`left 238.6, top 83, 2.8 × 21, rotate 126deg`) the design pivot is (240, 104) — the dial centre —
   and the app's is (240, 93.5), displacing the hand by **(+8.50, +16.67) px**, clear off a 52px dial.
   Design: pivot `(x + w/2, y + h)`. Current: `(x + w/2, y + h/2)`.

2. **:76 / :50 — conic gradient stop colour is not a colour.** `gradientStops()` only strips a
   position when the chunk ends in `%`, so the day-2 dial chunk `#E9D2A4 0deg 125.99999999999999deg`
   goes into `splitColor()` whole and comes back as the stop colour. Rendered:
   `stopColor="#E9D2A4 0deg 125.99999999999999deg"`. Design: `#E9D2A4` at full opacity for the first
   126° of the sweep.

3. **:169-199 — `layer.shadow` is captured but never drawn.** Day 2 loses three: the clock face's
   `inset 0 0 0 2.6px #55534E` bezel ring (taskScenes.ts:483) and both book sheets'
   `inset 0 -3px 0 #D6D5D0, 0 1px 3px rgba(40,38,32,0.12)` (taskScenes.ts:390, 400). Current: no
   shadow at all on any layer.

4. **taskScenes.ts `TaskSceneBox` (:28-43) — no skew field, so `transform: skewY(…)` is dropped at
   generation.** Day 2 loses four: book left `skewY(-6deg)` origin bottom right, book right
   `skewY(6deg)` origin bottom left, and both page rules `skewY(∓6deg)`. Design: the open-book
   silhouette. Current: two flat rectangles.

5. **:186 — every linear gradient renders top→bottom.** `SvgLinearGradient x1=x y1=y x2=x y2=y+h`
   ignores the CSS angle the parser has already skipped over (`:74`). Design e.g.
   `linear-gradient(90deg, …)` = left→right. No day-2 layer is affected; days 1 and others are.

**`src/app/task/[day].tsx`**

6. **:108-110 — the done-card icon is the wrong icon.** Design (all 83 intro frames, verified):
   `<svg width="20" height="20" viewBox="0 0 18 18">` with `<circle cx="9" cy="9" r="7.5" fill="none"
   stroke="#1D1C1A" stroke-width="1.6"/>` and `<path d="M5.8 9l2.3 2.3 4.1-4.6" stroke="#1D1C1A"
   stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`. Current: `width={18}
   height={15} viewBox="0 0 16 13"`, one path `M1.5 7l4.4 4.5L14.5 1.5`, stroke `#131313`,
   `strokeWidth={2.4}`, no ring.

7. **:87 and :97 — the intro scene and the done card are pinned to day 2's tops.** Design: scene top
   = `desc top 193 + 21 × desc lines + 16`, taking 251 / 272 / 293 / 307 / 314 / 335 / 419 / 440
   across the 82 absolute intro frames; card top = scene top + scene height + 20. Current: fixed
   `top: 218` (canvas 272) and `top: 438` (canvas 492) — right for the 37 three-line frames, 21px×n
   out on the other 45.

8. **:88 — scene height is always 200.** Design: `Task-D74-Intro` clips it to **186** and
   `Task-D76-Intro` to **164**. Current: `TASK_SCENE_H` = 200 for every day.

9. **:98 — done card `minHeight: 68`.** Design: `height: 68px` fixed on all 82 frames. Current: the
   card grows past 68 whenever the copy runs to four lines.

10. **:118 — options container `bottom: 108` is measured in the wrong box.** The canvas measures 108
    from the 852 screen edge, putting the container's bottom at canvas 744 = app 690 (the button's
    top). Inside a `SafeAreaView edges={['top','bottom']}`, `bottom: 108` is measured from the
    padding edge, so it lands at 690 − bottomInset (≈656 on a 34pt device). Design: bottom edge at
    app 690. Current: 34pt short.

11. **:120-123 — the empty-options board draws copy the frame does not.** `Task-D74-Options` has an
    empty rows wrapper and nothing else between the title and the dots. Current: `task.done` at
    14.5 / 400 / 21 / `#8B8882`.

12. **Day 1 is drawn with day 2's template.** `Task-D01-Intro` and `Task-D01-Options` are the only
    flex-column frames in the bundle and nothing in `[day].tsx` special-cases `n === 1`. The
    differences, all currently wrong for day 1:
    - eyebrow letter-spacing 1.8 (app 1.6) and colour `#B0AEA8` (app `#8B8882`) — :67
    - a 16px spacer div between eyebrow and title — not built
    - title 26 / 500 / 38 with `max-width: 320` (app 27 / 500 / 35, `left:30 right:30`) — :73
    - intro description 21 / 400 / 36 with `max-width: 330` (app 14.5 / 400 / 21, `left/right 38`) — :82
    - the scene is `scale(0.85)` from `top center` in a 170px slot (app 340 × 200 unscaled at 26, 218) — :87-88
    - the done card is `align-self: stretch` inside a 38px gutter with `padding: 17px 18px` and
      `gap: 14`; its text is 15 / 500 / 22 (app `left/right 24`, `paddingHorizontal 18`, `gap 13`,
      13.5 / 500 / 19) — :94-111
    - options: column `gap: 18` (app 22), row `gap: 16` (app 14), tile **38 × 38** (app 40 × 40),
      head 16 / 600 / 22 (app 15.5 / 600 / 21), body `margin-top: 4` (app 3), gutter 32 (app 24) — :119-141
    - both D01 boards centre their content in a `top:96 / bottom:146|154` flex column with `gap: 26`;
      the app places every child absolutely.

13. **`text-wrap` is not expressible in RN — MISMATCH\*.** Both titles ask for `balance`; the
    descriptions, done-card text and option bodies ask for `pretty`. `AppText` emits `textWrap` only
    on web and only by variant — the task screen's text is all the `body` variant, so the titles get
    `pretty` where the design wants `balance`, and native gets neither. Substitute: none on native.

14. **`filter: blur(5px)` is not expressible — MISMATCH\*.** The four day-2 cast shadows use it.
    Substitute in place (TaskScene.tsx:87-92): a 4-stop radial, `1 / 0.72 / 0.3 / 0` at
    `0 / 0.5 / 0.78 / 1`, bounded to the layer's own ellipse — so the ~10px the CSS blur spills
    outside the box is not drawn.

15. **`conic-gradient` is not expressible — MISMATCH\*.** Day 2's dial wedge. Substitute in place: a
    `RadialGradient` centred on the box, which draws a radial fade instead of a 126° sweep. (Finding
    2 is a separate, fixable defect on top of this.)

16. **`-webkit-mask: radial-gradient(...)` is not expressible — MISMATCH\*.** Captured as `mask` in
    the layer data and never read. No day-2 layer uses it; day 1's crescent moon does. Substitute
    would be react-native-svg `<Mask>` or a two-circle even-odd path.
