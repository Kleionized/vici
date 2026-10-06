# Orchestrator decisions — Vici Overhaul run (D320–D349, D400–D407)

Merged into DECISIONS.md at the end of the run. Evidence is in `.overhaul/understand/CRITIC.md` (§ refs).

## D320 — One small-screen policy for every board (CRITIC §7.3)
At 393 × 852 every board renders exactly as drawn. Where content would meet the bottom controls on a
shorter phone, in this order: hide decorative heroes that sit between content and controls; on hero
boards translate hero + stack up together by the deficit (art top ≥ canvas 108); everything else scrolls
in a `ScrollRegion` between the fixed nav and the controls (`paddingBottom` = controls + 24); title-head
pages scroll whole; tab screens scroll under a bar painted with ground + noise. Never shrink type, never
overlap a control. Checked at 375×667 (inset 20), 390×844, 430×932.

## D321 — Disabled primary: the same pill at opacity 0.38
No frame draws one. 0.38 is what the auth boards already used; no new colour is introduced.

## D322 — States the frames never draw (CRITIC §7.4)
Toggle off: track `#2E2E2E`, knob `#F2F0EC` at left 3. Day toggle off: `#1E1E1E` + 14/700 ink. Lesson
option selected: ink row, `#111111` filled marker, `#F2F0EC` letter. Pressed: `Tap`'s 0.99 scale only.
Inputs: ink caret, `#9B968E` placeholder, dark keyboard (`userInterfaceStyle: dark`).

## D323 — Paywall and Yearly Drop keep a way out
Neither frame draws a dismiss, and the user's brief says every control keeps working. Both get the ✕ in
the nav's right slot, where Paywall Rescue draws it; Paywall's footer "Restore" is tappable. Recorded as a
visible deviation from those two frames.

## D324 — Behaviour that follows the frames
Gender auto-advances (no primary drawn, 260 ms like every no-primary option screen); the SOS reason and
feeling pickers are multi-select (board = first selection in canvas order; `reasons` stores all; `feeling`
stays one value — no schema change); the onboarding `reading` (Campaign Map) step is removed (FLOW goes
34 → 38); Today's pinned urge bar goes (the SOS disc and "Urge surfing" are the doors); the lesson reader
contains the day's task, `/lesson-card/[day]` and `/task/[day]` become redirects into it; "Finish lesson"
records completion once; morning check-in default 8:00 AM; `Health / wellbeing` is stored as `Health` and
old values map on read.

## D325 — Library tab = the twelve week pages
The canvas draws no Library index. The tab opens the current week's page; the twelve pages are a
horizontal pager; `/week/[week]` routes into it.

## D326 — `/score` shows the tab bar (Journey active, per the frames) — moved under `(app)` if links survive.

## D327 — The tab bar's ground
The bar has no fill in the frames; content ending at 748 never shows through. The app paints ground +
noise behind it so scrolled content cannot either — invisible at 852.

## D328 — Nothing is retired
Every route the app has stays reachable and is restyled to its closest frame (routes.md §4), including
the All drawer's sixteen screens and `/journey*`. Copy on undrawn screens and states is the app's
existing copy (CRITIC G12).

## D329 — Starting Score shows the app's own rating
The frame prints 842 of 1,000; the app starts at SCORE_BASE 1,000 and the canvas's own Score Detail and
Ranks floor at 1,000. The gauge is parametric; the frame's number is sample data.

## D330 — Auth errors: 14/700 ink; notices 14/400 `#9B968E` (no red exists in the system).
## D331 — Age wheel 13–99 (keeps the under-18 gate reachable).
## D332 — Native line breaks: `text-wrap: balance/pretty` is reproduced on web; on native, fixed copy
whose greedy break differs at 393 carries `\n`; dynamic copy and lesson body wrap greedily.
## D333 — Score's "Months" control opens a kit sheet (3M / 1Y).
## D334 — Native splash: plain `#0D0D0D`.
## D335 — No `presentation: 'modal'` page sheets (no frame draws one): `first-steps`, `lessons-browser`
push; `affirmation` is a transparent fade.
## D336 — Mock-only `/urge?board=<key>` so the three SOS boards no single account reaches can be verified.
## D337 — Kit text caps Dynamic Type at 1.3×.
## D338 — Hero ids are the illustration cards' own `data-hero` ids; `windowNight` aliases `nightMoon`.

## D339 — Today's task sentence is the lesson's own first task sentence (days 2–84)
D397 kept the previous course's one-line task (`task-src.json`) because Today Home Task and Night Action
Reminder draw day 1's. But on most days that line now names a different task from the one the new lesson
sets (L5 "Spend 20 minutes learning something new" vs the lesson's "Choose an activity for the hour when you
usually want porn"; L18/L19 entirely different), and tapping it opens the lesson's task page. The new bundle
has no short task line. So `cardSummary` = the first sentence of the lesson's own task (`practice[0]`) for
days 2–84 — the bundle's words, not authored ones — and day 1 keeps the frames' sentence, which the new L1
task contains ("put the phone out of reach from bed"). Sentences run 62–196 characters (median 71); the cards
are checked at the longest (L58).

## D340 — Tabs go back through history
`backBehavior="history"`: a week page opened from the All drawer, or Score from Today, goes back where it came
from instead of always to Today.

## D341 — Full-bleed art reaches the edges on wider phones
Crop-mode heroes with a floor (17 cards paint −40 … 433) are scaled just enough to cover the window when the
frame's fit would leave them short (nightMoon at 430; openDoor and lighthouse at every width); every crop a
frame draws is unchanged. The lighthouse's beams are extended collinearly to −40 … 433 in the generator —
identical inside 393, edge to edge at 430.

## D342 — The mock store keeps every event field
`createEvent` listed fields by hand and dropped `durationSeconds` / `severityAfter`, so a mock build's ridden
urges never reached the hub's proof panes. It now keeps the whole input, as the Convex mutation does.

## D343 — Orphaned files are not deleted without the user's approval
The rebuild left 14 files unimported (the old lesson reader, its art and the old task scenes, ~2.6 MB; listed
by `.overhaul/scratch/deadfiles.mjs`). The session's permission policy refused the deletion; they stay on disk
until the user approves (they are also in `refs/snapshots/pre-overhaul-full`).

## D344 — A hero between content and controls keeps its distance to the bottom on taller phones
Question-board and check-in heroes (the ones that pass `controls`) are bottom compositions: T 506 sets the
art's box on the primary's top, T 582 30 above the edge. On a phone taller than the frame the art keeps that
distance to the bottom, so the extra height opens between content and art instead of between art and pill.
Identical at 852; shorter phones keep D320 rule 1 (the art drops out when it would meet the controls).

## D345 — Cross-month ranges space the dash
`dateRange()` writes `Jul 14–20` within a month and `Jun 30 – Jul 6` across two, as Log Reports and Score
Detail (`May – July`) draw them; `weekLabel()` now just calls it.

## D346 — L64's task line skips its preface
L64's task opens "This exercise is optional.", which names no task; its card line is the next sentence (the
bundle's words). D339 otherwise holds: card lines run 17–196 characters, median 71.

## D347 — A scroll cue on native when a board overflows
No frame draws a scroll indicator and at 852 nothing overflows. On a shorter phone a `ScrollRegion` that opens
with rows below the fold shows the platform indicator and flashes it once after the push — native only, so web
captures (the verification build) are unchanged.

## D348 — Morning asks after the task Today showed
When yesterday's row names no action, Morning Task Check asks after yesterday's lesson task (`cardSummary`, the
sentence Today carried that day) instead of the generic `DAY_ACTIONS` line; past the course, the generic line.

## D349 — Short phones keep their art where they can
HeroBoard: when the stack needs more lift than the art has room for, the art rises to its limit (top 108) and
keeps its place, and the stack scrolls in the band between it and the controls; the art goes only when that
band would be under 160 pt, and then the stack is centred between the nav and the controls. A question-board
hero (`controls`) that misses its clearance by ≤ 16 pt rises by the shortfall instead of dropping out (every
such board keeps ≥ 30 pt clear above its art at 852). The frames themselves are untouched.

## D400 — The first morning skips yesterday
Day 1 has no yesterday: Morning opens on Feeling (dashes count Feeling · Energy · Pledge) and writes nothing to a
row dated before the account. A pledge written in the editor's first field alone is that pledge (`pledgeText`,
`src/lib/pledge.ts`), and every screen that shows the standing pledge reads it through that helper.

## D401 — The line under a lesson title is its own task sentence
Search, first steps and the lesson index showed the previous course's one-line summaries, which described other
lessons. `summary` is now the lesson's task sentence (`cardSummary`, D339); search also matches on it.

## D402 — Leaving the slip flow returns to the screen that is already there
"Start again", "Later" and "I'm already watching again" use `dismissTo` (Today / the hub): back to the
existing screen when it opened the flow, a replace when it did not — no second Today (and no second run of
the launch prompts), no second hub under the first.

## D403 — "Earlier today" stays today
Before 04:00 the four-hour preset now stops at midnight; a pick that leaves the moment unchanged keeps the lit
chip lit (slip and the log flows).

## D404 — Polish at other widths
Hero boards keep the frame's 345 text column on wider phones (frame line breaks hold at 430), and so do the
Paywall's feature labels and Yearly Drop's perks, each held to its 393 cell; Journey's
chapters sit 700 apart so the next chapter visibly enters the first screen; no-break spaces keep
"start to finish" and a letter's "Name —" together; Today's task caps wrap `pretty`; Score's pages scroll only
when their content overflows; an empty Past pledges list keeps its line in the gutter; a second tap on the
chosen orb light restores the default white.

## D405 — An overflowing band fades at its foot
On a short phone a `ScrollRegion` that holds more than it shows used to cut its last row or disc in half
against the pill. Its foot now fades 36 pt into the frame's ground while more lies below (gone at the end of the
scroll) — the canvas's own treatment for content that runs past the controls (L7 F11), shorter. Never drawn
where the content fits, so no 393 × 852 frame changes. Native also flashes the scroll indicator (D347).

## D406 — A short phone tightens a board's open gaps before it scrolls
D320's order gains a step before rule 3: where a fixed composition (not a list or a reading page) would
overflow its band, the open gaps the frame leaves between its blocks close first — together, each in
proportion to what it can spare, never under 24 between blocks (12–16 under the nav row) — by just the
overflow, and only what is still left scrolls. Kit `Slack` (inside a `ScrollRegion`) and `Band`'s `squeeze`.
It is exactly the frame's spacing wherever the board fits (every 393 × 852 frame), and type, cards, art
and controls never shrink. Applied where a 667 phone otherwise opened on a half-cut last row: Paywall
(the feature discs), the three check-in time boards (the day toggles), Cost Next 30 (its footnote) and Yearly
Drop (its perks; the card is 28 taller than a 667 phone can hold even then, so its foot still scrolls).
Hero boards keep D349 (their art already rises to 108; the gap under it is the frame's).

## D407 — Native keeps a lone last word off its own line
Native has no `text-wrap`, so away from the 393 break table (D332) a `pretty` / `balance` run wrapped greedily and
could end on one word where the web never does ("…change one awkward / detail.", "…for an entire / year."). Kit
`MonoText` now lays such a run out once and, when its last line holds a single word, draws it again with its last
two words tied by a no-break space — `pretty`'s orphan rule — but only when the line giving the word keeps two
words and half the run's width (else `pretty` leaves it too: "positive, on / average") and the pair fits the
widest line, so no word can break inside itself in a narrow cell. Web is untouched; checked on the iPhone SE
(375 × 667) simulator against the web captures.
