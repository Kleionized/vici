/* GROUP slip — f-slip-seed0.js with the page clock frozen at tonight 23:40.
   F28: seed the state the frame draws rather than excusing a row as data. 98E
   writes “Tonight · 11:40 PM” and 98C's wheel centres on 11 / 40 / PM, and both
   are the live clock in the app — so the clock is what has to be seeded. An
   init script lands before any page script, so `Date` is already frozen when
   `useState(() => Date.now())` reads it.
   The date COLUMN still cannot match: the canvas's mock reads Sat Jul 18 / Sun
   Jul 19 / Today / Wed Jul 22 / Thu Jul 23, which skips a day and so is not a
   date any real wheel can produce. */
(() => {
  const RealDate = Date;
  const target = (() => { const d = new RealDate(); d.setHours(23, 40, 0, 0); return d.getTime(); })();
  const delta = target - RealDate.now();
  function FrozenDate(...args) {
    if (!(this instanceof FrozenDate)) return new RealDate(RealDate.now() + delta).toString();
    return args.length === 0 ? new RealDate(RealDate.now() + delta) : new RealDate(...args);
  }
  FrozenDate.prototype = RealDate.prototype;
  FrozenDate.now = () => RealDate.now() + delta;
  FrozenDate.parse = RealDate.parse;
  FrozenDate.UTC = RealDate.UTC;
  window.Date = FrozenDate;
})();

/* GROUP slip — a signed-in mock account with 2 slip(s) already on today's log
   and a signed pledge, put into localStorage BEFORE the first paint.
   `--initseed` is what 98H and 98I need (they are chosen by that count) and
   what makes 98J show a name and a pledge line instead of being skipped. */
(() => {
  const uid = 'slip-seed-user';
  const midnight = new Date().setHours(0, 0, 0, 0);
  localStorage.setItem('tideline.mock.users', JSON.stringify({ 'slip@vici.app': { userId: uid, email: 'slip@vici.app', password: 'x', displayName: 'Jerry' } }));
  localStorage.setItem('tideline.session.userId', uid);
  localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
    user: { clerkUserId: uid, displayName: 'Jerry', createdAt: midnight - 12 * 86400000, onboardingComplete: true, settings: {} },
    progress: {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: midnight },
    events: Array.from({ length: 2 }, (_, i) => ({ _id: 's-' + i, userId: uid, type: 'lapse', createdAt: midnight + (9 + i) * 3600000, note: '' })),
    checkins: {},
    journalEntries: [{ _id: 's-p', userId: uid, tag: 'Pledge', title: 'Pledge', body: 'The mornings are mine again.', createdAt: midnight - 6 * 86400000 }],
  }));
})();
