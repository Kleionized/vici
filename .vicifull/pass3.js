export const meta = {
  name: 'vici-full-parity-pass3',
  description: 'Apply the cross-cutting sweeps the rechecks proved, fix the two regressions, then re-audit every frame',
  phases: [
    { title: 'Sweep', detail: 'one agent per sweep — the wash blur, the sRGB filters, the regressions, the leftovers' },
    { title: 'Confirm', detail: 'an independent agent measures each sweep against the frames it claims to have changed' },
  ],
}

/* Each entry is a self-contained job. They are split by FILE ownership, not by
   screen group, because these sweeps cut across groups — two agents editing the
   same file is the one thing this run cannot afford. */
const JOBS = {
  'wash-blur-shared': {
    title: 'D010 retired: blur the washes in the two shared helpers',
    files: 'src/components/ui/Waterline.tsx, src/components/auth/kit.tsx',
    body: `**F48 / D151 — the canvas blurs its radial washes and the app does not.** D010 ruled this had
"no platform equivalent"; that premise is out of date exactly as D082's was (F44/D091), because
\`react-native-svg\` 15.15.4 ships \`FeGaussianBlur\` and \`src/components/lesson/coverL1.tsx\` already
uses it. **164 of the 267 frames state a \`filter: blur()\`.**

Your two files hold the two shared \`Wash\` helpers — 8 call sites in \`Waterline.tsx\` (the splash and
waterline fields) and 3 in \`auth/kit.tsx\` (Login, Welcome Back, and the D047 boards behind them).
Give each wash the blur its own frame states: \`blur(7px)\` / \`blur(6px)\` / \`blur(5px)\` / \`blur(8px)\`
on Splash's four; \`blur(6px)\` warm, \`blur(8px)\` low, \`blur(5px)\` mark halo on the auth door.

Three implementation notes carry over from D091: pad the \`userSpaceOnUse\` filter region **3σ**, set
\`color-interpolation-filters="sRGB"\` (F43 — SVG defaults to linearRGB, CSS blur is sRGB, and the
round trip skews about +2 R, +2 G, −3 B), and grow the \`<Svg>\` to hold the spill. The prop is not in
\`FilterProps\`, so use the codebase's idiom: \`{...({ colorInterpolationFilters: 'sRGB' } as object)}\`.

Measure before and after on \`01 · Splash\`, \`02 · Login\` and \`03 · Welcome Back\` — the auth recheck
put them at 85–91 of 19,208 blocks over 1/255, worst 2.8, and said this is the **entire** remaining
difference on those frames. Capture Welcome Back on its **pushed** path as well as its URL.`,
  },
  'wash-blur-fields': {
    title: 'D010 retired: blur the washes in the per-group fields',
    files: 'src/components/onboarding/v3.tsx, tail.tsx, plan.tsx, art.tsx, src/components/day/kit.tsx, src/components/urge/index.tsx, src/components/paywall/PaywallFlow.tsx',
    body: `**F48 / D151, the other half.** Read the \`wash-blur-shared\` brief above — same rule, same three
implementation notes, different files. These are the fields each group kept its own copy of.

The \`funnel\` recheck has already measured the consequence precisely: \`First Principle\`'s bloom
**core** is 6/255 too bright on **ten frames**, and the cause is that the funnel blurs no wash
anywhere. Start there and work out.

Where a field's wash is already a real Gaussian, leave it and say so. Where it is a two-stop radial
standing in for a blurred one, give it the blur its frame states.`,
  },
  'srgb-filters': {
    title: 'F43: color-interpolation-filters="sRGB" on every FeGaussianBlur',
    files: 'src/app/(app)/today.tsx, src/app/drop.tsx, src/app/letter.tsx, src/app/score.tsx, src/components/onboarding/handover.tsx, src/components/lesson/coverL1.tsx',
    body: `**F43.** SVG filters default to \`linearRGB\`; CSS \`filter: blur()\` is \`sRGB\`. Without the
declaration the colour round-trips through the wrong space — measured on an ink shadow as **+2 R,
+2 G, −3 B**; with it, max Δ across the same shadow is 2.

Twelve files draw a Gaussian and only two declare the space. The two other sweep agents own the
onboarding fields and the shared helpers; **these six are yours.** \`coverL1.tsx\` is a special case:
it already declares it on all four filters, but two are written as a bare prop and fail the
typecheck, because \`react-native-svg\`'s \`FilterProps\` does not declare it. Use the file's own idiom
on those two: \`{...({ colorInterpolationFilters: 'sRGB' } as object)}\`.

Also clear \`src/app/drop.tsx:442\` — a CSS \`filter\` string in an \`ImageStyle\`, which does not
typecheck. Re-measure one shadow per file after the change.`,
  },
  regressions: {
    title: 'The two regressions pass 2 introduced, and one disproved verdict',
    files: 'src/components/task/TaskScene.tsx, src/components/routines/wheel.tsx, src/app/profile.tsx, src/components/lesson/reader.tsx, src/app/report-ready.tsx',
    body: `Four items the rechecks found. Each is precisely located; measure each before and after.

1. **Inset shadows paint in the wrong order (week-lessons recheck).** D109 taught
   \`TaskScene.tsx\` to draw all 232 inset shadows, but \`{insets.map(...)}\` (~line 755) paints them
   in written order and **CSS paints a shadow list first-on-top**. The one layer in either corpus
   with two insets — \`inset 0 0 0 6px #E9D2A4, inset 0 0 0 7.5px #E2BA78\` at
   \`src/content/lessonPlates.ts:13227\`, lesson plate 78's ring — draws the darker outer inset over
   the pale one that belongs above it. **Δ44/255 across the whole ring band, 1,705 body pixels.**
   The same agent wrote this exact rule into D112 for the *outer* list and did not carry it across.
2. **The wheel's leading pad goes stale (paywall recheck).** \`wheel.tsx\` — \`settle()\`'s early
   return (\`if (target === landed && snapTo(target) === y) return;\`) skips \`park()\`, the only place
   \`lead\` is resynced. After a user scroll every row in that column paints half a point high when
   the new target's index parity differs from the last parked one. Measured live: AM at 336.5
   instead of 337.
3. **D121 is disproved (settings recheck).** It closed \`Edit Profile\`'s \`Started VICI\` row as "the
   two rows cannot both hold for any single account". \`profile.tsx:59\` derives the week as
   \`floor((now − createdAt)/7d)+1\`, so **any date 35–41 days after 14 Mar 2026 satisfies both**.
   Withdraw D121 with a new numbered entry, and seed the row rather than excusing it — pin the page
   clock the way F47 did for the Vow's date line.
4. **A pass-1 "known equivalence" that is a transcription miss (week-lessons recheck).** The chosen
   pick row's 0.5pt dot feather, **75 boards**, Δ106 on the rim, at
   \`src/components/lesson/reader.tsx:238\`. Never actually decided by anyone. It is not a platform
   limit. Also: \`report-ready.tsx:145-154\`'s contact shadow is still the radial model F44/D091
   retired, and the correction is already written in the same group at \`urge-log.tsx:344-368\`.`,
  },
  'campaign-centring': {
    title: 'The Campaign Maps’ tile text sits one device pixel low',
    files: 'src/components/onboarding/handover.tsx (CampaignWeekRow only)',
    body: `**F47.** The four week-tile text stacks on \`Campaign Map\` I–III render **exactly 1 device pixel
(0.5pt) low**: 432 / 418 / 327 of 19,502 blocks over 4/255, and every block on those frames bar
0/2/4 is inside those four rects.

The handover recheck ruled out leading, font, weight, size and box position by DOM probe (both
sides report top 221.5, height 15, 12.5px, \`line-height: normal\`, weight 600) and by row-by-row ink
profile (ink-mass ratio 1.0000 — the app's raster is the design's, translated one row). **The cause
is the centring mechanism**: the canvas uses \`top: 50%\` + \`translateY(-50%)\`, \`CampaignWeekRow\` uses
flex \`justifyContent: 'center'\`. Patching the *design frame* to flex centring drops its glyphs by
exactly the same 1 device pixel at an unchanged box.

So transcribe the canvas's own mechanism. Invent no leading. Confirm the three frames drop to 0
blocks and that nothing else on them moves.`,
  },
  housekeeping: {
    title: 'Dead code, stale comments, spec numbering, generator provenance',
    files: 'src/components/onboarding/v3.tsx, src/components/ChallengeSheet.tsx, src/components/lesson/reader.tsx (comments), src/app/lesson/day/[day].tsx (comments), specs/*, scripts/vicifull/gen-reader-art.mjs',
    body: `Everything in section 4 of \`.vicifull/ORCHESTRATOR-TODO.md\`. Read it there; in short:

* **22 dead exported screens (~900 lines)** in \`v3.tsx\` for boards this drop withdrew, and
  \`src/components/ChallengeSheet.tsx\` (115 lines). Confirm nothing routes to them, then delete.
* Head comments in \`src/components/lesson/reader.tsx\` and \`src/app/lesson/day/[day].tsx\` still say
  the bundle authors **1,398** pages. This drop authors **1,858**.
* **Renumber \`specs/\` to the canvas's own badges** (F10). \`.vicifull/FLOW.txt\` is the authority —
  it carries every frame's badge. \`specs/03-welcome-back.md\` is badge **02B**, and \`specs/03-name.md\`
  already holds badge 03. Rename the files and fix the cross-references.
* **Repoint \`scripts/vicifull/gen-reader-art.mjs\`** at \`Lesson 1 Surviving the Night\` (F39/D085).
  Its output is byte-identical today — verified by MD5 on all four frames of both authorings — so
  this is provenance, not a content change. Re-run and confirm the file does not move.
* Delete \`scripts/vicifull/gen-dry.mjs\` and \`.vicifull/wtmp/\`.

Do not touch anything outside the files listed. \`v3.tsx\` is also being swept for wash blur by
another agent — coordinate by keeping your edit to whole-function deletions.`,
  },
}

const COMMON = `You are working in /Users/admin/Documents/tideline on the VICI parity run, pass 3 — the last one.

Read first, in full: \`.vicifull/BRIEF.md\`, \`.vicifull/FINDINGS.md\` (F1–F49), and
\`.vicifull/ORCHESTRATOR-TODO.md\`. \`DECISIONS.md\` is at D001–D160-odd; check the highest number in
the file before appending, because other agents are appending at the same time.

Two passes are already done: every group was implemented, adversarially verified, fixed, and
re-measured by a fourth agent. What is left is cross-cutting — sweeps no single screen group could
finish, plus what the rechecks caught. **Your job is one of those sweeps, and only that.**

Tooling:
  node scripts/vicifull/body.mjs .vicifull/final/Email-Login/<Frame>.html
  node scripts/vicifull/shot.mjs design Email-Login <F>.html <out.png> --sig=X
  node scripts/vicifull/shot.mjs app "/route" <out.png> --sig=Y --wait=1600 \\
       [--seed | --initseed=<f.js>] [--do='…' | --script=f.js] [--fast] [--settle=<ms>]
  node scripts/vicifull/sigdiff.mjs X Y
  node scripts/vicifull/audit.mjs --group=<key>
  node scripts/vicifull/stopcheck.mjs
\`.vicifull/recipes/<group>.json\` says how to reach any frame. Do NOT use the Browser-pane MCP tools.
Prefix your sigs with \`s-\`.

The rules this run earned, all of which apply to you:

* **A signature diff is not proof.** Six finding classes were invisible to it. Read the PNGs.
* **State what your pixel comparison excludes** (F35), and exclude as little as possible. Note F49:
  the design frame does **not** paint a full status bar — only a clock strip at css y 23.5–36.5,
  x 47–360. Everything outside that strip is real content on both sides and should be compared.
* **Seed the state the frame draws** (F28); pin the page clock where a date or a day number is
  involved (F47). A frame excused as "sample data" is a frame nobody has checked.
* **The design frame can scroll** (F47). Scroll both sides to the same offset.
* **NEVER run \`git reset\`, \`git checkout -- <path>\`, \`git stash\` or \`git clean\`.** One agent did,
  and the whole run's uncommitted work was lost and had to be recovered (F46). Seventeen agents
  share this working tree.`

const SWEEP = (key) => `${COMMON}

## Your sweep: ${JOBS[key].title}

**Files you own for this sweep: ${JOBS[key].files}**
Stay inside them. If you must touch another, make the smallest possible change and say so loudly.

${JOBS[key].body}

Report: what you changed, the before/after measurement for each frame you claim to have improved
(with the instrument and its exclusions named), anything you decided was not a defect and why, and
any file you touched outside your list.`

const CONFIRM = (key, report) => `${COMMON}

## Confirm the sweep: ${JOBS[key].title}

The sweep agent's report:

<report>
${String(report ?? '(no report returned)').slice(0, 12000)}
</report>

Do not trust it. Measure every frame it claims to have improved, and measure a sample of frames it
did **not** claim, looking for what the sweep broke — that is how the last two passes each found a
regression. State your instrument and its exclusions.

Report each claim as confirmed or not, with your own numbers, plus any regression you find.`

const SCHEMA = {
  type: 'object',
  properties: {
    sweep: { type: 'string' },
    confirmed: { type: 'number' },
    notConfirmed: { type: 'array', items: { type: 'string' } },
    regressions: { type: 'array', items: { type: 'string' } },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          frame: { type: 'string' },
          element: { type: 'string' },
          property: { type: 'string' },
          design: { type: 'string' },
          app: { type: 'string' },
          confidence: { type: 'string', enum: ['certain', 'likely', 'unsure'] },
          note: { type: 'string' },
        },
        required: ['frame', 'element', 'property', 'design', 'app', 'confidence'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['sweep', 'findings', 'summary'],
}

phase('Sweep')

const results = await pipeline(
  args,
  (key) => agent(SWEEP(key), { label: `sweep:${key}`, phase: 'Sweep', effort: 'high' }),
  (report, key) => agent(CONFIRM(key, report), { label: `confirm:${key}`, phase: 'Confirm', schema: SCHEMA, effort: 'high' })
    .then((v) => ({ sweep: key, sweepReport: report, confirm: v })),
)

const flat = results.filter(Boolean)
log(`${flat.length}/${args.length} sweeps closed`)
return flat
