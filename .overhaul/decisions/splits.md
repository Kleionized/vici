# Part E — splits (D390–D394)

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
