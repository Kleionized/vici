export const meta = {
  name: 'vici-full-parity-pass2',
  description: 'Close every pass-1 verify finding and the cross-cutting sweeps, then re-measure each group',
  phases: [
    { title: 'Fix', detail: 'one agent per group: its own verifier’s findings plus its share of the cross-cutting sweeps' },
    { title: 'Recheck', detail: 'an independent agent re-measures the group and reports what still differs' },
  ],
}

/* What each group owns of the cross-cutting work. The sweeps are listed in
   .overhaul/FINDINGS.md; this table says who does which, so nothing is done
   twice and nothing falls between two groups. */
const SWEEPS = {
  auth: ['F20 — useId() ids in src/components/auth/kit.tsx and src/components/ui/Waterline.tsx (SplashScene renders on BOTH / and /(auth)/splash, so it is exposed). Re-verify Welcome Back and the D047 boards on their PUSHED path, not at their URL — that is where the defect shows.'],
  funnel: [
    'F23 — src/components/onboarding/v3.tsx:283, the corner bloom fade stop. One token; it is 6–8/255 on 22 of your 23 frames.',
    'F13 — DECIDED: draw 03 · Name’s Back row, and exempt the auth guard while onboarding is incomplete so Back lands on 02 · Login. Supersede D016 with a new entry.',
    'F22 — src/components/onboarding/art.tsx’s local Noise (13 uses) smears the grain; replace with src/components/ui/Grain.tsx and re-check every board it touches by eye.',
    'F14 — delete the 22 dead exported screens in v3.tsx (~900 lines) for boards this drop withdrew.',
  ],
  plan: ['F26 — your 8 blurred solids on 28/29/30 violate D082 (25–31% of each shadow band out by >6/255, peaking at 29). Draw each at the box grown by 2σ with the plateau kept.'],
  tail: ['F23 — src/components/onboarding/tail.tsx:61, same one-token fade stop, 6 of your 8 frames.', 'F24/F26 — the ground shadows on A Clean Day and What You Want Back, same D082 rule.'],
  handover: ['F22 — all five defects your verifier listed: r= on letSeal/medFace/vowSun, insetOf() rim lights on the seal and the coin (letter.tsx already shows both), and the Campaign Maps’ grain.'],
  paywall: [
    'F25 — HIGH: src/components/paywall/OfferingPaywall.tsx still draws the WITHDRAWN Free Trial Paywall and it is what a build with a RevenueCat key presents. Rebuild it on frame #48 or route both paths through PaywallFlow. Check RevenueCatPaywall.tsx too.',
    'F12/D065 — src/components/routines/wheel.tsx:112 uses onMomentumScrollEnd, which react-native-web never emits.',
  ],
  today: ['F29 — decide and record whether Today Home II’s composition is unreachable because today.tsx’s register selection is wrong, or because the frame is a composite mock-up. State the evidence either way.', 'F23 — check src/app/score.tsx:366 and src/app/(app)/today.tsx:370 against their frames; some of the 19 mismatched fade stops are genuine two-colour gradients and some are not.'],
  day: ['F28 — you already have the technique: seed the state each frame is drawn for and re-measure, rather than parking a row as sample data.'],
  weeks: ['F26 — you derived D082; check your ten blurred solids actually follow it.'],
  sos: ['F30 is FIXED already (convex/events.ts now declares durationSeconds) — do not redo it. Instead check every OTHER writer you added against its mutation, and every .catch(() => {}) around a backend write.', 'F26 — the warm floor pools on the response boards.', 'F14 — src/components/ChallengeSheet.tsx is dead (115 lines).'],
  medallions: ['F31 — the grain on all five Breakwater and all five Detail boards; use src/components/ui/Grain.tsx.', 'F23 — src/components/keepsakes/Medallion.tsx has three mismatched fade stops; check each against its frame.'],
  logs: [
    'F17 — DECIDED: move the Log Chooser to its own route outside (app) so it draws no tab bar and its pill lands at the canvas’s 744.',
    'F36 — the eight Lapse/Urge-Log frames spend both safe-area insets; D026 already rules this a defect and report-ready.tsx in your own group does it correctly.',
    'F12/D065 — src/app/urge-overview.tsx:87 and src/app/weekly-report.tsx:131.',
  ],
  settings: [
    'F33 — DECIDED: Today’s avatar (src/app/(app)/today.tsx:128) opens /(app)/settings, not /profile. That is the canvas’s own hierarchy and it restores the tap-path to six of your frames. Coordinate: today.tsx belongs to GROUP today, so make that ONE line change and say so.',
    'F34 — Your Vow Page’s sun: the gradient is cy="82.48" where the disc is at cy=51, so the highlight is upside down.',
    'F16 — SignaturePad / SignatureMark and UserSettings.signature are now dead.',
  ],
  slip: ['F27 — write per-frame recipes for your nineteen Slip Feel / Slip Trigger cards; you captured them individually but recorded only the shell.', 'F26 — check your blurred solids against D082.'],
  letters: ['F23 — src/app/drop.tsx:234-235 are probably a genuine two-colour gradient; confirm against the frame.'],
  'lesson-scrolls': ['F27 — write recipes for all 26 Lesson Scroll frames.', 'F3 — you found and fixed the generator’s classifier; confirm the regenerated lessonReader.ts still holds all 207 restored runs after any further change.'],
  'week-lessons': ['F1 — curriculum84.ts and gen-curriculum.mjs: the Task DNN Intro frame lost its DAY N · TODAY’S TASK eyebrow and gained a 340×200 scene, so the generator’s field mapping no longer fits. Teach it the new shape, then regenerate. Do not hand-edit the output.', 'F2 — the lesson cover scene’s sun and ground shadow.', 'F26 — the cover scene’s shadow is a blurred solid; D082 applies.'],
}

const COMMON = `You are working in /Users/admin/Documents/tideline on the VICI parity run, pass 2.

Read these first, in full:
  1. .overhaul/BRIEF.md       — the run's rules, tooling, translation rules and traps
  2. .overhaul/FINDINGS.md    — every cross-cutting finding the orchestrator holds, F1–F36
  3. .overhaul/GROUPS.md      — your group's frame list
  4. DECISIONS.md             — D001 onwards, including this run's D046+

Pass 1 implemented every group and then had an independent agent try to break it. Your group's
verifier wrote .overhaul/verify/<group>.json — the findings are structured, each with the frame,
the element, the property, the design value, the app value and a confidence. Read it.

Tooling reminders that matter this pass:
  node scripts/overhaul/body.mjs .overhaul/final/Email-Login/<Frame>.html      — the frame, transcribed
  node scripts/overhaul/shot.mjs design Email-Login <F>.html <out.png> --sig=X
  node scripts/overhaul/shot.mjs app "/route" <out.png> --sig=Y --wait=1600 \\
       [--seed | --initseed=<file.js>] [--do='await tap("…")' | --script=f.js]
  node scripts/overhaul/sigdiff.mjs X Y
  node scripts/overhaul/stopcheck.mjs                                          — every mismatched SVG fade stop
  node scripts/overhaul/copy-sweep.mjs Email-Login --missing                    — every canvas string vs src/

Do NOT use the Browser-pane MCP tools. Prefix your sig names with f-<group>-.

Three rules this pass adds, all earned in pass 1:

* **A signature diff is not proof.** F20, F22, F23, F26, F31 and F34 were all invisible to it —
  a lost paint server, a wrong gradient focus, a smeared grain, a mis-modelled blur. Read the PNGs.
* **State what your pixel comparison excludes** (F35). An instrument that skips gradient regions
  reported "0 flat pixels" on 22 frames that were measurably wrong. Never call a frame clean using
  a tool that excludes the region a finding is about.
* **Seed the state the frame draws** (F28) before calling any row "sample data". Most are seedable,
  and a frame excused as data is a frame nobody has checked.`

const FIX = (key) => `${COMMON}

## Your assignment: close out GROUP "${key}"

1. **Read \`.overhaul/verify/${key}.json\`** and fix every finding in it. Work them in confidence
   order — \`certain\` first, then \`likely\`, then \`unsure\`. For an \`unsure\` finding, decide it:
   measure, and either fix it or say why it is not a defect. Do not leave one unaddressed.

2. **Your share of the cross-cutting sweeps:**
${(SWEEPS[key] ?? ['(none assigned — but still check F23, F26 and F31 against your own group’s art)']).map((s) => '   - ' + s).join('\n')}

3. **Recipes (F27).** Every frame in your group needs an entry in \`.overhaul/recipes/${key}.json\`
   that reproduces it: route, seed, the exact drive string or script, and \`unreachable\` with a
   reason where that is the truth. The second audit runs off this file; a frame with no recipe is
   reported unaudited, not skipped.

4. **Re-measure every frame you touched**, numerically and by eye, and confirm the finding is
   actually closed rather than moved.

Where a finding names a file another group owns, make the smallest correct change and say so
prominently. Where the canvas contradicts itself, name the contradiction, pick the reading the
evidence supports, and add a numbered DECISIONS entry — append only, and check the highest number
in the file first, because other agents are appending at the same time.

Return: one line per finding saying what you did (fixed / not a defect, with the measurement), a
list of anything still open with the reason, and a list of files you touched outside your group.`

const RECHECK = (key, report) => `${COMMON}

## Your assignment: re-measure GROUP "${key}" after its fix pass

The fix agent's report:

<report>
${String(report ?? '(no report returned)').slice(0, 14000)}
</report>

Its verifier's original findings are in \`.overhaul/verify/${key}.json\`. For every one of them,
establish independently whether it is now actually closed — do not take the report's word. Then
look for what the fix introduced: a change that closes one finding and breaks a neighbour is the
failure mode of a fix pass.

Capture every frame in the group from \`.overhaul/recipes/${key}.json\`, diff numerically AND by
pixel, and read the PNGs. Use a sig prefix of r-${key}-.

Report every remaining difference with frame, element, property, design value, app value and
confidence. If a pass-1 finding is still open, say so plainly and say what was tried.`

const FINDINGS = {
  type: 'object',
  properties: {
    group: { type: 'string' },
    closed: { type: 'number', description: 'how many pass-1 findings are now genuinely closed' },
    stillOpen: { type: 'array', items: { type: 'string' } },
    regressions: { type: 'array', items: { type: 'string' }, description: 'anything the fix pass broke' },
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
  required: ['group', 'findings', 'summary'],
}

phase('Fix')

const results = await pipeline(
  args,
  (key) => agent(FIX(key), { label: `fix:${key}`, phase: 'Fix', effort: 'high' }),
  (report, key) => agent(RECHECK(key, report), { label: `recheck:${key}`, phase: 'Recheck', schema: FINDINGS, effort: 'high' })
    .then((v) => ({ group: key, fixReport: report, recheck: v })),
)

const flat = results.filter(Boolean)
log(`${flat.length}/${args.length} groups closed out`)
return flat
