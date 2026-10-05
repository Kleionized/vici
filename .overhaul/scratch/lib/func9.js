const out = {};
await __sleep(400);
out.labels = __btns().map(b => b.getAttribute('aria-label')).filter(Boolean).join('|').slice(0, 120);
out.rows = [...document.querySelectorAll('[aria-label]')].map(e => e.getAttribute('aria-label')).filter(l => /done|here|not yet/.test(l)).length;
await tap('Back'); await __sleep(1500);
out.back = location.pathname;
return out;
