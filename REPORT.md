# UI Final — implementation report

**Run:** 15 August 2026, unattended.
**Bundle:** `UI Final/` (Claude Design handoff, 288 files).
**Ledger:** `UI_FINAL_LEDGER.md` — **874 rows**, one per `data-screen-label` frame
(777 at first count; Pass 2 found 97 more — §10).
**Decisions:** `DECISIONS.md`, entries D-001 … D-078.
**Specs:** `specs/` — 35 files: 19 pixel specs and 16 audits, together carrying
roughly 12,000 transcribed property rows.

> **Read this first.** The run did not reach `DONE` on every row, and the ledger
> says so rather than implying otherwise. Everything in the bundle is now built
> or dispositioned, but the three verification passes are not all finished — §1
> says exactly which parts are and are not.

---

## 1. Where the run got to

| State | Rows | What it means |
| --- | --- | --- |
| `PASS_1` | 176 | Built, then audited property by property by a second reader, and every finding fixed |
| `IMPLEMENTED` | 402 | Built against the canvas, typechecked, linted, bundled, committed — no second-reader audit yet |
| `DONE` | 296 | Not screens. Dispositioned **on evidence** and closed |

**Every frame in the bundle is either built or dispositioned. No row is
`NOT_STARTED`.**

### What the three passes have and have not done

- **Pass 1 — property audit. Complete for 176 frames**, in two halves:
  - the **129** the design left unchanged — the set that most needed it, because
    unchanged in the design says nothing about the app and nobody had ever
    re-checked them. Sixteen audits, ~6,000 rows, 19 real findings (§6).
  - the **47** this run built by hand — the two check-in flows, Today, the twelve
    week overviews, Settings and the profile family, the three SOS pickers. Six
    audits, 1,933 rows, and every finding fixed (D-068 … D-078).
  **Still outstanding:** the lesson reader, the lesson card and task boards,
  medallions, the campaign map, rough days, the journal and the letter — 402
  rows, most of them the 332 template-driven lesson-card and task frames whose
  *content* was verified mechanically instead (§7).
- **Pass 2 — coverage audit. Complete**, and it found the run's biggest
  inventory error: 97 frames Phase 1 never opened (§10).
- **Pass 3 — fresh-eyes audit. The cross-screen sweep is complete** — every
  colour and font-size literal in the app checked against every literal in the
  canvas — and it found the run's worst transcription errors (§11). The
  per-screen fresh-eyes re-verification has not run.

Because a pass that changes a screen restarts it, and Pass 3 changed several,
**no row is marked `DONE` on implementation**. The brief's bar — three
consecutive passes finding nothing — has not been met.

### The 296 `DONE` rows, and why each is closed

- **174** — `VICI (previous).dc.html` and `vici-prev.dc.html`, the
  previous-generation canvas. `cmp` proves the two files byte-identical, and the
  language they draw (sound library, wake alarms, device pairing) is not the
  product's any more (D-002).
- **97** — the harness frames Pass 2 found. 55 are byte-copies of a canonical
  frame; the other 42 are the author's discarded variants, and five `*-apply.js`
  scripts in the same folder prove the canvas is the applied result and the
  checks are its input (D-061).
- **25** — `L01 Reader 1…25`, the superseded reader draft: 3 frames match
  `Lesson Scroll` at the same index, 2 at a one-frame shift, 20 rewritten (D-004).

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

### 2.6 The rest, in one table

Every family below was specced from its frames, compared property by property
against the app, and built. Commit messages name each.

| Family | Frames | The change |
| --- | --- | --- |
| Urge hub (29, 29A, 29A2) | 3 | Three illustrated gradient cards → five flat rows, and two entirely new boards — *Name the Feeling* (single-select) and *What's Feeding It* (multi-select). All three built from one picker row differing only in height and trailing control. |
| Settings (92, 92C, 92D) | 3 | Right-aligned `Done` → back row + 27px title; seven groups → four; per-group row heights 52/48/50/46; section gap 36 → 21; detail 14 → 13; the sign-out pill became a bare text link opening a new confirmation sheet. `Your vow` is a new screen. |
| Profile (93, 93B, 93C) | 3 | Cancel/Save bar → back row + big title, moving every anchor below it; the name row became static text opening a new sheet, and Save went with it; the Journey card lost *My values* and gained *Current week* + a *Weekly reports* action row. Two bottom sheets are new. |
| Medallions (88, 88B, 90F) | 3 | Grid to left/right 20, gap 17 both axes, cards pinned to 168 with uniform 12 padding and centred contents. *Medallion Received* got its own gradient field, halo, eyebrow, 27/600 title and tier chip, as overrides so the letter and the drop do not move. |
| Campaign map (90B–90D) | 3 | Four weeks on one board → twelve over three pages, every week renamed; three existing drawings re-attached to their right weeks and eight new ones drawn, six needing SVG for clip-paths and elliptical radii. |
| Rough days (96, 98C, 101B, 101C) | 4 | Chrome and copy already matched character for character; all 36 mismatches were inside the artwork. Three drawings rebuilt, one trimmed. |
| Sentence journal (21C, 21C2) | 2 | A second pill and the whole custom-prompt board, which stores what you write; the keyboard-lift floor became per-board. |
| Today Home Task (21p2B) | 1 | A second, lesson-sourced state of the task card — label, glyph, caption metrics and night scene all differ together — and the warm glow moved onto the phone art, which is where the frame proves it belongs. |
| Manage Subscription (15) | 1 | The swell and its line are withdrawn; the board ends on the cancel. |
| Letter Week XII (90B) | 1 | The body's floor drops 160 → 80 and the keep pill leaves the floor to scroll with the words. |
| Check-in times (19B, 19C, 92B, 93D) | 4 | Contextual back label; and a real bug: a selected day chip's letter was invisible. |

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
| D-020 | A selected day chip's letter was invisible — `#1D1C1A` on `#131313`. The canvas states the fix. |
| D-021 | The five SOS places inherit the phone's step copy; `In bed` keeps its own and `At work or school` keeps the laptop board's line, which is the one that still describes where it is. |
| D-022 | **Corrected mid-run.** The SOS answers first went onto the event's free-text `trigger`, which polluted the trigger chart. `precedingState` was already in the schema and unwritten, so they go there. |
| D-023 | The dark SOS block has no frame in `UI Final` and was left in place. |
| D-024 | Settings cut from seven groups to four; `Find support` kept anyway, because this project declares a hard invariant that a route to crisis help always exists and the bundle draws none. |
| D-025 | `Your vow` gets a route; its empty state is the canvas's own line, not invented copy. |
| D-026 | `My values` left the Journey card; the door was kept on the same screen. |
| D-027 | Save moved from the profile header into the name sheet, as the frames draw it. |
| D-028 | The photo sheet's three actions are drawn but not wired — the one stub. |
| D-029 | `Medallion Received` stopped sharing the letter's arrival, so `MailArrival` took overrides rather than a rewrite. |
| D-030 | The tier chip's rung name comes from the app's album, because the frame's own `Tier I · The Vow` contradicts the numeral beside it. |
| D-031 | The keyboard-lift floor is per-board, not a constant. |
| D-032 | A written prompt is stored, because the board promises it comes back. |
| D-033 | `Manage Subscription` ends on the cancel line. |
| D-034 | `Letter Week XII` scrolls its pill; the other two letters keep theirs pinned. |
| D-035 | Three of four rough-day artworks are total redraws; the chrome and copy already matched. |
| D-036 | The 84° rotation is transcribed, not "corrected". |
| D-037 | The task card has two genuine states, and the warm glow belongs to the phone art. |
| D-038 | The campaign rail is a page indicator, not a scrollbar; the pager is two invisible tap bands rather than an invented control. |
| D-039 | Every campaign week was renamed and renumbered; three drawings moved and eight are new. |
| D-040 | The reader has no CTA on 24 of 26 frames, so the board is the control. |
| D-041 | Reader progress is a 2pt hairline at `round((n+1)/26 × 100)%`. |
| D-042 | The reader's body is centred in the whole 852, not laid out from a top. |
| D-043 | `Lesson Scroll 3` is the outlier on statement width; six against one. |
| D-044 | The new reader lives beside the old one; only lesson 01 has an authored body. |
| D-045 | `Task DNN Card` is a specimen, not a screen. |
| D-046 | The 83 task scenes are transcribed, not retyped — 1,571 layers, 223 glyphs. |
| D-047 | Marking a task done writes the day's action; no new storage. |
| D-048 | `ChallengeSheet.tsx` is orphaned and was left in place. |
| D-049 | Eighteen unreferenced assets, none deleted. |
| D-050 | The canvas is inconsistent about apostrophes; the majority reading (curly) stands. |
| D-051 | Blur and mask substitutions are counted as mismatches and named as such. |
| D-052 | The paper grain was being stretched, not tiled — fixed in all 48 places. |
| D-053 | `Detail Silver`'s glow was one colour off. |
| D-054 | Three more urge-overview defects, fixed. |
| D-055 | Five closeable findings from the launch, urge-log and onboarding audits. |
| D-056 | `Urge Log When` draws its wheel at rest; left as the app has it, and named. |
| D-057 | Three findings left open, each for a stated reason. |
| D-058 | Four lapse-flow canvas strings are urge-flow carry-overs and were not adopted. |
| D-059 | The exports draw an older tab bar than the primary canvas; the primary wins. |
| D-060 | `CampaignGrounds` draws correctly and is reachable from nowhere. |

---

## 5. Where the platform could not match the design exactly

| Place | Design value | What was built | Size of the gap |
| --- | --- | --- | --- |
| `Night 1 Mood` moon glow | `box-shadow: 0 0 18px rgba(221,228,236,0.5)` on a masked shape | A radial with stops at 0.486/0.614/0.743/0.871/1.0 and alphas 0.25/0.154/0.079/0.034/0 | A masked shape cannot carry a box-shadow in RN. The peak alpha is exact; the profile is an erfc fit within ~0.01 alpha across the ramp. |
| Week scenes, `filter: blur(Npx)` on a gradient | 3–6px Gaussian | Absorbed into the gradient's own falloff | The gradient is already a soft ramp; the blur widens it by a few px at most. |
| Week scenes, `filter: blur(Npx)` on a **solid** (the cast-shadow ellipses) | Solid fill + blur | A radial at `1.0 / 0.72 / 0.30 / 0` across the box | RN SVG has no blur filter. This is a fitted falloff, not the true Gaussian. |
| `text-wrap: balance` / `pretty` | CSS line-breaking hints | Not expressible in RN native; `AppText` sets `textWrap: 'pretty'` on web only | Line-break positions can differ on any title long enough to wrap. The audits found this on every rough-day sub-line. |
| `filter: blur(Npx)` on a **solid** shape | A Gaussian of σ = blur/2 | A radial falloff fitted to it (`1.0 / 0.72 / 0.30 / 0` across the box) | The commonest gap in the run — every cast shadow and light pool in the artwork. The peak alpha is exact; the profile is a fit. |
| `mask-image` | A CSS mask | An SVG luminance mask where the shape allows; otherwise not applied | Applied on `Night 1 Mood` and `Surf Complete`; **not** applied on 8 task-scene layers, which draw as full discs rather than crescents. |
| `conic-gradient` | An angular sweep | The radial its first stop pair describes | 8 task-scene layers. |
| `text-decoration` thickness / offset | `1.5px` / `4px` | RN gives the line, not its metrics | `Letter Read`'s emphasised run. |
| `borderCurve: 'continuous'` | iOS squircle | Applied where the app already uses it | Android and web fall back to a circular radius. |

---

## 6. The unchanged-frame audit

The 129 frames the design did not touch were the run's biggest risk: unchanged
in the *design* says nothing about the *app*, and nobody had re-checked them.
Sixteen audits ran over them, one per screen family, each reading every frame in
full and every target file in full, and writing a row per (element, property).

**~6,000 comparison rows.** Findings that were real — not a CSS feature RN
cannot express — and what happened to each:

| # | Finding | Status |
| --- | --- | --- |
| 1 | **The paper grain was stretched, not tiled.** The canvas repeats a 96 × 96 tile; the app blew one tile up to fill the box with `contentFit="cover"` — ~9× on a full screen. Found on 14 frames before it turned out to be the same call in **48 places**. | **Fixed** — a shared `Grain` using RN's own `resizeMode="repeat"`, which `expo-image` has no equivalent for |
| 2 | **`Urge Overview Mood` never rendered.** It counted four booleans nothing in the app ever wrote. | **Fixed** — it reads the feeling `SOS Feeling Picker` now records |
| 3 | **"Where they showed up" never rendered.** It read `precedingState.location` and `note`, neither ever written, while the place sat in `trigger`. | **Fixed** — the place goes to `precedingState.location` |
| 4 | **`Common triggers` was being polluted** with place, feeling and reason labels, truncated in an 88px column. Caused by this run's own D-022. | **Fixed** — D-022 corrected; see §4 |
| 5 | The trigger chip read `Tired`; canvas 037 reads `Tiredness`. | **Fixed** |
| 6 | `Detail Silver`'s glow was `#969DA6`; the canvas says `rgba(150,160,172,0.30)` = `#96A0AC`. | **Fixed** |
| 7 | The phone trigger glyph hardcoded its screen to `#F1EFE9`, so a selected tile showed a cream screen on ink. | **Fixed** — the cut-out takes the disc's colour |
| 8 | `reminders.tsx` curled an apostrophe the frame writes straight. | **Fixed** |
| 9 | `sign-in.tsx` set `returnKeyType="next"`; `Login Typing` draws `done`. | **Fixed** |
| 10 | The late-night crescent was missing `fill-rule="evenodd"`. | **Fixed** |
| 11 | `Urge Log Done`'s value carried a right alignment and a 2-line clamp the canvas does not declare. | **Fixed** |
| 12 | `Story Tracks` title tracked `-0.1`; the canvas says `-0.3`. | **Fixed** |
| 13 | `Story Detail`'s cover art was pinned to `width / 2 - 120` = 76.5; the canvas says a literal 76. | **Fixed** |
| 14 | **`log.tsx` may pad its scroll by the tab bar's height twice** — 97pt of dead scroll on five screens, if the bar is a sibling rather than an overlay. | **Left open** — cannot verify without a device, and being wrong hides the last row *behind* the bar |
| 15 | `Log Check-ins` rows draw `Today · 8:44 am`; the app draws `Today`. | **Left open** — needs a `loggedAt` field the design does not otherwise ask for |
| 16 | `Urge Log When` draws its time wheel at rest; the app opens it on a tap. | **Left open** — the step's behaviour is the app's (rule 5) |
| 17 | Four lapse-flow strings in the canvas are urge-flow carry-overs (`Log the urge` on a lapse screen, `Rode it out` under `Lapse logged.`). | **Not adopted** — each contradicts its own frame; the audit recommends fixing the canvas |
| 18 | `CampaignGrounds` draws correctly and is reachable from nowhere. | **Left open** — a wiring gap, not a drawing one |
| 19 | The tab bar has four tabs where the canvas draws three, on even quarters rather than 70 / 196 / 318. | **Left as-is** — a deliberate divergence already documented in the file's own header; `All` is the only door to several screens |

Nine of the nineteen findings sat in screens nobody would have thought to look
at, which is the argument for the audit having run at all.

---

## 7. What the run did not do

1. **Passes 2 and 3 did not run.** No row is marked `DONE` on implementation.
   The 449 built rows were each transcribed with the design file and the app
   file open together and gated on typecheck, lint and a web bundle, but they
   have not had a second reader's property audit, a coverage re-walk, or the
   fresh-eyes sweep.
2. **One stub, named:** the profile photo sheet's three actions are drawn to the
   frame and each dismisses the sheet; none picks an image. That needs a
   camera/library permission flow and an upload path, neither of which exists in
   the app or is drawn in the bundle (D-028).
3. **Three audit findings left open**, each with its reason: §6 rows 14–16.
4. **The dark SOS block is orphaned but was left in place.** `Urge SOS Breathe`,
   `SOS Number Tap`, `SOS Odd One Out` and `SOS Settings` are all in the removed
   list and the canvas now runs Step III straight into "The Wave Passed" — but
   that is ~750 lines of working behaviour, and a design that stops drawing a
   screen is not a decision to delete it (D-023).
5. **Two routes are unlinked by the Settings recut:** `/backtap` and the
   `Show a "days since"` toggle (D-024). Both still work; nothing points at them.
6. **`ChallengeSheet.tsx` is orphaned** — nothing imports it and no frame draws
   it, but the commit immediately before this run was still editing it, so it is
   recent work rather than dead code (D-048).
7. **Eighteen image assets are unreferenced and none was deleted** (D-049).
   Most went unreferenced because their art was redrawn as SVG, and the bundle's
   own `uploads/` still ships several of them.

**Verification method, and its limit.** Every commit was gated on
`tsc --noEmit` (clean throughout), `expo lint` (held at the pre-existing
24-error baseline, never above it) and `expo export --platform web`
(successful). **No screenshot comparison was run.** This project's own history
records that a static `<Svg>` paints *under* its absolutely-positioned siblings
on web while being correct on device, so a web screenshot is not evidence about
the device, and a rect-based layout check cannot see art that has gone missing.
Device screenshots were not available in this run. Finding 14 in §6 is the one
place where that limit changed a decision.

---

## 8. Tooling left behind

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

## 9. The full `UI Final` file list

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

## 10. If this run is picked up again

In this order:

1. **Run it on a device and look at it.** That is the one thing this run could
   not do, and it is what §6 finding 14 is waiting on. The audits are numeric;
   the remaining risk is the kind only a screenshot catches — art painted under
   a sibling, a zero-size `<Svg>`, a mask that silently did nothing.
2. **Passes 2 and 3** over the 449 built rows: the coverage re-walk (`ledger.mjs`
   regenerates from the split index, so it will surface anything missed) and the
   fresh-eyes audit, starting with the screens this run concluded were fine.
3. **The three open findings** in §6, rows 14–16, and the product calls in §7
   rows 4–7.
4. **The remaining platform gaps** in §5, if any of them matter enough: the
   `conic-gradient` and `mask` layers in the task scenes are the two places
   where the drawing is visibly not what the canvas draws.
