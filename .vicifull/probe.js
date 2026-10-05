/* Layout signature probe. Walks the rendered tree, emits one line per visible
   box in frame coordinates, and POSTs it to the frame server so it lands on
   disk for a numeric diff. Runs identically against a design frame and the app. */
window.__sigRows = function (name, opts) {
  /* A pager keeps every page mounted, so a capture of the whole tree carries
     pages the eye never sees. `clip` keeps only what falls inside the frame. */
  const clip = opts && opts.clip;
  /* `win` runs the probe against another window — an iframe holding a design
     frame — so a family of twenty-four can be captured without twenty-four
     navigations. Its own `getComputedStyle` has to be used, not this one's. */
  const win = (opts && opts.win) || window;
  const document = win.document;
  const getComputedStyle = win.getComputedStyle.bind(win);
  const host = document.querySelector('#frame > [data-screen-label]') || document.body;
  const base = host === document.body ? { left: 0, top: 0 } : host.getBoundingClientRect();
  /* Reanimated's `entering` animations mount their element `visibility: hidden`
     and un-hide it from a `requestAnimationFrame`. The browser pane runs its
     tabs hidden, rAF never fires, and the element — and everything under it —
     stays invisible to a capture even though the app is drawing it correctly on
     a real screen. Un-hide exactly those: an *inline* `visibility: hidden`,
     which no frame in the bundle sets and which nothing in the app sets either
     — it only ever arrives from a layout animation that has not started. A
     stylesheet's `visibility: hidden` is left alone, and so is `display: none`.

     Gated on the app: `27 · Cost Next 365` is the one frame in the bundle that
     hides an element inline, and a design capture must keep hiding it. */
  if (host === document.body) {
    for (const el of document.querySelectorAll('[style*="visibility"]')) {
      if (el.style.visibility === 'hidden') el.style.visibility = 'visible';
    }
  }

  const SKIP = new Set(['DEFS', 'STOP', 'LINEARGRADIENT', 'RADIALGRADIENT', 'CLIPPATH', 'MASK', 'FILTER', 'FEGAUSSIANBLUR']);
  const rows = [];
  const r1 = (n) => Math.round(n * 10) / 10;
  /* The canvas draws an iPhone: a 54px status bar and a 139x5 home indicator
     that the app never builds (DECISIONS.md D009). Dropping them here keeps
     them out of every diff instead of out of none. */
  const isChrome = (el, cs) => {
    if (cs.position !== 'absolute') return false;
    const r = el.getBoundingClientRect();
    if (r.height === 54 && Math.round(r.top - base.top) === 0 && Math.round(r.width) === 393) return true;
    if (Math.round(r.width) === 139 && Math.round(r.height) === 5) return true;
    return false;
  };
  const walk = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    if (SKIP.has(el.tagName.toUpperCase())) return;
    if (isChrome(el, cs)) return;
    const r = el.getBoundingClientRect();
    let text = '';
    for (const n of el.childNodes) if (n.nodeType === 3) text += n.nodeValue;
    text = text.replace(/\s+/g, ' ').trim();
    if (clip) {
      const x = r.left - base.left, y = r.top - base.top;
      if (x >= 393 || y >= 852 || x + r.width <= 0 || y + r.height <= 0) return;
      /* A pager keeps every page mounted and its off-page rows keep reporting a
         rect, even though an ancestor's `overflow` has already clipped them out
         of sight. Drop anything that falls entirely outside a clipping
         ancestor — otherwise page two's rows turn up in page one's capture,
         hidden behind the app's own opaque bars. */
      for (let p = el.parentElement; p && p !== host.parentElement; p = p.parentElement) {
        const pcs = getComputedStyle(p);
        if (pcs.overflow === 'visible' && pcs.overflowX === 'visible' && pcs.overflowY === 'visible') continue;
        const pr = p.getBoundingClientRect();
        if (r.right <= pr.left || r.left >= pr.right || r.bottom <= pr.top || r.top >= pr.bottom) return;
      }
    }
    rows.push(
      [
        el.tagName.toLowerCase(),
        r1(r.left - base.left), r1(r.top - base.top), r1(r.width), r1(r.height),
        cs.backgroundColor === 'rgba(0, 0, 0, 0)' ? '-' : cs.backgroundColor,
        cs.borderRadius === '0px' ? '-' : cs.borderRadius,
        cs.opacity === '1' ? '-' : cs.opacity,
        cs.boxShadow === 'none' ? '-' : cs.boxShadow.replace(/\s+/g, ' '),
        text ? cs.fontSize + '/' + cs.fontWeight + '/' + cs.letterSpacing + '/' + cs.lineHeight + '/' + cs.color : '-',
        text || '-',
      ].join(' | '),
    );
    for (const c of el.children) walk(c);
  };
  for (const c of host.children) walk(c);
  return rows.join('\n');
};
window.__sig = function (name, opts) {
  const rows = window.__sigRows(name, opts);
  return fetch('http://localhost:8097/sig', { method: 'POST', body: JSON.stringify({ name, rows }) }).then(() => rows.split('\n').length + ' rows -> ' + name);
};
