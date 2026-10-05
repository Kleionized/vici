window.__hit = (tag) => {
  const out = [];
  for (const b of __btns()) {
    const r = b.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const cs = getComputedStyle(b); if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) { out.push(`${tag}: OFFSCREEN ${b.getAttribute('aria-label') || b.textContent.trim().slice(0, 20)} @${Math.round(x)},${Math.round(y)}`); continue; }
    const e = document.elementFromPoint(x, y);
    if (!(e && (b === e || b.contains(e)))) {
      let d = e; const p = []; while (d && p.length < 3) { p.push(d.tagName + (d.getAttribute('role') ? '[' + d.getAttribute('role') + ']' : '') + (d.getAttribute('aria-label') ? '{' + d.getAttribute('aria-label') + '}' : '')); d = d.parentElement; }
      out.push(`${tag}: OCCLUDED ${b.getAttribute('aria-label') || b.textContent.trim().slice(0, 20)} @${Math.round(x)},${Math.round(y)} by ${p.join('<')}`);
    }
  }
  return out;
};
