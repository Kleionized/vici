window.__log = []; const __p = window.__log.push.bind(window.__log); window.__log.push = (s) => { console.error("CTL " + s); return __p(s); };
window.__has = async (needle, ms = 6000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (window.__txt().includes(needle)) return true; await window.__sleep(90); } return false; };
window.__step = async (label, action, needle, gone) => {
  try { await action(); } catch (e) { window.__log.push(`FAIL ${label}: ${String(e.message).slice(0, 140)}`); return false; }
  const ok = await window.__has(needle);
  let goneOk = true;
  if (ok && gone) goneOk = !window.__txt().includes(gone);
  window.__log.push(`${ok && goneOk ? 'ok  ' : 'FAIL'} ${label} -> ${needle}${ok ? '' : ' :: ' + window.__txt().slice(0, 140)}${goneOk ? '' : ' (still shows ' + gone + ')'}`);
  return ok && goneOk;
};
window.__noCtl = (aria) => !window.__btns().some((b) => (b.getAttribute('aria-label') || '') === aria);
window.__noteCtl = (label) => window.__log.push(`ctl ${label}: ` + window.__btns().map((b) => (b.getAttribute('aria-label') || b.textContent.trim()).slice(0, 24)).filter(Boolean).join(' | '));
const N = { arr: 'A letter arrived.', read: 'Week XII, from', vow: 'The vow.', med: 'Your first medallion.' };
await window.__has(N.arr, 10000);
window.__log.push('arrived: no Close ' + window.__noCtl('Close') + ', no Back ' + window.__noCtl('Back'));
await __step('arr Save it for later', () => tap('Save it for later'), N.vow, N.arr);
window.__log.push('vow date caps: ' + (window.__txt().match(/Day 0, [A-Z][a-z]{2} \d+/) || ['(none)'])[0]);
await __step('vow Not now', () => tap('Not now'), N.med, N.vow);
window.__log.push('medallion: no Close ' + window.__noCtl('Close') + ', no Back ' + window.__noCtl('Back'));
return window.__log.length;
