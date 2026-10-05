/* Walk the funnel to one of the five plan boards, stopping ON the board named
   in `window.__T`. GROUP `plan`.

   This group had been driving with `.vicifull/drives/tail-walk.js`, which the
   `tail` group rewrote mid-run: its stop table now carries only the eight tail
   boards and drives straight *through* `27`–`31`, so every `plan` recipe that
   named it walked past its own target and died in the handover. A recipe that
   depends on another group's driver is a recipe that stops reproducing without
   warning, so the walk lives here now. Its funnel answers are deliberately the
   same ones — they are what `27`–`31` are drawn for.

   Same state-machine shape as tail-walk, and for the same reason: this is a
   ~55s drive, several agents capture at once, and Metro rebuilding under
   another agent's edit reloads the page mid-walk. Each tick reads the page,
   works out which board is up from a string only that board draws, does that
   board's whole action, and stops the moment __T's own board appears. */

const TARGET = String(window.__T || 'whered-start');

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

/* `11 · When` is answered with the canvas's own reading. It must pick BOTH
   `Late at night` and `When I’m home alone`: the first is what `27` reads back
   into its chips, the second is what makes `18 · Loneliness` and `19 · Time
   alone` appear at all (D077) — drop it without also dropping those two rows
   and the walk dies on "Sometimes". `window.__WHEN` overrides the pair for the
   chip-width state (D092); `__W12`/`__W18`/`__W19` follow it. */
const WHEN = window.__WHEN || ['Late at night', 'When I’m home alone'];

const BOARDS = [
  ['What should we call you?',                     async () => { await type(0, 'Sam'); await tap('Continue'); }],
  ['How old are you?',                             async () => { await type(0, '24'); await tap('Continue'); }],
  ['How do you describe your gender?',             async () => { await tap('Male'); await tap('Continue'); }],
  ['what usually leads you back to porn',          async () => { await tap('Start'); }],
  ['How often are you watching porn right now?',   async () => { await tap('A few times a week'); }],
  ['How long have you wanted to quit or cut down?', async () => { await tap('1–3 years'); }],
  ['Have you tried to quit before?',               async () => { await tap('Yes, once or twice'); }],
  ['how long do you usually make it',              async () => { await tap('A few days'); }],
  ['An urge doesn’t stay at its worst',            async () => { await tap('Continue'); }],
  ['When do you usually end up watching?',         async () => { for (const w of WHEN) await tap(w); await tap('Continue'); }],
  ['What are you usually feeling right before?',   async () => { await tap('Bored'); await tap('Continue'); }],
  ['Where are you usually watching?',              async () => { await tap('In bed'); await tap('Continue'); }],
  ['What usually sets it off?',                    async () => { await tap('I start scrolling'); await tap('Continue'); }],
  ['enough to see where things usually start',     async () => { await tap('Continue'); }],
  ['How much is porn getting in the way',          async () => { await tap('Quite a bit'); }],
  ['What does it affect most?',                    async () => { await tap('Focus'); await tap('Continue'); }],
  // 18 and 19 are conditional on the home-alone signal; when __WHEN drops it
  // they never appear and these two rows are simply never matched.
  ['How often have you felt lonely lately?',       async () => { await tap('Sometimes'); }],
  ['How often are you on your own for long stretches?', async () => { await tap('Now and then'); }],
  ['What are you aiming for with porn?',           async () => { await tap('Stop completely'); }],
  ['What about masturbation?',                     async () => { await tap('Keep it, just without porn'); }],
  ['What have you tried already?',                 async () => { await tap('Blocking sites or apps'); await tap('Continue'); }],
  ['You want to stop.',                            async () => { await tap('Continue'); }],
  // `26 · Enlisting Aegis` hands over on its own after ~6.8s; nothing to tap.
  ['Putting your plan together',                   async () => { await window.__sleep(1000); }],
];

/* The five boards of this group, each by a string only it draws. The walk
   stops ON the target rather than acting on it. `28` and `30` are matched on a
   fragment, because `Choose another` swaps their headings (D054) while the
   board is still `28`; `29` and `31` on a run they always draw. */
const PLAN = [
  ['whered-start',  'this is where we’d start',                'Continue'],
  ['start-here',    'Choose another',                          'I can do that'],
  ['start-here-1',  'Tonight, before',                         'Next'],
  ['start-here-2',  'One change tonight. Build from there.',    'Continue'],
  ['your-plan',     'Your plan',                               'Continue'],
];

const DEADLINE = Date.now() + 150000;
let last = '';
let idle = 0;
for (;;) {
  if (Date.now() > DEADLINE) throw new Error('f-plan-walk timed out on :: ' + window.__txt().slice(0, 200));
  const txt = window.__txt();

  const hit = PLAN.find(([, needle]) => txt.includes(needle));
  if (hit) {
    if (hit[0] === TARGET) break;
    await tap(hit[2]);
    last = txt; idle = 0;
    continue;
  }

  const board = BOARDS.find(([needle]) => txt.includes(needle));
  if (board) { await board[1](); last = txt; idle = 0; continue; }

  await window.__sleep(250);
  if (txt === last && ++idle > 40) throw new Error('f-plan-walk stuck on :: ' + txt.slice(0, 200));
  last = txt;
}
if (window.__AFTER) await (new Function('t', 'return (async () => { ' + window.__AFTER + ' })()'))(tap);
return window.__txt().slice(0, 240);
