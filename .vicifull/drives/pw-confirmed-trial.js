await tap('Close');
await waitFor('Before you go');
await tap('Start my 3 free days');
await waitFor('Due today');
const el = [...document.querySelectorAll('div')].find((d) => d.textContent.trim() === 'Confirm with Side Button' && d.children.length >= 2);
window.__fire(el);
await waitFor('Receipt sent');
