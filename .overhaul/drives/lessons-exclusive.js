/* Lessons — L2 F11 multi-choice with the exclusive F ("Choose F alone if it fits."). /lesson/day/2?page=11 */
const checked = () => [...document.querySelectorAll('[role="checkbox"]')].map((e) => (e.getAttribute('aria-checked') === 'true' ? 1 : 0)).join('');
const out = {};
await tap('A. Saved material or bookmarks');
await tap('C. A device beside me where I usually watch');
out.ac = checked();
await tap('F. Nothing clear right now');
out.f = checked();
await tap('B. A feed or account that leads to porn');
out.b = checked();
await tap('B. A feed or account that leads to porn');
out.none = checked();
await tap('A. Saved material or bookmarks');
await tap('C. A device beside me where I usually watch');
return out;
