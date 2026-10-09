# Voice pass: daily package

Changed 37 strings across 13 files. `npx tsc --noEmit -p .` and `npx eslint` on the changed files are both clean.
Every new string is the same length as the one it replaces or shorter, with three exceptions that are one
character longer: "Clean days" (was "Days kept", in a column that already holds "Urges logged"), "Steady"
(was "Mixed", a word the morning check-in already shows on the same scale) and "Tomorrow’s action" (was
"Tonight’s action", a one-line caps label with room to spare). The screen-reader label ", clean" (was ", held")
is also one character longer, but it is never drawn on screen.

| File | Before | After |
|---|---|---|
| src/app/(app)/today.tsx (Today, week strip, screen-reader label for a past day with no slip) | {weekday} {date}, held | {weekday} {date}, clean |
| src/app/(app)/score.tsx (Score detail, line when the rating has not moved) | Level with yesterday | Same as yesterday |
| src/app/(app)/score.tsx (What makes it up, paragraph during the course) | Your rating covers your last 7 days: showing up (30), clean days (45) and lessons (25). A slip costs that day’s clean points. Logging it still counts as showing up, and a slip leaves your rating after a week. | Your rating covers your last 7 days: showing up (30), clean days (45) and lessons (25). A slip costs that day’s clean points. Logging it still counts as showing up. A week later, the slip drops out. |
| src/app/(app)/score.tsx (What makes it up, paragraph after the course) | Your rating covers your last 7 days: showing up (40) and clean days (60); with the course finished, lessons no longer count. A slip costs that day’s clean points. Logging it still counts as showing up, and a slip leaves your rating after a week. | Your rating covers your last 7 days: showing up (40) and clean days (60). The course is done, so lessons no longer count. A slip costs that day’s clean points. Logging it still counts as showing up. A week later, the slip drops out. |
| src/app/day/morning.tsx (Morning, task step, title) | Did you complete this task? | Did you do this? |
| src/app/day/morning.tsx (Morning, feeling step, line under "Good") | Steady and clear | Clear-headed |
| src/app/day/morning.tsx (Morning, energy step, line under "Empty") | Ask little of yourself | Do the basics |
| src/app/day/morning.tsx (Morning, pledge step, no pledge yet) | No pledge yet. Write one promise you can keep every day, in your own words. | No pledge yet. Write one promise you can keep every day. |
| src/app/day/night.tsx (Night, mood step, line under "Low") | It took something | It wore you down |
| src/app/day/night.tsx (Night, mood step, line under "Great") | One to keep | Do it again |
| src/app/day/night.tsx (Night, note step, title) | Anything worth keeping? | Anything to write down? |
| src/app/day/night.tsx (Night, note field, screen-reader label) | Anything worth keeping | Anything to write down |
| src/app/day/night.tsx (Night, last step, caps line over the lesson task) | Tonight’s action | Tomorrow’s action |
| src/components/day/board.tsx (Night, today’s record, button that opens the urge log) | Add to the record | Log an urge |
| src/components/day/board.tsx (same button, screen-reader label) | Add to the record | Log an urge |
| src/app/(app)/log.tsx (Log, Urges, empty) | When a wave hits, logging it is what turns it into data. | Log each urge. In time, you’ll see the pattern. |
| src/app/(app)/log.tsx (Log, Check-ins, empty) | Twenty seconds in the morning starts one. | The first one takes two minutes. |
| src/app/(app)/log.tsx (Log, Reports, empty) | The first one arrives once a full week has closed. | The first one comes after a full week. |
| src/app/(app)/log.tsx (Log, Reports, caption under the rating) | Recovery rating, {+n} this week | Recovery rating, {+n} last week |
| src/app/(app)/log.tsx (Log, Reports, button) | Open this week’s report | Open last week’s report |
| src/app/log-chooser.tsx (What are you logging?, first row, line under "Daily check-in") | Mood, energy, the pledge | How today is going |
| src/app/log-chooser.tsx (What are you logging?, third row) | A lapse | A slip |
| src/app/lapse.tsx (Slip logged, line under the title) | Stopped and logged. | Carry on from here. |
| src/app/urge-overview.tsx (Urge overview, every empty page when no urge was logged; four variants) | Nothing logged {in the last 30 days / this week}, so there is no {urge / pattern / mood pattern / timing} to read yet. | No urges logged {in the last 30 days / this week}. |
| src/app/weekly-report.tsx (Weekly report, a week the account never lived) | Nothing was logged that week, so the report has nothing to draw on. | Nothing was logged that week. |
| src/app/weekly-report.tsx (Weekly report, before the first week closes) | Your first week is still being written. Keep checking in; the report appears once a full week closes. | Your first report comes after a full week. Keep checking in. |
| src/app/report-ready.tsx (Report ready, line when no week can be named) | Rating, urges, and the pattern — two quiet minutes. | Your rating, days and urges. |
| src/app/(app)/dashboard.tsx (Insights, third number) | Days kept | Clean days |
| src/app/(app)/dashboard.tsx (Insights, What sets it off, empty) | Log an urge and its trigger. The bars build from there. | Log an urge to see what sets it off. |
| src/app/(app)/dashboard.tsx (Insights, Medallions row) | The campaign album | Earned and to come |
| src/components/MoodLogger.tsx (quick check-in, mood scale, rung 1) | Heavy | Rough |
| src/components/MoodLogger.tsx (quick check-in, mood scale, rung 2) | Overcast | Low |
| src/components/MoodLogger.tsx (quick check-in, mood scale, rung 3) | Mixed | Steady |
| src/components/MoodLogger.tsx (quick check-in, mood scale, rung 4) | Mostly clear | Good |
| src/components/MoodLogger.tsx (quick check-in, mood scale, rung 5) | Clear | Great |
| src/components/MoodLogger.tsx (quick check-in, morning, first question) | Where's your head at today? | How are you feeling? |
| src/components/MoodLogger.tsx (quick check-in, evening, first question) | How did today land? | How was today? |

## Notes

- The quick check-in's mood words were weather words that only it used. They now match the five words the
  morning and night check-ins, the Log and the Insights legend ("Rough → Great") already use. The mood is
  stored as a number, so no saved data changes.
- "Days kept" on Insights counts days without a slip. The weekly report already calls the same count
  "Clean days", so the two screens now agree.
- "Stopped and logged." did not say what to do next. The slip board now ends on the next step: "Carry on from
  here." I chose this over "Now start again." because the programme never resets after a slip, and the slip
  lesson sets "carry on" against "start again from the beginning". Straight after a slip, "start again" can
  read as "back to zero". STYLE.md's rule 7 example and the "Start again" button in src/app/slip.tsx (outside
  this package) still use "start again"; if you prefer that phrase, put "Now start again." back.
- The night record's button opened the urge log but was called "Add to the record". It now says what it does.

## Left alone on purpose

- Stored or compared values: the fallback day steps (`DAY_STEPS` in src/components/day/kit.tsx, saved as the
  day’s action and matched by text), the urge outcomes ("Rode it out", "Surfed with the timer", …, saved as
  `whatHelped`), the nine trigger chips, the eight feelings and eight causes on the check-in tiles, the HALT
  words and "I don’t know" in src/components/logflow/data.ts, the morning’s "Yes" / "Not yet" and the "When"
  chips (matched by text in code).
- The intensity words in src/lib/weeklyReport.ts (`severityWord`) must stay the same as the intensity scale’s
  labels in src/components/ui/IntensityBands.tsx, which is outside this package.
- The rating bands (Starting, Steadying, Holding, Strong) and parts (Showing up, Clean days, Lessons) are
  already plain.
- The "—" in the logged summary cards marks an empty cell, not a pause in a sentence.
- Lesson titles and tasks shown on Today and in the check-ins are lesson content.

## Fixed after review (the screen said something untrue)

These three were left for the owner in the first pass. On review they read as plain errors, so they are fixed.

- Night check-in, last step: "Tonight’s action" is now "Tomorrow’s action". Done saves the action on the next
  day’s row, and Today shows it the next day as that day’s task. The "Skip tonight" link below it is unchanged:
  it skips naming the action tonight, which is still true.
- Log, Reports: the button and the caption above it said "this week", but they show the latest finished week,
  which is always last calendar week (the list starts from the Monday before the current one). Elsewhere on the
  Log, "this week" means the current week ("Urges this week"). Both now say "last week". The weekly report
  screen keeps its own "this week", because its pill names the week it shows.
- Log chooser: the check-in row’s line said "Mood, energy, the pledge", which is only the morning check-in. After
  dark the same row opens the night check-in, which asks about the day, feelings, causes and tomorrow’s action.
  "How today is going" fits both.

Also from the review:

- Insights, What sets it off, empty: "Log an urge and its trigger to see it here." left "it" unclear. Now "Log
  an urge to see what sets it off." The urge log needs at least one trigger before it continues, so this holds.
- Insights, Medallions row: "What you’ve earned" described only half of the medallions screen (Earned / Still to
  earn), and nothing for a new account. Now "Earned and to come", the same length, still one line.
- Today, week strip: screen readers heard "held" for a day with no slip, a word no other screen uses. Now
  "clean", as on Insights and the weekly report. Only the spoken label changed; the state it checks is the same.
- Morning, energy step: "Ask little of yourself" under "Empty" leaned toward the self-care register. Now "Do the
  basics", a small, practical step. These lines are display only, never stored.
