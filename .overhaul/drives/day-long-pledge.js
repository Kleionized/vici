/* GROUP day (Phase 2) — Morning Resign Pledge with a long pledge of the user's own: write it in the
   Change Pledge Sheet, sign the new pledge, then sign for today. At 375 × 667 the card overflows
   the band between the nav and the pill: it scrolls, the pen steps aside, nothing runs under the pill. */
await tap('Begin'); await __sleep(700);
await tap('Yes'); await __sleep(300);
await tap('Next'); await __sleep(700);
await tap('Continue'); await __sleep(600);
await tap('Continue'); await __sleep(600);
await tap('Continue'); await __sleep(700);
await tap('Change the pledge'); await __sleep(900);
const el = document.querySelector('textarea');
const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
d.set.call(el, 'The phone sleeps in the kitchen, the mornings start with a walk, and when the evening gets heavy I call someone before I open anything.');
el.dispatchEvent(new Event('input', { bubbles: true }));
await __sleep(400);
await tap('Sign the new pledge'); await __sleep(900);
await tap('Sign for today'); await __sleep(600);
