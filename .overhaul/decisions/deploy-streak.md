# Deploy: the streak and Today's week strip (D530–D538)

The owner's words: "the streak should only count proper check-ins, not just every day on the app, and also not counting relapses", "the
slip resets to 0", and "on the weekly thing on the home page as well, it should show completed day, relapse, or the user did not log in,
three different icons". One rule answers all three. It lives in `src/lib/score.ts` beside the rating and reads the rating's own index of
the account's rows. Pure functions, nothing stored, no schema change, the same on both backends.

## D530 — One rule for a day that counts
A day counts when it has a real check-in (`isCheckin`: a morning or a night check-in with content) and no slip (`isSlip`: a lapse or an
urge acted on). A row that only holds the day's action is not a check-in. A logged slip is not a check-in. Several slips on one day are
one slip day. Days before the programme's first day never count.
`dayMark(input, day, asOf, open?)` reads one day as `done`, `slip`, `missed`, `today`, `ahead` or `before`. A slip wins over a check-in,
so a day that was checked in and slipped reads `slip`.
`currentStreak(input, asOf, open?)` is the run of `done` days ending today, or ending yesterday while today has neither a check-in nor a
slip. Today does not break the run until the day is over. A slip today makes it 0 at once, checked in or not. A missed day or a slip
day ends the run. The first day of the programme counts, and the run never reaches back past it. With no known start, the run is not
cut at a start. `open` is D537.
Why: opening the app is not the work, and a day with a slip is not a day held. The rating's clean day is already "a check-in and no
slip" (D510), so the streak, the strip and the rating cannot disagree about a day. Today waits the same way the rating's window does
(D511).

## D531 — The week strip says what happened
Today's strip keeps its geometry: seven 36 discs, Sunday first, same positions and labels. Each disc draws its day's mark.
- Done: the ink disc with the check.
- Slip: the ink ring with a cross in ink.
- Missed: the line ring with a short dash in the mute.
- Today, nothing yet: the ink ring with the date. The evening before reads the same while its night check-in is still open (D537).
- A day to come, or a day before the programme: the line ring with the muted date.
A glyph says what happened. A number says the day is still to come. Before this, a past day with no slip drew the check even when nobody
checked in, and a slip day looked like a day to come.
The cross and the dash are drawn in `today.tsx` in a 12 box at stroke 2 with round ends. The kit's `CloseX` at 12 would draw a 1.3
stroke, thin beside the 2.2 check. Tokens only: `mono.ink`, `mono.mute`, `ring.outlineInk`, `ring.outline`.

## D532 — The Log's "Days in a row" is the same number, and now reads "Clean days in a row"
The Check-ins page calls `currentStreak` and its own `streak()` is gone. Two things change there: a slip day no longer counts, and a
day before the programme never counts. The page passes its check-ins, the account's events and the account. It passes no lessons,
because the streak reads none.
The caption is now "Clean day in a row" / "Clean days in a row". The strip and the rows under the number still show every check-in,
slip days included, so "1, Day in a row" could sit above four check-ins in a row with nothing to say why. "Clean day" is the rating's
word for a check-in and no slip, and STYLE.md uses it ("Seven clean days."). The caption is one line and does not wrap. This is a
reviewer's change, not the owner's wording: one line in `log.tsx` puts it back.

## D533 — The flame shows the streak
Today's flame pill shows `currentStreak`, 0 when there is none. It used to show the programme day, which goes up whether or not anyone
checks in (today-day OQ-T1). The owner decided the pill is a streak, so the streak is no longer opt-in on Today.
The programme day is still on Today: page two's lesson tile reads "Lesson N", and N is the programme day through day 84. Past day 84
the tile reads "Course complete" and Today shows no day number. The morning and night check-ins still name it ("Day N, underway.",
"Day N, closed.").

## D534 — Today's disc fills with any real check-in
Today's disc used to wait for the night check-in (D231). It now fills as soon as today counts: a morning, quick or night check-in, and
no slip. A slip today turns it into the cross at once. The disc and the flame change in the same moment because both read `dayMark`.
`isNightClosed` still answers "is tonight done?" for the launch gate and the Log's door.

## D535 — What a screen reader hears
The flame reads "3 days in a row" ("1 day in a row", "0 days in a row"). A strip day reads "Sunday 12, checked in", "Sunday 12, slip"
or "Sunday 12, no check-in". A day still open and a day to come read the day alone. Today's day starts with "Today, ", because the bold
label is only for the eye.
The day is said in full. The brief's example was "Su 12, checked in", but a screen reader says the column heads as words: "We 14" is
heard as "we fourteen" and "Su 12" as "sue twelve". The two letters stay on screen.
Each strip day is now one accessible element on iOS and Android, because a slip or a missed day has no text inside its ring to read.
The kit's `Pill` does the same when it is given a label and is not a button, so the flame reads its words and not a bare number.
Today's flame is the only pill that takes that path.
The web build (react-native-web 0.21.2) drops `accessible`, and a browser does not read a label on a plain div. On web only, the strip
day and the labelled pill take `role="img"`. Native gets no role, or VoiceOver would add "image".

## D536 — Left as it was, and one trade-off
- The weekly report's Days tab (`dayStatuses`) calls a day "clean" when it has no slip and no urge ridden out, checked in or not. A
  missed day reads clean there, and it draws Today's own glyph for done, the ink disc with the check (`DayCells`). A slip day there is
  an empty line ring. So the same check means two things on two screens. It was out of scope and is not changed (D538).
- The Log's own Check-ins strip draws a reading for any checked-in day, slip or not. Not changed.
- Insights' "Clean days" (`src/app/(app)/dashboard.tsx`, `kept = lived.length - slipDays`) counts every lived day with no slip,
  checked in or not. Not a streak. Not changed.
- The urge hub's "Last 30 days, N clean, M slips" grid (`src/components/urge/hub.tsx`) fills every programme day with no slip.
  Not a streak. Not changed.
- No medallion counts a run of days. Pulse counts check-ins, slip days included. Not changed.
- `settings.showStreak` gates the dashboard's days since the last slip. No screen draws it. Its comment no longer says a streak is
  opt-in.
- The dip at midnight that this entry used to accept is gone: see D537.
- Trade-off: if the phone's date is earlier than the programme's first day (a clock set back, or a flight west on day 1), today
  reads `before` and cannot count. The rating treats that day the same way.

## D537 — The evening before stays open until the morning check-in opens
From midnight until the morning check-in opens (4:30 at the default times), the night check-in still closes yesterday's row (D435), and
the launch gate and the Log's door still ask for it. While yesterday has neither a check-in nor a slip in those hours, it reads open,
not missed: the ink ring with its date, no suffix for a screen reader. It neither counts nor ends the run. Filed, it reads done and
counts. Left alone, it reads missed when the morning check-in opens, and the run ends then. A slip on it reads slip at once.
Why: without this, someone who closes each day with the night check-in alone saw 12, then 0 at midnight, then 13 a few minutes later
when they filed it. The flame said the run was over while the app was still asking them to close the day. "Today does not break the
run until the day is over", and the app's own end of the day is that morning edge, not midnight.
How: `dayMark` and `currentStreak` take an optional `open` key. `today.tsx` and `log.tsx` pass `closingNightKey(user, now)`, the key the
gate and the door already read. `score.ts` stays pure: it reads no clock setting and no saved times. Only yesterday can be held open.
Any other key (today's, an older one, one that is not a date) is ignored, and no key gives the reading by midnight.
Both reviewers asked for the owner's word on this, because it moves "the day is over" from midnight to the app's night edge. It is
applied because a 0 that comes back minutes later is a false reading. To undo it, drop the third argument in `today.tsx` and `log.tsx`.
One edge: a quick check-in filed on today's row in those hours, with last night still open, counts today and the run behind last
night. If last night is never filed, the run drops to today's 1 at the morning edge.

## D538 — For the owner
Nothing below is changed. Each is a choice.
- Day 8's lesson, "Measure more than a streak" (`src/content/lessonReader.ts`, line 346), reads "Zero can lie", "This is where streaks
  become dangerous." and "Thirty days becomes zero in one tap." Today's flame now does that when a slip is logged. Lessons are the
  owner's. Either those lines change or they stand beside the flame.
- Three screens call a day clean on "no slip" alone, checked in or not: the weekly report's Days tab, Insights' "Clean days" and the
  urge hub's 30-day grid. A fourth, the Log's Check-ins strip, draws a slip day like any other check-in. Today's strip, the flame,
  the Log's number and the rating say a clean day is a check-in and no slip. An account that checked in on 3 of the last 7 days with no slip
  sees dashes on Today, "14 Clean days" on Insights and "7 of 7 Clean days" in the report.
- README.md, SCREENS.md and the header of `src/lib/dashboard.ts` said no streak resets to zero. Each now carries a line pointing here
  (D533). The two docs are from the Tideline build and are stale in other ways.
