// Geometry-only SVG bbox (no rendering needed). Exposes globalThis.svgBBox(content) -> {x,y,w,h}.
(function () {
  const mul = (A, B) => [A[0]*B[0]+A[2]*B[1], A[1]*B[0]+A[3]*B[1], A[0]*B[2]+A[2]*B[3], A[1]*B[2]+A[3]*B[3], A[0]*B[4]+A[2]*B[5]+A[4], A[1]*B[4]+A[3]*B[5]+A[5]];
  const parseT = (t, m) => { for (const [, fn, args] of (t || '').matchAll(/(\w+)\(([^)]*)\)/g)) { const a = args.split(/[\s,]+/).filter(Boolean).map(Number); let M;
    if (fn === 'translate') M = [1,0,0,1,a[0],a[1]||0]; else if (fn === 'scale') M = [a[0],0,0,a[1]??a[0],0,0];
    else if (fn === 'rotate') { const r = a[0]*Math.PI/180, c = Math.cos(r), s = Math.sin(r), cx = a[1]||0, cy = a[2]||0; M = [c,s,-s,c, cx - c*cx + s*cy, cy - s*cx - c*cy]; }
    else if (fn === 'matrix') M = a; else continue; m = mul(m, M); } return m; };
  const pathPts = d => { const tk = d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) || []; const P = []; let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0; const n = () => +tk[i++];
    while (i < tk.length) { if (/[a-z]/i.test(tk[i])) cmd = tk[i++]; const U = cmd.toUpperCase(), rel = cmd !== U;
      if (U === 'Z') { x = sx; y = sy; continue; } if (i >= tk.length) break; const ox = rel ? x : 0, oy = rel ? y : 0;
      if (U === 'M' || U === 'L' || U === 'T') { x = ox + n(); y = oy + n(); P.push([x, y]); if (U === 'M') { sx = x; sy = y; cmd = rel ? 'l' : 'L'; } }
      else if (U === 'H') { x = ox + n(); P.push([x, y]); } else if (U === 'V') { y = oy + n(); P.push([x, y]); }
      else if (U === 'C') { const p = [n(), n(), n(), n(), n(), n()]; P.push([ox+p[0], oy+p[1]], [ox+p[2], oy+p[3]]); x = ox+p[4]; y = oy+p[5]; P.push([x, y]); }
      else if (U === 'S' || U === 'Q') { const p = [n(), n(), n(), n()]; P.push([ox+p[0], oy+p[1]]); x = ox+p[2]; y = oy+p[3]; P.push([x, y]); }
      else if (U === 'A') { const rx = n(), ry = n(); n(); n(); n(); const ex = ox + n(), ey = oy + n(), r = Math.max(rx, ry), mx = (x+ex)/2, my = (y+ey)/2; const px = -(ey-y), py = ex-x, pl = Math.hypot(px, py) || 1; P.push([mx + px/pl*r, my + py/pl*r], [mx - px/pl*r, my - py/pl*r]); x = ex; y = ey; P.push([x, y]); }
      else i++; }
    return P; };
  globalThis.svgMass = content => { const E = []; globalThis.svgBBox(content, E); let X0 = 1e9, X1 = -1e9, sw = 0, sx = 0;
    const parts = E.filter(e => !(e.w >= 300) && !(e.h <= 9 && e.w >= 120));
    for (const e of parts) { const a = Math.max(e.w, 2) * Math.max(e.h, 2); sw += a; sx += a * (e.x + e.w / 2); X0 = Math.min(X0, e.x); X1 = Math.max(X1, e.x + e.w); }
    return { cx: sw ? sx / sw : null, x0: X0, x1: X1, n: parts.length }; };
  globalThis.svgBBox = (content, OUT) => { const doc = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${content}</svg>`, 'image/svg+xml'); let X0 = 1e9, Y0 = 1e9, X1 = -1e9, Y1 = -1e9;
    const walk = (el, m, inh) => { for (const c of el.children) { const mm = parseT(c.getAttribute('transform'), m); const fill = c.getAttribute('fill') ?? inh.fill, stroke = c.getAttribute('stroke') ?? inh.stroke, sw = +(c.getAttribute('stroke-width') ?? inh.sw ?? 1);
      if (c.tagName === 'g') { walk(c, mm, { fill, stroke, sw }); continue; }
      const A = k => +(c.getAttribute(k) || 0); let P = [];
      if (c.tagName === 'rect') P = [[A('x'), A('y')], [A('x')+A('width'), A('y')+A('height')], [A('x')+A('width'), A('y')], [A('x'), A('y')+A('height')]];
      else if (c.tagName === 'circle') { const r = A('r'); P = [[A('cx')-r, A('cy')-r], [A('cx')+r, A('cy')+r], [A('cx')-r, A('cy')+r], [A('cx')+r, A('cy')-r]]; }
      else if (c.tagName === 'ellipse') P = [[A('cx')-A('rx'), A('cy')-A('ry')], [A('cx')+A('rx'), A('cy')+A('ry')], [A('cx')-A('rx'), A('cy')+A('ry')], [A('cx')+A('rx'), A('cy')-A('ry')]];
      else if (c.tagName === 'line') P = [[A('x1'), A('y1')], [A('x2'), A('y2')]];
      else if (c.tagName === 'polygon' || c.tagName === 'polyline') { const v = (c.getAttribute('points') || '').split(/[\s,]+/).filter(Boolean).map(Number); for (let k = 0; k < v.length; k += 2) P.push([v[k], v[k+1]]); }
      else if (c.tagName === 'path') P = pathPts(c.getAttribute('d') || '');
      const visFill = fill && fill !== 'none' && fill !== '#0D0D0D', visStroke = stroke && stroke !== 'none' && stroke !== '#0D0D0D';
      if (!visFill && !visStroke) continue;
      const pad = visStroke ? sw / 2 : 0;
      let ex0 = 1e9, ey0 = 1e9, ex1 = -1e9, ey1 = -1e9;
      for (const [px, py] of P) { const tx = mm[0]*px + mm[2]*py + mm[4], ty = mm[1]*px + mm[3]*py + mm[5]; X0 = Math.min(X0, tx - pad); Y0 = Math.min(Y0, ty - pad); X1 = Math.max(X1, tx + pad); Y1 = Math.max(Y1, ty + pad); ex0 = Math.min(ex0, tx - pad); ey0 = Math.min(ey0, ty - pad); ex1 = Math.max(ex1, tx + pad); ey1 = Math.max(ey1, ty + pad); }
      if (OUT && P.length) OUT.push({ x: ex0, y: ey0, w: ex1 - ex0, h: ey1 - ey0 }); } };
    walk(doc.documentElement, [1,0,0,1,0,0], { fill: '#000' }); return { x: X0, y: Y0, w: X1 - X0, h: Y1 - Y0 }; };
})();
