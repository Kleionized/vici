# Library decisions — Vici Overhaul run, Phase 1 (D240–D249)

Files: `src/app/(app)/library.tsx`, `src/app/week/[week].tsx`, `src/components/library/WeekPage.tsx` (new;
`WeekBoard.tsx` deleted), `src/components/journey/JourneyScreens.tsx`, `src/app/journey/{index,[chapter]}.tsx`,
`src/app/{first-steps,lessons-browser,search}.tsx`, `src/app/(app)/locked.tsx`. Deleted (grepped, no importers):
`src/components/library/WeekBoard.tsx`, `src/components/journey/{WeekScene,WorldArt,WorldCardArt}.tsx`,
`src/content/weekScenes.ts`. Seeds `.overhaul/library-seed.js` (day 38), `.overhaul/library-day3-seed.js`.
Recipes `.overhaul/recipes/library.json` (the old `weeks.json`, a day-12 world, is deleted — it sorted after
`library.json` and would have overridden it).

## D240 — The Library tab is the twelve week pages, a horizontal pager (D325)
`(app)/library.tsx` lays the twelve `WeekPage`s side by side in a paging `ScrollView` and opens on the reader's
current week (`ceil(day / 7)`, clamped 1–12: Week VI on the frames' day 38; Week XII past day 84), or on
`?week=N`. Only the page in view and one either side are mounted. `/week/[week]` is now a `<Redirect>` to
`/(app)/library?week=N` (clamped), so the All drawer's `A week · board`, the recipes and any old link land on
the tab with the bar lit — the bar comes from the navigator, as on every tab. A request arriving while the tab
is mounted turns the pager to it; the param is consumed (`setParams`) so asking for the same week again works
after a swipe (checked). The back chevron — kit `chevronL()`, a 40-tall box at 22,60, z 5 — is held still over
all twelve pages and does `router.back()` when there is history (inside the tabs that is the tab history: the
navigator's default sends it to Today) and `navigate('/(app)/today')` otherwise. Sideways swiping is an
interaction the canvas does not draw; it adds no pixels.

## D241 — P1 / P2 are one rows viewport (CRITIC §5, library Q2)
The rows sit in a vertical `ScrollView` from canvas 472 to 12 above the scene's foot (the bar's top): 264 at
852. Its content is the seven rows (gap 8) plus `paddingBottom = view + 264 − 454`, so the last scroll position
is always P2 (row 5 on the viewport's top edge) and scroll 0 is P1 (row 5's top on the clip — nothing shows in
728–748). All 24 frames diff at ≤ 0.01 % with nothing outside the hero band. Recipes reach P2 with a `do` that
scrolls only the scrollers inside the viewport — `--scroll=end` picks the first-mounted page's (the
neighbouring week), so it cannot be used here.

## D242 — Rows: calendar-day states, every row opens the reader
`rowStateFor(lessonDay, day)`: `< day` done (24 ink disc + `#111111` check, chevron `#9B968E`), `=== day`
current (ink card, number at `rgba(17,17,17,0.6)`, `#111111` title, `Continue` 13/700), otherwise upcoming
(number `#9B968E`, chevron `#5A574F`). The day is `floor((now − createdAt)/1 day) + 1`, read against the moment
the screen mounted — completion records are not consulted (library Q3, unchanged behaviour). Every row in every
state pushes `/lesson/day/<n>` (PHASE1; `/lesson-card` is a redirect to it now). No lock and no gating — the
frames draw upcoming rows with a chevron and the app never gated the board. Each row is one button labelled
`"<title>, lesson <nn>, completed|today|upcoming"`. Titles are 15/700 with `text-wrap: wrap` (the span states
none; `rowLabel`'s default `nowrap` is overridden) — the nine two-line titles break where the frames do.

## D243 — Other phone sizes
Taller than 852 the viewport runs towards the scene's foot (430 × 932: rows 1–5, its foot trimmed per D247) rather
than stopping at 264 over a band of empty ground; the last position is still P2. Below three rows of viewport
(a phone under ~770 tall — 375 × 667 gives 113) the page scrolls whole from the safe-area top (D320 rule 3):
chevron, hero, header and rows in one scroll, the chevron riding with it so nothing passes under a pinned glyph.
The pager hides its pinned chevron in that mode. Checked at 375×667 (scroll 0 and end) and 430×932.

## D244 — `CourseRow`: the week-page row, reused by the unframed screens
`WeekPage.tsx` exports `CourseRow` (`lead: 'check' | label`, `title`, optional `caps` line above and `detail`
line below — 13/400 `#9B968E`, 18 — `state`, `trailing` override or `null`, `onPress`/`disabled`, `label`),
`LessonRow`, `LessonRows`, `WeekHeader`, `WeekBack`, `WeekPage`, `rowStateFor`, `courseDay`, `useCourseDay`,
`weekForDay`, `clampWeek`, `lessonNumber`, `useRowsViewport`, `WEEK_HERO_TOP`. With no `onPress` the row is a
plain `View` (no button role). With `caps`/`detail` the row pads 11 above and below and grows past 58 only when
its text needs it. The hero tops are the frames' stated values (80, 98.9, 63.9, 114.4, …), not the rule they
follow (`T = 102 − 1.1·(bounds bottom − 190)`).

## D245 — The unframed screens (routes §4.5, 4.9–4.12; copy unchanged, CRITIC G12)
* **Lessons browser** — nav row geometry with an 80 word slot each side: `Cancel` (15/700 ink), caption
  `Lessons`, an 18 search glyph (no frame draws one; drawn in the kit's 2-pt line) → `/search`. Each week:
  caps `Week <roman>` + `h1` name, then its seven `LessonRow`s; lessons past today are listed and disabled
  (CRITIC C7 — no lock glyph). The paper shelves and lesson plates are gone.
* **Search** — Sheet Edit Name's field (`TextField variant="sheet"`, autofocus) with `Cancel` beside it; the
  three recent words as single-select `Chip`s that fill the query (on while the query equals it); the count as
  caps; results as `CourseRow`s with the week on a caps line and the summary under the title, chevron `#9B968E`.
  Same filter (title + summary + week name/blurb). Rows push `/lesson/day/<n>`.
* **First steps** — close-only `NavBar` with the caption, `h1` + `p`, the lesson reader's 3-pt rail (`#2E2E2E`,
  ink fill = done/6) and the caps count line; the six as `CourseRow`s: completed → check, today → current, open
  → number + `#9B968E` chevron, not open yet → number + `#5A574F` chevron, disabled. Close-then-push kept.
* **Locked** — back `NavBar`, `Weeks` 32/38, Week I as a done row (`Completed · 7 lessons`), weeks II–IV as
  upcoming rows (numeral, name, blurb, no glyph, no fade), the Closed-door illustration in place of the paper mist
  vignette, `11 more weeks ahead` (`h1`, centred) + the existing line, `Unlock VICI Plus` primary → `/paywall`.
  On a phone where the column would not fit above the pill the door is dropped (D320 rule 1, once).
* **Campaign** (`/journey`, `/journey/[chapter]`) — the week page's form: a `Lesson-Illustrations-v4` hero
  standing on canvas 292 by the week pages' rule (Landing `sunrise`, Crossing `compass`, Highlands `mountain`,
  Watch `lighthouse`), caps `Chapter <roman>`, title 30/36, the chapter's line 15/22, and its three marks as
  `CourseRow`s (done → check, here → current, not yet → number) with the day range where the week page puts
  `Continue`/the chevron; the Watch closes on the laurel + `Day 90 · the vow, renewed` in caps. The index stacks
  the four; each page scrolls from the safe-area top. `CHAPTERS`, `CHAPTER_ORDER`, `CHAPTER_LAST_DAY`,
  `chapterForDay`, `useJourneyDay`, `useCurrentChapter`, `JourneyChapter`, `JourneyScroll` keep their names;
  `ChapterKey` now lives here. The dead `CampaignMap` / `CampaignGrounds` (no importers) went with the paper art.

## D246 — Residual: hero edge anti-aliasing
Every week page's only mismatch is inside the hero band: 0–139 px over 24/255 (≤ 0.01 %), on near-horizontal
art edges (the flag's hem, the scale's beam, the lighthouse island). Not a position error: the design frame
re-rendered with its svg at `top: 99` instead of `98.9` diffs 0 px against the original (Chrome snaps the
svg box to the whole point — D373 confirmed by capture), and the app against either is the same 78 px on Week VI.
It is the browser rasterising a CSS-transformed `<svg>` versus react-native-svg's `<G transform>`; the kit's
`Hero` owns that choice.

## D247 — The taller viewport stops on a row edge
The frame's own 264 lands exactly on row 5's top edge. Run to the scene's foot, 430 × 932 leaves 344, which shows
14pt of row 6 as a stray band just above the bar. `useRowsViewport` raises the foot to the edge of the first row it
would cut (`view − view % 66` when the cut falls inside a row), so 932 shows rows 1–5 whole (330) and P2 still ends
on row 5's top. 852 (264) and 844 (256 — the cut falls in the 8 gap) cut no row and are unchanged. Re-checked in
Phase 2 at all three sweep sizes, scroll 0 and end.

## D248 — Phase 2: two-line runs on the unframed rows, the centred lines
No frame draws these; each is a line-break fault seen on the size captures, fixed without touching the frames.
* `CourseRow`'s `caps`/`detail` form (search, first steps, locked — never the week rows, whose titles keep the
  frames' greedy wrap) sets its title and detail `pretty`, so a two-line title or one-liner does not end on a
  lone word at the narrower widths (search at 375 now reads "Get support during a / difficult period").
* Locked's line is two sentences under a centred `h1`; greedy left "the mist." alone at 393, balance split
  "The / road". It now breaks between the sentences (`\n`; each fits a line at every width — fixed copy, D332), and
  its straight apostrophe is the system's `’`.
* The campaign chapters' lines (two lines each, centred under the title) balance, as a centred two-line `p`
  does elsewhere: "…keep / the light on for the long run." instead of a lone "run.".
Phase 2 verification scripts: `.overhaul/lib-unframed.mjs` (the unframed screens at 393/375/390/430, scroll 0
and end) and `.overhaul/lib-backpaths.mjs` (20 flows, every back path and lesson door, D340 history included).
