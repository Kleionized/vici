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

## The urge hub

- **D-021 · The five places inherit the phone's step copy, except the bed.**
  `Cue Hue Picker` replaced three illustrated cards (`Phone in hand`,
  `At a laptop`, `In bed`) with five flat rows (`Somewhere private`, `In bed`,
  `A public space`, `At work or school`, `Out and about`). The three step boards
  downstream still draw the phone and bed copy verbatim, and the canvas does not
  say which of the five new places gets which. `In bed` keeps its own copy; the
  laptop lines are dropped because no option names a laptop any more; the other
  four take the phone's, except `At work or school`, which keeps the laptop
  board's "Step away from the desk" because that is the one line that still
  describes the place it is now attached to.

- **D-022 · The two new SOS answers ride the event's `trigger` line.**
  `SOS Feeling Picker` and `SOS Reason Picker` are new boards and the `events`
  table has no `feeling` or `reasons` column. Adding columns is a schema change
  the brief puts out of scope ("keep the wiring"), and dropping the answers
  silently is worse than either, so the place, the feeling and the reasons are
  joined onto `trigger`, which is already free text. If the answers are wanted
  as structured data, that is a schema task, not a UI one.

- **D-023 · The dark SOS block has no frame in `UI Final` and was left alone.**
  `Urge SOS Breathe`, `SOS Number Tap`, `SOS Odd One Out` and `SOS Settings` are
  all in the removed list, and the canvas now runs Step III straight into
  "The Wave Passed". That is ~750 lines of working behaviour
  (`BreatheStage`, `TapStage`, `OddStage`, `WaveStage`, `SosSettingsSheet`), and
  a design that stops drawing a screen is not the same as a decision to delete
  it. Flagged in `REPORT.md` for a human call rather than removed unattended.

## Settings

- **D-024 · `UI Final` cuts Settings from seven groups to four, and that strands
  four destinations.** The frame draws Reminders / Anchors / Privacy / Account
  and nothing else. Gone from the screen: the `Show a "days since" number`
  toggle, `Edit your Life Map`, `Find support`, `Medallions`, `Open urge surf
  with a Back Tap`, and `Go premium`.
  - `Medallions` and the life map are reachable from `Edit profile`, whose own
    frame (93) draws a Medallions card and a Journey card.
  - `Go premium` is reachable from the paywall flow.
  - **`Find support` was kept anyway**, as a third row in Privacy. This project
    declares a hard product invariant — "a persistent route to crisis/professional
    help exists" (`DECISIONS.md`, invariant #5) — and `UI Final` draws no route
    to `/support` on any of its 777 frames. A design that stops drawing a link
    is not a decision to break a declared invariant, and the brief makes the app
    the authority on behaviour. Marked in the source as the one deliberate
    addition to this screen.
  - `/backtap` and the streak toggle are now **unlinked**. Both routes still
    exist and still work; nothing in the bundle points at them. Flagged in
    `REPORT.md` for a human call rather than deleted.

- **D-025 · `Your vow` gets a route.** `Settings`'s Anchors card points at a vow
  page and `Your Vow Page` (92C) draws it, so `src/app/vow.tsx` is new. It reads
  a journal entry tagged `Vow`, falling back to the most recent `Pledge`, and
  falls back again to the canvas's own line when neither exists — the canvas
  draws a signed state and states no empty one, so its line is the placeholder
  rather than invented copy.

- **D-026 · `My values` left the Journey card; the door was kept.**
  `Edit Profile` (93) replaces `My values` with `Current week → VI · Discipline`
  and a `Weekly reports` action row. `/lifemap` then has no link anywhere in the
  bundle, so it moves into the App card on the same screen alongside Settings —
  the one card on profile the canvas does not draw, and which already existed
  for exactly this reason. Same rule as D-024: a design that stops drawing a
  link is not a decision to make a screen unreachable.

- **D-027 · Save moved from the header into the name sheet.**
  93 has no Cancel/Save bar — it has a back row and a big title — and 93C draws
  a `Save` pill inside the sheet. So `save()` now writes the name and dismisses
  the sheet rather than the screen, and the name row on the card is read-only
  text that opens 93C.

- **D-028 · The photo sheet's three actions are drawn but not wired.**
  `Take photo`, `Choose from library` and `Remove photo` are built to the frame
  and each dismisses the sheet. Actually picking an image needs a camera/library
  permission flow and an upload path, neither of which exists in the app or is
  drawn in the bundle; inventing one would be new behaviour, not a port.
  Recorded in `REPORT.md` as a known stub — the only one in this run.

- **D-029 · `Medallion Received` stopped sharing the letter's arrival, so
  `MailArrival` took overrides rather than a rewrite.** 90F re-cut this one
  arrival — a `#F6EEDD → #F0E1C2` field with a single 340pt halo instead of the
  letter's two washes, a `MEDALLION EARNED` eyebrow, art up at 86, the
  medallion's own name at 27/600 rather than "You earned a medallion." at
  24/500, a tier chip, and the story down at 476. `Letter Arrival` and
  `Drop Received` are unchanged and still correct, so every one of those became
  an optional prop whose default is the value those two frames draw. The
  component's defaults were not touched.

- **D-030 · The tier chip's rung name is the album's, not the canvas's.**
  The frame reads `Tier I · The Vow`, which contradicts the disc numeral `V`
  beside it, and `The Vow` is not a rung the album carries for this face. The
  chip is built to the frame's geometry and typography, with the rung name taken
  from the app's own album so it can never disagree with the medallion drawn
  above it.

- **D-031 · The keyboard-lift floor is per-board, not a constant.**
  `PILL_BOTTOM = 358` was the primary pill's bottom edge, and it was the
  bottom-most control until `Sentence Journal` gained the secondary pill at 422.
  The custom-prompt board's bottom-most control is its back link at ~362, so the
  floor became `{ journal: 422, custom: 362 }`. Left as one constant, the new
  pill would sit under the keyboard.

- **D-032 · A written prompt is stored, because the board says it will be.**
  `Sentence Journal Custom prompt` promises "It'll be waiting for you each
  morning", so `Use this prompt` writes to storage and the journal board prefers
  the stored prompt over the rotation. `Different prompt` clears it and returns
  to the rotation — the canvas draws both controls and states no precedence, and
  a stored prompt that the reroll could not escape would be a trap.

- **D-033 · `Manage Subscription` ends on the cancel line.**
  The swell and "the long road, together." are gone from the frame. The scroll
  height was sized for them (780) and comes down to 700 — content ends at app
  top 676 plus a 24 tail — so the board does not invent a scroll on a short
  phone.

- **D-034 · `Letter Week XII` scrolls its pill; the other two letters do not.**
  The frame drops the body's floor from 160 to 80, puts the keep pill in the
  scroll flow as the body's last child at the body's own 325 width, and moves
  the secondary link from bottom 44 to 36. `Letter Read` and `Medallion Letter`
  are unchanged in the bundle and still want the pinned pill, so the pill was
  extracted as `KeepPill` — the same icon path, the same 16.5/600/0.2 label, the
  same 54/27 box, character for character — and `LetterFooter` keeps rendering
  it absolutely for those two.
  The scene's spacing follows the file's own rule about margin collapse: the
  canvas pairs 16 below the paragraph with 36 above the scene, CSS collapses
  that to 36 and Yoga would add it to 52, so the paragraph's gap becomes 36 and
  the scene keeps no top margin. Its bottom margin goes 18 → 40.

## Rough days

- **D-035 · Three of the four rough-day artworks are total redraws; the chrome
  is untouched.** Every string in `src/content/roughDays.ts` and every value of
  the page chrome — sheet, grabber, cross, dots, headline 26/33 at −0.2, sub
  14.5/21, art slot, CTA, ghost — already matched character for character, so
  all 36 mismatches were inside `RDArtwork`:
  - `tangle` (Anxiety I): the scribbled knot becomes three r19 rings on a
    200 × 80 box plus a tail; the glow shrinks 116 → 72 and moves to (44, 60);
    the amber dot moves to (206, 94) and gains a 32pt glow painted *over* it.
  - `toppled` (Argument II): six bare squares become a clipped 136 × 44 board of
    twelve 22.67 × 22 tiles, with a four-box standing figure in `#6B6862` and a
    four-box piece rotated 84° at 0.85 opacity.
  - `writeit` (Argument III): the pen becomes barrel + nib + grip on a shared
    −24°, and the two crumples gain a `#EBEAE4` fill they did not have.
  - `threethings` (Boredom III): two elements withdrawn, nothing else moved.

- **D-036 · The 84° rotation is transcribed, not "corrected".**
  `toppled`'s fallen piece reads as six degrees off upright rather than lying
  flat. The CSS is unambiguous (`rotate(84deg)` about a 52 × 30 box's centre)
  and the frame is internally consistent, so it is built as drawn. The name
  `toppled` is the app's, not the canvas's.

- **D-037 · The task card has two genuine states, and the warm glow belongs to
  one of them.** `Today Home II` and `Today Home Task` differ in the label text,
  the well glyph, the caption's size, weight, leading and top, *and* the whole
  night scene — all together, which is what makes them two states rather than
  one card with a different string. State B is a task that came from a lesson:
  it takes the lesson's title and a bed glyph, and its sentence is set 15/500/22
  with no tracking because it is longer.
  `Today Home Task` also draws **no** warm glow, which proves the
  `right:40 top:20` `#E2BA78` disc belongs to the phone art rather than to the
  shared `TaskNight` band. It moved.

## The campaign map

- **D-038 · The rail is a page indicator, not a scrollbar, and the paging
  control is invented as little as possible.** `Campaign Map` I/II/III draw a
  144pt thumb on a 450pt track at exactly three offsets (306 / 153 / 0), which
  is one third of the track travelling in thirds — not proportional to a
  twelve-row scroll. The halo ramp restarting per page (0.62 / 0.5 / 0.38 / 0.3
  on each) says the same thing, and the sticky note on the first frame reads
  "(1/3)". So it is a three-page pager driven by page index.
  The canvas draws no control for turning the page. Rather than invent a button
  or a chevron it does not draw, the pager is two invisible 30pt tap bands over
  the rail's own column — the only affordance the frame gives any hint of.

- **D-039 · Every week was renamed and renumbered, and the three existing
  drawings were right but attached to the wrong weeks.** The house moves from
  week IV to **XI**, the compass from III to **VII**, and the wave from II to
  **III**; the bars stay on week I. Eight drawings are new — II, IV, V, VI,
  VIII, IX, X, XII — six of which need `react-native-svg` because they use
  `clip-path` polygons or elliptical corner radii that RN styling cannot say.
  `haloTop` was 7/8/8/8 in the app and is 7 on all twelve rows in the canvas, so
  the field is gone and 7 is written once.

## The lesson reader

- **D-040 · The reader has no CTA on 24 of its 26 frames, so the board is the
  control.** Only `Lesson Scroll 16` (the pick-one) and `Lesson Scroll 26` (the
  completion) draw a pill. The set is named "Lesson **Scroll**" and the cover
  carries a downward chevron at bottom 42 and nothing else. The app pinned a
  52pt ink pill on every step. Resolution: the whole board advances the page,
  the chevron on the cover says so, and the two frames that draw a pill get one.

- **D-041 · Progress is a 2pt hairline at `round((n + 1) / 26 × 100)%`.**
  Every frame states its own percentage and all 26 agree with that formula to
  the point — 4, 8, 12, 15, 19, 23, 27, 31, 35, 38, 42, 46, 50, 54, 58, 62, 65,
  69, 73, 77, 81, 85, 88, 92, 96, 100. The app drew a dot rail in `#131313`; the
  canvas draws `#B4B1AB` on `rgba(0,0,0,0.05)`, 361 wide at app top 54.

- **D-042 · The body is centred in the whole 852, not laid out from a top.**
  Every frame's stack is `position:absolute; inset:0` with
  `justify-content:center`, so no body element on any of the 26 frames has an
  absolute top — the vertical position is a function of the stack's own height.
  The app top-anchored every page with a hard-coded `paddingTop`. The new shell
  reproduces the centring by extending the stack 54 above the safe area, since
  the canvas's centre line includes the status bar the app never builds.

- **D-043 · `Lesson Scroll 3` is the outlier on statement width.**
  It declares `max-width:280` where the other six statements declare `300`.
  Six against one, and frame 3's own copy breaks to two lines at either width,
  so the slot is 300 and nothing visible changes on frame 3.

- **D-044 · The new reader lives beside the old one, at `/lesson/day/[day]`.**
  `UI Final` authors a body for lesson 01 only (D-015). The 110-lesson
  interactive reader at `/lesson/[slug]` still serves every other lesson and is
  still keyed on by progress, reflections and the backend, so it stays. A day
  with no authored pages returns to its card rather than showing an empty board.

## The daily tasks

- **D-045 · `Task DNN Card` is a specimen, not a screen.** The third frame of
  each day shows the same task twice — once under `HOME · TODAY'S TASK` as the
  card the Today home draws, once under `NIGHT · REMINDER` as the card the night
  check-in draws — both of which this app already builds. It gets 83 ledger rows
  because the ledger records frames, and no route, because it documents two
  placements rather than a third board.

- **D-046 · The 83 task scenes are transcribed, not retyped.**
  1,571 layers across the 83 days, including 106 nested `<svg>` subtrees, lifted
  whole by `scripts/uifinal/gen-task-art.mjs` into `src/content/taskScenes.ts`
  and rendered by one component that maps each CSS construct onto its
  `react-native-svg` equivalent — the elliptical `border-radius` forms, the
  gradients with their stops, the rotations, and the blurs. The 223 option
  glyphs come out of the same pass.
  **Platform gaps, recorded:** `conic-gradient` appears on 8 layers and has no
  RN SVG equivalent, so those draw as the radial their first stop pair
  describes; a CSS `mask` appears on 8 layers and is not applied — both are
  crescent cut-outs, which read as full discs instead.

- **D-047 · Marking a task done writes the day's action.**
  The second board's pill is the canvas's `Mark as done`. It upserts the day's
  check-in with the task as `dailyAction` and `dailyActionDone: true`, which is
  the field the Today card and tomorrow's morning check-in already read. No new
  storage.

## The straggler scan

- **D-048 · `ChallengeSheet.tsx` is orphaned and was left in place.**
  Nothing imports it, and no frame in the bundle draws it — the last commit
  before this run ("challenge sheets: drop the why-am-I-doing-this row") was
  still editing it, so it is recent work rather than old dead code. Deleting it
  is a product call, not a port call. Recorded, not removed.

- **D-049 · Eighteen image assets are unreferenced; none was deleted.**
  `auth-dawn`, `envelope-seal`, `home-bg`, `journey-bg`, `laurel`, `laurel2`,
  `laurel3`, `letter-envelope`, `next-lesson-bg`, `noise.png`,
  `paywall-summit`, `paywall-summit-full`, `relapse-begin`, `relapse-slip`,
  `relapse-twice`, `statue-maxim`, `valley-river`, `wave-v3`. Most became
  unreferenced because the art they carried was redrawn as SVG, but the design
  bundle's own `uploads/` still ships several of them (`tl-relapse-begin.webp`,
  `tl-statue-maxim.webp`, `tl-valley-river.webp`, `tl-wave-v3.webp`), so the
  *design* still uses them even where the app no longer does. Deleting them is
  irreversible and gains nothing this run needs; they are listed here and in
  `REPORT.md` instead.

## The unchanged-frame audit

- **D-050 · The canvas is inconsistent about apostrophes; the app's curly ones
  stand.** The audit of `Root Loop` found the app writing `isn’t` (U+2019) where
  the frame writes `isn't` (U+0027). Surveying the whole canvas: 45 text runs
  use `&rsquo;` and 23 use a raw ASCII apostrophe, across 18 frames — so this is
  authoring drift in the bundle, not a typographic choice. The majority reading
  is the curly apostrophe, which is what the app already uses everywhere.
  Recorded rather than "fixed" in either direction.

- **D-051 · Blur and mask substitutions are counted as mismatches, and named as
  such.** The audits mark them `MISMATCH*` — the design uses a CSS feature RN
  cannot express (`filter: blur()`, `mask-image`, gradient extent keywords) and
  the app substitutes a falloff. They are listed in `REPORT.md` §5 as platform
  gaps rather than silently called matches, because the numbers really do
  differ even though the intent is carried.

- **D-052 · The paper grain was being stretched, not tiled — fixed everywhere.**
  The canvas sets the grain as a `background-image` with no `background-size`,
  so it **repeats at the file's own 96 × 96**. The app used
  `expo-image` with `contentFit="cover"`, which blows a single tile up to fill
  the box — roughly 9× on a full screen, which turns grain into a smear. The
  audits caught it on 14 frames across three families before it was clear the
  same call appeared 48 times.
  `expo-image` has no repeat mode; React Native's own `Image` has
  `resizeMode="repeat"`, so `components/ui/Grain.tsx` is the one place in the
  app that reaches for it, and all 48 call sites now go through it.

- **D-053 · `Detail Silver`'s glow was one colour off.**
  The canvas says `rgba(150,160,172,0.30)` = `#96A0AC`; the app had `#969DA6`
  = (150,157,166). Three points of green and six of blue. Corrected to the
  canvas value.

- **D-022 corrected · the SOS answers go to `precedingState`, not to `trigger`.**
  The `Urge Overview` audit found what that shortcut cost: `Common triggers`
  splits `trigger` on `' · '`, so packing the place, the feeling and the reasons
  into it put `Somewhere private`, `Relationship` and `Angry` into a chart whose
  vocabulary is `Stress` / `Boredom` / `Tiredness`, and the 88px label column
  with `numberOfLines={1}` then truncated them.
  `precedingState` was already in the schema (`convex/schema.ts`) and in
  `convex/events.ts`, and **nothing in the app was writing it** — which is also
  why `Urge Overview Mood` and "Where they showed up" never rendered at all.
  So the field gains `feeling` and `reasons`, the SOS flow writes all three
  there, and three defects close at once. The original D-022 reasoning — that a
  schema change was out of scope — was wrong: the field already existed.

- **D-054 · Three more findings from the same audit, fixed.**
  - `Urge Overview Mood` counted four booleans nothing ever set. It now counts
    the feeling `SOS Feeling Picker` records, falling back to the booleans.
  - "Where they showed up" read `precedingState.location` and `note`, neither of
    which was written. It now reads the place `SOS — Where Are You` records.
  - The trigger chip read `Tired` where canvas 037 reads `Tiredness`.

- **D-055 · Five more closeable findings from the launch, urge-log and
  onboarding audits.**
  - `reminders.tsx` wrote `where’s` (U+2019) where `Reminders Setup` writes
    `where's` (U+0027). Unlike the `Root Loop` case (D-050), every other
    apostrophe in this family is straight in both the frames and the app, so
    here the frame is consistent and the app was the outlier.
  - `sign-in.tsx` set `returnKeyType="next"` where `Login Typing` draws a
    prominent return key labelled `done`.
  - The phone trigger glyph is the one mark drawn as a cut-out, so its screen
    and home dot must take the **disc's** colour rather than a hardcoded
    `#F1EFE9` — a selected tile was showing a cream screen on ink.
  - The late-night crescent was missing the canvas's `fill-rule="evenodd"`.
    Both rules paint the same pixels on a simple closed curve; the literal is
    still the literal.
  - `Urge Log Done`'s summary value carried a right alignment and a two-line
    clamp the canvas does not declare, so a long trigger join truncated where
    the design wraps.

- **D-056 · `Urge Log When` draws the time wheel at rest.** The audit reads the
  frame as the step's resting state — "Just now" is still the selected chip and
  "Specify time" carries no active treatment, yet the wheel card is drawn at
  canvas 330. The app hides it behind a tap. **Not changed in this run**: the
  step's behaviour is the app's (rule 5), the wheel is reachable, and opening it
  by default is a product call about how much the step asks for up front.
  Recorded in `REPORT.md` as the one open finding this run leaves behind.

- **D-057 · Three findings left open, each for a stated reason.**
  1. **`log.tsx` pads the scroll by the tab bar's height a second time.** The
     audit reads `(app)/_layout.tsx`'s plain `tabBar={…}` as a sibling laid out
     below the screen, which would make `paddingBottom: tabBar` a double inset —
     97pt of dead scroll under the last row, on five screens. It is not changed
     here because I cannot verify it on a device this run, and being wrong hides
     the last row **behind** the bar, which is worse than extra scroll.
  2. **`Log Check-ins` rows draw `Today · 8:44 am`; the app draws `Today`.**
     `DailyCheckin` carries only a `YYYY-MM-DD` date, so closing this needs
     `_creationTime` surfaced or a `loggedAt` field — a schema change, and one
     the design does not otherwise ask for.
  3. **`Urge Log When` draws its time wheel at rest** where the app opens it on
     a tap (D-056).

- **D-058 · Four canvas strings in the lapse flow are urge-flow carry-overs and
  were not adopted.** `Lapse When`'s pill reads `Log the urge` on a lapse
  screen; `Lapse Trigger`'s reads `Continue · 2` where the flow commits;
  `Lapse Done`'s "What I did" value reads `Rode it out` under the title
  `Lapse logged.` Each contradicts its own frame, and the audit that found them
  recommends fixing the canvas rather than the app. The app's wording stands.

- **D-059 · The exports draw an older tab bar than the primary canvas.**
  `Story Detail` and `Story Tracks` draw three tabs on `#FFFFFF` with different
  glyphs; `Today Home`, in the primary canvas and changed in this bundle, draws
  the app's own glyphs on `rgba(255,255,255,0.95)` at the same 48 / 170 / 288
  positions. The exports are byte-identical to the previous bundle, so they are
  the older drawing and the primary canvas wins.
  The four-vs-three tab count and the even-quarter centres remain a deliberate,
  already-documented divergence in `StoicTabBar.tsx`'s own header — `All` is a
  fourth tab the canvas does not draw and nothing else routes to.

- **D-060 · `CampaignGrounds` is drawn correctly and reachable from nowhere.**
  The `exports/Journey Campaign` frame audits clean property for property, but
  `grep -rn CampaignGrounds src/` finds only its definition. A wiring gap, not a
  drawing one; recorded for a product call.

# Pass 2 — the coverage audit

- **D-061 · Phase 1 under-inventoried the bundle by 97 frames.**
  The 29 `project/screenshots/*.html` files were dispositioned as "the author's
  own measurement harnesses" **by filename, without being opened** — which the
  brief explicitly forbids ("a file you did not open does not count as
  inventoried"). Opening all 29 found `data-screen-label` frames in 18 of them:
  **97 frames**, of which 3 labels (`SOS Breathe`, `SOS Settings`,
  `Lesson Feelings Grid`) had never appeared in the ledger at all.
  The ledger is now 874 rows, not 777.

  What they are, established rather than assumed:
  - Normalising the label and the harness's `../noise-dark.png` asset path,
    **55 of the 97 are byte-copies of a canonical frame** — `l1-check.html`
    alone holds all 25 of `Lesson Scroll 1…25` verbatim.
  - The other **42 are variants that exist nowhere else**. `Task D26 Options`
    appears at five different sizes across five harnesses (5485 / 6413 / 6615
    ×3) against the canvas's 6086 — a visible sequence of iterations on one
    board.
  - **The canvas is the applied result, not the input.** Five scripts in the
    same folder — `apply-tasks.js`, `intro-apply.js`, `light-banners.js`,
    `options-apply.js`, `reminder-apply.js` — all open with
    `readFile('Lessons and Tasks.dc.html')` and write back to it. The check
    files are what gets previewed; the canvas is what gets written.
  - The variants each break the recipe the canvas holds consistently across all
    249 task frames — `closer-check` numbers the options and tightens the gap to
    12, `options-check` drops a type style, `spacing-check` shifts a tile by 24
    bytes. A canvas where 249 frames agree beats harnesses that disagree one at
    a time.

  So all 97 are dispositioned `DONE` as harness renders, and **no implementation
  changed**. The finding is the inventory, not the pixels.

- **D-062 · `scroll-check` and `reader-check` hold an abandoned draft of lesson 1.**
  Their "page 6" reads `TONIGHT'S SETUP / Make the bedroom boring / Phone
  charging outside the door before you're tired.` The canvas's page 6 reads
  `Make the problem smaller / The mind likes to turn quitting into an enormous
  promise.` The pages do not correspond at all — it is a different sequence, not
  a different revision of the same one. `l1-check` holds the canvas's own set.

- **D-063 · The four `.docx` files are not design sources, confirmed by opening
  them.** Two are the 84 daily tasks in prose (the writing the canvas's task
  copy was set from — the canvas stays authoritative per D-017); one is the
  onboarding intake brief; two are the medallion catalogue, which describes
  itself in its own second line as "working reference, not shipped copy".
  `.thumbnail` is a WebP of the canvas board.

# Pass 3 — the fresh-eyes audit

- **D-064 · The cover scene was written from a spec summary, not transcribed.**
  Pass 3's colour sweep — every literal in the app against every literal in the
  canvas — found `#CBDAE8` used once, in `lesson/day/[day].tsx`, and nowhere in
  the bundle. Reading `Lesson Scroll 1`'s scene block properly showed the whole
  drawing was wrong: **21 layers in the frame against 9 in the app**. The
  window was a flat fill where the canvas gradients `#12151B → #1A2027`; the
  mullion, the sill, both cast shadows, the window halo, the lamp glow, the
  lamp itself, the two star specks, the pillow, the bolster and the two bed feet
  were all missing; and the 13pt `#DCDED8` moon was drawn 26pt in an invented
  colour at the wrong position.
  Rewritten layer by layer from the frame. **This is the run's most serious
  transcription error, and it was found by the sweep rather than by rereading**
  — which is the argument for the sweep.

- **D-065 · The colour sweep's other 135 hits are not findings.**
  Checked rather than assumed: most are the app writing `rgb(…)` with a separate
  `opacity` where the canvas writes `rgba(…)` (react-native-svg wants them
  apart), or a hex the app derives from an `rgba()` the canvas states — e.g.
  `#96A0AC` is `rgba(150,160,172,0.30)`. The rest belong to screens whose frames
  the bundle **withdrew** (`MoodLogger`'s five mood tones came from the deleted
  `Daily Check-in`), so there is no current frame to check them against; they
  are unverifiable rather than wrong, and are left as they were.

- **D-066 · All five of the reader's other marks were wrong the same way, and
  are now transcribed.** Having found the cover scene built from a summary
  (D-064), Pass 3's instruction to discard assumptions said to check the rest.
  Every one was wrong:
  - **Sun dot** (frames 2, 5): drawn as a flat `#E9D2A4` disc. The canvas draws
    a `radial-gradient(circle at 34% 30%, #F3E3C4, #E2BA78 58%, #C49856)` disc
    with `box-shadow: 0 2px 6px rgba(160,120,50,0.3)` **and a halo three times
    its size** hanging off every edge, which was missing entirely.
  - **Crescent** (3): drawn as one `#C6C3BC` path. The canvas draws a 28pt
    `#C5C4BD` disc with an r11 circle *masked out* of it, plus a 3pt `#C6C5C0`
    speck at the box's corner.
  - **Sunrise** (9): drawn as a whole 48pt flat disc, a 2pt rule and two dashes.
    The canvas draws a **half** sun — a 48pt gradient disc clipped to its top 24
    — a 100pt halo, a 1.5pt rule and two dashes of different lengths.
  - **Clock** (13): drawn as an inset ring with two bars. The canvas draws four
    tick marks, an hour hand rotated −52° **about its own foot**, and a hub.
  - **Bed + phone** (14): five boxes and no phone glow. The canvas draws eleven
    layers including the cast shadow, the pillow's inset highlight, a 44pt
    `#CBDAE8` glow and the phone itself gradiented and rotated 8°.

  Root cause, stated plainly: these were written from the artwork spec's summary
  table rather than from the frames the spec was summarising. The lesson is the
  one the brief already gives — read the design file, not a description of it.

- **D-067 · The vow's signature is drawn, not set.** Pass 3's type sweep found
  `fontSize: 34` used in `vow.tsx` and nowhere in the canvas. The frame draws
  the signature as a **216 × 64 SVG stroke** — one cubic path in `#26261F` at
  stroke-width 2.2 with round caps, and a 2.6 dot where the pen comes to rest —
  not as a name in a script face. Replaced with the path. It now reads the same
  whatever the user is called, which is what the canvas intends.

# Pass 1 — the property audit

Six second-reader audits ran over the screens this run built by hand
(`specs/pass1-*.md`, 1,933 comparison rows). What they found and what was done:

- **D-068 · The pressed state is 0.99, not 0.96.** `UI Final` declares
  `transform:scale(0.99)` on all 62 pressed states it draws, and never any other
  value; `PressScale` animated to 0.96. Changed in the primitive, so every
  screen closes at once.

- **D-069 · The night flow read the wheel one rung low.** `Night 1 Mood` selects
  the middle dial circle and `Checkin Emotions` draws
  Calm/Tense/Tired/Hopeful/Flat/Proud/Lonely/Restless beside it — the set the app
  files one rung higher. `wheelFor(mood + 1)` → `wheelFor(mood + 2)`.

- **D-070 · The night action card was labelled from the wrong curriculum.**
  `lessons[0].title` resolves to `The slip equation` (the interactive set);
  `Night Action Reminder` draws `Surviving the night`, which is day one of the
  twelve-week curriculum. Both the label and the action line now read from
  `lessonForDay(day)`, so the card names the task it is actually showing.

- **D-071 · `Morning Task Check` deletes the honesty line.** The previous canvas
  drew `Honesty counts more than the streak.` under the two discs; `UI Final`
  does not. D-008 covers boards the bundle *withdrew*, not boards it *redrew* —
  this one was redrawn, so the line goes.

- **D-072 · Four transcription slips, closed.** The Trend pill is content-box on
  the canvas, so its 30 is 32 outer. The score halo's mid stop is exactly
  0.0666667 on the CSS ramp, not 0.07. The lesson title carries neither a right
  bound nor a line clamp. The score number declares no `font-variant`, so the
  forced tabular figures went. Plus: the held card's `overflow: hidden`, the
  emotion wheel's stated `left:38`, `DawnBand`'s stated `left:126`/`left:177`,
  round caps on the bed glyph and on `MoodLogger`'s `work`, `people` and `sleep`
  glyphs, and the lesson meta printing `Week II` rather than `Week 2` with a
  within-week index (a global index can never pair "Lesson 5" with "Week II").

- **D-073 · The week extractor never read `<svg>` layers, losing five birds.**
  `gen-week-scenes.mjs` read only the `style` attribute, so an inline `<svg>`
  became an empty stub and rendered as a zero-height rect. The audit found three;
  the fixed extractor found **five** — weeks VIII, IX (×2) and XII (×2).

- **D-074 · Two radius bugs in the week renderer.** CSS scales all four corner
  radii by `min(1, side ÷ Σ radii)` and clamps each to half its side; SVG clamps
  per axis. Every cloud pill in weeks I, IV, VIII and XII has `2r > h`, so the
  app drew an elliptical corner where the canvas draws a circular one; and week
  XII's boat hull (`5px 5px 16px 16px` on a 14.25-tall box) produced a
  self-intersecting path. Both closed in `WeekScene`.

- **D-075 · Settings' two group gaps were transposed**, pushing the whole Privacy
  group 1pt low; the sheet's own metrics (16/10/18 and a 12pt inset) were off by
  2 either way; its copy was invented where the canvas states
  `Your log, letters and medallions stay saved to sam@example.com.`; and the
  scroll padded 97pt for a tab bar that `StoicTabBar` does not render on this
  route. All closed. The vow's title is `nowrap` and its sun carries
  `box-shadow: 0 6px 18px rgba(226,186,120,0.45)`; both added.

- **D-076 · `borderCurve: 'continuous'` is kept, and named.** Three audits
  flagged it against the canvas's plain `border-radius`. CSS cannot express a
  continuous corner at all, so the canvas's value is not evidence against one —
  and it is this app's established system (`theme.ts`, 35 call sites). Kept as a
  platform-level reading rather than churned, and recorded here so it is a
  decision rather than an oversight.

- **D-077 · Two findings need a schema change and are left open.** Both check-in
  ledgers draw the urge row as `passed in 4 min` — a duration. `events`
  (`convex/schema.ts`) has no duration field, so the app draws `rode it out` /
  `logged` instead. Adding the column is backend work the brief puts out of
  scope; recorded in `REPORT.md`.

- **D-078 · The week extractor dropped `box-shadow` too.** Same root cause as
  D-073: `gen-week-scenes.mjs` read a fixed list of declarations and
  `box-shadow` was not on it, so weeks VII and XII lost the `0 0 0 1px
  rgba(0,0,0,0.05)` ring on the boat hull and the `0 1px 2px rgba(0,0,0,0.06)`
  under the sail. The ring is a zero-blur zero-spread shadow and goes through as
  an SVG stroke exactly; the sail's has a 2px blur and stays a documented gap.

- **D-079 · The lesson card is a sheet, and two of its tops were 54pt out.**
  `Lesson NN` draws `#EDECE7` behind a board that starts at canvas 52 with a
  24pt top radius, so its `top` values are already sheet-relative and owe the
  status bar nothing. The build subtracted 54 from the title and the summary
  while using the raw value for the eyebrow and the rail — inconsistent, and
  wrong on all 84 cards. Both are now the frame's own 392/396 and 448, the
  sheet chrome is drawn, `edges` drops to `['top']` so the device inset stops
  lifting the two bottom-anchored controls, and the grain goes: these frames
  contain no noise layer at all, unlike the task frames beside them.

- **D-080 · The 83 lesson-card plates were missing entirely, and are
  transcribed.** Each card draws a 240 × 200 illustration at sheet (76, 150) —
  1,302 layers across the 83 — built exactly as the task scenes are. The task
  extractor was pointed at the smaller box (`gen-lesson-art.mjs`) and the task
  renderer generalised to take its box as a prop, so the plates cost one
  extraction rather than 83 transcriptions.

- **D-081 · The reader's boards each declare their own stack gap.** 48 is the
  default, but the cover uses 36, the pick-one board 40, the task board 30 and
  the completion board 44 — and two of them put a zero-width spacer inside the
  stack on top of that (18 between the pick title and its helper, 16 after the
  task eyebrow). Built as data rather than one constant.

- **D-082 · The pick-one radio was inverted.** The app filled the 22pt disc with
  ink and put a light dot inside it. The canvas draws a 2pt `#1D1C1A` ring over a
  transparent body with a 10pt dark dot inside and a clear annulus between the
  two. The row's rings were also wrong in both states — `2px #1D1C1A` plus a
  drop shadow when on, `inset 1.5px #E4E2DB` when off.

- **D-083 · The reader's two remaining drawings were missing, and are
  transcribed.** `Lesson Scroll 23`'s night room is 27 layers in a 340 × 200 box
  drawn at 0.85; `Lesson Scroll 18` draws the identical subtree, which the
  extractor confirmed rather than assumed. The completion board's sun is a 36pt
  disc under a 115pt halo — `SunDot` hard-coded a halo for sizes 12 and 14 only
  and would have drawn 45 at size 36, so the halo is a prop now.

- **D-084 · Four cover-scene gradients were declared in a different `<Svg>` root
  from the node that used them, so on native they resolved to nothing.**
  `url(#id)` does not cross an `<Svg>` boundary in `react-native-svg`. The
  window's glass, the lamp's glow and both cast shadows would have drawn as
  untinted or not at all on device while looking correct on web — the same class
  of web-only-correctness this project has been caught by before. Each `<Defs>`
  now sits in the root that consumes it.

- **D-085 · The reader's stack was centred on the safe box, not the screen.**
  The canvas centres it on the whole 852 — status bar and home indicator
  included — so pinning the box to a literal 54 is only right when the top inset
  is 54 and the bottom is 0. On a real 393 × 852 device that put the centre at
  411.5 instead of 426. It now pins to the measured insets.

- **D-086 · Three bugs in the scene renderer, each affecting all 166 scenes and
  plates.** The canvas sets `transform-origin: bottom center` on its rotated
  layers, so day 2's clock hand pivoted at its own middle and landed 8.5 × 16.7
  off a 52pt dial. A conic stop states its extent in degrees, and the parser
  only stripped a trailing per cent — so `#E9D2A4 0deg 126deg` went through as
  the stop's *colour*. And `layer.shadow` was captured by the extractor and never
  drawn: day 2 alone lost a clock bezel and two book-sheet rings. All three
  closed; a zero-blur inset shadow is now a stroke half its width inside the
  edge, and blurred ones stay a named gap.

- **D-087 · Two z-orders inverted in the campaign map.** Weeks VI and IX draw
  the pole *before* the flag, so the flag paints over it; the app drew the flags
  first, letting each pole cover half a point of its own flag. Both now sit in
  one `<Svg>` in the canvas's order.

- **D-088 · `Medallion Received`'s halo was a whole inset too high** — it was
  positioned from the screen top with the canvas's post-status-bar number, so it
  measured 129pt to the art frame where the canvas measures 70. And its 27px
  title kept the base weight 500 where the frame says 600; the override now
  names the weight, leaving `Letter Arrival` and `Drop Received` on 500, which
  is what they draw.

- **D-089 · The sentence journal's sheet did not convert its canvas y.**
  `SHEET_TOP = 320` was the raw canvas number. The house conversion everywhere
  else in this app is `canvas − 54 + insets.top` (`score.tsx`,
  `roughDays/kit.tsx`, `relapse.tsx`), which equals 320 only where the inset is
  exactly 54 — on a 59pt device the whole sheet and its three skeleton blocks
  sat 5pt high. All four now convert.

- **D-090 · Two invented strings in the journal, replaced with the canvas's.**
  The custom-prompt field's placeholder read `What am I protecting today?`,
  which appears in no frame in the bundle; the canvas draws
  `What does tomorrow-me get if I hold the line?`. The back link read
  `Back to today's prompt`; the canvas says `Back to prompts`.

- **D-091 · The journal card's sentence stays a placeholder.**
  `Sentence Journal` draws its line as *entered* text in `#1D1C1A` with a caret
  after it. That is the frame showing a filled specimen, not a state the app is
  missing — the app renders exactly that once the user types. Pre-filling it
  would be putting words in the user's mouth, which is the inverse of the rule
  against inventing copy.

- **D-092 · Five controls the canvas marks pressable were inert.**
  `Manage Subscription` puts `cursor:pointer` on `Redeem a code`, `Restore
  purchases`, `Payment method`, `Receipts & invoices` and the `Cancel
  subscription` line; the app rendered the four rows `disabled` (so no press
  state either) and the cancel line as bare text with no hit target. All five
  now open the platform's own subscription settings — redeeming, restoring,
  billing and cancelling all live in the store's sheet, and inventing an
  in-app screen for them would be new behaviour rather than a port.

- **D-093 · The reader's serif never resolved.** `fontFamily` was set to the
  canvas's whole CSS stack as one string. RN resolves a single family name, so
  the epigraph — the reader's only serif slot, on frames 2 and 25 — fell back to
  the system sans. `Iowan Old Style` ships with iOS under exactly that name, so
  it is selected per platform now.

- **D-094 · The statement slot has four authored widths, not one.**
  A census of all 26 frames: `max-width` is 300 on eleven, **280** on frame 3,
  **310** on 16 and **320** on 24. D-043 read the 6-vs-1 count as one outlier
  and standardised on 300; the full census says the width is authored per board,
  so it travels with the page.

- **D-095 · The cover chevron sat inside the home indicator.** Its `bottom: 42`
  is measured from the 852 board's own foot, which draws no indicator, so on
  device it was 42 + the bottom inset off the screen edge.

- **D-096 · The four clone frames were audited by hashing, not by eye.**
  `Settings Weekly Report`, `Settings Check-in Time`, `Morning Check-in Time`
  and `Nightly Check-in Time` are each near-identical to a frame already through
  Pass 1. Hashing each against its base and diffing every text run proves the
  *set* of differences is complete — one word on two of them, a title, a wheel
  rest position and a footnote on the third — so nothing is left unchecked by
  not re-reading two near-identical boards. All four match. `specs/pass1-clone-frames.md`.

---

# Where the three passes finished

- **Pass 1 — complete.** All 874 rows: 469 audited property by property (16
  audits over the 129 unchanged frames, 14 over the screens this run built, and
  one by hashing for the four clones), 405 dispositioned on evidence as not
  screens. Every finding that the app could close was closed.
- **Pass 2 — complete.** The coverage audit re-walked the bundle from scratch
  and found 97 frames Phase 1 had never opened, which is why the ledger is 874
  rows and not 777.
- **Pass 3 — the cross-screen sweep is complete**, and it found the worst errors
  in the run: a scene built from a summary instead of the frame, five marks the
  same, and a signature set in a font where the canvas draws a stroke. The
  per-screen fresh-eyes re-verification has not run, and because Pass 3 and the
  late Pass 1 batches both changed screens, those screens restart at Pass 1.
  **No row is marked `DONE` on implementation, and the brief's bar — three
  consecutive passes finding nothing — has not been met.**

---

# Pass 2 — the copy sweep

- **D-097 · The options board has a second layout, and the option copy was
  scrambled on nine days.** `Task DNN Options` is drawn two ways: a 40pt icon
  plate (74 days) and a 24pt numbered step disc (days 10, 12, 21, 44, 48, 60,
  62, 64, 79). The app built only the first. Worse, the step number is a text
  node, and the extractor paired the board's text nodes two at a time, so on
  those days the number became a heading and every pair after it shifted — 25
  rows had a bare number as their heading, 19 as their body. Rows with a heading
  and no body, and the closing note, broke the same pairing on other days. Fixed
  by reading the board structurally. `specs/pass2-copy-sweep.md`.

- **D-098 · `Medallion Received` (90F) delivers a different medallion than the
  app, and it stays that way.** The frame draws *Veni · Tier I · The Vow* with
  "You signed your name to twelve weeks. The campaign begins tonight.";
  `src/app/medallion-post.tsx` is hardcoded to *Back on Deck · Tier II · The
  Return*. The geometry matches (title canvas 432 → 378, sub 530 → 476). What
  differs is which medallion the post delivers — wired through a storage key, a
  letter body and a journal entry, all behaviour the existing app owns, and the
  canvas draws no letter for Veni. Changing the three arrival strings alone
  would leave the screen contradicting its own letter, so this is recorded, not
  changed.

- **D-099 · The apostrophe is resolved per string, because the canvas is not
  consistent with itself.** 385 of its text runs use a curly apostrophe and 85 a
  straight one, with no rule to derive which. The design is the source of truth
  for anything visual and a quote mark is visual, so each string follows its own
  frame. Three app strings disagreed with theirs and were corrected.

- **D-100 · JSX string attributes do decode HTML entities.** An earlier belief
  in this run was that they did not; running the real transform shows
  `<Foo title="I&apos;m" />` decodes and only a JS string or an expression
  attribute (`title={'I&apos;m'}`) does not. The fix applied under the wrong
  belief was harmless. `scripts/uifinal/entity-sweep.mjs` now proves mechanically
  that no entity survives into a position where it would render literally: 0 of
  165 files.

- **D-101 · The journey chapter paints its scene band before its heading.** The
  canvas composes at 393, where the chapter's line takes two rows and stops 10pt
  clear of the band at 214. At 375 it needs a third row, and with the band
  painted last that row was cut through the middle of the glyphs. Painting the
  band first fixes it; the band opens on `#F4F3F0`, the page's own colour, so a
  line crossing it is indistinguishable, and at 393 the line never reaches the
  band so nothing changes there. Found by rendering the frame beside the app —
  every number on the screen already matched. `specs/pass2-copy-sweep.md`.

---

# The `lesson UI` bundle — the reader for all 84 lessons

- **D-102 · The reader is transcribed as parts, not classified into page kinds.**
  The bundle authors 1,398 reader pages in **34 distinct type signatures**.
  Committing to a fixed union of kinds would mean deciding in advance what the
  design is allowed to do, and a variant used on one lesson out of eighty-four
  would arrive as a missing case rather than as data. So a page is transcribed
  as its column's gap and its children in order, each child carrying the metrics
  its own frame states, and the renderer walks them.
  `scripts/uifinal/gen-lesson-scrolls.mjs` → `src/content/lessonReader.ts`.

- **D-103 · Ten type ramps carry the whole reader.** The 2,239 runs of copy use
  only eleven distinct ramps between them, so the ramps are named once and each
  run carries an index. Nothing is lost: a ramp is the complete set of metrics
  its frames state, `text-wrap` included.

- **D-104 · There is exactly one piece of cover art for lessons 2–84.** All 168
  of the 270 × 190 scenes — one on each lesson's cover and again on its task
  page — are **byte-identical** in the canvas, so the scene is transcribed once
  (`src/content/coverScene.ts`, 7 layers). Lesson 1 keeps the bespoke 270 × 224
  night room it already had; its frame is unchanged between bundles.

- **D-105 · The task eyebrow is gone.** The new bundle deletes
  `DAY N · TODAY'S TASK` from all 166 `Task DNN` frames and from the reader's
  own task page; the only change to those frames is that deletion, verified by
  diffing them. The title keeps its own absolute top, so nothing below moves.

- **D-106 · A reading page takes no touch.** On the canvas the whole board is
  the control. Text and filled plates capture touches by default, so a tap on a
  paragraph did not turn the page; the stack is now transparent to touch and
  only the boards that ask a question opt in.

- **D-107 · `radial-gradient(circle at X% Y%)` is honoured.** 191 transcribed
  layers say `closest-side` and are centred, which is what the renderer always
  drew. Two say `circle at 34% 30%` — the sun on every lesson's cover and task
  page — which puts the highlight off-centre so the disc reads as a lit sphere.
  Ignoring it drew both flat. `src/components/task/TaskScene.tsx`.

## What the spec workflow found, and what survived it

Nine agents specced one page kind each off the frames and compared it to the
app; every claimed discrepancy was then handed to a separate agent told to
refute it. **34 claims, 18 confirmed, 16 refuted.** The confirmed ones are fixed:

| Fix | Scope |
| --- | --- |
| `text-wrap: balance` on every heading run — the app gave all body text `pretty` | 802 statement runs, plus every cover, epigraph, task, options and done title |
| the rule card's tick is a **ringed** check (`circle r7.5` + `M5.8 9l2.3 2.3 4.1-4.6`, 20 × 20 in an 18-unit box), not a bare tick | all 86 task pages |
| an option body's `margin-top: 4px` is stated on head-less rows too | 44 head-less bodies across 26 frames |
| the completion pill sits 30 off the **852** board's foot, so it overlaps the home-indicator strip — the clamp to 0 was wrong | all 84 done pages |
| the epigraph's serif stack is `'Iowan Old Style','Palatino Linotype',Palatino,Georgia,serif` | 172 occurrences |
| the cascade's fading ramp has a **fourth** step, `#CDCBC4` | the 6 four-line cascades |

**One "confirmed" finding was itself wrong and was refused:** an agent claimed
the task-options board should sit at `top: 126`. 126 is the canvas value and the
canvas's top 54px is the status bar the app never builds, so the app owes 72 —
which is what the pick board's measured 64 (from a stated 118) independently
confirms. The verifier had been told to check exactly this and missed it.
