export const PROBE = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const vis = (el) => { const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.05; };
      const scroller = (el, axis) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (axis === 'x' ? /(auto|scroll)/.test(cs.overflowX) && p.scrollWidth > p.clientWidth + 1 : /(auto|scroll)/.test(cs.overflowY) && p.scrollHeight > p.clientHeight + 1) return p; } return null; };
      // A sheet's scrim (rgba(0,0,0,0.68)) covers the screen behind it: when one is up, only what is
      // painted after it (the panel and its buttons) can collide with anything.
      const scrim = [...document.querySelectorAll('div,button')].find((d) => { const cs = getComputedStyle(d); const r = d.getBoundingClientRect(); return cs.backgroundColor === 'rgba(0, 0, 0, 0.68)' && r.width >= vw - 1 && r.height >= vh * 0.6; });
      const onTop = (el) => !scrim || !!(scrim.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) || scrim.contains(el);
      const textEls = [...document.querySelectorAll('div,span')].filter((e) => [...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()) && vis(e) && onTop(e));
      const out = { overflowX: [], underCtl: [], clipped: [], offscreen: [] };
      for (const e of textEls) {
        const r = e.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        // a pager's neighbouring page lies wholly off-screen by design; only a run that straddles an edge is cut
        const offPage = r.right <= 0.5 || r.left >= vw - 0.5;
        if (!offPage && (r.right > vw + 0.5 || r.left < -0.5) && !scroller(e, 'x')) out.overflowX.push(`${e.textContent.trim().slice(0, 40)} [${Math.round(r.left)}..${Math.round(r.right)}]`);
        if (offPage || r.bottom <= 0 || r.top >= vh) continue;
        for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) {
          const cs = getComputedStyle(p);
          if (cs.overflow === 'visible' && cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
          if (/(auto|scroll)/.test(cs.overflowY) || /(auto|scroll)/.test(cs.overflowX)) break; // a scroller: reachable
          const pr = p.getBoundingClientRect();
          const straddles = (r.right > pr.right + 1 && r.left < pr.right) || (r.left < pr.left - 1 && r.right > pr.left) || (r.bottom > pr.bottom + 1 && r.top < pr.bottom);
          if (straddles) out.clipped.push(`${e.textContent.trim().slice(0, 40)}`);
          break;
        }
      }
      // bottom controls: buttons / tabs in the lowest 30 % of the window
      const ctls = [...document.querySelectorAll('[role=button],[role=tab]')].filter((e) => vis(e) && onTop(e)).map((e) => ({ e, r: e.getBoundingClientRect() })).filter((x) => x.r.top > vh * 0.7 && x.r.height > 20 && x.r.width > 20 && x.r.left < vw && x.r.right > 0);
      for (const t of textEls) {
        const r = t.getBoundingClientRect();
        if (r.bottom <= 0 || r.top >= vh || r.right <= 0 || r.left >= vw) continue;
        // a control's own label is the top layer, not content running under one
        if (t.closest('[role=tab],[role=tablist]')) continue;
        for (const c of ctls) {
          if (c.e.contains(t) || t.contains(c.e)) continue;
          const top = Math.max(r.top, c.r.top), bot = Math.min(r.bottom, c.r.bottom);
          const left = Math.max(r.left, c.r.left), right = Math.min(r.right, c.r.right);
          if (bot - top <= 2 || right - left <= 2) continue;
          // the text is a control's label lying over content (the SOS disc over a row): the
          // content underneath is what must be reachable — judge the row, not the label
          const own = t.closest('[role=button]');
          if (own && own !== c.e) {
            const or = own.getBoundingClientRect();
            const csc = scroller(c.e, 'y');
            if (csc && c.r.bottom - (csc.scrollHeight - csc.clientHeight - csc.scrollTop) <= or.top + 1) continue;
          }
          // content a scroller can bring clear of the control is reachable, not cut
          const sc = scroller(t, 'y');
          if (sc && r.bottom - (sc.scrollHeight - sc.clientHeight - sc.scrollTop) <= c.r.top + 1) continue;
          // covered by another layer away from the control (a sheet's scrim over the screen behind
          // it): hidden by design. Probe a point of the text outside the control's box.
          const px = r.top < c.r.top - 2 ? [(left + right) / 2, r.top + 2] : r.bottom > c.r.bottom + 2 ? [(left + right) / 2, r.bottom - 2] : r.left < c.r.left - 2 ? [r.left + 2, (top + bot) / 2] : r.right > c.r.right + 2 ? [r.right - 2, (top + bot) / 2] : null;
          if (px) { const h2 = document.elementFromPoint(px[0], px[1]); if (h2 && !(t.contains(h2) || h2.contains(t))) continue; }
          // what is actually on top at the overlap: the text or the control is a collision;
          // anything else (a sheet's scrim, the tab bar's ground) hides the text by design
          const hit = document.elementFromPoint((left + right) / 2, (top + bot) / 2);
          if (!hit || !(t.contains(hit) || hit.contains(t) || c.e.contains(hit))) continue;
          out.underCtl.push(`${t.textContent.trim().slice(0, 40)} under ${c.e.textContent.trim().slice(0, 20) || c.e.getAttribute('aria-label') || 'control'}`);
          break;
        }
      }
      for (const b of [...document.querySelectorAll('[role=button]')].filter(vis)) {
        const r = b.getBoundingClientRect();
        if (r.top < vh || r.left >= vw || r.right <= 0) continue;
        if (!scroller(b, 'y')) out.offscreen.push((b.textContent.trim() || b.getAttribute('aria-label') || '?').slice(0, 30));
      }
      for (const k of Object.keys(out)) out[k] = [...new Set(out[k])].slice(0, 8);
      return out;
    };
