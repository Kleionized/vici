// screens-onb3-map.jsx — VICI onboarding v3 · part 2 of 3.
// "The reading" — the built-for-you reveal. The pattern, plainly stated,
// over a faceted monochrome campaign map: ten worlds, sea to summit,
// twelve weeks in Roman numerals. Three treatments of the map:
//   route    — engraved profile panorama, the line climbing sea → summit
//   chart    — a nautical chart, plotted top-down with station stamps
//   contents — a bookplate contents page: the ten worlds as an index
// The live flow reads window.CURRENT_ONB3.map; each is also a board.

const { useState: omState, useEffect: omEffect } = React;

// the ten grounds of the campaign — veni → vici — with their week marks
// (names mirror the Journey tab's curriculum exactly)
const O3_WORLDS = [
  ['The Landing', 'I'], ['The Crossing', 'II'], ['Deep Waters', 'III'], ['Held Ground', 'IV'],
  ['First Camp', 'V'], ['The Long March', 'VI'], ['The Watchfire', 'VIII'],
  ['High Ground', 'IX'], ['The Gates', 'X'], ['The Triumph', 'XII'],
];

// facet palette — lifted from scene-kit (paper greys, no hue)
const OM = {
  far: '#E9E6D9', farShade: '#E1DECF', midLit: '#E1DDCD', midShade: '#D2CDBA',
  nearLit: '#D8D3C0', nearShade: '#C5C0AA', fgLit: '#C9C4AE', fgShade: '#B4AF98',
  waterHi: '#E7E4D5', water: '#D9D5C2', waterLo: '#C8C3AD', waterDeep: '#B3AE97',
  foam: '#F5F3EA', snow: '#F4F2E9', ink: '#4A4A42',
};
const OM_LABEL = { fontFamily: 'var(--font)', fontWeight: 600, letterSpacing: '0.18em' };
const OM_NUM = { fontFamily: 'var(--font-display)', fontWeight: 500 };

// ── A · THE ROUTE — engraved profile, sea to summit ──────────────────
// One continuous landscape: water at the left foot, faceted ridges
// climbing to a snow-capped summit right. The route is his line —
// drawn in, dashed, with ten stations and week numerals along it.
function O3MapRoute({ w = 344, animate = true }) {
  const h = 268;
  // the route: shore → summit (hand-tuned against the ridge geometry)
  const route = 'M30 218 C 62 214 88 208 112 196 C 140 182 152 168 176 152 C 198 137 214 128 238 112 C 262 96 280 78 300 56';
  // station positions along the route (10)
  const st = [[30, 218], [62, 213], [96, 203], [128, 188], [160, 163], [190, 143], [220, 124], [248, 105], [276, 82], [300, 56]];
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} fill="none" style={{ display: 'block', overflow: 'visible' }}>
      {/* sky ticks — high cirrus */}
      <g stroke={OM.farShade} strokeWidth="1.4" strokeLinecap="round" opacity="0.9">
        <path d="M36 44 h44" /><path d="M52 56 h22" /><path d="M250 26 h40" />
      </g>
      {/* gulls */}
      <path d="M96 74 q 4 -4 8 0 q 4 -4 8 0" stroke={OM.ink} strokeWidth="1.4" strokeLinecap="round" opacity="0.55" fill="none" />
      <path d="M120 62 q 3 -3 6 0 q 3 -3 6 0" stroke={OM.ink} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" fill="none" />
      {/* far ridge */}
      <path d={`M0 150 L70 118 L128 142 L196 92 L252 118 L${w} 84 L${w} ${h} L0 ${h} Z`} fill={OM.far} />
      <path d={`M196 92 L252 118 L196 130 Z`} fill={OM.farShade} />
      {/* mid ridge with the summit */}
      <path d={`M0 190 L58 168 L118 182 L188 136 L244 152 L300 56 L330 96 L${w} 88 L${w} ${h} L0 ${h} Z`} fill={OM.midLit} />
      <path d={`M300 56 L330 96 L300 104 L268 92 Z`} fill={OM.midShade} />
      <path d={`M300 56 L286 78 L300 84 L312 72 Z`} fill={OM.snow} />
      <path d={`M188 136 L244 152 L188 160 Z`} fill={OM.midShade} />
      {/* near ground */}
      <path d={`M0 214 L48 206 L112 216 L190 190 L258 200 L${w} 170 L${w} ${h} L0 ${h} Z`} fill={OM.nearLit} />
      <path d={`M112 216 L190 190 L190 206 L128 222 Z`} fill={OM.nearShade} />
      {/* the water, bottom left */}
      <path d={`M0 226 L96 232 L52 242 L0 240 Z`} fill={OM.waterHi} />
      <path d={`M0 240 L120 236 L${w * 0.42} 250 L0 ${h} Z`} fill={OM.water} />
      <path d={`M0 ${h - 10} L${w * 0.38} 252 L${w * 0.3} ${h} L0 ${h} Z`} fill={OM.waterLo} />
      <path d="M10 236 h30M52 244 h22M20 254 h26" stroke={OM.foam} strokeWidth="1.6" strokeLinecap="round" />
      {/* pines on the near ground */}
      {[[74, 212, 0.8], [92, 216, 1], [212, 190, 0.9]].map(([x, y, s], i) => (
        <g key={i}>
          <path d={`M${x} ${y - 22 * s} L${x - 7 * s} ${y} L${x} ${y} Z`} fill={OM.nearShade} />
          <path d={`M${x} ${y - 22 * s} L${x + 7 * s} ${y} L${x} ${y} Z`} fill={OM.fgShade} />
        </g>
      ))}
      {/* the route — engraved, drawn in */}
      <path d={route} stroke="var(--bg)" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path className={animate ? 'onb-draw' : undefined} d={route} pathLength="1"
        stroke={OM.ink} strokeWidth="2" strokeDasharray={animate ? undefined : '1 0'} strokeLinecap="round" fill="none"
        style={animate ? { animationDuration: '1.6s', animationDelay: '0.35s' } : { strokeDasharray: 'none' }} />
      {/* stations */}
      {st.map(([x, y], i) => (
        i === 0
          ? <circle key={i} cx={x} cy={y} r="5" fill="var(--fill)" stroke="var(--bg)" strokeWidth="2" />
          : <circle key={i} cx={x} cy={y} r="3.2" fill="var(--bg)" stroke={OM.ink} strokeWidth="1.5" className={animate ? 'o3-riseline' : undefined} style={animate ? { animationDelay: `${0.5 + i * 0.14}s` } : undefined} />
      ))}
      {/* the flag at the summit */}
      <path d="M300 56 V38" stroke={OM.ink} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M300 38 L314 43 L300 48 Z" fill="var(--fill)" />
      {/* week numerals along the way */}
      <text x="24" y="238" fill={OM.ink} fontSize="10" style={OM_NUM}>I</text>
      <text x="128" y="176" fill={OM.ink} fontSize="10" style={OM_NUM}>IV</text>
      <text x="224" y="142" fill={OM.ink} fontSize="10" style={OM_NUM}>VIII</text>
      <text x="312" y="60" fill={OM.ink} fontSize="10" style={OM_NUM}>XII</text>
      {/* place labels */}
      <text x="30" y="272" fill="var(--ink3)" fontSize="8.5" style={OM_LABEL}>THE LANDING</text>
      <text x={w - 4} y="30" textAnchor="end" fill="var(--ink3)" fontSize="8.5" style={OM_LABEL}>THE TRIUMPH</text>
    </svg>
  );
}

// ── B · THE CHART — plotted top-down, station stamps ─────────────────
function O3MapChart({ w = 344, animate = true }) {
  const h = 300;
  // the plotted course, harbor → summit mark
  const course = 'M46 252 C 88 244 108 220 128 196 C 148 172 178 168 206 158 C 238 146 258 118 268 92 C 274 76 280 64 290 54';
  const st = [[46, 252], [78, 244], [106, 222], [128, 196], [156, 174], [190, 163], [222, 150], [248, 128], [266, 96], [290, 54]];
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} fill="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <clipPath id="om-land"><path d={`M198 0 L${w} 0 L${w} ${h} L150 ${h} C 168 246 150 200 178 168 C 206 136 216 96 208 62 C 204 38 198 18 198 0 Z`} /></clipPath>
      </defs>
      {/* frame */}
      <rect x="1" y="1" width={w - 2} height={h - 2} stroke="var(--line)" strokeWidth="1.5" />
      <rect x="7" y="7" width={w - 14} height={h - 14} stroke="var(--line)" strokeWidth="0.8" />
      {/* the land mass, hatched */}
      <path d={`M198 0 L${w} 0 L${w} ${h} L150 ${h} C 168 246 150 200 178 168 C 206 136 216 96 208 62 C 204 38 198 18 198 0 Z`} fill={OM.far} />
      <g clipPath="url(#om-land)" stroke={OM.nearShade} strokeWidth="1" opacity="0.75">
        {Array.from({ length: 22 }).map((_, i) => (
          <path key={i} d={`M${120 + i * 14} ${h} L${240 + i * 14} 0`} />
        ))}
      </g>
      <path d={`M198 0 C 198 18 204 38 208 62 C 216 96 206 136 178 168 C 150 200 168 246 150 ${h}`} stroke={OM.ink} strokeWidth="1.6" fill="none" opacity="0.8" />
      {/* soundings + wave ticks in open water */}
      <g fill={OM.waterDeep}>
        {[[40, 60], [84, 96], [52, 150], [120, 70], [96, 200], [40, 220], [140, 260]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.4" />)}
      </g>
      <g stroke={OM.waterLo} strokeWidth="1.3" strokeLinecap="round">
        <path d="M32 104 q 5 -4 10 0 q 5 -4 10 0" fill="none" />
        <path d="M96 140 q 5 -4 10 0 q 5 -4 10 0" fill="none" />
        <path d="M60 246 q 5 -4 10 0 q 5 -4 10 0" fill="none" />
      </g>
      {/* compass rose */}
      <g transform="translate(52, 44)" opacity="0.9">
        <circle r="16" stroke={OM.ink} strokeWidth="1" fill="none" strokeDasharray="1.5 4" />
        <path d="M0 -13 L3 0 L0 13 L-3 0 Z" fill={OM.ink} />
        <path d="M-13 0 L0 -3 L13 0 L0 3 Z" fill={OM.nearShade} />
        <text y="-20" textAnchor="middle" fill={OM.ink} fontSize="9" style={OM_NUM}>N</text>
      </g>
      {/* the mountain mark at the course's end */}
      <g transform="translate(290, 44)">
        <path d="M0 10 L-9 24 L9 24 Z" fill="none" stroke={OM.ink} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M0 10 L-3.4 15.5 L0 17 L3.4 15.5 Z" fill={OM.ink} />
      </g>
      {/* the plotted course */}
      <path className={animate ? 'onb-draw' : undefined} d={course} pathLength="1"
        stroke={OM.ink} strokeWidth="1.8" strokeLinecap="round" strokeDasharray={animate ? undefined : '4 5'} fill="none"
        style={animate ? { animationDuration: '1.8s', animationDelay: '0.3s' } : undefined} />
      {/* stations — postmark stamps */}
      {st.map(([x, y], i) => (
        <g key={i} className={animate ? 'o3-riseline' : undefined} style={animate ? { animationDelay: `${0.45 + i * 0.13}s` } : undefined}>
          {i === 0
            ? <circle cx={x} cy={y} r="5.5" fill="var(--fill)" stroke="var(--bg)" strokeWidth="2" />
            : <circle cx={x} cy={y} r="4" fill="var(--bg)" stroke={OM.ink} strokeWidth="1.4" />}
        </g>
      ))}
      {/* numerals riding the course */}
      <text x="30" y="272" fill={OM.ink} fontSize="10" style={OM_NUM}>I</text>
      <text x="112" y="188" fill={OM.ink} fontSize="10" style={OM_NUM}>IV</text>
      <text x="234" y="140" fill={OM.ink} fontSize="10" style={OM_NUM}>VIII</text>
      <text x="302" y="80" fill={OM.ink} fontSize="10" style={OM_NUM}>XII</text>
      {/* cartouche */}
      <g transform={`translate(${w / 2 - 78}, ${h - 34})`}>
        <rect width="156" height="22" fill="var(--bg)" stroke="var(--line)" strokeWidth="1" />
        <text x="78" y="14.5" textAnchor="middle" fill="var(--ink2)" fontSize="8" style={OM_LABEL}>THE CAMPAIGN · TWELVE WEEKS</text>
      </g>
      <text x="34" y="240" fill="var(--ink3)" fontSize="8" style={OM_LABEL}>THE LANDING</text>
      <text x={w - 20} y="36" textAnchor="end" fill="var(--ink3)" fontSize="8" style={OM_LABEL}>THE TRIUMPH</text>
    </svg>
  );
}

// ── C · THE CONTENTS — a bookplate index of the ten worlds ───────────
function O3MapContents({ a = {}, animate = true }) {
  const startNote = (a.triggers || []).includes('Late at night') ? 'begins in your late-night window' : 'begins here';
  return (
    <div style={{ position: 'relative', border: '1px solid var(--line)', padding: 5 }}>
      <div style={{ border: '1px solid var(--line)', padding: '22px 22px 18px' }}>
        {/* crest — the laurel */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{ width: 40, height: 40, borderRadius: 9999, border: `1.4px solid ${OM.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="18" viewBox="0 0 34 26" fill="none">
              <path d="M13 2 C 6 4 2.5 10 3 17 c 0.2 2.5 1 4.6 2 6" stroke={OM.ink} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M11 7 c -3.5 0.5 -5.5 3 -6 6 M11.5 12.5 c -3 0 -4.5 1.5 -5 4" stroke={OM.ink} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M21 2 C 28 4 31.5 10 31 17 c -0.2 2.5 -1 4.6 -2 6" stroke={OM.ink} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M23 7 c 3.5 0.5 5.5 3 6 6 M22.5 12.5 c 3 0 4.5 1.5 5 4" stroke={OM.ink} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 21, color: 'var(--ink)', textAlign: 'center', marginTop: 12 }}>The Campaign</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}><span style={{ width: 40, height: 1.5, background: 'var(--ink)' }} /></div>
        <div style={{ ...OM_LABEL, fontSize: 8.5, color: 'var(--ink3)', textAlign: 'center', marginTop: 10, textTransform: 'uppercase' }}>Ten grounds · veni → vici</div>
        <div style={{ marginTop: 18 }}>
          {O3_WORLDS.map(([name, wk], i) => (
            <div key={name} className={animate ? 'o3-riseline' : undefined} style={{ animationDelay: animate ? `${0.15 + i * 0.09}s` : undefined, display: 'flex', alignItems: 'baseline', gap: 10, padding: '6.5px 0' }}>
              <span style={{ ...OM_NUM, fontSize: 12.5, color: i === 0 ? 'var(--ink)' : 'var(--ink3)', width: 26, flexShrink: 0 }}>{o3Roman(i + 1)}.</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: i === 0 ? 500 : 400, fontSize: 15, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{name}</span>
              {i === 0 ? <span style={{ width: 6, height: 6, borderRadius: 9999, background: 'var(--fill)', flexShrink: 0, alignSelf: 'center' }} /> : null}
              <span aria-hidden="true" style={{ flex: 1, borderBottom: '1.5px dotted var(--soft2)', transform: 'translateY(-3px)' }} />
              <span className="tnum" style={{ ...OM_NUM, fontSize: 12, color: 'var(--ink2)', flexShrink: 0 }}>wk {wk}</span>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 11.5, color: 'var(--ink3)', textAlign: 'center', marginTop: 14, fontStyle: 'italic' }}>— {startNote} —</div>
      </div>
      {/* corner ticks */}
      {[[0, 0, 1, 1], [1, 0, -1, 1], [0, 1, 1, -1], [1, 1, -1, -1]].map(([x, y, dx, dy], i) => (
        <span key={i} aria-hidden="true" style={{ position: 'absolute', left: x ? 'auto' : -1, right: x ? -1 : 'auto', top: y ? 'auto' : -1, bottom: y ? -1 : 'auto', width: 9, height: 9, borderLeft: dx > 0 ? '1.5px solid var(--ink)' : 'none', borderRight: dx < 0 ? '1.5px solid var(--ink)' : 'none', borderTop: dy > 0 ? '1.5px solid var(--ink)' : 'none', borderBottom: dy < 0 ? '1.5px solid var(--ink)' : 'none' }} />
      ))}
    </div>
  );
}

// ── the reading screen ───────────────────────────────────────────────
function o3Pattern(a) {
  const t = (a.triggers || []).map((x) => x.toLowerCase());
  const when = t.includes('late at night') ? 'late at night' : (t[0] || 'in the quiet hours');
  const drive = t.includes('after stress or a hard day') ? 'on stress' : t.includes('home alone for long stretches') ? 'when you are alone' : t.includes('bored during the day') ? 'on boredom' : 'on habit';
  const who = (a.name || '').trim();
  return `${who ? who + ' — your' : 'Your'} pull runs strongest ${when}, ${drive}. That is where the campaign begins.`;
}
function O3_Reading({ a, variant, next }) {
  const v = variant || (window.CURRENT_ONB3 || {}).map || 'route';
  const contents = v === 'contents';
  return (
    <React.Fragment>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <h1 className="o3-riseline" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: contents ? 20 : 22, lineHeight: 1.34, letterSpacing: '0.008em', color: 'var(--ink)', margin: '14px auto 0', textAlign: 'center', maxWidth: 316, textWrap: 'balance' }}>
        {o3Pattern(a)}
        </h1>
        <div style={{ flex: 1, minHeight: 14 }} />
        <div style={{ margin: contents ? '16px 6px 0' : '10px 0 0' }}>
          {v === 'chart' ? <O3MapChart /> : v === 'contents' ? <O3MapContents a={a} /> : <O3MapRoute />}
        </div>
        {v !== 'contents' ? (
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '14px 4px 0' }}>
            <span style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 9.5, letterSpacing: '0.2em', color: 'var(--ink3)', textTransform: 'uppercase' }}>Ten grounds · twelve weeks</span>
            <span className="tnum" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 12.5, color: 'var(--ink2)' }}>wk I — XII</span>
          </div>
        ) : null}
        <div style={{ flex: 1, minHeight: 14 }} />
      </div>
      <div style={{ paddingTop: 14 }}>
        <O3CTA label="Learn the first move" onClick={next} />
      </div>
    </React.Fragment>
  );
}

Object.assign(window, { O3_WORLDS, O3MapRoute, O3MapChart, O3MapContents, O3_Reading, o3Pattern, OM });
