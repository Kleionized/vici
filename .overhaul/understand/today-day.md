# today-day — analysis (Today home, Score detail, Morning + Night check-ins, the tab bar)

Group frames (24, all `Email-Login`): Today Home · Score Detail · Score Detail Moves · Score Detail Ranks ·
Today Home II · Today Home Task · Today Home III · Morning Check-in Cover · Morning Task Check ·
Morning 1 Yesterday · Morning Feeling · Morning Energy · Morning Resign Pledge · Morning Pledge Signed ·
Change Pledge Sheet · Morning 5 Done · Night Check-in Cover · Night 1 Mood · Checkin Emotions ·
Checkin Reasons · Night 3 Reflection · Night 2 Record · Night Action Reminder · Night 4 Closed.

Sources read for this doc: every frame through `scripts/overhaul/body.mjs` (dumps kept in
`.overhaul/understand/scratch-today-day/<Frame>.txt`), every design PNG in
`.overhaul/shots/design/Email-Login/`, the measured design layout signatures
`.overhaul/sig/d-Email-Login-<Frame>.txt` (exact rendered boxes — **use these for any y/x not stated
below**), `Vici Overhaul/project/gen/mono-kit.js` + `gen/mono-core.js` (the generator for all 24; the
frames were hand-edited after generation and differ from it in many places — the frame wins),
`gen/hero-bounds.json`, `gen/lesson-pool.json`, the Lesson-Illustrations-v4 bundle, and the current
app: `src/app/(app)/today.tsx`, `src/components/today/kit.tsx`, `src/app/score.tsx`,
`src/lib/score.ts`, `src/app/day/morning.tsx`, `src/app/day/night.tsx`, `src/components/day/kit.tsx`,
`src/components/MoodLogger.tsx`, `src/components/StoicTabBar.tsx`, `src/app/(app)/_layout.tsx`,
`.overhaul/recipes/{today,day}.json`, `.overhaul/day-seed.js`, `.overhaul/today-seed.js`.

**Verdict in one line:** nothing in this group survives visually. Every screen is a rebuild on the new
mono kit (dark ground, Lato, kit nav/primary/fab/grid2/cards, Lesson-Illustrations-v4 heroes); the data
and the controls behind them carry over almost unchanged, with a handful of copy changes and a few new
interactions (energy bars, Yes/Not-yet selection + fab, Months dropdown, pledge action buttons).

---

## 0. Things every screen here shares

### 0.1 Frame shell (two variants)

| variant | used by | ground | noise layer |
| --- | --- | --- | --- |
| light (default) | 22 of 24 frames | `#0D0D0D` | `noise.png`, opacity **0.05**, full-bleed, pointer-events none |
| dark | Night Check-in Cover, Night 4 Closed | `#111111` | `noise-dark.png`, opacity **0.09** |

Note: the kit (`mono-kit.js frame()`) says `noise-dark.png` at 0.06 — the frames say `noise.png` 0.05.
**The frame wins.** Both PNGs are already in `assets/images/` (`noise.png`, `noise-dark.png`, md5-identical
to the bundle's). The noise is drawn first (under everything). Status bar / home indicator are chrome
(D009) — not built; the mock web build's 54pt top inset makes canvas y == app y.

### 0.2 Kit `nav` row (all check-in steps)

`position:absolute; left:0; right:0; top:60; height:40; padding:0 22; flex row; space-between; z:5`.
- left box 36×40 (x 22): chevron `M10 2L2 10l8 8`, viewBox 0 0 12 20, 12×20, stroke `#F2F0EC` 2.2,
  round caps/joins. Covers, Morning 5 Done and Night 4 Closed draw the box **empty** (no back).
- centre: the dash rail (only when a step is given): 8 dashes, each 24×2, r1, gap 6 → 234 wide, centred
  (x 79.5, y 79). Active `#F2F0EC`, rest `#2E2E2E`. **Active count = max(1, round(step/total × 8))**:
  morning total 5 → steps 1..5 light 2,3,5,6,8; night total 6 → steps 1..6 light 1,3,4,5,7,8. Verified
  against every frame.
- right box 36×40 (x 335): close X `M2 2l14 14M16 2L2 16`, viewBox 18, 18×18 at (353,71), stroke 2
  round, `#F2F0EC` (`#FFFFFF` on the two dark frames).
- Every frame in this group draws the close X (including Done/Closed, which the app currently omits).

### 0.3 Bottom controls (kit)

- **primary**: `left 24 right 24 bottom 48 height 58 r29 bg #F2F0EC`; label 16/700, ls 0.1, `#111111`,
  nowrap, centred (measured text box h19). Dark frames: bg `#FFFFFF`. When paired with a ghost:
  primary `bottom 96` (box 698–756) + ghost `bottom 60` (text box 774–792): 15/400 `#9B968E`, centred
  in a full-width box.
- **nextFab**: `right 24 bottom 52`, 60×60 r30 `#F2F0EC` (box 309,740); chevron `M2 2l8 8-8 8`
  viewBox 0 0 12 20 drawn 14×22, stroke `#111111` 2.4 round. Used by Morning Task Check, Checkin
  Emotions, Checkin Reasons.
- Bottom-anchored offsets are off the frame edge, not the safe area (D026).

### 0.4 Type tokens used here (Lato; `sans()` / `sansItalic()` in `src/lib/theme.ts`)

h1 26/700 ls −0.6 lh33 `#F2F0EC` (`text-wrap:balance`); cover/closing h1 34/700 ls −0.6 lh40; p 15/400
lh24 `#B5B0A8`; sub-p ("Select all that apply.") 15/400 lh22 `#9B968E`; caps 13/700 `#9B968E` nowrap
(Lato normal line box measures 16); kit colours: INK/TXT `#F2F0EC`, SUB `#B5B0A8`, MUTE `#9B968E`,
LINE `#2E2E2E`, ART `#5A574F`, CARD `#1E1E1E`, GROUND `#0D0D0D`, ON_INK `#111111`, hero grey `#55524D`.
Lato "normal" line boxes measured in the sigs: 11.5→13, 12→15, 13→16, 14→17, 15→18, 16→19, 18→22,
26 (no lh)→32, 30→36. Weight 600 (SVG `<text>` on both charts) is not loaded → renders **700**
(`sans('600')` already maps to `Lato_700Bold`). 900 is used once (rank "Navigator"). Italic 700 is used
twice (Today III name, pledge signature).

### 0.5 Heroes (Lesson-Illustrations-v4 art) — every one verified path-identical to the bundle

The CSS on all of them: `<svg viewBox="0 0 393 240" width=393 height=240 style="position:absolute;
left:0; top:T; overflow:visible; transform:scale(S); transform-origin:196px 190px">`. Rendered box =
`(-19.6, T−19, 432.3, 264)` at S 1.1. In RN: an `<Svg width=393 height=240>` at top T (centre it on
wider/narrower screens: `left=(W−393)/2`) wrapping `<G transform="translate(196·(1−S) 190·(1−S))
scale(S)">` (brief SVG trap #3). It must have `position:absolute; top:…; left:…` (SVG trap #1). Art
bleeds −40…433 horizontally and ~−19 above the box; allow overflow or enlarge the canvas.

| frame | hero (bundle file) | T | S | DOM order |
| --- | --- | --- | --- | --- |
| Morning Check-in Cover | sunrise (`Sunrise.html`) | 190 | 1.1 | after nav |
| Morning Task Check | charger (`Phone-on-charge.html`) | 506 | 1.1 | first (under nav) |
| Morning 1 Yesterday | sunrise | 506 | 1.1 | after rows |
| Morning Feeling | sunrise | 506 | 1.1 | first |
| Morning Energy | battery (`Battery.html`) | 506 | 1.1 | first |
| Morning Resign Pledge / Pledge Signed | fountainPen (`Fountain-pen.html`) | 458 | 1.1 | first |
| Morning 5 Done | — none — | | | |
| Change Pledge Sheet | — none — | | | |
| Night Check-in Cover | nightMoon (`Moon-over-a-lone-house.html`) | 190 | 1.1 | after nav |
| Night 1 Mood | bed (`Bed-at-night.html`) | 506 | **1.075** | first |
| Checkin Emotions | nightMoon | 506 | **0.954** | first |
| Checkin Reasons | bubbles (`Speech-bubbles.html`) | 506 | 1.1 | first |
| Night 3 Reflection | notebook (`Open-notebook.html`) | 506 | 1.1 | first |
| Night 2 Record | — none — | | | |
| Night Action Reminder | charger | 458 | 1.1 | after stack |
| Night 4 Closed | nightMoon | 190 | 1.1 | after nav |

Today pages draw a **cropped** variant (no CSS transform, a viewBox crop instead):

| frame | hero | viewBox | width × height | top |
| --- | --- | --- | --- | --- |
| Today Home II / Today Home Task | nightPhone (`Phone-parked-for-the-night.html`) | `-21.83 47.7 436.67 165.3` | 393 × 148.8 | 241.3 |
| Today Home III | nightMoon | `-40.25 36 473.49 178` | 393 × 147.7 | 231.5 |

The crop is derived, and the derivation reproduces both frames exactly, so it generalises to any hero:
with `[t, b] = hero-bounds.json[k][0..1]`: `vy = t − 3`, `vh = b − t + 6`, `s = round2(148 / vh)`,
`vw = 393 / s`, `vx = 196.5 − vw / 2`, rendered height `= vh × s` (nightPhone: 47.7 / 165.3 / 0.90 /
436.67 / −21.83 / 148.8; nightMoon: 36 / 178 / 0.83 / 473.49 / −40.25 / 147.7). Inner content of the
nightPhone crop keeps its own `<g transform="translate(-6 0)">`.

### 0.6 The tab bar (app-wide, `src/components/StoicTabBar.tsx` + `src/app/(app)/_layout.tsx` — orchestrator-owned)

Drawn identically (structure-hash-identical) on Today Home/II/Task/III, Score Detail ×3, Log Urges /
Check-ins / Reports, Medallions ×3 and all 24 Week covers; only the active item changes.

- Container: `position:absolute; left:0; right:0; bottom:0; height:104; display:flex;
  align-items:flex-start; justify-content:space-between; padding:14px 14px 0; z-index:8`.
  **No background, no border, no shadow** — the frame's ground/noise shows through. (Box 0,748,393,104.)
- Items, left → right, each `width:72; flex column; align-items:center; gap:4`: glyph 26×26 (viewBox
  0 0 26 26, stroke-width 1.8, `fill:none`), label 11.5px (box h13) — active **700 `#F2F0EC`**, inactive
  **400 `#9B968E`**; glyph stroke follows the label colour.
  - **Today** — box x 14: `M4 12.5L13 4l9 8.5V21a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 4 21z`,
    stroke-linejoin round.
  - **Log** — x 90.25: `<rect x=5 y=3.5 width=16 height=19 rx=3>` + `M9 9h8M9 13h8M9 17h5`
    (linecap round).
  - **SOS** — x 166.5: a 60×60 disc r30 `#F2F0EC`, `margin-top:-6` (box 166.5,756), label "SOS"
    13/700 `#111111` centred (text box 184.3,778). Never drawn active/inactive — it is a button.
  - **Library** — x 230.75: `M13 6.5C11 5 8 4.5 4 4.5v15c4 0 7 .5 9 2 2-1.5 5-2 9-2v-15c-4 0-7 .5-9 2z M13 6.5v15`,
    linejoin round.
  - **Journey** — x 307: `<circle cx=13 cy=10 r=6.5>` + `M9 15.5L7 23l6-3 6 3-2-7.5`, linejoin round.
- Measured: glyph tops 762, labels 792–805, centres 50 / 126.25 / 196.5 / 266.75 / 343
  (`space-between` over 365 with 4×72+60 = 348 → 4.25 between items). Label widths: Today 30.7, Log
  18, Library 36.1, Journey 40.7.
- **Active state per route (from the frames):** Today → `/today`; Log → Log Urges/Check-ins/Reports
  (`/log`); Library → every Week cover (`/week/[week]`, `/library`); **Journey → Medallions ×3
  AND Score Detail ×3** (`/milestones`-family and `/score`). SOS never active.
- Destinations (keep current behaviour where it exists): Today `/(app)/today`; Log `/log-chooser`
  (D124); SOS → the urge flow (today the urge bar opens `/urge-hub`; the sos-flow group decides between
  `/urge-hub` and the `Cue Intro Modal` route — tab bar just needs the route); Library
  `/(app)/library`; Journey → the Medallions screen (`/(app)/milestones` today).
- Removed vs current bar: the white shelf, the door/stack/books glyphs, the 13px labels, the
  three/four-tab hand-set centres, and the `All` drawer tab (`SHOW_ALL_TAB`) — the canvas draws five
  items and no `All`. The review drawer must stay reachable some other way (orchestrator's call).
- Height on devices: the frame's 104 includes the 34pt home-indicator zone. Suggest
  `height = 70 + max(insets.bottom, 34)` with contents pinned to the top padding (14) so on a 34-inset
  phone it is exactly the frame; `useTabBarHeight()` must return the new number (consumers:
  `all.tsx`, `today.tsx`, `log.tsx`, `library.tsx`, `journal.tsx`).
- Because the bar has no background, a scene must end at the bar's top (748) — react-navigation's tab
  layout already does that; anything absolutely positioned or scrolling past 748 would show under
  the labels.

### 0.7 Sheet shell (Change Pledge Sheet; identical on Sheet Edit Name / Sheet Profile Photo)

Scrim `rgba(0,0,0,0.68)` over the whole screen (status bar included); sheet `left 0 right 0 top T
bottom 0`, radius 28 28 0 0, bg **`#171717`** (not GROUND); grabber 40×4 r2 `#2E2E2E` centred at top
10; content block `left 24 right 24 top 44`, column, gap 12. The kit's `sheet()` (scrim
`rgba(17,17,17,0.5)`, bg GROUND) is **not** what the frames draw. Primary/ghost are frame-level
(`bottom 96` / `bottom 60`), painted above the sheet.

---

## 1. Today (`/today`, `src/app/(app)/today.tsx` + `src/components/today/kit.tsx`)

### 1.1 Structure

The four Today frames share, pixel-for-pixel, a **header row + week strip** (y 64–199) and the tab bar;
only the band between (≈200–748) changes. That is the existing three-page vertical pager with a fixed
top, re-dealt:

- **page 1** = Today Home (score + chart + "This morning")
- **page 2** = Today Home II (task undone, generic register) / Today Home Task (task done, lesson register)
- **page 3** = Today Home III (pledge + "Tonight"), drawn at evening time

Recommended page geometry: pager viewport from canvas **y 200** (just under the strip's 199) to the tab
bar top (748) → page height 548 at 852; on a device `pageH = windowH − insets.top − 146 − tabBarHeight`.
Offsets below are given in frame coordinates; subtract 200 for page-relative. The current app's
mark row (laurel + settings glyph), the urge bar and the `pagingEnabled` ScrollView heights
(`37 + 64`) all go.

### 1.2 Header (all four frames)

Row `left 24 right 24 top 64`, `align-items:center; space-between` (box 24,64,345,40).
- Greeting: 26/700 ls −0.7 lh32 `#F2F0EC` nowrap — **"Good morning."** (Home, II, Task) /
  **"Good evening."** (III). Use `checkinPartNow()` (`src/lib/routines.ts`, morning 04:30–18:30) so it
  agrees with the check-in prompt.
- Right group, gap 10:
  - streak pill: h36 r18 bg `#1E1E1E`, padding `0 12 0 10`, gap 6 (box 257.6,66,61.4,36): flame 16×18
    viewBox 0 0 16 18 `M8 1c1 3 4 4.5 4 8.5A4 4 0 0 1 4 9.5c0-1.5.6-2.5 1.3-3.3.2 1 .8 1.8 1.7 2C6.5 6 6.5 3.5 8 1z`
    fill `#F2F0EC`; number 15/700 `#F2F0EC` ("41").
  - avatar: 40×40 r20, **outline** (`box-shadow:0 0 0 1.5px #2E2E2E`, no fill — the kit's `avatar()`
    is filled; the frame is not), glyph 22×22: `<circle cx=11 cy=8 r=4>` + `M3.5 19a7.5 7.5 0 0 1 15 0`,
    stroke `#F2F0EC` 1.8, round cap. Box 329,64.

### 1.3 Week strip (all four)

Row `left 24 right 24 top 136; display:flex; justify-content:space-between` (box 24,136,345,63); seven
columns, each `flex column; align-items:center; gap 12`: day label (12px; box h15) then a 36×36 r18 disc.
Column x: 24, 75.5, 127, 178.5, 230, 281.5, 333. Labels `Su Mo Tu We Th Fr Sa` (Sunday-first week
containing today; numbers are the dates).

| state | label | disc |
| --- | --- | --- |
| past, held | 400 `#9B968E` | bg `#F2F0EC`, check 14×14 (`M2 7.5l3.2 3L12 3.5`, viewBox 14, stroke `#111111` 2.2 round) |
| today, open | **700 `#F2F0EC`** | transparent, ring `0 0 0 1.5px #F2F0EC`, date 14/700 `#F2F0EC` |
| today, closed (III) | 700 `#F2F0EC` | same as past-held (filled + check) |
| future | 400 `#9B968E` | transparent, ring `0 0 0 1.5px #2E2E2E`, date 14/700 `#9B968E` |

Not drawn: a past day with a lapse, a past day before the account existed. See open questions.

### 1.4 Page 1 — Today Home

- Score row `left 24 right 24 top 240; align-items:flex-end; space-between` (box h84):
  - column gap 12: caps "Recovery score" (13/700 `#9B968E`, box 24,240,140,16); number 56/700 ls −0.5
    lh56 `#F2F0EC` ("1,240", `toLocaleString`), box 24,268.
  - delta pill: h30 r15 bg `#1E1E1E`, padding 0 12, gap 5, 14/700 `#F2F0EC` nowrap, **margin-bottom 8**
    (box 313.8,286,55.3,30); up-arrow 10×10 viewBox 10 `M5 9V1M1.5 4.5L5 1l3.5 3.5` stroke `#F2F0EC`
    1.8 round/round; text "18".
- Chart: wrapper `left 24 top 334`, `<svg viewBox="0 0 345 250" 345×250>`:
  - defs `linearGradient#scoreFill` (0,0)→(0,1): `#F2F0EC` 0.22 → `#F2F0EC` 0.
  - three dashed rules `M0 70H345`, `M0 130H345`, `M0 190H345`: stroke `#2E2E2E` 1, dasharray `2 5`.
  - area: the line's points + `L329 232 L0 232 Z`, fill `url(#scoreFill)`.
  - line: 30 points, `x_i = round1(i × 329/29)` (0, 11.3, 22.7, 34, 45.4 …, 329); frame y values:
    `202.4 210.6 190.9 170.2 164.7 178.7 172 161.8 152.4 140.1 150.9 154.7 142.1 119.3 113.5 122.5 120.1 106.5 86.9 96 91.2 96.9 68 60.2 64.5 71.6 64.9 48.3 39.6 37.9`;
    stroke `#F2F0EC` 3, linecap/linejoin round, straight segments (`L`, not curves).
  - end marker: circle at the last point (329, y_last) r7 fill `#0D0D0D` stroke `#F2F0EC` 3.
  - labels: "30 days ago" `x=0 y=246` 12px weight 600 (→700) `#9B968E`; "Today" `x=345 y=246`
    `text-anchor:end` 12/700 `#F2F0EC`.
  - data mapping (frame is max at today, min at index 1): `y = 210.6 − (v − min)/(max − min) × 172.7`
    over the last-30-day series (see OQ-T3 for flat / young accounts).
- caps "This morning" `left 24 top 622` 13/700 lh16 `#9B968E`.
- chips row `left 24 right 24 top 650; flex; gap 10`: each chip h44 r22 bg `#1E1E1E`, padding
  `0 18 0 8`, gap 10, label 15/700 `#F2F0EC`.
  - mood chip (box 24,650,95,44): 30×30 r15 disc bg `#1E1E1E` + ring `0 0 0 1.5px #2E2E2E`, inner
    14×14 r7 disc `#BAB5AD` (the mood tone); label "Fine".
  - energy chip (box 129,650,143.2,44): 30×30 r15 ring-only (`#2E2E2E` 1.5, no bg), bolt 14×14
    viewBox 14 `M8 1L2 8h5l-1 5 6-7H7z` fill `#F2F0EC`; label "Low energy" (= `${ENERGY_WORD} energy`).

Removed vs app: "Day 41" heading, the night-sky ScoreCard (sky, moon, ridges, waterline, "Trend" chip,
gold rank bar, "Navigator · 1,150 / Helmsman · 1,300"), the two white reading pills (dots/bars), the
"Last 30 days" 30-dot HeldStrip, the urge bar.

### 1.5 Page 2 — Today Home II (undone, generic) and Today Home Task (done, lesson)

- Hero (cropped, §0.5): the lesson's cover hero (`lesson-pool.json[day][0]`; day 1 = nightPhone, which
  both frames draw). Box 0,241.3,393,148.8.
- Task row `left 24 right 24 top 433; align-items:center; space-between; gap 20`:
  - text column (box w273), gap 6: label 13/700 `#9B968E` (box h16), sentence 700 ls −0.4 `#F2F0EC`
    `text-wrap:pretty`.
    - II (generic register): label **"Today’s task"**, sentence **20px lh27** (2 lines, box 455,h54):
      "Put your phone somewhere hard to reach before you sleep."
    - Task (lesson register): label **"Today’s task: Prepare for tonight"** (= `Today’s task: ${lesson title}`,
      new L1 title), sentence **17px lh24** (2 lines, box h48): "Put the device you use for porn out of
      reach before you sleep."
  - check: 52×52 r26, `flex-shrink:0`. Undone: transparent + ring `0 0 0 1.5px #F2F0EC` (box 317,445).
    Done: bg `#F2F0EC`, no ring, check 20×20 (viewBox 14 path, stroke `#111111` 2.2) (box 317,442 — it
    re-centres on the shorter 70-tall column).
- Tiles row `left 24 right 24 top 553; flex; gap 12`: two `flex:1` tiles (166.5 wide) h150 r24 bg
  `#1E1E1E` padding 18, `flex column; space-between`:
  - glyph 28×28 (viewBox 0 0 26 26, stroke `#F2F0EC` 1.8, fill none);
  - text column gap 4: caps 12/700 `#9B968E` (box h15) + title 16/700 ls −0.2 lh20 `#F2F0EC`.
  - Lesson tile: book glyph (same path as the Library tab glyph) — "Lesson 5" / "Naming your
    triggers" (2 lines; mock copy, see OQ-T6). Opens the day's lesson (current `onLesson`).
  - Urge tile: waves glyph `M3 15c3 0 3-4 6-4s3 4 6 4 3-4 6-4M3 20c3 0 3-4 6-4s3 4 6 4 3-4 6-4`
    (linecap round) — "Ride it out" / "Urge surfing". Opens `/urge-hub` (the urge bar's old door).

Removed: "This week · Library ›" section row, the paper LessonCard with its dome/plate and 7-slot
rail, the 274-tall TaskCard with its drawn night (TaskNight, Face, PhoneDownArt, WaterArt,
DoorwayArt, NoteArt, BedArt, LessonNightArt, LessonDome, DomeTag, Crescent, Glow) — D132/D133/D135
become moot. Copy change: DAY_STEPS[0] "Put your phone somewhere **difficult to access** before you
sleep." → "…**hard to reach**…". The lesson-register label changes from `cardTitle` alone ("Surviving
the night") to `Today’s task: ${lesson title}`.

### 1.6 Page 3 — Today Home III

- Hero cropped nightMoon (box 0,231.5,393,147.7).
- caps "Your pledge" `left 24 top 413` (lh16).
- block `left 24 right 24 top 439; column; gap 10`:
  - pledge 22/700 ls −0.3 lh31 `#F2F0EC` ("The mornings are mine again.", 1 line here);
  - name **italic 700** 16 `#9B968E` ("Jerry" — first word of `displayName`), box 24,480,h19;
  - buttons row `gap 10; margin-top 6` (box top 515): three 42×42 r21 rings `0 0 0 1.5px #2E2E2E`,
    glyph 18×18 viewBox 18, stroke `#F2F0EC` 1.6 round/round: plus `M3 9h12M9 3v12`; star
    `M9 3l1.8 3.8 4.2.6-3 3 .7 4.2L9 12.6l-3.7 2 .7-4.2-3-3 4.2-.6z`; share
    `M9 11V3M6 6l3-3 3 3M4 11v3h10v-3`. (Kit `iconCircle`.)
- caps "Tonight" `left 24 top 595`.
- card `left 24 right 24 top 623` (box h95): r24 bg `#1E1E1E` padding `18 20`; row gap 16
  align-center: 52×52 r26 `#F2F0EC` disc with stopwatch 26×26 (`<circle cx=13 cy=15 r=8>` +
  `M13 15V10M13 3h0M10 3h6M13 3v4`, stroke `#111111` 2.4, cap round); text column `flex:1` gap 3: title
  18/700 `#F2F0EC` "Urge surfing", sub 14/400 `#B5B0A8` `text-wrap:pretty` "Five minutes. Ride the next
  one out." (wraps to 2 lines, box 112,666,207,34); chevron-right 14 (`M5 2l5 5-5 5`, stroke `#9B968E`
  2 round). Opens the urge flow.
- Week strip on this frame: today (Fr) is **filled with a check** — see OQ-T2.

Removed: the paper PledgeCard (drawn quote marks, sun glow, hills, Snell Roundhand signature, rule).

### 1.7 Functionality to keep on Today (not drawn, or drawn differently)

- `LoadingView` while `progress/checkins/events` load → restyle to the dark ground (no frame).
- Score/chart → `router.push('/score')`.
- "This morning" chips → `/day/morning` (same as the old section row).
- Task: generic step → toggles `dailyActionDone` via `useUpsertCheckin` on today's row; lesson step →
  `/task/${day}` (or whatever the lessons group makes the task route). Source precedence stays:
  named `dailyAction` → generic register; `lessonForDay(day)` → lesson register; else
  `DAY_STEPS[(day−1) % 5]` (generic). Each DAY_STEP needs a hero name instead of its old art
  component (suggest: phone → `nightPhone`, water → `twoCups`?, outside → `openDoor`, note →
  `notebook`, bed → `bed`; the frame only fixes the phone one).
- Lesson tile → `lesson-card/${day}` or `/lessons-browser` (current `onLesson`).
- Avatar → `/(app)/settings` (the old person glyph's door).
- Pledge → `/(app)/journal` (current `onPledges`) — now split over three buttons (OQ-T5).
- The urge door (old dark bar) → the SOS tab and the two "Urge surfing" entries.
- Vertical paging with snap (`pagingEnabled`/`snapToInterval = pageH`).
- `(app)/_layout.tsx`'s launch gates (letter, medallion post, weekly report, hourly check-in prompt)
  are untouched.

---

## 2. Score Detail (`/score`, `src/app/score.tsx`)

### 2.1 Header (identical on all three)

- Row `left 0 right 0 top 60 h40 padding 0 22 space-between`: back chevron 12×20 (`M10 2L2 10l8 8`,
  stroke 2.2) at (22,70); **"Months" dropdown pill** h44 r22 bg `#1E1E1E` padding 0 18 gap 10, 15/700
  `#F2F0EC` + chevron-down 14 (`M2 5l5 5 5-5`, stroke 2, round) — box 259.1,58,111.9,44.
- caps "Recovery score" centred, top 128 (box h16).
- number 60/700 ls −2.4 lh70 `#F2F0EC` centred, top 160.
- rank pill centred, top 248: h32 r16 bg `#1E1E1E` padding 0 14 gap 8, 13/700 `#F2F0EC` nowrap:
  8×8 r4 `#F2F0EC` dot + **"Navigator II"** (`${rank.name} ${TIER[index]}` — no middot; box
  140.1,248,112.8,32).
- Tab bar with **Journey** active.

### 2.2 Score Detail (chart page)

- `<svg viewBox="0 0 393 230" 393×230>` at top 324, left 0:
  - `M0 60H393` stroke `#F2F0EC` 1 dasharray `2 6` (top value line); `M0 200H393` stroke `#F2F0EC`
    **1.5** solid (baseline).
  - value labels `x=369` end-anchored, 11px weight 600(→700) `#9B968E`: "1,400" at y 52, "1,000" at y 194.
  - one line: `M-5 178 C 50 176, 80 160, 120 150 C 160 140, 180 124, 220 118 C 260 112, 280 100, 310 92 C 340 84, 360 80, 400 76`,
    stroke `#F2F0EC` 5, round cap, fill none — it bleeds off both edges.
  - marker circle (372, 80) r7 fill `#0D0D0D` stroke `#F2F0EC` 4 (on the line).
  - month labels 13px centred at x 40 / 196 / 352, y 226: "May", "Jun" weight 600(→700) `#9B968E`;
    current month "Jul" 700 `#F2F0EC`.
  - No area fill, no previous-period line, no gridlines, no value badge, no vertical "today" rule.
- Insight row `left 24 right 24 top 600; align-center; gap 16`: 44×44 r22 `#F2F0EC` disc with up
  arrow 16×16 (`M8 13V3M3.5 7.5L8 3l4.5 4.5`, stroke `#111111` 2.2); column gap 2: "+90 points this
  quarter" 18/700 ls −0.2 `#F2F0EC`; "May – July" 15/400 `#B5B0A8` (en dash, long month names).

### 2.3 Score Detail Moves

- caps "What moved it this month" centred top 300.
- card `left 16 right 16 top 334` r24 bg `#1E1E1E` padding `16 20 18` (box 16,334,361,313):
  - 5 rows h44, gap 14, align-center: label w112 15/700 (`#F2F0EC`; slip row `#9B968E`); bar
    `flex:1` h12 (track box 137 wide) with an absolute fill h12 r6 width `round(|v|/max·100)%` —
    positive: bg `#F2F0EC`; negative: transparent + `inset 0 0 0 1.5px #F2F0EC`; value w44
    right-aligned 15/700 `#F2F0EC`, sign `+` / `−` (U+2212).
  - Frame rows: Clean days +64 (100%), Check-ins +18 (28%), Lessons +12 (19%), Urges ridden +8
    (13%), **"Slip on Jul 8"** −16 (25%).
  - footer `margin-top 12; padding-top 14; border-top 1px #2E2E2E; space-between; align-items:baseline`:
    "Net this month" 13/700 `#9B968E` nowrap, "+86" 26/700 ls −0.6 `#F2F0EC`.
- No footer sentence, no insight card.

### 2.4 Score Detail Ranks

- caps "The ranks" centred top 300.
- card `left 16 right 16 top 334` r24 bg `#1E1E1E` padding `22 22 20` (box h242). Rows (highest first:
  Captain 1,500 · Helmsman 1,300 · Navigator 1,150 · Deckhand 1,000), each `flex; gap 18`:
  - left rail w26 `column; align-center`: 26×26 r13 disc + connector `flex:1; border-left 2px; margin 4 0`
    (not on the last row).
    - todo (above the user): disc bg `#1E1E1E` + ring `0 0 0 1.5px #F2F0EC`; connector **dashed**
      `#5A574F`.
    - here: disc `#F2F0EC` with an 8×8 r4 `#1E1E1E` dot; connector **solid** `#F2F0EC`.
    - done (below): disc `#F2F0EC` with check 12×12 (stroke `#111111` 2.2).
  - right `flex:1; space-between; align-items:flex-start; padding-bottom 30` (0 on the last row):
    name 18/700 (here **900**), colour todo `#9B968E` else `#F2F0EC`; under "here" only: **"You’re here.
    60 to go"** 13/700 `#B5B0A8` nowrap (gap 2); value 15/700 (todo `#9B968E`, else `#F2F0EC`).
  - Measured rows: 356 (h52), 408 (h52), 460 (h70), 530 (h26).

### 2.5 Paging and what goes

The three frames share the header and differ below ~292 → keep the existing **horizontal pager** for
the three pages, but under a header that is now plain text on the ground (no sheet, no radius, no
pager dots — none of the three frames draws dots; D028/D065's dots are gone). Removed: NightHeader
(sky, moon, ridges, waterline, Grain), the light sheet, "Score over time" title, 3M/1Y pills (→ Months
dropdown), the rank progress bar + its two end labels, the value badge, the InsightCard on all three
pages, the `paceLine()` sentence (no frame prints a pace any more), the "you’re here" chip.

Keep: back (`router.back()` / replace `/today`), the range state (3M ↔ "Months", 1Y ↔ OQ-S1), the real
`scoreHistory` / `monthLedger` data, `RANKS`, `buildScore`. Copy changes: "What moved it" + "this month"
→ one caps line "What moved it this month"; `Slip · Jul 8` → `Slip on Jul 8`; insight title
`+N points` / `vs Apr 3 – May 3` → `+N points this quarter` / `May – July`; "you’re here" chip →
`You’re here. ${toGo} to go`.

---

## 3. Morning check-in (`/day/morning`, `src/app/day/morning.tsx`, `src/components/day/kit.tsx`)

Step order is unchanged: COVER → TASK → LEDGER → FEELING → ENERGY → PLEDGE (2 states) → DONE, plus the
sheet. Every step: light frame shell, kit nav (back + rail + close) unless noted. The whole `DayShell`
(paper ground, `Back` word row, dot rail, 52-tall ink pill at 702), MorningSky bands, LedgerMark,
LedgerRow plates/glyphs, MoodDial, ScaleReading, PledgeCard (paper), DayBadge, DayClosing,
AnswerRow and ActionCard/NightActionArt are replaced. D091/D094/D096 become moot.

### 3.1 Morning Check-in Cover
nav: no back, close only. Hero sunrise T190 S1.1. Stack `left 24 right 24 top 452; gap 12; centred`:
caps **"Day 13, about two minutes"** (box h16) then h1 34/700 ls −0.6 lh40 "Morning check-in." (box
480). Primary **"Begin"**. Copy: `Day 13 · two minutes` → `Day 13, about two minutes` (and it moves
**above** the title); pill `Begin day 13` → `Begin`. Keep: close → back/replace today; Begin → TASK.

### 3.2 Morning Task Check (rail 2/8)
Hero charger T506 (drawn first). Stack `top 136; gap 18`: h1 "Did you complete this task?"; 4px
spacer; card r24 bg `#1E1E1E` padding 22 (box 24,209,345,124), column gap 8: caps **"Yesterday"**,
sentence 19/700 lh28 `#F2F0EC` ("Write down each trigger the moment you notice it." — 2 lines); 4px
spacer; **grid2** (2 cols, gap 12; cells h62 r20, label 16/700 nowrap centred): "Yes" selected (bg
`#F2F0EC`, text `#111111`, no ring), "Not yet" unselected (bg `#1E1E1E`, ring `0 0 0 1.5px #2E2E2E`,
text `#F2F0EC`) — boxes 24,373 and 202.5,373 (166.5 wide). nextFab.
Change: the two glyph pills (✗/✓, a11y "No"/"Yes") that advanced on tap → a two-option selection
(`Yes` / `Not yet`) plus the fab that advances. Card label `Today` (sun) → `Yesterday`. Keep: the
answer is stored on **yesterday's** row (`dailyActionDone`), the sentence is
`yesterday.dailyAction ?? dayAction(day−1)`, back → cover.

### 3.3 Morning 1 Yesterday (rail 3/8)
h1 "Yesterday’s record." (stack top 136). Rows container `left 24 right 24 top 208`, column, no card:
each row `flex; align-center; gap 14; height 58; padding 0 2`, rows 2–5 add `border-top:1px #2E2E2E`
(content-box → measured 59; RN border-box: height 59 + borderTop 1). Row: 22×22 r11 `#F2F0EC` disc
with check 11×11 (stroke `#111111` 2.2); label `flex:1` 16/400 `#F2F0EC` nowrap; optional value 15/700
`#F2F0EC` nowrap. Rows: "Recovery score" + "+12 → 1,240"; "Pledge kept"; "One urge surfed";
**"0 slips"**; "Part III finished". Hero sunrise T506 after the rows. Primary "Continue".
Copy: `0 relapses`/`1 relapse` → `0 slips`/`1 slip`. Removed: LedgerMark art, the white card, plates
and per-row glyphs (gauge/check/wave/cross/play), the warm cross plate. D097 still applies (`+12 →
1,240` is a day-41 number on a day-13 account).

### 3.4 Morning Feeling (rail 5/8)
h1 "How are you feeling?". Disc row `left 0 right 0 top 232 h150; flex; align-center;
justify-center; gap 18`, five discs, all `flex-shrink:0`:
| i | size | bg | ring |
| --- | --- | --- | --- |
| 0 | 48 | `#34322F` | `inset 0 0 0 1.5px #45423E` |
| 1 | 48 | `#5A5751` | `inset 0 0 0 1.5px #45423E` |
| 2 (selected in frame) | **64** | `#8A857D` | `0 0 0 4px #0D0D0D, 0 0 0 6px #F2F0EC` (outer) |
| 3 | 48 | `#BAB5AD` | none |
| 4 | 48 | `#F2F0EC` | none |
Measured x: 32.5, 98.5, 164.5 (y 275), 246.5, 312.5 (y 283). Reading stack `left 24 right 24 top 440;
gap 6; centred`: word 30/700 ls −0.6 `#F2F0EC` ("Steady"), p 15/24 `#B5B0A8` ("On level ground").
Hero sunrise T506. Primary "Continue". Words unchanged (`MOOD_READ`). Selection: the selected disc
grows to 64 and takes the double ring (OQ-M3 for whether an inset ring stays on 0/1).

### 3.5 Morning Energy (rail 6/8)
h1 "Where’s your energy?". Bars container `top 232`, inner `flex; align-items:flex-end;
justify-center; gap 14; height 150`: five bars 44 wide, heights **50 / 75 / 100 / 125 / 150**, r14;
`i ≤ selected` → `#F2F0EC`, else `#1E1E1E` + ring `0 0 0 1.5px #2E2E2E` (outside). Frame selects 1
("Low"): x 58.5, 116.5, 174.5, 232.5, 290.5. Reading at 440: "Low" / "Still warming up". Hero battery
T506 (includes `<ellipse cx=196 cy=198 rx=78 ry=4.68 fill=#3A3835>` shadow). Primary "Continue".
**Change:** the app currently reuses the five-disc MoodDial for energy ("the bars are withdrawn"); the
bars are back and are the control (tap bar i → energy i). Words unchanged (`ENERGY_READ`).

### 3.6 Morning Resign Pledge / Morning Pledge Signed (rail 8/8) — one step, two states
Hero fountainPen T458 (first). Stack `top 136; gap 18`: h1 "Re-sign your pledge."; 6px spacer; card
r24 bg `#1E1E1E` padding `24 24 20` (box 24,211,345,235), column gap 22: caps "Your pledge"; pledge
24/700 ls −0.4 lh33 `#F2F0EC` (wraps "The mornings are mine / again."); signature line: `padding-top 12;
height 44 (content); padding-bottom 8; display flex; align-items:flex-end; border-bottom 1.5px` →
measured box h65 (361–426).
- unsigned: border **dashed `#5A574F`**; text "Sign here" 15/400 normal `#9B968E`; primary **"Sign for
  today"**.
- signed: border **solid `#F2F0EC`**; text = name in **28/700 italic** `#F2F0EC` ("Jerry"); primary
  **"Confirm"**.
Ghost "Change the pledge" (bottom 60). Removed: paper card with sun/hills/quote glyph, the 98-tall
signature plate, uppercase "SIGN HERE", Snell Roundhand, the plate's clear-× button (OQ-M4).
Keep: first press signs (`setSigned(true)`), second press → DONE; Change the pledge → sheet; standing
pledge = latest `Pledge` journal entry, fallback "The mornings are mine again."; a sheet draft stands in.

### 3.7 Change Pledge Sheet
Sheet shell §0.7 with **top 120** (sheet 732 tall). Content (top 44 → frame 164): h1 "Change the
pledge"; p 15/24 `#B5B0A8` "One promise you can keep every day."; 8px spacer; field `min-height 100;
r20; bg #1E1E1E; padding 20 22`, text 20/700 lh29 `#F2F0EC` (frame types "Phone stays out of the
bedroom" with a 2×22 caret — the platform caret, D025). Primary "Sign the new pledge" (bottom 96),
ghost "Keep current pledge" (bottom 60). Behind the scrim the frame draws only empty ground (no
placeholder blocks any more); the app keeps drawing the live Resign screen (D095 still applies).
Copy unchanged. Changes: sheet 532 → 732 tall, `#F4F3F0` → `#171717`, radius 22 → 28, scrim
`rgba(38,37,30,0.42)` → `rgba(0,0,0,0.68)`, field 126 white → min-100 dark, buttons move from
sheet-relative 274/346 to frame-bottom 96/60. Keep: scrim tap = keep; Sign → `setDraft`, unsign, close.

### 3.8 Morning 5 Done
nav: close only (no back, no rail) — **add the close X** (app omits it on DONE). 132×132 r66 `#F2F0EC`
disc centred at top 288 with check 56×56 (viewBox 14, stroke `#111111` 2.2). Stack `top 458; gap 18;
centred`: h1 "Day 13, underway."; caps **"Pledge re-signed on Day 13"**. Primary "Done". Copy:
`Pledge re-signed · Day 13` → `Pledge re-signed on Day 13`. Removed: the 452 MorningSky band, laurel
DayBadge. Keep: Done → `finish()` (upsert mood/energy, yesterday's `dailyActionDone`, Pledge journal
entry, close).

---

## 4. Night check-in (`/day/night`, `src/app/day/night.tsx` + `MoodLogger.tsx` boards)

Order unchanged: COVER → MOOD → EMOTIONS → REASONS → REFLECTION → RECORD → ACTION → CLOSED. Every step
now draws back + rail + close (the app's `NO_BACK` set for Reflection/Record and the rail-less Action
step are both gone).

### 4.1 Night Check-in Cover (dark shell)
nav close only, X `#FFFFFF`. Hero nightMoon T190. Stack top 452 gap 12 centred: caps "Day 13, about two
minutes" `rgba(255,255,255,0.55)`; h1 34/40 `#FFFFFF` "Night check-in.". Primary **white** bg `#FFFFFF`,
text `#111111` **"Begin"**. Copy: `Day 13 · two minutes` → `Day 13, about two minutes`; pill `Close the
day` → `Begin`.

### 4.2 Night 1 Mood (rail 1/8, light shell)
Same disc row + reading as Morning Feeling ("How was today?", "Mixed" / "Some of both"). Hero **bed
T506 S1.075** (rendered box −14.7,491.8,422.5,258). Primary "Continue". Change: the step is no longer a
"dark" step with WarmNightSky.

### 4.3 Checkin Emotions (rail 3/8)
Hero nightMoon **T506 S0.954** (box 9,514.7,374.9,229). Stack `top 136 gap 8`: h1 "What did today feel
like?"; p 15/22 `#9B968E` "Select all that apply.". grid2 at `top 232` (4 rows × 62, gap 12; boxes y 232,
306, 380, 454): Calm, Tense, Tired, Hopeful, Flat, Proud, Lonely, Restless — **frame selects Calm +
Tired**. nextFab. Change: the eight icon rows with tick discs → kit grid2 pills; the wide 58-tall
"Continue" pill → fab.

### 4.4 Checkin Reasons (rail 4/8)
Hero bubbles T506. h1 "What caused the feeling?" + p "Select all that apply."; grid2 at 232:
Relationship, Family, School / work, Money, Self-image, Loneliness, **Health**, None / unknown —
**frame selects School / work + Loneliness**. nextFab. Copy: `Health / wellbeing` → `Health` (stored
value changes too — OQ-N2). Icons/rows removed.

### 4.5 Night 3 Reflection (rail 5/8)
Hero notebook T506. Stack `top 136 gap 14`: h1 "Anything worth keeping?"; caps "Optional" (box 183);
6px spacer; text 22/400 lh34 `#F2F0EC` "Sam called at the right moment…" + 2×24 caret (box 24,233). No
card, no italic quote face. Primary **"Continue"** (was `Close the day`). Keep: the multiline
`TextInput` writing `reflection` (saved as a `Reflection` journal entry on finish); placeholder copy
stays "Sam called at the right moment…" (OQ-N3 for its colour).

### 4.6 Night 2 Record (rail 7/8)
h1 "Today’s record."; rows exactly as Morning 1 Yesterday (top 208): "Pledge kept", "One urge
surfed", **"0 slips"**, "Part IV finished" (no value column). Outline pill `top 470`, centred: h44 r22
ring `0 0 0 1.5px #2E2E2E`, padding 0 18, gap 8, 15/700 `#F2F0EC` nowrap: "+" (18px lh1) +
"Add to the record" (box 110.5,470,172.1,44). No hero. Primary "Continue". Keep: the pill →
`/urge-log`. Removed: JournalMark, white card, plates/glyphs.

### 4.7 Night Action Reminder (rail 8/8)
Stack `top 136 gap 14`: caps "Tonight’s action"; h1 "Prepare for tonight" (the day's lesson title —
new L1 title; was `cardTitle` "Surviving the night"); p 15/24 `#B5B0A8` task sentence ("Put the device
you use for porn out of reach before you sleep." — 2 lines). Hero charger **T458**. Primary **"Done"**
(bottom 96), ghost **"Skip tonight"** (bottom 60). Keep: Done → keep the action (written to tomorrow's
row), Skip → drop it; both → CLOSED. Removed: ActionTitle, ActionCard, NightActionArt, ActionButton.

### 4.8 Night 4 Closed (dark shell)
nav close only (white) — **add the close X**. Hero nightMoon T190. Stack `top 453 gap 12 centred`: h1
34/40 `#FFFFFF` "Day 13, closed."; p 16/400 lh25 `rgba(255,255,255,0.6)` "See you in the morning.".
White primary **"Done"** (was `Goodnight`). Keep: Done → `finish()`. Removed: NightSky band, DayBadge.

---

## 5. App screens/states in this area with no frame (still need the new look)

| screen/state | closest frame analog |
| --- | --- |
| Today loading (`LoadingView`) | Today Home ground + header skeleton or plain dark ground |
| Today p1 with no morning check-in today (chips have nothing to show) | Today Home chips row (OQ-T4) |
| Today p1 with delta 0 / negative | Today Home pill (hide at 0; down-arrow mirror for negative) |
| Today p1 young account (<30 days of history) / flat series | Today Home chart (OQ-T3) |
| Week strip: lapsed past day, pre-account day | Today Home future-day disc (OQ-T2) |
| Today p2 lesson undone / generic done; no lesson (day > 84); "Start the first lesson" | Today Home II / Task |
| Today p2 lesson tile when no lesson | Today Home II tile |
| Today p3 with no pledge yet | Today Home III (OQ-T5) |
| Today p3 in the morning (hero/"Tonight") | Today Home III |
| Score: 1Y range, dropdown menu open | Score Detail header pill + kit `sheet`/`listRows` (OQ-S1) |
| Score Moves: no slips (4 rows), several slips (`N slips`), negative net | Score Detail Moves |
| Score Ranks: top rank reached (no "to go"), Deckhand | Score Detail Ranks |
| Score loading | dark ground |
| Morning: "Not yet" selected; nothing selected (fab disabled?) | Morning Task Check (OQ-M1) |
| Morning ledger negatives: "No pledge signed", "No urges logged", "1 slip", "No lesson yesterday" | Morning 1 Yesterday rows (OQ-M2) |
| Morning day 1 (no yesterday) | Morning Task Check |
| Change Pledge Sheet with keyboard up | Change Pledge Sheet (risk R6) |
| Night Emotions/Reasons with nothing selected | Checkin Emotions / Reasons |
| Night Reflection empty (placeholder) / long text | Night 3 Reflection |
| Night Record negatives ("No pledge signed today", "No urges today", "No lesson today") | Night 2 Record |
| Night Action with no lesson (`nightAction(day)` fallback, title "Tonight") | Night Action Reminder |
| **`/checkin`** standalone check-in (`CheckinFlow` in `MoodLogger.tsx`: mood orb + slider, then the two boards, "Log it"), opened from the Log chooser's "Daily check-in" and `MoodLogger` modal | Night 1 Mood (step 0, disc row instead of orb/slider), Checkin Emotions, Checkin Reasons; nav = kit nav with rail |
| Today/Score/check-ins on 375×667 and 430×932 | see risks R1–R3 |

---

## 6. Shared files and requests to the orchestrator

- `src/components/StoicTabBar.tsx` + `src/app/(app)/_layout.tsx` (orchestrator-owned): the new five-item
  bar exactly as §0.6; Journey active on `/score`; remove `All`; `useTabBarHeight()` new value. **`/score`
  must show the tab bar** — either move `src/app/score.tsx` to `src/app/(app)/score.tsx` (URL stays
  `/score`; register `<Tabs.Screen name="score" />` hidden from the bar) or have the screen render the
  bar itself. Moving is cleaner; it needs a `_layout.tsx` line.
- `src/components/mono/*` (orchestrator's kit port) — needed here: Frame (light/dark shell + noise),
  Nav (back/close/noBack/dark, `step/total` → 8-dash rail), H1 (26/33 and 34/40 cover variant), P,
  Caps, Primary (+dark/white, bottom 48/96), Ghost (bottom 60), NextFab, Grid2 (multi-select), Card
  (r24 #1E1E1E, outline variant), IconCircle (42/44/52, ring or filled), Check / ChevronL / ChevronR /
  ChevronD / CloseX glyphs, Sheet (frame variant §0.7, not the kit's), **Hero** (all 53 illustrations
  by name, CSS-transform variant + the cropped variant of §0.5) — heroes are also needed by the
  lesson groups, so they must live in one shared module.
- `src/lib/theme.ts` — tokens above; nothing new beyond the kit palette + `#171717`, `#34322F`,
  `#5A5751`, `#8A857D`, `#BAB5AD`, `#45423E`, `#55524D`, `#3A3835`.
- `src/lib/score.ts` (shared with `weekly-report.tsx`, `log.tsx`, `(onboarding)/welcome.tsx`): move
  `scoreHistory()` + `monthLedger()` out of `score.tsx` so Today's 30-day chart and Score share them;
  additive only.
- `src/components/MoodLogger.tsx` (also behind `/checkin`, the Log chooser, `urge/index.tsx` only
  references it in a comment): `EmotionsBoard`/`ReasonsBoard` become grid2 boards; `REASONS` label
  `Health / wellbeing` → `Health`; `CheckinFlow` restyle. `PrimaryButton`/`checkinCtaTop` exported here
  are only used by `night.tsx` (lapse/slip/urge-log import a different `PrimaryButton` from
  `urge-log.tsx`).
- `src/components/day/kit.tsx` — `RerollGlyph` is imported by `src/app/affirmation.tsx`; keep that
  export (or move it) when the rest of the file is rewritten.
- Content: the new lesson titles/task sentences ("Prepare for tonight") come from the lessons group's
  curriculum data (`src/content/curriculum84.ts` today: `cardTitle` "Surviving the night"); Today p2
  and Night Action read `lesson.title` + the task sentence from wherever they land. Lesson → hero needs
  `gen/lesson-pool.json` (pool[0]) in the app's content.
- Recipes `.overhaul/recipes/today.json` and `day.json` need rewriting (§8).

---

## 7. Open questions / canvas contradictions

- **OQ-T1 (Today flame pill number).** The kit calls it `streak`, but `UserSettings.showStreak` says a
  streak is opt-in and never the hero (invariant #1). The frame's 41 equals the seed's day number.
  Recommended: day count (`Day N` moved into the pill), always shown. Alternative: clean-streak, shown
  only when `showStreak`.
- **OQ-T2 (week strip states).** What fills a past day: held (no lapse; the old HeldStrip rule) or
  "checked in"? What fills **today** (III fills it, Home/II/Task do not — and Task's task is done, so it
  is not task completion)? Recommended: past = held; today = night check-in logged (today's row has
  `emotions`/`reasons`, or a new flag). Lapsed/pre-account past days are not drawn — recommended: the
  future-day style (ring `#2E2E2E`, date `#9B968E`).
- **OQ-T3 (Today chart data).** Young accounts (<30 days) and flat series are not drawn. Recommended:
  pad the front with the first value; flat series → line at y 210.6 (bottom of the band).
- **OQ-T4 ("↑ 18").** The generator printed `↑18 last 30 days`; the frame dropped the words but kept the
  chart labelled "30 days ago → Today", so the designer's intent reads as the 30-day change. The app's
  existing semantics (and the seed) is **today's** contribution (`score.delta`). Recommended: keep
  `score.delta` (seed already reproduces 18); switching to the 30-day change needs a new seed.
- **OQ-T4b (mood chip swatch vs word).** The frame's chip says "Fine" with swatch `#BAB5AD`. In
  Today's vocabulary (`MOOD_WORD`) Fine is rung 3 of 5 (seed mood 3), but `#BAB5AD` is rung **4** of the
  check-in disc palette (`#34322F #5A5751 #8A857D #BAB5AD #F2F0EC`). Pick: (a) swatch = palette[rung],
  word = MOOD_WORD[rung] → frame state needs seed mood 4 and MOOD_WORD[3] = "Fine"; or (b) keep
  MOOD_WORD and use a chip palette shifted one rung lighter. Also: no frame says what the chips show
  before the morning check-in (recommend a single chip "Morning check-in" with the sunrise-less disc,
  or hide the section).
- **OQ-T5 (pledge buttons).** + / ☆ / share have no stated targets. Recommended: + → Change Pledge sheet
  (or `/journal-new` tagged Pledge), ☆ → `/(app)/journal` (saved pledges, the old card's door), share →
  `Share.share({ message: pledge })`. Empty state (no pledge) undrawn.
- **OQ-T6 (lesson tile).** "Lesson 5 / Naming your triggers" is not a lesson in the new 84 (lesson 5 is
  "Have another activity ready"); same D132 mock as before. Number = global lesson number (`lesson.day`,
  as the new course numbers 1–84) or index within the week? Recommended global.
- **OQ-T7 (Today III hero).** nightMoon is drawn at evening; is page 3's hero time-dependent (sunrise in
  the morning)? Recommended: static nightMoon (the section below it is "Tonight").
- **OQ-T8 (avatar).** Outline glyph only; should a profile photo (Sheet Profile Photo exists) fill the
  40 circle? Recommended yes when set.
- **OQ-T9 (flame pill tap).** No target drawn. Recommended: none, or `/score`.
- **OQ-S1 (Months dropdown).** Only the closed pill is drawn. Recommended options "Months" (= 3M) and
  "Year" (= 1Y) in a kit sheet/menu; label shows the current option; 1Y insight `+N points this year`.
- **OQ-S2 (Score chart scale).** The frame's marker sits at y 80, which on its own 1,000 (y 200)–1,400
  (y 60) axis reads ≈1,343, not the header's 1,240 — the drawn line is illustrative. Real data will not
  reproduce the frame's curve; recommended mapping `y = 200 − (v − bottom)/(top − bottom) × 140`,
  `x` from −5 (window start) to 372 (today), with the line continued to x 400 beyond the marker, labels
  from `niceScale()` (top/bottom only). Insight sub = long names of the first and last month labels
  ("May – July"), not of the window's first day (which is April for a 90-day window ending 18 Jul).
- **OQ-S3 (pages).** No pager dots or tabs on any of the three — horizontal swipe is the only way
  between them. Accept (frames win) or ask the designer for an affordance.
- **OQ-M1 (Task Check selection).** Is "Yes" pre-selected (frame) or nothing until tapped? Is the fab
  disabled until a choice? Recommended: no default, fab inert until chosen; recipe taps "Yes".
- **OQ-M2 (ledger negatives).** All rows draw the filled check. A false row ("No pledge signed", "No
  urges logged", "1 slip", "No lesson yesterday") is undrawn — recommended: 22 disc as a `#2E2E2E`
  ring with no check.
- **OQ-M3 (mood disc selected ring).** Only rung 2 is drawn selected. Does a selected rung 0/1 keep its
  inset `#45423E` ring under the 4/6 double ring? Recommended: drop the inset when selected.
- **OQ-M4 (clearing a signature).** The old plate's clear-× is not drawn. Recommended: tapping the
  signed line un-signs (keeps the function, draws nothing new).
- **OQ-M5 (Resign card height).** The signature line is content-box (12 + 44 + 8 + 1.5 = 65.5 → measured
  65); RN needs `height 65.5` with `paddingTop 12, paddingBottom 8, borderBottomWidth 1.5`.
- **OQ-N1 (step counters).** Night rail uses 6 steps over 8 dashes, morning 5 over 8 — confirmed formula
  above; no contradiction, but the old app's 6-dot rails must not be reused.
- **OQ-N2 (`Health / wellbeing` → `Health`).** The label is also the stored value in `reasons[]`; old
  rows hold the long string. Map old → new when reading (Log Check-ins / weekly report may display it).
- **OQ-N3 (Reflection placeholder).** The frame draws the sentence in full ink with a caret (typed
  state). Placeholder colour for the empty state is not drawn — recommended `#5A574F` or `#9B968E`;
  the recipe should type the sentence to reach the frame's state.
- **OQ-N4 (Night Action title source).** "Prepare for tonight" (new L1 title) on a "Day 13" flow — same
  shape as the previous run's day-1 seed requirement; title/sentence come from the new lesson data.
- **OQ-X1 (Today/Score dates).** Today draws Fr 18 as today; Score draws Jul as the current month and a
  slip on Jul 8 → both frames read as Friday 18 July (2025). Week strip, greeting, month labels and
  "May – July" can only match with a frozen clock (§8).

## 8. Reaching each frame (recipe notes for the next phase)

All Today/Score frames need a **frozen clock** (new init script, loaded before the seed so the seed's
`new Date()` rebases on it): Friday 18 July 2025, 09:00 local for Today Home / II / Task / Score ×3;
20:00 for Today Home III. Then `.overhaul/today-seed.js` (day 41, 1,240, Navigator II, delta 18, mood 3
/ energy 2 today, `Pledge` "The mornings are mine again.", name Jerry; slip on Jul 8 must be a lapse
event on that date). Today pages: scroll the vertical pager to `pageH` (548 at 852) for p2 and `2 ×
pageH` for p3. Today Home II (generic register, undone, phone sentence, nightPhone hero) is reachable
with a named `dailyAction` "Put your phone somewhere hard to reach before you sleep." if the generic
register's hero is the phone step's `nightPhone`, or at day 86 via DAY_STEPS[0] (then the flame reads
86 — the old D132-style compromise). Today Home Task = day-1 lesson task done (`dailyActionDone` or
the lesson task completion), but the flame then reads 1 — the frame's own composition (41 + lesson-1
task) is not reachable; document as before. Today III: add a night check-in row for today (if OQ-T2's
rule is taken). Score Moves/Ranks: `scrollLeft = W` / `2W` on the horizontal pager.

Check-ins: `.overhaul/day-seed.js` (day 13, Jerry, yesterday's action "Write down each trigger…",
Part III yesterday / Part IV today, pledges both days); Night Action needs `.overhaul/vday-seed-d1.js`.
New taps: cover pill is now **"Begin"** on both flows (was "Begin day 13" / "Close the day"); Task Check
= tap "Yes" then the fab (give it `accessibilityLabel="Next"`); Feeling/Energy/Yesterday "Continue";
Pledge "Sign for today" → "Confirm"; Emotions = tap **Calm + Tired** then Next; Reasons = **School /
work + Loneliness** then Next; Reflection = type the sentence, "Continue"; Record "Continue"; Action
"Done"; Closed "Done". Change Pledge Sheet = open via "Change the pledge" and set the field to "Phone
stays out of the bedroom" (`.overhaul/fday-sheet.js` needs the new selectors).

## 9. Risks

- **R1 Short screens (375×667).** Top-anchored heroes (T506/T458) collide with bottom-anchored
  primaries/fabs (667−48−58 = 561); Today's 548-tall pages get 363 of viewport; Score Moves' card
  (to 647) sits under the tab bar (563). Needs a rule: heroes anchored to the CTA (keep the frame's gap)
  or dropped when they would overlap content; Today pages keep 548 and scroll freely (snap only when the
  viewport fits); Score pages scroll vertically inside the horizontal pager.
- **R2 Wide screens (430).** Every hero/svg is `left:0 width:393` in the frame — centre it, and stretch
  only what the frame stretches (kit rows use left/right 24).
- **R3 Today chart width.** 345 at 393 → `W − 48`; x positions must scale (`x_i = i × (W−64)/29`, marker
  at `W−64`, labels at 0 and `W−48`).
- **R4 Dashed borders.** RN cannot dash a single side (`border-bottom … dashed` on the signature line,
  `border-left 2px dashed` on the rank connectors) and Chrome's dash rhythm is its own — draw them as
  SVG lines with a dasharray tuned by pxdiff (Chrome dashes ≈ 3× thickness, auto-fitted).
- **R5 SVG traps.** Every hero/chart `<Svg>` sits beside absolutely positioned siblings → must carry
  `position:absolute; top; left` (web invisibility). Hero `transform:scale` → `<G>` transform, not
  `<Svg>` props. Charts use `<text>` → set `fontFamily` (Lato_700Bold for the 600s).
- **R6 Keyboard.** Change Pledge Sheet's buttons are frame-bottom anchored (96/60); with the keyboard
  up they are covered. The frame is keyboard-down; add keyboard avoidance without moving the
  keyboard-down state.
- **R7 Outside rings.** `box-shadow: 0 0 0 1.5px` rings (grid2, avatar, week strip, chips, rank discs,
  pledge buttons) must be outside the box (RN `boxShadow` spread), never a border.
- **R8 Lato 900 / 700 italic.** Rank "Navigator" (900) and the two italic names need `Lato_900Black` /
  `Lato_700Bold_Italic` (both loaded in `src/app/_layout.tsx`); never `fontWeight`.
- **R9 Data contract changes.** `Health / wellbeing` → `Health` changes stored values; Today's 30-day
  history moves into `src/lib/score.ts` (shared by four screens).
- **R10 The `/score` move into the tab group** changes the back stack (Back from Score inside tabs);
  keep `router.back()` with the `/today` fallback.
