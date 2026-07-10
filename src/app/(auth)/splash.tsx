import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { AK, AuthBtn, AuthGhostLink, AuthSurface } from '@/components/auth/kit';
import { AppText, Laurel } from '@/components/ui';
import { fonts } from '@/lib/theme';

// ── Splash — the route-decider (canvas: auth-splash). The app opens on
// ink: the dawn artwork, the laurel, VICI, and the promise. ──
export default function Splash() {
  const router = useRouter();
  return (
    <>
      <StatusBar style="light" />
      <AuthSurface brand={false} dawn>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ marginBottom: 24 }}>
            <Laurel size={46} color="#F5F4F1" />
          </View>
          <AppText style={{ fontFamily: fonts.serif, fontSize: 21, letterSpacing: 7.1, color: AK.ink, marginBottom: 22 }}>VICI</AppText>
          <AppText center style={{ fontFamily: fonts.serif, fontSize: 38, lineHeight: 44, letterSpacing: -0.38, color: AK.ink }}>
            You came.{'\n'}You saw.{'\n'}Now conquer it.
          </AppText>
        </View>
        <View style={{ gap: 12 }}>
          <AuthBtn variant="light" label="Get started" onPress={() => router.push('/(auth)/sign-up')} />
          <AuthGhostLink pre="" strong="I already have an account" onPress={() => router.push('/(auth)/sign-in')} />
        </View>
      </AuthSurface>
    </>
  );
}
