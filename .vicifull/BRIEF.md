# VICI — `Latest Vici FULL` parity run (Sep 2026). Shared brief.

Read this before touching anything. It is the same for every agent on this run.

## What the job is

`Latest Vici FULL/` (dropped 5 Sep 2026) is a Claude Design handoff bundle and the **single
source of truth** for the final UI. The running Expo app must match it pixel for pixel, on
every screen and every state. "Same general style" is not enough. Copy the canvas's numbers
character for character — do not round, do not substitute a theme token whose value differs,
do not improve spacing, do not infer geometry from a screenshot when the CSS states it.

## Where everything is

| thing | path |
| --- | --- |
| design bundle | `Latest Vici FULL/project/*.dc.html` |
| split frames (this drop) | `.vicifull/final/<Bundle>/<Frame>.html` |
| split frames (previous drop) | `.vicifull/prev/<Bundle>/<Frame>.html` |
| per-frame unified diffs prev→final | `.vicifull/fdiff/<Frame>.diff` |
| per-bundle add/remove/change summary | `.vicifull/diffs/<Bundle>.txt` |
| frame → status → app-file map | `.vicifull/MAP.md`, `.vicifull/map.json` |
| structured scene JSON | `.vicifull/scenes/<Bundle>.json` |
| existing per-screen specs (previous drop) | `specs/*.md` |
| existing gap reports (previous drop) | `.uifinal1/gaps/*.md` |
| project decisions & conventions | `DECISIONS.md` (D001–D045, plus this run's D046+) |
| **findings the orchestrator already holds** | **`.vicifull/FINDINGS.md` — read it, it may already cover your group** |
| the canvas's own flow order, all 267 frames | `.vicifull/FLOW.txt` |
| the new questionnaire spec (logic + branching) | `.vicifull/QUESTIONNAIRE-CHANGES.txt` |
| every canvas string checked against `src/` | `node scripts/vicifull/copy-sweep.mjs <bundle> --missing` |

Bundle slugs: `Email-Login` (267 frames — the whole app), `Lessons-and-Tasks` (357),
`Lesson-1-Surviving-the-Night` (26), `Medallions-v2` (17), `Week-01-Reset` … `Week-12-Leave-It-Behind`,
`VICI-previous` / `vici-prev` (reference only, **not** build targets — DECISIONS D003).

## Reading a frame

Never open the raw `.dc.html` (2 MB). Use the split frame plus the transcriber:

```bash
node scripts/vicifull/body.mjs .vicifull/final/Email-Login/Login.html
```

That prints the frame's whole tree — every offset, colour, radius, shadow, type metric and
SVG attribute, verbatim from the canvas's own inline styles, with the phone chrome removed.
Those numbers are the specification. To see what changed since the drop the app was built
against: `cat .vicifull/fdiff/<Frame>.diff`.

## Two servers are already running

* `http://localhost:8097` — the design frame server.
  `GET /f/<bundle>/<Frame>.html` renders one frame standalone, pinned at 0,0.
* `http://localhost:8096` — the Expo web build of the app, `EXPO_PUBLIC_FORCE_MOCK=1`.
  It hot-reloads; other agents are editing at the same time, so a bundle error you did not
  cause may appear — re-check before chasing it.

Do **not** use the Browser-pane MCP tools (`mcp__Claude_Browser__*`). There is one shared
pane and several agents. Capture headlessly instead:

```bash
# a design frame: PNG + layout signature
node scripts/vicifull/shot.mjs design Email-Login Login.html .vicifull/shots/d-login.png --sig=d-login
# the app at a route: PNG + layout signature
node scripts/vicifull/shot.mjs app "/sign-in" .vicifull/shots/a-login.png --sig=a-login
# extra options: --seed (load the mock dataset then reload), --script=<file.js>
#   (evaluate a JS file in the page to drive it into a state), --wait=<ms>, --port=<n>,
#   --initseed=<file.js> (put a dataset into localStorage BEFORE the first paint — use this,
#   not --seed, for a route like /day/morning that nothing signs a mock user in to; a
#   post-load seed needs a reload and a reload destroys the context you are driving from.
#   .vicifull/day-seed.js is a ready-made account: Marcus, day 13, yesterday clean.)
node scripts/vicifull/sigdiff.mjs d-login a-login
```

A signature row is
`tag | left | top | width | height | background | radius | opacity | shadow | type | text`
in frame coordinates, one line per visible box. Diffing two signatures is how parity is
proved. **A screenshot alone is not proof of parity, and a signature alone is not proof the
art is visible** — see the SVG trap below. Do both.

## Canvas → app translation rules

1. **The status bar and home indicator are chrome the app never builds** (DECISIONS D009).
   A canvas `top: 380` is therefore written in the app as `top: 326` **measured from the
   safe-area top**, i.e. canvas-y minus 54. `body.mjs`, `scene.mjs` and the probe all drop
   the chrome already.
   In the mock web preview the root layout injects `{top: 54}` as the safe-area inset
   (`src/app/_layout.tsx`, `CANVAS_INSETS`), **so a captured app signature lands on the
   canvas's own y and the two signatures compare directly, with no offset to apply.**
   If a captured row is exactly 54 off, the screen is measuring from the screen edge where
   it should measure from the safe area (or the reverse) — that is a real bug, not an
   artefact.
2. **Bottom-anchored offsets are measured off the frame edge, not the safe-area inset**
   (D026).
3. `filter: blur()` on a radial wash has no RN equivalent and needs none (D010); the
   two background washes therefore always report a `border-radius` mismatch (D015). Those
   two rows are the *only* signature mismatches you may leave standing without a note.
4. A canvas `<span>` is usually an app `View` + `Text` (D022); CSS's strut sometimes needs
   an explicit `lineHeight` in the app (D020); CSS collapses adjacent vertical margins and
   Yoga does not (D023).
5. Colours, radii, letter-spacing, font-size, font-weight and line-height are transcribed
   exactly. `letter-spacing:-0.2px` is `letterSpacing: -0.2`, not `-0.2%` and not omitted.

## The SVG trap — read this, it has cost this project screens before

`react-native-svg`'s web build lays `<Svg>` out `position: static`, and CSS paints every
positioned box above every non-positioned one. An `<Svg>` sharing a parent with an
absolutely-positioned box therefore renders **invisible on web** while being correct on
device, and `getBoundingClientRect` still reports it at the right coordinates — so a
signature diff passes with the artwork entirely gone.

* Any `<Svg>` with an absolutely-positioned sibling must carry
  `style={{ position: 'absolute', top: 0, left: 0 }}`.
* Never pass `rotation`/`originX`/`originY` to `<Svg>` — it leaks a raw `transform-origin`
  DOM attribute and rotates about (0,0). Use a `transform="rotate(a cx cy)"` string.
* A zero-size `<Svg>` is the other way art vanishes while coordinates check out.
* **Always look at the PNG as well as the numbers.**

## House style for the code you write

Match the file you are editing: its comment density, naming and idiom. This codebase writes
comments that explain *why* — a canvas contradiction, a platform divergence, a decision —
not what the next line does. Keep the canvas's own strings verbatim, including the curly
apostrophes (`’`), the middot separators (`·`), en/em dashes and the exact capitalisation.

Do not touch `src/lib/theme.ts` or anything under `src/components/ui/` without saying so in
your report — they are shared by every screen and another agent is probably on the other end.

## What "done" means for one screen

1. Every string, capitalisation, punctuation and line break matches the frame.
2. Every position, size, margin, padding, gap, radius, border, shadow, opacity and
   background matches the frame's numbers (minus the 54).
3. Every type metric matches: family, size, weight, tracking, line height, colour.
4. Icons and artwork are the frame's own paths, at the frame's own sizes and positions.
5. Every visible state the frame family draws — active, selected, completed, empty,
   disabled, locked, expanded — is reproduced.
6. A signature diff against the design frame is clean apart from the two washes (rule 3),
   and the PNGs of both sides look the same.

Report honestly. If something could not be matched, say which frame, which property, and
why. Where the canvas contradicts itself, name the contradiction and say which reading you
took and on what evidence — do not hide the judgement call.

## Generated content files — DO NOT HAND-EDIT

Eight content files carry a `GENERATED FILE — do not edit by hand` header. They are transcribed
out of the canvas by a generator, and hand-editing them is both wrong and temporary: the next
regeneration silently reverts it.

| generated file | generator (previous drop) | reads |
| --- | --- | --- |
| `src/content/lessonReader.ts`, `src/content/coverScene.ts` | `scripts/vicifull/gen-lesson-scrolls.mjs` | `.vicifull/lessons/Week */`, `.vicifull/lessons/Lesson 1 …/` |
| `src/content/lessonPlates.ts` | `scripts/vicifull/gen-lesson-art.mjs` | same |
| `src/content/readerRoom.ts` | `scripts/uifinal/gen-reader-art.mjs` | same |
| `src/content/curriculum84.ts` | `scripts/uifinal/gen-curriculum.mjs` | the week canvases |
| `src/content/weekScenes.ts` | `scripts/uifinal/gen-week-scenes.mjs` | the week canvases |
| `src/content/taskScenes.ts` | `scripts/uifinal/gen-task-art.mjs` | `Lessons and Tasks` |
| `src/content/onboardingFunnel.ts` | `scripts/uifinal1/gen-funnel.mjs` | `.vicifull/scenes/Email-Login.json` |
| `src/content/onboardingTail.ts` | `scripts/uifinal1/gen-tail.mjs` | `.vicifull/scenes/Email-Login.json` |
| `src/content/weekXiiLetter.ts` | `scripts/uifinal1/gen-letter.mjs` | `.vicifull/scenes/Email-Login.json` |

Copies of the first two families already point at this drop's split
(`scripts/vicifull/gen-lesson-scrolls.mjs`, `scripts/vicifull/gen-lesson-art.mjs`). The
`scripts/uifinal1/*` ones still read `.uifinal1/scenes/…`, the PREVIOUS drop.

**If a generated file is wrong, fix the generator and re-run it — do not patch the output.**
Fork the generator into `scripts/vicifull/`, repoint its input at this drop
(`.vicifull/scenes/Email-Login.json`, `.vicifull/lessons/…`), extend it for any frame the new
bundle added or withdrew, run it, and check the diff. Say in your report which generator you
changed and what the regeneration moved.

## The flow order: `.vicifull/FLOW.txt`

The canvas parks a sticky note in the gap after each frame naming the screen that follows, with
the design's own badge number (`26A · Start Here — Step 1`). `.vicifull/FLOW.txt` is that chain,
extracted for all 267 frames. **It is the authority on flow order and on a screen's design badge
wherever a rail, a spec or an old export disagrees.**

`Latest Vici FULL/project/exports/onboarding-flow.json` is NOT: it still lists `What Happens
First`, `Root Loop`, `Results Pattern` and `Free Trial Paywall`, all four withdrawn from this
drop, and its copy differs from the frames'. Intermediates lose to frames (DECISIONS D007).

## The questionnaire spec: `.vicifull/QUESTIONNAIRE-CHANGES.txt`

New in this drop: `Latest Vici FULL/project/uploads/VICI_Questionnaire_All_Changes.docx`,
extracted to `.vicifull/QUESTIONNAIRE-CHANGES.txt`. It is a screen-by-screen change log for
onboarding screens **03–24** with the global wording rules, the deletions, and — the part no
frame can state — the **branching logic**:

* 04 Age: under 18 leaves the adult onboarding flow.
* 09A Previous quit attempts → 09B Relapse (`V3 Q3b`) **only** when 09A is one of the two
  "Yes" answers; skipped entirely for "No".
* 12 "Nothing in particular", 14 "Nothing obvious" and 22 "Nothing yet" are each exclusive with
  every other option on their screen.
* 17 affected areas: **maximum three**; zero allowed when Impact = "Not really".
* 18 Loneliness and 19 Time alone are conditional — shown when earlier answers include
  loneliness, being home alone, or rejection/argument.
* 23 Goal confirmation branches on the stated goal and carries a fifth line when masturbation =
  "Keep it, just without porn".

Where the doc's copy and a frame's copy differ (they do in places — the doc writes "That's what
we'll build around" where `Goal Confirmation` draws "That's what we'll work toward"), **the frame
wins for anything visible** and the doc governs logic, branching and the variants no frame draws.

## Record how you reached each screen: `.vicifull/recipes/<group>.json`

Driving the app to a screen is the expensive part of verifying it, and this run audits every
screen at least twice. So whenever you capture an app screen, write down how you got there.

Append to (or create) `.vicifull/recipes/<yourgroup>.json`, an array of:

```json
{ "frame": "Morning Feeling", "route": "/day/morning", "seed": true,
  "do": "await tap('Start'); await tap('Yes'); await tap('Continue')",
  "wait": 1600, "note": "the mock account must have yesterday's task open" }
```

Use `"unreachable": "<why>"` instead of `do` for a screen you could not drive to. The next pass
reads this file rather than rediscovering the path, so an accurate recipe — including the ones
that failed — is part of the deliverable.

## The audit runner, and what a signature difference is allowed to be

`node scripts/vicifull/audit.mjs [--group=<key>] [--frame=<label>]` walks
`.vicifull/recipes/*.json`, captures both sides of every frame, diffs them, and writes
`.vicifull/audit/report.md` and `report.json`. A frame with no recipe is reported **NO RECIPE**,
never skipped — that is how coverage becomes a fact.

A recipe may carry: `route`, `wait`, `seed: true` / `seedScript`, `do`, `script`, `settle`,
`fast`, `data`, `unreachable`. Two flags exist because of real failures:

* `fast` — skip the network-idle wait. A screen that replaces itself shortly after load
  (`01 · Splash` holds for 900 ms) is already gone by the time the network settles under load.
* `settle` — milliseconds to wait before driving. `shot.mjs` waits 1500 ms by default **when a
  `--do` or `--script` is given**, because a board is not interactive at network-idle and a tap
  before that silently no-ops (F21). A static capture waits 0 unless you say otherwise.

`sigdiff` now sorts a differing row into one of three buckets, and the audit only calls a frame
CLEAN when the third is empty:

1. **radius-notation** — the canvas writes `50%`, RN can only state a number, and half the box is
   the same circle (D015). Not a defect.
2. **paint-absent, geometry-exact** — a CSS box the app draws as an SVG shape, so `background` /
   `border-radius` / `box-shadow` read as `-` while the rect matches to the point (D010/D022).
   **Counted, not forgiven: a lost background looks identical from here.** A row in this bucket is
   settled only by looking at the PNG.
3. **everything else** — the `net` column. This is what is actually still wrong.
