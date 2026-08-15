import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/lib/theme';

/**
 * Reference marks — the latest UI's inline SVGs, transcribed at their own
 * viewBoxes so stroke weight lands exactly as drawn on the 393px canvas.
 *
 * The earlier port re-drew these at 56×48 with the original 2px strokes, which
 * made every glyph render roughly half-weight. Keep the viewBox and the size
 * together: a 26px glyph is `width={26} viewBox="0 0 26 26"`.
 */

// ── log chooser: one mark per log kind (56px disc, 26/24px glyph) ─────

/** Sunrise — daily check-in. */
export function MarkCheckin({ color = colors.ink }: { color?: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      <Path d="M13 4.5V2M6.2 7.6L4.4 5.8M19.8 7.6l1.8-1.8" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M7.5 15a5.5 5.5 0 0 1 11 0" fill="none" stroke={color} strokeWidth={2} />
      <Path d="M3 15h20M8 19.5h10" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** Cresting line over a waterline — an urge. */
export function MarkUrge({ color = colors.ink }: { color?: string }) {
  return (
    <Svg width={26} height={20} viewBox="0 0 26 20" fill="none">
      <Path d="M2 13c4-8 9 3 13-3s7 2 9-2" stroke={color} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <Path d="M4 17.5h18" stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.45} />
    </Svg>
  );
}

/** Pennant on a staff — a win. */
export function MarkWin({ color = colors.ink }: { color?: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M6 22V3" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <Path d="M6.5 4h11l-3 4 3 4h-11" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

/** Crescent — a lapse. */
export function MarkLapse({ color = colors.ink }: { color?: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M14.5 3.5a8.5 8.5 0 1 0 6 12.5 8 8 0 0 1-6-12.5z" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

/** The 56px paper disc the log-chooser marks sit in, with its inset hairline. */
export function MarkDisc({ children, tone = 'paper' }: { children: React.ReactNode; tone?: 'paper' | 'ink' }) {
  return (
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: tone === 'ink' ? colors.ink : '#EFEDE6',
        boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {children}
    </View>
  );
}

// ── urge log: outcome marks (42px tile, 22px glyph on a 24 viewBox) ───

/** Rode it out — the wave, ridden. */
export function OutcomeRodeOut({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M2 13c4-6 8 2 11-2s6 1 9-2" stroke={color} strokeWidth={2.1} fill="none" strokeLinecap="round" />
      <Path d="M4 17.5h16" stroke={color} strokeWidth={1.9} strokeLinecap="round" opacity={0.5} />
    </Svg>
  );
}

/** Surfed with the timer — a stopwatch. */
export function OutcomeTimer({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={13} r={8} stroke={color} strokeWidth={2} fill="none" />
      <Path d="M12 9v4l2.6 2" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M9.5 3h5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** Distracted myself — a compass rose. */
export function OutcomeDistracted({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} fill="none" />
      <Path d="M15.5 8.5l-2 5-5 2 2-5z" fill={color} />
    </Svg>
  );
}

/** Reached out — a heart. */
export function OutcomeReachedOut({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20c4.2-2.3 6.6-5.2 6.6-8.7 0-2.8-1.9-4.6-4-4.6-1.4 0-2.3.7-2.6 1.8-.3-1.1-1.2-1.8-2.6-1.8-2.1 0-4 1.8-4 4.6 0 3.5 2.4 6.4 6.6 8.7z"
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** I slipped — a crescent. */
export function OutcomeSlipped({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M19 14.5A7.8 7.8 0 1 1 9.5 5 6.2 6.2 0 0 0 19 14.5z" stroke={color} strokeWidth={2} fill="none" strokeLinejoin="round" />
    </Svg>
  );
}

// ── urge log: trigger marks (46px disc, 24px solid glyph) ────────────
// The reference draws these filled, not as line icons — the weight is what
// separates a trigger tile from an outcome row.

export type TriggerMarkName =
  | 'stress'
  | 'boredom'
  | 'lonely'
  | 'tired'
  | 'social'
  | 'phone'
  | 'lateNight'
  | 'argument'
  | 'craving';

/**
 * `cut` is the disc the glyph sits on. The phone is the one mark drawn as a
 * cut-out rather than a stroke, so its screen and its home dot have to take the
 * disc's own colour — `#F1EFE9` at rest, `#131313` once the tile is selected —
 * and hardcoding either leaves a cream screen sitting on ink.
 */
export function TriggerMark({ name, color, cut = '#F1EFE9' }: { name: TriggerMarkName; color: string; cut?: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      {name === 'stress' && <Path d="M13 2L4 13h6l-1 9 9-12h-6z" fill={color} />}
      {name === 'boredom' && (
        <>
          <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2.1} fill="none" />
          <Path d="M8.5 14.5h7" stroke={color} strokeWidth={2.1} strokeLinecap="round" />
          <Circle cx={9} cy={10} r={1.2} fill={color} />
          <Circle cx={15} cy={10} r={1.2} fill={color} />
        </>
      )}
      {name === 'lonely' && (
        <>
          <Circle cx={12} cy={8} r={4} fill={color} />
          <Path d="M4.5 20c0-3.9 3.4-6.2 7.5-6.2S19.5 16.1 19.5 20z" fill={color} />
        </>
      )}
      {name === 'tired' && (
        <>
          <Path d="M13 3h6l-6 7h6" stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M4 13h5l-5 6h5" stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {name === 'social' && (
        <>
          <Circle cx={8.5} cy={8.5} r={3.3} fill={color} />
          <Circle cx={16} cy={9.5} r={2.7} fill={color} />
          <Path d="M2.5 19c0-3.2 2.7-5 6-5s6 1.8 6 5z" fill={color} />
          <Path d="M14.5 14.2c2.6.2 5 1.8 5 4.8h-3.2z" fill={color} />
        </>
      )}
      {name === 'phone' && (
        <>
          <Rect x={6} y={2.5} width={12} height={19} rx={3} fill={color} />
          <Rect x={8} y={5} width={8} height={11} rx={1} fill={cut} />
          <Circle cx={12} cy={18.6} r={1} fill={cut} />
        </>
      )}
      {/* the canvas states `fill-rule="evenodd"` here; the crescent is a simple
          closed curve so both rules paint the same pixels, but the literal is
          the literal */}
      {name === 'lateNight' && <Path d="M20.1 15.1A8.7 8.7 0 1 1 8.9 3.9 8.7 8.7 0 0 0 20.1 15.1Z" fill={color} fillRule="evenodd" />}
      {name === 'argument' && (
        <>
          <Path d="M3 5.5A1.5 1.5 0 0 1 4.5 4h9A1.5 1.5 0 0 1 15 5.5v5A1.5 1.5 0 0 1 13.5 12H8l-3.4 3v-3H4.5A1.5 1.5 0 0 1 3 10.5z" fill={color} />
          <Path d="M17 9h3a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1v2.5L16.5 16H12a1 1 0 0 1-1-1z" fill={color} opacity={0.55} />
        </>
      )}
      {name === 'craving' && (
        // the canvas leaves the heart's left side 0.4 above its right — the
        // curve bottoms out at 12.2 where the right side sits at 12.6
        <Path d="M12 22c4.5-2.4 7-5.6 7-9.4 0-3-2-5-4.3-5-1.5 0-2.4.8-2.7 2-.3-1.2-1.2-2-2.7-2C7 7.2 5 9.2 5 12.2 5 16 7.5 19.2 12 22z" fill={color} />
      )}
    </Svg>
  );
}

// ── shared chrome marks ──────────────────────────────────────────────

/** The flow back affordance: a thin chevron sized for a 17px "Back". */
export function BackGlyph({ color = colors.textMuted }: { color?: string }) {
  return (
    <Svg width={11} height={19} viewBox="0 0 11 19" fill="none">
      <Path d="M9.5 1.5L2 9.5l7.5 8" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** The flow dismiss affordance. */
export function CloseGlyph({ color = colors.textMuted, size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M3 3l14 14M17 3L3 17" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** The list disclosure chevron. */
export function ChevronGlyph({ color = colors.textSoft }: { color?: string }) {
  return (
    <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
      <Path d="M1 1l6 6-6 6" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** The lock badge worn by locked lesson tiles. */
export function LockGlyph({ color = colors.inkText }: { color?: string }) {
  return (
    <Svg width={14} height={16} viewBox="0 0 14 16" fill="none">
      <Path d="M1.5 9a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2z" fill={color} />
      <Path d="M4 7V5a3 3 0 0 1 6 0v2" fill="none" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

/** The selection check used inside filled radio pips. */
export function CheckGlyph({ color = '#FFFFFF', size = 13 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12.5l4.5 4.5L19 7" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
