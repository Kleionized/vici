// VICI lesson illustrations, v5 — redrawn to match the SOS set (shelf/floor grounding, grey props, no floating parts, no motion lines).
(function () {
  const W = '#F2F0EC', G = '#55524D', D = '#3A3835', L = '#A8A39A', K = '#0D0D0D';
  const SHELF = `<rect x="84" y="188" width="224" height="7" rx="3.5" fill="${W}"></rect><rect x="96" y="195" width="6" height="14" rx="1.5" fill="${W}"></rect><rect x="290" y="195" width="6" height="14" rx="1.5" fill="${W}"></rect>`;
  const FLOOR = `<rect x="-40" y="188.5" width="473" height="3" rx="1.5" fill="${G}"></rect>`;
  const cut = `stroke="${K}" stroke-width="3" paint-order="stroke" stroke-linejoin="round"`;
  const line = (d, c = K, w = 3) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"></path>`;
  const mug = (x, fill) => `<rect x="${x}" y="160" width="28" height="28" rx="6" fill="${fill}"></rect>${line(`M${x} 167 h-5 a7 7 0 0 0 0 14 h5`, fill, 4.5)}`;
  const books = x => `<rect x="${x}" y="176" width="58" height="12" rx="2" fill="${G}"></rect><rect x="${x + 4}" y="165" width="50" height="11" rx="2" fill="${L}" ${cut}></rect>`;
  const dom = (x, h, rot) => {
    const y = 188 - h, cx = x + 12;
    const body = `<rect x="${x}" y="${y}" width="24" height="${h}" rx="4" fill="${W}" ${cut}></rect><rect x="${x + 5}" y="${y + h / 2 - 1.2}" width="14" height="2.4" rx="1.2" fill="${K}"></rect><circle cx="${cx}" cy="${y + h / 4}" r="3" fill="${K}"></circle><circle cx="${cx - 5}" cy="${y + h * 0.66}" r="2.6" fill="${K}"></circle><circle cx="${cx + 5}" cy="${y + h * 0.84}" r="2.6" fill="${K}"></circle>`;
    return rot ? `<g transform="rotate(${rot} ${x + 24} 188)">${body}</g>` : body;
  };
  const pad = (spiral) => `<rect x="142" y="${spiral ? 78 : 82}" width="104" height="${spiral ? 110 : 106}" rx="${spiral ? 6 : 3}" fill="${W}"></rect>` +
    (spiral ? [156, 172, 188, 204, 220, 236].map(x => `<circle cx="${x - 2}" cy="80" r="4.2" fill="${L}" ${cut}></circle>`).join('') : `<path d="M226 82 H246 V102 Z" fill="${L}"></path>`) +
    line('M156 122 H232 M156 138 H232 M156 154 H232 M156 170 H206', K, 2.2) +
    line('M157 104 c5 -7 9 5 14 0 s9 5 14 0 s9 5 14 0 s7 4 11 0', G, 2.8);
  const pencilAt = `<g transform="translate(250 184) rotate(-52)"><rect x="0" y="-6.5" width="80" height="13" rx="2.5" fill="${W}" ${cut}></rect><rect x="0" y="-6.5" width="11" height="13" rx="2.5" fill="${L}"></rect><rect x="11" y="-6.5" width="4" height="13" fill="${G}"></rect><path d="M80 -6.5 L97 0 L80 6.5 Z" fill="${W}" ${cut}></path><path d="M92 -1.9 L97 0 L92 1.9 Z" fill="${K}"></path></g>`;
  const fpenAt = `<g transform="translate(250 184) rotate(-52)"><rect x="0" y="-7" width="62" height="14" rx="5" fill="${G}" ${cut}></rect><rect x="40" y="-7" width="5" height="14" fill="${L}"></rect><rect x="62" y="-5.5" width="12" height="11" rx="2" fill="${W}"></rect><path d="M74 -5.5 L98 0 L74 5.5 Z" fill="${W}"></path>${line('M80 0 H95', K, 1.8)}<circle cx="80" cy="0" r="1.8" fill="${K}"></circle></g>`;

  window.LESSON_VIZ_V5 = {
    calendar: SHELF +
      `<path d="M150 188 L160 98 H234 L244 188 Z" fill="${G}"></path><rect x="146" y="100" width="102" height="88" rx="8" fill="${W}"></rect><path d="M146 108 a8 8 0 0 1 8 -8 h86 a8 8 0 0 1 8 8 v14 h-102 Z" fill="${L}"></path>` +
      `<rect x="168" y="91" width="6" height="17" rx="3" fill="${W}" ${cut}></rect><rect x="220" y="91" width="6" height="17" rx="3" fill="${W}" ${cut}></rect>` +
      [132, 148, 164].map((y, r) => [158, 174, 190, 206, 222].slice(0, r === 2 ? 3 : 5).map(x => `<rect x="${x}" y="${y}" width="12" height="8" rx="2" fill="${K}"></rect>`).join('')).join('') +
      `<circle cx="212" cy="152" r="10" fill="none" stroke="${K}" stroke-width="2.6"></circle>`,

    compass: SHELF + `<g transform="translate(-29.5 0)">` +
      `<path d="M210 188 L216 168 H236 L242 188 Z" fill="${G}"></path>` +
      `<circle cx="226" cy="78" r="7" fill="none" stroke="${W}" stroke-width="4"></circle><rect x="222" y="82" width="8" height="8" rx="2" fill="${W}"></rect>` +
      `<circle cx="226" cy="128" r="44" fill="${W}"></circle><circle cx="226" cy="128" r="35" fill="${K}"></circle>` +
      line('M226 97 v6 M226 153 v6 M195 128 h6 M251 128 h6', L, 3) +
      `<path d="M226 101 L234 128 L218 128 Z" fill="${W}"></path><path d="M226 155 L234 128 L218 128 Z" fill="${G}"></path><circle cx="226" cy="128" r="4.5" fill="${K}" stroke="${W}" stroke-width="2.2"></circle></g>`,

    scale: SHELF +
      `<rect x="166" y="178" width="61" height="10" rx="4" fill="${W}"></rect><rect x="192" y="74" width="9" height="108" rx="3" fill="${W}"></rect><circle cx="196.5" cy="72" r="7" fill="${W}"></circle>` +
      `<g transform="rotate(-6 196.5 84)"><rect x="122" y="80.5" width="149" height="7" rx="3.5" fill="${W}"></rect></g>` +
      line('M124 92 L104 146 M124 92 L144 146 M269 77 L249 131 M269 77 L289 131', L, 2.4) +
      `<rect x="111" y="129" width="26" height="17" rx="3" fill="${G}"></rect><circle cx="269" cy="124" r="7" fill="${L}"></circle>` +
      `<path d="M96 146 H152 C 150 161, 98 161, 96 146 Z" fill="${W}"></path><path d="M241 131 H297 C 295 146, 243 146, 241 131 Z" fill="${W}"></path>`,

    envelope: SHELF +
      `<rect x="186" y="84" width="112" height="70" rx="5" fill="${L}"></rect>` +
      `<rect x="170" y="98" width="124" height="76" rx="6" fill="${W}" ${cut}></rect>` + line('M176 104 L232 140 L288 104', K, 3.2) +
      `<circle cx="232" cy="140" r="7" fill="${L}" ${cut}></circle>` +
      `<path d="M160 188 L164 152 H300 L304 188 Z" fill="${G}"></path>`,

    chartUp: SHELF +
      `<rect x="188" y="160" width="17" height="22" fill="${G}"></rect><rect x="166" y="180" width="61" height="8" rx="4" fill="${G}"></rect>` +
      `<rect x="118" y="66" width="157" height="98" rx="10" fill="${W}"></rect><rect x="127" y="75" width="139" height="80" rx="4" fill="${K}"></rect>` +
      [[140, 16], [162, 26], [184, 22], [206, 38], [228, 52]].map(([x, h], i) => `<rect x="${x}" y="${146 - h}" width="15" height="${h}" rx="2" fill="${i === 4 ? W : G}"></rect>`).join('') +
      line('M235.5 84 v-7 M230 82 l5.5 -5.5 5.5 5.5', W, 2.6),

    umbrella: `<rect x="92" y="187" width="230" height="3" rx="1.5" fill="${G}"></rect>` +
      `<g fill="${G}"><circle cx="112" cy="54" r="10"></circle><circle cx="126" cy="48" r="14"></circle><circle cx="142" cy="54" r="10"></circle><rect x="110" y="54" width="34" height="10" rx="5"></rect></g>` +
      `<g fill="${G}"><circle cx="270" cy="44" r="8"></circle><circle cx="281" cy="39" r="11"></circle><circle cx="294" cy="44" r="8"></circle><rect x="268" y="44" width="28" height="8" rx="4"></rect></g>` +
      [[118, 84], [138, 100], [100, 112], [282, 72], [300, 96], [270, 104]].map(([x, y]) => `<path d="M${x} ${y} c3 5 4.5 8 0 10.5 c-4.5 -2.5 -3 -5.5 0 -10.5 Z" fill="${L}"></path>`).join('') +
      `<rect x="194" y="52" width="5" height="12" rx="2" fill="${W}"></rect>` +
      `<path d="M120 120 C 124 82, 158 62, 196.5 62 C 235 62, 269 82, 273 120 Q 254 108, 235 120 Q 216 108, 196.5 120 Q 177 108, 158 120 Q 139 108, 120 120 Z" fill="${W}"></path>` +
      line('M196.5 64 C 184 80, 178 98, 177 113 M196.5 64 C 209 80, 215 98, 216 113 M196.5 64 V116', K, 2.6) +
      `<rect x="194.5" y="118" width="4" height="52" fill="${W}"></rect>` + line('M196.5 168 v9 a8.5 8.5 0 0 1 -17 0', W, 4.5),

    stopwatch: SHELF +
      `<path d="M180 188 L186 170 H207 L213 188 Z" fill="${G}"></path>` +
      `<rect x="188" y="62" width="17" height="10" rx="3" fill="${W}"></rect><rect x="192" y="70" width="9" height="9" fill="${W}"></rect><g transform="rotate(42 196.5 126)"><rect x="191.5" y="69" width="10" height="11" rx="2" fill="${W}"></rect></g>` +
      `<circle cx="196.5" cy="126" r="50" fill="${W}"></circle><circle cx="196.5" cy="126" r="40" fill="${K}"></circle><path d="M196.5 126 L196.5 86 A40 40 0 0 1 236.5 126 Z" fill="${G}"></path>` +
      line('M196.5 158 v7 M158 126 h7', L, 3) + line('M196.5 126 L196.5 93', W, 4) + `<circle cx="196.5" cy="126" r="5" fill="${W}"></circle>`,

    brain: SHELF +
      `<rect x="170" y="176" width="53" height="12" rx="4" fill="${G}"></rect><rect x="189" y="152" width="15" height="26" fill="${G}"></rect>` +
      `<path d="M194 76 C 176 70, 154 74, 146 90 C 132 94, 128 112, 136 124 C 130 138, 140 154, 158 154 C 166 164, 184 164, 194 156 Z" fill="${W}"></path>` +
      `<path d="M199 76 C 217 70, 239 74, 247 90 C 261 94, 265 112, 257 124 C 263 138, 253 154, 235 154 C 227 164, 209 164, 199 156 Z" fill="${W}"></path>` +
      line('M150 104 C 160 100 168 106 176 102 M142 126 C 154 122 160 130 172 126 M160 144 C 168 138 178 142 186 136 M176 86 C 178 94 186 96 186 104', K, 3) +
      line('M243 104 C 233 100 225 106 217 102 M251 126 C 239 122 233 130 221 126 M233 144 C 225 138 215 142 207 136 M217 86 C 215 94 207 96 207 104', K, 3),

    thermometer: SHELF +
      `<rect x="176" y="176" width="41" height="12" rx="4" fill="${G}"></rect>` +
      `<rect x="184" y="58" width="25" height="112" rx="12.5" fill="${W}"></rect><circle cx="196.5" cy="164" r="19" fill="${W}"></circle>` +
      `<rect x="192" y="70" width="9" height="94" rx="4.5" fill="${K}"></rect><rect x="192" y="112" width="9" height="52" rx="4.5" fill="${L}"></rect><circle cx="196.5" cy="164" r="11.5" fill="${L}"></circle>` +
      line('M215 80 h9 M215 96 h6 M215 112 h9 M215 128 h6 M215 144 h9', W, 3),

    battery: SHELF +
      `<rect x="282" y="94" width="28" height="36" rx="6" fill="${G}"></rect><rect x="290" y="102" width="12" height="16" rx="3" fill="${W}"></rect>` +
      line('M256 154 C 282 154, 296 146, 296 118', W, 3.2) +
      `<rect x="134" y="120" width="112" height="68" rx="12" fill="${W}"></rect><rect x="246" y="140" width="10" height="28" rx="3" fill="${W}"></rect>` +
      `<rect x="144" y="130" width="92" height="48" rx="6" fill="${K}"></rect><rect x="150" y="136" width="22" height="36" rx="3" fill="${W}"></rect><rect x="178" y="136" width="22" height="36" rx="3" fill="${W}"></rect>` +
      `<path d="M220 137 L208 157 H216 L212 171 L226 150 H218 Z" fill="${L}"></path>`,

    dominoes: SHELF + [[116, 44], [150, 56], [184, 68], [218, 80], [252, 92]].map(([x, h]) => dom(x, h)).join(''),
    dominoes2: SHELF + dom(116, 44, 24) + [[150, 56], [184, 68], [218, 80], [252, 92]].map(([x, h]) => dom(x, h)).join(''),

    pencil: SHELF + pad(true) + pencilAt,
    fountainPen: SHELF + pad(false) + fpenAt,

    idCard: `<rect x="150" y="36" width="93" height="8" rx="4" fill="${G}"></rect><rect x="191" y="38" width="11" height="14" rx="3" fill="${L}"></rect>` +
      line('M196.5 50 L189 106 M196.5 50 L204 106', W, 5) +
      `<rect x="146" y="112" width="101" height="68" rx="8" fill="${W}"></rect><rect x="186" y="104" width="21" height="14" rx="3" fill="${L}" ${cut}></rect>` +
      `<circle cx="173" cy="150" r="15" fill="${K}"></circle><circle cx="173" cy="146" r="5.5" fill="${W}"></circle><path d="M163 161 a10 8 0 0 1 20 0 Z" fill="${W}"></path>` +
      `<rect x="197" y="138" width="38" height="5" rx="2.5" fill="${K}"></rect><rect x="197" y="150" width="28" height="5" rx="2.5" fill="${K}"></rect><rect x="197" y="162" width="34" height="5" rx="2.5" fill="${L}"></rect>`,

    stairs: FLOOR +
      `<path d="M110 188 V166 H146 V144 H182 V122 H218 V100 H254 V78 H290 V188 Z" fill="${G}"></path>` +
      [0, 1, 2, 3, 4].map(i => `<rect x="${110 + 36 * i}" y="${164 - 22 * i}" width="36" height="4" rx="1.5" fill="${W}"></rect>`).join('') +
      line([0, 1, 2, 3, 4].map(i => `M${128 + 36 * i} ${164 - 22 * i} v-32`).join(' '), W, 3) + line('M128 132 L272 44', W, 4),

    match: SHELF +
      `<rect x="118" y="158" width="92" height="30" rx="4" fill="${G}"></rect><rect x="126" y="165" width="74" height="6" rx="3" fill="${D}"></rect>` +
      `<rect x="200" y="163" width="36" height="25" rx="3" fill="${L}" ${cut}></rect>` +
      `<rect x="215" y="96" width="6" height="72" rx="2" fill="${W}"></rect><ellipse cx="218" cy="96" rx="6.5" ry="8" fill="${L}"></ellipse>` +
      `<path d="M218 40 C 229 56, 235 66, 233 77 C 231 87, 225 91, 218 91 C 211 91, 205 87, 203 77 C 201 66, 207 56, 218 40 Z" fill="${W}"></path>` +
      `<path d="M218 61 C 223 69, 226 75, 225 80 C 224 85, 221 87, 218 87 C 215 87, 212 85, 211 80 C 210 75, 213 69, 218 61 Z" fill="${K}"></path>`,

    medal: SHELF +
      `<path d="M166 40 H185 L205 102 H186 Z" fill="${G}"></path><path d="M227 40 H208 L188 102 H207 Z" fill="${L}" ${cut}></path><rect x="156" y="34" width="81" height="8" rx="4" fill="${W}"></rect>` +
      `<circle cx="196.5" cy="136" r="40" fill="${W}"></circle><circle cx="196.5" cy="136" r="31" fill="none" stroke="${K}" stroke-width="3"></circle>` +
      line('M184 120 L196.5 152 L209 120', K, 6),
  };
  const CENTER = {"envelope":-36,"battery":-26,"pencil":-29.9,"fountainPen":-30.2,"match":19}, SH = "<rect x=\"84\" y=\"188\" width=\"224\" height=\"7\" rx=\"3.5\" fill=\"#F2F0EC\"></rect><rect x=\"96\" y=\"195\" width=\"6\" height=\"14\" rx=\"1.5\" fill=\"#F2F0EC\"></rect><rect x=\"290\" y=\"195\" width=\"6\" height=\"14\" rx=\"1.5\" fill=\"#F2F0EC\"></rect>";
  for (const k in CENTER) { const V = window.LESSON_VIZ_V5; V[k] = SH + '<g transform="translate(' + CENTER[k] + ' 0)">' + V[k].slice(SH.length) + '</g>'; }
  window.LESSON_VIZ_SWAP = { sneaker: 'route', bench: 'bench', signpost: 'signpost', plant: 'plant', hourglass: 'hourglass', bed: 'bed', notebook: 'notebook', door: 'door', openDoor: 'openDoor', lamp: 'lamp', clipboard: 'clipboard', tab: 'tab', feedOff: 'feedOff', charger: 'charger', phoneTable: 'phoneTable', mirror: 'mirror', envelopeOpen: 'letter', books: 'bookStack' };
})();
