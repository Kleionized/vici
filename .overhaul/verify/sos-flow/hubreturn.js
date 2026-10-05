await __sleep(800);
await tap('Pane 3'); await __sleep(900);
await tap('Breathe'); await __sleep(700);
await tap('Back'); await __sleep(900);
const sc = [...document.querySelectorAll('div')].find((d) => d.scrollWidth > d.clientWidth + 100 && getComputedStyle(d).overflowX !== 'visible');
const sel = [1,2,3,4,5].filter((i) => document.querySelector(`[aria-label="Pane ${i}"]`)?.getAttribute('aria-selected') === 'true');
return { scrollLeft: sc && sc.scrollLeft, w: sc && sc.clientWidth, selectedDot: sel };
