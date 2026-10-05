/* The album the medallion frames draw, planted before the first paint
   (shot.mjs --initseed=.overhaul/medallions-seed.js). One consistent ledger
   (medallions-letters §8): created Jun 9; 19 check-ins Jun 9 → Jul 20 with no
   7-day gap (Pulse ×19, First light Jun 9, Return unearned); 23 urges ridden
   out, 3 of them severity ≥ 9 (Vici ×23, Breakwater ×3); 3 urges acted on, all
   Jul 20 (Black Box Jul 20, Logbook 26); 2 lapses each followed next day by a
   check-in (Rebound ×2); 9 journal entries (Archive 9 of 10); 12 lessons
   (Lessons ×12). Every record sits on a check-in day, so Vidi = 19 recorded
   days (Tier I, Day 7). Draws Medallions ("10 of 12 earned"), Still to earn,
   Album Earned II, Tiers One-offs and Tiers Vici/Rebound/Breakwater/Logbook/
   Pulse/Archive/Lessons. Tiers Vidi ("Day 13") needs medallions-vidi-seed.js.
   Dates are local noon, so they print the same in every time zone. */
(function () {
  var VIDI = typeof window !== 'undefined' && window.__MED_VIDI;
  var uid = 'mockuser_med';
  var at = function (m, d, h) { return new Date(2026, m - 1, d, h || 12).getTime(); };
  var iso = function (m, d) { return '2026-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0'); };
  var days = VIDI
    ? [[6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], [6, 15], [6, 16], [6, 17], [6, 18], [6, 19], [6, 20], [6, 21]]
    : [[6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], [6, 15], [6, 17], [6, 19], [6, 21], [6, 23], [6, 25], [6, 27], [6, 29], [7, 1], [7, 5], [7, 10], [7, 15], [7, 20]];
  var checkins = {};
  days.forEach(function (md, i) {
    checkins[iso(md[0], md[1])] = { _id: 'med-c-' + i, userId: uid, date: iso(md[0], md[1]), mood: 3, energy: 3, sleepHours: 7 };
  });
  var events = [];
  var journal = [];
  var progress = {};
  if (!VIDI) {
    for (var i = 0; i < 23; i++) {
      var d = days[i % days.length];
      events.push({ _id: 'med-r-' + i, userId: uid, type: 'urge_rode_out', createdAt: at(d[0], d[1], 9 + (i % 9)), severity: i < 3 ? 9 + (i % 2) : 5 + (i % 3) });
    }
    for (var k = 0; k < 3; k++) events.push({ _id: 'med-a-' + k, userId: uid, type: 'urge_acted_on', createdAt: at(7, 20, 18 + k), severity: 8 });
    events.push({ _id: 'med-l-0', userId: uid, type: 'lapse', createdAt: at(6, 12, 22) });
    events.push({ _id: 'med-l-1', userId: uid, type: 'lapse', createdAt: at(6, 14, 22) });
    for (var j = 0; j < 9; j++) {
      var jd = days[j];
      journal.push({ _id: 'med-j-' + j, userId: uid, tag: 'Reflection', title: 'Entry', body: 'x', createdAt: at(jd[0], jd[1], 20) });
    }
    for (var n = 1; n <= 12; n++) {
      var slug = 'day-' + String(n).padStart(2, '0');
      progress[slug] = { userId: uid, lessonSlug: slug, status: 'completed', completedAt: at(6, 9 + n) };
    }
  }
  localStorage.setItem('tideline.mock.users', JSON.stringify({ 'marcus@example.com': { userId: uid, email: 'marcus@example.com', password: 'x', displayName: 'Marcus' } }));
  localStorage.setItem('tideline.session.userId', uid);
  localStorage.setItem(
    'tideline.mock.userdata.' + uid,
    JSON.stringify({
      user: { clerkUserId: uid, displayName: 'Marcus', createdAt: at(6, 9, 9), onboardingComplete: true, settings: { showStreak: false } },
      progress: progress,
      reflections: {},
      lifeMap: { userId: uid, values: [], whyStatement: 'The mornings are mine again.', updatedAt: at(6, 9) },
      events: events,
      checkins: checkins,
      journalEntries: journal,
    }),
  );
  // quiet the (app) launch gate, which otherwise pushes a check-in or a post over the album
  localStorage.setItem('tideline.checkinPromptAt', String(Date.now()));
  localStorage.setItem('tideline.post.backondeck.delivered', String(Date.now()));
  localStorage.setItem('tideline.weeklyReport.seenWeek', '"2099-01-01"');
})();
