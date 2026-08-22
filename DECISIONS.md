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
