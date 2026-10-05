# medallions-letters decisions — Vici Overhaul run, Phase 1 (D270–D279)

Files: `src/app/(app)/milestones.tsx`, `src/app/medallions/[key].tsx`, `src/app/medallions/tiers/[key].tsx`,
`src/components/keepsakes/{Medallion,Board,Letter}.tsx`, `src/lib/album.ts` (new), `src/app/{letter,medallion-post,drop,mail}.tsx`.
Seeds: `.overhaul/medallions-seed.js` (rewritten), `.overhaul/medallions-vidi-seed.js`, `.overhaul/ml-letters-seed.js` (new).
Recipes: `.overhaul/recipes/medallions-letters.json` (replaces `medallions.json` + `letters.json`).

These supersede D057, D059, D060, D061, D062, D100, D101, D102, D137 and D138, which describe the previous
drop's geometry (struck metals, the sun, page dots, the vertical album scroll, the lamp, the laurel year tile,
Medallion Received as the post's arrival).

## D270 — The album is a pager of six
`Medallions` leaves row 3's place (578–687) empty above a bar at 748, and `Album Earned II` redraws faces 7–10
from the same origin (288): the only reading that draws both is pages of 3 × 2 (CRITIC §5, medallions Q1). A
horizontal `ScrollView pagingEnabled` one screen wide, 2 rows tall, no page dots (none drawn). A page that ends
short keeps the grid's `1fr` columns with empty tracks. Switching segment returns to page 1.

## D271 — Two faces or fewer sit as a centred row, on either segment
`Still to earn` lays its two faces out as a centred flex row (gap 48, shrink-wrapped cells), not the grid (Q2).
The same rule applies to `Earned` (a fresh account has only Veni). An empty segment draws its count line
(`0 still to earn`) and nothing else — no copy invented (G12).

## D272 — One coin, one drawing (`FaceCoin`)
The 27 frames draw every face on one `0 0 64 64` coin at 44 / 64 / 84 / 168: ink field, 40 rim dots at 0.3
(radius 28.1, 9° apart, `toFixed(2)` — reproduces all 1,080 printed values), the 25.5 hairline, the device in
ground ink. **The device lifts 2.6 iff a numeral is drawn** (that one rule explains every frame). Unearned
one-off = the earned coin at 0.32; unearned tiered = `#141414` field, `#3A3833` dashed rim, `#2A2926` ring, no
dots, `#5A574F` device — with the target numeral "I" in the album, bare on the 168 boards. The numeral is Lato
900 by family (`sans('900')`), 6.4 in coin space, tracking 0.6. The metal is no longer painted; `KK_METALS`
stays only as the `?tier=` route contract. Nothing draws the old coin any more (Edit Profile counts with
`useAlbumStanding`): `kkSun` is deleted, and — Phase 2, the orchestrator's carry-over — the `KKMedallion` shim
too (nothing in `src/` or `scripts/` imported it).

## D273 — The doors the pill used to be
No frame draws a way from a board to its `Tiers *` page. On a tiered face the **tier track** (345 × 56 at
T + 338) is a button, "See every tier"; on a one-off (no track) the **caps line** opens `Tiers One-offs`.
`Back to medallions` on a ladder goes to the album itself (`router.dismissTo('/(app)/milestones')`, which
replaces when the album is not in the stack); on the unearned board it is `back`.

## D274 — Detail Paper: computed caps and quote (CRITIC §1.4)
`Detail Paper` is the previous drop's seven-rung Vici left unredrawn. In that drop `Detail Bronze` was
`Tier I · ×1` and quoted "Nine minutes, start to finish. You watched it rise, crest, and leave without you.", and
`Detail Paper` read `Not yet · first ×1` over the same line "— waiting at ×1": both the frame's `×1` and its
quote are the old first rung. Vici's first rung is now ×5 (`Tiers Vici`, the album's data), so — as CRITIC
§1.4 rules, successor of D057 — the board computes both: `Not yet. First at ×5` and the first rung's own line,
`stories[0]` ("Five ridden. Each one shortens the next."), which every unearned tiered board quotes. Keeping the
frame's line would also tell an account with no ridden urge that it rode one out. Residual: the quote is two
lines, not three, so the block sits at T 170 (13 lower — the geometry is `Detail Gold`'s, 0.00 %), plus the two
strings: 5.65 %. (The previous pass kept the frame's line as a `waiting` field without naming the departure;
removed.) The four other `Detail` boards agree with `Tiers Vici` word for word; `vici.stories[3]` takes
`Detail Gold`'s line.

## D275 — The medallion post: Letter Arrival, and the enclosure the account earned
The post arrives on `Letter Arrival` (CRITIC C8 — no frame draws a medallion arriving outside onboarding).
`Tonight` and the ✕ both shelve it (POST_DONE), as the arrival's only exit did before — it stays readable
from Mail. The letter encloses **Vici at its rung** (`Vici, Tier I` + its blurb): the post fires on a ridden-out
urge, which is Vici's rule, and the album must agree with what the post claims. The frame's `Rebound, Tier I`
is its sample account. Known tension, for the orchestrator: the letter's own words ("This one isn't for
resisting. It's for coming back.") fit Rebound better than Vici; switching is one line in
`medallion-post.tsx` if the user prefers the frame's face (it would then enclose a face the album may show
unearned). Layout verified with the face forced to Rebound: 0.01 %.

## D276 — Yearly Drop's way out: the ✕ in the right slot (D323)
D323 puts the ✕ "in the nav's right slot" on both Paywall and the Drop. The Drop's right slot holds `Restore`,
as Paywall's did; like Paywall (D220) the ✕ takes the slot (the kit's `right: 'close'`, x 353 — where Paywall,
Paywall Rescue and the claimed `Drop Received` all draw it, so it never moves) and the `Restore` it displaces
lives on in the ghost `Terms · Restore`, which restores. Leaving marks the drop seen, as the old close did.
Residual: one region, 316,72 56×16 (Restore → ✕), 0.10 % — Paywall's own residual. (The previous pass put the
✕ in the empty left slot, per CRITIC D-2's recommendation, and asked for a kit `left: 'close'`; D323 ruled the
other way, so the local `Tap` and that request are gone.)

## D277 — A run the frame sets as one text node must be one text node
`<Salutation>Dear {name},</Salutation>` renders three DOM text nodes; Chrome shapes across them differently
from the frame's single node and "Sam" moved by a sub-point (125 px of diff). `{`Dear ${name},`}` → 0.00 %. Same
for `That’s {MONTHLY} a month.` on the Drop (93 px → 0). Worth knowing for every group: interpolate into a
template string wherever the frame's run is one string.

## D278 — The post's small decisions
* The arrival's caps are the programme week: `Week <roman(ceil(day/7))> post`, day 1 = sign-up, capped at XII
  (C8 / Q7). Recipes use `ml-letters-seed.js` (an 80-day-old account) to draw "Week XII".
* The letter card's column is a `ScrollView` inside the card with the 70 fade's height at its end: at 852 the
  copy fits (ends 105 above the fade) and nothing moves; at 667 it scrolls instead of being cut.
* The reason run is set as a sentence: one full stop is added unless the user's own words end in one (the old
  code printed "again.." for a why that ended in a period). The journal entry's apostrophes are curly now.
* `/letter?variant=week12` draws `Letter Received` (tail's frame) through the kit `HeroBoard` — no ✕, 26/33 at
  451, `Open` / `Save it for later` — and still opens tail's `O3LetterRead` with its current props.
* `Drop Received` is the kit `HeroBoard` with `MedalTier(4, 176, 'V', disc=false)` at 212 as its art.

## D279 — Ladders, ledger and copy
* One ledger, `src/lib/album.ts`: `useMedallionLedger()` (faces, counts, standings, one-off dates, `byKey`) and
  `useAlbumStanding()` (`{earned, total}` for Edit Profile's "10 of 12", CRITIC C17). `buildLedger` is pure.
* A ladder's count is `Day N` / `×N`; its next line `N days|more to <Tier>` (singular `1 day`); at the top rung
  there is no next tier and the line is omitted (Q6 — nothing drawn, nothing invented).
* Boards: `T = 196 − 13·quoteLines (+1 on Platinum)`; the quote's line count is measured (`onLayout`) and the
  board is held invisible for that one frame. Ladders `T = 155`. Between the nav (100) and the pill the page is
  a `ScrollRegion` (D320) — a no-op at 852; on a short phone it scrolls to 24 above the pill (D320's
  `controls + 24`), as the Drop's offer does.
* The album's pager is as tall as its tallest row: a page holding an unearned tiered face (its 56 × 3 bar adds
  10 + 3) is 2 × 122 + 36, not 2 × 109 + 36 — a fresh account's second row of bars was clipped to 1 pt. A first
  rung of one reads in the singular (`0 of 1 wave`, `0 of 1 morning`).
* The Drop's perk words keep the frame's breaks on a wider phone: each label is inset to the 393 cell
  (93.67) — at 430 "Track your progress" no longer fits one line while its neighbours take two.
* A one-off board's caps are its mint date (`Jun 9`, from the ledger), `Earned once` until the ledger loads, and
  `Not yet` (`#5A574F`) unearned; no track; quote `stories[0]`.
* `KK_ALBUM` copy now matches the frames: Breakwater's lower-case "overwhelming"; `First light` "The first
  check-in"; `Black Box` "First slip logged"; `Return` "Back after 7+ days away" (`ahead` keeps "After 7 days
  away"); `kkRung` writes days in Arabic everywhere (`Tier I, Day 7`, D061 superseded); tier lines use ", "
  (`Tier I, ×5`); unearned caps `Not yet. First at ×10`.
* `/mail` (unframed) is `Log — Reports`' idiom (C6): title head, 64-tall ruled rows (15/700 title over a
  14/700 `#9B968E` line, `#5A574F` chevron), the app's own copy; empty = centred 26/33 + 15/24 mute.
* **Phase 2 — the quote keeps the frame's measure.** A board's italic quote is `left 44 right 44` at 393, a 305
  measure; on a wider phone it is held to 305, centred (the Drop's perk rule above), so it breaks where the frames
  break it. Left free, 430 set "The / wall did." (Breakwater Platinum), "unsure of a / while ago." (Detail Silver)
  and pulled Detail Paper's quote onto one line, which moved the whole block 13 lower. Exactly 44 at 393 and below
  (0.00 % change at 393); 375 keeps its narrower 287.
* **Phase 2 — Mail's post row** names the enclosure in the card's own words, `Vici, Tier I · enclosure inside`
  (it read `tier I`, against 39B's `Rebound, Tier I` casing and the card it opens).
