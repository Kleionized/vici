await tap('Already have an account? Sign in');
await __sleep(1400);
const gs = [...document.querySelectorAll('radialGradient')];
const ids = gs.map(g => g.id);
const hidden = gs.filter(g => { let n = g; while (n) { if (n.style && n.style.display === 'none') return true; n = n.parentElement; } return false; }).map(g => g.id);
const refs = [...document.querySelectorAll('ellipse')].map(e => e.getAttribute('fill'));
const visibleRefs = [...document.querySelectorAll('ellipse')].filter(e => { let n = e; while (n) { if (n.style && n.style.display === 'none') return false; n = n.parentElement; } return true; }).map(e => e.getAttribute('fill'));
return { n: gs.length, distinct: new Set(ids).size, ids, hiddenIds: hidden, visibleEllipseFills: visibleRefs, allEllipseFills: refs };
