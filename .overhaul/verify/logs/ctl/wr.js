const o = {};
const tabs = () => [...document.querySelectorAll('[role="tab"]')].filter((t) => t.getAttribute('aria-selected') === 'true').map((t) => t.textContent.trim()).join('|');
await waitFor('Weekly report');
await tap('Urges'); await __sleep(1200); o.s = tabs();
await tap('Tue, 11:40 pm'); await __sleep(1800); o.rowUrl = location.pathname + location.search; o.pill = __txt().slice(0, 40);
history.back(); await __sleep(1800); o.back = location.pathname;
await waitFor('Weekly report');
await tap('Back'); await __sleep(1800); o.backUrl = location.pathname;
return o;
