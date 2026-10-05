# VICI — `Vici Overhaul` run (Oct 2026). Shared brief.

Read this before touching anything. It is the same for every agent on this run.

## What the job is

`Vici Overhaul/` (dropped 4 Oct 2026) is a Claude Design handoff bundle and the **single source of
truth** for the app's UI. It is a *complete* restyle, not a revision: the previous drop
(`Latest Vici FULL/`, which the app currently matches) was a light paper system in the system font
with gradients and washes; this drop is a **flat dark monochrome system in Lato** (ground `#0D0D0D`,
cards `#1E1E1E`, ink `#F2F0EC`, a noise texture over every frame), with a new tab bar
(Today · Log · SOS · Library · Journey) and a **rebuilt lesson format** (each lesson is now one
14–16-frame reader that ends in its own task, with new titles and new copy).

The running Expo app must match the bundle pixel for pixel on every screen and every state, while
**keeping every control working and every piece of functionality the app has**. Copy the canvas's
numbers character for character — do not round, do not substitute a token whose value differs, do
not "improve" spacing, do not infer geometry from a screenshot when the CSS states it.

## Where everything is

| thing | path |
| --- | --- |
| design bundle | `Vici Overhaul/project/*.dc.html` (never open raw — 2 MB) |
| split frames | `.overhaul/final/<Bundle>/<Frame>.html` (+ `_index.json`, `_helmet.html`) |
| the canvas's flow order + badges | `.overhaul/FLOW.txt` |
| structured scenes | `.overhaul/scenes/Email-Login.json` |
| the designer's own generator kit | `Vici Overhaul/project/gen/mono-kit.js`, `mono-*.js` — **a guide to intent, not the spec**: where a frame and the kit disagree, the frame wins |
| previous run's frame→file map | `.vicifull/map.json`, `.vicifull/MAP.md` (251 of 254 frame labels are unchanged) |
| previous run's recipes (how to reach each screen) | `.overhaul/recipes/*.json` (copied, paths repointed) |
| seeds / drive scripts | `.overhaul/*-seed.js`, `.overhaul/drives/` |
| project decisions & conventions | `DECISIONS.md` (D001–D157; this run adds D200+) — 215 KB, grep it, don't read it whole |
| this run's analysis | `.overhaul/understand/*.md` |
| pre-overhaul backup | `.overhaul/backup/pre-overhaul-src.tgz`, git ref `refs/snapshots/pre-overhaul-tracked` |

Bundle slugs: `Email-Login` (254 frames — the whole app), `Week-01-Reset` … `Week-12-Leave-It-Behind`
(102–112 frames each: the 84 lesson readers, `L<n> Frame <k>`), `Lesson-Illustrations-v4` (53 spot
illustrations).

**Not build targets:** `Vici Overhaul/project/ref/`, `ref-stoic/`, `uploads/` (third-party app
screenshots and docs the designer worked from), `screenshots/` (the designer's own check captures),
`exports/` (older intermediates), `Latest Vici FULL/`, `UI Final*/`.

## Reading a frame

```bash
node scripts/overhaul/body.mjs .overhaul/final/Email-Login/Today-Home.html
```

prints the frame's whole tree — every offset, colour, radius, shadow, type metric and SVG attribute,
verbatim, with the phone chrome (status bar, home indicator) removed. Those numbers are the spec.

## Two servers are running

* `http://localhost:8097` — design frames. `GET /f/<bundle>/<Frame>.html` renders one frame pinned at
  0,0, **with Lato served from the app's own TTFs** (`@expo-google-fonts/lato`), exactly the faces
  the canvas's Google Fonts link requests.
* `http://localhost:8096` — the Expo web build of the app, `EXPO_PUBLIC_FORCE_MOCK=1`, hot reloading.
  Other agents are editing at the same time; a bundle error you did not cause may appear — wait and
  re-check before chasing it. **Never start, stop or restart either server.**

Do **not** use the Browser-pane MCP tools (`mcp__Claude_Browser__*`) — one shared pane, many agents.
Capture headlessly:

```bash
# a design frame: PNG + layout signature
node scripts/overhaul/shot.mjs design Email-Login Today-Home.html .overhaul/shots/d-today.png --sig=d-today
# the app at a route
node scripts/overhaul/shot.mjs app /today .overhaul/shots/a-today.png --sig=a-today --initseed=.overhaul/today-seed.js --do="await __sleep(1500)"
#   --initseed=<file.js>  dataset into localStorage before first paint (see recipes for which)
#   --do="<js>"           drive the page (helpers from .overhaul/drive.js: tap('Label'), __sleep(ms) …)
#   --scroll=<y|end>      scroll the main scroller before capture — use it to check below the fold
#   --w=375 --h=667       another device size; --wait=<ms>; --fast; --settle=<ms>
# numbers: layout signature diff
node scripts/overhaul/sigdiff.mjs d-today a-today
# pixels: mismatch %, regions, and a design|app|diff strip you can LOOK at
node scripts/overhaul/pxdiff.mjs .overhaul/shots/d-today.png .overhaul/shots/a-today.png --ignore=0,0,393,54
```

`shot.mjs` waits for `document.fonts.ready` and prints `[fonts] Lato NOT loaded` to stderr if the
capture would compare a fallback face — **a capture with that warning proves nothing; fix it first.**

Memory is tight (8 GB, several agents): run captures **one at a time** within your own work, never
launch more than one Chrome at once, and delete scratch PNGs you no longer need.

## Canvas → app translation rules (carried from the previous runs; still true)

1. **The status bar and home indicator are chrome the app never builds** (DECISIONS D009). A canvas
   `top: 380` is the app's `top: 326` measured from the safe-area top. The mock web build injects
   `{top: 54}` as the safe-area inset (`src/app/_layout.tsx`, `CANVAS_INSETS`), so an app capture lands
   on the canvas's own y and the two compare directly. A row exactly 54 off is a real bug.
2. **Bottom-anchored offsets are measured off the frame edge, not the safe-area inset** (D026).
3. A canvas `<span>` is usually an app `View` + `Text` (D022); CSS's strut sometimes needs an explicit
   `lineHeight` (D020); CSS collapses adjacent vertical margins and Yoga does not (D023).
4. Colours, radii, letter-spacing, font-size, font-weight and line-height are transcribed exactly.
   `letter-spacing:-0.6px` is `letterSpacing: -0.6`.
5. `box-shadow: 0 0 0 1.5px #2E2E2E` (the kit's outline ring) is a spread-only shadow: draw it as RN
   `boxShadow` (works on web and new-arch native) or an equivalent border **outside** the box — never
   a border that eats into the box's own size.
6. `text-wrap: balance` / `pretty` change where lines break. Check line breaks against the frame PNG;
   where RN cannot balance, break with an explicit `\n` only when the copy is fixed, otherwise
   constrain the width so the same breaks fall out.

## Typography — Lato everywhere

The canvas loads Lato 400, 700, 900 and (Email Login only) 700 italic. In the app, a weight is a
**family**, not a `fontWeight` (native platforms do not synthesise weights for custom fonts): use the
theme helper (`sans('700')` etc., `src/lib/theme.ts`) which maps weight → `Lato_700Bold`, and so on.
Never write a bare `fontFamily: 'System'` or a raw `fontWeight` without the family.

**The italic trap:** the medallion quotes write `font-style:italic; font-weight:400`, but the only
italic the canvas loads is 700 — style is matched before weight, so the designer's browser draws
those quotes in **Lato 700 italic**. Reproduce what the frame renders (700 italic), and say so.

## The SVG traps (cost this project screens before)

`react-native-svg`'s web build lays `<Svg>` out `position: static`, and CSS paints positioned boxes
above it. An `<Svg>` sharing a parent with an absolutely-positioned box renders **invisible on web**
while `getBoundingClientRect` still reports it in the right place — a signature diff passes with the
art gone.
* Any `<Svg>` with an absolutely-positioned sibling must carry `style={{ position: 'absolute', top: 0, left: 0 }}`.
* Never pass `rotation`/`originX`/`originY` to `<Svg>`; use a `transform="rotate(a cx cy)"` string.
* CSS `transform: scale(1.1); transform-origin: 196px 190px` on an `<svg>` (the lesson heroes) must be
  reproduced as a wrapping `<G transform="translate(...) scale(...) translate(...)">` or equivalent —
  compute it, do not eyeball it.
* **Always look at the PNG as well as the numbers.** A signature alone is not proof the art is visible.

## House style

Match the file you are editing: comment density, naming, idiom. Comments explain *why* (a canvas
contradiction, a platform divergence, a decision), not what the next line does. Keep the canvas's
strings verbatim — curly apostrophes (`’`), middots (`·`), en/em dashes, capitalisation.

**Shared files are owned by the orchestrator:** `src/lib/theme.ts`, `src/components/mono/*` (the RN
port of the canvas kit), `src/app/_layout.tsx`, `src/app/(app)/_layout.tsx`. If you need a change
there, say exactly what and why in your report instead of making it.

## Generated content files — do not hand-edit

Files with a `GENERATED FILE — do not edit by hand` header are produced by generators under
`scripts/`. If one is wrong, fix (or fork into `scripts/overhaul/`) the generator, repoint it at
`.overhaul/final/…`, re-run it, and check the diff.

## Record how you reached each screen: `.overhaul/recipes/<group>.json`

Whenever you capture an app screen, write down how you got there (`frame`, `route`, `initseed`,
`do`, `wait`, `note`), or `"unreachable": "<why>"`. The next pass reads this file instead of
rediscovering the path. `node scripts/overhaul/audit.mjs [--group=<key>]` replays them all.

## What "done" means for one screen

1. Every string, capitalisation, punctuation and line break matches the frame.
2. Every position, size, margin, padding, gap, radius, border, shadow, opacity and background matches.
3. Every type metric matches: family (Lato), size, weight, tracking, line height, colour.
4. Icons and artwork are the frame's own paths, at the frame's own sizes and positions.
5. Every state the frame family draws — selected/unselected, active, completed, empty, disabled,
   locked, expanded — is reproduced, and every control still does what it did.
6. `pxdiff` against the design frame shows no mismatch region you cannot name a reason for, and the
   strip PNG looks the same on both sides. Content below the fold is checked with `--scroll`.

Report honestly. If something could not be matched, say which frame, which property, and why.
Where the canvas contradicts itself, name the contradiction and which reading you took.

## Run state (updated as phases land)

* **Analysis is done** — `.overhaul/understand/<group>.md` per area, `design-system.md` (the measured
  spec), `lessons.md`, `routes.md`, and `CRITIC.md` (canonical rulings; its §5 answers most open questions,
  its §7 gives the cross-cutting specs). Read your group's doc and CRITIC before building.
* **The kit** lives in `src/components/mono/` (import from `@/components/mono`). Children of `Screen` use
  canvas coordinates verbatim. Use the kit for every recurring piece; a screen-specific layout is written
  with the theme's `type`/`mono`/`ring` tokens. If the kit lacks something several screens need, or is
  wrong against a frame, report it — do not fork a local copy.
* `pxdiff.mjs` now excludes the status bar and the home indicator by default.
* Decisions: write yours to `.overhaul/decisions/<group>.md` in your range (auth-funnel D200–209, tail
  210–219, paywall-reminders 220–229, today-day 230–239, library 240–249, sos-flow 250–259, sos-boards
  260–269, medallions-letters 270–279, logs 280–289, settings 290–299, slip 300–309, lessons 310–319).
  Orchestrator rulings: `.overhaul/decisions/orchestrator.md` (D320+) — follow them.
* **What this run changed**: the previous round's work was never committed, so plain `git diff` shows both
  rounds. Use `git diff refs/snapshots/pre-overhaul-full -- <path>` (the full tree as it was before this run,
  untracked files included) to see this run's changes only.
