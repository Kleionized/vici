/* GROUP slip — 98D's gate and toggles, the event write, 98E's rows, 98F's exit to the hub. */
const log = (s) => console.error('EX ' + s);
const ev = () => JSON.parse(localStorage.getItem('tideline.mock.userdata.slip-seed-user')).events.map((e) => e.type + ':' + (e.trigger ?? '-') + '@' + new Date(e.createdAt).toString().slice(4, 21));
await tap('Log the slip'); await tap('Continue'); await tap('Yesterday'); await tap('Continue');
const cont = () => [...document.querySelectorAll('[role="button"]')].find((b) => b.textContent.trim() === 'Continue');
log('fed disabled=' + cont().getAttribute('aria-disabled'));
await tap('Continue');
log('after tap on disabled: ' + __txt().slice(0, 14));
await tap('Bored'); await tap('Stressed'); await tap('Bored');
log('picked=' + [...document.querySelectorAll('[role="checkbox"][aria-checked="true"]')].map((e) => e.textContent.trim()) + ' disabled=' + cont().getAttribute('aria-disabled'));
await tap('Argument');
await tap('Continue', { wait: 800 });
log('logged: ' + __txt().slice(0, 260));
log('events: ' + JSON.stringify(ev()));
log('letter pending: ' + localStorage.getItem('tideline.letter.pending'));
await tap('Continue');
await tap('I’m already watching again'); await tap('Continue', { wait: 1500 });
log('watching -> ' + location.pathname + ' :: ' + __txt().slice(0, 50));
return 'done';
