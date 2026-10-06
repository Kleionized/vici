export const meta = {
  name: 'overhaul-phase3',
  description: 'Second complete review: fresh read-only reviewers per area, then fixes for confirmed issues (2 agents at a time)',
  phases: [
    { title: 'Review', detail: 'independent second review of every screen, state and size' },
    { title: 'Fix', detail: 'only where the review confirms a real defect' },
  ],
}

// Related groups share one reviewer, so eight reviewers cover all thirteen groups.
const AREAS = [
  { key: 'onboarding', groups: ['auth-funnel', 'tail'] },
  { key: 'today-day', groups: ['today', 'day'] },
  { key: 'library-lessons', groups: ['library', 'lessons'] },
  { key: 'sos', groups: ['sos-flow', 'sos-boards'] },
  { key: 'slip', groups: ['slip'] },
  { key: 'logs', groups: ['logs'] },
  { key: 'medallions-letters', groups: ['medallions-letters'] },
  { key: 'settings-paywall', groups: ['settings', 'paywall-reminders'] },
].filter((a) => !args?.only || args.only.includes(a.key))

const FINDINGS = {
  type: 'object',
  properties: {
    area: { type: 'string' },
    framesReviewed: { type: 'number' },
    sizePngsReviewed: { type: 'number' },
    flowsExercised: { type: 'array', items: { type: 'string' } },
    findings: { type: 'array', items: { type: 'object', properties: {
      group: { type: 'string', description: 'the owning group (PHASE1.md) — decides who fixes it' },
      severity: { type: 'string', enum: ['high', 'medium', 'low'] },
      where: { type: 'string', description: 'frame / route / size' },
      problem: { type: 'string' },
      evidence: { type: 'string', description: 'numbers, the PNG and what it shows, the frame line it contradicts' },
      fix: { type: 'string', description: 'what would fix it' },
    }, required: ['group', 'severity', 'where', 'problem', 'evidence', 'fix'] } },
    acceptedResiduals: { type: 'array', items: { type: 'string' }, description: 'each remaining difference you checked and accept, with why (sample data, recorded decision, platform caret)' },
  },
  required: ['area', 'framesReviewed', 'sizePngsReviewed', 'flowsExercised', 'findings', 'acceptedResiduals'],
}

const FIXED = {
  type: 'object',
  properties: {
    group: { type: 'string' },
    outcomes: { type: 'array', items: { type: 'object', properties: {
      finding: { type: 'string' }, outcome: { type: 'string', enum: ['fixed', 'not-a-defect', 'not-fixed'] }, detail: { type: 'string' },
    }, required: ['finding', 'outcome', 'detail'] } },
    framesAfter: { type: 'array', items: { type: 'string' }, description: 'frame: px % after the fix, for every frame touched' },
    filesChanged: { type: 'array', items: { type: 'string' } },
    typecheckClean: { type: 'boolean' },
  },
  required: ['group', 'outcomes', 'framesAfter', 'filesChanged', 'typecheckClean'],
}

const COMMON = `You are on the final, second complete review of the VICI "Vici Overhaul" UI rebuild (repo /Users/admin/Documents/Vici; Expo SDK 56 / RN 0.85 / expo-router; RN-web on :8096, design frames on :8097).
Read first: .overhaul/BRIEF.md (rules, tools), .overhaul/PHASE1.md (who owns which file), .overhaul/decisions/*.md (rulings; orchestrator D320–D346 rule over the rest), and the analysis doc(s) for your area in .overhaul/understand/.
Fresh measurements of the whole app are on disk, taken after every earlier fix: .overhaul/audit/report.json + strips (.overhaul/audit/strips/<Frame>.strip.png = design | app | diff), .overhaul/lesson-sweep/ (all 1,273 lesson pages), .overhaul/size-sweep/{375x667,390x844,430x932}/ (findings.json + one PNG per frame, .end.png where scrolled), .overhaul/lab-audit/report.md.
Machine limits: at most one capture at a time; never start or stop servers; delete scratch PNGs you make.`

// Added on resume for the areas whose first attempts stalled (the app server had died under memory pressure
// and every capture waited out its timeouts). Only those prompts carry it, so finished reviews replay from cache.
const ROBUST = `

MACHINE NOTE: the app server has died under memory pressure before. Before any capture, check it: curl -s -o /dev/null -m 60 -w "%{http_code}" localhost:8096/ must print 200 — if it does not, STOP capturing and report what you could review from the existing PNGs (do not wait for it; never start it yourself). Keep every single command under 6 minutes: capture one frame at a time (audit-fast.mjs --frame="<label>", size-sweep.mjs --frame="<label>"), never a whole group in one command. The existing strips and size PNGs on disk are current (taken after the last fixes) — review them first and only re-capture what you need to confirm.`
const review = (a) => agent(`${COMMON}

YOU ARE A FRESH, INDEPENDENT REVIEWER for area "${a.key}" (groups: ${a.groups.join(', ')}; frames in .overhaul/groups.json under those keys; unframed routes in PHASE1.md for those groups). READ-ONLY: do not edit any source file.
1. Read every strip of the area's frames and compare design vs app with your own eyes: copy and punctuation, line breaks, type (size/weight/tracking/leading/colour), spacing and alignment, radii, rings, colours, icons, illustrations, states. Every visible difference is a finding unless it is (a) canvas sample data the app cannot produce, (b) a recorded decision, or (c) the platform text caret — list those in acceptedResiduals with the reason.
2. Read every size PNG of the area at 375x667, 390x844, 430x932 (and the .end.png scrolled ones): clipping, overflow, text under a control, awkward wraps (orphan word, title broken mid-phrase), inconsistent spacing, art not reaching the edges, cramped or floating layouts.
3. Exercise the area's flows in the running app (node scripts/overhaul/shot.mjs app <route> <png> --initseed=… --do="…" with .overhaul/drive.js helpers; recipes in .overhaul/recipes/): every button, option, back, close, sheet, toggle, picker; unframed screens and loading / empty / error states. Confirm each control works and each unframed screen uses the new system (ground + noise, Lato, kit pieces, no old palette — node scripts/overhaul/lint-mono.mjs --files <files>).
4. Report findings with the owning group, severity (high = broken control, wrong content, visibly wrong layout at 393; medium = visible mismatch or a size-specific layout fault; low = polish), evidence and the fix.${(args?.robust ?? []).includes(a.key) ? ROBUST : ''}`, { label: `review:${a.key}`, phase: 'Review', schema: FINDINGS })

const fix = (group, findings) => agent(`${COMMON}

YOUR GROUP: "${group}" — edit only its files (PHASE1.md). An independent second review found the issues below. For each: check it against the frame / the old behaviour (git diff refs/snapshots/pre-overhaul-full -- <file>); if it is not a defect say why with evidence; otherwise fix it. Then re-run node scripts/overhaul/audit-fast.mjs --group=${group} and node scripts/overhaul/size-sweep.mjs --size=<375x667|390x844|430x932> --group=${group} --scroll, Read the strips/PNGs you affected, exercise the controls you touched, run npx tsc --noEmit -p . Return the outcomes.

FINDINGS:
${JSON.stringify(findings).slice(0, 30000)}${ROBUST}`, { label: `fix:${group}`, phase: 'Fix', schema: FIXED })

const LIMIT = args?.limit ?? 2
async function pool(items, fn) {
  const out = new Array(items.length)
  let next = 0
  const worker = async () => { while (next < items.length) { const i = next++; out[i] = await fn(items[i], i) } }
  await Promise.all(Array.from({ length: Math.min(LIMIT, items.length) }, worker))
  return out
}

phase('Review')
const reviews = await pool(AREAS, (a) => review(a))
const all = reviews.filter(Boolean).flatMap((r) => r.findings)
// every discrepancy is fixed, polish included, unless a run says otherwise
const real = all.filter((f) => f.severity !== 'low' || args?.fixLow !== false)
const byGroup = {}
for (const f of real) (byGroup[f.group] ??= []).push(f)
log(`review: ${all.length} findings (${real.length} to fix) across ${Object.keys(byGroup).length} groups; missing reviews: ${AREAS.filter((a, i) => !reviews[i]).map((a) => a.key).join(', ') || 'none'}`)

phase('Fix')
const fixes = args?.noFix ? [] : await pool(Object.keys(byGroup), (g) => fix(g, byGroup[g]))

return {
  reviews: reviews.map((r, i) => r ? ({ area: r.area, frames: r.framesReviewed, sizes: r.sizePngsReviewed, flows: r.flowsExercised.length, findings: r.findings.map((f) => `${f.severity} [${f.group}] ${f.where}: ${f.problem}`), accepted: r.acceptedResiduals }) : { area: AREAS[i].key, missing: true }),
  fixes: fixes.filter(Boolean).map((f) => ({ group: f.group, outcomes: f.outcomes.map((o) => `${o.outcome}: ${o.finding.slice(0, 120)} — ${o.detail.slice(0, 200)}`), framesAfter: f.framesAfter, tsc: f.typecheckClean })),
  lowLeft: all.filter((f) => f.severity === 'low' && args?.fixLow === false).map((f) => `[${f.group}] ${f.where}: ${f.problem}`),
}
