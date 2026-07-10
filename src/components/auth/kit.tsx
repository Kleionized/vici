/**
 * Auth kit — the design bundle's `screens-auth.jsx`, black-dominant: a
 * self-contained INK surface (near-black, moonlit, over the supplied
 * auth-dawn artwork) that the app opens on before it "breaks to paper"
 * inside. Splash · Sign in · Sign up all build from these pieces.
 */

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { type ReactNode } from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, G, LinearGradient as SvgLinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { colors, fonts, sans } from '@/lib/theme';

// ── local ink palette (self-contained; independent of the paper theme) ─
export const AK = {
  bg0: '#07080A',
  bg1: '#0C0E12',
  bg2: '#14171D',
  ink: '#F0EFEA',
  ink2: '#A7A8A1',
  ink3: '#6E6F69',
  hair: 'rgba(255,255,255,0.14)',
  fieldBg: 'rgba(255,255,255,0.045)',
  fieldEdge: 'rgba(255,255,255,0.12)',
  foam: '#D7DEE6',
  moon: '#F2ECD8',
  moonEdge: '#DCD3B4',
  star: '#C9CCC4',
};

// ── provider marks ───────────────────────────────────────────────────
export const AppleMark = ({ color }: { color: string }) => (
  <Svg width={19} height={19} viewBox="0 0 24 24" fill={color}>
    <Path d="M17.05 12.5c0-2.1 1.7-3.1 1.8-3.16-1-1.45-2.5-1.65-3.05-1.67-1.3-.13-2.53.76-3.19.76-.65 0-1.67-.74-2.74-.72-1.41.02-2.71.82-3.43 2.08-1.46 2.54-.37 6.3 1.05 8.36.69 1.01 1.51 2.14 2.59 2.1 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.61.67 2.71.65 1.12-.02 1.83-1.03 2.51-2.04.79-1.17 1.12-2.3 1.13-2.36-.02-.01-2.17-.83-2.19-3.29zM15.1 6.2c.57-.69.95-1.65.85-2.6-.82.03-1.81.54-2.4 1.23-.52.6-.98 1.58-.86 2.5.91.07 1.84-.46 2.41-1.13z" />
  </Svg>
);

export const GoogleMark = () => (
  <Svg width={19} height={19} viewBox="0 0 48 48">
    <Path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <Path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <Path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <Path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.2C41.4 35.7 44 30.3 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </Svg>
);

export const MailMark = ({ color }: { color: string }) => (
  <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={5} width={18} height={14} rx={3} stroke={color} strokeWidth={1.7} />
    <Path d="M4.5 7.5l7.5 5.5 7.5-5.5" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── the black-dominant hero: one moonlit sea, moonglade, a small boat ──
export function NightTide({ w = 236, h = 188 }: { w?: number; h?: number }) {
  const stars: [number, number, number][] = [[26, 30, 1.3], [52, 18, 1], [186, 26, 1.4], [210, 46, 1], [150, 20, 0.9], [86, 24, 0.8]];
  return (
    <Svg width={w} height={h} viewBox="0 0 236 188" fill="none">
      <Defs>
        <RadialGradient id="nt-glow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#EEE6CE" stopOpacity={0.34} />
          <Stop offset="55%" stopColor="#EEE6CE" stopOpacity={0.09} />
          <Stop offset="100%" stopColor="#EEE6CE" stopOpacity={0} />
        </RadialGradient>
        <SvgLinearGradient id="nt-sea" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#161B22" />
          <Stop offset="100%" stopColor="#080B0F" />
        </SvgLinearGradient>
        <SvgLinearGradient id="nt-glade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={AK.foam} stopOpacity={0.5} />
          <Stop offset="100%" stopColor={AK.foam} stopOpacity={0.03} />
        </SvgLinearGradient>
      </Defs>

      <Circle cx={118} cy={50} r={70} fill="url(#nt-glow)" />
      {stars.map(([x, y, r], i) => (
        <Circle key={i} cx={x} cy={y} r={r} fill={AK.star} />
      ))}
      <G>
        <Circle cx={118} cy={50} r={24} fill={AK.moon} stroke={AK.moonEdge} strokeWidth={1.4} />
        <Circle cx={109} cy={45} r={4} fill="#E4DBBF" opacity={0.7} />
        <Circle cx={124} cy={56} r={2.8} fill="#E4DBBF" opacity={0.6} />
        <Circle cx={126} cy={42} r={2} fill="#E4DBBF" opacity={0.5} />
      </G>

      <Path d="M-6 112 C 60 109.6, 176 109.6, 242 112 L242 194 L-6 194 Z" fill="url(#nt-sea)" />
      <Path d="M-6 112 C 60 109.6, 176 109.6, 242 112" stroke={AK.foam} strokeWidth={1.4} strokeLinecap="round" opacity={0.45} />

      <Path d="M111 112.5 L125 112.5 L138 186 L98 186 Z" fill="url(#nt-glade)" />
      <G stroke={AK.foam} strokeLinecap="round">
        <Path d="M113 121 h10" strokeWidth={1.5} opacity={0.7} />
        <Path d="M110 133 h15" strokeWidth={1.7} opacity={0.55} />
        <Path d="M112 148 h17" strokeWidth={1.9} opacity={0.42} />
        <Path d="M108 165 h21" strokeWidth={2.1} opacity={0.3} />
      </G>

      <G stroke={AK.foam} strokeLinecap="round" fill="none">
        <Path d="M28 130 q 10 -3 20 0" strokeWidth={1.4} opacity={0.2} />
        <Path d="M170 127 q 11 -3 22 0" strokeWidth={1.4} opacity={0.2} />
        <Path d="M46 158 q 12 -3.5 24 0" strokeWidth={1.6} opacity={0.14} />
        <Path d="M166 155 q 12 -3.5 24 0" strokeWidth={1.6} opacity={0.14} />
      </G>

      <G transform="translate(118 118)">
        <Path d="M0 6 L0 -25" stroke={AK.foam} strokeWidth={1.5} strokeLinecap="round" opacity={0.8} />
        <Path d="M2 -23 C 12 -15 15 -4 15 5 L2 5 Z" fill="#171C23" stroke={AK.foam} strokeWidth={1.1} strokeOpacity={0.75} strokeLinejoin="round" />
        <Path d="M-2 -18 C -10 -11 -12 -2 -12 5 L-2 5 Z" fill="#151A20" stroke={AK.foam} strokeWidth={1.1} strokeOpacity={0.55} strokeLinejoin="round" />
        <Path d="M-16 6 C -9 10.5 10 10.5 18 6 L15 11 C 7 13.8 -7 13.8 -12 11 Z" fill="#10141A" stroke={AK.foam} strokeWidth={1.1} strokeOpacity={0.75} strokeLinejoin="round" />
        <Path d="M-30 13 q 8 -2.5 16 0 M14 13.5 q 8 -2.5 16 0" stroke={AK.foam} strokeWidth={1.5} strokeLinecap="round" opacity={0.45} />
      </G>
    </Svg>
  );
}

// ── the shared ink surface: near-black moonlit ground + optional close ─
export function AuthSurface({
  children,
  onClose,
  brand = true,
  dawn = false,
}: {
  children: ReactNode;
  onClose?: () => void;
  brand?: boolean;
  dawn?: boolean;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: AK.bg0 }}>
      <LinearGradient
        colors={[AK.bg2, AK.bg1, AK.bg0]}
        locations={[0, 0.42, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      {dawn ? (
        <>
          <Image
            source={require('../../../assets/images/auth-dawn.png')}
            contentFit="cover"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <LinearGradient
            colors={['rgba(8,8,9,0.62)', 'rgba(8,8,9,0.34)', 'rgba(8,8,9,0.4)', 'rgba(8,8,9,0.8)']}
            locations={[0, 0.4, 0.74, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        </>
      ) : null}
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, paddingHorizontal: 29, paddingTop: 14, paddingBottom: 20 }}>
          {(brand || onClose) && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: brand ? 'space-between' : 'flex-end', marginBottom: 2 }}>
              {brand ? (
                <AppText style={{ fontFamily: fonts.serif, fontSize: 17, letterSpacing: 5.1, color: AK.ink }}>VICI</AppText>
              ) : null}
              {onClose ? (
                <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="Close" style={{ padding: 4, marginRight: -4 }}>
                  <Svg width={19} height={19} viewBox="0 0 20 20">
                    <Path d="M3 3l14 14M17 3L3 17" stroke={AK.ink3} strokeWidth={2.3} strokeLinecap="round" />
                  </Svg>
                </Pressable>
              ) : null}
            </View>
          )}
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── one provider / action button on the ink surface ──────────────────
export function AuthBtn({
  mark,
  label,
  variant = 'ghost',
  onPress,
  loading,
}: {
  mark?: ReactNode;
  label: string;
  variant?: 'light' | 'ghost';
  onPress: () => void;
  loading?: boolean;
}) {
  const light = variant === 'light';
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      style={({ pressed }) => ({
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: light ? AK.ink : 'transparent',
        borderWidth: light ? 0 : 1.5,
        borderColor: AK.hair,
        borderRadius: 9999,
        paddingVertical: 17,
        opacity: loading ? 0.6 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}>
      {mark ? <View style={{ position: 'absolute', left: 24 }}>{mark}</View> : null}
      <AppText style={[sans('600'), { fontSize: 15.5, letterSpacing: -0.19, color: light ? AK.bg0 : AK.ink }]}>{label}</AppText>
    </Pressable>
  );
}

// ── a dark, letterpressed input field ────────────────────────────────
export function AuthField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
}) {
  return (
    <View
      style={{
        backgroundColor: AK.fieldBg,
        borderRadius: 15,
        paddingHorizontal: 17,
        paddingVertical: 13,
        borderWidth: 1.5,
        borderColor: AK.fieldEdge,
      }}>
      <AppText style={[sans('600'), { fontSize: 10.5, letterSpacing: 1.26, textTransform: 'uppercase', color: AK.ink3, marginBottom: 4 }]}>
        {label}
      </AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={AK.ink3}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={{
          fontFamily: fonts.sansMedium,
          fontSize: 16.5,
          color: AK.ink,
          padding: 0,
          ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : null),
        }}
      />
    </View>
  );
}

export function AuthLegal() {
  return (
    <AppText center style={[sans('500'), { fontSize: 11.5, lineHeight: 18, color: AK.ink3, marginTop: 2, marginHorizontal: 12 }]}>
      By continuing you agree to our <AppText style={[sans('500'), { fontSize: 11.5, color: AK.ink2 }]}>Terms</AppText> and{' '}
      <AppText style={[sans('500'), { fontSize: 11.5, color: AK.ink2 }]}>Privacy Policy</AppText>.
    </AppText>
  );
}

export function AuthGhostLink({ pre, strong, onPress }: { pre: string; strong: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center', paddingVertical: 6 }}>
      <AppText style={[sans('500'), { fontSize: 14.5, color: AK.ink3 }]}>
        {pre} <AppText style={[sans('600'), { fontSize: 14.5, color: AK.ink }]}>{strong}</AppText>
      </AppText>
    </Pressable>
  );
}

/** Errors/notices on the ink ground. */
export function AuthNote({ children, danger }: { children: ReactNode; danger?: boolean }) {
  return (
    <AppText center style={[sans('500'), { fontSize: 13, lineHeight: 19, color: danger ? '#D9927E' : AK.ink2 }]}>
      {children}
    </AppText>
  );
}

export { colors as paper };
