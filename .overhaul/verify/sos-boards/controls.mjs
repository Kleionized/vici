// verifier: tap through sos-boards controls in one Chrome; print PASS/FAIL per check.
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const SEED = fs.readFileSync('.overhaul/settings-seed.js', 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
const only = process.argv[2] ? process.argv[2].split(',') : null;
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 });
await ctx.addInitScript(`try { ${SEED} } catch (e) { console.error('initseed: ' + e.message); }`);
const page = await ctx.newPage();
page.on('pageerror', (e) => console.error('[pageerror] ' + e.message));
const open = async (route) => {
  await page.goto('http://localhost:8096' + route, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.evaluate(DRIVE);
  await page.waitForTimeout(1500);
};
const run = (js) => page.evaluate(`(async () => { ${js} })()`);
const txt = () => page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());
const path = () => page.evaluate(() => location.pathname + location.search);
const results = [];
const check = async (name, fn) => {
  if (only && !only.some((o) => name.includes(o))) return;
  try { const r = await fn(); results.push(`PASS ${name}${r ? ' :: ' + r : ''}`); }
  catch (e) { results.push(`FAIL ${name} :: ${String(e.message).slice(0, 300)}`); }
  console.log(results[results.length - 1]);
};
const to = async (needle, ms = 9000) => run(`await waitFor(${JSON.stringify(needle)}, ${ms})`);
const tap = async (label) => run(`await tap(${JSON.stringify(label)})`);
const tapLabel = async (label) => run(`const el = __btns().find((b) => (b.getAttribute('aria-label')||'') === ${JSON.stringify(label)}); if (!el) throw new Error('no aria ' + ${JSON.stringify(label)}); __fire(el); await __sleep(300);`);
const notSeen = async (needle) => { const t = await txt(); if (t.includes(needle)) throw new Error('still showing ' + needle + ' :: ' + t.slice(0, 160)); };

await check('Loc board ✕ closes the flow', async () => {
  await open('/urge?board=SOS-Loc-Bed'); await to('Get out of bed.');
  await tapLabel('Close'); await page.waitForTimeout(2500);
  await notSeen('Get out of bed.'); return await path() + ' :: ' + (await txt()).slice(0, 80);
});
await check('Loc board Continue → Move I', async () => {
  await open('/urge?board=SOS-Loc-Bed'); await to('Get out of bed.');
  await tap('Continue'); await to('Move I of 3'); return (await txt()).slice(0, 80);
});
await check('Loc Elsewhere Done → Move I', async () => {
  await open('/urge?board=SOS-Loc-Elsewhere'); await to('Get somewhere');
  await tap('Done'); await to('Move I of 3'); return (await txt()).slice(0, 80);
});
await check('Trig board Continue → feeling picker', async () => {
  await open('/urge?board=SOS-Trig-Rejection'); await to('Stop checking.');
  await tap('Continue'); await to('What’s underneath it?'); return (await txt()).slice(0, 80);
});
await check('Trig Unknown Done → feeling picker', async () => {
  await open('/urge?board=SOS-Trig-Unknown'); await to('Put the phone down.');
  await tap('Done'); await to('What’s underneath it?'); return (await txt()).slice(0, 80);
});
await check('Trig board has no back control', async () => {
  await open('/urge?board=SOS-Trig-Content'); await to('Close it.');
  const n = await page.evaluate(() => __btns().filter((b) => (b.getAttribute('aria-label') || '') === 'Back').length);
  if (n) throw new Error('Back control present on a trigger board'); return 'no back';
});
await check('Feel board Done → reassess', async () => {
  await open('/urge?board=SOS-Feel-Bored'); await to('Do something physical.');
  await tap('Done'); await to('Where is the urge now?'); return (await txt()).slice(0, 80);
});
await check('Feel rotation Turned On → Bored → Lonely', async () => {
  await open('/urge?board=SOS-Feel-Turned-On'); await to('Let it pass.');
  await tap('Give me another'); await to('Do something physical.');
  await tap('Give me another'); await to('Talk to someone.'); return 'ok';
});
await check('Challenge reached by rotation from Unknown; back → feeling picker', async () => {
  await open('/urge?board=SOS-Feel-Unknown'); await to('Move first.');
  await tap('Give me another'); await to('Break the isolation.');
  const t = await txt(); if (!t.includes('The challenge')) throw new Error('no challenge card label');
  await tapLabel('Back'); await to('What’s underneath it?'); return 'back ok';
});
await check('Challenge Give me another wraps to Let it pass.', async () => {
  await open('/urge?board=SOS-Challenge'); await to('Break the isolation.');
  await tap('Give me another'); await to('Let it pass.'); return 'wrap ok';
});
await check('Challenge Done → reassess', async () => {
  await open('/urge?board=SOS-Challenge'); await to('Break the isolation.');
  await tap('Done'); await to('Where is the urge now?'); return 'ok';
});
await check('Challenge ✕ closes', async () => {
  await open('/urge?board=SOS-Challenge'); await to('Break the isolation.');
  await tapLabel('Close'); await page.waitForTimeout(2500); await notSeen('Break the isolation.'); return await path();
});
await check('Rough days renders + 7 rows', async () => {
  await open('/rough-days'); await to('What today feels like');
  const t = await txt();
  const want = ['Loneliness', 'Anxiety', 'Stress', 'Boredom', 'Late night', 'Home alone', 'An argument', 'The universal interrupt', 'The First 90 Seconds', 'Rough days'];
  const miss = want.filter((w) => !t.includes(w)); if (miss.length) throw new Error('missing ' + miss.join(', '));
  return t.slice(0, 200);
});
for (const [row, head] of [['Loneliness', 'Lonely tonight.'], ['An argument', 'Still burning.'], ['Home alone', 'Empty house.']]) {
  await check(`Rough days row ${row} → protocol`, async () => {
    await open('/rough-days'); await to('What today feels like');
    await tap(row); await to(head); return await path();
  });
}
await check('Rough days card → First 90 seconds flow', async () => {
  await open('/rough-days'); await to('What today feels like');
  await tap('The First 90 Seconds'); await page.waitForTimeout(2000);
  const t = await txt(); return (await path()) + ' :: ' + t.slice(0, 100);
});
await check('Rough days back (fresh load)', async () => {
  await open('/rough-days'); await to('What today feels like');
  await tapLabel('Back'); await page.waitForTimeout(2500); return (await path()) + ' :: ' + (await txt()).slice(0, 80);
});
await check('Protocol stepping I→II→I→II→III→Done closes', async () => {
  await open('/rough-days'); await to('What today feels like');
  await tap('Home alone'); await to('Empty house.');
  await tap('Walk through it'); await to('The door is a switch.');
  await tap('Back'); await to('Empty house.');
  await tap('Walk through it'); await to('The door is a switch.');
  await tap('Next'); await to('Change the room.');
  const t = await txt(); if (!t.includes('Open the curtains')) throw new Error('act line missing');
  await tap('Done'); await to('What today feels like'); return await path();
});
await check('Protocol Not tonight closes to shelf', async () => {
  await open('/rough-days'); await to('What today feels like');
  await tap('Stress'); await to('Heavy day.');
  await tap('Not tonight'); await to('What today feels like'); return await path();
});
await check('Protocol ✕ closes to shelf', async () => {
  await open('/rough-days'); await to('What today feels like');
  await tap('Boredom'); await to('Nothing to do.');
  await tapLabel('Close'); await to('What today feels like'); return await path();
});
await check('Protocol fresh-load ✕ → /rough-days', async () => {
  await open('/rough-protocol?key=anxiety'); await to('Wound up, not turned on.');
  await tapLabel('Close'); await page.waitForTimeout(2500); return (await path()) + ' :: ' + (await txt()).slice(0, 60);
});
await check('?key=lonely → Loneliness', async () => { await open('/rough-protocol?key=lonely'); await to('Lonely tonight.'); return 'ok'; });
await check('?key=zzz → first protocol', async () => { await open('/rough-protocol?key=zzz'); await to('Lonely tonight.'); return 'ok'; });
await check('no key → first protocol', async () => { await open('/rough-protocol'); await to('Lonely tonight.'); return 'ok'; });
await check('/rough-first90 renders flow', async () => { await open('/rough-first90'); await to('90'); return (await txt()).slice(0, 100); });
await browser.close();
