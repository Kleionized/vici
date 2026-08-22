# The lesson cards — `Lesson NN`, 83 frames

* **Design frames** `.uifinal1/final/Lessons-and-Tasks/Lesson-01.html` …
  `Lesson-84.html` (day 32 is absent from the bundle — see below)
* **App files** `src/app/lesson-card/[day].tsx` → `LessonCard`;
  `src/components/task/TaskScene.tsx` → `Scene`; plates in
  `src/content/lessonPlates.ts`; copy in `src/content/curriculum84.ts`
* **Generator** `scripts/uifinal/gen-lesson-art.mjs`

A content family under `DECISIONS.md` D008: one template, 83 data rows.

---

## Provenance

`fdiff.sh` returns **empty on all 83** — every lesson card is byte-identical to
the bundle the app was built against. Nothing on this screen changed in this
drop; what follows is the verification, and the two gaps it found.

## The template

The frame is `393 × 852` on `#EDECE7` with **no grain layer** — the only family
in the bundle without one. The sheet is `left:0 right:0 top:52 bottom:0`,
`border-radius: 24px 24px 0 0`, `#F4F3F0`, `overflow: hidden`, and because the
sheet is the positioning parent every `top` inside it is already the app's
number.

| element | canvas | app |
|---|---|---|
| sheet | `top: 52`, radius `24 24 0 0` | `marginTop: insets.top − 2` |
| close cross | `right:22 top:24`, `viewBox="0 0 20 20"`, `d="M3 3l14 14M17 3L3 17"`, `#55534E` at 2 | same |
| pip rail | `top:28`, `gap:7`, seven pips; active `18 × 6 r3 #131313`, resting `6 × 6 rgba(19,19,19,0.18)` | `week.lessons.length` pips |
| eyebrow | `top:64`, centred, `11px/600`, `letter-spacing 1.4`, `#B0AEA8` | composed from `lesson.day` and `week.roman` |
| plate | `left:76 top:150 240 × 200` | `Scene` over `LESSON_PLATES[day]` |
| title | `left:36 right:36 top:392`, centred, `23px/500`, `+0.1`, `line-height 30`, `#1D1C1A`, balanced | `lesson.title`; day 82 alone takes the 20/27 ramp at `top: 396` |
| summary | `left:44 right:44 top:448`, centred, `15.5px/400`, `line-height 23`, `#55534E` | `lesson.summary` |
| CTA | `left:24 right:24 bottom:88 height:54 r27 #131313`, `17px/600 +0.2 #FFFFFF` — "Start lesson" on all 83 | same |
| back link | `bottom:44`, centred, `15px/500 #8B8882` — "Back to Week R" | `weekFor(lesson.week).roman` |

---

## Comparison — design frame vs the running app

Five cards, chosen to cover the template and all three known defects, driven in
the app and captured with the same probe as the frame:

| card | design rows | app rows | missing | value differences |
|---|---|---|---|---|
| `Lesson 01` | 46 | 79 | 0 | 0 |
| `Lesson 21` — the one plate with a text run | 36 | 60 | 0 | 0 |
| `Lesson 23` — a truncated plate | 36 | 55 | 0 | 0 |
| `Lesson 70` — a truncated plate | 35 | 50 | 0 | 0 |
| `Lesson 74` — a truncated plate | 41 | 64 | 0 | 0 |

Three real gaps came out of it:

1. **The sheet sat 2pt low.** The app put it at `insets.top` where the canvas
   puts it at 52 — 2pt above the status bar's baseline, the same crest every
   other sheet in the app has. Every element on the card was 2pt low with it.
2. **Three plates were missing eighteen layers between them.** `Lesson-23`,
   `Lesson-70` and `Lesson-74` each carry a stray `</svg>` that closes nothing.
   A browser ignores it; `gen-lesson-art.mjs`'s layer loop stopped dead on it
   and dropped everything after — eight layers on day 23 (its whole progress bar
   and text lines), four on day 70 (its three ruled lines), six on day 74 (its
   clock hands and pencil marks). The loop steps over an unmatched closing tag
   now, and the counts are the canvas's: 13, 11 and 18.
3. **`Lesson 21`'s plate lost its glyph.** Its white `44 × 36` card holds a gold
   `?` at `17px/600 #E2BA78`, and `TaskSceneLayer` had no text kind at all, so
   the app painted an empty card. A box can carry a run now — it is the only one
   in the whole art corpus that does — and `TaskScene` draws it.

## Reading — every row that is not `match`

`DECISIONS.md` D015: a percentage radius becomes a number, and every box in the
plate is an SVG shape whose paint is a `fill` rather than a `background`. No
sampled card carries a row outside those classes.

## What the bundle does not carry

**Day 32 has no frame.** `Lesson-32.html`, `Task-D32-Intro.html`,
`Task-D32-Options.html` and `Task-D32-Card.html` do not exist in this drop and
did not exist in the previous one. The app has a day 32 — "The Short-Term Cost"
— filled from the authoring intermediate `task-src.json` rather than from a
rendered frame. Under `DECISIONS.md` D007 the rendered frame wins over the
intermediate, and here there is none, so day 32's card, both its task boards and
its plate have no design authority in this bundle. Flagged for REPORT.md.
