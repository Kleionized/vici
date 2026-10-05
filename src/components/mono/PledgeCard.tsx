import type { ReactNode } from 'react';
import { Platform, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { lhNormal, mono, monoDark, sans, sansItalic } from '@/lib/theme';

import { Quote } from './icons';
import { Tap } from './Tap';
import { MonoText } from './Text';

const T = (s: TextStyle): TextStyle => s;

/**
 * The pledge as the frames draw it, in its three settings:
 *
 * * `sign` — the signing card (Morning Resign Pledge / Pledge Signed, Slip
 *   Pledge, Relapse Resign): `r24 #1E1E1E padding 24 24 20`, column gap 22 —
 *   caps "Your pledge", the pledge 24/700/33/−0.4, and the signature line:
 *   `padding-top 12; height 44; padding-bottom 8; align-items:flex-end` over a
 *   1.5 rule. Unsigned, the rule is **dashed `#5A574F`** under "Sign here"
 *   15/400 mute; signed, it is **solid ink** under the name in Lato 700 italic
 *   28 (`sansItalic()`).
 * * `quote` — the read-back card (Your Vow Page light, Urge Hub Pledges dark):
 *   a centred quote mark, the pledge, the name in italic below (24 / 22).
 * * `plain` — no card (Today Home III): caps, then the pledge 22/700/31/−0.3
 *   and the name in italic 16 mute, gap 10; `children` follow in the same
 *   column (the screen's own buttons).
 */
export function PledgeCard({
  variant = 'sign',
  pledge,
  name,
  signed = false,
  label = 'Your pledge',
  placeholder = 'Sign here',
  tone = 'light',
  onPressLine,
  children,
  style,
}: {
  variant?: 'sign' | 'quote' | 'plain';
  pledge: string;
  /** the signer, shown once signed (`sign`) or always (`quote`, `plain`) */
  name?: string;
  signed?: boolean;
  label?: string;
  placeholder?: string;
  /** `quote` only: `dark` is the Urge Hub card */
  tone?: 'light' | 'dark';
  /** make the signature line itself a control (e.g. sign on tap) */
  onPressLine?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  if (variant === 'quote') {
    const dark = tone === 'dark';
    return (
      <View
        style={[
          { borderRadius: 24, backgroundColor: mono.card },
          dark ? { paddingTop: 26, paddingHorizontal: 28, paddingBottom: 30 } : { paddingTop: 26, paddingHorizontal: 26, paddingBottom: 24 },
          style,
        ]}>
        <View style={[{ alignItems: 'center', gap: dark ? 18 : 16 }, dark ? { paddingVertical: 8 } : null]}>
          <Quote color={dark ? monoDark.faint : mono.line} />
          <Text
            maxFontSizeMultiplier={1.3}
            style={T(
              dark
                ? { ...sans('700'), fontSize: 26, lineHeight: 35, letterSpacing: -0.5, color: monoDark.text, textAlign: 'center' }
                : { ...sans('700'), fontSize: 23, lineHeight: 32, letterSpacing: -0.4, color: mono.ink, textAlign: 'center' },
            )}>
            {pledge}
          </Text>
          {name ? (
            <Text
              maxFontSizeMultiplier={1.3}
              style={T({
                ...sansItalic(),
                fontSize: dark ? 22 : 24,
                lineHeight: lhNormal(dark ? 22 : 24),
                color: dark ? monoDark.body : mono.ink,
                textAlign: 'center',
              })}>
              {name}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  if (variant === 'plain') {
    return (
      <View style={[{ gap: 10 }, style]}>
        <MonoText v="caps" style={{ lineHeight: 16 }}>
          {label}
        </MonoText>
        <Text maxFontSizeMultiplier={1.3} style={T({ ...sans('700'), fontSize: 22, lineHeight: 31, letterSpacing: -0.3, color: mono.ink })}>
          {pledge}
        </Text>
        {name ? (
          <Text maxFontSizeMultiplier={1.3} style={T({ ...sansItalic(), fontSize: 16, lineHeight: lhNormal(16), color: mono.mute })}>
            {name}
          </Text>
        ) : null}
        {children}
      </View>
    );
  }

  const done = signed && !!name;
  const line = <SignatureLine signed={done} text={done ? (name as string) : placeholder} />;
  return (
    <View style={[{ borderRadius: 24, backgroundColor: mono.card, paddingTop: 24, paddingHorizontal: 24, paddingBottom: 20 }, style]}>
      <View style={{ gap: 22 }}>
        <MonoText v="caps">{label}</MonoText>
        <Text maxFontSizeMultiplier={1.3} style={T({ ...sans('700'), fontSize: 24, lineHeight: 33, letterSpacing: -0.4, color: mono.ink })}>
          {pledge}
        </Text>
        {onPressLine ? (
          <Tap label={done ? `Signed by ${name}` : placeholder} onPress={onPressLine}>
            {line}
          </Tap>
        ) : (
          line
        )}
        {children}
      </View>
    </View>
  );
}

/**
 * The signature line. Its 44pt content box sits inside 12 above and 8 below,
 * so the rule is the box's own bottom border — on the web build a CSS border,
 * which Chrome dashes exactly as it dashed the frame's (3 on, 2 off, fitted to
 * the width) and snaps to the same 1pt the frame shows. Native cannot dash one
 * side of a box, so there the dashed rule is an SVG line in the same rhythm.
 */
function SignatureLine({ signed, text }: { signed: boolean; text: string }) {
  const svgDash = !signed && Platform.OS !== 'web';
  return (
    <View
      style={[
        { paddingTop: 12, paddingBottom: 8 },
        svgDash
          ? { paddingBottom: 9.5 }
          : { borderBottomWidth: 1.5, borderBottomColor: signed ? mono.ink : mono.art, borderStyle: signed ? 'solid' : 'dashed' },
      ]}>
      <View style={{ height: 44, flexDirection: 'row', alignItems: 'flex-end' }}>
        {/* no numberOfLines: its overflow clip would shave the italic's overhang (the J's tail, the y's) */}
        <Text
          maxFontSizeMultiplier={1.3}
          style={T(
            signed
              ? { ...sansItalic(), fontSize: 28, lineHeight: lhNormal(28), color: mono.ink }
              : { ...sans('400'), fontSize: 15, lineHeight: lhNormal(15), color: mono.mute },
          )}>
          {text}
        </Text>
      </View>
      {svgDash ? (
        <Svg width="100%" height={1.5} style={{ position: 'absolute', left: 0, bottom: 0 }}>
          <Line x1={0} y1={0.75} x2="100%" y2={0.75} stroke={mono.art} strokeWidth={1.5} strokeDasharray="3 2" />
        </Svg>
      ) : null}
    </View>
  );
}
