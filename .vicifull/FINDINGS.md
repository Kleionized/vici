# Findings held by the orchestrator, for the fix pass

## F1 — `curriculum84.ts` is generated from a bundle two drops old, and its generator no longer fits

`src/content/curriculum84.ts` still carries the field mapping of the **Aug 2026 `latest UI`**
bundle. Re-running `scripts/vicifull/gen-curriculum.mjs` against `Latest Vici FULL` produces
garbage (`title` gets the intro sentence, `label` empties, `done` becomes "Continue"), because
the `Task DNN Intro` frame changed shape between drops:

```
latest UI  : Close | DAY 1 · TONIGHT’S TASK | Surviving the night | Set up tonight … | Done when … | Continue
Latest Vici: Close |                          Surviving the night | <340×200 scene> | Set up tonight … | Done when … | Continue
```

The eyebrow (`DAY N · TONIGHT’S TASK` / `TODAY’S TASK`) was **withdrawn**, and a 340 × 200
illustration was **added** between the title and the intro sentence. `Task DNN Options` still
carries the board title (`Match where you sleep`) and `Mark as done`.

So two things are wrong today: the app still draws an eyebrow the canvas has dropped, and the
generator cannot be re-run until its reader is taught the new shape. **Fix the generator, then
regenerate** — do not hand-edit `curriculum84.ts`. I reverted my own regeneration for exactly
this reason.

## F2 — the lesson cover scene's sun is drawn wrong

`/lesson/day/2` page 1 vs `Week-01-Reset/L2-Frame-01.html`. Everything matches except the
cover scene:

* the design draws a small crisp golden disc (~22 px) with a tight radial halo and a
  `0 2px 6px rgba(160,120,50,0.3)` drop shadow; the app draws a ~85 px pale, blurred blob and
  no shadow.
* the design's ground shadow is a soft, wide, faint ellipse; the app's is a distinct dark
  ellipse sitting on the hill.

The signature diff reports it as seven rows whose `background` and `border-radius` are present
on the design side and `-` on the app's — i.e. the app is drawing those layers as SVG shapes
where the canvas states CSS boxes with radial-gradient fills and a `filter: blur()`. The
`COVER_SCENE` data in `src/content/coverScene.ts` is transcribed correctly; the renderer is
what loses the gradient stops and the shadow.

## F3 — CORRECTED: the regeneration I ran silently dropped 207 runs of copy

`scripts/vicifull/gen-lesson-scrolls.mjs` re-run against this drop rewrote
`src/content/lessonReader.ts`: **1,398 → 1,858 pages**, and the type ramp was restyled
(28/40 → 24/32 on the headings, 21/36 → 17/26 on the body). That matches the bundle's own new
`restyle-lessons.js`. `lessonPlates.ts`, `readerRoom.ts`, `taskScenes.ts` and `weekScenes.ts`
regenerate byte-identical apart from their rebuild-command comment, so those four are
confirmed unchanged by this drop.

**That last sentence stands. The claim that the `lessonReader.ts` regeneration was correct does
not.** The `lesson-scrolls` agent found that `gen-lesson-scrolls.mjs` classifies page parts **by
font size**, and this drop's `restyle-lessons.js` moved every number it keys on. Re-running it
against the new bundle therefore emitted:

* **0 cascades instead of 28** — 50 runs of copy lost outright (`Ninety days.`, `The rest of your
  life.`, `Not for the next three months.`, `Before the tab.` and 46 more);
* **0 questions on 75 pick boards**;
* **0 titles on 82 task-options boards** (`Match where you sleep` and its 81 siblings).

207 runs of copy, across all 84 lessons, not just the group that found it. The cascade loss is a
regression **I introduced** by running the generator without re-verifying its classifier against
the restyled frames; the mark-table swap below is older and shipped in the committed file.

Two further generator bugs the same agent found and fixed:

* the mark table had `240 × 96` (bed) and `240 × 100` (sunrise) **swapped**, so lesson one drew the
  bed where the frame draws the sunrise on page 9 and the reverse on page 14 (D087);
* the room scene's open door lost its `skewY(-7deg) / transform-origin: top right` and rendered as
  an upright slab (D090).

The generator now classifies on **shape**, not on size, and `lesson-verify.mjs` reports 1,858
frames with the copy restored. **Lesson: a generator that keys on type metrics cannot survive a
restyle, and re-running one is not free — its output has to be verified against the frames it was
generated from, not assumed.**

## F4 — the reader's progress hairline is computed, not transcribed

`src/components/lesson/scroll.tsx` draws the hairline as
`width: \`${Math.round(((index + 1) / count) * 100)}%\``. The canvas states a percent on every
one of the 1,858 frames and `lessonReader.ts` already carries it as `page.progress` — and the
two disagree. Lesson 2 page 4: canvas `progress: 12` → 43.3 px; the app computes 4/32 = 13 %
→ 46.9 px. The first four pages of lesson 2 are stated as 3, 6, 9, 12 — a ramp the frames
author, not a linear one.

Fix: pass the page's own `progress` down and use it. Every reader page in the app is currently
a few points out on this row.

## F5 — lesson one is authored twice in this drop and only one copy carries the restyle

`Lesson 1 Surviving the Night.dc.html` (26 frames, **all 26 changed** in this drop) and
`Email Login.dc.html`'s `Lesson Scroll 1…26` (**all 26 unchanged**) draw the same 26 pages with
the same words. They now disagree on type:

```
Lesson 1 …/L1-Frame-07 : gap 22, 20/28 runs, progress 26%
Email-Login/Lesson Scroll 7 : gap 48, 22/32 runs, progress 27%
```

The restyle in the bundle's own new `restyle-lessons.js` (26/38 → 24/32, 28/40 → 24/32,
28/44 → 26/39, 21/36 → 17/26, and the gap rules) was applied to `Lesson 1 …` and to all twelve
week canvases, and **not** to Email-Login's copies. So the Email-Login `Lesson Scroll` frames
are the pre-restyle leftovers and `Lesson 1 Surviving the Night` is the current authoring.

**Decision taken:** build lesson one from `Lesson 1 Surviving the Night`, which is what
`scripts/vicifull/gen-lesson-scrolls.mjs` already does. Recorded here because it means 26 of the
267 Email-Login frames are deliberately NOT matched, and a later audit will otherwise read that
as 26 misses.

## F6 — `Task DNN Card` is a design catalogue, not an app screen (168 false "missing" strings)

The 84 `Task DNN Card` frames in `Lessons and Tasks` each draw two cards side by side under the
eyebrows `HOME · TODAY’S TASK` and `NIGHT · REMINDER`. Neither eyebrow appears on the screens
Email-Login draws for the same two places:

* `Today Home Task` labels its card with the lesson title (`Surviving the night`), no eyebrow.
* `Night Action Reminder` heads the page `Tonight’s action`, no eyebrow.

Email-Login draws the app; `Lessons and Tasks` is the card catalogue that feeds it. The app
follows Email-Login, which is what DECISIONS D008 already rules for a screen-versus-record
conflict. So the 168 sweep misses for those two strings are expected, not defects.

## F7 — housekeeping to do before this run is called finished

* `src/app/hz-parity.tsx` — a temporary parity harness an agent added for the handover group.
  It is a real Expo route, so it ships. Delete it.
* `src/components/lesson/reader.tsx` and `src/app/lesson/day/[day].tsx` head comments still say
  the bundle authors **1,398** pages. This drop authors **1,858**.
* `scripts/vicifull/gen-dry.mjs` — my own dry-run copy of the lesson generator. Delete it.
* `DECISIONS.md` D001 names `UI Final 1/` as the bundle folder; this run's is
  `Latest Vici FULL/`. The decisions log needs its D046+ entries for this drop.

## F8 — two cross-cutting platform findings from pass 1 (reported by the auth and handover agents)

**SUPERSEDED BY F12/D064 — read that first.** A `RadialGradient` *does* reach the DOM correctly
when it is given `r` as well as `rx`/`ry`. The original (wrong) conclusion is kept below because
several agents reached it independently and will cite it.

**`RadialGradient` radius cannot reach the DOM on web.** `react-native-svg`'s web build forwards
only `rx`/`ry`, which are not SVG `<radialGradient>` attributes, so every browser falls back to
`r = 50%`. Any farthest-corner gradient the canvas writes (`radial-gradient(circle at 38% 30%, …)`
→ r ≈ 93.5% of a square box) is therefore **correct on device and inert in the web preview**, and
the headless capture renders those fills visibly darker than the canvas (measured on the medallion
face: 201,159,95 against the canvas's 224,185,120 at the rim). This affects every radial gradient
in the app. Consequence for this run: colour on a radial fill cannot be verified from a web
screenshot — it has to be read out of the source.

**`text-wrap: pretty` changes where lines break.** `src/components/ui`'s `AppText` sets it by
default; most frames state none, and on at least two screens it rebalanced a paragraph and moved a
word to the next line. Where a frame states no `text-wrap`, the app must not impose one.

Both are `src/components/ui/` concerns, i.e. shared by every group — worth one deliberate fix
rather than seventeen local ones.

On `text-wrap` specifically: it is a web-only property, so it does nothing on device either way.
`AppText` applies `balance` to the three heading variants and `pretty` to everything else, on web
only, *before* the caller's own style — so a caller can override it. Keeping each screen's value
equal to what its frame states is therefore not cosmetics for its own sake: it is what makes the
headless web capture a faithful proxy for the frame. Where a frame states no `text-wrap`, set
none.

## F9 — what the `week-lessons` group actually has to do

That group has no `Email-Login` frames, so `.vicifull/GROUPS.md` lists none for it. Its work is
the twelve week canvases (`Week-01-Reset` … `Week-12-Leave-It-Behind`, 1,832 frames) plus
`Lesson 1 Surviving the Night`, and it is mostly **generator** work, not screen work:

1. **Already done by the orchestrator, do not redo:** `scripts/vicifull/gen-lesson-scrolls.mjs`,
   `gen-lesson-art.mjs`, `gen-reader-art.mjs`, `gen-week-scenes.mjs` and `gen-task-art.mjs` have
   been forked onto `.vicifull/lessons/` and re-run. `lessonReader.ts` and `coverScene.ts` changed
   (see F3); the other four regenerate byte-identical. **Verify** the output renders — do not
   hand-edit it.
2. **Open:** F1 (`curriculum84.ts` / `gen-curriculum.mjs` — the task intro frame's shape changed),
   F2 (the cover scene's sun and ground shadow), F4 (the progress hairline must use the frame's
   own `progress`, not `(index+1)/count`).
3. **Then verify by sampling, at scale.** 1,832 frames is too many to open one at a time, but
   `scene.mjs` groups them: Week-01 has 169 frames in **15 distinct structures**, Week-12 has 147
   in 13. Verify one frame of every distinct structure in every week, plus every frame of at least
   one whole lesson end to end, and say which structures you sampled and which you did not.
   `node scripts/vicifull/shot.mjs design Week-01-Reset L2-Frame-04.html …` renders any of them.

## F10 — spec file numbering has drifted from the design's own badges

`specs/` is numbered by the *previous* drop's screen order, and this drop renumbered onboarding.
The auth agent's new file is `specs/03-welcome-back.md`, but the canvas's own badge for that frame
is **02B** and `specs/03-name.md` already holds badge `03 · Name`. The badges are in
`.vicifull/FLOW.txt`. Renumber the spec files to the canvas's badges at the end of the run, or the
next drop inherits two numbering schemes.

## F11 — the medallion post delivers a face the album no longer has (cross-group, for `letters`)

Reported by the `medallions` agent after it rebuilt the album to the canvas's twelve faces.
`src/app/medallion-post.tsx` and `src/app/(app)/_layout.tsx` still deliver **"Back on Deck"**
with the chip `Tier II · The Return`, gated on `tideline.post.backondeck.pending/delivered`.
`Back on deck` was dropped from the album two drops ago, and frame #45 `Medallion Received` now
draws **Veni** — "Your first medallion. You started." — with the `MEDALLION EARNED` eyebrow and
the tier chip both withdrawn (`.vicifull/fdiff/Medallion-Received.diff`).

So the post screen is wired to a face the album cannot show. It belongs to the `letters` group's
files, which is why the medallions agent left it. Fix it there.

## F12 — two fixes from the `today` group that should be swept app-wide

**D064 supersedes half of F8.** A `react-native-svg` `RadialGradient` *does* reach the DOM
correctly if it is given `r` alongside `rx`/`ry`; without `r` the web build silently falls back
to 50%. So the farthest-corner radials the canvas writes ARE verifiable and ARE currently wrong
on web — `today.tsx` now passes `r="94.8%"`. Every screen with a `circle at x% y%` gradient needs
the same treatment: `handover` (medallion face, wax seal, the vow's sun), `medallions` (every
coin), `paywall`, `plan`, `auth`. Sweep it.

**D065 — `onMomentumScrollEnd` is never emitted by `react-native-web`.** A horizontal pager that
tracks its dot from that event is stuck on page one in the web preview, which means **the sibling
frames of that pager are unreachable to a capture and may have gone unverified**. `score.tsx` has
been moved to `onScroll`. Three more still use it:

* `src/app/urge-overview.tsx:87` — frames `Urge Overview`, `… Mood`, `… When` (group `logs`)
* `src/app/weekly-report.tsx:131` — frames `Weekly Report Days`, `… Urges` (group `logs`)
* `src/components/routines/wheel.tsx:112` — the check-in time wheels (group `paywall`)

Any group that reported one of those frames as verified should re-check whether it actually
captured page 2 or page 1 twice.

## F13 — DECIDED: `03 · Name`'s Back row gets drawn, reversing D016

`V3 Q24 Name` draws a Back row — chevron `11 × 19`, `stroke rgba(244,243,240,0.75)`, "Back" at
17/400 in the same colour, at `left: 16, top: 94, gap: 9`. The app omits it under D016, whose
reason was that the account has just been made and `src/app/(auth)/_layout.tsx` redirects a
signed-in user out of the auth stack, so the control would loop. The `funnel` agent measured it:
it is **the only visible element in that whole group that does not match the canvas** (51 flat
pixels; every other frame in the group is at 0).

The brief for this run is literal parity — "exact element positions … even if they are only a
few pixels or one changed word". So: **draw it.** The behaviour that makes it non-looping is to
let the auth door render while onboarding is incomplete, so `router.back()` from `03` lands on
`02 · Login` rather than being bounced forward again. One line in `welcome.tsx` reinstates the
row; the redirect guard in `(auth)/_layout.tsx` needs the onboarding-incomplete exemption
alongside it. Supersede D016 with a new entry rather than editing it.

## F14 — dead code to remove at the end of the run

* `src/components/onboarding/v3.tsx` carries **22 exported screens (~900 lines)** for boards this
  drop withdrew: `O3PushIntro, O3Threshold, O3Privacy, O3Door, O3CurrentPattern, O3Reversal,
  O3PlanReady, O3Handover, O3Streaks, O3CampaignLine, O3ReadingPause, O3Root`, and the rest the
  `funnel` agent listed. Nothing routes to them.
* `.vicifull/wtmp/` — the `weeks` agent's measurement helpers (`imgdiff.mjs`, `imgwhere.mjs`,
  `px.mjs`, `crop.mjs`, `cmp-scenes.mjs`). Run artefacts, not app code, but delete them.
* The per-group capture wrappers agents wrote before `--initseed` landed in `shot.mjs`
  (`.vicifull/dayshot.mjs`, `todayshot.mjs`, `mshot-medallions.mjs`, `funnel-cap.mjs`) can go once
  their recipes are normalised onto the shared tool.

## F15 — following the canvas removes the last tap-reachable route to crisis support

The `settings` agent removed the `Find support` row because `Settings.html` draws exactly two
rows in the Privacy card (`4+50+1+50+4 = 109`); the third made the card 160 and pushed the whole
Account group 51pt down. That is correct for parity, and the row is gone.

The consequence is worth stating plainly. **The canvas draws no support, help or crisis entry on
any of its 267 frames** (checked: the only matches for support/help/crisis/emergency across every
frame's text are prose inside the Week XII letter, the paywall's "help" benefit, an Urge Overview
sentence, and "SOS support" on the Yearly Drop). `/(app)/support` still exists and is still linked
from `/(app)/all` — but nothing in the UI links to `/(app)/all` either (D024 took it out of the
tab bar), so after this change the route is reachable only by typing a URL.

A previous run recorded a hard product invariant requiring a standing route to crisis help
(`prior-runs/UI_FINAL/DECISIONS.md`, invariant #5). This drop's design does not provide one.

**Taken for this run: follow the canvas.** Inventing a control the design does not draw would
break the parity standard this whole run exists to meet, and choosing what a recovery app shows
people in crisis is the user's call, not mine. Flagged at the top of the final report so it is a
decision they make knowingly rather than a regression they discover. `/lifemap` is in the same
position — it lost its Edit Profile link and is likewise only in `/(app)/all`.

## F16 — `SignaturePad` / `SignatureMark` are dead once the vow card goes

`Your Vow Page` was redesigned: the white signature card is gone and the canvas types the first
name in a script face. That was the last drawing surface, so `src/components/ui`'s `Signature*`
exports and `UserSettings.signature` are now written and read nowhere. The canvas types the name
in a hand on all six frames that show a signature. Delete them in the cleanup pass — they are in
a shared file, which is why the settings agent left them.

## F17 — DECIDED: the Log Chooser gets its own route outside the tab group

`Log Chooser` (badge 90) draws **no tab bar** and puts its pill at 744–802. `Log Urges`,
`Log Check-ins` and `Log Reports` (91 / 91-2 / 91-3) all draw the bar starting at 769 with `Log`
active. Both cannot be the Log tab's root — the pill would sit 33pt under the bar. The canvas's
own flow order puts the chooser first (90 → … → 91), and that reading gives both controls a
destination: the chooser's close X opens the log, the log's Back returns to the chooser.

The `logs` agent kept the existing structure and hoisted the pill flush above the bar, which
renders it at 711 instead of 744 — the one standing signature miss left in that group — and
flagged the routing change as out of scope.

**Taken: do it properly in the fix pass.** Move the chooser to its own route outside `(app)` so
it draws no tab bar and its pill lands at the canvas's 744. A 33pt miss on the primary entry to
a whole section is exactly the kind of thing this run exists to close, and the flow the canvas
draws is unambiguous.

## F18 — two groups independently reached the same read on `Settings Weekly Report`

`settings` (#200) and `logs` (#188) both concluded that `Settings-Weekly-Report` (badge 93D) is a
partially-updated stale copy: it kept the desk lamp, `Your week at a glance` and the three chips
and received only this drop's automated section-title restyle (20/600 → 19/500), while
`Weekly Report`, `… Days` and `… Urges` (91C / 91C2 / 91C3) were all rebuilt around a 361 × 106
stats card. One route renders both. Three frames to one, and the 91C family is internally
consistent — so 91C wins and 93D will not match. Agreed; no further work, but it should be a
numbered decision rather than two agents' notes.

## F19 — the `slip` group was entirely unbuilt, and my file mapping for it was wrong

31 frames (`Slip Entry` … `Slip Trigger Not sure`) had **no implementation at all**. The app-file
line I wrote for that group in `.vicifull/GROUPS.md` — `relapse.tsx`, `roughDays/kit.tsx`,
`rough-protocol.tsx`, `rough-first90.tsx` — was keyword-matching, and not one of the 31 frames
maps to any of them:

* `relapse.tsx` draws frames **#115–#118** (`Relapse Log / Twice / Resign / Begin`), which belong
  to the `sos` group and which that agent already edited this run. Those are genuinely different
  screens from the Slip family — `Relapse Log` puts its art at 180 and its headline at 398 under
  a different drawing with the ghost link "Back to the wave tool"; `Slip Entry` puts them at 170
  and 446 with a phone-under-a-moon and "Not now".
* `roughDays/kit.tsx`, `rough-protocol.tsx`, `rough-first90.tsx` serve the Rough Days library, and
  **no `Rough *` frame exists in any of this drop's 18 bundles.** Those screens are app-only.

The agent built the flow fresh at `/slip` (`src/app/slip.tsx`, `src/components/slip/kit.tsx`,
`src/components/slip/art.tsx`, `src/content/slipCards.ts`) and left `relapse.tsx` alone. All 31
frames now diff clean apart from the standing wash/radius equivalences, and all nineteen response
cards were driven and captured individually rather than sampled.

**Lesson for the audit:** a group whose frames are all `[identical]` is not evidence of anything.
Three of the four largest gaps this run found — the medallion album, the urge hub, the whole slip
flow — were in groups marked `[identical]` throughout. "Identical to the previous drop" and
"built" are unrelated facts.

## F20 — HIGH: hard-coded SVG gradient ids make artwork vanish when a screen is pushed over another

Found by the `auth` **verify** agent, and missed by the implementer, because it only appears on
the path the bundle actually designs. `03 · Welcome Back` reached by its own URL is pixel-clean.
Reached the designed way — `02 · Login` footer "Already have an account? **Sign in**" — it loses
**all three radial washes**: the top warm wash, the low wash, and the laurel's 190 halo. The
largest single difference is Δ49/255 over a 132 × 133 box centred on the mark.

Cause: `Wash` in `src/components/auth/kit.tsx` hard-codes its gradient ids (`ad-warm`, `ad-low`,
`ad-mark`); expo-router keeps `/sign-in` mounted under the pushed screen with `display: none`, so
the document carries two `<radialGradient id="ad-warm">` and `url(#ad-warm)` binds to the **first**
— the hidden one — which paints nothing. Verified in the DOM: six radialGradients, the first
three inside a `display: none` subtree. Persists at 4 s, so it is not a transition. It resolves
itself on `router.back()` when the duplicate unmounts.

This is a web-build defect — `react-native-svg` scopes defs per `Svg` root on iOS and Android —
but **it corrupts this run's own verification method**, and the signature diff cannot see it: the
box is right, only the paint is gone. It is the same failure class as the SVG paint-order trap in
the brief.

**Scope.** 21 files hard-code SVG ids. A collision needs two instances of the same art mounted at
once, which is exactly what a push does:

* `src/components/auth/kit.tsx` — confirmed broken on Welcome Back, `/sign-up?step=form`, and the
  address / password / verify boards (the D047 screens).
* `src/components/ui/Waterline.tsx` — `SplashScene` renders on both `/` and `/(auth)/splash`.
* Any lesson, slip, urge or onboarding art component reachable from a screen that also draws it.

`score.tsx`, `weekly-report.tsx`, `today.tsx` and `(app)/log.tsx` already derive ids from
`useId()`. **Fix: do that everywhere, in all 21 files, and re-verify each affected screen on its
pushed path rather than at its URL.**

## F21 — captures must wait for interactivity, not just for networkidle

Same verifier: the auth doors are **not interactive at `networkidle`** — `tap()` silently no-ops
for roughly the first 1.5 s, which is almost certainly how the implementing agent's own driven
check missed F20. Every recipe that drives a screen needs `await __sleep(1500)` before its first
tap, and `shot.mjs` should probably do that itself.

## F22 — the `handover` verifier disproved that group's own "could not match" claim

The `handover` implementer reported that a `RadialGradient`'s radius "cannot reach the DOM through
the public component" and left three farthest-corner gradients unfixed. Its verifier read the live
DOM and disproved it: on web `RadialGradient` is `elements.web.js`'s `WebShape` (tag
`radialGradient`) and `prepare()` copies unknown props straight onto the node, so `r` **does**
reach the DOM. This is already D064, and **two sibling files the same agent had open already carry
the fix with the explanation** — `src/app/letter.tsx:419` (WaxSeal) and
`src/app/medallion-post.tsx:177` (md-face), with `src/app/vow.tsx:86` stating it verbatim.

Five currently-visible defects follow, all in `src/components/onboarding/handover.tsx`:

1. `letSeal` (#43 wax seal) — states only `rx`/`ry`, renders at r 50%. Measured Δ51 upper-left,
   Δ30 at the rim.
2. `medFace` (#46 medallion) — same. Measured Δ53, Δ26, Δ21.
3. `vowSun` (#45) — same.
4. **The inset rim lights are not drawn at all.** `handover.tsx:188` and `:433` put
   `inset 0 0 0 3px/4px rgba(255,255,255,0.25)` on the wrapper View and then paint the face with
   an absolutely-positioned `<Svg>` child, which CSS paints *above* the parent's inset shadow.
   `letter.tsx` solves exactly this with `insetOf(shadow)` re-painted on an overlay above the art.
   The coin currently reads as a flat darker ball rather than a lit struck disc.
5. **The three Campaign Map frames smear their paper grain.** They draw it through
   `src/components/onboarding/art.tsx:54`'s local `Noise`, which is `expo-image` with
   `contentFit="cover"` — that magnifies the 96 × 96 tile about 8.9× across a full screen.
   `src/components/ui/Grain.tsx` exists precisely to avoid this and documents why (RN's own
   `Image` has `resizeMode="repeat"`; expo-image has no repeat mode). The signature diff is clean
   while the texture is visibly wrong — this project's known failure mode.
   **`Noise` is used 13 times in `art.tsx`, so this is not confined to the Campaign Maps.**
   Replace the local `Noise` with `Grain` throughout and re-check every onboarding board.

Together with F20, the lesson is that the adversarial second pass is doing the work it was added
for: both defects were invisible to the signature diff, and both were in groups whose implementer
had reported them clean.

## F23 — HIGH, cross-cutting: SVG fade stops must repeat the opaque stop's RGB

The `tail` verifier proved this numerically. The canvas writes
`radial-gradient(closest-side, rgba(180,170,150,0.14), rgba(19,19,19,0) 72%)`. **CSS interpolates
premultiplied**, so the RGB stays 180,170,150 all the way out and only the alpha falls — the
`rgba(19,19,19,0)` is a null. **SVG interpolates non-premultiplied**, so a
`<Stop stopColor="#131313" stopOpacity={0}>` ramps the RGB toward black as the alpha falls and
paints the wash with a dark tint.

Measured in isolation at r = 0.20 / 0.40 / 0.60 of the ellipse: CSS gives 243/246/249, the SVG with
a `#131313` fade stop gives 239/241/245, the SVG with a `#B4AA96` fade stop gives 243/246/249 —
**the same-RGB stop is exact to 0/255, the canvas-literal one is up to 5/255 dark.** On the tail
frames this is the whole difference: the two frames that do not draw `TailField` sit at mean
|Δ| 0.13 and 0.05, the six that do sit at 0.87–5.13.

This is DECISIONS D048's rule, which already fixed exactly this for a 5/255 halo on Splash and
Login — D048 even states the condition ("both stops name the same RGB"). It was not applied where
the canvas itself names a different colour at zero alpha, which is precisely where it matters.

**The rule: when a CSS radial becomes an SVG gradient, the zero-alpha stop takes the RGB of the
opaque stop, whatever the canvas writes at that stop.** Transcribing the canvas literally is wrong
here — it is the one place where copying the number produces the wrong colour.

`node scripts/vicifull/stopcheck.mjs` lists every mismatched fade stop; it found **19**. Confirmed
defects: `src/components/onboarding/tail.tsx:61` and `src/components/onboarding/v3.tsx:283` (the
same line, six tail frames and the whole funnel). The other 17 need checking against their own
frame one by one — some are genuine multi-colour gradients the canvas really does state (the
paywall's mist, the drop's gold ramp), and those are fine.

## F24 — `A Clean Day` and `What You Want Back` ground shadows are drawn too small and too light

Also from the `tail` verifier, and it is D082's rule again (which the `weeks` group derived
independently): the canvas draws these as a **solid** `rgba(0,0,0,0.10)` box under `filter:
blur(5px)`, so the fill holds ~0.10 across its middle and spills 5–6 pt past its own box. The app
draws a radial falling from 0.10 at the centre to 0 at the box edge, clipped to the box. Measured
14/255 too light at the shadow's top edge, and 12/255 too light *below* the box where the design's
blur still reaches and the app's stops. Grow the box by the blur radius and keep the plateau.

## F25 — HIGH: the shipping paywall is not the one that was built

The `paywall` verifier found this outside the seven frames but inside the group's files.
`src/components/paywall/PaywallFlow.tsx` was rebuilt this run to frame #48 and is pixel-identical
to it. But `src/components/paywall/OfferingPaywall.tsx` **still draws the withdrawn
`Free Trial Paywall` board** (VICI + "PLUS", "Give it twelve weeks", 76-tall rows, checkmark
benefits, "Start my free trial") — and that is the component a build **with a RevenueCat key**
presents. The design-matched board is only what the offline mock preview shows.

So on the path that actually ships, the paywall is the previous drop's, and every measurement this
run took of #48 was taken against a component real users would not see. Rebuild `OfferingPaywall`
on the same board, or route both paths through `PaywallFlow`. Check
`src/components/paywall/RevenueCatPaywall.tsx` for the same problem.

This also generalises: **any screen with a mock path and a real path may have been verified only
on the mock one.** `src/lib/config.ts` lists the switches (`FORCE_MOCK`, `FORCE_MOCK_PURCHASES`,
`REAL_BACKEND`). Worth a sweep in the fix pass for other components gated the same way.

## F26 — HIGH, cross-cutting: every blurred SOLID must follow D082, and several groups do not

Three verifiers have now independently found the same defect, so treat it as systemic rather than
per-group. **D010 covers a blurred radial *gradient*** — a shape with no edge, where substituting
a radial falloff is exact. **D082 covers a blurred *solid***, and states the two things the
box-sized-radial approach gets wrong:

1. the peak is not the stated alpha — a solid thinner than its blur never reaches it
   (`rgba(0,0,0,0.08)` on a 56 × 10 ellipse under `blur(4)` peaks at about 0.063, not 0.08); and
2. the falloff carries on **2σ outside the box**, and a box-clipped radial stops at the edge.

Drawn the wrong way it reads as a small ellipse that is too dark in the middle and has fallen to
nothing by its own edge, where the canvas draws a broad, flat, soft band spilling past it.

Confirmed so far:

* **`plan`** — 8 layers across `28 · Start Here`, `29 · Step 1`, `30 · Step 2`. Measured at 2×,
  25–31 % of each shadow band's pixels are out by more than 6/255, peaking at 21–29/255. The two
  frames in that group with no blurred solids (`27`, `31`) diff at antialiasing only (771 px and
  620 px) while these three sit at 3,937–5,668 px, essentially all of it in the shadow rows.
* **`tail`** — the ground shadows on `A Clean Day` and `What You Want Back` (F24), 12–14/255 light.
* **`weeks`** — found and fixed it themselves; ten layers, and it is where D082 comes from.
* **`letters`** — found and fixed it themselves (`ContactShadow`).

**Every group's fix agent must audit its own blurred solids against D082.** A blurred solid in the
canvas looks like `background: <flat colour>` + `filter: blur(N)` on a box with a `border-radius`;
the app must draw it at the box grown by 2σ, with the plateau kept and the peak alpha corrected.
It is invisible to the signature diff, which is why it keeps surviving.

## F27 — 50 frames still have no capture recipe, and 5 of them are blocked by a real bug

After expanding the family recipes (`SOS Trig *`, `SOS Feel * / SOS Challenge`), 216 of 267 frames
are covered. The 50 that are not:

* **26 · `Lesson Scroll 1…26`** — the `lesson-scrolls` group had not reported when this was counted.
* **19 · `Slip Feel *` and `Slip Trigger *`** — the `slip` agent captured all nineteen cards
  individually by deck index but recorded only the shell recipe. It needs to write the nineteen,
  or a family entry that carries the index.
* **5 · `Urge Overview` / `… Mood` / `… When`, `Weekly Report Days` / `… Urges`** — and these are
  exactly the pages **D065 makes unreachable**: `react-native-web` never emits
  `onMomentumScrollEnd`, so `urge-overview.tsx:87` and `weekly-report.tsx:131` pin their pagers to
  page one (FINDINGS F12). The missing recipes are a symptom, not an oversight. Fix the pager
  first, then record them.

`scripts/vicifull/audit.mjs` now understands both `script` drivers and `*` family entries. Every
frame must have a recipe before the second full audit can claim coverage — a frame with no recipe
is reported `NO RECIPE`, never silently skipped.

## F28 — "that row is sample data" is usually avoidable: seed the account the canvas draws

The `day` verifier promoted `Night Action Reminder` from the implementer's "sample data, cannot
compare" to **fully verified** by re-seeding a day-1 mock account (`.vicifull/vday-seed-d1.js`).
The frame then came out pixel-identical — worst Δ3, no band over 40 px — which proves the card,
its bed glyph, its 372pt height and both text runs, instead of excusing them.

Several groups have parked rows as account data: the day number, the signature name, the score
line, lesson titles, `+64/+18/−16`, `About a week`, renewal dates. **Most of those are seedable.**
The fix pass should seed the state each frame is drawn for and re-measure, and only then call a
row a genuine data divergence. A frame excused as sample data is a frame nobody has actually
checked.

Two more from the same verifier, both worth carrying:

* **`Night 4 Closed`'s crescent** is another D064 case — the mask's `RadialGradient` reaches the
  DOM with no `r`, so the bite is a hard edge at 14.5 where the canvas feathers 13.5 → 14.5
  (Δ131 over 299 device px). Add it to the F12 sweep.
* **`Change Pledge Sheet` is not "identical" outside the sheet.** The canvas draws three flat
  `#E8E7E1` placeholder blocks behind the scrim; the app draws the live screen. That is ~160k
  differing pixels at up to Δ131. It is a defensible reading — the canvas is mocking a backdrop it
  did not bother to draw — but it was recorded only in a code comment, and a difference that large
  needs a numbered decision.

## F29 — `Today Home II` draws a composition the app cannot produce

The `today` verifier is the first to return `reachedAll: false`, and the reason is structural
rather than a driving problem. Frame #59 composes a **day-41 lesson card** ("Naming your triggers ·
Lesson 5 · Week II", four rail segments filled) **above the generic task card** (phone in the
drawer, crescent, "Today's task"). In the app those two are mutually exclusive:
`src/app/(app)/today.tsx:113-117` takes the lesson-sourced register whenever the day has a lesson,
so the generic register is only reachable **past day 84** — where the lesson card degrades to
"Start the first lesson · Week I" with an empty rail.

So the state the frame draws cannot be produced. The verifier captured at day 86 (which verifies
the task card) and leaned on #60's capture for the lesson card, which is honest but means **no
single capture has ever matched frame #59**.

Two readings are open and the fix pass must pick one and say so: either the two registers are not
exclusive and `today.tsx`'s selection is wrong, or the frame is a composite mock-up like the
`Today Home Task` luggage tag the same group already identified. Note the same group found that
the frame's lesson title *"Naming your triggers"* exists in **no week of this drop's 84**, which
is evidence for the second reading — but the rail's four filled segments and the "Lesson 5 · Week
II" meta are internally consistent with a real day 41, which is evidence for the first.

Same verifier, same page: the "This week" card picks its lesson by **calendar day** where three
independent canvas numbers say it should pick by **curriculum progress**, and the score sheet's
dates are locale-dependent and render in the wrong component order under the capture host's
locale. Both are real and neither is cosmetic.

## F30 — FIXED IN PLACE: a dropped Convex argument was silently losing every ridden-out urge

The `sos` verifier's top finding, and a real data-loss bug on the **real** backend rather than a
pixel one. That group added `durationSeconds` to `convex/schema.ts` and to `TidelineEvent`, and the
SOS interrupt now sends it — but `convex/events.ts`'s `create` mutation was never given the
argument. Convex rejects a call carrying an argument its validator does not declare, and the call
site's `.catch(() => {})` swallows the rejection, **so no `urge_rode_out` event would be written at
all**. The identical earlier change (`severityAfter`, D041) *was* added to the mutation, which is
what makes the omission legible as a slip rather than a design.

Fixed here, in the orchestrator, because the group had finished and the file belongs to no other:
`convex/events.ts` now declares and inserts `durationSeconds`.

**Generalise this in the fix pass.** The whole run measures against `EXPO_PUBLIC_FORCE_MOCK=1`,
where the mock store accepts anything — so *no* capture could ever have caught it. Any group that
touched `src/lib/types.ts` or `convex/schema.ts` this run must check that every writer and every
mutation agrees, and any `.catch(() => {})` around a backend write is hiding exactly this class of
failure. This is the same shape as F25 (the shipping paywall is not the one that was built): the
mock path is verified, the real path is not.

## F31 — the grain tiling defect is not confined to the Campaign Maps

The `medallions` verifier found the same defect F22 reports, on **ten more frames**: the five
`Breakwater *` boards and the five `Detail *` boards draw their full-bleed 393 × 852 grain with a
magnified single tile instead of repeating it at the file's own 96 × 96. With F22's three Campaign
Maps and the 13 uses of the local `Noise` helper in `art.tsx`, this is now the single most
widespread visual defect in the run. `src/components/ui/Grain.tsx` is the correct implementation
and documents why. Sweep it everywhere and re-check each affected board by eye — the signature diff
cannot see it.

## F32 — UPHELD: the extra seam pips on the twelve week P1 frames (D084)

The `weeks` verifier re-raised its implementer's one deliberate departure and rated it `unsure`, so
it needs an orchestrator ruling. Every P1 frame draws *n* cards and *n−1* pip pairs and stops; the
pair belonging between rows 04 and 05 would sit at y 787/795, on screen, and is drawn on none of
the twelve. P2 proves rows 05–07 follow and draws pips between them. The app draws the pair, which
costs Δ44 over about 106 device pixels and is plainly visible side by side.

**Upheld.** The board scrolls; the canvas's P1 is a static mock of its top, and it draws the
partial row 05 while omitting only that row's seam. A scrolling list cannot have a seam appear on
scroll. This is the canvas being incomplete rather than the canvas stating a rule, and D084 already
argues it. Named here so the final report carries it as a known, chosen difference from the canvas
rather than a miss — it is one of a small number of places the app deliberately does not match.

Everything else in that group verified: max scroll is exactly 320pt on every week so the P2
captures land on the frame with no nudging (week II P2 differs by **one pixel** over the whole
screen, week V P2 by **zero**), all 84 lesson titles / 12 week names / 12 blurbs and all 172 scene
layers were independently re-extracted and matched field for field, and the artwork was read at
4–8× rather than trusted from coordinates.

## F33 — DECIDED: Today's avatar opens Settings, not Edit profile

The `settings` verifier found that removing Edit Profile's "App" section — correct, the canvas's
`Edit Profile` has no such section — **removed the last tap-path to `/(app)/settings`**. Six of
that group's ten frames (#196, #201, #202, #203, #204, #205) are downstream of it, and
`settings.tsx` is now referenced only from `/(app)/all`, which nothing navigates to.

The canvas states the hierarchy plainly, and the app has it inverted:

* `Settings` draws an **"Edit profile"** row under Account — parent to child.
* `Edit Profile` draws a **Back** row — child to parent.
* The app has `today.tsx:128`'s avatar pushing `/profile` directly, and reached Settings only
  through the App section the canvas does not draw.

**Taken: the avatar on Today opens `/(app)/settings`.** Edit profile is then reached from
Settings' own row, which the canvas draws, and Edit profile's Back returns to Settings, which is
what its Back row means. That restores the canvas's own structure and makes all six frames
reachable without inventing a control.

Note this is the second reachability regression caused by faithfully removing a row the canvas
does not draw (F15 was the first, for crisis support). The canvas draws destinations without
always drawing the doors to them; where the frames themselves imply the door, restore it that way
— where they do not (F15), say so and leave the decision with the user.

## F34 — `Your Vow Page`'s sun has its highlight upside down

Same verifier, and the clearest single artwork defect in that group. The disc sits at `cy = 51`
and its `RadialGradient` is written `cy="82.48"`, so the focus lands 37pt **below** the disc: the
app's sun reads dark at the top (measured exactly `#E3BE85`, the outermost stop) and light at the
bottom, where the canvas's is the reverse. Δ up to 55/255. The implementer reported it as
"verified the sun renders its real fill". The signature diff cannot see it.

Also: `Edit Profile`'s medallion shelf is struck in silver/platinum where every album and shelf
frame in the bundle draws plain paper stock (`#F1F0EB → #ECEAE3`) — `profile.tsx:164` passes
`metal={k.metal}` where `milestones.tsx:311` passes `metal="paper"` for the same coins. Measured
239,237,231 flat on the design against a cool 243,245,247 → 218,222,227 gradient in the app.

## F35 — a measurement instrument that excludes where the defect lives reports zero

The `funnel` implementer reported "0 flat pixels" on 22 of 23 frames. Its verifier found the F23
fade-stop defect on those same 22 frames, 6–8/255 too dark, and explained why the first pass could
not see it: `funnel-pxdiff3.mjs` counts a pixel **only where the design's 3 × 3 neighbourhood is
flat**, and **starts at device row 110**. A gradient wash near the top of the frame is therefore
doubly excluded — once for being a gradient, once for being above the cutoff.

The instrument was not wrong to exist: it was built because curve antialiasing rasterises
differently between the two pages and a raw pixel count is unstable under machine load. But an
exclusion designed to suppress noise had silently suppressed the signal.

**Rule for the second audit: any pixel comparison must state what it excludes, and no frame may be
called clean by an instrument that excludes the region a finding is about.** The verifier's
replacement (`.vicifull/vfunnel-blockdiff.mjs`, 8 × 8 block means) kills antialiasing without
killing gradients, and is the better default.

## F36 — the `logs` group contradicts DECISIONS D026 on eight frames

Its eight Lapse and Urge-Log frames put the primary pill **34pt below** the canvas. The
implementer filed this as a headless-capture artefact; the verifier showed D026 already ruled that
exact pattern a defect (`edges={['top','bottom']}` plus `paddingBottom: 16` spends both insets),
and that `report-ready.tsx` **in the same group** does it the correct way. So the group is
internally inconsistent with its own decision log. Same root cause as the `RoutineShell` bug the
`paywall` group found on the check-in-time screens.

One correction the same verifier made to its own group's recipes, worth carrying: the urge-overview
segmented control **does** follow the page and highlight correctly when the tab is fired as a
`[role="tab"]` node. The implementer's "the segmented control keeps highlighting page 1" caveat was
an artefact of driving it with `scrollLeft`, not app behaviour — all three overview pages verify
clean when driven properly. **A capture technique that fails is not evidence of an app defect.**

## F37 — FIXED: the transcriber was dropping the SVG `opacity` attribute on 16 frames

Found by the `slip` verifier as a tooling note, and it is wider than it looks.
`scripts/vicifull/decl.mjs` and `body.mjs` listed `fill-opacity` and `stroke-opacity` in
`SVG_ATTRS` but **not plain `opacity`**, so every transcription this run printed silently omitted
it. Both files now list it.

96 occurrences across 16 frames were invisible:

| frame | count | | frame | count |
| --- | --- | --- | --- | --- |
| `Yearly Drop` | 44 | | `V3 Q10` | 4 |
| `V3 Q1` | 14 | | `V3 Q2` | 4 |
| `Paywall` | 13 | | `V3 Q16` | 3 |
| `Paywall Confirmed` | 2 | | `V3 Q13` / `V3 Q15` / `V3 Q21` | 2 each |
| `Lapse Trigger`, `Slip Fed`, `Urge Log Outcome`, `Urge Log Trigger`, `V3 Q3b`, `Where We'd Start` | 1 each | | | |

The `letters` agent noticed the gap and worked round it — it verified the Yearly Drop's 44 arc-dot
opacities against the raw frame and says so. Nobody else did. **The fix pass must re-check the
other 15 frames for opacity**, in particular `V3 Q1`'s 14 (the funnel's gauge rings) and
`Paywall`'s 13, since their groups reported them clean using a transcription that could not show
the attribute.

## F38 — the slip flow is built and unreachable, and one screen shows the canvas's sample as the user's words

The `slip` verifier's remaining items on a group that is otherwise exact (0 missing signature rows
on all 31 frames, all nineteen cards' copy matching `slipCards.ts` character for character):

1. **`/slip` is linked only from the `/all` debug index**, and SOS's "I slipped" still opens
   `/relapse`. The whole 31-frame flow this run built is unreachable from the product. Third
   reachability finding of the run (F15, F33 were the others).
2. **`Slip Pledge` (98J) is shown unconditionally**, so an account with no pledge is presented the
   canvas's *sample* pledge line as its own words, signed "You". That is worse than a pixel
   mismatch — it puts words in the user's mouth. Gate it on the account actually having one.
3. **`Slip Urge Now` (98F)'s answer is captured and thrown away.**
4. The ground shadow under **every one of the 21 illustrated frames** is ~25 % too dark and about
   half the canvas's height — F26/D082 again, now confirmed on a fifth group.

It also corrected a false claim in its own group's report: `drive.js`'s `tap()` **does** work on
this build (demonstrated reaching 98C and the SOS strength board), so no other group's `--do`
recipes should be distrusted on the strength of that claim.

## F39 — `gen-reader-art.mjs`'s provenance is wrong but harmless, and I checked rather than assumed

The `lesson-scrolls` verifier flagged that `scripts/vicifull/gen-reader-art.mjs:11` reads the night
room out of `Email Login`, while D085/F5 establishes that lesson one is built from
`Lesson 1 Surviving the Night`. That is the wrong input on principle.

I diffed the two: the 340 × 200 room subtree is **byte-identical** in
`Email Login/Lesson-Scroll-23.html` and `Lesson 1 Surviving the Night/L1-Frame-23.html`, so
`readerRoom.ts` is correct today. Repoint the generator anyway — the next drop may restyle one copy
and not the other, which is exactly what happened to the type ramp.

Two real defects remain on the two frames that draw that room (#259 and #264, the only two pages in
all 1,858 with the `room` mark): the door's floor light pool loses its `clip-path`, and the
pillow's `box-shadow` loses its inset half. Both `certain`, both local.

The same verifier independently re-derived D085 and strengthened it: transcribing all 26 frames of
each authoring and diffing pairwise gives 198 differing lines, **not one of which is a word** —
every text difference is HTML-entity encoding (`&middot;`, `&rsquo;`, `&ldquo;`, `&mdash;` in the
L1 copies against literal UTF-8 in Email-Login's), and the generator decodes all of them (0
entities survive into `lessonReader.ts`). The remaining 198 lines are exactly `restyle-lessons.js`'s
substitutions. It also re-ran `lesson-verify.mjs`: **1,858 frames, 4,521 text runs drawn, 4,521
transcribed, 0 either way** — independent confirmation that the F3 copy loss is fully repaired.

16 of the 26 pages now differ by **zero pixels** at a per-channel threshold of 5.

## F40 — the task and lesson artwork renderer was ignoring seven CSS features, across 166 scenes

The `week-lessons` implementation report, and by weight the largest body of broken artwork the run
has found. `taskScenes.ts` / `lessonPlates.ts` carry 83 task scenes and 83 lesson plates as
transcribed layers; the generators and the renderer between them were dropping:

* **`RadialGradient` without `r`** (D064/F12 again) — every blurred shadow rendered as a flat grey
  ellipse and every cover sun as a pale blob. This also closes F2.
* **`conic-gradient` read as a colour ramp** — the eight clock and timer faces filled solid amber
  instead of drawing a pie wedge.
* **`linear-gradient(90deg|100deg|120deg|160deg)` drawn top-to-bottom** — the bedside lamp's spill
  and the light on the floor pointed the wrong way.
* **`transform` read as `rotate(Ndeg)` only, pivoted at bottom-centre** — **109 layers** rotate
  about the default centre, **30 `skewY` were dropped**, plus five `scale` and 22 `translateX`.
* **`-webkit-mask` ignored** — the eight crescent moons drew as **full moons**.
* **`clip-path: polygon(…)` ignored** — **53 layers** (the pencil's tip, the paper aeroplane, the
  pool of lamplight) drew as the rectangle they are cut from.
* **outer `box-shadow` never drawn** — **324 parts**.
* **grouped layers never rendered** — days 74 and 76 drew **no scene at all**, and lesson plates
  17, 26 and 47 lost a group.

Four more generator bugs on the 83 options boards, all fixed and regenerated: a bottom offset with
54 wrongly subtracted (D026) put every board's floor at 798 instead of 744, *under the button*; the
head ramp matched on a weight/colour day 43 does not use; the body ramp matched the closing note on
boards with no row bodies; and the ramp is per **row**, not per board. Plus 34 option glyphs the
selector dropped because it keyed on `width="22"` and the canvas draws some at 20 — six days had no
glyphs at all.

F1 is closed properly: `gen-curriculum.mjs` was taught the new frame shape (the withdrawn
`DAY N · TASK` eyebrow shifted every text-node index by one) and regenerated. F4 needed no work —
the `lesson-scrolls` agent had already fixed the hairline.

Two frames are now *deliberately* empty: days 74 and 76's options board, which the canvas draws
empty and `task-src.json` lists no bullets for. The app had been filling them with the intro's rule
line; that invention is removed.

## F41 — four more renderer defects in `TaskScene.tsx`, one of them painting black discs

The final verifier (`week-lessons`) confirmed the reader shell and the copy are in the state its
implementer claimed — all 34 distinct page shapes across the twelve week canvases diff at **0
differing rows**, pixel diffs of 0–0.03 % — and then found that everything still wrong lives in one
file, `src/components/task/TaskScene.tsx`, which draws both `TASK_SCENES` and `LESSON_PLATES`.
None of it is visible to a signature diff:

1. **A layer with no `background` emits a `<Path>` with no `fill`, and SVG's initial fill is
   BLACK.** 37 hollow rings across 14 task scenes and 8 lesson plates render as **solid black
   discs** — Task D56's clock face (1.32 % of the screen, mean Δ195), Lesson 22's two orbit rings
   (3.48 %, mean Δ224), Task D44's six chain links, Lesson 74's bicycle wheels.
2. **The CSS border-triangle idiom is dropped** (`width:0; height:0; border-…`), so both sails
   vanish from the boats on lesson plates 47, 83 and 84, the tail from Lesson 66's speech bubble,
   and an arrow from Lesson 18.
3. **The inset-shadow regex accepts only `inset 0 0 0 Npx`**, dropping **121** offset inset "lip"
   shadows — book pages, pillows, lamp canopies.
4. **`radii()` never applies CSS's overlapping-radius scale-down**, so **202 layers** emit arcs that
   overshoot the box and self-cross: Task D35's plant pot and Task D14's lamp canopy draw as deep
   half-circles with spikes instead of shallow flattened domes.
5. Blurred solids again box-clipped at their stated peak — D082/F26, now a sixth group.

## F42 — a third pre-restyle copy of lesson one, and 83 catalogue frames, both need naming

Also from that verifier, and it is a coverage-accounting point rather than a defect:
`Lessons-and-Tasks` carries `L01-Reader-1 … 25`, a **third** copy of lesson one at the pre-restyle
metrics (28/40 headings, gap 36, progress 4 %) alongside Email-Login's `Lesson Scroll 1…26` and the
current `Lesson 1 Surviving the Night` (24/32, gap 36, progress 3 %). Same class as F5, but unnamed
until now — a later audit would read them as 25 unexplained misses. Together with the 83
`Task DNN Card` catalogue frames (F6), that is **108 frames in that bundle which are deliberately
not app screens**, and the final report must say so explicitly.

## F43 — HIGH, cross-cutting: every `FeGaussianBlur` needs `color-interpolation-filters="sRGB"`

Found by the `day` fix agent while closing a shadow finding, and it applies everywhere the run has
replaced a CSS `filter: blur()` with a real SVG filter — which, after pass 1, is a lot of places.

**SVG filters default to `linearRGB`; CSS `filter: blur()` operates in `sRGB`.** Without the
declaration the colour round-trips through a different space and the result is skewed — measured
on an ink shadow as **+2 R, +2 G, −3 B**. With it, max Δ across the same shadow is 2.

Twelve files draw a Gaussian; **only two declare the colour space**:

| declares sRGB | does not |
| --- | --- |
| `src/components/day/kit.tsx` | `src/app/(app)/today.tsx` (D063's own Gaussians) |
| `src/components/task/TaskScene.tsx` | `src/app/drop.tsx`, `src/app/letter.tsx`, `src/app/score.tsx` |
| | `src/components/onboarding/art.tsx`, `handover.tsx`, `plan.tsx`, `tail.tsx`, `v3.tsx` |
| | `src/components/paywall/PaywallFlow.tsx` |

Add it to all ten. This is the third defect class in this run that is invisible to a signature diff
and small enough per-pixel to survive a casual look, but systematic across the app.

Two more rulings from the same agent, both promoted from "unsure" to numbered decisions with the
evidence that settles them, which is exactly what the fix pass was for:

* **D094** — the Back row and rail on three morning frames: the two subtrees are *byte-identical*
  between `Morning Resign Pledge` and `Morning Feeling` (same `left:16 top:66 gap:9`, same
  `viewBox="0 0 11 19"` chevron at 2.4, same `#55534E`), and only the sibling order differs. A
  layer-order slip in the canvas, not a rule. Cost: 2,062 px on each, and now the only difference.
* **D096** — `fill="none"` on a stroked check: of the stroked paths in the Email-Login split that
  state a fill at all, **553 write `fill="none"` and 3 name a colour**. The canvas's omission on
  one glyph is the outlier.

## F44 — D082's METHOD IS SUPERSEDED: `react-native-svg` 15.15 ships `FeGaussianBlur` on all three platforms

The `plan` fix agent established this while closing its six blurred-solid findings, and it changes
the right answer for every group that has one. D082 was written on the premise that there is **no
RN SVG equivalent for `filter: blur()`**, and therefore that a blurred solid must be *modelled* by
a radial falloff sized to the blur. That premise is out of date: `react-native-svg` 15.15 ships
`<Filter><FeGaussianBlur>` on **web, iOS and Android**, so the layer can simply be the canvas's own
Gaussian.

D082's two observations remain exactly right — they are *why* the radial was wrong (a solid thinner
than its blur never reaches the stated alpha, and the falloff carries 2σ past the box). Only its
method is retired. Recorded by that agent as **D091**.

The measurement is decisive. Art-box pixels over 6/255, of 192,000:

| frame | radial model | real Gaussian |
| --- | --- | --- |
| `28 · Start Here` | 13,221 | **96** |
| `29 · Start Here Step 1` | 7,992 | **107** |
| `30 · Start Here Step 2` | 16,976 | **80** |

What remains is D083 one-device-pixel edges on flat rects, not the shadows. Two implementation
notes: the `<Svg>` and the `userSpaceOnUse` filter region must be padded **3σ** or the filter clips
itself square, and the filter needs `color-interpolation-filters="sRGB"` (F43).

**Every group with a blurred solid must now use a real Gaussian, not the radial model.** Confirmed
so far in `plan`, `day`, `handover`; still to do wherever F26 was closed the D082 way — `tail`,
`weeks`, `slip`, `week-lessons`, `sos`.

## F45 — FIXED: the three transcribers disagreed about which SVG attributes exist

The `tail` fix agent found the root cause of its own `preserveAspectRatio` miss: the spec
generator's attribute allowlist did not carry it, so the spec dropped the attribute exactly as the
implementer did. That is the same shape as F37 (the bare `opacity`), and it turns out all three
transcribers had drifted apart:

| tool | was missing |
| --- | --- |
| `scripts/vicifull/decl.mjs` (display path) | `dominant-baseline`, `fill-rule`, `font-size`, `font-weight`, `letter-spacing`, `preserveAspectRatio`, `text-anchor` |
| `scripts/vicifull/spec.mjs` | `opacity`, `dominant-baseline` |
| `scripts/vicifull/body.mjs` | `opacity` (fixed earlier, F37) |

All three now carry the same 44-attribute list. **One relief:** `decl.mjs`'s *parser* captures every
attribute regardless (`attrs[m[1]] = m[2]` over the whole tag), and that is what `scene.mjs` writes
into `.vicifull/scenes/*.json` — so the generators always saw the full set. Only the human-readable
transcriptions were lossy, which is bad enough: those are what the agents read.

**The general lesson for this run, now seen three times (F35, F37, F45): the instrument was wrong
before the implementation was.** A transcription that silently omits an attribute, and a pixel diff
that silently excludes a region, both produce confident "clean" reports. Any future drop should
diff the tools' own coverage against the bundle before trusting a pass.

## F46 — an agent ran a destructive git command mid-run, and pass-1 work in one file was lost

The `today` fix agent found two `reset: moving to HEAD` entries in `git reflog` and discovered that
`src/app/(app)/today.tsx` had been returned to HEAD — which never carried pass 1's Today work. The
whole D063/D064 night-art rebuild and the `PledgeCard` rebuild were gone. It reconstructed both
from `Today-Home.html` / `Today-Home-III.html` and re-measured; `src/app/score.tsx` was untouched.

**I audited the blast radius rather than taking that on trust.** There is also a
`stash@{0}` (112 files, 14,670 insertions) that an agent left behind. Diffing the working tree
against it:

* `today.tsx` now carries the correct `Today Home` palette (`#0B0A09 / #14130F / #1E1C17`, moon
  `#FBEFD6 / #EBD0A0 / #C9A469`, halo `#E2BA78`) and **none** of `Score Detail`'s
  (`#08090B / #0E1014 / #151920 / #DFDCD3`), which is what the corruption had put there.
  `score.tsx` keeps its own. The rebuild is real.
* No file in `src/` is *behind* the stash — the tree is ahead by 269 insertions across 13 files,
  and nothing shrank. So `today.tsx` was the only casualty.
* One small loss did survive the reset: the F16 deletion of `src/components/ui/Signature.tsx` had
  been undone. Confirmed dead (`SignaturePad` / `SignatureMark` referenced nowhere, not exported
  from the barrel) and re-deleted here.

**The `letters` agent's account is fuller and supersedes the first reading of the damage.** The
working tree did not lose one file — it was reverted wholesale to `cd98787`, and `stash@{0}` holds
every group's pass-1 and pass-2 work (112 files, +14,670 / −7,868). `git stash apply` aborted
because another agent had by then re-edited 22 files on top of the reverted tree, so that agent
restored the **90 files nobody was touching** with `git checkout stash@{0} -- <paths>` and left the
stash in place as the backup. My audit above was taken *after* that restore, which is why it found
nothing behind.

**Reconciled the 22 overlapping files myself.** All 21 `specs/*.md` and `src/app/(app)/today.tsx`
are **ahead** of the stash, not behind it (+179 / −5 on the specs; the Today palette verified
above). Whole-tree check across `src/`, `convex/` and `specs/`: **+524 / −180 against the stash,
and no file shrank by more than 30 lines net.** Nothing from either pass is lost.

**Protection added:** `git stash create` writes a commit object without touching the working tree
or the index, so it is safe to run at any time while agents are working. Snapshots tagged
`vicifull-snap-1` (116 files) and `vicifull-snap-2` (117 files, 15,354 insertions), and a
background watcher now takes one every ten minutes.

**Rule for any future run: agents must not run `git reset`, `git checkout -- <path>`, `git stash`
or `git clean`.** In a fan-out where seventeen agents share one working tree, a single one of those
silently destroys everyone else's uncommitted work, and nothing in the numeric verification would
ever show it — the file simply goes back to looking like the previous drop.

## F47 — three capture-hygiene rules the `handover` recheck established, and one real mechanism

That recheck confirmed all twelve pass-1 findings genuinely closed, found no regressions, and in
the process settled two "still open" items that were never open — by fixing the *capture*, not the
app:

1. **The design frame can scroll too.** `Letter Week XII`'s letter body is itself `overflow: auto`
   in the canvas. Scrolling **both** sides to the same offsets (900 and 1424) gives **0 raw pixels
   over 4/255**, sign-off and keepsake pill included, where comparing a scrolled app against an
   unscrolled frame had looked like a systematic drift down a 2,100pt page.
2. **A live wall clock is a false difference.** `The Vow` is `0 / 19,502` blocks once the page clock
   is pinned to the frame's own 9 June. The date line was the only thing differing, and it was the
   clock, not the layout.
3. **Prove a tiling fix by autocorrelation, not by eye.** The grain was confirmed by high-passing
   each row and correlating at the 96 CSS px tile lag: design 0.987 / app 0.986, rms 1.058 / 1.036,
   flips-per-row 223.4 / 224.7. That is what "it tiles at the file's own size" looks like as a
   number.

**The one real thing still open in that group is a mechanism, and it is transcribable.** The four
week-tile text stacks on the Campaign Maps render exactly **1 device pixel (0.5pt) low**. Leading,
font, weight, size and box position were all ruled out by DOM probe (both sides report top 221.5,
height 15, 12.5px, `line-height: normal`, weight 600) and by row-by-row ink profile (ink-mass ratio
1.0000, the app's raster is the design's translated one row). The cause is the **centring
mechanism**: the canvas uses `top: 50%` + `translateY(-50%)`, the app uses flex
`justifyContent: 'center'` — and patching the *design frame* to flex centring drops its glyphs by
exactly the same 1 device pixel at an unchanged box. So it is closable by transcribing the canvas's
own mechanism, with no invented leading. 432 / 418 / 327 of 19,502 blocks on the three frames, and
every block on them bar 0/2/4 is inside those four rects.

## F48 — D010's EXEMPTION IS ALSO RETIRED: the canvas blurs its washes and the app does not

The `auth` recheck found this, and it is the same discovery as F44 applied to the other standing
exemption. **D010** says a `filter: blur()` on a radial wash "has no platform equivalent, and does
not need one", so every wash in the app is drawn as a two-stop SVG radial with **no blur at all**.
That premise is out of date for the same reason D082's was: `react-native-svg` 15.15.4 ships
`FeGaussianBlur`, and `src/components/lesson/coverL1.tsx` already uses it.

Measured on the three frames that group owns: **85–91 of 19,208 8×8 blocks over 1/255**, worst
2.8/255. Small per pixel, and it is the **entire** remaining difference between those frames and
the canvas once everything else is closed.

**Scope is the whole app.** `164 of the 267 frames` state a `filter: blur()`. Two shared helpers
draw most of them — `Wash` in `src/components/ui/Waterline.tsx` (8 call sites: the splash field and
the waterline field) and `Wash` in `src/components/auth/kit.tsx` (3, shared by Login, Welcome Back
and the D047 boards) — so a fix in two functions closes a large share of it. The onboarding, tail,
day, sos and paywall fields have their own copies.

D151's three implementation notes carry over from D091: pad the `userSpaceOnUse` region **3σ**, set
`color-interpolation-filters="sRGB"` (F43), and grow the `<Svg>` to hold the spill.

**Both standing "no platform equivalent" exemptions in `DECISIONS.md` have now been disproved by
measurement in this run.** Anything else resting on that premise should be re-checked: grep the
decision log for "no RN equivalent" and "has no platform equivalent" before the final report.

## F49 — the design frame does not paint a full status bar, so less of it needs excluding than everyone assumed

The `funnel` recheck established this while closing F23 harder than the fix pass had. Every
instrument in this run has excluded css rows 0–53 wholesale, on the assumption that the design
frame paints a 54pt status bar there. **It does not.** It paints only a clock/indicator strip at
**css y 23.5–36.5, x 47–360**. Outside that strip the top band compares exactly.

That matters because it is where the corner bloom's **core** lives. Measuring only below y 54 had
been sampling the bloom's fringe. Measured over css y 0–23, all 22 night frames sit at **0 px ≥
4/255, worst 3**, signed +0.05…+0.11, against the pass-1 verifier's +0.55…+0.62 with worst 6–8 in
the fringe alone.

**For the final audit: exclude the strip, not the band.** A frame's top 23 rows and the columns
outside x 47–360 are real screen content on both sides and should be compared.

The same recheck also found F23 is **not** fully closed and is ten frames rather than one:
`First Principle`'s bloom *ring* is fixed, but its *core* is 6/255 too bright, and the cause is
F48/D151 — the funnel does not blur its washes anywhere. That is the same sweep, and it confirms
F48's estimate that the wash blur is the entire remaining difference on the fields that carry it.

## F50 — the device-only divergences, and a correction to F43

The user ran the app on a device, found a sentence off the right edge, and asked what else was like
it. A research agent read `react-native@0.85.3`, `react-native-svg@15.15.4` (JS **and** the
Obj-C++), `react-native-web@0.21`, `expo-image` and `expo-blur` rather than guessing. Ten findings;
these are the ones that matter.

**D1 — FIXED. The laurel on the Yearly Drop is invisible on iOS.** `drop.tsx` drew it with
`filter: 'invert(1) brightness(1.6)'`. RN 0.85 *parses* CSS filters on every platform, but
`RCTViewComponentView.mm` has **no `Invert` case at all**, and every branch except Brightness and
Opacity is gated on `enableSwiftUIBasedFilters()`, which defaults **false** — so `blur`,
`grayscale`, `saturate`, `contrast`, `hue-rotate` and `drop-shadow` are silent no-ops on iOS in this
version. `brightness(1.6)` is a multiply-by-white, i.e. nothing. Net: the dark laurel stayed dark on
a `#131313` tile and vanished. Fixed by keeping the canvas's filter on web and giving native the
white template tint the other four laurels already use.

**D2 — HIGH, and it corrects F43. The `color-interpolation-filters="sRGB"` sweep does nothing on
device.** `react-native-svg`'s `Filter.tsx` builds its native props from exactly
`{name, x, y, width, height, filterUnits, primitiveUnits}` — `colorInterpolationFilters` is
**discarded before it leaves JS**, and iOS has no property for it. It worked on web only because
`WebShape` copies unrecognised props straight onto the DOM node, which is exactly what F43
measured. Worse, `RNSVGFeGaussianBlur.mm` blurs with `CIGaussianBlur` through a default
`CIContext` with no working colour space set — Core Image's default is linear-light, i.e. the
`linearRGB` that F43 measured as wrong. **So the 43 `FeGaussianBlur`s across 19 files blur in the
wrong space on iOS and cannot be fixed from JS.** F43 stands for web and is void for device.

**D3 — HIGH. `borderCurve: 'continuous'` is in 35 places and no instrument in this run can see it.**
`react-native-web` has no such property anywhere in its dist, so every capture rendered a circular
`border-radius` arc — which is what the canvas draws. On iOS it sets `cornerCurve = .continuous`,
an Apple squircle that at r=16 encroaches visibly further along both edges. It is a deliberate
departure from the canvas, in three shared files (`lib/theme.ts`, `ui/Card.tsx`, `ui/Field.tsx`)
plus 17 others, and it is in neither `DECISIONS.md` nor here. **Decide it: strip for literal parity,
or record it as an intended native idiom.**

**D4 — HIGH. Every explicit `lineHeight` sits lower on device.** `RCTTextAttributes.mm` sets
`minimumLineHeight`/`maximumLineHeight` and adds no baseline compensation, so TextKit puts the whole
leading **above** the first baseline; CSS splits it half above, half below. Same box, glyphs lower —
invisible to a signature diff, the same class as the SVG paint-order trap. Estimated drop:
letter body 15.5/27.89 → ~4.7 pt, lesson body 17/26 → ~2.9 pt, `AppText` body 16/24 → ~2.4 pt.
Note this dwarfs D136's `cssLineHeight()`, which reproduces Chrome's 1/64 pt flooring — right for
the instrument, irrelevant to the device.

**D5 — MEDIUM-HIGH. `CANVAS_INSETS = {top: 54}` is 5 pt short of a real 393 × 852 phone**, which
reports 59. So on device the content layer sits 5 pt below the art layer relative to the canvas, on
every screen that mixes them. Correct consequence of D009, not a bug — but write it down, or the
simulator reads as twenty screens each 5 pt out.

**D6 — MEDIUM.** `first-steps` and `lessons-browser` are `presentation: 'modal'`; on iOS that is a
page sheet reporting ~0 top inset, so their canvas-minus-54 arithmetic never gets added back and
both jam to the sheet's top under a system grabber duplicating their own. Neither has a frame in
this drop, so no parity claim is at stake.

**D9 — MEDIUM, and it is the user's call.** `AppText` never sets `allowFontScaling={false}`, and
nor do the 14 `TextInput`s. RN defaults it **true** and multiplies both `fontSize` and `lineHeight`
by the Dynamic Type multiplier; `react-native-web` ignores it entirely. So on any phone whose owner
has moved the text-size slider, an app laid out entirely at transcribed absolute pixel coordinates
reflows. `AppText` is the only file importing RN's `Text`, so it is a one-line choke point — but
turning Dynamic Type off app-wide is an accessibility decision, not a parity one. Same shape as F15.

**D7 — the scanner's own gap, checked and clean.** `absscan.mjs` classifies by tag, so a `<View>`
wrapping a `<Text>` fell into the 313 "harmless" boxes. The complementary scan found **11 hits in 10
files** and all 11 are safe — right-anchored rows that grow leftward, fixed short strings, or
wrappers whose children carry their own width.

**D8 — checked and clean.** `<Mask>`'s default region is 120 % of the bbox on web and 100 % on
native. Two sites state no region; in both the mask content stops exactly at the bbox, so the 20 %
the device clips is empty.
