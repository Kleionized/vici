# sos-flow decisions — Vici Overhaul Phase 1 (D250–D259)

Merged into DECISIONS.md by the orchestrator. Files: `src/components/urge/{flow,hub,stages,index}.tsx`,
`src/app/{urge,urge-hub,rough-first90,relapse}.tsx`. Evidence: `.overhaul/understand/sos-flow.md`, captures in
`.overhaul/shots/sosflow/`, recipes `.overhaul/recipes/sos-flow.json` (drives `.overhaul/drives/sf-*.js`, hub seeds
from `node .overhaul/f-sosflow-seeds.mjs`, functional walks `sf-func-*.js`, line-break check
`node .overhaul/f-sosflow-breaks.mjs`, size sweep `.overhaul/f-sosflow-sizes.sh`).

## D250 — The interrupt, the relapse boards and the hub are the kit; the paper kit is gone
Hero boards (Intro, the three moves, Surf Complete, Relapse Log / Twice / Begin) are the kit's `HeroBoard`; the
question boards (Strength, Where, the two pickers, Reassess, Afterward, Relapse Resign) are one `SosQuestion`
in `stages.tsx` — nav row, a left stack at canvas 136 in a `ScrollRegion` from 100 to the controls (D320 rule 3),
an optional `layer` for what the frames place beside the stack (the intensity bars at 232 and their reading at
440), and the hero under it with the kit's `controls` (rule 1). The hub panes and the stages stand on the dark
`Screen`. `/relapse` renders through the same pieces as the slip twins (CRITIC §3.2). Deleted with the restyle:
the paper chrome and pickers (`PaperSheet` … `PickerGrid`, `PLACE_GLYPH`), the object art (`IntroArt`,
`MoveStepArt`, `LeaveStepArt`, `ScreenStepArt`, `DawnShaft`, `SlipArt`, `TwiceArt`, `BeginSky`, `NoiseRay`), the
hub's gold panes and wave chart, the breathing ocean (`UrgeWave`), and the old kit's 27 re-exports in
`urge/index.tsx` (D392 kept them for the split; grep: nothing outside `src/components/urge/` imported any).
`index.tsx` now exports `UrgeFlow`, `UrgePlace`, `UrgeHub` and the settings types. `assets/images/urge-wave.webp`
is no longer referenced (left on disk).

## D251 — The reason and feeling pickers are multi-select (D324)
Kit `Chips multi`, nothing chosen by default (the drawn selections are the recipes' taps). The board is the
first answer **in the picker's own order**, not the first tapped; `precedingState.reasons` keeps every reason,
in picker order; `precedingState.feeling` keeps one — the first in picker order — so the schema is untouched.
Nothing chosen → `SOS-Trig-Unknown` / `SOS-Feel-Unknown`, as before. "Where" stays single-select (radio rows).

## D252 — The four SOS stages stay, on 85F's board (D328)
The canvas runs Afterward → The wave passed and draws only 85F; the app's step `sos` keeps its four stages:
85F's breathing board, then number tap, odd one out and the 90-second clock, all on the hub's dark shell (nav
"Ride it out" · ✕, head at 160, white primary at 96, "I slipped" at 60). The hub's Breathe pill runs the first
three and returns to the panes (as before). Controls map one-to-one onto the old ones: the primary is the old
"End early" (interrupt: log the urge as ridden out → relief board; hub: back to the panes) — labelled "Done" on
85F as drawn, "End early" on the three unframed stages (their own copy, G12); each stage still moves on by
itself when it runs its course; ✕ closes (interrupt: abandon, as every interrupt ✕; hub: closes the hub); the
hub's back chevron returns to the panes. New on the stages: "I slipped" (→ `/slip`, as the old 90-second stage's
"I slipped — log it" did). The breathing board keeps the old gear (SOS settings) in both contexts — see D256 for
where. The unframed stages show their place in the run with the hub's 6-pt dots at `bottom 180` (the old four
stage dots); 85F draws none. The 90-second stage is 85A's ring (arc = what is left, clock m:ss, the old phase word
in sentence case); the ocean is gone.
**Short phones.** At 393 × 852 every stage draws where 85F's shell puts it. Below that each stage fits its play to
the area between its head (+16) and the controls (−16; the dots' 202 already holds it) before the band scrolls:
the tap stage keeps its five spots' size and closes up their heights (≥ 45 % of the drawn spacing — the nearest
same-column pair is still 94 apart), the odd-one-out grid shrinks its tiles (72 → ≥ 56, the dot stays 12), the
caption sits on the area's floor, and 85F's orb — art, not type — draws smaller (≥ 60 %) above an unchanged phase
row; the ring stage keeps its size (its clock is type). The spots and the grid are centred on the screen's width.
At 375 × 667 every spot, tile, caption and the whole orb are visible above the controls at rest (the first
pass placed them at fixed canvas y and cut the fourth spot and the third tile row at the band's edge).

## D253 — 85F breathes 4 · 4 · 6; Hold and Out use the old captions
In 4, hold 4, out 6 (the frame's phase row), three breaths (42 s) to a round. Only "In" is drawn; Hold and Out
take the old box-breathing captions in the frame's sentence form — "Hold it." / "Breathe out slowly." — with no
line under them (no approved copy; proposals in the report). The white r70 disc grows to r92 (the middle ring)
over In and back over Out; it holds still under Reduce Motion. At t = 0 the board is the frame (reduced-motion
capture 0.00 %); a normal capture lands ~0.3 s into the inhale (r70.4, 0.12 %).

## D254 — Reassess's line follows the direction; Afterward's card stops at eight lines
"Coming down — from 4 to 2" is the way the urge went and both reads, numbered 1–5. The word follows the direction,
never the second read alone (the first pass took the second read's own note, so Faint → the default 2 read
"Coming down — from 1 to 2"): down → "Coming down — from X to Y" (to 1: "It passed — from X to 1", the old note for
that read); unmoved → "Holding steady — still at N" (the old middle note; "It passed" when both are 1); up →
"Rising — from X to Y" (app-authored, D-20 batch). The default second read stays 1 (the old default), so a Faint
first read opens on "Rising — from 1 to 2" until it is answered. The dashed "was" bar shows only when the reads
differ (kit `IntensityScale`, D383). Afterward: the note card grows a line at a time to eight (30 each, card 284,
ending at canvas 549 — 42 clear of the envelope's art at 591) and then scrolls inside (sos-flow §3.11); the first
pass let it grow over the envelope.

## D255 — Surf Complete says how long it lasted
"You outlasted it. {Twenty-two minutes}, start to finish." from the session's own length (`minutesWords`, the
same number written to `durationSeconds`); under a minute: "Under a minute, start to finish." (app-authored,
flagged). The "×N" count and the flow's `useEvents()` read are gone. ✕ and "Back to Today" both close.

## D256 — SOS settings: the kit sheet, every choice kept, one tap from the hub as before
Sound (stored, as before — the app plays none), the orb light and the ground, as a kit `Sheet` (top 420,
`Segmented` for sound and ground, four 44 swatches, frame-level "Done"). The defaults draw the frames exactly
(white disc, the dark ground). A light or ground the user picks keeps the look it always had (the orb's
gradient; the starfield / dawn grounds, now with the old stage's bottom scrim — 0 → 55 % → 82 % of the ground
over the last 230 pt — without which "I slipped" all but vanished into the dawn's glow) — a user's preference is
honoured, not flattened; lint-mono lists those 17 hexes (all in `stages.tsx`) as that judgement call. Retiring
them is the user's call.
**The gear.** The old app opened the sheet from a gear on the breathing stage in both the interrupt and the hub
(Breathe → gear: two taps from the hub). 85F gives the nav's left slot to the back chevron, and the first pass
dropped the hub's gear, leaving settings ~14 taps into `/urge`. The gear is kept on both breathing boards, in one
place: a 36 × 40 slot just inside the ✕ (glyph 22, right-aligned, x 313–335), as Paywall and Yearly Drop keep
their ✕ (D323). It is a visible deviation from 85F (312,68 24×24, 658 px; 0.18 % with the breath's edge ring,
0.05 % under reduced motion) — the orchestrator may rule the other way (one line: drop `onSettings` from the
hub's breathing stage; settings then live only in the interrupt). The sheet is drawn over every stage, as the
old flow drew it, so a round that ends under it does not close it; leaving the hub's stages closes it.

## D257 — What the hub's panes read
85A: the ring is D066's (arc = what is left of the 20-minute window, marker at its end). The frame's 17:42 and its
62 % arc cannot both be one moment; the clock is kept and the arc is the frame's one residual (0.66 %). 85B: "This
one is {band word}." from the live session's severity (`INTENSITY_BANDS`), then "None this {word} has lasted past
{N minutes}." from the longest ridden-out urge at that severity or above — left out when there is none; the card
is "N clean, M slips" over the 30-day grid. 85C: the ridden-out count, the twelve newest timed urges oldest →
latest at `max(12, round(96·s/longest))` from unrounded seconds, the longest in white, "Longest: N min"; no bars
when nothing is timed. 85D: the four newest, "Thu, 3:10 pm", fill against the longest of the four, the stored
"what helped" in sentence case, default "Waited out the timer"; no card when nothing is timed (the old pane drew
no rows either).

## D258 — The hub's shell
No chip chosen at first (CRITIC §5); a chosen chip is the white fill with `#111111` words, a radio, filed on the
session as its trigger (as before). The pager dots are the kit's tappable `PagerDots`; coming back from Breathe
(Back, Done or the round's end) the pager reopens on the pane its dots still mark (the pager remounts — the old
hub had the same mismatch). On a short phone a pane that does not fit above the dots (each reports where it
ends, so a longer wrap counts) first rises, head and all, by up to 52 (the head at canvas 108, `HeroBoard`'s art
floor); then 85A's chips close up on the ring (to 16 under the marker's lowest point, ≤ 37); only what is still
left over scrolls (D320 rule 3). At 375 × 667: 85A, 85B, 85C, 85E and 85F show everything at rest; 85D's card is
taller than the band (63 over after the lift) and scrolls, its fourth row under the band's edge until it does.
At 393 × 852 and wider nothing moves. Nothing runs under a control.

## D259 — 85E, Relapse, `?board=` and the challenge's back
85E: "Signed N days ago." (0 → "Signed today.", 1 → "Signed yesterday."), then "Kept every day since." only while
no slip has landed after the signing (Q13). With no pledge on record 85E and Relapse Resign keep the words they
always fell back to ("The mornings are mine again.", "You"); 85E then drops the caption. Relapse Log's ghost still
opens the interrupt (Q9); its body carries a `\n` before "it here." — the frame's pretty break, which greedy
native wrapping would put after "it" (D332; 313.8 pt, fits the 327 column at 375). D336 lands: `/urge?board=<key>`
(mock builds only) opens the flow on that board's step, the board holding until that step's picker is answered —
Loc Bathroom, Loc Home Alone and Trig Rejection diff 0.00 %. The flow passes `onBack` to the response boards, so
SOS Challenge draws its back chevron (sos-boards' D263) — 0.00 % — and it returns to the feeling picker.

## Phase 2 amendments (to D252, D254, D258)

**D254 — the second read's default.** The default second read is now `min(1, first read)` until the user answers it
(index 1, "Noticeable", for every first read from Mild up — the frame's state is unchanged). A Faint first read used to
open on "Noticeable · Rising — from 1 to 2" and, if the board was left untouched, file a rise on the event
(`severityAfter` above `severity`) that nobody reported; it now opens on "Gone · It passed" and Mild on "Holding steady —
still at 2". The line itself was already direction-true; walked for Faint, Mild and Intense × all five second reads
(`sf-func-reassess.js`): no read ever pairs "Coming down" with a rise or "Rising" with a fall.

**D258 — one lift for the whole pager; 85D's card closes up; a band that fits never scrolls.** On a short phone the five
panes now rise together by the largest lift any of them needs (≤ `BAND_LIFT`), so the heads stay on one line while the
pager slides (at 375 × 667 they sat at 74 / 126 / 108 / 74 / 120 and jumped mid-swipe). After the lift, 85A's chips close
up on the ring (as before) and 85D's card closes up on its head, to 12 under it (the head's own title-to-line gap) — at
375 × 667 the whole card now shows with no scroll (it used to stop mid-way through its fourth row). `CanvasBand` adds the
24-pt end gap only when its content does not fit: 85A fitted flush to the dots' edge still scrolled 24 (dragging the head
under the nav) and the breathing board 8. 85A's measured bottom includes the chips' 1-pt ring, which the band used to clip
flat. At 393 × 852 and wider nothing moves (audit unchanged).

**D252 — the 90-second ring fits its svg box.** The fourth stage fits the ring's 240 box, not its ink (223): on web a
scroller counts the svg's empty 17 under the marker, so the ring scrolled 11 at 375 × 667. It now rises 11 instead. Every
stage (breathing, tap, odd one out, ring) in both the interrupt and the hub's chain was walked at 375 × 667
(`node .overhaul/f-sosflow-stages.mjs 375 667 <outdir> interrupt|hub`): every spot, tile, caption and the whole orb and
ring show at rest, nothing scrolls, nothing sits under a control.
