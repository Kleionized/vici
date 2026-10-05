# Phase 1 — rebuild every screen on the kit (one owner per file)

Read `.overhaul/BRIEF.md` (rules, tools — including its "Run state" section), your group's analysis
`.overhaul/understand/<doc>.md` (your spec; it maps every frame to its route and files), `CRITIC.md` (§3–§8 are
rulings that override the group docs where they disagree), `.overhaul/decisions/orchestrator.md` (D320+), the
Phase 0 decisions in `.overhaul/decisions/kit-*.md`, and the kit's source in `src/components/mono/` (its
`index.ts` lists every component; each file's comments give the API and the spec it came from).

## The job, per group

1. **Every frame in your list** is reproduced pixel for pixel at 393×852, in every state the frame family
   draws, with every control working. Use the kit for every recurring piece; screen-specific layout uses the
   theme's `type` / `mono` / `ring` / `monoDark` tokens and canvas coordinates inside `Screen`.
2. **Every screen in your area that no frame draws** (your doc's "unframed" list + the routes assigned to you
   below) gets the new system consistently, styled after its closest frame, keeping its existing copy and
   behaviour (D328). Loading, empty and error states included (mono `LoadingView`/`EmptyState`).
3. **Functionality is preserved** — every control, navigation, data write, gate and effect the screen has
   today. Behaviour changes are only the ones D324 lists.
4. **Verify each frame**: drive the app to it (seed + taps — record the recipe in `.overhaul/recipes/<group>.json`),
   capture, `sigdiff` + `pxdiff` against `.overhaul/shots/design/Email-Login/<Frame>.png` / `d-Email-Login-<Frame>`,
   Read the strip PNG, fix, repeat. Check content below the fold with `--scroll`. Then capture each screen at
   `--w=375 --h=667` and `--w=430 --h=932` and fix clipping/overflow/awkward wrapping (D320).
   Target: no pxdiff region you cannot name a reason for. Residuals you cannot fix are reported per frame with
   the property and the reason.
5. Remove the old system from your files: no old palette hexes (`node scripts/overhaul/lint-mono.mjs --files
   <your files>` should report only colours a frame draws), no raw `fontWeight`, `StatusBar style="light"`.
   Delete dead code your rewrite orphans **only after grepping that nothing imports it** (CRITIC G13).
6. Decisions → `.overhaul/decisions/<group>.md` in your range. Recipes → `.overhaul/recipes/<group>.json`;
   migrate and then delete the old recipe files listed for your group (keep anything still accurate).

## Shared-file rules

* You may edit only the files your group owns (below) plus new files you create under a folder your group owns
  or `src/components/<group>/`. Anything else: report the exact change you need in `requestsForOrchestrator`.
* **Never change the external API of an exported symbol another group imports** — add optional props, keep
  old ones working, re-export moved symbols. Grep the importers before you rename or remove anything.
* The kit (`src/components/mono/*`, `src/lib/theme.ts`) is the orchestrator's. If a kit piece is wrong against
  your frame, prove it (numbers + strip) in your report; work around it locally only if the fix is blocking
  you, and say so.

## Groups, frames, files

Frame lists are `.overhaul/groups.json` unless stated. Old recipe files to migrate in brackets.

### `auth-funnel` (D200–209) — doc `auth-funnel.md`
Frames: the 25 in groups.json `auth-funnel`. Files: `src/app/(auth)/*`, `src/app/(onboarding)/_layout.tsx`,
`src/app/index.tsx`, `src/components/auth/*`, `src/components/onboarding/funnel.tsx` (the funnel engine, after
the Phase 0 split — keep the props `welcome.tsx` passes working), `src/content/onboardingFunnel.ts` +
`scripts/overhaul/gen-funnel.mjs` (fork; keep the `FUNNEL_GLYPHS` export until the tail group no longer
imports it), `src/components/ui/Waterline.tsx`, unframed `src/app/(app)/lifemap.tsx`. [auth.json, funnel.json]

### `tail` (D210–219) — doc `tail.md`
Frames: the 19 in `tail`. Files: `src/app/(onboarding)/welcome.tsx` (owner — the STEPS list, remove `reading`
and `change-line`, add `line-nothing`/`line-plan`), `src/components/onboarding/{tail,plan,handover,v3,art}.tsx`
(handover minus `O3Reminders`/`O3DayZero`, now in `reminders.tsx`), `src/content/onboardingTail.ts`,
`src/content/weekXiiLetter.ts` + their generators forked into `scripts/overhaul/`. Keep `O3LetterRead`'s props
backward compatible (medallions-letters' `/letter` renders it). Decouple `planSignals` from `FUNNEL_GLYPHS`.
[tail.json, plan.json, handover.json]

### `paywall-reminders` (D220–229) — doc `paywall-reminders.md`
Frames: the 8 in `paywall-reminders` + `Settings Check-in Time` (renders as Nightly Check-in Time with
`?from=settings`). Files: `src/components/onboarding/reminders.tsx`, `src/components/paywall/*`,
`src/app/{paywall,subscription,reminders,notify-primer}.tsx`, `src/app/routines/*`, `src/components/routines/*`
(replace the wheel with the kit `TimeWheel`), `src/lib/routines.ts` (morning default 8:00 AM, D324). D323: the
✕ on Paywall. [paywall.json]

### `today` (D230–234) — doc `today-day.md` (Today/Score sections)
Frames: Today Home, Today Home II, Today Home Task, Today Home III, Score Detail, Score Detail Moves, Score
Detail Ranks. Files: `src/app/(app)/today.tsx`, `src/components/today/*`, `src/app/(app)/score.tsx` (moved
there in Phase 0, D326 — a hidden tab with Journey lit), `src/lib/score.ts` (additive), unframed
`src/app/(app)/journal.tsx`, `src/app/journal-new.tsx`, `src/app/affirmation.tsx`. Today II's task row opens
`/lesson/day/<day>?page=task` (D324). [today.json]

### `day` (D235–239) — doc `today-day.md` (Morning/Night sections)
Frames: the 17 check-in frames (Morning Check-in Cover … Night 4 Closed). Files: `src/app/day/*`,
`src/components/day/*` (keep `RerollGlyph` exported — affirmation imports it), `src/components/MoodLogger.tsx`,
`src/app/checkin.tsx`. [day.json]

### `library` (D240–249) — doc `library.md`
Frames: the 24 week pages. Files: `src/app/(app)/library.tsx` (D325: the twelve week pages, current week first),
`src/app/week/[week].tsx`, `src/components/library/*`, `src/components/journey/*`, `src/content/weekScenes.ts`
(delete when unused), unframed `src/app/{first-steps,lessons-browser,search}.tsx`, `src/app/(app)/locked.tsx`,
`src/app/journey/*`. Lesson rows push `/lesson/day/<n>`; thumbnails use the cover hero (`curriculum84` `hero`).
[weeks.json]

### `lessons` (D310–319) — docs `lessons.md` (spec) and `lesson-scroll.md` (L1 verification spec)
Frames: all 84 lessons (1,273 frames in the 12 Week bundles; Email-Login `Lesson Scroll 1–14` = `L1`).
Files: per `lessons.md` §12.1 — `scripts/overhaul/gen-lessons.mjs` → `src/content/lessons.ts` (GENERATED, with
`BREAKS` for native per D332), `src/app/lesson/day/[day].tsx` (with `?page=<k>|task`), `src/components/lesson/*`
(new shell/pages/viz/text/hero; delete the old), `src/app/lesson-card/[day].tsx` and `src/app/task/[day].tsx` →
redirects, delete `src/content/{lessonReader,coverScene,readerRoom}.ts` and, once nothing imports them,
`lessonPlates.ts`, `taskScenes.ts`, `src/components/task/*`. Writes per lessons §12.3 (D324). In this phase verify
the spot frames of lessons §16 plus all of L1 (= Lesson Scroll 1–14) and one full lesson per week; the full
1,273-frame sweep is its own phase. [week-lessons.json, week-lessons-verify.json, lesson-scrolls.json]

### `sos-flow` (D250–259) — doc `sos-flow.md`
Frames: the 22 in `sos-flow` **except SOS Challenge** (moved to sos-boards). Files: `src/components/urge/{flow,
hub,stages}.tsx` (+ `index.tsx`), `src/app/{urge,urge-hub,rough-first90,relapse}.tsx`. The SOS tab disc pushes
`/urge` (CRITIC C12). D336: mock-only `/urge?board=<key>`. [sos.json]

### `sos-boards` (D260–269) — doc `sos-boards.md`
Frames: the 30 in `sos-boards` + `SOS Challenge`. Files: `src/components/urge/boards.tsx`,
`src/content/sosResponses.ts` + `scripts/overhaul/gen-sos-boards.mjs`, unframed `src/app/(app)/rough-days.tsx`,
`src/app/rough-protocol.tsx`, `src/components/roughDays/*`, `src/content/roughDays.ts` (fix the
`?key=lonely` blank page the routes doc found). [sos-boards.json — new]

### `medallions-letters` (D270–279) — doc `medallions-letters.md`
Frames: the 27 in `medallions-letters`. Files: `src/app/(app)/milestones.tsx`, `src/app/medallions/**`,
`src/components/keepsakes/*` (keep `KK_ALBUM`, `kkStanding`, `KK_METALS`, `KKMedallion` exported),
`src/lib/album.ts` (`useMedallionLedger` + `useAlbumStanding`), `src/app/{letter,medallion-post,drop,mail}.tsx`.
D323: ✕ on Yearly Drop. Letter Arrival is the arrival for both posts (CRITIC C8). [medallions.json, letters.json]

### `logs` (D280–289) — doc `logs.md`
Frames: the 20 in `logs` + `Settings Weekly Report` (= Weekly Report reached from Settings). Files:
`src/app/(app)/log.tsx`, `src/app/{log-chooser,lapse,urge-log,urge-overview,report-ready,weekly-report}.tsx`,
`src/components/logflow/*` (new), `src/components/insights/*`, `src/lib/weeklyReport.ts` (additive), unframed
`src/app/(app)/dashboard.tsx`. Keep `urge-log.tsx`'s exports that `slip.tsx` imports working. [logs.json]

### `settings` (D290–299) — doc `settings.md`
Frames: the 10 in `settings` (Settings Weekly Report / Settings Check-in Time render via logs /
paywall-reminders — you own only the rows that open them). Files: `src/app/(app)/settings.tsx`,
`src/app/{profile,vow,privacy,applock,backtap}.tsx`, `src/app/(app)/{all,support}.tsx`. [settings.json]

### `slip` (D300–309) — doc `slip.md`
Frames: the 31 in `slip`. Files: `src/app/slip.tsx`, `src/components/slip/*` (`art.tsx` deleted when unused),
`src/content/slipCards.ts`. [slip.json, slip-verify.json]

## Kit notes from Phase 0 — read before you build

The kit is verified: 48 whole-frame replicas diff at ≤ 0.3 % (most at 0.00 %) — `node scripts/overhaul/lab-audit.mjs`
re-runs them; replicas live in `src/components/mono/lab/` (you may add `<Frame>@<group>` replicas in a new
`lab/<group>.tsx` if useful, but register it by asking the orchestrator). Decisions D350–D399 in
`.overhaul/decisions/kit-*.md`, `splits.md`, `curriculum.md` explain each piece's behaviour.

* **Heroes:** never hand-write a hero `<Svg>`. `<Hero id top scale>` (CSS mode), `mode="crop"` (Today II/Task/III,
  `top 241.3 | 231.5`), `mode="box"` (lesson reader column). Boards whose hero sits between content and the bottom
  controls (heroes at T 458/506/582: question boards, check-ins, Cue-Hue-Picker, V3-Q24-Name, SOS-Afterward,
  pledge boards, Log-Chooser…) **must pass `controls={<bottom reserve>}`** so the hero drops out on short phones
  (D320 rule 1). Hero boards (caps/title/body/CTA under a hero at 190) are `<HeroBoard>` — it lifts hero+stack on
  short phones. Ids are the cards' `data-hero` ids (`src/content/heroes.ts`); `curriculum84` exposes `lesson.hero`
  and `week.hero`.
* **Medals:** `<MedalTier tier size glyph? disc?>`, `<TierLadder>` + `ladderStanding()` for the Breakwater/Detail/
  Tiers ladders. The 64/84/168 album medals are the medallions group's own drawing.
* **Time:** `<TimeWheel value={{hour12, minute, period}} onChange>` replaces `src/components/routines/wheel.tsx` and
  `urge-log.tsx`'s wheel. Answer synchronously inside `onChange` (an async round-trip makes it roll back then
  forward). Columns do not carry (59→00 keeps the hour) — callers that shift a timestamp apply `step.delta × unit`.
  `<DayToggles>`; `<WhenChips>` + `<DateRow>` for the When steps.
* **Sheets:** `<Sheet top={…}>` (scrim over the status bar, `#171717` panel, grabber, frame-level buttons, drag to
  dismiss, keyboard lift) for the profile/settings/morning/score sheets. `<TextField>` variants for every input
  (placeholder `#9B968E`, typed text ink — CRITIC C9).
* **Pledges:** `<PledgeCard>` (unsigned dashed / signed with the italic name; light and dark/quote variants) for
  Morning, Relapse, Slip, Urge Hub Pledges, Today III, Your Vow Page.
* `Spinner` + `StepList` (Enlisting Aegis), `PagerDots` (has `onChange`, "Pane N" labels — the hub), `ToneScale`,
  `IntensityScale` (incl. Reassess's previous bar and Morning Energy's fill meter), `CheckDisc`, `Pill` kinds,
  `Card` variants, `RowGroup`/`Row`/`Toggle`, `ListRows`, `RuledRows`, `SummaryCard` (shrink-to-fit), `CheckRows`,
  `OptionList`/`Grid2`/`Chips` (+ `exclusive`, `max`), `Segmented`, `TabBar`/`AppTabBar` (standalone for screens
  outside the tab navigator), mono `LoadingView`/`EmptyState` (also behind `src/components/ui/Feedback.tsx`).
* Selection state is exposed as `role` + `aria-checked`/`aria-selected`; `drive.js` `tap()` now also finds
  `role=tab` and `role=switch` controls by text or label.
* **Text utilities:** `src/lib/format.ts` — `numberWords`, `minutesWords`, `groupDigits`, `countOf`, `roman`,
  `joinLower` (the frames' `", "` lower-case join; storage keeps `' · '`), `splitStored`, `shortDate`,
  `weekdayDate`, `clockTime`, `dateRange`, `dayPart`/`dayPartDate`/`dayPartTime` (Tonight / Today / Last night /
  Yesterday). Use them instead of writing your own.
* **Frozen clock for recipes:** `.overhaul/clock.js` (read its header): `?now=2025-07-22T23:40` on the route with
  `--initseed=.overhaul/clock.js`, or prepend `window.__CLOCK='…';` + clock.js to a seed.
* **Fonts:** `sans()` now carries the canvas's fallback chain on web, so glyphs Lato lacks (→) fall back like the
  frame. Never set `fontWeight`/`fontStyle` yourself.
* The Expo fast-refresh badge is hidden in captures by class; a red error box is not — wait and re-shoot.

### Cross-group facts from Phase 0
* Day Zero (`welcome.tsx:323`) hard-codes the old lesson title — **tail** wires `O3DayZero` to `lessonForDay(1)`
  ("Lesson 1", "Prepare for tonight"); **paywall-reminders** keeps `O3DayZero`'s props accepting it.
* `curriculum84`: `title` = the new lesson titles; `task.cardTitle` = the new title; `task.cardSummary` = the
  task sentence Today Home Task and Night Action Reminder draw (D397); `summary` = the previous one-liners (D396);
  legacy task fields are `@deprecated` until `/task` and `/lesson-card` become redirects (lessons removes them).
* The SOS tab disc pushes `/urge` (sos-flow owns what it opens). Today's old pinned urge bar is gone in the
  today rebuild (D324) — the "Urge surfing" card/tile is the hub's door.
* `/score` now lives under `(app)` as a hidden tab (Journey lit, D326): its old footer is clipped at 748 until the
  today group rebuilds it.
