# tail decisions — Vici Overhaul run, Phase 1 (D210–D219)

Group `tail`: the plan sub-flow, the cost/line boards and the handover keepsakes — 19 frames,
`Enlisting Aegis` … `Medallion Received`. Files: `src/app/(onboarding)/welcome.tsx` (STEPS and the
tail cases), `src/components/onboarding/{tail,plan,handover,v3}.tsx`, `art.tsx` (deleted),
`src/content/onboardingTail.ts` + `scripts/overhaul/gen-tail.mjs`, `src/content/weekXiiLetter.ts` +
`scripts/overhaul/gen-letter.mjs`. Recipes: `.overhaul/recipes/tail.json` (plan.json and
handover.json migrated into it and deleted). Evidence: `.overhaul/shots/tail/a-<Frame>.strip.png`.

## D210 — The flow follows the canvas's badges: two line boards in, the campaign map out
`STEPS` runs `24 · Build plan` … `34 · What You Want Back` → `38 · A Letter Arrived` (FLOW.txt).
`change-line` (`O3ChangeTheLine`) is split into `line-nothing` (`32 · If Nothing Changes`, CTA `Next`)
and `line-plan` (`32A · With the Plan`, CTA `Continue` — the frame, not the generator's "Start with
today", CRITIC §5 Q11), one `LineBoard` drawn two ways, every chart value the frame's literal (Q7).
The three-page campaign map (`reading`, `O3Reading`) is removed (D324); with it go `CHROME`/`NOBAR`,
`O3PaperCTA`, `o3Roman` (unused) and the whole of `onboarding/art.tsx`, whose only importer was the
map (grepped). Every tail board is still whole-frame; the boards that draw a Back chevron (Step 1 …
What You Want Back) get `back` = `move(i, -1)`, so Back skips the conditional questions exactly as
the funnel does. Letter Received, Start Here, Where We'd Start, Medallion Received draw an empty nav
row and get no Back (the frames); the two arrivals lose their ✕ (Q10 — their buttons do what it did).

## D211 — Copy and API changes the frames make
CTAs: Start Here "I can do that" → `Continue`; What You Want Back "See the twelve weeks" →
`Continue`; Letter Received "Open it" → `Open`; The Vow "I sign it" → `Sign`; Medallion "Take it" →
`Continue`. The vow's date reads `Day 0, Jun 9` (`format.shortDate`, the day it is signed) and gains
"Signed on day 0". `O3MedallionEarned` takes `{eyebrow, title, body, next}` ("Veni" / "Your first
medallion." / "You started."). `O3OneBadDay` drops its `day` prop (the week strip is an
illustration). Starting Score's label is the frame's mixed-case "Your VICI rating" in caps style.
`O3LetterRead` keeps its props (`name, paragraphs, onKeep, next` + optional `onClose`) so the
letters group's `/letter?variant=week12` still calls it unchanged (verified: 0.00 % against Letter
Week XII through that route); a paragraph equal to the letter's own picks its 700 ink run back up
from `WEEK_XII_RUNS`. Name fallbacks: "Friend —" (salutation), "Week XII, from you" (eyebrow, Q14),
"Friend" (vow), "This is where we’d start." (no name).

## D212 — Generated content, forked to `scripts/overhaul/`
`gen-letter.mjs` reads `Letter-Week-XII.html` raw (the scene trims the spaces round the span) and
writes four paragraphs as runs plus the plain `WEEK_XII_LETTER` the journal entry and old callers
use. `gen-tail.mjs` reads the three cost frames' circles (filtered by radius — every frame also
carries the status bar's r 1.5 circle) and asserts the grids' geometry and that the designer's LCG
reproduces both large fields; it writes `COST_30` (relapse = filled `#0D0D0D`: 2, 6, 9, 13, 16, 20,
23, 27, 29), `COST_365` (25 across, 110), `AGE_80_FIELD` (33 × 71, 720 bright), `AGE_80_NEXT_SEED`
(the LCG state after the frame's 2,343 draws) and `SCORE_SAMPLE` (842). `AGE_80_STARS`,
`SCORE_RING`, `SCORE_CURVE` are retired with their boards. `NEXT_30_TIMES` / `YEAR_DAYS` still
count the true cells (9, 110), so the sentences and "About 6,100 days" (age 24) are unchanged.

## D213 — Drawings: transcribed, parametric where the board has data
Starting Score's gauge is built from the score (49 ticks at 180° − 3.75°·i, a tick at or under the
score r 108→128 at 3.4, above it r 119→128 at 2, endpoints to one decimal as the frame writes them;
marker r 6 at r 96) — at 842 it is the frame pixel for pixel (0.00 %, 3 px); the board shows the
app's own SCORE_BASE (D329), printed with `groupDigits` ("1,000"), the 0…1,000 scale pinned full
above 1,000. Cost Next 30 reproduces the frame's two near-identical cell styles and its unmatched
"Clean day" swatch literally (Q2). The 365 grid is 365 `<Circle>`s (a two-arc `<Path>` per class
left 282 px of edge anti-aliasing; circles diff 0 px). The age-80 field is two `<Path>`s (2,343
circles on native would be heavy): anchored at the window's (0, 0) under the status bar as the
canvas's is, and on a screen larger than 393 × 852 the extra rows/columns continue the LCG, so the
frame's dots never change. The veil is the frame's linear gradient (expo-linear-gradient). The Age-80
Back chevron is the frame's `#17160F` with its 36×40 target (Q3). SVG `<text>` at 600/700 is
`Lato_700Bold` with no `fontWeight` (the canvas loads no 600).

## D214 — What You Want Back reads `17 · What it affects` back
CRITIC §5 Q5: the pills are his picks in the picker's order; fewer than three are topped up from
the frame's trio (Focus, Sleep, Confidence) rather than replaced by it, so his own answer is never
dropped and the board always draws three (`wantBackPills`). `planSignals` no longer filters on the
funnel's legacy `FUNNEL_GLYPHS` but on the nine `11 · When` labels (`CHIP_LABEL`'s keys) — tail no
longer imports `FUNNEL_GLYPHS`, so auth-funnel may drop it.

## D215 — Small screens: lift into free ground first, then scroll
The hero boards (Where We'd Start, Start Here, Steps 1–2, Letter Received, Medallion, A Clean Day,
One Bad Day) are kit `HeroBoard`s and lift (D320 rule 2; the calendar and the week strip pass as
`art` with their `artTop`). The other boards lay their canvas inside `Band` (tail.tsx): a
`ScrollRegion` from the nav (100) to the controls whose inner box keeps canvas y. At 852 nothing
moves. Where the drawing would come within 16 of the primary, it rises by the deficit when there is
that much ground above its first line (never above 108) — Starting Score, Cost Next 365, both line
boards at 375 × 667 — else it stays and scrolls (Your Plan, Cost Next 30, What You Want Back);
`end` is measured where a line can wrap (Starting Score's last line, Want Back's stack). The Vow's
signature first rises into the gap under the vow (keeping 24) before the band acts, so at 667 the
name sits above `Sign`, not cut by it. Letter Week XII scrolls its column inside the card, with
170 pt of end room so the last paragraph clears the buttons; the fade and buttons stay fixed.
Checked at 375 × 667 (inset 20) and 430 × 932; nothing overflows horizontally, nothing lies under a
control unscrollably.

## D216 — Mock-only `/welcome?step=<id>` (+ `&hold=1`, `window.__ONB_ANSWERS`)
The tail sits 22 questions deep and the old walk took 45–70 s per capture and broke whenever a
funnel board's labels changed. In `EXPO_PUBLIC_FORCE_MOCK=1` builds only, `?step=<id>` opens that
board with the canvas's own man's answers (`SAMPLE_ANSWERS` — the walk's answers, which reproduce
every drawn state), `&hold=1` keeps Build plan up past its 6.8 s hand-over, and a capture seed may
set `window.__ONB_ANSWERS` to vary them (`.overhaul/tail-alt-seed.js`, `tail-unnamed-seed.js`).
Production builds ignore all three. The full walk (`.overhaul/drives/tail-walk.js`, rewritten for
the new labels, gender's auto-advance and the age wheel) still runs end to end (45 s to Medallion).

## D217 — Build plan holds the frame's state; the mark turns
The three rows hold the frame's done / now / to-come state for the whole 6.8 s, as the previous
drop's rows did (Q9 — no behaviour change); the kit `Spinner` turns (D366), so its 88 box is the
board's one moving pixel region (0.00 % outside it).

## D218 — Native line breaks (D332)
`.overhaul/f-tail-breaks.mjs` measures every fixed balance/pretty run in the group greedily at 345
against the frame's wrap: 28 of 32 break alike; four headings do not ("Keep your phone / out of bed
tonight.", "Leave the room / instead of lying there.", "Pick the room / you will not close.", "When
the house empties, / the door stays open."). On native those four carry the frame's `\n`
(`NATIVE_BREAKS`, plan.tsx); web balances the plain string. Dynamic copy (his name, the evidence
sentence) wraps greedily.

## D219 — Phase 2: small and wide phones, the full gauge, the letter's viewport
Found by looking at every tail board at 375 × 667, 390 × 844 and 430 × 932 (393 × 852 is unchanged:
every board diffs as before, 0.00–0.01 %, Starting Score 1.80 % by D329).
* **`Band` lifts as far as the ground allows, then scrolls the rest.** It used to lift only when the
  whole deficit fitted above the first line, else not at all — so at 667 Cost Next 30 left its key and
  closing line under `Next` behind a 96 pt scroll and What You Want Back cut "Not a perfect streak…"
  in half under `Continue`. Now the board rises by min(deficit, start − 108) and only the remainder
  scrolls (5 pt and 7 pt there). Your Plan, which had its own `ScrollRegion`, uses `Band` too (rises
  62, scrolls 22: the fifth card reads whole above `Continue`). Nothing moves at 852 or 844.
* **The year grid and the line chart span the column.** Drawn 345 wide at left 24, they ran 6 from the
  right edge at 375 and stopped 61 short of the 24 gutter at 430 (axis and grid visibly off-centre
  against the full-width primary). Their x's now scale by (window − 48) / 345 — the frame's own numbers
  at 393 (k = 1, still 0.00 %) — with radii, strokes, type, y's and the 128 tooltip unscaled, as Today's
  and the weekly report's charts do.
* **A full gauge draws no marker.** At 1,000 the r 6 marker lands at 0°, 2.5 right of and 4 under the
  last zero of "1,000", reading as "1,000." — and every account opens at 1,000 (D329). Short of full the
  marker is the frame's (842 still diffs 0.00 % with the sample score).
* **The letter's column ends at the primary's bottom edge.** It ran to the card's bottom (the screen
  edge), so on a short phone a line of the letter showed through the fade between `Continue` and
  `Keep this letter`. The scroller now stops 96 off the bottom (under the primary, never below it) and
  its end room is 58 + 16, so the last line still scrolls clear. `/letter?variant=week12` (same
  component) still diffs 0.00 % against Letter Week XII.
* **The vow wraps `pretty`.** The frame states no `text-wrap`; at 375 the greedy wrap left "day." alone
  on the fifth line. `pretty` breaks it exactly as drawn at 393 (0.00 %), keeps four lines at 430 and ends 375 on "next day."
