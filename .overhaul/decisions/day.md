# day — decisions (D235–D239), Vici Overhaul Phase 1

Group: the seventeen check-in frames (Morning Check-in Cover … Night 4 Closed) at `/day/morning` and
`/day/night`, plus the unframed `/checkin` (and the `MoodLogger` modal it shares). Files:
`src/app/day/morning.tsx`, `src/app/day/night.tsx`, `src/app/checkin.tsx`, `src/components/MoodLogger.tsx`,
`src/components/day/board.tsx` (new — the pieces both flows share), `src/components/day/kit.tsx` (cut to
`RerollGlyph`, which `affirmation.tsx` imports, and the day-action lists). Evidence: `.overhaul/recipes/day.json`
(17 frames: 14 at 0.00 % pxdiff t=24, the other three named below), captures and strips in
`.overhaul/shots/day/`, drives `.overhaul/drives/day-{morning,night}-exercise.js`.

## D235 — Every step is the kit's board; the ✕ on the two closing boards files the day
The old paper shell (`DayShell`, the dot rail, `MorningSky`/`NightSky`, `LedgerMark`/`JournalMark`,
`LedgerRow` plates, `MoodDial`, the paper `PledgeCard` with Snell Roundhand, `ChangePledgeSheet`,
`ActionCard`/`NightActionArt`, `DayBadge`, `CheckinCover`'s painted sky) is gone. The covers and Night 4
Closed are `HeroBoard`; every step is `Screen` + `NavBar` (back · `NavDashes {step, total: 5|6}` · ✕) +
the kit control (`Grid2`, `CheckRows`, `ToneScale`, `EnergyBars` + `ScaleReading`, `PledgeCard sign`,
`TextField bare`, `Sheet` + `TextField card`) + a decorative `Hero` carrying `controls` (D320 rule 1: at
375 × 667 the T 506/458 heroes drop out; covers and Closed lift with `HeroBoard`). Every step now draws
Back, the dashes and ✕ (the old night flow's Back-less Reflection/Record and rail-less Action are gone, as
the frames draw them). D091/D094/D096 are moot.

The frames add the ✕ to Morning 5 Done and Night 4 Closed, where the app had none. On every other step the
✕ leaves without saving, as it always did (checked: closing mid-flow writes no row and leaves yesterday's
`dailyActionDone` untouched). On the two closing boards the day is already complete, so the ✕ runs the same
`finish()` as Done — leaving there must not throw the check-in away.

## D236 — Morning: an answer before the round next; the signature line signs
Morning Task Check's two glyph pills that advanced on tap become the frame's `Grid2` (Yes / Not yet, radio)
and the `NextFab`. Nothing is chosen on arrival (CRITIC §5: a default "Yes" would write a completion the user
never claimed); the fab is dimmed (D321) until a choice. Yes / Not yet write `dailyActionDone` true / false
on **yesterday's** row at `finish()`, as No / Yes did. The old pledge plate's clear-× is not drawn (OQ-M4):
the signature line itself is the control — it signs ("Sign here") and un-signs ("Signed by Jerry"); the
primary still signs first and confirms second. The Change Pledge Sheet opens on the pledge as it stands
each time; "Sign the new pledge" stands the draft in and un-signs, "Keep current pledge" / scrim / drag
closes. Night Action's title is `lessonForDay(day).task.cardTitle` (= the new lesson title, "Prepare for
tonight" on day 1) over `cardSummary`; past the course it falls back to "Tonight" + `nightAction(day)`.

## D237 — The record rows: the frames' words, the kit's empty disc for what the day did not earn
`0 relapses` → `countOf(n, 'slip')` ("0 slips" / "1 slip"). Rows the day did not earn keep the app's own
copy (No pledge signed · No urges logged · 1 slip · No lesson yesterday; at night "… today") on
`CheckRow done={false}` — the kit's bare ring (D355, OQ-M2). The score row prints a minus for a net loss
(`−14 → 1,326`; the old `+${gained}` printed `+-14`). D097 still holds and is now provable: with the current
`SCORE_WEIGHTS` yesterday's gain under the frame's other four rows (clean, a check-in, one urge ridden, a
lesson) is 4 + 2 + 2 + 3 = 11, so the frame's `+12 → 1,240` cannot be seeded without contradicting a
row; day-seed prints `+11 → 1,064` — Morning 1 Yesterday's only residual (0.08 %, the value's glyphs).
`.overhaul/day-seed-negatives.js` reaches every negative (and Night Action's no-lesson fallback, day 91).

## D238 — Reasons store `Health`; old rows read as `Health`
Checkin Reasons draws `Health`; it is also the stored value (D324). `MoodLogger` exports `REASONS`,
`EMOTIONS` and `normalizeReasons()` (maps `Health / wellbeing` → `Health`, de-duplicated); `/checkin` seeds
its picks through it (checked: a stored `Health / wellbeing` opens selected as Health and saves as Health).
Other readers of `reasons[]` (Log check-ins, weekly report — the logs group) should map through
`normalizeReasons` when they display stored rows.

## D239 — `/checkin` (unframed) and the residuals that stay
`/checkin` (and the `MoodLogger` modal, which nothing mounts today) is the night flow's three boards on a
three-step rail (`NavDashes {step, total: 3}`): Night 1 Mood's bed (506 × 1.075) and tone discs under its
own question ("How did today land?") with its own five words (Heavy … Clear, no second line), Checkin
Emotions with the fab, Checkin Reasons with its own **"Log it"** pill (it saves; dimmed until a pick, as
before). Back on the first step and ✕ leave; the mood opens on the stored rung, else the fourth ("Mostly
clear"), as before. The loading wait has the ✕ (`LoadingView onClose`).

Night 3 Reflection's stack is a `ScrollRegion` (top 136, to 16 above the pill): identical at 852
(0.02 %, the drawn caret only — D364), and a long entry scrolls instead of running under Continue (checked at
375 × 667 with 14 lines). Change Pledge Sheet keeps the live Resign step under the scrim, where the canvas
draws empty ground (D095's reading carried): only its nav row shows, dimmed, above the panel at 120 — that
and the caret are the frame's 0.19 %. `RerollGlyph` now strokes `#9B968E` by default (the old `#8B8882` is
not in the palette) and takes `color`; `affirmation.tsx` (today group) keeps its call unchanged.
