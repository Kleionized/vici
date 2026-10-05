# Curriculum decisions — Phase 0 Part F (D395–D399)

Merged into DECISIONS.md by the orchestrator. Files: `scripts/overhaul/gen-curriculum.mjs` (new),
`scripts/overhaul/curriculum-legacy.json` (new, frozen input), `src/content/curriculum84.ts` (regenerated).

## D395 — `curriculum84.ts` is regenerated from the frames; the API keeps its shape
`node scripts/overhaul/gen-curriculum.mjs` (`--check` to verify, `--table` for the title table) reads:
the 12 Email-Login week pages (`Week-<R>-<Name>.html` + `-P2`: caps, name, blurb, `data-hero`, the seven
rows), the 84 readers' covers (`L<n>-Frame-1`: `Lesson <n>`, title, `data-hero`), each reader's first
`Part 1` page, and its two task pages (`Today’s task` + title + practice; practice + `Done when` card).
All 1,273 lesson frames are read. The run fails unless: every week page lists exactly its seven cover
titles in order; titles, practice arrays, "Done when" lines and first reading pieces equal
`gen/lessons-v3.json` (84/84 each); the task page's title equals the cover's (84/84); week
names/blurbs/romans equal the app's previous values (12/12 — unchanged); every hero id is one of the 53
`Lesson-Illustrations-v4` `data-hero` ids.

Every export and type the app imports is kept (`CURRICULUM_84`, `CURRICULUM_84_DAYS`, `lessonForDay`,
`weekFor`, `Curriculum84Week`, `Curriculum84Lesson`, `DailyTask`, `TaskBoard`, `TaskIntro`, `TaskFlow`,
`TaskOption`) with every field. Added: `CurriculumHeroId`, `Curriculum84Week.hero`,
`Curriculum84Lesson.hero`, `DailyTask.practice: string[]`, `DailyTask.doneWhen: string`.

The previous drop's two-board task (`task.title`, `secondTitle`, `intro`, `options`, `done`, `close`,
`board`, `intro2`, `flow`) and `titleSize` are read only by `/task/[day]` and `/lesson-card/[day]`, which
no frame in this drop draws and which become redirects (D324). They are kept byte-for-byte (deep-compared:
0 differences) from a one-time snapshot of the previous build, `scripts/overhaul/curriculum-legacy.json`
(`--freeze-legacy`, which refuses to run on an already regenerated file), and marked `@deprecated` in the
types. When lessons turns both routes into redirects, drop those fields from the generator and delete the
snapshot.

## D396 — `summary` keeps the previous build's one-line strings (lessons Q8, option 1)
No frame in this drop draws a one-line lesson summary (the old card is gone; covers carry only
`Lesson <n>` + title). Lessons Q8 offered two answers: keep the old summaries, or drop the field. Dropping
it would change the API. So `summary` is the previous build's string, unchanged (84/84 equal to
`refs/snapshots/pre-overhaul-full`, 34–83 characters), read from the frozen `curriculum-legacy.json`.
These were written for the previous lesson under each day, so some no longer describe the new title.
L2 is an example: "Day zero isn’t a loss…" now sits under "Remove easy access to porn". That is the trade
Q8 named. Its readers: `/search` (title + summary + week match), `/first-steps` (one line under each row),
`/lesson-card` (legacy, until it becomes a redirect), and `lib/curriculum.ts` `bodyMarkdown` (not displayed).

An earlier pass of this part set `summary` to the lesson's first reading piece (81–210 characters). No
spec asked for that, and on `/lesson-card` at 375×667 (D320) it ran under the `Start lesson` pill on 84 of
84 lessons, by up to 79pt. With the previous strings the count is back to the pre-overhaul figure: 1 of 84
(L32, by 10pt, the same before this run), measured in-page over all 84 against the pill's rect. At
393×852 and 430×932 the count is 0 of 84. The generator still reads the first reading piece and
cross-checks it against `lessons-v3` `sections[0]` (84/84), but only as a check. If the orchestrator later
wants the field on the new course's words, it is a one-line change in the generator (`l.legacy.summary` →
`l.firstPiece`), safe once `/lesson-card` is a redirect.

## D397 — Today/Night task card: the lesson's title over the previous drop's task sentence
Canvas contradiction (lessons §10.3): `Today Home Task` ("Today’s task: Prepare for tonight" / "Put the
device you use for porn out of reach before you sleep.") and `Night Action Reminder` ("Prepare for
tonight" / the same sentence) draw `task-src.json[1].summary`, the previous drop's task, not the new
reader's L1 practice. The frames win: `task.cardTitle` = the lesson title, `task.cardSummary` =
`Vici Overhaul/project/task-src.json` `summary`, apostrophes/quotes curled (equals the app's previous
`cardSummary` 84/84). The reader's own task is `task.practice` + `task.doneWhen`.
The frames draw this pair only on day 1, where the two strings agree. On the other 83 days the
sentence is the previous drop's task for that day, so it can describe a different task from the new
title. Example: L41 "Give the action a time and place" over "Write three simple rules for situations
that have caught you before and make one easier to follow." That follows CRITIC §3.1.5 / lessons §10.3
as ruled. If the orchestrator wants the card to match the reader, `cardSummary` could become the first
`practice` paragraph or `doneWhen`, a one-line change in the generator. Day 1 would then stop matching
both frames.

## D398 — `titleSize` (legacy) for the new titles
`/lesson-card` sets the title at `titleSize` with a 23/30 or 20/27 ramp. The previous card stepped down
only its one title longer than 27 characters. The same rule on the new titles: `length > 27 → 20`, else
23 — 48 of 84 step down. It only keeps the legacy card from colliding with its summary until the route
becomes a redirect; the new canvas sets every lesson title at one size (30/36 cover, 24/31 task).
Measured in-page over all 84: every title that wraps to two lines is at 20/27, so its line box ends
2pt past the summary's top (`top 396 + 54 = 450` vs `448`). This happens on 14 of 84 lessons at 393×852,
23 of 84 at 375×667 and 5 of 84 at 430×932. The glyphs do not touch (`/lesson-card/19`, `/64`). No
`titleSize` value can do better, because a two-line title at 23/30 would end at 452. The remaining 2pt
comes from the route's fixed `top`s, which go away with the redirect.

## D399 — Hero ids in the curriculum
`hero` (lesson: the cover's `data-hero`; week: the week page's `data-hero` — not its first lesson's cover,
e.g. Week II = `signpost`, L8 = `calendar`) is typed `CurriculumHeroId`, the union of the 38 ids the
curriculum uses. It is a subset of the 53 card ids, so it is assignable to `src/content/heroes.ts`'s id
type without importing a file another part generates concurrently. The cover ids agree with library.md
appendix A (84/84) and the week ids with library.md §1 (12/12).

## Old → new titles (L = day; cover hero)

| L | Wk | old title | new title | cover hero |
|---|---|---|---|---|
| 1 | I | Surviving the Night | Prepare for tonight | `nightPhone` |
| 2 | I | A New Start | Remove easy access to porn | `sunrise` |
| 3 | I | Get Outside | Choose where to go instead | `bench` |
| 4 | I | Fix Your Sleep | Prepare for sleep | `bed` |
| 5 | I | What Replaces Porn? | Have another activity ready | `books` |
| 6 | I | Isolation | Make time for contact | `twoCups` |
| 7 | I | One Week In | Review the first week | `cake` |
| 8 | II | More Than a Streak | Measure more than a streak | `calendar` |
| 9 | II | After a Relapse | Stop sooner after a slip | `sunrise` |
| 10 | II | The All-or-Nothing Trap | Use the hours that remain | `scale` |
| 11 | II | Progress Isn’t Linear | Try one change for a week | `chartUp` |
| 12 | II | Identity | Repeat one useful action | `idCard` |
| 13 | II | Values, Not Shame | Choose your own reason | `compass` |
| 14 | II | Keep Going | Return after a missed day | `signpost` |
| 15 | III | The Life of an Urge | What to do when an urge starts | `stopwatch` |
| 16 | III | What’s the Urge Really For? | Check what you need | `thermometer` |
| 17 | III | Move First | Close the screen and move | `sneaker` |
| 18 | III | Redirection | Prepare another activity | `signpost` |
| 19 | III | HALT | Check hunger, anger, loneliness, and tiredness | `kettle` |
| 20 | III | Urge Surfing | Notice an urge without acting on it | `lighthouse` |
| 21 | III | Masturbation | Make a separate choice about masturbation | `shower` |
| 22 | IV | The Reward System | Understand what starts the habit | `brain` |
| 23 | IV | The Control Center | Decide before the difficult hour | `brain` |
| 24 | IV | Hungry and Tired | Make room for food and sleep | `kettle` |
| 25 | IV | Angry and Lonely | Respond to anger and loneliness | `thunderCloud` |
| 26 | IV | The Pull of Novelty | Notice when searching keeps going | `tab` |
| 27 | IV | Change Your State | Try movement, breathing, or another room | `shower` |
| 28 | IV | Autopilot | Act earlier in the habit | `dominoes` |
| 29 | V | The Scale | Look at the benefit and cost | `scale` |
| 30 | V | The “Benefits” of Porn | Meet the need you can identify | `tab` |
| 31 | V | The Hidden Reward | Begin a task you are avoiding | `envelopeOpen` |
| 32 | V | The Short-Term Cost | Address one immediate cost | `clock` |
| 33 | V | The Long-Term Cost | Make time for what viewing displaced | `calendar` |
| 34 | V | Tipping the Scale | Make one change for tonight | `scale` |
| 35 | V | Repairing the Scale | Give an activity a place in the week | `scale` |
| 36 | VI | What is Willpower? | Prepare a simpler response when tired | `battery` |
| 37 | VI | Train Your Response | Practise the response | `sneaker` |
| 38 | VI | What Discipline Isn’t | Keep rules that serve a purpose | `halfMast` |
| 39 | VI | What Discipline Is | Practise the part that gets in the way | `compass` |
| 40 | VI | Thoughts and Feelings | Let a thought remain while you act | `thunderCloud` |
| 41 | VI | Choose Your Action | Give the action a time and place | `signpost` |
| 42 | VI | Damage Control | Plan for a difficult day | `umbrella` |
| 43 | VII | Relapse Isn’t the End | Learn from a slip | `halfMast` |
| 44 | VII | Learn From the Relapse | Take care and make a repair | `notebook` |
| 45 | VII | Don’t Punish Yourself | Adjust the plan for today | `mirror` |
| 46 | VII | Rough Days | Get support during a difficult period | `thunderCloud` |
| 47 | VII | When Life Gets Hard | Return to the task you postponed | `mountain` |
| 48 | VII | Face What You’re Avoiding | Begin the next part of the day | `door` |
| 49 | VII | Don’t Wait for Tomorrow | Take a step after a longer setback | `calendar` |
| 50 | VIII | Boredom | Give an activity time before switching | `clock` |
| 51 | VIII | Escaping Boredom | Choose what begins in an empty gap | `tab` |
| 52 | VIII | Learn to Be Bored | Try fifteen minutes without switching | `bench` |
| 53 | VIII | Screen Boundaries | Change one screen habit | `phoneTable` |
| 54 | VIII | Dopamine Detox | Try an hour away from one feed | `feedOff` |
| 55 | VIII | Wake Up With Purpose | Prepare the first hour after waking | `sunrise` |
| 56 | VIII | Meaning | Give time to something that matters | `compass` |
| 57 | IX | Why Relationships Matter | Arrange a shared activity | `twoCups` |
| 58 | IX | Loneliness | Choose contact that fits | `bench` |
| 59 | IX | Solitude | Choose how to spend time alone | `bench` |
| 60 | IX | What Porn Replaces | Separate desire from wanting company | `twoCups` |
| 61 | IX | Friendship | Follow up on a connection | `twoCups` |
| 62 | IX | Unhealthy Relationships | Set a safe limit on harmful contact | `thunderCloud` |
| 63 | IX | Healthy Relationships | Give a relationship attention | `twoCups` |
| 64 | X | Trauma | Choose support without revisiting painful events | `umbrella` |
| 65 | X | Your Environment | Change one difficult setting | `plant` |
| 66 | X | Self-Criticism | Describe a mistake without an insult | `mirror` |
| 67 | X | Self-Loathing | When you feel bad about yourself | `mirror` |
| 68 | X | Self-Compassion | Check your response to self-criticism | `plant` |
| 69 | X | Self-Trust | Keep one manageable commitment | `compass` |
| 70 | X | Self-Improvement | Simplify the plan | `chartUp` |
| 71 | XI | Know Yourself | Use what your notes show | `mirror` |
| 72 | XI | Amor Fati | Choose what you can do now | `umbrella` |
| 73 | XI | Memento Mori | Reserve time for what matters | `hourglass` |
| 74 | XI | Carpe Diem | Begin an activity you postponed | `sunrise` |
| 75 | XI | The Next 90 Days | Plan the next ninety days | `calendar` |
| 76 | XI | Peace of Mind | Give one activity your attention | `lighthouse` |
| 77 | XI | This Time Next Year | Schedule something you want to keep doing | `envelope` |
| 78 | XII | What Forever Means | Keep the reason and next action clear | `lighthouse` |
| 79 | XII | Twelve Weeks Ago | Compare the start with now | `calendar` |
| 80 | XII | What Changed in Your Brain | Prepare for a changed situation | `brain` |
| 81 | XII | Winning the Battle | Use the changes that helped | `flag` |
| 82 | XII | Lessons From Addiction Recovery | Check how to ask for help | `books` |
| 83 | XII | Saying Goodbye | Finish with an honest next step | `envelopeOpen` |
| 84 | XII | The Future | Save a short plan for after the course | `sunrise` |
