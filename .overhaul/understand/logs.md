# Group `logs` — Log chooser, lapse + urge-log flows, the Log tab, urge overview, weekly report (20 frames)

Analysis only. Every number is the frame's own (`node scripts/overhaul/body.mjs`), cross-checked against
the design layout signatures `.overhaul/sig/d-Email-Login-<Frame>.txt` and the PNGs in
`.overhaul/shots/design/Email-Login/`. Canvas y is quoted; the app subtracts 54 (D009) for anything hung
from the top and measures `bottom:` offsets off the screen edge (D026).

Scratch: `.overhaul/understand/scratch-logs/<Frame>.txt` holds the full `body.mjs` dump of all 20 frames;
`scratch-logs/herocheck.mjs` proves the five heroes are byte-identical to their Lesson-Illustrations-v4 cards.

**The generator `gen/mono-log.js` is badly out of date for this group** — it draws stat trios, insight cards,
card-wrapped `logRows` with outcome pills, a bar-chart week strip, a `+12 points` verdict card, etc. *None of
that is in the frames.* The frames were redrawn after the generator (big-number headers, ruled rows, dot
charts, a 24-hour dial). Use the generator only for kit primitives (`nav`, `h1`, `chips`, `options`,
`segmented`, `pill`, `tabBar`, `timePicker`). Frame wins everywhere below.

---

## 0. The short version

| # | frame (FLOW badge) | route + state | app file today | change |
|---|---|---|---|---|
| 1 | Log-Chooser (90) | `/log-chooser`, 2nd card selected | `src/app/log-chooser.tsx` | restructure |
| 2 | Lapse-When (90B) | `/lapse` step 0 | `src/app/lapse.tsx` (+ pieces from `urge-log.tsx`) | restructure |
| 3 | Lapse-Trigger (90C) | `/lapse` step 1, Late night + Boredom on | same | restructure |
| 4 | Lapse-Done (90D) | `/lapse` step 2 | same | restructure |
| 5 | Log-Urges (91) | `/log` tab `Urges` | `src/app/(app)/log.tsx` | restructure |
| 6 | Log-Check-ins (91-2) | `/log` tab `Check-ins` | same | restructure |
| 7 | Log-Reports (91-3) | `/log` tab `Reports` | same | restructure |
| 8 | Urge-Overview-Summary (91A) | `/urge-overview` page 0 | `src/app/urge-overview.tsx` | restructure |
| 9 | Urge-Overview (91B, Strength) | `/urge-overview` page 1 | same | restructure |
| 10 | Urge-Overview-Mood (91C) | `/urge-overview` page 2 | same | restructure |
| 11 | Urge-Overview-When (91D, Timing) | `/urge-overview` page 3 | same | restructure |
| 12 | Report-Ready (91C0) | `/report-ready?week=` | `src/app/report-ready.tsx` | restyle + copy |
| 13 | Weekly-Report (91C, Score) | `/weekly-report` page 0 | `src/app/weekly-report.tsx` | restructure |
| 14 | Weekly-Report-Days (91C2) | `/weekly-report` page 1 | same | restructure |
| 15 | Weekly-Report-Urges (91C3) | `/weekly-report` page 2 | same | restructure |
| 16 | Urge-Log-Intensity (91D) | `/urge-log` step 0 | `src/app/urge-log.tsx` | restructure |
| 17 | Urge-Log-Trigger (91E) | `/urge-log` step 1 | same | restructure |
| 18 | Urge-Log-Outcome (91F) | `/urge-log` step 2 | same | restyle |
| 19 | Urge-Log-When (91G) | `/urge-log` step 3 | same | restructure |
| 20 | Urge-Log-Done (91H) | `/urge-log` step 4 | same | restructure + new copy |

Every one of the seven files is still written in the previous (light paper) drop's vocabulary: hard-coded
`#FFFFFF` cards, `#1D1C1A`/`#131313` ink, `sans('500'|'600')`, `noise-dark.png` @0.07, `StatusBar style="dark"`,
warm gradients, halos, `Hill`s, sun discs. **All of it goes.** Each screen is rebuilt on the mono kit.

Navigation is unchanged in shape (D124 stands): tab-bar `Log` → `/log-chooser` (no tab bar) → X → `/(app)/log`;
the log's back chevron → `/log-chooser`; `Continue` → `/checkin` | `/urge-log` | `/lapse`. Reports row →
`/weekly-report?week=`; `(app)/_layout` launch gate → `/report-ready?week=` → `Open the report` →
`/weekly-report?week=`; weekly-report Urges page → `/urge-overview?week=`.

---

## 1. Shared vocabulary (kit pieces these 20 frames use, exact numbers)

Palette (`mono` in `src/lib/theme.ts`, already there): ground `#0D0D0D`, card `#1E1E1E`, line `#2E2E2E`,
art `#5A574F`, ink `#F2F0EC`, sub `#B5B0A8`, mute `#9B968E`, on-ink `#111111`. Hero tones `#55524D`,
`#3A3835`, `#A8A39A`, `#232220`.

Lato `line-height: normal` = 1.2 × size; the sigs confirm the boxes: 11→13, 12→15 (svg), 13→16, 14→17,
15→18, 16→19, 17→21, 30→36. Where a frame leaves `line-height` unset, give RN that number explicitly or the
row heights drift.

* **frame** — 393×852, bg `#0D0D0D`, **`noise.png` @ 0.05** (all 20 frames; `assets/images/noise.png` is
  byte-identical to the bundle's — md5 `ecf3b31a…`). Replace every `Grain source={noiseDark} opacity={0.07}`.
  `StatusBar style="dark"` → `"light"` in `lapse`, `urge-log`, `urge-overview`, `report-ready`,
  `weekly-report` (dark ground).
* **flow nav** (kit `nav({step,total,close:true})`) — row `top:60 h40 padding 0 22`, `space-between`, z5.
  Left slot 36×40: `chevronL` svg 12×20 `M10 2L2 10l8 8` stroke `#F2F0EC` 2.2 round/round → (22,70).
  Centre: 8 dashes `24×2 r1`, gap 6 → run 234 wide at x 79.5–313.5, y 79; active `#F2F0EC`, rest `#2E2E2E`;
  **active = round(step/total × 8)**: lapse 1/3→3, 2/3→5; urge log 1/4→2, 2/4→4, 3/4→6, 4/4→8. Right slot 36×40
  (`justify flex-end`): `closeX` svg 18×18 `M2 2l14 14M16 2L2 16` stroke `#F2F0EC` 2 round → (353,71).
* **close-only nav** (`nav({close:true,noBack:true})`) — empty left slot, no dashes, X as above. Log-Chooser,
  both Done frames, Report-Ready.
* **title head** (mono-log `titleHead`) — `backRow`: chevron (22,70) as above; right slot either an empty
  `<div>` (Log tabs) or a `div h40 flex center` holding a **pill**: `h32 r16 #1E1E1E padding 0 14`,
  13/700 `#F2F0EC` nowrap, ending at x 371 (`Last 30 days` 98.9 wide at x 272.1; `Jul 14–20` 84.7 wide at
  286.3; y 64). Title `left 24 right 24 top 108`: **32/700, ls −0.6, lh 38** `#F2F0EC`.
* **segmented** — `left 16 right 16 top 164`, track `h44 r22 #1E1E1E padding 4`, items `flex 1 h36 r18`,
  13/700 nowrap; on = bg `#F2F0EC` text `#111111`; off = transparent `#9B968E`. 3 items → 117.7 wide
  (x 20 / 137.7 / 255.3); 4 items → 88.3 (x 20 / 108.3 / 196.5 / 284.8), y 168.
* **big stat** — `stack` `left 24 right 24 top 236`, column, `align-items center`, gap 10: value
  **64/700, ls −2.2, lh 67** `#F2F0EC` nowrap (box 236–303); word variant **44/700, ls −1.5, lh 67**
  (`Strong`, `Tense`); caption **15/400 lh 22 `#9B968E`** centred nowrap at y 313.
* **h1** 26/700 ls −0.6 lh 33 `#F2F0EC` (balance); Report-Ready uses **30/36**; Log/overview/report titles 32/38.
* **p** 15/400 lh 24 `#B5B0A8` (pretty). Trigger sub-line: 15/400 **lh 22 `#9B968E`**.
* **caps** 13/700 `#9B968E` nowrap, mixed case (`Or choose a time`, `Last week`).
* **primary** `left 24 right 24 bottom 48` (top 746) `h58 r29 #F2F0EC`, label 16/700 ls 0.1 `#111111` nowrap,
  text run at 765.5. Report-Ready: `bottom 96` (top 698). **The app's current `paddingBottom: 50` is 2 off.**
* **ghost** `left 0 right 0 bottom 60` (box 0,774,393×18), 15/400 `#9B968E` centred (Report-Ready `Later`).
* **chips** (multi-select, kit `chips`) — `flex-wrap`, gap 12; chip `h48 r24 padding 0 20 gap 8`; off: bg
  `#1E1E1E`, label 15/400 `#F2F0EC`; on: bg `#F2F0EC`, `check` svg 13×13 (viewBox 14, `M2 7.5l3.2 3L12 3.5`
  stroke `#111111` 2.2 round/round) + label 15/400 `#111111`. **Weight stays 400 when on.**
* **options** (single-select, kit `options`) — column gap 12; row `h58 r18 padding 0 22`, label **15/400**
  (kit says 16 — frame wins) nowrap; on: bg `#F2F0EC` text `#111111`; off: bg `#1E1E1E` text `#F2F0EC`. No
  shadow, no marks, no radio circle.
* **ruled rows** (the new list idiom — no card, no background) — column; row `display flex; align center;
  justify space-between; gap 14; padding 0 2`, heights **52** (Log tabs, overview summary), **56** (weekly
  urges); every row after the first has `border-top 1px #2E2E2E` (so it is 53/57 tall). Left 15/700 `#F2F0EC`
  nowrap (box h18); right 14/700 nowrap `#9B968E` (box h17), `display flex; gap 8`. **Slip variant:** right
  text `#F2F0EC` preceded by a `6×6 r3 #F2F0EC` dot, word `Slipped`. Outer wrapper `flex column gap 8` (one
  section only — no captions anywhere).
* **dot rows** (overview Strength + Timing) — row `h46 padding 0 2 gap 14`, ruled as above: label
  `width 96` 15/700 `#F2F0EC` nowrap; dots container `flex 1; gap 6` of `9×9 r50% #F2F0EC` (one per count);
  count 14/700 `#9B968E`. Dots start at x 136, count right-aligned ending at x 367.
* **week strip** (Log Urges / Check-ins) — `left 32 right 32 top 352`; 7 columns `width 36`, `space-between`
  (pitch 48.83); column = 36-high slot (`flex center`) + label, gap 10. Label 11/700 `#5A574F`; **today's
  label `#F2F0EC`**. Labels `M T W T F S S` (Monday-first). Slot content per screen (§3.5, §3.6).
* **summary card** (Done frames) — see §3.4.
* **tab bar** (kit `tabBar('Log')`, orchestrator) — `bottom 0 h104 padding 14 14 0`, `align flex-start;
  space-between`, z8, **no background**. Items `width 72`, column gap 4: icon 26×26 + label 11.5 (active 700
  `#F2F0EC`, others 400 `#9B968E`). SOS: `60×60 r30 #F2F0EC margin-top −6`, `SOS` 13/700 **`#111111`** (kit
  source says `#FFFFFF`; frame draws `#111111`). Icons: home `M4 12.5L13 4l9 8.5V21a1.5 1.5 0 0 1-1.5 1.5h-15A1.5
  1.5 0 0 1 4 21z`; log `rect 5,3.5 16×19 rx3` + `M9 9h8M9 13h8M9 17h5`; library `M13 6.5C11 5 8 4.5 4 4.5v15c4 0
  7 .5 9 2 2-1.5 5-2 9-2v-15c-4 0-7 .5-9 2z M13 6.5v15`; journey `circle 13,10 r6.5` + `M9 15.5L7 23l6-3 6 3-2-7.5`,
  all stroke 1.8 (linejoin round on paths). Bar top 748, icons y 762, labels y 792.
* **hero** (`svgWrap`) — `<svg 393×240 viewBox 0 0 393 240 style="position:absolute; left:0; top:T;
  overflow:visible; transform:scale(s); transform-origin:196px 190px">`. Canvas point of (x,y):
  `X = 196 + s(x−196)`, `Y = T + 190 + s(y−190)`. RN: `<Svg 393×240 style={{position:'absolute', left:0,
  top:T−54}}>` + `<G transform="translate(196 190) scale(s) translate(-196 -190)">`. All five heroes here are
  **exact copies** of Lesson-Illustrations-v4 cards (svg #0 of each card; `scratch-logs/herocheck.mjs`):

  | frame | `data-hero` | card | T | s | art extent on canvas |
  |---|---|---|---|---|---|
  | Log-Chooser | `notebook` | Open-notebook | 506 | 1.1 | x 59.6–332.4, y 592.6–716.9 |
  | Lapse-Trigger, Urge-Log-Trigger | `match` | Lit-match | 506 | 1.1 | y 531–712.5 |
  | Urge-Log-Intensity | `thermometer` | Thermometer | 506 | **1.062** | y 543–714 |
  | Urge-Log-Outcome | `clipboard` | Clipboard | 506 | **0.989** | y 567–715 |
  | Report-Ready | `chartUp` | Progress-chart | **190** | 1.1 | y 228–382; floor rect `x −40 w 473` runs edge to edge at y 379–382 |

  `paint-order="stroke"` (not printed by `body.mjs`) is on: the match's head ellipse (`196,106 rx10 ry12`,
  stroke `#0D0D0D` 3), the chart's clip rect (`186,52 20×14 rx3`, stroke `#0D0D0D` 3), the clipboard's clip
  (`170,60 52×20 rx6`, stroke `#0D0D0D` 3). react-native-svg ignores it → draw stroke-only first, then the
  fill-only shape. The clipboard hero also has `<g transform="translate(282 186) rotate(-102.5)">` (the pencil)
  — pass the string transform, never `rotation=`. All hero svgs share a parent with absolute boxes → the
  `<Svg>` must carry `position:'absolute', top, left` (BRIEF SVG trap). Paint the hero **first** (under the
  nav/stack/primary), as the frame does.

---

## 2. Where the app draws this today, and the shared plumbing

* `src/app/urge-log.tsx` exports the flow chrome used by `lapse.tsx` **and by `src/app/slip.tsx` (slip group)**:
  `FlowTop, Heading, PrimaryButton, TRIGGERS, TriggerCard, triggerTileWidth, GRID_GAP, GRID_GUTTER,
  WHEN_CHIPS, TimeWheel, LoggedNote, SummaryRow`. `slip.tsx:29` imports
  `FlowTop, GRID_GAP, GRID_GUTTER, LoggedNote, PrimaryButton, TimeWheel, triggerTileWidth, WHEN_CHIPS`.
  `Slip-When.html` is **byte-identical** to `Lapse-When.html` (diffed) and `Slip-Fed.html` is the same chips
  question with other labels — so the new When/Chips/Done pieces are shared with the slip group.
  **Recommendation:** move them into a new module owned by this group, e.g. `src/components/logflow/`
  (`FlowNav`, `ChipsQuestion`/`ChipField`, `WhenPicker`, `DoneSummary`, `CheckDisc`, `joinTriggers`,
  `dayPartLabel`), have `urge-log.tsx`, `lapse.tsx` import from it, and keep thin re-exports in `urge-log.tsx`
  until the slip group switches its import (tell them the names).
* `src/app/(app)/log.tsx` exports `ONE_LINE` (used by `urge-overview.tsx`), `Halo, SunDisc, ramp150`
  (log-chooser, weekly-report), `LogRow, OUTCOME_WORD, TriggerGlyph` (weekly-report). Halo/SunDisc/ramp150/
  TriggerGlyph/LogRow die with the redesign; the new **ruled row** component (`RuledRow`, with the slip
  variant) should be the shared export (Log tabs, overview summary, weekly urges). `OUTCOME_WORD` is no longer
  drawn anywhere in this group.
* `src/lib/weeklyReport.ts` (`buildWeeklyReport`, `hasReportContent`, `latestCompletedWeek`,
  `completedWeekStarts`, `severityWord`, label with spaced en dash across months). Read also by
  `(app)/_layout.tsx` (orchestrator), `mail.tsx`, `all.tsx`.
* `src/components/ui/IntensityBands.tsx`: `INTENSITY_BANDS` = Faint / Mild / Strong / Intense /
  Overwhelming (notes `Barely noticeable / Easy to set aside / Hard to ignore / Hard to resist / Almost gave in`),
  `bandToSeverity(i) = 2i+2`. Also used by `src/components/urge/index.tsx` (sos group) — read only.
* `src/components/keepsakes/Medallion.tsx`: `KK_ALBUM` face `vici` (steps `[5,25,100,250,1000]`),
  `kkStanding`, `KK_METALS` — needed for the new Urge-Log-Done line (§3.20). Read only.

---

## 3. Per frame

### 3.1 `90 · Log — Chooser` — Log-Chooser.html

* **Route/state:** `/log-chooser` (seed `.overhaul/logs-seed.js`, wait 1600). Frame draws **`An urge`
  selected** — the app defaults to index 0 (`useState(0)`). Either default to 1 or `tap('An urge')` (Q1).
* **App today:** three 281×150 gradient cards with painted scenes (hill/sun, potted plant, crescent),
  16.5/500 titles, pip/ring radio marks; 22/500 centred title at 64.
* **Frame draws:**
  * close-only nav (X at 353,71). Hero `notebook` T 506 s 1.1 (painted first).
  * `stack(136, gap 14)`: h1 **left-aligned** `What are you logging?` (24,136,345×33); spacer 6; list
    `column gap 12` of three **84-high** rows at y 203 / 299 / 395.
  * row (kit `bigOptions`): `h84 r22 padding 0 20 gap 16 align center`.
    * icon ring `44×44 r50%`, transparent, **outside** ring `0 0 0 1.5px` (`#2E2E2E` off / `rgba(17,17,17,0.3)`
      on) at x 44; glyph svg 22×22 (viewBox 22) stroke 1.8 round/round, `#F2F0EC` off / `#111111` on:
      check-in `M11 3v3M11 16v3M3 11h3M16 11h3M6 6l2 2M14 14l2 2M6 16l2-2M14 8l2-2`; urge
      `M3 15c3 0 4-6 8-6s5 6 8 6M3 18c3 0 4-3 8-3s5 3 8 3`; lapse `M3 12c3 0 5-4 8-4s3 8 6 8 2-4 2-4`.
    * text column `flex 1 gap 3` at x 104: title **17/700** (`#F2F0EC` / `#111111`), sub **13/400**
      (`#9B968E` / `rgba(17,17,17,0.6)`).
    * right: off = `chevronR` svg 14×14 `M5 2l5 5-5 5` stroke **`#5A574F`** 2 (x 335); on = `10×10 r5`
      dot **`#1E1E1E`** (x 339) — not the kit's white dot.
    * bg: off `#1E1E1E`, on `#F2F0EC`.
  * primary `Continue` bottom 48.
* **Copy:** titles unchanged; **new subs**: `Mood, energy, the pledge` / `How strong, what fed it, what you did`
  / `When, what fed it, what changes`. Title `What are you logging?` unchanged but now left h1.
* **Change:** delete `CheckinScene/UrgeScene/LapseScene/GroundEllipse`, the `LinearGradient`s and the
  imports from `(app)/log`; build three option rows + hero. X stays `router.navigate('/(app)/log')`.
* **Preserve:** radio semantics (`accessibilityRole="radio"`, `checked`), `Continue` → `OPTIONS[picked].route`
  (`/checkin`, `/urge-log`, `/lapse`), X → log (D124). No tab bar.

### 3.2 `90B · Lapse — When` — Lapse-When.html

* **Route/state:** `/lapse` step 0. Frame: chip `Just now` on, wheel at **11 : 40 PM**, date row
  `Tonight, Tue Jul 22` → pin the page clock to **Tue 2025-07-22 23:40** (§9). The recipe's
  `tapAt(196, 286)` to open the wheel is obsolete: **the wheel is always visible now.**
* **App today:** `FlowTop` (Back word + three 36×4 bars + X), centred 22/500 heading at 84, white chips,
  a `Choose a time` link that toggles a white 4-column wheel card (date/hour/min/meridiem) with Cancel/Save.
* **Frame draws:**
  * flow nav 1/3 (3 dashes on).
  * `stack(136, gap 14)`: h1 `When did it happen?` (y 136); spacer **2**; chip row `flex gap 10` (y 199):
    `h44 r22 padding 0 18`, 14/700 nowrap — on `#F2F0EC`/`#111111`, off `#1E1E1E`/`#F2F0EC`
    (`Just now` 91.3 @24, `Earlier today` 116.5 @125.3, `Yesterday` 98.8 @251.8); spacer 6;
    caps `Or choose a time` (y 277, h16); **time picker** (y 307, h 220); **date row** (y 541).
  * time picker (kit `timePicker`, identical to the reminders frames — see paywall-reminders.md §7):
    box `relative h220 justify center gap 10`; band `absolute left 40 right 40 top 88 h44 r14 #1E1E1E`
    → x 64–329, y 395–439; columns row `relative flex gap 12` centred (x 74.5–318.5): hour col **70**,
    colon col (`h220 align center`, `:` 30/700 `#F2F0EC`, 8 wide at 156.5), minute col **70** (176.5),
    meridiem col **60** (258.5). Each col 5 rows × `h44` centred: row 2 **30/900 `#F2F0EC`**, rows 1/3
    22/400 `#9B968E`, rows 0/4 22/400 `#2E2E2E`. Values: `9 10 [11] 12 1` · `38 39 [40] 41 42` ·
    `'' AM [PM] '' ''` (2-item period wheel, AM above PM).
  * date row: `h44 r14 #1E1E1E padding 0 6 0 18`, `space-between`: text 15/700 `#F2F0EC`
    `Tonight, Tue Jul 22` (x 42, y 554); `Change` button `h32 r16 bg #0D0D0D padding 0 14` 13/700 `#F2F0EC`
    (x 291, y 547, 72 wide).
  * primary `Continue`.
* **Copy:** `Choose a time` (link) → `Or choose a time` (caps label); **new** date row string
  `<dayPart>, <Wkd> <Mon> <d>` and `Change`; wheel `Cancel`/`Save` removed.
* **Change:** replace FlowTop/Heading/chips/TimeWheel with flow nav + `WhenPicker` (chips, caps, wheel, date
  row). The wheel is interactive (scroll-snap 44 per row; hours/minutes loop; AM/PM a 2-value column) — reuse
  the wheel the paywall-reminders group is rebuilding in `src/components/routines/wheel.tsx` (same geometry),
  but it must take a **timestamp** (hour12/minute/pm) not a routine `HH:MM` string (§7).
* **Preserve:** chips set `at = now − offset` (`WHEN_CHIPS`: 0 / 4 h / 24 h); a wheel move overrides the chips
  (`customAt`, chips all off); clock read once on mount; Back on step 0 = close; X = close
  (`router.back()` or `/(app)/log`). The old wheel's **date column** (±2 days) becomes the `Change` button —
  the only way left to move the day (Q4).

### 3.3 `90C · Lapse — What fed it` — Lapse-Trigger.html

* **Route/state:** `/lapse` step 1 after `Continue`; tap `Late night` then `Boredom` (order matters for §3.4).
* **App today:** centred heading, 14.5 sub at 132, a 3×3 grid of 112-high white tiles with `TriggerMark`
  glyphs, `Continue · N` CTA disabled at 0.34 until something is picked.
* **Frame draws:** flow nav 2/3 (5 on). Hero `match` T 506 s 1.1. `stack(136, gap 8)`: h1 `What fed it?`;
  p `Tap all that apply.` 15/400 lh 22 `#9B968E` (y 177); spacer 6; chips (y 221): `Stress, Boredom, Lonely,
  Tired, Social, Phone, Late night, Argument, Craving` wrapping into rows at y 221 / 281 / 341 / 401
  (`Stress Boredom Lonely` · `Tired Social Phone` · `Late night Argument` · `Craving`). Primary **`Continue`**.
* **Copy:** CTA `Continue · 2` → **`Continue`** (no count, in any state). Sub unchanged.
* **Change:** `TriggerCard`/`TRIGGERS.mark`/`triggerTileWidth` → chips. `TriggerMark` stops being used here
  (the canvas's malformed `Craving` path no longer matters).
* **Preserve:** multi-select toggle in tap order; `checkbox` role; tapping Continue saves the lapse
  (`createEvent({type:'lapse', trigger: triggers.join(' · '), createdAt: at})`, storage join stays `' · '`),
  sets `tideline.letter.pending`, then step 2; `Logging…` while saving. Disabled-with-0 state is not drawn (Q3).

### 3.4 `90D · Lapse — Logged` — Lapse-Done.html

* **Route/state:** `/lapse` step 2. Frame values: `When` **`Last night`**, `Set off by` **`Late night,
  boredom`**, `Changed` `Phone charges outside bedroom` (today's check-in `dailyAction`, as now). With the
  clock pinned to Tue 22 23:40, tap `Yesterday` → Mon 21 23:40 → `Last night` under the day-part rule (Q5).
* **App today:** `LoggedNote` (notebook + pen + glow art), 27/500 `Slip logged.` at 262, white 18-radius card.
* **Frame draws (`doneScreen`):** close-only nav. Check disc row `top 200` centred: `84×84 r42 #F2F0EC`,
  `check` svg **36×36** (viewBox 14 → the 2.2 stroke renders 5.66 wide) stroke `#111111` (box 154.5,200).
  `stack(308, center, gap 12)`: h1 centred `Slip logged.`; p centred `Stopped, logged, and one thing changed
  for next time.` (2 lines: `…changed for` / `next time.`, box 24,353,345×48); spacer 6 (y 413); **summary
  card, shrink-to-fit and centred** (x 33.5, y 431, **326×164**): `r22 #1E1E1E overflow hidden`; rows
  `flex; space-between; align flex-start; gap 16; padding 16 20`; rows 2–3 `border-top 1px #2E2E2E` (54/55/55
  tall); label 14/700 `#9B968E` nowrap `padding-top 1` (box h18); value **15/700 `#F2F0EC` right-aligned
  lh 22**. Primary `Continue`.
* **Copy:** **new** sub `Stopped, logged, and one thing changed for next time.`; `Set off by` joins with
  **`, `** and lower-cases every item after the first (`Late night, boredom`) — display only (Q6); `When`
  reads a day-part phrase (`Last night`), not a chip label/stamp (Q5).
* **Change:** drop `LoggedNote` + `SummaryRow`; build `DoneSummary` (disc, h1, p, card). The card's width
  is the widest row (`label + 16 + value + 40`), max 345 — in RN a child of an `alignItems:'center'` column
  with no width shrinks to content; give it `maxWidth:'100%'` and the value `flexShrink:1`.
* **Preserve:** X and `Continue` both close; the `Changed` row still reads today's `dailyAction` (`—` if none).

### 3.5 `91 · Log — Urges` — Log-Urges.html

* **Route/state:** `/log` default tab. Frame's world: today = **Sunday Jul 20 2025** (strip's last `S` is ink).
* **App today:** Back word + 27/600 title + white sunken switch, a 361×128 warm summary card (`3 urges` /
  `All ridden out`), then grouped white 64pt slips (`Late night · Intense`, `Tuesday · 11:40 pm`,
  `rode it out`, chevron) with `Last week` / `Earlier` captions.
* **Frame draws:** title head (`Your log`, empty right slot); segmented `Urges | Check-ins | Reports`
  (Urges on); **big stat** `3` / `Urges this week`; **week strip** (top 352): days with urges → `34×34 r17
  #F2F0EC` disc with the count 14/700 `#111111` (y 353), days without → `8×8 r4 #2E2E2E` dot (y 366);
  strip in the frame `M· T1 W· T1 F1 S· S·`. **Ruled rows** (top 440, h52), newest first across both weeks,
  no captions: `Fri, 9:05 pm · Strong` / `Thu, 3:10 pm · Mild` / `Tue, 11:40 pm · Intense` /
  `Sun, 10:22 pm · ●Slipped` / `Wed, 12:05 am · Mild`. Tab bar (Log active).
* **Copy:** card title/note → big number + `Urges this week`; row title `<trigger> · <severity>` + `when` +
  outcome word → left **`<Wkd>, <h:mm am>`** (short weekday, comma, lowercase meridiem) and right
  **`<Severity>`** (Faint/Mild/Strong/Intense/Overwhelming via `severityWord`) or **`Slipped`** with dot for a
  `lapse` / `urge_acted_on`. `Last week` / `Earlier` captions removed. Empty-state copy kept (§5).
* **Change:** "this week" becomes the **Monday-start calendar week** (strip is `M…S`; app uses rolling 7 days
  now — Q15). Count source: urges = `urge_rode_out` + `urge_acted_on` (+ `lapse`? Q15). Whole page scrolls
  (title included, as now) with `paddingBottom ≥ 104` so the last row clears the bar. Remove `SummaryCard`,
  `Grouped`, `LogGroup`, `TriggerGlyph`, `LogRow`, `RowChevron`, `Halo`, `SunDisc`, `ramp150`.
* **D127 is settled by this frame:** the list is now newest-first throughout (Fri, Thu, Tue, Sun, Wed).
* **Preserve:** `accessibilityRole="tab"` on the segments (recipes fire `[role="tab"]`), back → `/log-chooser`,
  rows are not tappable (they aren't now).

### 3.6 `91-2 · Log — Check-ins` — Log-Check-ins.html

* **Route/state:** `/log`, `Check-ins` segment. Same Sunday.
* **Frame draws:** big stat **`12`** / **`Days in a row`**; strip: every day has a check-in → `#F2F0EC`
  circle of diameter **29.6** (M W T S S) or **25.2** (T F), centred in the 36 slot (`r 50%`); ruled rows
  (top 440): `Today · Steady`, `Yesterday · Flat`, `Friday · Good`, `Thursday · Good`, `Wednesday · Calm`.
* **Copy:** card `7 check-ins` / `12 mornings in a row` → `12` / `Days in a row`; row title
  `Mood 4/5 · 7h sleep` + `Today · 8:44 am` + lowercase word → left **day word only** (`Today`, `Yesterday`,
  full weekday — `dayWord` already does this) and right **capitalised reading word**.
* **Diameter rule:** 29.6 and 25.2 fit exactly `d = 12 + 4.4·v` with v = 4 / 3 (1–5 scale → 16.4…34). The
  frame's own words (`Steady` = mood 3, `Good` = mood 4) do **not** follow the same v as the circles (Friday
  `Good` is small, Saturday `Flat` big), so v must be a different field — **energy** is the obvious one (Q9).
  Days with no check-in (or future days when today is not Sunday) → the 8×8 `#2E2E2E` dot of §3.5.
* **Reading word:** frame vocabulary `Steady, Flat, Good, Good, Calm`. `Steady/Good` are the morning
  `MOOD_READ` words (3/4); `Flat`/`Calm` are night-emotion words (`EMOTION_ROWS`). Proposed rule: first night
  emotion if the day has one, else the morning mood word (`Rough/Low/Steady/Good/Great`). Q9.
* **Preserve:** streak = consecutive days back from today (yesterday if today not yet logged) — `streakNote`
  logic, now rendered as a number (`0` allowed; singular `Day in a row` is not drawn — Q9).

### 3.7 `91-3 · Log — Reports` — Log-Reports.html

* **Route/state:** `/log`, `Reports` segment. Frame's world: latest closed week = Jul 14–20 2025
  (today ≥ Mon Jul 21).
* **Frame draws:** big stat **`1,240`** / **`+12 this week`** (latest closed week's score and delta);
  sparkline: `div left 0 right 0 top 352 flex center` → svg **220×56** (x 86.5) viewBox `0 0 220 56`: path
  `M4 48 C 40 46, 60 38, 90 36 C 120 34, 140 22, 170 16 C 190 12, 204 8, 216 6` stroke `#F2F0EC` 3 linecap
  round, no fill; end dot `circle 216,6 r5 #F2F0EC`. CTA **pill** `left 24 right 24 top 432 h52 r26 #F2F0EC`,
  15/700 `#111111` `Open this week’s report` (curly ’). Ruled rows (top 518): `Jul 7–13 · +8`,
  `Jun 30 – Jul 6 · −4`, `Jun 23–29 · +6`, `Jun 16–22 · +5` (right text `#9B968E` for both signs, true minus).
* **Copy:** night card (label + `1,240 · +12 this week` + gold spark) → number/caption/spark/pill; caption
  `Earlier weeks` removed; row sub `Score 1,228 · 4 urges · 0 relapses` and chevron removed; **month-straddling
  label** `Jun 30–Jul 6` → **`Jun 30 – Jul 6`** (spaced en dash — `weeklyReport.ts` already formats it that
  way; `log.tsx`'s own `weekLabel` does not → use the lib's).
* **Change:** the spark plots the closed-week scores oldest→newest into x 4…216, y 48…6 (min→max) with the
  existing Catmull-Rom `smoothPath`; no gradient fill, no ring on the end dot. One week: flat at y 6 from x 4.
* **Preserve:** `reportWeeks()` arithmetic, rows tap → `/weekly-report?week=<key>` (no chevron drawn),
  `Open this week’s report` → `/weekly-report` (latest). Empty (no closed week) → §5.

### 3.8 `91A · Urge Overview — Summary` — Urge-Overview-Summary.html

* **Route/state:** `/urge-overview` page 0 (`Overview` segment).
* **App today:** Back word, range text `Jul 14–20` top-right, 27/600 title, sunken switch, a white
  3-row summary card, a `This week` caption and a white week list (oldest first, `rode it out · 4 min`).
* **Frame draws:** title head `Urge overview` + **pill `Last 30 days`**; segmented
  `Overview | Strength | Mood | Timing` (4 items); big stat **`9`** / **`Urges, 7 ridden out`**; ruled rows
  (top **372**, h52): `Jul 19 · ●Slipped`, `Jul 17 · 6 min`, `Jul 15 · 4 min`, `Jul 13 · ●Slipped`,
  `Jul 9 · 3 min` — **newest first**, left `<Mon> <d>`, right `<m> min` (`durationSeconds/60`, ≥1) or slip.
* **Copy:** all card rows (`Urges logged`, `Average intensity`, `Ridden out, start to finish`), `This week`,
  stamps `Tue Jul 15 · 7:42 PM`, outcomes `rode it out · 4 min` / `ended in a slip` → removed/replaced as
  above. Range `Jul 14–20` → `Last 30 days`.
* **Change:** range = last 30 days (Q10 for `?week=`); order flips to newest first (reverses D127 for the
  overview); the frame shows **5 rows for 9 urges** → cap at the 5 most recent (Q10). Insight cards removed on
  all four pages.
* **Preserve:** horizontal pager + segmented control kept in sync (D065 `onScroll`), header standing still
  over the pages, `LoadingView` while events load, back → `back()`/`/(app)/log`.

### 3.9 `91B · Urge Overview — Strength` — Urge-Overview.html

* **Frame draws:** big stat word **`Strong`** (44/700 ls −1.5 lh 67, box 135.3,236) / **`Most urges`**;
  **intensity histogram** `left 40 right 40 top 352`, `column gap 12`: (a) bins row `flex; align flex-end;
  h96`, five `flex 1` columns (62.6 wide), each `column-reverse; align center; gap 7` of **12×12 r6
  `#F2F0EC`** dots, one per urge in that band (frame 1/1/3/3/1, bottom dot y 436, pitch 19); (b) rule
  `h1 #2E2E2E` (y 460); (c) labels `1 2 3 4 5` 13/700 **`#F2F0EC`** centred (y 473). **Trigger dot rows**
  (top 524, h46): `Stress ●●●●● 5`, `Late night ●●●● 4`, `Boredom ●●● 3`, `Tiredness ● 1`.
* **Data rules:** word = `INTENSITY_BANDS[mode].label` of the urges' bands (`band = (severity−2)/2`); tie →
  lowest band wins (frame: bins 3 and 4 tie at 3 → `Strong`). Triggers = tally of every `' · '`-split trigger,
  top 4, `TRIGGER_NOUN` (`Tired`→`Tiredness`, D128) kept.
* **Copy:** `Common triggers` heading, coloured bars and insight (`Stress on top`, `most common`, `Most land …
  The evening drill helps.`) removed.
* Overflow: the 96 slot fits 5 dots (Q10 for > 5 per bin); a label column of 96 + 13 dots fits 345 (cap).

### 3.10 `91C · Urge Overview — Mood` — Urge-Overview-Mood.html

* **Frame draws:** big word **`Tense`** / **`Before most urges`**; bubbles `left 24 right 24 top 352 flex
  center align flex-start gap 26`: each item `column align center gap 12` = a `h92 align flex-end` slot
  holding a `#F2F0EC` circle + a `column gap 2` of name 14/700 `#F2F0EC` and count 12/700 `#9B968E`.
  Frame: `Tense 6` d **88** (x 35.5), `Flat 4` d **66**, `Restless 3` d **54**, `Low 1` d **36**; names at y 456,
  counts 475.
* **Sizes:** 88/66/54/36 fit no single formula of count (linear gives 88/66/55/33; area gives 88/72/62/36).
  They are a **fixed rank series** — size by rank, count printed under it (Q10). Max 4 bubbles.
* **Data:** tally of `precedingState.feeling` (fallback HALT booleans → `STATE_WORD`, as now), top 4.
* **Copy:** `Mood before the urge` heading, percentage bars, insight (`Tense first`, `7 in 10 urges`,
  `Two minutes of unclenching beats the spike.`) removed; percentages become counts.
* Contradiction: counts sum to **14** while Summary says 9 urges (Q10, D126-style).

### 3.11 `91D · Urge Overview — When & Where` — Urge-Overview-When.html

* **Frame draws (no big stat on this page):** dial `div left 0 right 0 top 248 flex center` → svg
  **236×236** (x 78.5) viewBox `0 0 236 236`, `overflow visible`:
  * ring `circle 118,118 r96` stroke `#2E2E2E` 2, no fill.
  * 24 hour ticks at angle a = h·15° clockwise from top (`x = 118 + r·sin a`, `y = 118 − r·cos a`, 1 decimal):
    h % 6 = 0 → r 86→96 stroke **`#9B968E` 2**; else r 90→96 stroke **`#2E2E2E` 1.5**; linecap round.
  * one dot per hour bucket with urges, at angle **(h + 0.5)·15°, radius 96**, fill `#F2F0EC`, **r 7.5 for 1
    urge, 10 for 2** (r = 5 + 2.5·count — Q10 for ≥3), drawn in ascending hour order (frame: 0,1,15,19,21,22,23;
    `(130.5,22.8) r10`, `(154.7,29.3)`, `(41.8,176.4)`, `(29.3,81.3)`, `(59.6,41.8)`, `(81.3,29.3)`,
    `(105.5,22.8) r10`).
  * labels 11/700 `#9B968E` middle: `12 am` (118,8), `6 am` (236,122), `12 pm` (118,238), `6 pm` (0,122) —
    they overhang the 236 box (x −12…248, y −5…241): pad the RN `<Svg>` ≥ 20 each side and offset.
  * centre: `11 pm – 1 am` (118,120) **20/700 ls −0.4 `#F2F0EC`**; `Most urges` (118,142) 12/**600→700**
    `#9B968E`.
  * place dot rows (top **540**, h46): `Bedroom ●●●●● 5`, `Desk ●●● 3`, `Bathroom ● 1` — **no `1.`/`2.`
    numbering, no zero rows** (D126's `Bathroom 0` is gone: 5+3+1 = 9 = the dial's dots).
* **Data:** peak window = the 2-hour window (wrapping) with most urges — start 23 → `11 pm – 1 am` (the app's
  `clockHour(peak)` / `clockHour(peak+2)` already formats `h am/pm`; pick the window by a sliding sum, not by
  the single top hour, which ties 23 vs 0 here). Places = tally of `precedingState.location ?? note`, top 3.
* **Copy:** `When they hit` band glyph row, `Where they showed up`, `1.` numbering, insight
  (`11 pm – 1 am`/`peak window`/`BAND_ADVICE`) removed; `Most urges` new.

### 3.12 `91C0 · Report Ready` — Report-Ready.html

* **Route/state:** `/report-ready?week=2025-07-14` (or from the `(app)/_layout` gate).
* **App today:** two warm washes, a rotated white report sheet with glow and shadow, 24/500 title,
  15.5 sub, 56-high button at 634, `Later` at 710.
* **Frame draws:** close-only nav; hero **`chartUp`** T **190** s 1.1 (easel board with a rising line, floor
  line edge to edge at y≈380); `stack(452, center, gap 18)`: h1 centred **30/700 ls −0.6 lh 36**
  `Your weekly report is ready.` on **two balanced lines** `Your weekly` / `report is ready.` (box 72 high — write
  `'Your weekly\nreport is ready.'`); p centred 15/400 lh 24 `#B5B0A8` **`Jul 14–20: score, days and urges.`**
  (y 542). Primary `Open the report` **bottom 96**; ghost `Later` bottom 60.
* **Copy:** sub `Score, urges, and the pattern — two quiet minutes.` → **`<week label>: score, days and urges.`**
  (label from `buildWeeklyReport(week).label`; no week param → `latestCompletedWeek`).
* **Change:** delete washes, `ReportArt`; hero + stack + primary + ghost.
* **Preserve:** X and `Later` → `back()` or `/(app)/today`; `Open the report` → `replace('/weekly-report?week=')`.

### 3.13 `91C · Weekly Report — Score` — Weekly-Report.html

* **Route/state:** `/weekly-report?week=2025-07-14` page 0. Settings' `Settings-Weekly-Report.html` (settings
  group) is **byte-identical** — the `from=settings` variant no longer says `Settings` anywhere.
* **App today:** Back/Settings word row, range text, 27/600 title, a warm 361×106 stats card
  (`7 check-ins · 3 urges · 0 relapses`), section titles, area-filled curve with axis labels, a floating score
  pill, a white verdict card, page dots at 630.
* **Frame draws:** title head `Weekly report` + pill `Jul 14–20`; segmented **`Score | Days | Urges`**; big stat
  **`1,240`** / **`+12 this week`**; chart `left 32 right 32 top 352`: svg **width 100% (329) × 140**,
  viewBox `0 0 330 140`, **`preserveAspectRatio="none"`**: polyline (`L` segments, not curves)
  stroke `#F2F0EC` 3 round/round through 7 points `x = 16 + 49.7·i`; points 0–5 `r4.5 fill #0D0D0D stroke
  #F2F0EC 2.5`; point 6 **`r6.5 fill #F2F0EC`**; day letters `M T W T F S S` at y 136, 12px middle — `#9B968E`
  weight 600 (→ Lato 700) for 0–5, **`#F2F0EC` weight 800 (→ Lato 900 Black)** for the last.
* **Y mapping (derived):** the frame's ys `108, 93.3, 78.7, 71.3, 49.3, 34.7, 20` are exactly
  `108 − 88·(v−min)/(max−min)` for daily scores rising 0,2,4,5,8,10,12 — i.e. min → 108, max → 20. Flat week →
  draw at y 64 (Q12). Values = `scoreAt()` at each day's end (already computed); gain = `values[6] − base`.
* **Copy removed:** `Recovery score`, `steady climb`/`a dip, then back`/`holding` pill, axis values, the score
  pill, verdict (`+N points`, `this week`, three body lines), page dots, stats card, `Settings`/`Back` words.
  New: `+<gain> this week` (true minus for a loss: `−4 this week` — Q12).
* **Preserve:** pager + segmented (tap scrolls, swipe updates), `?week=`/latest, `?from=` back target, both
  empty states, `LoadingView`, `scoreAt` arithmetic (D097: `+12` is not reachable from `+48` weights — Q12).

### 3.14 `91C2 · Weekly Report — Days` — Weekly-Report-Days.html

* **Frame draws:** big stat **`7 of 7`** / **`Clean days`**; day row `left 32 right 32 top 352`, 7 columns
  `width 40` space-between (x 32, 80.2, 128.3, 176.5, 224.7, 272.8, 321), column gap 10: cell `40×40 r20` +
  label 11/700 `#5A574F` (last `#F2F0EC`, y 402):
  * clean day → bg `#F2F0EC` + `check` 16×16 (viewBox 14) stroke `#111111` 2.2;
  * urge ridden out → transparent with **inset** ring `0 0 0 2px #F2F0EC` (RN `borderWidth 2` is exact here,
    the ring is inside) + wave svg 16×16 viewBox 16 `M2 9c2.5 0 3-4 5-4s3 4 5 4 2-2 2-2` stroke `#F2F0EC` 2 round.
  * `Last week` block `left 32 right 32 top 450 column gap 16`: caps-style centred 13/700 `#9B968E`
    `Last week` (y 450); row `space-between padding 0 11` of **18×18 r9** dots: filled `#F2F0EC` or hollow
    (transparent + inset `0 0 0 1.5px #2E2E2E`) — frame `● ● ○ ● ● ○ ●`, y 482.
* **Copy removed:** `Day by day`, `This week`/`Last week` well rows (mood tones), verdict
  (`Stronger week`, `vs Jul 7–13`, `Five steady days of seven. Friday was the test.`). D125/D129 no longer apply.
* **Rules (Q11):** clean day = no `lapse`/`urge_acted_on` that day; wave = a day with an urge ridden out and no
  slip; plain check otherwise. **Contradiction:** the same week's urges page lists Tue, Thu and Fri urges, yet
  only Friday carries the wave. A slip day and a no-data day are not drawn (proposed: hollow 40 ring
  `#2E2E2E` 1.5, no glyph). Last week: filled = clean, hollow = slip or no data.

### 3.15 `91C3 · Weekly Report — Urges` — Weekly-Report-Urges.html

* **Frame draws:** big stat **`3`** / **`Urges, all ridden out`**; ruled rows (top 372) **h56** (57 with
  border): `Tue, 11:40 pm · Intense`, `Thu, 3:10 pm · Mild`, `Fri, 9:05 pm · Strong` — **oldest first**
  (the week read forward; the Log tab reads newest first).
* **Caption rule:** `all ridden out` when ridden = total, else `<n> ridden out` (the overview's form); 0 urges
  and 1 urge not drawn (Q12). D126's `2 of 3` contradiction is gone — the frame now agrees with the Log.
* **Copy removed:** `This week’s urges`, the white slips (trigger glyph, `Late night · Intense`,
  `Tuesday · 11:40 pm`, `rode it out`), verdict (`3 of 3 ridden out`, `no relapse`, `The timer did its job …`).
* **Preserve:** row tap → `/urge-overview?week=<weekStart>` (no chevron drawn — Q13); all urges of the week,
  not just 3 (page scrolls if long).

### 3.16 `91D · Urge Log — Intensity` — Urge-Log-Intensity.html

* **Route/state:** `/urge-log` step 0; default band index 3 (`Intense`) = the frame — keep.
* **App today:** five 48pt discs (white / ink with a ring), 19/600 label at 406, 13.5 note.
* **Frame draws:** flow nav 1/4 (2 on); hero **`thermometer` T 506 s 1.062**; h1 `How strong was the urge?`
  (stack 136, gap 20); bars `left 0 right 0 top 232`, `column align center gap 14`: row `flex align flex-end
  justify center gap 14 h150` of five **46-wide** bars, heights **46 / 72 / 98 / 124 / 150** (46 + 26i), `r15`
  (x 53.5 / 113.5 / 173.5 / 233.5 / 293.5); off = `#1E1E1E` + **outside** ring `0 0 0 1.5px #2E2E2E`;
  on = `#F2F0EC`, no ring, holding an `8×8 r4 #1E1E1E` dot at `padding-top 12` (centred; y 270 on bar 4).
  Number row `gap 14`: `1…5` in 46-wide boxes, 13/700, on `#F2F0EC`, off `#5A574F` (y 396). Reading
  `stack(440, center, gap 6)`: band word **30/700 ls −0.6** (lh normal → 36) `#F2F0EC`; note p 15/400 lh 24
  `#B5B0A8` (y 482). Primary `Continue`.
* **Copy:** unchanged strings (`INTENSITY_BANDS`), numbers 1–5 new.
* **Preserve:** bars are radio buttons (role `radio`, label = band, `checked`); value → `bandToSeverity`.

### 3.17 `91E · Urge Log — Triggers` — Urge-Log-Trigger.html

Identical to §3.3 except: flow nav **2/4 (4 on)** and h1 **`What set it off?`** (diffed). Same chips, same
`match` hero, same `Continue`. Here Continue does not save — it goes to step 2. Same Q3.

### 3.18 `91F · Urge Log — Outcome` — Urge-Log-Outcome.html

* **Frame draws:** flow nav 3/4 (6 on); hero **`clipboard` T 506 s 0.989**; `stack(136, gap 8)`: h1
  `What did you do?`; spacer 6; options at y 191 / 261 / 331 / 401 / 471: `Rode it out` (on), `Surfed with the
  timer`, `Distracted myself`, `Reached out`, `I slipped`. Primary `Continue`.
* **Change:** `OutcomeRow` (white row, mark square, radio circle) → kit option rows. `Outcome*` marks unused.
* **Preserve:** single-select, default 0, `OUTCOMES[i].type` / `slip` / `whatHelped` semantics.

### 3.19 `91G · Urge Log — When` — Urge-Log-When.html

Identical to §3.2 except: flow nav **4/4 (all 8 on)**, h1 **`When was it?`**, primary **`Log the urge`**
(diffed). Old `Specify time` link → `Or choose a time` (caps). `Log the urge` saves:
`createEvent({type, severity: bandToSeverity(i), trigger: join(' · '), whatHelped, createdAt: at})`, sets
`tideline.letter.pending` (slip) or `tideline.post.backondeck.pending` (ridden), `Logging…` while saving.

### 3.20 `91H · Urge Log — Logged` — Urge-Log-Done.html

* **Frame draws:** same `DoneSummary` as §3.4: h1 `Urge logged.`; p **`Twenty-three ridden out. Two to Bronze.`**
  (one line, box 24,353,345×24); card at y **407**, **249 wide** (x 72): `Intensity · Intense`,
  `Set off by · Late night, boredom`, `What I did · Rode it out`. Primary **`Done`**.
* **New dynamic sub:** `<N in words, capitalised> ridden out. <M in words, capitalised> to <Metal>.` where
  N = count of `urge_rode_out` events including this one (the Vici medallion's count; `Tiers Vici` draws ×23
  → next ×25 = Bronze — consistent), next step = `KK_ALBUM.vici.steps[kkStanding]`, metal =
  `KK_METALS[standing]` capitalised (`Paper` below 5, `Bronze` 5–24, …). Needs a number-to-words helper
  (one…one thousand). Undrawn: past ×1,000 (no `to` clause), and `I slipped` (no ride-out) — Q7.
* **Copy removed:** `LoggedNote`; 27/500 title; the card's old 12.5/600 labels.
* **Preserve:** X and `Done` close.

---

## 4. Functionality to preserve (cross-cutting)

1. Every save path above (event shapes, `' · '` storage join, pending-letter / medallion-post keys, saving
   label, single save per flow).
2. Back on the first step closes; back elsewhere steps back; X always closes; close = `router.back()` when
   possible else `/(app)/log`.
3. Clock read once per flow (`useState(() => Date.now())`), wheel override vs chips, `WHEN_CHIPS` offsets.
4. Log tab: three registers on a switch with `role="tab"`; reports open the week; streak math; report-week
   arithmetic (`reportWeeks`, `SCORE_WEIGHTS`).
5. Overview + weekly report: horizontal pager kept in sync with the segmented control both ways (D065), fixed
   header over the pager, `?week=` param, `?from=settings` back target, loading + both empty states.
6. Report-ready gate (`(app)/_layout`, orchestrator) still pushes `/report-ready?week=` once per closed week.
7. Accessibility roles used by recipes: chooser cards / outcome rows / intensity bars `radio`, chips
   `checkbox`, segments `tab`, buttons `button`.
8. `src/app/(app)/all.tsx` dev drawer entries (`Log an urge`, `Log a lapse`, `Log chooser`, `The log`,
   `Urge overview`, `Weekly report`, `Report ready`) keep working.

---

## 5. App screens/states in this area that no frame draws (still need the new look)

| state | where | closest frame / proposal |
|---|---|---|
| Log · Urges empty (no urges ever) | `(app)/log.tsx` | Log-Urges header + big `0` / `Urges this week` + all-dot strip; in place of rows a centred p 15/400 lh 24 `#9B968E` `When a wave hits, logging it is what turns it into data.` (kit `p`). Drop the `tide` Illustration `EmptyState`. |
| Log · Check-ins empty | same | Log-Check-ins with `0` / `Days in a row`, all-dot strip, p `Twenty seconds in the morning starts one.` |
| Log · Reports empty (no closed week) | same | Log-Reports header; no big stat/spark/CTA; p `The first one arrives once a full week has closed.` |
| Log rows older than 13 days | same | ruled row, left `<Mon> <d>, <h:mm am>` (Q8); urge with no severity → right `Ridden out` `#9B968E` (Q8) |
| Strip on Mon–Sat (today not the last column) | same | today's label ink at its own column; future days 8px `#2E2E2E` dot |
| Overview empty range / page with no data | `urge-overview.tsx` | big stat `0` / `Urges, 0 ridden out`; other pages: big word `—`? → propose p `Nothing logged in the last 30 days.` at y 352 (kit p `#9B968E`) |
| Overview loading | same | `LoadingView` on `#0D0D0D` (spinner colour `#9B968E`) |
| Overview via `?week=` | same | pill shows the week label (`Jul 14–20`) instead of `Last 30 days` (Q10) |
| Weekly report empty: no closed week / nothing logged | `weekly-report.tsx` | title head (pill omitted) + p 15/400 lh 24 `#B5B0A8` at y 164 with the existing two sentences |
| Weekly report loading | same | `LoadingView` |
| Weekly Days: slip day, day before account start | same | hollow 40 cell with `#2E2E2E` 1.5 inset ring, no glyph (Q11) |
| Weekly Urges: a slipped urge | same | ruled slip variant (`●Slipped`) |
| Flow step with 0 chips selected | `lapse`/`urge-log` | primary at reduced opacity (0.34 as now) or enabled (Q3) |
| Saving (`Logging…`) | same | primary label swap, as now |
| Date `Change` control | `WhenPicker` | kit `sheet(top, options)`: last 7 days as `options` rows (`Tonight, Tue Jul 22`, `Last night, Mon Jul 21`, `Sun Jul 20` …) — Q4 |
| Wheel moved (no chip selected) | same | all three chips off (`#1E1E1E`) |
| Urge-Log-Done after `I slipped` | `urge-log.tsx` | Done frame without the p line, or a fixed line (Q7) |
| Log chooser with `Daily check-in` / `A lapse` selected | `log-chooser.tsx` | same row anatomy, on-colours on that row |

---

## 6. Other phone sizes (375×667, 390×844, 430×932)

* **Heroes at T 506** (Chooser, both Trigger pages, Intensity, Outcome) sit in the band between content
  (ends ≤ 529) and the primary (746). On 667 the primary is at 561 and that band does not exist: anchor the
  hero off the **bottom** (`top = H − 346` in canvas terms, i.e. 852 − 506) and **hide it** when its art top
  (`H − 346 + (art top − 506)`, e.g. notebook +86.6, match +25, thermometer +37, clipboard +61) would cross the
  content's bottom + 12. On 852 this is the frame exactly.
* **Report-Ready:** on 667 the stack (452−54+20 = 418…532) collides with the primary (513). Scale/hide the
  hero and hang the stack from the primary (stack bottom = primary top − 132 as on the canvas: 566 vs 698).
* **Done screens:** Lapse card bottom 595 → 561 on a 20-inset 667 screen, touching the primary at 561. Wrap
  the step body in a ScrollView or shift the disc/stack up on short screens.
* **When step:** date row ends 585 → 551 on 667, 10 above the primary. Fits; keep it in a ScrollView anyway.
* **Width 375:** chips row 1 (`Just now`+`Earlier today`+`Yesterday` = 326.6) fits the 327 inner width with
  0.4 to spare — do not add padding. Trigger chips wrap identically at 327 and 345. Mood bubbles total 322 ≤ 327.
  Chooser sub `How strong, what fed it, what you did` is 219 wide on 393 and 197 is available on 375 → it wraps
  to two lines inside the 84 row (fits) — or `numberOfLines={1}`; pick one and check.
* **Width 430:** heroes are 393-wide boxes at `left:0` → centre them (`left:(W−393)/2`); the chartUp floor line
  must still run edge to edge (widen that Svg to W and shift the viewBox).
* All tab pages scroll (`paddingBottom` = tab bar 104 + inset); overview/report pages scroll vertically inside
  each pager page.

---

## 7. Shared files (requests, not edits) and ownership

| file | owner | what this group needs |
|---|---|---|
| `src/components/mono/*` | orchestrator | Frame (ground + `noise.png` 0.05), FlowNav (`step/total` 8 dashes, `back`, `close`), TitleHead (back + optional right pill + 32/38 title), Segmented (n items), Pill, H1 (size/lh), P, Caps, Primary (`bottom`, disabled style), Ghost, Chips (multi), Options (single, 15px label), Hero (`id`, `top`, `scale`), TabBar (`active`) — all with the numbers in §1. |
| `src/content/heroes.ts` (+ generator) | orchestrator / library proposal | `notebook`, `match`, `thermometer`, `clipboard`, `chartUp` with paint-order split and the clipboard's `<g transform>`. |
| `src/components/StoicTabBar.tsx` | orchestrator | restyle to kit `tabBar` (no ground, SOS disc `#F2F0EC` with `#111111` label). Keep Log → `/log-chooser` and Log active on `/log`. |
| `src/components/routines/wheel.tsx` | paywall-reminders group | the same 5-row/44-pitch/70-70-60 wheel; needs a **value/onChange per column** API (hour12, minute, period) so `WhenPicker` can drive it from a timestamp. Coordinate or fork. |
| `src/app/slip.tsx` | slip group | imports `FlowTop, GRID_GAP, GRID_GUTTER, LoggedNote, PrimaryButton, TimeWheel, triggerTileWidth, WHEN_CHIPS` from `./urge-log` — keep re-exports until they switch to `src/components/logflow/*`. `Slip-When` = `Lapse-When`. |
| `src/app/weekly-report.tsx` | **this group** | the settings group's `Settings-Weekly-Report` is the same board; they only verify `?from=settings`. |
| `src/lib/weeklyReport.ts` | this group (also read by `(app)/_layout`, `mail`, `all`) | add day-status helper (clean / ridden / slip / none) for Days; `hasReportContent` is mood-based — a week with urges but no check-ins delivers no report (Q12). |
| `src/app/(app)/_layout.tsx` | orchestrator | no change required. |
| `src/lib/theme.ts` | orchestrator | nothing new (`mono`, `sans`, `LATO` present). |

Files this group owns and rewrites: `src/app/log-chooser.tsx`, `src/app/lapse.tsx`, `src/app/urge-log.tsx`,
`src/app/(app)/log.tsx`, `src/app/urge-overview.tsx`, `src/app/report-ready.tsx`, `src/app/weekly-report.tsx`,
new `src/components/logflow/*` (WhenPicker, ChipsQuestion, DoneSummary, CheckDisc, RuledRow, DotRow,
BigStat, WeekStrip, UrgeDial, IntensityHistogram, MoodBubbles, ScoreLine, Spark), `src/lib/weeklyReport.ts`
(additions), seeds `.overhaul/logs*-seed.js` and `.overhaul/recipes/logs.json`.

---

## 8. Open questions and contradictions

1. **Q1 Chooser default:** frame selects `An urge`; app defaults to `Daily check-in`. Recommend default 1.
2. **Q2 Daily check-in route:** the new sub `Mood, energy, the pledge` describes the morning flow
   (`/day/morning`), but the card still routes to `/checkin` (night emotions). Keep or route via
   `checkinPartNow()`?
3. **Q3 Zero chips:** not drawn. App disables Continue; `relapse-workflow.md` says do not force a choice.
4. **Q4 `Change`:** the date control is drawn as a button only; the old wheel's day column is gone. Proposed
   sheet of the last 7 days (kit `sheet` + `options`).
5. **Q5 Day-part wording:** `Tonight, Tue Jul 22` and Lapse-Done `When · Last night` imply a rule: today →
   `Today` (before 18:00) / `Tonight` (18:00+); yesterday → `Yesterday` / `Last night`; older → `Sat Jul 19`
   (no prefix). Lapse-Done's `When` = that phrase alone. Lapse-When draws `Just now` while Lapse-Done says
   `Last night` (two sample states); D126's "Last night is unreachable" is resolved by this rule.
6. **Q6 Trigger display join:** `Late night, boredom` — `, ` and lower-case after the first item (display
   only; storage stays `' · '`). Generator says `Late night · Boredom`; frame wins.
7. **Q7 Urge-Done line:** spelled-out counts and metal names; behaviour for a slip outcome and past ×1,000 undrawn.
8. **Q8 Row dates/words:** >13 days old → `Jul 6, 9:05 pm`? Urge with no severity → `Ridden out`? Lapse rows
   (no severity) → `Slipped` (drawn).
9. **Q9 Check-ins:** disc size `12 + 4.4·v` (v = energy proposed) and reading word (night emotion else
   morning mood word) are inferences; `Calm`/`Flat` are not in the morning vocabulary; singular `Day in a row`.
10. **Q10 Overview:** `Last 30 days` vs the weekly report's `?week=` entry; Summary shows **5 rows for 9
    urges** (cap 5 proposed); Mood counts sum **14 ≠ 9** urges (one feeling per urge in the app — needs its own
    seed, as D126); bubble sizes are a rank series 88/66/54/36; overflow caps for >5 dots per intensity bin and
    long dot rows; dial dot radius for ≥3 urges in one hour (r = 5 + 2.5·n proposed, cap 12.5).
11. **Q11 Weekly Days:** Friday alone carries the wave though Tue/Thu/Fri urges exist on the Urges page;
    slip-day and no-data cells undrawn; last-week hollow meaning.
12. **Q12 Weekly numbers:** `1,240` / `+12` are D097's borrowed figures (seeded week gives +48); flat-week
    line placement; negative caption form (`−4 this week`); `0`/`1` urge captions; `hasReportContent` gate is
    mood-only while no page draws moods any more.
13. **Q13 Urges page → overview:** rows have no chevron; keep the tap to `/urge-overview?week=`?
14. **Q14 Log tab target** stays the chooser (D124); the Log page's back chevron goes to the chooser.
15. **Q15 "This week"** = Monday-start calendar week (strip `M…S`) — the app uses rolling 7 days; and whether
    a `lapse` counts in `Urges this week` / the strip (the frame's slip is last week, so it doesn't say).
16. **Generator vs frame (frame wins):** mono-log has card-wrapped rows with pills, stat trios, insight cards,
    a bar week strip, `Continue · 2`, `Tonight · Tue, Jul 22`, white check on the done disc at top 120/228,
    `H.chartUp` with bars, `ovHead` pill `Jul 14–20`, options at 16px, `SOS` label white. None of it is drawn.
17. **Odd but verbatim:** hero scales 1.062 (thermometer) and 0.989 (clipboard); `font-weight 600/800` in svg
    text → Lato 700/900.

---

## 9. Seeds and recipes (the existing `logs.json` recipes are stale)

Stale steps: `tapAt(196, 286)` (wheel is inline now), `tap('Continue · 2')` (label is `Continue`),
`waitFor('Your log')` (still valid), `[role="tab"]` firing (keep the role), overview/report pagers (keep the
`scrollLeft = 393·k` trick or tap the segment).

**Pin the clock to the frames' own July 2025 world** — the precedent is `.overhaul/f-slip-seed0-2340.js`
(a `FrozenDate` init script that offsets `Date.now`). Pin the **date** too, not just the time:

| frame(s) | pinned now | why |
|---|---|---|
| Lapse-When, Urge-Log-When, Lapse/Urge Trigger, Outcome, Intensity | Tue 2025-07-22 23:40 | `Tonight, Tue Jul 22`, wheel 11:40 PM |
| Lapse-Done | same, tap `Yesterday` | `When · Last night` (Q5 rule) |
| Urge-Log-Done | same; seed 22 prior `urge_rode_out` | `Twenty-three ridden out. Two to Bronze.` |
| Log-Urges, Log-Check-ins | Sun 2025-07-20 ~21:30 | strip's last `S` is today; urges Tue 15 23:40 (sev 8), Thu 17 15:10 (sev 4), Fri 18 21:05 (sev 6), slip Sun 13 22:22, Wed 9 00:05 (sev 4); check-ins 12 days running, Wed `Calm`, Fri small disc |
| Log-Reports, Report-Ready, Weekly-Report ×3 | Mon 2025-07-21 or later, `?week=2025-07-14` | latest closed week = `Jul 14–20`; earlier rows `Jul 7–13 … Jun 16–22` |
| Urge-Overview ×4 | Sun 2025-07-20 (one seed per page, as D126) | Summary 9 urges / 7 ridden with Jul 19 & 13 slips; Strength bands 1,1,3,3,1 + triggers 5/4/3/1; Mood 6/4/3/1; Timing hours 0×2,1,15,19,21,22,23×2 + places 5/3/1 |

Clock-pin snippet (prepend to each seed):

```js
(() => { const R = Date; const delta = new R('2025-07-22T23:40:00').getTime() - R.now();
  function F(...a) { if (!(this instanceof F)) return new R(R.now() + delta).toString();
    return a.length ? new R(...a) : new R(R.now() + delta); }
  F.prototype = R.prototype; F.now = () => R.now() + delta; F.parse = R.parse; F.UTC = R.UTC; window.Date = F; })();
```

Captures: `node scripts/overhaul/shot.mjs app /log .overhaul/shots/a-log-urges.png --initseed=<seed> --wait=1600
--sig=a-log-urges` then `node scripts/overhaul/pxdiff.mjs .overhaul/shots/design/Email-Login/Log-Urges.png
.overhaul/shots/a-log-urges.png --ignore=0,0,393,54`. Lists longer than the frame: add `--scroll=end`.
