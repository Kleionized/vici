import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { haptic } from '@/lib/haptics';
import { illus, lhNormal, mono, sans } from '@/lib/theme';

import { EASE_OUT } from './motion';
import { MonoText } from './Text';

// ── the strike ───────────────────────────────────────────────────────

/**
 * An earned medal arriving — struck, not faded in. One timeline, tuned once:
 *
 * | ms | |
 * |---|---|
 * | 0 → 220 | the coin fades up from nothing |
 * | 0 → ~400 | it grows from 0.86 on a soft spring (ζ 0.8: under half a percent past 1) |
 * | 60 → 700 | (`FaceCoin`) the hairline ring draws in from twelve o'clock |
 * | 150 → 450 | (`FaceCoin`) the device and its numeral come up into the face |
 * | 380 | it lands: one `success` haptic |
 * | 440 → 1540 | a slow band of light crosses the face once, left to right |
 *
 * All of it runs on the UI thread off shared values; nothing sets state per
 * frame and there is no timer. It plays once per mount — the decision is taken
 * when the medal mounts and never revisited, so a re-render cannot start it
 * again — and only for an earned medal: an unearned one is drawn still and
 * never shines. With Reduce Motion on the medal is simply there, and the
 * haptic still marks it.
 */
export const STRIKE = { from: 0.86, fade: 220, land: 380, sheenAt: 440, sheen: 1100, ring: [60, 640], glyph: [150, 300] } as const;

/** Medals whose haptic has already played this session (see `useMedalStrike`'s `id`). */
const struck = new Set<string>();

export type MedalStrikeState = {
  /** whether this mount animates at all */
  live: boolean;
  scale: SharedValue<number>;
  opacity: SharedValue<number>;
  /** the band of light, 0 (off the left edge) → 1 (off the right) */
  sheen: SharedValue<number>;
  /** the ring drawing in, 0 → 1 */
  ring: SharedValue<number>;
  /** the device and its numeral coming up, 0 → 1 */
  glyph: SharedValue<number>;
};

const buzz = () => haptic('success');

/**
 * The strike's shared values, started once on mount.
 *
 * - `play` — strike this medal (pass `earned`; an unearned medal never strikes).
 * - `delay` — hold it this long first, e.g. while the route slides in; the
 *   medal is invisible until then.
 * - `haptic` — play the landing haptic (default on).
 * - `id` — names the medal for the session: its haptic plays the first time
 *   it is struck and not on every later visit, so paging through boards does
 *   not buzz at each one. The animation itself still plays on every mount.
 */
export function useMedalStrike({ play, delay = 0, haptic: withHaptic = true, id }: { play: boolean; delay?: number; haptic?: boolean; id?: string }): MedalStrikeState {
  const reduced = useReducedMotion();
  // taken once, at mount: a later render with other props cannot restart it
  const [plan] = useState(() => ({
    live: play && !reduced,
    buzz: play && withHaptic && (id == null || !struck.has(id)),
    id,
    delay: Math.max(0, delay),
  }));
  const scale = useSharedValue<number>(plan.live ? STRIKE.from : 1);
  const opacity = useSharedValue(plan.live ? 0 : 1);
  const sheen = useSharedValue(plan.live ? 0 : 1);
  const ring = useSharedValue(plan.live ? 0 : 1);
  const glyph = useSharedValue(plan.live ? 0 : 1);

  useEffect(() => {
    if (plan.buzz && plan.id != null) struck.add(plan.id);
    if (!plan.live) {
      if (plan.buzz) buzz();
      return;
    }
    const d = plan.delay;
    const willBuzz = plan.buzz;
    opacity.value = withDelay(d, withTiming(1, { duration: STRIKE.fade, easing: EASE_OUT }));
    scale.value = withDelay(d, withSpring(1, { duration: 520, dampingRatio: 0.8 }));
    ring.value = withDelay(d + STRIKE.ring[0], withTiming(1, { duration: STRIKE.ring[1], easing: Easing.bezier(0.33, 0, 0.2, 1) }));
    glyph.value = withDelay(d + STRIKE.glyph[0], withTiming(1, { duration: STRIKE.glyph[1], easing: EASE_OUT }));
    // the haptic rides the animation clock: a zero-length step at the landing
    // whose callback fires it (and does not, if the medal unmounts first)
    sheen.value = withDelay(
      d + STRIKE.land,
      withSequence(
        withTiming(0, { duration: 0 }, (finished) => {
          'worklet';
          if (finished && willBuzz) scheduleOnRN(buzz);
        }),
        withDelay(STRIKE.sheenAt - STRIKE.land, withTiming(1, { duration: STRIKE.sheen, easing: Easing.inOut(Easing.cubic) })),
      ),
    );
  }, [plan, opacity, scale, ring, glyph, sheen]);

  return { live: plan.live, scale, opacity, sheen, ring, glyph };
}

/** The band of light: a soft white ramp, peaking well short of opaque. */
const SHEEN = ['rgba(255,255,255,0)', 'rgba(255,255,255,0.62)', 'rgba(255,255,255,0)'] as const;
/** the band's tilt, and its width as a share of the face */
const SHEEN_TILT = '20deg';
const SHEEN_W = 0.38;

/**
 * Wraps a medal's drawing in its strike: the scale and fade on the whole
 * medal, and — while it plays — the band of light, clipped to the round face
 * (`face`, the disc's diameter, centred in `size`). The wrapper is exactly
 * `size` square, so nothing around it moves.
 */
export function MedalStrike({ strike, size, face = size, children, style }: { strike: MedalStrikeState; size: number; face?: number; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { scale, opacity, sheen } = strike;
  const shell = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }] }));
  const travel = face * 1.02;
  const band = useAnimatedStyle(() => ({
    opacity: sheen.value > 0 && sheen.value < 1 ? 1 : 0,
    transform: [{ translateX: interpolate(sheen.value, [0, 1], [-travel, travel]) }, { rotate: SHEEN_TILT }],
  }));
  const inset = (size - face) / 2;
  const bandW = face * SHEEN_W;
  return (
    <Animated.View style={[{ width: size, height: size, pointerEvents: 'none' }, style, shell]}>
      {children}
      {strike.live ? (
        <View style={{ position: 'absolute', left: inset, top: inset, width: face, height: face, borderRadius: face / 2, overflow: 'hidden', pointerEvents: 'none' }}>
          <Animated.View style={[{ position: 'absolute', left: (face - bandW) / 2, top: -face * 0.3, width: bandW, height: face * 1.6 }, band]}>
            <LinearGradient colors={SHEEN} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ flex: 1 }} />
          </Animated.View>
        </View>
      ) : null}
    </Animated.View>
  );
}

export type Tier = 0 | 1 | 2 | 3 | 4;
export const TIER_NAMES = ['Paper', 'Bronze', 'Silver', 'Gold', 'Platinum'] as const;

/** Unearned tiers 1–4 are drawn whole at this opacity; an unearned Paper is redrawn dashed instead. */
export const TIER_DIM = 0.32;

/**
 * The 16 platinum ticks, computed the way the designer's kit writes them
 * (`toFixed(1)` endpoints) so at 30 and at 176 they are the frames' path
 * strings exactly.
 */
function ticks(c: number) {
  const r1 = c * 0.9;
  const r2 = c - 1;
  return Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const p = (r: number) => `${(c + Math.cos(a) * r).toFixed(1)} ${(c + Math.sin(a) * r).toFixed(1)}`;
    return `M${p(r1)}L${p(r2)}`;
  });
}

/**
 * A tier medal (design-system §7.31, the kit's `medal(tier, size, glyph)`):
 * 0 paper — a ring; 1 bronze — a heavier ring and a dashed inner one;
 * 2 silver — both solid; 3 gold — an ink disc with a ground inner ring;
 * 4 platinum — a smaller disc, sixteen ticks and the inner ring.
 *
 * `dim` is an unearned tier: Paper becomes a dashed `#5A574F` ring, the others
 * keep their drawing at opacity 0.32. The ladders set each medal on a
 * `#0D0D0D` disc of its own size (it masks the track running behind it);
 * Drop Received's 176 medal has none — `disc={false}`.
 *
 * `glyph` is the centred letter only Drop Received draws (`medal(4, 176, 'V')`):
 * Lato 700 at `round(size·0.34)`, baseline `c + fontSize·0.36`, ground on the
 * filled tiers (3–4), else ink (`#5A574F` when dim) — the kit's own rule.
 */
export function MedalTier({
  tier,
  size = 30,
  dim,
  disc = true,
  glyph,
  strike,
  style,
}: {
  tier: Tier;
  size?: number;
  dim?: boolean;
  disc?: boolean;
  glyph?: string;
  /**
   * Strike it as it arrives (`useMedalStrike`): `true`, or the strike's options
   * (`delay`, `haptic`, `id`). Ignored on a `dim` medal — an unearned tier never shines.
   */
  strike?: boolean | { delay?: number; haptic?: boolean; id?: string };
  style?: StyleProp<ViewStyle>;
}) {
  const art = <MedalArt tier={tier} size={size} dim={dim} disc={disc} glyph={glyph} style={strike && !dim ? undefined : style} />;
  if (!strike || dim) return art;
  return (
    <StruckMedal size={size} face={tier === 4 ? size * 0.82 : size - 4} {...(strike === true ? {} : strike)} style={style}>
      {art}
    </StruckMedal>
  );
}

/**
 * Any earned medal's drawing, struck as it mounts (`useMedalStrike` +
 * `MedalStrike`): wrap art that is `size` square with its round face of
 * diameter `face` centred in it.
 */
export function StruckMedal({
  size,
  face,
  delay,
  haptic: withHaptic,
  id,
  style,
  children,
}: {
  size: number;
  face?: number;
  delay?: number;
  haptic?: boolean;
  id?: string;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const strike = useMedalStrike({ play: true, delay, haptic: withHaptic, id });
  return (
    <MedalStrike strike={strike} size={size} face={face} style={style}>
      {children}
    </MedalStrike>
  );
}

function MedalArt({ tier, size, dim, disc, glyph, style }: { tier: Tier; size: number; dim?: boolean; disc: boolean; glyph?: string; style?: StyleProp<ViewStyle> }) {
  const c = size / 2;
  const ink = mono.ink;
  const ground = illus.ground;
  let body;
  if (tier === 0) {
    body = <Circle cx={c} cy={c} r={c - 2} fill={ground} stroke={dim ? mono.art : ink} strokeWidth={2} strokeDasharray={dim ? '3 6' : undefined} />;
  } else if (tier === 1) {
    body = (
      <>
        <Circle cx={c} cy={c} r={c - 2} fill={ground} stroke={ink} strokeWidth={2.5} />
        <Circle cx={c} cy={c} r={c * 0.72} fill="none" stroke={ink} strokeWidth={1.5} strokeDasharray="2 4" />
      </>
    );
  } else if (tier === 2) {
    body = (
      <>
        <Circle cx={c} cy={c} r={c - 2} fill={ground} stroke={ink} strokeWidth={3} />
        <Circle cx={c} cy={c} r={c * 0.72} fill="none" stroke={ink} strokeWidth={2} />
      </>
    );
  } else if (tier === 3) {
    body = (
      <>
        <Circle cx={c} cy={c} r={c - 2} fill={ink} />
        <Circle cx={c} cy={c} r={c * 0.74} fill="none" stroke={ground} strokeWidth={1.6} />
      </>
    );
  } else {
    body = (
      <>
        <Circle cx={c} cy={c} r={c * 0.82} fill={ink} />
        {ticks(c).map((d) => (
          <Path key={d} d={d} stroke={ink} strokeWidth={(size * 0.04).toFixed(1)} strokeLinecap="round" />
        ))}
        <Circle cx={c} cy={c} r={c * 0.66} fill="none" stroke={ground} strokeWidth={1.6} />
      </>
    );
  }
  const glyphSize = Math.round(size * 0.34);
  return (
    <View style={[{ width: size, height: size, borderRadius: c }, disc ? { backgroundColor: illus.ground } : null, style]}>
      <View style={{ width: size, height: size, opacity: dim && tier > 0 ? TIER_DIM : 1 }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {body}
          {glyph ? (
            // SVG text does not inherit the app font: the weight is the family (theme `sans()` rule)
            <SvgText
              x={c}
              y={c + glyphSize * 0.36}
              textAnchor="middle"
              fontFamily={sans('700').fontFamily}
              fontWeight="normal"
              fontSize={glyphSize}
              fill={tier >= 3 ? ground : dim ? mono.art : ink}>
              {glyph}
            </SvgText>
          ) : null}
        </Svg>
      </View>
    </View>
  );
}

/**
 * The track's ink fill. Growing, it is drawn at its full length and scaled out
 * from its left end (a transform, so the ladder's layout never moves).
 */
function LadderFill({ fill, grow }: { fill: number; grow?: number }) {
  const reduced = useReducedMotion();
  const [live] = useState(() => grow != null && !reduced);
  const [delay] = useState(() => Math.max(0, grow ?? 0));
  const p = useSharedValue(live ? 0 : 1);
  useEffect(() => {
    if (live) p.value = withDelay(delay, withTiming(1, { duration: 640, easing: EASE_OUT }));
  }, [live, delay, p]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scaleX: p.value }] }));
  return (
    <Animated.View
      style={[
        { position: 'absolute', left: '10%', width: `${fill.toFixed(1)}%` as `${number}%`, top: 14, height: 2, backgroundColor: mono.ink, transformOrigin: 'left' },
        live ? anim : null,
      ]}
    />
  );
}

/**
 * Where a count stands on a five-rung ladder (medallions-letters §1.4):
 * `reached` is the highest tier whose rung the count has met (−1 for none) and
 * `progress` how far along the track the fill runs, in tiers — the reached
 * tier plus the fraction of the way to the next rung (4 at the top; −1 when
 * nothing is reached, which draws no fill even with progress toward Paper).
 * Tiers Vidi: `ladderStanding(13, [7, 30, 90, 180, 365])` → reached 0,
 * progress 6/23 → a 5.2 % fill.
 */
export function ladderStanding(count: number, rungs: readonly number[]): { reached: -1 | Tier; progress: number } {
  const standing = rungs.filter((r) => count >= r).length;
  if (standing === 0) return { reached: -1, progress: -1 };
  const reached = (standing - 1) as Tier;
  if (standing >= rungs.length) return { reached, progress: reached };
  return { reached, progress: reached + (count - rungs[reached]) / (rungs[standing] - rungs[reached]) };
}

/**
 * The five-tier ladder of the Breakwater / Detail boards and the eight Tiers
 * pages: a 2-high track from the first medal's centre to the last's
 * (`left 10% right 10% top 14`), an ink fill, five 30 medals over it, and the
 * names under them — ink when reached, mute otherwise (`gap 10`; each name
 * column `gap 3`). The caller positions it (`left 24 right 24 top T+338`).
 *
 * - `reached` — the highest tier earned, −1 for none (Detail Paper, Tiers Archive).
 * - `progress` — where the fill ends, in tiers (`ladderStanding`). The boards
 *   fill to the reached tier (the default); the Tiers pages run part-way to
 *   the next rung: `width = (progress·20).toFixed(1) %`, as the frames print it
 *   (Vici 18.0, Logbook 20.4). No fill is drawn at 0.
 * - `thresholds` — the Tiers pages' rung under each name (`×5`, `Day 30`),
 *   12/700 nowrap, `#B5B0A8` when reached, else `#5A574F`.
 *
 * Reached is told by colour and opacity only, so the ladder is one
 * accessibility element that reads it out.
 */
export function TierLadder({
  reached,
  progress = reached,
  thresholds,
  grow,
  style,
}: {
  reached: -1 | Tier;
  progress?: number;
  thresholds?: readonly string[];
  /**
   * Run the fill out to its length on mount, after this many ms (the board
   * lets its coin land first). Once per mount; still under Reduce Motion.
   */
  grow?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const fill = reached < 0 ? 0 : Math.min(Math.max(progress, 0), 4) * 20;
  const said = TIER_NAMES.map((name, i) => `${name}${thresholds ? ` ${thresholds[i]}` : ''}, ${i <= reached ? 'reached' : 'not reached'}`);
  return (
    <View
      accessible
      role="progressbar"
      aria-label="Tiers"
      aria-valuemin={0}
      aria-valuemax={5}
      aria-valuenow={reached + 1}
      aria-valuetext={said.join('; ')}
      style={[{ gap: 10 }, style]}>
      <View style={{ height: 30 }}>
        <View style={{ position: 'absolute', left: '10%', right: '10%', top: 14, height: 2, backgroundColor: mono.line }} />
        {fill > 0 ? <LadderFill fill={fill} grow={grow} /> : null}
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flexDirection: 'row' }}>
          {TIER_NAMES.map((name, i) => (
            <View key={name} style={{ flex: 1, alignItems: 'center' }}>
              <MedalTier tier={i as Tier} dim={i > reached} />
            </View>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        {TIER_NAMES.map((name, i) => (
          <View key={name} style={{ flex: 1, alignItems: 'center', gap: 3 }}>
            <MonoText v="pill" color={i <= reached ? mono.ink : mono.mute}>
              {name}
            </MonoText>
            {thresholds ? (
              <MonoText v="pill" color={i <= reached ? mono.sub : mono.art} style={{ fontSize: 12, lineHeight: lhNormal(12) }}>
                {thresholds[i]}
              </MonoText>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}
