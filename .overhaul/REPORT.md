# Vici Overhaul — implementation and verification report

The app's UI was rebuilt to the `Vici Overhaul` bundle (dropped 4 Oct 2026): a flat dark monochrome system
in Lato (ground `#0D0D0D`, cards `#1E1E1E`, ink `#F2F0EC`, a noise tile over every screen), a five-tab bar
(Today · Log · SOS · Library · Journey), and the rebuilt 84-lesson course (each lesson one 13–18 page reader
that ends in its own task). Every screen of the app was rebuilt on one shared component kit
(`src/components/mono/`) measured from the frames; every control, data write and flow the app had is kept.

## How it was checked

* **Reference captures** — every frame of the 14 canvases rendered on a local frame server with the exact
  Lato files the app bundles (so a diff can never be a font difference): 254 app frames, 1,273 lesson pages,
  53 illustration cards.
* **Pixel diff per screen** — each screen driven to the frame's state from a recorded recipe (seeds, frozen
  clock, taps), captured at 393×852 @2x, compared pixel by pixel (a pixel differs at > 24/255 on any channel;
  status bar and home indicator excluded) with a design | app | diff strip per screen, plus a layout-signature
  diff (every box's position, size, colour, radius, ring and type metrics). Fonts verified loaded before
  every capture; images decoded before every capture.
* **Below the fold** — scrolled captures of every scrolling screen; the lesson sweep reaches every page by
  tapping the reader's own controls.
* **Phone sizes** — every screen replayed at 375×667 (status bar 20), 390×844 and 430×932 and probed for
  horizontal overflow, text under a control it cannot be scrolled clear of, clipped text and unreachable
  controls, then looked at on contact sheets.
* **Reviews** — 13 groups each built, self-verified, independently verified and fixed (Phase 1), reviewed again
  against the full measurements (Phase 2), and given a second, independent complete review of every frame,
  size and flow (Phase 3) whose 27 findings were fixed. All decisions are numbered in `DECISIONS.md`
  (D200–D407, this run).

## Results (final pass)

| Check | Scope | Result |
|---|---|---|
| Pixel parity at 393×852 | all 254 app frames | **247 within 0.5 %** (185 at exactly 0 %); the 7 above are sample data or recorded decisions, listed below |
| Lesson pages at 393×852 | 1,273 pages, 84 lessons | **1,273 within 0.5 %** — worst 0.017 % (illustration anti-aliasing) |
| Phone size 375×667 (status bar 20) | all 254 frames, rest + scrolled end | **254 ok** — no horizontal overflow, nothing stuck under a control, no clipped text |
| Phone size 390×844 | all 254 frames | **254 ok** |
| Phone size 430×932 | all 254 frames | **254 ok** |
| Lesson pages at 375×667 | 1,273 pages | **0 with text left under a control** — 1,227 fit at rest; 46 (long questions, task pages) scroll their text clear under the reader's fade |
| Type check · lint | `tsc --noEmit` · ESLint · palette/font lint | clean · clean · no off-palette colour in any live screen except the SOS orb hues (opt-in; 332 more sit in the 14 orphaned files) |
| Native (iOS simulator) | iPhone 17 Pro and iPhone SE (375×667), iOS 26.5, dev build on the mock backend: Login, Paywall, lesson pages (question, compare, pairs, scroll mode), a check-in time board, Yearly Drop, the urge hub | renders as on web (Lato faces, rings, art, spacing); an answer selects, the time wheel turns, a day toggles; no red-box errors |

Every capture waited for the four Lato faces (`document.fonts` reporting each loaded) and every image to decode
before the shot; status bar and home indicator are excluded from every pixel count.

## Found and fixed in the final pass

* **Morning check-in skipped yesterday's task** when Begin was tapped while the account was still loading
  (the day number reads 1 until it arrives, and day 1 skips that question). Only a loaded account counts as a
  first day now (`src/app/day/morning.tsx`).
* **Short phones opened four boards on a half-cut last row** (Paywall's feature discs, the three check-in time
  boards' day toggles, Cost Next 30's footnote, Yearly Drop's perks). Their open gaps now tighten before
  anything scrolls (kit `Slack`, D406); at 393×852 they are exactly the frame (re-audited 0 % / unchanged).
* **Paywall's feature labels broke unevenly at 430** ("Weekly insights" on one line beside a two-line
  "Progress tracking"); they keep the frame's 393 column now, as Yearly Drop's perks do (D404).
* **The 375 lesson check was stale** (it flagged any text below the button, scrollable or not). It now scrolls
  each page to its end; all 1,273 pages pass.
* **Native left lone last words** (greedy wrapping, e.g. "…change one awkward / detail.") where the web's
  `pretty` does not; native now ties them as `pretty` would (D407).
* Decision numbers D350–D355 were used twice (orchestrator and kit); the orchestrator's six are now D400–D405.

## Pages checked

**App frames — all 254** (Email Login canvas), each at 393×852 and at 375×667, 390×844 and 430×932:

* **Sign-in and questionnaire** (25): Splash, Login, Welcome Back, V3 Q24 Name, V3 Q25 Age, V3 Q26 Gender, Onboarding Start, V3 Q1, V3 Q2, V3 Q3, V3 Q3b, First Principle, V3 Q5, V3 Q6, V3 Q7, What starts it, Transition, V3 Q21, What it affects, V3 Q10, V3 Q13, V3 Q15, V3 Q16, V3 Q17, Goal Confirmation
* **Plan, cost, letter, vow** (19): Enlisting Aegis, Where We’d Start, Start Here, Start Here Step 1, Start Here Step 2, Your Plan, Starting Score, Cost Next 30, Cost Next 365, Cost By Age 80, Line If Nothing Changes, Line With the Plan, A Clean Day, One Bad Day, What You Want Back, Letter Received, Letter Week XII, The Vow, Medallion Received
* **Reminders, paywall, subscription, check-in times** (8): Reminders Setup, Paywall, Day Zero, Paywall Rescue, Paywall Confirmed, Manage Subscription, Morning Check-in Time, Nightly Check-in Time
* **Today and score** (7): Today Home, Score Detail, Score Detail Moves, Score Detail Ranks, Today Home II, Today Home Task, Today Home III
* **Morning and night check-ins** (17): Morning Check-in Cover, Morning Task Check, Morning 1 Yesterday, Morning Feeling, Morning Energy, Morning Resign Pledge, Morning Pledge Signed, Change Pledge Sheet, Morning 5 Done, Night Check-in Cover, Night 1 Mood, Checkin Emotions, Checkin Reasons, Night 3 Reflection, Night 2 Record, Night Action Reminder, Night 4 Closed
* **Library week pages** (24): Week I Reset, Week I Reset P2, Week II Changing Your Mindset, Week II Changing Your Mindset P2, Week III In the Moment, Week III In the Moment P2, Week IV Know Your Brain, Week IV Know Your Brain P2, Week V Why It Feels Worth It, Week V Why It Feels Worth It P2, Week VI Discipline, Week VI Discipline P2, Week VII Relapse and Adversity, Week VII Relapse and Adversity P2, Week VIII Boredom and Meaning, Week VIII Boredom and Meaning P2, Week IX Connection, Week IX Connection P2, Week X Yourself, Week X Yourself P2, Week XI Build a Life You Want, Week XI Build a Life You Want P2, Week XII Leave It Behind, Week XII Leave It Behind P2
* **Lesson reader (Email-Login copy of lesson 1)** (14): Lesson Scroll 1, Lesson Scroll 2, Lesson Scroll 3, Lesson Scroll 4, Lesson Scroll 5, Lesson Scroll 6, Lesson Scroll 7, Lesson Scroll 8, Lesson Scroll 9, Lesson Scroll 10, Lesson Scroll 11, Lesson Scroll 12, Lesson Scroll 13, Lesson Scroll 14
* **SOS interrupt, relapse, urge hub** (21): Cue Intro Modal, SOS Strength, Cue Hue Picker, Surf Step 1, Surf Step 3, Cue Set Confirmation, SOS Reason Picker, SOS Feeling Picker, SOS Reassess, SOS Afterward, Surf Complete, Relapse Log, Relapse Twice, Relapse Resign, Relapse Begin, Urge Hub Now, Urge Hub Score, Urge Hub Proof, Urge Hub Surfed, Urge Hub Pledges, Urge Hub Breathe
* **SOS response boards** (31): SOS Loc Bed, SOS Loc Bathroom, SOS Loc Home Alone, SOS Loc Private Room, SOS Loc Work, SOS Loc Public, SOS Loc Elsewhere, SOS Feel Turned On, SOS Feel Bored, SOS Feel Lonely, SOS Feel Stressed, SOS Feel Anxious, SOS Feel Angry, SOS Feel Low, SOS Feel Rejected, SOS Feel Tired, SOS Feel Restless, SOS Feel Numb, SOS Feel Ashamed, SOS Feel Unknown, SOS Trig Content, SOS Trig Doomscroll, SOS Trig Fantasy, SOS Trig Late Phone, SOS Trig Habit, SOS Trig Cant Sleep, SOS Trig Argument, SOS Trig Rejection, SOS Trig Alone, SOS Trig Unknown, SOS Challenge
* **Medallions, letters, the yearly drop** (27): Medallions, Medallions Still To Earn, Album Earned II, Breakwater Paper, Breakwater Bronze, Breakwater Silver, Breakwater Gold, Breakwater Platinum, Tiers Vidi, Tiers Vici, Tiers Rebound, Tiers Breakwater, Tiers Logbook, Tiers Pulse, Tiers Archive, Tiers Lessons, Tiers One-offs, Detail Paper, Detail Bronze, Detail Silver, Detail Gold, Detail Platinum, Letter Arrival, Letter Read, Medallion Letter, Yearly Drop, Drop Received
* **Log, urge log, overview, weekly report** (20): Log Chooser, Lapse When, Lapse Trigger, Lapse Done, Log Urges, Log Check-ins, Log Reports, Urge Overview Summary, Urge Overview, Urge Overview Mood, Urge Overview When, Report Ready, Weekly Report, Weekly Report Days, Weekly Report Urges, Urge Log Intensity, Urge Log Trigger, Urge Log Outcome, Urge Log When, Urge Log Done
* **Settings and profile** (10): Settings, Edit Profile, Sheet Profile Photo, Sheet Edit Name, Settings Weekly Report, Settings Check-in Time, Your Vow Page, Sheet Sign Out, Data Privacy, App Lock
* **Post-slip flow** (31): Slip Entry, Slip Close It, Slip When, Slip Fed, Slip Logged, Slip Urge Now, Slip Dont Fail Twice, Slip Stop Here, Slip Third, Slip Pledge, Slip Begin Again, Slip Morning After, Slip Feel Ashamed, Slip Feel Bored, Slip Feel Lonely, Slip Feel Stressed, Slip Feel Rejected, Slip Feel Tired, Slip Feel Turned on, Slip Feel Not sure, Slip Trigger Late night, Slip Trigger Scrolling, Slip Trigger Sexual content, Slip Trigger Boredom, Slip Trigger Loneliness, Slip Trigger Stress, Slip Trigger Argument, Slip Trigger Couldn’t sleep, Slip Trigger Being alone, Slip Trigger Habit, Slip Trigger Not sure

**Lessons:** all 84 lessons, 1,273 pages (Weeks I–XII), every page compared; visualisations (chain,
compare, pairs, wave, track, bars), questions with selected answers, reflect notes, best answers, task pages and
"Done when" cards, completion pages; all 1,273 pages again at 375×667, where the 46 that do not fit scroll clear.

**Screens no frame draws** (restyled to their closest frame, existing copy and behaviour kept): sign-up
(gate, form, verify), Welcome Back address / password / verify steps, the under-18 gate, slow-boot splash,
Life Map, Library index (the week pager), lessons browser, search, first steps, locked weeks, the Journey
campaign and chapters, journal, new journal entry, affirmation, check-in modal, /reminders, notify primer,
paywall sheet and offering paywall, subscription states, rough days and protocols, the SOS stages (tap, odd one
out, ring, breathing) and SOS settings sheet, the urge hub's empty panes, /all, support, back-tap, mail,
medallion boards for one-offs and unearned faces, the letter arrival for both posts, plus loading, empty and
error states (kit `LoadingView` / `EmptyState`).

## Remaining differences that could not be resolved

Every app frame is within 0.5 % of its reference except the seven marked *, and every one of the
differences below was looked at in the strip. None is a layout, type or colour mismatch: each is the
frame's sample data that no real account can produce, a recorded decision, or the platform.

| Screen | Pixel diff | What differs | Why it stays |
|---|---|---|---|
| Detail Paper * | 5.65 % | tier line and quote under an unearned Vici | the frame keeps the previous drop's 7-rung text ("First at ×1", "Nine minutes…"); the app shows the current ladder's first rung (×5) and that tier's line, consistent with Tiers Vici (D274) — your call |
| Today Home * | 1.89 % | the 30-day score line | the frame's line is drawn by hand; the app plots the account's real 30 days (D230) |
| Starting Score * | 1.80 % | 842 vs 1,000 on the gauge | the frame's sample 842; the app's own starting rating is 1,000, as the frame's own Score Detail and Ranks floor at 1,000 (D329) |
| Score Detail * | 1.78 % | the curve and the insight number | sample data (+234 vs +90 for the seeded account) |
| Score Detail Moves * | 0.75 % | the ledger's values | the frame's ledger belongs to a 17-day account under a 1,240 header (D134) |
| Urge Hub Now * | 0.66 % | the timer arc | the frame's arc (62 %) contradicts its own 17:42 of a 20-minute window (D066/D257) |
| Medallion Letter * | 0.55 % | the enclosed medallion | the frame encloses Rebound; the app encloses the medallion the account actually earned (Vici) (D275) — your call |
| Log Reports | 0.43 % | the sparkline | drawn art vs the account's data |
| Today Home II, Today Home Task | 0.42 % | the lesson tile's text | the frame's mock tile "Lesson 5 · Naming your triggers" is not a lesson in the new course; the app shows the day's real lesson |
| Urge Hub Breathe | 0.19 % | the breathing orb (animating) and the settings gear | the gear keeps the old one-tap path to SOS settings from the hub (D256) |
| Change Pledge Sheet | 0.19 % | dimmed nav row behind the scrim, the text caret | the live screen stays under the sheet (D095); the platform caret |
| Enlisting Aegis | 0.17 % | the spinner | it turns |
| Paywall, Yearly Drop | 0.10 % | ✕ where the frame writes "Restore" | neither frame draws a way out; D323 keeps one (Restore stays in the footer) |
| Morning 1 Yesterday | 0.06 % | the digits "+11 → 1,064" vs "+12 → 1,240" | sample data the other rows of the frame contradict (D097) |
| Sheet Edit Name, Night 3 Reflection, SOS Afterward | ≤ 0.02 % | a 2-pt caret bar | the frames draw a caret; the app uses the platform's |
| Lessons and week pages | ≤ 0.017 % | a few pixels on illustration edges | anti-aliasing of the same paths through react-native-svg vs a CSS transform |

**At other phone sizes** there is nothing to compare against pixel for pixel; the layouts follow one rule
(D320): on a short phone, decorative art between content and controls steps aside, hero boards rise and then
scroll, a fixed board's open gaps tighten (never under 24) before anything scrolls (D406), and what still does
not fit scrolls between the nav and the controls with a fade at its foot (D405) and, on native, a flash of the
scroll indicator (D347). On 375×667 the Paywall, the three check-in time boards and Cost Next 30 now show whole;
the boards that still open with their last item under the fade are lists and reading pages (questionnaire
options, lesson pages, the week pages, letters) and three boards with no gap left to give (Reminders Setup and
SOS Challenge, whose art already sits at its ceiling, and the foot of Yearly Drop's price card) — reachable by a
short scroll, never under a control.

## Decisions that are yours

1. **Delete the old lesson reader?** The rebuild left 14 files unimported (the previous reader, its art and the
   old task scenes, ~2.6 MB: `src/components/lesson/{scroll,reader,pages,cover,coverL1,marks,scenes}.tsx`,
   `src/components/scene/SceneKit.tsx`, `src/components/task/TaskScene.tsx`,
   `src/content/{lessonReader,coverScene,readerRoom,lessonPlates,taskScenes}.ts`). The session's safety policy
   would not delete them without your yes. They are also kept in `refs/snapshots/pre-overhaul-full`.
2. **Paywall and Yearly Drop dismiss** — the frames draw no way out; an ✕ sits where Paywall Rescue draws one.
3. **Detail Paper** (frame's old tier text vs the current ladder) and **Medallion Letter** (Rebound vs the
   medallion actually earned) — data-consistent today; switching to the frames' words is one line each.
4. **Starting Score** shows the app's real 1,000, not the frame's 842.
5. **Copy for states no frame draws**, written from the app's existing words and waiting for approval: SOS
   Reassess lines ("Rising — from X to Y", "Holding steady — still at N"), the breathing heads, "Under a minute,
   start to finish.", the hub's "Signed today/yesterday.", the vow re-sign confirmation, the breathing stage's
   "Hold it." / "Breathe out slowly." (D253). Two hub panes (Proof and Surfed before) draw no bars and no card
   when no urge has been timed yet, as the old panes did; a line there would need words from you (D257).
6. **SOS orb colours** (blue / violet / gold / silver, opt-in in SOS settings) are the only hues left in the app.
7. **Cost By Age 80's back chevron** is drawn `#17160F` on `#111111` in the frame — nearly invisible; it is
   reproduced (and works). One line to draw it in ink.
8. **Behaviour that predates this run** and was kept: the onboarding plan's suggestion for unusual answers
   (it can name scrolling when the user never chose it), the vow's "Sign" stores nothing, and the night check-in
   names today's lesson task as tomorrow's action.
9. **What is committed.** Your commit `a12db7f7` ("a", 5 Oct) holds the run up to that point, including the
   verification artefacts (`.overhaul/`, `.vicifull/` captures, about 29,900 files). Everything after it (the
   Phase 3 fixes, the final-pass fixes above, `src/lib/pledge.ts`, the final captures) is uncommitted on `main`.
   `git diff refs/snapshots/pre-overhaul-full -- src` shows this run's source changes alone.

## Not verifiable here

* Every measurement is the web build. The native app was spot-checked on two simulators: iPhone 17 Pro
  (six screens and their controls) and iPhone SE 3rd generation at 375×667 (Paywall, a check-in time board and
  Yearly Drop tightening exactly as on web; lesson pages in scroll mode; compare and pairs cells). The SE pass
  found native's greedy wrapping leaving a lone last word where the web's `pretty` does not; native now ties
  such a word to the one before when `pretty` would (D407). Not measurable here: native line breaks still follow
  the platform away from 393 beyond that rule (no `balance` on native), the keyboard lift in sheets,
  drag/gesture feel, the RevenueCat purchase UI, and the real Convex backend.
