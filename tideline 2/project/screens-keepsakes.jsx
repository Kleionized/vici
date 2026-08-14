// screens-keepsakes.jsx — "Keepsakes" · the achievements page.
// A stamp-album of milestones: every keepsake is a faceted-paper medallion
// inside a postmark ring — earned ones in full ink with a letterpress date,
// in-progress ones wearing a progress arc, and the ones still ahead as
// blind-embossed blanks. Tapping any medallion opens its story.
//
// Exports (to window): KeepsakesScreen, KeepsakeDetailScreen, KeepsakesFlow.

const { useState: kkState } = React;

// ── palette: the worlds' faceted paper tones ─────────────────────────
const KP = {
  paper: '#F7F5EC', lit: '#EBE8DA', mid: '#DCD8C6', shade: '#C8C3AD',
  deep: '#B0AB93', ink: '#4A4A42', foam: '#FCFBF6', sun: '#F4F2E9', sunEdge: '#D8D3C1',
};

// ── the mini-scenes, one per keepsake (drawn in a 100×100 circle) ────
const KK_SCENES = {
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
  // the first urge, ridden: one curling crest
  toe: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <path d="M10 72 C 26 40, 52 30, 66 40 C 78 49, 72 60, 62 58 C 55 57, 53 50, 58 47" fill="none" stroke={KP.ink} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M10 72 C 26 40, 52 30, 66 40 L 66 72 Z" fill={KP.mid} opacity="0.55" />
      <circle cx="70" cy="34" r="2.4" fill={KP.ink} opacity="0.5" />
      <circle cx="78" cy="42" r="1.8" fill={KP.ink} opacity="0.35" />
      <rect x="0" y="72" width="100" height="28" fill={KP.lit} />
      <path d="M12 72h76" stroke={KP.foam} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M26 82q10 -4 20 0t20 0" stroke={KP.shade} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
    </g>
  ),
  // three moons climbing: crescent → half → full
  threedays: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <path d="M20 78 L80 26" stroke={KP.mid} strokeWidth="1.6" strokeDasharray="1 6" strokeLinecap="round" />
      <circle cx="27" cy="70" r="9" fill={KP.sun} stroke={KP.sunEdge} strokeWidth="1.3" />
      <path d="M27 61 a9 9 0 0 1 0 18 a11.5 11.5 0 0 0 0 -18 Z" fill={KP.shade} />
      <circle cx="50" cy="48" r="10" fill={KP.sun} stroke={KP.sunEdge} strokeWidth="1.3" />
      <path d="M50 38 a10 10 0 0 1 0 20 Z" fill={KP.mid} />
      <circle cx="74" cy="28" r="11" fill={KP.sun} stroke={KP.sunEdge} strokeWidth="1.4" />
      <circle cx="70" cy="26" r="2.2" fill={KP.lit} />
      <circle cx="77" cy="32" r="1.6" fill={KP.lit} />
      <rect x="0" y="84" width="100" height="16" fill={KP.lit} />
      <path d="M14 84h72" stroke={KP.foam} strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
    </g>
  ),
  // the letter, sent onward: envelope aloft, riding to a future self
  lettersent: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <g transform="rotate(-14 54 48)">
        <rect x="30" y="36" width="48" height="33" rx="5" fill={KP.lit} stroke={KP.shade} strokeWidth="1.2" />
        <path d="M30 40 L54 56 L78 40" fill="none" stroke={KP.shade} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M30 38 L54 23 L78 38 L54 54 Z" fill={KP.mid} stroke={KP.shade} strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="54" cy="45" r="7" fill={KP.ink} />
        <path d="M49.8 46c1.4-2 2.8-2 4.2 0s2.8 2 4.2 0" stroke={KP.paper} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </g>
      <g stroke={KP.deep} strokeWidth="2.4" strokeLinecap="round" opacity="0.8">
        <path d="M10 66 h13 M6 56 h10 M14 76 h9" />
      </g>
      <path d="M84 22 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6 Z" fill={KP.shade} />
      <path d="M26 88 q 22 -7 48 -3" stroke={KP.mid} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
    </g>
  ),
  // the open book — lessons stacking up
  lesson10: (
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
  // seven phases in an arc
  week: (
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
  // the dip that recovered: never failed twice
  bounce: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <path d="M14 46 C 26 40, 34 40, 42 48 L 52 64 C 58 54, 68 38, 84 28" fill="none" stroke={KP.ink} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 46 C 26 40, 34 40, 42 48 L 52 64 C 58 54, 68 38, 84 28 L 84 80 L 14 80 Z" fill={KP.mid} opacity="0.35" />
      <circle cx="52" cy="64" r="3.2" fill={KP.paper} stroke={KP.ink} strokeWidth="2.2" />
      <circle cx="84" cy="28" r="4.2" fill={KP.paper} stroke={KP.ink} strokeWidth="2.6" />
      <path d="M14 80 h 72" stroke={KP.shade} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
    </g>
  ),
  // five crests, stacked and rolling
  rider: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      {[30, 44, 58, 72, 86].map((y, i) => (
        <path key={y} d={`M${14 + (i % 2) * 8} ${y} q 11 -10 22 0 t 22 0 t 22 0`} fill="none" stroke={i === 4 ? KP.shade : KP.ink} strokeWidth={2.6 - i * 0.15} strokeLinecap="round" opacity={1 - i * 0.16} />
      ))}
      <circle cx="76" cy="24" r="2" fill={KP.ink} opacity="0.4" />
    </g>
  ),
  // flag planted where the sand meets the sea
  shore: (
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
  // the long road — switchbacks rising to a far light
  longroad: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <circle cx="72" cy="26" r="9" fill={KP.sun} stroke={KP.sunEdge} strokeWidth="1.4" />
      <path d="M4 44 L30 30 L58 44 Z" fill={KP.lit} opacity="0.9" />
      <path d="M30 30 L58 44 L44 44 Z" fill={KP.mid} opacity="0.9" />
      <path d="M0 52 C 30 46 66 50 100 44 L100 100 L0 100 Z" fill={KP.lit} />
      <path d="M0 72 C 34 66 70 70 100 64 L100 100 L0 100 Z" fill={KP.mid} opacity="0.75" />
      <path d="M0 88 C 40 83 72 86 100 81 L100 100 L0 100 Z" fill={KP.shade} opacity="0.6" />
      {/* the path, switchbacking up */}
      <path d="M50 96 C 24 90 22 82 44 78 C 70 73 74 66 52 62 C 34 58 38 52 56 48 C 66 45 70 40 68 35"
        fill="none" stroke={KP.foam} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M50 96 C 24 90 22 82 44 78 C 70 73 74 66 52 62 C 34 58 38 52 56 48 C 66 45 70 40 68 35"
        fill="none" stroke={KP.deep} strokeWidth="1.6" strokeLinecap="round" strokeDasharray="1 7" />
      <ellipse cx="50" cy="96" rx="4" ry="1.6" fill={KP.ink} opacity="0.45" />
    </g>
  ),
  // a full sun, doubly haloed, over a still sea
  month: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <circle cx="50" cy="42" r="26" fill="none" stroke={KP.mid} strokeWidth="1.4" strokeDasharray="2 6" />
      <circle cx="50" cy="42" r="19" fill="none" stroke={KP.shade} strokeWidth="1.2" opacity="0.8" />
      <circle cx="50" cy="42" r="12" fill={KP.sun} stroke={KP.sunEdge} strokeWidth="1.6" />
      <rect x="0" y="76" width="100" height="24" fill={KP.lit} />
      <path d="M12 76h76" stroke={KP.foam} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M30 87h40" stroke={KP.shade} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
    </g>
  ),
  // the summit, flagged, above the cloud line
  summit: (
    <g>
      <rect x="0" y="0" width="100" height="100" fill={KP.paper} />
      <path d="M14 78 L50 26 L86 78 Z" fill={KP.lit} />
      <path d="M50 26 L86 78 L64 78 Z" fill={KP.mid} />
      <path d="M50 26 L43 37 C 46 34.5, 48.5 35.5, 50 38 C 52.5 34.5, 55 34.8, 57 37 Z" fill={KP.foam} />
      <path d="M50 26 V 14" stroke={KP.ink} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M50 15 L 64 19 L 50 24 Z" fill={KP.ink} />
      <path d="M0 84 C 20 78, 42 82, 62 79 C 78 77, 92 80, 100 78 V100 H0 Z" fill={KP.foam} opacity="0.95" />
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
// tiers: { count, steps } — a keepsake levels up each time count crosses a step
const KK_ROMAN = ['I', 'II', 'III', 'IV', 'V'];
const kkTier = (k) => (k.tiers ? k.tiers.steps.filter((s) => k.tiers.count >= s).length : null);
const kkNextStep = (k) => (k.tiers ? k.tiers.steps.find((s) => k.tiers.count < s) : null);

const KEEPSAKES = [
  { key: 'lettersent', name: 'Letter sent', how: 'Wrote a letter to future you', date: 'Day XXI · Jun 30', earned: true, newest: true,
    tiers: { count: 1, steps: [1, 4, 12] },
    story: 'Three honest paragraphs, sealed for day-XXX you. It rides ahead of you now — and it knows exactly when to arrive.' },
  { key: 'bounce', name: 'Never failed twice', how: 'Slipped — and came back the next morning', date: 'Day XIX · Jun 28', earned: true,
    tiers: { count: 1, steps: [1, 10, 25, 50, 100] },
    story: 'You slipped on day XVIII. On day XIX you were back before breakfast — no spiral, no vanishing week. That bounce is the strongest predictor there is.' },
  { key: 'firstlight', name: 'First light', how: 'Your first morning check-in', date: 'Day I · Jun 10', earned: true,
    story: 'Twenty seconds of honesty on a Tuesday morning. Everything since has stacked on this.' },
  { key: 'toe', name: 'Toe in the water', how: 'Rode out your first urge', date: 'Day I · Jun 10', earned: true,
    story: 'Nine minutes, start to finish. You watched it rise, crest, and leave without you.' },
  { key: 'threedays', name: 'Three days clear', how: '72 hours, one tide at a time', date: 'Day III · Jun 12', earned: true,
    story: 'The first fog began to lift right about here — exactly on schedule.' },
  { key: 'week', name: 'One week in', how: 'Seven days of showing up', date: 'Day VII · Jun 16', earned: true,
    story: 'Seven check-ins, two urges surfed, zero perfect days required.' },
  { key: 'honest', name: 'Honest ink', how: 'Ten honest journal entries', date: 'Day XV · Jun 24', earned: true,
    tiers: { count: 12, steps: [10, 50, 100, 365] },
    story: 'Twelve entries, none of them for show. The patterns page runs on this ink — fifty starts a deeper record.' },
  { key: 'rider', name: 'Wave rider', how: 'Ride out five urges', progress: [3, 5],
    tiers: { count: 3, steps: [5, 25, 100, 250] },
    story: 'Three ridden, two to go. Each one shortens the next.' },
  { key: 'lesson10', name: 'Steady study', how: 'Finish ten lessons', progress: [4, 10],
    tiers: { count: 4, steps: [10, 25, 50, 96] },
    story: 'Four lessons down. Ten is where the ideas start meeting you in the moment, not just on the page.' },
  { key: 'longroad', name: 'The long road', how: 'Six months with VICI', progress: [24, 180],
    story: 'Day XXIV of 180. Nobody walks it in a straight line — the road only asks that you stay on it.' },
  { key: 'shore', name: 'The Landing, taken', how: 'Finish your first ground', progress: [4, 6],
    story: 'Two lessons left on the Landing. The map opens from there.' },
  { key: 'told', name: 'Let someone in', how: 'Tell one person about the work', locked: true,
    story: 'The habit lives in the dark. One honest conversation — a friend, a partner, anyone — takes half its weight away.' },
  { key: 'storm', name: 'Storm weathered', how: 'Ride out a force-nine urge', locked: true,
    story: 'One will come. When it does, the lighthouse holds.' },
  { key: 'month', name: 'A month of mornings', how: 'Thirty days in the practice', date: 'Day XXX', locked: true, hint: '6 days away',
    story: 'Thirty days is where “trying something” quietly becomes “how I live”.' },
  { key: 'summit', name: 'The summit', how: 'Ninety days — the new normal', locked: true,
    story: 'The long walk. By the time you stand here, the view is just… Tuesday.' },
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 34, letterSpacing: '0.01em', color: 'var(--ink)', margin: '14px 0 0' }}>Keepsakes</h1>
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
                <div style={{ fontFamily: 'var(--font)', fontWeight: 600, fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,244,241,0.62)' }}>Newest keepsake</div>
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
                  {k.tiers ? `Tier ${KK_ROMAN[kkTier(k) - 1] || 'I'} · ×${k.tiers.count}` : k.date}
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
  return (
    <div style={{ margin: '20px 2px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {steps.map((s, i) => {
          const hit = count >= s;
          const isNext = s === next;
          return (
            <React.Fragment key={s}>
              {i > 0 ? <div style={{ flex: 1, height: 2, borderRadius: 9999, background: hit ? 'rgba(74,74,66,0.6)' : 'var(--soft2)', margin: '0 5px' }} /> : null}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                <span className="tnum" style={{
                  minWidth: 30, height: 30, borderRadius: 9999, padding: '0 7px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font)', fontWeight: 500, fontSize: 11.5,
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
            {count} so far · tier {KK_ROMAN[steps.indexOf(next)]} at ×{next}
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
          {earned && k.tiers ? `Keepsake · Tier ${KK_ROMAN[kkTier(k) - 1] || 'I'} of ${KK_ROMAN[k.tiers.steps.length - 1]}`
            : earned ? 'Keepsake · earned' : p ? `Within reach · ${p[0]} of ${p[1]}` : 'Still ahead'}
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 26, letterSpacing: '0.01em', lineHeight: 1.14, color: 'var(--ink)', margin: '9px 0 0' }}>{k.name}</h2>
        {earned && k.date ? <div style={{ marginTop: 12 }}><DateStamp>{k.date}{k.tiers ? ` · ×${k.tiers.count}` : ''}</DateStamp></div> : null}
        {!earned && k.hint ? <div style={{ marginTop: 12 }}><DateStamp>{k.hint}</DateStamp></div> : null}
        <p style={{ fontFamily: 'var(--font)', fontWeight: 400, fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink2)', margin: '14px auto 0', maxWidth: 280, textWrap: 'pretty' }}>{k.story}</p>
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
          <button onClick={onClose} className="tl-press-soft" style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 500, fontSize: 14.5, color: 'var(--ink2)', padding: '13px 8px 2px' }}>Back to keepsakes</button>
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
    <KeepsakeDetail k={kkByKey('longroad')} onClose={() => {}} />
  </div>
);
const KeepsakeAheadScreen = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
    <KeepsakesScreen onOpen={() => {}} />
    <KeepsakeDetail k={kkByKey('told')} onClose={() => {}} />
  </div>
);

Object.assign(window, { KeepsakesScreen, KeepsakeDetailScreen, KeepsakeProgressScreen, KeepsakeAheadScreen, KeepsakesFlow, KKMedallion, KK_SCENES, KEEPSAKES, kkTier, KK_ROMAN });
