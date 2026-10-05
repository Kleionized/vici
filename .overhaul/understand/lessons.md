# Lessons — the 84 lesson readers (1,273 frames, 12 Week bundles) · analysis for the overhaul

Group `lessons`. Read-only analysis. Every number below is from a frame's own inline CSS
(`scripts/overhaul/decl.mjs` `parse()`), or measured in the design server (`localhost:8097`, Lato from the
app's TTFs, both weights forced loaded, **0 font warnings over 1,273 frames**). The scripts that produced
every table are in `.overhaul/understand/scratch-lessons/` and re-run in a few minutes:

| script | what it does | output |
|---|---|---|
| `tree.mjs` | frame → tree with the status bar / home indicator dropped; lesson enumerator | — |
| `classify.mjs` | classifies all 1,273 frames: chrome, content block, every child atom, page kind, signature; asserts the chrome | `frames.json`, `summary.txt` |
| `extract.mjs` | **prototype content generator**: builds the full content model from the frames, cross-checks it against the bundle's `gen/lessons-v3.json` + `gen/lesson-pool.json` | `lessons.model.json` |
| `gaps.mjs`, `heroes-check.mjs` | every vertical gap by (previous atom → atom); every hero box against `gen/hero-bounds.json` | stdout |
| `measure.mjs` | Chrome pass over all 1,273 frames: content extent, every text run's line breaks, natural height at 375/393/430 | `measure.json` |
| `measure-greedy.mjs`, `breaks.mjs` | the same with `text-wrap` forced to greedy; table of the runs where balance/pretty change the breaks | `measure-greedy.json`, `breaks.json` |
| `analyze-measure.mjs` | overflow at the canvas and on other devices | stdout |
| `inventory.mjs` | per-lesson page strip (appendix A) | `inventory.md` |

Design PNGs for all 1,273 frames are in `.overhaul/shots/design/Week-XX-…/L<n>-Frame-<k>.png`.

---

## 0 · The short version

1. **One grammar, zero exceptions.** All 1,273 frames decompose, with no residue, into the page grammar of the
   designer's own renderer `Vici Overhaul/project/gen/lesson-v3.js` (driven by `gen/build-v3.js`). The classifier
   found **0 anomalies**: every frame is one of 10 page kinds built from 13 atoms, and every vertical gap is one
   of the stated constants (§3). The chrome (X, header, rail, bottom control, noise) is byte-identical apart from
   `Lesson <n>` and the rail percent.
2. **Every lesson has the same skeleton:** `cover · opening quote · 3–4 Parts of reading pages · [question ·
   answer] · closing quote · Today’s task · task end (Done when + Finish lesson) · Lesson complete.` 52 lessons have
   no question, 18 have a question with a reflective answer page ("After choosing" + note field), 14 a question with
   a "Best answer(s)" page. 13–18 frames per lesson (13 ×3, 14 ×27, 15 ×23, 16 ×18, 17 ×11, 18 ×2).
3. **Progress** = `Math.round(k / N × 100)` % of the 345-wide track, k 1-based, N = the lesson's frame count —
   true on 1,273 of 1,273 (JS rounding: 2/16 → 13 %).
4. **Bottom control:** a 58pt ink pill on 316 frames (`Begin` ×84, `Continue` ×64, `Finish lesson` ×84,
   `Done` ×84), a 44pt outline ring (next) on the other 957. Never both.
5. **Overflow:** at 393×852 every page fits its 560pt band except three question pages: two "tall" pages
   (`L16 F11`, `L58 F12`, 579pt, band padding dropped to 0) and **one scrolling page, `L7 F11`** (9 options,
   630pt: stack top-aligned at 140 and a 150pt fade under the pill). No frame is a long scroll; the designer
   paginated everything. On a 375×667 phone **122 pages** are taller than the band (§6).
6. **Content:** the extraction prototype rebuilt all 84 lessons from the frames and they match
   `gen/lessons-v3.json` **exactly**: titles, both quotes, every section title, all 1,036 reading pieces in
   order, all 33 visualisation payloads, all 32 questions, options, feedback, every practice piece and every
   "Done when". The only drift: 2 mid-lesson illustrations differ from `gen/lesson-pool.json` (L52 F8, L68 F7 —
   frames win).
7. **Every one of the 84 titles changed**, the task changed completely (old: two boards of options per day at
   `/task/[day]`; new: two "Today’s task" pages inside the lesson ending in a "Done when" card), and questions went
   from 75 lessons (old pick boards) to 32.
8. **Visualisations are the only bespoke content:** 33 frames, each an instance of one of six parametric cards
   (`chain` 4, `compare` 14, `pairs` 11, `wave` 1, `track` 2, `bars` 1). All listed in §4.8.
9. **Illustrations:** 284 hero occurrences of 50 ids, every one byte-identical to its `Lesson-Illustrations-v4`
   card art (library's `heroes.mjs covers`: 284 matched, 0 unmatched). The same art is the Library week heroes.
   One shared Hero module (orchestrator), §5.
10. **The app today never records a completed lesson** (`useCompleteLesson` has had no caller since 10b951b), yet
    Today, Score, Morning, Night, Milestones, Weekly report, First steps and the Lessons medallion all count
    `lessonProgress.status === 'completed'`. `Finish lesson` should call `completeLesson` (§12, decision needed).
11. **Email-Login `Lesson Scroll 1–14` = `L1 Frame 1–14`** (raw HTML identical apart from the label), so the
    `lesson-scroll` group's 14 frames are a subset of this group's: one implementation, one owner.

---

## 1 · Sources

| thing | where |
|---|---|
| split frames | `.overhaul/final/Week-01-Reset/L1-Frame-1.html` … `Week-12-Leave-It-Behind/L84-Frame-14.html` (1,273) |
| design PNGs | `.overhaul/shots/design/<Week bundle>/L<n>-Frame-<k>.png` (all 1,273 present) |
| frame → hero id | each hero `<svg>` carries `data-hero="<id>"` (not printed by `body.mjs`; `parse()` keeps it in `attrs`) |
| canvas notes | none. Outside the frames each Week canvas has only pills: `Week I · Reset — Lesson 01 · Prepare for tonight · 14 frames` and `Lesson 1 · 3 of 14`. No sticky notes. |
| designer's generator | `gen/build-weeks.js` → `gen/build-v3.js('build')` → `gen/lesson-v3.js` (renderer, page grammar, `ST` type table, `VIZ`, `paginate()`), content from `gen/src-days.json` + `gen/v3-author.js` (section breaks/titles/visuals) + `lessons.json` (quotes only) + `gen/lesson-pool.json` (illustrations) + `gen/hero-bounds.json` (hero boxes) + `gen/lines-v3.json` (measured line counts) |
| Email-Login copies | `Lesson-Scroll-1…14.html` = `L1-Frame-1…14.html` |

---

## 2 · The reader chrome (all 1,273 frames)

Canvas coordinates; the app subtracts the 54pt status bar for top-anchored boxes (brief rule 1) and measures
bottom-anchored boxes off the frame's foot (rule 2).

| part | canvas CSS (verbatim) | resolves to (canvas) | app |
|---|---|---|---|
| root | `393×852; background:#0D0D0D; font-family:'Lato'`; `overflow:hidden` | | ground `mono.ground` |
| noise | `position:absolute; inset:0; background-image:url('noise-dark.png'); opacity:0.06; pointer-events:none` | | `assets/images/noise-dark.png` (md5-identical to the bundle's) at **0.06**, repeat at intrinsic size |
| close X | wrapper `position:absolute; left:22px; top:60px; height:40px; display:flex; align-items:center; z-index:5` → `<svg 18×18 viewBox 0 0 18 18><path d="M2 2l14 14M16 2L2 16" fill="none" stroke="#F2F0EC" stroke-width="2" stroke-linecap="round">` | glyph box x 22–40, y 71–89 | wrapper top 6; keep a hit slop; `accessibilityLabel="Close"` |
| header label (every frame **except Frame 1**) | `position:absolute; left:0; right:0; top:60px; height:40px; display:flex; align-items:center; justify-content:center; z-index:4` → `<div width:100%; white-space:nowrap; font-size:13px; font-weight:700; color:#9B968E; text-align:center>Lesson <n></div>` | | **no line-height, no letter-spacing** (unlike the cover's `Lesson n`, which is 13/16 +0.2) — normal leading, centred in the 40 box |
| progress track | `position:absolute; left:24px; right:24px; top:108px; height:3px; border-radius:2px; background:#2E2E2E` | x 24–369 (345), y 108–111 | top 54 |
| progress fill | `width:<p>%; height:3px; border-radius:2px; background:#F2F0EC`, p = `Math.round(k/N*100)` | | keep the existing `LinearTransition` (320 ms, off under reduced motion) |
| content band | `position:absolute; left:32px; right:32px; top:140px; bottom:128px; padding-bottom:24px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:center` + `text-align:center` on cover / quote / complete | band 140–724 (584); with the 24 lift the stack centres in 140–700 (560), centre line y 420 | top 86, bottom 128, `paddingBottom 24`, `justifyContent:'center'`. Variants: §2.1 |
| next ring (957 frames) | `position:absolute; left:0; right:0; bottom:52px; display:flex; justify-content:center` → `44×44; border-radius:22px; box-shadow:0 0 0 1.5px #2E2E2E` (spread ring **outside**, transparent inside) → `<svg 14×14 viewBox 0 0 14 14><path d="M5 2l5 5-5 5" fill="none" stroke="#F2F0EC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` | ring x 174.5–218.5, y 756–800 | bottom 52; `accessibilityLabel="Next"` |
| primary pill (316 frames) | `position:absolute; left:24px; right:24px; bottom:48px; height:58px; border-radius:29px; background:#F2F0EC; …; z-index:6` → `<span font-size:16px; font-weight:700; letter-spacing:0.1px; white-space:nowrap; color:#111111>` | x 24–369, y 746–804 | bottom 48; label has **no line-height** (normal) |
| fade (1 frame, `L7 F11`) | `position:absolute; left:0; right:0; bottom:0; height:150px; background:linear-gradient(rgba(13,13,13,0), #0D0D0D 40%); z-index:5; pointer-events:none` | y 702–852, solid from 762 | `LinearGradient` or an SVG gradient, under the pill (z 5 < 6) |

Status bar: the reader must draw **light** glyphs (the current `<StatusBar style="dark">` in the route is wrong
on the dark ground). No tab bar on any reader frame (the route is outside `(app)`, keep it so).

### 2.1 Band modes — the only overflow treatment the canvas draws

| mode | CSS | frames | rule (the generator's) |
|---|---|---|---|
| centre | `padding-bottom:24px; justify-content:center` | 1,270 | content ≤ 560 |
| tall | `padding-bottom:0px; justify-content:center` | `L16 F11`, `L58 F12` (both 579 → top 142.5) | 560 < content ≤ 584 |
| scroll | `padding-bottom:0px; justify-content:flex-start` + the fade | `L7 F11` (630, content 140–770) | content > 584 |

The content runs **past the band's foot under the fade and the pill** (it is not clipped at 724). In the app:
measure the stack (`onLayout`) and pick the mode at runtime with exactly these thresholds against the real band
height (`screenH − (insetTop + 86) − 128`). Scroll mode = a `ScrollView` whose viewport starts at the band top and
runs to the **screen bottom** (so at scroll 0 it draws exactly what `L7 F11` draws), `contentContainerStyle`
`paddingBottom` ≥ 150 so the last row can be scrolled clear of the pill, plus the fade. This one rule reproduces
the three canvas frames and handles every small phone (§6).

### 2.2 Interaction (none of it is drawn; from the current reader, keep it)

* Ring and pill are real buttons calling `next()`. Reading pages also advance on a tap anywhere (the current
  `PressScale` over the band, `static`, `accessibilityLabel="Next"`); a drag scrolls instead.
* Question pages: option rows own their taps; only the pill advances (no tap-anywhere there).
* Per-page `FadeIn` 220 ms, bezier(0.2,0,0,1), keyed on the index; off under `useReducedMotion()`.
* No back-a-page control is drawn (the old reader had none either). Stack back gesture / Android back closes.

---

## 3 · Page templates — taxonomy and exact CSS

### 3.1 Counts

| kind (code) | frames | signatures (atoms top→bottom) | bottom |
|---|---|---|---|
| cover `C` | 84 | hero · label · display | pill **Begin** |
| quote `Q` | 168 (84 opening + 84 closing) | quoteGlyph · title · label | ring |
| section `S` | 263 | label·title·body (154) · label·title·body·body (71) · hero·label·title·body[·body] (22+1) · viz·label·title·body[·body] (15) | ring |
| continuation `c` | 442 | body·body (225) · body (97) · hero·body (82) · hero·body·body (20) · viz·body[·body] (18) | ring |
| question `?` | 32 | label·title·small·options | pill **Continue** |
| answer — best `A` | 14 | label·bestCards·body | pill **Continue** |
| answer — reflect `R` | 18 | label·title·body·noteField | pill **Continue** |
| task first `T` | 84 | hero·label·title·body (68) · hero·label·title·body·body (7) · label·title·body·body (9) | ring |
| task end `E` | 84 | body·done (81) · body·body·done (3: L1 F13, L20 F15, L35 F16) | pill **Finish lesson** |
| complete `D` | 84 | checkCircle·display·body | pill **Done** |

Heroes inside a lesson: cover 84 + section 23 + continuation 102 + task-first 75 = **284**. Visualisations: 33.
Parts per lesson: 3 (73 lessons) or 4 (11). Reading pages carry 1 body piece (374) or 2 (331).

### 3.2 Type ramps (`lesson-v3.js ST`, verified on every run)

All Lato, weight = family (`sans('400')`/`sans('700')`); no 900, no italic anywhere in the 12 bundles.

| ramp | size/line | weight | tracking | colour | `text-wrap` | used for |
|---|---|---|---|---|---|---|
| display | 30/36 | 700 | −0.6 | `#F2F0EC` | balance | cover title, `Lesson complete.` (centred) |
| title | 24/31 | 700 | −0.4 | `#F2F0EC` | balance | Part title, quote text (centred), question prompt, reflect lead, task title |
| body | 18/28 | 400 | 0 | `#B5B0A8` | pretty | every paragraph piece; complete line (centred) |
| small | 15/22 | 400 | 0 | `#9B968E` | pretty | question instruction |
| label | 13/16 | 700 | +0.2 | `#9B968E` | balance | `Lesson n` (cover, centred), `Part n`, quote attribution (centred), `Question`, `Best answer(s)`, `After choosing`, `Today’s task`, `Done when`, viz captions |
| cardT | 16/22 | 700 | 0 | `#F2F0EC` | pretty | the Done-when sentence |
| optQ | 16/22 | 400 | 0 | `#F2F0EC` | pretty | option label |
| fbT | 16/22 | 700 | 0 | `#F2F0EC` | pretty | best-answer card text |
| chainT | 15/22 | 400 | 0 | `#F2F0EC` | pretty | chain step |
| cmpL / cmpT | 13/16 700 +0.2 `#9B968E` balance / 15/22 400 `#F2F0EC` pretty | | | | | compare card label / text |
| pairL / pairR | 15/22 700 `#F2F0EC` pretty / 15/22 400 `#B5B0A8` pretty | | | | | pairs left / right |
| vcap | 15/22 | 400 | 0 | `#B5B0A8` | pretty | wave caption |

Counts measured: body 1,339 runs (84 centred), title 565, label 796, display 168.

### 3.3 Vertical grammar — every gap is a stated `margin-top` (no flex gap anywhere in the band)

Measured over all 1,273 frames (`gaps.mjs`), no exceptions:

| previous → next | margin-top |
|---|---|
| (first child) → anything | 0 (not stated) |
| hero → label / body | **36** |
| viz → label / body | **28** |
| label → title | **12** |
| title → body (and answer cards → body) | **28** |
| body → body | **22** |
| body → Done-when card | **28** |
| quote glyph → quote text | **24** |
| quote text → attribution | **18** |
| check disc → `Lesson complete.` | **36** |
| `Lesson complete.` → line | **14** |
| title → question instruction | **8** |
| instruction → options | **20** (3–7 options) / **16** (8–9 options) |
| `Best answer(s)` label → cards wrapper | **16**; card → card **10** |
| reflect body → note field | **32** |

Flex margins never collapse (CSS flexbox), so Yoga reproduces these 1:1 (no D023 trap here).

### 3.4 Cover `C` (84) — e.g. `L1 F1`

```
band (text-align:center)
├ hero box   position:relative; width:393px; height:<h>; margin:0 -32px; flex-shrink:0      (§5)
├ label      margin-top:36px; 13/16 700 +0.2 #9B968E balance center   "Lesson <n>"
└ display    margin-top:12px; 30/36 700 −0.6 #F2F0EC balance center   <lesson title>
primary "Begin"
```
No header label on this frame. `L1 F1`: stack 282–558 (hero 282–458, label 494, title 522). Titles wrap to 2 lines
on 63 covers, 1 line on 21. Content heights 215–357.

### 3.5 Quote `Q` (168) — e.g. `L1 F2`

```
band (text-align:center)
├ glyph   display:flex; justify-content:center → <svg 28×22 viewBox 0 0 28 22><path d="M2 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H2zM16 12c0-6 4-10 10-10v4c-3 0-5 2-5 5h5v9H16z" fill="#5A574F">
├ text    margin-top:24px; title ramp, center
└ by      margin-top:18px; label ramp, center
ring
```
Always exactly 2 per lesson: Frame 2 (opening) and the frame before `Today’s task` (closing). Every quote has an
attribution. Quote text runs 1–5 lines (1: 23, 2: 77, 3: 56, 4: 10, 5: 2). 13 quote texts repeat across lessons.

### 3.6 Section `S` (263) and continuation `c` (442) — the reading pages

```
band (left-aligned)
├ [hero box | viz]                 optional lead, never both (§4, §5)
├ label "Part <n>"                 section only; margin-top 36 after hero / 28 after viz / 0 first
├ title <section title>            section only; margin-top 12
├ body …                           margin-top 28 after title, 36 after hero, 28 after viz, 0 first; 22 between
ring
```
Reading pages are **left-aligned** (the old reader centred everything). The Part number restarts per lesson; a
continuation page carries no label at all.

### 3.7 Question `?` (32) — e.g. `L2 F11` (multi), `L10 F11` (single), `L7 F11` (scroll)

```
band
├ label "Question"
├ title <prompt>                         margin-top 12
├ small <instruction>                    margin-top 8
└ list  display:flex; flex-direction:column; gap:<G>; margin-top:<M>
   └ row  min-height:<H>; border-radius:<H/2>; background:#1E1E1E; display:flex; align-items:center; gap:12px;
          padding:<P>px 16px <P>px 14px; box-sizing:border-box
      ├ mark  24×24; border-radius:<12 single | 7 multi>; box-shadow:inset 0 0 0 1.5px #9B968E; centred;
      │       font-size:12px; font-weight:700; line-height:16px; color:#B5B0A8      "<A…I>"
      └ text  flex:1; min-width:0; optQ ramp (16/22 400 #F2F0EC pretty)
primary "Continue"
```

| density | options | H | P | G | M | frames |
|---|---|---|---|---|---|---|
| regular | 3–6 | 48 | 13 | 8 | 20 | 25 |
| seven | 7 | 44 | 11 | 6 | 20 | 4 (L30, L46, L79, L81) |
| eight | 8–9 | 44 | 11 | 5 | 16 | 3 (L7 ×9 → scroll; L16, L58 ×8 → tall) |

A 2-line option grows past `min-height` (22×2 + 26 = 70). Single-choice: 22 lessons, mark radius 12. Multi: 10,
radius 7. Every question page in the canvas is drawn **with nothing selected** (§13.1). All 32 are listed in
appendix C.

### 3.8 Answer — best `A` (14) — e.g. `L10 F12`, `L44 F13` (two)

```
band
├ label "Best answer" | "Best answers" (2 best: L44, L80)
├ wrapper margin-top:16px
│  └ card  [margin-top:10px if not first]; border-radius:18px; background:#1E1E1E; padding:16px 18px;
│          display:flex; gap:14px; align-items:flex-start
│     ├ mark 28×28; border-radius:<14 single | 8 multi>; background:#F2F0EC; centred; font-size:13px;
│     │      font-weight:700 (no line-height); color:#111111     "<letter>"
│     └ col  flex:1; min-width:0; padding-top:3px → fbT ramp (16/22 700 #F2F0EC pretty)
└ body   margin-top:28px (always exactly 1 piece)
primary "Continue"
```
The page shows the **designated** best answer, not the user's choice.

### 3.9 Answer — reflect `R` (18) — e.g. `L2 F12`, `L7 F12`

```
band
├ label "After choosing"
├ title <lead>                 margin-top 12
├ body  (always 1 piece)       margin-top 28
└ note  margin-top:32px; height:48px; border-radius:24px; box-shadow:inset 0 0 0 1.5px #2E2E2E; display:flex;
        align-items:center; gap:12px; padding:0 20px; flex-shrink:0
   ├ <svg 16×16 viewBox 0 0 16 16 style="flex-shrink:0"><path d="M3 13l1-3.5L10.5 3l2.5 2.5L6.5 12z" fill="none" stroke="#9B968E" stroke-width="1.6" stroke-linejoin="round">
   └ flex:1; min-width:0; font-size:16px; line-height:22px; color:#9B968E; white-space:nowrap   "Add a note (optional)"
primary "Continue"
```
(font-weight unstated → 400.)

### 3.10 Task first `T` (84) — e.g. `L2 F14` (with hero), `L1 F12` (without)

```
band
├ [hero box]                       the cover's hero again (75 of 84; omitted when it does not fit)
├ label "Today’s task"             margin-top 36 after hero, else 0
├ title <lesson title>             margin-top 12 — equals the cover title on 84/84
└ body …                           28, then 22
ring
```

### 3.11 Task end `E` (84) — e.g. `L1 F13`, `L2 F15`

```
band
├ body …                           0, then 22
└ done  margin-top:28px; border-radius:20px; background:#1E1E1E; padding:18px 20px; box-sizing:border-box;
        display:flex; gap:14px; align-items:flex-start; flex-shrink:0
   ├ disc 28×28; border-radius:14px; background:#F2F0EC; centred → <svg 12×12 viewBox 0 0 14 14><path d="M2 7.5l3.2 3L12 3.5" fill="none" stroke="#111111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
   └ col  flex:1; min-width:0; display:flex; flex-direction:column; gap:4px
      ├ label "Done when"
      └ cardT <done sentence>
primary "Finish lesson"
```
Practice pieces split 1+1 (67 lessons), 2+1 (14), 2+2 (2), 1+2 (1).

### 3.12 Complete `D` (84) — e.g. `L1 F14`

```
band (text-align:center)
├ display:flex; justify-content:center → disc 96×96; border-radius:48px; background:#F2F0EC; centred
│     → <svg 34×34 viewBox 0 0 14 14> same check path, stroke #111111 2.2 (scales to ≈5.3 drawn)
├ display "Lesson complete."                                     margin-top 36, center
└ body    margin-top 14, center:
          52 lessons  "One thing left today — the task."
          32 lessons  "Your answers are saved to the log. One thing left today — the task."   (lessons with a question)
primary "Done"
```
Progress 100 %. `L1 F14`: disc 315–411, title 447, line 497.

---

## 4 · Visualisations — six parametric cards, 33 bespoke instances

A visualisation always **leads** its page (`flex-shrink:0` wrapper, margin-top 0) and is followed at 28 by
`Part n` (section, 15) or a body piece (continuation, 18). Never two on a page, never with a hero. Inner width of
a card = band 329 − 2×20 = **289** (compare cards: (329 − 10)/2 − 32 = 127.5).

### 4.1 `chain` (4: L1 F5, L9 F7, L28 F3, L40 F6)
```
card  border-radius:20px; background:#1E1E1E; padding:20px; box-sizing:border-box
├ [cap]  label ramp
└ list   [margin-top:14px if cap]; display:flex; flex-direction:column
   └ step  display:flex; gap:14px
      ├ rail  width:12px; flex-shrink:0; display:flex; flex-direction:column; align-items:center
      │  ├ dot   margin-top:5px; 12×12; border-radius:6px; box-sizing:border-box; flex-shrink:0;
      │  │       marked: background:#F2F0EC   |   else: border:2px solid #9B968E
      │  └ line  (not on last) flex:1; width:2px; margin-top:5px; background:#5A574F
      └ col   flex:1; min-width:0; padding-bottom:<16 | 0 on last>
         ├ chainT step text
         └ [marked step only] margin-top:8px; display:flex → tag: height:24px; padding:0 10px; border-radius:12px;
              background:#F2F0EC; display:flex; align-items:center; 13/16 700 #111111; white-space:nowrap
```
The connector is `flex:1` — it stretches to the row height, which the text column sets. In RN: the rail column
`alignSelf:'stretch'`, line `flex:1`.

### 4.2 `compare` (14)
```
row   display:flex; gap:10px; align-items:stretch
└ card ×2  flex:1 1 0; min-width:0; border-radius:18px; background:#1E1E1E; padding:16px; box-sizing:border-box
           [highlighted: box-shadow:inset 0 0 0 1.5px #F2F0EC]
   ├ cmpL label
   ├ [value] margin-top:8px; 24/31 700 −0.4 #F2F0EC; white-space:nowrap        (L8: "2 weeks"; L10: "+1 hour" / "20 min")
   └ cmpT  margin-top:8px
```

### 4.3 `pairs` (11) — three variants
```
card  border-radius:20px; background:#1E1E1E; padding:6px 20px; box-sizing:border-box
├ [head] display:flex; gap:16px; padding:12px 0 10px → left width:WL; flex-shrink:0 (label) · right flex:1; min-width:0 (label)
└ row    display:flex; gap:16px; padding:14px 0; [border-top:1px solid #2E2E2E unless first row with no head]
         [letters: align-items:center]
   ├ left  width:WL; flex-shrink:0
   └ right flex:1; min-width:0 → 15/22 400 #B5B0A8 pretty
```
| variant | WL | left cell | frames |
|---|---|---|---|
| wide | 112 | `pairL` 15/22 700 #F2F0EC pretty | 9 (head on 8; L14 F10 has none) |
| narrow | 44 | 15/22 700 #F2F0EC (no wrap stated) — "If" / "Then" | L23 F4 |
| letters | 64 | letter 24/31 700 #F2F0EC (no tracking) + word margin-top:2px 13/16 700 +0.2 #9B968E nowrap | L19 F4 (H Hungry · A Angry · L Lonely · T Tired) |

### 4.4 `wave` (1: L15 F5)
```
card  r20 #1E1E1E padding 20
├ box position:relative; height:144px
│  ├ tag   position:absolute; left:28px; top:0; (the chain tag's pill)          "Close, move, begin"
│  ├ "Urge" position:absolute; right:0; top:4px; label ramp (no wrap)
│  ├ <svg 289×96 viewBox 0 0 289 96 position:absolute; left:0; top:32px; overflow:visible>
│  │    <path d="M0 84 C28 82 52 14 96 10 C134 7 150 56 182 60 C206 63 214 38 236 40 C258 42 270 70 289 76 L289 88 L0 88 Z" fill="#5A574F" fill-opacity="0.35"/>
│  │    <path d="M0 88 H289" stroke="#5A574F" stroke-width="1.5"/>
│  │    <path d="M0 84 C28 82 … 289 76" fill="none" stroke="#F2F0EC" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
│  │    <path d="M40 -8 V88" stroke="#F2F0EC" stroke-width="1.5" stroke-dasharray="3 4"/>
│  │    <circle cx="40" cy="50" r="6" fill="#F2F0EC" stroke="#1E1E1E" stroke-width="3"/>
│  └ "Time" position:absolute; right:0; top:128px; label ramp
└ caption margin-top:16px; vcap ramp
```
The SVG is fixed at 289 wide; on a narrower phone the card's inner width is smaller (271 at 375) — scale the
SVG to the inner width (same viewBox) rather than letting it run into the padding.

### 4.5 `track` (2: L35 F5, L75 F8)
```
card r20 #1E1E1E padding 20
├ cap label
└ box position:relative; height:38px; margin-top:18px
   ├ line  position:absolute; left:cx0; right:cx0; top:5px; height:2px; background:#5A574F
   ├ dot i position:absolute; left:cx(i)−6; top:0; 12×12; r6; border-box;
   │        i=0: background:#F2F0EC | else background:#1E1E1E; border:2px solid #9B968E
   └ lbl i position:absolute; top:22px; left:cw·i; width:cw; text-align:center; 13/16 700 +0.2; nowrap;
            color i=0 #F2F0EC else #9B968E
```
cw = 289/n, cx(i) = round1(cw·i + cw/2): n = 5 → cw 57.8, cx 28.9 / 86.7 / 144.5 / 202.3 / 260.1 (the frame
prints `254.10000000000002px` for the last dot's left: transcribe 254.1). Compute from the measured inner width
on other phones.

### 4.6 `bars` (1: L41 F4)
```
card r20 #1E1E1E padding 20
├ cap label "Got vaccinated"
└ list margin-top:16px; display:flex; flex-direction:column; gap:16px
   └ row
      ├ display:flex; justify-content:space-between; gap:12px; font-size:15px; line-height:22px; color:#F2F0EC
      │    <span 400 nowrap>label</span><span 700 nowrap>value</span>
      └ margin-top:8px; height:8px; border-radius:4px; background:#2E2E2E
           └ width:<pct>%; height:8px; border-radius:4px; background:<last row #F2F0EC | else #9B968E>
```
Data: Control group 33.1 % "33.1%"; Wrote a date and time **37.3 %** wide, labelled "about 37%" (the width and the
label are separate fields).

### 4.7 Hero lead — see §5. Mid-lesson heroes are not bespoke: 125 reading pages + 75 task pages reuse the shared art.

### 4.8 Every bespoke frame (port individually as data, render with the six components)

| frame | page | viz | variant / payload | follows |
|---|---|---|---|---|
| L1 F5 | section | chain | cap “A familiar evening”, 3 steps, mark 0 + tag “Change this part” | Part 2 “An earlier moment” + 1 body |
| L2 F4 | cont | pairs | wide, head “What you use” / “What to change”, 3 rows | 1 body |
| L6 F4 | cont | compare | 2 cards “What people predicted” / “What commuters reported”, ring on card 1 | 1 body |
| L8 F4 | cont | compare | 2 cards “Person A” / “Person B”, values 2 weeks / 2 weeks | 2 body |
| L9 F7 | cont | chain | cap “After a late-night slip”, 4 steps, no mark/tag | 1 body |
| L10 F5 | cont | compare | 2 cards “Keep searching” / “Close it now”, values +1 hour / 20 min, ring on card 1 | 2 body |
| L11 F5 | section | pairs | wide, head “What happens” / “What it needs”, 2 rows | Part 2 “Different problems” + 1 body |
| L12 F3 | section | compare | 2 cards “Describes something you do” / “Claims to be everything you are”, ring on card 0 | Part 1 “Something you do” + 2 body |
| L13 F6 | section | compare | 2 cards “Clear” / “Less clear”, ring on card 0 | Part 2 “Words you’d recognise” + 2 body |
| L14 F10 | section | pairs | wide, no head, 3 rows | Part 3 “Three answers” + 1 body |
| L15 F5 | section | wave | tag “Close, move, begin”, caption “You can act before the urge fades. It may come with you for a while.” | Part 2 “You don’t have to wait” + 1 body |
| L16 F5 | section | pairs | wide, head “What you notice” / “What fits”, 3 rows | Part 2 “An action that fits” + 1 body |
| L18 F5 | section | compare | 2 cards “Tuesday” / “Thursday” | Part 2 “When the beginning isn’t ready” + 1 body |
| L19 F4 | cont | pairs | letters, no head, 4 rows | 1 body |
| L20 F4 | cont | compare | 2 cards “Reported urges” / “Cigarettes over the next week” | 2 body |
| L22 F7 | cont | compare | 2 cards “At first” / “Half an hour later” | 2 body |
| L23 F4 | cont | pairs | narrow, no head, 2 rows | 1 body |
| L26 F4 | cont | compare | 2 cards “Near misses felt” / “Yet they could” | 2 body |
| L28 F3 | section | chain | no cap, 4 steps, mark 2 + tag “An earlier point to act” | Part 1 “Where the habit begins” + 1 body |
| L29 F6 | cont | compare | 2 cards “What it gave” / “What it cost” | 1 body |
| L31 F7 | cont | compare | 2 cards “Leaves a worry waiting” / “Gives you a start”, ring on card 1 | 2 body |
| L35 F5 | section | track | cap “Activity check-ins”, nodes Today · Day 42 · Day 49 · Day 56 · Day 63 | Part 2 “Four chances” + 2 body |
| L38 F8 | cont | compare | 2 cards “Connected to the problem” / “Not connected”, ring on card 0 | 2 body |
| L39 F4 | cont | pairs | wide, head “If you…” / “Work on”, 3 rows | 1 body |
| L40 F6 | section | chain | no cap, 4 steps, mark 0 + tag “The thought can stay” | Part 2 “Name it, then act” + 1 body |
| L41 F4 | cont | bars | cap “Got vaccinated”, Control group 33.1% (“33.1%”); Wrote a date and time 37.3% (“about 37%”) | 2 body |
| L42 F6 | section | compare | 2 cards “Usual plan” / “Late-shift version”, ring on card 1 | Part 2 “A deliberate adjustment” + 2 body |
| L45 F5 | cont | pairs | wide, head “Usual plan” / “Smaller version”, 3 rows | 1 body |
| L58 F5 | section | pairs | wide, head “If you…” / “Try”, 3 rows | Part 2 “A step that fits” + 1 body |
| L66 F3 | section | compare | 2 cards “Names an event” / “Claims the whole person”, ring on card 0 | Part 1 “Criticism or insult” + 1 body |
| L72 F5 | cont | pairs | wide, head “Already settled” / “Still within reach”, 2 rows | 2 body |
| L75 F8 | section | track | cap “Reviews”, nodes Today · 2 weeks · 30 days · 60 days · 90 days | Part 3 “Reviews, not deadlines” + 2 body |
| L80 F4 | cont | pairs | wide, head “What changes” / “Work out”, 3 rows | 1 body |

---

## 5 · Heroes (cover, mid-lesson, task) — geometry and the RN transform

### 5.1 What the frame states
```
hero box   position:relative; width:393px; height:<h>px; margin:0 -32px; flex-shrink:0
└ <svg data-hero="<id>" width="393" height="240" viewBox="0 0 393 240"
       style="position:absolute; left:0; top:<T>px; overflow:visible; transform:scale(1.1); transform-origin:196px 190px">
     …the Lesson-Illustrations-v4 card's current art, verbatim (incl. its own inner <g transform=…>)…
```
* `h` and `T` are a **pure function of the illustration id** (one value per id across all 284 uses; table in
  appendix B). They come from `gen/hero-bounds.json [top, bottom, left, right]` through the generator's
  `heroFit`: `st = floor(190 + (top − 190)·1.1)`, `sb = ceil(190 + (bottom − 190)·1.1)`, `h = sb − st`, `T = −st`.
  All 284 boxes check out. So the box hugs the scaled art's vertical bounds.
* `medal` (L81 F10) is the one exception in transform: `scale(1)` — but its box still uses the 1.1 formula
  (h 196, T −20).
* The box is 393 wide with −32 margins: at 393 it spans the frame edge to edge (x 0–393); full-bleed art
  (sunrise: user x −40…432 → drawn −63.6…455.6) is clipped by the frame.

### 5.2 Exact mapping and its react-native-svg form
CSS `transform: scale(1.1)` about `(196, 190)` of the SVG box, box placed at `(0, T)` inside the hero box:

  **user (x, y) → hero-box (1.1·x − 19.6, T + 1.1·y − 19)** = `matrix(1.1 0 0 1.1 −19.6 T−19)`.

Check: `L1 F1` hero box top 282, T −36, shelf `y=188` → 282 − 36 + 206.8 − 19 = **433.8** (PNG: 434).

RN (do **not** put a transform/rotation on `<Svg>`; brief SVG traps):
```tsx
// W = screen width; P = vertical bleed pad (strokes/stars poke past the measured bounds), e.g. 24
<View style={{ height: h, marginHorizontal: -32, width: W }}>
  <Svg
    style={{ position: 'absolute', left: 0, top: -P }}             // absolute: it has absolutely-positioned siblings on web
    width={W} height={h + 2 * P}
    viewBox={`${-(W - 393) / 2} ${-P} ${W} ${h + 2 * P}`}>          // centres the 393 art on any width
    <G transform={`translate(-19.6 ${T - 19}) scale(1.1)`}>{art}</G>  // medal: `translate(0 ${T})`
  </Svg>
</View>
```
At W = 393 this is pixel-identical to the frame; on 375/430 the art stays centred and full-bleed art still
reaches both edges. Inner `<g transform="rotate(a cx cy)">`, `translate(…)` etc. inside the art are kept as SVG
transform strings (react-native-svg parses them).

### 5.3 Shared with the Library and the Lesson-Illustrations-v4 bundle
* **Same art, same scale, same origin.** All 284 lesson heroes are byte-identical (element by element) to the
  *first* 393×240 svg of a `Lesson-Illustrations-v4` card (`scratch-library/heroes.mjs covers`: 284 `LIB:`, 0
  `BEFORE:`, 0 unmatched). The Library's 12 week heroes are the same art with a different placement (absolute
  `top:T_week`, library.md §3.3). Lessons use 50 of the 53 cards (not `balloon`, `bell`, `fountainPen`).
* Therefore one shared module (library.md §7.3, orchestrator): `src/content/heroes.ts` generated from
  `.overhaul/final/Lesson-Illustrations-v4/*.html` (first svg per card) + `src/components/mono/Hero.tsx`. The
  lesson reader only adds the box wrapper above with `HERO_BOX[id] = {h, T}` (appendix B, or computed from
  `hero-bounds.json`).
* **`paint-order="stroke"`** sits on 22 elements in 17 of the cards (in lessons: bed, scale, books, calendar, tab,
  campfire, clipboard, feedOff, hourglass, kettle, match, openDoor, envelopeOpen, charger, chartUp, thunderCloud,
  medal); react-native-svg ignores it — emit the element twice (stroke+fill, then fill only), library.md §7.4.
  `body.mjs` does not print `paint-order` or `data-hero`.
* The cover hero repeats on the task-first page (75/84). Mid-lesson ids follow `gen/lesson-pool.json [n][1..2]`
  except **L52 F8 = hourglass** (pool: lighthouse) and **L68 F7 = twoCups** (pool: umbrella) — frames win; the
  generator must read the frame's `data-hero`, not the pool.

---

## 6 · Long pages, overflow and other phone sizes (measured)

Content-stack heights at 393 (min / median / max): cover 215/296/357 · quote 111/142/235 · section 171/255/523 ·
continuation 84/218/476 · task first 277/423/517 · task end 206/284/362 · complete 210/210/238 · question
366/462/630 · reflect 254/282/316 · best 195/223/312.

Band available = `screenH − (insetTop + 86) − 128 − 24`:

| device | band | pages taller than band | by kind |
|---|---|---|---|
| 375×667 (inset 20) | 409 | **122** | task first 56, section 24, question 21, continuation 21 |
| 390×844 (inset 47) | 559 | 1 | `L7 F11` |
| 393×852 canvas (54) | 560 | 1 (+2 tall) | `L7 F11` |
| 430×932 (59) | 635 | 0 | — |

(Natural heights measured with the frame widened/narrowed to 375 and 430 in Chrome, `measure.json → natural`.)
So the runtime band-mode rule of §2.1 is required, not optional: on an SE the scroll+fade treatment is the
canvas's own answer for a page that does not fit. The fade must not swallow taps (pointer-events none), and the
pill/ring sit above it.

Header `Lesson 84` is nowrap and fits; the longest title wraps to 2 lines at 329. Compare cards at 375 are 150.5
wide; pairs' fixed left columns (112/64/44) still fit.

---

## 7 · Line breaks (`text-wrap: balance / pretty`) — measured, all 3,486 runs

Re-measuring every frame with `text-wrap` forced to greedy (`measure-greedy.mjs`): **527 runs in 477 frames break
differently** from the frame (24px titles 181 of 565, display 50/168, body 230/1,339, the 16px runs —
optQ/fbT/cardT — 45/259, the 15px runs — instruction and viz text — 16/132, 13px labels 5/796). Only **one** changes its line count: the task title of **`L68 F14`** "Check your response / to
self-criticism" (2 lines balanced, 1 line greedy → 31pt). `gen/lines-v3.json` (the designer's measured line
counts) agrees with Chrome on 1,821/1,821 comparable runs.

* **Web:** state the frame's own `textWrap` on every run (`balance` on display/title/label/cmpL, `pretty` on
  body/small/optQ/fbT/cardT/chainT/cmpT/pair/vcap, `nowrap` where stated) under the `Platform.OS === 'web'` guard
  (D052). `AppText`'s web default (`pretty` everywhere) is wrong for label/title runs that say `balance` — pass it
  explicitly. With that, a web capture breaks exactly like the frame.
* **Native** has no `text-wrap`. Options: (a) accept greedy (one-word differences on 477 frames, one 31pt shift on
  L68 F14); (b) **recommended**: the generator emits Chrome's breaks for those 527 runs as a
  `BREAKS: Record<'<ramp>|<text>', string[]>` table (from `breaks.json`, keyed like `lines-v3.json`), and the
  text component joins them with `\n` **only on native and only when the run's laid-out width equals the canvas
  width** (329 band / 263 option / 247 done / 251 best / 289 viz…, i.e. a 393-wide screen at font scale 1), else
  falls back to plain wrapping. This is BRIEF rule 6's "explicit break only when the copy is fixed", scoped to the
  width the breaks were measured at. Needs a D2xx decision.

---

## 8 · Content model and the extraction prototype

### 8.1 Proposed generated file `src/content/lessons.ts` (GENERATED by `scripts/overhaul/gen-lessons.mjs`)
```ts
export type HeroId = 'battery' | 'bed' | … ;               // the 50 ids lessons use (appendix B)
export type LessonViz =
  | { type: 'chain'; cap?: string; steps: string[]; mark?: number; tag?: string }
  | { type: 'compare'; items: { l: string; v?: string; t: string }[]; hi?: number }
  | { type: 'pairs'; variant: 'wide' | 'narrow' | 'letters'; head?: [string, string]; rows: [string, string][] }
  | { type: 'wave'; tag: string; cap: string }
  | { type: 'track'; cap?: string; nodes: string[] }
  | { type: 'bars'; cap?: string; rows: { label: string; value: string; pct: number }[] };
export interface LessonOption { L: string; t: string }
export type LessonPage =
  | { k: 'cover' }
  | { k: 'quote'; which: 'open' | 'close'; text: string; by: string }
  | { k: 'read'; part?: { n: number; title: string }; hero?: HeroId; viz?: LessonViz; body: string[] }
  | { k: 'question'; prompt: string; instr: string; multi: boolean; exclusive?: string[]; options: LessonOption[]; density: 'regular' | 'seven' | 'eight' }
  | { k: 'answer'; multi: boolean; best: LessonOption[]; body: string[] }
  | { k: 'reflect'; lead: string; body: string[] }
  | { k: 'task'; hero?: HeroId; body: string[] }            // title = lesson title (84/84)
  | { k: 'taskEnd'; body: string[]; done: string }
  | { k: 'complete'; line: string };
export interface LessonContent { n: number; week: number; title: string; hero: HeroId; pages: LessonPage[] }
export const LESSONS: Record<number, LessonContent>;          // 1..84, pages = frames 1:1
export const HERO_BOX: Record<HeroId, { h: number; top: number; scale: 1.1 | 1 }>;
export const BREAKS: Record<string, string[]>;                // §7 (b)
```
* Pages are the frames **1:1** (do not re-paginate in the app; `paginate()` is a cost-minimising DP over measured
  line counts).
* `exclusive`: parsed from the instruction "Choose F alone if it fits." / "Choose E or F alone if it fits." —
  8 of the 10 multi-choice questions: L2 F, L16 H, L19 E+F, L30 G, L46 G, L58 G+H, L79 F, L81 G (7 distinct
  instruction strings in all: `Choose one.`, `Choose all that fit.`, and five "… Choose X [or Y] alone if it
  fits."). Selecting an exclusive letter clears the others and vice versa.
* Fixed copy stays in the components: `Begin`, `Continue`, `Finish lesson`, `Done`, `Lesson <n>`, `Part <n>`,
  `Question`, `Best answer`/`Best answers`, `After choosing`, `Add a note (optional)`, `Today’s task`, `Done when`,
  `Lesson complete.`. All strings use `’` (958 curly apostrophes, 0 straight; no HTML entities in any lesson frame).

### 8.2 The prototype (`scratch-lessons/classify.mjs` + `extract.mjs`) — results
* 84 lessons, 1,273 pages, 0 classification anomalies.
* Cross-check against `gen/lessons-v3.json`: **84/84 identical** in title, week, opening/closing quote (text + by),
  section titles, the ordered list of 1,036 reading pieces with the 33 visual positions, every visual payload
  (chain mark/tag/cap, compare labels/values/highlight, pairs head/rows, wave, track nodes, bars pct/value), all
  32 questions (prompt, instruction, multi, options) and feedback (best letters + text, or lead + items), all
  practice pieces (task first + task end, in order), all `doneWhen`, and the complete-page line (question ⇒ the
  "Your answers are saved to the log." variant). Cover hero = `lesson-pool[n][0]` 84/84; task hero = cover hero
  75/75.
* Anomalies: the 2 mid-hero swaps of §5.3. Nothing else.
* Promote it to `scripts/overhaul/gen-lessons.mjs`: read the frames (frames win), keep the lessons-v3 cross-check as
  a hard assertion, emit the TS above, and fail on any unknown atom.

---

## 9 · The bundle's own data files

| file | status | use it? |
|---|---|---|
| `lessons.json`, `task-src.json`, `course-text.txt` | **byte-identical to `Latest Vici FULL/`** — the previous drop's course (old titles "Surviving the Night", old sections "Tonight…", old two-board tasks). `build-v3` reads `lessons.json` only for week names and the opening/closing quotes. | Only `task-src.json[day].summary` = the app's current `task.cardSummary` (82/84 exact, 2 differ only by `'`→`’`), which Today/Night frames still draw (§10.3). Nothing else. |
| `gen/src-days.json` | the new course source: `course[n] {title, body[], q, practice[], done[]}` and `daily[n]`; raw (straight quotes, `[3]` citation markers, unsplit paragraphs) | no — `lessons-v3.json` is its cleaned form |
| `gen/lessons-v3.json` | the clean structured course: `weeks[{num,name,lessons[{num,title,openingQuote,closingQuote,sections[{title,items[string | {visual}]}],question,practice[],doneWhen}]}]` — **matches the frames 84/84** | yes, as the generator's cross-check (and the cleanest place to read a lesson's text). It lacks pagination, hero placement and per-page layout, which only the frames have. |
| `gen/lines-v3.json` | 2,117 `"<style>|<text>": lines` measured by the designer; agrees with our Chrome measurement 1,821/1,821 | optional cross-check |
| `gen/lesson-lines.txt` | a bare digit string (per-item line counts of an earlier measuring pass) | no |
| `gen/build-weeks.js` | 3-line wrapper: `build-v3('build')` | — |
| `gen/build-v3.js` | content assembly (sentence splitter `split()`, authored overrides `AU.OV`, sections `AU.S`, visuals `AU.V`, title fixes `AU.T`) | reference |
| `gen/lesson-v3.js` | **the renderer = the template spec**; every frame obeys it | reference (frames win where they differ — they do not) |
| `gen/lesson-pool.json` | `[cover, mid1, mid2]` illustration per lesson | no — 2 mid entries are stale; read `data-hero` |
| `gen/hero-bounds.json` | art bounds per illustration → hero box | yes (or appendix B) |
| `gen/v3-author.js` | section breaks/titles, the 33 visual specs (`chain` 4, `compare` 14, `pairs` 11, `track` 2, `wave` 1, `bars` 1) | reference |
| `restyle-lessons.js`, `frame-templates.txt`, `taskgen-*.js` | the older light-paper pipeline (`Iowan Old Style`, `#FFD34D` pills) | not build targets |

---

## 10 · Old content vs new — what changes

### 10.1 The app's current lesson content (all GENERATED)
| file | generator | what it is | fate |
|---|---|---|---|
| `src/content/lessonReader.ts` (892 KB) | `scripts/vicifull/gen-lesson-scrolls.mjs` (+ `gen-dry.mjs`) | previous drop's reader: 1,858 pages (1,701 centred columns, 75 pick boards, 82 task-options boards), serif epigraphs, paper marks | replaced by `lessons.ts`; delete |
| `src/content/coverScene.ts`, `readerRoom.ts` | same | the old cover scene and night room | delete with the reader |
| `src/content/curriculum84.ts` | `scripts/vicifull/gen-curriculum.mjs` (reads `.vicifull/…` + `Latest Vici FULL/project/task-src.json`) | week name/blurb, lesson `title`, `titleSize`, `summary`, and the old two-board `task` (`board`, `intro2`, `flow`, `options`, `close`, `cardTitle`, `cardSummary`, `done`) | regenerate (§12.4) |
| `src/content/lessonPlates.ts` (300 KB) | `scripts/uifinal/gen-lesson-art.mjs` | the 83 old lesson-card plates | dead once search / lessons-browser / today kit / lesson-card switch to the cover hero |
| `src/content/taskScenes.ts` (566 KB) | `scripts/uifinal/gen-task-scenes.mjs` | old task scenes + `TASK_OPTION_ICONS` | dead with `/task/[day]` (and `TaskScene`'s `Scene` once the plates go) |

### 10.2 What the new frames change
* **Titles: 84 of 84 change** (old `Surviving the Night` → `Prepare for tonight`, … full list: library.md
  appendix A; same strings as the covers). New titles are sentence case. Old `titleSize` 23/20 is gone (one display
  size, 30/36).
* **Order/numbering unchanged**: lesson n = day n, 7 per week, weeks I–XII with unchanged names/blurbs.
* **Reader:** 1,858 pages → 1,273; paper/serif → dark Lato; centred → left-aligned reading; cascades and marks →
  Parts, illustrations, six visual cards; pick boards (75 lessons, nothing saved) → 32 questions with an answer page.
  Of the 32 new questions only L7's prompt ("Which change helped you most this week?") is word-for-word an old
  pick-board prompt.
* **Task:** old = a separate route with an intro board (scene + rule card) and an options board (2–5 options with
  glyphs) ending in `Mark as done`; new = inside the lesson: `Today’s task` + lesson title + practice prose, then
  a `Done when` card and `Finish lesson`. **No options, no glyphs, no scene.** All 84 `done` sentences differ
  (old "Done when you can’t reach your usual device from bed without standing up." → new "Your starting notes are
  saved and tonight’s device setup is ready.").
* **No one-line summary exists in the new bundle** (the old card's `summary` line has no successor).

### 10.3 Canvas contradiction — the task sentence on Today/Night
`Today Home Task` and `Night Action Reminder` (today-day group) draw L1's task as **"Put the device you use for porn
out of reach before you sleep."** — that is `task-src.json[1].summary` (= current `cardSummary`), the previous
drop's task, not the new reader's L1 task ("Start one private note called My recovery plan. …"). The new bundle
states no short task sentence anywhere else. Recommendation: keep `cardSummary` from `task-src.json` (it is the
only short form, and the two frames that show it use it verbatim), switch `cardTitle` to the new lesson title
(Night Action's h1 reads "Prepare for tonight"). Record as a D2xx contradiction.

---

## 11 · The app's current lesson flow (read)

* **Route** `src/app/lesson/day/[day].tsx` (82 lines): `n = Number(String(day).replace(/^day-/,'')) || 1`;
  cursor `{day, index}` resets when the lesson changes; `LESSON_READER[n]`; `next()` advances, on the last page
  closes; `close()` = `router.canGoBack() ? back() : replace('/lesson-card/<n>')`; `<StatusBar style="dark">`;
  returns `null` for an unknown lesson. **Writes nothing.**
* **Shell** `src/components/lesson/scroll.tsx` `LessonScroll`: paper ground, grain 0.07, `Close` word, 2pt rail
  (animated), centred `ScrollView` with tap-anywhere `PressScale`, FadeIn per page, cover chevron, footer/overlay
  slots. Plus the old marks (`SunDot`, `CrescentMark`, `SunriseMark`, `ClockMark`, `BedPhoneMark`).
* **Parts** `src/components/lesson/reader.tsx`: `Run` (9 ramps, serif epigraph), `Mark`, `Part`, `PickRows`
  (local state only), `Cta`, `Board`, `OptionRow`, `GlyphArt`. Imports `coverL1.tsx`, `Scene` from
  `components/task/TaskScene`, `coverScene`, `readerRoom`.
* **Dead already:** `src/components/lesson/pages.tsx` has no importer; `cover.tsx`, `marks.tsx`, `scenes.tsx`
  are imported only by it.
* **Card** `src/app/lesson-card/[day].tsx`: paper sheet, 7-dot rail, `LESSON 01 · WEEK I`, old plate, title,
  summary, `Start lesson` → `/lesson/day/<n>`, `Back to Week I`. **No frame in this drop**; its job is now Frame 1.
* **Task** `src/app/task/[day].tsx`: two old boards; `Mark as done` → `upsert({date: today, dailyAction:
  task.cardSummary, dailyActionDone: true})`. **No frame in this drop.**
* **Entry points:** Today p2 lesson tile → `/lesson-card/<day>` (else `/lessons-browser`); Today p2 task →
  `/task/<day>` (lesson register) or toggles `dailyActionDone` (generic register); week rows
  (`week/[week].tsx`, `WeekBoard.tsx`), `lessons-browser`, `search`, `first-steps` → `/lesson-card/<day>`;
  `(app)/all.tsx` lists `/lesson-card/1`, `/lesson/day/1`, `/task/1`.
* **Who reads lesson data:** `lessonForDay(day)` → Today (title, `task.cardSummary`, `task.cardTitle`), Night
  (`task.cardSummary`, `task.cardTitle`), library, search (`title`, `summary`), first-steps (`summary`),
  `lib/curriculum.ts` (`bodyMarkdown = summary`; slugs `day-NN`).
* **Who reads completion:** `useLessonProgressMap()` `status==='completed'` → Today & Score & Morning
  (`buildScore` lessons term; Morning ledger "Part X finished" when `completedAt` is yesterday), Night ("No lesson
  today" vs finished), Milestones/medallions ("Lessons completed."), Weekly report, First steps, `lib/dashboard.ts`.
  `useCurrentLesson` = first not-completed. Seeds create these rows; **the UI never does** (`useCompleteLesson`,
  `useStartLesson`, `useSaveReflection` have no caller since commit 10b951b deleted the old interactive player).
* **Backend** (no schema change needed): `lessons:startLesson`, `lessons:completeLesson(slug, fitsMeRating?)`
  (patches `completedAt = now` even if already completed), `reflections:save(slug, answers: Record<string,
  string|number>)`; mock store mirrors all three. `dailyCheckins.dailyAction / dailyActionDone` carry the task.

---

## 12 · Proposed architecture

### 12.1 Files
| file | action |
|---|---|
| `scripts/overhaul/gen-lessons.mjs` (new) | promote `scratch-lessons/classify.mjs` + `extract.mjs`; emit `src/content/lessons.ts` (`LESSONS`, `HERO_BOX`, `BREAKS`); assert against `gen/lessons-v3.json` |
| `scripts/overhaul/measure-lesson-lines.mjs` (new, optional) | promote `measure.mjs` + `measure-greedy.mjs` + `breaks.mjs` → `.overhaul/lesson-breaks.json` (input of the generator) |
| `src/content/lessons.ts` (new, GENERATED) | §8.1 |
| `src/app/lesson/day/[day].tsx` | rewrite: page index, `?page=` param, selections, note, writes (§12.3) |
| `src/components/lesson/LessonShell.tsx` | ground+noise, X, header, rail, band (centre/tall/scroll + fade), bottom control (pill / ring), tap-anywhere, FadeIn |
| `src/components/lesson/LessonPages.tsx` | one renderer per page kind (§3.4–3.12) |
| `src/components/lesson/LessonViz.tsx` | `Chain`, `Compare`, `Pairs`, `Wave`, `Track`, `Bars` (§4) |
| `src/components/lesson/LessonText.tsx` | ramp table §3.2 → style; web `textWrap`; native `BREAKS` lookup (§7) |
| `src/components/lesson/LessonHero.tsx` | the hero box (§5.2) around the shared `Hero` |
| `src/components/lesson/{scroll,reader,pages,cover,coverL1,marks,scenes}.tsx` | delete |
| `src/content/{lessonReader,coverScene,readerRoom}.ts` | delete (and `scripts/vicifull/gen-lesson-scrolls.mjs` stops being run) |
| `src/app/lesson-card/[day].tsx` | `<Redirect href={`/lesson/day/${day}`} />` (keeps deep links, `all.tsx`, recipes) |
| `src/app/task/[day].tsx` | `<Redirect href={`/lesson/day/${day}?page=task`} />` (opens on `Today’s task`) |

### 12.2 Reader state machine
`index` (0-based) · `chosen: string[]` (letters) · `note: string`. Initial index from `?page=` (`<k>` 1-based, or
`task` = first `k:'task'` page) — also what the verification phase needs to capture any of the 1,273 frames
directly (`/lesson/day/7?page=11`). The rail percent is computed (`Math.round((index+1)/pages.length*100)`), the
header is `Lesson ${n}` on every page but the first.

### 12.3 What each control does, and what it writes
| control | page | does | writes |
|---|---|---|---|
| `Begin` | cover | next | `startLesson('day-NN')` (records `in_progress`; harmless, nothing reads it specially) |
| ring / tap anywhere | reading, quote, task first | next | — |
| option row | question | toggle (single: radio; multi: checkbox, `exclusive` rule) | — |
| `Continue` | question | next (enabled with no choice — the frame draws it so) | `saveReflection(slug, { q: 'A,C' })` if a choice was made |
| note field | reflect | edit | — |
| `Continue` | answer / reflect | next | reflect: `saveReflection(slug, { q, note })` again with both keys when a note was typed (`reflections:save` **replaces** the whole `answers` record, so never send `{ note }` alone) |
| `Finish lesson` | task end | next | `completeLesson(slug)` **only if not already completed** (the mutation re-stamps `completedAt`, which would move Morning's "finished yesterday" and the score day) |
| `Done` | complete | `close()` | — |
| X | all | `close()` = `canGoBack() ? back() : replace('/(app)/today')` (the card no longer exists) | — |

**The task itself is not completed by the lesson.** The complete page says so ("One thing left today — the task.").
Task completion stays where it is in the data model: `dailyCheckins.dailyActionDone` on today's row, toggled by
Today p2's check (today-day group) and answered for yesterday by Morning's "Did you complete this task?". So
Today / Morning / Night / medallions keep working unchanged, and `completeLesson` now feeds the counters they
already read.

### 12.4 `curriculum84.ts` (shared — one owner; I suggest this group)
Fork `scripts/vicifull/gen-curriculum.mjs` → `scripts/overhaul/gen-curriculum.mjs` reading: week name/blurb
(Email-Login `Week-*.html`, unchanged), lesson `title` from `L<n>-Frame-1.html`, `hero` (cover `data-hero`), and
`task.cardSummary` from `task-src.json[day].summary` (curled). Keep the exported API (`CURRICULUM_84`,
`CURRICULUM_84_DAYS`, `lessonForDay`, `weekFor`, `Curriculum84Lesson.{day,week,title,summary,task}`) so Today /
Night / Library / Search compile untouched; set `task.cardTitle = title`; add `hero`; drop `titleSize`, `board`,
`intro2`, `flow`, `options`, `close`, `secondTitle`, `intro` once `/task/[day]` is a redirect. `summary`: see Q8.

### 12.5 Consumers outside this group (requests, not edits)
* Today p2 (today-day): task row tap → `/lesson/day/<day>?page=task`; lesson tile → `/lesson/day/<day>`; hero =
  `lesson.hero`.
* Library / lessons-browser / search / first-steps (library group): push `/lesson/day/<day>` (or keep pushing
  `/lesson-card/<day>`, which redirects); replace `LESSON_PLATES` thumbnails with the cover hero.
* Morning (today-day): its fallback task sentence (`dayAction(day-1)`) could read
  `lessonForDay(day-1)?.task.cardSummary` so it asks about the lesson task.

---

## 13 · States no frame draws (proposals in the kit's idiom)

1. **Option selected** (every question is drawn unselected). The kit's own selection idiom (`options`, `grid2`,
   `chips` in `mono-kit.js`) is "selected = ink fill, on-ink text": row `background:#F2F0EC`, text `#111111`; mark
   inverted from the best-answer mark: `background:#111111`, letter `#F2F0EC`, no ring (radius 12 / 7 kept).
   Same geometry, so nothing moves. Accessibility role radio/checkbox + checked.
2. **Note field focused / filled**: text 16/22 400 `#F2F0EC`, caret ink, placeholder as drawn; single line; keyboard:
   the band switches to scroll mode (or `KeyboardAvoidingView`) so the field stays above the keyboard.
3. **Pressed** states: `PressScale` as elsewhere.
4. **Lesson already completed** when reopened: nothing drawn — open on the cover as normal; `Finish lesson` does not
   re-stamp (§12.3).
5. **Unknown lesson** (`/lesson/day/999`): ground + X only (today it renders `null`, a blank screen with no exit).
6. **Small screens**: scroll mode + fade (§2.1, §6).
7. **Loading / error / empty:** none — content is static and bundled; backend writes are fire-and-forget
   (`.catch(() => {})` as elsewhere).

---

## 14 · Functionality to preserve
* `/lesson/day/<n>` with `day-` prefix tolerance; cursor resets on lesson change; unknown lesson safe.
* Tap-anywhere advance on reading pages + explicit ring/pill; `Next`/`Close` accessibility labels (`drive.js`
  `tap('Next')` relies on them).
* Close via back with fallback; stack back gesture and Android back.
* FadeIn per page, animated rail, reduced-motion respected.
* Scroll when content does not fit.
* `/lesson-card/<n>` and `/task/<n>` deep links (redirects), `all.tsx` entries.
* Today's task done toggle, Morning's yesterday-task check, Night action — untouched data paths.
* Everything that counts completed lessons (now fed for real).

---

## 15 · Shared files and requests

| file | owner | request |
|---|---|---|
| `src/components/mono/Hero.tsx` + `src/content/heroes.ts` (+ generator) | orchestrator | as library.md §7.3, incl. `paint-order` split, inner `<g>` transforms, `scale` 1 for medal; the lesson box wrapper stays in this group |
| `src/components/mono/*` | orchestrator | `CloseX`, `Check` (viewBox 14, any size), `Primary` (bottom 48), a 44 `NextRing` (bottom 52), noise frame at **0.06** with `noise-dark.png` — or this group keeps local copies |
| `scripts/overhaul/body.mjs` | orchestrator | add `data-hero`, `paint-order` to `SVG_ATTRS` |
| `src/content/curriculum84.ts` + generator | this group (proposed) | §12.4 — touched by today-day, library |
| `src/app/(app)/today.tsx`, `src/app/day/morning.tsx`, `night.tsx` | today-day | §12.5 |
| `src/app/week/[week].tsx`, `components/library/*`, `lessons-browser.tsx`, `search.tsx`, `first-steps.tsx` | library | §12.5 |
| `.overhaul/recipes/lesson-scrolls.json` | lesson-scroll | stale (old 26-page bundle); replace |

---

## 16 · Verification plan
* `audit.mjs` only walks Email-Login frames; the 1,273 Week frames need their own loop: one Chrome, sequential,
  `shot.mjs app '/lesson/day/<n>?page=<k>'` vs `.overhaul/shots/design/<Week>/L<n>-Frame-<k>.png`, `pxdiff
  --ignore=0,0,393,54`. Design signatures `d-<Week>-L<n>-Frame-<k>` are being written to `.overhaul/sig/`.
* Spot frames per template: covers with full-bleed heroes (L2 F1 sunrise, L5 F1 books), each viz (§4.8), the 3
  question layouts (L7 F11, L16 F11, L2 F11), both answer kinds (L10 F12, L44 F13, L2 F12), task pages with and
  without hero (L2 F14, L1 F12), the 3-body task end (L1 F13), L68 F14 (balance line count), L81 F10 (medal scale 1).
* Small screen: any task-first page at `--w=375 --h=667 --scroll=end`.
* Selected states need a driver (`tap('A')` on the option text).

---

## 17 · Open questions / contradictions

* **Q1 — retire `/lesson-card/[day]`** (no frame; Frame 1 is the cover with `Begin`) → redirect. Recommended
  (same as lesson-scroll Q1, library §10).
* **Q2 — `/task/[day]`** (no frame; the task is inside the lesson) → redirect to the reader's `Today’s task` page.
  Recommended.
* **Q3 — `completeLesson` on `Finish lesson`** restores behaviour lost in 10b951b; changes score/medallion/morning
  numbers for real users (as designed). Needs a D2xx.
* **Q4 — "Your answers are saved to the log."** `saveReflection` persists the answer per lesson, but no screen lists
  reflections. Should the answer + note also be filed where the Log tab shows things (a journal entry)? Product call;
  minimum is `saveReflection`.
* **Q5 — selected option style** is undrawn (§13.1 proposal). Is `Continue` meant to require a choice? The frame
  draws it enabled with none.
* **Q6 — native line breaks** (§7): embed Chrome's breaks at the canvas width, or accept greedy (527 runs / 477
  frames; one 31pt shift on L68 F14)?
* **Q7 — small screens:** apply L7 F11's scroll + fade to every page that overflows (122 on 375×667)? Recommended.
* **Q8 — `summary`**: the new bundle has no one-line summary. Keep the old (now mismatched) summaries for search /
  first-steps, or drop the field (search on title + task text)?
* **Q9 — task sentence on Today/Night** is the previous drop's (§10.3). Keep `task-src.json` summary.
* **Contradiction — `gen/lesson-pool.json`** vs frames for L52 F8 and L68 F7 (frames win).
* **Correction to `lesson-scroll.md` §0.2:** `L7 F11` has **9** options, not 5; and on 375×667 the corpus has 122
  overflowing pages, not only L1 F5.

---

## 18 · Risks
* **Two groups, one reader.** `lesson-scroll` (14 Email-Login frames = L1) and `lessons` (all 84) would both rewrite
  `src/app/lesson/day/[day].tsx` and `src/components/lesson/*`. One owner; the other verifies L1.
* **`curriculum84.ts` is read by ~13 files**; regenerate once, keep its API.
* **Verification volume**: 1,273 frames; without a `?page=` entry they can only be reached by tapping through.
* **Invisible art on web** if the hero `<Svg>` is not `position:absolute` next to positioned siblings; a signature
  passes with the art gone — look at the PNG.
* **`paint-order`** halos missing if the shared hero module does not split elements.
* **Text wrap**: web needs `textWrap` per run (AppText's default `pretty` breaks balanced titles differently);
  native differs without §7(b).
* **Header and pill labels have no line-height** — giving them one moves them vertically.
* **Writes** (`completeLesson`, `saveReflection`) are new UI behaviour; idempotence matters (re-stamping
  `completedAt`).
* **Deleting** `lessonPlates.ts` / `taskScenes.ts` / `TaskScene` too early breaks search, lessons-browser and the
  today kit, which still import them.
* Stale recipe `.overhaul/recipes/lesson-scrolls.json` sorts after a new `lesson-scroll.json` and overrides it.

---

## A · Appendix: every lesson — page strip

Codes: `C` cover · `Q` quote · `S` section (Part n) · `c` continuation · `?` question · `A` best answer · `R`
reflect · `T` task first · `E` task end · `D` complete; suffix `h` = hero, `v` = visualisation. "extras" lists every
non-cover illustration and every visualisation by frame.

| L | wk | title | frames | cover hero | pages | question | extras |
|---|---|---|---|---|---|---|---|
| 1 | I | Prepare for tonight | 14 | `nightPhone` | C Q S c Sv c ch c S c Q T E D | — | F5 chain, F7 bed |
| 2 | I | Remove easy access to porn | 16 | `sunrise` | C Q S cv c S ch c S c ? R Q Th E D | F11–F12 | F4 pairs, F7 notebook, F14 sunrise |
| 3 | I | Choose where to go instead | 15 | `bench` | C Q S ch c S ch c S c c Q Th E D | — | F4 signpost, F7 sneaker, F13 bench |
| 4 | I | Prepare for sleep | 15 | `bed` | C Q S c S ch c S ch c c Q Th E D | — | F6 clock, F9 lamp, F13 bed |
| 5 | I | Have another activity ready | 15 | `books` | C Q S c Sh c c ch S c c Q Th E D | — | F5 pencil, F8 notebook, F13 books |
| 6 | I | Make time for contact | 14 | `twoCups` | C Q S cv c S c Sh c c Q Th E D | — | F4 compare, F8 envelope, F12 twoCups |
| 7 | I | Review the first week | 16 | `cake` | C Q S c c S ch c S c ? R Q Th E D | F11–F12 | F7 calendar, F14 cake |
| 8 | II | Measure more than a streak | 14 | `calendar` | C Q S cv S ch c S c c Q Th E D | — | F4 compare, F6 chartUp, F12 calendar |
| 9 | II | Stop sooner after a slip | 15 | `sunrise` | C Q S c Sh c cv c c S c Q Th E D | — | F5 halfMast, F7 chain, F13 sunrise |
| 10 | II | Use the hours that remain | 16 | `scale` | C Q S c cv S ch c S c ? A Q Th E D | F11–F12 | F5 compare, F7 dominoes, F14 scale |
| 11 | II | Try one change for a week | 14 | `chartUp` | C Q S c Sv c ch S c c Q Th E D | — | F5 pairs, F7 mountain, F12 chartUp |
| 12 | II | Repeat one useful action | 14 | `idCard` | C Q Sv c S ch c c S c Q Th E D | — | F3 compare, F6 mirror, F12 idCard |
| 13 | II | Choose your own reason | 17 | `compass` | C Q S c c Sv c c S ch c ? R Q Th E D | F12–F13 | F6 compare, F10 scale, F15 compass |
| 14 | II | Return after a missed day | 15 | `signpost` | C Q S c ch c S c c Sv c Q Th E D | — | F5 sneaker, F10 pairs, F13 signpost |
| 15 | III | What to do when an urge starts | 14 | `stopwatch` | C Q S c Sv c ch S c c Q Th E D | — | F5 wave, F7 thermometer, F12 stopwatch |
| 16 | III | Check what you need | 16 | `thermometer` | C Q S c Sv c c c Sh c ? R Q Th E D | F11–F12 | F5 pairs, F9 bubbles, F14 thermometer |
| 17 | III | Close the screen and move | 14 | `sneaker` | C Q S c S ch c S ch c Q Th E D | — | F6 openDoor, F9 stairs, F12 sneaker |
| 18 | III | Prepare another activity | 16 | `signpost` | C Q S c Sv c c Sh c c ? R Q Th E D | F11–F12 | F5 compare, F8 compass, F14 signpost |
| 19 | III | Check hunger, anger, loneliness, and tiredness | 16 | `kettle` | C Q S cv c c S ch S c ? R Q Th E D | F11–F12 | F4 pairs, F8 bed, F14 kettle |
| 20 | III | Notice an urge without acting on it | 16 | `lighthouse` | C Q S cv S ch c c S c ? A Q T E D | F11–F12 | F4 compare, F6 hourglass |
| 21 | III | Make a separate choice about masturbation | 14 | `shower` | C Q S c c S c Sh c c Q T E D | — | F8 bed |
| 22 | IV | Understand what starts the habit | 16 | `brain` | C Q S ch c S cv S c c ? A Q Th E D | F11–F12 | F4 battery, F7 compare, F14 brain |
| 23 | IV | Decide before the difficult hour | 14 | `brain` | C Q S cv S ch c S c c Q Th E D | — | F4 pairs, F6 compass, F12 brain |
| 24 | IV | Make room for food and sleep | 14 | `kettle` | C Q S c Sh c c S ch c Q Th E D | — | F5 bed, F9 battery, F12 kettle |
| 25 | IV | Respond to anger and loneliness | 13 | `thunderCloud` | C Q S ch S c c Sh c Q T E D | — | F4 twoCups, F8 bench |
| 26 | IV | Notice when searching keeps going | 16 | `tab` | C Q S cv S ch c S c c ? A Q Th E D | F11–F12 | F4 compare, F6 feedOff, F14 tab |
| 27 | IV | Try movement, breathing, or another room | 14 | `shower` | C Q S c S ch c S ch c Q Th E D | — | F6 sneaker, F9 thermometer, F12 shower |
| 28 | IV | Act earlier in the habit | 15 | `dominoes` | C Q Sv c S ch c S c ? R Q Th E D | F10–F11 | F3 chain, F6 compass, F13 dominoes |
| 29 | V | Look at the benefit and cost | 13 | `scale` | C Q S c S cv c Sh c Q Th E D | — | F6 compare, F8 hourglass, F11 scale |
| 30 | V | Meet the need you can identify | 16 | `tab` | C Q S c S ch c S ch c ? R Q Th E D | F11–F12 | F6 feedOff, F9 scale, F14 tab |
| 31 | V | Begin a task you are avoiding | 15 | `envelopeOpen` | C Q S c S c cv c Sh c c Q Th E D | — | F7 compare, F9 mirror, F13 envelopeOpen |
| 32 | V | Address one immediate cost | 15 | `clock` | C Q S ch S c S ch c S c Q Th E D | — | F4 battery, F8 hourglass, F13 clock |
| 33 | V | Make time for what viewing displaced | 15 | `calendar` | C Q S ch c S ch c c S c Q Th E D | — | F4 hourglass, F7 halfMast, F13 calendar |
| 34 | V | Make one change for tonight | 14 | `scale` | C Q S ch c S ch S c c Q Th E D | — | F4 chartUp, F7 sunrise, F12 scale |
| 35 | V | Give an activity a place in the week | 17 | `scale` | C Q S c Sv c S ch c S c ? R Q Th E D | F12–F13 | F5 track, F8 plant, F15 scale |
| 36 | VI | Prepare a simpler response when tired | 17 | `battery` | C Q S c ch S c c S ch c ? A Q Th E D | F12–F13 | F5 stopwatch, F10 match, F15 battery |
| 37 | VI | Practise the response | 15 | `sneaker` | C Q S ch c S c Sh c c c Q Th E D | — | F4 dominoes2, F8 stopwatch, F13 sneaker |
| 38 | VI | Keep rules that serve a purpose | 15 | `halfMast` | C Q S c ch c S cv S c c Q Th E D | — | F5 mirror, F8 compare, F13 halfMast |
| 39 | VI | Practise the part that gets in the way | 17 | `compass` | C Q S cv c c S c ch S c ? R Q Th E D | F12–F13 | F4 pairs, F9 sneaker, F15 compass |
| 40 | VI | Let a thought remain while you act | 18 | `thunderCloud` | C Q S ch c Sv c c c S c c ? A Q Th E D | F13–F14 | F4 bubbles, F6 chain, F16 thunderCloud |
| 41 | VI | Give the action a time and place | 17 | `signpost` | C Q S cv c S c ch S c c ? A Q Th E D | F12–F13 | F4 bars, F8 compass, F15 signpost |
| 42 | VI | Plan for a difficult day | 13 | `umbrella` | C Q S c c Sv c Sh c Q T E D | — | F6 compare, F8 halfMast |
| 43 | VII | Learn from a slip | 15 | `halfMast` | C Q S c S c S ch c S c Q Th E D | — | F8 sunrise, F13 halfMast |
| 44 | VII | Take care and make a repair | 17 | `notebook` | C Q S c ch S c c S ch c ? A Q Th E D | F12–F13 | F5 clipboard, F10 pencil, F15 notebook |
| 45 | VII | Adjust the plan for today | 15 | `mirror` | C Q S c cv c S c ch S c Q Th E D | — | F5 pairs, F9 umbrella, F13 mirror |
| 46 | VII | Get support during a difficult period | 17 | `thunderCloud` | C Q S c ch c S c ch S c ? R Q Th E D | F12–F13 | F5 umbrella, F9 kettle, F15 thunderCloud |
| 47 | VII | Return to the task you postponed | 15 | `mountain` | C Q S c c S ch c S ch c Q Th E D | — | F7 umbrella, F10 lighthouse, F13 mountain |
| 48 | VII | Begin the next part of the day | 15 | `door` | C Q S c ch S c c S ch c Q Th E D | — | F5 envelopeOpen, F10 stairs, F13 door |
| 49 | VII | Take a step after a longer setback | 14 | `calendar` | C Q S ch c S c c Sh c Q T E D | — | F4 sunrise, F9 stopwatch |
| 50 | VIII | Give an activity time before switching | 17 | `clock` | C Q S c ch c S c S ch c ? A Q Th E D | F12–F13 | F5 phoneTable, F10 hourglass, F15 clock |
| 51 | VIII | Choose what begins in an empty gap | 14 | `tab` | C Q S c S ch c S ch c Q T E D | — | F6 feedOff, F9 bench |
| 52 | VIII | Try fifteen minutes without switching | 14 | `bench` | C Q S c c S c ch S c Q Th E D | — | F8 hourglass, F12 bench |
| 53 | VIII | Change one screen habit | 16 | `phoneTable` | C Q S ch c c S c Sh c ? R Q Th E D | F11–F12 | F4 charger, F9 clock, F14 phoneTable |
| 54 | VIII | Try an hour away from one feed | 16 | `feedOff` | C Q S c ch S c S ch c ? A Q Th E D | F11–F12 | F5 plant, F9 sunrise, F14 feedOff |
| 55 | VIII | Prepare the first hour after waking | 14 | `sunrise` | C Q S ch c S c ch S c Q Th E D | — | F4 clock, F8 compass, F12 sunrise |
| 56 | VIII | Give time to something that matters | 15 | `compass` | C Q S c ch S c c Sh c c Q Th E D | — | F5 mountain, F9 plant, F13 compass |
| 57 | IX | Arrange a shared activity | 14 | `twoCups` | C Q S c S ch c S ch c Q Th E D | — | F6 bench, F9 envelope, F12 twoCups |
| 58 | IX | Choose contact that fits | 17 | `bench` | C Q S c Sv c c c S ch c ? R Q Th E D | F12–F13 | F5 pairs, F10 nightMoon, F15 bench |
| 59 | IX | Choose how to spend time alone | 14 | `bench` | C Q S c c S c S ch c Q Th E D | — | F9 campfire, F12 bench |
| 60 | IX | Separate desire from wanting company | 16 | `twoCups` | C Q S ch S c Sh c S c ? R Q Th E D | F11–F12 | F4 envelope, F7 phoneTable, F14 twoCups |
| 61 | IX | Follow up on a connection | 15 | `twoCups` | C Q S c ch S c c S ch c Q Th E D | — | F5 campfire, F10 cake, F13 twoCups |
| 62 | IX | Set a safe limit on harmful contact | 14 | `thunderCloud` | C Q S c S c S ch S c Q Th E D | — | F8 dominoes, F12 thunderCloud |
| 63 | IX | Give a relationship attention | 15 | `twoCups` | C Q S ch c S c S ch S c Q Th E D | — | F4 plant, F9 campfire, F13 twoCups |
| 64 | X | Choose support without revisiting painful events | 16 | `umbrella` | C Q S ch c c Sh c c c S c Q T E D | — | F4 lighthouse, F7 envelopeOpen |
| 65 | X | Change one difficult setting | 14 | `plant` | C Q S ch c S c S ch c Q Th E D | — | F4 nightMoon, F9 door, F12 plant |
| 66 | X | Describe a mistake without an insult | 15 | `mirror` | C Q Sv c S c c S ch S c Q Th E D | — | F3 compare, F9 bubbles, F13 mirror |
| 67 | X | When you feel bad about yourself | 14 | `mirror` | C Q S ch c S c ch S c Q Th E D | — | F4 thunderCloud, F8 lamp, F12 mirror |
| 68 | X | Check your response to self-criticism | 16 | `plant` | C Q S c S c ch S c c ? R Q Th E D | F11–F12 | F7 twoCups, F14 plant |
| 69 | X | Keep one manageable commitment | 15 | `compass` | C Q S ch c S ch c S c c Q Th E D | — | F4 calendar, F7 flag, F13 compass |
| 70 | X | Simplify the plan | 15 | `chartUp` | C Q S c c S ch c S ch c Q Th E D | — | F7 sneaker, F10 books, F13 chartUp |
| 71 | XI | Use what your notes show | 14 | `mirror` | C Q S ch c S c ch S c Q Th E D | — | F4 notebook, F8 compass, F12 mirror |
| 72 | XI | Choose what you can do now | 16 | `umbrella` | C Q S c cv S c c Sh c ? A Q Th E D | F11–F12 | F5 pairs, F9 lighthouse, F14 umbrella |
| 73 | XI | Reserve time for what matters | 14 | `hourglass` | C Q S ch S c c S ch c Q Th E D | — | F4 calendar, F9 nightMoon, F12 hourglass |
| 74 | XI | Begin an activity you postponed | 15 | `sunrise` | C Q S c S ch c S c Sh c Q Th E D | — | F6 stopwatch, F10 sneaker, F13 sunrise |
| 75 | XI | Plan the next ninety days | 16 | `calendar` | C Q S c c Sh c Sv c c ? A Q Th E D | F11–F12 | F6 signpost, F8 track, F14 calendar |
| 76 | XI | Give one activity your attention | 14 | `lighthouse` | C Q S ch c S S c ch c Q T E D | — | F4 bench, F9 plant |
| 77 | XI | Schedule something you want to keep doing | 14 | `envelope` | C Q S ch S c c S ch c Q Th E D | — | F4 calendar, F9 mountain, F12 envelope |
| 78 | XII | Keep the reason and next action clear | 14 | `lighthouse` | C Q S ch c S c ch S c Q Th E D | — | F4 compass, F8 flag, F12 lighthouse |
| 79 | XII | Compare the start with now | 16 | `calendar` | C Q S c S ch S c S c ? R Q Th E D | F11–F12 | F6 signpost, F14 calendar |
| 80 | XII | Prepare for a changed situation | 18 | `brain` | C Q S cv c S c Sh c c S c ? A Q Th E D | F13–F14 | F4 pairs, F8 chartUp, F16 brain |
| 81 | XII | Use the changes that helped | 17 | `flag` | C Q S ch c S c c S ch c ? R Q Th E D | F12–F13 | F4 mountain, F10 medal, F15 flag |
| 82 | XII | Check how to ask for help | 17 | `books` | C Q S c c S c Sh c c c ? A Q Th E D | F12–F13 | F8 twoCups, F15 books |
| 83 | XII | Finish with an honest next step | 15 | `envelopeOpen` | C Q S ch S c S Sh c c c Q Th E D | — | F4 halfMast, F8 sunrise, F13 envelopeOpen |
| 84 | XII | Save a short plan for after the course | 14 | `sunrise` | C Q S c S ch S c ? R Q Th E D | F9–F10 | F6 lighthouse, F12 sunrise |

## B · Appendix: hero boxes (one value per id across all 284 uses)

`h` = hero box height, `top` = the svg's `top` inside it, inner `<g>` = the art's own top-level transforms (keep
them). Uses = frames in the 84 readers (covers + mid + task).

| id | box h | svg top | transform | inner <g> | uses |
|---|---|---|---|---|---|
| `battery` | 114 | -92px | scale(1.1) | translate(32 0) | 5 |
| `bed` | 162 | -32px | scale(1.1) | translate(12 0) | 6 |
| `bench` | 160 | -34px | scale(1.1) | — | 12 |
| `books` | 120 | -92px | scale(1.1) | rotate(-2.5 197 119) | 5 |
| `brain` | 155 | -23px | scale(1.1) | — | 6 |
| `bubbles` | 135 | -59px | scale(1.1) | translate(-4 0) | 3 |
| `cake` | 204 | -8px | scale(1.1) | — | 3 |
| `calendar` | 172 | -20px | scale(1.1) | — | 13 |
| `campfire` | 190 | -9px | scale(1.1) | — | 3 |
| `charger` | 135 | -59px | scale(1.1) | translate(-25 0) | 1 |
| `chartUp` | 160 | -35px | scale(1.1) | — | 7 |
| `clipboard` | 168 | -44px | scale(1.1) | translate(282 186) rotate(-102.5) | 1 |
| `clock` | 176 | -36px | scale(1.1) | translate(158.7 79.6) rotate(-40); translate(233.3 79.6) rotate(40) | 7 |
| `compass` | 189 | -35px | scale(1.1) | rotate(-5 196 136) | 15 |
| `dominoes` | 120 | -92px | scale(1.1) | — | 4 |
| `dominoes2` | 120 | -92px | scale(1.1) | rotate(26.74 98.8 188) | 1 |
| `door` | 165 | -39px | scale(1.1) | translate(-14 0) | 3 |
| `envelope` | 129 | -85px | scale(1.1) | rotate(-5 197 146) | 5 |
| `envelopeOpen` | 172 | -42px | scale(1.1) | rotate(4 197 140) | 6 |
| `feedOff` | 178 | -34px | scale(1.1) | — | 5 |
| `flag` | 165 | -29px | scale(1.1) | — | 4 |
| `halfMast` | 165 | -29px | scale(1.1) | — | 8 |
| `hourglass` | 167 | -45px | scale(1.1) | — | 8 |
| `idCard` | 191 | -1px | scale(1.1) | — | 2 |
| `kettle` | 142 | -70px | scale(1.1) | — | 5 |
| `lamp` | 158 | -54px | scale(1.1) | — | 2 |
| `lighthouse` | 221 | -8px | scale(1.1) | — | 8 |
| `match` | 185 | -23px | scale(1.1) | — | 1 |
| `medal` | 196 | -20px | scale(1) | — | 1 |
| `mirror` | 169 | -43px | scale(1.1) | — | 11 |
| `mountain` | 173 | -21px | scale(1.1) | — | 6 |
| `nightMoon` | 191 | -23px | scale(1.1) | — | 3 |
| `nightPhone` | 176 | -36px | scale(1.1) | translate(-6 0) | 1 |
| `notebook` | 121 | -91px | scale(1.1) | — | 5 |
| `openDoor` | 200 | -33px | scale(1.1) | translate(-7 0) | 1 |
| `pencil` | 157 | -58px | scale(1.1) | rotate(-3 196 164); translate(131.65 71.28) rotate(35) | 2 |
| `phoneTable` | 171 | -45px | scale(1.1) | rotate(-12 176 136) | 4 |
| `plant` | 191 | -21px | scale(1.1) | — | 9 |
| `scale` | 150 | -62px | scale(1.1) | — | 10 |
| `shower` | 180 | -18px | scale(1.1) | — | 3 |
| `signpost` | 168 | -26px | scale(1.1) | — | 9 |
| `sneaker` | 120 | -74px | scale(1.1) | rotate(7 298 190) | 10 |
| `stairs` | 183 | -11px | scale(1.1) | — | 2 |
| `stopwatch` | 175 | -34px | scale(1.1) | — | 6 |
| `sunrise` | 115 | -79px | scale(1.1) | — | 15 |
| `tab` | 168 | -32px | scale(1.1) | translate(223 72) | 5 |
| `thermometer` | 180 | -30px | scale(1.1) | — | 4 |
| `thunderCloud` | 173 | -36px | scale(1.1) | — | 8 |
| `twoCups` | 117 | -95px | scale(1.1) | — | 13 |
| `umbrella` | 196 | -11px | scale(1.1) | — | 7 |

## C · Appendix: the 32 question pages

| L | question frame | prompt | instr | multi | options | density / layout | answer frame | answer kind |
|---|---|---|---|---|---|---|---|---|
| 2 | F11 | What still makes porn easy to reach? | Choose all that fit. Choose F alone if it fits. | yes | 6 | regular / centre | F12 | After choosing — Choose one thing to change today. |
| 7 | F11 | Which change helped you most this week? | Choose one. | no | 9 | eight / scroll | F12 | After choosing — Keep what helped, or make one awkward part easier to begin. |
| 10 | F11 | You watched late at night after deciding not to. What helps with the rest of the night? | Choose one. | no | 3 | regular / centre | F12 | Best answer (A) |
| 13 | F12 | Why do you want to change your porn use? | Choose one. | no | 6 | regular / centre | F13 | After choosing — Write the reason in your own words and take one action that follows it. |
| 16 | F11 | What was happening before a recent urge? | Choose all that fit. Choose H alone if it fits. | yes | 8 | eight / tall | F12 | After choosing — Several answers may fit. |
| 18 | F11 | What happened with the change you chose on Day 11? | Choose one. | no | 5 | regular / centre | F12 | After choosing — Keep a helpful detail or change one part that got in the way. |
| 19 | F11 | Are any of these present now? | Choose all that fit. Choose E or F alone if it fits. | yes | 6 | regular / centre | F12 | After choosing — Begin with one need you can address. |
| 20 | F11 | After three minutes of noticing an urge, it still feels strong. What can you do? | Choose one. | no | 3 | regular / centre | F12 | Best answer (B) |
| 22 | F11 | Which detail helps you change the habit? | Choose one. | no | 3 | regular / centre | F12 | Best answer (B) |
| 26 | F11 | What does the gambling near-miss experiment illustrate? | Choose one. | no | 3 | regular / centre | F12 | Best answer (A) |
| 28 | F10 | What is the earliest step you notice before watching? | Choose one. | no | 6 | regular / centre | F11 | After choosing — Put the first response beside the step you actually notice. |
| 30 | F11 | What did you want from watching? | Choose all that fit. Choose G alone if it fits. | yes | 7 | seven / centre | F12 | After choosing — Choose a response that fits the need and your boundary. |
| 35 | F12 | Looking back at the choice you made on Day 21, what fits? | Choose one. | no | 5 | regular / centre | F13 | After choosing — Keep or change the separate masturbation choice from your experience, while keeping the porn rule clear. |
| 36 | F12 | You’ve had a demanding day. Which plan fits? | Choose one. | no | 3 | regular / centre | F13 | Best answer (B) |
| 39 | F12 | Which part of the plan is hardest to follow? | Choose one. | no | 6 | regular / centre | F13 | After choosing — Practise that part briefly without triggering material. |
| 40 | F13 | The thought is “one quick look.” What can you do next? | Choose one. | no | 3 | regular / centre | F14 | Best answer (B) |
| 41 | F12 | Which plan gives you a clear beginning? | Choose one. | no | 3 | regular / centre | F13 | Best answer (B) |
| 44 | F12 | Which actions take responsibility after a slip? | Choose all that fit. | yes | 4 | regular / centre | F13 | Best answers (A,B) |
| 46 | F12 | What currently calls for a temporary change to the plan? | Choose all that fit. Choose G alone if it fits. | yes | 7 | seven / centre | F13 | After choosing — Choose an adjustment or support that fits. |
| 50 | F12 | What did the video-switching experiments find? | Choose one. | no | 3 | regular / centre | F13 | Best answer (B) |
| 53 | F11 | Which screen habit will you try changing this week? | Choose one. | no | 6 | regular / centre | F12 | After choosing — Name the use, place, or time, while keeping essential functions. |
| 54 | F11 | What can an hour away from one feed tell you? | Choose one. | no | 3 | regular / centre | F12 | Best answer (B) |
| 58 | F12 | What kind of contact feels missing, if any? | Choose all that fit. Choose G or H alone if it fits. | yes | 8 | eight / tall | F13 | After choosing — Choose a step that fits the answer. |
| 60 | F11 | What happened with the screen rule from Day 53? | Choose one. | no | 5 | regular / centre | F12 | After choosing — Keep a helpful part or change what didn’t fit. |
| 68 | F11 | What happened when you used the Day 66 response? | Choose one. | no | 5 | regular / centre | F12 | After choosing — Keep what helped or change one awkward detail. |
| 72 | F11 | Which meaning of acceptance fits the lesson? | Choose one. | no | 3 | regular / centre | F12 | Best answer (B) |
| 75 | F11 | What are the next ninety days for? | Choose one. | no | 3 | regular / centre | F12 | Best answer (B) |
| 79 | F11 | Which statements fit the record you actually have? | Choose all that fit. Choose F alone if it fits. | yes | 7 | seven / centre | F12 | After choosing — Mixed results are valid. |
| 80 | F13 | You practised the steps in another room without an urge. What have you learned? | Choose all that fit. | yes | 4 | regular / centre | F14 | Best answers (A,B) |
| 81 | F12 | Which changes have actually helped? | Choose all that fit. Choose G alone if it fits. | yes | 7 | seven / centre | F13 | After choosing — Keep up to three actions from your answers and note when each helped. |
| 82 | F12 | Which lesson can you carefully take from other addiction care? | Choose one. | no | 3 | regular / centre | F13 | Best answer (B) |
| 84 | F9 | What needs most attention in the next two weeks? | Choose one. | no | 6 | regular / centre | F10 | After choosing — Give the priority a first action and keep the two-week review. |
