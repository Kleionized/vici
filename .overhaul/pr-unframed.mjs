// paywall-reminders Phase 2: capture the group's unframed screens and undrawn states at 393x852 and the
// three sweep sizes.
//   node .overhaul/pr-unframed.mjs [outDir] [filter] [--sizes=393x852,375x667,390x844,430x932]
// One browser; each shot in a fresh context (dpr 1). Insets as the size sweep sets them (status bar 20 at 667).
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const [out = '.overhaul/shots/pr/unframed', only] = args.filter((a) => !a.startsWith('--'));
fs.mkdirSync(out, { recursive: true });
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const seed = (f) => fs.readFileSync(f, 'utf8').replace('setTimeout(() => location.reload(), 0);', '');
// the two launch gates (app)/_layout pushes over a tab on first launch, stamped (as pr-func.mjs does)
const GATES = `localStorage.setItem('tideline.checkinPromptAt', JSON.stringify(Date.now()));
{ const d = new Date(); const m = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7) - 7); localStorage.setItem('tideline.weeklyReport.seenWeek', JSON.stringify(m.getFullYear() + '-' + String(m.getMonth() + 1).padStart(2, '0') + '-' + String(m.getDate()).padStart(2, '0'))); }`;
const PREMIUM = seed('.overhaul/v-premium-seed.js') + '\n' + GATES;
const FREE = PREMIUM.replace('premium: true', 'premium: false');
const CONF = seed('.overhaul/f-pw-confirmed-seed.js');
const TAIL = seed('.overhaul/tail-session-seed.js');
const SUB = seed('.overhaul/f-pw-sub-dated.js') + '\n' + GATES;
const drive = (f) => fs.readFileSync(f, 'utf8').split('\n').filter((l) => !l.startsWith('//')).join('\n');
// the tallest vertical scroller in view, to its end
const END = 'const n=[...document.querySelectorAll("div")].filter(d=>d.scrollHeight>d.clientHeight+8&&/(auto|scroll)/.test(getComputedStyle(d).overflowY)&&d.getBoundingClientRect().left>-1&&d.getBoundingClientRect().right<innerWidth+1).sort((a,b)=>b.clientHeight-a.clientHeight)[0]; if(n){n.scrollTop=n.scrollHeight; await __sleep(500)}';
const SHOTS = [
  ['reminders', '/reminders', PREMIUM],
  ['reminders-end', '/reminders', PREMIUM, END],
  ['primer', '/notify-primer', PREMIUM],
  ['primer-end', '/notify-primer', PREMIUM, END],
  ['pw-monthly', '/paywall', PREMIUM, "await tap('Monthly, $12.99/month'); await __sleep(500)"],
  ['pw-funnel', '/welcome?step=paywall', TAIL],
  ['paysheet-trial', '/paywall', CONF, "await tap('Close'); await waitFor('Before you go'); await tap('Start free trial'); await waitFor('Due today'); await __sleep(600)"],
  ['paysheet-year', '/paywall', CONF, "await tap('Continue'); await waitFor('Due today'); await __sleep(600)"],
  ['confirmed-year', '/paywall', CONF, drive('.overhaul/drives/pw-confirmed.js') + '; await __sleep(500)'],
  ['sub-free', '/subscription', FREE],
  ['sub-free-end', '/subscription', FREE, END],
  ['night-settings', '/routines/night-time?from=settings', PREMIUM],
  ['morning-daysoff', '/routines/morning-time', PREMIUM, "await tap('Monday'); await tap('Wednesday'); await tap('Saturday'); await __sleep(400)" ],
];
const SIZES = (flags.sizes ?? '393x852,375x667,390x844,430x932').split(',').map((s) => s.split('x').map(Number));
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage'] });
for (const [name, route, s, act] of SHOTS) {
  if (only && !name.includes(only)) continue;
  for (const [w, h] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await ctx.addInitScript(() => { const add = () => { const st = document.createElement('style'); st.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(st); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add(); });
    await ctx.addInitScript(`try { ${s} } catch (e) {}`);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.log(`  [pageerror] ${name}: ${e.message}`));
    await page.goto('http://localhost:8096' + route, { waitUntil: 'networkidle' }).catch(() => {});
    await page.evaluate(DRIVE);
    await page.waitForTimeout(1600);
    if (act) { try { await page.evaluate(`(async () => { ${act} })()`); } catch (e) { console.log(`  drive ${name}: ${e.message}`); } }
    await page.evaluate(() => document.fonts.ready);
    // the laurel is an <img>: wait for every image to decode before the shot
    await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? null : i.decode().catch(() => null)))));
    await page.waitForTimeout(500);
    const f = `${out}/${name}@${w}x${h}.png`;
    await page.screenshot({ path: f });
    console.log(f);
    await ctx.close();
  }
}
await browser.close();
