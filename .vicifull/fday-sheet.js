/* Change Pledge Sheet: the canvas draws the field mid-edit with a NEW sentence
   and a caret after it, over the standing pledge the Resign step draws. So the
   frame's state is "opened the sheet and typed a replacement", not a different
   account — drive it that way rather than seeding a different pledge, which
   would then contradict Morning Resign Pledge's own card. */
await tap('Begin day 13'); await __sleep(700);
await tap('Yes'); await __sleep(700);
await tap('Continue'); await __sleep(600);
await tap('Continue'); await __sleep(600);
await tap('Continue'); await __sleep(700);
await tap('Change the pledge'); await __sleep(900);
const el = document.querySelector('textarea');
if (!el) throw new Error('no textarea in the sheet');
const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
d.set.call(el, 'Phone stays out of the bedroom');
el.dispatchEvent(new Event('input', { bubbles: true }));
el.dispatchEvent(new Event('change', { bubbles: true }));
await __sleep(500);
return __txt().slice(0, 120);
