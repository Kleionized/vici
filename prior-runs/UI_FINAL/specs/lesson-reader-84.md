# The reader for all 84 lessons

The `lesson UI` bundle is the first drop to author a body for every lesson. The
last one authored lesson 1 and left the other 83 with a card and a task — the
gap recorded as D-015. This closes it.

## What arrived

| | |
| --- | --- |
| new canvases | **12** — `Week 01 Reset` … `Week 12 Leave It Behind` |
| new reader frames | **1,372**, holding lessons **L2 – L84** |
| lesson 1's frames | 26, of which **3 changed** (16, 23, 24) |
| shared canvases that also changed | `Email Login` (15 changed, 7 added), `Lessons and Tasks` (169 changed) |
| unchanged | `VICI (previous)`, `vici-prev` — byte-identical |

Every canvas was split to one file per frame under `.uifinal/lessons/`, and each
week file was confirmed to hold exactly the seven lessons of its week:

    Week 01 → L2…L7   Week 02 → L8…L14   …   Week 12 → L78…L84

83 lessons, plus lesson 1 from its own canvas. **1,398 pages in all.**

## Reading the frames rather than guessing at them

A classifier ran first, over all 1,372 frames, grouping them by the ordered type
ramps of their copy plus their structural markers. It found **34 distinct
signatures** — and, importantly, that lesson 1's own 26 frames use exactly the
same ones. The bundle is not a new design; it is the existing one extended.

34 signatures is too many to model as a union of page kinds without deciding in
advance what the design is allowed to do. So a page is transcribed as **what it
is**: the centred column's gap and its children in order, each child carrying
the metrics its own frame states. The renderer walks the parts (D-102).

    column pages   1,241   the reading pages, centred in the whole 852
    board pages       82   task options — its own top, its own foot
    pick pages        75   a question, its pills and a pill

## The artwork question, settled by hashing

The worry was 84 lessons × several marks = hundreds of bespoke drawings. Hashing
every art block across all 1,398 frames found **39 distinct** — and of those,
every bespoke one is lesson 1's. Lessons 2–84 draw only:

- `sun12` (168), `sun36` with a 115 halo (84), `crescent` (15), and spacers;
- one **270 × 190 cover scene**, on each lesson's cover and again on its task
  page — all **168 instances byte-identical** (D-104).

That scene is seven layers: a horizon dome, three stars, the sun's blurred halo,
the sun, and the shadow it casts. Transcribed once into `content/coverScene.ts`
and drawn by the generic `Scene` renderer.

## Ten ramps

The 2,239 runs of copy use **eleven** type ramps between them. They are named
once and each run carries an index, so nothing is defaulted and the file stays
legible (D-103).

| | size / weight / leading | colour | max-width | wrap |
| --- | --- | --- | --- | --- |
| eyebrow | 12 / 600 | `#B0AEA8` | — | — |
| cover title | 28 / 500 / 40 | `#1D1C1A` | 280 | balance |
| meta | 15 / 500 | `#8B8882` | — | — |
| epigraph | 28 / 500 / 44 serif | `#1D1C1A` | 300 | balance |
| statement | 26 / 500 / 38 | `#1D1C1A` | 280 · 300 · 310 · 320 | balance |
| prose (soft) | 21 / 400 / 36 | `#55534E` | 310 | pretty |
| prose (ink) | 21 / 400 / 36 | `#1D1C1A` | 310 | pretty |
| task body | 17 / 400 / 26 | `#55534E` | 310 | pretty |

## Proof the transcription lost nothing

`scripts/uifinal/lesson-verify.mjs` goes back to the frames and checks both
directions — every run the frames draw appears in the data, and nothing in the
data is absent from the frames.

    frames checked:            1,398
    text runs the frames draw: 3,983
    drawn but NOT transcribed: 0
    transcribed but NOT drawn:  0

Getting there took four real fixes to the extractor, each of which had been
silently dropping content:

1. **SVG children carry explicit closing tags** in this canvas (`<path …></path>`),
   so listing `path`/`circle`/… as void made the depth counter go negative and
   end a subtree early — truncating every option row that contains a glyph. The
   same trap this project hit once before, in `pretty.mjs`.
2. The task page's **rule card is both `align-self:stretch` and
   `align-items:center`**, so testing centred-ness first read 85 rule cards as
   epigraph attributions.
3. **Lesson 1 alone** lays its pick page out inside the centred column, where
   its pill list collides with the rule card's selector.
4. **Day 43 closes with two paragraphs**, the second only 10pt under the first,
   so the closing note is a list rather than a single line.

The **progress rail** was checked separately: the canvas states a percentage on
every frame, and all 1,398 match the app's `round((index+1)/count × 100)`
exactly — **0 mismatches**.

## The spec workflow

Nine agents specced one page kind each straight off the frames and compared it
property by property to the app; every claim was then handed to a different
agent told to refute it. **34 claims, 18 confirmed, 16 refuted.** The confirmed
ones are listed in `DECISIONS.md` under D-102…D-107.

One "confirmed" finding was itself wrong and was refused: an agent claimed the
task-options board belongs at `top: 126`. That is the canvas value, and the
canvas's first 54px is a status bar the app never builds — the app owes **72**,
which the pick board independently confirms (stated 118, measured 64).

## Verified in the running app

- The sun's `radial-gradient(circle at 34% 30%)` now resolves to cx 132.12,
  cy 76.4, r 17.32 — the stated offset, farthest-corner — while the 191 layers
  that say `closest-side` keep the centred geometry they always had (D-107).
- All 26 pages of lesson 2 walked in order, rail reading 4 · 8 · 12 · 15 · 19 ·
  23 · 27 · 31 · 35 · 38 · 42 · 46 · 50 · 54 · 58 · 62 · 65 · 69 · 73 · 77 · 81 ·
  85 · 88 · 92 · 96 · 100 — the canvas's own values.
- A cover from each of the twelve weeks renders its eyebrow, title, meta and the
  seven-layer scene.
- Lesson 1 keeps its bespoke night-room cover.

## One defect the render pass found that no sweep could

Opening a different lesson **reuses** the reader component rather than
remounting it, so the page cursor — a bare `useState(0)` — survived the change.
Navigating from page 20 of one lesson to another dropped the reader on page 20
of the new one. The cursor now carries the lesson it belongs to and resets when
that changes. Verified: from page 3 of lesson 9, opening lesson 50 lands on
lesson 50's cover.

## Where the render verification stopped, and why

Full page-by-page walks were completed for **lessons 1, 2 and 40** (26, 26 and
14 pages), covering every one of the nine page shapes, plus the covers of 24
lessons spanning all twelve weeks. Walking all 84 in the browser was abandoned
rather than faked: the preview pane runs hidden, which throttles both
`setTimeout` and `requestAnimationFrame` to roughly one tick per minute, so a
1,398-page walk would take days of wall clock.

What stands in its place is mechanical and complete rather than sampled — the
two-way text proof over all 1,398 frames, the progress-rail check over all
1,398, and the fact that every metric is read from each frame rather than
authored by hand. The sampling that remains is of *rendering*, not of content.
