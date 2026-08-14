// screens-keepsakes.jsx — "Medallions" · the achievements page.
// A campaign album of phalerae: every medallion is faceted paper inside
// a postmark ring — earned ones in full ink with a letterpress date,
// in-progress ones wearing a progress arc, and the ones still ahead as
// blind-embossed blanks. Tapping any medallion opens its story. Three
// pillars anchor the album — Veni (crossed in, once), Vidi (days
// witnessed, tiered), Vici (urges outlasted, tiered) — with eight more
// around them.
//
// Exports (to window): KeepsakesScreen, KeepsakeDetailScreen, KeepsakesFlow.

const { useState: kkState } = React;

// ── palette: the worlds' faceted paper tones ─────────────────────────
const KP = {
  paper: '#F7F5EC', lit: '#EBE8DA', mid: '#DCD8C6', shade: '#C8C3AD',
  deep: '#B0AB93', ink: '#4A4A42', foam: '#FCFBF6', sun: '#F4F2E9', sunEdge: '#D8D3C1',
};

// ── the mini-scenes, one per medallion (drawn in a 100×100 circle) ────
const KK_SCENES = {
  // veni — stepping off the old shore: a sail pushing out at first light
  veni: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <circle cx="76" cy="28" r="9.5" fill={KP.sun} stroke={KP.sunEdge} strokeWidth="1.4" />
      {/* the old shore, bottom-left, being left behind */}
      <path d="M0 58 C 12 54, 24 56, 33 62 L 33 100 L 0 100 Z" fill={KP.mid} />
      <path d="M0 58 C 12 54, 24 56, 33 62" fill="none" stroke={KP.shade} strokeWidth="1.3" />
      <path d="M8 68 q 6 -2.5 12 0" stroke={KP.shade} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.55" />
      {/* the water */}
      <rect x="0" y="64" width="100" height="36" fill={KP.lit} />
      <path d="M33 64 h55" stroke={KP.foam} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M22 79 q 12 -3.5 24 0 t 24 0" stroke={KP.shade} strokeWidth="1.7" strokeLinecap="round" fill="none" opacity="0.5" />
      {/* the wake, shore to boat */}
      <path d="M33 70 C 42 72, 50 70, 57 66" stroke={KP.foam} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 6" fill="none" />
      {/* the boat, heading out */}
      <g transform="translate(62 42)">
        <path d="M0 16 L0 -14" stroke={KP.ink} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M2 -12 C 11 -6 14 4 14 13 L2 13 Z" fill={KP.foam} stroke={KP.shade} strokeWidth="1" />
        <path d="M-2 -9 C -9 -3 -11 6 -11 13 L-2 13 Z" fill={KP.mid} />
        <path d="M-14 16 C -8 20.5 10 20.5 17 16 L15 19.5 C 6 23 -7 23 -12 19.5 Z" fill={KP.ink} opacity="0.85" />
      </g>
    </g>
  ),
  // back on deck — the boat home again, made fast to the mooring post
  backondeck: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <circle cx="25" cy="25" r="8.5" fill={KP.sun} stroke={KP.sunEdge} strokeWidth="1.4" />
      {/* calm water */}
      <rect x="0" y="60" width="100" height="40" fill={KP.lit} />
      <path d="M6 60 h88" stroke={KP.foam} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M14 78 q 11 -3 22 0 t 22 0 t 22 0" stroke={KP.shade} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.5" />
      {/* the wake it came back on — out of the frame, back to the post */}
      <path d="M94 56 C 82 58, 72 60.5, 62 61.5" stroke={KP.foam} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="1 6" fill="none" />
      {/* the mooring post, waiting */}
      <path d="M28 62 L28 44" stroke={KP.ink} strokeWidth="3" strokeLinecap="round" />
      <circle cx="28" cy="41" r="2.6" fill={KP.ink} />
      {/* the boat, home again, nose to the post */}
      <g transform="translate(53 42)">
        <path d="M0 16 L0 -13" stroke={KP.ink} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M-2 -11 C -11 -5 -14 4 -14 13 L-2 13 Z" fill={KP.foam} stroke={KP.shade} strokeWidth="1" />
        <path d="M2 -8 C 9 -3 11 6 11 13 L2 13 Z" fill={KP.mid} />
        <path d="M-17 16 C -10 20.5 9 20.5 15 16 L13 19.5 C 5 23 -8 23 -13 19.5 Z" fill={KP.ink} opacity="0.85" />
      </g>
      {/* the line, made fast */}
      <path d="M29 47 C 34 53, 39 56, 44 57" stroke={KP.ink} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.7" />
    </g>
  ),
  // dawn: half sun on the horizon, rays, banded sea
  firstlight: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <g stroke={KP.ink} strokeWidth="2.4" strokeLinecap="round" opacity="0.75">
        <path d="M50 26v-8M28 34l5 5M72 34l-5 5" />
      </g>
      <circle cx="50" cy="58" r="14" fill={KP.sun} stroke={KP.sunEdge} strokeWidth="1.6" />
      <rect x="0" y="58" width="100" height="14" fill={KP.lit} />
      <rect x="0" y="72" width="100" height="13" fill={KP.mid} />
      <rect x="0" y="85" width="100" height="15" fill={KP.shade} />
      <path d="M8 58h84" stroke={KP.foam} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M18 72h64" stroke={KP.foam} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    </g>
  ),
  // the letter, sent onward: a sealed envelope, centred, riding to a future self
  lettersent: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      {/* the flight path, rising toward the letter */}
      <path d="M26 73 C 34 70, 43 65, 50 55" fill="none" stroke={KP.deep} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1 6" opacity="0.6" />
      {/* a foam line at the shore, grounding the scene like its siblings */}
      <path d="M10 85 q 13 -4 26 0 t 26 0 t 26 0" fill="none" stroke={KP.foam} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      {/* the sealed envelope — centred on 50, gently tilted, riding onward */}
      <g transform="rotate(-9 50 50)">
        <rect x="29" y="36" width="42" height="30" rx="4.5" fill={KP.lit} stroke={KP.shade} strokeWidth="1.2" />
        {/* the two bottom seams, meeting at the seal */}
        <path d="M30 64 L50 50 L70 64" fill="none" stroke={KP.shade} strokeWidth="1.2" strokeLinejoin="round" opacity="0.7" />
        {/* the flap, folded down to the centre */}
        <path d="M29 38 L50 51 L71 38" fill={KP.mid} stroke={KP.shade} strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M50 38 L71 38 L50 51 Z" fill={KP.shade} opacity="0.4" />
        {/* the wax seal */}
        <circle cx="50" cy="49" r="6.2" fill={KP.ink} />
        <path d="M46 50c1.3-1.9 2.7-1.9 4 0s2.7 1.9 4 0" stroke={KP.paper} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      </g>
      {/* a sparkle ahead of it */}
      <path d="M74 28 l1.3 3.2 3.2 1.3 -3.2 1.3 -1.3 3.2 -1.3 -3.2 -3.2 -1.3 3.2 -1.3 Z" fill={KP.shade} />
    </g>
  ),
  // the open book — lessons stacking up
  study: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <path d="M50 34 C 40 28 28 27 18 30 L18 66 C 28 63 40 64 50 70 Z" fill={KP.foam} stroke={KP.shade} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M50 34 C 60 28 72 27 82 30 L82 66 C 72 63 60 64 50 70 Z" fill={KP.lit} stroke={KP.shade} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M50 34 V70" stroke={KP.shade} strokeWidth="1.4" />
      <g stroke={KP.deep} strokeWidth="1.8" strokeLinecap="round" opacity="0.75">
        <path d="M25 38 h18 M25 45 h18 M25 52 h13" />
        <path d="M57 38 h18 M57 45 h18 M57 52 h13" opacity="0.7" />
      </g>
      {/* the wave bookmark */}
      <path d="M62 30 v-12 l4 3.5 4-3.5 v14" fill={KP.mid} stroke={KP.shade} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M22 82 q 14 -4.5 28 0 t 28 0" stroke={KP.mid} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
    </g>
  ),
  // two mugs, one sill — the moment you let someone in
  told: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <path d="M8 64 L92 64 L92 72 L8 72 Z" fill={KP.mid} />
      <path d="M8 72 L92 72 L88 84 L12 84 Z" fill={KP.shade} />
      <g stroke={KP.deep} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.75">
        <path d="M34 42 c 4 -3.5 4 -7.5 0 -11" />
        <path d="M62 44 c 4 -3.5 4 -7.5 0 -11" />
      </g>
      <path d="M24 48 L46 48 L44 63 A5 5 0 0 1 39 67 L31 67 A5 5 0 0 1 26 63 Z" fill={KP.foam} />
      <path d="M38 48 L46 48 L44 63 A5 5 0 0 1 39 67 L36 67 C 38 61 38.6 54 38 48 Z" fill={KP.shade} opacity="0.55" />
      <ellipse cx="35" cy="48" rx="11" ry="2.8" fill={KP.deep} />
      <path d="M46 51 h3.5 a4.5 4.5 0 0 1 0 9 h-4" stroke={KP.shade} strokeWidth="2.2" fill="none" />
      <path d="M54 50 L74 50 L72.3 63 A4.5 4.5 0 0 1 67.8 67 L60.2 67 A4.5 4.5 0 0 1 55.7 63 Z" fill={KP.lit} />
      <ellipse cx="64" cy="50" rx="10" ry="2.6" fill={KP.deep} opacity="0.85" />
      <path d="M74 53 h3 a4 4 0 0 1 0 8 h-3.5" stroke={KP.shade} strokeWidth="2" fill="none" />
    </g>
  ),
  // days witnessed, phase over phase, climbing
  vidi: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      {[
        [16, 60, 0], [26, 44, 0.2], [39, 33, 0.4], [54, 29, 0.6], [68, 33, 0.8], [79, 43, 1], [87, 57, 1],
      ].map(([x, y, f], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6.5" fill={KP.sun} stroke={KP.sunEdge} strokeWidth="1.2" />
          {f < 1 ? <path d={`M${x} ${y - 6.5} a6.5 6.5 0 0 ${f >= 0.5 ? 1 : 0} 0 13 ${f === 0 ? 'a8 8 0 0 0 0 -13' : ''} Z`} fill={f >= 0.5 ? KP.mid : KP.shade} opacity={f === 0.8 ? 0.5 : 1} /> : null}
        </g>
      ))}
      <rect x="0" y="76" width="100" height="24" fill={KP.lit} />
      <path d="M12 76h76" stroke={KP.foam} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
      <path d="M28 86q9 -3.5 18 0t18 0" stroke={KP.shade} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
    </g>
  ),
  // pen nib + a written line
  honest: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <path d="M50 18 L64 44 C 60 56, 54 60, 50 62 C 46 60, 40 56, 36 44 Z" fill={KP.lit} stroke={KP.shade} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M50 18 L64 44 C 60 56, 54 60, 50 62 Z" fill={KP.mid} opacity="0.6" />
      <path d="M50 34 v18" stroke={KP.ink} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="50" cy="34" r="2.6" fill={KP.ink} />
      <path d="M22 76 q 12 -6 24 -1 t 26 -2" stroke={KP.ink} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.7" />
      <circle cx="76" cy="70" r="2" fill={KP.ink} opacity="0.45" />
    </g>
  ),
  // the mended sail — slipped, stitched, sailing again by morning
  bounce: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      {/* the morning sun, back up */}
      <circle cx="23" cy="25" r="8" fill={KP.sun} stroke={KP.sunEdge} strokeWidth="1.3" />
      {/* the sea */}
      <rect x="0" y="66" width="100" height="34" fill={KP.lit} />
      <path d="M0 66 h100" stroke={KP.foam} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M14 80 q 11 -3 22 0 t 22 0 t 22 0" stroke={KP.shade} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.5" />
      {/* the boat, under way again */}
      <g transform="translate(55 45)">
        <path d="M0 20 L0 -22" stroke={KP.ink} strokeWidth="2" strokeLinecap="round" />
        <path d="M3 -19 C 15 -11 19 3 19 16 L3 16 Z" fill={KP.foam} stroke={KP.shade} strokeWidth="1.1" />
        <path d="M-3 -14 C -12 -7 -15 5 -15 16 L-3 16 Z" fill={KP.mid} />
        {/* the mend — one clean stitched seam across the mainsail */}
        <path d="M5.5 -6.5 L16 1.5" stroke={KP.deep} strokeWidth="1.3" strokeLinecap="round" />
        <g stroke={KP.deep} strokeWidth="1.1" strokeLinecap="round">
          <path d="M9.2 -6.2 L6.8 -3.2" />
          <path d="M12 -4 L9.6 -1" />
          <path d="M14.8 -1.8 L12.4 1.2" />
        </g>
        <path d="M-17 20 C -10 24.5 12 24.5 20 20 L18 23.5 C 8 27 -9 27 -15 23.5 Z" fill={KP.ink} opacity="0.85" />
      </g>
    </g>
  ),
  // the standing rock — the sea moves; you don't
  vici: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      {/* the sea */}
      <rect x="0" y="60" width="100" height="40" fill={KP.lit} />
      <path d="M0 60 h100" stroke={KP.foam} strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
      <path d="M0 74 C 26 70, 52 76, 100 71 L100 100 L0 100 Z" fill={KP.mid} opacity="0.8" />
      {/* the rock — faceted, standing into the sky */}
      <path d="M35 66 L44 26 L57 21 L68 66 Z" fill={KP.mid} stroke={KP.shade} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M57 21 L68 66 L51 66 L48 30 Z" fill={KP.shade} opacity="0.8" />
      <path d="M44 26 L57 21 L48 30 Z" fill={KP.foam} opacity="0.5" />
      {/* the wave met — a foam collar at the waterline */}
      <ellipse cx="51" cy="66" rx="21" ry="3.6" fill={KP.foam} opacity="0.95" />
      <path d="M13 62 q 9 -8 19 -1" stroke={KP.ink} strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M70 63 q 8 -4.5 15 -1.5" stroke={KP.shade} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
      {/* spray */}
      <circle cx="31" cy="55" r="1.7" fill={KP.foam} stroke={KP.shade} strokeWidth="0.7" />
      <circle cx="73" cy="56" r="1.4" fill={KP.foam} stroke={KP.shade} strokeWidth="0.7" />
    </g>
  ),
  // the flag planted — ground taken
  groundtaken: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <path d="M0 52 C 24 46, 48 52, 100 44 L100 100 L0 100 Z" fill={KP.mid} opacity="0.7" />
      <path d="M0 66 C 30 58, 60 66, 100 58 L100 100 L0 100 Z" fill={KP.lit} />
      <path d="M0 66 C 30 58, 60 66, 100 58" stroke={KP.foam} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M58 70 V 26" stroke={KP.ink} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M58 27 L 80 33 L 58 40 Z" fill={KP.ink} opacity="0.85" />
      <ellipse cx="58" cy="71" rx="9" ry="2.6" fill={KP.shade} opacity="0.7" />
      <path d="M20 82 q 9 -3 18 0" stroke={KP.foam} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
    </g>
  ),
  // lighthouse in the squall
  storm: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <path d="M62 30 L 20 18 L 20 42 Z" fill={KP.sun} opacity="0.55" />
      <g stroke={KP.shade} strokeWidth="1.8" strokeLinecap="round" opacity="0.8">
        <path d="M24 52l-4 8M36 48l-4 8M78 46l-4 8M88 58l-4 8M30 68l-4 8" />
      </g>
      <path d="M56 28 L 68 28 L 66 72 L 58 72 Z" fill={KP.lit} stroke={KP.shade} strokeWidth="1.2" />
      <path d="M62 28 L 68 28 L 66 72 L 62 72 Z" fill={KP.mid} />
      <rect x="57.5" y="36" width="9" height="6" fill={KP.ink} opacity="0.75" />
      <rect x="58" y="50" width="8" height="5.5" fill={KP.ink} opacity="0.55" />
      <rect x="54" y="22" width="16" height="7" rx="2" fill={KP.ink} />
      <rect x="0" y="72" width="100" height="28" fill={KP.deep} opacity="0.75" />
      <path d="M8 72 q 12 -7 24 0 t 24 0 t 24 0 t 24 0" fill="none" stroke={KP.foam} strokeWidth="2.4" strokeLinecap="round" />
    </g>
  ),
};

// ── the medallion: postmark ring + clipped scene + optional arc ──────
function KKMedallion({ scene, size = 84, earned = true, progress = null, stamp = false, tier = null, tierMax = 0 }) {
  const uid = React.useId().replace(/[:]/g, '');
  const p = progress ? progress[0] / progress[1] : null;
  return (
    <div className={stamp ? 'onb-stamp' : undefined} style={{
      width: size, height: size, borderRadius: 9999, position: 'relative', flexShrink: 0,
      boxShadow: earned
        ? 'none'
        : 'none',
      background: earned ? 'linear-gradient(180deg, #FBF9F2, #F0EDE1)' : 'var(--soft)',
    }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ display: 'block', position: 'relative' }}>
        <defs><clipPath id={`kk-${uid}`}><circle cx="50" cy="50" r="37" /></clipPath></defs>
        {/* scene */}
        <g clipPath={`url(#kk-${uid})`} opacity={earned ? 1 : 0.16}>{scene}</g>
        {/* inner solid ring — doubled once a keepsake has levelled past tier I */}
        <circle cx="50" cy="50" r="37" stroke={earned ? 'rgba(74,74,66,0.4)' : 'rgba(74,74,66,0.16)'} strokeWidth="1.4" />
        {tier != null && tier >= 2 ? <circle cx="50" cy="50" r="33.8" stroke="rgba(74,74,66,0.28)" strokeWidth="1" /> : null}
        {/* outer dashed postmark ring — or the progress arc */}
        {p == null ? (
          <circle cx="50" cy="50" r="44.5" stroke={earned ? 'rgba(74,74,66,0.5)' : 'rgba(74,74,66,0.16)'} strokeWidth="1.7" strokeDasharray="2.5 5.5" />
        ) : (
          <g>
            <circle cx="50" cy="50" r="44.5" stroke="rgba(74,74,66,0.14)" strokeWidth="2.4" />
            <circle cx="50" cy="50" r="44.5" stroke="var(--ink)" strokeWidth="2.8" strokeLinecap="round"
              pathLength="100" strokeDasharray={`${Math.max(4, p * 100)} 100`} transform="rotate(-90 50 50)" />
          </g>
        )}
        {/* tier pips along the bottom arc — filled as the keepsake levels up */}
        {tier != null && tierMax > 1 ? Array.from({ length: tierMax }).map((_, i) => {
          const ang = (90 + (i - (tierMax - 1) / 2) * 13) * Math.PI / 180;
          const x = 50 + 40.9 * Math.cos(ang), y = 50 + 40.9 * Math.sin(ang);
          const onPip = i < tier;
          return (
            <rect key={i} x={x - 2.1} y={y - 2.1} width="4.2" height="4.2" rx="0.8"
              transform={`rotate(45 ${x} ${y})`}
              fill={onPip ? 'rgba(74,74,66,0.78)' : '#F1EEE3'}
              stroke={onPip ? 'none' : 'rgba(74,74,66,0.3)'} strokeWidth="1.1" />
          );
        }) : null}
      </svg>
      {!earned && p == null ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={size * 0.2} height={size * 0.2} viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="rgba(74,74,66,0.45)" strokeWidth="2" /><path d="M8 11V8a4 4 0 018 0v3" stroke="rgba(74,74,66,0.45)" strokeWidth="2" /></svg>
        </div>
      ) : null}
    </div>
  );
}

// letterpress date chip — `dark` renders it for the #131313 card
function DateStamp({ children, dark = false }) {
  return (
    <span className="tnum" style={{
      display: 'inline-block', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9.5,
      letterSpacing: '0.14em', textTransform: 'uppercase', color: dark ? 'rgba(245,244,241,0.75)' : 'rgba(74,74,66,0.72)',
      border: dark ? '1.4px solid rgba(245,244,241,0.35)' : '1.4px solid rgba(74,74,66,0.38)', borderRadius: 6, padding: '3px 7px',
      background: dark ? 'transparent' : '#F8F8F6',
    }}>{children}</span>
  );
}

// ── the data ─────────────────────────────────────────────────────────
// tiers: { count, steps, stories } — a medallion levels up each time count
// crosses a step; stories carries the per-tier line from the medallions
// catalog. `unit: 'day'` renders counts as Day numerals.
const KK_ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const KK_RN = [[100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
const kkRomanN = (n) => { let s = ''; for (const [v, r] of KK_RN) while (n >= v) { s += r; n -= v; } return s || '0'; };
const kkTier = (k) => (k.tiers ? k.tiers.steps.filter((s) => k.tiers.count >= s).length : null);
const kkNextStep = (k) => (k.tiers ? k.tiers.steps.find((s) => k.tiers.count < s) : null);
const kkStory = (k) => (k.earned && k.tiers && k.tiers.stories ? k.tiers.stories[Math.max(0, kkTier(k) - 1)] : k.story);
const kkCountLabel = (k) => (k.unit === 'day' ? `Day ${kkRomanN(k.tiers.count)}` : `×${k.tiers.count}`);

const KEEPSAKES = [
  { key: 'lettersent', name: 'Letter sent', how: 'Wrote a letter to your future self', date: 'Day XXI · Jun 30', earned: true,
    tiers: { count: 1, steps: [1, 4, 12, 24, 52], stories: [
      'Three honest paragraphs, sealed for day-XXX you.',
      'It rides ahead of you now — and it knows exactly when to arrive.',
      'A dozen letters out. You’re writing to someone you trust more than you did.',
      'Two dozen, sealed and sent. Writing to him is as old a habit as some of the ones it replaced.',
      'Fifty-two letters. A year of checking in with someone who kept believing you, on schedule, before you did.',
    ] } },
  { key: 'veni', name: 'Veni', how: 'Crossed the threshold — the campaign began', date: 'Day 0 · Jun 9', earned: true,
    story: 'Nothing was asked of you yet. Just this: you stepped off the old shore. Everything since has been built on that alone.' },
  { key: 'vidi', name: 'Vidi', how: 'Days in the practice, witnessed one by one', date: 'Day XXIV', earned: true, unit: 'day',
    tiers: { count: 24, steps: [3, 7, 30, 90, 180, 365], stories: [
      'The first fog lifts, right about here — exactly on schedule.',
      'Seven check-ins, two waves ridden, zero perfect days required.',
      'This is where “trying something” quietly becomes “how you live.”',
      'The long walk. By now the view is just… Tuesday.',
      'Six months witnessed, one day at a time. Nobody walks it in a straight line — Vidi only asks that you stayed on it.',
      'A full year, witnessed. The campaign outlived the season it started in.',
    ] } },
  { key: 'vici', name: 'Vici', how: 'Urges met and outlasted', date: 'Day XXIV', earned: true,
    tiers: { count: 3, steps: [1, 5, 25, 100, 250, 500, 1000], stories: [
      'Nine minutes, start to finish. You watched it rise, crest, and leave without you.',
      'Five ridden. Each one shortens the next.',
      'Twenty-five behind you now — the pattern is unmistakable.',
      'A hundred waves met and outlasted. This stopped being a fight you were unsure of a while ago.',
      'Two hundred and fifty. Vici isn’t a moment anymore. It’s just what you do.',
      'Five hundred. Most of them don’t even register as events now — this one still gets a mark.',
      'A thousand. The sea hasn’t changed. You’re just not the one it moves anymore.',
    ] } },
  { key: 'backondeck', name: 'Back on deck', how: 'An urge passed — and you came back to the app the same day, instead of vanishing', date: 'Day XXIV · Jul 3', earned: true, newest: true,
    tiers: { count: 1, steps: [1, 5, 25, 100], stories: [
      'It left, and you could have too — a week of radio silence. Instead you opened the app the same day and logged it.',
      'Five returns. An urge used to end the conversation; now it doesn’t even end the evening.',
      'Twenty-five times back on deck. Returning stopped being a decision — it’s just what you do.',
      'A hundred returns. There is no version of an urge that ends with you gone.',
    ] } },
  { key: 'bounce', name: 'Never failed twice', how: 'Slipped — and came back the next morning, not the next week', date: 'Day XIX · Jun 28', earned: true,
    tiers: { count: 1, steps: [1, 10, 25, 50, 100], stories: [
      'You slipped on day XVIII. On day XIX you were back before breakfast — no spiral, no vanishing week.',
      'Ten bounces now. That’s not luck holding, that’s practice.',
      'Twenty-five times down, twenty-five mornings back. The pattern is the point, not the count.',
      'Fifty. Falling has stopped meaning anything except that you get up.',
      'A hundred mornings after. The bounce is the strongest predictor there is, and you’re the proof of it.',
    ] } },
  { key: 'firstlight', name: 'First light', how: 'Your first morning check-in', date: 'Day I · Jun 10', earned: true,
    story: 'Twenty seconds of honesty on a Tuesday morning. Everything since has stacked on this.' },
  { key: 'honest', name: 'Honest ink', how: 'Journal entries, written honestly, not for show', date: 'Day XV · Jun 24', earned: true,
    tiers: { count: 12, steps: [10, 50, 100, 200, 365], stories: [
      'Ten entries in. Twelve honest paragraphs beat a hundred vague ones.',
      'Fifty pages of real accounting. The patterns page runs on this ink.',
      'A hundred entries. You know your own weather better than most people know their week.',
      'Two hundred. The record’s long enough now to argue with your own memory — and win.',
      'A year of entries, one for almost every day. This is a diary of a life, not a habit tracker.',
    ] } },
  { key: 'study', name: 'Steady study', how: 'Lessons finished, one at a time', progress: [4, 5],
    tiers: { count: 4, steps: [5, 10, 25, 50, 75, 96], stories: [
      'Five lessons in. Early enough this still feels like homework — that won’t last.',
      'Ten down. The ideas start meeting you in the moment, not just on the page.',
      'A quarter of the curriculum, done. More scaffolding built than it feels like.',
      'Halfway. The back half moves faster because the front half already changed how you think.',
      'Three-quarters through. What’s left is mostly deepening, not learning from scratch.',
      'Every lesson, finished. The curriculum’s done its job — the rest is just living it.',
    ] },
    story: 'Four lessons in — one more to the first rung.' },
  { key: 'groundtaken', name: 'Ground taken', how: 'A world finished — then another', progress: [4, 6],
    tiers: { count: 0, steps: [1, 3, 5, 7, 10], stories: [
      'Your first world, finished. The map opens from here.',
      'Three worlds in. There’s a rhythm to this now.',
      'Five worlds down, five to go — you’ve crossed the water and started the climb.',
      'Seven worlds. The summit’s close enough to see clearly.',
      'All ten. Sea to summit, the whole campaign, met.',
    ] },
    story: 'Two lessons left on the Landing. The first ground is nearly yours.' },
  { key: 'told', name: 'Let someone in', how: 'Told one person about the work — a friend, a partner, anyone', locked: true,
    story: 'The habit lives in the dark. One honest conversation takes half its weight away.' },
  { key: 'storm', name: 'Storm weathered', how: 'Rode out a force-nine urge — the hardest kind, not just a count', locked: true, rare: true,
    story: 'One will come. When it does, the lighthouse holds.' },
];
const kkByKey = (k) => KEEPSAKES.find((x) => x.key === k);

// ── the page ─────────────────────────────────────────────────────────
function KeepsakesScreen({ onOpen = () => {} }) {
  const earned = KEEPSAKES.filter((k) => k.earned && !k.newest);
  const newest = KEEPSAKES.find((k) => k.newest);
  const reach = KEEPSAKES.filter((k) => k.progress);
  const ahead = KEEPSAKES.filter((k) => k.locked);
  const nEarned = KEEPSAKES.filter((k) => k.earned).length;
  return (
    <Shell pad={0} top={0} tab={<TabBar active="you" />}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '60px 29px 128px' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}><BackChevron onClick={() => {}} /></div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, letterSpacing: '0.01em', color: 'var(--ink)', margin: '14px 0 0' }}>Medallions</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0 0' }}>
          <div style={{ flex: 1, height: 4.5, borderRadius: 9999, background: 'var(--soft2)', overflow: 'hidden', boxShadow: 'none' }}>
            <div style={{ width: `${(nEarned / KEEPSAKES.length) * 100}%`, height: '100%', borderRadius: 9999, background: 'var(--fill)' }} />
          </div>
          <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 13, color: 'var(--ink2)', flexShrink: 0 }}>{nEarned} of {KEEPSAKES.length}</span>
        </div>

        {/* newest — the hero keepsake, sealed dark like home's Next lesson */}
        {newest ? (
          <button onClick={() => onOpen(newest.key)} className="tl-press-soft" style={{ appearance: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', marginTop: 28, background: '#131313', borderRadius: 20, padding: '22px 20px', boxShadow: 'none', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative' }}>
              <KKMedallion scene={KK_SCENES[newest.key]} size={118} earned stamp tier={kkTier(newest)} tierMax={newest.tiers ? newest.tiers.steps.length : 0} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,244,241,0.62)' }}>Newest medallion</div>
                <div style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 23, letterSpacing: '0.005em', lineHeight: 1.1, color: '#F5F4F1', margin: '8px 0 8px' }}>{newest.name}</div>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13, lineHeight: 1.4, color: 'rgba(245,244,241,0.62)', marginBottom: 12 }}>{newest.how}</div>
                <DateStamp dark>{newest.date}</DateStamp>
              </div>
            </div>
          </button>
        ) : null}

        {/* earned */}
        <div style={{ margin: '38px 0 12px' }}>
          <SectionLabel>Earned</SectionLabel>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {earned.map((k, i) => (
            <button key={k.key} onClick={() => onOpen(k.key)} className="tl-press onb-rise" style={{
              appearance: 'none', border: 'none', cursor: 'pointer', textAlign: 'center',
              background: 'var(--card)', borderRadius: 20, padding: '18px 12px 15px',
              boxShadow: 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 11,
              animationDelay: `${0.05 + i * 0.05}s`,
            }}>
              <KKMedallion scene={KK_SCENES[k.key]} size={82} earned tier={kkTier(k)} tierMax={k.tiers ? k.tiers.steps.length : 0} />
              <div>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, letterSpacing: 'normal', color: 'var(--ink)', lineHeight: 1.15 }}>{k.name}</div>
                <div className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink3)', marginTop: 5 }}>
                  {k.tiers ? `Tier ${KK_ROMAN[kkTier(k) - 1] || 'I'} · ${kkCountLabel(k)}` : k.date}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* within reach */}
        <div style={{ margin: '38px 0 12px' }}>
          <SectionLabel>Within reach</SectionLabel>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reach.map((k) => (
            <button key={k.key} onClick={() => onOpen(k.key)} className="tl-press-soft" style={{
              appearance: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
              background: 'var(--card)', borderRadius: 20, padding: '14px 16px',
              boxShadow: 'none',
              display: 'flex', alignItems: 'center', gap: 15,
            }}>
              <KKMedallion scene={KK_SCENES[k.key]} size={62} earned={false} progress={k.progress} tier={kkTier(k)} tierMax={k.tiers ? k.tiers.steps.length : 0} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14, letterSpacing: 'normal', color: 'var(--ink)' }}>{k.name}</div>
                <div style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 12.5, color: 'var(--ink2)', marginTop: 3 }}>{k.how}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 9 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 9999, background: 'var(--soft2)', overflow: 'hidden', boxShadow: 'none' }}>
                    <div style={{ width: `${Math.max(4, (k.progress[0] / k.progress[1]) * 100)}%`, height: '100%', borderRadius: 9999, background: 'var(--fill)' }} />
                  </div>
                  <span className="tnum" style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12.5, color: 'var(--ink)', flexShrink: 0 }}>
                    {k.progress[0]}<span style={{ color: 'var(--ink3)', fontWeight: 500 }}> / {k.progress[1]}</span>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* still ahead — blind-embossed blanks */}
        <div style={{ margin: '38px 0 12px' }}>
          <SectionLabel>Still ahead</SectionLabel>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {ahead.map((k) => (
            <button key={k.key} onClick={() => onOpen(k.key)} className="tl-press" style={{
              appearance: 'none', border: 'none', cursor: 'pointer', background: 'transparent', padding: '6px 0',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9,
            }}>
              <KKMedallion scene={KK_SCENES[k.key]} size={68} earned={false} />
              <div style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11.5, lineHeight: 1.2, color: 'var(--ink3)', textAlign: 'center' }}>{k.name}</div>
              {k.hint ? <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink2)', background: 'var(--soft)', borderRadius: 9999, padding: '3px 8px', marginTop: -3 }}>{k.hint}</span> : null}
            </button>
          ))}
        </div>
      </div>
    </Shell>
  );
}

// ── the tier ladder: how a keepsake grows ────────────────────────
function TierLadder({ k }) {
  const { count, steps } = k.tiers;
  const next = kkNextStep(k);
  const dense = steps.length >= 6;
  return (
    <div style={{ margin: '20px 2px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {steps.map((s, i) => {
          const hit = count >= s;
          const isNext = s === next;
          return (
            <React.Fragment key={s}>
              {i > 0 ? <div style={{ flex: 1, height: 2, borderRadius: 9999, background: hit ? 'rgba(74,74,66,0.6)' : 'var(--soft2)', margin: dense ? '0 3px' : '0 5px', minWidth: 4 }} /> : null}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <span className="tnum" style={{
                  minWidth: dense ? 24 : 30, height: dense ? 24 : 30, borderRadius: 9999, padding: dense ? '0 4px' : '0 7px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font)', fontWeight: 500, fontSize: dense ? 10 : 11.5,
                  background: hit ? 'var(--fill)' : 'var(--card)',
                  color: hit ? 'var(--on-fill)' : isNext ? 'var(--ink)' : 'var(--ink3)',
                  boxShadow: hit ? 'none'
                    : isNext ? 'inset 0 0 0 1.8px rgba(74,74,66,0.55)' : 'none',
                }}>{s}</span>
                <span style={{ fontFamily: 'var(--font)', fontWeight: 500, fontSize: 8.5, letterSpacing: '0.08em', color: hit ? 'var(--ink2)' : 'var(--ink4)' }}>{KK_ROMAN[i]}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {next != null ? (
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 5, borderRadius: 9999, background: 'var(--soft2)', overflow: 'hidden', boxShadow: 'none' }}>
            <div style={{ width: `${Math.max(3, (count / next) * 100)}%`, height: '100%', borderRadius: 9999, background: 'var(--fill)' }} />
          </div>
          <div className="tnum" style={{ marginTop: 8, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--ink3)', textAlign: 'center' }}>
            {k.unit === 'day' ? `Day ${count}` : count} so far · tier {KK_ROMAN[steps.indexOf(next)]} at {k.unit === 'day' ? `day ${next}` : `×${next}`}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ── the detail overlay: one keepsake, told properly ──────────────────
function KeepsakeDetail({ k, onClose = () => {} }) {
  const earned = !!k.earned;
  const p = k.progress || null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 7 }}>
      <div className="ltr-dim" onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(38,37,30,0.42)', }} />
      <div className="ltr-drop" style={{
        position: 'absolute', left: 29, right: 29, top: '50%', transform: 'translateY(-54%)',
        background: 'var(--card)', borderRadius: 24,
        boxShadow: 'none',
        padding: '30px 26px 24px', textAlign: 'center',
      }}>
        {earned ? (
          <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 30, zIndex: 0, pointerEvents: 'none' }}><Particles mode="medium" /></div>
        ) : null}
        <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <KKMedallion scene={KK_SCENES[k.key]} size={136} earned={earned} progress={p} stamp={earned} tier={kkTier(k)} tierMax={k.tiers ? k.tiers.steps.length : 0} />
        </div>
        <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink3)', marginTop: 20 }}>
          {earned && k.tiers ? `Medallion · Tier ${KK_ROMAN[kkTier(k) - 1] || 'I'} of ${KK_ROMAN[k.tiers.steps.length - 1]}`
            : earned ? 'Medallion · earned' : p ? `Within reach · ${p[0]} of ${p[1]}` : k.rare ? 'Rare · still ahead' : 'Still ahead'}
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 26, letterSpacing: '0.01em', lineHeight: 1.14, color: 'var(--ink)', margin: '9px 0 0' }}>{k.name}</h2>
        {earned && k.date ? <div style={{ marginTop: 12 }}><DateStamp>{k.date}{k.tiers && k.unit !== 'day' ? ` · ×${k.tiers.count}` : ''}</DateStamp></div> : null}
        {!earned && k.hint ? <div style={{ marginTop: 12 }}><DateStamp>{k.hint}</DateStamp></div> : null}
        <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink2)', margin: '14px auto 0', maxWidth: 280, textWrap: 'pretty' }}>{kkStory(k)}</p>
        {k.tiers ? <TierLadder k={k} /> : null}
        {!k.tiers && p ? (
          <div style={{ margin: '20px 4px 0' }}>
            <div style={{ height: 6, borderRadius: 9999, background: 'var(--soft2)', overflow: 'hidden', boxShadow: 'none' }}>
              <div style={{ width: `${Math.max(3, (p[0] / p[1]) * 100)}%`, height: '100%', borderRadius: 9999, background: 'var(--fill)' }} />
            </div>
            <div className="tnum" style={{ marginTop: 9, fontFamily: 'var(--font)', fontWeight: 500, fontSize: 12, color: 'var(--ink3)', textAlign: 'center' }}>{p[0]} of {p[1]}</div>
          </div>
        ) : null}
        <div style={{ marginTop: 22 }}>
          {earned ? (
            <button className="tl-press" style={{
              appearance: 'none', border: 'none', width: '100%', cursor: 'pointer',
              background: 'var(--fill)', color: 'var(--on-fill)',
              fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5, borderRadius: 9999, padding: '16px 24px',
              boxShadow: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, letterSpacing: '0.01em',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 15V4.2M12 4.2 8 8.2M12 4.2l4 4" stroke="var(--on-fill)" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 12.5v6A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-6" stroke="var(--on-fill)" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Share it
            </button>
          ) : (
            <button onClick={onClose} className="tl-press" style={{
              appearance: 'none', border: 'none', width: '100%', cursor: 'pointer',
              background: 'var(--card)', color: 'var(--ink)',
              fontFamily: 'var(--font)', fontWeight: 600, fontSize: 15.5, borderRadius: 9999, padding: '16px 24px',
              boxShadow: 'inset 0 0 0 1.5px var(--line)', letterSpacing: '0.01em',
            }}>Keep going</button>
          )}
          <button onClick={onClose} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink2)', padding: '13px 8px 2px' }}>Back to medallions</button>
        </div>
        </div>
      </div>
    </div>
  );
}

// ── boards + live flow ───────────────────────────────────────────────
function KeepsakesFlow() {
  const [open, setOpen] = kkState(null);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <KeepsakesScreen onOpen={(k) => setOpen(k)} />
      {open ? <KeepsakeDetail k={kkByKey(open)} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}
const KeepsakeDetailScreen = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
    <KeepsakesScreen onOpen={() => {}} />
    <KeepsakeDetail k={kkByKey('bounce')} onClose={() => {}} />
  </div>
);
const KeepsakeProgressScreen = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
    <KeepsakesScreen onOpen={() => {}} />
    <KeepsakeDetail k={kkByKey('groundtaken')} onClose={() => {}} />
  </div>
);
const KeepsakeAheadScreen = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
    <KeepsakesScreen onOpen={() => {}} />
    <KeepsakeDetail k={kkByKey('told')} onClose={() => {}} />
  </div>
);

Object.assign(window, { KeepsakesScreen, KeepsakeDetailScreen, KeepsakeProgressScreen, KeepsakeAheadScreen, KeepsakesFlow, KeepsakeDetail, kkByKey, KKMedallion, KK_SCENES, KEEPSAKES, kkTier, KK_ROMAN });
