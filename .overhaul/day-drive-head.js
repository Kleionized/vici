/* GROUP day: the drive helpers again, because the seed reloads the page and
   takes shot.mjs's own injection with it. */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const btns = () => [...document.querySelectorAll('div[role="button"],div[role="checkbox"],div[role="radio"],button,[data-testid]')];
const fire = (el) => { for (const t of ['pointerdown','mousedown','pointerup','mouseup','click']) el.dispatchEvent(new (t.startsWith('pointer') ? PointerEvent : MouseEvent)(t, { bubbles: true, cancelable: true, pointerId: 1, button: 0 })); };
const txt = () => document.body.innerText.replace(/\s+/g, ' ').trim();
const waitFor = async (needle, ms = 9000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (txt().includes(needle)) return true; await sleep(90); } throw new Error('never saw ' + needle + ' :: ' + txt().slice(0, 200)); };
const tap = async (label, wait = 300) => { const all = btns(); let el = all.find((b) => b.textContent.trim() === label) || all.find((b) => (b.getAttribute('aria-label') || '') === label) || all.find((b) => b.textContent.trim().includes(label)); if (!el) throw new Error('no control for ' + label + ' :: ' + txt().slice(0, 200)); fire(el); await sleep(wait); };
const tapNth = async (n, wait = 300) => { const a = btns(); if (!a[n]) throw new Error('no control #' + n); fire(a[n]); await sleep(wait); };
