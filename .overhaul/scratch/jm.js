await __sleep(1500);
const sc = [...document.querySelectorAll('div')].filter((d) => /(auto|scroll)/.test(getComputedStyle(d).overflowY) && d.scrollHeight > d.clientHeight + 8)[0];
const inner = sc.firstElementChild;
const blocks = [...inner.children];
return blocks.map((b) => { const br = b.getBoundingClientRect(); let maxB = 0; b.querySelectorAll('div').forEach((d) => { const r = d.getBoundingClientRect(); if (r.height > 0 && r.height < 400) maxB = Math.max(maxB, r.bottom - br.top); }); return { h: Math.round(br.height), contentBottom: Math.round(maxB) }; });
