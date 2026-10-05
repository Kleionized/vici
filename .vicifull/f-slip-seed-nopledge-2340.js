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

/* GROUP slip — the same account with NO signed pledge, for the state D136 says
   98J must not be drawn in. Everything else matches f-slip-seed0.js. */
(() => {
  const uid = 'slip-seed-user';
  const midnight = new Date().setHours(0, 0, 0, 0);
  localStorage.setItem('tideline.mock.users', JSON.stringify({ 'slip@vici.app': { userId: uid, email: 'slip@vici.app', password: 'x', displayName: 'Jerry' } }));
  localStorage.setItem('tideline.session.userId', uid);
  localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
    user: { clerkUserId: uid, displayName: 'Jerry', createdAt: midnight - 12 * 86400000, onboardingComplete: true, settings: {} },
    progress: {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: midnight },
    events: [], checkins: {}, journalEntries: [],
  }));
})();
