# Decisions

## HARD PRODUCT INVARIANTS (never violate — build spec §3)

1. **No zero-reset streak as the hero metric.** A "days since" number may exist as
   an optional, secondary, opt-in stat. The primary progress surface is lessons
   completed + leading indicators + values-alignment. A lapse never resets a
   counter to zero in a way framed as failure.
2. **A lapse is data, not failure.** The log models a lapse as one neutral event
   type with structured fields (trigger, preceding state, what was learned). Copy
   is neutral and curious. No "you failed", no broken-streak animation, no red X.
3. **Lead with values, not abstinence.** The user's own "why" and Life Map are
   first-class data the app resurfaces. Framing is toward a life, not away from a
   behaviour.
4. **Different methods fit different people.** The content engine supports many
   lesson types/approaches side by side (`approachTags`) and lets the user mark
   what fits them (`fitsMeRating`). No single methodology is hardcoded.
5. **Not medical advice.** A persistent route to crisis/professional help exists
   (`/support`, placeholder resources). Lessons flagged `sensitive` show a brief,
   non-dramatic support footer.

These are encoded in the data model (no `streak`/`daysClean` field anywhere; the
events table treats all event types uniformly) and the UI copy (`src/lib/labels.ts`).

---

## Ambiguous calls made during the overnight build

Where the spec left a product decision open, I built the simplest thing that
compiles and logged it here (per spec §0).

- **`src/` layout, not root `app/`.** Expo SDK 56's default template scaffolds
  routes under `src/app/` with `@/* → ./src/*` path aliases and typed routes. The
  spec's §5 tree shows root-level `app/`/`components/`/`lib/`. I kept the template's
  working `src/` layout to preserve its path aliases + Metro config rather than
  fight it. Folder *roles* match the spec; only the `src/` prefix differs.
- **Dual backend, mock-first.** Cloud projects (Convex deployment, Clerk app)
  require human-only interactive setup, so per spec §9.5 the app ships with a fully
  functional local mock layer (`src/lib/backend/mock.ts` + `mockStore.tsx`, and
  `src/lib/auth/mockAuth.tsx`) behind the same hook interface the real Convex/Clerk
  code targets. Presence of `EXPO_PUBLIC_CONVEX_URL` / `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
  flips each layer to real. Default run mode is **mock**.
- **Mock auth is DEV-ONLY and not secure.** It stores "passwords" in plain text
  locally purely to exercise sign-in/up/gate flows offline. Real auth is Clerk.
- **`typedRoutes` disabled.** The template enabled experimental typed routes, whose
  generated route types are regenerated on `expo start` and are brittle to iterate
  against in an unattended build. Disabled for build stability; `reactCompiler`
  kept on. Trade-off: lost compile-time href checking.
- **Custom minimal markdown renderer** (`src/components/ui/MarkdownView.tsx`)
  instead of a markdown library — avoids a dependency that may not yet support
  RN 0.85 / React 19. Handles the subset lessons use (headings, bold, italic,
  bullet/ordered lists, paragraphs).
- **Navigation placement.** Tab bar = Today, Weeks, Urge, Log, Dashboard. The
  secondary screens (Life Map, Settings, Support) are routes in the `(app)` group
  hidden from the tab bar (`href: null`); the immersive lesson player lives at the
  root (`src/app/lesson/[slug].tsx`) so it presents over the tab bar. Spec §5
  nested some of these differently; behaviour matches the spec's intent.
- **Neutral placeholder visuals.** Per spec §0.4 the app is intentionally unstyled
  (system font, hairline borders, near-black on white, no brand colour) until the
  design pass. All tokens live in `src/lib/theme.ts` for a one-file restyle.

## Reference-conflict note (build spec §6.5)

The human provided 5 reference screenshots that span **two different visual
languages** (a dark-navy serif "Imprint"-style onboarding, and a light, rounded-sans,
pink-illustration "Fabulous"-style journey UI). They cannot both be the single
system. Resolution is deferred to the design pass; see DESIGN_NOTES.md for the
token inventory and the proposed primary direction. No invariant is violated by
either; the Fabulous references show a large progress % which we treat as a
leading-indicator surface, never a zero-reset streak (invariant #1).

---

## Overnight v2 (tideline UI 1) self-answered questions

- Q: Platform icons (icon.png, splash-icon.png, android-icon-*, favicon.png) are PNG — convert? A: Kept PNG; Expo's build pipeline requires PNG for app icons/splash. §1.11 read as covering in-app raster assets, which are now all WebP (template leftovers deleted).
- Q: laurel.png replaced by which of laurel/laurel2/laurel3.webp? A: `laurel.webp`; laurel2/3 are canvas alternates, unused.
- Q: Where does the boot screen live in expo-router? A: `src/app/index.tsx` (the existing route decider) — it already gates on auth/onboarding, so the ink boot renders there while state hydrates, then breaks to Today.
- Q: Material Symbols `partly_cloudy_day` — load the icon font? A: No; drew the FILL=1 glyph as an RN-SVG path at 21px. Same silhouette, no new font dependency.
- Q: Weather icon tint when no check-in today? A: Tints `colors.textSoft` (quiet grey) until a mood is logged — calmest option; the canvas always shows a tone.
- Q: `onb3-q-*` boards — which questions? A: Enumerated from `O3_QUESTIONS` in the new screens-onb3.jsx; each has a VERIFICATION.md row.
- Q: Insights when-in-the-day buckets — keep? A: Cut; the new screens-analytics.jsx layout does not include them (§1.8 "otherwise cut").
- Q: Yearly-drop entitlement storage? A: `settings.yearlyDrop` flag on user settings; managesub renders $29.99 when set.
- Q: Medallion "email" delivery? A: No mail transport in this bundle — the email copy lands as a Mail-inbox item with the same content; real SMTP is server work outside the canvas.
- Q: Lesson interactive pages — which lessons? A: Wired as first-class page kinds in the reader's content model; "The early warnings" (Day 34) carries the demonstrated set per the canvas.
- Q: Boot progress duration? A: Canvas timing (~1.8s) with an early break when hydration finishes first; reduced-motion/cold render shows the finished state.
- Q: Yearly drop price — prompt says $29.99, canvas says $26.99? A: Canvas wins per the prompt's own rule; shipped $26.99 ($2.25/mo).
- Q: Log chooser — canvas drops the Journal option; the user earlier ordered check-in / urge / History / Rough day? A: Kept the user's explicit arrangement (a later instruction than the canvas snapshot); journal remains reachable from its own page.
- Q: KeyboardLite in screens-depth? A: Mock-canvas helper only — real keyboards exist on device; not ported.
- Q: mv-haptics specimen? A: Haptic choreography needs a physical device; utilities are wired via expo-haptics-compatible stubs on web. Ledger row annotated device-only.
- Q: 'The early warnings' lesson isn't in the imported 104-lesson curriculum — where do the interactive pages ride? A: Attached to 'cbt-trigger-chains' (the chain-spotting lesson; same scouts-before-waves idea).

---

# UI Final implementation run — 15 Aug 2026

Decisions taken without asking, per the run's standing instruction. Every entry
names the ambiguity, the reading chosen, and why.

## Run setup

- **D-001 · The bundle is a superset of the previously-implemented one.**
  `UI Final/project/` and `latest UI/project/` are the same Claude Design export
  taken at two dates. `latest UI` is what the app was last built against, so the
  two were split frame-by-frame and diffed rather than re-derived from scratch:
  of `Email Login.dc.html`'s 217 frames, 126 are byte-identical to the version
  the app already implements, 28 changed, 63 are new, 26 were removed. The
  diff does **not** replace verification — every identical frame still gets its
  own property-by-property comparison table against the app (Phase 4) — but it
  tells the run where the real changes are. Split artifacts live in `.uifinal/`
  (gitignored, regenerated by `scripts/uifinal/split.mjs`).

- **D-002 · `vici-prev.dc.html` is a byte-identical duplicate of `VICI (previous).dc.html`.**
  Verified with `cmp`. Both are also byte-identical to the copies in the previous
  bundle. Both get their own 87 ledger rows (the brief says do not deduplicate),
  and both are dispositioned SUPERSEDED: the file names them "previous", they are
  the earlier Hatch-derived visual language (sound library, wake alarms, device
  pairing) that the product no longer has, and every screen in them that survived
  into the product reappears in `Email Login.dc.html` in the current language.
  Implementing them would overwrite the current design with the old one.

- **D-003 · `Lesson 1 Surviving the Night.dc.html` is a duplicate export.**
  Its 26 frames `L1 Frame 01…26` are byte-identical to `Lesson Scroll 1…26` in
  `Email Login.dc.html` once the `data-screen-label` attribute is normalised
  away (verified by hashing both with the label stripped). Ledgered as 26 rows,
  implemented once, verified against both sources.

- **D-004 · `L01 Reader 1…25` is a superseded draft of the lesson reader.**
  Normalised hashing shows `L01 Reader 1-3` == `Lesson Scroll 1-3` and
  `L01 Reader 24-25` == `Lesson Scroll 25-26`, with the middle rewritten and one
  frame inserted. The 26-frame `Lesson Scroll` set lives in `Email Login.dc.html`,
  which the bundle README names as the primary file, so it is the authority.
  The `L01 Reader` rows stay in the ledger and are verified as superseded.

- **D-005 · Lint baseline is 24 pre-existing errors in 4 files**
  (`onboarding/art.tsx`, `onboarding/v3.tsx`, `ui/TypewriterSequence.tsx`,
  `ui/WeekStrip.tsx` — all `react-hooks/purity` and `react-hooks/refs`).
  Typecheck is clean. The run holds the line at "no new errors", and fixes the
  pre-existing ones only in files it rewrites anyway, since rewriting unrelated
  logic is out of scope.

- **D-006 · Baseline commit.** The working tree carried 120 uncommitted files of
  in-progress work when the run started. Committed as-is (`baseline: check in
  work-in-progress tree…`) so that each screen's commit is an isolated,
  reviewable diff rather than a slice of a 14k-line blob.

## The morning and night check-ins

- **D-007 · The night flow is six steps and the morning flow is seven.**
  Every drawn frame states its own rail. Night reads `▬·····` / `·▬····` /
  `··▬···` / `···▬··` / `····▬·` / `·····▬` across mood, emotions, record,
  reasons, reflection and closed — six numbered steps, with the action reminder
  drawing no rail at all, exactly as before. Morning reads `▬······` on
  `Morning 1 Yesterday`, `·▬·····` on `Morning Task Check` and `······▬` on
  `Morning 5 Done`: seven steps, of which the canvas draws 1, 2 and 7.
  The middle four are mood, energy, the pledge and the day's one action — the
  first three are the boards the previous canvas drew (`Morning 2 Mood`,
  `Morning 3 Energy`, `Morning 4 Pledge`, now withdrawn but not replaced), and
  the fourth is `Morning Action Reminder`, the flow's other railless aside.
  Promoting the two asides is the only reading in which the 5 → 7 jump is
  explained by the canvas's own edit rather than by an invented step, and it
  matches what the night flow did to its own two asides.

- **D-008 · The withdrawn morning boards keep their previous drawing.**
  `Morning 2 Mood`, `Morning 3 Energy` and `Morning 4 Pledge` are gone from
  `UI Final` but `Morning 5 Done` still reports "Pledge signed", so the steps
  still exist. The app's implementations of them were transcribed from those
  exact frames in the previous bundle, so they stand unchanged; only their rail
  index moves.

- **D-009 · `Morning Task Check` carries three values from the board that was
  deleted next to it.** The frame's art, label, sticky note (`21D2 · Morning —
  Yesterday's task`) and title (`Did you complete this task?`) all say the board
  asks after **last night's** task. Its mark disc, however, holds a **sun** over
  the label **Today**, and its footer is a single **Got it** pill — which are the
  mark, label and footer of `Morning Action Reminder`, the "One action for today"
  board that `UI Final` deletes. A sun over a night scene contradicts the frame
  itself, and "Got it" cannot answer "Did you complete this task?".
  Resolution: the frame is read as the specimen for the shared action card at
  its new look, and each of its properties is given to the board it belongs to —
  step 2 keeps the moon, "Last night" and the two answer discs; step 6 takes the
  sun, "Today" and the "Got it" pill. Every drawn property is implemented; none
  is invented. Both boards draw the new bed art, since the canvas now draws that
  identical scene on both action frames.

- **D-010 · `DayActionArt` (the first-light notebook scene) is deleted.**
  It was `Morning Action Reminder`'s art. `UI Final` draws the night bed scene on
  both action cards, so nothing references it any more.

- **D-011 · The night flow now writes emotions and reasons.**
  Steps 2 and 4 are the check-in's own boards, so the night `finish()` upserts
  `emotions` and `reasons` alongside `mood`. The fields already existed on the
  check-in row (the standalone `/checkin` route writes them), so this is wiring
  the new steps to the data the app already models, not a schema change.

- **D-012 · `/checkin` stays.** `UI Final` deletes the `Daily Check-in` frame,
  but `Log Chooser` — unchanged in this bundle — still lists "Daily check-in",
  and `(app)/all.tsx` links to it. Behaviour is the app's to keep, so the route
  stands with its own three-step rail; the design simply stopped drawing that
  rail. Its two boards are now shared components, so they pick up the redesign.

- **D-013 · The night moon's crescent is an SVG mask.**
  `Night 1 Mood` replaces the second, 0.55-opacity disc with
  `mask-image: radial-gradient(circle 15px at 67% 30%, transparent 0 13.5px, #000 14.5px)`.
  RN has no CSS mask, so it is a `react-native-svg` `<Mask>` with the same
  hard-stopped radial. A masked shape cannot carry the disc's own
  `box-shadow: 0 0 18px rgba(221,228,236,0.5)`, so that is redrawn as the
  falloff it is — σ = blur/2, half the stated alpha at the edge, gone by 2σ —
  on a 35pt radius. **Platform gap:** the shadow is an erfc approximation rather
  than a true Gaussian; the peak alpha is exact and the profile is within ~0.01
  alpha across the ramp.

## The curriculum

- **D-014 · `UI Final` carries a different curriculum from the one the app ships.**
  `Lessons and Tasks.dc.html` describes **84 lessons across twelve weeks** —
  `LESSON 01 · WEEK I` … `LESSON 84 · WEEK XII`, one card each, plus a
  three-page daily task per day, and `task-src.json` in the bundle carries all
  84 tasks as structured data. `Email Login.dc.html` agrees: twelve week
  overview screens (`Week I Reset` … `Week XII Leave It Behind`), a
  `Campaign Map` in three parts covering twelve weeks, and a `Letter Week XII`.
  The app ships **110 lessons across ten parts**, generated from
  `src/content/interactive/*.md` into `src/content/interactiveLessons.ts`.

  Resolution: the design wins on everything visible, so the run builds the
  screens the design draws (the lesson card, the three task boards, the twelve
  week overviews, the new 26-frame reader) and adds the design's own data —
  `task-src.json` and the 84 card rows — as new content under `src/content/`.
  The existing interactive lessons stay in place and stay reachable, because
  progress, reflections and the backend are all keyed on their slugs and
  rewriting that wiring is explicitly out of scope ("keep the wiring").

- **D-015 · The design authors exactly one lesson body.**
  `Lesson Scroll 1…26` is the full body of lesson 01, *Surviving the Night* —
  the bundle even ships it a second time as its own file,
  `Lesson 1 Surviving the Night.dc.html`. For lessons 02–84 the design gives the
  card (number, week, title, one-line summary, artwork) and the task, and no
  body. Rule 7 forbids inventing copy, so the reader's new page grammar is built
  from the 26 frames and lesson 01 is authored against it; the other 83 keep the
  bodies the app already has. This is recorded in `REPORT.md` as a coverage gap
  in the *design*, not in the implementation.

- **D-016 · Lesson 32 does not exist in the bundle.**
  `Lessons and Tasks.dc.html` runs `Lesson 01…31` then `Lesson 33…84`, and the
  task frames skip `Task D32` the same way — 83 lesson cards and 83 × 3 = 249
  task frames, not 84 and 252. `task-src.json` does contain a day 32
  (*The Short-Term Cost*), so the frame is missing from the canvas rather than
  from the curriculum. The JSON is the authority for the content; the ledger
  keeps 83 card rows because the ledger records frames, not days.

- **D-017 · The canvas, not `task-src.json`, is the authority for task copy.**
  The bundle ships two intermediates the task frames were generated from —
  `task-src.json` and `taskgen-meta.js` — and the frames take the two headings
  and the "done" line from the meta file while taking the intro and the option
  bodies from the JSON. Reading the rendered frames sidesteps having to know
  which, and matches the rule that the design is the source of truth.
  `scripts/uifinal/gen-curriculum.mjs` does that, and `src/content/curriculum84.ts`
  is generated, never hand-edited.

- **D-018 · Three defects in the `Lessons and Tasks` canvas, recorded not fixed.**
  1. `Task D74 Intro` and `Task D76 Intro` carry a stray fragment of a style
     attribute as raw text (`ion:absolute; left:26px; top:419px; …`) — a botched
     string replacement. The extractor drops it and logs it.
  2. `Task D74 Options` and `Task D76 Options` draw a heading and a "Mark as
     done" pill and **no option rows**; `task-src.json` agrees that those two
     days have none. So those two tasks are two-board flows with an empty
     options list, and that is implemented as the board's empty state rather
     than as an invented row.
  3. `Task D01` was applied to the canvas by an earlier script than the other
     82 and carries the older type metrics — 26 / 21 / 15 / 16 where every other
     day carries 27 / 14.5 / 13.5 / 15.5. The 82 are the design; day 1's frame
     is stale. The extractor reads by position rather than by size so the copy
     survives either way, and the type spec follows the 82.

- **D-019 · "Week N" and "Week N P2" are one screen, not two.**
  Each pair carries the same title, the same week line and a continuous list of
  the week's seven lessons — four on the first frame, three on the second. They
  are the same scrollable board at two scroll positions. The ledger keeps both
  rows because the ledger records frames; the implementation is twelve screens.

- **D-020 · A selected day chip's letter was invisible.**
  `src/components/routines/kit.tsx` inked the day letter `#1D1C1A` in both
  states, so once a chip filled with `#131313` the letter disappeared into it.
  `Nightly Check-in Time` draws every selected chip `color:#F4F3F0` on
  `#131313`, so the design states the fix. The unselected state is not drawn on
  that frame, so it keeps the app's `#1D1C1A` on `#EFEEEA`.
