// letter: Tonight, then (re-open) X, then Close on read; pending set beforehand
const log = [];
const url = () => location.pathname + location.search;
const ls = (k) => localStorage.getItem(k);
const step = async (name, fn, wait = 1300) => { try { await fn(); await __sleep(wait); log.push([name, url(), __txt().slice(0, 140)]); } catch (e) { log.push([name, 'ERR ' + e.message.slice(0, 200)]); } };
await __sleep(800);
log.push(['start', url(), 'pending=' + ls('tideline.letter.pending')]);
await step('Tonight', () => tap('Tonight'), 1800);
log.push(['after tonight', 'pending=' + ls('tideline.letter.pending'), 'day3=' + ls('tideline.letter.day3')]);
console.error("LOG " + JSON.stringify(log)); return 1;
