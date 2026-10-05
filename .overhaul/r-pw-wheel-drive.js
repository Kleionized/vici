/* pass-2 verify: drive the wheel three different ways and read the committed
   value each time. (a) a two-row scroll on the hour column, (b) a one-row
   scroll on the AM/PM column (which is NOT looped and whose last row sits on
   its own scroll limit), (c) the value the screen would save. */
const all = [...document.querySelectorAll('div')];
const col = (label) => all.find((c) => c.getAttribute('aria-label') === label);
const bigRows = () => [...document.querySelectorAll('div')]
  .filter((d) => getComputedStyle(d).fontSize === '30px' && d.textContent.trim().length && d.children.length === 0)
  .map((b) => [b.textContent.trim(), Math.round(b.getBoundingClientRect().top * 10) / 10]);
const out = { start: bigRows() };
const hour = col('Hour'), ap = col('AM or PM'), min = col('Minute');
if (!hour || !ap || !min) return 'missing column';
out.startValues = { hour: hour.getAttribute('aria-valuetext'), min: min.getAttribute('aria-valuetext'), ap: ap.getAttribute('aria-valuetext') };
out.limits = { apScrollHeight: ap.scrollHeight, apClient: ap.clientHeight, apTop: ap.scrollTop, hourTop: hour.scrollTop };

hour.scrollTop = hour.scrollTop + 73;
hour.dispatchEvent(new Event('scroll', { bubbles: false }));
await new Promise((r) => setTimeout(r, 700));
out.afterHour = { value: hour.getAttribute('aria-valuetext'), scrollTop: hour.scrollTop, rows: bigRows() };

ap.scrollTop = 0;
ap.dispatchEvent(new Event('scroll', { bubbles: false }));
await new Promise((r) => setTimeout(r, 700));
out.afterAmToAM = { value: ap.getAttribute('aria-valuetext'), scrollTop: ap.scrollTop, rows: bigRows() };

ap.scrollTop = 36;
ap.dispatchEvent(new Event('scroll', { bubbles: false }));
await new Promise((r) => setTimeout(r, 700));
out.afterAmToPM = { value: ap.getAttribute('aria-valuetext'), scrollTop: ap.scrollTop, rows: bigRows() };

min.scrollTop = min.scrollTop - 36.5 * 3;
min.dispatchEvent(new Event('scroll', { bubbles: false }));
await new Promise((r) => setTimeout(r, 700));
out.afterMin = { value: min.getAttribute('aria-valuetext'), scrollTop: min.scrollTop, rows: bigRows() };
return out;
