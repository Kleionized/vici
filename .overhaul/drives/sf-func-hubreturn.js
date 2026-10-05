// sos-flow functional walk: the pager comes back on the pane its dots mark after Breathe → Back / Done.
const pagerState = () => {
  const sc = [...document.querySelectorAll('div')].find((d) => d.scrollWidth > d.clientWidth + 100 && getComputedStyle(d).overflowX !== 'visible');
  const sel = [1, 2, 3, 4, 5].filter((i) => document.querySelector(`[aria-label="Pane ${i}"]`)?.getAttribute('aria-selected') === 'true');
  return `page ${sc ? Math.round(sc.scrollLeft / sc.clientWidth) + 1 : '?'} dot ${sel.join(',')}`;
};
await __sleep(800);
const out = [];
await tap('Pane 3'); await __sleep(900); out.push('pane3: ' + pagerState());
await tap('Breathe'); await __sleep(700); await tap('Back'); await __sleep(900); out.push('back: ' + pagerState() + (__txt().includes('Every urge so far has ended.') ? ' (85C on screen)' : ''));
await tap('Pane 5'); await __sleep(900);
await tap('Breathe'); await __sleep(700); await tap('Done'); await __sleep(900); out.push('done: ' + pagerState());
await tap('Pane 1'); await __sleep(900); await tap('Breathe'); await __sleep(700); await tap('Back'); await __sleep(900); out.push('pane1: ' + pagerState());
return out.join(' | ');
