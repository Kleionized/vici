await tap('Continue');
await waitFor('Due today');
// the sheet's confirm row is a PressScale with no role, so it is found by text
const el = [...document.querySelectorAll('div')].find((d) => d.textContent.trim() === 'Confirm with Side Button' && d.children.length >= 2);
window.__fire(el);
await waitFor('Receipt sent');
