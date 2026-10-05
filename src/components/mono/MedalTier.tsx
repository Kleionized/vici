import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

import { illus, lhNormal, mono, sans } from '@/lib/theme';

import { MonoText } from './Text';

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
  style,
}: {
  tier: Tier;
  size?: number;
  dim?: boolean;
  disc?: boolean;
  glyph?: string;
  style?: StyleProp<ViewStyle>;
}) {
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
  style,
}: {
  reached: -1 | Tier;
  progress?: number;
  thresholds?: readonly string[];
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
        {fill > 0 ? (
          <View style={{ position: 'absolute', left: '10%', width: `${fill.toFixed(1)}%` as `${number}%`, top: 14, height: 2, backgroundColor: mono.ink }} />
        ) : null}
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
