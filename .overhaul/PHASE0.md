# Phase 0 — the shared kit and the prerequisites (one owner per file)

Read `.overhaul/BRIEF.md` first, then `.overhaul/understand/design-system.md` (the measured spec) and
`.overhaul/understand/CRITIC.md` §3–§7 (canonical rulings). The per-group docs in `.overhaul/understand/`
describe the screens that will consume your pieces — skim the ones that use them so your API fits.

## What already exists (orchestrator — do not edit, ask in your report if you need a change)

* `src/lib/theme.ts` — `mono`, `monoDark`, `toneRamp`, `illus`, `ring`, `lhNormal()`, `type` (named
  text styles), `layout`, `sans()`, `sansItalic()`, `LATO`.
* `src/components/mono/` — `Screen` (+ `ScrollRegion`, `useCanvasTop`), `Tap`, `MonoText`/`H1`/`Title`/
  `P`/`Caps`, `NavBar`/`NavDashes`/`TitleHead`, `PrimaryButton`/`GhostLink`/`NextFab`/`IconCircle`/
  `RingNext`, `icons.tsx`. `index.ts` already re-exports every Phase 0 file below — **only fill your files**.
* **Children of `Screen` use canvas coordinates verbatim** (`top: 136` is the frame's 136; `bottom: 48` is
  off the screen edge). A replica of V3 Q1 built from these pieces diffs at 0.00 % (`/kit-lab?f=V3-Q1`).

## Verify every piece against real frames: the kit lab

`/kit-lab?f=<FrameStem>` renders a replica registered in `src/components/mono/lab/<yourpart>.tsx`
(`LAB_<PART>`). Build replicas of the frames listed for your part **from your components** (plain Views
only for the parts of the frame that are not yours or are screen-specific), then:

```bash
node scripts/overhaul/shot.mjs app "/kit-lab?f=Settings" .overhaul/shots/lab-Settings.png --sig=lab-Settings --wait=1200
node scripts/overhaul/sigdiff.mjs d-Email-Login-Settings lab-Settings
node scripts/overhaul/pxdiff.mjs .overhaul/shots/design/Email-Login/Settings.png .overhaul/shots/lab-Settings.png
# then Read .overhaul/shots/lab-Settings.strip.png and LOOK at it
```

Iterate until the regions pxdiff reports are only things that are not yours (say which) — target < 0.3 %
on your component's area. Also capture each replica at `--w=375 --h=667` and `--w=430 --h=932` and
look for clipping/overflow. Keep the replicas: the final audit re-runs them.

## Decisions

Write your decisions to `.overhaul/decisions/<part>.md` (numbered in your range), never to DECISIONS.md
(the orchestrator merges). Ranges: kit-choices D350–359, kit-overlay D360–369, kit-hero D370–379,
kit-chrome D380–389, splits D390–394, curriculum D395–399.

Orchestrator rulings already taken (D320–D338, in `.overhaul/decisions/orchestrator.md`): small-screen
policy = CRITIC §7.3; disabled primary = same pill at opacity 0.38 (`DISABLED_OPACITY`); undrawn states =
CRITIC §7.4 (toggle off: track `#2E2E2E` knob `#F2F0EC` left 3; day toggle off: `#1E1E1E` + 14/700 ink;
lesson option selected: ink row, `#111111` filled marker, `#F2F0EC` letter; inputs: caret ink,
placeholder `#9B968E`, dark keyboard); kit text caps font scaling at 1.3×; hero ids are the 53 cards'
`data-hero` ids with alias `windowNight → nightMoon`; copy for undrawn states = keep the app's existing
strings.

---

## Part A — `kit-choices` → `choices.tsx`, `rows.tsx`, `pills.tsx`, `cards.tsx`, `lab/choices.tsx`, `lab/rows.tsx`

* `choices.tsx`: `OptionList` (+ `Option`), `Grid2`, `Chips`, `WhenChips` (44 pills), `Segmented` —
  design-system §7.10–7.12, §7.16, §7.17 (when-chip). Controlled (`value`, `onChange`), single and multi
  (`multi`, `exclusive` values that clear the others — auth-funnel §… "Nothing in particular"), optional
  `max` (What it affects caps at 3). The 0.04 lift shadow is a prop (`lift`) — V3 frames carry it.
* `rows.tsx`: `RowGroup` + `Row` (54-row settings idiom, §7.14; value, chevron, toggle, `muted` label,
  no-chevron rows, `numberOfLines` only for dynamic values per CRITIC C11), `Toggle` (§7.15 + off state),
  `ListRows` (60-row kit list, Manage Subscription), `RuledRows` (log rows on the ground, 52/56/46 heights,
  dot), `DetailRows`/`SummaryCard` (**shrink-to-fit**, CRITIC C10), `CheckRows` (§7.14).
* `pills.tsx`: `Pill` (range / badge / status / dark tag / place / lesson tag / outline small / streak /
  delta / check-in chip — §7.17), `CheckDisc` (§7.23 incl. the inverse Paywall radio, hollow and current
  states).
* `cards.tsx`: `Card` (filled card padding variants, outline card, selected-plan card, tile card, icon list
  card — §7.13).
* Replicas (must build): `V3-Q1` (OptionList — reuse the core lab's numbers), `V3-Q5` (Chips),
  `Checkin-Emotions` (Grid2 + NextFab), `Settings`, `App-Lock` (Toggle on), `Manage-Subscription`
  (ListRows + badge + card), `Log-Urges` (Segmented + ruled rows — leave its chart as a plain box),
  `Lapse-Done` and `Urge-Log-Done` (SummaryCard both widths), `Lapse-When` (WhenChips), `Your-Vow-Page`
  (status pills, card), `Morning-1-Yesterday` (CheckRows).

## Part B — `kit-overlay` → `Sheet.tsx`, `TimeWheel.tsx`, `Field.tsx`, `PledgeCard.tsx`, `Progress.tsx`, `lab/overlay.tsx`

* `Sheet.tsx`: scrim `rgba(0,0,0,0.68)` over everything incl. the status-bar band, panel `#171717`
  `28 28 0 0` anchored by canvas `top` (120 / 420 / 512 / 556), grabber, content `left 24 right 24 top 44`,
  frame-level buttons at z 42, keyboard lift, open/close animation, back-gesture/scrim-tap dismiss. Works
  as an in-tree overlay over the screen it belongs to (the frames draw the screen underneath).
* `TimeWheel.tsx`: `TimeWheel` (§7.26: band, 44 rows, 30/900 · 22/400 mute · 22/400 line, colon, AM/PM
  column; value `{hour12, minute, period}`, `onChange`, looping hours/minutes, snap 44, **tap a neighbour
  row to step**, minute step option) and `DayToggles` (on + off state). Current implementation to learn from
  and replace: `src/components/routines/wheel.tsx` (+ `kit.tsx`) — note FINDINGS's half-point `lead` bug
  there (`.vicifull/ORCHESTRATOR-TODO.md` §4b); do not port it.
* `Field.tsx`: `TextField` (Name field 60/r18, sheet field, long-text cards 20/700/29 and 20/400/30, the
  borderless 22/400/34 reflection input) — §7.27 + CRITIC C9 (placeholder `#9B968E`, typed value ink).
* `PledgeCard.tsx`: unsigned (dashed `#5A574F` line) and signed (name in `sansItalic()` on a 1.5 ink
  line) — today-day, slip, sos-flow docs; sizes per frame (28 / 24 / 22 / 16 signature).
* `Progress.tsx`: `Spinner` (88 svg, rotating), `StepList` (done/current/pending) — §7.25.
* Replicas: `Change-Pledge-Sheet`, `Sheet-Edit-Name`, `Sheet-Sign-Out`, `Sheet-Profile-Photo` (underlying
  screen as plain Views), `Morning-Check-in-Time` (wheel + day toggles), `Lapse-When` wheel region,
  `Morning-Resign-Pledge`, `Morning-Pledge-Signed`, `Enlisting-Aegis` (spinner + step list),
  `V3-Q24-Name` (field), `Night-3-Reflection` (reflection input), `SOS-Afterward` (long-text card).

## Part C — `kit-hero` → `scripts/overhaul/gen-heroes.mjs`, `src/content/heroes.ts` (GENERATED), `Hero.tsx`, `LaurelMark.tsx`, `MedalTier.tsx`, `lab/hero.tsx`; plus `scripts/overhaul/body.mjs`

* Patch `scripts/overhaul/body.mjs` `SVG_ATTRS` to include `paint-order`, `data-hero` (and anything else the
  heroes carry that it drops — check).
* `gen-heroes.mjs`: CRITIC §7.1 exactly (first 393×240 svg of each of the 53 `Lesson-Illustrations-v4`
  cards; all attributes; `paint-order="stroke"` emitted as two elements; alias `windowNight → nightMoon`;
  bounds from `Vici Overhaul/project/gen/hero-bounds.json`, verified). Assert every `data-hero` used on the
  254 Email-Login frames and the 1,273 lesson frames byte-matches its card (CRITIC §0.4 says 150/151 + 284/284).
* `Hero.tsx`: CSS mode (`id, top, scale=1.1`, screen-wide padded viewBox — CRITIC §7.1, design-system §7.29;
  `position:'absolute'` always) and crop mode (Today II/Task/III — today-day §0.5); a `box` mode for the
  lesson reader's `393×176` box with `top:-36` (lessons doc §5.2) — confirm with one lesson cover.
  `HeroBoard` (CRITIC §7.2): nav + hero + centred stack (caps/title/body) + primary/ghost, `titleSize`
  variants, `ctaBottom`, dark tone, plus the small-screen rule (lift hero+stack by the deficit, art top ≥
  canvas 108).
* `LaurelMark.tsx` (tintColor `#FFFFFF`, `resizeMode="stretch"`, sizes 120/104/40/28), `MedalTier.tsx`
  (§7.31 tiers 0–4, dim 0.32).
* Replicas: `Onboarding-Start` (hero T 190 + statement), `SOS-Loc-Bed` and `SOS-Trig-Habit` (HeroBoard),
  `Slip-Entry`, `V3-Q3b` (scale 0.76), `Cue-Hue-Picker` hero region (0.723), `Splash` and `Login` laurel
  regions, `Breakwater-Gold` medal row, `Today-Home-Task` (crop mode), and `Week-01-Reset` `L1-Frame-1`
  cover (box mode — key it `L1-Frame-1`; design PNG is in `.overhaul/shots/design/Week-01-Reset/`).
  Check at 430 wide that full-bleed art reaches both edges.

## Part D — `kit-chrome` → `TabBar.tsx`, `scales.tsx`, `Feedback.tsx`, `lab/tabbar.tsx`, `lab/misc.tsx`; `src/components/StoicTabBar.tsx`, `src/app/(app)/_layout.tsx`, `src/app/+html.tsx`, `src/lib/format.ts`, `.overhaul/clock.js`

* `TabBar.tsx` (§7.18, standalone-capable for screens outside the tab navigator) and wire it as the tab bar:
  five items Today · Log · SOS (disc → pushes `/urge`, CRITIC C12) · Library · Journey (→ `milestones` —
  active on Medallions and on Score Detail per §7.18; today-day §0.6 has the route mapping). Bar height
  `70 + max(insets.bottom, 34)` laid out so the icons sit at canvas y 762 on 852; ground + noise painted
  behind the bar (D327) so scrolled content never shows through. `(app)/_layout.tsx`: replace `All` in the
  bar with the five tabs (keep `all` and the other hidden routes registered and reachable — nothing is
  removed); move `/score` under `(app)` as a hidden tab route **only if** it can be done without breaking
  existing links (else note it for today-day). Keep every effect in `(app)/_layout.tsx` untouched.
* `scales.tsx`: `PagerDots` (§7.20), `ToneScale` (§7.21), `IntensityScale` (§7.22 incl. the previous-level
  bar of Reassess and Morning Energy's fill-meter variant), `EnergyBars` if separate.
* `Feedback.tsx`: mono `LoadingView` (the spinner from Part B is not yours — use a plain ground + a small
  `ActivityIndicator` in ink until Part B lands, then switch if it fits), `EmptyState` (caps + p on ground,
  routes.md §7–8). Replace the bodies of `src/components/ui/Feedback.tsx` to delegate to these so every
  existing caller gets the new look.
* `src/app/+html.tsx`: web root with `-webkit-font-smoothing: antialiased` and the `#0D0D0D` body
  background (design-system §10.12) — check expo-router's `+html` conventions for SDK 56 first.
* `src/lib/format.ts`: number → words (sentence-initial capital, hyphenated, to ≥ 1,000), day-part phrases
  (`Tonight, Tue Jul 22` / `Last night` / `Yesterday` / `Today` — see logs.md and slip.md for the exact
  rules), the `", "` lower-case join, en-US short dates, roman numerals — with unit tests as a node script.
* `.overhaul/clock.js`: an init script that freezes `Date` to `window.__CLOCK` / a `?now=` param, for
  recipes (CRITIC G3).
* Replicas: `Today-Home` bottom (tab bar — the rest of the frame as plain boxes is fine), `Log-Urges` tab
  bar, `SOS-Strength` (IntensityScale), `SOS-Reassess`, `Morning-Feeling` (ToneScale), `Morning-Energy`,
  `Urge-Hub-Score` (PagerDots, dark).

## Part E — `splits` → mechanical file splits, no visual change

CRITIC §3.1.4 exactly: `src/components/urge/index.tsx` → `urge/flow.tsx`, `urge/hub.tsx`,
`urge/stages.tsx`, `urge/boards.tsx` (+ `index.tsx` re-exports `UrgeFlow`/`UrgeHub` and everything else
external code imports — grep the importers); `src/components/onboarding/handover.tsx` → move `O3Reminders`,
`O3DayZero` to `onboarding/reminders.tsx`; `src/components/onboarding/v3.tsx` → funnel engine (`O3Shell`,
`O3FunnelStep`, `O3AgeGate`) to `onboarding/funnel.tsx`. Update imports everywhere. Prove no behaviour
change: `npx tsc --noEmit`, and capture 3 screens per split before/after (`/urge`, `/urge-hub`, `/welcome`
first step, `/reminders`) — identical PNGs (pxdiff 0.00 %).

## Part F — `curriculum` → `scripts/overhaul/gen-curriculum.mjs`, `src/content/curriculum84.ts`

Lessons doc §10 (and CRITIC §3.1.5): regenerate `curriculum84.ts` from the 12 week canvases — titles from
each lesson's `L<n> Frame 1`, `hero` = the cover's `data-hero`, week titles/subtitles from the Email-Login
week covers, task fields per lessons §10.3 — **API unchanged** (every export and type the app imports keeps
its shape; add fields, don't remove). Then grep every consumer (`today`, library, Day Zero, Night Action,
search, profile, task/lesson-card…) and confirm they compile and show the new titles. Do **not** touch the
lesson reader or `lessonReader.ts` (that is the lessons group, Phase 1). Write the old→new title table into
your report.
