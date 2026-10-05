export const meta = {
  name: 'overhaul-phase1',
  description: 'Rebuild every screen group on the mono kit, verify each against its frames, fix verified issues',
  phases: [
    { title: 'Implement', detail: 'one agent per group, single-owner files' },
    { title: 'Verify', detail: 'independent adversarial check of every frame + small screens + controls' },
    { title: 'Fix', detail: 'the group addresses verified issues' },
  ],
}

// Largest first so the long chains start early.
const GROUPS = [
  { key: 'lessons', doc: 'lessons.md + lesson-scroll.md' },
  { key: 'auth-funnel', doc: 'auth-funnel.md' },
  { key: 'slip', doc: 'slip.md' },
  { key: 'sos-boards', doc: 'sos-boards.md' },
  { key: 'medallions-letters', doc: 'medallions-letters.md' },
  { key: 'logs', doc: 'logs.md' },
  { key: 'sos-flow', doc: 'sos-flow.md' },
  { key: 'tail', doc: 'tail.md' },
  { key: 'library', doc: 'library.md' },
  { key: 'day', doc: 'today-day.md (Morning/Night)' },
  { key: 'settings', doc: 'settings.md' },
  { key: 'paywall-reminders', doc: 'paywall-reminders.md' },
  { key: 'today', doc: 'today-day.md (Today/Score)' },
].filter((g) => !args?.only || args.only.includes(g.key))

const REPORT = {
  type: 'object',
  properties: {
    group: { type: 'string' },
    frames: { type: 'array', items: { type: 'object', properties: {
      frame: { type: 'string' },
      status: { type: 'string', enum: ['matched', 'residual', 'not-done'] },
      pxMismatchPct: { type: 'number' },
      residual: { type: 'string', description: 'every remaining pxdiff region / sigdiff row and why it cannot or should not be fixed' },
      smallScreens: { type: 'string', description: '375x667 and 430x932 result' },
    }, required: ['frame', 'status', 'pxMismatchPct', 'residual', 'smallScreens'] } },
    unframedScreens: { type: 'array', items: { type: 'object', properties: {
      route: { type: 'string' }, done: { type: 'boolean' }, note: { type: 'string' },
    }, required: ['route', 'done', 'note'] } },
    filesChanged: { type: 'array', items: { type: 'string' } },
    filesDeleted: { type: 'array', items: { type: 'string' } },
    functionalityChecked: { type: 'array', items: { type: 'string' }, description: 'controls/flows exercised in the running app and the result' },
    decisions: { type: 'array', items: { type: 'string' } },
    kitProblems: { type: 'array', items: { type: 'string' }, description: 'kit components wrong against a frame, with numbers' },
    requestsForOrchestrator: { type: 'array', items: { type: 'string' } },
    lint: { type: 'string', description: 'lint-mono.mjs --files <your files> summary' },
    typecheckClean: { type: 'boolean' },
  },
  required: ['group', 'frames', 'unframedScreens', 'filesChanged', 'filesDeleted', 'functionalityChecked', 'decisions', 'kitProblems', 'requestsForOrchestrator', 'lint', 'typecheckClean'],
}

const VERDICT = {
  type: 'object',
  properties: {
    group: { type: 'string' },
    verdict: { type: 'string', enum: ['pass', 'fail'] },
    framesChecked: { type: 'number' },
    issues: { type: 'array', items: { type: 'object', properties: {
      severity: { type: 'string', enum: ['high', 'medium', 'low'] },
      frameOrRoute: { type: 'string' },
      problem: { type: 'string' },
      evidence: { type: 'string' },
    }, required: ['severity', 'frameOrRoute', 'problem', 'evidence'] } },
  },
  required: ['group', 'verdict', 'framesChecked', 'issues'],
}

const COMMON = `You are a Phase 1 agent on the VICI "Vici Overhaul" UI rebuild (repo /Users/admin/Documents/Vici; Expo SDK 56, RN 0.85, expo-router, react-native-svg; RN-web on :8096 is the verification build, the design frames are on :8097).
Read first: .overhaul/BRIEF.md (rules + tools + "Run state"), .overhaul/PHASE1.md (the contract — your group's section lists your frames and the ONLY files you may edit), your group's analysis doc in .overhaul/understand/, .overhaul/understand/CRITIC.md §3–§8, .overhaul/decisions/*.md (orchestrator + the kit's), and src/components/mono/index.ts + the kit files you use.
Working rules: ~6 agents edit the same app concurrently and Metro hot-reloads everything. Keep your files compiling at every save (small steps). If a capture shows a red error box or a blank page from a file that is not yours, wait 60 s and retry; never edit another group's file to "fix" it. Run captures one at a time. Read every strip PNG you produce — a signature can pass with art missing. Delete scratch PNGs you no longer need (disk is limited).`

const implement = (g) => agent(`${COMMON}

YOUR GROUP: "${g.key}" (doc: ${g.doc}). Do everything PHASE1.md §"The job, per group" says, for every frame and every unframed screen of your group. Work frame by frame: build, capture, diff, look, fix — until each frame is matched or its residual is explained. Record every recipe in .overhaul/recipes/${g.key}.json as you go. Exercise every control you touched in the running app (tap it, confirm it navigates/saves as before). Finish with lint-mono on your files and npx tsc --noEmit -p .
Return the structured report — one row per frame, honest about anything not done.`, { label: `impl:${g.key}`, phase: 'Implement', schema: REPORT })

const verify = (g, rep) => agent(`${COMMON}

YOU ARE THE INDEPENDENT VERIFIER for group "${g.key}". Another agent implemented it; its report is below. Assume every claim is false until you have reproduced it. Do NOT edit any source file (you may write scratch scripts/PNGs under .overhaul/verify/${g.key}/).
1. For EVERY frame of the group (PHASE1.md): replay its recipe from .overhaul/recipes/${g.key}.json (or drive there yourself), capture, sigdiff + pxdiff against the design frame, Read the strip. Compare every visible detail: copy and line breaks, type (family/size/weight/tracking/line height/colour), positions, sizes, radii, rings, colours, icons/art present and correct, states (selected/unselected/empty/done…). Check below the fold with --scroll where the screen scrolls. Report each unexplained mismatch, and each residual whose explanation is wrong.
2. Small screens: capture each distinct screen at --w=375 --h=667 and --w=430 --h=932 (Read them): clipping, overlap with bottom controls, text running off, awkward wraps, art not reaching the edges at 430.
3. Controls: tap through the group's flows in the running app (use .overhaul/drive.js helpers via shot.mjs --do / --script): every button/option/back/close does what the code did before (git diff refs/snapshots/pre-overhaul-full -- <file> shows the old behaviour). Report anything broken, unreachable or newly missing — including loading/empty/error states.
4. Unframed screens of the group: open each; does it use the new system consistently (ground+noise, Lato, kit components, no old palette)? Run node scripts/overhaul/lint-mono.mjs --files on the group's files.
5. Files: git diff --stat against the snapshot for files outside the group's ownership (a violation = high).
Verdict "fail" if any high or medium issue exists. Be specific: frame, property, numbers, evidence.

IMPLEMENTER'S REPORT:
${JSON.stringify(rep).slice(0, 40000)}`, { label: `verify:${g.key}`, phase: 'Verify', schema: VERDICT })

const fix = (g, rep, ver) => agent(`${COMMON}

YOUR GROUP: "${g.key}" (doc: ${g.doc}). An earlier agent implemented this group; an independent verifier then found the issues below. Re-check each against the frame/old behaviour first (if a finding is wrong, say why with evidence), then fix every real high and medium issue (and low ones that are cheap). Re-capture and re-diff every frame you touch, Read the strips, re-run the small-screen captures you affect. Return the complete structured report (all frames, not a delta).

PREVIOUS REPORT:
${JSON.stringify(rep).slice(0, 25000)}

VERIFIER'S ISSUES:
${JSON.stringify(ver.issues).slice(0, 25000)}`, { label: `fix:${g.key}`, phase: 'Fix', schema: REPORT })

const results = await pipeline(
  GROUPS,
  (g) => implement(g),
  async (rep, g) => (rep ? { rep, ver: await verify(g, rep) } : null),
  async (x, g) => {
    if (!x) return { group: g.key, failed: 'implement returned nothing' }
    if (!x.ver || x.ver.verdict === 'pass') return { group: g.key, final: x.rep, ver: x.ver, fixed: false }
    const f = await fix(g, x.rep, x.ver)
    return { group: g.key, final: f ?? x.rep, ver: x.ver, fixed: !!f }
  },
)

return results.map((r) => r && r.final ? ({
  group: r.group,
  fixed: r.fixed,
  verdict: r.ver?.verdict,
  verifierIssues: (r.ver?.issues ?? []).filter((i) => i.severity !== 'low').map((i) => `${i.severity} ${i.frameOrRoute}: ${i.problem}`),
  frames: r.final.frames.map((f) => `${f.frame}: ${f.status} ${f.pxMismatchPct}%${f.status !== 'matched' ? ' — ' + f.residual.slice(0, 200) : ''}`),
  unframed: r.final.unframedScreens.map((u) => `${u.route}: ${u.done ? 'done' : 'NOT DONE'} ${u.note.slice(0, 120)}`),
  kitProblems: r.final.kitProblems,
  requests: r.final.requestsForOrchestrator,
  decisions: r.final.decisions,
  lint: r.final.lint,
  tsc: r.final.typecheckClean,
}) : r)
