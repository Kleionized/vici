# deploy WP3 decisions: the day, check-ins and counting (D430–D449)

Issues: L1, L2, L4, L5, L6, L7, L8, L9, L11, S3, S4 (Insights), S5 (Lessons ladder), R1, R2, R3, B12 (`premium` only), D4,
and Today drawing Day 1 before the account loads. The shared helpers live in `src/lib/day.ts` (new).

## D430: One programme calendar
`src/lib/day.ts` holds the only day count. `programmeDay(start, now)` counts whole local calendar days from the start date and
adds one. The start is `users.programmeStartedAt`, a local `YYYY-MM-DD`, or the local date of `createdAt` when that field is missing.
`ProgrammeStart` also takes a bare timestamp or a date key. That lets callers outside WP3 (`first-steps.tsx`, `mail.tsx`, `all.tsx`)
still compile, and they now count calendar days, though they still count from `createdAt`. Yesterday, tomorrow and week steps use
`addDays` and `shiftKey` (`setDate`). Nothing adds or subtracts 86,400,000 ms any more.

## D431: The start is recorded once, from the phone's calendar
Onboarding's `finish()` sends `completeOnboarding({ programmeStartedAt: todayKey() })`. The server can't know the user's calendar,
so the date comes from the phone. The server validates the key and never moves a start that is already recorded. The mock does the same.
Onboarding's finish date is Day 1. Existing accounts keep `createdAt` as their start, but the day now turns over at midnight. Someone who
signed up in the evening will see the day number go up by one on the first launch after this update.

## D432: A check-in is a row with check-in content
`isCheckin(row)` is true when the row has mood, energy, nightMood, emotions or reasons. `livedCheckins` also drops rows dated after
today and, given a start, rows from before the programme. The day's action still lives on `dailyCheckins` (no table move). An action-only
row (the night's for tomorrow, the morning's answer about yesterday, Today's tick) is now invisible to the score, reports, medallions,
the Log's list and streak, and Journey.

## D433: One slip rule, and clean days are days
`isSlip` covers both `lapse` and `urge_acted_on`, and score, scoreHistory, monthLedger, scoreAt and dayStatuses all use it. A clean day
is a programme day with no slip on it, so two slips on one day cost one clean day, as the history already counted it. Each slip still
carries its own −16. Events before the programme's first day sit outside the score, matching the day-by-day replay. The weights,
ranks and base are unchanged (S1 and S2 are the owner's).

## D434: What the check-in records tick
"Surfed" counts `urge_rode_out` only. If urges were logged but none were ridden out, the row reads "No urges surfed". "Pledge kept" is
ticked only on a day without a slip. A signed pledge on a slip day reads "Pledge signed" with the empty disc. Today's week strip
never fills a day that has a slip of either kind, today included.

## D435: The night after midnight belongs to the evening before
`nightKey(now)` uses D421's `checkinEdges(...).morningOpens` (4:30 at the default times). Before that point, the night being closed
is yesterday. The night flow fixes its key when it opens. It reads the record from that night's midnight to now, small hours
included, writes that night's row, and files the action for the key plus one. The key is never earlier than the programme's start. The
morning flow also fixes its date at open.

## D436: The night's mood has its own field, and every screen shares one word list per scale
`dailyCheckins.nightMood` is a new optional field. The night writes it, so the morning's `mood`, which Today shows under "This morning",
is no longer overwritten. The shared words are the morning check-in's own: Rough, Low, Steady, Good, Great for mood, and Empty, Low,
Enough, Good, Full for energy. The morning, the night, Today, the Log, Insights and the weekly report all use them. Each check-in keeps
its own second lines. The night's middle line is now "Neither up nor down". Reports and Insights read `dayMood`: the morning's mood,
or the night's if there was no morning check-in. The Insights legend reads "Rough → Great". The quick `/checkin` flow
(`MoodLogger.tsx`) is not in WP3's files and keeps its own words.

## D437: The launch gate skips check-ins already done and runs again on return
The gate skips the morning push when today's row has a morning reading. It skips the night push when the night key's row is closed.
It runs again when the app comes back from the background. A return from `inactive` (a Face ID or permission sheet) doesn't count.
The hourly rule still spaces out the pushes. Arrivals land only on a tab root (`/today`, `/log`, `/library`, `/milestones`). A launch or
return into SOS, a lesson, or a check-in opened from a reminder is left alone. This is how SOS launches skip the prompt.

## D438: A visible door to the night check-in, in the Log
The Log's Check-ins register opens on a kit `RuledRow` for whichever check-in the clock says is due, while it isn't done yet:
"Night check-in · Close the day ›" in the night part, or "Morning check-in · Start the day ›" in the morning. The row uses the
register's own 52 row, a mute value and the art-grey chevron. It sits above the list, or alone above the empty state.

## D439: `useToday()` is the screen clock
`useToday()` updates on focus (`useFocusEffect`), on a return from the background, and just after local midnight. It doesn't keep a
day-long timer: it looks at most every 10 minutes, then fires at midnight. Today, the Library (and WeekPage's `useCourseDay`, so the
lessons browser too), the Log, Score Detail, Insights and Journey use it. Between those moments it holds still, as the old
`useState(Date.now())` did.

## D440: Today waits for the account, ends the course honestly, and greets by the clock
Today's loading gate now includes `user`, so it never draws Day 1 or Lesson 1 for a day-20 user. From day 85 the lesson tile reads
"Course complete" over "Revisit any lesson" and opens the lessons browser. The layout and type are the tile's own. The fallback steps
(`DAY_STEPS`) moved to `components/day/kit`, and Today, the night and the morning all pick from that one list by day number. Past the
course, the night's action title reads "After the course" instead of the bare "Tonight". The greeting has its own rule: "Good morning."
from 5 to 12, "Good afternoon." from 12 to 18, and "Good evening." otherwise. It no longer follows the check-in switch, which said
morning until 18:30.

## D441: A reopened lesson shows what was saved
The reader fills the choice and the note from the lesson's saved reflection once the record loads. A choice made before it loads is
kept. A save made before the record loads waits for it and then merges, so a fast Continue can't wipe an earlier note. A choice or
note cleared on reopen is saved as cleared. The complete page's "Your answers are saved to the log." is rewritten at render time to
"Your answers are kept with this lesson.", with the same place and type. `content/lessons.ts` is untouched.

## D442: The Lessons ladder matches the 84-lesson course
The rungs are now 7, 21, 42, 63 and 84: a week, a quarter, half, three-quarters, all. The lines are rewritten to match ("Seven
lessons in, a week's worth…", "A quarter of the course…", "All eighty-four lessons, finished…"). The ledger counts only completed slugs
that `dayForSlug` recognises, so stale slugs from the old 110-lesson set can't push the count past 84.

## D443: The medallion ledger counts real check-ins and either kind of slip
Pulse, First Light, Vidi, Rebound and Return read only lived check-ins. Black Box mints on the first slip of either kind. Rebound's
trigger is either kind of slip, and its "next day" is the calendar day. Archive counts the entries the user wrote. It leaves out the
`Letter` tag (the day-zero letter and saved posts) and the morning's automatic "Day N pledge". Rebound's ladder and the medallion post
are unchanged (owner's).

## D444: Weekly reports
Weeks step back by the calendar. The programme's first week makes a report only if it held at least 4 programme days (a Monday to
Thursday start). The launch gate delivers a closed week when it holds any record (a check-in, an urge or slip, a finished lesson),
which matches what the report screen draws. It no longer requires a mood. `dayStatuses` and `scoreAt` are bounded by the programme
start. Settings' value "Every Sunday" now reads "After each week", because delivery is the first launch after a week closes.

## D445: The Week XII letter is sealed until Week XII
`LETTER_OPENS_DAY` is 78. Before that, the Settings row reads "Opens Week XII" with no chevron and no press. After it, the row reads
"Read". The launch gate delivers `/letter?variant=week12` once, on the first launch on or after day 78, under a per-account key
(`tideline.letter.week12.delivered:<userId>`). The route opened early, from a link or the dev drawer, shows a sealed board in the
arrival's own layout: "Sealed until Week XII." / "It opens on Day 78, N days from now." / Close. The post's "Week N post" caption in
`letter.tsx` uses the programme day.

## D446: Insights counts from the programme's first day
"Days kept" is the range's programme days minus the days with a slip of either kind. The mood heat reads only real check-ins (the
morning's mood, or the night's). Days before the start stay hollow.

## D447: `premium` is server-only
`users:updateSettings` no longer accepts `premium`. The Convex adapter strips it before sending, so a caller that still passes it does
nothing instead of having its whole mutation rejected. WP4 has already removed the RevenueCat mirror. The mock backend still stores it,
because the mock purchase sheet is the offline stand-in. The schema keeps the optional field for existing documents. `yearlyDrop` is
untouched (outside the brief).

## D448: Life Map no longer hangs on Convex, and check-in reads are bounded
The adapter answers "loaded, none" with an empty map, as the mock always has, so `(app)/lifemap.tsx` gets a map instead of a permanent
`undefined`. `checkins:list` reads newest first by `by_user_date` with `take(2000)` instead of an unbounded `collect`. `checkins:upsert`
rejects a date that isn't `YYYY-MM-DD`.

## D449: Small honesty fixes in the Urge Overview and report links
If urges were logged without a strength, feeling or place, the empty line now says "No strength (feeling, place) recorded for these
urges yet." It no longer says nothing was logged. A place is only what was picked as one, never the free-text note.
`/weekly-report` and `/report-ready` ignore a `?week=` that isn't a date key and fall back to the latest week, so it can't print
"undefined NaN".

## Review fixes (amendments; the D430–D449 range is full, so each one carries the number of the decision it changes)

## D437a: Only the night flow's own field says tonight is done
The quick check-in (`/checkin`) writes mood, feelings and reasons to today's row at any hour, so `isNightCheckin` was true after a
morning quick check-in. The gate then never pushed the night check-in, the Log hid its door, and Today filled today's disc in the
morning. `isNightClosed(row)` (`nightMood != null`) now answers "is tonight done?" in all three places. Only the night flow writes
`nightMood`. Counting still uses `isNightCheckin` and `isCheckin`. A night closed by a build older than this one (no `nightMood`) only
affects the night of the update.

## D435a: The night flow, the gate and the Log's door read one key; the first night is the programme's
`closingNightKey(start, now)` is `nightKey` held to the programme's first date. The night flow writes that row, and the gate and the
door read it, so a check-in done at 01:30 on the first date is seen as done. In the small hours of the first date
(`nightBeforeProgramme`), the night the clock points at is the evening before the programme began. The gate doesn't push a night
check-in then, and the door stays shut. Otherwise a check-in done right after a 01:00 onboarding would close Day 1's real evening
before it had happened. Opening the flow by hand at that hour still files it under Day 1, as before.

## D435b: The night's record is its own calendar day
The night's record now counts events, the pledge and a finished lesson in `[night 00:00, next day 00:00)`. It used to run from the
night's midnight with no upper bound, so a night closed at 03:00 and the next night both counted that night's small-hours slips. The
reviewer suggested the 4:30-to-4:30 window. The calendar day is used instead, because the score, both week strips and the next
morning's ledger already file each event by its calendar day. With that window, "Pledge kept" on a night can never disagree with the
strip's disc for the same day (D434). The trade-off is that a slip at 00:30 doesn't appear on the night closed at 00:40. It appears on
the next night's record and the next morning's ledger.

## D444a: The gate waits for lesson progress before it marks a week seen
The gate now also waits for `useLessonProgressMap()` (a separate Convex query). A closed week whose only record is a finished lesson
was failing `weekHasRecords` with `lessons = []`, getting marked seen, and never being delivered.

## D430a: Profile's "Started VICI" is the programme's first day
The row beside "Current week" now shows `programmeStartMs(user)`, the date the week is counted from, instead of `createdAt`. For an
account from before `programmeStartedAt` existed, it is the same date as before.
