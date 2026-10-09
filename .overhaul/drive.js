/* Driving helpers for a headless capture. Injected into the page by
   scripts/overhaul/shot.mjs before any --script runs, so a capture script is
   just `await tap('Continue'); await waitFor('Your plan')`. */
window.__sleep = (ms) => new Promise((r) => setTimeout(r, ms));
window.__txt = () => document.body.innerText.replace(/\s+/g, ' ').trim();
window.__btns = () => [...document.querySelectorAll('div[role="button"],div[role="checkbox"],div[role="radio"],div[role="tab"],div[role="switch"],button,[data-testid]')];
window.__fire = (el) => {
  for (const t of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'])
    el.dispatchEvent(new (t.startsWith('pointer') ? PointerEvent : MouseEvent)(t, { bubbles: true, cancelable: true, pointerId: 1, button: 0 }));
};
/** Tap the first control whose trimmed text equals, then contains, `label`. */
/* Covered stack screens stay mounted on web, so a label can match a control on a
   screen underneath. Prefer controls that are actually on top at their centre. */
window.__onTop = (el) => {
  const r = el.getBoundingClientRect();
  if (r.width === 0 || r.height === 0) return false;
  const h = document.elementFromPoint(Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2)), Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2)));
  return !!h && (el === h || el.contains(h) || h.contains(el));
};
window.tap = async (label, opts) => {
  const wait = (opts && opts.wait) ?? 260;
  // `04 · Age` no longer answers itself (D500): Continue waits for a pick, so a
  // walk that taps Continue there first picks the age on show, as a person would.
  if (label === 'Continue' && window.__txt().includes('How old are you?')) {
    const cont = window.__btns().find((b) => b.textContent.trim() === 'Continue');
    const age = window.__btns().find((b) => (b.getAttribute('aria-label') || '') === '24');
    if (cont && cont.getAttribute('aria-disabled') === 'true' && age) {
      window.__fire(age);
      await window.__sleep(200);
    }
  }
  const btns = window.__btns();
  const top = btns.filter((b) => window.__onTop(b));
  const all = [...top, ...btns.filter((b) => !top.includes(b))];
  let el = all.find((b) => b.textContent.trim() === label);
  if (!el) el = all.find((b) => (b.getAttribute('aria-label') || '') === label);
  if (!el) el = all.find((b) => b.textContent.trim().includes(label));
  if (!el) throw new Error('no control for ' + JSON.stringify(label) + ' :: ' + window.__txt().slice(0, 160));
  window.__fire(el);
  await window.__sleep(wait);
  return true;
};
/** Tap whatever is painted at a point, walking up to the nearest clickable. */
window.tapAt = async (x, y, wait = 260) => {
  let el = document.elementFromPoint(x, y);
  while (el && !(el.getAttribute && (el.getAttribute('role') === 'button' || el.onclick))) el = el.parentElement;
  if (!el) throw new Error('nothing clickable at ' + x + ',' + y);
  window.__fire(el);
  await window.__sleep(wait);
};
/** Tap the nth control (0-based) in document order. */
window.tapNth = async (n, wait = 260) => { const a = window.__btns(); if (!a[n]) throw new Error('no control #' + n); window.__fire(a[n]); await window.__sleep(wait); };
/** Wait until `needle` appears in the page text. */
window.waitFor = async (needle, ms = 8000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { if (window.__txt().includes(needle)) return true; await window.__sleep(90); }
  throw new Error('never saw ' + JSON.stringify(needle) + ' :: ' + window.__txt().slice(0, 200));
};
/** Type into the nth <input>. */
window.typeIn = async (n, v) => {
  const el = document.querySelectorAll('input')[n];
  if (!el) throw new Error('no input #' + n);
  const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
  d.set.call(el, v);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  await window.__sleep(160);
};
/** Scroll the nearest scrollable ancestor of the page by `dy`. */
window.scrollBy = async (dy, sel) => {
  const node = sel ? document.querySelector(sel)
    : [...document.querySelectorAll('div')].find((d) => d.scrollHeight > d.clientHeight + 8 && getComputedStyle(d).overflowY !== 'visible');
  // no scroller: scroll the document itself (calling window.scrollBy here would re-enter this override)
  if (!node) { (document.scrollingElement || document.documentElement).scrollTop += dy; } else { node.scrollTop += dy; node.dispatchEvent(new Event('scroll', { bubbles: true })); }
  await window.__sleep(320);
};
'drive ready';
