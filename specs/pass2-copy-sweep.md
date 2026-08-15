# Pass 2 — the copy sweep

Pass 3's sweep compared every colour and font-size *literal* in the app against
every literal in the canvas. Nothing had yet checked the other half of the
brief's rule — **never invent copy** — which is a claim about words, not
numbers, and which no amount of re-reading two similar boards reliably tests.

So: `scripts/uifinal/copy-sweep.mjs` walks every frame that has an app target,
tokenises out every text run it draws, and looks for that run in `src/`.

    frames swept:                575
    distinct text runs checked:  3,873

A whole-run miss is not by itself a finding — the app composes most short runs
at runtime (`Mood 4/5 · 7h sleep` is four interpolations and a separator, and no
source file contains it whole). So each missing run is broken at the seams the
app actually composes on and re-checked as *phrases*: three or more words that
appear nowhere in `src/` is copy the app does not have.

Three supporting sweeps were needed to make the comparison honest:

- **`entity-sweep.mjs`** — the canvas writes `&rsquo;`, and JSX decodes that in
  text and in string attributes but *not* in a JS string or an expression
  attribute, where it would render as the literal `&rsquo;`. Rather than reason
  about which position is which, it runs the real JSX transform and reports what
  survives. **0 survive.** (This also corrected an earlier belief in the run:
  JSX string attributes *do* decode. The fix applied then was harmless.)
- Unicode escapes (`Where you’re starting`) are decoded on the app's side,
  or every escape reads as missing copy.
- **`apostrophe-sweep.mjs`** — below.

---

## Finding 1 — the options board has a second layout, and the app built one

**9 days.** `Task DNN Options` is drawn two ways. The app implemented the
icon-plate variant and used it for all 84 days; the canvas also draws a
**numbered-step** variant on days **10, 12, 21, 44, 48, 60, 62, 64, 79**.

| | icon (74 days) | step (9 days) |
| --- | --- | --- |
| badge | 40pt plate, `border-radius:12px`, two-layer shadow | 24pt disc, `border-radius:50%`, hairline ring, `margin-top:1px` |
| badge content | a drawn glyph | the step's number, 12/600 `#55534E` |
| badge→text gap | 14 | 12 |

### The consequence: the option copy was scrambled

The step number is a text node. `gen-curriculum.mjs` paired the board's text
nodes two at a time — heading, body, heading, body — so on those 9 days the
number became a heading and every pair after it shifted. Day 44 read:

```
{ head: "1", body: "Two hours before" },
{ head: "Where were you and what were you doing?", body: "2" },
```

against a canvas that draws `Two hours before` / `Where were you and what were
you doing?`. **25 rows had a bare number as their heading and 19 as their body.**

Two more things break the same pairing, on days that draw no numbers at all:

- rows that are a **heading with no body** (days 26, 40, 42, 54, 67, 72, 82) —
  the next row's heading was pulled up as this row's body;
- the **closing note** under the last row, which paired with whatever preceded it.

Fixed by reading the board structurally: a row is the flex container, its
heading and body are the children of its text cell, and the badge's contents are
never copy. `scripts/uifinal/gen-curriculum.mjs`.

## Finding 2 — the closing note was never a field

**25 days.** Every options board can close with a note under the last row. On
most days it repeats the Intro board's rule, which is exactly why re-reading the
two boards would not catch it — and why **only 23 frames showed up in the copy
sweep**. On those, it says something else:

| Day | Intro board's rule | Options board's closing note |
| --- | --- | --- |
| 45 | Done when the note is written and pinned. | Save the three time blocks in a pinned note. |
| 46 | *(its own rule)* | Cross out optional catch-up work, extra training, and non-urgent errands for today. |
| 54 | *(its own rule)* | If you need to stay reachable, use Do Not Disturb and allow calls from family, favourites, or emergency contacts. |

It cannot be derived from `done`, so it is now its own field. Day 43 writes
**two** paragraphs, the second only 10pt under the first, so the field is a list
of paragraphs each carrying its own gap.

## Finding 3 — the board's geometry is per-day, and was hardcoded

The app fixed the options column at `top: 171` (canvas 225 − 54), `gap: 22`,
heading 15.5/21, body 3/13/19 for every day. The canvas states:

| property | values it uses |
| --- | --- |
| column top | 209 (3 days) · 225 (74) · 260 (5) |
| row gap | 10 (3) · 13 (5) · 16 (2) · 18 (1) · 22 (72) |
| heading | 14/19 (3) · 14.5/19.5 (5) · 15/20 (2) · 15.5/21 (67) · 16/22 (1) |

All of it now travels with the task as `task.board`. Day 32 has no frames of any
kind, so it takes the board 74 of the other 83 draw — stated as a fallback, not
disguised as a reading.

**Verified numerically:** all 83 framed days re-read off their frame and
compared to the emitted data — top, bottom, kind, badge, row gap, heading ramp.
**0 mismatches.**

## Finding 4 — three strings drew the wrong apostrophe

The canvas is not consistent with itself: **385** of its text runs use a curly
apostrophe and **85** a straight one, with no rule to derive which. The brief
makes the design the source of truth for anything visual and a quote mark is
visual, so the resolution is per string.

`apostrophe-sweep.mjs` finds runs identical to the app's but for the apostrophe.
It found **3**, all in `src/components/onboarding/art.tsx` — `It's not a
willpower problem.`, `You won't do it on willpower alone.`, `Progress isn't a
straight line.` Corrected to the straight apostrophe their frames draw; the
sweep now reports 0.

---

## Not defects — checked and dismissed

| Run | Why it is not a finding |
| --- | --- |
| `Back to Week I` … `XII` (83 frames) | composed — `` `Back to Week ${week.roman}` `` |
| `Part III finished`, `Stress on top`, `Most land after 10 pm`, `About a week at this pace`, `Five steady days of seven. Friday was the test.` | composed at runtime from live data |
| `Naming your triggers`, `Lesson 5 · Week II` | the library card's title is `lesson.title`; the canvas is showing a specimen lesson that is not in the 84 |
| `Sam`, `sam@hey.com`, `sam@example.com`, `Jul` | interpolated — name, email, date |
| `“Nine minutes, start to finish…”` and the four other medallion stories | present; the app stores the story bare and `medallions/[key].tsx:140` adds the quote marks |
| `Where you’re starting` | present as a `’` escape |

## Open, recorded rather than changed

**`Medallion Received` (90F) draws a different medallion than the app.** The
canvas frame shows *Veni · Tier I · The Vow* with "You signed your name to
twelve weeks. The campaign begins tonight."; `src/app/medallion-post.tsx` is
hardcoded to *Back on Deck · Tier II · The Return*. The geometry matches (title
canvas 432 → 378, sub 530 → 476), and the divergence is which medallion the
screen delivers — wired through a storage key, a letter body and a journal
entry, all of which are behaviour the existing app owns, and the canvas draws no
letter for Veni. Changing the three arrival strings alone would leave the screen
contradicting its own letter. Logged as **D-098**, not changed.
