# Library — the twelve week pages (92A–92L2) · analysis for the overhaul

Group `library`, 24 frames from the `Email-Login` bundle. Read-only analysis. Every number is from the
frame's own inline CSS (`node scripts/overhaul/body.mjs …`) or measured in the design server
(`localhost:8097`, Lato loaded, `document.fonts.check('700 15px Lato') === true` on all 24). The
measuring scripts are kept in `.overhaul/understand/scratch-library/` (`summarize.mjs`, `measure.mjs`,
`breaks.mjs`, `tabbar.mjs`, `heroes.mjs`, `titles.mjs`, `wrapscan.mjs`), so anyone can re-run them.

---

## 0 · The short version

1. **All 24 frames use one template.** Back chevron, a full-bleed monochrome **hero illustration**, a
   centred caps/h1/p header at canvas 338, a column of 58pt dark lesson rows at canvas 472, and the
   **new five-slot tab bar with `Library` active**. Nothing of the current light board survives: no
   WeekScene landscape, no pips, no closing land, no white cards, no lock glyph, no right-hand number.
2. **P1 / P2 are one screen.** The header and hero do not move between `Week N` and `Week N P2`; P1
   shows lessons 1–4 and P2 shows lessons 5–7, both starting at canvas 472. Reproduce it as a
   **rows viewport 264pt tall (canvas 472 → 736) scrolled 0 / 264** (§3.6). At scroll 0, row 5
   starts exactly at the viewport's foot, so nothing shows under the transparent tab bar, which is
   what the P1 frames draw.
3. **The frames are drawn for day 38** (current lesson 38, Week VI). Weeks I–V are all done, Week VI has
   36–37 done, 38 current (`Continue`) and 39–42 upcoming, and Weeks VII–XII are all upcoming. The
   seed is in `scratch-library/library-seed.js`.
4. **Every one of the 84 lesson titles changed.** The week rows read exactly the same as the new
   lesson covers (`L<n> Frame 1`); all 84 match (§6). Week names and blurbs are unchanged.
   `src/content/curriculum84.ts` is generated, so its generator must be forked and repointed. Many
   other screens read these titles.
5. **The week heroes come from `Lesson-Illustrations-v4`.** Each of the 12 week heroes matches one
   illustration card's current art exactly, element for element (`data-hero` on the frame names it).
   So do **all 84 lesson covers**, every illustrated lesson-reader frame, and about 110 other
   Email-Login frames (onboarding, SOS, slip, check-ins and others). The bundle is the app's single
   spot-illustration set and needs **one shared, generated hero module** (§7). This is a request to
   the orchestrator, not something to build in the library.
6. **Two traps in the art:** `paint-order="stroke"` is used in 22 illustrations, including the
   Week V and Week VIII heroes. `body.mjs` does not print it and react-native-svg does not support
   it (§7.4). The `Before` thumbnail inside every illustration card is the *old* art and must be
   ignored.
7. **Navigation gap:** the canvas draws no Library index, only these week pages, each with a back
   chevron *and* the tab bar. A recommendation for what the Library tab shows is in §9 (open
   question Q1).

---

## 1 · Sources

| what | where |
| --- | --- |
| split frames | `.overhaul/final/Email-Login/Week-{I…XII}-<Name>.html` and `…-P2.html` |
| design PNGs (393×852 @2x) | `.overhaul/shots/design/Email-Login/<same>.png` |
| frame → hero id | the hero `<svg>` carries `data-hero="nightPhone"` etc. (body.mjs drops this attribute) |
| illustration cards | `.overhaul/final/Lesson-Illustrations-v4/<Name>.html` (53), PNGs in `.overhaul/shots/design/Lesson-Illustrations-v4/` |
| designer's generator | `Vici Overhaul/project/gen/mono-core.js` lines 167–201 (`weekCover`, `lessonRow`, `W`, `L`). **Stale:** it still has the old lesson titles, `CURRENT = 38`, a `CONTINUE` caps label with tracking, white check, and `stack(316)` / `466/484` tops. Where it disagrees with the frames, the frames win (titles, `Continue`, `#111111` check, 338/472). |
| canvas flow notes | `92A · Week I — Reset · i` … `92L2 · Week XII — Leave It Behind · ii`, under the section sticky `LIBRARY — THE 12-WEEK COURSE`. There are no other annotations. |
| previous drop's frames | `specs/72-week-i-reset.md` … `specs/95-week-xii-p2.md` (light paper, no tab bar). These are for comparison only. |

The twelve weeks (unchanged from the current `curriculum84.ts`):

| # | caps | h1 (name) | p (blurb) | `data-hero` | lessons |
|---|---|---|---|---|---|
| 1 | Week I | Reset | Survive the nights and steady the basics. | nightPhone | 1–7 |
| 2 | Week II | Changing Your Mindset | Streaks, relapses, and how you talk to yourself. | signpost | 8–14 |
| 3 | Week III | In the Moment | What to do in the sixty seconds that matter. | lighthouse | 15–21 |
| 4 | Week IV | Know Your Brain | The machinery behind the pull. | brain | 22–28 |
| 5 | Week V | Why It Feels Worth It | The honest math of what it gives and takes. | scale | 29–35 |
| 6 | Week VI | Discipline | Training the response you want on hard nights. | flag | 36–42 |
| 7 | Week VII | Relapse and Adversity | Falling without unraveling. | sunrise | 43–49 |
| 8 | Week VIII | Boredom and Meaning | Empty hours, and what fills them well. | hourglass | 50–56 |
| 9 | Week IX | Connection | The people side of recovery. | twoCups | 57–63 |
| 10 | Week X | Yourself | Repairing how you see and treat yourself. | mirror | 64–70 |
| 11 | Week XI | Build a Life You Want | Point the freed-up energy at something. | mountain | 71–77 |
| 12 | Week XII | Leave It Behind | Make it permanent, then let it go. | door | 78–84 |

---

## 2 · Where the app draws this today

| piece | file | what it does now |
| --- | --- | --- |
| pushed week page | `src/app/week/[week].tsx` (`WeekOverview`) | Stack route outside `(app)`, so **no tab bar**. Light `#F4F3F0` ground with `noise-dark.png` at 0.07. Chevron at left 16/top 10 (`#55534E`, 11×19). `WeekHeading` at canvas 114/158. `WeekScene` band at canvas 214 (258 tall). A rows `ScrollView` from canvas 484 to the bottom, `paddingBottom: 150`, P2 = scrolled 320. `ClosingLand` at the foot. Row tap → `router.push('/lesson-card/<day>')`. Back → `router.back()` or `replace('/(app)/library')`. |
| Library tab | `src/app/(app)/library.tsx` | A `FlatList` of all 12 `WeekBoard`s stacked vertically, each at its natural height (`weekBoardHeight(7)`), no chevron, no closing land, `WEEK_GAP` 160 between weeks. Same row tap. |
| board pieces | `src/components/library/WeekBoard.tsx` | `WeekHeading`, `LessonRow` (white 56pt card, 30pt state disc: check / moon / lock, title 15.5/500, number 12.5 at the right), `Pips`, `LessonRows`, `ClosingLand`, `WeekBoard`, `rowStateFor`. |
| scene art | `src/components/journey/WeekScene.tsx` + `src/content/weekScenes.ts` (GENERATED by `scripts/vicifull/gen-week-scenes.mjs`) | The old paper landscapes. **Used only by the two library files above** (grep confirmed), so they can be deleted once the hero replaces them. |
| content | `src/content/curriculum84.ts` (GENERATED by `scripts/vicifull/gen-curriculum.mjs`, reading the previous drop) | `CURRICULUM_84[week].{n, roman, name, blurb, lessons[].{day, week, title, titleSize, summary, task}}`. |
| day reckoning | both routes | `day = floor((now − user.createdAt)/86.4e6) + 1`, read once on mount. `rowStateFor`: `lesson.day < day` → done, `=== day` → current, else locked. Lesson-completion records (`completeLesson`) are **not** consulted. |
| tab bar | `src/components/StoicTabBar.tsx` (orchestrator) | The old 3 + `All` white bar. The library tab is active on `/library`, `/rough-days`, `/dashboard` and `/lesson*`. **It does not include `/week/*`.** |
| entry points | `src/app/(app)/all.tsx` (`'/(app)/library'`, `'/week/1'`). `lessons-browser.tsx`, `search.tsx` and `(app)/locked.tsx` fall back to `/(app)/library`. | |

**Baseline capture (pre-overhaul).** With
`node scripts/overhaul/shot.mjs app /week/6 … --initseed=.overhaul/understand/scratch-library/library-seed.js --wait=2500`
the old light board renders. It has 36 and 37 checked, 38 current (moon disc, black ring) and 39
locked, which confirms that the seed lands on day 38. Recipes for all 24 frames are written to
`.overhaul/recipes/library.json`.

---

## 3 · What the new frame draws (common to all 24)

Kit vocabulary from `Vici Overhaul/project/gen/mono-kit.js`: `frame` (ground + noise), `chevronL`,
`caps`, `h1` (size 30/lh 36 here), `p` (15/22 here), `check`, `chevronR`, `tabBar('Library')`, and a
bespoke `lessonRow` (`mono-core.js`). Canvas y values include the 54pt status bar. App y is
canvas − 54 under the safe area; the mock web build injects `top: 54`, so captures compare 1:1.

### 3.1 Root
* `393×852`, `background:#0D0D0D` (= `mono.ground`), Lato.
* Noise: `position:absolute; inset:0; background-image:url('noise.png'); opacity:0.05` — **`noise.png`
  at 0.05**, not `noise-dark.png` at 0.06. The lesson readers use `noise-dark.png` at 0.06. Both
  assets already exist in `assets/images/` and are byte-identical to the bundle's (md5 checked).
* StatusBar style must become `light` (it is `dark` today).

### 3.2 Back chevron — kit `chevronL()`
* Box `position:absolute; left:22; top:60; height:40; display:flex; align-items:center; z-index:5`.
* `<svg viewBox="0 0 12 20" width=12 height=20>` `<path d="M10 2L2 10l8 8" fill=none stroke=#F2F0EC
  stroke-width=2.2 linecap/linejoin round>`. The measured glyph is at **22,70 12×20**.
* App: left 22, top 6 (60−54), box height 40. Keep it as the pressable with generous `hitSlop`. It
  sits above the hero (z 5). The Week III lighthouse beam and stars pass right by it.

### 3.3 Hero — illustration from `Lesson-Illustrations-v4`
```
<svg viewBox="0 0 393 240" width=393 height=240 data-hero="<id>"
     style="position:absolute; left:0; top:<T>px; overflow:visible; transform:scale(1.1); transform-origin:196px 190px">
  …the illustration card's current art, verbatim…
```
* The mapping is **user point (x,y) → frame point (1.1·x − 19.6, T + 1.1·y − 19)**, i.e.
  `matrix(1.1 0 0 1.1 −19.6 T−19)`. The scaled box measures `−19.6, T−19, 432.3×264`. The art
  overflows the 393 frame on both sides for the full-bleed heroes (Week VI flag art measured at
  x −63.6…456.7, y 129.9…290.8). The frame clips at 0/393 (root `overflow:hidden`).
* **Per-week `top` (T), stated by the frame:**

  | week | hero | T canvas | T app (−54) | illustration's bounds bottom (`gen/hero-bounds.json`) |
  |---|---|---|---|---|
  | I | nightPhone | 80 | 26 | 210 |
  | II | signpost | 98.9 | 44.9 | 192.8 |
  | III | lighthouse | 63.9 | 9.9 | 224.6 |
  | IV | brain | 114.4 | 60.4 | 178.7 |
  | V | scale | 80 | 26 | 210 |
  | VI | flag | 98.9 | 44.9 | 192.8 |
  | VII | sunrise | 98.9 | 44.9 | 192.8 |
  | VIII | hourglass | 80 | 26 | 210 |
  | IX | twoCups | 80 | 26 | 210 |
  | X | mirror | 80 | 26 | 210 |
  | XI | mountain | 98.9 | 44.9 | 192.8 |
  | XII | door | 88.8 | 34.8 | 202 |

  The rule behind them: **T = 102 − 1.1·(bottom − 190)**. Every week stands its art on canvas
  y 292 (`T + 190 + 1.1·(bottom − 190) = 292`), and all 12 check out to 0.05pt. Transcribe the
  stated T values. The rule is only there to show they are not arbitrary.
* **RN translation.** Do not use CSS transform on `<Svg>`. Use an `<Svg>` covering the full screen
  width, with an inner `<G transform="matrix(1.1 0 0 1.1 -19.6 -19)">`, or the equivalent
  `translate(196 190) scale(1.1) translate(-196 -190)`. Give it vertical padding so nothing clips
  on native: art bounds put the scaled art inside T+1.9…T+232.9, but strokes and stars poke out.
  Something like `top: T−54−20, height: 280, viewBox="${-(W−393)/2} −20 ${W} 280"` keeps the art
  centred on wider phones and lets the full-bleed scenes reach the screen edges. The `<Svg>` sits
  next to absolutely positioned siblings, so it **must** carry
  `style={{position:'absolute', top:…, left:0}}` (brief, SVG trap 1).
* The art body: see §7. It is identical to the card's art (verified by exact element-by-element
  match, all 24 frames). Some week heroes carry their own inner `<g transform>`: nightPhone
  `translate(-6 0)`, door `translate(-14 0)`, brain `translate(0 20)` ×2, plus `fill`/`stroke`
  inherited from `<g>` in brain, flag and signpost. These must be kept.
* **Week V (scale) has 3 elements and Week VIII (hourglass) has 1 element with
  `paint-order="stroke"`**. See §7.4.

### 3.4 Header — kit `stack(338, [caps, h1, p], {center, gap:8})`
Box: `position:absolute; left:24; right:24; top:338; display:flex; column; gap:8; align-items:center;
text-align:center`.

| element | CSS | measured box (canvas) | app |
|---|---|---|---|
| caps `Week VI` | 13px / 700 / `#9B968E` / `white-space:nowrap` / line-height normal | 24,**338**,345×**16** | `sans('700')`, 13, `lineHeight: 16` (Chrome's normal for Lato 13 = 13+3), `mono.mute` |
| h1 name | 30px / 700 / ls −0.6 / lh 36 / `#F2F0EC` / `text-wrap:balance` | 24,**362**,345×36 | 30/36, `letterSpacing: -0.6`, `mono.ink` |
| p blurb | 15px / 400 / lh 22 / `#B5B0A8` / `text-wrap:pretty` | 24,**406**,345×22 | 15/22, `mono.sub` |

All 12 names and blurbs set on one line at 393 and at 375 (327 measure). The caps label is
**`Week <roman>`** alone. The old app wrote `Week VI · Training the response…` as one left-aligned
grey line under a left-aligned 27/600 name. Header text is centred now.

### 3.5 Lesson rows
Column: `position:absolute; left:16; right:16; top:472; display:flex; column; gap:20` wrapping one
child `display:flex; column; gap:8` (the 20 gap is inert, there is only one child). So rows sit at
**472, 538, 604, 670** (58 + 8 pitch = 66), width 361.

Row (all states): `height:58; border-radius:18; display:flex; align-items:center; gap:16; padding:0 18;
box-sizing:border-box`. Lead cell `width:28; display:flex; justify-content:center`. Title
`<span> flex:1; font-size:15; font-weight:700` with **no line-height and no text-wrap** (CSS normal
gives 18 per line, greedy wrap: set `lineHeight: 18` and `textWrap: 'auto'` on web, because AppText
defaults to `pretty`). Trailing element last.

| state | when (day 38) | row bg | lead | title colour | trailing |
|---|---|---|---|---|---|
| **done** | `lesson.day < day` (1–37) | `#1E1E1E` | 24×24 disc `border-radius:12; background:#F2F0EC`, centred, with kit `check`: `<svg 0 0 14 14 w12 h12><path d="M2 7.5l3.2 3L12 3.5" stroke=#111111 sw 2.2 round>` | `#F2F0EC` | `chevronR`: `<svg 0 0 14 14 w14 h14><path d="M5 2l5 5-5 5" stroke=#9B968E sw 2 round>` |
| **current** | `=== day` (38) | **`#F2F0EC`** | number `38`: 14 / 700 / `rgba(17,17,17,0.6)` | **`#111111`** | `Continue`: 13 / 700 / `#111111` (title case, **no** tracking. The generator's `CONTINUE` / 12px / 1.5 tracking / white is stale.) |
| **upcoming** | `> day` (39–84) | `#1E1E1E` | number: 14 / 700 / `#9B968E`, no letter-spacing | `#F2F0EC` | `chevronR` stroke **`#5A574F`** (`mono.art`) |

Measured geometry (row at y0 = 472, add 66 per row):
* done disc 36,489 24×24. Check glyph 42,495 12×12.
* number span centred in the lead cell: 39.88,492.5 16.25×17 (`lineHeight: 17` = 14+3).
* title 78,492 251×18 (one line) or 78,483 251×36 (two lines). The title starts at x 78.
* chevron 345,494 14×14.
* `Continue` 305.22,625 53.78×16 (`lineHeight: 16`). With it, the current row's title shrinks to 211.22.

There is no row shadow, ring, divider or pip anywhere.

**Two-line titles at 393 (exact breaks measured):**

| lesson | frame | line 1 | line 2 |
|---|---|---|---|
| 19 | III P2 row 1 | `Check hunger, anger, loneliness, and` | `tiredness` |
| 21 | III P2 row 3 | `Make a separate choice about` | `masturbation` |
| 27 | IV P2 row 2 | `Try movement, breathing, or another` | `room` |
| 33 | V P2 row 1 | `Make time for what viewing` | `displaced` |
| 36 | VI row 1 | `Prepare a simpler response when` | `tired` |
| 50 | VIII row 1 | `Give an activity time before` | `switching` |
| 60 | IX row 4 | `Separate desire from wanting` | `company` |
| 64 | X row 1 | `Choose support without revisiting` | `painful events` |
| 77 | XI P2 row 3 | `Schedule something you want to` | `keep doing` |

These are greedy breaks at 251pt and fall out naturally. No `\n` is needed. Scan
(`wrapscan.mjs`): no title needs three lines at 251, 233 (a 375pt phone), 211.22 (current row) or
193.2 (current row at 375). The fixed 58pt height is safe on every supported width.

### 3.6 P1 and P2 — one rows viewport
* P1 rows 1–4: 472/538/604/670, last bottom 728. P2 rows 5–7: 472/538/604, last bottom 662.
  The hero, header, chevron and tab bar are identical between the pair (diffed).
* In the natural 7-row column, row 5 sits at 736, so P2 is the column **scrolled by 264**.
* Build it as a vertical `ScrollView` at canvas **472** (app 418), **height 264** (it clips at
  canvas 736, 12pt above the tab bar's 748), content = 7 rows with gap 8 (454) plus
  **`paddingBottom: 74`** (max scroll = 454 + 74 − 264 = **264**). Scroll 0 = P1 exactly (row 5's
  top edge sits on the clip, so nothing leaks). Scroll end = P2 exactly. Optionally
  `snapToOffsets={[0, 264]}`. `pagingEnabled` would also work because the viewport is 264.
* The previous app used a scroller to the screen foot with 150 bottom padding and a closing band.
  Under a **transparent** tab bar (the new bar has no background, §3.7) that would show row 5
  through the bar on P1. Do not copy it.
* `shot.mjs --scroll=end` finds this scroller (the only vertical scroller taller than 100), so the
  P2 recipe is the same route with `--scroll=end`.

### 3.7 Tab bar — kit `tabBar('Library')` (orchestrator-owned component)
Container `position:absolute; left:0; right:0; bottom:0; height:104; display:flex;
align-items:flex-start; justify-content:space-between; padding:14px 14px 0; z-index:8`, **no
background**. Measured: bar 0,748 393×104.

| slot | box | icon | label |
|---|---|---|---|
| Today | 14,762 72×43 | 26×26 at 37,762, home path, stroke `#9B968E` 1.8 | `Today` 11.5/400 `#9B968E` at 35.03,792 (h 13) |
| Log | 90.25,762 72×43 | rect 16×19 r3 + 3 lines, `#9B968E` | `Log` 400 `#9B968E` |
| SOS | 166.5,756 60×60, r 30, `#F2F0EC`, `margin-top:-6` | — | `SOS` 13/700 `#111111` at 184.33,778 (h 16) |
| **Library** | 230.75,762 72×43 | open-book path, stroke **`#F2F0EC`** | `Library` **11.5/700 `#F2F0EC`** at 248.23,792 |
| Journey | 307,762 72×43 | circle r6.5 + ribbon, `#9B968E` | `Journey` 400 `#9B968E` |

Icon paths are verbatim in `scratch-library/Week-I-Reset.txt`. Label line box = 13
(`lineHeight: 13`), icon–label gap 4.

---

## 4 · Per-frame inventory

State for every frame: the day-38 seed. "P2" = the same route with the rows scroller at its end
(264). Hero, header and tab bar are §3 with the week's values from §1/§3.3. Two-line rows are
marked ².

| frame | route / state | rows drawn (state) |
|---|---|---|
| Week-I-Reset | `/week/1`, scroll 0 | 01 Prepare for tonight ✓ · 02 Remove easy access to porn ✓ · 03 Choose where to go instead ✓ · 04 Prepare for sleep ✓ |
| Week-I-Reset-P2 | `/week/1`, rows end | 05 Have another activity ready ✓ · 06 Make time for contact ✓ · 07 Review the first week ✓ |
| Week-II-Changing-Your-Mindset | `/week/2`, 0 | 08 Measure more than a streak ✓ · 09 Stop sooner after a slip ✓ · 10 Use the hours that remain ✓ · 11 Try one change for a week ✓ |
| Week-II-…-P2 | `/week/2`, end | 12 Repeat one useful action ✓ · 13 Choose your own reason ✓ · 14 Return after a missed day ✓ |
| Week-III-In-the-Moment | `/week/3`, 0 | 15 What to do when an urge starts ✓ · 16 Check what you need ✓ · 17 Close the screen and move ✓ · 18 Prepare another activity ✓ |
| Week-III-…-P2 | `/week/3`, end | 19 Check hunger, anger, loneliness, and tiredness ✓² · 20 Notice an urge without acting on it ✓ · 21 Make a separate choice about masturbation ✓² |
| Week-IV-Know-Your-Brain | `/week/4`, 0 | 22 Understand what starts the habit ✓ · 23 Decide before the difficult hour ✓ · 24 Make room for food and sleep ✓ · 25 Respond to anger and loneliness ✓ |
| Week-IV-…-P2 | `/week/4`, end | 26 Notice when searching keeps going ✓ · 27 Try movement, breathing, or another room ✓² · 28 Act earlier in the habit ✓ |
| Week-V-Why-It-Feels-Worth-It | `/week/5`, 0 | 29 Look at the benefit and cost ✓ · 30 Meet the need you can identify ✓ · 31 Begin a task you are avoiding ✓ · 32 Address one immediate cost ✓ |
| Week-V-…-P2 | `/week/5`, end | 33 Make time for what viewing displaced ✓² · 34 Make one change for tonight ✓ · 35 Give an activity a place in the week ✓ |
| Week-VI-Discipline | `/week/6`, 0 | 36 Prepare a simpler response when tired ✓² · 37 Practise the response ✓ · **38 Keep rules that serve a purpose — current, `Continue`** · 39 Practise the part that gets in the way (upcoming) |
| Week-VI-…-P2 | `/week/6`, end | 40 Let a thought remain while you act · 41 Give the action a time and place · 42 Plan for a difficult day (all upcoming) |
| Week-VII-Relapse-and-Adversity | `/week/7`, 0 | 43 Learn from a slip · 44 Take care and make a repair · 45 Adjust the plan for today · 46 Get support during a difficult period (upcoming) |
| Week-VII-…-P2 | `/week/7`, end | 47 Return to the task you postponed · 48 Begin the next part of the day · 49 Take a step after a longer setback |
| Week-VIII-Boredom-and-Meaning | `/week/8`, 0 | 50 Give an activity time before switching² · 51 Choose what begins in an empty gap · 52 Try fifteen minutes without switching · 53 Change one screen habit |
| Week-VIII-…-P2 | `/week/8`, end | 54 Try an hour away from one feed · 55 Prepare the first hour after waking · 56 Give time to something that matters |
| Week-IX-Connection | `/week/9`, 0 | 57 Arrange a shared activity · 58 Choose contact that fits · 59 Choose how to spend time alone · 60 Separate desire from wanting company² |
| Week-IX-…-P2 | `/week/9`, end | 61 Follow up on a connection · 62 Set a safe limit on harmful contact · 63 Give a relationship attention |
| Week-X-Yourself | `/week/10`, 0 | 64 Choose support without revisiting painful events² · 65 Change one difficult setting · 66 Describe a mistake without an insult · 67 When you feel bad about yourself |
| Week-X-…-P2 | `/week/10`, end | 68 Check your response to self-criticism · 69 Keep one manageable commitment · 70 Simplify the plan |
| Week-XI-Build-a-Life-You-Want | `/week/11`, 0 | 71 Use what your notes show · 72 Choose what you can do now · 73 Reserve time for what matters · 74 Begin an activity you postponed |
| Week-XI-…-P2 | `/week/11`, end | 75 Plan the next ninety days · 76 Give one activity your attention · 77 Schedule something you want to keep doing² |
| Week-XII-Leave-It-Behind | `/week/12`, 0 | 78 Keep the reason and next action clear · 79 Compare the start with now · 80 Prepare for a changed situation · 81 Use the changes that helped |
| Week-XII-…-P2 | `/week/12`, end | 82 Check how to ask for help · 83 Finish with an honest next step · 84 Save a short plan for after the course |

---

## 5 · What must change in the app

**Structure (`week/[week].tsx`, `components/library/*`):**
1. Ground `#F4F3F0` + `noise-dark` 0.07 becomes `#0D0D0D` + `noise.png` 0.05. StatusBar becomes `light`.
2. Chevron: left 16/top 10, 11×19, `#55534E`, 2.4 becomes left 22/top 6 (box 40 tall),
   12×20 `M10 2L2 10l8 8`, `#F2F0EC`, 2.2.
3. Remove `WeekHeading` (left-aligned 27/600 name at 60, `Week N · blurb` at 104). Add the centred
   caps/h1/p stack at app top 284 (§3.4).
4. Remove the `WeekScene` band (app 160–418, gradient landscapes). Add the hero `<Svg>` (§3.3)
   **above** the header, at app T−54. Delete `components/journey/WeekScene.tsx`,
   `content/weekScenes.ts` and stop using `scripts/vicifull/gen-week-scenes.mjs` (no other consumers).
5. Rows: the white 56pt r14 card on an 80 pitch with pips, 30pt disc and right-hand number becomes
   a dark 58pt r18 card on a 66 pitch (gap 8), with a 28pt lead cell (check disc **or** number), a
   15/700 title and a chevron/`Continue` trailing element. Delete `Pips`, `ClosingLand`,
   `ROW_PITCH`/`WEEK_GAP` logic, the moon glyph and the lock glyph.
6. States: `locked` becomes **upcoming**, drawn as number + dim chevron. There is no lock and the
   row is not greyed: the title stays `#F2F0EC`. Current: inverted card (`#F2F0EC` bg, `#111111`
   text, number at 60% ink), `Continue` instead of a chevron, and no ring or shadow.
7. Rows scroller: app top 418, height 264, `paddingBottom: 74` (§3.6), replacing top 430/bottom 0/
   `paddingBottom: 150`.
8. **Add the tab bar with `Library` active.** See §9 for how the week page gets it.
9. `accessibilityLabel` for the row: `"<title>, lesson <nn>, completed|today|upcoming"`. The current
   row's `Continue` is part of the same pressable (no separate control).

**Copy:** week caps/name/blurb unchanged, but split (`Week VI` / `Discipline` / blurb). **All 84
lesson titles change** (§6). New strings: `Continue`.

**Not drawn by the frame, keep and style:** the row press opens the lesson for **every** state.
Today the app does not gate future lessons on the board (it pushes `/lesson-card/<day>` for locked
rows too), and the new frame gives upcoming rows a chevron. So keep every row tappable. The target
route belongs to the lesson group (`/lesson-card/[day]` today; the new reader's Frame 1 *is* the
cover with `Begin`, so the lesson group may retire the card route). Use whatever they land, through
one helper.

---

## 6 · Content: the lesson titles (shared data change)

All 84 week-row titles equal the new lesson-cover titles (`L<n> Frame 1`: `Lesson <n>` / title /
`Begin`), 84 of 84. **Every old title differs** (e.g. 1 `Surviving the Night` → `Prepare for tonight`,
38 `What Discipline Isn’t` → `Keep rules that serve a purpose`). The new titles are sentence case
and contain no curly quotes. The full old → new list, with heroes, is in the appendix (§A).

* `src/content/curriculum84.ts` is GENERATED (`scripts/vicifull/gen-curriculum.mjs`, which reads
  `.vicifull/…` and `Latest Vici FULL/project/task-src.json`). It needs a fork at
  `scripts/overhaul/gen-curriculum.mjs` that reads week name/blurb and lesson titles from
  `.overhaul/final/Email-Login/Week-*.html` (or the `L<n>-Frame-1.html` covers, which agree). The
  new bundle has its own `Vici Overhaul/project/task-src.json` for the task fields. `titleSize` and
  `summary` describe the old lesson card, which the new covers do not draw (no summary line, one
  size 30/36). Whether to keep them is the lesson group's call. `search.tsx` matches on `summary`.
* **Consumers of `lesson.title`** (they all change wording automatically): `(app)/today.tsx`,
  `day/night.tsx`, `task/[day].tsx`, `lesson-card/[day].tsx`, `lessons-browser.tsx`, `search.tsx`,
  `profile.tsx`, `first-steps.tsx`, `(app)/locked.tsx`, `lib/curriculum.ts` (slug index used by
  progress/backend), `lib/backend/convex.ts`. Slugs are `day-NN`, so stored progress is unaffected.
* This file is touched by the lesson, today-day and library groups. **One owner should regenerate
  it once**, and I suggest the orchestrator or the lesson group. The library only reads `n`,
  `roman`, `name`, `blurb`, `lessons[].day` and `lessons[].title`.

---

## 7 · Lesson-Illustrations-v4 — where the 53 spot illustrations go

### 7.1 What the bundle is
53 cards (`id="<key>"`, title, `<key> · N uses`). Each has the **current art** as a `393×240` svg
(scale 1.1 about 196,190, except `Medal`: `scale(1)`), designer bullet notes, and a **`Before`**
thumbnail. The thumbnail is a second 393×240 svg inside a 131×80 box at `scale(0.3333)` showing the
*previous* art, and it must not be used. Card chrome (white card, notes) is not app UI.

### 7.2 Mapping, verified by exact element-by-element match of the svg body
* **Week heroes:** all 12 week frames, both pages, match a card's current art exactly (table §1/§3.3).
  The week hero is **not** the week's first-lesson cover: Week II = signpost but L8 = calendar;
  III = lighthouse but L15 = stopwatch; IV = brain and L22 = brain, and so on.
* **Lesson covers:** all 84 `L<n> Frame 1` heroes match a card (appendix §A, column "cover hero").
  The reader's closing frame repeats the cover hero (e.g. L1 F1 and F13/14), and some mid-lesson
  frames carry other illustrations (column "other illustrated frames").
* **Everything else:** 0 unmatched 393×240 heroes across the 12 Week bundles. In Email-Login, every
  hero frame matches a card **except `A-Clean-Day`** (bespoke art; tail group). Full usage table
  in appendix §B. The art is used by the auth-funnel (`V3-Q*`, `First-Principle`, `Transition`,
  `Goal-Confirmation`, `Onboarding-Start`), tail, paywall/reminders (`Day-Zero`,
  `Reminders-Setup`), today-day (morning/night check-ins), sos-flow, sos-boards (all 30), slip,
  logs (`Log-Chooser`, `Lapse-Trigger`, `Urge-Log-*`, `Report-Ready`), medallions-letters
  (`Letter-Arrival`, `Medallion-Received`), settings (`Your-Vow-Page`) and lesson-scroll groups.
  Scales vary per frame (0.723–1.1) with the same 196,190 origin.
* Designer "uses" counts on the cards do not exactly equal what the current frames reference (e.g.
  sunrise 25 vs 23 found, flag 14 vs 9). They count older placements, so ignore them.

### 7.3 Recommendation (orchestrator — shared by about 8 groups)
One generated module, e.g. `scripts/overhaul/gen-heroes.mjs`, reads
`.overhaul/final/Lesson-Illustrations-v4/*.html`, takes the **first** `viewBox="0 0 393 240"` svg
in each card (skipping the `Before` one), and emits `src/content/heroes.ts`
(`HEROES: Record<HeroId, Node[]>` with tag + attrs, including `paint-order`, `<g>` transforms and
inherited presentation attributes). Pair it with one component, e.g.
`src/components/mono/Hero.tsx`: `<Hero id top scale={1.1} />` that applies
`translate(196 190) scale(s) translate(-196 -190)` inside a padded, absolutely positioned `<Svg>`.
Every group then places a hero with a frame's `top` and `scale`. The library needs only `id` and
`top`. Do not hand-port the 12 week heroes inside the library.

### 7.4 Traps
* **`paint-order="stroke"`** appears on 22 elements of the current art in 17 illustrations
  (Balance-scale ×3, Medal ×2, Stack-of-books ×2, Wall-calendar ×2, and ×1 each for Bed-at-night,
  Browser-tabs, Campfire, Clipboard, Feed-locked, Hourglass, Kettle, Lit-match, Open-door,
  Open-letter, Phone-on-charge, Progress-chart, Storm-cloud). It draws the stroke first and the fill over it, so only the outer
  half of the stroke (in ground `#0D0D0D`) shows, as a knockout halo between overlapping shapes
  (visible on the Week V weight and leaf). react-native-svg ignores `paint-order`, so emit **two
  elements**: first the shape with fill + stroke, then the same shape with `stroke="none"` on top.
  That reproduces it exactly.
* **`scripts/overhaul/body.mjs` drops `paint-order` and `data-hero`** (not in its `SVG_ATTRS`). Anyone
  transcribing from body.mjs output will miss the halo. Ask the orchestrator to add both to
  `SVG_ATTRS`. Other unprinted attributes found across Email-Login + illustrations: `font-family`
  (Medal's `<text>`), `value` / `hint-placeholder-val` (inputs). The rest is covered.
* `Medal` contains a `<text>` (`V`, Lato 66/700, `text-anchor:middle`) and is the one card at
  `scale(1)`.
* Web: an `<Svg>` with an absolutely positioned sibling must itself be absolute (brief).

---

## 8 · Functionality to preserve (library area)

* Opening any lesson from its row, in every state (done, current, upcoming).
* The current-lesson highlight follows the calendar day from `user.createdAt`, read once on mount
  (stable under re-render). Day ≤ 1 or a missing user means lesson 1 is current. Past day 84 means
  every row is done and there is no current row.
* Back from the week page: `router.back()`, with a fallback when there is no history.
* Reaching all 12 weeks. Today the Library tab lists them all. The new design must not lose
  that (§9).
* `/week/<n>` deep link (the All drawer's `A week · board` → `/week/1`; recipes and audits use it).
* Search / lessons-browser / locked fall back to `/(app)/library`.
* Clamp: `n = max(1, min(12, Number(week) || 1))`.

---

## 9 · Navigation and the Library tab root — open question Q1

The canvas draws **no Library index**. Its only Library-active frames are these 24 week pages, and
each carries the back chevron **and** the tab bar. Today the Library tab stacks all 12 old boards,
and `/week/[n]` is a stack route without a bar.

**Recommended (A): the Library tab *is* the week pages.** `src/app/(app)/library.tsx` renders a
horizontal, `pagingEnabled` list of 12 `WeekPage`s (one screen width each, `getItemLayout`). It
opens on `params.week` if given, else the **current week** (`ceil(day/7)` clamped 1–12, which is
Week VI on the canvas's day 38). Every page is pixel-identical to its frame, the tab bar comes from
the navigator, and P2 is the page's own rows scroller. The back chevron does
`router.canGoBack() ? router.back() : router.navigate('/(app)/today')`. `src/app/week/[week].tsx`
becomes `<Redirect href={{ pathname: '/(app)/library', params: { week } }} />`, so `/week/N` deep
links and recipes keep working and land with the bar. Sideways swiping adds no pixels but is an
interaction the canvas does not state, so please record it as a D2xx decision.

**Alternative (B):** keep the current split. The Library tab is a vertical stack of 12 week
sections (each the frame's hero/header/7 rows without the chevron, in flow), and `/week/[n]` is the
exact frame as a pushed stack route. In that case `/week/[n]` must render the tab bar itself (or be
moved into the `(app)` group as a hidden tab screen), so the orchestrator's new tab bar must work
as a standalone component. `/score` (Score-Detail frames, Journey active) needs the same, so this
may be wanted anyway. B's Library first screen matches no frame (no chevron, Week I, no tab-bar
clearance for rows 5–7 under a transparent bar unless the bar gets a ground fill).

Either way, the new tab bar's active rule for **Library** must cover `/library` **and** `/week/*`.
Unlike today, it should no longer light for `/lesson*`, `/rough-days` or `/dashboard`: the lesson
readers draw no bar, and the other two are not Library screens in this drop.

---

## 10 · Other phone sizes (375×667, 390×844, 430×932)

Everything is absolutely positioned for 852, and the rows viewport needs canvas 472–736 above a
104pt bar.
* **Width.** Rows stretch (`left/right 16`), and titles still fit in ≤ 2 lines at 375 (§3.5 scan).
  The header is centred in `left/right 24`. Centre the hero's 393 box (`viewBox` x offset
  `−(W−393)/2`), so full-bleed art (lighthouse beams, flag horizon, sunrise) reaches both edges on
  430.
* **Height.** Rows viewport height = `min(264, H − 104 − 12 − 472)`. 852 gives 264 (exact frame),
  844 gives 256 (rows 1–4 still fully visible, since row 4 ends at 728), and 812 gives 224 (3.4
  rows, scrolls). **667 gives 79**, which is not usable. Below about 2 rows (H < ~720), switch to
  one page-level `ScrollView` (hero + header + 7 rows in flow, `paddingBottom: 104 + 12`) with
  nothing pinned. Either the bar needs a ground fill or the content padding keeps rows from
  passing under it.
* The bar has no background in the frames. On any scrolling screen, content would show through
  it. That is a decision for the orchestrator's tab bar (ground fill + the noise layer above it):
  invisible in every frame, and it matters on small phones.

---

## 11 · App screens in the library area that no frame draws

| screen | file | reached from | closest new-style analog |
|---|---|---|---|
| Library tab root (if option B) | `src/app/(app)/library.tsx` | tab bar | the week page itself: hero + caps/h1/p + rows, repeated per week |
| Lessons browser (old "159") | `src/app/lessons-browser.tsx` | Today fallback when no lesson, All | Week page rows (§3.5) grouped under `caps('Week <roman> · <name>')`. Or tiles: kit `card` `#1E1E1E` r24 with the lesson's cover hero shrunk like the cards' `Before` thumbnail (393×240 at 0.3333 in a 131×80 box). Keep `Cancel`, the search entry and lock semantics. |
| Locked weeks (old "106") | `src/app/(app)/locked.tsx` | All, paywall area | Week page upcoming rows (number `#9B968E`, chevron `#5A574F`) with the week name as title. Kit `primary` pill (left/right 24, h 58, r 29, `#F2F0EC`, 16/700 `#111111`, the same as the `Begin` on L1 F1) for the unlock CTA → `/paywall`. |
| Search | `src/app/search.tsx` | lessons-browser, All | Field from the settings sheets (`Sheet-Edit-Name`). Result rows = week-page rows. Recent chips = kit `chips`. |
| Empty / edge states | — | — | no user (day 1: lesson 1 current), day > 84 (all done), a bad week param (clamped). No loading or error state exists: the content is static. |

(`/journey` and `/journey/[chapter]`, the old four-chapter campaign, are not Library. In this drop
"Journey" is the medallions/score tab.)

---

## 12 · Shared files this group needs (requests, not edits)

| file | owner | what the library needs |
|---|---|---|
| `src/components/mono/*` (kit port) | orchestrator | `MonoFrame` (ground + `noise.png` 0.05), `BackChevron` (left 22, top 60, box 40), text styles `caps` (13/700/lh16/`#9B968E`), `h1` (size/lh params), `p` (size/lh params), `CheckDisc`, `ChevronR(color)`, **`TabBar(active)`** usable standalone, and **`Hero`** (§7.3). |
| `src/components/StoicTabBar.tsx` / its replacement | orchestrator | Library active on `/library` + `/week/*` only. Decide whether the bar has a ground fill (§10). |
| `src/content/heroes.ts` + `scripts/overhaul/gen-heroes.mjs` (new) | orchestrator | §7.3, including the paint-order split. |
| `scripts/overhaul/body.mjs` | orchestrator | add `paint-order`, `data-hero` to `SVG_ATTRS`. |
| `src/content/curriculum84.ts` + generator fork | orchestrator / lesson group | new titles (§6). |
| `src/app/(app)/_layout.tsx` | orchestrator | only if option B moves `week/[week]` into the tab group. |
| `src/lib/theme.ts` | orchestrator | already has `mono.*` and `sans()`. Nothing new needed. |

Files the library group owns and rewrites: `src/app/(app)/library.tsx`, `src/app/week/[week].tsx`,
`src/components/library/WeekBoard.tsx` (becomes `WeekPage` + `LessonRow` + `WeekHeader`). It
deletes `src/components/journey/WeekScene.tsx` and `src/content/weekScenes.ts`. If assigned, it also
restyles `lessons-browser.tsx`, `(app)/locked.tsx` and `search.tsx` (§11).

---

## 13 · Open questions and contradictions

* **Q1, the Library root** (§9). The canvas never draws a Library index, and every week page has a
  back chevron while showing the tab bar as if it were a tab root.
* **Q2, P1/P2 as scroll vs page.** The pair is a static composition: P1 stops at 4 rows with empty
  ground 728–748. I read it as the 264pt viewport (§3.6), which reproduces both frames exactly with
  no invented chrome. A horizontal pager inside the week would also fit the frames but is not
  suggested by anything.
* **Q3, current lesson by calendar day vs completion.** The frames show 1–37 done for a day-38 user,
  which both readings produce. The app uses calendar day; I recommend keeping it (no behaviour
  change). Completion records exist (`completeLesson`) if product wants "done = completed".
* **Q4, upcoming rows look tappable** (chevron) and the app already lets them open. If gating is
  wanted, that is a product decision, and nothing in the frames shows a lock.
* **Generator vs frame contradictions (frame wins):** `mono-core.js` lessonRow has the old titles,
  a white check on ink (frames: `#111111` on `#F2F0EC`), `CONTINUE` 12/700/ls1.5/white (frames:
  `Continue` 13/700/`#111111`), a number with `letter-spacing:1px` (frames: none),
  `h1 size 32 lh 38` and `stack(316)` (frames: 30/36 at 338), and rows at `466/484` (frames: 472
  for both pages).
* **Noise asset differs by bundle:** Email-Login week pages use `noise.png` @0.05, and the lesson
  readers `noise-dark.png` @0.06. Both are as stated. Do not unify them.

---

## 14 · Seed and recipes

* Seed: `.overhaul/understand/scratch-library/library-seed.js` is `weeks-seed.js` with
  `createdAt = midnight − 37·DAY` (day 38). Verified on `/week/6` pre-overhaul. Promote it to
  `.overhaul/library-seed.js` when implementing.
* Recipes: `.overhaul/recipes/library.json` has 24 entries: `route /week/N`, `initseed` the seed
  above, `wait 2500`, and P2 with `scroll: "end"`.
* Capture: `node scripts/overhaul/shot.mjs app /week/6 .overhaul/shots/a-week6.png --initseed=<seed> --wait=2500 --sig=a-week6`
  (P2: add `--scroll=end`), and `node scripts/overhaul/pxdiff.mjs .overhaul/shots/design/Email-Login/Week-VI-Discipline.png .overhaul/shots/a-week6.png --ignore=0,0,393,54`.

---

## A · Appendix: every lesson — old title → new title, cover hero, other illustrations

Cover hero = the `L<n> Frame 1` hero's illustration (id, card file). "cover svg top" is the frame's
own `top` inside the cover's 176pt hero box (lesson group). Other frames: `F<k> <id>` inside that
lesson's reader.

| L | Wk | old title (curriculum84.ts) | new title (week row = L<n> Frame 1 cover) | frames | cover hero (F1) | cover svg top | other illustrated frames in the reader |
|---|---|---|---|---|---|---|---|
| 1 | I | Surviving the Night | Prepare for tonight | 14 | `nightPhone` (Phone-parked-for-the-night) | -36px | F7 bed |
| 2 | I | A New Start | Remove easy access to porn | 16 | `sunrise` (Sunrise) | -79px | F7 notebook, F14 sunrise |
| 3 | I | Get Outside | Choose where to go instead | 15 | `bench` (Park-bench) | -34px | F4 signpost, F7 sneaker, F13 bench |
| 4 | I | Fix Your Sleep | Prepare for sleep | 15 | `bed` (Bed-at-night) | -32px | F6 clock, F9 lamp, F13 bed |
| 5 | I | What Replaces Porn? | Have another activity ready | 15 | `books` (Stack-of-books) | -92px | F5 pencil, F8 notebook, F13 books |
| 6 | I | Isolation | Make time for contact | 14 | `twoCups` (Two-cups) | -95px | F8 envelope, F12 twoCups |
| 7 | I | One Week In | Review the first week | 16 | `cake` (Cake) | -8px | F7 calendar, F14 cake |
| 8 | II | More Than a Streak | Measure more than a streak | 14 | `calendar` (Wall-calendar) | -20px | F6 chartUp, F12 calendar |
| 9 | II | After a Relapse | Stop sooner after a slip | 15 | `sunrise` (Sunrise) | -79px | F5 halfMast, F13 sunrise |
| 10 | II | The All-or-Nothing Trap | Use the hours that remain | 16 | `scale` (Balance-scale) | -62px | F7 dominoes, F14 scale |
| 11 | II | Progress Isn’t Linear | Try one change for a week | 14 | `chartUp` (Progress-chart) | -35px | F7 mountain, F12 chartUp |
| 12 | II | Identity | Repeat one useful action | 14 | `idCard` (ID-badge) | -1px | F6 mirror, F12 idCard |
| 13 | II | Values, Not Shame | Choose your own reason | 17 | `compass` (Compass-and-map) | -35px | F10 scale, F15 compass |
| 14 | II | Keep Going | Return after a missed day | 15 | `signpost` (Signpost) | -26px | F5 sneaker, F13 signpost |
| 15 | III | The Life of an Urge | What to do when an urge starts | 14 | `stopwatch` (Stopwatch) | -34px | F7 thermometer, F12 stopwatch |
| 16 | III | What’s the Urge Really For? | Check what you need | 16 | `thermometer` (Thermometer) | -30px | F9 bubbles, F14 thermometer |
| 17 | III | Move First | Close the screen and move | 14 | `sneaker` (Sneaker) | -74px | F6 openDoor, F9 stairs, F12 sneaker |
| 18 | III | Redirection | Prepare another activity | 16 | `signpost` (Signpost) | -26px | F8 compass, F14 signpost |
| 19 | III | HALT | Check hunger, anger, loneliness, and tiredness | 16 | `kettle` (Kettle) | -70px | F8 bed, F14 kettle |
| 20 | III | Urge Surfing | Notice an urge without acting on it | 16 | `lighthouse` (Lighthouse) | -8px | F6 hourglass |
| 21 | III | Masturbation | Make a separate choice about masturbation | 14 | `shower` (Shower) | -18px | F8 bed |
| 22 | IV | The Reward System | Understand what starts the habit | 16 | `brain` (Brain) | -23px | F4 battery, F14 brain |
| 23 | IV | The Control Center | Decide before the difficult hour | 14 | `brain` (Brain) | -23px | F6 compass, F12 brain |
| 24 | IV | Hungry and Tired | Make room for food and sleep | 14 | `kettle` (Kettle) | -70px | F5 bed, F9 battery, F12 kettle |
| 25 | IV | Angry and Lonely | Respond to anger and loneliness | 13 | `thunderCloud` (Storm-cloud) | -36px | F4 twoCups, F8 bench |
| 26 | IV | The Pull of Novelty | Notice when searching keeps going | 16 | `tab` (Browser-tabs) | -32px | F6 feedOff, F14 tab |
| 27 | IV | Change Your State | Try movement, breathing, or another room | 14 | `shower` (Shower) | -18px | F6 sneaker, F9 thermometer, F12 shower |
| 28 | IV | Autopilot | Act earlier in the habit | 15 | `dominoes` (Dominoes) | -92px | F6 compass, F13 dominoes |
| 29 | V | The Scale | Look at the benefit and cost | 13 | `scale` (Balance-scale) | -62px | F8 hourglass, F11 scale |
| 30 | V | The “Benefits” of Porn | Meet the need you can identify | 16 | `tab` (Browser-tabs) | -32px | F6 feedOff, F9 scale, F14 tab |
| 31 | V | The Hidden Reward | Begin a task you are avoiding | 15 | `envelopeOpen` (Open-letter) | -42px | F9 mirror, F13 envelopeOpen |
| 32 | V | The Short-Term Cost | Address one immediate cost | 15 | `clock` (Alarm-clock) | -36px | F4 battery, F8 hourglass, F13 clock |
| 33 | V | The Long-Term Cost | Make time for what viewing displaced | 15 | `calendar` (Wall-calendar) | -20px | F4 hourglass, F7 halfMast, F13 calendar |
| 34 | V | Tipping the Scale | Make one change for tonight | 14 | `scale` (Balance-scale) | -62px | F4 chartUp, F7 sunrise, F12 scale |
| 35 | V | Repairing the Scale | Give an activity a place in the week | 17 | `scale` (Balance-scale) | -62px | F8 plant, F15 scale |
| 36 | VI | What is Willpower? | Prepare a simpler response when tired | 17 | `battery` (Battery) | -92px | F5 stopwatch, F10 match, F15 battery |
| 37 | VI | Train Your Response | Practise the response | 15 | `sneaker` (Sneaker) | -74px | F4 dominoes2, F8 stopwatch, F13 sneaker |
| 38 | VI | What Discipline Isn’t | Keep rules that serve a purpose | 15 | `halfMast` (Flag-at-half-mast) | -29px | F5 mirror, F13 halfMast |
| 39 | VI | What Discipline Is | Practise the part that gets in the way | 17 | `compass` (Compass-and-map) | -35px | F9 sneaker, F15 compass |
| 40 | VI | Thoughts and Feelings | Let a thought remain while you act | 18 | `thunderCloud` (Storm-cloud) | -36px | F4 bubbles, F16 thunderCloud |
| 41 | VI | Choose Your Action | Give the action a time and place | 17 | `signpost` (Signpost) | -26px | F8 compass, F15 signpost |
| 42 | VI | Damage Control | Plan for a difficult day | 13 | `umbrella` (Umbrella-in-the-rain) | -11px | F8 halfMast |
| 43 | VII | Relapse Isn’t the End | Learn from a slip | 15 | `halfMast` (Flag-at-half-mast) | -29px | F8 sunrise, F13 halfMast |
| 44 | VII | Learn From the Relapse | Take care and make a repair | 17 | `notebook` (Open-notebook) | -91px | F5 clipboard, F10 pencil, F15 notebook |
| 45 | VII | Don’t Punish Yourself | Adjust the plan for today | 15 | `mirror` (Mirror) | -43px | F9 umbrella, F13 mirror |
| 46 | VII | Rough Days | Get support during a difficult period | 17 | `thunderCloud` (Storm-cloud) | -36px | F5 umbrella, F9 kettle, F15 thunderCloud |
| 47 | VII | When Life Gets Hard | Return to the task you postponed | 15 | `mountain` (Mountain) | -21px | F7 umbrella, F10 lighthouse, F13 mountain |
| 48 | VII | Face What You’re Avoiding | Begin the next part of the day | 15 | `door` (Closed-door) | -39px | F5 envelopeOpen, F10 stairs, F13 door |
| 49 | VII | Don’t Wait for Tomorrow | Take a step after a longer setback | 14 | `calendar` (Wall-calendar) | -20px | F4 sunrise, F9 stopwatch |
| 50 | VIII | Boredom | Give an activity time before switching | 17 | `clock` (Alarm-clock) | -36px | F5 phoneTable, F10 hourglass, F15 clock |
| 51 | VIII | Escaping Boredom | Choose what begins in an empty gap | 14 | `tab` (Browser-tabs) | -32px | F6 feedOff, F9 bench |
| 52 | VIII | Learn to Be Bored | Try fifteen minutes without switching | 14 | `bench` (Park-bench) | -34px | F8 hourglass, F12 bench |
| 53 | VIII | Screen Boundaries | Change one screen habit | 16 | `phoneTable` (Phone-face-down) | -45px | F4 charger, F9 clock, F14 phoneTable |
| 54 | VIII | Dopamine Detox | Try an hour away from one feed | 16 | `feedOff` (Feed-locked) | -34px | F5 plant, F9 sunrise, F14 feedOff |
| 55 | VIII | Wake Up With Purpose | Prepare the first hour after waking | 14 | `sunrise` (Sunrise) | -79px | F4 clock, F8 compass, F12 sunrise |
| 56 | VIII | Meaning | Give time to something that matters | 15 | `compass` (Compass-and-map) | -35px | F5 mountain, F9 plant, F13 compass |
| 57 | IX | Why Relationships Matter | Arrange a shared activity | 14 | `twoCups` (Two-cups) | -95px | F6 bench, F9 envelope, F12 twoCups |
| 58 | IX | Loneliness | Choose contact that fits | 17 | `bench` (Park-bench) | -34px | F10 nightMoon, F15 bench |
| 59 | IX | Solitude | Choose how to spend time alone | 14 | `bench` (Park-bench) | -34px | F9 campfire, F12 bench |
| 60 | IX | What Porn Replaces | Separate desire from wanting company | 16 | `twoCups` (Two-cups) | -95px | F4 envelope, F7 phoneTable, F14 twoCups |
| 61 | IX | Friendship | Follow up on a connection | 15 | `twoCups` (Two-cups) | -95px | F5 campfire, F10 cake, F13 twoCups |
| 62 | IX | Unhealthy Relationships | Set a safe limit on harmful contact | 14 | `thunderCloud` (Storm-cloud) | -36px | F8 dominoes, F12 thunderCloud |
| 63 | IX | Healthy Relationships | Give a relationship attention | 15 | `twoCups` (Two-cups) | -95px | F4 plant, F9 campfire, F13 twoCups |
| 64 | X | Trauma | Choose support without revisiting painful events | 16 | `umbrella` (Umbrella-in-the-rain) | -11px | F4 lighthouse, F7 envelopeOpen |
| 65 | X | Your Environment | Change one difficult setting | 14 | `plant` (Plant) | -21px | F4 nightMoon, F9 door, F12 plant |
| 66 | X | Self-Criticism | Describe a mistake without an insult | 15 | `mirror` (Mirror) | -43px | F9 bubbles, F13 mirror |
| 67 | X | Self-Loathing | When you feel bad about yourself | 14 | `mirror` (Mirror) | -43px | F4 thunderCloud, F8 lamp, F12 mirror |
| 68 | X | Self-Compassion | Check your response to self-criticism | 16 | `plant` (Plant) | -21px | F7 twoCups, F14 plant |
| 69 | X | Self-Trust | Keep one manageable commitment | 15 | `compass` (Compass-and-map) | -35px | F4 calendar, F7 flag, F13 compass |
| 70 | X | Self-Improvement | Simplify the plan | 15 | `chartUp` (Progress-chart) | -35px | F7 sneaker, F10 books, F13 chartUp |
| 71 | XI | Know Yourself | Use what your notes show | 14 | `mirror` (Mirror) | -43px | F4 notebook, F8 compass, F12 mirror |
| 72 | XI | Amor Fati | Choose what you can do now | 16 | `umbrella` (Umbrella-in-the-rain) | -11px | F9 lighthouse, F14 umbrella |
| 73 | XI | Memento Mori | Reserve time for what matters | 14 | `hourglass` (Hourglass) | -45px | F4 calendar, F9 nightMoon, F12 hourglass |
| 74 | XI | Carpe Diem | Begin an activity you postponed | 15 | `sunrise` (Sunrise) | -79px | F6 stopwatch, F10 sneaker, F13 sunrise |
| 75 | XI | The Next 90 Days | Plan the next ninety days | 16 | `calendar` (Wall-calendar) | -20px | F6 signpost, F14 calendar |
| 76 | XI | Peace of Mind | Give one activity your attention | 14 | `lighthouse` (Lighthouse) | -8px | F4 bench, F9 plant |
| 77 | XI | This Time Next Year | Schedule something you want to keep doing | 14 | `envelope` (Envelope) | -85px | F4 calendar, F9 mountain, F12 envelope |
| 78 | XII | What Forever Means | Keep the reason and next action clear | 14 | `lighthouse` (Lighthouse) | -8px | F4 compass, F8 flag, F12 lighthouse |
| 79 | XII | Twelve Weeks Ago | Compare the start with now | 16 | `calendar` (Wall-calendar) | -20px | F6 signpost, F14 calendar |
| 80 | XII | What Changed in Your Brain | Prepare for a changed situation | 18 | `brain` (Brain) | -23px | F8 chartUp, F16 brain |
| 81 | XII | Winning the Battle | Use the changes that helped | 17 | `flag` (Flag) | -29px | F4 mountain, F10 medal, F15 flag |
| 82 | XII | Lessons From Addiction Recovery | Check how to ask for help | 17 | `books` (Stack-of-books) | -92px | F8 twoCups, F15 books |
| 83 | XII | Saying Goodbye | Finish with an honest next step | 15 | `envelopeOpen` (Open-letter) | -42px | F4 halfMast, F8 sunrise, F13 envelopeOpen |
| 84 | XII | The Future | Save a short plan for after the course | 14 | `sunrise` (Sunrise) | -79px | F6 lighthouse, F12 sunrise |

## B · Appendix: where each illustration is used (Email-Login frames + lesson readers)

Derived by exact svg-body match (`scratch-library/heroes.mjs usage`). Lesson-reader refs are `L<n>F<k>`.

| file (Lesson-Illustrations-v4) | id | canvas "uses" | Email-Login frames using it | lesson-reader frames |
|---|---|---|---|---|
| Alarm-clock | `clock` | 9 | SOS-Feel-Anxious | 7: L4F6 L32F1 L32F13 L50F1 L50F15 L53F9 L55F4 |
| Balance-scale | `scale` | 13 | V3-Q21, Week-V-Why-It-Feels-Worth-It-P2, Week-V-Why-It-Feels-Worth-It | 10: L10F1 L10F14 L13F10 L29F1 L29F11 L30F9 L34F1 L34F12 L35F1 L35F15 |
| Balloon | `balloon` | 2 | SOS-Trig-Fantasy | 0:  |
| Battery | `battery` | 6 | Morning-Energy | 5: L22F4 L24F9 L32F4 L36F1 L36F15 |
| Bed-at-night | `bed` | 15 | Lesson-Scroll-7, Night-1-Mood, SOS-Loc-Bed, SOS-Trig-Cant-Sleep, Slip-Feel-Tired, Slip-Trigger-Couldn-t-sleep, Surf-Step-1, V3-Q7 | 6: L1F7 L4F1 L4F13 L19F8 L21F8 L24F5 |
| Bell | `bell` | 3 | Reminders-Setup, Slip-Morning-After | 0:  |
| Brain | `brain` | 9 | Week-IV-Know-Your-Brain-P2, Week-IV-Know-Your-Brain | 6: L22F1 L22F14 L23F1 L23F12 L80F1 L80F16 |
| Browser-tabs | `tab` | 10 | SOS-Trig-Content, Slip-Close-It, Slip-Trigger-Sexual-content, Slip-Urge-Now | 5: L26F1 L26F14 L30F1 L30F14 L51F1 |
| Cake | `cake` | 4 | — | 3: L7F1 L7F14 L61F10 |
| Campfire | `campfire` | 4 | Slip-Feel-Turned-on | 3: L59F9 L61F5 L63F9 |
| Clipboard | `clipboard` | 2 | Urge-Log-Outcome | 1: L44F5 |
| Closed-door | `door` | 9 | SOS-Feel-Unknown, Start-Here-Step-2, Week-XII-Leave-It-Behind-P2, Week-XII-Leave-It-Behind | 3: L48F1 L48F13 L65F9 |
| Compass-and-map | `compass` | 16 | V3-Q3 | 15: L13F1 L13F15 L18F8 L23F6 L28F6 L39F1 L39F15 L41F8 L55F8 L56F1 L56F13 L69F1 L69F13 L71F8 L78F4 |
| Desk-lamp | `lamp` | 6 | SOS-Feel-Low, SOS-Loc-Home-Alone, V3-Q10 | 2: L4F9 L67F8 |
| Dominoes | `dominoes` | 6 | Relapse-Log, Slip-Entry | 4: L10F7 L28F1 L28F13 L62F8 |
| Envelope | `envelope` | 10 | Letter-Arrival, Letter-Received, SOS-Afterward, SOS-Feel-Lonely, Slip-Feel-Lonely | 5: L6F8 L57F9 L60F4 L77F1 L77F12 |
| Feed-locked | `feedOff` | 8 | SOS-Reason-Picker, SOS-Trig-Doomscroll, Slip-Trigger-Scrolling | 5: L26F6 L30F6 L51F6 L54F1 L54F14 |
| First-domino-tipping | `dominoes2` | 4 | Relapse-Twice, Slip-Dont-Fail-Twice, Slip-Stop-Here | 1: L37F4 |
| Flag-at-half-mast | `halfMast` | 8 | — | 8: L9F5 L33F7 L38F1 L38F13 L42F8 L43F1 L43F13 L83F4 |
| Flag | `flag` | 14 | Goal-Confirmation, V3-Q15, Week-VI-Discipline-P2, Week-VI-Discipline, Your-Vow-Page | 4: L69F7 L78F8 L81F1 L81F15 |
| Fountain-pen | `fountainPen` | 5 | Morning-Pledge-Signed, Morning-Resign-Pledge, Relapse-Resign, Slip-Pledge | 0:  |
| Hourglass | `hourglass` | 11 | V3-Q2, Week-VIII-Boredom-and-Meaning-P2, Week-VIII-Boredom-and-Meaning | 8: L20F6 L29F8 L32F8 L33F4 L50F10 L52F8 L73F1 L73F12 |
| ID-badge | `idCard` | 3 | V3-Q26-Gender | 2: L12F1 L12F12 |
| Kettle | `kettle` | 10 | SOS-Feel-Stressed, Slip-Feel-Stressed, Slip-Trigger-Stress | 5: L19F1 L19F14 L24F1 L24F12 L46F9 |
| Lighthouse | `lighthouse` | 17 | First-Principle, Surf-Complete, Week-III-In-the-Moment-P2, Week-III-In-the-Moment | 8: L20F1 L47F10 L64F4 L72F9 L76F1 L78F1 L78F12 L84F6 |
| Lit-match | `match` | 3 | Lapse-Trigger, Urge-Log-Trigger | 1: L36F10 |
| Medal | `medal` | 1 | Medallion-Received | 1: L81F10 |
| Mirror | `mirror` | 16 | SOS-Feel-Ashamed, Slip-Feel-Ashamed, Week-X-Yourself-P2, Week-X-Yourself | 11: L12F6 L31F9 L38F5 L45F1 L45F13 L66F1 L66F13 L67F1 L67F12 L71F1 L71F12 |
| Moon-over-a-lone-house | `nightMoon` | 7 | Checkin-Emotions, Night-4-Closed, Night-Check-in-Cover | 3: L58F10 L65F4 L73F9 |
| Mountain | `mountain` | 8 | SOS-Feel-Angry, Week-XI-Build-a-Life-You-Want-P2, Week-XI-Build-a-Life-You-Want | 6: L11F7 L47F1 L47F13 L56F5 L77F9 L81F4 |
| Open-door | `openDoor` | 10 | Cue-Hue-Picker, SOS-Loc-Bathroom, SOS-Loc-Private-Room, SOS-Trig-Alone, Slip-Trigger-Being-alone, Surf-Step-3, V3-Q13 | 1: L17F6 |
| Open-letter | `envelopeOpen` | 6 | — | 6: L31F1 L31F13 L48F5 L64F7 L83F1 L83F13 |
| Open-notebook | `notebook` | 8 | Log-Chooser, Night-3-Reflection | 5: L2F7 L5F8 L44F1 L44F15 L71F4 |
| Park-bench | `bench` | 16 | SOS-Loc-Public, SOS-Loc-Work | 12: L3F1 L3F13 L25F8 L51F9 L52F1 L52F12 L57F6 L58F1 L58F15 L59F1 L59F12 L76F4 |
| Pencil | `pencil` | 4 | V3-Q24-Name | 2: L5F5 L44F10 |
| Phone-face-down | `phoneTable` | 11 | SOS-Feel-Rejected, SOS-Trig-Rejection, SOS-Trig-Unknown, Slip-Feel-Rejected, Slip-Trigger-Not-sure | 4: L50F5 L53F1 L53F14 L60F7 |
| Phone-on-charge | `charger` | 12 | Cue-Set-Confirmation, Morning-Task-Check, Night-Action-Reminder, SOS-Trig-Late-Phone, Slip-Third, Slip-Trigger-Late-night, Start-Here-Step-1, Start-Here, Where-We-d-Start | 1: L53F4 |
| Phone-parked-for-the-night | `nightPhone` | 9 | Lesson-Scroll-1, Onboarding-Start, SOS-Feel-Tired, Slip-Fed, Week-I-Reset-P2, Week-I-Reset | 1: L1F1 |
| Plant | `plant` | 10 | What-it-affects | 9: L35F8 L54F5 L56F9 L63F4 L65F1 L65F12 L68F1 L68F14 L76F9 |
| Progress-chart | `chartUp` | 8 | Report-Ready | 7: L11F1 L11F12 L8F6 L34F4 L70F1 L70F13 L80F8 |
| Shower | `shower` | 5 | SOS-Feel-Numb | 3: L21F1 L27F1 L27F12 |
| Signpost | `signpost` | 18 | SOS-Loc-Elsewhere, SOS-Trig-Habit, Slip-Feel-Not-sure, Slip-Trigger-Habit, Transition, V3-Q16, Week-II-Changing-Your-Mindset-P2, Week-II-Changing-Your-Mindset | 9: L3F4 L14F1 L14F13 L18F1 L18F14 L41F1 L41F15 L75F6 L79F6 |
| Sneaker | `sneaker` | 11 | SOS-Feel-Restless | 10: L3F7 L14F5 L17F1 L17F12 L27F6 L37F1 L37F13 L39F9 L70F7 L74F10 |
| Speech-bubbles | `bubbles` | 6 | Checkin-Reasons, SOS-Trig-Argument, Slip-Trigger-Argument | 3: L16F9 L40F4 L66F9 |
| Stack-of-books | `books` | 4 | — | 5: L5F1 L5F13 L70F10 L82F1 L82F15 |
| Stairs | `stairs` | 5 | SOS-Feel-Bored, Slip-Feel-Bored, Slip-Trigger-Boredom | 2: L17F9 L48F10 |
| Stopwatch | `stopwatch` | 6 | Cue-Intro-Modal | 6: L15F1 L15F12 L36F5 L37F8 L49F9 L74F6 |
| Storm-cloud | `thunderCloud` | 12 | SOS-Feeling-Picker, V3-Q6 | 8: L25F1 L40F1 L40F16 L46F1 L46F15 L62F1 L62F12 L67F4 |
| Sunrise | `sunrise` | 25 | Day-Zero, Morning-1-Yesterday, Morning-Check-in-Cover, Morning-Feeling, Relapse-Begin, Slip-Begin-Again, Week-VII-Relapse-and-Adversity-P2, Week-VII-Relapse-and-Adversity | 15: L2F1 L2F14 L9F1 L9F13 L34F7 L43F8 L49F4 L54F9 L55F1 L55F12 L74F1 L74F13 L83F8 L84F1 L84F12 |
| Thermometer | `thermometer` | 7 | SOS-Reassess, SOS-Strength, Urge-Log-Intensity | 4: L15F7 L16F1 L16F14 L27F9 |
| Two-cups | `twoCups` | 18 | SOS-Challenge, Slip-Trigger-Loneliness, Week-IX-Connection-P2, Week-IX-Connection | 13: L6F1 L6F12 L25F4 L57F1 L57F12 L60F1 L60F14 L61F1 L61F13 L63F1 L63F13 L68F7 L82F8 |
| Umbrella-in-the-rain | `umbrella` | 11 | SOS-Feel-Turned-On | 7: L42F1 L45F9 L46F5 L47F7 L64F1 L72F1 L72F14 |
| Wall-calendar | `calendar` | 19 | V3-Q3b | 13: L7F7 L8F1 L8F12 L33F1 L33F13 L49F1 L69F4 L73F4 L75F1 L75F14 L77F4 L79F1 L79F14 |

Unmatched 393×240 heroes: `Email-Login/A-Clean-Day.html` only (bespoke, tail group).
