/* GROUP paywall — the account `51 · Paywall Confirmed` is drawn for.

   The frame states three things the screen computes rather than authors: the
   first name in "We're in, Sam.", the receipt address `sam@hey.com`, and
   `until Jul 24` — three days from the day the board was drawn. All three are
   seedable, so the frame is compared instead of excused (FINDINGS F28): the
   mock user is Sam at sam@hey.com and the clock is pinned to 21 Jul 2026, which
   makes the trial's third day the frame's own Jul 24.

   Used with `shot.mjs --initseed`, so both land before the first script. */
const uid = 'mockuser_pw51';
localStorage.setItem('tideline.session.userId', uid);
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sam@hey.com': { userId: uid, email: 'sam@hey.com', password: 'x', displayName: 'Sam' } }));
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Sam', email: 'sam@hey.com', createdAt: Date.now(), onboardingComplete: true, settings: { showStreak: false } },
  progress: {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: Date.now() },
  events: [], checkins: {}, journalEntries: [],
}));

const FIXED = new Date('2026-07-21T12:00:00').getTime();
const Real = Date;
const shim = function (...args) {
  if (!(this instanceof shim)) return new Real(FIXED).toString();
  return args.length === 0 ? new Real(FIXED) : new Real(...args);
};
shim.prototype = Real.prototype;
shim.now = () => FIXED;
shim.parse = Real.parse;
shim.UTC = Real.UTC;
Object.setPrototypeOf(shim, Real);
// eslint-disable-next-line no-global-assign
Date = shim;
