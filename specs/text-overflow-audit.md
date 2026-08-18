# Text that outgrows its box

The canvas composes every board with one specimen sentence, so a caption it
draws on two lines gets exactly the room two lines need. The app's copy is
longer and varies by day, by lesson and by user — and where a screen copied the
frame literally, the extra line has nowhere to go.

## The one that was losing words

`TaskCard` on Today. The frame states a 274-tall card with the caption pinned at
`top: 194`, which leaves 80 — three 26pt lines with **2pt to spare** — and the
card carries `overflow: 'hidden'` to round its corners. So a third line sat
flush on the edge and a fourth was cut off entirely.

The canvas's own specimen is 62 characters. The captions the app actually shows
come from `curriculum84` and run to **110**:

> Change one person, account, place, or routine that regularly leaves you more
> upset or more likely to use porn.

At the lesson ramp (15/22) that is four lines — `190 + 88 = 278` against a
274-tall clipping box.

**Fixed** by making the card's height a floor rather than a ceiling. The caption
is the card's only child in flow, so its own height gives the card one:

| | frame states | now |
| --- | --- | --- |
| card | `height: 274` | `minHeight: 274` |
| caption | `position: absolute; top: 194` | `marginTop: 194`, `paddingBottom: 28` |
| lesson caption | `position: absolute; top: 190` | `marginTop: 190`, `paddingBottom: 40` |

The padding is the gap the frame itself leaves under its two-line specimen
(274 − 194 − 52 = 28; 274 − 190 − 44 = 40), so the card is unchanged where the
canvas composed it and keeps the same breathing room at any length.

**Measured in the app**

| viewport | lines | card height | gap under the text | clipped |
| --- | --- | --- | --- | --- |
| 390 | 2 | **274** — the frame's own number | 40 | no |
| 320 | 3 | 296 | 40 | no |

## The sweep

`scripts/uifinal/overflow-audit.mjs`. The shape that actually loses words is
narrow: a box that **fixes a height** and **clips**, holding text that **wraps**
and sits low enough that few lines fit. It reads nesting from indentation,
resets at each top-level declaration, and pops on closing tags — without those
last two an unrelated button two hundred lines up "contained" a caption.

Validated against the known bug before trusting it: run over the pre-fix card it
reports both variants with the right numbers (3 lines fit, 2 spare / 18 spare);
over the fixed card, nothing.

    clipping fixed-height boxes, ≤3 lines of room ....... 0
    any fixed-height box, ≤2 lines of room .............. 1

The one is `lessons-browser.tsx:76` — the constant title "Lessons" in a 44-tall
row. A string that cannot vary cannot outgrow anything.

## Collisions, and what they came to

`--collide` measures each wrapping text against the next part pinned below it,
since on these boards a longer sentence walks into its neighbour rather than
clipping. Filtered to text that is actually interpolated — hardcoded frame copy
cannot grow — it reports 15 with a line or less of room. Reading them:

- **most are false pairings.** `weekly-report.tsx:90` is the last element of an
  early-return branch with nothing beneath it; the detector paired it across
  branches. Branch-awareness is the tool's remaining weakness and it is stated
  here rather than papered over.
- **one is real but marginal.** `medallions/[key].tsx:225` draws the medallion's
  story at `top: 48` in a 118-tall card — 70pt, so three 21pt lines fit with 7
  to spare and a fourth would spill onto the share button. The longest story in
  `Medallion.tsx` is 95 characters, which is two lines at that width. Left
  alone, and recorded here: the card is absolutely positioned above a button
  that is also absolutely positioned, so growing it means moving both, and
  nothing in the current copy reaches four lines.
