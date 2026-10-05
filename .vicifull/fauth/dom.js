await tap('Already have an account? Sign in');
await __sleep(1200);
const gs = [...document.querySelectorAll('radialGradient')].map((g) => {
  let n = g, hidden = false;
  while (n && n !== document.body) { const s = n instanceof Element ? getComputedStyle(n) : null; if (s && s.display === 'none') { hidden = true; break; } n = n.parentElement; }
  return g.id + (hidden ? ' [HIDDEN]' : '');
});
const uses = [...document.querySelectorAll('ellipse')].map((e) => e.getAttribute('fill')).filter(Boolean);
return { count: gs.length, ids: gs, unique: new Set(gs.map((s) => s.replace(' [HIDDEN]',''))).size, uses };
