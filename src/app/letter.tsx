import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { type ReactNode, useCallback, useState } from 'react';
import { ScrollView, View, useWindowDimensions, type TextStyle, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText, Grain, PressScale } from '@/components/ui';
import { useCreateJournalEntry, useCurrentUser, useLifeMap } from '@/lib/backend';
import { getJSON, setJSON } from '@/lib/storage';
import { sans } from '@/lib/theme';

/**
 * The post (canvas 171 → 172, and 109 → 111 for the week-XII letter).
 *
 * Every piece of post in the app arrives the same way and is read the same way,
 * so the two halves live here and the other two drops — the medallion (110/173)
 * and the yearly drop (174/175) — import them rather than redraw them.
 *
 *   `MailArrival`  the object on the lit paper field, named, with a way in and
 *                  a way to leave it for later.
 *   `MailSheet`    the sheet it opens into: a rounded page over the day, with a
 *                  grabber, a close, a scrolling body and two actions.
 *
 * The canvas retired the folded-paper composition it used to draw the letter
 * with — the creases, the dimmed day behind it, the postmark ring, the separate
 * week-XII page with its finished progress bar. What is left is the sheet.
 *
 * Canvas tops below are the 393 × 852 frame's, less the 54pt status bar.
 */

const noiseDark = require('../../assets/images/noise-dark.png');

const LETTER_KEY = 'tideline.letter.day3';
const PENDING_KEY = 'tideline.letter.pending';

type Variant = 'post' | 'week12';
type Phase = 'arrive' | 'read';

const ARRIVAL: Record<Variant, { title: string; sub: string; open: string; defer: string }> = {
  post: {
    title: 'The post is in.',
    sub: 'A short letter from VICI — two minutes, worth keeping.',
    open: 'Read it',
    defer: 'Tonight',
  },
  week12: {
    title: 'A letter arrived.',
    sub: 'From the man at week XII — sealed the night you started.',
    open: 'Open it',
    defer: 'Save it for tonight',
  },
};

export default function LetterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ variant?: string }>();
  const user = useCurrentUser();
  const lifeMap = useLifeMap();
  const createJournalEntry = useCreateJournalEntry();
  const [phase, setPhase] = useState<Phase>('arrive');

  const variant: Variant = params.variant === 'week12' ? 'week12' : 'post';
  const name = user?.displayName?.trim().split(/\s+/)[0] || 'friend';
  const why = lifeMap?.whyStatement?.trim() || 'I want to be present for the people I love';

  const dismiss = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(app)/today');
  }, [router]);

  // Tuck it into the Log — the letter becomes a journal entry, once. The
  // week-XII letter was already written there the night it was sealed, so that
  // variant only closes.
  const keep = useCallback(() => {
    if (variant === 'week12') {
      dismiss();
      return;
    }
    void (async () => {
      const prev = await getJSON<{ kept?: boolean }>(LETTER_KEY);
      await setJSON(LETTER_KEY, { kept: true, at: Date.now() });
      await setJSON(PENDING_KEY, null);
      if (prev?.kept) return;
      const body = `Dear ${name},\n\nIf you're reading this, it happened. Good. You opened the letter instead of disappearing. That's the only door that matters this morning.\n\nOne slip is a wave, not the sea. Nothing since day zero is erased — the days stood, the urges outlasted, the reason you started: ${why}. All still yours.\n\nThe only slip that can end this is the one you answer with a second. So: water, daylight, one lesson. Don't fail twice.\n\nI'll see you tonight, steadier.\n\n— the you who makes it out`;
      await createJournalEntry({ tag: 'Letter', title: 'Don’t fail twice', body }).catch(() => {});
    })();
    dismiss();
  }, [createJournalEntry, dismiss, name, variant, why]);

  const later = useCallback(() => {
    if (variant === 'post') void setJSON(PENDING_KEY, null);
    dismiss();
  }, [dismiss, variant]);

  const copy = ARRIVAL[variant];

  return (
    <View style={{ flex: 1, backgroundColor: phase === 'arrive' ? '#F4F3F0' : '#EDECE7' }}>
      <StatusBar style="dark" />

      {phase === 'arrive' ? (
        <MailArrival
          art={<EnvelopeArt />}
          title={copy.title}
          sub={copy.sub}
          primary={copy.open}
          secondary={copy.defer}
          onPrimary={() => setPhase('read')}
          onSecondary={later}
        />
      ) : (
        <MailSheet onClose={later}>
          {/* Letter Week XII drops its floor to 80 and scrolls the pill with
              the words; the other two keep it pinned over a 160 floor. */}
          <LetterBody bottom={variant === 'week12' ? 80 : 160} showsIndicator={variant === 'week12'}>
            {variant === 'week12' ? <Week12Letter name={name} onKeep={keep} /> : <PostLetter name={name} why={why} />}
          </LetterBody>
          {variant === 'week12' ? (
            <PressScale
              onPress={later}
              accessibilityRole="button"
              hitSlop={{ top: 14, bottom: 14, left: 40, right: 40 }}
              style={{ position: 'absolute', left: 0, right: 0, bottom: 36, minHeight: 0, alignItems: 'center' }}>
              <AppText style={[sans('500'), { fontSize: 14.5, color: '#8B8882' }]}>Continue</AppText>
            </PressScale>
          ) : (
            <LetterFooter primary="Tuck it into your Log" secondary="Close" onPrimary={keep} onSecondary={later} />
          )}
        </MailSheet>
      )}
    </View>
  );
}

/* ------------------------------------------------------------- 171 · arrival */

/**
 * The arrival every drop shares: grain, two washes, the object in a 260 × 260
 * frame at canvas y 160, the name of the thing, and the two ways on.
 *
 * The canvas puts the pair of actions at y 688 / 764 of its 852 frame; they are
 * held off the bottom by the same distance instead, so a shorter phone loses
 * artwork rather than the way in.
 */
export function MailArrival({
  art,
  title,
  sub,
  primary,
  secondary,
  onPrimary,
  onSecondary,
  onClose,
  /**
   * `Medallion Received` (90F) re-cut this arrival without changing the letter's
   * or the drop's, so the pieces it moves are optional overrides and every
   * default below is still the value `Letter Arrival` and `Drop Received` draw.
   */
  field,
  halo,
  eyebrow,
  chip,
  artTop = 106,
  titleTop = 418,
  titleStyle,
  subTop = 468,
}: {
  art: ReactNode;
  title: string;
  sub: string;
  primary: string;
  secondary: string;
  onPrimary: () => void;
  onSecondary: () => void;
  /** The corner X, when leaving is not the same thing as deferring. */
  onClose?: () => void;
  /** A gradient field in place of the letter's two washes. */
  field?: readonly [string, string];
  /** One centred disc of light, given as [size, top, colour, alpha, stop]. */
  halo?: readonly [number, number, string, number, number];
  eyebrow?: string;
  chip?: string;
  artTop?: number;
  titleTop?: number;
  titleStyle?: TextStyle;
  subTop?: number;
}) {
  const { width } = useWindowDimensions();

  return (
    <>
      {field ? <LinearGradient colors={[field[0], field[1]]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} /> : null}
      {halo ? (
        <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: halo[1], alignItems: 'center' }}>
          <Svg width={halo[0]} height={halo[0]}>
            <Defs>
              <RadialGradient id="ma-halo" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0" stopColor={halo[2]} stopOpacity={halo[3]} />
                <Stop offset={halo[4]} stopColor={halo[2]} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Ellipse cx={halo[0] / 2} cy={halo[0] / 2} rx={halo[0] / 2} ry={halo[0] / 2} fill="url(#ma-halo)" />
          </Svg>
        </View>
      ) : null}
      {/* the canvas paints the grain first and lays the two washes over it, not under */}
      <Grain source={noiseDark} opacity={0.07} />

      <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', opacity: field ? 0 : 1 }}>
        {/* canvas blurs this by 5px; RN SVG has no blur filter, so the falloff is the gradient's */}
        <Svg width={width * 1.3} height={300} style={{ position: 'absolute', left: -width * 0.15, top: -190 }}>
          <Defs>
            <RadialGradient id="lt-top" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#B4AA96" stopOpacity={0.32} />
              <Stop offset="0.55" stopColor="#B4AA96" stopOpacity={0.1} />
              <Stop offset="0.75" stopColor="#B4AA96" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={(width * 1.3) / 2} cy={150} rx={(width * 1.3) / 2} ry={150} fill="url(#lt-top)" />
        </Svg>
        <Svg width={520} height={520} style={{ position: 'absolute', left: '50%', bottom: -260, marginLeft: -260 }}>
          <Defs>
            <RadialGradient id="lt-bottom" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#FFECC4" stopOpacity={0.4} />
              <Stop offset="0.45" stopColor="#FFECC4" stopOpacity={0.18} />
              <Stop offset="0.72" stopColor="#FFECC4" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={260} cy={260} rx={260} ry={260} fill="url(#lt-bottom)" />
        </Svg>
      </View>

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Yoga positions an absolute child from its parent's border box and never
            consults padding, and the safe-area inset IS padding — so an absolute
            child of SafeAreaView lands under the status bar. This plain flex child
            carries the inset into its own border box. */}
        <View style={{ flex: 1 }}>
          <PressScale
            onPress={onClose ?? onSecondary}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 18, bottom: 18, left: 18, right: 18 }}
            style={{ position: 'absolute', right: 20, top: 12, minHeight: 0 }}>
            <Svg width={18} height={18} viewBox="0 0 18 18">
              <Path d="M3 3l12 12M15 3L3 15" stroke="#55534E" strokeWidth={2.2} strokeLinecap="round" />
            </Svg>
          </PressScale>

          {eyebrow ? (
            <AppText center style={[sans('600'), { position: 'absolute', left: 0, right: 0, top: 46, fontSize: 11, letterSpacing: 1.6, color: 'rgba(91,74,40,0.55)' }]}>
              {eyebrow}
            </AppText>
          ) : null}

          <View pointerEvents="none" style={{ position: 'absolute', left: '50%', top: artTop, width: 260, height: 260, marginLeft: -130 }}>
            {art}
          </View>

          <AppText
            center
            style={[
              sans('500'),
              { position: 'absolute', left: 36, right: 36, top: titleTop, fontSize: 24, lineHeight: 32, letterSpacing: -0.1, color: '#1D1C1A' },
              titleStyle,
            ]}>
            {title}
          </AppText>
          {chip ? (
            <View style={{ position: 'absolute', left: 0, right: 0, top: 422, alignItems: 'center' }}>
              <View style={{ height: 30, borderRadius: 15, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.1)', paddingHorizontal: 14, justifyContent: 'center' }}>
                <AppText style={[sans('600'), { fontSize: 12.5, color: '#55534E' }]}>{chip}</AppText>
              </View>
            </View>
          ) : null}
          <AppText center style={[sans('400'), { position: 'absolute', left: 44, right: 44, top: subTop, fontSize: 15.5, lineHeight: 23, color: '#55534E' }]}>
            {sub}
          </AppText>

          <PressScale
            onPress={onPrimary}
            accessibilityRole="button"
            style={{
              position: 'absolute',
              left: 24,
              right: 24,
              bottom: 108,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#131313',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText style={[sans('600'), { fontSize: 17, letterSpacing: 0.2, color: '#FFFFFF' }]}>{primary}</AppText>
          </PressScale>
          <PressScale
            onPress={onSecondary}
            accessibilityRole="button"
            hitSlop={{ top: 14, bottom: 14, left: 40, right: 40 }}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 70, minHeight: 0, alignItems: 'center' }}>
            <AppText style={[sans('500'), { fontSize: 15, color: '#8B8882' }]}>{secondary}</AppText>
          </PressScale>
        </View>
      </SafeAreaView>
    </>
  );
}

/** Canvas frame 260 × 260: glow, contact shadow, envelope face down, wax seal. */
export function EnvelopeArt() {
  return (
    <>
      {/* canvas blurs both of these (5px / 6px) — redrawn as soft radials */}
      <Svg width={180} height={180} style={{ position: 'absolute', left: 40, top: 10 }}>
        <Defs>
          <RadialGradient id="lt-glow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.5} />
            <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={90} cy={90} rx={90} ry={90} fill="url(#lt-glow)" />
      </Svg>
      <Svg width={180} height={16} style={{ position: 'absolute', left: 40, top: 226 }}>
        <Defs>
          <RadialGradient id="lt-shadow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="0.6" stopColor="#000000" stopOpacity={0.05} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={90} cy={8} rx={90} ry={8} fill="url(#lt-shadow)" />
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
        <LinearGradient colors={['#FCFAF4', '#F1EEE4']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <Grain source={noiseDark} opacity={0.07} />
        <Svg width={168} height={118} viewBox="0 0 168 118" style={{ position: 'absolute', top: 0, left: 0 }}>
          <Path d="M2 4 L84 66 L166 4" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={1.6} />
        </Svg>
      </View>

      <View style={{ position: 'absolute', left: 106, top: 112, transform: [{ rotate: '-2deg' }] }}>
        <WaxSeal size={48} glyph={20} shadow="inset 0 0 0 3px rgba(255,255,255,0.25), 0 5px 12px rgba(180,140,70,0.45)" />
      </View>
    </>
  );
}

/** The gold wax disc — `radial-gradient(circle at 38% 30%, …)` with the laurel struck into it. */
export function WaxSeal({ size, glyph, shadow }: { size: number; glyph: number; shadow: string }) {
  const id = `seal-${size}`;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, boxShadow: shadow, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
        <Defs>
          {/* `circle at 38% 30%` takes CSS's default farthest-corner extent: the far
              corner sits 0.935 of the box away, so the ramp runs to 93.5%, not 50% */}
          <RadialGradient id={id} cx="38%" cy="30%" rx="93.5%" ry="93.5%">
            <Stop offset="0" stopColor="#F0DBB4" />
            <Stop offset="0.62" stopColor="#E2BA78" />
            <Stop offset="1" stopColor="#C99F5F" />
          </RadialGradient>
        </Defs>
        <Ellipse cx={size / 2} cy={size / 2} rx={size / 2} ry={size / 2} fill={`url(#${id})`} />
      </Svg>
      <LaurelStrike width={glyph} />
    </View>
  );
}

/**
 * The laurel struck into wax — the canvas's two-path mark at 55% ink.
 *
 * It stays in flow (both callers centre it in a flex column) but is positioned,
 * because on web `<Svg>` lays out static and CSS paints every positioned box in
 * a stacking context above every static one, whatever the document order — so a
 * static mark would slide underneath the absolutely-placed disc it is struck on.
 */
export function LaurelStrike({ width, color = '#5b4a28' }: { width: number; color?: string }) {
  return (
    <Svg width={width} height={(width * 26) / 40} viewBox="0 0 40 26" opacity={0.55} style={{ position: 'relative' }}>
      <Path d="M21 3 L21 16 L12 16 Z" fill={color} />
      <Path d="M7 18 L33 18 Q30 24 20 24 Q10 24 7 18 Z" fill={color} />
    </Svg>
  );
}

/* ---------------------------------------------------------------- 172 · read */

/**
 * The sheet a drop opens into — canvas y 52, so it rides two points over the
 * top of the safe area and the field behind it (#EDECE7) shows only in the
 * status bar. Children position themselves against the sheet, not the screen.
 */
export function MailSheet({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']} pointerEvents="box-none">
      {/* the inset is Yoga padding on the SafeAreaView, and an absolute child is
          laid out from the border box — this plain flex child carries it */}
      <View style={{ flex: 1 }} pointerEvents="box-none">
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: -2,
            bottom: 0,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            backgroundColor: '#F4F3F0',
            overflow: 'hidden',
          }}>
          <Grain source={noiseDark} opacity={0.07} />

          <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 12, alignItems: 'center' }}>
            <View style={{ width: 38, height: 5, borderRadius: 3, backgroundColor: 'rgba(19,19,19,0.16)' }} />
          </View>

          <PressScale
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            style={{ position: 'absolute', right: 22, top: 26, minHeight: 0 }}>
            <Svg width={20} height={20} viewBox="0 0 20 20">
              <Path d="M3 3l14 14M17 3L3 17" stroke="#55534E" strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </PressScale>

          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}

/**
 * The written half of a letter: canvas left 34 / right 34, top 84. The floor is
 * 160 on the two letters whose pill is pinned over it, and 80 on the week-XII
 * letter, whose pill scrolls with the words instead.
 */
export function LetterBody({ bottom = 160, showsIndicator = false, children }: { bottom?: number; showsIndicator?: boolean; children: ReactNode }) {
  return (
    <ScrollView
      style={{ position: 'absolute', left: 34, right: 34, top: 84, bottom }}
      showsVerticalScrollIndicator={showsIndicator}
      contentInsetAdjustmentBehavior="never">
      {children}
    </ScrollView>
  );
}

/** Keep it, or leave it — the pair every letter closes on. */
/**
 * The pill both footers are made of. `Letter Week XII` scrolls it with the
 * words rather than pinning it, so it has to be renderable on its own.
 */
export function KeepPill({ label, onPress, style }: { label: string; onPress: () => void; style?: ViewStyle }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      style={[
        {
          height: 54,
          minHeight: 54,
          borderRadius: 27,
          backgroundColor: '#131313',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 9,
        },
        style,
      ]}>
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path
          d="M6 4.4h12a1 1 0 0 1 1 1v14.3a.8.8 0 0 1-1.27.65L12 16.7l-5.73 3.65A.8.8 0 0 1 5 19.7V5.4a1 1 0 0 1 1-1z"
          stroke="#FFFFFF"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </Svg>
      <AppText style={[sans('600'), { fontSize: 16.5, letterSpacing: 0.2, color: '#FFFFFF' }]}>{label}</AppText>
    </PressScale>
  );
}

export function LetterFooter({
  primary,
  secondary,
  onPrimary,
  onSecondary,
  secondaryBottom = 44,
}: {
  primary: string;
  secondary: string;
  onPrimary: () => void;
  onSecondary: () => void;
  /** 44 on the two pinned letters; 36 where the pill has left the floor. */
  secondaryBottom?: number;
}) {
  return (
    <>
      <KeepPill label={primary} onPress={onPrimary} style={{ position: 'absolute', left: 24, right: 24, bottom: 88 }} />
      <PressScale
        onPress={onSecondary}
        accessibilityRole="button"
        hitSlop={{ top: 14, bottom: 14, left: 40, right: 40 }}
        style={{ position: 'absolute', left: 0, right: 0, bottom: secondaryBottom, minHeight: 0, alignItems: 'center' }}>
        <AppText style={[sans('500'), { fontSize: 14.5, color: '#8B8882' }]}>{secondary}</AppText>
      </PressScale>
    </>
  );
}

/** "Dear Sam," — 22/600 on the two VICI letters, 18/600 on the one he wrote himself. */
export function Salutation({ children, fontSize = 22, letterSpacing = 0.6, gap = 24 }: { children: ReactNode; fontSize?: number; letterSpacing?: number; gap?: number }) {
  return <AppText style={[sans('600'), { fontSize, letterSpacing, color: '#1D1C1A', marginBottom: gap }]}>{children}</AppText>;
}

/** A paragraph of letter: 15.5 at line-height 1.8. */
export function LetterP({ children, gap = 26 }: { children: ReactNode; gap?: number }) {
  return <AppText style={[sans('400'), { fontSize: 15.5, lineHeight: 15.5 * 1.8, color: '#3A3934', marginBottom: gap }]}>{children}</AppText>;
}

/**
 * The name at the foot, and the pen stroke under it.
 *
 * `gap` is the space that actually opens above the signoff, not the canvas's
 * `margin-top` — CSS collapses that against the last paragraph's margin-bottom
 * and takes the larger of the two, while Yoga adds them. So a canvas pair of
 * (26 below, 20 above) is a 26 gap, which the paragraph has already spent.
 */
export function Signoff({ children, gap = 0 }: { children: ReactNode; gap?: number }) {
  return (
    <>
      <AppText style={[sans('600'), { fontSize: 16, color: '#1D1C1A', marginTop: gap }]}>{children}</AppText>
      <Svg width={150} height={12} viewBox="0 0 150 12" fill="none" style={{ marginTop: 4 }}>
        <Path d="M2 8 C 34 2, 58 10, 86 6 S 132 4, 148 7" stroke="rgba(38,38,31,0.5)" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </Svg>
    </>
  );
}

/* --------------------------------------------------------- the two letters */

/** 172 · the morning after a slip, with the reason you started set in your own words. */
function PostLetter({ name, why }: { name: string; why: string }) {
  return (
    <>
      <Salutation>Dear {name},</Salutation>
      <LetterP>
        If you&rsquo;re reading this, it happened. Good. You opened the letter instead of disappearing. That&rsquo;s the only door that matters this
        morning.
      </LetterP>
      <LetterP>
        One slip is a wave, not the sea. Nothing since day zero is erased — the days stood, the urges outlasted, the reason you started:{' '}
        {/* the run inherits the paragraph's size and leading in CSS; AppText would
            hand a nested run its own variant metrics, so both are restated here.
            The canvas underlines it at 1.5px with a 4px offset — RN gives the
            line, not its metrics. */}
        <AppText
          style={[
            sans('500'),
            { fontSize: 15.5, lineHeight: 15.5 * 1.8, color: '#1D1C1A', textDecorationLine: 'underline', textDecorationColor: 'rgba(0,0,0,0.28)' },
          ]}>
          {why}
        </AppText>
        . All still yours.
      </LetterP>
      <LetterP>The only slip that can end this is the one you answer with a second. So: water, daylight, one lesson. Don&rsquo;t fail twice.</LetterP>
      <LetterP>I&rsquo;ll see you tonight, steadier.</LetterP>
      <Signoff>— the you who makes it out</Signoff>
    </>
  );
}

/** 111 · the letter he sealed on night zero, read back from week XII. */
function Week12Letter({ name, onKeep }: { name: string; onKeep: () => void }) {
  return (
    <>
      <Salutation fontSize={18} letterSpacing={-0.1} gap={22}>
        {name} —
      </Salutation>
      <LetterP gap={20}>It&rsquo;s week XII where I&rsquo;m writing from, and the first thing to say is: we made it out.</LetterP>
      {/* the canvas pairs 16 below this paragraph with 36 above the scene; CSS
          collapses them to 36 and Yoga would add them to 52, so 36 is the gap */}
      <LetterP gap={36}>
        The first three weekends were the worst of it, so I&rsquo;ll say it plainly: nothing you feel this month lasts longer than a night. You wait one
        out, and the next one comes back smaller.
      </LetterP>
      <Week12Scene />
      <LetterP gap={20}>
        The late nights stopped being dangerous around week IV. The urges got shorter, then quieter, then rare — somewhere in week IX I stopped bracing for
        them.
      </LetterP>
      <LetterP gap={0}>Everything you circled tonight — it&rsquo;s here, waiting.</LetterP>
      <Signoff gap={26}>— {name}, at week XII</Signoff>
      {/* this letter scrolls its pill with the words rather than pinning it, so
          it is the body's last child and takes the body's own 325 width */}
      <KeepPill label="Tuck it into your Log" onPress={onKeep} style={{ marginTop: 56, marginBottom: 6 }} />
    </>
  );
}

/**
 * The picture pressed into the middle of the week-XII letter: the walk out,
 * three ridges deep, sun up, one signpost passed. The canvas builds it from
 * fifteen absolutely-positioned divs inside a 240 × 186 window that clips them;
 * three of those are ellipse-cornered hills and two are blurred, none of which
 * survives as a View — so it is redrawn as one clipped SVG at the same numbers.
 */
function Week12Scene() {
  /** A hill: an elliptical crown of `ry` over a body that runs off the bottom. */
  const hill = (x: number, w: number, y: number, ry: number) =>
    `M${x} ${y + ry} A${w / 2} ${ry} 0 0 1 ${x + w} ${y + ry} L${x + w} ${y + 100} L${x} ${y + 100} Z`;

  return (
    // 40 below the scene on the canvas; the 36 above it is the paragraph's gap
    <Svg width={240} height={186} viewBox="0 0 240 186" style={{ alignSelf: 'center', marginBottom: 40 }}>
      <Defs>
        <RadialGradient id="w12-sun" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor="#E2BA78" stopOpacity={0.38} />
          <Stop offset="0.74" stopColor="#E2BA78" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient id="w12-cast" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor="#000000" stopOpacity={0.1} />
          <Stop offset="0.62" stopColor="#000000" stopOpacity={0.05} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* the light behind the sun — the canvas blurs it 4px */}
      <Ellipse cx={184} cy={60} rx={56} ry={56} fill="url(#w12-sun)" />
      <Circle cx={179} cy={49} r={17} fill="#E9D2A4" />
      <Circle cx={15} cy={25} r={1} fill="rgba(200,225,235,0.4)" />
      <Circle cx={45} cy={53} r={1} fill="rgba(200,225,235,0.3)" />

      <Path d={hill(-40, 320, 100, 48)} fill="#DEDDD6" />
      <Path d={hill(-90, 360, 126, 42)} fill="#CFCEC7" />
      <Path d={hill(-30, 370, 148, 36)} fill="#C5C4BD" />

      <Rect x={34} y={150} width={13} height={4} rx={2} fill="rgba(255,255,255,0.55)" transform="rotate(14 40.5 152)" />
      <Rect x={58} y={136} width={13} height={4} rx={2} fill="rgba(255,255,255,0.55)" transform="rotate(10 64.5 138)" />
      <Rect x={84} y={124} width={13} height={4} rx={2} fill="rgba(255,255,255,0.55)" transform="rotate(6 90.5 126)" />

      {/* the signpost, and the man reading it */}
      <Rect x={139} y={56} width={3} height={46} rx={1.5} fill="#C6C5C0" />
      <Path d="M143 57 L154 57 A3 3 0 0 1 157 60 L157 64 A3 3 0 0 1 154 67 L143 67 A1 1 0 0 1 142 66 L142 58 A1 1 0 0 1 143 57 Z" fill="#E9D2A4" />
      <Circle cx={117.5} cy={69.5} r={5.5} fill="#B4B1AB" />
      <Rect x={110} y={77} width={15} height={27} rx={7} fill="#C6C5C0" />
      <Ellipse cx={122} cy={105} rx={22} ry={5} fill="url(#w12-cast)" />
    </Svg>
  );
}
