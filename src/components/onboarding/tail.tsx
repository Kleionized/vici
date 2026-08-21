/**
 * The onboarding tail — `23 · Putting Your Plan Together` … `33 · What You
 * Want Back`.
 *
 * `UI Final 1` strips the tail's chrome: not one of these eleven frames draws
 * the eight-segment rule or the Back row the previous bundle gave them. Each
 * owns its whole frame, so each is rendered whole rather than inside the
 * funnel's shell.
 *
 * Ten of the eleven share one field — a `#FAF9F8 → #FDFDFC` ground, a
 * `rgba(180,170,150,0.14)` bloom off the top-left corner, a 560pt warm sun
 * hung 300 below the bottom edge, and grain at 0.12. `25 · What Comes Before
 * It` states its own, `30 · If Nothing Changes` is a night sky, and
 * `23 · Putting Your Plan Together` is the sunrise the funnel breaks on.
 *
 * Design y minus 54 throughout (`DECISIONS.md` D009). Numbers come from
 * `src/content/onboardingTail.ts`, generated from the frames.
 */
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, type ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Line, Path, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { AppText, Grain } from '@/components/ui';
import { PressScale } from '@/components/ui/press-scale';
import { AGE_80_STARS, COST_30, COST_365, SCORE_CURVE, SCORE_RING, WINDOW_BARS } from '@/content/onboardingTail';
import { fonts, sans } from '@/lib/theme';

const noiseDark = require('../../../assets/images/noise-dark.png');

/** Design y → the app's y under the safe-area inset. */
const Y = (top: number) => top - 54;

// ── the field ten of the eleven frames share ─────────────────────────
export function TailField({
  ground = ['#FAF9F8', '#FDFDFC'] as const,
  bloomAlpha = 0.14,
  sun = { size: 560, bottom: -300, a0: 0.42, a45: 0.19 },
  grain = 0.12,
}: {
  ground?: readonly [string, string];
  bloomAlpha?: number;
  sun?: { size: number; bottom: number; a0: number; a45: number } | null;
  grain?: number;
}) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      <LinearGradient colors={[ground[0], ground[1]]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      {/* the corner bloom — the canvas blurs it 6px, and a closest-side radial
          already dies at its own edge, so the gradient's falloff carries it */}
      <Svg width={540} height={270} style={{ position: 'absolute', left: -40, top: -140 }}>
        <Defs>
          <RadialGradient id="tailBloom" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#B4AA96" stopOpacity={bloomAlpha} />
            <Stop offset="0.72" stopColor="#131313" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={270} cy={135} rx={270} ry={135} fill="url(#tailBloom)" />
      </Svg>
      {sun ? (
        <Svg width={sun.size} height={sun.size} style={{ position: 'absolute', left: '50%', marginLeft: -sun.size / 2, bottom: sun.bottom }}>
          <Defs>
            <RadialGradient id="tailSun" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#FFECC4" stopOpacity={sun.a0} />
              <Stop offset="0.45" stopColor="#FFECC4" stopOpacity={sun.a45} />
              <Stop offset="0.72" stopColor="#FFECC4" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={sun.size / 2} cy={sun.size / 2} rx={sun.size / 2} ry={sun.size / 2} fill="url(#tailSun)" />
        </Svg>
      ) : null}
      <Grain source={noiseDark} opacity={grain} />
    </View>
  );
}

/** The frame under the safe-area inset that every tail screen positions inside. */
export function TailFrame({ children, field }: { children: ReactNode; field?: ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#FAF9F8' }}>
      {field ?? <TailField />}
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        {/* Yoga places an absolute child from its parent's border box and never
            consults padding, and SafeAreaView spends the inset as padding — so
            the content has to sit in a plain view that already starts at it. */}
        <View style={{ flex: 1 }}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

// ── shared pieces ────────────────────────────────────────────────────

/** The tail's pill: 58 tall at radius 29, or 56 at 28. */
export function TailCta({
  label,
  onPress,
  y,
  h = 58,
  tone = 'ink',
  tracking = 0.2,
}: {
  label: string;
  onPress: () => void;
  /** the pill's own top on the canvas */
  y: number;
  h?: 56 | 58;
  tone?: 'ink' | 'paper';
  tracking?: number;
}) {
  const ink = tone === 'ink';
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        top: Y(y),
        height: h,
        minHeight: 0,
        borderRadius: h / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ink ? '#131313' : '#FFFFFF',
      }}>
      <AppText style={[sans('600'), { fontSize: 17, letterSpacing: tracking, color: ink ? '#FFFFFF' : '#131313' }]}>{label}</AppText>
    </PressScale>
  );
}

/** A centred run of copy at the canvas's own inset, top, size and leading. */
export function TailCopy({
  children,
  top,
  inset,
  size,
  lineHeight,
  weight = '400',
  color = '#55534E',
  tracking,
}: {
  children: ReactNode;
  top: number;
  inset: number;
  size: number;
  /** Omitted where the canvas states none — the platform's own line box then. */
  lineHeight?: number;
  weight?: '400' | '500' | '600';
  color?: string;
  tracking?: number;
}) {
  return (
    <AppText
      center
      style={[
        sans(weight),
        {
          position: 'absolute',
          left: inset,
          right: inset,
          top: Y(top),
          fontSize: size,
          color,
          ...(lineHeight != null ? { lineHeight } : null),
          ...(tracking != null ? { letterSpacing: tracking } : null),
        },
      ]}>
      {children}
    </AppText>
  );
}

/**
 * A chart the canvas sizes with `width: 100%` and a viewBox.
 *
 * An SVG given a width and a viewBox takes its height from the ratio; give it a
 * fixed height instead and `preserveAspectRatio` centres the drawing inside a
 * viewport of the wrong shape, which shifts every label. The aspect ratio is
 * carried on the wrapper so the box grows with the card.
 */
function TailChart({ vb, children }: { vb: [number, number]; children: ReactNode }) {
  return (
    <View style={{ width: '100%', aspectRatio: vb[0] / vb[1] }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${vb[0]} ${vb[1]}`}>
        {children}
      </Svg>
    </View>
  );
}

/**
 * The floating pill `29 · One Year From Now` and `30 · If Nothing Changes` hang
 * 120 off the bottom edge.
 *
 * The canvas gives it `backdrop-filter: blur(12px)` under a 94%-opaque fill.
 * React Native has no backdrop filter, so the blur is an `expo-blur` layer
 * inside the pill with the stated colour painted over it — see DECISIONS.md
 * D018 for the intensity mapping.
 */
function TailPill({ tint, fill, ring, shadow, color, children }: { tint: 'light' | 'dark'; fill: string; ring: string; shadow: string; color: string; children: ReactNode }) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 120, alignItems: 'center' }}>
      <View style={{ borderRadius: 16, overflow: 'hidden', boxShadow: `0 0 0 1px ${ring}, ${shadow}` }}>
        <BlurView intensity={24} tint={tint} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <View style={{ backgroundColor: fill, paddingTop: 13, paddingBottom: 14, paddingHorizontal: 24 }}>
          {/* The pill inherits the frame's 16px, so its line box is 19 even
              though the 15px run inside it is 17.5 — CSS's strut, which Yoga
              has no equivalent for. Stating the line box keeps the pill 46
              tall and the run centred in it. See DECISIONS.md D020. */}
          <View style={{ height: 19, justifyContent: 'center' }}>
            <AppText style={[sans('500'), { fontSize: 15, color }]}>{children}</AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

/** A white paper card with the tail's hairline and its own grain. */
function TailCard({ top, padding, children, height }: { top: number; padding: string; children: ReactNode; height?: number }) {
  const [pt, px, pb] = padding.split(' ').map(Number);
  return (
    <View
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        top: Y(top),
        ...(height != null ? { height } : null),
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.09)',
        paddingTop: pt,
        paddingHorizontal: px,
        paddingBottom: pb ?? px,
        overflow: 'hidden',
      }}>
      <Grain source={noiseDark} opacity={0.05} />
      {children}
    </View>
  );
}

// ── 23 · Putting Your Plan Together ──────────────────────────────────
/**
 * The sunrise the funnel breaks on: a five-stop ground from `#131313` to white,
 * a progress rule 311 wide with 186 filled, three checklist rows, and a 399pt
 * white disc rising off the bottom edge.
 */
const AEGIS_ROWS = ['Looking at when it usually happens', 'Looking at what usually comes right before it', 'Building your first week'];
/** How long the board holds before it hands over. The app's own timing. */
const AEGIS_MS = 6800;

export function O3PuttingTogether({ next }: { next: () => void }) {
  // The canvas draws no control here — the board hands over on its own.
  useEffect(() => {
    const id = setTimeout(next, AEGIS_MS);
    return () => clearTimeout(id);
  }, [next]);
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <LinearGradient
          colors={['#131313', '#2A2924', '#6E7069', '#C9C8C4', '#FFFFFF']}
          locations={[0, 0.26, 0.52, 0.74, 1]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <Grain source={noiseDark} opacity={0.12} />
      </View>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <AppText center style={[sans('400'), { position: 'absolute', left: 0, right: 0, top: Y(150), fontSize: 15, color: 'rgba(244,243,240,0.8)' }]}>
            Putting your plan together…
          </AppText>
          <View style={{ position: 'absolute', left: 41, top: Y(177), width: 311, height: 3, borderRadius: 2, backgroundColor: 'rgba(244,243,240,0.25)' }}>
            <View style={{ width: 186, height: 3, borderRadius: 2, backgroundColor: '#F4F3F0' }} />
          </View>
          <View style={{ position: 'absolute', left: 0, right: 0, top: Y(262), alignItems: 'center', gap: 16 }}>
            {AEGIS_ROWS.map((label, i) => {
              const done = i < 2;
              return (
                <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  {done ? (
                    <Svg width={15} height={15} viewBox="0 0 15 15" fill="none">
                      <Path d="M2.5 8l3.2 3.2L12.5 4" stroke="#F4F3F0" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  ) : (
                    /* the third row's mark is a 13pt ring with its top edge cut
                       away — a spinner frozen at one frame on the canvas */
                    <View
                      style={{
                        width: 13,
                        height: 13,
                        borderRadius: 6.5,
                        borderWidth: 2,
                        borderColor: 'rgba(244,243,240,0.55)',
                        borderTopColor: 'transparent',
                      }}
                    />
                  )}
                  <AppText style={[sans('500'), { fontSize: 15.5, color: done ? '#F4F3F0' : 'rgba(244,243,240,0.75)' }]}>{label}</AppText>
                </View>
              );
            })}
          </View>
          {/* the frame carries a 20px/500 line at y 434 with no words in it */}
          <View
            pointerEvents="none"
            style={{ position: 'absolute', left: -3, top: Y(563), width: 399, height: 399, borderRadius: 199.5, backgroundColor: '#FFFFFF', overflow: 'hidden', boxShadow: '0 -20px 70px rgba(255,255,255,0.6)' }}>
            <Grain source={noiseDark} opacity={0.08} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── 24 · Where You Get Caught ────────────────────────────────────────
/** The loop, drawn as an ellipse with two arrowheads and four labels on it. */
export function O3WhereYouGetCaught({ name, triggers, issue, next }: { name?: string; triggers: string[]; issue: string; next: () => void }) {
  const who = (name ?? '').trim();
  return (
    <TailFrame>
      <TailCopy top={166} inset={36} size={24} lineHeight={32} weight="500" color="#1D1C1A" tracking={-0.2}>
        {who ? `${who}, this is where you seem to get caught most often.` : 'This is where you seem to get caught most often.'}
      </TailCopy>
      <TailCard top={316} padding="18 12 12">
        {/* The warm core of the loop and the bead riding it. The canvas puts
            both at `left:50%; top:50%` of the *card*, with `margin-top` −32 on
            the 64pt glow and −14 on the 34pt bead — so the bead sits 3 below
            the card's centre, not on it. Yoga places an absolute child from its
            parent's border box and ignores the padding, so both carry the
            offset from the card's own top-left. */}
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
          <Svg width={64} height={64} style={{ position: 'absolute', left: 140.5, top: 75 }}>
            <Defs>
              <RadialGradient id="loopCore" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.5} />
                <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={32} cy={32} r={32} fill="url(#loopCore)" />
          </Svg>
          <View style={{ position: 'absolute', left: 155.5, top: 93, width: 34, height: 34, borderRadius: 17, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>
            <Svg width={34} height={34} style={{ position: 'absolute' }}>
              <Defs>
                <RadialGradient id="loopBead" cx="50%" cy="30%" rx="70%" ry="70%">
                  <Stop offset="0" stopColor="#FBF2E2" />
                  <Stop offset="0.65" stopColor="#F0DBB4" />
                  <Stop offset="1" stopColor="#DFC08B" />
                </RadialGradient>
              </Defs>
              <Circle cx={17} cy={17} r={17} fill="url(#loopBead)" />
            </Svg>
            <Grain source={noiseDark} opacity={0.4} />
          </View>
        </View>
        <TailChart vb={[300, 172]}>
          <Ellipse cx={150} cy={86} rx={104} ry={55} fill="none" stroke="#8B8882" strokeWidth={1.7} />
          <Path d="M249 80 h11 l-5.5 10 z" fill="#8B8882" />
          <Path d="M40 92 h11 l-5.5 -10 z" fill="#8B8882" />
          {/* the canvas knocks each label out of the ellipse with a 7pt white
              stroke drawn under the fill — `paint-order: stroke` */}
          <LoopLabel x={150} y={36} size={11.5} weight="600" fill="#1D1C1A">{`the ${issue} rises`}</LoopLabel>
          <LoopLabel x={254} y={90} size={11} weight="400" fill="#55534E">the escape</LoopLabel>
          <LoopLabel x={150} y={143} size={11} weight="400" fill="#55534E">minutes of relief</LoopLabel>
          <LoopLabel x={46} y={90} size={11} weight="400" fill="#55534E">back — deeper</LoopLabel>
        </TailChart>
      </TailCard>
      <TailCopy top={566} inset={44} size={14} lineHeight={21}>
        {`${triggers.slice(0, 3).join(' · ') || 'Late at night · Home alone · Phone in bed'} — the first situation VICI will help you change.`}
      </TailCopy>
      <TailCta label="Continue" onPress={next} y={744} />
    </TailFrame>
  );
}

function LoopLabel({ x, y, size, weight, fill, children }: { x: number; y: number; size: number; weight: string; fill: string; children: ReactNode }) {
  return (
    <>
      {/* the canvas knocks the label out of the ellipse with a 7pt white stroke
          drawn *under* the fill — `paint-order: stroke`, which RN SVG has no
          property for, so the run is drawn twice */}
      <SvgText x={x} y={y} textAnchor="middle" fontFamily={fonts.sans} fontSize={size} fontWeight={weight} fill="none" stroke="#FFFFFF" strokeWidth={7} strokeLinejoin="round">
        {children}
      </SvgText>
      <SvgText x={x} y={y} textAnchor="middle" fontFamily={fonts.sans} fontSize={size} fontWeight={weight} fill={fill}>
        {children}
      </SvgText>
    </>
  );
}

// ── 25 · What Comes Before It ────────────────────────────────────────
/** A tilted card with a dotted climb, a waypoint and a flag on it. */
export function O3WhatComesBeforeIt({ trigger, next }: { trigger?: string; next: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#F4F3F0' }}>
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        <Grain source={noiseDark} opacity={0.07} />
        <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          <Defs>
            <RadialGradient id="wcbTop" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#B4AA96" stopOpacity={0.32} />
              <Stop offset="0.55" stopColor="#B4AA96" stopOpacity={0.1} />
              <Stop offset="0.75" stopColor="#B4AA96" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx="50%" cy={-40} rx="65%" ry={150} fill="url(#wcbTop)" />
        </Svg>
        <Svg width={520} height={520} style={{ position: 'absolute', left: '50%', marginLeft: -260, bottom: -260 }}>
          <Defs>
            <RadialGradient id="wcbSun" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#FFECC4" stopOpacity={0.4} />
              <Stop offset="0.45" stopColor="#FFECC4" stopOpacity={0.18} />
              <Stop offset="0.72" stopColor="#FFECC4" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={260} cy={260} rx={260} ry={260} fill="url(#wcbSun)" />
        </Svg>
      </View>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ position: 'absolute', left: '50%', marginLeft: -130, top: Y(150), width: 260, height: 280 }}>
            <Svg width={172} height={172} style={{ position: 'absolute', left: 44, top: 16 }}>
              <Defs>
                <RadialGradient id="wcbGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                  <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.46} />
                  <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Circle cx={86} cy={86} r={86} fill="url(#wcbGlow)" />
            </Svg>
            <Svg width={156} height={15} style={{ position: 'absolute', left: 52, top: 248 }}>
              <Defs>
                <RadialGradient id="wcbShadow" cx="50%" cy="50%" rx="50%" ry="50%">
                  <Stop offset="0" stopColor="#000000" stopOpacity={0.14} />
                  <Stop offset="1" stopColor="#000000" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Ellipse cx={78} cy={7.5} rx={78} ry={7.5} fill="url(#wcbShadow)" />
            </Svg>
            <View
              style={{
                position: 'absolute',
                left: 56,
                top: 52,
                width: 148,
                height: 152,
                borderRadius: 9,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.07), 0 18px 36px rgba(40,38,32,0.16)',
                transform: [{ rotate: '-2deg' }],
                overflow: 'hidden',
              }}>
              <Grain source={noiseDark} opacity={0.05} />
              <View style={{ position: 'absolute', left: 14, top: 13, width: 52, height: 5, borderRadius: 3, backgroundColor: '#E0DFDA' }} />
              <Svg width={120} height={100} viewBox="0 0 120 100" style={{ position: 'absolute', left: 14, top: 30 }}>
                <Path d="M8 88 C30 74 22 52 44 44 C68 35 78 26 104 12" fill="none" stroke="#131313" strokeWidth={2.4} strokeLinecap="round" strokeDasharray="1 8" />
                <Circle cx={8} cy={88} r={5} fill="#131313" />
                <Circle cx={44} cy={44} r={4} fill="#FFFFFF" stroke="#131313" strokeWidth={2} />
                <Rect x={102} y={-2} width={3} height={18} rx={1.5} fill="#131313" />
                <Path d="M105 0 L118 4.5 L105 9 Z" fill="#131313" />
              </Svg>
              <Svg width={26} height={26} style={{ position: 'absolute', right: 12, bottom: 12 }}>
                <Defs>
                  <RadialGradient id="wcbSeal" cx="38%" cy="30%" rx="70%" ry="70%">
                    <Stop offset="0" stopColor="#F0DBB4" />
                    <Stop offset="0.7" stopColor="#E2BA78" />
                    <Stop offset="1" stopColor="#E2BA78" />
                  </RadialGradient>
                </Defs>
                <Circle cx={13} cy={13} r={13} fill="url(#wcbSeal)" />
              </Svg>
            </View>
          </View>
          <TailCopy top={472} inset={36} size={24} lineHeight={32} weight="500" color="#1D1C1A" tracking={-0.1}>
            {`You said ${(trigger ?? 'stress').toLowerCase()} often shows up before you watch.`}
          </TailCopy>
          <TailCopy top={560} inset={44} size={15.5} lineHeight={23}>
            When that happens, SOS will first help you get out of the situation — not sit and argue with the urge.
          </TailCopy>
          <TailCta label="Continue" onPress={next} y={688} h={56} />
          {/* the frame carries a 15px/500 #8B8882 line at y 764 with no words */}
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── 26 · The Window to Protect ───────────────────────────────────────
export function O3WindowToProtect({ triggers, next }: { triggers: string[]; next: () => void }) {
  return (
    <TailFrame>
      <TailCopy top={158} inset={26} size={22} lineHeight={22 * 1.32} weight="500" color="#1D1C1A" tracking={0.1}>
        The window to protect first.
      </TailCopy>
      <View style={{ position: 'absolute', left: 24, right: 24, top: Y(268), height: 250, borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.09)' }}>
        <AppText style={[sans('600'), { position: 'absolute', left: 20, top: 18, fontSize: 12.5, color: '#8B8882' }]}>Urges by night</AppText>
        <View style={{ position: 'absolute', left: 20, right: 20, bottom: 44, height: 130, flexDirection: 'row', alignItems: 'flex-end', gap: 14 }}>
          {WINDOW_BARS.map((b, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: b.h,
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                borderBottomLeftRadius: 2,
                borderBottomRightRadius: 2,
                backgroundColor: b.on ? '#131313' : '#DCDBD6',
              }}
            />
          ))}
        </View>
        <View style={{ position: 'absolute', left: 20, right: 20, bottom: 16, flexDirection: 'row', gap: 14 }}>
          {WINDOW_BARS.map((b, i) => (
            <AppText key={i} center style={[sans('500'), { flex: 1, fontSize: 11.5, color: '#8B8882' }]}>
              {b.label}
            </AppText>
          ))}
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          left: 24,
          right: 24,
          top: Y(540),
          height: 76,
          borderRadius: 16,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.09)',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          gap: 16,
        }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F1EFE9', alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path d="M14.5 2.5a9.5 9.5 0 1 0 7 14 9 9 0 0 1-7-14z" fill="#131313" />
          </Svg>
        </View>
        <View style={{ flexShrink: 1 }}>
          <AppText style={[sans('600'), { fontSize: 12.5, color: '#8B8882' }]}>Most active trigger</AppText>
          <AppText style={[sans('600'), { marginTop: 4, fontSize: 17.5, color: '#1D1C1A' }]}>{triggers.slice(0, 3).join(' · ') || 'Late night · Weekends · Phone in bed'}</AppText>
        </View>
      </View>
      <AppText style={[sans('400'), { position: 'absolute', left: 26, right: 26, top: Y(648), fontSize: 15, lineHeight: 22, color: '#55534E' }]}>
        Protect this window first, and a lot of the rest gets easier.
      </AppText>
      <TailCta label="Continue" onPress={next} y={764} tracking={0.3} />
    </TailFrame>
  );
}

// ── 27 · Your Starting Point ─────────────────────────────────────────
const SCORE_MAX = 3000;
const CURVE_W = 345;
const CURVE_H = 88;

/**
 * The ring gauge and the ELO curve.
 *
 * The ring's arc is `score / 3000` of the circumference, which is exactly what
 * the frame's own `stroke-dasharray: 89.7 653.5` states for its 412. The
 * curve's x-axis is the same 0…3,000 — its peak sits at x 172.5, which is
 * 1,500 — so the marker is placed by the same fraction. See `DECISIONS.md`
 * D017 for the frame's own marker, which disagrees with its own readout.
 */
export function O3StartingPoint({ score, next }: { score: number; next: () => void }) {
  const frac = Math.max(0, Math.min(1, score / SCORE_MAX));
  const dash = SCORE_RING.circumference * frac;
  const angle = -Math.PI / 2 + frac * Math.PI * 2;
  const mx = 120 + SCORE_RING.trackR * Math.cos(angle);
  const my = 120 + SCORE_RING.trackR * Math.sin(angle);
  const markerX = CURVE_W * frac;
  // the bell the canvas samples: y = 80 − 68·exp(−((x−172.5)/63.8)²)
  const curveY = (x: number) => 80 - 68 * Math.exp(-(((x - 172.5) / 63.8) ** 2));
  const line = SCORE_CURVE.map(([x, y], i) => `${i ? 'L ' : ''}${x},${y}`).join(' ');
  const area = `M0,${CURVE_H} L${line} L${CURVE_W},${CURVE_H} Z`;
  return (
    <TailFrame>
      <AppText center style={[sans('600'), { position: 'absolute', left: 0, right: 0, top: Y(150), fontSize: 12.5, letterSpacing: 1.2, color: '#8B8882' }]}>
        YOUR RECOVERY SCORE
      </AppText>
      <View style={{ position: 'absolute', left: '50%', marginLeft: -120, top: Y(192), width: 240, height: 240 }}>
        <Svg width={240} height={240} viewBox="0 0 240 240" style={{ position: 'absolute', left: 0, top: 0 }}>
          {SCORE_RING.ticks.map(([x1, y1, x2, y2], i) => (
            <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#DDDAD2" strokeWidth={1.4} />
          ))}
          <Circle cx={120} cy={120} r={SCORE_RING.trackR} fill="none" stroke="#ECEAE4" strokeWidth={SCORE_RING.strokeW} />
          <Circle
            cx={120}
            cy={120}
            r={SCORE_RING.trackR}
            fill="none"
            stroke="#131313"
            strokeWidth={SCORE_RING.strokeW}
            strokeDasharray={`${dash} ${SCORE_RING.circumference - dash}`}
            transform="rotate(-90 120 120)"
          />
          <Circle cx={mx} cy={my} r={7.5} fill="#D9A441" />
          <Circle cx={mx} cy={my} r={7.5} fill="none" stroke="#FFFFFF" strokeWidth={2.5} />
        </Svg>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <AppText style={[sans('600'), { fontSize: 60, letterSpacing: -2, lineHeight: 60, color: '#1D1C1A', fontVariant: ['tabular-nums'] as const }]}>{score.toLocaleString('en-US')}</AppText>
          <AppText style={[sans('600'), { fontSize: 12.5, color: '#8B8882' }]}>of {SCORE_MAX.toLocaleString('en-US')}</AppText>
        </View>
      </View>
      <View style={{ position: 'absolute', left: 24, right: 24, top: Y(474), height: CURVE_H }}>
        <Svg width="100%" height={CURVE_H} viewBox={`0 0 ${CURVE_W} ${CURVE_H}`}>
          <Defs>
            <ClipPath id="vici-elo-clip">
              <Rect x={0} y={0} width={markerX} height={CURVE_H} />
            </ClipPath>
          </Defs>
          <Path d={area} fill="#F1F0EB" />
          <G clipPath="url(#vici-elo-clip)">
            <Path d={area} fill="rgba(217,164,65,0.32)" />
          </G>
          <Path d={`M${line}`} fill="none" stroke="#D8D5CE" strokeWidth={1.5} />
          <Line x1={markerX} y1={curveY(markerX)} x2={markerX} y2={CURVE_H} stroke="#131313" strokeWidth={1.8} />
          <Circle cx={markerX} cy={curveY(markerX)} r={5} fill="#D9A441" stroke="#FFFFFF" strokeWidth={2} />
        </Svg>
      </View>
      <TailCopy top={584} inset={44} size={14.5} lineHeight={21}>
        This is not a grade — just where you start. It can move.
      </TailCopy>
      <TailCta label="Next" onPress={next} y={744} />
    </TailFrame>
  );
}

// ── 28 · The Next 30 Days ────────────────────────────────────────────
export function O3Next30({ times, next }: { times: number; next: () => void }) {
  return (
    <TailFrame>
      {/* the frame carries an empty 26px line at y 152 above the title */}
      <TailCopy top={190} inset={32} size={26} weight="500" color="#1D1C1A" tracking={-0.2}>
        This is your next 30 days
      </TailCopy>
      <TailCopy top={238} inset={44} size={14.5} lineHeight={21}>
        {`At the rate you reported, about ${times} of the next 30 days end the same way.`}
      </TailCopy>
      <TailCard top={308} padding="16 16 16">
        {/* `grid-template-columns: repeat(6,1fr); gap:8` with square cells */}
        <View style={{ gap: 8 }}>
          {Array.from({ length: Math.ceil(COST_30.length / 6) }, (_, r) => (
            <View key={r} style={{ flexDirection: 'row', gap: 8 }}>
              {COST_30.slice(r * 6, r * 6 + 6).map((on, i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    aspectRatio: 1,
                    borderRadius: 10,
                    backgroundColor: on ? '#131313' : '#F7F6F3',
                    boxShadow: on ? undefined : 'inset 0 0 0 1px rgba(0,0,0,0.06)',
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </TailCard>
      <TailCta label="Next" onPress={next} y={744} />
    </TailFrame>
  );
}

// ── 29 · One Year From Now ───────────────────────────────────────────
export function O3OneYear({ days, next }: { days: number; next: () => void }) {
  return (
    <TailFrame>
      {/* `grid-template-columns: repeat(15,1fr); grid-auto-rows: 1fr; gap:4`
          between y 72 and 100 off the bottom — the rows share the height, so a
          cell is 19.8 x 23.4 on the canvas rather than square */}
      <View style={{ position: 'absolute', left: 20, right: 20, top: Y(72), bottom: 100, gap: 4 }}>
        {Array.from({ length: Math.ceil(COST_365.length / 15) }, (_, r) => (
          <View key={r} style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
            {COST_365.slice(r * 15, r * 15 + 15).map((on, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  borderRadius: 5,
                  backgroundColor: on ? '#131313' : '#FFFFFF',
                  boxShadow: on ? undefined : 'inset 0 0 0 1px rgba(0,0,0,0.06)',
                }}
              />
            ))}
            {COST_365.slice(r * 15, r * 15 + 15).length < 15
              ? Array.from({ length: 15 - COST_365.slice(r * 15, r * 15 + 15).length }, (_, k) => <View key={'g' + k} style={{ flex: 1 }} />)
              : null}
          </View>
        ))}
      </View>
      <TailPill tint="light" fill="rgba(255,255,255,0.94)" ring="rgba(0,0,0,0.08)" shadow="0 18px 44px rgba(40,38,32,0.26)" color="#1D1C1A">
        {`A year at this pace — about ${days} days`}
      </TailPill>
      <TailCta label="Next" onPress={next} y={744} />
    </TailFrame>
  );
}

// ── 30 · If Nothing Changes ──────────────────────────────────────────
export function O3IfNothingChanges({ days, next }: { days: number; next: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#060606' }}>
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
          {AGE_80_STARS.map(([x, y], i) => (
            <Circle key={i} cx={x} cy={y} r={1.3} fill="#FFFFFF" />
          ))}
        </Svg>
      </View>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <TailPill tint="dark" fill="rgba(19,19,19,0.82)" ring="rgba(255,255,255,0.16)" shadow="0 18px 44px rgba(0,0,0,0.5)" color="#FFFFFF">
            {`By age 80 — about ${days.toLocaleString('en-US')} days`}
          </TailPill>
          <TailCta label="Next" onPress={next} y={744} tone="paper" />
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── 31 · Change the Line ─────────────────────────────────────────────
export function O3ChangeTheLine({ next }: { next: () => void }) {
  return (
    <TailFrame>
      <TailCopy top={148} inset={32} size={26} weight="500" color="#1D1C1A" tracking={-0.2}>
        You don’t have to fix the next year tonight.
      </TailCopy>
      <TailCopy top={237} inset={44} size={14.5} lineHeight={22}>
        You only have to make the next decision different. Then again tomorrow. That is how the line changes.
      </TailCopy>
      {/* the veil that takes the year grid down to black */}
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(6,6,6,0)', 'rgba(6,6,6,0.45)', 'rgba(6,6,6,0.85)', '#060606']}
        locations={[0.38, 0.5, 0.58, 0.66]}
        style={{ position: 'absolute', left: 0, right: 0, top: -54, bottom: 0 }}
      />
      <TailCta label="Start changing it" onPress={next} y={744} tone="paper" />
    </TailFrame>
  );
}

// ── 32 · One Bad Day ─────────────────────────────────────────────────
export function O3OneBadDay({ day, next }: { day: number; next: () => void }) {
  return (
    <TailFrame>
      <TailCopy top={170} inset={40} size={24} lineHeight={32} weight="500" color="#1D1C1A" tracking={-0.2}>
        One bad day is one bad day.
      </TailCopy>
      <TailCopy top={230} inset={48} size={14} lineHeight={21}>
        A bad day does not erase the work before it. Your lessons, logs, and medallions stay.
      </TailCopy>
      <TailCard top={316} padding="20 16 16">
        <TailChart vb={[320, 190]}>
          <Line x1={16} y1={152} x2={304} y2={152} stroke="rgba(19,19,19,0.16)" strokeWidth={1.5} />
          <Circle cx={24} cy={148} r={4.5} fill="#131313" />
          <Path d="M24,148 C100,136 180,92 288,34" fill="none" stroke="#131313" strokeWidth={3} strokeLinecap="round" />
          <Path d="M288,34 l-10.5,-1 M288,34 l-4,9.5" stroke="#131313" strokeWidth={3} strokeLinecap="round" />
          <Path d="M118,116 l8 8 M212,74 l8 8" stroke="#E2BA78" strokeWidth={3.6} strokeLinecap="round" />
          <SvgText x={122} y={140} fontFamily={fonts.sans} fontSize={11} fontWeight="500" fill="#C99F5F">slip</SvgText>
          <SvgText x={216} y={98} fontFamily={fonts.sans} fontSize={11} fontWeight="500" fill="#C99F5F">slip</SvgText>
          <SvgText x={24} y={170} fontFamily={fonts.sans} fontSize={10.5} fontWeight="500" fill="#8B8882">day 0</SvgText>
          <SvgText x={304} y={170} fontFamily={fonts.sans} fontSize={10.5} fontWeight="500" fill="#8B8882" textAnchor="end">{`today · day ${day}`}</SvgText>
        </TailChart>
      </TailCard>
      <TailCta label="Continue" onPress={next} y={744} />
    </TailFrame>
  );
}

// ── 33 · What You Want Back ──────────────────────────────────────────
/** Twelve bars falling from 100 to 16, each a shade fainter than the last. */
const WANT_BACK_BARS = Array.from({ length: 12 }, (_, i) => {
  const h = [100, 90, 80, 71, 62, 54, 46, 39, 32, 26, 21, 16][i];
  const o = [1.0, 0.94, 0.88, 0.81, 0.75, 0.69, 0.63, 0.57, 0.5, 0.44, 0.38, 0.32][i];
  return { x: 18 + i * 22.4, y: 138 - h, h, o };
});

export function O3WhatYouWantBack({ affects, next }: { affects: string[]; next: () => void }) {
  const named = affects.slice(0, 3).map((s) => s.toLowerCase());
  const list = named.length === 3 ? `${named[0]}, ${named[1]}, and ${named[2]}` : named.join(', ') || 'focus, sleep, and confidence';
  return (
    <TailFrame>
      <TailCopy top={170} inset={40} size={24} lineHeight={32} weight="500" color="#1D1C1A" tracking={-0.2}>
        The goal is not a long streak.
      </TailCopy>
      <TailCopy top={230} inset={44} size={14} lineHeight={21}>
        {`You said porn gets in the way of your ${list}. These twelve weeks are about taking those back.`}
      </TailCopy>
      <TailCard top={338} padding="20 16 10">
        <TailChart vb={[300, 170]}>
          <SvgText x={18} y={18} fontFamily={fonts.sans} fontSize={11} fontWeight="500" fill="#B0AEA8">how hard urges pull</SvgText>
          {WANT_BACK_BARS.map((b, i) => (
            <Rect key={i} x={b.x} y={b.y} width={14} height={b.h} rx={4} fill="#131313" fillOpacity={b.o} />
          ))}
          <Line x1={14} y1={138} x2={286} y2={138} stroke="rgba(19,19,19,0.16)" strokeWidth={1.5} />
          <SvgText x={18} y={158} fontFamily={fonts.sans} fontSize={10.5} fontWeight="500" fill="#8B8882">week I</SvgText>
          <SvgText x={282} y={158} fontFamily={fonts.sans} fontSize={10.5} fontWeight="500" fill="#8B8882" textAnchor="end">week XII</SvgText>
        </TailChart>
      </TailCard>
      <TailCta label="See the twelve weeks" onPress={next} y={744} />
    </TailFrame>
  );
}
