const sc = [...document.querySelectorAll('div')].filter((d) => d.scrollHeight > d.clientHeight + 200 && d.clientHeight > 300);
if (sc.length) { sc[0].scrollTop = 900; }
await new Promise((r) => setTimeout(r, 800));
