# today — decisions (D230–D234), Vici Overhaul Phase 1

Group: Today Home, Today Home II, Today Home Task, Today Home III, Score Detail, Score Detail Moves, Score
Detail Ranks, plus the unframed `/journal`, `/journal-new`, `/affirmation`. Files: `src/app/(app)/today.tsx`,
`src/app/(app)/score.tsx`, `src/lib/score.ts` (additive), `src/app/(app)/journal.tsx`, `src/app/journal-new.tsx`,
`src/app/affirmation.tsx`; `src/components/today/kit.tsx` deleted (nothing imported it after the rewrite).
Evidence: `.overhaul/recipes/today.json` (seven frames; Today Home III and Score Detail Ranks 0.00 %, the rest
named residuals), captures and strips in `.overhaul/shots/today/`, seeds from `.overhaul/f-today-clockseeds.mjs`,
replay `node .overhaul/r-today-p1.mjs`.

## D230 — Today is the frames' header and strip over a three-page pager; the chart is the account's own month
The four Today frames share the header (64) and the Sunday-first week strip (136–199) pixel for pixel and differ
only in the band 200 → 748, so the screen keeps its vertical pager there: page one Today Home, page two Today Home
II / Task, page three Today Home III, each 548 tall at 852 (the band), children in canvas y less 200. Every page
fills the viewport and grows past it only when its own content needs more: each page measures where its content
ends (494 / 503 / 518 as drawn) and is `max(viewport, end + 20)` tall. The pager always snaps page to page — on
web through CSS scroll snap (`pagingEnabled`), which lets an oversized page scroll within itself, natively through
`snapToOffsets` (each page's top, plus its foot when it is taller than the viewport). So 390 × 844 (viewport 540),
a real 393 × 852 with its 59 inset (543) and 844 with 47 (547) page exactly as 852 does; a 667 phone (397) snaps
to each page's top and foot; a pledge that wraps to three lines makes page three 586 at 393 and the Tonight card
stays reachable (D320; checked at 375 × 667, 390 × 844, 393 × 847, 393 × 852, 430 × 932). The earlier rule — snap
only when the viewport is ≥ 548, else scroll freely — dropped paging on the commonest phones and clipped a long
pledge's Tonight card at 393 (verifier). The old mark row, night-sky score card, 30-dot strip, paper lesson/task/pledge cards
and the pinned urge bar are gone (D324).

The thirty-day chart plots the account's own last thirty days on the frame's band: x steps `(W − 64)/29` to one
decimal (the frame's 11.3 … 329), the lowest day at y 210.6 and the highest 172.7 above it, straight segments,
the frame's rules, fill and end ring. A younger account is padded at the front with its first day; a flat series
lies on the floor (OQ-T3). The frame's own thirty values are drawn, not data — nine falling days in thirty would
take nine slips on `SCORE_WEIGHTS` and contradict its own header and Moves — so the line is Today Home's one
residual (1.89 %). `scoreHistory` / `monthLedger` moved out of `score.tsx` into `src/lib/score.ts` (+ `lastDays`,
`scoreDayKey`, `LEDGER_WINDOW`), additive; nothing else's API changed.

## D231 — The header, the strip and this morning's chips
The flame pill counts the account's day (OQ-T1: the frame's 41 is the seed's day; a streak stays opt-in,
invariant #1) — the old "Day 41" heading moved into it. The avatar is the frame's outline ring + glyph and opens
Settings, as the person glyph did (no photo pipeline exists, OQ-T8). The greeting follows `checkinPartNow()`.

Strip (Sunday-first, CRITIC C16): a past day is **held** (ink disc + check) unless a slip landed on it or it is
before the account; today is the **ink ring** with its date until the night check-in has filed the day (today's
row carries `emotions`/`reasons` — what Night 1–4 and `/checkin` write), then held (Today Home III); a future,
slipped or pre-account day is the line ring with a muted date (OQ-T2).

Chips: mood word `MOOD_WORD` (Heavy · Low · Fine · Good · Clear, the app's own) with a swatch a rung lighter than
the check-in's tone disc — Today Home pairs mood 3 "Fine" with `#BAB5AD` while Morning Feeling draws mood 3
`#8A857D`, so the chip takes `toneRamp[i + 1]` (the top two rungs share the ink) and the darkest rung stays
visible on the `#1E1E1E` chip (OQ-T4b). Energy reads `${ENERGY_WORD} energy` with the bolt and is left out when
the row has no energy. Before this morning's check-in the row is one chip "Morning check-in" (the cover's own
words) with an empty ringed disc. Every chip opens `/day/morning`, as the old section row did. Today's delta pill
is `buildScore`'s own (OQ-T4), hidden at 0, arrow turned over when negative (the kit's `down`).

## D232 — The task: two registers, one done mark, the lesson where it came from
Generic register ("Today’s task", 20/27) for a hand-named action or a fallback step; lesson register
("Today’s task: <lesson title>", 17/24) when a lesson set the task. Source precedence is unchanged (named
`dailyAction` → the day's lesson → `DAY_STEPS`), with one refinement: the night check-in now names tomorrow's
action *from the day's lesson* (D236), so a named action that is a lesson's `cardSummary` keeps that lesson's
register, hero and task page. Without it, every Today after a night check-in would print a lesson's sentence
under the generic label with no way into its lesson. `DAY_STEPS[0]` takes the frame's words ("hard to reach",
was "difficult to access"); each step carries a hero (phone → nightPhone, water → twoCups, outside → bench,
note → notebook, bed → bed — not openDoor: cropped at its s 0.79 its floor line stops 11 short of both edges at
393; bench, bed, nightPhone, twoCups and notebook fill or need not fill the crop at 375–430); an unmatched named action draws the notebook.

The 52 disc is the done mark in both registers (`dailyActionDone` on today's row — the morning asks after it;
checked: tap → true in storage, tap → false). The sentence opens a task page whenever the course has one: the
lesson that set the task, else the day's lesson (`/lesson/day/<n>?page=task`, D324 — the old card opened
`/task/<day>` for any task on a lesson day, generic register included). Only past the course, with no page to
open, does the sentence toggle the mark, as the old card did there (checked: Today Home II's seed → /lesson/day/41
?page=task, row unchanged; day 88 → stays, `dailyActionDone` true). Tiles: the day's lesson, numbered as the
course numbers it (OQ-T6 → CRITIC §5), opens `/lesson/day/<n>` (past the course: "Week I / Start the first
lesson" → `/lessons-browser`, the old copy and door); "Ride it out / Urge surfing" opens `/urge-hub` (the old urge
bar's door). The frames' "Lesson 5 / Naming your triggers" is the D132 mock — it is not a lesson in the new 84 —
and is Today Home II / Task's only residual (0.42 %). Rows on pages two and three are columns with the frame's
band as a minimum, so a sentence or pledge that wraps further on a 375 phone pushes the next block down instead
of overlapping it; at 393 they land exactly.

## D233 — The pledge rings, and the three unframed screens
Today III's rings have no drawn targets (OQ-T5): **+** opens the journal editor tagged Pledge
(`/journal-new?tag=Pledge` — the newest Pledge entry is the standing pledge Today and the morning stand on;
checked: saving "Phone stays out of the bedroom" puts it on page three), **☆** opens Past pledges (the old card's
door), **share** shares the line (`Share.share`; checked on web through `navigator.share`). No frame draws the
block before any pledge: the pledge's line holds the app's own "Write a pledge" (the All drawer's words) in the
22/700/31 register in mute `#9B968E`, tappable into the same editor as +, with the rings under it and share dimmed
(D321) — an empty 31-pt line under the caps read as missing content (verifier). The name is the first word of `displayName`, 700
italic (`PledgeCard plain`).

`/journal` (Past pledges): the title-head idiom — back at 60, 32/700 title at 108, entries as r24 `#1E1E1E`
cards (caps "Today · 7:12 AM" + tag, the line in 17/700 ink), the page scrolling under the fixed nav; empty is
its existing one line. `/journal-new`: nav row (back = Cancel, the time centred, Save), the tags as when-chips in one
sideways-scrolling row that bleeds to the screen edges (a `?tag=` or stored tag the three chips lack — Pledge,
Affirmation — is offered first and stays offered after another chip is picked; four chips no longer wrap "Lesson"
alone onto a second line at 375 and 393), title in the sheet field, body in the note field;
the B / I / U toolbar formatted nothing and is gone. `/affirmation`: the Change Pledge Sheet's shell (kit `Sheet`
at 120 over bare ground, h1 + line + card field, pill at 96 over the ghost at 60) with the old copy in both modes;
scrim / drag / Escape close it. Checked: Different prompt cycles; Write my own prompt → Use this prompt stores
`tideline.affirmation.prompt` and returns; Save today's line writes the Affirmation entry and closes.

## D234 — Score Detail: one header, three pages, the account's own numbers
Header per frame (back · "Months" pill · caps · 60/700 number · `Navigator II` range pill), a horizontal pager
under it from 288 with no dots (OQ-S3), each page scrolling vertically only when its content does not fit (Moves
on a 667 phone). "Months" opens the kit sheet with Months / Year (D333; a11y "Three months" / "One year", the old
labels); the pill reads the current one. Months = the three calendar months to today, Year = the twelve; month
labels at 40 / W/2 − 0.5 / W − 41 (current in ink), insight "+N points this quarter|year" over "May – July".

The chart is the account's history sampled weekly (monthly for the year), drawn as a monotone cubic (no overshoot
under the floor where a flat run turns into a rise), today at x W − 21 and a damped tail to the edge; the axis is
the window's floor to the next 100 and the smallest of 100/200/400/500/1000… that clears the top, which gives the
frame's own 1,000 / 1,400 for the 1,240 account. Days before the account read its first day. The frame's curve is
drawn (its ring at y 80 reads ≈ 1,343 under a 1,240 header — OQ-S2), so the curve and the +90 are Score Detail's
residual (1.77 %).

Moves: `monthLedger` on the same weights; one slip reads `Slip on Jul 8` (was `Slip · Jul 8`), more `N slips`;
bars are `round(|v| / max · 100) %` (ink, an ink ring for a loss), net under the rule. D134 still holds — the
frame's ledger is a 17-day account whose header reads 1,086 Deckhand I; seeded (`today-ledger-seed.js`) the five
rows and the net are pixel-identical, so the 1,240 capture's 0.75 % is the values only. Ranks: highest first,
todo ring + dashed `#5A574F` rail (CSS dashed border on web, an SVG line natively), here = ink disc + dot +
solid rail + 900 name + "You’re here. N to go" (just "You’re here." at the top rank), done = ink disc + check —
0.00 %. The old night header, light sheet, rank bar, value badge, insight cards and `paceLine()` are gone.
