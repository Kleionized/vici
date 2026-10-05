export const meta = {
  name: 'overhaul-phase2',
  description: 'Review every screen against the audit, lesson sweep and phone-size sweeps; fix and re-verify',
  phases: [
    { title: 'Curriculum', detail: 'D339 task sentences + legacy field cleanup, before the screens that show them are reviewed' },
    { title: 'Review', detail: 'one agent per group: look at every strip and size PNG, fix' },
    { title: 'Verify', detail: 'fresh verifier per group' },
    { title: 'Fix', detail: 'second fix pass where the verifier still finds issues' },
  ],
}

const GROUPS = [
  'lessons', 'auth-funnel', 'slip', 'sos-boards', 'medallions-letters', 'logs', 'sos-flow', 'tail', 'library', 'settings', 'paywall-reminders', 'day', 'today',
].filter((g) => !args?.only || args.only.includes(g))

const REPORT = {
  type: 'object',
  properties: {
    group: { type: 'string' },
    frames: { type: 'array', items: { type: 'object', properties: {
      frame: { type: 'string' },
      px: { type: 'number', description: 'final pixel mismatch % at 393x852' },
      residual: { type: 'string', description: 'every remaining region and its reason, or "none"' },
      sizes: { type: 'string', description: 'verdict at 375x667 / 390x844 / 430x932 after looking at the PNGs' },
      changed: { type: 'string', description: 'what was fixed on this frame in this pass, or "nothing"' },
    }, required: ['frame', 'px', 'residual', 'sizes', 'changed'] } },
    unframed: { type: 'array', items: { type: 'string' } },
    carryOver: { type: 'array', items: { type: 'string' }, description: 'each PHASE2 carry-over item and its outcome' },
    filesChanged: { type: 'array', items: { type: 'string' } },
    open: { type: 'array', items: { type: 'string' } },
    requestsForOrchestrator: { type: 'array', items: { type: 'string' } },
    typecheckClean: { type: 'boolean' },
  },
  required: ['group', 'frames', 'unframed', 'carryOver', 'filesChanged', 'open', 'requestsForOrchestrator', 'typecheckClean'],
}

const VERDICT = {
  type: 'object',
  properties: {
    group: { type: 'string' },
    verdict: { type: 'string', enum: ['pass', 'fail'] },
    framesLookedAt: { type: 'number' },
    sizePngsLookedAt: { type: 'number' },
    issues: { type: 'array', items: { type: 'object', properties: {
      severity: { type: 'string', enum: ['high', 'medium', 'low'] },
      where: { type: 'string' },
      problem: { type: 'string' },
      evidence: { type: 'string' },
    }, required: ['severity', 'where', 'problem', 'evidence'] } },
  },
  required: ['group', 'verdict', 'framesLookedAt', 'sizePngsLookedAt', 'issues'],
}

const COMMON = `You are a Phase 2 agent on the VICI "Vici Overhaul" UI rebuild (repo /Users/admin/Documents/Vici; Expo SDK 56, RN 0.85, expo-router; RN-web on :8096 is the verification build, design frames on :8097).
Read first: .overhaul/BRIEF.md, .overhaul/PHASE2.md (this phase's contract and the carry-over items), .overhaul/PHASE1.md (file ownership — unchanged), your group's analysis doc in .overhaul/understand/, the decisions in .overhaul/decisions/ (orchestrator D320–D343 rule over group decisions), and your group's rows in .overhaul/audit/report.json, .overhaul/size-sweep/{375x667,390x844,430x932}/findings.json (and the per-frame PNGs next to them)${''}.
Working rules: several agents edit concurrently and Metro hot-reloads everything; keep your files compiling; if a capture shows an error that is not yours, wait 60 s and retry. Captures one at a time. Read every PNG you judge — numbers alone are not proof. Edit only your group's files.`

const review = (g) => agent(`${COMMON}

YOUR GROUP: "${g}". Do PHASE2.md §"What to do" for every frame and every unframed screen of your group, and your carry-over items. You must actually Read: every .overhaul/audit/strips/<Frame>.strip.png of your group, and the 375x667, 390x844 and 430x932 PNGs of every frame of your group (also the .end.png scrolled captures where they exist).${g === 'lessons' ? ' For lessons also read .overhaul/lesson-sweep/report.md and .overhaul/lesson-sweep-375x667/report.md (+ PNGs of every CHECK page) — at 375x667 a page in scroll mode is expected to run under the fade/pill at scroll 0; confirm it scrolls clear.' : ''} Fix every real defect, re-run node scripts/overhaul/audit-fast.mjs --group=${g} and node scripts/overhaul/size-sweep.mjs --size=<each> --group=${g} --scroll after your fixes, look again. Return the structured report.`, { label: `review:${g}`, phase: 'Review', schema: REPORT })

const verify = (g, rep) => agent(`${COMMON}

YOU ARE THE INDEPENDENT VERIFIER for group "${g}" in Phase 2. Do NOT edit source files. Re-run node scripts/overhaul/audit-fast.mjs --group=${g} --out=.overhaul/verify2/${g} and the three size sweeps for the group (--group=${g} --scroll; they write to .overhaul/size-sweep/<size>/ — that is fine). Then Read every strip and every size PNG of the group yourself and judge them against the design frames: copy, line breaks, type, spacing, colours, art, states; at the other sizes clipping, overlap with controls, overflow, awkward wraps, inconsistent spacing, art not reaching the edges. Tap through the group's main flows in the running app (shot.mjs --do / --script with .overhaul/drive.js helpers) and confirm every control works. Check the reviewer's claimed residuals — a residual is acceptable only if it is canvas sample data the app cannot produce, a recorded decision, or the platform caret; anything else is a defect.
Verdict "fail" if any high or medium issue exists.

REVIEWER'S REPORT:
${JSON.stringify(rep).slice(0, 40000)}`, { label: `verify:${g}`, phase: 'Verify', schema: VERDICT })

const fix = (g, rep, ver) => agent(`${COMMON}

YOUR GROUP: "${g}". A verifier found the issues below after this phase's review pass. Check each against the frame (say why with evidence if it is wrong), fix every real high/medium (and cheap low) issue, re-run the group's audit-fast and the three size sweeps, Read the results. Return the complete report.

PREVIOUS REPORT:
${JSON.stringify(rep).slice(0, 25000)}

VERIFIER'S ISSUES:
${JSON.stringify(ver.issues).slice(0, 25000)}`, { label: `fix:${g}`, phase: 'Fix', schema: REPORT })

phase('Curriculum')
const cur = await agent(`${COMMON}

YOUR TASK: the "curriculum" carry-over item in PHASE2.md (D339 in .overhaul/decisions/orchestrator.md). You may edit only scripts/overhaul/gen-curriculum.mjs, src/content/curriculum84.ts (by regenerating it), src/lib/curriculum.ts (the comment), seeds/recipes under .overhaul/. Keep every export the app imports (grep consumers; npx tsc --noEmit must stay clean). Verify exactly as PHASE2.md says (day 1 frames still 0 % — run node scripts/overhaul/audit-fast.mjs --frame="Today Home Task", --frame="Night Action Reminder", --frame="Morning Task Check"; day 58 at 393x852 and 375x667 on Today II, Night Action, Morning Task Check — build seeds for day 58 by copying the frames' seeds and changing the day). Report what the today/day screens need if a long sentence does not fit (do not edit their files).`, { label: 'curriculum', phase: 'Curriculum', schema: REPORT })
log(`curriculum: ${cur ? cur.carryOver.join(' | ').slice(0, 400) : 'no result'}`)

const results = await pipeline(
  GROUPS,
  (g) => review(g),
  async (rep, g) => (rep ? { rep, ver: await verify(g, rep) } : null),
  async (x, g) => {
    if (!x) return { group: g, failed: 'review returned nothing' }
    if (!x.ver || x.ver.verdict === 'pass') return { group: g, final: x.rep, ver: x.ver, fixed: false }
    const f = await fix(g, x.rep, x.ver)
    return { group: g, final: f ?? x.rep, ver: x.ver, fixed: !!f }
  },
)

return {
  curriculum: cur && { carryOver: cur.carryOver, open: cur.open, requests: cur.requestsForOrchestrator },
  groups: results.map((r) => r && r.final ? ({
    group: r.group, fixed: r.fixed, verdict: r.ver?.verdict,
    verifierIssues: (r.ver?.issues ?? []).filter((i) => i.severity !== 'low').map((i) => `${i.severity} ${i.where}: ${i.problem}`),
    frames: r.final.frames.filter((f) => f.px >= 0.05 || f.residual !== 'none' || !/^ok|fine|clean/i.test(f.sizes)).map((f) => `${f.frame}: ${f.px}% — ${f.residual.slice(0, 160)} | sizes: ${f.sizes.slice(0, 120)}`),
    carryOver: r.final.carryOver, open: r.final.open, requests: r.final.requestsForOrchestrator, tsc: r.final.typecheckClean,
  }) : r),
}
