/**
 * Pass 3 — the clipping probe.
 *
 * Injected into the running app. Finding 6 was a line of text cut through the
 * middle of its glyphs by a band painted after it: every number on that screen
 * matched the canvas, so no sweep over stated values could see it. This is the
 * general form of that check.
 *
 * Two ways a run of text stops being readable, both of which are invisible to a
 * numeric comparison:
 *
 *  1. an opaque box painted later covers part of it;
 *  2. it overflows an ancestor that clips.
 *
 * Reported as a list rather than a verdict — a deliberately truncated line is
 * legitimate, and only reading the screen can tell the two apart.
 */
(() => {
  const OPAQUE = (bg) => {
    if (!bg || bg === 'transparent') return false;
    const m = bg.match(/rgba?\(([^)]+)\)/);
    if (!m) return true;
    const parts = m[1].split(',').map((x) => Number(x.trim()));
    return parts.length < 4 || parts[3] >= 0.9;
  };

  const texts = [...document.querySelectorAll('*')].filter(
    (e) => e.children.length === 0 && e.textContent.trim().length > 1 && e.getBoundingClientRect().height > 0,
  );

  // Paint order: an element later in a depth-first walk paints over an earlier
  // one, absent z-index. Good enough for a React Native tree, which almost
  // never sets z-index.
  const order = new Map();
  let i = 0;
  const walk = (n) => {
    order.set(n, i++);
    for (const c of n.children) walk(c);
  };
  walk(document.body);

  const boxes = [...document.querySelectorAll('*')].filter((e) => {
    const cs = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    return e.children.length <= 1 && r.width > 40 && r.height > 20 && (OPAQUE(cs.backgroundColor) || cs.backgroundImage !== 'none');
  });

  const findings = [];
  for (const t of texts) {
    const r = t.getBoundingClientRect();
    if (r.width < 8) continue;

    // 1. covered by something painted later
    for (const b of boxes) {
      if (b === t || b.contains(t) || t.contains(b)) continue;
      if ((order.get(b) ?? 0) < (order.get(t) ?? 0)) continue;
      const q = b.getBoundingClientRect();
      const ox = Math.min(r.right, q.right) - Math.max(r.left, q.left);
      const oy = Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top);
      if (ox <= 2 || oy <= 2) continue;
      // A box covering the whole run is a sheet or a modal, not a clip.
      const covered = (ox * oy) / (r.width * r.height);
      if (covered > 0.92 || covered < 0.04) continue;
      findings.push({
        kind: 'covered',
        text: t.textContent.trim().slice(0, 60),
        pct: Math.round(covered * 100),
        by: getComputedStyle(b).backgroundColor,
      });
      break;
    }

    // 2. overflows a clipping ancestor
    for (let n = t.parentElement; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.overflow === 'visible' && cs.overflowY === 'visible') continue;
      const q = n.getBoundingClientRect();
      if (q.height < 4) break;
      const spill = Math.round(r.bottom - q.bottom);
      // A scroll container legitimately holds more than it shows.
      if (cs.overflowY === 'auto' || cs.overflowY === 'scroll' || n.scrollHeight > n.clientHeight + 4) break;
      if (spill > 2 && r.top < q.bottom - 2) {
        findings.push({ kind: 'clipped', text: t.textContent.trim().slice(0, 60), spill });
      }
      break;
    }
  }

  // One row per distinct string keeps a repeated component from filling the log.
  const seen = new Set();
  return findings.filter((f) => {
    const k = `${f.kind}|${f.text}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
})()
