# sos-boards decisions — Vici Overhaul Phase 1 (D260–D269)

Merged into DECISIONS.md by the orchestrator. Files: `src/components/urge/boards.tsx`,
`src/content/sosResponses.ts` (GENERATED) + `scripts/overhaul/gen-sos-boards.mjs`, `scripts/overhaul/sos-breaks.mjs`
(new), `src/app/(app)/rough-days.tsx`, `src/app/rough-protocol.tsx`, `src/content/roughDays.ts`;
`src/components/roughDays/kit.tsx` deleted. Evidence: `.overhaul/understand/sos-boards.md`, captures in
`.overhaul/shots/sosb/`, recipes `.overhaul/recipes/sos-boards.json` (drives written by `.overhaul/f-sosb-drives.mjs`).

## D260 — Every response board is the kit's `HeroBoard`
The thirty `SOS-Loc/Feel/Trig-*` frames are one template in two variants and `SOS-Challenge` is the same
board with a card (sos-boards §0). `ResponsePage` (API unchanged: `answer`, `onClose`, `onNext`, `onAnother`;
`onBack` added, optional) now draws `HeroBoard` from the generated data: kicker in the nav, ✕, the shared
hero at 190 × 1.1, title 30/36 + body 15/24 at 452 gap 18, primary at bottom 48 — 96 over "Give me another".
The paper sheet, `SheetClose`, the 239-layer scene renderer (`SosSceneLayer`, `EllipticBox`) and D391's copies
of `PaperSheet`/`SoftBlob`/`BlurredSolid` left `boards.tsx` with the old scenes (nothing else imported them).
Behaviour is unchanged: ✕ → `close()`, pill → `next()` (`Continue` and `Done` do the same thing), ghost →
`onAnother`; the board writes nothing.

## D261 — `scripts/overhaul/gen-sos-boards.mjs` replaces both `gen-sos-responses.mjs`
It reads the 31 split frames, asserts every template value (ground + noise `0.05`, nav row, kicker 13/700
`#9B968E`, ✕ path, hero `left 0 / overflow visible / origin 196 190 / scale 1.1`, stack top and gap, h1/p
metrics, primary + label, ghost, `ctaBottom === (another ? 96 : 48)`, ghost only on the feeling branch and the
challenge) and that each board's `<svg data-hero>` is its Lesson-Illustrations-v4 card byte for byte — so the
board can draw the shared hero and a later drop that moves one board stops the run. Output keeps the file
name and the `SOS_RESPONSES` export; keys are a literal union (`SosBoardKey`, `SOS_BOARD_KEYS`,
`isSosBoardKey()`), so a typo in the flow's maps is a compile error instead of a blank board. `layers[]` is
gone; the copy diff against the old file is exactly the 13 CTAs that became `Continue` (the four `Done`s stay
`Done`, CRITIC §5) and the six `\n`s of D262; the kickers are new.

## D262 — Six explicit line breaks; the challenge needs none
`text-wrap: balance` (titles) and `pretty` (bodies) break six runs differently from a greedy wrap at 393:
titles of Feel-Rejected, Loc-Elsewhere, Trig-Habit; bodies of Loc-Bed, Loc-Work, Feel-Unknown. The generator's
`BREAKS` carries the frame's lines (asserted equal to the frame text with `\n` read as a space), so native draws
the frame's lines (D332); on web the browser balances each forced line the same way. Every forced line is
≤ 304.4 wide, inside the 327 column at 375. `node scripts/overhaul/sos-breaks.mjs` re-renders all 31 frames on
`:8097` and checks the generated file (including Challenge's title, body and card text, whose greedy breaks
equal the drawn ones): "31 frames: every break matches".

## D263 — The challenge's back chevron is drawn when the flow hands a way back
`SOS-Challenge` draws back + 7/8 dashes (sos-flow §3.9: back → the feeling picker). `ResponsePage` draws the
chevron when the flow passes `onBack`; without it the 36-pt slot stays empty rather than holding a control that
does nothing. Until `UrgeFlow` passes `onBack={back}` on the `feeling-said` step (sos-flow's file), the capture
differs from the frame only by that chevron (0.02 %).

## D264 — An answer the content does not know shows its branch's "I don’t know" board
`ResponsePage` used to return `null` for an unknown key — a blank screen with no way out. It now falls back to
`SOS-Loc-Elsewhere` / `SOS-Trig-Unknown` / `SOS-Feel-Unknown` by the key's prefix (and warns in dev), matching
the flow's own fallbacks.

## D265 — Rough Days shelf: the Settings list idiom with Today III's card
No frame draws `/rough-days` (routes §4.6). It is set like `Settings`: nav back + caption "Rough days", captioned
groups from canvas 120 `gap 18` inside a `ScrollRegion` (D320). "The universal interrupt" is the caps line over
Today III's "Urge surfing" card (r24 `#1E1E1E`, padding 18 20, 52 ink disc with the stopwatch glyph, 18/700
title, 14/400 sub line, chevron) → `/rough-first90`; the seven protocols are one `RowGroup` captioned "What today
feels like" → `/rough-protocol?key=`. Copy is the screen's own (G12). Back falls back to `/(app)/library`.

## D266 — A rough-day protocol is an SOS response board
`/rough-protocol` renders `HeroBoard` like `SOS Feel *`: the protocol's name as the kicker, ✕, the page's
illustration at 190, headline 30/36 + line 15/24 at 452, the third page's move as a second 15/24 line in ink,
three light `PagerDots` inline at the foot of the stack (so the small-screen lift counts them), primary over a
ghost ("Walk through it / Next / Done" over "Not tonight / Back / Back" — the screen's own labels and stepping).
The 21 bespoke paper drawings (`src/components/roughDays/kit.tsx`, 749 lines, imported only by this route) are
replaced by the nearest Lesson-Illustrations-v4 card per page (table in `roughDays.ts`) and the file is deleted.

## D267 — `?key=lonely` opens Loneliness; an unknown key opens the first protocol
The `All` drawer pushes `/rough-protocol?key=lonely` (settings' file), which matched nothing and drew a blank
page. `rdProtocolKey()` maps the obvious short words (`lonely`, `anxious`, `stressed`, `bored`, `late`, `alone`)
and falls back to the first protocol, so no link can open an empty screen.

## D268 — Recipes walk the flow in either wording
sos-flow is renaming the interrupt's labels in the same phase, so each drive (`.overhaul/drives/b-SOS-*.js`,
generated by `.overhaul/f-sosb-drives.mjs`) accepts both (`Start`/`Start the interrupt`, `Continue`/`I’m up` …),
and `only()` clears any pre-checked chip before picking (D324 multi-select pickers), so the board reached is the
one named. Rotation-only boards press "Give me another" from their rotation neighbour. The three boards no
answer reaches (D038) are recorded on the mock-only `/urge?board=<key>` (D336), which is sos-flow's to land in
`urge.tsx`/`flow.tsx`. Until it lands, their render proof was taken D146's way inside this group's own file: a
temporary swap in `boardFor()` (Loc-Bed → Loc-Bathroom, Loc-Work → Loc-Home-Alone, Trig-Content →
Trig-Rejection), the sibling drive with its waited title changed, then reverted (grep-checked) — all three
0.00 % against their frames.

## D269 — Verification
All 30 boards diff at **0.00 %** (0 px over 24/255, mean Δ 0.43–0.50, the grain) against their frames at
393 × 852, Lato loaded; `SOS-Challenge` at 0.02 % — only the back chevron D263 leaves to the flow. Signature
residue is representational on every board: the design's `<svg>` box is the CSS-transformed 432.3 × 264
(the kit's screen-wide hero has no such box, D372), and the nav kicker / pill label report `line-height: normal`
in the frame against the kit's explicit 16 / 19 (same box). 375 × 667: every feeling board and the location /
trigger boards lift (D320 rule 2, the kit's `HeroBoard`) and keep 16 pt above the pill; the challenge drops its
art (its 131-pt deficit is more than the 98 pt of room under the nav) and its stack rises alone to canvas 241 —
no overlap anywhere. 430 × 932:
full-bleed grounds reach both edges, text wraps naturally inside the 382 column (the six forced breaks hold).

## Phase 2 amendments (no new numbers — the range is full)

* **D263 resolved.** `UrgeFlow` now passes `onBack` on `feeling-said`, so `SOS-Challenge` draws the frame's
  chevron and diffs 0.00 %. (It passes `onBack` on `place-said`/`trigger-said` too; those frames are `noBack`,
  so `ResponsePage` still draws the empty slot there — the chevron is keyed to the challenge's own nav.)
* **D262 addendum — the challenge card wraps `pretty`.** The frame sets the card sentence with no `text-wrap`.
  At 375/390/393 `pretty` breaks exactly where the greedy wrap does (`.overhaul/f-sosb-chal-wrap.mjs`), so
  the frame is untouched; at 430 the greedy wrap left "minutes." alone on the last line, `pretty` gives
  "…or ⏎ go stand where other people are for ⏎ ten minutes.". Native keeps the greedy wrap (D332: no fixed
  break differs at 393).
* **D265 addendum — Rough Days' back falls back to the All drawer** (was the Library tab, which is the week
  pages now and has no link here); with D340 history it returns to All, its one door. The interrupt card's
  title is "The first 90 seconds", the case the flow's first board and the All drawer use (the screen's own
  copy had title case; G12 keeps the words, the case follows the system's sentence case).
* **D266 addendum — protocol copy keeps each em dash with the word before it.** The space before "—" is a
  no-break space in `roughDays.ts`: at 390 and 393 Home alone III opened a line with the dash ("…can be
  seen ⏎ — or leave…", `.overhaul/f-sosb-dash.mjs`). All 21 pages at 393/375/390/430
  (`.overhaul/f-sosb-rp-sweep.mjs <outDir>`): no orphan, no dash-led line, stack ≥ 40 pt above the pill at
  375 (lifted), ≥ 94 elsewhere.
* **D268 addendum.** The three D038 boards are now reached on the landed `/urge?board=<key>` (D336) and audit
  at 0.00 %; the recipe notes say so.
