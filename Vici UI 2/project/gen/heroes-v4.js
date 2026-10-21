// Hero scenes v4 — polish pass over v3. Same stage (393×240, horizon y=190, centre x=196, 1.1× in-frame), same five tones.
// Evaluate: const V4 = eval(await readFile('gen/heroes-v4.js')); V4.svg('bed') → full <svg> string.
(function () {
  const INK = '#F2F0EC', GROUND = '#0D0D0D', MID = '#A8A39A', DIM = '#55524D', DIM2 = '#3A3835', TILE = '#232220';
  const n = v => +(+v).toFixed(2);
  const rect = (x, y, w, h, r = 0, fill = INK, ex = '') => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"${r ? ` rx="${r}"` : ''} fill="${fill}"${ex}></rect>`;
  const path = (d, fill = INK, ex = '') => `<path d="${d}" fill="${fill}"${ex}></path>`;
  const line = (d, c = INK, w = 3, ex = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${ex}></path>`;
  const circ = (cx, cy, r, fill = INK, ex = '') => `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}"${ex}></circle>`;
  const ell = (cx, cy, rx, ry, fill = INK, ex = '') => `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fill}"${ex}></ellipse>`;
  const cut = (w = 2) => ` stroke="${GROUND}" stroke-width="${w * 2}" paint-order="stroke" stroke-linejoin="round"`;
  const outline = (c, w) => ` stroke="${c}" stroke-width="${w}" stroke-linejoin="round"`;
  const op = a => ` fill-opacity="${a}"`;
  const g = (tf, inner) => `<g transform="${tf}">${inner}</g>`;
  const polar = (cx, cy, r, deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy + r * Math.sin(deg * Math.PI / 180)];

  // ── shared staging ──
  const table = (x1, x2, y = 190, legs = true) => rect(x1, y - 2, x2 - x1, 7, 3.5) + (legs ? rect(x1 + 12, y + 5, 6, 14, 1.5) + rect(x2 - 18, y + 5, 6, 14, 1.5) : '');
  const groundLine = (x1 = -40, x2 = 433) => rect(x1, 188.25, x2 - x1, 3.5, 1.75);
  const floor = (x1 = -40, x2 = 433) => rect(x1, 189, x2 - x1, 3, 1.5, DIM);
  const shadow = (cx, rx, y = 200) => ell(cx, y, rx, Math.max(3, rx * 0.06), DIM2);
  const farHills = (c = DIM) => path('M-40 190 V184 C 10 160, 92 146, 152 172 C 180 186, 212 188, 240 176 C 300 150, 382 158, 433 182 V190 Z', c);
  const tuft = (x, y = 190, c = INK, s = 1) => line(`M${x} ${y} l${-3 * s} ${-8 * s} M${x} ${y} v${-11 * s} M${x} ${y} l${3 * s} ${-8 * s}`, c, 1.6 * s);
  const cloud = (x, y, s = 1, c = DIM) => `<g fill="${c}">${circ(x, y, 9 * s, c)}${circ(x + 12 * s, y - 5 * s, 12 * s, c)}${circ(x + 26 * s, y, 9 * s, c)}${rect(x - 2 * s, y, 30 * s, 9 * s, n(4.5 * s), c)}</g>`;
  const star = (x, y, r = 3, c = INK) => path(`M${n(x)} ${n(y - r)} Q${n(x)} ${n(y)} ${n(x + r)} ${n(y)} Q${n(x)} ${n(y)} ${n(x)} ${n(y + r)} Q${n(x)} ${n(y)} ${n(x - r)} ${n(y)} Q${n(x)} ${n(y)} ${n(x)} ${n(y - r)} Z`, c);
  const stars = (pts, c = INK) => pts.map(p => star(p[0], p[1], p[2] || 3, c)).join('');
  // true crescent (A minus offset B) — nothing behind it gets painted over
  const crescent = (cx, cy, r, c = INK) => {
    const k = 0.8, r2 = r * k, dx = r * 0.42, dy = r * -0.34, d = Math.hypot(dx, dy);
    const a = (r * r - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(r * r - a * a);
    const ux = dx / d, uy = dy / d, px = cx + a * ux, py = cy + a * uy;
    const p1 = [px - h * uy, py + h * ux], p2 = [px + h * uy, py - h * ux];
    return path(`M${n(p1[0])} ${n(p1[1])} A${n(r)} ${n(r)} 0 ${a > 0 ? 1 : 0} 1 ${n(p2[0])} ${n(p2[1])} A${n(r2)} ${n(r2)} 0 ${a > d ? 1 : 0} 0 ${n(p1[0])} ${n(p1[1])} Z`, c);
  };
  // one soft S per wisp; callers vary height, start and direction so pairs never read as identical squiggles
  const wisp = (x, y, h, dir = 1, c = MID, w = 2.4) => { const sw = Math.max(3, h * 0.22) * dir; return line(`M${n(x)} ${n(y)} C ${n(x - sw)} ${n(y - h * 0.36)}, ${n(x + sw)} ${n(y - h * 0.64)}, ${n(x)} ${n(y - h)}`, c, w); };
  const windowAt = (x, y, w, h, o = {}) => { const fr = o.frame || DIM; return rect(x, y, w, h, 5, fr) + rect(x + 6, y + 6, w - 12, h - 12, 2, GROUND) + rect(x + w / 2 - 2, y + 6, 4, h - 12, 0, fr) + rect(x + 6, y + h / 2 - 2, w - 12, 4, 0, fr) + (o.sill === false ? '' : rect(x - 7, y + h, w + 14, 6, 2, fr)); };
  const pebble = (x, y, r, c = DIM) => ell(x, y, r, r * 0.55, c);
  const sprig = (x, y) => line(`M${x} ${y} V${y - 18} M${x} ${y - 10} C ${x - 8} ${y - 13}, ${x - 11} ${y - 21}, ${x - 9} ${y - 27} C ${x - 2} ${y - 24}, ${x + 1} ${y - 17}, ${x} ${y - 10} M${x} ${y - 14} C ${x + 8} ${y - 17}, ${x + 11} ${y - 25}, ${x + 9} ${y - 31} C ${x + 2} ${y - 28}, ${x - 1} ${y - 21}, ${x} ${y - 14}`, INK, 2.2);

  const H = {};

  // ── night & rest ──
  H.nightPhone = () => g('translate(-6 0)',
    crescent(256, 62, 10) + stars([[222, 54, 2.3], [290, 84, 2], [230, 92, 1.7]]) +
    table(100, 300) +
    rect(132, 92, 46, 96, 11) + rect(135.5, 95.5, 39, 89, 8, GROUND) + path('M135.5 150 L174.5 118 V134 L135.5 166 Z', DIM2) + rect(148, 100, 14, 4.5, 2.25) +
    rect(126, 180, 58, 8, 3, DIM) +
    path('M238.5 156 H263.5 L261.7 185.5 H240.3 Z', DIM) + line('M236 140 H266 L263 186 Q262.8 188 261 188 H241 Q239.2 188 239 186 Z', INK, 3));

  H.bed = () => floor() + g('translate(12 0)',
    rect(66, 150, 44, 40, 4, DIM) + rect(75, 166, 26, 3, 1.5, GROUND) +
    rect(80, 144, 16, 6, 2) + rect(86, 122, 4, 22) + path('M72 122 H104 L98 100 H78 Z') +
    crescent(252, 58, 9) + stars([[218, 50, 2.2], [284, 76, 1.9], [226, 86, 1.6]]) +
    rect(124, 96, 12, 94, 3) + rect(290, 132, 10, 58, 3) + rect(124, 146, 176, 30, 6) +
    rect(142, 130, 46, 18, 8, INK, cut(2)) +
    line('M198 148 V174', GROUND, 2.6) + line('M206 167 H284', GROUND, 2.6));

  H.charger = () => floor() + g('translate(-25 0)',
    rect(120, 147, 152, 32, 3, DIM) + rect(178, 160, 36, 3.5, 1.75, GROUND) + rect(126, 179, 7, 11) + rect(259, 179, 7, 11) + rect(112, 138, 168, 9, 4.5) +
    rect(178, 72, 28, 58, 6) + rect(181, 75, 22, 46, 4, GROUND) + path('M194.5 86.5 L186.5 100 H192 L189.5 110.5 L198 97 H192.5 Z') +
    rect(166, 124, 52, 14, 4, INK, cut(1.5)) +
    rect(300, 92, 30, 42, 6, DIM) + line('M218 130 C 252 131, 306 138, 315 121', INK, 3) + rect(306, 100, 18, 22, 4));

  H.nightMoon = () => stars([[120, 60, 3.2], [292, 54, 3], [78, 112, 2.4], [318, 126, 3], [152, 140, 2], [244, 132, 2]]) +
    crescent(196, 90, 50) + cloud(84, 140, 1.1) + cloud(268, 150, 0.9) +
    path('M-40 198 C 10 160, 92 152, 150 184 C 176 198, 220 196, 244 184 C 302 152, 382 160, 433 192 V210 H-40 Z', DIM) +
    rect(130, 160, 5, 10, 0, TILE) + wisp(132.5, 156, 12, 1, MID, 1.8) +
    rect(108, 172, 30, 18, 1.5, TILE) + path('M104 173 L123 158 L142 173 Z');

  H.phoneTable = () => rect(58, 64, 276, 144, 18, DIM2) +
    g('rotate(-12 176 136)', rect(140, 66, 72, 140, 14) + rect(149, 75, 30, 34, 9, GROUND) + circ(158.5, 85, 5.5) + circ(158.5, 85, 2.4, GROUND) + circ(158.5, 99.5, 5.5) + circ(158.5, 99.5, 2.4, GROUND) + circ(171, 85, 2.4)) +
    rect(282, 102, 26, 18, 7) + circ(270, 112, 26) + circ(270, 112, 18.5, GROUND) + path('M258 104 C 262 99, 268 97, 274 98', 'none', outline(MID, 2.4) + ' stroke-linecap="round"');

  H.lamp = () => table(70, 322) + path('M162 118 H230 L262 188 H130 Z', INK, op(0.08)) +
    rect(96, 162, 28, 26, 4, DIM) + line('M96 169 h-5 a6 6 0 0 0 0 12 h5', DIM, 4) +
    path('M162 118 H230 L214 68 H178 Z') + rect(193, 118, 6, 62) + path('M170 188 A26 8 0 0 1 222 188 Z') +
    rect(262, 172, 54, 16, 2.5) + line('M268 178 H310 M268 183 H302', GROUND, 1.6);

  const bellDome = (x, y, rot) => g(`translate(${n(x)} ${n(y)}) rotate(${rot})`, path('M-17 0 A17 17 0 0 1 17 0 Z') + rect(-3, -22, 6, 7, 2));
  H.clock = () => {
    let ticks = '';
    for (let i = 0; i < 12; i++) { const q = i % 3 === 0; const [x1, y1] = polar(196, 124, q ? 33 : 36.5, i * 30); const [x2, y2] = polar(196, 124, 40, i * 30); ticks += line(`M${n(x1)} ${n(y1)} L${n(x2)} ${n(y2)}`, INK, q ? 3.4 : 2); }
    const [hx, hy] = polar(196, 124, 21, -35), [mx, my] = polar(196, 124, 31, 210);
    return table(100, 292) + line('M170 166 L160 185 M222 166 L232 185', INK, 7) +
      bellDome(158.7, 79.6, -40) + bellDome(233.3, 79.6, 40) + rect(193, 58, 6, 12, 2) + circ(196, 56, 4.5) +
      circ(196, 124, 54) + circ(196, 124, 45, GROUND) + ticks +
      line(`M196 124 L${n(hx)} ${n(hy)}`, INK, 4.5) + line(`M196 124 L${n(mx)} ${n(my)}`, INK, 3) + circ(196, 124, 5) + circ(196, 124, 2, GROUND);
  };

  // ── rooms & doors ──
  const doorPlant = () => path('M286 190 L289.5 168 H306.5 L310 190 Z', DIM) + sprig(298, 168);
  H.door = () => floor() + g('translate(-14 0)', rect(144, 54, 104, 136, 3, DIM) + rect(151, 61, 90, 129, 1.5) +
    rect(163, 75, 66, 46, 2, 'none', outline(GROUND, 2.6)) + rect(163, 133, 66, 44, 2, 'none', outline(GROUND, 2.6)) + circ(229, 127, 3.6, GROUND) +
    rect(160, 195, 72, 6, 2.5, DIM) + doorPlant());

  H.openDoor = () => floor() + g('translate(-7 0)', path('M151 190 H241 L290 228 H120 Z', INK, op(0.09)) +
    rect(144, 54, 104, 136, 3, DIM) + rect(151, 61, 90, 129, 0, INK) +
    path('M151 166 C 168 156, 188 156, 206 164 C 218 169, 228 168, 241 162 V190 H151 Z', MID) +
    path('M151 61 L112 50 V204 L151 190 Z', DIM, cut(1.5)) +
    path('M143.98 73.71 L119.02 68.43 V122.25 L143.98 121.77 Z M143.98 133.78 L119.02 135.7 V186.53 L143.98 179.17 Z', 'none', outline(GROUND, 2.2)) +
    circ(116.5, 130, 3, MID) + doorPlant());

  H.shower = () => line('M146 36 V190 M186 36 V190 M226 36 V190 M266 36 V190 M114 70 H296 M114 110 H296 M114 150 H296', TILE, 2) +
    rect(104, 36, 10, 154, 2) + line('M114 48 H170 A14 14 0 0 1 184 62 V70', INK, 10) + rect(150, 68, 68, 18, 9) +
    [158, 172, 186, 200, 214].map((x, i) => line(`M${x} 96 V184`, INK, 3.5, ` stroke-dasharray="13 11" stroke-dashoffset="${[0, 12, 5, 16, 8][i]}"`)).join('') +
    rect(236, 122, 52, 6, 3) + rect(244, 100, 14, 22, 3) + rect(248, 94, 6, 7, 1) + rect(264, 106, 18, 16, 4) +
    rect(76, 190, 240, 6, 3);

  H.stairs = () => floor() +
    rect(104, 166, 180, 24, 0, INK) + rect(140, 142, 144, 24, 0, DIM) + rect(176, 118, 108, 24, 0, DIM) + rect(212, 94, 72, 24, 0, DIM) + rect(248, 70, 36, 24, 0, DIM) +
    line('M140 142 H174 M176 118 H210 M212 94 H246 M248 70 H282', GROUND, 2) +
    line('M106 134 L262 30', MID, 3) + line('M106 134 V166 M158 99.3 V142 M194 75.3 V118 M230 51.3 V94', MID, 2);

  H.mirror = () => table(100, 292) +
    rect(150, 58, 92, 118, 46) + rect(158, 66, 76, 102, 38, GROUND) + line('M174 104 L196 82', INK, 3) + line('M180 120 L208 92', MID, 2.2) +
    rect(192, 176, 8, 6) + path('M176 188 A20 6 0 0 1 216 188 Z') +
    rect(118, 164, 20, 24, 4, DIM) + rect(124, 156, 8, 9, 2, DIM) + rect(121, 151, 14, 5, 2, DIM) +
    rect(254, 174, 30, 14, 4, DIM) + rect(251, 168, 36, 7, 3, DIM);

  // ── outdoors ──
  H.sunrise = () => path('M128 190 A68 68 0 0 1 264 190 Z') +
    line([90, 60, 30, 120, 150].map(a => { const [x1, y1] = polar(196, 190, 82, -a), [x2, y2] = polar(196, 190, 98, -a); return `M${n(x1)} ${n(y1)} L${n(x2)} ${n(y2)}`; }).join(' '), INK, 3.5) +
    path('M-40 190 V170 C 0 158, 62 154, 104 161 C 134 166, 158 177, 176 190 Z', DIM) +
    path('M432 190 V170 C 392 158, 330 154, 288 161 C 258 166, 234 177, 216 190 Z', DIM) + groundLine();

  H.bench = () => farHills(DIM2) +
    circ(312, 94, 28, DIM) + circ(292, 116, 20, DIM) + circ(332, 116, 20, DIM) + rect(307, 118, 10, 72, 2, DIM) +
    groundLine() + tuft(40) +
    rect(75, 74, 6, 116) + path('M64 74 H92 L87 56 H69 Z') + rect(72, 50, 12, 6, 2) + rect(68, 182, 20, 8, 2) +
    rect(134, 108, 120, 9, 4) + rect(134, 123, 120, 9, 4) + rect(140, 102, 8, 46, 2) + rect(240, 102, 8, 46, 2) +
    rect(128, 144, 132, 11, 5) + rect(138, 155, 8, 35, 2) + rect(242, 155, 8, 35, 2);

  H.signpost = () => farHills() + cloud(78, 70, 1) + cloud(286, 56, 0.8) + groundLine() + tuft(74) + tuft(314) +
    rect(193, 62, 6, 128) + circ(196, 60, 5) +
    path('M148 76 H230 L246 90 L230 104 H148 Z', INK, outline(INK, 3)) + line('M162 90 H214', GROUND, 3) +
    path('M244 118 H162 L146 132 L162 146 H244 Z', INK, outline(INK, 3)) + line('M178 132 H230', GROUND, 3);

  H.sneaker = () => groundLine() + line('M60 132 H90 M46 150 H82 M62 168 H86', MID, 2.6) +
    g('rotate(7 298 190)',
      path('M112 172 C 106 154, 106 132, 114 120 C 118 114, 128 113, 134 118 C 146 128, 158 129, 166 124 C 170 115, 176 109, 184 109 C 192 109, 196 115, 198 124 C 216 139, 240 148, 262 152 C 282 155, 294 162, 296 172 Z') +
      path('M106 172 H298 C 304 172, 306 178, 304 184 C 302 189, 296 190, 290 190 H116 C 108 190, 104 186, 104 180 C 104 175, 104 172, 106 172 Z') +
      line('M108 172 H298', GROUND, 3) + line('M144 168 C 139 150, 141 134, 150 125', GROUND, 2.6) + line('M252 168 C 254 160, 262 155, 274 155', GROUND, 2.6) +
      circ(199.4, 135.7, 2.6, GROUND) + circ(212.8, 143.5, 2.6, GROUND) + circ(226.8, 149.8, 2.6, GROUND) + circ(240.9, 154.7, 2.6, GROUND));

  const flagScene = fy => farHills() + cloud(70, 76, 1) + cloud(300, 66, 0.9) + groundLine() + tuft(96) + tuft(296) +
    rect(144, 52, 5, 138) + circ(146.5, 50, 4.5) + path(`M149 ${fy} C 180 ${fy - 8}, 210 ${fy + 8}, 249 ${fy} L 231 ${fy + 24} L 249 ${fy + 48} C 210 ${fy + 56}, 180 ${fy + 40}, 149 ${fy + 48} Z`);
  H.flag = () => flagScene(58);
  H.halfMast = () => flagScene(104);

  H.mountain = () => stars([[90, 50, 3], [122, 88, 2.2], [262, 44, 2.4], [334, 108, 2.2]]) + crescent(312, 66, 14) +
    path('M-40 190 L92 112 L148 166 L244 166 L300 112 L432 190 Z', DIM) + path('M96 190 L196 62 L296 190 Z') +
    line('M140 186 C 166 172, 150 154, 176 142 C 198 132, 180 114, 192 98 C 198 90, 194 80, 196 72', GROUND, 2.2, ' stroke-dasharray="3 6"') +
    rect(194.5, 38, 3, 26, 1.5) + path('M197.5 40 H221 L214.5 47 L221 54 H197.5 Z') + groundLine();

  H.lighthouse = () => stars([[80, 46, 3], [128, 54, 2], [266, 34, 2.4], [348, 124, 2.4], [52, 120, 2.2]]) + crescent(332, 38, 12) +
    path('M184 84 L14 60 V108 Z M208 84 L378 60 V108 Z', INK, op(0.12)) +
    rect(-40, 183.25, 473, 1.5, 0.75, MID) +
    line('M30 198 q8 -5 16 0 t16 0 t16 0 M262 198 q8 -5 16 0 t16 0 t16 0 M76 210 q8 -5 16 0 t16 0 M228 210 q8 -5 16 0 t16 0 t16 0 M146 220 q8 -5 16 0 t16 0 t16 0 t16 0', DIM, 2.2) +
    path('M300 184 l5 7 h26 l5 -7 z', DIM) + rect(317, 158, 2.4, 26, 1, DIM) + path('M321 160 L336 180 H321 Z', DIM) +
    path('M118 190 C 136 180, 164 176, 196 176 C 228 176, 256 180, 274 190 Z') +
    path('M182 101 L210 101 L217 180 L175 180 Z') + path('M180.5 118 H211.5 L212.4 128 H179.6 Z M178.5 140 H213.5 L214.3 150 H177.7 Z', GROUND) +
    rect(193, 106, 6, 8, 3, GROUND) + rect(191, 160, 10, 16, 5, GROUND) +
    rect(170, 94, 52, 7, 2) + rect(184, 74, 24, 20) + rect(188, 78, 16, 12, 0, GROUND) + circ(196, 84, 3.5) + path('M182 74 Q196 58 210 74 Z') + rect(194.8, 58, 2.4, 6) + circ(196, 57, 2.5);

  H.campfire = () => stars([[112, 50, 3], [284, 48, 2.6], [326, 96, 2.2], [66, 104, 2.2]]) + crescent(82, 64, 10) + wisp(196, 50, 22, 1, MID, 2.2) +
    groundLine() + tuft(40) + tuft(354) +
    rect(62, 168, 48, 20, 10, DIM) + circ(100, 178, 6, 'none', outline(GROUND, 2)) + rect(282, 168, 48, 20, 10, DIM) + circ(292, 178, 6, 'none', outline(GROUND, 2)) +
    rect(136, 166, 120, 16, 8, INK, ' transform="rotate(-14 196 174)"') + rect(136, 166, 120, 16, 8, INK, ' transform="rotate(14 196 174)"') +
    [126, 146, 246, 266].map(x => pebble(x, 187, 7, INK)).join('') +
    path('M196 60 C 214 84, 238 104, 236 134 C 234 158, 216 170, 196 170 C 176 170, 158 158, 156 134 C 154 104, 178 84, 196 60 Z', INK, cut(1.5)) +
    path('M196 104 C 204 116, 214 126, 213 140 C 212 152, 204 158, 196 158 C 188 158, 180 152, 179 140 C 178 126, 188 116, 196 104 Z', GROUND) +
    path('M196 128 C 200 134, 204 138, 203 144 C 202 150, 199 152, 196 152 C 193 152, 190 150, 189 144 C 188 138, 192 134, 196 128 Z') +
    stars([[154, 88, 2], [242, 96, 1.8], [166, 66, 1.6], [230, 70, 1.4]]);

  H.balloon = () => cloud(72, 108, 1.1) + cloud(284, 136, 0.9) + farHills() +
    ell(196, 100, 44, 52) + line('M168 86 C 168 72, 176 62, 188 58', GROUND, 4) + path('M190 152 L202 152 L196 161 Z') + line('M196 161 C 186 172, 206 178, 196 190', INK, 2.5);

  H.umbrella = () => {
    const dim = [[40, 64], [62, 98], [84, 54], [52, 142], [88, 128], [70, 176], [352, 64], [330, 98], [308, 54], [340, 142], [304, 128], [322, 176], [150, 30], [244, 30]];
    const ink = [[106, 90], [286, 90], [98, 156], [294, 156]];
    return line(dim.map(([x, y]) => `M${x} ${y} l-5 12`).join(' '), DIM, 2.2) + line(ink.map(([x, y]) => `M${x} ${y} l-5 12`).join(' '), INK, 3) +
      ell(196, 198, 104, 6, DIM) + line('M152 199 q44 -7 88 0', MID, 1.5) + line('M100 196 l-3 -8 M106 196 l3 -8 M286 196 l-3 -8 M292 196 l3 -8', MID, 2) +
      rect(193, 44, 6, 10, 2) + path('M120 124 A76 76 0 0 1 272 124 Z') + [0, 1, 2, 3, 4, 5].map(i => path(`M${n(120 + i * 25.33)} 124 a12.67 8 0 0 0 25.33 0 z`)).join('') +
      line('M196 58 L145.33 124 M196 58 V124 M196 58 L246.67 124', GROUND, 2) + rect(194, 128, 4, 46) + line('M196 174 c0 14 -18 14 -18 0', INK, 4);
  };

  H.thunderCloud = () => cloud(56, 84, 1) + cloud(298, 70, 1.1) + line('M62 104 l-4 10 M80 108 l-4 10 M306 92 l-4 10 M326 96 l-4 10', DIM, 2.2) +
    `<g fill="${INK}">${circ(149, 122, 26)}${circ(179, 100, 34)}${circ(213, 96, 38)}${circ(243, 122, 26)}${rect(123, 122, 146, 28, 14)}</g>` +
    path('M200 150 L182 180 H196 L188 204 L216 170 H202 L212 150 Z', INK, cut(1.5)) +
    [[154, 170], [170, 190], [228, 190], [244, 170]].map(([x, y]) => path(`M${x} ${y - 7} C ${x + 4.5} ${y - 1}, ${x + 4.5} ${y + 4}, ${x} ${y + 5} C ${x - 4.5} ${y + 4}, ${x - 4.5} ${y - 1}, ${x} ${y - 7} Z`)).join('');

  // ── on the table ──
  H.notebook = () => table(72, 320) +
    path('M96 110 Q148 100 196 114 Q244 100 296 110 V186 Q246 178 196 190 Q146 178 96 186 Z', DIM) +
    path('M102 106 Q150 96 194 110 V186 Q150 174 102 182 Z') + path('M290 106 Q242 96 198 110 V186 Q242 174 290 182 Z') +
    line('M114 122 Q150 112 182 124 M114 136 Q150 126 182 138 M114 150 Q150 140 182 152 M114 164 Q136 157 156 160', GROUND, 2.4) +
    line('M278 122 Q242 112 210 124 M278 136 Q242 126 210 138 M278 150 Q242 140 210 152', GROUND, 2.4) +
    path('M258 102 H266 V192 L262 187.5 L258 192 Z', DIM);

  const spine = (x, y, w, h, c = true) => rect(x, y, w, h, 3, INK, c ? cut(1.5) : '') + line(`M${x + 9} ${y + 4} V${y + h - 4} M${x + w - 9} ${y + 4} V${y + h - 4}`, GROUND, 2.2) + rect(x + w / 2 - 22, y + h / 2 - 3, 44, 6, 3, GROUND);
  H.books = () => table(84, 308) + spine(112, 160, 172, 28, false) + spine(126, 133, 148, 27) + g('rotate(-2.5 197 119)', spine(120, 107, 154, 25)) + path('M264 117 H271 L272.5 168 L268.75 163 L265 168 Z', DIM);

  H.twoCups = () => table(72, 320) + wisp(137, 124, 18, 1) + wisp(149, 119, 13, -1) + wisp(241, 129, 14, -1) + wisp(253, 125, 18, 1) +
    rect(118, 132, 50, 56, 8) + line('M118 146 h-8 a11 11 0 0 0 0 22 h8', INK, 7) + rect(125, 139, 36, 3.5, 1.75, GROUND) +
    rect(224, 138, 46, 50, 8) + line('M270 150 h8 a10 10 0 0 1 0 20 h-8', INK, 7) + rect(231, 145, 32, 3.5, 1.75, GROUND);

  H.cake = () => {
    const conf = [[104, 118, 0], [109.5, 86.5, 1], [131, 53, 0], [164.5, 31.5, 1], [227.5, 31.5, 0], [261, 53, 1], [282.5, 86.5, 0], [288, 118, 1]];
    const confetti = conf.map(([x, y, t], i) => t ? circ(x, y, 2.6, DIM) : rect(x - 2.5, y - 4.5, 5, 9, 1.5, DIM, ` transform="rotate(${[-30, 0, 40, 0, -40, 0, 30, 0][i]} ${x} ${y})"`)).join('');
    const drips = (x1, x2, y, k) => { const s = (x2 - x1) / k; let d = `M${x1} ${y}`; for (let i = 0; i < k; i++) d += ` q${n(s / 2)} 7 ${n(s)} 0`; return line(d, GROUND, 2.6); };
    return table(84, 308) + confetti +
      rect(118, 182, 156, 6, 3) + rect(134, 134, 124, 46, 8) + drips(139, 253, 147, 8) + rect(158, 104, 76, 28, 6) + drips(163, 229, 115, 6) +
      [179, 196, 213].map(x => rect(x - 3, 80, 6, 24, 1.5) + path(`M${x} 59 c5 6 7 11 0 17 c-7 -6 -5 -11 0 -17 z`)).join('');
  };

  H.kettle = () => table(84, 308) + wisp(287, 106, 22, 1, MID, 2.6) + wisp(298, 99, 14, -1, MID, 2.4) +
    line('M174 112 C 174 78, 218 78, 218 112', INK, 8) +
    path('M138 184 C 140 142, 160 118, 196 118 C 232 118, 252 142, 254 184 Z') + rect(170, 110, 52, 12, 6) + circ(196, 104, 6) +
    path('M244 150 L282 116 L294 126 L252 170 Z') + rect(132, 180, 128, 8, 4, INK, cut(1.5)) +
    line('M160 152 C 160 138, 166 130, 174 126', GROUND, 3) +
    wisp(106, 152, 14, 1) + wisp(116, 148, 10, -1) + rect(96, 160, 30, 28, 5) + rect(101, 165, 20, 3, 1.5, GROUND) + line('M96 168 h-6 a8 8 0 0 0 0 16 h6', INK, 4);

  H.plant = () => table(80, 312) +
    line('M196 136 V64', INK, 4) +
    ell(172, 112, 24, 10, INK, ' transform="rotate(-32 172 112)"') + ell(220, 98, 24, 10, INK, ' transform="rotate(32 220 98)"') + ell(176, 80, 18, 8, INK, ' transform="rotate(-36 176 80)"') + ell(214, 70, 18, 8, INK, ' transform="rotate(36 214 70)"') + ell(196, 54, 8, 16) +
    line('M156 122 L190 101 M236 108 L203 88 M164 89 L188 71 M228 79 L203 61 M196 66 V44', GROUND, 2) +
    rect(148, 134, 96, 13, 5) + path('M154 147 H238 L230 188 H162 Z') + line('M154 148.5 H238', GROUND, 2.5) + line('M170 157 L167 178', GROUND, 2.6) +
    path('M262 188 L265 168 H287 L290 188 Z', DIM) + sprig(276, 168);

  H.hourglass = () => table(84, 308) +
    rect(154, 71, 5, 106, 2) + rect(233, 71, 5, 106, 2) +
    path('M175 100 Q196 110 217 100 C214 112 202 115 200 126 L192 126 C190 115 178 112 175 100 Z', MID) + line('M196 128 V160', MID, 2.2) + path('M172 177 C178 165 188 158 196 156 C204 158 214 165 220 177 Z', MID) +
    line('M164 71 H228 C228 106 202 113 200 126 C202 139 228 146 228 177 H164 C164 146 190 139 192 126 C190 113 164 106 164 71 Z', INK, 4) +
    rect(148, 60, 96, 11, 3.5) + rect(148, 177, 96, 11, 3.5, INK, cut(1.5));

  H.scale = () => table(84, 308) +
    rect(172, 176, 48, 12, 4) + rect(193, 84, 6, 92) + circ(196, 80, 5) +
    line('M118 98 L96 140 M118 98 L140 140 M274 84 L252 126 M274 84 L296 126', INK, 1.8) +
    line('M118 98 L274 84', INK, 5) + circ(196, 91, 6.5) + circ(196, 91, 2.4, GROUND) +
    path('M92 140 H144 Q118 158 92 140 Z') + path('M248 126 H300 Q274 144 248 126 Z') +
    rect(106, 118, 24, 22, 3, INK, cut(1.5)) + rect(113, 112, 10, 7, 2, INK, cut(1.5)) +
    path('M258 126 C 260 110, 276 102, 292 104 C 290 118, 278 126, 258 126 Z', INK, cut(1.5)) + line('M262 123 L287 107', GROUND, 1.5);

  const DOM = (() => { const hs = [40, 50, 60, 72, 86], gaps = [18, 22, 26, 30]; let x = 82; return hs.map((h, i) => { const w = n(h * 0.42); const o = { x, w, h }; x += w + (gaps[i] || 0); return o; }); })();
  const pipLayout = { 1: [[0.5, 0.5]], 2: [[0.28, 0.28], [0.72, 0.72]], 3: [[0.26, 0.26], [0.5, 0.5], [0.74, 0.74]] };
  const domino = ({ x, w, h }, top, bot) => {
    const y = 188 - h, half = h / 2, pr = n(w * 0.09);
    const pips = (k, y0) => pipLayout[k].map(([u, v]) => circ(x + u * w, y0 + 3 + v * (half - 6), pr, GROUND)).join('');
    return rect(x, y, w, h, n(Math.max(3, w * 0.16))) + rect(x + w * 0.2, y + half - 1, w * 0.6, 2, 1, GROUND) + pips(top, y) + pips(bot, y + half);
  };
  const domFaces = [[1, 2], [2, 3], [3, 1], [2, 2], [1, 3]];
  H.dominoes = () => table(62, 330) + DOM.map((d, i) => domino(d, ...domFaces[i])).join('');
  H.dominoes2 = () => { const d0 = DOM[0], px = d0.x + d0.w, th = n(Math.asin(18 / d0.h) * 180 / Math.PI); return table(62, 330) + line(`M${d0.x - 4} 140 A40 40 0 0 1 ${d0.x + 26} 126`, MID, 2.4) + path(`M${d0.x + 24} 120 l5 6.5 l-8 2 z`, MID) + g(`rotate(${th} ${n(px)} 188)`, domino(d0, ...domFaces[0])) + DOM.slice(1).map((d, i) => domino(d, ...domFaces[i + 1])).join(''); };

  H.envelope = () => shadow(197, 66, 206) + g('rotate(-5 197 146)',
    rect(122, 102, 150, 88, 8) + line('M132 112 L197 158 L262 112', GROUND, 3.4) + line('M132 180 L176 146 M262 180 L218 146', GROUND, 2.2) +
    circ(197, 158, 10) + circ(197, 158, 6, 'none', outline(GROUND, 1.8)));

  H.envelopeOpen = () => shadow(197, 66, 206) + g('rotate(4 197 140)',
    path('M122 118 L197 66 L272 118 V184 a6 6 0 0 1 -6 6 H128 a6 6 0 0 1 -6 -6 Z', DIM) +
    rect(150, 60, 94, 110, 4) + line('M164 80 H230 M164 96 H230 M164 112 H212', GROUND, 3) +
    path('M122 118 L197 166 L272 118 V184 a6 6 0 0 1 -6 6 H128 a6 6 0 0 1 -6 -6 Z', INK, cut(2)) +
    line('M128 184 L176 150 M266 184 L218 150', GROUND, 2.2));

  H.clipboard = () => table(80, 312) +
    rect(132, 70, 128, 118, 10) + rect(142, 86, 108, 94, 5, GROUND) + rect(170, 60, 52, 20, 6, INK, cut(1.5)) + rect(186, 65, 20, 6, 3, GROUND) +
    rect(154, 100, 14, 14, 4) + line('M157.5 107 l3 3 l5.5 -6', GROUND, 2) + rect(178, 104, 54, 6, 3) +
    rect(154, 124, 14, 14, 4) + line('M157.5 131 l3 3 l5.5 -6', GROUND, 2) + rect(178, 128, 42, 6, 3) +
    rect(155, 149, 12, 12, 3, 'none', outline(INK, 2)) + rect(178, 152, 58, 6, 3) +
    g('translate(282 186) rotate(-102.5)', rect(0, -5, 16, 10, 2.5) + rect(13, -5, 3, 10, 0, GROUND) + rect(16, -5, 58, 10, 1.5) + path('M74 -5 L92 0 L74 5 Z') + path('M86 -1.7 L92 0 L86 1.7 Z', GROUND));

  H.feedOff = () => table(84, 308) +
    rect(150, 50, 74, 138, 13) + rect(155, 58, 64, 118, 7, GROUND) + rect(178, 63, 18, 5, 2.5) +
    rect(163, 76, 48, 24, 5, DIM) + rect(163, 106, 48, 24, 5, DIM) + rect(163, 136, 48, 24, 5, DIM2) +
    line('M222 150 V140 a14 14 0 0 1 28 0 V150', GROUND, 12) + line('M222 150 V140 a14 14 0 0 1 28 0 V150', INK, 6) +
    rect(214, 148, 44, 38, 7, INK, cut(2)) + circ(236, 163, 4.5, GROUND) + rect(234, 165, 4, 9, 2, GROUND);

  H.match = () => shadow(196, 36, 202) +
    circ(150, 78, 2, MID) + circ(242, 64, 2.4, MID) + circ(236, 106, 1.8, MID) + circ(158, 112, 1.6, MID) +
    rect(190, 104, 12, 88, 3) + ell(196, 106, 10, 12, INK, cut(1.5)) +
    path('M196 40 C 206 54, 220 66, 218 82 C 216 96, 206 100, 196 100 C 186 100, 176 96, 174 82 C 172 66, 186 54, 196 40 Z') +
    path('M196 64 C 201 72, 206 78, 205 84 C 204 90, 200 93, 196 93 C 192 93, 188 90, 187 84 C 186 78, 191 72, 196 64 Z', GROUND);

  H.chartUp = () => floor() +
    line('M196 60 V190', DIM, 5) + line('M178 58 L142 190 M214 58 L250 190', INK, 6) +
    rect(112, 62, 168, 104, 8) + rect(120, 70, 152, 88, 4, GROUND) + rect(186, 52, 20, 14, 3, INK, cut(1.5)) + rect(116, 166, 160, 7, 3) +
    line('M130 92 H262 M130 114 H262 M130 136 H262', TILE, 1.5) +
    line('M134 146 L258 84', MID, 2, ' stroke-dasharray="2 7"') +
    line('M134 146 L152 128 L166 138 L186 112 L202 124 L222 100 L238 110 L258 84', INK, 4) + circ(258, 84, 6);

  // ── symbols & objects ──
  const pencilLocal = () => rect(0, 0, 18, 24, 4) + rect(14, 0, 4, 24, 0, GROUND) + rect(18, 0, 104, 24, 2) + line('M30 12 H112', GROUND, 1.6) + path('M122 0 L148 12 L122 24 Z') + path('M138 7.4 L148 12 L138 16.6 Z', GROUND);
  H.pencil = () => g('rotate(-3 196 164)', rect(92, 122, 208, 84, 4, DIM) + line('M108 142 H284 M108 158 H284 M108 174 H284 M108 190 H284', GROUND, 1.6)) +
    line('M112 176 C 126 162, 142 190, 160 176 C 176 164, 190 186, 208 174 C 222 166, 234 176, 246 166', INK, 3) +
    g('translate(131.65 71.28) rotate(35)', pencilLocal());

  const penLocal = () => rect(0, 0, 128, 24, 12) + rect(86, 0, 4, 24, 0, GROUND) + rect(10, 0, 5, 24, 0, GROUND) + path('M127 2 L164 12 L127 22 Z') + line('M142 12 H158', GROUND, 2) + circ(139, 12, 2.6, GROUND);
  H.fountainPen = () => g('rotate(-3 210 162)', rect(110, 120, 200, 84, 4, DIM) + line('M126 140 H294 M126 156 H294 M126 172 H294 M126 188 H294', GROUND, 1.6)) +
    line('M128 176 C 144 162, 160 190, 178 176 C 194 164, 210 186, 228 174 C 242 166, 252 174, 262 166', INK, 3) +
    g('translate(134.6 62.1) rotate(35)', penLocal());

  H.calendar = () => {
    let dots = '';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { const i = r * 7 + c, x = 143 + c * 17.67, y = 118 + r * 24; dots += circ(x, y, 3.6, i <= 11 ? INK : DIM); if (i === 11) dots += circ(x, y, 9, 'none', outline(INK, 2.4)); }
    const ring = x => rect(x, 56, 10, 28, 5, INK, cut(1.5)) + rect(x + 3, 60, 4, 20, 2, GROUND);
    return circ(196, 40, 3) + line('M196 42 L157 60 M196 42 L235 60', INK, 1.6) +
      rect(124, 70, 144, 120, 12) + rect(132, 102, 128, 80, 6, GROUND) + rect(172, 82, 48, 6, 3, GROUND) + ring(150) + ring(232) + dots;
  };

  H.compass = () => g('rotate(-5 196 136)',
      rect(86, 60, 220, 150, 4, DIM) +
      line('M106 186 C 130 168, 140 190, 160 172 C 196 140, 230 100, 278 88', GROUND, 2.5, ' stroke-dasharray="4 6"') +
      circ(106, 186, 5) + line('M282 76 l12 12 M294 76 l-12 12', INK, 3) +
      line('M108 84 c8 -4 14 2 20 0 M114 96 c6 -3 12 1 18 0', GROUND, 2) + path('M248 196 l6 -14 l6 14 z M262 198 l5 -10 l5 10 z', GROUND)) +
    circ(196, 66, 8, 'none', outline(INK, 4)) + rect(190, 72, 12, 10) +
    circ(196, 134, 58) + circ(196, 134, 48, GROUND) +
    line('M196 90 V96 M240 134 H234 M196 178 V172 M152 134 H158', INK, 3) +
    line([45, 135, 225, 315].map(a => { const [x1, y1] = polar(196, 134, 39, a), [x2, y2] = polar(196, 134, 42, a); return `M${n(x1)} ${n(y1)} L${n(x2)} ${n(y2)}`; }).join(' '), DIM, 2) +
    path('M196 100 L205 134 H187 Z') + path('M196 168 L205 134 H187 Z', MID) + circ(196, 134, 6) + circ(196, 134, 2.5, GROUND);

  H.idCard = () => line('M172 24 L190 76 M220 24 L202 76', DIM, 8) +
    rect(186, 72, 20, 14, 3) + rect(124, 88, 144, 102, 12) + rect(182, 94, 28, 6, 3, GROUND) + rect(132, 106, 128, 76, 7, GROUND) +
    circ(166, 144, 20) + circ(166, 137, 7, GROUND) + path('M152 160 a14 13 0 0 1 28 0 z', GROUND) +
    rect(198, 128, 46, 6, 3) + rect(198, 142, 32, 6, 3) + rect(198, 156, 40, 6, 3);

  H.stopwatch = () => {
    let ticks = '';
    for (let i = 0; i < 12; i++) { const [x1, y1] = polar(196, 130, 40, i * 30), [x2, y2] = polar(196, 130, 45, i * 30); ticks += line(`M${n(x1)} ${n(y1)} L${n(x2)} ${n(y2)}`, INK, i % 3 ? 2 : 3.5); }
    return shadow(196, 64, 202) + line('M112 106 H84 M118 130 H76 M112 154 H84', MID, 2.4) +
      rect(186, 50, 20, 8, 3) + rect(190, 56, 12, 14) + rect(238, 68, 10, 18, 2, INK, ' transform="rotate(45 243 77)"') +
      circ(196, 130, 60) + circ(196, 130, 49, GROUND) + path('M196 130 L196 86 A44 44 0 0 1 240 130 Z', DIM) + ticks +
      line('M196 130 L232 130', INK, 4) + circ(196, 130, 6) + circ(196, 130, 2.5, GROUND);
  };

  H.thermometer = () => shadow(196, 34, 204) +
    rect(182, 46, 28, 120, 14) + circ(196, 168, 22) +
    rect(189, 53, 14, 112, 7, GROUND) + circ(196, 168, 14, GROUND) +
    rect(192, 96, 8, 72, 4) + circ(196, 168, 10) +
    line('M218 66 H228 M218 82 H224 M218 98 H228 M218 114 H224 M218 130 H228 M218 146 H224', INK, 2.5) +
    line('M150 96 l8 -8 l8 8', MID, 3) + line('M150 120 l8 8 l8 -8', MID, 3);

  H.bubbles = () => {
    const B = 'M192 112 H266 A14 14 0 0 1 280 126 V154 A14 14 0 0 1 266 168 H264 L268 186 L248 168 H192 A14 14 0 0 1 178 154 V126 A14 14 0 0 1 192 112 Z';
    return g('translate(-4 0)', path('M128 72 H202 A14 14 0 0 1 216 86 V114 A14 14 0 0 1 202 128 H150 L128 146 L134 128 H128 A14 14 0 0 1 114 114 V86 A14 14 0 0 1 128 72 Z') +
      line('M130 94 H188 M130 108 H168', GROUND, 3.2) +
      path(B, GROUND, outline(GROUND, 12)) + path(B, GROUND, outline(INK, 4)) +
      line('M194 134 H262 M194 148 H240', INK, 3.2));
  };

  H.brain = () => {
    const L = 'M194 72 C 184 62, 162 60, 152 72 C 136 70, 122 84, 126 100 C 112 106, 110 126, 122 136 C 116 150, 126 166, 142 166 C 150 178, 170 182, 182 172 C 188 176, 194 174, 194 168 Z';
    const mirror = d => d.replace(/(-?\d+(?:\.\d+)?)(\s|,)(\s*)(-?\d+(?:\.\d+)?)/g, (m, x, s1, s2, y) => `${n(392 - +x)}${s1}${s2}${y}`);
    const folds = 'M146 96 C 156 92, 166 98, 168 108 M134 124 C 146 120, 158 126, 160 136 M150 152 C 158 146, 170 148, 174 156 M172 78 C 178 82, 182 90, 180 98';
    const traces = 'M140 108 H112 V86 H96 M140 146 H110 V168 H96 M252 108 H280 V86 H296 M252 146 H282 V168 H296 M196 76 V44';
    return line(traces, DIM, 2.2) + [[96, 86], [96, 168], [296, 86], [296, 168], [196, 44]].map(([x, y]) => circ(x, y, 4, DIM)).join('') +
      path(L) + path(mirror(L)) + line(folds, GROUND, 2.6) + line(mirror(folds), GROUND, 2.6);
  };

  H.battery = () => shadow(196, 78, 198) + g('translate(32 0)',
    rect(88, 102, 140, 72, 13) + rect(96, 110, 124, 56, 7, GROUND) + rect(228, 122, 12, 32, 4) +
    rect(106, 118, 32, 40, 5) + rect(144, 118, 32, 40, 5) + rect(182.5, 119.5, 29, 37, 4, 'none', outline(INK, 2) + ' stroke-dasharray="3 4"') +
    path('M199.5 126 L190 140 H197 L193.5 151 L204 136 H197 Z'));

  H.bell = () => shadow(196, 64, 200) +
    circ(196, 60, 6, 'none', outline(INK, 3)) + rect(193, 64, 6, 14) +
    path('M196 76 C 164 76 150 102 150 130 V160 H242 V130 C 242 102 228 76 196 76 Z') + rect(138, 158, 116, 8, 4) + circ(196, 177, 8) +
    line('M166 130 C 167 112, 175 100, 187 93', GROUND, 3) +
    line('M128 98 L118 90 M264 98 L274 90 M120 130 H108 M272 130 H284', INK, 3);

  H.tab = () => {
    const tabs = [104, 147, 190, 233].map((x, i) => i === 2
      ? rect(x, 62, 41, 16, 4) + rect(x + 7, 68, 18, 3.5, 1.75, GROUND) + line(`M${x + 30} 66.5 l5 5 M${x + 35} 66.5 l-5 5`, GROUND, 1.8)
      : rect(x, 62, 41, 16, 4, DIM2) + rect(x + 7, 68, 22, 3.5, 1.75, DIM)).join('');
    return rect(86, 48, 220, 138, 10) + rect(95, 57, 202, 120, 4, GROUND) + tabs + line('M284 70 h8 M288 66 v8', DIM, 2) +
      rect(104, 84, 184, 8, 4, DIM2) + rect(104, 102, 100, 8, 4, DIM) + rect(104, 118, 150, 6, 3, DIM2) + rect(104, 132, 128, 6, 3, DIM2) + rect(104, 146, 64, 22, 4, DIM2) + rect(176, 146, 64, 22, 4, DIM2) +
      g('translate(223 72)', path('M0 0 V24 L6 18.5 L10.5 28 L15 26 L10.5 16.5 H18 Z', INK, cut(1.5))) +
      path('M62 186 H330 L344 198 H48 Z') + rect(170, 188, 52, 4, 2, GROUND);
  };

  H.medal = () => {
    let rays = '';
    for (let i = 0; i < 16; i++) { const [x1, y1] = polar(196.5, 146, 82, i * 22.5 + 11.25), [x2, y2] = polar(196.5, 146, i % 2 ? 90 : 94, i * 22.5 + 11.25); if (y2 > 216) continue; rays += line(`M${n(x1)} ${n(y1)} L${n(x2)} ${n(y2)}`, DIM, 2.5); }
    return rays + stars([[92, 70, 3], [302, 64, 2.6], [84, 186, 2.2], [310, 192, 2.4]]) +
      path('M170 38 H190 L210 98 L198 108 L184 94 Z', DIM) + path('M223 38 H203 L183 98 L195 108 L209 94 Z', INK, cut(1.5)) +
      circ(196.5, 146, 64, INK, cut(2)) + circ(196.5, 146, 53, 'none', outline(GROUND, 1.6)) +
      `<text x="196.5" y="170" text-anchor="middle" font-family="'Lato',-apple-system,system-ui,sans-serif" font-size="66" font-weight="700" fill="${GROUND}">V</text>`;
  };

  const SCALE = { medal: 1 };
  const svg = (k, attr = '') => `<svg data-hero="${k}"${attr} width="393" height="240" viewBox="0 0 393 240" style="position:absolute; left:0; top:0px; overflow:visible; transform:scale(${SCALE[k] || 1.1}); transform-origin:196px 190px;">${H[k]()}</svg>`;
  return { H, svg, INK, GROUND, MID, DIM, DIM2, TILE };
})();
