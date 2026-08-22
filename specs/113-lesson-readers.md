# The lesson readers — `Week NN`, 1,372 frames

* **Design frames** `.uifinal1/final/Week-01-Reset/` … `Week-12-Leave-It-Behind/`,
  `L{lesson}-Frame-{page}.html`, lessons 2–84, 1,372 pages
* **Sibling** lesson 1's reader, which lives in three other bundles — see
  `DECISIONS.md` D005
* **App files** `src/app/lesson/day/[day].tsx` → `LessonReader`;
  `src/components/lesson/scroll.tsx` → `LessonScroll`;
  `src/components/lesson/reader.tsx` → `Run`, `Mark`, `Part`, `PickRows`, `Cta`,
  `OptionRow`, `GlyphArt`, `Board`; content in `src/content/lessonReader.ts`
  (1,398 pages) and `src/content/coverScene.ts`
* **Generator** `scripts/uifinal/gen-lesson-scrolls.mjs`

A content family under `DECISIONS.md` D008: the templates are specced once, the
content is diffed field by field, and the render is compared on a sample that
exercises every template.

---

## Provenance

These twelve canvases are not new work in this drop. Every one of the 1,372
frame files is byte-identical to the same file in the earlier `lesson UI` split
— `cmp` over all of them returns 1,384 identical (1,372 frames plus twelve
helmets), 0 differing. `UI Final 1` is simply the first *main* bundle to carry
them. `DECISIONS.md` D042 records it.

## Content — every field, every frame

`scripts/uifinal/gen-lesson-scrolls.mjs`, pointed at a symlink tree of
`.uifinal1/final/Week-*` (plus `Lesson-1-Surviving-the-Night` and
`Lessons-and-Tasks` for lesson 1) with its outputs redirected out of the repo,
reproduces the committed `src/content/lessonReader.ts` and
`src/content/coverScene.ts` **byte for byte** — 1,398 pages, 11 ramps, 7 cover
layers. Every string, ramp, mark, option, glyph and pill in the reader is
therefore this bundle's own, read out of the frames, and the field-by-field diff
D008 asks for is that re-read.

## The templates

Nine shapes account for 1,280 of the 1,372 frames; the other 24 signatures are
option- and pick-board variants that differ only in row count.

| template | frames | what it draws | app |
|---|---|---|---|
| COVER | 83 | eyebrow, title, minutes, the 270 × 190 cover scene | a `column` page ending in `mark: 'cover'` |
| EPIGRAPH | 166 | a sun dot, a serif quotation, an attribution over a rule | `column` with an `attribution` part |
| CRESCENT | 13 | the crescent mark and one line | `column` with `mark: 'crescent'` |
| PROSE | 762 | one to three runs of copy, centred | `column` of `text` parts |
| CASCADE | 24 | a column of graded lines | `column` with a `cascade` part |
| PICK BOARD | 75 | a question, a helper, and rows with a radio | `k: 'pick'`, drawn in the overlay |
| OPTIONS BOARD | 81 | a title over head/body option rows | `k: 'board'`, drawn in the overlay |
| TASK PAGE | 85 | title, instruction, the scene, a rule card | `column` with a `rule` part |
| COMPLETION | 83 | a sun, "Lesson complete." and a pill | `column` with a `cta` |

### The shell, identical on all 1,372

| element | canvas | app |
|---|---|---|
| ground | `#F4F3F0` with grain at 0.07 | `LessonScroll` |
| `Close` | `left:16 top:66`, `17px/400 #3A3934` | `left: 16, top: 12` under the inset |
| the rail | `left:16 right:16 top:108 height:2 radius:1`, track `rgba(0,0,0,0.05)`, fill `#B4B1AB` at `round((i+1)/count × 100)%` | same, animated with `LinearTransition` |
| the chevron | 22 × 12 at 42 off the frame's foot, cover only | same |
| the page | centred in the frame's whole 852 | a scroller pinned to the real insets so the centre stays the screen's |

---

## Comparison — design frame vs the running app

Eight pages of lesson 2 plus one options board from lesson 43, one per template,
driven in the app and captured with the same probe as the frame:

| page | template | design rows | app rows | rows differing outside the reporting classes |
|---|---|---|---|---|
| `L2 Frame 01` | COVER | 20 | 34 | 0 |
| `L2 Frame 02` | EPIGRAPH | 11 | 21 | 0 |
| `L2 Frame 03` | CRESCENT | 7 | 15 | 0 |
| `L2 Frame 04` | PROSE | 5 | 12 | 0 |
| `L2 Frame 14` | PICK BOARD | 27 | 36 | 0 |
| `L2 Frame 24` | TASK PAGE | 20 | 34 | 0 |
| `L2 Frame 25` | OPTIONS BOARD | 42 | 52 | 0 |
| `L2 Frame 26` | COMPLETION | 10 | 20 | 0 |

Two real gaps came out of that comparison and are fixed: the cover eyebrow's
1.8px tracking, which the generator was not reading (`DECISIONS.md` D043), and
the pick rows' weight and label width (D044).

### One verification limit, stated

**The rail's fill lags one page in every app capture.** The design's four widths
across pages 1–4 are 14.4, 28.9, 43.3 and 54.1 of the 361-wide track; the app
produces exactly those — `round((index + 1) / 26 × 100)%` of 361 is
14.44 / 28.88 / 43.32 / 54.15 — but its `LinearTransition` layout animation does
not run while the browser pane's tab is hidden, so a capture taken right after a
page turn still reads the previous page's width. All four widths appear in the
captures, one turn late. The formula is the frame's own and is checked
arithmetically rather than by capture.

The same hidden-tab behaviour froze reanimated's `entering` animation with the
page's column still `visibility: hidden`, which made the first captures of this
family look empty. `.uifinal1/probe.js` now un-hides an *inline*
`visibility: hidden` before walking, on the app side only — no frame in the
bundle sets one except `27 · Cost Next 365`, whose design capture must keep it.

## Reading — every row that is not `match`

`DECISIONS.md` D015, D019 and D022: a percentage radius becomes a number, a
radial-gradient div becomes an Svg and a Circle on the same rect, a canvas box
that became an SVG shape reports no background, a painted `<span>` is a View
plus a Text, and `expo-image` carries the grain's opacity one level down. No
sampled page carries a row outside them.

## What the bundle contradicts itself about

`DECISIONS.md` D045: the same daily task is authored twice in `UI Final 1` — in
these week canvases and in `Lessons and Tasks` — and the two differ on the
"Done when…" rule for 78 of 84 days, on the options board's title for 81 of 82,
on 28 boards' rows and on 25 days' closing notes. Both are implemented as drawn.
