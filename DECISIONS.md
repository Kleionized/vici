# UI FINAL 1 — decisions log

Every ambiguity resolved during the `UI final 1` implementation run, with the reasoning.
Newest entries are appended at the bottom. Branch: `ui-final-1`. Baseline commit: `9b9e883`.

---

## D001 — The bundle folder is `UI Final 1/` (capital F)

The brief names the folder `UI final 1`. The folder on disk is `UI Final 1`. There is exactly one
folder whose name matches case-insensitively, and it is the newest design drop in the repo
(mtime 2026-08-21 19:24, one day newer than every other design folder). It is the folder meant.

## D002 — Prior-run artefacts moved to `prior-runs/UI_FINAL/`, not deleted

The brief says not to carry a ledger, spec, or conclusion over from a previous run. The repo
already held `UI_FINAL_LEDGER.md`, `DECISIONS.md`, `REPORT.md` and 57 files in `specs/` from the
`UI Final` run. They were moved wholesale to `prior-runs/UI_FINAL/` with `git mv` and this run
starts with empty `specs/`, a fresh `DECISIONS.md`, a fresh `REPORT.md` and a new
`UI_FINAL_1_LEDGER.md`. Nothing in them is treated as established fact for this run; they are
recoverable history only.

## D003 — `VICI (previous).dc.html` and `vici-prev.dc.html` are reference, not build targets

Both files are byte-identical to each other (87 frames each, 174 ledger rows) and byte-identical
to the copies that shipped in the previous bundle. Their frames are the *superseded* generation of
the product: `Device Not Found`, `Waking Up Device`, `Sound Library`, `Now Playing`, `Library Wake`,
`My Regimen …` — a sleep-device app whose screens have no counterpart in Tideline and are not
reachable from any flow in `Email Login.dc.html`. The file name states its own status. Building
them would add 87 screens the product does not have.

They are inventoried, opened, and carried in the ledger as `REFERENCE` with the reason on the row.
They are also the one legitimate use for an older design: when a `UI Final 1` frame is ambiguous
and an older frame of the same name resolves it, the older frame is evidence about intent — never
about pixels.

## D004 — `Medallions v2.dc.html` is a working file whose frames also live in `Email Login.dc.html`

15 of its 17 frames are byte-identical to frames of the same label in `Email Login.dc.html`. The
remaining two differ only in their label text: `Album Earned` ≙ `Medallions` and
`Album Still To Earn` ≙ `Medallions Still To Earn` (the diff is the `data-screen-label` attribute
itself and nothing else — verified by diffing the two frames with the label attribute stripped).
`Email Login.dc.html` is the primary file the bundle README names, so its labels are the ones the
ledger and the specs use. The `Medallions-v2/*` rows are implemented by the same code and verified
against the same spec; the row records which `Email-Login/*` row it mirrors.

## D005 — `Lesson 1 Surviving the Night.dc.html` is a third copy of the lesson-one reader

Its 26 `L1 Frame NN` frames correspond one-to-one to `Email-Login/Lesson Scroll NN`. A fourth copy
exists as `Lessons-and-Tasks/L01 Reader 1…25`. Where the three copies disagree, `Email Login` wins
(the README names it the primary), and the disagreement is recorded on the ledger row and in the
screen's spec rather than silently resolved.

## D006 — `relapse-workflow.md` is a behaviour spec, and it governs only the screens the app does not have

The brief's rule is: designs win on how something looks, the app wins on what it does. The bundle
ships a 700-line behaviour specification for the post-slip flow. Thirty `Slip …` frames are new in
this drop and have no counterpart anywhere in the app, so there is no app behaviour for them to
defer to. For those screens the workflow document is the flow authority: screen order, branch
conditions, and which screen is conditional. For every screen that already exists in the app
(`relapse.tsx`, `lapse.tsx`, `urge-log.tsx`, the check-ins) the app's existing logic stands and only
the presentation changes.

## D007 — `course-text.txt`, `lessons.json`, `frame-templates.txt`, `task-src.json`, `taskgen-*.js` are intermediates

They are authoring inputs to the canvas, not the canvas. The rendered frames are what the user
approved and what the ledger tracks. Where an intermediate disagrees with a rendered frame, the
rendered frame wins. (The previous run found `task-src.json` and `taskgen-meta.js` to be stale in
exactly this way; both are byte-identical in this drop, so they are stale here too.) They are read
for provenance and for resolving genuinely ambiguous glyph/id references, never for geometry.

## D008 — Two verification methods, chosen by whether a frame is a screen or a record

`UI Final 1` holds 2,209 frames. 234 of them are the app's actual screens (`Email Login.dc.html`
minus its 26 lesson-reader pages). The other ~1,750 are **content**: 84 lesson readers averaging
24 pages each (the twelve `Week NN` files), 83 lesson cards, and 83 three-board daily tasks. Those
are not 1,750 distinct designs — they are a handful of templates carrying different words, numbers
and artwork.

So the run uses two methods, and both are exhaustive:

* **Screens** get the Phase 2 treatment literally: a written spec in `specs/<screen>.md` with every
  typographic, spatial, chromatic and motion value transcribed from the frame's own CSS, and a
  property-by-property comparison table against the implementation.
* **Content frames** get their *template* specced that way once, and then every single frame is
  parsed mechanically and diffed field-by-field against what the app renders for it. A missed
  glyph, a 2px caption offset or a changed line in frame 1,412 shows up as a diff row. Writing 1,750
  prose specs by hand would be less rigorous than this, not more: the numbers come out of the file
  either way, and a machine does not get bored on frame 900.

Nothing is sampled. Every frame is read; the difference is only whether a human sentence or a diff
row is the artefact that proves it.

## D009 — The canvas's status bar and home indicator are chrome, not screen content

Every frame paints a 54px status bar (`· 9:41` plus three SVG glyphs) and a 139×5 home indicator at
`top: 839`. Both are the iOS chrome the canvas draws because a static HTML frame has no OS to draw
it. The app does not build either; `expo-status-bar` states the style and the OS draws the rest.
The existing `CANVAS_INSETS` shim in `src/app/_layout.tsx` already maps the canvas's 54px band onto
the safe-area top inset for the web preview, so a canvas `top: N` is an app `top: N − 54` measured
from the safe area. That convention is kept — it is correct and every screen in the app already
speaks it.

## D010 — `filter: blur()` on a radial wash has no platform equivalent, and does not need one

The canvas softens most of its background washes with `filter: blur(4–8px)`. Neither
`react-native-svg` nor React Native's view system implements CSS filters on iOS or Android.
Every blurred wash in the bundle is a `radial-gradient(closest-side, …)`, which already reaches
zero alpha at its own edge, so the blur is softening a shape that has no hard edge to soften.

The app's `Wash` helper reproduces the gradient's *curve* rather than its endpoints: it inserts a
midpoint stop at `fade / 2` with `opacity × 0.42`, because a two-stop SVG radial ramps linearly
while a CSS `closest-side` radial does not. The residual gap is a few pixels of extra feathering
on an already-feathered edge. Size of the gap: under one alpha step at the wash's own boundary.

Where a blurred element is *not* soft-edged — the `rgba(0,0,0,0.10)` ground shadow under the login
envelope, say — the app substitutes a radial with the same bounding box falling to zero at its
edge, which is what the blur produces there. Both substitutions are marked in the component that
makes them.

## D011 — What the two email controls on `02 · Login` do

The board draws a row labelled "Continue with email" with an arrow button, and under it
"Already have an account? **Sign in**". Neither has a destination on the canvas, and the two
boards that used to sit behind them — `Login Typing` and `Create Account` — were both withdrawn
from this bundle, so the flow chain gives no answer either.

Resolved by what the two labels say and by keeping every existing app board reachable:

* **Continue with email** → `/(auth)/sign-up?step=form`. The subtitle frames the board as
  "Sign in **or create an account**", and the footer sends people who already have one somewhere
  else, so this control is the create path. It opens the sign-up *form* rather than sign-up's
  gate, because the gate is the same Apple / Google / email choice the user has just made.
* **Already have an account? Sign in** → the app's existing address step on this same board,
  which leads to the password and verification steps. That board's own copy is "Sign in to keep
  building toward the life you want", so it is the returning-user path in the app already.

Both destinations existed before this run and neither changed. The one code change behind them:
the address step now opens from an explicit `emailStep` flag rather than from the field's focus,
because with the field gone from the landing board, blurring an empty field would otherwise
throw the user back to the landing mid-flow.

## D012 — The lint baseline is 22 errors, all pre-existing, all in files this run has not touched

`npx eslint src/` reports 26 problems (22 errors, 4 warnings) at commit `9b9e883`, before any
work in this run: `Cannot access refs during render` in `src/components/onboarding/art.tsx` and
`src/components/onboarding/v3.tsx`, plus a `require()` warning in `src/lib/providers.tsx`. They
are React Compiler diagnostics about existing animation wiring, not about presentation.

"Never break the build" is therefore measured against that baseline, recorded in
`.uifinal1/lint-baseline.txt`. This run adds no new diagnostic. Fixing the existing ones would
mean rewriting animation logic the brief explicitly says not to touch, so they stay — but any
screen work inside those two files is done without adding to the count.

## D013 — "Terms · Privacy" on the login board is a caption, not two links

The canvas marks every control on `02 · Login` with `cursor:pointer` — both provider pills, the
arrow button, and the "Sign in" span. The `Terms &nbsp;·&nbsp; Privacy` line at design y 818
carries no `cursor:pointer`, no underline, no colour change, and no separate spans: it is one
`#8B8882` run at 12px. It is rendered as static text. The app has a Data & Privacy screen, but
it lives behind auth and the canvas does not point at it from here.
