await __sleep(300);
const sc = [...document.querySelectorAll('*')].filter((el) => { const cs = getComputedStyle(el); return /(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1; });
for (const el of sc) el.scrollTop = el.scrollHeight;
await __sleep(400);
return sc.map((e) => [e.scrollTop, e.scrollHeight, e.clientHeight]);
