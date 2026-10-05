/* Advance the lesson reader by __N pages, then settle. The reader turns on a
   tap anywhere that is not a control, so this clicks the scroller itself. */
const n = Number(window.__N || 0);
const surface = () => document.querySelector('#root div') || document.body;
for (let i = 0; i < n; i++) {
  const el = [...document.querySelectorAll('div')].find((d) => {
    const r = d.getBoundingClientRect();
    return r.width > 300 && r.height > 500;
  });
  window.__fire(el || surface());
  await window.__sleep(240);
}
await window.__sleep(400);
return window.__txt().slice(0, 120);
