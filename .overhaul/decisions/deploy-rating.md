# Deploy: the recovery rating (D510–D519)

Issues: S1 and S2 (`DEPLOY-AUDIT.md` §3). The owner approved the model. It replaces the old 1,000-point score entirely, and its
answer to "too punishing after a relapse" is a seven-day window. Everything lives in `src/lib/score.ts` as pure functions over the
account's check-ins, events and lesson progress. Both backends feed it the same rows. There is no schema change and nothing is stored.

## D510 — One number: the last seven days, out of 100
`computeRating(input, asOf)` is made of three parts on fixed weights (`RATING_WEIGHTS`). Showing up (30) counts days with a check-in
(`isCheckin`) or a logged slip (`isSlip`). Clean days (45) counts days with a check-in and no slip. Lessons (25) is finished lessons dated
inside the window over the lessons the window scheduled, capped at all of them. Past day 84 the weights are 40/60 with no lessons part.
Several slips on one day count once. The total is rounded, and the parts are rounded by largest remainder so the rows always add up to
the number. `SCORE_BASE`, `SCORE_WEIGHTS`, `RANKS`, `buildScore`, `scoreHistory`, `lastDays`, `monthLedger` and `scoreDayKey` are gone.

## D511 — Today waits; a past day is closed
The window ends today once today has a check-in or a logged slip, and yesterday until then (`computeRating`). A day that has ended has
nothing left to wait for, so `ratingThrough(input, day)` always ends on that day. History is `ratingThrough` for each past day plus
`computeRating` for today, so the line ends on the number beside it. Change is today's rating less yesterday's as it closed. Before
today's check-in the change is 0 and the chip is hidden. A missed day shows up on its own day, not a day later.

## D512 — Every rating chart is on a fixed 0–100
Today's thirty days put 0 on the band's floor (210.6) and 100 at its top. The three dashed rules now sit at 25, 50 and 75. Score
Detail's axis reads 100 / 0 and its tail is held inside the scale. The weekly report's line and the Log's spark take a new optional
`scale` (`RATING_SCALE`), so a change of four reads as four and is never stretched to full height. Without `scale` they draw as before.

## D513 — Score Detail reads the rating
The header shows "Recovery rating", the number, and the range pill carrying the band (or `Building · N of 7 days`). Under the chart, the
old "+N points this quarter" became the change ("Up 6 since yesterday" / "Level with yesterday", with the arrow turned for down and laid
flat for level) over "Covers Oct 3–9", which is the window itself. Page two, "What makes it up", shows the three parts as `26/30` rows
with bars on a faint track, the rating under the rule, and the owner's paragraph below the card (a post-course variant names only the
two parts). The paragraph is measured so the page scrolls on short phones. Page three, "The bands", shows the four bands with their
ranges and "You're here." on the current one. It has no ranks and no numerals.

## D514 — The morning's row is yesterday's close
"Yesterday's record" shows `Recovery rating · 94 (+6)`: the rating through yesterday, which is what Today shows until today is checked in,
and what yesterday moved it by against the day before. The disc is filled when the move is 0 or more and the rating is above 0. A
rating that sits at 100 is still a day earned.

## D515 — Reports read the week's close
`weeklyReport.scoreAt` and `weekScore` became `ratingAt(day, input)` and `weekRating(weekStart, input)`. The week's figure is the rating
through its Sunday, and its delta is against the Sunday before. Each day of the line is that day's close. The Log's Reports and the
weekly report's first page caption it "Recovery rating, +N this week", and the pager's tab reads "Rating". Lesson times now come from
`lessonCompletions`, so a completion with no date is in no window (the old `completedAt ?? 0` filed it in 1970).

## D516 — Onboarding shows no starting figure
`28 · Your recovery rating` keeps the board: the caps title, the tick gauge (now 0 … 100, standing at 0, "of 100"), the outline pill (now
"Building"), and one line: "It starts with your first check-in and covers your last 7 days: showing up, clean days and lessons."
`welcome.tsx` no longer imports a base. `SCORE_SAMPLE` in `content/onboardingTail.ts` is generated and unused, so it is left alone.

## D517 — One name everywhere
"Recovery rating" is on Today, Score Detail, the morning, the reports, the All Screens index and Report Ready ("rating, days and urges").
Lesson L83 asks "Did the recovery score change?". `lesson/reader.tsx`'s `Run` rewrites that phrase at render time (as D441 did), so the
generated reader is untouched. The urge hub draws no number; its 85B comment now says so. The kit-lab replicas
(`mono/lab/rows.tsx`, mock/dev only) keep their frames' sample copy because they are pixel-diffed against those frames. The route stays
`/score`.

## D518 — The first week builds up, lessons included
The denominator stays 7 for every part. A window day before the programme schedules a lesson too. The owner's day-3 example (3
check-ins, 3 lessons, no slips) comes to 43 only that way: 12.9 + 19.3 + 10.7. If lessons used 3 of 3 the result would be 57. The
band word reads `Building · N of 7 days` while the window holds fewer than seven programme days, so "7 of 7" never shows. From the
moment day 7 is checked in, the band shows. With no known start, all seven days count.

## D519 — Lesson dates, and one trade-off to know
Both backends stamp `completedAt` when a lesson is finished, and the day reader records completion once, so a lesson counts on the
day it was first finished. Reading ahead is capped by `min(1, …)`. Trade-off: once today is checked in, today's scheduled lesson is in
the window. A morning check-in made before the day's lesson can therefore read about −4 until the lesson is done, which is the spec
as written. Excluding today's lesson until it is finished or the day closes would remove the dip.
