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

## D014 — The onboarding funnel's progress rule and night field are implemented exactly as drawn, and the canvas is inconsistent about them

The funnel was reordered and cut in this drop: the account now comes first (`02 · Login`), the
name/age/gender questions move to the front, seven section intros, three of the four lesson
interstitials and eleven questions are withdrawn, and eight new screens are added. **Each frame
kept the progress-rule width and night-field colours it had in its old position.**

Read in the new flow order, the rule reads:

| # | Frame | rule | field top → bottom |
| --- | --- | --- | --- |
| 03 | V3 Q24 Name | 100% | rgb(36,36,34) → rgb(59,58,56) |
| 04 | V3 Q25 Age | 100% | rgb(37,37,35) → rgb(60,59,57) |
| 05 | V3 Q26 Gender | 100% | rgb(38,38,36) → rgb(61,60,58) |
| 06 | Onboarding Start | 4% | rgb(15,15,13) → rgb(26,25,23) |
| 07 | V3 Q1 | 4% | rgb(15,15,13) → rgb(26,25,23) |
| 08 | V3 Q2 | 9% | rgb(16,16,14) → rgb(27,26,24) |
| 09 | V3 Q3 | 13% | rgb(17,17,15) → rgb(29,28,26) |
| 10 | First Principle | 15% | rgb(21,21,19) → rgb(35,34,32) |
| 11 | V3 Q5 | 22% | rgb(18,18,16) → rgb(31,30,28) |
| 12 | V3 Q6 | 26% | rgb(19,19,17) → rgb(32,31,29) |
| 13 | V3 Q7 | 30% | rgb(20,20,18) → rgb(34,33,31) |
| 14 | What Happens First | 74% | rgb(29,29,27) → rgb(49,48,46) |
| 15 | We Have Enough | 22% | rgb(18,18,16) → rgb(31,30,28) |
| 16 | V3 Q21 | 91% | rgb(33,33,31) → rgb(55,54,52) |
| 17 | What It Affects | 22% | rgb(18,18,16) → rgb(31,30,28) |
| 18 | V3 Q10 | 43% | rgb(23,23,21) → rgb(39,38,36) |
| 19 | V3 Q13 | 57% | rgb(25,25,23) → rgb(42,41,39) |
| 20 | V3 Q15 | 65% | rgb(28,28,26) → rgb(46,45,43) |
| 21 | V3 Q16 | 70% | rgb(28,28,26) → rgb(47,46,44) |
| 22 | V3 Q17 | 74% | rgb(29,29,27) → rgb(49,48,46) |

The provenance is not in doubt. Every value is the value that frame carried in the previous
bundle, where the order made the sequence monotonic; the three frames that read 22% are `V3 Q5`
and the two new screens cloned from it; `What Happens First` reads 74% because it was cloned
from `V3 Q17`; and the three 100% frames were the *last* three questions before the reshuffle.

**Implemented exactly as drawn.** The brief's rule 3 is explicit — do not improve the designs,
and if a design looks wrong, implement it as drawn — so the rule fills to the percentage the
frame states and every field is the frame's own gradient, bloom and low sun. The alternative,
recomputing the fill from the step's position in the new order, would have been a redesign of a
value the canvas states literally on every frame.

This is flagged at the top of `REPORT.md` as the one place where following the design produces a
visibly odd result: a progress rule that reads 100% on the first three screens, drops to 4%, and
is not monotonic thereafter. One line changes it if that was not intended.

## D015 — Two differences the numeric comparison reports on nearly every screen, and why they are equivalences

The probe measures the design frame and the app with the same code, so two structural facts about
the port show up as rows in almost every comparison table. Both are recorded once here rather than
explained twenty times.

**`border-radius: 50%` → a number.** The canvas rounds a circle with `border-radius: 50%`. React
Native has no percentage radius, so a 7px dot carries `borderRadius: 3.5` and a 15px tick badge
`7.5`. Same circle; the computed value is stated differently.

**A wash's `border-radius: 50%` → `-`.** Every soft background wash on the canvas is a `<div>` with
a radial-gradient background and a 50% radius. React Native has no radial-gradient background, so
each is drawn as an SVG `<Ellipse>` with the same bounding box and the same stops (D010). The box
matches to the pixel; the radius reads as absent because an ellipse has no CSS radius.

Neither is a tolerance or a rounding. Where the numbers themselves differ — an offset, a size, a
colour, a font metric — the table says **mismatch** and it gets fixed.

## D016 — The Back row on `03 · Name` is not drawn, because the app has nowhere to send it

Every funnel frame draws a Back row at `left:16, top:94` (`10 · First Principle` at 96). On
`03 · Name` the app draws none: the account has just been made, the previous entry in the history
is the auth board, and the auth stack redirects a signed-in user straight back out again — so the
control would be a loop, not a way back. Every other funnel frame draws it exactly as the canvas
does, and the app's own step-back works from `04 · Age` onward.

This is the app winning on what a control *does*, which the brief puts above the design; it is
recorded here and in `specs/03-name.md` rather than left silent.

## D017 — `27 · Your Starting Point`: the ring's arithmetic, and the frame's own marker disagreeing with its own number

The ring is unambiguous. `stroke-dasharray: 89.7 653.5` on a 104pt circle is 13.73% of the
circumference, the readout says `412` of `3,000`, and 412 / 3,000 = 13.73%. So the arc is
`score / 3000`, and that is what the app draws.

The ELO curve under it is the same axis: 61 samples of a bell peaking at x 172.5 of 345, which is
1,500 of 3,000. But the frame puts the curve's marker at **x 79.4**, which on that axis is 690 —
not the 412 the same frame prints in the middle of the ring. One of the two was authored before
the other changed.

The app places the curve's marker by the same fraction as the ring, so the two halves of the
screen cannot say different things. The frame's own value is kept in `SCORE_SAMPLE` so the spec can
quote it.

**The score the app shows** is `SCORE_BASE` — 1,000 — because that is what the app's own scoring
gives a man with no history yet (`src/lib/score.ts`), and the brief puts the app in charge of what
a number means. The canvas's 412 is below the app's floor and matches none of its ranks
(Deckhand 1,000 · Navigator 1,150 · Helmsman 1,300 · Captain 1,500), which `21B · Score Detail`
draws literally. Where the two screens of the same bundle disagree, the one that agrees with the
app's own model wins.

## D018 — `backdrop-filter: blur(12px)` on the two floating pills

`29 · One Year From Now` and `30 · If Nothing Changes` each hang a pill 120 off the bottom edge
with `backdrop-filter: blur(12px)` under a 94%- and 82%-opaque fill. React Native has no backdrop
filter on any platform. Each pill is built as an `expo-blur` `BlurView` inside the pill's rounded
clip with the stated fill painted over it, which is the same composite: blurred backdrop, then the
colour.

`BlurView`'s `intensity` is a 0–100 scale rather than a radius, and Expo does not publish the
mapping to points. 24 is used. The visible gap is bounded by how much backdrop shows through at
all: 6% on the white pill and 18% on the dark one, the latter over a flat `#060606` field where a
blur of any radius changes nothing.

## D019 — The canvas's card grain reports differently, and it is the same grain

Every paper card lays `noise-dark.png` over itself in a `<div>` with `opacity: 0.05`. The app's
`Grain` puts the opacity on the image inside its wrapper, so the probe reads the wrapper as having
no opacity and the image as having 0.05. Same pixels, one level down. Listed with D015's
equivalences.

## D020 — CSS's strut, and where the app has to state a line box the canvas only implies

A canvas frame sets `font-family` and nothing else on its root, so every block inherits a 16px
font size. An inline run inside a block sits on a line box at least as tall as that block's own
strut: at 16px in the frame's face, `line-height: normal` is 19. So a pill whose padding is
`13px 24px 14px` around a **15px** run measures 46 tall, not 44.5 — the 15px run is 17.5 tall and
the line box that holds it is 19.

Yoga has no strut: a `<Text>`'s box is its own line height and nothing forces it taller. Wherever
the canvas relies on the strut, the app states the line box explicitly — the run keeps its own
17.5 and sits centred in a 19 box, which is exactly what the browser draws.

Found on the two floating pills of `29 · One Year From Now` and `30 · If Nothing Changes`, where
it was a 1.5pt difference in the pill's height and a 0.5pt shift in its top, because the pill is
positioned from the bottom edge.

## D021 — `cursor: pointer` marks the controls on `02 · Login`, and stops being reliable in the handover

D013 read the login board's `cursor: pointer` as the canvas's own statement of what is tappable:
four controls carried it and the "Terms · Privacy" line did not, and that line is plainly a
caption. That reading holds on that frame.

It does not generalise. In the handover, `41 · Reminders` gives "Not now" a `cursor: pointer` and
`39 · The Vow` gives its own "Not now" none; `37 · A Letter Arrived` gives "Save it for later"
none. Those three lines are the same control in the same position doing the same job, and on the
vow it is the only way past a screen that otherwise cannot be left without signing.

So: `cursor: pointer` is treated as evidence, not as the rule. Where a line's words are an
instruction and the screen has no other way forward, it is a control. Where a line names two legal
documents in the same weight and colour as the caption above it, it is a caption. Both readings are
recorded on the screen's own spec.

## D022 — A third reporting equivalence: the canvas's `<span>` is the app's View plus Text

The canvas paints a pill by giving a `<span>` a background, a radius, padding and its words all at
once. React Native cannot put padding and a background on a text run, so every pill in the app is a
`View` with the paint and a `Text` inside it. The probe keys rows on their words, so it pairs the
canvas's painted span with the app's bare text and reports the background, the radius and the
padded box as differences.

They are the same pill. Verified element by element each time it appears — `PLUS` and `Best value`
on `42 · Paywall`, `You are here` on `34 · Twelve Weeks`, the tier pill on `40 · Medallion Earned`
— by reading the app's own painted View out of the same capture and checking its box against the
canvas's span. Listed with D015 and D019.

The same thing happens the other way round on a right-aligned column: the canvas's block is as wide
as its widest line (`$39.99`, 53.7) with `/year` right-aligned inside it; the app's `Text` is as
wide as `/year` (28). Both right edges land on 359.

## D023 — CSS collapses adjacent vertical margins; Yoga adds them

The letter on `38 · A Letter From Week XII` sets `margin: 0 0 20px` on each paragraph and
`margin: 36px auto 40px` on the picture between paragraphs three and four. In CSS the paragraph's
bottom margin and the picture's top margin collapse to the larger of the two, so the gap the frame
draws above the picture is **36**. Yoga does not collapse margins: written literally, the app put
56 there and every paragraph below the picture sat 20 low.

Wherever the canvas relies on collapsing, the app states the collapsed result. Found here; watched
for on every stacked-margin block from now on, because it is invisible until the numbers are
compared — the picture still looked right, and only the paragraphs after it had moved.

## D024 — The tab bar carries the canvas's three tabs, and `All` leaves it

Every frame in `UI Final 1` that draws a tab bar draws three: `Home` at
`left:48 width:44`, `Log` at `left:170 width:52`, `Library` at `left:288 width:60` — hand-set
boxes with centres at 70 / 196 / 318 of 393, not an even rhythm. Ten frames were checked and all
ten agree, including the active/resting treatment (`#2A2924` glyph and label when selected,
`#C6C5C0` glyph with an `#8B8882` label when not).

The app carried a fourth, `All`, and spread the row on even quarters to fit it. `All` is not a
product screen: `src/app/(app)/all.tsx` says so in its own first line ("Not a canvas frame"), and
it exists so that screens the app only ever pushes on its own terms — the weekly report, the
letter, the yearly drop — can be reached for review.

The bar is now the canvas's three at the canvas's own centres and label widths. `/(app)/all` stays
a route and is still reachable by URL; nothing else links to it. That is recorded in `REPORT.md`
so the drawer is not lost by accident.

## D025 — the reflection card's caret is the platform's, not a drawing

`21E4 · Night — Reflection` draws a `<span display:inline-block width:2px
height:18px background:#131313 vertical-align:-3px margin-left:3px>` immediately
after the placeholder run. That is the frame's stand-in for a text cursor: the
canvas is a static picture and has no editable field, so it paints the caret the
way it paints the status-bar clock.

`src/app/day/night.tsx`'s reflection step is a real `TextInput`, and iOS, Android
and the web all draw their own caret in it — blinking, and only while focused.
Painting the canvas's bar as well would show two carets while typing and a fake
one while not.

**Decision:** the caret is chrome in the same class as the status bar and the
home indicator (D009) — the platform owns it, and it is not drawn. Everything
else in the block is implemented literally: the placeholder run sits at the
canvas's `left:20 right:20 top:22` inside the card, in Georgia italic at
17/27 in `#8B8882`.

Consequence for verification: the layout probe reads text out of DOM text nodes,
and a placeholder is an attribute, so `dsg-68-night-reflection`'s placeholder row
and caret row both read as MISSING in the app capture. The field's own box is
captured at the same origin (`32 | 332`), which is the part a diff can check.

## D026 — bottom-anchored offsets are measured off the frame edge, not the inset

`src/app/_layout.tsx` shims the web preview's safe area to `{ top: 54, bottom: 0 }`
because the canvas's 852 already contains the home-indicator zone: a canvas
`bottom: 84` is 84 off the screen's own edge, on the canvas and on a real 852pt
screen alike.

`DayShell` (kit.tsx) contradicted that. It spent both insets — `edges={['top',
'bottom']}` — so `ActionButton`'s `bottom: 50` and the night flow's `Skip
tonight` at `bottom: 10` resolved to 50 and 10 off the edge under the shim, and
to 84 and 44 only on a device that happens to report a 34pt bottom inset. The
measured capture of `21E5B · Night — Tonight's action` put the Done pill 34
below the frame's own 714.

**Decision:** `DayShell` spends the top inset only, and every bottom-anchored
child states the canvas's own number — `ActionButton` `bottom: 84`, Skip
`bottom: 44`. The result is identical on the web preview and on any device, and
it is the number the frame draws rather than one that moves with the hardware.

`MoodLogger`'s `CheckinFlow` still takes both edges; it owns the morning frames,
which are not yet implemented, and it is corrected when that group is built.

## D027 — the seed's lesson slugs

`scripts/uifinal1/seed.mjs` marked four lessons complete under the slugs
`w01-l01` … `w01-l04`. The app names lessons `day-01` … `day-84`
(`lessonSlug()`, `src/lib/curriculum.ts:23`), so none of the four matched a real
lesson: the progress map was four orphan keys, and every screen that reads a
finished lesson rendered its empty state.

`21 · Today — p2` sits on lesson 5 of week II, and week II is days 8–14, so the
four behind it are `day-08` … `day-11`. `21E5 · Night — Record` reads
**"Part IV finished"**, which is `roman(dayInWeek)` of a lesson finished *today*,
so `day-11` — week II's fourth — carries today's `completedAt` and the other
three step back two days apiece.

The lesson count is unchanged at four, so the score the frames print (1,240)
is unchanged.

## D028 — `20A · Score Detail` draws four pager dots for three pages; three wins

The score sheet is a horizontal pager with three pages, and the bundle draws all
three of them: `Score-Detail.html` ("Score over time"), `Score-Detail-Moves.html`
("What moved it this month") and `Score-Detail-Ranks.html` ("The ranks"). Each
frame ends with the same block —

```
<div position:absolute left:0 right:0 top:504px display:flex justify-content:center gap:8px>
```

— and `Score-Detail-Moves` and `Score-Detail-Ranks` put **three** 6pt dots in it,
lighting index 1 and index 2 respectively. `Score-Detail` puts **four** in it and
lights index 0.

There is no fourth page in the bundle, and a four-dot row is 48 wide against the
siblings' 34, so the row would visibly jump width as you paged. Two frames
against one, and the page count settles it.

**Decision:** three dots, on the canvas's own `top: 504`, 6pt at `gap: 8`,
`#131313` for the current page and `rgba(19,19,19,0.16)` for the rest — which is
what `src/app/score.tsx` already draws. The fourth dot on `Score-Detail` is a
leftover and is not implemented. Flagged for REPORT.md.

## D029 — the 3M / 1Y range pills are drawn whatever the account holds

`20A · Score Detail` draws two pills at `right:16 top:22`, 30 tall on a 15
radius: `3M` filled `#131313` with white 12.5/600 type, `1Y` on
`rgba(19,19,19,0.06)` with `#8B8882`.

`src/app/score.tsx` was rendering them only once `history.values.length >
SHORT_SPAN` (90 days), on the reasoning that below that both windows cover the
same record, so tapping a pill moves the highlight and nothing else.

That is a judgement about whether a control is worth offering, and this run's
authority split does not leave it open: the design is the source of truth for
what is on the screen. The seeded account is 41 days old and the frame still
draws both pills — and the same frame's own axis runs May → July, which is more
than 90 days, so the bundle is not consistent about the account it is drawing
either.

**Decision:** both pills render unconditionally, at the canvas's numbers. The
range still does exactly what it did; on a young account both windows show the
whole record, which is the truth about that account rather than a fault.

## D030 — `21D1 · Did you complete this task?` keeps asking about yesterday

The frame's title is **"Did you complete this task?"** — a question that can only
be about a task already set. The card under it is marked with the **sun**,
labelled **"Today"**, and carries `DAY_ACTIONS[0]`. The previous bundle drew it
the same way, so this is not a change; it is a contradiction the bundle has been
carrying.

It matters more in this bundle than in the last one, because `UI Final 1`
withdraws the separate "One action for today" board (there is no frame for it and
the six-dot rail has no slot for it), which makes this card simultaneously the
only place today's action is shown and the screen that asks whether yesterday's
happened.

**Decision:** the app keeps `mark="moon" label="Last night" line={yesterdayTask}`.
Everything else on the frame is implemented exactly as drawn — the card's own
`left: 56 right: 56 top: 236`, its 248-tall night, its foot, the title, the rail
and the two answer pills. What the screen *does* — ask about yesterday and write
the answer to yesterday's row — is the app's, and the canvas's sun / "Today" /
`DAY_ACTIONS[0]` would make the question unanswerable. Flagged for REPORT.md.

Numerically this leaves exactly three rows differing on `dsg-57` vs `app-57`: the
sun glyph's circle and path, and the two strings.

## D031 — the re-sign page's ghost signature, and what inks it

`21D5 · Morning — Re-sign your pledge` draws the signature in `#C9C6BE` — the
same pale grey as its decorative quote mark — over a full-ink `#131313` rule,
under a pill that says **"Sign for today"**. `Relapse-Resign.html` — the one other frame in
the bundle that draws this same act, on the same pledge sentence, under a pill
reading "Sign it again" — draws its signature in full ink, `#1D1C1A`, over an
`rgba(0,0,0,0.2)` rule. `Your-Vow-Page.html` agrees: `#1D1C1A` over
`rgba(0,0,0,0.24)`.

Read together, this frame is the **pre-signature** state: a ghost of the mark,
waiting.

**Decision:** the signature is `#C9C6BE` until signed and `#1D1C1A` after — the
inked colour taken from `Relapse-Resign`, which draws the signed state of this
very act, not invented. The app's existing
two-press gate on this step is kept: the first press inks the name, the second
advances. That preserves the screen's behaviour, and it is the only reading under
which the ghost the canvas draws is ever replaced by anything.

## D032 — what "Sign the new pledge" does

`21D5B · Change the pledge` offers **"Sign the new pledge"** and, under it,
**"Keep current pledge"**. Nothing on either frame says whether the first one
completes the morning step or returns to the page behind it.

**Decision:** both return to the re-sign page. "Sign the new pledge" writes the
new words into the page and leaves it **unsigned**; "Keep current pledge" leaves
the words alone. The page's own pill is what signs for today, and its dismissal
being phrased as "Keep current pledge" — a choice *about the words*, not about
the day — is what settles it. Flagged for REPORT.md.

The sheet's own shell is built fresh rather than reused: `ProfileSheet` and
`SignOutSheet` draw `rgba(19,19,19,0.45)` / radius 24 / a 36×5 grabber /
`0 -12px 40px rgba(19,19,19,0.3)` on `#FFFFFF`, and this frame draws
`rgba(38,37,30,0.42)` / radius 22 / a 36×4 grabber /
`0 -12px 36px rgba(20,19,16,0.22)` on `#F4F3F0`. No other frame in the bundle
uses that scrim colour.

The three flat `#E8E7E1` blocks the frame paints at 45% behind the scrim are a
stand-in for the screen underneath — none of the three matches anything the
re-sign page draws — so the live page is rendered behind the scrim instead.

## D033 — `/checkin?part=morning` hands over to `/day/morning`

`src/app/checkin.tsx` mounted `CheckinFlow` with `morning={true}` before noon,
which drew a four-step morning of its own: a mood orb and slider, the emotions
board, "Did you complete this task?" answered by two 74pt discs, and "One action
for today" closed by a "Got it" pill.

`UI Final 1` draws none of that in a morning register. Its morning is eight
frames — a cover, the task check, the ledger, a feeling dial, an energy dial, the
re-sign page, its sheet and the close — and not one of them is an orb, an
emotions board or an action card.

**Decision:** `?part=morning` redirects to `/day/morning`, the flow the bundle
actually draws. `CheckinFlow`'s morning branch, its `morning` / `yesterdayAction`
/ `todayAction` props, `CheckinResult`'s `yesterdayDone` and `action` fields, and
`DidYouRow` are all deleted rather than left unreachable. The any-time register —
the three boards `21E1`–`21E3` draw — is untouched.

Also withdrawn with the morning rewrite, each with no consumer left:
`SunMark`, `CupMark`, `DawnBand`, `EnergyBars`, `TANK`, `SignaturePad` and
`OPENERS`.

## D034 — a locked lesson row stays tappable

Every one of the twenty-four week reader frames draws a padlock on every lesson
the account has not reached: a `30 × 30` `rgba(19,19,19,0.05)` disc with an
`inset 0 0 0 1.5px rgba(0,0,0,0.08)` ring, holding a `#A5A29B` shackle and body,
under a `#8B8882` title and a `#B0AEA8` number. Seventy-two of the eighty-four
rows are drawn that way.

The padlock is the row's **state**, which is visual and is implemented exactly.
Whether the row *opens* is behaviour, and the app already answers it: the row
pushes `/lesson-card/{day}` whatever its state, and the lesson card is readable
ahead of time. The bundle contains no frame for a blocked tap — no toast, no
locked lesson card, nothing — so there is no drawn evidence for the other
reading.

**Decision:** the row keeps its padlock and keeps opening. The state is now also
in the row's accessibility label ("…, locked"), which is what a screen reader
needs and what the padlock does for everyone else.

## D035 — sky objects keep the canvas's own `left`; hills grow with the screen

`src/components/journey/WeekScene.tsx` already draws a distinction the canvas
cannot state, because the canvas is only ever 393 wide: a **hill** that runs past
an edge is re-measured so it still runs past it on any width ("a narrower phone
shows less of the same hill, not a smaller one"), while a **sky object** — a
cloud, a bird, a sun — keeps its declared `left`.

This pass fixed the hill half of that rule: the test fired on `width > 393`
alone, and week IX's two hills are 270 and 290 wide while each ends 83pt past one
edge, so neither grew and the valley between them opened up on any wider screen.
The test is on the layer's edges now. Verified: on a 393 board all 172 layers
across the twelve weeks resolve to exactly the same boxes as before; exactly two
change on anything wider.

**Decision on the other half:** sky objects are left alone. Six of them sit
60–100pt from the canvas's right edge and will sit further from a wider screen's,
drifting the composition left — but the canvas states a `left` for each, the
bundle offers no second width to infer an anchoring rule from, and re-anchoring
them to the nearer edge is a design judgement the frames do not support. Recorded
so the question is not re-opened by accident.

## D036 — the two grid pickers wear the glyphs of the lists they replaced

`102 · SOS Reason Picker` and `103 · SOS Feeling Picker` each replaced a
six-row list with a nine-card grid, and each card kept the glyph that sat in
that position in the old list. So the trigger grid draws a **heart** on
"Something online" (the old `Relationship`), a **briefcase** on "A stuck
fantasy" (the old `Work or school`), a **house** on "Pure habit" (the old
`Family`), a **banknote** on "Can't sleep" (the old `Money`) and a **pulse
line** on "An argument" (the old `Health`); the feeling grid does the same with
the H·A·L·T set — a **bowl** on "Turned on" and again on "Tired", a **bolt** on
"Bored" and again on "Restless", a **moon** on "Stressed or anxious", a **smile**
on "Angry".

**Decision:** implemented as drawn. Ground rule 3 is explicit — "if a design
looks wrong to you, implement it as drawn" — and the same call was made for the
funnel's stale progress rule (D014). Every glyph is read out of the frame by
`scripts/uifinal1/gen-pickers.mjs` into `src/content/sosPickers.ts`, so if the
bundle re-pairs them the app follows in one command. Flagged for REPORT.md as
the largest single thing in the bundle that reads as an oversight rather than a
choice.

## D037 — each picker is followed by the board the bundle draws for its answer

The bundle draws three pickers (98 location, 102 trigger, 103 feeling) and, at
canvas indices 117–146, **thirty boards** — one per answer, seven / ten /
thirteen. Nothing in either set says where the thirty sit in the flow.

**Decision:** each picker hands straight to the board for the answer it
returned. The three moves (99, 100, 101) keep the place the canvas indexes them,
between the location's board and the trigger picker. The flow is therefore

```
intro → strength → where → the place's board → stand → leave → phone
      → trigger → the trigger's board → feeling → the feeling's board
      → reassess → afterward → the dark SOS → complete
```

which uses every frame in the group exactly once, in the canvas's own index
order. The alternative — thirty boards drawn and never shown — is not one.

## D038 — the pickers were not extended when the response branch was

Each picker offers fewer options than its branch has boards:

| branch | picker options | boards drawn | unreachable |
|---|---|---|---|
| location | 5 | 7 | `SOS-Loc-Bathroom`, `SOS-Loc-Home-Alone` |
| trigger | 9 | 10 | `SOS-Trig-Rejection` |
| feeling | 9 | 13 | `SOS-Feel-Anxious`, `-Numb`, `-Ashamed`, `-Rejected` |

The location picker was *edited* in this drop — its sub-line deleted, its rows
lifted 8pt — without gaining options, so the five are current, not stale.

**Decision:** the pickers are built with exactly the options they draw, and all
thirty boards are built. The seven with no card are reachable on the feeling
branch through "Give me another" (below) and, on the other two branches, are
drawn but unreached. Nothing is invented to reach them, and no picker gains an
option the canvas does not draw. Flagged for REPORT.md.

**"Give me another"** — drawn on all thirteen feeling boards and on
`SOS-Challenge`, and on nothing else — rotates through the fourteen boards of
that branch in the bundle's own order. Its only possible meaning is "show me a
different suggestion", and that is the set of suggestions the bundle drew; it is
also what makes `SOS-Challenge` reachable, whose copy answers an answer neither
picker offers.

## D039 — `108 · Relapse Log` draws two body paragraphs, overlapping

The frame carries both

* `top: 444` — "Same calm screen as a win. Note what set it off while it's fresh
  — the pattern is the prize, not the streak." (the previous bundle's), and
* `top: 450` — "The day isn't over. Log what happened, then stop it here."

at the same `left: 44 right: 44`, the same 15.5/400 on a 23 line, in the same
colour. They overlap by 23 of their 23-point lines. The new sentence was added
without the old one being removed.

**Decision:** the one at 450 is built and the one at 444 is not. The headline
changed in the same hunk — "It happened. That's data." → "It happened." — and
the new paragraph is the one that follows from it.

## D040 — the dark SOS survives

`UI Final 1` draws no breathe, tap, odd-one-out or wave stage. Neither did the
previous bundle: the only drawings of them anywhere are
`VICI-previous/Urge-SOS-Breathe.html` and `Urge-SOS-Wave.html`, on a board D003
already marks REFERENCE.

**Decision:** the four stages stay. The bundle not redrawing a screen is not the
bundle deleting it, the flow's own `sos` step is what the interrupt hands off
to, and `112–116 · Urge Hub` draws a "Breathe" pill whose only destination is
`BreatheStage`. Flagged for REPORT.md as the largest piece of the app with no
frame in this bundle.

## D041 — the second intensity reading gets a field

`105 · Where is the urge now?` asks for a second 1–5 reading and the schema
carried one `severity`. `events` and `TidelineEvent` gain
`severityAfter?: number` — optional, so every existing row stays valid — and the
interrupt writes both. Without it the board's answer would go nowhere, which is
the one thing a drawn control must not do.

`106 · One more thing.` writes its line to the event's existing `note`, which is
the field the schema already carries for a sentence about an urge.

## D042 — the twelve week canvases are `lesson UI` re-shipped, and the group was already built

`UI Final 1` ships twelve per-week canvases holding 1,372 frames — the readers
for lessons 2 to 84. They are not new work. Every one of the 1,372 frame files
is **byte-identical** to the same file in the earlier `lesson UI` split, checked
with `cmp` over all of them: 1,372 identical, 0 differing. The previous *main*
bundle never carried them; this is the first main bundle that does.

Verified two ways, independently of the gap report that first claimed it:

1. `cmp` over every frame in `.uifinal1/final/Week-*` against
   `.uifinal/lessons/Week *` — 1,384 files compared (1,372 frames plus twelve
   helmets), none differing.
2. `scripts/uifinal/gen-lesson-scrolls.mjs`, pointed at a symlink tree of
   `.uifinal1/final/Week-*` with its outputs redirected out of the repo,
   reproduces `src/content/lessonReader.ts` and `src/content/coverScene.ts`
   **byte for byte**. 1,398 pages, 11 ramps, 7 cover layers.

**Decision:** all 1,372 rows are `IMPLEMENTED`, against
`src/app/lesson/day/[day].tsx`, `src/components/lesson/reader.tsx`,
`src/components/lesson/scroll.tsx` and `src/content/lessonReader.ts`, with
`specs/113-lesson-readers.md` as the family spec. Two real gaps were found by
measuring the render rather than the content — D043 and D044.

## D043 — the cover eyebrow's 1.8px tracking was being dropped

`WEEK I · RESET` is set `12px/600` with `letter-spacing: 1.8px` on all 83 covers,
and `gen-lesson-scrolls.mjs` did not read `letter-spacing` for a `text` run, so
the ramp carried none and every cover drew the eyebrow 25pt narrower than the
frame (`116` against `90.8`).

**Decision:** `letterSpacing` is read into the run, into the ramp key and into
the emitted `Ramp`, and `Run` applies it. `lessonReader.ts` is regenerated —
never hand-edited — and still reproduces byte for byte from this bundle. It is
the only run in the whole reader that states a tracking; the epigraph's
attribution and the two pill labels already carried theirs by other routes.

## D044 — a pick row's weight follows the app's own selection, not the frame's

The frames draw one pick row already chosen so the chosen state is visible, and
`lessonReader.ts` records that row's `selected: true`. `PickRows` was reading
that row's weight and applying it to **every** unselected row, so all six rows
drew at 600 where the frame draws one at 600 and five at 500. The label also
carried `flex: 1`, stretching it to the row's full width where the canvas's
`<span>` takes the width of its own words.

**Decision:** a row takes the chosen weight when the reader has chosen it and
the resting weight otherwise, both read from the frame's own options; the label
is `flexShrink: 1`, which is a span. With the frame's own row chosen in the app,
the board then matches the frame exactly.

## D045 — the same daily task is authored twice in the bundle, and the two differ

`UI Final 1` states every day's task in two places: the reader's task page and
options board (the twelve week canvases → `lessonReader.ts`), and
`Lessons and Tasks`' `Task DNN` frames (→ `curriculum84.ts`, which the Today
card, the night reminder and the lesson card draw). Measured day by day:

| field | identical | punctuation only | different words |
|---|---|---|---|
| the "Done when…" rule | 6 | 0 | **78** |
| the options board title | 1 | 0 | **81** |
| board option count | 66 | 0 | 16 |
| board rows | 49 | 5 | 28 |
| closing note | 57 | 0 | 25 — and no reader board draws one at all |

**Decision:** both are implemented as drawn. Each screen reproduces the canvas
that draws it, which is what ground rule 3 requires and what D008 already rules
for content. Nothing is reconciled, nothing is "improved", and neither
generator is pointed at the other's frames. Flagged for REPORT.md as the largest
content contradiction in the bundle — two screens in the same product saying
different things about the same task.

`page.close` is `[]` on all 82 reader boards, so the branch that renders it is
never taken. It is kept: the generator reads the field out of the frames, and
removing the renderer would mean a board that ever draws one loses it silently.

## D046 — `03 · Welcome Back` answers D011, and the returning path moves to it

D011 had to decide what `02 · Login`'s two email controls did from their labels alone,
because the bundle drew no board behind either of them. `Latest Vici FULL` draws one:
`03 · Welcome Back`, frame #3, directly after the login board, saying "Welcome back." and
"Sign in to pick up where you left off." with an email row that reads "Sign in with email"
and a footer that reads "New here? **Create an account**".

That is the board D011 was inferring. The two doors point at each other — login's footer
says "Already have an account? Sign in", welcome-back's says "New here? Create an account" —
and the frame numbering puts them adjacent. So:

* **Login → Already have an account? Sign in** → `/(auth)/welcome-back` (was: the app's own
  address step, inline on the login route).
* **Welcome Back → Sign in with email** → that address step, which moved to this route with
  the rest of the returning flow (password, verification code).
* **Welcome Back → New here? Create an account** → back to `02 · Login`.
* **Login → Continue with email** → `/(auth)/sign-up?step=form`, unchanged from D011.

The two doors are one component, `AuthDoor` in `src/components/auth/kit.tsx`, with a
`variant`. The frames differ in four strings and in nothing else — not one offset, colour,
radius or path — and two hand-maintained copies would not stay that way.

## D047 — the boards behind the doors take the funnel's night dress

`02 · Login` inverted in this drop: the front door moved from warm paper to the splash's
night field, and `03 · Welcome Back` arrives on the same field. The boards *between* the
door and the funnel have no frame and never did in the last drop either — the address step,
the password step, the verification code, `Save your progress`, `Create Account`.

They were built on the paper kit, because the login board they hung off was paper. That
board is gone. Leaving them cream would put a full-brightness flash one tap inside a night
door and one tap before `04 · V3 Q24 Name`, which is night as well — the whole run from
`01 · Splash` to the end of the funnel is dark, and only these five undrawn boards were not.

They are dressed in the vocabulary the bundle itself states on `04 · V3 Q24 Name`, which is
the screen family they sit between, rather than in anything invented:

* Back row: `left:16`, design y 94, an 11 × 19 chevron at `stroke-width:2.4` and a 17px/400
  label, both `rgba(244,243,240,0.75)`.
* Field: 60 tall, radius 16, `rgba(255,255,255,0.07)` under `0 0 0 1px rgba(255,255,255,0.22)`,
  22 of side padding, a 17px/400 face, placeholder `rgba(244,243,240,0.45)`.
* Primary pill: 58 tall, radius 29, `#F4F3F0` with 17px/600 `letter-spacing:0.2px` `#131313`.
* Secondary pill: `rgba(244,243,240,0.08)` under `1px rgba(244,243,240,0.2)`, label `#F4F3F0` —
  the login board's own Google pill.

This is a judgement call about screens the canvas does not draw, and it is the only one in
the auth group. If the canvas later draws them, the frames win.

## D048 — a two-stop CSS radial ramps linearly, and D010's midpoint darkens it

D010's `Wash` reproduces a `radial-gradient(closest-side, c α, c 0 f%)` with three SVG
stops, inserting a midpoint at `f/2` with `opacity × 0.42`, "because a two-stop SVG radial
ramps linearly while a CSS `closest-side` radial does not".

For these washes it does. CSS interpolates a gradient in premultiplied alpha; both stops
name the same RGB, so the premultiplied colour and the alpha both fall linearly between
them and an SVG two-stop radial with the same stops is exact. The `× 0.42` midpoint is
0.08 of alpha below the linear ramp at half radius, and it shows: measured at 2× against
the frame, it darkened the mark's halo on `01 · Splash` and `02 · Login` by up to 5/255.
Dropping it takes both frames to within 1/255 of the canvas everywhere outside the status
bar and home indicator.

Changed in `src/components/auth/kit.tsx` and in `SplashScene`/`WaterlineScene`
(`src/components/ui/Waterline.tsx`). D010's substance stands — the blur still needs no
equivalent, and a `closest-side` radial still has no hard edge to soften. Only the extra
stop goes. Other groups' fields carry their own copies of the same helper; a wash whose
canvas gradient states three stops of its own is unaffected either way.

## D049 — the canvas's `<img>` marks are stretched, not fitted

`01 · Splash` sets the laurel with `<img src="laurel-mark.webp" width="72" height="72">` and
`02 · Login` / `03 · Welcome Back` with `width="96" height="96"`. Neither states `object-fit`,
whose initial value is `fill`, so the browser stretches the asset into the box. The asset is
280 × 252, so the laurel as the canvas draws it is 11% taller than its own aspect.

The app was fitting it (`contentFit="contain"`), which drew a 72 × 65 and a 96 × 86 mark —
correct proportions, wrong frame. Both now use `contentFit="fill"`. `Save your progress`,
which has no frame, follows the two that do, so the mark has one shape across the auth run.


## D050 — `32 · Starting Score` renames the number, drops its denominator, and its arc no longer agrees with it

The board is `YOUR VICI RATING` in this drop, the readout is restyled from 60/600 at −2
tracking to 60/500 at +1.5, and the line under it is `Starting point` rather than
`of 3,000`.

The ring did not change. It still carries `stroke-dasharray: 89.7 653.5` on a 104pt circle
— 13.73% of the circumference — which was exactly the 412 of 3,000 the frame used to print
(D017). The frame now prints **842** against that same arc. On the 3,000 axis 842 is 28.1%,
so the readout and the arc state different things: the number was restyled and the drawing
was not. The ELO curve's marker is likewise unmoved at x 79.4, which is 690 on its own axis.

**Taken:** the arc's arithmetic is the authority — the ring is `rating / 3000`, which is the
only quantitative statement either half of the frame makes — and the app shows its own
opening rating, `SCORE_BASE` (1,000), for exactly the reason D017 gave: 842 is below the
app's floor and matches none of the ranks `Score Detail` draws (Deckhand 1,000 · Navigator
1,150 · Helmsman 1,300 · Captain 1,500), and the app owns what a number means. The frame's
own 842 / 89.7 / 79.4 are kept in `SCORE_SAMPLE` so the spec can quote them.

**A real bug this exposed.** The previous generator read the ring's circumference as
`89.7 + 653.5 = 743.2`, treating the dasharray's second number as the *remainder*. It is the
whole circumference: 2π·104 = 653.45. Every arc the app drew was therefore 13.7% too long.
`scripts/vicifull/gen-tail.mjs` now computes it from the track's own radius.

## D051 — `39 · What You Want Back` names three things, and they are the board's copy, not a readout

The bar chart is gone. The board now draws a sunrise and three 56pt discs under it labelled
`FOCUS`, `SLEEP` and `CONFIDENCE`, each with a bespoke glyph — a sun over a horizon, a
crescent, a rising line.

`19 · What it affects` offers nine answers (Time, Focus, Sleep, Confidence, Relationships,
Sex or intimacy, Energy, Feeling in control, Peace of mind) and lets him pick three. The
bundle draws an icon for none of the other six: `FOCUS`, `SLEEP` and `CONFIDENCE` appear on
this one frame and nowhere else in 267.

**Taken:** the trio is drawn as stated. Reading his three answers back here would need six
glyphs the canvas never drew, which is inventing artwork, and the copy underneath — "Not a
perfect streak for its own sake" — reads as the board's own argument rather than as a
readout. The old screen's copy did name his answers ("You said porn gets in the way of your
…"); that sentence is gone from this drop.

## D052 — `AppText` gives every body run `text-wrap: pretty`, and the canvas does not

`src/components/ui/AppText.tsx` sets `textWrap: 'pretty'` on every non-heading run on web
(`balance` on hero/display/title). The canvas states `text-wrap` per element: `balance` on
some titles, `pretty` on some paragraphs, and **nothing at all** on others.

Where the frame says nothing, `pretty` pulls a word down off the line above to avoid a short
last line, and the copy breaks one word early. Visible on `33 · Cost Next 30`, on both of
its runs: the frame breaks "…could end with / porn." and the app broke "…could end / with
porn.".

**Taken:** `TailCopy` grew a `wrap` prop and every call states the frame's own value —
`balance`, `wrap`, or omitted where the frame says `pretty`. Applied under the same
`Platform.OS === 'web'` guard `AppText` uses, because `text-wrap` has no native analogue and
RN's own layout already breaks like CSS `normal`. `AppText`'s default is left alone: it is
shared by every screen in the app.

## D053 — `27 · Where We’d Start` draws slot 8 and 9 of `13 · When` under the PREVIOUS drop's names

`27 · Where We’d Start` is new in this drop, and its three chips read "Late at night",
"Home alone" and "Phone in bed". Those are slots 1, 8 and 9 of `13 · When` — under the names
that picker carried in the **previous** bundle. This drop renamed six of its nine options
one-for-one by slot and kept every glyph unchanged, so slot 8 now reads "When I’m home alone"
and slot 9 "While scrolling" (`.vicifull/fdiff/V3-Q5.diff`), and `27` was not restated.

The chips are plainly his answers, not fixed copy: the line under them says "These came up
together in your answers", and the three glyphs are `13 · When`'s own, path for path. So they
are read off the picker. But the chip column is 100 wide with `white-space: nowrap`, and the
new names do not fit it — "When I’m home alone" is half as wide again as the frame's own
widest chip (84.8).

**Taken:** each of the nine options gets a chip form (`CHIP_LABEL` in
`src/components/onboarding/plan.tsx`). Slots 1, 8 and 9 take the words `27` itself draws, so
the frame's own state reproduces character for character; the other six keep the current
label where it fits the column and are shortened where it does not. The frame wins over the
picker on the two that disagree, because the frame is the spec for this screen and nothing in
the drop restated it.

## D054 — `28 · Start Here` draws "Choose another" and the bundle designs no destination for it

`28 · Start Here` proposes one first change — keep the phone out of the bed — with "I can do
that" above and "Choose another" below it. No frame anywhere in `Latest Vici FULL` offers a
list of changes to choose from: `grep -l "Choose another"` matches `Start Here` and nothing
else, and the only designed pair of step boards (`29`, `30`) belongs to that one change.

A dead control was the worse of the two readings, so "Choose another" swaps the proposed
change for the next of the three signals `27` just drew, and the two step boards follow it.
`FIRST_CHANGES` holds a board per signal: the canvas's own entry is verbatim, and the other
three are written to its pattern — the same shape `windowFor` and `o3Issue` already use for
text no frame draws. The **artwork does not change with the board**, because inventing a
second scene would be approximating a visualisation the canvas does not draw.

Which board `28` opens on is the canvas's own datum: for a man who named late night, being
home alone and scrolling, it proposes the phone out of the bed — the third of his three
chips, not the first. So the proposal is the most concrete thing among his signals, not his
first answer, and `CHANGE_ORDER` is that reading. His `15 · Place` ("In bed") and
`16 · What starts it` ("I start scrolling") answers, both quoted on the same frame, point at
the same board and are the evidence for it.

## D055 — `31 · Your Plan`'s five icons belong to the row, not to the answer

`31 · Your Plan` draws a moon, a bed, a phone with a down-arrow, a plug and a target beside
its five rows. Only the first is one of `13 · When`'s glyphs; the bed is a *different* bed
from `15 · Place`'s, and the last two name things no picker produces. So the board is not
mapping an answer to a glyph.

**Taken:** the five icons are drawn as the frame draws them, fixed per row, and only the
words vary with his answers. Contrast `27 · Where We’d Start`, whose three glyphs *are*
`13 · When`'s own, path for path, and are therefore looked up from `FUNNEL_GLYPHS`.

## D056 — the album is twelve renamed faces on a five-rung ladder, and Paper is tier one

`Medallions`, `Album Earned II` and `Medallions Still To Earn` draw twelve faces and only four
of the app's old names survive: `Veni`, `First light`, `Vidi`, `Vici`. `Storm weathered` is now
**Breakwater**, `Never failed twice` is **Rebound** (and its tick is replaced by an up-arrow),
`Honest ink` is **Archive**, `Steady study` is **Lessons**, and **Logbook**, **Pulse**,
**Black Box** and **Return** are new. `Letter sent`, `Ground taken`, `Let someone in` and
`Back on deck` are gone from the canvas entirely.

The nine `Tiers *` frames state the ladders, and every tiered face now has **exactly five
rungs, one per metal** — Paper I, Bronze II, Silver III, Gold IV, Platinum V — while the four
faces that mint once are collected on `Tiers One-offs` under "One tier only · platinum".

**Taken:** `KK_ALBUM` is rewritten to the canvas's twelve, in the canvas's own order (which is
also the order the three album frames page through). `kkMetal` becomes an index into
`KK_METALS` rather than a fraction of a variable-length ladder, and a one-off mints straight to
platinum. **Paper is an earned tier, so it can no longer double as the unearned state**: the
album pushes `?tier=none` for a face nothing has been struck on, and the detail screen keeps a
separate `standing === 0` branch for it.

## D057 — `Detail *` is the previous ladder model, `Breakwater *` is the current one

The five `Detail *` frames and the five `Breakwater *` frames are the same screen — byte-identical
geometry, five board skins, same CTA — drawn for two different faces. They disagree about the
model underneath:

| | `Detail *` (Vici) | `Breakwater *` |
| --- | --- | --- |
| Paper | `Not yet · first ×1` / "What waits at tier one" | `Tier I · ×1` / "What it says" |
| Bronze | `Tier I · ×1` | `Tier II · ×5` |
| Platinum | `Tier VII · ×1,000` | `Tier V · ×50` |

`Detail *` is unchanged from the previous drop and models Vici as a **seven**-rung ladder;
`Tiers Vici` states **five** (`×5 / ×25 / ×100 / ×250 / ×1,000`) and the `Medallions` album card
for Vici was re-lined this drop from `Tier II · ×5` to `Tier I · ×5`, which only the five-rung
reading produces.

**Taken:** the five-rung model wins, and `Detail Paper` is re-read as the screen's **unearned**
state rather than a stale one — its pill shape (`Not yet · first ×N`), its card heading and its
`— waiting at ×N.` suffix are exactly what the app draws when nothing has been struck. What
cannot be matched is the *content* of `Detail Bronze/Silver/Gold/Platinum`: their pills and
quotes are keyed to rungs the ladder no longer has. Their boards, skins, geometry and type all
match.

## D058 — the device is struck art: paper accents on every metal

An earlier drop's `ACCENT` table in `Medallion.tsx` recoloured each device per metal — a bronze
quill on bronze, white lesson cards on gold. Nothing in `Latest Vici FULL` does that. Every one
of the eight tiered `Tiers` frames emits **byte-identical device markup on all five rows** (the
audit in `.uifinal1/gaps/medallions.md` §D checked this mechanically, and the duplicated
gradient ids per row are the giveaway), and `Breakwater Gold` still fills the lamp's warm dot
`#E2BA78` and its mast `#C4C3BC` over a gold disc. `Tiers Vidi` keeps the moon at the pale
`#E6E5DE → #C3C2BB` and takes the crescent's bite with an opaque `#F1F0EB` circle on the
platinum row.

**Taken:** `ACCENT` collapses to one set — the paper one — and the crescent is drawn as an
overdrawn paper circle rather than a mask, because a mask would let the metal show through the
bite where the canvas paints stock.

## D059 — Vici's staff is the only thing the 150pt disc darkens

Every frame in the bundle strikes a standard or a mast in `ACCENT.pole` (`#C4C3BC`) — the 68pt
album cards, the 64pt tier rows, and `Breakwater Paper … Platinum` at 150pt. The five
`Detail *` frames are the exception: at 150pt they hold Vici's staff at `#8A857C`.

**Taken:** both are drawn, so both are carried. `KKMedallion` keeps the override and scopes it
to Vici on the detail size; the tier row therefore needs a `variant` of its own —
`variant="tier"` takes the detail *bevel* (`inset:3px`, `inset 0 -7px 12px rgba(0,0,0,0.14)`,
which the canvas writes identically on the 64pt row and the 150pt disc) without the detail
*staff*. Splitting the two is the only way one prop can serve three sizes.

## D060 — the tier ladder is reached from the detail pill

Nine `Tiers *` frames exist and no frame in the bundle draws a way into them: no rail entry, no
row chevron, no link. They also carry no earned mark, no lock and no current-rung highlight, so
they are reference pages rather than state pages.

**Taken:** the pill under the coin on `089` opens the ladder. It is the one element on that
screen that already names a rung, and making it the door adds nothing the frame does not draw.
The four one-off faces share `/medallions/tiers/once`, which is `Tiers One-offs`.

## D061 — a day rung is Roman on a card and Arabic on the ladder

`Medallions` writes Vidi's rung `Tier I · Day VII`; `Tiers Vidi` writes the same rung
`Tier I · Day 7`. Both frames are in this drop and neither is stale.

**Taken:** `kkRung` takes a numerals argument. The album card and the detail pill default to
Roman; the ladder screen asks for Arabic.

## D062 — Lessons' missing sun and Return's extra one are canvas slips

`088` floats a low sun behind an earned face and nothing behind an unearned one — nine of the
ten earned cards and one of the two unearned ones say so. The two exceptions contradict each
other: `Album Earned II` draws **Lessons**, earned, with no sun, and `Medallions Still To Earn`
draws **Return**, unearned, with one — and Return's is the same
`right:6% top:34% width:44% height:44%` box Vidi's card uses, i.e. a copy-paste.

**Taken:** the rule the other twenty cards keep. Lessons gets a sun and Return does not, and the
signature diff for those two frames is left carrying one row each, named here rather than
chased.

## D063 — `react-native-svg` carries a real Gaussian now, so the Today and Score night art stops approximating one

D010 ruled that `filter: blur()` had no platform equivalent and did not need one, and every
blurred layer on the score art was hand-fitted to a gradient ramp instead: the moon's
`0 0 26px` bloom as a five-stop erf, the waterline band as its own un-blurred linear ramp, the
water's reflection as a soft radial standing in for a 38 × 44 bar.

That reasoning was true of the version the app was built on. `react-native-svg` 15.15.4 ships
`<Filter>` / `<FeGaussianBlur>` on both the native and the web build, and the paywall already
uses them. Measured against the frame, the fitted ramps were not close:

| layer | canvas α at the sample | fitted app α |
| --- | --- | --- |
| waterline glow, 11pt into a 12pt band | 0.125 (rising to 0.163 at 8, then falling) | 0.257 (rising all the way) |
| moon's reflection, at the shaft's centre | 0.194 | 0.064 |
| moon bloom, 5pt off the disc | — | ~20 % too bright |

The whole `Today Home` frame diffed at **13,905 pixels over 12/255**; the reflection was
effectively invisible and the glow band peaked in the wrong place.

**Taken:** on `Today`'s score card and `Score Detail`'s night header the blurs are drawn as
what the canvas states — `stdDeviation` 3 on the waterline band, 5 on the shaft and the halo,
and 13 on the moon's shadow, because a CSS shadow's blur radius is two standard deviations. A
filter region has to be stated (`x="-100%" width="300%"`); the default is 10 % of the bounding
box and would clip a 13pt blur inside its own bloom. An `<Svg>` clips to its viewport, so the
box carrying a blurred band starts 10 above it for headroom.

`Today Home` now diffs at **236 pixels**, all of them sub-pixel glyph rasterisation.

D010 still stands everywhere it was applied to a `radial-gradient(closest-side, …)` wash — a
shape with no hard edge to soften. This entry narrows it to the layers that do have one.

## D064 — a `RadialGradient` needs `r` as well as `rx`/`ry`, or the web build silently halves it

`react-native-svg`'s web build renders `<RadialGradient>` by forwarding its props to a DOM
`<radialGradient>`. `rx` and `ry` are the *native* build's props and are not SVG attributes, so
a browser ignores them and falls back to `r = 50%`.

Every farthest-corner CSS radial in the bundle is therefore correct on device and wrong in the
web preview. The moon on `Today Home` states
`radial-gradient(circle at 36% 30%, …)`, which is 94.8 % of its box; at 50 % the disc reached
its darkest stop two-thirds of the way out and rendered visibly darker at the rim — measured
200,163,105 against the canvas's 230,201,152, and 2,463 differing pixels on the disc alone.

**Taken:** state all three — `r="94.8%" rx="94.8%" ry="94.8%"`. Native reads `rx`/`ry`, the
browser reads `r`, and the two agree. Applied to the moons on `Today Home` and `Score Detail`;
the moon then diffs to within 1/255. Gradients that really are 50 % need nothing, because that
is the fallback. This is the fix for the first half of `.vicifull/FINDINGS.md` F8 and is worth
sweeping across every other screen that draws a farthest-corner radial.

## D065 — `onMomentumScrollEnd` never fires on web, so the score sheet's pager dot reads `onScroll`

`react-native-web`'s `ScrollViewBase` forwards only `onScroll`, plus a 100 ms debounce that
calls the same handler again at rest. `onMomentumScrollEnd` is passed through to the DOM node
and never invoked.

`src/app/score.tsx` set its page index from `onMomentumScrollEnd`, so in the web build the dot
row stayed on the first dot however far the sheet was paged — and neither of the two states
`Score Detail — Moves` and `Score Detail — Ranks` draw could be reached at all, which also made
those two frames unverifiable.

**Taken:** set the page from `onScroll`, which is emitted on both platforms and is already
throttled to 16 ms. The three dots now light 1, 2 and 3 with the sheet.

## D066 — the urge hub's ring is the app's own twenty-minute same-urge window

`85A · Urge Hub — Right now` draws `17:42` inside an arc of `stroke-dasharray: 433.7 490.1`.
490.1 is the circumference of the r = 78 ring, so the arc is 88.49 % of the circle — and 17:42
is 88.50 % of twenty minutes. Twenty minutes is `SAME_URGE_WINDOW_MS` in `src/lib/urgeSession.ts`,
the window the app already treats as the life of one urge. `85B · Recovery score` then labels its
marker `2:18 in`, and 20:00 − 17:42 = 2:18.

**Taken:** the ring is the remaining fraction of the same-urge window and the digits are what is
left of it, read off the live session's `startedAt`. Three numbers on two frames agree with a
constant the app already had; nothing else fits them.

## D067 — `85B`'s badge contradicts its own marker, and the app follows the marker

The Score pane puts its marker at `cx = 60` of a 345-wide chart — 17.4 % along — and labels it
`32%`. No rule produces both: 32 % of the chart is x 110, and the marker's height on the curve
is 11.8 % of the wave's own amplitude. The `2:18 in` half of the label is unambiguous (D066).

**Taken:** the marker's x, the percentage and the elapsed time all read from one number — the
progress through the same-urge window — so the badge always tells the truth about where the
marker is. The canvas's own sample is the thing that is inconsistent, and reproducing its
inconsistency would mean drawing a badge that lies about the dot beneath it.

## D068 — `Try a different step` moves to a different step, wrapping

This drop adds a soft link under the pill on all three move boards (`Surf Step 1`,
`Surf Step 3`, `Cue Set Confirmation`) reading "Try a different step". The canvas states the
words, the box and nothing else.

**Taken:** it advances the pager to the next move and wraps from the third back to the first,
while the pill is what leaves the sequence. Wiring it to the pill's own action would make it a
duplicate on two boards and a lie on the third — the only board where "a different step" and
"done with the steps" can be told apart.

## D069 — the urge hub is a route of its own, not a step of the interrupt

`.vicifull/FLOW.txt` heads the five hub frames as their own section (`URGE HUB — RIDE IT OUT`,
badges 85A–85E) between the slip flow and Rough Days, and every pane carries the same close ✕,
five-dot pager, Breathe pill and "I slipped" link rather than a Continue. Nothing in the bundle
draws a door into it.

**Taken:** `/urge-hub`, rendered by `UrgeHub` in the urge kit, listed in `src/app/(app)/all.tsx`
under "In the moment" — the app's own index is how every other screen without a drawn entry
point is reachable. The Breathe pill enters the SOS stages the interrupt already ends on; the
hub's own ring is the surf clock, so the fourth stage (the wave) returns to the hub instead of
drawing a second one.

## D070 — an urge's length had no field, and two hub panes are read out in minutes

`85C · Your proof` draws twelve bars of "how long the last twelve lasted" and a
`Longest urge survived · 41 min` row; `85D · Surfed before` draws four rows of `14 min`, `22 min`,
`9 min`, `31 min`. `TidelineEvent` carried severity, `severityAfter` and `reopens`, and nothing
about duration.

**Taken:** one optional additive field, `durationSeconds`, on `src/lib/types.ts` and
`convex/schema.ts`, written by the interrupt when it resolves an urge. Events without it are
left out of the two duration visualisations rather than given an invented length. Both files are
shared, and the change is two lines and no migration.

## D071 — the hub's three chips are the canvas's own words, not the pickers'

`85A` draws a single-select row of `Bored · Relationship · Work or school`. "Bored" is a card in
`URGE_FEELINGS`; the other two appear in neither `URGE_FEELINGS` nor `URGE_TRIGGERS`. The hub is
a screen of its own and the canvas gives it its own three words.

**Taken:** built verbatim, one selected, and the chosen one filed on the live session as its
`trigger`. Translating them into the pickers' vocabulary would put words on screen the canvas
does not draw, which the brief forbids.

## D072 — `85E`'s kept-days row is one bar per day, capped at the canvas's own fourteen

The pledge pane draws fourteen `flex: 1` bars in a fixed row against the label `14 days`. Past
fourteen the bars would be thinner than their own 4pt gap.

**Taken:** one bar per day since the pledge was signed, capped at fourteen — the most recent
fourteen — with the label always carrying the true total.

## D073 — `react-native-web` serialises alpha to two decimals, so `0.055` renders as `0.05`

Every panel and idle chip in the urge hub is `rgba(255,255,255,0.055)`. `normalizeColor` packs
the colour into an int32 and prints it back with the alpha rounded to two places, so the DOM
carries `0.05` however the value is written — hex, rgba or otherwise. Over `#111211` the
difference is 1.3 of 255 on each channel.

**Taken:** left standing and recorded. Flattening it to an opaque colour would be wrong on the
two panes where the panel sits over the warm wash.

## D074 — `<Svg>` text inherits no font, and Chrome's SVG default is a serif

`85B`'s marker badge sets `32%` and `2:18 in` in the frame's own sans, which the canvas gets by
inheritance from the frame root. A `react-native-svg` `<Text>` inherits nothing: with no
`fontFamily` the browser draws its default serif, which is what the first capture showed.

**Taken:** every `SvgText` in the hub names `fonts.sansBold` / `fonts.sansMedium` explicitly.
Worth sweeping wherever else the app sets type inside an `<Svg>`.

## D075 — the funnel's one blur that is not a wash, and what it was costing

D010 substituted every `filter: blur()` in the bundle with a gradient that falls to nothing over
the blurred element's own box, on the reasoning that the thing being blurred is always a
`radial-gradient(closest-side, …)` with no hard edge. Across the twenty-two funnel frames that
reasoning holds twenty-nine times out of thirty: the corner bloom, the low sun and the nine
header blooms are all soft-edged radials, and each of those frames now diffs at **zero
non-antialiased pixels** against its design capture.

The thirtieth is `10 · First principle`'s ground shadow, and it is not a radial at all:

```
left:50% top:158px width:180px height:18px margin-left:-90px
border-radius:50% background:rgba(0,0,0,0.4) filter:blur(10px)
```

A flat 40 %-black ellipse 18 points tall under a σ=10 Gaussian keeps about 0.25 of alpha at its
centre and spreads to roughly ±25 points; the substituted radial keeps the full 0.4 and stops
dead at ±9. Drawn that way it read as a dark band with a visible top edge under the wave, and
the frame diffed at 708 pixels over 12/255.

**Taken:** the canvas's own blur is stated, per D063 — `react-native-svg` 15.15.4 carries
`<Filter>` / `<FeGaussianBlur>` on both builds. The board is padded 60 points each way (3σ = 30)
and the filter region is given in user space, because the default region is 10 % of the bounding
box and would clip a σ=10 blur inside an 18-point one. The frame now diffs at zero.

D010 is unchanged for the washes. This is the second screen family (after D063's) where the
distinction that matters is whether the blurred shape has an edge.

## D076 — a glyph the canvas fills is not also stroked

`gen-funnel.mjs` drops a grid glyph's own `fill` and `stroke` because the tile hard-codes its ink
and the tile flips between `#131313` on paper and `#F4F3F0` on night, so the colour belongs to
the tile. `FunnelGlyphMark` then put the tile's ink back — as **both** fill and stroke, on every
child.

Two of the twenty-four glyphs are bare filled paths with no stroke at all: the crescent on
`11 · When`'s "Late at night" (also `17 · What it affects`'s "Time") and the pillow rect inside
the bed. Inking their outline as well added a 1-point default stroke and drew them a point fat.

**Taken:** a child takes a stroke only when the canvas states a `stroke-width`, and a fill only
when it does not. That is the same test the fill already used; it was simply not applied to the
stroke. `11 · When` went from 191 differing pixels to 65, all of them antialiasing.

## D077 — the questionnaire's branching is app logic, not generated content

`src/content/onboardingFunnel.ts` is generated from the frames and carries exactly what the
canvas states. Eight rules govern the questionnaire that no frame can state, and this drop is
the first to ship them (`Latest Vici FULL/project/uploads/VICI_Questionnaire_All_Changes.docx`
§5). They live in the two files that own the flow, not in the generated one, because they are not
transcribed from anything:

| rule | where |
| --- | --- |
| `09B · Relapse` shown only after a stated quit attempt | `welcome.tsx` `skip()` |
| `18 · Loneliness` shown only on a loneliness / home-alone / rejection signal | `welcome.tsx` `lonelySignal` |
| `19 · Time alone` shown only on a home-alone signal or a reported loneliness | `welcome.tsx` `aloneSignal` |
| `12`, `14`, `22`'s "nothing" answer clears the rest | `v3.tsx` `O3_EXCLUSIVE` |
| `17 · What it affects` caps at three | `v3.tsx` `O3_MAX_PICKS` |
| `17` takes an empty answer when `16 · Impact` is "Not really" | `v3.tsx` `zeroOk` |
| `23 · Goal confirmation`'s four readings and its fifth line | `v3.tsx` `O3_GOAL_CONFIRM` |
| under 18 leaves the adult flow | `welcome.tsx` `gated`, `v3.tsx` `O3AgeGate` |

Two judgement calls inside that:

* The doc names three signals for 18 and says only "prefer showing this when home/alone context
  is relevant" for 19. 19 measures opportunity rather than feeling, so it follows the home/alone
  half of 18's set plus a loneliness he has just reported on 18 itself.
* §3's screen note for `11 · When` says to "allow continuing with zero selections … **or** add a
  plain 'None of these' option if the UI requires an explicit answer". The frame draws no such
  option and §5 — the summary the doc calls "Questionnaire-only branching rules" — does not list
  11 at all, so 11 still asks for one answer. Only 17's zero case, which §5 does list, is built.

The cap refuses a fourth tap rather than dropping the oldest pick, because the hint promises
"Choose up to three" and silently discarding the answer he chose first is the worse surprise.

## D078 — `23 · Goal confirmation`'s second line: the frame's words, on all three goals that share one

The doc gives the board five readings. The canvas draws one of them — goal "stop", with the
masturbation clarifier under it — and its wording differs from the doc's:

| | doc | frame |
| --- | --- | --- |
| stop, line 2 | That's what we'll build around. | That’s what we’ll work toward. |

The brief settles the case the frame draws: the frame wins for anything visible. It does not
settle "reduce" and "limit", which no frame draws and which the doc gives **the same second line
as "stop"**.

**Taken:** the frame's revision is a revision of that shared line, so all three carry
"That’s what we’ll work toward." "I’m not sure yet" has its own second line in the doc
("We’ll start with getting the choice back.") and keeps it. The alternative — one wording on the
board the canvas drew and the doc's older wording on its two siblings — would put two versions of
the same sentence in the same screen.

## D079 — the under-18 exit has no frame, and wears the statement board's numbers

The questionnaire doc requires `04 · Age` to gate: "if age < 18, leave the adult onboarding flow
and show an age-appropriate support message." The bundle draws no frame for where he lands, and
this run's own rule is not to invent artwork.

**Taken:** the branch is built, and the board it lands on is assembled out of the vocabulary the
two statement frames either side of it already state — `04 · Age`'s own night field, a 26/500 at
design y 338 on a 36 inset with `text-wrap: balance`, a 15.5/400 on a 24 line at y 434 on a 44
inset, the Back row at 94, and no forward control, which is the point of the screen. That is the
same call D047 made for the five undrawn auth boards.

The **words** are the one thing neither the canvas nor the doc supplies, and they are therefore
written rather than transcribed. They are flagged in REPORT.md as invented copy; if the canvas
later draws this board, the frame wins.

## D080 — `04 · Age` drops the line the doc keeps, and `24 · Build plan` disagrees with it twice

Two places in this group where the frame and the questionnaire doc state different visible copy.
Both are resolved the same way — the brief says the frame wins for anything visible — and both
are recorded because the doc reads like the newer document and is not.

* **`04 · Age`.** The doc's final copy keeps "We use this for the long-term projection later on."
  and its change note says explicitly: "Keep the explanatory line so the age request is not
  mysterious." The frame **deleted** it in this drop (`V3-Q25-Age.diff`, the whole diff). The app
  draws no line.
* **`24 · Build plan`.** The doc's three checklist lines are "Finding where you usually get
  caught / Looking at what tends to lead into it / Choosing what to change first". The frame
  draws "Finding where you usually struggle / Looking at what tends to set it off / Choosing
  where to start". The app draws the frame's.

## D081 — a radial gradient must be left in `objectBoundingBox`; `rx`/`ry` never reach the DOM

`react-native-svg`'s web build passes a `<RadialGradient>`'s props to the DOM verbatim, and
`<radialGradient>` has no `rx`/`ry` attributes. So `gradientUnits="userSpaceOnUse"` with
`rx={w/2} ry={h/2}` — which reads as the obvious transcription of a CSS `closest-side` — silently
becomes `r = 50%` **of the viewport**. On the week scenes' 393 × 258 band that is r ≈ 166 against
an intended 53, and every falloff spreads over the whole picture: week I's 46pt sun was wearing a
106pt flat orange disc instead of a halo that dies 39pt out, and its flag shadow was a hard-edged
disc at a uniform 0.08 instead of a smudge peaking at 0.063.

The fix is to say nothing at all. A CSS `closest-side` on a box is half its width by half its
height, and that is exactly what an untouched `objectBoundingBox` radial already is — on the web
by the SVG default, on device by `react-native-svg`'s own `cx/cy/r = 50%` defaults. Measured
against `Week-I-Reset` after the change: within 1/255 across the halo and the shadow, where the
`userSpaceOnUse` version was 20–45/255 out.

This is the same family as F8's finding about farthest-corner gradients, and the same rule closes
both: never hand a radial an explicit radius through `rx`/`ry`.

## D082 — a blurred solid is drawn the size its blur covers, so one signature row is wider than the frame's div

`filter: blur(r)` on a solid shape has no RN SVG equivalent, and unlike a blurred gradient (D010)
it cannot be absorbed: the blur **is** the shape. `WeekScene` redraws those layers as a soft
ellipse whose profile is sampled off the Gaussian — and two things follow that the previous flat
stop table got wrong.

* **The peak is not the stated alpha.** A shape thinner than its own blur never reaches it: the
  canvas's flag shadow is a 56 × 10 ellipse of `rgba(0,0,0,0.08)` under `blur(4)` and it measures
  0.063 at its centre, which is `0.08 · erf(5/4√2)`. (`filter: blur(r)` states σ directly; a
  `box-shadow`'s blur radius is 2σ. The two are not the same Gaussian.)
* **The falloff carries on outside the box.** Week X's 30 × 44 glow under `blur(6)` reads about
  54 × 68 on the canvas. Drawing it at 30 × 44 left a visible rim where the design has none.

So the soft ellipse is drawn 2σ past the stated box, where a Gaussian has spent 95% of itself.
The consequence is deliberate and is the only signature mismatch these twenty-four frames leave
standing beyond the two washes: **the ten blurred-solid layers report a row 2σ wider and taller
than the frame's own div**, because the div is not what the canvas paints. Whole-image
comparison is what confirms it — every one of the twenty-four pairs is within 17/255 apart from
the fractional-coordinate edges of D083.

## D083 — Chrome snaps a DOM box to whole pixels and does not snap an SVG shape

Week VII's and week XII's boats are the only scene parts the canvas composes on fractional
coordinates (`left: 230.6`, `216.96`, `153.7`, `39.68` wide). The design frame is a DOM box and
Chrome rounds its painted edge to whole CSS pixels; the app draws an SVG rect at the stated
230.6. The two therefore disagree by up to one device pixel on those edges — Δ46/255 on a mast
edge, since it is grey on paper — and the same shows fainter on the fractional cloud edges of
every week (Δ11–17).

The app is drawing the number the canvas states, and on device there is no DOM box to snap, so
this is left alone. Rounding scene coordinates to integers to chase the frame's rasteriser would
mean drawing something the canvas does not state.

## D084 — the frames omit the two pips in the seam between a week's P1 and its P2, and the app draws them

Every week board draws its rows as `n` cards with `n−1` pip pairs between them: `Week I Reset`
puts rows 01–04 at 486/566/646/726 and pips at 547/555, 627/635, 707/715, and stops. But the pair
that belongs between row 04 and row 05 would sit at 787/795 — above the closing land at 798, on
screen, and the canvas does not draw it. The same gap appears on all twelve P1 frames.

That is the frame being a static composition rather than a scroll position. `Week I Reset P2` is
the same board scrolled 320pt (D-019) and it proves rows 05–07 follow, and it draws pips after 05
and 06 — so under the canvas's own rule (a pair between every two consecutive lessons) the 04→05
pair exists; the P1 frame simply ends its column at four rows. A running board that dropped them
would break the chain the moment it moved.

**The app draws them.** It costs two 3.5pt dots at 20% on the P1 frame of every week, which is
the one place these twenty-four screens deliberately differ from the canvas. The reverse — a
scroller that hides the pips below its last fully-drawn row — is not a thing the canvas states
anywhere, and would look broken in motion.

At the P2 position the app agrees with the frame without needing to: the 04→05 pair lands at 467,
above the row column's own clip at 484, so nothing shows above row 05 there either.

## D085 — lesson one is authored twice in this drop, and the restyled copy is the current one

`Email Login.dc.html` draws `Lesson Scroll 1…26` and `Lesson 1 Surviving the Night.dc.html` draws
`L1 Frame 01…26`. Same twenty-six pages, same words, and this drop changed all twenty-six of the
second set and none of the first.

Transcribing both and diffing them pairwise gives 190 differing lines and **not one of them is a
word**. Every difference is one of the substitutions in the bundle's own
`Latest Vici FULL/project/restyle-lessons.js`:

```
26/38 → 24/32   28/40 → 24/32   28/44 → 26/39   21/36 → 17/26   22/32 → 20/28
16/600 → 17/600   13/19 @ margin-top 4 → 15/21 @ margin-top 3
column gaps 48 → 22 (36 on an epigraph), 44 → 30, 30 → 24
the list board: top 126 / bottom 56 / flex-start / padding 70px 32px 0
             →  top 118 / bottom 48 / center     / padding 0 32px
and the progress rail recomputed as floor(n / total × 100), so 4 % becomes 3 %
```

That script is the bundle's own transform, and it was run over `Lesson 1 Surviving the Night` and
over all twelve week canvases — i.e. over lessons 1 through 84 — and not over Email-Login's copies.
So Email-Login's `Lesson Scroll` frames are the pre-restyle leftovers of a set that has been
restyled everywhere else, and building from them would leave lesson one set in a type ramp no
other lesson uses.

**Taken:** lesson one is built from `Lesson 1 Surviving the Night`, which is what
`scripts/vicifull/gen-lesson-scrolls.mjs` already reads. Twenty-six of Email-Login's 267 frames are
therefore deliberately not matched; the delta against each is exactly the list above.

This does not contradict D008 (a screen beats a record). Both of these are the same screen drawn
twice in the same drop; the tiebreak is which authoring is current, and the restyle script names it.

## D086 — the reader's generator read four canvas values by their font size, and the restyle moved all four

`gen-lesson-scrolls.mjs` classified by magic number: the cascade was "an inner column containing a
22px run", the pick board's question was "the 26px child", the task board's title was "the 26px
child", the board's closing note was "the 13px children". D085's restyle set those to 20, 24, 24
and 15 — so on this drop's re-run the generator silently produced:

* **0 cascades** instead of 28. Each fell through to the attribution branch below it, which keeps
  the *first* line and drops the rest — and draws it as a row rather than a column. Lesson 1
  pages 7, 11, 15 and 21 lost `Ninety days.` / `The rest of your life.` and their siblings.
* **0 questions** on 75 pick boards — every one drew its options with no question and no prompt.
* **0 titles** on 82 task-options boards — `Match where you sleep` and its 81 siblings vanished.

**207 runs of copy** in total, across all 84 lessons. `lesson-verify.mjs` now reports 4,521 text
runs drawn, 4,521 transcribed, 0 either way.

**Taken:** classify by shape, which survives a restyle where a size does not. The cascade is the
only inner column whose children are all runs of copy (28 of them, all
`flex-direction:column; align-items:center; gap:26px`, none stretched — verified over all 1,858
frames). The question and the title are each their box's *first* run; the helper is the 15pt line
under the question; the closing note is whatever runs follow the list. This is the general lesson
of this drop for every generator on the run: a canvas number is data, not a discriminator.

## D087 — the 240 × 96 mark is the sunrise and the 240 × 100 is the bed, and the names were the wrong way round

`gen-lesson-scrolls.mjs`'s mark table matched art by box size and mapped `240 × 96 → 'bedphone'`
and `240 × 100 → 'sunrise'`. Both boxes exist only in lesson one, and the frames are unambiguous:
`L1 Frame 09` is the 240 × 96 box and draws a disc clipped to its top half on a horizon rule with a
dash either side; `L1 Frame 14` is the 240 × 100 box and draws a bed with a lit phone tilted 8°
over it. `components/lesson/scroll.tsx`'s own components are named correctly and its comments name
the right frames.

So the reader has been drawing the bed on `Get to tomorrow.` and the sunrise on `Maybe you were in
bed with your phone…` since the marks were first read — through the previous drop as well; the
mapping is identical in the committed file. Swapped in the generator and regenerated.

## D088 — the reader's progress hairline is the frame's own percent, not (index + 1) / count

`restyle-lessons.js` writes each frame's rail as `floor(n / total × 100)`, and
`lessonReader.ts` has carried that as `page.progress` all along. `scroll.tsx` ignored it and
computed `round((index + 1) / count × 100)`, which is a different number on most pages: lesson one
runs 3, 7, 11, 15, 19, 23, **26**, 30, 34, 38, 42, 46, 50, **53**, 57, 61, 65, 69, 73, **76**, 80,
84, 88, 92, 96, 100 — the floor steps at pages 7, 14 and 20 are not on a linear ramp at all. Page 1
was 14.4pt of fill where the frame draws 10.8.

**Taken:** `LessonScroll` takes the page's own `progress` and falls back to the computed value only
for a frame that states none (there are none). It is also the one thing on a reader page that is a
function of the page index, which makes it the way a headless capture can prove which page it
landed on — see `.vicifull/recipes/lesson-scrolls.json`.

## D089 — the task-options board centres its stack; it used to lay out from a 70pt pad

Consequence of D085's restyle, called out separately because it moves every row on 82 screens.
`Board` in `components/lesson/reader.tsx` hardcoded `justifyContent: 'flex-start'` for the
options board, which was right for the previous drop's `top:126; bottom:56; justify-content:
flex-start; padding:70px 32px 0`. All 82 now state `top:118; bottom:48; justify-content:center;
padding:0 32px`, and every element on the board was landing **52.5pt** high.

The board's side padding moved with it, from the box onto the scroller's content container: a
scroller clips, and with the padding outside it the 38pt icon plates sat exactly on its left edge
and lost the 1pt hairline their `0 0 0 1px rgba(0,0,0,0.08)` ring draws outside them.

## D090 — the reader room's door leaf is skewed, and its generator read only `rotate`

`scripts/vicifull/gen-reader-art.mjs` reduced a layer's whole `transform` to
`rotate: Number(match(/rotate\((-?[0-9.]+)deg\)/))`, so the one transform in the night room —
`transform: skewY(-7deg); transform-origin: top right` on the open door's leaf — was dropped and
the app drew the door as an upright slab. `TaskScene`'s `cssTransform` has read a raw
`transform`/`transform-origin` pair (skews and scales included) for a while; nothing was handing it
one. The generator now emits both verbatim. Pixel difference against `L1 Frame 18` fell from 6,067
to 571, and the 571 that remain are one-device-pixel edges (D083).

## D091 — a blurred solid is `<FeGaussianBlur>`, not a radial standing in for one

D082 opens "`filter: blur(r)` on a solid shape has no RN SVG equivalent", and that premise is
out of date: `react-native-svg` 15.15 ships `<Filter>` and `<FeGaussianBlur>` on all three
targets — the DOM elements on web, `RNSVGFeGaussianBlur` (Metal CI) on iOS,
`FeGaussianBlurView` on Android. So the eight blurred solids on `28 · Start Here`,
`29 · Step 1` and `30 · Step 2` are not approximated at all. `SoftBlob` draws the canvas's own
ellipse, at the canvas's own flat alpha, under the canvas's own σ — `filter: blur(r)`
states σ directly, where a `box-shadow`'s blur radius is 2σ.

Two things have to be said explicitly or the filter clips its own output square:

* the `<Svg>` is padded 3σ on every side (99.7% of a Gaussian) and its `left`/`top` moved
  back by the same, so the falloff has canvas to land on; and
* the `<Filter>` region is given in `userSpaceOnUse` over that whole padded box. The default
  `-10% … 120%` of the object's own bounding box is nowhere near a 14pt-tall shadow's 5pt
  blur, and cuts it off at a hard edge.

Measured against the frames at 2x, at the same points the verifier used. `28`'s bed shadow:
centre 229 vs 229, 59pt off centre 236 vs 236, top edge 236 vs 237, bottom edge 239 vs 239,
six points below the box 248 vs 248 — every one within 1/255, where the box-clipped radial was
10–15 out. `29`'s nightstand glow 247,240,228 vs 246,240,229 (was 17 out on blue); `30`'s door
glow 246,239,227 vs 247,241,229 (was 18 out). Inside the 240 x 200 art box, pixels differing by
more than 6/255 fall from 13,221 / 7,992 / 16,976 to 96 / 107 / 80 of 192,000, and what is left
is the one-device-pixel edges of D083, not the shadows.

This supersedes D082's *method* for this group; D082's two observations remain exactly right
and are why the radial was wrong. `WeekScene`'s `blurredSolidStops`, `tail.tsx` (F24) and
`SosSceneLayer` still carry the approximation and can adopt this — the radial cannot be correct
on both axes of a 146 x 14 shape at once, and those are the shapes it is being asked to draw.

The declared signature consequence: **each blurred solid reports one extra `svg` row, 3σ
larger than the frame's own div** (`28` three, `29` two, `30` three) — 71,341,176,44 where the
canvas states 86,356,146,14, and so on. The div is not what the canvas paints.

## D092 — `27 · Where We’d Start`'s chip column is `white-space: nowrap`, and one D053 label overflowed it

D053 gave the nine `13 · When` options a chip form each, with the stated rule: slots 1, 8 and 9
take the words `27` itself draws, and the other six "keep the current label where it fits the
column and are shortened where it does not". One entry was not measured against that rule.
At the frame's own 13.5/600, in the frame's own family, the nine chip forms measure

    Late at night 82.0 · In the morning 94.7 · **When I’m bored 103.4** · Stressed 58.2 ·
    Can’t sleep 73.9 · On weekends 87.8 · After drinking 90.3 · Home alone 77.4 · Phone in bed 84.8

against a 100pt column. `When I’m bored` is the only one over it, and it is shortened to
**`Bored`** (38.9) on the same pattern its two neighbours already use — `When I’m stressed` is
`Stressed`, `When I can’t sleep` is `Can’t sleep`.

The frame also states `white-space: nowrap` on that run, and the app was not saying it.
`numberOfLines={1}` is not the same thing on `react-native-web`: it compiles to
`-webkit-line-clamp`, which clamps the *paint* but still lays the run out over as many lines as
it needs, so the label box grew to 100 x 31 against the frame's 16 and both lines rendered.
The run now carries the canvas's own `whiteSpace: 'nowrap'` on web (`numberOfLines` still does
the job on device), so a label wider than the column overflows it and stays one line, which is
what the frame draws. Captured: all three chips 16 tall, at 38.9 / 58.2 / 73.9.

## D093 — `28 · Start Here`'s sentence names the change the board is proposing

`28`'s subtitle is generated from his own answers — `whenShort` / `whereShort` / `starterFor` —
and for the canvas's man it renders the frame's string character for character: "Late night,
bed and scrolling came up together in your answers.", under "Keep your phone out of bed
tonight." What holds that board together is that the change being proposed is one of the three
things the sentence names: the proposal is slot 9, `While scrolling`, and the sentence says
scrolling.

D054's `Choose another` swaps the proposal to another of his signals, and the sentence was
never re-read against the swap. Two of the four boards — `When I can’t sleep` and `When I’m
home alone` — are not among the three terms for a man with the canvas's answers, so the board
argued for a door using evidence about a phone: "Keep one door open tonight." over "Late night,
bed and scrolling came up together in your answers." Captured verbatim from the running app.

**Taken:** the board's signal takes the `when` slot whenever it is not already one of the three
terms (compared case-insensitively, since `While scrolling` shortens to "Scrolling" and the
starter term says "scrolling"). Every word is still one of his own answers, the frame's sentence
keeps its shape and its two 23pt lines, and the canvas's own state is untouched — re-captured
at 44,516,305,46 with the frame's string. The alternative, a written line per board, would have
invented copy for a board the canvas does not draw and would have changed the paragraph's
height as well.

## D094 — three morning frames hide their own Back row and rail behind the sky band, and the app draws them

The eight morning and night check-in frames all author the same navigation: a chevron plus
"Back" at `left: 16, top: 66, gap: 9` (`stroke #55534E`, 17/400 in the same grey) and the dot
rail at `top: 72`. On five of them the opaque sky band is the **first** child and the navigation
comes after it, so both are on screen. On `Morning Resign Pledge`, `Morning Pledge Signed` and
`Morning 5 Done` the order is reversed — the band (212, 212, 452) is the **last** child — and CSS
paints it over the top, so the rendered frame shows a bare cream band where the other five show
the way out and the step you are on.

The two subtrees are identical across the split. `Morning-Resign-Pledge` and `Morning-Feeling`
state the same `left:16 top:66 gap:9`, the same `viewBox="0 0 11 19"` chevron at
`stroke-width 2.4`, the same `#55534E` on both the path and the word, and the same rail geometry;
only the sibling order differs. The occluded ink is also the ink for the band it sits on — a warm
grey chevron on a light morning band, not the light ink the night frames use — so it was coloured
to be seen there.

**Taken: a layer-order slip in the export, and the app draws both.** The alternative reading is
that the flow deliberately withdraws its own Back control and its own progress rail on three of
its eight steps and puts them back on the others, which the identical markup argues against.

Cost of the choice, measured this pass on all three frames at a threshold of 8: **2,062 device
pixels**, in clusters `37.5..73 × 69.5..82` (n=658, Δ160, the word), `16.5..26.5 × 67..85.5`
(n=283, Δ161, the chevron), the active rail stadium (n=412, Δ224, at 207 or 220 depending on the
step) and the five inactive dots (n=120 each, Δ42). With those set aside all three frames are
otherwise pixel-clean — it is the **only** difference on `Morning Resign Pledge` and `Morning 5
Done`, and the only one on `Morning Pledge Signed` once the signature is seeded (below).

A signature diff cannot see this: `getBoundingClientRect` does not know about occlusion. It has to
be carried as a written decision or a later audit re-finds it as a defect.

## D095 — `Change Pledge Sheet` draws a placeholder backdrop, and the app draws the live screen

Behind the `rgba(38,37,30,0.42)` scrim the frame draws three flat `#E8E7E1` blocks at opacity
0.45 — `12/164/369 × 48`, `36/228/321 × 236`, `12/544/369 × 152` — and nothing else. No Back row,
no rail, no sky band, no title.

Those three boxes are not the screen the sheet opens over. `Morning Resign Pledge` puts its pledge
card at `24/342/345 × 324` and its title at `24/270`; not one of the three blocks lines up with
anything on it, and `#E8E7E1` appears on no other frame in the whole 267-frame Email-Login bundle.
They are the canvas's wireframe stand-in for "some screen is under here", drawn because a static
frame has no parent to show through.

**Taken: the app draws the live screen under the scrim**, which is what a bottom sheet does. This
is a large, deliberate departure and belongs in the log rather than in a code comment: against the
frame it is about **136,000 differing pixels** above the sheet — y50-99 27,163 (the Back row and
the rail), y100-149 34,188 and y150-199 46,974 (the sky band, glow, sun disc and the two hills),
y200-249 20,436, y250-299 7,342 ("Re-sign your pledge." showing through), at up to Δ131.

Everything from the scrim forward is exact. Measured over the sheet's own region (y ≥ 320) the
whole frame differs by **152 pixels, all of them the caret** — the scrim value, the sheet
(`0/320/393 × 532`, 22/22/0/0, −12px shadow), the grabber, the title, the sub, the white card, the
pill and "Keep current pledge" are pixel-identical.

The card is drawn **mid-edit**: it types "Phone stays out of the bedroom" where `Morning Resign
Pledge`'s card carries the standing "The mornings are mine again." That is one account with the
sheet open and a replacement half-typed, not two accounts, and `.vicifull/recipes/day.json` drives
it that way (`.vicifull/fday-sheet.js`) rather than seeding a second pledge that would then
contradict the frame before it.

## D096 — `Morning Task Check`'s Yes glyph has no `fill` in the canvas, and the app keeps `fill="none"`

The check inside the Yes pill is `<svg viewBox="0 0 19 15"><path d="M2 8L7 13L17 2"
stroke="#FFFFFF" stroke-width="2.4" …>` with **no `fill` attribute**. SVG's initial `fill` is
black and a path is filled as if closed, so the frame paints a black wedge inside the tick: design
pixels there read 0,0,0 where the app, which writes `fill="none"`, leaves the `#131313` pill
showing at 19,19,19. 120 device pixels at `283.5..294 × 737..744.5`, max Δ19/255 — and it is the
only difference left on that frame.

The canvas contradicts itself here, and the count is lopsided. Of the stroked paths in the
Email-Login split that state a fill at all, **553 write `fill="none"` and 3 name a colour**; 166
omit the attribute. Every other check glyph in the bundle — `M1.5 5L4.5 8L10.5 1.5`,
`M2 6.5 L5.5 10 L12 2.5` — writes `fill="none"`. And of the omissions inside this group's 17
frames (`Morning-1-Yesterday`, `Morning-Pledge-Signed`, `Night-2-Record` ×2,
`Night-Action-Reminder`, `Morning-Task-Check` ×2 more), every one is an open subpath enclosing no
area, so this is the single place the omission shows at all.

**Taken: `fill="none"` stands.** The frame's intent is a stroked tick; the black wedge is what an
absent attribute does, not what the design draws, and D076 already settled the same question the
same way — a child takes a fill only where the canvas states no `stroke-width`. Recorded because
it is a real Δ19 mismatch a later audit will re-find, and because the same omission on a light
plate would not be arguable.

## D097 — the ledger's `+12 → 1,240` is a day-41 number on a day-13 flow, and is not reachable from its own rows

`Morning 1 Yesterday`'s first ledger row reads `+12 → 1,240` above four rows that state the
account exactly: `Pledge kept`, `One urge surfed`, `0 relapses`, `Part III finished`. On the app's
own weights (`src/lib/score.ts` — clean day 4, check-in 2, lesson 3, urge ridden 2, slip −16) that
day is worth `4 + 2 + 3 + 2 = 11`, or 9 with no check-in filed. **12 is not reachable at all**:
every combination that keeps the lesson and the urge is odd.

The total is borrowed. `1,240` is exactly the score the sample account behind `Today Home` carries
— `.vicifull/recipes/today.json` seeds it as "day 41, score 1,240, Navigator · II", and
`Today-Home` draws `Day 41` and `1,240` on the same frame. But **both** check-in covers in this
group draw `Day 13 · two minutes` and the cover's pill reads `Begin day 13`, and at day 13 a total
of 240 over the base would need 54 lessons finished. Three frames say day 13; one number says day
41.

**Taken: day 13, and the app computes the row.** Seeded to the frame's own account
(`.vicifull/day-seed.js`) the app draws `+11 → 1,064` at the canvas's origin with the canvas's
metrics (13.5/600 `#131313` for the detail, 15/500 `#1D1C1A` for the label); the 1.6pt move on
"Recovery score" is the `flex: 1` remainder after a score string 1.6pt narrower, not a layout
difference. 1,228 device pixels, all of them inside those two text runs, and the only difference
left on the frame.

This is FINDINGS F28's test applied and failed honestly: the row was seeded rather than excused,
and the seeding is what proves the canvas is the side that cannot be produced. The same test
*passed* everywhere else in the group — `Night Action Reminder` goes to **0** differing pixels on
a day-1 seed (`.vicifull/vday-seed-d1.js`), and `Morning Pledge Signed`'s signature goes to 0 once
`day-seed.js` carries the canvas's own name, `Jerry`, which is the only name any of the 17 frames
prints.

## D098 — an inset shadow does not survive an `<Svg>` background, so it is painted twice

CSS paints an element's `inset` box-shadow over its own background and under its children. In the
app the background of a struck disc **is** a child: an absolutely-positioned `<Svg>` holding the
face's radial gradient. CSS paints every positioned box above every non-positioned one, so the
face lands on top of the parent's inset shadow and the rim light is simply not drawn.

`37 · A Letter Arrived`'s wax seal states `inset 0 0 0 3px rgba(255,255,255,0.25)` and
`40 · Medallion Earned`'s coin states `inset 0 0 0 4px rgba(255,255,255,0.25), inset 0 -8px 18px
rgba(120,88,40,0.28)`. Both were on the wrapper `View` in `src/components/onboarding/handover.tsx`
and neither reached the screen: the coin read as a flat darker ball instead of a lit struck disc,
plain at a 3x crop and invisible to the signature diff, which sees the box and not the paint.

**Taken:** hold the shadow string in one const, and re-paint its `inset` segments on a
`pointerEvents="none"` overlay `View` placed **after** the face `<Svg>` and **before** the disc's
own children, which is exactly where CSS puts them. `src/app/letter.tsx`'s `insetOf(shadow)` and
`src/app/medallion-post.tsx` already did this for the same two discs; `handover.tsx` now composes
the strings locally instead of importing `insetOf`, because `letter.tsx` imports `O3LetterRead`
from `handover.tsx` and the import would close a cycle.

Measured after: the seal reads 234,206,156 / 238,216,174 / 230,196,138 against the frame's
234,206,156 / 238,216,174 / 230,196,138, and the whole frame falls to **1 of 19,502** 8x8 blocks
over 4/255. The coin's frame does the same. This is the same family as the `<Svg>` paint-order
trap in the brief, and the same rule finds it: an `<Svg>` next to absolute siblings changes what
is painted over what.

## D099 — `/reminders` has no frame in this drop, and takes `47 · Reminders Setup`'s words for the two notes it shares

`src/app/reminders.tsx` is the Settings-side reminders screen (Settings > All > Reminders). No
frame in `Latest Vici FULL` draws it: the only reminders frame is the onboarding
`47 · Reminders Setup`. Its own header still cites badge `101`, from two drops ago.

It draws the **same two notification cards** as `47` — same titles, same `now`, same 0.55 on the
second, same geometry — and this drop deliberately restated the second one: `10:41 PM` became
**"You pick the time"** and "Your risky window. The wave tool is one tap away." became **"The time
you told us about. SOS is one tap away."** The retired pair survives in the bundle only inside
`VICI-previous` / `vici-prev`, which D003 rules reference material and not a build target — so
`/reminders` was the last place in the app still promising a clock hour nobody had chosen, and the
last place still naming "the wave tool".

**Taken:** the two notification runs follow `47`, because they are the same object and `47` is the
only version this drop authors. The screen's own headline ("Two reminders a day.") and sub
("Timed to your risky window. Nothing noisy, nothing shaming.") are **not** changed: no frame in
this drop authors them, `47` has no equivalent line, and rewriting them would be inventing copy
rather than transcribing it. Flagged rather than hidden, because it is a judgement call about a
screen the canvas does not draw.

## D100 — the album's low sun is the frames', not the rule read off them, and two cards say so

D062 read `Album Earned II`'s sunless **Lessons** and `Medallions Still To Earn`'s sunlit
**Return** as canvas slips and drew both the other way, leaving one signature row standing on each
of two frames. That cost a measurable 30pt radial on each. Re-checked against all three album
frames, the case for "slip" is weaker than D062 states and the case against it is stronger:

* D062 argues Return's box is "a byte-copy of Vidi's". It is not Vidi's in particular — the box
  `right:6% top:34% width:44% height:44%` is the bundle's default placement, drawn identically on
  **five** faces (Vidi, Logbook, Pulse, Black Box, Return). Veni, First light and Rebound share a
  second (`left:16% top:6% 56%`), and Vici and Breakwater each get a bespoke one. The placement
  travels with the face's device, not with the card's state.
* Reading the sun as a property of the face explains **22 of 22** album cards with no exception.
  Reading it as the mark of a struck face explains 20 and needs two authoring mistakes in a bundle
  that is otherwise identical to the byte between drops.
* The sun exists only on the 68pt album card. No tier row and none of the ten 150pt boards draws
  one, on any face, so it is not a face-level "this device has a sun" either.

Neither reading is provable from the frames alone, and one of them is drawn.

**Taken:** the frames win, as they do everywhere else this run (BRIEF, D007). `sun = earned`
stays the rule for the ten faces the canvas draws in only one state, and the two the canvas states
otherwise are carried as what they are: **Lessons never floats a sun and Return always does**
(`kkSun` in `src/components/keepsakes/Medallion.tsx`). Lessons' `SUN` entry becomes `null` — the
canvas gives it no placement to transcribe, and D062's was invented. Archive keeps an invented
placement, flagged as such in the table, because no frame draws it struck.

Measured after: `Album Earned II` whole-image mean |Δ| **0.41**/255 with **zero** pixels over 32,
`Medallions Still To Earn` **0.54** with zero over 32 (excludes only the top 54pt status bar the
app never draws). Both frames previously carried one MISSING/EXTRA row that no longer exists.
This supersedes D062's disposition; D062's description of the contradiction still stands.

## D101 — `Detail *` is stale, and it proves it on its own five frames — D057's stated evidence does not

D057's conclusion is right and its evidence is wrong. It argues the five-rung model from "the
`Medallions` album card for Vici was re-lined **this drop** from `Tier II · ×5` to `Tier I · ×5`".
Nothing of the sort happened: all 22 medallions frames are **byte-identical** between
`.vicifull/prev/Email-Login/` and `.vicifull/final/Email-Login/` (`cmp` on each, and
`.vicifull/fdiff/` holds no diff for any of them — `Medallion-Received.diff` is the only medallion
diff in the drop at all).

The evidence that does hold is on the frames themselves, and it is stronger:

* `Tiers Vici` states the whole ladder — `Tier I · ×5`, `II · ×25`, `III · ×100`, `IV · ×250`,
  `V · ×1,000` — and the `Medallions` album card writes Vici's rung `Tier I · ×5`, which only that
  ladder produces.
* The five `Detail *` pills are **not a coherent ladder of their own**: `Not yet · first ×1`,
  `Tier I · ×1`, `Tier III · ×25`, `Tier IV · ×100`, `Tier VII · ×1,000`. Five metals cannot carry
  tiers I, III, IV and VII with II, V and VI unaccounted for. `Breakwater *`, on the same screen,
  runs `Tier I · ×1` → `V · ×50` with no gaps.

**Taken:** D057 stands as taken — the app draws `Tiers Vici`'s five rungs — with its supporting
sentence replaced by the two points above. The `Detail *` pill and quote are the only rows in this
group that deliberately differ from a frame; measured, they are the whole of it. Outside the pill
(y 424–454) and the card quote (y 550–592), the five `Detail *` boards sit at mean |Δ| 0.26–1.47
with at most 0.2% of pixels over 8/255.

## D102 — `Album Earned II` is the grid scrolled to its stop, and that is where its bottom padding is written

The album grid is one scroller and the canvas draws it twice: `Medallions` with rows 1–3 at
290 / 475 / 660 (row 3 cut by the tab bar at 769) and `Album Earned II` with rows 4–5 at 290 / 475.
Pass 1 read the second as a page-flip mock — a redraw from the grid origin — and concluded no frame
states the grid's bottom padding, giving it `tabBar + 24`.

It does state it. The scroller's viewport is 290 → 769 (the bar sits below it, not over it), the
rows are five on a 185 stride, and only **one** bottom padding puts row 4 at the canvas's 290 when
the grid bottoms out: 126, which is exactly the gap `Album Earned II` draws between the last card's
bottom edge (475 + 168 = 643) and the tab bar (769). `tabBar + 24` = 107 counts the bar's height a
second time and leaves every row and every coin 19pt low.

**Taken:** a flat `paddingBottom: 126` in `src/app/(app)/milestones.tsx` — flat, not
`tabBar + n`, because the scroller already stops at the bar. Measured live: content height
1015 → 1034, max scrollTop 536 → 555, rows 309 / 494 → **290 / 475**, whole-image mean |Δ| for the
pair 6.11 → **0.41**/255 and pixels over 32 4.05% → **0%**.

## D103 — an inset shadow on a disc is a radial about the lifted centre, not a wash up from the bottom

The medallion's bevel states `inset 0 0 0 1.5px rgba(255,255,255,0.4), inset 0 -7px 12px
rgba(0,0,0,0.14)` on a circle. An inset box-shadow is the element's **own shape**, offset by the
shadow's y-lift, Gaussian-blurred, painted wherever that lifted shape does not cover and clipped to
the element — so on a disc it is a crescent that hugs the rim and follows its curve. `KKMedallion`
approximated it with a vertical linear wash across the whole disc, which is the right darkness on
the vertical axis and too light at the left and right of the rim.

That was disclosed (D058/D059) on the grounds that `react-native-svg` has no inner-shadow blur.
True, and beside the point: no filter is needed. The shadow's profile is the Gaussian's own CDF of
the distance from the lifted centre, which a `RadialGradient` states directly.

**Taken:** `RadialGradient` at `(50, 50 − lift·u)`, radius `innerR + 2σ` where `σ = blur·u / 2`
(CSS quotes a blur *radius*; the Gaussian behind it has σ = radius / 2), five stops carrying
Φ(−2 … +2) = 0.023 / 0.159 / 0.5 / 0.841 / 0.977 of the stated alpha, painted on a `Circle` of
radius `innerR = 50 − inset·u` — the bevel's own box, which is where CSS clips it, and 3pt inside
where the old `Rect` painted.

Measured on `Tiers Vidi`'s four struck rows, design vs app over the 64pt coin box: mean |Δ|
3.05 / 3.03 / 3.50 / 3.60 → **1.37 / 0.87 / 1.20 / 0.91**, pixels over 8/255 12.5 / 12.8 / 15.7 /
16.1% → **3.6 / 0.4 / 2.6 / 0.3%**. On the 150pt disc, 1.69–2.13 → **0.96–1.08** with 5–8% → 0.1–1.3%
over 8. What is left is the one-pixel antialias ring at the disc's edge, which is D083. The paper
row, which draws no bevel at all, was and is 0.16.

## D104 — D048's fade-stop rule also binds when the canvas's transparent stop is not the end of the ramp

D048 and F23 cover a two-stop wash whose zero-alpha stop names a different RGB from the opaque one.
The medallion's gloss is the other shape of the same trap and was missed by it:
`linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.10) 100%)`.
The transparent stop sits in the **middle**, and the segment after it runs to a different colour.

CSS interpolates premultiplied, so `rgba(255,255,255,0)` is colourless and the second segment is
pure black rising from nothing. SVG interpolates non-premultiplied and ramps white → black through
grey while the alpha rises, which lightens the composite. Measured in isolation over a mid grey,
the canvas gives 128 / 126 / 124 / 122 / 119 / 117 / 115 at t = 0.4 … 1.0 and the single-stop SVG
transcription gives 128 / 129 / 129 / 128 / 125 / 121 / 115 — **up to 6/255 too light**, across the
lower-right half of every struck coin in the app.

**Taken:** the stop is **doubled** at its own offset — `0.4 #FFFFFF/0` then `0.4 #000000/0` — which
is how SVG states the discontinuity CSS gets for free. Measured in isolation the split version is
exact to 0–1/255. End to end on `Breakwater Gold`, design vs app over the coin box: mean |Δ| 4.05
→ **1.94**, pixels over 8/255 12.68% → 7.17%, and the signed app − design along the gloss axis
+1.87 / +4.97 / +6.76 / +9.97 at t = 0.4 / 0.5 / 0.6 / 0.7 → **+0.18 / +0.33 / +0.80 / +3.73**
(the remainder at t = 0.7 is the rim, and is present on both sides of the fix).

**The general rule:** wherever a CSS gradient is transcribed into SVG, a stop at zero alpha carries
no colour information in CSS. Give it the RGB of whichever neighbouring stop the segment being
drawn runs to — and if the two neighbours differ, double it.

## D105 — a CSS gradient's zero-alpha stop is a null, and transcribing its RGB paints the wash dark

The tail's corner bloom, and every other field in the onboarding run, is
`radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)`. The app
transcribed it literally: `<Stop offset="0.72" stopColor="#131313" stopOpacity={0}/>`.

That is the one place where copying the canvas's number is wrong.

**CSS interpolates a gradient in premultiplied alpha.** At zero alpha the premultiplied colour
is zero whatever the RGB says, so `rgba(19,19,19,0)` carries no colour at all — the ramp runs
from premultiplied (25.2, 23.8, 21.0, 0.14) to (0, 0, 0, 0) and, un-premultiplied, the RGB
stays 180,170,150 the whole way out while only the alpha falls. **SVG interpolates
non-premultiplied**, so the same two stops ramp the RGB from 180,170,150 toward 19,19,19 as the
alpha falls, and the wash is painted with a black tint under a falling alpha.

Measured in isolation, rendering the canvas's own CSS gradient beside both SVG readings, at
r = 0.20 / 0.40 / 0.60 of the ellipse: CSS 243/246/249, SVG with a `#131313` fade stop
239/241/245, SVG with a `#B4AA96` fade stop 243/246/249. The same-RGB stop is exact to 0/255.

Measured on the frames, over the bloom band (y 58…130, x 20…380, 10 x 10-device-pixel patches
so the 0.12 grain averages out), the app read up to **5.06/255 dark** against the canvas and now
runs within ±1.20 everywhere, which is the grain's own noise: the rows below the bloom, where
nothing changed, sit at the same ±1.2.

**Taken: when a CSS radial becomes an SVG gradient, the zero-alpha stop takes the RGB of the
opaque stop, whatever the canvas writes at that stop.** This is D048's condition stated the
other way round — D048 dropped its extra midpoint because "both stops name the same RGB", and
did not cover the case where the canvas itself names a different one, which is precisely where
it matters. D104 reached the same premultiplied argument from the medallion's gloss and states
the general form, including what to do when the transparent stop sits mid-ramp with a different
colour on each side; this entry is the two-stop end case and the tail's measurement of it.

Applied to `src/components/onboarding/tail.tsx:69` (six of the eight tail frames) and to
`src/components/onboarding/v3.tsx:283` (the funnel's field — every questionnaire board, day and
night, since the premultiplied argument does not depend on the ground). `art.tsx`'s `Wash`
helper already writes `rgb(180,170,150)` on every stop and was right.

`node scripts/vicifull/stopcheck.mjs` lists every SVG fade stop whose RGB differs from its
opaque stop's. It found 19; these two are gone and 17 remain, and those need reading against
their own frames one at a time — a gradient the canvas really does state in two colours (the
paywall's mist, the drop's gold ramp) is not this defect.

## D106 — `funnel-cap.mjs` rasterised on a different path from `shot.mjs`, and it read as antialiasing

`scripts/vicifull/shot.mjs` launches Chrome with `--disable-gpu --disable-dev-shm-usage
--disable-extensions --no-first-run --js-flags=--max-old-space-size=256`; `.vicifull/funnel-cap.mjs`,
which is how every screen behind the funnel walk was captured, launched it with none of them.
Without `--disable-gpu` Chrome rasterises down a different path, and **an app PNG from one
harness differs from an app PNG of the same state from the other by 618 px over 12/255, worst
88** — measured on `31 · Your Plan`, a frame with no animation and no data in it.

That is the whole of what the `plan` verifier recorded as this group's antialiasing floor:
design-vs-funnel-cap on `31` was 620 px worst 88, funnel-cap-vs-shot.mjs was 618 px worst 88,
and design-vs-shot.mjs is **worst 6** across the entire body. Every pixel number in this run
that pairs a `funnel-cap` app capture with a `shot.mjs` design frame carries ~600 px of it
before anything real, and the fix pass would otherwise be chasing a launch flag.

`funnel-cap.mjs` now takes shot.mjs's args verbatim. Re-measured after the change: `31` design
vs funnel-cap is worst 6, the same as shot.mjs. Nothing else about the harness changed, and
`scripts/vicifull/audit.mjs` drives `shot.mjs` anyway — with `seedScript` planting the mock user
as an `--initseed`, which is what a `/welcome` walk needs and what `--seed` (a post-load reload)
cannot give it.

## D107 — SVG's initial `fill` is black, so every hollow layer in the task and lesson art was a black disc

`TaskScene`'s `Layer()` wrote `fill={stops || soft ? url : solid?.color}`. A layer that states a
`box-shadow` and no `background` — a hollow ring, drawn as an inset rim on nothing — made `solid`
null, so no `fill` attribute was emitted at all, and SVG's **initial** `fill` value is `black`.
37 layers across 14 task scenes and 8 lesson plates therefore painted as solid black discs:
Task D56's clock face (17,687 device px over 6/255, 1.32 % of the frame, mean Δ195), Lesson 22's
two orbit rings (46,571 px, 3.48 %, mean Δ224 — the worst pixels in the group), Task D44's six
chain links, Lesson 74's bicycle wheels.

The signature diff saw none of it: the box is at the right place and the right size, and only the
paint is wrong. **Taken:** a layer with no background gets `fill="none"`. Lesson 22's card falls
from 47,099 differing pixels to **46**, max Δ244 → **8**, and its 8×8 block diff to **zero**
blocks over 4/255.

## D108 — the CSS border-triangle idiom is a shape, and eight layers of art were transcribed as an empty box

`width:0; height:0; border-right:20.24px solid #D6D5D0; border-top:33.12px solid transparent` is
how the canvas draws both sails on the boats of lesson plates 47, 83 and 84, the tail of plate
66's speech bubble and the arrow on plate 18. `gen-lesson-art.mjs` read `border-radius` and no
other border property, so all eight came out as `{"kind":"box","width":0,"height":0}` and
`TaskScene` drew a zero-size path — the boats had a hull and a bare mast, the bubble no tail.

**Taken:** the generator emits `borders` (the four `border-<side>` widths and colours, where a
layer states any) and the renderer draws each face as the polygon CSS makes of it. With
`width` and `height` zero the padding box is a single point, so each face's miters collapse onto
it and the face is a triangle. No task scene uses the idiom; these eight are every one in the
group's bundles. Plate 47 falls from 89 differing 8×8 blocks to 37, plate 66 from 241 to 56,
plate 84 from 198 to 85, and what remains on all three is the fractional-coordinate edges of D083
— those boats are exactly the layers that entry was written about.

## D109 — an inset shadow that moves is still an inset shadow: 121 of 232 were being dropped

`TaskScene` read insets with `/inset 0 0 0 ([0-9.]+)px (colour)/` and drew them as a stroke half a
width inside the edge. That matches only the 111 spread-only insets; the other 121 state an offset
— `inset 0 -3px 0 #D6D5D0` under a book page, `inset 0 -2px 0 rgba(196,152,86,0.5)` under a lamp
canopy, `inset -2px -2px 0 rgba(0,0,0,0.05)` on a pillow — and every one was silently ignored.

**Taken:** all of them are drawn the way CSS defines them, as one even-odd path — everything
outside the box moved by the offset and pulled in by the spread — clipped to the layer's own
shape. That also fixes the spread-only case's radii, which the stroke approximated by shrinking
the box and keeping the stated corner radius. Task D35's pans now read 216,179,121 along their
lip against the frame's 216,179,121.

## D110 — CSS scales overlapping corner radii down, and 202 layers of art overshoot without it

Where two radii on one side of a box add up to more than that side, CSS scales **all** the radii
by the smallest factor that makes them fit. `radii()` read the four numbers literally, so
`3px 3px 19px 19px` on a 38 × 11 pot emitted `A19 19 … y+19` on a box 11 tall and the path
doubled back on itself: Task D35's plant pots drew as deep half-circles hanging below their own
box with a gold spike at each top corner, and Task D14's lamp canopy the same. The canvas's
own reading is f = 11/(3+19) = 0.5 → 1.5/1.5/9.5/9.5, a shallow bowl.

The same pass gave every corner its own vertical radius. The elliptical form's second list was
read as one radius for all four corners, so `50% 50% 46% 46% / 66% 66% 34% 34%` gave the bottom
pair the top pair's height on 30 layers, and `4px 4px 17.92px 17.92px / 4px 4px 13.44px 13.44px`
never triggered its own f = 0.899 at all.

**Taken:** `radii()` returns four `{x, y}` corners and applies the spec's scale-down. 202 layers
change shape; Task D35 falls from 231 differing 8×8 blocks to 144 and Task D14 from 94 to 15.

## D111 — a box-shadow's spread lies wholly outside the border box, and the ring was drawn twice as wide, half of it inside

`0 0 0 6px #E4E3DE` frames the window on lesson plate 18. `TaskScene` stroked the box path with
`strokeWidth = spread * 2`, centred on the edge — so the ring covered 6pt outside **and 6pt
inside**, eating the window's own glass. CSS puts the whole spread outside, with each non-zero
corner radius grown by it and each square corner left square.

**Taken:** the stroke's centreline is half a spread outside the edge and the stroke is one spread
wide. The one layer in the corpus that pairs a spread with a `clip-path` needs no offset rule at
all — see the entry below, which stops it being drawn.

## D112 — CSS clips an outer box-shadow to outside the border box, and paints the shadow list under everything, first on top

Two more orderings the renderer had wrong, both invisible until a background is translucent.

* The cast shadow was a filter on the layer's own path, merging `SourceGraphic` over the blur.
  Where the background is a gradient with alpha — plate 18's window glass is
  `linear-gradient(180deg, rgba(243,227,196,0.9), rgba(233,210,164,0.55))` — the shadow showed
  **through** it. CSS says an outer shadow "is drawn outside the border edge only". Measured: the
  app's glass read 234,219,191 where the frame reads 239,226,199, and the 6pt frame around it
  224,223,218 against 228,227,222 — a difference that ran the whole width of the window.
* CSS paints a box's shadow list in the order written, **first on top**, and the whole list behind
  the background. 83 layers state a ring before a cast; the app drew the ring first, i.e. beneath.

**Taken:** each cast is its own `<Path d={shape}>` under the rings and the fill, filtered with
`feGaussianBlur` → `feOffset` → `feComposite operator="out"` against `SourceAlpha` → the stain
matrix. The `out` is the border-edge clip. Lesson plate 18 goes from 241 differing 8×8 blocks to
**zero**.

## D113 — with a real Gaussian available, a blurred solid is blurred, not sampled (D082 narrowed)

D082 redrew every `filter: blur(r)` on a solid as a radial ramp fitted to the Gaussian, because
`WeekScene` had no blur primitive, and it had to correct the peak alpha by hand and grow the box
by 2σ to get the spill. `TaskScene` inherited a cruder version of the same idea — a box-clipped
radial at the layer's stated alpha — which is the failure F26 describes: too dark in the middle,
gone by its own edge.

D063 already ruled that `react-native-svg` 15.15.4 carries `<FeGaussianBlur>` on both builds, and
this file was already using it for cast shadows while its comment still said "RN SVG has no blur
filter". So the 259 blurred solids in the task and lesson art are now drawn as the canvas states
them: the solid, under `feGaussianBlur` with `stdDeviation` = the CSS blur radius, since
`filter: blur(r)` states σ directly where a box-shadow's blur radius is 2σ. The filter region has
to be stated in user space (3σ + 2 all round); the default is 10 % of the bounding box and clips
a 5pt blur inside its own bloom on a 10pt-tall shadow.

This closes **F2** as well as F26 for this group: the lesson cover's ground shadow was the
"distinct dark ellipse sitting on the hill" F2 names, and `/lesson/day/2` page 1 — the cover scene
frame — now diffs at **0** 8×8 blocks over 4/255 against `Week-01-Reset/L2-Frame-01`.

D082 still stands for `WeekScene`, which has not been changed. Where a renderer has the primitive,
it should use it; the sampled ellipse is the fallback, not the rule.

## D114 — the scene's clip box is the height the frame states, not the composition box scaled

`Scene()` sized its `overflow: hidden` wrapper as `boxH × (width / boxW)`, which is 200 for every
day. Two days state otherwise: `Task D74 Intro` gives the slot `340 × 186` and `Task D76 Intro`
`340 × 164`, each wrapping its whole art in a `scale(0.93)` / `scale(0.82)` group and clipping the
rest. Nothing is drawn in the extra points today, so it was invisible — but it is the box the
frame states, and on any scene whose art reached its own foot the clip would be in the wrong
place. `curriculum84.ts` already carried `intro2.sceneHeight`; nothing read it.

**Taken:** `Scene` takes the stated slot height. The captured rows are now `div | 26 | 419 | 340 |
186` on day 74 and `div | 26 | 440 | 340 | 164` on day 76, which is what those two frames state.

## D115 — the canvas spells one lesson title two ways, and each screen keeps the one its own frame draws

`Week-05-Why-It-Feels-Worth-It/L30 Frame 01` draws the reader title with straight ASCII quotes —
`The "Benefits" of Porn`, bytes 0x22 — and `Lessons-and-Tasks/Lesson-30` draws the same title with
`&ldquo;`/`&rdquo;`. The previous drop spells them the same two ways, so this is authored, not a
restyle artefact; it is also the only straight double quote in twelve week canvases that otherwise
carry 159 curly pairs.

**Taken:** each generated file keeps the frame it was generated from — `lessonReader.ts` the
straight pair, `curriculum84.ts` the curly one. The run's own rule is that the frame wins for
anything visible, and no single frame draws both screens, so there is no frame to break the tie.
`copy-sweep` reported **both** spellings missing, and neither report was a defect: the curly pair
because `&ldquo;`/`&rdquo;` were absent from the sweep's own entity table (now added, which drops
`Lessons-and-Tasks` from 341 misses to 338), and the straight pair because `lessonReader.ts` holds
its pages as JSON and escapes the `"` the sweep is looking for. It is a design-side inconsistency
and the design owner should pick one; the app will follow whichever frame changes.

## D116 — `Lessons-and-Tasks` carries a third, pre-restyle copy of lesson one, and 25 more frames are deliberately not matched

Alongside `Email-Login`'s `Lesson Scroll 1…26` (D085/F5) and the current
`Lesson 1 Surviving the Night`, the `Lessons-and-Tasks` bundle carries `L01-Reader-1 … L01-Reader-25`,
a **third** authoring of the same 25 pages at the pre-restyle metrics: 28/40 headings where the
current copy states 24/32, gap 36, `width:4%` on the progress hairline where the current states 3 %.

Same decision as D085, for the same reason: the restyled `Lesson 1 Surviving the Night` is the
current authoring and is what `gen-lesson-scrolls.mjs` reads. Recorded because these 25 frames are
named nowhere, and with the 83 `Task DNN Card` catalogue frames (F6) that is **108 frames of that
bundle which are deliberately not app screens** — a later audit reading the bundle end to end will
otherwise count them as misses.

## D117 — a `clip-path` clips a box-shadow away, and two layers of art were drawing one the frame does not

`clip-path` clips an element's entire rendering, its box-shadow included. An outer shadow lies
outside the border box and the polygon lies inside it, so a clipped layer paints no outer shadow at
all. Two layers state both: Lesson 13's signpost — `polygon(0 0, 84% 0, 100% 50%, 84% 100%, 0 100%)`
with `0 2px 5px rgba(40,38,32,0.14)` — and Task D39's trapezoid, `0 0 0 1px rgba(0,0,0,0.07)`.

`TaskScene` generated the shadow from whatever `shape` was, which for a clipped layer is the
polygon, so both drew a shadow around the cut silhouette that the frame does not draw. On plate 13
it is plain at a 5x crop: a soft dark halo hugging the arrow. **Taken:** a layer that states a clip
draws no outer shadow. Plate 13's stubborn blocks fall from 19 to 4 and its worst block mean from
12.2/255 to 4.0.

## D118 — two frames in the Settings family draw a stale generation of a screen authored elsewhere, and the screen's own frame wins

Two of this group's ten frames disagree with the frame that actually authors what they draw, and
in both cases the disagreement is a copy that did not get regenerated.

**`Settings Weekly Report` (93D).** It keeps a header block that `Weekly Report`, `… Days` and
`… Urges` (91C / 91C2 / 91C3) no longer draw: the subtitle `Your week at a glance` 14.5/400
#8B8882 at 24,157; an 88 x 78 desk-lamp illustration at right 16 / top 100 over a 56px blurred
#E2BA78 wash, 13 SVG shapes; and three 27-tall #FFFFFF chips with `0 0 0 1px rgba(0,0,0,0.08)` at
24,212 reading `7 check-ins`, `3 urges`, `0 relapses`. The 91C family draws a 361 x 106 gold card
(`linear-gradient(150deg,#F1E8D6,#D9CBAA)`) at 164 in place of all of it. One route renders both.
93D received only this drop's automated section-title restyle (20/600 -> 19/500) and nothing else;
the three 91C frames are internally consistent with each other. **Three frames to one: 91C wins.**
Measured on the driven capture (`/settings` -> `Weekly reports`): 35 of 68 design rows report
MISSING, all of them in that header block, and one type row inside the shared area disagrees —
`steady climb` in the trend pill is 12/600 on 93D and 12/500 on 91C. One Text cannot carry both;
it carries 91C's. Everything this group owns on the board is exact: `Recovery score` is
19px/500/-0.1px at 24,294, the Back row reads `Settings`, and the entry passes `?from=settings`.

**`Sheet Sign Out` (92D).** Its sheet is current — driven, the whole frame below css y 610 is
identical block for block, scrim and `0 -12px 40px rgba(19,19,19,0.3)` lift included. Its
**backdrop is an older Settings**: first caption at 168 where `Settings` puts it at 158, second
group at 330 where `Settings` puts it at 318, a third card with `padding: 6px 18px 14px` that
`Settings` does not draw, and **three** groups where `Settings` draws four. The app renders the
live Settings behind the sheet, which is 0 differing / 0 missing rows and 0 blocks over 4/255
against `Settings.html` itself. So the ~3,300 differing blocks above the sheet are the canvas's
stale backdrop, not the app's screen.

**Taken:** in both frames the screen's own frame is the authority and the composite is not, which
is DECISIONS D008 and D095's principle applied to a stale generation rather than to a placeholder.
Recorded so a later audit reads the row counts as known and chosen, not as 35 + 3,300 misses.
F18 asked for exactly this entry.

## D119 — `Your Vow Page` leaves the signature stamp blank and `The Vow` fills the identical div, so the slot is a blank sample — and the day in it is derived

`Your-Vow-Page.html` and `The-Vow.html` draw the same signature block, and on one of its four
children they disagree:

```
Your Vow Page : <div> left:0 right:0 bottom:14px text-align:center 12px/500 #B0AEA8    (no text)
The Vow       : <div> left:0 right:0 bottom:14px text-align:center 12px/500 #B0AEA8  · Jun 9 · Day 0
```

Same box, same metrics, same colour; one carries a run and one does not, and the empty one renders
`div | 36 | 594 | 321 | 0` — a styled box with height 0.

**Taken: the slot is a blank sample and the app fills it.** Everything this drop actually withdrew
it withdrew outright — the white signature card and its SIGNATURE eyebrow off this very page, the
`DAY N · TONIGHT'S TASK` eyebrow off the task frames, the `Find support` row off Settings. None of
them was left behind as an empty box with its type still stated. A fully specified div with no
content is an unpopulated slot, not a withdrawn one.

**The day in it is the account's own age on the day the vow was signed, not a literal `Day 0`.**
The page's closing line is `After a relapse you can re-sign the vow. It resets the promise, never
the progress.`, so the stamp has to survive a re-signing; printing `Day 0` above `Held for 35
days.` made the page contradict itself. `src/app/vow.tsx` now derives it from the signing entry's
own `createdAt` against the account's. Signed in onboarding — the only case any frame draws — the
two are the same day and it reads `Day 0`, which is what `The Vow` states.

Verified with a seed for the account this frame is drawn for (`.vicifull/settings-vow-seed.js`:
Jerry, signed 92 days ago), rather than reading the two live rows off Edit Profile's Sam Reyes and
excusing them: `Held for 92 days.` now matches the frame exactly and the name in the hand matches.
Whole-frame 8 x 8 block diff, excluding only the 54pt status bar: **45 blocks over 4/255, every one
of them in the three rows of this stamp** (css y 582/586/590) and nothing else anywhere on the page.

## D120 — the check-in wheel's night frames put the selected PM below their own selection band, and the hour column beside it is filler

`Settings Check-in Time` (92B) and `Nightly Check-in Time` (19C) both draw the wheel's
AM/PM column as

```
<div left:238 top:337 width:60>
  <div 22px rgba(90,88,82,0.55) line-height:29px> AM
  <div 30px #1D1C1A       line-height:44px> PM
```

so the **selected** PM — the 30px ink one — renders at y 366..410 while the selection band above it
is `left:46 top:335 width:301 height:44`, i.e. 335..379. The big black PM is drawn essentially
outside the band that marks the selection. `Morning Check-in Time` proves it is a slip rather than
a rule: it draws the same column with **AM** at 30px **first**, so its selected value lands at 337
and sits in the band correctly. The night frames swapped the two type ramps and did not move the
stack.

The hour column beside it is filler too. Centred on 10, it reads `7, 11, 12, **10**, 11, 12, 1` —
two of its seven slots are not a sequence at all, and no wheel can produce it. The minute column on
the same frame is exact (`27 28 29 **30** 31 32 33`) and lands on the app's own y positions to the
point: 250 / 279 / 308 / 337 / 381 / 410 / 439, both sides.

**Taken: the app centres the selected value on the band and draws the real sequence.** A picker
cannot put AM in the band on the morning board and PM below it on the night board, and it cannot
print 11 and 12 above a 10. Measured on the driven capture, every block over 4/255 on this frame
falls in one of the three wheel columns: **137 in the AM/PM column** (x 238..298, worst 166/255),
**34 in the hour column** (the two filler slots), and **11 in the minute column, none over 8/255**
— glyph antialiasing. Nothing else on the board differs at all, the reassurance line at 676 and the
seven day chips at 548 included.

The same two frames also disagree about the time itself: `Settings` draws the night pill `9:30 PM`
and `Settings Check-in Time` parks its wheel on `10:30 PM`. Neither is authored, so neither is
written into `src/lib/routines.ts`; each capture seeds the value its own frame draws
(`.vicifull/settings-seed.js` for the pill, `.vicifull/settings-checkin-seed.js` for the wheel).

## D121 — the shelf coin is struck in paper on every shelf and album frame, and `Edit Profile`'s Journey card contradicts itself

Two readings on `Edit Profile`, one of them a defect this run fixed.

**The medallion finish.** `profile.tsx` was passing each coin its own earned metal, which strikes
the disc in silver or platinum (`DISC.silver` #F2F3F5 -> #C6CBD1 -> #969DA6, `DISC.platinum`
#FFFFFF -> #EDF0F4 -> #C7CDD8). No shelf or album frame in the bundle draws a metal. All four faces
on `Edit-Profile.html` are plain stock — `linear-gradient(180deg,#EFEEE8,#EFEDE6)` on three and
`#F1F0EB -> #ECEAE3` on the fourth — and `Medallions.html` draws its six earned faces the same way;
the five treatments appear only on the `Breakwater *` and `Detail *` boards in `Medallions-v2`.
`milestones.tsx` already passed `metal="paper"` for the same faces, so the shelf was the outlier.
Measured across the top of the first coin: design 239,238,231, app **240,239,234** after the change
(Δ ≤ 3, warm paper on both) where before it read a cool 243,245,247 falling to 218,222,227. The sun
is now the album's own gating (`kkSun`, D100) instead of an unconditional prop — the canvas floats
no sun on its third coin, and `milestones.tsx` already gated it.

The devices below the stock still differ, and that is data, not finish: the app's four earned faces
are `veni / firstlight / vidi / vici` in album order, while the canvas draws three device-less hill
placeholders and puts `veni` — path for path, `M52 24 L52 50 L35 50 Z` and
`M29 54 L73 54 Q69 64 51 64 Q33 64 29 54 Z` — in slot **four**. Three of the canvas's four samples
are not any face the app has; the shelf shows earned faces in album order and cannot reproduce them.

**The Journey card.** It draws `Started VICI · 14 Mar 2026` and `Current week · VI · Discipline`
in the same card, and the app derives the week from the sign-up date: 14 Mar 2026 is 25 weeks before
this run's today, which is week XII and past. The two rows cannot both hold for any single account.
**Taken: hold the week, let the date read its own value** — the week row carries the more specific
content and the date row carries a value the account already owns. `.vicifull/settings-seed.js`
signs up 36 days back for that reason. Measured: the only blocks over 6/255 outside the coin row are
the 44 in the `Started VICI` value (css y 666..678), which is this contradiction and nothing else.

## D122 — SUPERSEDES D016: `03 · Name` draws its Back row, and the auth door stays open while onboarding is incomplete

D016 left the Back row off `03 · Name` because the account has just been made and
`src/app/(auth)/_layout.tsx` redirected any signed-in man straight out of the auth stack, so the
control would have been a loop. That was the app winning on what a control *does*. This run's brief
is literal parity, and the row was measured: 24 of the 37 8 x 8 blocks over 10/255 on that frame
fell in x 16–68, y 94–110, worst 104/255 — the row was the whole of the frame's pixel difference,
and every other funnel frame draws it.

**Taken: draw it, and remove the reason it looped.** Two halves, both needed:

* `src/app/(onboarding)/welcome.tsx` — step 0's Back leaves the flow instead of stepping inside it.
  Every account-creation path ends in `router.replace('/')`, so on the real path there is no history
  entry to pop; the control is `router.canGoBack() ? router.back() : router.replace('/(auth)/sign-in')`,
  which is the idiom `sign-up.tsx:60` and `welcome-back.tsx:115` already use.
* `src/app/(auth)/_layout.tsx` — the guard now redirects only on `user?.onboardingComplete`. A
  signed-in man with the questionnaire still open is exempt, which is what makes `02 · Login` a
  destination rather than a bounce. The redirect also waits for the user record to resolve, because
  `undefined` is "not loaded yet" and redirecting on it would shut the door in front of him.

Measured after: `V3-Q24-Name` design vs app, **0 blocks over 4/255** on the whole frame below the
status-bar chrome (`.vicifull/vfunnel-blockdiff.mjs`, which excludes device rows 0–107 — the band
the app never draws — and nothing else), against 37 blocks over 10/255 before. Driven: tapping Back
on `03` leaves at `/sign-in` with `02 · Login`'s own copy on screen, and the guard does not bounce
it back.

`specs/03-name.md` still records D016's reading and is stale; it is one of the four stale funnel
specs F10's renumbering pass has to rewrite.

## D124 — the Log Chooser is a route of its own, outside the tab group

`Log Chooser` (badge 90) draws **no tab bar** and puts its pill at 744–802. `Log Urges`,
`Log Check-ins` and `Log Reports` (91 / 91-2 / 91-3) all draw the bar from 769 with `Log`
active. Both cannot be the Log tab's root: inside `(app)` the bar claims 63 + inset = 83pt and
`bottom: Math.max(0, 50 - tabBar)` collapsed to 0, which put the pill at **711 — 33pt above the
canvas's own 744**, the one standing signature miss the pass-1 `logs` agent left (FINDINGS F17).

**Taken:** the chooser moves to `src/app/log-chooser.tsx`, a route outside the tab group, and
`src/app/(app)/log.tsx` becomes the register list the bar belongs to. The canvas's flow order runs
90 → 91, so the Log tab in `StoicTabBar` now opens the chooser and the chooser's close X opens the
log (`router.navigate`, which returns to an existing entry rather than stacking); the log's Back
row goes the other way. Measured after: the chooser's pill sits at `24 | 744 | 345 | 58` and its
`Continue` run at 763, identical to the frame, with no tab bar drawn and **no net signature rows**
— every remaining difference is D015 radius notation or a CSS box the app draws as an SVG.

`src/components/StoicTabBar.tsx` is shared, and the one line changed there is the Log item's
route.

## D125 — the same header card draws a grey sun on one of its three pages, and the app draws the gold

The weekly report's 361 × 106 header card is one element standing over all three pages. Two of the
three frames give its 30pt disc `linear-gradient(180deg, #E9C687 0%, #D9A95C 100%)`;
`Weekly Report Days` alone gives it `linear-gradient(180deg, #A9A597 0%, #767267 100%)` — while
keeping the **warm** halo behind it (`rgba(226,186,120,0.45)`) and the **warm** 5px ring
(`rgba(226,186,120,0.16)`). The whole card is new in this drop: `.vicifull/fdiff/
Weekly-Report-Days.diff` shows it replacing the previous drop's three white chips.

**Taken: gold.** A persistent header does not repaint itself as the reader pages sideways, the two
inks the odd frame uses are exactly two of the four on the mood scale it was drawn beside
(#A9A597 and #767267 — a paste from the wells being built on that page), and a grey disc inside a
gold halo and a gold ring is not a composition anyone drew on purpose. Recorded because the
difference is **invisible to a signature diff** — both sides report `background: -`, since one is a
CSS gradient and the other a `LinearGradient` — and only the PNG shows it: sampled at the disc
centre the frame reads 143,139,126 and the app 225,183,113, Δ82 on red over the full 30pt disc
(FINDINGS F35).

## D126 — the log family's frames are drawn from several different sample accounts, and four rows cannot be produced from any one of them

F28 says seed the state a frame draws rather than excusing it as sample data. Doing that across
this group establishes that the canvas's own samples disagree with each other, so no single account
satisfies the family. The arithmetic, on the app's own rules:

* **`Urge Overview` is three accounts over four pages.** `Urge Overview Summary` draws a
  three-urge week (`3 this week`, `2 of 3` ridden out, one `ended in a slip`).
  `Urge Overview` draws trigger bars at 100 % / 62 % / 34 %, and `Math.round(count / max × 100)`
  over three urges can only be 100, 67 and 33 — the smallest tallies that give 62 and 34 are
  29 / 18 / 10. `Urge Overview When` fills 2 + 2 + 1 band dots, a five-urge week.
* **`Urge Overview Mood`'s four shares are 70 / 45 / 30 / 15 — they sum to 160.** The app records
  one preceding feeling per urge, so four shares of one week sum to 100. Unreachable from any
  account.
* **`Weekly Report Urges` and `Log Urges` disagree about the same three urges.** The report's
  verdict reads `2 of 3 ridden out` while the log's card over the identical three rows reads
  `All ridden out`, and all three rows on both frames carry a ride-out outcome word
  (`rode it out`, `surfed the timer`, `rode it out`). The app computes it: 3 of 3.
* **`Weekly Report`'s `+12 points` over a `1,240` axis** is the same borrowed day-41 number D097
  already ruled on. Seeded to the frame's own week — 7 check-ins, 3 urges, 0 relapses — the app's
  weights give `7 × 4 + 7 × 2 + 3 × 2 = +48`. 12 is not reachable from the card above it.
* **`Lapse Done`'s `When` row reads `Last night`**, which is neither one of the three chips the
  `Lapse When` frame draws (`Just now` / `Earlier today` / `Yesterday`) nor the `Today · 11:40 pm`
  stamp a nudged wheel produces. No state renders it.
* **`Urge Overview When`'s third place row is `3. Bathroom 0`.** The list is a tally of the
  locations actually logged and a tally has no zero rows; padding it would mean inventing a place
  name the account never recorded. The app draws as many rows as the week made.

**Taken:** seed per frame rather than per group, and record the six rows above as canvas-side.
`.vicifull/logs-seed.js` (the three log registers and both flows), `logs-week-seed.js` (the three
weekly-report pages), `logs-summary-seed.js`, `logs-triggers-seed.js`, `logs-mood-seed.js` and
`logs-timing-seed.js` (one overview page each) each carry the frame they were built for in their
head comment. Everything else on those frames was then measured, and every one of them comes out
with no net rows apart from the calendar labels the frame's own dates carry.

## D127 — a register reads newest first; a reading reads the week forward

Four frames state a list order and they are not all the same:

| frame | order |
| --- | --- |
| `Log Check-ins`, all five rows | newest first |
| `Log Urges`, `Last week` run | newest first |
| `Log Urges`, `This week` run | oldest first |
| `Weekly Report Urges` | oldest first (Tue, Thu, Fri) |
| `Urge Overview Summary`'s week list | oldest first (Tue 15, Thu 17, Sat 19) |

One list cannot sort both ways, so `Log Urges` contradicts itself on its own two runs. The split
that fits everything else is by **kind**: the Log is a register and reads newest first (which is
also how its own group captions run — This week, Last week, Earlier); the report and the overview
are readings of one closed week and read it forward.

**Taken:** the Log keeps its newest-first sort — `Log Check-ins` matches the frame on all five rows
and titles, so the register side is settled by a frame, not by taste — and `Log Urges`'s this-week
run is the stray. `Urge Overview`'s `WeekList` was taking the store's order (newest first) and now
states ascending explicitly, which is what `weekly-report.tsx`'s `UrgesPage` already did; a week
over five rows keeps the five most recent and still reads them forward. Seeded to 91B's own account
the three rows then land at the canvas's 493 / 549 / 605 with `rode it out · 4 min`,
`rode it out · 6 min` and `ended in a slip` in the frame's order.

## D128 — the overview's bars name the noun, the log's rows name the first trigger, and one outcome word comes from the Log's table

Three small copy rules the canvas states in one place each and the app was applying inconsistently.

**`Tired` on the tile, `Tiredness` on the bar.** `Urge Overview`'s `Common triggers` list is
nouns; the picker's tiles are states. Where the two forms are the same word the canvas writes the
same word in both places (`Stress`, `Boredom`); the one word where they differ is written both
ways, in this drop and in `.vicifull/prev` alike. That is a display mapping, not a slip — a slip
would have moved one of the other two as well. `urge-overview.tsx` now carries a one-entry
`TRIGGER_NOUN` map and no more: the rest of the tiles keep their own label rather than being given
an invented noun.

**A log row's title is two parts.** The canvas always draws `<trigger> · <severity>`, and the
trigger field is a multi-select stored as one `' · '`-joined string, so an urge tagged twice
rendered three parts in a 64pt row with a fixed outcome column. `weekly-report.tsx`'s `UrgeRow`
already took the first trigger only; `(app)/log.tsx`'s `urgeRow` now does the same. The full set is
still read out where the canvas draws it, on the overview's `Common triggers` bars.

**`surfed the timer`, not `surfed with the timer`.** The picker's label is `Surfed with the
timer`; both `Log Urges` and `Weekly Report Urges` draw `surfed the timer`. `(app)/log.tsx` had the
mapping (`OUTCOME_WORD`) and `weekly-report.tsx` was lower-casing the raw label, so the same row
read differently on the two frames. `OUTCOME_WORD` is exported and the report reads it.

## D129 — an unlogged day well has no ink on the canvas's scale, and the app's is lighter than the lightest of them

`Weekly Report Days` draws fourteen wells in exactly four inks — #CDC9BD, #A9A597, #767267,
#131313 — one per mood band, and never draws a day with no check-in. The app fills that case with
`rgba(19,19,19,0.06)`, which over the #F4F3F0 ground computes to about 230,229,227: **lighter than
#CDC9BD (205,201,189), the palest tone on the scale**, so an unlogged day can never be misread as a
logged one.

**Taken: keep it, and it is not a defect.** The verifier flagged it because a sparse account draws
most of the board in a tone the bundle does not contain — but that is a property of the account,
not of the transcription. Seeded to the week the frame actually draws (seven check-ins at moods
2, 4, 2, 4, 5, 4, 4 over 1, 2, 2, 1, 2, 4, 2 — `.vicifull/logs-week-seed.js`) all fourteen wells
come out in the canvas's own four inks, both captions, the 0.4 `Last week` opacity, the gap of 7
and the verdict card (`Stronger week`, `Five steady days of seven. Friday was the test.`) land
exactly, and the invented tone does not appear on the board at all.

## D130 — an SVG paint server is named per mount, not per call site

`03 · Welcome Back` is pixel-clean at `/welcome-back` and, before this pass, lost **all three**
of its radial washes when it was reached the way the bundle designs it — `02 · Login`'s footer
"Already have an account? **Sign in**". Nothing about the board changed; only what else was
mounted did.

On web a `<Defs>` is a document-wide `<radialGradient id>`. expo-router keeps the board a push
came from mounted underneath with `display: none`, so a pushed copy of `AuthNightField` puts a
**second** `id="ad-warm"` into the same document, `url(#ad-warm)` binds to the **first** — the
hidden one — and a hidden paint server paints nothing. Measured on the pushed board: the warm
wash sampled at canvas 196,235 read 24,23,22 against the frame's 72,61,47, the mark's halo was
absent entirely (Δ up to 48/255 over a 132 × 133 box on the laurel), and the low wash was 10/255
light across the bottom third. `react-native-svg` scopes defs per `Svg` root on iOS and Android,
so this is a web-build defect — but the whole of this run's verification is a web capture, so it
corrupted the instrument as well as the picture.

**The signature diff cannot see it.** Every box was at its stated offset and size; only the paint
was gone. It is the same class as the paint-order trap in the brief, and it is why F20 asks for
the PNG to be read as well as the numbers.

So: **the id a component writes into `<Defs>` is a name, not an identifier.** Mix it with a
per-mount `useId()`, which is what `today.tsx`, `score.tsx`, `log.tsx` and eleven other files
already do. Done here in `src/components/auth/kit.tsx` (`Wash` — `ad-warm`, `ad-low`, `ad-mark`)
and in `src/components/ui/Waterline.tsx` (`Wash` plus each scene's field gradient). After the
change the pushed board diffs at **0 of 19,208 8 × 8 blocks over 3/255, worst 2.8/255** against
the frame, and the two D047 boards behind the doors — the address step and `/sign-up?step=form` —
capture **identically** whether they are reached by URL or pushed over a live door (0 blocks, worst
0.0/255), where before they differed by the same three washes.

`SplashScene` is the second exposure and was measured rather than assumed: `/` and `(auth)/splash`
both render it and both are mounted for about half a second on the cold open. Reverting the
`Waterline.tsx` change and re-capturing that window put the washes within **2/255** of the frame
anyway — because a duplicate only *loses* paint when the first copy in the document is the hidden
one, and on that path both copies are visible and identical. The fix is kept regardless: the
exposure is real, the cost is one line, and the next screen pushed over the splash would find it.

## D131 — `Finding the Waterline`'s spinner ring is an earlier drop's ink stroke, and it stays

The verify pass raised, at `unsure`, that `WaterlineScene`'s ring is `stroke="#131313"` on a field
that runs #131313 → #2E2C29 — black on near-black, effectively invisible, beside a label at
`rgba(244,243,240,0.8)`. It reads like a colour that was never inverted when a paper screen moved
onto the night field.

It is not. **No drop of this canvas draws the screen** — `Latest Vici FULL`'s 18 bundles, the
previous split and `VICI (previous).dc.html` contain no frame and no string for it — but an
earlier drop did, as `Standing Guard`, and the audit of that drop transcribed the ring from it
row by row: `stroke #131313`, `stroke-width 3.5`, `stroke-linecap round`, `stroke-dasharray
82 13`, and recorded the verdict "faithful port of a near-invisible ink stroke on an ink field"
(`prior-runs/UI_FINAL/specs/audit-launch-and-auth.md`). Every one of those four values is in the
file today. The stroke is the canvas's, not a slip in the port.

**Taken: leave it.** This run's standard is the canvas's numbers, and picking a lighter stroke
would mean inventing a colour no drop of the design has ever stated, on a screen this drop does
not draw at all. It is also barely reachable — `src/app/index.tsx` shows the scene only when boot
is still unresolved 900 ms in, which a local build never is (D009's own splash hands over first).

Stated plainly rather than left in a code comment, because it *is* a live user-visible state on a
slow cold start and it looks like a bug: if the design ever draws this screen again, the frame
wins and the ring should be read off it rather than kept out of deference to this entry.

## D132 — `Today Home II` and `Today Home Task` are one lesson card drawn twice, and it is a mock

`Today Home II` (#59) and `Today Home Task` (#60) are byte-identical apart from the task card:
#59 draws the **generic** register (phone in the drawer, the crescent, `Today’s task`, 18/600/26
at top 194) and #60 draws the **lesson-sourced** one (the bed, the shelf glyph, `Surviving the
night`, 15/500/22 at top 190). Above both sits the same lesson card — `Naming your triggers` /
`Lesson 5 · Week II`, four of six rail segments filled.

`src/app/(app)/today.tsx` cannot compose #59: it takes the lesson-sourced register whenever the
day has a lesson, so the generic one is only reached past day 84 — where the lesson card degrades
to `Start the first lesson · Week I`. FINDINGS F29 left two readings open: either the selection is
wrong, or the frame is a composite. **The frame is a composite, and #60 proves it on its own.**

`Surviving the night` and `Put the device you use for porn out of reach before you sleep.` are
**day 1's** task, character for character (`curriculum84.ts` day 1 `cardTitle` / `cardSummary`).
`Lesson 5 · Week II` is **day 12**. In the app both come from the same `dayLesson`, and under any
consistent selection rule — calendar day or curriculum progress — they must name the same lesson.
On #60 they do not. Two more things point the same way: `Naming your triggers` appears **nowhere
in the drop** except these two frames (week II lesson 5 is `Identity`), and the rail is drawn with
**six** segments where the canvas's own week boards deal **seven** (`Week II …` 4 + `… P2` 3).

**Taken:** the lesson card on #59/#60 is a fixed mock-up the canvas drew once and reused while it
swapped the task card's two registers. #59's *task card* is verified at day 86 and #60's *task
card* at day 41 (its geometry pairs to the point — badge 32,482,34,34, glyph 16 × 16 at 41,491,
title span at 76,491 in 13/600, ring 26 × 26 at 335,486 with `inset 0 0 0 2px rgba(19,19,19,0.22)`,
caption at 32,530 in 15/500/22 — only the words differ, and they are the day's own). The lesson
card is verified against the frame element for element apart from those three mock values: the
dome, its halo, the luggage tag, its ground shadow and the hook are **pixel-identical** in an 8 × 8
block-mean read of the whole card, and the residual on #59 is 349 blocks confined to css y 180–239
and 280–299 — the title, the meta line and the rail, and nothing else on the page.

Consequence for the selection rule: the frames do not settle whether the "This week" card should
pick the day's lesson or the first incomplete one, so the app keeps the calendar day, which is
what every other lesson surface already uses (`day/night.tsx:122,126`, `/task/[day]`,
`/lesson-card/[day]`). A progress rule here would desynchronise this card from the task card
beside it and from the night check-in. Recorded rather than inherited, because the reading the
canvas's own numbers most nearly fit — the rail's four filled segments — is the other one.

## D133 — the week rail is one segment per lesson in the week, and a week is seven

The lesson card's rail is `left 20 right 20 bottom 20, gap 7, 4.5 tall, radius 2.5`, and on both
frames that draw it the canvas puts **six** `flex: 1` segments in it — 49pt apiece at a 56 pitch —
with the first four `#131313` and the last two `rgba(19,19,19,0.15)`.

Every week in this drop has **seven** lessons: `Week II Changing Your Mindset` lists days 08–11 and
its P2 lists 12–14, and `curriculum84.ts` carries seven for all twelve weeks. A six-slot rail can
therefore never fill, and the rail's job is to say how much of the week is behind you.

**Taken:** the app draws `week.lessons.length` segments — seven at 41pt on a 48 pitch — filled to
the index of the week's current lesson. It is a visible, measured difference from two frames (six
rows of the signature, and 116 of the 349 differing blocks on #59) and it is deliberate. The count
is the only part of the rail that moves: the inset, the gap, the height, the radius and both tones
are the canvas's own.

This supersedes the citation `DECISIONS D-112` that stood in `today.tsx`'s comment. That number
belongs to a **previous run's** log (`prior-runs/UI_FINAL/DECISIONS.md:1163`) and resolves to
nothing in this one; the comment now cites this entry.

## D134 — `Score Detail — Moves`'s ledger and its own header are two different accounts, and the header wins

The sheet's header — drawn identically on all three of `Score Detail`, `… Moves` and `… Ranks`, and
again on `Today Home` — reads `1,240`, `Navigator · II`, a 60 % rung and `Navigator · 1,150` /
`Helmsman · 1,300`. That is exactly self-consistent with `src/lib/score.ts`'s own ladder:
(1240 − 1150) / (1300 − 1150) = 0.60.

`… Moves` then prints, under `What moved it / this month`: `Clean days +64`, `Check-ins +18`,
`Lessons +12`, `Urges ridden +8`, `Slip · Jul 8 −16`, `+86 net`. FINDINGS F28 says a row parked as
"sample data" is a row nobody checked, so the account was **built and captured** rather than
argued about (`.vicifull/f-today-ledger.mjs`). `monthLedger` windows on `min(30, daysAlive)`, so
`+64` is `days − slips = 16`, which with one slip forces a **17-day-old account**; nine check-ins,
four lessons and four urges ridden do the rest. Seeded that way the page draws
`+64 · +18 · +12 · +8 · −16` and `+86 net` — **every value, at the canvas's own coordinates and
text widths, to the character**. So the renderer and the rows are right.

But the same account's header then reads `1,086 · Deckhand · I`. Going the other way, a 17-day
account cannot reach 1,240: with the ledger's own counts the all-time net is 86, and 240 would
need 2C + 3L + 2U = 192 out of nine check-ins, four lessons and four urges. The header and the
ledger cannot both be true of one account.

**Taken: the header, and the app computes the ledger.** The header is drawn on four frames and is
internally consistent with the app's ranks; the ledger is drawn on one and is not reachable
alongside it. This is the same shape as D097 — the borrowed number is the one that appears once.
The capture account stays the 1,240 one, which leaves the five ledger rows and the net card as the
whole of that frame's residual (283 blocks, all inside css y 400–640 and 700–739).

The same contradiction runs across the family: `Today Home`'s Last-30-days strip draws **three**
unheld days in thirty and `… Moves` draws **one** slip in the month. The app is the self-consistent
side (three white dots, `3 slips`, −48). Neither `specs/51-score-detail-moves.md` nor pass 1
recorded it.

The bar widths are the renderer's, not the canvas's, and they were checked separately: the app runs
`34 + (|v| − lo)/(hi − lo) · 116`, which on the ledger account gives 150 / 54.7 / 42.3 / 34 / 50.6
against the frame's 150 / 58 / 44 / 34 / 52 — worst 3.3pt. The frame's own five widths fit no
smooth rule at all (2.5pt per point from 8→12, 2.0 from 12→16, 3.0 from 16→18), so they are hand-
set and the app's ramp is the closest a rule can come.

## D135 — the task card's 274 is a floor, and the canvas only ever composes a two-line sentence

`Today Home II` and `Today Home Task` both state the task card at `height: 274px` with
`overflow: hidden`, and the arithmetic inside is exact: the caption's `margin-top: 190` plus two
lines at 22 plus the 40 under it is 274 to the point.

Real captions are longer. Day 41's is `Write three simple rules for situations that have caught
you before and make one easier to follow.` — three lines at the canvas's own 15/22 in the card's
own 325pt measure. At a fixed 274 with `overflow: hidden` the third line is cut off by the card
edge; `src/components/today/kit.tsx:230` therefore states `minHeight: 274`.

**Taken: a minimum.** Measured both ways: on the state the canvas draws — the generic register's
two-line sentence, captured at day 86 — the app's card is **274.0**, the frame's number exactly.
On day 41 it is **296**, 22pt taller, and that overhang is most of frame #60's residual. The cost
is 22pt of card below the canvas's own edge on a frame whose content the canvas never drew; the
alternative is losing a line of the user's own instruction. Content length, not geometry.

## D136 — a canvas `line-height: <ratio>` is floored to 1/64pt, and `fontSize × ratio` is not

The week-XII letter's paragraph run sat below the frame's and the gap grew down the scroll:
"At the start, porn still felt…" 1023 → 1023.3, "That is how you make it out…" 1848.2 → 1848.9,
"— Sam, at week XII" 2061.5 → 2062.3, "Keep this letter" 2153 → 2153.8. The `letters` verifier
called the same effect on `Letter Read` and `Medallion Letter` "rasterisation, not layout … not a
fixable defect", and it accounted for about 4,000 of those two frames' 4,700 diff pixels.

It is layout, and it is fixable. Measured at full precision, the design's paragraphs are
111.5625 / 139.453125 / 195.234375 tall for 4 / 5 / 7 lines — 27.890625 a line — and the app's are
111.625 / 139.53125 / 195.34375 — 27.90625 a line. Exactly one LayoutUnit (1/64pt) apart, per line.

The cause is that the canvas states `line-height: 1.8` and the app stated `lineHeight: 15.5 * 1.8`.
**Chrome resolves a unitless line-height by multiplying and then flooring to its 1/64pt LayoutUnit,
and resolves a length by rounding.** 15.5 × 1.8 = 27.9 → floor(1785.6)/64 = 27.890625, while
`27.9px` → round(1785.6)/64 = 27.90625. Measured in isolation over eight lines at six font-size /
ratio pairs (15.5×1.8, 15.5×1.9, 16×1.7, 15×1.55, 17×1.35, 13.5×1.62) — floor every time, and the
two disagree wherever the product's 64ths are not exact.

**Taken:** a canvas ratio is transcribed with `cssLineHeight(fontSize, ratio)`
(`src/lib/theme.ts`) — `Math.floor(fontSize * ratio * 64) / 64` — not with the product. Applied to
`LetterP` and its underlined `<em>` run (`src/app/letter.tsx`) and to `O3LetterRead`'s paragraphs
(`src/components/onboarding/handover.tsx`). After it, `Letter Week XII`'s signature has **no y
difference at all** (0 rows in the sub-0.25pt bucket, where nine paragraph tops used to sit), and
`Letter Read` / `Medallion Letter` measure 1 and 0 device rows whose ink count differs by more than
4 across the whole 570-row body — the one row left is the primary pill's rounded corner.

One line box is invisible; seventy-five of them are 0.8pt. The rule only bites on a long scroll,
which is why nothing but the letters saw it.

**The cost, stated:** the *reported* `line-height` now differs — the design's computed style says
`27.9px` and the app's says `27.8906px` — so nine rows on `Letter Week XII`, five on `Letter Read`
and two on `Medallion Letter` show a `type:` difference in `sigdiff` while laying out identically.
That is a reporting equivalence of the D015 family, and it is the price of the geometry being
exact. Do not "fix" it by writing the product back.

## D137 — `invert(1) brightness(1.6)` is not a tint, and the year tile's mark was one

`Drop Received` draws the laurel as `<img src="laurel-mark.webp" style="filter: invert(1)
brightness(1.6)">` on the ink tile. The app drew it as `expo-image` with `tintColor="#FFFFFF"`.

Those are not the same operation. A tint replaces the RGB and leaves the alpha ramp alone; the
canvas inverts the dark mark to light and then multiplies by 1.6, which clips the antialiased
mid-tones to full white and so thickens the apparent stroke. Measured over the ink box
(css 172.5–219.5 × 247–288.5, every device pixel counted, nothing excluded): the design put
**1,121** pixels above 170/255 and the app **1,033**; mean |Δ| 4.41, 1,466 pixels over 6/255,
1,002 over 12/255, worst Δ98 at css 214.5,266.5 (design 32, app 130).

React Native 0.85 parses a CSS filter string into its own filter list on iOS, Android and web
(`processFilter.js`), so the canvas's filter can be stated rather than approximated. With
`filter: 'invert(1) brightness(1.6)'` on the same `expo-image`, the same box measures **mean |Δ|
0.00 — not one pixel differs** — and the whole frame reports **0 blocks over 4/255** on the 8×8
block-mean diff.

**Taken:** where the canvas puts a `filter` on an image, transcribe the filter. `tintColor` is
right only where the canvas's filter really is a recolour: the other three marks in the bundle
(`Splash`, `Login`, `Welcome Back`) write `brightness(0) invert(1)`, which forces every channel to
black and then to white with the alpha untouched — exactly a white tint — so
`src/components/ui/Waterline.tsx` is correct as it stands and was checked, not assumed.

## D138 — `Medallion Received` styles its secondary slot and leaves it empty, and the post follows it

Twenty frames in `Email-Login` draw a `left:0 right:0 top:764 · 15px/500 · #8B8882` line under the
primary pill — `Tonight`, `Save it for later`, `See the receipt`, `Not now`, `Choose another`,
`Later`. `Medallion Received` is the only one in the bundle whose box is **empty**
(`…color:#8B8882;"></div>`), and it was empty in the previous drop too, while that same drop
deleted the MEDALLION EARNED eyebrow and the Tier I chip outright rather than blanking them.

`src/app/medallion-post.tsx` filled the slot with "Put it on the shelf" — the one visible string on
that board that no frame draws, and the largest remaining block of differing pixels on it
(~2,000 in the 680–800 band).

**Taken: the frame wins.** The slot is drawn empty. The board still records that the post is done,
because the frame draws a close cross at `right:20 top:66` and `MailArrival` already routes it
through the same handler; `secondary` and `onSecondary` are now optional on `MailArrival` and this
one caller passes `onClose` instead. `O3MedallionEarned`, which is the copy of this frame the
handover owns, already drew nothing there — so the two boards that share the frame now agree.

Measured after: in the 680–810 css band, **0 device rows** differ by more than 4 ink pixels between
`Medallion-Received.html` and `/medallion-post`'s arrival. What is left on that board is the name
and the line under it — the frame says `Veni` / "Your first medallion. You started." because it is
onboarding's first medallion, and the post says `Vici` / "Five ridden…" because it fires on a
ridden-out urge, which is Vici's own rule and the face the album can actually show (F11). Box
geometry, type metrics and colour all match; only the words differ, and they differ because the
two screens are not the same event.

## D139 — the drop's controls measure off the top and the arrival's off the bottom, and both are the frame

`src/app/drop.tsx` puts the "Unlock my year" pill at `Y(748)` and the `Terms · Restore` foot at
`Y(816)` — down from the safe-area top — while `MailArrival` in the same feature holds its pair at
`bottom: 108` / `bottom: 70`, with a comment saying it does so "so a shorter phone loses artwork
rather than the way in". The `letters` verifier flagged the disagreement.

At the canvas's own 393 × 852 with the preview's `{top: 54, bottom: 0}` shim the two are the same
number: 54 + 694 = 748 and 852 − 48 − 56 = 748. Both halves reproduce their frames exactly, and
both were re-measured doing so. They only diverge on hardware whose insets differ from the canvas's.

D026 governs the opposite error — a bottom-anchored offset that spends an inset the canvas already
contains — and says nothing about which edge a control should hang from. The prevailing convention
in the app is the top: `Cta` and `Quiet` in `src/components/onboarding/handover.tsx` place every
688 / 764 pair with `Y(y)` across some forty boards, and `drop.tsx` follows them. `MailArrival`
departs deliberately and says why on the line above.

**Taken: not a defect, and left as it is.** Recorded so the next pass does not re-open it. If the
app ever needs one rule, the top-anchored form is the one the canvas states and the one the
handover already uses everywhere.

## D140 — a static `<Svg>` between absolute siblings is a real trap, and this is not one of them

The `letters` verifier read `O3MedallionEarned`'s laurel — `<Svg width={42} height={27.3}
style={{ opacity: 0.55 }}>`, no `position`, sharing a parent with the absolutely-positioned face
`<Svg>` and two absolutely-positioned rims — and reported it invisible on web under the brief's SVG
paint-order trap. It said so from a code read: it could not drive the onboarding funnel to that step.

It is drivable. `.vicifull/drives/handover-walk.js` walks the whole funnel, and it needs only an
account with `onboardingComplete: false` for `(onboarding)/_layout.tsx` not to redirect
(`.vicifull/letters-onb-seed.js`). Captured both ways, `40 · Medallion Earned` diffs at **0 blocks
over 4/255** against `Medallion-Received.html` with the explicit `position` and **0 blocks without
it**, and the crop shows the strike sitting on the gold face in both. Evaluated in the live DOM the
`<Svg>` does report `position: static` beside three absolute siblings, exactly as the verifier
measured — but the disc is a flex container, and a flex item paints as an atomic inline-level box,
not as an in-flow block, so it does not fall to the bottom of the stacking order the way an
unstyled `<Svg>` in a plain `View` does.

**Taken:** the guard is kept anyway — both marks in `handover.tsx` now carry `position: 'relative'`,
the same idiom `src/app/letter.tsx`'s `LaurelStrike` documents — because it costs nothing and the
trap is real elsewhere. But the finding as filed is **not a live defect**, and the general lesson is
the one F35 states from the other side: a code read is a hypothesis, and this run settles
hypotheses by driving the screen.

## D141 — an elliptical `border-radius` is four arcs, and the candle flame was reading only the first

`SosSceneLayer` handled `border-radius: a b c d / e f g h` by taking `radius.v[0]` and drawing a
`Hill` — an elliptical top over a square-cornered rectangle. That is exactly right for two of the
three layers in the bundle that state one (`SOS Feel Turned On`'s two hills are
`50% 50% 0 0 / 70px 70px 0 0` and `… / 60px 60px 0 0`, and a zero radius *is* a square corner),
and wrong for the third. `SOS Feel Low`'s candle flame is `50% 50% 50% 50% / 60% 60% 40% 40%` on a
12 × 18 box: rounded at both ends, a teardrop. It was drawn as a dome sitting on a block —
**Δ145/255** at frame (190,280), about a hundred device pixels over threshold.

**Taken:** `EllipticBox` draws all four corners as their own `A rx ry` arc, with CSS's overrun
scaling (D110) applied to the pair on each side. SVG treats a zero-radius arc as a straight line,
so the two hills come out byte-identical to what `Hill` drew and the flame keeps its foot. The
data was never wrong — `gen-sos-responses.mjs` emits `h` and `v` in full; only the renderer threw
`v[2]`/`v[3]` away.

Measured after: `SOS Feel Low` (190,280) design 244,243,240 · app 244,243,240, Δ0; the flame's own
box (176,264)–(210,290) means 0.330 with one pixel of arc antialiasing at Δ14. `SOS Feel Turned On`
mean |Δ| 0.016, max 4.

## D142 — the SOS boards' blurred solids are a real Gaussian, not a radial fitted to one

F26's defect, in the fourth renderer to carry it. `SosSceneLayer` substituted a `SoftBlob` — a
radial whose alpha falls to zero at the box's own edge — for every `filter: blur(N)` on a flat
colour, and so did seven hand-written layers in the same file (`u90-intro-shadow`,
`u90-step1-pool`, `u90-step2-pool` / `-shadowA` / `-shadowB`, `u90-leave-pool` / `-shadow`) and
the two contact shadows in `TwiceArt` (`src/app/relapse.tsx`). D082 states why that is wrong — the
peak is `α·erf`, not `α`, and the falloff carries on 2σ *past* the stated box — and D091/D113 state
the fix now that `react-native-svg` 15 ships `<Filter>` / `<FeGaussianBlur>` on all three targets.

**Taken:** `BlurredSolid` draws the canvas's own shape at the canvas's own flat alpha under the
canvas's own σ (`filter: blur(r)` states σ directly; a `box-shadow`'s blur radius is 2σ). Both the
`<Svg>` and the `<Filter>` region are padded 3σ and stated in `userSpaceOnUse`, because an `<Svg>`
clips to its viewport and the filter's default `-10% … 120%` of the object's own box cuts a 5pt
blur off square on a 14pt-tall shadow. `border-radius: 50%` on one of these boxes is an **ellipse**,
not a pill — a flat number is a rounded rect — and the branch reads which from the layer's own
radius.

Measured on the worst case, `SOS Loc Private Room`'s warm floor pool (a 100 × 16 bar of
`rgba(226,186,120,0.25)` under `blur(5)`), at the three points the verifier used:

| point | design | before | after |
| --- | --- | --- | --- |
| (160,416) | 227,218,201 | 239,236,229 (Δ28) | 227,218,201 (Δ0) |
| (198,416) | 225,216,198 | 231,221,203 (Δ6) | 225,216,198 (Δ0) |
| (236,416) | 226,217,200 | 240,236,230 (Δ30) | 226,217,200 (Δ0) |

The last 1/255 of that is F43's: an SVG filter interpolates in `linearRGB` and CSS's
`filter: blur()` works in `sRGB`, a skew of about +2 R / +2 G / −3 B on a warm blur. Both new
filters carry `color-interpolation-filters="sRGB"` (spread as an untyped prop — `<Filter>` does not
declare it and the native build ignores it; on web it reaches the DOM, which is where the skew
lives). With it the three points above go to Δ0 and the frame to mean |Δ| 0.001.

Whole-frame maxima, status bar and home-indicator band excluded, nothing else masked: `SOS Loc
Private Room` 30 → 2, `SOS Feel Stressed` 31 → 3, `Surf Step 3` 26 → 12, `Surf Step 1` 17 → 5,
`Cue Set Confirmation` 17 → 3, `Relapse Twice` 17 → 5. All 28 reachable response boards re-measured
after the change: mean |Δ| 0.001–0.030, max 14 on one pixel (an arc edge on `SOS Feel Low`).

The declared signature consequence is D091's: each blurred solid now reports one `svg` row 3σ
larger than the frame's own `<div>`, with `background` / `border-radius` reading `-`, because the
div is not what the canvas paints. `sigdiff` sorts those into `paint-absent, geometry-exact`; on
this group they are 1–3 rows a board and every one was confirmed in the PNG, not forgiven from the
table.

## D143 — `Relapse-Log`'s two overlapping paragraphs are one paragraph in this drop

D039 chose between two body paragraphs the previous bundle drew on top of each other at `top: 444`
and `top: 450`, and built the one at 450. `.vicifull/fdiff/Relapse-Log.diff` shows this drop
**deleted** the 444 one ("Same calm screen as a win…"); the frame now draws a single paragraph, at
450, which is what `src/app/relapse.tsx` already carried.

**Taken:** nothing changes in the code — `bodyTop: 450`, and the frame measures mean |Δ| 0.001,
max 2. The head comment above `PAGES` still described the two-paragraph frame and is corrected, so
the next reader does not take a resolved contradiction for a live one. D039 stands as the record of
how the choice was made; its premise is simply gone.

## D144 — `85C` and `85D` disagree about the last four urges, and the twelve bars win

Both hub panes are read out of the same log. `85C · Your proof` draws twelve bars whose heights
give 9 · 4 · 14 · 6 · 41 · 7 · 11 · 5 · 3 · 12 · 8 · 6 minutes (oldest first, last bar highlighted)
and a `Longest urge survived · 41 min` row beside them. `85D · Surfed before` draws "the last four"
as 14 · 22 · 9 · 31 min. The newest four of 85C's twelve are 6 · 8 · 12 · 3. Neither 22 nor 31
appears anywhere in 85C's twelve, and 85D is not sorted, so no single log produces both panes.

**Taken:** the app follows **85C**. Twelve bar heights plus the longest-urge row are the more
constrained statement — 85C states thirteen numbers that agree with each other, 85D four that
agree with nothing — and `hubStats` derives both panes from one `timed` list, so following 85D
would break the bars.

What is matched on 85D as a result: the four rows' weekdays, times and "what got you through"
(`Thu · 3:10 pm` / surfed the timer, `Tue · 11:48 pm` / went for a walk, `Sun · 9:22 pm` / called a
friend, `Sat · 1:05 am` / cold shower) are all seeded and land exactly. What is not: the four
`N min` labels and the four bar widths, eight rows, which is the whole of the pane's remaining
difference.

## D145 — `85C`'s `Clean days · 13` cannot be produced by `85B`'s own dot grid, and the grid wins

`85B` draws thirty dots, oldest first, hollow where a slip fell: hollow at index 5 and index 12,
i.e. 24 and 17 days back, with seventeen clean days after the later one. `85C`'s stat row states
`Clean days · 13`. `hubStats` computes the clean run from the same slip events the grid marks, so
one seed cannot give both; putting the last slip 13 days back moves the grid's second hollow four
dots to the right.

**Taken:** the grid. Thirty dots individually drawn is a fully specified state; `13` is one derived
number, and it is the same 13 the pledge on `85E` carries ("14 days" since signing, seeded at
now − 13 days), which is where it most likely came from. The app therefore draws `Clean days · 17`
on `85C` against the frame's `13`, and that single span — 4 tiles, x 320–352, y 512–544 — is the
whole of pane 3's remaining difference (mean |Δ| 0.714 over the frame).

## D146 — the three boards no picker reaches are drawn correctly, and that is now measured

D038 records that `SOS Loc Bathroom`, `SOS Loc Home Alone` and `SOS Trig Rejection` have no card
that reaches them: the location picker draws five rows against seven boards, the trigger picker
nine cards against ten, and "Give me another" is drawn only on the feeling branch. Pass 1 proved
their **data** by regenerating `src/content/sosResponses.ts` byte for byte from the frames, but
nobody had seen them **rendered** — and both rendering defects this group found (D141, D142) live
in the shared renderer, not in the data.

**Taken:** they were rendered, by temporarily pointing `PLACE_BOARD.private` and
`TRIGGER_BOARD.Doomscrolling` at them in the running dev build, capturing, and reverting (the file
was diffed against a pre-swap copy afterwards and is byte-identical). Measured against their own
frames, status bar and home-indicator band excluded and nothing else masked:

| board | mean &#124;Δ&#124; | max |
| --- | --- | --- |
| `SOS Loc Bathroom` | 0.015 | 5 |
| `SOS Loc Home Alone` | 0.030 | 5 |
| `SOS Trig Rejection` | 0.015 | 5 |

D038 is unchanged — no picker gains an option the canvas does not draw. The three stay
`unreachable` in `.vicifull/recipes/sos.json`, with the swap recorded there so a later pass can
repeat the proof instead of taking it on trust.

## D147 — SOS's “I slipped” opens the twelve-frame post-slip flow, and the four `36 · Relapse` frames are its earlier authoring

`Latest Vici FULL` draws the same four screens twice. Stripped to their words:

| `36 · Relapse` | `98 · RELAPSE — POST-SLIP` |
| --- | --- |
| `Relapse Log` — “It happened.” / “The day isn’t over. Log what happened, then stop it here.” / **Log the slip** / *Back to the wave tool* | `Slip Entry` — the same three strings, ghosted *Not now* |
| `Relapse Twice` — “Don’t let it become two.” / “One slip happened. You can still turn the rest of today around.” / **Continue** | `Slip Dont Fail Twice` — identical, to the character |
| `Relapse Resign` — “The pledge still stands.” / … / **Sign it again** / *Change the pledge* | `Slip Pledge` — identical, ghosted *Read my pledge* |
| `Relapse Begin` — “The day is still yours.” / “One part of it went wrong. Nothing else has to.” / **Start again** / Back row | `Slip Begin Again` — identical, no Back row |

Not one headline, body or primary label differs. What differs is geometry (`Relapse Log` puts its
art at 180 and its headline at 398 where `Slip Entry` puts them at 170 and 446, over a different
drawing) and the secondary control. The 98 section then adds eight screens the 36 family has no
counterpart for — Close It Now, When, What Fed It, Logged, Current Urge, the second and third
repeat branches, Morning After — and nineteen response cards.

So this is the D085 / D118 shape again: **one flow authored twice in one drop**, and the fuller,
newer authoring is the current one. `relapse-workflow.md` is what settles which:

* it is new in this drop and D006 makes it the flow authority for exactly these screens;
* it opens “The flow begins when an SOS session ends with **“I slipped,”** or when the user
  manually records a slip later”, which is a statement of the entry point, not a suggestion;
* its Implementation Brief says “Build this as a separate post-slip flow”; and
* its §3 terminology rule is to stop using “relapse” in user copy at all, which is what the older
  badge series is named after.

Against that stands `.vicifull/FLOW.txt:114–115`, which chains `Surf Complete → 34 · SOS — Slipped`
and then `Relapse Log → 36 · Relapse — Don’t Fail Twice`. That file is the canvas's own **frame
order**, and it chains straight across every section boundary — line 236 chains
`Slip Trigger Not sure → VICI Post — Arrival`, which is plainly not a navigation edge. A chain that
crosses a section header is not evidence of one.

**Taken:** `src/components/urge/index.tsx`'s two slip exits — `logSlip()` and the hub's
“I slipped” — open `/slip`. Both were one line; the file belongs to the `sos` group and the change
is called out in that group's report as well as this one.

The cost, stated plainly: `src/app/relapse.tsx` still draws frames #115–#118 and they still match,
but nothing in the product now routes to it — it is reachable only from `/(app)/all`. That is the
same trade F15 and F33 name, and it is the right way round here: twelve screens and nineteen cards
were dead before, four are now, and the four are the copies.

## D148 — `Slip Pledge` is conditional, and it never speaks the canvas's sample in the user's voice

98J draws one state — a signed pledge (“The mornings are mine again.”) over a name (“Jerry”) — and
a frame that draws one state cannot say when it is drawn. `relapse-workflow.md` §9 is a table that
can: **active pledge + first slip since signing → yes**; active pledge + same-day repeat → “usually
no, focus on access/friction first, re-signing again can feel ritualistic”; **no pledge exists →
skip the screen**. §21's QA line (“Pledge re-sign is not shown repeatedly in the same day”) and
§22's tree (“PLEDGE ELIGIBLE? first slip since signing → re-sign / change; otherwise → skip”) say
it twice more.

The app showed it unconditionally, and `SlipPledgeCard` fell back to the canvas's own sample line
when the account had none — so a user who had never written a pledge was shown one, in a signature
card, signed **You**. Captured before the fix as `v-slip-a-Pledge-nopledge`. That is worse than any
pixel miss in this run: it is the app putting words in the user's mouth.

**Taken:** both of §9's “no” rows collapse into one test — there must be a pledge, and no slip may
already stand between the signature and this one (a same-day repeat necessarily has one). When the
test fails the card step advances straight to 98K. `pledge` is now a required prop with no
fallback, so the sample string cannot reach a screen at all.

Two smaller things on the same card, both from the frame's own markup:

* the signature block has **no width** in the canvas. The row is `space-between` with an empty
  spacer span, and only the 1pt rule states `width:104px; margin-left:auto` — so the block is as
  wide as the name or as the rule, whichever is greater. The app hard-set 104 on the wrapper *and*
  on the name, which is invisible at “Jerry” and clips or wraps a first name that sets wider than
  104pt at 26pt Snell Roundhand. The rule keeps its 104 and right-aligns itself; the name is left
  to its own width.
* the pledge line is the frame's own system sans at 22/32/−0.2, not a quote face. Unchanged, noted
  because the morning sheet's identical-looking card is `fonts.quote` and the analogy is wrong.

## D149 — `Slip Urge Now`'s four answers are `relapse-workflow.md`'s 0–5 bands, and one of them leaves the flow

98F asks “Do you still want to keep watching?” with four answers. §11 of the workflow doc asks the
same question on a **0–5** scale and branches it: 0–1 finish the log; 2 one 5–10 minute reset
action; 3 require a location or device change before the pledge and final screen; **4 return to SOS
emergency mode; 5 SOS command mode**. §4 and §21 repeat the 4–5 override.

The app captured the answer into state and read it back only to draw the selected ring. Nothing
branched on it — which made the one board in the flow whose entire purpose is to branch it a
decoration.

The four answers map onto the doc's bands in order: **No** is 0–1, **A little** is 2, **Yes** is 3,
**I’m already watching again** is 4–5.

**Taken:** “I’m already watching again” replaces the route with `/urge`, the app's SOS interrupt,
which is what the doc means by emergency mode. The other three continue to 98G/98H/98I as before,
deliberately: the doc's “one reset action” for bands 2 and 3 is exactly what the anti-repeat board
and the response card already are, and **the canvas draws no separate reset screen to send them
to** — inventing one would break the parity standard this run exists to meet. Picking an answer is
still optional, because no frame draws the pill in a disabled state and nothing in the doc requires
the question to be answered.

## D150 — `Slip When` opens with its wheel closed, and the wheel's date column is a mock no wheel can produce

Two readings of 98C, both recorded because the app's opening state is a screen no frame draws.

**The wheel is closed until “Choose a time” is tapped.** The frame draws it open with “Just now”
selected above it, and one drawn state cannot say whether it is the default. `relapse-workflow.md`
§6 can: “The custom picker should only open when the user taps ‘Specify time’.” `src/app/lapse.tsx`
already ships that behaviour for the identical `Lapse When` board. Kept.

**The date column cannot be matched, and not because of sample data.** The canvas's five rows read
`Sat Jul 18 · Sun Jul 19 · Today · Wed Jul 22 · Thu Jul 23`. In 2026 those weekday names are all
correct, which means the middle row is required to be Mon Jul 20 (to follow Sunday the 19th) and
Tue Jul 21 (to precede Wednesday the 22nd) at the same time. It is six days' labels in a five-row
column — a hand-drawn mock, not a wheel's output.

Everything else on the board **was** seeded rather than excused (F28). With the page clock frozen
at tonight 23:40 (`.vicifull/f-slip-seed0-2340.js`) the hour column reads 9 · 10 · **11** · 12 · 1,
the minute column 38 · 39 · **40** · 41 · 42 and the meridiem ladder puts **PM** on the band — all
exactly the canvas's, and 98E's “Tonight · 11:40 PM” with it. `Slip Logged` then diffs at **0** 8×8
blocks over 4/255 across the whole frame; `Slip When`'s remaining 224 blocks lie entirely in
`x 84…172`, the date column, and nothing at all past `x 180`.

One row on the same board is **not** a defect and is recorded so it is not re-raised: the selection
band's `rgba(0,0,0,0.045)` reads back as `0.043` from Chrome and `0.04` from `react-native-web`.
Both sources state 0.045. That is D073's two-decimal serialisation, one step of 255 on a 4.5 % black,
and no code change would close it.

## D151 — a blurred *wash* is a real Gaussian too, and D010's exemption is retired

D010 ruled that `filter: blur(4-8px)` on a `radial-gradient(closest-side, ...)` needed no
equivalent: the wash already reaches zero alpha at its own edge, so the blur was softening a shape
with no hard edge, and neither `react-native-svg` nor RN's view system implemented CSS filters.
D091 has since retired the second half of that premise for blurred *solids* — `react-native-svg`
15.15 ships `<Filter>` / `<FeGaussianBlur>` on web, iOS and Android. The same sentence retires it
for washes.

The first half of D010's reasoning is also wrong about where the difference lives. A blur does not
only feather a `closest-side` ramp's boundary; it flattens its **core**, because the kernel pulls
the low-alpha ring inward over the peak. So the correction is largest in the middle of the wash,
which is exactly the region D010 argued was safe.

Measured on `Lesson-1-Surviving-the-Night/L1-Frame-01`, the one cover in the bundle with two
blurred washes — the window's 80 x 80 `rgba(203,218,232,0.24)` and the lamp's 32 x 32
`rgba(226,186,120,0.45)`, both `closest-side` under `blur(5px)`. Whole-frame pixels past a
per-channel 5 of 1,254,456, the top 54 pt (status-bar chrome, D009) excluded and **nothing else
masked — no flatness test, no gradient skip** (F35):

| state | px over 5 | worst pixel in the lamp's core |
| --- | --- | --- |
| the two ground shadows as D082 radials, washes unblurred | 14,460 | — |
| shadows as real Gaussians (D091), washes still unblurred | 795 | design 240,230,213 · app 236,220,193 (d 20) |
| washes given their own `<FeGaussianBlur>` as well | **389** | d 0 |

The 389 that remain are the window's two vertical edges and its top rule, one device pixel wide —
D083, and the same three edges the verify pass had already identified.

**The rule, for every group:** where the canvas writes `filter: blur(N)` on a layer, the app draws
an `<FeGaussianBlur>` at that sigma — wash or solid, no exemption. Three implementation notes, all
of which cost a capture to find:

* the `<Filter>` region is stated in `userSpaceOnUse` and padded **3 sigma**, or the filter clips
  itself square on the default `-10% ... 120%` box;
* it carries `color-interpolation-filters="sRGB"` (F43), since SVG filters otherwise work in
  `linearRGB` where CSS's `blur()` works in sRGB;
* the `<Svg>` itself has to grow to hold the spill. An SVG viewport clips and a CSS filter does not,
  so a wash whose blur runs past the mark's own box loses it: `SunriseMark`'s halo goes to 120 in a
  96pt mark and `BedPhoneMark`'s ground shadow to 116 in a 100pt one, because the canvas's own
  boxes already overhang there.

Applied here to the eight blurred layers of lesson one's own art — `coverL1.tsx`'s table shadow,
bed shadow, window wash and lamp wash, and `scroll.tsx`'s `SunDot` halo (sigma 3), `SunriseMark`
halo (4), `BedPhoneMark` ground shadow (5, a solid) and phone spill (4). D010's first paragraph
stands as history; its conclusion does not.

## D152 — the paywall a build with a key presents is `48 · Paywall` too, not the board this drop withdrew

`Free Trial Paywall` is one of the seven labels `Latest Vici FULL` withdraws; `48 · Paywall`
replaces it, and `components/paywall/PaywallFlow` was rebuilt on `48` this run and measured
against it. But `PaywallFlow` is not what ships. `catalogue.PAYWALL_SOURCE` resolves to
`'offering'` whenever `PURCHASES_MODE === 'revenuecat'` — i.e. in any build with a RevenueCat
key — and `/paywall` then opens `components/paywall/OfferingPaywall`, which still drew the
withdrawn board: VICI + a `PLUS` chip, "Give it twelve weeks", 76-tall rows, a checkmark
benefits list and "Start my free trial". Its band, its ✕ and its 226 had been updated to `48`
in pass 1; its body had not. So every measurement this run took of `48` was taken against a
component real customers would not see (FINDINGS F25).

**Taken: `OfferingPaywall` draws `48 · Paywall`.** Not "routes through `PaywallFlow`" — the
whole point of the file is that the rows come from the offering rather than from two constants,
which is what RevenueCat's guidance on displaying products asks for and what a pinned board
cannot do. So the head is pinned exactly where `PwMain` pins it (wordmark 226, headline 262,
sub 302) and only the stack from the rows down is laid out in flow, on the frame's own gaps:
364 + 74 + 10 = 448, + 64 + 26 = 538, + 15 + 19 = 572, + 88 + 30 = 690, + 54 + 14 = 758. An
offering carrying the two packages VICI sells therefore lands on `48`'s own numbers, and one
carrying three grows downward instead of overflowing.

Measured against the frame through a throwaway harness that supplied a two-package offering:
**0 blocks of 8 × 8 over 4/255, worst 3.2**, over the whole frame below the status bar, all
columns, no flatness filter — pixel-identical, the same result `PwMain` gives. Three findings
came out of building it, all of them invisible to a signature diff:

* a `ScrollView` clips, and the chosen row's ornaments live outside its box — the 1.5pt gold
  ring spreads to 416.5 and the drop shadow reaches ~18 above the row. Started at the row's own
  364 the clip took both, as a hard **50/255 edge across the whole width at y 414**. The view
  starts at 342 with 22 of headroom inside it instead.
* `626 − 592 = 34` is the gap between two *absolutes*; in flow the rule's own 15pt line box sits
  inside it, so the discs take `marginTop: 19`.
* the four discs are artwork, not strings. `benefits` in the offering metadata relabels them and
  is read only when it carries exactly four entries — the dashboard can rename a disc but cannot
  add a fifth. `SAVE 74%` is likewise worked out (cheapest monthly-equivalent against the
  dearest) rather than written, so the tab never claims a saving the store is not offering.

`components/paywall/RevenueCatPaywall` was checked for the same fault and does not have it: it
renders the paywall designed in the RevenueCat dashboard, draws none of VICI's own boards, and
is opt-in behind `EXPO_PUBLIC_REVENUECAT_PAYWALL=revenuecat`. No frame in the bundle governs
what it shows, which is the point of it. `lib/purchases/metadata.ts` carried the withdrawn
board's strings in its dashboard-shape docstring; it now documents `48`'s.

## D153 — the "Best value" pill follows the radio when its row goes to paper

`48 · Paywall` only ever draws Yearly chosen, so its two gold ornaments — the `Best value` pill
(`#E2BA78` text inside a `0 0 0 1px #D9B878` ring) and the `SAVE 74%` tab — were both drawn
against `#131313`. Tapping Monthly inverts the rows, which is the only reading the drawing
supports, and those two golds then sit on `#FFFFFF`. `#E2BA78` on white is **1.8:1** — the pill
is barely there.

No frame governs the state, but the frame does state what an ornament does when its row goes to
paper: the radio turns from a gold disc into an `rgba(0,0,0,0.18)` hairline. **Taken: the pill
follows the radio** — `#1D1C1A` text inside an `rgba(0,0,0,0.18)` hairline on an unchosen row,
the row's own name colour and the row's own ring. The `SAVE 74%` tab stays gold: it is hung off
the row's corner rather than set inside its content, it advertises the year's saving whichever
row is chosen, and `#3A2E15` on the gold gradient reads either way. Nothing changes in the state
the frame draws.

The one thing that *was* wrong on the drawn state was the other radio. The frame writes the
unchosen ring as `box-shadow: inset 0 0 0 1.6px rgba(0,0,0,0.18)`; the app had transcribed it as
`borderWidth: 1.6`. Geometrically the same ring, and the pass-1 verifier zoomed both 8× and
called it settled — but a border snaps to the device grid where an inset shadow antialiases
against the rounded inner edge, and it was the whole of `48`'s residue: **16 blocks at worst
7.4/255, all sixteen inside x 44..64 / y 522..542**. Written as the canvas writes it, `48` goes
to **0 blocks, worst 0.1/255** over the whole frame below the status bar. A ring that measures
identically can still paint differently, and "same geometry" is not the same claim as "same
paint".

## D154 — D120 stands: the night wheel's hour run is filler and its PM is out of its own band

The verifier for `paywall` asked for this to be a ruling rather than a note, on the ground that
DECISIONS' precedent for a self-inconsistent canvas (the funnel's progress rule) was to
implement as drawn. Re-measured, and **D120 is upheld** on both counts.

*The hour column.* `Nightly Check-in Time` and `Settings Check-in Time` both draw
`7, 11, 12, [10], 11, 12, 1`. Rows 1, 4, 5, 6 and 7 are exactly what a wheel centred on 10
produces; rows 2 and 3 are character-for-character duplicates of rows 5 and 6. That is a copy
slip with its own fingerprints on it, not a rule — and the minute column beside it
(`27 28 29 [30] 31 32 33`) and the morning board's hour column (`4 5 6 [7] 8 9 10`) are both
correct sequences. The funnel's progress rule is not the same case: a progress percent is a
number the frame states and nothing contradicts. A picker that prints 11 and 12 above a 10
contradicts the picker.

*The AM/PM column.* Both night frames put the column at `top: 337` with `AM` at 22/29 and `PM`
at 30/44, so the chosen PM renders at 366..410 while the selection band is 335..379 — the ink
value is drawn outside the band that marks it. The morning frame writes the identical box
(337, 60 × 73, ending at 410) with the ramps the other way round, so its chosen AM lands at 337
and sits in the band. Reading the night frames literally is possible, but it makes the band
highlight the *unchosen* AM on one board and the chosen AM on the other — the app centres the
chosen value, as the morning board does.

Measured on the driven capture, and the residue is exactly what that predicts and nothing else:
**167 blocks of 8 × 8 over 4/255 on the whole frame below the status bar, all columns, no
flatness filter — 137 in the AM/PM column (worst 166) and 30 in the hour column's two filler
slots (worst 48.8). Zero everywhere else**, the minute column, the seven day chips and the Save
pill included. `Morning Check-in Time`, which has no such contradiction, is now **0 blocks,
worst 0.2/255** — pixel-identical.

Getting the morning board to zero closed the two residues the same verifier raised against the
shared component, `components/routines/wheel.tsx`:

* **the scroll landed on a half pixel.** A row's offset is `index * 36.5`, so it is fractional
  whenever the index is odd — hour 10 is index 9, and with the loop's base of 12 that is
  21 × 36.5 = 766.5. The browser floors the offset it keeps and the whole column then sat
  0.4–0.5 low (250 → 249.6, 337 → 336.5) while the minute column, whose 90 × 36.5 is whole, was
  exact. The column now scrolls to `Math.floor(target × 36.5)` and takes the half back out of
  its leading pad — down rather than to nearest, because the AM/PM column's last row sits on its
  own scroll limit and rounding up asks for an offset the view cannot reach.
* **a composited transform rasterised the same box half a device pixel off.** The rows two away
  from the centre carried `translateY: ±7.5` to pull them onto the canvas's non-uniform spacing;
  their layout boxes were exact and their ink was not (design 286.5–300.5, app 287.0–301.0).
  Each row is now placed by `top` inside its slot, which is also how the canvas writes it — a
  full-width centred div — so the reported boxes went from `119.6 / 279 / 12.4` to the frame's
  own `105 / 279 / 40` as well.

`onMomentumScrollEnd`, which `react-native-web` never emits (D065, FINDINGS F12), was the wheel's
only path to committing a flicked value and re-centring its loop. It is kept for the native side
and paired with a 140 ms scroll-idle timer, which both platforms do fire.

## D155 — the week scenes' blurred solids are blurred, not sampled (D082's method retired here too)

D082 redrew every `filter: blur(r)` on a solid in `WeekScene` as a radial ramp fitted to the
Gaussian, because the file had no blur primitive. D113 retired that method for `TaskScene` on the
strength of D063 — `react-native-svg` 15.15.4 carries `<FeGaussianBlur>` on web, iOS and Android —
but said in terms that "D082 still stands for `WeekScene`, which has not been changed". It is
changed now: the ten blurred solids across the twelve scenes are the canvas's own shape under
`feGaussianBlur stdDeviation = r`, since `filter: blur(r)` states σ directly.

D082's two observations are why the radial was wrong and they still hold — a solid thinner than its
own blur never reaches its stated alpha, and the falloff carries on well past the box. Modelling
them by hand got close; drawing them gets them exactly. Design against app inside each shadow's own
box, 8 × 8 block means at 2/255:

| layer | sampled radial | real Gaussian |
| --- | --- | --- |
| week I flag shadow, 56 × 10 under blur(4) | 25/180 blocks over 2, worst 5.0, mean 0.732 | **0/180, worst 0.1, mean 0.002** |
| week X glow, 30 × 44 under blur(6) | 45/285 blocks over 2, worst 4.6, mean 0.929 | **0/285, worst 0.0, mean 0.000** |

Two consequences beyond the pixels. The filter region has to be stated in user space — 3σ + 2 all
round — because the default is 10 % of the bounding box and clips a 4pt blur inside its own bloom
on a 10pt-tall shadow. And the filter needs `color-interpolation-filters="sRGB"` (FINDINGS F43),
since SVG filters compose in linearRGB and CSS's `filter: blur()` does not.

**D082's standing signature mismatch is withdrawn with its method.** The ellipse is drawn at the
box the canvas states, so the ten rows that used to report 2σ wider and taller than the frame's own
div now land on it: `sigdiff` went from one MISSING row per blurred solid to none, on all twelve
scenes.

## D156 — a spread lies wholly outside the border box, and the hulls' rings straddled the edge

D111 established this on `TaskScene`; it was never applied to `WeekScene`, which stroked the box
path with `strokeWidth = spread` centred on the edge. Both boats' hulls carry
`0 0 0 1px rgba(0,0,0,0.05)`, so half a device pixel of the ring sat inside the hull instead of
outside it. The stroked silhouette is now grown by half a spread, each non-zero corner radius
grown with it and each square corner left square.

The same pass applies D117 here: `clip-path` clips a box-shadow away with the rest of the element,
so **a layer that states a clip draws no outer shadow**. Both weeks' near sails state
`0 1px 2px rgba(0,0,0,0.06)` under `polygon(100% 0, 100% 100%, 0 100%)` and the canvas draws
neither. Pass 1's code claimed to draw them and did not: its pattern was
`/^(-?[0-9.]+)px? …/`, where the `?` binds to the `x` alone and so demands a literal `p` on the
first length — `0 1px 2px` could never match it. The pattern is repaired and the branch is gated on
the clip, which is the only pairing that is right both today and for a layer a later drop draws
unclipped.

**One measurement worth keeping, because it looks like a regression and is not.** Week VII's hull
sits at canvas y 358.04–367.34. Chrome snaps the design frame's DOM box to whole CSS pixels
(D083) and the app's SVG rect is not snapped, so the two edges round in opposite directions: after
the fix the hull's **top** edge is exact — every device row from 356.5 to 359.5 at Δ 0, where it
was Δ 13 and Δ 12 — and its **bottom** edge is 0.34pt out where it had been 0.16pt out by luck.
Whole-frame, both boats improve clearly: pixels over 8/255 fall from 491 to 328 on week VII and
from 845 to 445 on week XII. The rule is right; the residue is D083.

## D157 — the P2 frames draw a shadow a scrolling board cannot show without also showing a pip it omits

`Week II … P2` is the only frame in the family whose top card is the **current** lesson: the seed
is day 12 and week II holds days 8–14, so day 12 is that week's row 05, which is the first row the
P2 scroll position brings to the top. A current card carries
`0 0 0 2px #131313, 0 10px 24px rgba(40,38,32,0.12)`, and the canvas paints that second shadow's
upward spill in the band from canvas 472 to the card's ring at 484 — measurably: 240,239,236
against the page's own 244,243,240.

The app's row column is a scroller and it clips at 484, so that band is paper. To show the spill
the clip would have to open to 472 or above — and the 04→05 pip pair sits at 467 and 475 at this
scroll position, so anything at or above 478.5 puts the lower pip on screen, which the P2 frame
does not draw. **No clip position satisfies both.** The frame is a static composition of a board
that scrolls, and it has drawn a shadow whose source is off its own top edge while drawing nothing
else that would be.

**Taken: the clip stays at 484.** Hiding the pip costs Δ 4/255 over a 393 × 12 band (3,758 device
pixels over 2/255, and **0** blocks over 3/255 at 8 × 8 means, i.e. invisible to the block
instrument); showing it would cost Δ 44/255 over about 28 pixels of hard-edged dot where the frame
draws paper. This is the same class of judgement as D084 and it points the same way: where the
canvas's static frame and a real scroller disagree, follow the frame's *visible* seam.

## D158 — a nested `<svg>` reports its ink box, so five bird rows read MISSING while the art is exact

The canvas draws its birds as inline `<svg>` elements with their own `width`/`height`, and the
probe reads those as layout boxes: `svg | 132 | 274 | 16 | 8`. The app draws the whole scene as one
`<Svg>`, so each bird is a **nested** `<svg>` inside SVG content, which has no CSS box —
`getBoundingClientRect` returns the union of its rendered content instead, `svg | 133 | 277.5 | 14 |
2.5`, collapsing onto its own path row. `sigdiff` therefore lists five svg rows as MISSING in app
across weeks VIII, IX and XII and their P2s.

It is a measurement artefact of the structure, not a defect, and it is not fixable in the probe
without special-casing a legitimate reading. The row that carries the parity is the **path** row
underneath, and those match on both sides to 0.1pt (week XII's pair: 133,277.5,14,2.5 and
160.8,265.1,11.4,2.1, identical). The pixels settle it: the 56 × 30 box holding week XII's two
birds is **byte-identical** between design and app — 6,720 pixels, worst Δ 0.

Recorded so the next audit reads those five rows as known rather than spending a session on them.
It is the SVG trap of the brief with the sign reversed: the numbers look wrong and the art is right.
