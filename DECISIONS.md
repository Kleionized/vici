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

<!-- vici-overhaul-decisions:start -->

# Vici Overhaul run (Oct 2026) — D200–D407

The UI rebuilt to the `Vici Overhaul` bundle (flat dark monochrome, Lato, the new five-tab bar and the
rebuilt 84-lesson course). D320–D349 and D400–D407 are the orchestrator's rulings and override any group
entry they touch; D350–D399 the shared kit and prerequisites; D200–D319 the screen groups. Analysis behind them:
`.overhaul/understand/`; the run's report: `.overhaul/REPORT.md`.

## Orchestrator decisions — Vici Overhaul run (D320–D349, D400–D407) — `orchestrator`

Merged into DECISIONS.md at the end of the run. Evidence is in `.overhaul/understand/CRITIC.md` (§ refs).

## D320 — One small-screen policy for every board (CRITIC §7.3)
At 393 × 852 every board renders exactly as drawn. Where content would meet the bottom controls on a
shorter phone, in this order: hide decorative heroes that sit between content and controls; on hero
boards translate hero + stack up together by the deficit (art top ≥ canvas 108); everything else scrolls
in a `ScrollRegion` between the fixed nav and the controls (`paddingBottom` = controls + 24); title-head
pages scroll whole; tab screens scroll under a bar painted with ground + noise. Never shrink type, never
overlap a control. Checked at 375×667 (inset 20), 390×844, 430×932.

## D321 — Disabled primary: the same pill at opacity 0.38
No frame draws one. 0.38 is what the auth boards already used; no new colour is introduced.

## D322 — States the frames never draw (CRITIC §7.4)
Toggle off: track `#2E2E2E`, knob `#F2F0EC` at left 3. Day toggle off: `#1E1E1E` + 14/700 ink. Lesson
option selected: ink row, `#111111` filled marker, `#F2F0EC` letter. Pressed: `Tap`'s 0.99 scale only.
Inputs: ink caret, `#9B968E` placeholder, dark keyboard (`userInterfaceStyle: dark`).

## D323 — Paywall and Yearly Drop keep a way out
Neither frame draws a dismiss, and the user's brief says every control keeps working. Both get the ✕ in
the nav's right slot, where Paywall Rescue draws it; Paywall's footer "Restore" is tappable. Recorded as a
visible deviation from those two frames.

## D324 — Behaviour that follows the frames
Gender auto-advances (no primary drawn, 260 ms like every no-primary option screen); the SOS reason and
feeling pickers are multi-select (board = first selection in canvas order; `reasons` stores all; `feeling`
stays one value — no schema change); the onboarding `reading` (Campaign Map) step is removed (FLOW goes
34 → 38); Today's pinned urge bar goes (the SOS disc and "Urge surfing" are the doors); the lesson reader
contains the day's task, `/lesson-card/[day]` and `/task/[day]` become redirects into it; "Finish lesson"
records completion once; morning check-in default 8:00 AM; `Health / wellbeing` is stored as `Health` and
old values map on read.

## D325 — Library tab = the twelve week pages
The canvas draws no Library index. The tab opens the current week's page; the twelve pages are a
horizontal pager; `/week/[week]` routes into it.

## D326 — `/score` shows the tab bar (Journey active, per the frames) — moved under `(app)` if links survive.

## D327 — The tab bar's ground
The bar has no fill in the frames; content ending at 748 never shows through. The app paints ground +
noise behind it so scrolled content cannot either — invisible at 852.

## D328 — Nothing is retired
Every route the app has stays reachable and is restyled to its closest frame (routes.md §4), including
the All drawer's sixteen screens and `/journey*`. Copy on undrawn screens and states is the app's
existing copy (CRITIC G12).

## D329 — Starting Score shows the app's own rating
The frame prints 842 of 1,000; the app starts at SCORE_BASE 1,000 and the canvas's own Score Detail and
Ranks floor at 1,000. The gauge is parametric; the frame's number is sample data.

## D330 — Auth errors: 14/700 ink; notices 14/400 `#9B968E` (no red exists in the system).
## D331 — Age wheel 13–99 (keeps the under-18 gate reachable).
## D332 — Native line breaks: `text-wrap: balance/pretty` is reproduced on web; on native, fixed copy
whose greedy break differs at 393 carries `\n`; dynamic copy and lesson body wrap greedily.
## D333 — Score's "Months" control opens a kit sheet (3M / 1Y).
## D334 — Native splash: plain `#0D0D0D`.
## D335 — No `presentation: 'modal'` page sheets (no frame draws one): `first-steps`, `lessons-browser`
push; `affirmation` is a transparent fade.
## D336 — Mock-only `/urge?board=<key>` so the three SOS boards no single account reaches can be verified.
## D337 — Kit text caps Dynamic Type at 1.3×.
## D338 — Hero ids are the illustration cards' own `data-hero` ids; `windowNight` aliases `nightMoon`.

## D339 — Today's task sentence is the lesson's own first task sentence (days 2–84)
D397 kept the previous course's one-line task (`task-src.json`) because Today Home Task and Night Action
Reminder draw day 1's. But on most days that line now names a different task from the one the new lesson
sets (L5 "Spend 20 minutes learning something new" vs the lesson's "Choose an activity for the hour when you
usually want porn"; L18/L19 entirely different), and tapping it opens the lesson's task page. The new bundle
has no short task line. So `cardSummary` = the first sentence of the lesson's own task (`practice[0]`) for
days 2–84 — the bundle's words, not authored ones — and day 1 keeps the frames' sentence, which the new L1
task contains ("put the phone out of reach from bed"). Sentences run 62–196 characters (median 71); the cards
are checked at the longest (L58).

## D340 — Tabs go back through history
`backBehavior="history"`: a week page opened from the All drawer, or Score from Today, goes back where it came
from instead of always to Today.

## D341 — Full-bleed art reaches the edges on wider phones
Crop-mode heroes with a floor (17 cards paint −40 … 433) are scaled just enough to cover the window when the
frame's fit would leave them short (nightMoon at 430; openDoor and lighthouse at every width); every crop a
frame draws is unchanged. The lighthouse's beams are extended collinearly to −40 … 433 in the generator —
identical inside 393, edge to edge at 430.

## D342 — The mock store keeps every event field
`createEvent` listed fields by hand and dropped `durationSeconds` / `severityAfter`, so a mock build's ridden
urges never reached the hub's proof panes. It now keeps the whole input, as the Convex mutation does.

## D343 — Orphaned files are not deleted without the user's approval
The rebuild left 14 files unimported (the old lesson reader, its art and the old task scenes, ~2.6 MB; listed
by `.overhaul/scratch/deadfiles.mjs`). The session's permission policy refused the deletion; they stay on disk
until the user approves (they are also in `refs/snapshots/pre-overhaul-full`).

## D344 — A hero between content and controls keeps its distance to the bottom on taller phones
Question-board and check-in heroes (the ones that pass `controls`) are bottom compositions: T 506 sets the
art's box on the primary's top, T 582 30 above the edge. On a phone taller than the frame the art keeps that
distance to the bottom, so the extra height opens between content and art instead of between art and pill.
Identical at 852; shorter phones keep D320 rule 1 (the art drops out when it would meet the controls).

## D345 — Cross-month ranges space the dash
`dateRange()` writes `Jul 14–20` within a month and `Jun 30 – Jul 6` across two, as Log Reports and Score
Detail (`May – July`) draw them; `weekLabel()` now just calls it.

## D346 — L64's task line skips its preface
L64's task opens "This exercise is optional.", which names no task; its card line is the next sentence (the
bundle's words). D339 otherwise holds: card lines run 17–196 characters, median 71.

## D347 — A scroll cue on native when a board overflows
No frame draws a scroll indicator and at 852 nothing overflows. On a shorter phone a `ScrollRegion` that opens
with rows below the fold shows the platform indicator and flashes it once after the push — native only, so web
captures (the verification build) are unchanged.

## D348 — Morning asks after the task Today showed
When yesterday's row names no action, Morning Task Check asks after yesterday's lesson task (`cardSummary`, the
sentence Today carried that day) instead of the generic `DAY_ACTIONS` line; past the course, the generic line.

## D349 — Short phones keep their art where they can
HeroBoard: when the stack needs more lift than the art has room for, the art rises to its limit (top 108) and
keeps its place, and the stack scrolls in the band between it and the controls; the art goes only when that
band would be under 160 pt, and then the stack is centred between the nav and the controls. A question-board
hero (`controls`) that misses its clearance by ≤ 16 pt rises by the shortfall instead of dropping out (every
such board keeps ≥ 30 pt clear above its art at 852). The frames themselves are untouched.

## D400 — The first morning skips yesterday
Day 1 has no yesterday: Morning opens on Feeling (dashes count Feeling · Energy · Pledge) and writes nothing to a
row dated before the account. A pledge written in the editor's first field alone is that pledge (`pledgeText`,
`src/lib/pledge.ts`), and every screen that shows the standing pledge reads it through that helper.

## D401 — The line under a lesson title is its own task sentence
Search, first steps and the lesson index showed the previous course's one-line summaries, which described other
lessons. `summary` is now the lesson's task sentence (`cardSummary`, D339); search also matches on it.

## D402 — Leaving the slip flow returns to the screen that is already there
"Start again", "Later" and "I'm already watching again" use `dismissTo` (Today / the hub): back to the
existing screen when it opened the flow, a replace when it did not — no second Today (and no second run of
the launch prompts), no second hub under the first.

## D403 — "Earlier today" stays today
Before 04:00 the four-hour preset now stops at midnight; a pick that leaves the moment unchanged keeps the lit
chip lit (slip and the log flows).

## D404 — Polish at other widths
Hero boards keep the frame's 345 text column on wider phones (frame line breaks hold at 430), and so do the
Paywall's feature labels and Yearly Drop's perks, each held to its 393 cell; Journey's
chapters sit 700 apart so the next chapter visibly enters the first screen; no-break spaces keep
"start to finish" and a letter's "Name —" together; Today's task caps wrap `pretty`; Score's pages scroll only
when their content overflows; an empty Past pledges list keeps its line in the gutter; a second tap on the
chosen orb light restores the default white.

## D405 — An overflowing band fades at its foot
On a short phone a `ScrollRegion` that holds more than it shows used to cut its last row or disc in half
against the pill. Its foot now fades 36 pt into the frame's ground while more lies below (gone at the end of the
scroll) — the canvas's own treatment for content that runs past the controls (L7 F11), shorter. Never drawn
where the content fits, so no 393 × 852 frame changes. Native also flashes the scroll indicator (D347).

## D406 — A short phone tightens a board's open gaps before it scrolls
D320's order gains a step before rule 3: where a fixed composition (not a list or a reading page) would
overflow its band, the open gaps the frame leaves between its blocks close first — together, each in
proportion to what it can spare, never under 24 between blocks (12–16 under the nav row) — by just the
overflow, and only what is still left scrolls. Kit `Slack` (inside a `ScrollRegion`) and `Band`'s `squeeze`.
It is exactly the frame's spacing wherever the board fits (every 393 × 852 frame), and type, cards, art
and controls never shrink. Applied where a 667 phone otherwise opened on a half-cut last row: Paywall
(the feature discs), the three check-in time boards (the day toggles), Cost Next 30 (its footnote) and Yearly
Drop (its perks; the card is 28 taller than a 667 phone can hold even then, so its foot still scrolls).
Hero boards keep D349 (their art already rises to 108; the gap under it is the frame's).

## D407 — Native keeps a lone last word off its own line
Native has no `text-wrap`, so away from the 393 break table (D332) a `pretty` / `balance` run wrapped greedily and
could end on one word where the web never does ("…change one awkward / detail.", "…for an entire / year."). Kit
`MonoText` now lays such a run out once and, when its last line holds a single word, draws it again with its last
two words tied by a no-break space — `pretty`'s orphan rule — but only when the line giving the word keeps two
words and half the run's width (else `pretty` leaves it too: "positive, on / average") and the pair fits the
widest line, so no word can break inside itself in a narrow cell. Web is untouched; checked on the iPhone SE
(375 × 667) simulator against the web captures.

## kit-choices decisions — Vici Overhaul run, Phase 0 Part A (D350–D359) — `kit-choices`

Files: `src/components/mono/choices.tsx`, `rows.tsx`, `pills.tsx`, `cards.tsx`, `lab/choices.tsx`,
`lab/rows.tsx`. Replica record (route, ignore regions, result per replica):
`.overhaul/shots/kit-choices/replicas.json`. Captures and strips: `.overhaul/shots/kit-choices/`.

Exports — `choices.tsx`: `OptionList`, `Option`, `Grid2`, `Chips`, `Chip`, `WhenChips`, `DateRow`,
`Segmented`, `toggleChoice`, `OPTION_LIFT`, types `Choice`, `SelectProps`, `SegmentItem`. `rows.tsx`:
`RowGroup`, `Row`, `Toggle`, `ListRows`, `ListRow`, `RuledRows`, `RuledRow`, `SummaryCard` (= `DetailRows`),
`DetailRow`, `CheckRows`, `CheckRow`. `pills.tsx`: `Pill` (+ `PillKind`), `CheckinDisc`, `CheckDisc`.
`cards.tsx`: `Card` (+ `CardVariant`, `CardPadding`), `IconCard`.

## D350 — One controlled selection API for options, tiles and chips
`OptionList`, `Grid2` and `Chips` take `options` (a string, or `{key, label?, exclusive?, disabled?,
accessibilityLabel?}`) and either `value: K | null` + `onChange(key)` (single) or `multi` + `value: K[]` +
`onChange(keys)`, with `exclusive` (keys, or the per-option flag) and `max`. The rule is `toggleChoice()`,
lifted from the funnel's own `O3FunnelStep.pick` so stored answers do not change shape: tapping a chosen
answer removes it; an exclusive answer replaces everything and any other answer drops it; at `max` a further
pick is **refused** (not rotated in) and the picker calls **no** `onChange` — the funnel's `pick` returned
early, so a consumer's save/haptic/analytics must not fire on a no-op (verified in `States@choices`: three
taps, one refused, two calls); picks stay in **tap order** (the funnel's existing order — the SOS
pickers' "board = first selection in canvas order" is the consumer's sort, D324). Nothing advances on a pick
— the 260 ms turn-over stays with the screen. Verified by a 9-case node test of `toggleChoice` and by
tapping in the V3-Q5 lab (`In the morning` added, `Late at night` removed).

## D351 — Ruled lists: the kit row carries the canvas's content-box point
Every ruled list draws `border-top: 1px #2E2E2E` on rows 2+ and the canvas's rows are content-box, so a
ruled 54 row measures 55 (52 → 53, 58 → 59, 60 → 61; Settings' card is 54+55+55 = 164). RN boxes are
border-box, so each kit row takes `divider` and adds the point itself; `RowGroup`, `ListRows`, `RuledRows`,
`CheckRows` and `SummaryCard` hand `divider` to every child but the first (an explicit `divider` wins), and
`RuledRows` also hands down `height` (52 / 56 / 46). Children must be the kit's rows (they receive the props
by `cloneElement`); `false`/`null` children are skipped, and **Fragments are opened** first
(`{premium && (<><Row/><Row/></>)}` is ordinary settings code) with their keys prefixed, so rows inside
one are ruled and +1 like their siblings (verified in `States@choices`: rows at 289 / 344 / 399). A row with no `onPress` is a plain `View` — no
button role, no press scale; with `onPress` it is a `Tap`.

## D352 — Toggle: the frames' on state, D322's off state, and who is the control
On (the only drawn state, App Lock / Data & Privacy): track `#F2F0EC`, knob `#1E1E1E` at right 3. Off
(D322): track `#2E2E2E`, knob `#F2F0EC` at left 3. The knob slides 3 ↔ 23 and both fills cross-fade over
180 ms (Reanimated); the first render is already at the value, so captures never catch it mid-way. Inside a
`Row` (`toggle={{ value, onChange }}`) the **row** is the control — role `switch`, `aria-checked`, a tap
anywhere flips it (the app's applock/privacy rows already behaved so) and the `Toggle` only shows the
state; a standalone `Toggle` with `onChange` is its own switch. Checked in the App-Lock lab by switching
two rows off (`[role=switch]` fired — drive.js's `tap()` does not look at `switch`, same as before).

## D353 — Selection state goes to the DOM as `aria-*`, not `accessibilityState`
RN-web 0.21's `createDOMProps` reads `aria-checked` / `accessibilityChecked` and ignores
`accessibilityState` — measured: an `Option` built with `accessibilityState={{checked}}` rendered
`role=radio` with **no** `aria-checked`. The kit now passes `aria-checked` (options, tiles, chips, when
chips, row switches), `aria-selected` (segments) and `aria-disabled`; RN 0.85 reads the same props on
native. Roles: `radio` (single), `checkbox` (multi), `tablist`/`tab` (Segmented — as the Log register
already was), `switch` (toggle rows), `button` (pressable rows/pills/cards). Recipes can read the selection
with `[aria-checked=true]`.

## D354 — Pills: one `Pill` with `kind`; inline-flex is opt-in
`kind` = `range` (+ `dot`) · `badge` · `status` (+ `filled`) · `darkTag` · `place` · `lessonTag` ·
`outline` · `streak` · `delta` · `checkin` (+ `lead`, usually a `CheckinDisc` — tone dot, ringed icon, or
the done disc), each with design-system §7.17's box and its span's own `line-height: normal`. The canvas's
`display: inline-flex` hugs the words; RN has no inline boxes, and a default `alignSelf: 'flex-start'`
would break the frames' centred rows (Today's header aligns the streak pill and the avatar on their
centres), so **`inline` is a prop** for pills placed in a column. The paywall plan card's "Save 74%" tab
(h24 card + ink ring, 11/700 ls 1) is drawn once, on one screen — left to the paywall group, not a kind.
`DateRow` (§7.17's "date row": the When step's chosen-moment row + ground "Change" pill) lives in
`choices.tsx` with `WhenChips`, the step it belongs to. `WhenChips` **wraps** (gap 10 both ways): the three
chips need 326.6 of a 375 phone's 327, so at 360 or at a larger text size the last one drops to a second
line instead of running 14.6 past the gutter (checked at 360×780); at 393 it is one line, as drawn.
`streak` and `delta` draw their own glyph unless `lead` is passed (`lead={null}` draws none); `delta` takes
`down` for a falling score — the 10 up arrow turned 180°, today-day §5's "down-arrow mirror" (undrawn); a
zero delta is the screen's to hide.

## D355 — CheckDisc states and glyph sizes
`state` = `done` (ink + `#111111` check) · `inverse` (Paywall's selected radio: `#1E1E1E` + ink check) ·
`pending` (`#1E1E1E` + line ring) · `current` (`#1E1E1E` + ink ring + 8 ink dot) · `empty` (transparent +
line ring: Paywall's unselected radio). The check's size defaults to §7.23's table per disc (22→11, 24→12,
26→13, 28→12, 30→13, 32→13, 34→14, 36→14, 40→16, 52→20, 84→36, 96→34, 132→56; the inverse 22→12);
`glyph` overrides (Score Detail Ranks' 26→12). `CheckRow` draws `done` by default; `done={false}` (a negative:
"No urges logged") uses the **`empty`** disc — a bare 1.5 `#2E2E2E` ring, no check — exactly today-day OQ-M2's
recommendation for the undrawn row (the negatives keep their own copy).

## D356 — Summary card and long values
`SummaryCard` (= `DetailRows`) is shrink-to-fit per CRITIC C10: `alignSelf: 'center'`, `maxWidth: '100%'`,
label `flexShrink: 0`, value `flexShrink: 1` + right-aligned lh 22 — Lapse Done measures **326** and Urge
Log Done **249** wide, exactly the frames; `stretch` opts out. Per C11 only dynamic values may ellipsise:
`Row`/`ListRow` take `valueLines` (then the right cluster and the value may shrink); fixed copy never passes
it and nowrap is never `numberOfLines` (design-system §10.10).

## D357 — The 0.04 lift, cards, and what each variant pads
`lift` (`OPTION_LIFT`, `0 1px 2px rgba(0,0,0,0.04)`) is a prop on `OptionList`/`Option`/`Chips`/`Chip`
only, on the unselected state, as the V3 frames write it; `Grid2` never carries it (no frame does). `Card`
variants: `filled` r24 card pad 22 22 (pass the frame's own `padding` in CSS order — `[26,26,24]` Your Vow
Page …), `outline` r22 card + line ring pad 20 18 18, `selected` r22 ink pad 20 18 18, `tile` h150 r24
pad 18 column space-between; `overflow` is never clipped by the card. A `Card` with `onPress` is a `Tap` with
role **`button`** unless `accessibilityRole` says otherwise — `Tap` spreads its props over its own default, so
passing the caller's `undefined` through had erased the role (no `role` on web, nothing for VoiceOver, and
drive.js could not find it); measured after the fix: `role=button`, `tabindex=0`. `IconCard` is Your Plan's
row card (42 ink disc + 20 glyph, 16/700 title, 13/400 mute line).

## D358 — Lab keys: one replica per frame stem where this part can give it
`lab/index.ts` spreads the parts in order core → choices → rows → overlay → hero → tabbar → misc, so a later
part's key silently wins. **`Lapse-When`** is registered here, at the frame's own stem: the whole frame from
kit pieces — `WhenChips` + `DateRow` around kit-overlay's real `TimeWheel` (0.00 %). The overlay part keys its
chips-as-boxes check `Lapse-When@overlay` and its decisions (D367) say Part A owns the plain key; the earlier
`Lapse-When@choices` is gone. **`Log-Urges`** stays kit-chrome's (bar-only, spread later); this part's
`Log-Urges@choices` now draws kit-chrome's real `TabBar` too, so it is the whole frame at 0.00 % — the
orchestrator decides which replica keeps the stem. `V3-Q1` is registered here built from `OptionList`, and
**supersedes** the core lab's raw-row `V3-Q1` (same numbers, same 0.00 %). The three replicas whose frames
carry a hero now draw kit-hero's `Hero` (Checkin Emotions `windowNight` 506/0.954, Your Vow Page `flag` 104,
Morning 1 Yesterday `sunrise` 506), in the frame's paint order, so every required replica is a whole-frame
check. Extra checks are keyed `<Frame>@choices` so they never shadow anyone's; `States@choices` is not a frame
— it shows the undrawn states and drives `max`. The replicas are recorded in
`.overhaul/shots/kit-choices/replicas.json`, **not** in `.overhaul/recipes/` — `audit.mjs` keys recipes by frame
label across files in name order, so a `kit-choices.json` there would override `day.json`'s real `Checkin
Emotions` recipe with a lab route.

## D359 — The `→` in "+12 → 1,240" is a fallback glyph (orchestrator's call)
Lato 700 (the `@expo-google-fonts/lato` TTF — Google's v1 cut) has no U+2192 (checked in its cmap). The
canvas's stack `'Lato',-apple-system,system-ui,sans-serif` draws it from the system face; the app's
`fontFamily: 'Lato_700Bold'` has no fallback on web, so the browser's default face draws a thinner arrow
(the run is 85.1 wide against 84). It is the only residue on Morning 1 Yesterday (0.05 % of the whole frame, hero drawn).
Native iOS falls back to the system face already. Fix belongs to `theme.ts` (`sans()` on web: append
`, -apple-system, system-ui, sans-serif`) — requested, not made here.

## Verification (all at 393×852, Lato loaded, strips looked at)

Required replicas — whole-frame pxdiff, nothing ignored:

| key | pxdiff | residue |
| --- | --- | --- |
| V3-Q1, V3-Q5, Checkin-Emotions, Lapse-When, Settings, App-Lock, Manage-Subscription, Log-Urges@choices, Lapse-Done, Urge-Log-Done, Your-Vow-Page | **0.00 %** | — (heroes, wheel and tab bar drawn by the other parts' kit components) |
| Morning-1-Yesterday | 0.05 % | the `→` glyph only (280,232 32×12 · 312,232 16×12 · 328,232 12×12; D359); the sunrise is exact |

Extra checks: Slip-Logged@choices (C10's third case: card 24,431 345×241, rows 54/55/55/77, last value 158.5
wide at x 190.5 on two lines) 0.00 %; Your-Plan@choices (IconCard) 0.00 %; Paywall@choices (selected/outline
cards, inverse/empty radios, 34 discs) 0.00 % (laurel ignored); Today-Home@choices (streak, delta, two check-in
chips) 0.00 % (strip/chart/bar ignored); Urge-Overview@choices (range pill, 4-segment, 46 dot rows) 0.00 %;
Where-We-d-Start@choices (place pills) 0.02 % = sub-point glyph offsets in the screen's inline-bold paragraph
(y 664); region diffs 0.00 % for the 26 step discs (done/current/pending), dark tag, outline pill, range + dot,
lesson tag. Signature diffs: every remaining row is the D022 span→View+Text box or the explicit `lhNormal` line
height equal to the frame's `normal`. Size sweep 375×667 and 430×932 of every replica touched in the fix pass
(Lapse-When, Checkin-Emotions, Your-Vow-Page, Morning-1-Yesterday, Log-Urges@choices, Slip-Logged@choices),
plus Lapse-When at 360×780: no horizontal clipping or overflow from these components (the when-chips wrap at
360; the summary card fills 382 at 430 and re-wraps its last value); vertical collisions with bottom controls
at 667 are the screens' D320 work, not the kit's. Intermittent: Expo web's fast-refresh badge (a bolt at
8,800 44×44) appears in a capture taken while another agent's edit hot-reloads — re-shoot, it is not app
content (it hit one Log-Urges@choices capture in this pass).

## kit-overlay decisions — Phase 0 Part B (D360–D369) — `kit-overlay`

Files: `src/components/mono/Sheet.tsx`, `TimeWheel.tsx`, `Field.tsx`, `PledgeCard.tsx`, `Progress.tsx`,
`lab/overlay.tsx`. Evidence: the replicas below (`/kit-lab?f=<key>`), captured at 393×852 and diffed with
`scripts/overhaul/pxdiff.mjs` against `.overhaul/shots/design/Email-Login/<Frame>.png`; strips kept at
`.overhaul/shots/lab/ov-<key>.strip.png` (`@` → `_`), size sweeps at `.overhaul/shots/lab/sz/`.

Second pass (after the independent verification): the wheel is fully controlled and drags through
native gesture handlers (D362); the sheet's modal flag moved to the layer (D360); the keyboard lift
leaves the field clear on a 667 phone (D361); `TextField` composes a caller's `onContentSizeChange` and
gains `multiline` / `accessory` (D364); the `quote`-light and `plain` PledgeCard replicas are back under
suffixed keys, plus a `modal` sheet replica (D367); the hero boards drop their art on short screens (D368).

## D360 — `Sheet` is an in-tree overlay with frame-level buttons
The four sheet frames draw the whole screen underneath, a `rgba(0,0,0,0.68)` scrim over everything
(status-bar band included, z 40), the `#171717` `28 28 0 0` panel (z 41) with the 40×4 `#2E2E2E` grabber at
10 and its content column at `left 24 right 24 top 44`, and the buttons **outside** the panel at z 42,
anchored to the screen bottom. So `Sheet` renders as the last child of `Screen` (canvas coordinates), its
scrim starting at `-canvasTop` (the window's top), and takes the buttons as `footer` in canvas coordinates
(`<PrimaryButton sheet bottom={96} />`, `<GhostLink zIndex={42} />`). `modal` renders the same layer in a
transparent RN `Modal` (statusBarTranslucent, navigationBarTranslucent) for a sheet that must also cover
navigator chrome — e.g. D333's Score "Months" sheet over the tab bar; replica `Sheet-Sign-Out@modal` diffs
0.00 %, and its scrim tap closes it (real mouse, hit-tested).
Dismissal = `onClose`: scrim tap (`Dismiss`), Android back (BackHandler), Escape on web, a downward drag
on the panel past 96 pt or faster than 0.9 pt/ms (shorter drags spring back — a 40 pt drag returns the
photo panel to 512, a 130 pt drag closes it). Without `onClose` only the sheet's own buttons close it.
The panel drag's `onResponderGrant` returns `true` (blocks the native responder, so an Android scroll
view under the finger cannot intercept it). Motion: open 300 ms out-cubic, close 220 ms in-cubic then
unmount; Reduce Motion makes both instant. Closing a sheet dismisses its keyboard.
**Accessibility:** `accessibilityViewIsModal` + `aria-modal` + `role="dialog"` sit on the **layer** that
holds scrim, panel and footer — not on the panel. VoiceOver hides a modal view's siblings, and the
frame-level buttons are the panel's siblings, so on the panel the flag hid Save / Sign out / Sign the new
pledge / Keep current pledge / Stay signed in / Cancel from VoiceOver. The layer is `collapsable={false}`
so Fabric cannot flatten the flag away. In `modal` mode the RN `Modal` is already the dialog (its own
window natively, `role="dialog"` on web), so the layer does not repeat it — one dialog either way
(checked: the dialog element contains Dismiss and every footer button).
**Web `box-none`:** an inline `style.pointerEvents: 'box-none'` is written as CSS, where `box-none` is not
a value — the full-window footer layer then swallowed every tap meant for the scrim. The layer uses a
`StyleSheet`-registered box-none; the Reanimated footer (whose web view flattens styles inline) keeps the
`pointerEvents` prop, which costs one RN-web deprecation notice.

## D361 — A sheet keeps its drawn height, not its drawn top; the keyboard lifts it
`top` is the frame's panel top at 852 (`SHEET_TOP` = pledge 120, name 420, photo 512, signOut 556). Off 852
the panel stays **bottom-anchored at height 852 − T** (like the buttons it carries), clamped so it never
climbs past canvas 60. Without this, Sign Out on a 667 phone would put its own pill above the panel's top.
Checked at 375×667 and 430×932.
Keyboard (settings R3, today-day R6): the footer rides the keyboard **less 32** (`KEYBOARD_GIVE`): the
buttons' 48 off the screen edge exists to clear the home indicator, which the keyboard covers, so over
the keyboard it becomes 16. The panel rises by `min(lift, panelTop − 60)`; a native-only `#171717`
underlay fills what a lifted panel leaves below its edge. Computed for Change Pledge on 375×667 with a
260 keyboard: the full-keyboard lift put the pill (window 253–311) 18 pt into the 100-tall field
(171–271); with the give the pill top is 285, 14 clear. At 852 (336 keyboard incl. the 34 inset) Edit
Name's pill sits 16 above the keyboard. Where Android resizes the window instead, the lift subtracts what
the resize absorbed. Web has no keyboard events, so captures see the drawn geometry. **Not verifiable on
the web build — check on a device.**

## D362 — `TimeWheel`: one strip per column, fully controlled, native gesture handlers
Replaces `src/components/routines/wheel.tsx` (not edited — its owners switch). Not a ScrollView: each
column is a window onto an unbounded strip (virtual row → `values[row mod n]`), so hours and minutes loop
with no copies and no re-centring jump, and every row sits at `88 + 44·k` — whole points, so FINDINGS §4b's
half-point `lead` bug has nothing to come from. The frame's three looks (30/900 ink · 22/400 mute ·
22/400 `#2E2E2E`) switch at the half-row mid-drag.
**Controlled like a text input.** `value` is the truth: after every settle (a `settles` counter re-runs
the check once the caller has answered) and on every value change, the strip is compared with `value` and
rolled to it by the shortest way round, without reporting back. So a caller that refuses a change (keeps
its state) or clamps it (slip.md §98C: never in the future) sees the column roll back to what it holds. A
value arriving from outside while the strip is still or settling after the finger lifted wins (the
settle is stopped and does not report); one arriving while a finger holds the column becomes the
reference the drag's step is counted from, so the release reports relative to it — wheel and state end
equal either way. Steps are built on `value` as the caller holds it (the old `latest` ref, which kept a
refused value, is gone). Callers must answer inside `onChange`; a value that only arrives later rolls the
wheel back and then forward.
**Gestures:** `react-native-gesture-handler` `Gesture.Pan().runOnJS(true)` with `activeOffsetY ±4` and
`failOffsetX ±10`. JS responder props could not keep a parent ScrollView from taking the touch: Android's
ScrollView intercepts unless the native responder is blocked, and iOS Fabric ignores
`blockNativeResponder` entirely — `RCTMountingManager setIsJSResponder` drops it, and the scroll view only
stands down when an *ancestor* is the JS responder (`RCTScrollViewComponentView
_shouldDisableScrollInteraction`). An RN ScrollView's vertical scroll bounces even when its content fits
(`alwaysBounceVertical` defaults true), so the problem existed at 852 too, wherever a wheel sits in a
`ScrollRegion`. With native handlers the first to activate wins, and 4 pt is under Android's 8 dp slop
and UIKit's scroll pan. Release projects `velocity·180 ms`, ignoring velocity if the finger stood still
for 90 ms (the web tracker keeps its last speed through a pause — a 250 ms pause produced a 2-row throw
before this). Settles take 160–520 ms out-cubic; the meridiem rubber-bands at a third past its ends.
**Tap a row above/below the band to step to it**; rows stay `Pressable`s labelled `Hour 10`,
`Minute 59`, `AM or PM PM` for drives and screen readers; a touch that became a drag never also presses
(guard, for the web build where a mouse drag still ends in a click). The gesture builder is wrapped in a
scoped `eslint-disable react-hooks/refs, react-hooks/purity`: RNGH only stores the callbacks, which the
compiler's rules cannot see.
`onChange(next, { column, delta })` fires once a column settles; `delta` is for callers that shift a
timestamp. Columns do not carry into each other (59 → 00 leaves the hour). `minuteStep` thins the minute
column; an off-step minute shows as the step at or below it (58 → 55 at step 5 — the old rounding showed
the next hour's 00) and nothing is reported until that column moves: hold minutes on the step. At rest a
column mounts exactly its five rows (drives' `scrollBy` must never find a wheel). Each column is
`adjustable` with increment/decrement and `aria-valuetext`. Helpers: `wheelToMinutes` / `wheelFromMinutes`.
Checked with real mouse input on `_Wheel-Controlled` (a caller clamping at now = 11:40 PM, plus an outside
preset): tap/drag/clamp/refuse/preset-at-rest/preset-mid-settle/preset-while-held all leave
`aria-valuetext` equal to the caller's state; slow 220 pt drags step exactly 5; a 100 pt flick steps 4; a
20 pt drag starting on a neighbour row steps nothing. **Device check still needed:** the iOS/Android
arbitration against a real parent ScrollView.

## D363 — `DayToggles`: Sunday-first, `value: number[]` (0 = Sunday)
As `routines/kit.tsx` stores days. On = ink disc + `#111111` 14/700 (every frame); off = `#1E1E1E` + ink
letter (D322). Checkbox role, day names as labels, state as `aria-checked` (RN-web did not render
`accessibilityState`; now `Monday=false` after a tap, the rest `true`).

## D364 — `TextField`: a real input everywhere; only `name` keeps a drawn bar
Variants `name` (V3 Q24: 60 r18, padding 0 22, 17/400), `sheet` (Sheet Edit Name: 60 r18, padding 0 20,
18/700), `card` (Change Pledge: min 100 r20, padding 20 22, 20/700/29, grows), `note` (SOS Afterward:
min 150 r22, padding 22 24, 20/400/30, grows), `bare` (Night 3 Reflection: 22/400/34, grows). Placeholder
`#9B968E`, value ink, caret ink (`selectionColor`/`cursorColor`, web `caretColor`), dark keyboard, no web
focus ring. The frames' caret bars are a static frame's stand-in for focus (CRITIC C9): the platform caret
replaces them, so **each typed-state replica's only residual is the drawn 2×22 caret** (Change Pledge
0.01 %, Edit Name 0.01 %, Reflection 0.02 %, Afterward 0.01 %). `name` is the exception (the app's
`onboarding/v3.tsx` precedent): its frame draws the bar *before* the placeholder, so the bar is part of the
layout — shown while focused and empty, keeping its 2-pt slot once typed so the text stays at x 50.
Growing fields size from `onContentSizeChange`; a caller's own `onContentSizeChange` now runs after the
growth instead of replacing it. For the unframed screens (routes.md §4.4 Life Map, OQ-R9): `multiline`
grows a one-line variant from 60 tall with its first line where the single line sat (`sheet` grown:
padding (60 − 22)/2, two lines → 82), and `accessory` puts a control at the box's right (the 48 "+" disc).
Checked on `_Field-Grown`. On web RN-web reports `scrollHeight`, so a field grows but does not shrink back
after deleting lines (native shrinks).

## D365 — `PledgeCard`: three settings, the signature rule as the frame draws it
`sign` (Morning Resign / Signed, Slip Pledge, Relapse Resign), `quote` light (Your Vow Page) / dark (Urge
Hub Pledges), `plain` (Today Home III; `children` follow in its gap-10 column). The signature line is the
box's own bottom border: on web a CSS border, which Chrome dashes and snaps exactly as it did the frame's
(the 1.5 rule renders 1 pt, 60 dashes of 3 on / 2 off fitted to 297); native cannot dash one side, so there
the dashed rule is an SVG line `3 2`. The signed name has **no `numberOfLines`** — its overflow clip shaved
the italic's overhang. Every variant now has a kept replica: `quote` light is `Your-Vow-Page@overlay`
(whole frame, 0.00 %), `plain` is `Today-Home-III@overlay` (the pledge block 405–565 with the frame's
three 42 rings as children, 0.00 % with `--ignore=0,0,393,405;0,565,393,287`).

## D366 — `Spinner` turns the whole mark; `StepList` uses the kit `CheckDisc`
The frame's spinner is static; the app rotates the 88 mark (1.2 s a turn, linear), still under Reduce
Motion or `spinning={false}` (the replica's pose). `StepList({ steps, current })`: before `current` done,
at it current, after it pending — 26 `CheckDisc` (Part A, glyph 13) + 16/700 ink or 16/400 mute.

## D367 — Replica keys
`Change-Pledge-Sheet`, `Sheet-Edit-Name`, `Sheet-Sign-Out`, `Sheet-Sign-Out@modal`, `Sheet-Profile-Photo`
(backdrops as plain boxes; the photo sheet's rows are Part A's `RowGroup`/`Row`), `Morning-Check-in-Time`,
`Nightly-Check-in-Time`, `Lapse-When@overlay` (Part A keys `Lapse-When` itself — its replica now runs this
`TimeWheel` too, 0.00 %), `Morning-Resign-Pledge`, `Morning-Pledge-Signed`, `Slip-Pledge`,
`Urge-Hub-Pledges` (Part D's `PagerDots`), `Your-Vow-Page@overlay`, `Today-Home-III@overlay` (partial —
ignore string above), `Enlisting-Aegis`, `V3-Q24-Name`, `Night-3-Reflection`, `SOS-Afterward` (heroes from
Part C's `Hero`). Not frames: `_Wheel-Controlled` (D362), `_Field-Grown` (D364). Sheet replicas hold real
`open` state, so dismissal can be driven. No recipe entries were written: a kit-lab route in
`.overhaul/recipes/*.json` would replace the real screen's recipe for the same frame label.

## D368 — Short screens in the replicas (D320 rule 1)
The pledge boards (`Morning-Resign-Pledge`, `Morning-Pledge-Signed`, `Slip-Pledge`) and the question
boards (`V3-Q24-Name`, `Night-3-Reflection`, `SOS-Afterward`) leave their hero out when its art bottom
(`heroArtBottom`) would pass the highest control's top — at 375×667 the pen ran across "Confirm" and
"Change the pledge". Every one clears its controls at 852 and 932, so the frames are unchanged.
`Your-Vow-Page@overlay` follows `HeroBoard`'s rule (flag and stack rise together within the flag's room
above 108; past it the flag goes and the stack rises alone). The check-in-time replicas still run their
day toggles under the pill at 375×667 on the web build only: they sit in the core `ScrollRegion`, which
does not scroll on web (reported to the orchestrator).

Results at 393×852 (pxdiff, chrome excluded): every replica 0.00 % except the four typed fields' drawn
caret (0.01–0.02 %, one 4×28 region each — D364).

## Kit-hero decisions — Phase 0 Part C (D370–D379) — `kit-hero`

Merged into DECISIONS.md by the orchestrator. Files: `scripts/overhaul/gen-heroes.mjs` (new),
`src/content/heroes.ts` (GENERATED), `src/components/mono/Hero.tsx`, `LaurelMark.tsx`, `MedalTier.tsx`,
`lab/hero.tsx`; `scripts/overhaul/body.mjs` (`SVG_ATTRS`).

## D370 — The hero registry is generated from the 53 cards and checked against every hero the bundle draws
`node scripts/overhaul/gen-heroes.mjs` reads the **first** 393×240 svg of each
`Lesson-Illustrations-v4` card (the second is the `Before` thumbnail) and writes `src/content/heroes.ts`:
`HERO_IDS`/`HeroId` (the cards' own `data-hero` ids, canvas order), `HERO_ALIASES` + `heroId()`
(`windowNight → nightMoon`, D338), `HERO_LABEL`, `HERO_SCALE` (1.1; `medal` 1), `HERO_BOUNDS`, `HERO_BOX`,
`HEROES` (node trees). Attribute **values are the canvas's strings verbatim**; names are
react-native-svg's (`stroke-width` → `strokeWidth` …); an attribute with no mapping stops the run.
The run fails unless:
- each card's parsed tree serialises back to the card's markup byte for byte (nothing dropped);
- `paint-order="stroke"` is on exactly 22 shapes in 17 cards — each is emitted twice (as written, then
  the same shape with `stroke: 'none'`, whose fill covers the stroke's inner half exactly as the
  browser's stroke-under-fill order does; react-native-svg ignores the property). Opaque fills only —
  asserted, because a translucent fill would be painted twice;
- every `<svg data-hero>` on the 254 Email-Login frames (151: 150 by their own id, `Checkin-Emotions`
  via the alias) and in the 1,273 lesson frames (284) is byte-identical to its card; all 53 cards used;
- `HERO_BOX` reproduces the hero box height and svg top of all 286 lesson hero boxes (284 + the two
  Lesson Scroll frames on Email-Login);
- the Today crop formula reproduces the three cropped svgs' `width/height/viewBox` strings.

The medal's `<text>` ("V", `'Lato'` 700) names the app's face, `fontFamily: 'Lato_700Bold'`,
`fontWeight: 'normal'` (theme `sans()` rule — a weight is a family).

## D371 — `HERO_BOUNDS` is the designer's `gen/hero-bounds.json`, verbatim, and it covers the paint
The canvas computed the lesson boxes (`heroFit`) and the Today crops from these numbers, so they are the
spec. They are not the painted extents: `--verify-paint` rasterises every card at 4× in headless Chrome
and finds the vertical bounds sit 0.80–8.6 user units outside the paint (never inside); left/right are
the object's and leave out the full-bleed floor lines (17 cards paint −40…433). `Hero` therefore sizes
its canvas from the vertical bounds (+2 pt) and spans the screen width — nothing a card paints is clipped.

## D372 — `Hero` (CSS mode): a screen-wide `<Svg>` over the art's band, the transform folded into one `<G>`
CRITIC §7.1's ruling (screen-wide, no `overflow: visible`, always absolute) with one change of form: the
canvas is not `240 + 2P` tall but only the art's vertical band (`round(T)+190+s(t−190)` … bottom, ±2 pt,
snapped to whole points), and the frame's `scale(s)` about (196, 190) plus the centring offset
`(W−393)/2` become `translate(ox oy) scale(s)` on the art. Same mapping (X = (W−393)/2 + 196 + s(x−196),
Y = T + 190 + s(y−190)), a smaller canvas, and the art's sub-point position is independent of how the box
is rounded. `scale` defaults to the card's own (`HERO_SCALE`: 1.1, the medal 1 — Medallion Received draws
it at 1), not a flat 1.1. `HeroArt` (memoised) is exported for a caller that needs the bare art in its own
`<Svg>`.

**Small screens, rule 1 (D320).** A decorative hero between the content and the bottom controls (the
question boards' T 458 / 506 / 582, the check-in heroes) takes `controls` — the space the controls take
off the screen's bottom edge (106 for the primary at bottom 48; 0 for a board with none, so the screen's
edge is the limit). Given, the hero is not drawn when its art's bottom (bounds) would come within 16 of
that line. Measured over every Email-Login hero with controls, the frames keep ≥ 21.8 there at 852
(Cue Hue Picker is the closest), so the prop never acts at 393 × 852; at 375 × 667 it drops Cue Hue
Picker's door (which ran under Continue) and V3 Q3b's calendar (which the screen's edge would cut). It
is the screen's opt-in: without `controls` the hero always draws. `heroArtBottom()` joins
`heroArtTop()` for screens that need the numbers.

## D373 — A fractional hero `top` draws from the whole point (measured)
The canvas boxes at 241.3 / 231.5 (Today crops) and 114.4 (Week IV cover) do not land where the numbers
say: Chrome paints an `<svg>`'s content from its border-box origin snapped to the whole point, at the
unsnapped scale. Measured by band-wise sub-pixel fitting of the app capture to the design: Today Task
lands as if at 241, Today III at 232, Week IV at 114 (every band within 0.07 pt once snapped; 0.3–0.5 pt
off before, 0.44–1.53 % of the hero band in mismatch). `Hero` uses `Math.round(top)` in CSS and crop
mode; the week covers' 98.9 / 63.9 / 88.8 follow the same rule (inferred, not captured). Box mode needs
nothing: its svg offset inside the box is an integer, so on web the browser snaps the app's svg exactly as
it snaps the canvas's (L2 Frame 1's box sits at y 154.5 → 0.00 %).

## D374 — Crop mode (Today II / Task / III) and box mode (lesson reader)
Crop: today-day §0.5 verbatim (`vy = t−3`, `vh = b−t+6`, `s = round2(148/vh)`, `vw = W/s`,
`vx = 196.5−vw/2`, height `round1(vh·s)`, rounded as the frame writes them), then the browser's
`xMidYMid meet` fit of that viewBox into that box, drawn without clipping (the canvas sets
`overflow: visible`). At W ≠ 393 the crop widens with the screen and stays centred. Box: an in-flow
`View` `width W, height HERO_BOX.h, marginHorizontal −bleed (32)`, art placed with `HERO_BOX.top` at the
card's scale — the medal's box uses the 1.1 formula and its art scale 1, as the canvas does.

## D375 — `HeroBoard`
`tone` (light | dark), `nav` (`left` default `'empty'`, `centre`, `right` default `'close'`, handlers),
`hero` + `heroTop` (190) + `heroScale`, or `art` (a canvas-coordinate layer, e.g. Drop Received's medal)
+ `artTop`; `stackTop` (452), `gap` (18), `caps`, `title`, `titleSize` 30 | 26 | 34 (→ `title` 30/36,
`h1` 26/33, `titleCover` 34/40, centred, balance), `body` (string → 15/24 sub, dark 0.62; node replaces
it), `extra`, `cta`/`onCta`/`ctaDisabled`, `ctaBottom` (96 when there is a ghost, else 48),
`ghost`/`onGhost`, `children`. Small screens (D320 rule 2): the stack is measured (`onLayout`); when
`stackTop + height + 16` passes the highest control's top, hero (or art) and stack rise together by the
deficit, capped so the art's top stays ≥ canvas 108. The lift is a whole number of points (`ceil` of the deficit, `floor` of the
room), so the hero (drawn at `round(top)`, D373) and the stack move by exactly the same amount and the
clearance is never under 16. Until the stack has been measured, the hero/art and the stack render at
opacity 0, so a short screen never paints one unlifted frame and then jumps. **When the deficit is
larger than the room** (no frame and no real phone needs it; Dynamic Type 1.3× on a 667 phone could),
the art is dropped — it is decoration, rule 1 — and the stack rises alone as far as canvas 108; if it
still does not fit, it scrolls in a `ScrollRegion` from 108 to the primary's top (16 end padding).
Never under a control. Verified at 375×667 (Slip Entry and Drop Received lift 23 / 37, body bottom 16 pt
above the pill), at 430×932 (full-bleed grounds reach both edges), and the two fallbacks on Slip Entry
at 375×480 (art dropped, stack 16 pt above the pill) and 375×340 (stack scrolls from 108).

## D376 — `LaurelMark`: `Image` + `tintColor="#FFFFFF"` + `resizeMode="stretch"`
The canvas's `filter: brightness(0) invert(1)` on a 280×252 webp drawn into a square box. `size` and an
optional `radius` (Reminders Setup's 40 r10 notification icon); the caller positions it. Splash and Login
diff at 0 px over 6/255 — the laurel is pixel-identical, including the stretch.

## D377 — `MedalTier` + `TierLadder`
`MedalTier({tier 0–4, size 30, dim, disc, glyph})` is the kit's `medal(tier, size, glyph)` (radii `c−2`, `c·0.72`,
`c·0.74`, `c·0.82`, `c·0.66`; platinum's 16 ticks with `toFixed(1)` endpoints and `size·0.04` stroke, so
at 30 every path string is the frame's). Unearned: Paper is redrawn as the dashed `#5A574F` ring
(`3 6`), tiers 1–4 keep their drawing at opacity 0.32 (`TIER_DIM`). The frames set each medal on a
`#0D0D0D` disc of its size (it masks the tier track) — `disc` (default on). `glyph` is
Drop Received's centred letter (`medal(4, 176, 'V')`, the only frame that draws one): Lato 700 at
`round(s·0.34)`, baseline `c + fontSize·0.36`, fill ground on tiers 3–4, else ink (`#5A574F` dim) — so
at 176 it is the frame's `x 88 y 109.6 font-size 60`; that frame draws no disc (`disc={false}`).

`TierLadder({reached: −1..4, progress?, thresholds?})` is the ladder of the five Breakwater / Detail
boards **and** the eight Tiers pages (18 frames, one track): rail `left/right 10% top 14 h2`, ink fill,
five medals, names 13/700 ink when reached, mute otherwise. The boards fill to the reached tier
(`progress` defaults to `reached`); the Tiers pages run part-way to the next rung —
`width = (progress·20).toFixed(1) %` as the frames print it, none at 0 or when nothing is reached — and
carry `thresholds` (12/700 nowrap, `#B5B0A8` reached, `#5A574F` not) under the names (`gap 3`).
`ladderStanding(count, rungs)` gives `{reached, progress}` per medallions-letters §1.4 (reached = rungs
met − 1; progress = reached + (count − rung[reached]) / (rung[reached+1] − rung[reached]); 4 at the top;
−1 when unearned — Archive's 9 of 10 draws no fill). It reproduces all eight frames' fills (Vidi 5.2,
Vici 18.0, Rebound 2.2, Breakwater 10.0, Logbook 20.4, Pulse 14.0, Lessons 7.0, Archive none).
Reached is told by colour and opacity only, so the ladder is one accessibility element:
`role="progressbar"`, label "Tiers", value 0–5, and a value text that reads each tier, its rung and
whether it is reached (RN-web renders the aria attributes and no tab stop).
Verified: Breakwater Paper / Gold / Platinum, Detail Paper, all eight Tiers pages (0 px over 6/255 with
the 168 coin — the medallions group's — masked) and Drop Received (0 px over 6/255, whole frame).

## D378 — `body.mjs` prints `data-hero`, `paint-order` and `font-family`
Those are the attributes the frames carry that it dropped (tallied over all 1,580 frames: the only others
are `data-screen-label` on frame roots and the illustration canvas's `sc-if` wrappers, neither of which
is screen content). `decl.mjs` keeps its own, unpatched copy of the list (not this part's file).

## D379 — Kit-lab replicas are not written to `.overhaul/recipes/`
`audit.mjs` keys recipes by frame label across every file, so a kit-lab "Splash" or "Login" entry would
override the auth group's real one. The replicas live in `LAB_HERO` (`/kit-lab?f=<stem>`) and are re-run
from there.

## kit-chrome decisions — Vici Overhaul run, Phase 0 Part D (D380–D389) — `kit-chrome`

Files: `src/components/mono/TabBar.tsx`, `scales.tsx`, `Feedback.tsx`, `lab/tabbar.tsx`, `lab/misc.tsx`;
`src/components/StoicTabBar.tsx`, `src/app/(app)/_layout.tsx`, `src/app/+html.tsx`, `src/lib/format.ts`,
`src/components/ui/Feedback.tsx`, `.overhaul/clock.js`; moved `src/app/score.tsx` → `src/app/(app)/score.tsx`;
new `scripts/overhaul/format-test.mjs`.

## D380 — The tab bar is the canvas's five items, lit by the navigator's focused route
`mono/TabBar.tsx` exports the presentational `TabBar` (`active`, `onTab`, `onSOS`, `variant`, `ground`,
`inline`), the router-wired `AppTabBar`, `TAB_ITEMS`, `TAB_FOR_ROUTE`, `tabForPath()`, `useTabBarHeight()`,
`tabBarHeight()`, `SOS_ROUTE`. Geometry is design-system §7.18 verbatim (row space-between, padding 14 14 0,
72-wide items, 26 glyph, gap 4, 11.5 label 700 ink / 400 `#9B968E`, 60 ink disc at −6 with "SOS" 13/700
`#111111`). Destinations: Today `/(app)/today`; Log `/log-chooser` (D124); SOS pushes `/urge` (CRITIC C12,
never lit); Library `/(app)/library`; Journey `/(app)/milestones`. Lit: Today on `today`; Log on `log`;
Library on `library` (and `/week/*` via `tabForPath` for a standalone bar); Journey on `milestones` **and
`score`** (the three Score Detail frames light it). `StoicTabBar` (the navigator adapter) reads the lit item
from `state.routes[state.index].name`, not the URL: a screen pushed over the tabs (Log chooser, a lesson)
changes the URL while the tab screen stays mounted under it, and a URL rule would drop that screen's bar
during the push and the back-swipe. Routes not in `TAB_FOR_ROUTE` draw no bar (Settings, All, Journal,
Insights, Life map, Weeks, Rough days, Support — the old `NO_BAR` list plus `all`). Each item is
`role="tab"` with `aria-selected` (not `accessibilityState`, which react-native-web 0.21 drops without an
ARIA attribute — the lit tab was invisible to assistive tech on web); RN maps `aria-selected` to the
native selected state.

## D381 — In the navigator the bar is laid out in flow; it paints ground + noise in phase with the window
`height = 70 + max(insets.bottom, 34)` (104 on a 34-inset phone and on the mock web build). In `(app)` the
bar sits under the scene in react-navigation's column (`inline`), so a tab scene ends at the bar's top
(748 at 852) — where every one of the 37 bar frames' content already ends; none anchors anything to the
bottom edge (checked: no depth-1 `bottom:` on any bar frame). The kit contract ("bottom is off the screen
edge") is unchanged for every non-tab screen; a screen outside the navigator that draws the bar
(`/week/*` if it stays a root route) renders `AppTabBar` absolutely over its own `Screen` and pads its
scroller by `useTabBarHeight()`. Overlay mode was built first and rejected: with a full-height scene,
today.tsx's pinned "Urge surfing" bar went under the tab bar (a hidden control) and the old Score footer
lost 104 pt. Per D327 the bar paints `#0D0D0D` + `noise.png`@0.05 over its own band; the tile is offset by
`(windowH − barH) mod 96` so its speckle is in phase with the screen's (0 px over 6/255 on the band). Below
376 wide the four items shrink (CSS's default `flex-shrink:1`, which Yoga lacks) so the SOS disc keeps its
circle. `(app)` scenes get `sceneStyle: {backgroundColor: #0D0D0D}` (the navigator default was the light
theme's grey).

## D382 — Scales: 0-based values, radio semantics, tappable pager dots; a chosen dark disc takes the double ring alone
No frame chooses disc 0 or 1. The frames' selected rule replaces `box-shadow` (gap ring `#0D0D0D` 4 +
ink 6), so a chosen `#34322F`/`#5A5751` disc loses its inset `#45423E` ring — the 4 pt ground gap and ink
ring define its edge. Scales take the app's own 0-based index (the dials and `INTENSITY_BANDS` already
store 0–4). Every scale's row is a `radiogroup` of `radio`s carrying `aria-checked` (logs §3.16: "role
radio, label = band, `checked`"; the kit's choices/rows already do this) — `accessibilityState.selected`
emitted nothing on web and announced "selected", not "checked", on native. Energy's fill meter checks only
the chosen bar; the lit bars under it are drawing. `ScaleReading`'s word is the scale's value, not a
heading: it is an `aria-live="polite"` region (it rendered as an `<h1>` before).

**PagerDots are controls when given `onChange`** (sos-flow §3.17: "dots tappable (`accessibilityLabel`
"Pane N")"; the hub's five dots call `goToPane(i)`). Each dot is then a `Tap` of the same 6×6 box —
`label` defaults to `Pane N`, `aria-selected` on the active one — with `hitSlop` 19 above and below and 3
to each side (44 tall; 12 of the 13 between centres, so neighbours' areas never meet); the row passes
other touches through (`box-none`). Without `onChange` it stays drawing only (`pointerEvents: none`).
Geometry unchanged: the replica's dots measure 6×6 at y 666, x 167.5 + 13n, 0.00 % on the frame.

## D383 — Reassess's previous level: dashed outline as an overlay, shown only when it differs
The frame draws `background:transparent; outline:1.5px dashed #F2F0EC; outline-offset:-1.5px` + an 8 ink
dot (design-system §7.22 missed the outline). Ported as an absolutely-positioned 1.5 dashed border over
the bar (same box as an inset outline) — not the bar's own border, because Chrome snaps border widths in
layout and that moved the dot 0.5 pt. Dash pattern matches the frame at t=8 (0 px). Shown only when
`previous !== value`, as `gen/mono-sos.js scale()` does.

## D384 — `/score` lives under `(app)` (URL unchanged)
`src/app/score.tsx` → `src/app/(app)/score.tsx` (+ its one relative `require` re-pointed), registered as a
`Tabs.Screen` so it draws the bar with Journey lit (D326, today-day §6). `router.push('/score')` (Today,
All) and the `/score` recipes still resolve — checked. Behaviour that comes with being a tab route, for
today-day to know: it is a tab switch now (no slide-in, no iOS back-swipe; the back chevron's
`router.back()` goes to the first tab, Today, per the navigator's default `backBehavior`); the screen stays
mounted between visits (its `useState` page / range / `now` persist); a deep link passes the `(app)`
guards and launch prompts like every tab; and the **old** Score layout's footer card is cut at 748 by the
scene end — the frames' Score Detail ends above 748, so the rebuild resolves it. (The old pages place
their cards at fixed tops, so sizing the pages to the shorter scene would not bring the card back; the old
sheet's 3-dot page indicator, at canvas 806, is cut off with it — paging by swipe still works.)

## D385 — `All` leaves the bar; its door is a long press on Today (mock / dev builds only)
The canvas draws five items and no drawer. `/all` stays registered (D328); in `FORCE_MOCK || __DEV__`
builds a long press on the Today tab pushes it (routes §5.4 proposed the Today avatar — that is today-day's
file; the tab gives the same pixel-free door now, and both can coexist). `SHOW_ALL_TAB` is kept, `false`.

## D386 — Loading and empty states
`LoadingView` = a mono `Screen` (ground + noise) with, after 300 ms, the bundle's own loading mark — Part B's
`Spinner` (Enlisting Aegis's dotted ring + arc) at 44 in `#9B968E` — rather than the platform activity
indicator no frame draws; `onBack`/`onClose` keep the nav row's way out; `bare` (no ground, for a wait
inside a painted screen); `spinner={false}` (ground only — routes §7's choice for Today). A `label` shows at once (as the old
`LoadingView` did) under a 44 box kept from the first frame, so it does not jump when the spinner lands.
The `Screen` keeps its light `StatusBar` (`status` prop, default true): its own ground is dark and so is
every mono screen, and a stack screen that sets nothing would inherit the screen under it. Two old paper
screens still nest it under a light header (milestones' safe-area view, journal's header) — a dark block
with light glyphs over paper until they are rebuilt; the noise there is anchored to the nested box.
`EmptyState` = optional caps (13/700 mute), optional title (22/700/28/−0.6 ink; `h1` → 26/33), body
15/400/24 `#9B968E`, centred, gap 8, 24 gutter, no illustration (the paper `tide` art is gone). Its 32
above and below is not in routes §8: it is the old `EmptyState`'s `paddingVertical: spacing.xxl` (32),
kept so callers' lists keep their spacing; `style` overrides it. `ui/Feedback.tsx` now re-exports
both, so every existing caller (17 sites) gets the new look with unchanged props. Copy stays the callers'.

## D387 — Web root document (`src/app/+html.tsx`)
Expo's default static document (viewport, `ScrollViewStyleReset`, `headNodes`/`bodyNodes`) plus
`html,body{background-color:#0D0D0D;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}`
and `theme-color #0D0D0D`. Deliberately **not** `color-scheme: dark` — it changes the browser's default
text/caret/control colours under RN-web's styles. Verified served on :8096; V3-Q1 still diffs 0.00 %.

## D388 — `src/lib/format.ts` rules
Number words: hyphenated compounds, British "and" in hundreds ("one hundred and five", "one thousand and
one" — the app's copy is British), `capital: true` for sentence-initial; `minutesWords` ("One minute",
"Twenty-two minutes"); `groupDigits` ("1,240"); `countOf` ("0 slips"); `roman` (≤ 0 prints digits). Day
parts (logs Q5 = slip Q3): the **moment's own hour** decides — same calendar day → `Today` / `Tonight`
from 18:00; previous day → `Yesterday` / `Last night` from 18:00; older or future → no word.
`dayPartDate` → `Tonight, Tue Jul 22` / `Sun Jul 20`; `dayPartTime` → `Tonight, 11:40 PM` /
`Jul 20, 9:05 PM` (`lower` for the Log/hub's `pm`; `withTime:false` → Lapse Done's `Last night`).
`joinLower` → `Late night, boredom` (keeps `I …` and initialisms like `TV`); `splitStored` reads the
`' · '` storage join. Dates are assembled by hand in en-US (`Sep`, never `Sept`; no Intl dependence);
`dayMonthYear` keeps Edit Profile's `14 Mar 2026`; `dateRange` → `Jul 14–20` / `Jun 30–Jul 6`. 89 checks:
`node scripts/overhaul/format-test.mjs`.

## D389 — `.overhaul/clock.js` (CRITIC G3)
An init script that replaces `Date` (constructor, `Date()`, `Date.now`; `instanceof Date` intact via
`Reflect.construct`) with one pinned to a moment from `window.__CLOCK` (set by a line concatenated above
it), else `?now=` on the route, else `sessionStorage['vici.clock']` (so a seed's reload keeps it).
Local date-time strings (`2025-07-22T23:40`) or epoch ms. While installed, the shared prototype's
`constructor` is the replacement and its `name`/`length` are `Date`/7, so `new Date().constructor === Date`
holds (it did not before). Frozen by default; `__CLOCK_TICK = true` /
`?clock=tick` runs it from the moment. `performance.now()`/rAF untouched. Verified: `/kit-lab?…&now=
2025-07-22T23:40` reads `Tue Jul 22 2025 23:40:00`; the concatenated `__CLOCK` + tick form advances 500 ms
in 500 ms.

## Evidence (kit lab, `/kit-lab?f=<stem>`, pxdiff t=24 unless noted)
| replica | whole frame | outside named regions | residual (not this part) |
| --- | --- | --- | --- |
| Today-Home (bar only) | 7.55 % | 0.00 % on 748–852 (also at t=6) | rest of the frame not built (today-day) |
| Log-Urges (bar only) | 4.56 % | 0.00 % on 748–852 | rest not built (logs) |
| Medallions, Week-I-Reset (bar only, extra) | — | 0.00 % on 748–852 (t=6) | rest not built |
| SOS-Strength | 0.67 % | 0.00 % | hero `thermometer` T458 ×0.731 (Part C) |
| SOS-Reassess | 1.41 % | 0.00 % (also t=8) | hero T506 ×1.062 (Part C) |
| Morning-Feeling | 5.87 % | 0.00 % | hero `sunrise` T506 (Part C) |
| Morning-Energy | 2.89 % | 0.00 % | hero `battery` T506 (Part C) |
| Urge-Hub-Score | 0.00 % (mean Δ 0.00) | — | the card's dot grid is now three rows of ten `flex: 1` dots, which lands where CSS's `repeat(10, 1fr)` does (flex-wrap at a computed width left 804 px of edge AA and wrapped nine-across at 375). Dots are the tappable form (`onChange`); tapping Pane 4 moves the white dot. |
Live app, bar band 748–852 vs the frame: `/today` 0.00 %, `/log` 0.00 %, `/milestones` 0.00 %, `/score`
0.00 % (the recipes' own seeds); `/library` 0.00 % vs Week I Reset with `logs-seed.js` — there is no
`/library` recipe, and `weeks-seed.js` opens the launch check-in prompt over it. Drive: Journey→`/milestones`, Library→`/library`,
Today→`/today`, Log→`/log-chooser`, SOS→`/urge`, long-press Today→`/all`. 375×667 and 430×932: bar, scales and
readings neither clip nor overlap.

## Part E — splits (D390–D394) — `splits`

Three mechanical file splits so two Phase 1 groups never edit one file (CRITIC §3.1.4). Every
statement was moved by a TypeScript-AST splitter, verbatim — its leading comments and any same-line
trailing comment travel with it — and a line-multiset check confirms nothing was lost (only the copies
named in D391 and the added `export` keywords differ). `npx tsc --noEmit -p .` is clean for the whole
project after the split. Pixel proof: D394.

The analysis docs (`sos-flow.md`, `sos-boards.md`, `slip.md`, `tail.md`, `auth-funnel.md`,
`paywall-reminders.md`) cite `urge/index.tsx:<line>`, `handover.tsx` and `v3.tsx` by line number; those
lines now live in the files below.

## D390 — Where everything went

### `src/components/urge/index.tsx` (3,600 lines) → five files, no import cycles

| file | owner (Phase 1) | holds |
| --- | --- | --- |
| `urge/flow.tsx` | sos-flow | `UrgeFlow` and the interrupt: `NOISE_DARK`, `UrgePlace`, `PLACES`, `MOVES`, the paper chrome (`PaperSheet`, `SheetClose`, `StepPager`, `SheetPrimary`, `SheetSkip`), `BlurredSolid`, `IntroArt`/`SkyDot`/`IntroPage`, `StrengthPage`, the pickers (`PickerRow` … `PickerGrid`, `PLACE_GLYPH`, `WherePage`, `FeelingPage`, `ReasonPage`), the three moves (`ScreenStepArt`, `MoveStepArt`, `LeaveStepArt`, `MovePage`), `REASSESS_BANDS`/`ReassessPage`, `AfterwardPage`, `DawnShaft`/`DonePage`, `FlowStep`, `FLOW`, `PLACE_BOARD`, `TRIGGER_BOARD`, `FEELING_BOARD`, `FEELING_ROTATION` |
| `urge/hub.tsx` | sos-flow | `UrgeHub` and 85A–85E: `NOISE_LIGHT`, every `HUB_*`/`hub*` helper, `HubClose`, `HubHead`, `HubPanel`, `HubNow`, `HubScore`, `HubStatRow`, `HubProof`, `HubSurfed`, `HubPledge` |
| `urge/stages.tsx` | sos-flow | the dark SOS stages (`SosStage`, `BreatheStage`, `TapStage`, `OddStage`, `WaveStage`, `SosSettingsSheet` and their parts), the SOS settings (`SosSettings`, `SOS_SETTINGS_KEY`, `DEFAULT_SOS_SETTINGS`), `SURF_SECONDS`, the stage order (`SosStageName`, `SOS_ORDER`), the breathing ocean (`UrgeWave` + helpers), the old kit's unused exports (tints, `Breathe`, `FadeIn`, `NightSky`, `Stars`, `TideArt`, `NightIllustration`, `TopChrome`, `BrightButton`, `JourneyPage`, `RelapseLineArt`, `BreathCue`), and the pieces flow and hub both read: the sheet palette (`SHEET_*`, `SOS_PAPER`), `SoftBlob`, `Hill` |
| `urge/boards.tsx` | sos-boards | `ResponsePage`, `SosSceneLayer`, `EllipticBox` (+ the copies in D391) |
| `urge/index.tsx` | — | re-exports only (D392) |

Import direction: `stages` imports no sibling; `boards` imports no sibling; `flow` imports `stages` and
`boards`; `hub` imports `stages`. `stages.tsx` is the bottom layer because the stages themselves use
`SHEET_INK` and `SoftBlob`, so those cannot live in `flow.tsx` without a `flow ⇄ stages` cycle (a cycle
works for render-time references but breaks the first module-level constant that reads a sibling's
export during evaluation). `SOS_ORDER` and `SosStageName` moved from the flow section into `stages.tsx`
because both `UrgeFlow` and the hub's Breathe pill step through them.

`src/app/urge.tsx`, `urge-hub.tsx`, `rough-first90.tsx` still import `UrgeFlow`/`UrgeHub` from
`@/components/urge` — unchanged.

### `src/components/onboarding/handover.tsx` → `handover.tsx` + `reminders.tsx`

* `onboarding/reminders.tsx` (paywall-reminders): `O3Reminders` (`41 · Reminders`), `O3DayZero`
  (`43 · Day 0`), `NotificationCard`, `laurelMark`, `WRAP` (+ copies, D391).
* `onboarding/handover.tsx` (tail): `O3LetterArrived`, `O3LetterRead` + `LetterMark`, `O3TheVow`,
  `O3MedallionEarned`, `PaperArrivalField`, and the private helpers. `WRAP`'s comment also explained
  `BALANCE`, which stays here, so that comment is restated above `BALANCE` (the only text added to a
  moved body). `src/app/letter.tsx` imports `O3LetterRead` from here — unchanged.

### `src/components/onboarding/v3.tsx` → `funnel.tsx` + `v3.tsx`

* `onboarding/funnel.tsx` (auth-funnel): `O3Shell`, `O3FunnelStep`, `O3AgeGate`, `O3_AGE_MIN`, the two
  registers (`Tone`, `O3Tone`, `useTone`), the field (`O3Field`, `o3Field`, `useO3Field`, `O3Paper`,
  `Ambient`), the voice primitives (`O3H`, `O3Sub`, `O3Eyebrow`, `O3Note`, `O3CTA`, `O3_MD_CTA_BOTTOM`,
  `O3Chip`, `O3Opt`, `O3Kind` — unused outside, but they read the `O3Tone` context created here, so
  they go with it), and every funnel-only helper (`FirstPrincipleArt`, `FunnelArtBlock`,
  `FunnelRowMark`, `FunnelGlyphMark`, `O3PagerDots`, …). The file keeps v3's original header.
* `onboarding/v3.tsx` (tail): `O3Reading` (+ `O3PaperCTA`, `CAMPAIGN_PAGE_LINES`), `buildWeekXiiLetter`,
  `windowFor`, `o3Roman` (unused anywhere; left with tail rather than guessed into the engine).
  It imports nothing from `funnel.tsx`.

### Importers updated

Only `src/app/(onboarding)/welcome.tsx` — its two import statements became four (`funnel`, `handover`,
`reminders`, `v3`); no other line of it changed. Nothing else in `src/` or `scripts/` imported a moved
name. `.vicifull/map.json` (the previous run's frame→file map, not this run's) still names
`handover.tsx`/`v3.tsx`/`urge/index.tsx` for 12 frames; it is history and was left alone.

## D391 — The other group's file is never imported; private helpers are copied

`boards.tsx` needs `PaperSheet`, `SheetClose`, `SoftBlob`, `BlurredSolid` and five `SHEET_*` colours,
which `flow.tsx`/`stages.tsx` (sos-flow) also use; `reminders.tsx` needs `Frame`, `Cta`, `Quiet`, `Y`
and the noise tile, which `handover.tsx` (tail) also uses. Importing them would make each file depend
on a file another group is rewriting in parallel — the first time sos-flow deleted its now-dead paper
chrome, or tail restyled its `Cta`, the other group's screen would break or change under it. So each
of the two files carries verbatim copies (≈140 lines in `boards.tsx`, ≈50 in `reminders.tsx`), named in
its header; they go when those screens move onto the mono kit, which is the plan for both. Every page
component is a distinct element type at its own slot in `UrgeFlow`/`welcome.tsx`, so two copies of
`PaperSheet` change no reconciliation (proved by D394's identical captures).

## D392 — `urge/index.tsx` keeps the old module's whole public surface

Only `UrgeFlow` and `UrgeHub` are imported from outside, but the old file exported thirty names. The
index re-exports all thirty explicitly (`UrgeFlow`, `UrgePlace` from `flow`; `UrgeHub` from `hub`; the
other twenty-seven from `stages`) so the module's surface is byte-for-byte the same list; newly exported
internals (`SoftBlob`, `SHEET_*`, `SOS_ORDER`, …) are deliberately **not** re-exported, so nothing
outside the kit starts depending on them. `handover.tsx` and `v3.tsx` do not re-export what left them
(CRITIC: "update imports everywhere") — a re-export would put the other group's names back in their file.

## D393 — No code was deleted or edited

Dead code the analysis docs list for deletion (`PaperSheet` … `PickerGrid`, `IntroArt`, the hub's
`HubClose`/`HubHead`/…, the unused kit exports, `o3Roman`, `O3H`/`O3Chip`/…) was moved, not deleted:
deleting is the owning group's call when it restyles, and a split that also deletes cannot be proved
behaviour-neutral by a diff. The only non-moved text is: the five new file headers, the rewritten
`v3.tsx`/`handover.tsx` headers, the `BALANCE` comment (D390), `export` on the sixteen `urge` declarations
a sibling now imports (none in the onboarding splits — nothing crosses `funnel`/`v3` or `reminders`/
`handover`), and two section banners in `stages.tsx` naming what flow and hub read from it.

## D394 — Proof: before/after captures, exact

Twenty captures across the four new urge files and both onboarding splits, each taken before and after
the split from the same seed and drive, compared with `pxdiff --t=0 --keep-chrome` (one channel off by
1/255 counts as a mismatch):

| capture | exercises | result |
| --- | --- | --- |
| `u-intro`, `u-strength`, `u-where` | flow (`IntroPage`, `StrengthPage`, `WherePage`) | 0.00 % |
| `u-locbed`, `u-challenge` | boards (`ResponsePage` via the flow) | 0.00 % |
| `u-done` (frozen clock) | flow → stages → `DonePage` (Surf Complete) | 0.00 % |
| `u-hub`, `u-hub2` (frozen clock) | hub (85A, 85B) | 0.00 % |
| `u-hubbreathe-f` (frozen clock + frozen animation time) | hub → stages (`BreatheStage`) | 0.00 % |
| `v-name`, `v-q1`, `v-q5`, `v-gate` | funnel (`O3Shell`, `O3FunnelStep` text/list/grid, `O3AgeGate`) | 0.00 % |
| `h-map` | v3 `O3Reading` inside funnel `O3Shell` | 0.00 % |
| `h-letter` | handover `O3LetterArrived` | 0.00 % |
| `h-rem`, `h-day0` | reminders `O3Reminders`, `O3DayZero` | 0.00 % |
| `h-letterroute` | `/letter?variant=week12` → handover `O3LetterRead` | 0.00 % |
| `h-reminders` | `/reminders` (the route PHASE0 names; it imports none of the moved code) | 0.00 % |

Method notes:
* Clock-dependent screens run under a frozen `Date` (an init script prepended to their seed), so the
  hub's session clock and "x days ago" cannot drift between runs.
* `u-hubbreathe` without frozen animation time differed by 10.8 % — every differing pixel inside the
  breathing orb (48,244 296×292), mean Δ 0.22: the orb scales on a Reanimated clock and two runs catch
  it at different phases. Freezing `performance.now()` and rAF timestamps makes two runs of the same
  code identical (verified 0.00 %), and the baseline for that pair was taken by putting the original
  `urge/index.tsx` back for one capture — confirmed by fetching Metro's `urge-hub` route chunk, which
  then listed only `src/components/urge/index.tsx` — and restoring the split straight after (md5
  checked).
* Expo's dev-tools rebuild badge (x 0–64, y 788–852) appears whenever any agent's edit triggers a
  rebuild; it is not the app's and is excluded with `--ignore=0,788,64,64`. On `u-intro` it was the
  only difference.

Re-run: `node .overhaul/splits-proof.mjs <prefix> [name,…]` from the repo root (one Chrome at a time;
it writes the frozen seeds itself), then
`node scripts/overhaul/pxdiff.mjs .overhaul/shots/splits/b-<name>.png .overhaul/shots/splits/a-<name>.png --t=0 --keep-chrome --ignore=0,788,64,64`.
The pairs and their strips are in `.overhaul/shots/splits/`. These are proof captures, not frames, so
they are recorded in that runner rather than in `.overhaul/recipes/` (the audit replays recipes against
design frames, and none of these has one).

## Curriculum decisions — Phase 0 Part F (D395–D399) — `curriculum`

Merged into DECISIONS.md by the orchestrator. Files: `scripts/overhaul/gen-curriculum.mjs` (new),
`scripts/overhaul/curriculum-legacy.json` (new, frozen input), `src/content/curriculum84.ts` (regenerated).

## D395 — `curriculum84.ts` is regenerated from the frames; the API keeps its shape
`node scripts/overhaul/gen-curriculum.mjs` (`--check` to verify, `--table` for the title table) reads:
the 12 Email-Login week pages (`Week-<R>-<Name>.html` + `-P2`: caps, name, blurb, `data-hero`, the seven
rows), the 84 readers' covers (`L<n>-Frame-1`: `Lesson <n>`, title, `data-hero`), each reader's first
`Part 1` page, and its two task pages (`Today’s task` + title + practice; practice + `Done when` card).
All 1,273 lesson frames are read. The run fails unless: every week page lists exactly its seven cover
titles in order; titles, practice arrays, "Done when" lines and first reading pieces equal
`gen/lessons-v3.json` (84/84 each); the task page's title equals the cover's (84/84); week
names/blurbs/romans equal the app's previous values (12/12 — unchanged); every hero id is one of the 53
`Lesson-Illustrations-v4` `data-hero` ids.

Every export and type the app imports is kept (`CURRICULUM_84`, `CURRICULUM_84_DAYS`, `lessonForDay`,
`weekFor`, `Curriculum84Week`, `Curriculum84Lesson`, `DailyTask`, `TaskBoard`, `TaskIntro`, `TaskFlow`,
`TaskOption`) with every field. Added: `CurriculumHeroId`, `Curriculum84Week.hero`,
`Curriculum84Lesson.hero`, `DailyTask.practice: string[]`, `DailyTask.doneWhen: string`.

The previous drop's two-board task (`task.title`, `secondTitle`, `intro`, `options`, `done`, `close`,
`board`, `intro2`, `flow`) and `titleSize` are read only by `/task/[day]` and `/lesson-card/[day]`, which
no frame in this drop draws and which become redirects (D324). They are kept byte-for-byte (deep-compared:
0 differences) from a one-time snapshot of the previous build, `scripts/overhaul/curriculum-legacy.json`
(`--freeze-legacy`, which refuses to run on an already regenerated file), and marked `@deprecated` in the
types. When lessons turns both routes into redirects, drop those fields from the generator and delete the
snapshot.

## D396 — `summary` keeps the previous build's one-line strings (lessons Q8, option 1)
No frame in this drop draws a one-line lesson summary (the old card is gone; covers carry only
`Lesson <n>` + title). Lessons Q8 offered two answers: keep the old summaries, or drop the field. Dropping
it would change the API. So `summary` is the previous build's string, unchanged (84/84 equal to
`refs/snapshots/pre-overhaul-full`, 34–83 characters), read from the frozen `curriculum-legacy.json`.
These were written for the previous lesson under each day, so some no longer describe the new title.
L2 is an example: "Day zero isn’t a loss…" now sits under "Remove easy access to porn". That is the trade
Q8 named. Its readers: `/search` (title + summary + week match), `/first-steps` (one line under each row),
`/lesson-card` (legacy, until it becomes a redirect), and `lib/curriculum.ts` `bodyMarkdown` (not displayed).

An earlier pass of this part set `summary` to the lesson's first reading piece (81–210 characters). No
spec asked for that, and on `/lesson-card` at 375×667 (D320) it ran under the `Start lesson` pill on 84 of
84 lessons, by up to 79pt. With the previous strings the count is back to the pre-overhaul figure: 1 of 84
(L32, by 10pt, the same before this run), measured in-page over all 84 against the pill's rect. At
393×852 and 430×932 the count is 0 of 84. The generator still reads the first reading piece and
cross-checks it against `lessons-v3` `sections[0]` (84/84), but only as a check. If the orchestrator later
wants the field on the new course's words, it is a one-line change in the generator (`l.legacy.summary` →
`l.firstPiece`), safe once `/lesson-card` is a redirect.

## D397 — Today/Night task card: the lesson's title over the previous drop's task sentence
Canvas contradiction (lessons §10.3): `Today Home Task` ("Today’s task: Prepare for tonight" / "Put the
device you use for porn out of reach before you sleep.") and `Night Action Reminder` ("Prepare for
tonight" / the same sentence) draw `task-src.json[1].summary`, the previous drop's task, not the new
reader's L1 practice. The frames win: `task.cardTitle` = the lesson title, `task.cardSummary` =
`Vici Overhaul/project/task-src.json` `summary`, apostrophes/quotes curled (equals the app's previous
`cardSummary` 84/84). The reader's own task is `task.practice` + `task.doneWhen`.
The frames draw this pair only on day 1, where the two strings agree. On the other 83 days the
sentence is the previous drop's task for that day, so it can describe a different task from the new
title. Example: L41 "Give the action a time and place" over "Write three simple rules for situations
that have caught you before and make one easier to follow." That follows CRITIC §3.1.5 / lessons §10.3
as ruled. If the orchestrator wants the card to match the reader, `cardSummary` could become the first
`practice` paragraph or `doneWhen`, a one-line change in the generator. Day 1 would then stop matching
both frames.

## D398 — `titleSize` (legacy) for the new titles
`/lesson-card` sets the title at `titleSize` with a 23/30 or 20/27 ramp. The previous card stepped down
only its one title longer than 27 characters. The same rule on the new titles: `length > 27 → 20`, else
23 — 48 of 84 step down. It only keeps the legacy card from colliding with its summary until the route
becomes a redirect; the new canvas sets every lesson title at one size (30/36 cover, 24/31 task).
Measured in-page over all 84: every title that wraps to two lines is at 20/27, so its line box ends
2pt past the summary's top (`top 396 + 54 = 450` vs `448`). This happens on 14 of 84 lessons at 393×852,
23 of 84 at 375×667 and 5 of 84 at 430×932. The glyphs do not touch (`/lesson-card/19`, `/64`). No
`titleSize` value can do better, because a two-line title at 23/30 would end at 452. The remaining 2pt
comes from the route's fixed `top`s, which go away with the redirect.

## D399 — Hero ids in the curriculum
`hero` (lesson: the cover's `data-hero`; week: the week page's `data-hero` — not its first lesson's cover,
e.g. Week II = `signpost`, L8 = `calendar`) is typed `CurriculumHeroId`, the union of the 38 ids the
curriculum uses. It is a subset of the 53 card ids, so it is assignable to `src/content/heroes.ts`'s id
type without importing a file another part generates concurrently. The cover ids agree with library.md
appendix A (84/84) and the week ids with library.md §1 (12/12).

## Old → new titles (L = day; cover hero)

| L | Wk | old title | new title | cover hero |
|---|---|---|---|---|
| 1 | I | Surviving the Night | Prepare for tonight | `nightPhone` |
| 2 | I | A New Start | Remove easy access to porn | `sunrise` |
| 3 | I | Get Outside | Choose where to go instead | `bench` |
| 4 | I | Fix Your Sleep | Prepare for sleep | `bed` |
| 5 | I | What Replaces Porn? | Have another activity ready | `books` |
| 6 | I | Isolation | Make time for contact | `twoCups` |
| 7 | I | One Week In | Review the first week | `cake` |
| 8 | II | More Than a Streak | Measure more than a streak | `calendar` |
| 9 | II | After a Relapse | Stop sooner after a slip | `sunrise` |
| 10 | II | The All-or-Nothing Trap | Use the hours that remain | `scale` |
| 11 | II | Progress Isn’t Linear | Try one change for a week | `chartUp` |
| 12 | II | Identity | Repeat one useful action | `idCard` |
| 13 | II | Values, Not Shame | Choose your own reason | `compass` |
| 14 | II | Keep Going | Return after a missed day | `signpost` |
| 15 | III | The Life of an Urge | What to do when an urge starts | `stopwatch` |
| 16 | III | What’s the Urge Really For? | Check what you need | `thermometer` |
| 17 | III | Move First | Close the screen and move | `sneaker` |
| 18 | III | Redirection | Prepare another activity | `signpost` |
| 19 | III | HALT | Check hunger, anger, loneliness, and tiredness | `kettle` |
| 20 | III | Urge Surfing | Notice an urge without acting on it | `lighthouse` |
| 21 | III | Masturbation | Make a separate choice about masturbation | `shower` |
| 22 | IV | The Reward System | Understand what starts the habit | `brain` |
| 23 | IV | The Control Center | Decide before the difficult hour | `brain` |
| 24 | IV | Hungry and Tired | Make room for food and sleep | `kettle` |
| 25 | IV | Angry and Lonely | Respond to anger and loneliness | `thunderCloud` |
| 26 | IV | The Pull of Novelty | Notice when searching keeps going | `tab` |
| 27 | IV | Change Your State | Try movement, breathing, or another room | `shower` |
| 28 | IV | Autopilot | Act earlier in the habit | `dominoes` |
| 29 | V | The Scale | Look at the benefit and cost | `scale` |
| 30 | V | The “Benefits” of Porn | Meet the need you can identify | `tab` |
| 31 | V | The Hidden Reward | Begin a task you are avoiding | `envelopeOpen` |
| 32 | V | The Short-Term Cost | Address one immediate cost | `clock` |
| 33 | V | The Long-Term Cost | Make time for what viewing displaced | `calendar` |
| 34 | V | Tipping the Scale | Make one change for tonight | `scale` |
| 35 | V | Repairing the Scale | Give an activity a place in the week | `scale` |
| 36 | VI | What is Willpower? | Prepare a simpler response when tired | `battery` |
| 37 | VI | Train Your Response | Practise the response | `sneaker` |
| 38 | VI | What Discipline Isn’t | Keep rules that serve a purpose | `halfMast` |
| 39 | VI | What Discipline Is | Practise the part that gets in the way | `compass` |
| 40 | VI | Thoughts and Feelings | Let a thought remain while you act | `thunderCloud` |
| 41 | VI | Choose Your Action | Give the action a time and place | `signpost` |
| 42 | VI | Damage Control | Plan for a difficult day | `umbrella` |
| 43 | VII | Relapse Isn’t the End | Learn from a slip | `halfMast` |
| 44 | VII | Learn From the Relapse | Take care and make a repair | `notebook` |
| 45 | VII | Don’t Punish Yourself | Adjust the plan for today | `mirror` |
| 46 | VII | Rough Days | Get support during a difficult period | `thunderCloud` |
| 47 | VII | When Life Gets Hard | Return to the task you postponed | `mountain` |
| 48 | VII | Face What You’re Avoiding | Begin the next part of the day | `door` |
| 49 | VII | Don’t Wait for Tomorrow | Take a step after a longer setback | `calendar` |
| 50 | VIII | Boredom | Give an activity time before switching | `clock` |
| 51 | VIII | Escaping Boredom | Choose what begins in an empty gap | `tab` |
| 52 | VIII | Learn to Be Bored | Try fifteen minutes without switching | `bench` |
| 53 | VIII | Screen Boundaries | Change one screen habit | `phoneTable` |
| 54 | VIII | Dopamine Detox | Try an hour away from one feed | `feedOff` |
| 55 | VIII | Wake Up With Purpose | Prepare the first hour after waking | `sunrise` |
| 56 | VIII | Meaning | Give time to something that matters | `compass` |
| 57 | IX | Why Relationships Matter | Arrange a shared activity | `twoCups` |
| 58 | IX | Loneliness | Choose contact that fits | `bench` |
| 59 | IX | Solitude | Choose how to spend time alone | `bench` |
| 60 | IX | What Porn Replaces | Separate desire from wanting company | `twoCups` |
| 61 | IX | Friendship | Follow up on a connection | `twoCups` |
| 62 | IX | Unhealthy Relationships | Set a safe limit on harmful contact | `thunderCloud` |
| 63 | IX | Healthy Relationships | Give a relationship attention | `twoCups` |
| 64 | X | Trauma | Choose support without revisiting painful events | `umbrella` |
| 65 | X | Your Environment | Change one difficult setting | `plant` |
| 66 | X | Self-Criticism | Describe a mistake without an insult | `mirror` |
| 67 | X | Self-Loathing | When you feel bad about yourself | `mirror` |
| 68 | X | Self-Compassion | Check your response to self-criticism | `plant` |
| 69 | X | Self-Trust | Keep one manageable commitment | `compass` |
| 70 | X | Self-Improvement | Simplify the plan | `chartUp` |
| 71 | XI | Know Yourself | Use what your notes show | `mirror` |
| 72 | XI | Amor Fati | Choose what you can do now | `umbrella` |
| 73 | XI | Memento Mori | Reserve time for what matters | `hourglass` |
| 74 | XI | Carpe Diem | Begin an activity you postponed | `sunrise` |
| 75 | XI | The Next 90 Days | Plan the next ninety days | `calendar` |
| 76 | XI | Peace of Mind | Give one activity your attention | `lighthouse` |
| 77 | XI | This Time Next Year | Schedule something you want to keep doing | `envelope` |
| 78 | XII | What Forever Means | Keep the reason and next action clear | `lighthouse` |
| 79 | XII | Twelve Weeks Ago | Compare the start with now | `calendar` |
| 80 | XII | What Changed in Your Brain | Prepare for a changed situation | `brain` |
| 81 | XII | Winning the Battle | Use the changes that helped | `flag` |
| 82 | XII | Lessons From Addiction Recovery | Check how to ask for help | `books` |
| 83 | XII | Saying Goodbye | Finish with an honest next step | `envelopeOpen` |
| 84 | XII | The Future | Save a short plan for after the course | `sunrise` |

## auth-funnel decisions — Vici Overhaul run, Phase 1 (D200–D209) — `auth-funnel`

Files: `src/app/(auth)/{_layout,sign-in,sign-up,splash,welcome-back}.tsx` (`_layout` unchanged),
`src/app/(onboarding)/_layout.tsx`, `src/app/index.tsx`, `src/components/auth/kit.tsx`,
`src/components/onboarding/funnel.tsx`, `src/content/onboardingFunnel.ts` (GENERATED) +
`scripts/overhaul/gen-funnel.mjs` (new fork),
`src/components/ui/Waterline.tsx`, unframed `src/app/(app)/lifemap.tsx`. Recipes:
`.overhaul/recipes/auth-funnel.json` (replaces `auth.json` and `funnel.json`, deleted). Scratch tools:
`.overhaul/af-sweep.mjs` (size sweep + contact sheet), `.overhaul/af-func.mjs` (drives every control).

## D200 — The questionnaire's data is regenerated from the overhaul frames
`node scripts/overhaul/gen-funnel.mjs` (fork of `scripts/vicifull/gen-funnel.mjs`) reads
`.overhaul/scenes/Email-Login.json` and writes, per step, only what a frame states for itself: `kind`
(`text` | `wheel` | `list` | `chips` | `statement`), the nav's inked `dashes` (`null` on Start — the frame
draws no dash row), the `stack` (top 136 / 140 / 451, gap 14 / 18 / 20, centred), `title`, `sub`,
`spacer`, the statement `body`, Goal confirmation's `card` as runs (`{text, bold}`, the trimmed scene's
space restored before the bold span), `placeholder`, the `wheel`'s drawn values, `options`,
`drawnSelected` (recipes/checks only, never read at runtime), the `hero` (`data-hero` id checked against
`heroes.ts`, top, scale), and the primary's label (`null` on the single-select screens). The run throws
on any stack child or option row it cannot read, on a missing title/options, and on a non-Start frame
with no dash row. The answer ids are unchanged (every later screen reads them). Copy is unchanged from
the previous drop's generated file (auth-funnel §1) — verified by the frames' text in the new file.
`backTop` stays on the type as a deprecated `60` because `welcome.tsx` (tail's) still reads it.
`FUNNEL_GLYPHS` (and its `FunnelGlyph`/`FunnelSvgKid` types) has no source in this drop; it was carried
as a frozen legacy block while `plan.tsx` imported it, and dropped once the tail group decoupled
`planSignals()` from it (grepped: no consumer left in `src/` or `scripts/overhaul/`).

## D201 — `O3Shell` is a pass-through; each funnel screen draws its own frame
The overhaul frames are two templates (question; statement = the kit's `HeroBoard`, 26/33 title, stack
451). `O3FunnelStep` and `O3AgeGate` render the whole frame (`Screen`, nav, content, primary) and read
`onBack` from the shell through context, so the dash count comes from the step's own data with no
publish-after-mount flash. `O3Shell` keeps every prop `welcome.tsx` passes (`progress`, `bar`, `lit`,
`paper`, `segments`, `backTop`) and ignores all but `onBack`; any other child (the tail's `reading`
step, which D324 removes) gets the ground, a back chevron and the previous shell's padded box. The shell
no longer imports `onboarding/art.tsx` (tail's), so tail can delete `CampaignMapField` & co. without
breaking this file. The previous engine's night field, sun, bloom, rule, "‹ Back" label, `O3H`/`O3Sub`/
`O3CTA`/`O3Chip`/…, the glyph grid, check rows, row marks, header drawings and First Principle's wave and
dots are deleted (nothing outside `funnel.tsx` imported them — grepped).

## D202 — The age wheel (bespoke; no kit primitive draws it)
Five rows at rest exactly as drawn (30/700 `#2E2E2E` lh 56 · 34/700 `#5A574F` lh 60 · rule 200×1.5 ink ·
72/700 ls −2 ink lh 100 · rule · 34 · 30), so the non-uniform pitch is reproduced; nothing animates.
The value steps under the finger — one year per 40 pt of vertical drag (RNGH `Pan`, `runOnJS`,
claims at ±4 pt, yields at ±10 pt sideways, as the kit `TimeWheel` does) — and a visible neighbour is a
button that steps to it (the click a mouse drag ends in is ignored for 250 ms). Range 13–99 (D331);
rows past either end are blank. `accessibilityRole="adjustable"`, label "Age", `aria-valuetext`,
increment/decrement. An untouched wheel answers: arriving on Age with no stored value stores "24", so
`welcome.tsx`'s gate and age-80 projection read the age shown.

## D203 — Name takes focus on arrival
The frame draws the focused, empty state (the 2×24 bar before the `#9B968E` placeholder — CRITIC C9;
the kit `TextField name` shows the bar only while focused). `autoFocus`; and because the keyboard then
covers the bottom primary on a device, the return key ("next") does what Continue does. Empty names are
still allowed (unchanged).

## D204 — Selection behaviour
Single-select screens (now including Gender, D324) show the ink fill and turn over 260 ms later (the
engine's own timer, unchanged). Multi-select screens use the kit `Chips` (`toggleChoice` = the old
`pick`, D350): "Nothing in particular" / "Nothing obvious" / "Nothing yet" exclusive, What it affects
capped at 3 (a fourth pick refused); the primary is the D321 disabled pill while nothing is chosen,
except What it affects after "Not really" (zero allowed, unchanged). Goal confirmation keeps its four
title/line readings; the card is drawn only for "Keep it, just without porn" (its runs come from the
frame).

## D205 — Small screens (D320) and native line breaks (D332)
Question screens: the stack lives in a `ScrollRegion` from the nav's bottom (100) to the primary's top
(106 off the edge; 0 with no primary), with the frame's stack top as its top padding — identical at 852
(0.00 %), scrolling at 375×667 where Q5 / Q17's chips would run under the pill. Heroes pass `controls`
(106 / 0) and drop out on a short phone (rule 1). Statement screens are `HeroBoard`s (rule 2 lift).
Age's wheel stays absolute — it ends at canvas 571, above the 667 phone's primary top (595). The
auth doors keep the frame's 852 of height and scroll: at 667 all four controls are on the first screen
and the footer and caption sit under them, never across them; at 932 they stay on the bottom edge as
drawn. Native has no `text-wrap: balance/pretty`: the twelve fixed question titles and Login's paragraph
whose greedy wrap at 393 differs from the canvas carry the canvas's `\n` (auth-funnel §3.8) — only at
≥ 393 wide and only when the copy is the frame's own (not Start's name, not Goal confirmation's
variants); web balances them itself.

## D206 — The doors and the splash
`AuthBoard` is the door's stack: laurel 104 at 150 (centred), title/paragraph at 284 (gap 12), controls
at 436 (gap 14: Apple ink pill with the 16×19 glyph, Google card pill with the 19 G, the "or" rule, the
email pill), the footer bottom 108 and the caption bottom 64. The footer's whole row is the control (the
frame puts the pointer on the bold run; six letters are not a finger target). A back chevron is drawn
only when the door was pushed (`router.canGoBack()` — from Name's Back or All), at the nav row's 60. An
SSO refusal (D330: 14/700 ink, lh 20) is centred in the frame's empty gap 672–726. Splash: the laurel at
`left: 50%, marginLeft: −60.5` (the frame's 136 is half a point left of the axis — measured: centring it
put it at 136.5 and cost 0.46 %), its top at 330/852 of the window, the wordmark 148 under it.

## D207 — The boards behind the doors (no frame)
Copy and behaviour unchanged. Address step: the door's laurel and a centred 26/33 title over Name's
field (`TextField name`, email keyboard, autofocus, a mute ✕ accessory while it holds text) and the
primary in flow under it, so the keyboard that opens with the board never covers it. Password, verify
and the sign-up form: Name's template (`AuthSurface` — nav chevron, left 26/33 title at 136, 15/22 mute
labels 8 above 60/18 fields, primary in flow, "Resend code" as an in-flow ghost link). Sign-up's gate:
the door's stack with its three pills (Apple/Google with their glyphs, email plain; no "or" — the gate
never had one) and the legal line as the caption (inset 24). The updates checkbox is the kit's 26
`CheckDisc` (done when on, pending when off), `role=checkbox` + `aria-checked`; the info card is Goal
confirmation's card (r18 `#1E1E1E`, padding 18/22, 15/23 sub) with its toggle as a 700 ink run. Legal:
12/700 ls 0.4 mute, underlines kept. The verify boards are unreachable on the mock build (mock auth never
asks for verification); they are the password board's pieces.

## D208 — The slow-boot board
`WaterlineScene` (unframed, unreachable in mock — D131) is the splash with the kit `Spinner` at 44 in
`#9B968E` (as `LoadingView` draws it, D386) and its label in the ghost line's 15/400 mute, bottom 96.

## D209 — Recipes and the walks other groups use
`.overhaul/recipes/auth-funnel.json` holds all 25 frames; every single-select AFTER neutralises the 260 ms
turn-over, and the AFTERs now tap the frames' drawn selections (Q3 "Yes, several times", Q3b "A few
days", Q5 four chips, Q6 + Tired, Q7 In bed only, Q21 "Quite a bit", What it affects Focus/Sleep/
Confidence, Q13 "A few days a week", Q16 "Keep it, just without porn", Q17 two chips).
`.overhaul/drives/funnel-walk.js` changed two rows: Age is `t('Continue')` (no input any more — the wheel
opens on 24), Gender is `t('Male')` alone (no Continue — it turns over). **The other groups' walks through
the funnel (`f-plan-walk.js`, `handover-walk.js`, `tail-walk.js`, `v-plan-walk.js`) need the same two
rows** — reported to the orchestrator; not edited here.

## Phase 2 amendments (no new numbers — the range D200–D209 is full)

* **D206 — the door's message keeps its distance and is seen.** The refusal a door says back (no frame draws
  one) sat centred in the 54 the frame leaves between the email pill (672) and the footer (726): the mock's
  two-line SSO refusal (and most of Clerk's) filled 40 of it, 7 from the pill and 7 from the footer, and a
  three-line one would have run across both. `AuthBoard` now measures the line and keeps 12 (the stack's gap)
  clear above and below it, growing the board by whatever the message needs past the gap — the footer and
  caption move down with the bottom edge, never under the text (a two-line refusal at 852: footer 736, caption
  bottom 54, nothing scrolls out of view). On a 667 phone that gap is below the fold, so the line answering a
  tap on Apple or Google landed off-screen; the board now scrolls it into view when it appears (React 19's
  `ref` prop through `ScrollRegion`'s spread). `AuthMessage` balances on web (`text-wrap: balance`, as the
  frames' centred copy does), so "…Use email / for now." no longer strands two words. The undisturbed doors are
  unchanged (Login, Welcome Back 0.00 %).
* **D205 — what stays as it is.** At 375 × 667 the doors' footer link ("Already have an account? Sign in" /
  "New here? Create an account") is below the fold, one short scroll away: lifting the board by the laurel's
  room (art top ≥ 108, rule 2) brings it 42 up and leaves it 1 pt short, and the remaining options — dropping
  the laurel, tightening the frame's gaps — are not in D320's list. The four controls are on the first screen.
  On 430 × 932 the question boards' spot illustrations keep the frame's top (T 506 / 582), so the 80 the taller
  phone adds falls between the art and the primary; every other group's question and check-in boards do the
  same (kit `Hero`), so it is reported to the orchestrator rather than changed here.
* **Carry-over.** `FUNNEL_GLYPHS` was already gone (D200; `gen-funnel.mjs` re-run as a dry run: byte-identical
  output, no consumer in `src/` or `scripts/overhaul/`). `.overhaul/settings-seed.js` stored `lifeMap.values`
  as bare strings; it — and the two seeds that copy its dataset, `settings-profile-seed.js` and
  `r-set-seed-pinned.js` — now store `{label, importance}[]` (Presence 5, Health 4, Honesty 3: Life Map's own
  save order), the shape `convex/schema.ts`, `src/lib/types.ts`, the funnel's `finish()` and Life Map's save
  write. The readers of `lifeMap.values`: `src/app/(app)/lifemap.tsx` (reads both shapes — kept, for rows a
  pre-schema mock store may hold) and nothing else (`letter.tsx` reads only `whyStatement`; Convex's
  `lifemap:update` writes, `lifemap:get` returns the row).
* **Back paths (D340).** Life Map ← All goes back to All (it is a hidden tab; history back). Name's Back
  replaces into the door when nothing is behind `/welcome` — the sign-up path ends in a replace — so the door
  draws no chevron there (it would be a dead control); `.overhaul/af-func.mjs` expected one and now checks the
  opposite.

## tail decisions — Vici Overhaul run, Phase 1 (D210–D219) — `tail`

Group `tail`: the plan sub-flow, the cost/line boards and the handover keepsakes — 19 frames,
`Enlisting Aegis` … `Medallion Received`. Files: `src/app/(onboarding)/welcome.tsx` (STEPS and the
tail cases), `src/components/onboarding/{tail,plan,handover,v3}.tsx`, `art.tsx` (deleted),
`src/content/onboardingTail.ts` + `scripts/overhaul/gen-tail.mjs`, `src/content/weekXiiLetter.ts` +
`scripts/overhaul/gen-letter.mjs`. Recipes: `.overhaul/recipes/tail.json` (plan.json and
handover.json migrated into it and deleted). Evidence: `.overhaul/shots/tail/a-<Frame>.strip.png`.

## D210 — The flow follows the canvas's badges: two line boards in, the campaign map out
`STEPS` runs `24 · Build plan` … `34 · What You Want Back` → `38 · A Letter Arrived` (FLOW.txt).
`change-line` (`O3ChangeTheLine`) is split into `line-nothing` (`32 · If Nothing Changes`, CTA `Next`)
and `line-plan` (`32A · With the Plan`, CTA `Continue` — the frame, not the generator's "Start with
today", CRITIC §5 Q11), one `LineBoard` drawn two ways, every chart value the frame's literal (Q7).
The three-page campaign map (`reading`, `O3Reading`) is removed (D324); with it go `CHROME`/`NOBAR`,
`O3PaperCTA`, `o3Roman` (unused) and the whole of `onboarding/art.tsx`, whose only importer was the
map (grepped). Every tail board is still whole-frame; the boards that draw a Back chevron (Step 1 …
What You Want Back) get `back` = `move(i, -1)`, so Back skips the conditional questions exactly as
the funnel does. Letter Received, Start Here, Where We'd Start, Medallion Received draw an empty nav
row and get no Back (the frames); the two arrivals lose their ✕ (Q10 — their buttons do what it did).

## D211 — Copy and API changes the frames make
CTAs: Start Here "I can do that" → `Continue`; What You Want Back "See the twelve weeks" →
`Continue`; Letter Received "Open it" → `Open`; The Vow "I sign it" → `Sign`; Medallion "Take it" →
`Continue`. The vow's date reads `Day 0, Jun 9` (`format.shortDate`, the day it is signed) and gains
"Signed on day 0". `O3MedallionEarned` takes `{eyebrow, title, body, next}` ("Veni" / "Your first
medallion." / "You started."). `O3OneBadDay` drops its `day` prop (the week strip is an
illustration). Starting Score's label is the frame's mixed-case "Your VICI rating" in caps style.
`O3LetterRead` keeps its props (`name, paragraphs, onKeep, next` + optional `onClose`) so the
letters group's `/letter?variant=week12` still calls it unchanged (verified: 0.00 % against Letter
Week XII through that route); a paragraph equal to the letter's own picks its 700 ink run back up
from `WEEK_XII_RUNS`. Name fallbacks: "Friend —" (salutation), "Week XII, from you" (eyebrow, Q14),
"Friend" (vow), "This is where we’d start." (no name).

## D212 — Generated content, forked to `scripts/overhaul/`
`gen-letter.mjs` reads `Letter-Week-XII.html` raw (the scene trims the spaces round the span) and
writes four paragraphs as runs plus the plain `WEEK_XII_LETTER` the journal entry and old callers
use. `gen-tail.mjs` reads the three cost frames' circles (filtered by radius — every frame also
carries the status bar's r 1.5 circle) and asserts the grids' geometry and that the designer's LCG
reproduces both large fields; it writes `COST_30` (relapse = filled `#0D0D0D`: 2, 6, 9, 13, 16, 20,
23, 27, 29), `COST_365` (25 across, 110), `AGE_80_FIELD` (33 × 71, 720 bright), `AGE_80_NEXT_SEED`
(the LCG state after the frame's 2,343 draws) and `SCORE_SAMPLE` (842). `AGE_80_STARS`,
`SCORE_RING`, `SCORE_CURVE` are retired with their boards. `NEXT_30_TIMES` / `YEAR_DAYS` still
count the true cells (9, 110), so the sentences and "About 6,100 days" (age 24) are unchanged.

## D213 — Drawings: transcribed, parametric where the board has data
Starting Score's gauge is built from the score (49 ticks at 180° − 3.75°·i, a tick at or under the
score r 108→128 at 3.4, above it r 119→128 at 2, endpoints to one decimal as the frame writes them;
marker r 6 at r 96) — at 842 it is the frame pixel for pixel (0.00 %, 3 px); the board shows the
app's own SCORE_BASE (D329), printed with `groupDigits` ("1,000"), the 0…1,000 scale pinned full
above 1,000. Cost Next 30 reproduces the frame's two near-identical cell styles and its unmatched
"Clean day" swatch literally (Q2). The 365 grid is 365 `<Circle>`s (a two-arc `<Path>` per class
left 282 px of edge anti-aliasing; circles diff 0 px). The age-80 field is two `<Path>`s (2,343
circles on native would be heavy): anchored at the window's (0, 0) under the status bar as the
canvas's is, and on a screen larger than 393 × 852 the extra rows/columns continue the LCG, so the
frame's dots never change. The veil is the frame's linear gradient (expo-linear-gradient). The Age-80
Back chevron is the frame's `#17160F` with its 36×40 target (Q3). SVG `<text>` at 600/700 is
`Lato_700Bold` with no `fontWeight` (the canvas loads no 600).

## D214 — What You Want Back reads `17 · What it affects` back
CRITIC §5 Q5: the pills are his picks in the picker's order; fewer than three are topped up from
the frame's trio (Focus, Sleep, Confidence) rather than replaced by it, so his own answer is never
dropped and the board always draws three (`wantBackPills`). `planSignals` no longer filters on the
funnel's legacy `FUNNEL_GLYPHS` but on the nine `11 · When` labels (`CHIP_LABEL`'s keys) — tail no
longer imports `FUNNEL_GLYPHS`, so auth-funnel may drop it.

## D215 — Small screens: lift into free ground first, then scroll
The hero boards (Where We'd Start, Start Here, Steps 1–2, Letter Received, Medallion, A Clean Day,
One Bad Day) are kit `HeroBoard`s and lift (D320 rule 2; the calendar and the week strip pass as
`art` with their `artTop`). The other boards lay their canvas inside `Band` (tail.tsx): a
`ScrollRegion` from the nav (100) to the controls whose inner box keeps canvas y. At 852 nothing
moves. Where the drawing would come within 16 of the primary, it rises by the deficit when there is
that much ground above its first line (never above 108) — Starting Score, Cost Next 365, both line
boards at 375 × 667 — else it stays and scrolls (Your Plan, Cost Next 30, What You Want Back);
`end` is measured where a line can wrap (Starting Score's last line, Want Back's stack). The Vow's
signature first rises into the gap under the vow (keeping 24) before the band acts, so at 667 the
name sits above `Sign`, not cut by it. Letter Week XII scrolls its column inside the card, with
170 pt of end room so the last paragraph clears the buttons; the fade and buttons stay fixed.
Checked at 375 × 667 (inset 20) and 430 × 932; nothing overflows horizontally, nothing lies under a
control unscrollably.

## D216 — Mock-only `/welcome?step=<id>` (+ `&hold=1`, `window.__ONB_ANSWERS`)
The tail sits 22 questions deep and the old walk took 45–70 s per capture and broke whenever a
funnel board's labels changed. In `EXPO_PUBLIC_FORCE_MOCK=1` builds only, `?step=<id>` opens that
board with the canvas's own man's answers (`SAMPLE_ANSWERS` — the walk's answers, which reproduce
every drawn state), `&hold=1` keeps Build plan up past its 6.8 s hand-over, and a capture seed may
set `window.__ONB_ANSWERS` to vary them (`.overhaul/tail-alt-seed.js`, `tail-unnamed-seed.js`).
Production builds ignore all three. The full walk (`.overhaul/drives/tail-walk.js`, rewritten for
the new labels, gender's auto-advance and the age wheel) still runs end to end (45 s to Medallion).

## D217 — Build plan holds the frame's state; the mark turns
The three rows hold the frame's done / now / to-come state for the whole 6.8 s, as the previous
drop's rows did (Q9 — no behaviour change); the kit `Spinner` turns (D366), so its 88 box is the
board's one moving pixel region (0.00 % outside it).

## D218 — Native line breaks (D332)
`.overhaul/f-tail-breaks.mjs` measures every fixed balance/pretty run in the group greedily at 345
against the frame's wrap: 28 of 32 break alike; four headings do not ("Keep your phone / out of bed
tonight.", "Leave the room / instead of lying there.", "Pick the room / you will not close.", "When
the house empties, / the door stays open."). On native those four carry the frame's `\n`
(`NATIVE_BREAKS`, plan.tsx); web balances the plain string. Dynamic copy (his name, the evidence
sentence) wraps greedily.

## D219 — Phase 2: small and wide phones, the full gauge, the letter's viewport
Found by looking at every tail board at 375 × 667, 390 × 844 and 430 × 932 (393 × 852 is unchanged:
every board diffs as before, 0.00–0.01 %, Starting Score 1.80 % by D329).
* **`Band` lifts as far as the ground allows, then scrolls the rest.** It used to lift only when the
  whole deficit fitted above the first line, else not at all — so at 667 Cost Next 30 left its key and
  closing line under `Next` behind a 96 pt scroll and What You Want Back cut "Not a perfect streak…"
  in half under `Continue`. Now the board rises by min(deficit, start − 108) and only the remainder
  scrolls (5 pt and 7 pt there). Your Plan, which had its own `ScrollRegion`, uses `Band` too (rises
  62, scrolls 22: the fifth card reads whole above `Continue`). Nothing moves at 852 or 844.
* **The year grid and the line chart span the column.** Drawn 345 wide at left 24, they ran 6 from the
  right edge at 375 and stopped 61 short of the 24 gutter at 430 (axis and grid visibly off-centre
  against the full-width primary). Their x's now scale by (window − 48) / 345 — the frame's own numbers
  at 393 (k = 1, still 0.00 %) — with radii, strokes, type, y's and the 128 tooltip unscaled, as Today's
  and the weekly report's charts do.
* **A full gauge draws no marker.** At 1,000 the r 6 marker lands at 0°, 2.5 right of and 4 under the
  last zero of "1,000", reading as "1,000." — and every account opens at 1,000 (D329). Short of full the
  marker is the frame's (842 still diffs 0.00 % with the sample score).
* **The letter's column ends at the primary's bottom edge.** It ran to the card's bottom (the screen
  edge), so on a short phone a line of the letter showed through the fade between `Continue` and
  `Keep this letter`. The scroller now stops 96 off the bottom (under the primary, never below it) and
  its end room is 58 + 16, so the last line still scrolls clear. `/letter?variant=week12` (same
  component) still diffs 0.00 % against Letter Week XII.
* **The vow wraps `pretty`.** The frame states no `text-wrap`; at 375 the greedy wrap left "day." alone
  on the fifth line. `pretty` breaks it exactly as drawn at 393 (0.00 %), keeps four lines at 430 and ends 375 on "next day."

## paywall-reminders decisions — Vici Overhaul run, Phase 1 (D220–D229) — `paywall-reminders`

Files: `src/components/onboarding/reminders.tsx`, `src/components/paywall/{PaywallFlow,OfferingPaywall,RevenueCatPaywall}.tsx`,
`src/app/{paywall,subscription,reminders,notify-primer}.tsx`, `src/app/routines/{morning-time,night-time}.tsx`,
`src/components/routines/kit.tsx` (`wheel.tsx` deleted), `src/lib/routines.ts`. Recipes:
`.overhaul/recipes/paywall-reminders.json` (replaces `paywall.json`). Controls: `node .overhaul/pr-func.mjs` (42 checks, all pass).
Sizes: `.overhaul/pr-sizes.sh <board>`.

## D220 — Paywall's way out (D323) and the Restore it displaces
The ✕ is the kit `CloseX` in the nav's right slot (svg at 353,71 — where Paywall Rescue draws its own, so the ✕
does not move between the two boards). Its label stays the old one: "Close" on `/paywall`, "Skip" inside the funnel
(the funnel drives tap it by that name). The frame's top-right "Restore" (316,70) sat in that slot, so it goes; the
footer's "Restore" becomes the control. The footer is drawn as **one** text run and an identical run in transparent
ink lies over it, whose "Restore" span is the `link`: splitting the visible run into spans re-kerned the centred line
(43 px at 152–172,788), and a nested `Text` with `accessibilityRole="button"` renders a `<button>` on RN-web whose UA
styles moved it further. Transparent ink, not `opacity: 0` (iOS drops alpha-0 views from VoiceOver); the painted run is
hidden from assistive tech. "Terms" has no destination in the app and stays words. Residual vs the frame: the 56×16
region at 316,72 (Restore → ✕), by design.

## D221 — A run is one string
`{price} on {renews}` (three JSX children → three DOM text nodes) re-kerned "$39.99 on 10 Jul 2027" by a fraction of a
point (111 px over threshold); `` {`${price} on ${renews}`} `` is exact. Every dynamic run in these files is a single
template string; the only nested runs are the price's inline cycle span (the frame's own `<span>`) and the footer
link's hit layer.

## D222 — Subscription states the frame does not draw
The frame draws a renewing yearly membership: "$39.99 a year. Renews 10 Jul 2027". The other states keep the app's own
words inside that sentence (CRITIC G12, D328): monthly `$12.99 a month. Renews …`; cancelled-but-active `… Runs until
…` (the old "runs until"); lifetime `$X · billed once` (unchanged); free `Free tools` / `Core tools included` and a
"Free" pill in the same `badge` kind, Change plan's value "Free", no next charge, no cancel line (as before). The
Change plan value is the plan name only ("Yearly"), as drawn — the old `Yearly · $39.99` detail is gone.
With no cancel line the band runs to the bottom edge (Phase 2): it used to stop 74 short over empty ground, which
on 375×667 cut the Billing rows above a blank strip.

## D223 — OfferingPaywall on the frame's board, any number of packages
It renders `PwBoard` (the frame's chrome, words and discs) with one `PwPlanCard` per package: two packages are the
frame exactly; one takes the full width; three or more wrap two to a row with a 24 row gap so the "Save" tab (−12
overhang) clears the card above; an odd last card takes its row; the band scrolls (verified with a throwaway harness,
`.overhaul/shots/pr/m-offering.png`). Per package: name → title; tagline = dashboard badge ?? "Best value" on the best
?? intro offer ?? "Cancel anytime" (a lifetime takes the store's description — nothing to cancel); bottom line =
`${perMonth} a month` (non-monthly), "Billed monthly" (monthly), else the store's description; "Save NN%" (title case)
on the best card. Metadata: `eyebrow` now replaces the lockup words (default "VICI Unlimited"); `benefits` (exactly 4)
are read with any `\n` folded to a space, since the new discs break nowhere by hand. Loading = mono `LoadingView` with a
✕ (was a paper `ActivityIndicator`). Not reachable in the mock build (no packages offline → `PaywallFlow`), so only the
layout was captured. `savingBadge`/`savingFor` now say "Save 74%".

## D224 — The drawn pay sheet is the kit sheet
No frame draws it; it stands in, offline only, for the store's purchase sheet. It was a light imitation of Apple's in
the system face with a blue side-button cue — a bare `System` family and hues the system no longer has. It is now the
kit `Sheet` (scrim, `#171717` panel, grabber, frame-level buttons): the Apple glyph + "Pay" as an `h1Sheet`, a
`RowGroup` of App / Trial / Account / Payment / Billing / Due today, the note line in 14/20 mute, the primary "Confirm
with Side Button" (the string the drives tap) and a "Cancel" ghost; the scrim and a downward drag cancel too. Panel top
is computed from its rows so the content ends 24 above the pill (229 with the trial row, 284 without).

## D225 — `/reminders` and `/notify-primer` are Reminders Setup's board
Both show the same two notifications the frame draws, so both render `ReminderBoard` (bell at 90, words at 320, notes,
pill) with their own nav and words. `/reminders`: kit back chevron, "Two reminders a day." / "Timed to your risky
window…" (D328), pill alone at bottom 48 (it has Back; no "Not now" added). `/notify-primer`: its ✕ and its progress
(the old 9-segment strip with 8 filled → kit `NavDashes` step 8 of 9), the same words, "Not now"; the notes take the
frame's words — the "10:41 PM" / "wave tool" pair it still carried was retired by D099 — and the "Discreet by default."
promise follows the notes in 14/20 mute with the lock glyph dropped (no frame draws a lock, CRITIC C7). To keep that
line clear of the pill at 852 the primer takes 18 from the space above the notes (`notesGap` 24). Behaviour unchanged
(primer: all three controls close; `/reminders`: writes `morningCheckin`/`riskTimeSupport`, goes back).

## D226 — Short phones, board by board (D320)
Paywall, Rescue, Confirmed, Manage Subscription, Reminders Setup (+ the two routes above) and the check-in-time boards
lay their stack **in flow** inside a `ScrollRegion` from the nav row's foot (100) to the controls, with the frame's
offsets as padding/margins — identical at 393×852, scrolling instead of meeting the pill at 375×667 (Paywall's discs,
Reminders' second note, Subscription's Billing group and the check-in days scroll; Rescue and Confirmed fit). The bell
scrolls with the words (it sits above them). Day 0 is a hero board: hero + both stacks rise together by the deficit
(44 at 375×667), never past the art's top at 108; past that the art is dropped. Checked at 375×667 and 430×932.

## D227 — Copy that changed with the frames
Rescue: CTA "Start free trial" (fixed); the title's day word through `numberWords` ("three"; a 7-day offer says
"seven", was "7"); rows keep `Day ${n−1}` / `Day ${n}` from the offer. Confirmed: `We’re in, Sam.` / `Let’s …` with
curly apostrophes (the "105 uses U+0027" note is obsolete), default `confirmLabel` "Begin" (was "Begin Day I"), the
charge date from `shortDate`, and "Jul 24 —" bound with no-break spaces so a wider phone never splits the date or
opens a line on the dash (no change at 393: the frame breaks before "Jul"). Reminders card 1 body `where’s` (U+2019).
Paywall: "VICI Unlimited", "Save 74%", taglines "Best value"/"Cancel anytime", new bottom line "Billed monthly", feature
labels without `\n`.

## D228 — `O3DayZero` takes the lesson either way
`welcome.tsx` (tail's) passes `lesson="Lesson 1 · Prepare for tonight"` from `lessonForDay(1)`; the card's two runs
are that string split at the middot. `number` / `title` props say the same thing directly, for when tail wants them.
No change to `welcome.tsx` was needed.

## D229 — The check-in time boards on the kit
`RoutineShell`/`RoutineBack`/`RoutineCTA`/`CheckinPicker` and `routines/wheel.tsx` are replaced by one
`CheckinTimeBoard` on `NavBar` + kit `TimeWheel` + `DayToggles` + `PrimaryButton` (the Phase 0 lab replica, 0.00 %);
`wheel.tsx` is deleted (its only importer was the old kit). `?from=settings` keeps its navigation (Save/Back → Settings)
but loses the "Settings" back word and the reassurance line — `Settings Check-in Time` is now byte-identical to
`Nightly Check-in Time`. The questions balance after "the" on web; native carries `\n` there (D332).
`DEFAULT_ROUTINES.morning` is 8:00 AM (D324) — Settings' Morning row reads it too. D120/D154's period/hour excuses are
obsolete: both frames draw a real two-row meridiem.

## Verification (393×852, Lato loaded, strips read)

| frame | route | pxdiff (t=24) | residual |
| --- | --- | --- | --- |
| Reminders Setup | `/welcome?step=reminders` | 0.00 % (0 px) | — |
| Paywall | `/paywall` | 0.11 % (1,312 px) | 316,72 56×16 — Restore → ✕ (D220/D323) |
| Day Zero | `/welcome?step=day-zero` | 0.00 % (0 px) | — |
| Paywall Rescue | `/paywall` + Close | 0.00 % (1 px) | — |
| Paywall Confirmed | `/paywall` + drive | 0.00 % (15 px) | two 4-pt spots on the 132 disc's antialiased rim (152,380 / 236,380) |
| Manage Subscription | `/subscription` | 0.00 % (0 px) | — |
| Morning Check-in Time | `/routines/morning-time` | 0.00 % (0 px) | — |
| Nightly Check-in Time | `/routines/night-time` | 0.00 % (0 px) | — |
| Settings Check-in Time | `/routines/night-time?from=settings` | 0.00 % (0 px) | — |

## Phase 2 — review (393×852 audit, the three sweep sizes, unframed screens)

Fresh audit (`audit-fast.mjs --group=paywall-reminders`) and sweeps (`size-sweep.mjs --size=… --scroll`): every frame
CLEAN, every sweep row `ok`, every strip and size PNG read. Unframed screens and undrawn states at 393×852, 375×667,
390×844 and 430×932: `node .overhaul/pr-unframed.mjs` (captures + `.overhaul/pr-row.mjs` rows in
`.overhaul/shots/pr/unframed/`). Controls and back paths under D340: `node .overhaul/pr-func.mjs` — all PASS, incl.
Settings → Subscription / check-in boards → Back/Save → Settings, All → Reminders / primer / time / subscription /
paywall → All, Locked → Unlock → ✕ ✕ → Locked.

| frame | px | residual |
| --- | --- | --- |
| Reminders Setup | 0.00 % | — |
| Paywall | 0.105 % | 316,72 56×16 — Restore → ✕ (D220/D323) |
| Day Zero | 0.00 % | — |
| Paywall Rescue | 0.00 % | — |
| Paywall Confirmed | 0.001 % | 11 px on the 132 disc's antialiased rim (152,380 / 236,380), ≤ 40/255; the kit `CheckDisc` is built as the frame's div |
| Manage Subscription | 0.00 % | — |
| Morning / Nightly / Settings Check-in Time | 0.00 % | (the day-disc specks of the earlier audit were gone on re-run) |

Short phones (375×667) behave per D320/D226 and are not defects: Reminders' first note, Paywall's discs, the check-in
boards' day toggles and Subscription's Billing rows sit under the band's foot until scrolled; the `.end` captures
show each whole above its control. At 430 Paywall's "Weekly insights" fits one line while "Progress tracking" wraps —
the frame's no-`text-wrap` columns doing what the canvas CSS does at that width. A sweep capture once showed the
paywall lockup without its laurel (the `<img>` not yet decoded); the re-run and `pr-unframed.mjs` (which waits for
images) show it at every size.

## today — decisions (D230–D234), Vici Overhaul Phase 1 — `today`

Group: Today Home, Today Home II, Today Home Task, Today Home III, Score Detail, Score Detail Moves, Score
Detail Ranks, plus the unframed `/journal`, `/journal-new`, `/affirmation`. Files: `src/app/(app)/today.tsx`,
`src/app/(app)/score.tsx`, `src/lib/score.ts` (additive), `src/app/(app)/journal.tsx`, `src/app/journal-new.tsx`,
`src/app/affirmation.tsx`; `src/components/today/kit.tsx` deleted (nothing imported it after the rewrite).
Evidence: `.overhaul/recipes/today.json` (seven frames; Today Home III and Score Detail Ranks 0.00 %, the rest
named residuals), captures and strips in `.overhaul/shots/today/`, seeds from `.overhaul/f-today-clockseeds.mjs`,
replay `node .overhaul/r-today-p1.mjs`.

## D230 — Today is the frames' header and strip over a three-page pager; the chart is the account's own month
The four Today frames share the header (64) and the Sunday-first week strip (136–199) pixel for pixel and differ
only in the band 200 → 748, so the screen keeps its vertical pager there: page one Today Home, page two Today Home
II / Task, page three Today Home III, each 548 tall at 852 (the band), children in canvas y less 200. Every page
fills the viewport and grows past it only when its own content needs more: each page measures where its content
ends (494 / 503 / 518 as drawn) and is `max(viewport, end + 20)` tall. The pager always snaps page to page — on
web through CSS scroll snap (`pagingEnabled`), which lets an oversized page scroll within itself, natively through
`snapToOffsets` (each page's top, plus its foot when it is taller than the viewport). So 390 × 844 (viewport 540),
a real 393 × 852 with its 59 inset (543) and 844 with 47 (547) page exactly as 852 does; a 667 phone (397) snaps
to each page's top and foot; a pledge that wraps to three lines makes page three 586 at 393 and the Tonight card
stays reachable (D320; checked at 375 × 667, 390 × 844, 393 × 847, 393 × 852, 430 × 932). The earlier rule — snap
only when the viewport is ≥ 548, else scroll freely — dropped paging on the commonest phones and clipped a long
pledge's Tonight card at 393 (verifier). The old mark row, night-sky score card, 30-dot strip, paper lesson/task/pledge cards
and the pinned urge bar are gone (D324).

The thirty-day chart plots the account's own last thirty days on the frame's band: x steps `(W − 64)/29` to one
decimal (the frame's 11.3 … 329), the lowest day at y 210.6 and the highest 172.7 above it, straight segments,
the frame's rules, fill and end ring. A younger account is padded at the front with its first day; a flat series
lies on the floor (OQ-T3). The frame's own thirty values are drawn, not data — nine falling days in thirty would
take nine slips on `SCORE_WEIGHTS` and contradict its own header and Moves — so the line is Today Home's one
residual (1.89 %). `scoreHistory` / `monthLedger` moved out of `score.tsx` into `src/lib/score.ts` (+ `lastDays`,
`scoreDayKey`, `LEDGER_WINDOW`), additive; nothing else's API changed.

Phase 2 — the foot never slices a block. On a 667 phone every page is taller than its 397 viewport, and the plain
foot (`top + h − viewport`) came to rest 7 pt above the score's baseline on page one (the comma and the 2's tail hung
under the strip's discs) and 37–38 pt above the art's floor on pages two and three (the phone's and the glass's stubs,
a band of hills). Each page now names the blocks its foot may not cut — page one "Recovery score", the number (to the
chart's top at 334, since the comma hangs below its 56 line box) and the chart's ink (its high point's ring to its
labels); pages two and three their hero's crop box — and where the foot would fall inside one, it rests at that
block's end and the page grows by the difference (at 375 × 667 the pages are 531 / 587 / 577: page one +17, page
three +39, page two its hero box's end + 397). Nothing changes where a page fits its viewport (393 × 852, 390 × 844,
430 × 932), nor where the foot already falls between blocks (day 58's six-line sentence at 393: the foot lands just
above the hero's box and the art stays whole). The size-sweep recipes now scroll to each page's own `offsetTop`
instead of multiples of 548, so a short phone's capture shows the page's top, as the pager rests there.

## D231 — The header, the strip and this morning's chips
The flame pill counts the account's day (OQ-T1: the frame's 41 is the seed's day; a streak stays opt-in,
invariant #1) — the old "Day 41" heading moved into it. The avatar is the frame's outline ring + glyph and opens
Settings, as the person glyph did (no photo pipeline exists, OQ-T8). The greeting follows `checkinPartNow()`.

Strip (Sunday-first, CRITIC C16): a past day is **held** (ink disc + check) unless a slip landed on it or it is
before the account; today is the **ink ring** with its date until the night check-in has filed the day (today's
row carries `emotions`/`reasons` — what Night 1–4 and `/checkin` write), then held (Today Home III); a future,
slipped or pre-account day is the line ring with a muted date (OQ-T2).

Chips: mood word `MOOD_WORD` (Heavy · Low · Fine · Good · Clear, the app's own) with a swatch a rung lighter than
the check-in's tone disc — Today Home pairs mood 3 "Fine" with `#BAB5AD` while Morning Feeling draws mood 3
`#8A857D`, so the chip takes `toneRamp[i + 1]` (the top two rungs share the ink) and the darkest rung stays
visible on the `#1E1E1E` chip (OQ-T4b). Energy reads `${ENERGY_WORD} energy` with the bolt and is left out when
the row has no energy. Before this morning's check-in the row is one chip "Morning check-in" (the cover's own
words) with an empty ringed disc. Every chip opens `/day/morning`, as the old section row did. Today's delta pill
is `buildScore`'s own (OQ-T4), hidden at 0, arrow turned over when negative (the kit's `down`).

## D232 — The task: two registers, one done mark, the lesson where it came from
Generic register ("Today’s task", 20/27) for a hand-named action or a fallback step; lesson register
("Today’s task: <lesson title>", 17/24) when a lesson set the task. Source precedence is unchanged (named
`dailyAction` → the day's lesson → `DAY_STEPS`), with one refinement: the night check-in now names tomorrow's
action *from the day's lesson* (D236), so a named action that is a lesson's `cardSummary` keeps that lesson's
register, hero and task page. Without it, every Today after a night check-in would print a lesson's sentence
under the generic label with no way into its lesson. `DAY_STEPS[0]` takes the frame's words ("hard to reach",
was "difficult to access"); each step carries a hero (phone → nightPhone, water → twoCups, outside → bench,
note → notebook, bed → bed — not openDoor: cropped at its s 0.79 its floor line stops 11 short of both edges at
393; bench, bed, nightPhone, twoCups and notebook fill or need not fill the crop at 375–430); an unmatched named action draws the notebook.

The 52 disc is the done mark in both registers (`dailyActionDone` on today's row — the morning asks after it;
checked: tap → true in storage, tap → false). The sentence opens a task page whenever the course has one: the
lesson that set the task, else the day's lesson (`/lesson/day/<n>?page=task`, D324 — the old card opened
`/task/<day>` for any task on a lesson day, generic register included). Only past the course, with no page to
open, does the sentence toggle the mark, as the old card did there (checked: Today Home II's seed → /lesson/day/41
?page=task, row unchanged; day 88 → stays, `dailyActionDone` true). Phase 2: the two registers write the same way. The disc
(and, past the course, the sentence) writes `dailyActionDone` and — when the row names no action yet (no night
check-in) — `dailyAction` = the sentence it sits beside, as the old task page's "Mark as done" wrote both. Without the
name, the next morning's Task Check fell back to `dayAction()` and asked after a sentence Today never showed (checked:
day 41 with nothing named → tick → row `{dailyAction: L41's sentence, dailyActionDone: true}`; the next morning asks
"Yesterday: Write one cue and action for a decision you keep postponing."; a named action is never overwritten;
register, hero and task page are unchanged since a lesson's own sentence keeps its lesson). The lesson tile pushes
`/lesson/day/<n>` directly; only past the course does it open `/lessons-browser` (a real list, not a redirect — no
single lesson is the day's there). Tiles: the day's lesson, numbered as the
course numbers it (OQ-T6 → CRITIC §5), opens `/lesson/day/<n>` (past the course: "Week I / Start the first
lesson" → `/lessons-browser`, the old copy and door); "Ride it out / Urge surfing" opens `/urge-hub` (the old urge
bar's door). The frames' "Lesson 5 / Naming your triggers" is the D132 mock — it is not a lesson in the new 84 —
and is Today Home II / Task's only residual (0.42 %). Rows on pages two and three are columns with the frame's
band as a minimum, so a sentence or pledge that wraps further on a 375 phone pushes the next block down instead
of overlapping it; at 393 they land exactly.

## D233 — The pledge rings, and the three unframed screens
Today III's rings have no drawn targets (OQ-T5): **+** opens the journal editor tagged Pledge
(`/journal-new?tag=Pledge` — the newest Pledge entry is the standing pledge Today and the morning stand on;
checked: saving "Phone stays out of the bedroom" puts it on page three), **☆** opens Past pledges (the old card's
door), **share** shares the line (`Share.share`; checked on web through `navigator.share`). No frame draws the
block before any pledge: the pledge's line holds the app's own "Write a pledge" (the All drawer's words) in the
22/700/31 register in mute `#9B968E`, tappable into the same editor as +, with the rings under it and share dimmed
(D321) — an empty 31-pt line under the caps read as missing content (verifier). The name is the first word of `displayName`, 700
italic (`PledgeCard plain`).

`/journal` (Past pledges): the title-head idiom — back at 60, 32/700 title at 108, entries as r24 `#1E1E1E`
cards (caps "Today · 7:12 AM" + tag, the line in 17/700 ink), the page scrolling under the fixed nav; empty is
its existing one line. `/journal-new`: nav row (back = Cancel, the time centred, Save), the tags as when-chips in one
sideways-scrolling row that bleeds to the screen edges (a `?tag=` or stored tag the three chips lack — Pledge,
Affirmation — is offered first and stays offered after another chip is picked; four chips no longer wrap "Lesson"
alone onto a second line at 375 and 393), title in the sheet field, body in the note field;
the B / I / U toolbar formatted nothing and is gone. `/affirmation`: the Change Pledge Sheet's shell (kit `Sheet`
at 120 over bare ground, h1 + line + card field, pill at 96 over the ghost at 60) with the old copy in both modes;
scrim / drag / Escape close it. Checked: Different prompt cycles; Write my own prompt → Use this prompt stores
`tideline.affirmation.prompt` and returns; Save today's line writes the Affirmation entry and closes.

## D234 — Score Detail: one header, three pages, the account's own numbers
Header per frame (back · "Months" pill · caps · 60/700 number · `Navigator II` range pill), a horizontal pager
under it from 288 with no dots (OQ-S3), each page scrolling vertically only when its content does not fit (Moves
on a 667 phone). "Months" opens the kit sheet with Months / Year (D333; a11y "Three months" / "One year", the old
labels); the pill reads the current one. Months = the three calendar months to today, Year = the twelve; month
labels at 40 / W/2 − 0.5 / W − 41 (current in ink), insight "+N points this quarter|year" over "May – July".

The chart is the account's history sampled weekly (monthly for the year), drawn as a monotone cubic (no overshoot
under the floor where a flat run turns into a rise), today at x W − 21 and a damped tail to the edge; the axis is
the window's floor to the next 100 and the smallest of 100/200/400/500/1000… that clears the top, which gives the
frame's own 1,000 / 1,400 for the 1,240 account. Days before the account read its first day. The frame's curve is
drawn (its ring at y 80 reads ≈ 1,343 under a 1,240 header — OQ-S2), so the curve and the +90 are Score Detail's
residual (1.77 %).

Moves: `monthLedger` on the same weights; one slip reads `Slip on Jul 8` (was `Slip · Jul 8`), more `N slips`;
bars are `round(|v| / max · 100) %` (ink, an ink ring for a loss), net under the rule. D134 still holds — the
frame's ledger is a 17-day account whose header reads 1,086 Deckhand I; seeded (`today-ledger-seed.js`) the five
rows and the net are pixel-identical, so the 1,240 capture's 0.75 % is the values only. Ranks: highest first,
todo ring + dashed `#5A574F` rail (CSS dashed border on web, an SVG line natively), here = ink disc + dot +
solid rail + 900 name + "You’re here. N to go" (just "You’re here." at the top rank), done = ink disc + check —
0.00 %. The old night header, light sheet, rank bar, value badge, insight cards and `paceLine()` are gone.

## day — decisions (D235–D239), Vici Overhaul Phase 1 — `day`

Group: the seventeen check-in frames (Morning Check-in Cover … Night 4 Closed) at `/day/morning` and
`/day/night`, plus the unframed `/checkin` (and the `MoodLogger` modal it shares). Files:
`src/app/day/morning.tsx`, `src/app/day/night.tsx`, `src/app/checkin.tsx`, `src/components/MoodLogger.tsx`,
`src/components/day/board.tsx` (new — the pieces both flows share), `src/components/day/kit.tsx` (cut to
`RerollGlyph`, which `affirmation.tsx` imports, and the day-action lists). Evidence: `.overhaul/recipes/day.json`
(17 frames: 14 at 0.00 % pxdiff t=24, the other three named below), captures and strips in
`.overhaul/shots/day/`, drives `.overhaul/drives/day-{morning,night}-exercise.js`.

## D235 — Every step is the kit's board; the ✕ on the two closing boards files the day
The old paper shell (`DayShell`, the dot rail, `MorningSky`/`NightSky`, `LedgerMark`/`JournalMark`,
`LedgerRow` plates, `MoodDial`, the paper `PledgeCard` with Snell Roundhand, `ChangePledgeSheet`,
`ActionCard`/`NightActionArt`, `DayBadge`, `CheckinCover`'s painted sky) is gone. The covers and Night 4
Closed are `HeroBoard`; every step is `Screen` + `NavBar` (back · `NavDashes {step, total: 5|6}` · ✕) +
the kit control (`Grid2`, `CheckRows`, `ToneScale`, `EnergyBars` + `ScaleReading`, `PledgeCard sign`,
`TextField bare`, `Sheet` + `TextField card`) + a decorative `Hero` carrying `controls` (D320 rule 1: at
375 × 667 the T 506/458 heroes drop out; covers and Closed lift with `HeroBoard`). Every step now draws
Back, the dashes and ✕ (the old night flow's Back-less Reflection/Record and rail-less Action are gone, as
the frames draw them). D091/D094/D096 are moot.

The frames add the ✕ to Morning 5 Done and Night 4 Closed, where the app had none. On every other step the
✕ leaves without saving, as it always did (checked: closing mid-flow writes no row and leaves yesterday's
`dailyActionDone` untouched). On the two closing boards the day is already complete, so the ✕ runs the same
`finish()` as Done — leaving there must not throw the check-in away.

## D236 — Morning: an answer before the round next; the signature line signs
Morning Task Check's two glyph pills that advanced on tap become the frame's `Grid2` (Yes / Not yet, radio)
and the `NextFab`. Nothing is chosen on arrival (CRITIC §5: a default "Yes" would write a completion the user
never claimed); the fab is dimmed (D321) until a choice. Yes / Not yet write `dailyActionDone` true / false
on **yesterday's** row at `finish()`, as No / Yes did. The old pledge plate's clear-× is not drawn (OQ-M4):
the signature line itself is the control — it signs ("Sign here") and un-signs ("Signed by Jerry"); the
primary still signs first and confirms second. The Change Pledge Sheet opens on the pledge as it stands
each time; "Sign the new pledge" stands the draft in and un-signs, "Keep current pledge" / scrim / drag
closes. Night Action's title is `lessonForDay(day).task.cardTitle` (= the new lesson title, "Prepare for
tonight" on day 1) over `cardSummary`; past the course it falls back to "Tonight" + `nightAction(day)`.

## D237 — The record rows: the frames' words, the kit's empty disc for what the day did not earn
`0 relapses` → `countOf(n, 'slip')` ("0 slips" / "1 slip"). Rows the day did not earn keep the app's own
copy (No pledge signed · No urges logged · 1 slip · No lesson yesterday; at night "… today") on
`CheckRow done={false}` — the kit's bare ring (D355, OQ-M2). The score row prints a minus for a net loss
(`−14 → 1,326`; the old `+${gained}` printed `+-14`). D097 still holds and is now provable: with the current
`SCORE_WEIGHTS` yesterday's gain under the frame's other four rows (clean, a check-in, one urge ridden, a
lesson) is 4 + 2 + 2 + 3 = 11, so the frame's `+12 → 1,240` cannot be seeded without contradicting a
row; day-seed prints `+11 → 1,064` — Morning 1 Yesterday's only residual (0.08 %, the value's glyphs).
`.overhaul/day-seed-negatives.js` reaches every negative (and Night Action's no-lesson fallback, day 91).

## D238 — Reasons store `Health`; old rows read as `Health`
Checkin Reasons draws `Health`; it is also the stored value (D324). `MoodLogger` exports `REASONS`,
`EMOTIONS` and `normalizeReasons()` (maps `Health / wellbeing` → `Health`, de-duplicated); `/checkin` seeds
its picks through it (checked: a stored `Health / wellbeing` opens selected as Health and saves as Health).
Other readers of `reasons[]` (Log check-ins, weekly report — the logs group) should map through
`normalizeReasons` when they display stored rows.

## D239 — `/checkin` (unframed) and the residuals that stay
`/checkin` (and the `MoodLogger` modal, which nothing mounts today) is the night flow's three boards on a
three-step rail (`NavDashes {step, total: 3}`): Night 1 Mood's bed (506 × 1.075) and tone discs under its
own question ("How did today land?") with its own five words (Heavy … Clear, no second line), Checkin
Emotions with the fab, Checkin Reasons with its own **"Log it"** pill (it saves; dimmed until a pick, as
before). Back on the first step and ✕ leave; the mood opens on the stored rung, else the fourth ("Mostly
clear"), as before. The loading wait has the ✕ (`LoadingView onClose`).

Night 3 Reflection's stack is a `ScrollRegion` (top 136, to 16 above the pill): identical at 852
(0.02 %, the drawn caret only — D364), and a long entry scrolls instead of running under Continue (checked at
375 × 667 with 14 lines). Change Pledge Sheet keeps the live Resign step under the scrim, where the canvas
draws empty ground (D095's reading carried): only its nav row shows, dimmed, above the panel at 120 — that
and the caret are the frame's 0.19 %. `RerollGlyph` now strokes `#9B968E` by default (the old `#8B8882` is
not in the palette) and takes `color`; `affirmation.tsx` (today group) keeps its call unchanged.

## Phase 2 amendments (no new numbers — D235–D239 is the whole range)

**D237, the score row.** The row's disc now follows the rule the other four rows follow: a ticked disc when
yesterday put points on the board, the kit's empty ring when it put nothing on or took some off
(`−14 → 1,326` on `.overhaul/day-seed-negatives.js`). The frame's `+12` row is unchanged (ticked); Morning 1
Yesterday stays at 0.08 %, the value's glyphs (D097).

**D239, the scrolling band.** `StepStack`'s band (Morning Task Check, Morning Resign Pledge, Night 3
Reflection, Night Action Reminder) now runs down to the controls' top and keeps its 16 as bottom padding,
instead of ending 16 above them. At 852 nothing moves (the frames' stacks fit). The scrolled end is the same
(the last line stops 16 above the controls); what changes is the resting state when a stack only just
overflows: D339's longest task line (L58, seven lines at 375 × 667) overflowed by 2 and the band's edge cut
Yes / Not yet flat across their bottom corners — they now show whole, 14 above the round next. A stack that
overflows by more is cut at the controls' top line (it reads as passing behind the pill) rather than by a
hard edge floating 16 above it.

**Checked, nothing to change.** All 17 frames at 393 × 852 (14 at 0.00 %; Morning Task Check 0.002 % —
18 px of corner antialiasing on the just-pressed Yes tile, geometry exact at 24,373 166.5 × 62 r20;
Morning 1 Yesterday, Change Pledge Sheet and Night 3 Reflection as recorded above) and at 375 × 667,
390 × 844 and 430 × 932; `/checkin`'s three steps at the three sizes; the negatives; L58 on Morning Task
Check and Night Action; a six-line pledge; a ten-line reflection. Back paths after D340: ✕ on a cover,
mid-flow and on `/checkin` returns to the All drawer it was opened from; Done from Today's "Morning
check-in" returns to Today with yesterday's `dailyActionDone` written. The night fallback reads "hard to
reach", as Today II draws it.

**Open (kit): Checkin Emotions at 390 × 844 loses its moon by 0.03 pt.** The kit's drop test
(`Hero.tsx`: `heroArtBottom + 16 > height − canvasTop − controls`) compares the unrounded art bottom:
nightMoon at 0.954 ends at 696 + 0.954 × 21 = 716.034, the round next's top at 844 is 732, so
732.034 > 732 drops the art and the board shows 216 pt of empty ground where Night 1 Mood and Checkin
Reasons at the same size keep theirs. On a real 390 × 844 phone (inset 47) the board is 851 tall and keeps
it; the mock's 54 inset is what lands it on the edge. Asked of the orchestrator: round the art bottom in
that test.

## Library decisions — Vici Overhaul run, Phase 1 (D240–D249) — `library`

Files: `src/app/(app)/library.tsx`, `src/app/week/[week].tsx`, `src/components/library/WeekPage.tsx` (new;
`WeekBoard.tsx` deleted), `src/components/journey/JourneyScreens.tsx`, `src/app/journey/{index,[chapter]}.tsx`,
`src/app/{first-steps,lessons-browser,search}.tsx`, `src/app/(app)/locked.tsx`. Deleted (grepped, no importers):
`src/components/library/WeekBoard.tsx`, `src/components/journey/{WeekScene,WorldArt,WorldCardArt}.tsx`,
`src/content/weekScenes.ts`. Seeds `.overhaul/library-seed.js` (day 38), `.overhaul/library-day3-seed.js`.
Recipes `.overhaul/recipes/library.json` (the old `weeks.json`, a day-12 world, is deleted — it sorted after
`library.json` and would have overridden it).

## D240 — The Library tab is the twelve week pages, a horizontal pager (D325)
`(app)/library.tsx` lays the twelve `WeekPage`s side by side in a paging `ScrollView` and opens on the reader's
current week (`ceil(day / 7)`, clamped 1–12: Week VI on the frames' day 38; Week XII past day 84), or on
`?week=N`. Only the page in view and one either side are mounted. `/week/[week]` is now a `<Redirect>` to
`/(app)/library?week=N` (clamped), so the All drawer's `A week · board`, the recipes and any old link land on
the tab with the bar lit — the bar comes from the navigator, as on every tab. A request arriving while the tab
is mounted turns the pager to it; the param is consumed (`setParams`) so asking for the same week again works
after a swipe (checked). The back chevron — kit `chevronL()`, a 40-tall box at 22,60, z 5 — is held still over
all twelve pages and does `router.back()` when there is history (inside the tabs that is the tab history: the
navigator's default sends it to Today) and `navigate('/(app)/today')` otherwise. Sideways swiping is an
interaction the canvas does not draw; it adds no pixels.

## D241 — P1 / P2 are one rows viewport (CRITIC §5, library Q2)
The rows sit in a vertical `ScrollView` from canvas 472 to 12 above the scene's foot (the bar's top): 264 at
852. Its content is the seven rows (gap 8) plus `paddingBottom = view + 264 − 454`, so the last scroll position
is always P2 (row 5 on the viewport's top edge) and scroll 0 is P1 (row 5's top on the clip — nothing shows in
728–748). All 24 frames diff at ≤ 0.01 % with nothing outside the hero band. Recipes reach P2 with a `do` that
scrolls only the scrollers inside the viewport — `--scroll=end` picks the first-mounted page's (the
neighbouring week), so it cannot be used here.

## D242 — Rows: calendar-day states, every row opens the reader
`rowStateFor(lessonDay, day)`: `< day` done (24 ink disc + `#111111` check, chevron `#9B968E`), `=== day`
current (ink card, number at `rgba(17,17,17,0.6)`, `#111111` title, `Continue` 13/700), otherwise upcoming
(number `#9B968E`, chevron `#5A574F`). The day is `floor((now − createdAt)/1 day) + 1`, read against the moment
the screen mounted — completion records are not consulted (library Q3, unchanged behaviour). Every row in every
state pushes `/lesson/day/<n>` (PHASE1; `/lesson-card` is a redirect to it now). No lock and no gating — the
frames draw upcoming rows with a chevron and the app never gated the board. Each row is one button labelled
`"<title>, lesson <nn>, completed|today|upcoming"`. Titles are 15/700 with `text-wrap: wrap` (the span states
none; `rowLabel`'s default `nowrap` is overridden) — the nine two-line titles break where the frames do.

## D243 — Other phone sizes
Taller than 852 the viewport runs towards the scene's foot (430 × 932: rows 1–5, its foot trimmed per D247) rather
than stopping at 264 over a band of empty ground; the last position is still P2. Below three rows of viewport
(a phone under ~770 tall — 375 × 667 gives 113) the page scrolls whole from the safe-area top (D320 rule 3):
chevron, hero, header and rows in one scroll, the chevron riding with it so nothing passes under a pinned glyph.
The pager hides its pinned chevron in that mode. Checked at 375×667 (scroll 0 and end) and 430×932.

## D244 — `CourseRow`: the week-page row, reused by the unframed screens
`WeekPage.tsx` exports `CourseRow` (`lead: 'check' | label`, `title`, optional `caps` line above and `detail`
line below — 13/400 `#9B968E`, 18 — `state`, `trailing` override or `null`, `onPress`/`disabled`, `label`),
`LessonRow`, `LessonRows`, `WeekHeader`, `WeekBack`, `WeekPage`, `rowStateFor`, `courseDay`, `useCourseDay`,
`weekForDay`, `clampWeek`, `lessonNumber`, `useRowsViewport`, `WEEK_HERO_TOP`. With no `onPress` the row is a
plain `View` (no button role). With `caps`/`detail` the row pads 11 above and below and grows past 58 only when
its text needs it. The hero tops are the frames' stated values (80, 98.9, 63.9, 114.4, …), not the rule they
follow (`T = 102 − 1.1·(bounds bottom − 190)`).

## D245 — The unframed screens (routes §4.5, 4.9–4.12; copy unchanged, CRITIC G12)
* **Lessons browser** — nav row geometry with an 80 word slot each side: `Cancel` (15/700 ink), caption
  `Lessons`, an 18 search glyph (no frame draws one; drawn in the kit's 2-pt line) → `/search`. Each week:
  caps `Week <roman>` + `h1` name, then its seven `LessonRow`s; lessons past today are listed and disabled
  (CRITIC C7 — no lock glyph). The paper shelves and lesson plates are gone.
* **Search** — Sheet Edit Name's field (`TextField variant="sheet"`, autofocus) with `Cancel` beside it; the
  three recent words as single-select `Chip`s that fill the query (on while the query equals it); the count as
  caps; results as `CourseRow`s with the week on a caps line and the summary under the title, chevron `#9B968E`.
  Same filter (title + summary + week name/blurb). Rows push `/lesson/day/<n>`.
* **First steps** — close-only `NavBar` with the caption, `h1` + `p`, the lesson reader's 3-pt rail (`#2E2E2E`,
  ink fill = done/6) and the caps count line; the six as `CourseRow`s: completed → check, today → current, open
  → number + `#9B968E` chevron, not open yet → number + `#5A574F` chevron, disabled. Close-then-push kept.
* **Locked** — back `NavBar`, `Weeks` 32/38, Week I as a done row (`Completed · 7 lessons`), weeks II–IV as
  upcoming rows (numeral, name, blurb, no glyph, no fade), the Closed-door illustration in place of the paper mist
  vignette, `11 more weeks ahead` (`h1`, centred) + the existing line, `Unlock VICI Plus` primary → `/paywall`.
  On a phone where the column would not fit above the pill the door is dropped (D320 rule 1, once).
* **Campaign** (`/journey`, `/journey/[chapter]`) — the week page's form: a `Lesson-Illustrations-v4` hero
  standing on canvas 292 by the week pages' rule (Landing `sunrise`, Crossing `compass`, Highlands `mountain`,
  Watch `lighthouse`), caps `Chapter <roman>`, title 30/36, the chapter's line 15/22, and its three marks as
  `CourseRow`s (done → check, here → current, not yet → number) with the day range where the week page puts
  `Continue`/the chevron; the Watch closes on the laurel + `Day 90 · the vow, renewed` in caps. The index stacks
  the four; each page scrolls from the safe-area top. `CHAPTERS`, `CHAPTER_ORDER`, `CHAPTER_LAST_DAY`,
  `chapterForDay`, `useJourneyDay`, `useCurrentChapter`, `JourneyChapter`, `JourneyScroll` keep their names;
  `ChapterKey` now lives here. The dead `CampaignMap` / `CampaignGrounds` (no importers) went with the paper art.

## D246 — Residual: hero edge anti-aliasing
Every week page's only mismatch is inside the hero band: 0–139 px over 24/255 (≤ 0.01 %), on near-horizontal
art edges (the flag's hem, the scale's beam, the lighthouse island). Not a position error: the design frame
re-rendered with its svg at `top: 99` instead of `98.9` diffs 0 px against the original (Chrome snaps the
svg box to the whole point — D373 confirmed by capture), and the app against either is the same 78 px on Week VI.
It is the browser rasterising a CSS-transformed `<svg>` versus react-native-svg's `<G transform>`; the kit's
`Hero` owns that choice.

## D247 — The taller viewport stops on a row edge
The frame's own 264 lands exactly on row 5's top edge. Run to the scene's foot, 430 × 932 leaves 344, which shows
14pt of row 6 as a stray band just above the bar. `useRowsViewport` raises the foot to the edge of the first row it
would cut (`view − view % 66` when the cut falls inside a row), so 932 shows rows 1–5 whole (330) and P2 still ends
on row 5's top. 852 (264) and 844 (256 — the cut falls in the 8 gap) cut no row and are unchanged. Re-checked in
Phase 2 at all three sweep sizes, scroll 0 and end.

## D248 — Phase 2: two-line runs on the unframed rows, the centred lines
No frame draws these; each is a line-break fault seen on the size captures, fixed without touching the frames.
* `CourseRow`'s `caps`/`detail` form (search, first steps, locked — never the week rows, whose titles keep the
  frames' greedy wrap) sets its title and detail `pretty`, so a two-line title or one-liner does not end on a
  lone word at the narrower widths (search at 375 now reads "Get support during a / difficult period").
* Locked's line is two sentences under a centred `h1`; greedy left "the mist." alone at 393, balance split
  "The / road". It now breaks between the sentences (`\n`; each fits a line at every width — fixed copy, D332), and
  its straight apostrophe is the system's `’`.
* The campaign chapters' lines (two lines each, centred under the title) balance, as a centred two-line `p`
  does elsewhere: "…keep / the light on for the long run." instead of a lone "run.".
Phase 2 verification scripts: `.overhaul/lib-unframed.mjs` (the unframed screens at 393/375/390/430, scroll 0
and end) and `.overhaul/lib-backpaths.mjs` (20 flows, every back path and lesson door, D340 history included).

## Lessons decisions — Vici Overhaul run, Phase 1 (D310–D319) — `lessons`

Merged into DECISIONS.md by the orchestrator. Files: `scripts/overhaul/gen-lessons.mjs` (new),
`scripts/overhaul/lesson-breaks.json` (new, measured input), `src/content/lessons.ts` (GENERATED),
`src/app/lesson/day/[day].tsx` (rewritten), `src/components/lesson/{LessonShell,LessonPages,LessonViz,LessonText}.tsx`
(new), `src/app/lesson-card/[day].tsx` and `src/app/task/[day].tsx` (redirects).

## D310 — The readers are generated from the 1,273 Week frames, one page per frame
`node scripts/overhaul/gen-lessons.mjs` (`--check` to verify) reads every `L<n>-Frame-<k>.html`, decomposes it
into the reader grammar of lessons.md §3 and fails on any residue: an unknown atom or band child, a chrome
that is not the shared one (✕, header, rail percent = `round(k/N·100)`, noise 0.06), a bottom control that
is not the page kind's (`Begin` / `Continue` / `Finish lesson` / `Done` / ring), a vertical gap outside
the §3.3 stops, an option density that does not follow the option count. The model is then checked
against `gen/lessons-v3.json` (titles, both quotes, section titles, every reading piece in order, all 33
visual payloads, the 32 questions and their answers, practice pieces, Done-when lines, the complete line)
— 84/84 equal, or the run fails. Pages are the frames 1:1 (the designer's `paginate()` is a DP over
measured line counts; the app never re-paginates). Where `gen/lesson-pool.json` disagrees with a frame
(L52 F8 hourglass, L68 F7 twoCups) the frame's `data-hero` is emitted. Fixed copy (`Begin`, `Part n`,
`Question`, `Best answer(s)`, `After choosing`, `Add a note (optional)`, `Today’s task`, `Done when`,
`Lesson complete.`) lives in the components. The multi-choice "Choose X [or Y] alone if it fits."
instruction is parsed into `exclusive` letters (8 of 10 multi questions).

## D311 — What the reader writes (lessons.md §12.3; D324 "Finish lesson records completion once")
`Begin` → `startLesson(day-NN)` (no-op if started/completed). A question's `Continue` → the choice as the
lesson's reflection, `{ q: 'A,C' }`, only when something is chosen. The reflect page's `Continue` → the
note, `{ q?, note }`, only when one is typed. `reflections:save` replaces the whole record, so every save
merges into what is already stored. `Finish lesson` → `completeLesson(day-NN)` only when the lesson is not
already completed (the mutation re-stamps `completedAt`, which would move Morning's "finished yesterday"
and the score day). `Done` and the ✕ close (`back()`, else `/(app)/today` — the card the old fallback
named is gone). Writes are fire-and-forget (`.catch(() => {})`), as elsewhere. The day's task is still
marked done where it always was (`dailyCheckins.dailyActionDone`: Today's check, Morning's question) — the
complete page says so ("One thing left today — the task.").

## D312 — Native line breaks for the readers (D332 applied)
Web states each run's own `text-wrap` (`balance` on display/title/label/compare label, `pretty` on the
rest, `nowrap`/`wrap` where the frame says), so a web capture breaks exactly as the frame. Native has no
`text-wrap`: `lessons.ts BREAKS` carries Chrome's lines for the 297 non-body runs whose balanced/pretty
breaks differ from greedy at the canvas width (titles, quotes, prompts, options, best answers, Done-when,
viz text; keyed `<ramp>|<text>`), joined with `\n` **only on a 393-wide screen at font scale 1**. The 230
body runs that differ wrap greedily on native (D332: "lesson body wraps greedily") — a one-word difference
at most, no line-count change (the only run whose line count changes, L68 F14's task title, is a title
and is in `BREAKS`).

## D313 — Band modes at runtime, and the keyboard
The stack is measured and the generator's thresholds applied to the real band (`screenH − (insetTop+86)
− 128`): ≤ band − 24 centre (with the 24 lift), ≤ band tall (lift dropped), else scroll (top-aligned at
140, scrolling to the screen's foot, content padded 152 so the last row clears the pill, under the
frame's 150 fade `rgba(13,13,13,0) → #0D0D0D 40%`, drawn as an SVG gradient). At 393×852 this
reproduces the canvas's three non-centre frames (L16 F11, L58 F12 tall; L7 F11 scroll) and on a short
phone gives every overflowing page the canvas's own answer (D320 rule 5). With the keyboard up (native;
the reflect page's note) the band rises until the stack's foot is 16 above the keyboard, never past the
band's top.

## D314 — Controls (none of it is drawn; the old reader's behaviour kept)
The pill and the 44 ring (kit `PrimaryButton`/`RingNext`, both `Next`/label-addressable) are real
buttons. A tap anywhere in the band does what the page's bottom control does (ring → next, `Begin`,
`Continue` on the best-answer page, `Finish lesson`, `Done`) — every page except the question (its rows
own their taps) and the reflect page (the note field); a drag scrolls instead. The band's press carries
`accessibilityLabel="Next"`, the ✕ `Close` (the word the old reader drew is gone). FadeIn 220 ms
bezier(0.2,0,0,1) per page and the rail's 320 ms `LinearTransition`, both off under reduced motion. No
back-a-page control (none drawn, none before); the stack's back gesture / Android back close.

## D315 — Undrawn option state (D322) and Continue
Every question frame is drawn with nothing chosen. Chosen: ink row, `#111111` text, the 24 mark a filled
`#111111` disc with the ink letter, no ring — same geometry, nothing moves. Single choice is a radio
(role `radio`), multi a checkbox set with the exclusive rule (`toggleChoice`): an exclusive letter clears
the others and any other pick clears it. `Continue` is never disabled — the frame draws it live with
nothing chosen.

## D316 — `/lesson-card/[day]` and `/task/[day]` are redirects; `?page=`
No frame in this drop draws either. `/lesson-card/<n>` → `/lesson/day/<n>` (the cover is the way in);
`/task/<n>` → `/lesson/day/<n>?page=task` (the first `Today’s task` page). Both keep the `day-` prefix
tolerance. `?page=<k>` (1-based, clamped) opens on frame k — Today's task row, the verification sweep and
the recipes use it. The cursor (page, choice, note) belongs to the lesson and deep link it was opened
with, so opening another lesson in the same component starts clean.

## D317 — Unknown lesson
`/lesson/day/999` draws the lesson ground and the ✕ (it rendered nothing — a blank screen with no way out).
Phase 2: the band also carries the kit's not-found state, `EmptyState` "Lesson not found" / "The course has 84
lessons." — the medallion routes' own pattern ("Medallion not found"), so a bad link says what happened instead
of showing an empty ground. The body is short enough to stay on one line at 375.

## D318 — Visualisations on other widths
Card inner width = screen − 64 − 40 (289 at 393). `track` computes `cw = inner/n`, `cx = round1(cw·i +
cw/2)` from it (the frame's own numbers at 393, incl. 254.1). The `wave` svg's viewport is widened to
`-2 -8 293 104` to hold what the frame's `overflow: visible` draws outside its 289×96 box (the dashed
marker from y −8, the curve's round cap past x 289) — native svg clips at its viewport — and scales with
the inner width. Compare cards are `flex: 1 1 0` (150.5 each at 375); pairs' fixed left columns
(112/64/44) still fit.

## D319 — Old reader code left on disk (deletion pending)
The rewrite orphans `src/components/lesson/{scroll,reader,pages,cover,coverL1,marks,scenes}.tsx` and
`src/content/{lessonReader,coverScene,readerRoom}.ts` (grepped: nothing outside that set imports them;
`lib/curriculum.ts` names `lessonReader.ts` only in a comment). Deleting them was refused by the session's
permission policy, so they stay, unimported, until the user approves the deletion. `lessonPlates.ts`,
`taskScenes.ts` and `src/components/task/*` are still imported by search, lessons-browser and the today kit
(CRITIC G13) and stay regardless.

## sos-flow decisions — Vici Overhaul Phase 1 (D250–D259) — `sos-flow`

Merged into DECISIONS.md by the orchestrator. Files: `src/components/urge/{flow,hub,stages,index}.tsx`,
`src/app/{urge,urge-hub,rough-first90,relapse}.tsx`. Evidence: `.overhaul/understand/sos-flow.md`, captures in
`.overhaul/shots/sosflow/`, recipes `.overhaul/recipes/sos-flow.json` (drives `.overhaul/drives/sf-*.js`, hub seeds
from `node .overhaul/f-sosflow-seeds.mjs`, functional walks `sf-func-*.js`, line-break check
`node .overhaul/f-sosflow-breaks.mjs`, size sweep `.overhaul/f-sosflow-sizes.sh`).

## D250 — The interrupt, the relapse boards and the hub are the kit; the paper kit is gone
Hero boards (Intro, the three moves, Surf Complete, Relapse Log / Twice / Begin) are the kit's `HeroBoard`; the
question boards (Strength, Where, the two pickers, Reassess, Afterward, Relapse Resign) are one `SosQuestion`
in `stages.tsx` — nav row, a left stack at canvas 136 in a `ScrollRegion` from 100 to the controls (D320 rule 3),
an optional `layer` for what the frames place beside the stack (the intensity bars at 232 and their reading at
440), and the hero under it with the kit's `controls` (rule 1). The hub panes and the stages stand on the dark
`Screen`. `/relapse` renders through the same pieces as the slip twins (CRITIC §3.2). Deleted with the restyle:
the paper chrome and pickers (`PaperSheet` … `PickerGrid`, `PLACE_GLYPH`), the object art (`IntroArt`,
`MoveStepArt`, `LeaveStepArt`, `ScreenStepArt`, `DawnShaft`, `SlipArt`, `TwiceArt`, `BeginSky`, `NoiseRay`), the
hub's gold panes and wave chart, the breathing ocean (`UrgeWave`), and the old kit's 27 re-exports in
`urge/index.tsx` (D392 kept them for the split; grep: nothing outside `src/components/urge/` imported any).
`index.tsx` now exports `UrgeFlow`, `UrgePlace`, `UrgeHub` and the settings types. `assets/images/urge-wave.webp`
is no longer referenced (left on disk).

## D251 — The reason and feeling pickers are multi-select (D324)
Kit `Chips multi`, nothing chosen by default (the drawn selections are the recipes' taps). The board is the
first answer **in the picker's own order**, not the first tapped; `precedingState.reasons` keeps every reason,
in picker order; `precedingState.feeling` keeps one — the first in picker order — so the schema is untouched.
Nothing chosen → `SOS-Trig-Unknown` / `SOS-Feel-Unknown`, as before. "Where" stays single-select (radio rows).

## D252 — The four SOS stages stay, on 85F's board (D328)
The canvas runs Afterward → The wave passed and draws only 85F; the app's step `sos` keeps its four stages:
85F's breathing board, then number tap, odd one out and the 90-second clock, all on the hub's dark shell (nav
"Ride it out" · ✕, head at 160, white primary at 96, "I slipped" at 60). The hub's Breathe pill runs the first
three and returns to the panes (as before). Controls map one-to-one onto the old ones: the primary is the old
"End early" (interrupt: log the urge as ridden out → relief board; hub: back to the panes) — labelled "Done" on
85F as drawn, "End early" on the three unframed stages (their own copy, G12); each stage still moves on by
itself when it runs its course; ✕ closes (interrupt: abandon, as every interrupt ✕; hub: closes the hub); the
hub's back chevron returns to the panes. New on the stages: "I slipped" (→ `/slip`, as the old 90-second stage's
"I slipped — log it" did). The breathing board keeps the old gear (SOS settings) in both contexts — see D256 for
where. The unframed stages show their place in the run with the hub's 6-pt dots at `bottom 180` (the old four
stage dots); 85F draws none. The 90-second stage is 85A's ring (arc = what is left, clock m:ss, the old phase word
in sentence case); the ocean is gone.
**Short phones.** At 393 × 852 every stage draws where 85F's shell puts it. Below that each stage fits its play to
the area between its head (+16) and the controls (−16; the dots' 202 already holds it) before the band scrolls:
the tap stage keeps its five spots' size and closes up their heights (≥ 45 % of the drawn spacing — the nearest
same-column pair is still 94 apart), the odd-one-out grid shrinks its tiles (72 → ≥ 56, the dot stays 12), the
caption sits on the area's floor, and 85F's orb — art, not type — draws smaller (≥ 60 %) above an unchanged phase
row; the ring stage keeps its size (its clock is type). The spots and the grid are centred on the screen's width.
At 375 × 667 every spot, tile, caption and the whole orb are visible above the controls at rest (the first
pass placed them at fixed canvas y and cut the fourth spot and the third tile row at the band's edge).

## D253 — 85F breathes 4 · 4 · 6; Hold and Out use the old captions
In 4, hold 4, out 6 (the frame's phase row), three breaths (42 s) to a round. Only "In" is drawn; Hold and Out
take the old box-breathing captions in the frame's sentence form — "Hold it." / "Breathe out slowly." — with no
line under them (no approved copy; proposals in the report). The white r70 disc grows to r92 (the middle ring)
over In and back over Out; it holds still under Reduce Motion. At t = 0 the board is the frame (reduced-motion
capture 0.00 %); a normal capture lands ~0.3 s into the inhale (r70.4, 0.12 %).

## D254 — Reassess's line follows the direction; Afterward's card stops at eight lines
"Coming down — from 4 to 2" is the way the urge went and both reads, numbered 1–5. The word follows the direction,
never the second read alone (the first pass took the second read's own note, so Faint → the default 2 read
"Coming down — from 1 to 2"): down → "Coming down — from X to Y" (to 1: "It passed — from X to 1", the old note for
that read); unmoved → "Holding steady — still at N" (the old middle note; "It passed" when both are 1); up →
"Rising — from X to Y" (app-authored, D-20 batch). The default second read stays 1 (the old default), so a Faint
first read opens on "Rising — from 1 to 2" until it is answered. The dashed "was" bar shows only when the reads
differ (kit `IntensityScale`, D383). Afterward: the note card grows a line at a time to eight (30 each, card 284,
ending at canvas 549 — 42 clear of the envelope's art at 591) and then scrolls inside (sos-flow §3.11); the first
pass let it grow over the envelope.

## D255 — Surf Complete says how long it lasted
"You outlasted it. {Twenty-two minutes}, start to finish." from the session's own length (`minutesWords`, the
same number written to `durationSeconds`); under a minute: "Under a minute, start to finish." (app-authored,
flagged). The "×N" count and the flow's `useEvents()` read are gone. ✕ and "Back to Today" both close.

## D256 — SOS settings: the kit sheet, every choice kept, one tap from the hub as before
Sound (stored, as before — the app plays none), the orb light and the ground, as a kit `Sheet` (top 420,
`Segmented` for sound and ground, four 44 swatches, frame-level "Done"). The defaults draw the frames exactly
(white disc, the dark ground). A light or ground the user picks keeps the look it always had (the orb's
gradient; the starfield / dawn grounds, now with the old stage's bottom scrim — 0 → 55 % → 82 % of the ground
over the last 230 pt — without which "I slipped" all but vanished into the dawn's glow) — a user's preference is
honoured, not flattened; lint-mono lists those 17 hexes (all in `stages.tsx`) as that judgement call. Retiring
them is the user's call.
**The gear.** The old app opened the sheet from a gear on the breathing stage in both the interrupt and the hub
(Breathe → gear: two taps from the hub). 85F gives the nav's left slot to the back chevron, and the first pass
dropped the hub's gear, leaving settings ~14 taps into `/urge`. The gear is kept on both breathing boards, in one
place: a 36 × 40 slot just inside the ✕ (glyph 22, right-aligned, x 313–335), as Paywall and Yearly Drop keep
their ✕ (D323). It is a visible deviation from 85F (312,68 24×24, 658 px; 0.18 % with the breath's edge ring,
0.05 % under reduced motion) — the orchestrator may rule the other way (one line: drop `onSettings` from the
hub's breathing stage; settings then live only in the interrupt). The sheet is drawn over every stage, as the
old flow drew it, so a round that ends under it does not close it; leaving the hub's stages closes it.

## D257 — What the hub's panes read
85A: the ring is D066's (arc = what is left of the 20-minute window, marker at its end). The frame's 17:42 and its
62 % arc cannot both be one moment; the clock is kept and the arc is the frame's one residual (0.66 %). 85B: "This
one is {band word}." from the live session's severity (`INTENSITY_BANDS`), then "None this {word} has lasted past
{N minutes}." from the longest ridden-out urge at that severity or above — left out when there is none; the card
is "N clean, M slips" over the 30-day grid. 85C: the ridden-out count, the twelve newest timed urges oldest →
latest at `max(12, round(96·s/longest))` from unrounded seconds, the longest in white, "Longest: N min"; no bars
when nothing is timed. 85D: the four newest, "Thu, 3:10 pm", fill against the longest of the four, the stored
"what helped" in sentence case, default "Waited out the timer"; no card when nothing is timed (the old pane drew
no rows either).

## D258 — The hub's shell
No chip chosen at first (CRITIC §5); a chosen chip is the white fill with `#111111` words, a radio, filed on the
session as its trigger (as before). The pager dots are the kit's tappable `PagerDots`; coming back from Breathe
(Back, Done or the round's end) the pager reopens on the pane its dots still mark (the pager remounts — the old
hub had the same mismatch). On a short phone a pane that does not fit above the dots (each reports where it
ends, so a longer wrap counts) first rises, head and all, by up to 52 (the head at canvas 108, `HeroBoard`'s art
floor); then 85A's chips close up on the ring (to 16 under the marker's lowest point, ≤ 37); only what is still
left over scrolls (D320 rule 3). At 375 × 667: 85A, 85B, 85C, 85E and 85F show everything at rest; 85D's card is
taller than the band (63 over after the lift) and scrolls, its fourth row under the band's edge until it does.
At 393 × 852 and wider nothing moves. Nothing runs under a control.

## D259 — 85E, Relapse, `?board=` and the challenge's back
85E: "Signed N days ago." (0 → "Signed today.", 1 → "Signed yesterday."), then "Kept every day since." only while
no slip has landed after the signing (Q13). With no pledge on record 85E and Relapse Resign keep the words they
always fell back to ("The mornings are mine again.", "You"); 85E then drops the caption. Relapse Log's ghost still
opens the interrupt (Q9); its body carries a `\n` before "it here." — the frame's pretty break, which greedy
native wrapping would put after "it" (D332; 313.8 pt, fits the 327 column at 375). D336 lands: `/urge?board=<key>`
(mock builds only) opens the flow on that board's step, the board holding until that step's picker is answered —
Loc Bathroom, Loc Home Alone and Trig Rejection diff 0.00 %. The flow passes `onBack` to the response boards, so
SOS Challenge draws its back chevron (sos-boards' D263) — 0.00 % — and it returns to the feeling picker.

## Phase 2 amendments (to D252, D254, D258)

**D254 — the second read's default.** The default second read is now `min(1, first read)` until the user answers it
(index 1, "Noticeable", for every first read from Mild up — the frame's state is unchanged). A Faint first read used to
open on "Noticeable · Rising — from 1 to 2" and, if the board was left untouched, file a rise on the event
(`severityAfter` above `severity`) that nobody reported; it now opens on "Gone · It passed" and Mild on "Holding steady —
still at 2". The line itself was already direction-true; walked for Faint, Mild and Intense × all five second reads
(`sf-func-reassess.js`): no read ever pairs "Coming down" with a rise or "Rising" with a fall.

**D258 — one lift for the whole pager; 85D's card closes up; a band that fits never scrolls.** On a short phone the five
panes now rise together by the largest lift any of them needs (≤ `BAND_LIFT`), so the heads stay on one line while the
pager slides (at 375 × 667 they sat at 74 / 126 / 108 / 74 / 120 and jumped mid-swipe). After the lift, 85A's chips close
up on the ring (as before) and 85D's card closes up on its head, to 12 under it (the head's own title-to-line gap) — at
375 × 667 the whole card now shows with no scroll (it used to stop mid-way through its fourth row). `CanvasBand` adds the
24-pt end gap only when its content does not fit: 85A fitted flush to the dots' edge still scrolled 24 (dragging the head
under the nav) and the breathing board 8. 85A's measured bottom includes the chips' 1-pt ring, which the band used to clip
flat. At 393 × 852 and wider nothing moves (audit unchanged).

**D252 — the 90-second ring fits its svg box.** The fourth stage fits the ring's 240 box, not its ink (223): on web a
scroller counts the svg's empty 17 under the marker, so the ring scrolled 11 at 375 × 667. It now rises 11 instead. Every
stage (breathing, tap, odd one out, ring) in both the interrupt and the hub's chain was walked at 375 × 667
(`node .overhaul/f-sosflow-stages.mjs 375 667 <outdir> interrupt|hub`): every spot, tile, caption and the whole orb and
ring show at rest, nothing scrolls, nothing sits under a control.

## sos-boards decisions — Vici Overhaul Phase 1 (D260–D269) — `sos-boards`

Merged into DECISIONS.md by the orchestrator. Files: `src/components/urge/boards.tsx`,
`src/content/sosResponses.ts` (GENERATED) + `scripts/overhaul/gen-sos-boards.mjs`, `scripts/overhaul/sos-breaks.mjs`
(new), `src/app/(app)/rough-days.tsx`, `src/app/rough-protocol.tsx`, `src/content/roughDays.ts`;
`src/components/roughDays/kit.tsx` deleted. Evidence: `.overhaul/understand/sos-boards.md`, captures in
`.overhaul/shots/sosb/`, recipes `.overhaul/recipes/sos-boards.json` (drives written by `.overhaul/f-sosb-drives.mjs`).

## D260 — Every response board is the kit's `HeroBoard`
The thirty `SOS-Loc/Feel/Trig-*` frames are one template in two variants and `SOS-Challenge` is the same
board with a card (sos-boards §0). `ResponsePage` (API unchanged: `answer`, `onClose`, `onNext`, `onAnother`;
`onBack` added, optional) now draws `HeroBoard` from the generated data: kicker in the nav, ✕, the shared
hero at 190 × 1.1, title 30/36 + body 15/24 at 452 gap 18, primary at bottom 48 — 96 over "Give me another".
The paper sheet, `SheetClose`, the 239-layer scene renderer (`SosSceneLayer`, `EllipticBox`) and D391's copies
of `PaperSheet`/`SoftBlob`/`BlurredSolid` left `boards.tsx` with the old scenes (nothing else imported them).
Behaviour is unchanged: ✕ → `close()`, pill → `next()` (`Continue` and `Done` do the same thing), ghost →
`onAnother`; the board writes nothing.

## D261 — `scripts/overhaul/gen-sos-boards.mjs` replaces both `gen-sos-responses.mjs`
It reads the 31 split frames, asserts every template value (ground + noise `0.05`, nav row, kicker 13/700
`#9B968E`, ✕ path, hero `left 0 / overflow visible / origin 196 190 / scale 1.1`, stack top and gap, h1/p
metrics, primary + label, ghost, `ctaBottom === (another ? 96 : 48)`, ghost only on the feeling branch and the
challenge) and that each board's `<svg data-hero>` is its Lesson-Illustrations-v4 card byte for byte — so the
board can draw the shared hero and a later drop that moves one board stops the run. Output keeps the file
name and the `SOS_RESPONSES` export; keys are a literal union (`SosBoardKey`, `SOS_BOARD_KEYS`,
`isSosBoardKey()`), so a typo in the flow's maps is a compile error instead of a blank board. `layers[]` is
gone; the copy diff against the old file is exactly the 13 CTAs that became `Continue` (the four `Done`s stay
`Done`, CRITIC §5) and the six `\n`s of D262; the kickers are new.

## D262 — Six explicit line breaks; the challenge needs none
`text-wrap: balance` (titles) and `pretty` (bodies) break six runs differently from a greedy wrap at 393:
titles of Feel-Rejected, Loc-Elsewhere, Trig-Habit; bodies of Loc-Bed, Loc-Work, Feel-Unknown. The generator's
`BREAKS` carries the frame's lines (asserted equal to the frame text with `\n` read as a space), so native draws
the frame's lines (D332); on web the browser balances each forced line the same way. Every forced line is
≤ 304.4 wide, inside the 327 column at 375. `node scripts/overhaul/sos-breaks.mjs` re-renders all 31 frames on
`:8097` and checks the generated file (including Challenge's title, body and card text, whose greedy breaks
equal the drawn ones): "31 frames: every break matches".

## D263 — The challenge's back chevron is drawn when the flow hands a way back
`SOS-Challenge` draws back + 7/8 dashes (sos-flow §3.9: back → the feeling picker). `ResponsePage` draws the
chevron when the flow passes `onBack`; without it the 36-pt slot stays empty rather than holding a control that
does nothing. Until `UrgeFlow` passes `onBack={back}` on the `feeling-said` step (sos-flow's file), the capture
differs from the frame only by that chevron (0.02 %).

## D264 — An answer the content does not know shows its branch's "I don’t know" board
`ResponsePage` used to return `null` for an unknown key — a blank screen with no way out. It now falls back to
`SOS-Loc-Elsewhere` / `SOS-Trig-Unknown` / `SOS-Feel-Unknown` by the key's prefix (and warns in dev), matching
the flow's own fallbacks.

## D265 — Rough Days shelf: the Settings list idiom with Today III's card
No frame draws `/rough-days` (routes §4.6). It is set like `Settings`: nav back + caption "Rough days", captioned
groups from canvas 120 `gap 18` inside a `ScrollRegion` (D320). "The universal interrupt" is the caps line over
Today III's "Urge surfing" card (r24 `#1E1E1E`, padding 18 20, 52 ink disc with the stopwatch glyph, 18/700
title, 14/400 sub line, chevron) → `/rough-first90`; the seven protocols are one `RowGroup` captioned "What today
feels like" → `/rough-protocol?key=`. Copy is the screen's own (G12). Back falls back to `/(app)/library`.

## D266 — A rough-day protocol is an SOS response board
`/rough-protocol` renders `HeroBoard` like `SOS Feel *`: the protocol's name as the kicker, ✕, the page's
illustration at 190, headline 30/36 + line 15/24 at 452, the third page's move as a second 15/24 line in ink,
three light `PagerDots` inline at the foot of the stack (so the small-screen lift counts them), primary over a
ghost ("Walk through it / Next / Done" over "Not tonight / Back / Back" — the screen's own labels and stepping).
The 21 bespoke paper drawings (`src/components/roughDays/kit.tsx`, 749 lines, imported only by this route) are
replaced by the nearest Lesson-Illustrations-v4 card per page (table in `roughDays.ts`) and the file is deleted.

## D267 — `?key=lonely` opens Loneliness; an unknown key opens the first protocol
The `All` drawer pushes `/rough-protocol?key=lonely` (settings' file), which matched nothing and drew a blank
page. `rdProtocolKey()` maps the obvious short words (`lonely`, `anxious`, `stressed`, `bored`, `late`, `alone`)
and falls back to the first protocol, so no link can open an empty screen.

## D268 — Recipes walk the flow in either wording
sos-flow is renaming the interrupt's labels in the same phase, so each drive (`.overhaul/drives/b-SOS-*.js`,
generated by `.overhaul/f-sosb-drives.mjs`) accepts both (`Start`/`Start the interrupt`, `Continue`/`I’m up` …),
and `only()` clears any pre-checked chip before picking (D324 multi-select pickers), so the board reached is the
one named. Rotation-only boards press "Give me another" from their rotation neighbour. The three boards no
answer reaches (D038) are recorded on the mock-only `/urge?board=<key>` (D336), which is sos-flow's to land in
`urge.tsx`/`flow.tsx`. Until it lands, their render proof was taken D146's way inside this group's own file: a
temporary swap in `boardFor()` (Loc-Bed → Loc-Bathroom, Loc-Work → Loc-Home-Alone, Trig-Content →
Trig-Rejection), the sibling drive with its waited title changed, then reverted (grep-checked) — all three
0.00 % against their frames.

## D269 — Verification
All 30 boards diff at **0.00 %** (0 px over 24/255, mean Δ 0.43–0.50, the grain) against their frames at
393 × 852, Lato loaded; `SOS-Challenge` at 0.02 % — only the back chevron D263 leaves to the flow. Signature
residue is representational on every board: the design's `<svg>` box is the CSS-transformed 432.3 × 264
(the kit's screen-wide hero has no such box, D372), and the nav kicker / pill label report `line-height: normal`
in the frame against the kit's explicit 16 / 19 (same box). 375 × 667: every feeling board and the location /
trigger boards lift (D320 rule 2, the kit's `HeroBoard`) and keep 16 pt above the pill; the challenge drops its
art (its 131-pt deficit is more than the 98 pt of room under the nav) and its stack rises alone to canvas 241 —
no overlap anywhere. 430 × 932:
full-bleed grounds reach both edges, text wraps naturally inside the 382 column (the six forced breaks hold).

## Phase 2 amendments (no new numbers — the range is full)

* **D263 resolved.** `UrgeFlow` now passes `onBack` on `feeling-said`, so `SOS-Challenge` draws the frame's
  chevron and diffs 0.00 %. (It passes `onBack` on `place-said`/`trigger-said` too; those frames are `noBack`,
  so `ResponsePage` still draws the empty slot there — the chevron is keyed to the challenge's own nav.)
* **D262 addendum — the challenge card wraps `pretty`.** The frame sets the card sentence with no `text-wrap`.
  At 375/390/393 `pretty` breaks exactly where the greedy wrap does (`.overhaul/f-sosb-chal-wrap.mjs`), so
  the frame is untouched; at 430 the greedy wrap left "minutes." alone on the last line, `pretty` gives
  "…or ⏎ go stand where other people are for ⏎ ten minutes.". Native keeps the greedy wrap (D332: no fixed
  break differs at 393).
* **D265 addendum — Rough Days' back falls back to the All drawer** (was the Library tab, which is the week
  pages now and has no link here); with D340 history it returns to All, its one door. The interrupt card's
  title is "The first 90 seconds", the case the flow's first board and the All drawer use (the screen's own
  copy had title case; G12 keeps the words, the case follows the system's sentence case).
* **D266 addendum — protocol copy keeps each em dash with the word before it.** The space before "—" is a
  no-break space in `roughDays.ts`: at 390 and 393 Home alone III opened a line with the dash ("…can be
  seen ⏎ — or leave…", `.overhaul/f-sosb-dash.mjs`). All 21 pages at 393/375/390/430
  (`.overhaul/f-sosb-rp-sweep.mjs <outDir>`): no orphan, no dash-led line, stack ≥ 40 pt above the pill at
  375 (lifted), ≥ 94 elsewhere.
* **D268 addendum.** The three D038 boards are now reached on the landed `/urge?board=<key>` (D336) and audit
  at 0.00 %; the recipe notes say so.

## medallions-letters decisions — Vici Overhaul run, Phase 1 (D270–D279) — `medallions-letters`

Files: `src/app/(app)/milestones.tsx`, `src/app/medallions/[key].tsx`, `src/app/medallions/tiers/[key].tsx`,
`src/components/keepsakes/{Medallion,Board,Letter}.tsx`, `src/lib/album.ts` (new), `src/app/{letter,medallion-post,drop,mail}.tsx`.
Seeds: `.overhaul/medallions-seed.js` (rewritten), `.overhaul/medallions-vidi-seed.js`, `.overhaul/ml-letters-seed.js` (new).
Recipes: `.overhaul/recipes/medallions-letters.json` (replaces `medallions.json` + `letters.json`).

These supersede D057, D059, D060, D061, D062, D100, D101, D102, D137 and D138, which describe the previous
drop's geometry (struck metals, the sun, page dots, the vertical album scroll, the lamp, the laurel year tile,
Medallion Received as the post's arrival).

## D270 — The album is a pager of six
`Medallions` leaves row 3's place (578–687) empty above a bar at 748, and `Album Earned II` redraws faces 7–10
from the same origin (288): the only reading that draws both is pages of 3 × 2 (CRITIC §5, medallions Q1). A
horizontal `ScrollView pagingEnabled` one screen wide, 2 rows tall, no page dots (none drawn). A page that ends
short keeps the grid's `1fr` columns with empty tracks. Switching segment returns to page 1.

## D271 — Two faces or fewer sit as a centred row, on either segment
`Still to earn` lays its two faces out as a centred flex row (gap 48, shrink-wrapped cells), not the grid (Q2).
The same rule applies to `Earned` (a fresh account has only Veni). An empty segment draws its count line
(`0 still to earn`) and nothing else — no copy invented (G12).

## D272 — One coin, one drawing (`FaceCoin`)
The 27 frames draw every face on one `0 0 64 64` coin at 44 / 64 / 84 / 168: ink field, 40 rim dots at 0.3
(radius 28.1, 9° apart, `toFixed(2)` — reproduces all 1,080 printed values), the 25.5 hairline, the device in
ground ink. **The device lifts 2.6 iff a numeral is drawn** (that one rule explains every frame). Unearned
one-off = the earned coin at 0.32; unearned tiered = `#141414` field, `#3A3833` dashed rim, `#2A2926` ring, no
dots, `#5A574F` device — with the target numeral "I" in the album, bare on the 168 boards. The numeral is Lato
900 by family (`sans('900')`), 6.4 in coin space, tracking 0.6. The metal is no longer painted; `KK_METALS`
stays only as the `?tier=` route contract. Nothing draws the old coin any more (Edit Profile counts with
`useAlbumStanding`): `kkSun` is deleted, and — Phase 2, the orchestrator's carry-over — the `KKMedallion` shim
too (nothing in `src/` or `scripts/` imported it).

## D273 — The doors the pill used to be
No frame draws a way from a board to its `Tiers *` page. On a tiered face the **tier track** (345 × 56 at
T + 338) is a button, "See every tier"; on a one-off (no track) the **caps line** opens `Tiers One-offs`.
`Back to medallions` on a ladder goes to the album itself (`router.dismissTo('/(app)/milestones')`, which
replaces when the album is not in the stack); on the unearned board it is `back`.

## D274 — Detail Paper: computed caps and quote (CRITIC §1.4)
`Detail Paper` is the previous drop's seven-rung Vici left unredrawn. In that drop `Detail Bronze` was
`Tier I · ×1` and quoted "Nine minutes, start to finish. You watched it rise, crest, and leave without you.", and
`Detail Paper` read `Not yet · first ×1` over the same line "— waiting at ×1": both the frame's `×1` and its
quote are the old first rung. Vici's first rung is now ×5 (`Tiers Vici`, the album's data), so — as CRITIC
§1.4 rules, successor of D057 — the board computes both: `Not yet. First at ×5` and the first rung's own line,
`stories[0]` ("Five ridden. Each one shortens the next."), which every unearned tiered board quotes. Keeping the
frame's line would also tell an account with no ridden urge that it rode one out. Residual: the quote is two
lines, not three, so the block sits at T 170 (13 lower — the geometry is `Detail Gold`'s, 0.00 %), plus the two
strings: 5.65 %. (The previous pass kept the frame's line as a `waiting` field without naming the departure;
removed.) The four other `Detail` boards agree with `Tiers Vici` word for word; `vici.stories[3]` takes
`Detail Gold`'s line.

## D275 — The medallion post: Letter Arrival, and the enclosure the account earned
The post arrives on `Letter Arrival` (CRITIC C8 — no frame draws a medallion arriving outside onboarding).
`Tonight` and the ✕ both shelve it (POST_DONE), as the arrival's only exit did before — it stays readable
from Mail. The letter encloses **Vici at its rung** (`Vici, Tier I` + its blurb): the post fires on a ridden-out
urge, which is Vici's rule, and the album must agree with what the post claims. The frame's `Rebound, Tier I`
is its sample account. Known tension, for the orchestrator: the letter's own words ("This one isn't for
resisting. It's for coming back.") fit Rebound better than Vici; switching is one line in
`medallion-post.tsx` if the user prefers the frame's face (it would then enclose a face the album may show
unearned). Layout verified with the face forced to Rebound: 0.01 %.

## D276 — Yearly Drop's way out: the ✕ in the right slot (D323)
D323 puts the ✕ "in the nav's right slot" on both Paywall and the Drop. The Drop's right slot holds `Restore`,
as Paywall's did; like Paywall (D220) the ✕ takes the slot (the kit's `right: 'close'`, x 353 — where Paywall,
Paywall Rescue and the claimed `Drop Received` all draw it, so it never moves) and the `Restore` it displaces
lives on in the ghost `Terms · Restore`, which restores. Leaving marks the drop seen, as the old close did.
Residual: one region, 316,72 56×16 (Restore → ✕), 0.10 % — Paywall's own residual. (The previous pass put the
✕ in the empty left slot, per CRITIC D-2's recommendation, and asked for a kit `left: 'close'`; D323 ruled the
other way, so the local `Tap` and that request are gone.)

## D277 — A run the frame sets as one text node must be one text node
`<Salutation>Dear {name},</Salutation>` renders three DOM text nodes; Chrome shapes across them differently
from the frame's single node and "Sam" moved by a sub-point (125 px of diff). `{`Dear ${name},`}` → 0.00 %. Same
for `That’s {MONTHLY} a month.` on the Drop (93 px → 0). Worth knowing for every group: interpolate into a
template string wherever the frame's run is one string.

## D278 — The post's small decisions
* The arrival's caps are the programme week: `Week <roman(ceil(day/7))> post`, day 1 = sign-up, capped at XII
  (C8 / Q7). Recipes use `ml-letters-seed.js` (an 80-day-old account) to draw "Week XII".
* The letter card's column is a `ScrollView` inside the card with the 70 fade's height at its end: at 852 the
  copy fits (ends 105 above the fade) and nothing moves; at 667 it scrolls instead of being cut.
* The reason run is set as a sentence: one full stop is added unless the user's own words end in one (the old
  code printed "again.." for a why that ended in a period). The journal entry's apostrophes are curly now.
* `/letter?variant=week12` draws `Letter Received` (tail's frame) through the kit `HeroBoard` — no ✕, 26/33 at
  451, `Open` / `Save it for later` — and still opens tail's `O3LetterRead` with its current props.
* `Drop Received` is the kit `HeroBoard` with `MedalTier(4, 176, 'V', disc=false)` at 212 as its art.

## D279 — Ladders, ledger and copy
* One ledger, `src/lib/album.ts`: `useMedallionLedger()` (faces, counts, standings, one-off dates, `byKey`) and
  `useAlbumStanding()` (`{earned, total}` for Edit Profile's "10 of 12", CRITIC C17). `buildLedger` is pure.
* A ladder's count is `Day N` / `×N`; its next line `N days|more to <Tier>` (singular `1 day`); at the top rung
  there is no next tier and the line is omitted (Q6 — nothing drawn, nothing invented).
* Boards: `T = 196 − 13·quoteLines (+1 on Platinum)`; the quote's line count is measured (`onLayout`) and the
  board is held invisible for that one frame. Ladders `T = 155`. Between the nav (100) and the pill the page is
  a `ScrollRegion` (D320) — a no-op at 852; on a short phone it scrolls to 24 above the pill (D320's
  `controls + 24`), as the Drop's offer does.
* The album's pager is as tall as its tallest row: a page holding an unearned tiered face (its 56 × 3 bar adds
  10 + 3) is 2 × 122 + 36, not 2 × 109 + 36 — a fresh account's second row of bars was clipped to 1 pt. A first
  rung of one reads in the singular (`0 of 1 wave`, `0 of 1 morning`).
* The Drop's perk words keep the frame's breaks on a wider phone: each label is inset to the 393 cell
  (93.67) — at 430 "Track your progress" no longer fits one line while its neighbours take two.
* A one-off board's caps are its mint date (`Jun 9`, from the ledger), `Earned once` until the ledger loads, and
  `Not yet` (`#5A574F`) unearned; no track; quote `stories[0]`.
* `KK_ALBUM` copy now matches the frames: Breakwater's lower-case "overwhelming"; `First light` "The first
  check-in"; `Black Box` "First slip logged"; `Return` "Back after 7+ days away" (`ahead` keeps "After 7 days
  away"); `kkRung` writes days in Arabic everywhere (`Tier I, Day 7`, D061 superseded); tier lines use ", "
  (`Tier I, ×5`); unearned caps `Not yet. First at ×10`.
* `/mail` (unframed) is `Log — Reports`' idiom (C6): title head, 64-tall ruled rows (15/700 title over a
  14/700 `#9B968E` line, `#5A574F` chevron), the app's own copy; empty = centred 26/33 + 15/24 mute.
* **Phase 2 — the quote keeps the frame's measure.** A board's italic quote is `left 44 right 44` at 393, a 305
  measure; on a wider phone it is held to 305, centred (the Drop's perk rule above), so it breaks where the frames
  break it. Left free, 430 set "The / wall did." (Breakwater Platinum), "unsure of a / while ago." (Detail Silver)
  and pulled Detail Paper's quote onto one line, which moved the whole block 13 lower. Exactly 44 at 393 and below
  (0.00 % change at 393); 375 keeps its narrower 287.
* **Phase 2 — Mail's post row** names the enclosure in the card's own words, `Vici, Tier I · enclosure inside`
  (it read `tier I`, against 39B's `Rebound, Tier I` casing and the card it opens).

## logs decisions — Vici Overhaul run, Phase 1 (D280–D289) — `logs`

Files: `src/app/(app)/log.tsx`, `src/app/{log-chooser,lapse,urge-log,urge-overview,report-ready,weekly-report}.tsx`,
`src/app/(app)/dashboard.tsx`, `src/components/logflow/*` (new), `src/components/insights/heat.tsx`,
`src/lib/weeklyReport.ts` (additive). Recipes: `.overhaul/recipes/logs.json`. Seeds: `.overhaul/logs-*-seed.js`
(each = `window.__CLOCK` + `clock.js` + `logs-data-common.js` + a `logs-data-*.js`).

## D280 — The log flows are steps on the kit, in `src/components/logflow`
`WhenStep` (chips · "Or choose a time" · the kit `TimeWheel`, always open · `DateRow`), `ChipsStep`,
`OptionsStep`, `DoneBoard` (84 disc, shrink-to-fit `SummaryCard` per C10), `FlowNav`, `useWhen`, plus the
Log's register pieces (`RegisterHead`, `BigStat`, `WeekStrip`, `DotRows`, `Histogram`, `Bubbles`, `Dial`,
`Spark`, `ScoreLine`, `DayCells`, `LastWeek`, `PagedRegister`; `src/components/logflow/data.ts` holds what
they print from an event). Each step's stack sits in a `ScrollRegion`
between the nav row (100) and the primary (106 off the bottom) — the frame at 852; on a short phone the stack
(and the done boards' disc + stack) first rises into the room under the nav (never above canvas 108) until it
clears the pill by 16, and only what still does not fit scrolls (D320 rules 2–3, the `HeroBoard` lift applied to
question and done boards — Lapse Done's card touched its pill at 375 × 667 before); the question boards' heroes pass `controls={106}` (rule 1). `urge-log.tsx`'s old exports
(`FlowTop`, `TimeWheel`, `LoggedNote` …) were moved to a shim for `slip.tsx`, then deleted once the slip group's
rewrite stopped importing them (grepped: no importer left). `(app)/log.tsx`'s old exports (`Halo`, `SunDisc`,
`ramp150`, `LogRow`, `TriggerGlyph`, `OUTCOME_WORD`, `ONE_LINE`) had only this group's importers and are gone.

## D281 — When: the wheel sets the time on the moment's own day; "Change" picks the day; never the future
The old wheel's day column has no place in the frame — the date row's "Change" is the only door left to the
day (logs Q4). It opens a kit `Sheet` of the last seven days as option rows (`Tonight, Tue Jul 22`,
`Last night, Mon Jul 21`, `Sun Jul 20` …, each at the moment's own time). The wheel's columns do not carry
(59 → 00 keeps the hour), so a wheel move sets hour/minute/period on the same calendar day rather than
shifting a timestamp. A chip sets `now − offset` as before; the wheel or the day list turn every chip off
(a chip tap puts them back in charge). Any moment later than the flow's clock is held at it — a logged urge
cannot be in the future (the old date column could reach two days ahead).

## D282 — Zero triggers keeps Continue disabled (undrawn)
The app has always disabled the trigger step's Continue until something is picked; the frames never draw the
zero state. Kept, with D321's 0.38 pill. The label is `Continue` in every state (the frames' — no `· 2`).

## D283 — The Log's lists end at the last whole row on a phone that shows five
Log Urges and Log Check-ins draw five ruled rows and nothing under them, yet Check-ins' "12 days in a row"
means twelve check-ins. Showing all twelve put a sixth row at 704–748 above the bar, where the frame has bare
ground. The page still scrolls whole (head included) and still holds every entry; where the phone shows at
least five rows, its window ends at the last whole row's foot — at 852 the fifth's, 440 + 52 + 4 × 53 = 704,
44 above the bar (seven rows and 18 on a 932 phone). A shorter phone keeps its cut row, which is what tells
the reader the list scrolls. Reports' rows start at 518 and are not folded (its four earlier weeks end at 730).

## D284 — One score for the Log's Reports and the Weekly Report
The old Log card summed per-week deltas (`reportWeeks`, no lessons, seven clean days a week from day one)
while the old report's line used `scoreAt` (lessons, days since the account opened) — the two would print
different numbers for the frames' shared "1,240 · +12 this week". Both now read `weekScore()` in
`src/lib/weeklyReport.ts` (`scoreAt` at each day's end, delta against the Sunday before), which also agrees
with Today's `buildScore` total. logs.md §3.7 says to preserve `reportWeeks()` and §3.13 to preserve
`scoreAt`; the two cannot both hold for one shared number, so this is a ruling the orchestrator is asked to
confirm (not a D324 change). Additive lib exports: `scoreAt`, `weekScore`, `weekLabel`, `dayStatuses`,
`DayStatus`.

## D285 — What the Log prints from the log
"This week" is the Monday-start calendar week the strip draws (CRITIC §5). `Urges this week` and the strip
count urges (`urge_rode_out` + `urge_acted_on`); a lapse is a row (`● Slipped`, ink, never red) but not an
urge. Row times: `Today` / `Yesterday`, the short weekday for 2–13 days ago, the date after
(`Jul 6, 9:05 pm`); right side the band word, `Slipped`, or `Ridden out` for an urge logged without a
strength. Check-ins: the circle is `12 + 4.4·energy` (the frame's 29.6/25.2 fit it exactly; mood stands in
when a day has no energy), the word is the night's first feeling else the morning mood word
(Rough/Low/Steady/Good/Great) — the frame mixes both vocabularies (logs Q9). Singular captions (`1` /
`Day in a row`, `Urge this week`) are the frames' strings in the singular. Empty registers keep the old
title + line in the kit `EmptyState` under the big number and an all-dot strip.

## D286 — Urge overview rules
Range = the last 30 days (the pill says so); `?week=` (from the report's Urges page) narrows it to that week
and the pill names it. Summary lists the five newest (the frame: five rows for nine urges); a ridden urge
prints its minutes (≥ 1) or `Ridden out` if never timed. Strength's word is the modal band, a tie going to
the lower band (the frame's 3-and-3 reads `Strong`); five dots fit a band's column. Mood bubbles are the rank
series 88/66/54/36 (CRITIC §5); the dial's dot is `5 + 2.5·n` (7.5 and 10 as drawn), capped at 12.5; the
peak is the busiest two-hour window by sliding sum (the frame's 23-vs-0 tie resolves to 11 pm – 1 am).
Dot rows cut their dots at what fits the row; the count still says how many. An empty page keeps the old
sentence with the range said as the pill says it ("Nothing logged in the last 30 days, so …").
**The app's own words** (verifier, Phase 1 re-check): the frames' sample words (`Bedroom`, `Tense`) fit their
fixed columns; the words the app records do not — SOS places `Somewhere private` (131 at 15/700) and `At work
or school`, SOS triggers `Something online`, feelings `Stressed or anxious` (354 at 44/700). So the columns
read what they are given (`useLabelColumn` / `useTextWidths` in `logflow/parts.tsx`, off-screen one-line
measures that drop out once read): the dot rows' label column is the widest label, never under the frame's
96, at most half the row; past that a label (a note standing in for a place, as the old list allowed) ends
in an ellipsis, as the old place list did. The Mood page flows from 236 (`PaneBody flowTop`): the big word
wraps balanced and centred where it would overrun (type never shrinks, D320) and the bubbles follow 17
under it; bubble names that cannot sit side by side close the 26 gap toward 16, then the widest wrap
(balanced, never under `max(bubble, longest word)`), and only if even the longest words cannot fit do the
smallest ranks drop. With the frame's words every one of these resolves to the frame (0.00 % on all four
panes). Insights' trigger bars take the same label column. The dot row is a local row (the kit `RuledRow`'s
box) because the kit row's label cannot end in an ellipsis — reported.

## D287 — Weekly report rules
Days: `slip` (a lapse or an urge acted on) and `none` (before the account, after now) draw the undrawn hollow
40 cell (inset 1.5 `#2E2E2E`, as last week's hollow dot); a ride with no slip is the wave; the rest the check.
The number is clean days of the days the account lived that week (`7 of 7`). Urges: the week read forward,
every urge (the page scrolls), each row opening `/urge-overview?week=`; caption `Urges, all ridden out` /
`Urges, 2 ridden out` (and `Urges this week` + the old "No urges logged this week." when there are none).
The score line scales its x's to the column instead of the frame's `preserveAspectRatio: none`, so the dots
stay round on a 430 phone — at 393 the only trace is the frame's own 329/330 squash of its day letters
(0.01 %). The empty states are the old two sentences under the title head. `?from=settings` (93D) changes
nothing drawn; back is `back()` / Insights as before.
**What empties it**: the old screen was built on mood rows, so `hasReportContent` (a mood logged that week)
gated it. This one draws the score, the days and the urges, which exist for every week the account lived —
and the Log's Reports row and the mail row have already named that week (`Jul 7–13 · +8`, which opened
"Nothing was logged that week" before). The report now draws every week the account lived; "Your first week
is still being written…" stays for no closed week, "Nothing was logged that week…" for a `?week=` the
account never lived (a stale link). The launch gate in `(app)/_layout` still reads `hasReportContent`, so it
delivers no more reports than before — widening it is the orchestrator's call.

## D288 — Urge Log Done's line
`<count in words> ridden out. <to go in words> to <Metal>.` — the count is the Vici medallion's (rides
logged, this one included), the next rung and its metal are the album's (`KK_ALBUM` vici steps 5/25/100/250/
1000, `kkMetal(standing + 1)`): 23 → "Two to Bronze". Past ×1,000 only the count is said; after "I slipped"
nothing was ridden out and the line is left out (logs Q7) — no new copy.

## D289 — Unframed: Insights, Report Ready's fallback, seeds
`/dashboard` is restyled after Urge Overview (routes §4.3): title head, the range as the segmented switch
(its old `2W/4W/12W` labels kept, G12), the heat as discs on the check-in tone ramp with hollow no-check-in
days, the three numbers as 30/700 columns, the triggers as dot-row bars, the doors as a `RowGroup`. Its
day-letter header now starts on the weekday the range opens on (it always said `M` first, under rows that
start fourteen days back). Back falls back to Today (the Library tab no longer lights for it). Report Ready
is the kit `HeroBoard` (title written `Your weekly\nreport is ready.` for native, D332); its line is the
frame's `<week>: score, days and urges.`, and with no closed week to name, the old screen's `Score, urges,
and the pattern — two quiet minutes.` (D328). Without `?week=` the line's space is held blank while the
account loads, so the other line never flashes (no spinner: the hook's `undefined` also means signed out).
Seeds pin the frames' July 2025 moments. Where a frame's numbers are sample data the app's weights can still
reach, the seed reaches them and says how in its header (Log Reports' +5/+6/−4/+8/+12 → 1,240; Weekly
Report's line + `+12` needs two slips on its Monday); the Mood page's 14 feelings and the Days/Urges pages
have their own seeds (D126 style).

## Phase 2 amendments (no new numbers — the range D280–D289 is full)

**D285, empty registers:** the kit `EmptyState` carries its own 24 gutter, and the Log page already hangs its
rows in one, so the old title + line sat in a 297 column at 393 (`The first one arrives once a full week /
has closed.` on two lines, `…turns / it into data.` with a ragged 108 inset at 375). The Log's three empty
states now pass `paddingHorizontal: 0` and read in the page's own 345/327 column.

**D287, the week's name:** `weekLabel()` now builds the same-month form with `dateRange()` (`Jul 14–20`).
Across two months it keeps the **spaced** en dash, because the only frame that draws such a week — Log
Reports' row — writes `Jun 30 – Jul 6` (the frame's bytes are `30 – Jul`, U+2013 with a space each side, as
is the designer's own `gen/v2.js`); `dateRange()` closes it up (`Jun 30–Jul 6`, D388). The
Phase 2 carry-over read the frame as unspaced; following it would put a mismatch into a row that diffs
0.00 % today. One label still serves every register (Log row, report pill, overview pill, Report Ready
line, the mail list), so the row a reader taps and the pill it opens always agree.

**Stored check-in reasons (carry-over):** no screen of this group prints a check-in's `reasons` — the
Log's check-in rows read the night's first feeling or the morning's mood word, the report and Insights read
moods and events. Nothing to route through `normalizeReasons()`; the readers of `reasons` are `checkin.tsx`
(already normalised by `CheckinFlow`) and `today.tsx` (a length test).

## settings decisions — Vici Overhaul run, Phase 1 (D290–D299) — `settings`

Files: `src/app/(app)/settings.tsx`, `src/app/profile.tsx`, `src/app/vow.tsx`, `src/app/privacy.tsx`,
`src/app/applock.tsx`, `src/app/backtap.tsx`, `src/app/(app)/all.tsx`, `src/app/(app)/support.tsx`.
Seeds: `.overhaul/settings-seed.js` (premium + 10-of-12 history), new `.overhaul/settings-profile-seed.js`
and `.overhaul/settings-vow-dated-seed.js` (clock-pinned). Drives: `.overhaul/drives/settings-func-*.js`.
Recipes: `.overhaul/recipes/settings.json`. Captures and strips: `.overhaul/shots/settings/`.

## D290 — The settings rows are the kit's `RowGroup`/`Row`/`Toggle`; nothing is group-local
settings.md §11 planned a group-local 54-row kit; CRITIC C3 moved it to `mono/rows.tsx`, and every
screen here is built from it (Settings, Edit Profile, the photo sheet, Data & privacy, App lock, Back Tap,
All). No local `Section`/`Row`/`Divider`/`Toggle` survives. Supersedes the per-group row heights
(52/48/50/46), the inset hairlines and the paper cards of D118-era Settings.

## D291 — D118, D119, D121 (shelf half) and the `from=settings` visual variants are obsolete
`Sheet Sign Out`'s backdrop is exactly today's `Settings` (whole composite 0.00 %), so D118 is gone on
both halves. The vow page has no signature stamp (D119): the stamp, its `signedOnDay` derivation, the sun
halo, the serif line and the script signature are removed. Edit Profile's medallion shelf is replaced by
the Journey card's `Medallions · N of 12` row, read from `src/lib/album.ts` `useAlbumStanding()` — the
album's own ledger, so the profile and the Medallions page cannot disagree (the shelf's 8-face maths is
deleted). `Weekly reports` moves from Anchors to Reminders as `Weekly report` (frame) and still opens the
report (CRITIC §5); Edit Profile's own `Weekly reports` line is removed (Settings carries the door).
The Settings Weekly Report / Check-in Time boards are the logs / paywall-reminders boards unchanged;
this group keeps only the `?from=settings` wiring (Back and Save return to Settings — driven).

## D292 — `Manage subscription`'s value is the active plan's name, else nothing
`Yearly` / `Monthly` / `Lifetime` (Subscription's own words) while the membership is active; a free
account shows the chevron alone, as the row did before this drop (settings OQ4; no copy invented).

## D293 — Username and Email draw their chevrons and stay display rows
CRITIC §5 (settings Q2): the frame draws chevrons; nothing edits either field, so the rows have no button
role. Name is the one control (it opens the name sheet). The monogram disc is a second door to the photo
sheet (`Profile photo`); the words `Change photo` stay the first.

## D294 — "Re-sign the vow" re-signs, after a confirmation in the sign-out sheet's shell
The frame draws the ghost and nothing after it (OQ 1, CRITIC D-20); the page before this drop had no
re-sign control at all. Re-signing writes a new journal entry `{ tag: 'Vow', title: 'Vow', body: <the
words on the page> }`; the page reads the newest Vow (else the newest Pledge), so `Signed` becomes today
and `Held for` restarts — "It resets the promise, never the progress": no entry is removed or rewritten.
The new entry is an ordinary journal entry, like the morning pledge: it is listed in Past pledges (as
`Vow`) and counts toward the album's Archive (entries) and Vidi (days with a record) — re-signing is
writing something down. A vow already signed today has nothing to restart, so a second `Sign it again`
the same day writes nothing (no Archive inflation by repeated taps; driven: 2 Vow entries after two
confirms on one day). On an account with no Vow and no Pledge the page shows the canvas's sentence as
the vow, as it did before this run (`vow?.body ?? PLACEHOLDER`); re-signing stores exactly the words the
confirmation was given over. The root cause is outside this group: onboarding's `The Vow` (tail,
`O3TheVow`) signs without storing anything. Because one tap would otherwise restart the count, the
ghost opens a confirmation: the `Sheet Sign Out` shell (T 556, gap 10, pill at 96, ghost at 60) with
`Re-sign the vow?` / `It resets the promise, never the progress.` / `Sign it again` / `Cancel` — every
string is already on this page, the slip flow's pledge board, or the photo sheet; no new copy. **Needs the
user's approval** with the other undrawn-state strings (CRITIC D-20).

## D295 — Edit Profile's name sheet edits a draft; the row shows the saved name
Before, the row read the unsaved draft, so a dismissed edit still showed. Now opening the sheet copies the
saved name into the draft; Save writes it (`updateProfile`) and closes; the scrim, Escape, a downward drag
and Android back close without saving. The row keeps `accessibilityLabel="Name, <name>"` (recipes).

## D296 — Pinned clocks remove two data residues the previous run excused
Edit Profile's `Started VICI · 14 Mar 2026` with `Week VI` (D121) holds on 19 Apr 2026; Your Vow Page's
`Held for 92 days` with `Signed Apr 18` holds on 19 Jul 2026. The group's two dated seeds pin those days
(`.overhaul/clock.js`), so both frames diff 0.00 % with the app reading its own live data. D120's Night
9:30 PM (Settings) vs 10:30 PM (Check-in Time) remains a canvas contradiction: `DEFAULT_ROUTINES` is
untouched and each capture seeds its frame's value.

## D297 — Short phones and dynamic copy
Settings, Your vow, Back Tap, Find support: the column between the fixed nav and the fixed bottom control
is a `ScrollRegion` (D320 rule 3); at 393 × 852 Settings fits flush (`paddingBottom 16` = the frame's 17 to
the ghost, less a point) and nothing scrolls. **Your vow** follows `HeroBoard`'s rule (D368) for the flag:
flag and stack rise together within the flag's room above 108 (25 pt), and past it the flag goes. With the
flag gone the stack is **centred in the band it frees** (nav foot 100 → 16 above the ghost, never above
108) instead of rising by the deficit alone: the deficit-only lift left ~180 pt of bare ground over the
card on a 667 phone with the vow pressed onto the ghost (verifier). At 375 × 667 the card now starts at
canvas 190 (90 under the nav's foot, 106 over the ghost). Like `HeroBoard`, flag and stack stay at
opacity 0 until the stack is measured, so a short phone never paints the unlifted layout for a frame
(rAF log: first painted frame is already the final one). Phones from 390 × 844 up draw the frame as is.
**Sheet Sign Out**: its body names the account's own address, and the kit `Sheet` keeps the panel's drawn
height, so an address past ~45 characters wrapped a third line under the pill. Settings measures the body
and raises the panel by what it adds beyond the drawn two lines (`SHEET_TOP.signOut − lift`): the 12 pt
over the pill holds at every length and width (up to the kit's canvas-60 ceiling), and at the frame's address nothing moves (0.00 %). The
pre-drop sheet grew in flow the same way. Edit Profile, Data & privacy and App lock fit 375 × 667 (App
lock scrolls 8 pt). Dynamic values (`Name`, `Username`, `Email`, `Current week`, the plan, All's notes)
ellipsise (`valueLines`, CRITIC C11); fixed copy never does.

## D298 — Unframed screens: Back Tap, Find support, All
Copy is each screen's own (CRITIC G12; straight apostrophes made curly). **Back Tap** after App Lock: 76
ink disc with the app's wave glyph in `#111111`, centred line, `Shortcut link` as one settings row (tap
copies; value `Copy`/`Copied`), the four steps in a ruled `#1E1E1E` r20 card, footnote 13/19 (the shield
glyph dropped — no frame draws one), `Open Shortcuts app` primary at 96 + `Test it now` ghost (was a
secondary button); the column stops 16 above the pill. **Find support** after Data & privacy: nav back
row, h1 + line, the two placeholder resources as r20 cards (still visibly `[PLACEHOLDER]`), the build
note as the footnote, `Back` as the ghost at 48. **All** in the Settings idiom with its own back row —
the drawer left the tab bar (D385), so without one a long press on Today led into a page with no exit.

## D299 — Toggles: the kit's frame-variant on state and D322's off state
Pause analytics and the three App-lock switches are kit `Row toggle=` rows (the row is the switch, role
`switch`, `aria-checked`); ON = ink track + `#1E1E1E` knob (frames), OFF = `#2E2E2E` track + ink knob at
left 3 (D322). Every switch writes through `useUpdateSettings` as before (driven: flips and stores).

## Verification (393 × 852, Lato loaded, strips looked at)

| frame | pxdiff | residue |
| --- | --- | --- |
| Settings | 0.00 % (0 px) | — |
| Sheet Sign Out | 0.00 % (0 px, status bar ignored) | — (a long address raises the panel, D297) |
| Edit Profile | 0.00 % (2 px) | — |
| Sheet Profile Photo | 0.00 % (0 px) | — |
| Sheet Edit Name | 0.01 % | the drawn 2×22 caret (D364) |
| Your Vow Page | 0.00 % | — (flag drawn) |
| Data Privacy | 0.00 % (4 px) | toggle track edge AA |
| App Lock | 0.00 % (6 px) | toggle track ends AA |
| Settings Check-in Time (via Settings) | 0.00 % | paywall-reminders' board |
| Settings Weekly Report (via Settings) | 0.01 % | logs' board, reached by tapping the Settings row on logs' dated seed; the `W` day label sits ~0.5 px right |

## Phase 2 review (fresh audit, three size sweeps, unframed screens)

Every frame re-audited (`audit-fast.mjs --group=settings`) and swept at 375 × 667, 390 × 844 and 430 × 932
with `--scroll`; every strip and size PNG looked at. Frames unchanged: Settings, Edit Profile, Sheet Profile
Photo, Your Vow Page, Sheet Sign Out, Settings Check-in Time 0.00 %; Data Privacy / App Lock 0.00 % (2 + 4 px of
toggle-track anti-aliasing); Sheet Edit Name 0.014 % (the drawn 2 × 22 caret, D364); Settings Weekly Report
0.012 % (logs' board: the `W` day label ~0.5 px right, line/dot anti-aliasing).
* **Back Tap** (unframed): step 4's arrows now hold to the name before them (no-break spaces), so no line
  opens on `→` — 393 broke `Touch | → Back Tap`; every width now ends its lines on the arrow.
* **Carry-over** (All → `A rough-day protocol`): the row already pushes `?key=loneliness`; driven from All
  it opens the Loneliness protocol (`Lonely tonight.`).
* **D340**: every Settings row's screen comes back to Settings through its own Back, Settings back to
  Today, and the All drawer's seven doors into this group back to All (drives in the recipe).
* Seen and left: at 375 × 667 Settings' column (D320) stops in the gap above the Account group, so at rest
  nothing of `Edit profile` / `Manage subscription` shows above `Sign out` — the kit ScrollRegion hides its
  indicator; asked of the orchestrator as a kit-level cue rather than a one-screen fix. At 393 × 852 Back
  Tap's column stops just under the `Shortcut link` caption, so at rest the caption sits alone over the
  pill (its row and the footnote scroll into view).

## slip — decisions (D300–D309), Vici Overhaul Phase 1 — `slip`

Group: the twelve `98 · RELAPSE — POST-SLIP` boards (98A–98L) and the nineteen cards (99A–99H, 100A–100K),
all at `/slip`. Files: `src/app/slip.tsx`, `src/components/slip/kit.tsx`, `src/content/slipCards.ts`
(`src/components/slip/art.tsx` deleted — nothing imported it). Evidence: `.overhaul/recipes/slip.json`
(31 frames, every one 0.00 % pxdiff at t=24 against `.overhaul/shots/design/Email-Login/<Frame>.png`).

## D300 — The flow is built from the kit; two local layouts cover the boards `HeroBoard` does not
Twenty-six frames (98A, B, G, H, I, K, L and the nineteen cards) are the kit's `HeroBoard` with no
overrides beyond `tone="dark"` on 98I and the nav kicker on the cards. The five others are two layouts in
`slip/kit.tsx`, both composed of kit parts only: `SlipQuestion` (98C, 98D, 98F, 98J — `NavBar`, the
optional decorative `Hero` drawn **before** the stack as the frames paint it, a `ScrollRegion` from the
nav row's bottom edge (100) to the controls with the stack at 136, `PrimaryButton` at 48 or 96 over a
`GhostLink`) and `SlipDone` (98E — `CheckDisc` 84 at 200 and the centred stack at 308 in the same band).
On short phones (D320) the bottom heroes pass `controls` and drop out, and the band scrolls; at 393 × 852
nothing moves and nothing scrolls. The old paper kit (`SlipPage`, `SlipSheet`, `SlipFedTile`,
`SlipAnswerRow`, `SlipPledgeCard`, `SlipBeginSky`, the sixteen bespoke drawings) is gone; `SLIP_FED` and
`FedName` survive as data, with `FED_FEELINGS` moved beside them.

## D301 — 98C: the wheel is always open and shifts the moment
The frame draws the kit `TimeWheel` inline under the caps label "Or choose a time" (CRITIC §5: slip Q1), so
there is no "Choose a time" control and no Cancel/Save. Each settled column step moves the slip's moment by
`delta × (1 h | 1 min | 12 h)` — the old wheel's `onShift`, so 11:59 → 12:00 carries the hour and the day
as it always did — and the result is clamped to the moment the screen opened (`now`): a picked time is never
in the future, and the wheel rolls back to the clamped value (D362). Any wheel or date change clears the
chips (no chip lit: the undrawn state, all three `#1E1E1E`); tapping a chip restores its preset. The
presets are slip's own copy of the three `WHEN_CHIPS` — slip no longer imports anything from
`src/app/urge-log.tsx` (D309).

## D302 — 98E reads the frame's format; an empty row is left out
`When` is `dayPartTime(at, now)` ("Tonight, 11:40 PM", "Last night, 11:40 PM", "Jul 20, 9:05 PM"); the
feelings and situations rows are `joinLower(...)` ("Phone in bed, late night"). Storage keeps the
`' · '` join (`trigger: "Tired · Phone in bed · Late night"`) — Log, insights and the weekly report read it.
A row whose value is empty (no feeling picked, or no situation) is omitted instead of printing "—", as
Lapse Done draws fewer rows (slip Q5's recommendation). The change line is unchanged: the first picked
trigger card's `change`, else the first card's.

## D303 — "Change" on the date row opens a day sheet
No frame draws what Change does (slip Q2). It opens the kit `Sheet` with seven kit option rows — today and
the six days before — each labelled `dayPartDate(day at the picked time)` ("Tonight, Tue Jul 22",
"Last night, Mon Jul 21", "Sun Jul 20" …), the current day selected; no title, so no invented copy (G12).
Picking a day keeps the wheel's time, clamps to now (D301) and closes the sheet 260 ms later (the
funnel's auto-advance beat). Panel top 282: the seven rows (7 × 58 + 6 × 12) under the content column's 44
end at 804, where a primary's bottom edge sits. It replaces the old wheel's date column, whose ±2 days
could step into the future; scrim tap, drag and Escape dismiss it as every kit sheet.

## D304 — Copy and state changes the frames make
CTA renames per the frames: 98B "Closed", 98H "Turn it around", 98I "Phone is away" → **Continue**;
98D "Continue · N" → **Continue**; trigger cards Late night / Scrolling / Sexual content / Argument /
Couldn't sleep / Being alone / Not sure → **Continue** (Boredom, Loneliness, Stress and every feeling keep
**Done**) — kept as data in `slipCards.ts`. The cards gain the nav kicker ("After the slip" / "What fed it",
`SLIP_KICKER` by `kind`); 98F gains the sub "Honest answer. It changes what comes next."; 98K gains the ✕;
98I is the `#111111` tone. 98D's Continue stays gated until one chip is on, drawn as the kit's dimmed pill
(D321, `aria-disabled`); 98F's answer stays optional and starts with none selected.

## D305 — "I'm already watching again" still opens `/urge-hub`
D149's text says `/urge`, the code has always done `router.replace('/urge-hub')`, and no frame or ruling
moved it (slip Q6 is open). Kept as the app does it: the hub is the screen built to hold someone mid-urge.
If the orchestrator rules for `/urge` (sos-flow's first-90 entry), it is a one-word change in `slip.tsx`.

## D306 — Native line breaks (D332)
Three fixed headlines carry `\n`: 98F "Do you still want\nto keep watching?", 100H "Get out of bed
for\na few minutes.", 100J "Change what\nhappens next." — web balances to the same lines. Every other run
uses the kit's per-variant wrap (h1/title balance, p pretty, the pledge sentence unwrapped — `PledgeCard`
sets none).

## D307 — Recipes run on a pinned, ticking clock
`.overhaul/slip-seed{0,1,2}.js` and `slip-seed-nopledge.js` = `window.__CLOCK = '2025-07-22T23:40'` +
`__CLOCK_TICK = true` + `.overhaul/clock.js` + the old account datasets. Pinned to the frames' Tue 22 Jul
2025 so 98C's date row and 98E's stamp read as drawn; ticking because RN's Animated timing reads
`Date.now()` — frozen, a press scale or a wheel settle never finishes. The old `f-slip-seed*-2340.js`
pinned only the hour (today's date) and are superseded.

## D308 — A failed save does not throw
`save()` wraps the event write and the letter flag in `try/catch` (relapse.tsx's pattern): no frame draws a
failure, the flow carries on, and an offline write can no longer raise an unhandled rejection. The
`saving` re-entry guard and the "discount this run's own event" count are unchanged.

## D309 — slip imports nothing from `src/app/urge-log.tsx`
The eight symbols slip borrowed (`FlowTop`, `GRID_GAP`, `GRID_GUTTER`, `LoggedNote`, `PrimaryButton`,
`TimeWheel`, `triggerTileWidth`, `WHEN_CHIPS`) are replaced by kit parts and a local `WHEN_CHIPS`, so the
logs group may drop or rename them without breaking `/slip`.

## Phase 2 amendments (the slip range D300–D309 is full; these amend D300 and D302)

**D300, 98E on short phones.** The check disc is 98E's art, so a short phone now treats the board as a hero
board (D320 rule 2) instead of scrolling it from canvas 200: disc and stack rise together by the deficit
(`200 + h + 24 − controlsTop`), never above canvas 108, and only what still does not fit scrolls. At
375 × 667 the four-row sample card now sits whole above the pill (foot 16 pt clear; the band keeps 12 pt
of end padding to scroll) — the same treatment logs' Lapse Done gets from its `useLift` — where before the
third row met the pill at 200 and the fourth was below the fold. Hidden until measured, as `HeroBoard` is,
so it never jumps. At 393 × 852 the lift is 0 (audit 0.00 %).

**D300, question boards on short phones.** `SlipQuestion` (98C, 98D, 98F, 98J) now does the same before it
scrolls: once the bottom hero has dropped, a stack that would end within 24 pt of the controls rises by the
deficit, never above canvas 108. 98C at 375 × 667 rose 14 pt and no longer scrolls — the date row sits 24 pt
over the pill, as logs' Lapse When (the same board, `useLift`) already did, so the two When boards agree on
a short phone; a three-line pledge on 98J rises 28 and then scrolls. At 393 × 852 the lift is 0.

**D302, no orphan in 98E's values.** The values wrap greedily (the frame states no `text-wrap`), so at
430 wide "Phone charges outside the / bedroom" stranded a word. The last two words of each value are now
joined by a no-break space (`noOrphan` in `slip.tsx`, display only — storage is untouched). Every break
the frame draws at 393 already ends on a pair, so 393 is unchanged (audit 0.00 %); at 430 it reads
"Phone charges outside / the bedroom", at 375 "Phone charges / outside the bedroom".

**Back paths under D340.** Re-checked: hub "I slipped" → ✕ returns to the hub; All → Post-slip flow → ✕
returns to All; 98K "Start again" and 98L "Later" replace to Today, "Check in" to the morning check-in;
98F's still-watching answer replaces to the hub. No change needed — slip is a root-stack route and its ✕ is
`router.back()`.

<!-- vici-overhaul-decisions:end -->
