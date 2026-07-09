/**
 * Auth kit — the design bundle's `screens-auth.jsx` login treatment, shared by
 * sign-in and sign-up: the Stage atmosphere (Aura + dot field), a floating
 * tide hero with a soft glow (no framed card), and the Flo-style provider
 * button stack (Apple · Google · email) with a left-anchored mark and a
 * centred label.
 */

import { type ReactNode, useId } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { AppText } from '@/components/ui';
import { Aura, FadeRise, TideScene, tint } from '@/components/onboarding/art';
import { colors } from '@/lib/theme';

export const AUTH_HUE = 208;

// ── full-bleed shell with the atmosphere ─────────────────────────────────────
export function AuthStage({ children }: { children: ReactNode }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Aura hue={AUTH_HUE} intensity={1} dots />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, paddingHorizontal: 26, paddingTop: 10, paddingBottom: 30 }}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

export const Wordmark = () => (
  <AppText weightOverride="700" color={colors.text} style={{ fontSize: 19, letterSpacing: -0.76 }}>
    tideline
  </AppText>
);

// ── the calm credibility hero — floating tide, soft glow, no card ────────────
export function AuthHero({ title, lead }: { title: string; lead: string }) {
  const gid = `ah-${useId().replace(/:/g, '')}`;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <FadeRise style={{ width: '100%', height: 210, alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
          <Svg width="78%" height="82%">
            <Defs>
              <RadialGradient id={gid} cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor={tint(AUTH_HUE, 0.8, 0.1)} stopOpacity={0.16} />
                <Stop offset="70%" stopColor={tint(AUTH_HUE, 0.8, 0.1)} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#${gid})`} />
          </Svg>
        </View>
        <TideScene hue={AUTH_HUE} w={234} h={150} />
      </FadeRise>
      <AppText center weightOverride="700" color={colors.text} style={{ fontSize: 38, lineHeight: 40, letterSpacing: -1.06 }}>
        {title}
      </AppText>
      <AppText center weightOverride="500" color={colors.textMuted} style={{ fontSize: 17, lineHeight: 25, marginTop: 13, maxWidth: 290 }}>
        {lead}
      </AppText>
    </View>
  );
}

// ── provider marks ───────────────────────────────────────────────────────────
export const AppleMark = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill={color}>
    <Path d="M17.05 12.5c0-2.1 1.7-3.1 1.8-3.16-1-1.45-2.5-1.65-3.05-1.67-1.3-.13-2.53.76-3.19.76-.65 0-1.67-.74-2.74-.72-1.41.02-2.71.82-3.43 2.08-1.46 2.54-.37 6.3 1.05 8.36.69 1.01 1.51 2.14 2.59 2.1 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.61.67 2.71.65 1.12-.02 1.83-1.03 2.51-2.04.79-1.17 1.12-2.3 1.13-2.36-.02-.01-2.17-.83-2.19-3.29zM15.1 6.2c.57-.69.95-1.65.85-2.6-.82.03-1.81.54-2.4 1.23-.52.6-.98 1.58-.86 2.5.91.07 1.84-.46 2.41-1.13z" />
  </Svg>
);

export const GoogleMark = () => (
  <Svg width={20} height={20} viewBox="0 0 48 48">
    <Path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <Path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <Path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <Path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.2C41.4 35.7 44 30.3 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </Svg>
);

export const MailMark = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect x={3} y={5} width={18} height={14} rx={3} stroke={color} strokeWidth={1.8} />
    <Path d="M4.5 7.5l7.5 5.5 7.5-5.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── one provider button: left-anchored mark, centred label ───────────────────
export function AuthBtn({ mark, label, variant = 'neutral', onPress, loading }: { mark: ReactNode; label: string; variant?: 'dark' | 'neutral'; onPress: () => void; loading?: boolean }) {
  const dark = variant === 'dark';
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: dark ? colors.accent : colors.surface,
        borderWidth: dark ? 0 : 1.5,
        borderColor: colors.border,
        borderRadius: 9999,
        paddingVertical: 18,
        opacity: loading ? 0.6 : 1,
        shadowColor: dark ? '#000' : 'transparent',
        shadowOpacity: dark ? 0.18 : 0,
        shadowRadius: 11,
        shadowOffset: { width: 0, height: 8 },
      }}>
      <View style={{ position: 'absolute', left: 26 }}>{mark}</View>
      <AppText weightOverride="700" color={dark ? colors.accentText : colors.text} style={{ fontSize: 17, letterSpacing: -0.2 }}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function LegalLine() {
  return (
    <AppText center weightOverride="500" color={colors.textSoft} style={{ fontSize: 12, lineHeight: 18, marginTop: 4, marginHorizontal: 14 }}>
      By continuing you agree to our <AppText weightOverride="500" color={colors.textMuted} style={{ fontSize: 12 }}>Terms</AppText> and{' '}
      <AppText weightOverride="500" color={colors.textMuted} style={{ fontSize: 12 }}>Privacy Policy</AppText>.
    </AppText>
  );
}
