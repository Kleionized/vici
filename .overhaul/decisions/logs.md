# logs decisions — Vici Overhaul run, Phase 1 (D280–D289)

Files: `src/app/(app)/log.tsx`, `src/app/{log-chooser,lapse,urge-log,urge-overview,report-ready,weekly-report}.tsx`,
`src/app/(app)/dashboard.tsx`, `src/components/logflow/*` (new), `src/components/insights/heat.tsx`,
`src/lib/weeklyReport.ts` (additive). Recipes: `.overhaul/recipes/logs.json`. Seeds: `.overhaul/logs-*-seed.js`
(each = `window.__CLOCK` + `clock.js` + `logs-data-common.js` + a `logs-data-*.js`).

## D280 — The log flows are steps on the kit, in `src/components/logflow`
`WhenStep` (chips · "Or choose a time" · the kit `TimeWheel`, always open · `DateRow`), `ChipsStep`,
`OptionsStep`, `DoneBoard` (84 disc, shrink-to-fit `SummaryCard` per C10), `FlowNav`, `useWhen`, plus the
Log's register pieces (`RegisterHead`, `BigStat`, `WeekStrip`, `DotRows`, `Histogram`, `Bubbles`, `Dial`,
`Spark`, `ScoreLine`, `DayCells`, `LastWeek`, `PagedRegister`; `src/components/logflow/data.ts` holds what
they print from an event). Each step's stack sits in a `ScrollRegion`
between the nav row (100) and the primary (106 off the bottom) — the frame at 852; on a short phone the stack
(and the done boards' disc + stack) first rises into the room under the nav (never above canvas 108) until it
clears the pill by 16, and only what still does not fit scrolls (D320 rules 2–3, the `HeroBoard` lift applied to
question and done boards — Lapse Done's card touched its pill at 375 × 667 before); the question boards' heroes pass `controls={106}` (rule 1). `urge-log.tsx`'s old exports
(`FlowTop`, `TimeWheel`, `LoggedNote` …) were moved to a shim for `slip.tsx`, then deleted once the slip group's
rewrite stopped importing them (grepped: no importer left). `(app)/log.tsx`'s old exports (`Halo`, `SunDisc`,
`ramp150`, `LogRow`, `TriggerGlyph`, `OUTCOME_WORD`, `ONE_LINE`) had only this group's importers and are gone.

## D281 — When: the wheel sets the time on the moment's own day; "Change" picks the day; never the future
The old wheel's day column has no place in the frame — the date row's "Change" is the only door left to the
day (logs Q4). It opens a kit `Sheet` of the last seven days as option rows (`Tonight, Tue Jul 22`,
`Last night, Mon Jul 21`, `Sun Jul 20` …, each at the moment's own time). The wheel's columns do not carry
(59 → 00 keeps the hour), so a wheel move sets hour/minute/period on the same calendar day rather than
shifting a timestamp. A chip sets `now − offset` as before; the wheel or the day list turn every chip off
(a chip tap puts them back in charge). Any moment later than the flow's clock is held at it — a logged urge
cannot be in the future (the old date column could reach two days ahead).

## D282 — Zero triggers keeps Continue disabled (undrawn)
The app has always disabled the trigger step's Continue until something is picked; the frames never draw the
zero state. Kept, with D321's 0.38 pill. The label is `Continue` in every state (the frames' — no `· 2`).

## D283 — The Log's lists end at the last whole row on a phone that shows five
Log Urges and Log Check-ins draw five ruled rows and nothing under them, yet Check-ins' "12 days in a row"
means twelve check-ins. Showing all twelve put a sixth row at 704–748 above the bar, where the frame has bare
ground. The page still scrolls whole (head included) and still holds every entry; where the phone shows at
least five rows, its window ends at the last whole row's foot — at 852 the fifth's, 440 + 52 + 4 × 53 = 704,
44 above the bar (seven rows and 18 on a 932 phone). A shorter phone keeps its cut row, which is what tells
the reader the list scrolls. Reports' rows start at 518 and are not folded (its four earlier weeks end at 730).

## D284 — One score for the Log's Reports and the Weekly Report
The old Log card summed per-week deltas (`reportWeeks`, no lessons, seven clean days a week from day one)
while the old report's line used `scoreAt` (lessons, days since the account opened) — the two would print
different numbers for the frames' shared "1,240 · +12 this week". Both now read `weekScore()` in
`src/lib/weeklyReport.ts` (`scoreAt` at each day's end, delta against the Sunday before), which also agrees
with Today's `buildScore` total. logs.md §3.7 says to preserve `reportWeeks()` and §3.13 to preserve
`scoreAt`; the two cannot both hold for one shared number, so this is a ruling the orchestrator is asked to
confirm (not a D324 change). Additive lib exports: `scoreAt`, `weekScore`, `weekLabel`, `dayStatuses`,
`DayStatus`.

## D285 — What the Log prints from the log
"This week" is the Monday-start calendar week the strip draws (CRITIC §5). `Urges this week` and the strip
count urges (`urge_rode_out` + `urge_acted_on`); a lapse is a row (`● Slipped`, ink, never red) but not an
urge. Row times: `Today` / `Yesterday`, the short weekday for 2–13 days ago, the date after
(`Jul 6, 9:05 pm`); right side the band word, `Slipped`, or `Ridden out` for an urge logged without a
strength. Check-ins: the circle is `12 + 4.4·energy` (the frame's 29.6/25.2 fit it exactly; mood stands in
when a day has no energy), the word is the night's first feeling else the morning mood word
(Rough/Low/Steady/Good/Great) — the frame mixes both vocabularies (logs Q9). Singular captions (`1` /
`Day in a row`, `Urge this week`) are the frames' strings in the singular. Empty registers keep the old
title + line in the kit `EmptyState` under the big number and an all-dot strip.

## D286 — Urge overview rules
Range = the last 30 days (the pill says so); `?week=` (from the report's Urges page) narrows it to that week
and the pill names it. Summary lists the five newest (the frame: five rows for nine urges); a ridden urge
prints its minutes (≥ 1) or `Ridden out` if never timed. Strength's word is the modal band, a tie going to
the lower band (the frame's 3-and-3 reads `Strong`); five dots fit a band's column. Mood bubbles are the rank
series 88/66/54/36 (CRITIC §5); the dial's dot is `5 + 2.5·n` (7.5 and 10 as drawn), capped at 12.5; the
peak is the busiest two-hour window by sliding sum (the frame's 23-vs-0 tie resolves to 11 pm – 1 am).
Dot rows cut their dots at what fits the row; the count still says how many. An empty page keeps the old
sentence with the range said as the pill says it ("Nothing logged in the last 30 days, so …").
**The app's own words** (verifier, Phase 1 re-check): the frames' sample words (`Bedroom`, `Tense`) fit their
fixed columns; the words the app records do not — SOS places `Somewhere private` (131 at 15/700) and `At work
or school`, SOS triggers `Something online`, feelings `Stressed or anxious` (354 at 44/700). So the columns
read what they are given (`useLabelColumn` / `useTextWidths` in `logflow/parts.tsx`, off-screen one-line
measures that drop out once read): the dot rows' label column is the widest label, never under the frame's
96, at most half the row; past that a label (a note standing in for a place, as the old list allowed) ends
in an ellipsis, as the old place list did. The Mood page flows from 236 (`PaneBody flowTop`): the big word
wraps balanced and centred where it would overrun (type never shrinks, D320) and the bubbles follow 17
under it; bubble names that cannot sit side by side close the 26 gap toward 16, then the widest wrap
(balanced, never under `max(bubble, longest word)`), and only if even the longest words cannot fit do the
smallest ranks drop. With the frame's words every one of these resolves to the frame (0.00 % on all four
panes). Insights' trigger bars take the same label column. The dot row is a local row (the kit `RuledRow`'s
box) because the kit row's label cannot end in an ellipsis — reported.

## D287 — Weekly report rules
Days: `slip` (a lapse or an urge acted on) and `none` (before the account, after now) draw the undrawn hollow
40 cell (inset 1.5 `#2E2E2E`, as last week's hollow dot); a ride with no slip is the wave; the rest the check.
The number is clean days of the days the account lived that week (`7 of 7`). Urges: the week read forward,
every urge (the page scrolls), each row opening `/urge-overview?week=`; caption `Urges, all ridden out` /
`Urges, 2 ridden out` (and `Urges this week` + the old "No urges logged this week." when there are none).
The score line scales its x's to the column instead of the frame's `preserveAspectRatio: none`, so the dots
stay round on a 430 phone — at 393 the only trace is the frame's own 329/330 squash of its day letters
(0.01 %). The empty states are the old two sentences under the title head. `?from=settings` (93D) changes
nothing drawn; back is `back()` / Insights as before.
**What empties it**: the old screen was built on mood rows, so `hasReportContent` (a mood logged that week)
gated it. This one draws the score, the days and the urges, which exist for every week the account lived —
and the Log's Reports row and the mail row have already named that week (`Jul 7–13 · +8`, which opened
"Nothing was logged that week" before). The report now draws every week the account lived; "Your first week
is still being written…" stays for no closed week, "Nothing was logged that week…" for a `?week=` the
account never lived (a stale link). The launch gate in `(app)/_layout` still reads `hasReportContent`, so it
delivers no more reports than before — widening it is the orchestrator's call.

## D288 — Urge Log Done's line
`<count in words> ridden out. <to go in words> to <Metal>.` — the count is the Vici medallion's (rides
logged, this one included), the next rung and its metal are the album's (`KK_ALBUM` vici steps 5/25/100/250/
1000, `kkMetal(standing + 1)`): 23 → "Two to Bronze". Past ×1,000 only the count is said; after "I slipped"
nothing was ridden out and the line is left out (logs Q7) — no new copy.

## D289 — Unframed: Insights, Report Ready's fallback, seeds
`/dashboard` is restyled after Urge Overview (routes §4.3): title head, the range as the segmented switch
(its old `2W/4W/12W` labels kept, G12), the heat as discs on the check-in tone ramp with hollow no-check-in
days, the three numbers as 30/700 columns, the triggers as dot-row bars, the doors as a `RowGroup`. Its
day-letter header now starts on the weekday the range opens on (it always said `M` first, under rows that
start fourteen days back). Back falls back to Today (the Library tab no longer lights for it). Report Ready
is the kit `HeroBoard` (title written `Your weekly\nreport is ready.` for native, D332); its line is the
frame's `<week>: score, days and urges.`, and with no closed week to name, the old screen's `Score, urges,
and the pattern — two quiet minutes.` (D328). Without `?week=` the line's space is held blank while the
account loads, so the other line never flashes (no spinner: the hook's `undefined` also means signed out).
Seeds pin the frames' July 2025 moments. Where a frame's numbers are sample data the app's weights can still
reach, the seed reaches them and says how in its header (Log Reports' +5/+6/−4/+8/+12 → 1,240; Weekly
Report's line + `+12` needs two slips on its Monday); the Mood page's 14 feelings and the Days/Urges pages
have their own seeds (D126 style).

## Phase 2 amendments (no new numbers — the range D280–D289 is full)

**D285, empty registers:** the kit `EmptyState` carries its own 24 gutter, and the Log page already hangs its
rows in one, so the old title + line sat in a 297 column at 393 (`The first one arrives once a full week /
has closed.` on two lines, `…turns / it into data.` with a ragged 108 inset at 375). The Log's three empty
states now pass `paddingHorizontal: 0` and read in the page's own 345/327 column.

**D287, the week's name:** `weekLabel()` now builds the same-month form with `dateRange()` (`Jul 14–20`).
Across two months it keeps the **spaced** en dash, because the only frame that draws such a week — Log
Reports' row — writes `Jun 30 – Jul 6` (the frame's bytes are `30 – Jul`, U+2013 with a space each side, as
is the designer's own `gen/v2.js`); `dateRange()` closes it up (`Jun 30–Jul 6`, D388). The
Phase 2 carry-over read the frame as unspaced; following it would put a mismatch into a row that diffs
0.00 % today. One label still serves every register (Log row, report pill, overview pill, Report Ready
line, the mail list), so the row a reader taps and the pill it opens always agree.

**Stored check-in reasons (carry-over):** no screen of this group prints a check-in's `reasons` — the
Log's check-in rows read the night's first feeling or the morning's mood word, the report and Insights read
moods and events. Nothing to route through `normalizeReasons()`; the readers of `reasons` are `checkin.tsx`
(already normalised by `CheckinFlow`) and `today.tsx` (a length test).
