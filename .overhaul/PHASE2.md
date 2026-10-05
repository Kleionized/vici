# Phase 2 — review every screen again, fix what the measurements and a fresh eye find

Phase 1 rebuilt every screen; this phase checks the whole app again from the outside, with numbers that
were not produced by the agents who built it, and fixes what is wrong. Rules, ownership and tools are
unchanged (`BRIEF.md`, `PHASE1.md` — your group's files are still the only ones you edit).

## Inputs the orchestrator produced (read-only for you)

* **Full pixel audit** `.overhaul/audit/report.json` / `report.md` — every Email-Login frame replayed from its
  recipe in one browser (`scripts/overhaul/audit-fast.mjs`), pixel share (pxdiff rule) + regions + layout
  signature summary, and a design | app | diff strip per frame in `.overhaul/audit/strips/<Frame>.strip.png`.
  Re-run your group with `node scripts/overhaul/audit-fast.mjs --group=<key>` (merges into the report).
* **Lesson sweep** `.overhaul/lesson-sweep/report.md` (+ strips for failing pages) — all 1,273 lesson pages,
  reached by tapping through each lesson's own controls (`scripts/overhaul/lesson-sweep.mjs --lessons=…`).
* **Phone-size sweeps** `.overhaul/size-sweep/<WxH>/report.md`, `findings.json`, `sheet-NN.png` contact sheets
  and per-frame PNGs at 375×667 (status bar 20), 390×844, 430×932 (`scripts/overhaul/size-sweep.mjs
  --size=375x667 --group=<key> --scroll`). The probe flags horizontal overflow, text under a bottom control,
  clipped text and unreachable controls — heuristics: confirm every flag by looking, and look at every PNG of
  your group even when it is "ok".
* Kit lab `scripts/overhaul/lab-audit.mjs`.

**The full size sweep was taken with an earlier probe that over-flagged** (pager pages lying off-screen by
design, text behind a sheet's scrim, content scrolling under the opaque tab bar). The probe is fixed: it now
flags only text that straddles the window edge, runs under a control it cannot be scrolled clear of, or is cut
by a non-scrolling ancestor. **Start by re-running your group's three sweeps** (`size-sweep.mjs --size=… --group=<key>
--scroll`) — they merge into the shared findings — and work from the fresh findings plus your own eyes.

## What to do

1. **Look at every strip of your group** (not only the DIFF ones) and every size-sweep PNG of your group at all
   three sizes. For each frame compare copy, line breaks, type, spacing, colours, icons and art, and states
   against the design frame; on the size PNGs look for clipping, overflow, overlap with controls, awkward
   wrapping (a single orphan word, a title breaking mid-phrase), inconsistent spacing, art not reaching the edges.
2. Every audit row ≥ 0.5 % and every region in a row < 0.5 % that is not a known, recorded residual (your
   Phase 1 report / decisions) is a defect until proven otherwise.
3. Do the carry-over items for your group (below).
4. Fix, re-run `audit-fast.mjs --group=<key>` and `size-sweep.mjs --size=… --group=<key> --scroll` for the three
   sizes, look again. Exercise the controls you touch.
5. Report per frame: final pixel share, every residual with its reason, the three sizes' verdicts.

## Carry-over items from Phase 1 (routed by the orchestrator)

* **curriculum** (D339): in `scripts/overhaul/gen-curriculum.mjs` set `cardSummary` = first sentence of the
  lesson's `practice[0]` for days 2–84 (day 1 keeps the frames' sentence); drop the `@deprecated` two-board task
  fields and `titleSize` (no reader is left — grep first) while keeping `summary`; regenerate
  `src/content/curriculum84.ts`; fix the stale header comment in `src/lib/curriculum.ts`. Then verify Today Home
  Task + Night Action Reminder + Morning Task Check still diff 0 % at day 1, and look at Today II, Night Action and
  Morning Task Check at **day 58** (longest sentence, 196 chars) at 393×852 and 375×667 — the sentence must wrap
  cleanly and push nothing under a control. You may edit `gen-curriculum.mjs`, `curriculum84.ts`,
  `src/lib/curriculum.ts` and seeds/recipes only; report any layout fix the today/day screens need.
* **auth-funnel**: drop the legacy `FUNNEL_GLYPHS` block from `onboardingFunnel.ts`/`gen-funnel.mjs` if nothing
  imports it (grep); fix `.overhaul/settings-seed.js` so `lifeMap.values` is `{label, importance}[]` and check every
  reader of `lifeMap.values`.
* **today**: `today.tsx` pushes `/lesson-card/<day>` and `/lessons-browser` — push `/lesson/day/<day>` directly;
  confirm the task row opens `/lesson/day/<day>?page=task` and the 52 check disc toggles `dailyActionDone` in
  both the lesson and the generic register (lessons asked; the verifier saw the generic register change) — make
  the two consistent and say how.
* **day**: none beyond the review (the night fallback now reads "hard to reach", as Today II draws it).
* **logs**: show stored check-in reasons through `normalizeReasons()` from `src/components/MoodLogger.tsx` (old
  rows say `Health / wellbeing`); `src/lib/weeklyReport.ts:51` builds a cross-month range with a spaced dash —
  use `dateRange()` from `src/lib/format.ts` (frames: `Jun 30–Jul 6`).
* **settings**: `src/app/(app)/all.tsx` — the rough-days row's `?key=lonely` → `?key=loneliness`.
* **medallions-letters**: nothing imports `KKMedallion` now — remove the shim; re-check the Still-to-earn pager at
  375×667 and with 3+ unearned faces (the verifier's medium).
* **sos-flow**: re-check Reassess's direction line (the verifier's medium) and the unframed stages at 375×667.
* **lessons**: verify the full sweep's failures (if any) and the size sweep at 375×667 for every lesson page that
  enters scroll mode.
* Everyone: Tabs now go back through history (D340) — check your back paths still land where they should.
