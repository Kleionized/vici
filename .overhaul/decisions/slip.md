# slip — decisions (D300–D309), Vici Overhaul Phase 1

Group: the twelve `98 · RELAPSE — POST-SLIP` boards (98A–98L) and the nineteen cards (99A–99H, 100A–100K),
all at `/slip`. Files: `src/app/slip.tsx`, `src/components/slip/kit.tsx`, `src/content/slipCards.ts`
(`src/components/slip/art.tsx` deleted — nothing imported it). Evidence: `.overhaul/recipes/slip.json`
(31 frames, every one 0.00 % pxdiff at t=24 against `.overhaul/shots/design/Email-Login/<Frame>.png`).

## D300 — The flow is built from the kit; two local layouts cover the boards `HeroBoard` does not
Twenty-six frames (98A, B, G, H, I, K, L and the nineteen cards) are the kit's `HeroBoard` with no
overrides beyond `tone="dark"` on 98I and the nav kicker on the cards. The five others are two layouts in
`slip/kit.tsx`, both composed of kit parts only: `SlipQuestion` (98C, 98D, 98F, 98J — `NavBar`, the
optional decorative `Hero` drawn **before** the stack as the frames paint it, a `ScrollRegion` from the
nav row's bottom edge (100) to the controls with the stack at 136, `PrimaryButton` at 48 or 96 over a
`GhostLink`) and `SlipDone` (98E — `CheckDisc` 84 at 200 and the centred stack at 308 in the same band).
On short phones (D320) the bottom heroes pass `controls` and drop out, and the band scrolls; at 393 × 852
nothing moves and nothing scrolls. The old paper kit (`SlipPage`, `SlipSheet`, `SlipFedTile`,
`SlipAnswerRow`, `SlipPledgeCard`, `SlipBeginSky`, the sixteen bespoke drawings) is gone; `SLIP_FED` and
`FedName` survive as data, with `FED_FEELINGS` moved beside them.

## D301 — 98C: the wheel is always open and shifts the moment
The frame draws the kit `TimeWheel` inline under the caps label "Or choose a time" (CRITIC §5: slip Q1), so
there is no "Choose a time" control and no Cancel/Save. Each settled column step moves the slip's moment by
`delta × (1 h | 1 min | 12 h)` — the old wheel's `onShift`, so 11:59 → 12:00 carries the hour and the day
as it always did — and the result is clamped to the moment the screen opened (`now`): a picked time is never
in the future, and the wheel rolls back to the clamped value (D362). Any wheel or date change clears the
chips (no chip lit: the undrawn state, all three `#1E1E1E`); tapping a chip restores its preset. The
presets are slip's own copy of the three `WHEN_CHIPS` — slip no longer imports anything from
`src/app/urge-log.tsx` (D309).

## D302 — 98E reads the frame's format; an empty row is left out
`When` is `dayPartTime(at, now)` ("Tonight, 11:40 PM", "Last night, 11:40 PM", "Jul 20, 9:05 PM"); the
feelings and situations rows are `joinLower(...)` ("Phone in bed, late night"). Storage keeps the
`' · '` join (`trigger: "Tired · Phone in bed · Late night"`) — Log, insights and the weekly report read it.
A row whose value is empty (no feeling picked, or no situation) is omitted instead of printing "—", as
Lapse Done draws fewer rows (slip Q5's recommendation). The change line is unchanged: the first picked
trigger card's `change`, else the first card's.

## D303 — "Change" on the date row opens a day sheet
No frame draws what Change does (slip Q2). It opens the kit `Sheet` with seven kit option rows — today and
the six days before — each labelled `dayPartDate(day at the picked time)` ("Tonight, Tue Jul 22",
"Last night, Mon Jul 21", "Sun Jul 20" …), the current day selected; no title, so no invented copy (G12).
Picking a day keeps the wheel's time, clamps to now (D301) and closes the sheet 260 ms later (the
funnel's auto-advance beat). Panel top 282: the seven rows (7 × 58 + 6 × 12) under the content column's 44
end at 804, where a primary's bottom edge sits. It replaces the old wheel's date column, whose ±2 days
could step into the future; scrim tap, drag and Escape dismiss it as every kit sheet.

## D304 — Copy and state changes the frames make
CTA renames per the frames: 98B "Closed", 98H "Turn it around", 98I "Phone is away" → **Continue**;
98D "Continue · N" → **Continue**; trigger cards Late night / Scrolling / Sexual content / Argument /
Couldn't sleep / Being alone / Not sure → **Continue** (Boredom, Loneliness, Stress and every feeling keep
**Done**) — kept as data in `slipCards.ts`. The cards gain the nav kicker ("After the slip" / "What fed it",
`SLIP_KICKER` by `kind`); 98F gains the sub "Honest answer. It changes what comes next."; 98K gains the ✕;
98I is the `#111111` tone. 98D's Continue stays gated until one chip is on, drawn as the kit's dimmed pill
(D321, `aria-disabled`); 98F's answer stays optional and starts with none selected.

## D305 — "I'm already watching again" still opens `/urge-hub`
D149's text says `/urge`, the code has always done `router.replace('/urge-hub')`, and no frame or ruling
moved it (slip Q6 is open). Kept as the app does it: the hub is the screen built to hold someone mid-urge.
If the orchestrator rules for `/urge` (sos-flow's first-90 entry), it is a one-word change in `slip.tsx`.

## D306 — Native line breaks (D332)
Three fixed headlines carry `\n`: 98F "Do you still want\nto keep watching?", 100H "Get out of bed
for\na few minutes.", 100J "Change what\nhappens next." — web balances to the same lines. Every other run
uses the kit's per-variant wrap (h1/title balance, p pretty, the pledge sentence unwrapped — `PledgeCard`
sets none).

## D307 — Recipes run on a pinned, ticking clock
`.overhaul/slip-seed{0,1,2}.js` and `slip-seed-nopledge.js` = `window.__CLOCK = '2025-07-22T23:40'` +
`__CLOCK_TICK = true` + `.overhaul/clock.js` + the old account datasets. Pinned to the frames' Tue 22 Jul
2025 so 98C's date row and 98E's stamp read as drawn; ticking because RN's Animated timing reads
`Date.now()` — frozen, a press scale or a wheel settle never finishes. The old `f-slip-seed*-2340.js`
pinned only the hour (today's date) and are superseded.

## D308 — A failed save does not throw
`save()` wraps the event write and the letter flag in `try/catch` (relapse.tsx's pattern): no frame draws a
failure, the flow carries on, and an offline write can no longer raise an unhandled rejection. The
`saving` re-entry guard and the "discount this run's own event" count are unchanged.

## D309 — slip imports nothing from `src/app/urge-log.tsx`
The eight symbols slip borrowed (`FlowTop`, `GRID_GAP`, `GRID_GUTTER`, `LoggedNote`, `PrimaryButton`,
`TimeWheel`, `triggerTileWidth`, `WHEN_CHIPS`) are replaced by kit parts and a local `WHEN_CHIPS`, so the
logs group may drop or rename them without breaking `/slip`.

## Phase 2 amendments (the slip range D300–D309 is full; these amend D300 and D302)

**D300, 98E on short phones.** The check disc is 98E's art, so a short phone now treats the board as a hero
board (D320 rule 2) instead of scrolling it from canvas 200: disc and stack rise together by the deficit
(`200 + h + 24 − controlsTop`), never above canvas 108, and only what still does not fit scrolls. At
375 × 667 the four-row sample card now sits whole above the pill (foot 16 pt clear; the band keeps 12 pt
of end padding to scroll) — the same treatment logs' Lapse Done gets from its `useLift` — where before the
third row met the pill at 200 and the fourth was below the fold. Hidden until measured, as `HeroBoard` is,
so it never jumps. At 393 × 852 the lift is 0 (audit 0.00 %).

**D300, question boards on short phones.** `SlipQuestion` (98C, 98D, 98F, 98J) now does the same before it
scrolls: once the bottom hero has dropped, a stack that would end within 24 pt of the controls rises by the
deficit, never above canvas 108. 98C at 375 × 667 rose 14 pt and no longer scrolls — the date row sits 24 pt
over the pill, as logs' Lapse When (the same board, `useLift`) already did, so the two When boards agree on
a short phone; a three-line pledge on 98J rises 28 and then scrolls. At 393 × 852 the lift is 0.

**D302, no orphan in 98E's values.** The values wrap greedily (the frame states no `text-wrap`), so at
430 wide "Phone charges outside the / bedroom" stranded a word. The last two words of each value are now
joined by a no-break space (`noOrphan` in `slip.tsx`, display only — storage is untouched). Every break
the frame draws at 393 already ends on a pair, so 393 is unchanged (audit 0.00 %); at 430 it reads
"Phone charges outside / the bedroom", at 375 "Phone charges / outside the bedroom".

**Back paths under D340.** Re-checked: hub "I slipped" → ✕ returns to the hub; All → Post-slip flow → ✕
returns to All; 98K "Start again" and 98L "Later" replace to Today, "Check in" to the morning check-in;
98F's still-watching answer replaces to the hub. No change needed — slip is a root-stack route and its ✕ is
`router.back()`.
