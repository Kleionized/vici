#!/usr/bin/env node
/**
 * auth-funnel: exercise every control the group touched, in the running web
 * build, and print what each did. Also saves a PNG of each undrawn state it
 * passes through (`.overhaul/shots/af/func/`).
 *
 *   node .overhaul/af-func.mjs [funnel|doors|signup|welcomeback|nameback]
 */
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const only = process.argv[2];
const DRIVE = fs.readFileSync('.overhaul/drive.js', 'utf8');
const OUT = '.overhaul/shots/af/func';
fs.mkdirSync(OUT, { recursive: true });
const USERS = `localStorage.setItem('tideline.mock.users', JSON.stringify({ 'sam@example.com': { userId: 'mockuser_funnel', email: 'sam@example.com', password: 'p', displayName: 'Sam' } }));`;

const results = [];
const check = (name, ok, extra = '') => {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`);
  console.log(results[results.length - 1]);
};

async function session(init) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--js-flags=--max-old-space-size=256'] });
  const ctx = await browser.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 });
  if (init) await ctx.addInitScript(init);
  await ctx.addInitScript(() => {
    const add = () => { const s = document.createElement('style'); s.textContent = '.__expo_fast_refresh{display:none!important}'; (document.head || document.documentElement).appendChild(s); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add); else add();
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error('[pageerror] ' + e.message));
  const go = async (path) => {
    await page.goto('http://localhost:8096' + path, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.evaluate(DRIVE);
    await page.waitForTimeout(1500);
  };
  const ev = (js) => page.evaluate(`(async () => { ${js} })()`);
  const txt = () => page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());
  const tap = async (label, wait = 520) => { await page.evaluate(DRIVE); await ev(`await tap(${JSON.stringify(label)}, { wait: ${wait} });`); };
  const waitText = async (needle, ms = 8000) => { await page.evaluate(DRIVE); await ev(`await waitFor(${JSON.stringify(needle)}, ${ms});`); };
  const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });
  const checked = (label) =>
    page.evaluate((l) => {
      const el = [...document.querySelectorAll('[role="checkbox"],[role="radio"]')].find((b) => b.textContent.trim() === l);
      return el ? el.getAttribute('aria-checked') : null;
    }, label);
  const disabled = (label) =>
    page.evaluate((l) => {
      const el = [...document.querySelectorAll('[role="button"]')].find((b) => b.textContent.trim() === l);
      return el ? el.getAttribute('aria-disabled') === 'true' : null;
    }, label);
  const ageValue = () => page.evaluate(() => document.querySelector('[aria-label="Age"]')?.getAttribute('aria-valuetext') ?? null);
  return { browser, page, go, ev, txt, tap, waitText, shot, checked, disabled, ageValue };
}

async function funnel() {
  const s = await session(fs.readFileSync('.overhaul/f-funnel-user.js', 'utf8'));
  const { page, go, txt, tap, waitText, shot, checked, disabled, ageValue, ev } = s;
  await go('/welcome');
  check('Name: field focused on arrival', (await page.evaluate(() => document.activeElement?.tagName)) === 'INPUT');
  await ev(`await typeIn(0, 'Alex');`);
  await shot('name-typed');
  await tap('Continue');
  await waitText('How old are you?');
  check('Name → Continue → Age', true);
  check('Age opens on 24', (await ageValue()) === '24');
  await tap('23');
  check('Age: tap the upper neighbour steps down', (await ageValue()) === '23');
  await tap('24');
  check('Age: tap the lower neighbour steps up', (await ageValue()) === '24');
  // a real drag: 120 pt up = three years up
  const box = await page.evaluate(() => { const r = document.querySelector('[aria-label="Age"]').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + 167 }; });
  await page.mouse.move(box.x, box.y);
  await page.mouse.down();
  for (let k = 1; k <= 12; k++) { await page.mouse.move(box.x, box.y - k * 10); await page.waitForTimeout(16); }
  await page.mouse.up();
  await page.waitForTimeout(300);
  check('Age: dragging up 120 pt adds three years', (await ageValue()) === '27', 'value ' + (await ageValue()));
  await shot('age-27');
  for (let k = 0; k < 6; k++) await tap(String(Number(await ageValue()) - 2), 260); // 27 → 15
  // the lower end: 13 is the first age, and nothing is drawn above it
  for (let k = 0; k < 2; k++) await tap(String(Number(await ageValue()) - 1), 260);
  check('Age: stops at 13', (await ageValue()) === '13' && !(await page.evaluate(() => [...document.querySelectorAll('[role="button"]')].some((b) => b.textContent.trim() === '12'))));
  await shot('age-13');
  for (let k = 0; k < 2; k++) await tap(String(Number(await ageValue()) + 1), 260);
  check('Age: down to 15 by taps', (await ageValue()) === '15');
  await tap('Continue');
  await waitText('This one is for over-18s.');
  await shot('age-gate');
  check('Age 15 → Continue → under-18 gate', true);
  await tap('Back');
  await waitText('How old are you?');
  check('Gate → Back → Age, value kept', (await ageValue()) === '15');
  for (let k = 0; k < 13; k++) await tap(String(Number(await ageValue()) + 1), 200); // 15 → 28
  check('Age: up to 28', (await ageValue()) === '28');
  await tap('Continue');
  await waitText('How do you describe your gender?');
  check('Age 28 → Gender (no gate)', true);
  await tap('Female', 900);
  check('Gender auto-advances after a pick', (await txt()).includes('Alex, let’s figure out what usually leads you back to porn.'), 'Start reads the typed name');
  await tap('Start');
  await waitText('How often are you watching porn right now?');
  await tap('About once a day', 900);
  await waitText('How long have you wanted');
  await tap('3–12 months', 900);
  await waitText('Have you tried to quit before?');
  await tap('No', 900);
  check('Q3 “No” skips Q3b to First Principle', (await txt()).includes('An urge doesn’t stay at its worst'));
  await tap('Back', 700);
  check('Back from First Principle → Q3 (Q3b skipped going back too)', (await txt()).includes('Have you tried to quit before?'));
  await tap('No', 900);
  await tap('Continue');
  await waitText('When do you usually end up watching?');
  check('Q5: Continue disabled with nothing chosen', (await disabled('Continue')) === true);
  await tap('Late at night');
  check('Q5: Continue enabled after a pick', (await disabled('Continue')) === false);
  await tap('Late at night');
  check('Q5: a second tap unpicks', (await checked('Late at night')) === 'false');
  await tap('After drinking');
  await tap('Continue');
  await waitText('What are you usually feeling right before?');
  await tap('Bored');
  await tap('Nothing in particular');
  check('Q6: “Nothing in particular” clears the rest', (await checked('Bored')) === 'false' && (await checked('Nothing in particular')) === 'true');
  await tap('Lonely');
  check('Q6: any other pick clears it', (await checked('Nothing in particular')) === 'false' && (await checked('Lonely')) === 'true');
  await tap('Continue');
  await waitText('Where are you usually watching?');
  await tap('At my desk');
  await tap('Continue');
  await waitText('What usually sets it off?');
  await tap('I start scrolling');
  await tap('Nothing obvious');
  check('What starts it: “Nothing obvious” exclusive', (await checked('I start scrolling')) === 'false');
  await tap('Continue');
  await waitText('That’s enough to see');
  await tap('Continue');
  await waitText('How much is porn getting');
  await tap('Not really', 900);
  await waitText('What does it affect most?');
  check('What it affects: zero picks allowed after “Not really”', (await disabled('Continue')) === false);
  for (const l of ['Time', 'Focus', 'Sleep', 'Confidence']) await tap(l);
  check('What it affects: a fourth pick is refused', (await checked('Confidence')) === 'false' && (await checked('Sleep')) === 'true');
  await shot('affects-cap');
  await tap('Continue');
  await waitText('How often have you felt lonely lately?');
  check('Q10 shown on a loneliness signal (Lonely)', true);
  await tap('Often', 900);
  await waitText('on your own for long stretches');
  check('Q13 shown on an alone signal (Often)', true);
  await tap('Rarely', 900);
  await waitText('What are you aiming for with porn?');
  await tap('Watch much less', 900);
  await waitText('What about masturbation?');
  await tap('Do it less', 900);
  await waitText('What have you tried already?');
  await tap('Blocking sites or apps');
  await tap('Nothing yet');
  check('Q17: “Nothing yet” exclusive', (await checked('Blocking sites or apps')) === 'false');
  await tap('Continue');
  await waitText('You want porn to take up a lot less of your life.');
  const t = await txt();
  check('Goal confirmation reads “Watch much less”, no card for “Do it less”', t.includes('That’s what we’ll work toward.') && !t.includes('Porn is.'));
  await shot('gc-variant');
  await tap('Continue');
  await waitText('Putting your plan together', 10000);
  check('Goal confirmation → Continue → the plan (tail)', true);
  await s.browser.close();
}

async function nameback() {
  const s = await session(fs.readFileSync('.overhaul/f-funnel-user.js', 'utf8'));
  await s.go('/sign-in');
  await s.page.goto('http://localhost:8096/welcome', { waitUntil: 'domcontentloaded' });
  await s.page.waitForTimeout(2500);
  await s.waitText('What should we call you?');
  await s.tap('Back', 1500);
  const url = s.page.url();
  check('Name → Back leaves to the door', /sign-in/.test(url), url);
  await s.shot('door-from-name');
  // Name's Back replaces into the door when nothing is behind /welcome (the
  // sign-up path ends in a replace too), so the door has nothing to go back to
  // and must not draw a dead chevron; it draws one only when it was pushed.
  const hasBack = await s.page.evaluate(() => !!document.querySelector('[aria-label="Back"]'));
  check('the door reached by Back (a replace) draws no dead chevron', !hasBack);
  await s.browser.close();
}

async function doors() {
  const s = await session(USERS);
  await s.go('/sign-in');
  await s.tap('Continue with Apple', 900);
  check('Login: Apple → the offline refusal line', (await s.txt()).includes('Apple & Google sign-in need the online build'));
  await s.shot('login-refusal');
  await s.tap('Continue with Google', 900);
  check('Login: Google → the same refusal', (await s.txt()).includes('Apple & Google sign-in need the online build'));
  await s.tap('Sign in', 1500);
  check('Login footer → Welcome Back', (await s.txt()).includes('Welcome back.') && /welcome-back/.test(s.page.url()));
  await s.tap('Create an account', 1500);
  check('Welcome Back footer → back to Login', (await s.txt()).includes('Welcome to VICI.'));
  await s.tap('Continue with email', 1500);
  check('Login email pill → Create account form', /sign-up/.test(s.page.url()) && (await s.txt()).includes('Start where you are.'));
  await s.browser.close();
}

async function signup() {
  const s = await session(USERS);
  await s.go('/sign-up');
  check('sign-up opens on the gate', (await s.txt()).includes('Save your progress.'));
  await s.shot('signup-gate');
  await s.tap('Continue with Apple', 900);
  check('gate: Apple → refusal line', (await s.txt()).includes('Apple & Google sign-in need the online build'));
  await s.shot('signup-gate-refusal');
  await s.tap('Continue with email', 900);
  check('gate → form', (await s.txt()).includes('Start where you are.'));
  await s.shot('signup-form');
  await s.tap('Back', 900);
  check('form → Back → gate', (await s.txt()).includes('Save your progress.'));
  await s.tap('Continue with email', 900);
  check('updates checkbox starts on', (await s.page.evaluate(() => document.querySelector('[role="checkbox"]')?.getAttribute('aria-checked'))) === 'true');
  await s.ev(`await tap('I’d like VICI updates via email.');`).catch(() => s.ev(`await tap("I'd like VICI updates via email.");`));
  check('updates checkbox toggles off', (await s.page.evaluate(() => document.querySelector('[role="checkbox"]')?.getAttribute('aria-checked'))) === 'false');
  await s.tap('Use password instead', 600);
  check('“Use password instead” adds the password field', (await s.txt()).includes('Choose a password') && (await s.txt()).includes('Use a magic link instead'));
  await s.tap('Create Account', 600);
  check('Create Account with nothing typed asks for the name', (await s.txt()).includes('Tell us your first name.'));
  await s.shot('signup-form-error');
  await s.ev(`await typeIn(0, 'Ben'); await typeIn(1, 'ben@example.com'); await typeIn(2, 'short');`);
  await s.tap('Create Account', 600);
  check('a short password is refused', (await s.txt()).includes('Passwords need at least 8 characters.'));
  await s.ev(`await typeIn(2, 'longenough1');`);
  await s.tap('Create Account', 3000);
  check('Create Account → signed in → onboarding', (await s.txt()).includes('What should we call you?'), s.page.url());
  await s.browser.close();
}

async function welcomeback() {
  const s = await session(USERS);
  await s.go('/welcome-back');
  await s.tap('Sign in with email', 900);
  check('Welcome Back email pill → address step', (await s.txt()).includes('Sign in to keep building toward the life you want'));
  check('address step: field focused', (await s.page.evaluate(() => document.activeElement?.tagName)) === 'INPUT');
  await s.tap('Let\'s Go', 600);
  check('address step: empty → the ask', (await s.txt()).includes('Enter your email address to carry on.'));
  await s.shot('wb-address-error');
  await s.ev(`await typeIn(0, 'nobody@example.com');`);
  const clear = await s.page.evaluate(() => !!document.querySelector('[aria-label="Clear email"]'));
  check('address step: clear ✕ appears with text', clear);
  await s.tap('Clear email', 400);
  check('address step: ✕ clears the field', (await s.page.evaluate(() => document.querySelector('input').value)) === '');
  await s.ev(`await typeIn(0, 'sam@example.com');`);
  await s.shot('wb-address');
  await s.tap('Let\'s Go', 900);
  check('address → password step', (await s.txt()).includes('Welcome back.') && (await s.txt()).includes('Password'));
  await s.tap('Sign in', 600);
  check('password step: empty → the ask', (await s.txt()).includes('Enter your password.'));
  await s.shot('wb-password');
  await s.tap('Back', 600);
  check('password → Back → address step', (await s.txt()).includes('Sign in to keep building toward the life you want'));
  await s.tap('Back', 600);
  check('address → Back → the door', (await s.txt()).includes('Sign in to pick up where you left off.'));
  await s.tap('Sign in with email', 900);
  await s.ev(`await typeIn(0, 'sam@example.com');`);
  await s.tap('Let\'s Go', 900);
  await s.ev(`await typeIn(1, 'wrong');`);
  await s.tap('Sign in', 1200);
  const t = await s.txt();
  check('wrong password → refusal line', !t.includes('What should we call you?'), t.slice(0, 160));
  await s.shot('wb-refusal');
  await s.ev(`await typeIn(1, 'p');`);
  await s.tap('Sign in', 3000);
  check('right password → signed in (onboarding or app)', !/welcome-back/.test(s.page.url()), s.page.url());
  await s.browser.close();
}

const runs = { funnel, nameback, doors, signup, welcomeback };
for (const [k, f] of Object.entries(runs)) {
  if (only && only !== k) continue;
  try { await f(); } catch (e) { check(k + ' threw', false, String(e.message).slice(0, 300)); }
}
console.log('\n' + results.filter((r) => r.startsWith('FAIL')).length + ' failed of ' + results.length);
