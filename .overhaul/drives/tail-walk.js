/* Walk the whole funnel, the plan sub-flow and the tail, stopping ON the board
   named in `window.__T`. GROUP `tail`.

   Written as a state machine rather than a fixed script, and that is not
   over-engineering — it is what two failures taught:

   * a fixed list of taps with a flat 420ms wait held when the walk had the
     machine to itself and raced the moment several agents were capturing at
     once (`audit.mjs` died on step 13 with `no control for "In bed"` while the
     Age board was still up); and
   * waiting for each control fixed that and exposed the real hazard — this is
     the longest drive in the run at ~55s, and Metro rebuilding under another
     agent's edit reloads the page mid-walk and drops it back to an early
     funnel board. A script that counts steps cannot recover from that.

   So each tick reads the page, works out which board is up from a string only
   that board draws, does that board's whole action, and waits for the text to
   change. A reload costs the walk time and nothing else, a board it has
   already answered is simply answered again, and it stops the moment __T's own
   headline appears. */

const TARGET = String(window.__T || 'starting-point');

/** Tap a control, waiting up to `ms` for it to exist. */
const tap = async (label, ms = 6000) => {
  const t0 = Date.now();
  for (;;) {
    const all = window.__btns();
    const el =
      all.find((b) => b.textContent.trim() === label) ||
      all.find((b) => (b.getAttribute('aria-label') || '') === label) ||
      all.find((b) => b.textContent.trim().includes(label));
    if (el) { window.__fire(el); await window.__sleep(420); return true; }
    if (Date.now() - t0 > ms) throw new Error('never saw control ' + JSON.stringify(label) + ' :: ' + window.__txt().slice(0, 200));
    await window.__sleep(90);
  }
};

const type = async (n, v, ms = 6000) => {
  const t0 = Date.now();
  while (!document.querySelectorAll('input')[n]) {
    if (Date.now() - t0 > ms) throw new Error('never saw input #' + n);
    await window.__sleep(90);
  }
  await window.typeIn(n, v);
};

/* Each board: a string only it draws, and what to do on it. The single-select
   boards turn themselves over 260ms after the tap and take no Continue. */
const BOARDS = [
  ['What should we call you?',                    async () => { await type(0, 'Sam'); await tap('Continue'); }],
  // `04 · Age` is a wheel that opens on 24 (the frame's own) — nothing to type
  ['How old are you?',                            async () => { if (document.querySelector('input')) await type(0, '24'); await tap('Continue'); }],
  // `05 · Gender` turns itself over (D324); a build that still draws Continue gets it tapped
  ['How do you describe your gender?',             async () => { await tap('Male'); await window.__sleep(600); if (window.__txt().includes('How do you describe your gender?')) await tap('Continue', 1500).catch(() => {}); }],
  ['what usually leads you back to porn',          async () => { await tap('Start'); }],
  ['How often are you watching porn right now?',   async () => { await tap('A few times a week'); }],
  ['How long have you wanted to quit or cut down?', async () => { await tap('1–3 years'); }],
  ['Have you tried to quit before?',               async () => { await tap('Yes, once or twice'); }],
  ['how long do you usually make it',              async () => { await tap('A few days'); }],
  ['An urge doesn’t stay at its worst',            async () => { await tap('Continue'); }],
  // 11 must pick BOTH `Late at night` and `When I’m home alone`: the first is
  // what `25 · This Is Where We’d Start` reads back, the second is what makes
  // 18 and 19 non-conditional (QUESTIONNAIRE-CHANGES, D077).
  ['When do you usually end up watching?',         async () => { await tap('Late at night'); await tap('When I’m home alone'); await tap('Continue'); }],
  ['What are you usually feeling right before?',   async () => { await tap('Bored'); await tap('Continue'); }],
  ['Where are you usually watching?',              async () => { await tap('In bed'); await tap('Continue'); }],
  ['What usually sets it off?',                    async () => { await tap('I start scrolling'); await tap('Continue'); }],
  ['enough to see where things usually start',     async () => { await tap('Continue'); }],
  ['How much is porn getting in the way',          async () => { await tap('Quite a bit'); }],
  // `34 · What You Want Back` reads these back (CRITIC §5, tail Q5): the frame's trio
  ['What does it affect most?',                    async () => { await tap('Focus'); await tap('Sleep'); await tap('Confidence'); await tap('Continue'); }],
  ['How often have you felt lonely lately?',       async () => { await tap('Sometimes'); }],
  ['How often are you on your own for long stretches?', async () => { await tap('Now and then'); }],
  ['What are you aiming for with porn?',           async () => { await tap('Stop completely'); }],
  ['What about masturbation?',                     async () => { await tap('Keep it, just without porn'); }],
  ['What have you tried already?',                 async () => { await tap('Blocking sites or apps'); await tap('Continue'); }],
  ['You want to stop.',                            async () => { await tap('Continue'); }],
];

/* The plan and the tail, each by a string only it draws, and the control that
   moves it on. The walk stops ON the target rather than acting on it.
   `24 · Build plan` hands over on its own after 6.8s (null: nothing to tap). */
const TAIL = [
  ['plan-together',  'Putting your plan together',              null],
  ['whered-start',   'this is where we’d start',                'Continue'],
  ['start-here',     'Keep your phone out of bed tonight.',     'Continue'],
  ['start-here-1',   'Charge it away from the bed.',            'Next'],
  ['start-here-2',   'Get out of bed before you start scrolling', 'Continue'],
  ['your-plan',      'SOS gets you out first',                  'Continue'],
  ['starting-point', 'Your VICI rating',                        'Next'],
  ['next30',         'This is your next 30 days.',              'Next'],
  ['one-year',       'One year from now.',                      'Next'],
  ['age80',          'By age 80',                               'Next'],
  ['line-nothing',   'The line keeps climbing',                 'Next'],
  ['line-plan',      'With the plan.',                          'Continue'],
  ['clean-day',      'One clean day.',                          'Continue'],
  ['one-bad-day',    'One bad day is one bad day.',             'Continue'],
  ['want-back',      'This is what you’re doing it for.',       'Continue'],
  ['letter-arrived', 'A letter arrived.',                       'Open'],
  ['letter-read',    'Week XII, from',                          'Continue'],
  ['vow',            'The vow.',                                'Sign'],
  ['medallion',      'Your first medallion.',                   'Continue'],
];

const DEADLINE = Date.now() + 150000;
let last = '';
let idle = 0;
for (;;) {
  if (Date.now() > DEADLINE) throw new Error('tail-walk timed out on :: ' + window.__txt().slice(0, 200));
  const txt = window.__txt();

  const hit = TAIL.find(([, needle]) => txt.includes(needle));
  if (hit) {
    if (hit[0] === TARGET) break;
    if (hit[2]) { await tap(hit[2]); last = txt; idle = 0; continue; }
    await window.__sleep(500);
    continue;
  }

  const board = BOARDS.find(([needle]) => txt.includes(needle));
  if (board) { await board[1](); last = txt; idle = 0; continue; }

  // Nothing recognised: a transition, or the bundle reloading. Give it time.
  await window.__sleep(250);
  if (txt === last && ++idle > 40) throw new Error('tail-walk stuck on :: ' + txt.slice(0, 200));
  last = txt;
}
if (window.__AFTER) await (new Function('t', 'return (async () => { ' + window.__AFTER + ' })()'))(tap);
return window.__txt().slice(0, 240);
