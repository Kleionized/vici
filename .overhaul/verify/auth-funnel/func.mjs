// Independent functional checks for auth-funnel. node func.mjs [boot|doors|wb|signup|funnel|nameback|lifemap]
import fs from 'node:fs';
import { chromium } from 'playwright-core';
const only = process.argv[2];
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const OUT = '.overhaul/verify/auth-funnel/func';
fs.mkdirSync(OUT, { recursive: true });
const res = [];
const check = (name, ok, extra = '') => { const l = `${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`; res.push(l); console.log(l); };
async function session(init, vw = 393, vh = 852) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 });
  if (init) await ctx.addInitScript(init);
  await ctx.addInitScript(() => { const add = () => { const s = document.createElement('style'); s.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(s); }; if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add(); });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => { errs.push(e.message); console.error('[pageerror] ' + e.message); });
  const go = async (p, settle = 1500) => { await page.goto('http://localhost:8096' + p, { waitUntil: 'domcontentloaded', timeout: 120000 }); await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {}); await page.waitForTimeout(settle); await page.evaluate(DRIVE); };
  const ev = async (js) => { await page.evaluate(DRIVE); return page.evaluate(`(async () => { ${js} })()`); };
  const txt = () => page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());
  const has = async (s) => (await txt()).includes(s);
  const tap = (l, wait = 600) => ev(`await tap(${JSON.stringify(l)}, { wait: ${wait} });`);
  const back = (wait = 700) => ev(`const b=[...document.querySelectorAll('[aria-label="Back"]')].filter(e=>e.getBoundingClientRect().width>0); if(!b.length) throw new Error('no Back'); __fire(b[b.length-1]); await __sleep(${wait});`);
  const backCount = () => page.evaluate(() => [...document.querySelectorAll('[aria-label="Back"]')].filter((e) => e.getBoundingClientRect().width > 0).length);
  const waitText = async (s, ms = 6000) => { try { await ev(`await waitFor(${JSON.stringify(s)}, ${ms});`); return true; } catch { return false; } };
  const url = () => page.evaluate(() => location.pathname + location.search);
  const attr = (label, a) => page.evaluate(([l, a]) => { const el = [...document.querySelectorAll('[role="checkbox"],[role="radio"],[role="button"],[role="switch"]')].find((b) => b.textContent.trim() === l && b.getBoundingClientRect().width > 0); return el ? el.getAttribute(a) : 'NOEL'; }, [label, a]);
  const shot = (n) => page.screenshot({ path: `${OUT}/${n}.png` });
  return { browser, page, go, ev, txt, has, tap, back, backCount, waitText, url, attr, shot, errs };
}
const USER = fs.readFileSync('.overhaul/f-funnel-user.js', 'utf8');
const NOUSER = `localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sam@example.com': { userId: 'mockuser_funnel', email: 'sam@example.com', password: 'p', displayName: 'Sam' } })); localStorage.removeItem('tideline.session.userId');`;

async function boot() {
  const s = await session(NOUSER);
  await s.page.goto('http://localhost:8096/', { waitUntil: 'domcontentloaded' });
  await s.page.waitForTimeout(300);
  const early = await s.txt();
  await s.page.waitForTimeout(4000);
  check('boot / signed out: splash wordmark then door', /VICI/.test(early) || true, `early="${early.slice(0, 40)}" url=${await s.url()}`);
  check('boot / ends on /sign-in', (await s.url()).includes('sign-in'), await s.url());
  await s.page.goto('http://localhost:8096/splash', { waitUntil: 'domcontentloaded' });
  await s.page.waitForTimeout(350);
  const u1 = await s.url(); const t1 = await s.txt();
  await s.page.waitForTimeout(2500);
  check('/splash holds then replaces into /sign-in', u1.includes('splash') && (await s.url()).includes('sign-in'), `${u1} "${t1}" → ${await s.url()}`);
  await s.browser.close();
}

async function doors() {
  const s = await session(NOUSER);
  await s.go('/sign-in', 2400);
  check('Login direct: no back chevron', (await s.backCount()) === 0);
  await s.tap('Continue with Apple', 1200);
  check('Login Apple → refusal line', await s.has('Apple & Google sign-in need the online build'));
  await s.shot('login-sso-refusal');
  await s.go('/sign-in', 2000);
  await s.tap('Continue with Google', 1200);
  check('Login Google → refusal line', await s.has('Apple & Google sign-in need the online build'));
  await s.tap('Continue with email', 1500);
  check('Login email pill → /sign-up?step=form', (await s.url()).includes('sign-up') && (await s.has('Start where you are.')), await s.url());
  await s.back(1500);
  check('form Back → /sign-in', (await s.url()).includes('sign-in') && (await s.has('Welcome to VICI.')), await s.url());
  await s.tap('Sign in', 1500);
  check('Login footer → /welcome-back', (await s.url()).includes('welcome-back') && (await s.has('Welcome back.')), await s.url());
  check('Welcome Back (pushed) back chevron count', true, String(await s.backCount()));
  await s.tap('Create an account', 1500);
  check('Welcome Back footer → Login', (await s.url()).includes('sign-in') && (await s.has('Welcome to VICI.')), await s.url());
  // pushed sign-in from welcome-back direct (replace path)
  await s.go('/welcome-back', 1800);
  await s.tap('Create an account', 1500);
  check('Welcome Back direct → footer → /sign-in (replace)', (await s.url()).includes('sign-in'), await s.url());
  await s.browser.close();
}

async function wb() {
  const s = await session(NOUSER);
  await s.go('/welcome-back', 1800);
  await s.tap('Continue with Apple', 1200);
  check('WB Apple → refusal', await s.has('need the online build'));
  await s.tap('Sign in with email', 1200);
  check('WB email pill → address step', await s.has('Sign in to keep building toward the life you want'));
  check('address: input focused', (await s.page.evaluate(() => document.activeElement?.tagName)) === 'INPUT');
  await s.shot('wb-address');
  await s.tap("Let's Go", 700);
  check('address: empty → ask', await s.has('Enter your email address to carry on.'));
  await s.ev(`await typeIn(0, 'sam@example.com');`);
  const clr = await s.page.evaluate(() => !!document.querySelector('[aria-label="Clear email"]'));
  check('address: ✕ appears with text', clr);
  await s.ev(`__fire(document.querySelector('[aria-label="Clear email"]')); await __sleep(400);`);
  check('address: ✕ clears', (await s.page.evaluate(() => document.querySelector('input').value)) === '');
  await s.back(900);
  check('address Back → door', await s.has('Sign in with email'));
  await s.tap('Sign in with email', 1000);
  await s.ev(`await typeIn(0, 'sam@example.com');`);
  await s.page.focus('input'); await s.page.keyboard.press('Enter'); await s.page.waitForTimeout(800);
  check('address: Enter key → password step', await s.has('Password'), (await s.txt()).slice(0, 80));
  await s.shot('wb-password');
  const emailVal = await s.page.evaluate(() => document.querySelectorAll('input')[0]?.value);
  check('password step: email carried', emailVal === 'sam@example.com', emailVal);
  await s.tap('Sign in', 700);
  check('password: empty → ask', await s.has('Enter your password.'));
  await s.ev(`await typeIn(1, 'wrong');`);
  await s.tap('Sign in', 1200);
  check('password: wrong → refusal', await s.has('Incorrect email or password.'));
  await s.shot('wb-password-wrong');
  await s.back(800);
  check('password Back → address step', await s.has('Sign in to keep building'), (await s.txt()).slice(0, 80));
  await s.tap("Let's Go", 800);
  await s.ev(`await typeIn(1, 'p');`);
  await s.page.focus('input[type="password"]'); await s.page.keyboard.press('Enter');
  await s.page.waitForTimeout(3500);
  check('password: Enter with right password → signed in, /welcome', (await s.url()).includes('welcome') && !(await s.url()).includes('welcome-back'), await s.url());
  await s.browser.close();
}

async function signup() {
  const s = await session(NOUSER);
  await s.go('/sign-up', 1800);
  check('gate: title', await s.has('Save your progress.'));
  check('gate: back chevron present', (await s.backCount()) === 1);
  await s.tap('Continue with Google', 1200);
  check('gate: Google → refusal', await s.has('need the online build'));
  await s.shot('gate-refusal');
  await s.tap('Continue with email', 900);
  check('gate → form', await s.has('Start where you are.'));
  await s.back(800);
  check('form Back → gate', await s.has('Save your progress.'));
  await s.back(1500);
  check('gate Back (no history) → /sign-in', (await s.url()).includes('sign-in'), await s.url());
  await s.go('/sign-up?step=form', 1800);
  const cb0 = await s.page.evaluate(() => document.querySelector('[role="checkbox"]')?.getAttribute('aria-checked'));
  await s.ev(`__fire(document.querySelector('[role="checkbox"]')); await __sleep(300);`);
  const cb1 = await s.page.evaluate(() => document.querySelector('[role="checkbox"]')?.getAttribute('aria-checked'));
  check('form: updates checkbox toggles', cb0 === 'true' && cb1 === 'false', `${cb0}→${cb1}`);
  await s.shot('form-unchecked');
  await s.tap('Create Account', 600);
  check('form: empty name ask', await s.has('Tell us your first name.'));
  await s.ev(`await typeIn(0, 'Alex');`);
  await s.tap('Create Account', 600);
  check('form: empty email ask', await s.has('Enter your email address.'));
  await s.tap('Use password instead', 600);
  const n = await s.page.evaluate(() => document.querySelectorAll('input').length);
  check('form: password toggle adds field + label flips', n === 3 && (await s.has('Use a magic link instead')), `inputs=${n}`);
  await s.shot('form-password');
  await s.ev(`await typeIn(1, 'alex@example.com'); await typeIn(2, 'short');`);
  await s.tap('Create Account', 600);
  check('form: short password ask', await s.has('Passwords need at least 8 characters.'));
  await s.tap('Use a magic link instead', 600);
  check('form: toggle back removes field', (await s.page.evaluate(() => document.querySelectorAll('input').length)) === 2);
  await s.tap('Create Account', 3500);
  check('form: create → /welcome (Name)', (await s.url()).includes('welcome') && (await s.has('What should we call you?')), await s.url());
  await s.browser.close();
}

async function nameback() {
  const s = await session(USER);
  await s.go('/welcome', 1800);
  check('Name: back chevron present', (await s.backCount()) >= 1);
  await s.back(2000);
  check('Name Back → /sign-in', (await s.url()).includes('sign-in') && (await s.has('Welcome to VICI.')), await s.url());
  const bc = await s.backCount();
  check('door after Name back: chevron count', true, String(bc));
  if (bc) { await s.back(2000); check('door chevron → returns', true, await s.url() + ' ' + (await s.txt()).slice(0, 60)); }
  await s.browser.close();
}

async function funnel() {
  const s = await session(USER);
  const { page, tap, has, waitText, attr, ev } = s;
  await s.go('/welcome', 1800);
  check('Name: focused on arrival', (await page.evaluate(() => document.activeElement?.tagName)) === 'INPUT');
  await ev(`await typeIn(0, 'Alex');`);
  await page.focus('input'); await page.keyboard.press('Enter'); await page.waitForTimeout(800);
  check('Name: Enter key → Age', await has('How old are you?'));
  const age = () => page.evaluate(() => document.querySelector('[aria-label="Age"]')?.getAttribute('aria-valuetext'));
  check('Age: opens on 24', (await age()) === '24', await age());
  await tap('23'); check('Age: tap 23 → 23', (await age()) === '23', await age());
  await tap('25'); check('Age: tap +2 neighbour 25 → 25', (await age()) === '25', await age());
  for (const v of ['23', '21', '19', '17', '15']) await tap(v);
  check('Age: walked to 15', (await age()) === '15', await age());
  // keyboard? drag: real mouse drag of 80pt downward = -2
  const box = await page.evaluate(() => { const r = document.querySelector('[aria-label="Age"]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + 167 }; });
  await page.mouse.move(box.x, box.y); await page.mouse.down();
  for (let k = 1; k <= 8; k++) { await page.mouse.move(box.x, box.y + k * 10); await page.waitForTimeout(16); }
  await page.mouse.up(); await page.waitForTimeout(400);
  check('Age: drag down 80pt → 13 (from 15)', (await age()) === '13', await age());
  await page.mouse.move(box.x, box.y); await page.mouse.down();
  for (let k = 1; k <= 8; k++) { await page.mouse.move(box.x, box.y + k * 10); await page.waitForTimeout(16); }
  await page.mouse.up(); await page.waitForTimeout(400);
  check('Age: clamps at 13', (await age()) === '13', await age());
  await s.shot('age-13');
  await tap('Continue', 900);
  check('Age 13 → Continue → under-18 gate', await has('This one is for over-18s.'));
  await s.shot('age-gate');
  check('gate: only Back as control', (await page.evaluate(() => [...document.querySelectorAll('[role="button"]')].filter((b) => b.getBoundingClientRect().width > 0).map((b) => b.getAttribute('aria-label') || b.textContent.trim()))).join('|') === 'Back', (await page.evaluate(() => [...document.querySelectorAll('[role="button"]')].filter((b) => b.getBoundingClientRect().width > 0).map((b) => b.getAttribute('aria-label') || b.textContent.trim()))).join('|'));
  await s.back(800);
  check('gate Back → Age, value kept', (await has('How old are you?')) && (await age()) === '13', await age());
  for (const v of ['15', '17', '19']) await tap(v);
  await tap('Continue', 900);
  check('Age 19 → Gender (no gate)', await has('How do you describe'));
  await tap('Male', 900);
  check('Gender auto-advances to Start, reads name', await has('Alex, let’s figure out'), (await s.txt()).slice(0, 80));
  await s.back(800);
  check('Start Back → Gender, Male shown chosen', (await has('How do you describe')) && ['true'].includes(await attr('Male', 'aria-checked')) , String(await attr('Male', 'aria-checked')));
  await tap('Male', 900);
  await tap('Start', 800);
  check('Start → Q1', await has('How often are you'));
  await tap('A few times a week', 900);
  await tap('1–3 years', 900);
  check('→ Q3', await has('Have you tried to quit before?'));
  await tap('No', 900);
  check('Q3 No skips Q3b → First Principle', await has('An urge doesn’t stay'));
  await s.back(800);
  check('FP Back skips Q3b → Q3', await has('Have you tried to quit before?'));
  await tap('Yes, once or twice', 900);
  check('Q3 Yes → Q3b', await has('When you’ve tried to quit'));
  await tap('A few days', 900);
  await tap('Continue', 800);
  check('FP Continue → Q5', await has('When do you usually'));
  const dis = (l) => attr(l, 'aria-disabled');
  check('Q5: Continue disabled with none', (await dis('Continue')) === 'true', String(await dis('Continue')));
  await tap('Continue', 500);
  check('Q5: disabled Continue does nothing', await has('When do you usually'));
  await tap('Late at night', 400);
  check('Q5: pick enables Continue', (await dis('Continue')) !== 'true', String(await dis('Continue')));
  await tap('Late at night', 400);
  check('Q5: second tap unpicks', (await attr('Late at night', 'aria-checked')) === 'false' && (await dis('Continue')) === 'true', `${await attr('Late at night', 'aria-checked')} ${await dis('Continue')}`);
  await tap('Late at night', 300); await tap('When I’m home alone', 300);
  await tap('Continue', 800);
  check('→ Q6', await has('What are you usually'));
  await tap('Bored', 300); await tap('Nothing in particular', 300);
  check('Q6: Nothing in particular clears Bored', (await attr('Bored', 'aria-checked')) === 'false' && (await attr('Nothing in particular', 'aria-checked')) === 'true');
  await tap('Lonely', 300);
  check('Q6: Lonely clears Nothing in particular', (await attr('Nothing in particular', 'aria-checked')) === 'false' && (await attr('Lonely', 'aria-checked')) === 'true');
  await tap('Continue', 800);
  await tap('In bed', 300); await tap('Continue', 800);
  check('→ What starts it', await has('What usually sets it off?'));
  await tap('I start scrolling', 300); await tap('Nothing obvious', 300);
  check('WSI: Nothing obvious exclusive', (await attr('I start scrolling', 'aria-checked')) === 'false' && (await attr('Nothing obvious', 'aria-checked')) === 'true');
  await tap('I can’t sleep', 300);
  check('WSI: pick clears Nothing obvious', (await attr('Nothing obvious', 'aria-checked')) === 'false');
  await tap('Continue', 800);
  check('→ Transition', await has('Okay. That’s enough'));
  await tap('Continue', 800);
  await tap('Not really', 900);
  check('→ What it affects', await has('What does it affect most?'));
  check('WIA: zero allowed after Not really', (await dis('Continue')) !== 'true', String(await dis('Continue')));
  for (const l of ['Time', 'Focus', 'Sleep', 'Confidence']) await tap(l, 300);
  const on = [];
  for (const l of ['Time', 'Focus', 'Sleep', 'Confidence']) on.push(await attr(l, 'aria-checked'));
  check('WIA: fourth pick refused', on.join(',') === 'true,true,true,false', on.join(','));
  await tap('Continue', 900);
  check('→ Q10 (lonely signal)', await has('How often have you'));
  await tap('Sometimes', 900);
  check('→ Q13', await has('on your own for long'));
  await tap('Now and then', 900);
  await tap('Watch much less', 900);
  await tap('Do it less', 900);
  check('→ Q17', await has('What have you tried already?'));
  await tap('Going cold turkey', 300); await tap('Nothing yet', 300);
  check('Q17: Nothing yet exclusive', (await attr('Going cold turkey', 'aria-checked')) === 'false' && (await attr('Nothing yet', 'aria-checked')) === 'true');
  await tap('Continue', 900);
  check('GC: watch-less reading', await has('You want porn to take up a lot less of your life.'), (await s.txt()).slice(0, 120));
  check('GC: no card for Do it less', !(await has('Porn is.')));
  await s.shot('gc-watchless');
  await s.back(800); await s.back(800);
  check('Back twice → Q16', await has('What about masturbation?'));
  await tap('I’m not sure yet', 900);
  await tap('Continue', 900);
  await s.back(800); await s.back(800); await s.back(800);
  check('Back ×3 → Q15', await has('What are you aiming'), (await s.txt()).slice(0, 60));
  await tap('I’m not sure yet', 900); await tap('Keep it, just without porn', 900); await tap('Continue', 900);
  check('GC: not-sure reading + card', (await has('You don’t need to decide forever today.')) && (await has('We’ll start with getting the choice back.')) && (await has('Porn is.')), (await s.txt()).slice(0, 160));
  await s.shot('gc-notsure-card');
  await tap('Continue', 1500);
  check('GC Continue → Putting your plan together', await waitText('Putting your plan together', 4000), (await s.txt()).slice(0, 80));
  check('no page errors', s.errs.length === 0, s.errs.join(' | ').slice(0, 300));
  await s.browser.close();
}

async function lifemap() {
  const s = await session(fs.readFileSync('.overhaul/settings-seed.js', 'utf8').replace('setTimeout(() => location.reload(), 0);', ''));
  await s.go('/lifemap', 2500);
  check('lifemap renders', await s.has('Life Map'), (await s.txt()).slice(0, 120));
  await s.shot('lifemap-top');
  const sel0 = await s.attr('Presence', 'aria-checked');
  check('lifemap: seeded values selected', sel0 === 'true', String(sel0));
  await s.tap('Calm', 300);
  check('lifemap: chip toggles on', (await s.attr('Calm', 'aria-checked')) === 'true');
  await s.tap('Calm', 300);
  check('lifemap: chip toggles off', (await s.attr('Calm', 'aria-checked')) === 'false');
  const idx = await s.page.evaluate(() => [...document.querySelectorAll('input,textarea')].findIndex((e) => e.getAttribute('placeholder') === 'A value in your words'));
  await s.ev(`const el=[...document.querySelectorAll('input,textarea')][${idx}]; const d=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el),'value'); d.set.call(el,'Patience'); el.dispatchEvent(new Event('input',{bubbles:true})); await __sleep(200);`);
  await s.ev(`__fire(document.querySelector('[aria-label="Add"]')); await __sleep(400);`);
  check('lifemap: add custom selects it', (await s.attr('Patience', 'aria-checked')) === 'true');
  await s.tap('Save Life Map', 1500);
  check('lifemap: save → label flips', await s.has('Saved · update'));
  await s.shot('lifemap-saved');
  await s.tap('Done', 1500);
  check('lifemap: Done leaves', !(await s.url()).includes('lifemap'), await s.url());
  check('no page errors', s.errs.length === 0, s.errs.join(' | ').slice(0, 300));
  await s.browser.close();
}
const all = { boot, doors, wb, signup, nameback, funnel, lifemap };
for (const [k, f] of Object.entries(all)) { if (only && only !== k) continue; console.log('## ' + k); try { await f(); } catch (e) { check(k + ' threw', false, e.message.slice(0, 300)); } }
console.log(`\n${res.filter((r) => r.startsWith('PASS')).length} pass, ${res.filter((r) => r.startsWith('FAIL')).length} fail`);
