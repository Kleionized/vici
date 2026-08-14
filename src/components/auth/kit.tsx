/**
 * Auth kit — the paper pieces the three auth boards share.
 *
 * Every board (03 Login, 04 Login typing, 05 Create account, 102 Save your
 * progress) is the same warm field with two soft washes bled off the edges, a
 * quiet Back row, and flat white controls. The canvas frame is 393 × 852 and
 * its status bar ends at 54, so every design y quoted below is already the
 * offset under the safe area.
 */

import { useState, type ReactNode } from 'react';
import { Platform, ScrollView, TextInput, View, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { PressScale } from '@/components/ui/press-scale';
import { colors, sans, spacing } from '@/lib/theme';

// ── provider marks, copied from the canvas ───────────────────────────
export const AppleMark = ({ color }: { color: string }) => (
  <Svg width={15} height={18} viewBox="0 0 384 512">
    <Path
      fill={color}
      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.9-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
    />
  </Svg>
);

export const GoogleMark = () => (
  <Svg width={17} height={17} viewBox="0 0 48 48">
    <Path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </Svg>
);

/**
 * 03/04 · the login mark: a letter half out of its envelope, lit from behind.
 *
 * Drawn rather than shipped as an asset because the canvas draws it — a
 * rotated tile behind the page, the page itself with three ruled lines and a
 * signature squiggle, then the envelope front with its two folds and a wax
 * seal. The whole thing sits on a 200 × 170 block.
 */
export function EnvelopeMark() {
  return (
    <View style={{ width: 200, height: 170 }}>
      {/* the warm bloom behind it — the canvas blurs a closest-side radial by
          4px, and a closest-side radial already dies at its own edge, so the
          ellipse alone stands in for the filter */}
      <Svg width={140} height={140} style={{ position: 'absolute', left: 30, top: 0 }}>
        <Defs>
          <RadialGradient id="env-glow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#E2BA78" stopOpacity={0.4} />
            <Stop offset="74%" stopColor="#E2BA78" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={70} cy={70} r={70} fill="url(#env-glow)" />
      </Svg>

      {/* the ground shadow — the canvas blurs a flat rgba(0,0,0,0.10) ellipse
          by 4px, which RN SVG cannot do, so it is redrawn as the same ellipse
          with a radial falloff to nothing at its edge */}
      <Svg width={120} height={12} style={{ position: 'absolute', left: 40, top: 152 }}>
        <Defs>
          <RadialGradient id="env-shadow" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#000000" stopOpacity={0.14} />
            <Stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx={60} cy={6} rx={60} ry={6} fill="url(#env-shadow)" />
      </Svg>

      {/* a tile turned on its corner, just to break the silhouette */}
      <View style={{ position: 'absolute', left: 64, top: 40, width: 72, height: 72, borderRadius: 10, backgroundColor: '#E3E1DA', transform: [{ rotate: '45deg' }] }} />

      {/* the letter */}
      <View style={{ position: 'absolute', left: 44, top: 22, width: 112, height: 84, borderRadius: 6, backgroundColor: '#FFFFFF', boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }} />
      <View style={{ position: 'absolute', left: 58, top: 38, width: 52, height: 5, borderRadius: 3, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 58, top: 51, width: 70, height: 5, borderRadius: 3, backgroundColor: '#E0DFDA' }} />
      <View style={{ position: 'absolute', left: 58, top: 64, width: 44, height: 5, borderRadius: 3, backgroundColor: '#E0DFDA' }} />
      <Svg width={40} height={10} viewBox="0 0 40 10" style={{ position: 'absolute', left: 102, top: 76 }}>
        <Path d="M2 6 C 10 2, 18 8, 26 5 S 36 4, 38 6" stroke="rgba(38,38,31,0.4)" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      </Svg>

      {/* the envelope front, its folds, and the seal */}
      <View style={{ position: 'absolute', left: 25, top: 76, width: 150, height: 78, borderRadius: 8, backgroundColor: '#E9E7E0', boxShadow: '0 0 0 1px rgba(0,0,0,0.05)' }} />
      <View style={{ position: 'absolute', left: 28, top: 78, width: 80, height: 4, borderRadius: 2, backgroundColor: '#DBD9D2', transform: [{ rotate: '26deg' }], transformOrigin: 'left center' }} />
      <View style={{ position: 'absolute', left: 92, top: 114, width: 80, height: 4, borderRadius: 2, backgroundColor: '#DBD9D2', transform: [{ rotate: '-26deg' }], transformOrigin: 'left center' }} />
      <View style={{ position: 'absolute', left: 89, top: 106, width: 22, height: 22, borderRadius: 11, backgroundColor: '#E9D2A4' }} />
      <View style={{ position: 'absolute', left: 95, top: 112, width: 10, height: 10, borderRadius: 5, boxShadow: 'inset 0 0 0 1.5px rgba(122,103,67,0.45)' }} />
    </View>
  );
}

/**
 * The two warm glows every auth board is grounded on.
 *
 * The canvas blurs each one by 5–8px; a `closest-side` radial already fades to
 * nothing at its own edge, so the ellipse stands in for the filter — never a
 * hard-edged shape, which would put a grey arc across the top of the screen.
 */
export function PaperAuthGlow() {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* react-native-svg lays <Svg> out static on web, and CSS paints every
          positioned box above every static one — so the washes have to be
          positioned themselves or anything added beside them would bury them */}
      <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <Defs>
          <RadialGradient id="pa-top" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#B4AA96" stopOpacity={0.4} />
            <Stop offset="55%" stopColor="#B4AA96" stopOpacity={0.12} />
            <Stop offset="75%" stopColor="#B4AA96" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="pa-bottom" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#B4AA96" stopOpacity={0.22} />
            <Stop offset="72%" stopColor="#B4AA96" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        {/* the top wash is sized in percentages on the canvas (left -15%, width
            130%), the bottom one in points (left -60, top 620) — so one stays
            proportional and the other keeps its literal offset */}
        <Ellipse cx="50%" cy={-40} rx="65%" ry={150} fill="url(#pa-top)" />
        <Ellipse cx={150} cy={750} rx={210} ry={130} fill="url(#pa-bottom)" />
      </Svg>
    </View>
  );
}

/** The Back row every inner auth board opens with — design y 64, 20 tall. */
export function PaperAuthBack({ onPress }: { onPress: () => void }) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={{ top: 12, bottom: 12, left: 16, right: 24 }}
      style={{ alignSelf: 'flex-start', height: 40, minHeight: 0, marginLeft: 16, paddingRight: 12, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
      <Svg width={11} height={19} viewBox="0 0 11 19" fill="none">
        <Path d="M9.5 1.5L2 9.5l7.5 8" stroke="#55534E" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <AppText style={[sans('400'), { fontSize: 17, color: '#55534E' }]}>Back</AppText>
    </PressScale>
  );
}

/**
 * Paper auth shell: the field, the Back row, and a scroller for the form. The
 * Back row is 40 tall so content below it starts at design y 94, which is what
 * each board's own paddingTop is measured from.
 *
 * The washes are opt-in. Across two bundle generations the canvas has given
 * them to Login (055/056) and withheld them from Create Account (057) and Save
 * Progress (113), which draw a flat #F4F3F0 with no gradient in the frame at
 * all — so a shell that painted them unconditionally put a warm band across the
 * top of two boards that the canvas leaves clean.
 */
export function PaperAuthSurface({ children, onBack, glow = false }: { children: ReactNode; onBack?: () => void; glow?: boolean }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {glow ? <PaperAuthGlow /> : null}
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        {onBack ? <PaperAuthBack onPress={onBack} /> : <View style={{ height: 40 }} />}
        <ScrollView
          // the SafeAreaView above already spends the insets; `automatic` would
          // spend them a second time and push every canvas offset down
          contentInsetAdjustmentBehavior="never"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.lg }}>
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/**
 * A labelled paper field — design y 205/231 on the create-account board: the
 * label sits 8 above a 54-tall white box with a hairline ring, and focus swaps
 * that ring for the 2pt ink edge without changing the box, so nothing below it
 * moves while you type.
 */
export function PaperAuthField({
  label,
  value,
  onChangeText,
  placeholder,
  ...props
}: Pick<TextInputProps, 'secureTextEntry' | 'keyboardType' | 'autoCapitalize' | 'autoComplete' | 'textContentType' | 'returnKeyType' | 'onSubmitEditing'> & {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      {label ? <AppText style={[sans('400'), { fontSize: 15, color: colors.textTitle, paddingLeft: 1 }]}>{label}</AppText> : null}
      <TextInput
        {...props}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(90,88,82,0.5)"
        selectionColor={colors.ink}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          sans('400'),
          {
            height: 54,
            paddingHorizontal: 17,
            paddingVertical: 0,
            borderRadius: 12,
            backgroundColor: colors.surface,
            color: colors.text,
            fontSize: 19,
            boxShadow: focused ? '0 0 0 2px rgba(0,0,0,0.24)' : '0 0 0 1px rgba(0,0,0,0.09)',
          },
          Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null,
        ]}
      />
    </View>
  );
}

/** The primary pill: 58 tall, radius 29, solid ink — design y 483 / 592. */
export function PaperAuthButton({
  label,
  onPress,
  disabled,
  secondary = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
}) {
  return (
    <PressScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={{
        height: 58,
        borderRadius: 29,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: secondary ? colors.surface : colors.ink,
        opacity: disabled ? 0.38 : 1,
        ...(secondary ? { boxShadow: '0 0 0 1px rgba(0,0,0,0.12)' } : null),
      }}>
      {/* the canvas puts a flat #FFFFFF on the pill, not the paper-white ink text */}
      <AppText style={[sans('600'), { fontSize: 17, letterSpacing: 0.2, color: secondary ? colors.text : '#FFFFFF' }]}>{label}</AppText>
    </PressScale>
  );
}

/** The small print under the last control. 11 on the form, 12 on the gate. */
export function PaperAuthLegal({ size = 11 }: { size?: number }) {
  return (
    <AppText center style={[sans('400'), { fontSize: size, color: colors.textSoft }]}>
      By continuing, you agree to our <AppText style={[sans('400'), { fontSize: size, color: colors.textSoft, textDecorationLine: 'underline' }]}>terms of service</AppText> and{' '}
      <AppText style={[sans('400'), { fontSize: size, color: colors.textSoft, textDecorationLine: 'underline' }]}>privacy policy</AppText>.
    </AppText>
  );
}
