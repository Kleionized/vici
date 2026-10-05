import fs from 'node:fs';
const map = JSON.parse(fs.readFileSync('.overhaul/map.json', 'utf8'));
const G = [
  ['auth', 1, 3, 'src/app/(auth)/**, src/components/auth/kit.tsx, src/app/index.tsx'],
  ['funnel', 4, 26, 'src/components/onboarding/v3.tsx, src/content/onboardingFunnel.ts, src/components/onboarding/art.tsx'],
  ['plan', 27, 31, 'NEW sub-flow — new files under src/components/onboarding/ plus its wiring in src/app/(onboarding)/welcome.tsx'],
  ['tail', 32, 39, 'src/components/onboarding/tail.tsx, src/content/onboardingTail.ts'],
  ['handover', 40, 47, 'src/components/onboarding/handover.tsx, src/app/vow.tsx, src/app/medallion-post.tsx, src/app/reminders.tsx'],
  ['paywall', 48, 54, 'src/app/paywall.tsx, src/app/subscription.tsx, src/components/paywall/**, src/app/routines/**'],
  ['today', 55, 61, 'src/app/(app)/today.tsx, src/app/score.tsx, src/components/today/kit.tsx'],
  ['day', 62, 78, 'src/app/day/morning.tsx, src/app/day/night.tsx, src/components/day/kit.tsx, src/components/MoodLogger.tsx'],
  ['weeks', 79, 102, 'src/app/week/[week].tsx, src/components/library/WeekBoard.tsx, src/components/journey/WeekScene.tsx, src/content/weekScenes.ts'],
  ['sos', 103, 153, 'src/components/urge/index.tsx, src/app/urge.tsx, src/components/ChallengeSheet.tsx'],
  ['medallions', 154, 175, 'src/app/medallions/[key].tsx, src/app/(app)/milestones.tsx, src/components/keepsakes/**'],
  ['logs', 176, 195, 'src/app/(app)/log.tsx, src/app/urge-log.tsx, src/app/lapse.tsx, src/app/urge-overview.tsx, src/app/weekly-report.tsx, src/app/report-ready.tsx'],
  ['settings', 196, 205, 'src/app/(app)/settings.tsx, src/app/profile.tsx, src/app/privacy.tsx, src/app/applock.tsx, src/app/vow.tsx'],
  ['slip', 206, 236, 'src/app/relapse.tsx, src/components/roughDays/kit.tsx, src/app/rough-protocol.tsx, src/app/rough-first90.tsx'],
  ['letters', 237, 241, 'src/app/letter.tsx, src/app/drop.tsx, src/app/medallion-post.tsx'],
  ['lesson-scrolls', 242, 267, 'src/components/lesson/**, src/content/lessonReader.ts, src/content/readerRoom.ts, src/app/lesson/day/[day].tsx'],
];
const out = G.map(([key, a, b, files]) => ({
  key, files,
  frames: map.filter((r) => r.n >= a && r.n <= b),
}));
out.push({
  key: 'week-lessons', files: 'src/content/interactiveLessons.ts, src/content/lessonPlates.ts, src/content/taskScenes.ts, src/content/curriculum84.ts, src/components/lesson/**, src/components/task/**',
  frames: [], bundles: ['Week-01-Reset', 'Week-02-Changing-Your-Mindset', 'Week-03-In-the-Moment', 'Week-04-Know-Your-Brain', 'Week-05-Why-It-Feels-Worth-It', 'Week-06-Discipline', 'Week-07-Relapse-and-Adversity', 'Week-08-Boredom-and-Meaning', 'Week-09-Connection', 'Week-10-Yourself', 'Week-11-Build-a-Life-You-Want', 'Week-12-Leave-It-Behind'],
});
fs.writeFileSync('.overhaul/groups.json', JSON.stringify(out, null, 2));
for (const g of out) {
  const ch = g.frames.filter((f) => f.status === 'changed').length, ad = g.frames.filter((f) => f.status === 'ADDED').length;
  console.log(`${g.key.padEnd(16)} ${String(g.frames.length).padStart(3)} frames  ${ad} added  ${ch} changed`);
}
