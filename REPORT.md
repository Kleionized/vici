# UI Final — implementation report

**Run:** 15 August 2026, unattended.
**Bundle:** `UI Final/` (Claude Design handoff, 288 files).
**Ledger:** `UI_FINAL_LEDGER.md` — 777 rows, one per `data-screen-label` frame.
**Decisions:** `DECISIONS.md`, entries D-001 … D-019.
**Specs:** `specs/` — 17 files, 573 KB of transcribed property tables.

> **Read this first.** The run did not reach `DONE` on every row, and the ledger
> says so rather than implying otherwise. What follows separates, without
> hedging, what was built and verified, what was specified but not built, and
> what was not reached at all.

---

## 1. Where the run got to

| State | Rows | What it means |
| --- | --- | --- |
| `IMPLEMENTED` | 120 | Built against the canvas, typechecked, linted, bundled, committed |
| `SPEC_EXTRACTED` | 80 | A complete property spec and design-vs-app comparison table exists; no code written |
| `NOT_STARTED` | 577 | Inventoried and dispositioned; neither specced nor built |

Of the 577 `NOT_STARTED`:

- **170** are the two byte-identical copies of `VICI (previous).dc.html` — the
  previous-generation canvas, deliberately not implemented (D-002).
- **274** are `Lessons and Tasks` task frames (`Task D01…D84 Intro/Options/Card`)
  and the superseded `L01 Reader` draft (D-004).
- **126** are `Email Login` frames that are byte-identical to the bundle the app
  was last built against, and **3** are the `exports/` frames, also unchanged.
  These are the "similarity trap" set: unchanged in the *design*, and therefore
  not re-verified against the *app* in this run. **This is the run's largest
  outstanding risk** and is called out again in §6.
- **4** are `Journey Chapter` / `Journey Campaign` frames.

Nothing in the bundle is missing from the ledger: `scripts/uifinal/ledger.mjs`
regenerates it from the split index every time, so a frame that exists in
`UI Final/` cannot silently drop out. The full file list with ticks is §8.

---

## 2. What was built

### 2.1 The morning and night check-ins — 10 frames

`Morning 1 Yesterday`, `Morning Task Check`, `Morning 5 Done`, `Night 1 Mood`,
`Checkin Emotions`, `Night 2 Record`, `Checkin Reasons`, `Night 3 Reflection`,
`Night Action Reminder`, `Night 4 Closed`.
Spec: `specs/day-checkin-flows.md`. Commit: *check-in flows: night gains the
feeling wheel and the reason list…*

| Category | Change |
| --- | --- |
| Structure | Night went 4 → 6 numbered steps; morning 5 → 7. Every drawn frame states its own rail and the counts are read off them, not inferred. |
| Structure | `Checkin Emotions` and `Checkin Reasons` moved out of the standalone `/checkin` flow and into the night flow as steps 2 and 4 — both frames now carry the day flow's rail geometry rather than the check-in's own. They became shared components so `/checkin` keeps them too. |
| Colour / geometry | Reason rows rebuilt: 54 → **60** tall, radius 14 → **18**, pitch 64 → **72**, selected ring `2px` → **`1.6px`**, unselected tick ring `rgba(0,0,0,0.25)` → **`rgba(0,0,0,0.22)`**. |
| Geometry | The reason glyph moved onto its own **38pt disc** — `#F1EFE9` unselected, `#131313` selected — at 22 → **21px**, stroke `#55534E` → **`#1D1C1A` / `#F4F3F0`**. |
| Typography | Reason label 16/500 → **15/500**, stepping to **600** when the row is on. |
| Copy | The reasons board's CTA is **"Continue"**, not "Log it" — it is no longer the last step. |
| Artwork | The action card's art is a **new bed scene** (headboard, mattress, pillow, shelved phone, seal) replacing the desk-and-phone scene, drawn identically on both frames that carry it. 4 stars, not 3. |
| Typography | The action card's line is **left**-aligned with `text-wrap: pretty`, was centred with `balance`. |
| Icons | The action mark gains a **bed glyph** (16 in a 20-unit box, stroke 1.7). |
| Motion / paint | `Night 1 Mood`'s crescent is cut with a **mask** (`radial-gradient(circle 15px at 67% 30%, transparent 0 13.5px, #000 14.5px)`) instead of covered by a 0.55-opacity disc. |
| Removed | `DayActionArt` — the first-light notebook scene — is deleted; nothing references it (D-010). |

### 2.2 The twelve week overviews — 24 frames

`Week I Reset` … `Week XII Leave It Behind` and their `P2` frames.
Spec: `specs/week-overview-1-6.md`, `specs/week-overview-7-12.md`.
New files: `src/app/week/[week].tsx`, `src/components/journey/WeekScene.tsx`,
`src/content/weekScenes.ts`.

- The screen did not exist in the app at all.
- P1/P2 are **one scrolling board**, not two: every pair is byte-identical
  outside the row column, and the 312pt row window fits exactly the four 80pt-pitch
  cards the first frame draws (D-019).
- The scenes are **transcribed, not retyped**: 178 boxes across the twelve weeks
  with their radii, gradients, blurs, rotations and polygon clips, pulled off the
  canvas by `scripts/uifinal/gen-week-scenes.mjs` and rendered by one component
  that maps each CSS construct to its `react-native-svg` equivalent.
- Layers wider than the frame (the 473pt swells on a 393pt board) are re-measured
  off the live width, so a narrower phone shows less of the same hill rather than
  a smaller one.
- Row states built to the canvas: done (ink disc + tick), current (2px ink ring +
  crescent + `600` number), locked (**full opacity** — the canvas does not dim it —
  `rgba(19,19,19,0.05)` disc, `inset 0 0 0 1.5px rgba(0,0,0,0.08)`, `#8B8882`
  title, `#B0AEA8` number).
- No progress bar anywhere on these frames; none was added.

### 2.3 The 83 lesson cards — 83 frames

`Lesson 01` … `Lesson 84` (no 32).
New file: `src/app/lesson-card/[day].tsx`.

- Seven-dot rail counting the lesson's place inside its week.
- Eyebrow `LESSON NN · WEEK R` at 11/600/ls 1.4/`#B0AEA8`.
- Title 23/30 at canvas 392, stepping to **20/27 at 396** for long ones — the
  canvas does this for exactly one card (`Lessons From Addiction Recovery`), and
  the size is carried as data rather than computed.
- Summary 15.5/23/`#55534E`, `Start lesson` pill at bottom 88, `Back to Week R`
  at bottom 44.

### 2.4 The curriculum — content

New file: `src/content/curriculum84.ts` (generated).
`UI Final` describes a **different curriculum** from the one the app ships:
twelve weeks of seven lessons, against the app's ten parts of 110 (D-014).
Everything is read off the canvas rather than off the bundle's two stale
intermediates (D-017): week names and blurbs from the twelve `Week …` frames,
lesson titles and summaries from the 83 cards, and every task's copy from its own
rendered `Task DNN` frames.

### 2.5 Today — 3 of 4 frames

`Today Home`, `Today Home II`, `Today Home III`. Spec: `specs/today-home.md`.

| Category | Change |
| --- | --- |
| Structure | Two pages → **three**. Page 1 keeps Day + Score and gains "This morning" + the readings strip (moved off page 2) and the new thirty-day card. Page 2 is "This week" + the lesson card (moved down from page 1) + the task card. Page 3 is the pledge alone. |
| Removed | The three pager dots are **deleted**. |
| New | **"Last 30 days"** — a 369 × 184 card at canvas 492, thirty 20pt marks ten to a row on a 31pt pitch from (35, 58); held `#131313`, not-held `inset 0 0 0 1.5px rgba(0,0,0,0.18)` with no fill; the "27 held" counter derived from the marks. |
| Geometry | Task card 246 → **274**; its night band 96 → **124**; label 114 → **142**, ring 118 → **146**, caption 166 → **194**. |
| Copy | The task card's label is the constant **"Today's task"**, not the step's time of day. |

`Today Home Task` — the lesson-sourced second state of the task card — is
specced but **not built**; see §5.

---

## 3. Differences found on screens that looked unchanged

The rule was that "it looks the same" is not a finding; the comparison table is.
17 spec files carry those tables. Mismatch rows found, by family:

| Family | Frames | Mismatch rows | Built? |
| --- | --- | --- | --- |
| Check-in flows | 10 | 2 | yes |
| Week overviews I–VI | 12 | 33 | yes |
| Week overviews VII–XII | 12 | 41 | yes |
| Today | 4 | 30 | 3 of 4 |
| Lesson reader 1–15 | 15 | 50 | no |
| Lesson reader 16–26 | 11 | 54 | no |
| Lesson reader artwork | 6 | — (5 drawings, all absent from the app) | no |
| Settings | 4 | 35 | no |
| Edit profile | 3 | 34 | no |
| Medallions | 3 | 19 | no |
| Campaign map | 3 | 18 | no |
| Rough days | 4 | 36 | no |
| SOS pickers | 3 | 34 | no |
| Sentence journal | 2 | 15 | no |
| Your vow page | 1 | 29 | no |
| Letter week XII | 1 | 19 | no |
| Check-in times | 2 | 2 | no |
| Subscription | 1 | 8 | no |

The differences are exactly the kind the brief warned about. A sample, all of
them individually listed in the spec files:

- **Settings** replaced the right-aligned `Done` with a left back row and dropped
  the title to app-y 60; re-cut seven app sections into four; section gap 36 → **21/20/21**;
  row heights fixed 52 → **52/48/50/46 per group**; detail text 14 → **13**; the
  outlined sign-out pill became a bare 44-tall text link.
- **Edit profile** — every vertical anchor below the header is stale: monogram
  64 → 112, identity card 220 → 264, Medallions 420 → 458, Journey 550 → 592.
  Two bottom sheets (photo, name) are absent from the app entirely.
- **Medallions grid** — rows moved to left/right 20, gap 17 both axes, cards
  pinned to `height: 168` with uniform `padding: 12`; the app has inset 12,
  gap 10/26, `minHeight: 142`, `paddingTop: 14`.
- **Campaign map** — 1 frame / 4 weeks in the app against 3 frames / 12 weeks in
  the design; `haloTop` is 7 on all twelve rows but 7/8/8/8 in the app's table;
  titleSize is swapped between weeks II and III; the right-hand scroll rail does
  not exist in the app.
- **Rough days** — the page chrome and every copy string already match character
  for character; all 36 mismatches are inside `RDArtwork`, and three of the four
  drawings are total redraws.
- **Lesson reader** — the design draws **no CTA pill** on 24 of the 26 frames and
  renders progress as a 2px `#B4B1AB` hairline at `round((n+1)/26 × 100)%`, where
  the app pins a 52pt ink pill on every step and draws a dot rail. Type is
  uniformly larger in the design: statements 24/32 → **26/38**, prose
  16.5/26 → **21/36**, the epigraph 23/35 Georgia → **28/44 Iowan Old Style**.
- **Check-in times** — 2 mismatches, plus a real bug found in passing:
  `src/components/routines/kit.tsx` paints selected day chips `#1D1C1A` on
  `#131313`, so the letter is invisible; the canvas says `#F4F3F0`.

---

## 4. Every decision, with its reasoning

Full text in `DECISIONS.md`. Summary:

| # | Decision |
| --- | --- |
| D-001 | The bundle is a superset of the previously-implemented one, so it was split and diffed frame by frame: 126 identical, 28 changed, 63 added, 26 removed. The diff directs the work; it does not replace verification. |
| D-002 | `vici-prev.dc.html` is byte-identical to `VICI (previous).dc.html`; both are the previous-generation language (sound library, wake alarms, device pairing) the product no longer has. 174 ledger rows, dispositioned SUPERSEDED, not implemented. |
| D-003 | `Lesson 1 Surviving the Night.dc.html`'s 26 frames are byte-identical to `Lesson Scroll 1…26` once the label attribute is normalised away. Ledgered twice, to be implemented once. |
| D-004 | `L01 Reader 1…25` is a superseded draft: frames 1–3 and 24–25 match the final set, the middle was rewritten and one frame inserted. |
| D-005 | Lint baseline is 24 pre-existing errors in 4 files; the run holds at "no new errors" rather than rewriting unrelated logic. |
| D-006 | The 120-file uncommitted working tree was committed as a baseline first so each screen's commit is an isolated diff. |
| D-007 | Night is six steps and morning is seven, read off the rails the drawn frames state. The two railless asides in each flow were promoted to numbered steps — the only reading in which 5 → 7 is explained by the canvas's own edit. |
| D-008 | The three withdrawn morning boards keep their previous drawing; only their rail index moves. |
| D-009 | `Morning Task Check` carries three values (sun mark, "Today", "Got it") from the board deleted beside it, contradicting its own art, label, sticky note and title. Each property was given to the board it belongs to; nothing drawn was discarded and nothing was invented. |
| D-010 | `DayActionArt` deleted — orphaned by the new shared night art. |
| D-011 | The night flow now writes `emotions` and `reasons`, fields the check-in row already models. |
| D-012 | `/checkin` stays: `Log Chooser` still lists it and `all.tsx` links to it. The design stopped drawing its rail, which is not the same as deleting the route. |
| D-013 | The night moon's crescent is an SVG mask; its box-shadow is redrawn as the Gaussian falloff it actually is. **Platform gap** — see §6. |
| D-014 | `UI Final` carries a 12-week / 84-lesson curriculum against the app's 10-part / 110-lesson one. The screens the design draws are built and the design's data is added; the existing lessons stay because progress, reflections and the backend are keyed on their slugs. |
| D-015 | The design authors exactly one lesson body (lesson 01, the 26 frames). Rule 7 forbids inventing the other 83. |
| D-016 | Lesson 32 has no card frame; Week V still lists it and `task-src.json` still has its task, so the frame is missing, not the lesson. |
| D-017 | The rendered canvas — not `task-src.json`, not `taskgen-meta.js` — is the authority for task copy. |
| D-018 | Three defects in the `Lessons and Tasks` canvas, recorded not fixed: stray style fragments as raw text on two intro frames, two option boards with no rows, and `Task D01` carrying older type metrics than the other 82. |
| D-019 | `Week N` and `Week N P2` are one screen at two scroll positions. |

---

## 5. Where the platform could not match the design exactly

| Place | Design value | What was built | Size of the gap |
| --- | --- | --- | --- |
| `Night 1 Mood` moon glow | `box-shadow: 0 0 18px rgba(221,228,236,0.5)` on a masked shape | A radial with stops at 0.486/0.614/0.743/0.871/1.0 and alphas 0.25/0.154/0.079/0.034/0 | A masked shape cannot carry a box-shadow in RN. The peak alpha is exact; the profile is an erfc fit within ~0.01 alpha across the ramp. |
| Week scenes, `filter: blur(Npx)` on a gradient | 3–6px Gaussian | Absorbed into the gradient's own falloff | The gradient is already a soft ramp; the blur widens it by a few px at most. |
| Week scenes, `filter: blur(Npx)` on a **solid** (the cast-shadow ellipses) | Solid fill + blur | A radial at `1.0 / 0.72 / 0.30 / 0` across the box | RN SVG has no blur filter. This is a fitted falloff, not the true Gaussian. |
| `text-wrap: balance` / `pretty` | CSS line-breaking hints | Not expressible in RN; text wraps greedily | Line-break positions can differ on a two- or three-line title. |
| `borderCurve: 'continuous'` | iOS squircle | Applied where the app already uses it | Android and web fall back to a circular radius. |

---

## 6. What was not implemented, and why

Stated plainly, in descending order of importance.

1. **The 126 unchanged `Email Login` frames were not re-verified against the app.**
   They are byte-identical to the bundle the app was last built against, which
   makes it *likely* they still match — but the brief is explicit that likely is
   not a finding, and no comparison table was written for them. This is the
   single largest gap in the run.
2. **The new lesson reader (26 frames) is specced but not built.** Three spec
   files cover it in full, including a 902-line artwork spec measured in headless
   Chrome. The work is a wholesale replacement of the reader's page grammar — the
   design deletes the CTA pill from 24 of 26 frames, changes progress from a dot
   rail to a 2px hairline, moves every page from top-anchored to flex-centred,
   and raises the whole type ramp. Five drawings have no app equivalent.
3. **The 249 task frames (`Task DNN Intro/Options/Card`) are not built.** The
   copy is extracted and generated into `src/content/curriculum84.ts`, and
   `scripts/uifinal/gen-task-scenes.mjs` extracts all 83 scenes (1,571 layers) to
   `.uifinal/extract/task-scenes.json`, but the scenes contain nested `<svg>`
   subtrees, `conic-gradient` and CSS `mask` constructs that the week-scene
   renderer does not yet handle, and the three boards were not written.
4. **Twelve specced screen families were not built** — settings, edit profile,
   medallions, campaign map, rough days, SOS pickers, sentence journal, your vow
   page, letter week XII, check-in times, subscription, and `Today Home Task`.
   Each has a complete property spec and comparison table in `specs/`, so the
   remaining work is transcription, not analysis.
5. **The three verification passes did not run.** No row reached `PASS_1`, and
   therefore none reached `DONE`. The 120 `IMPLEMENTED` rows were each built with
   the design file and the app file open together and verified by typecheck, lint
   and a web bundle, but they have not had the separate property audit, coverage
   audit and fresh-eyes audit the brief specifies.
6. **The final straggler scan did not run.** One orphan was found and removed in
   passing (`DayActionArt`); no systematic sweep for dead style objects, orphaned
   components or unused assets was done. `src/components/ChallengeSheet.tsx` was
   reported by a spec agent as orphaned in HEAD and matching no frame in the
   bundle — worth checking first in any follow-up.

**Verification method used, and its limit.** Every commit was gated on
`tsc --noEmit` (clean throughout), `expo lint` (held at the 24-error pre-existing
baseline, never above it) and `expo export --platform web` (successful). No
screenshot comparison was run: the project's own history records that a static
`<Svg>` paints *under* its absolutely-positioned siblings on web while being
correct on device, so a web screenshot is not evidence about the device, and a
rect-based layout check cannot see art that has gone missing. Device screenshots
were not available in this run.

---

## 7. Tooling left behind

Reusable, and the reason each exists:

| File | What it does |
| --- | --- |
| `scripts/uifinal/split.mjs` | Splits a `.dc.html` canvas into one file per `data-screen-label` frame |
| `scripts/uifinal/pretty.mjs` | Pretty-prints a frame one CSS declaration per line, so `diff` output is legible |
| `scripts/uifinal/diff.mjs` | Frame-by-frame diff of two split canvases — identical / changed / added / removed |
| `scripts/uifinal/ledger.mjs` | Regenerates `UI_FINAL_LEDGER.md` from the split index; cannot drop a row |
| `scripts/uifinal/map.mjs` | The design-frame → app-file map and each frame's disposition |
| `scripts/uifinal/status.mjs` | Sets a row's status and stamps the verification date |
| `scripts/uifinal/gen-curriculum.mjs` | Generates `src/content/curriculum84.ts` from the canvas |
| `scripts/uifinal/gen-week-scenes.mjs` | Transcribes the twelve week scenes into `src/content/weekScenes.ts` |
| `scripts/uifinal/gen-task-scenes.mjs` | Extracts all 83 task scenes to `.uifinal/extract/task-scenes.json` |

`.uifinal/` is gitignored and fully regenerated by `split.mjs` + `pretty.mjs`.

---

## 8. The full `UI Final` file list

288 files, and the arithmetic closes: **20 opened (✓) + 268 inventoried by path
(○) = 288**. ✓ = opened and read during this run. ○ = inventoried by path and
type but not opened — the author's own measurement harnesses, their verification
screenshots, reference screenshots of other apps, and binary documents. None of
those is a design source: the design medium is the HTML, and the bundle's own
README says so.

### Design sources — all ✓

| File | Frames | Disposition |
| --- | --- | --- |
| ✓ `README.md` | — | Read; names `Email Login.dc.html` as primary |
| ✓ `project/Email Login.dc.html` | 217 | Primary canvas |
| ✓ `project/Lessons and Tasks.dc.html` | 357 | Curriculum + tasks |
| ✓ `project/Lesson 1 Surviving the Night.dc.html` | 26 | Duplicate of `Lesson Scroll 1…26` (D-003) |
| ✓ `project/VICI (previous).dc.html` | 87 | Superseded (D-002) |
| ✓ `project/vici-prev.dc.html` | 87 | Byte-identical duplicate of the above (D-002) |
| ✓ `project/exports/Journey Campaign.html` | 1 | Unchanged from the previous bundle |
| ✓ `project/exports/Lesson Detail.html` | 1 | Unchanged |
| ✓ `project/exports/Lesson Parts.html` | 1 | Unchanged |
| ✓ `project/task-src.json` | — | 84 daily tasks; superseded by the frames for copy (D-017) |
| ✓ `project/taskgen-meta.js` | — | Task generator metadata; superseded by the frames |
| ✓ `project/taskgen-visuals.js` | — | Scene builders, icon set, five palettes |
| ✓ `project/support.js` | — | Canvas host shim, not a design |
| ✓ `project/image-slot.js` | — | Canvas host shim |
| ✓ `project/ios-frame.jsx` | — | Canvas host shim |
| ✓ `project/screenshots/apply-tasks.js` | — | The script that injected the task scenes; read to learn the scene's placement |
| ○ `project/screenshots/*.html` (29 files) | — | Author's own measurement harnesses, not screens |
| ○ `project/screenshots/*.js` (6 further files) | — | Author's own apply scripts |
| ○ `project/screenshots/*.png` (55 files) | — | Author's verification screenshots |
| ○ `project/uploads/*.png`, `*.PNG` (161 files) | — | Reference screenshots of other apps + pasted images |
| ○ `project/uploads/*.webp` (12 files) | — | Art assets; the ones the app uses are already in `assets/images` |
| ○ `project/uploads/*.docx` (5 files) | — | Author's notes |
| ✓ `project/noise.png`, `project/noise-dark.png` | — | Already in `assets/images` |
| ✓ `project/laurel-mark.webp` | — | Already in `assets/images` |
| ○ `project/.thumbnail` | — | Canvas thumbnail |

Breakdown of the 268 ○ files: `project/screenshots` holds 29 `.html` measurement
harnesses, 6 further `.js` apply scripts and 55 `.png` verification shots;
`project/uploads` holds 161 `.png`/`.PNG`, 12 `.webp` and 5 `.docx`.

Every one of the 777 frames inside the ✓ HTML files has its own ledger row with
its own status; §1 is the count.

---

## 9. If this run is picked up again

In this order:

1. Run the property audit over the 126 unchanged frames — that is the known gap,
   and `diff.mjs` already proves the *design* did not move, so the work is
   entirely design-vs-app.
2. Build the twelve specced-but-unbuilt families. The specs carry the numbers;
   no further analysis is needed.
3. Build the lesson reader from `specs/lesson-reader-*.md`. Read the artwork
   spec's §2 first — it documents three bugs in the app's existing blur
   substitute (`SignWash`) that every new drawing would otherwise inherit.
4. Extend `WeekScene`'s renderer to nested `<svg>`, `conic-gradient` and CSS
   masks, then drive the 83 task scenes off `.uifinal/extract/task-scenes.json`.
5. Then the three passes, and only then `DONE`.
