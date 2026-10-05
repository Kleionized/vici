/* GROUP paywall — `52 · Manage Subscription` on the day its own dates are true.

   The board draws `renews 10 Jul 2027` and `$39.99 on 10 Jul 2027`. The mock
   catalogue reports no expiry (`src/lib/purchases/mock.tsx` pins `expiresAt`
   to null), so the screen states a year from today — which is the same rule the
   frame was drawn under, one drop earlier. Pinning the clock to 10 Jul 2026
   makes the frame's own date the app's, and the board is then comparable
   instead of excused as sample data (FINDINGS F28).

   Used with `shot.mjs --initseed`, so the shim lands before the first script. */
const uid = 'mockuser_pw';
localStorage.setItem('tideline.session.userId', uid);
localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sam@hey.com': { userId: uid, email: 'sam@hey.com', password: 'x', displayName: 'Sam' } }));
localStorage.setItem('tideline.mock.userdata.' + uid, JSON.stringify({
  user: { clerkUserId: uid, displayName: 'Sam', createdAt: Date.now(), onboardingComplete: true, settings: { showStreak: false, premium: true } },
  progress: {}, reflections: {}, lifeMap: { userId: uid, values: [], updatedAt: Date.now() },
  events: [], checkins: {}, journalEntries: [],
}));

const FIXED = new Date('2026-07-10T12:00:00').getTime();
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
