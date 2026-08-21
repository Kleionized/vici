/**
 * The handover — `34 · Twelve Weeks` … `43 · Day 0`.
 *
 * Where the funnel stops asking and starts giving things: the map of the twelve
 * weeks, the letter from the man at week XII, the vow, the first medallion, the
 * reminders, and day zero.
 *
 * Like the tail, none of these frames draws the funnel's rule, and only the map
 * keeps a Back row, so each is rendered whole. Design y minus 54 throughout
 * (`DECISIONS.md` D009).
 */
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';

import { AppText, Grain } from '@/components/ui';
import { PressScale } from '@/components/ui/press-scale';
import { fonts, sans } from '@/lib/theme';

const noiseDark = require('../../../assets/images/noise-dark.png');
const laurelMark = require('../../../assets/images/laurel-mark.webp');

const Y = (top: number) => top - 54;

/**
 * The field `37 · A Letter Arrived` and `43 · Day 0` share with
 * `25 · What Comes Before It`: flat paper, light grain, a wide top wash and a
 * 520pt sun hung 260 below the bottom edge.
 */
export function PaperArrivalField({ sun = true, grain = 0.07 }: { sun?: boolean; grain?: number }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      <Grain source={noiseDark} opacity={grain} />
      <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <Defs>
          <RadialGradient id="arrTop" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#B4AA96" stopOpacity={0.32} />
            <Stop offset="0.55" stopColor="#B4AA96" stopOpacity={0.1} />
            <Stop offset="0.75" stopColor="#B4AA96" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx="50%" cy={-40} rx="65%" ry={150} fill="url(#arrTop)" />
      </Svg>
      {sun ? (
        <Svg width={520} height={520} style={{ position: 'absolute', left: '50%', marginLeft: -260, bottom: -260 }}>
          <Defs>
            <RadialGradient id="arrSun" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#FFECC4" stopOpacity={0.4} />
              <Stop offset="0.45" stopColor="#FFECC4" stopOpacity={0.18} />
              <Stop offset="0.72" stopColor="#FFECC4" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={260} cy={260} rx={260} ry={260} fill="url(#arrSun)" />
        </Svg>
      ) : null}
    </View>
  );
}

/** The frame every handover screen positions inside. */
function Frame({ children, bg, field }: { children: ReactNode; bg: string; field?: ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {field}
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

/** The close cross three of these frames put at `right: 20/22, top: 66/26`. */
function CloseCross({ onPress, size, right, top, stroke, width }: { onPress: () => void; size: number; right: number; top: number; stroke: string; width: number }) {
  const a = size === 18 ? 3 : 3;
  const b = size - a;
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Close"
      hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
      style={{ position: 'absolute', right, top, width: size, height: size, minHeight: 0 }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <Path d={`M${a} ${a}l${b - a} ${b - a}M${b} ${a}L${a} ${b}`} stroke={stroke} strokeWidth={width} strokeLinecap="round" />
      </Svg>
    </PressScale>
  );
}

/** The ink pill these frames close on — 56 tall at radius 28, or 54 at 27. */
function Cta({ label, onPress, y, h = 56, tracking = 0.2, tone = 'ink' }: { label: string; onPress: () => void; y: number; h?: 54 | 56 | 58; tracking?: number; tone?: 'ink' | 'paper' }) {
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

/** The quiet line under the pill — 15px/500 `#8B8882`, centred. */
function Quiet({ label, onPress, y }: { label: string; onPress: () => void; y: number }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      hitSlop={{ top: 14, bottom: 14, left: 24, right: 24 }}
      style={{ position: 'absolute', left: 0, right: 0, top: Y(y), minHeight: 0 }}>
      {/* the canvas centres the words inside a full-width box, so the box is
          full width here too rather than shrunk to the words */}
      <AppText center style={[sans('500'), { fontSize: 15, color: '#8B8882' }]}>{label}</AppText>
    </PressScale>
  );
}

// ── 37 · A Letter Arrived ────────────────────────────────────────────
/** An envelope on its back with a wax seal, tilted 2°. */
export function O3LetterArrived({ next, skip }: { next: () => void; skip: () => void }) {
  return (
    <Frame bg="#F4F3F0" field={<PaperArrivalField />}>
      <CloseCross onPress={skip} size={18} right={20} top={Y(66)} stroke="#55534E" width={2.2} />
      <View style={{ position: 'absolute', left: '50%', marginLeft: -130, top: Y(160), width: 260, height: 260 }}>
        <Svg width={180} height={180} style={{ position: 'absolute', left: 40, top: 10 }}>
          <Defs>
            <RadialGradient id="letGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.5} />
              <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={90} cy={90} r={90} fill="url(#letGlow)" />
        </Svg>
        <Svg width={180} height={16} style={{ position: 'absolute', left: 40, top: 226 }}>
          <Defs>
            <RadialGradient id="letShadow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#000000" stopOpacity={0.14} />
              <Stop offset="1" stopColor="#000000" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={90} cy={8} rx={90} ry={8} fill="url(#letShadow)" />
        </Svg>
        <View
          style={{
            position: 'absolute',
            left: 46,
            top: 70,
            width: 168,
            height: 118,
            borderRadius: 10,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.07), 0 16px 32px rgba(40,38,32,0.18)',
            transform: [{ rotate: '-2deg' }],
            overflow: 'hidden',
          }}>
          <LinearGradient colors={['#FCFAF4', '#F1EEE4']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          <Grain source={noiseDark} opacity={0.07} />
          <Svg width={168} height={118} viewBox="0 0 168 118" style={{ position: 'absolute', top: 0, left: 0 }}>
            <Path d="M2 4 L84 66 L166 4" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={1.6} />
          </Svg>
        </View>
        <View
          style={{
            position: 'absolute',
            left: 106,
            top: 112,
            width: 48,
            height: 48,
            borderRadius: 24,
            boxShadow: 'inset 0 0 0 3px rgba(255,255,255,0.25), 0 5px 12px rgba(180,140,70,0.45)',
            transform: [{ rotate: '-2deg' }],
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
          <Svg width={48} height={48} style={{ position: 'absolute', top: 0, left: 0 }}>
            <Defs>
              <RadialGradient id="letSeal" cx="38%" cy="30%" rx="72%" ry="72%">
                <Stop offset="0" stopColor="#F0DBB4" />
                <Stop offset="0.62" stopColor="#E2BA78" />
                <Stop offset="1" stopColor="#C99F5F" />
              </RadialGradient>
            </Defs>
            <Circle cx={24} cy={24} r={24} fill="url(#letSeal)" />
          </Svg>
          <Svg width={20} height={13} viewBox="0 0 40 26" style={{ opacity: 0.55 }}>
            <Path d="M21 3 L21 16 L12 16 Z" fill="#5b4a28" />
            <Path d="M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z" fill="#5b4a28" />
          </Svg>
        </View>
      </View>
      <AppText center style={[sans('500'), { position: 'absolute', left: 36, right: 36, top: Y(472), fontSize: 24, lineHeight: 32, letterSpacing: -0.1, color: '#1D1C1A' }]}>
        A letter arrived.
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: Y(522), fontSize: 15.5, lineHeight: 23, color: '#55534E' }]}>
        From you, twelve weeks from now.
      </AppText>
      <Cta label="Open it" onPress={next} y={688} />
      <Quiet label="Save it for later" onPress={skip} y={764} />
    </Frame>
  );
}

// ── 38 · A Letter From Week XII ──────────────────────────────────────
/** A sheet from y 52 with a grab handle, a close cross and the letter in it. */
export function O3LetterRead({ name, paragraphs, onKeep, next }: { name: string; paragraphs: string[]; onKeep: () => void; next: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#EDECE7' }}>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 52, bottom: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#F4F3F0', overflow: 'hidden' }}>
        <Grain source={noiseDark} opacity={0.07} />
        <View style={{ position: 'absolute', left: 0, right: 0, top: 12, alignItems: 'center' }}>
          <View style={{ width: 38, height: 5, borderRadius: 3, backgroundColor: 'rgba(19,19,19,0.16)' }} />
        </View>
        <CloseCross onPress={next} size={20} right={22} top={26} stroke="#55534E" width={2} />
        <ScrollView
          style={{ position: 'absolute', left: 34, right: 34, top: 84, bottom: 80 }}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never">
          <AppText style={[sans('600'), { fontSize: 18, letterSpacing: -0.1, color: '#1D1C1A', marginBottom: 22 }]}>{name ? `${name} —` : 'Friend —'}</AppText>
          {paragraphs.map((p, i) => (
            <View key={i}>
              <AppText style={[sans('400'), { fontSize: 15.5, lineHeight: 27.9, color: '#3A3934', marginBottom: 20 }]}>{p}</AppText>
              {i === 2 ? <LetterMark /> : null}
            </View>
          ))}
          <AppText style={[sans('600'), { fontSize: 16, color: '#1D1C1A', marginTop: 26, marginBottom: 8 }]}>{name ? `— ${name}, at week XII` : '— you, at week XII'}</AppText>
          <PressScale
            onPress={onKeep}
            accessibilityRole="button"
            style={{ marginTop: 56, marginBottom: 6, height: 54, minHeight: 0, borderRadius: 27, backgroundColor: '#131313', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M6 4.4h12a1 1 0 0 1 1 1v14.3a.8.8 0 0 1-1.27.65L12 16.7l-5.73 3.65A.8.8 0 0 1 5 19.7V5.4a1 1 0 0 1 1-1z"
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeLinejoin="round"
              />
            </Svg>
            <AppText style={[sans('600'), { fontSize: 16.5, letterSpacing: 0.2, color: '#FFFFFF' }]}>Keep this letter</AppText>
          </PressScale>
        </ScrollView>
        <PressScale
          onPress={next}
          accessibilityRole="button"
          hitSlop={{ top: 14, bottom: 14, left: 24, right: 24 }}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 36, minHeight: 0, alignItems: 'center' }}>
          <AppText style={[sans('500'), { fontSize: 14.5, color: '#8B8882' }]}>Continue</AppText>
        </PressScale>
      </View>
    </View>
  );
}

/** The picture set into the letter after its third paragraph: a man on a shore. */
function LetterMark() {
  return (
    /* The canvas gives this block `margin: 36px auto 40px` and the paragraph
       above it `margin: 0 0 20px`. CSS collapses adjacent vertical margins to
       the larger of the two, so the gap the frame draws is 36, not 56; Yoga
       does not collapse, so the top margin is the difference. See D023. */
    <View style={{ width: 240, height: 186, marginTop: 16, marginBottom: 40, alignSelf: 'center', overflow: 'hidden' }}>
      <Svg width={112} height={112} style={{ position: 'absolute', left: 128, top: 4 }}>
        <Defs>
          <RadialGradient id="letMoon" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.38} />
            <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={56} cy={56} r={56} fill="url(#letMoon)" />
      </Svg>
      <View style={{ position: 'absolute', left: 162, top: 32, width: 34, height: 34, borderRadius: 17, backgroundColor: '#E9D2A4' }} />
      <View style={{ position: 'absolute', left: 14, top: 24, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(200,225,235,0.4)' }} />
      <View style={{ position: 'absolute', left: 44, top: 52, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(200,225,235,0.3)' }} />
      {/* three swells, each a wide ellipse cropped at its own waterline */}
      <View style={{ position: 'absolute', left: -40, right: -40, top: 100, height: 100, borderTopLeftRadius: 160, borderTopRightRadius: 160, backgroundColor: '#DEDDD6' }} />
      <View style={{ position: 'absolute', left: -90, right: -30, top: 126, height: 100, borderTopLeftRadius: 180, borderTopRightRadius: 180, backgroundColor: '#CFCEC7' }} />
      <View style={{ position: 'absolute', left: -30, right: -100, top: 148, height: 100, borderTopLeftRadius: 200, borderTopRightRadius: 200, backgroundColor: '#C5C4BD' }} />
      <View style={{ position: 'absolute', left: 34, top: 150, width: 13, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.55)', transform: [{ rotate: '14deg' }] }} />
      <View style={{ position: 'absolute', left: 58, top: 136, width: 13, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.55)', transform: [{ rotate: '10deg' }] }} />
      <View style={{ position: 'absolute', left: 84, top: 124, width: 13, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.55)', transform: [{ rotate: '6deg' }] }} />
      {/* the standard he plants, and the man beside it */}
      <View style={{ position: 'absolute', left: 139, top: 56, width: 3, height: 46, borderRadius: 2, backgroundColor: '#C6C5C0' }} />
      <View style={{ position: 'absolute', left: 142, top: 57, width: 15, height: 10, borderTopLeftRadius: 1, borderBottomLeftRadius: 1, borderTopRightRadius: 3, borderBottomRightRadius: 3, backgroundColor: '#E9D2A4' }} />
      <View style={{ position: 'absolute', left: 112, top: 64, width: 11, height: 11, borderRadius: 5.5, backgroundColor: '#B4B1AB' }} />
      <View style={{ position: 'absolute', left: 110, top: 77, width: 15, height: 27, borderRadius: 7, backgroundColor: '#C6C5C0' }} />
      <Svg width={44} height={10} style={{ position: 'absolute', left: 100, top: 100 }}>
        <Defs>
          <RadialGradient id="letFoot" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.14} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={22} cy={5} rx={22} ry={5} fill="url(#letFoot)" />
      </Svg>
    </View>
  );
}

// ── 39 · The Vow ─────────────────────────────────────────────────────
export function O3TheVow({ name, date, onSign, skip }: { name: string; date: string; onSign: () => void; skip: () => void }) {
  return (
    <Frame bg="#FFFFFF">
      <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: Y(130), fontSize: 22, letterSpacing: 0.1, color: '#1D1C1A' }]}>
        The vow.
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: Y(190), fontSize: 15.5, lineHeight: 24, color: '#55534E' }]}>
        I’m giving this twelve weeks. I don’t need to be perfect. When it gets hard, I’ll use the plan before I give in. If I have a bad day, I’ll come back the next day.
      </AppText>
      <Svg width={200} height={200} style={{ position: 'absolute', left: '50%', marginLeft: -100, top: Y(316) }}>
        <Defs>
          <RadialGradient id="vowGlow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.38} />
            <Stop offset="0.72" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={100} cy={100} r={100} fill="url(#vowGlow)" />
      </Svg>
      <View style={{ position: 'absolute', left: '50%', marginLeft: -28, top: Y(342), width: 56, height: 56, borderRadius: 28, boxShadow: '0 6px 18px rgba(226,186,120,0.45)', overflow: 'hidden' }}>
        <Svg width={56} height={56} style={{ position: 'absolute', top: 0, left: 0 }}>
          <Defs>
            <RadialGradient id="vowSun" cx="50%" cy="38%" rx="72%" ry="72%">
              <Stop offset="0" stopColor="#F8E9CB" />
              <Stop offset="0.7" stopColor="#EFD3A2" />
              <Stop offset="1" stopColor="#E3BE85" />
            </RadialGradient>
          </Defs>
          <Circle cx={28} cy={28} r={28} fill="url(#vowSun)" />
        </Svg>
      </View>
      {/* the signature block: the name in a hand, a cross, a rule, and the date */}
      <View style={{ position: 'absolute', left: 36, right: 36, top: Y(442), height: 142 }}>
        <View style={{ position: 'absolute', left: 0, right: 0, top: 34, alignItems: 'center' }}>
          <AppText style={{ fontFamily: fonts.script, fontSize: 44, lineHeight: 44, color: '#1D1C1A', transform: [{ rotate: '-3deg' }] }}>{name || 'Friend'}</AppText>
        </View>
        <AppText style={[sans('400'), { position: 'absolute', left: 14, bottom: 44, fontSize: 14, color: '#B0AEA8' }]}>×</AppText>
        <View style={{ position: 'absolute', left: 12, right: 12, bottom: 40, height: 1.5, backgroundColor: 'rgba(0,0,0,0.24)' }} />
        <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, bottom: 14, fontSize: 12, color: '#B0AEA8' }]}>{date}</AppText>
      </View>
      <Cta label="I sign it" onPress={onSign} y={688} h={54} />
      <Quiet label="Not now" onPress={skip} y={760} />
    </Frame>
  );
}

// ── 40 · Medallion Earned ────────────────────────────────────────────
export function O3MedallionEarned({ title, tier, body, next, skip }: { title: string; tier: string; body: string; next: () => void; skip: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#F6EEDD' }}>
      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        <LinearGradient colors={['#F6EEDD', '#F0E1C2']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <Svg width={340} height={340} style={{ position: 'absolute', left: '50%', marginLeft: -170, top: 70 }}>
          <Defs>
            <RadialGradient id="medHalo" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.38} />
              <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={170} cy={170} r={170} fill="url(#medHalo)" />
        </Svg>
        <Grain source={noiseDark} opacity={0.07} />
      </View>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <CloseCross onPress={skip} size={18} right={20} top={Y(66)} stroke="#55534E" width={2.2} />
          <AppText center style={[sans('600'), { position: 'absolute', left: 0, right: 0, top: Y(100), fontSize: 11, letterSpacing: 1.6, color: 'rgba(91,74,40,0.55)' }]}>
            MEDALLION EARNED
          </AppText>
          <View style={{ position: 'absolute', left: '50%', marginLeft: -130, top: Y(140), width: 260, height: 260 }}>
            <Svg width={200} height={200} style={{ position: 'absolute', left: 30, top: 20 }}>
              <Defs>
                <RadialGradient id="medGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                  <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.55} />
                  <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Circle cx={100} cy={100} r={100} fill="url(#medGlow)" />
            </Svg>
            <Svg width={156} height={16} style={{ position: 'absolute', left: 52, top: 230 }}>
              <Defs>
                <RadialGradient id="medShadow" cx="50%" cy="50%" rx="50%" ry="50%">
                  <Stop offset="0" stopColor="#000000" stopOpacity={0.15} />
                  <Stop offset="1" stopColor="#000000" stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Ellipse cx={78} cy={8} rx={78} ry={8} fill="url(#medShadow)" />
            </Svg>
            <View
              style={{
                position: 'absolute',
                left: 62,
                top: 52,
                width: 136,
                height: 136,
                borderRadius: 68,
                boxShadow:
                  'inset 0 0 0 4px rgba(255,255,255,0.25), inset 0 -8px 18px rgba(120,88,40,0.28), 0 14px 30px rgba(180,140,70,0.45)',
                transform: [{ rotate: '-3deg' }],
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                overflow: 'hidden',
              }}>
              <Svg width={136} height={136} style={{ position: 'absolute', top: 0, left: 0 }}>
                <Defs>
                  <RadialGradient id="medFace" cx="38%" cy="30%" rx="72%" ry="72%">
                    <Stop offset="0" stopColor="#F0DBB4" />
                    <Stop offset="0.62" stopColor="#E2BA78" />
                    <Stop offset="1" stopColor="#C99F5F" />
                  </RadialGradient>
                </Defs>
                <Circle cx={68} cy={68} r={68} fill="url(#medFace)" />
              </Svg>
              <View style={{ position: 'absolute', left: 9, top: 9, right: 9, bottom: 9, borderRadius: 59, boxShadow: 'inset 0 0 0 1.5px rgba(91,74,40,0.35)' }} />
              <Svg width={42} height={27} viewBox="0 0 40 26" style={{ opacity: 0.55 }}>
                <Path d="M21 3 L21 16 L12 16 Z" fill="#5b4a28" />
                <Path d="M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z" fill="#5b4a28" />
              </Svg>
              <AppText style={{ fontFamily: fonts.quote, fontSize: 17, fontWeight: '600', letterSpacing: 3, color: '#5b4a28', opacity: 0.6, marginRight: -3 }}>V</AppText>
            </View>
          </View>
          <AppText center style={[sans('600'), { position: 'absolute', left: 36, right: 36, top: Y(432), fontSize: 27, letterSpacing: -0.2, color: '#1D1C1A' }]}>{title}</AppText>
          <View style={{ position: 'absolute', left: 0, right: 0, top: Y(476), alignItems: 'center' }}>
            <View style={{ height: 30, borderRadius: 15, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)', justifyContent: 'center', paddingHorizontal: 14 }}>
              <AppText style={[sans('600'), { fontSize: 12.5, color: '#55534E' }]}>{tier}</AppText>
            </View>
          </View>
          <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: Y(530), fontSize: 15.5, lineHeight: 23, color: '#55534E' }]}>{body}</AppText>
          <Cta label="Take it" onPress={next} y={688} />
          {/* the frame draws a 15px/500 line at y 764 with no words in it */}
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── 41 · Reminders ───────────────────────────────────────────────────
/** A notification as the OS would show it, used twice: live, then dimmed. */
function NotificationCard({ top, opacity, title, when, body }: { top: number; opacity: number; title: string; when: string; body: string }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        top: Y(top),
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.09)',
        paddingVertical: 16,
        paddingHorizontal: 18,
        opacity,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Image source={laurelMark} contentFit="contain" style={{ width: 24, height: 24, opacity: 0.8 }} />
        <AppText style={[sans('600'), { flex: 1, fontSize: 15.5, color: '#1D1C1A' }]}>{title}</AppText>
        <AppText style={[sans('500'), { fontSize: 12.5, color: '#8B8882' }]}>{when}</AppText>
      </View>
      <AppText style={[sans('400'), { marginTop: 8, fontSize: 14.5, lineHeight: 21, color: '#55534E' }]}>{body}</AppText>
    </View>
  );
}

export function O3Reminders({ window: riskWindow, nightTime, onAllow, skip }: { window: string; nightTime: string; onAllow: () => void; skip: () => void }) {
  return (
    <Frame bg="#F4F3F0" field={<Grain source={noiseDark} opacity={0.07} />}>
      <AppText center style={[sans('500'), { position: 'absolute', left: 26, right: 26, top: Y(140), fontSize: 22, lineHeight: 29.04, letterSpacing: 0.1, color: '#1D1C1A' }]}>
        {`${riskWindow} is when you’re most likely to watch.`}
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 30, right: 30, top: Y(214), fontSize: 15.5, lineHeight: 23, color: '#55534E' }]}>
        Want VICI there before that window starts?
      </AppText>
      <NotificationCard top={280} opacity={1} title="Morning check-in" when="now" body="Twenty seconds — where's your head at today?" />
      <NotificationCard top={392} opacity={0.55} title="Late night ahead" when={nightTime} body="Your risky window. The wave tool is one tap away." />
      <Cta label="Turn on reminders" onPress={onAllow} y={688} tracking={0.3} />
      <Quiet label="Not now" onPress={skip} y={764} />
    </Frame>
  );
}

// ── 43 · Day 0 ───────────────────────────────────────────────────────
/** The first lesson, on a card whose top half is a night shore. */
export function O3DayZero({ lesson, next }: { lesson: string; next: () => void }) {
  return (
    <Frame bg="#F4F3F0" field={<Grain source={noiseDark} opacity={0.07} />}>
      <AppText center style={[sans('500'), { position: 'absolute', left: 0, right: 0, top: Y(118), fontSize: 22, letterSpacing: 0.1, color: '#1D1C1A' }]}>
        Day 0
      </AppText>
      <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: Y(158), fontSize: 14.5, lineHeight: 21, color: '#55534E' }]}>
        Your first lesson is ready. Start with one thing today.
      </AppText>
      <View
        style={{
          position: 'absolute',
          left: 56,
          right: 56,
          top: Y(236),
          borderRadius: 18,
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 10px 24px rgba(40,38,32,0.07)',
        }}>
        <View style={{ height: 248, overflow: 'hidden' }}>
          <LinearGradient colors={['#0B0C0F', '#12151B', '#1A2027']} locations={[0, 0.6, 1]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          <View style={{ position: 'absolute', left: 64, top: 40, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(244,243,240,0.45)' }} />
          <View style={{ position: 'absolute', left: 104, top: 72, width: 1.5, height: 1.5, borderRadius: 0.75, backgroundColor: 'rgba(244,243,240,0.3)' }} />
          <View style={{ position: 'absolute', right: 40, top: 34, width: 2, height: 2, borderRadius: 1, backgroundColor: 'rgba(244,243,240,0.35)' }} />
          <View style={{ position: 'absolute', right: 96, top: 58, width: 1.5, height: 1.5, borderRadius: 0.75, backgroundColor: 'rgba(244,243,240,0.3)' }} />
          <Svg width={56} height={56} style={{ position: 'absolute', left: 22, top: 26 }}>
            <Defs>
              <RadialGradient id="dzMoonGlow" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0" stopColor="#DFDCD3" stopOpacity={0.16} />
                <Stop offset="0.72" stopColor="#DFDCD3" stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={28} cy={28} r={28} fill="url(#dzMoonGlow)" />
          </Svg>
          <Svg width={26} height={26} viewBox="0 0 24 24" style={{ position: 'absolute', left: 37, top: 41 }}>
            <Path d="M14 3 A9 9 0 1 0 21 12 A7.2 7.2 0 0 1 14 3Z" fill="#E8E6DC" />
          </Svg>
          {/* the far shore */}
          <Svg width="100%" height="100%" viewBox="0 0 281 248" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
            <Path d="M-4,248 L-4,196 Q60,178 140,190 Q210,200 285,186 L285,248 Z" fill="#171B22" />
          </Svg>
          {/* the bench, and the man on it */}
          <View style={{ position: 'absolute', left: 38, top: 152, width: 8, height: 58, borderRadius: 3, backgroundColor: '#2C3844' }} />
          <View style={{ position: 'absolute', left: 44, top: 178, width: 82, height: 21, borderRadius: 6, backgroundColor: '#394656' }} />
          <View style={{ position: 'absolute', left: 50, top: 169, width: 28, height: 11, borderRadius: 5, backgroundColor: '#55677C' }} />
          <View style={{ position: 'absolute', left: 118, top: 199, width: 6, height: 12, borderRadius: 2, backgroundColor: '#26303C' }} />
          {/* the lamp, and the phone face-down under it */}
          <Svg width={92} height={92} style={{ position: 'absolute', right: 24, top: 118 }}>
            <Defs>
              <RadialGradient id="dzLamp" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.2} />
                <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={46} cy={46} r={46} fill="url(#dzLamp)" />
          </Svg>
          <View style={{ position: 'absolute', right: 56, top: 168, width: 52, height: 9, borderRadius: 3, backgroundColor: '#2C3844' }} />
          <View style={{ position: 'absolute', right: 76, top: 177, width: 8, height: 34, borderRadius: 2, backgroundColor: '#26303C' }} />
          <View style={{ position: 'absolute', right: 70, top: 140, width: 15, height: 26, borderRadius: 3, backgroundColor: '#DCE3EA' }} />
          <View style={{ position: 'absolute', right: 48, top: 128, width: 19, height: 19, borderRadius: 9.5, backgroundColor: '#E9D2A4', alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={10} height={9} viewBox="0 0 9 8" fill="none">
              <Path d="M1.5 4l2 2 4-4.5" stroke="#131313" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </View>
        <View style={{ paddingTop: 16, paddingHorizontal: 18, paddingBottom: 18, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={4.5} fill="#F4F3F0" />
                <Path
                  d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9L19 19M19 5l-2.1 2.1M7.1 16.9L5 19"
                  stroke="#F4F3F0"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
            <AppText style={[sans('600'), { fontSize: 13, color: '#1D1C1A' }]}>Today</AppText>
          </View>
          <AppText style={[sans('500'), { fontSize: 15, lineHeight: 22, color: '#1D1C1A' }]}>{lesson}</AppText>
        </View>
      </View>
      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 84, height: 54, flexDirection: 'row', gap: 12 }}>
        <PressScale
          onPress={next}
          accessibilityRole="button"
          style={{ flex: 1, height: 54, minHeight: 0, borderRadius: 27, backgroundColor: '#131313', alignItems: 'center', justifyContent: 'center' }}>
          <AppText style={[sans('600'), { fontSize: 16.5, letterSpacing: 0.2, color: '#FFFFFF' }]}>Begin</AppText>
        </PressScale>
      </View>
    </Frame>
  );
}
