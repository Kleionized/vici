/* GROUP paywall — does the wheel commit a value when nothing flings it?
   `react-native-web` never emits onMomentumScrollEnd (D065), so the column now
   settles off a 140 ms scroll-idle. Scroll the hour column by two rows and read
   back the 30px row: it should be 12, and it should still be exactly on 337. */
const cols = [...document.querySelectorAll('div')].filter((d) => d.getAttribute('role') === 'adjustable' || d.getAttribute('aria-label') === 'Hour');
const hour = cols.find((c) => c.getAttribute('aria-label') === 'Hour');
if (!hour) return 'no hour column';
const before = hour.getAttribute('aria-valuetext');
hour.scrollTop = hour.scrollTop + 73;
hour.dispatchEvent(new Event('scroll', { bubbles: false }));
await new Promise((r) => setTimeout(r, 900));
const big = [...document.querySelectorAll('div')].filter((d) => getComputedStyle(d).fontSize === '30px' && d.textContent.trim().length && d.children.length === 0);
return { before, after: hour.getAttribute('aria-valuetext'), scrollTop: hour.scrollTop, big: big.map((b) => [b.textContent.trim(), Math.round(b.getBoundingClientRect().top * 10) / 10]) };
