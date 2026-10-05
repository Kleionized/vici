const log = [];
const url = () => location.pathname + location.search;
const ls = (k) => localStorage.getItem(k);
await __sleep(800);
log.push(['start', url(), 'postdone=' + ls('tideline.post.backondeck.delivered'), __txt().slice(0, 60)]);
await tap('Tonight'); await __sleep(1500);
log.push(['after Tonight', url(), 'postdone=' + ls('tideline.post.backondeck.delivered')]);
console.error("LOG " + JSON.stringify(log)); return 1;
