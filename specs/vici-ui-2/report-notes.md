## The run

- Starting branch: `vici-overhaul-final`. Baseline commit on it: `a28abcc4` ("pre vici ui 2 baseline"). Work branch: `vici-ui-2`, commits `c40961f4` … the head named above. Nothing was committed to `main` or to the starting branch.
- Design source: `Vici UI 2/` only (D1). Older folders were read only to find out what the new bundle changed (`scripts/vici-ui-2/change-kinds.py`, `merge3.mjs`), never as a source of truth.
- Comparison: every artboard rendered in WebKit at 393 × 852 @3x with a stopped clock and the app's own Lato files (D4, D5); the app shot in the iPhone 16 simulator through the dev harness at the same state, data and status-bar time; `scripts/pixel-diff.mjs` diffs them (status bar and home indicator excluded, D2). Noise floor: glyph-edge antialiasing, ≤ 1 device pixel along text, ≤ 2 device pixels of drift along a line (D16).

## Every change, by category

**Flows rebuilt (new boards and behaviour).** SOS (D7–D12): rate, place, what's feeding it, feeling, one task from the library, the hub's pages, the check, the close; the SOS tab opens `97 · Urge or Relapse`. Relapse (D17, D19, D20): when, what led up to it, watching again, one message chosen from the record, the relapse log. Check-ins: two new steps, "One goal" and "Proud of" (D38). Urge Overview: one page in two parts (D42). Weekly report: five short pages, and Report Ready counts them (D43).

**Positions and sizes the new bundle moved.** Onboarding: Where we'd start (hero 129, stack 390), Start here (166, 427), the cost boards (−21), the line boards (chart 355), One bad day (287 / 409), A letter arrived (181 / 442), the vow (184), the medallion (480), reminders (bell 74.7 at 1.034, 311, 461), Day 0 (406). Today: the rating's caption under the figure (244), "This morning" with its sun (620), the task's caption under it with its tick, the tiles' captions under their titles, the pledge's quote mark (408 / 439), tonight's card at 596. Score: the figure at 156 over its caption at 234, the band at 266, no page captions. Check-in covers: the day and the time as an icon row. Library weeks: the numeral in the nav, the stack at 362, every hero's top. Urge log: When as ruled Date / Time rows, Logged without its disc, the art at 521.9. App lock: no padlock disc, the column at 120. Your vow: the vow read back over a signature rule. Post and drop: stacks at 486 / 466.

**Copy the bundle changed** (taken, D34): "Veni." / "Your first medallion. You started."; "By age 80, if nothing changes."; "Signed on Day 0, Jun 9"; Day 0's card; "A relapse / When it happened and what led up to it"; "Optional" as a 15/400 line; Report Ready's "Five short pages.". **Copy the bundle left** where the owner had rewritten it on 10 Oct stays the owner's (D28) — every such row says so in its note.

**Components and kit.** Nav pips (Start here steps), nav bars (weekly report), the `journal` field, the book / sun / tick / quote / calendar / clock / moon / trend glyphs, `PledgeCard`'s quote mark, the Hero clearance rule (D41).

**Text rendering (all screens).** Kerning restored (no zero letter spacing, D25); the frames' own line breaks for every run they break, paragraphs with a bold run included (D13, D23, D32); the system face for arrows and dingbats (D26); CSS's half-leading on lines tighter than Lato's natural height (D40).

**Art.** Heroes regenerated from the screens (D24), drawings unclipped (D27), `paint-order` rewritten (D21), the Where card's room drawings generated from 91B (D42).

## Differences found on screens that looked unchanged

The bundle-to-bundle markup diff called these unchanged (or hero-only); the pixel diff found otherwise, and each was fixed at its property:

- Every week page (78–101): the nav row carries the week's numeral (15/700) — the app drew no title there.
- The questionnaire's single-answer boards: the frames draw their own answer chosen; the harness now sets it (D33) — not an app change, but it is why these boards first read 8–12 %.
- Urge log, What did you do: the clipboard sat 2 pt high — the clearance rule read stale bounds (D41).
- Medallion tier pages: every large figure ("×23", "Day 13") sat ~1 pt high — the half-leading (D40).
- Morning pledge boards: the quote mark sits in a 27.3 line box, not 24.
- Urge log, When: a ruled row is 56 plus its rule (57), not 56 including it.
- Settings: the owner's added rows make the column scroll at 852, and the scroll band drew its rows past its foot, under "Sign out" — the band now clips once its content is taller than it (D47).
- Week IV and lesson 72's page 14 first read 7.7 % and 3.3 %: shot before the page had settled; with the settle the harness now waits for, 0.105 % and 0.052 % (the rig, not the app).

## Pass 3: what was checked again

- **Every drawing at its own size.** Each row's diff mask was scanned in 100 × 100 pt windows (`scripts/vici-ui-2/window-scan.py`), so a drawing, chart or card that is wrong inside a board that is mostly right shows however small a share of the frame it is. No lesson, SOS or relapse board has a window at 4 % or more. The 62 app boards that do were each cropped and read: every window is copy or data the row's note names; on the medallion details the whole block sits 13 or 26 lower because the boards centre on the quote's length (`T = 196 − 13 · lines`) and the owner's quotes are one or two lines shorter than the frames' — the drawings themselves match.
- **The real app, by tapping.** `scripts/vici-ui-2/flows.mjs` reaches 16 boards the way a user does — the tab bar (Today, SOS, Log, Library, Journey), Today's rating into Score, Settings into App lock, Data & privacy, Edit profile and Your vow, the morning check-in from Today, Reports in the log, a medallion from the album — and diffs each arrival against its frame. Every arrival equals its harness shot to the thousandth of a percent: the boards sit the same inside the real navigators and tab bar.
- **Text that pixelmatch calls antialiasing.** The diff runs with `includeAA: false`, and thin grey text on the dark ground reads to pixelmatch as antialiasing, so a different word can score as noise (Login's owner subtitle against the frame's: 0.322 %). Every board was checked again with a shift-tolerant comparison (`scripts/vici-ui-2/text-scan.py`): each 40 × 40 pt window with ink in the frame is compared with the app at its best alignment within ±2 pt, so the same text a fraction of a point off nearly vanishes and different text does not. Boards with identical text score up to about 1.07 (large bold type leaves the most edge); every board above 1.1 was read, and each is copy or data its note names — four rows had no note and got one (the log chooser's owner line, the SOS hub's live timer, two seeded dates and a seeded count).
- **Furniture across screens.** The nav row (54–102) and the foot (740–818: the pill, the ghost, the tab bar) were diffed band by band across every board (`scripts/vici-ui-2/band-scan.py`). Sixteen boards pass 1 % in a band; each was read. Fifteen are copy or data their notes name (the streak pill's number, the letter's "From VICI", the slip week's two report pages); one was a difference: `21D6 · Change the pledge` draws nothing behind its sheet, and the app showed the check-in's nav row through the scrim — it now gives way while the sheet is up (D48), and the morning boards went back through the passes.
- **Motion, against the specs.** The SOS breath (in 4 s, hold 4 s, out 6 s from 350 ms, CSS ease-in-out; 0.6 over 0.3 s before the first breath), the SOS pages (340 ms, `cubic-bezier(0.2, 0.8, 0.2, 1)`), the relapse spinner (one turn in 0.8 s, linear) and the relapse wheel's settle (0.2 s ease-out) are the values in code (`src/components/urge/sos.tsx`, `src/components/slip/relapse.tsx`).

## Where the platform cannot match the design exactly

| where | design | app | gap |
|---|---|---|---|
| glyph edges everywhere | WebKit's antialiasing | Core Text's | ≤ 1 device px at edges; ≤ 2 device px drift along a long line (D16) |
| text fields (Name, the journal steps, the pledge sheet, the reflection) | a drawn caret; the typed line on the line box | iOS caret only while focused; `UITextView` sets its first line ~1 pt lower | 2 × 20 pt caret; ~3 device px on the typed line (D29, D39) |
| text fields | `text-wrap: pretty` | greedy wrap | the last word of a typed line can fall on the next line |
| keyboard | not drawn | iOS draws it when a field is focused | the harness puts it away (D29) |
| arrows and dingbats in Lato runs | system face via CSS fallback | system face via `latoRuns` | matched (D26) |

## Verified by spec only

`relapse__` / `app__313–316`: "When — small phone (667 pt tall)", "What led up — larger text", "Encouragement — larger text", "Encouragement — small phone": the comparison rig shoots one device at the default text size (D3, D22). Their rules are in `specs/vici-ui-2/relapse.md` and checked in code.

## Not implemented

- `93B · Profile photo sheet` (app__285): the owner removed photos (no photo pipeline, D480, commit 9487e33d); the frame's sheet has nothing to act on.
- `91A`'s "30 days ⌄" range picker: the frame draws no options (D42).

## The dev harness

- Start Metro with `EXPO_PUBLIC_FORCE_MOCK=1 EXPO_PUBLIC_HARNESS=1 npx expo start --dev-client` and run the development build in the simulator.
- Start the target server: `node scripts/vici-ui-2/harness-server.mjs` (port 8099). The app polls it (`src/dev/HarnessDriver.tsx`).
- Capture and diff ledger rows: `node scripts/vici-ui-2/check.mjs '<row regex>'`; one board: `node scripts/vici-ui-2/shoot-app.mjs <view> <state>:<name>`. Views on `/dev/harness?view=`: `sos`, `relapse`, `chooser`, `textlab`, `vlab`. Routes are opened with a seeded account (`pixel-diff/seeds/`, `scripts/vici-ui-2/capture-seeds.mjs`), a stopped clock and the target's steps (D35). Under the harness a scroll view does not flash its indicator on mount (the frames draw the settled board) and arrival modals (a letter, a medallion) are held back; neither changes a build without `EXPO_PUBLIC_HARNESS=1`.
- Excluded from production: the harness screen (`src/dev/HarnessScreen.tsx`, its fixtures, the text labs) and the driver (`src/dev/HarnessDriver.tsx`, which polls `localhost:8099`) are required only behind `__DEV__` (and, for the driver, `EXPO_PUBLIC_HARNESS === '1'`), which a release build folds to `false`, so neither is in a release bundle — checked by exporting the iOS release bundle and searching it: no `localhost:8099`, `HarnessScreen`, `VLab`, `textlab`, `sosFixture` or `RELAPSE_PRESETS`. In a release build `/dev/harness` redirects to `/`. The press / scroll / field registry (`src/dev/harnessRegistry.ts`) stays in the bundle as no-ops (`HARNESS` is `false`); `/splash?hold=1` and `/paywall?stage=` are read only under `__DEV__`, and `/welcome?step=` only in a mock build (`EXPO_PUBLIC_FORCE_MOCK=1`).
