# Orchestrator decisions — Vici Overhaul run (D320–D349)

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
