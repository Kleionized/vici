/* The funnel walker.
   Loads the probe, drives the app into the state each canvas frame draws, and
   captures a layout signature per screen. Kept on disk so a re-verification is
   one `eval(fetch)` rather than a page of pasted script. */
(async function () {
  eval(await (await fetch('http://localhost:8097/probe.js?v=2')).text());
  const SEL = await (await fetch('http://localhost:8097/mock-selection.json')).json();
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const txt = () => document.body.innerText.replace(/\s+/g, ' ').trim();
  const tap = (el) => {
    for (const t of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'])
      el.dispatchEvent(new (t.startsWith('pointer') ? PointerEvent : MouseEvent)(t, { bubbles: true, cancelable: true, pointerId: 1, button: 0 }));
  };
  const setVal = (el, v) => {
    const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
    d.set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const btns = () => [...document.querySelectorAll('div[role="button"],div[role="checkbox"],button')];
  Object.assign(window, { __SEL: SEL, __sleep: sleep, __txt: txt, __tap: tap, __setVal: setVal, __btns: btns });

  window.__adv = async function () {
    const before = txt();
    const cta = btns().find((b) => /^(Continue|Start|Next|Start changing it|See the twelve weeks)$/.test(b.textContent.trim()));
    if (cta) tap(cta);
    else {
      const o = btns().filter((b) => b.textContent.trim() && !/^Back$/.test(b.textContent.trim()))[0];
      if (o) tap(o);
    }
    for (let k = 0; k < 40 && txt() === before; k++) await sleep(80);
    return txt().slice(0, 36);
  };
  window.__cap = async function (id, marker) {
    for (let k = 0; k < 80 && !txt().includes(marker); k++) await sleep(90);
    if (!txt().includes(marker)) return 'NOT FOUND ' + marker + ' :: ' + txt().slice(0, 40);
    await sleep(220);
    return await window.__sig('app-' + id);
  };
  /** Answer the twenty questionnaire screens the way the frames draw them. */
  window.__q = async function (ids, capture) {
    const out = [];
    const TEXTVAL = { '03-name': '', '04-age': '24' };
    for (const id of ids) {
      await sleep(150);
      if (TEXTVAL[id] !== undefined) {
        const inp = document.querySelector('input');
        if (inp) setVal(inp, TEXTVAL[id]);
        await sleep(110);
      }
      const wanted = SEL[id] || [];
      const buttonless = !btns().some((b) => /^(Continue|Start)$/.test(b.textContent.trim()));
      for (const label of wanted) {
        const el = btns().find((b) => b.textContent.trim() === label);
        if (el) tap(el);
        await sleep(buttonless ? 55 : 75);
      }
      if (!buttonless) await sleep(150);
      if (capture) out.push(await window.__sig('app-' + id));
      const cta = btns().find((b) => /^(Continue|Start)$/.test(b.textContent.trim()));
      if (cta) tap(cta);
      else if (!wanted.length) {
        const o = btns().filter((b) => b.textContent.trim() && !/^Back$/.test(b.textContent.trim()))[0];
        if (o) tap(o);
      }
    }
    await sleep(350);
    return out.length ? out.join('\n') : txt().slice(0, 44);
  };
  return 'walker ready';
})();
