/* After the seed script has navigated to Today, page the vertical pager down.
   drive.js was injected into the pre-navigation document, so this does its own
   waiting and scrolling with nothing but the DOM. */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const seen = async (needle, ms = 12000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (document.body.innerText.includes(needle)) return true;
    await sleep(120);
  }
  return false;
};
await seen('Day 41');
const pager = [...document.querySelectorAll('div')].find((d) => d.scrollHeight > d.clientHeight + 8 && getComputedStyle(d).overflowY !== 'visible');
if (!pager) return 'no pager';
const page = Number(window.__PAGE || 1);
pager.scrollTop = pager.clientHeight * page;
pager.dispatchEvent(new Event('scroll', { bubbles: true }));
await sleep(700);
return [pager.clientHeight, pager.scrollTop, document.body.innerText.replace(/\s+/g, ' ').slice(0, 120)];
