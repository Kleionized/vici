# SOS — spec

Source: `Vici UI 2/project/Vici SOS.dc.html` (template lines 29–160, logic 170–463), `sos-library.js`, `sos-viz.js`. Also embedded in `Email Login.dc.html` (`<dc-import name="Vici SOS">`), rows `app__102`–`app__242`.
App: `src/components/urge/sos.tsx` (`SosFlow`), routes `/urge`, `/urge-hub` → `/urge`, `/rough-first90` → `/urge`. Harness: `view=sos&state=<preset id>`; presets in `src/dev/sosFixtures.ts`.
Element boxes (the ruler): `specs/vici-ui-2/boxes/sos__NNN.txt` (`scripts/vici-ui-2/boxes.mjs`).

All coordinates are points in the 393 × 852 frame. Colours are exact.

## Frame

| element | value |
|---|---|
| frame | 393 × 852, `#0D0D0D`, overflow hidden, Lato, antialiased |
| grain | `noise.png` tiled at 96 × 96 from (0,0), opacity 0.05, over everything below z 5 |
| status bar | 0–54, drawn by iOS (D2) |
| home indicator | 127, 839, 139 × 5, r100, `#F2F0EC` — drawn by iOS (D2) |

## Nav row (every board)

| element | value |
|---|---|
| row | left 0 right 0 top 58 h 44, row, space-between, centre-aligned, padding 0 18, z 5 |
| back | 44 × 44, padding-left 4; glyph svg 12 × 20 `M10 2L2 10l8 8` stroke `#F2F0EC` 2.2 round caps/joins; opacity 0 on `rate` and `end` (box kept) |
| close | 44 × 44, flex-end, padding-right 4; svg 18 × 18 `M2 2l14 14M16 2L2 16` stroke `#F2F0EC` 2 round caps |
| marks (rate, loc, trig, task, feel) | 4 × (24 × 2, r1), gap 6; on `#F2F0EC` up to the step (rate 1, loc 2, trig/task 3, feel 4), off `#2E2E2E` |
| mini (hub pages other than the task) | row gap 6: clock svg 14 (viewBox 16: circle 8,8 r6.2 stroke `#9B968E` 1.6; path `M8 4.8V8l2.2 1.4` 1.6 round) + `Urge · m:ss` 13/700 lh 18 `#9B968E`, tabular figures, nowrap |

## Shared controls

| element | value |
|---|---|
| primary pill | left 24 right 24, h 58, r 29, centred label 16/700 ls 0.1 nowrap; bottom 96 over a ghost row, 48 alone; z 6 |
| pill, answer needed | fill `#2E2E2E`, label `#77736C` (rate before a strength, loc before a place, chips before a pick) |
| pill, ready | fill `#F2F0EC`, label `#111111` |
| ghost row | bottom 47, h 44, left/right 90 (Skip: 120), row centred, gap 8, 15/400 `#9B968E` (line-height normal) |
| "It's gone" glyph | svg 18: circle 9,9 r7.6 stroke `#9B968E` 1.5; check `M5.6 9.3l2.3 2.2L12.5 6.6` 1.6 round |
| heading | 26/700, ls −0.6, lh 33, `#F2F0EC`, `text-wrap: balance`, box 345 wide |

## 01 · Rate the urge (`step: rate`) and 07 · Check (`step: check`)

| element | value |
|---|---|
| heading | left 24 right 24 top 136 — "How strong is the urge right now?" / "How strong is the urge now?" |
| scale block | left 24 right 24 top 240, column gap 14 |
| bars row | h 174, row, align end, justify centre, gap 12 |
| bar n (1–5) | 52 wide, height `84 + round((n−1)·22.5)` = 84, 107, 129, 152, 174; r 26; padding-bottom 12; number 18/400 lh 22 |
| bar fill | unselected `#383734`, `#5E5C58`, `#8A8781`, `#BAB6AF`, `#E6E3DD`; selected `#F2F0EC` with ring `0 0 0 3px #0D0D0D, 0 0 0 4.5px #F2F0EC` |
| number colour | `#111111` when selected or n ≥ 3, else `#F2F0EC` |
| ends | 308 wide, centred, space-between: "Mild", "Very strong" 13/700 lh 18 `#9B968E` |
| pill | "Continue", bottom 96 — on rate, needs a strength; on check always ready |
| ghost | "It's gone" with glyph |

Behaviour: tapping the selected bar clears it. Rate → Continue → loc. "It's gone" → end with after 0 (rate: no task). Check → Continue → more (after 0 cleared).

## 02 · Where are you (`step: loc`)

| element | value |
|---|---|
| block | left 24 right 24 top 136, column gap 22 |
| heading | "Where are you right now?" |
| rows | column gap 12; each h 60, r 18, padding 0 18 0 16, row gap 14; fill `#1E1E1E` / chosen `#F2F0EC` |
| disc | 34, r 17, ring `0 0 0 1.5px` `#2E2E2E` / chosen `rgba(17,17,17,0.3)`; glyph 20 × 20 stroke currentColor 1.8 round |
| label | 16/400, flex 1, `#F2F0EC` / chosen `#111111` |
| chosen dot | 10, r 5, `#1E1E1E` |
| bed block (place = bed) | column gap 14: "Are you trying to sleep?" 17/700 lh 24; chips wrap gap 10 — min-h 48, r 24, padding 12 20, gap 8, check 13 when on, label 15/400 lh 22 nowrap |
| pill | "Continue", bottom 48, needs a place |

Places: Somewhere private, In bed, A public space, At work or school, Out and about. Sleep answers: Yes, No, I'm staying up, I just woke up, Not sure.

## 03 · What's feeding it · 03B · What you're putting off · 04 · What you're feeling (`trig`, `task`, `feel`)

| element | value |
|---|---|
| block | left 24 right 24 top 136 bottom 174, scrolls, column gap 8 |
| heading | "What's feeding it right now?" / "What are you putting off?" / "What are you feeling?" |
| sub (multi) | "Select all that apply." 15/400 lh 22 `#9B968E` |
| spacer | 6 |
| chips | row wrap gap 12; min-h 48, r 24, padding 13 20, gap 8; `#1E1E1E` / chosen `#F2F0EC` + check 13 (stroke `#111111` 2.2); label 15/400 lh 22, nowrap unless longer than 32 characters |
| thermometer (feel only) | svg 393 × 240 at left 0 top 434, scale 0.8 about (196, 190); inner `translate(-28.1 -32.5) scale(1.146)` |
| pill | "Continue", bottom 96, needs a pick |
| ghost | "Skip", inset 120 |

"I don't know" stands alone (picking it clears the rest; picking another clears it). "Putting something off" routes through 03B.

## 05 · One task (`step: suggest`)

| element | value |
|---|---|
| drawing | box left 24 right 24 top 118 h 176, centred; svg 100 % × 100 %, viewBox = the drawing's bounding box (`SOS_VIZ_BOX`, default `0 40 393 172`), `xMidYMid meet` |
| text block | left 24 right 24 top 326, column gap 12 |
| duration | row gap 7: clock 14 + "`dur` min" 13/700 lh 18 `#9B968E` |
| title | heading style, balance |
| steps | 16/400 lh 25 `#B5B0A8`, `text-wrap: pretty` |
| pill | "Do this task", bottom 96 |
| ghost | "Choose another" |

## 06 · Urge Hub (`step: do`)

| element | value |
|---|---|
| pager | left 0 right 0 top 102 bottom 196 (554 tall), pages 393 wide side by side, `translateX(−index·393)`, transition 0.34 s `cubic-bezier(0.2, 0.8, 0.2, 1)`; drag > 50 turns the page; at either end the drag gives 0.3 |
| pages | task, Breathe, Your pledge, What helped before (the last only with history) |
| dots | bottom 166, centred, gap 4: 18 × 18 targets holding 6 × 6 r3 dots, `#F2F0EC` current, `#3A3835` others |
| pill | "I did it", bottom 96 |
| ghost | "Choose another" |

Task page (top-relative to the pager):

| element | value |
|---|---|
| stats | left 36 right 36 top 16, row, stretch: two columns flex 1 centred gap 2 — value 22/700 ls −0.3 lh 28 (`m:ss` tabular; "`n` of 5" / "Not rated"), label 12/700 lh 16 `#9B968E` ("Since the urge started", "Strength"); divider 1 wide `#2E2E2E` |
| drawing | left 24 right 24 top 90 h 176 |
| text | left 32 right 32 top 298, column gap 12, centred: title 22/700 ls −0.3 lh 29 balance; steps 15/400 lh 23 `#B5B0A8` pretty |

Breathe page:

| element | value |
|---|---|
| text | left 24 right 24 top 28, column gap 12, centred: head 26/700/33 −0.6 balance; sub 15/400 lh 24 `#B5B0A8` pretty |
| rings | box left 51 top 126, 290 × 290: ring 280 at (5,5) inset `0 0 0 1.5px rgba(242,240,236,0.12)`; disc 232 at (29,29) `rgba(242,240,236,0.05)`; disc 184 at (53,53) `rgba(242,240,236,0.08)`; breath disc 232 at (29,29) `#F2F0EC` |
| breath | phases from 350 ms after the page opens, 14 s cycle: in 0–4 (scale → 1 over 4 s ease-in-out), hold 4–8 (1), out 8–14 (→ 0.6 over 6 s ease-in-out); before the first breath 0.6 over 0.3 s |
| words | in "Breathe in." / "Slowly, through your nose. Let your shoulders drop."; hold "Hold." / "Keep your shoulders loose."; out "Breathe out." / "Through your mouth, slower than you breathed in." |
| phases row | top 446, centred, gap 36; each min-width 56, column gap 4: label 15/700, seconds 13/400, bar 24 × 3 r2 margin-top 6; current `#F2F0EC` / `#B5B0A8` / bar `#F2F0EC`, others `rgba(242,240,236,0.4)` / `rgba(242,240,236,0.3)` / no bar |

Your pledge page:

| element | value |
|---|---|
| title | left 24 right 24 top 34: "Your pledge" heading style |
| block | left 24 right 24 top 148, column gap 56 |
| pledge | 34/700 ls −0.8 lh 42 `#F2F0EC` balance |
| signature | column gap 10: name 26 italic 700 lh 30, padding-left 4; rule 1.5 `#3A3835`; row space-between gap 12: "Signed" / "Today, 8:12 am" 13/700 lh 18 `#9B968E` nowrap |

What helped before page:

| element | value |
|---|---|
| block | left 24 right 24 top 34, column gap 8 |
| heading | "What helped before" |
| sub | "These brought the urge down last time. Tap one to switch to it." 15/400 lh 22 `#9B968E` pretty |
| spacer | 14 |
| list | border-top 1 `#2E2E2E`; rows border-bottom 1 `#2E2E2E`, padding 16 0, row gap 14: title 15/700 lh 21 pretty, meta 13/400 lh 18 `#9B968E` (column gap 3); chevron 14 `M5 2l5 5-5 5` `#5A574F` 2 |

## 07D · Another task? (`step: more`)

| element | value |
|---|---|
| block | left 24 right 24 top 136, column gap 10 |
| heading | "Would you like another task?" |
| sub | 15/400 lh 22 `#9B968E` pretty: "The urge has dropped from u to a." / "…gone up from u to a." / "The urge is still at a out of 5." |
| pill | "Show me another task", bottom 96 |
| ghost | "No, I'm done" |

## 08 · Finished (`step: end`)

| element | value |
|---|---|
| block | left 24 right 24 top 136 |
| heading | "Done for now." |
| rows | margin-top 28, border-top 1 `#2E2E2E`; row space-between align start gap 20, padding 16 0, border-bottom 1 `#2E2E2E`; key 15/400 lh 22 `#9B968E` nowrap; value 15/700 lh 22 `#F2F0EC` right-aligned pretty |
| rows shown | "Urge strength" (`u → a` / `u → gone` / `Gone` / `u of 5`); with a task: "Time with the urge" ("Under a minute" / "n min"), "Task" (title) |
| pill | "Back to Today", bottom 48 |

## Motion

| what | value |
|---|---|
| hub page change | 340 ms `cubic-bezier(0.2, 0.8, 0.2, 1)`; a drag follows the finger with no transition |
| breath disc | 4 s / 6 s / 0.3 s `ease-in-out` (`cubic-bezier(0.42, 0, 0.58, 1)`) |
| timers | elapsed redraws every second; the breath phase is checked every 150 ms |

## Fixture values the frames show (harness)

Clock frozen at 09:41:00 (built) + 2 s (captured): `s06` 4:14, `s06b` 8:40, `s06c–e` 5:42. Pledge "The mornings are mine again.", Jerry, "Today, 8:12 am". History: E02 Thu, 3:10 pm 4 → 2; A01 Wed, 10:40 pm 3 → 3; L02 Tue, 11:48 pm 3 → 1; F02 Sun, 9:22 pm 4 → 2; K01 Fri, 1:15 pm 3 → 2.
