/* Drive the lesson reader to page 2 (1-based) and prove it landed there.
   A tap can be swallowed while the page's entering animation runs, so each turn
   is confirmed by the hairline's own width — the one thing on screen that is a
   function of the page index — and retried up to three times if it did not move. */
await window.__sleep(900);
const rail = () => {
  const box = [...document.querySelectorAll('div')].find((d) => {
    const s = getComputedStyle(d);
    return s.position === 'absolute' && d.clientHeight === 2 && d.clientWidth > 300;
  });
  const fill = box && box.firstElementChild;
  return fill ? fill.style.width || getComputedStyle(fill).width : '?';
};
const n = Number('2') - 1;
for (let i = 0; i < n; i++) {
  const before = rail();
  for (let attempt = 0; attempt < 4; attempt++) {
    await window.tap('Next', { wait: 420 });
    if (rail() !== before) break;
  }
}
await window.__sleep(600);
return rail() + ' :: ' + window.__txt().slice(0, 70);
